import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    X, Calendar, Users, MapPin, Clock, Check, 
    Sparkles, Star, Shield
} from 'lucide-react';
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

export default function EnquiryModal({ trip, isOpen, onClose, settings }) {
    const [formData, setFormData] = useState({
        travelers: 2,
        travel_date: '',
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await base44.entities.LandingPageEnquiry.create({
                trip_title: trip.title,
                ...formData,
                status: 'new',
                source: 'landing_page'
            });
            
            setIsSubmitted(true);
            toast.success("Enquiry submitted! We'll contact you within 2 hours.");
        } catch (error) {
            toast.error("Failed to submit enquiry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!trip) return null;

    const totalPrice = trip.discount_price || trip.base_price;
    const discount = trip.base_price - (trip.discount_price || trip.base_price);

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
                        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        {!isSubmitted ? (
                            <div className="grid md:grid-cols-2">
                                {/* Left side - Trip Details */}
                                <div className="relative p-8 bg-gradient-to-br from-slate-50 to-white border-r">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="mb-6">
                                        <img
                                            src={trip.hero_image}
                                            alt={trip.title}
                                            className="w-full h-48 object-cover rounded-2xl mb-4"
                                        />
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                            {trip.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-600 mb-4">
                                            <MapPin className="w-4 h-4" />
                                            <span>{trip.location}</span>
                                        </div>
                                        {trip.rating && (
                                            <div className="flex items-center gap-1 mb-4">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold">{trip.rating}</span>
                                                <span className="text-slate-500 text-sm">(2.3k reviews)</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                            <span>{trip.duration_days} Days / {trip.duration_nights} Nights</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Users className="w-5 h-5 text-green-600" />
                                            <span>{trip.group_size} people</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                {discount > 0 && (
                                                    <div className="text-slate-400 line-through text-lg">
                                                        ₹{trip.base_price}
                                                    </div>
                                                )}
                                                <div className="text-3xl font-bold text-slate-900">
                                                    ₹{totalPrice}
                                                </div>
                                                <div className="text-sm text-slate-600">per person</div>
                                            </div>
                                            {discount > 0 && (
                                                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                    Save ₹{discount}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Trust indicators */}
                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span>Free cancellation up to 7 days</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span>Best price guarantee</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-green-500" />
                                            <span>Secure booking</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side - Enquiry Form */}
                                <div className="p-8">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                                            <Sparkles className="w-5 h-5" />
                                            <span className="text-sm font-semibold">Quick Enquiry</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900">
                                            Get Best Price & Free Consultation
                                        </h4>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Fill the form and we'll contact you within 2 hours
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label>Full Name *</Label>
                                            <Input
                                                placeholder="John Smith"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="mt-1.5"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>Email *</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="john@email.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    className="mt-1.5"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Phone *</Label>
                                                <Input
                                                    placeholder="+91 98765 43210"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    className="mt-1.5"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Travel Date
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={formData.travel_date}
                                                    onChange={(e) => setFormData({...formData, travel_date: e.target.value})}
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label>
                                                    <Users className="w-4 h-4 inline mr-1" />
                                                    Travelers
                                                </Label>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setFormData({...formData, travelers: Math.max(1, formData.travelers - 1)})}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="flex-1 text-center font-semibold">{formData.travelers}</span>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setFormData({...formData, travelers: formData.travelers + 1})}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Additional Message</Label>
                                            <Textarea
                                                placeholder="Any special requirements or questions..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                                className="mt-1.5 h-20"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-6 text-lg rounded-full"
                                            style={{
                                                background: settings?.primary_color 
                                                    ? `linear-gradient(to right, ${settings.primary_color}, ${settings.secondary_color || settings.primary_color})` 
                                                    : undefined
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                />
                                            ) : (
                                                <>
                                                    <Sparkles className="w-5 h-5 mr-2" />
                                                    Submit Enquiry
                                                </>
                                            )}
                                        </Button>

                                        <p className="text-xs text-center text-slate-400">
                                            By submitting, you agree to receive updates via email/SMS
                                        </p>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring" }}
                                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <Check className="w-10 h-10 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    Enquiry Submitted! 🎉
                                </h3>
                                <p className="text-slate-500 mb-6">
                                    Our travel expert will contact you within 2 hours with the best customized package!
                                </p>
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                                    <p className="text-sm text-slate-600 mb-2">
                                        We've sent confirmation to
                                    </p>
                                    <p className="font-semibold text-slate-900">{formData.email}</p>
                                    <p className="font-semibold text-slate-900">{formData.phone}</p>
                                </div>
                                <Button
                                    onClick={onClose}
                                    className="rounded-full px-8"
                                    style={{
                                        background: settings?.primary_color 
                                            ? `linear-gradient(to right, ${settings.primary_color}, ${settings.secondary_color || settings.primary_color})` 
                                            : undefined
                                    }}
                                >
                                    Continue Exploring
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}