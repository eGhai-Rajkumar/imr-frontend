import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import PageHeader from '../../../components/layout/PageHeader';

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
    // Replace with actual toast/notification logic
    console.log('Message sent successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      content: [
        { text: '0177-2831381 (Landline)', href: 'tel:+911772831381' },
        { text: '+91 82788 29941 (Mobile)', href: 'tel:+918278829941' },
        { text: '+91 94183 44227 (Mobile)', href: 'tel:+919418344227' },
      ],
      subtitle: 'Call us during working hours',
    },
    {
      icon: Mail,
      title: 'Email',
      content: [
        { text: 'sales@indianmountainrovers.com', href: 'mailto:sales@indianmountainrovers.com' }
      ],
      subtitle: "We'll respond within 24 hours",
    },
    {
      icon: MapPin,
      title: 'Office Address',
      content: [
        { text: 'Indian Mountain Rovers', href: 'https://maps.app.goo.gl/pkCAr39eBtwqskYs7' }
      ],
      subtitle: 'Shimla, H.P. (171005)',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: [
        { text: 'Monday - Friday: 9:00 AM - 6:00 PM', href: '#' },
        { text: 'Saturday: 10:00 AM - 4:00 PM', href: '#' }
      ],
      subtitle: 'We are here for you',
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <PageHeader
        title="Contact Us"
        subtitle="Your dream adventure starts with a conversation"
        breadcrumb="Contact"
        bgImage="https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* Left Column - Contact Info */}
          <div className="space-y-12">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-sm">Get In Touch</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2 mb-6">
                Let's Plan Your Next Getaway
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                Have a question about our tours? Want to customize your trip? Our team is ready to assist you.
                Whether you're looking for a solo adventure or a family vacation, we're here to help.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <item.icon className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-primary">{item.title}</h3>
                    <div className="space-y-1">
                      {item.content.map((c, i) => (
                        <a
                          key={i}
                          href={c.href}
                          className={`block text-gray-700 font-medium ${c.href !== '#' ? 'hover:text-accent transition-colors' : ''}`}
                          target={item.title === 'Office Address' || item.title === 'Email' ? '_blank' : '_self'}
                          rel={item.title === 'Office Address' ? 'noopener noreferrer' : undefined}
                        >
                          {c.text}
                        </a>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-tr-full -ml-16 -mb-16"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">Send Message</h2>
              <p className="text-gray-500 mb-8">We usually reply within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@address.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Tour Inquiry"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your travel plans..."
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-dark transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
