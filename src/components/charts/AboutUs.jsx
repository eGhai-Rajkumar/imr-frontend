import React, { useState, useEffect } from 'react';
import { Shield, Eye, Users, Award } from 'lucide-react';

const FeatureCard = ({ title, description, icon, delay, gradient, accentColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`relative overflow-hidden transition-all duration-700 transform ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative h-full bg-gradient-to-br ${gradient} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-0 right-0 w-32 h-32 ${accentColor} rounded-full blur-3xl transform transition-transform duration-1000 ${isHovered ? 'scale-150 translate-x-8 -translate-y-8' : ''}`}></div>
          <div className={`absolute bottom-0 left-0 w-40 h-40 ${accentColor} rounded-full blur-3xl transform transition-transform duration-1000 ${isHovered ? 'scale-150 -translate-x-8 translate-y-8' : ''}`}></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Icon with animated ring */}
          <div className="relative w-16 h-16 mb-6">
            <div className={`absolute inset-0 bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : ''}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {React.createElement(icon, {
                className: `w-8 h-8 text-white transition-all duration-500 ${isHovered ? 'scale-125 rotate-12' : ''}`,
                strokeWidth: 2
              })}
            </div>
            {isHovered && (
              <div className="absolute inset-0 border-2 border-white/50 rounded-xl animate-ping"></div>
            )}
          </div>

          {/* Content */}
          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h3>
          
          <p className="text-white/90 leading-relaxed text-sm flex-grow">
            {description}
          </p>

          {/* Decorative line */}
          <div className={`mt-6 h-1 bg-white/30 rounded-full transition-all duration-500 ${isHovered ? 'w-full' : 'w-12'}`}></div>
        </div>

        {/* Shine effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`}></div>
      </div>
    </div>
  );
};

export default function WanderOnFeatures() {
  const features = [
    {
      title: '1. Choose Your Vibe',
      description: 'Define your ideal trip: Honeymoon, Adventure, or Group Tour. Filter by destination type, duration, and themes to see the best packages.',
      icon: Eye,
      gradient: 'from-purple-500 to-purple-700',
      accentColor: 'bg-purple-300',
      delay: 0
    },
    {
      title: '2. Get a Custom Itinerary',
      description: 'Share your travel details—dates, group size, and destination. Our specialists will craft a personalized itinerary and precise custom quote.',
      icon: Shield,
      gradient: 'from-blue-500 to-blue-700',
      accentColor: 'bg-blue-300',
      delay: 150
    },
    {
      title: '3. Confirm & Prepare',
      description: 'Review your tailored package, finalize your payment securely, and receive your detailed e-kit with all necessary travel documents and contacts.',
      icon: Award,
      gradient: 'from-teal-500 to-teal-700',
      accentColor: 'bg-teal-300',
      delay: 300
    },
    {
      title: '4. Enjoy Your Trip!',
      description: 'Our ground team and friendly trip leader handle all on-site logistics, accommodations, and transport, allowing you to relax and create unforgettable memories.',
      icon: Users,
      gradient: 'from-orange-500 to-orange-700',
      accentColor: 'bg-orange-300',
      delay: 450
    }
  ];

  return (
    <div className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            How to Plan Your Trip
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
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
              gradient={feature.gradient}
              accentColor={feature.accentColor}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Floating particles background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400/30 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-orange-400/30 rounded-full animate-float-delayed"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-40px) translateX(-20px);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}