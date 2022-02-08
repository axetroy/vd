import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { download } from "../2_download/mod.ts";
import { IResource } from "../type.ts";
import ExtractorPornhub from "./pornhub.ts";

Deno.test({
  name: "PornHub",
  fn: async () => {
    const extractor = new ExtractorPornhub();

    const testcases: Array<{ url: string; expect: IResource }> = [
      {
        url: "https://www.pornhub.com/view_video.php?viewkey=ph60be7dbe1e3dd",
        expect: {
          name:
            "Novia en pijama con culo perfecto recibe toda su leche - Sexo Real",
          url: "https://www.pornhub.com/view_video.php?viewkey=ph60be7dbe1e3dd",
          streams: [
            {
              quality: "1080p",
              url: "",
              filename:
                "Novia_en_pijama_con_culo_perfecto_recibe_toda_su_leche_-_Sexo_Real.1080p.mp4",
              size: 86910426,
            },
            {
              quality: "720p",
              url: "",
              filename:
                "Novia_en_pijama_con_culo_perfecto_recibe_toda_su_leche_-_Sexo_Real.720p.mp4",
              size: 40532825,
            },
            {
              quality: "480p",
              url: "",
              filename:
                "Novia_en_pijama_con_culo_perfecto_recibe_toda_su_leche_-_Sexo_Real.480p.mp4",
              size: 22301919,
            },
            {
              quality: "240p",
              url: "",
              filename:
                "Novia_en_pijama_con_culo_perfecto_recibe_toda_su_leche_-_Sexo_Real.240p.mp4",
              size: 12316939,
            },
          ],
        },
      },
    ];

    for (const test of testcases) {
      const output = await extractor.extract(new URL(test.url));
      assertEquals(output.name, test.expect.name);
      assertEquals(output.url, test.expect.url);

      assert(output.streams.length === 4);

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
