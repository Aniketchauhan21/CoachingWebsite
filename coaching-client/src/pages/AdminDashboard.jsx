import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);

  const [courseForm, setCourseForm] = useState({ title: '', description: '', duration: '', price: '', faculty: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', author: '' });
  const [blogImage, setBlogImage] = useState(null);
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', price: '' });

  const [editingCourse, setEditingCourse] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchData = useCallback(async () => {
    try {
      const config = getAuthConfig();
      const [coursesRes, blogsRes, servicesRes] = await Promise.all([
        axios.get(`${API_URL}/api/courses`, config),
        axios.get(`${API_URL}/api/blogs`, config),
        axios.get(`${API_URL}/api/services`, config)
      ]);
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      setBlogs(Array.isArray(blogsRes.data) ? blogsRes.data : []);
      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  // COURSE
  const handleCourseSubmit = async e => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axios.put(`${API_URL}/api/courses/${editingCourse}`, courseForm, getAuthConfig());
        setEditingCourse(null);
        alert('Course updated!');
      } else {
        await axios.post(`${API_URL}/api/courses`, courseForm, getAuthConfig());
        alert('Course added!');
      }
      setCourseForm({ title: '', description: '', duration: '', price: '', faculty: '' });
      fetchData();
    } catch (err) {
      alert(editingCourse ? 'Error updating course' : 'Error adding course');
      console.error(err);
    }
  };

  const handleEditCourse = (course) => {
    setCourseForm(course);
    setEditingCourse(course.id);
  };

  const cancelEditCourse = () => {
    setEditingCourse(null);
    setCourseForm({ title: '', description: '', duration: '', price: '', faculty: '' });
  };

  // BLOG
  const handleBlogSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', blogForm.title);
      formData.append('content', blogForm.content);
      formData.append('author', blogForm.author);
      if (blogImage) formData.append('image', blogImage);

      if (editingBlog) {
        await axios.put(`${API_URL}/api/blogs/${editingBlog}`, formData, {
          ...getAuthConfig(),
          headers: {
            ...getAuthConfig().headers,
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditingBlog(null);
        alert('Blog updated!');
      } else {
        await axios.post(`${API_URL}/api/blogs`, formData, {
          ...getAuthConfig(),
          headers: {
            ...getAuthConfig().headers,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Blog added!');
      }
      setBlogForm({ title: '', content: '', author: '' });
      setBlogImage(null);
      fetchData();
    } catch (err) {
      alert(editingBlog ? 'Error updating blog' : 'Error adding blog');
      console.error(err);
    }
  };

  const handleEditBlog = (blog) => {
    setBlogForm({ title: blog.title, content: blog.content, author: blog.author });
    setEditingBlog(blog.id);
  };

  const cancelEditBlog = () => {
    setEditingBlog(null);
    setBlogForm({ title: '', content: '', author: '' });
    setBlogImage(null);
  };

  // SERVICE
  const handleServiceSubmit = async e => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`${API_URL}/api/services/${editingService}`, serviceForm, getAuthConfig());
        setEditingService(null);
        alert('Service updated!');
      } else {
        await axios.post(`${API_URL}/api/services`, serviceForm, getAuthConfig());
        alert('Service added!');
      }
      setServiceForm({ title: '', description: '', price: '' });
      fetchData();
    } catch (err) {
      alert(editingService ? 'Error updating service' : 'Error adding service');
      console.error(err);
    }
  };

  const handleEditService = (service) => {
    setServiceForm(service);
    setEditingService(service.id);
  };

  const cancelEditService = () => {
    setEditingService(null);
    setServiceForm({ title: '', description: '', price: '' });
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
      try {
        await axios.delete(`${API_URL}/api/${type}/${id}`, getAuthConfig());
        fetchData();
        alert(`${type.slice(0, -1)} deleted successfully!`);
      } catch (err) {
        alert(`Error deleting ${type}`);
        console.error(err);
      }
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
        {['courses', 'blogs', 'services'].map(tab => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'courses' && (
        <section>
          <h2>{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
          <form onSubmit={handleCourseSubmit} className="form-grid">
            <input name="title" placeholder="Title" value={courseForm.title} onChange={e => handleInputChange(e, setCourseForm)} required />
            <input name="description" placeholder="Description" value={courseForm.description} onChange={e => handleInputChange(e, setCourseForm)} required />
            <input name="duration" placeholder="Duration" value={courseForm.duration} onChange={e => handleInputChange(e, setCourseForm)} />
            <input name="price" type="number" placeholder="Price" value={courseForm.price} onChange={e => handleInputChange(e, setCourseForm)} />
            <input name="faculty" placeholder="Faculty" value={courseForm.faculty} onChange={e => handleInputChange(e, setCourseForm)} />
            <div className="form-buttons">
              <button type="submit">{editingCourse ? 'Update Course' : 'Save Course'}</button>
              {editingCourse && <button type="button" onClick={cancelEditCourse} className="cancel-btn">Cancel</button>}
            </div>
          </form>

          <h3>Courses List</h3>
          <div className="cards-grid">
            {courses.map(c => (
              <div key={c.id} className="card">
                <h4>{c.title}</h4>
                <p>{c.description}</p>
                <p><b>Duration:</b> {c.duration}</p>
                <p><b>Price:</b> ₹{c.price}</p>
                <p><b>Faculty:</b> {c.faculty}</p>
                <div className="card-buttons">
                  <button onClick={() => handleEditCourse(c)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(c.id, 'courses')} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'blogs' && (
        <section>
          <h2>{editingBlog ? 'Edit Blog' : 'Add Blog'}</h2>
          <form onSubmit={handleBlogSubmit} className="form-grid" encType="multipart/form-data">
            <input name="title" placeholder="Title" value={blogForm.title} onChange={e => handleInputChange(e, setBlogForm)} required />
            <textarea name="content" placeholder="Content" value={blogForm.content} onChange={e => handleInputChange(e, setBlogForm)} required />
            <input name="author" placeholder="Author" value={blogForm.author} onChange={e => handleInputChange(e, setBlogForm)} />
            <input type="file" accept="image/*" onChange={e => setBlogImage(e.target.files[0])} />
            <div className="form-buttons">
              <button type="submit">{editingBlog ? 'Update Blog' : 'Save Blog'}</button>
              {editingBlog && <button type="button" onClick={cancelEditBlog} className="cancel-btn">Cancel</button>}
            </div>
          </form>

          <h3>Blogs List</h3>
          <div className="cards-grid">
            {blogs.map(b => (
              <div key={b.id} className="card">
                {b.image_url && <img src={`${API_URL}${b.image_url}`} alt={b.title} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover' }} />}
                <h4>{b.title}</h4>
                <p>{b.content.substring(0, 100)}...</p>
                <p><i>By: {b.author}</i></p>
                <div className="card-buttons">
                  <button onClick={() => handleEditBlog(b)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(b.id, 'blogs')} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'services' && (
        <section>
          <h2>{editingService ? 'Edit Service' : 'Add Service'}</h2>
          <form onSubmit={handleServiceSubmit} className="form-grid">
            <input name="title" placeholder="Title" value={serviceForm.title} onChange={e => handleInputChange(e, setServiceForm)} required />
            <input name="description" placeholder="Description" value={serviceForm.description} onChange={e => handleInputChange(e, setServiceForm)} />
            <input name="price" type="number" placeholder="Price" value={serviceForm.price} onChange={e => handleInputChange(e, setServiceForm)} />
            <div className="form-buttons">
              <button type="submit">{editingService ? 'Update Service' : 'Save Service'}</button>
              {editingService && <button type="button" onClick={cancelEditService} className="cancel-btn">Cancel</button>}
            </div>
          </form>

          <h3>Services List</h3>
          <div className="cards-grid">
            {services.map(s => (
              <div key={s.id} className="card">
                <h4>{s.title}</h4>
                <p>{s.description}</p>
                <p><b>Price:</b> ₹{s.price}</p>
                <div className="card-buttons">
                  <button onClick={() => handleEditService(s)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(s.id, 'services')} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
