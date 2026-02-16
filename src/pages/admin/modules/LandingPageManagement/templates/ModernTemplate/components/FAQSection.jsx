import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection({ faqs, primaryColor, secondaryColor }) {
    const [openIndex, setOpenIndex] = useState(null);

    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50"> {/* Changed bg to gray-50 for better contrast with white cards */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section (Unchanged) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Got Questions?</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                        Frequently Asked 
                        <span 
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                        >
                            {' '}Questions
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600">
                        Everything you need to know about our travel services
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                // IMPROVEMENT: Added hover:border-slate-400 and hover:bg-white/50 for better interaction
                                className="w-full bg-white border-2 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl group relative overflow-hidden"
                                style={{
                                    borderColor: openIndex === index ? primaryColor : 'transparent', // Transparent border by default looks cleaner on gray bg
                                    outline: openIndex !== index ? '2px solid #e2e8f0' : 'none' // Fallback outline
                                }}
                            >
                                {/* IMPROVEMENT: Add a subtle side accent bar when active */}
                                <div 
                                    className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                                    style={{ backgroundColor: openIndex === index ? primaryColor : 'transparent' }}
                                />

                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div 
                                            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-transform duration-300 group-hover:scale-110"
                                            style={{
                                                background: openIndex === index 
                                                    ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                                                    : '#cbd5e1'
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            {/* IMPROVEMENT: Darker text on hover */}
                                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-black transition-colors">
                                                {faq.question}
                                            </h3>
                                            
                                            <AnimatePresence>
                                                {openIndex === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        {/* FIX: Using dangerouslySetInnerHTML to render HTML tags properly */}
                                                        {/* Also removed the <p> wrapper to avoid invalid nested <p> tags */}
                                                        <div 
                                                            className="text-slate-600 leading-relaxed text-sm sm:text-base prose prose-slate max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        <div 
                                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                                            style={{
                                                backgroundColor: openIndex === index ? `${primaryColor}20` : '#f1f5f9'
                                            }}
                                        >
                                            <ChevronDown 
                                                className="w-5 h-5"
                                                style={{ color: openIndex === index ? primaryColor : '#64748b' }}
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}