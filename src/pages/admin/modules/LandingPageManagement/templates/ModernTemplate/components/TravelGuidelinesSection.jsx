import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function TravelGuidelinesSection({
    content,
    sectionTitle = "Travel Guidelines",
    sectionSubtitle = "Important Information",
    primaryColor = '#FF6B35',
    secondaryColor = '#FFB800'
}) {
    if (!content) return null;

    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-slate-900 blur-3xl" />
                <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-slate-900 blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 shadow-sm bg-white"
                        style={{ color: primaryColor, border: `1px solid ${primaryColor}30` }}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-wide uppercase">{sectionSubtitle}</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5">
                        {sectionTitle}
                    </h2>
                    <div
                        className="h-1.5 w-24 mx-auto rounded-full"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                    />
                </motion.div>

                {/* HTML Content rendered correctly */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
                >
                    <div
                        className="h-1"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                    />
                    <div className="p-8 md:p-10">
                        <div
                            className="lp-guidelines-prose"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </motion.div>
            </div>

            <style>{`
                .lp-guidelines-prose {
                    color: #475569;
                    font-size: 0.9375rem;
                    line-height: 1.85;
                }
                .lp-guidelines-prose p { margin-bottom: 1.1rem; }
                .lp-guidelines-prose h1,
                .lp-guidelines-prose h2,
                .lp-guidelines-prose h3,
                .lp-guidelines-prose h4 {
                    font-weight: 700;
                    color: #0F172A;
                    margin-top: 1.75rem;
                    margin-bottom: 0.6rem;
                    line-height: 1.35;
                }
                .lp-guidelines-prose h1 { font-size: 1.35rem; }
                .lp-guidelines-prose h2 { font-size: 1.2rem; }
                .lp-guidelines-prose h3 { font-size: 1.05rem; }
                .lp-guidelines-prose h4 { font-size: 0.95rem; }
                .lp-guidelines-prose ul,
                .lp-guidelines-prose ol {
                    padding-left: 1.5rem;
                    margin-bottom: 1.1rem;
                }
                .lp-guidelines-prose li { margin-bottom: 0.45rem; line-height: 1.7; }
                .lp-guidelines-prose strong, .lp-guidelines-prose b {
                    font-weight: 600;
                    color: #0F172A;
                }
                .lp-guidelines-prose a { color: ${primaryColor}; text-decoration: underline; }
                .lp-guidelines-prose blockquote {
                    border-left: 3px solid ${secondaryColor};
                    padding-left: 1rem;
                    color: #64748B;
                    font-style: italic;
                    margin: 1.25rem 0;
                }
            `}</style>
        </section>
    );
}