globalThis.addEventListener("message", (event) => {
  const code = event.data;
  try {
    eval(`var playerObjList = {};` + code.replace(/var\s+/g, "globalThis."));
  } catch (err) {
    //
    console.error(err);
  }

  const qualities = Object.keys(globalThis).filter((v) =>
    /^qualityItems/.test(v)
  );

  const resource = qualities
    .map((key) => {
      return globalThis[key]
        .filter((v) => v.url)
        .map((v) => {
          return {
            quality: v.text,
            url: v.url,
          };
        });
    })
    .flat();

  globalThis.postMessage(resource);
  self.close();
});
