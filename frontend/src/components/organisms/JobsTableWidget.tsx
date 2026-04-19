'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { DeleteJobModal } from './DeleteJobModal';
import { deleteJob } from '../../services/jobService';

export interface JobData {
  id: string | number;
  title: string;
  type: string;
  remaining: string;
  status: string;
  applications: number;
  employerId?: string;
}

interface JobsTableWidgetProps {
  jobs: JobData[];
  title?: string;
  isLoading?: boolean;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  sourceUrlParam?: string;
  currentEmployerId?: string;
  viewAllHref?: string;
  showSearch?: boolean;
  showPagination?: boolean;
}

export const JobsTableWidget: React.FC<JobsTableWidgetProps> = ({ 
  jobs, 
  title, 
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  sourceUrlParam,
  currentEmployerId,
  viewAllHref,
  showSearch = true,
  showPagination = true
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const ITEMS_PER_PAGE = 7;
  const currentJobs = jobs;

  const handleNextPage = () => {
    if (currentPage < totalPages && onPageChange) onPageChange(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
  };

  const toggleDropdown = (id: string | number) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleTableDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      setIsDeleting(true);
      await deleteJob(jobToDelete);
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete job", err);
    } finally {
      setIsDeleting(false);
      setJobToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-[16px] w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full h-auto sm:h-[30px] gap-4 sm:gap-0">
        {title && (
          <h2 className="text-[20px] font-medium text-[#434348] font-poppins">{title}</h2>
        )}
        <div className="flex items-center gap-[12px] sm:gap-[24px] w-full sm:w-auto">
          {showSearch && (
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search jobs..." 
                value={searchQuery}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors text-gray-900 placeholder:text-gray-400 w-full sm:w-[240px]"
              />
            </div>
          )}
          {viewAllHref && (
            <Link href={viewAllHref} className="text-[16px] font-medium text-[#7E7E86] hover:text-[#5D5FEF] transition-colors font-poppins shrink-0">
              View all
            </Link>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="w-full overflow-x-auto lg:overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-[40px] bg-[#F2F2F3] rounded-[8px] flex items-center justify-between">
                <th className="px-[12px] text-[16px] font-medium text-[#7E7E86] font-poppins rounded-l-[8px] flex-grow basis-[458px] flex items-center h-full">Jobs</th>
                <th className="px-[12px] text-[16px] font-medium text-[#7E7E86] font-poppins basis-[200px] flex items-center h-full">Status</th>
                <th className="px-[12px] text-[16px] font-medium text-[#7E7E86] font-poppins basis-[242px] flex items-center h-full">Applications</th>
                <th className="px-[12px] text-[16px] font-medium text-[#7E7E86] font-poppins rounded-r-[8px] basis-[228px] flex items-center justify-start h-full">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="h-[80px] border-b border-[#F2F2F3] flex items-center justify-between">
                    <td className="px-[12px] flex-grow basis-[458px]">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-48 mb-2" />
                      <div className="h-3 bg-gray-50 rounded animate-pulse w-32" />
                    </td>
                    <td className="px-[12px] basis-[200px]"><div className="h-4 bg-gray-100 rounded animate-pulse w-16" /></td>
                    <td className="px-[12px] basis-[242px]"><div className="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
                    <td className="px-[12px] basis-[228px] flex items-center justify-start"><div className="h-10 bg-gray-100 rounded-full animate-pulse w-[146px]" /></td>
                  </tr>
                ))
              ) : currentJobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-[12px] py-8 text-center text-[#7E7E86] font-poppins">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                currentJobs.map((job) => (
                  <tr key={job.id} className="h-[80px] border-b border-[#F2F2F3] hover:bg-gray-50/50 transition-colors group relative flex items-center justify-between">
                    <td className="px-[12px] flex-grow basis-[458px] flex flex-col justify-center">
                      <p className="text-[16px] font-medium text-[#434348] font-poppins">{job.title}</p>
                      <div className="flex items-center gap-[8px] mt-1 text-[14px] text-[#7E7E86] font-poppins">
                        <span>{job.type}</span>
                        <div className="w-[4px] h-[4px] bg-[#7E7E86] rounded-full"></div>
                        <span>{job.remaining}</span>
                      </div>
                    </td>

                    <td className="px-[12px] basis-[200px] flex items-center">
                      {job.status === 'Active' ? (
                        <div className="flex items-center gap-[10px] text-[#34A853] font-medium text-[16px] font-poppins">
                          <CheckCircle2 className="w-[24px] h-[24px]" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-[10px] text-[#EB4335] font-medium text-[16px] font-poppins">
                          <AlertCircle className="w-[24px] h-[24px]" />
                          <span>Expired</span>
                        </div>
                      )}
                    </td>

                    <td className="px-[12px] basis-[242px] flex items-center">
                      <div className="flex items-center gap-[10px] text-[#434348] text-[16px] font-poppins">
                        <Users className="w-[24px] h-[24px] text-[#434348]" />
                        <span>{job.applications} Applications</span>
                      </div>
                    </td>

                    <td className="px-[12px] basis-[228px] flex items-center justify-start">
                      <div className="flex items-center gap-[10px] relative">
                        <Link href={`/jobs/${job.id}${sourceUrlParam ? `?source=${sourceUrlParam}` : ''}`}>
                          <button className="w-[146px] h-[48px] bg-[#E5E6FB] text-[#5D5FEF] rounded-full text-[18px] font-medium hover:bg-[#DEDFFB] transition-colors font-poppins flex items-center justify-center">
                            View Job
                          </button>
                        </Link>
                        
                        {(currentEmployerId && currentEmployerId === job.employerId) ? (
                          <div className="relative">
                            <button 
                              onClick={() => toggleDropdown(job.id)}
                              className="w-[48px] h-[48px] flex items-center justify-center text-[#434348] hover:bg-gray-100 rounded-[10px] transition-colors focus:outline-none"
                            >
                              <MoreVertical className="w-[24px] h-[24px]" />
                            </button>

                            {activeDropdown === job.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setActiveDropdown(null)} 
                                />
                                <div className="absolute right-0 top-[52px] z-50 w-[204px] bg-white shadow-[0px_0px_12px_rgba(0,0,0,0.14)] rounded-[12px] p-[6px] flex flex-col gap-[4px] animate-in fade-in zoom-in-95 duration-100">
                                  <Link href={`/jobs/${job.id}/edit`}>
                                    <button className="w-full h-[48px] flex items-center gap-[10px] px-[16px] text-[18px] font-medium text-[#434348] hover:bg-gray-50 rounded-[10px] transition-colors font-poppins">
                                      <Edit className="w-[24px] h-[24px] text-[#434348]" />
                                      Edit Job
                                    </button>
                                  </Link>
                                  <button 
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      setJobToDelete(String(job.id));
                                    }}
                                    className="w-full h-[48px] flex items-center gap-[10px] px-[16px] text-[18px] font-medium text-[#EB4335] hover:bg-red-50 rounded-[12px] transition-colors font-poppins"
                                  >
                                    <Trash2 className="w-[24px] h-[24px] text-[#EB4335]" />
                                    Delete Job
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="w-[48px] h-[48px]" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {(showPagination && totalPages > 1) && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-500 font-poppins">
              Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { if (onPageChange) onPageChange(i + 1); }}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors font-poppins ${
                      currentPage === i + 1 
                        ? 'bg-[#5D5FEF] text-white' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteJobModal 
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleTableDeleteJob}
        isDeleting={isDeleting}
      />
    </div>
  );
};
