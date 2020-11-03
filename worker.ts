// deno-lint-ignore-file ban-ts-comment
interface IEvent extends Event {
  data: string;
}

// @ts-expect-error
globalThis.addEventListener("message", (event: IEvent) => {
  const code = event.data;
  try {
    eval(`var playerObjList = {};` + code.replace(/var\s+/g, "globalThis."));
  } catch (err) {
    //
    console.error(err);
  }

  const resource = Object.keys(globalThis)
    .filter((v) => /^quality_/.test(v))
    .map((key) => {
      return {
        quality: key.replace(/^quality_/, ""),
        // @ts-expect-error
        url: globalThis[key],
      };
    });

  globalThis.postMessage(resource);
  self.close();
});
