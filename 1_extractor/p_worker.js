globalThis.addEventListener("message", async (event) => {
  const code = event.data.code;
  const cookie = event.data.cookies;
  try {
    eval(`var playerObjList = {};` + code.replace(/var\s+/g, "globalThis."));
  } catch (err) {
    //
    console.error(err);
  }

  const varName = Object.keys(globalThis).filter(
    (v) => v.indexOf("flashvars_") == 0,
  );

  const flashVar = globalThis[varName];

  const mediaDefinitions = flashVar.mediaDefinitions.find(
    (v) => v.format === "mp4",
  );

  const ac = new AbortController();

  const timer = setTimeout(() => {
    ac.abort();
  }, 30 * 1000);

  const res = await fetch(mediaDefinitions.videoUrl, {
    method: "GET",
    headers: {
      Host: "cn.pornhub.com",
      "Cache-Control": "max-age=0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0",
      Cookie: Object.keys(cookie)
        .map((key) => `${key}=${cookie[key]}`)
        .join("; "),
    },
    referrer: "https://cn.pornhub.com",
    cache: "no-cache",
    window: globalThis,
    mode: "navigate",
    credentials: "same-origin",
    signal: ac.signal,
  });

  clearTimeout(timer);

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const qualities = await res.json();

  const result = qualities
    .sort((a, b) => a.quality > b.quality)
    .map((v) => {
      return {
        quality: v.quality.replace(/p$/) + "p",
        url: v.videoUrl,
      };
    });

  globalThis.postMessage(result);
  self.close();
});
