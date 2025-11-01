import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB connection...');

// Mask the password in the log for security
const maskedURI = process.env.MONGODB_URI.replace(/:([^:]+)@/, ':****@');
console.log('Connection string:', maskedURI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout
})
.then(() => {
  console.log('✅ SUCCESS: Connected to MongoDB!');
  process.exit(0);
})
.catch((error) => {
  console.log('❌ FAILED: MongoDB connection error:');
  console.log('Error message:', error.message);
  console.log('Error code:', error.code);
  console.log('Error name:', error.name);
  process.exit(1);
});