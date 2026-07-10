import React, { useState } from 'react';
import { X, ShieldCheck, User, QrCode, Search, Award, CheckCircle } from 'lucide-react';

export default function WarrantyDrawer({ isOpen, onClose }) {
  // Step tracker: 'details' -> 'watch-select' -> 'verified'
  const [step, setStep] = useState('details');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Watch selection variables
  const [watchSearchText, setWatchSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  
  // Custom inputs for codes
  const [serialCode, setSerialCode] = useState('');
  const [specialClaimCode, setSpecialClaimCode] = useState('');

  const [verificationResult, setVerificationResult] = useState(null);

  // Retrieve purchases via API
  const handleRetrievePurchases = async (e) => {
    e.preventDefault();
    if (!ownerName.trim() || !ownerEmail.trim()) {
      setErrorMsg('Name and email are required.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/warranty/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: ownerName, userEmail: ownerEmail })
      });
      const data = await response.json();
      
      if (data.success) {
        setPurchases(data.purchases || []);
        setStep('watch-select');
      } else {
        setErrorMsg(data.message || 'Could not retrieve purchases.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter purchases by text typed
  const suggestions = watchSearchText.trim().length >= 1
    ? purchases.filter(p => p.name.toLowerCase().includes(watchSearchText.toLowerCase()))
    : purchases; // Show all if empty but focused

  // Handle selecting a watch from dropdown
  const handleSelectWatch = (purchase) => {
    setWatchSearchText(purchase.name);
    setSelectedPurchase(purchase);
    setSerialCode(purchase.serialNumber);
    setSpecialClaimCode(''); // Leave empty so user puts the special code manually
    setShowDropdown(false);
    setErrorMsg('');
  };

  // Submit claim warranty
  const handleClaimWarranty = async (e) => {
    e.preventDefault();
    if (!selectedPurchase || !serialCode.trim() || !specialClaimCode.trim()) {
      setErrorMsg('Please select a watch and fill out serial / claim codes.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/warranty/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: ownerName,
          userEmail: ownerEmail,
          watchName: selectedPurchase.name,
          serialNumber: serialCode,
          specialCode: specialClaimCode
        })
      });
      const data = await response.json();
      if (data.success) {
        setVerificationResult(data.details);
        setStep('verified');
      } else {
        setErrorMsg(data.message || 'Warranty verification failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const resetDrawer = () => {
    setStep('details');
    setOwnerName('');
    setOwnerEmail('');
    setPurchases([]);
    setWatchSearchText('');
    setSelectedPurchase(null);
    setSerialCode('');
    setSpecialClaimCode('');
    setVerificationResult(null);
    setErrorMsg('');
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        />
      )}

      {/* Sliding Drawer Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 sm:w-96 bg-neutral-950 border-l border-white/10 z-50 shadow-2xl p-6 transition-transform duration-300 ease-in-out transform flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Drawer Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6" style={{ color: '#ffbc8b' }} />
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#ffbc8b' }}>Warranty Portal</h3>
          </div>
          <button 
            onClick={onClose} 
            className="hover:text-white/80 transition p-1 hover:bg-white/5 rounded-full cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <X size={18} style={{ color: '#ffffff' }} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
          
          {errorMsg && (
            <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded text-[10px] uppercase font-bold tracking-wider">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Enter Name & Email */}
          {step === 'details' && (
            <form onSubmit={handleRetrievePurchases} className="space-y-4 text-sm">
              <p className="text-xs leading-relaxed font-normal uppercase tracking-wider" style={{ color: '#ffbc8b' }}>
                Enter your billing details to retrieve your watch purchases from the manufacture database.
              </p>

              {/* Owner Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#ffbc8b' }}>Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <User size={12} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter owner name..."
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full warranty-portal-input rounded p-2.5 pl-8 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Owner Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#ffbc8b' }}>Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <QrCode size={12} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Enter owner email..."
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full warranty-portal-input rounded p-2.5 pl-8 focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-luxury-gold hover:bg-luxury-gold-dark disabled:bg-gray-700 disabled:text-gray-400 text-neutral-950 font-bold text-sm uppercase tracking-widest rounded transition cursor-pointer"
              >
                {loading ? 'Retrieving Records...' : 'Retrieve Purchased Watches'}
              </button>
            </form>
          )}

          {/* STEP 2: Select Watch & Verify Codes */}
          {step === 'watch-select' && (
            <form onSubmit={handleClaimWarranty} className="space-y-4 text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <p className="text-xs uppercase tracking-widest font-bold" style={{ color: '#ffbc8b' }}>Billing matches: {purchases.length} Found</p>
                <button 
                  type="button" 
                  onClick={() => setStep('details')}
                  className="hover:underline text-xs uppercase font-bold"
                  style={{ color: '#ffbc8b' }}
                >
                  Change Owner
                </button>
              </div>

              {/* Watch Name Dropdown Input */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#ffbc8b' }}>Name of Watch</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Start typing to select watch..."
                    value={watchSearchText}
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                      setWatchSearchText(e.target.value);
                      setShowDropdown(true);
                      setSelectedPurchase(null);
                    }}
                    className="w-full warranty-portal-input rounded p-2.5 focus:outline-none transition"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <Search size={14} />
                  </span>
                </div>

                {/* Suggestions Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl max-h-40 overflow-y-auto z-[60] scrollbar-thin">
                    {suggestions.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectWatch(p)}
                        className="w-full text-left px-3 py-2 text-xs text-neutral-900 hover:bg-gray-100 transition border-b border-gray-100 last:border-0 cursor-pointer flex items-center justify-between"
                      >
                        <span>{p.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{p.orderId}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Watch Image Display Area */}
              {selectedPurchase && (
                <div className="bg-neutral-900/80 border border-white/20 rounded p-3 flex items-center space-x-3 animate-scale-in">
                  <img 
                    src={selectedPurchase.image} 
                    alt={selectedPurchase.name} 
                    className="w-14 h-14 object-cover rounded bg-black/40 border border-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#ffbc8b' }}>Purchase Match</p>
                    <p className="font-bold truncate text-xs" style={{ color: '#ffffff' }}>{selectedPurchase.name}</p>
                    <p className="text-[10px]" style={{ color: '#ffbc8b' }}>Purchased on {selectedPurchase.date}</p>
                  </div>
                </div>
              )}

              {/* Serial Code */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#ffbc8b' }}>Serial Code of Purchase</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SN-Z-XXXXXXXX"
                  value={serialCode}
                  onChange={(e) => setSerialCode(e.target.value)}
                  className="w-full warranty-portal-input rounded p-2.5 focus:outline-none transition font-mono uppercase"
                />
              </div>

              {/* Special Code to Claim Warranty */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#ffbc8b' }}>Special Code to Claim Warranty</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CLM-Z-XXXXXXXX"
                  value={specialClaimCode}
                  onChange={(e) => setSpecialClaimCode(e.target.value)}
                  className="w-full warranty-portal-input rounded p-2.5 focus:outline-none transition font-mono uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedPurchase}
                className="w-full py-2.5 bg-luxury-gold hover:bg-luxury-gold-dark disabled:bg-gray-700 disabled:text-gray-400 text-neutral-950 font-bold text-sm uppercase tracking-widest rounded transition cursor-pointer"
              >
                {loading ? 'Verifying Codes...' : 'Claim & Activate Warranty'}
              </button>
            </form>
          )}

          {/* STEP 3: Verification Result Card */}
          {step === 'verified' && verificationResult && (
            <div className="space-y-5 animate-scale-in text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <CheckCircle className="w-12 h-12" style={{ color: '#ffffff' }} />
                <h4 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#ffffff' }}>Warranty Claimed</h4>
                <p className="text-xs font-mono tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full" style={{ color: '#ffffff' }}>
                  Status: {verificationResult.status}
                </p>
              </div>

              <div className="bg-neutral-900 border border-white/10 rounded p-4 text-left space-y-2.5 text-xs leading-relaxed">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Watch Owner</span>
                  <span className="font-medium" style={{ color: '#ffffff' }}>{verificationResult.registeredTo}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Model</span>
                  <span className="font-medium" style={{ color: '#ffffff' }}>{verificationResult.watchModel}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Purchase Serial</span>
                  <span className="font-mono" style={{ color: '#ffffff' }}>{verificationResult.serialNumber}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Warranty Claim Code</span>
                  <span className="font-mono" style={{ color: '#ffffff' }}>{verificationResult.claimCode}</span>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <span className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Expiration Date</span>
                  <span className="font-bold" style={{ color: '#ffffff' }}>{verificationResult.expiryDate}</span>
                </div>
              </div>

              <button
                onClick={resetDrawer}
                className="w-full py-2 bg-neutral-900 border border-white/15 hover:border-white/35 text-white font-bold text-sm uppercase tracking-widest rounded transition cursor-pointer"
              >
                Register Another Watch
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
