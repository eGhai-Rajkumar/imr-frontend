import React from "react";

export default function FloatingCTA() {
  const whatsappLink = "https://wa.me/919816259997";

  return (
    <>
      {/* Animation CSS */}
      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.9; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999999,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "64px",
            height: "64px",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#25D366",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            animation: "floatUpDown 1.8s ease-in-out infinite",
          }}
        >
          {/* Pulse Ring */}
          <span
            style={{
              position: "absolute",
              width: "64px",
              height: "64px",
              borderRadius: "999px",
              background: "rgba(37, 211, 102, 0.35)",
              animation: "pulseRing 1.4s ease-out infinite",
            }}
          />

          {/* WhatsApp SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="white"
            style={{ position: "relative", zIndex: 2 }}
          >
            <path d="M20.52 3.48A11.91 11.91 0 0 0 12.01 0C5.39 0 .01 5.38.01 12c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.63a11.98 11.98 0 0 0 5.81 1.48h.01c6.62 0 12-5.38 12-12a11.9 11.9 0 0 0-3.5-8.37Zm-8.51 18.4h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.68.97.98-3.59-.24-.37A9.91 9.91 0 0 1 2.1 12c0-5.46 4.44-9.9 9.9-9.9a9.84 9.84 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.47-1.77-1.64-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.66-1.6-.91-2.2-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52 0 1.48 1.08 2.92 1.23 3.12.15.2 2.12 3.23 5.14 4.53.72.31 1.29.5 1.72.64.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35Z" />
          </svg>
        </div>
      </a>
    </>
  );
}
