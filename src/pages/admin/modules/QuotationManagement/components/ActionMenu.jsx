// ActionMenu.jsx - ENHANCED VERSION with PDF attachment for Email/WhatsApp and proper naming
import React, { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import PrintIcon from "@mui/icons-material/Print";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ModernProfessionalTemplate, LuxuryGoldTemplate, MinimalistClassicTemplate } from './QuotationPDFTemplates';
import ReactDOMServer from 'react-dom/server';

const ActionMenu = ({
  quotation = {},
  onDelete = () => {},
  onRestore = () => {},
  onExport = () => {},
  onView = () => {},
  onEdit = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const qid = quotation?.id;

  // Generate proper PDF filename: Quotation_ClientName_TripName_ID.pdf
  const generatePDFFilename = () => {
    const clientName = (quotation.__client_name || quotation.client_name || 'Client')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 30);
    const tripName = (quotation.display_title || quotation.trip?.name || 'Trip')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 30);
    return `Quotation_${clientName}_${tripName}_${qid || Date.now()}.pdf`;
  };

  // Helper to convert image to data URL
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

  // Fetch URL to data URL
  async function fetchUrlToDataUrl(url) {
    try {
      const response = await fetch(url, { mode: 'cors', cache: 'no-store' });
      if (!response.ok) throw new Error('Fetch failed: ' + response.status);
      const blob = await response.blob();
      if (!blob || blob.size === 0) throw new Error('Empty blob');
      const dataUrl = await blobToDataURL(blob);
      return dataUrl;
    } catch (err) {
      console.warn('fetchUrlToDataUrl failed for', url, err);
      return null;
    }
  }

  // Convert images to data URLs
  async function convertImagesToDataUrls(rootEl) {
    const images = Array.from(rootEl.querySelectorAll('img'));
    if (!images.length) return { convertedCount: 0, failedCount: 0 };

    let converted = 0;
    let failed = 0;

    for (const img of images) {
      try {
        const src = img.getAttribute('src') || img.src;
        if (!src) {
          failed++;
          continue;
        }
        if (src.startsWith('data:')) {
          converted++;
          continue;
        }

        const absoluteUrl = new URL(src, window.location.href).toString();
        let dataUrl = await fetchUrlToDataUrl(absoluteUrl);

        if (dataUrl) {
          img.setAttribute('src', dataUrl);
          converted++;
        } else {
          console.warn('Could not convert image to data URL:', absoluteUrl);
          failed++;
        }
      } catch (e) {
        console.warn('convertImagesToDataUrls error for', img, e);
        failed++;
      }
    }

    return { convertedCount: converted, failedCount: failed };
  }

  // Render template based on design
  const renderTemplate = (q) => {
    const finalQuotation = {
      ...q,
      __client_name: q.__client_name || q.client_name,
      __client_email: q.__client_email || q.client_email,
      __client_mobile: q.__client_mobile || q.client_mobile
    };

    switch (q.design) {
      case 'Modern Professional':
        return <ModernProfessionalTemplate quotation={finalQuotation} />;
      case 'Luxury Gold':
        return <LuxuryGoldTemplate quotation={finalQuotation} />;
      case 'Minimalist Classic':
        return <MinimalistClassicTemplate quotation={finalQuotation} />;
      default:
        return <ModernProfessionalTemplate quotation={finalQuotation} />;
    }
  };

  // Generate PDF and return as blob
  const generatePDFBlob = async () => {
    setGenerating(true);
    try {
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm';
      tempContainer.style.backgroundColor = '#fff';
      document.body.appendChild(tempContainer);

      // Render the template (use innerHTML since we need DOM for html2canvas)
      const templateElement = renderTemplate(quotation);
      const templateHTML = ReactDOMServer.renderToString(templateElement);
      tempContainer.innerHTML = templateHTML;

      // Apply styles to images
      const images = Array.from(tempContainer.querySelectorAll('img'));
      images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
      });

      // Wait for images to load
      await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) return resolve();
              const onDone = () => {
                img.removeEventListener('load', onDone);
                img.removeEventListener('error', onDone);
                resolve();
              };
              img.addEventListener('load', onDone);
              img.addEventListener('error', onDone);
              setTimeout(() => {
                try {
                  img.removeEventListener('load', onDone);
                  img.removeEventListener('error', onDone);
                } catch (e) {}
                resolve();
              }, 5000);
            })
        )
      );

      // Convert images to data URLs
      await convertImagesToDataUrls(tempContainer);
      await new Promise((r) => setTimeout(r, 500));

      // Generate canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        removeContainer: false,
        windowWidth: tempContainer.scrollWidth,
        windowHeight: tempContainer.scrollHeight,
      });

      // Generate PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledHeight);

      let heightLeft = scaledHeight - pdfHeight;
      let position = 0;
      while (heightLeft > 0) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, scaledHeight);
        heightLeft -= pdfHeight;
      }

      // Clean up
      document.body.removeChild(tempContainer);

      // Return PDF as blob
      const pdfBlob = pdf.output('blob');
      setGenerating(false);
      return pdfBlob;
    } catch (error) {
      console.error('PDF generation failed:', error);
      setGenerating(false);
      throw error;
    }
  };

  // Send Email with PDF attachment
  const handleSendEmail = async () => {
    const clientEmail = quotation.__client_email || quotation.client_email;
    if (!clientEmail) {
      alert("No email found for this client.");
      return;
    }

    handleClose();

    try {
      // Generate PDF
      const pdfBlob = await generatePDFBlob();
      const pdfFile = new File([pdfBlob], generatePDFFilename(), { type: 'application/pdf' });

      const clientName = quotation.__client_name || quotation.client_name || 'Customer';

      const subject = `Your Travel Quotation – ${quotation.display_title || 'Travel Package'}`;
      const body = `Dear ${clientName},

Please find attached your personalized travel quotation for ${quotation.display_title || 'your upcoming journey'}.

Quotation Details:
- Trip: ${quotation.display_title || 'Travel Package'}
- Total Amount: ₹${quotation.costing?.total_amount?.toLocaleString('en-IN') || 0}
- Quotation ID: #${quotation.id || 'DRAFT'}

Feel free to contact us for any clarifications or to proceed with the booking.

Best regards,
${quotation.company?.name || 'Holidays Planners'}
${quotation.company?.email || ''}
${quotation.company?.mobile || ''}`;

      // Try Web Share API first (works on mobile and some desktop browsers)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: subject,
          text: body,
          files: [pdfFile]
        });
      } else {
        // Fallback: Download PDF and open email client
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generatePDFFilename();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Open email client after short delay
        setTimeout(() => {
          window.open(
            `mailto:${clientEmail}?subject=${encodeURIComponent(
              subject
            )}&body=${encodeURIComponent(body + '\n\n(Please attach the downloaded PDF file manually)')}`
          );
        }, 500);

        alert('PDF downloaded! An email draft will open - please attach the downloaded PDF manually.');
      }
    } catch (err) {
      console.error('Email send error:', err);
      alert('Failed to generate PDF. Please try Export PDF instead.');
    }
  };

  // Send WhatsApp with PDF
  const handleSendWhatsApp = async () => {
    const clientMobile = quotation.__client_mobile || quotation.client_mobile;
    if (!clientMobile) {
      alert("No WhatsApp number found.");
      return;
    }

    handleClose();

    try {
      // Generate PDF
      const pdfBlob = await generatePDFBlob();
      const pdfFile = new File([pdfBlob], generatePDFFilename(), { type: 'application/pdf' });

      const clientName = quotation.__client_name || quotation.client_name || 'Customer';
      const phone = clientMobile.replace(/[^0-9]/g, "");

      const message = `Hello ${clientName}, your quotation for *${quotation.display_title || 'Travel Package'}* is ready!

Trip: ${quotation.display_title || 'Travel Package'}
Amount: ₹${quotation.costing?.total_amount?.toLocaleString('en-IN') || 0}
Quotation ID: #${quotation.id || 'DRAFT'}

📎 PDF quotation document is attached`;

      // Try Web Share API first (works on mobile with WhatsApp installed)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: `Quotation for ${clientName}`,
          text: message,
          files: [pdfFile]
        });
      } else {
        // Fallback: Download PDF and open WhatsApp
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generatePDFFilename();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Open WhatsApp after short delay
        setTimeout(() => {
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message + '\n\n(PDF downloaded - please attach manually)')}`);
        }, 500);

        alert('PDF downloaded! WhatsApp will open - please attach the downloaded PDF manually.');
      }
    } catch (err) {
      console.error('WhatsApp send error:', err);
      alert('Failed to generate PDF. Please try Export PDF instead.');
    }
  };

  return (
    <>
      <IconButton size="small" onClick={handleOpen} disabled={generating}>
        {generating ? <CircularProgress size={20} /> : <MoreVertIcon />}
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        
        {/* View Option */}
        {onView && (
          <MenuItem
            onClick={() => {
              handleClose();
              onView(quotation);
            }}
            disabled={generating}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>
        )}

        {/* Edit Option */}
        {onEdit && (
          <MenuItem
            onClick={() => {
              handleClose();
              onEdit(quotation);
            }}
            disabled={generating}
          >
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {/* Export PDF */}
        {onExport && (
          <MenuItem 
            onClick={() => { 
              handleClose(); 
              onExport(quotation);
            }}
            disabled={generating}
          >
            <ListItemIcon>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export PDF</ListItemText>
          </MenuItem>
        )}

        {/* Send Email with PDF */}
        <MenuItem onClick={handleSendEmail} disabled={generating}>
          <ListItemIcon>
            {generating ? <CircularProgress size={20} /> : <EmailIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {generating ? 'Generating PDF...' : 'Send Email (with PDF)'}
          </ListItemText>
        </MenuItem>

        {/* Send WhatsApp with PDF */}
        <MenuItem onClick={handleSendWhatsApp} disabled={generating}>
          <ListItemIcon>
            {generating ? <CircularProgress size={20} /> : <WhatsAppIcon fontSize="small" color="success" />}
          </ListItemIcon>
          <ListItemText>
            {generating ? 'Generating PDF...' : 'Send WhatsApp (with PDF)'}
          </ListItemText>
        </MenuItem>

        {/* Move to Trash */}
        {onDelete && (
          <MenuItem onClick={() => { handleClose(); onDelete(qid); }} disabled={generating}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Move to Trash</ListItemText>
          </MenuItem>
        )}

        {/* Restore */}
        {onRestore && (
          <MenuItem onClick={() => { handleClose(); onRestore(qid); }} disabled={generating}>
            <ListItemIcon>
              <RestoreFromTrashIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Restore</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ActionMenu;