// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-600 transition duration-300">
              Arch<span className="text-gray-800">Token</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/seller"
              className="text-gray-700 hover:text-blue-500 font-medium transition duration-300"
            >
              Seller
            </Link>
            <Link
              to="/buyer"
              className="text-gray-700 hover:text-blue-500 font-medium transition duration-300"
            >
              Buyer
            </Link>
            <Link
              to="/buyer"
              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="space-y-2 px-4 py-3">
            <Link
              to="/seller"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-500 font-medium transition duration-300"
            >
              Seller
            </Link>
            <Link
              to="/buyer"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-500 font-medium transition duration-300"
            >
              Buyer
            </Link>
            <Link
              to="/buyer"
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300 text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
