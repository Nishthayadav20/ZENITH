import app from '../api/index.js';
import mongoose from 'mongoose';

const server = app.listen(5005, async () => {
  console.log('Test Server running on 5005');
  try {
    const res = await fetch('http://localhost:5005/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@khroniq.com', password: 'admin123' })
    });
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    server.close();
    mongoose.disconnect();
  }
});
