import React from 'react';
import { ArrowRight, Eye, MapPin, Users } from 'lucide-react';
import '../css/DashboardOverview.css';
import { Link } from 'react-router-dom';

// --- Mock Data ---
const mockLeads = [
  { id: 1, name: 'Shaili Chauhan', initial: 'S', location: 'Dubai, UAE', theme: 'adventure', status: 'new' },
  { id: 2, name: 'Umesh K. M.', initial: 'U', location: 'Ooty, India', theme: 'family', status: 'interested' },
  { id: 3, name: 'Sample Lead', initial: 'S', location: 'Goa, India', theme: 'honeymoon', status: 'new' },
  { id: 4, name: 'Priya Sharma', initial: 'P', location: 'Bali, Indonesia', theme: 'luxury', status: 'booked' },
  { id: 5, name: 'John Doe', initial: 'J', location: 'Leh-Ladakh', theme: 'backpacking', status: 'pending' },
];

const getStatusClasses = (status) => {
  switch (status) {
    case 'new': return 'status-new';
    case 'interested': return 'status-interested';
    case 'booked': return 'status-booked';
    case 'pending': return 'status-pending';
    default: return 'bg-gray-500 text-white';
  }
};

const getAvatarColor = (initial) => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
  const hash = initial.charCodeAt(0) % colors.length;
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
        {lead.location} • <span className="capitalize">{lead.theme}</span>
      </p>
    </div>
    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
      <span className={`lead-status ${getStatusClasses(lead.status)}`}>
        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
      </span>
      <Link 
        to={`/admin/dashboard/lead-management?leadId=${lead.id}`}
        className="text-gray-400 hover:text-blue-600 transition-colors"
        title="View Lead Details"
      >
        <Eye className="w-5 h-5" />
      </Link>
    </div>
  </div>
);

export default function RecentLeads() {
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
        {mockLeads.map(lead => (
          <LeadItem key={lead.id} lead={lead} />
        ))}
        
        <div className="pt-4 text-center text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}