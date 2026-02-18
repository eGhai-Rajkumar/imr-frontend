import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, MapPin, Info, BookOpen } from 'lucide-react';

/**
 * Parses HTML string into structured items for icon-based rendering.
 * Headings become section titles; paragraphs and list items get info icons.
 */
function parseOverviewHtml(html) {
    if (!html) return [];
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
                if (text) items.push({ type: 'paragraph', text });
            } else if (['ul', 'ol', 'div', 'section', 'article', 'body'].includes(tag)) {
                walk(child);
            } else if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent?.trim();
                if (text && text.length > 5) items.push({ type: 'paragraph', text });
            }
        }
    };

    walk(doc.body);
    return items;
}

export default function DestinationOverview({ destinationData }) {
    const [currentDestination, setCurrentDestination] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (destinationData) {
            const apiData = destinationData.data || destinationData;
            setCurrentDestination(apiData);
        }
    }, [destinationData]);

    const items = useMemo(
        () => parseOverviewHtml(currentDestination?.overview || ''),
        [currentDestination]
    );

    if (!currentDestination || !items.length) return null;

    const previewCount = 5;
    const visibleItems = isExpanded ? items : items.slice(0, previewCount);
    const hasMore = items.length > previewCount;

    return (
        <section className="py-10 md:py-16 px-4 bg-white" id="overview">
            <div className="max-w-5xl mx-auto">

                {/* Section label */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-px bg-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em]">Destination Guide</span>
                    <span className="w-8 h-px bg-[#D4AF37]" />
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#1A1A1A] mb-8 leading-tight">
                    About{' '}
                    <span className="text-[#2C6B4F]">
                        {currentDestination.title || 'this Destination'}
                    </span>
                </h2>

                {/* Content card */}
                <div className="bg-[#FDFBF7] rounded-3xl border border-[#D4AF37]/15 shadow-sm overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-[#2C6B4F] via-[#D4AF37] to-[#2C6B4F]" />

                    <div className="p-6 md:p-10">
                        <div className="relative">
                            <div className="space-y-0">
                                {visibleItems.map((item, i) => {
                                    if (item.type === 'heading') {
                                        return (
                                            <h4
                                                key={i}
                                                className={`font-serif font-bold text-[#2C6B4F] leading-snug ${item.level <= 2
                                                        ? 'text-lg md:text-xl mt-8 mb-3'
                                                        : 'text-base md:text-lg mt-6 mb-2'
                                                    } ${i === 0 ? '!mt-0' : ''}`}
                                            >
                                                {item.text}
                                            </h4>
                                        );
                                    }

                                    if (item.type === 'point') {
                                        return (
                                            <div key={i} className="flex items-start gap-3 py-2 pl-1">
                                                <div className="w-5 h-5 rounded-full bg-[#2C6B4F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <MapPin className="w-2.5 h-2.5 text-[#2C6B4F]" />
                                                </div>
                                                <p className="text-gray-600 text-sm md:text-base leading-[1.9]">{item.text}</p>
                                            </div>
                                        );
                                    }

                                    // paragraph — rendered as flowing text with generous spacing
                                    return (
                                        <p
                                            key={i}
                                            className="text-gray-600 text-sm md:text-base leading-[1.95] py-1.5"
                                        >
                                            {item.text}
                                        </p>
                                    );
                                })}
                            </div>

                            {/* Fade when collapsed */}
                            {!isExpanded && hasMore && (
                                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none" />
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
                                        <><BookOpen className="w-4 h-4" /> Read Full Guide</>
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
