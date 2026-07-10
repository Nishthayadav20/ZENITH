import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, selectCurrentCurrency, formatPrice as formatPriceUtil } from '../store/slices/watchSlice';
import { Paintbrush, ShoppingBag, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Colour & option data ─────────────────────────────────────────────────────
const FALLBACK_DIAL_COLORS = [
  { label: 'Midnight Black', value: '#0a0a0f', textDark: false },
  { label: 'Pearl White',    value: '#f5f0e8', textDark: true  },
  { label: 'Navy Blue',      value: '#1a2a4a', textDark: false },
  { label: 'Forest Green',   value: '#1c3a2a', textDark: false },
  { label: 'Champagne Gold', value: '#c8a96a', textDark: true  },
  { label: 'Crimson Red',    value: '#6b1515', textDark: false },
  { label: 'Beige Dial',     value: '#f5f5dc', textDark: true  },
];

const STRAP_IMAGES = {
  'Tan Leather': '/assets/strap_leather_tan.jpg',
  'Diamond Silver Link': '/assets/strap_silver_diamond.jpg',
  'Classic Gold Chain': '/assets/strap_gold_chain.jpg',
  'Forest Green Rubber': '/assets/strap_rubber_green.jpg',
  'Brushed Steel Link': '/assets/strap_steel_link.jpg',
  'Alligator Leather': '/assets/strap_leather_tan.jpg',
  'Steel Bracelet': '/assets/strap_steel_link.jpg',
  'Rubber Sport': '/assets/strap_rubber_green.jpg',
  'Satin Fabric': '/assets/strap_silver_diamond.jpg',
  'Titanium Mesh': '/assets/strap_steel_link.jpg'
};

const FALLBACK_FINISHES = ['Polished', 'Brushed', 'PVD Black', 'Rose Gold PVD', 'Matte Grey'];

// ─── Utility ─────────────────────────────────────────────────────────────────
function buildOptions(product) {
  const opts = product.customizationOptions || {};
  const dialColors = (opts.dialColors?.length ? opts.dialColors : FALLBACK_DIAL_COLORS.map(d => d.value))
    .map(v => FALLBACK_DIAL_COLORS.find(d => d.value === v) || { label: v, value: v, textDark: false });
  
  // Custom strap options (Women: first three, Men: 1, 4, 5)
  const defaultStraps = product.gender === 'women'
    ? ['Tan Leather', 'Diamond Silver Link', 'Classic Gold Chain']
    : ['Tan Leather', 'Forest Green Rubber', 'Brushed Steel Link'];

  const strapMaterials = [...(opts.strapMaterials?.length ? opts.strapMaterials : defaultStraps)];
  if (opts.customStrapName && !strapMaterials.includes(opts.customStrapName)) {
    strapMaterials.push(opts.customStrapName);
  }
  
  // Custom case finishes
  const caseFinishes = [...(opts.caseFinishes?.length ? opts.caseFinishes : FALLBACK_FINISHES)];
  if (opts.customCaseName && !caseFinishes.includes(opts.customCaseName)) {
    caseFinishes.push(opts.customCaseName);
  }

  const engravingAllowed = opts.engravingAllowed ?? true;
  return { 
    dialColors, 
    strapMaterials, 
    caseFinishes, 
    engravingAllowed,
    customStrapName: opts.customStrapName || '',
    customStrapImage: opts.customStrapImage || '',
    customCaseName: opts.customCaseName || '',
    customCaseColor: opts.customCaseColor || ''
  };
}

// ─── Watch Face Preview ───────────────────────────────────────────────────────
function WatchPreview({ product, dialColor, finish, engraving, strapImage, caseColor }) {
  const finishTone = caseColor || (
    finish?.toLowerCase().includes('black') ? '#1a1a1a'
      : finish?.toLowerCase().includes('rose') ? '#c8856a'
      : finish?.toLowerCase().includes('matte') ? '#555'
      : finish?.toLowerCase().includes('brushed') ? '#888'
      : '#c0c0c0'
  );

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: 300 }}>
      {/* Glow */}
      <div
        className="absolute rounded-full blur-3xl opacity-30 w-56 h-56"
        style={{ background: dialColor?.value || '#c8a96a', zIndex: 1 }}
      />

      {/* Strap band */}
      {strapImage && (
        <div className="absolute animate-fade-in" style={{
          width: 44,
          height: 290,
          backgroundImage: `url(${strapImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 4,
          boxShadow: '0 0 15px rgba(0,0,0,0.6)',
          zIndex: 2
        }} />
      )}

      {/* Lug top */}
      <div className="absolute" style={{ width: 26, height: 28, top: 14, left: '50%', transform: 'translateX(-50%)', background: finishTone, borderRadius: '4px 4px 0 0', opacity: 0.9, zIndex: 3 }} />
      {/* Lug bottom */}
      <div className="absolute" style={{ width: 26, height: 28, bottom: 14, left: '50%', transform: 'translateX(-50%)', background: finishTone, borderRadius: '0 0 4px 4px', opacity: 0.9, zIndex: 3 }} />

      {/* Case / Bezel */}
      <div
        className="relative rounded-full flex items-center justify-center shadow-2xl"
        style={{
          width: 220,
          height: 220,
          background: `radial-gradient(circle at 35% 35%, ${finishTone}dd, ${finishTone}66)`,
          border: `6px solid ${finishTone}`,
          boxShadow: `0 0 40px ${finishTone}55, inset 0 2px 4px rgba(255,255,255,0.15)`,
          zIndex: 4
        }}
      >
        {/* Crystal */}
        <div
          className="rounded-full flex flex-col items-center justify-center overflow-hidden"
          style={{
            width: 178,
            height: 178,
            background: dialColor?.value || '#0a0a0f',
            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: i % 3 === 0 ? 3 : 1.5,
                height: i % 3 === 0 ? 12 : 7,
                background: dialColor?.textDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)',
                borderRadius: 2,
                top: '50%',
                left: '50%',
                transformOrigin: '50% 82px',
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
              }}
            />
          ))}

          {/* Brand name */}
          <span
            className="font-cinzel text-[10px] font-bold tracking-[0.2em] uppercase mt-10"
            style={{ color: dialColor?.textDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }}
          >
            KHRONIQ
          </span>

          {/* Hands */}
          {/* Hour */}
          <div className="absolute" style={{
            width: 3, height: 52, bottom: '50%', left: 'calc(50% - 1.5px)',
            background: dialColor?.textDark ? '#333' : '#fff',
            transformOrigin: 'bottom center',
            transform: 'rotate(-60deg)',
            borderRadius: 2,
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
          }} />
          {/* Minute */}
          <div className="absolute" style={{
            width: 2, height: 70, bottom: '50%', left: 'calc(50% - 1px)',
            background: dialColor?.textDark ? '#555' : '#ddd',
            transformOrigin: 'bottom center',
            transform: 'rotate(100deg)',
            borderRadius: 2,
          }} />
          {/* Seconds */}
          <div className="absolute" style={{
            width: 1, height: 78, bottom: '50%', left: 'calc(50% - 0.5px)',
            background: '#c8a96a',
            transformOrigin: 'bottom center',
            transform: 'rotate(200deg)',
            borderRadius: 1,
          }} />
          {/* Centre dot */}
          <div className="absolute rounded-full" style={{
            width: 8, height: 8, background: '#c8a96a',
            top: 'calc(50% - 4px)', left: 'calc(50% - 4px)',
          }} />

          {/* Engraving */}
          {engraving && (
            <span
              className="absolute bottom-9 text-[7px] tracking-widest italic font-serif"
              style={{ color: dialColor?.textDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)' }}
            >
              {engraving.slice(0, 18)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Customization({ onPageChange, params }) {
  const dispatch = useDispatch();
  const products = useSelector(state => state.watch.products);
  const currentCurrency = useSelector(selectCurrentCurrency);

  const customizableProducts = useMemo(() => {
    const marked = products.filter(p => p.customizable);
    // If no products are marked yet, show all products (all are customizable by default)
    return marked.length > 0 ? marked : products;
  }, [products]);

  const allAreCustomizable = useMemo(
    () => products.every(p => !p.customizable),
    [products]
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialColor,       setDialColor]       = useState(null);
  const [strapMaterial,   setStrapMaterial]   = useState(null);
  const [caseFinish,      setCaseFinish]      = useState(null);
  const [engraving,       setEngraving]       = useState('');
  const [addedToCart,     setAddedToCart]     = useState(false);

  const options = selectedProduct ? buildOptions(selectedProduct) : null;

  // Reset page back to customizable models selection when params.reset is received from Navbar
  useEffect(() => {
    if (params && params.reset) {
      setSelectedProduct(null);
    }
  }, [params]);

  // Currency formatter
  const formatPrice = (usd) => formatPriceUtil(usd, currentCurrency);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    const opts = buildOptions(product);
    setDialColor(opts.dialColors[0] || null);
    setStrapMaterial(product.allowStrapCustomization !== false ? (opts.strapMaterials[0] || null) : (product.specs?.strap || 'Standard Strap'));
    setCaseFinish(product.allowCaseCustomization !== false ? (opts.caseFinishes[0] || null) : (product.specs?.case || 'Standard Finish'));
    setEngraving('');
    setAddedToCart(false);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    const result = await dispatch(addToCart(selectedProduct.id, 1));
    if (result?.success !== false) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    }
  };

  // ── Grid view (no product selected) ─────────────────────────────────────────
  if (!selectedProduct) {
    return (
      <div className="space-y-10 pb-16">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1200 50%, #0a0a0f 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #c8a96a 0%, transparent 60%), radial-gradient(circle at 75% 50%, #c8a96a 0%, transparent 60%)' }} />
          <Paintbrush className="mx-auto mb-4 text-luxury-gold" size={40} />
          <h1 className="font-serif text-4xl font-black tracking-widest text-white uppercase mb-3">
            Bespoke Atelier
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
            Craft your signature timepiece. Select a customizable model below and tailor
            every detail — from dial colour to engraved inscription.
          </p>
        </div>

        {/* Product grid */}
        {customizableProducts.length === 0 ? (
          <div className="border border-dashed border-luxury-text/20 rounded-xl p-20 text-center space-y-4">
            <Sparkles size={36} className="mx-auto text-luxury-gold opacity-40" />
            <p className="text-luxury-muted text-sm">No customizable watches are available at the moment.</p>
            <p className="text-luxury-muted/60 text-xs">Ask an admin to mark watches as customizable in the dashboard.</p>
            <button
              onClick={() => onPageChange('shop')}
              className="mt-4 px-8 py-2.5 bg-luxury-gold-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold transition cursor-pointer rounded"
            >
              Browse All Watches
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-luxury-muted">
                {allAreCustomizable
                  ? `All ${customizableProducts.length} models available for customisation`
                  : `${customizableProducts.length} customisable models`}
              </h2>
              {allAreCustomizable && (
                <span className="text-[10px] text-luxury-gold/60 border border-luxury-gold/20 px-2.5 py-1 rounded">
                  Mark specific watches in Admin to restrict selection
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customizableProducts.map((product) => (
                <motion.button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group text-left bg-[#111111] rounded-xl overflow-hidden border border-white/5 hover:border-luxury-gold/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative overflow-hidden bg-[#0d0d0d]" style={{ height: 200 }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Customizable badge */}
                    <div className="absolute top-3 right-3 bg-luxury-gold-dark text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Paintbrush size={9} />
                      CUSTOMIZABLE
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-[10px] text-luxury-muted uppercase tracking-widest">{product.category}</p>
                    <h3 className="text-white font-bold text-sm leading-tight">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-luxury-gold font-black">{formatPrice(product.price)}</span>
                      <span className="text-[10px] text-luxury-gold-dark border border-luxury-gold-dark/40 px-2.5 py-1 rounded font-bold tracking-wider group-hover:bg-luxury-gold-dark group-hover:text-white transition">
                        CUSTOMISE →
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Customiser view ──────────────────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="customiser"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.35 }}
        className="pb-16"
      >
        {/* Back */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="flex items-center gap-2 text-luxury-muted hover:text-white text-xs font-bold uppercase tracking-widest mb-8 transition cursor-pointer"
        >
          <ChevronLeft size={16} /> All Customizable Models
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── LEFT: Live Preview ── */}
          <div className="space-y-6 sticky top-28">
            <div className="dark-panel bg-[#0d0d0d] rounded-2xl border border-white/5 p-4 sm:p-8 flex flex-col items-center gap-6">
              <WatchPreview
                product={selectedProduct}
                dialColor={dialColor}
                finish={caseFinish}
                engraving={engraving}
                strapImage={strapMaterial === options?.customStrapName ? options?.customStrapImage : (STRAP_IMAGES[strapMaterial] || '')}
                caseColor={caseFinish === options?.customCaseName ? options?.customCaseColor : ''}
              />
              <div className="text-center space-y-1">
                <p className="text-white font-bold text-lg">{selectedProduct.name}</p>
                <p className="text-gray-400 text-xs">{selectedProduct.category} · {selectedProduct.gender}</p>
                <p className="text-luxury-gold font-black text-xl mt-2">{formatPrice(selectedProduct.price)}</p>
              </div>
            </div>

            {/* Summary card */}
            <div className="dark-panel bg-[#111111] rounded-xl border border-white/5 p-5 space-y-3 text-xs text-white/90">
              <p className="text-white font-bold text-[11px] uppercase tracking-widest mb-3">Your Configuration</p>
              {[
                ['Dial Color',     dialColor?.label   || '—', true],
                ['Strap Material', strapMaterial      || '—', selectedProduct.allowStrapCustomization !== false],
                ['Case Finish',    caseFinish         || '—', selectedProduct.allowCaseCustomization !== false],
                ['Engraving',      engraving || 'None',   options.engravingAllowed],
              ].filter(([,, allowed]) => allowed).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-300">{k}</span>
                  <span className="text-white font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Options ── */}
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-3xl font-black text-white tracking-wider">
                Customise Your <br />
                <span className="text-luxury-gold">{selectedProduct.name}</span>
              </h1>
              <p className="text-luxury-muted text-xs mt-2 leading-relaxed">
                Each configuration is unique. Changes are reflected live in the preview.
              </p>
            </div>

            {/* Dial Color */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted">
                Dial Color — <span className="text-white">{dialColor?.label}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {options.dialColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setDialColor(color)}
                    title={color.label}
                    className="relative w-10 h-10 rounded-full border-2 transition-all duration-200 cursor-pointer"
                    style={{
                      background: color.value,
                      borderColor: dialColor?.value === color.value ? '#c8a96a' : 'transparent',
                      boxShadow: dialColor?.value === color.value ? '0 0 0 3px rgba(200,169,106,0.3)' : 'none',
                    }}
                  >
                    {dialColor?.value === color.value && (
                      <Check size={14} className="absolute inset-0 m-auto" style={{ color: color.textDark ? '#000' : '#fff' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Strap Material */}
            {selectedProduct.allowStrapCustomization !== false && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted">
                  Strap Option
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {options.strapMaterials.map((mat) => {
                    const imgUrl = (mat === options.customStrapName && options.customStrapImage) 
                      ? options.customStrapImage 
                      : (STRAP_IMAGES[mat] || '/assets/strap_leather_tan.jpg');
                    return (
                      <button
                        key={mat}
                        onClick={() => setStrapMaterial(mat)}
                        className={`flex flex-col items-center p-2.5 rounded border transition-all cursor-pointer bg-luxury-dark/40 ${
                          strapMaterial === mat
                            ? 'border-luxury-gold text-luxury-gold shadow-[0_0_15px_rgba(200,169,106,0.1)]'
                            : 'border-white/5 text-luxury-muted hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="w-full h-20 bg-luxury-dark/80 rounded border border-white/5 overflow-hidden flex items-center justify-center p-1.5 mb-2">
                          <img
                            src={imgUrl}
                            alt={mat}
                            className="max-h-full max-w-full object-contain rounded-sm"
                          />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-center leading-tight">
                          {mat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Case Finish */}
            {selectedProduct.allowCaseCustomization !== false && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted">
                  Case Finish — <span className="text-white">{caseFinish}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {options.caseFinishes.map((fin) => (
                    <button
                      key={fin}
                      onClick={() => setCaseFinish(fin)}
                      className={`px-3 py-2 text-xs font-bold rounded border transition-all cursor-pointer ${
                        caseFinish === fin
                          ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                          : 'border-white/10 text-luxury-muted hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {fin}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Engraving */}
            {options.engravingAllowed && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted">
                  Personal Engraving <span className="text-white/30">(optional)</span>
                </h3>
                <input
                  type="text"
                  maxLength={18}
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  placeholder="Your inscription…"
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition font-serif italic"
                />
                <p className="text-[10px] text-luxury-muted/50">{engraving.length}/18 characters</p>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-luxury-gold-dark hover:bg-luxury-gold text-white'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={18} /> Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add Custom Piece to Bag
                </>
              )}
            </button>

            <p className="text-[10px] text-luxury-muted/50 text-center leading-relaxed">
              Customized pieces are handcrafted to order and may take 4–6 weeks for delivery.
              Returns are not accepted on personalized items.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
