import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase";

const IndividualCourseCurriculum = () => {
  const { id } = useParams();
  const [curriculumName, setCurriculumName] = useState("");

  useEffect(() => {

  const fetchCurriculumNames = async (curriculumIds) => {
    try {
        if (!Array.isArray(curriculumIds) || curriculumIds.length === 0) {
            console.error("Invalid curriculum IDs:", curriculumIds);
            return;
        }

        const curriculumNames = await Promise.all(curriculumIds.map(async (curriculumId) => {
            const curriculumRef = doc(db, "Curriculum", curriculumId);
            const curriculumSnap = await getDoc(curriculumRef);

            return curriculumSnap.exists() ? curriculumSnap.data().name : "Unknown Curriculum";
        }));

        setCurriculumName(curriculumNames.join(", ")); // Join names with a comma
    } catch (error) {
        console.error("Error fetching curriculum names:", error);
    }
};



const fetchCourse = async () => {
  try {
      const courseRef = doc(db, "Course", id);
      const docSnap = await getDoc(courseRef);

      if (docSnap.exists()) {
          const data = docSnap.data();
          setCourseData(prev => ({
              ...prev,
              ...data,
              subjects: data.subjects || [],
              centers: data.centers || []
          }));

          if (Array.isArray(data.curriculum) && data.curriculum.length > 0) {
              fetchCurriculumNames(data.curriculum);
          }
      } else {
          console.log("No such course!");
      }
  } catch (error) {
      console.error("Error fetching course:", error);
  }
};

    if (id) {
      fetchCourse();
    }
  }, [id]);

  return (
    <div className="flex-col w-screen ml-80 p-4">
      <h2 className="text-xl font-semibold">Curriculum</h2>
      {curriculumName ? (
        <p>{curriculumName}</p>
      ) : (
        <p>No curriculum available.</p>
      )}
    </div>
  );
};

export default IndividualCourseCurriculum;
