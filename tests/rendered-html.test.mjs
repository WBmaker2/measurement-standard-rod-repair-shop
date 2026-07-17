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
  assert.match(html, /고장난 기준봉을/);
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

test("제품 소스는 고정 미션, 접근성 안내, 업데이트 내역을 유지한다", async () => {
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
  assert.match(page, /2026-07-17 · v1.0.1/);
  assert.match(layout, /lang="ko"/);
  assert.match(layout, /측정 기준봉 정비소/);
  assert.match(layout, /x-forwarded-host/);
  assert.match(layout, /og\.png/);
  assert.match(css, /h1 \{[^}]*font-weight:800/);
  assert.match(css, /h2 \{[^}]*font-weight:800/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /min-width:320px/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
