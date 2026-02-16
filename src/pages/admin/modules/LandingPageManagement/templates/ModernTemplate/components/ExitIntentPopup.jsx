import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Gift, Clock, Sparkles } from 'lucide-react';

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e) => {
            if (e.clientY <= 0 && !hasShown) {
                setIsVisible(true);
                setHasShown(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasShown]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle email subscription
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={() => setIsVisible(false)}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotateX: -15 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </button>

                        {/* Header Image */}
                        <div className="relative h-48">
                            <img
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
                                alt="Beach Paradise"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35] via-[#FF6B35]/50 to-transparent" />
                            
                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            >
                                <div className="bg-white rounded-full p-6 shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-[#FF6B35]">25%</div>
                                        <div className="text-sm font-semibold text-slate-600">OFF</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-[#FFB800]" />
                                <span className="text-sm font-semibold text-[#FF6B35] uppercase tracking-wider">
                                    Exclusive Offer
                                </span>
                                <Sparkles className="w-5 h-5 text-[#FFB800]" />
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 mb-3">
                                Wait! Don't Leave Empty-Handed!
                            </h3>

                            <p className="text-slate-600 mb-6">
                                Get <span className="text-[#FF6B35] font-bold">25% OFF</span> your first booking! 
                                Enter your email to unlock this exclusive discount.
                            </p>

                            {/* Timer */}
                            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-slate-500">
                                <Clock className="w-4 h-4" />
                                <span>Offer expires in 10 minutes</span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-full py-6 px-6 text-center text-lg"
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB800] hover:from-[#FF5722] hover:to-[#FFA000] text-white rounded-full py-6 text-lg shadow-xl shadow-orange-500/30"
                                >
                                    <Gift className="w-5 h-5 mr-2" />
                                    Claim My 25% Discount
                                </Button>
                            </form>

                            <button
                                onClick={() => setIsVisible(false)}
                                className="mt-4 text-sm text-slate-400 hover:text-slate-600"
                            >
                                No thanks, I'll pay full price
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}