import { Router } from 'express';
import { JobController } from '../../controllers/JobController';
import { AuthMiddleware } from '../middleware/Auth/AuthMiddleware';
import { TokenEngine } from '../../engines/tokenEngine/TokenEngine';

const router = Router();
const jobController = new JobController();
const authMiddleware = new AuthMiddleware({ TokenEngine: new TokenEngine() });
const auth = authMiddleware.verify();

router.post('/', auth, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/my-jobs', auth, jobController.getMyJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);

export default router;
