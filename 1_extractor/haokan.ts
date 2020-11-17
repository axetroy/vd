import { by as sortBy } from "https://cdn.skypack.dev/@pabra/sortby?dts";
import { getVideoFormatFromMineType } from "../extension.ts";
import { IExtractor } from "../type.ts";
import { getVideoName } from "../utils.ts";

interface HaoKanInfo {
  curVideoMeta: {
    title: string;
    clarityUrl: Array<{
      title: string;
      url: string;
    }>;
  };
}

// https://haokan.baidu.com/v?vid=18344503110611384639&tab=recommend
export default class implements IExtractor {
  public website = "https://haokan.baidu.com";
  public tester = /^https:\/\/haokan\.baidu\.com\/v\?vid=\w+/;
  async extract(url: URL) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const html = await res.text();

    const matcher = html.match(
      /window\.__PRELOADED_STATE__\s=\s?(.+);\s*document/,
    );

    if (!matcher || matcher.length < 2) {
      throw new Error("无法找到资源");
    }

    const info = JSON.parse(matcher[1]) as HaoKanInfo;

    const title = info.curVideoMeta.title;

    const streams = await Promise.all(info.curVideoMeta.clarityUrl.map((v) => {
      return fetch(v.url, { method: "HEAD" })
        .then((res) => {
          res.body?.cancel();
          if (!res.ok) throw new Error(res.statusText);
          const size = +res.headers.get("content-length")!;
          const contentType = res.headers.get("content-type")!;
          return Promise.resolve({
            filename: getVideoName(
              title,
              v.title,
              getVideoFormatFromMineType(contentType) || "",
            ),
            url: v.url,
            size,
            quality: v.title,
          });
        });
    }));

    return {
      name: title,
      url: url.href,
      streams: streams.sort(sortBy(["size", "desc"])),
    };
  }
}
