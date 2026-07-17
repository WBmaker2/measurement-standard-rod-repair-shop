import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(url = "http://localhost/", headers = { accept: "text/html" }) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(url, { headers }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("서버 렌더링은 측정 기준봉 정비소의 첫 안내를 제공한다", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="ko">/);
  assert.match(html, /측정 기준봉 정비소/);
  assert.match(html, /고장난 화면 속 자를/);
  assert.match(html, /안내 활동 시작하기/);
  assert.match(html, /화면의 칸은.*1cm를 나타내는 모형/);
  assert.match(html, /업데이트 내역/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("공유 메타데이터는 요청 호스트의 절대 og 이미지 주소를 사용한다", async () => {
  const response = await render("https://repair.example/", {
    accept: "text/html",
    host: "repair.example",
    "x-forwarded-host": "repair.example",
    "x-forwarded-proto": "https",
  });
  const html = await response.text();
  assert.match(html, /property="og:image" content="https:\/\/repair\.example\/og\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
});

test("제품 소스는 저학년용 다섯 단계와 접근성 안내를 유지한다", async () => {
  const [page, layout, css, packageJson, data] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/mission-data.mjs", import.meta.url), "utf8"),
  ]);
  assert.match(data, /boundary-and-combined-repair/);
  assert.match(data, /misaligned-zero-start/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /한 단계 되돌리기/);
  assert.match(page, /처음부터 다시 할까요/);
  assert.match(page, /tutorialStarted/);
  assert.match(page, /optionSuffix="개"/);
  assert.match(page, /buildRepairRecord/);
  assert.match(page, /scrollIntoView/);
  assert.match(page, /1m = 10cm 묶음 10개 = 100cm/);
  assert.match(page, /estimate: "1\. 어림", inspect: "2\. 고장 찾기", repair: "3\. 고치기", count: "4\. 다시 세기", explain: "5\. 이유"/);
  assert.doesNotMatch(page, /stage: "measure"|바른 값 확인하기/);
  assert.match(page, /지금 할 일/);
  assert.match(page, /방금 한 일/);
  assert.match(page, /고치기 전|고친 뒤/);
  assert.match(page, /faultHints\[stillBroken\[0\]\]/);
  assert.match(page, /function screenCm/);
  assert.match(page, /첫 화면 속 자예요\. 먼저 길이를 어림해요/);
  assert.doesNotMatch(page, /\$\{value\} 화면 속 cm|\$\{mission\.length\} 화면 속 cm/);
  assert.match(page, /2026-07-18 · v1\.1\.0/);
  assert.match(page, /내 어림|찾은 고장|고친 방법|고친 뒤 길이|알게 된 점/);
  assert.match(layout, /lang="ko"/);
  assert.match(layout, /측정 기준봉 정비소/);
  assert.match(layout, /x-forwarded-host/);
  assert.match(layout, /og\.png/);
  assert.match(css, /h1 \{[^}]*font-weight:800/);
  assert.match(css, /h2 \{[^}]*font-weight:800/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /min-width\s*:\s*320px/);
  assert.doesNotMatch(css, /(?:body|\.app-shell)\s*\{[^}]*min-width\s*:\s*\d+px/);
  assert.match(css, /\.instruction-panel \{ min-height:0; order:1/);
  assert.doesNotMatch(css, /\.bench \{ order:-1/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
