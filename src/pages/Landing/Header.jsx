import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Shiksha Saarthi</h1>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
          <a href="#why" className="text-gray-600 hover:text-indigo-600">Why Us</a>
          <a href="#about" className="text-gray-600 hover:text-indigo-600">About Us</a>
          <a href="#contact" className="text-gray-600 hover:text-indigo-600">Contact</a>
        </nav>
        <div className='gap-4'>
        <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50" onClick={()=>{navigate('/employee-registration')}}>
          Register as Employee
        </button>
        <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50" 
        onClick={()=>{navigate('/login')}}
        >
          Login
        </button>
        </div>
      </div>
    </header>
  );
};

export default Header;