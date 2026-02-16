import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import './styles/global-theme.css';

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ScrollToTop"; // Add this import

// --- PUBLIC PAGES ---
import Home from "./pages/user/Home/Home";
import TripList from "./pages/user/Trips/TripList";
import TripDetails from "./pages/user/Trips/TripDetails";
import Destinations from "./pages/user/Destinations/Destinations";
import DestinationList from "./pages/user/Destinations/DestinationList";
import Honeymoon from "./pages/user/Category/Honeymoon/HoneymoonDetails";
import Office from "./pages/user/Category/Office/OfficeDetails";
import Family from "./pages/user/Category/Family/FamilyDetails";
import Blog from "./pages/user/Blog/Blog";
import Contact from "./pages/user/Contact/contact";
import About from "./pages/user/About/About";
import Terms from "./pages/user/Terms/Terms";
import Privacy from "./pages/user/Privacy/Privacy";
import CategoryDetails from "./pages/user/Category/CategoryPreview";
import ThankYouPageRoute from "./pages/admin/modules/LandingPageManagement/templates/MinimalTemplate/components/Thankyoupage";

// --- LANDING PAGE ---
import LandingPageRenderer from "./pages/admin/modules/LandingPageManagement/templates/Landingpagerenderer";

// --- ADMIN PAGES & PROTECTED ROUTE COMPONENT ---
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivateRoute from "./pages/admin/components/PrivateRoute";

export default function App() {
  // Hide Header & Footer for Admin pages AND Landing pages
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const isLandingPage = window.location.pathname.startsWith("/landing/");

  return (
    <>
      {/* ScrollToTop Component - Must be inside Router context */}
      <ScrollToTop />

      {/* Header (Public Only - Hide on Admin & Landing Pages) */}
      {!isAdminRoute && !isLandingPage && <Header />}

      <main className="pt-0">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />

          {/* TRIPS */}
          <Route path="/triplist" element={<TripList />} />
          <Route path="/trips" element={<TripDetails />} />
          <Route path="/trip-preview/:slug/:id" element={<TripDetails />} />

          {/* DESTINATIONS */}
          <Route path="/destinations" element={<DestinationList />} />
          <Route path="/destination/:slug/:id" element={<Destinations />} />
          <Route path="/destinfo" element={<Destinations />} />

          {/* CATEGORY ROUTES - Both old and new paths for compatibility */}
          <Route path="/destinfo/honeymoon" element={<Honeymoon />} />
          <Route path="/destinfo/office" element={<Office />} />
          <Route path="/destinfo/family" element={<Family />} />
          <Route path="/category/:slug/:id" element={<CategoryDetails />} />
          <Route path="/category-preview/:slug/:id" element={<CategoryDetails />} />

          {/* BLOG & STATIC PAGES */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* --- LANDING PAGE ROUTE (Public, No Header/Footer) --- */}
          <Route path="/landing/:slug" element={<LandingPageRenderer />} />
            {/* ✅ THANK YOU PAGE ROUTE (FIXED) */}
          <Route path="/thank-you" element={<ThankYouPageRoute />} />
    
          {/* --- ADMIN ROUTES --- */}
          
          {/* 1. Admin Login Page (Publicly accessible) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* 2. Base /admin path redirects directly to the login */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

          {/* 3. Protected Dashboard Routes - All admin routes inside PrivateRoute */}
          <Route element={<PrivateRoute />}>
            {/* The AdminDashboard component handles all nested routes */}
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </main>

      {/* Footer (Public Only - Hide on Admin & Landing Pages) */}
      {!isAdminRoute && !isLandingPage && <Footer />}
    </>
  );
}