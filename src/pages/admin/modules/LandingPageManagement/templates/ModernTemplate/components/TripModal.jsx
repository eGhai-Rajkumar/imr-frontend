import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, MapPin, Clock, Star, 
  CheckCircle2, XCircle, Calendar, ShieldCheck, 
  Phone, Send, Info, Zap, ArrowRight, Sparkles
} from 'lucide-react';

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const timelineItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

export default function TripModal({ 
  trip, 
  isOpen, 
  onClose, 
  onEnquire, 
  primaryColor = '#FF6B35',
  companyContact = '+91 98162 59997' // Default fallback
}) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const scrollRef = useRef(null);

  // --- DATA PREP ---
  const allImages = trip 
    ? [trip.hero_image, ...(trip.gallery_images || [])].filter((img, index, self) => img && self.indexOf(img) === index)
    : [];

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIdx(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !trip) return null;

  // --- HELPERS ---
  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  
  const parseList = (text) => {
    if (!text || typeof text !== 'string') return [];
    return text.split(';').map(i => i.trim()).filter(Boolean);
  };

  const getPrice = () => {
    let price = 0;
    try {
      if (trip?.pricing?.fixed_departure?.length > 0) {
         price = trip.pricing.fixed_departure[0]?.costingPackages?.[0]?.final_price 
                 || trip.pricing.fixed_departure[0]?.final_price;
      } else if (trip?.pricing?.customized) {
         price = trip.pricing.customized.final_price;
      }
      if (!price) price = trip.price || trip.base_price;
    } catch (e) {}
    return price;
  };
  
  const finalPrice = getPrice();

  // Format phone number for WhatsApp (remove spaces, dashes, etc.)
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '918076162392'; // Fallback
    return phone.replace(/[^\d]/g, ''); // Remove all non-digit characters
  };

  const whatsappNumber = formatPhoneForWhatsApp(companyContact);
  const whatsappMessage = encodeURIComponent(`Hi, I am interested in ${trip.custom_title || trip.title}`);

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'inclusions', label: 'Inclusions', icon: CheckCircle2 },
    { id: 'policies', label: 'Policies', icon: ShieldCheck },
  ];

  // Handle Enquiry Button Click
  const handleEnquireClick = () => {
    // Close the TripModal first
    onClose();
    // Then trigger the UnifiedEnquiryModal with this trip
    if (onEnquire) {
      onEnquire(trip);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4">
        
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg"
        />

        {/* --- MODAL WINDOW --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className="relative bg-[#F8F9FC] w-full max-w-[90rem] h-full sm:h-[92vh] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10"
        >
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-50 bg-black/20 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* --- 1. HERO SLIDER (Top 40%) --- */}
          <div className="relative h-[40vh] w-full bg-slate-900 shrink-0 group overflow-hidden">
            {allImages.length > 0 ? (
              <>
                <motion.img 
                  key={currentImageIdx}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 6, ease: "linear" }} // Subtle zoom effect
                  src={allImages[currentImageIdx]} 
                  alt="Hero" 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FC] via-black/20 to-black/30" />
                
                {/* Navigation */}
                {allImages.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={prevImage} className="bg-white/10 hover:bg-white/30 backdrop-blur-md p-3 rounded-full text-white transition-all hover:scale-110"><ChevronLeft className="w-6 h-6" /></button>
                    <button onClick={nextImage} className="bg-white/10 hover:bg-white/30 backdrop-blur-md p-3 rounded-full text-white transition-all hover:scale-110"><ChevronRight className="w-6 h-6" /></button>
                  </div>
                )}

                {/* Header Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 max-w-[85rem] mx-auto w-full">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="flex flex-wrap gap-3 mb-3"
                  >
                    <span className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-900/40 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> {trip.days} Days / {trip.nights}N
                    </span>
                    <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {trip.destination_type}
                    </span>
                  </motion.div>
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-sm"
                  >
                    {trip.custom_title || trip.title}
                  </motion.h1>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">No Image</div>
            )}
          </div>

          {/* --- 2. MAIN BODY (Grid) --- */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar scroll-smooth" ref={scrollRef}>
              <div className="max-w-[85rem] mx-auto px-6 sm:px-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* === LEFT: VERTICAL NAV (Sticky) === */}
                  <div className="hidden lg:block col-span-2">
                    <div className="sticky top-10 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 pl-2">Explore</p>
                      {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${
                              isActive 
                                ? 'text-white shadow-lg shadow-orange-500/30 scale-105' 
                                : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                            }`}
                          >
                            {/* Animated Background for Active Tab */}
                            {isActive && (
                              <motion.div 
                                layoutId="activeTabBg" 
                                className="absolute inset-0 z-0" 
                                style={{ backgroundColor: primaryColor }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            
                            <item.icon className={`w-4 h-4 relative z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                            <span className="relative z-10">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* === CENTER: CONTENT FEED (6 Cols) === */}
                  <motion.div 
                    className="col-span-1 lg:col-span-6 space-y-16 pb-24"
                    variants={staggerContainer} initial="hidden" animate="visible"
                  >
                    
                    {/* Overview */}
                    <motion.section id="overview" className="scroll-mt-10" variants={fadeUp}>
                      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm"><Info className="w-5 h-5" /></div>
                        The Experience
                      </h3>
                      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium opacity-90">
                          {trip.overview || "An unforgettable journey awaits you."}
                        </p>
                      </div>

                      {trip.highlights && (
                        <div className="mt-8">
                          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-orange-500 fill-current" /> Trip Highlights
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {parseList(trip.highlights).map((highlight, i) => (
                              <motion.div 
                                key={i} 
                                variants={fadeUp}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                              >
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 shrink-0 shadow-sm" />
                                <span className="text-sm font-medium text-slate-700 leading-snug">{highlight}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.section>

                    <hr className="border-slate-200/60" />

                    {/* Itinerary (Gamified Timeline) */}
                    <motion.section id="itinerary" className="scroll-mt-10" variants={fadeUp}>
                      <h3 className="text-2xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm"><Calendar className="w-5 h-5" /></div>
                        Your Journey
                      </h3>
                      
                      <div className="space-y-12 pl-4 border-l-[3px] border-slate-200 ml-3 md:ml-4 relative">
                        {trip.itinerary?.map((day, idx) => (
                          <motion.div 
                            key={idx} 
                            variants={timelineItem}
                            className="relative pl-10 group"
                          >
                            {/* Glowing Checkpoint */}
                            <div className="absolute -left-[11px] top-0">
                              <div className="w-5 h-5 rounded-full bg-slate-50 border-[3px] border-slate-300 group-hover:border-purple-500 group-hover:scale-125 transition-all duration-300 shadow-sm" />
                            </div>
                            
                            <div className="flex flex-col gap-3">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full w-fit">Day {day.day_number}</span>
                              <h4 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">{day.title}</h4>
                              <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">{day.description}</p>
                              
                              {/* Meal Badges */}
                              {day.meal_plan?.length > 0 && (
                                <div className="flex gap-2 pt-2">
                                  {day.meal_plan.map((m, i) => (
                                    <span key={i} className="text-[10px] font-bold px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm uppercase tracking-wide flex items-center gap-1">
                                      🍽️ {m}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>

                    <hr className="border-slate-200/60" />

                    {/* Inclusions */}
                    <motion.section id="inclusions" className="scroll-mt-10" variants={fadeUp}>
                      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm"><CheckCircle2 className="w-5 h-5" /></div>
                        Package Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
                          <h4 className="font-bold text-green-700 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Inclusions
                          </h4>
                          <ul className="space-y-4">
                            {parseList(trip.inclusions).map((item, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                <div className="mt-1 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600 font-bold text-[10px]">✓</div>
                                <span className="leading-snug font-medium">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/60 opacity-90 hover:opacity-100 transition-opacity">
                          <h4 className="font-bold text-red-500 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
                            <XCircle className="w-4 h-4" /> Exclusions
                          </h4>
                          <ul className="space-y-4">
                            {parseList(trip.exclusions).map((item, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                                <XCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.section>

                    {/* Policies */}
                    <motion.section id="policies" className="scroll-mt-10" variants={fadeUp}>
                      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shadow-sm"><ShieldCheck className="w-5 h-5" /></div>
                        Good to Know
                      </h3>
                      <div className="space-y-4">
                        {trip.policies?.map((policy, idx) => (
                          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
                            <h5 className="font-bold text-slate-800 mb-2 text-sm uppercase flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-blue-400" /> {policy.title}
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line pl-6 border-l-2 border-slate-100">
                              {policy.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.section>

                  </motion.div>

                  {/* === RIGHT: INTERACTIVE BOOKING CARD (Sticky - 4 Cols) === */}
                  <div className="hidden lg:block col-span-4">
                    <div className="sticky top-10">
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 p-8 relative overflow-hidden group"
                      >
                        {/* Interactive Gradient Orb */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-50 rounded-full blur-[80px] opacity-60 group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-10">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Total Package Price</p>
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-5xl font-black text-slate-900 tracking-tight" style={{ color: primaryColor }}>
                              {finalPrice ? `₹${Number(finalPrice).toLocaleString()}` : 'On Request'}
                            </span>
                            <span className="text-sm text-slate-400 font-medium">/ person</span>
                          </div>
                          
                          {trip.pricing?.customized?.base_price > finalPrice && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded mb-6">
                              Save ₹{(trip.pricing.customized.base_price - finalPrice).toLocaleString()}
                            </span>
                          )}

                          <div className="h-px bg-slate-100 my-8" />

                          <div className="space-y-4">
                            {/* --- THE AWESOME ENQUIRY BUTTON --- */}
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleEnquireClick}
                              className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-xl shadow-orange-500/25 relative overflow-hidden group/btn flex items-center justify-center gap-3"
                              style={{ background: `linear-gradient(135deg, ${primaryColor}, #FF8F00)` }}
                            >
                              {/* Continuous Shine Animation */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 translate-x-[-150%] animate-shimmer" />
                              
                              <Send className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" /> 
                              <span className="relative z-10">Send Enquiry</span>
                            </motion.button>
                            
                            {/* WHATSAPP BUTTON */}
                            <motion.button 
                              whileHover={{ scale: 1.02, backgroundColor: "#F8FAFC" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank')}
                              className="w-full py-4 rounded-2xl font-bold border-2 border-slate-100 hover:border-slate-300 text-slate-600 transition-all flex items-center justify-center gap-3 group/talk"
                            >
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center group-hover/talk:bg-green-500 transition-colors">
                                <Phone className="w-4 h-4 text-green-600 group-hover/talk:text-white transition-colors" /> 
                              </div>
                              Talk to Expert
                            </motion.button>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-50 text-center bg-slate-50/50 rounded-xl p-3">
                            <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                              Best Price Guaranteed • Verified Agents
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* --- MOBILE FIXED FOOTER --- */}
          <div className="lg:hidden p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-4 z-[60] shadow-[0_-5px_30px_rgba(0,0,0,0.1)] shrink-0 w-full safe-area-bottom">
            <div className="flex flex-col">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Starting From</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900" style={{ color: primaryColor }}>
                  {finalPrice ? `₹${Number(finalPrice).toLocaleString()}` : 'On Req'}
                </span>
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleEnquireClick}
              className="px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2"
              style={{ background: `linear-gradient(to right, ${primaryColor}, #FF8F00)` }}
            >
              <Send className="w-4 h-4" /> Enquire
            </motion.button>
          </div>

        </motion.div>
      </div>
      
      {/* GLOBAL STYLES FOR ANIMATIONS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #F8F9FC; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(150%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </AnimatePresence>
  );
}