"use client";

import React from "react";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      {/* Center Navbar */}
      <div className="container mx-auto px-4">
        <Navbar />
      </div>
      {children}

      <div className="container mx-auto px-4">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
