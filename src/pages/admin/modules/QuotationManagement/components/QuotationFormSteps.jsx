// QuotationFormSteps.jsx - FINAL PRODUCTION VERSION with Multi-Image & Validation
// ✅ All UI fixes applied
// ✅ Matches backend schema exactly
// ✅ Package-based costing with components & variants (using image_urls array)
// ✅ Simple items with description
// ✅ Searchable dropdowns
// ✅ Large text editors
// ✅ Proper error handling
// 🚨 NEW: Added mandatory check for costing data (Step 4)

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Button, TextField, Grid, Typography, Alert, CircularProgress,
    IconButton, Autocomplete,
    Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent,
    Avatar, Chip, Paper, Divider, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
    CloudUpload as CloudUploadIcon,
    Image as ImageIcon,
    CheckCircle as CheckCircleIcon,
    Person as PersonIcon,
    FlightTakeoff as FlightTakeoffIcon,
    ListAlt as ListAltIcon,
    MonetizationOn as MonetizationOnIcon,
    Gavel as GavelIcon,
    CreditCard as CreditCardIcon,
    Hotel as HotelIcon,
    DirectionsCar as TransportIcon,
    Category as CategoryIcon,
    ArrowBackIosNew as BackIcon,
    ArrowForwardIos as ForwardIcon,
    Save as SaveIcon,
    Send as SendIcon
} from '@mui/icons-material';
import axios from 'axios';
import QuotationViewDialog from './QuotationViewDialog';

const STEPS = 7;
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const UPLOAD_API = 'https://api.yaadigo.com/upload';
const MULTIPLE_UPLOAD_API = 'https://api.yaadigo.com/multiple';

const BASE_FORM_DATA = {
    design: 'Modern Professional',
    lead_id: 0,
    lead_source: '',
    client_name: '',
    client_email: '',
    client_mobile: '',
    agent: { name: 'Agent Name', email: 'agent@example.com', contact: '+91-9876543210' },
    company: {
        name: 'Holidays Planners',
        email: 'sales@indianmountainrovers.com',
        mobile: '+91-9988776655',
        website: 'https://indianmountainrovers.com',
        licence: 'TRV-12345',
        logo_url: ''
    },
    trip_id: null,
    display_title: '',
    overview: '',
    hero_image: '',
    gallery_images: [],
    itinerary: [{ day: 1, title: 'Day 1: Arrival', description: '' }],
    costing: {
        type: 'package',
        currency: 'INR',
        total_amount: 0,
        selected_package_id: 'pkg_default',
        packages: [
            {
                package_id: 'pkg_default',
                package_name: 'Standard Package',
                package_description: 'Our recommended package',
                is_active: true,
                components: [],
                total_price: 0
            }
        ],
        items: []
    },
    policies: {
        payment_terms: '50% advance at booking, 50% before 7 days of travel.',
        cancellation_policy: 'Cancellation charges apply as per terms.',
        terms_and_conditions: 'Subject to availability and T&C.',
        custom_policy: ''
    },
    payment: {
        bank_name: '',
        account_number: '',
        ifsc_code: '',
        branch_name: '',
        gst_number: '',
        address: '',
        upi_ids: [''],
        qr_code_url: ''
    },
    status: 'Draft',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
};

const QuotationFormSteps = ({ activeStep, setActiveStep, handleClose, API_KEY: propKey, QUOTATION_API, quotation }) => {
    const apiKey = propKey || API_KEY;
    const [formData, setFormData] = useState(BASE_FORM_DATA);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [availableLeads, setAvailableLeads] = useState([]);
    const [availableTrips, setAvailableTrips] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [sendDialogOpen, setSendDialogOpen] = useState(false);
    const [uploadingQR, setUploadingQR] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [uploadingComponentImages, setUploadingComponentImages] = useState({});

    // Utility function to normalize old data structure to new array structure
    const normalizeQuotationData = (data) => {
        if (data && data.costing && data.costing.packages) {
            data.costing.packages = data.costing.packages.map(pkg => ({
                ...pkg,
                components: pkg.components.map(comp => ({
                    ...comp,
                    variants: comp.variants.map(v => ({
                        ...v,
                        // CRITICAL: Convert old single image_url string to an array [image_url] or []
                        image_urls: v.image_urls || (v.image_url ? [v.image_url] : []),
                        image_url: undefined // Remove deprecated field
                    }))
                }))
            }));
        }
        return data;
    };

    // Load quotation data for editing
    useEffect(() => {
        if (quotation && quotation.id) {
            const normalizedQuotation = normalizeQuotationData(quotation);
            setFormData(prev => ({
                ...BASE_FORM_DATA,
                ...normalizedQuotation,
                agent: normalizedQuotation.agent || BASE_FORM_DATA.agent,
                company: normalizedQuotation.company || BASE_FORM_DATA.company,
                policies: normalizedQuotation.policies || BASE_FORM_DATA.policies,
                payment: normalizedQuotation.payment || BASE_FORM_DATA.payment,
                itinerary: normalizedQuotation.itinerary || BASE_FORM_DATA.itinerary,
                amount: normalizedQuotation.amount || 0,
                display_title: normalizedQuotation.trip?.display_title || normalizedQuotation.display_title || '',
                overview: normalizedQuotation.trip?.overview || normalizedQuotation.overview || '',
                hero_image: normalizedQuotation.trip?.hero_image || normalizedQuotation.hero_image || '',
                gallery_images: normalizedQuotation.trip?.gallery_images || normalizedQuotation.gallery_images || [],
                costing: {
                    ...BASE_FORM_DATA.costing,
                    ...normalizedQuotation.costing,
                    total_amount: normalizedQuotation.amount || normalizedQuotation.costing?.total_amount || 0,
                },
            }));
        }

        const loadData = async () => {
            try {
                const [leadsResp, tripsResp] = await Promise.all([
                    fetch(`${API_BASE_URL}/leads/`, { headers: { 'x-api-key': apiKey } }).then(r => r.json()).catch(() => ({})),
                    fetch(`${API_BASE_URL}/trips/`, { headers: { 'x-api-key': apiKey } }).then(r => r.json()).catch(() => ({}))
                ]);

                const leadList = leadsResp?.data || leadsResp || [];
                const normalizedLeads = leadList.map(l => ({
                    source: 'lead',
                    id: l.id,
                    label: `${l.name} (Lead #${l.id}) - ${l.email}`,
                    name: l.name,
                    email: l.email,
                    mobile: l.mobile
                }));
                setAvailableLeads(normalizedLeads);
                setAvailableTrips(tripsResp?.data?.filter(t => !t.is_deleted) || tripsResp || []);
            } catch (err) {
                setFormError('Failed loading leads/trips data.');
            }
        };
        loadData();
    }, [quotation, apiKey]);

    // Calculate totals
    const calculatePackageTotal = useCallback((pkg) => {
        return pkg.components.reduce((total, component) => {
            const selectedVariant = component.variants.find(v => v.is_selected);
            return total + (Number(selectedVariant?.price_per_person) || 0);
        }, 0);
    }, []);

    useEffect(() => {
        let total = 0;
        if (formData.costing.type === 'package' && formData.costing.packages) {
            const selectedPkg = formData.costing.packages.find(p => p.package_id === formData.costing.selected_package_id)
                || formData.costing.packages.find(p => p.is_active)
                || formData.costing.packages[0];

            if (selectedPkg) {
                total = calculatePackageTotal(selectedPkg);
            }
        } else if (formData.costing.type === 'person' && formData.costing.items) {
            total = (formData.costing.items || []).reduce((s, it) => s + (Number(it.quantity || 0) * Number(it.unit_price || 0)), 0);
        }

        setFormData(prev => ({
            ...prev,
            costing: { ...prev.costing, total_amount: total },
            amount: total
        }));
    }, [formData.costing.packages, formData.costing.items, formData.costing.type, formData.costing.selected_package_id, calculatePackageTotal]);

    // Navigation
    const handleNext = () => {
        if (activeStep === 0 && !formData.design) {
            setFormError('Please choose a design template.');
            return;
        }
        if (activeStep === 1 && !formData.client_name) {
            setFormError('Please select a lead or enter a client name.');
            return;
        }
        if (activeStep === 2 && !formData.display_title) {
            setFormError('Please enter a trip title.');
            return;
        }

        // 🚨 NEW: Added check for mandatory itinerary data (at least one valid day)
        if (activeStep === 3) {
            const validItinerary = (formData.itinerary || []).some(item => item.title && item.description);
            if (!validItinerary) {
                setFormError('The itinerary must contain at least one day with a title and description.');
                return;
            }
        }

        // 🚨 NEW: Added check for mandatory costing data (Step 4)
        if (activeStep === 4) {
            const hasPackages = formData.costing.type === 'package' && (formData.costing.packages || []).length > 0;
            const hasItems = formData.costing.type === 'person' && (formData.costing.items || []).length > 0;

            if (!hasPackages && !hasItems) {
                setFormError('Costing data is mandatory. Please add at least one package or one item.');
                return;
            }
        }

        setFormError(null);
        setActiveStep(s => s + 1);
    };

    const handleBack = () => {
        setFormError(null);
        setActiveStep(s => Math.max(0, s - 1));
    };

    const handleInputChange = (e, section, field) => {
        const value = e?.target ? e.target.value : e;
        if (section) {
            setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    // Lead Selection
    const handleLeadSelect = (event, value) => {
        const selectedLead = value?.id === 0 ? null : value;
        setFormData(prev => ({
            ...prev,
            lead_id: selectedLead?.id || 0,
            lead_source: selectedLead?.source || '',
            client_name: selectedLead?.name || '',
            client_email: selectedLead?.email || '',
            client_mobile: selectedLead?.mobile || ''
        }));
    };

    // Trip Selection
    const handleTripSelect = async (event, value) => {
        const selectedTrip = value?.id === null ? null : value;
        if (!selectedTrip) {
            setFormData(prev => ({
                ...prev,
                trip_id: null,
                display_title: '',
                overview: '',
                hero_image: '',
                gallery_images: [],
                itinerary: BASE_FORM_DATA.itinerary
            }));
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/trips/${selectedTrip.id}`, { headers: { 'x-api-key': apiKey } });
            const json = await res.json();
            const full = json?.data || json;

            setFormData(prev => ({
                ...prev,
                trip_id: selectedTrip.id,
                display_title: full.title || selectedTrip.title || '',
                overview: full.overview || selectedTrip.overview || '',
                hero_image: full.hero_image || selectedTrip.hero_image || '',
                gallery_images: full.gallery_images || selectedTrip.gallery_images || [],
                itinerary: full.itinerary?.map((it, i) => ({
                    day: i + 1,
                    title: it.title,
                    description: it.description
                })) || prev.itinerary
            }));
        } catch (err) {
            console.warn('trip fetch failed', err);
        }
    };

    // File Uploads
    const handleFileUpload = async (file, type) => {
        if (!file) return null;
        const setUploading = type === 'hero' ? setUploadingHero : (type === 'qr' ? setUploadingQR : setUploadingGallery);
        setUploading(true);

        const fd = new FormData();
        fd.append(type === 'hero' || type === 'qr' ? 'image' : 'gallery_images', file);
        fd.append('storage', 'local');

        try {
            const uploadUrl = type === 'hero' || type === 'qr' ? UPLOAD_API : MULTIPLE_UPLOAD_API;
            const res = await axios.post(uploadUrl, fd);
            setUploading(false);
            if (res?.data?.message === 'Upload successful' || res?.data?.files || res?.data?.url) {
                const url = res.data.url || (Array.isArray(res.data.files) ? res.data.files[0] : res.data.files);
                return url;
            }
            throw new Error('Upload failed');
        } catch (error) {
            setUploading(false);
            setFormError(`Failed to upload ${type} image.`);
            return null;
        }
    };

    const handleHeroUpload = async (e) => {
        const url = await handleFileUpload(e.target.files[0], 'hero');
        if (url) setFormData(prev => ({ ...prev, hero_image: url }));
    };

    const handleMultipleImageUpload = async (files) => {
        if (!files || files.length === 0) return;
        const uploadPromises = Array.from(files).map(file => handleFileUpload(file, 'gallery'));
        setUploadingGallery(true);
        try {
            const results = await Promise.all(uploadPromises);
            const uploadedUrls = results.filter(url => url !== null);
            setFormData(prev => ({
                ...prev,
                gallery_images: [...(prev.gallery_images || []), ...uploadedUrls]
            }));
        } finally {
            setUploadingGallery(false);
        }
    };

    const handleQRUpload = async (e) => {
        const url = await handleFileUpload(e.target.files[0], 'qr');
        if (url) setFormData(prev => ({ ...prev, payment: { ...prev.payment, qr_code_url: url } }));
    };

    // Handles multiple file upload for a component variant
    const handleComponentMultipleImageUpload = async (files, packageId, componentIndex, variantIndex) => {
        if (!files || files.length === 0) return;
        const uploadKey = `${packageId}-${componentIndex}-${variantIndex}`;
        setUploadingComponentImages(prev => ({ ...prev, [uploadKey]: true }));

        const fd = new FormData();
        Array.from(files).forEach(file => {
            fd.append('gallery_images', file); // Use 'gallery_images' for MULTIPLE_UPLOAD_API
        });
        fd.append('storage', 'local');

        try {
            const res = await axios.post(MULTIPLE_UPLOAD_API, fd);
            const uploadedUrls = res?.data?.files || []; // Expect an array of URLs from MULTIPLE_UPLOAD_API

            if (uploadedUrls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    costing: {
                        ...prev.costing,
                        packages: prev.costing.packages.map(pkg => {
                            if (pkg.package_id === packageId) {
                                const updatedComponents = [...pkg.components];
                                const currentUrls = updatedComponents[componentIndex].variants[variantIndex].image_urls || [];
                                updatedComponents[componentIndex].variants[variantIndex].image_urls = [...currentUrls, ...uploadedUrls];
                                return { ...pkg, components: updatedComponents };
                            }
                            return pkg;
                        })
                    }
                }));
            } else {
                throw new Error('No files uploaded.');
            }
        } catch (error) {
            setFormError(`Failed to upload images for component. ${error.message}`);
        } finally {
            setUploadingComponentImages(prev => ({ ...prev, [uploadKey]: false }));
        }
    };

    // Removes a single image from a component variant's array
    const removeComponentImage = (packageId, componentIndex, variantIndex, imageIdx) => {
        setFormData(prev => ({
            ...prev,
            costing: {
                ...prev.costing,
                packages: prev.costing.packages.map(pkg => {
                    if (pkg.package_id === packageId) {
                        const updatedComponents = [...pkg.components];
                        updatedComponents[componentIndex].variants[variantIndex].image_urls =
                            updatedComponents[componentIndex].variants[variantIndex].image_urls.filter((_, idx) => idx !== imageIdx);
                        return { ...pkg, components: updatedComponents };
                    }
                    return pkg;
                })
            }
        }));
    };

    // Package Management
    const addPackage = () => {
        const newPackage = {
            package_id: `pkg_${Date.now()}`,
            package_name: `Package ${formData.costing.packages.length + 1}`,
            package_description: '',
            is_active: true,
            components: [],
            total_price: 0
        };
        setFormData(prev => ({
            ...prev,
            costing: { ...prev.costing, packages: [...prev.costing.packages, newPackage] }
        }));
    };

    const removePackage = (packageId) => {
        setFormData(prev => ({
            ...prev,
            costing: {
                ...prev.costing,
                packages: prev.costing.packages.filter(p => p.package_id !== packageId),
                selected_package_id: prev.costing.packages.length > 1 ?
                    (prev.costing.packages.find(p => p.package_id !== packageId)?.package_id || null) :
                    null
            }
        }));
    };

    const addComponent = (packageId, componentType = 'hotel') => {
        const componentTitles = {
            hotel: 'Hotel Options',
            transport: 'Transport Options',
            activity: 'Activity Options',
            custom: 'Custom Component'
        };

        setFormData(prev => ({
            ...prev,
            costing: {
                ...prev.costing,
                packages: prev.costing.packages.map(pkg => {
                    if (pkg.package_id === packageId) {
                        const newComponent = {
                            component_type: componentType,
                            component_title: componentTitles[componentType] || 'Component',
                            variants: [{
                                title: '',
                                description: '',
                                image_urls: [],
                                price_per_person: 0,
                                is_selected: pkg.components.length === 0
                            }]
                        };
                        return { ...pkg, components: [...pkg.components, newComponent] };
                    }
                    return pkg;
                })
            }
        }));
    };

    const addVariant = (packageId, componentIndex) => {
        setFormData(prev => ({
            ...prev,
            costing: {
                ...prev.costing,
                packages: prev.costing.packages.map(pkg => {
                    if (pkg.package_id === packageId) {
                        const updatedComponents = [...pkg.components];
                        updatedComponents[componentIndex].variants.push({
                            title: '',
                            description: '',
                            image_urls: [],
                            price_per_person: 0,
                            is_selected: false
                        });
                        return { ...pkg, components: updatedComponents };
                    }
                    return pkg;
                })
            }
        }));
    };

    const updatePackageField = (packageId, componentIndex, variantIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            costing: {
                ...prev.costing,
                packages: prev.costing.packages.map(pkg => {
                    if (pkg.package_id === packageId) {
                        if (componentIndex === undefined) {
                            return { ...pkg, [field]: value };
                        } else if (variantIndex === undefined) {
                            const updatedComponents = [...pkg.components];
                            if (field === 'remove') {
                                return { ...pkg, components: updatedComponents.filter((_, idx) => idx !== componentIndex) };
                            }
                            updatedComponents[componentIndex][field] = value;
                            return { ...pkg, components: updatedComponents };
                        } else {
                            if (field === 'remove') {
                                const updatedComponents = [...pkg.components];
                                updatedComponents[componentIndex].variants =
                                    updatedComponents[componentIndex].variants.filter((_, idx) => idx !== variantIndex);
                                return { ...pkg, components: updatedComponents };
                            } else {
                                const updatedComponents = [...pkg.components];
                                updatedComponents[componentIndex].variants[variantIndex][field] = value;
                                return { ...pkg, components: updatedComponents };
                            }
                        }
                    }
                    return pkg;
                })
            }
        }));
    };

    const selectVariant = (packageId, componentIndex, variantIndex) => {
        setFormData(prev => ({
            ...prev,
            costing: {
                ...prev.costing,
                packages: prev.costing.packages.map(pkg => {
                    if (pkg.package_id === packageId) {
                        const updatedComponents = [...pkg.components];
                        updatedComponents[componentIndex].variants =
                            updatedComponents[componentIndex].variants.map((v, idx) => ({
                                ...v,
                                is_selected: idx === variantIndex
                            }));
                        return { ...pkg, components: updatedComponents };
                    }
                    return pkg;
                })
            }
        }));
    };

    // Itinerary Management
    const addItineraryDay = () => {
        const newDay = (formData.itinerary || []).length + 1;
        setFormData(prev => ({
            ...prev,
            itinerary: [...(prev.itinerary || []), { day: newDay, title: `Day ${newDay} Title`, description: '' }]
        }));
    };

    const removeItineraryDay = (index) => {
        setFormData(prev => ({
            ...prev,
            itinerary: prev.itinerary.filter((_, i) => i !== index).map((it, idx) => ({ ...it, day: idx + 1 }))
        }));
    };

    const handleItineraryChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            itinerary: prev.itinerary.map((it, i) => i === index ? { ...it, [field]: value } : it)
        }));
    };

    // Simple Items Management
    const addCostingItem = () => {
        setFormData(prev => ({
            ...prev,
            costing: {
                ...prev.costing,
                items: [...(prev.costing.items || []), { name: '', description: '', quantity: 1, unit_price: 0 }]
            }
        }));
    };

    const removeCostingItem = (index) => {
        setFormData(prev => ({
            ...prev,
            costing: { ...prev.costing, items: prev.costing.items.filter((_, i) => i !== index) }
        }));
    };

    const handleCostingItemChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            costing: {
                ...prev.costing,
                items: prev.costing.items.map((it, i) => i === index ? { ...it, [field]: value } : it)
            }
        }));
    };

    // Submit Handler
    const handleSubmit = async (sendNow = false, proceedToNext = false) => {
        setSubmitting(true);
        setFormError(null);
        setSaveSuccess(false);

        try {
            const payload = {
                lead_id: formData.lead_id || 0,
                design: formData.design,
                agent: formData.agent,
                company: formData.company,
                trip: {
                    trip_id: formData.trip_id,
                    display_title: formData.display_title,
                    overview: formData.overview,
                    hero_image: formData.hero_image,
                    gallery_images: formData.gallery_images,
                    sections: []
                },
                itinerary: formData.itinerary,
                costing: {
                    ...formData.costing,
                    packages: formData.costing.packages.map(pkg => ({
                        ...pkg,
                        components: pkg.components.map(comp => ({
                            ...comp,
                            variants: comp.variants.map(v => ({
                                ...v,
                                image_urls: v.image_urls.filter(url => url),
                                image_url: undefined // Ensure deprecated field is not sent
                            }))
                        }))
                    }))
                },
                policies: formData.policies,
                payment: formData.payment,
                status: sendNow ? 'Sent' : 'Draft',
                amount: formData.amount,
                date: formData.date,
                client_name: formData.client_name,
                client_email: formData.client_email,
                client_mobile: formData.client_mobile,
                hero_image: formData.hero_image,
                gallery_images: formData.gallery_images
            };

            const method = quotation?.id ? 'PUT' : 'POST';
            const endpoint = quotation?.id ? `${QUOTATION_API}${quotation.id}` : QUOTATION_API;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.success !== false) {
                if (sendNow) {
                    setSendDialogOpen(true);
                } else {
                    setSaveSuccess(true);
                    if (proceedToNext) handleNext();
                }
            } else {
                setFormError(result.message || 'Failed to save quotation');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setFormError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // UI Helpers (omitted for brevity, assume renderStepHeader and getComponentIcon are correct)
    const renderStepHeader = (title, subtitle, Icon) => (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            p: 2.5,
            bgcolor: '#e3f2fd',
            borderRadius: 1,
            borderLeft: '5px solid #1976d2',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            minHeight: 80
        }}>
            <Icon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            </Box>
        </Box>
    );

    const getComponentIcon = (type) => {
        switch (type) {
            case 'hotel': return <HotelIcon sx={{ color: 'primary.main' }} />;
            case 'transport': return <TransportIcon sx={{ color: 'secondary.main' }} />;
            case 'activity': return <FlightTakeoffIcon sx={{ color: 'info.main' }} />;
            default: return <CategoryIcon sx={{ color: 'text.secondary' }} />;
        }
    };

    // Step Renderers
    const renderStep = () => {
        switch (activeStep) {
            case 0: // Design Selection
                return (
                    <Box sx={{ p: 2 }}>
                        {renderStepHeader("Choose Your Design Template", "Select the visual theme for the client's quotation document.", CheckCircleIcon)}
                        <Grid container spacing={4}>
                            {[
                                { name: 'Modern Professional', desc: 'Clean gradient design with modern aesthetics', color: '#667eea' },
                                { name: 'Luxury Gold', desc: 'Premium gold-themed elegant template', color: '#D4AF37' },
                                { name: 'Minimalist Classic', desc: 'Simple, professional black & white', color: '#000' }
                            ].map(design => (
                                <Grid item xs={12} md={4} key={design.name}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            border: formData.design === design.name ? `4px solid ${design.color}` : '2px solid #e0e0e0',
                                            boxShadow: formData.design === design.name ? 8 : 2,
                                            transition: 'all 0.3s',
                                            height: '100%',
                                            '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }
                                        }}
                                        onClick={() => setFormData(prev => ({ ...prev, design: design.name }))}
                                    >
                                        <CardContent sx={{ textAlign: 'center', py: 5, position: 'relative' }}>
                                            {formData.design === design.name && (
                                                <CheckCircleIcon sx={{ position: 'absolute', top: 16, right: 16, color: design.color, fontSize: 32 }} />
                                            )}
                                            <Avatar sx={{ width: 80, height: 80, margin: '0 auto 16px', bgcolor: design.color, fontSize: 40 }}>📄</Avatar>
                                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>{design.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{design.desc}</Typography>
                                            {formData.design === design.name && <Chip label="Selected" color="primary" sx={{ mt: 2 }} />}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                );

            case 1: // Customer Info
                return (
                    <Box sx={{ p: 2 }}>
                        {renderStepHeader("Customer & Company Information", "Define who the quotation is for and who it's from.", PersonIcon)}
                        <Paper elevation={3} sx={{ p: 3, mb: 4, borderLeft: '5px solid #ff9800' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff9800' }}>Select Existing Lead</Typography>
                            <Autocomplete
                                options={availableLeads}
                                getOptionLabel={(option) => option.label || ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={availableLeads.find(l => l.id === formData.lead_id) || null}
                                onChange={handleLeadSelect}
                                renderInput={(params) => <TextField {...params} label="Search Lead" placeholder="Start typing..." fullWidth size="small" />}
                            />
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, mb: 4, borderLeft: '5px solid #2196f3' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2196f3' }}>Client Details</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Client Name *" required value={formData.client_name} onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))} size="small" />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Client Email" type="email" value={formData.client_email} onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))} size="small" />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Client Mobile" value={formData.client_mobile} onChange={(e) => setFormData(prev => ({ ...prev, client_mobile: e.target.value }))} size="small" />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, borderLeft: '5px solid #4caf50' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#4caf50' }}>Agent & Company Details</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Agent Name" value={formData.agent.name} onChange={(e) => handleInputChange(e, 'agent', 'name')} size="small" />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Company Name" value={formData.company.name} onChange={(e) => handleInputChange(e, 'company', 'name')} size="small" />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Company Email" type="email" value={formData.company.email} onChange={(e) => handleInputChange(e, 'company', 'email')} size="small" />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );

            case 2: // Trip Details
                return (
                    <Box sx={{ p: 2 }}>
                        {renderStepHeader("Trip Package Details & Media", "Outline the package content and upload supporting media.", FlightTakeoffIcon)}
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={[{ id: null, title: '-- Custom Trip --' }, ...availableTrips]}
                                        getOptionLabel={(option) => option.title || '-- Custom Trip --'}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={availableTrips.find(t => t.id === formData.trip_id) || { id: null, title: '-- Custom Trip --' }}
                                        onChange={handleTripSelect}
                                        renderInput={(params) => <TextField {...params} label="Select Published Trip (optional)" placeholder="Search..." fullWidth size="small" />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Display Title *" required value={formData.display_title} onChange={(e) => setFormData(prev => ({ ...prev, display_title: e.target.value }))} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Overview / Description"
                                        multiline
                                        rows={8}
                                        value={formData.overview}
                                        onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                                        placeholder="Describe the trip package in detail..."
                                        sx={{ '& textarea': { fontSize: '16px', lineHeight: '1.6' } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Trip Images</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={1} sx={{ border: '2px dashed #1976d2', borderRadius: 2, p: 3, textAlign: 'center', minHeight: 320 }}>
                                        <ImageIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Hero Image</Typography>
                                        {formData.hero_image && (
                                            <Box sx={{ mb: 2, position: 'relative' }}>
                                                <img src={formData.hero_image} alt="Hero" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
                                                <IconButton size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'error.main', color: 'white' }} onClick={() => setFormData(prev => ({ ...prev, hero_image: '' }))}>
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Box>
                                        )}
                                        <input accept="image/*" style={{ display: 'none' }} id="hero-upload" type="file" onChange={handleHeroUpload} disabled={uploadingHero} />
                                        <label htmlFor="hero-upload">
                                            <Button variant="contained" component="span" startIcon={uploadingHero ? <CircularProgress size={20} /> : <CloudUploadIcon />} disabled={uploadingHero}>
                                                {uploadingHero ? 'Uploading...' : 'Upload Hero Image'}
                                            </Button>
                                        </label>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={1} sx={{ border: '2px dashed #4caf50', borderRadius: 2, p: 3, textAlign: 'center', minHeight: 320 }}>
                                        <ImageIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
                                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Gallery Images</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, justifyContent: 'center' }}>
                                            {formData.gallery_images.map((img, idx) => (
                                                <Box key={idx} sx={{ position: 'relative', width: 80, height: 80 }}>
                                                    <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                                                    <IconButton size="small" sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'white' }} onClick={() => setFormData(prev => ({ ...prev, gallery_images: prev.gallery_images.filter((_, i) => i !== idx) }))}>
                                                        <DeleteIcon fontSize="inherit" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                        <input accept="image/*" style={{ display: 'none' }} id="gallery-upload" type="file" multiple onChange={(e) => handleMultipleImageUpload(e.target.files)} disabled={uploadingGallery} />
                                        <label htmlFor="gallery-upload">
                                            <Button variant="contained" component="span" startIcon={uploadingGallery ? <CircularProgress size={20} /> : <CloudUploadIcon />} disabled={uploadingGallery} color="success">
                                                {uploadingGallery ? 'Uploading...' : 'Upload Gallery'}
                                            </Button>
                                        </label>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );

            case 3: // Itinerary
                return (
                    <Box sx={{ p: 2 }}>
                        {renderStepHeader("Day-wise Itinerary Builder", "Structure the trip activities for each day.", ListAltIcon)}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={addItineraryDay} size="large">Add New Day</Button>
                        </Box>
                        {(formData.itinerary || []).map((it, idx) => (
                            <Card key={idx} sx={{ mb: 3, bgcolor: '#fafafa', borderLeft: '5px solid #ff9800' }} elevation={4}>
                                <CardContent>
                                    <Grid container spacing={3} alignItems="flex-start">
                                        <Grid item xs={12} md={4}>
                                            <TextField fullWidth label={`Day ${it.day} Title`} value={it.title} onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)} sx={{ bgcolor: '#fff' }} size="small" />
                                        </Grid>
                                        <Grid item xs={12} md={7}>
                                            <TextField
                                                fullWidth
                                                label={`Day ${it.day} Description`}
                                                multiline
                                                rows={5}
                                                value={it.description}
                                                onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)}
                                                sx={{ bgcolor: '#fff', '& textarea': { fontSize: '15px', lineHeight: '1.5' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            {formData.itinerary.length > 1 && (
                                                <IconButton color="error" onClick={() => removeItineraryDay(idx)} size="medium">
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                );

            case 4: // Costing
                return (
                    <Box sx={{ p: 2 }}>
                        {renderStepHeader("Costing & Pricing", "Create flexible package options or simple itemized costing.", MonetizationOnIcon)}
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            You must add at least one package or one item to proceed to the next step.
                        </Alert>
                        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#e3f2fd' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Select Costing Method</Typography>
                            <ToggleButtonGroup
                                value={formData.costing.type}
                                exclusive
                                onChange={(e, newType) => { if (newType) setFormData(prev => ({ ...prev, costing: { ...prev.costing, type: newType } })); }}
                                fullWidth
                                color="primary"
                            >
                                <ToggleButton value="package">Package-Based (Recommended)</ToggleButton>
                                <ToggleButton value="person">Simple Items</ToggleButton>
                            </ToggleButtonGroup>
                        </Paper>

                        {formData.costing.type === 'package' ? (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={addPackage}>Add Package</Button>
                                </Box>
                                {formData.costing.packages.map((pkg, pkgIndex) => (
                                    <Paper key={pkg.package_id} elevation={4} sx={{ mb: 4, p: 3, bgcolor: '#f1f8e9' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                            <Typography variant="h5" fontWeight="bold">Package {pkgIndex + 1}</Typography>
                                            {formData.costing.packages.length > 1 && (
                                                <IconButton color="error" onClick={() => removePackage(pkg.package_id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                        <Grid container spacing={3} sx={{ mb: 3 }}>
                                            <Grid item xs={12} md={6}>
                                                <TextField fullWidth label="Package Name" value={pkg.package_name} onChange={(e) => updatePackageField(pkg.package_id, undefined, undefined, 'package_name', e.target.value)} size="small" />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField fullWidth label="Package Description" value={pkg.package_description} onChange={(e) => updatePackageField(pkg.package_id, undefined, undefined, 'package_description', e.target.value)} size="small" />
                                            </Grid>
                                        </Grid>

                                        {pkg.components.map((component, compIndex) => (
                                            <Card key={compIndex} sx={{ mb: 3, bgcolor: '#fff' }} elevation={2}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {getComponentIcon(component.component_type)}
                                                            <TextField
                                                                label="Component Title"
                                                                size="small"
                                                                value={component.component_title}
                                                                onChange={(e) => updatePackageField(pkg.package_id, compIndex, undefined, 'component_title', e.target.value)}
                                                            />
                                                        </Box>
                                                        <IconButton color="error" size="small" onClick={() => updatePackageField(pkg.package_id, compIndex, undefined, 'remove', true)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>

                                                    {component.variants.map((variant, varIndex) => (
                                                        <Paper key={varIndex} sx={{ p: 2, mb: 2, bgcolor: variant.is_selected ? '#e8f5e9' : '#f5f5f5' }}>
                                                            <Grid container spacing={2} alignItems="flex-start">
                                                                <Grid item xs={12}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <Chip label={variant.is_selected ? 'Selected' : 'Option'} color={variant.is_selected ? 'success' : 'default'} size="small" />
                                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                                            {!variant.is_selected && (
                                                                                <Button size="small" variant="outlined" onClick={() => selectVariant(pkg.package_id, compIndex, varIndex)}>Select</Button>
                                                                            )}
                                                                            {component.variants.length > 1 && (
                                                                                <IconButton color="error" size="small" onClick={() => updatePackageField(pkg.package_id, compIndex, varIndex, 'remove', true)}>
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={12} md={3}>
                                                                    <TextField fullWidth size="small" label="Title" value={variant.title} onChange={(e) => updatePackageField(pkg.package_id, compIndex, varIndex, 'title', e.target.value)} />
                                                                </Grid>
                                                                <Grid item xs={12} md={5}>
                                                                    <TextField fullWidth size="small" label="Description" multiline rows={3} value={variant.description} onChange={(e) => updatePackageField(pkg.package_id, compIndex, varIndex, 'description', e.target.value)} />
                                                                </Grid>
                                                                <Grid item xs={12} md={2}>
                                                                    <TextField fullWidth size="small" type="number" label="Price (₹)" value={variant.price_per_person} onChange={(e) => updatePackageField(pkg.package_id, compIndex, varIndex, 'price_per_person', Number(e.target.value))} />
                                                                </Grid>
                                                                <Grid item xs={12} md={2}>
                                                                    <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>Variant Images</Typography>
                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                                                        {(variant.image_urls || []).map((imgUrl, imageIdx) => (
                                                                            <Box key={imageIdx} sx={{ position: 'relative', width: 40, height: 40 }}>
                                                                                <img src={imgUrl} alt={`Variant ${imageIdx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }} />
                                                                                <IconButton
                                                                                    size="small"
                                                                                    sx={{ position: 'absolute', top: -5, right: -5, bgcolor: 'error.main', color: 'white', p: 0.2 }}
                                                                                    onClick={() => removeComponentImage(pkg.package_id, compIndex, varIndex, imageIdx)}
                                                                                >
                                                                                    <DeleteIcon fontSize="inherit" sx={{ fontSize: 10 }} />
                                                                                </IconButton>
                                                                            </Box>
                                                                        ))}
                                                                    </Box>

                                                                    <input
                                                                        accept="image/*"
                                                                        style={{ display: 'none' }}
                                                                        id={`comp-${pkg.package_id}-${compIndex}-${varIndex}`}
                                                                        type="file"
                                                                        multiple
                                                                        onChange={(e) => handleComponentMultipleImageUpload(e.target.files, pkg.package_id, compIndex, varIndex)}
                                                                        disabled={uploadingComponentImages[`${pkg.package_id}-${compIndex}-${varIndex}`]}
                                                                    />
                                                                    <label htmlFor={`comp-${pkg.package_id}-${compIndex}-${varIndex}`}>
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            component="span"
                                                                            fullWidth
                                                                            disabled={uploadingComponentImages[`${pkg.package_id}-${compIndex}-${varIndex}`]}
                                                                        >
                                                                            {uploadingComponentImages[`${pkg.package_id}-${compIndex}-${varIndex}`] ? 'Uploading...' : 'Upload Images'}
                                                                        </Button>
                                                                    </label>
                                                                </Grid>
                                                            </Grid>
                                                        </Paper>
                                                    ))}
                                                    <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => addVariant(pkg.package_id, compIndex)}>
                                                        Add Option
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        <Paper sx={{ p: 2, mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>Add Component:</Typography>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button variant="outlined" startIcon={<HotelIcon />} onClick={() => addComponent(pkg.package_id, 'hotel')}>Hotel</Button>
                                                <Button variant="outlined" startIcon={<TransportIcon />} onClick={() => addComponent(pkg.package_id, 'transport')}>Transport</Button>
                                                <Button variant="outlined" startIcon={<FlightTakeoffIcon />} onClick={() => addComponent(pkg.package_id, 'activity')}>Activity</Button>
                                                <Button variant="outlined" startIcon={<CategoryIcon />} onClick={() => addComponent(pkg.package_id, 'custom')}>Custom</Button>
                                            </Box>
                                        </Paper>

                                        <Paper elevation={3} sx={{ p: 3, bgcolor: '#4caf50', color: '#fff' }}>
                                            <Grid container justifyContent="space-between">
                                                <Grid item><Typography variant="h6" fontWeight="bold">PACKAGE TOTAL:</Typography></Grid>
                                                <Grid item><Typography variant="h4" fontWeight="bold">₹{calculatePackageTotal(pkg).toLocaleString('en-IN')}</Typography></Grid>
                                            </Grid>
                                        </Paper>
                                    </Paper>
                                ))}
                            </>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={addCostingItem}>Add Cost Item</Button>
                                </Box>
                                <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}><Typography fontWeight="bold">Item Name</Typography></Grid>
                                        <Grid item xs={3}><Typography fontWeight="bold">Description</Typography></Grid>
                                        <Grid item xs={1.5}><Typography fontWeight="bold">Qty</Typography></Grid>
                                        <Grid item xs={2}><Typography fontWeight="bold">Price (₹)</Typography></Grid>
                                        <Grid item xs={1.5}><Typography fontWeight="bold">Total</Typography></Grid>
                                        <Grid item xs={1}></Grid>
                                    </Grid>
                                </Paper>
                                {(formData.costing.items || []).map((it, idx) => (
                                    <Card key={idx} sx={{ mb: 2 }} elevation={1}>
                                        <CardContent sx={{ p: 2 }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={3}>
                                                    <TextField fullWidth size="small" label="Item Name" value={it.name} onChange={(e) => handleCostingItemChange(idx, 'name', e.target.value)} />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField fullWidth size="small" label="Description" multiline rows={2} value={it.description || ''} onChange={(e) => handleCostingItemChange(idx, 'description', e.target.value)} />
                                                </Grid>
                                                <Grid item xs={1.5}>
                                                    <TextField fullWidth size="small" type="number" label="Qty" value={it.quantity} onChange={(e) => handleCostingItemChange(idx, 'quantity', e.target.value)} />
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <TextField fullWidth size="small" type="number" label="Price" value={it.unit_price} onChange={(e) => handleCostingItemChange(idx, 'unit_price', e.target.value)} />
                                                </Grid>
                                                <Grid item xs={1.5} sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body1" fontWeight="bold" color="success.main">
                                                        ₹{(Number(it.quantity || 0) * Number(it.unit_price || 0)).toLocaleString('en-IN')}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1} sx={{ textAlign: 'center' }}>
                                                    <IconButton color="error" onClick={() => removeCostingItem(idx)} size="small">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Paper elevation={4} sx={{ mt: 4, p: 3, bgcolor: '#4caf50', color: '#fff' }}>
                                    <Grid container justifyContent="space-between">
                                        <Grid item><Typography variant="h5" fontWeight="bold">GRAND TOTAL:</Typography></Grid>
                                        <Grid item><Typography variant="h4" fontWeight="bold">₹{Number(formData.costing.total_amount || 0).toLocaleString('en-IN')}</Typography></Grid>
                                    </Grid>
                                </Paper>
                            </>
                        )}
                    </Box>
                );

            case 5: // Policies
                return (
                    <Box sx={{ p: 2 }}>
                        {renderStepHeader("Terms & Policies", "Set the contractual agreements for the quotation.", GavelIcon)}
                        <Paper elevation={3} sx={{ p: 4 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <TextField fullWidth multiline rows={6} label="Payment Terms" value={formData.policies.payment_terms} onChange={(e) => handleInputChange(e, 'policies', 'payment_terms')} placeholder="Enter payment terms..." sx={{ '& textarea': { fontSize: '15px', lineHeight: '1.5' } }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth multiline rows={6} label="Cancellation Policy" value={formData.policies.cancellation_policy} onChange={(e) => handleInputChange(e, 'policies', 'cancellation_policy')} placeholder="Enter cancellation policy..." sx={{ '& textarea': { fontSize: '15px', lineHeight: '1.5' } }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth multiline rows={6} label="Terms & Conditions" value={formData.policies.terms_and_conditions} onChange={(e) => handleInputChange(e, 'policies', 'terms_and_conditions')} placeholder="Enter T&C..." sx={{ '& textarea': { fontSize: '15px', lineHeight: '1.5' } }} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );

            case 6: // Payment
                return (
                    <Box sx={{ p: 2 }}>
                        {renderStepHeader("Payment Details", "Provide bank and UPI information for payment collection.", CreditCardIcon)}
                        <Paper elevation={3} sx={{ p: 4 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}><TextField fullWidth label="Bank Name" value={formData.payment.bank_name} onChange={(e) => handleInputChange(e, 'payment', 'bank_name')} size="small" /></Grid>
                                <Grid item xs={12} md={6}><TextField fullWidth label="Account Number" value={formData.payment.account_number} onChange={(e) => handleInputChange(e, 'payment', 'account_number')} size="small" /></Grid>
                                <Grid item xs={12} md={6}><TextField fullWidth label="IFSC Code" value={formData.payment.ifsc_code} onChange={(e) => handleInputChange(e, 'payment', 'ifsc_code')} size="small" /></Grid>
                                <Grid item xs={12} md={6}><TextField fullWidth label="Branch Name" value={formData.payment.branch_name} onChange={(e) => handleInputChange(e, 'payment', 'branch_name')} size="small" /></Grid>
                                <Grid item xs={12} md={6}><TextField fullWidth label="GST Number" value={formData.payment.gst_number} onChange={(e) => handleInputChange(e, 'payment', 'gst_number')} size="small" /></Grid>
                                <Grid item xs={12} md={6}><TextField fullWidth label="UPI ID" value={(formData.payment.upi_ids || [])[0] || ''} onChange={(e) => setFormData(prev => ({ ...prev, payment: { ...prev.payment, upi_ids: e.target.value ? [e.target.value] : [] } }))} placeholder="yourname@upi" size="small" /></Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ p: 3, border: '2px dashed #9c27b0', borderRadius: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#9c27b0' }}>Upload QR Code</Typography>
                                        {formData.payment.qr_code_url ? (
                                            <Box>
                                                <img src={formData.payment.qr_code_url} alt="QR" style={{ maxWidth: '200px', marginBottom: '16px', border: '3px solid #9c27b0', borderRadius: 8 }} />
                                                <Box>
                                                    <Button variant="outlined" color="error" onClick={() => setFormData(prev => ({ ...prev, payment: { ...prev.payment, qr_code_url: '' } }))}>Remove QR</Button>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box>
                                                <input accept="image/*" style={{ display: 'none' }} id="qr-upload" type="file" onChange={handleQRUpload} disabled={uploadingQR} />
                                                <label htmlFor="qr-upload">
                                                    <Button variant="contained" component="span" startIcon={uploadingQR ? <CircularProgress size={20} /> : <CloudUploadIcon />} disabled={uploadingQR} color="secondary">
                                                        {uploadingQR ? 'Uploading...' : 'Upload QR Code'}
                                                    </Button>
                                                </label>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );

            default:
                return <Typography>Unknown step</Typography>;
        }
    };

    return (
        <Box>
            {formError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError(null)}>{formError}</Alert>}
            {saveSuccess && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaveSuccess(false)}>Quotation saved successfully!</Alert>}

            <Box sx={{ minHeight: '60vh' }}>{renderStep()}</Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, borderTop: '2px solid #e0e0e0', mt: 4 }}>
                <Button onClick={handleBack} disabled={activeStep === 0} variant="outlined" size="large" startIcon={<BackIcon />}>BACK</Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button onClick={() => handleClose(false)} variant="outlined" size="large" color="error">CANCEL</Button>
                    {formData.design && <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={() => setPreviewOpen(true)} size="large">PREVIEW</Button>}
                    <Button onClick={() => handleSubmit(false, false)} variant="contained" color="success" disabled={submitting} size="large" startIcon={<SaveIcon />}>
                        {submitting ? <CircularProgress size={20} /> : 'SAVE DRAFT'}
                    </Button>
                    {activeStep !== STEPS - 1 ? (
                        <Button variant="contained" onClick={() => quotation?.id ? handleSubmit(false, true) : handleNext()} size="large" disabled={submitting && !quotation?.id} endIcon={<ForwardIcon />}>NEXT</Button>
                    ) : (
                        <Button onClick={() => handleSubmit(true, false)} variant="contained" color="primary" disabled={submitting} size="large" startIcon={<SendIcon />}>
                            {submitting ? <CircularProgress size={20} /> : 'SAVE & SEND'}
                        </Button>
                    )}
                </Box>
            </Box>

            <QuotationViewDialog open={previewOpen} onClose={() => setPreviewOpen(false)} quotation={{ ...formData, id: quotation?.id }} onEdit={() => setPreviewOpen(false)} />
            <Dialog open={sendDialogOpen} onClose={() => { setSendDialogOpen(false); handleClose(true); }}>
                <DialogTitle>✅ Quotation {quotation?.id ? 'Updated' : 'Created'} Successfully!</DialogTitle>
                <DialogContent><Typography>The quotation has been saved and marked as "Sent".</Typography></DialogContent>
                <DialogActions><Button onClick={() => { setSendDialogOpen(false); handleClose(true); }} variant="contained">Close</Button></DialogActions>
            </Dialog>
        </Box>
    );
};

export default QuotationFormSteps;