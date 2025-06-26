import React, { useState, useEffect } from 'react';
import { AlertCircle, Star, Clock, Users, ChevronRight, Loader2, ImageIcon } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';

// Custom Loader Component
const CustomLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <Loader2 className="w-12 h-12 text-[#eda835] animate-spin" />
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Services</h3>
      <p className="text-gray-500">Please wait while we fetch our latest services...</p>
    </div>
  </div>
);

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters for active services only
      const params = new URLSearchParams({
        active: 'true', // Only fetch active services for public view
        limit: '50' // Adjust as needed
      });
      
      const response = await fetch(`${API_BASE}/services?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setServices(Array.isArray(data.services) ? data.services : []);
      } else {
        throw new Error(data.message || 'Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/services/categories`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.categories)) {
        // Add 'all' as first option and then the categories from backend
        setCategories(['all', ...data.categories]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Keep default categories if fetch fails
      setCategories(['all', 'general', 'premium', 'basic']);
    }
  };

  const handleGetService = (serviceId) => {
    // In real app, this would navigate to service details or contact form
    // You can implement navigation to booking page or contact form here
    alert(`Redirecting to service ${serviceId} booking page...`);
    // Example: navigate(`/services/${serviceId}/book`);
  };
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => 
        service.category && service.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  if (loading) return <CustomLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchServices}
              className="bg-[#eda835] text-white px-6 py-3 rounded-lg hover:bg-[#d4941f] transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className=" text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#eda835]">Services</span>
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Comprehensive solutions tailored to meet your business needs. From development to deployment, we've got you covered.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#eda835] text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {Array.isArray(filteredServices) && filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {service.image_url || service.image_path ? (
                    <img
                      src={getImageUrl(service.image_url || service.image_path)}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        // If image fails to load, show placeholder
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full ${(service.image_url || service.image_path) ? 'hidden' : 'flex'} items-center justify-center bg-gray-200`}
                    style={{ display: (service.image_url || service.image_path) ? 'none' : 'flex' }}
                  >
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-gray-800 capitalize">
                      {service.category || 'General'}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  {service.rating && (
                    <div className="absolute top-4 left-4 bg-[#eda835]/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star className="w-3 h-3 text-white fill-current" />
                      <span className="text-sm font-medium text-white">
                        {service.rating}
                      </span>
                    </div>
                  )}
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                  
                  {/* Service Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {service.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {service.clients_served ? `${service.clients_served} clients` : 'Professional Service'}
                      </span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{Number(service.price).toLocaleString('en-IN')}
                      <span className="text-sm font-normal text-gray-500 ml-1">starting</span>
                    </div>
                    <button
                      onClick={() => handleGetService(service.id)}
                      className="bg-[#eda835] text-white px-6 py-2 rounded-lg hover:bg-[#d4941f] transition-all duration-200 flex items-center space-x-2 group"
                    >
                      <span>Get Service</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Found</h3>
              <p className="text-gray-600 mb-6">
                {selectedCategory === 'all' 
                  ? 'No services are currently available. Please check back later.' 
                  : `No services found in "${selectedCategory}" category.`}
              </p>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-[#eda835] text-white px-6 py-2 rounded-lg hover:bg-[#d4941f] transition-colors duration-200"
                >
                  View All Services
                </button>
              )}
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        {filteredServices.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-[#eda835] to-[#eda835] rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-6 opacity-90">
              Contact us today to discuss your project requirements and get a customized quote.
            </p>
            <button className="bg-white text-[#eda835] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Contact Us Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;