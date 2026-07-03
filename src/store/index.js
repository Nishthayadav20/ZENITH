import { configureStore } from '@reduxjs/toolkit';
import watchReducer from './slices/watchSlice';

export const store = configureStore({
  reducer: {
    watch: watchReducer
  }
});

// Auto-sync Redux store state changes to localStorage
store.subscribe(() => {
  const state = store.getState().watch;
  localStorage.setItem('khroniq_products', JSON.stringify(state.products));
  localStorage.setItem('khroniq_cart', JSON.stringify(state.cart));
  localStorage.setItem('khroniq_wishlist', JSON.stringify(state.wishlist));
  localStorage.setItem('khroniq_orders', JSON.stringify(state.orders));
  localStorage.setItem('khroniq_coupons', JSON.stringify(state.coupons));
  if (state.currentUser) {
    localStorage.setItem('khroniq_user', JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem('khroniq_user');
  }
});
