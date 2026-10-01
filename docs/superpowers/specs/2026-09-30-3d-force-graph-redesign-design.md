# lili-in-bio: 3D force-graph redesign

## Summary

Replace the current vertical scrolling list of category-grouped link cards with an interactive 3D force-directed node graph, rendered in real WebGL (react-three-fiber), as the primary way visitors browse projects on lili-in.bio. Projects orbit a central "lili" hub, connected by real 3D geometry (not CSS), lit with real materials, and glowing via real bloom post-processing. The page keeps serving three goals roughly equally: visitors clicking through to a project, getting an impression of the owner's taste/personality, and spending time exploring/playing with the page itself.

## Goals

- Make the page feel more engaging and creative without reviving the complex features already scrapped from the original README (Reading Modes, Text Upgrade Tool, Visitor Snapshot card, Mini Systems Library, Interaction Style Chooser).
- Replace the flat scrolling list with a 3D force-directed graph: a center hub node plus one node per project, connected by real 3D line geometry, with secondary edges between projects that share a category.
- Use genuinely volumetric 3D (real lit sphere/cylinder meshes), not CSS transforms faking depth — this page doubles as an engineering portfolio piece per the existing README, so the implementation technique matters.
- Real bloom/glow via post-processing reading actual emissive materials — not a CSS box-shadow.
- Confirmed mobile-safe: touch detection drives a cheaper rendering path (capped pixel ratio, no antialiasing, lower geometry detail, slightly reduced bloom cost).
- Clean up now-confirmed-dead code left over from the scrapped features as part of this work.

## Non-goals

- Not reviving Reading Modes, Text Upgrade Tool, Visitor Snapshot card, Mini Systems Library, or Interaction Style Chooser. These were deliberately cut; this redesign does not bring them back.
- Not building the Radar/Signal Console or a visitor-context-driven camera (source/time-of-day affecting the scene). These were explored as alternative directions during brainstorming but not selected as the core structure. The only piece carried over is optional node-brightness-by-recency (see "Node emphasis" below), which is a small detail, not a different concept.
- Not changing the underlying project data source (`data/projects.ts` stays the source of truth for names, links, descriptions, categories).
- Not changing analytics providers (Plausible stays; event shapes are preserved, see "Analytics").

## Current state (for reference)

`app/page.tsx` renders a single scrolling column: an animated CSS "aura" gradient background, a light/auto/dark `ThemeToggle`, then `projectsByCategory` rendered as glassmorphic cards grouped under category headers, a hardcoded "wildready" callout near the bottom (duplicating its own category card), and a GitHub link footer. Three of the nine projects (`wefrigerator`, `liams.log`, `drip-e`) show a live embedded preview inside their card; one (`this might be fun`) has three sub-links.

Confirmed dead code tied to the scrapped README features (zero references outside their own file): `components/BetaSignup.tsx`, `components/UpgradeTool.tsx`, `components/InteractionChooser.tsx`, `components/MiniSystemsLibrary.tsx`, `components/ReadingModeToggle.tsx`, `components/SaveForLater.tsx`, `components/TechPeek.tsx`, `components/VisitorSnapshotCard.tsx`, plus their backing routes `app/api/upgrade/route.ts` and `app/api/beta-signup/route.ts`. These get deleted as part of this work (see "Cleanup").

## Design

### Core structure

One center hub node ("lili") plus one node per enabled project in `data/projects.ts` (9 today). Two kinds of edges, both real 3D cylinder geometry, not decoration:

- **Hub spokes** — every project connects to the center. Brighter, thicker (matches what was validated in the browser prototype).
- **Relationship edges** — projects sharing a `category` connect to each other directly. Dimmer, thinner. This reuses the existing category field; no new relationship metadata is introduced.

### Rendering approach

- **react-three-fiber** (`@react-three/fiber`) + `three`, loaded as a client-only component via `next/dynamic({ ssr: false })` — WebGL has no server-rendered equivalent, and this avoids shipping the three.js bundle to the initial server-rendered payload.
- **Nodes**: `SphereGeometry` meshes, `MeshStandardMaterial` with `metalness`/`roughness` and an `emissive` color matching the project's category color, so they catch real lighting (validated in the browser prototype — the specular highlight visibly moves across the surface as the scene rotates, which a flat CSS gradient cannot do).
- **Edges**: a single reusable function builds a `CylinderGeometry` oriented between two `Vector3` endpoints via quaternion rotation (`Quaternion.setFromUnitVectors`), called once per spoke and once per relationship edge. This was prototyped and confirmed working.
- **Lighting**: ambient fill + one directional key light + one colored point light for rim definition (as prototyped).
- **Glow**: real post-processing bloom. In the browser prototype this used `three/examples/jsm/postprocessing/{EffectComposer,RenderPass,UnrealBloomPass}`; in the actual Next.js app, use `@react-three/postprocessing` (the pmndrs package built for react-three-fiber) with its `Bloom` effect instead — same underlying technique (reads scene luminance/emissive, respects depth and occlusion) but is the idiomatic, better-integrated choice for an R3F component tree rather than wiring the imperative three.js composer by hand.
- **Layout/physics**: a small custom force simulation (spring attraction along edges, repulsion between all node pairs, damping) runs on mount to settle node positions, matching the "Force-Directed System Graph" concept — not a hand-placed static layout. At 9-10 nodes this is cheap; no physics library needed.
- **Rotation/interaction**: `@react-three/drei`'s `OrbitControls` drives camera orbit on drag (desktop and touch both supported by the library). Clicking/tapping a node opens that project's detail (see "Node interaction detail" below) via react-three-fiber's built-in pointer events — no manual raycasting code needed.

### Node interaction detail

The three.js prototype only validated hover-style labels, not a full detail state — the live embedded previews (`wefrigerator`, `liams.log`, `drip-e`) and `this might be fun`'s three sub-links need somewhere to live. Proposed (not yet visually validated — flag if this isn't what you pictured):

Tapping/clicking a project node opens a lightweight 2D overlay panel (ordinary HTML/CSS, outside the canvas) showing that project's description, its embedded preview if it has one, its sub-links if it has them, and a clear "Open" link that navigates out. This serves both the "click-through" and "explore" goals from one interaction instead of navigating away immediately on first tap. Clicking the center "lili" hub resets/recenters the camera rather than navigating anywhere.

### Node emphasis (optional, small)

Node size and emissive intensity can scale slightly with a simple status signal already present in the data (`recentImprovements` presence/recency, and conceptually "piloting" vs. stable), so the most recently-touched or actively-piloted project (e.g. `wildready`) reads as marginally brighter/larger — this replaces the old hardcoded "wildready" duplicate-callout section with a data-driven equivalent instead of a special-cased component. This is the one piece carried over from the "Telemetry Orbit" alternative explored during brainstorming; cut it if you'd rather all nodes read as equal weight.

### Visual theme

The scene is dark-only (fixed space-black background), not theme-toggled. Bloom and a light/white background fight each other visually, and every validated mockup was dark. The existing `ThemeToggle` (light/auto/dark) is removed from this experience. Flag if you want light mode preserved some other way.

### Mobile & performance (validated)

Confirmed via actual Chrome DevTools device emulation (390×844, touch enabled, 3x device pixel ratio, 4x CPU throttle) — not assumed:

- Detect touch via `matchMedia('(pointer: coarse)')`.
- Cap `devicePixelRatio` at 1.5 on touch devices vs. up to 2 on desktop.
- Disable antialiasing and reduce sphere segment count on touch devices.
- Slightly reduce bloom strength on touch devices (post-processing passes are the most expensive part of this scene).
- Result: renders with no console errors under 4x CPU throttling; bloom and geometry remain visually correct.

### Accessibility & SEO fallback

A WebGL canvas has no crawlable or screen-reader-accessible content. Add a visually-hidden (`VisuallyHidden`, already in `components/AccessibilityUtils.tsx`) list of real `<a>` tags — one per project, with its name, description, and href — rendered alongside the canvas. This also respects `prefers-reduced-motion`: when set, skip auto-rotation/physics settling animation and present a static or list-first view rather than a moving scene. `SkipToContent` (already present) should point at this fallback list as the keyboard-accessible path.

### Analytics

Preserve existing Plausible event shapes: fire `Visit` once per session load (same props: source/device/lang/returning/browser/dark — though `dark` becomes moot once the scene is dark-only, consider dropping that prop), and `Link click` with the same `destination`/`source`/`device` props when a node's detail panel's "Open" link is clicked (and for each sub-link, as today).

### Cleanup (in scope, not a separate refactor)

Delete the confirmed-dead files tied to the scrapped features: `components/BetaSignup.tsx`, `components/UpgradeTool.tsx`, `components/InteractionChooser.tsx`, `components/MiniSystemsLibrary.tsx`, `components/ReadingModeToggle.tsx`, `components/SaveForLater.tsx`, `components/TechPeek.tsx`, `components/VisitorSnapshotCard.tsx`, `app/api/upgrade/route.ts`, `app/api/beta-signup/route.ts`. Remove the now-unused `openai` and `resend` dependencies from `package.json` and the matching env vars from `env.example` and the README quick-start. Update the README to describe the actual current page instead of the aspirational original feature set.

### New dependencies

`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing` (peer dep of the above). No import-map concerns in the real app — this only came up because the throwaway browser prototype loaded three.js straight from a CDN via native ES modules; the real app bundles everything through Next.js's normal module resolution.

## Testing / verification plan

- Visual: confirm the graph renders correctly in light of day on an actual phone, not just emulation, before calling this done.
- Confirm `prefers-reduced-motion` and the accessible fallback list both work with JS/canvas disabled.
- Confirm Plausible events still fire with the same prop shapes (check the Plausible dashboard after deploying, per the existing portfolio status note to "check Plausible analytics").
- Confirm the two API routes and their components are safely unused before deleting (already verified via grep — zero references outside their own files).

## Open questions for review

1. Node-interaction detail panel (hover/click → inline overlay with embedded previews and sub-links) is a new design decision, not something shown in the browser prototype. Confirm this is the right shape before it's built.
2. Dropping the light/dark `ThemeToggle` entirely in favor of a fixed dark scene — confirm, or propose an alternative if you want light mode kept.
3. "Node emphasis" (brightness/size tied to recency/pilot status) is optional — confirm whether to include it or keep all nodes equal weight.
