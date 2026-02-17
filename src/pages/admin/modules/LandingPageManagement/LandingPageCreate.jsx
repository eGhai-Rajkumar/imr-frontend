import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// React Icons - Multiple Icon Packs
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io5';
import * as RiIcons from 'react-icons/ri';
import * as HiIcons from 'react-icons/hi2';

// Rich Text Editor
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Template Imports
import ModernTemplate from './templates/ModernTemplate/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate/MinimalTemplate';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const UPLOAD_URL = 'https://api.yaadigo.com/upload';
const MULTIPLE_UPLOAD_URL = 'https://api.yaadigo.com/multiple';

// File Size Limits (in Bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

// =============================================================================
// REACT ICONS CONFIGURATION
// =============================================================================

const ICON_PACKS = {
  fa: FaIcons,
  md: MdIcons,
  gi: GiIcons,
  ai: AiIcons,
  bs: BsIcons,
  io: IoIcons,
  ri: RiIcons,
  hi: HiIcons,
};

// Flatten all icons into searchable array
const ALL_ICONS = Object.entries(ICON_PACKS).flatMap(([pack, icons]) =>
  Object.entries(icons).map(([name, Component]) => ({
    key: `${pack}:${name}`,
    name,
    pack,
    Component,
  }))
);

// Create icon library lookup for rendering
const ICON_LIBRARY = {};
ALL_ICONS.forEach(({ key, Component }) => {
  ICON_LIBRARY[key] = Component;
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Determines video type from URL
 */
const getVideoType = (url) => {
  if (!url) return 'unknown';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.match(/\.(mp4|webm|ogg|mov)$/)) return 'file';
  return 'unknown';
};

/**
 * Converts YouTube URL to embed format
 */
const getYouTubeEmbedUrl = (url) => {
  try {
    let videoId = null;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch (e) {
    return url;
  }
};

// =============================================================================
// MEDIA MANAGER COMPONENT
// Handles drag-and-drop sorting, URL input, and file uploads
// =============================================================================

const MediaManager = ({ items = [], onUpdate, type = 'image', label = 'Media', onUploadTrigger }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Handle drag-and-drop reordering
  const handleSort = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newItems = [...items];
    const item = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(index, 0, item);

    setDraggedItem(index);
    onUpdate(newItems);
  };

  // Add media via URL
  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onUpdate([...items, urlInput.trim()]);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Existing Media Items */}
        {items.map((url, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => setDraggedItem(idx)}
            onDragOver={(e) => handleSort(e, idx)}
            onDragEnd={() => setDraggedItem(null)}
            className={`relative group aspect-${type === 'image' ? 'square' : 'video'} rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 cursor-move hover:border-blue-400 transition-all ${draggedItem === idx ? 'opacity-50' : 'opacity-100'}`}
          >
            {/* Media Preview */}
            {type === 'image' ? (
              <img src={url} className="w-full h-full object-cover pointer-events-none" alt="media" />
            ) : (
              getVideoType(url) === 'youtube' ? (
                <iframe src={getYouTubeEmbedUrl(url)} className="w-full h-full pointer-events-none" title="video" frameBorder="0" />
              ) : (
                <video src={url} className="w-full h-full object-cover pointer-events-none" />
              )
            )}

            {/* Hover Controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white/70 text-xs">⋮⋮</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(items.filter((_, i) => i !== idx));
                }}
                className="bg-red-500 p-1.5 rounded-full text-white hover:scale-110 transition-transform"
                title="Remove"
              >
                ✕
              </button>
            </div>

            {/* Index Badge */}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono shadow-sm">
              {idx + 1}
            </div>
          </div>
        ))}

        {/* Add New Media Button */}
        <div className={`aspect-${type === 'image' ? 'square' : 'video'} border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors p-4 bg-white`}>
          {showUrlInput ? (
            <div className="w-full flex flex-col gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={type === 'video' ? "YouTube / MP4 URL..." : "Image URL..."}
                className="w-full text-xs p-2 border rounded"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleAddUrl} className="flex-1 bg-blue-600 text-white text-xs py-1 rounded font-bold hover:bg-blue-700">Add</button>
                <button onClick={() => setShowUrlInput(false)} className="bg-slate-200 text-slate-600 text-xs px-2 rounded hover:bg-slate-300">✕</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-400 uppercase text-center">Add {label}</p>
              <div className="flex gap-2">
                <button
                  onClick={onUploadTrigger}
                  className="bg-blue-50 text-blue-600 p-2.5 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Upload File"
                >
                  ⬆
                </button>
                <button
                  onClick={() => setShowUrlInput(true)}
                  className="bg-purple-50 text-purple-600 p-2.5 rounded-lg hover:bg-purple-100 transition-colors"
                  title="Add via URL"
                >
                  🌐
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function LandingPageCreate() {
  const navigate = useNavigate();
  const { id } = useParams();

  // -------------------------------------------------------------------------
  // UI STATE
  // -------------------------------------------------------------------------
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [activePackageTab, setActivePackageTab] = useState('trips');

  // Icon Picker State
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(null);
  const [iconSearch, setIconSearch] = useState('');

  // Trip Selection State
  const [availableTrips, setAvailableTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [tripSearchQuery, setTripSearchQuery] = useState('');
  const [showTripDropdown, setShowTripDropdown] = useState(false);

  // Custom Package Trip Selector State
  const [customPackageQuery, setCustomPackageQuery] = useState('');
  const [showCustomPackageDropdown, setShowCustomPackageDropdown] = useState(null);

  // Temporary State for Adding Notifications (Pydantic fix)
  const [tempNotification, setTempNotification] = useState({
    name: '',
    location: '',
    destination: '',
    time: ''
  });

  // -------------------------------------------------------------------------
  // FORM DATA STATE
  // -------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    page_name: '',
    slug: '',
    template: 'template-three',
    is_active: true,



    // Company Information
    company: {
      name: '',
      tagline: '',
      logo: '',
      emails: [],
      phones: [],
      addresses: [],
      social_media: [],
      business_hours: ""
    },

    // About Us Section
    company_about: {
      section_title: "About Us",
      section_subtitle: "Your Trusted Travel Partner",
      logo: "",
      heading: "Crafting Unforgettable Journeys",
      tagline: "Since 2015",
      description: "",
      highlights: [],
      team_members: [],
      show_section: true
    },

    // Live Notifications
    live_notifications: {
      enabled: true,
      notifications: [],
      display_duration: 5,
      interval_between: 10,
      position: "bottom-left",
      show_on_mobile: true
    },

    // SEO Settings
    seo: {
      meta_title: '',
      meta_description: '',
      meta_tags: '',
      og_image: ''
    },

    // Custom Scripts & Tracking Codes
    custom_scripts: {
      head: {
        enabled: false,
        content: ''
      },
      body_start: {
        enabled: false,
        content: ''
      },
      body_end: {
        enabled: false,
        content: ''
      }
    },

    // Hero Section
    hero: {
      title: '',
      subtitle: '',
      description: '',
      cta_button_1: { text: 'Explore Destinations', link: '#packages', style: 'primary' },
      cta_button_2: { text: 'Get Quote', link: '#contact', style: 'secondary' },
      background_type: 'slider',
      background_images: [],
      background_videos: [],
      overlay_opacity: 0.4
    },

    // Packages Section
    packages: {
      section_title: 'Popular Tour Packages',
      section_subtitle: 'Explore our hand-picked packages',
      selected_trips: [],
      custom_packages: [],
      show_section: true
    },

    // Attractions Section
    attractions: {
      section_title: 'Top Attractions',
      section_subtitle: 'Must-visit places',
      items: [],
      show_section: true
    },

    // Gallery Section
    gallery: {
      section_title: 'Photo Gallery',
      section_subtitle: 'Captured moments',
      images: [],
      videos: [],
      show_section: true
    },

    // Testimonials Section
    testimonials: {
      section_title: 'What Our Travelers Say',
      section_subtitle: 'Real experiences',
      items: [],
      show_section: true
    },

    // FAQs Section
    faqs: {
      section_title: 'Frequently Asked Questions',
      section_subtitle: 'Everything you need to know',
      items: [],
      show_section: true
    },

    // Travel Guidelines Section
    travel_guidelines: {
      section_title: 'Travel Guidelines',
      section_subtitle: 'Important information',
      description: '',
      show_section: true
    },

    // Offers Section
    offers: {
      start_date: '',
      end_date: '',
      header: {
        enabled: false,
        text: '',
        background_color: '#3B82F6',
        text_color: '#FFFFFF'
      },
      footer: {
        enabled: false,
        text: '',
        background_color: '#1F2937',
        text_color: '#FFFFFF'
      },
      mid_section: { enabled: false, type: 'image', media_urls: [] },
      popups: {
        entry: { enabled: false, title: '', description: '', image: '', cta_text: 'Get Offer', cta_link: '' },
        exit: { enabled: false, title: '', description: '', image: '', cta_text: 'Get Offer', cta_link: '' },
        idle: { enabled: false, title: '', description: '', image: '', cta_text: 'Get Offer', cta_link: '' }
      }
    }
  });

  // -------------------------------------------------------------------------
  // NAVIGATION STEPS CONFIGURATION
  // -------------------------------------------------------------------------
  const steps = [
    { id: 'general', label: 'General Info', icon: 'ℹ️' },
    { id: 'template', label: 'Template', icon: '📐' },
    // { id: 'theme', label: 'Theme Colors', icon: '🎨' },
    { id: 'hero', label: 'Hero Section', icon: '✨' },
    // { id: 'about', label: 'About Us', icon: '👥' },
    { id: 'packages', label: 'Trip Packages', icon: '📦' },
    { id: 'attractions', label: 'Attractions', icon: '📍' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
    { id: 'faqs', label: 'FAQs', icon: '❓' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'guidelines', label: 'Guidelines', icon: '📖' },
    { id: 'offers', label: 'Offers', icon: '🏷️' }
  ];

  const templateMap = {
    'template-one': 'Minimal',
    // 'template-two': 'Classic',
    'template-three': 'Modern'
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ]
  };

  // -------------------------------------------------------------------------
  // EFFECTS
  // -------------------------------------------------------------------------

  // Initial data fetch
  useEffect(() => {
    fetchTrips();
    if (id) fetchLandingPage(id);
  }, [id]);

  // Auto-generate slug from page name
  useEffect(() => {
    if (formData.page_name && !id) {
      const slug = formData.page_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.page_name, id]);

  // Filter trips based on search
  useEffect(() => {
    if (tripSearchQuery) {
      const filtered = availableTrips.filter(trip =>
        trip.title?.toLowerCase().includes(tripSearchQuery.toLowerCase()) ||
        trip.destination?.toLowerCase().includes(tripSearchQuery.toLowerCase())
      );
      setFilteredTrips(filtered);
    } else {
      setFilteredTrips(availableTrips);
    }
  }, [tripSearchQuery, availableTrips]);

  // -------------------------------------------------------------------------
  // API FUNCTIONS
  // -------------------------------------------------------------------------

  /**
   * Fetch available trips from API
   */
  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trips`, { headers: { 'x-api-key': API_KEY } });
      const data = await response.json();
      setAvailableTrips(data.data || data);
      setFilteredTrips(data.data || data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  /**
   * Fetch existing landing page data for editing
   */
  const fetchLandingPage = async (pageId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages/${pageId}`, {
        headers: { 'x-api-key': API_KEY }
      });

      if (!response.ok) throw new Error('Failed to fetch landing page');

      const data = await response.json();
      const pageData = data.data || data;

      // Helper function to ensure arrays
      const ensureArray = (value) => {
        if (Array.isArray(value)) return value;
        if (value === null || value === undefined) return [];
        return [];
      };

      setFormData(prev => ({
        ...prev,
        ...pageData,
        company: {
          ...prev.company,
          ...(pageData.company || {}),
          emails: ensureArray(pageData.company?.emails),
          phones: ensureArray(pageData.company?.phones),
          addresses: ensureArray(pageData.company?.addresses),
          social_media: ensureArray(pageData.company?.social_media),
        },
        theme_colors: {
          ...prev.theme_colors,
          ...(pageData.theme_colors || {})
        },
        company_about: {
          ...prev.company_about,
          ...(pageData.company_about || {}),
          highlights: ensureArray(pageData.company_about?.highlights),
          team_members: ensureArray(pageData.company_about?.team_members),
        },
        packages: {
          ...prev.packages,
          ...(pageData.packages || {}),
          selected_trips: ensureArray(pageData.packages?.selected_trips),
          custom_packages: ensureArray(pageData.packages?.custom_packages),
        },
        live_notifications: {
          ...prev.live_notifications,
          ...(pageData.live_notifications || {}),
          notifications: ensureArray(pageData.live_notifications?.notifications),
        },
        seo: {
          ...prev.seo,
          ...(pageData.seo || {})
        },
        custom_scripts: {
          ...prev.custom_scripts,
          ...(pageData.custom_scripts || {}),
          head: {
            ...prev.custom_scripts.head,
            ...(pageData.custom_scripts?.head || {})
          },
          body_start: {
            ...prev.custom_scripts.body_start,
            ...(pageData.custom_scripts?.body_start || {})
          },
          body_end: {
            ...prev.custom_scripts.body_end,
            ...(pageData.custom_scripts?.body_end || {})
          }
        },
        hero: {
          ...prev.hero,
          ...(pageData.hero || {}),
          background_images: ensureArray(pageData.hero?.background_images),
          background_videos: ensureArray(pageData.hero?.background_videos),
        },
        attractions: {
          ...prev.attractions,
          ...(pageData.attractions || {}),
          items: ensureArray(pageData.attractions?.items),
        },
        gallery: {
          ...prev.gallery,
          ...(pageData.gallery || {}),
          images: ensureArray(pageData.gallery?.images),
          videos: ensureArray(pageData.gallery?.videos),
        },
        testimonials: {
          ...prev.testimonials,
          ...(pageData.testimonials || {}),
          items: ensureArray(pageData.testimonials?.items),
        },
        faqs: {
          ...prev.faqs,
          ...(pageData.faqs || {}),
          items: ensureArray(pageData.faqs?.items),
        },
        offers: {
          ...prev.offers,
          ...(pageData.offers || {}),
          mid_section: {
            ...prev.offers.mid_section,
            ...(pageData.offers?.mid_section || {}),
            media_urls: ensureArray(pageData.offers?.mid_section?.media_urls),
          }
        }
      }));
    } catch (error) {
      console.error('Error loading page:', error);
      alert('Error loading landing page data');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // STATE UPDATE HANDLERS
  // -------------------------------------------------------------------------

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleNestedChange = (parent, field, value) => setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
  const handleDeepNestedChange = (parent, child, field, value) => setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: { ...prev[parent][child], [field]: value } } }));

  const handleArrayItemChange = (parent, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], items: prev[parent].items.map((item, i) => i === index ? { ...item, [field]: value } : item) }
    }));
  };

  const addArrayItem = (parent, newItem) => setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], items: [...prev[parent].items, newItem] } }));
  const removeArrayItem = (parent, index) => setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], items: prev[parent].items.filter((_, i) => i !== index) } }));

  // Generic Array Handlers
  const handleGenericArrayChange = (parentKey, arrayKey, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[parentKey][arrayKey]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [parentKey]: { ...prev[parentKey], [arrayKey]: newArray } };
    });
  };

  const addGenericArrayItem = (parentKey, arrayKey, newItem) => {
    setFormData(prev => ({ ...prev, [parentKey]: { ...prev[parentKey], [arrayKey]: [...prev[parentKey][arrayKey], newItem] } }));
  };

  const removeGenericArrayItem = (parentKey, arrayKey, index) => {
    setFormData(prev => ({ ...prev, [parentKey]: { ...prev[parentKey], [arrayKey]: prev[parentKey][arrayKey].filter((_, i) => i !== index) } }));
  };

  // -------------------------------------------------------------------------
  // FILE UPLOAD HANDLERS
  // -------------------------------------------------------------------------

  /**
   * Check if file size is within limits
   */
  const checkFileSize = (file, type) => {
    const limit = type === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const limitMB = limit / (1024 * 1024);
    if (file.size > limit) {
      alert(`File "${file.name}" exceeds the ${limitMB}MB limit for ${type}s.`);
      return false;
    }
    return true;
  };

  /**
   * Upload single file to server
   */
  const uploadSingleFile = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    fd.append('storage', 'local');
    try {
      const response = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return (data.message === 'Upload successful' || data.url) ? data.url : null;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  /**
   * Upload multiple files to server
   */
  const uploadMultipleFiles = async (files) => {
    const fd = new FormData();
    Array.from(files).forEach(file => fd.append('gallery_images', file));
    fd.append('storage', 'local');
    try {
      const response = await fetch(MULTIPLE_UPLOAD_URL, { method: 'POST', body: fd });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return (data.message === 'Files uploaded' && data.files) ? (Array.isArray(data.files) ? data.files.flat() : [data.files]) : [];
    } catch (error) {
      console.error('Upload error:', error);
      return [];
    }
  };

  /**
   * Handle single file upload with validation
   */
  const handleFileUpload = async (file, callback, type = 'image') => {
    if (!file || !checkFileSize(file, type)) return;
    setUploadingFiles(true);
    const url = await uploadSingleFile(file);
    setUploadingFiles(false);
    if (url) callback(url);
  };

  /**
   * Handle multiple files upload with validation
   */
  const handleMultipleFileUpload = async (files, callback, type = 'image') => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(f => checkFileSize(f, type));
    if (validFiles.length === 0) return;

    setUploadingFiles(true);
    const urls = await uploadMultipleFiles(validFiles);
    setUploadingFiles(false);
    if (urls && urls.length > 0) callback(urls);
  };

  // -------------------------------------------------------------------------
  // FORM VALIDATION & SAVE
  // -------------------------------------------------------------------------

  /**
   * Validate form data before submission
   */
  const validateForm = () => {
    const errors = {};
    if (!formData.page_name?.trim()) errors.page_name = 'Page name is required';
    if (!formData.slug?.trim()) errors.slug = 'URL slug is required';
    else if (!/^[a-z0-9-]+$/.test(formData.slug)) errors.slug = 'Invalid slug format';
    if (!formData.hero?.title?.trim()) errors.hero_title = 'Hero title is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Save landing page data to API
   */
  const handleSave = async (shouldRedirect = true) => {
    setIsSaving(true);
    try {
      const url = id ? `${API_BASE_URL}/landing-pages/${id}/` : `${API_BASE_URL}/landing-pages/`;
      const method = id ? 'PUT' : 'POST';

      const payload = { ...formData };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Failed to save');
      }

      // For first save (create mode), always redirect to avoid duplicate slug issues
      if (!id || shouldRedirect) {
        alert(id ? 'Updated successfully!' : 'Created successfully!');
        navigate('/admin/dashboard/landing-pages');
      } else {
        // Only show toast if in edit mode
        const toast = document.getElementById('save-toast');
        if (toast) {
          toast.classList.remove('-translate-y-24', 'opacity-0');
          setTimeout(() => toast.classList.add('-translate-y-24', 'opacity-0'), 3000);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // UI HELPER FUNCTIONS
  // -------------------------------------------------------------------------

  /**
   * Get formatted price display for a trip
   */
  const getTripPriceDisplay = (trip) => {
    if (!trip) return 'N/A';
    if (trip.pricing_model === 'custom' || trip.pricing_model === 'customized' || trip.is_custom) {
      const basePrice = trip.pricing?.customized?.base_price || trip.base_price || trip.price;
      return basePrice ? `Starting from ₹${basePrice}` : 'Price on Request';
    }
    const price = trip.pricing?.fixed_departure?.[0]?.price || trip.price || trip.base_price;
    return price ? `₹${price}` : 'Price on Request';
  };

  /**
   * Render template preview based on selection
   */
  const renderTemplatePreview = () => {
    switch (formData.template) {
      case 'template-one':
        return <MinimalTemplate pageData={formData} />; // Map 'template-one' to Minimal
      case 'template-three':
        return <ModernTemplate pageData={formData} />;
      default:
        return <div className="p-20 text-center text-slate-500">Preview not available</div>;
    }
  };

  /**
   * Section header component
   */
  const SectionHeader = ({ title }) => (
    <div className="flex justify-between items-center border-b pb-4 mb-6">
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
  );

  // -------------------------------------------------------------------------
  // RENDER LOADING STATE
  // -------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="p-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MAIN RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans relative">

      {/* Success Toast Notification */}
      <div id="save-toast" className="fixed top-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl transform -translate-y-24 opacity-0 transition-all duration-300 z-[100] flex items-center gap-3">
        <span>✓</span> <span>Changes Saved Successfully!</span>
      </div>

      {/* =================================================================== */}
      {/* ICON PICKER MODAL */}
      {/* =================================================================== */}
      {showIconPicker && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] shadow-2xl flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h3 className="font-bold text-lg">Select Icon</h3>
              <button onClick={() => setShowIconPicker(false)}>
                <span className="text-slate-500 hover:text-red-500 text-xl">✕</span>
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search icons (plane, hotel, user, star...)"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value.toLowerCase())}
              />
            </div>

            {/* Icon Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-4 custom-scrollbar">
              {ALL_ICONS
                .filter(i => i.name.toLowerCase().includes(iconSearch))
                .map(({ key, Component, name }) => (
                  <button
                    key={key}
                    onClick={() => {
                      handleGenericArrayChange(
                        'company_about',
                        'highlights',
                        activeHighlightIndex,
                        'icon',
                        key
                      );
                      setShowIconPicker(false);
                    }}
                    className="flex flex-col items-center gap-1 p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all"
                  >
                    <Component className="w-6 h-6 text-slate-700" />
                    <span className="text-[9px] text-slate-400 truncate w-full text-center">
                      {name}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PREVIEW MODAL */}
      {/* =================================================================== */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-20 shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowPreview(false)} className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors font-bold text-lg">
                <span>←</span> Back to Editor
              </button>
              <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
              <span className="text-slate-400 text-sm hidden sm:block">Previewing: <span className="text-white">{formData.page_name || 'Untitled Page'}</span></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">{templateMap[formData.template]} Mode</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar relative">
            {renderTemplatePreview()}
            <button onClick={() => setShowPreview(false)} className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-black hover:scale-105 transition-all z-50">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress Indicator */}
      {uploadingFiles && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Uploading files...</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* PAGE HEADER */}
      {/* =================================================================== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{id ? 'Edit Landing Page' : 'Create Landing Page'}</h1>
          <p className="text-slate-500 mt-1">Design a high-converting travel experience</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPreview(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-slate-50 hover:text-blue-600 font-bold transition-all">
            <span>👁️</span> Preview
          </button>
          <button onClick={() => navigate('/admin/dashboard/landing-pages')} className="border bg-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 shadow-sm text-slate-700">
            <span>←</span> Back
          </button>
          <button onClick={() => handleSave(true)} disabled={isSaving || uploadingFiles} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50">
            <span>💾</span> Save & Submit
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MAIN LAYOUT GRID */}
      {/* =================================================================== */}
      <div className="grid grid-cols-12 gap-8">

        {/* LEFT SIDEBAR - NAVIGATION */}
        <div className="col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border sticky top-6 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white">
              <h3 className="font-semibold text-white">Page Configurator</h3>
            </div>
            <div className="p-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-left transition-all ${currentStep === index ? 'bg-blue-50 text-blue-600 font-bold shadow-inner' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className="text-xl">{step.icon}</span>
                  <span className="text-sm">{step.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="col-span-9 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-8 min-h-[600px]">

            {/* =========================================================== */}
            {/* STEP 0: GENERAL INFO & COMPANY */}
            {/* =========================================================== */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <SectionHeader title="General Settings" />
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Page Name *</label>
                    <input
                      type="text"
                      value={formData.page_name}
                      onChange={(e) => handleChange('page_name', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg ${validationErrors.page_name ? 'border-red-500' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleChange('slug', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg ${validationErrors.slug ? 'border-red-500' : ''}`}
                    />
                  </div>
                </div>

                {/* Company Information */}
                <h4 className="font-bold border-b pb-2 mt-6">Company Information</h4>
                <div className="grid grid-cols-2 gap-6">
                  <input
                    type="text"
                    value={formData.company.name}
                    onChange={(e) => handleNestedChange('company', 'name', e.target.value)}
                    placeholder="Company Name"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={formData.company.tagline}
                    onChange={(e) => handleNestedChange('company', 'tagline', e.target.value)}
                    placeholder="Tagline"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={formData.company.business_hours}
                    onChange={(e) => handleNestedChange('company', 'business_hours', e.target.value)}
                    placeholder="Business Hours"
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  {/* Logo Upload */}
                  <div className="flex gap-4 items-start col-span-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.company.logo}
                        onChange={(e) => handleNestedChange('company', 'logo', e.target.value)}
                        placeholder="Logo URL"
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                      />
                      <button
                        onClick={() => document.getElementById('company-logo-upload').click()}
                        className="bg-slate-100 px-4 py-2 rounded border flex items-center gap-2"
                      >
                        <span>⬆</span> Upload Logo
                      </button>
                      <input
                        id="company-logo-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files[0], (url) => handleNestedChange('company', 'logo', url))}
                      />
                    </div>
                    {formData.company.logo && (
                      <div className="relative w-32 h-32 border rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden group shadow-sm">
                        <img src={formData.company.logo} alt="logo" className="w-full h-full object-contain p-2" />
                        <button
                          onClick={() => handleNestedChange('company', 'logo', '')}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          ❌
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Addresses */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">Email Addresses</label>
                    <button
                      onClick={() => addGenericArrayItem('company', 'emails', { type: 'email', value: '', label: '', is_primary: false })}
                      className="text-blue-600 text-xs font-bold flex items-center gap-1"
                    >
                      <span>+</span> Add Email
                    </button>
                  </div>
                  {formData.company.emails.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="email"
                        value={item.value}
                        onChange={(e) => handleGenericArrayChange('company', 'emails', idx, 'value', e.target.value)}
                        placeholder="Email Address"
                        className="flex-1 px-3 py-2 border rounded text-sm"
                      />
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleGenericArrayChange('company', 'emails', idx, 'label', e.target.value)}
                        placeholder="Label (e.g. Support)"
                        className="w-1/3 px-3 py-2 border rounded text-sm"
                      />
                      <button
                        onClick={() => removeGenericArrayItem('company', 'emails', idx)}
                        className="text-red-500 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                {/* Phone Numbers */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">Phone Numbers</label>
                    <button
                      onClick={() => addGenericArrayItem('company', 'phones', { type: 'phone', value: '', label: '', is_primary: false })}
                      className="text-blue-600 text-xs font-bold flex items-center gap-1"
                    >
                      <span>+</span> Add Phone
                    </button>
                  </div>
                  {formData.company.phones.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleGenericArrayChange('company', 'phones', idx, 'value', e.target.value)}
                        placeholder="Phone Number"
                        className="flex-1 px-3 py-2 border rounded text-sm"
                      />
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleGenericArrayChange('company', 'phones', idx, 'label', e.target.value)}
                        placeholder="Label (e.g. Sales)"
                        className="w-1/3 px-3 py-2 border rounded text-sm"
                      />
                      <button
                        onClick={() => removeGenericArrayItem('company', 'phones', idx)}
                        className="text-red-500 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                {/* Addresses */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">Addresses</label>
                    <button
                      onClick={() => addGenericArrayItem('company', 'addresses', { label: 'Head Office', street: '', city: '', state: '', country: '', postal_code: '', is_primary: false })}
                      className="text-blue-600 text-xs font-bold flex items-center gap-1"
                    >
                      <span>+</span> Add Address
                    </button>
                  </div>
                  {formData.company.addresses.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded border space-y-2 relative group">
                      <button
                        onClick={() => removeGenericArrayItem('company', 'addresses', idx)}
                        className="absolute top-2 right-2 text-red-500"
                      >
                        ❌
                      </button>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => handleGenericArrayChange('company', 'addresses', idx, 'label', e.target.value)}
                          placeholder="Label (e.g. Branch)"
                          className="w-full px-3 py-1 border rounded text-sm font-bold"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={item.is_primary}
                            onChange={(e) => handleGenericArrayChange('company', 'addresses', idx, 'is_primary', e.target.checked)}
                          />
                          <span className="text-xs">Primary Address</span>
                        </div>
                      </div>
                      <textarea
                        value={item.street}
                        onChange={(e) => handleGenericArrayChange('company', 'addresses', idx, 'street', e.target.value)}
                        placeholder="Full Address..."
                        className="w-full px-3 py-2 border rounded text-sm"
                        rows={2}
                      />
                      <input
                        type="text"
                        value={item.map_link}
                        onChange={(e) => handleGenericArrayChange('company', 'addresses', idx, 'map_link', e.target.value)}
                        placeholder="Google Maps Link"
                        className="w-full px-3 py-1 border rounded text-sm text-blue-600"
                      />
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">Social Media Links</label>
                    <button
                      onClick={() => addGenericArrayItem('company', 'social_media', { platform: 'facebook', url: '', icon: '' })}
                      className="text-blue-600 text-xs font-bold flex items-center gap-1"
                    >
                      <span>+</span> Add Social
                    </button>
                  </div>
                  {formData.company.social_media.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <select
                        value={item.platform}
                        onChange={(e) => handleGenericArrayChange('company', 'social_media', idx, 'platform', e.target.value)}
                        className="border rounded text-sm px-2 py-2"
                      >
                        {['facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'whatsapp'].map(p => (
                          <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleGenericArrayChange('company', 'social_media', idx, 'url', e.target.value)}
                        placeholder="Profile URL"
                        className="flex-1 px-3 py-2 border rounded text-sm"
                      />
                      <button
                        onClick={() => removeGenericArrayItem('company', 'social_media', idx)}
                        className="text-red-500 p-2"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>

                {/* SEO Settings */}
                <h4 className="font-bold border-b pb-2 mt-6">SEO Settings</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.seo.meta_title}
                    onChange={(e) => handleNestedChange('seo', 'meta_title', e.target.value)}
                    placeholder="Meta Title"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    value={formData.seo.meta_description}
                    onChange={(e) => handleNestedChange('seo', 'meta_description', e.target.value)}
                    placeholder="Meta Description"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={formData.seo.meta_tags}
                    onChange={(e) => handleNestedChange('seo', 'meta_tags', e.target.value)}
                    placeholder="Meta Tags"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={formData.seo.og_image}
                      onChange={(e) => handleNestedChange('seo', 'og_image', e.target.value)}
                      placeholder="OG Image URL (Social Share Image)"
                      className="w-full px-4 py-2 border rounded-lg flex-1"
                    />
                    <button
                      onClick={() => document.getElementById('og-image-upload').click()}
                      className="bg-slate-100 p-2 rounded border"
                    >
                      <span>⬆</span>
                    </button>
                    <input
                      id="og-image-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files[0], (url) => handleNestedChange('seo', 'og_image', url))}
                    />
                  </div>
                </div>

                {/* Custom Scripts & Tracking Codes */}
                <h4 className="font-bold border-b pb-2 mt-8 flex items-center gap-2">
                  <span>📊</span> Custom Scripts & Tracking Codes
                </h4>
                <p className="text-sm text-slate-500 mb-4">Add custom HTML, CSS, JavaScript, or tracking codes (Google Analytics, Facebook Pixel, etc.)</p>

                <div className="space-y-6">
                  {/* HEAD SCRIPTS */}
                  <div className="border rounded-xl p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={formData.custom_scripts.head.enabled}
                          onChange={(e) => handleDeepNestedChange('custom_scripts', 'head', 'enabled', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span>Head Scripts</span>
                        <code className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">&lt;head&gt;</code>
                      </label>
                    </div>
                    <small className="text-xs text-slate-500 block mb-2">Best for: Meta tags, CSS, Analytics, Google Tag Manager</small>
                    <textarea
                      value={formData.custom_scripts.head.content}
                      onChange={(e) => handleDeepNestedChange('custom_scripts', 'head', 'content', e.target.value)}
                      placeholder="<!-- Google Analytics, Meta Tags, CSS -->"
                      className="w-full px-4 py-3 border rounded-lg font-mono text-sm bg-white"
                      rows={6}
                      disabled={!formData.custom_scripts.head.enabled}
                    />
                  </div>

                  {/* BODY START SCRIPTS */}
                  <div className="border rounded-xl p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={formData.custom_scripts.body_start.enabled}
                          onChange={(e) => handleDeepNestedChange('custom_scripts', 'body_start', 'enabled', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span>Body Start Scripts</span>
                        <code className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">After &lt;body&gt;</code>
                      </label>
                    </div>
                    <small className="text-xs text-slate-500 block mb-2">Best for: GTM noscript, Above-fold content</small>
                    <textarea
                      value={formData.custom_scripts.body_start.content}
                      onChange={(e) => handleDeepNestedChange('custom_scripts', 'body_start', 'content', e.target.value)}
                      placeholder="<!-- GTM noscript, Critical JS -->"
                      className="w-full px-4 py-3 border rounded-lg font-mono text-sm bg-white"
                      rows={4}
                      disabled={!formData.custom_scripts.body_start.enabled}
                    />
                  </div>

                  {/* BODY END SCRIPTS */}
                  <div className="border rounded-xl p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={formData.custom_scripts.body_end.enabled}
                          onChange={(e) => handleDeepNestedChange('custom_scripts', 'body_end', 'enabled', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span>Body End Scripts</span>
                        <code className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">Before &lt;/body&gt;</code>
                      </label>
                    </div>
                    <small className="text-xs text-slate-500 block mb-2">Best for: Facebook Pixel, Chat widgets, Deferred JS</small>
                    <textarea
                      value={formData.custom_scripts.body_end.content}
                      onChange={(e) => handleDeepNestedChange('custom_scripts', 'body_end', 'content', e.target.value)}
                      placeholder="<!-- Facebook Pixel, Chat Widget, Analytics -->"
                      className="w-full px-4 py-3 border rounded-lg font-mono text-sm bg-white"
                      rows={6}
                      disabled={!formData.custom_scripts.body_end.enabled}
                    />
                  </div>

                  {/* Quick Templates */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h5 className="font-bold text-sm text-blue-900 mb-3">📋 Quick Templates</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const gaScript = `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>`;
                          handleDeepNestedChange('custom_scripts', 'head', 'content', formData.custom_scripts.head.content + '\n' + gaScript);
                          handleDeepNestedChange('custom_scripts', 'head', 'enabled', true);
                        }}
                        className="bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        📊 Google Analytics
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const fbPixel = `<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>`;
                          handleDeepNestedChange('custom_scripts', 'body_end', 'content', formData.custom_scripts.body_end.content + '\n' + fbPixel);
                          handleDeepNestedChange('custom_scripts', 'body_end', 'enabled', true);
                        }}
                        className="bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        📘 Facebook Pixel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const gtmHead = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>`;
                          const gtmBody = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
                          handleDeepNestedChange('custom_scripts', 'head', 'content', formData.custom_scripts.head.content + '\n' + gtmHead);
                          handleDeepNestedChange('custom_scripts', 'body_start', 'content', formData.custom_scripts.body_start.content + '\n' + gtmBody);
                          handleDeepNestedChange('custom_scripts', 'head', 'enabled', true);
                          handleDeepNestedChange('custom_scripts', 'body_start', 'enabled', true);
                        }}
                        className="bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        🏷️ Google Tag Manager
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const whatsapp = `<!-- WhatsApp Chat Widget -->
<script src="https://apps.elfsight.com/p/platform.js" defer></script>
<div class="elfsight-app-YOUR_APP_ID"></div>`;
                          handleDeepNestedChange('custom_scripts', 'body_end', 'content', formData.custom_scripts.body_end.content + '\n' + whatsapp);
                          handleDeepNestedChange('custom_scripts', 'body_end', 'enabled', true);
                        }}
                        className="bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        💬 WhatsApp Chat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Publish Status */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-blue-900">Publish Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-slate-700">{formData.is_active ? 'Live' : 'Draft'}</span>
                  </label>
                </div>
              </div>
            )}

            {/* =========================================================== */}
            {/* STEP 1: TEMPLATE SELECTION */}
            {/* =========================================================== */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <SectionHeader title="Visual Layouts" />
                <div className="grid grid-cols-3 gap-6">
                  {Object.keys(templateMap).map(template => (
                    <div
                      key={template}
                      onClick={() => handleChange('template', template)}
                      className={`cursor-pointer group relative p-4 border-2 rounded-2xl transition-all ${formData.template === template ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                    >
                      <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center group-hover:bg-blue-100">
                        <span className={`text-5xl ${formData.template === template ? 'text-blue-600' : 'text-slate-300'}`}>📐</span>
                      </div>
                      <div className="text-center">
                        <p className="font-bold capitalize">{templateMap[template]}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChange('template', template);
                            setShowPreview(true);
                          }}
                          className="mt-2 text-xs text-blue-600 font-bold flex items-center justify-center gap-1 mx-auto bg-white px-3 py-1 rounded-full shadow-sm hover:bg-blue-50 border border-blue-100 transition-colors"
                        >
                          <span>👁️</span> Preview
                        </button>
                      </div>
                      {formData.template === template && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full">
                          <span>✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}




            {/* =========================================================== */}
            {/* STEP 3: HERO SECTION */}
            {/* =========================================================== */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <SectionHeader title="Hero Section" />
                <div className="grid gap-4">
                  <input
                    type="text"
                    value={formData.hero.title}
                    onChange={(e) => handleNestedChange('hero', 'title', e.target.value)}
                    placeholder="Hero Main Title"
                    className="w-full text-2xl font-bold px-4 py-3 border-b-2 outline-none"
                  />
                  <input
                    type="text"
                    value={formData.hero.subtitle}
                    onChange={(e) => handleNestedChange('hero', 'subtitle', e.target.value)}
                    placeholder="Subtitle"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    value={formData.hero.description}
                    onChange={(e) => handleNestedChange('hero', 'description', e.target.value)}
                    placeholder="Description"
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Overlay Opacity */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                    Overlay Opacity ({formData.hero.overlay_opacity})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.hero.overlay_opacity || 0.4}
                    onChange={(e) => handleNestedChange('hero', 'overlay_opacity', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs font-bold uppercase text-slate-400">Primary CTA</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={formData.hero.cta_button_1.text}
                        onChange={(e) => handleDeepNestedChange('hero', 'cta_button_1', 'text', e.target.value)}
                        placeholder="Text"
                        className="w-full border rounded px-2 py-1"
                      />
                      <select
                        value={formData.hero.cta_button_1.style}
                        onChange={(e) => handleDeepNestedChange('hero', 'cta_button_1', 'style', e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="outline">Outline</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={formData.hero.cta_button_1.link}
                      onChange={(e) => handleDeepNestedChange('hero', 'cta_button_1', 'link', e.target.value)}
                      placeholder="Link"
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs font-bold uppercase text-slate-400">Secondary CTA</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={formData.hero.cta_button_2.text}
                        onChange={(e) => handleDeepNestedChange('hero', 'cta_button_2', 'text', e.target.value)}
                        placeholder="Text"
                        className="w-full border rounded px-2 py-1"
                      />
                      <select
                        value={formData.hero.cta_button_2.style}
                        onChange={(e) => handleDeepNestedChange('hero', 'cta_button_2', 'style', e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="outline">Outline</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={formData.hero.cta_button_2.link}
                      onChange={(e) => handleDeepNestedChange('hero', 'cta_button_2', 'link', e.target.value)}
                      placeholder="Link"
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>

                {/* Background Media */}
                <div className="bg-neutral-900 p-6 rounded-2xl border">
                  <h4 className="font-bold mb-4 text-white flex items-center gap-2">
                    <span>🖼️</span> Background Media (Drag to Sort)
                  </h4>
                  <div className="flex gap-4 mb-6">
                    {['slider', 'video'].map(type => (
                      <button
                        key={type}
                        onClick={() => handleNestedChange('hero', 'background_type', type)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${formData.hero.background_type === type ? 'bg-blue-600 text-white' : 'bg-white border text-slate-600'}`}
                      >
                        {type === 'slider' ? 'Image Slider' : 'Video Background'}
                      </button>
                    ))}
                  </div>

                  {formData.hero.background_type === 'slider' ? (
                    <>
                      <MediaManager
                        items={formData.hero.background_images}
                        onUpdate={(items) => handleNestedChange('hero', 'background_images', items)}
                        type="image"
                        label="Hero Image"
                        onUploadTrigger={() => document.getElementById('upload-hero-image').click()}
                      />
                      <input
                        id="upload-hero-image"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('hero', 'background_images', [...formData.hero.background_images, ...urls]), 'image')}
                      />
                    </>
                  ) : (
                    <>
                      <MediaManager
                        items={formData.hero.background_videos}
                        onUpdate={(items) => handleNestedChange('hero', 'background_videos', items)}
                        type="video"
                        label="Hero Video"
                        onUploadTrigger={() => document.getElementById('upload-hero-video').click()}
                      />
                      <input
                        id="upload-hero-video"
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('hero', 'background_videos', [...formData.hero.background_videos, ...urls]), 'video')}
                      />
                    </>
                  )}
                </div>
              </div>
            )}



            {/* =========================================================== */}
            {/* STEP 5: PACKAGES */}
            {/* =========================================================== */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <SectionHeader title="Trip Packages" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={formData.packages.section_title}
                    onChange={(e) => handleNestedChange('packages', 'section_title', e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-4 py-2 border rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={formData.packages.section_subtitle}
                    onChange={(e) => handleNestedChange('packages', 'section_subtitle', e.target.value)}
                    placeholder="Section Subtitle"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Tab Selection */}
                <div className="flex gap-4 border-b mb-4">
                  <button
                    onClick={() => setActivePackageTab('trips')}
                    className={`pb-2 px-4 font-bold ${activePackageTab === 'trips' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
                  >
                    Individual Trips
                  </button>
                  <button
                    onClick={() => setActivePackageTab('custom')}
                    className={`pb-2 px-4 font-bold ${activePackageTab === 'custom' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
                  >
                    Custom Packages
                  </button>
                </div>

                {activePackageTab === 'trips' ? (
                  <>
                    {/* Trip Search */}
                    <div className="relative">
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400">🔍</span>
                        <input
                          type="text"
                          placeholder="Quick find trips..."
                          value={tripSearchQuery}
                          onChange={(e) => setTripSearchQuery(e.target.value)}
                          onFocus={() => setShowTripDropdown(true)}
                          className="w-full pl-11 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      {showTripDropdown && (
                        <div className="absolute z-20 w-full mt-2 bg-white border rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                          {filteredTrips.map(trip => (
                            <div
                              key={trip.id}
                              onClick={() => {
                                if (!formData.packages.selected_trips.some(t => t.trip_id === trip.id)) {
                                  handleNestedChange('packages', 'selected_trips', [
                                    ...formData.packages.selected_trips,
                                    {
                                      trip_id: trip.id,
                                      badge: '',
                                      trip_title: trip.title,
                                      price: getTripPriceDisplay(trip),
                                      pricing_model: trip.pricing_model,
                                      image: trip.hero_image
                                    }
                                  ]);
                                }
                                setShowTripDropdown(false);
                                setTripSearchQuery('');
                              }}
                              className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 transition-colors"
                            >
                              <img src={trip.hero_image || trip.images?.[0]} className="w-10 h-10 object-cover rounded-lg" alt="trip thumb" />
                              <div>
                                <p className="text-sm font-bold">{trip.title}</p>
                                <p className="text-[10px] text-blue-600 font-bold uppercase">{getTripPriceDisplay(trip)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Selected Trips */}
                    <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar bg-slate-50 p-4 rounded-xl border">
                      {formData.packages.selected_trips.map((st, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-white rounded-xl border group hover:shadow-md transition-all relative">
                          <img src={st.image} className="w-16 h-16 object-cover rounded-lg" alt="thumb" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate pr-6">{st.trip_title}</p>
                            <p className="text-[11px] text-blue-600 font-extrabold">{st.price}</p>
                            <input
                              type="text"
                              value={st.badge}
                              onChange={(e) => {
                                const l = [...formData.packages.selected_trips];
                                l[idx].badge = e.target.value;
                                handleNestedChange('packages', 'selected_trips', l);
                              }}
                              placeholder="Badge Label"
                              className="text-xs border p-1 rounded mt-1 w-full"
                            />
                          </div>
                          <button
                            onClick={() => handleNestedChange('packages', 'selected_trips', formData.packages.selected_trips.filter((_, i) => i !== idx))}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => addGenericArrayItem('packages', 'custom_packages', {
                        title: "New Package",
                        description: "",
                        trip_ids: [],
                        badge: "",
                        discount_text: ""
                      })}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                    >
                      <span>+</span> Create Custom Package
                    </button>

                    {formData.packages.custom_packages.map((pkg, idx) => (
                      <div key={idx} className="border rounded-xl p-4 bg-slate-50 relative">
                        <button
                          onClick={() => removeGenericArrayItem('packages', 'custom_packages', idx)}
                          className="absolute top-4 right-4 text-red-500 hover:scale-110 transition-transform"
                        >
                          ❌
                        </button>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <input
                            type="text"
                            value={pkg.title}
                            onChange={(e) => handleGenericArrayChange('packages', 'custom_packages', idx, 'title', e.target.value)}
                            placeholder="Package Title"
                            className="border rounded px-3 py-2 font-bold"
                          />
                          <input
                            type="text"
                            value={pkg.badge}
                            onChange={(e) => handleGenericArrayChange('packages', 'custom_packages', idx, 'badge', e.target.value)}
                            placeholder="Badge (e.g. Best Seller)"
                            className="border rounded px-3 py-2"
                          />
                        </div>
                        <textarea
                          value={pkg.description}
                          onChange={(e) => handleGenericArrayChange('packages', 'custom_packages', idx, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full border rounded px-3 py-2 mb-3"
                          rows={2}
                        />

                        {/* Trip Selector */}
                        <div className="bg-white p-3 rounded-lg border">
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Included Trips</label>

                          {/* Selected Chips */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {pkg.trip_ids.length === 0 && <span className="text-xs text-slate-400 italic">No trips added yet.</span>}
                            {pkg.trip_ids.map(tid => {
                              const t = availableTrips.find(at => at.id === tid);
                              return t ? (
                                <span key={tid} className="bg-blue-50 border border-blue-200 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1 font-bold">
                                  <img src={t.hero_image || t.images?.[0]} className="w-4 h-4 rounded-full object-cover" alt="" />
                                  {t.title}
                                  <button
                                    onClick={() => {
                                      const newIds = pkg.trip_ids.filter(id => id !== tid);
                                      handleGenericArrayChange('packages', 'custom_packages', idx, 'trip_ids', newIds);
                                    }}
                                  >
                                    ❌
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>

                          {/* Search & Dropdown */}
                          <div className="relative">
                            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-slate-50 focus-within:ring-2 ring-blue-500 focus-within:bg-white transition-all">
                              <span className="text-slate-400">🔍</span>
                              <input
                                type="text"
                                placeholder="Search & add trips..."
                                className="text-sm bg-transparent outline-none flex-1 w-full"
                                onFocus={() => setShowCustomPackageDropdown(idx)}
                                value={showCustomPackageDropdown === idx ? customPackageQuery : ''}
                                onChange={(e) => setCustomPackageQuery(e.target.value)}
                              />
                            </div>
                            {showCustomPackageDropdown === idx && (
                              <div className="absolute z-30 w-full mt-2 bg-white border rounded-lg shadow-xl flex flex-col max-h-72 overflow-hidden">
                                {/* Header */}
                                <div className="sticky top-0 z-10 bg-white border-b px-3 py-2 flex items-center justify-between">
                                  <span className="text-xs font-bold uppercase text-slate-500">Select Trips</span>
                                  <button
                                    type="button"
                                    onClick={() => setShowCustomPackageDropdown(null)}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                                  >
                                    Done
                                  </button>
                                </div>

                                {/* List */}
                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                  {availableTrips
                                    .filter(t => t.title.toLowerCase().includes(customPackageQuery.toLowerCase()))
                                    .map(t => {
                                      const isSelected = pkg.trip_ids.includes(t.id);
                                      return (
                                        <div
                                          key={t.id}
                                          onClick={() => {
                                            if (!isSelected) {
                                              handleGenericArrayChange('packages', 'custom_packages', idx, 'trip_ids', [...pkg.trip_ids, t.id]);
                                            } else {
                                              handleGenericArrayChange('packages', 'custom_packages', idx, 'trip_ids', pkg.trip_ids.filter(id => id !== t.id));
                                            }
                                            setCustomPackageQuery('');
                                          }}
                                          className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0 ${isSelected ? 'bg-blue-50' : ''}`}
                                        >
                                          <img src={t.hero_image || t.images?.[0]} className="w-8 h-8 rounded object-cover bg-gray-200" alt="" />
                                          <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold truncate text-slate-700">{t.title}</div>
                                            <div className="text-[10px] text-slate-500 uppercase">{t.destination}</div>
                                          </div>
                                          {isSelected && <span className="text-blue-600">✓</span>}
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================== */}
            {/* STEP 6: ATTRACTIONS */}
            {/* =========================================================== */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <SectionHeader title="Area Highlights" />
                <button
                  onClick={() => addArrayItem('attractions', { title: '', image: '', description: '' })}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 mb-4"
                >
                  <span>+</span> Add Attraction
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.attractions.section_title}
                    onChange={(e) => handleNestedChange('attractions', 'section_title', e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-4 py-2 border rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={formData.attractions.section_subtitle}
                    onChange={(e) => handleNestedChange('attractions', 'section_subtitle', e.target.value)}
                    placeholder="Section Subtitle"
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div className="grid gap-6">
                  {formData.attractions.items.map((item, idx) => (
                    <div key={idx} className="p-6 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-all relative">
                      <button
                        onClick={() => removeArrayItem('attractions', idx)}
                        className="absolute top-4 right-4 text-red-500"
                      >
                        ❌
                      </button>
                      <div className="flex gap-6">
                        <div className="w-1/3">
                          <div
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                if (e.target.files?.[0]) handleFileUpload(e.target.files[0], (u) => handleArrayItemChange('attractions', idx, 'image', u));
                              };
                              input.click();
                            }}
                            className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed relative"
                          >
                            {item.image ? (
                              <>
                                <img src={item.image} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold">
                                  CHANGE IMAGE
                                </div>
                              </>
                            ) : (
                              <span className="text-4xl">⬆</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleArrayItemChange('attractions', idx, 'title', e.target.value)}
                            placeholder="Attraction Name"
                            className="w-full px-4 py-2 border-b-2 outline-none font-bold"
                          />
                          <ReactQuill
                            theme="snow"
                            value={item.description}
                            onChange={(v) => handleArrayItemChange('attractions', idx, 'description', v)}
                            modules={quillModules}
                            placeholder="Description..."
                            className="bg-slate-50 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================== */}
            {/* STEP 7: GALLERY */}
            {/* =========================================================== */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <SectionHeader title="Media Gallery" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={formData.gallery.section_title}
                    onChange={(e) => handleNestedChange('gallery', 'section_title', e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-4 py-2 border rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={formData.gallery.section_subtitle}
                    onChange={(e) => handleNestedChange('gallery', 'section_subtitle', e.target.value)}
                    placeholder="Section Subtitle"
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-8">
                  {/* Images */}
                  <div className="p-6 bg-neutral-900 rounded-2xl border">
                    <h4 className="font-bold mb-4 text-white flex items-center gap-2">
                      <span>🖼️</span> Images (Drag to Sort)
                    </h4>
                    <MediaManager
                      items={formData.gallery.images}
                      onUpdate={(items) => handleNestedChange('gallery', 'images', items)}
                      type="image"
                      label="Gallery Image"
                      onUploadTrigger={() => document.getElementById('upload-gallery-image').click()}
                    />
                    <input
                      id="upload-gallery-image"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('gallery', 'images', [...formData.gallery.images, ...urls]), 'image')}
                    />
                  </div>

                  {/* Videos */}
                  <div className="p-6 bg-neutral-900 rounded-2xl border">
                    <h4 className="font-bold mb-4 text-white flex items-center gap-2">
                      <span>🎬</span> Videos (Drag to Sort)
                    </h4>
                    <MediaManager
                      items={formData.gallery.videos}
                      onUpdate={(items) => handleNestedChange('gallery', 'videos', items)}
                      type="video"
                      label="Gallery Video"
                      onUploadTrigger={() => document.getElementById('upload-gallery-video').click()}
                    />
                    <input
                      id="upload-gallery-video"
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => handleNestedChange('gallery', 'videos', [...formData.gallery.videos, ...urls]), 'video')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================== */}
            {/* STEP 8: TESTIMONIALS */}
            {/* =========================================================== */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <SectionHeader title="Traveler Voices" />
                <button
                  onClick={() => addArrayItem('testimonials', { name: '', destination: '', rating: 5, description: '', image: '', date: '' })}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 mb-4"
                >
                  <span>+</span> Add Review
                </button>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={formData.testimonials.section_title}
                    onChange={(e) => handleNestedChange('testimonials', 'section_title', e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-4 py-2 border rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={formData.testimonials.section_subtitle}
                    onChange={(e) => handleNestedChange('testimonials', 'section_subtitle', e.target.value)}
                    placeholder="Section Subtitle"
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-6">
                  {formData.testimonials.items.map((item, idx) => (
                    <div key={idx} className="p-6 border rounded-3xl bg-slate-50 relative group">
                      <button
                        onClick={() => removeArrayItem('testimonials', idx)}
                        className="absolute top-6 right-6 text-red-500 hover:scale-110 transition-all"
                      >
                        ❌
                      </button>
                      <div className="flex gap-6">
                        <div
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              if (e.target.files?.[0]) handleFileUpload(e.target.files[0], (u) => handleArrayItemChange('testimonials', idx, 'image', u));
                            };
                            input.click();
                          }}
                          className="w-24 h-24 bg-white border-4 border-white rounded-full flex items-center justify-center cursor-pointer shadow-md overflow-hidden flex-shrink-0"
                        >
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <span className="text-4xl">⬆</span>}
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleArrayItemChange('testimonials', idx, 'name', e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-4 py-2 border rounded-lg font-bold"
                          />
                          <input
                            type="text"
                            value={item.destination}
                            onChange={(e) => handleArrayItemChange('testimonials', idx, 'destination', e.target.value)}
                            placeholder="Trip Taken"
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                          <div className="flex items-center gap-4 bg-white px-4 py-2 border rounded-lg">
                            <span className="text-xs font-bold text-slate-400">RATING</span>
                            <select
                              value={item.rating}
                              onChange={(e) => handleArrayItemChange('testimonials', idx, 'rating', parseInt(e.target.value))}
                              className="flex-1 font-bold text-yellow-600 outline-none"
                            >
                              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                            </select>
                          </div>
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) => handleArrayItemChange('testimonials', idx, 'date', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) => handleArrayItemChange('testimonials', idx, 'description', e.target.value)}
                            placeholder="Review..."
                            rows={3}
                            className="w-full px-4 py-2 border rounded-lg col-span-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================== */}
            {/* STEP 9: FAQS */}
            {/* =========================================================== */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <SectionHeader title="Knowledge Base" />
                <button
                  onClick={() => addArrayItem('faqs', { question: '', answer: '' })}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 mb-4"
                >
                  <span>+</span> Add FAQ
                </button>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={formData.faqs.section_title}
                    onChange={(e) => handleNestedChange('faqs', 'section_title', e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-4 py-2 border rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={formData.faqs.section_subtitle}
                    onChange={(e) => handleNestedChange('faqs', 'section_subtitle', e.target.value)}
                    placeholder="Section Subtitle"
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                  />
                </div>

                {formData.faqs.items.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-2xl bg-white shadow-sm hover:border-blue-200 transition-all relative">
                    <button
                      onClick={() => removeArrayItem('faqs', idx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                    >
                      ❌
                    </button>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => handleArrayItemChange('faqs', idx, 'question', e.target.value)}
                      placeholder="Question Title"
                      className="w-full px-4 py-2 border-b font-bold mb-2 outline-none focus:border-blue-500"
                    />
                    <ReactQuill
                      theme="snow"
                      value={item.answer}
                      onChange={(v) => handleArrayItemChange('faqs', idx, 'answer', v)}
                      modules={quillModules}
                      placeholder="Answer Details..."
                      className="bg-slate-50 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* =========================================================== */}
            {/* STEP 10: NOTIFICATIONS */}
            {/* =========================================================== */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <SectionHeader title="Live Sales Notifications" />

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl mb-4 border border-green-200">
                  <input
                    type="checkbox"
                    checked={formData.live_notifications.enabled}
                    onChange={(e) => handleNestedChange('live_notifications', 'enabled', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded"
                  />
                  <div>
                    <span className="font-bold text-green-900 block">Enable Live Social Proof</span>
                    <span className="text-xs text-green-700">Shows popups like "Sarah from London booked Paris 5 mins ago"</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Duration (sec)</label>
                    <input
                      type="number"
                      value={formData.live_notifications.display_duration}
                      onChange={(e) => handleNestedChange('live_notifications', 'display_duration', parseInt(e.target.value))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Interval (sec)</label>
                    <input
                      type="number"
                      value={formData.live_notifications.interval_between}
                      onChange={(e) => handleNestedChange('live_notifications', 'interval_between', parseInt(e.target.value))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Position</label>
                    <select
                      value={formData.live_notifications.position}
                      onChange={(e) => handleNestedChange('live_notifications', 'position', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={formData.live_notifications.show_on_mobile}
                    onChange={(e) => handleNestedChange('live_notifications', 'show_on_mobile', e.target.checked)}
                  />
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <span>📱</span> Show on Mobile Devices
                  </span>
                </div>

                <h4 className="font-bold pt-4">Add New Notification</h4>
                <div className="bg-slate-50 p-4 rounded-xl border grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah"
                      value={tempNotification.name}
                      onChange={(e) => setTempNotification({ ...tempNotification, name: e.target.value })}
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={tempNotification.location}
                      onChange={(e) => setTempNotification({ ...tempNotification, location: e.target.value })}
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Destination</label>
                    <input
                      type="text"
                      placeholder="e.g. Manali"
                      value={tempNotification.destination}
                      onChange={(e) => setTempNotification({ ...tempNotification, destination: e.target.value })}
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Time Ago</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 mins ago"
                      value={tempNotification.time}
                      onChange={(e) => setTempNotification({ ...tempNotification, time: e.target.value })}
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <button
                      onClick={() => {
                        if (tempNotification.name && tempNotification.location) {
                          handleNestedChange('live_notifications', 'notifications', [...formData.live_notifications.notifications, tempNotification]);
                          setTempNotification({ name: '', location: '', destination: '', time: '' });
                        } else {
                          alert("Please fill in at least Name and Location");
                        }
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mt-4 max-h-60 overflow-y-auto">
                  {formData.live_notifications.notifications.map((note, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border p-3 rounded-lg shadow-sm">
                      <div className="flex gap-2 text-sm">
                        <span className="font-bold">{note.name}</span>
                        <span className="text-slate-500">from</span>
                        <span className="font-bold">{note.location}</span>
                        <span className="text-slate-500">booked</span>
                        <span className="font-bold text-blue-600">{note.destination}</span>
                        <span className="text-slate-400 text-xs flex items-center">({note.time})</span>
                      </div>
                      <button
                        onClick={() => {
                          const newNotes = formData.live_notifications.notifications.filter((_, i) => i !== idx);
                          handleNestedChange('live_notifications', 'notifications', newNotes);
                        }}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  {formData.live_notifications.notifications.length === 0 && (
                    <p className="text-sm text-slate-400 italic text-center py-4">No notifications added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* =========================================================== */}
            {/* STEP 11: GUIDELINES */}
            {/* =========================================================== */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <SectionHeader title="Travel Guidelines" />
                <div className="grid gap-4 mb-4">
                  <input
                    type="text"
                    value={formData.travel_guidelines.section_title}
                    onChange={(e) => handleNestedChange('travel_guidelines', 'section_title', e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-4 py-2 border rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={formData.travel_guidelines.section_subtitle}
                    onChange={(e) => handleNestedChange('travel_guidelines', 'section_subtitle', e.target.value)}
                    placeholder="Subtitle"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <ReactQuill
                  theme="snow"
                  value={formData.travel_guidelines.description}
                  onChange={(v) => handleNestedChange('travel_guidelines', 'description', v)}
                  modules={quillModules}
                  className="bg-white rounded-xl h-96 mb-12 shadow-inner"
                />
              </div>
            )}

            {/* =========================================================== */}
            {/* STEP 12: OFFERS */}
            {/* =========================================================== */}
            {currentStep === 10 && (
              <div className="space-y-8">
                <SectionHeader title="Offers & Banners" />

                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-900 rounded-3xl text-white">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Sale Start</label>
                    <input
                      type="date"
                      value={formData.offers.start_date}
                      onChange={(e) => handleNestedChange('offers', 'start_date', e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Sale End</label>
                    <input
                      type="date"
                      value={formData.offers.end_date}
                      onChange={(e) => handleNestedChange('offers', 'end_date', e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>

                {/* Mid Section Banner */}
                <div className="p-6 border rounded-2xl bg-slate-900">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.offers.mid_section.enabled}
                        onChange={(e) => handleDeepNestedChange('offers', 'mid_section', 'enabled', e.target.checked)}
                        className="w-5 h-5"
                      />
                      <h4 className="font-bold text-lg">In-Page Banner (Mid Section)</h4>
                    </div>
                    <div className="flex p-1 bg-black border rounded-xl">
                      {['image', 'video'].map(t => (
                        <button
                          key={t}
                          onClick={() => handleDeepNestedChange('offers', 'mid_section', 'type', t)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${formData.offers.mid_section.type === t ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-400'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.offers.mid_section.enabled && (
                    <>
                      <MediaManager
                        items={formData.offers.mid_section.media_urls || []}
                        onUpdate={(items) => handleDeepNestedChange('offers', 'mid_section', 'media_urls', items)}
                        type={formData.offers.mid_section.type}
                        label="Banner Asset"
                        onUploadTrigger={() => document.getElementById(`upload-mid-${formData.offers.mid_section.type}`).click()}
                      />
                      <input
                        id={`upload-mid-${formData.offers.mid_section.type}`}
                        type="file"
                        accept={formData.offers.mid_section.type === 'image' ? 'image/*' : 'video/*'}
                        multiple
                        className="hidden"
                        onChange={(e) => handleMultipleFileUpload(e.target.files, (urls) => {
                          const current = formData.offers.mid_section.media_urls || [];
                          handleDeepNestedChange('offers', 'mid_section', 'media_urls', [...current, ...urls]);
                        }, formData.offers.mid_section.type)}
                      />
                    </>
                  )}
                </div>

                {/* Header & Footer Alerts */}
                <div className="flex gap-4">
                  <div className={`p-6 border rounded-3xl flex-1 transition-all ${formData.offers.header.enabled ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={formData.offers.header.enabled}
                        onChange={(e) => handleDeepNestedChange('offers', 'header', 'enabled', e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="font-bold">Header Alert</span>
                    </div>
                    {formData.offers.header.enabled && (
                      <input
                        type="text"
                        value={formData.offers.header.text}
                        onChange={(e) => handleDeepNestedChange('offers', 'header', 'text', e.target.value)}
                        placeholder="Text..."
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    )}
                  </div>
                  <div className={`p-6 border rounded-3xl flex-1 transition-all ${formData.offers.footer.enabled ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={formData.offers.footer.enabled}
                        onChange={(e) => handleDeepNestedChange('offers', 'footer', 'enabled', e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="font-bold">Footer Alert</span>
                    </div>
                    {formData.offers.footer.enabled && (
                      <input
                        type="text"
                        value={formData.offers.footer.text}
                        onChange={(e) => handleDeepNestedChange('offers', 'footer', 'text', e.target.value)}
                        placeholder="Text..."
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    )}
                  </div>
                </div>

                {/* Popups */}
                <div className="bg-neutral-900 p-6 border rounded-3xl">
                  <h4 className="font-bold mb-4 text-white">Popups</h4>
                  <div className="grid grid-cols-3 gap-6">
                    {Object.entries(formData.offers.popups).map(([key, p]) => (
                      <div key={key} className={`p-4 border rounded-2xl transition-all ${p.enabled ? 'border-blue-400 bg-white' : 'bg-slate-800 border-slate-700'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-[10px] font-bold uppercase ${p.enabled ? 'text-blue-600' : 'text-slate-400'}`}>{key}</span>
                          <input
                            type="checkbox"
                            checked={p.enabled}
                            onChange={(e) => {
                              const clone = { ...formData.offers.popups };
                              clone[key].enabled = e.target.checked;
                              handleNestedChange('offers', 'popups', clone);
                            }}
                            className="w-4 h-4"
                          />
                        </div>
                        <input
                          type="text"
                          value={p.title}
                          onChange={(e) => {
                            const clone = { ...formData.offers.popups };
                            clone[key].title = e.target.value;
                            handleNestedChange('offers', 'popups', clone);
                          }}
                          placeholder="Heading"
                          className={`w-full p-2 text-xs border rounded-lg ${!p.enabled ? 'bg-slate-700 border-slate-600 text-slate-300' : ''}`}
                          disabled={!p.enabled}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================== */}
            {/* NAVIGATION CONTROLS */}
            {/* =========================================================== */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-2 border rounded-xl font-bold hover:bg-slate-50 disabled:opacity-30"
              >
                <span>←</span> Previous
              </button>

              <button
                onClick={() => handleSave(false)}
                className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <span>💾</span> Save Changes
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving || uploadingFiles}
                  className="flex items-center gap-2 bg-green-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-green-700 shadow-lg"
                >
                  <span>💾</span> Save & Submit
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
                >
                  Next <span>→</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}