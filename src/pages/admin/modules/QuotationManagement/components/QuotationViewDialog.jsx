// src/pages/admin/modules/QuotationManagement/components/QuotationViewDialog.jsx
// FINAL VERSION — CLEAN WIDTH + CENTERED + ONE TALL PAGE PDF FIX + BASE64 IMAGE FIX

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

import {
  ModernProfessionalTemplate,
  LuxuryGoldTemplate,
  MinimalistClassicTemplate,
} from "./QuotationPDFTemplates";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ---------------------------------------------------
   BLOB → BASE64
--------------------------------------------------- */
const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(blob);
    } catch (e) {
      reject(e);
    }
  });

/* ---------------------------------------------------
   Fetch Image → Base64
--------------------------------------------------- */
async function fetchUrlToDataUrl(url) {
  try {
    const response = await fetch(url, { mode: "cors", cache: "no-store" });
    if (!response.ok) throw new Error("Fetch failed: " + response.status);
    const blob = await response.blob();
    if (!blob || blob.size === 0) throw new Error("Empty blob");
    return await blobToDataURL(blob);
  } catch (err) {
    console.warn("fetchUrlToDataUrl failed", url, err);
    return null;
  }
}

/* ---------------------------------------------------
   XHR fallback
--------------------------------------------------- */
function xhrToDataUrl(url, timeout = 7000) {
  return new Promise((resolve) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.timeout = timeout;
      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
          try {
            const dataUrl = await blobToDataURL(xhr.response);
            resolve(dataUrl);
          } catch (e) {
            resolve(null);
          }
        } else resolve(null);
      };
      xhr.onerror = () => resolve(null);
      xhr.ontimeout = () => resolve(null);
      xhr.send();
    } catch (e) {
      resolve(null);
    }
  });
}

/* ---------------------------------------------------
   Convert ALL IMG → Base64 (best effort)
--------------------------------------------------- */
async function convertImagesToDataUrls(rootEl) {
  const images = Array.from(rootEl.querySelectorAll("img"));
  let converted = 0,
    failed = 0;

  for (const img of images) {
    try {
      const src = img.getAttribute("src") || img.src;
      if (!src) {
        failed++;
        continue;
      }
      if (src.startsWith("data:")) {
        converted++;
        continue;
      }

      const url = new URL(src, window.location.href).toString();

      let dataUrl = await fetchUrlToDataUrl(url);
      if (!dataUrl) dataUrl = await xhrToDataUrl(url);

      if (dataUrl) {
        img.setAttribute("src", dataUrl);
        converted++;
      } else {
        console.warn("CANNOT convert image → Base64:", url);
        failed++;
      }
    } catch (err) {
      console.warn("Error converting", err);
      failed++;
    }
  }

  return { converted, failed };
}

/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */
const QuotationViewDialog = ({ open, onClose, quotation, onEdit, immediateDownload = false }) => {
  const printRef = useRef();
  const [generating, setGenerating] = useState(false);
  
  // Handling immediate download request if coming from the table "Export" button
  useEffect(() => {
    if (open && immediateDownload) {
        // Delay ensures dialog is fully rendered before starting capture
        const timer = setTimeout(() => {
            handlePrint();
        }, 300); 
        return () => clearTimeout(timer);
    }
  }, [open, immediateDownload]);

  if (!quotation) return null;

  /* ---------------------------------------------------
     ONE TALL PAGE PDF GENERATOR (Custom Page Size = Total Content Height)
  --------------------------------------------------- */
  const handlePrint = async () => {
    const element = printRef.current;
    if (!element) {
      alert("Print area not found");
      return;
    }

    setGenerating(true);

    try {
      /* Wait for images */
      const imgs = Array.from(element.querySelectorAll("img"));
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) return resolve();
              const done = () => {
                img.removeEventListener("load", done);
                img.removeEventListener("error", done);
                resolve();
              };
              img.addEventListener("load", done);
              img.addEventListener("error", done);
              setTimeout(done, 6000);
            })
        )
      );

      /* Base64 fix */
      try {
        await convertImagesToDataUrls(element);
      } catch (err) {
        console.warn("Base64 conversion step failed:", err);
      }
      
      // Ensure element dimensions are calculated after images/base64 conversion
      await new Promise((r) => setTimeout(r, 500));

      /* Canvas render */
      // Using scale 2 for high quality image capture
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: true,
        imageTimeout: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      console.log(`Canvas generated: ${canvas.width}x${canvas.height}`);

      /* Convert px → mm */
      const pxToMm = 0.264583;
      const pdfWidthMm = 210; // Standard A4 Width
      const pdfHeightMm = canvas.height * (pdfWidthMm / canvas.width); // Height scaled to fit A4 width

      const imgData = canvas.toDataURL("image/jpeg", 0.98);

      /* Create PDF with full custom height (One Tall Page) */
      const pdf = new jsPDF("p", "mm", [pdfHeightMm, pdfWidthMm]); // Custom height, A4 width
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidthMm, pdfHeightMm);

      pdf.save(`Quotation_${quotation.id || "Preview"}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setGenerating(false);
      if (immediateDownload) onClose(); // Close after forced download
    }
  };

  /* ---------------------------------------------------
     TEMPLATE SELECTOR
  --------------------------------------------------- */
  const renderTemplate = () => {
    const finalQuotation = {
      ...quotation,
      __client_name: quotation.__client_name || quotation.client_name,
      __client_email: quotation.__client_email || quotation.client_email,
      __client_mobile: quotation.__client_mobile || quotation.client_mobile,
    };

    switch (quotation.design) {
      case "Modern Professional":
        return (
          <ModernProfessionalTemplate quotation={finalQuotation} />
        );
      case "Luxury Gold":
        return <LuxuryGoldTemplate quotation={finalQuotation} />;
      case "Minimalist Classic":
        return <MinimalistClassicTemplate quotation={finalQuotation} />;
      default:
        return (
          <ModernProfessionalTemplate quotation={finalQuotation} />
        );
    }
  };

  /* ---------------------------------------------------
     FIXED WIDTH CLEAN PREVIEW WRAPPER
  --------------------------------------------------- */
const printWrapperSx = {
  backgroundColor: "#fff",
  maxWidth: '210mm', // Ensures consistent width for A4 capture
  margin: "0 auto",

  // Important styling for accurate canvas capture:
  padding: "0", 
  "& *": {
    boxSizing: "border-box",
  },
  "& img": {
    maxWidth: "100% !important",
    height: "auto !important",
  },
};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "90vh" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography variant="h6">
          Quotation Preview {quotation.id ? `#${quotation.id}` : ""}
        </Typography>

        <Box>
          {onEdit && (
            <IconButton onClick={() => onEdit(quotation)} disabled={generating}>
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose} disabled={generating}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: "#f6f6f6" }}>
        <Box ref={printRef} sx={printWrapperSx}>
          {renderTemplate()}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={generating}>Close</Button>
        {onEdit && (
          <Button onClick={() => onEdit(quotation)} variant="outlined" disabled={generating}>
            Edit
          </Button>
        )}

        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={
            generating ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <DownloadIcon />
            )
          }
          disabled={generating}
        >
          {generating ? "Generating..." : "Download PDF"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuotationViewDialog;