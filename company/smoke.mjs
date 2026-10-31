import assert from "node:assert/strict";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:8787").origin;
const production = process.argv.includes("--production");
const paths = [
  "/",
  "/products/trackdub",
  "/open-source",
  "/open-source/linml",
  "/open-source/numan",
  "/open-source/lucid-mem",
  "/about",
  "/privacy",
];
const request = (path, options = {}) =>
  fetch(`${origin}${path}`, { signal: AbortSignal.timeout(20000), redirect: "manual", ...options });

for (const path of paths) {
  const response = await request(path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(
    html.includes(`rel="canonical" href="https://mesilim.org${path}"`),
    `${path}: canonical`,
  );
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, `${path}: heading`);
  if (production) {
    assert.ok(
      !response.headers.get("x-robots-tag")?.includes("noindex"),
      `${path}: production header`,
    );
    assert.ok(!html.includes('content="noindex, nofollow"'), `${path}: production meta`);
  } else {
    assert.ok(response.headers.get("x-robots-tag")?.includes("noindex"), `${path}: preview header`);
  }
}
for (const path of ["/no-such-page", "/api/waitlist", "/mcp", "/.well-known/missing"]) {
  assert.equal((await request(path)).status, 404, path);
}
const alias = await request("/pricing?utm_source=smoke");
assert.equal(alias.status, 301);
assert.equal(alias.headers.get("location"), "https://trackdub.com/pricing?utm_source=smoke");
const intent = await request("/?interest=pro&utm_source=legacy");
assert.equal(
  intent.headers.get("location"),
  "https://trackdub.com/?interest=pro&utm_source=legacy#waitlist",
);
for (const path of [
  "/company.css",
  "/company.js",
  "/favicon.svg",
  "/og.png",
  "/images/trackdub-early-build.png",
  "/fonts/instrument-serif-400.woff2",
  "/sitemap.xml",
  "/robots.txt",
]) {
  assert.equal((await request(path)).status, 200, path);
}
console.log(
  `PASS company HTTP smoke: ${paths.length} routes, true 404s, assets, legacy redirects (${production ? "production" : "preview"}).`,
);
