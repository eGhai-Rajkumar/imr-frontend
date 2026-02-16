import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CountdownTimer({ endDate, compact = false }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endDate) - new Date();
            
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    if (compact) {
        return (
            <div className="flex items-center gap-1 text-[#FF6B35] font-mono text-sm font-bold">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                <motion.span
                    key={timeLeft.seconds}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-[#FF6B35]"
                >
                    {String(timeLeft.seconds).padStart(2, '0')}
                </motion.span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {Object.entries(timeLeft).map(([unit, value], index) => (
                <div key={unit} className="text-center">
                    <motion.div
                        key={value}
                        initial={{ rotateX: -90 }}
                        animate={{ rotateX: 0 }}
                        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg px-3 py-2 min-w-[50px] border border-slate-700 shadow-lg"
                    >
                        <span className="text-2xl font-bold text-white font-mono">
                            {String(value).padStart(2, '0')}
                        </span>
                    </motion.div>
                    <span className="text-xs text-slate-400 mt-1 block uppercase tracking-wider">
                        {unit}
                    </span>
                </div>
            ))}
        </div>
    );
}