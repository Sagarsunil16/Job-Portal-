export interface FieldConfig {
  name: string;
  type?: string; // used for inputs ('text', 'password', 'email')
  controlType?: 'input' | 'select' | 'textarea' | 'phone' | 'file';
  placeholder?: string;
  label?: string;
  required?: boolean;
  width?: 'full' | 'half'; // Deprecated in favor of colSpan on 3-col layouts, kept for legacy (Login/Signup)
  colSpan?: 1 | 2 | 3; // New 3-column grid width representation
  options?: { label: string; value: string }[]; // For selects
}

export interface FormSection {
  title?: string;
  fields: FieldConfig[];
}

export interface FormConfig {
  fields?: FieldConfig[]; // Flat layout
  sections?: FormSection[]; // Sectioned layout
  submitButtonText: string;
}

export const loginConfig: FormConfig = {
  fields: [
    { name: 'username', type: 'text', label: 'Username or Email Address', required: true, width: 'full' },
    { name: 'password', type: 'password', label: 'Password', required: true, width: 'full' },
  ],
  submitButtonText: 'Log In',
};

export const signupConfig: FormConfig = {
  fields: [
    { name: 'fullName', type: 'text', label: 'Full Name', required: true, width: 'half' },
    { name: 'username', type: 'text', label: 'Username', required: true, width: 'half' },
    { name: 'email', type: 'email', label: 'Email', required: true, width: 'full' },
    { name: 'password', type: 'password', label: 'Password', required: true, width: 'full' },
    { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true, width: 'full' },
  ],
  submitButtonText: 'Sign Up',
};

// --- New Account Setup Configuration ---
export const accountSetupConfig: FormConfig = {
  sections: [
    {
      title: 'Logo Upload',
      fields: [
        { name: 'logo', controlType: 'file', colSpan: 1 }
      ]
    },
    {
      title: 'Company Info',
      fields: [
        { name: 'companyName', controlType: 'input', label: 'Company Name', colSpan: 1 },
        { 
          name: 'organizationType', 
          controlType: 'select', 
          label: 'Organization Type', 
          colSpan: 1,
          options: [
            { label: 'Private', value: 'private' },
            { label: 'Public', value: 'public' },
            { label: 'Startup', value: 'startup' },
          ]
        },
        { 
          name: 'industryType', 
          controlType: 'select', 
          label: 'Industry Type', 
          colSpan: 1,
          options: [
            { label: 'Technology', value: 'tech' },
            { label: 'Finance', value: 'finance' },
            { label: 'Healthcare', value: 'health' },
          ]
        },
        { 
          name: 'teamSize', 
          controlType: 'select', 
          label: 'Team Size', 
          colSpan: 1,
          options: [
            { label: '1-10', value: '1-10' },
            { label: '11-50', value: '11-50' },
            { label: '51-200', value: '51-200' },
          ]
        },
        { name: 'yearEstablished', controlType: 'input', label: 'Year of Establishment', colSpan: 1 },
        // Blank space in 3rd column handled implicitly by standard wrapping, but let's just let About Us drop to next line automatically by giving it colSpan 3.
        { name: 'aboutUs', controlType: 'textarea', label: 'About Us', colSpan: 3 }
      ]
    },
    {
      title: 'Contact Info',
      fields: [
        { name: 'location', controlType: 'input', label: 'Location', colSpan: 1 },
        { name: 'contactNumber', controlType: 'phone', label: 'Contact Number', colSpan: 1 },
        { name: 'email', controlType: 'input', type: 'email', label: 'Email', colSpan: 1 }
      ]
    }
  ],
  submitButtonText: 'Finish Setup',
};
