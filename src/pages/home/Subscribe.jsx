// Subscribe.js
import React from 'react';
import { Link } from 'react-router-dom';

const Subscribe = () => {
  return (
    <div className="subscribe-container p-20">
      <h1>Subscribe to Continue</h1>
      <p>Your 7-day free trial has expired. Please choose a plan to continue using the application.</p>
      <div className="plans">
        <div className="plan">
          <h2>Basic Plan</h2>
          <p>$10/month</p>
          <button>Choose Plan</button>
        </div>
        <div className="plan">
          <h2>Pro Plan</h2>
          <p>$20/month</p>
          <button>Choose Plan</button>
        </div>
      </div>
      <Link to="/login">Back to Login</Link>
    </div>
  );
};

export default Subscribe;