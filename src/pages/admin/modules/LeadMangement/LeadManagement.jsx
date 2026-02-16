import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  InputLabel,
  Badge,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LeadTableWithDetails from './LeadTableWithDetails';
import AddLeadDialog from './AddLeadDialog';

const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';

const LeadManagement = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [openAddLead, setOpenAddLead] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [dataStats, setDataStats] = useState({
    bookingRequests: 0,
    enquiries: 0,
    manualLeads: 0,
  });

  // Handle Local Lead Update
  const handleLocalLeadUpdate = (updatedFields) => {
    setLeads(prevLeads => prevLeads.map(lead => {
      if (lead.id === updatedFields.id) {
        return {
          ...lead,
          status: updatedFields.status,
          priority: updatedFields.priority,
          assigned_to: updatedFields.assigned_to,
          follow_up_date: updatedFields.follow_up_date,
        };
      }
      return lead;
    }));
  };

  // Fetch trash count from all tables
  const fetchTrashCount = async () => {
    try {
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

      const totalTrash = 
        (bookingRequestsTrash?.data?.length || 0) +
        (enquiriesTrash?.data?.length || 0) +
        (manualLeadsTrash?.data?.length || 0);

      setTrashCount(totalTrash);
    } catch (error) {
      console.error('Error fetching trash count:', error);
    }
  };

  // Fetch all leads from multiple sources
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data sources in parallel
      const [bookingRequestsData, enquiriesData, manualLeadsData] = await Promise.all([
        fetch('https://api.yaadigo.com/secure/api/booking_request/', {
          headers: { 'x-api-key': API_KEY },
        }).then(res => res.json()),
        fetch('https://api.yaadigo.com/secure/api/enquires/', {
          headers: { 'x-api-key': API_KEY },
        }).then(res => res.json()),
        fetch('https://api.yaadigo.com/secure/api/leads/', {
          headers: { 'x-api-key': API_KEY },
        }).then(res => res.json()),
      ]);

      // Process Booking Requests - Filter out deleted ones
      const bookingRequestsList = Array.isArray(bookingRequestsData) 
        ? bookingRequestsData 
        : bookingRequestsData?.data || [];

      const formattedBookingRequests = bookingRequestsList
        .filter(item => !item.is_deleted || item.is_deleted === 0) // Filter out deleted
        .map((item, index) => ({
          id: `BR-${item.id ?? index}`,
          source_id: item.id ?? index,
          name: item.full_name || '-',
          email: item.email || '-',
          mobile: item.phone_number || '-',
          destination_type: item.domain_name || 'Holidays Planners', 
          trip_type: `${item.adults || 0} Adults, ${item.children || 0} Children`,
          status: 'new',
          priority: 'high',
          assigned_to: 'Unassigned',
          follow_up_date: null,
          created_at: item.created_at || new Date().toISOString(),
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

      // Process Enquiries - Filter out deleted ones
      const enquiriesList = Array.isArray(enquiriesData) 
        ? enquiriesData 
        : enquiriesData?.data || [];

      const formattedEnquiries = enquiriesList
        .filter(item => !item.is_deleted || item.is_deleted === 0) // Filter out deleted
        .map((item, index) => ({
          id: `ENQ-${item.id ?? index}`,
          source_id: item.id ?? index,
          name: item.full_name || '-',
          email: item.email || '-',
          mobile: item.contact_number || '-',
          destination_type: item.destination || '-',
          trip_type: item.hotel_category || '-',
          status: 'new',
          priority: 'medium',
          assigned_to: 'Unassigned',
          follow_up_date: null,
          created_at: item.created_at || new Date().toISOString(),
          source: item.departure_city || 'Website Enquiry',  // ✅ CORRECT - Read from API
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

      // Process Manual Leads - Filter out deleted ones
      const manualLeadsList = Array.isArray(manualLeadsData) 
        ? manualLeadsData 
        : manualLeadsData?.data || [];

      const formattedManualLeads = manualLeadsList
        .filter(item => !item.is_deleted || item.is_deleted === 0) // Filter out deleted
        .map((item, index) => ({
          id: `L-${item.id ?? index}`,
          source_id: Number(item.id ?? index),
          name: item.name || '-',
          email: item.email || '-',
          mobile: item.mobile || '-',
          destination_type: item.destination_type || '-',
          trip_type: item.trip_type || '-',
          status: item.status || 'new',
          priority: item.priority || 'medium',
          assigned_to: item.assigned_to || 'Unassigned',
          follow_up_date: item.follow_up_date || null,
          created_at: item.created_at || new Date().toISOString(),
          source: 'Manual Entry',
          type: 'lead',
          table: 'leads',
        }));

      // Combine and sort by created date
      const combined = [
        ...formattedBookingRequests,
        ...formattedEnquiries,
        ...formattedManualLeads,
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setLeads(combined);
      setDataStats({
        bookingRequests: formattedBookingRequests.length,
        enquiries: formattedEnquiries.length,
        manualLeads: formattedManualLeads.length,
      });
      setSelectedLeads([]);

      // Update trash count
      await fetchTrashCount();
    } catch (error) {
      console.error('❌ Error fetching leads:', error);
      setError('Failed to fetch leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Soft Delete lead
  const handleDeleteLead = async (lead) => {
    let tableName = lead.table;
    if (!tableName) {
      if (lead.type === 'booking_request') {
        tableName = 'booking_requests';
      } else if (lead.type === 'enquiry') {
        tableName = 'enquire_form';
      } else if (lead.type === 'lead') {
        tableName = 'leads';
      } else {
        alert('❌ Unknown lead type.');
        return;
      }
    }

    if (!window.confirm(`Are you sure you want to move "${lead.name}" to trash?`)) return;

    try {
      const response = await fetch(
        `https://api.yaadigo.com/secure/api/global/global/soft-delete?table=${tableName}&id=${lead.source_id}`,
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
        // Remove from UI immediately
        setLeads((prev) => prev.filter((item) => item.id !== lead.id));
        setSelectedLeads((prev) => prev.filter((id) => id !== lead.id));
        
        // Update stats
        setDataStats(prev => {
          const newStats = { ...prev };
          if (lead.type === 'booking_request') newStats.bookingRequests--;
          else if (lead.type === 'enquiry') newStats.enquiries--;
          else if (lead.type === 'lead') newStats.manualLeads--;
          return newStats;
        });
        
        await fetchTrashCount();
        alert(`✅ ${result.message || 'Lead moved to trash successfully.'}`);
      } else {
        alert(`❌ Failed to delete lead: ${result.detail || result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error deleting lead:', error);
      alert('❌ Error deleting lead.');
    }
  };

  // Bulk soft delete
  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) {
      alert('❌ No leads selected.');
      return;
    }

    if (!window.confirm(`Are you sure you want to move ${selectedLeads.length} lead(s) to trash?`))
      return;

    let successCount = 0;
    let failCount = 0;

    for (const leadId of selectedLeads) {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) continue;

      let tableName = lead.table;
      if (!tableName) {
        if (lead.type === 'booking_request') {
          tableName = 'booking_requests';
        } else if (lead.type === 'enquiry') {
          tableName = 'enquire_form';
        } else if (lead.type === 'lead') {
          tableName = 'leads';
        } else {
          continue;
        }
      }

      try {
        const response = await fetch(
          `https://api.yaadigo.com/secure/api/global/global/soft-delete?table=${tableName}&id=${lead.source_id}`,
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
        }
      } catch (error) {
        failCount++;
        console.error('Error deleting lead:', lead, error);
      }
    }

    alert(`✅ ${successCount} lead(s) moved to trash.${failCount > 0 ? ` ${failCount} failed.` : ''}`);
    fetchLeads(); // Refresh the list
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Apply filters
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.mobile?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    // Date range filter
    let matchesDate = true;
    if (dateRange[0] || dateRange[1]) {
      const leadDate = new Date(lead.created_at);
      if (dateRange[0]) matchesDate = matchesDate && leadDate >= dateRange[0];
      if (dateRange[1]) matchesDate = matchesDate && leadDate <= dateRange[1];
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const toggleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const selectAll = () => {
    const allLeadIds = filteredLeads.map((l) => l.id);
    setSelectedLeads(allLeadIds);
  };

  const deselectAll = () => setSelectedLeads([]);

  return (
    <Box sx={{ py: 4, px: 2, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <h2 style={{ margin: 0 }}>Lead Management</h2>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Badge badgeContent={trashCount} color="error" max={999}>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={() => navigate('/admin/dashboard/lead-trash')}
              >
                Trash
              </Button>
            </Badge>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => setOpenAddLead(true)}
            >
              Add New Lead
            </Button>
          </Box>
        </Box>

        {/* Data Source Stats */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Alert severity="info" sx={{ flex: 1, minWidth: 200 }}>
            <strong>Booking Requests:</strong> {dataStats.bookingRequests}
          </Alert>
          <Alert severity="success" sx={{ flex: 1, minWidth: 200 }}>
            <strong>Enquiries:</strong> {dataStats.enquiries}
          </Alert>
          <Alert severity="warning" sx={{ flex: 1, minWidth: 200 }}>
            <strong>Manual Leads:</strong> {dataStats.manualLeads}
          </Alert>
          <Alert severity="info" sx={{ flex: 1, minWidth: 200 }}>
            <strong>Total:</strong> {leads.length}
          </Alert>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search leads..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="quoted">Quoted</MenuItem>
                <MenuItem value="booked">Booked</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="From Date"
                  value={dateRange[0]}
                  onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <DatePicker
                  label="To Date"
                  value={dateRange[1]}
                  onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>
            </LocalizationProvider>
          </Grid>
        </Grid>

        {/* Bulk Actions */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outlined" onClick={deselectAll}>
            Deselect All
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleBulkDelete}
            disabled={selectedLeads.length === 0}
          >
            Move to Trash ({selectedLeads.length})
          </Button>
          <Button variant="outlined" onClick={fetchLeads} disabled={loading}>
            Refresh Data
          </Button>
        </Box>

        {/* Lead Table */}
        {!loading && (
          <LeadTableWithDetails
            leads={filteredLeads}
            selectedLeads={selectedLeads}
            toggleSelectLead={toggleSelectLead}
            onDeleteLead={handleDeleteLead}
            onRefresh={fetchLeads}
            onLocalUpdate={handleLocalLeadUpdate}
          />
        )}

        {/* Add Lead Dialog */}
        <AddLeadDialog
          open={openAddLead}
          onClose={(shouldRefresh) => {
            setOpenAddLead(false);
            if (shouldRefresh) fetchLeads();
          }}
        />
      </Container>
    </Box>
  );
};

export default LeadManagement;