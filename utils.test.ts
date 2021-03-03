import { assertEquals } from "https://deno.land/std@0.89.0/testing/asserts.ts";
import { nameify, segmenter, sum } from "./utils.ts";

Deno.test({
  name: "sum",
  fn: () => {
    assertEquals(sum(1, 2, 3), 6);
  },
});

Deno.test({
  name: "nameify",
  fn: () => {
    assertEquals(nameify("你好, 视频"), "你好,_视频");
    assertEquals(nameify("hello videos"), "hello_videos");
  },
});

Deno.test({
  name: "segmenter",
  fn: () => {
    assertEquals(segmenter(1025, 2), [
      [0, 512],
      [513, 1025],
    ]);
    // 1024/8 = 204.8
    assertEquals(segmenter(1024, 5), [
      [0, 204],
      [205, 409],
      [410, 614],
      [615, 819],
      [820, 1024],
    ]);
    // 1024 * 1024 * 1024 = 1073741824
    // 1073741824 / 8 = 134217728
    assertEquals(segmenter(1024 * 1024 * 1024, 8), [
      [0, 134217728],
      [134217729, 268435457],
      [268435458, 402653186],
      [402653187, 536870915],
      [536870916, 671088644],
      [671088645, 805306373],
      [805306374, 939524102],
      [939524103, 1073741824],
    ]);
  },
});
