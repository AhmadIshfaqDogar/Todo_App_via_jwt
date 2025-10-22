import React, { useState } from 'react';
import illustration1 from '../assets/images/illustration1.png';
import illustration2 from '../assets/images/illustration2.png';
import illustration3 from '../assets/images/illustration3.png';
import illustration4 from '../assets/images/illustration4.png';

const Onboarding = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to TaskFlow",
      description: "The simplest way to organize your tasks and boost your productivity",
      illustration: illustration1,
    },
    {
      title: "Save Time. It is Worthy",
      description: "Accomplish more in less time with an effortless, guided workflow",
      illustration: illustration2,
    },
    {
      title: "Get Things Managed",
      description: "Simplify your workflow and handle every task with clarity and confidence",
      illustration: illustration3,
    },
    {
      title: "Ready to Start?",
      description: "Kickstart your productivity journey and make every moment count",
      illustration: illustration4,
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete(); // Navigate to login when on last slide
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center relative z-10">
      {/* Content */}
      <div className="text-center w-full max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Illustration */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="
            w-64 h-64
            sm:w-72 sm:h-72
            md:w-80 md:h-80
            lg:w-96 lg:h-96
            relative mx-auto
          ">
            <img 
              src={slides[currentSlide].illustration} 
              alt={slides[currentSlide].title}
              className="w-full h-full object-contain animate-float"
            />
          </div>
        </div>
        
        {/* Title and Description */}
        <div className="mb-8 sm:mb-12 md:mb-16 px-2">
          <h1 className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            lg:text-6xl
            font-bold 
            mb-4 sm:mb-6
            text-indigo-700
            drop-shadow-lg
          ">
            {slides[currentSlide].title}
          </h1>
          
          <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto">
            <p className="
              text-lg
              sm:text-xl
              md:text-2xl
              text-gray-600 
              leading-relaxed
              font-medium
              drop-shadow-sm
            ">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-3 sm:space-x-4 mb-12 sm:mb-16 md:mb-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
                w-4 h-4 sm:w-5 sm:h-5
                rounded-full transition-all duration-300 
                ${index === currentSlide 
                  ? 'bg-indigo-600 scale-125 shadow-2xl ring-2 ring-indigo-300' 
                  : 'bg-indigo-300 hover:bg-indigo-400 shadow-lg'
                }
              `}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="
          flex justify-center space-x-4 sm:space-x-6
          items-center 
          px-4
        ">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`
              w-32 h-12
              sm:w-36 sm:h-14
              flex items-center justify-center 
              rounded-xl
              font-semibold 
              text-base sm:text-lg
              transition-all duration-300 
              bg-white hover:bg-gray-50
              border border-indigo-200
              text-indigo-700
              shadow-lg hover:shadow-xl
              ${currentSlide === 0 ? 'invisible' : ''}
            `}
          >
            ← Previous
          </button>
          
          <button
            onClick={nextSlide}
            className="
              w-32 h-12
              sm:w-36 sm:h-14
              flex items-center justify-center 
              rounded-xl
              font-semibold 
              text-base sm:text-lg
              transition-all duration-300 
              bg-indigo-600 hover:bg-indigo-700
              text-white
              shadow-lg hover:shadow-xl
            "
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;