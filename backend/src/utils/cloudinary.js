import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCLoudinary = async (localFile) => {
    try {
        if (!localFile) return null;

        // uploading to cloudinary
        const response = await cloudinary.uploader.upload(
            localFile, { folder: "msiconnect/images", }
        );

        fs.unlinkSync(localFile);
        return response;
    } catch (error) {
        fs.unlinkSync(localFile);
        console.log(`Error uploaing file to cloudinary ${process.env.CLOUDINARY_API_KEY}`, error);
        return null;
    }
};

export { uploadOnCLoudinary };
