import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-black/70 backdrop-blur-md text-white py-2">

      <div className="max-w-7xl mx-auto px-4 text-center">

        <p className="text-xs tracking-wide">
          © {new Date().getFullYear()} Saurabh Jaiswal
        </p>

      </div>

    </footer>
  );
};

export default Footer;