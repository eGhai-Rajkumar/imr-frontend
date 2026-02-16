import { useState, useEffect } from 'react';
import { X, Plus, Minus, Loader2, CreditCard } from 'lucide-react';

export default function TripInquiryModal({ 
  isOpen, 
  onClose, 
  tripName = "Sample Trip",
  availableDates = [],
  startingPrice = 9999
}) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    generateEnquiryCaptcha();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const generateEnquiryCaptcha = () => {
    const num1 = Math.floor(Math.random() * 5) + 5;
    const num2 = Math.floor(Math.random() * 5) + 1;
    setEnquiryCaptcha({ num1, num2, answer: num1 * num2 });
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
    setChildAges([...childAges, 5]);
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

  const handleEnquirySubmit = async () => {
    if (parseInt(enquiryData.captchaInput) !== enquiryCaptcha.answer) {
      setEnquiryMessage({
        title: 'Validation Error',
        text: 'The security check (CAPTCHA) result is incorrect. Please try again.'
      });
      setShowEnquiryMessage(true);
      generateEnquiryCaptcha();
      return;
    }

    if (!enquiryData.departureDate || !enquiryData.fullName || !enquiryData.email || !enquiryData.phone) {
      setEnquiryMessage({
        title: 'Validation Error',
        text: 'Please fill in all required fields.'
      });
      setShowEnquiryMessage(true);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    onClose();
    setIsSubmitting(false);

    const adults = parseInt(enquiryData.adults) || 0;
    const childrenCount = childAges.length;
    const childAgesList = childrenCount > 0 ? childAges.join(', ') : 'None';

    const submissionText = `Thank you, ${enquiryData.fullName}! Your Trip Inquiry has been submitted for:

**${tripName}**
    
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

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
        <div 
          className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden relative transform scale-100 transition-transform duration-300 max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid md:grid-cols-12 min-h-[500px]">
            {/* Left Side - Quick Booking Card */}
            <div className="md:col-span-5 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 flex flex-col justify-center border-r-4 border-blue-500">
              <div className="max-w-md mx-auto w-full">
                {/* Quick Booking Card */}
                <div className="bg-white rounded-2xl shadow-xl border-4 border-blue-500 p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick Booking</h3>
                  <p className="text-gray-600 text-sm mb-6">Reserve your spot instantly with flexible payment options.</p>
                  
                  {/* Price Display */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-cyan-200">
                    <p className="text-sm text-gray-600 font-medium mb-1 text-center">Starting from</p>
                    <p className="text-4xl font-bold text-blue-600 text-center">
                      ₹{startingPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-1">per person</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span>Instant Confirmation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span>Flexible Payment Options</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span>24/7 Customer Support</span>
                    </div>
                  </div>

                  {/* Info Badges */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Secure Booking
                    </div>
                    <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      Best Price
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Inquiry Form */}
            <div className="md:col-span-7 p-8 overflow-y-auto max-h-[95vh]">
              <div className="max-w-lg mx-auto">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Trip Inquiry</h2>
                  <p className="text-gray-600">
                    Inquiring about: <span className="font-bold text-blue-600">{tripName}</span>
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Preferred Departure Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      1. Preferred Departure Date
                    </label>
                    {availableDates.length > 0 ? (
                      <select
                        value={enquiryData.departureDate}
                        onChange={(e) => handleEnquiryChange('departureDate', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm"
                      >
                        <option value="">Select a date</option>
                        {availableDates.map(date => (
                          <option key={date} value={date}>
                            {new Date(date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="date"
                        value={enquiryData.departureDate}
                        onChange={(e) => handleEnquiryChange('departureDate', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm"
                      />
                    )}
                  </div>

                  {/* Number of Travelers */}
                  <div className="border-2 border-gray-200 p-4 rounded-lg bg-gray-50">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      2. Number of Travelers & Ages
                    </label>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Adults (12+)</label>
                        <input
                          type="number"
                          value={enquiryData.adults}
                          onChange={(e) => handleEnquiryChange('adults', e.target.value)}
                          min="1"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-bold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Total Children (2-11)</label>
                        <div className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-bold text-lg bg-white">
                          {childAges.length}
                        </div>
                      </div>
                    </div>

                    {childAges.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {childAges.map((age, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="number"
                              value={age}
                              onChange={(e) => updateChildAge(index, e.target.value)}
                              min="2"
                              max="11"
                              placeholder={`Child ${index + 1} Age`}
                              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-center text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                            />
                            <button
                              onClick={() => removeChildField(index)}
                              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={addChildField}
                      className="w-full py-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-2 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition"
                    >
                      <Plus className="h-4 w-4" />
                      Add Child (Ages 2-11)
                    </button>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      3. Contact Details
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={enquiryData.fullName}
                        onChange={(e) => handleEnquiryChange('fullName', e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm"
                      />
                      <input
                        type="email"
                        value={enquiryData.email}
                        onChange={(e) => handleEnquiryChange('email', e.target.value)}
                        placeholder="Email Address"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm"
                      />
                      <input
                        type="tel"
                        value={enquiryData.phone}
                        onChange={(e) => handleEnquiryChange('phone', e.target.value)}
                        placeholder="Phone Number (10 digits)"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm"
                      />
                    </div>
                  </div>

                  {/* CAPTCHA */}
                  <div className="border-2 border-blue-300 p-4 rounded-lg bg-blue-50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      4. Security Check
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-3 bg-white border-2 border-blue-500 rounded-lg font-bold text-lg text-blue-700 shadow-sm min-w-[120px] text-center">
                        {enquiryCaptcha.num1} × {enquiryCaptcha.num2} = ?
                      </div>
                      <input
                        type="text"
                        value={enquiryData.captchaInput}
                        onChange={(e) => handleEnquiryChange('captchaInput', e.target.value)}
                        placeholder="Your answer"
                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleEnquirySubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending Inquiry...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Enquire Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Message Modal */}
      {showEnquiryMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              {enquiryMessage.title}
            </h3>
            <p className="text-gray-600 mb-6 whitespace-pre-wrap leading-relaxed">
              {enquiryMessage.text}
            </p>
            <button
              onClick={() => setShowEnquiryMessage(false)}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}