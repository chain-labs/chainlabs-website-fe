# Repository Guidelines

## Project Structure & Module Organization

- `src/app/`: Next.js App Router entry (`layout.tsx`, `page.tsx`), global styles (`globals.css`).
- `src/components/`: UI sections (hero, chat, testimonials, case studies, process, footer, etc.).
- `src/hooks/`: App hooks (`use-chat.tsx`, `use-ui.ts`, `use-auth.ts`).
- `src/providers/`: App-wide providers (`Auth`).
- `src/types/`: Shared types; `src/api-client.ts` for backend calls.
- `public/`: Static assets (favicons, images).

## Build, Test, and Development Commands

- `npm run dev`: Start Next.js dev server at `http://localhost:3000`.
- `npm run build`: Production build.
- `npm run start`: Serve the production build.
- `npm run lint`: Run Next.js/ESLint checks (fix issues before PRs).

## Coding Style & Naming Conventions

- Language: TypeScript (strict), React 19, Next.js App Router.
- Indentation: 2 spaces; prefer functional components and hooks.
- Filenames: kebab-case (e.g., `chain-labs-hero.tsx`, `use-chat.tsx`).
- Components: Export PascalCase component names; hooks use `use-*.tsx`.
- Imports: Use alias `@/*` for `src/*` (see `tsconfig.json`).
- Styling: Tailwind CSS v4 + shadcn/ui. Keep tokens in `src/app/globals.css` and prefer utility classes over ad-hoc CSS.

## Testing Guidelines

- No test framework is configured yet. If adding tests, prefer Jest + React Testing Library.
- Suggested layout: `src/__tests__/**/*.(test|spec).tsx` and co-located component tests when useful.
- Ensure components render without analytics/network side effects; mock `fetch` and `localStorage` as needed.

## Commit & Pull Request Guidelines

- Commits: Imperative mood, concise scope (e.g., "feat(hero): add voice toggle").
- PRs: Include summary, linked issues, before/after screenshots for UI, and notes on accessibility and performance.
- CI hygiene: Ensure `npm run lint` and local build pass before requesting review.

## Security & Configuration Tips

- Env vars: Use `.env.local` for secrets. Do not commit keys. Example: `NEXT_PUBLIC_API_BASE_URL=...`.
- Analytics: GTM/GA/Amplitude load in `src/app/layout.tsx`. Gate or remove for local debugging if noisy.
- Session: State persists via Zustand (`chainlabs-session-store`). Clear via DevTools > Application > Local Storage during troubleshooting.

## Architecture Overview

- Personalization flow: `AuthProvider` initializes a session → `useChat`/`api-client` talk to backend (`/api/goal`, `/api/clarify`, `/api/personalised`, `/api/chat`) → Zustand drives UI; personalized mode shows when `personalised.status === "CLARIFIED"`.
