# Phase 0 baseline — before the sky

Recorded 2026-10-27 on `feat/liam-rex-featured-projects` (PR #2, commit `72fc672`), production build (`next build && next start`) on a local Mac. Plan: `EXPERIENCE_BLUEPRINT.md` / `CODEX_START_HERE.md`.

## Build and tests

- `npx tsc --noEmit`: clean.
- `npm test`: 51 passed (12 files).
- `npm run build`: passes. `/` 13.9 kB page JS, 108 kB first load; `/projects/[slug]` statically generated for longsignal, terratrace, ashwake.
- `npm run lint`: not configured (opens Next's interactive ESLint setup), so not run.
- Known future failure: `data/projects.parity.test.ts` compares `data/projects.json` with the one-time seed; it will fail after the first Pulse Publish and should be retired then.

## Load (local, unthrottled, so only a reference point)

Measured in the desktop app's browser pane at 861×934:

| Measure | Value |
|---|---|
| First contentful paint | 144 ms |
| Largest contentful paint | 144 ms (the `curious everywhere.` heading) |
| Cumulative layout shift | 0 |
| JavaScript transferred | 364 KB in 14 files (includes three.js, loaded after the page) |

Field numbers (p75 LCP, INP) need real traffic; Vercel Speed Insights or Plausible can collect them after launch.

## Captures

`baseline/home-desktop.png` (1440×900), `baseline/home-mobile.png` (390×844), `baseline/project-terratrace-desktop.png`, from headless Chrome with software WebGL (SwiftShader).

Finding: in the headless capture the graph's half of the hero is **empty**. The canvas did not draw there, and nothing stands in for it, so a visitor whose WebGL is slow or missing sees a blank area. The project list below still works.

## Interaction

- Mouse: hover lights a group; click opens the preview; drag orbits; the wheel scrolls the page.
- Touch: horizontal drag orbits, vertical swipe scrolls (from code; not tested on a real phone).
- Keyboard: Tab reaches the header, the legend buttons and every project row. Points in the graph are **not** reachable by keyboard; the rows are the keyboard path.
- Reduced motion: the canvas is skipped and the hero shows text only.
- No WebGL: not handled separately; the canvas fails and the area stays blank.

## Data contract (Project Pulse)

- `data/projects.json` is written by Pulse on Publish; never edited here. Export version 1 today; the site also accepts version 2.
- Pulse fields per project: name, href (https), category, description, audience, optional thumbnail, recentImprovements (`#public` log lines, only for rows with a Slug), subLinks.
- `data/featured.ts` names the featured three and holds a stopgap copy of their rows until a Publish includes them (rows were added to `_portfolio/public.md` and are unpublished).
- Pulse has records for Ashwake (`status/ashwake.md`, Godot, building) and Indie Orrery (the product behind longsignal.app's Vercel project). None for TerraTrace.

## Media inventory (for the worlds)

| Project | Real material on this Mac | Notes |
|---|---|---|
| TerraTrace | `~/Projects/terratrace/dixie-poc` — Dixie Fire study: before/after lidar tiles (1716 per side, several builds under `results/`), Sentinel-2 burn-severity code, a 3D compare viewer (`src/compare.ts`, `src/forest-point-renderer.ts`). Deployed demo `terratrace-demo.pages.dev` answers with a redirect (possibly private). | Strongest material. Needs Liam's OK to publish, and a poster/clip made from it. The blueprint's "drone imagery" wording doesn't match: it's lidar and satellite data. |
| Longsignal | `longsignal.app` (live, 200) can be screen-recorded. `~/Projects/www-observatory/docs/design/long-codex-recovery/assets/` has two preview PNGs, which may be design mockups. | Use the live product; don't use mockups as product evidence. |
| Ashwake | `~/Projects/ashwake`: development evidence renders (greybox, cloth-asset audits under `assets/reference/gate_c/` and `docs/superpowers/plans/*-evidence`). `inspo/` holds others' art — **not usable**. No gameplay footage. | The site's blurb says "in Unreal"; real footage would come from the Godot game. Needs a decision before the eclipse world. |

## Decisions recorded for Phase 1

- The six Pulse categories fold into three affinity groups (climate & community · tools & data · worlds & writing) for the sky and the index.
- Microcopy slots exist in `data/experience.ts` but are left empty: public words are Liam's.
- Featured stars get fixed, hand-placed positions; other stars are placed deterministically by group.
