const PRODUCT_ORIGIN = "https://trackdub.com";
const COMPANY_ORIGIN = "https://mesalim.com";
const aliases = new Set(["/pricing", "/docs", "/changelog", "/guides", "/guides/ai-dubbing-guide"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Only apex/www are normalized; preview/local hosts remain usable.
    if (
      url.hostname === "www.mesalim.com" ||
      (url.hostname === "mesalim.com" && url.protocol === "http:")
    ) {
      return Response.redirect(`${COMPANY_ORIGIN}${url.pathname}${url.search}`, 301);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    const cleanPath = url.pathname.replace(/\/$/, "") || "/";
    // Exact legacy marketing aliases only. Never capture product service paths.
    if (aliases.has(cleanPath)) {
      return Response.redirect(`${PRODUCT_ORIGIN}${cleanPath}${url.search}`, 301);
    }
    if (url.pathname === "/" && url.searchParams.has("interest")) {
      return Response.redirect(`${PRODUCT_ORIGIN}/${url.search}#waitlist`, 302);
    }
    const result = await env.ASSETS.fetch(request);
    const headers = new Headers(result.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    );
    // Preview deploys default to noindex even if someone uploads a production build.
    if (env.SITE_ENV !== "production" || result.status >= 400)
      headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(request.method === "HEAD" ? null : result.body, {
      status: result.status,
      headers,
    });
  },
};
