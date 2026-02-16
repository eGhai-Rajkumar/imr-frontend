import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const API_BASE_URL = 'https://api.yaadigo.com/secure/api/';
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';

export default function TagManagement() {
    const [newTag, setNewTag] = useState({ name: '', slug: '', description: '', tenant_id: 0, is_active: true });
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}tags/`, {
                headers: { 'x-api-key': API_KEY }
            });
            
            console.log('TagManagement - Raw API Response:', res.data);
            
            // Check if response has nested data property or is direct array
            const tagsData = res.data?.data || res.data || [];
            
            console.log('TagManagement - Extracted tagsData:', tagsData);
            console.log('TagManagement - Is Array?', Array.isArray(tagsData));
            
            const finalTags = Array.isArray(tagsData) ? tagsData : [];
            
            console.log('TagManagement - Final tags to set:', finalTags);
            
            setTags(finalTags);
        } catch (err) {
            console.error('Error fetching tags:', err);
            setError('Failed to load tags');
            setTags([]); // Ensure tags is always an array even on error
        } finally {
            setLoading(false);
        }
    };

    const handleNewTagChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTag(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        
        if (name === 'name') {
            setNewTag(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
            }));
        }
    };

    const handleAddTag = async (e) => {
        e.preventDefault();
        if (!newTag.name) return;
        
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}tags/`, newTag, {
                headers: { 'x-api-key': API_KEY }
            });
            setTags(prev => [...prev, res.data]);
            setNewTag({ name: '', slug: '', description: '', tenant_id: 0, is_active: true });
            alert('Tag created successfully!');
            fetchTags(); // Refresh list
        } catch (err) {
            console.error('Error creating tag:', err);
            alert(`Failed to create tag: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            try {
                await axios.delete(`${API_BASE_URL}tags/${id}`, {
                    headers: { 'x-api-key': API_KEY }
                });
                setTags(tags.filter(t => t.id !== id));
                alert('Tag deleted successfully!');
            } catch (err) {
                console.error('Error deleting tag:', err);
                alert(`Failed to delete tag: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const handleEdit = (tag) => {
        setEditingId(tag.id);
        setNewTag({
            name: tag.name,
            slug: tag.slug,
            description: tag.description || '',
            tenant_id: tag.tenant_id || 0,
            is_active: tag.is_active
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingId) return;
        
        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}tags/${editingId}`, newTag, {
                headers: { 'x-api-key': API_KEY }
            });
            await fetchTags();
            setEditingId(null);
            setNewTag({ name: '', slug: '', description: '', tenant_id: 0, is_active: true });
            alert('Tag updated successfully!');
        } catch (err) {
            console.error('Error updating tag:', err);
            alert(`Failed to update tag: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewTag({ name: '', slug: '', description: '', tenant_id: 0, is_active: true });
    };

    if (error) {
        return <div className="p-8 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Add/Edit Tag (Left Column) */}
                <div className="md:col-span-1">
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                            {editingId ? 'Edit Tag' : 'Add New Tag'}
                        </h3>
                        <form onSubmit={editingId ? handleUpdate : handleAddTag} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={newTag.name} 
                                    onChange={handleNewTagChange} 
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
                                    value={newTag.slug} 
                                    onChange={handleNewTagChange} 
                                    placeholder="URL-friendly version" 
                                    className="w-full border p-2 rounded" 
                                />
                                <p className="text-xs text-gray-500 mt-1">The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea 
                                    name="description" 
                                    value={newTag.description} 
                                    onChange={handleNewTagChange} 
                                    className="w-full border p-2 rounded h-20"
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-1">The description is not prominent by default; however, some themes may show it.</p>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={newTag.is_active}
                                        onChange={handleNewTagChange}
                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    Active
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> 
                                    {loading ? 'Saving...' : editingId ? 'Update Tag' : 'Add New Tag'}
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

                {/* Tags List (Right Column) */}
                <div className="md:col-span-2">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {loading && tags.length === 0 ? (
                            <div className="p-8 text-center">Loading tags...</div>
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
                                    {Array.isArray(tags) && tags.length > 0 ? (
                                        tags.map(tag => (
                                            <tr key={tag.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tag.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.description || '—'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.slug}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        tag.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {tag.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        onClick={() => handleEdit(tag)}
                                                        className="text-indigo-600 hover:text-indigo-900 mx-2" 
                                                        title="Edit"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(tag.id)} 
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
                                                    No tags found
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}