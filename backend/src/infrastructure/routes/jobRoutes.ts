import { Router } from 'express';
import { JobController } from '../../controllers/JobController';
import { JobManagementUseCase } from '../../useCases/jobUseCase/JobManagementUseCase';
import { JobManagementEngine } from '../../engines/JobManagementEngine';
import { JobRepository } from '../../repositories/jobRepository/JobRepository';
import { EmployerRepository } from '../../repositories/employerRepository/EmployerRepository';
import { AuthMiddleware } from '../middleware/Auth/AuthMiddleware';
import { TokenEngine } from '../../engines/tokenEngine/TokenEngine';

const router = Router();
// IoC wiring according to architecture rules
const jobRepository = new JobRepository();
const employerRepository = new EmployerRepository();
const jobEngine = new JobManagementEngine({ 
  JobRepository: jobRepository, 
  EmployerRepository: employerRepository 
});
const jobUseCase = new JobManagementUseCase({ JobEngine: jobEngine });
const jobController = new JobController({ JobUseCase: jobUseCase });
const authMiddleware = new AuthMiddleware({ TokenEngine: new TokenEngine() });
const auth = authMiddleware.verify();

router.post('/', auth, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/my-jobs', auth, jobController.getMyJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);

export default router;
