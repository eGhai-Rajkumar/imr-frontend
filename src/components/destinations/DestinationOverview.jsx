import React, { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link2, X } from 'lucide-react';

export default function DestinationOverview({ destinationData }) {
    
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [currentDestination, setCurrentDestination] = useState(null);
    const [showFullOverview, setShowFullOverview] = useState(false);

    useEffect(() => {
        if (destinationData) {
            const apiData = destinationData.data || destinationData;
            const mappedData = {
                overview: apiData.overview || 'No overview available.',
                travelGuidelines: apiData.travel_guidelines || '',
            };
            setCurrentDestination(mappedData);
        }
    }, [destinationData]);

    const destination = currentDestination;
    if (!destination) return null;

    const handleShare = (platform) => {
        const url = window.location.href;
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(url)}`,
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
        { name: 'Copy Link', icon: Link2, bg: 'bg-gray-700 hover:bg-gray-800', action: 'copy' },
        { name: 'LinkedIn', icon: Linkedin, bg: 'bg-blue-700 hover:bg-blue-800', action: 'linkedin' },
        { name: 'Twitter', icon: Twitter, bg: 'bg-sky-500 hover:bg-sky-600', action: 'twitter' },
        { name: 'Facebook', icon: Facebook, bg: 'bg-blue-600 hover:bg-blue-700', action: 'facebook' },
    ];

    const processOverviewContent = (text) => {
        return text
            ?.split('\n')
            ?.map(t => t.trim())
            ?.filter(t => t.length > 0)
            ?.map((line, i) => ({
                content: line.replace(/^[0-9]+\.\s*/, ''),
                isHeading: line.length < 60 || /^\d+\./.test(line)
            })) || [];
    };

    const processed = processOverviewContent(destination.overview);
    const totalLines = processed.length;
    const initialLines = 3;

    const lines = showFullOverview ? processed : processed.slice(0, initialLines);

    return (
        <>
            {showShareOptions && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={() => setShowShareOptions(false)}
                ></div>
            )}

            <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-center gap-4">

                <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className={`bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-full border-4 border-white shadow-2xl transition-all duration-300 hover:scale-110 ${
                        showShareOptions ? 'rotate-90' : 'rotate-0'
                    }`}
                >
                    {showShareOptions ? <X className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                </button>

                {shareButtons.map((btn, idx) => (
                    <button
                        key={btn.name}
                        onClick={() => handleShare(btn.action)}
                        className={`${btn.bg} text-white p-4 rounded-full border-4 border-white shadow-2xl transition-all duration-300 ${
                            showShareOptions
                                ? 'opacity-100 scale-100 translate-y-0'
                                : 'opacity-0 scale-0 translate-y-20 pointer-events-none'
                        }`}
                        style={{ transitionDelay: `${idx * 60}ms` }}
                    >
                        <btn.icon className="w-6 h-6" />
                    </button>
                ))}
            </div>

            <section className="py-10 px-4 bg-white">
                <div className="max-w-7xl mx-auto animate-fade-in">

                    <div className="animate-slide-up">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-10 rounded-2xl border-l-4 border-blue-600 shadow-md hover:shadow-lg space-y-4">

                            <h3 className="text-2xl font-semibold text-blue-900 mb-6">Overview</h3>

                            {lines.map((item, i) =>
                                item.isHeading ? (
                                    <h4 key={i} className="text-xl font-extrabold text-blue-900 mt-5 border-t pt-3 border-blue-300">{item.content}</h4>
                                ) : (
                                    <p key={i} className="text-gray-800 text-lg leading-relaxed pt-1">{item.content}</p>
                                )
                            )}

                            {totalLines > initialLines && (
                                <button
                                    onClick={() => setShowFullOverview(!showFullOverview)}
                                    className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 mt-4"
                                >
                                    {showFullOverview ? 'View Less' : `View More (${totalLines - initialLines})`}
                                    <span className={`transition-transform ${showFullOverview ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </section>

            {/* CSS INSIDE SAME FILE */}
            <style>{`
                @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
                @keyframes slide-up { from { opacity:0; transform:translateY(25px);} to{opacity:1; transform: translateY(0);} }

                .animate-fade-in { animation: fade-in .6s ease-out forwards; }
                .animate-slide-up { animation: slide-up .6s ease-out forwards; }
            `}</style>
        </>
    );
}
