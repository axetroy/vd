import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.76.0/testing/asserts.ts";
import { download } from "../download/mod.ts";
import { IResource } from "../type.ts";
import ExtractorXVideos from "./xvideos.ts";

Deno.test({
  name: "XVideos",
  fn: async () => {
    const extractor = new ExtractorXVideos();

    const testcases: Array<{ url: string; expect: IResource }> = [
      {
        url:
          "https://www.xvideos.com/video57010397/scared_teen_stepsisters_pranked_by_stepbro_during_halloween",
        expect: {
          "name": "Scared teen stepsisters pranked by stepbro during Halloween",
          "url":
            "https://www.xvideos.com/video57010397/scared_teen_stepsisters_pranked_by_stepbro_during_halloween",
          "streams": [
            {
              "quality": "high",
              "url": "",
              "filename":
                "Scared_teen_stepsisters_pranked_by_stepbro_during_Halloween.high.mp4",
              "size": 32859382,
            },
            {
              "quality": "low",
              "url": "",
              "filename":
                "Scared_teen_stepsisters_pranked_by_stepbro_during_Halloween.low.mp4",
              "size": 13265856,
            },
          ],
        },
      },
    ];

    for (const test of testcases) {
      const output = await extractor.extract(new URL(test.url));

      assertEquals(output.name, test.expect.name);
      assertEquals(output.url, test.expect.url);

      assert(output.streams.length === 2);

      output.streams.forEach((stream, index) => {
        assertEquals(stream.filename, test.expect.streams[index].filename);
        assertEquals(stream.size, test.expect.streams[index].size);
        assertEquals(stream.quality, test.expect.streams[index].quality);
        assert(new URL(stream.url).href !== "");
      });

      // try download file
      const videoPath = await download(
        new URL(output.streams[output.streams.length - 1].url),
        "./dist",
        8,
        "Scared_teen_stepsisters_pranked_by_stepbro_during_Halloween.low.mp4",
      );

      console.log("download filepath:", videoPath);
    }
  },
});
