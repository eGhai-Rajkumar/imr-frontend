import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Components
import LandingPageHeader from './components/LandingPageHeader';
import HeroSection from './components/HeroSection';
import TripCard from './components/TripCard';
import TripModal from './components/TripModal';
import BookingNotification from './components/BookingNotification';
import ContactForm from './components/ContactForm';
import TestimonialCarousel from './components/TestimonialCarousel';
import FloatingCTA from './components/FloatingCTA';
import UnifiedEnquiryModal from './components/UnifiedEnquiryModal';
import PopupManager from './components/Popupmanager';
import TrustBadges from './components/TrustBadges';
import AboutPage from './components/AboutSection';
import CountdownTimer from './components/CountdownTimer';
// import TravelGuidelinesSection from './components/TravelGuidelinesSection'; // Removed as requested
import FAQSection from './components/FAQSection';
import AttractionsSection from './components/AttractionsSection';
import PromoMediaSection from './components/PromoMediaSection';
import Footer from '../../../../../../components/layout/Footer'; 
import { Flame, TrendingUp, Compass } from 'lucide-react';

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';

export default function ModernTemplate({ pageData }) {
  const [selectedTrip, setSelectedTrip] = useState(null); 
  const [viewDetailsTrip, setViewDetailsTrip] = useState(null); 
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  
  // Trips State
  const [mainSectionTrips, setMainSectionTrips] = useState([]); // For "Popular Packages"
  const [allTripsData, setAllTripsData] = useState([]); // Raw list for "Custom Packages"
  const [loading, setLoading] = useState(true);
  
  const tripsRef = useRef(null);

  useEffect(() => {
    const fetchTrips = async () => {
      // Check if we have ANY trips to show (Main or Custom)
      const hasMainTrips = pageData?.packages?.selected_trips?.length > 0;
      const hasCustomPackages = pageData?.packages?.custom_packages?.length > 0;

      if (!hasMainTrips && !hasCustomPackages) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/trips`, {
          headers: { 'x-api-key': API_KEY }
        });
        const data = await response.json();
        const allTrips = data.data || data;
        
        // Store all trips to use for custom packages filtering later
        setAllTripsData(allTrips);

        // --- Process Main Section Trips ("Popular Packages") ---
        if (hasMainTrips) {
          const selectedTripIds = pageData.packages.selected_trips.map(st => st.trip_id);
          const filteredTrips = allTrips.filter(trip => selectedTripIds.includes(trip.id));

          const enrichedTrips = filteredTrips.map(trip => {
            const selectedTripData = pageData.packages.selected_trips.find(st => st.trip_id === trip.id);
            return {
              ...trip,
              badge: selectedTripData?.badge || '',
              custom_title: selectedTripData?.trip_title || trip.title,
              custom_price: selectedTripData?.price || null
            };
          });
          setMainSectionTrips(enrichedTrips);
        }

      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [pageData]);

  const primaryColor = pageData?.theme_colors?.primary_color || '#FF6B35';
  const secondaryColor = pageData?.theme_colors?.secondary_color || '#FFB800';

  const scrollToTrips = () => {
    const element = document.getElementById('packages');
    if(element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnquire = (trip) => {
    setSelectedTrip(trip);
    setIsEnquiryOpen(true);
  };

  const handleViewDetails = (trip) => {
    setViewDetailsTrip(trip);
  };

  const handleHeroGetQuote = () => {
    setSelectedTrip(null);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{pageData?.seo?.meta_title || pageData?.page_name || 'Travel Landing Page'}</title>
        <meta name="description" content={pageData?.seo?.meta_description || pageData?.hero?.description || ''} />
        <meta name="keywords" content={pageData?.seo?.meta_tags || ''} />
      </Helmet>

      {/* --- POPUPS & NOTIFICATIONS --- */}
      <PopupManager 
        offersConfig={pageData?.offers} 
        pageName={pageData?.page_name}   // ADD THIS
        pageSlug={pageData?.slug}        // ADD THIS
      />
      
      <BookingNotification pageData={pageData} />
      

      {/* --- FLOATING CTA --- */}
      <FloatingCTA 
        settings={pageData?.company || {}} 
        offersConfig={pageData?.offers}
        onOpenEnquiry={handleHeroGetQuote}
      />
      
      {/* --- MODALS --- */}
      {console.log('🎯 Passing to UnifiedEnquiryModal:', {
  pageName: pageData?.page_name,
  pageSlug: pageData?.slug
})}

      <UnifiedEnquiryModal 
        trip={selectedTrip}
        isOpen={isEnquiryOpen}
        onClose={() => {
          setIsEnquiryOpen(false);
          setSelectedTrip(null);
        }}
        settings={pageData?.company || {}}
        popupSettings={null}
        popupType={null}
        selectedTrips={pageData?.packages?.selected_trips || []}
        // TO PASS PAGE TITLE 
        pageName={pageData?.page_name}      
        pageSlug={pageData?.slug}           
      />

      <TripModal 
        trip={viewDetailsTrip}
        isOpen={!!viewDetailsTrip}
        onClose={() => setViewDetailsTrip(null)}
        onEnquire={handleEnquire}
        primaryColor={primaryColor}
      />

      {/* --- HEADER --- */}
      <LandingPageHeader 
        companySettings={pageData?.company} 
        promoData={pageData?.offers?.header} 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor} 
      />

      {/* --- HERO --- */}
      <div id="hero">
        <HeroSection 
          onExploreClick={scrollToTrips} 
          onGetQuote={handleHeroGetQuote}
          heroData={pageData?.hero}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      </div>
      
      <TrustBadges />

      {/* ================================================================== */}
      {/* SECTION 1: POPULAR PACKAGES (Standard Selection)                   */}
      {/* ================================================================== */}
      {pageData?.packages?.show_section && (
        <section id="packages" ref={tripsRef} className="py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor
                }}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">Trending Destinations</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                {pageData?.packages?.section_title || 'Handpicked'} 
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                  }}
                >
                  {' '}Adventures
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                {pageData?.packages?.section_subtitle || 'Explore our most popular destinations with exclusive deals.'}
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading amazing destinations...</p>
              </div>
            ) : mainSectionTrips.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mainSectionTrips.map((trip, index) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    index={index}
                    onEnquire={handleEnquire}
                    onViewDetails={handleViewDetails}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                {/* Only show "No trips" if NO custom packages exist either */}
                {pageData?.packages?.custom_packages?.length === 0 && (
                   <p className="text-xl">No trips available at the moment.</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* SECTION 2: CUSTOM PACKAGES (Dynamic Sections)                      */}
      {/* ================================================================== */}
      {pageData?.packages?.show_section && pageData?.packages?.custom_packages?.map((pkg, idx) => {
        // Filter trips for this specific custom package
        const pkgTrips = allTripsData.filter(t => pkg.trip_ids?.includes(t.id));
        
        // Don't render empty sections
        if (pkgTrips.length === 0) return null;

        return (
          <section key={idx} className="py-16 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                {/* Optional Badge for the Section */}
                {pkg.badge && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-slate-100 text-slate-600">
                    <Compass className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase">{pkg.badge}</span>
                  </div>
                )}
                
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {pkg.title}
                </h2>
                
                {pkg.description && (
                  <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    {pkg.description}
                  </p>
                )}
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pkgTrips.map((trip, tIdx) => (
                  <TripCard 
                    key={trip.id} 
                    trip={{
                      ...trip,
                      // Allow custom overrides per section if data structure supports it later
                      // Currently just using raw trip data for custom packages
                    }}
                    index={tIdx}
                    onEnquire={handleEnquire}
                    onViewDetails={handleViewDetails}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* --- PROMO SECTION --- */}
      <PromoMediaSection 
        data={pageData?.offers?.mid_section} 
        onOpenEnquiry={handleHeroGetQuote} 
      />

      {/* --- ATTRACTIONS --- */}
      {pageData?.attractions?.show_section && pageData?.attractions?.items?.length > 0 && (
        <div id="attractions">
          <AttractionsSection 
            attractions={pageData.attractions.items} 
            sectionTitle={pageData.attractions.section_title}
            sectionSubtitle={pageData.attractions.section_subtitle}
            primaryColor={primaryColor} 
            secondaryColor={secondaryColor} 
            onEnquire={handleEnquire}
          />
        </div>
      )}
  
      <div id="about">
        <AboutPage />
      </div>
      
      {pageData?.testimonials?.show_section && pageData?.testimonials?.items?.length > 0 && (
        <TestimonialCarousel 
          testimonials={pageData.testimonials.items}
          sectionTitle={pageData.testimonials.section_title}
          sectionSubtitle={pageData.testimonials.section_subtitle}
        />
      )}

      {/* --- FLASH SALE --- */}
      {pageData?.offers?.header?.enabled && pageData?.offers?.end_date && (
        <section className="relative overflow-hidden">
          <div 
            className="py-10 relative" 
            style={{
              background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-white/10"
              style={{ width: '50%', transform: 'skewX(-20deg)' }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Flame className="w-12 h-12 text-white" />
                  </motion.div>
                  <div className="text-white">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      {pageData?.offers?.header?.text || 'FLASH SALE - 40% OFF'}
                    </h3>
                    <p className="text-white/80">Limited time offer on all destinations!</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-white text-center">
                    <div className="text-sm opacity-80">Sale ends in:</div>
                    <CountdownTimer endDate={new Date(pageData.offers.end_date)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {pageData?.faqs?.show_section && pageData?.faqs?.items?.length > 0 && (
        <FAQSection 
          faqs={pageData.faqs.items} 
          sectionTitle={pageData.faqs.section_title} 
          sectionSubtitle={pageData.faqs.section_subtitle}
          primaryColor={primaryColor} 
          secondaryColor={secondaryColor} 
        />
      )}

      <div id="contact">
        <ContactForm 
          settings={pageData?.company || {}} 
          primaryColor={primaryColor} 
          secondaryColor={secondaryColor} 
          selectedTrips={pageData?.packages?.selected_trips || []}
          pageName={pageData?.page_name}      // ADD THIS
          pageSlug={pageData?.slug}           // ADD THIS
        />
      </div>

      <Footer 
        ctaType="none"
        ctaName=""
        ctaTitle=""
        ctaSubtitle=""
      />
    </div>
  );
}