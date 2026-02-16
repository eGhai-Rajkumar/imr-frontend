import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MapPin, Calendar, Share2, Facebook, Twitter, Linkedin, Link2, X, Users, AlertCircle, MessageSquare, Send, Edit, Sparkles, CreditCard, ArrowRight, Plane, Star, Phone, Mail, Plus, Minus } from 'lucide-react';

// Trip data for different tabs
const tripDetailsData = {
  'jibhi': {
    route: 'Delhi - Jibhi - Tirthan Valley - Jalori Pass - Great Himalayan National Park - Delhi',
    overview: 'Experience the serene beauty of Jibhi and Tirthan Valley, nestled in the lap of Himalayas. This peaceful retreat offers stunning waterfalls, pristine rivers, and authentic Himachali culture. Perfect for nature lovers seeking tranquility away from crowded tourist spots.',
    fullOverview: 'Experience the serene beauty of Jibhi and Tirthan Valley, nestled in the lap of Himalayas. This peaceful retreat offers stunning waterfalls, pristine rivers, and authentic Himachali culture. Perfect for nature lovers seeking tranquility away from crowded tourist spots. The valley is home to ancient temples, traditional wooden houses, and warm hospitality. Trek through dense forests, discover hidden waterfalls, and immerse yourself in the local culture. This trip is designed for those who want to escape the chaos of city life and reconnect with nature in its purest form.',
    itinerary: [
      { day: 'Day 1', title: 'Delhi to Jibhi', description: 'Overnight journey from Delhi to Jibhi. Reach Jibhi in the morning, check-in to hotel, freshen up and explore the local area.' },
      { day: 'Day 2', title: 'Jibhi Sightseeing', description:'Visit Jibhi Waterfall, explore local villages, visit Chehni Kothi (ancient tower), and enjoy riverside walks.' },
      { day: 'Day 3', title: 'Return to Delhi', description: 'After breakfast, depart for Delhi. Overnight journey back home with beautiful memories.' }
    ],
    inclusions: ['Accommodation in hotels/homestays', 'Transportation (Delhi to Delhi)', 'Breakfast and Dinner', 'Sightseeing as per itinerary', 'Experienced trip leader'],
    exclusions: ['Lunch and snacks', 'Personal expenses', 'Adventure activities', 'Any meals not mentioned', 'Travel insurance'],
    otherInfo: 'Best time to visit: March to June and September to November. Carry warm clothes, comfortable shoes, and valid ID proof. Minimum group size required for departure.'
  },
  'romantic-paris-getaway': {
    route: 'Delhi - romantic-paris-getaway - Delhi',
    overview: 'Trek through the enchanting Parvati Valley to reach the mystical Kheerganga. Witness breathtaking mountain views, relax in natural hot springs, and experience the hippie culture of Kasol. This trip combines adventure with relaxation in the lap of Himalayas.',
    fullOverview: 'Trek through the enchanting Parvati Valley to reach the mystical Kheerganga. Witness breathtaking mountain views, relax in natural hot springs, and experience the hippie culture of Kasol. This trip combines adventure with relaxation in the lap of Himalayas. Walk through pine forests, cross gurgling streams, and camp under a starlit sky. The trek offers stunning views of snow-capped peaks and takes you through quaint villages. Soak in the healing hot springs at Kheerganga and feel rejuvenated. This is a perfect blend of adventure, spirituality, and natural beauty.',
    itinerary: [
      { day: 'Day 1', title: 'Delhi to Kasol', description: 'Overnight journey to Kasol. Reach in morning, check-in, explore local cafes and markets.' },
      { day: 'Day 2', title: 'Kheerganga Trek', description: 'Trek to Kheerganga (12km). Enjoy hot springs, camp under the stars with mountain views.' },
      { day: 'Day 3', title: 'Return to Delhi', description: 'Trek back to Kasol, visit Manikaran Gurudwara, depart for Delhi.' }
    ],
    inclusions: ['Transportation (Delhi to Delhi)', 'Accommodation in camps and hotels', 'Meals as per itinerary', 'Trek guide', 'First aid kit'],
    exclusions: ['Personal expenses', 'Additional activities', 'Travel insurance', 'Any meals not mentioned', 'Porter charges'],
    otherInfo: 'Moderate trek suitable for beginners. Carry trekking shoes, warm clothes, and basic medicines. Age limit: 15-50 years.'
  }
};

// Trip pricing data
const tripPricingData = {
  'jibhi': {
    name: 'Jibhi & Tirthan Valley',
    prices: {
      double: 15000,
      triple: 13500,
      quad: 13000
    },
    availableDates: [
      '2025-03-15',
      '2025-03-22',
      '2025-03-29',
      '2025-04-05',
      '2025-04-12',
      '2025-04-19'
    ]
  },
  'romantic-paris-getaway': {
    name: 'romantic-paris-getaway',
    prices: {
      double: 12000,
      triple: 10500,
      quad: 10000
    },
    availableDates: [
      '2025-03-10',
      '2025-03-17',
      '2025-03-24',
      '2025-04-07',
      '2025-04-14',
      '2025-04-21'
    ]
  }
};

export default function TripDetailsPage({ tripId = 'jibhi' }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  
  // Booking form states
  const [formData, setFormData] = useState({
    departureDate: '',
    sharingOption: 'double',
    adults: 1,
    children: 0,
    fullName: '',
    email: '',
    phone: '',
    captcha: ''
  });

  // Simplified Enquiry form states
  const [enquiryData, setEnquiryData] = useState({
    departureDate: '',
    adults: 1,
    fullName: '',
    email: '',
    phone: '',
    captchaInput: ''
  });

  const [childAges, setChildAges] = useState([]);
  const maxChildren = 5;
  const [enquiryCaptcha, setEnquiryCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [enquiryMessage, setEnquiryMessage] = useState({ title: '', text: '' });
  const [showEnquiryMessage, setShowEnquiryMessage] = useState(false);

  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const tripData = tripDetailsData[tripId] || tripDetailsData['jibhi'];
  const pricingData = tripPricingData[tripId] || tripPricingData['jibhi'];

  const tabs = [
    { id: 'overview', label: 'Overview & Highlights' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'exclusions', label: 'Exclusions' },
    { id: 'other', label: 'Other Info' }
  ];

  // Generate captcha on mount
  useEffect(() => {
    generateCaptcha();
    generateEnquiryCaptcha();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showBookingModal || showEnquiryModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showBookingModal, showEnquiryModal]);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
  };

  const generateEnquiryCaptcha = () => {
    const num1 = Math.floor(Math.random() * 5) + 5; // 5 to 9
    const num2 = Math.floor(Math.random() * 5) + 1; // 1 to 5
    setEnquiryCaptcha({ num1, num2, answer: num1 * num2 });
  };

  const handleTabChange = (tabId) => {
    if (tabId !== activeTab) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveTab(tabId);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = tripData.route;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareOptions(false);
  };

  const shareButtons = [
    { 
      name: 'Copy Link', 
      icon: Link2, 
      bg: 'bg-gray-700 hover:bg-gray-800',
      action: 'copy'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      bg: 'bg-blue-700 hover:bg-blue-800',
      action: 'linkedin'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      bg: 'bg-sky-500 hover:bg-sky-600',
      action: 'twitter'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      bg: 'bg-blue-600 hover:bg-blue-700',
      action: 'facebook'
    },
  ];

  const calculatePrice = () => {
    const basePrice = pricingData.prices[formData.sharingOption];
    const totalTravelers = parseInt(formData.adults) + parseInt(formData.children);
    return basePrice * totalTravelers;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEnquiryChange = (field, value) => {
    setEnquiryData(prev => ({ ...prev, [field]: value }));
  };

  const addChildField = () => {
    if (childAges.length >= maxChildren) {
      setEnquiryMessage({
        title: 'Limit Reached',
        text: `You can add a maximum of ${maxChildren} children per inquiry.`
      });
      setShowEnquiryMessage(true);
      return;
    }
    setChildAges([...childAges, 5]); // Default age is 5
  };

  const removeChildField = (indexToRemove) => {
    setChildAges(childAges.filter((_, index) => index !== indexToRemove));
  };

  const updateChildAge = (index, age) => {
    const numAge = parseInt(age);
    if (!isNaN(numAge)) {
      const clampedAge = Math.min(Math.max(numAge, 2), 11);
      const newAges = [...childAges];
      newAges[index] = clampedAge;
      setChildAges(newAges);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.departureDate) {
      newErrors.departureDate = 'Please select a departure date';
    }

    if (formData.adults < 1) {
      newErrors.adults = 'At least 1 adult is required';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      newErrors.captcha = 'Incorrect answer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setShowBookingModal(false);
      setFormData({
        departureDate: '',
        sharingOption: 'double',
        adults: 1,
        children: 0,
        fullName: '',
        email: '',
        phone: '',
        captcha: ''
      });
      generateCaptcha();
    }, 3000);
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    
    // Validate CAPTCHA
    if (parseInt(enquiryData.captchaInput) !== enquiryCaptcha.answer) {
      setEnquiryMessage({
        title: 'Validation Error',
        text: 'The security check (CAPTCHA) result is incorrect. Please try again.'
      });
      setShowEnquiryMessage(true);
      generateEnquiryCaptcha();
      return;
    }

    // Close modal first
    setShowEnquiryModal(false);

    const adults = parseInt(enquiryData.adults) || 0;
    const childrenCount = childAges.length;
    const childAgesList = childrenCount > 0 ? childAges.join(', ') : 'None';

    const submissionText = `Thank you, ${enquiryData.fullName}! Your Trip Inquiry has been submitted for:

**${pricingData.name}**
    
A travel consultant will contact you shortly on ${enquiryData.phone} (${enquiryData.email}) to discuss your trip details.

--- Inquiry Summary ---
Preferred Date: ${enquiryData.departureDate}
Adults (12+): ${adults}
Children (2-11): ${childrenCount}
Children Ages: ${childAgesList}`;

    setEnquiryMessage({
      title: 'Inquiry Sent!',
      text: submissionText
    });
    setShowEnquiryMessage(true);

    // Reset form
    setTimeout(() => {
      setEnquiryData({
        departureDate: '',
        adults: 1,
        fullName: '',
        email: '',
        phone: '',
        captchaInput: ''
      });
      setChildAges([]);
      generateEnquiryCaptcha();
    }, 1000);
  };

  return (
    <>
      {/* Backdrop when share options are open */}
      {showShareOptions && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setShowShareOptions(false)}
        ></div>
      )}

      {/* Share Button with Options - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-center gap-4">
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className={`bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-full shadow-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-110 flex items-center justify-center border-4 border-white ${
            showShareOptions ? 'rotate-90' : 'rotate-0'
          }`}
        >
          {showShareOptions ? (
            <X className="w-6 h-6 transition-transform duration-300" />
          ) : (
            <Share2 className="w-6 h-6 transition-transform duration-300" />
          )}
        </button>

        {shareButtons.map((button, index) => (
          <button
            key={button.name}
            onClick={() => handleShare(button.action)}
            className={`${button.bg} text-white p-4 rounded-full shadow-2xl transition-all duration-300 border-4 border-white ${
              showShareOptions 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-0 translate-y-20 pointer-events-none'
            }`}
            style={{
              transitionDelay: showShareOptions ? `${index * 50}ms` : `${(shareButtons.length - index - 1) * 30}ms`
            }}
            title={button.name}
          >
            <button.icon className="w-6 h-6" />
          </button>
        ))}
      </div>

      {/* Enquiry Modal - Streamlined Version */}
      {showEnquiryModal && (
        <>
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-80 z-[60] flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={() => setShowEnquiryModal(false)}
          ></div>
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
            <div 
              className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-5 md:p-6 border border-gray-100 relative transform scale-100 transition-transform duration-300 max-h-[98vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowEnquiryModal(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-3xl font-light leading-none transition-colors"
              >
                ×
              </button>
              
              <header className="mb-4 border-b border-cyan-200 pb-3">
                <h1 className="text-2xl font-extrabold text-cyan-700 mb-2">Trip Inquiry</h1>
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg border-l-4 border-cyan-500">
                  <p className="text-xs text-gray-500 mb-1">Inquiring about:</p>
                  <p className="font-bold text-cyan-700 text-base">{pricingData.name}</p>
                  <p className="text-xs text-gray-600 mt-1 flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{tripData.route}</span>
                  </p>
                </div>
              </header>

              <form onSubmit={handleEnquirySubmit} className="space-y-2 text-xs">
                {/* Preferred Departure Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-0.5">1. Preferred Departure Date</label>
                  <input
                    type="date"
                    value={enquiryData.departureDate}
                    onChange={(e) => handleEnquiryChange('departureDate', e.target.value)}
                    required
                    className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 transition duration-150 text-sm"
                  />
                </div>

                {/* Number of Travelers */}
                <fieldset className="border border-gray-200 p-2 rounded-lg space-y-2 bg-gray-50">
                  <legend className="text-sm font-semibold text-gray-700 px-1">2. Number of Travelers & Ages</legend>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Adults (12+)</label>
                      <input
                        type="number"
                        value={enquiryData.adults}
                        onChange={(e) => handleEnquiryChange('adults', e.target.value)}
                        min="1"
                        required
                        className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-base text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Total Children (2-11)</label>
                      <div className="mt-0.5 w-full px-2 py-1.5 border border-gray-300 rounded-lg text-base text-center bg-white text-gray-700 font-bold">
                        {childAges.length}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Child Age Input */}
                  <div className="pt-2 border-t border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Children's Ages (2-11)</label>
                    <div className="space-y-1">
                      {childAges.map((age, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="number"
                            value={age}
                            onChange={(e) => updateChildAge(index, e.target.value)}
                            min="2"
                            max="11"
                            required
                            placeholder={`Age of Child ${index + 1} (2-11)`}
                            className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm text-center"
                          />
                          <button
                            type="button"
                            onClick={() => removeChildField(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg transition duration-150"
                            title="Remove Child"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addChildField}
                      className="mt-1 w-full text-cyan-600 hover:text-cyan-800 text-xs font-medium flex items-center justify-center p-1.5 rounded-lg border border-cyan-100 hover:bg-cyan-50 transition duration-150"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Child
                    </button>
                  </div>
                </fieldset>

                {/* Contact Information */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-0.5">3. Contact Details</label>
                  <input
                    type="text"
                    value={enquiryData.fullName}
                    onChange={(e) => handleEnquiryChange('fullName', e.target.value)}
                    required
                    placeholder="Full Name"
                    className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm"
                  />
                  <input
                    type="email"
                    value={enquiryData.email}
                    onChange={(e) => handleEnquiryChange('email', e.target.value)}
                    required
                    placeholder="Email ID"
                    className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm"
                  />
                  <input
                    type="tel"
                    value={enquiryData.phone}
                    onChange={(e) => handleEnquiryChange('phone', e.target.value)}
                    required
                    pattern="[0-9]{10,}"
                    title="10+ digit phone number"
                    placeholder="Phone Number"
                    className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm"
                  />
                </div>

                {/* CAPTCHA */}
                <div className="border border-cyan-400 p-2 rounded-lg bg-cyan-50/50 shadow-inner">
                  <label className="block text-xs font-bold text-cyan-800 mb-0.5">4. Security Check</label>
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-extrabold p-1.5 bg-white border border-cyan-500 rounded-md inline-block select-none text-cyan-700 shadow-sm min-w-[100px] text-center">
                      {enquiryCaptcha.num1} × {enquiryCaptcha.num2} = ?
                    </div>
                    <input
                      type="text"
                      value={enquiryData.captchaInput}
                      onChange={(e) => handleEnquiryChange('captchaInput', e.target.value)}
                      placeholder="Enter result"
                      required
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg shadow-md shadow-cyan-500/50 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500 transition duration-300"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Message Box */}
          {showEnquiryMessage && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[80] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100 opacity-100">
                <h3 className="text-xl font-bold mb-3 text-gray-800">{enquiryMessage.title}</h3>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap text-sm">{enquiryMessage.text}</p>
                <button
                  onClick={() => setShowEnquiryMessage(false)}
                  className="w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] animate-backdrop-fade-in"
            onClick={() => setShowBookingModal(false)}
          ></div>
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl animate-modal-pop-in">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {showSuccess ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-2xl border-4 border-green-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-success-bounce">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Booking Request Sent!</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Thank you for your interest! Our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4">
                    <h2 className="text-2xl font-bold">{pricingData.name}</h2>
                    <p className="text-cyan-100 text-sm">Fill the form to request booking</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-1.5">
                          <Calendar className="w-4 h-4 text-cyan-600" />
                          Departure Date
                        </label>
                        <select
                          value={formData.departureDate}
                          onChange={(e) => handleInputChange('departureDate', e.target.value)}
                          className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                            errors.departureDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Choose a Date</option>
                          {pricingData.availableDates.map(date => (
                            <option key={date} value={date}>
                              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </option>
                          ))}
                        </select>
                        {errors.departureDate && (
                          <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.departureDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-1.5">
                          <Users className="w-4 h-4 text-cyan-600" />
                          Sharing Option
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(pricingData.prices).map(([type, price]) => (
                            <label key={type} className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="sharing"
                                value={type}
                                checked={formData.sharingOption === type}
                                onChange={(e) => handleInputChange('sharingOption', e.target.value)}
                                className="sr-only"
                              />
                              <div className={`p-2 border-2 rounded-lg text-center transition-all ${
                                formData.sharingOption === type
                                  ? 'border-cyan-500 bg-cyan-50 shadow-md'
                                  : 'border-gray-300 hover:border-cyan-300'
                              }`}>
                                <div className={`font-bold text-xs capitalize ${
                                  formData.sharingOption === type ? 'text-cyan-700' : 'text-gray-700'
                                }`}>
                                  {type}
                                </div>
                                <div className={`text-sm font-bold ${
                                  formData.sharingOption === type ? 'text-cyan-600' : 'text-gray-900'
                                }`}>
                                  ₹{(price/1000).toFixed(0)}k
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-700 font-semibold text-sm mb-1.5 block">Adults (12+)</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.adults}
                            onChange={(e) => handleInputChange('adults', e.target.value)}
                            className={`w-full px-3 py-2 border-2 rounded-lg text-center font-bold focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                              errors.adults ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="text-gray-700 font-semibold text-sm mb-1.5 block">Children (2-11)</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={formData.children}
                            onChange={(e) => handleInputChange('children', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white text-center">
                        <div className="text-xs text-cyan-50">Total Price</div>
                        <div className="text-2xl font-bold">₹{calculatePrice().toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-700 font-semibold text-sm mb-1.5 block">Contact Details</label>
                        <div className="space-y-2">
                          <div>
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                                errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                            />
                            {errors.fullName && (
                              <p className="text-red-600 text-xs mt-0.5">{errors.fullName}</p>
                            )}
                          </div>

                          <div>
                            <input
                              type="email"
                              placeholder="Email ID"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                            />
                            {errors.email && (
                              <p className="text-red-600 text-xs mt-0.5">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <input
                              type="tel"
                              placeholder="Phone Number"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                                errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                              }`}
                            />
                            {errors.phone && (
                              <p className="text-red-600 text-xs mt-0.5">{errors.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-700 font-semibold text-sm mb-1.5 block">Security Check</label>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-400 rounded-lg px-4 py-2">
                            <div className="text-lg font-bold text-cyan-700">
                              {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Answer"
                            value={formData.captcha}
                            onChange={(e) => handleInputChange('captcha', e.target.value)}
                            className={`flex-1 px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                              errors.captcha ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.captcha && (
                          <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.captcha}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 transform ${
                          isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:scale-[1.02] hover:shadow-xl active:scale-95'
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </span>
                        ) : (
                          'Confirm and Send Request'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side - Trip Details Tabs */}
            <div className="lg:col-span-7">
              <section>
                <div className="bg-gradient-to-r from-cyan-100 via-blue-50 to-cyan-100 rounded-2xl shadow-xl overflow-hidden animate-slide-down">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {tabs.map((tab, index) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`relative px-6 py-5 font-semibold whitespace-nowrap transition-all duration-500 flex-shrink-0 group ${
                          activeTab === tab.id
                            ? 'text-cyan-700 bg-white shadow-lg'
                            : 'text-gray-600 hover:text-cyan-600 hover:bg-white/50'
                        }`}
                        style={{
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 animate-expand"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`bg-white rounded-2xl shadow-2xl mt-6 p-8 border border-gray-100 transition-all duration-300 ${
                  isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 animate-fade-in-up'
                }`}>
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          Overview & Highlights
                        </h2>
                      </div>
                      
                      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 border-l-4 border-cyan-600 rounded-r-2xl p-6 shadow-md animate-slide-in-right hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-1" />
                          <p className="text-gray-800 font-medium leading-relaxed">
                            {tripData.route}
                          </p>
                        </div>
                      </div>

                      <div className="text-gray-700 leading-relaxed space-y-4 animate-fade-in">
                        <p className="text-lg">
                          {showFullOverview ? tripData.fullOverview : tripData.overview}
                        </p>
                        <button 
                          onClick={() => setShowFullOverview(!showFullOverview)}
                          className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-all duration-300 hover:gap-3 group"
                        >
                          {showFullOverview ? 'Read Less' : 'Read More'}
                          <span className="group-hover:translate-x-1 transition-transform">
                            {showFullOverview ? '←' : '→'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'itinerary' && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          Itinerary
                        </h2>
                      </div>
                      <div className="space-y-6 mt-8">
                        {tripData.itinerary.map((item, index) => (
                          <div 
                            key={index} 
                            className="group relative pl-8 pb-8 animate-slide-up"
                            style={{ animationDelay: `${index * 0.15}s` }}
                          >
                            {index !== tripData.itinerary.length - 1 && (
                              <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-400 opacity-30"></div>
                            )}
                            
                            <div className="absolute left-0 top-1 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                              <Calendar className="w-3 h-3 text-white" />
                            </div>
                            
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200">
                              <div className="flex items-baseline gap-3 mb-2">
                                <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-full">
                                  {item.day}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {item.title}
                                </h3>
                              </div>
                              <p className="text-gray-700 leading-relaxed mt-3">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'inclusions' && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          What's Included
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {tripData.inclusions.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-green-100 hover:border-green-300 animate-scale-in group"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                            <span className="text-gray-800 leading-relaxed font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'exclusions' && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          What's Not Included
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {tripData.exclusions.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-red-100 hover:border-red-300 animate-scale-in group"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                            <span className="text-gray-800 leading-relaxed font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'other' && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          Important Information
                        </h2>
                      </div>
                      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-l-4 border-blue-600 rounded-r-2xl p-8 shadow-lg animate-fade-in-up">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-200/20 rounded-full -ml-12 -mb-12"></div>
                        <p className="text-gray-800 leading-relaxed text-lg relative z-10">{tripData.otherInfo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Side - Customize Booking & Book Now */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 lg:self-start">
              {/* Customize Booking Section */}
              <div className="relative overflow-hidden bg-white rounded-xl shadow-2xl border-4 border-cyan-500 animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 opacity-10 animate-gradient-shift"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse-glow"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse-glow-delayed"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg animate-spin-slow">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent">
                          Customize Trip
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">Tailor your adventure</p>
                      </div>
                    </div>
                    <Edit className="w-5 h-5 text-cyan-600 animate-bounce-subtle" />
                  </div>

                  <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full mb-4 animate-shimmer"></div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Have specific requirements? Click below to fill a detailed form and get a custom package.
                  </p>

                  <button
                    onClick={() => setShowEnquiryModal(true)}
                    className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-700 hover:via-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 animate-gradient-x"
                  >
                    <Send className="w-5 h-5 animate-send-icon" />
                    <span>Send Custom Query</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold flex items-center gap-1 animate-fade-in-up">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                      Quick Response
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      Free Consultation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
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

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes expand {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-soft {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-glow-delayed {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 100%;
            background-position: left center;
          }
          50% {
            background-size: 200% 100%;
            background-position: right center;
          }
        }

        @keyframes send-icon {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(3px) rotate(5deg);
          }
        }

        @keyframes backdrop-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modal-pop-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes success-bounce {
          0%, 100% {
            transform: scale(1);
          }
          10%, 30% {
            transform: scale(0.9);
          }
          20%, 40% {
            transform: scale(1.1);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out backwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out backwards;
        }

        .animate-expand {
          animation: expand 0.3s ease-out;
          transform-origin: left;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out 0.3s backwards;
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-pulse-glow-delayed {
          animation: pulse-glow-delayed 3s ease-in-out infinite 1.5s;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, 
            rgba(6, 182, 212, 1) 0%, 
            rgba(59, 130, 246, 1) 25%,
            rgba(6, 182, 212, 1) 50%,
            rgba(59, 130, 246, 1) 75%,
            rgba(6, 182, 212, 1) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-send-icon {
          animation: send-icon 1s ease-in-out infinite;
        }

        .animate-backdrop-fade-in {
          animation: backdrop-fade-in 0.3s ease-out;
        }

        .animate-modal-pop-in {
          animation: modal-pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-success-bounce {
          animation: success-bounce 0.8s ease-in-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}