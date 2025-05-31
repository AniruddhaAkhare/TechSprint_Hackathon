// import { initializeApp } from "firebase/app";
// import {getAuth,connectAuthEmulator, } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { getFunctions, httpsCallable, connectFunctionsEmulator} from "firebase/functions";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyCr7lMF1rd-VeEArjy0dklqR08hzoqxFZI",
//   authDomain: "fireblaze-ignite.firebaseapp.com",
//   databaseURL: "https://fireblaze-ignite-default-rtdb.firebaseio.com",
//   projectId: "fireblaze-ignite",
//   storageBucket: "fireblaze-ignite.firebasestorage.app",
//   messagingSenderId: "848780069457",
//   appId: "1:848780069457:web:33eede2d3e487c45cf4670",
//   measurementId: "G-14J96V5WD0"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);

// const analytics = getAnalytics(app);

// const db = getFirestore(app);
// // Initialize Storage
// const storage = getStorage(app); // Add this line
// const functions = getFunctions(app);
// if (process.env.NODE_ENV === "development") {
//   connectFirestoreEmulator(db, "localhost", 8080);
//   connectFunctionsEmulator(functions, "localhost", 5001);
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

// export { db, storage, functions, httpsCallable }; // Export storage properly

// // Add a course with subjects array
// export const addCourse = async (courseName, subjectIds = []) => {
//   await addDoc(collection(db, "Courses"), { name: courseName, subjects: subjectIds });
// };

// // Fetch all courses
// export const getCourses = async () => {
//   const querySnapshot = await getDocs(collection(db, "Courses"));
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // Add a subject
// export const addSubject = async (name, courseId, curriculum = "", batches = []) => {
//   const subjectRef = await addDoc(collection(db, "Subjects"), {
//     name,
//     courseID: courseId,
//     curriculum,
//     batches,
//   });
//   return subjectRef.id;
// };

// // Add a subject to a course
// export const addSubjectToCourse = async (courseId, subjectId) => {
//   const courseRef = doc(db, "Courses", courseId);
//   const courseDoc = await getDoc(courseRef);
//   if (courseDoc.exists()) {
//     const currentSubjects = courseDoc.data().subjects || [];
//     await updateDoc(courseRef, { subjects: [...currentSubjects, subjectId] });
//   }
// };

// // Fetch subjects by courseId
// export const getSubjectsByCourse = async (courseId) => {
//   const querySnapshot = await getDocs(collection(db, "Subjects"));
//   return querySnapshot.docs
//     .filter((doc) => doc.data().courseID === courseId)
//     .map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // Enroll a student into a batch
// export const enrollStudent = async (batchId, studentId) => {
//   const batchRef = doc(db, "Batches", batchId);
//   const studentRef = doc(db, "Students", studentId);
//   await updateDoc(batchRef, { students: [...students, studentId] });
//   await updateDoc(studentRef, { batches: [...batches, batchId] });
// };

// // Fetch all batches
// export const getBatches = async () => {
//   const querySnapshot = await getDocs(collection(db, "Batches"));
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // Add a session to timetable
// export const addSession = async (batchId, subjectId, date, startTime, endTime, facultyId) => {
//   await addDoc(collection(db, "Timetable"), {
//     batchID: batchId,
//     subjectID: subjectId,
//     date,
//     startTime,
//     endTime,
//     faculty: facultyId,
//   });
// };




import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from "firebase/firestore";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCr7lMF1rd-VeEArjy0dklqR08hzoqxFZI",
  authDomain: "fireblaze-ignite.firebaseapp.com",
  databaseURL: "https://fireblaze-ignite-default-rtdb.firebaseio.com",
  projectId: "fireblaze-ignite",
  storageBucket: "fireblaze-ignite.firebasestorage.app",
  messagingSenderId: "848780069457",
  appId: "1:848780069457:web:19f8674117355c57cf4670",
  measurementId: "G-TB5YHTH2SB"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCr7lMF1rd-VeEArjy0dklqR08hzoqxFZI",
//   authDomain: "fireblaze-ignite.firebaseapp.com",
//   databaseURL: "https://fireblaze-ignite-default-rtdb.firebaseio.com",
//   projectId: "fireblaze-ignite",
//   storageBucket: "fireblaze-ignite.firebasestorage.app",
//   messagingSenderId: "848780069457",
//   appId: "1:848780069457:web:33eede2d3e487c45cf4670",
//   measurementId: "G-14J96V5WD0"
// };




const app = initializeApp(firebaseConfig);

const auth = getAuth(app);



const analytics = getAnalytics(app);


const db = getFirestore(app);

// enableIndexedDbPersistence(db)
//   .catch((err) => {
//     if (err.code === 'failed-precondition') {
//       // Multiple tabs open, persistence can only be enabled
//       // in one tab at a time.
//       // ...
//     } else if (err.code === 'unimplemented') {
//       // The current browser does not support all of the
//       // features required to enable persistence.
//       // ...
//     }
//   });

// Initialize Storage
const storage = getStorage(app); // Add this line
const functions = getFunctions(app);
if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
}




export { auth, db, storage, functions, httpsCallable }; // Export storage properly

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


