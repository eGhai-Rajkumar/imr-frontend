import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, Facebook, Twitter,
  Linkedin, Instagram, Mail, Phone, ExternalLink, Calendar, Send
} from 'lucide-react';

import LeadGeneration from '../forms/LeadGeneration';

const API_CONFIG = {
  DESTINATIONS_URL: "https://api.yaadigo.com/secure/api/destinations/",
  API_KEY: "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M",
  DOMAIN_NAME: "https://www.indianmountainrovers.com",
};

const getNavDestinations = (data, type) => {
  if (!data || !Array.isArray(data)) return { columns: [], numColumns: 0, allDestinations: [] };
  const destinations = data.filter(
    (d) => d.destination_type === type && !d.title?.toLowerCase().includes("copy")
  );
  const limited = destinations.slice(0, 15); // Limit to top 15 for menu
  const cols = Math.min(3, Math.ceil(limited.length / 5));
  const result = [];

  for (let i = 0; i < cols; i++) {
    result.push(limited.slice(i * 5, i * 5 + 5));
  }

  return { columns: result, numColumns: cols, allDestinations: limited };
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [fetchedDestinations, setFetchedDestinations] = useState([]);

  /* FETCH DESTINATIONS */
  useEffect(() => {
    const fetchNavData = async () => {
      // 1. Check Cache
      const cachedData = sessionStorage.getItem('imr_destinations');
      if (cachedData) {
        setFetchedDestinations(JSON.parse(cachedData));
        return;
      }

      // 2. Fetch if not cached
      try {
        const res = await fetch(API_CONFIG.DESTINATIONS_URL, {
          headers: { "x-api-key": API_CONFIG.API_KEY }
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const data = json.data || [];

        setFetchedDestinations(data);
        sessionStorage.setItem('imr_destinations', JSON.stringify(data));
      } catch (err) {
        console.error("Nav fetch error:", err);
        setFetchedDestinations([]);
      }
    };
    fetchNavData();
  }, []);

  const domesticNav = useMemo(
    () => getNavDestinations(fetchedDestinations, "domestic"),
    [fetchedDestinations]
  );

  const internationalNav = useMemo(
    () => getNavDestinations(fetchedDestinations, "international"),
    [fetchedDestinations]
  );

  return (
    <>
      <header className="w-full shadow-md relative z-[9999] bg-white">

        {/* === ROW 1: TOP BAR (White) === */}
        <div className="bg-white py-2 border-b border-gray-100">
          <div className="container mx-auto px-4">
            {/* Desktop Layout: 4 Distinct Columns using justify-between */}
            <div className="flex items-center justify-between">

              {/* 1. LEFT: Logo & Brand */}
              <a href="/" className="flex items-center gap-2 group shrink-0">
                <img
                  src="https://www.indianmountainrovers.com/logo-indian-mountain-rovers.png"
                  alt="Indian Mountain Rovers"
                  className="h-10 md:h-12 w-auto object-contain"
                />
                <span className="font-serif font-bold text-black text-lg md:text-xl tracking-tight leading-tight">
                  Indian Mountain <br className="md:hidden" /> Rovers
                </span>
              </a>

              {/* 2. CENTER-LEFT: Plan Your Trip Button (Desktop Only) */}
              <div className="hidden lg:block">
                <button
                  onClick={() => setIsPlanTripOpen(true)}
                  className="px-6 py-2 bg-[#1B4D3E] text-white font-bold text-sm uppercase tracking-wider rounded-md border border-[#1B4D3E] hover:bg-white hover:text-[#1B4D3E] transition-all shadow-sm"
                >
                  Plan Your Trip
                </button>
              </div>

              {/* 3. RIGHT: Menu Links (Desktop Only) */}
              <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-gray-800">
                <a href="/about" className="hover:text-[#1B4D3E] transition-colors">About Us</a>
                <a href="/contact" className="hover:text-[#1B4D3E] transition-colors">Contact Us</a>
                <a href="/blog" className="hover:text-[#1B4D3E] transition-colors">Blogs</a>
              </nav>

              {/* 4. FAR RIGHT: WhatsApp & Mobile Toggle */}
              <div className="flex items-center gap-4">
                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/918278829941"
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#20bd5a] hover:-translate-y-0.5 transition-all"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5 brightness-0 invert" />
                  <span className="hidden md:inline">+91 82788 29941</span>
                </a>

                {/* Mobile Menu Toggle */}
                <button
                  className="lg:hidden p-2 text-[#1B4D3E] rounded-md hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* === ROW 2: NAVIGATION BAR (Dark) === */}
        <div className="bg-[#1B4D3E] text-white hidden lg:block border-t border-white/10 relative">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-12 gap-8 text-[15px] font-medium tracking-wide">

              {/* Domestic Dropdown */}
              <div
                className="relative group h-full flex items-center"
                onMouseEnter={() => setOpenDropdown("domestic")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className={`flex items-center gap-1.5 h-full hover:text-[#D4AF37] transition-colors ${openDropdown === "domestic" ? "text-[#D4AF37]" : ""}`}>
                  Domestic Trips <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "domestic" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openDropdown === "domestic" && (
                    <div className="absolute top-full left-0 pt-0 z-50">
                      <MegaMenu columns={domesticNav.columns} numColumns={domesticNav.numColumns} />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* International Dropdown */}
              <div
                className="relative group h-full flex items-center"
                onMouseEnter={() => setOpenDropdown("international")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className={`flex items-center gap-1.5 h-full hover:text-[#D4AF37] transition-colors ${openDropdown === "international" ? "text-[#D4AF37]" : ""}`}>
                  International Trips <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "international" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openDropdown === "international" && (
                    <div className="absolute top-full left-0 pt-0 z-50">
                      <MegaMenu columns={internationalNav.columns} numColumns={internationalNav.numColumns} />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <a href="/triplist" className="hover:text-[#D4AF37] transition-colors">All Journeys</a>
              <a href="/category/group-trips/6" className="hover:text-[#D4AF37] transition-colors">Upcoming Group Trips</a>
              <a href="/category/honeymoon-trips/5" className="hover:text-[#D4AF37] transition-colors">Honeymoon Trips</a>

            </div>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-white z-[9998] overflow-y-auto border-t border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="p-6 space-y-2">
                <MobileNavItem label="Domestic Trips" items={domesticNav.allDestinations} />
                <MobileNavItem label="International Trips" items={internationalNav.allDestinations} />

                <a href="/triplist" className="block py-3 text-lg font-bold text-gray-800 border-b border-gray-100">All Journeys</a>
                <a href="/about" className="block py-3 text-lg font-medium text-gray-600 border-b border-gray-100">About Us</a>
                <a href="/contact" className="block py-3 text-lg font-medium text-gray-600 border-b border-gray-100">Contact The Team</a>
                <a href="/blog" className="block py-3 text-lg font-medium text-gray-600 border-b border-gray-100">Our Blogs</a>

                <div className="pt-8 space-y-4">
                  <button
                    onClick={() => {
                      setIsPlanTripOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-4 bg-[#1B4D3E] text-white font-bold text-lg rounded-full shadow-xl"
                  >
                    Plan Your Trip
                  </button>

                  <a
                    href="https://wa.me/918278829941"
                    className="w-full py-4 bg-[#25D366] text-white font-bold text-lg rounded-full shadow-xl flex items-center justify-center gap-2"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-6 h-6 brightness-0 invert" />
                    +91 82788 29941
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* LEAD GENERATION MODAL */}
      <LeadGeneration
        isOpen={isPlanTripOpen}
        onClose={() => setIsPlanTripOpen(false)}
      />
    </>
  );
}

// --- SUBCOMPONENTS ---

/* Reusing the same MegaMenu component style but adjusted for the new context */
const MegaMenu = ({ columns, numColumns }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.2 }}
    className="bg-white text-gray-800 shadow-2xl rounded-b-md border-t-4 border-[#D4AF37] overflow-hidden min-w-[600px]"
  >
    <div className={`p-6 bg-white min-w-[300px] flex gap-8 whitespace-nowrap`}>
      {columns.map((col, idx) => (
        <div key={idx} className="flex flex-col gap-2 min-w-[160px]">
          {idx === 0 && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Trending</span>}
          {col.map(dest => (
            <a key={dest.id} href={`/destination/${dest.slug}/${dest.id}`} className="text-gray-600 hover:text-[#1B4D3E] hover:translate-x-1 px-1 py-1.5 rounded-sm text-sm font-medium transition-all flex items-center gap-2 group">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              {dest.title}
            </a>
          ))}
        </div>
      ))}
    </div>
  </motion.div>
);

const MobileNavItem = ({ label, items }) => (
  <details className="group border-b border-gray-100 pb-2">
    <summary className="py-3 text-lg font-bold text-[#1B4D3E] flex justify-between items-center cursor-pointer list-none">
      {label}
      <ChevronDown className="h-5 w-5 text-[#D4AF37] group-open:rotate-180 transition-transform" />
    </summary>
    <div className="mt-2 pl-4 space-y-2 border-l-2 border-[#D4AF37]/30 py-2 bg-gray-50 rounded-r-lg">
      {items.map((d) => (
        <a key={d.id} href={`/destination/${d.slug}/${d.id}`} className="block py-2 text-gray-600 hover:text-[#1B4D3E] font-medium text-sm">
          {d.title}
        </a>
      ))}
    </div>
  </details>
);
