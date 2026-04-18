'use client';

import React, { useState, useEffect } from 'react';
import { JobsTableWidget, JobData } from '../../../components/organisms/JobsTableWidget';
import { getMyJobs } from '../../../services/jobService';
import { JobDTO } from '../../../domain/dtos/JobDTO';
import { useAppSelector } from '../../../hooks';

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
  applications: 0,
  employerId: j.employerId,
});

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { employerId } = useAppSelector((state) => state.employer);

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
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setIsLoading(true);
        const response = await getMyJobs(page, 7, debouncedSearch);
        setJobs(response.data.data.map(mapToJobData));
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } catch (error) {
        console.error('Failed to fetch my jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyJobs();
  }, [page, debouncedSearch]);

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <h1 className="text-[28px] font-semibold text-gray-900">My Jobs</h1>
      <JobsTableWidget 
        jobs={jobs} 
        isLoading={isLoading} 
        searchQuery={search}
        onSearchChange={setSearch}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        currentEmployerId={employerId || undefined}
      />
    </div>
  );
}
