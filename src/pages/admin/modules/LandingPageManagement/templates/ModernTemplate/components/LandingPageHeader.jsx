import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Facebook, Twitter, Linkedin, Instagram, Youtube,
  Mail, Phone, Sparkles
} from 'lucide-react';

export default function LandingPageHeader({ companySettings, promoData, primaryColor, secondaryColor }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Parse social media links
  const socials = companySettings?.social_media || {};
  
  // WhatsApp Logic
  const contactNumber = companySettings?.contact || '';
  const whatsAppNumber = contactNumber.replace(/[^0-9]/g, ''); 
  const whatsAppLink = `https://wa.me/${whatsAppNumber}`;

  // Navigation Links
  const navLinks = [
    { name: 'Attractions', href: '#attractions' },
    { name: 'Deals', href: '#packages' },
    { name: 'About', href: '#about' },
    { name: 'Contact Us', href: '#contact' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 120; // Adjusted offset for header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Inject Custom Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          .font-nav { font-family: 'Poppins', sans-serif; }
        `}
      </style>

      {/* ========================================
          1. TOP BAR (Promo + Socials + Contact)
      ======================================== */}
      {/* Changed px-4 to px-4 sm:px-6 lg:px-8 for better edge spacing on large screens */}
      <div className="bg-slate-900 text-white py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-[1002]">
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        
        {/* Container - REMOVED 'max-w-7xl mx-auto' to allow full width spreading */}
        <div className="relative z-10 w-full flex justify-between items-center h-full">
            
            {/* LEFT: Social Media (Desktop Only) */}
            <div className="hidden md:flex items-center gap-4 z-20 relative">
              {socials.facebook && <a href={socials.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><Facebook className="h-4 w-4" /></a>}
              {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors"><Twitter className="h-4 w-4" /></a>}
              {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors"><Instagram className="h-4 w-4" /></a>}
              {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-500 transition-colors"><Youtube className="h-4 w-4" /></a>}
            </div>

            {/* CENTER: Promo Text (Absolute Center) */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">
                {promoData?.enabled && (
                    <div className="flex items-center gap-2 text-xs md:text-sm font-medium pointer-events-auto px-2">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                        <span className="tracking-wide font-nav text-slate-100">{promoData.text}</span>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                    </div>
                )}
            </div>

            {/* RIGHT: Contact Info (Desktop Only) - Pushed to the far right */}
            <div className="hidden md:flex items-center justify-end gap-6 text-sm font-medium z-20 relative font-nav text-slate-300 ml-auto">
              {companySettings?.contact && (
                <a 
                  href={whatsAppLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 hover:text-green-400 transition-colors cursor-pointer"
                  title="Chat on WhatsApp"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{companySettings.contact}</span>
                </a>
              )}
              <a href="mailto:info@indianmountainrovers.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Mail className="h-3.5 w-3.5" />
                <span>info@indianmountainrovers.com</span>
              </a>
            </div>

        </div>
      </div>

      {/* ========================================
          2. MAIN NAVBAR (Sticky)
      ======================================== */}
      <motion.header 
        className={`sticky top-0 z-[999] w-full transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white py-3'
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">

            {/* LOGO (Image) */}
            <a href="#" onClick={(e) => scrollToSection(e, '#hero')} className="flex items-center gap-3 group">
              <img 
                src="/holidaysplanners-logo.png" 
                alt="Holidays Planners" 
                className="w-auto h-16" 
              />
            </a>

            {/* DESKTOP NAV - Updated Font */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-slate-800 font-medium text-[16px] hover:text-[#FF6B35] transition-colors py-2 font-nav tracking-wide"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* GET QUOTE BUTTON */}
            <div className="hidden lg:block">
              <button
                onClick={(e) => scrollToSection(e, '#contact')}
                className="px-7 py-3 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 font-nav"
                style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
              >
                Get Quote
              </button>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-slate-100 absolute w-full left-0 overflow-hidden shadow-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <nav className="flex flex-col p-6 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="flex items-center justify-between p-3 rounded-xl text-slate-900 font-medium text-lg hover:bg-slate-50 hover:text-[#FF6B35] transition-all font-nav"
                  >
                    {link.name}
                  </a>
                ))}
                
                <div className="h-px bg-slate-100 my-2" />

                {/* Mobile WhatsApp */}
                {companySettings?.contact && (
                    <a 
                      href={whatsAppLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl text-green-600 font-bold hover:bg-green-50 transition-all font-nav"
                    >
                      <Phone className="h-5 w-5" />
                      WhatsApp Us
                    </a>
                )}

                <button
                  onClick={(e) => scrollToSection(e, '#contact')}
                  className="mt-4 w-full py-4 text-white font-bold text-lg rounded-xl shadow-md active:scale-95 transition-transform font-nav"
                  style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                >
                  Book Your Trip
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
    </>
  );
}