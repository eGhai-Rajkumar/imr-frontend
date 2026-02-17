import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API_BASE_URL = "https://api.yaadigo.com/secure/api/";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const PUBLIC_DOMAIN = "https://indianmountainrovers.com"; // ✅ Added domain constant
const TENANT_ID = 1; // ✅ Tenant ID constant

export default function BlogList() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBlogPosts();
        fetchCategories();
    }, []);

    // Fetch Blog Posts
    const fetchBlogPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}blog-posts/`, {
                headers: { "x-api-key": API_KEY }
            });
            const postsData = res.data?.data || [];
            setPosts(postsData);
        } catch {
            setError("Failed to load blog posts");
        } finally {
            setLoading(false);
        }
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}blog-categories/`, {
                headers: { "x-api-key": API_KEY }
            });
            setCategories(res.data?.data || []);
        } catch {
            console.error("Failed to load categories");
        }
    };

    // Convert ID → Category Name
    const getCategoryName = useCallback(
        (id) => {
            const category = categories.find((c) => c.id === id);
            return category ? category.name : "Uncategorized";
        },
        [categories]
    );

    const handleDelete = async (id) => {
        if (window.confirm(`Delete blog post permanently?`)) {
            try {
                await axios.delete(`${API_BASE_URL}blog-posts/${id}`, {
                    headers: { "x-api-key": API_KEY }
                });
                setPosts(posts.filter((post) => post.id !== id));
            } catch {
                alert("Delete failed. Try again.");
            }
        }
    };

    const handleView = (post) => {
        window.open(`${PUBLIC_DOMAIN}/blog?blogId=${post.id}`, "_blank");
    };

    if (loading) return <div className="p-8 text-gray-600 text-lg">Loading blog posts...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
        <div className="p-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">All Blog Posts</h2>
                <button
                    onClick={() => navigate("/admin/dashboard/blog/create")}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-lg shadow-sm"
                >
                    <FontAwesomeIcon icon={faPlus} /> Add New Post
                </button>
            </div>

            {/* Table */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">TITLE</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">AUTHOR</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">CATEGORY</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">DATE</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">STATUS</th>
                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-600">ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-800">{post.heading}</td>
                                <td className="px-6 py-4 text-gray-700">{post.author_name || "Admin User"}</td>
                                <td className="px-6 py-4 text-gray-700">{getCategoryName(post.category_id)}</td>
                                <td className="px-6 py-4 text-gray-700">
                                    {post.date ? new Date(post.date).toLocaleDateString() : "-"}
                                </td>

                                {/* Status Badge */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 text-sm rounded-full font-semibold ${post.is_published ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                                            }`}>
                                        {post.is_published ? "Published" : "Draft"}
                                    </span>
                                </td>

                                {/* BEAUTIFUL ACTION BUTTONS */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-5">

                                        <button
                                            onClick={() => navigate(`/admin/dashboard/blog/create/${post.id}`)}
                                            className="text-indigo-600 hover:text-indigo-800 transition"
                                            title="Edit"
                                        >
                                            <FontAwesomeIcon icon={faEdit} size="lg" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-600 hover:text-red-800 transition"
                                            title="Delete"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="lg" />
                                        </button>

                                        <button
                                            onClick={() => handleView(post)}
                                            className="text-gray-800 hover:text-black transition"
                                            title="View"
                                        >
                                            <FontAwesomeIcon icon={faEye} size="lg" />
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
