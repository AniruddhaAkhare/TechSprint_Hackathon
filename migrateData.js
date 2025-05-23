import { db } from "./config/firebase";
import { getDocs, collection, setDoc, doc } from "firebase/firestore";

const migrateData = async () => {
  try {
    const instituteId = "9z6G6BLzfDScI0mzMOlB";
    const collectionsToMigrate = [
      "Batch",
      "Companies",
      "Course",
      "FinancePartner",
      "JobOpenings",
      "Leaves",
      "Placements",
      "Sessions",
      "activityLogs",
      "curriculums",
      "enquiries",
      "enquiryForms",
      "enrollments",
      "formResponses",
      "forms",
      "student",
    ];

    for (const coll of collectionsToMigrate) {
      const oldRef = collection(db, coll);
      const snapshot = await getDocs(oldRef);
      for (const docSnap of snapshot.docs) {
        await setDoc(doc(db, "institutes", instituteId, coll, docSnap.id), docSnap.data());
        console.log(`Migrated ${coll}/${docSnap.id}`);
      }
    }

    // Migrate Centers from instituteSetup
    const oldCentersRef = collection(db, "instituteSetup", instituteId, "Center");
    const centerSnapshot = await getDocs(oldCentersRef);
    for (const docSnap of centerSnapshot.docs) {
      await setDoc(doc(db, "institutes", instituteId, "Centers", docSnap.id), docSnap.data());
      console.log(`Migrated Center/${docSnap.id}`);
    }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  }
};

migrateData();