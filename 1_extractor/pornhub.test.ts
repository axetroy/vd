import {
    assert,
    assertEquals
} from "https://deno.land/std@0.84.0/testing/asserts.ts";
import { download } from "../2_download/mod.ts";
import { IResource } from "../type.ts";
import ExtractorPornhub from "./pornhub.ts";

Deno.test({
  name: "PornHub",
  fn: async () => {
    const extractor = new ExtractorPornhub();

    const testcases: Array<{ url: string; expect: IResource }> = [
      {
        url: "https://pornhub.com/view_video.php?viewkey=ph5f8693950f104",
        expect: {
          name: "Cute Babe Amateur Teen has Tight Pussy for Big Dick",
          url: "https://pornhub.com/view_video.php?viewkey=ph5f8693950f104",
          streams: [
            {
              quality: "720p",
              url: "",
              filename:
                "Cute_Babe_Amateur_Teen_has_Tight_Pussy_for_Big_Dick.720p.mp4",
              size: 87963608,
            },
            {
              quality: "480p",
              url: "",
              filename:
                "Cute_Babe_Amateur_Teen_has_Tight_Pussy_for_Big_Dick.480p.mp4",
              size: 52306323,
            },
            {
              quality: "240p",
              url: "",
              filename:
                "Cute_Babe_Amateur_Teen_has_Tight_Pussy_for_Big_Dick.240p.mp4",
              size: 30372557,
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

        // const stat = await Deno.stat(videoPath);

        // assertEquals(stat.size, stream.size);
      }
    }
  },
});
