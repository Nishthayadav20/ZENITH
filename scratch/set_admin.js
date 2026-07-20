// One-time script: makes shashikantchaudhary1010@gmail.com an admin account.
// Run locally with: node scratch/set_admin.js
// Safe to delete after running.

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../api/_models/User.js';
import crypto from 'crypto';

const ADMIN_EMAIL = 'shashikantchaudhary1010@gmail.com';

const run = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/khroniq-watches';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB');

  let user = await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });

  if (user) {
    user.role = 'admin';
    await user.save();
    console.log(`Existing user found. Role updated to 'admin' for: ${user.email}`);
  } else {
    // User schema requires a password even though this account will only
    // sign in via the emailed code — generating a random one it'll never need.
    const randomPassword = crypto.randomBytes(16).toString('hex');
    user = await User.create({
      name: 'Shashikant Chaudhary',
      email: ADMIN_EMAIL.toLowerCase().trim(),
      password: randomPassword,
      role: 'admin'
    });
    console.log(`New admin user created: ${user.email}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});