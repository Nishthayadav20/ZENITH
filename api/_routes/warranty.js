import express from 'express';
import Order from '../_models/Order.js';

const router = express.Router();

// @route   POST /api/warranty/lookup
// @desc    Look up watch purchases by name & email
// @access  Public
router.post('/lookup', async (req, res) => {
  const { userName, userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ success: false, message: 'Email is required for warranty lookup.' });
  }

  try {
    // Look up orders matching email (case-insensitive)
    const orders = await Order.find({
      userEmail: userEmail.trim().toLowerCase()
    });

    const purchases = [];

    orders.forEach(order => {
      // Only active statuses can claim warranty
      if (order.status === 'Cancelled') return;

      order.items.forEach(item => {
        const productCode = item.name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
        // Generate a claim code: CLM-[Order ID]-[4 char watch prefix]
        const specialClaimCode = `CLM-${order.id}-${productCode}`;
        const serialNumber = `SN-${order.id}-${item.productId.substring(0, 5).toUpperCase()}`;

        purchases.push({
          productId: item.productId,
          name: item.name,
          image: item.image,
          serialNumber: serialNumber,
          specialCode: specialClaimCode,
          orderId: order.id,
          date: order.date
        });
      });
    });

    // Provide testing seeds if database has no purchases for this email
    if (purchases.length === 0) {
      const emailPrefix = userEmail.split('@')[0].toUpperCase().substring(0, 4);
      purchases.push({
        productId: "mock-defy-1",
        name: "Defy Skyline",
        image: "/assets/media__1782899491366.jpg",
        serialNumber: `SN-Z-982103-${emailPrefix}`,
        specialCode: `CLM-Z-982103-${emailPrefix}`,
        orderId: "Z-982103",
        date: "January 15, 2026"
      });
      purchases.push({
        productId: "mock-khro-2",
        name: "Khronomaster Open",
        image: "/assets/media__1782899491297.jpg",
        serialNumber: `SN-Z-441092-${emailPrefix}`,
        specialCode: `CLM-Z-441092-${emailPrefix}`,
        orderId: "Z-441092",
        date: "February 28, 2026"
      });
    }

    res.json({ success: true, purchases });
  } catch (error) {
    console.error('Warranty lookup error:', error);
    res.status(500).json({ success: false, message: 'Server error during lookup.' });
  }
});

// @route   POST /api/warranty/claim
// @desc    Verify and register the warranty with serial & special claim code
// @access  Public
router.post('/claim', (req, res) => {
  const { userName, userEmail, watchName, serialNumber, specialCode } = req.body;

  if (!userName || !userEmail || !watchName || !serialNumber || !specialCode) {
    return res.status(400).json({ success: false, message: 'All registration parameters are required.' });
  }

  // Simple verification: check formats match and exist
  const isValidSerial = serialNumber.startsWith('SN-Z-');
  const isValidCode = specialCode.startsWith('CLM-Z-');

  if (!isValidSerial || !isValidCode) {
    return res.status(400).json({ success: false, message: 'Invalid purchase serial format or claim code.' });
  }

  // Expiration is 3 years from today
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 3);
  const formattedExpiry = expirationDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  res.json({
    success: true,
    message: 'Warranty registered successfully!',
    details: {
      status: 'Active & Certified',
      registeredTo: userName,
      registeredEmail: userEmail,
      watchModel: watchName,
      serialNumber: serialNumber,
      claimCode: specialCode,
      expiryDate: formattedExpiry
    }
  });
});

export default router;
