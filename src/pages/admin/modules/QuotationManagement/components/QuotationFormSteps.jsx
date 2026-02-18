// QuotationFormSteps.jsx - FINAL PRODUCTION VERSION with Multi-Image & Validation
// ✅ All UI fixes applied
// ✅ Matches backend schema exactly
// ✅ Package-based costing with components & variants (using image_urls array)
// ✅ Simple items with description
// ✅ Searchable dropdowns
// ✅ Large text editors
// ✅ Proper error handling
// 🚨 NEW: Added mandatory check for costing data (Step 4)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    design: 'Magazine Modern',
    lead_id: 0,
    lead_source: '',
    client_name: '',
    client_email: '',
    client_mobile: '',
    agent: { name: 'Agent Name', email: 'sales@indianmountainrovers.com', contact: '+91 82788 29941' },
    company: {
        name: 'Indian Mountain Rovers',
        email: 'sales@indianmountainrovers.com',
        mobile: '+91 82788 29941',
        website: 'https://www.indianmountainrovers.com',
        address: 'Near Govt. Printing Press, Lower Chakkar, Shimla–Manali Highway, NH205, HP - 171005',
        licence: 'TRV-12345',
        logo_url: ''
    },
    trip_id: null,
    display_title: '',
    overview: '',
    hero_image: '',
    gallery_images: [],
    inclusions: [],
    exclusions: [],
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
                // Restore inclusions/exclusions from trip or root
                inclusions: normalizedQuotation.trip?.inclusions || normalizedQuotation.inclusions || [],
                exclusions: normalizedQuotation.trip?.exclusions || normalizedQuotation.exclusions || [],
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

    // ── COMPUTED TOTAL (useMemo avoids stale-closure / shallow-compare bugs) ──
    const computedTotal = useMemo(() => {
        if (formData.costing.type === 'package' && formData.costing.packages?.length) {
            const selectedPkg =
                formData.costing.packages.find(p => p.package_id === formData.costing.selected_package_id)
                || formData.costing.packages.find(p => p.is_active)
                || formData.costing.packages[0];
            if (!selectedPkg) return 0;
            return (selectedPkg.components || []).reduce((sum, comp) => {
                const sel = comp.variants?.find(v => v.is_selected) || comp.variants?.[0];
                return sum + (Number(sel?.price_per_person) || 0);
            }, 0);
        }
        if (formData.costing.type === 'person' && formData.costing.items?.length) {
            return formData.costing.items.reduce(
                (s, it) => s + (Number(it.quantity || 0) * Number(it.unit_price || 0)), 0
            );
        }
        return 0;
        // JSON.stringify gives deep comparison so any nested price change triggers recalc
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(formData.costing)]);

    // Sync computed total back into formData
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            costing: { ...prev.costing, total_amount: computedTotal },
            amount: computedTotal
        }));
    }, [computedTotal]);

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

            // Parse inclusions/exclusions — may be array of strings or array of objects
            const parseList = (raw) => {
                if (!raw) return [];
                if (Array.isArray(raw)) return raw.map(item => typeof item === 'string' ? item : (item.text || item.title || item.name || JSON.stringify(item)));
                if (typeof raw === 'string') return raw.split('\n').filter(Boolean);
                return [];
            };

            setFormData(prev => ({
                ...prev,
                trip_id: selectedTrip.id,
                display_title: full.display_title || full.title || selectedTrip.title || '',
                overview: full.overview || selectedTrip.overview || '',
                hero_image: full.hero_image || selectedTrip.hero_image || '',
                gallery_images: full.gallery_images || selectedTrip.gallery_images || [],
                inclusions: parseList(full.inclusions),
                exclusions: parseList(full.exclusions),
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
                    if (pkg.package_id !== packageId) return pkg;

                    // Package-level field
                    if (componentIndex === undefined) {
                        return { ...pkg, [field]: value };
                    }

                    // Component-level
                    const updatedComponents = pkg.components.map((comp, ci) => {
                        if (ci !== componentIndex) return comp;

                        // Remove component
                        if (field === 'remove' && variantIndex === undefined) return null;

                        // Variant-level
                        if (variantIndex !== undefined) {
                            const updatedVariants = comp.variants
                                .map((v, vi) => {
                                    if (vi !== variantIndex) return v;
                                    if (field === 'remove') return null;
                                    return { ...v, [field]: value }; // ← immutable spread
                                })
                                .filter(Boolean);
                            return { ...comp, variants: updatedVariants };
                        }

                        // Component field
                        return { ...comp, [field]: value };
                    }).filter(Boolean);

                    return { ...pkg, components: updatedComponents };
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
                    inclusions: formData.inclusions || [],
                    exclusions: formData.exclusions || [],
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
            bgcolor: '#e8f0ef',
            borderRadius: 1,
            borderLeft: '5px solid #1A3C40',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            minHeight: 80
        }}>
            <Icon sx={{ fontSize: 40, color: '#1A3C40', mr: 2 }} />
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C40' }}>{title}</Typography>
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
                                { name: 'Magazine Modern', desc: 'Immersive, visual travel magazine style', color: '#1A3C40' },
                                { name: 'Corporate Structured', desc: 'Clean, detailed, invoice-style layout', color: '#D4A017' }
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
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Inclusions & Exclusions</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Auto-filled from trip. Edit as needed — one item per line.</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="✅ Inclusions"
                                        multiline
                                        rows={6}
                                        value={(formData.inclusions || []).join('\n')}
                                        onChange={(e) => setFormData(prev => ({ ...prev, inclusions: e.target.value.split('\n') }))}
                                        placeholder="e.g. Accommodation&#10;Meals&#10;Transport"
                                        sx={{ '& textarea': { fontSize: '14px' } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="❌ Exclusions"
                                        multiline
                                        rows={6}
                                        value={(formData.exclusions || []).join('\n')}
                                        onChange={(e) => setFormData(prev => ({ ...prev, exclusions: e.target.value.split('\n') }))}
                                        placeholder="e.g. Airfare&#10;Personal expenses&#10;Tips"
                                        sx={{ '& textarea': { fontSize: '14px' } }}
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

                        {/* Mode Selector */}
                        <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#555' }}>Costing Method</Typography>
                            <ToggleButtonGroup
                                value={formData.costing.type}
                                exclusive
                                onChange={(e, newType) => { if (newType) setFormData(prev => ({ ...prev, costing: { ...prev.costing, type: newType } })); }}
                                size="small"
                                color="primary"
                            >
                                <ToggleButton value="package" sx={{ px: 3 }}>📦 Package-Based</ToggleButton>
                                <ToggleButton value="person" sx={{ px: 3 }}>📋 Simple Items</ToggleButton>
                            </ToggleButtonGroup>
                        </Paper>

                        {formData.costing.type === 'package' ? (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={addPackage}>Add Package</Button>
                                </Box>

                                {formData.costing.packages.map((pkg, pkgIndex) => {
                                    // Per-package total computed inline (no stale closure)
                                    const pkgTotal = (pkg.components || []).reduce((sum, comp) => {
                                        const sel = comp.variants?.find(v => v.is_selected) || comp.variants?.[0];
                                        return sum + (Number(sel?.price_per_person) || 0);
                                    }, 0);

                                    return (
                                        <Paper key={pkg.package_id} elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                                            {/* Package Header */}
                                            <Box sx={{ px: 3, py: 2, bgcolor: '#1a3c40', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', minWidth: 80 }}>Package {pkgIndex + 1}</Typography>
                                                    <TextField
                                                        size="small"
                                                        value={pkg.package_name}
                                                        onChange={(e) => updatePackageField(pkg.package_id, undefined, undefined, 'package_name', e.target.value)}
                                                        placeholder="Package name..."
                                                        variant="standard"
                                                        InputProps={{ disableUnderline: false, sx: { color: '#fff', fontSize: '1rem', fontWeight: 700, '&:before': { borderColor: 'rgba(255,255,255,0.3)' }, '&:after': { borderColor: '#fff' } } }}
                                                        sx={{ flex: 1 }}
                                                    />
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#d4a017' }}>₹{pkgTotal.toLocaleString('en-IN')}</Typography>
                                                    {formData.costing.packages.length > 1 && (
                                                        <IconButton size="small" onClick={() => removePackage(pkg.package_id)} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#ff5252' } }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                {/* Components */}
                                                {pkg.components.map((component, compIndex) => {
                                                    const selVariant = component.variants?.find(v => v.is_selected) || component.variants?.[0];
                                                    const compPrice = Number(selVariant?.price_per_person) || 0;
                                                    return (
                                                        <Paper key={compIndex} elevation={0} sx={{ mb: 2.5, border: '1px solid #e8e8e8', borderRadius: 2, overflow: 'hidden' }}>
                                                            {/* Component Header */}
                                                            <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e8e8e8' }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    {getComponentIcon(component.component_type)}
                                                                    <TextField
                                                                        size="small"
                                                                        value={component.component_title}
                                                                        onChange={(e) => updatePackageField(pkg.package_id, compIndex, undefined, 'component_title', e.target.value)}
                                                                        variant="standard"
                                                                        InputProps={{ disableUnderline: true, sx: { fontWeight: 600, fontSize: '0.95rem' } }}
                                                                        placeholder="Component name..."
                                                                    />
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a3c40' }}>₹{compPrice.toLocaleString('en-IN')}</Typography>
                                                                    <IconButton size="small" color="error" onClick={() => updatePackageField(pkg.package_id, compIndex, undefined, 'remove', true)}>
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>

                                                            {/* Variants */}
                                                            <Box sx={{ p: 2 }}>
                                                                {component.variants.map((variant, varIndex) => (
                                                                    <Box
                                                                        key={varIndex}
                                                                        sx={{
                                                                            mb: 1.5, p: 2, borderRadius: 1.5,
                                                                            border: variant.is_selected ? '2px solid #1a3c40' : '1px solid #e0e0e0',
                                                                            bgcolor: variant.is_selected ? '#f0f7f4' : '#fafafa',
                                                                            position: 'relative'
                                                                        }}
                                                                    >
                                                                        {variant.is_selected && (
                                                                            <Chip label="✓ Selected" size="small" color="success" sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 700, fontSize: '0.7rem' }} />
                                                                        )}
                                                                        <Grid container spacing={2} alignItems="center">
                                                                            <Grid item xs={12} sm={3}>
                                                                                <TextField
                                                                                    fullWidth size="small" label="Option Title"
                                                                                    value={variant.title}
                                                                                    onChange={(e) => updatePackageField(pkg.package_id, compIndex, varIndex, 'title', e.target.value)}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={4}>
                                                                                <TextField
                                                                                    fullWidth size="small" label="Description" multiline rows={2}
                                                                                    value={variant.description}
                                                                                    onChange={(e) => updatePackageField(pkg.package_id, compIndex, varIndex, 'description', e.target.value)}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={6} sm={2}>
                                                                                <TextField
                                                                                    fullWidth size="small" type="number" label="Price (₹)"
                                                                                    value={variant.price_per_person}
                                                                                    onChange={(e) => updatePackageField(pkg.package_id, compIndex, varIndex, 'price_per_person', Number(e.target.value))}
                                                                                    InputProps={{ inputProps: { min: 0 } }}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={6} sm={3}>
                                                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                                    {!variant.is_selected && (
                                                                                        <Button size="small" variant="outlined" color="success" onClick={() => selectVariant(pkg.package_id, compIndex, varIndex)} sx={{ fontSize: '0.7rem' }}>
                                                                                            Select
                                                                                        </Button>
                                                                                    )}
                                                                                    <input
                                                                                        accept="image/*" style={{ display: 'none' }} multiple
                                                                                        id={`comp-${pkg.package_id}-${compIndex}-${varIndex}`} type="file"
                                                                                        onChange={(e) => handleComponentMultipleImageUpload(e.target.files, pkg.package_id, compIndex, varIndex)}
                                                                                        disabled={uploadingComponentImages[`${pkg.package_id}-${compIndex}-${varIndex}`]}
                                                                                    />
                                                                                    <label htmlFor={`comp-${pkg.package_id}-${compIndex}-${varIndex}`}>
                                                                                        <Button size="small" variant="outlined" component="span" sx={{ fontSize: '0.7rem' }}
                                                                                            disabled={uploadingComponentImages[`${pkg.package_id}-${compIndex}-${varIndex}`]}>
                                                                                            {uploadingComponentImages[`${pkg.package_id}-${compIndex}-${varIndex}`] ? '...' : '📷'}
                                                                                        </Button>
                                                                                    </label>
                                                                                    {component.variants.length > 1 && (
                                                                                        <IconButton size="small" color="error" onClick={() => updatePackageField(pkg.package_id, compIndex, varIndex, 'remove', true)}>
                                                                                            <DeleteIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    )}
                                                                                </Box>
                                                                                {(variant.image_urls || []).length > 0 && (
                                                                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                                                                                        {variant.image_urls.map((imgUrl, imageIdx) => (
                                                                                            <Box key={imageIdx} sx={{ position: 'relative', width: 36, height: 36 }}>
                                                                                                <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                                                                                                <IconButton size="small"
                                                                                                    sx={{ position: 'absolute', top: -4, right: -4, bgcolor: 'error.main', color: 'white', p: '2px', width: 16, height: 16 }}
                                                                                                    onClick={() => removeComponentImage(pkg.package_id, compIndex, varIndex, imageIdx)}>
                                                                                                    <DeleteIcon sx={{ fontSize: 10 }} />
                                                                                                </IconButton>
                                                                                            </Box>
                                                                                        ))}
                                                                                    </Box>
                                                                                )}
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Box>
                                                                ))}
                                                                <Button size="small" startIcon={<AddIcon />} onClick={() => addVariant(pkg.package_id, compIndex)} sx={{ mt: 0.5 }}>
                                                                    Add Option
                                                                </Button>
                                                            </Box>
                                                        </Paper>
                                                    );
                                                })}

                                                {/* Add Component Buttons */}
                                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
                                                    <Typography variant="caption" sx={{ width: '100%', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add Component:</Typography>
                                                    {[
                                                        { type: 'hotel', icon: <HotelIcon fontSize="small" />, label: 'Hotel' },
                                                        { type: 'transport', icon: <TransportIcon fontSize="small" />, label: 'Transport' },
                                                        { type: 'activity', icon: <FlightTakeoffIcon fontSize="small" />, label: 'Activity' },
                                                        { type: 'custom', icon: <CategoryIcon fontSize="small" />, label: 'Custom' },
                                                    ].map(({ type, icon, label }) => (
                                                        <Button key={type} size="small" variant="outlined" startIcon={icon} onClick={() => addComponent(pkg.package_id, type)} sx={{ borderRadius: 5, textTransform: 'none' }}>
                                                            {label}
                                                        </Button>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </>
                        ) : (
                            /* ── SIMPLE ITEMS MODE ── */
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={addCostingItem}>Add Item</Button>
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 3fr 1fr 1.5fr 1.5fr 40px', gap: 1, px: 2, py: 1, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                                    {['Item Name', 'Description', 'Qty', 'Price (₹)', 'Total', ''].map(h => (
                                        <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</Typography>
                                    ))}
                                </Box>

                                {(formData.costing.items || []).map((it, idx) => (
                                    <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: '3fr 3fr 1fr 1.5fr 1.5fr 40px', gap: 1, px: 2, py: 1.5, mb: 1, bgcolor: '#fff', border: '1px solid #e8e8e8', borderRadius: 1.5, alignItems: 'center' }}>
                                        <TextField size="small" placeholder="Item name" value={it.name} onChange={(e) => handleCostingItemChange(idx, 'name', e.target.value)} />
                                        <TextField size="small" placeholder="Description" value={it.description || ''} onChange={(e) => handleCostingItemChange(idx, 'description', e.target.value)} />
                                        <TextField size="small" type="number" value={it.quantity} onChange={(e) => handleCostingItemChange(idx, 'quantity', e.target.value)} inputProps={{ min: 1 }} />
                                        <TextField size="small" type="number" value={it.unit_price} onChange={(e) => handleCostingItemChange(idx, 'unit_price', e.target.value)} inputProps={{ min: 0 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a3c40', textAlign: 'right' }}>
                                            ₹{(Number(it.quantity || 0) * Number(it.unit_price || 0)).toLocaleString('en-IN')}
                                        </Typography>
                                        <IconButton size="small" color="error" onClick={() => removeCostingItem(idx)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </>
                        )}

                        {/* ── GRAND TOTAL BAR ── always visible, always live */}
                        <Box sx={{ mt: 4, p: 3, bgcolor: '#1a3c40', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em' }}>Grand Total</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                                    {formData.costing.type === 'package' ? 'Sum of selected variants' : 'Sum of all items'}
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#d4a017', letterSpacing: '-0.02em' }}>
                                ₹{computedTotal.toLocaleString('en-IN')}
                            </Typography>
                        </Box>
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