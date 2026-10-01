# Lili's Project Portfolio - 3D Force-Directed Graph

An interactive portfolio page showcasing projects through a **3D force-directed graph visualization**. Built with react-three-fiber for immersive WebGL rendering with bloom effects, and includes an accessible fallback list for reduced-motion and no-JavaScript scenarios.

## 🌟 Features

### Interactive 3D Visualization

- **Force-Directed Graph**: Projects arranged in a dynamic physics-based layout (hub-and-spoke architecture with category relationship edges)
- **WebGL Rendering**: Real-time 3D graphics with react-three-fiber and Three.js
- **Bloom Effects**: Beautiful glow effects on project nodes using selective post-processing
- **Smooth Interactions**: Click to expand project details, orbit camera, and inspect relationships

### Accessible Fallback

- **Semantic HTML**: Projects displayed as a complete, screenreader-friendly list for:
  - Users on devices without WebGL support
  - Users who prefer reduced motion (`prefers-reduced-motion`)
  - Users with JavaScript disabled
- **Progressive Enhancement**: Canvas loads on top of semantic content, with proper ARIA management

### Project Details

- **Click-to-Expand**: Select any project to view full details in a modal panel
- **Rich Metadata**: Each project includes description, technologies, links, and category relationships
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
│   └── globals.css               # Global styles and utilities
├── components/
│   ├── graph/
│   │   ├── GraphScene.tsx        # Three.js scene setup
│   │   ├── GraphNode.tsx         # Project node rendering
│   │   ├── GraphEdge.tsx         # Relationship edge rendering
│   │   ├── GraphCanvasLoader.tsx # Canvas component with loader
│   │   ├── NodeDetailPanel.tsx   # Click-to-expand project details
│   │   └── AccessibleProjectList.tsx # Semantic fallback list
│   └── AccessibilityUtils.tsx    # A11y utilities
├── lib/
│   ├── graph/
│   │   ├── buildGraph.ts         # Graph data structure
│   │   ├── forceSimulation.ts    # D3 force simulation
│   │   ├── edgeGeometry.ts       # Edge mesh generation
│   │   ├── nodeEmphasis.ts       # Node focus/glow effects
│   │   ├── categoryColors.ts     # Color assignment by category
│   │   └── types.ts              # TypeScript interfaces
│   ├── hooks/
│   │   └── useVisitorSnapshot.ts # Visitor detection
│   └── utils/
│       └── plausible.ts          # Analytics tracking
├── data/
│   └── projects.ts               # Project and category data
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
export const PROJECTS: Project[] = [
  {
    id: 'project-id',
    name: 'Project Name',
    description: 'Brief description...',
    category: 'category-name',
    technologies: ['Tech1', 'Tech2'],
    links: {
      github: 'https://...',
      demo: 'https://...',
    },
  },
  // ...
];

export const CATEGORIES: Category[] = [
  { id: 'category-name', label: 'Category Label', color: '#ff6b9d' },
  // ...
];
```

### Adjusting Graph Colors

In `lib/graph/categoryColors.ts`, update the color mappings for project categories:

```typescript
export const CATEGORY_COLORS: Record<string, string> = {
  'category-name': '#ff6b9d',
  // ...
};
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
- **Physics**: D3 force simulation
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

- Full-screen 3D visualization on desktop and tablet
- Semantic HTML fallback list on mobile and reduced-motion scenarios
- Touch-friendly interaction with project selection
- Responsive layout adapts to screen size and input method
- Smooth animations respecting user preferences

## ♿ Accessibility

Progressive enhancement ensures everyone can access project information:

- **Semantic HTML**: Complete project list for screen readers and no-JS
- **Skip-to-Content**: Direct navigation to main content
- **Reduced Motion**: Respects `prefers-reduced-motion` by showing the semantic list instead of 3D canvas
- **ARIA Labels**: Proper labeling on interactive elements
- **Keyboard Navigation**: Full keyboard support for list view
- **Color Contrast**: Text meets WCAG AA standards
- **No JavaScript**: Page gracefully degrades without JS enabled

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel
3. (Optional) Add environment variables for analytics:
   - `NEXT_PUBLIC_SITE_URL`: Your production URL
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

Designed and built by **Lili** as a demonstration of 3D visualization and interactive portfolio design.

Concept: A force-directed graph portfolio that makes project relationships visible and explorable.

---

**Questions or feedback?** Feel free to open an issue or reach out!

