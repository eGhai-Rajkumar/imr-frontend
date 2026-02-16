import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Users,
  Phone,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// --- API CONFIGURATION ---
const API_CONFIG = {
  FULL_API_URL: 'https://api.yaadigo.com/secure/api/enquires/',
  API_KEY: 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M',
  DOMAIN_NAME: 'https://www.indianmountainrovers.com',
};
const CAPTCHA_ANSWER = 13;

// --- WhatsApp Icon ---
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.383 0 0 5.383 0 12c0 2.136.53 4.168 1.547 5.948L0 24l6.304-2.016C9.055 23.383 10.464 24 12 24c6.617 0 12-5.383 12-12S18.617 0 12 0zm0 22.08c-1.357 0-2.688-.328-3.847-.963l-.276-.163-2.856.915.963-2.856-.164-.276A10.075 10.075 0 011.92 12c0-5.531 4.529-10.08 10.08-10.08 5.551 0 10.08 4.529 10.08 10.08 0 5.551-4.529 10.08-10.08 10.08z"/>
    <path d="M17.622 14.236c-.306-.153-1.81-.892-2.088-.993-.277-.102-.479-.153-.68.153-.204.306-.788.993-.966 1.194-.179.204-.356.229-.662.076-.307-.153-1.291-.476-2.456-1.515-.908-.837-1.52-1.87-1.697-2.177-.178-.306-.019-.471.134-.623.137-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.052-.381-.025-.535-.077-.153-.68-1.638-.932-2.243-.246-.585-.497-.506-.68-.515-.176-.009-.38-.012-.583-.012-.203 0-.533.076-.812.381-.279.306-1.066 1.04-1.066 2.533 0 1.493 1.093 2.937 1.246 3.141.153.204 2.149 3.283 5.205 4.596.727.313 1.295.5 1.736.64.729.233 1.39.201 1.912.121.583-.087 1.8-.736 2.053-1.445.253-.71.253-1.318.178-1.445-.076-.127-.279-.204-.583-.357z"/>
  </svg>
);

// --- Success Toast ---
const SuccessToast = ({ message, onClose }) => (
  <motion.div
    className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-lg shadow-xl z-[100002] flex items-center gap-3"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
  >
    <CheckCircle className="h-5 w-5" />
    <span>{message}</span>
    <button onClick={onClose} className="text-white/80 hover:text-white">
      <X className="h-4 w-4" />
    </button>
  </motion.div>
);

// --- Main Component ---
export default function LeadGeneration({ isOpen, onClose }) {
  const initialFormData = {
    destination: '',
    departureCity: '',
    travelDate: '',
    flexibleDates: false,
    adults: 1,
    children: 0,
    infants: 0,
    hotelCategory: 'budget',
    fullName: '',
    contactNumber: '',
    email: '',
    comments: '',
    captcha: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (name, delta) => {
    setFormData(prev => ({
      ...prev,
      [name]: Math.max(name === 'adults' ? 1 : 0, prev[name] + delta)
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    // Validate required fields
    if (!formData.destination || !formData.departureCity || !formData.fullName || !formData.contactNumber || !formData.email || !formData.captcha) {
      setFormError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (parseInt(formData.captcha) !== CAPTCHA_ANSWER) {
      setFormError('Incorrect security answer (9 + 4). Please try again.');
      setIsSubmitting(false);
      return;
    }

    const apiData = {
      domain_name: API_CONFIG.DOMAIN_NAME,
      destination: formData.destination,
      departure_city: formData.departureCity,
      travel_date: formData.flexibleDates ? '' : formData.travelDate,
      adults: parseInt(formData.adults),
      children: parseInt(formData.children),
      infants: parseInt(formData.infants),
      hotel_category: formData.hotelCategory,
      full_name: formData.fullName,
      contact_number: formData.contactNumber,
      email: formData.email,
      additional_comments: formData.comments,
    };

    try {
      const response = await fetch(API_CONFIG.FULL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.API_KEY
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        let errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API submission failed with status ${response.status}.`);
      }

      setSuccessMessage('Your custom trip quote request has been sent! A specialist will contact you shortly.');
      resetForm();
      
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 2000);

    } catch (error) {
      console.error('Submission failed:', error.message);
      setFormError(error.message || 'Submission failed due to an unexpected error. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateDisabled = formData.flexibleDates || isSubmitting;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[100000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && onClose()}
            />

            <div className="fixed inset-0 z-[100001] flex items-center justify-center p-2 sm:p-4">
              <motion.div
                className="bg-white w-full h-[96vh] sm:h-auto sm:rounded-2xl shadow-2xl sm:w-full sm:max-w-5xl relative sm:max-h-[92vh] overflow-hidden flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => !isSubmitting && onClose()}
                  disabled={isSubmitting}
                  className="absolute right-2 top-2 sm:right-4 sm:top-4 z-20 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 sm:p-2 shadow-lg disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                  {/* Sidebar */}
                  <div className="hidden lg:block lg:w-2/5 bg-gradient-to-br from-slate-900 to-blue-900 p-6 text-white overflow-y-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <a href="/" className="flex items-center gap-3 group">
                        <motion.img
                          src="/holidaysplanners-logo.png"
                          alt="Holidays Planners Logo"
                          className="h-auto w-36"
                        />
                      </a>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-4xl font-bold">4.9</span>
                        <div className="flex text-yellow-400 text-xl">★★★★★</div>
                      </div>
                      <p className="text-indigo-200 text-sm">Excellent on Google</p>
                      {/* <p className="text-indigo-300 text-xs">Based on 1,245 reviews</p> */}
                    </div>

                    <div className="space-y-3 mb-4">
                      <h4 className="text-lg font-semibold border-b border-indigo-400 pb-2">Why Choose Us?</h4>

                      <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-base">Personalized Planning</h5>
                          <p className="text-indigo-200 text-sm">Tailored to your needs</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Users className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-base">Expert Knowledge</h5>
                          <p className="text-indigo-200 text-sm">Insider tips included</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-base">24/7 Support</h5>
                          <p className="text-indigo-200 text-sm">Always here to help</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-indigo-400 pt-4">
                      <h4 className="text-sm font-semibold mb-2">Contact Us</h4>
                      <p className="text-indigo-200 text-sm mb-1">info@indianmountainrovers.com</p>
                      <p className="text-indigo-200 text-sm mb-3">+91 98162 59997</p>
                      <a
                        href="https://wa.me/919816259997"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
                      >
                        <WhatsAppIcon />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
                    <div className="space-y-2.5">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Plan Your Trip</h2>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3">Fill details to get a custom quote</p>

                      {/* Destination & Departure */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Destination *</label>
                          <input
                            type="text"
                            name="destination"
                            placeholder="E.g., Paris"
                            value={formData.destination}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Departure City *</label>
                          <input
                            type="text"
                            name="departureCity"
                            placeholder="E.g., Delhi"
                            value={formData.departureCity}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50"
                          />
                        </div>
                      </div>

                      {/* Travel Date */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                        <input
                          type="date"
                          name="travelDate"
                          value={formData.travelDate}
                          onChange={handleInputChange}
                          disabled={isDateDisabled}
                          className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none ${
                            isDateDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-indigo-500'
                          }`}
                        />
                        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            name="flexibleDates"
                            checked={formData.flexibleDates}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-3 h-3 text-indigo-600 rounded disabled:opacity-50"
                          />
                          <span className="text-xs sm:text-sm text-gray-700">Flexible dates (No specific date required)</span>
                        </label>
                      </div>

                      {/* Travelers */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Travelers</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { key: 'adults', label: 'Adults (12+)' },
                            { key: 'children', label: 'Children (2-11)' },
                            { key: 'infants', label: 'Infants (0-2)' }
                          ].map(({ key, label }) => (
                            <div key={key}>
                              <label className="block text-xs text-gray-600 mb-0.5">{label}</label>
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => handleNumberChange(key, -1)}
                                  disabled={isSubmitting}
                                  className="px-1.5 py-1 sm:px-2 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-sm transition-colors disabled:opacity-50"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  name={key}
                                  value={formData[key]}
                                  readOnly
                                  className="w-full text-center border-0 text-sm focus:outline-none py-1 disabled:bg-gray-50"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleNumberChange(key, 1)}
                                  disabled={isSubmitting}
                                  className="px-1.5 py-1 sm:px-2 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-sm transition-colors disabled:opacity-50"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hotel Category */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Hotel Category</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                          {['budget', '3star', '4star', '5star'].map((cat) => (
                            <label key={cat} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="hotelCategory"
                                value={cat}
                                checked={formData.hotelCategory === cat}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                className="w-3 h-3 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                              />
                              <span className="text-xs sm:text-sm text-gray-700">
                                {cat === 'budget' ? 'Budget' : cat.replace('star', '★')}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            name="fullName"
                            placeholder="Your name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                          <input
                            type="tel"
                            name="contactNumber"
                            placeholder="Phone"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50"
                        />
                      </div>

                      {/* Comments */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Comments</label>
                        <textarea
                          name="comments"
                          placeholder="Special requirements..."
                          value={formData.comments}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          rows="2"
                          className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none disabled:bg-gray-50"
                        />
                      </div>

                      {/* CAPTCHA */}
                      <div className={`border-2 rounded-lg p-2.5 ${formError ? 'border-red-500 bg-red-50' : 'border-indigo-200 bg-indigo-50'}`}>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Security Check *</label>
                        <div className="flex items-center gap-2">
                          <div className={`bg-white px-3 py-1.5 rounded-lg border-2 ${formError ? 'border-red-600 text-red-600' : 'border-indigo-600 text-indigo-600'} font-bold text-sm select-none`}>
                            9 + 4 = ?
                          </div>
                          <input
                            type="text"
                            name="captcha"
                            placeholder="Answer (e.g., 13)"
                            value={formData.captcha}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="flex-1 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50"
                          />
                        </div>
                        {formError && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-xs mt-1 flex items-center gap-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            {formError}
                          </motion.p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full text-white font-semibold py-2 sm:py-2.5 rounded-lg shadow-lg transition-all text-sm flex items-center justify-center gap-2 ${
                          isSubmitting
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending Request...
                          </>
                        ) : (
                          'Get My Custom Quote'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <SuccessToast message={successMessage} onClose={() => setSuccessMessage(null)} />
        )}
      </AnimatePresence>
    </>
  );
}