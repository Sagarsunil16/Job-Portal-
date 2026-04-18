import { Request, Response } from 'express';
import { JobManagementEngine } from '../engines/JobManagementEngine';
import { EmployerRepository } from '../repositories/employerRepository/EmployerRepository';

export class JobController {
  private jobEngine: JobManagementEngine;
  private employerRepository: EmployerRepository;

  constructor() {
    this.jobEngine = new JobManagementEngine();
    this.employerRepository = new EmployerRepository();
  }

  createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      // employerId is securely extracted from the JWT payload — never trusted from body
      const employerId = req.user?.employerId;
      if (!employerId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // Look up companyName from the employer's profile — never trust it from the request body
      const employer = await this.employerRepository.findById(employerId);
      const companyName = employer?.companyName || 'Unknown Company';

      const job = await this.jobEngine.createJob({ ...req.body, employerId, companyName });
      res.status(201).json({ success: true, data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 7;
      const search = req.query.search as string;

      const result = await this.jobEngine.getAllJobs({}, page, limit, search);

      res.status(200).json({ 
        success: true, 
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        }
      });
    } catch (error: any) {
      console.error("[JobController] getJobs Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getMyJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const employerId = req.user?.employerId;
      if (!employerId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 7;
      const search = req.query.search as string;

      const result = await this.jobEngine.getJobsByEmployer(employerId, page, limit, search);

      res.status(200).json({ 
        success: true, 
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        }
      });
    } catch (error: any) {
      console.error("[JobController] getMyJobs Error:", error);
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
      const employerId = req.user?.employerId;
      if (!employerId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // Authorization: verify the job belongs to the requesting employer
      const existingJob = await this.jobEngine.getJobById(req.params.id as string);
      if (!existingJob) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }
      if (existingJob.employerId !== employerId) {
        res.status(403).json({ success: false, message: 'Forbidden: You do not own this job' });
        return;
      }

      const updatedJob = await this.jobEngine.updateJob(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: updatedJob });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const employerId = req.user?.employerId;
      if (!employerId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // Authorization: verify the job belongs to the requesting employer
      const existingJob = await this.jobEngine.getJobById(req.params.id as string);
      if (!existingJob) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }
      if (existingJob.employerId !== employerId) {
        res.status(403).json({ success: false, message: 'Forbidden: You do not own this job' });
        return;
      }

      await this.jobEngine.deleteJob(req.params.id as string);
      res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
