'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks';
import { 
  Briefcase, 
  Users
} from 'lucide-react';
import { JobsTableWidget, JobData } from '../../components/organisms/JobsTableWidget';
import { getAllJobs } from '../../services/jobService';
import { JobDTO } from '../../domain/dtos/JobDTO';

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
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold text-gray-900">Hello, {companyName}</h1>
        <p className="text-gray-500 text-[15px]">Here is your daily activity and applications</p>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-6 w-full flex-wrap">
        <div className="bg-[#EBF1FF] rounded-xl p-6 flex items-center justify-between min-w-[280px]">
          <div>
            <p className="text-2xl font-semibold text-gray-900">10</p>
            <p className="text-gray-600 text-sm mt-1">Open Jobs</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center text-indigo-600 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#FFF4E5] rounded-xl p-6 flex items-center justify-between min-w-[280px]">
          <div>
            <p className="text-2xl font-semibold text-gray-900">200</p>
            <p className="text-gray-600 text-sm mt-1">Saved Candidates</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center text-orange-500 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

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
      />
    </div>
  );
}
