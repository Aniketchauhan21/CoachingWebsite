import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminCourses from './AdminCourses';
import AdminBlogs from './AdminBlogs';
import AdminServices from './AdminServices';
import AdminStudents from './AdminStudents';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user, isAdmin, isLoading, getToken, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalBlogs: 0,
    totalServices: 0,
    totalEnrollments: 0
  });
  // const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', duration: '', price: '', faculty: ''
  });
  const [blogForm, setBlogForm] = useState({
    title: '', content: '', author: ''
  });
  const [blogImage, setBlogImage] = useState(null);
  const [existingBlogImage, setExistingBlogImage] = useState('');
  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', price: ''
  });

  // Edit states
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Auth configuration
  const getAuthConfig = () => {
    const token = getToken();
    return token ? {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    } : { headers: {} };
  };

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      if (!isAdmin) {
        setError("You are not authorized to view this page. Please log in as an administrator.");
        setTimeout(() => {
          logout();
          navigate('/admin/login');
        }, 2000);
        return;
      }
    }
  }, [user, isAdmin, isLoading, navigate, logout]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats`, getAuthConfig());
      setStats(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      } else {
        setStats({
          totalStudents: students.length,
          totalCourses: courses.length,
          totalBlogs: blogs.length,
          totalServices: services.length,
          totalEnrollments: 0
        });
      }
    }
  }, [isAdmin, logout, navigate, students.length, courses.length, blogs.length, services.length]);

  // // Fetch recent enrollments
  // const fetchRecentEnrollments = useCallback(async () => {
  //   if (!isAdmin) return;
    
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/admin/enrollments/recent`, getAuthConfig());
  //     setRecentEnrollments(Array.isArray(response.data) ? response.data : []);
  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //       logout();
  //       navigate('/admin/login');
  //     } else {
  //       setRecentEnrollments([]);
  //     }
  //   }
  // }, [isAdmin, logout, navigate]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      setError('');
      
      const publicConfig = {};
      const authConfig = getAuthConfig();
      
      const promises = [
        axios.get(`${API_BASE_URL}/courses`, publicConfig).catch(() => 
          axios.get(`${API_BASE_URL}/courses`, authConfig)
        ),
        axios.get(`${API_BASE_URL}/blogs`, publicConfig).catch(() => 
          axios.get(`${API_BASE_URL}/blogs`, authConfig)
        ),
        axios.get(`${API_BASE_URL}/services`, publicConfig).catch(() => 
          axios.get(`${API_BASE_URL}/services`, authConfig)
        ),
        axios.get(`${API_BASE_URL}/admin/students`, authConfig).catch(() => 
          ({ data: { students: [] } })
        ),
      ];

      const [coursesRes, blogsRes, servicesRes, studentsRes] = await Promise.all(promises);

      const studentsArr = Array.isArray(studentsRes.data)
        ? studentsRes.data
        : (studentsRes.data.students || []);  

      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      setBlogs(Array.isArray(blogsRes.data) ? blogsRes.data : []);
      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
      setStudents(studentsArr);
      
      setError('');
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      } else {
        setError('Failed to fetch some data. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin, logout, navigate]);

  // Fetch data when user is confirmed to be admin
  useEffect(() => {
    if (!isLoading && isAdmin && user) {
      fetchAllData();
      // fetchRecentEnrollments();
    }
  }, [fetchAllData, user, isAdmin, isLoading]);

  // Update stats when data changes
  useEffect(() => {
    if (isAdmin && !isLoading) {
      fetchStats();
    }
  }, [fetchStats, courses.length, blogs.length, services.length, students.length, isAdmin, isLoading]);

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const showSuccess = (message) => {
    alert(message);
    setError('');
  };

  const showError = (message) => {
    alert(message);
    setError(message);
  };

  // Course handlers
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const config = getAuthConfig();
      
      if (editingCourseId) {
        await axios.put(`${API_BASE_URL}/courses/${editingCourseId}`, courseForm, config);
        setEditingCourseId(null);
        showSuccess('Course updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/courses`, courseForm, config);
        showSuccess('Course added successfully!');
      }
      
      setCourseForm({ title: '', description: '', duration: '', price: '', faculty: '' });
      await fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        showError(`${editingCourseId ? 'Error updating course' : 'Error adding course'}: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      price: course.price || '',
      faculty: course.faculty || ''
    });
    setEditingCourseId(course.id);
  };

  const cancelEditCourse = () => {
    setEditingCourseId(null);
    setCourseForm({ title: '', description: '', duration: '', price: '', faculty: '' });
  };

  // Blog handlers
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('title', blogForm.title);
      formData.append('content', blogForm.content);
      formData.append('author', blogForm.author);
      
      if (blogImage) {
        formData.append('image', blogImage);
      }

      const config = {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingBlogId) {
        await axios.put(`${API_BASE_URL}/blogs/${editingBlogId}`, formData, config);
        setEditingBlogId(null);
        showSuccess('Blog updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/blogs`, formData, config);
        showSuccess('Blog added successfully!');
      }
      
      setBlogForm({ title: '', content: '', author: '' });
      setBlogImage(null);
      setExistingBlogImage('');
      
      await fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        showError(`${editingBlogId ? 'Error updating blog' : 'Error adding blog'}: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (blog) => {
    setBlogForm({ 
      title: blog.title || '', 
      content: blog.content || '', 
      author: blog.author || '' 
    });
    setEditingBlogId(blog.id);
    setExistingBlogImage(blog.image_url || '');
  };

  const cancelEditBlog = () => {
    setEditingBlogId(null);
    setBlogForm({ title: '', content: '', author: '' });
    setBlogImage(null);
    setExistingBlogImage('');
  };

  // Service handlers
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const config = getAuthConfig();
      
      if (editingServiceId) {
        await axios.put(`${API_BASE_URL}/services/${editingServiceId}`, serviceForm, config);
        setEditingServiceId(null);
        showSuccess('Service updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/services`, serviceForm, config);
        showSuccess('Service added successfully!');
      }
      
      setServiceForm({ title: '', description: '', price: '' });
      await fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        showError(`${editingServiceId ? 'Error updating service' : 'Error adding service'}: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service) => {
    setServiceForm({
      title: service.title || '',
      description: service.description || '',
      price: service.price || ''
    });
    setEditingServiceId(service.id);
  };

  const cancelEditService = () => {
    setEditingServiceId(null);
    setServiceForm({ title: '', description: '', price: '' });
  };

  // Delete handler
  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
      try {
        setLoading(true);
        setError('');
        
        const endpoint = type === 'students' ? `/admin/students/${id}` : `/${type}/${id}`;
        const config = getAuthConfig();
        
        await axios.delete(`${API_BASE_URL}${endpoint}`, config);
        await fetchAllData();
        showSuccess(`${type.slice(0, -1)} deleted successfully!`);
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          navigate('/admin/login');
        } else {
          const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
          showError(`Error deleting ${type.slice(0, -1)}: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4`} style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-3xl" style={{ color }}>{icon}</div>
      </div>
    </div>
  );

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if not authorized
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You are not authorized to view this page.</p>
          <button 
            onClick={() => navigate('/admin/login')}
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-[#473391] hover:text-white"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your coaching institute</p>
          <p className="text-sm text-blue-600">Welcome, {user?.username || user?.name}!</p>
          {error && (
            <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {loading && (
            <div className="mt-2 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              Loading...
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'courses', label: `Courses (${courses.length})` },
              { key: 'blogs', label: `Blogs (${blogs.length})` },
              { key: 'services', label: `Services (${services.length})` },
              { key: 'students', label: `Students (${students.length})` }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-3 font-medium text-sm rounded-md ${
                  activeTab === tab.key
                    ? 'bg-yellow-400 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard title="Total Students" value={stats.totalStudents} icon="👥" color="#4299E1" />
              <StatCard title="Total Courses" value={stats.totalCourses} icon="📚" color="#48BB78" />
              <StatCard title="Total Blogs" value={stats.totalBlogs} icon="📝" color="#9F7AEA" />
              <StatCard title="Total Services" value={stats.totalServices} icon="🛠️" color="#ECC94B" />
              <StatCard title="Total Enrollments" value={stats.totalEnrollments} icon="📈" color="#F56565" />
            </div>

            {/* Recent Enrollments */}
            {/* <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Enrollments</h3>
              {recentEnrollments.length === 0 ? (
                <p className="text-gray-500">No recent enrollments</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentEnrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {enrollment.studentName || enrollment.student_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {enrollment.courseTitle || enrollment.course_title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(enrollment.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div> */}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <AdminCourses
            courses={courses}
            courseForm={courseForm}
            setCourseForm={setCourseForm}
            editingCourseId={editingCourseId}
            setEditingCourseId={setEditingCourseId}
            handleCourseSubmit={handleCourseSubmit}
            handleEditCourse={handleEditCourse}
            cancelEditCourse={cancelEditCourse}
            handleDelete={handleDelete}
            loading={loading}
            handleInputChange={handleInputChange}
          />
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <AdminBlogs
            blogs={blogs}
            blogForm={blogForm}
            setBlogForm={setBlogForm}
            editingBlogId={editingBlogId}
            setEditingBlogId={setEditingBlogId}
            handleBlogSubmit={handleBlogSubmit}
            handleEditBlog={handleEditBlog}
            cancelEditBlog={cancelEditBlog}
            handleDelete={handleDelete}
            loading={loading}
            handleInputChange={handleInputChange}
            blogImage={blogImage}
            setBlogImage={setBlogImage}
            existingBlogImage={existingBlogImage}
            setExistingBlogImage={setExistingBlogImage}
            API_BASE_URL={API_BASE_URL}
          />
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <AdminServices
            services={services}
            serviceForm={serviceForm}
            setServiceForm={setServiceForm}
            editingServiceId={editingServiceId}
            setEditingServiceId={setEditingServiceId}
            handleServiceSubmit={handleServiceSubmit}
            handleEditService={handleEditService}
            cancelEditService={cancelEditService}
            handleDelete={handleDelete}
            loading={loading}
            handleInputChange={handleInputChange}
          />
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <AdminStudents
            students={students}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;