import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import {
  Clock, MapPin, Info, Calendar, CheckCircle2, XCircle,
  Star, FileText, Users, Phone, Mail, User,
  ChevronDown, ChevronUp, ArrowRight, Share2, Heart,
  ShieldCheck, Plane, Train, Bus, Zap
} from "lucide-react";
import { toast, Toaster } from "sonner";
import RelatedTrips from "../../../components/trips/RelatedTrips";

// API Configuration
const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const DOMAIN_NAME = "https://www.indianmountainrovers.com";
const ENQUIRY_ENDPOINT = `${API_URL}/enquires/`;
const BOOKING_REQUEST_ENDPOINT = `${API_URL}/booking_request/`;

const TripDetails = () => {
  const { id } = useParams();
  const [tripData, setTripData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tabsRef = useRef(null);
  const activeTabRef = useRef(null);

  // Mobile Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form States
  const [customizedFormData, setCustomizedFormData] = useState({
    travel_date: '',
    adults: 1,
    children: 0,
    hotel_category: '',
    full_name: '',
    contact_number: '',
    email: '',
    departure_city: '',
  });

  const [fixedDepartureFormData, setFixedDepartureFormData] = useState({
    departure_date_id: '',
    sharing_option_id: '',
    adults: 1,
    children: 0,
    full_name: '',
    contact_number: '',
    email: '',
  });

  const tabsList = [
    { id: 0, label: 'Overview', icon: '📋' },
    { id: 1, label: 'Itinerary', icon: '🗺️' },
    { id: 2, label: 'Included', icon: '✅' },
    { id: 3, label: 'Excluded', icon: '❌' },
  ];

  // Refs for scrolling
  const sectionsRef = {
    0: useRef(null),
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
  };

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`${API_URL}/trips/${id}`, {
          headers: { "x-api-key": API_KEY }
        });
        if (response.ok) {
          const data = await response.json();
          setTripData(data.data || data);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
        toast.error("Failed to load trip details");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchTripData();
  }, [id]);

  // Auto-scroll tabs container
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  const handleCustomizedChange = (e) => {
    const { name, value, type } = e.target;
    setCustomizedFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
  };

  const handleFixedDepartureChange = (e) => {
    const { name, value, type } = e.target;
    setFixedDepartureFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
  };

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let endpoint = type === 'fixed' ? BOOKING_REQUEST_ENDPOINT : ENQUIRY_ENDPOINT;
      let payload = {};

      if (type === 'fixed') {
        if (!fixedDepartureFormData.departure_date_id || !fixedDepartureFormData.sharing_option_id) throw new Error("Please select departure details.");

        const depIdx = parseInt(fixedDepartureFormData.departure_date_id);
        const pkgIdx = parseInt(fixedDepartureFormData.sharing_option_id);
        const selectedDeparture = tripData.pricing.fixed_departure[depIdx];
        const selectedPackage = selectedDeparture.costingPackages[pkgIdx];
        const price = selectedPackage.final_price;

        payload = {
          departure_date: selectedDeparture.from_date,
          sharing_option: selectedPackage.title,
          price_per_person: price,
          adults: fixedDepartureFormData.adults,
          children: fixedDepartureFormData.children,
          estimated_total_price: price * (fixedDepartureFormData.adults + fixedDepartureFormData.children),
          full_name: fixedDepartureFormData.full_name,
          email: fixedDepartureFormData.email,
          phone_number: fixedDepartureFormData.contact_number,
          domain_name: DOMAIN_NAME
        };
      } else {
        if (!customizedFormData.full_name || !customizedFormData.email) throw new Error("Please fill required fields.");
        payload = {
          destination: tripData?.title,
          ...customizedFormData,
          domain_name: DOMAIN_NAME
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Request submitted successfully!");
        setIsDrawerOpen(false);
      } else {
        throw new Error(data.message || "Failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C6B4F]"></div>
    </div>
  );

  const isFixedDeparture = tripData?.pricing?.pricing_model === "fixed_departure";
  const startPrice = isFixedDeparture
    ? tripData?.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price
    : tripData?.pricing?.customized?.final_price;

  // --- REUSABLE COMPONENTS ---

  const BookingForm = () => (
    <form onSubmit={(e) => handleFormSubmit(e, isFixedDeparture ? 'fixed' : 'customized')} className="space-y-4">
      {isFixedDeparture && (
        <>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Departure Date</label>
            <select
              name="departure_date_id"
              value={fixedDepartureFormData.departure_date_id}
              onChange={handleFixedDepartureChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C6B4F] outline-none"
            >
              <option value="">Select Date</option>
              {tripData?.pricing?.fixed_departure?.map((d, i) => <option key={i} value={i}>{d.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Sharing Option</label>
            <select
              name="sharing_option_id"
              value={fixedDepartureFormData.sharing_option_id}
              onChange={handleFixedDepartureChange}
              disabled={!fixedDepartureFormData.departure_date_id}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C6B4F] outline-none disabled:opacity-50"
            >
              <option value="">Select Option</option>
              {fixedDepartureFormData.departure_date_id && tripData?.pricing?.fixed_departure?.[fixedDepartureFormData.departure_date_id]?.costingPackages?.map((pkg, i) => (
                <option key={i} value={i}>{pkg.title} - ₹{pkg.final_price}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {!isFixedDeparture && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">City</label>
            <input type="text" name="departure_city" value={customizedFormData.departure_city} onChange={handleCustomizedChange} placeholder="Departure City" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C6B4F] outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Date</label>
            <input type="date" name="travel_date" value={customizedFormData.travel_date} onChange={handleCustomizedChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C6B4F] outline-none" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Adults</label>
          <input type="number" min="1" name="adults" value={isFixedDeparture ? fixedDepartureFormData.adults : customizedFormData.adults} onChange={isFixedDeparture ? handleFixedDepartureChange : handleCustomizedChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C6B4F] outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Kids</label>
          <input type="number" min="0" name="children" value={isFixedDeparture ? fixedDepartureFormData.children : customizedFormData.children} onChange={isFixedDeparture ? handleFixedDepartureChange : handleCustomizedChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C6B4F] outline-none" />
        </div>
      </div>

      <div className="space-y-3">
        <input type="text" name="full_name" placeholder="Full Name *" value={isFixedDeparture ? fixedDepartureFormData.full_name : customizedFormData.full_name} onChange={isFixedDeparture ? handleFixedDepartureChange : handleCustomizedChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C6B4F] outline-none" />
        <input type="email" name="email" placeholder="Email Address *" value={isFixedDeparture ? fixedDepartureFormData.email : customizedFormData.email} onChange={isFixedDeparture ? handleFixedDepartureChange : handleCustomizedChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C6B4F] outline-none" />
        <input type="tel" name="contact_number" placeholder="Phone Number *" value={isFixedDeparture ? fixedDepartureFormData.contact_number : customizedFormData.contact_number} onChange={isFixedDeparture ? handleFixedDepartureChange : handleCustomizedChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C6B4F] outline-none" />
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-[#D4AF37] hover:bg-[#B4941F] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50">
        {isSubmitting ? 'Sending Request...' : <>Send Enquiry <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );

  return (
    <div className="bg-[#FDFBF7] min-h-screen font-sans text-[#1A1A1A] pb-24 md:pb-0">
      <Helmet>
        <title>{tripData?.meta_title || tripData?.title} | Indian Mountain Rovers</title>
        <meta name="description" content={tripData?.meta_description || tripData?.overview} />
      </Helmet>
      <Toaster richColors position="top-center" />

      {/* HERO SECTION */}
      <section className="relative h-[50vh] md:h-[80vh] w-full bg-black">
        <Swiper
          modules={[EffectFade, Autoplay, Navigation]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {tripData?.gallery_images?.length > 0 ? (
            tripData.gallery_images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${encodeURI(img)})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30"></div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div className="h-full w-full bg-[#2C6B4F] flex items-center justify-center text-white">No Images</div>
          )}
        </Swiper>

        <div className="absolute inset-x-0 bottom-0 z-20 container mx-auto px-4 pb-8 md:pb-20">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#D4AF37] font-bold text-xs uppercase tracking-widest mb-3">
            <MapPin className="w-3 h-3" /> {tripData?.destination_type || 'Adventure'}
          </span>
          <h1 className="text-2xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-3 md:mb-4 drop-shadow-2xl leading-tight max-w-4xl">
            {tripData?.title}
          </h1>
          <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-2 md:gap-4 text-white/90 text-xs md:text-base font-medium">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              {tripData?.days}D/{tripData?.nights}N
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              {tripData?.pickup_location} → {tripData?.drop_location}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 md:py-8 relative z-30">
        {/* ✨ NEW: TABBED NAVIGATION WITH BETTER MOBILE DESIGN */}
        <div className="mb-8">
          {/* Desktop Tab Bar */}
          <div className="hidden md:flex gap-3 border-b border-gray-200 mb-8 overflow-x-auto">
            {tabsList.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                  ? 'border-[#2C6B4F] text-[#2C6B4F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Horizontal Tab Slider */}
          <div className="md:hidden -mx-4 px-4 mb-6">
            <div
              ref={tabsRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
            >
              {tabsList.map((tab) => (
                <button
                  key={tab.id}
                  ref={activeTab === tab.id ? activeTabRef : null}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full whitespace-nowrap font-bold text-sm transition-all flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-[#2C6B4F] text-white shadow-lg scale-105'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2C6B4F]'
                    }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-10">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-8">

            {/* OVERVIEW SECTION */}
            {activeTab === 0 && (
              <div ref={sectionsRef[0]} className="animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2C6B4F] mb-6">About This Trip</h2>
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#D4AF37]/10 prose prose-sm md:prose max-w-none text-gray-600 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: tripData?.overview }} />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-[#2C6B4F]/10 to-transparent p-4 rounded-2xl border border-[#2C6B4F]/10 text-center">
                    <p className="text-2xl font-serif font-bold text-[#2C6B4F]">{tripData?.days}</p>
                    <p className="text-xs text-gray-600 font-semibold uppercase mt-1">Days</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#2C6B4F]/10 to-transparent p-4 rounded-2xl border border-[#2C6B4F]/10 text-center">
                    <p className="text-2xl font-serif font-bold text-[#2C6B4F]">{tripData?.nights}</p>
                    <p className="text-xs text-gray-600 font-semibold uppercase mt-1">Nights</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent p-4 rounded-2xl border border-[#D4AF37]/10 text-center">
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">₹{parseInt(startPrice || 0).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-600 font-semibold uppercase mt-1">Starting</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#2C6B4F]/10 to-transparent p-4 rounded-2xl border border-[#2C6B4F]/10 text-center">
                    <p className="text-2xl font-serif font-bold text-[#2C6B4F]">⭐</p>
                    <p className="text-xs text-gray-600 font-semibold uppercase mt-1">Popular</p>
                  </div>
                </div>
              </div>
            )}

            {/* ITINERARY SECTION */}
            {activeTab === 1 && (
              <div ref={sectionsRef[1]} className="animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2C6B4F] mb-8">Day-by-Day Itinerary</h2>
                <div className="relative border-l-2 border-[#2C6B4F]/20 ml-3 md:ml-6 space-y-6 md:space-y-8 pb-4">
                  {tripData?.itinerary?.map((day, idx) => (
                    <div key={idx} className="relative pl-8 md:pl-12">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] md:-left-[11px] top-0 w-5 h-5 md:w-6 md:h-6 bg-[#D4AF37] rounded-full border-4 border-[#FDFBF7] shadow-sm"></div>

                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                        <div className="p-4 md:p-6">
                          <div className="flex items-start md:items-center justify-between gap-3 mb-4">
                            <span className="inline-block bg-[#2C6B4F]/10 text-[#2C6B4F] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                              Day {idx + 1}
                            </span>
                          </div>
                          <h3 className="font-bold text-base md:text-lg text-[#1A1A1A] mb-2">{day.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">{day.description}</p>

                          {day.activities?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((act, i) => (
                                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2C6B4F]/5 border border-[#2C6B4F]/10 rounded-lg text-xs font-medium text-[#2C6B4F]">
                                  <CheckCircle2 className="w-3 h-3" /> {act}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INCLUSIONS SECTION */}
            {activeTab === 2 && (
              <div ref={sectionsRef[2]} className="animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2C6B4F] mb-8 flex items-center gap-2">
                  <CheckCircle2 className="w-8 h-8" /> What's Included
                </h2>
                <div className="space-y-3">
                  {(tripData?.inclusions?.replace(/<[^>]*>/g, '').split(';').filter(i => i.trim()) || []).map((item, i) => (
                    <div key={i} className="bg-white p-4 md:p-5 rounded-xl border border-[#2C6B4F]/10 hover:border-[#2C6B4F]/30 transition-all flex gap-3 items-start">
                      <div className="w-6 h-6 md:w-7 md:h-7 bg-[#2C6B4F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">{item.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXCLUSIONS SECTION */}
            {activeTab === 3 && (
              <div ref={sectionsRef[3]} className="animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-red-800 mb-8 flex items-center gap-2">
                  <XCircle className="w-8 h-8" /> Not Included
                </h2>
                <div className="space-y-3">
                  {(tripData?.exclusions?.replace(/<[^>]*>/g, '').split(';').filter(i => i.trim()) || []).map((item, i) => (
                    <div key={i} className="bg-red-50/50 p-4 md:p-5 rounded-xl border border-red-100 hover:border-red-200 transition-all flex gap-3 items-start">
                      <div className="w-6 h-6 md:w-7 md:h-7 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">{item.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Price Card */}
              <div className="bg-gradient-to-br from-[#2C6B4F] to-[#1F4D38] rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                <p className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-3 relative z-10">Starting Price</p>
                <div className="flex items-baseline justify-center gap-1 mb-2 relative z-10">
                  <span className="text-5xl font-serif font-bold">₹{parseInt(startPrice || 0).toLocaleString('en-IN')}</span>
                  <span className="text-white/60 text-sm">/ person</span>
                </div>
                <p className="text-xs text-white/50 mb-6 relative z-10">*Excluding GST</p>
              </div>

              {/* Booking Form Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Book Your Spot</h3>
                <p className="text-xs text-gray-500 mb-6">Get custom dates & pricing</p>
                <BookingForm />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-transparent p-4 rounded-2xl text-center border border-green-100">
                  <ShieldCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">Secure Booking</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-transparent p-4 rounded-2xl text-center border border-blue-100">
                  <Zap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">Best Price</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Related Trips */}
        <div className="mt-16 md:mt-24 border-t border-gray-200 pt-12 md:pt-16">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1A1A1A] mb-8 md:mb-10 text-center">
            Similar <span className="text-[#2C6B4F]">Adventures</span>
          </h2>
          <RelatedTrips currentTripId={id} />
        </div>
      </div>

      {/* --- MOBILE BOTTOM BAR (Sticky) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Starting From</p>
          <p className="text-xl md:text-2xl font-serif font-bold text-[#2C6B4F]">₹{parseInt(startPrice || 0).toLocaleString('en-IN')}</p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-[#D4AF37] text-white px-6 md:px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#b5952f] transition-all flex items-center gap-2 whitespace-nowrap"
        >
          Plan Trip <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* --- MOBILE BOOKING DRAWER --- */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl transform transition-transform duration-300 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#2C6B4F]">Plan Your Trip</h3>
                <p className="text-xs text-gray-500">Get a custom quote</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <BookingForm />
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TripDetails;