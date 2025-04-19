import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../../../config/firebase';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CourseAnalyticsDashboard = () => {
  const { user, rolePermissions } = useAuth();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'All',
    searchTerm: '',
  });

  const canDisplayCourses = rolePermissions?.Course?.display || false;
  const isAdmin = rolePermissions?.role === 'Admin';

  const CourseCollectionRef = collection(db, 'Course');
  const StudentCollectionRef = collection(db, 'student');
  const EnrollmentsCollectionRef = collection(db, 'enrollments');

  // Fetch data
  const fetchCourses = useCallback(async () => {
    try {
      const q = query(CourseCollectionRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const courseData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status || 'Active',
      }));
      setCourses(courseData);
    } catch (err) {
      console.error('Error fetching courses:', err.message);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const snapshot = await getDocs(StudentCollectionRef);
      const studentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentData);
    } catch (err) {
      console.error('Error fetching students:', err.message);
    }
  }, []);

  const fetchEnrollments = useCallback(async () => {
    try {
      const snapshot = await getDocs(EnrollmentsCollectionRef);
      const enrollmentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEnrollments(enrollmentData);
    } catch (err) {
      console.error('Error fetching enrollments:', err.message);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!canDisplayCourses) return;
      setLoading(true);
      await Promise.all([fetchCourses(), fetchStudents(), fetchEnrollments()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchCourses, fetchStudents, fetchEnrollments, canDisplayCourses]);

  // Filter data based on user input
  const filteredCourses = courses.filter((course) => {
    const matchesStatus = filters.status === 'All' || course.status === filters.status;
    const matchesSearch = course.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const date = enrollment.createdAt?.toDate ? enrollment.createdAt.toDate() : new Date();
    const now = new Date();
    let withinRange = true;
    if (filters.dateRange === '30days') {
      withinRange = date >= new Date(now.setDate(now.getDate() - 30));
    } else if (filters.dateRange === '6months') {
      withinRange = date >= new Date(now.setMonth(now.getMonth() - 6));
    }
    const coursesArray = Array.isArray(enrollment.courses) ? enrollment.courses : [];
    const matchesCourses = coursesArray.some((course) =>
      filteredCourses.some((c) => c.id === course.selectedCourse?.id)
    );
    return withinRange && matchesCourses;
  });

  // Analytics Calculations
  const getStudentsPerCourse = () => {
    const courseStudentCount = {};
    filteredCourses.forEach((course) => {
      courseStudentCount[course.name] = 0;
    });
    filteredEnrollments.forEach((enrollment) => {
      const coursesArray = Array.isArray(enrollment.courses) ? enrollment.courses : [];
      coursesArray.forEach((course) => {
        const courseName = filteredCourses.find((c) => c.id === course.selectedCourse?.id)?.name;
        if (courseName) {
          courseStudentCount[courseName] = (courseStudentCount[courseName] || 0) + 1;
        }
      });
    });
    return courseStudentCount;
  };

  const getFeeDistribution = () => {
    const feeRanges = { '0-5000': 0, '5001-10000': 0, '10001-20000': 0, '20001+': 0 };
    filteredEnrollments.forEach((enrollment) => {
      const coursesArray = Array.isArray(enrollment.courses) ? enrollment.courses : [];
      coursesArray.forEach((course) => {
        const fee = parseInt(filteredCourses.find((c) => c.id === course.selectedCourse?.id)?.fee) || 0;
        if (fee <= 5000) feeRanges['0-5000']++;
        else if (fee <= 10000) feeRanges['5001-10000']++;
        else if (fee <= 20000) feeRanges['10001-20000']++;
        else feeRanges['20001+']++;
      });
    });
    return feeRanges;
  };

  const getRevenuePerCourse = () => {
    const revenue = {};
    filteredCourses.forEach((course) => {
      revenue[course.name] = 0;
    });
    filteredEnrollments.forEach((enrollment) => {
      const coursesArray = Array.isArray(enrollment.courses) ? enrollment.courses : [];
      coursesArray.forEach((course) => {
        const courseData = filteredCourses.find((c) => c.id === course.selectedCourse?.id);
        if (courseData) {
          revenue[courseData.name] = (revenue[courseData.name] || 0) + (parseInt(courseData.fee) || 0);
        }
      });
    });
    return revenue;
  };

  const getEnrollmentTrend = () => {
    const monthlyCounts = {};
    filteredEnrollments.forEach((enrollment) => {
      const date = enrollment.createdAt?.toDate ? enrollment.createdAt.toDate() : new Date();
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const coursesArray = Array.isArray(enrollment.courses) ? enrollment.courses : [];
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + coursesArray.length;
    });
    return monthlyCounts;
  };

  const getTopCourses = () => {
    const courseStats = filteredCourses.map((course) => {
      const enrollmentCount = filteredEnrollments.reduce((count, enrollment) => {
        const coursesArray = Array.isArray(enrollment.courses) ? enrollment.courses : [];
        return count + coursesArray.filter((c) => c.selectedCourse?.id === course.id).length;
      }, 0);
      const revenue = enrollmentCount * (parseInt(course.fee) || 0);
      return { name: course.name, enrollments: enrollmentCount, revenue };
    });
    return courseStats.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  };

  const getStudentEngagement = () => {
    const studentCourseCount = {};
    filteredEnrollments.forEach((enrollment) => {
      const studentId = enrollment.studentId;
      const coursesArray = Array.isArray(enrollment.courses) ? enrollment.courses : [];
      studentCourseCount[studentId] = (studentCourseCount[studentId] || 0) + coursesArray.length;
    });
    const totalCourses = Object.values(studentCourseCount).reduce((sum, count) => sum + count, 0);
    const totalStudents = Object.keys(studentCourseCount).length;
    return totalStudents > 0 ? (totalCourses / totalStudents).toFixed(2) : 0;
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (!canDisplayCourses) {
    return (
      <div className="p-4 text-red-600 text-center bg-gray-50 min-h-screen">
        Access Denied: You do not have permission to view course data.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading analytics...</p>
      </div>
    );
  }

  // Chart Data
  const studentsPerCourse = getStudentsPerCourse();
  const feeDistribution = getFeeDistribution();
  const revenuePerCourse = getRevenuePerCourse();
  const enrollmentTrend = getEnrollmentTrend();
  const topCourses = getTopCourses();
  const studentEngagement = getStudentEngagement();

  const studentsPerCourseChart = {
    labels: Object.keys(studentsPerCourse),
    datasets: [{
      label: 'Number of Students',
      data: Object.values(studentsPerCourse),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const feeDistributionChart = {
    labels: Object.keys(feeDistribution),
    datasets: [{
      data: Object.values(feeDistribution),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }],
  };

  const revenueChart = {
    labels: Object.keys(revenuePerCourse),
    datasets: [{
      label: 'Revenue (₹)',
      data: Object.values(revenuePerCourse),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }],
  };

  const enrollmentTrendChart = {
    labels: Object.keys(enrollmentTrend),
    datasets: [{
      label: 'Enrollments',
      data: Object.values(enrollmentTrend),
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
      borderColor: 'rgba(255, 159, 64, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Course Management Analytics</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Course</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search by course name..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Students Per Course</h2>
            <div className="h-64">
              <Bar
                data={studentsPerCourseChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true } },
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Fee-wise Student Distribution</h2>
            <div className="h-64">
              <Pie
                data={feeDistributionChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: ${context.raw} students`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Per Course</h2>
            <div className="h-64">
              <Bar
                data={revenueChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true } },
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ₹${context.raw.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Enrollment Trend (Monthly)</h2>
            <div className="h-64">
              <Bar
                data={enrollmentTrendChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true } },
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Courses */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Top 5 Revenue-Generating Courses</h2>
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-sm font-semibold text-gray-700">Course Name</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Enrollments</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.length > 0 ? (
                  topCourses.map((course, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{course.name}</td>
                      <td className="p-3 text-gray-700">{course.enrollments}</td>
                      <td className="p-3 text-gray-700">₹{course.revenue.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-3 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Summary Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-md">
                <p className="text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-indigo-700">{filteredCourses.length}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-md">
                <p className="text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-green-700">{students.length}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-md">
                <p className="text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-700">
                  ₹{Object.values(revenuePerCourse).reduce((sum, val) => sum + val, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-md">
                <p className="text-gray-600">Avg. Courses/Student</p>
                <p className="text-2xl font-bold text-yellow-700">{studentEngagement}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalyticsDashboard;