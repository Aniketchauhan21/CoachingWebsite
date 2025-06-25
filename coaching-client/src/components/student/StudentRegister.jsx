import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // CRITICAL FIX: Re-import axios
import Loader from '../comman/Loader'; // Assuming this path is correct
import { useAuth } from '../../context/AuthContext'; // CRITICAL: Import useAuth hook

// const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api'; // This is fine to be commented if only used via process.env

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { registerStudent: authRegisterStudent } = useAuth(); 

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Step 1: Handle sending OTP to the provided email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const { email } = formData;

    if (!email) {
      setError('Please enter your email to receive OTP.');
      setLoading(false);
      return;
    }

    try {
      // Call the backend endpoint to send OTP directly via axios
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api'}/auth/send-otp`, { email });
      setSuccessMessage(response.data.message);
      setShowOtpInput(true);
    } catch (err) {
      console.error('Failed to send OTP:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle full registration with OTP
  const handleRegisterWithOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !phone || !password || !confirmPassword || !otp) {
      setError('Please fill all required fields and enter the OTP.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const registrationResult = await authRegisterStudent({
        name,
        email,
        phone,
        password,
        otp
      });

      if (registrationResult.success) {
        setSuccessMessage(registrationResult.message || 'Registration and OTP verification successful!');
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 100);
      } else {
        setError(registrationResult.message || 'Registration failed.');
      }

    } catch (err) {
      console.error('Registration failed:', err.message);
      setError(err.message || 'Registration failed unexpectedly.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Student Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/student/login" className="font-medium text-yellow-600 hover:text-yellow-700">
              Sign in here
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={showOtpInput ? handleRegisterWithOtp : handleSendOtp} className="space-y-4">
          <InputField label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} required={true} disabled={showOtpInput} />
          <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required={true} disabled={showOtpInput} />
          <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required={true} disabled={showOtpInput} />
          <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required={true} disabled={showOtpInput} />
          <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required={true} disabled={showOtpInput} />

          {showOtpInput && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ffd700] focus:border-[#ffd700]"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600"
          >
            {showOtpInput ? 'Complete Registration' : 'Send OTP & Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

// InputField component - updated to accept 'disabled' prop
const InputField = ({ label, name, type, value, onChange, required, disabled }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled} // Added disabled prop
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ffd700] focus:border-[#ffd700]"
    />
  </div>
);

export default StudentRegister;
