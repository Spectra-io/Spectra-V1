# Guía de Deployment en Railway

Esta guía te ayudará a deployar Spectra KYC Global en Railway en aproximadamente 15 minutos.

## Requisitos Previos

1. Cuenta de GitHub (ya tienes el repo: https://github.com/Spectra-io/Spectra-V1.git)
2. Cuenta de Railway (regístrate en https://railway.app con GitHub)
3. Tu código debe estar pusheado a GitHub

## Paso 1: Preparar el Proyecto (YA HECHO ✅)

Los siguientes cambios ya están aplicados:
- ✅ Scripts de build actualizados en `apps/api/package.json`
- ✅ Variables de entorno configuradas
- ✅ Prisma configurado para generar automáticamente

## Paso 2: Crear Proyecto en Railway

1. Ve a https://railway.app
2. Click en "Start a New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway a acceder a tu repositorio
5. Selecciona el repositorio `Spectra-io/Spectra-V1`

## Paso 3: Configurar PostgreSQL

Railway detectará que necesitas una base de datos:

1. Click en "+ New" en tu proyecto
2. Selecciona "Database" → "PostgreSQL"
3. Railway generará automáticamente la variable `DATABASE_URL`

## Paso 4: Configurar el Backend (API)

1. En tu proyecto de Railway, click en "+ New"
2. Selecciona "GitHub Repo" → Tu repositorio
3. Railway detectará el monorepo. Configura:

**Settings del servicio:**
- **Service Name**: `spectra-api`
- **Root Directory**: `apps/api`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

**Variables de Entorno (Settings → Variables):**
```
NODE_ENV=production
PORT=3001
ENCRYPTION_KEY=<genera uno nuevo con: openssl rand -hex 32>
JWT_SECRET=<genera uno nuevo>
STELLAR_SERVER_SECRET=<tu secret key de Stellar>
STELLAR_NETWORK=testnet
HORIZON_URL=https://horizon-testnet.stellar.org
```

**IMPORTANTE**: Railway conectará automáticamente `DATABASE_URL` de PostgreSQL

4. Click en "Deploy"

## Paso 5: Configurar el Frontend (Web)

1. En tu proyecto de Railway, click en "+ New"
2. Selecciona "GitHub Repo" → Tu repositorio
3. Configura:

**Settings del servicio:**
- **Service Name**: `spectra-web`
- **Root Directory**: `apps/web`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

**Variables de Entorno:**

ESPERA a que el backend esté deployed primero. Railway te dará una URL como:
`https://spectra-api-production.up.railway.app`

Entonces añade:
```
NEXT_PUBLIC_API_URL=https://spectra-api-production.up.railway.app
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

4. Click en "Deploy"

## Paso 6: Configurar Dominios y CORS

### Backend:
1. Ve al servicio `spectra-api`
2. Settings → Networking → Generate Domain
3. Copia la URL (ej: `https://spectra-api-production.up.railway.app`)

### Frontend:
1. Ve al servicio `spectra-web`
2. Settings → Networking → Generate Domain
3. Copia la URL (ej: `https://spectra-web-production.up.railway.app`)

### Actualizar CORS en el Backend:

Ve al archivo `apps/api/src/index.ts` y actualiza la configuración de CORS:

```typescript
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://spectra-web-production.up.railway.app', // Tu dominio de Railway
    ],
    credentials: true,
  })
);
```

Haz commit y push. Railway redesplegará automáticamente.

## Paso 7: Seed de la Base de Datos

Una vez que el backend esté desplegado:

1. Ve a `spectra-api` → Settings → Variables
2. Añade un nuevo comando temporal en el dashboard de Railway
3. O conéctate vía Railway CLI:

```bash
# Instala Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Run seed
railway run --service spectra-api npm run db:seed
```

## Paso 8: Verificar el Deployment

1. Abre tu URL del frontend: `https://spectra-web-production.up.railway.app`
2. Click en "Connect Demo"
3. Ve a "Start Verification"
4. Completa el flujo KYC
5. Prueba en Anchor A y Anchor B

## Troubleshooting

### Error: "Prisma Client not generated"
- Ve a Settings del servicio API
- En "Build Command" asegúrate de tener: `npm install && npm run build`
- El postinstall debería generar Prisma automáticamente

### Error: "CORS"
- Verifica que la URL del frontend esté en el array de CORS del backend
- Asegúrate de haber hecho push después de actualizar CORS

### Error: "Cannot connect to database"
- Ve a Variables del servicio API
- Verifica que `DATABASE_URL` esté presente (Railway la añade automáticamente si linkeas PostgreSQL)

### Frontend no se conecta al Backend
- Verifica que `NEXT_PUBLIC_API_URL` en el frontend apunte a la URL correcta del backend
- Debe incluir `https://` y NO terminar en `/`

## Costos

Railway ofrece:
- **$5 USD gratis al mes**
- Suficiente para demos y hackathons
- PostgreSQL incluido en el plan gratuito

## Monitoreo

Railway provee:
- Logs en tiempo real (click en cualquier servicio → View Logs)
- Métricas de CPU/RAM
- Database size

## URL de Producción

Una vez desplegado, tu app estará disponible en:
- **Frontend**: https://spectra-web-production.up.railway.app
- **API**: https://spectra-api-production.up.railway.app

¡Listo para el hackathon! 🚀
