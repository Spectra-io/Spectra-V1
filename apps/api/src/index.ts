import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import kycRoutes from './routes/kyc';
import anchorRoutes from './routes/anchor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Spectra KYC Global API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      kyc: '/kyc',
      anchors: '/anchor',
      health: '/health',
    },
  });
});

// API Routes
app.use('/kyc', kycRoutes);
app.use('/anchor', anchorRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Spectra API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 KYC endpoints: http://localhost:${PORT}/kyc`);
  console.log(`📍 Anchor endpoints: http://localhost:${PORT}/anchor`);
});
