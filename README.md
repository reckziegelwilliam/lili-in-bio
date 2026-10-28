# liam rex - projects, as a 3D graph

Liam Rex's portfolio page: a short introduction beside an interactive **3D force-directed graph** of projects, then a readable project list. Built with react-three-fiber (WebGL, bloom). The list is real HTML, so the page reads fully with reduced motion or without JavaScript.

## Where the content comes from

- **The project list** (`data/projects.json`) is written by Project Pulse when Liam presses Publish. Edit it in Pulse (`public.md` in `_portfolio`), not here; the file is rewritten on every Publish. It may be version 1 or 2 (version 2 adds Now, Updates, Outreach and About, which this site doesn't show yet).
- **Featured projects** are named in `data/featured.ts`. They get a page at `/projects/<slug>`, a place at the top of the list and labels in the graph. Their words still come from Pulse. `data/featured.ts` also holds a stopgap copy of their rows, used only until a Publish includes them.
- **How the sky looks** (groups, star positions, each featured star's motif, media slots) lives in `data/experience.ts`. Presentation only: no project facts or public sentences there. Plan and notes: `docs/experience/`.
- **Project pages** show only what Pulse publishes for a project: its blurb, category, link, dated `#public` updates and sub-links.

## 🌟 Features

### Interactive 3D Visualization

- **Force-Directed Graph**: Projects arranged in a dynamic physics-based layout (hub-and-spoke architecture with category relationship edges)
- **WebGL Rendering**: Real-time 3D graphics with react-three-fiber and Three.js
- **Bloom Effects**: Beautiful glow effects on project nodes using selective post-processing
- **Groups**: Hover a point or a legend item to light up that category and dim the rest
- **Interactions**: Click a point for its details, drag to orbit (the page scrolls past the graph: no wheel zoom, and on touch only horizontal drags rotate)

### Accessible Fallback

- **Semantic HTML**: The project list is always on the page as real links, and is the whole experience for:
  - Users who prefer reduced motion (`prefers-reduced-motion`)
  - Users with JavaScript disabled
- **Progressive Enhancement**: The graph sits in the hero and loads after the page; the list and project pages don't depend on it

### Project Details

- **Click-to-Expand**: Select any project to view full details in a modal panel
- **Rich Metadata**: Each project includes description, optional thumbnails and subLinks, and category relationships
- **Ambient Analytics**: Plausible integration to track visitor engagement without cookies or tracking pixels

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd lili-in-bio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (optional):

```bash
cp env.example .env.local
```

The environment file supports:
- `NEXT_PUBLIC_SITE_URL`: Your site's URL (default: http://localhost:3000)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: Your Plausible Analytics domain for engagement tracking (optional)

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
/
├── app/
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main page composition
│   ├── projects/[slug]/          # Featured project pages and share images
│   └── globals.css               # Global styles and utilities
├── components/
│   ├── graph/
│   │   ├── GraphScene.tsx        # Three.js scene setup
│   │   ├── GraphNode.tsx         # Project node rendering
│   │   ├── GraphEdge.tsx         # Relationship edge rendering
│   │   ├── GraphCanvasLoader.tsx # Canvas component with loader
│   │   └── NodeDetailPanel.tsx   # Click-to-expand project details
│   ├── site/
│   │   ├── SiteHeader.tsx        # liam rex wordmark and nav
│   │   ├── MiniConstellation.tsx # The wordmark's small mark
│   │   ├── GraphLegend.tsx       # Category key; hover or click to highlight a group
│   │   └── ProjectRows.tsx       # Featured list and grouped "more work"
│   └── AccessibilityUtils.tsx    # A11y utilities
├── lib/
│   ├── graph/
│   │   ├── buildGraph.ts         # Graph data structure
│   │   ├── forceSimulation.ts    # Custom spring/repulsion force simulation
│   │   ├── edgeGeometry.ts       # Edge mesh generation
│   │   ├── nodeEmphasis.ts       # Node focus/glow effects
│   │   ├── categoryColors.ts     # Color assignment by category
│   │   └── types.ts              # TypeScript interfaces
│   ├── hooks/
│   │   └── useVisitorSnapshot.ts # Visitor detection
│   └── utils/
│       ├── freshness.ts          # Freshness/recency intensity for node emphasis
│       └── plausible.ts          # Analytics tracking
├── data/
│   ├── projects.json             # Written by Project Pulse (do not edit)
│   ├── projects.ts               # Validated list, featured projects marked
│   └── featured.ts               # Which projects are featured, in order
├── types/
│   └── visitor.ts                # TypeScript type definitions
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## 🎨 Customization

### Adding or Modifying Projects

Edit the projects and categories in `data/projects.ts`:

```typescript
export const projects: Project[] = [
  {
    name: 'Project Name',
    href: 'https://example.com',
    enabled: true,
    category: 'Climate & Environment',
    description: 'Brief description of the project...',
    thumbnail: '/images/project-thumb.png',
    subLinks: [
      { name: 'GitHub', href: 'https://github.com/...', description: 'Source code' },
      { name: 'Demo', href: 'https://demo.example.com' },
    ],
  },
  // ...
];
```

### Adjusting Graph Colors

To customize colors for project categories, edit the `CATEGORY_COLORS` mapping in `lib/graph/categoryColors.ts`:

```typescript
// In lib/graph/categoryColors.ts
const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  'Climate & Environment': '#5fd6a8',
  'Disaster Recovery': '#ffb86b',
  'Directory': '#8fe3ff',
  'Writing': '#ff8fd6',
  'Tools': '#c88fff',
};

// Access via the exported getCategoryColor function
export function getCategoryColor(category: ProjectCategory): string {
  return CATEGORY_COLORS[category];
}
```

### Customizing Bloom and Effects

In `components/graph/GraphScene.tsx`, adjust:

- Bloom pass intensity and threshold
- Node glow color and size
- Camera position and zoom levels

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js + react-three-fiber
- **Physics**: Custom spring/repulsion force simulation
- **Analytics**: Plausible (privacy-friendly, no cookies)
- **Deployment**: Vercel (recommended)

## 🔒 Privacy & Ethics

This project prioritizes visitor privacy:

- ✅ Analytics via Plausible (no cookies, no tracking pixels)
- ✅ No third-party data collection or selling
- ✅ Visitor context detected client-side only (referrer, device, timezone)
- ✅ No personal data stored or transmitted
- ✅ Transparent about what data is collected

Visitor detection uses only browser APIs:
- `document.referrer` (for traffic source)
- `navigator.userAgent` (for device classification)
- `window.matchMedia()` (for color scheme preference)
- `Intl.DateTimeFormat()` (for timezone)
- `localStorage` (for return visitor tracking)

## 📱 Mobile & Desktop Design

Responsive and performant across all devices:

- The 3D graph sits in the hero on all devices, with optimized rendering settings on touch devices
- The project list is plain HTML; with JavaScript off or `prefers-reduced-motion` set, the graph is left out and the list carries the page
- Touch-friendly interaction with project selection
- Responsive layout adapts to screen size and input method
- Smooth animations respecting user preferences

## ♿ Accessibility

Progressive enhancement ensures everyone can access project information:

- **Semantic HTML**: Complete project list for screen readers and no-JS
- **Skip-to-Content**: Direct navigation to main content
- **Reduced Motion**: Respects `prefers-reduced-motion` by leaving out the 3D canvas; the list is already on the page
- **ARIA Labels**: Proper labeling on interactive elements
- **Keyboard Navigation**: Full keyboard support for list view
- **Color Contrast**: Text meets WCAG AA standards
- **No JavaScript**: Page gracefully degrades without JS enabled

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel
3. (Optional) Add environment variables for analytics:
   - `NEXT_PUBLIC_SITE_URL`: Your production URL (defaults to https://liamrex.world; used for canonical URLs, share images and the sitemap)
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: Your Plausible domain for analytics
4. Deploy!

### Other Platforms

Build the production bundle:

```bash
npm run build
npm run start
```

Deploy the `.next` folder to your hosting provider.

## 📝 License

MIT License - feel free to use this as a template for your own projects!

## 🙏 Credits

Designed and built by Liam Rex as a demonstration of 3D visualization and interactive portfolio design.

Concept: A force-directed graph portfolio that makes project relationships visible and explorable.

---

**Questions or feedback?** Feel free to open an issue or reach out!

