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
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm text-gray-700 font-medium mb-1.5">{children}</label>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[17px] font-semibold text-gray-900 mt-8 mb-4">{children}</h2>
);

const Input = React.forwardRef<HTMLInputElement, any>(({ placeholder, error, type = "text", ...props }, ref) => (
  <div className="w-full flex-col">
    <input 
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`w-full h-11 px-4 py-2 border rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
  </div>
));
Input.displayName = 'Input';

const Select = React.forwardRef<HTMLSelectElement, any>(({ placeholder = "Select", options = [], error, ...props }, ref) => (
  <div className="w-full flex-col">
    <div className="relative w-full">
      <select 
        ref={ref}
        {...props}
        className={`w-full h-11 pl-4 pr-10 py-2 border rounded-md text-sm outline-none appearance-none transition-colors bg-white ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'} text-gray-900`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt: string, i: number) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
  </div>
));
Select.displayName = 'Select';

const InputWithAddon = React.forwardRef<HTMLInputElement, any>(({ placeholder, addon, error, ...props }, ref) => (
  <div className="w-full flex-col">
    <div className={`flex w-full h-11 border rounded-md overflow-hidden transition-colors ${error ? 'border-red-500 focus-within:border-red-500' : 'border-gray-200 focus-within:border-indigo-500'}`}>
      <input 
        ref={ref}
        type="number"
        placeholder={placeholder}
        className="flex-1 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
        {...props}
      />
      <div className="flex items-center justify-center bg-gray-50 border-l border-gray-200 px-4 text-sm text-gray-500 font-medium">
        {addon}
      </div>
    </div>
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
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
      jobLevel: ""
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
    // Only reset if it's already interacted, technically form initiates with empty string
  }, [selectedCountry]);

  const router = useRouter();
  const { employerId } = useAppSelector((state) => state.employer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Send all validated form fields — companyName is resolved by the backend from the employer profile
      await createJob(data);
      router.push('/dashboard/my-jobs');
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-full pb-12">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Post a job</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0 w-full animate-in fade-in">
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Job Titles</Label>
            <Input {...register("title")} placeholder="e.g. Senior UX Designer" error={errors.title?.message} />
          </div>
          <div>
            <Label>Tags</Label>
            <Input {...register("tags")} placeholder="e.g. Design, Figma (comma separated)" error={errors.tags?.message} />
          </div>
          <div>
            <Label>Job Role / Industry</Label>
            <Select {...register("role")} options={JOB_ROLES} error={errors.role?.message} />
          </div>
        </div>

        {/* Section: Salary */}
        <SectionTitle>Salary</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Section: Advance Information */}
        <SectionTitle>Advance Information</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Job Level</Label>
            <Select {...register("jobLevel")} options={JOB_LEVELS} error={errors.jobLevel?.message} />
          </div>
          <div>
            <Label>Expiration Date</Label>
            <Input {...register("expirationDate")} type="date" error={errors.expirationDate?.message} />
          </div>
        </div>

        {/* Section: Location */}
        <SectionTitle>Location</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
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
        <div className="flex items-center gap-2 mb-2">
          <input 
            type="checkbox" 
            id="remote" 
            {...register("fullyRemote")}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="remote" className="text-sm text-gray-700">Fully remote position</label>
        </div>

        {/* Section: Job Descriptions */}
        <SectionTitle>Job Descriptions</SectionTitle>
        <div className="w-full mb-8">
          <textarea 
            {...register("description")}
            placeholder="Add job description"
            className={`w-full h-[200px] p-4 border rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none transition-colors ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}`}
          />
          {errors.description && <span className="text-xs text-red-500 mt-1 block">{errors.description.message}</span>}
        </div>

        {/* Submit */}
        {submitError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
            {submitError}
          </div>
        )}
        <div>
          <Button 
            type="submit"
            className="w-auto px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}
