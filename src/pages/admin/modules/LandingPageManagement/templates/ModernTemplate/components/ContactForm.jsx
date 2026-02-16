import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Phone, Mail, MapPin, Clock, CheckCircle, Gift, User, Calendar, Users, Star, FileText, PhoneCall, Sparkles, CheckSquare } from 'lucide-react';
import { toast, Toaster } from "sonner";

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const DEFAULT_DOMAIN = 'https://www.indianmountainrovers.com';

export default function ContactForm({ 
    settings, 
    primaryColor = "#2563eb", 
    secondaryColor = "#7c3aed", 
    pageName = null,
    pageSlug = null
}) {
    const [formData, setFormData] = useState({
        destination: '',
        departure_city: '',
        travel_date: '',
        adults: 2,
        hotel_category: 'Budget',
        full_name: '',
        contact_number: '',
        email: '',
        additional_comments: '',
        domain_name: DEFAULT_DOMAIN
    });
    
    const [isFlexibleDate, setIsFlexibleDate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const leadSource = pageName ? `Landing Page: ${pageName}` : 'Website Contact Form';
        let finalComments = formData.additional_comments;
        let finalDate = formData.travel_date;

        if (isFlexibleDate) {
            finalComments = `(Flexible Travel Dates) ${finalComments}`;
            if (!finalDate) finalDate = new Date().toISOString().split('T')[0]; 
        }

        const payload = {
            ...formData,
            departure_city: leadSource,
            additional_comments: finalComments,
            travel_date: finalDate
        };

        try {
            const response = await fetch(`${API_BASE_URL}/enquires`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to submit enquiry');

            if (window.gtag) {
                window.gtag('event', 'ads_conversion_submit_lead_form', {
                    value: 1.0,
                    currency: 'INR',
                    destination: formData.destination,
                    page_location: window.location.href,
                });
            }

            setShowSuccess(true);
            toast.success("Enquiry sent! We'll contact you within 2 hours.");
        } catch (error) {
            toast.error('Failed to submit. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setShowSuccess(false);
        setIsFlexibleDate(false);
        setFormData({
            destination: '', departure_city: '', travel_date: '', adults: 2,
            hotel_category: 'Budget', full_name: '', contact_number: '',
            email: '', additional_comments: '', domain_name: DEFAULT_DOMAIN
        });
    };

    const contactInfo = [
        { icon: Phone, label: 'Call Us', value: settings?.contact || '+91 98765 43210', highlight: '24/7' },
        { icon: Mail, label: 'Email', value: 'info@indianmountainrovers.com', highlight: 'Quick' },
        { icon: MapPin, label: 'Office', value: 'Shimla, H.P. (171005)', highlight: 'Visit', isLink: true },
        { icon: Clock, label: 'Response', value: 'Within 2 hours', highlight: 'Fast' }
    ];

    return (
        <section id="contact" className="py-12 md:py-24 relative overflow-hidden bg-slate-50">
            <Toaster richColors position="top-center" />
            
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 blur-3xl rounded-full" style={{ backgroundColor: primaryColor }} />
                <div className="absolute bottom-0 right-0 w-96 h-96 blur-3xl rounded-full" style={{ backgroundColor: secondaryColor }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Left Side: Content */}
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white shadow-sm border" style={{ color: primaryColor }}>
                            <Gift className="w-4 h-4" />
                            <span className="text-xs md:text-sm font-bold">Special Discount on First Booking!</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Ready for Your <br/>
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                                Dream Vacation?
                            </span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg">
                            Crafting unforgettable journeys since 2010. Fill the form to get a custom itinerary and an exclusive price quote.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {contactInfo.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${primaryColor}10` }}>
                                        <item.icon className="w-5 h-5" style={{ color: primaryColor }} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{item.label}</p>
                                        <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <AnimatePresence mode="wait">
                            {!showSuccess ? (
                                <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold text-slate-700">Destination *</Label>
                                            <Input name="destination" value={formData.destination} onChange={handleChange} placeholder="Where do you want to go?" required className="rounded-xl border-slate-200 h-11" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-bold text-slate-700">Travel Date *</Label>
                                                <Input type="date" name="travel_date" value={formData.travel_date} onChange={handleChange} disabled={isFlexibleDate} required={!isFlexibleDate} className="rounded-xl h-11" />
                                                <div className="flex items-center gap-2 mt-1 cursor-pointer" onClick={() => setIsFlexibleDate(!isFlexibleDate)}>
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isFlexibleDate ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                                                        {isFlexibleDate && <CheckSquare className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-medium">Flexible dates</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-bold text-slate-700">Adults *</Label>
                                                <Input type="number" name="adults" value={formData.adults} onChange={handleChange} min="1" required className="rounded-xl h-11" />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold text-slate-700">Hotel Category</Label>
                                            <select name="hotel_category" value={formData.hotel_category} onChange={handleChange} className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:ring-2 outline-none">
                                                <option>Budget</option><option>3 Star</option><option>4 Star</option><option>5 Star</option><option>Luxury</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-bold text-slate-700">Full Name *</Label>
                                                <Input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="John Doe" required className="rounded-xl h-11" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-bold text-slate-700">Phone *</Label>
                                                <Input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="+91" required className="rounded-xl h-11" />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold text-slate-700">Email Address *</Label>
                                            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required className="rounded-xl h-11" />
                                        </div>

                                        <Button type="submit" disabled={isSubmitting} className="w-full py-6 rounded-full text-white font-bold text-lg shadow-lg hover:opacity-90 transition-all" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                                            {isSubmitting ? "Sending..." : "Get Free Quote"}
                                        </Button>

                                        <p className="text-[10px] text-center text-slate-400">
                                            <CheckCircle className="w-3 h-3 inline mr-1 text-green-500" /> Secure SSL Encryption | No Spam Policy
                                        </p>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border text-center">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                                        <PhoneCall className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">We've Received It!</h3>
                                    <p className="text-slate-500 mb-6">Our travel expert will call you shortly to plan your trip to <b>{formData.destination}</b>.</p>
                                    <Button onClick={resetForm} className="w-full rounded-full py-6 font-bold" variant="outline">Send Another Request</Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}