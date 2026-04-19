import { Request, Response } from 'express';
import { JobManagementUseCase } from '../useCases/jobUseCase/JobManagementUseCase';

export class JobController {
  private jobUseCase: JobManagementUseCase;

  constructor({ JobUseCase }: { JobUseCase: JobManagementUseCase }) {
    this.jobUseCase = JobUseCase;
  }

  createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const employerId = req.user?.employerId;
      if (!employerId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // The use case handles companyName lookup and job creation
      const job = await this.jobUseCase.createJob({ ...req.body, employerId });
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

      const result = await this.jobUseCase.getAllJobs({}, page, limit, search);

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

      const result = await this.jobUseCase.getJobsByEmployer(employerId, page, limit, search);

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
      const job = await this.jobUseCase.getJobById(req.params.id as string);
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

      const updatedJob = await this.jobUseCase.updateJob(req.params.id as string, req.body, employerId);
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

      await this.jobUseCase.deleteJob(req.params.id as string, employerId);
      res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
