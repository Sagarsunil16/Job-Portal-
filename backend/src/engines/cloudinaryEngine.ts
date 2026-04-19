import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Debug: Print Cloudinary env variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadLogoToCloudinary = async (fileBuffer: Buffer, filename: string) => {
  return new Promise<{ url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'job-portal/logos',
        public_id: filename,
        resource_type: 'image',
      },
      (error: any, result: any) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url });
      }
    );
    uploadStream.end(fileBuffer);
  });
};
