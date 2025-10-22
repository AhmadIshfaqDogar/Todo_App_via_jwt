// src/components/Loader.js
import React from 'react';

const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center relative z-10">
      {/* Loader Content */}
      <div className="relative text-center px-4">
        {/* Spinner */}
        <div className="relative mb-8 mx-auto w-16 h-16 md:w-32 md:h-32">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-indigo-400 border-b-transparent rounded-full animate-spin reverse-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-blue-600 rounded-full animate-pulse"></div>
        </div>

        <h1 className="text-4xl md:text-7xl font-bold mb-4 text-indigo-700">TaskFlow</h1>
        <p className="text-xl md:text-3xl text-gray-600">Organize Your World</p>
      </div>
    </div>
  );
};

export default Loader;
