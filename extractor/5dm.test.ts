import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.76.0/testing/asserts.ts";
import { IResource } from "../type.ts";
import Extractor5DM from "./5dm.ts";

Deno.test({
  name: "5dm",
  fn: async () => {
    const extractor = new Extractor5DM();

    const testcases: Array<{ url: string; expect: IResource }> = [
      // 禁用测试： 因为在 Github Action 中会触发 Cloudflare 的防火墙，导致无法访问
      // {
      //   url: "https://www.5dm.tv/bangumi/dv43066",
      //   expect: {
      //     name: "阿松 第三季【更新至第4集】",
      //     url: "https://www.5dm.tv/bangumi/dv43066",
      //     streams: [
      //       {
      //         quality: "Unknown",
      //         url: "",
      //         filename: "阿松 第三季【更新至第4集】_.mp4",
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

      output.streams.forEach((stream, index) => {
        assertEquals(stream.filename, test.expect.streams[index].filename);
        assertEquals(stream.size, test.expect.streams[index].size);
        assertEquals(stream.quality, test.expect.streams[index].quality);
        assert(new URL(stream.url).href !== "");
      });
    }
  },
});
