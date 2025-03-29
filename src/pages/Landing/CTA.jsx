import React from 'react';
import { useNavigate} from 'react-router-dom';

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-indigo-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Learning?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied learners and start your 7-day free trial today!
        </p>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-md hover:bg-gray-100 transition font-medium" onClick={()=>{navigate('/register')}}>
          Start Free Trial - No Credit Card Required
        </button>
      </div>
    </section>
  );
};

export default CTA;