import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../api/_models/User.js';
import bcrypt from 'bcryptjs';

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/khroniq-watches';

async function testLogin() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to DB');
    
    const email = 'shashikantchaudhary1010@gmail.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found');
    } else {
      console.log('User found:', user.email, 'Role:', user.role);
      console.log('Password hash:', user.password);
      
      const isMatch = await user.comparePassword('admin123'); // assuming standard admin password
      console.log('Password matches admin123?', isMatch);
      
      console.log('Attempting to save user to test pre-save hook...');
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      await user.save();
      console.log('User saved successfully');
    }
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error during test:', err);
    mongoose.disconnect();
  }
}

testLogin();
