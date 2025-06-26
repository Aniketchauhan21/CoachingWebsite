// import React from 'react';
// import { MapPin, Mail, Phone, Award, BookOpen, Users } from 'lucide-react';
// import '../../styles/directors-desk.css'; // Adjust the path as necessary
// import directorImage from '../../assets/images/directorimg.png'; // Make sure the path is correct


// const DirectorsDesk = () => {
//   return (
//     <div className="directors-desk-container">
//       {/* Hero Section */}
//       <div className="directors-desk-hero">
//         <div className="directors-desk-hero-overlay"></div>
//         <div className="directors-desk-hero-content">
//           <div className="directors-desk-hero-text">
//             <h1 className="directors-desk-hero-title">
//               From Director's Desk
//             </h1>
//             <div className="directors-desk-hero-line"></div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="directors-desk-main">
//         <div className="directors-desk-content-wrapper">
//           {/* Director Info Card */}
//           <div className="directors-desk-card-main">
//             <div className="directors-desk-card-grid">
//               {/* Image Section */}
//               <div className="directors-desk-image-section">
//                 <div className="directors-desk-image-content">
//                   {/* Placeholder for Director's Image */}
//                   <div className="directors-desk-image-placeholder">
//                     <div className="directors-desk-image-text">
//                               <img src={directorImage} alt="Director" className="director-photo" />

//                     </div>
//                   </div>
//                   <h2 className="directors-desk-name">Hement Kashyap</h2>
//                   <p className="directors-desk-title">Director - Discuss Coaching</p>
//                   <div className="directors-desk-icons">
//                     <div className="directors-desk-icon-blue">
//                       <Award className="directors-desk-icon-size" />
//                     </div>
//                     <div className="directors-desk-icon-purple">
//                       <BookOpen className="directors-desk-icon-size" />
//                     </div>
//                     <div className="directors-desk-icon-indigo">
//                       <Users className="directors-desk-icon-size" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Content Section */}
//               <div className="directors-desk-text-section">
//                 <div className="directors-desk-text-content">
//                   <p className="directors-desk-welcome">
//                     Welcome to the world of English language and literature!
//                   </p>
                  
//                   <p className="directors-desk-intro">
//                     I'm <span className="directors-desk-highlight">Hement Kashyap</span>, and I am thrilled to be your guru on this linguistic journey. Teaching is not just my profession; it's my passion. With a heart full of enthusiasm for the English language and its intricacies, I embark on a mission to make learning English an inspiring and enjoyable experience for my students.
//                   </p>

//                   <div className="directors-desk-experience-box">
//                     <p className="directors-desk-experience-title">Experience & Expertise</p>
//                     <p className="directors-desk-experience-text">
//                       With <span className="directors-desk-experience-years">10+ years of experience</span> in the field of education, I have had the privilege of guiding students through the realms of literature, language, and communication.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Philosophy Section */}
//           <div className="directors-desk-philosophy-grid">
//             <div className="directors-desk-philosophy-card">
//               <h3 className="directors-desk-philosophy-title">
//                 <BookOpen className="directors-desk-philosophy-icon" />
//                 Teaching Philosophy
//               </h3>
//               <p className="directors-desk-philosophy-text">
//                 I am not just a teacher; I'm a facilitator of growth. My teaching philosophy is rooted in creativity, adaptability, and a belief that every student has a unique way of learning. From interactive lessons to incorporating technology, I strive to create an engaging and dynamic learning environment.
//               </p>
//             </div>

//             <div className="directors-desk-philosophy-card">
//               <h3 className="directors-desk-philosophy-title">
//                 <Users className="directors-desk-philosophy-icon directors-desk-philosophy-icon-purple" />
//                 Beyond Teaching
//               </h3>
//               <p className="directors-desk-philosophy-text">
//                 When I'm not immersed in the world of literature and language, you can find me learning extra skills. I believe in the importance of connecting with students not only as a teacher but as someone who understands and appreciates the multifaceted nature of life.
//               </p>
//             </div>
//           </div>

//           {/* Mission Statement */}
//           <div className="directors-desk-mission">
//             <h3 className="directors-desk-mission-title">Our Mission</h3>
//             <p className="directors-desk-mission-text">
//               Whether you're a student, parent, or fellow enthusiast of the English language, I invite you to join me on this exciting adventure of learning and discovery. Together, let's explore the beauty of words, the power of storytelling, and the endless possibilities that language brings.
//             </p>
//           </div>

//           {/* Closing Message */}
//           <div className="directors-desk-closing">
//             <p className="directors-desk-closing-thanks">
//               <span className="directors-desk-closing-bold">Thank you for being a part of this educational journey with me.</span>
//             </p>
//             <div className="directors-desk-closing-signature">
//               <p className="directors-desk-closing-wishes">Best wishes,</p>
//               <p className="directors-desk-closing-name">Hement Kashyap</p>
//               <p className="directors-desk-closing-position">Director - Discuss Coaching</p>
//             </div>
//           </div>

//           {/* Location Section */}
//           <div className="directors-desk-location">
//             <div className="directors-desk-location-header">
//               <h3 className="directors-desk-location-title">
//                 <MapPin className="directors-desk-location-icon" />
//                 Visit Our Coaching Center
//               </h3>
//               <p className="directors-desk-location-subtitle">
//                 Come and experience our world-class English coaching facilities
//               </p>
//             </div>
            
//             {/* Google Map */}
//             <div className="directors-desk-map">
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.477174847806!2d77.02624887456604!3d28.46517289166281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19e6e63022b9%3A0xf1693d23db3781bf!2sDISCUSS%20COACHING!5e0!3m2!1sen!2sin!4v1749637433902!5m2!1sen!2sin"
//                 width="100%"
//                 height="100%"
//                 style={{ border: 0 }}
//                 allowFullScreen=""
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//                 className="directors-desk-iframe"
//                 title="Coaching Center Location"
//               ></iframe>
//             </div>
            
//             {/* Contact Info */}
//             <div className="directors-desk-contact">
//               <div className="directors-desk-contact-grid">
//                 <div className="directors-desk-contact-item">
//                   <Phone className="directors-desk-contact-icon" />
//                   <span className="directors-desk-contact-text">+91 12345 67890</span>
//                 </div>
//                 <div className="directors-desk-contact-item">
//                   <Mail className="directors-desk-contact-icon directors-desk-contact-icon-purple" />
//                   <span className="directors-desk-contact-text">info@discusscoaching.com</span>
//                 </div>
//                 <div className="directors-desk-contact-item">
//                   <MapPin className="directors-desk-contact-icon directors-desk-contact-icon-red" />
//                   <span className="directors-desk-contact-text">FRONT ON S.S JEWELLERS, 396/12 NEW RAILWAY ROAD , MAIN BUS STAND, Gurugram, Haryana 122001</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DirectorsDesk;

import React from 'react';
import { MapPin, Mail, Phone, Award, BookOpen, Users } from 'lucide-react';

import directorImage from '../../assets/images/directorimg.png'; // Make sure the path is correct


const DirectorsDesk = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 animate-pulse">
              From Director's Desk
            </h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Director Info Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16 transition-all duration-300 hover:-translate-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Section */}
            <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-6">
                  <img 
                    src={directorImage} 
                    alt="Director Hement Kashyap" 
                    className="w-64 h-64 mx-auto rounded-full shadow-lg object-cover border-4 border-white"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Hement Kashyap</h2>
                <p className="text-lg text-[#4f46e5] font-semibold mb-4">Director - Discuss Coaching</p>
                
                <div className="flex justify-center gap-4">
                  <div className="bg-blue-500 text-white p-3 rounded-full transition-transform duration-300 hover:scale-110">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="bg-purple-500 text-white p-3 rounded-full transition-transform duration-300 hover:scale-110">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="bg-[#4f46e5] text-white p-3 rounded-full transition-transform duration-300 hover:scale-110">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg font-medium text-gray-800">
                  Welcome to the world of English language and literature!
                </p>
                
                <p>
                  I'm <span className="font-semibold text-[#4f46e5]">Hement Kashyap</span>, and I am thrilled to be your guru on this linguistic journey. Teaching is not just my profession; it's my passion. With a heart full of enthusiasm for the English language and its intricacies, I embark on a mission to make learning English an inspiring and enjoyable experience for my students.
                </p>

                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-800 mb-2">Experience & Expertise</p>
                  <p className="text-gray-600">
                    With <span className="font-semibold text-[#eda835]">10+ years of experience</span> in the field of education, I have had the privilege of guiding students through the realms of literature, language, and communication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 text-[#eda835] mr-3" />
              Teaching Philosophy
            </h3>
            <p className="text-gray-600 leading-relaxed">
              I am not just a teacher; I'm a facilitator of growth. My teaching philosophy is rooted in creativity, adaptability, and a belief that every student has a unique way of learning. From interactive lessons to incorporating technology, I strive to create an engaging and dynamic learning environment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Users className="w-6 h-6 text-[#4f46e5] mr-3" />
              Beyond Teaching
            </h3>
            <p className="text-gray-600 leading-relaxed">
              When I'm not immersed in the world of literature and language, you can find me learning extra skills. I believe in the importance of connecting with students not only as a teacher but as someone who understands and appreciates the multifaceted nature of life.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-[#eda835] to-[#e09e2f] text-white rounded-3xl p-12 mb-16 text-center">
          <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            Whether you're a student, parent, or fellow enthusiast of the English language, I invite you to join me on this exciting adventure of learning and discovery. Together, let's explore the beauty of words, the power of storytelling, and the endless possibilities that language brings.
          </p>
        </div>

        {/* Closing Message */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center mb-16">
          <p className="text-lg text-gray-600 mb-6">
            <span className="font-semibold text-[#eda835]">Thank you for being a part of this educational journey with me.</span>
          </p>
          <div className="space-y-2">
            <p className="text-gray-500">Best wishes,</p>
            <p className="text-2xl font-bold text-[#4f46e5]">Hement Kashyap</p>
            <p className="text-gray-500 font-medium">Director - Discuss Coaching</p>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 text-center border-b border-gray-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-red-500 mr-3" />
              Visit Our Coaching Center
            </h3>
            <p className="text-gray-500 text-lg">
              Come and experience our world-class English coaching facilities
            </p>
          </div>
          
          {/* Google Map */}
          <div className="h-96 bg-gray-200 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.477174847806!2d77.02624887456604!3d28.46517289166281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19e6e63022b9%3A0xf1693d23db3781bf!2sDISCUSS%20COACHING!5e0!3m2!1sen!2sin!4v1749637433902!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Coaching Center Location"
              className="w-full h-full"
            />
          </div>
          
          {/* Contact Info */}
          <div className="p-8 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <Phone className="w-5 h-5 text-[#eda835] flex-shrink-0" />
                <span className="text-gray-600">+91 12345 67890</span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <Mail className="w-5 h-5 text-[#4f46e5] flex-shrink-0" />
                <span className="text-gray-600">info@discusscoaching.com</span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  FRONT ON S.S JEWELLERS, 396/12 NEW RAILWAY ROAD, MAIN BUS STAND, Gurugram, Haryana 122001
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DirectorsDesk;