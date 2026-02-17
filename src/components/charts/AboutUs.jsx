import React, { useState, useEffect } from 'react';
import { Shield, Eye, Users, Award, Map, Calendar, CheckCircle } from 'lucide-react';

const FeatureCard = ({ title, description, icon, delay, accentColor, iconColor }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`relative overflow-hidden transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`relative h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group`}>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-primary"></div>

                <div className="relative z-10 flex flex-col h-full items-center text-center">
                    {/* Icon with animated ring */}
                    <div className="relative w-20 h-20 mb-6">
                        <div className={`absolute inset-0 ${accentColor} rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {React.createElement(icon, {
                                className: `w-8 h-8 ${iconColor} transition-transform duration-500 group-hover:scale-110`,
                                strokeWidth: 1.5
                            })}
                        </div>
                        {/* Orbit Dot */}
                        <div className={`absolute top-0 right-0 w-3 h-3 ${iconColor} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-ping`}></div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 tracking-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-sm flex-grow font-light">
                        {description}
                    </p>

                    {/* Decorative line */}
                    <div className={`mt-6 h-0.5 bg-gray-200 rounded-full transition-all duration-500 w-12 group-hover:w-24 group-hover:bg-accent`}></div>
                </div>
            </div>
        </div>
    );
};

export default function HowItWorks() {
    const features = [
        {
            title: '1. Choose Your Vibe',
            description: 'Define your ideal trip: Honeymoon, Adventure, or Group Tour. Filter by destination type, duration, and themes to see the best packages.',
            icon: Map,
            accentColor: 'bg-emerald-500',
            iconColor: 'text-emerald-700',
            delay: 0
        },
        {
            title: '2. Get a Custom Itinerary',
            description: 'Share your travel details—dates, group size, and destination. Our specialists will craft a personalized itinerary and precise custom quote.',
            icon: Calendar,
            accentColor: 'bg-amber-500',
            iconColor: 'text-amber-700',
            delay: 150
        },
        {
            title: '3. Confirm & Prepare',
            description: 'Review your tailored package, finalize your payment securely, and receive your detailed e-kit with all necessary travel documents and contacts.',
            icon: CheckCircle,
            accentColor: 'bg-blue-500',
            iconColor: 'text-blue-700',
            delay: 300
        },
        {
            title: '4. Enjoy Your Trip!',
            description: 'Our ground team and friendly trip leader handle all on-site logistics, accommodations, and transport, allowing you to relax and create unforgettable memories.',
            icon: Award,
            accentColor: 'bg-rose-500',
            iconColor: 'text-rose-700',
            delay: 450
        }
    ];

    return (
        <div className="bg-surface py-24 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">Process</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-dark mb-6">
                        How to Plan Your Trip
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
                        Follow these simple steps to customize and book your perfect Himalayan or International escape.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                            accentColor={feature.accentColor}
                            iconColor={feature.iconColor}
                            delay={feature.delay}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}