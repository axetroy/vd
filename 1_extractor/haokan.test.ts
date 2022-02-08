import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { download } from "../2_download/mod.ts";
import { IResource } from "../type.ts";
import ExtractorHaokan from "./haokan.ts";

Deno.test({
  name: "HaoKan",
  fn: async () => {
    const extractor = new ExtractorHaokan();

    const testcases: Array<{ url: string; expect: IResource }> = [
      {
        url:
          "https://haokan.baidu.com/v?vid=10655027474920475618",
        expect: {
          "name": "坏小子程建军做坏事露出马脚直接被小伙用铁盆砸",
          "url":
            "https://haokan.baidu.com/v?vid=10655027474920475618",
          "streams": [
            {
              "quality": "蓝光",
              "url": "",
              "filename": "坏小子程建军做坏事露出马脚直接被小伙用铁盆砸.蓝光.mp4",
              "size": 29145966,
            },
            {
              "quality": "超清",
              "url": "",
              "filename": "坏小子程建军做坏事露出马脚直接被小伙用铁盆砸.超清.mp4",
              "size": 15430236,
            },
            {
              "quality": "高清",
              "url": "",
              "filename": "坏小子程建军做坏事露出马脚直接被小伙用铁盆砸.高清.mp4",
              "size": 9609823,
            },
            {
              "quality": "标清",
              "url": "",
              "filename": "坏小子程建军做坏事露出马脚直接被小伙用铁盆砸.标清.mp4",
              "size": 7597130,
            },
          ],
        },
      },
    ];

    for (const test of testcases) {
      const output = await extractor.extract(new URL(test.url));

      assertEquals(output.name, test.expect.name);
      assertEquals(output.url, test.expect.url);

      assertEquals(output.streams.length, test.expect.streams.length);

      let index = 0;

      for (const stream of output.streams) {
        assertEquals(stream.filename, test.expect.streams[index].filename);
        assertEquals(stream.size, test.expect.streams[index].size);
        assertEquals(stream.quality, test.expect.streams[index].quality);
        assert(new URL(stream.url).href !== "");

        index++;

        await download(
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
