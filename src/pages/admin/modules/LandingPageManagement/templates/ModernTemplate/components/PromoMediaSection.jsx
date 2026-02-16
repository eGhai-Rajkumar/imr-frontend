import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Helper to safely encode URLs
const getSafeUrl = (url) => {
  try {
    return encodeURI(url);
  } catch (e) {
    return url;
  }
};

const isVideoUrl = (url) => {
  return url.match(/\.(mp4|webm|ogg|mov)$/i);
};

export default function PromoMediaSection({ data, primaryColor = '#FF6B35', secondaryColor = '#FFB800' }) {
  const swiperRef = useRef(null);
  const videoRefs = useRef([]); // Store refs for all video elements

  if (!data || !data.enabled || !data.media_urls || data.media_urls.length === 0) {
    return null;
  }

  const { media_urls } = data;

  // --- SMART SLIDE LOGIC ---
  const handleSlideChange = (swiper) => {
    const activeIndex = swiper.realIndex;
    const activeUrl = media_urls[activeIndex];
    const isVideo = isVideoUrl(activeUrl) || data.type === 'video';

    // 1. Pause all videos first (so background slides don't keep playing)
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0; // Reset video
      }
    });

    if (isVideo) {
      // CASE A: It's a VIDEO
      // 1. Stop the generic 5s timer
      swiper.autoplay.stop();
      
      // 2. Find and play the active video
      const activeVideo = videoRefs.current[activeIndex];
      if (activeVideo) {
        // Play returns a promise, handle potential errors
        activeVideo.play().catch(e => console.log("Autoplay prevented:", e));
      }
    } else {
      // CASE B: It's an IMAGE
      // 1. Start the generic 5s timer
      swiper.autoplay.start();
    }
  };

  // --- VIDEO END HANDLER ---
  const handleVideoEnded = () => {
    // When video finishes, move to next slide
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- SECTION HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Visual Stories
          </div> */}
          
          {/* <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
              Witness
            </span> the Magic
          </h2> */}
          
          {/* <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Watch the breathtaking landscapes and vibrant cultures waiting for you.
          </p> */}
        </motion.div>

        {/* --- CINEMATIC SLIDER --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[300px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white bg-slate-900"
        >
          
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={media_urls.length > 1} // Loop needs careful handling with video refs, but works if key is index
            autoplay={{ 
              delay: 5000, // Default delay for images (5 seconds)
              disableOnInteraction: false 
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            onSlideChange={(swiper) => handleSlideChange(swiper)}
            className="w-full h-full"
          >
            {media_urls.map((rawUrl, index) => {
              const url = getSafeUrl(rawUrl);
              const isVideo = isVideoUrl(rawUrl) || data.type === 'video';

              return (
                <SwiperSlide 
                  key={index} 
                  className="w-full h-full flex items-center justify-center bg-black relative"
                >
                  {isVideo ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)} // Save ref
                      src={url}
                      className="w-full h-full object-cover opacity-90"
                      muted={true} // Must be muted for auto-play policy
                      playsInline={true} // Required for iOS
                      onEnded={handleVideoEnded} // The magic trigger
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`Promo Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Subtle Cinematic Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Buttons */}
          {media_urls.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); swiperRef.current?.swiper?.slidePrev(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-md text-white rounded-full border border-white/20 transition-all hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-0 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); swiperRef.current?.swiper?.slideNext(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-md text-white rounded-full border border-white/20 transition-all hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-0 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </motion.div>

      </div>
    </section>
  );
}