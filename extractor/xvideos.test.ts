import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.76.0/testing/asserts.ts";
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
              "quality": "High",
              "url": "",
              "filename": "57010397_High.mp4",
              "size": 32859382,
            },
            {
              "quality": "Low",
              "url": "",
              "filename": "57010397_Low.mp4",
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

      output.streams.forEach((stream, index) => {
        assertEquals(stream.filename, test.expect.streams[index].filename);
        assertEquals(stream.size, test.expect.streams[index].size);
        assertEquals(stream.quality, test.expect.streams[index].quality);
        assert(new URL(stream.url).href !== "");
      });
    }
  },
});
