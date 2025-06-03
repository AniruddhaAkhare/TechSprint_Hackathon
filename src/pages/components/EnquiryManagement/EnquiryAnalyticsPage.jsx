import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { db } from "../../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const initialColumns = {
  "pre-qualified": { name: "Pre Qualified", items: [], count: 0 },
  "qualified": { name: "Qualified", items: [], count: 0 },
  "negotiation": { name: "Negotiation", items: [], count: 0 },
  "closed-won": { name: "Closed Won", items: [], count: 0 },
  "closed-lost": { name: "Closed Lost", items: [], count: 0 },
  "contact-in-future": { name: "Contact in Future", items: [], count: 0 },
};

const EnquiryAnalyticsPage = () => {
  const { user } = useAuth();
  const [columns, setColumns] = useState(initialColumns);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: "all",
    branch: "",
    course: "",
    source: "",
    instructor: "",
    tags: [],
  });
  const [pendingFilters, setPendingFilters] = useState({
    dateRange: "all",
    branch: "",
    course: "",
    source: "",
    instructor: "",
    tags: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sourceOptions = ["Instagram", "Friend", "Family", "LinkedIn", "College"];
  const tagOptions = ["High Priority", "Follow Up", "Hot Lead", "Career Change", "Corporate Enquiry", "International"];
  const [instituteId, setInstituteId] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
        if (!user) {
          // setError('No user is signed in');
          // setLoading(false);
          return;
        }
  
        try {
          // Fetch user data and institute ID
          const userDocRef = doc(db, 'Users', user.uid);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            
            const institute = 'RDJ9wMXGrIUk221MzDxP';
            if (institute) {
              setInstituteId('RDJ9wMXGrIUk221MzDxP');
              // localStorage.setItem('instituteId', institute);
            } else {
              // setError('Institute ID not found in user document');
            }
          } else {
            // setError('User data not found');
          }
        } catch (err) {
          // setError('Failed to fetch data: ' + err.message);
        } finally {
          // setLoading(false);
        }
      };
  
      fetchData();
    }, [user]);

  // Fetch Courses
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Course"),
      (snapshot) => {
        const coursesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesData);
      },
      (error) => {
        // //console.error("Error fetching courses:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Branches
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "instituteSetup", 'RDJ9wMXGrIUk221MzDxP', "Center"),
      (snapshot) => {
        const branchesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBranches(branchesData);
      },
      (error) => {
        // //console.error("Error fetching branches:", error);
      }
    );
    return () => unsubscribe();
  }, [instituteId]);

  // Fetch Instructors
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Users"),
      (snapshot) => {
        const instructorsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInstructors(instructorsData);
      },
      (error) => {
        // //console.error("Error fetching instructors:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Enquiries
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "enquiries"),
      (snapshot) => {
        const enquiries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setColumns((prevColumns) => {
          const updatedColumns = Object.keys(initialColumns).reduce((acc, key) => {
            acc[key] = { ...initialColumns[key], items: [] };
            return acc;
          }, {});

          enquiries.forEach((enquiry) => {
            const columnId = enquiry.stage?.toLowerCase().replace(/\s+/g, "-") || "pre-qualified";
            if (updatedColumns[columnId]) {
              updatedColumns[columnId].items.push(enquiry);
            } else {
              console.warn(`Invalid stage "${columnId}" for enquiry:`, enquiry);
            }
          });
          setIsLoading(false);
          return { ...updatedColumns };
        });
      },
      (error) => {
        // //console.error("Error fetching enquiries:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const isValidDate = (date) => {
    return date && !isNaN(new Date(date).getTime());
  };

  const applyFilters = (enquiries) => {
    const filtered = enquiries.filter((enquiry) => {
      // Date Filter (only apply if dateRange is not "all")
      let dateMatch = true;
      if (filters.dateRange !== "all") {
        const createdAt = enquiry.createdAt ? new Date(enquiry.createdAt) : null;
        if (!isValidDate(createdAt)) {
          console.warn(`Invalid createdAt for enquiry ${enquiry.id}:`, enquiry.createdAt);
          return false;
        }
        const now = new Date();
        if (filters.dateRange === "last7days") {
          dateMatch = createdAt >= new Date(now.setDate(now.getDate() - 7));
        } else if (filters.dateRange === "last30days") {
          dateMatch = createdAt >= new Date(now.setDate(now.getDate() - 30));
        } else if (filters.dateRange === "lastYear") {
          dateMatch = createdAt >= new Date(now.setFullYear(now.getFullYear() - 1));
        }
      }

      // Other Filters
      const branchMatch = !filters.branch || enquiry.branch === filters.branch;
      const courseMatch = !filters.course || enquiry.course === filters.course;
      const sourceMatch = !filters.source || enquiry.source === filters.source;
      const instructorMatch = !filters.instructor || enquiry.assignTo === filters.instructor;
      const tagsMatch = filters.tags.length === 0 || filters.tags.every((tag) => enquiry.tags?.includes(tag));

      return dateMatch && branchMatch && courseMatch && sourceMatch && instructorMatch && tagsMatch;
    });
    return filtered;
  };

  // Apply Filters Function
  const applyPendingFilters = () => {
    setFilters(pendingFilters);
    setIsFilterOpen(false); // Close filter panel after applying
  };

  // Reset Filters Function
  const resetFilters = () => {
    const initialFilters = {
      dateRange: "all",
      branch: "",
      course: "",
      source: "",
      instructor: "",
      tags: [],
    };
    setFilters(initialFilters);
    setPendingFilters(initialFilters);
    setIsFilterOpen(false); // Close filter panel after resetting
  };

  // Handle Tag Toggle for Pending Filters
  const handleTagToggle = (tag) => {
    setPendingFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  // Prepare filtered enquiries
  const allEnquiries = applyFilters(Object.values(columns).flatMap((column) => column.items));

  // Analytics Calculations
  const stageData = Object.entries(columns).map(([key, column]) => ({
    name: column.name,
    count: applyFilters(column.items).length,
  }));

  const sourceData = sourceOptions
    .map((source) => ({
      name: source,
      value: allEnquiries.filter((item) => item.source === source).length,
    }))
    .filter((data) => data.value > 0);

  const courseData = courses
    .map((course) => ({
      name: course.name,
      count: allEnquiries.filter((item) => item.course === course.name).length,
    }))
    .filter((data) => data.count > 0);

  const branchData = branches
    .map((branch) => ({
      name: branch.name,
      count: allEnquiries.filter((item) => item.branch === branch.name).length,
    }))
    .filter((data) => data.count > 0);

  const tagData = tagOptions
    .map((tag) => ({
      name: tag,
      count: allEnquiries.filter((item) => item.tags?.includes(tag)).length,
    }))
    .filter((data) => data.count > 0);

  const timeSeriesData = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split("T")[0];
    timeSeriesData.push({
      date: dateString,
      enquiries: allEnquiries.filter((item) => {
        if (!item.createdAt || !isValidDate(item.createdAt)) {
          return false;
        }
        const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
        return itemDate === dateString;
      }).length,
    });
  }

  const totalEnquiries = allEnquiries.length;
  const closedWon = applyFilters(columns["closed-won"]?.items || []).length;
  const conversionRate = totalEnquiries > 0 ? ((closedWon / totalEnquiries) * 100).toFixed(2) : 0;
  const totalAmount = allEnquiries.reduce((sum, item) => sum + (item.amount || 0), 0);
  const avgAmount = totalEnquiries > 0 ? (totalAmount / totalEnquiries).toFixed(2) : 0;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex items-center justify-center">
        <p className="text-gray-500">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 fixed inset-0 left-[300px] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Enquiry Analytics</h1>
          <p className="text-gray-500 text-sm sm:text-base">In-depth analysis of enquiry performance and trends</p>
        </div>
        <Link
          to="/enquiry"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back
        </Link>
      </div>

      {/* Filter Section */}
      <div className="relative mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <FaFilter />
          Filters
          <FaChevronDown />
        </button>
        {isFilterOpen && (
          <div className="absolute z-10 mt-2 w-full max-w-2xl bg-white border border-gray-300 rounded-md shadow-lg p-4">
            <h3 className="text-lg font-medium mb-4">Filter Analytics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Range</label>
                <select
                  value={pendingFilters.dateRange}
                  onChange={(e) => setPendingFilters({ ...pendingFilters, dateRange: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="lastYear">Last Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch</label>
                <select
                  value={pendingFilters.branch}
                  onChange={(e) => setPendingFilters({ ...pendingFilters, branch: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <select
                  value={pendingFilters.course}
                  onChange={(e) => setPendingFilters({ ...pendingFilters, course: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm fontpatients: none;">Source</label>
                <select
                  value={pendingFilters.source}
                  onChange={(e) => setPendingFilters({ ...pendingFilters, source: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sources</option>
                  {sourceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned Instructor</label>
                <select
                  value={pendingFilters.instructor}
                  onChange={(e) => setPendingFilters({ ...pendingFilters, instructor: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Instructors</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.displayName}>
                      {instructor.displayName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={applyPendingFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply Filter
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 border rounded-full text-sm ${pendingFilters.tags.includes(tag)
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Dashboard */}
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Key Metrics</h2>
          {totalEnquiries === 0 ? (
            <p className="text-gray-500">No enquiries match the selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Total Enquiries</p>
                <p className="text-2xl font-bold">{totalEnquiries}</p>
              </div>
              <div>
                <p className="text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
              </div>
              <div>
                <p className="text-gray-600">Average Amount</p>
                <p className="text-2xl font-bold">₹{avgAmount}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stage Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Enquiries by Stage</h2>
          {stageData.every((data) => data.count === 0) ? (
            <p className="text-gray-500">No data available for stage distribution.</p>
          ) : (
            <BarChart width={600} height={300} data={stageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          )}
        </div>

        {/* Source Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Enquiries by Source</h2>
          {sourceData.length === 0 ? (
            <p className="text-gray-500">No data available for source distribution.</p>
          ) : (
            <PieChart width={600} height={300}>
              <Pie
                data={sourceData}
                cx={300}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </div>

        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Enquiries by Course</h2>
          {courseData.length === 0 ? (
            <p className="text-gray-500">No data available for course distribution.</p>
          ) : (
            <BarChart width={600} height={300} data={courseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          )}
        </div>

        {/* Branch Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Enquiries by Branch</h2>
          {branchData.length === 0 ? (
            <p className="text-gray-500">No data available for branch distribution.</p>
          ) : (
            <BarChart width={600} height={300} data={branchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00c49f" />
            </BarChart>
          )}
        </div>

        {/* Tag Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Enquiries by Tag</h2>
          {tagData.length === 0 ? (
            <p className="text-gray-500">No data available for tag distribution.</p>
          ) : (
            <BarChart width={600} height={300} data={tagData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ffbb28" />
            </BarChart>
          )}
        </div>

        {/* Time Series */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Enquiry Trends Over Time</h2>
          {timeSeriesData.every((data) => data.enquiries === 0) ? (
            <p className="text-gray-500">No data available for time series.</p>
          ) : (
            <LineChart width={600} height={300} data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="enquiries" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryAnalyticsPage;