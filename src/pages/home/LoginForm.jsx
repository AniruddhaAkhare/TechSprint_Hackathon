// Login.jsx or Login.js

import React, { useState } from 'react';
import { Mail, ArrowRight, Building2, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from "../../config/firebase"; // Make sure this path is correct
import logo from "/img/fireblaze.jpg"


export default function Login() {
    const [formData, setFormData] = useState({ email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState("input");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            alert("Please enter your email");
            return;
        }

        try {
            setIsLoading(true);

            const email = formData.email.trim().toLowerCase();
            const actionCodeSettings = {
                url: `${window.location.origin}/login`,
                handleCodeInApp: true,
            };

            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            setStep("email-sent");

        } catch (error) {
            console.error("Error sending email link:", error.message);
            alert(error.message || "Failed to send sign-in link.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailLinkSignIn = async () => {
        if (!isSignInWithEmailLink(auth, window.location.href)) return;

        try {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt("Please provide your email for confirmation");
            }

            if (!email) {
                alert("Email not provided. Please try again.");
                return;
            }

            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            navigate("/dashboard");
        } catch (error) {
            console.error("Email link sign-in error:", error.message);
            alert("Invalid or expired sign-in link.");
            setStep("input");
        }
    };

    const resetForm = () => {
        setStep("input");
        setFormData({ email: "" });
    };

    // Auto-sign in if coming from email link
    React.useEffect(() => {
        handleEmailLinkSignIn();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Branding */}
                    <div className="hidden lg:block">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-red-600 rounded-xl flex items-center justify-center">
                                        <img src={logo} alt="" className='rounded-md' />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900">FireBlaze</h1>
                                </div>
                                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                                    Welcome to your<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">
                                        digital workspace
                                    </span>
                                </h2>
                                <p className="text-lg text-gray-600 max-w-md">
                                    Access your company resources, collaborate with your team, and stay productive from anywhere.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">Secure single sign-on</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <span className="text-gray-700">Enterprise-grade security</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="text-gray-700">Seamless team collaboration</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full max-w-md mx-auto lg:mx-0">
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-600 to-red-600 px-8 py-6">
                                <h2 className="text-2xl font-bold text-white text-center">Employee Portal</h2>
                                <p className="text-amber-100 text-center mt-1">
                                    {step === "input" && "Sign in to your account"}
                                    {step === "email-sent" && "Check your inbox"}
                                </p>
                            </div>
                            <div className="p-8">
                                {step === "input" && (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Work Email Address
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Your Company Mail"
                                                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                                    required
                                                />

                                            </div>
                                            <p className="text-xs text-gray-500">
                                                We'll send you a secure sign-in link
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-amber-700 hover:to-red-700 focus:ring-4 focus:ring-amber-200 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Sending Link...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Send Sign-in Link</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {step === "email-sent" && (
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                                            <Mail className="w-8 h-8 text-amber-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
                                            <p className="text-sm text-gray-600">
                                                We've sent a secure sign-in link to
                                            </p>
                                            <p className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg inline-block">
                                                {formData.email}
                                            </p>
                                        </div>
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                            <p className="text-xs text-amber-700">
                                                <strong>Note:</strong> The link will expire in 15 minutes for security purposes.
                                            </p>
                                        </div>
                                        <button
                                            onClick={resetForm}
                                            className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                                        >
                                            Use Different Email
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                🔒 This is a secure company portal. Your data is protected by enterprise-grade encryption.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}