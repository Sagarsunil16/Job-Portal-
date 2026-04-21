import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController';
import multer from 'multer';

// Multer memory storage for logo upload
const upload = multer({ storage: multer.memoryStorage() });
import { AuthUseCase } from '../../useCases/authUseCase/AuthUseCase';
import { AuthEngine } from '../../engines/authEngine/AuthEngine';
import { CloudinaryEngine } from '../../engines/cloudinaryEngine/CloudinaryEngine';
import { EmployerRepository } from '../../repositories/employerRepository/EmployerRepository';
import { TokenEngine } from '../../engines/tokenEngine/TokenEngine';
import { AuthMiddleware } from '../middleware/Auth/AuthMiddleware';

const authRouter = Router();


// IoC Initialization for Auth Module (Dependency Injection)
const tokenEngine = new TokenEngine();
const employerRepository = new EmployerRepository();

const cloudinaryEngine = new CloudinaryEngine();

const authEngine = new AuthEngine({
  EmployerRepository: employerRepository,
});

const authUseCase = new AuthUseCase({
  AuthEngine: authEngine,
  TokenEngine: tokenEngine,
  CloudinaryEngine: cloudinaryEngine,
});

const authMiddleware = new AuthMiddleware({
  TokenEngine: tokenEngine,
});

const authController = new AuthController({
  AuthUseCase: authUseCase,
  AuthMiddleware: authMiddleware
});

// Routes
authRouter.post('/signup-with-setup', upload.single('logo'), authController.signupWithSetup);
authRouter.post('/login', authController.login);
authRouter.post('/refresh-token', authController.refreshToken);

// Protected route handled internally by controller
authRouter.post('/logout', authController.logout);

export default authRouter;
