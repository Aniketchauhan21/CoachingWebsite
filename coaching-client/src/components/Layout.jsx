// src/components/Layout.jsx
import React, { useEffect } from "react";
import FloatingElements from "./FloatingElements";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS
import Navbar from "../components/comman/Navbar";
import Footer from "../components/comman/Footer";


const Layout = ({ children }) => {
  useEffect(() => {
    // Initialize AOS animations
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Trigger animation only once
      easing: "ease-in-out", // Animation easing
    });
  }, []);
  return (
    <div className="">
      <Navbar />
      <main className="">
        {children}
      </main>
      <Footer />
      <FloatingElements />
    </div>
  );
};

export default Layout;
