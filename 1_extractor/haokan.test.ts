import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.83.0/testing/asserts.ts";
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
          "https://haokan.baidu.com/v?vid=18344503110611384639&tab=recommend",
        expect: {
          "name": "妈妈咪呀：妈妈带可爱女儿登台，能说会道让金星汗颜",
          "url":
            "https://haokan.baidu.com/v?vid=18344503110611384639&tab=recommend",
          "streams": [
            {
              "quality": "超清",
              "url": "",
              "filename": "妈妈咪呀：妈妈带可爱女儿登台，能说会道让金星汗颜.超清.mp4",
              "size": 67848363,
            },
            {
              "quality": "高清",
              "url": "",
              "filename": "妈妈咪呀：妈妈带可爱女儿登台，能说会道让金星汗颜.高清.mp4",
              "size": 37915824,
            },
            {
              "quality": "标清",
              "url": "",
              "filename": "妈妈咪呀：妈妈带可爱女儿登台，能说会道让金星汗颜.标清.mp4",
              "size": 34661627,
            },
          ],
        },
      },
    ];

    for (const test of testcases) {
      const output = await extractor.extract(new URL(test.url));

      assertEquals(output.name, test.expect.name);
      assertEquals(output.url, test.expect.url);

      assertEquals(output.streams.length, 3);

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
