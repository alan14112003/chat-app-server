import { v2 as CloudinaryConfig } from 'cloudinary'
import { configDotenv } from 'dotenv'
configDotenv()

CloudinaryConfig.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
})

export default CloudinaryConfig
