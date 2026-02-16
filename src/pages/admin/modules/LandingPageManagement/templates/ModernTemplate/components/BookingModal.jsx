import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    X, Calendar, Users, CreditCard, Shield, Check, 
    Zap, Clock, AlertTriangle, Gift, Star 
} from 'lucide-react';
import { toast } from "sonner";
import CountdownTimer from './CountdownTimer';

export default function BookingModal({ trip, isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        travelers: 2,
        date: '',
        name: '',
        email: '',
        phone: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
            return;
        }
        
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setStep(3);
        toast.success("Booking confirmed! Check your email for details.");
    };

    if (!trip) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="relative p-6 border-b">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {step === 3 ? '🎉 Booking Confirmed!' : `Book ${trip.destination}`}
                            </h3>
                            {step !== 3 && (
                                <p className="text-slate-500 mt-1">Step {step} of 2</p>
                            )}
                        </div>

                        {/* Urgency Banner */}
                        {step !== 3 && (
                            <div className="bg-red-50 border-b border-red-100 px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        Only {trip.slotsLeft} spots left at this price!
                                    </span>
                                </div>
                                <CountdownTimer 
                                    endDate={new Date(Date.now() + 10 * 60 * 1000)} 
                                    compact 
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                            {step === 1 && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Trip Summary */}
                                    <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                                        <img
                                            src={trip.image}
                                            alt={trip.destination}
                                            className="w-24 h-24 rounded-xl object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold text-slate-900">{trip.destination}</h4>
                                            <p className="text-sm text-slate-500">{trip.duration} • {trip.location}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                                                <span className="font-semibold">{trip.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Selection */}
                                    <div>
                                        <Label className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-[#FF6B35]" />
                                            Travel Date
                                        </Label>
                                        <Input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                            className="rounded-xl"
                                            required
                                        />
                                    </div>

                                    {/* Travelers */}
                                    <div>
                                        <Label className="flex items-center gap-2 mb-2">
                                            <Users className="w-4 h-4 text-[#FF6B35]" />
                                            Number of Travelers
                                        </Label>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setFormData({...formData, travelers: Math.max(1, formData.travelers - 1)})}
                                                className="rounded-full"
                                            >
                                                -
                                            </Button>
                                            <span className="text-2xl font-bold w-12 text-center">{formData.travelers}</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setFormData({...formData, travelers: formData.travelers + 1})}
                                                className="rounded-full"
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#FFB800]/10 rounded-2xl p-4 space-y-2">
                                        <div className="flex justify-between text-slate-600">
                                            <span>${trip.price} x {formData.travelers} travelers</span>
                                            <span>${trip.price * formData.travelers}</span>
                                        </div>
                                        <div className="flex justify-between text-green-600">
                                            <span>Flash Sale Discount (40%)</span>
                                            <span>-${Math.round(trip.price * formData.travelers * 0.4)}</span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-[#FF6B35]">
                                                ${Math.round(trip.price * formData.travelers * 0.6)}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB800] text-white rounded-full py-6 text-lg"
                                    >
                                        Continue to Payment
                                        <Zap className="w-5 h-5 ml-2" />
                                    </Button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4">
                                        <div>
                                            <Label>Full Name</Label>
                                            <Input
                                                placeholder="John Smith"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="mt-1.5 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                type="email"
                                                placeholder="john@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="mt-1.5 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Phone</Label>
                                            <Input
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="mt-1.5 rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Payment info placeholder */}
                                    <div className="p-4 bg-slate-50 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CreditCard className="w-5 h-5 text-slate-600" />
                                            <span className="font-semibold">Secure Payment</span>
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            You'll be redirected to our secure payment partner after submitting.
                                        </div>
                                    </div>

                                    {/* Trust badges */}
                                    <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Shield className="w-4 h-4 text-green-500" />
                                            Secure checkout
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Check className="w-4 h-4 text-green-500" />
                                            Free cancellation
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="flex-1 rounded-full"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#FFB800] text-white rounded-full"
                                        >
                                            {isProcessing ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                />
                                            ) : (
                                                'Complete Booking'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring" }}
                                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                    >
                                        <Check className="w-12 h-12 text-white" />
                                    </motion.div>
                                    
                                    <h4 className="text-2xl font-bold text-slate-900 mb-2">
                                        You're Going to {trip.destination}!
                                    </h4>
                                    <p className="text-slate-500 mb-6">
                                        Confirmation email sent to {formData.email}
                                    </p>

                                    <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#FFB800]/10 rounded-2xl p-6 mb-6">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Gift className="w-5 h-5 text-[#FF6B35]" />
                                            <span className="font-semibold text-slate-900">Bonus Unlocked!</span>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            You've earned <span className="text-[#FF6B35] font-bold">500 travel points</span> and 
                                            <span className="text-[#FF6B35] font-bold"> free airport transfer!</span>
                                        </p>
                                    </div>

                                    <Button
                                        onClick={onClose}
                                        className="bg-gradient-to-r from-[#FF6B35] to-[#FFB800] text-white rounded-full px-8"
                                    >
                                        Continue Exploring
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}