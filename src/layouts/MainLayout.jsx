import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import WarrantyDrawer from '../components/WarrantyDrawer';
import ScrollToTop from '../components/ScrollToTop';

export default function MainLayout({ children, onPageChange, currentPage }) {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [warrantyOpen, setWarrantyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col font-sans select-none">
      {/* Navigation */}
      <Navbar 
        onCartOpen={() => setCartDrawerOpen(true)} 
        onPageChange={onPageChange}
        currentPage={currentPage}
      />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartDrawerOpen} 
        onClose={() => setCartDrawerOpen(false)} 
        onPageChange={onPageChange}
      />

      {/* Warranty Drawer */}
      <WarrantyDrawer 
        isOpen={warrantyOpen}
        onClose={() => setWarrantyOpen(false)}
      />

      {/* Floating Warranty Tab */}
      <button
        onClick={() => setWarrantyOpen(true)}
        className="fixed right-0 bottom-24 bg-luxury-gold text-neutral-950 font-bold text-[9px] sm:text-[10px] tracking-[0.22em] uppercase py-4 px-2 rounded-l border border-r-0 border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.55)] hover:bg-neutral-100 hover:text-black hover:pr-3 transition-all duration-300 z-40 cursor-pointer"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}
      >
        Warranty
      </button>

      {/* Main Content Area */}
      <main className={['home', 'gifting', 'shop'].includes(currentPage) ? 'flex-1 w-full' : 'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {children}
      </main>

      {/* Footer */}
      <Footer onPageChange={onPageChange} />

      {/* Scroll to Top Scroller */}
      <ScrollToTop />
    </div>
  );
}
