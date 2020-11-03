import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.76.0/testing/asserts.ts";
import { IResource } from "../type.ts";
import ExtractorYoutube from "./youtube.ts";

Deno.test({
  name: "Youtube",
  fn: async () => {
    const extractor = new ExtractorYoutube();

    const testcases: Array<{ url: string; expect: IResource }> = [
      {
        url: "https://www.youtube.com/watch?v=fEcnrA6RIzo",
        expect: {
          "name": "No Damage Escape From Steve With Knife Bug !?",
          "url": "https://www.youtube.com/watch?v=fEcnrA6RIzo",
          "streams": [
            {
              "filename": "fEcnrA6RIzo_480p.mp4",
              "size": 748691,
              "quality": "480p",
              "url": "",
            },
            {
              "filename": "fEcnrA6RIzo_480p.webm",
              "size": 594233,
              "quality": "480p",
              "url": "",
            },
            {
              "filename": "fEcnrA6RIzo_360p.mp4",
              "size": 355210,
              "quality": "360p",
              "url": "",
            },
            {
              "filename": "fEcnrA6RIzo_240p.mp4",
              "size": 329245,
              "quality": "240p",
              "url": "",
            },
            {
              "filename": "fEcnrA6RIzo_360p.webm",
              "size": 323540,
              "quality": "360p",
              "url": "",
            },
            {
              "filename": "fEcnrA6RIzo_240p.webm",
              "size": 178217,
              "quality": "240p",
              "url": "",
            },
            {
              "filename": "fEcnrA6RIzo_144p.mp4",
              "size": 145494,
              "quality": "144p",
              "url": "",
            },
            {
              "filename": "fEcnrA6RIzo_144p.webm",
              "size": 102138,
              "quality": "144p",
              "url": "",
            },
          ],
        },
      },
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
