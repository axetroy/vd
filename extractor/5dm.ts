import { DEFAULT_HEADERS } from "../config.ts";
import { getVideoFormatFromMineType } from "../extension.ts";
import { IExtractor } from "../type.ts";
import { getSizeAndType } from "../utils.ts";

function getPlayerUrl(html: string): URL {
  const matcher = /src="(https:\/\/www\.5dm\.tv\/html5\/h5play\.php\?[^"]+)"/
    .exec(html);

  if (!matcher || matcher.length < 2) {
    throw new Error("match player url fail");
  }

  return new URL(matcher[1]);
}

function getVideoTitle(html: string): string {
  // <h1 class="video-title">阿松 第三季【更新至第4集】</h1>
  const matcher = /<h1\s+class="video-title">([^<]+)\s*<\/h1>/
    .exec(html);

  if (!matcher || matcher.length < 2) {
    throw new Error("match title fail");
  }

  return matcher[1];
}

async function getVideoURL(url: URL, headers: Headers) {
  const res = await fetch(url, { headers });

  const html = await res.text();

  const matcher = /srcUrl=(.+);/
    .exec(html);

  if (!matcher || matcher.length < 2) {
    throw new Error("match video url fail");
  }

  const { mp4 } = JSON.parse(matcher[1]);

  return new URL(mp4);
}

export default class implements IExtractor {
  public website = "https://www.5dm.tv";
  public tester = /^https:\/\/www\.5dm\.tv\/bangumi\/dv\d+/;
  async extract(url: URL) {
    const headers = new Headers();

    DEFAULT_HEADERS.forEach((val, key) => headers.set(key, val));

    headers.set("referer", this.website);

    const res = await fetch(url, { headers });

    const html = await res.text();

    const title = getVideoTitle(html);
    const playerURL = getPlayerUrl(html);

    const videoURL = await getVideoURL(playerURL, headers);

    const { size, mineType } = await getSizeAndType(videoURL, headers);

    return {
      name: title,
      url: url.href,
      streams: [
        {
          filename: title + "_" + getVideoFormatFromMineType(mineType),
          size: size,
          quality: "Unknown",
          url: videoURL.href,
        },
      ],
    };
  }
}
