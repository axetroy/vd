import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.76.0/testing/asserts.ts";
import { download } from "../download/mod.ts";
import { IResource } from "../type.ts";
import ExtractorPornhub from "./pornhub.ts";

Deno.test({
  name: "PornHub",
  fn: async () => {
    const extractor = new ExtractorPornhub();

    const testcases: Array<{ url: string; expect: IResource }> = [
      {
        url: "https://www.pornhub.com/view_video.php?viewkey=ph5dc34284a0844",
        expect: {
          name: "Fat Assed Indian Girl Farting while she&#039;s Riding Dick",
          url: "https://www.pornhub.com/view_video.php?viewkey=ph5dc34284a0844",
          streams: [
            {
              quality: "720p",
              url: "",
              filename:
                "Fat_Assed_Indian_Girl_Farting_while_she&#039;s_Riding_Dick.720p.mp4",
              size: 4041392,
            },
            {
              quality: "480p",
              url: "",
              filename:
                "Fat_Assed_Indian_Girl_Farting_while_she&#039;s_Riding_Dick.480p.mp4",
              size: 2460625,
            },
            {
              quality: "240p",
              url: "",
              filename:
                "Fat_Assed_Indian_Girl_Farting_while_she&#039;s_Riding_Dick.240p.mp4",
              size: 1285672,
            },
          ],
        },
      },
    ];

    for (const test of testcases) {
      const output = await extractor.extract(new URL(test.url));

      assertEquals(output.name, test.expect.name);
      assertEquals(output.url, test.expect.url);

      assert(output.streams.length === 3);

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

        const stat = await Deno.stat(videoPath);

        assertEquals(stat.size, stream.size);
      }
    }
  },
});
