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
  localStorage.setItem('zenith_products', JSON.stringify(state.products));
  localStorage.setItem('zenith_cart', JSON.stringify(state.cart));
  localStorage.setItem('zenith_wishlist', JSON.stringify(state.wishlist));
  localStorage.setItem('zenith_orders', JSON.stringify(state.orders));
  localStorage.setItem('zenith_coupons', JSON.stringify(state.coupons));
  if (state.currentUser) {
    localStorage.setItem('zenith_user', JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem('zenith_user');
  }
});
