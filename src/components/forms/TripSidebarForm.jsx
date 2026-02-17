import React, { useState, useEffect } from 'react';
import { Send, Calendar, Users, Star, User, Mail, Phone, Loader2, CheckCircle, AlertCircle, Plus, Minus, Zap } from 'lucide-react';
import axios from 'axios';

const API_CONFIG = {
    API_KEY: "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M",
    ENQUIRY_ENDPOINT: "https://api.yaadigo.com/secure/api/enquires/",
    DOMAIN_NAME: "https://www.indianmountainrovers.com",
};

const TripSidebarForm = ({ tripName, tripId, price, duration, location }) => {
    const [formData, setFormData] = useState({
        departureDate: '',
        adults: 1,
        fullName: '',
        email: '',
        phone: '',
    });

    const [childAges, setChildAges] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
    const [viewers, setViewers] = useState(3); // Mock urgency trigger

    // Mock live viewers count update
    useEffect(() => {
        const interval = setInterval(() => {
            setViewers(prev => Math.max(2, Math.min(12, prev + Math.floor(Math.random() * 3) - 1)));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleChildAgeChange = (index, value) => {
        const newAges = [...childAges];
        newAges[index] = value;
        setChildAges(newAges);
    };

    const addChild = () => {
        if (childAges.length < 5) setChildAges([...childAges, 5]);
    };

    const removeChild = (index) => {
        setChildAges(childAges.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        const apiData = {
            "destination": tripName || 'Unknown Trip',
            "departure_city": "Not Specified",
            "travel_date": formData.departureDate || 'Flexible',
            "adults": parseInt(formData.adults),
            "children": childAges.length,
            "infants": 0,
            "hotel_category": "Not Specified",
            "full_name": formData.fullName,
            "contact_number": formData.phone.replace(/\D/g, ''),
            "email": formData.email,
            "additional_comments": `Trip ID: ${tripId}. Children Ages: ${childAges.join(', ')}`,
            "domain_name": API_CONFIG.DOMAIN_NAME,
        };

        try {
            await axios.post(API_CONFIG.ENQUIRY_ENDPOINT, apiData, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_CONFIG.API_KEY,
                },
            });
            setSubmitStatus('success');
            setFormData({ departureDate: '', adults: 1, fullName: '', email: '', phone: '' });
            setChildAges([]);
        } catch (error) {
            console.error("Enquiry submission failed:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 sticky top-24 z-10">
            {/* Header - Dark Theme for Contrast */}
            <div className="bg-gray-900 text-white p-6 relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    {/* Urgency Trigger */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-accent mb-3 animate-pulse">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>{viewers} people viewing this trip</span>
                    </div>

                    <div className="flex items-baseline gap-1 mb-1 opacity-80">
                        <span className="text-xs font-semibold uppercase tracking-wider">Starting from</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <h3 className="text-4xl font-serif font-bold text-white tracking-tight">
                            ₹{price ? (price / 1000).toFixed(0) + 'k' : 'On Request'}
                        </h3>
                        {price && <span className="text-sm opacity-60 font-light">per person</span>}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                        {duration && (
                            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                <Calendar className="w-3.5 h-3.5" /> {duration}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 text-yellow-400">
                            <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                        </span>
                    </div>
                </div>
            </div>

            {/* Form Body */}
            <div className="p-6">
                {submitStatus === 'success' ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Request Sent!</h4>
                        <p className="text-gray-600 text-sm mb-6">
                            Our travel expert will get back to you shortly to plan your perfect trip.
                        </p>
                        <button
                            onClick={() => setSubmitStatus(null)}
                            className="text-primary font-semibold text-sm hover:underline"
                        >
                            Send another inquiry
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Visual Separator Text */}
                        <p className="text-xs font-bold text-gray-400 uppercase text-center tracking-widest mb-4">
                            — Get a Free Quote —
                        </p>

                        <div>
                            <input
                                type="date"
                                name="departureDate"
                                required
                                value={formData.departureDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-gray-700"
                            />
                        </div>

                        {/* Travelers */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative group">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="number"
                                    name="adults"
                                    min="1"
                                    placeholder="Adults"
                                    value={formData.adults}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addChild}
                                className="flex items-center justify-center gap-2 px-3 py-3 bg-gray-50 border border-gray-200 border-dashed rounded-xl text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" /> Child
                            </button>
                        </div>

                        {/* Dynamic Child Ages */}
                        {childAges.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 relative">
                                <div className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 uppercase">Child Ages</div>
                                {childAges.map((age, i) => (
                                    <div key={i} className="relative">
                                        <input
                                            type="number"
                                            min="2"
                                            max="12"
                                            value={age}
                                            onChange={(e) => handleChildAgeChange(i, e.target.value)}
                                            className="w-full px-2 py-1.5 text-center text-xs font-bold border border-gray-200 rounded-lg focus:border-primary outline-none bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeChild(i)}
                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 shadow-sm"
                                        >
                                            <X className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-3 pt-2">
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        {submitStatus === 'error' && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-xs rounded-lg animate-shake">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>Something went wrong. Please try again.</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-dark hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="relative">Request Quote</span>
                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform relative" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>

            {/* Trust Footer */}
            <div className="bg-gray-50 p-3 flex justify-between items-center text-[10px] text-gray-500 font-semibold border-t border-gray-100">
                <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-3 h-3 text-green-600" /> Secure Booking</span>
                <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-3 h-3 text-green-600" /> best Price</span>
            </div>
        </div>
    );
};

// Simple Shield Icon fallback
const ShieldCheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
)

export default TripSidebarForm;
