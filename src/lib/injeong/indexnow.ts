import { LIVE, ORIGIN } from "./site";

/**
 * IndexNow: tells Bing, Naver and the other IndexNow engines that pages changed, so a new column is crawled
 * within minutes instead of days. The key is public by design: it is also served at /<key>.txt.
 * Only on the real domain; failures are logged and never block a save.
 */
export const INDEXNOW_KEY = "827507c3832e5262cd3c3882f542b6aa";
const ENDPOINTS = ["https://api.indexnow.org/indexnow", "https://searchadvisor.naver.com/indexnow"];

export async function notifyIndexNow(paths: string[]) {
  if (!LIVE || !paths.length) return;
  const host = new URL(ORIGIN).host;
  const body = JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${ORIGIN}/${INDEXNOW_KEY}.txt`, urlList: [...new Set(paths)].map((p) => `${ORIGIN}${p}`) });
  await Promise.all(
    ENDPOINTS.map((u) =>
      fetch(u, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body, signal: AbortSignal.timeout(5000) })
        .then((r) => { if (!r.ok && r.status !== 202) console.warn("[indexnow]", u, r.status); })
        .catch((e) => console.warn("[indexnow]", u, e instanceof Error ? e.message : e)),
    ),
  );
}
