import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDocs, collection, Timestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

export default function EmployeeRegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [domain, setDomain] = useState('');
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { currentUser, rolePermissions } = useAuth();

  // Permissions
  const canCreate = rolePermissions?.Users?.create || false;

  // Country codes
  const countryCodes = [
    { key: 'canada-+1', code: '+1', label: 'Canada (+1)' },
    { key: 'russia-+7', code: '+7', label: 'Russia (+7)' },
    { key: 'egypt-+20', code: '+20', label: 'Egypt (+20)' },
    { key: 'southafrica-+27', code: '+27', label: 'South Africa (+27)' },
    { key: 'greece-+30', code: '+30', label: 'Greece (+30)' },
    { key: 'netherlands-+31', code: '+31', label: 'Netherlands (+31)' },
    { key: 'belgium-+32', code: '+32', label: 'Belgium (+32)' },
    { key: 'india-+91', code: '+91', label: 'India (+91)' },
  ];

  const cleanPhoneNumber = (phone) => {
    return phone.replace(/^\+|\D+/g, '');
  };

  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill all required fields: Name, Email, Password, Role.');
      toast.error('Please fill all required fields.');
      return;
    }

    const cleanedPhone = cleanPhoneNumber(phone);
    if (cleanedPhone && !/^\d{10,15}$/.test(cleanedPhone)) {
      setError('Phone number must be 10-15 digits.');
      toast.error('Phone number must be 10-15 digits.');
      return;
    }

    try {
      // Create Firebase Authentication User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data
      const userData = {
        displayName: capitalizeFirstLetter(name),
        email,
        phone: cleanedPhone ? `${countryCode}${cleanedPhone}` : '',
        domain: domain || '',
        role,
        created_at: Timestamp.now(),
        lastLogin: Timestamp.now(),
        address: { street: '', area: '', city: '', state: '', zip: '', country: '' },
        emergency_details: { name: '', phone: '', email: '', relation: '', occupation: '' },
        date_of_birth: '',
        joining_date: null,
        exit_date: null,
        education_details: [],
        experience_details: [],
        staff: {
          aadharCard: [],
          panCard: [],
          addressProof: [],
          tenthMarksheet: [],
          twelfthMarksheet: [],
          graduationMarksheet: [],
          pgMarksheet: [],
          offerLetter1: [],
          offerLetter2: [],
          experienceLetter1: [],
          experienceLetter2: [],
          salaryProof: [],
          parentSpouseAadhar: [],
          passportPhoto: [],
        },
      };

      // Write to Firestore
      try {
        await setDoc(doc(db, 'Users', user.uid), userData);
        toast.success('Employee registered successfully!');
        navigate('/registration-welcome');
      } catch (firestoreError) {
        //console.error('Firestore write error:', firestoreError);
        throw new Error('Failed to save user data: ' + firestoreError.message);
      }
    } catch (error) {
      //console.error('Registration error:', error);
      setError('Failed to register: ' + error.message);
      toast.error('Failed to register: ' + error.message);
    }
  };

  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Employee Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-blue-600"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="flex mt-1">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countryCodes.map((country) => (
                  <option key={country.key} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
              <input
                id="phone"
                name="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
              Domain
            </label>
            <input
              id="domain"
              name="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your domain"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}