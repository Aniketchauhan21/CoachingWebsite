import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeUser = useCallback((userData) => {
    if (!userData) return null;

    let normalized = {
      id: null,
      name: null,
      email: null,
      username: null,
      role: null
    };

    if (userData.role === 'student') {
      normalized.id = userData.id;
      normalized.name = userData.name;
      normalized.email = userData.email;
      normalized.role = 'student';
    } else if (userData.role === 'admin') {
      normalized.username = userData.username;
      normalized.role = 'admin';
      // For hardcoded admin, id/name/email might not exist in JWT, so they will be null or undefined.
      // This is okay as we primarily rely on username and role for admin.
      normalized.id = userData.id || null; 
      normalized.name = userData.name || null;
      normalized.email = userData.email || null;
    } else {
        console.warn("AuthContext: Normalizing user with unknown role:", userData);
        normalized = { ...userData };
    }
    return normalized;
  }, []);

  const setUser = useCallback((userData) => {
      setUserState(normalizeUser(userData));
  }, [normalizeUser]);

  const getToken = useCallback(() => {
    // CRITICAL FIX: Check both 'token' and 'adminToken' for backward compatibility
    return localStorage.getItem('token') || localStorage.getItem('adminToken');
  }, []);

  const decodeToken = useCallback((tokenToCheck) => {
    try {
      const decoded = jwtDecode(tokenToCheck);
      // Check if token is expired client-side (before sending to server)
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('Client-side: JWT token expired.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken'); // Clean both tokens
        localStorage.removeItem('user');
        return null;
      }
      return decoded;
    } catch (err) {
      console.error('Client-side: Token decoding error or invalid token:', err.message);
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken'); // Clean both tokens
      localStorage.removeItem('user');
      return null;
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    console.log('AuthContext: checkAuthStatus called.'); // Debug log

    const storedToken = getToken();
    if (!storedToken) {
      console.log('AuthContext: No stored token found, setting user to null.'); // Debug log
      setUser(null);
      setIsLoading(false);
      return;
    }
    console.log('AuthContext: Stored token found, attempting client-side decode.'); // Debug log

    const decoded = decodeToken(storedToken);
    if (!decoded) {
      console.log('AuthContext: Stored token invalid or expired client-side, setting user to null.'); // Debug log
      setUser(null);
      setIsLoading(false);
      return;
    }
    console.log('AuthContext: Token decoded successfully client-side, calling /auth/verify on backend.'); // Debug log

    try {
      // CRITICAL FIX: Add a unique timestamp query parameter to bypass browser/proxy caches
      const cacheBustingUrl = `${API_BASE_URL}/auth/verify?t=${Date.now()}`; 
      const res = await axios.get(cacheBustingUrl, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      console.log('AuthContext: Received response from /auth/verify.', res.data); // Debug log
      
      // CRITICAL FIX: Check for 'success' instead of 'valid' to match backend response
      if (res.data.success && res.data.user) {
        console.log('AuthContext: /auth/verify successful, setting user state and localStorage.'); // Debug log
        setUser(res.data.user);
        setToken(storedToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // CRITICAL FIX: Ensure we're using consistent token storage
        localStorage.setItem('token', storedToken);
        // Remove old adminToken if it exists
        if (localStorage.getItem('adminToken')) {
          localStorage.removeItem('adminToken');
        }
      } else {
        console.log('AuthContext: /auth/verify returned invalid or no user data, clearing session.'); // Debug log
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken'); // Clean both tokens
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('AuthContext: Authentication verification failed (server-side):', err.response?.data?.message || err.message); // Debug log
      // If server responds with 401/403, it's an invalid token, so clear it.
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken'); // Clean both tokens
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
      console.log('AuthContext: checkAuthStatus finished.'); // Debug log
    }
  }, [getToken, decodeToken, setUser, setToken]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials, userType) => {
    setIsLoading(true);
    console.log(`AuthContext: Attempting login for userType: ${userType}, credentials:`, credentials); // Debug log
    try {
      const endpoint = userType === 'admin' ? '/auth/admin/login' : '/auth/student/login';
      const payload = userType === 'admin' ? { username: credentials.username, password: credentials.password } : { email: credentials.email, password: credentials.password };

      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      const { token: newToken, user: userData } = res.data;
      console.log('AuthContext: Login API response received.', { newToken, userData }); // Debug log

      const decoded = decodeToken(newToken);
      if (!decoded) {
        console.error('AuthContext: Login successful, but received token is invalid client-side.');
        return { success: false, message: 'Login failed due to invalid token received.' };
      }
      
      setUser(userData);
      setToken(newToken);
      
      // CRITICAL FIX: Always use 'token' key for consistency
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Clean up old adminToken if it exists
      localStorage.removeItem('adminToken');
      
      console.log('AuthContext: Login successful, user state updated, localStorage set.'); // Debug log
      
      return { success: true, user: userData, message: res.data.message };
    } catch (err) {
      console.error('AuthContext: Login failed:', err.response?.data?.message || err.message); // Debug log
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Login process finished.'); // Debug log
    }
  };

  const registerStudent = async (data) => {
    setIsLoading(true);
    console.log('AuthContext: Attempting student registration.'); // Debug log
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/student/register`, data);
      const { token: newToken, user: newUser } = res.data;
      console.log('AuthContext: Registration API response received.', { newToken, newUser }); // Debug log

      const decoded = decodeToken(newToken);
      if (!decoded) {
          console.error('AuthContext: Registration successful, but received token is invalid client-side.');
          return { success: false, message: 'Registration successful, but received token is invalid.' };
      }

      setUser(newUser);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser)); 
      console.log('AuthContext: Registration successful, user state updated, localStorage set.'); // Debug log

      return { success: true, user: newUser, message: res.data.message || 'Registration successful!' };
    } catch (err) {
      console.error('AuthContext: Registration failed:', err.response?.data?.message || err.message); // Debug log
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Registration process finished.'); // Debug log
    }
  };

  const logout = useCallback(() => {
    console.log('AuthContext: Logging out.'); // Debug log
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken'); // Clean both tokens
    localStorage.removeItem('user');
    setUserState(null);
    setToken(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  const authContextValue = {
    user,
    isLoading,
    login,
    registerStudent,
    logout,
    isAdmin,
    isStudent,
    getToken,
    setUser,
    checkAuthStatus // Expose checkAuthStatus for explicit calls if needed
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};