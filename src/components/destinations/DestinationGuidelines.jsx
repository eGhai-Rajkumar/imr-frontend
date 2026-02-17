import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Component to display the destination's Travel Guidelines.
 * Improved to be mobile-responsive and visually aligned with the theme.
 */
export default function DestinationGuidelines({ destinationData }) {
    const [travelGuidelines, setTravelGuidelines] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (destinationData) {
            const apiData = destinationData.data || destinationData;
            setTravelGuidelines(apiData.travel_guidelines || '');
        }
    }, [destinationData]);

    if (!travelGuidelines) {
        return null;
    }

    // Process content to separate potential headings from list items loosely
    // We will treat the whole text as a rich text block but style list items nicely
    const processContent = (text) => {
        return text.split('\n').filter(line => line.trim().length > 0).map((line, index) => {
            const trimmedLine = line.trim();
            const isHeading = trimmedLine.endsWith(':') ||
                (trimmedLine.length < 50 && !trimmedLine.includes('. ') && /^[A-Z]/.test(trimmedLine) && !trimmedLine.startsWith('•'));

            if (isHeading) {
                return (
                    <h4 key={index} className="text-lg md:text-xl font-bold text-[#2C6B4F] mt-4 mb-2 font-serif">
                        {trimmedLine.replace(/^[:•-]\s*/, '')}
                    </h4>
                );
            }

            return (
                <div key={index} className="flex items-start gap-3 mb-3 pl-1">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-base leading-relaxed">
                        {trimmedLine.replace(/^[:•-]\s*/, '')}
                    </p>
                </div>
            );
        });
    };

    const contentElements = processContent(travelGuidelines);
    const previewCount = 5; // Show first 5 blocks initially
    const visibleContent = isExpanded ? contentElements : contentElements.slice(0, previewCount);

    return (
        <section className="py-8 px-4 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white border-l-4 border-[#D4AF37] rounded-xl shadow-sm hover:shadow-md transition-all p-6 md:p-8">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#2C6B4F]/10 p-2 rounded-full">
                            <MapPin className="w-6 h-6 text-[#2C6B4F]" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#2C6B4F]">
                            Travel Guidelines
                        </h3>
                    </div>

                    <div className="space-y-1">
                        {visibleContent}
                        {!isExpanded && contentElements.length > previewCount && (
                            <div className="relative h-12 -mt-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        )}
                    </div>

                    {contentElements.length > previewCount && (
                        <div className="mt-4 flex justify-start">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 text-[#2C6B4F] font-bold text-sm uppercase tracking-wider hover:text-[#1F4D36] transition-colors group"
                            >
                                {isExpanded ? 'Read Less' : 'Read More Guidelines'}
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}