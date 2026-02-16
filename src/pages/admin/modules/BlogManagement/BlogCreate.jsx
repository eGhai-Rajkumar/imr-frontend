import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const API_BASE_URL = 'https://api.yaadigo.com/secure/api/';
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';
const IMAGE_UPLOAD_URL = 'https://api.yaadigo.com/upload';

const initialPostState = {
    heading: '',
    category_id: null,
    featured_image: '',
    alt_tag: '',
    date: new Date().toISOString().split('T')[0],
    author_name: 'Admin User',
    tag_ids: [],
    is_featured: false,
    is_published: false,
    description: '',
    meta_title: '',
    meta_tag: '',
    meta_description: '',
    slug: '',
    tenant_id: 0,
};

export default function BlogCreate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const quillRef = useRef(null);
    const [postData, setPostData] = useState(initialPostState);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchCategoriesAndTags();
        if (id) {
            fetchBlogPost(id);
        }
    }, [id]);

    useEffect(() => {
        // Set image preview when featured_image changes (for editing existing posts)
        if (postData.featured_image) {
            setImagePreview(postData.featured_image);
        }
    }, [postData.featured_image]);

    const fetchCategoriesAndTags = async () => {
        try {
            const [categoriesRes, tagsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}blog-categories/`, {
                    headers: { 'x-api-key': API_KEY }
                }),
                axios.get(`${API_BASE_URL}tags/`, {
                    headers: { 'x-api-key': API_KEY }
                })
            ]);

            // Check if response has nested data property or is direct array
            const categoriesData = categoriesRes.data?.data || categoriesRes.data || [];
            const tagsData = tagsRes.data?.data || tagsRes.data || [];
            
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            setTags(Array.isArray(tagsData) ? tagsData : []);
        } catch (err) {
            console.error('Error fetching categories/tags:', err);
            setError('Failed to load categories and tags');
        }
    };

    const fetchBlogPost = async (postId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}blog-posts/${postId}`, {
                headers: { 'x-api-key': API_KEY }
            });

            // Check if response has nested data property or is direct object
            const data = res.data?.data || res.data;
            
            setPostData({
                ...data,
                date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
                tag_ids: data.tag_ids || [],
            });
        } catch (err) {
            console.error('Error fetching blog post:', err);
            setError('Failed to load blog post');
        } finally {
            setLoading(false);
        }
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
        const maxSize = 5 * 1024 * 1024; // 5MB
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

            // Handle different response structures
            const imageUrl = response.data?.url || response.data?.imageUrl || response.data?.data?.url || response.data;
            
            console.log('Image uploaded successfully:', imageUrl);
            
            setPostData(prev => ({
                ...prev,
                featured_image: imageUrl
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
        setPostData(prev => ({
            ...prev,
            featured_image: ''
        }));
        setImagePreview(null);
    };

    // Custom image handler for ReactQuill
    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            // Validate file
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid image file');
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('Image size should be less than 5MB');
                return;
            }

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
                
                // Get Quill instance and insert image
                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', imageUrl);
                    quill.setSelection(range.index + 1);
                }
            } catch (err) {
                console.error('Error uploading image to editor:', err);
                alert('Failed to upload image');
            }
        };
    }, []);

    // ReactQuill modules configuration - memoized to prevent re-creation
    const quillModules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline','strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
    }), [imageHandler]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPostData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        if (name === 'heading' && !id) {
            setPostData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
            }));
        }
    };
    
    const handleQuillChange = (content) => {
        setPostData(prev => ({ ...prev, description: content }));
    };
    
    const handleTagChange = (e) => {
        const { options } = e.target;
        const selectedTags = Array.from(options)
            .filter(option => option.selected)
            .map(option => Number(option.value));
        
        setPostData(prev => ({ ...prev, tag_ids: selectedTags }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const submitData = {
                ...postData,
                category_id: postData.category_id ? Number(postData.category_id) : 0,
            };

            if (id) {
                await axios.put(`${API_BASE_URL}blog-posts/${id}`, submitData, {
                    headers: { 'x-api-key': API_KEY }
                });
                alert('Post updated successfully!');
            } else {
                await axios.post(`${API_BASE_URL}blog-posts/`, submitData, {
                    headers: { 'x-api-key': API_KEY }
                });
                alert('Post created successfully!');
            }
            navigate('/admin/dashboard/blog/list');
        } catch (err) {
            console.error('Error saving post:', err);
            setError(err.response?.data?.message || 'Failed to save post');
            alert(`Error: ${err.response?.data?.message || 'Failed to save post'}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <div className="p-8">Loading post data...</div>;
    if (error && id) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                {id ? 'Edit Blog Post' : 'Add New Blog Post'}
            </h2>
            
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column (Main Content) */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Title and Slug */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title (Heading)</label>
                            <input
                                type="text"
                                name="heading"
                                value={postData.heading}
                                onChange={handleChange}
                                placeholder="Enter post title here"
                                required
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                            />
                            <p className="text-xs text-gray-500 mt-1">Slug: /blog/{postData.slug || '...'}</p>
                            <input
                                type="text"
                                name="slug"
                                value={postData.slug}
                                onChange={handleChange}
                                placeholder="Post slug (URL)"
                                className="w-full border border-gray-300 p-2 rounded-lg text-sm mt-2"
                            />
                        </div>
                        
                        {/* Content Editor */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content (Description)</label>
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={postData.description}
                                onChange={handleQuillChange}
                                placeholder="Write your blog content here..."
                                className="h-96 mb-12"
                                modules={quillModules}
                            />
                        </div>
                        
                        {/* SEO Section */}
                        <div className="card p-6 bg-white shadow-md rounded-lg mt-12">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">SEO Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                                    <input 
                                        type="text" 
                                        name="meta_title" 
                                        value={postData.meta_title} 
                                        onChange={handleChange} 
                                        className="w-full border p-2 rounded" 
                                        placeholder="SEO Title for search engines" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meta Tags (Keywords)</label>
                                    <input 
                                        type="text" 
                                        name="meta_tag" 
                                        value={postData.meta_tag} 
                                        onChange={handleChange} 
                                        className="w-full border p-2 rounded" 
                                        placeholder="comma, separated, keywords" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                                    <textarea 
                                        name="meta_description" 
                                        value={postData.meta_description} 
                                        onChange={handleChange} 
                                        className="w-full border p-2 rounded h-20" 
                                        placeholder="A brief summary for search results"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Publishing & Attributes) */}
                    <div className="space-y-6">
                        {/* Publish Box */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Publish</h3>
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="is_published"
                                        checked={postData.is_published}
                                        onChange={handleChange}
                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    Publish Now
                                </label>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={postData.is_featured}
                                        onChange={handleChange}
                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    Featured Post
                                </label>
                            </div>
                            
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input 
                                    type="date" 
                                    name="date" 
                                    value={postData.date} 
                                    onChange={handleChange} 
                                    className="w-full border p-2 rounded" 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Author Name</label>
                                <input 
                                    type="text" 
                                    name="author_name" 
                                    value={postData.author_name} 
                                    onChange={handleChange} 
                                    className="w-full border p-2 rounded" 
                                />
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/admin/dashboard/blog/list')} 
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 flex items-center"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faSave} className="mr-2" /> 
                                    {loading ? 'Saving...' : id ? 'Update Post' : 'Save Post'}
                                </button>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Featured Image</h3>
                            
                            {/* Image Preview */}
                            {imagePreview ? (
                                <div className="relative mb-3">
                                    <img 
                                        src={imagePreview} 
                                        alt="Featured" 
                                        className="w-full h-48 object-cover rounded" 
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 mb-3 rounded bg-gray-50 text-gray-500">
                                    <FontAwesomeIcon icon={faUpload} className="text-4xl mb-2" />
                                    <p className="text-sm">No Image Selected</p>
                                </div>
                            )}
                            
                            {/* File Upload Button */}
                            <div className="mb-3">
                                <label className="block">
                                    <span className="sr-only">Choose image</span>
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
                                    Accepted: JPG, PNG, GIF, WebP (Max 5MB)
                                </p>
                            </div>
                            
                            {/* Alt Tag */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Tag (for SEO)</label>
                                <input
                                    type="text"
                                    name="alt_tag"
                                    value={postData.alt_tag}
                                    onChange={handleChange}
                                    placeholder="Describe the image"
                                    className="w-full border p-2 rounded text-sm"
                                />
                            </div>
                        </div>
                        
                        {/* Categories */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Categories</h3>
                            <select
                                name="category_id"
                                value={postData.category_id || ''}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">— Select Category —</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                Manage categories <Link to="/admin/dashboard/blog/categories" className="text-blue-500 hover:underline">here</Link>.
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Tags</h3>
                            <select
                                name="tag_ids"
                                multiple
                                value={postData.tag_ids.map(String)}
                                onChange={handleTagChange}
                                className="w-full border p-2 rounded h-32"
                            >
                                {tags.map(tag => (
                                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                Hold Ctrl/Cmd to select multiple tags. Manage tags <Link to="/admin/dashboard/blog/tags" className="text-blue-500 hover:underline">here</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}