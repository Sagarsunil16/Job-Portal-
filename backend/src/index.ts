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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
