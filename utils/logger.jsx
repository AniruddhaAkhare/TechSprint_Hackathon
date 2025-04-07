import { db } from './firebase'; // Your Firebase config file
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const logActivity = async (user, action, details) => {
  try {
    await addDoc(collection(db, 'activityLogs'), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      userEmail: user.email,
      action,
      details
    });
    console.log('Activity logged successfully');
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};