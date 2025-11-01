import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST
dotenv.config({ path: resolve(__dirname, '.env') });

console.log('Test - CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);

// Then import cloudinary
import { cloudinary } from './utils/cloudinary.js';

const testCloudinary = async () => {
  try {
    console.log('Testing Cloudinary connection...');
    
    // Test by uploading a simple image (or just testing config)
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('Cloudinary status:', result);
    
    // Test upload capabilities
    const uploadResult = await cloudinary.uploader.upload(
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2E4NTVmNyIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZDSCBUZXN0PC90ZXh0Pgo8L3N2Zz4K',
      {
        public_id: 'test_upload_valentine',
        folder: 'valentine-cake-house-tests'
      }
    );
    
    console.log('✅ Test upload successful!');
    console.log('Uploaded to:', uploadResult.secure_url);
    
    // Clean up test file
    await cloudinary.uploader.destroy('valentine-cake-house-tests/test_upload_valentine');
    console.log('✅ Test file cleaned up');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
  }
};

testCloudinary();