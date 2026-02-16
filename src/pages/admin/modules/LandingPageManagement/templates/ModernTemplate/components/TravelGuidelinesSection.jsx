import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';

export default function TravelGuidelinesSection({ 
    content, 
    sectionTitle = "Travel Guidelines", 
    sectionSubtitle = "Important Information", 
    primaryColor = '#FF6B35', 
    secondaryColor = '#FFB800' 
}) {
    // 1. Process the content: Strip HTML and split by full stops
    const points = useMemo(() => {
        if (!content) return [];
        
        // Remove HTML tags (e.g., <p>, <strong>) to get raw text
        const plainText = content.replace(/<[^>]+>/g, '');
        
        // Split by period, trim whitespace, and filter out empty strings
        // We split by '.' and filter items that have actual text
        return plainText
            .split('.')
            .map(str => str.trim())
            .filter(str => str.length > 2); // Filter out empty or very short fragments
    }, [content]);

    if (!points.length) return null;

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-slate-900 blur-3xl" />
                <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-slate-900 blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 shadow-sm bg-white"
                        style={{ color: primaryColor, border: `1px solid ${primaryColor}20` }}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-wide uppercase">{sectionSubtitle}</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                        {sectionTitle}
                    </h2>
                    <div 
                        className="h-1.5 w-24 mx-auto rounded-full"
                        style={{
                            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                        }}
                    />
                </motion.div>

                {/* Points Grid */}
                <div className="grid gap-4">
                    {points.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 overflow-hidden"
                        >
                            {/* Hover Accent Bar */}
                            <div 
                                className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
                                style={{ backgroundColor: primaryColor }} 
                            />

                            <div className="flex gap-5 items-start pl-2">
                                {/* Icon Container */}
                                <div 
                                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm"
                                    style={{ 
                                        backgroundColor: `${primaryColor}15`, // 15% opacity
                                        color: primaryColor 
                                    }}
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 pt-1">
                                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                        {point}.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}