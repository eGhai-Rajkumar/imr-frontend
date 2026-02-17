import React from 'react';
import { Award, ShieldCheck, Clock, CreditCard, RefreshCw, Headphones } from 'lucide-react';

// define the unique color palettes for each badge
const badges = [
  {
    icon: ShieldCheck,
    title: 'Secure Booking',
    description: '256-bit SSL encryption',
    // Green Palette
    colors: {
      glow: 'from-green-400 to-emerald-500',
      icon: 'text-[#2C6B4F]',
      hoverBg: 'group-hover:bg-[#FDFBF7]',
    }
  },
  {
    icon: Award,
    title: 'Best Value',
    description: 'Guaranteed low prices',
    // Gold Palette
    colors: {
      glow: 'from-yellow-400 to-amber-500',
      icon: 'text-[#D4AF37]',
      hoverBg: 'group-hover:bg-[#FDFBF7]',
    }
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Always here for you',
    // Green Palette
    colors: {
      glow: 'from-green-400 to-emerald-600',
      icon: 'text-[#2C6B4F]',
      hoverBg: 'group-hover:bg-[#FDFBF7]',
    }
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'EMI & Part Payment',
    // Gold Palette
    colors: {
      glow: 'from-yellow-400 to-orange-500',
      icon: 'text-[#D4AF37]',
      hoverBg: 'group-hover:bg-[#FDFBF7]',
    }
  },
  {
    icon: RefreshCw,
    title: 'Easy Refund',
    description: 'Hassle-free cancellation',
    // Green Palette
    colors: {
      glow: 'from-green-400 to-teal-500',
      icon: 'text-[#2C6B4F]',
      hoverBg: 'group-hover:bg-[#FDFBF7]',
    }
  },
  {
    icon: Headphones,
    title: 'Expert Guide',
    description: 'Verified local experts',
    // Gold Palette
    colors: {
      glow: 'from-yellow-500 to-amber-600',
      icon: 'text-[#D4AF37]',
      hoverBg: 'group-hover:bg-[#FDFBF7]',
    }
  }
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
          <span className="text-[#FF6B35] font-bold tracking-widest uppercase text-sm">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">
            Our Core Values
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#FF6B35] to-[#FFB800] rounded-full mx-auto mt-6"></div>
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">
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