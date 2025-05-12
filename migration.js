import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

// Firebase configuration (replace with your project's config)
const firebaseConfig = {
  apiKey:"AIzaSyCr7lMF1rd-VeEArjy0dklqR08hzoqxFZI",
  authDomain: "fireblaze-ignite.firebaseapp.com",
  projectId: "fireblaze-ignite",
  storageBucket: "fireblaze-ignite.firebasestorage.app",
  messagingSenderId: "848780069457",
  appId: "1:848780069457:web:33eede2d3e487c45cf4670",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const migrateEnquiries = async () => {
  try {
    const enquiriesRef = collection(db, "enquiries"); // Adjust to "Enquiries" if your collection uses capital 'E'
    const snapshot = await getDocs(enquiriesRef);
    console.log(`Found ${snapshot.size} enquiries to process.`);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      let updatedData = {};

      if (data.status && !data.stage) {
        // Convert status to stage with hyphenated value
        const statusMap = {
          prequalified: "pre-qualified",
          qualified: "qualified",
          negotiation: "negotiation",
          "closed won": "closed-won",
          "closed lost": "closed-lost",
          "contact in future": "contact-in-future",
        };
        const statusKey = data.status.toLowerCase();
        updatedData.stage = statusMap[statusKey] || "pre-qualified";
        updatedData.status = null; // Remove old status field
        console.log(`Converting status "${data.status}" to stage "${updatedData.stage}" for enquiry ${docSnap.id}`);
      } else if (!data.stage) {
        // Set default stage if none exists
        updatedData.stage = "pre-qualified";
        console.log(`Setting stage to "pre-qualified" for enquiry ${docSnap.id}`);
      }

      if (Object.keys(updatedData).length > 0) {
        await updateDoc(doc(db, "enquiries", docSnap.id), updatedData);
        console.log(`Updated enquiry ${docSnap.id}`);
      } else {
        console.log(`No changes needed for enquiry ${docSnap.id}`);
      }
    }
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
};

// Run migration
migrateEnquiries();