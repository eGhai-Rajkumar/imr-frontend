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
  Heart,
  Leaf,
  Briefcase,
  Eye,
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
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const API_BASE_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const DEFAULT_DOMAIN = "https://www.indianmountainrovers.com";
const CONTACT_NUMBER = "+91-8278829941";
const CONTACT_DISPLAY = "+91 82788 29941";
const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1626621341517-b13d52481e28?q=80&w=2000";

// Brand Colors
const BRAND = {
  GREEN: "#2C6B4F",
  GOLD: "#D4AF37",
  CREAM: "#FDFBF7",
  TEXT: "#1A1A1A",
};

const TRAVELER_AVATARS = [
  "https://randomuser.me/api/portraits/men/77.jpg",
  "https://randomuser.me/api/portraits/men/50.jpg",
  "https://randomuser.me/api/portraits/women/84.jpg",
  "https://randomuser.me/api/portraits/women/22.jpg",
];

const discountText = "50%";

const DEFAULT_TRUST_BADGES = [
  {
    id: "val-honesty",
    icon: ShieldCheck,
    title: "Honesty",
    description: "Honest communication & fair pricing",
  },
  {
    id: "val-transparency",
    icon: Eye,
    title: "Transparency",
    description: "Clear products & processes",
  },
  {
    id: "val-quality",
    icon: Award,
    title: "Quality",
    description: "Excellent service & top partners",
  },
  {
    id: "val-personal",
    icon: Heart,
    title: "Personal",
    description: "Tailored advice & friendly service",
  },
  {
    id: "val-sustainable",
    icon: Leaf,
    title: "Sustainable",
    description: "Responsible tourism",
  },
  {
    id: "val-professional",
    icon: Briefcase,
    title: "Integrity & efficiency",
    description: "Integrity & efficiency",
  },
];

// =============================================================================
// HELPERS
// =============================================================================

const toAbsoluteUrl = (url) => {
  if (!url) return null;
  if (typeof url !== "string") return null;

  // Already absolute URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const urlObj = new URL(url);
      const encodedPath = urlObj.pathname.split('/').map(segment => encodeURIComponent(decodeURIComponent(segment))).join('/');
      return `${urlObj.origin}${encodedPath}${urlObj.search}${urlObj.hash}`;
    } catch {
      return url;
    }
  }

  // Relative path from uploads
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(decodeURIComponent(segment))).join('/');
    return `https://api.yaadigo.com${encodedPath}`;
  }

  // Any other relative path
  if (url.startsWith("/")) {
    const encodedPath = url.split('/').map(segment => encodeURIComponent(decodeURIComponent(segment))).join('/');
    return `https://api.yaadigo.com${encodedPath}`;
  }

  // Fallback
  const encoded = encodeURIComponent(url);
  return `https://api.yaadigo.com/uploads/${encoded}`;
};

const normalizeMediaArray = (arr) => {
  if (!arr) return [];
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") return toAbsoluteUrl(item);
      if (typeof item === "object") {
        const possibleKeys = ["url", "path", "src", "image", "file", "media_url"];
        for (const key of possibleKeys) {
          if (item[key]) return toAbsoluteUrl(item[key]);
        }
      }
      return null;
    })
    .filter(Boolean);
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
// HERO BACKGROUND (DYNAMIC)
// =============================================================================

const HeroSlider = ({ images = [], overlayOpacity = 0.4 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartX = useRef(0);
  const intervalRef = useRef(null);
  const slideImages = images?.length ? images : [DEFAULT_HERO_IMAGE];

  const goToSlide = useCallback((i) => setCurrentIndex(i), []);
  const goToNext = useCallback(() => setCurrentIndex((prev) => (prev + 1) % slideImages.length), [slideImages.length]);
  const goToPrev = useCallback(() => setCurrentIndex((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1)), [slideImages.length]);

  useEffect(() => {
    if (isPlaying && slideImages.length > 1) {
      intervalRef.current = setInterval(() => goToNext(), 5000);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isPlaying, slideImages.length, goToNext]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goToNext() : goToPrev();
  };

  return (
    <div className="absolute inset-0 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {slideImages.map((image, index) => (
        <div key={`${image}-${index}`} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${image})`, backgroundAttachment: "fixed" }} />
        </div>
      ))}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(0,0,0,${Math.min(overlayOpacity + 0.4, 0.9)}) 0%, rgba(44,107,79,${Math.min(overlayOpacity + 0.3, 0.8)}) 50%, rgba(0,0,0,${Math.min(overlayOpacity + 0.2, 0.7)}) 100%)` }} />

      {slideImages.length > 1 && (
        <>
          <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110" aria-label="Previous slide"><ChevronLeft size={24} /></button>
          <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110" aria-label="Next slide"><ChevronRight size={24} /></button>
        </>
      )}

      {slideImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <button onClick={() => setIsPlaying((p) => !p)} className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all">{isPlaying ? <Pause size={14} /> : <Play size={14} />}</button>
          <div className="flex items-center gap-2">
            {slideImages.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"}`} />
            ))}
          </div>
          <span className="text-white/70 text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">{currentIndex + 1} / {slideImages.length}</span>
        </div>
      )}
    </div>
  );
};

const HeroVideo = ({ videos = [], overlayOpacity = 0.4 }) => {
  const videoList = videos?.length ? videos : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideo = videoList[currentIndex];

  const handleVideoEnd = () => { if (videoList.length > 1) setCurrentIndex((p) => (p + 1) % videoList.length); };

  if (!currentVideo) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${DEFAULT_HERO_IMAGE})`, backgroundAttachment: "fixed" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(0,0,0,${Math.min(overlayOpacity + 0.4, 0.9)}) 0%, rgba(44,107,79,${Math.min(overlayOpacity + 0.3, 0.8)}) 50%, rgba(0,0,0,${Math.min(overlayOpacity + 0.2, 0.7)}) 100%)` }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video src={currentVideo} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop={videoList.length === 1} playsInline onEnded={handleVideoEnd} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(26,26,26,${overlayOpacity + 0.3}) 0%, rgba(44,107,79,${overlayOpacity}) 50%, rgba(0,0,0,${Math.max(overlayOpacity - 0.1, 0.1)}) 100%)` }} />
    </div>
  );
};

// =============================================================================
// FOOTER TRUST BADGES
// =============================================================================

const FooterTrustBadges = ({ pageData }) => {
  const getIconFromKey = (iconKey) => {
    const map = { ShieldCheck, Headphones, Award, BadgeCheck, CheckCircle, Globe, Target, Wallet, Star, Clock, Gift };
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
      <h3 className="text-sm font-bold text-[#F4C430] uppercase tracking-[0.2em] text-center mb-8">{title}</h3>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {badges.map((badge) => {
          const Icon = badge.icon || ShieldCheck;
          return (
            <div key={badge.id} className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4AF37]/10 min-w-[160px] max-w-[220px]">
              <div className="w-16 h-16 bg-[#FDFBF7] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#2C6B4F] transition-all duration-300 border border-[#D4AF37]/20">
                <Icon size={32} className="text-[#D4AF37] group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h4 className="text-[#1A1A1A] font-bold text-sm text-center leading-tight mb-2">{badge.title}</h4>
              {badge.description && <p className="text-slate-500 text-[10px] text-center leading-relaxed">{badge.description}</p>}
              <div className="mt-3 flex items-center gap-1 text-[#D4AF37]"><CheckCircle size={12} className="fill-current" /><span className="text-[9px] font-semibold uppercase tracking-wider">Verified</span></div>
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
  const originalPrice = price > 0 ? Math.round(price * 1.4) : 0;
  const searchText = `${trip.title} ${trip.inclusions || ""} ${trip.highlights || ""}`.toLowerCase();
  const checkActive = (keywords) => keywords.some((k) => searchText.includes(k));

  const amenities = [
    { label: "Flight", icon: Plane, active: checkActive(["flight", "airfare", "ticket"]) },
    { label: "Hotels", icon: Hotel, active: checkActive(["hotel", "stay", "accommodation", "resort"]) },
    { label: "Sightseeing", icon: Camera, active: checkActive(["sightseeing", "tour", "visit"]) },
    { label: "Meals", icon: Utensils, active: checkActive(["meal", "breakfast", "dinner", "food"]) },
    { label: "Transfers", icon: Car, active: checkActive(["transfer", "cab", "taxi", "drive", "volvo"]) },
  ];

  const tripSlug = trip.slug || `trip-${trip._id || trip.id}`;
  const tripId = trip._id || trip.id;
  const tripPath = `/trip-preview/${tripSlug}/${tripId}`;
  const whatsappNumber = CONTACT_NUMBER.replace(/[^0-9]/g, "");
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in the trip: ${trip.title}. Please share more details.`);

  // Parse itinerary days from trip data
  const itineraryDays = trip.itinerary?.days || trip.itinerary || [];
  const itineraryPreview = Array.isArray(itineraryDays)
    ? itineraryDays.slice(0, 2).map((d, i) => ({
      day: d.day_number || i + 1,
      title: d.title || d.day_title || `Day ${i + 1}`,
    }))
    : [];

  // Parse inclusions
  const inclusionsList = (() => {
    if (Array.isArray(trip.inclusions)) return trip.inclusions.slice(0, 3);
    if (typeof trip.inclusions === "string") {
      return trip.inclusions.split(/[\n,•]/).map(s => s.trim()).filter(Boolean).slice(0, 3);
    }
    return [];
  })();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100">
      {/* ── Image ── */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={trip.hero_image || trip.image || DEFAULT_HERO_IMAGE}
          alt={trip.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {/* Star badge */}
        <div className="absolute top-3 right-3 w-9 h-9 bg-[#F4C430] rounded-full flex items-center justify-center shadow-lg">
          <Star size={16} className="text-white fill-white" />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Title */}
        <h2 className="text-base font-bold text-[#1A1A1A] leading-snug mb-1 line-clamp-2">
          {trip.title}
        </h2>

        {/* Duration */}
        <p className="text-xs font-bold text-[#2C6B4F] mb-3">
          Duration: {trip.days} Days / {trip.nights} Nights
        </p>

        {/* Amenity Icons */}
        <div className="flex items-center justify-between mb-4 border-t border-b border-slate-100 py-3">
          {amenities.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${item.active ? 'border-[#2C6B4F]/30 bg-[#2C6B4F]/8 text-[#2C6B4F]' : 'border-slate-200 bg-slate-50 text-slate-300'}`}>
                <item.icon size={15} />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${item.active ? 'text-[#2C6B4F]' : 'text-slate-300'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Itinerary Preview */}
        {itineraryPreview.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-bold text-[#2C6B4F] uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <Calendar size={11} /> Itinerary
            </p>
            {itineraryPreview.map((d) => (
              <p key={d.day} className="text-xs text-slate-600 leading-relaxed">
                Day {d.day} {d.title}
              </p>
            ))}
          </div>
        )}

        {/* Inclusions Preview */}
        {inclusionsList.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-bold text-[#2C6B4F] uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <CheckCircle size={11} /> Inclusions
            </p>
            {inclusionsList.map((inc, i) => (
              <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                <span className="text-[#2C6B4F] mt-0.5 flex-shrink-0">•</span>
                {inc}
              </p>
            ))}
          </div>
        )}

        {/* Read More Toggle */}
        <button
          onClick={() => setIsExpanded(v => !v)}
          className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg py-2 hover:bg-slate-50 transition-colors mb-4"
        >
          {isExpanded ? (
            <><ChevronUp size={13} /> Show Less</>
          ) : (
            <><ChevronDown size={13} /> Read More Details</>
          )}
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mb-4 space-y-3" style={{ animation: 'fadeInDown 0.2s ease-out' }}>
            {/* All amenities */}
            <div>
              <p className="text-[10px] font-bold text-[#2C6B4F] uppercase tracking-wider mb-2">All Inclusions</p>
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((item, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${item.active
                      ? 'bg-[#2C6B4F]/10 text-[#2C6B4F] border-[#2C6B4F]/20'
                      : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                      }`}
                  >
                    <item.icon size={10} /> {item.label}
                  </span>
                ))}
              </div>
            </div>
            {/* Highlights */}
            {trip.highlights && (() => {
              const pts = trip.highlights
                .replace(/•\s*/g, '')
                .split(/\n|;|(?<=\.)\s+/)
                .map(s => s.trim().replace(/^[-•]\s*/, ''))
                .filter(s => s.length > 2);
              return pts.length > 0 ? (
                <div>
                  <p className="text-[10px] font-bold text-[#2C6B4F] uppercase tracking-wider mb-1.5">Highlights</p>
                  <ul className="space-y-1">
                    {pts.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
                        <span className="text-[#2C6B4F] mt-0.5 flex-shrink-0">•</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}

            <a
              href={tripPath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#2C6B4F] text-xs font-bold hover:text-[#D4AF37] transition-colors"
            >
              View Full Trip Details <ArrowRight size={11} />
            </a>
          </div>
        )}

        {/* ── Price Row ── */}
        <div className="flex items-end justify-between mb-3 mt-auto">
          <div>
            {originalPrice > 0 && (
              <span className="text-xs text-slate-400 line-through block">₹{originalPrice.toLocaleString()}</span>
            )}
            <span className="text-2xl font-black text-[#1A1A1A]">
              {price > 0 ? `₹${price.toLocaleString()}` : "Request Quote"}
            </span>
            {price > 0 && <span className="text-[10px] text-slate-400 block">PER PERSON</span>}
          </div>
          {price > 0 && (
            <span className="bg-[#FF4757] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
              SAVE UPTO 50%
            </span>
          )}
        </div>

        {/* ── CTA Buttons ── */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => onEnquire(trip)}
            className="flex items-center justify-center gap-1.5 bg-[#D4AF37] hover:bg-[#B89020] text-white text-xs font-bold py-3 rounded-lg transition-colors shadow-sm"
          >
            <Mail size={13} /> Enquire
          </button>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-bold py-3 rounded-lg transition-colors shadow-sm"
          >
            <MessageCircle size={13} /> WhatsApp
          </a>
        </div>

        {/* Trust line */}
        <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <CheckCircle size={11} className="text-[#2C6B4F]" />
          Instant Confirmation • No Hidden Charges
        </p>
      </div>
    </div>
  );
};



// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MinimalTemplate({ pageData }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [allTrips, setAllTrips] = useState([]);
  const [mainPackages, setMainPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hero config
  const heroConfig = useMemo(() => {
    const hero = pageData?.hero || {};
    const images = normalizeMediaArray(hero.background_images);
    const videos = normalizeMediaArray(hero.background_videos);
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

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/trips`, { headers: { "x-api-key": API_KEY } });
        const data = await res.json();
        const fetched = data?.data || data || [];
        setAllTrips(fetched);
        if (pageData?.packages?.selected_trips?.length) {
          const selected = fetched.filter((t) => pageData.packages.selected_trips.some((st) => st.trip_id === t.id));
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
      const res = await fetch(`${API_BASE_URL}/enquires`, { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": API_KEY }, body: JSON.stringify(submissionData) });
      if (!res.ok) { toast.error("Something went wrong. Please try again."); return; }
      const firstName = heroFormData.full_name?.split(" ")?.[0] || "Traveler";
      toast.success(`Thanks ${firstName}! Our team will call you within 5 minutes.`);
      setHeroFormData((p) => ({ ...p, full_name: "", contact_number: "", email: "", destination: "" }));
    } catch (err) { console.error(err); toast.error("Submission failed. Check connection."); } finally { setHeroSubmitting(false); }
  };

  const handleEnquire = (trip) => { setSelectedTrip(trip); setIsEnquiryOpen(true); };



  // Social media links
  const socialLinks = [
    { platform: "facebook", url: "https://www.facebook.com/IndianMountainRovers/", icon: Facebook },
    { platform: "instagram", url: "https://www.instagram.com/indianmountainrovers_/", icon: Instagram },
    { platform: "linkedin", url: "https://www.linkedin.com/in/indian-mountain-rovers-4a584b328/?originalSubdomain=in", icon: Linkedin },
  ];

  return (
    <div className="w-full min-h-screen bg-white font-sans text-[#1A1A1A]">
      {/* Custom Head Scripts */}
      {pageData?.custom_scripts?.head?.enabled && pageData?.custom_scripts?.head?.content && (
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: pageData.custom_scripts.head.content }} />
      )}

      <Toaster position="top-right" />

      {/* Custom Body Start Scripts */}
      {pageData?.custom_scripts?.body_start?.enabled && pageData?.custom_scripts?.body_start?.content && (
        <div dangerouslySetInnerHTML={{ __html: pageData.custom_scripts.body_start.content }} />
      )}
      <PopupManager offersConfig={pageData?.offers} pageName={pageData?.page_name} pageSlug={pageData?.slug} />
      <BookingNotification pageData={pageData} />

      {/* Header Alert */}
      {showHeaderAlert && (
        <div
          className="py-2.5 px-4 text-center sticky top-0 z-[60] shadow-md"
          style={{
            backgroundColor: "#2C6B4F",
            color: "#ffffff",
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
                src={pageData?.company?.logo || "/indianmountainrovers-logo.png"}
                alt={pageData?.company?.name || "Logo"}
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href={`tel:${CONTACT_NUMBER}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#2C6B4F] group-hover:bg-[#2C6B4F] group-hover:text-white transition-colors">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#4A5568] uppercase font-bold tracking-wider leading-none mb-1">
                    Call Us
                  </span>
                  <span className="text-sm font-black text-[#1A1A1A] group-hover:text-[#2C6B4F] leading-none">
                    {CONTACT_DISPLAY}
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${pageData?.company?.emails?.[0]?.value || "sales@indianmountainrovers.com"}`}
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
                    {pageData?.company?.emails?.[0]?.value || "sales@indianmountainrovers.com"}
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

            <button className="md:hidden p-2 text-[#2C6B4F]" onClick={() => setIsMobileMenuOpen((v) => !v)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden min-h-[85vh] md:min-h-[650px] flex items-center bg-[#2C6B4F] group">
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
                  {heroConfig.title}
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
                <div className="absolute -top-4 -right-4 bg-[#F4C430] text-[#1A1A1A] w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-[#2C6B4F] animate-pulse">
                  <span className="text-xs font-bold">SAVE</span>
                  <span className="text-sm font-black leading-none">50%</span>
                </div>

                <div className="bg-[#2C6B4F] text-white text-center py-3 -mx-6 -mt-6 mb-6 rounded-t-xl">
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
                    <span className="font-semibold text-[#2C6B4F]">500+ travelers booked this month</span>
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
                <div className="w-12 h-12 border-4 border-[#2C6B4F]/30 border-t-[#2C6B4F] rounded-full animate-spin mx-auto mb-4" />
                Loading Amazing Deals...
              </div>
            ) : (
              mainPackages.map((trip) => <TripCard key={trip.id} trip={trip} onEnquire={handleEnquire} />)
            )}
          </div>
        </div>
      </section>

      {/* --- ABOUT US (CLEAN GRID LAYOUT) --- */}
      <section id="about" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Our Story</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1A1A]">Why Travel With Us?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Local Experts", desc: "Based in Himachal, we know every hidden gem." },
              { icon: BadgeCheck, title: "Govt. Approved", desc: "Registered with Tourism Dept. of India." },
              { icon: Wallet, title: "Best Rates", desc: "Direct local pricing, no middlemen commissions." },
              { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock assistance during your trip." },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 border border-slate-100 bg-[#FDFBF7] hover:shadow-lg transition-all duration-300 group">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#2C6B4F] transition-colors">
                  <item.icon size={28} className="text-[#2C6B4F] group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* Promo Banner */}
      {
        pageData?.offers?.mid_section?.enabled && (
          <PromoMediaSection
            data={pageData.offers.mid_section}
            primaryColor="#2C6B4F"
            secondaryColor="#D4AF37"
          />
        )
      }

      {/* Testimonials */}
      {
        pageData?.testimonials?.items?.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <TestimonialCarousel testimonials={pageData.testimonials.items} />
            </div>
          </section>
        )
      }

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#2C6B4F] via-[#1B4D3E] to-[#2C6B4F] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left text-white">
              <h2 className="text-2xl md:text-3xl font-black mb-2">Ready for Your Adventure?</h2>
              <p className="text-lg opacity-90">
                Book now and save up to <span className="text-[#D4AF37] font-black">50%</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href={`tel:${CONTACT_NUMBER}`}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B4941F] text-white px-6 sm:px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-2xl transition-all flex items-center justify-center gap-3 animate-pulse whitespace-nowrap"
              >
                <Phone size={20} /> Call: {CONTACT_DISPLAY}
              </a>
              <a
                href={`https://wa.me/${CONTACT_NUMBER.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#2C6B4F] hover:bg-[#1B4D3E] text-white px-6 sm:px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-2xl transition-all flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#FDFBF7] text-[#1A1A1A] pt-12 pb-6 border-t-4 border-[#D4AF37] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* ✅ Individual Trust Badge Cards */}
          <FooterTrustBadges pageData={pageData} />

          <div className="grid md:grid-cols-3 gap-8 items-start pt-8 border-t border-gray-200 mt-8">
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-bold text-[#D4AF37] uppercase text-xs tracking-widest mb-4">Contact Us</h4>
              <a href={`tel:${CONTACT_NUMBER}`} className="text-xl font-black text-[#1A1A1A] hover:text-[#D4AF37] transition-colors tracking-wide flex items-center gap-2 mb-2">
                <Phone size={18} /> {CONTACT_DISPLAY}
              </a>
              <a
                href={`mailto:${pageData?.company?.emails?.[0]?.value || "sales@indianmountainrovers.com"}`}
                className="text-sm text-slate-600 hover:text-[#2C6B4F] transition-colors flex items-center gap-2"
              >
                <Mail size={18} /> {pageData?.company?.emails?.[0]?.value || "sales@indianmountainrovers.com"}
              </a>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="font-bold text-[#D4AF37] uppercase text-xs tracking-widest mb-4">Office</h4>
              {pageData?.company?.addresses?.[0]?.map_link ? (
                <a
                  href={pageData.company.addresses[0].map_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-600 hover:text-[#D4AF37] transition-colors text-center flex items-start gap-2 group"
                >
                  <MapPin size={14} className="mt-0.5 group-hover:text-[#D4AF37]" />
                  <span>{pageData.company.addresses[0].street}</span>
                </a>
              ) : (
                <div className="text-xs text-slate-600 text-center flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5" />
                  <span>{pageData?.company?.addresses?.[0]?.street || "Himachal Pradesh, India"}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center md:items-end">
              <h4 className="font-bold text-[#D4AF37] uppercase text-xs tracking-widest mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 bg-[#2C6B4F] hover:bg-[#D4AF37] rounded-full flex items-center justify-center transition-all group"
                      aria-label={social.platform}
                    >
                      <IconComponent size={18} className="text-white group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-4 border-t border-gray-200 text-center flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              © Copyright {new Date().getFullYear()}, {pageData?.company?.name || "Indian Mountain Rovers"}. All Rights Reserved.
            </p>
            <p className="text-[10px] text-zinc-500">
              Privacy Policy | Terms & Conditions | Cancellation Policy
            </p>
          </div>
        </div>
      </footer>

      {/* Footer Alert */}
      {
        showFooterAlert && (
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
        )
      }

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

      {/* Custom Body End Scripts */}
      {pageData?.custom_scripts?.body_end?.enabled && pageData?.custom_scripts?.body_end?.content && (
        <div dangerouslySetInnerHTML={{ __html: pageData.custom_scripts.body_end.content }} />
      )}

    </div >
  );
}