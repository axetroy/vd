import { by as sortBy } from "https://cdn.skypack.dev/@pabra/sortby?dts";
import { getVideoFormatFromMineType } from "../extension.ts";
import { IExtractor } from "../type.ts";
import { getVideoName } from "../utils.ts";

function extractIdFromURL(url: URL): string {
  const match = url.pathname.match(/^\/video(\d+)\//);

  if (!match) {
    return "";
  }

  return match[1];
}

// example: https://www.xvideos.com/video57010397/scared_teen_stepsisters_pranked_by_stepbro_during_halloween
export default class implements IExtractor {
  public website = "https://xvideos.com";
  public tester = /^https:\/\/www\.xvideos\.com\/video\d+\/[\w_]+$/;
  async extract(url: URL) {
    const res = await fetch(url);

    const html = await res.text();

    const titleRegexp = /\.setVideoTitle\('([^\']+)'\)/;

    const titleMatcher = titleRegexp.exec(html);

    const videoID = extractIdFromURL(url);

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
