import { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import './Dashboard.css';
import Centers from '../Settings/Centers';

const Dashboard = () => {
  const db = getFirestore();

  const [data, setData] = useState({
    Batch: [],
    student: [], // lowercase "s"
    Course: [],
    Instructor: [],
    Centers:[],
  });

  const getStudentStatusCounts = (students) => {
    return students.reduce((counts, student) => {
      const status = student.status || 'enquiry';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  };


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


    const unsubscribeStudentStatus = onSnapshot(
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

    const unsubscribeCenter = onSnapshot(
      collection(db, 'Centers'),
      
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          Centers: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    return () => {
      unsubscribeBatch();
      unsubscribeStudentStatus();
      unsubscribeStudent();
      unsubscribeCourse();
      unsubscribeInstructor();
      unsubscribeCenter();
    };
  }, [db]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <div className=" dashboard flex-col w-screen ml-80 pd-4">
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
          <h3>Students</h3>
          {/* <p>Total: {data.student.length}</p> */}
          <div className="status-counts">
            <ul>
              <li><b>Active:</b> {getStudentStatusCounts(data.student).active || 0}</li>
              <li><b>Enrolled:</b> {getStudentStatusCounts(data.student).enrolled || 0}</li>
              <li><b>Enquiry:</b> {getStudentStatusCounts(data.student).enquiry || 0}</li>
              <li><b>Inactive:</b> {getStudentStatusCounts(data.student).inactive || 0}</li>
            </ul>
          </div>
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

        <div className="metric-card">
          <h3>Centers</h3>
          <p>Total: {data.Centers.length}</p>

          
          <ul>
            {data.Centers.map((center) => (
              <li key={center.id}>{center.name || 'Unnamed Instructor'}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


// // // // // // import { useEffect, useState } from "react";
// // // // // // import { getFirestore, collection, onSnapshot } from "firebase/firestore";
// // // // // // import { motion } from "framer-motion";

// // // // // // const Dashboard = () => {
// // // // // //   const db = getFirestore();
// // // // // //   const [data, setData] = useState({
// // // // // //     Batch: [],
// // // // // //     student: [],
// // // // // //     Course: [],
// // // // // //     Instructor: [],
// // // // // //     Centers: [],
// // // // // //   });

// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [error, setError] = useState("");

// // // // // //   useEffect(() => {
// // // // // //     const unsubscribes = [];

// // // // // //     const collections = ["Batch", "student", "Course", "Instructor", "Centers"];
// // // // // //     collections.forEach((col) => {
// // // // // //       const unsubscribe = onSnapshot(
// // // // // //         collection(db, col),
// // // // // //         (snapshot) => {
// // // // // //           setData((prev) => ({
// // // // // //             ...prev,
// // // // // //             [col]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
// // // // // //           }));
// // // // // //           setLoading(false);
// // // // // //         },
// // // // // //         (err) => setError(err.message)
// // // // // //       );
// // // // // //       unsubscribes.push(unsubscribe);
// // // // // //     });

// // // // // //     return () => unsubscribes.forEach((unsub) => unsub());
// // // // // //   }, [db]);

// // // // // //   if (loading)
// // // // // //     return <div className="text-center text-xl font-semibold">Loading...</div>;
// // // // // //   if (error)
// // // // // //     return <div className="text-center text-red-500 font-semibold">{error}</div>;

// // // // // //   return (
// // // // // //     <motion.div
// // // // // //       className="min-h-screen p-8 flex flex-col items-center bg-gray-100"
// // // // // //       initial={{ opacity: 0 }}
// // // // // //       animate={{ opacity: 1 }}
// // // // // //       transition={{ duration: 1 }}
// // // // // //     >
// // // // // //       <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
// // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
// // // // // //         {[
// // // // // //           { title: "Batches", count: data.Batch.length, list: data.Batch },
// // // // // //           { title: "Students", count: data.student.length, list: data.student },
// // // // // //           { title: "Courses", count: data.Course.length, list: data.Course },
// // // // // //           { title: "Instructors", count: data.Instructor.length, list: data.Instructor },
// // // // // //           { title: "Centers", count: data.Centers.length, list: data.Centers },
// // // // // //         ].map((item, index) => (
// // // // // //           <motion.div
// // // // // //             key={index}
// // // // // //             className="bg-white p-6 rounded-lg shadow-lg text-center"
// // // // // //             initial={{ y: 30, opacity: 0 }}
// // // // // //             animate={{ y: 0, opacity: 1 }}
// // // // // //             transition={{ duration: 0.5, delay: index * 0.1 }}
// // // // // //           >
// // // // // //             <h3 className="text-xl font-semibold">{item.title}</h3>
// // // // // //             <p className="text-2xl font-bold">{item.count}</p>
// // // // // //             <ul className="mt-2 text-gray-600">
// // // // // //               {item.list.slice(0, 3).map((entry) => (
// // // // // //                 <li key={entry.id}>{entry.name || "Unnamed"}</li>
// // // // // //               ))}
// // // // // //               {item.list.length > 3 && <li>...</li>}
// // // // // //             </ul>
// // // // // //           </motion.div>
// // // // // //         ))}
// // // // // //       </div>
// // // // // //     </motion.div>
// // // // // //   );
// // // // // // };

// // // // // // export default Dashboard;


// // // // // import { useEffect, useState } from "react";
// // // // // import { motion } from "framer-motion";
// // // // // import { getFirestore, collection, onSnapshot } from "firebase/firestore";

// // // // // const Dashboard = () => {
// // // // //   const db = getFirestore();
// // // // //   const [data, setData] = useState({
// // // // //     Batch: [],
// // // // //     student: [],
// // // // //     Course: [],
// // // // //     Instructor: [],
// // // // //     Centers: [],
// // // // //   });
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [error, setError] = useState("");

// // // // //   useEffect(() => {
// // // // //     const collections = ["Batch", "student", "Course", "Instructor", "Centers"];
// // // // //     const unsubscribers = collections.map((col) =>
// // // // //       onSnapshot(
// // // // //         collection(db, col),
// // // // //         (snapshot) => {
// // // // //           setData((prev) => ({
// // // // //             ...prev,
// // // // //             [col]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
// // // // //           }));
// // // // //           setLoading(false);
// // // // //         },
// // // // //         (err) => setError(err.message)
// // // // //       )
// // // // //     );
// // // // //     return () => unsubscribers.forEach((unsub) => unsub());
// // // // //   }, [db]);

// // // // //   if (loading) return <div className="text-center text-xl">Loading...</div>;
// // // // //   if (error) return <div className="text-center text-red-500">Error: {error}</div>;

// // // // //   return (
// // // // //     <div className=" dashboard flex-col w-screen ml-80 pd-4">
// // // // //     {/* // <div className="p-6 bg-gray-100 min-h-screen"> */}
// // // // //       <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
// // // // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// // // // //         {[
// // // // //           { title: "Batches", count: data.Batch.length },
// // // // //           { title: "Students", count: data.student.length },
// // // // //           { title: "Courses", count: data.Course.length },
// // // // //           { title: "Instructors", count: data.Instructor.length },
// // // // //         ].map((item, index) => (
// // // // //           <motion.div
// // // // //             key={index}
// // // // //             initial={{ opacity: 0, y: 20 }}
// // // // //             animate={{ opacity: 1, y: 0 }}
// // // // //             transition={{ duration: 0.5, delay: index * 0.2 }}
// // // // //             className="bg-white shadow-lg p-5 rounded-xl text-center"
// // // // //           >
// // // // //             <h3 className="text-lg font-medium text-gray-600">{item.title}</h3>
// // // // //             <p className="text-2xl font-bold text-gray-800">{item.count}</p>
// // // // //           </motion.div>
// // // // //         ))}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Dashboard;

// // // // import { useEffect, useState } from "react";
// // // // import { motion } from "framer-motion";
// // // // import { getFirestore, collection, onSnapshot } from "firebase/firestore";
// // // // import { Pie } from "react-chartjs-2";
// // // // import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// // // // ChartJS.register(ArcElement, Tooltip, Legend);

// // // // const Dashboard = () => {
// // // //   const db = getFirestore();
// // // //   const [data, setData] = useState({
// // // //     Batch: [],
// // // //     student: [],
// // // //     Course: [],
// // // //     Instructor: [],
// // // //     Centers: [],
// // // //   });
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState("");

// // // //   useEffect(() => {
// // // //     const collections = ["Batch", "student", "Course", "Instructor", "Centers"];
// // // //     const unsubscribers = collections.map((col) =>
// // // //       onSnapshot(
// // // //         collection(db, col),
// // // //         (snapshot) => {
// // // //           setData((prev) => ({
// // // //             ...prev,
// // // //             [col]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
// // // //           }));
// // // //           setLoading(false);
// // // //         },
// // // //         (err) => setError(err.message)
// // // //       )
// // // //     );
// // // //     return () => unsubscribers.forEach((unsub) => unsub());
// // // //   }, [db]);

// // // //   const getStudentStatusCounts = () => {
// // // //     return data.student.reduce((counts, student) => {
// // // //       const status = student.status || "enquiry";
// // // //       counts[status] = (counts[status] || 0) + 1;
// // // //       return counts;
// // // //     }, {});
// // // //   };

// // // //   const studentStatusCounts = getStudentStatusCounts();
// // // //   const pieData = {
// // // //     labels: ["Complete", "Inactive", "Enrolled", "Enquiry"],
// // // //     datasets: [
// // // //       {
// // // //         data: [
// // // //           studentStatusCounts.complete || 0,
// // // //           studentStatusCounts.inactive || 0,
// // // //           studentStatusCounts.enrolled || 0,
// // // //           studentStatusCounts.enquiry || 0,
// // // //         ],
// // // //         backgroundColor: ["#4CAF50", "#F44336", "#2196F3", "#FFC107"],
// // // //       },
// // // //     ],
// // // //   };

// // // //   if (loading) return <div className="text-center text-xl">Loading...</div>;
// // // //   if (error) return <div className="text-center text-red-500">Error: {error}</div>;

// // // //   return (
// // // //     <div className=" dashboard flex-col w-screen ml-80 pd-4">
// // // //     {/* // <div className="p-6 bg-gray-100 min-h-screen"> */}
// // // //       <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
// // // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// // // //         {[
// // // //           { title: "Batches", count: data.Batch.length },
// // // //           { title: "Students", count: data.student.length },
// // // //           { title: "Courses", count: data.Course.length },
// // // //           { title: "Instructors", count: data.Instructor.length },
// // // //         ].map((item, index) => (
// // // //           <motion.div
// // // //             key={index}
// // // //             initial={{ opacity: 0, y: 20 }}
// // // //             animate={{ opacity: 1, y: 0 }}
// // // //             transition={{ duration: 0.5, delay: index * 0.2 }}
// // // //             className="bg-white shadow-lg p-5 rounded-xl text-center"
// // // //           >
// // // //             <h3 className="text-lg font-medium text-gray-600">{item.title}</h3>
// // // //             <p className="text-2xl font-bold text-gray-800">{item.count}</p>
// // // //           </motion.div>
// // // //         ))}
// // // //       </div>
// // // //       <div className="mt-10 bg-white p-6 rounded-xl shadow-lg w-full md:w-1/2 mx-auto">
// // // //         <h2 className="text-xl font-semibold mb-4 text-center">Student Status Distribution</h2>
// // // //         <Pie data={pieData} />
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Dashboard;


// // // import { useEffect, useState } from "react";
// // // import { motion } from "framer-motion";
// // // import { getFirestore, collection, onSnapshot } from "firebase/firestore";
// // // import { Pie } from "react-chartjs-2";
// // // import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// // // import { useNavigate } from "react-router-dom";

// // // ChartJS.register(ArcElement, Tooltip, Legend);

// // // const Dashboard = () => {
// // //   const db = getFirestore();
// // //   const navigate = useNavigate();
// // //   const [data, setData] = useState({
// // //     Batch: [],
// // //     student: [],
// // //     Course: [],
// // //     Instructor: [],
// // //     Centers: [],
// // //   });
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState("");

// // //   useEffect(() => {
// // //     const collections = ["Batch", "student", "Course", "Instructor", "Centers"];
// // //     const unsubscribers = collections.map((col) =>
// // //       onSnapshot(
// // //         collection(db, col),
// // //         (snapshot) => {
// // //           setData((prev) => ({
// // //             ...prev,
// // //             [col]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
// // //           }));
// // //           setLoading(false);
// // //         },
// // //         (err) => setError(err.message)
// // //       )
// // //     );
// // //     return () => unsubscribers.forEach((unsub) => unsub());
// // //   }, [db]);

// // //   const getStudentStatusCounts = () => {
// // //     return data.student.reduce((counts, student) => {
// // //       const status = student.status || "enquiry";
// // //       counts[status] = (counts[status] || 0) + 1;
// // //       return counts;
// // //     }, {});
// // //   };

// // //   const handlePieClick = (event, elements) => {
// // //     if (elements.length > 0) {
// // //       const index = elements[0].index;
// // //       const statuses = ["complete", "inactive", "enrolled", "enquiry"];
// // //       const selectedStatus = statuses[index];
// // //       navigate(`/studentDetails`);
// // //     }
// // //   };

// // //   const studentStatusCounts = getStudentStatusCounts();
// // //   const pieData = {
// // //     labels: ["Complete", "Inactive", "Enrolled", "Enquiry"],
// // //     datasets: [
// // //       {
// // //         data: [
// // //           studentStatusCounts.complete || 0,
// // //           studentStatusCounts.inactive || 0,
// // //           studentStatusCounts.enrolled || 0,
// // //           studentStatusCounts.enquiry || 0,
// // //         ],
// // //         backgroundColor: ["#4CAF50", "#F44336", "#2196F3", "#FFC107"],
// // //       },
// // //     ],
// // //   };

// // //   if (loading) return <div className="text-center text-xl">Loading...</div>;
// // //   if (error) return <div className="text-center text-red-500">Error: {error}</div>;

// // //   return (
// // //         <div className=" dashboard flex-col w-screen ml-80 pd-4">
// // //     {/* // <div className="p-6 bg-gray-100 min-h-screen"> */}
// // //       <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// // //         {[
// // //           { title: "Batches", count: data.Batch.length },
// // //           { title: "Students", count: data.student.length },
// // //           { title: "Courses", count: data.Course.length },
// // //           { title: "Instructors", count: data.Instructor.length },
// // //         ].map((item, index) => (
// // //           <motion.div
// // //             key={index}
// // //             initial={{ opacity: 0, y: 20 }}
// // //             animate={{ opacity: 1, y: 0 }}
// // //             transition={{ duration: 0.5, delay: index * 0.2 }}
// // //             className="bg-white shadow-lg p-5 rounded-xl text-center"
// // //           >
// // //             <h3 className="text-lg font-medium text-gray-600">{item.title}</h3>
// // //             <p className="text-2xl font-bold text-gray-800">{item.count}</p>
// // //           </motion.div>
// // //         ))}
// // //       </div>
// // //       <div className="mt-10 bg-white p-6 rounded-xl h-50 w-50">
// // //         <h2 className="text-xl font-semibold mb-4 text-center">Student Status Distribution</h2>
// // //         <Pie data={pieData} options={{ onClick: handlePieClick }} />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;


// // import { useEffect, useState } from "react";
// // import { motion } from "framer-motion";
// // import { getFirestore, collection, onSnapshot } from "firebase/firestore";
// // import { Pie } from "react-chartjs-2";
// // import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// // import { useNavigate } from "react-router-dom";

// // ChartJS.register(ArcElement, Tooltip, Legend);

// // const Dashboard = () => {
// //   const db = getFirestore();
// //   const navigate = useNavigate();
// //   const [data, setData] = useState({
// //     Batch: [],
// //     student: [],
// //     Course: [],
// //     Instructor: [],
// //     Centers: [],
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     const collections = ["Batch", "student", "Course", "Instructor", "Centers"];
// //     const unsubscribers = collections.map((col) =>
// //       onSnapshot(
// //         collection(db, col),
// //         (snapshot) => {
// //           setData((prev) => ({
// //             ...prev,
// //             [col]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
// //           }));
// //           setLoading(false);
// //         },
// //         (err) => setError(err.message)
// //       )
// //     );
// //     return () => unsubscribers.forEach((unsub) => unsub());
// //   }, [db]);

// //   const getStudentStatusCounts = () => {
// //     return data.student.reduce((counts, student) => {
// //       const status = student.status || "enquiry";
// //       counts[status] = (counts[status] || 0) + 1;
// //       return counts;
// //     }, {});
// //   };

// //   const getCenterStatusCounts = () => {
// //     return data.Centers.reduce((counts, center) => {
// //       const status = center.status || "inactive";
// //       counts[status] = (counts[status] || 0) + 1;
// //       return counts;
// //     }, {});
// //   };

// //   const handlePieClick = (event, elements, type) => {
// //     if (elements.length > 0) {
// //       const index = elements[0].index;
// //       const statuses = ["active", "inactive", "enrolled", "enquiry"];
// //       const selectedStatus = statuses[index];
// //       navigate(`/${type}?status=${selectedStatus}`);
// //     }
// //   };

// //   const studentStatusCounts = getStudentStatusCounts();
// //   const centerStatusCounts = getCenterStatusCounts();
  
// //   const studentPieData = {
// //     labels: ["Active", "Inactive", "Enrolled", "Enquiry"],
// //     datasets: [
// //       {
// //         data: [
// //           studentStatusCounts.active || 0,
// //           studentStatusCounts.inactive || 0,
// //           studentStatusCounts.enrolled || 0,
// //           studentStatusCounts.enquiry || 0,
// //         ],
// //         backgroundColor: ["#4CAF50", "#F44336", "#2196F3", "#FFC107"],
// //       },
// //     ],
// //   };

// //   const centerPieData = {
// //     labels: ["Active", "Inactive"],
// //     datasets: [
// //       {
// //         data: [
// //           centerStatusCounts.active || 0,
// //           centerStatusCounts.inactive || 0,
// //         ],
// //         backgroundColor: ["#4CAF50", "#F44336"],
// //       },
// //     ],
// //   };

// //   if (loading) return <div className="text-center text-xl">Loading...</div>;
// //   if (error) return <div className="text-center text-red-500">Error: {error}</div>;

// //   return (
// //     <div className="p-6 bg-gray-100 min-h-screen">
// //       <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //         {[
// //           { title: "Batches", count: data.Batch.length },
// //           { title: "Students", count: data.student.length },
// //           { title: "Courses", count: data.Course.length },
// //           { title: "Instructors", count: data.Instructor.length },
// //           { title: "Centers", count: data.Centers.length },
// //         ].map((item, index) => (
// //           <motion.div
// //             key={index}
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5, delay: index * 0.2 }}
// //             className="bg-white shadow-lg p-5 rounded-xl text-center"
// //           >
// //             <h3 className="text-lg font-medium text-gray-600">{item.title}</h3>
// //             <p className="text-2xl font-bold text-gray-800">{item.count}</p>
// //           </motion.div>
// //         ))}
// //       </div>
// //       <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div className="bg-white p-6 rounded-xl shadow-lg w-full">
// //           <h2 className="text-xl font-semibold mb-4 text-center">Student Status Distribution</h2>
// //           <Pie data={studentPieData} options={{ onClick: (event, elements) => handlePieClick(event, elements, "students") }} />
// //         </div>
// //         <div className="bg-white p-6 rounded-xl shadow-lg w-full">
// //           <h2 className="text-xl font-semibold mb-4 text-center">Center Status Distribution</h2>
// //           <Pie data={centerPieData} options={{ onClick: (event, elements) => handlePieClick(event, elements, "centers") }} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

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
//     <div className=" dashboard flex-col w-screen ml-80 pd-4">
//     {/* // <div className="p-6 bg-gray-100 min-h-screen"> */}
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
//             className="bg-white shadow-lg p-5 rounded-xl text-center"
//           >
//             <h3 className="text-lg font-medium text-gray-600">{item.title}</h3>
//             <p className="text-2xl font-bold text-gray-800">{item.count}</p>
//           </motion.div>
//         ))}
//       </div>
//       <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-lg w-full">
//           <h2 className="text-xl font-semibold mb-4 text-center">Student Status Distribution</h2>
//           <Pie data={studentPieData} options={{ onClick: (event, elements) => handlePieClick(event, elements, "students") }} />
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg w-full">
//           <h2 className="text-xl font-semibold mb-4 text-center">Center Distribution</h2>
//           <Pie data={centerPieData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;