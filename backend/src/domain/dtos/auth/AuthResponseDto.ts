export interface AuthResponseDto {
  status: boolean;
  message: string;
  data?: {
    employerId: string;
    accessToken: string;
    refreshToken: string;
    logoUrl?: string | undefined;
  };
}
