import * as path from "https://deno.land/std@0.123.0/path/mod.ts";

type VideoExtName = ".mp4" | ".webm";

const mineMaps = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

export function getVideoFormatFromMineType(
  mineTypeStr: string,
): VideoExtName | null {
  if (!mineTypeStr) return null;
  const mineTypes = mineTypeStr.split(";").map((v) => v.trim());

  for (const mineType of mineTypes) {
    const s = mineType;
    if (Reflect.has(mineMaps, mineType)) {
      return Reflect.get(mineMaps, mineType);
    }
  }

  return null;
}

export function isVideoFile(filename: string): boolean {
  const ext = path.extname(filename);

  return [".mp4", ".webm"].includes(ext);
}
