import { Request, Response } from 'express';
export declare class JobController {
    private jobEngine;
    constructor();
    createJob: (req: Request, res: Response) => Promise<void>;
    getJobs: (req: Request, res: Response) => Promise<void>;
    getJobById: (req: Request, res: Response) => Promise<void>;
    updateJob: (req: Request, res: Response) => Promise<void>;
    deleteJob: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=JobController.d.ts.map