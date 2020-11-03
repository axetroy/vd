import { ensureDir } from "https://deno.land/std@0.76.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.76.0/path/mod.ts";
import { signal } from "https://deno.land/std@0.76.0/signal/mod.ts";
import { getVideoFormatFromMineType, isVideoFile } from "../extension.ts";
import { segmenter } from "../utils.ts";
import { Progress } from "./progress.ts";

/**
 * Download file with multi threading
 * required server side support
 */
async function downloadWithMultiThreading(
  url: URL,
  dir: string,
  threading: number,
  filename?: string,
): Promise<string> {
  console.log(`download with multi-threading: ${threading}`);
  const res = await fetch(url, { method: "HEAD" });

  res.body?.cancel();

  if (!res.ok) throw new Error("download fail");

  const size = +(res.headers.get("content-length") as string);

  const downloadChunks = segmenter(size, threading);

  filename = filename || path.basename(url.pathname);

  if (!isVideoFile(filename)) {
    filename = filename +
      getVideoFormatFromMineType(res.headers.get("content-type") as string);
  }

  const progress = new Progress({
    total: size,
    complete: "=",
    incomplete: "-",
    display: `:completed/:total ${filename} :time [:bar] :percent`,
  });

  const tempDir = await Deno.makeTempDir({ prefix: "vd_" + filename });

  const sig = signal(Deno.Signal.SIGUSR1, Deno.Signal.SIGINT);

  (async () => {
    for await (const _ of sig) {
      console.log("\nDownload terminated. Good Bye!");
      await Deno.remove(tempDir, { recursive: true });
      Deno.exit(1);
    }
  })();

  async function downloadChunk(range: number[], index: number) {
    const dist = path.join(
      tempDir,
      filename + `__${index}__${range[0]}__${range[1]}`,
    );

    const headers = new Headers();

    headers.set("Range", `bytes=${range[0]}-${range[1]}`);

    const r = await fetch(url, {
      headers: headers,
    });

    if (!r.ok || !r.body) throw new Error(`download chunk ${index} fail`);

    const file = await Deno.open(dist, {
      create: true,
      write: true,
    });

    for await (const chunk of r.body) {
      progress.display = `:completed/:total ${filename} :time [:bar] :percent ${
        Math.floor(
          progress.speed / 1024,
        )
      }Kb/s`;
      progress.render(chunk.length);
      await Deno.writeAll(file, chunk);
    }

    file.close();

    return dist;
  }

  const chunkFiles = await Promise.all(
    downloadChunks.map((chunk, index) => downloadChunk(chunk, index)),
  );

  const outputFilepath = path.join(dir, filename);

  const f = await Deno.open(outputFilepath, {
    create: true,
    write: true,
    append: true,
  });

  for (const chunkFilePath of chunkFiles) {
    await Deno.writeAll(f, await Deno.readFile(chunkFilePath));
  }

  f.close();

  await Deno.remove(tempDir, { recursive: true });

  sig.dispose();

  return outputFilepath;
}

async function downloadWithSingleThreading(
  url: URL,
  dir: string,
  filename?: string,
) {
  const r = await fetch(url);

  if (!r.ok || !r.body) throw new Error(r.statusText);

  const size = +(r.headers.get("content-length") as string);

  filename = filename || path.basename(url.pathname);

  if (!isVideoFile(filename)) {
    filename = filename +
      getVideoFormatFromMineType(r.headers.get("content-type") as string);
  }

  const progress = new Progress({
    total: size,
    complete: "=",
    incomplete: "-",
    display: `:completed/:total ${filename} :time [:bar] :percent`,
  });

  const dist = path.join(dir, filename);

  const file = await Deno.open(dist, {
    create: true,
    write: true,
  });

  for await (const chunk of r.body) {
    progress.display = `:completed/:total ${filename} :time [:bar] :percent ${
      Math.floor(
        progress.speed / 1024,
      )
    }Kb/s`;
    progress.render(chunk.length);
    await Deno.writeAll(file, chunk);
  }

  file.close();

  return dist;
}

/**
 * Download file to dir
 */
export async function download(
  url: URL,
  dir: string,
  threading: number,
  filename?: string,
): Promise<string> {
  const res = await fetch(url);

  res.body?.cancel();

  if (!res.ok) throw new Error(res.statusText);

  const isSupportRangeDownload = res.headers.get("accept-ranges") === "bytes";

  await ensureDir(dir);

  if (isSupportRangeDownload) {
    return downloadWithMultiThreading(
      url,
      dir,
      threading,
      filename || "",
    );
  } else {
    return downloadWithSingleThreading(url, dir, filename);
  }
}
