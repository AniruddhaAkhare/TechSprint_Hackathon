import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import WhyChooseUs from './WhyChooseUs';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import CTA from './CTA';
import Footer from './Footer';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <WhyChooseUs />
        <AboutUs />
        <ContactUs />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;