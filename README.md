# Visitor Console - Context-Aware Link-in-Bio

A visitor-first, context-aware link-in-bio page that adapts to each visitor using ambient data like referrer, device type, time of day, and preferences. Built as both a functional tool and a portfolio piece demonstrating thoughtful product design.

## 🌟 Features

### Core Concept

This isn't a normal "here are my links" page. It's a **Visitor Console** that:

- **Reads the situation**: Detects how/when/where the person is visiting
- **Reflects context back**: Shows visitors what you know in a friendly way
- **Provides immediate value**: Offers useful tools and systems without requiring login
- **Acts as a portfolio piece**: Demonstrates product thinking, engineering, and ethics

### What Makes It Special

1. **Context-Aware UI**: Generates a unique visual "aura" for each visitor based on their context
2. **Visitor Snapshot**: Friendly display of detected context (source, device, time, theme preference)
3. **Reading Modes**: Three interaction modes (Gist, Nerd, Reflective) that change content density
4. **Text Upgrade Tool**: AI-powered tool to instantly improve captions, bios, messages, and tweets
5. **Mini Systems Library**: Practical "tiny systems" for common creative/productivity problems
6. **Interaction Style Chooser**: Contextual CTAs based on visitor intent
7. **Privacy-First**: No tracking, cookies, or data selling - all storage is local

### Dynamic Aura Background

Three implementations available (CSS, SVG, Canvas):

- Generates unique pastel neon gradients and animated blobs per visitor
- Changes based on time of day (Dawn, Day, Golden Hour, Night)
- Adapts to source (Instagram, TikTok, direct) and reading mode
- Respects `prefers-reduced-motion`
- Evolves with each return visit

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for text upgrade feature)

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

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API key:

```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
/
├── app/
│   ├── api/
│   │   └── upgrade/
│   │       └── route.ts          # AI text upgrade API endpoint
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main page composition
│   └── globals.css               # Global styles and utilities
├── components/
│   ├── AuraBackground/
│   │   ├── CSSAuraBackground.tsx # CSS-based background
│   │   ├── SVGAuraBackground.tsx # SVG-based background
│   │   ├── CanvasAuraBackground.tsx # Canvas-based background
│   │   └── index.tsx             # Background switcher
│   ├── GlassCard.tsx             # Reusable glassmorphism card
│   ├── Hero.tsx                  # Hero section
│   ├── VisitorSnapshotCard.tsx   # Context display
│   ├── ReadingModeToggle.tsx     # Reading mode selector
│   ├── UpgradeTool.tsx           # Text upgrade tool
│   ├── MiniSystemsLibrary.tsx    # Systems library
│   ├── InteractionChooser.tsx    # Interaction style picker
│   ├── SaveForLater.tsx          # Save/share options
│   ├── TechPeek.tsx              # Technical transparency
│   ├── MetaFooter.tsx            # Portfolio footer
│   ├── LoadingStates.tsx         # Loading UI components
│   └── AccessibilityUtils.tsx    # A11y utilities
├── lib/
│   ├── hooks/
│   │   └── useVisitorSnapshot.ts # Client-side detection hook
│   └── utils/
│       ├── seedGenerator.ts      # Visual seed generation
│       └── paletteGenerator.ts   # Color palette system
├── types/
│   └── visitor.ts                # TypeScript type definitions
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## 🎨 Customization

### Changing Content

All placeholder content can be customized by editing the respective component files:

- **Personal info**: Edit `components/Hero.tsx`
- **Links and CTAs**: Edit `components/InteractionChooser.tsx`
- **Systems**: Edit `components/MiniSystemsLibrary.tsx`
- **Footer details**: Edit `components/MetaFooter.tsx`

### Switching Background Variants

In `app/page.tsx`, change the `variant` prop:

```tsx
<AuraBackground 
  snapshot={snapshot} 
  seed={seed} 
  palette={palette} 
  variant="css" // or "svg" or "canvas"
/>
```

### Adjusting Color Palettes

Edit the time-of-day bands in `lib/utils/paletteGenerator.ts`:

```typescript
const TIME_BANDS: PaletteBand[] = [
  {
    name: 'dawn',
    hue1: 170, // teal
    hue2: 30,  // peach
    // ...
  },
  // ...
];
```

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion + CSS animations
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Vercel (recommended)

## 🔒 Privacy & Ethics

This project demonstrates privacy-first design:

- ✅ No third-party tracking or analytics
- ✅ No cookies or cross-site tracking
- ✅ All visitor data stored locally (localStorage)
- ✅ Transparent about what data is collected
- ✅ Data used only to enhance user experience
- ✅ No data selling or sharing

All detection happens client-side using browser APIs:
- `document.referrer`
- `navigator.userAgent`
- `window.matchMedia()`
- `Intl.DateTimeFormat()`
- `localStorage`

## 📱 Mobile-First Design

Optimized for Instagram and TikTok in-app browsers:

- Thumb-friendly touch targets
- Responsive layout (mobile → tablet → desktop)
- Clear typography and spacing
- "Save for later" features for mobile users
- Fast loading and smooth animations

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Skip-to-content link
- `prefers-reduced-motion` support
- Sufficient color contrast on glass cards
- Screen reader friendly

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
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

Designed and built by **Lili** as a demonstration of visitor-first product thinking.

Concept: A link-in-bio that's actually a tiny product and portfolio piece.

## 🎯 Reusable Prompt

Want to recreate or modify this concept? Use this prompt with AI tools:

> **Design a context-aware "Visitor Console" link-in-bio page for a software developer.**
>
> Goals: The page should act as a tiny product, not just a list of links. It should use ambient data (referrer, device, language, timezone, dark mode, visit history) to generate a friendly "Visitor Snapshot" without being creepy. It must provide immediate value to any visitor in under 60 seconds (no login, no email). It should also function as a portfolio piece that demonstrates product thinking, technical ability, and a privacy-first mindset.
>
> [See full prompt in visit.plan.md]

---

**Questions or feedback?** Feel free to open an issue or reach out!

