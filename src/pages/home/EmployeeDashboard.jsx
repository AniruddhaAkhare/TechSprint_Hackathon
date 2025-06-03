import React, { useState, useEffect } from 'react';
import { getDoc, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LeaveApplicationForm from './LeaveApplicationForm';
import { db } from '../../config/firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState('PROFILE');
    const [expanded, setExpanded] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [leaveApprovals, setLeaveApprovals] = useState([]);
    const [approvalsLoading, setApprovalsLoading] = useState(false);

    const handleTabClick = async (tab) => {
        setActiveTab(tab);
        if (tab === 'APPROVALS') {
            await fetchLeaveApprovals();
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserEmail(user.email);
                setUserId(user.uid);
                console.log("Authenticated user:", { uid: user.uid, email: user.email }); // Debug log
                try {
                    const userDocRef = doc(db, 'Users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                        console.log("User data:", userDoc.data()); // Debug log
                    } else {
                        await setDoc(userDocRef, { email: user.email });
                        setUserData({ email: user.email });
                    }
                } catch (err) {
                    setError('Failed to fetch user data: ' + err.message);
                    console.error("User data fetch error:", err); // Debug log
                } finally {
                    setLoading(false);
                }
            } else {
                setError('No user is signed in');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchLeaveApprovals = async () => {
        setApprovalsLoading(true);
        try {
            console.log("Fetching leaves for userId:", userId, "email:", userEmail); // Debug log
            const leavesCollection = collection(db, 'Leaves'); // Corrected collection name
            const q = query(
                leavesCollection,
                where('userId', '==', userId),
                where('status', 'in', ['Approved', 'Rejected'])
            );
            
            const querySnapshot = await getDocs(q);
            
            console.log(`Found ${querySnapshot.size} leaves`); // Debug log
            querySnapshot.forEach((doc) => {
                console.log("Leave document:", doc.id, doc.data()); // Detailed debug log
            });
            
            const approvals = [];
            querySnapshot.forEach((doc) => {
                approvals.push({ id: doc.id, ...doc.data() });
            });
            
            // Sort by createdAt (newest first)
            approvals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLeaveApprovals(approvals);
        } catch (err) {
            console.error("Error fetching leaves:", err); // Debug log
            setError('Failed to fetch leave approvals: ' + err.message);
        } finally {
            setApprovalsLoading(false);
        }
    };

    const userDomain = userData?.domain || 'Domain not available';

    const tabs = [
        { id: 'ACTIVITIES', label: 'Activities' },
        { id: 'FEEDS', label: 'Feeds' },
        { id: 'PROFILE', label: 'Profile' },
        { id: 'APPROVALS', label: 'Approvals' },
        { id: 'LEAVE', label: 'Leave' },
        { id: 'ATTEND', label: 'Attendance' },
    ];

    const profileItems = [
        {
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            ),
            text: 'FIREBLAZE - MATE SQUARE, NA...',
        },
        {
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a2 2 0 00-2-2h-1m-2 0H7a2 2 0 00-2 2v2h5m-3-8a4 4 0 014-4h2a4 4 0 014 4m-8 0V9a4 4 0 014-4h2a4 4 0 014 4v3" />
            ),
            text: userDomain,
        },
        {
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
            text: 'GENERAL AT 10',
        },
        {
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
            text: 'TIME ZONE (GMT+05:30)',
        },
        {
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2h2m8 0v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m8 0H8" />
            ),
            text: userEmail || 'Email not available',
        },
        {
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5h18M3 5v14h18V5M3 5l9 9 9-9"
                />
            ),
            text: userData?.phone || 'Phone number not available',
        },
        {
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-6 0H9a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
            ),
            text: userData?.emergency_details?.phone
                ? `Emergency: ${userData.emergency_details.phone}`
                : 'Emergency Contact: N/A',
        },
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="text-center p-4">Loading user data...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="border-b border-gray-200 relative bg-white">
                <div className="flex overflow-x-auto scrollbar-hide px-2">
                    <div className="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`px-3 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap relative ${
                                    activeTab === tab.id
                                        ? 'text-indigo-600'
                                        : 'text-gray-500 hover:text-indigo-500'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-1"
                    onClick={() => setExpanded(!expanded)}
                    aria-label={expanded ? "Collapse dashboard" : "Expand dashboard"}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={expanded ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'}
                        />
                    </svg>
                </button>
            </div>

            <div className="p-4 overflow-auto">
                <div className="transition-all duration-300 ease-in-out">
                    {activeTab === 'PROFILE' && (
                        <div className="animate-fadeIn space-y-3">
                            {profileItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                                >
                                    <svg
                                        className="w-5 h-5 text-indigo-500 mr-3 group-hover:text-indigo-600 transition-colors duration-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {item.icon}
                                    </svg>
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'LEAVE' && (
                        <div className="animate-fadeIn">
                            <LeaveApplicationForm />
                        </div>
                    )}

                    {activeTab === 'ATTEND' && (
                        <div className="animate-fadeIn space-y-4">
                            <h2 className="text-lg font-semibold text-gray-700">Select Attendance Date</h2>
                            <Calendar
                                onChange={setSelectedDate}
                                value={selectedDate}
                                className="rounded-lg shadow mx-auto"
                            />
                            <p className="text-sm text-gray-600 text-center">Selected Date: {selectedDate.toDateString()}</p>
                        </div>
                    )}

                    {activeTab === 'APPROVALS' && (
                        <div className="animate-fadeIn">
                            <div className="bg-white rounded-lg shadow p-4 mb-4">
                                <h2 className="text-xl font-semibold mb-2">Leave Requests</h2>
                                <p className="text-gray-600 text-sm">View all approved and rejected leave applications</p>
                            </div>
                            
                            {approvalsLoading ? (
                                <div className="text-center p-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                                    <p className="mt-2 text-gray-600">Loading leaves...</p>
                                </div>
                            ) : leaveApprovals.length === 0 ? (
                                <div className="text-center p-8 bg-white rounded-lg shadow">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No leave requests</h3>
                                    <p className="mt-1 text-sm text-gray-500">There are currently no approved or rejected leave requests.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {leaveApprovals.map((approval) => (
                                        <div key={approval.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="font-medium text-gray-500 text-sm">Employee Email:</p>
                                                    <p className="text-gray-900">{approval.email}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-500 text-sm">Leave Type:</p>
                                                    <p className="text-gray-900">{approval.leaveType}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-500 text-sm">Start Date:</p>
                                                    <p className="text-gray-900">{formatDate(approval.startDate)}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-500 text-sm">End Date:</p>
                                                    <p className="text-gray-900">{formatDate(approval.endDate)}</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <p className="font-medium text-gray-500 text-sm">Reason:</p>
                                                    <p className="text-gray-900">{approval.reason || 'No reason provided'}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-500 text-sm">Status:</p>
                                                    <p className={`font-semibold ${approval.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {approval.status}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-500 text-sm">Submitted On:</p>
                                                    <p className="text-gray-900">{formatDate(approval.createdAt)}</p>
                                                </div>
                                                {approval.attachmentUrl && (
                                                    <div className="md:col-span-2">
                                                        <p className="font-medium text-gray-500 text-sm">Attachment:</p>
                                                        <div className="mt-1">
                                                            <a 
                                                                href={approval.attachmentUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                                                            >
                                                                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 0 108.486 8.486L20.5 13" />
                                                                </svg>
                                                                View Attachment
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;