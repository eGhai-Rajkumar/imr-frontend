import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Backpack, Bus, Plane, Mountain, PartyPopper, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

// NOTE: These variables are assumed to be defined globally or imported elsewhere in a real application,
// but are kept here for completeness based on the original code's context.
const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

// Helper to construct the full image URL
const getFullImageUrl = (path) => 
    !path || typeof path !== "string" ? '' : 
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

// Helper to map slugs to Lucide Icons (as a fallback if image fetching fails)
const iconMap = {
    'backpacking': Backpack,
    'weekend': Bus,
    'international': Plane,
    'adventure': Mountain,
    'honeymoon': PartyPopper,
    'corporate': Briefcase,
};

// Simple Color/Shadow mapping based on category names (retained for hover/fallback color)
const styleMap = {
    'backpacking': { color: 'bg-gradient-to-br from-orange-500 to-red-500', shadowColor: 'shadow-orange-500/50', hoverColor: 'group-hover:text-orange-600' },
    'weekend': { color: 'bg-gradient-to-br from-emerald-500 to-teal-500', shadowColor: 'shadow-emerald-500/50', hoverColor: 'group-hover:text-emerald-600' },
    'international': { color: 'bg-gradient-to-br from-blue-500 to-indigo-600', shadowColor: 'shadow-blue-500/50', hoverColor: 'group-hover:text-blue-600' },
    'adventure': { color: 'bg-gradient-to-br from-purple-500 to-pink-500', shadowColor: 'shadow-purple-500/50', hoverColor: 'group-hover:text-purple-600' },
    'honeymoon': { color: 'bg-gradient-to-br from-rose-500 to-pink-600', shadowColor: 'shadow-rose-500/50', hoverColor: 'group-hover:text-rose-600' },
    'corporate': { color: 'bg-gradient-to-br from-slate-600 to-gray-700', shadowColor: 'shadow-slate-600/50', hoverColor: 'group-hover:text-slate-600' },
};


export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // Assumes a React Router context is available, allowing navigation.
  const navigate = useNavigate();
  
  const scrollRef = useRef(null);
  const scrollStep = 200; // Pixels to scroll per click

  // --- Carousel Navigation ---
  const scrollCategories = (direction) => {
      if (scrollRef.current) {
          const currentScroll = scrollRef.current.scrollLeft;
          const newScroll = direction === 'left' ? currentScroll - scrollStep : currentScroll + scrollStep;
          scrollRef.current.scrollTo({
              left: newScroll,
              behavior: 'smooth'
          });
      }
  };


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
            const style = styleMap[slug] || {};
            
            // --- IMAGE INTEGRATION ---
            const imageUrl = Array.isArray(cat.image) && cat.image.length > 0 
                            ? getFullImageUrl(cat.image[0]) 
                            : null;

            return {
                id: cat._id || cat.id || index,
                name: cat.name,
                label: cat.label || 'Trips', 
                slug: slug,
                imageUrl: imageUrl, // Store the fetched image URL
                icon: iconMap[slug] || Backpack, // Icon for fallback
                color: style.color || 'bg-gray-500',
                shadowColor: style.shadowColor || 'shadow-gray-500/50',
                hoverColor: style.hoverColor || 'group-hover:text-gray-600',
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


  // --- UPDATED NAVIGATION HANDLER WITH SCROLL TO TOP ---
  const handleCategoryClick = (slug, id) => {
    // Scroll to top immediately before navigation
    window.scrollTo(0, 0);
    // Navigates to the new URL format: /category/:slug/:id
    // This assumes the React Router is configured to handle this path.
    navigate(`/category/${slug}/${id}`);
  };

  if (isLoading) {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-500">Loading categories...</p>
            </div>
        </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Find Your Travel Style
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you crave adrenaline or relaxation, we've got trips for every mood
          </p>
        </div>

        {/* --- Dynamic Category Carousel Section --- */}
        <div className="relative max-w-6xl mx-auto">
            
            {/* Scrollable Content Container */}
            <div className="flex justify-center flex-wrap overflow-x-auto custom-scrollbar-hide">
                <div 
                    ref={scrollRef}
                    className="flex gap-8 md:gap-12 lg:gap-16 justify-center overflow-x-auto custom-scrollbar-hide py-4 px-12"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        const isHovered = hoveredIndex === index;
                        
                        return (
                            <div
                                key={category.slug}
                                className="flex-shrink-0 opacity-0 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                            >
                                <div
                                    className="flex flex-col items-center gap-3 cursor-pointer group"
                                    // --- UPDATED CALL SITE ---
                                    onClick={() => handleCategoryClick(category.slug, category.id)}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {/* --- DYNAMIC IMAGE/ICON CONTAINER --- */}
                                    <div
                                        className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-out relative overflow-hidden ${
                                            isHovered 
                                                ? `${category.shadowColor} shadow-2xl -translate-y-2 scale-110` 
                                                : ''
                                            } ${!category.imageUrl ? category.color : ''}`}
                                    >
                                        {category.imageUrl ? (
                                            // Render Image if URL is available
                                            <img
                                                src={category.imageUrl}
                                                alt={category.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            // Fallback to Icon if no image
                                            <Icon className="h-10 w-10 md:h-12 md:w-12 text-white" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    {/* --- End DYNAMIC IMAGE/ICON CONTAINER --- */}

                                    <div className="text-center">
                                        <p className={`font-semibold text-gray-800 text-base md:text-lg ${category.hoverColor} transition-all duration-200 ${
                                            isHovered ? 'scale-105' : ''
                                        }`}>
                                            {category.name}
                                        </p>
                                        <p className={`font-semibold text-gray-800 text-base md:text-lg ${category.hoverColor} transition-all duration-200 ${
                                            isHovered ? 'scale-105' : ''
                                        }`}>
                                            {category.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => scrollCategories('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10 hidden md:block border border-gray-200"
            >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
                onClick={() => scrollCategories('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10 hidden md:block border border-gray-200"
            >
                <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

        </div>
        {/* --- End Dynamic Category Carousel Section --- */}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .custom-scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
        }
        .custom-scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </section>
  );
}