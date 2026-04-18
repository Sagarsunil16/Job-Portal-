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
  currentEmployerId
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const ITEMS_PER_PAGE = 7;

  // We no longer slice or filter locally since the server handles it if controlled.
  // But if parent isn't passing onPageChange, we could optionally handle it locally.
  // Assuming strict server-side control for this task.
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
      // Hard reload perfectly cleans the state universally for both dashboard and my-jobs data tables
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete job", err);
    } finally {
      setIsDeleting(false);
      setJobToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        {title ? <h2 className="text-lg font-semibold text-gray-900">{title}</h2> : <div />}
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchQuery}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors text-gray-900 placeholder:text-gray-400 max-w-[200px] md:max-w-xs"
            />
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="w-full overflow-x-auto lg:overflow-visible">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#F8F9FA]">
              <tr className="border-b border-gray-100 text-sm text-gray-500 font-medium">
                <th className="px-6 py-4 font-medium rounded-tl-lg">Jobs</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Applications</th>
                <th className="px-6 py-4 font-medium text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mb-2" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 rounded animate-pulse w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : currentJobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                currentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors group relative">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <span>{job.type}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{job.remaining}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {job.status === 'Active' ? (
                        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-500 font-medium text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Expired</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span>{job.applications} Applications</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3 relative">
                        <Link href={`/dashboard/jobs/${job.id}${sourceUrlParam ? `?source=${sourceUrlParam}` : ''}`}>
                          <button className="px-4 py-2 bg-[#EBF1FF] text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors">
                            View Job
                          </button>
                        </Link>
                        
                        {(currentEmployerId && currentEmployerId === job.employerId) && (
                          <>
                            <button 
                              onClick={() => toggleDropdown(job.id)}
                              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {activeDropdown === job.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setActiveDropdown(null)} 
                                />
                                <div className="absolute right-0 top-12 z-50 w-40 bg-white border border-gray-100 shadow-lg rounded-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                                  <Link href={`/dashboard/jobs/${job.id}/edit`}>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                                      <Edit className="w-4 h-4 text-gray-400" />
                                      Edit Job
                                    </button>
                                  </Link>
                                  <button 
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      setJobToDelete(String(job.id));
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                    Delete Job
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-500 hidden sm:inline-block">
              Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { if (onPageChange) onPageChange(i + 1); }}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-500 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
