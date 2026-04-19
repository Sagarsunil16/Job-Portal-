'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../hooks';
import { 
  Briefcase, 
  Users
} from 'lucide-react';
import { JobsTableWidget, JobData } from '../../../components/organisms/JobsTableWidget';
import { getAllJobs } from '../../../services/jobService';
import { JobDTO } from '../../../domain/dtos/JobDTO';

// Helper: map API JobDTO to the shape JobsTableWidget expects
const mapToJobData = (j: JobDTO): JobData => ({
  id: j.id,
  title: j.title,
  type: j.type,
  remaining: j.expirationDate
    ? `Expires ${new Date(j.expirationDate).toLocaleDateString('en-GB')}`
    : 'No expiry',
  status: j.expirationDate 
    ? (new Date(j.expirationDate) > new Date() ? 'Active' : 'Expired')
    : 'Active',
  applications: 0, // applications count will be wired when that feature is built
  employerId: j.employerId,
});

export default function DashboardPage() {
  const { pendingRegistrationData, employerId } = useAppSelector((state) => state.employer);
  const companyName = (pendingRegistrationData as any)?.companyName || 'there';

  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination and Search State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Debouncing effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await getAllJobs(page, 7, debouncedSearch);
        setJobs(response.data.data.map(mapToJobData));
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [page, debouncedSearch]);
  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-[24px] font-medium text-[#434348] font-poppins leading-[36px]">Hello, {companyName}</h1>
        <p className="text-[#7E7E86] text-[16px] font-normal font-poppins leading-[24px] mt-[2px]">Here is your daily activity and applications</p>
      </div>

      {/* Summary Cards (Quick Info) */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-[24px] w-full flex-wrap">
        {/* Open Jobs Card */}
        <div className="w-full sm:w-[312px] h-auto sm:h-[102px] bg-[#E5E6FB] rounded-[12px] p-[20px] flex items-start gap-[10px]">
          <div className="flex-1 flex flex-col">
            <p className="text-[24px] font-medium text-[#434348] font-poppins leading-[36px]">10</p>
            <p className="text-[#434348] text-[16px] font-normal font-poppins leading-[24px]">Open Jobs</p>
          </div>
          <div className="w-[60px] h-[60px] bg-white rounded-[6px] flex items-center justify-center shadow-sm shrink-0">
            <Briefcase className="w-[32px] h-[32px] text-[#141B34]" />
          </div>
        </div>

        {/* Saved Candidates Card */}
        <div className="w-full sm:w-[312px] h-auto sm:h-[102px] bg-[#FCF3E4] rounded-[12px] p-[20px] flex items-start gap-[10px]">
          <div className="flex-1 flex flex-col">
            <p className="text-[24px] font-medium text-[#434348] font-poppins leading-[36px]">200</p>
            <p className="text-[#434348] text-[16px] font-normal font-poppins leading-[24px]">Saved Candidates</p>
          </div>
          <div className="w-[60px] h-[60px] bg-white rounded-[6px] flex items-center justify-center shadow-sm shrink-0">
            <Users className="w-[32px] h-[32px] text-[#141B34]" />
          </div>
        </div>
      </div>

      <div className="w-full">
        <JobsTableWidget 
          jobs={jobs} 
          title="Recently Posted Jobs" 
          isLoading={isLoading}
          searchQuery={search}
          onSearchChange={setSearch}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
          sourceUrlParam="overview"
          currentEmployerId={employerId || undefined}
          showSearch={true}
          showPagination={true}
        />
      </div>
    </div>
  );
}
