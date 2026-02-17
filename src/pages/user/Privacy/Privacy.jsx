import { Shield, Lock, Eye, Cookie, UserCheck, Database, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import PageHeader from '../../../components/layout/PageHeader';

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
      content: 'We collect information you provide directly to us when booking tours or using our services. This includes your name, email address, phone number, postal address, payment information, passport details (when required), travel preferences, and any special requirements.'
    },
    {
      id: 'how-we-use',
      icon: UserCheck,
      title: 'How We Use Your Information',
      content: 'We use the information we collect to process and manage your bookings, communicate with you about your travel arrangements, provide customer support, send you booking confirmations and updates, process payments and prevent fraud, and improve our services.'
    },
    {
      id: 'sharing',
      icon: Eye,
      title: 'Information Sharing',
      content: 'We may share your information with third-party service providers who assist us in operating our business (hotels, airlines, tour operators), with your consent, to comply with legal obligations, or to protect our rights.'
    },
    {
      id: 'data-security',
      icon: Lock,
      title: 'Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data and secure servers.'
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: 'Cookies',
      content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookie settings through your browser preferences.'
    },
    {
      id: 'courses',
      icon: Shield,
      title: 'Your Rights',
      content: 'You have the right to access, correct, or delete your personal information, object to or restrict certain processing of your data, and withdraw consent where processing is based on consent.'
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <PageHeader
        title="Privacy Policy"
        subtitle="Your privacy is important to us. Learn how we handle your data."
        breadcrumb="Privacy"
        bgImage="https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Intro Card */}
          <div className={`bg-white rounded-2xl shadow-soft p-8 mb-12 border-l-4 border-primary transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-start gap-4">
              <AlertCircle className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Policy Overview</h2>
                <p className="text-gray-600 leading-relaxed">
                  At Indian Mountain Rovers, we respect your privacy and are committed to protecting your personal information.
                  This Privacy Policy describes how we collect, use, and safeguard your information when you use our services.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="grid gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-soft transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed pl-14">
                    {section.content}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 text-gray-500 text-sm">
            <p>Last Updated: October 2025</p>
            <p className="mt-2">If you have any questions, please contact us at <a href="mailto:sales@indianmountainrovers.com" className="text-primary hover:underline">sales@indianmountainrovers.com</a></p>
          </div>

        </div>
      </div>
    </div>
  );
}