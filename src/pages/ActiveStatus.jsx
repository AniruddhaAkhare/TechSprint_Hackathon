import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const ActiveStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const usersQuery = query(
          collection(db, 'Users'),
          where('active', '==', true)
        );
        const querySnapshot = await getDocs(usersQuery);
        const users = querySnapshot.docs.map((doc) => doc.data());

        const currentTime = new Date();
        const fifteenMinutesAgo = new Date(currentTime.getTime() - 15 * 60 * 1000);
        const filteredUsers = users.filter(
          (user) =>
            (user.lastLogin && new Date(user.lastLogin) > fifteenMinutesAgo) ||
            (user.lastCheckIn && new Date(user.lastCheckIn) > fifteenMinutesAgo)
        );

        setActiveUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-5 bg-white p-4 rounded-2xl shadow-lg w-80 z-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Users</h3>
          {activeUsers.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {activeUsers.map((user, index) => (
                <li key={index} className="text-gray-700">
                  <span className="font-medium">{user.displayName}</span> ({user.branchName})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No active users at the moment.</p>
          )}
        </div>
      )}
      <button
        onClick={toggleChat}
        className={`fixed bottom-5 right-5 p-4 rounded-full shadow-lg z-50 transition-colors ${
          activeUsers.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
        } text-white`}
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
};

export default ActiveStatus;