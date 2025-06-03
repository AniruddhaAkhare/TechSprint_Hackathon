import React from 'react';

export default function AfterEmployeeRegistration() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to ShikshaSaarathi</h1>
                <p className="text-lg text-gray-600 mb-2">You have successfully registered!</p>
                <p className="text-md text-gray-500">Please contact your admin to assign a role.</p>
            </div>
        </div>
    );
}