import React, { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';

export default function UpdatesDrawer({ isOpen, onClose }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchUpdates = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch('/api/brand-updates');
        const data = await res.json();
        if (data && data.success) {
          setUpdates(data.updates || []);
        } else {
          setErrorMsg(data.message || 'Failed to fetch updates.');
        }
      } catch (err) {
        console.error('Error fetching brand updates:', err);
        setErrorMsg('Network error. Failed to load updates.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/75 z-50"
        />
      )}

      {/* Sliding Drawer Panel (from Left) */}
      <div
        className={`fixed left-0 top-0 h-full w-[22rem] sm:w-[26rem] z-50 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col border-r border-white/10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.92), rgba(0,0,0,0.96)), url('/assets/t6.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#000000',
        }}
      >
        {/* Drawer Header */}
        <div className="flex justify-end items-center border-b border-white/10 p-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1 hover:bg-white/5 rounded-full cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {errorMsg && (
            <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded text-[10px] uppercase font-bold tracking-wider">
              {errorMsg}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-gold"></div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-3">Loading updates...</p>
            </div>
          )}

          {!loading && !errorMsg && updates.length === 0 && (
            <div className="text-center py-12 text-gray-400 uppercase tracking-wider text-xs">
              No updates available at the moment.
            </div>
          )}

          {!loading && !errorMsg && updates.length > 0 && (
            <ul className="space-y-6">
              {updates.map((item, idx) => (
                <li
                  key={item._id || idx}
                  className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mt-2 flex-shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="text-sm font-bold uppercase text-white tracking-wider">
                      {item.title}
                    </h4>
                    <p className="text-gray-300 text-xs leading-relaxed font-light whitespace-pre-line">
                      {item.detail}
                    </p>
                    {item.createdAt && (
                      <p className="text-[9px] text-luxury-gold/70 font-semibold tracking-wider uppercase pt-1">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
