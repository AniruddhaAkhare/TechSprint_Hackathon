import React from 'react';

const WhyChooseUs = () => {
  const reasons = [
    'Personalized learning experience',
    'Affordable pricing plans',
    'Interactive learning materials',
    '24/7 support available',
    'Regular content updates',
    'Certification upon completion'
  ];

  return (
    <section id="why" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Siksha Sarthi?</h2>
            <p className="text-gray-600 mb-6">
              We're committed to providing quality education through innovative technology and proven teaching methodologies.
            </p>
            <ul className="space-y-3">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2 bg-white p-8 rounded-lg shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Students learning" 
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;