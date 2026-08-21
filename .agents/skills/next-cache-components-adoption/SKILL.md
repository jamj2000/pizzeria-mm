---
name: next-cache-components-adoption
description: >
  Turn on Cache Components in a Next.js app and resolve the blocking routes it
  surfaces. Use when the user wants to enable, adopt, or migrate to Cache
  Components, flip the `cacheComponents` flag, work through a flood of
  blocking-prerender / instant validation errors, run the
  `cache-components-instant-false` codemod, or decide between opting routes out
  with `export const instant = false` and fixing them in place.
---

# next-cache-components-adoption

Enable Cache Components on an app and walk it to a passing build. This skill sequences the work; per-error recipes live in the dev overlay fix cards and the build's terminal output. The [migrating to Cache Components guide](https://nextjs.org/docs/app/guides/migrating-to-cache-components) is the canonical reference for the concepts and per-API recipes this skill applies — consult it whenever the skill steps reference a pattern (`"use cache"`, `cacheLife`, `<Suspense>` placement, etc.) and you want the full explanation.

## requires

- **App Router project.** Cache Components is an App Router feature; `cacheComponents: true` does nothing for `pages/` routes. If the project has a `pages/` or `src/pages/` tree but no `app/` or `src/app/` tree, stop and tell the user — Pages → App migration is its own project, not part of this skill. A hybrid app (both `pages/` and `app/`) is fine: the flag affects the `app/` routes; `pages/` routes are unaffected and don't need opt-outs.

- **A resolved app directory.** Locate `next.config.{js,ts,mjs,cjs}` first: that's the project root, and an agent invoked from a subdirectory would otherwise test for `app/` against the wrong `cwd` and find nothing. Look for `app/` and `src/app/` under it, and treat every command and glob in this skill as relative to whichever one exists. If both exist, Next.js builds `app/` and never looks at `src/app/`, so its routes are shadowed and unbuilt — tell the user that and ask which tree to migrate instead of picking one.

- **A runnable app.** The whole loop verifies against `next dev` and a browser, so the app has to boot. If it reads a database or required env at import (e.g. an `env.ts` that throws on a missing `DATABASE_URL`), confirm it actually starts — with the real environment, or local data you stand up — before step 1. Adoption can't be verified against an app that won't run.

- **Next.js 16.3 or later.** That release is where the pieces this skill relies on land: top-level `cacheComponents`, `export const instant`, the dev-overlay instant-navigation validation warnings, and the `cache-components-instant-false` codemod. If `next --version` reports below 16.3, upgrade first:
  - `npx @next/codemod@latest upgrade latest` to apply the version-to-version codemods.
  - Read the relevant [version upgrade guide](https://nextjs.org/docs/app/guides/upgrading) (e.g. [Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16)) for what the codemod doesn't cover.

- **No incompatible config keys.** `cacheComponents: true` errors on any file that still exports `dynamic`, `revalidate`, or `fetchCache`. **Translate, don't delete.** Each export encodes behavior the route needs to keep doing; migrate each one to its Cache Components equivalent via the [migration guide's per-key sections](https://nextjs.org/docs/app/guides/migrating-to-cache-components#enable-cache-components). The exception is `dynamic = 'force-dynamic'`: under Cache Components every route is already dynamic by default, so the migration guide removes it outright rather than translating it — don't overthink a batch of identical `force-dynamic` deletions. `revalidate` and `fetchCache` still need real translation. If a value can't be cleanly translated yet, leave a `// TODO: Cache Components adoption — restore revalidate = 3600` comment so the loop picks it up. The `cache-components-instant-false` codemod does not touch these.

- **`experimental.dynamicIO` is fatal.** It was renamed to top-level `cacheComponents` and the old key now aborts before any build can run — remove it (or replace with `cacheComponents: true`) first. `experimental.useCache` is still accepted as a deprecated alias; redundant once `cacheComponents: true` is set, so remove it for clarity.

### notes

- **No passing baseline before the flag.** If the app already uses `"use cache"`, the pre-flag build errors with `please enable the feature flag cacheComponents`. Enabling the flag is the first thing you do (in Incremental, before the codemod; in Direct, before fixing routes) — not a thing to do _after_ getting a passing build. Note this in your starting summary so it doesn't read as a regression.

- **Offline docs.** Guide links have offline copies under `node_modules/next/dist/docs/` (bundled since Next.js 16.2), with the directory layout numbered for ordering (e.g. `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`). If you can't predict the numbered prefix, `find node_modules/next/dist/docs -name '<slug>.md'` resolves it. The `/docs/messages/*` error pages are not bundled.

- **Older versions without bundled docs.** Suggest `npx @next/codemod@latest agents-md` to the user before starting: it downloads a version-matched copy to `.next-docs/` and writes an index into `AGENTS.md` / `CLAUDE.md`. It touches files in their repo, so ask first and run it only if they want it.

## the shape of the work

There's one loop: walk the route tree top-down, one feature at a time, adopting each route against `next dev` + a browser. The build is a final check for each feature, not the working surface.

The choice in step 1 is whether to opt every route out of validation first or fix routes as you go. Either way the loop is the same:

- **With a quiet pre-step (Incremental).** Run the codemod to opt every page and layout out of validation. Once you've also fixed what the codemod can't (sync-IO calls, leftover `revalidate`/`dynamic`/`fetchCache` exports), the build passes; you ship that as its own PR and then start the loop — removing one opt-out at a time and adopting that route. This splits the work into small, reviewable PRs.
- **Without (Direct).** Enable `cacheComponents` and start the loop on whatever the build flags first. Same loop, but every fix sits on one branch until adoption is complete.

In both, the per-route success bar is the same: **dev loop reports no errors AND `next build` passes**. Check in with the user after every feature, and suggest a commit but never make one without their confirmation. Expect to spend most of the time in the loop, not in the pre-step.

## background

`cacheComponents: true` requires every route to be prerenderable. A route that reads request-time data outside `<Suspense>` is "blocking" and fails the build. `export const instant = false` marks a route as allowed to block, which clears it in both dev and build; on a layout it covers the whole subtree during the build, but client navigations still validate each descendant segment on its own. Reads wrapped in a [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) function count as cache boundaries, not blocking reads.

Three classes of blocker come up, usually in this order:

1. **Request-time reads** (`cookies()`, `headers()`, `await params`, `await searchParams`). All four block when awaited at the top of a page or layout. `params` and `searchParams` often get missed because they're not framed as "request data" the way cookies and headers are. The fix is to push the read into a `<Suspense>`-wrapped child — and for `params`/`searchParams`, forward the promise into the child and await it there; don't `await` at the page top.
2. **Sync-IO at module/render time** (`new Date()`, `Date.now()`, `Math.random()`, `crypto.randomUUID()`). These fail the build even with `instant = false` — the opt-out doesn't suppress them. If they're in a shared layout, they block every route under it. The codemod can't fix them; after running it, use the build errors to identify which calls to translate by hand (see the [incremental pre-step](#incremental)).
3. **`"use cache"` files that read request data.** A file with a top-level `"use cache"` directive can't export `instant`; combining the two errors with `Only async functions are allowed to be exported in a "use cache" file.`, which means the directive was wrong for that route. Remove it before running the codemod.

## working surfaces

### finding blocking routes

Prefer `next dev` over `next build` while you work.

- **`next dev`** — the working surface. Visit a route; its blocking errors surface in the dev overlay with full stack traces and fix cards linking the per-error docs. Work one route at a time — errors don't accumulate in one place. The route itself still returns HTTP 200, so read the overlay (or `.next-dev.log`), not status codes. A cleared overlay is one half of calling a route clean — the other half is browser verification and a passing build for that route.
- **`next build`** — detection only. The build is `next dev`'s authoritative check, not its replacement. Use it as the last gate on each feature in the loop (a passing build is part of the per-route success bar) and as the final verification across the whole app. In Incremental, the build also confirms the pre-step (codemod opted every route out, no shared layout still has a sync-IO blocker) before you ship that PR. Don't reach for the build instead of the dev loop while you're working a route — a passing compile doesn't tell you what ended up in the static shell and what streamed. By default the build stops at the first blocking route, so it's also poor for sizing the work. Two flags help when iterating: `--debug-build-paths` builds only the routes you name, and `--debug-prerender` disables early exit so the build continues past the first prerender failure, reports every blocking route, and prints a fuller stack trace.
