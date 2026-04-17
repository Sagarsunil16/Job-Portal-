import { Router } from 'express';
import { JobController } from '../interfaces/controllers/JobController';

const router = Router();
const jobController = new JobController();

router.post('/', jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

export default router;
