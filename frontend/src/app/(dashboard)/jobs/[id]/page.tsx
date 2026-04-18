'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Trash2, 
  Map, 
  Calendar, 
  Timer, 
  Layers, 
  Briefcase, 
  GraduationCap 
} from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '../../../../hooks';
import { getJobById, deleteJob } from '../../../../services/jobService';
import { JobDTO } from '../../../../domain/dtos/JobDTO';
import { DeleteJobModal } from '../../../../components/organisms/DeleteJobModal';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const { employerId } = useAppSelector((state) => state.employer);
  
  const [job, setJob] = useState<JobDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    const fetchJob = async () => {
      try {
        const res = await getJobById(jobId);
        if (res.data.success) {
          setJob(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load job details", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteJob(jobId);
      router.push('/my-jobs');
    } catch (err) {
      console.error("Failed to delete job", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Job Details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-xl w-full border border-gray-100">
        <p className="text-gray-600 mb-4">The exact job could not be found or was removed.</p>
        <button 
           onClick={() => router.push('/my-jobs')}
           className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
        >
          Return to My Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">Job Details</h1>
        {job.employerId === employerId && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex flex-col items-center justify-center p-2.5 text-red-400 bg-red-50/50 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent"
            >
              <Trash2 className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
            <Link href={`/jobs/${job.id}/edit`}>
              <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-md text-[14px] shadow-sm font-medium hover:bg-indigo-700 transition-colors">
                Edit Job
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Job Description */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <h2 className="text-[22px] font-semibold text-gray-900 tracking-tight">{job.title}</h2>
          
          {/* Pre-wrap will preserve formatting, newlines, and list bullets properly typed inside standard textarea */}
          <div className="text-[15px] leading-relaxed text-gray-600 space-y-4 whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        {/* Right Col: Cards */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          
          {/* Salary & Location Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex divide-x divide-gray-100 items-center justify-between w-full">
            
            <div className="flex flex-col items-center justify-center w-1/2 px-2 gap-1.5">
              <span className="text-[13px] text-gray-500 font-medium tracking-wide">Salary (USD)</span>
              <span className="text-[17px] font-bold text-[#0BA02C]">
                ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}
              </span>
              <span className="text-[12px] text-gray-400">{job.salaryType.toLowerCase()} salary</span>
            </div>

            <div className="flex flex-col items-center justify-center w-1/2 px-2 gap-1.5">
              <div className="mb-0.5">
                <Map className="w-5 h-5 text-indigo-400" strokeWidth={1.5} />
              </div>
              <span className="text-[13px] text-gray-500 font-medium tracking-wide">Job Location</span>
              <span className="text-[14px] font-semibold text-gray-900 text-center">
                {job.city}, {job.country}
              </span>
            </div>

          </div>

          {/* Job Overview Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-gray-900 mb-6 tracking-tight">Job Overview</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-7 gap-x-3">
              {/* Box 1 */}
              <div className="flex flex-col gap-2.5">
                <Calendar className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                <div>
                   <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Job Posted</p>
                   <p className="text-[13px] font-medium text-gray-900">
                     {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                   </p>
                </div>
              </div>

              {/* Box 2 */}
              <div className="flex flex-col gap-2.5">
                <Timer className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                <div>
                   <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Job Expires on</p>
                   <p className="text-[13px] font-medium text-gray-900">
                     {job.expirationDate ? new Date(job.expirationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Expiry'}
                   </p>
                </div>
              </div>

              {/* Box 3 */}
              <div className="flex flex-col gap-2.5">
                <Layers className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                <div>
                   <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Job Level</p>
                   <p className="text-[13px] font-medium text-gray-900">{job.jobLevel}</p>
                </div>
              </div>

              {/* Box 4 */}
              <div className="flex flex-col gap-2.5">
                <Briefcase className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                <div>
                   <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Experience</p>
                   <p className="text-[13px] font-medium text-gray-900">{job.experienceLevel}</p>
                </div>
              </div>

              {/* Box 5 */}
              <div className="flex flex-col gap-2.5">
                <GraduationCap className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                <div>
                   <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Education</p>
                   <p className="text-[13px] font-medium text-gray-900">{job.educationLevel}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal Overlay */}
      <DeleteJobModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

    </div>
  );
}
