import React, { useState, useEffect } from 'react';

/**
 * Component to display the destination's Travel Guidelines.
 * It expects to receive the full destination data object.
 */
export default function DestinationGuidelines({ destinationData }) {
    const [travelGuidelines, setTravelGuidelines] = useState('');
    const [showAllGuidelines, setShowAllGuidelines] = useState(false);

    useEffect(() => {
        if (destinationData) {
            const apiData = destinationData.data || destinationData;
            setTravelGuidelines(apiData.travel_guidelines || '');
        }
    }, [destinationData]);

    if (!travelGuidelines) {
        return null;
    }

    // COMPREHENSIVE HEADING DETECTION
    const isHeadingLine = (line, lineWithoutEmoji) => {
        // 1. Lines starting with numbers (e.g., "1. Passport")
        if (/^\d+\.\s/.test(line)) {
            return true;
        }
        
        // 2. Lines with emoji at start - EXPANDED EMOJI RANGES
        // This catches most emojis including 🗓️, ✈️, 🧳, 🌿, etc.
        const hasEmojiAtStart = /^[\p{Emoji}\p{Emoji_Component}]\s*/u.test(line);
        if (hasEmojiAtStart) {
            // If it has an emoji at start, check if the rest looks like a heading
            const textAfterEmoji = line.replace(/^[\p{Emoji}\p{Emoji_Component}]\s*/u, '').trim();
            
            // If the text after emoji is short (< 50 chars) and doesn't end with period, it's likely a heading
            if (textAfterEmoji.length < 50 && !textAfterEmoji.endsWith('.')) {
                return true;
            }
        }
        
        // 3. Specific common section titles (case-insensitive, exact or contains)
        const commonHeadings = [
            'Best Time to Visit',
            'How to Reach',
            'What to Pack',
            'Travel Guidelines for',
            'Getting Around',
            'Accommodation',
            'Food and Cuisine',
            'Budget',
            'Important Numbers',
            'Safety Tips',
            'Local Transport',
            'Visa Requirements',
            'Currency',
            'Language',
            'Emergency Contacts',
            'Responsible Travel',
            'Why Visit',
            'Things to Do',
            'Places to Visit',
            'Local Culture',
            'Weather',
            'Transportation',
            'Health and Safety',
            'Travel Insurance',
            'Customs and Etiquette',
            'Shopping',
            'Nightlife',
            'Photography Tips',
            'Connectivity',
            'Time Zone',
            'Festivals',
            'Adventure Activities'
        ];
        
        // CRITICAL FIX: Check if line is a sub-point (contains colon followed by detailed text)
        // Example: "By Air: The nearest airport..." should be a point, not a heading
        const hasColonWithContent = lineWithoutEmoji.includes(':') && 
                                   lineWithoutEmoji.split(':')[1]?.trim().length > 10;
        
        if (hasColonWithContent) {
            // This is a detailed point, not a heading
            return false;
        }
        
        // Check if line contains any common heading (not just starts with)
        const lowerLine = lineWithoutEmoji.toLowerCase();
        for (const heading of commonHeadings) {
            // Only match if it's the EXACT heading or very close to it (within 5 chars)
            if (lowerLine === heading.toLowerCase() || 
                (lowerLine.startsWith(heading.toLowerCase()) && lowerLine.length - heading.length < 5)) {
                return true;
            }
        }
        
        // 4. Lines ending with "?" that are likely section questions
        if (lineWithoutEmoji.endsWith('?') && lineWithoutEmoji.length < 100) {
            return true;
        }
        
        // 5. Lines in ALL CAPS (must be at least 3 chars and not too long)
        if (lineWithoutEmoji === lineWithoutEmoji.toUpperCase() && 
            lineWithoutEmoji.length > 3 && 
            lineWithoutEmoji.length < 50 &&
            !/[.!?]$/.test(lineWithoutEmoji)) { // Not ending with punctuation
            return true;
        }
        
        // 6. Title Case lines that are short and don't end with regular sentence punctuation
        const isTitleCase = /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(lineWithoutEmoji);
        const isShortEnough = lineWithoutEmoji.length < 60;
        const noSentenceEnd = !/[.!]$/.test(lineWithoutEmoji) || lineWithoutEmoji.endsWith('?');
        
        if (isTitleCase && isShortEnough && noSentenceEnd) {
            return true;
        }
        
        return false;
    };

    // Process lines with improved heading detection
    const processedLines = travelGuidelines
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Remove emoji from the start to check the actual text
            // Using modern Unicode emoji property
            const lineWithoutEmoji = line.replace(/^[\p{Emoji}\p{Emoji_Component}]\s*/u, '').trim();
            
            const isHeading = isHeadingLine(line, lineWithoutEmoji);

            // Clean the line (remove leading numbers, keep emojis)
            let content = line.replace(/^[0-9]+\.\s*/, '').trim();

            return {
                content: content,
                isHeading: isHeading,
                isListPoint: !isHeading,
            };
        });
    
    // Debug log to see what's being classified as what
    console.log('🔍 Travel Guidelines Classification:', 
        processedLines.map(p => ({ 
            text: p.content.substring(0, 50) + '...', 
            type: p.isHeading ? 'HEADING' : 'POINT' 
        }))
    );
    
    // Filter out only the list points to manage the "View More" functionality correctly
    const allListPoints = processedLines.filter(item => item.isListPoint);
    
    // Control "View More" based on list points, not headings
    const initialPointsToShowCount = 5;
    const hasMorePoints = allListPoints.length > initialPointsToShowCount;

    // Map back to the original structure to render headings and points together
    const getRenderedContent = (showAll) => {
        let listIndex = 0;
        return processedLines.map((item, index) => {
            if (item.isHeading) {
                // Render Heading
                return (
                    <h4 
                        key={index} 
                        className="text-xl font-bold text-blue-800 pt-4 pb-2 mt-4 border-t border-blue-200 first:border-t-0 first:mt-0"
                    >
                        {item.content}
                    </h4>
                );
            } else {
                // Render List Point, but only if it's currently visible
                const isVisible = showAll || listIndex < initialPointsToShowCount;
                listIndex++;

                if (isVisible) {
                    return (
                        <div key={index} className="flex items-start gap-3">
                            <svg 
                                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            <p className="text-gray-800 text-lg leading-relaxed flex-1">
                                {item.content}
                            </p>
                        </div>
                    );
                }
                return null;
            }
        });
    };

    return (
        <section className="py-8 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-10 md:p-12 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6">
                        Travel Guidelines
                    </h3>
                    
                    <div className="space-y-4">
                        {/* Render all content based on visibility state */}
                        {getRenderedContent(showAllGuidelines)}
                    </div>

                    {hasMorePoints && (
                        <button
                            onClick={() => setShowAllGuidelines(!showAllGuidelines)}
                            className="mt-8 text-blue-600 hover:text-blue-800 font-medium text-base transition-colors duration-200 flex items-center gap-1"
                        >
                            {showAllGuidelines ? 'View Less' : `View More (${allListPoints.length - initialPointsToShowCount} more points)`}
                            <svg 
                                className={`w-4 h-4 transition-transform duration-300 ${showAllGuidelines ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}