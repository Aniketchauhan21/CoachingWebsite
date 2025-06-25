import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Youtube, 
  Facebook, 
  Instagram, 
  BookOpen,
  Users,
  Award,
  Clock
} from 'lucide-react';
import footerlogo from '../../assets/images/footerlogo.jpg';
import { FaXTwitter } from "react-icons/fa6";
import googlePlayImage from '../../assets/images/googleplay.png'; // Path to your Google Play image

import '../../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section">
            <h3 className="footer-title">
              <img 
                src={footerlogo}
                alt="Discuss Coaching Logo"
                className="footer-logo"
              />
            </h3>
            <p className="footer-description">
              Empowering students with quality education and personalized coaching.
            </p>
            <div className="social-links">
              <a href="https://www.youtube.com/@DiscussCoachingbyhemant" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                <Youtube size={20} />
              </a>
              <a href="#" className="social-link facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link twitter">
                <FaXTwitter size={20} />
              </a>
            </div>

            {/* Google Play Button (added here after social icons) */}
            <div className="google-play-section">
              <a href="https://play.google.com/store/apps/details?id=com.vuichc.hdnpdc&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
                <img src={googlePlayImage} alt="Get it on Google Play" className="google-play-button" />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#faculty">Faculty</a></li>
              <li><a href="#results">Results</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Courses Section */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Our Courses</h4>
            <ul className="footer-links">
              <li><a href="#jee">JEE Main & Advanced</a></li>
              <li><a href="#neet">NEET</a></li>
              <li><a href="#boards">Class 11th & 12th</a></li>
              <li><a href="#foundation">Foundation Courses</a></li>
              <li><a href="#test-series">Test Series</a></li>
              <li><a href="#doubt-clearing">Doubt Clearing</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Info</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <MapPin size={18} />
                <span>FRONT ON S.S JEWELLERS, 396/12 NEW RAILWAY ROAD, MAIN BUS STAND, Gurugram, Haryana 122001</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} />
                <a href="tel:+918184008500">+91-8184008500</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} />
                <a href="mailto:discusscoaching@gmail.com">discusscoaching@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="footer-features">
          <div className="feature-item">
            <BookOpen size={24} />
            <span>Quality Education</span>
          </div>
          <div className="feature-item">
            <Users size={24} />
            <span>Expert Faculty</span>
          </div>
          <div className="feature-item">
            <Award size={24} />
            <span>Proven Results</span>
          </div>
          <div className="feature-item">
            <Clock size={24} />
            <span>Flexible Timings</span>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Discuss Coaching. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <span>|</span>
              <a href="/terms-conditions">Terms & Conditions</a>
              <span>|</span>
              <a href="/refund">Refund Policy</a>
            </div>
          </div>
        </div>

        {/* Developed By Section */}
        <div className="developed-by">
          <p>Developed by <a href="https://www.maharishidigitalhub.com/" target="_blank" rel="noopener noreferrer">Maharishi Digital Hub</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
