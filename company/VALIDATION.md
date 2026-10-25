# Implementation validation

## Custom wordmark integration

The reviewed custom-M wordmark is used in the shared header and footer, with the standalone custom M supplying a versioned favicon and touch icon. Company types, production build, focused lint, and all nine tests passed (395 assertions). Local browser checks confirmed both wordmark instances load, remain proportional at desktop and 390px, and introduce no mobile horizontal overflow. Home links retain the cached-redirect workaround.

## Production cutover

After launch, the header wordmark exposed another returning-browser path to the cached bare-root 301. All company-home UI links now use `/?home=mesalim`; the canonical stays `https://mesalim.com/`. The live header logo was clicked and remained on Mesalim with the company homepage rendered. The nine company tests passed with 359 assertions, including a regression check against bare-root UI links; company types, build, and focused lint passed before redeployment.

The previously blocked cutover was completed on October 24, 2026 after the Cloudflare connector was reauthenticated. The original redirect rule and placeholder DNS records were saved locally for rollback. The production company Worker was uploaded, both apex/www custom domains attached, and only the old blanket redirect rule was disabled. Production HTTP smoke passed for all eight pages, assets, exact legacy redirects, and real 404s. The www redirect preserves path/query and Trackdub continues to return 200.

Returning-browser testing reproduced the old root 301 from the browser cache. The company URL with `?from=trackdub` loaded the new homepage correctly; Trackdub's return links therefore use that query while the company's canonical remains `https://mesalim.com/`. Return navigation is enabled by default now that the company host is healthy. Historical pre-cutover limitations below describe the earlier state.

Live follow-up verification passed for company return links on all seven Trackdub marketing routes. The desktop company → product workflow → company journey and mobile pricing → company journey both completed in the browser. Trackdub's existing post-deploy smoke passed for www normalization, public Web Bot Auth discovery, and both allowed development-origin waitlist preflights. All 11 non-web DNS records matched the captured pre-cutover configuration. No test subscriber or email was created.

## Initial implementation and preview

Local validation on October 24, 2026, using Bun 1.4.0 and the existing frozen lockfile:

- Trackdub production build: passed after the shared guide shell changes.
- Company TypeScript check and production/preview builds: passed.
- Company unit/document tests: nine passed, 333 assertions. Covers route metadata, local assets, portfolio destinations, noindex, exact legacy redirects, host/query handling, HTTP methods, and service-path isolation.
- Focused ESLint and `git diff --check`: passed after correcting one test regular-expression lint error. No dependency upgrades or lockfile changes.
- Actual local company Worker HTTP smoke: eight company routes return 200; unknown and product-service paths return real 404s; assets and exact legacy redirects pass; preview responses are noindex.
- Browser checks: all eight pages at 390, 768, 1024, and 1440px have one h1, no horizontal overflow, and no broken images. Mobile menu opens, closes with Escape, and has visible destinations. No browser warning/error entries were returned during the company checks.
- Product development build with `VITE_MESALIM_SITE_READY=true`: company return header verified on homepage, pricing, docs, changelog, privacy, guides, and guide detail. Each points to `https://mesalim.com/`; each page retains one main landmark. The return link remains visible at 390px. The committed default remains false until the company host is healthy.

The public preview was subsequently deployed at `https://mesalim-company-preview.trackdub.workers.dev`. The same HTTP smoke passed against that deployed Worker, and the rendered homepage was inspected. All three GitHub checks for implementation commit `ab079a8` passed: Company site checks, Code Quality: Push on main, and Push on main. Both preview and production Wrangler dry runs passed locally.

Read-only Cloudflare preflight through the existing Wrangler credential confirmed an active Mesalim zone, proxied apex/www web records, and no company Worker domain binding. The active redirect ruleset could be listed but reading its contents returned HTTP 403. No production company DNS, forwarding rule, or company deployment was changed.

These results do not establish live domain cutover, mailbox delivery, signup completion, field performance, official legal-name consistency, or startup-credit approval. A separate design evaluator could not run because its service hit a usage limit; desktop/mobile visuals were inspected directly instead.
