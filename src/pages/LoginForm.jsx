import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../config/firebase'; // Correct import for auth

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Signed in successfully');
            window.location.href = "/";
        } catch (err) {
            alert("Admin not registered");
            console.log("Admin not registered", err);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center min-h-screen bg-gray-100 w-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Login
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
                </p>
            </form>
        </div>
    );
}
