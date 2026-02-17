import React, { useState, useEffect } from 'react';
import { Home, Plane, UserCheck, MapPin, Award, ThumbsUp, Calendar, Users, Shield, Check } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`relative transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative h-full bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group`}>

        {/* Icon */}
        <div className="mb-5 flex items-start justify-between">
          <div className={`inline-flex p-3 bg-primary/5 rounded-lg transition-all duration-500 group-hover:bg-primary group-hover:text-white text-primary`}>
            <Icon className="w-8 h-8" strokeWidth={1.5} />
          </div>
          {isHovered && <Check className="w-5 h-5 text-accent animate-in fade-in zoom-in" />}
        </div>

        {/* Title */}
        <h3 className="text-lg font-serif font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed font-light">
          {description}
        </p>

        {/* Bottom Accent */}
        <div className={`absolute bottom-0 left-0 h-1 bg-accent/50 rounded-full transition-all duration-500 ${isHovered ? 'w-full' : 'w-0'
          }`}></div>
      </div>
    </div>
  );
};

export default function TravelFeatures() {
  const features = [
    {
      icon: Home,
      title: 'Founded by Experts, Built on Trust',
      description: 'Holidays Planners was established in 2015 by CEO Miss Poonam Sharma and a team of travel professionals dedicated to simplifying travel for every customer.',
      delay: 0
    },
    {
      icon: Plane,
      title: 'Complete Travel Services Under One Roof',
      description: 'From flights to hotels, transfers, visas, and currency exchange—we manage your entire journey seamlessly, without third-party dependency.',
      delay: 100
    },
    {
      icon: UserCheck,
      title: 'Personalized Itineraries for Every Traveller',
      description: 'Every trip is designed according to your comfort, budget, interests, and pace—ensuring you get a travel experience made just for you.',
      delay: 200
    },
    {
      icon: MapPin,
      title: 'Pan-India Destination Expertise',
      description: 'We cover 250+ destinations including Himachal, J&K, Leh Ladakh, Goa, Kerala, Maharashtra, Delhi, Uttarakhand, and Andaman & Nicobar.',
      delay: 300
    },
    {
      icon: Award,
      title: '10+ Years of Travel Experience',
      description: 'With over a decade in the tourism industry, our on-ground knowledge helps us deliver smooth, safe, and enriching trips.',
      delay: 400
    },
    {
      icon: ThumbsUp,
      title: 'Trusted by 15,000+ Happy Travellers',
      description: 'Our rising customer base is built on referrals and repeat travellers who trust us for honest pricing and reliable service.',
      delay: 500
    },
    {
      icon: Calendar,
      title: 'Hassle-Free Booking & Support',
      description: 'Our team assists you at every step—from planning to booking and on-trip support—to ensure a stress-free experience.',
      delay: 600
    },
    {
      icon: Users,
      title: 'Dedicated Professional Team',
      description: 'Our strong hotel, transport, and service provider network ensures that your trip is smooth from start to finish.',
      delay: 700
    },
    {
      icon: Shield,
      title: '98% Customer Satisfaction Rate',
      description: 'We focus on delivering value, safety, and transparency—the core reasons travellers choose us year after year.',
      delay: 800
    }
  ];

  return (
    <div className="bg-gradient-to-br from-surface to-gray-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary-dark mb-4 inline-flex items-center justify-center gap-3 flex-wrap">
            Why Choose Indian Mountain Rovers?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
            A trusted Indian travel company offering personalized journeys, transparent services, and unforgettable experiences since 2015.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
