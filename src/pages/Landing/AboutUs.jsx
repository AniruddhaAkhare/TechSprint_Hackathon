import React from 'react';

const AboutUs = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 mb-6">
            Siksha Sarthi was founded in 2020 with a mission to democratize education through technology. We believe that quality education should be accessible to everyone, regardless of their location or financial situation.
          </p>
          <p className="text-gray-600 mb-6">
            Our team consists of passionate educators, technologists, and designers working together to create engaging learning experiences. We combine the best of traditional pedagogy with modern technology to deliver effective educational solutions.
          </p>
          <p className="text-gray-600">
            With over 50,000 satisfied learners and partnerships with leading educational institutions, we're proud to be making a difference in the education sector.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;