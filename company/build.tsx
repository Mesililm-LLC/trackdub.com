import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, join } from "node:path";
import { CompanyDocument, pages } from "./src/pages";

// A separate, content-only React build: no product runtime, database, or secrets.
const root = fileURLToPath(new URL("./", import.meta.url));
const out = resolve(root, "dist");
const preview = process.argv.includes("--preview");
await mkdir(out, { recursive: true });
await cp(join(root, "public"), out, { recursive: true });
await mkdir(join(out, "fonts"), { recursive: true });
for (const font of [
  "instrument-serif-400",
  "ibm-plex-sans-400",
  "ibm-plex-sans-500",
  "jetbrains-mono-400",
]) {
  await cp(join(root, "../public/fonts", `${font}.woff2`), join(out, "fonts", `${font}.woff2`));
}
for (const page of pages) {
  const target = join(out, page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`);
  await mkdir(resolve(target, ".."), { recursive: true });
  await writeFile(
    target,
    `<!doctype html>${renderToStaticMarkup(<CompanyDocument page={page} preview={preview} />)}`,
  );
}
const canonicalPages = pages.filter((page) => page.path !== "/404");
await writeFile(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${canonicalPages.map((page) => `<url><loc>https://mesilim.org${page.path}</loc></url>`).join("")}</urlset>\n`,
);
await writeFile(
  join(out, "robots.txt"),
  preview
    ? "User-agent: *\nDisallow: /\n"
    : "User-agent: *\nAllow: /\nSitemap: https://mesilim.org/sitemap.xml\n",
);
// Validate the copied image is present before producing a deployable build.
await readFile(join(out, "images/trackdub-early-build.png"));
console.log(
  `Built ${pages.length - 1} company pages and 404 (${preview ? "preview/noindex" : "production"}).`,
);
