import React from 'react';
import { Package, Hotel, Zap, Plus, Settings, Users, Star, Mail, FileText, ArrowRight } from 'lucide-react';
import '../css/DashboardOverview.css';
import RecentLeads from './RecentLeads';
import { Link } from 'react-router-dom';

// --- Mock Data (from the screenshot) ---
const kpiData = [
  { 
    title: 'Trip Packages', 
    value: '45', 
    total: '109 total', 
    icon: Package, 
    color: 'kpi-card-packages',
    link: '/admin/dashboard/view-trips' 
  },
  { 
    title: 'Hotels Listed', 
    value: '89', 
    total: '109 total', 
    icon: Hotel, 
    color: 'kpi-card-hotels',
    link: '/admin/dashboard/add-destination' 
  },
  { 
    title: 'Activities', 
    value: '234', 
    total: '284 total', 
    icon: Zap, 
    color: 'kpi-card-activities',
    link: '/admin/dashboard/add-activity' 
  }
];

const quickActions = [
  { title: 'Add Trip Package', icon: Plus, color: 'qa-add-trip', link: '/admin/dashboard/add-new-trip' },
  { title: 'Manage Leads', icon: Users, color: 'qa-manage-leads', link: '/admin/dashboard/lead-management' },
  { title: 'View Bookings', icon: Star, color: 'qa-view-bookings', link: '/admin/dashboard/manage-bookings' },
  { title: 'Email Campaigns', icon: Mail, color: 'qa-email-campaigns', link: '#' },
  { title: 'Page Builder', icon: FileText, color: 'qa-page-builder', link: '/admin/dashboard/page-builder' },
  { title: 'Settings', icon: Settings, color: 'qa-settings', link: '#' },
];

// --- KPI Card Component ---
const KPICard = ({ data }) => {
  const Icon = data.icon;
  return (
    <Link to={data.link} className={`kpi-card ${data.color} cursor-pointer block h-full`}>
      <div className="flex items-start justify-between">
        <div className="relative z-10">
          <h3 className="text-base font-semibold text-white/80">{data.title}</h3>
          <p className="text-4xl font-bold mt-1">{data.value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="flex justify-between items-end mt-4 pt-3 border-t border-white/30">
        <p className="text-sm text-white/80">{data.total}</p>
        <div className="text-white hover:underline text-sm font-medium flex items-center">
          View <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};

// --- Quick Action Component ---
const QuickActionButton = ({ action }) => {
  const Icon = action.icon;
  return (
    <Link to={action.link} className="luxury-card quick-action-button text-gray-800 hover:text-blue-600 transition-all">
      <div className={`quick-action-icon flex items-center justify-center ${action.color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-semibold text-center">{action.title}</span>
    </Link>
  );
};


// --- Main Dashboard Overview ---
export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* 1. Inventory Overview (KPIs) */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        Inventory Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} data={kpi} />
        ))}
      </div>

      {/* 2. Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Recent Leads Component */}
          <RecentLeads />
        </div>
        
        <div className="lg:col-span-1">
          {/* Quick Actions */}
          <div className="luxury-card p-6 h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionButton key={index} action={action} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}