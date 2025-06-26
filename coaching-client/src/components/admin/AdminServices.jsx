import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  X,
  AlertCircle,
  CheckCircle,
  Upload,
  ImageIcon,
  Star,
  Users
} from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';

const AdminServices = ({ onStatsUpdate }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'general',
    duration: '',
    rating: '',
    clients_served: '',
    is_active: true
  });

  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory,
        active: 'all'
      });
      
      const response = await fetch(`${API_BASE}/services?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setServices(data.services || []);
      } else {
        throw new Error(data.message || 'Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      showNotification('Error fetching services', 'error');
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
        setCategories(['', ...data.categories]);
      } else {
        setCategories(['']);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(['']);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [searchTerm, selectedCategory]);

  // Update parent stats whenever services change
  useEffect(() => {
    if (onStatsUpdate && typeof onStatsUpdate === 'function') {
      onStatsUpdate();
    }
  }, [services.length, onStatsUpdate]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setServiceForm({
      title: '',
      description: '',
      price: '',
      category: 'general',
      duration: '',
      rating: '',
      clients_served: '',
      is_active: true
    });
    setEditingService(null);
    setImagePreview(null);
    setSelectedImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append form data
      Object.keys(serviceForm).forEach(key => {
        formData.append(key, serviceForm[key]);
      });

      // Append image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const url = editingService 
        ? `${API_BASE}/services/${editingService.id}`
        : `${API_BASE}/services`;
      
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        showNotification(data.message, 'success');
        fetchServices();
        setShowModal(false);
        resetForm();
        
        // Update parent stats
        if (onStatsUpdate && typeof onStatsUpdate === 'function') {
          onStatsUpdate();
        }
      } else {
        throw new Error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setServiceForm({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      category: service.category,
      duration: service.duration || '',
      rating: service.rating || '',
      clients_served: service.clients_served || '',
      is_active: service.is_active
    });
    setEditingService(service);
    setImagePreview(service.image_url ? getImageUrl(service.image_url) : null);
    setShowModal(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Service deleted successfully', 'success');
        fetchServices();
        
        // Update parent stats
        if (onStatsUpdate && typeof onStatsUpdate === 'function') {
          onStatsUpdate();
        }
      } else {
        throw new Error(data.message || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    setLoading(true);
    try {
      // Try direct update with PUT method first
      let response = await fetch(`${API_BASE}/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          is_active: !currentStatus,
          update_type: 'status_only'
        })
      });

      // If that fails, try the toggle endpoint
      if (!response.ok) {
        response = await fetch(`${API_BASE}/services/${serviceId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ is_active: !currentStatus })
        });
      }

      // If both fail, try a simple PATCH
      if (!response.ok) {
        response = await fetch(`${API_BASE}/services/${serviceId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ is_active: !currentStatus })
        });
      }

      const data = await response.json();

      if (data.success || response.ok) {
        showNotification(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
        
        // Update the service in local state immediately
        setServices(prevServices => 
          prevServices.map(service => 
            service.id === serviceId 
              ? { ...service, is_active: !currentStatus }
              : service
          )
        );
        
        // Also fetch fresh data
        fetchServices();
      } else {
        throw new Error(data.message || 'Failed to update service status');
      }
    } catch (error) {
      console.error('Error updating service status:', error);
      showNotification('Failed to update service status. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
          style={{ backgroundColor: '#eda835' }}
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ '--tw-ring-color': '#eda835' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ '--tw-ring-color': '#eda835' }}
          >
            <option value="">All Categories</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#eda835' }}></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No services found
          </div>
        ) : (
          filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Service Image */}
              <div className="h-48 bg-gray-200 relative">
                {service.image_url ? (
                  <img 
                    src={getImageUrl(service.image_url)} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Service Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold" style={{ color: '#eda835' }}>
                    ₹{service.price}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {service.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  {service.rating && (
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500" />
                      <span>{service.rating}</span>
                    </div>
                  )}
                  {service.clients_served && (
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{service.clients_served} clients</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 text-white px-3 py-2 rounded-md hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#eda835' }}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleServiceStatus(service.id, service.is_active)}
                    disabled={loading}
                    className={`px-3 py-2 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 ${
                      service.is_active
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {service.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      style={{ '--tw-ring-color': '#eda835' }}
                    />
                  </div>
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={serviceForm.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  style={{ '--tw-ring-color': '#eda835' }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={serviceForm.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  style={{ '--tw-ring-color': '#eda835' }}
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={serviceForm.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#eda835' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={serviceForm.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#eda835' }}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration, Rating, Clients Served */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={serviceForm.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#eda835' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={serviceForm.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#eda835' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clients Served
                  </label>
                  <input
                    type="number"
                    name="clients_served"
                    value={serviceForm.clients_served}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#eda835' }}
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={serviceForm.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 focus:ring-orange-500 border-gray-300 rounded"
                  style={{ 
                    accentColor: '#eda835',
                    '--tw-ring-color': '#eda835'
                  }}
                />
                <label className="text-sm font-medium text-gray-700">
                  Service is active
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#eda835' }}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
          notification.type === 'error' 
            ? 'bg-red-600 text-white' 
            : 'bg-green-600 text-white'
        }`}>
          {notification.type === 'error' ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle size={20} />
          )}
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdminServices;