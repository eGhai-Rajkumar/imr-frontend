import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Map, Compass, Trophy, Users, Globe, Smile, Shield } from 'lucide-react';

const stats = [
    { label: 'Years Experience', value: '12+', icon: Trophy },
    { label: 'Happy Travelers', value: '15k+', icon: Users },
    { label: 'Destinations', value: '50+', icon: Map },
    { label: 'Satisfaction', value: '100%', icon: Smile },
];

// Continuous Floating Animation
const floatAnim = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Green/Gold Palette
const colors = {
    glow: 'from-green-400 to-emerald-500',
    icon: 'text-[#2C6B4F]', // Brand Green
    hoverBg: 'group-hover:bg-[#FDFBF7]', // Cream
};
// Pulsing Blob Animation
const pulseAnim = {
    animate: {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export default function AboutSection({
    title = "Your Trusted Travel Partner",
    subtitle = "About Us",
    primaryColor = '#2C6B4F', // Forest Green
    secondaryColor = '#D4AF37' // Gold
}) {
    return (
        <section className="py-24 bg-[#FDFBF7] overflow-hidden relative">

            {/* Background Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- 1. SECTION HEADER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="text-sm md:text-base font-extrabold tracking-widest uppercase mb-3 block" style={{ color: primaryColor }}>
                        {subtitle}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight font-serif">
                        {title}
                    </h2>
                    <div className="h-1.5 w-20 md:w-32 mx-auto rounded-full" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} />
                </motion.div>

                {/* --- 2. MAIN CONTENT CARD --- */}
                <div className="bg-[#F8FAFC] rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 lg:p-16 relative overflow-hidden border border-slate-100 shadow-2xl group transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">

                    {/* Living Background Blobs */}
                    <div className="absolute top-10 right-10 w-72 h-72 bg-[#2C6B4F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                    <div className="absolute top-10 left-10 w-72 h-72 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#2C6B4F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

                    <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20 relative z-10">

                        {/* --- LEFT: CREATIVE LOGO AREA --- */}
                        <div className="w-full lg:w-5/12 flex justify-center lg:justify-start relative order-1 lg:order-1 perspective-1000">
                            {/* Floating Icons Decor */}
                            <motion.div
                                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-8 -left-8 text-blue-300 hidden md:block"
                            >
                                <Plane className="w-16 h-16 opacity-60" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-8 -right-8 text-orange-300 hidden md:block"
                            >
                                <Compass className="w-16 h-16 opacity-60" />
                            </motion.div>

                            {/* Main Floating Card */}
                            <motion.div
                                variants={floatAnim}
                                animate="animate"
                                className="relative z-10 w-full max-w-[360px]"
                            >
                                {/* Card Shadow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-orange-200 rounded-[2.5rem] rotate-6 transform transition-transform duration-500 group-hover:rotate-12 opacity-70" />

                                <div className="relative bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 flex items-center justify-center min-h-[300px] md:min-h-[380px] w-full transform transition-all duration-500 hover:scale-[1.02]">
                                    <img
                                        src="/logo-indian-mountain-rovers.png"
                                        alt="Indian Mountain Rovers"
                                        className="w-56 md:w-72 h-auto object-contain drop-shadow-xl filter hover:brightness-110 transition-all duration-500"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<h3 class="text-3xl md:text-4xl font-black text-slate-900 text-center leading-tight">Indian<br/><span style="color:${primaryColor}">Mountain</span><br/>Rovers</h3>`;
                                        }}
                                    />

                                    {/* Glass sheen effect */}
                                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
                                </div>
                            </motion.div>
                        </div>

                        {/* --- RIGHT: CONTENT --- */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full lg:w-7/12 order-2 lg:order-2 space-y-8"
                        >
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                Making Memories, <br />
                                <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                                    Not Just Itineraries.
                                </span>
                            </h3>

                            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
                                <p>
                                    <strong className="text-slate-900 font-bold">Indian Mountain Rovers</strong> is a full fledged tourism oriented agency, all set to make a big difference in value added tour operations. We are the local ground handler for worldwide customers run by an experienced enterprising businessman supported by a team with 12 years experience in hotel management and travel industries.
                                </p>
                                <p>
                                    The company image is based on <span className="text-slate-900 font-medium border-b-2 border-orange-200">innovation, technology, credibility, quality services</span>, & fair-business practices.
                                </p>
                                <p className="italic text-slate-500 border-l-4 border-slate-200 pl-4">
                                    "Journeys can be bought but memories cannot… let this journey be an experience."
                                </p>
                            </div>

                            {/* Author & Signature */}
                            <div className="flex items-center gap-4 pt-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 p-1 border-2 border-white shadow-lg overflow-hidden relative">
                                    <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Poonam Sharma" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900">Poonam Sharma</h4>
                                    <p className="text-sm font-bold uppercase tracking-wider" style={{ color: primaryColor }}>CEO & Founder</p>
                                </div>
                            </div>

                            {/* --- INTERACTIVE STATS GRID --- */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                                {stats.map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 1)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                                        className="bg-white/60 border border-slate-200 p-4 rounded-2xl text-center transition-all cursor-default hover:border-orange-200 backdrop-blur-sm"
                                    >
                                        <div className="mb-2 flex justify-center text-slate-400">
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 mb-1" style={{ color: primaryColor }}>
                                            {stat.value}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}