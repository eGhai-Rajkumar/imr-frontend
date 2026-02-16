import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const API_BASE_URL = 'https://api.yaadigo.com/secure/api/';
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const IMAGE_UPLOAD_URL = 'https://api.yaadigo.com/upload';

export default function CategoryManagement() {
    const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', parent_id: 0, tenant_id: 0, is_active: true, sort_order: 0, level: 0, image_url: '' });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}blog-categories/`, {
                headers: { 'x-api-key': API_KEY }
            });
            
            console.log('CategoryManagement - Raw API Response:', res.data);
            
            // Check if response has nested data property or is direct array
            const categoriesData = res.data?.data || res.data || [];
            
            console.log('CategoryManagement - Extracted categoriesData:', categoriesData);
            console.log('CategoryManagement - Is Array?', Array.isArray(categoriesData));
            
            const finalCategories = Array.isArray(categoriesData) ? categoriesData : [];
            
            console.log('CategoryManagement - Final categories to set:', finalCategories);
            
            setCategories(finalCategories);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
            setCategories([]); // Ensure categories is always an array even on error
        } finally {
            setLoading(false);
        }
    };

    const handleNewCatChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCat(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        
        if (name === 'name') {
            setNewCat(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
            }));
        }
    };

    const handleAddCat = async (e) => {
        e.preventDefault();
        if (!newCat.name) return;
        
        setLoading(true);
        try {
            const submitData = {
                ...newCat,
                parent_id: newCat.parent_id === 'none' || newCat.parent_id === '0' ? 0 : Number(newCat.parent_id),
            };
            
            const res = await axios.post(`${API_BASE_URL}blog-categories/`, submitData, {
                headers: { 'x-api-key': API_KEY }
            });
            
            setCategories(prev => [...prev, res.data]);
            setNewCat({ name: '', slug: '', description: '', parent_id: 0, tenant_id: 0, is_active: true, sort_order: 0, level: 0, image_url: '' });
            setImagePreview(null); // Clear image preview
            alert('Category created successfully!');
            fetchCategories(); // Refresh list
        } catch (err) {
            console.error('Error creating category:', err);
            alert(`Failed to create category: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? Posts in this category will be set to Uncategorized.')) {
            try {
                await axios.delete(`${API_BASE_URL}blog-categories/${id}`, {
                    headers: { 'x-api-key': API_KEY }
                });
                setCategories(categories.filter(c => c.id !== id));
                alert('Category deleted successfully!');
            } catch (err) {
                console.error('Error deleting category:', err);
                alert(`Failed to delete category: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setNewCat({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            parent_id: category.parent_id || 0,
            tenant_id: category.tenant_id || 0,
            is_active: category.is_active,
            sort_order: category.sort_order || 0,
            level: category.level || 0,
            image_url: category.image_url || ''
        });
        setImagePreview(category.image_url || null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingId) return;
        
        setLoading(true);
        try {
            const submitData = {
                ...newCat,
                parent_id: newCat.parent_id === 'none' || newCat.parent_id === '0' ? 0 : Number(newCat.parent_id),
            };
            
            await axios.put(`${API_BASE_URL}blog-categories/${editingId}`, submitData, {
                headers: { 'x-api-key': API_KEY }
            });
            
            await fetchCategories();
            setEditingId(null);
            setNewCat({ name: '', slug: '', description: '', parent_id: 0, tenant_id: 0, is_active: true, sort_order: 0, level: 0, image_url: '' });
            setImagePreview(null);
            alert('Category updated successfully!');
        } catch (err) {
            console.error('Error updating category:', err);
            alert(`Failed to update category: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewCat({ name: '', slug: '', description: '', parent_id: 0, tenant_id: 0, is_active: true, sort_order: 0, level: 0, image_url: '' });
        setImagePreview(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('Image size should be less than 5MB');
            return;
        }

        setImageUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(IMAGE_UPLOAD_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-api-key': API_KEY
                }
            });

            const imageUrl = response.data?.url || response.data?.imageUrl || response.data?.data?.url || response.data;
            
            console.log('Category image uploaded successfully:', imageUrl);
            
            setNewCat(prev => ({
                ...prev,
                image_url: imageUrl
            }));
            setImagePreview(imageUrl);
            alert('Image uploaded successfully!');
        } catch (err) {
            console.error('Error uploading image:', err);
            alert(`Failed to upload image: ${err.response?.data?.message || err.message}`);
        } finally {
            setImageUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setNewCat(prev => ({
            ...prev,
            image_url: ''
        }));
        setImagePreview(null);
    };

    if (error) {
        return <div className="p-8 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Add/Edit Category (Left Column) */}
                <div className="md:col-span-1">
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                            {editingId ? 'Edit Category' : 'Add New Category'}
                        </h3>
                        <form onSubmit={editingId ? handleUpdate : handleAddCat} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={newCat.name} 
                                    onChange={handleNewCatChange} 
                                    placeholder="The name is how it appears on your site." 
                                    required 
                                    className="w-full border p-2 rounded" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Slug</label>
                                <input 
                                    type="text" 
                                    name="slug" 
                                    value={newCat.slug} 
                                    onChange={handleNewCatChange} 
                                    placeholder="URL-friendly version" 
                                    className="w-full border p-2 rounded" 
                                />
                                <p className="text-xs text-gray-500 mt-1">The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Parent Category</label>
                                <select 
                                    name="parent_id" 
                                    value={newCat.parent_id} 
                                    onChange={handleNewCatChange} 
                                    className="w-full border p-2 rounded"
                                >
                                    <option value="0">None</option>
                                    {Array.isArray(categories) && categories
                                        .filter(cat => cat.id !== editingId)
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))
                                    }
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Categories, unlike tags, can have a hierarchy.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea 
                                    name="description" 
                                    value={newCat.description} 
                                    onChange={handleNewCatChange} 
                                    className="w-full border p-2 rounded h-20"
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-1">The description is not prominent by default; however, some themes may show it.</p>
                            </div>
                            
                            {/* Category Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category Image (Optional)</label>
                                
                                {/* Image Preview */}
                                {imagePreview ? (
                                    <div className="relative mb-3">
                                        <img 
                                            src={imagePreview} 
                                            alt="Category" 
                                            className="w-full h-32 object-cover rounded border" 
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 mb-3 rounded bg-gray-50 text-gray-500">
                                        <FontAwesomeIcon icon={faUpload} className="text-3xl mb-1" />
                                        <p className="text-xs">No Image</p>
                                    </div>
                                )}
                                
                                {/* File Upload Input */}
                                <label className="block">
                                    <span className="sr-only">Choose category image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={imageUploading}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </label>
                                {imageUploading && (
                                    <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    JPG, PNG, GIF, WebP (Max 5MB)
                                </p>
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> 
                                    {loading ? 'Saving...' : editingId ? 'Update Category' : 'Add New Category'}
                                </button>
                                {editingId && (
                                    <button 
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Categories List (Right Column) */}
                <div className="md:col-span-2">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {loading && categories.length === 0 ? (
                            <div className="p-8 text-center">Loading categories...</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Array.isArray(categories) && categories.length > 0 ? (
                                        categories.map(cat => (
                                            <tr key={cat.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.description || '—'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        cat.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {cat.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        onClick={() => handleEdit(cat)}
                                                        className="text-indigo-600 hover:text-indigo-900 mx-2" 
                                                        title="Edit"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(cat.id)} 
                                                        className="text-red-600 hover:text-red-900 mx-2" 
                                                        title="Delete"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        !loading && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                    No categories found
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        )}
                        <div className="p-4 text-sm text-gray-600 border-t">
                            Deleting a category does not delete the posts in that category. Instead, posts that were only assigned to the deleted category are set to the default category <strong>Uncategorized</strong>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}