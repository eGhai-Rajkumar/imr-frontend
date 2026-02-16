import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, User, Eye, Heart, ArrowLeft, Clock } from 'lucide-react';
import axios from 'axios';

// API Configuration
const API_BASE_URL = 'https://api.yaadigo.com/secure/api/';
const API_KEY = 'bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M';

// --- Utility Functions ---

const getCategoryColor = (categoryName) => {
    const colors = {
        'Travel': 'bg-blue-100 text-blue-800',
        'Budget Travel': 'bg-green-100 text-green-800',
        'Adventure': 'bg-red-100 text-red-800',
        'Travel Guide': 'bg-purple-100 text-purple-800',
        'Photography': 'bg-yellow-100 text-yellow-800',
        'Wildlife': 'bg-orange-100 text-orange-800',
        'Solo Travel': 'bg-pink-100 text-pink-800',
        'Luxury': 'bg-indigo-100 text-indigo-800',
        'Rajkumar': 'bg-teal-100 text-teal-800'
    };
    return colors[categoryName] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
};

// --- BlogList Component (User View) ---

const BlogListComponent = ({ onBlogSelect, selectedBlogId, posts, loading, error, categories }) => {
    const [likedBlogs, setLikedBlogs] = useState({});

    const toggleLike = (blogId, e) => {
        e.stopPropagation();
        setLikedBlogs(prev => ({
            ...prev,
            [blogId]: !prev[blogId]
        }));
    };

    const handleBlogClick = (blogId) => {
        if (onBlogSelect) {
            onBlogSelect(blogId);
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    if (loading) return <div className="p-8 text-center text-lg text-gray-700">Loading travel stories...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                            Travel Stories
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600">Discover inspiring travel tips, guides, and adventures from around the world</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.length > 0 ? (
                        posts.filter(post => post.is_published).map((post) => (
                            <div
                                key={post.id}
                                className={`cursor-pointer ${
                                    selectedBlogId === post.id ? 'ring-2 ring-blue-500 rounded-2xl' : ''
                                }`}
                                onClick={() => handleBlogClick(post.id)}
                            >
                                <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 h-full flex flex-col">
                                    <div className="relative h-48 overflow-hidden group">
                                        <img
                                            src={post.featured_image || 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600'}
                                            alt={post.alt_tag || post.heading}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="absolute top-4 left-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(getCategoryName(post.category_id))}`}>
                                                {getCategoryName(post.category_id)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => toggleLike(post.id, e)}
                                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
                                            aria-label="Like post"
                                        >
                                            <Heart
                                                className={`w-5 h-5 transition-all duration-300 ${
                                                    likedBlogs[post.id]
                                                        ? 'fill-red-500 text-red-500'
                                                        : 'text-gray-600 hover:text-red-500'
                                                }`}
                                            />
                                        </button>

                                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-gray-700">
                                            {post.read_time || '5 min read'}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {post.heading}
                                        </h2>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                                            {post.meta_description || 'No description provided.'}
                                        </p>

                                        <div className="space-y-3 mb-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <User className="w-4 h-4" />
                                                <span className="font-medium">{post.author_name || 'Admin User'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(post.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Eye className="w-4 h-4" />
                                                    <span>{Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full mt-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                        >
                                            Read Article
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </article>
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-3 text-center p-12 text-gray-500 bg-white rounded-lg shadow-md">
                            No published blog posts found.
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

// --- BlogDetails Component (User View) ---

const BlogDetailsComponent = ({ blogId, onBack, categories }) => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    useEffect(() => {
        if (!blogId) {
            setError('No Blog ID provided.');
            setLoading(false);
            return;
        }

        const fetchBlogDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API_BASE_URL}blog-posts/${blogId}`, {
                    headers: { 'x-api-key': API_KEY }
                });
                
                const data = res.data?.data || res.data;

                if (!data || !data.is_published) {
                    setError('Post not found or is currently a draft.');
                }
                
                setBlog(data);
            } catch (err) {
                console.error('Error fetching blog details:', err);
                setError('Failed to load blog post details.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetails();
    }, [blogId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">Loading blog details...</div>;
    }

    if (error || !blog || !blog.is_published) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found or Not Published</h1>
                    <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or is a draft.</p>
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back to List
                    </button>
                </div>
            </div>
        );
    }

    const contentHtml = blog.description;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Blogs
                    </button>
                </div>
            </div>

            <article className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl h-96">
                        <img
                            src={blog.featured_image || 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600'}
                            alt={blog.alt_tag || blog.heading}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(getCategoryName(blog.category_id))}`}>
                                {getCategoryName(blog.category_id)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                                <Clock className="w-4 h-4" />
                                {blog.read_time || '5 min read'}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                            {blog.heading}
                        </h1>
                        <p className="text-xl text-gray-600">{blog.meta_description || 'No excerpt provided.'}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {blog.author_name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">By</p>
                                    <p className="font-semibold text-gray-900">{blog.author_name || 'Admin User'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Published</p>
                                    <p className="font-semibold text-gray-900">{formatDate(blog.date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Eye className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Views</p>
                                    <p className="font-semibold text-gray-900">{Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-300 text-red-600 font-semibold"
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-600' : ''}`} />
                                    {isLiked ? 'Liked' : 'Like'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
                        <div 
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                    </div>
                </div>
            </article>
        </div>
    );
};


// --- Main Blog App Component (Controller) ---

export default function Blog() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [blogId, setBlogId] = useState(null);
    const [viewMode, setViewMode] = useState('list');

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}blog-categories/`, {
                headers: { 'x-api-key': API_KEY }
            });
            
            const categoriesData = res.data?.data || res.data || [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    // Fetch all published blog posts for the list view
    const fetchBlogPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}blog-posts/`, {
                headers: { 'x-api-key': API_KEY }
            });
            
            const postsData = res.data?.data || res.data || [];
            setPosts(Array.isArray(postsData) ? postsData.filter(p => p.is_published) : []);
        } catch (err) {
            console.error('Error fetching blog posts for user view:', err);
            setError('Failed to load blog posts');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCategories();
        fetchBlogPosts();
    }, []);

    // Effect to check URL parameters on load/change
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('blogId');

        if (id) {
            setBlogId(id);
            setViewMode('details');
        } else {
            setBlogId(null);
            setViewMode('list');
        }
    }, [location.search]);

    // Handler to navigate to the detailed view and update URL
    const handleBlogSelect = useCallback((selectedBlogId) => {
        navigate(`/blog?blogId=${selectedBlogId}`);
        setBlogId(selectedBlogId);
        setViewMode('details');
    }, [navigate]);

    // Handler to navigate back to the list view and update URL
    const handleBackToList = useCallback(() => {
        navigate('/blog');
        setBlogId(null);
        setViewMode('list');
    }, [navigate]);

    return (
        <div>
            {viewMode === 'list' ? (
                <BlogListComponent 
                    onBlogSelect={handleBlogSelect}
                    selectedBlogId={blogId}
                    posts={posts}
                    loading={loading}
                    error={error}
                    categories={categories}
                />
            ) : (
                <BlogDetailsComponent 
                    blogId={blogId}
                    onBack={handleBackToList}
                    categories={categories}
                />
            )}
        </div>
    );
}