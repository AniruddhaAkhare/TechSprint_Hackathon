import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-indigo-50 to-blue-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Transform Your Learning Experience
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Shiksha Saarthi provides innovative educational solutions to help students and teachers achieve their full potential.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition font-medium" 
          // onClick={()=>{navigate('/register')}}
          >
            Start 7-Day Free Trial
          </button>
          <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-md hover:bg-indigo-50 transition font-medium">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;