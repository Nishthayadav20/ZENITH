import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
  {
    id: '1',
    name: 'Zenith Heritage Rose Gold',
    image: '/assets/media__1782899491225.jpg',
    brand: 'ZENITH',
    price: 1250,
    stock: 8,
    category: 'Heritage',
    gender: 'women',
    description: 'A luxurious timeless classic watch featuring a stunning rose gold casing and index numerals, matching its premium metallic link bracelet. A tribute to Zenith\'s heritage.',
    specs: {
      movement: 'Automatic Chronometer',
      case: 'Rose Gold PVD Steel (40mm)',
      strap: 'Rose Gold Stainless Steel Bracelet',
      waterResistance: '50m (5 ATM)',
      glass: 'Scratch-resistant Sapphire Crystal'
    },
    reviews: [
      { id: 'r1', userName: 'John Doe', rating: 5, comment: 'Exquisite design, feels very premium and heavy. Highly recommend!', date: '2026-06-15', status: 'approved' },
      { id: 'r2', userName: 'Alice Smith', rating: 4, comment: 'Elegant dial, but the bracelet needed adjustment. Overall beautiful watch.', date: '2026-06-20', status: 'approved' }
    ]
  },
  {
    id: '2',
    name: 'Zenith Chronomaster Black Edition',
    image: '/assets/media__1782899491297.jpg',
    brand: 'ZENITH',
    price: 4800,
    stock: 5,
    category: 'Chronomaster',
    gender: 'men',
    description: 'High-precision luxury chronograph watch in matte black design with silver sub-dials and detailed tachymeter scale. Equipped with the legendary El Primero movement DNA.',
    specs: {
      movement: 'El Primero Chronograph (36,000 vph)',
      case: 'Matte Black Ceramic (42mm)',
      strap: 'Black Rubberized Steel Link',
      waterResistance: '100m (10 ATM)',
      glass: 'Double Anti-reflective Sapphire'
    },
    reviews: [
      { id: 'r3', userName: 'Marc V.', rating: 5, comment: 'The El Primero movement is flawless. The black ceramic case is scratchproof!', date: '2026-05-10', status: 'approved' }
    ]
  },
  {
    id: '3',
    name: 'Zenith Elite Classic Brown',
    image: '/assets/media__1782899491320.jpg',
    brand: 'ZENITH',
    price: 2100,
    stock: 12,
    category: 'Elite',
    gender: 'unisex',
    description: 'An ultra-minimalist timepiece featuring an elegant cream white dial, gold baton markers, and a premium textured brown leather strap. Perfect for formal dress occasions.',
    specs: {
      movement: 'Elite Ultra-Thin Automatic',
      case: '18K Yellow Gold (39mm)',
      strap: 'Brown Alligator Leather',
      waterResistance: '30m (3 ATM)',
      glass: 'Dome Sapphire Crystal'
    },
    reviews: [
      { id: 'r4', userName: 'David K.', rating: 4, comment: 'Classic dress watch. Super thin and fits under any cuff.', date: '2026-06-01', status: 'approved' }
    ]
  },
  {
    id: '4',
    name: 'Zenith Defy Automatic Steel',
    image: '/assets/media__1782899491366.jpg',
    brand: 'ZENITH',
    price: 3450,
    stock: 4,
    category: 'Defy',
    gender: 'men',
    description: 'A robust, sporty luxury watch with a brushed stainless steel case, textured black dial, day-date automatic calendar, and deep brown premium leather strap overlay.',
    specs: {
      movement: 'Automatic Calendar Caliber',
      case: 'Brushed Stainless Steel (41mm)',
      strap: 'Brown Leather with Rubber Backing',
      waterResistance: '100m (10 ATM)',
      glass: 'Scratch-resistant Sapphire'
    },
    reviews: [
      { id: 'r5', userName: 'Sarah L.', rating: 5, comment: 'Sturdy yet elegant. Ideal everyday luxury watch.', date: '2026-06-25', status: 'approved' }
    ]
  }
];

const initialCoupons = [
  { code: 'ZENITHSTAR', discountPercent: 20, description: '20% off Zenith Signature Collection' },
  { code: 'WELCOME10', discountPercent: 10, description: '10% off for first-time buyers' }
];

// Helper to safe-parse localStorage items
const loadSaved = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  products: loadSaved('zenith_products', initialProducts),
  cart: loadSaved('zenith_cart', []),
  wishlist: loadSaved('zenith_wishlist', []),
  orders: loadSaved('zenith_orders', []),
  coupons: loadSaved('zenith_coupons', initialCoupons),
  currentUser: loadSaved('zenith_user', null)
};

const watchSlice = createSlice({
  name: 'watch',
  initialState,
  reducers: {
    setCurrentUserAction: (state, action) => {
      state.currentUser = action.payload;
    },
    logoutUserAction: (state) => {
      state.currentUser = null;
      state.cart = [];
    },
    addToCartAction: (state, action) => {
      const { productId, quantity, price } = action.payload;
      const existing = state.cart.find(item => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cart.push({ productId, quantity, price });
      }
    },
    removeFromCartAction: (state, action) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload);
    },
    updateCartQtyAction: (state, action) => {
      const { productId, qty } = action.payload;
      const existing = state.cart.find(item => item.productId === productId);
      if (existing) {
        existing.quantity = qty;
      }
    },
    clearCartAction: (state) => {
      state.cart = [];
    },
    toggleWishlistAction: (state, action) => {
      const productId = action.payload;
      if (state.wishlist.includes(productId)) {
        state.wishlist = state.wishlist.filter(id => id !== productId);
      } else {
        state.wishlist.push(productId);
      }
    },
    addOrderAction: (state, action) => {
      state.orders.unshift(action.payload);
    },
    setProductsAction: (state, action) => {
      state.products = action.payload;
    },
    setOrdersAction: (state, action) => {
      state.orders = action.payload;
    },
    addCouponAction: (state, action) => {
      state.coupons.push(action.payload);
    },
    deleteCouponAction: (state, action) => {
      state.coupons = state.coupons.filter(c => c.code !== action.payload);
    },
    setReviewsAction: (state, action) => {
      const { productId, reviews } = action.payload;
      const prod = state.products.find(p => p.id === productId);
      if (prod) {
        prod.reviews = reviews;
      }
    }
  }
});

export const {
  setCurrentUserAction,
  logoutUserAction,
  addToCartAction,
  removeFromCartAction,
  updateCartQtyAction,
  clearCartAction,
  toggleWishlistAction,
  addOrderAction,
  setProductsAction,
  setOrdersAction,
  addCouponAction,
  deleteCouponAction,
  setReviewsAction
} = watchSlice.actions;

// Thunks
export const registerUser = (name, email, _password) => (dispatch) => {
  const user = { name, email, role: 'customer' };
  dispatch(setCurrentUserAction(user));
  return { success: true };
};

export const loginUser = (email, password) => (dispatch) => {
  if (email === 'admin@zenith.com' && password === 'admin123') {
    const adminUser = { name: 'Admin Administrator', email: 'admin@zenith.com', role: 'admin' };
    dispatch(setCurrentUserAction(adminUser));
    return { success: true, role: 'admin' };
  }
  const userName = email.split('@')[0];
  const customerUser = { name: userName.charAt(0).toUpperCase() + userName.slice(1), email, role: 'customer' };
  dispatch(setCurrentUserAction(customerUser));
  return { success: true, role: 'customer' };
};

export const logoutUser = () => (dispatch) => {
  dispatch(logoutUserAction());
};

export const addToCart = (productId, quantity = 1) => (dispatch, getState) => {
  const { products, cart } = getState().watch;
  const product = products.find(p => p.id === productId);
  if (!product) return { success: false, message: 'Product not found' };

  const cartItem = cart.find(item => item.productId === productId);
  const currentQty = cartItem ? cartItem.quantity : 0;

  if (currentQty + quantity > product.stock) {
    return { success: false, message: `Only ${product.stock} items in stock.` };
  }

  dispatch(addToCartAction({ productId, quantity, price: product.price }));
  return { success: true, message: 'Added to Cart' };
};

export const updateCartQty = (productId, qty) => (dispatch, getState) => {
  const { products } = getState().watch;
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (qty <= 0) {
    dispatch(removeFromCartAction(productId));
    return;
  }

  if (qty > product.stock) {
    alert(`Only ${product.stock} items are in stock.`);
    qty = product.stock;
  }

  dispatch(updateCartQtyAction({ productId, qty }));
};

export const removeFromCart = (productId) => (dispatch) => {
  dispatch(removeFromCartAction(productId));
};

export const toggleWishlist = (productId) => (dispatch) => {
  dispatch(toggleWishlistAction(productId));
};

export const placeOrder = (shippingDetails, paymentDetails, appliedCoupon) => (dispatch, getState) => {
  const { products, cart, currentUser } = getState().watch;
  if (!currentUser) return { success: false, message: 'Please log in to checkout.' };
  if (cart.length === 0) return { success: false, message: 'Cart is empty' };

  let subtotal = 0;
  const items = cart.map(item => {
    const p = products.find(prod => prod.id === item.productId);
    subtotal += p.price * item.quantity;
    return {
      productId: item.productId,
      name: p.name,
      price: p.price,
      quantity: item.quantity,
      image: p.image
    };
  });

  let discount = 0;
  if (appliedCoupon) {
    discount = Math.round(subtotal * (appliedCoupon.discountPercent / 100));
  }
  const total = subtotal - discount;

  const newOrder = {
    id: 'Z-' + Math.floor(100000 + Math.random() * 900000),
    userEmail: currentUser.email,
    userName: currentUser.name,
    items,
    subtotal,
    discount,
    total,
    shippingDetails,
    paymentDetails: {
      method: paymentDetails.method,
      last4: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : 'UPI'
    },
    status: 'Paid',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const updatedProducts = products.map(p => {
    const orderItem = cart.find(item => item.productId === p.id);
    if (orderItem) {
      return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
    }
    return p;
  });

  dispatch(setProductsAction(updatedProducts));
  dispatch(addOrderAction(newOrder));
  dispatch(clearCartAction());
  return { success: true, order: newOrder };
};

export const cancelOrder = (orderId) => (dispatch, getState) => {
  const { products, orders } = getState().watch;
  const order = orders.find(o => o.id === orderId);
  if (!order) return { success: false, message: 'Order not found' };

  if (order.status !== 'Pending' && order.status !== 'Paid' && order.status !== 'Processing') {
    return { success: false, message: 'Orders cannot be cancelled after shipping.' };
  }

  const restoredProducts = products.map(p => {
    const orderItem = order.items.find(item => item.productId === p.id);
    if (orderItem) {
      return { ...p, stock: p.stock + orderItem.quantity };
    }
    return p;
  });

  dispatch(setProductsAction(restoredProducts));
  dispatch(setOrdersAction(orders.map(o => 
    o.id === orderId ? { ...o, status: 'Cancelled' } : o
  )));
  return { success: true };
};

export const updateOrderStatus = (orderId, newStatus) => (dispatch, getState) => {
  const { orders } = getState().watch;
  dispatch(setOrdersAction(orders.map(o => 
    o.id === orderId ? { ...o, status: newStatus } : o
  )));
};

export const addProduct = (productData) => (dispatch, getState) => {
  const { products } = getState().watch;
  const newId = String(products.length > 0 ? Math.max(...products.map(p => Number(p.id))) + 1 : 1);
  const newProduct = {
    id: newId,
    name: productData.name,
    image: productData.image || '/placeholder.jpg',
    brand: 'ZENITH',
    price: Number(productData.price),
    stock: Number(productData.stock),
    category: productData.category || 'Lifestyle',
    gender: productData.gender || 'unisex',
    description: productData.description || '',
    specs: {
      movement: productData.specs?.movement || 'Quartz',
      case: productData.specs?.case || 'Stainless Steel',
      strap: productData.specs?.strap || 'Leather Strap',
      waterResistance: productData.specs?.waterResistance || '50m',
      glass: productData.specs?.glass || 'Sapphire Crystal'
    },
    reviews: []
  };

  dispatch(setProductsAction([...products, newProduct]));
  return { success: true };
};

export const editProduct = (productId, updatedData) => (dispatch, getState) => {
  const { products } = getState().watch;
  dispatch(setProductsAction(products.map(p => 
    p.id === productId 
      ? {
          ...p,
          name: updatedData.name,
          price: Number(updatedData.price),
          stock: Number(updatedData.stock),
          category: updatedData.category,
          gender: updatedData.gender || p.gender || 'unisex',
          description: updatedData.description,
          image: updatedData.image || p.image,
          specs: { ...p.specs, ...updatedData.specs }
        }
      : p
  )));
  return { success: true };
};

export const deleteProduct = (productId) => (dispatch, getState) => {
  const { products } = getState().watch;
  dispatch(setProductsAction(products.filter(p => p.id !== productId)));
  dispatch(removeFromCartAction(productId));
  return { success: true };
};

export const addCoupon = (code, discountPercent, description) => (dispatch, getState) => {
  const { coupons } = getState().watch;
  if (coupons.some(c => c.code.toUpperCase() === code.toUpperCase())) {
    return { success: false, message: 'Coupon code already exists.' };
  }
  dispatch(addCouponAction({ code: code.toUpperCase(), discountPercent: Number(discountPercent), description }));
  return { success: true };
};

export const deleteCoupon = (code) => (dispatch) => {
  dispatch(deleteCouponAction(code));
  return { success: true };
};

export const addReview = (productId, rating, comment) => (dispatch, getState) => {
  const { products, orders, currentUser } = getState().watch;
  if (!currentUser) return { success: false, message: 'Please log in to leave a review.' };

  const hasPurchased = orders.some(o => 
    o.userEmail === currentUser.email && 
    o.items.some(item => item.productId === productId)
  );

  const newReview = {
    id: 'rev-' + Math.floor(100000 + Math.random() * 900000),
    userName: currentUser.name,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
    status: hasPurchased ? 'approved' : 'pending'
  };

  const updatedProducts = products.map(p => {
    if (p.id === productId) {
      return {
        ...p,
        reviews: [newReview, ...(p.reviews || [])]
      };
    }
    return p;
  });

  dispatch(setProductsAction(updatedProducts));
  return { 
    success: true, 
    message: hasPurchased 
      ? 'Review added successfully!' 
      : 'Review submitted! It will appear after admin moderation.' 
  };
};

export const moderateReview = (productId, reviewId, status) => (dispatch, getState) => {
  const { products } = getState().watch;
  dispatch(setProductsAction(products.map(p => {
    if (p.id === productId) {
      return {
        ...p,
        reviews: p.reviews.map(r => 
          r.id === reviewId ? { ...r, status } : r
        )
      };
    }
    return p;
  })));
};

export default watchSlice.reducer;
