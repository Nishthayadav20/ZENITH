import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { X, ShieldCheck, User, QrCode } from 'lucide-react';

export default function WarrantyDrawer({ isOpen, onClose }) {
  const products = useSelector(state => state.watch.products);
  const [watchName, setWatchName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [ownerDetail, setOwnerDetail] = useState('');
  const [warrantyCode, setWarrantyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  // Suggestions based on search
  const suggestions = watchName.trim().length >= 1
    ? products.filter(p => p.name.toLowerCase().includes(watchName.toLowerCase()))
    : [];

  const handleVerify = (e) => {
    e.preventDefault();
    if (!watchName || !ownerDetail || !warrantyCode) {
      alert('Please fill out all fields to verify.');
      return;
    }
    setVerificationResult({
      status: 'Active',
      expires: 'July 2029',
      owner: ownerDetail,
      code: warrantyCode.toUpperCase()
    });
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
            <ShieldCheck className="text-luxury-gold w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Warranty Activation</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition p-1 hover:bg-white/5 rounded-full cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
          <p className="text-[10px] text-gray-400 leading-relaxed font-light uppercase tracking-wider">
            Register your luxury KHRONIQ timepiece below to activate your premium 3-year international warranty.
          </p>

          <form onSubmit={handleVerify} className="space-y-4 text-xs">
            {/* Watch Name Input */}
            <div className="space-y-1.5 relative">
              <label className="text-[8px] text-gray-500 font-bold uppercase tracking-widest block">Name of Watch</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Type to search watch models..."
                  value={watchName}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setWatchName(e.target.value);
                    setShowDropdown(true);
                    setSelectedWatch(null);
                    setVerificationResult(null);
                  }}
                  className="w-full bg-neutral-900 border border-white/10 rounded text-white p-2.5 focus:outline-none focus:border-luxury-gold transition"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-neutral-900 border border-white/10 rounded-md shadow-2xl max-h-40 overflow-y-auto z-[60] scrollbar-thin">
                  {suggestions.map(p => (
                    <button
                      key={p.id || p._id}
                      type="button"
                      onClick={() => {
                        setWatchName(p.name);
                        setSelectedWatch(p);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[10px] text-gray-300 hover:bg-luxury-gold/10 hover:text-luxury-gold transition border-b border-white/5 last:border-0 cursor-pointer"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Watch Card */}
            {selectedWatch && (
              <div className="bg-neutral-900/80 border border-luxury-gold/20 rounded p-3 flex items-center space-x-3 animate-scale-in">
                <img 
                  src={selectedWatch.image} 
                  alt={selectedWatch.name} 
                  className="w-14 h-14 object-cover rounded bg-black/40 border border-white/5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-wider">Watch Selected</p>
                  <p className="text-white font-bold truncate text-[11px]">{selectedWatch.name}</p>
                  <p className="text-gray-500 text-[9px]">{selectedWatch.specs?.movement || 'Automatic'}</p>
                </div>
              </div>
            )}

            {/* Owner Detail Input */}
            <div className="space-y-1.5">
              <label className="text-[8px] text-gray-500 font-bold uppercase tracking-widest block">Owner Detail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <User size={12} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe / john@example.com"
                  value={ownerDetail}
                  onChange={(e) => setOwnerDetail(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded text-white p-2.5 pl-8 focus:outline-none focus:border-luxury-gold transition"
                />
              </div>
            </div>

            {/* Warranty Special Code Input */}
            <div className="space-y-1.5">
              <label className="text-[8px] text-gray-500 font-bold uppercase tracking-widest block">Warranty Special Code</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <QrCode size={12} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. KHR-8829-2026"
                  value={warrantyCode}
                  onChange={(e) => setWarrantyCode(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded text-white p-2.5 pl-8 focus:outline-none focus:border-luxury-gold transition"
                />
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-dark font-bold text-xs uppercase tracking-widest rounded transition cursor-pointer"
            >
              Verify & Register
            </button>
          </form>

          {/* Verification Result Card */}
          {verificationResult && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-4 space-y-2 animate-scale-in text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ShieldCheck size={16} />
                <span className="uppercase tracking-wider text-[10px]">Warranty Certified</span>
              </div>
              <div className="space-y-1 text-gray-300 font-light text-[10px] leading-relaxed">
                <p><strong className="text-white font-medium">Owner:</strong> {verificationResult.owner}</p>
                <p><strong className="text-white font-medium">Code:</strong> {verificationResult.code}</p>
                <p><strong className="text-white font-medium">Status:</strong> <span className="text-emerald-400 font-bold">Active</span></p>
                <p><strong className="text-white font-medium">Expiration:</strong> {verificationResult.expires}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
