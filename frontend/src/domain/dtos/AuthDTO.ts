export interface LoginDTO {
  username: string;
  password: string;
}

export interface SignupDTO {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AccountSetupDTO {
  logo?: File | string | null; // Optional — user may skip logo
  companyName: string;
  organizationType: string;
  industryType: string;
  teamSize: string;
  yearEstablished: string;
  aboutUs: string;
  location: string;
  contactNumber: string;
  email: string;
}

