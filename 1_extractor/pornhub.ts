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
    const ac = new AbortController();

    const timer = setTimeout(() => {
      ac.abort();
    }, 30 * 1000);

    const res = await fetch(url, { signal: ac.signal });

    clearTimeout(timer);

    if (!res.ok) throw new Error(res.statusText);

    const html = await res.text();

    const cookies = (res.headers.get("set-cookie") || "").split(";").map((v) =>
      v.trim()
    );
    const cookieObj: { [key: string]: string } = {};

    for (const c of cookies) {
      const arr = c.split(",").map((v) => v.trim());

      for (const str of arr) {
        const matcher = /^([\w]+)=(.+)$/.exec(str);
        if (!matcher) continue;
        const key = matcher[1];
        const value = matcher[2];

        const isBuildInKey = [
          "path",
          "domain",
          "secure",
          "httpOnly",
          "Max-Age",
          "expires",
          "SameSite",
        ].find((v) => v.toLowerCase() === key);

        if (isBuildInKey) {
          continue;
        }

        cookieObj[key] = value;
      }
    }

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
              deno: {
                permissions: {
                  net: "inherit",
                },
              },
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

          worker.postMessage({ code: scriptText, cookies: cookieObj });
        });
      }
    }

    const streams = await Promise.all(
      videos.map(async (v) => {
        const res = await fetch(v.url, { method: "HEAD" });
        const size = Number(res.headers.get("content-length"));
        const mineType = (res.headers.get("content-type") as string);
        if (res.body) {
          await res.body.cancel();
        }
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
