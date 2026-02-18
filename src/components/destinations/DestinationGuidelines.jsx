import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, BookOpen } from 'lucide-react';

/**
 * Parses the HTML string and returns an array of structured items:
 * { type: 'heading' | 'point', text: string, level: number }
 * This lets us render with custom icons while still correctly reading HTML content.
 */
function parseGuidelinesHtml(html) {
    if (!html) return [];

    // Use a temporary DOM element to parse HTML properly
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const items = [];

    const walk = (node) => {
        for (const child of node.childNodes) {
            const tag = child.nodeName.toLowerCase();

            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
                const text = child.textContent?.trim();
                if (text) items.push({ type: 'heading', text, level: parseInt(tag[1]) });

            } else if (tag === 'li') {
                const text = child.textContent?.trim();
                if (text) items.push({ type: 'point', text });

            } else if (tag === 'p') {
                const text = child.textContent?.trim();
                if (text) items.push({ type: 'point', text });

            } else if (['ul', 'ol', 'div', 'section', 'article', 'body'].includes(tag)) {
                walk(child);

            } else if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent?.trim();
                if (text && text.length > 3) items.push({ type: 'point', text });
            }
        }
    };

    walk(doc.body);
    return items;
}

export default function DestinationGuidelines({ destinationData }) {
    const [travelGuidelines, setTravelGuidelines] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (destinationData) {
            const apiData = destinationData.data || destinationData;
            setTravelGuidelines(apiData.travel_guidelines || '');
        }
    }, [destinationData]);

    const items = useMemo(() => parseGuidelinesHtml(travelGuidelines), [travelGuidelines]);

    if (!items.length) return null;

    const previewCount = 6;
    const visibleItems = isExpanded ? items : items.slice(0, previewCount);
    const hasMore = items.length > previewCount;

    return (
        <section className="py-10 md:py-14 px-4 bg-[#FDFBF7]" id="guidelines">
            <div className="max-w-5xl mx-auto">

                {/* Section label */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-px bg-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em]">Before You Go</span>
                    <span className="w-8 h-px bg-[#D4AF37]" />
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#1A1A1A] mb-8 leading-tight">
                    Travel <span className="text-[#2C6B4F]">Guidelines</span>
                </h2>

                {/* Content card */}
                <div className="bg-white rounded-3xl border border-[#D4AF37]/15 shadow-sm overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-[#2C6B4F] via-[#D4AF37] to-[#2C6B4F]" />

                    <div className="p-6 md:p-10">
                        <div className="relative">
                            <div className="space-y-1">
                                {visibleItems.map((item, i) => {
                                    if (item.type === 'heading') {
                                        return (
                                            <h4
                                                key={i}
                                                className={`font-serif font-bold text-[#2C6B4F] leading-snug ${item.level <= 2
                                                        ? 'text-lg md:text-xl mt-6 mb-2'
                                                        : 'text-base md:text-lg mt-4 mb-1.5'
                                                    } ${i === 0 ? 'mt-0' : ''}`}
                                            >
                                                {item.text}
                                            </h4>
                                        );
                                    }
                                    return (
                                        <div key={i} className="flex items-start gap-3 py-1.5 pl-1">
                                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.text}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Fade when collapsed */}
                            {!isExpanded && hasMore && (
                                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                            )}
                        </div>

                        {/* Toggle button */}
                        {hasMore && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className={`inline-flex items-center gap-2 px-7 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 ${isExpanded
                                            ? 'bg-white border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5'
                                            : 'bg-gradient-to-r from-[#2C6B4F] to-[#1B4D3E] text-white shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {isExpanded ? (
                                        <><ChevronUp className="w-4 h-4" /> Show Less</>
                                    ) : (
                                        <><BookOpen className="w-4 h-4" /> Read More Guidelines</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}