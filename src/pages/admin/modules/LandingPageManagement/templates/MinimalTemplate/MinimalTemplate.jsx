import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plane,
  Hotel,
  Camera,
  Utensils,
  Car,
  Menu,
  X,
  Star,
  ShieldCheck,
  Clock,
  Percent,
  Award,
  Wallet,
  MessageCircle,
  BadgeCheck,
  Globe,
  Target,
  Headphones,
  Gift,
  ArrowRight,
  Pause,
  Play,
  MapPin,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// --- COMPONENTS ---
import UnifiedEnquiryModal from "../ModernTemplate/components/UnifiedEnquiryModal";
import BookingNotification from "../ModernTemplate/components/BookingNotification";
import PopupManager from "../ModernTemplate/components/Popupmanager";
import TestimonialCarousel from "../ModernTemplate/components/TestimonialCarousel";
import FloatingCTA from "../ModernTemplate/components/FloatingCTA";
import PromoMediaSection from "../ModernTemplate/components/PromoMediaSection";

// Social Media Icons
import { Facebook, Instagram, Twitter } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const API_BASE_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const DEFAULT_DOMAIN = "https://www.indianmountainrovers.com";
const CONTACT_NUMBER = "+91-9816259997";
const CONTACT_DISPLAY = "+91-98162 59997";
const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1626621341517-b13d52481e28?q=80&w=2000";

const TRAVELER_AVATARS = [
  "https://randomuser.me/api/portraits/men/77.jpg",
  "https://randomuser.me/api/portraits/men/50.jpg",
  "https://randomuser.me/api/portraits/women/84.jpg",
  "https://randomuser.me/api/portraits/women/22.jpg",
];

const discountText = "50%";

const DEFAULT_TRUST_BADGES = [
  {
    id: "trust-security",
    icon: ShieldCheck,
    title: "100% Trust & Security",
    description: "Your data and payments are fully secured",
  },
  {
    id: "support-247",
    icon: Headphones,
    title: "24/7 Support",
    description: "Round the clock customer assistance",
  },
  {
    id: "best-value",
    icon: Award,
    title: "Best Value Guarantee",
    description: "Competitive prices with no hidden costs",
  },
];

// =============================================================================
// HELPERS
// =============================================================================

// =============================================================================
// HELPERS - FIXED IMAGE HANDLING
// =============================================================================

const toAbsoluteUrl = (url) => {
  if (!url) return null;
  if (typeof url !== "string") return null;

  // Already absolute URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Encode spaces and special characters in the path part only
    try {
      const urlObj = new URL(url);
      const encodedPath = urlObj.pathname.split('/').map(segment => encodeURIComponent(decodeURIComponent(segment))).join('/');
      return `${urlObj.origin}${encodedPath}${urlObj.search}${urlObj.hash}`;
    } catch {
      return url;
    }
  }

  // Relative path from uploads (e.g., /uploads/xyz.jpg or uploads/xyz.jpg)
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    // Encode each path segment
    const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(decodeURIComponent(segment))).join('/');
    return `https://api.yaadigo.com${encodedPath}`;
  }

  // Any other relative path
  if (url.startsWith("/")) {
    const encodedPath = url.split('/').map(segment => encodeURIComponent(decodeURIComponent(segment))).join('/');
    return `https://api.yaadigo.com${encodedPath}`;
  }

  // Fallback: assume it's a relative upload path
  const encoded = encodeURIComponent(url);
  return `https://api.yaadigo.com/uploads/${encoded}`;
};

const normalizeMediaArray = (arr) => {
  if (!arr) return [];
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item) => {
      if (!item) return null;

      // String URL
      if (typeof item === "string") {
        return toAbsoluteUrl(item);
      }

      // Object with various possible keys
      if (typeof item === "object") {
        const possibleKeys = ["url", "path", "src", "image", "file", "media_url"];
        for (const key of possibleKeys) {
          if (item[key]) {
            return toAbsoluteUrl(item[key]);
          }
        }
      }

      return null;
    })
    .filter(Boolean); // Remove nulls
};

const getTripPrice = (trip) => {
  if (trip?.pricing?.fixed_departure?.[0]?.costingPackages?.[0]) {
    return trip.pricing.fixed_departure[0].costingPackages[0].final_price;
  }
  if (trip?.pricing?.customized) {
    return trip.pricing.customized.final_price;
  }
  return trip?.base_price || trip?.price || 0;
};

// =============================================================================
// HERO BACKGROUND (DYNAMIC)  ✅ FIXED
// - slider with parallax scroll (backgroundAttachment fixed)
// - video support (youtube + mp4)
// - supports uploaded images/videos
// =============================================================================

const HeroSlider = ({ images = [], overlayOpacity = 0.4 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartX = useRef(0);
  const intervalRef = useRef(null);

  const slideImages = images?.length ? images : [DEFAULT_HERO_IMAGE];

  const goToSlide = useCallback(
    (i) => {
      setCurrentIndex(i);
    },
    [setCurrentIndex]
  );

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slideImages.length);
  }, [slideImages.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  }, [slideImages.length]);

  // autoplay
  useEffect(() => {
    if (isPlaying && slideImages.length > 1) {
      intervalRef.current = setInterval(() => goToNext(), 5000);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isPlaying, slideImages.length, goToNext]);

  // swipe (mobile)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goToNext() : goToPrev();
  };

  return (
    <div className="absolute inset-0 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* slides */}
      {slideImages.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${image})`,
              backgroundAttachment: "fixed", // ✅ Scrollable / parallax effect
            }}
          />
        </div>
      ))}

      {/* overlay */}
      {/* Overlay */}
      <div
      className="absolute inset-0"
      style={{
      background: `linear-gradient(135deg, rgba(0,0,0,${Math.min(overlayOpacity + 0.4, 0.9)}) 0%, rgba(30,91,168,${Math.min(overlayOpacity + 0.3, 0.8)}) 50%, rgba(0,0,0,${Math.min(overlayOpacity + 0.2, 0.7)}) 100%)`,
      }}
      />

      {/* arrows */}
      {slideImages.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* indicators */}
      {slideImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <div className="flex items-center gap-2">
            {slideImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <span className="text-white/70 text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {slideImages.length}
          </span>
        </div>
      )}
    </div>
  );
};

const HeroVideo = ({ videos = [], overlayOpacity = 0.4 }) => {
  const videoList = videos?.length ? videos : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentVideo = videoList[currentIndex];
  const type = getVideoType(currentVideo);

  const handleVideoEnd = () => {
    if (videoList.length > 1) setCurrentIndex((p) => (p + 1) % videoList.length);
  };

  // fallback if no video
  if (!currentVideo) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${DEFAULT_HERO_IMAGE})`, backgroundAttachment: "fixed" }}
        />
        <div
        className="absolute inset-0"
        style={{
        background: `linear-gradient(135deg, rgba(0,0,0,${Math.min(overlayOpacity + 0.4, 0.9)}) 0%, rgba(30,91,168,${Math.min(overlayOpacity + 0.3, 0.8)}) 50%, rgba(0,0,0,${Math.min(overlayOpacity + 0.2, 0.7)}) 100%)`,
        }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {type === "youtube" ? (
        <iframe
          src={getYouTubeEmbedUrl(currentVideo)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ transform: "scale(1.5)", transformOrigin: "center" }}
          title="Hero Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          src={currentVideo}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop={videoList.length === 1}
          playsInline
          onEnded={handleVideoEnd}
        />
      )}

      {/* overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(26,26,26,${overlayOpacity + 0.3}) 0%, rgba(30,91,168,${overlayOpacity}) 50%, rgba(0,0,0,${Math.max(
            overlayOpacity - 0.1,
            0.1
          )}) 100%)`,
        }}
      />
    </div>
  );
};

// =============================================================================
// FOOTER TRUST BADGES ✅ Individual Badge Cards
// Schema support:
// pageData.footer.trust_badges = { section_title, badges: [{title, description, icon}] }
// =============================================================================

const FooterTrustBadges = ({ pageData }) => {
  const getIconFromKey = (iconKey) => {
    const map = {
      ShieldCheck,
      Headphones,
      Award,
      BadgeCheck,
      CheckCircle,
      Globe,
      Target,
      Wallet,
      Star,
      Clock,
      Gift,
    };
    return map[iconKey] || ShieldCheck;
  };

  const trustConfig = pageData?.footer?.trust_badges;

  const title = trustConfig?.section_title || "Our Guarantee";
  const badges = (trustConfig?.badges || []).length
    ? trustConfig.badges.map((b, idx) => ({
        id: b.id || `badge-${idx}`,
        icon: typeof b.icon === "string" ? getIconFromKey(b.icon) : ShieldCheck,
        title: b.title,
        description: b.description,
      }))
    : DEFAULT_TRUST_BADGES;

  return (
    <div className="py-10">
      <h3 className="text-sm font-bold text-[#F4C430] uppercase tracking-[0.2em] text-center mb-8">
        {title}
      </h3>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {badges.map((badge) => {
          const Icon = badge.icon || ShieldCheck;
          return (
            <div
              key={badge.id}
              className="group flex flex-col items-center p-6 bg-[#1A1A1A]/60 rounded-2xl border border-[#F4C430]/20 hover:border-[#F4C430]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F4C430]/10 min-w-[160px] max-w-[220px]"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#F4C430]/20 to-[#F4C430]/5 rounded-2xl flex items-center justify-center mb-4 group-hover:from-[#F4C430]/30 group-hover:to-[#F4C430]/10 transition-all duration-300 border border-[#F4C430]/30">
                <Icon size={32} className="text-[#F4C430]" strokeWidth={1.5} />
              </div>

              <h4 className="text-white font-bold text-sm text-center leading-tight mb-2">
                {badge.title}
              </h4>

              {badge.description && (
                <p className="text-gray-400 text-[10px] text-center leading-relaxed">
                  {badge.description}
                </p>
              )}

              <div className="mt-3 flex items-center gap-1 text-[#F4C430]">
                <CheckCircle size={12} className="fill-current" />
                <span className="text-[9px] font-semibold uppercase tracking-wider">Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// TRIP CARD
// =============================================================================

const TripCard = ({ trip, onEnquire }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const price = getTripPrice(trip);

  const searchText = `${trip.title} ${trip.inclusions || ""} ${trip.highlights || ""}`.toLowerCase();
  const checkActive = (keywords) => keywords.some((k) => searchText.includes(k));

  const amenities = [
    { label: "Flight", icon: Plane, active: checkActive(["flight", "airfare", "ticket"]) },
    { label: "Hotels", icon: Hotel, active: checkActive(["hotel", "stay", "accommodation", "resort"]) },
    { label: "Sightseeing", icon: Camera, active: checkActive(["sightseeing", "tour", "visit"]) },
    { label: "Meals", icon: Utensils, active: checkActive(["meal", "breakfast", "dinner", "food"]) },
    { label: "Transfers", icon: Car, active: checkActive(["transfer", "cab", "taxi", "drive", "volvo"]) },
  ];

  const itineraryList = trip.itinerary || [];
  const inclusionsList = trip.inclusions ? trip.inclusions.split(";") : [];
  const visibleItinerary = isExpanded ? itineraryList : itineraryList.slice(0, 2);
  const visibleInclusions = isExpanded ? inclusionsList : inclusionsList.slice(0, 2);

  return (
    <div className="bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col h-full relative group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={trip.hero_image || trip.image || DEFAULT_HERO_IMAGE}
          alt={trip.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-[#1E5BA8]/20 group-hover:bg-[#1E5BA8]/30 transition-colors" />

        {/* {price > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse shadow-lg">
            SAVE {Math.round(((price * 1.4 - price) / (price * 1.4)) * 100)}%
          </div>
        )} */}

        <div className="absolute bottom-[-20px] right-4 bg-white p-2 rounded-full shadow-lg border-2 border-[#F4C430] z-10 w-12 h-12 flex items-center justify-center">
          <Star className="text-[#F4C430] w-6 h-6 fill-current" />
        </div>
      </div>

      <div className="p-4 pt-8 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-[#1E5BA8] leading-tight mb-2 min-h-[56px] line-clamp-2">
          {trip.title}
        </h2>

        <h3 className="text-sm font-semibold text-[#4A5568] mb-4 border-b border-gray-100 pb-2">
          Duration:{" "}
          <span className="text-[#2D5D3F] font-bold">
            {trip.days} Days / {trip.nights} Nights
          </span>
        </h3>

        <div className="flex justify-between items-center mb-5 px-1 bg-[#F5F7FA] py-3 rounded-lg border border-slate-100">
          {amenities.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`p-2 rounded-full transition-all duration-300 ${
                  item.active
                    ? "bg-white text-[#2D5D3F] shadow-md ring-1 ring-[#2D5D3F]/20 scale-110"
                    : "bg-transparent text-gray-300 grayscale opacity-40"
                }`}
              >
                <item.icon size={16} strokeWidth={item.active ? 2.5 : 2} />
              </div>
              <span
                className={`text-[9px] uppercase font-bold tracking-wide ${
                  item.active ? "text-[#1E5BA8]" : "text-[#4A5568]"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white p-0 mb-4 flex-1">
          <div className="mb-4">
            <h5 className="text-xs font-black uppercase text-[#1E5BA8] mb-2 flex items-center gap-1">
              <Calendar size={12} /> Itinerary
            </h5>

            <ul className="space-y-2.5">
              {visibleItinerary.length > 0 ? (
                visibleItinerary.map((day, idx) => (
                  <li key={idx} className="text-xs leading-snug text-[#1A1A1A] font-medium">
                    {day?.title || day}
                  </li>
                ))
              ) : (
                <li className="text-xs text-[#4A5568]">Details on request.</li>
              )}
            </ul>
          </div>

          <div className="mb-3">
            <h5 className="text-xs font-black uppercase text-[#1E5BA8] mb-2 flex items-center gap-1">
              <CheckCircle size={12} /> Inclusions
            </h5>

            <ul className="space-y-1">
              {visibleInclusions.length > 0 ? (
                visibleInclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#4A5568]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D5D3F] mt-1.5 shrink-0" />
                    <span>{inc.trim()}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-[#4A5568]">Inclusions on request.</li>
              )}
            </ul>
          </div>

          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="w-full text-center mt-2 text-sm font-bold text-[#2D5D3F] hover:text-[#1E5BA8] flex items-center justify-center gap-1 transition-colors py-2 bg-[#F5F7FA] rounded-md"
          >
            {isExpanded ? "Show Less" : "Read More Details"}
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <div className="mt-auto border-t border-dashed border-gray-300 pt-4">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                {price > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{(price * 1.4).toLocaleString()}
                  </span>
                )}
                <span className="text-3xl font-black text-[#1E5BA8]">
                  {price > 0 ? `₹${price.toLocaleString()}` : "Request"}
                </span>
              </div>
              <span className="text-[10px] text-[#4A5568] font-bold uppercase">Per Person</span>
            </div>

            {price > 0 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            SAVE UPTO {discountText}
            </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onEnquire(trip)}
              className="bg-[#F4C430] hover:bg-[#e0b020] text-[#1A1A1A] text-xs font-bold px-3 py-2.5 rounded shadow-md transition-all flex items-center justify-center gap-1"
            >
              <Mail size={14} /> Enquire
            </button>

            <a
              href={`https://wa.me/${CONTACT_NUMBER.replace(/[^0-9]/g, "")}?text=Hi, I'm interested in ${encodeURIComponent(
                trip.title
              )}`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-2.5 rounded shadow-md transition-all flex items-center justify-center gap-1"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-gray-600 bg-green-50 py-1.5 rounded border border-green-100">
            <CheckCircle size={12} className="text-green-600" />
            <span className="font-semibold">Instant Confirmation • No Hidden Charges</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN
// =============================================================================

export default function MinimalTemplate({ pageData }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [allTrips, setAllTrips] = useState([]);
  const [mainPackages, setMainPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ FIXED hero config (handles any schema + uploads) - with proper fallbacks
  const heroConfig = useMemo(() => {
  const hero = pageData?.hero || {};

  console.log("=== HERO DEBUG START ===");
  console.log("background_type:", hero.background_type);
  console.log("background_images RAW:", hero.background_images);
  console.log("background_videos RAW:", hero.background_videos);
  
  // Normalize media arrays
  const images = normalizeMediaArray(hero.background_images);
  const videos = normalizeMediaArray(hero.background_videos);

  console.log("AFTER normalization - images:");
  images.forEach((img, i) => console.log(`  [${i}]:`, img));
  console.log("AFTER normalization - videos:");
  videos.forEach((vid, i) => console.log(`  [${i}]:`, vid));
  console.log("=== HERO DEBUG END ===");

  // Use normalized images or fallback
  const finalImages = images.length > 0 ? images : [DEFAULT_HERO_IMAGE];

  return {
    type: hero.background_type || "slider",
    images: finalImages,
    videos: videos,
    overlayOpacity: hero.overlay_opacity ?? 0.4,
    title: hero.title || pageData?.page_name || "Welcome to Your Dream Destination",
    subtitle: hero.subtitle || "",
    description: hero.description || "",
    cta1: hero.cta_button_1 || { text: "Explore Destinations", link: "#packages" },
    cta2: hero.cta_button_2 || { text: "Get Quote", link: "#contact" },
  };
}, [pageData]);

  const showHeaderAlert = pageData?.offers?.header?.enabled;
  const showFooterAlert = pageData?.offers?.footer?.enabled;
  const alertText = pageData?.offers?.header?.text || "🔥 Special Offer: Book Now & Save Up to 50%!";

  // Fetch trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/trips`, { headers: { "x-api-key": API_KEY } });
        const data = await res.json();
        const fetched = data?.data || data || [];
        setAllTrips(fetched);

        if (pageData?.packages?.selected_trips?.length) {
          const selected = fetched.filter((t) =>
            pageData.packages.selected_trips.some((st) => st.trip_id === t.id)
          );
          setMainPackages(selected);
        } else {
          setMainPackages(fetched.slice(0, 6));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [pageData]);

  const [heroFormData, setHeroFormData] = useState({
    destination: "",
    departure_city: "Website Form",
    travel_date: new Date().toISOString().split("T")[0],
    adults: 2,
    children: 0,
    infants: 0,
    hotel_category: "3 Star",
    full_name: "",
    contact_number: "",
    email: "",
    additional_comments: "Landing page enquiry",
    domain_name: DEFAULT_DOMAIN,
  });

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    if (heroSubmitting) return;
    setHeroSubmitting(true);

    try {
      const submissionData = {
        destination: heroFormData.destination || pageData?.page_name || "Tour",
        departure_city: "Landing Page Form",
        travel_date: heroFormData.travel_date,
        adults: parseInt(heroFormData.adults) || 2,
        children: parseInt(heroFormData.children) || 0,
        infants: parseInt(heroFormData.infants) || 0,
        hotel_category: heroFormData.hotel_category || "3 Star",
        full_name: heroFormData.full_name,
        contact_number: heroFormData.contact_number,
        email: heroFormData.email,
        additional_comments: `Landing Page: ${pageData?.slug || "website"}`,
        domain_name: DEFAULT_DOMAIN,
      };

      const res = await fetch(`${API_BASE_URL}/enquires`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      const firstName = heroFormData.full_name?.split(" ")?.[0] || "Traveler";
      toast.success(`Thanks ${firstName}! Our team will call you within 5 minutes.`);

      setHeroFormData((p) => ({
        ...p,
        full_name: "",
        contact_number: "",
        email: "",
        destination: "",
      }));
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Check connection.");
    } finally {
      setHeroSubmitting(false);
    }
  };

  const handleEnquire = (trip) => {
    setSelectedTrip(trip);
    setIsEnquiryOpen(true);
  };

  // Social media links
  const socialLinks = [
    { platform: "facebook", url: "https://www.facebook.com/people/Holidays-Planners/61569765904314/", icon: Facebook },
    { platform: "instagram", url: "https://www.instagram.com/planners.holiday/", icon: Instagram },
    { platform: "twitter", url: "https://x.com/Holidays_planne", icon: Twitter },
  ];

  return (
    <div className="w-full min-h-screen bg-white font-sans text-[#1A1A1A]">
      <Toaster position="top-right" />
      <PopupManager offersConfig={pageData?.offers} pageName={pageData?.page_name} pageSlug={pageData?.slug} />
      <BookingNotification pageData={pageData} />

      {/* Header Alert */}
      {showHeaderAlert && (
        <div
          className="py-2.5 px-4 text-center sticky top-0 z-[60] shadow-md"
          style={{
            backgroundColor: pageData?.offers?.header?.background_color || "#dc2626",
            color: pageData?.offers?.header?.text_color || "#ffffff",
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm font-bold">
            <Clock size={16} className="animate-bounce" />
            <span className="animate-pulse">{alertText}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className="bg-white border-b border-gray-100 sticky z-50 h-20 shadow-md"
        style={{ top: showHeaderAlert ? "40px" : "0" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="h-16 w-48 flex-shrink-0 flex items-center">
              <img
                src={pageData?.company?.logo || "/holidaysplanners-logo.png"}
                alt={pageData?.company?.name || "Logo"}
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href={`tel:${CONTACT_NUMBER}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#1E5BA8] group-hover:bg-[#1E5BA8] group-hover:text-white transition-colors">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#4A5568] uppercase font-bold tracking-wider leading-none mb-1">
                    Call Us
                  </span>
                  <span className="text-sm font-black text-[#1A1A1A] group-hover:text-[#1E5BA8] leading-none">
                    {CONTACT_DISPLAY}
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${pageData?.company?.emails?.[0]?.value || "info@indianmountainrovers.com"}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#2D5D3F] group-hover:bg-[#2D5D3F] group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#4A5568] uppercase font-bold tracking-wider leading-none mb-1">
                    Email Us
                  </span>
                  <span className="text-sm font-black text-[#1A1A1A] group-hover:text-[#2D5D3F] leading-none">
                    {pageData?.company?.emails?.[0]?.value || "info@indianmountainrovers.com"}
                  </span>
                </div>
              </a>

              <a
                href={`https://wa.me/${CONTACT_NUMBER.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md animate-pulse"
              >
                <MessageCircle size={20} />
              </a>

              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="bg-[#F4C430] hover:bg-[#e0b020] text-[#1A1A1A] px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-yellow-500/40 transition-all transform hover:-translate-y-0.5 animate-pulse"
              >
                Get Call Back in 5 Minutes
              </button>
            </div>

            <button className="md:hidden p-2 text-[#1E5BA8]" onClick={() => setIsMobileMenuOpen((v) => !v)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden min-h-[85vh] md:min-h-[650px] flex items-center bg-[#1E5BA8] group">
        {/* ✅ Dynamic background */}
        {heroConfig.type === "video" ? (
          <HeroVideo videos={heroConfig.videos} overlayOpacity={heroConfig.overlayOpacity} />
        ) : (
          <HeroSlider images={heroConfig.images} overlayOpacity={heroConfig.overlayOpacity} />
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative z-10 w-full">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="w-full md:w-2/3 text-white pt-4">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F4C430] to-[#E67E22] text-[#1A1A1A] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-6 shadow-lg shadow-yellow-500/20">
                  <Percent size={14} strokeWidth={3} />
                  <span>Special Festival Offers</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight text-white drop-shadow-lg">
                  {heroConfig.subtitle && (
                    <span className="block text-lg md:text-xl font-medium text-white/80 mb-2">
                      {heroConfig.subtitle}
                    </span>
                  )}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4C430] to-yellow-200">
                    {heroConfig.title}
                  </span>
                </h1>

                {heroConfig.description && (
                  <p className="text-lg text-white/80 mb-6 max-w-xl">{heroConfig.description}</p>
                )}

                <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                  {["SHIMLA", "MANALI", "DALHOUSIE", "DHARAMSHALA", "KINNAUR", "SPITI"].map((place) => (
                    <li key={place} className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F4C430] shadow-[0_0_8px_rgba(244,196,48,1)]" />
                      {place}
                    </li>
                  ))}
                </ul>

                <div className="border-l-4 border-[#F4C430] pl-6 py-2 bg-white/5 backdrop-blur-sm rounded-r-lg max-w-md">
                  <h4 className="text-lg font-light text-slate-200">Grab the Exciting</h4>
                  <h4 className="text-2xl font-bold text-white">
                    Deals upto <span className="text-[#F4C430]">50% OFF</span>
                  </h4>
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <div className="w-full md:w-1/3 md:sticky md:top-24">
              <div className="bg-white rounded-xl shadow-2xl p-6 relative overflow-visible mt-6 md:mt-0">
                <div className="absolute -top-4 -right-4 bg-[#F4C430] text-[#1A1A1A] w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-[#1E5BA8] animate-pulse">
                  <span className="text-xs font-bold">SAVE</span>
                  <span className="text-sm font-black leading-none">50%</span>
                </div>

                <div className="bg-[#1E5BA8] text-white text-center py-3 -mx-6 -mt-6 mb-6 rounded-t-xl">
                  <h3 className="font-bold uppercase tracking-wide text-sm">Get Best Price Quote</h3>
                </div>

                <form onSubmit={handleHeroSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-[#1A1A1A] focus:border-[#F4C430] focus:ring-2 focus:ring-[#F4C430]/20 outline-none text-sm font-medium transition-all"
                    value={heroFormData.full_name}
                    onChange={(e) => setHeroFormData({ ...heroFormData, full_name: e.target.value })}
                  />

                  <input
                    type="tel"
                    placeholder="WhatsApp Number *"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-[#1A1A1A] focus:border-[#F4C430] focus:ring-2 focus:ring-[#F4C430]/20 outline-none text-sm font-medium transition-all"
                    value={heroFormData.contact_number}
                    onChange={(e) => setHeroFormData({ ...heroFormData, contact_number: e.target.value })}
                  />

                  <input
                    type="email"
                    placeholder="Email Address *"
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-[#1A1A1A] focus:border-[#F4C430] focus:ring-2 focus:ring-[#F4C430]/20 outline-none text-sm font-medium transition-all"
                    value={heroFormData.email}
                    onChange={(e) => setHeroFormData({ ...heroFormData, email: e.target.value })}
                  />

                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 p-2 rounded border border-green-200">
                    <ShieldCheck size={14} className="text-green-600" />
                    <span>100% Safe • No Spam • Get Quote in 5 Minutes</span>
                  </div>

                  <button
                    type="submit"
                    disabled={heroSubmitting}
                    className="w-full bg-gradient-to-r from-[#F4C430] to-[#E67E22] hover:from-[#e0b020] hover:to-[#d16d1a] text-[#1A1A1A] font-bold py-4 rounded-lg uppercase tracking-wider transition-all shadow-xl text-sm flex items-center justify-center gap-2 group"
                  >
                    {heroSubmitting ? (
                      <div className="w-5 h-5 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Get Best Price Quote</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                      </>
                    )}
                  </button>

                  <div className="text-center text-xs text-gray-600 flex items-center justify-center gap-2">
                    <div className="flex -space-x-2">
                      {TRAVELER_AVATARS.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt="Traveler"
                          className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
                          loading="lazy"
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-[#1E5BA8]">500+ travelers booked this month</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-12 bg-[#F5F7FA] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-2 tracking-tight">
              {pageData?.packages?.section_title || "🔥 Hot Selling Packages - Limited Time Offer!"}
            </h1>
            <h5 className="text-[#4A5568] font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {pageData?.packages?.section_subtitle || "Explore our hand-picked packages"}
            </h5>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-[#4A5568]">
                <div className="w-12 h-12 border-4 border-[#1E5BA8]/30 border-t-[#1E5BA8] rounded-full animate-spin mx-auto mb-4" />
                Loading Amazing Deals...
              </div>
            ) : (
              mainPackages.map((trip) => <TripCard key={trip.id} trip={trip} onEnquire={handleEnquire} />)
            )}
          </div>
        </div>
      </section>

      {/* --- ABOUT US (AS YOU HAD) --- */}
      <section id="about" className="py-16 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#1E5BA8] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F4C430] rounded-full blur-3xl"></div>
        </div>

        <div className="absolute top-10 right-10 opacity-5 hidden lg:block">
          <BadgeCheck size={300} className="text-[#2D5D3F]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="flex flex-col justify-center order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-[#1E5BA8]/10 text-[#1E5BA8] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-4 w-fit">
                <Award size={14} /> Local Himachal Experts
              </div>

              <h2 className="text-4xl font-black text-[#1A1A1A] mb-4">
                Why Choose <span className="text-[#1E5BA8]">Holidays Planners</span>?
              </h2>

              <p className="text-[#4A5568] leading-relaxed mb-6 text-base">
                <span className="font-bold text-[#1E5BA8]">Based in Himachal Pradesh</span>, we're locals who know every hidden gem and secret route.
                With over <span className="font-bold text-[#1E5BA8]">15 years of experience</span> and{" "}
                <span className="font-bold text-[#2D5D3F]">Government Tourism approval</span>, we guarantee the best prices and authentic experiences.
                No middlemen, just direct local expertise.
              </p>

              <ul className="space-y-3 mb-8 font-bold text-[#1A1A1A] text-base">
                {[
                  { icon: Target, text: 'Himachal Locals - Best Insider Knowledge' },
                  { icon: BadgeCheck, text: 'Govt. Approved by Tourism India' },
                  { icon: Wallet, text: 'Lowest Prices - Direct Local Rates' },
                  { icon: Headphones, text: '24×7 Support - On-Trip Assistance' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon size={20} className="text-[#1A1A1A]" />
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="bg-[#1E5BA8] hover:bg-[#164a8a] text-white px-8 py-4 rounded-lg shadow-lg font-bold uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-2 group"
                >
                  Get Custom Package <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href={`tel:${CONTACT_NUMBER}`}
                  className="border-2 border-[#1E5BA8] text-[#1E5BA8] hover:bg-[#1E5BA8] hover:text-white px-8 py-4 rounded-lg font-bold uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={18} /> Call Now
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img src="https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2024/03/15143552/Kalpa.jpg?w=400&h=300&fit=crop" alt="Himachal Mountains" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">Breathtaking Views</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop" alt="Luxury Hotels" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">Premium Hotels</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop" alt="Adventure Activities" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">Adventure Awaits</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop" alt="Happy Travelers" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">Happy Travelers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Govt. Approved", sub: "Himachal Tourism", icon: BadgeCheck, color: "#2D5D3F", bg: "from-green-50 to-emerald-50", iconBg: "bg-white" },
              { title: "15+ Years", sub: "Industry Experience", icon: Award, color: "#F4C430", bg: "from-yellow-50 to-amber-50", iconBg: "bg-white" },
              { title: "4.9/5 Rating", sub: "10,000+ Reviews", icon: Star, color: "#F4C430", bg: "from-yellow-50 to-orange-50", iconBg: "bg-white" },
              { title: "24/7 Support", sub: "On-Trip Assistance", icon: Headphones, color: "#1E5BA8", bg: "from-blue-50 to-sky-50", iconBg: "bg-white" },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${card.bg} p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group`}
                style={{ minHeight: '180px' }}
              >
                <div className={`w-16 h-16 ${card.iconBg} rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <card.icon size={32} style={{ color: card.color }} strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-[#1A1A1A] text-lg mb-1">{card.title}</h4>
                <p className="text-xs text-[#4A5568] font-semibold">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* Promo Banner */}
      {pageData?.offers?.mid_section?.enabled && (
        <PromoMediaSection
          data={pageData.offers.mid_section}
          primaryColor="#1E5BA8"
          secondaryColor="#2D5D3F"
        />
      )}

      {/* Testimonials */}
      {pageData?.testimonials?.items?.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <TestimonialCarousel testimonials={pageData.testimonials.items} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1E5BA8] via-[#2D5D3F] to-[#1E5BA8] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left text-white">
              <h2 className="text-2xl md:text-3xl font-black mb-2">Ready for Your Adventure?</h2>
              <p className="text-lg opacity-90">
                Book now and save up to <span className="text-[#F4C430] font-black">50%</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href={`tel:${CONTACT_NUMBER}`}
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF9F00] text-white px-6 sm:px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-2xl transition-all flex items-center justify-center gap-3 animate-pulse whitespace-nowrap"
              >
                <Phone size={20} /> Call: {CONTACT_DISPLAY}
              </a>
              <a
                href={`https://wa.me/${CONTACT_NUMBER.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-2xl transition-all flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-[#0D0D0D] to-[#000000] text-white pt-12 pb-6 border-t-4 border-[#F4C430] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* ✅ Individual Trust Badge Cards */}
          <FooterTrustBadges pageData={pageData} />

          <div className="grid md:grid-cols-3 gap-8 items-start pt-8 border-t border-gray-800 mt-8">
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-bold text-[#F4C430] uppercase text-xs tracking-widest mb-4">Contact Us</h4>
              <a href={`tel:${CONTACT_NUMBER}`} className="text-xl font-black text-white hover:text-[#F4C430] transition-colors tracking-wide flex items-center gap-2 mb-2">
                <Phone size={18} /> {CONTACT_DISPLAY}
              </a>
              <a
                href={`mailto:${pageData?.company?.emails?.[0]?.value || "info@indianmountainrovers.com"}`}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Mail size={18} /> {pageData?.company?.emails?.[0]?.value || "info@indianmountainrovers.com"}
              </a>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="font-bold text-[#F4C430] uppercase text-xs tracking-widest mb-4">Office</h4>
              {pageData?.company?.addresses?.[0]?.map_link ? (
                <a
                  href={pageData.company.addresses[0].map_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-400 hover:text-[#F4C430] transition-colors text-center flex items-start gap-2 group"
                >
                  <MapPin size={14} className="mt-0.5 group-hover:text-[#F4C430]" />
                  <span>{pageData.company.addresses[0].street}</span>
                </a>
              ) : (
                <div className="text-xs text-gray-400 text-center flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5" />
                  <span>{pageData?.company?.addresses?.[0]?.street || "Himachal Pradesh, India"}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center md:items-end">
              <h4 className="font-bold text-[#F4C430] uppercase text-xs tracking-widest mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 bg-white/10 hover:bg-[#F4C430] rounded-full flex items-center justify-center transition-all group"
                      aria-label={social.platform}
                    >
                      <IconComponent size={18} className="text-white group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-4 border-t border-gray-900 text-center flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">
              © Copyright {new Date().getFullYear()}, {pageData?.company?.name || "Holidays Planners"}. All Rights Reserved.
            </p>
            <p className="text-[10px] text-gray-700">
              Privacy Policy | Terms & Conditions | Cancellation Policy
            </p>
          </div>
        </div>
      </footer>

      {/* Footer Alert */}
      {showFooterAlert && (
        <div
          className="py-3 px-4 text-center"
          style={{
            backgroundColor: pageData?.offers?.footer?.background_color || "#059669",
            color: pageData?.offers?.footer?.text_color || "#ffffff",
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm font-bold">
            <Gift size={16} className="animate-bounce" />
            <span className="animate-pulse">{pageData?.offers?.footer?.text || alertText}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <UnifiedEnquiryModal
        trip={selectedTrip}
        isOpen={isEnquiryOpen}
        onClose={() => {
          setIsEnquiryOpen(false);
          setSelectedTrip(null);
        }}
        pageName={pageData?.page_name}
        pageSlug={pageData?.slug}
        offersConfig={pageData?.offers}
      />

      <FloatingCTA
        settings={pageData?.company || {}}
        offersConfig={pageData?.offers}
        onOpenEnquiry={() => setIsEnquiryOpen(true)}
      />
    </div>
  );
}