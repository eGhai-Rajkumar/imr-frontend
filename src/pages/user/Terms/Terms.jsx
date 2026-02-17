import { FileText, Calendar, Shield, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import PageHeader from '../../../components/layout/PageHeader';

export default function TermsConditions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: 'By accessing and using TravelWorld services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.'
    },
    {
      id: 'booking',
      title: '2. Booking and Reservations',
      content: 'All bookings are subject to availability and confirmation. We reserve the right to decline any booking at our discretion. A deposit or full payment may be required at the time of booking. Prices are subject to change until booking is confirmed and payment is received.'
    },
    {
      id: 'payment',
      title: '3. Payment Terms',
      content: 'Full payment must be received prior to travel unless otherwise agreed in writing. We accept major credit cards, debit cards, and bank transfers. All prices are quoted in USD unless otherwise stated.'
    },
    {
      id: 'cancellation',
      title: '4. Cancellation Policy',
      content: 'Cancellations made more than 60 days before departure: 10% cancellation fee. Cancellations made 30-60 days before departure: 50% cancellation fee. Cancellations made less than 30 days before departure: 100% cancellation fee.'
    },
    {
      id: 'changes',
      title: '5. Changes and Modifications',
      content: 'We reserve the right to make changes to tour itineraries due to circumstances beyond our control. If significant changes occur, we will notify you as soon as possible.'
    },
    {
      id: 'responsibility',
      title: '6. Travel Documents and Insurance',
      content: 'You are responsible for ensuring all travel documents (passports, visas, vaccinations) are valid and in order. We strongly recommend purchasing comprehensive travel insurance.'
    },
    {
      id: 'liability',
      title: '7. Limitation of Liability',
      content: 'TravelWorld acts as an agent for various service providers and is not liable for any loss, damage, or injury arising from services provided by third parties.'
    },
    {
      id: 'conduct',
      title: '8. Customer Conduct',
      content: 'Customers are expected to conduct themselves in a respectful manner throughout the tour. We reserve the right to remove any customer whose behavior is deemed inappropriate or disruptive.'
    },
    {
      id: 'privacy',
      title: '9. Privacy and Data Protection',
      content: 'We are committed to protecting your personal information. Your data will be used solely for booking purposes and will not be shared with third parties except as necessary to provide our services.'
    },
    {
      id: 'disputes',
      title: '10. Governing Law and Disputes',
      content: 'These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts.'
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <PageHeader
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our services"
        breadcrumb="Terms"
        bgImage="https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Intro Card */}
          <div className={`bg-white rounded-2xl shadow-soft p-8 mb-12 border-l-4 border-secondary transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-start gap-4">
              <FileText className="h-8 w-8 text-secondary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to Indian Mountain Rovers. These Terms and Conditions outline the rules and regulations for the use of our services.
                  By booking a tour or using our website, you accept these terms in full. Please read them carefully before making any booking.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-soft transition-all duration-300 border border-transparent hover:border-gray-100"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-xl font-bold text-primary/40 font-serif">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                      {section.title.replace(/^\d+\.\s*/, '')}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-light">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 text-gray-500 text-sm">
            <p>© 2025 Indian Mountain Rovers. All rights reserved.</p>
          </div>

        </div>
      </div>
    </div>
  );
}