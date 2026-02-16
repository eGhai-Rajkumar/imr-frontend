import { Shield, Lock, Eye, Cookie, Mail, UserCheck, Database, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PrivacyPolicy() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      id: 'information-collect',
      icon: Database,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us when booking tours or using our services. This includes your name, email address, phone number, postal address, payment information, passport details (when required), travel preferences, and any special requirements. We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, pages visited, and time spent on pages.'
    },
    {
      id: 'how-we-use',
      icon: UserCheck,
      title: 'How We Use Your Information',
      content: 'We use the information we collect to process and manage your bookings, communicate with you about your travel arrangements, provide customer support, send you booking confirmations and updates, process payments and prevent fraud, personalize your experience, improve our services, comply with legal obligations, and send you marketing communications (with your consent). We may also use aggregated and anonymized data for analytical purposes.'
    },
    {
      id: 'sharing',
      icon: Eye,
      title: 'Information Sharing and Disclosure',
      content: 'We may share your information with third-party service providers who assist us in operating our business (hotels, airlines, tour operators, payment processors), with your consent or at your direction, to comply with legal obligations or respond to legal requests, to protect our rights, property, or safety, and with potential buyers in the event of a merger, acquisition, or sale of assets. We do not sell your personal information to third parties for their marketing purposes.'
    },
    {
      id: 'data-security',
      icon: Lock,
      title: 'Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure servers, regular security audits, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: 'Cookies and Tracking Technologies',
      content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. Cookies are small data files stored on your device. You can control cookie settings through your browser preferences. Essential cookies are necessary for the website to function, while optional cookies help us improve our services and personalize your experience.'
    },
    {
      id: 'your-rights',
      icon: Shield,
      title: 'Your Privacy Rights',
      content: 'You have the right to access, correct, or delete your personal information, object to or restrict certain processing of your data, withdraw consent where processing is based on consent, receive a copy of your data in a portable format, and lodge a complaint with a supervisory authority. To exercise these rights, please contact us using the information provided below. We will respond to your request within 30 days.'
    },
    {
      id: 'retention',
      icon: Database,
      title: 'Data Retention',
      content: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Booking information is typically retained for 7 years for accounting and legal purposes. Marketing data is retained until you unsubscribe or request deletion.'
    },
    {
      id: 'international',
      icon: Eye,
      title: 'International Data Transfers',
      content: 'Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer your data internationally, we ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.'
    },
    {
      id: 'children',
      icon: UserCheck,
      title: "Children's Privacy",
      content: 'Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to delete such information.'
    },
    {
      id: 'changes',
      icon: AlertCircle,
      title: 'Changes to This Policy',
      content: 'We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after changes become effective constitutes acceptance of the updated policy.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className={`container mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-purple-100 mb-6">Your privacy is important to us. Learn how we protect and handle your data.</p>
            <div className="flex items-center justify-center gap-2 text-purple-100">
              <Lock className="h-5 w-5" />
              <span>Last Updated: October 18, 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-purple-50 border-l-4 border-purple-600 rounded-r-lg p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-purple-900 mb-2">Your Data, Your Rights</h3>
                <p className="text-purple-800 text-sm leading-relaxed">
                  This privacy policy explains how TravelWorld collects, uses, and protects your personal information. We are committed to transparency and giving you control over your data.
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
            <p className="text-gray-600 leading-relaxed mb-4">
              At TravelWorld, we respect your privacy and are committed to protecting your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our services or visit our website.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using TravelWorld services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </div>

          {/* Privacy Sections */}
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div 
                key={section.id}
                className={`bg-white rounded-2xl shadow-lg p-8 mb-6 hover:shadow-xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 pt-2">
                    {section.title}
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed pl-16">
                  {section.content}
                </p>
              </div>
            );
          })}

          {/* Quick Links Section */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Data Protection Quick Links</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="#information-collect" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-300">
                <Database className="h-5 w-5 text-purple-600" />
                <span className="text-gray-700 font-medium">What We Collect</span>
              </a>
              <a href="#your-rights" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-300">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-gray-700 font-medium">Your Rights</span>
              </a>
              <a href="#data-security" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-300">
                <Lock className="h-5 w-5 text-purple-600" />
                <span className="text-gray-700 font-medium">Security Measures</span>
              </a>
              <a href="#cookies" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-300">
                <Cookie className="h-5 w-5 text-purple-600" />
                <span className="text-gray-700 font-medium">Cookie Policy</span>
              </a>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12 text-gray-500 text-sm">
            <p>© 2025 TravelWorld. All rights reserved.</p>
            <p className="mt-2">We are committed to protecting your privacy and maintaining the security of your personal information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}