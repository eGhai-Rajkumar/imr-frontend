import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, Search, Facebook, Twitter,
  Linkedin, Instagram, Mail, Phone
} from 'lucide-react';

import LeadGeneration from '../forms/LeadGeneration';

const API_CONFIG = {
  DESTINATIONS_URL: "https://api.yaadigo.com/secure/api/destinations/",
  API_KEY: "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M",
  DOMAIN_NAME: "https://www.indianmountainrovers.com",
};

const getNavDestinations = (data, type) => {
  const destinations = data.filter(
    (d) => d.destination_type === type && !d.title?.toLowerCase().includes("copy")
  );
  const limited = destinations.slice(0, 15);
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
      try {
        const res = await fetch(API_CONFIG.DESTINATIONS_URL, {
          headers: { "x-api-key": API_CONFIG.API_KEY }
        });
        const json = await res.json();
        setFetchedDestinations(json.data || []);
      } catch {
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
      {/* TOP SOCIAL + CONTACT BAR */}
      <div className="bg-gradient-to-r from-sky-100 to-cyan-50 border-b border-sky-200 hidden md:block w-full">
        <div className="w-full px-4 py-3">
          <div className="flex justify-between items-center max-w-7xl mx-auto">

            {/* SOCIAL */}
            <div className="flex items-center gap-8">
              <span className="text-gray-700 font-semibold text-sm">Follow Us</span>
              <div className="flex gap-3">
                <motion.a className="text-gray-600 hover:text-[#1877F2]"><Facebook className="h-4 w-4" /></motion.a>
                <motion.a href="https://x.com/Holidays_planne" target="_blank" className="text-gray-600 hover:text-[#1DA1F2]"><Twitter className="h-4 w-4" /></motion.a>
                <motion.a className="text-gray-600 hover:text-[#0A66C2]"><Linkedin className="h-4 w-4" /></motion.a>
                <motion.a className="text-gray-600 hover:text-[#C13584]"><Instagram className="h-4 w-4" /></motion.a>
              </div>
            </div>

            {/* CONTACT */}
            <div className="flex items-center gap-8 text-sm">

              <a href="mailto:info@indianmountainrovers.com" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <Mail className="h-4 w-4" />
                <span>info@indianmountainrovers.com</span>
              </a>

              <a href="tel:+919816259997" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <Phone className="h-4 w-4" />
                <span>+91 98162 59997</span>
              </a>

              <a href="tel:+919805245681" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <Phone className="h-4 w-4" />
                <span>+91 98052 45681</span>
              </a>


            </div>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <motion.header className="sticky top-0 z-[9999] bg-white shadow-md w-full">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">

            {/* LOGO */}
            <a href="/" className="flex items-center gap-3">
              <motion.img src="/holidaysplanners-logo.png" alt="Logo" className="h-auto w-24" />
            </a>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center space-x-1">

              {/* DOMESTIC */}
              <div
                className="relative group"
                onMouseEnter={() => setOpenDropdown("domestic")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-bold">
                  Domestic Trips <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {openDropdown === "domestic" && (
                    <motion.div
                      className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-2 border z-[9999]"
                      style={{ width: `${domesticNav.numColumns * 12}rem` }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <div className={`grid gap-x-2 grid-cols-${domesticNav.numColumns}`}>
                        {domesticNav.columns.map((col, idx) => (
                          <div key={idx} className="min-w-48">
                            {col.map((dest) => (
                              <a key={dest.id} href={`/destination/${dest.slug}/${dest.id}`}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap">
                                {dest.title}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* INTERNATIONAL */}
              <div
                className="relative group"
                onMouseEnter={() => setOpenDropdown("international")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-bold">
                  International Trips <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {openDropdown === "international" && (
                    <motion.div
                      className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-2 border z-[9999]"
                      style={{ width: `${internationalNav.numColumns * 12}rem` }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <div className={`grid gap-x-2 grid-cols-${internationalNav.numColumns}`}>
                        {internationalNav.columns.map((col, idx) => (
                          <div key={idx} className="min-w-48">
                            {col.map((dest) => (
                              <a key={dest.id} href={`/destination/${dest.slug}/${dest.id}`}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap">
                                {dest.title}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* EXPLORE TRIPS */}
              <a href="/triplist" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-bold">
                Explore Trips
              </a>

              {/* COMPANY */}
              <div
                className="relative group"
                onMouseEnter={() => setOpenDropdown("company")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-bold">
                  Company <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {openDropdown === "company" && (
                    <motion.div
                      className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg py-2 border z-[9999]"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <a href="/contact" className="block px-4 py-2 hover:bg-blue-50 text-gray-700">Contact</a>
                      <a href="/about" className="block px-4 py-2 hover:bg-blue-50 text-gray-700">About Us</a>
                      <a href="/terms" className="block px-4 py-2 hover:bg-blue-50 text-gray-700">Terms & Conditions</a>
                      <a href="/privacy" className="block px-4 py-2 hover:bg-blue-50 text-gray-700">Privacy Policy</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* BLOG */}
              <a href="/blog" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-bold">
                Blog
              </a>
            </nav>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-3">

              {/* WHATSAPP */}
              <motion.a
                href="https://wa.me/919816259997"
                target="_blank"
                className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-green-50 text-green-600"
                whileHover={{ scale: 1.1 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.383 0 0 5.383 0 12c0 2.136.53 4.168 1.547 5.948L0 24l6.304-2.016C9.055 23.383 10.464 24 12 24c6.617 0 12-5.383 12-12S18.617 0 12 0zm0 22.08c-1.357 0-2.688-.328-3.847-.963l-.276-.163-2.856.915.963-2.856-.164-.276A10.075 10.075 0 011.92 12c0-5.531 4.529-10.08 10.08-10.08 5.551 0 10.08 4.529 10.08 10.08 0 5.551-4.529 10.08-10.08 10.08z"/>
                  <path d="M17.622 14.236c-.306-.153-1.81-.892-2.088-.993-.277-.102-.479-.153-.68.153-.204.306-.788.993-.966 1.194-.179.204-.356.229-.662.076-.307-.153-1.291-.476-2.456-1.515-.908-.837-1.52-1.87-1.697-2.177-.178-.306-.019-.471.134-.623.137-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.052-.381-.025-.535-.077-.153-.68-1.638-.932-2.243-.246-.585-.497-.506-.68-.515-.176-.009-.38-.012-.583-.012-.203 0-.533.076-.812.381-.279.306-1.066 1.04-1.066 2.533 0 1.493 1.093 2.937 1.246 3.141.153.204 2.149 3.283 5.205 4.596.727.313 1.295.5 1.736.64.729.233 1.39.201 1.912.121.583-.087 1.8-.736 2.053-1.445.253-.71.253-1.318.178-1.445-.076-.127-.279-.204-.583-.357z"/>
                </svg>
              </motion.a>

              {/* PLAN TRIP BUTTON */}
              <motion.button
                onClick={() => setIsPlanTripOpen(true)}
                className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-md shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                Plan Your Trip
              </motion.button>

              {/* MOBILE TOGGLER */}
              <button
                className="lg:hidden text-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t shadow-lg absolute w-full"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-3">

                {/* Mobile DOMESTIC */}
                <details>
                  <summary className="py-2 text-gray-700 font-bold flex justify-between">
                    Domestic Trips <ChevronDown className="h-4 w-4" />
                  </summary>
                  <div className="ml-4 border-l pl-4">
                    {domesticNav.allDestinations.map((d) => (
                      <a key={d.id} href={`/destination/${d.slug}/${d.id}`}
                        className="block py-1 text-gray-600">
                        {d.title}
                      </a>
                    ))}
                  </div>
                </details>

                {/* Mobile INTERNATIONAL */}
                <details>
                  <summary className="py-2 text-gray-700 font-bold flex justify-between">
                    International Trips <ChevronDown className="h-4 w-4" />
                  </summary>
                  <div className="ml-4 border-l pl-4">
                    {internationalNav.allDestinations.map((d) => (
                      <a key={d.id} href={`/destination/${d.slug}/${d.id}`}
                        className="block py-1 text-gray-600">
                        {d.title}
                      </a>
                    ))}
                  </div>
                </details>

                <a href="/triplist" className="py-2 text-gray-700 font-bold">
                  Explore Trips
                </a>

                {/* Mobile COMPANY */}
                <details>
                  <summary className="py-2 text-gray-700 font-bold flex justify-between">
                    Company <ChevronDown className="h-4 w-4" />
                  </summary>
                  <div className="ml-4 border-l pl-4">
                    <a href="/contact" className="block py-1 text-gray-600">Contact</a>
                    <a href="/about" className="block py-1 text-gray-600">About Us</a>
                    <a href="/terms" className="block py-1 text-gray-600">Terms & Conditions</a>
                    <a href="/privacy" className="block py-1 text-gray-600">Privacy Policy</a>
                  </div>
                </details>

                <a href="/blog" className="py-2 text-gray-700 font-bold">
                  Blog
                </a>

                <button
                  onClick={() => {
                    setIsPlanTripOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-md"
                >
                  Plan Your Trip
                </button>

              </nav>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.header>

      {/* LEAD GENERATION MODAL */}
      <LeadGeneration
        isOpen={isPlanTripOpen}
        onClose={() => setIsPlanTripOpen(false)}
      />
    </>
  );
}
