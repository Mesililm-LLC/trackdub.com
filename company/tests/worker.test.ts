import { describe, expect, test } from "bun:test";
import worker from "../worker.mjs";

function environment(production = false) {
  const forwarded: string[] = [];
  return {
    forwarded,
    SITE_ENV: production ? "production" : "preview",
    ASSETS: {
      async fetch(request: Request) {
        forwarded.push(new URL(request.url).pathname);
        return new Response("asset", { headers: { "content-type": "text/html" } });
      },
    },
  };
}

describe("company host isolation and redirects", () => {
  test("www preserves deep path and query without redirecting into Trackdub", async () => {
    const env = environment();
    const response = await worker.fetch(
      new Request("https://www.mesalim.com/open-source/numan?utm_source=test"),
      env,
    );
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://mesalim.com/open-source/numan?utm_source=test",
    );
    expect(env.forwarded).toEqual([]);
  });

  test("only known marketing aliases forward to equivalent product destinations", async () => {
    for (const path of ["/pricing", "/docs", "/guides", "/guides/ai-dubbing-guide", "/changelog"]) {
      const response = await worker.fetch(
        new Request(`https://mesalim.com${path}/?utm_campaign=launch`),
        environment(),
      );
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe(
        `https://trackdub.com${path}?utm_campaign=launch`,
      );
    }
  });

  test("privacy, projects, unknown paths and services are never blanket product redirects", async () => {
    const env = environment();
    for (const path of [
      "/",
      "/privacy",
      "/open-source/linml",
      "/unknown",
      "/api/waitlist",
      "/mcp",
      "/.well-known/test",
      "/lovable/email/auth/webhook",
    ]) {
      const response = await worker.fetch(new Request(`https://mesalim.com${path}`), env);
      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    }
    expect(env.forwarded).toHaveLength(8);
  });

  test("legacy interest intent preserves query and reaches the existing product form", async () => {
    const response = await worker.fetch(
      new Request("https://mesalim.com/?interest=pro&utm_source=old"),
      environment(),
    );
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "https://trackdub.com/?interest=pro&utm_source=old#waitlist",
    );
  });

  test("preview defaults to noindex and production does not", async () => {
    const request = new Request("https://preview.example/about");
    expect((await worker.fetch(request, environment())).headers.get("x-robots-tag")).toBe(
      "noindex, nofollow",
    );
    const production = await worker.fetch(request, environment(true));
    expect(production.headers.get("x-robots-tag")).toBeNull();
    expect(production.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
  });

  test("HEAD has no body and POST cannot reach an accidental form backend", async () => {
    const env = environment();
    const head = await worker.fetch(
      new Request("https://mesalim.com/about", { method: "HEAD" }),
      env,
    );
    expect(await head.text()).toBe("");
    const post = await worker.fetch(
      new Request("https://mesalim.com/api/waitlist", { method: "POST" }),
      env,
    );
    expect(post.status).toBe(405);
    expect(post.headers.get("allow")).toBe("GET, HEAD");
    expect(env.forwarded).toEqual(["/about"]);
  });
});
