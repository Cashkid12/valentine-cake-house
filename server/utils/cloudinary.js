import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the server root directory (one level up from utils)
dotenv.config({ path: resolve(__dirname, '../.env') });

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('☁️ Cloudinary configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('☁️ Cloudinary API Key exists:', !!process.env.CLOUDINARY_API_KEY);

// Create storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'valentine-cake-house',
    format: async (req, file) => 'png',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      return `cake-${timestamp}-${random}`;
    },
  },
});

export { cloudinary, storage };