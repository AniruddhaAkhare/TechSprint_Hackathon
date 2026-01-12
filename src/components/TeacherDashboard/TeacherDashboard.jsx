"use client"

import { useState } from "react"
import {
  BookOpen,
  Users,
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  Upload,
  PieChart,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  Brain,
  FileCheck,
  Send,
  Plus,
  Eye,
  Download,
} from "lucide-react"

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStudent, setSelectedStudent] = useState(null)

  // Sample data
  const dashboardStats = {
    activeAssignments: 12,
    pendingReviews: 5,
    totalStudents: 35,
    classesCount: 2,
    classAverage: 78,
  }

  const students = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      overall: 92,
      avatar: "JS",
      weakAreas: ["Calculus", "Physics"],
    },
    {
      id: 2,
      name: "Alice Roberts",
      email: "alice.roberts@example.com",
      overall: 85,
      avatar: "AR",
      weakAreas: ["Chemistry"],
    },
    {
      id: 3,
      name: "Michael King",
      email: "michael.king@example.com",
      overall: 78,
      avatar: "MK",
      weakAreas: ["Biology", "Math"],
    },
    { id: 4, name: "Sarah Johnson", email: "sarah.johnson@example.com", overall: 94, avatar: "SJ", weakAreas: [] },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@example.com",
      overall: 71,
      avatar: "DW",
      weakAreas: ["Physics", "Chemistry"],
    },
  ]

  const assignments = [
    { id: 1, title: "Math Quiz Chapter 5", dueDate: "2024-01-15", submissions: 28, total: 35, status: "active" },
    { id: 2, title: "Science Project", dueDate: "2024-01-20", submissions: 15, total: 35, status: "active" },
    { id: 3, title: "History Essay", dueDate: "2024-01-10", submissions: 35, total: 35, status: "completed" },
  ]

  const flaggedSubmissions = [
    { id: 1, student: "John Smith", assignment: "Math Quiz", issue: "Potential Plagiarism", severity: "high" },
    { id: 2, student: "Alice Roberts", assignment: "Science Project", issue: "Fake Signature", severity: "medium" },
  ]

  const Sidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-30 shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">TeachBot</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Dashboard Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dashboard</h3>
            <div className="space-y-1">
              <NavItem icon={BarChart3} label="Overview" id="overview" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={FileText} label="Assignments" id="assignments" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={TrendingUp} label="Analytics" id="analytics" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>

          {/* Classroom Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Classroom</h3>
            <div className="space-y-1">
              <NavItem icon={Users} label="Students" id="students" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={BookOpen} label="Resources" id="resources" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={Calendar} label="Schedule" id="schedule" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>

          {/* Communication Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Communication</h3>
            <div className="space-y-1">
              <NavItem icon={MessageSquare} label="Messages" id="messages" active={activeTab} onClick={setActiveTab} />
              <NavItem icon={Settings} label="Settings" id="settings" active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">JS</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Prof.riya</p>
            <p className="text-xs text-gray-500">teacher</p>
          </div>
        </div>
      </div>
    </div>
  )

  const NavItem = ({ icon: Icon, label, id, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
        active === id
          ? "bg-teal-50 text-teal-700 font-medium border-r-2 border-teal-500"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm">{label}</span>
    </button>
  )

  const StatCard = ({ title, value, subtitle, icon: Icon, colorClass = "teal" }) => {
    const getColorClasses = (color) => {
      switch (color) {
        case "teal":
          return "bg-teal-50 text-teal-600"
        case "blue":
          return "bg-blue-50 text-blue-600"
        case "green":
          return "bg-green-50 text-green-600"
        default:
          return "bg-teal-50 text-teal-600"
      }
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className={`p-2 rounded-lg ${getColorClasses(colorClass)}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    )
  }

  const StudentCard = ({ student }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">{student.avatar}</span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{student.name}</h4>
          <p className="text-sm text-gray-500">{student.email}</p>
          {student.weakAreas && student.weakAreas.length > 0 && (
            <p className="text-xs text-orange-600 mt-1">Weak areas: {student.weakAreas.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">Overall: {student.overall}%</p>
        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${student.overall}%` }}
          />
        </div>
      </div>
    </div>
  )

  const OverviewContent = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in your classes today.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active Assignments"
            value={dashboardStats.activeAssignments}
            subtitle={`${dashboardStats.pendingReviews} pending reviews`}
            icon={FileText}
            colorClass="teal"
          />
          <StatCard
            title="Students"
            value={dashboardStats.totalStudents}
            subtitle={`Across ${dashboardStats.classesCount} classes`}
            icon={Users}
            colorClass="blue"
          />
          <StatCard
            title="Class Average"
            value={`${dashboardStats.classAverage}%`}
            subtitle="For all assignments"
            icon={TrendingUp}
            colorClass="green"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Students Overview</h2>
          <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">See All Students</button>
        </div>
        <div className="space-y-3">
          {students.slice(0, 3).map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </div>

      {/* Flagged Submissions */}
      {flaggedSubmissions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Flagged Submissions</h2>
          <div className="space-y-3">
            {flaggedSubmissions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{item.student}</p>
                    <p className="text-sm text-gray-600">
                      {item.assignment} - {item.issue}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const AssignmentsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      {/* Upload Assignment */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Assignment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter assignment title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Mathematics</option>
                <option>Science</option>
                <option>History</option>
                <option>English</option>
              </select>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Drop files here or click to upload</p>
          </div>
          <button className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Create Assignment</button>
        </div>
      </div>

      {/* Active Assignments */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Assignments</h3>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                <p className="text-sm text-gray-600">Due: {assignment.dueDate}</p>
                <p className="text-sm text-gray-500">
                  {assignment.submissions}/{assignment.total} submissions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <Download className="w-4 h-4" />
                </button>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {assignment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Grading */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Grading & Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Brain className="w-6 h-6 text-teal-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Auto Grade Submissions</p>
              <p className="text-sm text-gray-600">AI-powered grading with OCR</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FileCheck className="w-6 h-6 text-orange-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Plagiarism Check</p>
              <p className="text-sm text-gray-600">Detect copied content</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  const AnalyticsContent = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Performance Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <PieChart className="w-16 h-16 text-gray-400" />
            <p className="ml-4 text-gray-600">Performance Chart Visualization</p>
          </div>
        </div>

        {/* Progress Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <TrendingUp className="w-16 h-16 text-gray-400" />
            <p className="ml-4 text-gray-600">Trend Line Chart</p>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <FileText className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Student Reports</p>
            <p className="text-sm text-gray-600">Individual progress</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Class Summary</p>
            <p className="text-sm text-gray-600">Overall performance</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Parent Reports</p>
            <p className="text-sm text-gray-600">For administration</p>
          </button>
        </div>
      </div>
    </div>
  )

  const StudentsContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="xl:col-span-2 space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className={`p-4 bg-white rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedStudent?.id === student.id
                  ? "border-teal-500 bg-teal-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">{student.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Overall: {student.overall}%</p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${student.overall}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Details</h3>
          {selectedStudent ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-medium text-gray-700">{selectedStudent.avatar}</span>
                </div>
                <h4 className="font-medium text-gray-900">{selectedStudent.name}</h4>
                <p className="text-sm text-gray-500">{selectedStudent.email}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Overall Performance</p>
                  <p className="text-2xl font-bold text-teal-600">{selectedStudent.overall}%</p>
                </div>

                {selectedStudent.weakAreas && selectedStudent.weakAreas.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Weak Areas</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.weakAreas.map((area, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Select a student to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const ResourcesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          <Upload className="w-4 h-4" />
          Upload Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Resources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Materials</h3>
          <div className="space-y-4">
            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload Notes</p>
            </button>
            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload Videos</p>
            </button>
          </div>
        </div>

        {/* AI Question Generator */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Question Generator</h3>
          <div className="space-y-4">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Mathematics</option>
              <option>Science</option>
              <option>History</option>
            </select>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <button className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              Generate Questions
            </button>
          </div>
        </div>

        {/* Practice Tests */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Tests</h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <p className="font-medium text-gray-900">Math Practice Test</p>
              <p className="text-sm text-gray-600">25 questions</p>
            </button>
            <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <p className="font-medium text-gray-900">Science Quiz</p>
              <p className="text-sm text-gray-600">15 questions</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const ScheduleContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          <Plus className="w-4 h-4" />
          Schedule Test
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tests & Exams</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Mathematics Final Exam</h4>
                <p className="text-sm text-gray-600">January 25, 2024 - 10:00 AM</p>
              </div>
            </div>
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">Edit</button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Science Quiz</h4>
                <p className="text-sm text-gray-600">January 20, 2024 - 2:00 PM</p>
              </div>
            </div>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium">Edit</button>
          </div>
        </div>
      </div>
    </div>
  )

  const MessagesContent = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">JS</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">John Smith</h4>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-600">Question about the math assignment...</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">AR</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">Alice Roberts</h4>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <p className="text-sm text-gray-600">Thank you for the feedback on my project...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Send Message */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h3>
          <div className="space-y-4">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Select Student</option>
              {students.map((student) => (
                <option key={student.id}>{student.name}</option>
              ))}
            </select>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32 resize-none"
              placeholder="Type your message..."
            />
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent />
      case "assignments":
        return <AssignmentsContent />
      case "analytics":
        return <AnalyticsContent />
      case "students":
        return <StudentsContent />
      case "resources":
        return <ResourcesContent />
      case "schedule":
        return <ScheduleContent />
      case "messages":
        return <MessagesContent />
      default:
        return <OverviewContent />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-full">{renderContent()}</div>
      </main>
    </div>
  )
}

export default TeacherDashboard
