import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Eye } from 'lucide-react';
import AttractionModal from './AttractionModal';

// Helper to strip HTML tags for preview text
const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

export default function AttractionsSection({ attractions, sectionTitle, sectionSubtitle, primaryColor = '#FF6B35', secondaryColor = '#FFB800', onEnquire }) {
    const [selectedAttraction, setSelectedAttraction] = React.useState(null);

    if (!attractions || attractions.length === 0) return null;

    // Handler to open enquiry from the modal
    const handleModalEnquire = (attraction) => {
        setSelectedAttraction(null); // Close detail modal
        // Create a mock trip object to pass to the unified modal so it pre-fills the destination
        if (onEnquire) {
            onEnquire({ title: attraction.title }); 
        }
    };

    return (
        <>
            <AttractionModal 
                attraction={selectedAttraction}
                isOpen={!!selectedAttraction}
                onClose={() => setSelectedAttraction(null)}
                onEnquire={() => handleModalEnquire(selectedAttraction)}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />
            
            <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="max-w-[90rem] mx-auto px-6 sm:px-10 relative z-10">
                    
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-extrabold tracking-widest uppercase mb-3 block" style={{ color: primaryColor }}>
                            {sectionSubtitle || 'Discover More'}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            {sectionTitle || 'Popular Attractions'}
                        </h2>
                        <div className="h-1.5 w-24 mx-auto rounded-full" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} />
                    </motion.div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {attractions.map((attraction, index) => {
                            const previewText = stripHtml(attraction.description).substring(0, 110) + '...';

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                                    className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 flex flex-col h-full cursor-pointer border border-slate-100"
                                    onClick={() => setSelectedAttraction(attraction)}
                                >
                                    {/* Image Area */}
                                    <div className="relative h-72 overflow-hidden">
                                        <img 
                                            src={attraction.image}
                                            alt={attraction.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                        
                                        {/* Floating Badge
                                        <div className="absolute top-5 left-5 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                                            <MapPin className="w-3.5 h-3.5" /> Must Visit
                                        </div> */}

                                        {/* Corner Action Icon */}
                                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-16 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                            <ArrowRight className="w-5 h-5" style={{ color: primaryColor }} />
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8 flex-1 flex flex-col relative">
                                        <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight group-hover:text-[#FF6B35] transition-colors duration-300">
                                            {attraction.title}
                                        </h3>
                                        
                                        <p className="text-slate-500 mb-6 flex-1 leading-relaxed text-sm font-medium">
                                            {previewText}
                                        </p>
                                        
                                        {/* Action Button */}
                                        <div className="mt-auto">
                                            <button 
                                                className="w-full py-3.5 rounded-xl border-2 border-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 group-hover:border-[#FF6B35] group-hover:bg-[#FF6B35] group-hover:text-white transition-all duration-300"
                                            >
                                                <Eye className="w-4 h-4" /> View Details
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}