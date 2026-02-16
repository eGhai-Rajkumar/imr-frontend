import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import LeadGeneration from '../components/forms/LeadGeneration';

/**
 * GlobalCTA - Reusable Call-to-Action component
 * 
 * Usage Examples:
 * 
 * 1. Destination Page:
 *    <GlobalCTA type="destination" name="Goa" />
 * 
 * 2. Trip Page:
 *    <GlobalCTA type="trip" name="Kashmir Adventure" />
 * 
 * 3. Generic Page:
 *    <GlobalCTA />
 * 
 * 4. Custom text:
 *    <GlobalCTA 
 *      title="Ready to Start Your Journey?" 
 *      subtitle="Let us help you plan the perfect getaway"
 *    />
 */
export default function GlobalCTA({ 
  type = 'generic',  // 'destination', 'trip', or 'generic'
  name = '',         // Name of destination or trip
  title,             // Custom title (optional)
  subtitle           // Custom subtitle (optional)
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate dynamic content based on type
  const getContent = () => {
    if (title && subtitle) {
      return { title, subtitle };
    }

    switch (type) {
      case 'destination':
        return {
          title: name ? `Ready to Explore ${name}?` : 'Ready to Explore?',
          subtitle: 'Book your dream vacation today and create unforgettable memories'
        };
      case 'trip':
        return {
          title: name ? `Interested in ${name}?` : 'Ready for Your Next Adventure?',
          subtitle: 'Get a personalized quote and start planning your perfect trip'
        };
      default:
        return {
          title: 'Ready to Start Your Journey?',
          subtitle: 'Book your dream vacation today and create unforgettable memories'
        };
    }
  };

  const { title: displayTitle, subtitle: displaySubtitle } = getContent();

  return (
    <>
      {/* CTA Section */}
      <section className="py-8 sm:py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center shadow-2xl overflow-hidden relative">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                {displayTitle}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto">
                {displaySubtitle}
              </p>
              
              {/* CTA Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-full font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
                <span>CONTACT US NOW</span>
              </button>

              {/* Trust Indicators */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-gray-300 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400">★★★★★</span>
                  <span>4.9/5 Rating</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full" />
                <div>24/7 Support</div>
                <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full" />
                <div>Best Price Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Generation Modal */}
      <LeadGeneration 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}