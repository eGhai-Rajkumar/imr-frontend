// src/pages/admin/modules/QuotationManagement/components/QuotationFormDialog.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Stepper, Step, StepButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QuotationFormSteps from './QuotationFormSteps';

const steps = ['Design', 'Customer', 'Trip Details', 'Itinerary', 'Costing', 'Policies', 'Payment'];

const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';

const QuotationFormDialog = ({ open, onClose, QUOTATION_API, quotation }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open) {
      // When opening dialog (create or edit) always reset to first step
      setActiveStep(0);
    }
  }, [open]);

  const handleClose = (shouldRefresh = false) => {
    setActiveStep(0);
    if (onClose) onClose(shouldRefresh);
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: {
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #e0e0e0',
        bgcolor: '#f5f5f5'
      }}>
        <Typography variant="h5" fontWeight="bold">
          {quotation?.id ? `Edit Quotation #${quotation.id}` : 'Create New Quotation'}
        </Typography>
        <IconButton onClick={() => handleClose()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: '#fafafa' }}>
        {/* Clickable stepper: using StepButton so user can jump to any step */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={() => setActiveStep(index)}>{label}</StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 1 }}>
          <QuotationFormSteps
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            handleClose={handleClose}
            API_KEY={API_KEY}
            QUOTATION_API={QUOTATION_API || `${API_BASE_URL}/quotation/`}
            quotation={quotation}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default QuotationFormDialog;