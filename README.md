# Chain Labs – AI Solutions Website

AI-driven marketing site built with Next.js (App Router) that personalizes content based on a short goal clarification flow. It features a conversational hero, optional voice input, a floating AI chat, animated testimonials, case studies, a process section, and a “Book a Call” step integrated with Cal.com.

- Entry: `src/app/page.tsx` • Layout: `src/app/layout.tsx` • Styles: `src/app/globals.css`

## Features

- Personalized flow: Captures user goal → clarifies → renders a tailored hero, process, case studies, and missions.
- Conversational UI: Floating assistant with typing indicator, quick starters, and smooth scroll-to-section.
- Voice input: Live speech-to-text via `react-speech-recognition` with recording controls shared across hero and chat.
- Cal.com booking: Embedded scheduler; persists successful booking to backend and shows live booking status.
- Polished UI: Tailwind v4 tokens, shadcn/ui + Radix primitives, Motion animations, and dark-first theming.
- Analytics ready: Google Tag Manager, Google Analytics, and Amplitude initialized in the app layout.

## Tech Stack

- Next.js 15 (App Router) • React 19 • TypeScript
- Tailwind CSS v4 • shadcn/ui • Radix UI • lucide-react
- Motion (Framer Motion-like API) • next-themes
- Zustand (state) • Zod • React Hook Form
- Cal.com embed • react-speech-recognition

## Project Structure

- App shell: `src/app/layout.tsx` (providers, analytics), `src/app/page.tsx` (home composition), `src/app/globals.css` (design tokens, prose).
- Components: hero, chat, testimonials, case studies, process, missions, book call, header/footer, and UI primitives under `src/components/ui/*`.
- State & hooks: `src/global-store.ts` (Zustand), `src/hooks/use-chat.tsx`, `src/hooks/use-ui.ts`, `src/hooks/use-auth.ts`.
- API client & types: `src/api-client.ts` (fetch helpers, session), `src/types/*` (response contracts).
- Providers: `src/providers/Auth.tsx` (session init + splash), utilities in `src/lib/*`.

See AGENTS.md for contributor guidelines.

## Getting Started

Prerequisites

- Node.js 18+ and a package manager (pnpm recommended; lockfile included).

Install and run

```bash
# install deps
pnpm install        # or: npm install / yarn / bun

# start dev server
pnpm dev            # http://localhost:3000

# typecheck, build, start
pnpm build && pnpm start

# lint
pnpm lint
```

## Configuration

Environment variables

- Create `.env.local` in the project root. Required:
  - `NEXT_PUBLIC_API_BASE_URL` – Backend base URL for session, chat, and personalization (defaults to `http://localhost:8000`).
- Do not commit secrets. Public analytics IDs are hardcoded in `src/app/layout.tsx`; change or comment out for local development if needed.

Theming and design tokens

- Single dark theme with CSS variables defined under `@theme` in `src/app/globals.css`. Tokens map to shadcn/ui variables under `:root`.

Analytics

- Initialized in `src/app/layout.tsx` (GTM, GA, Amplitude). Disable by commenting out scripts during development.

## Backend Integration

All API calls are centralized in `src/api-client.ts`. Endpoints expected from the backend:

- Auth/session: `POST /api/auth/session`, `POST /api/auth/reset`
- Goal flow: `POST /api/goal`, `POST /api/clarify`, `GET /api/personalised`
- Chat: `POST /api/chat`
- Progress & missions: `GET /api/progress`, `POST /api/mission/complete`
- Booking callback: `POST /api/call/link`

Response shapes are documented in `src/types/api.d.ts`. The client manages a short-lived session in `localStorage` and injects the `Authorization` header when present.

## Architecture Overview

- `AuthProvider` initializes a session on app mount and shows a splash screen during setup.
- `useChat` orchestrates goal → clarification → personalization and chat. It updates the Zustand store and scrolls to suggested sections.
- `useUI` coordinates shared UI—focus, mic state, and whether personalized mode is active.
- Personalized mode toggles when `personalised.status === "CLARIFIED"`; components read from the store to render tailored content.
- Cal.com embed posts successful bookings to the backend; booking status is surfaced in the UI.

## Deployment

- Vercel is recommended. Ensure `pnpm build` passes locally, configure environment variables in your deployment, and then deploy.

## Contributing

- Read Repository Guidelines in `AGENTS.md` (structure, commands, style, testing, PRs).
- Run `pnpm lint` and ensure a clean build before opening PRs.

## License

Add a LICENSE (e.g., MIT) at the root if distributing.

—
Made with Next.js, Tailwind, Motion, and shadcn/ui.
