import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.89.0/testing/asserts.ts";
import { download } from "../2_download/mod.ts";
import { IResource } from "../type.ts";
import ExtractorXVideos from "./xvideos.ts";

Deno.test({
  name: "XVideos",
  fn: async () => {
    const extractor = new ExtractorXVideos();

    const testcases: Array<{ url: string; expect: IResource }> = [
      {
        url:
          "https://www.xvideos.com/video60145833/18709295/0/gentle_sex_with_big_tits",
        expect: {
          "name": "Gentle sex with Big Tits",
          "url":
            "https://www.xvideos.com/video60145833/18709295/0/gentle_sex_with_big_tits",
          "streams": [
            {
              "quality": "high",
              "url": "",
              "filename": "Gentle_sex_with_Big_Tits.high.mp4",
              "size": 24813153,
            },
            {
              "quality": "low",
              "url": "",
              "filename": "Gentle_sex_with_Big_Tits.low.mp4",
              "size": 9900160,
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

      let index = 0;

      for (const stream of output.streams) {
        assertEquals(stream.filename, test.expect.streams[index].filename);
        assertEquals(stream.size, test.expect.streams[index].size);
        assertEquals(stream.quality, test.expect.streams[index].quality);
        assert(new URL(stream.url).href !== "");

        index++;

        const videoPath = await download(
          new URL(stream.url),
          "./dist",
          8,
          stream.filename,
        );

        // const stat = await Deno.stat(videoPath);

        // assertEquals(stat.size, stream.size);
      }
    }
  },
});
