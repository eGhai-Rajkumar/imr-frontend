import React, { useState } from 'react';
import { Plus, X, Eye, Save, Repeat2 } from 'lucide-react';
import "../../css/Categories/CreateCategory.css";
// Mock dependencies (Must be included for self-contained functionality)
const CustomModal = ({ open, onClickOutside, children }) => { 
    if (!open) return null; 
    return (
        <div className="custom-modal-overlay" onClick={onClickOutside}>
            <div className="delete-model-view-main" onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    ); 
};
const errorMsg = console.error;
const successMsg = console.log;
const StringValidation = (value) => ({ status: !!value, message: value ? '' : 'is required.' });
const SlugValidation = (value) => ({ status: !!value, message: value ? '' : 'is required.' });
const NonEmptyValidation = (value) => ({ status: !!value, message: value ? '' : 'is required.' });
const normalizeEmptyFields = (data) => data; // Simplified mock
const BACKEND_DOMAIN = "https://api.yaadigo.com/uploads"; 

// This component is the modal content itself, used by the parent CategoryList
export default function CreateCategory({ 
    open, setOpen, 
    categoryData, setcategoryData, 
    validation, setValidation, 
    isViewOnly, setIsViewOnly, 
    isUpdate, setIsUpdate, 
    handleSubmit, 
    handleUpdate, 
    handleFileUpload, handleRemoveImage, 
    getAllTourCategory, getSpecificTourCategory 
}) {
    
    // ... (All existing functions remain the same) ...
    const handleChange = (e) => {
        const { name, value } = e.target
        setcategoryData({ ...categoryData, [name]: value })
        if (validation[name]) {
            setValidation({ ...validation, [name]: false })
        }
    }

    const validateDetails = (data) => {
        let validate = {};
        validate.name = StringValidation(data?.name);
        validate.slug = SlugValidation(data?.slug);
        validate.description = NonEmptyValidation(data?.description);
        
        validate.image = Array.isArray(data?.image) && data.image.length > 0 
            ? { status: true, message: '' } 
            : { status: false, message: 'is required.' };

        validate.tenant_id = NonEmptyValidation(data?.tenant_id);
        return validate;
    };
    
    const handleBlur = (fieldName, value) => {
        const updatedData = { ...categoryData, [fieldName]: value, };
        const cleanedData = normalizeEmptyFields(updatedData);
        const fieldValidation = validateDetails(cleanedData);
        setValidation((prev) => ({ ...prev, [fieldName]: fieldValidation[fieldName], }));
    };

    const resetModalState = () => {
        setOpen(false);
        setValidation({});
        setcategoryData({});
        setIsViewOnly(false);
        setIsUpdate(false);
    };

    const handleSubmitWrapper = (e) => {
        e.preventDefault();
        const dataWithTenant = { ...categoryData, tenant_id: 2 };
        const fullValidation = validateDetails(dataWithTenant);
        setValidation(fullValidation);

        const isFormValid = Object.values(fullValidation).every(v => v.status);

        if (isFormValid) {
            handleSubmit(e, dataWithTenant); 
        } else {
            errorMsg("Please fill out all required fields.");
        }
    }
    
    const handleUpdateWrapper = (e) => {
        e.preventDefault();
        const dataWithTenant = { ...categoryData, tenant_id: 2 };

        const fullValidation = validateDetails(dataWithTenant);
        setValidation(fullValidation);
        
        const isFormValid = Object.values(fullValidation).every(v => v.status);

        if (isFormValid) {
            handleUpdate(e, dataWithTenant); 
        } else {
            errorMsg("Please fill out all required fields.");
        }
    }
    
    return (
        <CustomModal
            open={open}
            onClickOutside={resetModalState}
        >
            <div 
                className='category-modal-content' 
                style={{ 
                    padding: '24px', 
                    maxWidth: '500px', 
                    margin: 'auto', 
                    // ⭐ FIX 1: Ensure parent container is positioned relatively 
                    position: 'relative' 
                }}
            >
                
                {/* ⭐ FIX 2: Close Icon with high Z-Index */}
                <button 
                    onClick={resetModalState} 
                    style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        background: 'none', 
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 1000, // Ensure it's above scrolling content
                        padding: '5px' // Add padding for better click target
                    }}
                >
                    <X size={24} color="#333" />
                </button>

                <h4 className='text-2xl font-bold mb-4 text-center text-blue-600'>
                    {isViewOnly ? "View Category" : isUpdate ? "Update Category" : "Add Category"}
                </h4>
                
                {/* Content scrolling (Max height) */}
                <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '10px' }}>
                    <form onSubmit={(e) => { e.preventDefault(); isUpdate ? handleUpdateWrapper(e) : handleSubmitWrapper(e); }}>
                        {/* Name Input */}
                        <div className='modal-input-div'>
                            <label>Name <span className='required-icon'>*</span></label>
                            <input type="text" placeholder="Enter Name" name='name'
                                className="form-control-category"
                                onChange={handleChange}
                                value={categoryData?.name || ""}
                                readOnly={isViewOnly}
                                onBlur={(e) => handleBlur(e.target.name, e.target.value)}
                            />
                            {validation?.name?.status === false && validation?.name?.message && (
                                <p className='error-para'>Name {validation.name.message}</p>
                            )}
                        </div>

                        {/* Slug Input */}
                        <div className='modal-input-div'>
                            <label>Slug <span className='required-icon'>*</span></label>
                            <input type="text" placeholder="Enter Slug" name='slug'
                                className="form-control-category"
                                onChange={handleChange}
                                value={categoryData?.slug || ""}
                                readOnly={isViewOnly}
                                onBlur={(e) => handleBlur(e.target.name, e.target.value)}
                            />
                            {validation?.slug?.status === false && validation?.slug?.message && (
                                <p className='error-para'>Slug {validation.slug.message}</p>
                            )}
                        </div>

                        {/* Description Input */}
                        <div className='modal-input-div'>
                            <label>Description <span className='required-icon'>*</span></label>
                            <textarea placeholder='Enter Description' name='description' rows="3"
                                className="form-control-category"
                                onChange={handleChange}
                                value={categoryData?.description || ""}
                                readOnly={isViewOnly}
                                onBlur={(e) => handleBlur(e.target.name, e.target.value)}
                            />
                            {validation?.description?.status === false && validation?.description?.message && (
                                <p className='error-para'>Description {validation.description.message}</p>
                            )}
                        </div>

                        {/* Image Input */}
                        <div className='modal-input-div'>
                            <label>Image <span className='required-icon'>*</span></label>
                            {!isViewOnly && (
                                <input
                                    type="file"
                                    name='image'
                                    accept='.png,.jpeg,.jpg,.webp'
                                    className="form-control-category"
                                    onChange={(e) => { handleFileUpload(e, "image"); handleBlur("image", categoryData.image) }} 
                                />
                            )}
                            {validation?.image?.status === false && validation?.image?.message && (
                                <p className='error-para'>Image {validation.image.message}</p>
                            )}
                            
                            {/* Image Preview */}
                            {Array.isArray(categoryData?.image) && categoryData.image.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {categoryData.image.map((image, index) => (
                                        <div className="relative w-32 h-32" key={index}>
                                            <img 
                                                src={image} 
                                                alt={`Category-Preview-${index}`} 
                                                className="w-full h-full object-cover rounded-md" 
                                                onError={(e) => { e.target.onerror = null; e.target.src=`${BACKEND_DOMAIN}/placeholder.png` }}
                                            />
                                            {!isViewOnly && (
                                                <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5" onClick={() => handleRemoveImage(index)}>
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!isViewOnly && (
                            <button type="submit" className='model-submit-button'>
                                {isUpdate ? "Update Category" : "Add Category"}
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </CustomModal>
    );
}