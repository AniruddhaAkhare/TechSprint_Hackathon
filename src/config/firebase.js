import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCr7lMF1rd-VeEArjy0dklqR08hzoqxFZI",
  authDomain: "fireblaze-ignite.firebaseapp.com",
  databaseURL: "https://fireblaze-ignite-default-rtdb.firebaseio.com",
  projectId: "fireblaze-ignite",
  storageBucket: "fireblaze-ignite.firebasestorage.app",
  messagingSenderId: "848780069457",
  appId: "1:848780069457:web:33eede2d3e487c45cf4670",
  measurementId: "G-14J96V5WD0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);



const analytics = getAnalytics(app);


const db = getFirestore(app);
// Initialize Storage
const storage = getStorage(app); // Add this line

export { db, storage }; // Export storage properly

// Add a course with subjects array
export const addCourse = async (courseName, subjectIds = []) => {
  await addDoc(collection(db, "Courses"), { name: courseName, subjects: subjectIds });
};

// Fetch all courses
export const getCourses = async () => {
  const querySnapshot = await getDocs(collection(db, "Courses"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a subject
export const addSubject = async (name, courseId, curriculum = "", batches = []) => {
  const subjectRef = await addDoc(collection(db, "Subjects"), {
    name,
    courseID: courseId,
    curriculum,
    batches,
  });
  return subjectRef.id;
};

// Add a subject to a course
export const addSubjectToCourse = async (courseId, subjectId) => {
  const courseRef = doc(db, "Courses", courseId);
  const courseDoc = await getDoc(courseRef);
  if (courseDoc.exists()) {
    const currentSubjects = courseDoc.data().subjects || [];
    await updateDoc(courseRef, { subjects: [...currentSubjects, subjectId] });
  }
};

// Fetch subjects by courseId
export const getSubjectsByCourse = async (courseId) => {
  const querySnapshot = await getDocs(collection(db, "Subjects"));
  return querySnapshot.docs
    .filter((doc) => doc.data().courseID === courseId)
    .map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Enroll a student into a batch
export const enrollStudent = async (batchId, studentId) => {
  const batchRef = doc(db, "Batches", batchId);
  const studentRef = doc(db, "Students", studentId);
  await updateDoc(batchRef, { students: [...students, studentId] });
  await updateDoc(studentRef, { batches: [...batches, batchId] });
};

// Fetch all batches
export const getBatches = async () => {
  const querySnapshot = await getDocs(collection(db, "Batches"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a session to timetable
export const addSession = async (batchId, subjectId, date, startTime, endTime, facultyId) => {
  await addDoc(collection(db, "Timetable"), {
    batchID: batchId,
    subjectID: subjectId,
    date,
    startTime,
    endTime,
    faculty: facultyId,
  });
};


export {analytics}