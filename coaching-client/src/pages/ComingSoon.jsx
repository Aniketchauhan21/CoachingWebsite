import React from 'react';

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-6">
          Coming Soon
        </h1>
        <p className="text-lg text-gray-600 mb-6">
        </p>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-[#473391] mx-auto"></div>
      </div>
    </div>
  );
};

export default ComingSoon;
