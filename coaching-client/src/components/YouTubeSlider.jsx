// src/components/common/YouTubeSlider.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID;

const YouTubeSlider = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchVideos = async () => {
      if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
        setError('YouTube API configuration is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              part: 'snippet',
              channelId: CHANNEL_ID,
              maxResults: 10,
              order: 'date',
              type: 'video',
              key: YOUTUBE_API_KEY
            },
            timeout: 10000
          }
        );

        if (response.data?.items) {
          setVideos(response.data.items);
        } else {
          setError('No videos found');
        }
        setLoading(false);
      } catch (error) {
        let errorMessage = 'Failed to load videos';
        
        if (error.response) {
          switch (error.response.status) {
            case 403:
              const errorDetails = error.response.data?.error;
              if (errorDetails?.message?.includes('quota')) {
                errorMessage = 'API quota exceeded. Please try again later.';
              } else if (errorDetails?.message?.includes('API key')) {
                errorMessage = 'Invalid API key configuration.';
              } else if (errorDetails?.message?.includes('referer')) {
                errorMessage = 'API key domain restriction error.';
              } else {
                errorMessage = 'Access forbidden. Please check API configuration.';
              }
              break;
            case 404:
              errorMessage = 'Channel not found.';
              break;
            case 400:
              errorMessage = 'Invalid request parameters.';
              break;
            default:
              errorMessage = 'API request failed.';
          }
        } else if (error.request) {
          errorMessage = 'Network connection error.';
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="relative inline-flex">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-ping"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">Loading latest videos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-white border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-lg max-w-md mx-auto">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Unable to Load Videos</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No videos available at the moment</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
            Latest Videos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our newest educational content and stay ahead with cutting-edge courses
          </p>

        </div>

        {/* Video Slider */}
        <div className="youtube-slider-container relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={24}
            navigation={true}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={videos.length > 3}
            modules={[Navigation, Pagination, Autoplay]}
            breakpoints={{
              640: { 
                slidesPerView: 1,
                spaceBetween: 20 
              },
              768: { 
                slidesPerView: 2,
                spaceBetween: 24 
              },
              1024: { 
                slidesPerView: 3,
                spaceBetween: 32 
              },
              1280: { 
                slidesPerView: 3,
                spaceBetween: 40 
              },
            }}
            className="pb-16"
          >
            {videos.map((video, index) => (
              <SwiperSlide key={video.id?.videoId || index}>
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                    <iframe
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={`https://www.youtube.com/embed/${video.id?.videoId}?rel=0&modestbranding=1&showinfo=0`}
                      title={video.snippet?.title || 'YouTube Video'}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                      <div className="bg-red-500 rounded-full p-4 shadow-lg transform scale-100 group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                      {video.snippet?.title || 'Untitled Video'}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                      {truncateText(video.snippet?.description)}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {video.snippet?.publishedAt 
                          ? formatDate(video.snippet.publishedAt)
                          : 'Unknown date'
                        }
                      </div>
                      <a 
                        href={`https://www.youtube.com/watch?v=${video.id?.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        Watch Now
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx>{`
        .youtube-slider-container .swiper-button-next,
        .youtube-slider-container .swiper-button-prev {
          color: #2563EB;
          background: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #E5E7EB;
          transition: all 0.3s ease;
        }
        
        .youtube-slider-container .swiper-button-next:hover,
        .youtube-slider-container .swiper-button-prev:hover {
          background: #2563EB;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }
        
        .youtube-slider-container .swiper-button-next:after,
        .youtube-slider-container .swiper-button-prev:after {
          font-size: 18px;
          font-weight: 600;
        }
        
        .youtube-slider-container .swiper-pagination {
          bottom: 0 !important;
        }
        
        .youtube-slider-container .swiper-pagination-bullet {
          background-color: #CBD5E1;
          width: 12px;
          height: 12px;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .youtube-slider-container .swiper-pagination-bullet-active {
          background-color: #2563EB;
          transform: scale(1.2);
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
        
        .youtube-slider-container {
          position: relative;
        }
        
        .youtube-slider-container::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
          border-radius: 2rem;
          z-index: -1;
        }
      `}</style>
    </section>
  );
};

export default YouTubeSlider;