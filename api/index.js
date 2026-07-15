import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


// Import Models
import Product from './_models/Product.js';
import User from './_models/User.js';
import Coupon from './_models/Coupon.js';
import brandUpdateModel from './_models/BrandUpdate.js'; // Let's keep it clean
import Blog from './_models/Blog.js';

// Import Routes
import authRoutes from './_routes/auth.js';
import productRoutes from './_routes/products.js';
import orderRoutes from './_routes/orders.js';
import couponRoutes from './_routes/coupons.js';
import cartRoutes from './_routes/cart.js';
import wishlistRoutes from './_routes/wishlist.js';
import brandRoutes from './_routes/brands.js';
import categoryRoutes from './_routes/categories.js';
import uploadRoutes from './_routes/upload.js';
import mediaRoutes from './_routes/media.js';
import paymentRoutes from './_routes/payments.js';
import adminRoutes from './_routes/admin.js';
import brandUpdateRoutes from './_routes/brandUpdates.js';
import warrantyRoutes from './_routes/warranty.js';
import blogRoutes from './_routes/blogs.js';

const app = express();

// Database Connection Status Variables
let dbConnectionError = null;
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/khroniq-watches';

// Single DB ready promise — resolves once connected & seeded
let dbReadyResolve, dbReadyReject;
const dbReady = new Promise((res, rej) => {
  dbReadyResolve = res;
  dbReadyReject = rej;
});

// Middleware: wait for DB to be ready before handling any request
const ensureDb = async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    console.error('DB not ready:', err);
    return res.status(503).json({ success: false, message: 'Database unavailable. Please try again shortly.' });
  }
};

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(ensureDb);

// Vercel Serverless Routing URL Restorer
app.use((req, res, next) => {
  if (req.headers['x-now-route-asis'] || process.env.VERCEL) {
    req.url = req.originalUrl;
  }
  next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/brand-updates', brandUpdateRoutes);
app.use('/api/warranty', warrantyRoutes);
app.use('/api/blogs', blogRoutes);


// Base Endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the KHRONIQ API' });
});

// Diagnostics Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: {
      has_mongodb_uri: !!process.env.MONGODB_URI,
      has_jwt_secret: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV
    },
    mongoose: {
      readyState: mongoose.connection.readyState, // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      error: dbConnectionError
    }
  });
});

// Database Seed Function
const seedDatabase = async () => {
  try {
    // NOTE: Product deletion logic removed (previously lines 112-121)
    // Products added via admin panel are now persisted in MongoDB without automatic deletion.
    // This allows admins to add and maintain watches in the database across server restarts.
    
    // Seed Default Blogs (only on first initialization)
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      const initialBlogs = [
        {
          title: "The Art of Swadeshi Horology",
          content: "Behind the scenes of KHRONIQ's Le Locle and Indian assembly processes, bringing high-precision chronometer watches to modern watch enthusiasts. Discover how we balance heritage design with modern components.",
          author: "Vikram R. Mehta",
          image: "/assets/gentleman_lifestyle.png",
          category: "Horology"
        },
        {
          title: "Choosing the Right Case Finish",
          content: "A guide on selecting between polished stainless steel, rose gold PVD, and matte ceramic finishes for your bespoke timepiece. Learn which finish best suits your daily attire and lifestyle.",
          author: "Ananya Sharma",
          image: "/assets/aurex_lifestyle.png",
          category: "Guides"
        }
      ];
      await Blog.insertMany(initialBlogs);
      console.log('Database Seeding: Default Blogs successfully seeded!');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Connect once at startup — resolve dbReady when done
mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    dbConnectionError = null;
    await seedDatabase();
    dbReadyResolve();
    
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    dbConnectionError = err.message || err.toString();
    dbReadyReject(err);
  });

const PORT = process.env.PORT || 5000;

// Only listen when running locally
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
