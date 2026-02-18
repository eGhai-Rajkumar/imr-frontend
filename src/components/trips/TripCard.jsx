import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Star, ArrowUpRight, Zap, Users } from "lucide-react";

/**
 * TripCard — Magazine / Editorial Style
 * Completely different from the previous full-bleed overlay design.
 * White card body, image top-half, bold typography, accent strip, hover lift.
 */
const TripCard = ({ trip, onSendQuery }) => {
    const [hovered, setHovered] = useState(false);

    if (!trip) return null;

    const tripSlug = trip.slug || `trip-${trip._id || trip.id}`;
    const tripId = trip._id || trip.id;
    const tripPath = `/trip-preview/${tripSlug}/${tripId}`;
    const finalPriceDisplay = trip.final_price_display || "N/A";
    const displayDiscount = trip.discount || 0;
    const priceType =
        trip.pricing?.customized?.pricing_type === "Price Per Package"
            ? "pkg"
            : "pp";
    const days = trip.days || "—";
    const nights = trip.nights || "—";
    const locationTag = trip.destination_type || trip.pickup_location || "India";
    const heroImage = trip.hero_image || trip.image;
    const rating = trip.rating || 4.8;

    return (
        <Link to={tripPath} className="block group w-full focus:outline-none">
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="relative w-full rounded-2xl overflow-hidden flex flex-col bg-white transition-all duration-500"
                style={{
                    boxShadow: hovered
                        ? "0 24px 60px -8px rgba(44,107,79,0.28), 0 8px 24px -4px rgba(0,0,0,0.12)"
                        : "0 4px 20px -4px rgba(0,0,0,0.10)",
                    transform: hovered ? "translateY(-6px)" : "translateY(0)",
                }}
            >
                {/* ══════════════════════════════════════
                    IMAGE SECTION  (top 55%)
                ══════════════════════════════════════ */}
                <div className="relative overflow-hidden" style={{ height: "220px" }}>
                    <img
                        src={heroImage}
                        alt={trip.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700"
                        style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}
                    />

                    {/* Dark scrim at bottom of image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* ── Location tag ── */}
                    <div className="absolute top-3 left-3">
                        <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white"
                            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
                        >
                            <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
                            {locationTag}
                        </span>
                    </div>

                    {/* ── Discount badge ── */}
                    {displayDiscount > 0 && (
                        <div className="absolute top-3 right-3">
                            <span
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black text-[#1A1A1A]"
                                style={{ background: "#D4AF37" }}
                            >
                                Save ₹{Number(displayDiscount).toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* ── Duration pill — bottom-left of image ── */}
                    <div className="absolute bottom-3 left-3">
                        <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                            style={{ background: "rgba(44,107,79,0.85)", backdropFilter: "blur(6px)" }}
                        >
                            <Clock className="w-3 h-3" />
                            {days}D / {nights}N
                        </span>
                    </div>
                </div>

                {/* ══════════════════════════════════════
                    ACCENT DIVIDER
                ══════════════════════════════════════ */}
                <div className="flex h-1 w-full">
                    <div className="flex-1 bg-[#2C6B4F]" />
                    <div className="flex-1 bg-[#D4AF37]" />
                </div>

                {/* ══════════════════════════════════════
                    CONTENT SECTION
                ══════════════════════════════════════ */}
                <div className="flex flex-col flex-1 p-4 gap-3">

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="w-3 h-3"
                                style={{
                                    fill: i < Math.round(rating) ? "#D4AF37" : "#e5e7eb",
                                    color: i < Math.round(rating) ? "#D4AF37" : "#e5e7eb",
                                }}
                            />
                        ))}
                        <span className="text-[10px] text-slate-400 ml-1">{rating} · 25+ reviews</span>
                    </div>

                    {/* Title */}
                    <h3
                        className="text-base font-bold leading-snug line-clamp-2 transition-colors duration-300"
                        style={{ color: hovered ? "#2C6B4F" : "#1A1A1A" }}
                    >
                        {trip.title}
                    </h3>

                    {/* ── Price row ── */}
                    <div className="flex items-end justify-between mt-auto pt-3 border-t border-slate-100">
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">Starting From</p>
                            <div className="flex items-baseline gap-1">
                                <span
                                    className="text-2xl font-black transition-colors duration-300"
                                    style={{ color: hovered ? "#2C6B4F" : "#1A1A1A" }}
                                >
                                    ₹{finalPriceDisplay}
                                </span>
                                <span className="text-[10px] text-slate-400">/{priceType}</span>
                            </div>
                        </div>

                        {/* CTA button */}
                        <div
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300"
                            style={{
                                background: hovered ? "#2C6B4F" : "#f1f5f9",
                                color: hovered ? "#ffffff" : "#2C6B4F",
                            }}
                        >
                            View
                            <ArrowUpRight
                                className="w-3.5 h-3.5 transition-transform duration-300"
                                style={{ transform: hovered ? "translate(2px,-2px)" : "translate(0,0)" }}
                            />
                        </div>
                    </div>

                    {/* ── Instant confirm (hover reveal) ── */}
                    <div
                        className="flex items-center justify-center gap-1.5 transition-all duration-300 overflow-hidden"
                        style={{ maxHeight: hovered ? "20px" : "0px", opacity: hovered ? 1 : 0 }}
                    >
                        <Zap className="w-3 h-3 text-[#2C6B4F]" />
                        <span className="text-[10px] text-slate-500 font-medium">
                            Instant Confirmation · No Hidden Charges
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TripCard;