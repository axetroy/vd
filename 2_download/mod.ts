import * as fs from "https://deno.land/std@0.84.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.84.0/path/mod.ts";
import { downloadFile } from "./download.ts";

function getAria2URL() {
  return `https://github.com/axetroy/vd/raw/master/aria2/${Deno.build.os}/aria2c${
    Deno.build.os === "windows" ? ".exe" : ""
  }`;
}

async function getAria2Path(): Promise<string> {
  const downloadDir = path.join(
    Deno.env.get("HOME") || "",
    ".aria2",
    Deno.build.os,
  );

  const aria2ExecutableFile = path.join(
    downloadDir,
    "aria2c" + (Deno.build.os === "windows" ? ".exe" : ""),
  );

  if (await fs.exists(aria2ExecutableFile) === false) {
    const aria2URL = getAria2URL();
    // if aria2 file not found. then download it
    console.log(`Downloading aria2 from '${aria2URL}'`);
    await downloadFile(
      new URL(aria2URL),
      {
        dir: path.dirname(aria2ExecutableFile),
        filename: path.basename(aria2ExecutableFile),
        mode: 0x755,
      },
    );
  } else {
    try {
      await Deno.chmod(aria2ExecutableFile, 0x755);
    } catch {
      // ignore error
    }
  }

  return aria2ExecutableFile;
}

/**
 * Download file to dir
 */
export async function download(
  url: URL,
  dir: string,
  threading: number,
  filename?: string,
): Promise<void> {
  const aria2Path = await getAria2Path();

  console.log(`download with aria2 '${aria2Path}'`);

  const commands = [
    aria2Path,
    "--min-split-size=1M",
    `--max-concurrent-downloads=${threading}`,
    `--max-connection-per-server=${threading}`,
    `--dir=${dir}`,
    `--out=${filename}`,
    "--retry-wait=10",
    `--referer=${url.origin}`,
    `--max-tries=${10}`,
    url.toString(),
  ];

  const ps = Deno.run({
    cmd: commands,
    stderr: "inherit",
    stdout: "inherit",
  });

  await ps.status();

  ps.stdout?.close();
  ps.stderr?.close();
  ps.close();

  return;
}
