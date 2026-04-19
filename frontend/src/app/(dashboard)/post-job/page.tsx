'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/atoms/Button';
import { jobValidationSchema } from './schema';
import { createJob } from '../../../services/jobService';
import { useAppSelector } from '../../../hooks';

// Reusable micro-components for the form mapped for React Hook Form safely
const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <label className={`block text-[16px] font-normal text-[#7E7E86] mb-[4px] font-poppins ${className}`}>{children}</label>
);

const SectionTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <h2 className={`text-[20px] font-medium text-[#434348] mb-[16px] font-poppins ${className}`}>{children}</h2>
);

const Input = React.forwardRef<HTMLInputElement, any>(({ placeholder, error, type = "text", ...props }, ref) => (
  <div className="w-full flex flex-col">
    <input 
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`w-full h-[48px] px-[12px] py-[12px] border rounded-[12px] text-[16px] text-[#111111] placeholder:text-[#7E7E86] outline-none transition-colors font-poppins ${error ? 'border-red-500 focus:border-red-500' : 'border-[#7E7E86]/35 focus:border-[#5D5FEF]'}`}
      {...props}
    />
    {error && <span className="text-[14px] text-red-500 mt-1 block font-poppins">{error}</span>}
  </div>
));
Input.displayName = 'Input';

const Select = React.forwardRef<HTMLSelectElement, any>(({ placeholder = "Select", options = [], error, ...props }, ref) => (
  <div className="w-full flex flex-col">
    <div className="relative w-full">
      <select 
        ref={ref}
        {...props}
        className={`w-full h-[48px] pl-[12px] pr-[40px] py-[12px] border rounded-[12px] text-[16px] outline-none appearance-none transition-colors bg-white font-poppins ${error ? 'border-red-500 focus:border-red-500' : 'border-[#7E7E86]/35 focus:border-[#5D5FEF]'} text-[#111111]`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt: string, i: number) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] text-[#434348] pointer-events-none" />
    </div>
    {error && <span className="text-[14px] text-red-500 mt-1 block font-poppins">{error}</span>}
  </div>
));
Select.displayName = 'Select';

const InputWithAddon = React.forwardRef<HTMLInputElement, any>(({ placeholder, addon, error, ...props }, ref) => (
  <div className="w-full flex flex-col">
    <div className={`flex w-full h-[48px] border rounded-[12px] overflow-hidden transition-colors ${error ? 'border-red-500 focus-within:border-red-500' : 'border-[#7E7E86]/35 focus-within:border-[#5D5FEF]'}`}>
      <input 
        ref={ref}
        type="number"
        placeholder={placeholder}
        className="flex-1 px-[12px] py-[12px] text-[16px] text-[#111111] placeholder:text-[#7E7E86] outline-none font-poppins h-full"
        {...props}
      />
      <div className="flex items-center justify-center bg-[#F2F2F3] border-l border-[#7E7E86]/35 px-[16px] text-[16px] text-[#7E7E86] font-normal font-poppins">
        {addon}
      </div>
    </div>
    {error && <span className="text-[14px] text-red-500 mt-1 block font-poppins">{error}</span>}
  </div>
));
InputWithAddon.displayName = 'InputWithAddon';

// External Dictionary simulating API geography payload
const COUNTRY_CITY_MAP: Record<string, string[]> = {
  "United States": ["New York", "San Francisco", "Austin", "Seattle", "Chicago"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary"],
  "India": ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth"],
  "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg"],
};

export default function PostJobPage() {
  const JOB_ROLES = ["UI/UX Designer", "Frontend Developer", "Backend Developer", "Fullstack Engineer", "Product Manager", "Data Scientist", "DevOps Engineer"];
  const SALARY_TYPES = ["Yearly", "Monthly", "Weekly", "Hourly"];
  const EDUCATION_LEVELS = ["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "Doctorate"];
  const EXPERIENCE_LEVELS = ["Freshers / Entry Level", "1 - 2 Years", "3 - 5 Years", "6 - 10 Years", "10+ Years"];
  const JOB_TYPES = ["Full time", "Part time", "Contract", "Internship", "Freelance"];
  const JOB_LEVELS = ["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"];
  const COUNTRIES = Object.keys(COUNTRY_CITY_MAP);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(jobValidationSchema),
    defaultValues: {
      fullyRemote: false,
      country: "",
      city: "",
      salaryType: "",
      role: "",
      educationLevel: "",
      experienceLevel: "",
      type: "",
      jobLevel: "",
      expirationDate: "" as any
    }
  });

  const selectedCountry = watch("country");
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Dependant Dropdown logic: Reset city when country changes
  useEffect(() => {
    if (selectedCountry && COUNTRY_CITY_MAP[selectedCountry]) {
      setAvailableCities(COUNTRY_CITY_MAP[selectedCountry]);
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await createJob(data);
      router.push('/my-jobs');
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-full gap-[32px] pt-0 pb-12 animate-in fade-in">
      <div className="flex flex-col px-4 md:px-8">
        <h1 className="text-[24px] font-medium text-[#434348] font-poppins leading-[36px]">Post a job</h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[32px] w-full px-4 md:px-8 animate-in fade-in">
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <div>
            <Label>Job Titles</Label>
            <Input {...register("title")} placeholder="e.g. Senior UX Designer" error={errors.title?.message} />
          </div>
          <div>
            <Label>Tags</Label>
            <Input {...register("tags")} placeholder="e.g. Design, Figma" error={errors.tags?.message} />
          </div>
          <div>
            <Label>Job Role</Label>
            <Select {...register("role")} options={JOB_ROLES} error={errors.role?.message} />
          </div>
        </div>

        {/* Section: Salary */}
        <div className="flex flex-col">
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

        {/* Section: Advance Information */}
        <div className="flex flex-col basis-full">
          <SectionTitle>Advance Information</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[16px]">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            <div>
              <Label>Job Level</Label>
              <Select {...register("jobLevel")} options={JOB_LEVELS} error={errors.jobLevel?.message} />
            </div>
            <div>
              <Label>Expiration Date</Label>
              <Input 
                {...register("expirationDate")} 
                type="date" 
                error={errors.expirationDate?.message} 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Section: Location */}
        <div className="flex flex-col">
          <SectionTitle>Location</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[16px]">
            <div>
              <Label>Country</Label>
              <Select {...register("country")} options={COUNTRIES} error={errors.country?.message} />
            </div>
            <div>
              <Label>City</Label>
              <Select {...register("city")} options={availableCities} placeholder={selectedCountry ? "Select City" : "Select Country first"} error={errors.city?.message} disabled={!selectedCountry} />
            </div>
          </div>
          
          {/* Checkbox */}
          <div className="flex items-center gap-[8px]">
            <input 
              type="checkbox" 
              id="fullyRemote" 
              {...register("fullyRemote")}
              className="w-[18px] h-[18px] rounded border-[#7E7E86]/35 text-[#5D5FEF] focus:ring-[#5D5FEF]"
            />
            <label htmlFor="fullyRemote" className="text-[16px] text-[#434348] font-normal font-poppins">Fully remote position</label>
          </div>
        </div>

        {/* Section: Job Descriptions */}
        <div className="flex flex-col">
          <SectionTitle>Job Descriptions</SectionTitle>
          <div className="w-full">
            <textarea 
              {...register("description")}
              placeholder="Add job description"
              className={`w-full h-[200px] p-[16px] border rounded-[12px] text-[16px] text-[#111111] placeholder:text-[#7E7E86] outline-none resize-none transition-colors font-poppins ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-[#7E7E86]/35 focus:border-[#5D5FEF]'}`}
            />
            {errors.description && <span className="text-[14px] text-red-500 mt-1 block font-poppins">{errors.description.message}</span>}
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-4">
          {submitError && (
            <div className="text-[14px] text-red-600 bg-red-50 border border-red-200 rounded-[12px] px-4 py-3 font-poppins">
              {submitError}
            </div>
          )}
          <div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-[142px] h-[48px] flex items-center justify-center bg-[#5D5FEF] text-white rounded-[32px] text-[18px] font-medium hover:bg-[#5D5FEF]/90 transition-colors font-poppins"
            >
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
