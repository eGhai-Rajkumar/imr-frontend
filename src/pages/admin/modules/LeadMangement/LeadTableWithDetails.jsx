import React, { useState, useMemo } from 'react';
import {
  Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, Chip, IconButton, Menu, MenuItem,
  Stack, TextField, InputAdornment, FormControl, Select, InputLabel
} from '@mui/material';
import {
  Delete, Download, Edit, MoreVert as MoreVertIcon, Visibility,
  Email, WhatsApp, Search
} from '@mui/icons-material';
import LeadDetailsDialog from './LeadDetailsDialog';

const LeadTableWithDetails = ({ leads, selectedLeads, toggleSelectLead, onDeleteLead, onRefresh, onLocalUpdate }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuLead, setMenuLead] = useState(null);
  
  // Filtering States
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const isMenuOpen = Boolean(anchorEl);
  const isSelected = (id) => selectedLeads.includes(id);

  // --- Calculations for Top Cards (Separate Enquiries & Bookings) ---
  const stats = useMemo(() => {
    return {
      total: leads.length,
      landingPage: leads.filter(l => l.source?.toLowerCase().includes('landing page')).length,
      manual: leads.filter(l => l.type === 'lead' || l.source?.toLowerCase().includes('manual')).length,
      websiteEnquiry: leads.filter(l => l.source?.toLowerCase().includes('website')).length,
      bookingRequest: leads.filter(l => l.source?.toLowerCase().includes('booking')).length,
    };
  }, [leads]);

  // --- Filtering Logic ---
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = 
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.mobile?.includes(searchQuery);

      const source = lead.source?.toLowerCase() || '';
      const type = lead.type?.toLowerCase() || '';

      if (filterType === 'All') return matchesSearch;
      if (filterType === 'Landing Page') return matchesSearch && source.includes('landing page');
      if (filterType === 'Booking Request') return matchesSearch && source.includes('booking');
      if (filterType === 'Website Enquiry') return matchesSearch && source.includes('website');
      if (filterType === 'Manual Leads') return matchesSearch && (type === 'lead' || source.includes('manual'));
      
      return matchesSearch;
    });
  }, [leads, filterType, searchQuery]);

  const handleMenuClick = (event, lead) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuLead(lead);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLead(null);
  };

  const handleViewDetails = (lead) => {
    setSelectedLeadForDetails(lead);
    setOpenDetails(true);
    handleMenuClose();
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Top Stats Cards - Separated Enquiries and Bookings */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <StatCard label="Landing Page" count={<span style={{ color: '#2e7d32' }}>{stats.landingPage}</span>} color="#2e7d32" />
      <StatCard label="Website Enquiries" count={<span style={{ color: '#0288d1' }}>{stats.websiteEnquiry}</span>} color="#0288d1" />
      <StatCard label="Booking Requests" count={<span style={{ color: '#ed6c02' }}>{stats.bookingRequest}</span>} color="#ed6c02" />
      <StatCard label="Manual Entries" count={<span style={{ color: '#d32f2f' }}>{stats.manual}</span>} color="#d32f2f" />
      </Stack>

      {/* Filter Toolbar */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center', backgroundColor: '#fff' }}>
        <TextField
          size="small"
          placeholder="Search name, email, mobile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
          }}
          sx={{ minWidth: 280 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter By Source</InputLabel>
          <Select
            label="Filter By Source"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="All">All Leads</MenuItem>
            <MenuItem value="Landing Page">Landing Page</MenuItem>
            <MenuItem value="Booking Request">Booking Request</MenuItem>
            <MenuItem value="Website Enquiry">Website Enquiry</MenuItem>
            <MenuItem value="Manual Leads">Manual Leads</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" startIcon={<Download />} size="medium">
          EXPORT CSV
        </Button>
      </Paper>

      {/* Leads Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f9fafb' }}>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox /></TableCell>
              {/* Fix: Darker, bold headers */}
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Lead Info</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Destination</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Trip Type</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Source</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a1a1a' }}>Created</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id} hover onClick={() => handleViewDetails(lead)} sx={{ cursor: 'pointer' }}>
                <TableCell padding="checkbox">
                  <Checkbox 
                    checked={isSelected(lead.id)} 
                    onClick={(e) => { e.stopPropagation(); toggleSelectLead(lead.id); }} 
                  />
                </TableCell>
                <TableCell>
                  {/* Fix: Lead Name is now explicitly dark and prominent */}
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'green' }}>
                    {lead.name || "No Name"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    {lead.email}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {lead.mobile}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem', maxWidth: 250 }}>
                  {lead.destination_type || lead.pickup || 'Not Specified'}
                </TableCell>
                <TableCell>{lead.trip_type || 'General'}</TableCell>
                <TableCell>
                  <Chip label={lead.status || 'new'} size="small" variant="outlined" color="primary" />
                </TableCell>
                <TableCell>
                  <Chip label={lead.priority || 'medium'} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {lead.type === 'lead' ? 'Manual' : (lead.source || 'Not Specified')}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {new Date(lead.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuClick(e, lead)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleViewDetails(menuLead)}><Visibility sx={{ mr: 1 }} /> View</MenuItem>
        <MenuItem onClick={handleMenuClose}><WhatsApp sx={{ mr: 1, color: '#25D366' }} /> WhatsApp</MenuItem>
        <MenuItem onClick={handleMenuClose}><Email sx={{ mr: 1, color: '#1976d2' }} /> Email</MenuItem>
      </Menu>

      {selectedLeadForDetails && (
        <LeadDetailsDialog 
            open={openDetails} 
            lead={selectedLeadForDetails} 
            onClose={() => setOpenDetails(false)} 
        />
      )}
    </Box>
  );
};

// Helper Component for the Top Cards
const StatCard = ({ label, count, color }) => (
  <Paper sx={{ p: 2, flex: 1, borderLeft: `4px solid ${color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
      {label}
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
      {count}
    </Typography>
  </Paper>
);

export default LeadTableWithDetails;