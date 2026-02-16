import React, { useState } from 'react';
import { ChevronRight, Calendar, User, Eye, Heart, ArrowLeft, Share2, Clock } from 'lucide-react';

// BlogList Component
const BlogList = ({ onBlogSelect, selectedBlogId }) => {
  const [likedBlogs, setLikedBlogs] = useState({});

  const blogs = [
    {
      id: 1,
      title: 'Top 10 Hidden Gems in the Swiss Alps',
      excerpt: 'Discover the most breathtaking and lesser-known destinations in the Swiss Alps that will make your adventure unforgettable.',
      category: 'Travel',
      author: 'Sarah Anderson',
      date: 'March 15, 2024',
      views: 2543,
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Budget Travel Tips: Explore Europe on $50 a Day',
      excerpt: 'Learn insider secrets to travel across Europe without breaking the bank. Practical tips for every budget traveler.',
      category: 'Budget Travel',
      author: 'Mike Johnson',
      date: 'March 12, 2024',
      views: 3821,
      image: 'https://images.pexels.com/photos/1433086/pexels-photo-1433086.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '7 min read',
    },
    {
      id: 3,
      title: 'The Complete Guide to Hiking the Inca Trail',
      excerpt: 'Everything you need to know about trekking to Machu Picchu. From preparation to what to expect on the trail.',
      category: 'Adventure',
      author: 'Elena Rodriguez',
      date: 'March 10, 2024',
      views: 4156,
      image: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '9 min read',
    },
    {
      id: 4,
      title: 'Island Hopping in Greece: A 2-Week Itinerary',
      excerpt: 'Your ultimate guide to exploring the most beautiful Greek islands with a practical 14-day itinerary.',
      category: 'Travel Guide',
      author: 'Alex Martinez',
      date: 'March 8, 2024',
      views: 5203,
      image: 'https://images.pexels.com/photos/1130624/pexels-photo-1130624.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '8 min read',
    },
    {
      id: 5,
      title: 'Adventure Photography: Capturing Your Travel Moments',
      excerpt: 'Master the art of travel photography with pro tips for stunning vacation photos without expensive gear.',
      category: 'Photography',
      author: 'James Chen',
      date: 'March 5, 2024',
      views: 1987,
      image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '6 min read',
    },
    {
      id: 6,
      title: 'Wildlife Encounters: The Best Safari Destinations',
      excerpt: 'Explore the top safari parks in Africa and encounter incredible wildlife in their natural habitat.',
      category: 'Wildlife',
      author: 'Lisa Thompson',
      date: 'March 1, 2024',
      views: 3456,
      image: 'https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '7 min read',
    },
    {
      id: 7,
      title: 'Solo Travel Safety: Tips for Women Travelers',
      excerpt: 'Essential safety tips and confidence-building advice for women traveling solo around the world.',
      category: 'Solo Travel',
      author: 'Priya Patel',
      date: 'February 28, 2024',
      views: 2876,
      image: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '6 min read',
    },
    {
      id: 8,
      title: 'Luxury Travel: Five-Star Resorts Worth Every Penny',
      excerpt: 'Discover the most luxurious resorts in the world that offer unforgettable experiences and perfect service.',
      category: 'Luxury',
      author: 'David Lee',
      date: 'February 25, 2024',
      views: 4123,
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '8 min read',
    }
  ];

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

  const getCategoryColor = (category) => {
    const colors = {
      'Travel': 'bg-blue-100 text-blue-800',
      'Budget Travel': 'bg-green-100 text-green-800',
      'Adventure': 'bg-red-100 text-red-800',
      'Travel Guide': 'bg-purple-100 text-purple-800',
      'Photography': 'bg-yellow-100 text-yellow-800',
      'Wildlife': 'bg-orange-100 text-orange-800',
      'Solo Travel': 'bg-pink-100 text-pink-800',
      'Luxury': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Travel Stories
            </span>
          </h1>
          <p className="text-xl text-gray-600">Discover inspiring travel tips, guides, and adventures from around the world</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={blog.id}
              className={`opacity-0 animate-fade-in-up cursor-pointer ${
                selectedBlogId === blog.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ animationDelay: `${0.15 + index * 0.08}s`, animationFillMode: 'forwards' }}
            >
              <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden group">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(blog.category)}`}>
                      {blog.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleLike(blog.id, e)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ${
                        likedBlogs[blog.id]
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600 hover:text-red-500'
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-gray-700">
                    {blog.readTime}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {blog.excerpt}
                  </p>

                  <div className="space-y-3 mb-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{blog.author}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{blog.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{blog.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleBlogClick(blog.id)}
                    className="w-full mt-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    Read Article
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
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

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
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
      `}</style>
    </div>
  );
};

// BlogDetails Component
const BlogDetails = ({ blogId, onBack }) => {
  const [isLiked, setIsLiked] = useState(false);

  const blogs = [
    {
      id: 1,
      title: 'Top 10 Hidden Gems in the Swiss Alps',
      excerpt: 'Discover the most breathtaking and lesser-known destinations in the Swiss Alps that will make your adventure unforgettable.',
      category: 'Travel',
      author: 'Sarah Anderson',
      date: 'March 15, 2024',
      views: 2543,
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '5 min read',
      content: `Explore the breathtaking beauty of the Swiss Alps beyond the typical tourist routes. From pristine alpine meadows to hidden mountain villages, this guide unveils the secrets that make the Swiss Alps truly magical.

The Swiss Alps offer more than just spectacular scenery. They provide an opportunity to connect with nature in ways that few other destinations can match. Whether you're an experienced hiker or a casual traveler, these hidden gems will leave you speechless.

Visit Appenzell Alps for traditional Swiss charm. Discover the Säntis region for panoramic views. Explore Appenzell Alps, a UNESCO Biosphere Reserve that showcases pristine wilderness and authentic Alpine culture. The region is home to charming villages like Wasserauen and Brülisau.

Don't miss the Jura Mountains, often overlooked but incredibly rewarding. These mountains offer gentle hiking trails, stunning forests, and peaceful lakes. The area is perfect for those seeking solitude and natural beauty away from crowds.`
    },
    {
      id: 2,
      title: 'Budget Travel Tips: Explore Europe on $50 a Day',
      excerpt: 'Learn insider secrets to travel across Europe without breaking the bank. Practical tips for every budget traveler.',
      category: 'Budget Travel',
      author: 'Mike Johnson',
      date: 'March 12, 2024',
      views: 3821,
      image: 'https://images.pexels.com/photos/1433086/pexels-photo-1433086.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '7 min read',
      content: `Traveling through Europe on a tight budget is not only possible—it's one of the most rewarding experiences you can have. This comprehensive guide shares insider secrets from seasoned budget travelers who have mastered the art of exploring Europe affordably.

The key to budget travel is strategic planning and flexibility. Book flights during off-peak seasons, use budget airlines, and consider alternative transportation methods like buses and trains. Hostels are your best friend, offering both affordable accommodation and the chance to meet other travelers.

Eat like a local by shopping at markets and cooking in hostel kitchens. Visit free attractions like museums on designated free days. Use public transportation instead of taxis. Stay in smaller cities outside major tourist centers for lower prices and authentic experiences.

Eastern European countries like Poland, Hungary, and Czech Republic offer exceptional value. You can enjoy quality meals, comfortable accommodation, and amazing experiences for a fraction of Western European prices. The locals are incredibly welcoming, and the cultural heritage is world-class.`
    },
    {
      id: 3,
      title: 'The Complete Guide to Hiking the Inca Trail',
      excerpt: 'Everything you need to know about trekking to Machu Picchu. From preparation to what to expect on the trail.',
      category: 'Adventure',
      author: 'Elena Rodriguez',
      date: 'March 10, 2024',
      views: 4156,
      image: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '9 min read',
      content: `The Inca Trail is one of the world's most iconic hiking routes. This four-day trek takes you through cloud forests, along mountain ridges, and through ancient Incan ruins, culminating at the breathtaking Machu Picchu.

Preparation is crucial. Build your cardiovascular fitness with regular training. Acclimatize to the altitude by spending time in Cusco before starting. Pack light but ensure you have proper gear including rain protection, warm layers, and sturdy hiking boots.

The trail encompasses four diverse ecosystems and showcases remarkable Incan engineering. Day one starts at Kilometre 82 and passes through multiple archaeological sites. The views become increasingly spectacular as you ascend higher.

Day two is the most challenging, featuring steep climbs and high altitude. Day three includes the Sun Gate, offering your first glimpse of Machu Picchu. Day four concludes with a visit to the full ruins. Hire a licensed guide to understand the historical significance and navigate safely.`
    },
    {
      id: 4,
      title: 'Island Hopping in Greece: A 2-Week Itinerary',
      excerpt: 'Your ultimate guide to exploring the most beautiful Greek islands with a practical 14-day itinerary.',
      category: 'Travel Guide',
      author: 'Alex Martinez',
      date: 'March 8, 2024',
      views: 5203,
      image: 'https://images.pexels.com/photos/1130624/pexels-photo-1130624.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '8 min read',
      content: `Greece's islands offer a perfect blend of history, culture, natural beauty, and relaxation. This two-week itinerary balances popular destinations with hidden gems for an unforgettable island-hopping adventure.

Start in Athens to acclimatize and explore ancient ruins. Take a ferry to Mykonos for vibrant nightlife and beautiful beaches. Move to Delos, an archaeological marvel with minimal tourists. Visit Santorini for stunning sunsets and white-washed villages perched on cliffs.

Continue to Naxos, a less touristy island with authentic Greek culture and beautiful beaches. Explore Paros for charming villages and excellent local restaurants. Visit Antiparos to see famous stalactite caves. End your journey in Crete, the largest island with diverse attractions from beaches to mountains.

Each island has its own character and charm. Mix activities between beach relaxation, cultural exploration, and outdoor adventures. Connect via regular ferry services or speedboats. Travel in shoulder season for the best balance of good weather and fewer crowds.`
    },
    {
      id: 5,
      title: 'Adventure Photography: Capturing Your Travel Moments',
      excerpt: 'Master the art of travel photography with pro tips for stunning vacation photos without expensive gear.',
      category: 'Photography',
      author: 'James Chen',
      date: 'March 5, 2024',
      views: 1987,
      image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '6 min read',
      content: `Capturing stunning travel photos doesn't require expensive equipment. With the right techniques and your smartphone or basic camera, you can create professional-quality images that tell compelling stories.

Master the fundamentals: composition, lighting, and timing. Use the rule of thirds to create balanced shots. Golden hour photography—during sunrise and sunset—provides magical natural lighting. Experiment with different angles and perspectives to make ordinary scenes extraordinary.

Focus on telling stories rather than just documenting locations. Include people, local details, and cultural elements. Street photography captures authentic moments that showcase the true essence of a destination. Learn to anticipate moments rather than just reacting to them.

Use leading lines to guide viewers' eyes through your image. Incorporate foreground elements for depth. Shoot during blue hour for unique twilight colors. Edit photos consistently to create a cohesive visual narrative. Most importantly, enjoy the moment and don't get too caught up in capturing it perfectly.`
    },
    {
      id: 6,
      title: 'Wildlife Encounters: The Best Safari Destinations',
      excerpt: 'Explore the top safari parks in Africa and encounter incredible wildlife in their natural habitat.',
      category: 'Wildlife',
      author: 'Lisa Thompson',
      date: 'March 1, 2024',
      views: 3456,
      image: 'https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '7 min read',
      content: `Africa's safari parks offer unparalleled opportunities to witness wildlife in their natural habitat. These pristine ecosystems support incredible biodiversity and provide transformative travel experiences.

The Serengeti in Tanzania is famous for the Great Migration, where millions of wildebeest cross crocodile-filled rivers. Kruger National Park in South Africa is the largest game reserve, home to the Big Five and numerous other species. Masai Mara in Kenya offers exceptional wildlife viewing and stunning landscapes.

Each park has its unique ecosystem and wildlife composition. Serengeti excels at large predator and prey interactions. Kruger offers diverse habitats from riverine forest to grassland. Masai Mara provides intimate encounters with wildlife and rich Maasai culture.

Best travel times vary by location but generally fall during dry seasons when animals congregate near water sources. Choose responsible tour operators that prioritize wildlife welfare and conservation. Consider multi-park visits to maximize wildlife diversity and scenery variation.`
    },
    {
      id: 7,
      title: 'Solo Travel Safety: Tips for Women Travelers',
      excerpt: 'Essential safety tips and confidence-building advice for women traveling solo around the world.',
      category: 'Solo Travel',
      author: 'Priya Patel',
      date: 'February 28, 2024',
      views: 2876,
      image: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '6 min read',
      content: `Solo travel as a woman is empowering, liberating, and incredibly rewarding. With proper planning and awareness, you can travel safely and create unforgettable memories worldwide.

Before traveling, research your destination thoroughly. Share your itinerary with trusted friends or family. Register with your embassy if traveling to a region with safety concerns. Purchase comprehensive travel insurance including medical coverage.

Stay alert and trust your instincts. Avoid isolated areas at night. Use registered taxis or rideshare apps. Keep valuables secured and maintain copies of important documents. Dress appropriately for local culture and customs. Learn basic phrases in the local language.

Connect with other travelers through hostels, tours, or online communities. Solo travel doesn't mean being alone—meet locals and other travelers for authentic cultural exchange. Stay in centrally located, well-reviewed accommodations. Communicate regularly with loved ones back home. Remember that millions of women travel solo successfully every year. You belong in this world just as much as anyone else.`
    },
    {
      id: 8,
      title: 'Luxury Travel: Five-Star Resorts Worth Every Penny',
      excerpt: 'Discover the most luxurious resorts in the world that offer unforgettable experiences and perfect service.',
      category: 'Luxury',
      author: 'David Lee',
      date: 'February 25, 2024',
      views: 4123,
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '8 min read',
      content: `Luxury resorts represent the pinnacle of hospitality, offering impeccable service, stunning aesthetics, and unforgettable experiences. These five-star properties justify their premium prices through exceptional attention to detail.

The Maldives resorts redefine tropical luxury with overwater bungalows, pristine beaches, and world-class diving. Swiss alpine resorts combine mountain majesty with sophisticated elegance and wellness facilities. Italian Amalfi Coast properties showcase Mediterranean beauty with gourmet dining and personalized service.

Thai luxury resorts blend Asian hospitality with modern comfort in stunning natural settings. African safari lodges provide intimate wildlife encounters with exceptional guides and gourmet cuisine. Caribbean island resorts offer paradise settings with water sports and rejuvenating spas.

What distinguishes luxury resorts is anticipatory service—staff understand your needs before you express them. Amenities go beyond basics to include Michelin-starred restaurants, championship golf courses, and world-renowned spas. Personalization defines the experience; nothing feels generic or impersonal. These resorts create lasting memories that justify the investment in luxury travel.`
    }
  ];

  const blog = blogs.find(b => b.id === parseInt(blogId));

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Travel': 'bg-blue-100 text-blue-800',
      'Budget Travel': 'bg-green-100 text-green-800',
      'Adventure': 'bg-red-100 text-red-800',
      'Travel Guide': 'bg-purple-100 text-purple-800',
      'Photography': 'bg-yellow-100 text-yellow-800',
      'Wildlife': 'bg-orange-100 text-orange-800',
      'Solo Travel': 'bg-pink-100 text-pink-800',
      'Luxury': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

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
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(blog.category)}`}>
                {blog.category}
              </span>
              <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                <Clock className="w-4 h-4" />
                {blog.readTime}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            <p className="text-xl text-gray-600">{blog.excerpt}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">By</p>
                  <p className="font-semibold text-gray-900">{blog.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="font-semibold text-gray-900">{blog.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Views</p>
                  <p className="font-semibold text-gray-900">{blog.views.toLocaleString()}</p>
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
            <div className="prose prose-lg max-w-none">
              {blog.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

// Main App Component with Routing Logic
const App = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const handleBlogSelect = (blogId) => {
    setSelectedBlogId(blogId);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedBlogId(null);
  };

  return (
    <div>
      {currentView === 'list' ? (
        <BlogList 
          onBlogSelect={handleBlogSelect}
          selectedBlogId={selectedBlogId}
        />
      ) : (
        <BlogDetails 
          blogId={selectedBlogId}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default App;