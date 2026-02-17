import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const PageHeader = ({ title, subtitle, bgImage, breadcrumb }) => {
    return (
        <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax-like fixed position or just cover */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Breadcrumbs */}
                    <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-6 font-medium uppercase tracking-wider">
                        <Link to="/" className="hover:text-accent transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                        {breadcrumb && (
                            <>
                                <ChevronRight className="w-4 h-4 text-accent" />
                                <span className="text-accent">{breadcrumb}</span>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-xl">
                        {title.split(' ').map((word, i) => (
                            <span key={i} className={i === 1 ? "text-accent" : ""}> {word} </span>
                        ))}
                    </h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
                            {subtitle}
                        </p>
                    )}

                    {/* Decorative Line */}
                    <div className="w-24 h-1 bg-accent mx-auto mt-8 rounded-full shadow-glow"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default PageHeader;
