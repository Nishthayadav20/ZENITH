import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payments/create-order
// @desc    Create a Razorpay order for the given amount
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  const { amount } = req.body; // amount in your currency's smallest unit will be calculated here

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise (or cents)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify payment signature, then create the actual order in DB
// @access  Private
router.post('/verify', protect, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    subtotal,
    discount,
    total,
    shippingDetails
  } = req.body;

  try {
    // 1. Verify the signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // 2. Verify stock of all products
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} items left.`
        });
      }
    }

    // 3. Deduct stock
    const dbItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      product.stock = Math.max(0, product.stock - item.quantity);
      await product.save();

      dbItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    // 4. Create the order
    const randomId = 'Z-' + Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      id: randomId,
      userEmail: req.user.email,
      userName: req.user.name,
      items: dbItems,
      subtotal: Number(subtotal),
      discount: Number(discount),
      total: Number(total),
      shippingDetails,
      paymentDetails: {
        method: 'Razorpay',
        last4: razorpay_payment_id.slice(-4)
      },
      status: 'Paid'
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during payment verification' });
  }
});

export default router;