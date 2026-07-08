import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../api/_models/Product.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/khroniq-watches';

async function test() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected.');

    const newProductData = {
      name: 'Test Timepiece',
      price: 4500,
      stock: 8,
      category: 'Khronomaster',
      gender: 'unisex',
      description: 'A test timepiece description that has some text to satisfy length.',
      image: '/assets/media__1782899491225.jpg',
      specs: {
        movement: 'Automatic Chronometer',
        case: 'Stainless Steel (40mm)',
        strap: 'Leather strap',
        waterResistance: '50m',
        glass: 'Sapphire Crystal'
      },
      customizable: true,
      allowStrapCustomization: true,
      allowCaseCustomization: true
    };

    console.log('Attempting to create Product model instance...');
    const product = new Product(newProductData);
    
    console.log('Saving product to database...');
    const saved = await product.save();
    console.log('SUCCESS! Product saved:', saved.id);

    // Clean up
    await Product.deleteOne({ _id: saved._id });
    console.log('Cleaned up test product.');
  } catch (err) {
    console.error('ERROR OCCURRED:');
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

test();
