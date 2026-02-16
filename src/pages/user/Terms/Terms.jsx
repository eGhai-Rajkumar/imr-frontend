import { FileText, Calendar, Shield, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

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
      content: 'Full payment must be received prior to travel unless otherwise agreed in writing. We accept major credit cards, debit cards, and bank transfers. All prices are quoted in USD unless otherwise stated. Additional fees may apply for certain payment methods.'
    },
    {
      id: 'cancellation',
      title: '4. Cancellation Policy',
      content: 'Cancellations made more than 60 days before departure: 10% cancellation fee. Cancellations made 30-60 days before departure: 50% cancellation fee. Cancellations made less than 30 days before departure: 100% cancellation fee. Some tours may have different cancellation policies.'
    },
    {
      id: 'changes',
      title: '5. Changes and Modifications',
      content: 'We reserve the right to make changes to tour itineraries due to circumstances beyond our control. If significant changes occur, we will notify you as soon as possible. Changes requested by customers may be subject to additional fees and are subject to availability.'
    },
    {
      id: 'responsibility',
      title: '6. Travel Documents and Insurance',
      content: 'You are responsible for ensuring all travel documents (passports, visas, vaccinations) are valid and in order. We strongly recommend purchasing comprehensive travel insurance covering medical expenses, trip cancellation, and personal belongings.'
    },
    {
      id: 'liability',
      title: '7. Limitation of Liability',
      content: 'TravelWorld acts as an agent for various service providers and is not liable for any loss, damage, or injury arising from services provided by third parties. We are not responsible for circumstances beyond our control including natural disasters, strikes, or political unrest.'
    },
    {
      id: 'conduct',
      title: '8. Customer Conduct',
      content: 'Customers are expected to conduct themselves in a respectful manner throughout the tour. We reserve the right to remove any customer whose behavior is deemed inappropriate or disruptive, without refund.'
    },
    {
      id: 'privacy',
      title: '9. Privacy and Data Protection',
      content: 'We are committed to protecting your personal information. Your data will be used solely for booking purposes and will not be shared with third parties except as necessary to provide our services. Please refer to our Privacy Policy for detailed information.'
    },
    {
      id: 'disputes',
      title: '10. Governing Law and Disputes',
      content: 'These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20">
        <div className={`container mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <FileText className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-cyan-100 mb-6">Please read these terms carefully before using our services</p>
            <div className="flex items-center justify-center gap-2 text-cyan-100">
              <Calendar className="h-5 w-5" />
              <span>Last Updated: October 18, 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Important Notice</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  By using TravelWorld services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you have any questions, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className={`bg-white rounded-2xl shadow-lg p-8 mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to TravelWorld. These Terms and Conditions outline the rules and regulations for the use of our services. By booking a tour or using our website, you accept these terms in full. Please read them carefully before making any booking.
            </p>
          </div>

          {/* Terms Sections */}
          {sections.map((section, index) => (
            <div 
              key={section.id}
              className={`bg-white rounded-2xl shadow-lg p-8 mb-6 hover:shadow-xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                  {index + 1}
                </span>
                {section.title.replace(/^\d+\.\s*/, '')}
              </h2>
              <p className="text-gray-600 leading-relaxed pl-11">
                {section.content}
              </p>
            </div>
          ))}

          {/* Footer Note */}
          <div className="text-center mt-12 text-gray-500 text-sm">
            <p>© 2025 TravelWorld. All rights reserved.</p>
            <p className="mt-2">These terms are subject to change. Continued use of our services constitutes acceptance of any modifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}