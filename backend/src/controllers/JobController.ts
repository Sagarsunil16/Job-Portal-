import { Request, Response, NextFunction } from 'express';
import { IJobManagementUseCase } from '../useCases/jobUseCase/IJobManagementUseCase';
import { IAuthMiddleware } from '../infrastructure/middleware/Auth/AuthMiddleware';
import { ApiError } from '../domain/errors/ApiError';
import { ErrorCode } from '../domain/enums/ErrorCode';

export class JobController {
  private jobUseCase: IJobManagementUseCase;
  private auth: IAuthMiddleware;

  constructor({ 
    JobUseCase, 
    AuthMiddleware 
  }: { 
    JobUseCase: IJobManagementUseCase;
    AuthMiddleware: IAuthMiddleware;
  }) {
    this.jobUseCase = JobUseCase;
    this.auth = AuthMiddleware;
  }

  createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    (await this.auth.verify())(req, res, async () => {
      try {
        const employerId = req.user?.employerId;
        if (!employerId) {
          throw new ApiError('Unauthorized', ErrorCode.Unauthorized);
        }

        const job = await this.jobUseCase.createJob({ ...req.body, employerId });
        res.status(201).json({ success: true, data: job });
      } catch (error) {
        next(error);
      }
    });
  };

  getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    } catch (error) {
      next(error);
    }
  };

  getMyJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    (await this.auth.verify())(req, res, async () => {
      try {
        const employerId = req.user?.employerId;
        if (!employerId) {
          throw new ApiError('Unauthorized', ErrorCode.Unauthorized);
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
      } catch (error) {
        next(error);
      }
    });
  };

  getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = await this.jobUseCase.getJobById(req.params.id as string);
      if (!job) {
        throw new ApiError('Job not found', ErrorCode.NotFound);
      }
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    (await this.auth.verify())(req, res, async () => {
      try {
        const employerId = req.user?.employerId;
        if (!employerId) {
          throw new ApiError('Unauthorized', ErrorCode.Unauthorized);
        }

        const updatedJob = await this.jobUseCase.updateJob(req.params.id as string, req.body, employerId);
        res.status(200).json({ success: true, data: updatedJob });
      } catch (error) {
        next(error);
      }
    });
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    (await this.auth.verify())(req, res, async () => {
      try {
        const employerId = req.user?.employerId;
        if (!employerId) {
          throw new ApiError('Unauthorized', ErrorCode.Unauthorized);
        }

        await this.jobUseCase.deleteJob(req.params.id as string, employerId);
        res.status(200).json({ success: true, message: 'Job deleted successfully' });
      } catch (error) {
        next(error);
      }
    });
  };
}
