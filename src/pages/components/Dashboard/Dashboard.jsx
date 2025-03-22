// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { getFirestore, collection, onSnapshot } from "firebase/firestore";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { useNavigate } from "react-router-dom";


// ChartJS.register(ArcElement, Tooltip, Legend);

// const Dashboard = () => {
//   const db = getFirestore();
//   const navigate = useNavigate();
//   const [data, setData] = useState({
//     Batch: [],
//     student: [],
//     Course: [],
//     Instructor: [],
//     Centers: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const collections = ["Batch", "student", "Course", "Instructor", "Centers"];
//     const unsubscribers = collections.map((col) =>
//       onSnapshot(
//         collection(db, col),
//         (snapshot) => {
//           setData((prev) => ({
//             ...prev,
//             [col]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
//           }));
//           setLoading(false);
//         },
//         (err) => setError(err.message)
//       )
//     );

//     return () => unsubscribers.forEach((unsub) => unsub());
//   }, [db]);

//   const getStudentStatusCounts = () => {
//     return data.student.reduce((counts, student) => {
//       const status = student.status || "enquiry";
//       counts[status] = (counts[status] || 0) + 1;
//       return counts;
//     }, {});
//   };

//   const getCenterCounts = () => {
//     return data.Centers.reduce((counts, center) => {
//       counts[center.name] = (counts[center.name] || 0) + 1;
//       return counts;
//     }, {});
//   };

//   const handlePieClick = (event, elements, type) => {
//     if (elements.length > 0) {
//       const index = elements[0].index;
//       const statuses = ["active", "inactive", "enrolled", "enquiry"];
//       const selectedStatus = statuses[index];
//       navigate(`/${type}?status=${selectedStatus}`);
//     }
//   };

//   const studentStatusCounts = getStudentStatusCounts();
//   const centerCounts = getCenterCounts();

//   const studentPieData = {
//     labels: ["Active", "Inactive", "Enrolled", "Enquiry"],
//     datasets: [
//       {
//         data: [
//           studentStatusCounts.active || 0,
//           studentStatusCounts.inactive || 0,
//           studentStatusCounts.enrolled || 0,
//           studentStatusCounts.enquiry || 0,
//         ],
//         backgroundColor: ["#4CAF50", "#F44336", "#2196F3", "#FFC107"],
//       },
//     ],
//   };

//   const centerPieData = {
//     labels: Object.keys(centerCounts),
//     datasets: [
//       {
//         data: Object.values(centerCounts),
//         backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A6"],
//       },
//     ],
//   };

//   if (loading) return <div className="text-center text-xl">Loading...</div>;
//   if (error) return <div className="text-center text-red-500">Error: {error}</div>;

//   return (
//     <div className="dashboard flex-col w-screen ml-80 pd-4">
//       <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           { title: "Batches", count: data.Batch.length },
//           { title: "Students", count: data.student.length },
//           { title: "Courses", count: data.Course.length },
//           { title: "Instructors", count: data.Instructor.length },
//           { title: "Centers", count: data.Centers.length },
//         ].map((item, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.2 }}
//             className="bg-white shadow-lg p-5 rounded-md text-center"
//           >
//             <h3 className="text-lg font-medium text-gray-600">{item.title}</h3>
//             <p className="text-2xl font-bold text-gray-800">{item.count}</p>
//           </motion.div>
//         ))}
//       </div>
//       <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-md shadow-lg w-full">
//           <h2 className="text-xl font-semibold mb-4 text-center">Student Status Distribution</h2>
//           <div style={{ position: 'relative', height: '300px', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
//             <Pie
//               data={studentPieData}
//               options={{
//                 maintainAspectRatio: false, // Allow resizing
//                 onClick: (event, elements) => handlePieClick(event, elements, "students"),
//               }}
//             />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-md shadow-lg w-full">
//           <h2 className="text-xl font-semibold mb-4 text-center">Center Distribution</h2>
//           <div style={{ position: 'relative', height: '300px', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
//             <Pie
//               data={centerPieData}
//               options={{
//                 maintainAspectRatio: false, // Allow resizing
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const db = getFirestore();
  const navigate = useNavigate();
  const [data, setData] = useState({
    Batch: [],
    student: [],
    Course: [],
    Instructor: [],
    Centers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const collections = ["Batch", "student", "Course", "Instructor", "Centers"];
    const unsubscribers = collections.map((col) =>
      onSnapshot(
        collection(db, col),
        (snapshot) => {
          setData((prev) => ({
            ...prev,
            [col]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          }));
          setLoading(false);
        },
        (err) => setError(err.message)
      )
    );

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [db]);

  const getStudentStatusCounts = () => {
    return data.student.reduce((counts, student) => {
      const status = student.status || "enquiry";
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  };

  const getCenterCounts = () => {
    return data.Centers.reduce((counts, center) => {
      counts[center.name] = (counts[center.name] || 0) + 1;
      return counts;
    }, {});
  };

  const handlePieClick = (event, elements, type) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const statuses = ["active", "inactive", "enrolled", "enquiry"];
      const selectedStatus = statuses[index];
      navigate(`/${type}?status=${selectedStatus}`);
    }
  };

  const studentStatusCounts = getStudentStatusCounts();
  const centerCounts = getCenterCounts();

  const studentPieData = {
    labels: ["Active", "Inactive", "Enrolled", "Enquiry"],
    datasets: [
      {
        data: [
          studentStatusCounts.active || 0,
          studentStatusCounts.inactive || 0,
          studentStatusCounts.enrolled || 0,
          studentStatusCounts.enquiry || 0,
        ],
        backgroundColor: ["#4CAF50", "#F44336", "#2196F3", "#FFC107"],
      },
    ],
  };

  const centerPieData = {
    labels: Object.keys(centerCounts),
    datasets: [
      {
        data: Object.values(centerCounts),
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A6"],
      },
    ],
  };

  if (loading) return <div className="text-center text-lg sm:text-xl p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-sm sm:text-base p-4">Error: {error}</div>;

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:ml-80 min-h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">Dashboard</h1>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: "Batches", count: data.Batch.length },
          { title: "Students", count: data.student.length },
          { title: "Courses", count: data.Course.length },
          { title: "Instructors", count: data.Instructor.length },
          { title: "Centers", count: data.Centers.length },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white shadow-lg p-4 sm:p-5 rounded-md text-center"
          >
            <h3 className="text-sm sm:text-lg font-medium text-gray-600">{item.title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{item.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Pie Charts */}
      <div className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-md shadow-lg w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Student Status Distribution</h2>
          <div className="relative w-full h-[250px] sm:h-[300px] max-w-[400px] sm:max-w-[500px] mx-auto">
            <Pie
              data={studentPieData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                onClick: (event, elements) => handlePieClick(event, elements, "students"),
                plugins: {
                  legend: { position: "bottom", labels: { font: { size: 12 } } },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-md shadow-lg w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Center Distribution</h2>
          <div className="relative w-full h-[250px] sm:h-[300px] max-w-[400px] sm:max-w-[500px] mx-auto">
            <Pie
              data={centerPieData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: { position: "bottom", labels: { font: { size: 12 } } },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;