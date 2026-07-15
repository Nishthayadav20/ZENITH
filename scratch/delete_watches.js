import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../api/_models/Product.js';

dotenv.config({ path: '.env' });

const run = async () => {
  const watchNames = [
    'Khroniq Aurex Blue',
    'Khroniq Salmon Elegance',
    'Khroniq Aurex Cobalt',
    'Khroniq Onyx Horizon',
    'Khroniq Stella White'
  ];

  try {
    // 1. Delete from local database (Zenith-watches)
    console.log('Connecting to local database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');
    
    for (const name of watchNames) {
      const res = await Product.deleteOne({ name });
      console.log(`Local DB: Deleted "${name}"? ${res.deletedCount > 0}`);
    }
    await mongoose.disconnect();

    // 2. Delete from live Vercel database (via login & API calls)
    console.log('Logging in to live Vercel site as admin...');
    const loginRes = await fetch('https://zenith-sigma-ruby.vercel.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@khroniq.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      throw new Error(`Login failed: ${loginData.message}`);
    }
    const token = loginData.token;
    console.log('Logged in successfully!');

    // Fetch live products to get their IDs
    console.log('Fetching live products...');
    const productsRes = await fetch('https://zenith-sigma-ruby.vercel.app/api/products');
    const productsData = await productsRes.json();
    if (!productsData.success) {
      throw new Error('Failed to fetch live products');
    }

    const liveProductsToDelete = productsData.products.filter(p => watchNames.includes(p.name));
    console.log(`Found ${liveProductsToDelete.length} watches to delete on Vercel.`);

    for (const p of liveProductsToDelete) {
      console.log(`Deleting ${p.name} (ID: ${p.id}) on Vercel...`);
      const delRes = await fetch(`https://zenith-sigma-ruby.vercel.app/api/products/${p.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const delData = await delRes.json();
      console.log(`Deleted ${p.name}? ${delData.success}`);
    }

    console.log('Database cleanup completed!');
    process.exit(0);
  } catch (err) {
    console.error('Error during database cleanup:', err);
    process.exit(1);
  }
};

run();
