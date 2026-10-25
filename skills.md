# Blew — v0 Build Skills

Use this as the implementation contract when generating the Blew UI.

## Build behavior
- Build the complete working UI, not a static mockup.
- Make reasonable decisions without asking questions.
- Prefer simple, maintainable TypeScript and reusable components.
- Preserve existing APIs and Prisma schema.
- Use mock data only where real backend data is unavailable.
- Never fabricate real transaction signatures or security claims.

## Design system
- Dark-first palette: `#030712`, `#0F172A`, `#1E293B`, `#3B82F6`, `#06B6D4`, `#10B981`, `#EF4444`, `#F8FAFC`, `#94A3B8`.
- Typography: Geist, fallback Inter.
- Premium fintech/Web3 tone; minimal surfaces, thin borders, restrained glow.
- Use semantic design tokens, not scattered color literals.
- Keep public pages cinematic and dashboards dense, calm, and scannable.

## UX implementation
- Public pages: overview, features, developers, pricing, login, register.
- Merchant pages: overview, payments, analytics, API keys, webhooks, settings.
- Add search, filters, drawers, copy actions, loading states, empty states, errors, success states, and responsive navigation.
- Payment state must always be visible: Ready, Wallet confirmation, Processing, Verifying, Confirmed, Failed.
- Use progressive disclosure for wallet and blockchain details.
- Use concise labels and short copy. Avoid large text blocks.

## Living Network
- Use the simplest reliable implementation: CSS/SVG/Canvas first; Three.js only if it clearly helps.
- Idle network is subtle and breathing.
- Cursor gently affects nearby nodes.
- Payment triggers one path-following pulse; success highlights the destination.
- Respect `prefers-reduced-motion` with a static or very subtle state.
- If WebGL, animation, or a dependency fails, immediately fall back to CSS/SVG and keep the app functional.

## Components
Create and reuse: Button, Input, Card, Badge, Modal, Drawer, Toast, Navbar, Sidebar, PaymentWidget, PaymentStatus, TransactionStatus, WalletButton, NetworkVisualization, StatCard, DataTable, CodeBlock.

## Auth and data
- Support Google, GitHub, email/magic link, existing API key, and optional wallet connection UI.
- External auth manages identity/session; existing Merchant and API key records continue to manage product access.
- Do not add Prisma models or migrations for the UI build.
- Seed/demo data must be idempotent, development-only, and use existing Merchant, Payment, WebhookLog, and ApiKey models.

## Quality gate
Before finishing, verify navigation, auth visuals, onboarding, widget transitions, dashboard, payments drawer, developer tools, responsive layouts, mobile overflow, keyboard focus, reduced motion, loading/error/empty states, missing imports, and console errors. Prefer a working simple fallback over a broken advanced effect.
