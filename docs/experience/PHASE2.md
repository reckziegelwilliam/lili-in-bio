# Phase 2 — the TerraTrace world (in progress)

Branch `feat/sky-phase-1` (PR #3). Plan: `EXPERIENCE_BLUEPRINT.md` §5 and Phase 2.

## Done

- **The approach.** Selecting TerraTrace drifts the camera in; its contour rings fade and about 6,500 points (3,200 on touch devices) gather from the space around the star into a forest of point-cloud conifers on rolling ground, in about 1.6 s. Deselecting dissolves them back. It echoes TerraTrace's lidar views but is generated: an impression of the medium, not its data (`ForestPortal` in `components/experience/SkyScene.tsx`).
- **The media slot.** `FEATURED_EXPERIENCE.<slug>` takes `poster`, `previewVideo`, `mediaAlt` and `mediaCaption`. The focus panel shows the media only when a poster and its alt text are set; video autoplays muted only without reduced motion (otherwise it shows controls). Nothing is set yet, so nothing shows.
- **Browser Back.** Selecting a star adds one history entry; Back, Escape and `back to sky` all close it and return focus to the button that opened it. A leftover entry after a reload or a project page is cleared on load.

## Waiting on Liam

**Real media for the reveal.** Candidates from `~/Projects/terratrace/dixie-poc/results/september-headroom-browser-qa/`: the viewer's 2018 (before the fire) and June 2022 (after) lidar views of the Dixie S02 patch. Rough crops for review were made outside the repo; none are committed.

Before publishing, decide:

1. Is it OK to show these views publicly? (`terratrace-demo.pages.dev` currently redirects, so the demo may be private.)
2. A fresh, high-resolution capture is better than the ~600 px QA screenshots, without the viewer's date overlay.
3. Framing: the viewer itself says small differences between dates are not evidence of growth or loss, so a before/after pair shouldn't be presented as showing fire damage.
4. `mediaAlt` (what the image shows) and an optional `mediaCaption` in Liam's words.

Then: save an optimized poster (and optionally a short muted clip) under `public/media/experience/terratrace/` and set the four fields.

## Not done

- A link from the world to the live TerraTrace demo: TerraTrace has no public site in Pulse (its link is its own project page).
- Longsignal and Ashwake worlds: started in Phase 3 (below).

# Phase 3 — Longsignal and Ashwake (transitions done, media pending)

- **Longsignal.** Selected, its orbiting bodies step back and about 130 small points (70 on touch devices) gather from its orbits into loose clusters; connections draw outward from the star and signals travel along them. No names, labels or values: an impression of the product, not findings (`NetworkPortal`).
- **Ashwake.** Selected, the eclipse widens into a dark opening ringed by its corona, and embers spiral in (`EmberVortex`). The opening is where real footage would go.
- **Shared.** One round-point texture for every point cloud (`useDotTexture`) and one progress helper (`stepProgress`).

Waiting on media for both: a recording of longsignal.app for Longsignal; for Ashwake, real footage and a decision on the "in Unreal" blurb (the current game is the Godot proving ground).
