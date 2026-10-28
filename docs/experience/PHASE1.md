# Phase 1 — the sky

Branch `feat/sky-phase-1`, stacked on PR #2 (`feat/liam-rex-featured-projects`). Baseline: `BASELINE.md`. Captures: `baseline/` (before) and `after/` (headless Chrome with software WebGL, so they show the static sky; see below).

## What changed

- **A full-screen sky** replaces the two-column hero (`components/experience/`). The intro, the featured-project buttons and the index link are HTML over it; the 3D scene loads after the page and fades in.
- **Fixed positions.** `data/experience.ts` places the three featured stars by hand and folds Pulse's categories into three groups (climate & community, tools & data, worlds & writing). Other projects sit around their group at a spot derived from their name (`lib/experience/layout.ts`), so adding a project never moves the rest. The force simulation is no longer used on the home page.
- **Distinct featured stars.** TerraTrace has contour rings that open out when lit. Longsignal has bodies on their own orbits, with threads appearing between them when lit. Ashwake is an eclipse with an ember corona and drifting embers; lighting it dims everything else.
- **Moving around.** Slight parallax follows the pointer. Selecting a star drifts the camera to it (about a second; a little slower back) and opens a panel with Pulse's one line, `enter <project>`, `open site ↗` where there's an outside site, and `back to sky`. Clicking empty sky or pressing Escape goes back.
- **Keyboard and touch.** Each featured star has a button in the intro: Enter selects it, focus moves to the panel, and Escape returns focus to the button. Vertical swipes over the sky scroll the page (`touch-action: pan-y`); there's no drag-rotate or wheel zoom.
- **Static sky.** The same layout drawn as SVG (wide and tall framings). It shows while three.js loads, and is the whole sky with reduced motion or without WebGL, with a one-line note saying so. This fixes the baseline's blank area.
- **Tall screens.** The sky compresses horizontally, stretches vertically and steps the camera back, so the constellation sits above the intro; a selected star centres above the bottom panel.
- **Index.** The project list is now `#index` (old `/#projects` links still land on it), grouped by the three groups. The header links to it.
- **Type.** Instrument Serif for "curious everywhere." and project names; DM Sans for everything else. Palette from the blueprint (`#060914` void, `#ECE8DF` starlight, moss, silver-blue, lilac, ember).
- **Analytics.** New Plausible events: `Experience loaded` (`mode`: 3d or static), `Project selected` (`project`, `via`: sky or button), `Return to sky`. `Visit` and `Link click` unchanged.

## Acceptance tests (from CODEX_START_HERE.md)

| Test | Status |
|---|---|
| Pulse publish updates text without overwriting scene metadata | Met by design: scene settings live in `data/experience.ts`, words in `data/projects.json`. Tested with a simulated Publish on PR #2; no real Publish yet. |
| Featured nodes keep their position across reloads | Met; unit-tested (`lib/experience/layout.test.ts`). |
| All published projects reachable from a plain HTML index | Met; `#index` is server-rendered. |
| Keyboard-only, reduced-motion, no-WebGL users get a complete experience | Keyboard: tested (button → panel → Escape → focus back). Reduced motion: tested with Chrome's forced flag (static sky). No WebGL: same path as reduced motion, by code; not tested on a machine without WebGL. |
| Touch users can select projects while vertical scrolling works | Selection tested in mobile emulation. Scrolling is set up (`pan-y`) but **not tested on a real phone**. |
| TerraTrace selection → real media → project link → return | Not in this phase: Phase 2, blocked on media (below). |
| No major performance regressions | Home page JS is smaller (11.6 kB page, 106 kB first load, vs 13.9 / 108). Frame rate on low-end phones not measured. |
| Existing URLs, outbound links, analytics, metadata still work | Routes, sitemap and share images return 200; outbound links unchanged. |
| `npm run build` and `npm run test` pass | Yes: 58 tests (7 new). |

## Known issues

- The browser pane in the desktop app often shows a blank or stale canvas until it gets input; headless Chrome with software WebGL never draws the 3D scene (it falls back to the static sky there). Neither is the site; check on a real browser.
- Quiet-star labels in the climate group can overlap (wildready's long name). Hover/tap brings the right one forward.
- The old graph code (`components/graph/*`, `components/site/GraphLegend.tsx`, `lib/graph/*`) is no longer used by the home page. `lib/graph/categoryColors` is still used by project pages and `buildGraph` by the parity test. Left in place for now; remove once the parity test is retired.
- Browser Back doesn't close a selected star (Escape and `back to sky` do). Deep links to a focused star aren't supported yet.
- Copy: "curious everywhere." and the two intro lines are the existing ones; the blueprint's "space software, strange projects, occasional detours." was not used. Microcopy slots are empty.

## Notes for Phase 2 (the TerraTrace world)

- The star is ready to be a portal: `FEATURED_EXPERIENCE.terratrace` has `poster` and `previewVideo` slots, and the panel is where real media would appear.
- Candidate media: before/after lidar from `~/Projects/terratrace/dixie-poc/results/` (Dixie Fire). Needs Liam's OK to publish and an optimized poster/clip under `public/media/experience/`.
- The transition: contour rings already exist around the star; Phase 2 would grow them into a terrain surface as the camera arrives, then reveal the media.
- Ashwake's world is blocked on footage and on the Unreal/Godot question; Longsignal's can use a recording of longsignal.app.
