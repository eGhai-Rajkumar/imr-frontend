import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  Send,
  CreditCard,
  FileText,
  DollarSign,
  AlertCircle,
  Users,
  Plus,
  Minus,
  X,
  Loader2,
} from "lucide-react";

// --- API CONFIGURATION (AUTO-FILLED) ---
const API_CONFIG = {
  // Global Key
  API_KEY: "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M",
  // Domain Name (sent in payload for both forms)
  DOMAIN_NAME: "https://www.indianmountainrovers.com",

  // Endpoints
  ENQUIRY_ENDPOINT: "https://api.yaadigo.com/secure/api/enquires/",
  BOOKING_ENDPOINT: "https://api.yaadigo.com/secure/api/booking_request/",
  TRIP_DETAIL_BASE_URL: "https://api.yaadigo.com/secure/api/trips/",
};

const ENQUIRY_ENDPOINT = API_CONFIG.ENQUIRY_ENDPOINT;
const BOOKING_ENDPOINT = API_CONFIG.BOOKING_ENDPOINT;

// --- UTILITY FUNCTIONS (Unchanged) ---

const parseListField = (fieldString) => {
    if (!fieldString) return [];
    let cleanedString = fieldString.replace(/•\s*/g, '');
    return cleanedString
        .split(/[\n;]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};


export default function TripTab({ tripId }) {
  const [tripData, setTripData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  // --- START: Modal States ---
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Used for Booking form success screen

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
  const [errors, setErrors] = useState({});
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });

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
  const [enquiryMessage, setEnquiryMessage] = useState({ title: '', text: '', success: false });
  const [showEnquiryMessage, setShowEnquiryMessage] = useState(false);

  // --- END: Modal States ---


  // --- START: Data Fetching and Initialization ---

  useEffect(() => {
    if (!tripId) return;
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`${API_CONFIG.TRIP_DETAIL_BASE_URL}${tripId}/`, {
          headers: { "x-api-key": API_CONFIG.API_KEY },
        });
        const data = res.data.data || res.data;
        setTripData(data);

        // Set initial sharing option
        if (data.pricing?.pricing_model === 'fixed_departure') {
          const packages = data.pricing.fixed_departure[0]?.costingPackages || [];
          if (packages.length > 0) {
            // Initialize with the first package's title/type
            setFormData(prev => ({ ...prev, sharingOption: packages[0].title }));
          }
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
      }
    };
    fetchTrip();
  }, [tripId]);

  // Generate captchas on mount
  useEffect(() => {
    generateCaptcha();
    generateEnquiryCaptcha();
  }, []);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showBookingModal || showEnquiryModal || showEnquiryMessage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showBookingModal, showEnquiryModal, showEnquiryMessage]);


  // --- START: New Hooks/Memos to process tripData for UI ---

  // Determine pricing model
  const isFixedDeparture = tripData?.pricing?.pricing_model === 'fixed_departure';
  const isCustomized = tripData?.pricing?.pricing_model === 'customized';

  // Get pricing details for Quick Booking section
  const pricingDetails = useMemo(() => {
    if (isFixedDeparture && tripData.pricing.fixed_departure.length > 0) {
      const allDepartures = tripData.pricing.fixed_departure;
      const firstDeparture = allDepartures[0];
      const packages = firstDeparture.costingPackages;

      const availableDates = allDepartures.map(dep => dep.from_date);

      const pricesMap = packages.reduce((acc, pkg) => {
        // Use title as the key for pricing map
        acc[pkg.title] = pkg.final_price;
        return acc;
      }, {});

      const startingPrice = Math.min(...packages.map(p => p.final_price));

      return {
        type: 'fixed_departure',
        availableDates,
        packages,
        pricesMap,
        startingPrice,
      };
    }

    if (isCustomized && tripData.pricing.customized.final_price) {
      return {
        type: 'customized',
        startingPrice: tripData.pricing.customized.final_price,
      };
    }

    return null;
  }, [tripData, isFixedDeparture, isCustomized]);

  // Calculate the price based on form data
  const calculatePrice = () => {
    if (!pricingDetails || !pricingDetails.pricesMap) return 0;

    const basePrice = pricingDetails.pricesMap[formData.sharingOption];

    if (!basePrice) return 0;

    const totalTravelers = parseInt(formData.adults) + parseInt(formData.children);
    return basePrice * totalTravelers;
  };

  // Get price per person for the selected sharing option
  const getPricePerPerson = () => {
    if (!pricingDetails || !pricingDetails.pricesMap) return 0;
    return pricingDetails.pricesMap[formData.sharingOption] || 0;
  }

  // --- END: New Hooks/Memos ---


  // --- START: Form and Submission Logic ---

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

  // Booking Form Input Handler (Unchanged)
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Enquiry Form Input Handler (Unchanged)
  const handleEnquiryChange = (field, value) => {
    setEnquiryData(prev => ({ ...prev, [field]: value }));
  };

  // Children field handlers (Unchanged)
  const addChildField = () => {
    if (childAges.length >= maxChildren) {
      setEnquiryMessage({
        title: 'Limit Reached',
        text: `You can add a maximum of ${maxChildren} children per inquiry.`,
        success: false
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

  // Booking Form Validation (Minor cleanup)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.departureDate) {
      newErrors.departureDate = 'Please select a departure date';
    }
    if (parseInt(formData.adults) < 1) {
      newErrors.adults = 'At least 1 adult is required';
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim() || !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      newErrors.captcha = 'Incorrect answer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submission handler for the Quick Booking form.
   * Sends data to the booking_request endpoint.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const pricePerPerson = getPricePerPerson();
    const estimatedTotal = calculatePrice();

    // Prepare API Data with snake_case and mandatory fields
    const apiData = {
      "departure_date": formData.departureDate,
      "sharing_option": formData.sharingOption,
      "price_per_person": pricePerPerson,
      "adults": parseInt(formData.adults),
      "children": parseInt(formData.children), // Assuming children field is in adults/children structure
      "estimated_total_price": estimatedTotal,
      "full_name": formData.fullName,
      "email": formData.email,
      "phone_number": formData.phone.replace(/\D/g, ''), // Clean phone number
      "domain_name": API_CONFIG.DOMAIN_NAME, // Auto-filled domain name
    };

    try {
      const res = await axios.post(BOOKING_ENDPOINT, apiData, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_CONFIG.API_KEY, // Auto-filled API Key
        },
      });

      // Handle successful booking request
      console.log("Booking Request Sent:", res.data);
      setShowSuccess(true);
      
    } catch (error) {
      console.error("Booking submission failed:", error.response?.data || error.message);
      setErrors({ api: "Submission failed. Please check details or contact support." });
      generateCaptcha(); // Refresh CAPTCHA on failure
      setShowSuccess(false);
      
      // Keep modal open and show generic error
      setTimeout(() => setErrors({}), 5000);

    } finally {
      setIsSubmitting(false);

      // Reset form on success after 3 seconds
      if (showSuccess) {
        setTimeout(() => {
          setShowSuccess(false);
          setShowBookingModal(false);
          setFormData(prev => ({ ...prev, departureDate: '', adults: 1, children: 0, fullName: '', email: '', phone: '', captcha: '' }));
          generateCaptcha();
        }, 3000);
      }
    }
  };


  /**
   * Submission handler for the general Enquiry form.
   * Sends data to the enquiries endpoint.
   */
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowEnquiryMessage(false);

    // 1. Validate CAPTCHA
    if (parseInt(enquiryData.captchaInput) !== enquiryCaptcha.answer) {
      setEnquiryMessage({
        title: 'Validation Error',
        text: 'The security check (CAPTCHA) result is incorrect. Please try again.',
        success: false
      });
      setShowEnquiryMessage(true);
      generateEnquiryCaptcha();
      setIsSubmitting(false);
      return;
    }
    
    // 2. Prepare API Data
    const adults = parseInt(enquiryData.adults) || 1;
    const childrenCount = childAges.length;

    const apiData = {
      // Mapping fields to the snake_case used in your Enquiries API schema
      "destination": tripData?.title || 'Unknown Trip',
      "departure_city": "Not Specified", // Default/placeholder
      "travel_date": enquiryData.departureDate || 'Flexible',
      "adults": adults,
      "children": childrenCount,
      "infants": 0, // Assuming 0 as infants are not tracked separately here
      "hotel_category": "Not Specified",
      "full_name": enquiryData.fullName,
      "contact_number": enquiryData.phone.replace(/\D/g, ''),
      "email": enquiryData.email,
      "additional_comments": `Trip ID: ${tripId}. Children Ages: ${childAges.join(', ')}`,
      "domain_name": API_CONFIG.DOMAIN_NAME, // Auto-filled domain name
    };

    try {
      const res = await axios.post(ENQUIRY_ENDPOINT, apiData, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_CONFIG.API_KEY, // Auto-filled API Key
        },
      });

      console.log("Enquiry Request Sent:", res.data);
      
      // 3. Show Success Message
      setEnquiryMessage({
        title: 'Inquiry Sent!',
        text: `Thank you, ${enquiryData.fullName}! Your Trip Inquiry for ${tripData?.title || 'This Trip'} has been submitted. A travel consultant will contact you shortly.`,
        success: true
      });

      // 4. Reset forms and close modal
      setShowEnquiryModal(false);
      setShowEnquiryMessage(true);
      setEnquiryData(prev => ({ ...prev, adults: 1, fullName: '', email: '', phone: '', captchaInput: '' }));
      setChildAges([]);
      generateEnquiryCaptcha();
      
    } catch (error) {
      console.error("Enquiry submission failed:", error.response?.data || error.message);
      setEnquiryMessage({
        title: 'Submission Failed',
        text: `There was a problem submitting your inquiry. Please try again or contact us directly. Error: ${error.response?.data?.message || error.message}`,
        success: false
      });
      setShowEnquiryModal(false);
      setShowEnquiryMessage(true);
      generateEnquiryCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- END: Form and Submission Logic ---


  // --- START: UI Rendering ---

  const handleTabChange = (tabId) => {
    if (tabId !== activeTab) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveTab(tabId);
        setIsAnimating(false);
      }, 150);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview & Highlights" },
    { id: "itinerary", label: "Itinerary" },
    { id: "inclusions", label: "Inclusions" },
    { id: "exclusions", label: "Exclusions" },
    { id: "other", label: "Other Info" },
  ];

  if (!tripData)
    return (
      <div className="text-center py-20 text-gray-500">
        <Loader2 className="w-8 h-8 mx-auto animate-spin mb-2 text-cyan-600" />
        Loading trip...
      </div>
    );

  // --- Pre-process Data ---
  const highlightsArray = parseListField(tripData.highlights);
  // Pre-process policies for the Other Info tab
  const policies = [
    { title: "General Terms", content: tripData.terms, icon: FileText, color: "blue" },
    { title: "Cancellation Policy", content: tripData.privacy_policy, icon: XCircle, color: "red" },
    { title: "Payment Terms", content: tripData.payment_terms, icon: CreditCard, color: "green" },
  ].filter(p => p.content);


  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* -------------------- 1. ENQUIRY MODAL ----------------------- */}
      {/* ------------------------------------------------------------- */}
      {showEnquiryModal && (
        <>
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-80 z-[100000] flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={() => !isSubmitting && setShowEnquiryModal(false)}
          ></div>

          <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4 overflow-y-auto">
            <div
              className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-5 md:p-6 border border-gray-100 relative transform scale-100 transition-transform duration-300 max-h-[98vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => !isSubmitting && setShowEnquiryModal(false)}
                disabled={isSubmitting}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-3xl font-light leading-none transition-colors"
              >
                ×
              </button>

              <header className="mb-4 border-b border-cyan-200 pb-2">
                <h1 className="text-2xl font-extrabold text-cyan-700">Trip Inquiry</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  Inquiring about: <span className="font-bold text-cyan-700">{tripData.title}</span>
                </p>
              </header>

              <form onSubmit={handleEnquirySubmit} className="space-y-2 text-xs">
                {/* Preferred Departure Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-0.5">1. Preferred Departure Date</label>
                  <input
                    type="date"
                    value={enquiryData.departureDate}
                    onChange={(e) => handleEnquiryChange('departureDate', e.target.value)}
                    disabled={isSubmitting}
                    className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 transition duration-150 text-sm disabled:bg-gray-100"
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
                        disabled={isSubmitting}
                        className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-base text-center disabled:bg-gray-100"
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
                            disabled={isSubmitting}
                            placeholder={`Age of Child ${index + 1} (2-11)`}
                            className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm text-center disabled:bg-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => removeChildField(index)}
                            disabled={isSubmitting}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg transition duration-150 disabled:opacity-50"
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
                      disabled={isSubmitting || childAges.length >= maxChildren}
                      className="mt-1 w-full text-cyan-600 hover:text-cyan-800 text-xs font-medium flex items-center justify-center p-1.5 rounded-lg border border-cyan-100 hover:bg-cyan-50 transition duration-150 disabled:opacity-50"
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
                    disabled={isSubmitting}
                    placeholder="Full Name"
                    className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm disabled:bg-gray-100"
                  />
                  <input
                    type="email"
                    value={enquiryData.email}
                    onChange={(e) => handleEnquiryChange('email', e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Email ID"
                    className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm disabled:bg-gray-100"
                  />
                  <input
                    type="tel"
                    value={enquiryData.phone}
                    onChange={(e) => handleEnquiryChange('phone', e.target.value)}
                    required
                    disabled={isSubmitting}
                    pattern="[0-9]{10,}"
                    title="10+ digit phone number"
                    placeholder="Phone Number"
                    className="mt-0.5 block w-full px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm disabled:bg-gray-100"
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
                      disabled={isSubmitting}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg transition duration-150 text-sm disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg shadow-md shadow-cyan-500/50 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500 transition duration-300 disabled:bg-cyan-400"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Inquiry...
                      </span>
                    ) : (
                      'Send Inquiry'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Message Box (Enquiry Success/Error) */}
      {showEnquiryMessage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[100002] flex items-center justify-center p-4">
          <div className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100 opacity-100 border-t-4 ${enquiryMessage.success ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-center gap-3 mb-3">
              {enquiryMessage.success ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <h3 className="text-xl font-bold text-gray-800">{enquiryMessage.title}</h3>
            </div>
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

      {/* ------------------------------------------------------------- */}
      {/* -------------------- 2. BOOKING MODAL ----------------------- */}
      {/* ------------------------------------------------------------- */}
      {isFixedDeparture && pricingDetails && (
        <>
          {showBookingModal && (
            <>
              <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100000] animate-backdrop-fade-in"
                onClick={() => !isSubmitting && setShowBookingModal(false)}
              ></div>

              <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
                <div className="relative w-full max-w-5xl animate-modal-pop-in">
                  <button
                    onClick={() => !isSubmitting && setShowBookingModal(false)}
                    disabled={isSubmitting}
                    className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white group disabled:opacity-50"
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
                        Thank you for your request! We have reserved your spots and our team will contact you shortly to finalize payment.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4">
                        <h2 className="text-2xl font-bold">{tripData.title}</h2>
                        <p className="text-cyan-100 text-sm">Fill the form to request booking</p>
                      </div>

                      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 p-6">
                        <div className="space-y-4">
                          {/* Departure Date */}
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
                              } disabled:bg-gray-100`}
                              required
                              disabled={isSubmitting}
                            >
                              <option value="">Choose a Date</option>
                              {pricingDetails.availableDates.map(date => (
                                <option key={date} value={date}>
                                  {formatDate(date)}
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

                          {/* Sharing Option */}
                          <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-1.5">
                              <Users className="w-4 h-4 text-cyan-600" />
                              Sharing Option
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {pricingDetails.packages.map(pkg => (
                                <label key={pkg.title} className="relative cursor-pointer" style={{ opacity: isSubmitting ? 0.6 : 1 }}>
                                  <input
                                    type="radio"
                                    name="sharing"
                                    value={pkg.title}
                                    checked={formData.sharingOption === pkg.title}
                                    onChange={(e) => handleInputChange('sharingOption', e.target.value)}
                                    className="sr-only"
                                    disabled={isSubmitting}
                                  />
                                  <div className={`p-2 border-2 rounded-lg text-center transition-all ${
                                    formData.sharingOption === pkg.title
                                      ? 'border-cyan-500 bg-cyan-50 shadow-md'
                                      : 'border-gray-300 hover:border-cyan-300'
                                  }`}>
                                    <div className={`font-bold text-xs capitalize ${
                                      formData.sharingOption === pkg.title ? 'text-cyan-700' : 'text-gray-700'
                                    }`}>
                                      {pkg.title}
                                    </div>
                                    <div className={`text-sm font-bold ${
                                      formData.sharingOption === pkg.title ? 'text-cyan-600' : 'text-gray-900'
                                    }`}>
                                      ₹{(pkg.final_price / 1000).toFixed(0)}k
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Adults and Children Count */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-gray-700 font-semibold text-sm mb-1.5 block">No. of Travellers</label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={formData.adults}
                                onChange={(e) => handleInputChange('adults', e.target.value)}
                                className={`w-full px-3 py-2 border-2 rounded-lg text-center font-bold focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                                  errors.adults ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                } disabled:bg-gray-100`}
                                disabled={isSubmitting}
                              />
                              {errors.adults && (
                                <p className="text-red-600 text-xs mt-1">{errors.adults}</p>
                              )}
                            </div>
                            
                            {/* <div>
                              <label className="text-gray-700 font-semibold text-sm mb-1.5 block">Children (2-11)</label>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={formData.children}
                                onChange={(e) => handleInputChange('children', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all disabled:bg-gray-100"
                                disabled={isSubmitting}
                              />
                            </div> */}
                          </div>

                          {/* Total Price */}
                          <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white text-center">
                            <div className="text-xs text-cyan-50">Total Estimated Price</div>
                            <div className="text-2xl font-bold">₹{calculatePrice().toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Contact & CAPTCHA */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-gray-700 font-semibold text-sm mb-1.5 block">Contact Details</label>
                            <div className="space-y-2">
                              {/* Full Name */}
                              <div>
                                <input
                                  type="text"
                                  placeholder="Full Name"
                                  value={formData.fullName}
                                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                  } disabled:bg-gray-100`}
                                  required
                                  disabled={isSubmitting}
                                />
                                {errors.fullName && (
                                  <p className="text-red-600 text-xs mt-0.5">{errors.fullName}</p>
                                )}
                              </div>

                              {/* Email */}
                              <div>
                                <input
                                  type="email"
                                  placeholder="Email ID"
                                  value={formData.email}
                                  onChange={(e) => handleInputChange('email', e.target.value)}
                                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                  } disabled:bg-gray-100`}
                                  required
                                  disabled={isSubmitting}
                                />
                                {errors.email && (
                                  <p className="text-red-600 text-xs mt-0.5">{errors.email}</p>
                                )}
                              </div>

                              {/* Phone */}
                              <div>
                                <input
                                  type="tel"
                                  placeholder="Phone Number (10+ digits)"
                                  value={formData.phone}
                                  onChange={(e) => handleInputChange('phone', e.target.value)}
                                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                  } disabled:bg-gray-100`}
                                  required
                                  disabled={isSubmitting}
                                  pattern="[0-9]{10,}"
                                  title="10+ digit phone number"
                                />
                                {errors.phone && (
                                  <p className="text-red-600 text-xs mt-0.5">{errors.phone}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* CAPTCHA */}
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
                                } disabled:bg-gray-100`}
                                required
                                disabled={isSubmitting}
                              />
                            </div>
                            {errors.captcha && (
                              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.captcha}
                              </p>
                            )}
                          </div>
                          
                          {/* API Error Message */}
                          {errors.api && (
                            <div className="p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                              <span>{errors.api}</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 transform ${
                              isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:scale-[1.02] hover:shadow-xl active:scale-95'
                            }`}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending Request...
                              </span>
                            ) : (
                              'Confirm and Send Request'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}


      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ================= LEFT SIDE: TABS ================= */}
            <div className="lg:col-span-7">
              <section>
                {/* Tabs (Unchanged) */}
                <div className="bg-gradient-to-r from-cyan-100 via-blue-50 to-cyan-100 rounded-2xl shadow-xl overflow-hidden animate-slide-down">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {tabs.map((tab, index) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`relative px-6 py-5 font-semibold whitespace-nowrap transition-all duration-500 flex-shrink-0 group ${
                          activeTab === tab.id
                            ? "text-cyan-700 bg-white shadow-lg"
                            : "text-gray-600 hover:text-cyan-600 hover:bg-white/50"
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 animate-expand"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content (Unchanged) */}
                <div
                  className={`bg-white rounded-2xl shadow-2xl mt-6 p-8 border border-gray-100 transition-all duration-300 ${
                    isAnimating
                      ? "opacity-0 translate-y-4"
                      : "opacity-100 translate-y-0 animate-fade-in-up"
                  }`}
                >
                  {/* ---------------- OVERVIEW ---------------- */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          Overview & Highlights
                        </h2>
                      </div>

                      {/* From → To */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 border-l-4 border-cyan-600 rounded-r-2xl p-6 shadow-md animate-slide-in-right hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-1" />
                          <p className="text-gray-800 font-medium leading-relaxed">
                            {tripData.pickup_location
                              ? `${tripData.pickup_location} → ${tripData.drop_location}`
                              : "Route information not available"}
                          </p>
                        </div>
                      </div>

                      {/* Overview */}
                      <div className="text-gray-700 leading-relaxed space-y-4 animate-fade-in">
                        <p className="text-lg">
                          {showFullOverview || (tripData.overview?.length || 0) <= 400
                            ? tripData.overview
                            : `${tripData.overview?.slice(0, 400)}...`}
                        </p>
                        {(tripData.overview?.length || 0) > 400 && (
                            <button
                              onClick={() => setShowFullOverview(!showFullOverview)}
                              className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-all duration-300 hover:gap-3 group"
                            >
                              {showFullOverview ? "Read Less" : "Read More"}
                              <span className="group-hover:translate-x-1 transition-transform">
                                {showFullOverview ? "←" : "→"}
                              </span>
                            </button>
                        )}
                      </div>

                      {/* Highlights */}
                      {highlightsArray.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500" />
                            Trip Highlights
                          </h3>
                          <ul className="grid md:grid-cols-2 gap-3">
                            {highlightsArray.map((highlight, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-gray-700 bg-yellow-50 rounded-lg px-3 py-2 border border-yellow-100 hover:shadow-md transition-all animate-scale-in"
                                style={{animationDelay: `${index * 0.05}s`}}
                              >
                                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-1" fill="currentColor" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ---------------- ITINERARY ---------------- */}
                  {activeTab === "itinerary" && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          Itinerary
                        </h2>
                      </div>
                      <div className="space-y-6 mt-8">
                        {tripData.itinerary?.length ? (
                          tripData.itinerary.map((item, index) => (
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
                                    Day {item.day_number}
                                  </span>
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {item.title}
                                  </h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">
                            Itinerary not available.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ---------------- INCLUSIONS ---------------- */}
                  {activeTab === "inclusions" && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          What's Included
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {parseListField(tripData.inclusions).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-green-100 hover:border-green-300 animate-scale-in group"
                            style={{animationDelay: `${index * 0.05}s`}}
                          >
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-800 leading-relaxed font-medium">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ---------------- EXCLUSIONS ---------------- */}
                  {activeTab === "exclusions" && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          What's Not Included
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {parseListField(tripData.exclusions).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-red-100 hover:border-red-300 animate-scale-in group"
                            style={{animationDelay: `${index * 0.05}s`}}
                          >
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-800 leading-relaxed font-medium">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ---------------- OTHER INFO ---------------- */}
                  {activeTab === "other" && (
                    <div className="space-y-8">
                      <div className="flex items-start gap-4 animate-slide-in-left">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          Important Policies & Terms
                        </h2>
                      </div>

                      {policies.map((policy, index) => {
                        const Icon = policy.icon;
                        let iconColorClass = policy.color === 'blue' ? 'text-blue-600' :
                              policy.color === 'green' ? 'text-green-600' : 'text-red-600';
                        let borderColorClass = policy.color === 'blue' ? 'border-l-blue-600' :
                              policy.color === 'green' ? 'border-l-green-600' : 'border-l-red-600';

                        return (
                          <div
                            key={index}
                            className={`relative overflow-hidden bg-white border-l-4 ${borderColorClass} rounded-r-xl p-6 shadow-md animate-fade-in-up`}
                            style={{animationDelay: `${index * 0.15}s`}}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <Icon className={`w-5 h-5 ${iconColorClass} flex-shrink-0`} />
                              <h3 className="text-xl font-bold text-gray-900">{policy.title}</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                              {policy.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ================= RIGHT SIDE: QUICK BOOKING / ENQUIRE NOW ================= */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 lg:self-start">
              {pricingDetails && (
                <div className="relative overflow-hidden bg-white rounded-xl shadow-2xl border-4 border-blue-500 animate-float">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 opacity-10 animate-gradient-shift"></div>
                  <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse-glow"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse-glow-delayed"></div>

                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse-soft">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                            {isFixedDeparture ? "Quick Booking" : "Enquire Now"}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">{isFixedDeparture ? "Reserve your spot" : "Get a customized quote"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full mb-4 animate-shimmer"></div>

                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 mb-4 border-2 border-cyan-200">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium mb-1">Starting from</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                          ₹{pricingDetails.startingPrice?.toLocaleString() || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">per person</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Instant Confirmation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Flexible Payment Options</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>24/7 Customer Support</span>
                      </div>
                    </div>

                    {isFixedDeparture && (
                      <button
                        onClick={() => { setShowBookingModal(true); setShowSuccess(false); generateCaptcha(); }}
                        className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 animate-gradient-x group"
                      >
                        <span className="text-lg">Book Now</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}

                    <button
                      onClick={() => { setShowEnquiryModal(true); setShowEnquiryMessage(false); generateEnquiryCaptcha(); }}
                      className={`w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-700 hover:via-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 animate-gradient-x ${isFixedDeparture ? 'mt-3' : ''}`}
                    >
                      <Send className="w-5 h-5 animate-send-icon" />
                      <span className="text-lg">Enquire Now</span>
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Secure Booking
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Best Price
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* ================= END RIGHT SIDE ================= */}
          </div>
        </div>
        <style jsx>{`
          /* ... (Styles are lengthy, preserved in original for integrity) ... */
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-in-left {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slide-in-right {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slide-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes expand {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes scale-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
          }

          /* New Animations */
          @keyframes pulse-soft {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.1); }
          }
          @keyframes pulse-glow-delayed {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.1); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes gradient-x {
            0%, 100% { background-size: 200% 100%; background-position: left center; }
            50% { background-size: 200% 100%; background-position: right center; }
          }
          @keyframes send-icon {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            50% { transform: translateX(3px) rotate(5deg); }
          }
          @keyframes backdrop-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modal-pop-in {
            0% { opacity: 0; transform: scale(0.8); }
            50% { transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes success-bounce {
            0%, 100% { transform: scale(1); }
            10%, 30% { transform: scale(0.9); }
            20%, 40% { transform: scale(1.1); }
          }


          /* --- Animation Classes (Merged) --- */
          .animate-fade-in { animation: fade-in-up 0.6s ease-out backwards; }
          .animate-fade-in-up { animation: fade-in-up 0.5s ease-out backwards; }
          .animate-slide-in-left { animation: slide-in-left 0.5s ease-out backwards; }
          .animate-slide-in-right { animation: slide-in-right 0.5s ease-out backwards; }
          .animate-slide-down { animation: slide-down 0.5s ease-out backwards; }
          .animate-slide-up { animation: slide-up 0.5s ease-out backwards; }
          .animate-expand { animation: expand 0.3s ease-out; }
          .animate-float { animation: float 3s ease-in-out infinite; } /* Updated duration to 3s */
          .animate-gradient-shift { animation: gradient-shift 3s ease infinite; background-size: 200% 200%; } /* Updated duration to 3s */
          .animate-scale-in { animation: scale-in 0.4s ease-out backwards; }

          /* New Classes */
          .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
          .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
          .animate-pulse-glow-delayed { animation: pulse-glow-delayed 3s ease-in-out infinite 1.5s; }
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
          .animate-gradient-x { background-size: 200% 100%; animation: gradient-x 3s ease infinite; }
          .animate-send-icon { animation: send-icon 1s ease-in-out infinite; }
          .animate-backdrop-fade-in { animation: backdrop-fade-in 0.3s ease-out; }
          .animate-modal-pop-in { animation: modal-pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .animate-success-bounce { animation: success-bounce 0.8s ease-in-out; }

          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </>
  );
}