import React from 'react';
import { Shield, Award, Clock, CreditCard, RefreshCw, Headphones } from 'lucide-react';

// define the unique color palettes for each badge
const badges = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: '256-bit SSL encryption',
    // Blue Palette
    colors: {
      glow: 'from-blue-400 to-indigo-500',
      icon: 'text-blue-500',
      hoverBg: 'group-hover:bg-blue-50',
    }
  },
  {
    icon: Award,
    title: 'Best Price',
    description: 'Price Match Guarantee',
    // Green Palette
    colors: {
      glow: 'from-emerald-400 to-teal-500',
      icon: 'text-emerald-500',
      hoverBg: 'group-hover:bg-emerald-50',
    }
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Always here for you',
    // Cyan Palette
    colors: {
      glow: 'from-cyan-400 to-sky-500',
      icon: 'text-cyan-500',
      hoverBg: 'group-hover:bg-cyan-50',
    }
  },
  {
    icon: CreditCard,
    title: 'Flexible Pay',
    description: 'EMI & Split Payment',
    // Purple Palette
    colors: {
      glow: 'from-violet-400 to-fuchsia-500',
      icon: 'text-violet-500',
      hoverBg: 'group-hover:bg-violet-50',
    }
  },
  {
    icon: RefreshCw,
    title: 'Free Cancel',
    description: 'Up to 48hrs before',
    // Rose/Red Palette
    colors: {
      glow: 'from-rose-400 to-pink-500',
      icon: 'text-rose-500',
      hoverBg: 'group-hover:bg-rose-50',
    }
  },
  {
    icon: Headphones,
    title: 'Expert Guides',
    description: 'Verified Locals',
    // Amber/Gold Palette
    colors: {
      glow: 'from-amber-400 to-orange-500',
      icon: 'text-amber-500',
      hoverBg: 'group-hover:bg-amber-50',
    }
  },
];

export default function TrustBadgesAttractive() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      {/* Inject custom keyframes for the floating animation */}
      <style>
        {`
          @keyframes subtle-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          .animate-float {
            animation: subtle-float 4s ease-in-out infinite;
          }
          /* Pause floating on hover so the scale effect takes over cleanly */
          .group:hover .animate-float {
            animation-play-state: paused;
          }
        `}
      </style>
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20 relative z-10">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">
             Travel With Confidence
           </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-16 gap-x-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              // The 'group' container controls hover states
              <div
                key={index}
                className="group flex flex-col items-center text-center relative z-10"
              >
                {/* MOVEMENT WRAPPER:
                    This div has the continuous floating animation.
                    We use inline styles for animationDelay so they don't all float in sync.
                */}
                <div 
                  className="relative animate-float mb-8 transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  
                  {/* 1. The Colored Glow (Behind) 
                      Unique gradient for each badge.
                  */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${badge.colors.glow} rounded-full blur-2xl opacity-30 group-hover:opacity-70 transition-opacity duration-500 scale-125 z-0`}></div>
                  
                  {/* 2. The Glass Jewel (Main Shape) 
                      Semi-transparent white orb that lets the color shine through.
                  */}
                  <div className={`relative w-24 h-24 rounded-full bg-white/80 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-xl shadow-slate-200/50 z-10 transition-colors duration-300 ${badge.colors.hoverBg}`}>
                    
                    {/* 3. The Icon 
                        Unique text color.
                    */}
                    <Icon 
                      className={`w-10 h-10 ${badge.colors.icon} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`} 
                      strokeWidth={1.5} 
                    />
                  </div>
                </div>

                {/* TEXT CONTENT */}
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {badge.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed opacity-80 lg:px-2">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-gradient-to-r from-blue-50 via-purple-50 to-rose-50 blur-3xl opacity-30 rounded-full -z-10 pointer-events-none"></div>
    </section>
  );
}