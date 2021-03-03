import { parse } from "https://deno.land/std@0.89.0/flags/mod.ts";
import Extractor5DM from "./1_extractor/5dm.ts";
import ExtractorBilibili from "./1_extractor/bilibili.ts";
import ExtractorHaokan from "./1_extractor/haokan.ts";
import ExtractorPornhub from "./1_extractor/pornhub.ts";
import ExtractorXVideos from "./1_extractor/xvideos.ts";
import ExtractorXnxx from "./1_extractor/xnxx.ts";
import ExtractorYoutue from "./1_extractor/youtube.ts";
import { Application } from "./application.ts";

const VERSION = "v0.2.3";

const flags = parse(Deno.args, {
  "--": false,
  boolean: ["help", "version"],
  alias: { help: "h", version: "V", threads: "n" },
  default: { n: 16 },
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
app.register(new ExtractorXnxx());

await app.start(flags._[0] + "", { threading: flags.n as number });
