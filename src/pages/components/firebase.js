import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);
const analytics = getAnalytics(app);