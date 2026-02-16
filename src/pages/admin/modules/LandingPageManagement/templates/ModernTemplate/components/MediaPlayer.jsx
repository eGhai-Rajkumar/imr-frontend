import React, { useState } from 'react';

/**
 * Universal Media Player Component
 * Handles: Images, YouTube Videos, MP4/WebM/etc Videos
 * Used across: HeroSection, Gallery, PromoMediaSection, Attractions, etc.
 */

// Helper: Detect video type
const getVideoType = (url) => {
  if (!url) return 'unknown';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.match(/\.(mp4|webm|ogg|mov)$/i)) return 'file';
  return 'image';
};

// Helper: Extract YouTube Video ID
const getYouTubeVideoId = (url) => {
  try {
    let videoId = null;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    return videoId;
  } catch (e) {
    return null;
  }
};

// Helper: Safely encode URLs
const getSafeUrl = (url) => {
  try {
    return encodeURI(url);
  } catch (e) {
    return url;
  }
};

/**
 * MediaPlayer Component
 */
export default function MediaPlayer({
  url,
  type = 'auto',
  autoplay = false,
  loop = false,
  muted = true,
  controls = false,
  onEnded,
  onError,
  className = '',
  alt = 'Media',
  style = {},
  cover = true,
  playsInline = true,
  videoRef = null,
  debug = false, // Set to true to see what's happening
}) {
  const [loadError, setLoadError] = useState(false);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-slate-200 ${className}`}>
        <p className="text-slate-400 text-sm">No media</p>
      </div>
    );
  }

  const safeUrl = getSafeUrl(url);
  const detectedType = type === 'auto' ? getVideoType(url) : type;

  if (debug) {
    console.log('🎬 MediaPlayer Debug:', {
      url,
      detectedType,
      autoplay,
      muted,
      controls,
    });
  }

  // CASE 1: YouTube Video
  if (detectedType === 'youtube' && !loadError) {
    const videoId = getYouTubeVideoId(url);
    
    if (!videoId) {
      console.error('❌ Invalid YouTube URL:', url);
      return (
        <div className={`flex items-center justify-center bg-slate-900 ${className}`}>
          <div className="text-center p-4">
            <p className="text-white text-sm mb-2">Invalid YouTube URL</p>
            <p className="text-white/50 text-xs">{url}</p>
          </div>
        </div>
      );
    }

    // Build YouTube embed URL with parameters
    const params = [];
    if (autoplay) params.push('autoplay=1');
    if (muted) params.push('mute=1');
    if (loop) {
      params.push('loop=1');
      params.push(`playlist=${videoId}`);
    }
    if (!controls) params.push('controls=0');
    params.push('rel=0');
    params.push('modestbranding=1');
    if (playsInline) params.push('playsinline=1');
    params.push('enablejsapi=1');
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}?${params.join('&')}`;

    if (debug) {
      console.log('▶️ YouTube Embed URL:', embedUrl);
    }

    return (
      <div className={`relative w-full h-full ${className}`} style={style}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          style={{
            border: 'none',
            pointerEvents: controls ? 'auto' : 'none',
            width: '100%',
            height: '100%',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          title="YouTube video player"
        />
        
        {debug && (
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded z-50">
            YouTube: {videoId}
          </div>
        )}
      </div>
    );
  }

  // CASE 2: File Video (MP4, WebM, etc.)
  if (detectedType === 'video' || detectedType === 'file') {
    if (debug) {
      console.log('📹 File Video:', safeUrl);
    }

    return (
      <>
        <video
          ref={videoRef}
          src={safeUrl}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline={playsInline}
          onEnded={onEnded}
          onError={(e) => {
            console.error('❌ Video error:', url, e);
            setLoadError(true);
            if (onError) onError(e);
          }}
          className={`${cover ? 'object-cover' : 'object-contain'} ${className}`}
          style={style}
        />
        
        {debug && (
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded z-50">
            Video File
          </div>
        )}
      </>
    );
  }

  // CASE 3: Image (default)
  if (debug) {
    console.log('🖼️ Image:', safeUrl);
  }

  return (
    <>
      <img
        src={safeUrl}
        alt={alt}
        className={`${cover ? 'object-cover' : 'object-contain'} ${className}`}
        style={style}
        onError={(e) => {
          console.error('❌ Image error:', url, e);
          e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200';
          if (onError) onError(e);
        }}
      />
      
      {debug && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded z-50">
          Image
        </div>
      )}
    </>
  );
}

/**
 * TROUBLESHOOTING:
 * 
 * If YouTube video shows "Video unavailable":
 * 
 * 1. Check if the video allows embedding:
 *    - Some videos disable embedding in settings
 *    - Age-restricted videos can't be embedded
 *    - Music videos often have embedding disabled
 * 
 * 2. Test the video ID directly:
 *    https://www.youtube.com/embed/YOUR_VIDEO_ID
 * 
 * 3. Enable debug mode to see what's happening:
 *    <MediaPlayer url="..." debug={true} />
 * 
 * 4. Common YouTube URL formats supported:
 *    ✅ https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *    ✅ https://youtu.be/dQw4w9WgXcQ
 *    ✅ https://www.youtube.com/embed/dQw4w9WgXcQ
 * 
 * 5. If video still doesn't work, use a file video instead:
 *    - Download the video or use a different source
 *    - Upload to your server
 *    - Use MP4 format for best compatibility
 */