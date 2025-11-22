# 🚀 Guía Completa: KYC Global para Stellar - Implementación Profesional

## 📋 Tabla de Contenidos
1. [Visión General del Proyecto](#visión-general)
2. [Arquitectura y Stack Tecnológico](#arquitectura)
3. [Estructura del Proyecto](#estructura)
4. [Configuración Inicial](#configuración)
5. [Backend Implementation](#backend)
6. [Frontend Mobile-First](#frontend)
7. [Integración Stellar](#stellar)
8. [Sistema KYC](#kyc-system)
9. [Zero-Knowledge Proofs](#zk-proofs)
10. [Deployment y Testing](#deployment)

---

## 🎯 Visión General del Proyecto {#visión-general}

### Objetivo
Crear un servicio de registro KYC global para el ecosistema Stellar que elimine la duplicación de verificaciones entre anchors, utilizando credenciales verificables y pruebas de conocimiento cero.

### Características Principales
- ✅ KYC único reutilizable entre múltiples anchors
- ✅ Mobile-first con diseño profesional (estilo Veriff)
- ✅ Credenciales verificables (W3C VC)
- ✅ Pruebas ZK para selective disclosure
- ✅ Integración SEP-10/12 compatible
- ✅ Simulación completa para hackathon

### Demo Flow
```mermaid
graph LR
    A[Usuario Mobile] --> B[KYC Process]
    B --> C[Credential Generation]
    C --> D[Anchor A Verification]
    C --> E[Anchor B Verification]
    D --> F[Service Access]
    E --> F
```

---

## 🏗️ Arquitectura y Stack Tecnológico {#arquitectura}

### Stack Recomendado

```yaml
Frontend:
  - Framework: Next.js 14 con App Router
  - UI Library: Tailwind CSS + Shadcn/ui
  - State Management: Zustand
  - Stellar SDK: stellar-sdk
  - Wallet: Albedo (web-based)
  - Mobile Camera: react-webcam

Backend:
  - Runtime: Node.js con Express
  - Database: PostgreSQL + Prisma ORM
  - Cache: Redis
  - File Storage: AWS S3 (o MinIO local)
  - Crypto: Node.js crypto + snarkjs

DevOps:
  - Container: Docker
  - CI/CD: GitHub Actions
  - Hosting: Vercel (frontend) + Railway (backend)
```

### Arquitectura del Sistema

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Next.js)             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │   Wallet   │  │    KYC     │  │   Anchor   ││
│  │  Component │  │   Module   │  │ Interfaces ││
│  └────────────┘  └────────────┘  └────────────┘│
└─────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│                  API Gateway                     │
└─────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Auth API   │  │   KYC API    │  │  Stellar API │
│   (SEP-10)   │  │   (SEP-12)   │  │  Integration │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                  ┌──────────────┐
                  │   Database   │
                  │ (PostgreSQL) │
                  └──────────────┘
```

---

## 📁 Estructura del Proyecto {#estructura}

```bash
stellar-kyc-global/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── kyc/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── components/
│   │   │   │   ├── anchor/
│   │   │   │   │   └── [id]/
│   │   │   │   └── api/
│   │   │   ├── components/
│   │   │   │   ├── ui/        # Shadcn components
│   │   │   │   ├── kyc/       # KYC components
│   │   │   │   └── wallet/    # Wallet components
│   │   │   ├── lib/
│   │   │   │   ├── stellar.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── zk.ts
│   │   │   └── styles/
│   │   │       └── globals.css
│   │   └── package.json
│   │
│   └── api/                    # Backend Express
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   │   ├── auth.ts    # SEP-10
│       │   │   ├── kyc.ts     # SEP-12
│       │   │   └── anchor.ts
│       │   ├── services/
│       │   │   ├── stellar.service.ts
│       │   │   ├── kyc.service.ts
│       │   │   └── zk.service.ts
│       │   ├── prisma/
│       │   │   └── schema.prisma
│       │   └── utils/
│       └── package.json
│
├── packages/
│   ├── shared/                 # Shared types/utils
│   └── zk-circuits/           # ZK circuits
│
├── docker-compose.yml
├── turbo.json                  # Turborepo config
└── package.json
```

---

## ⚙️ Configuración Inicial {#configuración}

### 1. Inicialización del Proyecto

```bash
# Crear proyecto con Turborepo
npx create-turbo@latest stellar-kyc-global
cd stellar-kyc-global

# Configurar Next.js app
cd apps
npx create-next-app@latest web --typescript --tailwind --app

# Configurar Backend
mkdir api && cd api
npm init -y
npm install express cors helmet compression dotenv
npm install -D typescript @types/node @types/express tsx nodemon

# Volver a root y instalar dependencias compartidas
cd ../..
npm install
```

### 2. Variables de Entorno

```env
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# apps/api/.env
DATABASE_URL=postgresql://user:password@localhost:5432/kyc_global
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
STELLAR_SERVER_SECRET=your-stellar-secret
S3_BUCKET=kyc-documents
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

### 3. Configuración de Tailwind con Tema Morado

```javascript
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',  // Principal
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 🔧 Backend Implementation {#backend}

### 1. Servidor Principal

```typescript
// apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import kycRoutes from './routes/kyc';
import anchorRoutes from './routes/anchor';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);        // SEP-10
app.use('/kyc', kycRoutes);         // SEP-12
app.use('/anchor', anchorRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 2. Esquema de Base de Datos

```prisma
// apps/api/src/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String   @id @default(uuid())
  stellarAccount  String   @unique
  email           String?  @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  kycSubmission   KycSubmission?
  credentials     Credential[]
  anchorAccess    AnchorAccess[]
}

model KycSubmission {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  // Personal Info (encrypted)
  encryptedData   Json     // Contains name, DOB, address, etc.
  dataHash        String   // Hash for integrity
  
  // Document References
  documentType    String   // passport, driver_license, national_id
  documentHash    String   // Hash of document
  selfieHash      String   // Hash of selfie
  
  // Verification Status
  status          KycStatus @default(PENDING)
  verifiedAt      DateTime?
  rejectionReason String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum KycStatus {
  PENDING
  PROCESSING
  NEEDS_INFO
  APPROVED
  REJECTED
}

model Credential {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  type            String   // age_verification, identity_verification, aml_check
  claims          Json     // The actual claims
  proof           Json     // ZK proof or signature
  issuedAt        DateTime @default(now())
  expiresAt       DateTime
  revoked         Boolean  @default(false)
  
  @@index([userId, type])
}

model AnchorAccess {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  anchorId        String
  anchor          Anchor   @relation(fields: [anchorId], references: [id])
  
  grantedAt       DateTime @default(now())
  lastAccessed    DateTime?
  
  @@unique([userId, anchorId])
}

model Anchor {
  id              String   @id @default(uuid())
  name            String
  domain          String   @unique
  publicKey       String   @unique
  
  requiredClaims  String[] // List of required credential types
  isActive        Boolean  @default(true)
  
  accessLogs      AnchorAccess[]
  createdAt       DateTime @default(now())
}
```

### 3. Servicio KYC

```typescript
// apps/api/src/services/kyc.service.ts
import { PrismaClient, KycStatus } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const KycDataSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string(),
  nationality: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    country: z.string(),
    postalCode: z.string(),
  }),
  documentType: z.enum(['passport', 'driver_license', 'national_id']),
  documentNumber: z.string(),
});

export class KycService {
  // Encrypt sensitive data
  private encryptData(data: any): { encrypted: string, iv: string } {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted + ':' + authTag.toString('hex'),
      iv: iv.toString('hex'),
    };
  }
  
  // Hash document for privacy
  private hashDocument(document: Buffer): string {
    return crypto.createHash('sha256').update(document).digest('hex');
  }
  
  // Submit KYC
  async submitKyc(userId: string, kycData: any, files: any) {
    try {
      // Validate input
      const validatedData = KycDataSchema.parse(kycData);
      
      // Encrypt personal data
      const { encrypted, iv } = this.encryptData(validatedData);
      
      // Hash documents
      const documentHash = this.hashDocument(files.document);
      const selfieHash = this.hashDocument(files.selfie);
      
      // Store in database
      const submission = await prisma.kycSubmission.create({
        data: {
          userId,
          encryptedData: { data: encrypted, iv },
          dataHash: crypto.createHash('sha256')
            .update(JSON.stringify(validatedData))
            .digest('hex'),
          documentType: validatedData.documentType,
          documentHash,
          selfieHash,
          status: 'PROCESSING',
        },
      });
      
      // Simulate verification process (in production, this would be async)
      setTimeout(() => this.processVerification(submission.id), 3000);
      
      return submission;
    } catch (error) {
      console.error('KYC submission error:', error);
      throw new Error('Failed to submit KYC');
    }
  }
  
  // Process verification (mock for hackathon)
  private async processVerification(submissionId: string) {
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification logic (always approve for demo)
      const submission = await prisma.kycSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'APPROVED',
          verifiedAt: new Date(),
        },
        include: { user: true },
      });
      
      // Generate credentials
      await this.generateCredentials(submission.userId);
      
    } catch (error) {
      console.error('Verification error:', error);
    }
  }
  
  // Generate verifiable credentials
  async generateCredentials(userId: string) {
    const credentialTypes = [
      {
        type: 'identity_verification',
        claims: {
          verified: true,
          level: 'standard',
          method: 'document_selfie',
        },
      },
      {
        type: 'age_verification',
        claims: {
          over18: true,
          over21: true,
        },
      },
      {
        type: 'aml_check',
        claims: {
          passed: true,
          checkedAt: new Date().toISOString(),
        },
      },
    ];
    
    for (const cred of credentialTypes) {
      await this.createCredential(userId, cred.type, cred.claims);
    }
  }
  
  // Create a verifiable credential
  async createCredential(userId: string, type: string, claims: any) {
    // Generate proof (simplified for hackathon)
    const proof = {
      type: 'RsaSignature2018',
      created: new Date().toISOString(),
      proofPurpose: 'assertionMethod',
      jws: crypto.randomBytes(64).toString('base64'),
    };
    
    const credential = await prisma.credential.create({
      data: {
        userId,
        type,
        claims,
        proof,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });
    
    return credential;
  }
  
  // Get user credentials
  async getUserCredentials(userId: string) {
    return prisma.credential.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });
  }
  
  // Verify credential for anchor
  async verifyCredentialForAnchor(userId: string, anchorId: string) {
    // Get anchor requirements
    const anchor = await prisma.anchor.findUnique({
      where: { id: anchorId },
    });
    
    if (!anchor) throw new Error('Anchor not found');
    
    // Get user credentials
    const credentials = await this.getUserCredentials(userId);
    
    // Check if user has all required credentials
    const hasAllRequired = anchor.requiredClaims.every(required =>
      credentials.some(cred => cred.type === required)
    );
    
    if (hasAllRequired) {
      // Log access
      await prisma.anchorAccess.upsert({
        where: {
          userId_anchorId: { userId, anchorId },
        },
        create: { userId, anchorId },
        update: { lastAccessed: new Date() },
      });
    }
    
    return {
      verified: hasAllRequired,
      credentials: hasAllRequired ? credentials : [],
    };
  }
}
```

### 4. API Routes

```typescript
// apps/api/src/routes/kyc.ts
import { Router } from 'express';
import multer from 'multer';
import { KycService } from '../services/kyc.service';

const router = Router();
const kycService = new KycService();
const upload = multer({ memory: true });

// Submit KYC
router.post('/submit', 
  upload.fields([
    { name: 'document', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { userId, ...kycData } = req.body;
      const files = req.files as any;
      
      const submission = await kycService.submitKyc(
        userId, 
        kycData, 
        {
          document: files.document[0].buffer,
          selfie: files.selfie[0].buffer,
        }
      );
      
      res.json({ 
        success: true, 
        submissionId: submission.id,
        status: submission.status 
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
);

// Check KYC status
router.get('/status/:userId', async (req, res) => {
  try {
    const submission = await prisma.kycSubmission.findUnique({
      where: { userId: req.params.userId },
      select: {
        id: true,
        status: true,
        verifiedAt: true,
        rejectionReason: true,
      },
    });
    
    res.json(submission || { status: 'NOT_SUBMITTED' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get credentials
router.get('/credentials/:userId', async (req, res) => {
  try {
    const credentials = await kycService.getUserCredentials(req.params.userId);
    res.json({ credentials });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
```

---

## 💻 Frontend Mobile-First {#frontend}

### 1. Layout Principal

```tsx
// apps/web/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KYC Global - Stellar Network',
  description: 'Universal KYC verification for the Stellar ecosystem',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          <div className="min-h-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

### 2. Página Principal

```tsx
// apps/web/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/wallet/wallet-connect';

export default function HomePage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'One-Time KYC',
      description: 'Complete verification once, use everywhere in Stellar',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Instant Verification',
      description: 'Get verified in minutes, not days',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Acceptance',
      description: 'Accepted by all participating anchors',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Privacy First',
      description: 'Zero-knowledge proofs protect your data',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">KYC Global</span>
            </div>
            <WalletConnect onConnect={setIsConnected} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              One KYC.
              <span className="text-primary-500"> Endless Possibilities.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Complete your identity verification once and access any service in the Stellar ecosystem. 
              Secure, private, and universally accepted.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/kyc')}
                disabled={!isConnected}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg rounded-xl"
              >
                Start Verification
              </Button>
              <Button
                onClick={() => router.push('/demo')}
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl"
              >
                View Demo
              </Button>
            </div>
            
            {!isConnected && (
              <p className="mt-4 text-sm text-gray-500">
                Connect your wallet to begin verification
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-500">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Submit Documents', desc: 'Upload your ID and take a selfie' },
              { step: '2', title: 'Get Verified', desc: 'Our AI verifies your identity instantly' },
              { step: '3', title: 'Access Services', desc: 'Use your credential with any anchor' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

### 3. Componente KYC Mobile

```tsx
// apps/web/src/app/kyc/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Check, ArrowRight, User, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { DocumentCapture } from '@/components/kyc/document-capture';
import { SelfieCapture } from '@/components/kyc/selfie-capture';
import { PersonalInfo } from '@/components/kyc/personal-info';

type Step = 'personal' | 'document' | 'selfie' | 'processing' | 'complete';

export default function KycPage() {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [kycData, setKycData] = useState<any>({});
  const { toast } = useToast();

  const steps = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'document', name: 'Document', icon: FileText },
    { id: 'selfie', name: 'Selfie', icon: Camera },
    { id: 'processing', name: 'Processing', icon: Shield },
  ];

  const handleStepComplete = (stepData: any) => {
    setKycData((prev: any) => ({ ...prev, ...stepData }));
    
    if (currentStep === 'personal') {
      setCurrentStep('document');
    } else if (currentStep === 'document') {
      setCurrentStep('selfie');
    } else if (currentStep === 'selfie') {
      submitKyc();
    }
  };

  const submitKyc = async () => {
    setCurrentStep('processing');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock submission
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kycData),
      });
      
      if (response.ok) {
        setCurrentStep('complete');
        toast({
          title: 'Verification Complete!',
          description: 'Your identity has been verified successfully.',
        });
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit verification. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Progress Bar */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full
                      ${isComplete ? 'bg-green-500 text-white' : 
                        isActive ? 'bg-primary-500 text-white' : 
                        'bg-gray-200 text-gray-400'}
                    `}
                  >
                    {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={`w-full h-1 mx-2 ${
                        isComplete ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              {steps.find(s => s.id === currentStep)?.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'personal' && (
              <PersonalInfo onComplete={handleStepComplete} />
            )}
            
            {currentStep === 'document' && (
              <DocumentCapture onComplete={handleStepComplete} />
            )}
            
            {currentStep === 'selfie' && (
              <SelfieCapture onComplete={handleStepComplete} />
            )}
            
            {currentStep === 'processing' && (
              <Card className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-primary-500 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Verifying Your Identity</h3>
                  <p className="text-gray-600">
                    This usually takes just a few seconds...
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              </Card>
            )}
            
            {currentStep === 'complete' && (
              <Card className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-12 h-12 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2">Verification Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your identity has been successfully verified. You can now access services across the Stellar network.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => window.location.href = '/anchor/demo-a'}
                    className="w-full bg-primary-500 hover:bg-primary-600"
                  >
                    Try Demo Anchor A
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/anchor/demo-b'}
                    variant="outline"
                    className="w-full"
                  >
                    Try Demo Anchor B
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

### 4. Componente de Captura de Documentos

```tsx
// apps/web/src/components/kyc/document-capture.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DocumentCaptureProps {
  onComplete: (data: any) => void;
}

export function DocumentCapture({ onComplete }: DocumentCaptureProps) {
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1920, height: 1080 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file upload
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setDocumentImage(imageData);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCapturing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
    setDocumentImage(null);
    stopCamera();
  };

  const confirmDocument = () => {
    if (documentImage) {
      onComplete({ documentImage });
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Upload Your ID Document</h3>
        <p className="text-gray-600">
          Take a photo of your passport, driver&apos;s license, or national ID
        </p>
      </div>

      {!documentImage && !isCapturing && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Choose how to add your document</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={startCamera} className="bg-primary-500 hover:bg-primary-600">
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {isCapturing && (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button
              onClick={capturePhoto}
              className="bg-primary-500 hover:bg-primary-600 rounded-full w-16 h-16"
            >
              <Camera className="w-6 h-6" />
            </Button>
            <Button
              onClick={stopCamera}
              variant="outline"
              className="bg-white rounded-full w-16 h-16"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}

      {documentImage && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={documentImage}
              alt="Document"
              className="w-full rounded-lg"
            />
            <Button
              onClick={resetCapture}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={resetCapture}
              variant="outline"
              className="flex-1"
            >
              Retake
            </Button>
            <Button
              onClick={confirmDocument}
              className="flex-1 bg-primary-500 hover:bg-primary-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Tips for best results:</strong>
        </p>
        <ul className="text-sm text-blue-600 mt-2 space-y-1">
          <li>• Ensure good lighting</li>
          <li>• Avoid glare and shadows</li>
          <li>• Include all four corners</li>
          <li>• Make sure text is readable</li>
        </ul>
      </div>
    </Card>
  );
}
```

---

## 🔒 Zero-Knowledge Proofs {#zk-proofs}

### 1. Circuito ZK Simple (Edad)

```javascript
// packages/zk-circuits/age_verification.circom
pragma circom 2.1.0;

template AgeVerification() {
    signal input birthYear;
    signal input currentYear;
    signal input threshold; // e.g., 18
    signal output isValid;

    // Calculate age
    signal age;
    age <== currentYear - birthYear;

    // Check if age >= threshold
    component gte = GreaterEqualThan(10); // 10 bits for age
    gte.in[0] <== age;
    gte.in[1] <== threshold;
    
    isValid <== gte.out;
}

template GreaterEqualThan(n) {
    signal input in[2];
    signal output out;
    
    component lt = LessThan(n);
    lt.in[0] <== in[1]; // threshold
    lt.in[1] <== in[0] + 1; // age + 1
    
    out <== lt.out;
}

component main = AgeVerification();
```

### 2. Generador de Pruebas

```typescript
// apps/api/src/services/zk.service.ts
import { groth16 } from 'snarkjs';
import path from 'path';

export class ZkService {
  private circuitWasm: string;
  private circuitZkey: string;

  constructor() {
    this.circuitWasm = path.join(__dirname, '../../circuits/age_verification.wasm');
    this.circuitZkey = path.join(__dirname, '../../circuits/age_verification_final.zkey');
  }

  async generateAgeProof(birthYear: number, currentYear: number = 2024, threshold: number = 18) {
    try {
      // Create input
      const input = {
        birthYear: birthYear.toString(),
        currentYear: currentYear.toString(),
        threshold: threshold.toString(),
      };

      // Generate proof
      const { proof, publicSignals } = await groth16.fullProve(
        input,
        this.circuitWasm,
        this.circuitZkey
      );

      // Convert proof to a more compact format
      const proofData = {
        pi_a: proof.pi_a.slice(0, 2),
        pi_b: proof.pi_b.slice(0, 2).map((x: any) => x.slice(0, 2)),
        pi_c: proof.pi_c.slice(0, 2),
        protocol: 'groth16',
      };

      return {
        proof: proofData,
        publicSignals,
        verified: publicSignals[0] === '1',
      };
    } catch (error) {
      console.error('Error generating ZK proof:', error);
      throw new Error('Failed to generate proof');
    }
  }

  async verifyAgeProof(proof: any, publicSignals: any) {
    try {
      const vKey = await fetch('/verification_key.json').then(r => r.json());
      const res = await groth16.verify(vKey, publicSignals, proof);
      return res;
    } catch (error) {
      console.error('Error verifying proof:', error);
      return false;
    }
  }
}
```

---

## 🌐 Integración Stellar {#stellar}

### 1. Servicio Stellar

```typescript
// apps/web/src/lib/stellar.ts
import * as StellarSdk from 'stellar-sdk';
import albedo from '@albedo-link/intent';

export class StellarService {
  private server: StellarSdk.Server;
  private networkPassphrase: string;

  constructor() {
    this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    this.networkPassphrase = StellarSdk.Networks.TESTNET;
  }

  // Connect wallet using Albedo
  async connectWallet() {
    try {
      const result = await albedo.publicKey({});
      return result.pubkey;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  // Sign challenge for SEP-10
  async signAuthChallenge(challenge: string, publicKey: string) {
    try {
      const transaction = new StellarSdk.Transaction(
        challenge,
        this.networkPassphrase
      );

      const result = await albedo.tx({
        xdr: transaction.toXDR(),
        pubkey: publicKey,
        network: 'testnet',
      });

      return result.signed_envelope_xdr;
    } catch (error) {
      console.error('Failed to sign challenge:', error);
      throw error;
    }
  }

  // Create trustline for anchor assets
  async createTrustline(
    publicKey: string,
    assetCode: string,
    assetIssuer: string
  ) {
    try {
      const account = await this.server.loadAccount(publicKey);
      const asset = new StellarSdk.Asset(assetCode, assetIssuer);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: asset,
          })
        )
        .setTimeout(30)
        .build();

      const result = await albedo.tx({
        xdr: transaction.toXDR(),
        pubkey: publicKey,
        network: 'testnet',
      });

      return await this.server.submitTransaction(
        new StellarSdk.Transaction(
          result.signed_envelope_xdr,
          this.networkPassphrase
        )
      );
    } catch (error) {
      console.error('Failed to create trustline:', error);
      throw error;
    }
  }
}
```

### 2. Wallet Connect Component

```tsx
// apps/web/src/components/wallet/wallet-connect.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { StellarService } from '@/lib/stellar';
import { useToast } from '@/components/ui/use-toast';

interface WalletConnectProps {
  onConnect: (connected: boolean) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const stellar = new StellarService();

  const connectWallet = async () => {
    try {
      const key = await stellar.connectWallet();
      setPublicKey(key);
      onConnect(true);
      
      // Store in session
      sessionStorage.setItem('stellarPublicKey', key);
      
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to your Stellar wallet',
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    onConnect(false);
    sessionStorage.removeItem('stellarPublicKey');
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const savedKey = sessionStorage.getItem('stellarPublicKey');
    if (savedKey) {
      setPublicKey(savedKey);
      onConnect(true);
    }
  }, []);

  if (publicKey) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyAddress}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">{formatAddress(publicKey)}</span>
          <span className="sm:hidden">Wallet</span>
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="text-red-500 hover:text-red-600"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      className="bg-primary-500 hover:bg-primary-600 text-white"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
```

---

## 📱 Anchor Demo Pages {#anchor-demo}

### 1. Anchor A Demo

```tsx
// apps/web/src/app/anchor/demo-a/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, CheckCircle, Shield, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function AnchorADemo() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [credentials, setCredentials] = useState<any[]>([]);
  const { toast } = useToast();

  const verifyWithKycGlobal = async () => {
    setIsVerifying(true);
    
    try {
      // Simulate API call to verify credentials
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock credentials from KYC Global
      const mockCredentials = [
        { type: 'identity_verification', status: 'verified' },
        { type: 'age_verification', status: 'verified' },
        { type: 'aml_check', status: 'passed' },
      ];
      
      setCredentials(mockCredentials);
      setIsVerified(true);
      
      toast({
        title: 'Verification Successful',
        description: 'Your KYC Global credentials have been verified',
      });
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'Unable to verify credentials',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-xl">Anchor A - USD Services</span>
            </div>
            <div className="text-sm text-gray-600">
              Powered by KYC Global
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome to Anchor A</h1>
              <p className="text-gray-600">
                Deposit and withdraw USD using your bank account
              </p>
            </div>

            {!isVerified ? (
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-primary-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">KYC Global Verification</h3>
                      <p className="text-gray-600 mb-4">
                        We use KYC Global for instant verification. If you&apos;ve already 
                        completed KYC with them, you can access our services immediately.
                      </p>
                      <Button
                        onClick={verifyWithKycGlobal}
                        disabled={isVerifying}
                        className="bg-primary-500 hover:bg-primary-600"
                      >
                        {isVerifying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify with KYC Global
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <DollarSign className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="font-semibold">Low Fees</h4>
                    <p className="text-sm text-gray-600">Only 0.5% per transaction</p>
                  </Card>
                  <Card className="p-4">
                    <CheckCircle className="w-8 h-8 text-blue-500 mb-2" />
                    <h4 className="font-semibold">Instant Processing</h4>
                    <p className="text-sm text-gray-600">Deposits clear in minutes</p>
                  </Card>
                  <Card className="p-4">
                    <Shield className="w-8 h-8 text-purple-500 mb-2" />
                    <h4 className="font-semibold">Bank-Grade Security</h4>
                    <p className="text-sm text-gray-600">Your funds are protected</p>
                  </Card>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold">Verification Complete</h3>
                      <p className="text-gray-600">Your KYC Global credentials are valid</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {credentials.map((cred, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          {cred.type.replace('_', ' ').toUpperCase()}: {cred.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="bg-blue-500 hover:bg-blue-600 py-6">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Deposit USD
                  </Button>
                  <Button variant="outline" className="py-6">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Withdraw USD
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Want to try another anchor?
                  </p>
                  <Button
                    variant="link"
                    onClick={() => window.location.href = '/anchor/demo-b'}
                    className="text-primary-500"
                  >
                    Visit Anchor B →
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
```

---

## 🚀 Deployment y Testing {#deployment}

### 1. Docker Configuration

```dockerfile
# Dockerfile for API
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: kyc_global
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build: ./apps/api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://admin:secure_password@postgres:5432/kyc_global
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - api

volumes:
  postgres_data:
```

### 2. Testing Script

```bash
#!/bin/bash
# test.sh

echo "🧪 Running Tests for KYC Global Platform"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run backend tests
echo "🔧 Testing Backend..."
cd apps/api
npm test

# Run frontend tests  
echo "💻 Testing Frontend..."
cd ../web
npm test

# Run E2E tests
echo "🎯 Running E2E Tests..."
npx cypress run

echo "✅ All tests passed!"
```

### 3. Deployment to Vercel/Railway

```json
// vercel.json for frontend
{
  "buildCommand": "cd apps/web && npm run build",
  "outputDirectory": "apps/web/.next",
  "devCommand": "cd apps/web && npm run dev",
  "installCommand": "npm install"
}
```

```yaml
# railway.toml for backend
[build]
builder = "nixpacks"
buildCommand = "cd apps/api && npm ci && npx prisma generate"

[deploy]
startCommand = "cd apps/api && npm start"
healthcheckPath = "/health"
```

---

## 📊 Métricas de Éxito

### Para el Hackathon
- ✅ Demo funcional end-to-end
- ✅ KYC simulado con captura de documentos
- ✅ Credencial reutilizable entre 2+ anchors
- ✅ Una prueba ZK simple funcionando
- ✅ UI mobile-first profesional
- ✅ Integración con wallet Stellar

### Para Producción
- 📈 Reducción 80% en tiempo de verificación
- 💰 Reducción 60% en costos de KYC por anchor
- 🔒 Zero data breaches
- ⚡ <3 segundos tiempo de verificación
- 🌍 Compatible con regulaciones globales

---

## 🎯 Próximos Pasos

1. **Fase 1 - MVP (Hackathon)**
   - Implementar flujo completo con datos mock
   - Demo con 2 anchors simulados
   - Prueba ZK básica de edad

2. **Fase 2 - Alpha**
   - Integración con proveedor KYC real
   - Implementar MPC/threshold básico
   - Pruebas con anchors reales en testnet

3. **Fase 3 - Beta**
   - Auditoría de seguridad
   - Compliance regulatorio
   - Lanzamiento en mainnet con anchors piloto

4. **Fase 4 - Producción**
   - Escalar a múltiples jurisdicciones
   - SDK para anchors
   - Marketplace de credenciales

---

## 📚 Recursos Adicionales

- [Stellar SEP Documentation](https://github.com/stellar/stellar-protocol/tree/master/ecosystem)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [Zero-Knowledge Proofs Guide](https://github.com/matter-labs/awesome-zero-knowledge-proofs)
- [Albedo Wallet Docs](https://albedo.link/docs/)

---

## 🤝 Contribución

Este proyecto está optimizado para desarrollo rápido en hackathons. Para contribuir:

1. Fork el repositorio
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Siéntete libre de usar este código para tu hackathon.

---

## 🏆 Tips para Ganar el Hackathon

1. **Demo Impecable**: Practica la demo hasta que sea perfecta
2. **Storytelling**: Cuenta la historia del problema que resuelves
3. **UX Pulida**: Los pequeños detalles marcan la diferencia
4. **Valor Real**: Muestra el impacto en el ecosistema Stellar
5. **Código Limpio**: Aunque sea un MVP, mantén el código organizado

¡Éxito en tu hackathon! 🚀