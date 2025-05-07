import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const EmployeePage = () => {
  const db = getFirestore();
  const { email } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!email) {
        setError("No employee email provided");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "Users", email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          console.log("Employee data:", data);
          setEmployeeData(data);
        } else {
          setError("Employee data not found");
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to fetch employee data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [email, db]);

  // Calculate total working hours for a day
  const calculateTotalHours = (sessions) => {
    if (!sessions || sessions.length === 0) return "0h 0m";

    const totalMs = sessions.reduce((total, session) => {
      const checkIn = new Date(session.checkIn).getTime();
      const checkOut = session.checkOut ? new Date(session.checkOut).getTime() : checkIn;
      return total + (checkOut - checkIn);
    }, 0);

    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Calculate timeline segments for a day
  const renderTimeline = (day) => {
    const sessions = day.sessions || [];
    const date = new Date(day.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)).getTime();
    const totalMs = endOfDay - startOfDay;
    const totalHours = calculateTotalHours(sessions);

    // Create segments: green for sessions, gray for gaps
    let segments = [];
    let lastEnd = startOfDay;

    sessions
      .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
      .forEach((session) => {
        const checkIn = new Date(session.checkIn).getTime();
        const checkOut = session.checkOut ? new Date(session.checkOut).getTime() : checkIn;

        if (checkIn > lastEnd) {
          segments.push({
            start: lastEnd,
            end: checkIn,
            isActive: false,
            width: ((checkIn - lastEnd) / totalMs) * 100,
          });
        }

        segments.push({
          start: checkIn,
          end: checkOut,
          isActive: true,
          width: ((checkOut - checkIn) / totalMs) * 100,
          checkInTime: new Date(session.checkIn).toLocaleTimeString(),
          checkOutTime: session.checkOut ? new Date(session.checkOut).toLocaleTimeString() : "Ongoing",
        });

        lastEnd = checkOut;
      });

    if (lastEnd < endOfDay) {
      segments.push({
        start: lastEnd,
        end: endOfDay,
        isActive: false,
        width: ((endOfDay - lastEnd) / totalMs) * 100,
      });
    }

    return (
      <div className="flex items-center gap-4 relative">
        <div className="w-24 text-gray-600 font-medium">
          {date.toLocaleDateString()}
        </div>
        <div className="flex-1 flex h-4 rounded-full overflow-hidden bg-gray-300 relative">
          {segments.map((segment, index) => (
            <div
              key={index}
              className={`h-full ${segment.isActive ? "bg-green-500" : "bg-gray-300"}`}
              style={{ width: `${segment.width}%` }}
              onMouseEnter={() => segment.isActive && setHoveredSegment({ ...segment, index })}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          ))}
          {hoveredSegment && (
            <div
              className="absolute z-10 bg-white p-2 rounded shadow-lg border border-gray-200"
              style={{
                top: '-50px',
                left: `${segments.slice(0, hoveredSegment.index).reduce((sum, seg) => sum + seg.width, 0)}%`,
              }}
            >
              <p className="text-sm text-gray-800">
                Check-In: {hoveredSegment.checkInTime}
              </p>
              <p className="text-sm text-gray-800">
                Check-Out: {hoveredSegment.checkOutTime}
              </p>
            </div>
          )}
        </div>
        <div className="w-20 text-gray-600 font-medium">
          {totalHours}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 p-4 fixed inset-0 left-[300px]">
      <div className="max-w-4xl mx-auto">
        {/* Employee Details Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xl font-medium">
                  {employeeData.displayName?.split(" ").map((n) => n[0]).join("").toUpperCase() || "N/A"}
                </span>
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  employeeData.checkedIn ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{employeeData.displayName || "N/A"}</h1>
              <p className="text-gray-600">{employeeData.email || "N/A"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700">
              <span className="font-semibold">Branch:</span> {employeeData.branchName || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Status:</span>{" "}
              <span className={employeeData.active ? "text-green-500" : "text-red-500"}>
                {employeeData.active ? "Active" : "Inactive"}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Checked In:</span> {employeeData.checkedIn ? "Yes" : "No"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Last Check-In:</span>{" "}
              {employeeData.lastCheckIn ? new Date(employeeData.lastCheckIn).toLocaleString() : "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Last Check-Out:</span>{" "}
              {employeeData.lastCheckOut ? new Date(employeeData.lastCheckOut).toLocaleString() : "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Last Login:</span>{" "}
              {employeeData.lastLogin ? new Date(employeeData.lastLogin).toLocaleString() : "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Created At:</span>{" "}
              {employeeData.createdAt ? new Date(employeeData.createdAt).toLocaleString() : "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total Duration (Latest Day):</span>{" "}
              {employeeData.dailyDurations?.[0]?.totalDuration || "0"} hours
            </p>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Check-In/Check-Out Timeline</h2>
          {employeeData.dailyDurations && employeeData.dailyDurations.length > 0 ? (
            <div className="space-y-4">
              {employeeData.dailyDurations
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((day, index) => (
                  <div key={index}>{renderTimeline(day)}</div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600">No check-in/check-out data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;