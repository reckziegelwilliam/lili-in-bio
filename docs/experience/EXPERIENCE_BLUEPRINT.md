# liamrex.world — Experience Blueprint

**Working design concept:** *An observatory between worlds*  
**Site:** https://liamrex.world  
**Direction:** Equally space-like and dreamlike. A living, responsive personal universe, with real work and real interests embedded inside it.  
**Status:** Product/design proposal, not an implemented redesign.

## 1. The idea

Liam's personal website should feel like discovering a tiny impossible place on the internet. It should communicate through space, light, material, motion, proximity, and surprise **before** asking the visitor to read. The work inside it is real: spacecraft software, climate/geospatial exploration, founder intelligence, games, tools, writing, and long-term curiosity about adaptable homes that belong to nature.

**The promise to visitors:** "Move around. Something interesting is here."

The website is neither a portfolio with a 3D ornament nor a compulsory interactive art film. It is a *useful place that happens to feel alive*.

### Desired feeling

- **Space:** scale, silence, navigation, stars, orbit, distant signals, mystery.
- **Dream:** fog, softness, ambiguous transitions, floating places, unexpected transformations, organic movement.
- **Human:** wit, imperfection, warmth, evidence of a person rather than a brand.
- **Real:** projects, playable demos, meaningful links, discoveries, writings, and working software.

### Design test

After 30 seconds, a visitor should know: Liam builds unusual things; there is a lot to explore; the site has a distinctive point of view. After two minutes, they should be able to open at least one real project and understand why it exists. A recruiter or collaborator must be able to bypass the atmosphere and reach real work immediately.

## 2. What the existing site already has

Checked against the current GitHub repository `reckziegelwilliam/lili-in-bio` and the live page's exposed content.

- Next.js 14 App Router, React 18, TypeScript, Tailwind.
- Three.js + `@react-three/fiber` v8, Drei, postprocessing bloom; Framer Motion available.
- A force-directed 3D project graph in a two-column hero, star-category highlighting, project selection and a panel.
- Readable HTML project rows, internal featured-project pages, privacy-friendly Plausible event tracking.
- Reduced-motion detection, a scene loader, pointer/touch accommodations, and an HTML-first fallback.
- Projects published from **Project Pulse** into `data/projects.json`. This is a generated source; do **not** hand-edit it. Featured names/presentation live separately in `data/featured.ts`.

**Retain:** project URLs, data pipeline, accessible HTML links, tracked outbound actions, featured list, and the core 3D foundation.  
**Change:** the two-column graph-as-widget feeling, uniform nodes, weak project previews, largely textual project pages, and lack of a central visual narrative.

## 3. Information architecture: three layers, not a maze

### Layer A — The sky (home)

A full-width, nearly full-viewport spatial field. Liam's name and `curious everywhere.` are unobtrusive, readable HTML over the environment. Three prominent destinations are clearly discoverable: **TerraTrace**, **Longsignal**, and **Ashwake**. Smaller stars lead to other work, writing, found objects and experiments. The environment feels large, not crowded.

### Layer B — The worlds (project focus)

Selecting one of the three featured stars brings the visitor near a distinct visual environment. The page moves from abstract celestial material toward actual project media. One useful sentence and a clear `enter project` or `see the work` action accompany each scene. Do not require anyone to find a hidden hotspot to visit the project.

### Layer C — The index (fast navigation)

An obvious `index` link opens a simple, searchable/browsable DOM directory with all live projects. Use the current HTML project list as the baseline. It remains accessible if WebGL is absent, motion is reduced, performance is poor, or the visitor simply prefers direct navigation. Preserve routes like `/projects/terratrace`.

**Recommended global UI:** `liam rex` at top left; `index` and an unobtrusive `about`/`notes` entry at top right; `back to sky` when focused. Social links can remain in the index/footer. Avoid a heavy header or decorative floating controls.

## 4. A first-visit sequence — storyboard

**00 — Arrival / stillness.** A deep, nearly-black indigo field and scattered dim points. No forced intro or loading spectacle. The title appears promptly; the atmosphere fades in after core content. One faint line bends between the stars. No autoplay sound.

**01 — First response.** Moving the pointer changes the field with very slight parallax. Near a significant star, nearby light warms and a short project name appears. On touch, a tap selects a star; a second clearly labeled action enters it. A visitor can always press `index`.

**02 — Recognition.** The field is no longer a generic random star map. Featured nodes have distinct silhouettes and environmental cues. TerraTrace has a slowly evolving terrain contour; Longsignal has relational threads and orbiting data; Ashwake has a dark eclipse/ember aura. The contrast is discernible even with colors muted.

**03 — Approach.** Selecting a star initiates a camera drift, not a hard zoom. Background stars slide outward, the destination gains clarity, and a lightweight preview resolves into genuine project imagery. Keep direct navigation in reach throughout, and allow Escape/back to abort or exit.

**04 — Encounter.** The selected world's foreground reveals something *real*: TerraTrace reconstruction comparison, a Longsignal insight or interface, Ashwake footage or environment. Minimal accompanying words make the imagery understandable. `View project`, `open demo`, and `back to sky` are easy to find.

**05 — Return / discovery.** Returning to sky is smooth and predictable. A small secondary cluster might invite discovery: other climate tools, writing, books, unusual experiments. A visitor is never forced to follow a prescribed route.

**06 — Revisits.** Returning visitors see the same essential map, perhaps with one subtly emphasized recently updated node. Do not randomly relocate every project between visits; spatial memory is part of the experience.

## 5. The project worlds

### TerraTrace — 'the forest within the stars'

- **Celestial cue:** Green-silver star with contour rings, faint point-cloud motes.
- **Approach:** Points of light gradually align into elevation contours, then into a forest or terrain outline. Fog becomes atmospheric distance over a landscape.
- **Reveal:** An actual reconstruction, preferably a before/after that demonstrates a specific research problem such as added drone imagery changing the reconstructed canopy.
- **Microcopy:** `a landscape is not the same thing as our picture of it.` (optional, editorial; factual content should be grounded in the project.)
- **Action:** `explore TerraTrace`; optional `what changed?` explaining a real engineering observation.
- **Core emotion:** Quiet wonder, careful observation, nature meets instrumentation.

### Longsignal — 'the data orrery'

- **Celestial cue:** Small orbiting bodies and fine relational lines; a living network rather than dashboard cards.
- **Approach:** A few orbiting signals connect; edges become company relationships; a small cluster resolves into an understandable example.
- **Reveal:** Real data visual, an entity resolution example, or a real product UI recording. Do **not** fabricate business findings for the sake of a pretty visual.
- **Microcopy:** `there are patterns hiding in plain sight.`
- **Action:** `explore Longsignal`; optional `see the underlying problem`.
- **Core emotion:** Investigation, discovery, intelligence emerging from scattered observations.

### Ashwake — 'the eclipse'

- **Celestial cue:** An occluded star, dark-red/amber rim, almost imperceptible drifting embers.
- **Approach:** Light recedes; a partial eclipse forms; one portal-shaped silhouette reveals the actual game environment.
- **Reveal:** Short gameplay/environment footage, not an unrelated fantasy render. Let the game art carry the atmosphere.
- **Microcopy:** `somewhere less hospitable.` or another naturally dry line.
- **Action:** `enter Ashwake` / `see development`.
- **Core emotion:** Curiosity mixed with unease, the uncanny and cinematic.

### The outer constellation — smaller projects

The site contains more than the featured three: oesis, Wildready, recovery navigator, wefrigerator, this might be fun, liams.log, drip-e, artistOS and others as published. These should appear as smaller discoverable stars and as plainly accessible links in the index. Organize by **real affinities** (climate/community; tools/data; worlds/writing), not arbitrary decorative category colors. Hover/tap reveals a sentence and thumbnail if available. A focus panel can send visitors directly to the actual project without building a bespoke 3D world for each one.

### An optional fourth 'unformed world' — future dwellings

A distant, half-resolved constellation subtly resembles a growing shelter, leaf, or structure. If opened, it contains a short *thought in progress* about homes that adapt to climate, inhabitants and ecosystems. It must be presented as an ambition/question, **not** as a startup or prototype that already exists. This can enter in a later phase, after the real project experience works.

## 6. Visual language

**Color / lighting** (starting palette, subject to visual tests):

| Role | Proposed color | Usage |
|---|---|---|
| Ink / deep space | `#060914` | The primary void |
| Midnight | `#0C1428` | Subtle depth / fog |
| Warm starlight | `#ECE8DF` | Primary readable type and major highlights |
| Silver-blue | `#9BB9D2` | Distant stars and atmospheric edges |
| Muted lilac | `#A99BC8` | Dream haze, rare glow |
| Moss / sea glass | `#85B3A2` | Ecological signals (TerraTrace), restrained |
| Ember | `#C58162` | Ashwake / warmth |

**Rule:** Colors are not six loud category badges. Light, material, scale, spacing, and motion distinguish worlds. Limit strong bloom and use bright white sparingly.

**Typography:** One literary or quietly expressive display face for rare phrases; one legible, straightforward sans for interaction and project content. Don't use tiny sci-fi microtype as navigation. `curious everywhere.` remains; avoid slogan overload.

**Composition:** Negative space is an essential asset. Aim for 3 clearly brighter stars, a quiet supporting cluster, and no visually equal 12-node scatter. Gradients should be spatial atmospheric lighting, not CSS marketing gradients.

**Texture:** Soft volumetric suggestions, subtle film grain only if cheap and not harmful to reading; fog, fine thread-like lines, particle clusters. No constant particle fireworks.

**Personality:** Occasional tiny dry captions. Some asymmetry. No résumé statistics, fake terminal, sci-fi HUD, skill progress bars, or startup buzzwords.

## 7. Motion and interaction rules

- **Ambient:** Very slow motion, imperceptible over a second, noticeable over several seconds. Quiet should dominate.
- **Hover/focus:** 150–250 ms for local brightness/labels; readable, tactile.
- **Camera approach:** roughly 700–1100 ms for a project focus, tuned by perception and device; easing should feel weighted, not springy or bouncy.
- **Scene return:** A little slower than approach, but no endless cinematic delay.
- **Micro-transformations:** Stars to forest contours, orbit to relationship graph, eclipse to game footage. Show each one well rather than adding dozens of gimmicks.
- **Pointer:** No mandatory custom cursor. Hover must be reinforced by labels and clear click targets.
- **Touch:** Tap to inspect, tap an obvious CTA to enter; never rely on hover or long-press. Vertical swipe should scroll the page.
- **Keyboard:** Tab reaches projects and navigation in sensible order; Enter opens; Escape closes selection and returns to sky. Focus is visible.
- **Reduced motion:** Static illustrated sky and normal project index. No disappearing content or inaccessible project information.
- **Sound:** None by default. Optional opt-in spatial audio is a post-launch experiment, not in MVP.
- **Surprise:** One or two delicate anomalies are enough: a distant star briefly resolves into a tree, a cluster rearranges slightly, or a floating fragment of writing is discovered. No random locations for important links.

## 8. Page content and copy hierarchy

The design should communicate approximately in this order: **visual feeling → curiosity → project name → actual work → optional explanation.** Text is a guide, not the primary canvas.

Proposed homepage copy:

> liam rex  
> **curious everywhere.**  
> `space software, strange projects, occasional detours.`  
> `move around a little` / `or use the index`

This is illustrative copy, not required final language. Don't overexplain the ecological-housing idea in the hero. Let it gradually surface through experiments and writing.

Project focus UI should need at most: project name, one sentence, one action, one return control. Project detail pages may contain deeper work, dated updates, technical process and links, but should start with media instead of large paragraphs.

## 9. Implementation architecture — fit the actual repository

**Keep:** Next.js, React, Tailwind, TypeScript, Three.js, R3F, Drei and Plausible. The current repo uses R3F v8 with React 18. Do not upgrade to an alpha major for a visual redesign; add dependencies only when a demonstrated need exists. Framer Motion is already installed and suitable for DOM overlay transitions. Camera/scene interpolation can remain inside R3F. GSAP would be optional, not a default second animation system.

### Proposed component layout

```text
app/
  page.tsx                         # SEO-readable shell + dynamic visual experience
  projects/[slug]/page.tsx         # Keep real, direct project URLs
components/
  experience/
    ExperienceShell.tsx            # Scene, header, index, a11y/fallback coordination
    ExperienceCanvasLoader.tsx     # Dynamic import / device feature test
    SkyScene.tsx                   # Background, clusters, lighting and camera
    SkyNodes.tsx                   # Featured + outer constellation
    ProjectPortal.tsx              # Selection / camera / reveal coordinator
    WorldPreview.tsx               # Media-backed TerraTrace, Longsignal, Ashwake
    ExperienceOverlay.tsx          # Accessible, semantic labels and actions
    ProjectIndex.tsx               # Direct HTML view / always-available fallback
    ReducedMotionSky.tsx           # Static atmospheric alternate
lib/experience/
    state.ts                       # overview | approaching | focused | returning | index
    authoredPositions.ts           # Stable featured coordinates and cluster anchors
    worldThemes.ts                 # Visual cues and motion settings
    performance.ts                 # Quality tier + device handling
    analytics.ts                   # Low-volume intentional events
data/
    projects.json                  # GENERATED BY PROJECT PULSE: never edit here
    featured.ts                    # Current featured-project identifiers
    experience.ts                  # Hand-authored artistic metadata keyed by stable slug
public/media/experience/           # Optimized real project video/poster assets
```

Reuse existing graph primitives where possible (`GraphNodeMesh`, `GraphEdgeMesh`, camera focus mechanics) but decouple graph data from the presentation. The current force simulation should not make featured positions move unpredictably. **Author three stable spatial anchors** for featured projects and deterministically group the others. Retain relation edges only when they express a real connection and serve the visual design.

### Data boundary

`data/projects.json` comes from Project Pulse and is the source of truth for project names, descriptions, links, enabled status, public updates and categories. `data/experience.ts` should supply *only presentation*: visual theme, selected media URLs, authored position, focus behavior, editorial microcopy, and scene effect. Join these by stable project ID or slug. Missing experience metadata must fall back to a normal project link, never remove a published project.

Example **illustrative schema**, not code to paste blindly:

```ts
type ExperienceMeta = {
  slug: string;
  zone: 'forest' | 'orrery' | 'eclipse' | 'outer';
  position: [number, number, number];
  poster?: string;
  previewVideo?: string;
  motionPreset: 'contour' | 'orbit' | 'occlusion' | 'simple';
  microcopy?: string;
  featured?: boolean;
};
```

### Modes and routing

Use an explicit state transition model (`overview` → `approaching` → `focused` → `returning`; `index` available from any mode). Avoid inconsistent states where the detail panel and camera disagree. Keep important routes as real URLs; use a focused scene for preview, not as the only way to access `/projects/{slug}`. Support browser Back and deep linking where it improves usability, but don't require full route transitions for every hover.

### Rendering layers

1. **Real HTML layer:** title, intro, project names, links, index, project details, keyboard focus, and SSR-relevant content.
2. **3D layer:** stars, lines, volumetric suggestions, camera, thematic transitions, decorative objects.
3. **Media layer:** optimized real demo videos and screenshots, displayed in scene-aligned panels or DOM overlay to preserve legibility and avoid giant WebGL textures.

Do not render essential text exclusively inside WebGL.

## 10. Performance, accessibility and resilience

- Show HTML shell immediately; lazy-load canvas.
- Keep the scene appealing even if it renders at a static frame or WebGL isn't supported.
- Prefer instancing/batched particles and reusing materials, avoid dozens of unique lit meshes and expensive full-screen shaders.
- Stop or reduce animation when offscreen or page is hidden; consider on-demand rendering for paused/static periods.
- Use responsive DPR and adaptive quality tiers (lite / standard / enhanced) based on observed performance, not guesses based solely on device class.
- Do not autoplay heavy, high-resolution videos. Load poster first, then muted, inline previews when visible/selected and where appropriate.
- Preserve mobile vertical scrolling and touch action; avoid scroll-jacking.
- Use accessible labels, keyboard/focus management, sufficiently contrasting text, reduced-motion semantics and real HTML project links.
- Test at 390px mobile, tablet, 1280px desktop and wide screens; test keyboard only, screen reader, low-power devices and poor network.
- Suggested measurable launch targets: usable HTML immediately; p75 LCP under 2.5s, CLS under 0.1 and INP under 200ms when measured on realistic traffic; smoothness at or near 60fps on capable desktops and stable/reduced animation on weaker mobile devices. Treat these as goals to measure, not guaranteed outcomes.

## 11. Analytics: learn without optimizing the soul out of it

Keep the existing Plausible approach. Add *intentional* event names, not hundreds of per-pointer events:

- `experience_loaded` (3D or fallback)
- `project_selected` (project ID)
- `project_entered` (real project page)
- `outbound_project_open` (real site/demo)
- `index_opened`
- `return_to_sky`
- `writing_opened`

Track aggregate conversion: homepage visits → project selections → project opens; and whether visitors use sky or index. Don't log exact pointer trajectories, detailed fingerprinting, or persistent personal identifiers. Record performance diagnostics through appropriate aggregate web vitals tooling separately.

For the X launch, compare traffic source to project-open rate and actual follow-on engagement. A beautiful video earning likes is a different result from people exploring TerraTrace or contacting you.

## 12. Phased delivery

### Phase 0 — Audit and baseline (must do first)

- Run current site and record mobile/desktop screen captures, basic Web Vitals, keyboard behavior and project-route functionality.
- Inventory genuine project images and clips; identify missing footage.
- Verify the Project Pulse publishing contract and existing Plausible event names.
- Write 3 tiny scene sketches, one for each world; test the mood with stills and a simple motion prototype.

**Exit criterion:** shared reference captures, media inventory, a chosen art direction, baseline measurements.

### Phase 1 — Sky, but make it feel like somewhere (MVP)

- Refactor hero from two-column widget to full-width spatial experience with immediate readable intro.
- Keep three featured star positions stable and prominent. Render smaller nodes as quieter clusters.
- Add layered parallax, subtle atmospheric haze, brighter focus states, hover/tap labels, and safe camera movement.
- Preserve `index`, project list, and reduced-motion/static fallback.

**Exit criterion:** an unfamiliar visitor can recognize and enter the three featured projects from desktop or phone; keyboard users can reach the same work.

### Phase 2 — Portal prototype (MVP)

- Build **one** end-to-end world: TerraTrace. Star → approach → real media → project link → return.
- Tune camera easing, overlays, loading, Escape/Back behavior, and responsive layout.
- Test performance before making other worlds.

**Exit criterion:** one compelling, functioning world proves the interaction grammar and doesn't compromise navigation.

### Phase 3 — Three distinct worlds (MVP)

- Reuse the proven interaction shell for Longsignal and Ashwake.
- Give each world a different transition, light/material signature, media reveal and short copy.
- Build fallback behavior for missing video and slow networks.

**Exit criterion:** the three worlds feel different without being three entirely separate apps.

### Phase 4 — Deeper destinations and editorial texture

- Improve featured-project pages with compelling actual demos, technical discoveries and appropriately short writing.
- Make secondary projects and writing discoverable as quieter stars without requiring individual immersive scenes.
- Add one or two small nonessential surprises. Add `lately` only if it can be maintained comfortably through Pulse/manual updates.

**Exit criterion:** exploration rewards curiosity with real content, not empty effects.

### Phase 5 — Hardening and launch

- Mobile usability, orientation changes, visual regressions, accessible fallback, WebGL failure, reduced motion, no-JS, slow-network conditions.
- Performance profiling and quality-tier tuning; clean event analytics and SEO/Open Graph links.
- Make and post a 10–20 second genuine site-capture clip to X; observe actual visits and project selections.

**Exit criterion:** looks good and feels good, but never makes the user fight to open a project.

### Post-MVP, only after evidence

- The dwelling/organic architecture thought-world.
- Optional opt-in sound; site-specific easter eggs.
- Live pulse of recent work/notes from the existing publishing system.
- More spatialized writing, an archival map, and visitor-selectable scene moods.

## 13. Prioritized build backlog (ticket-sized)

| ID | Priority | Work | Acceptance |
|---|---|---|---|
| UX-01 | P0 | Define storyboard and mood references | Approved stills and interaction path for three worlds |
| DATA-01 | P0 | Audit Pulse contract, split data from art metadata | Publishing doesn't overwrite scene configuration |
| MEDIA-01 | P0 | Real screenshots, posters, clips for 3 main projects | Valid, lightweight media; no placeholder imagery on production |
| SKY-01 | P0 | Full-width responsive sky shell | Intro + project access works while canvas loads |
| SKY-02 | P0 | Stable authored constellation positions | No unexplained position reshuffle on every reload |
| SKY-03 | P0 | Hover, tap and focus affordances | Each featured project easy to discover on touch/keyboard |
| NAV-01 | P0 | Persistent index and back/escape behavior | No navigation traps or hidden links |
| PORTAL-01 | P0 | TerraTrace end-to-end world flow | Select → approach → genuine media → enter → return |
| PORTAL-02 | P1 | Longsignal world | Unique network/orbit reveal with real product media |
| PORTAL-03 | P1 | Ashwake world | Unique eclipse reveal with real gameplay/media |
| IDX-01 | P1 | Improve accessible project index | Every published live project remains reachable |
| PAGE-01 | P1 | Media-forward project detail layout | Deep link has a real demo/image + meaningful content |
| PERF-01 | P0 | Performance/canvas quality management | Degrades elegantly; no main-thread freeze |
| A11Y-01 | P0 | Reduced motion, focus, labels, no-WebGL path | Complete useful experience without the canvas |
| AN-01 | P1 | Low-volume exploration analytics | Accurate project entry and outbound-open funnel |
| QA-01 | P0 | Mobile, keyboard and slow-network testing | Pass documented test matrix |
| EGG-01 | P2 | One surprising dreamlike detail | Delightful and completely nonessential |
| HOME-01 | P2 | Speculative dwelling thought-world | Clearly labeled as future interest, not existing product |

## 14. Decisions to protect

1. **Visual-first does not mean usability-last.** A visitor can always find the work.
2. **Three memorable scenes beat fifteen shallow animations.** Production effort goes into featured projects.
3. **The dream has continuity.** Project stars remain in recognizable positions; motion is subtle and purposeful.
4. **No fake product substance.** Prefer authentic project footage and data over cinematic placeholder material.
5. **No unnecessary stack migration.** Extend the existing working architecture and Project Pulse pipeline.
6. **Human over polished.** A site with odd charm and genuine ideas beats a flawless corporate presentation.
7. **An unfinished curiosity is allowed to be unfinished.** Represent future housing aspirations as explorations, not claims.

## 15. Definition of done for v1

A first-time visitor can, without reading a paragraph or waiting through an animation:

- Recognize that this is Liam's personal world.
- Find TerraTrace, Longsignal and Ashwake within moments.
- Select any featured star and receive a distinct, atmospheric visual response.
- See **real work**, not only decoration.
- Open the project, return to the sky, or switch to a fast index.
- Do all of the above on mobile and with reduced motion or keyboard-only navigation.
- Reach the same real project destinations if WebGL fails entirely.

**One-line brief:** Build an impossible little observatory, equal parts deep space and lucid dream, where real projects become places—and curiosity, not copywriting, does most of the talking.
