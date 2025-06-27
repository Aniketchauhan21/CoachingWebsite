// src/components/Layout.jsx
import React, { useEffect } from "react";
import FloatingElements from "./FloatingElements";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/comman/Navbar";
import Footer from "../components/comman/Footer";

const Layout = ({ children }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="">
      <Navbar />
      {/* Main content ko top margin/padding dena hoga */}
      <main className="pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
      <FloatingElements />
    </div>
  );
};

export default Layout;
