import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { Readable } from "stream"; // Node.js built-in

export const cloudinaryConfig = () => {
  return cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
    secure: true,
  });
};

export const UploadBlobToCloudinary = async (
  fileName: string,
  file: File,
  variantId: number,
): Promise<UploadApiResponse> => {
  cloudinaryConfig();

  const buffer = Buffer.from(await file.arrayBuffer());

  // Create a stream from buffer (no extra libraries needed)
  const stream = Readable.from(buffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        transformation: {
          width: 1000,
          height: 1000,
        },
        folder: `Shopicom/${variantId}`,
        public_id: fileName.split(".")[0], // Optional: no extension
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    );

    stream.pipe(uploadStream);
  });
};

