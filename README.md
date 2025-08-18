# Chain Labs – AI Solutions Website

A modern, dark-themed marketing website for Chain Labs built with Next.js (App Router), Tailwind CSS, Motion animations, and shadcn/ui. It showcases AI capabilities, interactive testimonials, case studies, and a conversational hero with optional voice input.

- Entry: [`Home`](src/app/page.tsx) | Layout: [`RootLayout`](src/app/layout.tsx) | Styles: [src/app/globals.css](src/app/globals.css)

## Features

- Conversational hero with typing animation and voice input
  - Component: [`ChainLabsHero`](src/components/hero/chain-labs-hero.tsx)
  - Uses chat state via [`useChat`](src/hooks/use-chat.ts) and store via [`useGlobalStore`](src/global-store.ts)
- Animated testimonials carousel
  - Component: [`ScrollingCarouselTestimonials`](src/components/testimonials/scrolling-carousel-testimonials.tsx)
- Case studies grid with responsive, scrollable content
  - Component: [`ResponsiveGridCasestudies`](src/components/casestudies/responsive-grid-casestudies.tsx)
- Process and missions sections with subtle motion and gradients
  - Components: [`ProcessSection`](src/components/process/process-section.tsx), [`OurMissions`](src/components/missions/missions-section.tsx)
- Theming, tokens, and polished markdown (prose) for content
  - Styles and tokens: [src/app/globals.css](src/app/globals.css)
- Production-ready UI primitives
  - shadcn/ui with Radix bindings: [`ScrollArea`](src/components/ui/scroll-area.tsx), [`Sidebar`](src/components/ui/sidebar.tsx), Buttons, Inputs, Sheet, Tooltip, etc.
- Reusable layout
  - Header/Footer: [`Header`](src/components/header.tsx), [`Footer`](src/components/footer.tsx)
  - App-wide providers: [`AuthProvider`](src/providers/Auth), `ThemeProvider` (next-themes)

## Tech Stack

- Next.js App Router, React 18
- Tailwind CSS with design tokens (dark-only theme)
- Motion for animations (Framer Motion-style API)
- shadcn/ui + Radix UI + lucide-react icons
- next-themes for color mode management
- TypeScript

## Project Structure

- App shell
  - [`src/app/layout.tsx`](src/app/layout.tsx) – HTML shell, providers, metadata
  - [`src/app/page.tsx`](src/app/page.tsx) – landing page composition (Hero, Testimonials, Case Studies, Process, Book a Call, Footer)
  - [`src/app/globals.css`](src/app/globals.css) – theme tokens, prose, utilities
- Key components
  - Hero: [`src/components/hero/chain-labs-hero.tsx`](src/components/hero/chain-labs-hero.tsx)
  - Chat UI: [`src/components/chat/ai-chat-bubble.tsx`](src/components/chat/ai-chat-bubble.tsx)
  - Testimonials: [`src/components/testimonials/scrolling-carousel-testimonials.tsx`](src/components/testimonials/scrolling-carousel-testimonials.tsx)
  - Case Studies: [`src/components/casestudies/responsive-grid-casestudies.tsx`](src/components/casestudies/responsive-grid-casestudies.tsx)
  - Process: [`src/components/process/process-section.tsx`](src/components/process/process-section.tsx)
  - Footer: [`src/components/footer.tsx`](src/components/footer.tsx)
  - UI Primitives: [`src/components/ui/scroll-area.tsx`](src/components/ui/scroll-area.tsx), [`src/components/ui/sidebar.tsx`](src/components/ui/sidebar.tsx)
- State & hooks
  - Store: [`src/global-store.ts`](src/global-store.ts)
  - UI/Chat hooks: [`src/hooks/use-ui.ts`](src/hooks/use-ui.ts), [`src/hooks/use-chat.ts`](src/hooks/use-chat.ts)

Note: Some paths above are inferred from imports; open files in the editor to jump directly.

## Styling System

- Single dark theme with CSS variables defined in [globals.css](src/app/globals.css)
  - Core tokens: background, foreground, primary, secondary, border, ring, surface, text-primary/secondary
  - shadcn/ui tokens mapped under :root for consistent component theming
- Polished markdown typography under the `.prose` class (headings, code, tables, media, etc.)
- Utility classes via Tailwind; custom scrollbar styles where applicable

## Animations

- Motion-based transitions and micro-interactions:
  - Staggered text reveals for testimonials
  - Floating background elements and thinking indicators in the hero
  - Smooth enter/exit transitions with `AnimatePresence`

Primary animated components:
- [`ChainLabsHero`](src/components/hero/chain-labs-hero.tsx)
- [`ScrollingCarouselTestimonials`](src/components/testimonials/scrolling-carousel-testimonials.tsx)
- [`ResponsiveGridCasestudies`](src/components/casestudies/responsive-grid-casestudies.tsx)
- [`ProcessSection`](src/components/process/process-section.tsx)

## Getting Started

Prerequisites
- Node.js 18+ and PNPM/NPM/Yarn/Bun

Install and run (Windows PowerShell or CMD)
```bash
# install deps
npm install

# start dev server
npm run dev

# open the app
# http://localhost:3000
```

Available scripts (typical)
```bash
npm run dev       # start next dev server
npm run build     # build for production
npm run start     # start production server
npm run lint      # lint (if configured)
```

## Configuration

Environment variables
- None required for basic local development based on current code.
- If adding API keys for chat or analytics, create a `.env.local` and read via `process.env`.

Theming
- Theme tokens live in [globals.css](src/app/globals.css). Update color vars under `@theme` to tweak the palette.
- `next-themes` is wired in [`RootLayout`](src/app/layout.tsx).

Assets and Content
- Testimonials avatars use DiceBear placeholders inside [`scrolling-carousel-testimonials.tsx`](src/components/testimonials/scrolling-carousel-testimonials.tsx).
- Update copy in each component for real brand messaging.

## Deployment

- Vercel recommended. From the repo root:
```bash
# ensure a production build completes locally
npm run build
```
- Push to the main branch or import the repo to Vercel and follow prompts.

## Accessibility and Performance

- High-contrast dark palette with semantic tokens
- Keyboard focus rings via `--color-ring`
- Images use `next/image` where applicable
- Motion kept subtle; prefers-reduced-motion can be integrated if needed

## Contributing

- Use descriptive commit messages
- Prefer small, focused PRs
- Keep components typed and co-locate styles/logic where sensible

## License

- Add your license of choice (e.g., MIT) to a LICENSE file.

---
Made with Next.js,