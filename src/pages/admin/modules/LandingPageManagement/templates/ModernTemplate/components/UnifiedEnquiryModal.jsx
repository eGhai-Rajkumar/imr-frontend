import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, User, Phone, Mail, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const API_BASE_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";

/**
 * ✅ Logo-matched shades (picked from your logo)
 * Blue: deep royal blue
 * Gold: warm yellow
 * Green: leaf green
 */
const BRAND = {
  BLUE: "#2C6B4F", // Now Forest Green (Primary)
  GOLD: "#D4AF37", // Gold Accent
  GREEN: "#2C6B4F", // Forest Green (Success)
  DARK: "#4A3820", // Dark Brown
  TEXT: "#1A1A1A",
  MUTED: "#8B6F47", // Vintage Brown
  BORDER: "#E5E7EB",
  BG_SOFT: "#FDFBF7", // Cream
};

const Field = ({ icon: Icon, label, className = "", ...props }) => (
  <div className="space-y-1">
    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" style={{ color: BRAND.BLUE }} />
      {label}
    </label>

    <Input
      {...props}
      className={
        "h-11 rounded-xl border-2 bg-white text-[14px] font-semibold focus-visible:ring-0 " +
        className
      }
      style={{
        borderColor: BRAND.BORDER,
      }}
    />
  </div>
);

export default function UnifiedEnquiryModal({ trip, isOpen, onClose, pageName }) {
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    destination: "",
    travel_date: new Date().toISOString().split("T")[0],
    adults: 2,
    full_name: "",
    contact_number: "",
    email: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        destination:
          trip?.trip_title || trip?.title || pageName || "Himachal Package",
      }));
    }
  }, [isOpen, trip, pageName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const submissionData = {
        destination: formData.destination,
        departure_city: "Landing Page Modal",
        travel_date: formData.travel_date,
        adults: parseInt(formData.adults) || 2,
        children: 0,
        infants: 0,
        hotel_category: "3 Star",
        full_name: formData.full_name,
        contact_number: formData.contact_number,
        email: formData.email,
        additional_comments: `Modal Enquiry: ${pageName || "Landing Page"}`,
        domain_name: "https://www.indianmountainrovers.com",
      };

      const res = await fetch(`${API_BASE_URL}/enquires`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) throw new Error("Submit failed");

      const firstName = formData.full_name.trim().split(" ")[0] || "Traveler";

      toast.success(`Thanks ${firstName}! We'll call you shortly.`);

      const params = new URLSearchParams({
        name: firstName,
        destination: formData.destination,
      });

      window.open(`/thank-you?${params.toString()}`, "_blank");
      onClose?.();
    } catch (err) {
      toast.error("Failed to submit enquiry. Try again!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ HEADER - Solid Brand Blue (No Gradient) */}
            <div
              className="relative px-6 py-5 text-white border-b"
              style={{
                backgroundColor: BRAND.BLUE,
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full transition"
                style={{
                  backgroundColor: "rgba(255,255,255,0.14)",
                }}
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold opacity-90 uppercase tracking-widest">
                    Indian Mountain Rovers
                  </p>
                  <h2 className="text-lg font-black leading-tight mt-1">
                    Get Free Quote
                  </h2>
                </div>

                {/* ✅ Small Badge - Solid Gold */}
                <div
                  className="px-3 py-1 rounded-full text-[11px] font-black border"
                  style={{
                    backgroundColor: BRAND.GOLD,
                    color: BRAND.DARK,
                    borderColor: "rgba(0,0,0,0.15)",
                  }}
                >
                  5 Min Call Back
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="p-6" style={{ backgroundColor: BRAND.BG_SOFT }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border shadow-sm">
                  <Field
                    icon={User}
                    label="Full Name"
                    placeholder="Enter your name"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />

                  <div className="mt-4">
                    <Field
                      icon={Phone}
                      label="Mobile Number"
                      placeholder="WhatsApp number"
                      required
                      type="tel"
                      value={formData.contact_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_number: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <Field
                      icon={Mail}
                      label="Email"
                      placeholder="Enter email"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Field
                      icon={Calendar}
                      label="Travel Date"
                      type="date"
                      value={formData.travel_date}
                      onChange={(e) =>
                        setFormData({ ...formData, travel_date: e.target.value })
                      }
                    />

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">
                        Adults
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.adults}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            adults: parseInt(e.target.value || "1"),
                          })
                        }
                        className="h-11 rounded-xl border-2 text-center font-black focus-visible:ring-0"
                        style={{ borderColor: BRAND.BORDER }}
                      />
                    </div>
                  </div>

                  {/* ✅ Trust box */}
                  <div
                    className="mt-4 flex items-center gap-2 text-[12px] font-semibold px-3 py-2 rounded-xl border"
                    style={{
                      backgroundColor: "#ECFDF5",
                      borderColor: "#BBF7D0",
                      color: "#065F46",
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>100% Safe • No Spam • Call Back in 5 Minutes</span>
                  </div>
                </div>

                {/* ✅ CTA - Solid Green (No Gradient) */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-xl font-black text-white shadow-lg hover:shadow-xl transition"
                  style={{
                    backgroundColor: submitting ? "#94A3B8" : BRAND.GREEN,
                  }}
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Get Quote
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-center font-medium text-slate-500">
                  No spam. Our team will contact you within{" "}
                  <span className="font-black" style={{ color: BRAND.BLUE }}>
                    5 minutes
                  </span>
                  .
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
