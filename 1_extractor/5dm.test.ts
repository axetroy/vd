import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.84.0/testing/asserts.ts";
import { download } from "../2_download/mod.ts";
import { IResource } from "../type.ts";
import Extractor5DM from "./5dm.ts";

Deno.test({
  name: "5dm",
  fn: async () => {
    const extractor = new Extractor5DM();

    const testcases: Array<{ url: string; expect: IResource }> = [
      // 禁用测试： 因为在 Github Action 中会触发 Cloudflare 的防火墙，导致无法访问
      // 这可能是因为防火墙限制了境外 IP
      // {
      //   url: "https://www.5dm.tv/bangumi/dv43066",
      //   expect: {
      //     name: "阿松 第三季【更新至第4集】",
      //     url: "https://www.5dm.tv/bangumi/dv43066",
      //     streams: [
      //       {
      //         quality: "Unknown",
      //         url: "",
      //         filename: "阿松_第三季【更新至第4集】.unknown.mp4",
      //         size: 335823033,
      //       },
      //     ],
      //   },
      // },
    ];

    for (const test of testcases) {
      const output = await extractor.extract(new URL(test.url));

      assertEquals(output.name, test.expect.name);
      assertEquals(output.url, test.expect.url);

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
