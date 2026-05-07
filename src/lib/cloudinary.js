import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_URL) throw new Error('Missing CLOUDINARY_URL environment variable')
cloudinary.config(process.env.CLOUDINARY_URL)

export default cloudinary;