import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, setCurrencyAction, selectCurrentCurrency } from '../store/slices/watchSlice';
import { ShoppingBag, Heart, Search, User, ShieldAlert, Menu, X } from 'lucide-react';


export default function Navbar({ onCartOpen, onPageChange, currentPage }) {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.watch.cart);
  const wishlist = useSelector(state => state.watch.wishlist);
  const currentUser = useSelector(state => state.watch.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileMenuOpen(false);
    onPageChange('home');
  };
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const currentCurrency = useSelector(selectCurrentCurrency);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState('recipient');

  const currencyMap = {
    INR: { symbol: '₹', label: 'Indian Currency (Rupees)' },
    USD: { symbol: '$', label: 'US Currency (Dollar)' },
    EUR: { symbol: '€', label: 'British Currency (Euro)' }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Track scrolling for background transparency on homepage
      if (currentScrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide header on scroll down, show on scroll up
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false); // Scrolling down
      } else {
        setVisible(true); // Scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onPageChange('shop', { search: searchQuery });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'HOME', page: 'home' },
    { label: 'MEN', page: 'shop', filter: { gender: 'men' } },
    { label: 'WOMEN', page: 'shop', filter: { gender: 'women' } },
    { label: 'SHOP ALL', page: 'shop' },
    { label: 'KHRONOMASTER', page: 'shop', filter: { category: 'Khronomaster' } },
    { label: 'CUSTOMIZE', page: 'customization' },
    { label: '🎁 GIFTING', page: 'gifting', megaMenu: true },
  ];

  const handleNavLinkClick = (link) => {
    if (link.filter) {
      onPageChange('shop', link.filter);
    } else if (link.page === 'customization') {
      onPageChange('customization', { reset: Date.now() });
    } else {
      onPageChange(link.page);
    }
    setMobileMenuOpen(false);
  };

  const isHome = currentPage === 'home';
  const headerClass = `${
    isHome ? 'fixed' : 'sticky'
  } top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
    visible ? 'translate-y-0' : 'translate-y-0 md:-translate-y-full'
  } ${
    isHome 
      ? (scrolled ? 'bg-black/95 backdrop-blur-md shadow-md' : 'bg-transparent')
      : 'bg-[#111111] shadow-md'
  }`;

  const textColorClass = "text-white hover:text-luxury-gold";

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={isHome ? "text-white hover:text-luxury-gold focus:outline-none" : "text-luxury-muted hover:text-luxury-text focus:outline-none"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Left Navigation: Brand Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 text-[11px] lg:text-xs font-black tracking-wider">
            {navLinks.map((link, idx) => {
              if (link.dropdown) {
                return (
                  <div key={idx} className="relative group py-2">
                    <button
                      onClick={() => handleNavLinkClick(link)}
                      className={`whitespace-nowrap transition duration-200 cursor-pointer uppercase font-black tracking-wider ${textColorClass} ${
                        currentPage === link.page ? 'text-luxury-gold' : ''
                      }`}
                    >
                      {link.label}
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-[#111111] border border-white/10 rounded shadow-xl py-2 hidden group-hover:block transition duration-200 z-50 text-left">
                      {[
                        { label: 'Our Story', view: 'about' },
                        { label: 'Boutique Contact', view: 'contact' },
                        { label: 'Client FAQ', view: 'faq' },
                        { label: 'Blogs & Editorial', view: 'blogs' },
                        { label: 'Legal Policies', view: 'policies' }
                      ].map((sub) => (
                        <button
                          key={sub.view}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPageChange('static', { view: sub.view });
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-white/10 text-gray-300 hover:text-white transition text-[11px] font-bold uppercase tracking-wider cursor-pointer block"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              if (link.megaMenu) {
                return (
                  <div key={idx} className="relative group py-2">
                    <button
                      onClick={() => handleNavLinkClick(link)}
                      className={`whitespace-nowrap transition duration-200 cursor-pointer uppercase font-black tracking-wider ${textColorClass} ${
                        currentPage === link.page ? 'text-luxury-gold' : ''
                      }`}
                    >
                      {link.label}
                    </button>
                    
                    {/* CLEAN DROPDOWN - DIRECTLY BENEATH GIFTING */}
                    <div className="absolute top-[85%] left-1/2 -translate-x-1/2 pt-4 w-52 hidden group-hover:block z-50 text-left">
                      <div className="bg-black/85 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl py-2 overflow-hidden">
                        {[
                          { label: 'Watches For Bride', filter: { gender: 'women', search: 'Bride' } },
                          { label: 'Watches For Groom', filter: { gender: 'men', search: 'Groom' } },
                          { label: 'Watches For Mother', filter: { gender: 'women', search: 'Mother' } },
                          { label: 'Watches For Father', filter: { gender: 'men', search: 'Father' } },
                          { label: 'Watches For Brother', filter: { gender: 'men', search: 'Brother' } },
                          { label: 'Watches For Sister', filter: { gender: 'women', search: 'Sister' } },
                          { label: 'Watches For Friend', filter: { search: 'Friend' } },
                        ].map((sub) => (
                          <button
                            key={sub.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              onPageChange('shop', sub.filter);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-white/10 text-gray-300 hover:text-luxury-gold transition text-[11px] font-bold uppercase tracking-wider cursor-pointer block"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleNavLinkClick(link)}
                  className={`whitespace-nowrap transition duration-200 cursor-pointer ${textColorClass} ${
                    currentPage === link.page ? 'text-luxury-gold' : ''
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Center Logo */}
          <div className="flex-1 md:flex-none flex justify-center items-center">
            <button 
              onClick={() => onPageChange('home')} 
              className="flex flex-col items-center gap-1 transition duration-300 cursor-pointer py-1"
            >
              <img 
                src="/assets/logo_icon.png" 
                alt="KHRONIQ Logo" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain" 
              />
              <img 
                src="/assets/logo_text.png" 
                alt="KHRONIQ" 
                className="h-4 md:h-5 object-contain" 
              />
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 md:space-x-5 text-white">
            {/* Search Icon / Bar (Desktop Only) */}
            <div className="hidden md:flex relative items-center">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search watches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 sm:w-48 bg-luxury-bg text-luxury-text text-xs px-3 py-1.5 rounded-l-md border border-luxury-text/10 focus:outline-none focus:border-luxury-gold-dark"
                    autoFocus
                  />
                  <button type="submit" className="bg-luxury-gold-dark text-white px-2.5 py-1.5 rounded-r-md border border-luxury-gold-dark hover:bg-luxury-gold transition cursor-pointer">
                    <Search size={14} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 text-luxury-muted hover:text-luxury-text"
                  >
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="transition cursor-pointer hover:text-luxury-gold"
                  title="Search"
                >
                  <Search size={24} />
                </button>
              )}
            </div>

            {/* Profile / Admin Icon (Desktop Only) */}
            <div className="hidden md:flex items-center">
              {currentUser ? (
                <button
                  onClick={() => onPageChange(currentUser.role === 'admin' ? 'admin' : 'profile')}
                  className="flex items-center space-x-1.5 transition cursor-pointer hover:text-luxury-gold"
                  title={currentUser.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                >
                  {currentUser.role === 'admin' ? (
                    <ShieldAlert size={24} className="text-luxury-red" />
                  ) : (
                    <User size={24} />
                  )}
                  <span className="hidden lg:inline text-sm max-w-24 truncate font-bold">
                    {currentUser.name}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={() => onPageChange('login')}
                  className="transition cursor-pointer hover:text-luxury-gold"
                  title="Login"
                >
                  <User size={24} />
                </button>
              )}
            </div>

            {/* Wishlist Icon (Desktop Only) */}
            <button 
              onClick={() => onPageChange(currentUser ? 'profile' : 'login', currentUser ? { tab: 'wishlist' } : null)}
              className="hidden md:block relative transition cursor-pointer hover:text-luxury-gold"
              title="Wishlist"
            >
              <Heart size={24} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-gold-dark text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Currency Selector Dropdown (Desktop Only) */}
            <div className="hidden md:block relative">
              <button 
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:border-luxury-gold hover:text-luxury-gold transition cursor-pointer text-lg font-black"
                title="Select Currency"
              >
                {currencyMap[currentCurrency]?.symbol || '$'}
              </button>
              {currencyOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-[#111111] border border-white/10 rounded shadow-xl py-2 z-50 text-xs text-white font-bold">
                  {Object.entries(currencyMap).map(([code, details]) => (
                    <button
                      key={code}
                      onClick={() => {
                        dispatch(setCurrencyAction(code));
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-white/15 transition cursor-pointer flex justify-between items-center ${
                        currentCurrency === code ? 'text-luxury-gold' : ''
                      }`}
                    >
                      <span>{details.label}</span>
                      {currentCurrency === code && <span className="text-luxury-gold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Icon (Always Visible) */}
            <button 
              onClick={onCartOpen}
              className="relative transition cursor-pointer hover:text-luxury-gold"
              title="Shopping Cart"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-red text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-luxury-text/10 py-4 px-6 space-y-4 flex flex-col">
          {/* Search bar inside mobile drawer */}
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-luxury-text/10 rounded-md p-1.5 mb-2">
            <input
              type="text"
              placeholder="Search watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-luxury-text text-xs px-2 focus:outline-none"
            />
            <button type="submit" className="text-luxury-muted hover:text-luxury-gold p-1">
              <Search size={14} />
            </button>
          </form>

          {/* Navigation links */}
          {navLinks.map((link, idx) => {
            if (link.dropdown) {
              return (
                <div key={idx} className="flex flex-col space-y-1 py-1">
                  <span className="text-left text-xs text-luxury-gold-dark font-extrabold tracking-widest block uppercase pt-2 pb-1 border-b border-white/5">
                    {link.label}
                  </span>
                  {[
                    { label: 'Our Story', view: 'about' },
                    { label: 'Boutique Contact', view: 'contact' },
                    { label: 'Client FAQ', view: 'faq' },
                    { label: 'Blogs & Editorial', view: 'blogs' },
                    { label: 'Legal Policies', view: 'policies' }
                  ].map((sub) => (
                    <button
                      key={sub.view}
                      onClick={() => {
                        onPageChange('static', { view: sub.view });
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-[11px] text-gray-400 hover:text-white transition pl-3 py-1.5 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              );
            }
            return (
              <button
                key={idx}
                onClick={() => handleNavLinkClick(link)}
                className="text-left text-sm text-luxury-text hover:text-luxury-gold-dark transition py-2 font-medium tracking-widest cursor-pointer"
              >
                {link.label}
              </button>
            );
          })}

          {/* Profile & Account options */}
          <div className="pt-2 border-t border-luxury-text/5 flex flex-col space-y-3">
            {currentUser ? (
              <button
                onClick={() => {
                  onPageChange(currentUser.role === 'admin' ? 'admin' : 'profile');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm text-luxury-text font-bold uppercase tracking-wider flex items-center space-x-2"
              >
                <User size={16} />
                <span>{currentUser.role === 'admin' ? 'Admin Portal' : 'My Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onPageChange('login');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm text-luxury-text font-bold uppercase tracking-wider flex items-center space-x-2"
              >
                <User size={16} />
                <span>Login / Register</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => {
                onPageChange(currentUser ? 'profile' : 'login', currentUser ? { tab: 'wishlist' } : null);
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm text-luxury-text font-bold uppercase tracking-wider flex items-center space-x-2"
            >
              <Heart size={16} />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            {/* Currency Selector inside mobile drawer */}
            <div className="py-2">
              <p className="text-[10px] text-luxury-muted uppercase font-bold tracking-wider mb-1.5">Select Currency</p>
              <div className="flex space-x-2">
                {Object.entries(currencyMap).map(([code, details]) => (
                  <button
                    key={code}
                    onClick={() => {
                      dispatch(setCurrencyAction(code));
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded border text-xs font-semibold ${
                      currentCurrency === code 
                        ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold' 
                        : 'border-luxury-text/10 text-luxury-text'
                    }`}
                  >
                    {details.symbol} {code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-left text-sm text-luxury-red hover:text-red-400 transition py-2 font-medium tracking-widest cursor-pointer border-t border-luxury-text/5 pt-3"
            >
              LOGOUT
            </button>
          )}
        </div>
      )}
    </header>
  );
}
