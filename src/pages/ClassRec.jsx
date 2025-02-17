import React from 'react';
import SorryImage from '../assets/Sorry.webp';

export default function ClassRec() {
    return (
        <div className='flex-col w-screen ml-80 pd-4'>
            <main>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Live Class Recordings</h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm">
                            <div className="text-gray-500">Live Class Storage</div>
                            <div className="text-gray-700">0GB OF 50B consumed</div>
                            <a href="#" className="text-blue-500">UPGRADE STORAGE {'>'}</a>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div className="text-blue-500">Active Batches {'>'}</div>
                    <div className="flex items-center space-x-4">
                        <input type="text" placeholder="Search recordings" className="border border-gray-300 rounded-md p-2" />
                        <button className="border border-gray-300 rounded-md p-2">Filters</button>
                        <button className="border border-gray-300 rounded-md p-2">Actions</button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center h-50 w-50">
                    <div className="one">
                        <img src={SorryImage} alt="No recordings illustration" className="mb-4 sorry-img" />
                    </div>
                    <div className="two">
                        <div className="text-xl font-semibold mb-2">No Recordings Found</div>
                        <div className="text-gray-500">Once class recordings are completed, you can view them here</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
