globalThis.addEventListener("message", (event) => {
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
        url: globalThis[key],
      };
    });

  globalThis.postMessage(resource);
  self.close();
});
