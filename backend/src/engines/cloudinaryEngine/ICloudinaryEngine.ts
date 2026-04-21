export interface ICloudinaryEngine {
  uploadLogo(fileBuffer: Buffer, filename: string): Promise<{ url: string }>;
}
