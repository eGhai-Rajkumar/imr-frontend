import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const articlesData = {
  'jibhi': [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      category: 'Trips',
      date: 'March 15 2024',
      author: 'Sarah Adventures',
      title: 'Hidden Gems of Jibhi: A Complete Travel Guide',
      description: 'Discover the serene beauty of Jibhi valley with our comprehensive travel guide covering best spots, local cuisine, and adventure activities.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      category: 'Trips',
      date: 'March 10 2024',
      author: 'Adventure Team',
      title: 'Tirthan Valley Trek: Nature\'s Best Kept Secret',
      description: 'Explore the pristine waters and lush forests of Tirthan Valley. Perfect for nature lovers and photography enthusiasts seeking tranquility.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      category: 'Trips',
      date: 'March 05 2024',
      author: 'Wanderer Max',
      title: 'Winter Camping in Jibhi: Tips & Experiences',
      description: 'Complete guide to winter camping in Jibhi. Learn about best camping spots, weather conditions, and essential packing tips for an unforgettable experience.'
    }
  ],
  'kasol': [
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      category: 'Trips',
      date: 'February 28 2024',
      author: 'Trek Master',
      title: 'Kasol Kheerganga Trek: The Complete Adventure',
      description: 'Experience the breathtaking Kheerganga trek starting from Kasol. A detailed guide covering trail difficulty, best season, and what to expect.'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      category: 'Trips',
      date: 'February 20 2024',
      author: 'Local Guide',
      title: 'Kasol Local Culture: Festival & Food Experience',
      description: 'Immerse yourself in Kasol\'s vibrant culture. Discover local festivals, authentic cuisines, and meet the warm people of this charming town.'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      category: 'Trips',
      date: 'February 15 2024',
      author: 'Photography Pro',
      title: 'Photography Locations in Kasol: Instagram Gold',
      description: 'Unveil the most photogenic spots in and around Kasol. Perfect angles, best times, and insider tips for capturing stunning travel photography.'
    }
  ]
};

export default function TravelArticles({ tripId = 'jibhi' }) {
  const [articles, setArticles] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setArticles(articlesData[tripId] || articlesData['jibhi']);
  }, [tripId]);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 inline-block pb-3">
            Related Articles
            <div className="w-16 h-1 bg-blue-600 mx-auto mt-2"></div>
          </h2>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="opacity-0 animate-slide-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
              onMouseEnter={() => setHoveredCard(article.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="group cursor-pointer h-full flex flex-col">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-2xl mb-5 h-64 md:h-56">
                  <img
                    src={article.image}
                    alt={article.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredCard === article.id ? 'scale-110' : 'scale-100'
                    }`}
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    {article.category}
                  </div>

                  {/* Overlay Effect */}
                  <div className={`absolute inset-0 bg-black/0 transition-all duration-500 ${
                    hoveredCard === article.id ? 'bg-black/20' : 'bg-black/0'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <span className="font-medium">{article.date}</span>
                    <span className="text-gray-400">•</span>
                    <span>By {article.author}</span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold text-gray-900 mb-3 line-clamp-2 transition-all duration-300 ${
                    hoveredCard === article.id ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-base line-clamp-3 flex-1 transition-colors duration-300">
                    {article.description}
                  </p>

                  {/* Read More Link - HIDDEN */}
                  <div className="mt-5 hidden flex items-center gap-2 text-blue-600 font-semibold group/link opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button - HIDDEN */}
        <div className="text-center mt-16 hidden opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <button className="px-10 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2 group">
            Explore All Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}