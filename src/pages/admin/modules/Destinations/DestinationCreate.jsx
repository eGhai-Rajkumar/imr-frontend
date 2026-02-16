// src/modules/Destinations/DestinationCreate.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios'; 
// MOCK IMPORTS 
import { CircularProgress } from '@mui/material';
const JoditEditor = ({ value, config, onBlur, children, ...props }) => <textarea className="form-control" defaultValue={value} onBlur={(e) => onBlur(e.target.value)} {...props}>{children}</textarea>; 
const APIBaseUrl = axios.create({ baseURL: "https://api.yaadigo.com/secure/api/" }); 
const normalizeEmptyFields = (data) => data; 
const errorMsg = console.error;
const successMsg = console.log;
const StringValidation = (value) => ({ status: !!value, message: value ? '' : 'is required.' });
const SlugValidation = (value) => ({ status: !!value, message: value ? '' : 'is required.' });
const NonEmptyValidation = (value) => ({ status: !!value, message: value ? '' : 'is required.' });
const NonEmptyArrayValidation = (value) => ({ status: Array.isArray(value) && value.length > 0, message: Array.isArray(value) && value.length > 0 ? '' : 'must contain at least one item.' });
const capitalizeWords = (str) => str ? str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';
// END MOCK IMPORTS

import '../../css/Destinations/DestinationCreate.css'; // Corrected path

// --- API Configuration ---
const DESTINATION_API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M"; 
const BACKEND_DOMAIN = "https://api.yaadigo.com/uploads"; 

// Helper for slug generation
const generateSlug = (title) =>
    title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove all non-alphanumeric, non-whitespace, non-hyphen
        .replace(/\s+/g, "-") // Replace all spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with a single one
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens


const DestinationCreate = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isTripsLoading, setIsTripsLoading] = useState(true);

    const [createDestination, setCreateDestination] = useState({});
    const [destinationList, setDestinationList] = useState([])
    const [validation, setValidation] = useState({})
    const [customPackage, setCustomPackage] = useState([{ title: "", description: "", trip_ids: [] }]);
    
    const editor = useRef(null);
    // Removed unused editor2 ref

    // --- Image URL Helpers ---
    const getFullImageUrl = (path) => {
        if (!path || typeof path !== 'string') return '';
        return path.startsWith('http') ? path : `${BACKEND_DOMAIN}/${path}`;
    };

    const getRelativeImagePath = (url) => {
        if (!url || typeof url !== 'string') return '';
        return url.startsWith(BACKEND_DOMAIN) ? url.replace(`${BACKEND_DOMAIN}/`, '') : url;
    };
    // --- End Image URL Helpers ---

    // --- Custom Package Logic ---
    const addCustomPackage = () => {
        setCustomPackage([...customPackage, { title: "", description: "", trip_ids: [] }]);
    };

    const deleteCustomPackage = (indexToRemove) => {
        if (indexToRemove !== 0) {
            const updatedFaqs = customPackage.filter((_, index) => index !== indexToRemove);
            setCustomPackage(updatedFaqs);
        }
    };

    const updateCustomPackage = (index, key, value) => {
        const updatedFaqs = [...customPackage];
        updatedFaqs[index][key] = value;
        setCustomPackage(updatedFaqs);
    };
    // --- End Custom Package Logic ---

    const handleChange = (key, value) => {
        setCreateDestination({ ...createDestination, [key]: value })
        if (validation[key]) {
            setValidation({ ...validation, [key]: false })
        }
    }

    /**
     * Handles changes to the Title or Slug field, with automatic slug generation/cleaning.
     * @param {string} key - 'title' or 'slug'
     * @param {string} value - The input value
     */
    const handleTitleSlugChange = (key, value) => {
        let updatedValue = value;
        let updatedData = { ...createDestination };

        // 1. Handle Slug Input Cleaning (Remove all except a-z, 0-9, and -)
        if (key === "slug") {
            updatedValue = value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, '') // Only allow alphanumeric and hyphens
                .replace(/-+/g, "-"); // Collapse multiple hyphens
        }
        
        // 2. Auto-generate slug from title on creation/if slug is empty
        if (key === "title") {
            if (!id || !createDestination.slug) {
                updatedData.slug = generateSlug(value);
            }
        }
        
        updatedData[key] = updatedValue;
        setCreateDestination(updatedData);

        if (validation[key]) {
            setValidation({ ...validation, [key]: false })
        }
    }

    const handleBlur = (fieldName, value) => {
        const updatedData = { ...createDestination, [fieldName]: value, };
        const cleanedData = normalizeEmptyFields(updatedData);
        const fieldValidation = validateDetails(cleanedData);
        setValidation((prev) => ({ ...prev, [fieldName]: fieldValidation[fieldName], }));
    };

    const handleRemoveImage = (indexToRemove) => {
        const updatedImages = createDestination.hero_banner_images.filter(
            (_, index) => index !== indexToRemove
        );

        const validationCheck = NonEmptyArrayValidation(updatedImages);
        if (validationCheck.status === false) {
             setValidation((prev) => ({ ...prev, hero_banner_images: validationCheck, }));
        }

        setCreateDestination({ ...createDestination, hero_banner_images: updatedImages, });
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        
        let image_name = e?.target?.files[0]?.name;
        let image_type = image_name?.split(".");
        let type = image_type?.pop()?.toLowerCase();
        if (!["jpeg", "png", "jpg", "pdf", "webp"].includes(type)) {
            errorMsg("Unsupported file type");
            return;
        }

        const formData = new FormData();
        formData.append("gallery_images", file);
        formData.append("storage", "local");
        try {
            const res = await APIBaseUrl.post("https://api.yaadigo.com/multiple", formData, {
                headers: { "x-api-key": DESTINATION_API_KEY }, 
            }); 
            if (res?.data?.message === "Files uploaded") {
                successMsg("Image uploaded successfully");
                const path = res.data.files;
                const existingImages = createDestination?.hero_banner_images || [];

                const newPaths = Array.isArray(path) ? path.flat() : [path];

                const updatedImages = [...existingImages, ...newPaths.map(getFullImageUrl)]; 
                
                if (validation?.hero_banner_images?.status === false) {
                    setValidation((prev) => ({
                        ...prev, hero_banner_images: { status: true, message: "" },
                    }));
                }

                setCreateDestination({ ...createDestination, hero_banner_images: updatedImages, });
            }
        } catch (error) {
            console.error("Upload error:", error);
            errorMsg("File upload failed");
        }
    };

    const validateDetails = (data) => {
        let validate = {};
        validate.title = StringValidation(data?.title);
        validate.slug = SlugValidation(data?.slug);
        validate.subtitle = NonEmptyValidation(data?.subtitle);
        validate.hero_banner_images = NonEmptyArrayValidation(data?.hero_banner_images);
        return validate;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        const cleanedData = normalizeEmptyFields(createDestination);
        cleanedData.hero_banner_images = cleanedData.hero_banner_images.map(getRelativeImagePath);

        cleanedData.custom_packages = customPackage.map(pkg => ({
            ...pkg, trip_ids: (pkg.trip_ids || []).map(Number) 
        }));
        cleanedData.testimonial_ids = [501, 502]; 
        cleanedData.related_blog_ids = [302, 303]; 
        
        if (cleanedData.primary_destination_id === "null" || cleanedData.primary_destination_id === "" || !cleanedData.primary_destination_id) {
            cleanedData.primary_destination_id = null;
        } else {
            cleanedData.primary_destination_id = parseInt(cleanedData.primary_destination_id);
        }

        if (!cleanedData.featured_blog_ids || cleanedData.featured_blog_ids.length === 0) {
            cleanedData.featured_blog_ids = [];
        }
        
        cleanedData.popular_trip_ids = (cleanedData.popular_trip_ids || []).map(Number);

        // FIX: Ensure optional arrays are present, even if empty (Fixes Pydantic missing error)
        cleanedData.blog_category_ids = cleanedData.blog_category_ids || []; 
        cleanedData.activity_ids = cleanedData.activity_ids || []; 

        const isValide = validateDetails(cleanedData)
        setValidation(isValide);
        if (Object.values(isValide).every((data) => data?.status === true)) {
            try {
                setIsLoading(true);
                const res = await APIBaseUrl.post("destinations", cleanedData, {
                    headers: { "x-api-key": DESTINATION_API_KEY },
                });
                if (res?.data?.success === true) {
                    navigate('/admin/dashboard/add-destination')
                    setIsLoading(false);
                    successMsg("Destination created successfully")
                }
            } catch (error) {
                setIsLoading(false);
                errorMsg(error?.response?.data?.message || "Failed to create destination");
            }
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        const { __v, createdAt, updatedAt, is_deleted, ...removedObject } = createDestination;
        const newData = { ...removedObject, custom_packages: customPackage };
        
        newData.hero_banner_images = newData.hero_banner_images.map(getRelativeImagePath);

        if (newData.primary_destination_id === "null" || newData.primary_destination_id === "" || !newData.primary_destination_id) {
            newData.primary_destination_id = null;
        } else {
            newData.primary_destination_id = parseInt(newData.primary_destination_id);
        }

        if (!newData.featured_blog_ids || newData.featured_blog_ids.length === 0) {
            newData.featured_blog_ids = [];
        }

        newData.testimonial_ids = [501, 502]; 
        newData.related_blog_ids = [302, 303]; 
        
        newData.popular_trip_ids = (newData.popular_trip_ids || []).map(Number);
        newData.custom_packages = newData.custom_packages.map(pkg => ({
            ...pkg, trip_ids: (pkg.trip_ids || []).map(Number)
        }));
        
        // FIX: Ensure optional arrays are present, even if empty (Fixes Pydantic missing error)
        newData.blog_category_ids = newData.blog_category_ids || []; 
        newData.activity_ids = newData.activity_ids || []; 

        const cleanedData = normalizeEmptyFields(newData);
        const isValide = validateDetails(cleanedData);
        setValidation(isValide);

        if (Object.values(isValide).every((data) => data?.status === true)) {
            try {
                setIsLoading(true);
                const res = await APIBaseUrl.put(`destinations/${id}`, cleanedData, {
                    headers: { "x-api-key": DESTINATION_API_KEY },
                });
                if (res?.data?.success === true) {
                    setIsLoading(false);
                    navigate('/admin/dashboard/add-destination');
                    successMsg("Destination Updated successfully");
                }
            } catch (error) {
                setIsLoading(false);
                errorMsg(error?.response?.data?.message || "Failed to update destination");
            }
        }
    };

    // --- Dropdown Fetching Logic (Fixed API Keys) ---
    const [allTrips, setAllTrips] = useState([]);
    const [allBlogPost, setAllBlogPost] = useState([]);
    const [allActivity, setAllActivity] = useState([]);
    const [allBlogCategory, setAllBlogCategory] = useState([]);

    const handleDropdown = (dropdownName, selected) => {
        setCreateDestination((prev) => ({ ...prev, [dropdownName]: selected || [], }));
    };
    
    // FULL API FETCHING FUNCTIONS
    const getAllTrip = async () => {
        setIsTripsLoading(true); 
        try {
            const res = await APIBaseUrl.get("trips/", { headers: { "x-api-key": DESTINATION_API_KEY } });
            if (res?.data?.success === true) {
                const mappedOptions = res?.data?.data?.map((trip) => ({ value: trip?.id, label: trip?.title }));
                setAllTrips(mappedOptions);
            }
        } catch (error) {
            errorMsg("Failed to fetch trips."); 
        } finally {
            setIsTripsLoading(false);
        }
    }

    const getAllDestinationData = async () => {
        try {
            const res = await APIBaseUrl.get("destinations/", { headers: { "x-api-key": DESTINATION_API_KEY } });
            if (res?.data?.success === true) {
                setDestinationList(res?.data?.data || []);
            }
        } catch (error) { errorMsg("Failed to fetch destination list."); }
    }

    const getAllBlogPost = async () => {
        try {
            const res = await APIBaseUrl.get("blog-posts/", { headers: { "x-api-key": DESTINATION_API_KEY } });
            if (res?.data?.success === true) {
                const mappedOptions = res?.data?.data?.map((blog) => ({ value: blog?.id, label: blog?.heading }));
                setAllBlogPost(mappedOptions);
            }
        } catch (error) { errorMsg("Failed to fetch blog posts."); }
    }

    const getAllBlogCategory = async () => {
        try {
            const res = await APIBaseUrl.get("blog-categories/", { headers: { "x-api-key": DESTINATION_API_KEY } });
            if (res?.data?.success === true) {
                const mappedOptions = res?.data?.data?.map((cat) => ({ value: cat?.id, label: cat?.name }));
                setAllBlogCategory(mappedOptions);
            }
        } catch (error) { errorMsg("Failed to fetch blog categories."); }
    }

    const getAllActivities = async () => {
        try {
            const res = await APIBaseUrl.get("activities/", { headers: { "x-api-key": DESTINATION_API_KEY } });
            if (res?.data?.success === true) {
                const mappedOptions = res?.data?.data?.map((act) => ({ value: act?.id, label: act?.name }));
                setAllActivity(mappedOptions);
            }
        } catch (error) { errorMsg("Failed to fetch activities."); }
    }

 const getSpecificDestination = async (id) => {
    try {
        const res = await APIBaseUrl.get(`destinations/${id}`, { headers: { "x-api-key": DESTINATION_API_KEY } });
        
        if (res?.data?.success === true) {
            const destinationData = res?.data?.data;
            
            // --- FIX 1: Normalize all top-level linked ID fields ---
            destinationData.popular_trip_ids = (destinationData.popular_trips || []).map(trip => Number(trip.id));
            destinationData.activity_ids = (destinationData.activities || []).map(activity => activity.id);
            destinationData.featured_blog_ids = (destinationData.featured_blogs || []).map(blog => blog.id);
            destinationData.blog_category_ids = (destinationData.blog_category_data || []).map(cat => cat.id);

            // --- FIX 2: Handle Nested Custom Packages (Existing Fix) ---
            if (destinationData.custom_packages) {
                destinationData.custom_packages = destinationData.custom_packages.map(pkg => ({
                    ...pkg,
                    trip_ids: (pkg.trips || []).map(trip => Number(trip.id))
                }));
            }

            // Convert hero banner image paths to full URLs for preview
            destinationData.hero_banner_images = (destinationData.hero_banner_images || []).map(path => 
                path.startsWith('http') ? path : `${BACKEND_DOMAIN}/${path}`
            );
            
            // Ensure necessary old keys are deleted to prevent state pollution
            delete destinationData.popular_trips;
            delete destinationData.activities;
            delete destinationData.featured_blogs;
            delete destinationData.blog_category_data;
            
            setCreateDestination(destinationData)
            setCustomPackage(destinationData.custom_packages || [{ title: "", description: "", trip_ids: [] }])
        }

    } catch (error) {
        errorMsg("Failed to fetch destination data for editing.");
    }
}
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                getAllTrip(), 
                getAllDestinationData(),
                getAllBlogPost(),
                getAllActivities(),
                getAllBlogCategory()
            ]);
            
            if (id) {
                await getSpecificDestination(id);
            }
        };

        fetchData();
    }, [id])
    
    // --- End Dropdown Fetching Logic ---


    return (
        <div className="tour-container">
            <div className='destination-header'>
                <h3 className='my-auto'>{id ? "Edit Destination" : "Create New Destination"}</h3>
                <button className='admin-add-button bg-gray-500 hover:bg-gray-600 text-white font-semibold' onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left me-2"></i> Back</button>
            </div>

            <form onSubmit={id ? handleUpdate : handleSubmit}>
                {/* ------------------- CORE DETAILS SECTION ------------------- */}
                <div className='destination-card'>
                    <h4 className='card-title'>Primary Information</h4>

                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className='admin-input-div'>
                                <label>Destination Name <span className='required-icon'>*</span></label>
                                <input type="text" value={createDestination?.title || ""} placeholder="Enter Destination Name"
                                    onChange={(e) => handleTitleSlugChange("title", e.target.value)}
                                    onBlur={(e) => handleBlur("title", e.target.value)}
                                    className="form-control" />
                                {validation?.title?.status === false && validation?.title?.message && (<p className='error-para'>Destination Name {validation.title.message}</p>)}
                            </div>
                        </div>

                        {/* SLUG FIELD (Now uses handleTitleSlugChange for clean input) */}
                        <div className='col-lg-6'>
                            <div className='admin-input-div'>
                                <label>URL Slug <span className='required-icon'>*</span></label>
                                <input type="text" value={createDestination?.slug || ""} placeholder="enter-url-slug"
                                    onChange={(e) => handleTitleSlugChange("slug", e.target.value)}
                                    onBlur={(e) => handleBlur("slug", e.target.value)}
                                    className="form-control" />
                                {validation?.slug?.status === false && validation?.slug?.message && (<p className='error-para'>Slug {validation.slug.message}</p>)}
                            </div>
                        </div>
                        {/* END SLUG FIELD */}
                        
                        <div className='col-lg-12'>
                            <div className='admin-input-div'>
                                <label>Description <span className='required-icon'>*</span></label>
                                <textarea className="form-control" value={createDestination?.subtitle || ""} placeholder="Enter Description"
                                    onChange={(e) => handleChange("subtitle", e.target.value)}
                                    onBlur={(e) => handleBlur("subtitle", e.target.value)}
                                    rows={3} />
                                {validation?.subtitle?.status === false && validation?.subtitle?.message && (<p className='error-para'>Description {validation.subtitle.message}</p>)}
                            </div>
                        </div>
                        
                        <div className='col-lg-6'>
                            <div className="admin-input-div">
                                <label>Hero Banner Images <span className='required-icon'>*</span></label>
                                <input type="file" multiple accept="image/*" className="form-control"
                                    onChange={(e) => handleFileUpload(e, "hero_banner_images")}
                                />

                                {validation?.hero_banner_images?.status === false && validation?.hero_banner_images?.message && (<p className='error-para'>Banner Images {validation.hero_banner_images.message}</p>)}

                                {/* IMAGE PREVIEW */}
                                {createDestination?.hero_banner_images && createDestination?.hero_banner_images?.length > 0 && (
                                    <div className="image-preview-wrapper">
                                        {createDestination?.hero_banner_images?.map((image, index) => (
                                            <div className='image-preview-item' key={index}>
                                                <img src={image} alt={`Banner Preview ${index}`} />
                                                <span className="delete-image-icon" onClick={() => handleRemoveImage(index)}>&times;</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='col-lg-6'>
                            <div className='admin-input-div'>
                                <label>Select Primary Destination </label>
                                <select onChange={(e) => handleChange("primary_destination_id", e.target.value)}
                                    onBlur={(e) => handleBlur("primary_destination_id", e.target.value)}
                                    value={createDestination?.primary_destination_id || ""}
                                    className="form-control">
                                    <option value="null">None (Main Destination)</option>
                                    {destinationList?.map((item, index) => (<option key={index} value={item?.id}>{item?.title}</option>))}
                                </select>
                            </div>
                        </div>

                        <div className='col-lg-6'>
                            <div className='admin-input-div'>
                                <label>Domestic / International</label>
                                <select onChange={(e) => handleChange("destination_type", e.target.value)}
                                    onBlur={(e) => handleBlur("destination_type", e.target.value)}
                                    value={createDestination?.destination_type || ""}
                                    className="form-control">
                                    <option value="">Select Places</option>
                                    <option value="domestic">Domestic</option>
                                    <option value="international">International</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* ------------------- TRIP/BLOG/ACTIVITY SELECTORS SECTION ------------------- */}
                <div className='destination-card'>
                    <h4 className='card-title'>Trip & Content Linking</h4>

                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className='admin-input-div'>
                                <label>Select Popular Trip Packages</label>
                                {isTripsLoading ? (
                                    <div className="d-flex justify-content-center py-2"><CircularProgress size={24} color="inherit" /></div>
                                ) : (
                                    <Select isMulti placeholder="Select trips..." className="react-select-container"
                                        value={allTrips?.filter((opt) => (createDestination?.popular_trip_ids || []).includes(opt.value))}
                                        onChange={(selectedOptions) =>
                                            handleDropdown("popular_trip_ids", selectedOptions ? selectedOptions.map((opt) => Number(opt?.value)) : [])
                                        }
                                        options={allTrips}
                                    />
                                )}
                            </div>
                        </div>

                        <div className='col-lg-6'>
                            <div className='admin-input-div'>
                                <label>Select Activities</label>
                                <Select isMulti placeholder="Select activities..." className="react-select-container"
                                    value={allActivity.filter((opt) => (createDestination?.activity_ids || []).includes(opt.value))}
                                    onChange={(selectedOptions) =>
                                        handleDropdown("activity_ids", selectedOptions ? selectedOptions.map((opt) => opt?.value) : [])
                                    }
                                    options={allActivity}
                                />
                            </div>
                        </div>
                        
                        <div className='col-lg-6'>
                            <div className='admin-input-div'>
                                <label>Select Featured Blogs</label>
                                <Select isMulti placeholder="Select blogs..." className="react-select-container"
                                    value={allBlogPost?.filter((opt) => (createDestination?.featured_blog_ids || []).includes(opt.value))}
                                    onChange={(selectedOptions) =>
                                        handleDropdown("featured_blog_ids", selectedOptions ? selectedOptions.map((opt) => opt?.value) : [])
                                    }
                                    options={allBlogPost}
                                />
                            </div>
                        </div>

                        <div className='col-lg-6'>
                            <div className='admin-input-div'>
                                <label>Select Blogs Category</label>
                                <Select isMulti placeholder="Select blog categories..." className="react-select-container"
                                    value={allBlogCategory?.filter((opt) => (createDestination?.blog_category_ids || []).includes(opt.value))}
                                    onChange={(selectedOptions) =>
                                        handleDropdown("blog_category_ids", selectedOptions ? selectedOptions.map((opt) => opt?.value) : [])
                                    }
                                    options={allBlogCategory}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ------------------- TEXT EDITOR SECTIONS ------------------- */}
                <div className='destination-card'>
                    <h4 className='card-title'>Content Editors</h4>
                    
                    <div className='admin-input-div'>
                        <label>About Tour Packages (Overview)</label>
                        <div className="mt-2 border rounded-lg overflow-hidden">
                            <JoditEditor
                                value={createDestination?.overview || ""}
                                config={{ readonly: false, height: 300, toolbarButtonSize: "middle", /* ... other config */ }}
                                onBlur={(newContent) => handleChange("overview", newContent)}
                            />
                        </div>
                    </div>

                    <div className='admin-input-div'>
                        <label>Travel Guidelines</label>
                        <div className="mt-2 border rounded-lg overflow-hidden">
                            <JoditEditor
                                value={createDestination?.travel_guidelines || ""}
                                config={{ readonly: false, height: 300, toolbarButtonSize: "middle", /* ... other config */ }}
                                onBlur={(newContent) => handleChange("travel_guidelines", newContent)}
                            />
                        </div>
                    </div>
                </div>

                {/* ------------------- CUSTOM PACKAGES SECTION ------------------- */}
                <div className='destination-card'>
                    <h4 className='card-title'>Custom Packages</h4>
                    
                    <div className="accordion" id="accordionExample">
                        {customPackage.map((trip, index) => (
                            <div className='custom-package-item' key={index}>
                                <div className="d-flex mb-3">
                                    <span className="font-semibold">Custom Package {index + 1}</span>
                                    <div className="custom-package-actions">
                                        <button type="button" className="add-btn" onClick={addCustomPackage}>Add</button>
                                        {index !== 0 && (<button type="button" className="delete-btn ms-2" onClick={() => deleteCustomPackage(index)}>Delete</button>)}
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-lg-12 admin-input-div mb-3">
                                        <label className="text-sm text-gray-600">Title</label>
                                        <input type="text" className="form-control" placeholder="Enter title"
                                            value={trip?.title}
                                            onChange={(e) => updateCustomPackage(index, "title", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-lg-12 admin-input-div mb-3">
                                        <label className="text-sm text-gray-600">Description</label>
                                        <textarea className="form-control" value={trip?.description} placeholder="Enter Description"
                                            onChange={(e) => updateCustomPackage(index, "description", e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                    
                                    <div className='col-lg-12 admin-input-div'>
                                        <label className="text-sm text-gray-600">Select Trip Packages for this Custom Package</label>
                                        {isTripsLoading ? (<div className="d-flex justify-content-center py-2"><CircularProgress size={24} color="inherit" /></div>) : (
                                            <Select
                                                isMulti
                                                value={allTrips?.filter(opt => (trip?.trip_ids || []).includes(opt.value))}
                                                placeholder="Select Packages Here..."
                                                onChange={(selectedOptions) =>
                                                    updateCustomPackage(index, "trip_ids", selectedOptions.map((opt) => Number(opt?.value)))
                                                }
                                                options={allTrips}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="create-common-btn" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : (id ? "Update Destination" : "Create Destination")}
                </button>
            </form>

        </div>
    )
}

export default DestinationCreate