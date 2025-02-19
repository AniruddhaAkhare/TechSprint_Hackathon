// import React, { useState } from 'react';
// import moment from 'moment'; // For date formatting
// import { useNavigate } from 'react-router-dom';
// import Calender from './Calendar.jsx'; // Importing the calendar component

// // Sample Data
// const sampleWeeklyPerformance = {
//     averageTimeSpent: '05m 17s',
//     totalViews: 0,
//     averageRating: 0,
//     averageAttendance: 0,
// };

// const sampleTodaySessions = {
//     sessionsScheduled: 0,
//     sessionsCancelled: 0,
//     totalSignIns: 0,
//     notSignedIn: 0,
//     averageAttendance: 0,
// };

// const sampleSessionsData = []; // Your sessions data

// const Dashboard = () => {
//     const [weeklyPerformance, setWeeklyPerformance] = useState(sampleWeeklyPerformance);
//     const [selectedDate, setSelectedDate] = useState(moment('2025-02-05')); // Initial date

//     const handleDateChange = (event) => {
//         setSelectedDate(moment(event.target.value));
//     };

//     const navigate = useNavigate();

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-2xl font-semibold">Welcome Samiksha!</h1>
//                 <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
//                     Schedule session
//                 </button>
//             </div>

//             <section className="bg-white p-4 rounded shadow mt-6">
//                 <h2 className="text-lg font-semibold">Weekly Performance (Last 7 Days)</h2>
//                 <div className="grid grid-cols-4 gap-4 mt-4">
//                     <div className="border p-4 rounded">
//                         <h3 className="font-semibold">Average time spent</h3>
//                         <p>{weeklyPerformance.averageTimeSpent}</p>
//                     </div>
//                     {/* Add other cards here as needed */}
//                 </div>
//             </section>

//             {/* ... (Charts and other sections) */}

//             <section className="bg-white p-4 rounded shadow mt-6">
//                 <h2 className="text-lg font-semibold">Today's Sessions</h2>
//                 <div className="flex items-center gap-4 mt-4">
//                     <button onClick={() => setSelectedDate(moment(selectedDate).subtract(1, 'day'))} className="border p-2 rounded">
//                         &lt;
//                     </button>
//                     <input
//                         type="date"
//                         value={selectedDate.format('YYYY-MM-DD')}
//                         onChange={handleDateChange}
//                         className="border p-2 rounded"
//                     />
//                     <button onClick={() => setSelectedDate(moment(selectedDate).add(1, 'day'))} className="border p-2 rounded">
//                         &gt;
//                     </button>
//                     <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Mark as holiday</button>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 mt-4">
//                     {/* ... Today's Sessions cards */}
//                 </div>

//                 <table className="w-full mt-4 border-collapse">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="p-4 border-b">#</th>
//                             <th className="p-4 border-b">Sessions</th>
//                             <th className="p-4 border-b">Attendance</th>
//                             <th className="p-4 border-b">Status</th>
//                             <th className="p-4 border-b">Topics</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {sampleSessionsData.map((session, index) => (
//                             <tr key={index} className="hover:bg-gray-50">
//                                 <td className="p-4 border-b">{index + 1}</td>
//                                 <td className="p-4 border-b">{session.title}</td>
//                                 <td className="p-4 border-b">{session.attendance}</td>
//                                 <td className="p-4 border-b">
//                                     <span 
//                                         className={`inline-block w-2 h-2 rounded-full mr-2 ${session.status === 'in-time' ? 'bg-green-500' : session.status === 'late' ? 'bg-orange-500' : 'bg-gray-500'}`}
//                                     ></span>
//                                     {session.status}
//                                 </td>
//                                 <td className="p-4 border-b">{session.topics}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </section>
//         </div>
//     );
// };

// export default Dashboard;





import { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import './Dashboard.css';

const Dashboard = () => {
  const db = getFirestore();

  const [data, setData] = useState({
    Batch: [],
    student: [], // lowercase "s"
    Course: [],
    Instructor: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribeBatch = onSnapshot(
      collection(db, 'Batch'),
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          Batch: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    const unsubscribeStudent = onSnapshot(
      collection(db, 'student'), // lowercase "s"
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          student: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    const unsubscribeCourse = onSnapshot(
      collection(db, 'Course'),
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          Course: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    const unsubscribeInstructor = onSnapshot(
      collection(db, 'Instructor'),
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          Instructor: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    return () => {
      unsubscribeBatch();
      unsubscribeStudent();
      unsubscribeCourse();
      unsubscribeInstructor();
    };
  }, [db]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <div  className=" dashboard flex-col w-screen ml-80 pd-4">
      <h1>Dashboard</h1>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Batches</h3>
          <p>Total: {data.Batch.length}</p>
          <ul>
            {data.Batch.map((batch) => (
              <li key={batch.id}>{batch.name || 'Unnamed Batch'}</li>
            ))}
          </ul>
        </div>
        <div className="metric-card">
          <h3>Students</h3>
          <p>Total: {data.student.length}</p>
          <ul>
            {data.student.map((student) => (
              <li key={student.id}>{student.first_name || 'Unnamed Student'}</li>
            ))}
          </ul>
        </div>
        <div className="metric-card">
          <h3>Courses</h3>
          <p>Total: {data.Course.length}</p>
          <ul>
            {data.Course.map((course) => (
              <li key={course.id}>{course.name || 'Unnamed Course'}</li>
            ))}
          </ul>
        </div>
        <div className="metric-card">
          <h3>Instructors</h3>
          <p>Total: {data.Instructor.length}</p>
          <ul>
            {data.Instructor.map((instructor) => (
              <li key={instructor.id}>{instructor.f_name || 'Unnamed Instructor'}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



// Sample React Structure
// import { BarChart, LineChart, PieChart } from 'recharts';

// export default function Dashboard () {
//   return (
//     <div className="grid">
//       {/* Daily Signups */}
//       <LineChart data={dailyData}>
//         <XAxis dataKey="date" />
//         <YAxis />
//         <Tooltip />
//       </LineChart>

//       {/* Monthly Signups */}
//       <BarChart data={monthlyData}>
//         <XAxis dataKey="month" />
//         <YAxis />
//       </BarChart>

//       {/* Yearly Summary Table */}
//       <table>
//         {yearlyData.map((year) => (
//           <tr><td>{year.year}</td><td>{year.signups}</td></tr>
//         ))}
//       </table>
//     </div>
//   );
// };