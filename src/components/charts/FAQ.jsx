import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';

const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const BASE_URL = "https://api.yaadigo.com/secure/api/trips/";

/**
 * Transforms the raw API trip data into structured FAQ and Guideline arrays.
 * It maps 'faqs' to FAQs and 'policies' to Guidelines/Policies.
 */
const transformTripData = (tripData) => {
    // 1. Transform FAQ Data (from tripData.faqs)
    const faqs = (tripData.faqs || []).map((item, index) => ({
        id: index + 1,
        question: item.question || `FAQ Question ${index + 1}`,
        answer: item.answer || 'No answer provided.',
    }));

    // 2. Transform Guidelines/Policy Data (from tripData.policies)
    // We treat policies (Terms, Payment, Privacy) as guidelines.
    const guidelines = (tripData.policies || []).map((item, index) => ({
        id: index + 1,
        // Concatenate title and content for a comprehensive guideline text
        text: `**${item.title}:** ${item.content}`,
    }));
    
    return { faqs, guidelines };
};


export default function FAQGuidelines({ tripId }) {
    const [openFaq, setOpenFaq] = useState(null);
    const [data, setData] = useState({ faqs: [], guidelines: [] });
    const [loading, setLoading] = useState(true);

    // --- Data Fetching Effect ---
    useEffect(() => {
        if (!tripId) {
            setLoading(false);
            return;
        }

        const fetchFAQData = async () => {
            try {
                setLoading(true);
                // Fetch data for the specific trip ID
                const res = await axios.get(`${BASE_URL}${tripId}/`, {
                    headers: { "x-api-key": API_KEY },
                });

                const tripData = res.data.data || res.data;
                const transformedData = transformTripData(tripData);
                setData(transformedData);
            } catch (error) {
                console.error("❌ Error fetching FAQ & Guidelines data:", error);
                setData({ faqs: [], guidelines: [] }); // Fallback to empty data
            } finally {
                setLoading(false);
            }
        };

        fetchFAQData();
    }, [tripId]);

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };
    
    // Conditional Rendering based on loading/data state
    if (loading) {
        return (
            <section className="py-16 px-4 bg-gray-50 text-center text-gray-500">
                <p className="text-xl font-medium">Loading **FAQs and Policies**...</p>
            </section>
        );
    }
    
    const hasFaqs = data.faqs.length > 0;
    const hasGuidelines = data.guidelines.length > 0;

    if (!hasFaqs && !hasGuidelines) {
        return null; // Don't render component if no data is available
    }

    // --- Render Component ---
    return (
        <div className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                
                {/* FAQ Section */}
                {hasFaqs && (
                    <div className="mb-16 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 inline-block">
                                Frequently Asked Questions
                                <div className="w-20 h-1 bg-blue-600 mx-auto mt-3"></div>
                            </h2>
                        </div>
                        
                        <div className="max-w-4xl mx-auto space-y-4">
                            {data.faqs.map((faq, index) => (
                                <div
                                    key={faq.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden opacity-0 animate-slide-up"
                                    style={{
                                        animationDelay: `${200 + index * 100}ms`,
                                        animationFillMode: 'forwards'
                                    }}
                                >
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <span className="text-lg font-semibold text-gray-900 pr-4">
                                            {faq.question}
                                        </span>
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                    openFaq === faq.id
                                                        ? 'bg-blue-600 rotate-180'
                                                        : 'bg-gray-300'
                                                }`}
                                            >
                                                <ChevronDown className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </button>
                                    
                                    <div
                                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                            openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Guidelines Section (Populated by policies) */}
                {hasGuidelines && (
                    <div className="opacity-0 animate-fade-in" style={{ animationDelay: hasFaqs ? '500ms' : '100ms', animationFillMode: 'forwards' }}>
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-10 bg-blue-600 rounded-full"></div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    Travel Guidelines & Policies
                                </h2>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
                                {data.guidelines.map((guideline, index) => (
                                    <div
                                        key={guideline.id}
                                        className="flex gap-4 opacity-0 animate-slide-right"
                                        style={{
                                            animationDelay: `${(hasFaqs ? 600 : 200) + index * 100}ms`,
                                            animationFillMode: 'forwards'
                                        }}
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mt-1">
                                            {guideline.id}
                                        </div>
                                        <p 
                                            className="text-gray-700 leading-relaxed flex-1 pt-1"
                                            dangerouslySetInnerHTML={{ __html: guideline.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slide-right { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }

                .animate-fade-in { animation: fade-in 0.6s ease-out; }
                .animate-slide-up { animation: slide-up 0.6s ease-out; }
                .animate-slide-right { animation: slide-right 0.6s ease-out; }
            `}</style>
        </div>
    );
}