import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Product from '../_models/Product.js';
import Order from '../_models/Order.js';
import { protect } from '../_middleware/auth.js';
import sendEmail from '../utils/sendEmail.js';

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

    // Generate order ID first, so item serials can reference it
const randomId = 'Z-' + Math.floor(100000 + Math.random() * 900000);

// 3. Deduct stock & generate warranty codes
const dbItems = [];
let itemIndex = 0;
for (const item of items) {
  itemIndex++;
  const product = await Product.findById(item.productId);
  product.stock = Math.max(0, product.stock - item.quantity);
  await product.save();

  const serialNumber = `KHQ-${new Date().getFullYear()}-${randomId.replace('Z-', '')}-${String(itemIndex).padStart(2, '0')}`;
  const claimCode = `CLM-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;

  dbItems.push({
    productId: item.productId,
    name: product.name,
    price: product.price,
    quantity: item.quantity,
    image: product.image,
    serialNumber,
    claimCode,
    warrantyClaimed: false,
    warrantyMonths: product.warrantyMonths || 12
  });
}


    // 4. Create the order
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

    // Send invoice email (non-blocking — don't fail the order if email fails)
    try {
      const itemsHtml = dbItems.map(item => `
  <tr>
    <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
    <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
    <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${item.price.toLocaleString()}</td>
  </tr>
`).join('');

const warrantyHtml = dbItems.map(item => `
  <tr>
    <td style="padding:6px 8px;border-bottom:1px solid #eee;">${item.name}</td>
    <td style="padding:6px 8px;border-bottom:1px solid #eee;font-family:monospace;">${item.serialNumber}</td>
    <td style="padding:6px 8px;border-bottom:1px solid #eee;font-family:monospace;">${item.claimCode}</td>
  </tr>
`).join('');

      await sendEmail({
        to: req.user.email,
        subject: `KHRONIQ Watches - Order Confirmation ${randomId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
            <h2>Thank you for your order, ${req.user.name}!</h2>
            <p>Your order <strong>${randomId}</strong> has been confirmed and paid.</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
              <thead>
                <tr>
                  <th style="padding:8px;text-align:left;border-bottom:2px solid #333;">Item</th>
                  <th style="padding:8px;text-align:center;border-bottom:2px solid #333;">Qty</th>
                  <th style="padding:8px;text-align:right;border-bottom:2px solid #333;">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <p>Subtotal: ₹${Number(subtotal).toLocaleString()}</p>
            ${discount > 0 ? `<p>Discount: -₹${Number(discount).toLocaleString()}</p>` : ''}
            <p style="font-size:16px;font-weight:bold;">Total Paid: ₹${Number(total).toLocaleString()}</p>
            <hr/>
            <p><strong>Shipping to:</strong><br/>
            ${shippingDetails.fullName}<br/>
            ${shippingDetails.streetAddress}, ${shippingDetails.city}, ${shippingDetails.zipCode}</p>
            <hr/>
            <h3 style="margin-bottom:6px;">Warranty Registration Details</h3>
            <p style="font-size:12px;color:#555;">Keep this email — you'll need the Claim Code to register your warranty on our site.</p>
            <table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:12px;">
              <thead>
                <tr>
                  <th style="padding:6px 8px;text-align:left;border-bottom:2px solid #333;">Watch</th>
                  <th style="padding:6px 8px;text-align:left;border-bottom:2px solid #333;">Serial Number</th>
                  <th style="padding:6px 8px;text-align:left;border-bottom:2px solid #333;">Claim Code</th>
                </tr>
              </thead>
              <tbody>${warrantyHtml}</tbody>
            </table>
            <p style="color:#888;font-size:12px;">Payment ID: ${razorpay_payment_id}</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Invoice email failed to send:', emailError);
      // Don't block the order response even if email fails
    }

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during payment verification' });
  }
});

export default router;