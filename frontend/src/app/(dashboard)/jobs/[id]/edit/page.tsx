'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { jobValidationSchema } from '../../../post-job/schema';
import { getJobById, updateJob } from '../../../../../services/jobService';

// Reusable micro-components with FIGMA spec: Poppins, #7E7E86 labels, #111111 inputs, 12px radius, 48px height
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-[16px] font-normal text-[#7E7E86] font-poppins leading-[24px] mb-[4px]">
    {children}
  </label>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[20px] font-medium text-[#434348] font-poppins leading-[30px] mt-[16px] mb-[16px]">
    {children}
  </h2>
);

const Input = React.forwardRef<HTMLInputElement, any>(({ placeholder, error, type = "text", ...props }, ref) => (
  <div className="flex flex-col w-full gap-[4px]">
    <input 
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`w-full h-[48px] px-[16px] border rounded-[12px] text-[16px] text-[#111111] font-poppins placeholder:text-[#7E7E86]/50 outline-none transition-all duration-200 bg-white
        ${error 
          ? 'border-[#EE1D52] focus:border-[#EE1D52] bg-red-50/10' 
          : 'border-[#7E7E86]/30 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF]/20'
        }`}
      {...props}
    />
    {error && <span className="text-[14px] font-normal text-[#EE1D52] font-poppins leading-[21px]">{error}</span>}
  </div>
));
Input.displayName = 'Input';

const Select = React.forwardRef<HTMLSelectElement, any>(({ placeholder = "Select", options = [], error, ...props }, ref) => (
  <div className="flex flex-col w-full gap-[4px]">
    <div className="relative w-full">
      <select 
        ref={ref}
        {...props}
        className={`w-full h-[48px] pl-[16px] pr-[40px] border rounded-[12px] text-[16px] font-poppins outline-none appearance-none transition-all duration-200 bg-white
          ${error 
            ? 'border-[#EE1D52] focus:border-[#EE1D52] bg-red-50/10' 
            : 'border-[#7E7E86]/30 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF]/20'
          } ${props.value === "" ? 'text-[#7E7E86]/50' : 'text-[#434348]'}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt: string, i: number) => (
          <option key={i} value={opt} className="text-[#434348] py-2">{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#434348] pointer-events-none" />
    </div>
    {error && <span className="text-[14px] font-normal text-[#EE1D52] font-poppins leading-[21px]">{error}</span>}
  </div>
));
Select.displayName = 'Select';

const InputWithAddon = React.forwardRef<HTMLInputElement, any>(({ placeholder, addon, error, ...props }, ref) => (
  <div className="flex flex-col w-full gap-[4px]">
    <div className={`flex w-full h-[48px] border rounded-[12px] bg-white overflow-hidden transition-all duration-200 
      ${error 
        ? 'border-[#EE1D52] focus-within:border-[#EE1D52] bg-red-50/10' 
        : 'border-[#7E7E86]/30 focus-within:border-[#5D5FEF] focus-within:ring-1 focus-within:ring-[#5D5FEF]/20'
      }`}>
      <input 
        ref={ref}
        type="number"
        placeholder={placeholder}
        className="flex-1 px-[16px] text-[16px] text-[#111111] font-poppins placeholder:text-[#7E7E86]/50 outline-none h-full bg-transparent"
        {...props}
      />
      <div className="flex items-center justify-center bg-[#F2F2F3] border-l border-[#7E7E86]/30 px-[16px] text-[16px] text-[#7E7E86] font-normal font-poppins h-full">
        {addon}
      </div>
    </div>
    {error && <span className="text-[14px] font-normal text-[#EE1D52] font-poppins leading-[21px]">{error}</span>}
  </div>
));
InputWithAddon.displayName = 'InputWithAddon';

const COUNTRY_CITY_MAP: Record<string, string[]> = {
  "United States": ["New York", "San Francisco", "Austin", "Seattle", "Chicago"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary"],
  "India": ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth"],
  "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg"],
};

export default function EditJobPage() {
  const JOB_ROLES = ["UI/UX Designer", "Frontend Developer", "Backend Developer", "Fullstack Engineer", "Product Manager", "Data Scientist", "DevOps Engineer"];
  const SALARY_TYPES = ["Yearly", "Monthly", "Weekly", "Hourly"];
  const EDUCATION_LEVELS = ["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "Doctorate"];
  const EXPERIENCE_LEVELS = ["Freshers / Entry Level", "1 - 2 Years", "3 - 5 Years", "6 - 10 Years", "10+ Years"];
  const JOB_TYPES = ["Full time", "Part time", "Contract", "Internship", "Freelance"];
  const JOB_LEVELS = ["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"];
  const COUNTRIES = Object.keys(COUNTRY_CITY_MAP);

  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(jobValidationSchema),
  });

  const selectedCountry = watch("country");
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Dependant Dropdown logic: Update cities when country changes
  useEffect(() => {
    if (selectedCountry && COUNTRY_CITY_MAP[selectedCountry]) {
      setAvailableCities(COUNTRY_CITY_MAP[selectedCountry]);
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  // Fetch initial data
  useEffect(() => {
    if (!jobId) return;

    const fetchInitialData = async () => {
      try {
        setIsLoadingInitial(true);
        const res = await getJobById(jobId);
        
        if (res.data.success) {
          const job = res.data.data;
          
          let parsedDate = "";
          if (job.expirationDate) {
            parsedDate = new Date(job.expirationDate).toISOString().split('T')[0];
          }

          reset({
            title: job.title || "",
            tags: job.tags ? job.tags.join(', ') : "",
            role: job.role || "",
            minSalary: job.minSalary || "" as any,
            maxSalary: job.maxSalary || "" as any,
            salaryType: job.salaryType || "",
            educationLevel: job.educationLevel || "",
            experienceLevel: job.experienceLevel || "",
            type: job.type || "",
            jobLevel: job.jobLevel || "",
            expirationDate: parsedDate,
            country: job.country || "",
            city: job.city || "",
            fullyRemote: job.fullyRemote || false,
            description: job.description || ""
          } as any);

          if (job.country && COUNTRY_CITY_MAP[job.country]) {
             setAvailableCities(COUNTRY_CITY_MAP[job.country]);
          }
        }
      } catch (err) {
        console.error("Failed to load job details for editing", err);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchInitialData();
  }, [jobId, reset]);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Submit through put request to specifically update the job
      await updateJob(jobId, data);
      
      // Show confirmation modal
      setShowSuccessModal(true);
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to update job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[60vh]">
         <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
           <p className="text-gray-500 font-medium">Loading form data...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white min-h-full gap-[32px] pt-0 pb-12 animate-in fade-in">
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[32px] w-full px-4 md:px-8">
        
        {/* Header Section: Title on left, Action Buttons on right */}
        <div className="flex flex-row justify-between items-center w-full h-[48px]">
          <div className="flex flex-col">
            <h1 className="text-[24px] font-medium text-[#434348] font-poppins leading-[36px]">Edit Job Details</h1>
          </div>
          
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={() => router.push(`/jobs/${jobId}`)}
              className="flex items-center justify-center h-[48px] px-[32px] bg-white text-[#434348] border border-[#7E7E86]/30 rounded-[32px] text-[18px] font-medium hover:bg-gray-50 transition-colors font-poppins"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex items-center justify-center h-[48px] px-[32px] bg-[#5D5FEF] text-white rounded-[32px] text-[18px] font-medium hover:bg-[#5D5FEF]/90 transition-colors disabled:opacity-75 disabled:cursor-wait font-poppins shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Global Error Banner if API fails */}
        {submitError && (
          <div className="text-[14px] text-[#EE1D52] bg-[#EE1D52]/5 border border-[#EE1D52]/20 rounded-[12px] px-4 py-3 font-poppins animate-in slide-in-from-top-2">
            {submitError}
          </div>
        )}

        {/* Section 1: Basic Info - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <div>
            <Label>Job Tiles</Label>
            <Input {...register("title")} placeholder="e.g. Senior UX Designer" error={errors.title?.message} />
          </div>
          <div>
            <Label>Tags</Label>
            <Input {...register("tags")} placeholder="e.g. Design, Figma (comma separated)" error={errors.tags?.message} />
          </div>
          <div>
            <Label>Job Role</Label>
            <Select {...register("role")} options={JOB_ROLES} error={errors.role?.message} />
          </div>
        </div>

        {/* Section 2: Salary - 3 Columns */}
        <div className="flex flex-col gap-[16px]">
          <SectionTitle>Salary</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            <div>
              <Label>Min Salary</Label>
              <InputWithAddon {...register("minSalary")} addon="USD" placeholder="e.g. 50000" error={errors.minSalary?.message} />
            </div>
            <div>
              <Label>Max Salary</Label>
              <InputWithAddon {...register("maxSalary")} addon="USD" placeholder="e.g. 80000" error={errors.maxSalary?.message} />
            </div>
            <div>
              <Label>Salary Type</Label>
              <Select {...register("salaryType")} options={SALARY_TYPES} error={errors.salaryType?.message} />
            </div>
          </div>
        </div>

        {/* Section 3: Advance Information - Multi-row Grid */}
        <div className="flex flex-col gap-[16px]">
          <SectionTitle>Advance Information</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            <div>
              <Label>Education Level</Label>
              <Select {...register("educationLevel")} options={EDUCATION_LEVELS} error={errors.educationLevel?.message} />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Select {...register("experienceLevel")} options={EXPERIENCE_LEVELS} error={errors.experienceLevel?.message} />
            </div>
            <div>
              <Label>Job Type</Label>
              <Select {...register("type")} options={JOB_TYPES} error={errors.type?.message} />
            </div>
            <div>
              <Label>Job Level</Label>
              <Select {...register("jobLevel")} options={JOB_LEVELS} error={errors.jobLevel?.message} />
            </div>
            <div>
              <Label>Expiration Date</Label>
              <Input {...register("expirationDate")} type="date" error={errors.expirationDate?.message} />
            </div>
          </div>
        </div>

        {/* Section 4: Location */}
        <div className="flex flex-col gap-[16px]">
          <SectionTitle>Location</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div>
              <Label>Country</Label>
              <Select {...register("country")} options={COUNTRIES} error={errors.country?.message} />
            </div>
            <div>
              <Label>City</Label>
              <Select {...register("city")} options={availableCities} placeholder={selectedCountry ? "Select City" : "Select Country first"} error={errors.city?.message} disabled={!selectedCountry} />
            </div>
          </div>
          
          <div className="flex items-center gap-[12px] mt-[8px]">
            <input 
              type="checkbox" 
              id="remote" 
              {...register("fullyRemote")}
              className="w-[20px] h-[20px] rounded-[6px] border-[#7E7E86]/30 text-[#5D5FEF] focus:ring-[#5D5FEF] cursor-pointer accent-[#5D5FEF]"
            />
            <label htmlFor="remote" className="text-[16px] text-[#434348] font-normal font-poppins cursor-pointer">Fully remote position</label>
          </div>
        </div>

        {/* Section 5: Job Descriptions */}
        <div className="flex flex-col gap-[16px]">
          <SectionTitle>Job Descriptions</SectionTitle>
          <div className="w-full">
            <textarea 
              {...register("description")}
              placeholder="Add job description"
              className={`w-full h-[300px] p-[24px] border rounded-[12px] text-[16px] leading-[24px] text-[#434348] font-normal font-poppins placeholder:text-[#7E7E86]/50 outline-none resize-none transition-all duration-200
                ${errors.description 
                  ? 'border-[#EE1D52] focus:border-[#EE1D52] bg-red-50/10' 
                  : 'border-[#7E7E86]/30 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF]/20'
                }`}
            />
            {errors.description && <span className="text-[14px] font-normal text-[#EE1D52] font-poppins leading-[21px] mt-[4px] block">{errors.description.message}</span>}
          </div>
        </div>

      </form>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center max-w-sm w-[90%] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-[20px] font-bold text-gray-900 mb-2">Successfully Updated!</h3>
            <p className="text-[14px] leading-relaxed text-gray-500 text-center mb-8">
              Your job details have been saved and successfully pushed live to the platform.
            </p>
            <button
              onClick={() => router.push(`/jobs/${jobId}`)}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg text-[15px] font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Continue to Job View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
