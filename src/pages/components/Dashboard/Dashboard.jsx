import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getFirestore, collection, onSnapshot, query, getDocs } from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import CheckInOut from "../../home/CheckInOut";

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
    Enquiries: [],
    PrequalifiedEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Utility to format Firebase Timestamp
  const formatTimestamp = (value) => {
    if (value?.toDate) {
      return value.toDate().toLocaleString();
    }
    return value || "N/A";
  };

  useEffect(() => {
    const collections = ["Batch", "student", "Course", "Instructor", "enquiries"];
    const unsubscribers = collections.map((col) =>
      onSnapshot(
        collection(db, col),
        (snapshot) => {
          const docsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            // Preprocess potential Timestamp fields (e.g., createdAt, startDate)
            return {
              id: doc.id,
              ...Object.keys(data).reduce((acc, key) => {
                acc[key] = data[key]?.toDate ? formatTimestamp(data[key]) : data[key];
                return acc;
              }, {}),
            };
          });

          if (col === "enquiries") {
            const prequalifiedCount = docsData.filter(
              (enquiry) => enquiry.stage === "pre-qualified"
            ).length;
            setData((prev) => ({
              ...prev,
              Enquiries: docsData,
              PrequalifiedEnquiries: prequalifiedCount,
            }));
          } else {
            setData((prev) => ({
              ...prev,
              [col]: docsData,
            }));
          }
        },
        (err) => setError(err.message)
      )
    );

    const fetchCenters = async () => {
      try {
        const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
        if (!instituteSnapshot.empty) {
          const instituteId = instituteSnapshot.docs[0].id;
          const centersQuery = query(collection(db, "instituteSetup", instituteId, "Center"));

          const unsubscribeCenters = onSnapshot(
            centersQuery,
            (snapshot) => {
              const centersData = snapshot.docs
                .map((doc) => {
                  const data = doc.data();
                  return {
                    id: doc.id,
                    ...Object.keys(data).reduce((acc, key) => {
                      acc[key] = data[key]?.toDate ? formatTimestamp(data[key]) : data[key];
                      return acc;
                    }, {}),
                    isActive: data.isActive,
                  };
                })
                .filter((center) => center.isActive);
              setData((prev) => ({ ...prev, Centers: centersData }));
              setLoading(false);
            },
            (err) => setError(err.message)
          );
          unsubscribers.push(unsubscribeCenters);
        } else {
          setLoading(false);
          setError("No institute setup found.");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCenters();

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [db]);

  const getStudentStageCounts = () => {
    return data.student.reduce((counts, student) => {
      const stage = student.stage || "enquiry";
      counts[stage] = (counts[stage] || 0) + 1;
      return counts;
    }, {});
  };

  const getCenterCounts = () => {
    return data.Centers.reduce((counts, center) => {
      counts[center.name] = (counts[center.name] || 0) + 1;
      return counts;
    }, {});
  };

  const getEnquiryStatusCounts = () => {
    const stages = [
      "pre-qualified",
      "qualified",
      "negotiation",
      "closed-won",
      "closed-lost",
      "contact-in-future",
    ];
    const counts = stages.reduce((acc, stage) => {
      acc[stage] = 0;
      return acc;
    }, {});
    data.Enquiries.forEach((enquiry) => {
      const stage = enquiry.stage || "enquiry";
      if (stages.includes(stage)) {
        counts[stage] = (counts[stage] || 0) + 1;
      }
    });
    return counts;
  };

  const handlePieClick = (event, elements, type) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const stages =
        type === "enquiries"
          ? ["pre-qualified", "qualified", "negotiation", "closed-won", "closed-lost", "contact-in-future"]
          : ["active", "inactive", "enrolled", "enquiry"];
      const selectedStage = stages[index];
      navigate(`/${type}?stage=${selectedStage}`);
    }
  };

  const studentStageCounts = getStudentStageCounts();
  const centerCounts = getCenterCounts();
  const enquiryStageCounts = getEnquiryStatusCounts();

  const studentPieData = {
    labels: ["Active", "Inactive", "Enrolled", "Enquiry"],
    datasets: [
      {
        data: [
          studentStageCounts.active || 0,
          studentStageCounts.inactive || 0,
          studentStageCounts.enrolled || 0,
          studentStageCounts.enquiry || 0,
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

  const enquiryPieData = {
    labels: ["Pre-qualified", "Qualified", "Negotiation", "Closed Won", "Closed Lost", "Contact in Future"],
    datasets: [
      {
        data: [
          enquiryStageCounts["pre-qualified"] || 0,
          enquiryStageCounts["qualified"] || 0,
          enquiryStageCounts["negotiation"] || 0,
          enquiryStageCounts["closed-won"] || 0,
          enquiryStageCounts["closed-lost"] || 0,
          enquiryStageCounts["contact-in-future"] || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500 text-sm sm:text-base p-4">Error: {error}</div>;

  return (
    <div className="min-h-screen p-4 ml-[300px] overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">Dashboard</h1>
      {/* <CheckInOut /> */}
      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: "Batches", count: data.Batch.length },
          { title: "Students", count: data.student.length },
          { title: "Courses", count: data.Course.length },
          { title: "Instructors", count: data.Instructor.length },
          { title: "Prequalified Enquiries", count: data.PrequalifiedEnquiries },
          ...(data.Centers.length > 0 ? [{ title: "Centers", count: data.Centers.length }] : []),
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
      <div className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        {data.Centers.length > 0 && (
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
        )}
        <div className="bg-white p-4 sm:p-6 rounded-md shadow-lg w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Enquiry Status Distribution</h2>
          <div className="relative w-full h-[250px] sm:h-[300px] max-w-[400px] sm:max-w-[500px] mx-auto">
            <Pie
              data={enquiryPieData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                onClick: (event, elements) => handlePieClick(event, elements, "enquiries"),
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