import { assertEquals } from "https://deno.land/std@0.76.0/testing/asserts.ts";
import { nameify } from "./utils.ts";

Deno.test({
  name: "nameify",
  fn: () => {
    assertEquals(nameify("你好, 视频"), "你好,_视频");
    assertEquals(nameify("hello videos"), "hello_videos");
  },
});
