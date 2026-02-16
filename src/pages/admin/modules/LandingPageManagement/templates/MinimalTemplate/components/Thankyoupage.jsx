import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, MessageCircle, Star, Award } from 'lucide-react';

const CONTACT_NUMBER = '+919816259997';
const CONTACT_DISPLAY = '+91-98162 59997';
const BRAND_BLUE = '#1E5BA8';
const BRAND_GOLD = '#F4C430';
const BRAND_GREEN = '#2D5D3F';

export default function ThankYouPageRoute() {
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('name') || 'Traveler';
  const destination = searchParams.get('destination') || 'Himachal Pradesh';

  // ✅ GTM ONLY: Push conversion event to dataLayer
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: 'thank_you_view',              // ✅ Trigger name in GTM
      conversion_type: 'lead',              // optional
      destination: destination,
      customer_name: userName,
      page: 'thank_you',
    });
  }, [destination, userName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Success Header */}
        <div
          className="p-8 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_GREEN} 100%)` }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <CheckCircle size={48} style={{ color: BRAND_GREEN }} strokeWidth={3} />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              Thank You, {userName}!
            </h1>
            <p className="text-white/90 text-lg">
              Your enquiry has been received successfully!
            </p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-6"
              style={{ backgroundColor: `${BRAND_GOLD}20`, color: BRAND_GOLD }}
            >
              <Award size={16} />
              <span>Special Discount Applied • Save Up to 50%!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              What Happens Next?
            </h2>
            <p className="text-gray-600 text-sm">
              Get ready for your amazing <span className="font-bold" style={{ color: BRAND_BLUE }}>{destination}</span> adventure!
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {[
              {
                icon: Phone,
                text: 'Our travel expert will call you within 5 minutes',
                color: BRAND_BLUE,
                bg: `${BRAND_BLUE}10`
              },
              {
                icon: Star,
                text: 'Get personalized package recommendations',
                color: '#9333EA',
                bg: '#9333EA10'
              },
              {
                icon: Award,
                text: 'Lock in your special discount pricing now',
                color: '#EA580C',
                bg: '#EA580C10'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ backgroundColor: item.bg }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon size={24} style={{ color: item.color }} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-3">
            <a
              href={`tel:${CONTACT_NUMBER}`}
              className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, #FF6B35 0%, #FF9F00 100%)` }}
            >
              <Phone size={20} />
              <span>Call Us Now: {CONTACT_DISPLAY}</span>
            </a>
            <a
              href={`https://wa.me/${CONTACT_NUMBER.replace(/[^0-9]/g, '')}?text=Hi, I just submitted an enquiry for ${encodeURIComponent(destination)}. Can you help me?`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MessageCircle size={20} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Logo */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <div className="text-xl font-black mb-1" style={{ color: BRAND_BLUE }}>
              Holidays Planners
            </div>
            <p className="text-xs text-gray-500">Your Trusted Himachal Travel Partner Since 2009</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
