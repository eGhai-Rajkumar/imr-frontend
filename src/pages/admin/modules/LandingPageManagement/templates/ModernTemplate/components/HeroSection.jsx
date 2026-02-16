import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin, Users, Star, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import MediaPlayer from './MediaPlayer';

export default function HeroSection({ heroData, primaryColor = '#FF6B35', secondaryColor = '#FFB800', onExploreClick, onGetQuote }) {
  const defaultHero = {
    title: 'Escape to Paradise',
    subtitle: '',
    description: 'Discover breathtaking destinations with exclusive deals.',
    cta_button_1: { text: 'Explore Destinations', link: '#packages' },
    cta_button_2: { text: 'Get Quote', link: '#contact' },
    background_type: 'slider',
    background_images: ['https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80'],
    background_videos: []
  };

  const hero = heroData || defaultHero;
  
  const bgImages = hero.background_images?.length > 0 ? hero.background_images : defaultHero.background_images;
  const bgVideos = hero.background_videos?.length > 0 ? hero.background_videos : [];
  
  const slides = [
    ...bgImages.map(url => ({ type: 'image', url })),
    ...bgVideos.map(url => ({ type: 'video', url }))
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const videoRefs = useRef([]);

  // Preload first media to prevent flash
  useEffect(() => {
    if (!slides[0]) return;

    if (slides[0].type === 'image') {
      const img = new Image();
      img.onload = () => setMediaLoaded(true);
      img.src = slides[0].url;
    } else {
      // For videos, set loaded immediately
      setMediaLoaded(true);
    }
  }, []);

  // Auto-play videos when they become active
  useEffect(() => {
    if (slides[currentSlide]?.type === 'video') {
      const video = videoRefs.current[currentSlide];
      if (video) {
        video.play().catch(e => {
          console.log("Autoplay blocked, retrying:", e);
          setTimeout(() => video.play().catch(() => {}), 100);
        });
      }
    }
  }, [currentSlide, slides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-advance for images
  useEffect(() => {
    const currentType = slides[currentSlide]?.type;
    if (currentType === 'image' && slides.length > 1) {
      const timer = setTimeout(nextSlide, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, slides]);

  const handleCtaClick = (e, link) => {
    if (link === '#packages' && onExploreClick) {
      e.preventDefault();
      onExploreClick();
      return;
    }
    if (link === '#contact' && onGetQuote) {
      e.preventDefault();
      onGetQuote();
      return;
    }
    if (!link) return;
    if (link.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(link);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = link;
    }
  };

  const handleScrollDown = () => {
    const nextSection = document.querySelector('#packages, section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      
      {/* Loading placeholder */}
      {!mediaLoaded && (
        <div className="absolute inset-0 bg-slate-900 z-30 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Background Slider */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: mediaLoaded ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full"
          >
            <div 
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120vw',
                height: '120vh',
                minWidth: '120vw',
                minHeight: '120vh',
              }}
            >
              <MediaPlayer
                url={slides[currentSlide]?.url}
                type="auto"
                autoplay={true}
                muted={true}
                playsInline={true}
                loop={slides[currentSlide]?.type === 'video' && slides.length === 1}
                onEnded={slides[currentSlide]?.type === 'video' && slides.length > 1 ? nextSlide : undefined}
                onError={(e) => {
                  console.error("Media failed to load:", slides[currentSlide]?.url);
                  if (slides.length > 1) nextSlide();
                }}
                videoRef={(el) => (videoRefs.current[currentSlide] = el)}
                className="w-full h-full object-cover"
                cover
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 backdrop-blur-md p-3 rounded-full text-white transition-all hover:scale-110" aria-label="Previous">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 backdrop-blur-md p-3 rounded-full text-white transition-all hover:scale-110" aria-label="Next">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`transition-all rounded-full ${currentSlide === index ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'}`} aria-label={`Slide ${index + 1}`} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: mediaLoaded ? 1 : 0, y: mediaLoaded ? 0 : 30 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-2xl leading-[1.1]">
          <span className="block">{hero.title}</span>
          {hero.subtitle && (
            <span className="block mt-2" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {hero.subtitle}
            </span>
          )}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: mediaLoaded ? 1 : 0, y: mediaLoaded ? 0 : 30 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-base sm:text-lg md:text-xl text-white/95 max-w-3xl mx-auto mb-10 leading-relaxed font-medium drop-shadow-lg">
          {hero.description}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: mediaLoaded ? 1 : 0, y: mediaLoaded ? 0 : 30 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button onClick={(e) => handleCtaClick(e, hero.cta_button_1?.link)} size="lg" className="px-8 py-6 text-base sm:text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-none font-bold" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, color: 'white' }}>
            {hero.cta_button_1?.text}
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="ml-2">→</motion.span>
          </Button>
          {hero.cta_button_2?.text && (
            <Button onClick={(e) => handleCtaClick(e, hero.cta_button_2?.link)} variant="outline" size="lg" className="border-2 border-white/50 text-white bg-white/10 hover:bg-white/20 px-8 py-6 text-base sm:text-lg rounded-full backdrop-blur-md font-bold">
              <MessageCircle className="w-5 h-5 mr-2" />{hero.cta_button_2.text}
            </Button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: mediaLoaded ? 1 : 0, y: mediaLoaded ? 0 : 30 }} transition={{ duration: 0.8, delay: 0.8 }} className="grid grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto border-t border-white/20 pt-8">
          {[
            { icon: MapPin, value: '150+', label: 'DESTINATIONS' },
            { icon: Users, value: '50K+', label: 'TRAVELERS' },
            { icon: Star, value: '4.9', label: 'RATING' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-2 text-white/80" />
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/70 text-[10px] sm:text-xs uppercase tracking-wider font-bold">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: mediaLoaded ? 1 : 0 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center cursor-pointer" onClick={handleScrollDown}>
          <span className="text-white/80 text-[10px] sm:text-xs mb-2 tracking-wider uppercase font-bold">SCROLL</span>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}