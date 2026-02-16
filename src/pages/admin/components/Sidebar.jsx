import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, MapPin, PlusCircle, Layers, Database, 
    Users, DollarSign, FileText, LogOut, Trash2,
    ListTree, Tag, Layout
} from 'lucide-react';
import '../css/Sidebar.css';

const sidebarGroups = [
    {
        title: 'OVERVIEW',
        modules: [
            { name: 'Dashboard', path: '/admin/dashboard/overview', icon: LayoutDashboard },
        ]
    },
    {
        title: 'TRIP MANAGEMENT', 
        modules: [
            { name: 'All Trips', path: '/admin/dashboard/trip-management/list', icon: PlusCircle }, 
            { name: 'Add Destination', path: '/admin/dashboard/add-destination', icon: MapPin },
            { name: 'Add Activity', path: '/admin/dashboard/add-activity', icon: Layers },
            { name: 'Add Categories', path: '/admin/dashboard/add-categories', icon: Database },
        ]
    },
    {
        title: 'BLOG MANAGEMENT',
        modules: [
            { name: 'All Posts', path: '/admin/dashboard/blog/list', icon: FileText },
            { name: 'Add New Post', path: '/admin/dashboard/blog/create', icon: PlusCircle },
            { name: 'Categories', path: '/admin/dashboard/blog/categories', icon: ListTree },
            { name: 'Tags', path: '/admin/dashboard/blog/tags', icon: Tag },
        ]
    },
    {
        title: 'LANDING PAGE MANAGEMENT',
        modules: [
            { name: 'All Pages', path: '/admin/dashboard/landing-pages', icon: Layout },
            { name: 'Create Page', path: '/admin/dashboard/landing-pages/create', icon: PlusCircle },
        ]
    },
    {
        title: 'TRAVEL CRM',
        modules: [
            { name: 'Lead Management', path: '/admin/dashboard/lead-management', icon: Users },
            { name: 'Lead Trash', path: '/admin/dashboard/lead-trash', icon: Trash2 },
            { name: 'Quotation Management', path: '/admin/dashboard/quotations', icon: DollarSign },
            { name: 'Quotation Trash', path: '/admin/dashboard/quotations/trash', icon: Trash2 },
            { name: 'Invoice Management', path: '/admin/dashboard/invoice-management', icon: DollarSign },
        ]
    }
];

export default function Sidebar({ isOpen, toggleSidebar, onLogout }) {
    const location = useLocation();

    const isActive = (path) => {
        if (location.pathname === path) return true;

        if (path === '/admin/dashboard/add-destination' &&
            location.pathname.startsWith('/admin/dashboard/destination-create')) {
            return true;
        }

        if (path === '/admin/dashboard/trip-management/list' &&
            location.pathname.startsWith('/admin/dashboard/trip-management/create')) {
            return true;
        }

        if (path === '/admin/dashboard/blog/list' && 
            location.pathname.startsWith('/admin/dashboard/blog/create')) {
            return true;
        }

        // Landing Pages active state
        if (path === '/admin/dashboard/landing-pages' && 
            (location.pathname.startsWith('/admin/dashboard/landing-pages/edit') ||
             location.pathname.startsWith('/admin/dashboard/landing-pages/create'))) {
            return true;
        }

        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                />
            )}

            <div className={`sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {/* LOGO SECTION */}
                <div className="sidebar-header">
                    <div className="sidebar-logo-wrapper">
                        <a href="/" className="sidebar-logo-link">
                            <img 
                                src="/holidaysplanners-logo.png" 
                                alt="Holidays Planners" 
                                className="sidebar-logo"
                            />
                        </a>
                    </div>
                </div>

                {/* NAVIGATION MENU */}
                <nav className="sidebar-menu">
                    {sidebarGroups.map(group => (
                        <div key={group.title} className="menu-group">
                            <div className="menu-group-title">
                                {isOpen ? group.title : group.title.split(' ').map(w => w.charAt(0)).join('')}
                            </div>

                            {group.modules.map(module => (
                                <Link
                                    key={module.path}
                                    to={module.path}
                                    className={`menu-item ${isActive(module.path) ? 'active' : ''}`}
                                    title={!isOpen ? module.name : ''}
                                >
                                    <module.icon className="menu-icon" />
                                    {isOpen && <span className="menu-item-text">{module.name}</span>}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* LOGOUT BUTTON */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={onLogout} title="Logout">
                        <LogOut className="menu-icon" />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </>
    );
}