import { promises as fs } from 'fs';
import cloudinary from '../middleware/authentication/Cloudinary.js';

export const uploadImageToCloudinary = async (file, options = {}) => {
    try {
        // Default options
        const defaultOptions = {
            folder: "uploads",
            resource_type: "image",
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
        };

        // Merge default options with provided options
        const uploadOptions = { ...defaultOptions, ...options };

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, uploadOptions);
        if(!result){
            console.log("file was not uploaded due to bad internet.")
            return {
                success:false,
                error:"file was not uploaded due to bad internet!"
            }
        }
        // Clean up local file
        await fs.unlink(file.path);

        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        };

    } catch (err) {
        // Clean up local file if it exists
        if (file?.path) {
            try {
                await fs.unlink(file.path);
            } catch (unlinkError) {
                console.error('Error cleaning up local file:', unlinkError);
            }
        }

        return {
            success: false,
            error: err.message
        };
    }
};