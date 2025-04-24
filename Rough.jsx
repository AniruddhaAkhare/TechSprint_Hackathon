const logActivity = async (action, details) => {
  if (!user) {
    console.error("No user logged in for logging activity");
    return;
  }

  try {
    // Query to find the latest log document for the user
    const querySnapshot = await getDocs(
      query(
        LogsCollectionRef,
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(1)
      )
    );

    let docRef;
    let newLogEntry = {
      timestamp: serverTimestamp(),
      action,
      details
    };

    if (querySnapshot.empty) {
      // No existing document, create new one with initial count and array
      await addDoc(LogsCollectionRef, {
        userId: user.uid,
        userEmail: user.email,
        count: 1,
        logs: [newLogEntry]
      });
      console.log("New log document created:", action, details);
    } else {
      // Get the latest document
      const latestDoc = querySnapshot.docs[0];
      const docData = latestDoc.data();
      const currentCount = docData.count || 0;

      if (currentCount < 100) {
        // Update existing document: append to logs array and increment count
        docRef = doc(LogsCollectionRef, latestDoc.id);
        await updateDoc(docRef, {
          count: increment(1),
          logs: arrayUnion(newLogEntry)
        });
        console.log("Activity appended to existing log document:", action, details);
      } else {
        // Create new document when count >= 100
        await addDoc(LogsCollectionRef, {
          userId: user.uid,
          userEmail: user.email,
          count: 1,
          logs: [newLogEntry]
        });
        console.log("New log document created (count exceeded):", action, details);
      }
    }
  } catch (err) {
    console.error("Error logging activity:", err.message);
    throw err;
  }
};