import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, Twitter, ChevronUp } from 'lucide-react';
import GlobalCTA from '../Globalcta';

const API_CONFIG = {
  DESTINATIONS_URL: 'https://api.yaadigo.com/secure/api/destinations/',
  CATEGORIES_URL: 'https://api.yaadigo.com/secure/api/categories/',
  TRIPS_URL: 'https://api.yaadigo.com/secure/api/trips/',
  API_KEY: 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M',
};

// --- SUB-COMPONENTS ---
const FooterColumn = ({ title, links, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
      <ul className="space-y-2">
        {links && links.length > 0 ? (
          links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href || '#'}
                className="text-gray-400 hover:text-cyan-400 transition duration-300 text-sm inline-block hover:-translate-y-0.5"
              >
                {link.label}
              </a>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm">Loading...</li>
        )}
      </ul>
    </div>
  );
};

const SocialIcon = ({ icon: Icon, href, delay, bgColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${bgColor} w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg transform ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
};

const StickyWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <a
      href="https://wa.me/919816259997"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-6 bottom-6 z-50 transition-all duration-500 transform ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-0 translate-y-10'
      }`}
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group-hover:shadow-green-500/50">
          <svg viewBox="0 0 32 32" className="w-10 h-10" fill="white">
            <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-.507-.292-4.713 1.262 1.262-4.669-.292-.508C3.473 21.29 2.833 18.883 2.833 16.466c0-7.435 6.05-13.485 13.485-13.485s13.485 6.05 13.485 13.485c0 7.436-6.05 13.486-13.485 13.486zM21.97 18.495c-.397-.199-2.361-1.166-2.727-1.298-.365-.132-.63-.199-.894.199s-1.03 1.298-1.261 1.563c-.232.265-.463.298-.861.099s-1.678-.618-3.195-1.972c-1.182-1.053-1.979-2.352-2.21-2.75s-.025-.612.174-.811c.179-.178.397-.463.596-.695s.265-.397.397-.662c.132-.265.066-.496-.033-.695s-.894-2.154-1.226-2.949c-.323-.776-.651-.671-.894-.684-.231-.012-.496-.015-.761-.015s-.695.099-1.06.496c-.365.397-1.394 1.363-1.394 3.32s1.427 3.853 1.626 4.118c.199.265 2.807 4.285 6.802 6.009.951.411 1.693.656 2.271.839.955.303 1.824.26 2.512.158.766-.115 2.361-.966 2.695-1.898s.334-1.732.234-1.898c-.099-.165-.364-.264-.761-.463z" />
          </svg>
        </div>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us!
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      </div>
    </a>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed right-6 bottom-28 z-50 bg-cyan-500 hover:bg-cyan-600 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

// --- MAIN COMPONENT ---
export default function Footer({ ctaType, ctaName, ctaTitle, ctaSubtitle }) {
  const [internationalTrips, setInternationalTrips] = useState([]);
  const [domesticTrips, setDomesticTrips] = useState([]);
  const [honeymoonTrips, setHoneymoonTrips] = useState([]);
  const [fixedDepartureTrips, setFixedDepartureTrips] = useState([]);

  // Utility for slugifying
  const slugify = (str = "") => str.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  useEffect(() => {
    const fetchFooterLinks = async () => {
      try {
        const [destRes, tripsRes] = await Promise.all([
          fetch(API_CONFIG.DESTINATIONS_URL, { headers: { 'Content-Type': 'application/json', 'x-api-key': API_CONFIG.API_KEY } }),
          fetch(API_CONFIG.TRIPS_URL, { headers: { 'Content-Type': 'application/json', 'x-api-key': API_CONFIG.API_KEY } }),
        ]);

        const [destJson, tripsJson] = await Promise.all([destRes.json(), tripsRes.json()]);

        // Process Destinations
        const destData = destJson?.data || [];
        
        const domestic = destData
          .filter((d) => d.destination_type === 'domestic' && !d.title.toLowerCase().includes('copy'))
          .slice(0, 5)
          .map((d) => ({ 
            label: d.title, 
            href: `/destination/${d.slug || slugify(d.title)}/${d.id}` 
          }));

        const international = destData
          .filter((d) => d.destination_type === 'international' && !d.title.toLowerCase().includes('copy'))
          .slice(0, 5)
          .map((d) => ({ 
            label: d.title, 
            href: `/destination/${d.slug || slugify(d.title)}/${d.id}` 
          }));

        setDomesticTrips(domestic);
        setInternationalTrips(international);

        // Process Trips for Categories
        const tripsData = tripsJson?.data || [];
        
        const HONEYMOON_ID = '11';
        const FIXED_DEPARTURE_ID = '50';

        const honeymoonLinks = tripsData
          .filter(t => t.category_id && t.category_id.includes(HONEYMOON_ID))
          .slice(0, 6)
          .map(t => ({ 
            label: t.title, 
            href: `/trip-preview/${t.slug}/${t.id}` 
          }));
        setHoneymoonTrips(honeymoonLinks);

        const fixedDepartureLinks = tripsData
          .filter(t => t.category_id && t.category_id.includes(FIXED_DEPARTURE_ID))
          .slice(0, 6)
          .map(t => ({ 
            label: t.title, 
            href: `/trip-preview/${t.slug}/${t.id}` 
          }));
        setFixedDepartureTrips(fixedDepartureLinks);

      } catch (err) {
        console.error('Error fetching footer links:', err);
        setHoneymoonTrips([{ label: 'Honeymoon Packages', href: '/triplist?category=honeymoon' }]);
        setFixedDepartureTrips([{ label: 'Fixed Departure Trips', href: '/triplist?category=fixed-departure' }]);
      }
    };

    fetchFooterLinks();
  }, []);

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ];

  // Check if CTA should be shown - only hide if explicitly set to "none"
  const shouldShowCTA = ctaType !== 'none';

  return (
    <>
      <StickyWhatsApp />
      <ScrollToTop />

      {/* GLOBAL CTA SECTION - Only show if ctaType is provided and not "none" */}
      {shouldShowCTA && (
        <GlobalCTA 
          type={ctaType} 
          name={ctaName}
          title={ctaTitle}
          subtitle={ctaSubtitle}
        />
      )}

      {/* FOOTER CONTENT */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600"></div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            
            <FooterColumn title="International Trips" links={internationalTrips} delay={0} />
            <FooterColumn title="India Trips" links={domesticTrips} delay={100} />
            <FooterColumn title="Honeymoon" links={honeymoonTrips} delay={200} />
            <FooterColumn title="Fixed Departure" links={fixedDepartureTrips} delay={300} />
            <FooterColumn title="Quick Links" links={quickLinks} delay={400} />
          </div>

          <div className="border-t border-gray-800 mb-8"></div>

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              HOLIDAYS PLANNERS
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              <a href="https://maps.app.goo.gl/pkCAr39eBtwqskYs7" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                Kapil Niwas Bye Pass Road Chakkar Shimla, H.P. (171005)
              </a>
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm">
              <a href="mailto:info@indianmountainrovers.com" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                info@indianmountainrovers.com
              </a>
              <a href="tel:+919816259997" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                +91-98162 59997
              </a>
               <a href="tel:+919805245681" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                +91-98052 45681
              </a>
              <a href="https://www.indianmountainrovers.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                www.indianmountainrovers.com
              </a>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <SocialIcon icon={Facebook} href="#" delay={400} bgColor="bg-blue-600 hover:bg-blue-700" />
            <SocialIcon icon={Instagram} href="#" delay={500} bgColor="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600" />
            <SocialIcon icon={Linkedin} href="#" delay={600} bgColor="bg-blue-700 hover:bg-blue-800" />
            <SocialIcon icon={Twitter} href="https://x.com/Holidays_planne" delay={700} bgColor="bg-gray-700 hover:bg-gray-800" />
          </div>
        </div>

        <div className="border-t border-gray-800 py-4">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Holidays Planners. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}