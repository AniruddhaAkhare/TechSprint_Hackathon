import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { db } from "../config/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const StudentActivity = ({ learnerId, getStudentName, getUserDisplayName, canDisplay }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateSafely = (dateString, formatString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return format(date, formatString);
  };

  useEffect(() => {
    console.log("Learner ID:", learnerId);
    const fetchActivities = async () => {
      if (!learnerId) {
        console.warn("No learnerId provided, skipping fetch");
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
        // Query for learnerId
        const learnerQuery = query(
          collection(db, "activities"),
          where("learnerId", "==", learnerId)
        );
        const learnerSnapshot = await getDocs(learnerQuery);
        const learnerActivities = learnerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Query for studentId (for backward compatibility)
        const studentQuery = query(
          collection(db, "activities"),
          where("studentId", "==", learnerId)
        );
        const studentSnapshot = await getDocs(studentQuery);
        const studentActivities = studentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Merge and deduplicate
        const allActivities = [...learnerActivities, ...studentActivities].reduce(
          (acc, curr) => {
            if (!acc.find((act) => act.id === curr.id)) {
              acc.push(curr);
            }
            return acc;
          },
          []
        );

        console.log("Fetched Activities:", allActivities);
        setActivities(allActivities);
        setError(null);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setError(`Failed to fetch activities: ${error.message}`);
        toast.error(`Failed to fetch activities: ${error.message}`);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [learnerId]);

  if (!canDisplay) {
    return (
      <p className="text-sm text-red-600">You do not have permission to view activities</p>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">
        Activities for {getStudentName() || "Unknown Learner"}
      </h3>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {loading ? (
        <p className="text-sm text-gray-500">Loading activities...</p>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((activity) => (
              <div
                key={activity.id}
                className="p-4 border rounded-md bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {activity.name || activity.description || "Untitled activity"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created by: {getUserDisplayName(activity.createdBy || "Unknown")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Assigned to:{" "}
                    {Array.isArray(activity.assignees)
                      ? activity.assignees
                          .map((assignee) => getUserDisplayName(assignee || "Unknown"))
                          .join(", ")
                      : getUserDisplayName(activity.assignees || "Unassigned")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {activity.status || "Pending"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Learner: {activity.learner || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {formatDateSafely(activity.dueDate, "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1 sm:mt-0">
                  {formatDateSafely(activity.createdAt, "MMM d, yyyy h:mm a")}
                </p>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No activities available</p>
      )}
    </div>
  );
};

export default StudentActivity;