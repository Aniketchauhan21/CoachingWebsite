import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Import the Layout component

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import Blog from './pages/Blog';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from '../src/components/admin/AdminDashboard';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

import './App.css';
import DirectorsDesk from './pages/about/DirectorsDesk';
import AboutInstitute from './pages/about/AboutInstitute';
import StudentLogin from './components/student/StudentLogin';
import StudentRegister from './components/student/StudentRegister';
import StudentDashboard from './components/student/StudentDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import CourseEnrollment from './components/student/CourseEnrollment';
import StudentProfile from './components/student/StudentProfile';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/directors-desk" element={<DirectorsDesk />} />
          <Route path="/about/institute" element={<AboutInstitute />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/student/login" element={<StudentLogin/>} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/my-courses" element={<CourseEnrollment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />


          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
