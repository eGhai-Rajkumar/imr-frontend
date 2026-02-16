// fileName: AddLeadDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Divider,
  FormHelperText
} from '@mui/material';
import { 
  Person, 
  Email, 
  Phone, 
  Close as CloseIcon,
  LocationOn,
  FlightTakeoff,
  FlightLand,
  Map as MapIcon 
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddLeadDialog = ({ open, onClose }) => {
  const [tripThemes, setTripThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    destinationType: '',
    pickup: '',
    drop: '',
    travelFrom: null,
    travelTo: null,
    adults: 1,
    children: 0
  });

  useEffect(() => {
    // ... (Trip theme fetching logic remains same) ...
    const fallbackThemes = [
        { id: 1, name: 'Domestic' },
        { id: 2, name: 'International' },
        { id: 3, name: 'Adventure' },
    ];
    setTripThemes(fallbackThemes);
  }, [open]);

  // --- VALIDATION LOGIC ---
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // 1. Strings
    if (!formData.name.trim()) {
      tempErrors.name = "Client Name is required";
      isValid = false;
    }
    if (!formData.mobile) {
      tempErrors.mobile = "Mobile is required";
      isValid = false;
    }
    if (!formData.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    }
    if (!formData.destinationType) {
      tempErrors.destinationType = "Destination type is required";
      isValid = false;
    }
    if (!formData.pickup.trim()) {
      tempErrors.pickup = "Pickup location is required";
      isValid = false;
    }
    if (!formData.drop.trim()) {
      tempErrors.drop = "Drop location is required";
      isValid = false;
    }

    // --- DATE VALIDATION (CRITICAL FOR BACKEND) ---
    // Since backend requires datetime, we MUST show error if null
    if (!formData.travelFrom) {
      tempErrors.travelFrom = "Start Date is mandatory";
      isValid = false;
    }
    if (!formData.travelTo) {
      tempErrors.travelTo = "End Date is mandatory";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Remove red border when user picks a date
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleClose = () => {
    setFormData({
      name: '', email: '', mobile: '', destinationType: '',
      pickup: '', drop: '', travelFrom: null, travelTo: null,
      adults: 1, children: 0
    });
    setErrors({});
    setLoading(false);
    onClose(false);
  };

  const handleSubmit = async () => {
    // 1. BLOCK if invalid (This prevents backend crash)
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        destination_type: parseInt(formData.destinationType),
        pickup: formData.pickup,
        drop: formData.drop,
        // We can safely .toISOString() because validate() ensures they are not null
        travel_from: formData.travelFrom.toISOString(),
        travel_to: formData.travelTo.toISOString(),
        adults: formData.adults.toString(),
        children: formData.children.toString(),
      };

      const response = await fetch('https://api.yaadigo.com/secure/api/leads/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('✅ Lead created successfully');
        handleClose();
        onClose(true); 
      } else {
        const err = await response.text();
        console.error('❌ Backend Error:', err);
        alert('Failed: ' + err);
      }
    } catch (error) {
      console.error('Network Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
        color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Person />
          <Typography variant="h6">Add New Lead</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, pb: 4 }}>
        
        {/* --- CONTACT INFO --- */}
        <Box sx={{ mb: 3, mt: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold', letterSpacing: 1 }}>
                MANDATORY DETAILS
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth required label="Client Name" name="name"
                        value={formData.name} onChange={handleInputChange}
                        error={!!errors.name} helperText={errors.name}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Person color={errors.name?"error":"action"}/></InputAdornment>) }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth required label="Mobile Number" name="mobile"
                        value={formData.mobile} onChange={handleInputChange}
                        error={!!errors.mobile} helperText={errors.mobile}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Phone color={errors.mobile?"error":"action"}/></InputAdornment>) }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth required label="Email" name="email"
                        value={formData.email} onChange={handleInputChange}
                        error={!!errors.email} helperText={errors.email}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Email color={errors.email?"error":"action"}/></InputAdornment>) }}
                    />
                </Grid>
            </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* --- TRIP REQUIREMENTS --- */}
        <Box>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold', letterSpacing: 1 }}>
                TRIP DETAILS (REQUIRED)
            </Typography>
            <Grid container spacing={3}>
                {/* Destination Type */}
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth required error={!!errors.destinationType}>
                        <InputLabel>Destination Type</InputLabel>
                        <Select
                            name="destinationType"
                            value={formData.destinationType}
                            onChange={handleInputChange}
                            label="Destination Type"
                            startAdornment={<InputAdornment position="start" sx={{ ml: 1 }}><MapIcon color={errors.destinationType?"error":"action"} fontSize="small"/></InputAdornment>}
                        >
                            {tripThemes.map((theme) => (
                                <MenuItem key={theme.id} value={theme.id}>{theme.name}</MenuItem>
                            ))}
                        </Select>
                        {errors.destinationType && <FormHelperText>{errors.destinationType}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* Pickup / Drop */}
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth required label="Pickup" name="pickup"
                        value={formData.pickup} onChange={handleInputChange}
                        error={!!errors.pickup} helperText={errors.pickup}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><LocationOn color={errors.pickup?"error":"action"}/></InputAdornment>) }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth required label="Drop" name="drop"
                        value={formData.drop} onChange={handleInputChange}
                        error={!!errors.drop} helperText={errors.drop}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><LocationOn color={errors.drop?"error":"action"}/></InputAdornment>) }}
                    />
                </Grid>

                {/* DATE PICKERS WITH RED ERROR HANDLING */}
                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Travel Start Date *" // Star indicates mandatory
                            value={formData.travelFrom}
                            onChange={(value) => handleDateChange('travelFrom', value)}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    fullWidth
                                    required // HTML required attribute
                                    error={!!errors.travelFrom} // Red Border Trigger
                                    helperText={errors.travelFrom} // Error Message
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FlightTakeoff color={errors.travelFrom ? "error" : "action"} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Travel End Date *"
                            value={formData.travelTo}
                            onChange={(value) => handleDateChange('travelTo', value)}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    fullWidth
                                    required
                                    error={!!errors.travelTo} // Red Border Trigger
                                    helperText={errors.travelTo} // Error Message
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FlightLand color={errors.travelTo ? "error" : "action"} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
                
                <Grid item xs={6}>
                    <TextField
                        fullWidth label="Adults" name="adults" type="number"
                        value={formData.adults} onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 1 } }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth label="Children" name="children" type="number"
                        value={formData.children} onChange={handleInputChange}
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                </Grid>
            </Grid>
        </Box>

      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={handleClose} sx={{ color: 'text.secondary', px: 3 }}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading} // Only disable if loading, not invalid, so user can see errors
          sx={{ px: 4, minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLeadDialog;