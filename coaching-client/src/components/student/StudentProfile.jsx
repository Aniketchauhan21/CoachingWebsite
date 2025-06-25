import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../comman/Loader';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StudentProfile = () => {
  const [loading, setLoading] = useState(true); // ✅ define loading state
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    axios
      .get(`${API_URL}/student/profile`, { headers })
      .then((res) => {
        setStudent(res.data);
        setForm({ name: res.data.name, phone: res.data.phone || '' });
      })
      .catch((err) => {
        console.error('Profile fetch failed:', err);
      })
      .finally(() => {
        setLoading(false); // ✅ Stop loading in all cases
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`${API_URL}/student/profile`, form, { headers })
      .then((res) => {
        alert('Profile updated!');
        setStudent(res.data.student);
        setEditMode(false);
      })
      .catch(() => alert('Update failed'));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
      {editMode ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Full Name"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Phone Number"
          />
          <button type="submit" className="bg-yellow-400 hover:bg-[#473391] text-white px-4 py-2 rounded">
            Save
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone:</strong> {student.phone || 'Not added'}</p>
          <button
            onClick={() => setEditMode(true)}
            className="bg-yellow-400 hover:bg-[#473391] text-white px-4 py-2 rounded mt-2"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
