import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye, MapPin, Users, Loader2, InboxIcon } from 'lucide-react';
import '../css/DashboardOverview.css';
import { Link } from 'react-router-dom';

const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const API_BASE = 'https://api.yaadigo.com/secure/api';

const getStatusClasses = (status) => {
  switch (status) {
    case 'new': return 'status-new';
    case 'interested': return 'status-interested';
    case 'booked': return 'status-booked';
    case 'pending': return 'status-pending';
    case 'contacted': return 'status-interested';
    case 'quoted': return 'status-pending';
    default: return 'bg-gray-500 text-white';
  }
};

const getAvatarColor = (initial) => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
  const hash = (initial || 'A').charCodeAt(0) % colors.length;
  return colors[hash];
};

const LeadItem = ({ lead }) => (
  <div className="lead-item flex items-center p-4 border-b border-gray-100 hover:shadow-sm transition-all duration-300 cursor-pointer">
    <div className={`lead-avatar ${getAvatarColor(lead.initial)} text-white flex-shrink-0`}>
      {lead.initial}
    </div>
    <div className="flex-1 ml-4 min-w-0">
      <p className="text-lg font-semibold text-gray-800 truncate">{lead.name}</p>
      <p className="text-sm text-gray-500 truncate">
        <MapPin className="inline h-4 w-4 mr-1 mb-0.5" />
        {lead.location}
        {lead.source && <span className="ml-1 text-xs text-gray-400">• {lead.source}</span>}
      </p>
    </div>
    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
      <span className={`lead-status ${getStatusClasses(lead.status)}`}>
        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
      </span>
      <Link
        to={`/admin/dashboard/lead-management`}
        className="text-gray-400 hover:text-blue-600 transition-colors"
        title="View Lead Details"
      >
        <Eye className="w-5 h-5" />
      </Link>
    </div>
  </div>
);

export default function RecentLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchRecentLeads = async () => {
      setLoading(true);
      const headers = { 'x-api-key': API_KEY };

      try {
        const [bookingRes, enquiriesRes, manualRes] = await Promise.allSettled([
          fetch(`${API_BASE}/booking_request/`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/enquires/`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/leads/`, { headers }).then(r => r.json()),
        ]);

        const bookingList = bookingRes.status === 'fulfilled'
          ? (Array.isArray(bookingRes.value) ? bookingRes.value : bookingRes.value?.data || [])
          : [];
        const enquiriesList = enquiriesRes.status === 'fulfilled'
          ? (Array.isArray(enquiriesRes.value) ? enquiriesRes.value : enquiriesRes.value?.data || [])
          : [];
        const manualList = manualRes.status === 'fulfilled'
          ? (Array.isArray(manualRes.value) ? manualRes.value : manualRes.value?.data || [])
          : [];

        const formattedBookings = bookingList
          .filter(i => !i.is_deleted || i.is_deleted === 0)
          .map(i => ({
            id: `BR-${i.id}`,
            name: i.full_name || 'Unknown',
            initial: (i.full_name || 'U')[0].toUpperCase(),
            location: i.domain_name || 'Booking Request',
            source: 'Booking',
            status: 'new',
            created_at: i.created_at || new Date().toISOString(),
          }));

        const formattedEnquiries = enquiriesList
          .filter(i => !i.is_deleted || i.is_deleted === 0)
          .map(i => ({
            id: `ENQ-${i.id}`,
            name: i.full_name || 'Unknown',
            initial: (i.full_name || 'U')[0].toUpperCase(),
            location: i.destination || i.departure_city || 'Website Enquiry',
            source: 'Enquiry',
            status: 'new',
            created_at: i.created_at || new Date().toISOString(),
          }));

        const formattedManual = manualList
          .filter(i => !i.is_deleted || i.is_deleted === 0)
          .map(i => ({
            id: `L-${i.id}`,
            name: i.name || 'Unknown',
            initial: (i.name || 'U')[0].toUpperCase(),
            location: i.destination_type || 'Manual Lead',
            source: 'Manual',
            status: i.status || 'new',
            created_at: i.created_at || new Date().toISOString(),
          }));

        const combined = [...formattedBookings, ...formattedEnquiries, ...formattedManual]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setLeads(combined);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('RecentLeads fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLeads();
  }, []);

  return (
    <div className="luxury-card p-6 h-full">
      <header className="flex items-center justify-between mb-4 border-b pb-3">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Recent Leads
        </h3>
        <Link
          to="/admin/dashboard/lead-management"
          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center text-sm"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </header>

      <div className="space-y-1 divide-y divide-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <InboxIcon className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">No leads found</p>
          </div>
        ) : (
          leads.map(lead => (
            <LeadItem key={lead.id} lead={lead} />
          ))
        )}

        {!loading && lastUpdated && (
          <div className="pt-4 text-center text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}