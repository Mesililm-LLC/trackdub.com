# Mesalim company website

Mesalim (`mesalim.com`) is the company site. Trackdub stays the flagship product at `trackdub.com`. LinML, Numan, and lucid-mem retain their existing repositories and contributor governance. The future Mesilim rebrand is not active.

## Architecture

The company app is independently deployable from this repository. It reuses the pinned React dependencies, self-hosted fonts, cream/burgundy design language, and an authentic early Trackdub image. React renders complete HTML at build time; normal document links and a native mobile menu work without hydration. No product database, email webhook, account system, analytics vendor, or signup form is copied into the company app. Trackdub's TanStack Start app and its default deployment remain separate and unchanged apart from company attribution/navigation.

This is a deliberate simplification of the conceptual file map: a content-only React build avoids duplicating the product's server runtime. A separate repository can be extracted later; a second remote repository is not required to review or deploy this app.

## Local commands

From the repository root:

```sh
bun install --frozen-lockfile
bun run check:company
bun run build:company
bun run test:company
bun run dev:company
```

`dev:company` builds a noindex preview and runs the actual company Worker at `http://127.0.0.1:8787`. In another terminal:

```sh
bun run smoke:company
```

The preview Worker defaults to `X-Robots-Tag: noindex, nofollow`, including when a production HTML build is uploaded accidentally. Preview builds also put noindex in HTML and block crawling in robots.txt. Production uses a distinct Worker name and explicit environment. The compatibility date matches the installed runtime rather than requiring a dependency upgrade.

## Content and assets

- `src/site.ts`: current company identity and canonical origins.
- `src/projects.ts`: portfolio descriptions, limits, and existing source links.
- `src/pages.tsx`: eight company pages plus a genuine 404 document; per-page metadata and canonical URLs.
- `public/company.css`, `public/company.js`: responsive style and progressive menu/campaign handoff behavior.
- `public/licenses/`: original SIL Open Font License notices for bundled fonts, sourced from the official Google Fonts repository.
- `public/images/trackdub-early-build.png`: existing Trackdub early-build screenshot reused from the reviewed concept package; no availability claim is implied.
- `public/og.svg`, `public/og.png`: source and raster social card; SVG uses system fallback typography when rasterized, while the website uses bundled fonts.

The company homepage uses a single-thought headline, “Tools for creators and developers.” Product/project pages follow the same heading style. No future company name, invented mailbox, verified legal suffix, adoption metric, or release promise is published. About links to the existing public GitHub organization and clearly labeled Trackdub support. Privacy uses the product site's existing legal contact; delivery has not been tested by this implementation.

Source descriptions were refreshed from upstream READMEs on October 24, 2026. In particular, Numan installation is inert; plugin/module activation and hook enabling are explicit, separate steps. Public source does not make a lucid-mem user's private memory public. LinML is independent of Microsoft.

## Routing

The Worker serves company pages, returns real 404s for unknown URLs, normalizes www to apex with path/query retained, and redirects only known legacy marketing aliases (`/pricing`, `/docs`, `/changelog`, `/guides`, `/guides/ai-dubbing-guide`) to equivalent Trackdub destinations. A root `interest` query preserves the old product signup intent. A visible `#waitlist` link supports old fragments without globally redirecting the company homepage. Supported UTM parameters are carried to Trackdub links without cookies or local storage.

Do not bind this Worker to Trackdub or its service subdomains. Company-host `/api/waitlist`, `/mcp`, and unknown discovery paths are 404; those services remain on the product host. Company `/privacy` is intentionally distinct from product privacy.

## Production cutover

Repository push does not complete the domain migration. Before cutover, restore authenticated Cloudflare access, verify existing plan/quota bounds, and confirm business naming/contact details against official documents and startup-credit applications. Do not infer legal approval from website copy.

1. Export current Mesalim forwarding rules, web DNS records, certificate status, and Worker bindings. Preserve mail, verification records, Trackdub service hosts, and all subscriber data. Record the original configuration for rollback.
2. Deploy an isolated preview with `bun run deploy:company:preview`. Verify all pages and assets, mobile/keyboard navigation, real 404s, redirects, and noindex. This command uploads a public preview; do not run until preview deployment is authorized.
3. Review the concrete cutover configuration and obtain production approval. `company/wrangler.jsonc` production targets only `mesalim.com` and `www.mesalim.com`; no D1 or product bindings are present.
4. Run `bun run deploy:company` only after approval. Disable only the identified old Mesalim-to-Trackdub forwarding rule once the company Worker and certificates are ready. Confirm no competing redirect still intercepts requests. Do not edit unrelated DNS.
5. Run `bun run smoke:company https://mesalim.com --production`. Also test www and HTTP normalization, direct deep links, query preservation, and a fresh browser. Permanent redirects cached in browsers may persist after the edge rule changes.
6. Only after the company homepage is healthy, set `VITE_MESALIM_SITE_READY=true` in the Trackdub build environment and rebuild/release Trackdub using its existing deployment. The default is false: unlinked “A Mesalim product” attribution remains visible, while return links stay hidden to avoid sending visitors through the current redirect back to Trackdub.
7. Verify company → Trackdub pipeline → company return journey on desktop/mobile, including direct pricing/docs/guides visits and footer links. Product logo/navigation continue to target Trackdub. Run existing product smoke checks; test email delivery only through an explicitly authorized test inbox.
8. Submit the company sitemap after ownership verification and review logs after launch. No Trackdub Search Console Change of Address is needed because the product pages are not moving.

If the company launch fails, roll back the company deployment to a known healthy build or restore the captured forwarding configuration temporarily. Disable Trackdub return links if that forwarding is restored. Never create reciprocal global redirects, delete the waitlist database, or reset mail DNS. Recheck both hosts and service endpoints.

## Verification boundaries

CI builds both apps and checks the company types/tests. Local worker smoke checks cover real HTTP routing, page metadata, noindex, assets, aliases, and unknown/service paths. Unit tests additionally cover host/query normalization and method isolation. A build or mock ASSETS binding does not prove live DNS, certificate issuance, mailbox delivery, startup-program acceptance, or product signup completion.

At implementation time, the Cloudflare connector required reauthentication and Linear tools were unavailable. No authenticated DNS/rule inventory or external issue update was possible. Production deployment and cutover remain pending; the source implementation is reviewable independently.
