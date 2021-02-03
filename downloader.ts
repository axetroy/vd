import { green } from "https://deno.land/std@0.85.0/fmt/colors.ts";
import * as path from "https://deno.land/std@0.85.0/path/mod.ts";
import convertSize from "https://x.nest.land/convert-size@1.1.2/mod.ts";
import { download } from "./2_download/mod.ts";
import { IDownloader, IDownloaderOptions, IResource } from "./type.ts";

export class Downloader implements IDownloader {
  private printResource(resource: IResource) {
    const message = `
Site:     ${resource.url.toString()}
Title:    ${resource.name}
Streams:`;

    console.log(message.trimStart());

    const table: {
      [key: string]: { quality: string; ext: string; size: string };
    } = {};

    resource.streams.forEach((stream, index) => {
      table[index + 1 + ""] = {
        quality: stream.quality,
        ext: path.extname(stream.filename),
        size: convertSize(stream.size, { base: 1024, accuracy: 2 }),
      };
    });

    console.table(table);
  }

  async download(resource: IResource, options: IDownloaderOptions) {
    this.printResource(resource);

    const index = window.prompt("Please Enter the Number to download", "1") ||
      "1";

    const stream = resource.streams[+index - 1];

    console.log(`Downloading '${green(stream.url.toString())}'`);

    return await download(
      new URL(stream.url),
      Deno.cwd(),
      options.threading,
      stream.filename,
    );
  }
}
