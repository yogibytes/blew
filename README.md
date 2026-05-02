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
