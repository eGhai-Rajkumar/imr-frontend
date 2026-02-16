import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Eye, Edit, Trash2, Copy, MoreVertical, Search, Star, 
  ExternalLink, BarChart, LayoutGrid, List, AlertCircle, X, 
  CheckSquare, Square 
} from 'lucide-react';

// =============================================================================
// CONFIGURATION
// =============================================================================
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';

/**
 * Recursive function to clean data for duplication.
 * Removes system-generated IDs to prevent database "Duplicate Key" errors.
 */
const cleanDataForDuplication = (data) => {
  if (Array.isArray(data)) return data.map(cleanDataForDuplication);
  if (data !== null && typeof data === 'object') {
    const fieldsToRemove = [
      'id', '_id', 'uuid', 'created_at', 'updated_at', 'deleted_at', 
      'views', 'leads', 'created_by', 'updated_by', 'page_id', 'landing_page_id'
    ];
    const cleaned = {};
    for (const key in data) {
      if (!fieldsToRemove.includes(key) && data[key] !== null && data[key] !== undefined) {
        cleaned[key] = cleanDataForDuplication(data[key]);
      }
    }
    return cleaned;
  }
  return data;
};

export default function LandingPageList() {
  const navigate = useNavigate();

  // -------------------------------------------------------------------------
  // UI & DATA STATE
  // -------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [landingPages, setLandingPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);

  // -------------------------------------------------------------------------
  // EFFECTS
  // -------------------------------------------------------------------------
  useEffect(() => {
    fetchLandingPages();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // -------------------------------------------------------------------------
  // API ACTIONS
  // -------------------------------------------------------------------------
  const fetchLandingPages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages?per_page=100`, {
        headers: { 'x-api-key': API_KEY }
      });
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      const pages = data.pages || data.data || data;
      setLandingPages(Array.isArray(pages) ? pages : []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (page) => {
    try {
      const res = await fetch(`${API_BASE_URL}/landing-pages/${page.id}/toggle-active`, {
        method: 'PATCH',
        headers: { 'x-api-key': API_KEY }
      });
      if (!res.ok) throw new Error();
      setLandingPages(prev => prev.map(p => p.id === page.id ? { ...p, is_active: !p.is_active } : p));
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;
    setIsLoading(true);
    setDropdownOpen(null);
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages/${id}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY }
      });
      if (!response.ok) throw new Error('Failed to delete page');
      setLandingPages(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (page) => {
    if (!window.confirm(`Duplicate "${page.page_name}"?`)) return;
    setIsLoading(true);
    setDropdownOpen(null);
    try {
      // Fetch full details for a complete copy
      const detailRes = await fetch(`${API_BASE_URL}/landing-pages/${page.id}`, {
        headers: { 'x-api-key': API_KEY }
      });
      const result = await detailRes.json();
      const fullPage = result.data || result;

      // Clean the data (remove old IDs and views)
      let cleanedData = cleanDataForDuplication(fullPage);

      // Fix potential Pydantic "social_media must be a list" error
      if (cleanedData.company && cleanedData.company.social_media && !Array.isArray(cleanedData.company.social_media)) {
        cleanedData.company.social_media = [];
      }

      const payload = {
        ...cleanedData,
        page_name: `${fullPage.page_name || page.page_name} (Copy)`,
        slug: `${(fullPage.slug || 'page').substring(0, 30)}-${Math.floor(Math.random() * 10000)}`,
        is_active: false
      };

      const createRes = await fetch(`${API_BASE_URL}/landing-pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify(payload)
      });

      if (!createRes.ok) throw new Error('Server rejected duplication');
      await fetchLandingPages();
      alert('Page duplicated as Draft.');
    } catch (error) {
      alert('Duplication failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // BULK ACTIONS
  // -------------------------------------------------------------------------
  const toggleSelectPage = (pageId) => {
    setSelectedPages(prev => 
      prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
    );
  };

  const selectAllPages = () => {
    if (selectedPages.length === filteredPages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(filteredPages.map(p => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPages.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedPages.length} pages?`)) return;

    setIsLoading(true);
    try {
      await Promise.all(selectedPages.map(id => 
        fetch(`${API_BASE_URL}/landing-pages/${id}`, {
          method: 'DELETE',
          headers: { 'x-api-key': API_KEY }
        })
      ));
      setLandingPages(prev => prev.filter(p => !selectedPages.includes(p.id)));
      setSelectedPages([]);
      setBulkDeleteMode(false);
      alert('Selected pages deleted successfully.');
    } catch (e) {
      alert('Some pages failed to delete.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // UTILITIES
  // -------------------------------------------------------------------------
  const filteredPages = landingPages.filter(page => {
    const matchesSearch = (page.page_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (page.slug || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && page.is_active) ||
      (filterStatus === 'inactive' && !page.is_active);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: landingPages.length,
    active: landingPages.filter(p => p.is_active).length,
    views: landingPages.reduce((sum, p) => sum + (p.views || 0), 0),
    leads: landingPages.reduce((sum, p) => sum + (p.leads || 0), 0)
  };

  /**
   * FIXED: Prioritizes the first image of the Hero Section Upload
   */
  const getPreviewImage = (page) => {
    // 1. Try Hero Background Images first
    if (page.hero?.background_images && page.hero.background_images.length > 0) {
      return page.hero.background_images[0];
    }
    // 2. Fallback to SEO OG Image
    if (page.seo?.og_image) return page.seo.og_image;
    // 3. Fallback to Company Logo
    if (page.company?.logo) return page.company.logo;
    // 4. Default Placeholder
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80';
  };

  const handleView = async (page) => {
    if (!page.is_active) {
      const confirmPublish = window.confirm(`This page is Inactive. Activate it now to view preview?`);
      if (confirmPublish) {
        setIsLoading(true);
        try {
          await handleToggleStatus(page);
          window.open(`/landing/${page.slug}`, '_blank');
        } catch (e) { alert("Fail to activate"); }
        finally { setIsLoading(false); }
      }
      return;
    }
    window.open(`/landing/${page.slug}`, '_blank');
  };

  const handleCreate = () => navigate('/admin/dashboard/landing-pages/create');
  const handleEdit = (id) => navigate(`/admin/dashboard/landing-pages/edit/${id}`);

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Landing Pages</h1>
            <p className="text-slate-500">Manage and design your marketing experience</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {bulkDeleteMode ? (
              <>
                <button 
                  onClick={handleBulkDelete} 
                  disabled={selectedPages.length === 0 || isLoading}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg disabled:opacity-50 transition-all"
                >
                  <Trash2 size={18} /> Delete Selected ({selectedPages.length})
                </button>
                <button 
                  onClick={() => { setBulkDeleteMode(false); setSelectedPages([]); }}
                  className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold"
                >
                  <X size={18} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setBulkDeleteMode(true)}
                  className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-slate-50"
                >
                  <CheckSquare size={18} /> Select Multiple
                </button>
                <button 
                  onClick={handleCreate} 
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all"
                >
                  <Plus size={18} /> Create New Page
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pages', val: stats.total, icon: List, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Published', val: stats.active, icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Views', val: stats.views, icon: BarChart, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Total Leads', val: stats.leads, icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-black text-slate-800">{s.val.toLocaleString()}</p>
              </div>
              <div className={`${s.bg} p-2 rounded-lg`}><s.icon className={s.color} size={20} /></div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {bulkDeleteMode && (
              <button onClick={selectAllPages} className="text-xs font-bold text-blue-600 px-3 py-2 bg-blue-50 rounded-lg">
                {selectedPages.length === filteredPages.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['all', 'active', 'inactive'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterStatus === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><List size={16} /></button>
            </div>
          </div>
        </div>

        {/* Content View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map(page => (
              <div key={page.id} className={`group relative bg-white rounded-2xl border transition-all duration-300 ${selectedPages.includes(page.id) ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
                
                {bulkDeleteMode && (
                  <button 
                    onClick={() => toggleSelectPage(page.id)}
                    className="absolute top-4 left-4 z-20 p-1.5 rounded-lg bg-white shadow-lg border border-slate-100"
                  >
                    {selectedPages.includes(page.id) ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} className="text-slate-300" />}
                  </button>
                )}

                <div className="h-44 overflow-hidden rounded-t-2xl bg-slate-100 relative">
                  <img src={getPreviewImage(page)} alt={page.page_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase shadow-sm ${page.is_active ? 'bg-green-500 text-white' : 'bg-slate-900 text-white'}`}>
                      {page.is_active ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-800 truncate mb-1">{page.page_name}</h3>
                  <p className="text-[10px] text-slate-400 mb-4 font-mono truncate">/landing/{page.slug}</p>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5"><Eye size={14} className="text-slate-400" /><span className="text-xs font-bold text-slate-700">{page.views || 0}</span></div>
                      <div className="flex items-center gap-1.5"><Star size={14} className="text-orange-400" /><span className="text-xs font-bold text-slate-700">{page.leads || 0}</span></div>
                    </div>
                    <p className="text-[9px] text-slate-300 font-bold uppercase">{new Date(page.updated_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(page.id)}
                      className="flex-1 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={14} /> EDIT
                    </button>
                    
                    <div className="dropdown-container relative">
                      <button 
                        onClick={() => setDropdownOpen(dropdownOpen === page.id ? null : page.id)}
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {dropdownOpen === page.id && (
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden">
                          <button onClick={() => handleView(page)} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-xs font-bold text-slate-600"><ExternalLink size={14}/> Preview Live</button>
                          <button onClick={() => handleDuplicate(page)} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-xs font-bold text-slate-600"><Copy size={14}/> Duplicate Page</button>
                          <button onClick={() => handleToggleStatus(page)} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-xs font-bold text-slate-600"><Eye size={14}/> {page.is_active ? 'Set to Draft' : 'Publish Page'}</button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button onClick={() => handleDelete(page.id)} className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-black text-red-600"><Trash2 size={14}/> DELETE</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                  {bulkDeleteMode && <th className="p-4 w-10"></th>}
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Identity</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stats</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPages.map(page => (
                  <tr key={page.id} className={`hover:bg-slate-50/30 transition-colors ${selectedPages.includes(page.id) ? 'bg-blue-50/50' : ''}`}>
                    {bulkDeleteMode && (
                      <td className="p-4 text-center">
                        <button onClick={() => toggleSelectPage(page.id)} className={selectedPages.includes(page.id) ? 'text-blue-600' : 'text-slate-300'}>
                          {selectedPages.includes(page.id) ? <CheckSquare size={20}/> : <Square size={20}/>}
                        </button>
                      </td>
                    )}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={getPreviewImage(page)} className="w-12 h-9 rounded-lg object-cover bg-slate-100" alt="" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{page.page_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">/{page.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-1"><Eye size={14} className="text-blue-400"/> {page.views || 0}</span>
                        <span className="flex items-center gap-1"><Star size={14} className="text-orange-400"/> {page.leads || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleToggleStatus(page)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${page.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                        {page.is_active ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(page.id)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit size={18}/></button>
                        <button onClick={() => handleView(page)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><ExternalLink size={18}/></button>
                        <button onClick={() => handleDelete(page.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Processing Request...</p>
          </div>
        </div>
      )}
    </div>
  );
}