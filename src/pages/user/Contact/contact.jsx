import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // NOTE: Removed alert() as per instructions. You can replace this with a proper toast/modal notification.
    console.log('Message sent successfully!'); 
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // UPDATED CONTACT INFORMATION
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      // Combining all numbers into an array to be rendered as clickable links
      content: [
        { text: '0177-2831381 (Landline)', href: 'tel:+911772831381' },
        { text: '+91-98162-59997 (Mobile)', href: 'tel:+919816259997' },
        { text: '+91-94180-63381 (Mobile)', href: 'tel:+919418063381' },
      ],
      subtitle: 'Call us during working hours',
      color: 'from-blue-600 to-cyan-500', 
      delay: '0'
    },
    {
      icon: Mail,
      title: 'Email',
      // Making the email content a clickable link
      content: [
        { text: 'info@indianmountainrovers.com', href: 'mailto:info@indianmountainrovers.com' }
      ],
      subtitle: "We'll respond within 24 hours",
      color: 'from-cyan-500 to-green-500',
      delay: '100'
    },
    {
      icon: MapPin,
      title: 'Office Address',
      // Making the address content a clickable link to Google Maps
      content: [
        { text: 'Kapil Niwas Bye Pass Road Chakkar', href: 'https://maps.app.goo.gl/pkCAr39eBtwqskYs7' }
      ],
      subtitle: 'Shimla, H.P. (171005)',
      color: 'from-pink-500 to-orange-500',
      delay: '200'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: [
        { text: 'Monday - Friday: 9:00 AM - 6:00 PM', href: '#' },
        { text: 'Saturday: 10:00 AM - 4:00 PM', href: '#' }
      ],
      subtitle: 'We are here for you',
      color: 'from-orange-500 to-red-500',
      delay: '300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            Contact Holidays Planners
          </h1>
          <p className="text-xl md:text-2xl opacity-90 animate-fade-in" style={{ animationDelay: '200ms' }}>
            Your dream adventure starts with a conversation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Get In Touch
              </h2>
              <p className="text-gray-600 text-lg">
                Have a question about our tours? Want to customize your trip? Our team is ready to assist you.
              </p>
            </div>

            <div className="space-y-4 mt-8">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="animate-slide-in-left group"
                  style={{ animationDelay: `${item.delay}ms` }}
                >
                  <div className="bg-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 text-gray-800">{item.title}</h3>
                          {/* Mapped content to render clickable links */}
                          {item.content.map((c, i) => (
                            <a 
                              key={i} 
                              href={c.href} 
                              className={`block text-gray-700 font-medium ${c.href !== '#' ? 'hover:text-indigo-600 transition-colors' : ''}`}
                              target={item.title === 'Office Address' || item.title === 'Email' ? '_blank' : '_self'}
                              rel={item.title === 'Office Address' ? 'noopener noreferrer' : undefined}
                            >
                              {c.text}
                            </a>
                          ))}
                          <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="animate-slide-in-right">
            <div className="bg-white border-0 rounded-xl shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
              <div className="p-8 lg:p-10">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 mb-8">Fill out the form and we'll get back to you shortly</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Name</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Subject</label>
                    <input 
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What can we help you with?" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..." 
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-300 resize-none"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 animate-fade-in flex items-center justify-center gap-2"
                    style={{ animationDelay: '350ms' }}
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
