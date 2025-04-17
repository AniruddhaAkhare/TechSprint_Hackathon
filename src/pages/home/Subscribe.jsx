import React from 'react';
import { Link } from 'react-router-dom';

const Subscribe = () => {
  return (
    <div className="subscribe-container min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-20">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Subscribe to Continue</h1>
        <p className="text-gray-600 mb-8 text-center">
          Your 7-day free trial has expired. Please choose a plan to continue using the application.
        </p>

        <div className="plans flex flex-col md:flex-row gap-6 justify-center">
          <div className="plan flex-1 bg-gray-50 rounded-md p-6 border border-gray-200 hover:border-blue-500 transition duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">Basic Plan</h2>
            <p className="text-2xl font-bold text-gray-800 mb-4 text-center">$10/month</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              Choose Plan
            </button>
          </div>
          <div className="plan flex-1 bg-gray-50 rounded-md p-6 border border-gray-200 hover:border-blue-500 transition duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">Pro Plan</h2>
            <p className="text-2xl font-bold text-gray-800 mb-4 text-center">$20/month</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              Choose Plan
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 underline transition duration-300"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;