import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

const EmployeePage = () => {
  const db = getFirestore();
  const { email } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Fetch employee data in real-time
  useEffect(() => {
    if (!email) {
      setError("No employee email provided");
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, "Users", email);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmployeeData(data);
          setError(null);
        } else {
          setError("Employee data not found");
        }
        setLoading(false);
      },
      (err) => {
        // //console.error("Error fetching employee data:", err);
        setError("Failed to fetch employee data: " + err.message);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [email]);

  // Calculate total working hours for a day
  const calculateTotalHours = (sessions) => {
    if (!sessions || sessions.length === 0) return "0h 0m";

    const totalMs = sessions.reduce((total, session) => {
      const checkIn = new Date(session.checkIn).getTime();
      const checkOut = session.checkOut ? new Date(session.checkOut).getTime() : Date.now();
      return total + (checkOut - checkIn);
    }, 0);

    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Calculate session duration for callout
  const calculateSessionDuration = (session) => {
    const checkIn = new Date(session.checkIn).getTime();
    const checkOut = session.checkOut ? new Date(session.checkOut).getTime() : Date.now();
    const durationMs = checkOut - checkIn;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Calculate timeline segments for a day
  const renderTimeline = (day, index) => {
    const sessions = (day.sessions || [])
      .filter((session) => {
        const checkIn = new Date(session.checkIn);
        return !isNaN(checkIn.getTime());
      })
      .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

    const date = new Date(day.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)).getTime();
    const totalMs = endOfDay - startOfDay;
    const totalHours = calculateTotalHours(sessions);

    // Create segments: green for sessions, gray for gaps
    let segments = [];
    let lastEnd = startOfDay;

    sessions.forEach((session, sessionIndex) => {
      const checkIn = new Date(session.checkIn).getTime();
      const checkOut = session.checkOut ? new Date(session.checkOut).getTime() : Date.now();

      if (checkIn >= startOfDay && checkIn <= endOfDay) {
        if (checkIn > lastEnd) {
          segments.push({
            start: lastEnd,
            end: checkIn,
            isActive: false,
            width: Math.max(((checkIn - lastEnd) / totalMs) * 100, 2),
          });
        }

        segments.push({
          start: checkIn,
          end: checkOut > endOfDay ? endOfDay : checkOut,
          isActive: true,
          width: Math.max(((checkOut > endOfDay ? endOfDay : checkOut - checkIn) / totalMs) * 100, 2),
          checkInTime: new Date(session.checkIn).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          checkOutTime: session.checkOut
            ? new Date(session.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
            : "Ongoing",
          duration: calculateSessionDuration(session),
        });

        lastEnd = checkOut > endOfDay ? endOfDay : checkOut;
      }
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
      <div className="flex items-center gap-4 relative" key={index}>
        <div className="w-28 text-gray-600 font-medium shrink-0">
          {date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
        </div>
        <div className="flex-1 flex h-6 rounded-full overflow-hidden bg-gray-200 relative">
          {segments.map((segment, segIndex) => (
            <div
              key={`${index}-${segIndex}`}
              className={`h-full transition-colors duration-200 ${
                segment.isActive ? "bg-green-600 hover:bg-green-700" : "bg-gray-200"
              }`}
              style={{ width: `${segment.width}%`, minWidth: segment.isActive ? "8px" : "0" }}
              onMouseEnter={() =>
                segment.isActive && setHoveredSegment({ ...segment, index: segIndex, dayIndex: index })
              }
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => segment.isActive && setHoveredSegment({ ...segment, index: segIndex, dayIndex: index })}
            />
          ))}
          {hoveredSegment && hoveredSegment.dayIndex === index && (
            <div
              className="absolute z-50 bg-white p-4 rounded-lg shadow-xl border border-gray-200 text-sm text-gray-800 min-w-[150px]"
              style={{
                top: "-80px",
                left: `${
                  Math.min(
                    Math.max(
                      segments
                        .slice(0, hoveredSegment.index)
                        .reduce((sum, seg) => sum + seg.width, 0) + hoveredSegment.width / 2,
                      10
                    ),
                    90
                  )
                }%`,
                transform: "translateX(-50%)",
                transition: "opacity 0.2s ease-in-out",
                opacity: hoveredSegment ? 1 : 0,
              }}
            >
              <p className="font-semibold">Check-In: {hoveredSegment.checkInTime}</p>
              <p className="font-semibold">Check-Out: {hoveredSegment.checkOutTime}</p>
              <p>Duration: {hoveredSegment.duration}</p>
            </div>
          )}
        </div>
        <div className="w-20 text-gray-600 font-medium text-right">
          {totalHours}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading employee data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 fixed inset-0 left-[300px] overflow-auto">
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
                  employeeData.checkedIn ? "bg-green-600" : "bg-red-600"
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
              <span className={employeeData.active ? "text-green-600" : "text-red-600"}>
                {employeeData.active ? "Active" : "Inactive"}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Checked In:</span> {employeeData.checkedIn ? "Yes" : "No"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Last Check-In:</span>{" "}
              {employeeData.lastCheckIn
                ? new Date(employeeData.lastCheckIn).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                : "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Last Check-Out:</span>{" "}
              {employeeData.lastCheckOut
                ? new Date(employeeData.lastCheckOut).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                : "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Last Login:</span>{" "}
              {employeeData.lastLogin
                ? new Date(employeeData.lastLogin).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                : "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Created At:</span>{" "}
              {employeeData.created_at
                ? new Date(employeeData.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                : "N/A"}
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
                .filter((day) => new Date(day.date).getTime())
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((day, index) => renderTimeline(day, index))}
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