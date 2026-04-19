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
          <p className="text-gray-500 font-medium font-poppins">Loading Job Details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-xl w-full border border-gray-100">
        <p className="text-gray-600 mb-4 font-poppins">The exact job could not be found or was removed.</p>
        <button 
           onClick={() => router.push('/my-jobs')}
           className="px-6 py-2 bg-[#5D5FEF] text-white rounded-md text-sm hover:bg-[#5D5FEF]/90 transition font-poppins"
        >
          Return to My Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white min-h-full gap-[32px] animate-in fade-in pt-0 pb-12">
      {/* Header & CTA Section */}
      <div className="flex flex-row justify-between items-center w-full h-[48px] px-4 md:px-8">
        <div className="flex flex-col">
          <h1 className="text-[24px] font-medium text-[#434348] font-poppins leading-[36px]">Job Details</h1>
        </div>
        
        {job.employerId === employerId && (
          <div className="flex items-center gap-[8px]">
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center w-[48px] h-[48px] text-[#EB4335] hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-[24px] h-[24px]" strokeWidth={1.5} />
            </button>
            <Link href={`/jobs/${job.id}/edit`}>
              <button className="flex items-center justify-center h-[48px] px-[32px] bg-[#5D5FEF] text-white rounded-[32px] text-[18px] font-medium hover:bg-[#5D5FEF]/90 transition-colors font-poppins">
                Edit Job
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Main Content Split Layout */}
      <div className="flex flex-col lg:flex-row gap-[40px] w-full px-4 md:px-8">
        
        {/* Left Column (Job Description) - Flexible growth */}
        <div className="lg:flex-[0.65] flex flex-col gap-[16px] w-full">
          <h2 className="text-[24px] font-medium text-[#434348] font-poppins leading-[36px]">{job.title}</h2>
          
          <div className="text-[16px] leading-[24px] text-[#434348] font-normal font-poppins whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        {/* Right Column (Overview Cards) - Flexible growth */}
        <div className="lg:flex-[0.35] flex flex-col gap-[16px] w-full">
          
          {/* Card 1: Salary & Location */}
          <div className="flex flex-row items-center border border-[#E5E5E6] rounded-[16px] p-[24px] w-full gap-[12px]">
            {/* Salary Section */}
            <div className="flex-1 flex flex-col items-center justify-center gap-[8px]">
              <span className="text-[14px] font-normal text-[#7E7E86] font-poppins">Salary (USD)</span>
              <div className="flex flex-col items-center gap-[3px]">
                <span className="text-[20px] font-medium text-[#34A853] font-poppins leading-[30px]">
                  ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}
                </span>
                <span className="text-[14px] font-normal text-[#7E7E86] font-poppins leading-[21px]">
                  {job.salaryType} salary
                </span>
              </div>
            </div>

            {/* Vertical Split Line */}
            <div className="w-[1px] h-[64px] bg-[#E5E5E6]"></div>

            {/* Location Section */}
            <div className="flex-1 flex flex-col items-center justify-center gap-[8px]">
              <Map className="w-[24px] h-[24px] text-[#5D5FEF]" strokeWidth={1.5} />
              <div className="flex flex-col items-center gap-[3px]">
                <span className="text-[14px] font-normal text-[#7E7E86] font-poppins">Job Location</span>
                <span className="text-[16px] font-medium text-[#434348] font-poppins leading-[24px] text-center">
                  {job.city}, {job.country}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Job Overview */}
          <div className="flex flex-col border border-[#E5E5E6] rounded-[16px] p-[24px] gap-[16px] w-full">
            <h3 className="text-[20px] font-medium text-[#434348] font-poppins leading-[30px]">Job Overview</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[24px_12px] w-full">
              {/* Job Posted */}
              <div className="flex flex-col items-start gap-[8px]">
                <Calendar className="w-[24px] h-[24px] text-[#5D5FEF]" strokeWidth={1.5} />
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[14px] font-normal text-[#7E7E86] font-poppins">Job Posted</p>
                  <p className="text-[16px] font-medium text-[#434348] font-poppins">
                    {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Job Expires */}
              <div className="flex flex-col items-start gap-[8px]">
                <Timer className="w-[24px] h-[24px] text-[#5D5FEF]" strokeWidth={1.5} />
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[14px] font-normal text-[#7E7E86] font-poppins">Job Expires on</p>
                  <p className="text-[16px] font-medium text-[#434348] font-poppins">
                    {job.expirationDate ? new Date(job.expirationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Expiry'}
                  </p>
                </div>
              </div>

              {/* Job Level */}
              <div className="flex flex-col items-start gap-[8px]">
                <Layers className="w-[24px] h-[24px] text-[#5D5FEF]" strokeWidth={1.5} />
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[14px] font-normal text-[#7E7E86] font-poppins">Job Level</p>
                  <p className="text-[16px] font-medium text-[#434348] font-poppins">{job.jobLevel}</p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex flex-col items-start gap-[8px]">
                <Briefcase className="w-[24px] h-[24px] text-[#5D5FEF]" strokeWidth={1.5} />
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[14px] font-normal text-[#7E7E86] font-poppins">Experience</p>
                  <p className="text-[16px] font-medium text-[#434348] font-poppins">{job.experienceLevel}</p>
                </div>
              </div>

              {/* Education */}
              <div className="flex flex-col items-start gap-[8px]">
                <GraduationCap className="w-[24px] h-[24px] text-[#5D5FEF]" strokeWidth={1.5} />
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[14px] font-normal text-[#7E7E86] font-poppins">Education</p>
                  <p className="text-[16px] font-medium text-[#434348] font-poppins">{job.educationLevel}</p>
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
