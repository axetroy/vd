import { DEFAULT_HEADERS } from "../config.ts";
import { getVideoFormatFromMineType } from "../extension.ts";
import { IExtractor } from "../type.ts";

interface BilibiliPageState {
  aid: number;
  bvid: string;
  videoData: {
    aid: number;
    cid: number;
    tid: number;
    title: string;
    pages: Array<{
      cid: number;
      vid: string;
      page: number;
      part: string;
    }>;
  };
}

interface APIResponse {
  code: number;
  message: string;
  ttl: number;
  data: {
    "accept_description": string[];
    "support_formats": Array<{
      display_desc: string; // 1080P
      format: string; // flv_p60
      new_description: string; // 1080P 60帧
      quality: number; // 60
      superscript: string; // 60帧
    }>;
    dash: {
      video: Array<{
        id: number;
        baseUrl: string;
        mimeType: string;
      }>;
    };
  };
}

// 解析页面
function parsePage(html: string) {
  const matcher = /window\.__INITIAL_STATE__\=(.+?);\(function/.exec(html);

  if (!matcher) {
    throw new Error("parse page error");
  }

  const pageState = JSON.parse(matcher[1]) as BilibiliPageState;

  return pageState;
}

// 获取 API
function getApi(pageState: BilibiliPageState): URL {
  const api = new URL("https://api.bilibili.com/x/player/playurl");

  api.searchParams.set("avid", pageState.videoData.aid + "");
  api.searchParams.set("cid", pageState.videoData.cid + "");
  api.searchParams.set("bvid", pageState.bvid + "");
  api.searchParams.set("type", "");
  api.searchParams.set("otype", "json");
  api.searchParams.set("fourk", "1");
  api.searchParams.set("fnval", "16");

  return api;
}

// example: https://www.bilibili.com/video/BV11K411A7eo
export default class implements IExtractor {
  public website = "https://bilibili.com";
  public tester = /^https:\/\/www\.bilibili\.com\/video\/\w+$/;
  async extract(url: URL) {
    const headers = new Headers();
    DEFAULT_HEADERS.forEach((val, key) => {
      headers.set(key, val);
    });
    headers.set("referer", "https://www.bilibili.com");
    // DEFAULT_HEADERS.
    const res = await fetch(url, { headers });

    const html = await res.text();

    const state = parsePage(html);

    const api = getApi(state);

    const r: APIResponse = await (await fetch(api, { headers })).json();

    const urls = r.data.support_formats.map((fmt) => {
      const video = r.data.dash.video.find((video) => video.id === fmt.quality);

      if (!video) return;

      return {
        quality: fmt.display_desc,
        url: video!.baseUrl,
        mineType: video!.mimeType,
      };
    }).filter((v) => !!v);

    const streams = await Promise.all(urls.map((v) => {
      return fetch(v!.url, { headers, method: "GET" })
        .then((response) => {
          const size = +response.headers.get("content-length")!;
          response.body?.cancel();
          return Promise.resolve(
            {
              url: v!.url,
              size,
              filename: state.videoData.title + "_" + v!.quality +
                getVideoFormatFromMineType(v!.mineType),
              quality: v!.quality,
            },
          );
        });
    }));

    return {
      name: state.videoData.title,
      url: url.href,
      streams: streams,
    };
  }
}
