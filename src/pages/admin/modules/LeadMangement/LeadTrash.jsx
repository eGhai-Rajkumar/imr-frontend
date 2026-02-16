import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Restore as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';

const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';

const LeadTrash = () => {
  const navigate = useNavigate();
  const [trashedLeads, setTrashedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuLead, setMenuLead] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedLeadForView, setSelectedLeadForView] = useState(null);
  const [dataStats, setDataStats] = useState({
    bookingRequests: 0,
    enquiries: 0,
    manualLeads: 0,
  });

  const isMenuOpen = Boolean(anchorEl);

  // Fetch trashed leads from all tables
  const fetchTrashedLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch trash from all three tables in parallel
      const [bookingRequestsTrash, enquiriesTrash, manualLeadsTrash] = await Promise.all([
        fetch('https://api.yaadigo.com/secure/api/global/global/trash?table=booking_requests', {
          headers: { 'x-api-key': API_KEY },
        }).then(res => res.json()),
        fetch('https://api.yaadigo.com/secure/api/global/global/trash?table=enquire_form', {
          headers: { 'x-api-key': API_KEY },
        }).then(res => res.json()),
        fetch('https://api.yaadigo.com/secure/api/global/global/trash?table=leads', {
          headers: { 'x-api-key': API_KEY },
        }).then(res => res.json()),
      ]);

      // Process Booking Requests Trash
      const bookingRequestsList = bookingRequestsTrash?.success ? (bookingRequestsTrash.data || []) : [];
      const formattedBookingRequests = bookingRequestsList.map((item) => ({
        id: `BR-${item.id}`,
        source_id: item.id,
        name: item.full_name || '-',
        email: item.email || '-',
        mobile: item.phone_number || '-',
        destination_type: item.domain_name || 'Holidays Planners',
        trip_type: `${item.adults || 0} Adults, ${item.children || 0} Children`,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        source: 'Booking Request',
        type: 'booking_request',
        table: 'booking_requests',
        additional_info: {
          departure_date: item.departure_date,
          sharing_option: item.sharing_option,
          price_per_person: item.price_per_person,
          estimated_total_price: item.estimated_total_price,
          adults: item.adults,
          children: item.children,
        }
      }));

      // Process Enquiries Trash
      const enquiriesList = enquiriesTrash?.success ? (enquiriesTrash.data || []) : [];
      const formattedEnquiries = enquiriesList.map((item) => ({
        id: `ENQ-${item.id}`,
        source_id: item.id,
        name: item.full_name || '-',
        email: item.email || '-',
        mobile: item.contact_number || '-',
        destination_type: item.destination || '-',
        trip_type: item.hotel_category || '-',
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        source: 'Website Enquiry',
        type: 'enquiry',
        table: 'enquire_form',
        additional_info: {
          departure_city: item.departure_city,
          travel_date: item.travel_date,
          adults: item.adults,
          children: item.children,
          infants: item.infants,
          additional_comments: item.additional_comments,
          domain_name: item.domain_name,
        }
      }));

      // Process Manual Leads Trash
      const manualLeadsList = manualLeadsTrash?.success ? (manualLeadsTrash.data || []) : [];
      const formattedManualLeads = manualLeadsList.map((item) => ({
        id: `L-${item.id}`,
        source_id: item.id,
        name: item.name || '-',
        email: item.email || '-',
        mobile: item.mobile || '-',
        destination_type: item.destination_type || '-',
        trip_type: item.trip_type || '-',
        status: item.status || 'new',
        priority: item.priority || 'medium',
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        source: 'Manual Entry',
        type: 'lead',
        table: 'leads',
      }));

      // Combine all trashed leads
      const combined = [
        ...formattedBookingRequests,
        ...formattedEnquiries,
        ...formattedManualLeads,
      ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      setTrashedLeads(combined);

      // Calculate stats
      setDataStats({
        bookingRequests: formattedBookingRequests.length,
        enquiries: formattedEnquiries.length,
        manualLeads: formattedManualLeads.length,
      });
      
      setSelectedLeads([]);
    } catch (error) {
      console.error('❌ Error fetching trashed leads:', error);
      setError('Failed to fetch trashed leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Restore lead
  const handleRestore = async (lead) => {
    if (!window.confirm(`Are you sure you want to restore "${lead.name}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.yaadigo.com/secure/api/global/global/restore?table=${lead.table}&id=${lead.source_id}`,
        {
          method: 'POST',
          headers: { 
            'accept': 'application/json',
            'x-api-key': API_KEY 
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setTrashedLeads((prev) => prev.filter((item) => item.id !== lead.id));
        setSelectedLeads((prev) => prev.filter((id) => id !== lead.id));
        alert(`✅ ${result.message || 'Lead restored successfully.'}`);
        handleMenuClose();
        
        // Update stats
        setDataStats(prev => {
          const newStats = { ...prev };
          if (lead.type === 'booking_request') newStats.bookingRequests--;
          else if (lead.type === 'enquiry') newStats.enquiries--;
          else if (lead.type === 'lead') newStats.manualLeads--;
          return newStats;
        });
      } else {
        console.error('Restore failed:', result);
        alert(`❌ Failed to restore lead: ${result.message || result.detail || 'Unknown error'}`);
        handleMenuClose();
      }
    } catch (error) {
      console.error('❌ Error restoring lead:', error);
      alert('❌ Network error restoring lead. Please check console for details.');
      handleMenuClose();
    } finally {
      setLoading(false);
    }
  };

  // Hard delete lead (permanent)
  const handleHardDelete = async (lead) => {
    if (!window.confirm(`⚠️ PERMANENT DELETE WARNING\n\nAre you absolutely sure you want to permanently delete "${lead.name}"?\n\nThis action CANNOT be undone!\n\nType 'DELETE' in the next prompt to confirm.`)) return;
    
    const confirmation = prompt('Type DELETE to confirm permanent deletion:');
    if (confirmation !== 'DELETE') {
      alert('❌ Deletion cancelled. You must type DELETE exactly to confirm.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.yaadigo.com/secure/api/global/global/hard-delete?table=${lead.table}&id=${lead.source_id}`,
        {
          method: 'DELETE',
          headers: { 
            'accept': 'application/json',
            'x-api-key': API_KEY 
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setTrashedLeads((prev) => prev.filter((item) => item.id !== lead.id));
        setSelectedLeads((prev) => prev.filter((id) => id !== lead.id));
        alert(`✅ ${result.message || 'Lead permanently deleted.'}`);
        handleMenuClose();
        
        // Update stats
        setDataStats(prev => {
          const newStats = { ...prev };
          if (lead.type === 'booking_request') newStats.bookingRequests--;
          else if (lead.type === 'enquiry') newStats.enquiries--;
          else if (lead.type === 'lead') newStats.manualLeads--;
          return newStats;
        });
      } else {
        alert(`❌ Failed to delete lead: ${result.message || result.detail || 'Unknown error'}`);
        handleMenuClose();
      }
    } catch (error) {
      console.error('❌ Error deleting lead:', error);
      alert('❌ Network error deleting lead.');
      handleMenuClose();
    } finally {
      setLoading(false);
    }
  };

  // Bulk restore
  const handleBulkRestore = async () => {
    if (selectedLeads.length === 0) {
      alert('❌ No leads selected.');
      return;
    }

    if (!window.confirm(`Restore ${selectedLeads.length} lead(s)?`)) return;

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const leadId of selectedLeads) {
      const lead = trashedLeads.find(l => l.id === leadId);
      if (!lead) continue;

      try {
        const response = await fetch(
          `https://api.yaadigo.com/secure/api/global/global/restore?table=${lead.table}&id=${lead.source_id}`,
          {
            method: 'POST',
            headers: { 
              'accept': 'application/json',
              'x-api-key': API_KEY 
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          successCount++;
        } else {
          failCount++;
          console.error('Failed to restore:', lead, result);
        }
      } catch (error) {
        failCount++;
        console.error('Error restoring lead:', lead, error);
      }
    }

    setLoading(false);
    alert(`✅ ${successCount} lead(s) restored successfully.${failCount > 0 ? ` ${failCount} failed.` : ''}`);
    fetchTrashedLeads();
  };

  // Bulk hard delete
  const handleBulkHardDelete = async () => {
    if (selectedLeads.length === 0) {
      alert('❌ No leads selected.');
      return;
    }

    if (!window.confirm(`⚠️ PERMANENT DELETE WARNING\n\nYou are about to permanently delete ${selectedLeads.length} lead(s).\n\nThis action CANNOT be undone!\n\nType 'DELETE ALL' in the next prompt to confirm.`)) return;
    
    const confirmation = prompt('Type DELETE ALL to confirm permanent deletion:');
    if (confirmation !== 'DELETE ALL') {
      alert('❌ Deletion cancelled. You must type DELETE ALL exactly to confirm.');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const leadId of selectedLeads) {
      const lead = trashedLeads.find(l => l.id === leadId);
      if (!lead) continue;

      try {
        const response = await fetch(
          `https://api.yaadigo.com/secure/api/global/global/hard-delete?table=${lead.table}&id=${lead.source_id}`,
          {
            method: 'DELETE',
            headers: { 
              'accept': 'application/json',
              'x-api-key': API_KEY 
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          successCount++;
        } else {
          failCount++;
          console.error('Failed to delete:', lead, result);
        }
      } catch (error) {
        failCount++;
        console.error('Error deleting lead:', lead, error);
      }
    }

    setLoading(false);
    alert(`✅ ${successCount} lead(s) permanently deleted.${failCount > 0 ? ` ${failCount} failed.` : ''}`);
    fetchTrashedLeads();
  };

  useEffect(() => {
    fetchTrashedLeads();
  }, []);

  // Filter leads
  const filteredLeads = trashedLeads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.mobile?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toggleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const selectAll = () => {
    setSelectedLeads(filteredLeads.map((l) => l.id));
  };

  const deselectAll = () => setSelectedLeads([]);

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
    setSelectedLeadForView(lead);
    setViewDetailsOpen(true);
    handleMenuClose();
  };

  const handleWhatsApp = (lead) => {
    const phoneNumber = lead.mobile.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${lead.name}, Thank you for your interest!`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    handleMenuClose();
  };

  const handleEmail = (lead) => {
    const subject = encodeURIComponent('Regarding Your Travel Enquiry');
    const body = encodeURIComponent(`Dear ${lead.name},\n\nThank you for contacting us.\n\nBest regards,\nHolidays Planners`);
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
    handleMenuClose();
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'Booking Request': return 'primary';
      case 'Website Enquiry': return 'success';
      case 'Manual Entry': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ py: 4, px: 2, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 'bold', mb: 1 }}>
              🗑️ Lead Trash
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage deleted leads - Restore or permanently remove them
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/dashboard/lead-management')}
            size="large"
          >
            Back to Leads
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Alert severity="error" sx={{ height: '100%' }}>
              <Typography variant="body2" color="text.secondary">Booking Requests</Typography>
              <Typography variant="h5" fontWeight="bold">{dataStats.bookingRequests}</Typography>
            </Alert>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Alert severity="error" sx={{ height: '100%' }}>
              <Typography variant="body2" color="text.secondary">Enquiries</Typography>
              <Typography variant="h5" fontWeight="bold">{dataStats.enquiries}</Typography>
            </Alert>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Alert severity="error" sx={{ height: '100%' }}>
              <Typography variant="body2" color="text.secondary">Manual Leads</Typography>
              <Typography variant="h5" fontWeight="bold">{dataStats.manualLeads}</Typography>
            </Alert>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Alert severity="error" sx={{ height: '100%' }}>
              <Typography variant="body2" color="text.secondary">Total in Trash</Typography>
              <Typography variant="h5" fontWeight="bold">{trashedLeads.length}</Typography>
            </Alert>
          </Grid>
        </Grid>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
            <CircularProgress size={50} />
            <Typography sx={{ ml: 2 }}>Processing...</Typography>
          </Box>
        )}

        {/* Search */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search trashed leads..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or mobile..."
            />
          </Grid>
        </Grid>

        {/* Bulk Actions */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" fontWeight="bold">Bulk Actions:</Typography>
            <Button variant="outlined" size="small" onClick={selectAll}>
              Select All ({filteredLeads.length})
            </Button>
            <Button variant="outlined" size="small" onClick={deselectAll}>
              Deselect All
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<RestoreIcon />}
              onClick={handleBulkRestore}
              disabled={selectedLeads.length === 0 || loading}
            >
              Restore Selected ({selectedLeads.length})
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteForeverIcon />}
              onClick={handleBulkHardDelete}
              disabled={selectedLeads.length === 0 || loading}
            >
              Delete Forever ({selectedLeads.length})
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button 
              variant="outlined" 
              size="small" 
              onClick={fetchTrashedLeads} 
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Paper>

        {/* Trashed Leads Table */}
        {!loading && (
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox 
                      indeterminate={selectedLeads.length > 0 && selectedLeads.length < filteredLeads.length}
                      checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                      onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                    />
                  </TableCell>
                  <TableCell><strong>Lead Info</strong></TableCell>
                  <TableCell><strong>Destination</strong></TableCell>
                  <TableCell><strong>Trip Type</strong></TableCell>
                  <TableCell><strong>Source</strong></TableCell>
                  <TableCell><strong>Created</strong></TableCell>
                  <TableCell><strong>Deleted On</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Box sx={{ py: 6 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          🎉 Trash is empty!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          No deleted leads found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow 
                      key={lead.id}
                      selected={selectedLeads.includes(lead.id)}
                      sx={{ 
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleSelectLead(lead.id)}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleSelectLead(lead.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">{lead.name}</Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            📧 {lead.email}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            📱 {lead.mobile}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{lead.destination_type}</TableCell>
                      <TableCell>{lead.trip_type}</TableCell>
                      <TableCell>
                        <Chip 
                          label={lead.source} 
                          color={getSourceColor(lead.source)} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="error">
                          {new Date(lead.updated_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <IconButton onClick={(e) => handleMenuClick(e, lead)} size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Action Menu */}
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleViewDetails(menuLead)}>
            <VisibilityIcon sx={{ mr: 1 }} fontSize="small" /> View Details
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleRestore(menuLead)}>
            <RestoreIcon sx={{ mr: 1 }} fontSize="small" color="success" /> Restore
          </MenuItem>
          <MenuItem onClick={() => handleHardDelete(menuLead)} sx={{ color: 'error.main' }}>
            <DeleteForeverIcon sx={{ mr: 1 }} fontSize="small" /> Delete Forever
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleWhatsApp(menuLead)}>
            <WhatsAppIcon sx={{ mr: 1 }} fontSize="small" /> Send WhatsApp
          </MenuItem>
          <MenuItem onClick={() => handleEmail(menuLead)}>
            <EmailIcon sx={{ mr: 1 }} fontSize="small" /> Send Email
          </MenuItem>
        </Menu>

        {/* View Details Dialog */}
        <Dialog 
          open={viewDetailsOpen} 
          onClose={() => setViewDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Trashed Lead Details</Typography>
              <Chip 
                label={selectedLeadForView?.source} 
                color={getSourceColor(selectedLeadForView?.source)} 
                size="small"
              />
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {selectedLeadForView && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert severity="warning">
                    This lead is in trash. You can restore it or permanently delete it.
                  </Alert>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={selectedLeadForView.name}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={selectedLeadForView.email}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    value={selectedLeadForView.mobile}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Destination Type"
                    value={selectedLeadForView.destination_type}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Trip Type"
                    value={selectedLeadForView.trip_type}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Created At"
                    value={new Date(selectedLeadForView.created_at).toLocaleString('en-IN')}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Deleted At"
                    value={new Date(selectedLeadForView.updated_at).toLocaleString('en-IN')}
                    disabled
                    variant="outlined"
                    sx={{ '& .MuiInputBase-input': { color: 'error.main' } }}
                  />
                </Grid>

                {selectedLeadForView.additional_info && Object.keys(selectedLeadForView.additional_info).length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Additional Information" size="small" />
                      </Divider>
                    </Grid>
                    {Object.entries(selectedLeadForView.additional_info).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <TextField
                          fullWidth
                          label={key.replace(/_/g, ' ').toUpperCase()}
                          value={value || '-'}
                          disabled
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    ))}
                  </>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setViewDetailsOpen(false)}>
              Close
            </Button>
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<RestoreIcon />}
              onClick={() => {
                setViewDetailsOpen(false);
                handleRestore(selectedLeadForView);
              }}
            >
              Restore
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<DeleteForeverIcon />}
              onClick={() => {
                setViewDetailsOpen(false);
                handleHardDelete(selectedLeadForView);
              }}
            >
              Delete Forever
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default LeadTrash;