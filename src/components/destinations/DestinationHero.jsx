import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { Loader } from 'lucide-react';

const BASE_IMAGE_URL = "https://api.yaadigo.com/uploads/";

const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
];

const getImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGES[0];
    return path.startsWith('http') ? path : `${BASE_IMAGE_URL}${path}`;
};

function DestinationHero({ destinationData }) {
    if (!destinationData) {
        return (
            <div className="relative w-full h-[600px] bg-gray-800 flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-white" />
            </div>
        );
    }

    const rawImages = destinationData?.data?.hero_banner_images || destinationData?.hero_banner_images || PLACEHOLDER_IMAGES;
    const images = rawImages.map(getImageUrl);
    const title = destinationData?.data?.title || destinationData?.title || 'Explore The World';
    const subtitle = destinationData?.data?.subtitle || destinationData?.subtitle || "Find your next adventure.";

    return (
        <section className="relative w-full h-[600px] md:h-[700px]">
            <Swiper
                modules={[EffectFade, Autoplay, Navigation]}
                navigation={true}
                effect="fade"
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                loop={true}
                className="h-full w-full"
            >
                {images.map((imageUrl, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                                <h1 className="text-5xl md:text-7xl font-black text-white shadow-text animate-fade-in-down mb-4">
                                    {title}
                                </h1>
                                <p className="text-xl md:text-2xl font-medium animate-fade-in-up max-w-2xl mx-auto shadow-text">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style jsx>{`
                .shadow-text {
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
                }
                :global(.swiper-button-next), :global(.swiper-button-prev) {
                    color: white !important;
                    background: rgba(0,0,0,0.3);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    backdrop-filter: blur(4px);
                }
                :global(.swiper-button-next:after), :global(.swiper-button-prev:after) {
                    font-size: 20px !important;
                    font-weight: bold;
                }
            `}</style>
        </section>
    );
}

export default DestinationHero;