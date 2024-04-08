import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import fs from "fs";

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
  let tempsLocation = "temps";
  !fs.existsSync(tempsLocation) && fs.mkdirSync(tempsLocation);
  tempsLocation += "/cloudinary";
  !fs.existsSync(tempsLocation) && fs.mkdirSync(tempsLocation);

  const fullFileLocation = tempsLocation + "/" + fileName;
  fs.writeFileSync(fullFileLocation, Buffer.from(await file.arrayBuffer()));
  const image = await cloudinary.uploader.upload(fullFileLocation, {
    transformation: {
      width: 1000,
      height: 1000,
    },
    folder: `Shopicom/${variantId}`,
  });
  fs.unlinkSync(fullFileLocation);

  return image;
};
