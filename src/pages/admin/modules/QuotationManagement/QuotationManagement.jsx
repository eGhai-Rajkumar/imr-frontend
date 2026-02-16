// src/pages/admin/modules/QuotationManagement/QuotationManagement.jsx
// FIXED: Separate View (PDF preview) and Edit (form) actions
import React, { useEffect, useState, useCallback } from "react";
import { Button, Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import QuotationTable from "./components/QuotationTable";
import QuotationFormDialog from "./components/QuotationFormDialog";
import QuotationViewDialog from "./components/QuotationViewDialog";
import DeleteIcon from '@mui/icons-material/Delete';

const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const TRASH_COUNT_API = 'https://api.yaadigo.com/secure/api/global/global/trash?table=quotations';

export default function QuotationManagement() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // FIX 1: Separate states for View and Edit
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [viewingQuotation, setViewingQuotation] = useState(null);
  
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [trashCount, setTrashCount] = useState(0);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [qRes, trashRes] = await Promise.all([
        fetch(`${API_BASE_URL}/quotation/`, {
          headers: { 'x-api-key': API_KEY, 'accept': 'application/json' }
        }),
        fetch(TRASH_COUNT_API, {
            headers: { 'x-api-key': API_KEY, 'accept': 'application/json' }
        })
      ]);
      
      const qJson = await qRes.json();
      const qList = (qJson && qJson.data) ? qJson.data : (Array.isArray(qJson) ? qJson : []);

      const trashJson = await trashRes.json();
      setTrashCount((trashJson?.data || []).length);

      const [bookingReqRes, enquiresRes, leadsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/bookings/`, { headers: { 'x-api-key': API_KEY } }),
        fetch(`${API_BASE_URL}/enquires/`, { headers: { 'x-api-key': API_KEY } }),
        fetch(`${API_BASE_URL}/leads/`, { headers: { 'x-api-key': API_KEY } })
      ]);

      const [bookingReqJson, enquiresJson, leadsJson] = await Promise.all([
        bookingReqRes.json().catch(() => ({})),
        enquiresRes.json().catch(() => ({})),
        leadsRes.json().catch(() => ({})),
      ]);

      const bookingList = bookingReqJson?.data || (Array.isArray(bookingReqJson) ? bookingReqJson : []);
      const enquireList = enquiresJson?.data || (Array.isArray(enquiresJson) ? enquiresJson : []);
      const leadList = leadsJson?.data || (Array.isArray(leadsJson) ? leadsJson : []);

      const bookingMap = {};
      bookingList.forEach(b => { bookingMap[b.id] = b; });
      const enquireMap = {};
      enquireList.forEach(e => { enquireMap[e.id] = e; });
      const leadMap = {};
      leadList.forEach(l => { leadMap[l.id] = l; });

      const merged = qList.map(q => {
        const lead_id = q?.lead_id ?? null;
        let clientLabel = '';
        let client_name = '';
        let client_email = '';
        let client_mobile = '';
        let lead_source = '';

        if (lead_id && bookingMap[lead_id]) {
          const b = bookingMap[lead_id];
          lead_source = 'booking';
          clientLabel = `${b.full_name || 'Booking Request'} (Booking Request #${b.id})`;
          client_name = b.full_name || '';
          client_email = b.email || '';
          client_mobile = b.phone_number || '';
        } else if (lead_id && enquireMap[lead_id]) {
          const e = enquireMap[lead_id];
          lead_source = 'enquiry';
          clientLabel = `${e.full_name || 'Enquiry'} (Enquiry #${e.id})`;
          client_name = e.full_name || '';
          client_email = e.email || '';
          client_mobile = e.contact_number || '';
        } else if (lead_id && leadMap[lead_id]) {
          const l = leadMap[lead_id];
          lead_source = 'lead';
          clientLabel = `${l.name || 'Lead'} (Lead #${l.id})`;
          client_name = l.name || '';
          client_email = l.email || '';
          client_mobile = l.mobile || '';
        } else {
          client_name = q?.client_name || q?.agent?.name || q?.company?.name || 'Unknown';
          client_email = q?.client_email || q?.agent?.email || q?.company?.email || '';
          client_mobile = q?.client_mobile || q?.agent?.contact || q?.company?.mobile || '';
          clientLabel = client_name + (q?.agent?.name ? ' (Agent)' : '');
          lead_source = 'manual';
        }

        return {
          ...q,
          __clientLabel: clientLabel,
          __client_name: client_name,
          __client_email: client_email,
          __client_mobile: client_mobile,
          __lead_source: lead_source
        };
      });

      setQuotations(merged);
    } catch (err) {
      console.error("Error fetching quotations or lead sources:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, refreshFlag]);

  const handleRefresh = () => setRefreshFlag(f => f + 1);

  // FIX 1: Separate handler for viewing (PDF preview)
  const handleView = (quotation) => {
    setViewingQuotation(quotation);
    setOpenView(true);
  };

  // Handler for editing (form dialog)
  const handleEdit = (quotation) => {
    setEditingQuotation(quotation);
    setOpenForm(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Quotation Management</Typography>
        <Box>
          <Button 
            color="error" 
            variant="contained" 
            sx={{ mr: 2 }} 
            onClick={() => navigate('/admin/dashboard/quotation-trash')}
            startIcon={<DeleteIcon />}
          >
            TRASH {trashCount > 0 && `(${trashCount})`}
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setEditingQuotation(null);
              setOpenForm(true);
            }}
          >
            + CREATE NEW
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <QuotationTable 
          quotations={quotations} 
          onRefresh={handleRefresh} 
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {/* Edit Form Dialog */}
      <QuotationFormDialog
        open={openForm}
        quotation={editingQuotation}
        onClose={(shouldRefresh) => {
          setOpenForm(false);
          setEditingQuotation(null);
          if (shouldRefresh) handleRefresh();
        }}
        API_KEY={API_KEY}
        QUOTATION_API={`${API_BASE_URL}/quotation/`}
      />

      {/* FIX 1: Separate View Dialog for PDF preview */}
      <QuotationViewDialog
        open={openView}
        quotation={viewingQuotation}
        onClose={() => {
          setOpenView(false);
          setViewingQuotation(null);
        }}
        onEdit={(quotation) => {
          // Close view and open edit
          setOpenView(false);
          setViewingQuotation(null);
          handleEdit(quotation);
        }}
      />
    </Box>
  );
}