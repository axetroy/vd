import { parse } from "https://deno.land/std@0.76.0/flags/mod.ts";
import { Application } from "./application.ts";
import Extractor5DM from "./extractor/5dm.ts";
import ExtractorBilibili from "./extractor/bilibili.ts";
import ExtractorHaokan from "./extractor/haokan.ts";
import ExtractorPornhub from "./extractor/pornhub.ts";
import ExtractorXVideos from "./extractor/xvideos.ts";
import ExtractorYoutue from "./extractor/youtube.ts";

const VERSION = "v0.1.0";

const flags = parse(Deno.args, {
  "--": false,
  boolean: ["help", "version"],
  alias: { help: "h", version: "V", threads: "n" },
  default: { threads: 8 },
});

if (flags.help) {
  console.log(`vd - Video Downloader
A tool focused on downloading videos.

USAGE:
  dv [OPTIONS] <URL>

OPTIONS:
  -n                Number of threads for file download (defaults to: 8)
  --help,-h         Print help information
  --version,-V      Print the version information

EXAMPLE:
  dv "https://video.website/com/play/page"
`);
  Deno.exit(0);
}

if (flags.version) {
  console.log(VERSION);
  Deno.exit(0);
}

const app = new Application();

app.register(new ExtractorHaokan());
app.register(new ExtractorYoutue());
app.register(new ExtractorBilibili());
app.register(new Extractor5DM());
app.register(new ExtractorPornhub());
app.register(new ExtractorXVideos());

await app.start(flags._[0] + "", { threading: flags.n as number });
