import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import LogoMark from '../components/LogoMark';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
  animate,
  useScroll,
  AnimatePresence,
} from 'framer-motion';
import { Star, Award, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Play, Pause, Cpu, Layers, Droplet, Clock, Gem } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────────────── */
function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const n = parseFloat(value.replace(/[^0-9.]/g, ''));
    const c = animate(0, n, {
      duration, ease: 'easeOut',
      onUpdate(v) { setDisplay(Number.isInteger(n) ? Math.round(v) : v.toFixed(1)); },
    });
    return c.stop;
  }, [inView, value, duration]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────────────
   FLOATING PARTICLE
───────────────────────────────────────────────────────────────────── */
function FloatingParticle({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -26, 0], x: [0, 10, -7, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
      transition={{ duration: style.dur || 6, repeat: Infinity, ease: 'easeInOut', delay: style.del || 0 }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, dir = 'up', distance = 48, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const variants = {
    up:    { hidden: { opacity: 0, y: distance },  visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -distance }, visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: distance },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -distance }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.80 },  visible: { opacity: 1, scale: 1 } },
    flip:  { hidden: { opacity: 0, rotateX: 55 },  visible: { opacity: 1, rotateX: 0 } },
  };
  return (
    <motion.div ref={ref} variants={variants[dir]} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   CLIP-SLIDE TEXT REVEAL
───────────────────────────────────────────────────────────────────── */
function SlideReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '105%' }}
        animate={inView ? { y: '0%' } : { y: '105%' }}
        transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────────────────────────────── */
function MagBtn({ children, className, onClick, style = {} }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 20 });
  const sy = useSpring(y, { stiffness: 280, damping: 20 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  return (
    <motion.button ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ ...style, x: sx, y: sy }} whileTap={{ scale: 0.94 }}
      className={className} onClick={onClick}>{children}</motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MARQUEE
───────────────────────────────────────────────────────────────────── */
function Marquee({ items, speed = 20, reverse = false }) {
  return (
    <div className="overflow-hidden py-4 border-y border-luxury-text/8 bg-white/70 backdrop-blur-sm select-none">
      <motion.div className="flex gap-14 whitespace-nowrap"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[11px] font-bold tracking-[0.22em] uppercase text-luxury-muted flex items-center gap-3">
            <Star size={7} fill="currentColor" className="text-black/30" />{item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   GENDER PANEL — full mouse-tracking parallax inside the card
───────────────────────────────────────────────────────────────────── */
function GenderPanel({ label, img, gender, delay, accent, onPageChange }) {
  const panelRef = useRef(null);

  /* Raw mouse position -1..1 relative to panel */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const [hovered, setHovered] = useState(false);

  /* Spring config — ultra‑smooth glide */
  const cfg = { stiffness: 30, damping: 30, mass: 1.2 };
  const smx = useSpring(mx, cfg);
  const smy = useSpring(my, cfg);

  /* Image moves in the DIRECTION of mouse (follow) */
  const imgX = useTransform(smx, [-1, 1], ['-22px', '22px']);
  const imgY = useTransform(smy, [-1, 1], ['-14px', '14px']);

  /* Text lifts opposite — creates depth */
  const txtY = useTransform(smy, [-1, 1], ['8px', '-8px']);

  /* Overlay brightness reacts to horizontal position */
  const overlayOp = useTransform(smx, [-1, 1], [0.65, 0.5]);

  const handleMove = useCallback((e) => {
    const r = panelRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }, [mx, my]);

  const handleLeave = useCallback(() => {
    mx.set(0); my.set(0); setHovered(false);
  }, [mx, my]);

  return (
    <motion.div
      ref={panelRef}
      onClick={() => onPageChange('shop', { gender })}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className="dark-panel relative h-[600px] overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      {/* ── Image — follows mouse direction ── */}
      <motion.div
        className="absolute inset-[-5%] bg-cover bg-center"
        style={{
          backgroundImage: `url('${img}')`,
          x: imgX,
          y: imgY,
        }}
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Dark gradient overlay ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)',
          opacity: overlayOp,
        }}
      />

      {/* ── Colour tint wash — fades in on hover ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accent}18 0%, transparent 60%)` }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.65 }}
      />

      {/* ── Shimmer sweep — fires once on enter ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.13) 50%, transparent 60%)',
        }}
        animate={hovered ? { x: ['−100%', '200%'] } : { x: '-100%' }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
      />

      {/* ── Text block — parallax lift ── */}
      <motion.div
        className="absolute bottom-0 left-0 w-full p-8 sm:p-12 space-y-4 z-10"
        style={{ y: txtY }}
      >
        <motion.h3
          className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase drop-shadow-xl"
          animate={{ y: hovered ? -4 : 0, letterSpacing: hovered ? '0.08em' : '0.05em' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {label}
        </motion.h3>

        <motion.div
          className="flex items-center gap-2 text-white text-xs font-bold tracking-widest uppercase overflow-hidden"
          animate={{ opacity: hovered ? 1 : 0.7, x: hovered ? 0 : -6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            onClick={(e) => { e.stopPropagation(); onPageChange('shop', { gender }); }}
            className="flex items-center gap-2 border-b pb-0.5 w-fit"
            style={{ borderColor: accent }}
            whileHover={{ gap: 14 }}
            transition={{ duration: 0.35 }}
          >
            Discover <ArrowRight size={12} />
          </motion.button>
        </motion.div>
      </motion.div>


    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   COLLECTION CARD — mouse-tracking tilt per card
───────────────────────────────────────────────────────────────────── */
function CollectionCard({ col, idx, onPageChange }) {
  const [hovered, setHovered] = useState(false);

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu': return <Cpu size={12} className="shrink-0" />;
      case 'Gem': return <Gem size={12} className="shrink-0" />;
      case 'Droplet': return <Droplet size={12} className="shrink-0" />;
      case 'Layers': return <Layers size={12} className="shrink-0" />;
      case 'Clock': return <Clock size={12} className="shrink-0" />;
      default: return <Cpu size={12} className="shrink-0" />;
    }
  };

  const bgClass = col.dark ? 'bg-[#0c0c0c] text-white' : 'bg-[#e7e4dc] text-neutral-900 border border-black/5';
  const numColor = '#047857'; // Swadeshi green (box color of warranty)
  const descClass = col.dark ? 'text-gray-100 font-bold' : 'text-neutral-950 font-bold';
  const specTextClass = col.dark ? 'text-white font-extrabold' : 'text-neutral-950 font-extrabold';

  const enterAnims = [
    { hidden: { opacity: 0, x: -70 }, visible: { opacity: 1, x: 0 } },
    { hidden: { opacity: 0, y: 80, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } },
    { hidden: { opacity: 0, x: 70 }, visible: { opacity: 1, x: 0 } },
  ];

  return (
    <motion.div
      onClick={() => onPageChange('shop', col.filter)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variants={enterAnims[idx]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.85, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`relative h-[360px] sm:h-[420px] md:h-[450px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden cursor-pointer shadow-md transition-shadow duration-300 hover:shadow-2xl ${bgClass}`}
    >
      {/* Background Watch Image overlapping on the right */}
      <div 
        className="absolute bottom-0 right-[-18%] w-[76%] h-[90%] bg-contain bg-no-repeat bg-bottom transition-transform duration-700 pointer-events-none z-10"
        style={{ 
          backgroundImage: `url('${col.image}')`,
          transform: hovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
          filter: col.dark ? 'brightness(0.95)' : 'none',
        }}
      />
      
      {/* Content Container (relative z-20 to display over background) */}
      <div className="relative z-20 flex flex-col justify-between h-full max-w-[65%]">
        
        {/* Top: Num & Header */}
        <div className="space-y-3">
          <span className="text-[10px] sm:text-xs font-black tracking-[0.25em]" style={{ color: col.dark ? '#ffffff' : numColor }}>
            {col.num} —
          </span>
          <div className="space-y-1 sm:space-y-1.5">
            <h3 className="font-serif text-xl sm:text-2xl font-black uppercase tracking-wider leading-tight">
              {col.name}
            </h3>
            <p className="text-[8px] sm:text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: col.dark ? '#ffffff' : numColor }}>
              {col.tagline}
            </p>
          </div>
          <p className={`text-[10px] sm:text-xs leading-relaxed ${descClass}`}>
            {col.desc}
          </p>
        </div>

        {/* Middle: Divider + Specs */}
        <div className="space-y-3 pt-4 border-t border-black/5">
          <div className="space-y-2">
            {col.specs.map((spec, i) => (
              <div key={i} className={`flex items-center space-x-2 text-[9px] sm:text-[10px] ${specTextClass}`}>
                <span style={{ color: col.dark ? '#ffffff' : numColor }}>{renderIcon(spec.icon)}</span>
                <span style={{ color: col.dark ? '#ffffff' : 'inherit' }}>{spec.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Explore Collection */}
        <div 
          className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black tracking-widest uppercase mt-4"
          style={{ color: col.dark ? '#ffffff' : numColor }}
        >
          <span>Explore Collection</span>
          <ArrowRight size={10} style={{ color: col.dark ? '#ffffff' : numColor }} />
        </div>

      </div>

      {/* Circular Arrow Button in bottom right corner */}
      <div 
        className="absolute bottom-6 right-6 w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 z-20"
        style={{ 
          borderColor: col.dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          backgroundColor: hovered ? numColor : 'transparent',
          color: hovered ? '#ffffff' : (col.dark ? '#ffffff' : '#000000'),
          transform: hovered ? 'rotate(-45deg)' : 'none',
        }}
      >
        <ArrowRight size={14} className="stroke-[2.5]" />
      </div>

    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   HERO VIDEO CYCLER — plays video 1 → video 2 → video 1 … muted, no loop
───────────────────────────────────────────────────────────────────── */
const HERO_VIDEOS = ['/assets/hero_video_1.mp4', '/assets/hero_video_2.mp4'];

function HeroVideoCycler() {
  const [vidIdx, setVidIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const vRef = useRef(null);

  const handleEnded = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setVidIdx(i => (i + 1) % HERO_VIDEOS.length);
      setFade(true);
    }, 350);
  }, []);

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [vidIdx]);

  return (
    <video
      ref={vRef}
      key={vidIdx}
      muted
      playsInline
      onEnded={handleEnded}
      className="object-cover w-full h-full brightness-[0.87]"
      style={{ objectPosition: '30% 50%', opacity: fade ? 1 : 0, transition: 'opacity 0.35s ease' }}
    >
      <source src={HERO_VIDEOS[vidIdx]} type="video/mp4" />
    </video>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════════ */
/* ─────────────────────────────────────────────────────────────────────
   LIFESTYLE SHOWCASE SLIDER
───────────────────────────────────────────────────────────────────── */
function LifestyleShowcaseSlider({ products, onPageChange, homeImages }) {
  const slides = [
    {
      name: 'CRIMSON RED',
      fullName: 'Khroniq Crimson Red',
      lifestyleImg: homeImages.hero_slide1_lifestyle || '/assets/lifestyle_red.png',
      productImg: homeImages.hero_slide1_product || '/assets/watch_red.jpg',
      lifestyleStyle: { filter: 'brightness(0.82) contrast(1.1) saturate(1.05)', backgroundPosition: 'center 40%' },
    },
    {
      name: 'EMERALD GREEN',
      fullName: 'Khroniq Emerald Green',
      lifestyleImg: homeImages.hero_slide2_lifestyle || '/assets/lifestyle_green.png',
      productImg: homeImages.hero_slide2_product || '/assets/watch_green.jpg',
      lifestyleStyle: { filter: 'brightness(0.78) contrast(1.12) saturate(1.08)', backgroundPosition: 'center 35%' },
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);


  const handlePrev = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentSlide = slides[activeIndex];

  const handleDetailsClick = () => {
    const matched = products.find(p => p.name === currentSlide.fullName);
    if (matched) {
      onPageChange('product-detail', { id: matched.id || matched._id });
    } else {
      onPageChange('shop');
    }
  };

  return (
    <section className="w-full bg-white border-t border-luxury-text/8">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[550px] lg:h-[650px] overflow-hidden">
        
        {/* Left Column: Lifestyle Image Showcase */}
        <div className="relative overflow-hidden h-[450px] lg:h-full bg-neutral-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={`lifestyle-${activeIndex}`}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${currentSlide.lifestyleImg}')`, ...currentSlide.lifestyleStyle }}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent z-[1]" />
        </div>

        {/* Right Column: Split Product Showcase & Controls */}
        <div className="flex flex-col h-[550px] lg:h-full">
          
          {/* Top Half: Black Product Display */}
          <div className="relative bg-black flex-1 flex items-center justify-center overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`product-container-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <motion.img
                  src={currentSlide.productImg}
                  alt={currentSlide.name}
                  animate={isPlaying ? {
                    y: [0, -6, 0],
                    rotate: [0, 1.2, -1.2, 0]
                  } : {
                    y: 0,
                    rotate: 0
                  }}
                  transition={{
                    y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: 12, ease: "easeInOut" }
                  }}
                  className="max-w-[65%] max-h-[90%] object-contain filter drop-shadow-[0_15px_30px_rgba(255,255,255,0.18)]"
                />
              </motion.div>
            </AnimatePresence>

            <button
              onClick={togglePlay}
              className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition duration-300 shadow-md cursor-pointer"
              aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
          </div>

          {/* Bottom Half: Details & Navigation */}
          <div className="p-8 lg:p-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white border-t border-black/5 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black/95 rounded-sm p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                <img 
                  src={currentSlide.productImg} 
                  alt={currentSlide.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg font-bold text-black tracking-widest uppercase">
                  {currentSlide.name}
                </h3>
                <button
                  onClick={handleDetailsClick}
                  className="text-xs font-bold text-luxury-gold-dark hover:text-neutral-500 transition duration-200 underline underline-offset-4 tracking-widest uppercase cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrev}
                className={`w-12 h-12 flex items-center justify-center border border-black/15 hover:border-black transition duration-300 font-bold cursor-pointer rounded-sm ${
                  activeIndex === 2 ? 'bg-white text-black' : 'bg-black text-white hover:bg-neutral-800'
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-black tracking-[0.25em] text-neutral-800 min-w-[45px] text-center">
                {activeIndex + 1} / {slides.length}
              </span>
              <button 
                onClick={handleNext}
                className={`w-12 h-12 flex items-center justify-center border border-black/15 hover:border-black transition duration-300 font-bold cursor-pointer rounded-sm ${
                  activeIndex === 2 ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black'
                }`}
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default function Home({ onPageChange, onUpdatesOpen, onUpdatesClose, updatesOpen }) {
  const products = useSelector(state => state.watch.products);
  const [homeImages, setHomeImages] = useState({});

  useEffect(() => {
    fetch('/api/admin/media/public')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHomeImages(data.media);
      })
      .catch(err => console.error('Failed to fetch homepage media:', err));
  }, []);

  /* ── Hero unified parallax ── */
  const heroRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spr = { stiffness: 55, damping: 16, mass: 0.8 };
  const spX = useSpring(rawX, spr);
  const spY = useSpring(rawY, spr);

  /* ALL content moves together in the cursor direction */
  const contentX = useTransform(spX, [-1, 1], ['-22px', '22px']);
  const contentY = useTransform(spY, [-1, 1], ['-13px', '13px']);

  /* Video drifts opposite (depth layer) */
  const vidX = useTransform(spX, [-1, 1], ['14px', '-14px']);
  const vidY = useTransform(spY, [-1, 1], ['9px', '-9px']);

  /* Orb moves more opposite (furthest layer) */
  const orbX = useTransform(spX, [-1, 1], ['55px', '-55px']);
  const orbY = useTransform(spY, [-1, 1], ['32px', '-32px']);

  const { scrollY } = useScroll();
  const scrollFade = useTransform(scrollY, [0, 180], [1, 0]);

  // Featured Collection split curtain animation variables
  const curtainSectionRef = useRef(null);
  const isFeaturedInView = useInView(curtainSectionRef, { once: false, amount: 0.15 });

  const onMouseMove = useCallback((e) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }, [rawX, rawY]);
  const onMouseLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  // --- CAROUSEL SLIDER STATE & LOGIC ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [showUpdates, setShowUpdates] = useState(true);
  const [brandUpdates, setBrandUpdates] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const updatesRef = useRef(null);
  const updatesInView = useInView(updatesRef, { once: false, margin: '-40%' });

  const hoverTimeoutRef = useRef(null);

  const handleHoverStart = (product) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredProduct(product);
  };

  const handleHoverEnd = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredProduct(null);
      hoverTimeoutRef.current = null;
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch('/api/brand-updates');
        const data = await res.json();
        if (data && data.success) {
          setBrandUpdates(data.updates);
        }
      } catch (err) {
        console.error("Error fetching brand updates:", err);
      }
    };
    fetchUpdates();
  }, []);

  const [hasClosedSinceInView, setHasClosedSinceInView] = useState(false);
  const prevUpdatesOpenRef = useRef(updatesOpen);

  useEffect(() => {
    if (!updatesInView) {
      setHasClosedSinceInView(false);
    }
  }, [updatesInView]);

  useEffect(() => {
    if (prevUpdatesOpenRef.current && !updatesOpen && updatesInView) {
      setHasClosedSinceInView(true);
    }
    prevUpdatesOpenRef.current = updatesOpen;
  }, [updatesOpen, updatesInView]);

  useEffect(() => {
    let timer;
    if (updatesInView && brandUpdates && brandUpdates.length > 0 && !hasClosedSinceInView && !updatesOpen) {
      timer = setTimeout(() => {
        if (onUpdatesOpen) {
          onUpdatesOpen();
        }
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [updatesInView, brandUpdates, onUpdatesOpen, hasClosedSinceInView, updatesOpen]);

  const displayedUpdates = brandUpdates;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleCards);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (products.length <= visibleCards) return;
    const timer = setInterval(nextSlide, 1600);
    return () => clearInterval(timer);
  }, [nextSlide, visibleCards, products.length, currentIndex]);

  const featured = products;

  const collections = [
    {
      num: '01',
      name: 'KHRONOMASTER',
      tagline: 'HIGH-FREQUENCY CHRONOGRAPHS',
      desc: 'Engineered for precision. Built for performance.',
      image: homeImages.collection_khronomaster || '/assets/watch_green.jpg',
      specs: [
        { label: 'Automatic Movement', icon: 'Cpu' },
        { label: 'Sapphire Crystal', icon: 'Gem' }
      ],
      dark: false,
      filter: { category: 'Khronomaster' }
    },
    {
      num: '02',
      name: 'DEFY',
      tagline: 'FUTURISTIC WATCHMAKING',
      desc: 'Bold innovation. Boundary-breaking design.',
      image: homeImages.collection_defy || '/assets/watch_red.jpg',
      specs: [
        { label: 'Automatic Movement', icon: 'Cpu' },
        { label: 'Sapphire Crystal', icon: 'Gem' }
      ],
      dark: true,
      filter: { category: 'Defy' }
    },
    {
      num: '03',
      name: 'ELITE & HERITAGE',
      tagline: 'TIMELESS SWADESHI CLASSICS',
      desc: 'Inspired by heritage. Made for generations.',
      image: homeImages.collection_heritage || '/assets/watch_green.jpg',
      specs: [
        { label: 'Automatic Movement', icon: 'Cpu' },
        { label: 'Premium Leather', icon: 'Gem' }
      ],
      dark: false,
      filter: { category: 'Heritage' }
    }
  ];

  const marqueeA = ['Swadeshi Luxury', 'Indian Engineered', 'Make In India Pride', 'Sapphire Crystal', 'High-Beat Caliber', 'In-House Assembly'];
  const marqueeB = ['True Knock Group Product', 'Limited Edition Masterpiece', 'Khroniq Caliber Craftsmanship', 'Excellence Redefined', 'State-of-the-Art Indian Manufacture', 'Precision Made in India'];
  const stats = [
    { raw: '100', suffix: '%', label: 'Swadeshi Design' },
    { raw: '2026', suffix: '', label: 'Indian Launch' },
    { raw: '50', suffix: 'K+', label: 'Pre-bookings' },
  ];

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <section
        ref={heroRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1c1a17]"
        style={{ perspective: '1200px' }}
      >
        {/* Video — deepest layer, drifts opposite — cycles video 1 → video 2 → … */}
        <motion.div className="absolute inset-0 z-0" style={{ x: vidX, y: vidY, scale: 1.06 }}>
          <HeroVideoCycler />
          <div className="absolute inset-0 bg-black/28" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
          {/* Masking overlay to cover the bottom-right Gemini watermark on the video */}
          <div className="absolute bottom-0 right-0 w-64 h-48 sm:w-[28rem] sm:h-[20rem] bg-gradient-to-br from-transparent via-black/90 to-black blur-2xl sm:blur-3xl pointer-events-none z-10 opacity-95" />
        </motion.div>

        {/* Ambient orb — furthest opposite */}
        <motion.div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none z-[2]"
          style={{ x: orbX, y: orbY, background: 'radial-gradient(circle,rgba(52,211,153,0.48) 0%,transparent 70%)', filter: 'blur(48px)' }}
          animate={{ opacity: [0.07, 0.16, 0.07], scale: [1, 1.14, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />

        {/* Particles */}
        {[
          { width: 4, height: 4, top: '18%', left: '14%', background: '#c5a880', dur: 5,   del: 0   },
          { width: 6, height: 6, top: '63%', left: '8%',  background: '#34d399', dur: 7,   del: 1   },
          { width: 3, height: 3, top: '77%', left: '78%', background: '#c5a880', dur: 6,   del: 2   },
          { width: 5, height: 5, top: '32%', left: '88%', background: '#6ee7b7', dur: 8,   del: 0.5 },
          { width: 4, height: 4, top: '68%', left: '52%', background: '#fff',    dur: 5.5, del: 1.5 },
          { width: 3, height: 3, top: '12%', left: '63%', background: '#c5a880', dur: 9,   del: 3   },
          { width: 5, height: 5, top: '44%', left: '30%', background: '#34d399', dur: 7.5, del: 2.5 },
        ].map((p, i) => <FloatingParticle key={i} style={p} />)}

        {/* ── ALL content as one unified block — follows cursor ── */}
        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-12 gap-8 items-center"
          style={{ x: contentX, y: contentY }}
        >
          <div className="col-span-1 sm:col-span-8 space-y-6 text-center sm:text-left" style={{ transform: 'translate(-20px, 30px)' }}>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center sm:justify-start">
              <motion.span className="inline-flex items-center gap-2 border border-luxury-gold/45 text-luxury-gold px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/45 backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: 'rgba(197,168,128,0.85)' }} transition={{ duration: 0.15 }}>
                <Star size={10} fill="var(--color-luxury-gold)" className="animate-spin" style={{ animationDuration: '6s' }} />
                YOUR TRUSTED INDIAN MANUFACTURER PRESENTS
              </motion.span>
            </motion.div>

            {/* Heading — both lines same depth */}
            <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.16, ease: [0.22, 1, 0.36, 1] }} className="select-none cursor-default">
              <div className="font-cinzel font-bold text-4xl sm:text-5xl md:text-7xl tracking-wider text-white uppercase leading-tight">
                Born from the
              </div>
              <div className="font-cinzel font-bold text-4xl sm:text-5xl md:text-7xl tracking-wider uppercase leading-tight mt-1">
                <span style={{
                  background: 'linear-gradient(135deg, #047857 0%, #065f46 45%, #022c22 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 15px rgba(4,120,87,0.35)) drop-shadow(0 0 35px rgba(2,44,34,0.15))',
                  display: 'inline-block',
                }}>movement of Time</span>
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.85, delay: 0.32 }}
              className="text-gray-200 text-sm sm:text-base max-w-xl font-light tracking-wide leading-relaxed">
              KHRONIQ exists to inspire those who strive towards their dreams, offering unmatched horological mastery and mechanical innovation.
            </motion.p>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.46 }}
              className="pt-4 flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4">
              <MagBtn onClick={() => onPageChange('shop')}
                className="px-8 py-4 text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 transition duration-150 w-full sm:w-auto cursor-pointer border"
                style={{ background: 'linear-gradient(135deg, #047857 0%, #065f46 45%, #022c22 100%)', borderColor: '#047857' }}>
                Explore Timepieces
              </MagBtn>
              <MagBtn onClick={() => onPageChange('shop', { category: 'Khronomaster' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white/22 text-xs font-bold tracking-widest uppercase transition-colors duration-150 w-full sm:w-auto cursor-pointer">
                Khronomaster DNA
              </MagBtn>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div style={{ opacity: scrollFade }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 pointer-events-none">
          <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={16} className="text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ MARQUEE A ══════════ */}
      <Marquee items={marqueeA} speed={20} />

      {/* ══════════ GENDER SPLIT ══════════
          Each panel: mouse-tracking image parallax + reactive overlay + badge pop */}
      <section className="w-full overflow-hidden">
        <div className="text-center py-14 bg-white">
          <Reveal dir="down">
            <p className="text-[10px] text-luxury-gold-dark font-bold tracking-widest uppercase mb-3">CURATED FOR YOU</p>
          </Reveal>
          <SlideReveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-text tracking-wide uppercase">Shop By Gender</h2>
          </SlideReveal>
          <motion.div className="w-12 h-[2px] bg-luxury-gold-dark mx-auto mt-5"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <GenderPanel label="Men's Watches"   img={homeImages.gender_men || "/assets/men_watches.jpg"}   gender="men"   delay={0}    accent="#ffffff" onPageChange={onPageChange} />
          <GenderPanel label="Women's Watches" img={homeImages.gender_women || "/assets/women_watches_beach.jpg"} gender="women" delay={0.1}  accent="#34d399" onPageChange={onPageChange} />
        </div>
      </section>

      {/* ══════════ MARQUEE B (reverse) ══════════ */}
      <Marquee items={marqueeB} speed={18} reverse />

      {/* ══════════ SPOTLIGHT SECTION ══════════
          Left: headline + desc + discover link
          Right: large hero image
          Below: 2-up product image mini-grid */}
      <section className="w-full bg-white overflow-hidden">
        {/* Top half — editorial split */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Left — text */}
          <div className="flex flex-col justify-center px-10 sm:px-16 py-16 space-y-6 bg-white">
            <Reveal dir="left" delay={0}>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-luxury-gold-dark">Featured Collection</p>
            </Reveal>
            <SlideReveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-luxury-text leading-tight">
                <span className="text-luxury-gold-dark">Khronomaster</span> Professional
              </h2>
            </SlideReveal>
            <Reveal dir="left" delay={0.2}>
              <p className="text-luxury-muted text-sm leading-relaxed max-w-md">
                Engineered with Indian precision, the Khronomaster Professional pushes boundaries with components from the True Knock Group and the legendary Khroniq caliber. Built to inspire confidence for every Indian connoisseur.
              </p>
            </Reveal>
            <Reveal dir="left" delay={0.3}>
              <motion.button
                onClick={() => onPageChange('shop', { category: 'Khronomaster' })}
                className="flex items-center gap-2 text-xs font-black tracking-[0.22em] uppercase text-luxury-text border-b border-luxury-text pb-1 w-fit cursor-pointer"
                whileHover={{ gap: 16, color: '#000000', borderColor: '#000000' }}
                transition={{ duration: 0.25 }}
              >
                Discover <ArrowRight size={12} />
              </motion.button>
            </Reveal>
          </div>

          {/* Right — large hero image: dramatic angled editorial shot */}
          <div className="relative overflow-hidden min-h-[420px] lg:min-h-0">
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${homeImages.dive_deeper_hero || '/assets/spotlight_red_angled.png'}')`, backgroundPosition: 'center center' }}
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* Bottom half — 2-up product mini grid */}
        <div className="grid grid-cols-2 border-t border-luxury-text/8">
          {[
            { img: homeImages.dive_deeper_tile1 || '/assets/spotlight_green_side.png', label: 'Khroniq Emerald Green', sub: 'Heritage Automatic', style: { backgroundPosition: 'center center' } },
            { img: homeImages.dive_deeper_tile2 || '/assets/spotlight_red_overhead.png', label: 'Khroniq Crimson Red',   sub: 'Heritage Automatic', style: { backgroundPosition: 'center center' } },
          ].map(({ img, label, sub, style }, i) => (
            <motion.div
              key={i}
              onClick={() => onPageChange('shop')}
              className={`relative overflow-hidden cursor-pointer group h-[300px] ${
                i === 0 ? 'border-r border-luxury-text/8' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${img}')`, ...style }}
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7 space-y-1.5">
                <motion.p
                  className="font-serif text-xl font-bold"
                  style={{ color: '#ffffff', textShadow: '0 1px 14px rgba(0,0,0,1), 0 0 32px rgba(0,0,0,0.8)' }}
                  initial={{ y: 8, opacity: 0.8 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >{label}</motion.p>
                <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 10px rgba(0,0,0,1)' }}>{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ COLLECTIONS ══════════
          Each card: different enter anim + full 3-D mouse-track tilt + image parallax */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pt-32 pb-24 space-y-14 bg-white">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Reveal dir="flip">
            <p className="text-xs text-neutral-800 font-extrabold tracking-[0.35em] uppercase">The Pillars of KHRONIQ</p>
          </Reveal>
          
          <Reveal dir="up" delay={0.15}>
            <h2 className="text-4xl sm:text-5xl font-serif font-black text-neutral-900 tracking-wide uppercase">
              Signature Collections
            </h2>
          </Reveal>
          
          <div className="flex items-center justify-center gap-5 mt-2">
            <motion.div 
              className="h-[1.5px] bg-gradient-to-r from-transparent to-[#047857]"
              initial={{ width: 0 }}
              whileInView={{ width: '80px' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ width: '80px' }}
            />
            <img 
              src="/assets/logo_icon.png" 
              alt="Logo Mark" 
              className="w-5 h-5 object-contain opacity-90 filter brightness-0" 
            />
            <motion.div 
              className="h-[1.5px] bg-gradient-to-l from-transparent to-[#047857]"
              initial={{ width: 0 }}
              whileInView={{ width: '80px' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ width: '80px' }}
            />
          </div>
          
          <Reveal dir="up" delay={0.3}>
            <p className="text-neutral-600 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
              Three distinct expressions of our watchmaking philosophy. Crafted for those who value timeless excellence.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col, idx) => (
            <CollectionCard key={idx} col={col} idx={idx} onPageChange={onPageChange} />
          ))}
        </div>
      </section>

      {/* ══════════ FULL-WIDTH SCROLLING TEXT BANNER ══════════ */}
      <div className="w-full overflow-hidden bg-[#0e0d0b] select-none" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Strip 1 — forward */}
        <motion.div
          className="flex items-center whitespace-nowrap py-5"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <span style={{ color: '#ffffff', fontFamily: 'Georgia, serif', letterSpacing: '0.18em' }} className="text-sm sm:text-base font-bold uppercase mx-10 whitespace-nowrap shrink-0">
                Born From The Movement Of Time
              </span>
              <LogoMark className="h-9 w-9 mx-4 shrink-0 opacity-95" />
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* ══════════ LIFESTYLE SHOWCASE SLIDER ══════════ */}
      <LifestyleShowcaseSlider products={products} onPageChange={onPageChange} homeImages={homeImages} />

      {/* ══════════ FEATURED PRODUCTS ══════════ */}
      <div className="relative overflow-hidden" ref={curtainSectionRef}>
        {/* Auditorium Split-Curtain Screen */}
        <motion.div 
          className="absolute inset-0 z-40 overflow-hidden flex"
          animate={{ 
            pointerEvents: isFeaturedInView ? 'none' : 'auto',
            opacity: isFeaturedInView ? 0 : 1
          }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
        >
          {/* Left Curtain */}
          <motion.div 
            className="w-1/2 h-full bg-[#022c22] border-r border-[#047857]/30 relative z-40"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(90deg, #022c22, #022c22 20px, #047857 40px, #022c22 60px)',
              boxShadow: 'inset -20px 0 30px rgba(0,0,0,0.8)'
            }}
            animate={{ x: isFeaturedInView ? '-105%' : '0%' }}
            transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
          />
          {/* Right Curtain */}
          <motion.div 
            className="w-1/2 h-full bg-[#022c22] border-l border-[#047857]/30 relative z-40"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(90deg, #022c22, #022c22 20px, #047857 40px, #022c22 60px)',
              boxShadow: 'inset 20px 0 30px rgba(0,0,0,0.8)'
            }}
            animate={{ x: isFeaturedInView ? '105%' : '0%' }}
            transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
          />
          
          {/* Centered Curtains Text Overlay */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center z-50 px-4 pointer-events-none"
            animate={{ opacity: isFeaturedInView ? 0 : 1, scale: isFeaturedInView ? 0.85 : 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-luxury-gold uppercase drop-shadow-lg mb-2">
              Performance of Time
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-[0.25em] uppercase leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              FEATURED COLLECTION
            </h2>
            <div className="w-24 h-[1.5px] bg-luxury-gold my-4 drop-shadow-md" />
            <p className="text-[8px] sm:text-[9px] text-gray-300 tracking-[0.2em] uppercase font-bold max-w-md leading-relaxed drop-shadow-md">
              THE MASTERPIECES REVEAL AS YOU SCROLL
            </p>
          </motion.div>
        </motion.div>

        <section
          className="w-full pt-14 pb-48 space-y-10 relative overflow-hidden"
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            transition: 'background-color 0.6s ease',
          }}
        >
          {/* Section header — text stays white on dark/black bg */}
          <div className="text-center max-w-2xl mx-auto space-y-3 px-4">
            <Reveal dir="up">
              <p
                className="text-xs font-black tracking-[0.22em] uppercase"
                style={{ color: '#ffffff' }}
              >
                Signature Catalog
              </p>
            </Reveal>
            <SlideReveal delay={0.1}>
              <h2
                className="text-4xl sm:text-5xl font-black font-serif tracking-wide uppercase"
                style={{ color: '#ffffff' }}
              >
                Featured Masterpieces
              </h2>
            </SlideReveal>
            <motion.div
              className="w-16 h-[3px] mx-auto"
              style={{ background: '#ffffff' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25 }}
            />
          </div>

          {/* Carousel */}
          <div className="relative w-full px-4 sm:px-16 lg:px-20">
            {/* overflow-visible so the scaled-up card isn't clipped */}
            <div className="overflow-visible py-10 px-2">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: `calc(-${currentIndex * 100 / visibleCards}% - ${currentIndex * 24 / visibleCards}px)`
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              >
                {featured.map((product) => (
                  <div
                    key={product.id}
                    className="h-full"
                    style={{
                      width: `calc(${100 / visibleCards}% - ${24 * (visibleCards - 1) / visibleCards}px)`,
                      flexShrink: 0,
                      position: 'relative',
                    }}
                    onMouseEnter={() => handleHoverStart(product)}
                    onMouseLeave={handleHoverEnd}
                  >
                    <motion.div
                      className="h-full w-full"
                      whileHover={{ scale: 1.10, zIndex: 20 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    >
                      <ProductCard product={product} onPageChange={onPageChange} />
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            {featured.length > visibleCards && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition duration-300 cursor-pointer shadow-lg"
                  aria-label="Previous timepiece"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition duration-300 cursor-pointer shadow-lg"
                  aria-label="Next timepiece"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Bottom fade — dissolves white into dark Khroniq section below */}
          <div
            className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,1) 100%)' }}
          />
        </section>


        {/* ══════════ FULL SCREEN IMAGE BACKGROUND UPDATES SECTION ══════════ */}
        {/* ══════════ KHRONIQ UPDATE PARALLAX BANNER SECTION ══════════ */}
        <div 
          ref={updatesRef}
          className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden bg-black text-white"
          style={{
            backgroundImage: "url('/assets/t6.png')",
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark Overlay to align with the premium black theme */}
          <div className="absolute inset-0 bg-black/35 z-10" />

          {/* Vertical Tab sticking to the extreme left of this section only, spanning full height */}
          <button
            onClick={() => onUpdatesOpen && onUpdatesOpen()}
            className="absolute left-0 top-0 h-full w-20 sm:w-24 text-white font-black text-[22px] sm:text-[26px] tracking-[0.35em] uppercase border-r border-[#047857]/30 shadow-2xl hover:opacity-100 hover:translate-x-1.5 transition-all duration-300 z-30 cursor-pointer flex flex-col items-center justify-center select-none rounded-none group"
            style={{
              writingMode: 'vertical-lr',
              textOrientation: 'mixed',
              background: 'linear-gradient(180deg, #047857 0%, #065f46 45%, #022c22 100%)',
            }}
          >
            {/* Top pulsing notification dot */}
            <div className="absolute top-10 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </div>

            <span className="group-hover:scale-105 transition-transform duration-300">
              KHRONIQ UPDATES
            </span>

            {/* Bottom pulsing notification dot */}
            <div className="absolute bottom-10 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
