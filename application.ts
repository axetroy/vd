import { green } from "https://deno.land/std@0.84.0/fmt/colors.ts";
import { Downloader } from "./downloader.ts";
import {
    IApplication,
    IDownloader,
    IDownloaderOptions,
    IExtractor
} from "./type.ts";

class Application implements IApplication {
  #provider: IExtractor[] = [];
  #downloader: IDownloader = new Downloader();
  register(e: IExtractor) {
    this.#provider.push(e);
  }
  async start(url: string, options: IDownloaderOptions) {
    const provider = this.#provider.filter((v) => v.tester.test(url))[0];

    if (!provider) {
      throw new Error("not support website");
    }

    const resources = await provider.extract(new URL(url));

    if (!resources.streams.length) {
      console.log("resource not found.");
      return;
    }

    await this.#downloader.download(resources, options);

    console.log(green("download complete!"));
  }
}

export { Application };
