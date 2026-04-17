export interface SignupWithSetupDto {
  fullName: string;
  username: string;
  email: string;
  passwordHash?: string; // This is generated
  password?: string; // Raw input if we send it
  logoUrl?: string; // We'll process the logo via file upload initially
  companyName: string;
  organizationType: string;
  industryType: string;
  teamSize: string;
  yearEstablished: string;
  aboutUs: string;
  location: string;
  contactNumber: string;
}
