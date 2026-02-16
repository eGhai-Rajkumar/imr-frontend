// fileName: LeadDetailsDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Refresh as ConvertIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const LeadDetailsDialog = ({ lead, open, onClose, onRefresh, onLocalUpdate }) => {
  const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
  const DOMAIN_NAME = 'Holidays Planners';

  const [isEditing, setIsEditing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [editedLead, setEditedLead] = useState(lead || {});

  useEffect(() => {
    setEditedLead(lead || {});
    setIsEditing(lead?.type !== 'lead'); 
  }, [lead]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLead(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, value) => {
    setEditedLead(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const isManualLead = lead.type === 'lead';

    if (isManualLead) {
      // --- Manual Lead (API Update) ---
      try {
        const response = await fetch(`https://api.yaadigo.com/secure/api/leads/${lead.source_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
          body: JSON.stringify({
            status: editedLead.status,
            priority: editedLead.priority,
            assigned_to: editedLead.assigned_to,
            follow_up_date: editedLead.follow_up_date,
            name: editedLead.name,
            email: editedLead.email,
            mobile: editedLead.mobile,
          }),
        });
        
        if (response.ok) {
          setIsEditing(false);
          onRefresh(); 
          alert('✅ Manual Lead updated successfully!');
        } else {
          alert('❌ Failed to update manual lead via API.');
        }
      } catch (error) {
        console.error('Error updating lead:', error);
        alert('❌ Error updating manual lead.');
      }
    } else {
      // --- Read-Only Source (Local Update) ---
      const localUpdateFields = {
        id: lead.id,
        status: editedLead.status,
        priority: editedLead.priority,
        assigned_to: editedLead.assigned_to,
        follow_up_date: editedLead.follow_up_date,
      };
      
      onLocalUpdate(localUpdateFields);
      setIsEditing(false); 
      alert('✅ Status and management fields updated locally.');
    }
  };

  const handleConvert = async () => {
    if (!window.confirm("Are you sure you want to convert this read-only entry into an editable Manual Lead?")) return;

    setIsConverting(true);
    try {
      // --- CRITICAL FIXES FOR PYDANTIC VALIDATION ---
      const nowISO = new Date().toISOString();
      const conversionPayload = {
        name: lead.name || '-',
        email: lead.email || 'N/A@example.com',
        mobile: lead.mobile || '0000000000',
        
        status: editedLead.status || 'new',
        priority: editedLead.priority || 'medium',
        assigned_to: editedLead.assigned_to || 'Unassigned',
        
        // FIX 1: Set destination_type to a safe integer ID (0)
        destination_type: 0, 
        trip_type: lead.trip_type || 'General Trip',

        // FIX 2 & 3: Add missing required fields with placeholders
        pickup: lead.additional_info?.departure_city || 'N/A', // Try to use departure city if available
        drop: 'N/A', 

        // CRITICAL: Include adults/children and ensure they are strings
        adults: (lead.additional_info?.adults || 1).toString(), 
        children: (lead.additional_info?.children || 0).toString(), 

        // FIX 4 & 5: Ensure travel dates are valid ISO strings, falling back to now if null
        // Note: For Booking Requests, item.departure_date may be useful if available.
        travel_from: (lead.additional_info?.travel_date || lead.additional_info?.departure_date || nowISO),
        travel_to: nowISO, 
      };

      const response = await fetch('https://api.yaadigo.com/secure/api/leads/', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(conversionPayload),
      });

      if (response.ok) {
        alert('✅ Lead converted successfully! The new editable lead is now in the list.');
        onClose();
        onRefresh(); 
      } else {
        const errorText = await response.text();
        console.error("API Conversion Error:", errorText);
        alert('❌ Failed to convert lead. Check console for API details.');
      }
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('❌ An error occurred during conversion.');
    } finally {
      setIsConverting(false);
    }
  };


  const handleWhatsApp = () => {
    const phoneNumber = lead.mobile.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${lead.name}, Thank you for your interest!`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Regarding Your Travel Enquiry');
    const body = encodeURIComponent(`Dear ${lead.name},\n\nThank you for contacting us.\n\nBest regards,\n${DOMAIN_NAME}`);
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const isManualLead = lead?.type === 'lead';
  const isReadOnlySource = !isManualLead;
  
  const isManagementEditable = isEditing; 
  const isContactEditable = isEditing && isManualLead; 

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Lead Details</Typography>
          <Box>
            {isReadOnlySource && (
              <Button 
                variant="contained" 
                color="warning" 
                onClick={handleConvert}
                disabled={isConverting}
                startIcon={isConverting ? <CircularProgress size={20} color="inherit" /> : <ConvertIcon />}
                sx={{ mr: 1, textTransform: 'none' }}
              >
                {isConverting ? 'Converting...' : 'Convert to Lead'}
              </Button>
            )}
            
            {isManualLead && !isEditing && (
              <IconButton onClick={() => setIsEditing(true)} sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
            )}
            
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Source Information */}
          <Grid item={true} xs={12}> {/* Removed deprecated props: xs, md. Retained item={true} for clarity on Grid item role */}
            <Alert severity={isReadOnlySource ? "warning" : "info"}>
              <strong>Source:</strong> {lead.source} | <strong>Type:</strong> {lead.type?.toUpperCase()}
              {isReadOnlySource && ' (Contact Info is read-only. Status is editable locally.)'}
            </Alert>
          </Grid>

          {/* Lead Management Section - Always editable if isEditing is true */}
          <Grid item={true} xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Lead Management</Typography>
              <Grid container spacing={2}>
                <Grid item={true} xs={12} md={3}> {/* Retained md for responsive size, but note the console warning */}
                  <FormControl fullWidth disabled={!isManagementEditable} variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={editedLead.status || 'new'}
                      onChange={handleInputChange}
                      label="Status"
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="contacted">Contacted</MenuItem>
                      <MenuItem value="quoted">Quotation Sent</MenuItem>
                      <MenuItem value="awaiting">Awaiting Payment</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                      <MenuItem value="booked">Booked</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item={true} xs={12} md={3}>
                  <FormControl fullWidth disabled={!isManagementEditable} variant="outlined">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      value={editedLead.priority || 'medium'}
                      onChange={handleInputChange}
                      label="Priority"
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item={true} xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Assigned To"
                    name="assigned_to"
                    value={editedLead.assigned_to || 'Unassigned'}
                    onChange={handleInputChange}
                    disabled={!isManagementEditable}
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Follow-up Date"
                      value={editedLead.follow_up_date ? new Date(editedLead.follow_up_date) : null}
                      onChange={(value) => handleDateChange('follow_up_date', value)}
                      disabled={!isManagementEditable}
                      // FIX: Replaced deprecated renderInput with component slot
                      slotProps={{ textField: { fullWidth: true, variant: "outlined" } }} 
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contact Information Section - Only editable for manual leads */}
          <Grid item={true} xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <Grid container spacing={2}>
                <Grid item={true} xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={editedLead.name || ''}
                    onChange={handleInputChange}
                    disabled={!isContactEditable}
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={editedLead.email || ''}
                    onChange={handleInputChange}
                    disabled={!isContactEditable}
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    name="mobile"
                    value={editedLead.mobile || ''}
                    onChange={handleInputChange}
                    disabled={!isContactEditable}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Travel Information */}
          <Grid item={true} xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Travel Information</Typography>
              <Grid container spacing={2}>
                <Grid item={true} xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Destination Type"
                    value={editedLead.destination_type || '-'}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Trip Type"
                    value={editedLead.trip_type || '-'}
                    disabled
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Additional Information */}
          {lead.additional_info && (
            <Grid item={true} xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Additional Information</Typography>
                <Grid container spacing={2}>
                    {Object.entries(lead.additional_info).map(([key, value]) => {
                        if (['domain_name'].includes(key)) return null; 

                        const displayValue = value instanceof Date ? value.toLocaleDateString() : value || '-';
                        
                        return (
                            <Grid item={true} xs={12} sm={6} md={4} key={key}>
                                <TextField
                                    fullWidth
                                    label={key.replace(/_/g, ' ').toUpperCase()}
                                    value={displayValue}
                                    disabled
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                        );
                    })}
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Quick Actions Section */}
          <Grid item={true} xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" color="primary">Create Quotation</Button>
                <Button variant="contained" color="primary">Create Invoice</Button>
                <Button variant="contained" color="success" onClick={handleWhatsApp}>
                  Send WhatsApp
                </Button>
                <Button variant="contained" onClick={handleEmail}>
                  Send Email
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {isEditing && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;