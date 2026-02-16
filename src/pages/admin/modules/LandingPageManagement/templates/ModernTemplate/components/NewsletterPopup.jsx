import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail, Gift, CheckCircle } from 'lucide-react';
import { toast } from "sonner";

export default function NewsletterPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Show popup after 15 seconds
        const timer = setTimeout(() => {
            const hasSeenPopup = localStorage.getItem('newsletter_popup_seen');
            if (!hasSeenPopup) {
                setIsVisible(true);
            }
        }, 15000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        localStorage.setItem('newsletter_popup_seen', 'true');
        toast.success("Welcome to our travel community!");
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('newsletter_popup_seen', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {!isSubmitted ? (
                            <>
                                <div className="relative h-40 bg-gradient-to-br from-[#FF6B35] to-[#FFB800] flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Mail className="w-20 h-20 text-white/80" />
                                    </motion.div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="absolute top-4 right-8"
                                    >
                                        <Gift className="w-8 h-8 text-white" />
                                    </motion.div>
                                </div>

                                <div className="p-8 text-center">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                        Get Exclusive Travel Deals!
                                    </h3>
                                    <p className="text-slate-500 mb-6">
                                        Subscribe and receive <span className="text-[#FF6B35] font-bold">$50 OFF</span> your 
                                        first booking + access to secret deals!
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <Input
                                            type="email"
                                            placeholder="Your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="rounded-full py-6 px-6 text-center"
                                            required
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB800] text-white rounded-full py-6"
                                        >
                                            Get My $50 Discount
                                        </Button>
                                    </form>

                                    <p className="text-xs text-slate-400 mt-4">
                                        No spam, unsubscribe anytime. Join 50,000+ travelers!
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring" }}
                                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    You're In! 🎉
                                </h3>
                                <p className="text-slate-500 mb-4">
                                    Check your inbox for your $50 discount code!
                                </p>
                                <div className="bg-[#FF6B35]/10 rounded-xl p-4">
                                    <div className="text-sm text-slate-600">Your discount code:</div>
                                    <div className="text-2xl font-bold text-[#FF6B35]">WELCOME50</div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}