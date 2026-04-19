import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './infrastructure/database/connection';
import jobRoutes from './infrastructure/routes/jobRoutes';
import authRoutes from './infrastructure/routes/authRoutes';
import handleErrors from './infrastructure/middleware/ErrorHandlerMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration: Supports local dev, production URL, and Vercel preview subdomains
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(ao => ao.trim() === origin) || 
                      origin.endsWith('.vercel.app') || 
                      origin === 'http://localhost:3000';

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Centralized Error Handling Middleware (must be last)
app.use(handleErrors);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
