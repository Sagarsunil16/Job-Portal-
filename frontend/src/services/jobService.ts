import { api } from './api';
import { CreateJobPayload, JobDTO, PaginatedResponse } from '../domain/dtos/JobDTO';

// Named service functions — keeps page components free from raw HTTP calls
// Pattern mirrors authService.ts

export const createJob = (payload: CreateJobPayload) =>
  api.post<{ success: boolean; data: JobDTO }>('/jobs', payload);

export const getAllJobs = (page: number = 1, limit: number = 7, search: string = '') =>
  api.get<PaginatedResponse<JobDTO>>(`/jobs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const getMyJobs = (page: number = 1, limit: number = 7, search: string = '') =>
  api.get<PaginatedResponse<JobDTO>>(`/jobs/my-jobs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const getJobById = (id: string) =>
  api.get<{ success: boolean; data: JobDTO }>(`/jobs/${id}`);

export const updateJob = (id: string, payload: Partial<CreateJobPayload>) =>
  api.put<{ success: boolean; data: JobDTO }>(`/jobs/${id}`, payload);

export const deleteJob = (id: string) =>
  api.delete<{ success: boolean; message: string }>(`/jobs/${id}`);
