import { by as sortBy } from "https://cdn.skypack.dev/@pabra/sortby?dts";
import { getVideoFormatFromMineType } from "../extension.ts";
import { IExtractor } from "../type.ts";
import { getVideoName } from "../utils.ts";

// example: https://cn.pornhub.com/view_video.php?viewkey=ph5aa6dfa915fb6
export default class implements IExtractor {
  public website = "https://pornhub.com";
  public tester =
    /^https:\/\/([a-z]+\.)?pornhub\.com\/view_video\.php\?viewkey=\w+$/;
  async extract(url: URL) {
    const res = await fetch(url);

    if (!res.ok) throw new Error(res.statusText);

    const html = await res.text();

    const titleRegexp = /<span\s+class=\"inlineFree\">(.+?)<\/span>/;
    const scriptRegexp = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;

    const titleMatch = titleRegexp.exec(html);

    const title = titleMatch ? titleMatch[1] : "";

    let videos: Array<{
      quality: string;
      url: string;
    }> = [];

    const match = html.match(scriptRegexp)?.filter((v) =>
      v.indexOf("flashvars_") >= 0
    );

    if (!match) {
      throw new Error("not match file");
    }

    while (match.length) {
      const scriptHTML = match.shift() as string;

      const m = scriptRegexp.exec(scriptHTML);
      if (m) {
        const scriptText = m[1];
        videos = await new Promise((resolve, reject) => {
          const worker = new Worker(
            new URL("./p_worker.js", import.meta.url).href,
            {
              type: "module",
            },
          );

          worker.onmessage = (event) => {
            worker.terminate();
            resolve(event.data);
          };

          worker.onerror = (err) => {
            worker.terminate();
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
          filename: getVideoName(
            title,
            v.quality,
            getVideoFormatFromMineType(
              mineType,
            ) || "",
          ),
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
