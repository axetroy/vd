import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { download } from "../2_download/mod.ts";
import { IResource } from "../type.ts";
import ExtractorXnxx from "./xnxx.ts";

Deno.test({
  name: "Xnxx",
  fn: async () => {
    const extractor = new ExtractorXnxx();

    const testcases: Array<{ url: string; expect: IResource }> = [
      {
        url:
          "https://www.xnxx.com/video-bykb3e9/margot_lourdet_in_naked_2014_",
        expect: {
          "name": "Margot Lourdet in Naked (2014)",
          "url":
            "https://www.xnxx.com/video-bykb3e9/margot_lourdet_in_naked_2014_",
          "streams": [
            {
              "quality": "high",
              "url": "",
              "filename": "Margot_Lourdet_in_Naked_(2014).high.mp4",
              "size": 7022555,
            },
            {
              "quality": "low",
              "url": "",
              "filename": "Margot_Lourdet_in_Naked_(2014).low.mp4",
              "size": 2840163,
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
      }
    }
  },
});
