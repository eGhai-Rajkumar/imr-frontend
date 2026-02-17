import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, Twitter, ChevronUp, MapPin, Mail, Phone, Globe, Youtube } from 'lucide-react';
import GlobalCTA from '../Globalcta';

const API_CONFIG = {
  DESTINATIONS_URL: 'https://api.yaadigo.com/secure/api/destinations/',
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
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
    >
      <h3 className="text-[#D4AF37] font-serif font-bold text-xl mb-6 relative inline-block tracking-wide">
        {title}
        <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#D4AF37]/50 rounded-full"></span>
      </h3>
      <ul className="space-y-3">
        {links && links.length > 0 ? (
          links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href || '#'}
                className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group font-light"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2C6B4F] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {link.label}
              </a>
            </li>
          ))
        ) : (
          <li className="text-gray-600 text-sm animate-pulse">Loading...</li>
        )}
      </ul>
    </div>
  );
};

const SocialIcon = ({ icon: Icon, href, label, delay }) => {
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
      aria-label={label}
      className={`w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#D4AF37] hover:bg-[#2C6B4F] hover:-translate-y-1 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
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
      href="https://wa.me/918278829941"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-6 bottom-6 z-50 transition-all duration-500 transform ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-0 translate-y-10'
        }`}
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
        <div className="relative bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 border-2 border-white">
          <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
            <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-.507-.292-4.713 1.262 1.262-4.669-.292-.508C3.473 21.29 2.833 18.883 2.833 16.466c0-7.435 6.05-13.485 13.485-13.485s13.485 6.05 13.485 13.485c0 7.436-6.05 13.486-13.485 13.486zM21.97 18.495c-.397-.199-2.361-1.166-2.727-1.298-.365-.132-.63-.199-.894.199s-1.03 1.298-1.261 1.563c-.232.265-.463.298-.861.099s-1.678-.618-3.195-1.972c-1.182-1.053-1.979-2.352-2.21-2.75s-.025-.612.174-.811c.179-.178.397-.463.596-.695s.265-.397.397-.662c.132-.265.066-.496-.033-.695s-.894-2.154-1.226-2.949c-.323-.776-.651-.671-.894-.684-.231-.012-.496-.015-.761-.015s-.695.099-1.06.496c-.365.397-1.394 1.363-1.394 3.32s1.427 3.853 1.626 4.118c.199.265 2.807 4.285 6.802 6.009.951.411 1.693.656 2.271.839.955.303 1.824.26 2.512.158.766-.115 2.361-.966 2.695-1.898s.334-1.732.234-1.898c-.099-.165-.364-.264-.761-.463z" />
          </svg>
        </div>
      </div>
    </a>
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

        const HONEYMOON_ID = '5';
        const GROUP_TRIPS_ID = '6';

        const honeymoonLinks = tripsData
          .filter(t => t.category_id && t.category_id.includes(HONEYMOON_ID))
          .slice(0, 6)
          .map(t => ({
            label: t.title,
            href: `/trip-preview/${t.slug}/${t.id}`
          }));
        setHoneymoonTrips(honeymoonLinks);

        const fixedDepartureLinks = tripsData
          .filter(t => t.category_id && t.category_id.includes(GROUP_TRIPS_ID))
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
      <footer className="bg-[#1A1A1A] text-white relative overflow-hidden font-sans border-t border-[#D4AF37]/30">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2C6B4F] rounded-full filter blur-[100px] opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-[100px] opacity-10 animate-pulse delay-1000"></div>


        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
            <FooterColumn title="International" links={internationalTrips} delay={0} />
            <FooterColumn title="Domestic Domestic" links={domesticTrips} delay={100} />
            <FooterColumn title="Honeymoon" links={honeymoonTrips} delay={200} />
            <FooterColumn title="Group Trips" links={fixedDepartureTrips} delay={300} />
            <FooterColumn title="Quick Links" links={quickLinks} delay={400} />
          </div>

          <div className="border-t border-white/5 my-10"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Branding & Address */}
            <div className="text-center md:text-left space-y-4">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                <span className="text-[#D4AF37]">INDIAN</span> MOUNTAIN ROVERS
              </h2>
              <p className="text-gray-500 text-sm max-w-sm flex items-start gap-2 mx-auto md:mx-0 font-light">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/Z8kWSEmDcCDizEiB6" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
                  Indian Mountain Rovers
                  Near Govt. Printing Press, Lower Chakkar
                  Shimla–Manali Highway, NH205, Himachal Pradesh
                  Pin No. 171005
                </a>
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 text-sm text-gray-400 font-light">
              <a href="mailto:sales@indianmountainrovers.com" className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                sales@indianmountainrovers.com
              </a>
              <div className="flex gap-6">
                <a href="tel:+918278829941" className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  +91 82788 29941
                </a>
                <a href="tel:+919418344227" className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  +91 94183 44227
                </a>
              </div>
              <a href="https://www.indianmountainrovers.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                www.indianmountainrovers.com
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <SocialIcon icon={Facebook} href="https://www.facebook.com/IndianMountainRovers/" label="Facebook" delay={400} />
              <SocialIcon icon={Instagram} href="https://www.instagram.com/indianmountainrovers_/" label="Instagram" delay={500} />
              <SocialIcon icon={Linkedin} href="https://www.linkedin.com/in/indian-mountain-rovers-4a584b328/?originalSubdomain=in" label="LinkedIn" delay={600} />
              <SocialIcon icon={Youtube} href="#" label="Youtube" delay={700} />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 bg-black/40 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center text-gray-600 text-xs font-light">
              © {new Date().getFullYear()} Indian Mountain Rovers. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-gray-600 font-light">
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}