import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useAuth } from "../../../context/AuthContext";
import Papa from "papaparse";

export default function BulkAddStudents() {
  const navigate = useNavigate();
  const { rolePermissions, user } = useAuth();
  const [file, setFile] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [parsedData, setParsedData] = useState([]);

  const canCreate = rolePermissions?.student?.create || false;

  // Activity logging
  const logActivity = async (batch, action, details) => {
    if (!user?.email) return;
    batch.set(doc(collection(db, "activityLogs")), {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      adminId: "N/A",
    });
  };

  // Download CSV template
  const downloadTemplate = () => {
    if (!canCreate) {
      toast.error("You don't have permission to add students");
      return;
    }
    const template = [
      {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        goal: "",
        preferred_centers: "",
        status: "enquiry",
      },
    ];
    const csv = Papa.unparse(template, {
      header: true,
      columns: [
        "first_name",
        "last_name",
        "email",
        "phone",
        "goal",
        "preferred_centers",
        "status",
      ],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_template.csv";
    link.click();
    toast.success("Template downloaded successfully");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setParsedData(result.data);
          setOpenConfirm(true);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast.error("Failed to parse CSV file");
        },
      });
    } else {
      toast.error("Please upload a valid CSV file");
    }
  };

  // Validate and upload students
  const uploadStudents = async () => {
    if (!canCreate) {
      toast.error("You don't have permission to add students");
      return;
    }
    if (parsedData.length === 0) {
      toast.error("No data to upload");
      return;
    }

    const batch = writeBatch(db);
    let validStudents = 0;
    let errors = [];

    parsedData.forEach((student, index) => {
      const {
        first_name,
        last_name,
        email,
        phone,
        goal,
        preferred_centers,
        status,
      } = student;

      // Validate required fields
      if (!first_name || !last_name || !email) {
        errors.push(`Row ${index + 2}: Missing required fields (first_name, last_name, email)`);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push(`Row ${index + 2}: Invalid email format`);
        return;
      }

      // Validate status
      const validStatuses = ["enquiry", "enrolled", "deferred", "completed"];
      if (status && !validStatuses.includes(status.toLowerCase())) {
        errors.push(`Row ${index + 2}: Invalid status. Must be one of: ${validStatuses.join(", ")}`);
        return;
      }

      // Prepare student data
      const studentRef = doc(collection(db, "student"));
      const studentData = {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : "",
        goal: goal ? goal.trim() : "",
        preferred_centers: preferred_centers ? preferred_centers.split(",").map(id => id.trim()).filter(id => id) : [],
        status: status ? status.toLowerCase() : "enquiry",
        createdAt: new Date().toISOString(),
      };

      batch.set(studentRef, studentData);
      logActivity(batch, "ADD STUDENT", { studentId: studentRef.id, email });
      validStudents++;
    });

    if (errors.length > 0) {
      toast.error(`Found ${errors.length} errors:\n${errors.join("\n")}`);
      return;
    }

    try {
      await batch.commit();
      toast.success(`Successfully added ${validStudents} students`);
      setOpenConfirm(false);
      setFile(null);
      setParsedData([]);
    } catch (error) {
      console.error("Error uploading students:", error);
      toast.error("Failed to upload students");
    }
  };

  if (!canCreate) {
    toast.error("You don't have permission to access this page");
    navigate("/studentdetails");
    return null;
  }

  return (
    <div className="p-4 fixed inset-0 left-[300px]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Bulk Add Students</h1>
          <Button
            onClick={() => navigate("/studentdetails")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Back to Student Details
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Upload Student Data</h2>
          <div className="space-y-4">
            <div>
              <Button
                onClick={downloadTemplate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download CSV Template
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Download the template, fill in the student details, and upload the CSV file below.
                Required fields: first_name, last_name, email. Optional fields: phone, goal, preferred_centers (comma-separated IDs), status (enquiry, enrolled, deferred, completed).
              </p>
            </div>
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <Dialog open={openConfirm} handler={() => setOpenConfirm(false)}>
          <DialogHeader className="text-gray-800">Confirm Upload</DialogHeader>
          <DialogBody className="text-gray-700">
            {parsedData.length > 0 ? (
              <p>
                You are about to upload {parsedData.length} student records. Please confirm to proceed.
              </p>
            ) : (
              <p>No valid data found in the uploaded file.</p>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenConfirm(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="green"
              onClick={uploadStudents}
              disabled={parsedData.length === 0}
            >
              Confirm
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
}