import ProgressBar from "https://deno.land/x/progress@v1.1.4/mod.ts";

export class Progress extends ProgressBar {
  public speed = 0;
  #current = 0;
  #updateAt = new Date();

  render(
    number: number,
    options?: {
      title?: string;
      total?: number;
      complete?: string;
      preciseBar?: string[];
      incomplete?: string;
    },
  ) {
    this.#current += number;
    const now = new Date();
    const diffTime = now.getTime() - this.#updateAt.getTime();
    this.#updateAt = now;

    this.speed = +((number / diffTime) * 1000).toFixed(2);

    return super.render(this.#current, options);
  }
}
