import { by as sortBy } from "https://cdn.skypack.dev/@pabra/sortby?dts";
import { getVideoFormatFromMineType } from "../extension.ts";
import { IExtractor } from "../type.ts";
import { getVideoName } from "../utils.ts";

// example: https://www.xnxx.com/video-bykb3e9/margot_lourdet_in_naked_2014_
export default class implements IExtractor {
  public website = "https://www.xnxx.com";
  public tester = /^https:\/\/www\.xnxx\.com\/video-[a-z0-9]+\/.+$/;
  async extract(url: URL) {
    const res = await fetch(url);

    const html = await res.text();

    const titleRegexp = /\.setVideoTitle\('([^\']+)'\)/;

    const titleMatcher = titleRegexp.exec(html);

    if (!titleMatcher) {
      throw new Error("parse title error");
    }

    const title = titleMatcher[1];

    const lowQualityURL = (/\.setVideoUrlLow\('([^\']+)'\)/.exec(html) ||
      [])[1];

    const HighQualityURL = (/\.setVideoUrlHigh\('([^\']+)'\)/.exec(html) ||
      [])[1];

    const streams = await Promise.all(
      [
        {
          quality: "high",
          url: HighQualityURL,
        },
        {
          quality: "low",
          url: lowQualityURL,
        },
      ].map((v) => {
        return fetch(v.url, { method: "HEAD" }).then((res) => {
          const size = Number(res.headers.get("content-length"));
          const contentType = res.headers.get("content-type") as string;

          return res.body!.cancel()
            .then(() => {
              return Promise.resolve({
                ...v,
                url: v.url,
                filename: getVideoName(
                  title,
                  v.quality,
                  getVideoFormatFromMineType(
                    contentType,
                  ) || "",
                ),
                size,
              });
            });
        });
      }),
    );

    return {
      name: titleMatcher[1],
      url: url.href,
      streams: streams.sort(sortBy(["size", "desc"])),
    };
  }
}
