import React from 'react';
import { Award, BookOpen, Users, Target, Heart, Globe, Star, CheckCircle } from 'lucide-react';
import '../../styles/about-institute.css'; // Adjust the path as necessary

const AboutInstitute = () => {
  return (
    <div className="about-institute-container">
      {/* Hero Section */}
      <div className="about-institute-hero">
        <div className="about-institute-hero-overlay"></div>
        <div className="about-institute-hero-content">
          <div className="about-institute-hero-text">
            <h1 className="about-institute-hero-title">
              About Our Institute
            </h1>
            <p className="about-institute-hero-subtitle">
              Where Education Meets Inspiration
            </p>
            <div className="about-institute-hero-line"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-institute-main">
        <div className="about-institute-content-wrapper">
          
          {/* Welcome Section */}
          <div className="about-institute-welcome-card">
            <div className="about-institute-welcome-content">
              <h2 className="about-institute-welcome-title">Welcome to Discuss Coaching</h2>
              <p className="about-institute-welcome-text">
                Welcome to Discuss Coaching, where education meets inspiration! At Discuss Coaching, we believe in nurturing minds, fostering creativity, and empowering individuals to reach their full potential. Established with a vision to provide quality education in a dynamic and inclusive environment, we are dedicated to shaping the leaders and innovators of tomorrow.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="about-institute-mission">
            <div className="about-institute-mission-icon">
              <Target className="about-institute-mission-icon-size" />
            </div>
            <h3 className="about-institute-mission-title">Our Mission</h3>
            <p className="about-institute-mission-text">
              Our mission is to cultivate a passion for learning, instill critical thinking skills, and promote a sense of social responsibility. We strive to create a vibrant community where students are not just learners but active contributors to a global society.
            </p>
          </div>

          {/* What Sets Us Apart Section */}
          <div className="about-institute-features">
            <h3 className="about-institute-features-title">What Sets Us Apart</h3>
            <div className="about-institute-features-grid">
              
              <div className="about-institute-feature-card">
                <div className="about-institute-feature-icon about-institute-icon-orange">
                  <Users className="about-institute-feature-icon-size" />
                </div>
                <h4 className="about-institute-feature-title">Experienced Faculty</h4>
                <p className="about-institute-feature-text">
                  Our team of experienced and passionate educators is committed to providing a transformative learning experience. With a focus on both academic excellence and practical skills, our faculty members are dedicated to shaping well-rounded individuals.
                </p>
              </div>

              <div className="about-institute-feature-card">
                <div className="about-institute-feature-icon about-institute-icon-blue">
                  <BookOpen className="about-institute-feature-icon-size" />
                </div>
                <h4 className="about-institute-feature-title">State-of-the-Art Facilities</h4>
                <p className="about-institute-feature-text">
                  Discuss Coaching is equipped with modern facilities to enhance the learning environment. From well-equipped classrooms to advanced laboratories, we provide the resources needed for a comprehensive education.
                </p>
              </div>

              <div className="about-institute-feature-card">
                <div className="about-institute-feature-icon about-institute-icon-purple">
                  <Star className="about-institute-feature-icon-size" />
                </div>
                <h4 className="about-institute-feature-title">Innovative Programs</h4>
                <p className="about-institute-feature-text">
                  Our curriculum is designed to meet the evolving needs of the 21st century. We offer innovative programs that blend academic knowledge with real-world applications, preparing students for success in a rapidly changing world.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="about-institute-values">
            <h3 className="about-institute-values-title">Our Values</h3>
            <div className="about-institute-values-grid">
              
              <div className="about-institute-value-card">
                <div className="about-institute-value-header">
                  <Award className="about-institute-value-icon" />
                  <h4 className="about-institute-value-name">Excellence</h4>
                </div>
                <p className="about-institute-value-description">
                  We strive for excellence in everything we do, from curriculum development to student support services.
                </p>
              </div>

              <div className="about-institute-value-card">
                <div className="about-institute-value-header">
                  <Heart className="about-institute-value-icon about-institute-value-icon-red" />
                  <h4 className="about-institute-value-name">Inclusivity</h4>
                </div>
                <p className="about-institute-value-description">
                  Discuss Coaching is a place where diversity is celebrated, and inclusivity is embraced. We believe in creating an environment where every student feels valued and respected.
                </p>
              </div>

              <div className="about-institute-value-card">
                <div className="about-institute-value-header">
                  <Globe className="about-institute-value-icon about-institute-value-icon-green" />
                  <h4 className="about-institute-value-name">Community Engagement</h4>
                </div>
                <p className="about-institute-value-description">
                  Beyond the classroom, we actively engage with the community to create meaningful connections and contribute to the greater good.
                </p>
              </div>
            </div>
          </div>

          {/* Join Us Section */}
          <div className="about-institute-join">
            <div className="about-institute-join-content">
              <CheckCircle className="about-institute-join-icon" />
              <h3 className="about-institute-join-title">Join Us on the Journey</h3>
              <p className="about-institute-join-text">
                Whether you are a prospective student, parent, or community member, we invite you to join us on this exciting journey of learning and growth. At Discuss Coaching, we are not just shaping minds; we are shaping the future.
              </p>
            </div>
          </div>

          {/* Closing Message */}
          <div className="about-institute-closing">
            <div className="about-institute-closing-content">
              <h3 className="about-institute-closing-title">Thank You</h3>
              <p className="about-institute-closing-text">
                <span className="about-institute-closing-bold">Thank you for being a part of our educational community!</span>
              </p>
              <div className="about-institute-closing-signature">
                <p className="about-institute-closing-name">Discuss Coaching Team</p>
                <p className="about-institute-closing-tagline">Shaping Minds, Shaping Future</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutInstitute;