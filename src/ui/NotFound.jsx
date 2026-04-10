import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react'; // npm install lucide-react

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Illustration Circle */}
        <div className="mb-8 flex justify-center">
          <div className="w-48 h-48 rounded-full border-8 border-[#006666] flex items-center justify-center">
            <span className="text-6xl font-bold text-[#006666]">404</span>
          </div>
        </div>
        
        {/* Message */}
        <h1 className="text-4xl font-bold text-[#006666] mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          The page you are looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>
        
        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 bg-[#006666] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004d4d] transition-colors duration-300"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-block border-2 border-[#006666] text-[#006666] px-6 py-3 rounded-lg font-medium  hover:text-white transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;