// src/components/PrivateRoute.jsx (or pages/admin/components/PrivateRoute.jsx)
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Enforces admin-level authentication for all nested routes.
 * Redirects unauthenticated users to the login page.
 */
export default function PrivateRoute() {
  // Check for the stored API Key. This key is set upon successful login.
  const adminApiKey = localStorage.getItem('admin_api_key');
  const isAuthenticated = !!adminApiKey;

  if (!isAuthenticated) {
    // If the key is missing (not logged in), redirect to the login page.
    // 'replace' ensures the user cannot press the back button to view the restricted page.
    console.warn("Unauthorized access attempt. Redirecting to admin login.");
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render the children (the dashboard or its modules).
  return <Outlet />;
}