interface IStream {
  filename: string; // filename with extension
  size: number; // the file size
  quality: string;
  url: string;
}

export interface IResource {
  name: string;
  url: string;
  streams: IStream[];
}

export interface IExtractor {
  website: string;
  tester: RegExp;
  extract(url: URL): Promise<IResource>;
}

export interface IDownloader {
  download(resource: IResource, options?: IDownloaderOptions): Promise<string>;
}

export interface IDownloaderOptions {
  threading: number;
}

export interface IApplication {
  register(e: IExtractor): void;
  start(url: string, options: IDownloaderOptions): Promise<void>;
}
