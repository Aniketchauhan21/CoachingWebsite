// src/components/common/YouTubeSlider.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const YOUTUBE_API_KEY = 'AIzaSyCTSFzFKcFoDvlceTALxSznBhmTvCup8L0'; // Replace with your API Key
const CHANNEL_ID = 'UCEWHguinafpNRQb5C0OEsFA'; // Replace with your Channel ID

const YouTubeSlider = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: 'snippet',
            channelId: CHANNEL_ID,
            maxResults: 10,
            order: 'date',
            key: YOUTUBE_API_KEY
          }
        });
        setVideos(data.items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading videos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Latest Videos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch our latest educational content and stay updated with new courses
          </p>
        </div>

        <div className="youtube-slider-container">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            navigation={true}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            modules={[Navigation, Pagination]}
            breakpoints={{
              640: { 
                slidesPerView: 1,
                spaceBetween: 20 
              },
              768: { 
                slidesPerView: 2,
                spaceBetween: 30 
              },
              1024: { 
                slidesPerView: 3,
                spaceBetween: 30 
              },
            }}
            className="pb-12"
          >
            {videos.map((video, index) => (
              <SwiperSlide key={video.id.videoId || index}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id.videoId}`}
                      title={video.snippet.title}
                      frameBorder="0"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                      {video.snippet.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {video.snippet.description || 'No description available'}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(video.snippet.publishedAt).toLocaleDateString()}
                      </span>
                      <a 
                        href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Watch on YouTube →
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
          font-weight: bold;
        }
        
        .youtube-slider-container .swiper-button-next:after,
        .youtube-slider-container .swiper-button-prev:after {
          font-size: 20px;
        }
        
        .youtube-slider-container .swiper-pagination-bullet {
          background-color: #2563EB;
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
};

export default YouTubeSlider;