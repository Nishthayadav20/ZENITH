import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  category: String,
  gender: String,
  description: String,
  image: String,
  badge: String,
  unitCodes: Array,
  reviews: Array,
  customizable: Boolean,
  specs: Object
});

const Product = mongoose.model('Product', productSchema);

const seed = async () => {
  try {
    await mongoose.connect('mongodb+srv://zenith_admin:zenith_admin2026@cluster0.fg0dyzo.mongodb.net/?appName=Cluster0');
    
    const p1 = new Product({
      name: 'Khroniq Silver Blue Edition',
      price: 4999,
      stock: 10,
      category: 'Khronomaster',
      gender: 'men',
      description: 'A masterpiece with a blue textured dial and silver finish.',
      image: '/assets/new_featured_watch_1.png',
      badge: 'New',
      unitCodes: [],
      reviews: [],
      customizable: false,
      specs: {
        movement: 'Automatic',
        case: 'Stainless Steel',
        strap: 'Leather Strap',
        waterResistance: '50m',
        glass: 'Sapphire Crystal'
      }
    });
    
    const p2 = new Product({
      name: 'Khroniq Azure Classic',
      price: 5200,
      stock: 5,
      category: 'Heritage',
      gender: 'unisex',
      description: 'Classic heritage design with modern blue dial.',
      image: '/assets/new_featured_watch_2.png',
      badge: 'Limited Edition',
      unitCodes: [],
      reviews: [],
      customizable: false,
      specs: {
        movement: 'Automatic',
        case: 'Stainless Steel',
        strap: 'Leather Strap',
        waterResistance: '30m',
        glass: 'Sapphire Crystal'
      }
    });

    await p1.save();
    await p2.save();
    console.log('Products added directly to DB!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
seed();
