# Blew: Payments at the Speed of Wind

A Solana payment widget for accepting crypto payments on any website.

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/blew.git
cd blew

# Install dependencies
npm install

# Setup database
cp .env.example .env
cd packages/api && npx prisma migrate dev

# Start development
npm run dev

# Backend: http://localhost:3000
# Database UI: http://localhost:5555 (prisma studio)
```

For local widget development, omit `apiBase`; Vite proxies `/api` from `localhost:5137` to the API on `localhost:3000`, avoiding browser CORS. For a deployed merchant site that calls the API directly, set `apiBase` and configure the API's `ALLOWED_ORIGINS` environment variable with the merchant origin, for example `https://shop.example.com`.

## Wallet integration migration

The widget now uses Solana Wallet Adapter as its only wallet mechanism.

### Older mechanism: custom Phantom integration

The previous implementation called `window.solana` directly through a local `useWallets` hook. That mechanism was Phantom-only, maintained its own connection state, and was separate from the Wallet Adapter context used by transaction submission. As a result, a wallet could appear connected while `sendTransaction` failed with a missing `WalletProvider` error.

Do not combine the old hook with Wallet Adapter. The old `useWallet.ts` implementation is no longer the integration path.

### Current mechanism: Wallet Adapter

Wallet Adapter owns wallet discovery, connection state, signing, disconnects, and wallet changes. The widget uses `useWallet()` and `useConnection()` from `@solana/wallet-adapter-react` and supports Phantom through `PhantomWalletAdapter`.

For the local demo, use the included provider:

```tsx
import { BlewWalletProvider, BlewWidget } from '@blew/widget'

<BlewWalletProvider endpoint="https://api.devnet.solana.com">
	<BlewWidget merchantId="merchant_123" amount={1.5} apiKey="your-api-key" />
</BlewWalletProvider>
```

In a host application that already has Wallet Adapter configured, mount `BlewWidget` under the host's existing `ConnectionProvider` and `WalletProvider` instead of adding a second provider tree. The `apiBase` prop selects the payment API. The client first prepares the merchant recipient, signs the SOL transfer, then submits the signature; the server stores it as pending and confirmation is handled separately.

## 📁 Project Structure

```
blew/
├── packages/
│   ├── api/           # Next.js backend (Vercel)
│   ├── widget/        # React component (NPM)
│   └── types/         # Shared TypeScript
├── solFlow/           # Documentation
├── turbo.json         # Monorepo config
└── package.json       # Root workspace
```

## 🛠 Available Commands

```bash
npm run dev              # Start all services
npm run build            # Build all packages
npm run test             # Run tests
npm run db:studio        # Open Prisma Studio
npm run clean            # Clean all build files
```

## 📚 Documentation

See [solFlow/00_MAIN_INDEX.md](solFlow/00_MAIN_INDEX.md) for complete guide.

## 🔧 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Backend:** Next.js 13 + TypeScript
- **Database:** PostgreSQL + Prisma
- **Blockchain:** Solana Web3.js
- **Wallet:** Phantom
- **Monorepo:** Turbo

## 📝 License

MIT
