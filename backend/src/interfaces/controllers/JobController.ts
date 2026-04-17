import { Request, Response } from 'express';
import { JobManagementEngine } from '../../engine/JobManagementEngine';

export class JobController {
  private jobEngine: JobManagementEngine;

  constructor() {
    this.jobEngine = new JobManagementEngine();
  }

  createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const job = await this.jobEngine.createJob(req.body);
      res.status(201).json({ success: true, data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobs = await this.jobEngine.getAllJobs(req.query);
      res.status(200).json({ success: true, data: jobs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
      const job = await this.jobEngine.getJobById(req.params.id as string);
      if (!job) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }
      res.status(200).json({ success: true, data: job });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const job = await this.jobEngine.updateJob(req.params.id as string, req.body);
      if (!job) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }
      res.status(200).json({ success: true, data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const success = await this.jobEngine.deleteJob(req.params.id as string);
      if (!success) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
