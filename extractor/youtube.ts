import { by as sortBy } from "https://cdn.skypack.dev/@pabra/sortby?dts";
import { getVideoFormatFromMineType } from "../extension.ts";
import { IExtractor } from "../type.ts";

// https://www.youtube.com/watch?v=fEcnrA6RIzo
export default class implements IExtractor {
  public website = "https://www.youtube.com";
  public tester = /^https:\/\/www\.youtube\.com\/watch\?v=\w+$/;
  async extract(url: URL) {
    const id = url.searchParams.get("v");

    const res = await fetch(
      `https://www.youtube.com/get_video_info?video_id=${id}`,
    );

    if (!res.body) {
      throw new Error("request fail");
    }

    const output = await res.text();

    const answer = new URL("https://example.com/?" + output);

    if (answer.searchParams.get("status") !== "ok") {
      throw new Error(answer.searchParams.get("reason") || "download fail");
    }

    const playerResponseStr = answer.searchParams.get("player_response");

    if (!playerResponseStr) {
      throw new Error(`no player_response found in the server's answer`);
    }

    const playerResponse = JSON.parse(playerResponseStr);

    // Check if video is downloadable
    if (playerResponse.playabilityStatus.status !== "OK") {
      throw new Error(
        playerResponse.playabilityStatus.reason ||
          "The video is not downloadable",
      );
    }

    const title = playerResponse.videoDetails.title as string;

    const streams: Array<{
      qualityLabel: string; // 480p
      mimeType: string; // video/mp4; codecs="avc1.4d401e"
      contentLength: string;
      url: string;
    }> = playerResponse.streamingData.adaptiveFormats;

    return {
      name: title,
      url: url.href,
      streams: streams
        .filter((v) => v.qualityLabel && /^\d+p$/.test(v.qualityLabel))
        .map((stream) => {
          return {
            filename:
              `${playerResponse.videoDetails.videoId}_${stream.qualityLabel}${
                getVideoFormatFromMineType(stream.mimeType)
              }`,
            size: +stream.contentLength,
            quality: stream.qualityLabel,
            url: stream.url,
          };
        })
        .sort(sortBy(["size", "desc"])),
    };
  }
}
