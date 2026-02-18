import React, { useState } from "react";
import {
    MapPin, Calendar, CheckCircle, XCircle, FileText, CreditCard,
    ChevronDown, ChevronUp, Camera, ShieldCheck
} from "lucide-react";

const TripContent = ({ tripData }) => {
    const [activeDay, setActiveDay] = useState(null);

    if (!tripData) return null;

    // --- Helpers ---
    const parseList = (text) => {
        if (!text) return [];
        // Split by newlines, semicolons, OR full-stop followed by space/end
        return text
            .replace(/•\s*/g, '')
            .split(/\n|;|(?<=\.)\s+/)
            .map(s => s.trim().replace(/^[-•]\s*/, ''))
            .filter(s => s.length > 2);
    };


    const itinerary = tripData.itinerary || [];
    const highlights = parseList(tripData.highlights);
    const inclusions = parseList(tripData.inclusions);
    const exclusions = parseList(tripData.exclusions);

    return (
        <div className="space-y-16">

            {/* 1. Highlights Section */}
            <section id="highlights" className="scroll-mt-24">
                <h3 className="text-2xl font-serif font-bold text-primary-dark mb-6 flex items-center gap-2">
                    <StarIcon className="w-6 h-6 text-accent" /> Trip Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highlights.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-gray-100/50 hover:bg-white hover:shadow-md transition-all duration-300 group">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Camera className="w-4 h-4 text-primary group-hover:text-white" />
                            </div>
                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">{item}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Itinerary Section */}
            <section id="itinerary" className="scroll-mt-24">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-serif font-bold text-primary-dark flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-accent" /> Day-by-Day Itinerary
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{itinerary.length} Days</span>
                </div>

                <div className="relative border-l-2 border-primary/20 ml-3 md:ml-6 space-y-8 md:space-y-12 pb-8">
                    {itinerary.map((day, index) => (
                        <div key={index} className="relative pl-6 md:pl-10 group">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-primary group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={() => setActiveDay(activeDay === index ? null : index)}>

                                {/* Header */}
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-lg mb-2">
                                            Day {day.day_number}
                                        </span>
                                        <h4 className="text-lg md:text-xl font-bold text-gray-800">{day.title}</h4>
                                    </div>
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        {activeDay === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Content (Collapsible) */}
                                <div className={`grid transition-all duration-500 ease-in-out ${activeDay === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                                    }`}>
                                    <div className="overflow-hidden">
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line border-t border-gray-100 pt-4">
                                            {day.description}
                                        </p>
                                        {/* Mock Image for Itinerary - Replace with real data if available */}
                                        {/* <div className="mt-4 h-48 bg-gray-100 rounded-xl overflow-hidden relative">
                             <img src={`/api/placeholder/400/320?text=Day+${day.day_number}`} alt={day.title} className="w-full h-full object-cover" />
                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Inclusions & Exclusions */}
            <section id="inclusions" className="scroll-mt-24">
                <h3 className="text-2xl font-serif font-bold text-primary-dark mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-accent" /> What's Included
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Included */}
                    <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
                        <h4 className="flex items-center gap-2 font-bold text-green-800 mb-4 border-b border-green-200 pb-2">
                            <CheckCircle className="w-5 h-5" /> Inclusions
                        </h4>
                        <ul className="space-y-3">
                            {inclusions.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Excluded */}
                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                        <h4 className="flex items-center gap-2 font-bold text-red-800 mb-4 border-b border-red-200 pb-2">
                            <XCircle className="w-5 h-5" /> Exclusions
                        </h4>
                        <ul className="space-y-3">
                            {exclusions.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 4. Essential Info (Accordion Style) */}
            <section id="policy" className="scroll-mt-24">
                <h3 className="text-2xl font-serif font-bold text-primary-dark mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-accent" /> Essential Information
                </h3>
                <div className="space-y-4">
                    <InfoAccordion title="Cancellation Policy" icon={FileText}>
                        <p className="whitespace-pre-wrap text-gray-600">{tripData.privacy_policy || "Standard cancellation terms apply."}</p>
                    </InfoAccordion>
                    <InfoAccordion title="Payment Terms" icon={CreditCard}>
                        <p className="whitespace-pre-wrap text-gray-600">{tripData.payment_terms || "Standard payment terms apply."}</p>
                    </InfoAccordion>
                    <InfoAccordion title="Terms & Conditions" icon={ShieldCheck}>
                        <p className="whitespace-pre-wrap text-gray-600">{tripData.terms || "Standard terms apply."}</p>
                    </InfoAccordion>
                </div>
            </section>

        </div>
    );
};

// Helper Component for simple Accordions
const InfoAccordion = ({ title, children, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
            >
                <div className="flex items-center gap-3 font-semibold text-gray-800">
                    <Icon className="w-5 h-5 text-gray-400" />
                    {title}
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-gray-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden bg-gray-50/50">
                    <div className="p-4 text-sm text-gray-600 leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Icon component fallback since lucide-react exports individual icons
const StarIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export default TripContent;
