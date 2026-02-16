import React, { useState, useEffect, useCallback } from 'react';
import UnifiedEnquiryModal from './UnifiedEnquiryModal';

// ✅ FIXED VERSION - Added pageName and pageSlug props
export default function PopupManager({ offersConfig, pageName = null, pageSlug = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPopupType, setCurrentPopupType] = useState(null);
  const [popupsShown, setPopupsShown] = useState({
    entry: false,
    idle: false,
    exit: false
  });

  const popupSettings = offersConfig?.popups || {};

  // Entry Popup - Show on page load
  useEffect(() => {
    if (popupSettings.entry?.enabled && !popupsShown.entry) {
      const timer = setTimeout(() => {
        setCurrentPopupType('entry');
        setIsModalOpen(true);
        setPopupsShown(prev => ({ ...prev, entry: true }));
      }, 1000); // Show after 1 second

      return () => clearTimeout(timer);
    }
  }, [popupSettings.entry?.enabled, popupsShown.entry]);

  // Idle Popup - Show when user reaches 50% of page
  useEffect(() => {
    if (!popupSettings.idle?.enabled || popupsShown.idle) return;

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      
      if (scrollPercentage >= 0.5 && !popupsShown.idle) {
        setCurrentPopupType('idle');
        setIsModalOpen(true);
        setPopupsShown(prev => ({ ...prev, idle: true }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [popupSettings.idle?.enabled, popupsShown.idle]);

  // Exit Popup - Show when user tries to leave or reaches bottom
  useEffect(() => {
    if (!popupSettings.exit?.enabled || popupsShown.exit) return;

    // Exit intent detection (mouse leaving viewport)
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !popupsShown.exit) {
        setCurrentPopupType('exit');
        setIsModalOpen(true);
        setPopupsShown(prev => ({ ...prev, exit: true }));
      }
    };

    // Bottom of page detection
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      
      if (scrollPercentage >= 0.95 && !popupsShown.exit) {
        setCurrentPopupType('exit');
        setIsModalOpen(true);
        setPopupsShown(prev => ({ ...prev, exit: true }));
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [popupSettings.exit?.enabled, popupsShown.exit]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentPopupType(null);
  }, []);

  // ✅ FIXED - Pass pageName and pageSlug to UnifiedEnquiryModal
  return (
    <UnifiedEnquiryModal
      trip={null}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      popupSettings={popupSettings}
      popupType={currentPopupType}
      pageName={pageName}      // ✅ ADDED THIS
      pageSlug={pageSlug}      // ✅ ADDED THIS
    />
  );
}