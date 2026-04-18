import React, { useState } from 'react';
import * as yup from 'yup';
import { FormConfig } from '../../configs/formConfig';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';

interface DynamicFormProps {
  config: FormConfig;
  onSubmit: (data: Record<string, any>) => void;
  forgotPasswordLink?: React.ReactNode;
  validationSchema?: yup.ObjectSchema<any>;
  initialData?: Record<string, any>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ config, onSubmit, forgotPasswordLink, validationSchema, initialData }) => {
  // Initialize with initialData or default values from config
  const getInitialValues = () => {
    const data = { ...(initialData || {}) };
    const allFields = config.sections 
      ? config.sections.flatMap(s => s.fields)
      : (config.fields || []);
    
    allFields.forEach(field => {
      if (field.defaultValue !== undefined && data[field.name] === undefined) {
        data[field.name] = field.defaultValue;
      }
    });
    return data;
  };

  const [formData, setFormData] = useState<Record<string, any>>(getInitialValues());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validationSchema) {
      try {
        await validationSchema.validate(formData, { abortEarly: false });
        setErrors({}); // clear previous errors
        onSubmit(formData);
      } catch (err: any) {
        if (err.inner) {
          const validationErrors: Record<string, string> = {};
          err.inner.forEach((error: any) => {
            if (error.path) {
              validationErrors[error.path] = error.message;
            }
          });
          setErrors(validationErrors);
        }
      }
    } else {
      onSubmit(formData);
    }
  };

  const renderField = (field: any) => {
    // Legacy support for 'width' (half/full) mapped to 2-col or new colSpan for 3-col
    let spanClass = 'col-span-1 md:col-span-3'; // default fallback for 3-col grid
    
    if (field.colSpan) {
      if (field.colSpan === 1) spanClass = 'col-span-1 md:col-span-1';
      else if (field.colSpan === 2) spanClass = 'col-span-1 md:col-span-2';
      else if (field.colSpan === 3) spanClass = 'col-span-1 md:col-span-3';
    } else if (field.width) {
      // Legacy backwards-compatibility for Login & Signup
      spanClass = field.width === 'half' ? 'col-span-2 md:col-span-1' : 'col-span-2';
    }

    return (
      <div key={field.name} className={spanClass}>
        <FormField
          name={field.name}
          type={field.type}
          controlType={field.controlType}
          options={field.options}
          placeholder={field.placeholder}
          label={field.label}
          value={formData[field.name] || ''}
          error={errors[field.name]}
          onChange={handleChange}
          showEyeIcon={field.type === 'password'}
          disabled={field.disabled}
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {config.sections ? (
        // Rendering Sectioned Form (e.g. Account Setup)
        <div className="flex flex-col gap-8">
          {config.sections.map((section, idx) => (
            <div key={idx} className="w-full">
              {section.title && <h3 className="text-[20px] font-medium leading-[30px] text-[#434348] font-poppins mb-4">{section.title}</h3>}
              
              {/* Force grid layout: usually 3-cols for Account Setup, but 1 on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                {section.fields.map(renderField)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Rendering Legacy Flat Form (e.g. Login / Signup)
        <div className="grid grid-cols-2 gap-x-4">
          {config.fields?.map(renderField)}
        </div>
      )}
      
      {forgotPasswordLink && (
        <div className="mt-2">
          {forgotPasswordLink}
        </div>
      )}

      <div className={`${config.sections ? 'mt-8 flex justify-start' : 'mt-2 w-full'}`}>
        <Button 
          type="submit" 
          fullWidth={!config.sections} // Account setup button is fitted, login is full width
          variant="primary"
          className={config.sections ? '!w-[229px] !h-[48px] !text-[18px] !font-medium !leading-[27px]' : ''}
        >
          {config.submitButtonText}
        </Button>
      </div>
    </form>
  );
};
