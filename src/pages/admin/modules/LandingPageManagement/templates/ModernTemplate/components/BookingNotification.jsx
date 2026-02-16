import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';

export default function BookingNotification({ pageSlug, pageData }) {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [config, setConfig] = useState({
    enabled: true,
    display_duration: 5,
    interval_between: 10,
    position: 'bottom-left',
    show_on_mobile: true
  });

  // Process page data (either from prop or API)
  useEffect(() => {
    console.log('🔔 BookingNotification Component Mounted');
    console.log('📍 Page Slug:', pageSlug);
    console.log('📦 Page Data Prop:', pageData);

    // If pageData is provided directly, use it
    if (pageData) {
      console.log('✅ Using pageData prop directly');
      processLiveNotifications(pageData);
      return;
    }

    // Otherwise fetch from API using slug
    if (pageSlug) {
      console.log('🌐 Fetching data from API...');
      fetchLandingPageData();
    } else {
      console.warn('⚠️ No pageSlug or pageData provided to BookingNotification');
    }
  }, [pageSlug, pageData]);

  const processLiveNotifications = (data) => {
    console.log('🔍 Processing Live Notifications from data:', data);
    
    if (data.live_notifications) {
      const liveNotifs = data.live_notifications;
      console.log('🔔 Live Notifications Config:', liveNotifs);
      
      const newConfig = {
        enabled: liveNotifs.enabled !== undefined ? liveNotifs.enabled : true,
        display_duration: liveNotifs.display_duration || 5,
        interval_between: liveNotifs.interval_between || 10,
        position: liveNotifs.position || 'bottom-left',
        show_on_mobile: liveNotifs.show_on_mobile !== undefined ? liveNotifs.show_on_mobile : true
      };
      
      console.log('⚙️ Config Set To:', newConfig);
      setConfig(newConfig);
      
      // Set notifications array
      if (liveNotifs.notifications && Array.isArray(liveNotifs.notifications) && liveNotifs.notifications.length > 0) {
        console.log('📋 Notifications Array:', liveNotifs.notifications);
        console.log('✅ Total Notifications:', liveNotifs.notifications.length);
        setNotifications(liveNotifs.notifications);
      } else {
        console.warn('⚠️ No notifications found in array or array is empty');
        console.warn('   Notifications value:', liveNotifs.notifications);
      }
    } else {
      console.warn('⚠️ No live_notifications field in page data');
    }
  };

  const fetchLandingPageData = async () => {
    try {
      const url = `${API_BASE_URL}/landing-pages/${pageSlug}`;
      console.log('🌐 Fetching from:', url);
      
      const response = await fetch(url, {
        headers: { 'x-api-key': API_KEY }
      });
      
      console.log('📡 Response Status:', response.status);
      
      if (!response.ok) {
        console.error('❌ Failed to fetch landing page data');
        return;
      }
      
      const data = await response.json();
      console.log('📦 Full API Response:', data);
      
      const pageDataFromApi = data.data || data;
      processLiveNotifications(pageDataFromApi);
    } catch (error) {
      console.error('💥 Error fetching landing page data:', error);
    }
  };

  // Show notifications at configured intervals
  useEffect(() => {
    console.log('⏰ Notification Timer Effect Triggered');
    console.log('   - Enabled:', config.enabled);
    console.log('   - Notifications Count:', notifications.length);
    console.log('   - Show on Mobile:', config.show_on_mobile);
    console.log('   - Window Width:', window.innerWidth);
    
    // Don't show notifications if disabled or no notifications available
    if (!config.enabled) {
      console.warn('❌ Notifications DISABLED in config');
      return;
    }
    
    if (notifications.length === 0) {
      console.warn('❌ No notifications available to show');
      return;
    }

    // Check if we should hide on mobile
    if (!config.show_on_mobile && window.innerWidth < 768) {
      console.warn('❌ Mobile display disabled and on mobile device');
      return;
    }

    console.log('✅ All checks passed, setting up notification timers');
    console.log('   - Display Duration:', config.display_duration, 'seconds');
    console.log('   - Interval Between:', config.interval_between, 'seconds');

    const showNotification = () => {
      const notif = notifications[notificationIndex];
      console.log('🎉 Showing Notification:', notif);
      setCurrentNotification(notif);
      setNotificationIndex((prev) => (prev + 1) % notifications.length);
      
      // Hide after configured duration (convert to milliseconds)
      setTimeout(() => {
        console.log('👋 Hiding notification after', config.display_duration, 'seconds');
        setCurrentNotification(null);
      }, config.display_duration * 1000);
    };

    // Show first notification after 3 seconds
    console.log('⏱️ Initial notification will show in 3 seconds');
    const initialTimeout = setTimeout(() => {
      console.log('🚀 Showing FIRST notification');
      showNotification();
    }, 3000);
    
    // Then show every interval_between seconds
    console.log('⏱️ Subsequent notifications every', config.interval_between, 'seconds');
    const interval = setInterval(() => {
      console.log('🔄 Showing NEXT notification');
      showNotification();
    }, config.interval_between * 1000);

    return () => {
      console.log('🧹 Cleaning up notification timers');
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [notificationIndex, notifications, config]);

  // Determine position classes
  const getPositionClasses = () => {
    switch (config.position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      default:
        return 'bottom-6 left-6';
    }
  };

  // Don't render if disabled
  if (!config.enabled) {
    console.log('🚫 Not rendering notification component - DISABLED');
    return null;
  }

  if (notifications.length === 0) {
    console.log('🚫 Not rendering notification component - NO NOTIFICATIONS');
    return null;
  }

  // Hide on mobile if configured
  if (!config.show_on_mobile && window.innerWidth < 768) {
    console.log('🚫 Not rendering on mobile (disabled in config)');
    return null;
  }

  console.log('✨ Component ready to show notifications. Current:', currentNotification);

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ x: config.position.includes('right') ? 400 : -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: config.position.includes('right') ? 400 : -400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className={`fixed ${getPositionClasses()} z-50 max-w-sm`}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB800] flex items-center justify-center text-white font-bold text-lg">
                {currentNotification.name?.charAt(0) || '?'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
                {currentNotification.location && (
                  <>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {currentNotification.location}
                    </span>
                    {currentNotification.time && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>{currentNotification.time}</span>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {currentNotification.name || 'Someone'} just booked
              </div>
              {currentNotification.destination && (
                <div className="text-[#FF6B35] font-bold text-xs mt-0.5 line-clamp-1">
                  {currentNotification.destination}
                </div>
              )}
            </div>

            {/* Close button */}
            <button 
              onClick={() => setCurrentNotification(null)}
              className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>

          {/* Pulse ring animation behind the card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0.2 }}
            animate={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-[#FF6B35]/10 rounded-2xl -z-10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}