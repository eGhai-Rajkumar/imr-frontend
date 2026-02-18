import React, { useState, useEffect } from 'react';
import { Package, Zap, Plus, Users, FileText, ArrowRight, Loader2 } from 'lucide-react';
import '../css/DashboardOverview.css';
import RecentLeads from './RecentLeads';
import { Link } from 'react-router-dom';

const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const API_BASE = 'https://api.yaadigo.com/secure/api';

const quickActions = [
  { title: 'Add Trip Package', icon: Plus, color: 'qa-add-trip', link: '/admin/dashboard/trip-management/create' },
  { title: 'Manage Leads', icon: Users, color: 'qa-manage-leads', link: '/admin/dashboard/lead-management' },
  { title: 'Landing Pages', icon: FileText, color: 'qa-page-builder', link: '/admin/dashboard/landing-pages' },
];

// --- KPI Card Component ---
const KPICard = ({ data }) => {
  const Icon = data.icon;
  return (
    <Link to={data.link} className={`kpi-card ${data.color} cursor-pointer block h-full`}>
      <div className="flex items-start justify-between">
        <div className="relative z-10">
          <h3 className="text-base font-semibold text-white/80">{data.title}</h3>
          <p className="text-4xl font-bold mt-1">
            {data.loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-white/70" />
            ) : data.value === null ? (
              '—'
            ) : (
              data.value
            )}
          </p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="flex justify-between items-end mt-4 pt-3 border-t border-white/30">
        <p className="text-sm text-white/80">{data.subtitle}</p>
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
  const [stats, setStats] = useState({
    trips: null,
    categories: null,
    destinations: null,
    activities: null,
    leads: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { 'x-api-key': API_KEY };

    const fetchStats = async () => {
      setLoading(true);
      try {
        const [tripsRes, categoriesRes, destinationsRes, activitiesRes, bookingRes, enquiriesRes, leadsRes] = await Promise.allSettled([
          fetch(`${API_BASE}/trips/`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/categories/?skip=0&limit=1000&tenant_id=1`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/destinations/`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/activities/?skip=0&limit=1000&tenant_id=1`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/booking_request/`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/enquires/`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/leads/`, { headers }).then(r => r.json()),
        ]);

        // Helper to extract count from standard API response
        const getCount = (res) =>
          res.status === 'fulfilled' && res.value?.success && Array.isArray(res.value.data)
            ? res.value.data.length
            : null;

        const tripsCount = getCount(tripsRes);
        const categoriesCount = getCount(categoriesRes);
        const destinationsCount = getCount(destinationsRes);
        const activitiesCount = getCount(activitiesRes);

        // Total leads count (booking requests + enquiries + manual leads, excluding deleted)
        let leadsCount = null;
        try {
          const bookingList = bookingRes.status === 'fulfilled'
            ? (Array.isArray(bookingRes.value) ? bookingRes.value : bookingRes.value?.data || [])
            : [];
          const enquiriesList = enquiriesRes.status === 'fulfilled'
            ? (Array.isArray(enquiriesRes.value) ? enquiriesRes.value : enquiriesRes.value?.data || [])
            : [];
          const manualList = leadsRes.status === 'fulfilled'
            ? (Array.isArray(leadsRes.value) ? leadsRes.value : leadsRes.value?.data || [])
            : [];

          const activeBookings = bookingList.filter(i => !i.is_deleted || i.is_deleted === 0).length;
          const activeEnquiries = enquiriesList.filter(i => !i.is_deleted || i.is_deleted === 0).length;
          const activeManual = manualList.filter(i => !i.is_deleted || i.is_deleted === 0).length;
          leadsCount = activeBookings + activeEnquiries + activeManual;
        } catch (_) {
          leadsCount = null;
        }

        setStats({ trips: tripsCount, categories: categoriesCount, destinations: destinationsCount, activities: activitiesCount, leads: leadsCount });
      } catch (err) {
        console.error('Dashboard stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const kpiData = [
    {
      title: 'Trip Packages',
      value: stats.trips,
      subtitle: 'Total active trips',
      icon: Package,
      color: 'kpi-card-packages',
      link: '/admin/dashboard/trip-management/list',
      loading,
    },
    {
      title: 'Categories',
      value: stats.categories,
      subtitle: 'Trip categories',
      icon: FileText,
      color: 'kpi-card-activities',
      link: '/admin/dashboard/add-categories',
      loading,
    },
    {
      title: 'Destinations',
      value: stats.destinations,
      subtitle: 'Total destinations',
      icon: Zap,
      color: 'kpi-card-packages',
      link: '/admin/dashboard/add-destination',
      loading,
    },
    {
      title: 'Activities',
      value: stats.activities,
      subtitle: 'Total activities',
      icon: Zap,
      color: 'kpi-card-activities',
      link: '/admin/dashboard/add-activity',
      loading,
    },
    {
      title: 'Total Leads',
      value: stats.leads,
      subtitle: 'Bookings + Enquiries + Manual',
      icon: Users,
      color: 'kpi-card-hotels',
      link: '/admin/dashboard/lead-management',
      loading,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Inventory Overview (KPIs) */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        Inventory Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
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