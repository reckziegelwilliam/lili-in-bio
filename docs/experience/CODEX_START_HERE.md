# liamrex.world — Codex Start Here

**Read first:** [EXPERIENCE_BLUEPRINT.md](./EXPERIENCE_BLUEPRINT.md)

## Mission
Evolve `reckziegelwilliam/lili-in-bio` (`liamrex.world`) from a two-column portfolio with an interactive project graph into a visual-first, space-and-dream experience. Do not discard working data, accessibility, links or analytics.

## Existing architecture
- Next.js 14 / React 18 / TypeScript / Tailwind
- R3F v8 / Drei / Three.js / bloom / Framer Motion
- Project Pulse publishes `data/projects.json` — **never hand-edit this generated file**
- `data/featured.ts` owns featured lineup and presentation ordering
- Current home: `app/page.tsx`; canvas: `components/graph/GraphScene.tsx` and `GraphCanvasLoader.tsx`; accessible list: `components/site/ProjectRows.tsx`
- Internal routes `/projects/[slug]`; Plausible tracking, reduced-motion and HTML fallbacks already exist

## Implementation slice 1: foundation + sky + one portal

### 0. Record the baseline
1. Check out repository, run build/tests and record existing failures.
2. Capture desktop/mobile views, keyboard behavior, performance and WebGL failure behavior.
3. Inventory genuine screenshots and clips for TerraTrace, Longsignal and Ashwake.
4. Confirm Project Pulse schema/ownership and verify current project routes.

### 1. Separate presentation from generated content
1. Add `data/experience.ts` keyed by stable slug/ID, containing ONLY artistic metadata: positions, theme, poster/video, optional microcopy, transition preset.
2. Preserve descriptions, URLs, categories and public updates from Pulse.
3. Add three stable hand-authored featured project anchors; deterministically arrange secondary stars.
4. Build `components/experience/` alongside existing graph until replacement passes tests.

### 2. Turn the graph widget into an immersive sky
1. Replace two-column hero with near-full-viewport responsive sky.
2. `liam rex` + `curious everywhere.` appear immediately as readable, accessible HTML.
3. Featured stars are visually distinct: TerraTrace (contours), Longsignal (orbit/links), Ashwake (occlusion/embers).
4. Add restrained parallax, atmospheric depth, tactile focus, labels, and an obvious action on selection.
5. Keep `index` and all project links discoverable; maintain mobile scrolling, keyboard access and reduced-motion fallback.
6. Avoid new large dependencies, autoplay sound, long introduction or too many shaders.

### 3. Implement **one** complete world: TerraTrace
1. Star selection → smooth camera approach.
2. Starfield transitions into terrain/contours; reveal real TerraTrace media.
3. Show one readable sentence and a clear project link.
4. Back/Escape restores overview, state and keyboard focus.
5. Mobile, touch, low-power and no-WebGL cases must still expose content.
6. Do not build the other worlds until this is compelling and stable.

## Acceptance tests
- [ ] Project Pulse publish updates project text without overwriting scene metadata.
- [ ] Featured nodes maintain consistent position across reloads.
- [ ] All published live projects are reachable from a plain HTML index.
- [ ] Keyboard-only, reduced-motion and no-WebGL users get a complete experience.
- [ ] Touch users can select projects while normal vertical scrolling works.
- [ ] TerraTrace selection → real media → project link → return works.
- [ ] No major performance regressions relative to captured baseline.
- [ ] Existing project URLs, outbound links, analytics and metadata remain functional.
- [ ] `npm run build` and `npm run test` pass, or baseline issues are explicitly reported.

## Deliverables
Working preview branch/deployment, before/after captures, tests, known issues, and notes for the two remaining project portals. **Do not merge or deploy to production without review.**

## Subsequent stages
1. Longsignal data orrery, with real analytics/media.
2. Ashwake eclipse, with real game/environment footage.
3. Media-forward project pages and secondary discovery clusters.
4. Performance, accessibility, SEO and analytics hardening.
5. Optional speculative nature-integrated dwelling thought-world, clearly described as a future ambition.

**Design rule:** three memorable worlds with real substance beat fifteen shallow animation tricks.
