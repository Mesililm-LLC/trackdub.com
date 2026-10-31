# Review Guide

Use this file when reviewing pull requests in the Trackdub marketing site
(`MesilimLLC/trackdub.com`).

This is a reviewer checklist, not an authoring guide. For local commands, see
`README.md`. For agent Linear sync, see `AGENTS.md`.

This repo is the public marketing site (TanStack Start / React / Tailwind),
often edited via Lovable. Product API and portal auth live in `api.trackdub`
and `portal.trackdub`. Desktop/core work lives in `Trackdub` /
`Trackdub-gated`.

## Automated review (Bugbot)

If Cursor Bugbot (or similar) is configured for this repository, it should follow
this checklist. Human reviewers still own the final merge bar.

Bugbot should surface the same blocking issues as
[Automatic review stops](#automatic-review-stops) below (scope leaks, secret
commits, Lovable history rewrites, weak brand/first-viewport regressions when
explicitly in scope).

## Review priorities

Review in this order:

1. Correctness
2. Scope control (marketing site only)
3. Content accuracy and brand alignment
4. Frontend quality and accessibility
5. Secrets / env safety
6. Build evidence
7. Docs and Lovable sync safety

## Approval standard

Do not approve a PR if any of these are unclear:

- What changed
- What did not change
- What was tested
- What was not tested
- Whether copy, pricing, product claims, or CTAs changed
- Whether any product-backend or portal logic was incorrectly added here
- Whether published git history was rewritten

## Checklist

### 1. Scope

- [ ] The PR solves one clear marketing/site problem or one bounded slice.
- [ ] The PR description explicitly states non-goals.
- [ ] Unrelated cleanup is absent or clearly separated.
- [ ] No portal auth, Worker API, desktop, or pipeline work landed here.

### 2. Hard constraints

Treat these as request-changes items, not suggestions.

- [ ] No secrets committed (`.env`, API keys, tokens). Public Vite vars only
      when intentional and non-secret.
- [ ] No force-push, rebase, or history rewrite of already-pushed commits
      (Lovable sync depends on linear history).
- [ ] Branch stays in a working state for Lovable editor sync.
- [ ] Product claims stay honest. Do not fake readiness of desktop/cloud
      features that are not shipped.

### 3. Content and design

- [ ] Copy is accurate for current product state.
- [ ] CTAs and links resolve to the intended destinations.
- [ ] Visual work links Figma Design System / Notion specs when applicable
      (per `AGENTS.md`).
- [ ] First viewport stays coherent: brand-first, not a cluttered dashboard of
      competing promos (unless the change is explicitly an interior page).
- [ ] Avoid em dashes in user-facing prose.

### 4. Frontend quality

- [ ] Responsive behavior considered for desktop and mobile.
- [ ] Accessibility basics hold for new interactive controls.
- [ ] Performance-sensitive assets (images, fonts) are intentional.
- [ ] No unnecessary new backend/database surface for a static marketing need.

### 5. Tests and verification

- [ ] Build / typecheck / lint / preview commands actually run are listed.
- [ ] Skipped checks are named and justified.
- [ ] Visual changes include enough evidence (screenshots or live preview
      notes) to review.
- [ ] The PR does not claim broader verification than was actually run.

### 6. Docs

- [ ] `README.md` / `AGENTS.md` remain accurate if tooling or deploy notes
      changed.

## Automatic review stops

Request changes immediately if a PR does any of the following:

- Commits secrets or private credentials.
- Force-pushes or rewrites published history on a Lovable-connected branch.
- Lands portal/API/desktop product logic in this marketing repo.
- Ships false product readiness claims.
- Claims validation that the PR body does not support with exact commands.

## Review comment style

Prefer comments that are concrete and falsifiable:

- Point to the exact file or behavior.
- State the risk.
- State what evidence is missing.
- Suggest the narrowest acceptable correction.

Good review comments usually sound like:

- "This CTA claims a shipping feature that is still backlog. Soften or link
  waitlist only."
- "`.env` with secrets was committed. Rotate and remove from history carefully
  without Lovable-breaking force-push unless ops explicitly owns it."
- "This PR rewrites pushed commits. Lovable sync will lose history."
- "No build or preview evidence listed for the homepage visual change."

## Minimum merge bar

A PR is ready to merge when:

- The scope is still marketing-site only.
- Content claims remain honest.
- Validation is honest and adequate.
- Lovable sync / history safety still holds.
