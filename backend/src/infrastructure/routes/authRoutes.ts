import { Router } from 'express';
import multer from 'multer';
import { AuthController } from '../../controllers/AuthController';
import { AuthUseCase } from '../../useCases/authUseCase/AuthUseCase';
import { EmployerRepository } from '../../repositories/employerRepository/EmployerRepository';
import { TokenEngine } from '../../engines/tokenEngine/TokenEngine';
import { AuthMiddleware } from '../middleware/Auth/AuthMiddleware';

const authRouter = Router();

// Configure Multer for Logo Uploads
const upload = multer({ dest: 'uploads/logos/' });

// IoC Initialization for Auth Module (Dependency Injection)
const tokenEngine = new TokenEngine();
const employerRepository = new EmployerRepository();

const authUseCase = new AuthUseCase({
  EmployerRepository: employerRepository,
  TokenEngine: tokenEngine,
});

const authController = new AuthController({
  AuthUseCase: authUseCase,
});

const authMiddleware = new AuthMiddleware({
  TokenEngine: tokenEngine,
});

// Routes
authRouter.post('/signup-with-setup', upload.single('logo'), authController.signupWithSetup.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/refresh-token', authController.refreshToken.bind(authController));

// Protected route example - Logout
authRouter.post(
  '/logout',
  authMiddleware.verify(),
  authController.logout.bind(authController)
);

export default authRouter;
