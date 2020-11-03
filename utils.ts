/**
 * sum the array
 * @param arr {number[]}
 */
export function sum(...arr: number[]) {
  return ([] as number[]).concat(...arr).reduce((acc, val) => acc + val, 0);
}

/**
 * Segment the downloaded content
 * @param total {number}
 * @param number {number}
 * @requires {Array<number[]>}
 */
export function segmenter(total: number, number: number): Array<number[]> {
  const originTotal = total;
  const averageSize = Math.floor(total / number);

  const result: number[][] = new Array(number);

  let start = 0;

  for (let i = 0; i < number; i++) {
    const step = Math.min(averageSize, total);
    const end = i === number - 1 ? originTotal : start + step;
    result[i] = [start, end];
    total -= step;
    start = end + 1;
  }

  return result;
}

/**
 * Get resource type and size
 * @param url
 * @param headers
 */
export async function getSizeAndType(
  url: URL,
  headers: Headers,
): Promise<{ size: number; mineType: string }> {
  const r = await fetch(url, { headers });

  r.body?.cancel();

  if (!r.ok) throw new Error(r.statusText);

  const size = +r.headers.get("content-length")!;
  const type = r.headers.get("content-type")!;

  return { size, mineType: type };
}

/**
 * Cover name to a normal file name
 * @param name
 */
export function nameify(name: string): string {
  return name.replaceAll(/\s+/g, "_");
}

export function getVideoName(
  title: string,
  quality: string,
  extName: string,
): string {
  return `${nameify(title)}.${nameify(quality)}${extName}`;
}
