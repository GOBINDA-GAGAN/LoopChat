
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config()



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});




export const uploadFileToCloudinary = (filePath, mimetype) => {
  const options = {
    resource_type: mimetype.startsWith("video") ? "video" : "image",
  };

  return new Promise((resolve, reject) => {
    if (mimetype.startsWith("video")) {

      cloudinary.uploader.upload_large(filePath, options, (error, result) => {
        fs.unlinkSync(filePath); 
        if (error) return reject(error);
        resolve(result);
      });
    } else {
   
      cloudinary.uploader.upload(filePath, options, (error, result) => {
        fs.unlinkSync(filePath); 
        if (error) return reject(error);
        resolve(result);
      });
    }
  });
};

// Multer setup (store file locally first)
const upload = multer({ dest: "uploads/" });

export const multerMiddleware = upload.single("avatar"); 