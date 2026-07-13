// lib/uploadToCloudinary.ts
import cloudinary from "./cloudinary";

export async function uploadToCloudinary(fileBuffer: Buffer, folder = "products"): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}