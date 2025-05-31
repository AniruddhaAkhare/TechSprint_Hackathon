import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";
import { connectFunctionsEmulator } from "firebase/functions";

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

const auth = getAuth(app);
const functions = getFunctions(app);

if (import.meta.env.MODE === 'development') {
  connectFunctionsEmulator(functions, "localhost", 5001);
}
const analytics = getAnalytics(app);

const db = getFirestore(app);
const storage = getStorage(app); 
export { db, storage, auth, functions}; 