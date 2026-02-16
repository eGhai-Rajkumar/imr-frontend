import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Send, ArrowRight } from 'lucide-react';

export default function AttractionModal({ attraction, isOpen, onClose, onEnquire, primaryColor = '#FF6B35', secondaryColor = '#FFB800' }) {
    if (!isOpen || !attraction) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 40 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
                >
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-5 right-5 z-20 p-2.5 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all hover:rotate-90 hover:scale-110"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* --- Hero Image (Top) --- */}
                    <div className="relative h-80 sm:h-96 shrink-0 group">
                        <img 
                            src={attraction.image} 
                            alt={attraction.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-lg">
                                    <MapPin className="w-3.5 h-3.5" /> Famous Spot
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight drop-shadow-xl">
                                    {attraction.title}
                                </h2>
                            </motion.div>
                        </div>
                    </div>

                    {/* --- Content Body --- */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
                        <div className="p-8 sm:p-10">
                            <div className="flex flex-col lg:flex-row gap-10">
                                
                                {/* Left: Description */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: primaryColor }} />
                                        About this destination
                                    </h3>
                                    <div 
                                        className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: attraction.description }} 
                                    />
                                </div>

                                {/* Right: Action Card */}
                                <div className="w-full lg:w-80 shrink-0">
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl sticky top-0">
                                        <h4 className="font-bold text-slate-900 mb-2">Want to visit here?</h4>
                                        <p className="text-sm text-slate-500 mb-6">Add this amazing location to your custom itinerary.</p>
                                        
                                        {/* --- SHIMMERING SEND QUERY BUTTON --- */}
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={onEnquire}
                                            className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg relative overflow-hidden group flex items-center justify-center gap-2"
                                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                                        >
                                            {/* Shine Effect */}
                                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                                            
                                            <Send className="w-5 h-5 relative z-10" /> 
                                            <span className="relative z-10">Send Query</span>
                                        </motion.button>

                                        <p className="text-[10px] text-center text-slate-400 mt-4 font-medium">
                                            Instant response from our experts
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #F8FAFC; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </AnimatePresence>
    );
}