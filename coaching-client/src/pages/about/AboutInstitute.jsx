import React from 'react';
import { Award, BookOpen, Users, Target, Heart, Globe, Star, CheckCircle } from 'lucide-react';

const AboutInstitute = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 ">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4 animate-pulse">
              About Our Institute
            </h1>
            <p className="text-2xl mb-8 opacity-90">
              Where Education Meets Inspiration
            </p>
            <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-[#eda835]/10 overflow-hidden mb-16 border-t-4 border-[#eda835]">
          <div className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#eda835] to-[#4f46e5] bg-clip-text text-transparent">
              Welcome to Discuss Coaching
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to Discuss Coaching, where education meets inspiration! At Discuss Coaching, we believe in nurturing minds, fostering creativity, and empowering individuals to reach their full potential. Established with a vision to provide quality education in a dynamic and inclusive environment, we are dedicated to shaping the leaders and innovators of tomorrow.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-[#eda835] to-[#e09e2f] text-white rounded-3xl p-12 mb-16 text-center relative overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-white/10 to-transparent pointer-events-none"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              Our mission is to cultivate a passion for learning, instill critical thinking skills, and promote a sense of social responsibility. We strive to create a vibrant community where students are not just learners but active contributors to a global society.
            </p>
          </div>
        </div>

        {/* What Sets Us Apart Section */}
        <div className="mb-16">
          <h3 className="text-4xl font-bold text-gray-800 text-center mb-12 relative">
            What Sets Us Apart
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#eda835] rounded-full"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#eda835]/15">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#eda835] text-white rounded-full mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Experienced Faculty</h4>
              <p className="text-gray-600 leading-relaxed">
                Our team of experienced and passionate educators is committed to providing a transformative learning experience. With a focus on both academic excellence and practical skills, our faculty members are dedicated to shaping well-rounded individuals.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#4f46e5]/15">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4f46e5] text-white rounded-full mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">State-of-the-Art Facilities</h4>
              <p className="text-gray-600 leading-relaxed">
                Discuss Coaching is equipped with modern facilities to enhance the learning environment. From well-equipped classrooms to advanced laboratories, we provide the resources needed for a comprehensive education.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/15">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full mb-6">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Innovative Programs</h4>
              <p className="text-gray-600 leading-relaxed">
                Our curriculum is designed to meet the evolving needs of the 21st century. We offer innovative programs that blend academic knowledge with real-world applications, preparing students for success in a rapidly changing world.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h3 className="text-4xl font-bold text-gray-800 text-center mb-12 relative">
            Our Values
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#4f46e5] rounded-full"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-2xl p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 border-l-4 border-[#eda835]">
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-[#eda835] mr-3" />
                <h4 className="text-xl font-bold text-gray-800">Excellence</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in everything we do, from curriculum development to student support services.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <Heart className="w-6 h-6 text-red-500 mr-3" />
                <h4 className="text-xl font-bold text-gray-800">Inclusivity</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Discuss Coaching is a place where diversity is celebrated, and inclusivity is embraced. We believe in creating an environment where every student feels valued and respected.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-green-500 mr-3" />
                <h4 className="text-xl font-bold text-gray-800">Community Engagement</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Beyond the classroom, we actively engage with the community to create meaningful connections and contribute to the greater good.
              </p>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12 mb-16 text-center border-2 border-[#eda835]">
          <div className="max-w-4xl mx-auto">
            <CheckCircle className="w-12 h-12 text-[#eda835] mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Join Us on the Journey</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you are a prospective student, parent, or community member, we invite you to join us on this exciting journey of learning and growth. At Discuss Coaching, we are not just shaping minds; we are shaping the future.
            </p>
          </div>
        </div>

        {/* Closing Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-12 text-center bg-gradient-to-r from-yellow-50 to-yellow-100">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Thank You</h3>
            <p className="text-lg text-gray-600 mb-8">
              <span className="font-semibold text-[#eda835]">Thank you for being a part of our educational community!</span>
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold text-[#eda835]">Discuss Coaching Team</p>
              <p className="text-gray-500 font-medium italic">Shaping Minds, Shaping Future</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutInstitute;