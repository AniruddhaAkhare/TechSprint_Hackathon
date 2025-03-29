import React from 'react';

const ContactUs = () => {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-indigo-600 text-white p-8">
              <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
              <p className="mb-6">Have questions or feedback? We'd love to hear from you!</p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="mr-3">📍</span>
                  <span>123 Education Street, Learning City, 560001</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-3">📞</span>
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-3">✉️</span>
                  <span>contact@sikshasarthi.com</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your Name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;