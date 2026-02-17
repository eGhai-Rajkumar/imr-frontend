import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DestinationOverview({ destinationData }) {
    const [currentDestination, setCurrentDestination] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);
    const [needsReadMore, setNeedsReadMore] = useState(false);

    useEffect(() => {
        if (destinationData) {
            const apiData = destinationData.data || destinationData;
            setCurrentDestination(apiData);
        }
    }, [destinationData]);

    useEffect(() => {
        if (contentRef.current) {
            // Check if content height exceeds the collapsed height (e.g., 200px)
            setNeedsReadMore(contentRef.current.scrollHeight > 200);
        }
    }, [currentDestination]);

    if (!currentDestination) return null;

    return (
        <>
            <section className="py-8 md:py-12 px-4 bg-white" id="overview">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#FDFBF7] rounded-3xl p-6 md:p-10 border border-[#D4AF37]/20 shadow-sm relative overflow-hidden">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#2C6B4F] font-serif">
                                About {currentDestination.title || 'this Destination'}
                            </h3>

                            {/* Top Read Less Button (Visible only when expanded) */}
                            {needsReadMore && isExpanded && (
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="hidden md:flex items-center gap-2 text-[#C5A028] hover:text-[#2C6B4F] transition-colors font-medium text-sm uppercase tracking-wide"
                                >
                                    Read Less <ChevronUp className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div
                            ref={contentRef}
                            className={`relative transition-all duration-500 ease-in-out overflow-hidden`}
                            style={{ maxHeight: isExpanded ? 'none' : '100px' }} // 100px is roughly one paragraph + heading
                        >
                            <div
                                className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-light"
                                dangerouslySetInnerHTML={{ __html: currentDestination.overview || 'No overview available.' }}
                            />

                            {/* Gradient Overlay when collapsed */}
                            {!isExpanded && needsReadMore && (
                                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none" />
                            )}
                        </div>

                        {/* Button Container (Centered at bottom) */}
                        {needsReadMore && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className={`flex items-center gap-2 px-8 py-2.5 rounded-full shadow-lg transition-all font-bold tracking-wide transform hover:scale-105 active:scale-95 ${isExpanded
                                        ? 'bg-white border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-gray-50'
                                        : 'bg-gradient-to-r from-[#2C6B4F] to-[#1B4D3E] text-white hover:shadow-xl'
                                        }`}
                                >
                                    {isExpanded ? 'Read Less' : 'Read More...'}
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </section>
        </>
    );
}
