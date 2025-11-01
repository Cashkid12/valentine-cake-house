import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Enhanced logging middleware
const logUpload = (req, res, next) => {
  console.log('=== UPLOAD MIDDLEWARE ===');
  console.log('📋 Request body keys:', Object.keys(req.body));
  console.log('📦 Request body values:', req.body);
  console.log('📸 Files count:', req.files ? req.files.length : 0);
  
  if (req.files && req.files.length > 0) {
    req.files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.originalname} -> ${file.path}`);
    });
  }
  next();
};

export const uploadMultiple = [upload.array('images', 5), logUpload];
export const uploadSingle = [upload.single('image'), logUpload];