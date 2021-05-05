import { ensureDir } from "https://deno.land/std@0.95.0/fs/ensure_dir.ts";
import * as path from "https://deno.land/std@0.95.0/path/mod.ts";
import { Progress } from "./progress.ts";

export interface DownloadOptions {
  dir: string;
  filename?: string;
  mode?: number;
}

export async function downloadFile(
  url: URL,
  options: DownloadOptions,
) {
  const r = await fetch(url);

  if (!r.ok || !r.body) throw new Error(r.statusText);

  const size = +(r.headers.get("content-length") as string);

  const filename = options.filename || path.basename(url.pathname);

  const progress = new Progress({
    total: size,
    complete: "=",
    incomplete: "-",
    display: `:completed/:total ${filename} :time [:bar] :percent`,
  });

  await ensureDir(options.dir);

  const dist = path.join(options.dir, filename);

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

  try {
    await Deno.chmod(dist, options.mode || 0x666);
  } catch {
    // empty block
  }

  return dist;
}
