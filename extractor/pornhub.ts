import { by as sortBy } from "https://cdn.skypack.dev/@pabra/sortby?dts";
import { getVideoFormatFromMineType } from "../extension.ts";
import { IExtractor } from "../type.ts";

// example: https://cn.pornhub.com/view_video.php?viewkey=ph5aa6dfa915fb6
export default class implements IExtractor {
  public website = "https://pornhub.com";
  public tester =
    /^https:\/\/[a-z]+\.pornhub\.com\/view_video\.php\?viewkey=\w+$/;
  async extract(url: URL) {
    const res = await fetch(url);

    const html = await res.text();

    const titleRegexp = /<span\s+class=\"inlineFree\">(.+?)<\/span>/;
    const scriptRegexp = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;

    const titleMatch = titleRegexp.exec(html);

    const title = titleMatch ? titleMatch[1] : "";
    const videoID = url.searchParams.get("viewkey") as string;

    let videos: Array<{
      quality: string;
      url: string;
    }> = [];

    var match;
    while ((match = scriptRegexp.exec(html))) {
      const scriptText = match[1];
      if (scriptText.indexOf("flashvars_") >= 0) {
        videos = await new Promise((resolve, reject) => {
          const worker = new Worker(
            new URL("../worker.ts", import.meta.url).href,
            {
              type: "module",
            },
          );

          worker.onmessage = (event) => {
            resolve(event.data);
          };

          worker.onerror = (err) => {
            reject(err);
          };

          worker.postMessage(scriptText);
        });
      }
    }

    const streams = await Promise.all(
      videos.map(async (v) => {
        const res = await fetch(v.url, { method: "HEAD" });
        const size = Number(res.headers.get("content-length"));
        const mineType = (res.headers.get("content-type") as string);
        await res.body!.cancel();
        return Promise.resolve({
          ...v,
          url: v.url,
          filename: `${videoID}_${v.quality}${getVideoFormatFromMineType(
            mineType
          )}`,
          size,
        });
      }),
    );

    return {
      name: title,
      url: url.href,
      streams: streams.sort(sortBy(["size", "desc"])),
    };
  }
}
