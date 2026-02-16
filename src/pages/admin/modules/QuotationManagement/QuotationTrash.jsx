// src/pages/admin/modules/QuotationManagement/QuotationTrash.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Container, Typography, Alert, CircularProgress, 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Checkbox
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Restore as RestoreIcon, 
  DeleteForever as DeleteForeverIcon 
} from '@mui/icons-material';

const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const TRASH_API = 'https://api.yaadigo.com/secure/api/global/global/trash?table=quotations';
const RESTORE_API = 'https://api.yaadigo.com/secure/api/global/global/restore?table=quotations&id=';
const HARD_DELETE_API = 'https://api.yaadigo.com/secure/api/global/global/hard-delete?table=quotations&id=';

const QuotationTrash = () => {
  const navigate = useNavigate();
  const [trashed, setTrashed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchTrashed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(TRASH_API, {
        headers: { 'x-api-key': API_KEY },
      });
      const result = await response.json();
      setTrashed(result?.data || []);
      setSelectedIds([]);
    } catch (e) {
      console.error('Error fetching trash:', e);
      setError('Failed to fetch trash data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrashed();
  }, [fetchTrashed]);
  
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === trashed.length && trashed.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(trashed.map(r => r.id));
    }
  };
  
  const handleAction = async (id, endpoint, method, confirmationMessage, successMessage, isHardDelete = false) => {
    if (!window.confirm(confirmationMessage)) return;
    
    if (isHardDelete) {
      const confirmText = prompt("Type 'DELETE' to confirm permanent deletion:");
      if (confirmText !== 'DELETE') {
        alert('Deletion cancelled.');
        return;
      }
    }

    setActionInProgress(true);
    try {
      const response = await fetch(`${endpoint}${id}`, {
        method: method,
        headers: { 'accept': 'application/json', 'x-api-key': API_KEY },
      });
      const result = await response.json();

      if (response.ok && result.success) {
        fetchTrashed();
      } else {
        alert(`Failed: ${result.message || 'Unknown error'}`);
      }
    } catch (e) {
      console.error('Action error:', e);
      alert('Network error performing action.');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleRestore = (id) => {
    handleAction(
      id, 
      RESTORE_API, 
      'POST', 
      'Are you sure you want to restore this quotation?', 
      'Quotation restored successfully.'
    );
  };

  const handleHardDelete = (id) => {
    handleAction(
      id, 
      HARD_DELETE_API, 
      'DELETE', 
      'WARNING: This will permanently delete this quotation. This action cannot be undone!', 
      'Quotation permanently deleted.', 
      true
    );
  };

  const handleBulkAction = async (type) => {
    if (!selectedIds.length) {
      alert('Please select at least one quotation.');
      return;
    }
    
    let endpoint, method, confirmation, successMsg, isHardDelete = false;

    if (type === 'restore') {
      endpoint = RESTORE_API;
      method = 'POST';
      confirmation = `Are you sure you want to restore ${selectedIds.length} quotations?`;
      successMsg = 'Restored successfully.';
    } else if (type === 'hard-delete') {
      endpoint = HARD_DELETE_API;
      method = 'DELETE';
      confirmation = `WARNING: This will permanently delete ${selectedIds.length} quotations. This action cannot be undone!`;
      isHardDelete = true;
      successMsg = 'Permanently deleted successfully.';
    } else {
      return;
    }

    if (!window.confirm(confirmation)) return;

    if (isHardDelete) {
      const confirmText = prompt("Type 'DELETE' to confirm permanent bulk deletion:");
      if (confirmText !== 'DELETE') {
        alert('Bulk deletion cancelled.');
        return;
      }
    }

    setActionInProgress(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      try {
        const response = await fetch(`${endpoint}${id}`, {
          method: method,
          headers: { 'accept': 'application/json', 'x-api-key': API_KEY },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (e) {
        failCount++;
      }
    }

    setActionInProgress(false);
    setSelectedIds([]);
    alert(`${successCount} quotations ${successMsg}. ${failCount} failed.`);
    fetchTrashed();
  };

  return (
    <Box sx={{ py: 4, px: 2, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xl">
        
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="error">
            🗑️ Quotation Trash ({trashed.length})
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/dashboard/quotation-management')}
            size="large"
          >
            Back to Quotations
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<RestoreIcon />}
            onClick={() => handleBulkAction('restore')} 
            disabled={selectedIds.length === 0 || actionInProgress}
          >
            Restore Selected ({selectedIds.length})
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<DeleteForeverIcon />}
            onClick={() => handleBulkAction('hard-delete')} 
            disabled={selectedIds.length === 0 || actionInProgress}
          >
            Delete Selected Forever ({selectedIds.length})
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={trashed.length > 0 && selectedIds.length === trashed.length}
                      indeterminate={selectedIds.length > 0 && selectedIds.length < trashed.length}
                      onChange={selectAll}
                      disabled={actionInProgress || trashed.length === 0}
                    />
                  </TableCell>
                  <TableCell><strong>S.No</strong></TableCell>
                  <TableCell><strong>Quote ID</strong></TableCell>
                  <TableCell><strong>Client Info</strong></TableCell>
                  <TableCell><strong>Design</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Deleted Date</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>

                {trashed.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Box sx={{ py: 6 }}>
                        <Typography variant="h6" color="text.secondary">
                          🎉 Trash is empty!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          All your quotations are in good standing.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  trashed.map((q, idx) => {
                    const clientName = q.client_name || q.lead_info || 'N/A';

                    return (
                      <TableRow key={q.id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedIds.includes(q.id)}
                            onChange={() => toggleSelect(q.id)}
                            disabled={actionInProgress}
                          />
                        </TableCell>

                        <TableCell>{idx + 1}</TableCell>

                        <TableCell>
                          <Chip label={`#${q.id}`} size="small" color="error" variant="outlined" />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {clientName}
                          </Typography>
                          {q.client_email && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              📧 {q.client_email}
                            </Typography>
                          )}
                          {q.client_mobile && (
                            <Typography variant="caption" color="text.secondary">
                              📱 {q.client_mobile}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Chip label={q.design || '-'} size="small" variant="outlined" />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            ₹{(q.amount || 0).toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption">
                            {new Date(q.updated_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Button 
                            startIcon={<RestoreIcon />} 
                            onClick={() => handleRestore(q.id)} 
                            color="success" 
                            size="small" 
                            sx={{ mr: 1 }}
                            disabled={actionInProgress}
                          >
                            Restore
                          </Button>

                          <Button 
                            startIcon={<DeleteForeverIcon />} 
                            onClick={() => handleHardDelete(q.id)} 
                            color="error" 
                            size="small"
                            disabled={actionInProgress}
                          >
                            Delete Forever
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}

              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default QuotationTrash;
