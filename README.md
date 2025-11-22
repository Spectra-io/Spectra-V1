# Spectra - KYC Global for Stellar 🌟

Universal identity verification system for the Stellar ecosystem. Complete KYC once, use it everywhere.

## 🎯 Project Overview

Spectra eliminates redundant KYC processes across the Stellar network by providing:

- ✅ **One-time KYC verification** that works with all participating anchors
- 🔒 **Privacy-preserving credentials** using Zero-Knowledge Proofs
- 🚀 **Instant verification** - no more waiting days for each anchor
- 📱 **Mobile-first experience** - complete verification from your phone
- 🌐 **SEP-10/12 compatible** - works with existing Stellar infrastructure

## 🏗️ Architecture

This is a **Turborepo monorepo** with the following structure:

```
spectra-kyc-global/
├── apps/
│   ├── web/          # Next.js 14 frontend (mobile-first)
│   └── api/          # Express backend with Prisma ORM
├── packages/
│   ├── shared/       # Shared TypeScript types
│   └── zk-circuits/  # Zero-Knowledge proof circuits
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for database)

### Installation

```bash
# Install dependencies
npm install

# Start PostgreSQL & Redis
docker-compose up -d

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development servers
npm run dev
```

The apps will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📦 Workspaces

### Apps

- **web**: Next.js 14 app with Tailwind CSS, mobile-first UI
- **api**: Express server with TypeScript, Prisma, and Stellar integration

### Packages

- **shared**: Common TypeScript types and utilities
- **zk-circuits**: Circom circuits for zero-knowledge proofs

## 🛠️ Development

```bash
# Run all apps in dev mode
npm run dev

# Build all apps
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Open Prisma Studio
npm run db:studio
```

## 🔑 Environment Variables

Create `.env` files in the following locations:

### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

### `apps/api/.env`
```env
DATABASE_URL=postgresql://admin:password@localhost:5432/kyc_global
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
ENCRYPTION_KEY=your-encryption-key-hex
STELLAR_SERVER_SECRET=your-stellar-secret
PORT=3001
```

## 🎨 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Stellar SDK** - Blockchain integration
- **Albedo** - Web-based Stellar wallet

### Backend
- **Express** - Node.js web framework
- **Prisma** - Modern ORM
- **PostgreSQL** - Database
- **Redis** - Caching layer
- **Stellar SDK** - SEP-10/12 implementation

### Security & Privacy
- **AES-256-GCM** - Data encryption
- **Circom** - ZK circuit language
- **snarkjs** - ZK proof generation/verification

## 📱 Features

### For Users
1. **Complete KYC once** - Upload ID and selfie from your phone
2. **Get verified** - AI-powered verification in minutes
3. **Receive credentials** - Privacy-preserving verifiable credentials
4. **Use anywhere** - Access any Stellar anchor instantly

### For Anchors
1. **Instant verification** - Check user credentials without storing data
2. **Reduced costs** - No need for individual KYC providers
3. **Regulatory compliance** - Standardized verification process
4. **Easy integration** - SEP-10/12 compatible APIs

## 🔐 Security Model

- **End-to-end encryption** - All PII encrypted with AES-256-GCM
- **Selective disclosure** - Share only necessary attributes via ZK proofs
- **No central data store** - Documents hashed, not stored
- **Verifiable credentials** - Cryptographically signed attestations
- **Threshold encryption ready** - Architecture supports MPC/threshold schemes

## 📄 License

MIT - Built for the Stellar Hackathon

## 🤝 Contributing

This project is optimized for hackathon development. Contributions welcome!

---

**Built with ❤️ for the Stellar ecosystem**
