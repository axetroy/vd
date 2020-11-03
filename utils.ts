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
  const averageSize = Math.floor(total / number);

  const array: number[] = [];

  while (total > 0) {
    if (array.length === number - 1) {
      array.push(total);
      total -= total;
      break;
    }

    if (total > averageSize) {
      array.push(averageSize);
      total -= averageSize;
    } else {
      array.push(total);
      total -= total;
      break;
    }
  }

  return array.map((length, index) => {
    const prev = sum(...array.slice(0, index));
    return [prev > 0 ? prev + 1 : prev, prev + length];
  });
}

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
