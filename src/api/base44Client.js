// src/api/base44Client.js

export const base44 = {
  entities: {
    LandingPageSettings: {
      list: async () => {
        // Simulating an API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return [{
          company_name: "Wanderlust Travel",
          primary_color: "#FF6B35",
          secondary_color: "#FFB800",
          company_phone: "+1 234 567 890",
          company_email: "hello@wanderlust.com",
          whatsapp_number: "1234567890",
          company_address: "123 Adventure Lane, Travel City",
          social_links: {
            facebook: "https://facebook.com",
            instagram: "https://instagram.com"
          },
          // Enable/Disable sections
          trust_badges_enabled: true,
          testimonials_enabled: true,
          flash_sale_enabled: true,
          flash_sale_percentage: 40,
          // Mock Data for sections
          attractions: [
             { title: "Blue Lagoon", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", description: "A beautiful geothermal spa located in a lava field." },
             { title: "Mountain Peak", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", description: "The highest peak in the region offering breathtaking views." },
             { title: "Ancient Temple", image: "https://images.unsplash.com/photo-1599525419266-17b5db30f878?w=800&q=80", description: "A historic temple dating back to the 12th century." }
          ],
          faqs: [
             { question: "Is flight included in the package?", answer: "Yes, all our international packages include round-trip flights." },
             { question: "What is the cancellation policy?", answer: "You can cancel for free up to 48 hours before your trip starts." },
             { question: "Do you provide travel insurance?", answer: "Yes, basic travel insurance is included in all premium packages." }
          ],
          travel_guidelines: [
            "Carry a valid passport with at least 6 months validity.",
            "Check visa requirements for your specific destination.",
            "Pack comfortable walking shoes for excursions.",
            "Keep digital copies of all your travel documents."
          ]
        }];
      }
    },
    LandingPageTrip: {
      filter: async (criteria, order) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return [
          {
            id: 1, 
            title: "Bali Paradise Escape", 
            location: "Bali, Indonesia", 
            rating: 4.8, 
            duration_days: 5, 
            duration_nights: 4, 
            group_size: 10,
            base_price: 1200, 
            discount_price: 899,
            hero_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
            slots_left: 4, 
            viewers: 12, 
            is_featured: true,
            overview: "Experience the magic of Bali with this all-inclusive package featuring luxury stays, guided tours, and authentic culinary experiences."
          },
          {
            id: 2, 
            title: "Swiss Alps Adventure", 
            location: "Interlaken, Switzerland", 
            rating: 4.9, 
            duration_days: 7, 
            duration_nights: 6, 
            group_size: 8,
            base_price: 2500, 
            discount_price: 2100,
            hero_image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
            image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
            slots_left: 2, 
            viewers: 25, 
            is_featured: true,
            overview: "Ski through the breathtaking Swiss Alps and enjoy cozy evenings in traditional chalets."
          },
          {
            id: 3, 
            title: "Kyoto Cultural Tour", 
            location: "Kyoto, Japan", 
            rating: 4.7, 
            duration_days: 6, 
            duration_nights: 5, 
            group_size: 12,
            base_price: 1800, 
            discount_price: null,
            hero_image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
            slots_left: 8, 
            viewers: 5, 
            is_featured: false,
            overview: "Immerse yourself in Japanese culture with visits to ancient shrines, tea ceremonies, and bamboo forests."
          }
        ];
      }
    },
    LandingPageEnquiry: {
      create: async (data) => { 
        console.log("Enquiry submitted to API:", data); 
        return { success: true }; 
      }
    }
  }
};