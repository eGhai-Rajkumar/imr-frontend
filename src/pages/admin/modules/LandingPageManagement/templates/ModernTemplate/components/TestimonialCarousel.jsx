import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function TestimonialCarousel({ 
    testimonials = [], 
    sectionTitle = "What Our Travelers Say", 
    sectionSubtitle = "Real experiences" 
}) {
    // 1. Map API/Form data to Component's expected structure
    const items = testimonials.length > 0 ? testimonials.map((t, i) => ({
        id: i,
        name: t.name || 'Happy Traveler',
        role: 'Verified Traveler', 
        image: t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'User')}&background=random`,
        rating: t.rating || 5,
        text: t.description || 'No review text provided.',
        destination: t.destination || 'Unspecified Trip',
        date: t.date || new Date().toISOString().split('T')[0]
    })) : [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Auto-scroll logic
    useEffect(() => {
        if (items.length <= 1) return; 

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [items.length]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + items.length) % items.length);
    };

    if (items.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 md:mb-12"
                >
                    <span className="text-[#FF6B35] font-semibold text-xs md:text-sm uppercase tracking-wider">
                        {sectionSubtitle}
                    </span>
                    <h2 className="text-3xl md:text-4xl sm:text-5xl font-bold text-slate-900 mt-2 md:mt-4 mb-4 md:mb-6">
                        {sectionTitle}
                    </h2>
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 md:w-6 md:h-6 fill-[#FFB800] text-[#FFB800]" />
                            ))}
                        </div>
                        <span className="text-slate-600 font-medium text-xs md:text-sm">Trusted by {items.length * 100}+ travelers</span>
                    </div>
                </motion.div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation buttons - Only show if > 1 item */}
                    {items.length > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 lg:-translate-x-16 z-10 rounded-full w-8 h-8 md:w-12 md:h-12 border-2 hover:bg-slate-50"
                                onClick={() => paginate(-1)}
                            >
                                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 lg:translate-x-16 z-10 rounded-full w-8 h-8 md:w-12 md:h-12 border-2 hover:bg-slate-50"
                                onClick={() => paginate(1)}
                            >
                                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                            </Button>
                        </>
                    )}

                    {/* Testimonial card */}
                    <div className="relative h-[350px] md:h-[400px] flex items-center justify-center">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="absolute w-full"
                            >
                                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-12 relative border border-slate-100">
                                    <Quote className="absolute top-4 md:top-8 right-4 md:right-8 w-12 h-12 md:w-16 md:h-16 text-[#FF6B35]/10" />
                                    
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 mb-4 md:mb-6">
                                        <img
                                            src={items[currentIndex].image}
                                            alt={items[currentIndex].name}
                                            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 md:border-4 border-[#FFB800]/20 bg-slate-100"
                                        />
                                        <div className="text-center sm:text-left">
                                            <h4 className="text-lg md:text-xl font-bold text-slate-900">
                                                {items[currentIndex].name}
                                            </h4>
                                            <p className="text-xs md:text-sm text-slate-500">
                                                {items[currentIndex].role}
                                            </p>
                                            <div className="flex items-center gap-0.5 md:gap-1 mt-1 md:mt-2 justify-center sm:justify-start">
                                                {[...Array(items[currentIndex].rating)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-[#FFB800] text-[#FFB800]" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="sm:ml-auto text-center sm:text-right">
                                            <div className="text-[#FF6B35] font-semibold text-sm md:text-base">
                                                {items[currentIndex].destination}
                                            </div>
                                            <div className="text-[10px] md:text-sm text-slate-400">
                                                {items[currentIndex].date}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm md:text-lg text-slate-600 leading-relaxed text-center sm:text-left overflow-y-auto max-h-[120px] md:max-h-[150px] pr-2 custom-scrollbar">
                                        "{items[currentIndex].text}"
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots */}
                    {items.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6 md:mt-8">
                            {items.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentIndex ? 1 : -1);
                                        setCurrentIndex(index);
                                    }}
                                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                                        index === currentIndex 
                                            ? 'bg-[#FF6B35] w-6 md:w-8' 
                                            : 'bg-slate-300 hover:bg-slate-400'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
            `}</style>
        </section>
    );
}