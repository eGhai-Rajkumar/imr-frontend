// src/pages/admin/modules/QuotationManagement/components/QuotationTable.jsx
// FIXED: View now opens PDF preview, Export PDF properly downloads
import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableRow, IconButton,
  Checkbox, Box, Typography, Paper, TableContainer, Chip, Menu, MenuItem,
  Button, Tooltip, Snackbar, Alert, ListItemIcon
} from "@mui/material";
import { 
  MoreVert as MoreVertIcon, 
  Delete, 
  Visibility, 
  Edit, 
  CheckCircle, 
  Schedule,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Print as PrintIcon
} from '@mui/icons-material';

const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';

const formatINR = (v) => {
  const n = Number(v) || 0;
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0 });
};

export default function QuotationTable({ quotations = [], onRefresh = () => {}, onEdit = () => {}, onView = () => {} }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuQuotation, setMenuQuotation] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [processing, setProcessing] = useState(false);

  const rows = Array.isArray(quotations) ? quotations : [];

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === rows.length && rows.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rows.map(r => r.id));
    }
  };

  const handleMenuClick = (event, quotation) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuQuotation(quotation);
  };

  const handleMenuClose = () => { 
    setAnchorEl(null); 
    setMenuQuotation(null); 
  };

  // FIX 1: View should open in preview mode (read-only PDF view)
  const handleView = (quotation) => {
    // If parent provided onView callback, use it; otherwise use onEdit (for backward compatibility)
    if (onView && typeof onView === 'function') {
      onView(quotation, false); // Explicitly set immediateDownload to false for simple view
    } else {
      onEdit(quotation);
    }
    handleMenuClose();
  };

  // Edit opens the form in edit mode
  const handleEditInternal = (quotation) => {
    onEdit(quotation);
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Move this quotation to trash?')) return;
    setProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/global/global/soft-delete?table=quotations&id=${id}`, {
        method: 'POST',
        headers: { 'accept': 'application/json', 'x-api-key': API_KEY }
      });
      const result = await res.json();
      if (res.ok && (result.success || result.message)) {
        showSnackbar('Quotation moved to trash', 'success');
        onRefresh();
      } else {
        showSnackbar(`Failed to delete: ${result.message || 'Unknown'}`, 'error');
      }
    } catch (err) {
      console.error('Delete error', err);
      showSnackbar('Error deleting quotation', 'error');
    } finally {
      setProcessing(false);
      handleMenuClose();
    }
  };

  // FIX: Updated to instruct user to manually attach the PDF
  const handleSendEmail = (quotation) => {
    if (!quotation.__client_email && !quotation.client_email) {
      showSnackbar("No email found for this client.", 'warning');
      handleMenuClose();
      return;
    }

    const email = quotation.__client_email || quotation.client_email;
    const name = quotation.__client_name || quotation.client_name || 'Customer';
    const title = quotation.display_title || quotation.trip?.display_title || 'Your Travel Package';
    const amount = quotation.amount || 0;
    const companyName = quotation.company?.name || 'Holidays Planners';
    
    // Removed pdfUrl variable
    
    const subject = `Your Detailed Travel Quotation – ${title}`;
    const body = `Dear ${name},

Thank you for your interest. Please find your detailed quotation document attached to this email.

Package: ${title}
Total Amount: ₹${amount.toLocaleString('en-IN')}

**IMPORTANT: Please attach the PDF file to this email before sending.** (You can download the PDF using the 'Download PDF' option).

We are eager to help you plan your journey!

Best regards,
${companyName}`;

    window.open(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );

    showSnackbar('Email client opened. REMINDER: Please manually attach the PDF file before sending!', 'warning');
    handleMenuClose();
  };

  // FIX: Updated to instruct user to manually attach the PDF
  const handleSendWhatsApp = (quotation) => {
    if (!quotation.__client_mobile && !quotation.client_mobile) {
      showSnackbar("No WhatsApp number found.", 'warning');
      handleMenuClose();
      return;
    }

    const mobile = (quotation.__client_mobile || quotation.client_mobile || '').replace(/[^0-9]/g, "");
    const name = quotation.__client_name || quotation.client_name || 'Customer';
    const title = quotation.display_title || quotation.trip?.display_title || 'Your Travel Package';
    const amount = quotation.amount || 0;

    // Removed pdfUrl variable
    
    const message = `Hello ${name}!
    
Your personalized quotation for *${title}* is ready! 🎉
    
💰 *Total Amount:* ₹${amount.toLocaleString('en-IN')}
    
**REMINDER: Please manually send the PDF file after this message.** (Download it using the 'Download PDF' option).
    
Please review the details and let us know if you have any questions. ✈️`;

    window.open(`https://wa.me/${mobile}?text=${encodeURIComponent(message)}`);

    showSnackbar('WhatsApp opened. REMINDER: Please manually send the PDF file after this message!', 'warning');
    handleMenuClose();
  };

  // FIX 1: Export PDF should trigger the download directly via the View Dialog with immediate download flag
  const handleExport = (quotation) => {
    // Open view dialog and pass a flag to trigger download immediately
    if (onView && typeof onView === 'function') {
      onView(quotation, true); // Pass true to indicate an immediate download request
      showSnackbar('PDF generation started... Please wait for the download to begin.', 'info');
    } else {
      showSnackbar('Cannot download. View function is missing.', 'error');
    }
    handleMenuClose();
  };

  const handleBulkTrash = async () => {
    if (!selectedIds.length) {
      showSnackbar('Select items first', 'warning');
      return;
    }
    if (!window.confirm(`Move ${selectedIds.length} items to trash?`)) return;

    setProcessing(true);
    let success = 0, fail = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`${API_BASE_URL}/global/global/soft-delete?table=quotations&id=${id}`, {
          method: 'POST',
          headers: { 'accept': 'application/json', 'x-api-key': API_KEY }
        });
        const json = await res.json();
        if (res.ok && (json.success || json.message)) success++; else fail++;
      } catch (e) { fail++; }
    }
    setProcessing(false);
    setSelectedIds([]);
    showSnackbar(`${success} moved to trash, ${fail} failed`, fail ? 'warning' : 'success');
    onRefresh();
  };

  return (
    <Box>
      <Paper sx={{ mb: 2, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: '#fff', boxShadow: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={rows.length > 0 && selectedIds.length === rows.length}
            indeterminate={selectedIds.length > 0 && selectedIds.length < rows.length}
            onChange={selectAll}
          />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {selectedIds.length > 0 ? <strong>{selectedIds.length} selected</strong> : `${rows.length} quotation${rows.length !== 1 ? 's' : ''}`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="error" onClick={handleBulkTrash} disabled={selectedIds.length === 0 || processing}>
            Move to Trash ({selectedIds.length})
          </Button>
          <Button variant="outlined" onClick={() => onRefresh()} disabled={processing}>Refresh</Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          {/* STYLING FIX: Updated TableHead background to solid blue and text color to white */}
          <TableHead sx={{ bgcolor: '#1976d2' /* Solid Blue */ }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  checked={rows.length > 0 && selectedIds.length === rows.length} 
                  indeterminate={selectedIds.length > 0 && selectedIds.length < rows.length} 
                  onChange={selectAll} 
                  sx={{ color: '#fff' }} /* Checkbox color */
                />
              </TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>S.No</strong></TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>Quote ID</strong></TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>Client Name / Info</strong></TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>Design</strong></TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>Lead Source</strong></TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>Date</strong></TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>Amount</strong></TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>Status</strong></TableCell>
              <TableCell align="right" sx={{ color: '#fff' }}><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Box sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">📋 No quotations found</Typography>
                    <Typography variant="body2" color="text.secondary">Create a new quotation to get started.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {rows.map((q, idx) => {
              const id = q?.id ?? null;
              const design = q?.design || '-';
              const amount = q?.amount || 0;
              const dateStr = q?.date ? new Date(q.date).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' }) : '-';
              const clientName = q.__client_name || q.client_name || 'Unknown';
              const clientEmail = q.__client_email || q.client_email || '';
              const clientMobile = q.__client_mobile || q.client_mobile || '';
              const leadSource = q.__lead_source || q.lead_source || 'Manual';

              const getSourceChip = (source) => {
                switch(source.toLowerCase()) {
                  case 'booking':
                    return <Chip label="Booking Req" size="small" color="success" />;
                  case 'enquiry':
                    return <Chip label="Enquiry" size="small" color="info" />;
                  case 'lead':
                    return <Chip label="Lead" size="small" color="warning" />;
                  default:
                    return <Chip label="Manual" size="small" variant="outlined" />;
                }
              };

              return (
                <TableRow 
                  key={id || idx} 
                  hover 
                  sx={{ 
                    cursor: 'pointer', 
                    bgcolor: selectedIds.includes(id) ? '#e3f2fd' : 'inherit',
                    '&:hover': { bgcolor: selectedIds.includes(id) ? '#e3f2fd' : '#f5f5f5' }
                  }} 
                  onClick={() => handleView(q)}
                >
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selectedIds.includes(id)} onChange={() => toggleSelect(id)} />
                  </TableCell>

                  <TableCell><Typography variant="body2">{idx + 1}</Typography></TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">#{id}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{clientName}</Typography>
                    {clientEmail && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        📧 {clientEmail}
                      </Typography>
                    )}
                    {clientMobile && (
                      <Typography variant="caption" color="text.secondary">
                        📱 {clientMobile}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip label={design} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  
                  <TableCell>
                    {getSourceChip(leadSource)}
                  </TableCell>

                  <TableCell><Typography variant="caption">{dateStr}</Typography></TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatINR(amount)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip 
                      label={q.status || 'Draft'} 
                      size="small" 
                      icon={(q.status === 'Sent') ? <CheckCircle /> : <Schedule />} 
                      color={q.status === 'Sent' ? 'success' : 'default'} 
                    />
                  </TableCell>

                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="More options">
                      <IconButton onClick={(e) => handleMenuClick(e, q)} disabled={processing}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* FIX 1: Clarified menu items */}
      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleView(menuQuotation)}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          View PDF
        </MenuItem>
        <MenuItem onClick={() => handleEditInternal(menuQuotation)}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          Edit Quotation
        </MenuItem>
        <MenuItem onClick={() => handleExport(menuQuotation)}>
          <ListItemIcon><PrintIcon fontSize="small" /></ListItemIcon>
          Download PDF
        </MenuItem>
        <MenuItem onClick={() => handleDelete(menuQuotation?.id)}>
          <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
          Move to Trash
        </MenuItem>
        <MenuItem onClick={() => handleSendEmail(menuQuotation)}>
          <ListItemIcon><EmailIcon fontSize="small" color="primary" /></ListItemIcon>
          Send Email
        </MenuItem>
        <MenuItem onClick={() => handleSendWhatsApp(menuQuotation)}>
          <ListItemIcon><WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} /></ListItemIcon>
          Send WhatsApp
        </MenuItem>
      </Menu>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4500} // Increased duration slightly
        onClose={() => setSnackbar({...snackbar, open:false})} 
        /* ANCHOR FIX: Pops the message at the top-center */
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open:false})} 
          severity={snackbar.severity} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}