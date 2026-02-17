import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Backpack, Bus, Plane, Mountain, PartyPopper, Briefcase, Compass, ArrowRight } from 'lucide-react';

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

const getFullImageUrl = (path) =>
    !path || typeof path !== "string" ? '' :
        path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

const iconMap = {
    'backpacking': Backpack,
    'weekend': Bus,
    'international': Plane,
    'adventure': Mountain,
    'honeymoon': PartyPopper,
    'corporate': Briefcase,
};

export default function CategoriesSection() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/categories/`, {
                headers: { "x-api-key": API_KEY }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            const fetchedCategories = json.data || [];

            const standardizedCategories = fetchedCategories.map((cat, index) => {
                const slug = (cat.slug || cat.name?.toLowerCase().replace(/ /g, '-')).toLowerCase();
                const imageUrl = Array.isArray(cat.image) && cat.image.length > 0
                    ? getFullImageUrl(cat.image[0])
                    : null;

                return {
                    id: cat._id || cat.id || index,
                    name: cat.name,
                    label: cat.label || 'Collection',
                    slug: slug,
                    imageUrl: imageUrl,
                    icon: iconMap[slug] || Compass,
                };
            });

            setCategories(standardizedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCategoryClick = (slug, id) => {
        window.scrollTo(0, 0);
        navigate(`/category/${slug}/${id}`);
    };

    if (isLoading) return null;

    // --- Bento Grid Logic ---
    // We'll highlight the first item largely, and others in a grid
    const featuredCategory = categories[0];
    const gridCategories = categories.slice(1);

    return (
        <section className="py-24 bg-surface relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
                            <Compass className="h-4 w-4" />
                            <span>Curated Collections</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-dark">
                            Find Your Travel Style
                        </h2>
                    </div>

                    <div className="hidden md:block h-px flex-1 bg-gray-200 mx-8 mb-4"></div>

                    <p className="text-gray-500 max-w-sm text-sm text-right hidden md:block">
                        Explore our handpicked collections designed for every kind of traveler.
                    </p>
                </div>

                {/* --- Bento Grid Layout --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">

                    {/* 1. Featured Large Item (First Category) */}
                    {featuredCategory && (
                        <div
                            onClick={() => handleCategoryClick(featuredCategory.slug, featuredCategory.id)}
                            className="group relative col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                        >
                            {featuredCategory.imageUrl ? (
                                <img
                                    src={featuredCategory.imageUrl}
                                    alt={featuredCategory.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-primary flex items-center justify-center">
                                    <featuredCategory.icon className="w-20 h-20 text-white/20" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 p-8">
                                <span className="inline-block px-3 py-1 bg-accent/90 backdrop-blur-sm text-primary-dark text-xs font-bold rounded-full mb-3 shadow-glow">
                                    Most Popular
                                </span>
                                <h3 className="text-4xl font-serif font-bold text-white mb-2 group-hover:text-accent transition-colors">
                                    {featuredCategory.name}
                                </h3>
                                <div className="flex items-center gap-2 text-white/80 group-hover:translate-x-2 transition-transform duration-300">
                                    <span className="text-sm font-medium uppercase tracking-wide">Explore Collection</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Grid Items (Remaining Categories) */}
                    {gridCategories.map((category, index) => {
                        // Creating a varied grid pattern
                        // Every 3rd item could span 2 columns if we wanted, but let's keep it simple first
                        const isWide = index === 3; // Example: Make the 4th item wide
                        const spanClass = isWide ? "md:col-span-2" : "col-span-1";

                        return (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category.slug, category.id)}
                                className={`group relative ${spanClass} rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500`}
                            >
                                {category.imageUrl ? (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                        <category.icon className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-accent font-bold uppercase tracking-wider mb-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                                {category.label}
                                            </p>
                                            <h3 className="text-xl md:text-2xl font-serif font-bold text-white group-hover:text-accent transition-colors">
                                                {category.name}
                                            </h3>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}