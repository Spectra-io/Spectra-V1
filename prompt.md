# Prompt para Claude Code - Análisis del Proyecto KYC Global Stellar

## Instrucciones para Claude Code

Necesito que realices un análisis técnico exhaustivo del proyecto KYC Global para Stellar que ya está implementado. Por favor, examina TODO el código fuente, la arquitectura, y las implementaciones técnicas, y genera un reporte detallado en formato Markdown.

## 1. ANÁLISIS DE ESTRUCTURA DEL PROYECTO

Primero, ejecuta estos comandos para entender la estructura:

```bash
# Ver estructura general del proyecto
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -50
find . -type f -name "*.prisma"
find . -type f -name "*.sql"
find . -type f -name "*.circom"
find . -type f -name "package.json" | xargs grep -l "snarkjs\|circom"

# Verificar si existe documentación
ls -la *.md README.md docs/

# Ver la estructura de directorios principal
tree -L 3 -I 'node_modules|.git|dist|build' 2>/dev/null || find . -type d -not -path "*/node_modules/*" -not -path "*/.git/*" | head -30
```

## 2. ANÁLISIS DE BASE DE DATOS

Analiza específicamente:

```bash
# Buscar esquemas de Prisma o configuraciones de DB
find . -name "schema.prisma" -exec cat {} \;
find . -name "*.sql" -exec cat {} \;
find . -name "migrations" -type d

# Buscar configuraciones de base de datos
grep -r "DATABASE_URL\|POSTGRES\|MONGODB\|REDIS" --include="*.env*" --include="*.ts" --include="*.js" 2>/dev/null | head -20

# Analizar modelos de datos
grep -r "model\|schema\|Schema\|Model" --include="*.ts" --include="*.js" --include="*.prisma" | head -30
```

Revisa específicamente:
- ¿Qué base de datos están usando? (PostgreSQL, MongoDB, etc.)
- ¿Cómo están estructuradas las tablas/colecciones?
- ¿Existe encriptación de datos sensibles?
- ¿Cómo manejan los datos KYC de los usuarios?
- ¿Hay separación entre datos sensibles y metadatos?
- ¿Implementaron el patrón de envelope encryption mencionado en los requerimientos?

## 3. ANÁLISIS DE ZERO-KNOWLEDGE PROOFS

```bash
# Buscar implementaciones ZK
find . -name "*.circom" -exec cat {} \;
grep -r "snarkjs\|zk\|proof\|witness\|circuit" --include="*.ts" --include="*.js" --include="*.tsx" | head -30
grep -r "groth16\|plonk\|stark" --include="*.ts" --include="*.js" | head -20

# Buscar archivos de circuitos compilados
find . -name "*.wasm" -o -name "*.zkey" -o -name "*.r1cs" | head -20

# Analizar servicios ZK
find . -path "*/zk*" -name "*.ts" -o -path "*/zk*" -name "*.js" | xargs cat 2>/dev/null
```

Evalúa:
- ¿Implementaron ZK proofs reales o simulados?
- ¿Qué biblioteca están usando (snarkjs, circom, otros)?
- ¿Qué atributos pueden probar sin revelar (edad, identidad, AML)?
- ¿Los circuitos están correctamente implementados?
- ¿Hay verificación on-chain o off-chain?

## 4. ANÁLISIS DE SEGURIDAD Y ENCRIPTACIÓN

```bash
# Buscar implementaciones de encriptación
grep -r "encrypt\|decrypt\|crypto\|cipher\|AES\|RSA" --include="*.ts" --include="*.js" | head -30
grep -r "KEY\|SECRET\|SALT\|IV" --include="*.env*" --include="*.ts" | head -20

# Buscar manejo de claves
grep -r "KMS\|HSM\|threshold\|MPC" --include="*.ts" --include="*.js" | head -20

# Verificar hashing de documentos
grep -r "hash\|sha256\|sha512\|createHash" --include="*.ts" --include="*.js" | head -20
```

Analiza:
- ¿Están encriptando datos en reposo?
- ¿Usan envelope encryption como se recomendó?
- ¿Implementaron threshold encryption/MPC o es tradicional?
- ¿Cómo manejan las claves de encriptación?
- ¿Los documentos se hashean antes de almacenar?

## 5. ANÁLISIS DE INTEGRACIÓN STELLAR

```bash
# Buscar integraciones Stellar
grep -r "stellar\|horizon\|sep-10\|sep-12\|sep-24\|anchor" --include="*.ts" --include="*.js" -i | head -30
grep -r "albedo\|freighter\|wallet" --include="*.ts" --include="*.tsx" | head -20

# Buscar endpoints API relacionados con SEP
find . -path "*/api/*" -name "*.ts" -o -path "*/routes/*" -name "*.ts" | xargs grep -l "sep\|auth\|kyc" 2>/dev/null
```

Verifica:
- ¿Implementaron SEP-10 para autenticación?
- ¿Hay endpoints compatibles con SEP-12?
- ¿Cómo manejan la integración con wallets?
- ¿Usaron Albedo como se recomendó para mobile?

## 6. ANÁLISIS DE CREDENCIALES VERIFICABLES

```bash
# Buscar implementación de VCs
grep -r "credential\|verifiable\|attestation\|claim\|VC\|JWT" --include="*.ts" --include="*.js" | head -30
grep -r "issue\|verify\|revoke" --include="*.ts" --include="*.js" | head -20
```

Evalúa:
- ¿Están generando credenciales verificables W3C?
- ¿Cómo firman las credenciales?
- ¿Implementaron selective disclosure?
- ¿Hay mecanismo de revocación?

## 7. ANÁLISIS DE ARQUITECTURA FRONTEND

```bash
# Analizar estructura frontend
find . -path "*/app/*" -name "*.tsx" -o -path "*/pages/*" -name "*.tsx" | head -20
find . -name "tailwind.config.*" -exec cat {} \;

# Buscar componentes de KYC
find . -path "*kyc*" -name "*.tsx" -o -path "*kyc*" -name "*.ts" | head -20

# Verificar mobile-first
grep -r "mobile\|responsive\|viewport" --include="*.tsx" --include="*.css" | head -20
```

Verifica:
- ¿Es realmente mobile-first?
- ¿Usa el esquema de colores morado/blanco?
- ¿Tiene captura de documentos desde mobile?
- ¿La UX es profesional estilo Veriff?

## 8. ANÁLISIS DE FLUJO DE DEMO

```bash
# Buscar implementación de anchors demo
find . -path "*anchor*" -name "*.tsx" -o -path "*anchor*" -name "*.ts" | head -20

# Buscar flujo de verificación
grep -r "verify\|verification\|validate" --include="*.ts" --include="*.tsx" | head -30
```

Evalúa:
- ¿Hay múltiples anchors demo implementados?
- ¿Se puede reutilizar la credencial entre anchors?
- ¿El flujo de KYC es completo (personal → documento → selfie)?

## 9. GENERAR REPORTE

Después de analizar todo lo anterior, genera un archivo `TECHNICAL_ANALYSIS_REPORT.md` con la siguiente estructura:

```markdown
# 📊 Reporte Técnico - KYC Global Stellar

## 📋 Resumen Ejecutivo
[Resumen de 3-4 párrafos sobre el estado general del proyecto]

## ✅ Requerimientos Cumplidos

### Requerimientos Core Cumplidos ✓
- [ ] KYC único reutilizable entre anchors
- [ ] Mobile-first responsive
- [ ] Integración con wallet Stellar
- [ ] Simulación de proceso KYC completo
- [ ] Credenciales verificables
- [ ] Demo con múltiples anchors

### Requerimientos de Seguridad
- [ ] Encriptación de datos sensibles
- [ ] Hashing de documentos
- [ ] Separación datos/metadatos
- [ ] Manejo seguro de claves

### Implementación Zero-Knowledge
- [ ] Circuitos ZK implementados
- [ ] Pruebas de atributos sin revelar datos
- [ ] Verificación de pruebas
- [ ] Selective disclosure

### Arquitectura y Base de Datos
- [ ] Base de datos estructurada
- [ ] Esquema de datos apropiado
- [ ] Índices y optimizaciones
- [ ] Backup y recuperación

## 🔍 Análisis Detallado

### 1. Base de Datos
[Análisis detallado de la implementación de BD]
- Tecnología usada:
- Esquema implementado:
- Fortalezas:
- Debilidades:
- Código relevante:

### 2. Zero-Knowledge Proofs
[Análisis de la implementación ZK]
- Tipo de implementación:
- Bibliotecas usadas:
- Circuitos implementados:
- Nivel de funcionalidad:

### 3. Seguridad y Encriptación
[Análisis del manejo de seguridad]
- Métodos de encriptación:
- Gestión de claves:
- Cumplimiento con recomendaciones:

### 4. Integración Stellar
[Análisis de SEPs y wallet]
- SEPs implementados:
- Integración de wallet:
- Compatibilidad con anchors:

### 5. Frontend y UX
[Análisis de la experiencia de usuario]
- Mobile-first:
- Diseño profesional:
- Flujo de KYC:

## 📊 Métricas de Cumplimiento

| Categoría | Requerimientos | Cumplidos | Porcentaje |
|-----------|---------------|-----------|------------|
| Core | 8 | X | X% |
| Seguridad | 6 | X | X% |
| ZK Proofs | 4 | X | X% |
| Stellar | 5 | X | X% |
| UX/UI | 5 | X | X% |
| **TOTAL** | **28** | **X** | **X%** |

## 🚨 Hallazgos Críticos
[Lista de problemas críticos encontrados]

## ⚠️ Áreas de Mejora
[Recomendaciones específicas]

## 💡 Aspectos Destacables
[Implementaciones excepcionales o innovadoras]

## 🎯 Recomendaciones para Hackathon

### Para la Demo
1. [Recomendación 1]
2. [Recomendación 2]

### Quick Fixes Antes de Presentar
1. [Fix 1]
2. [Fix 2]

## 📝 Conclusión
[Evaluación final del proyecto]

---
*Reporte generado el: [FECHA]*
*Analista: Claude Code*
```

## IMPORTANTE:
- Sé MUY ESPECÍFICO y técnico en tu análisis
- Incluye snippets de código relevantes
- Marca con ✅ los requerimientos cumplidos y con ❌ los no cumplidos
- Sé honesto sobre las limitaciones encontradas
- Proporciona recomendaciones accionables

Ejecuta todos los comandos necesarios, analiza profundamente el código y genera el reporte más completo posible en `/TECHNICAL_ANALYSIS_REPORT.md`.

## Nota Final:
Si encuentras que el proyecto está en un monorepo (turborepo, nx, etc.) o tiene estructura diferente, adapta los comandos según sea necesario. El objetivo es entender EXACTAMENTE qué implementaron y qué tan bien cumple con los requerimientos originales del documento context.md.