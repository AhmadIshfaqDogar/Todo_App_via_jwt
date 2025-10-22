// src/components/Background.js
import React from 'react';
import bgimg1 from '../assets/images/5252473-removebg-preview.png';
import bgimg2 from '../assets/images/bgimg2.png';

const Background = ({
  topRightImage = bgimg1,
  bottomLeftImage = bgimg2,
  gradient = 'bg-gradient-to-br from-indigo-100 via-blue-100 to-sky-200'
}) => {
  return (
    <div className="fixed  inset-0 overflow-hidden">
      {/* Gradient */}
      <div className={`absolute inset-0 ${gradient}`}></div>

      {/* Top Right Image */}
      <div
        className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] bg-cover bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${topRightImage})` }}
      ></div>

      {/* Bottom Left Image */}
      <div
        className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] bg-cover bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${bottomLeftImage})` }}
      ></div>
    </div>
  );
};

export default Background;
