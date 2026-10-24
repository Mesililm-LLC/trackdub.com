import React from "react";
import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CompanyDocument, pages } from "../src/pages";

describe("published company documents", () => {
  test("every route has one heading, unique metadata, and correct canonical ownership", () => {
    expect(new Set(pages.map((page) => page.title)).size).toBe(pages.length);
    for (const page of pages) {
      const html = renderToStaticMarkup(<CompanyDocument page={page} preview={false} />);
      expect(html.match(/<h1[ >]/g)).toHaveLength(1);
      expect(html.match(/<main[ >]/g)).toHaveLength(1);
      expect(html).toContain(`rel="canonical" href="https://mesalim.com${page.path}"`);
      expect(html).toContain('property="og:image" content="https://mesalim.com/og.png"');
      expect(html).not.toMatch(/Mesilim|mesilim\.org|Build useful software|Leave the controls in/);
      expect(html).not.toContain("<form");
      const indexable = page.path !== "/404";
      expect(html).toContain(`content="${indexable ? "index, follow" : "noindex, nofollow"}"`);
      expect(renderToStaticMarkup(<CompanyDocument page={page} preview />)).toContain(
        'content="noindex, nofollow"',
      );
    }
  });

  test("all document-relative links and media exist in the build", () => {
    const built = resolve(import.meta.dir, "../dist");
    const paths = new Set(pages.map((page) => page.path));
    for (const page of pages) {
      const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
      expect(existsSync(resolve(built, file))).toBe(true);
      const html = readFileSync(resolve(built, file), "utf8");
      for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
        const href = new URL(match[1].replaceAll("&amp;", "&"), "https://mesalim.com");
        // Returning visitors may still have the former bare-root redirect cached.
        if (href.pathname === "/") expect(href.searchParams.get("home")).toBe("mesalim");
        expect(paths.has(href.pathname) || existsSync(resolve(built, `.${href.pathname}`))).toBe(
          true,
        );
        if (href.hash && href.pathname === page.path) {
          expect(html).toContain(`id="${href.hash.slice(1)}"`);
        }
      }
    }
  });

  test("portfolio keeps existing owners and the product conversion path", () => {
    const all = pages.map((page) => renderToStaticMarkup(page.element)).join("");
    for (const link of [
      "https://github.com/mesalimllc/LinML",
      "https://github.com/numan-cli/numan",
      "https://github.com/tonythethompson/lucid-mem",
      "https://www.npmjs.com/package/lucid-mem",
      "https://trackdub.com/#waitlist",
      "https://trackdub.com/#pipeline",
    ])
      expect(all).toContain(link);
    expect(all).toContain("Early preview");
    expect(all).toContain("MIT");
    expect(all).toContain("not an official Microsoft product");
  });
});
