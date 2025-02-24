import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase";

const IndividualCourseStudnets = () => {
  const { id } = useParams();
  const [learners, setLearners] = useState([]);

  useEffect(() => {
    const fetchLearners = async () => {
      const courseRef = doc(db, "Course", id);
      const docSnap = await getDoc(courseRef);
      if (docSnap.exists()) {
        setLearners(docSnap.data().learners || []);
      } else {
        console.log("No such course found!");
      }
    };

    fetchLearners();
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Learners</h2>
      {learners.length > 0 ? (
        <ul>
          {learners.map((learner, index) => (
            <li key={index} className="border p-2 my-2">
              {learner}
            </li>
          ))}
        </ul>
      ) : (
        <p>No learners enrolled yet.</p>
      )}
    </div>
  );
};

export default IndividualCourseStudnets;
