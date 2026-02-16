import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, ArrowRight, Flame, 
  Send, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function TripCard({ trip, index, onEnquire, onViewDetails, primaryColor = '#FF6B35', secondaryColor = '#FFB800' }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [direction, setDirection] = useState(0); 
  const [isHovered, setIsHovered] = useState(false); 

  // --- 1. DATA PREP ---
  const images = trip 
    ? [trip.hero_image, ...(trip.gallery_images || [])].filter((img, index, self) => img && self.indexOf(img) === index)
    : [];
  
  if (images.length === 0) images.push('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800');

  // --- 2. AUTO-PLAY SLIDER ---
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }, 3500); 
    return () => clearInterval(timer);
  }, [currentImgIdx, isHovered, images.length]);

  // --- 3. HANDLERS ---
  const nextImage = (e) => {
    e?.stopPropagation();
    setDirection(1);
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setDirection(-1);
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const getPriceDisplay = () => {
    if (!trip) return 'On Request';
    let price = 0;
    try {
        if (trip.pricing?.fixed_departure?.length > 0) {
           const pkg = trip.pricing.fixed_departure[0].costingPackages?.[0];
           price = pkg?.final_price || trip.pricing.fixed_departure[0].final_price;
        } else if (trip.pricing?.customized) {
           price = trip.pricing.customized.final_price || trip.pricing.customized.base_price;
        }
        if (!price || price === 0) price = trip.price || trip.base_price;
    } catch(e) {}
    return price ? `₹${Number(price).toLocaleString()}` : 'Ask for Price';
  };

  const isHot = trip.badge?.toLowerCase().includes('hot') || trip.badge?.toLowerCase().includes('best');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, type: "spring", bounce: 0.3 }}
      className="group relative h-[480px] w-full bg-white rounded-[2rem] shadow-lg hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 overflow-hidden cursor-pointer border border-slate-100 flex flex-col"
      onClick={() => onViewDetails(trip)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* --- 1. TOP SECTION: IMAGE SLIDER (55% Height) --- */}
      <div className="relative h-[55%] w-full bg-slate-100 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img 
            key={currentImgIdx}
            src={images[currentImgIdx]}
            custom={direction}
            variants={{
              enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
              center: { zIndex: 1, x: 0, opacity: 1 },
              exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>
        
        {/* Subtle Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60" />

        {/* Navigation Arrows (Visible on Hover) */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
            <button 
              onClick={prevImage} 
              className="pointer-events-auto p-2 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white transition-transform hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextImage} 
              className="pointer-events-auto p-2 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white transition-transform hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
          {trip.badge ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-1 backdrop-blur-md border border-white/20 ${isHot ? 'bg-red-600' : 'bg-blue-600'}`}
            >
              {isHot && <Flame className="w-3 h-3 fill-current animate-pulse" />} 
              {trip.badge}
            </motion.div>
          ) : <div />}

          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold border border-white/10 flex items-center gap-1.5 shadow-md">
             <Clock className="w-3 h-3 text-orange-400" /> {trip.days}D/{trip.nights}N
          </div>
        </div>
      </div>

      {/* --- 2. BOTTOM SECTION: CONTENT (45% Height) --- */}
      <div className="flex-1 p-6 flex flex-col justify-between bg-white relative z-10">
        
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
             <MapPin className="w-3.5 h-3.5 text-slate-400" />
             {trip.destination_type || 'Tour Package'}
          </div>

          {/* Title - DARK AND CLEAR */}
          <h3 
            className="text-xl font-black text-slate-900 leading-tight line-clamp-2 group-hover:text-[#FF6B35] transition-colors duration-300"
            title={trip.custom_title || trip.title}
          >
            {trip.custom_title || trip.title}
          </h3>
        </div>

        <div>
          {/* Price & Divider */}
          <div className="border-t border-slate-100 pt-4 mb-4">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Starting From</p>
             <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight" style={{ color: primaryColor }}>
                   {getPriceDisplay()}
                </span>
                <span className="text-xs text-slate-400 font-medium">/pax</span>
             </div>
          </div>

          {/* --- TWO BUTTONS --- */}
          <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={(e) => { e.stopPropagation(); onViewDetails(trip); }}
               className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all hover:-translate-y-0.5"
             >
               <Eye className="w-4 h-4" /> Explore
             </button>
             
             <button 
               onClick={(e) => { e.stopPropagation(); onEnquire(trip); }}
               className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl relative overflow-hidden group/btn hover:-translate-y-0.5 transition-all"
               style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
             >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
               <span className="relative z-10 flex items-center gap-2">
                 Send Query <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
               </span>
             </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}