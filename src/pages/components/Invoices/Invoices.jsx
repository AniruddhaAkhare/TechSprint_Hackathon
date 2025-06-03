import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useAuth } from "../../../context/AuthContext"; 

export default function Invoices() {
  const navigate = useNavigate();
  const { rolePermissions } = useAuth(); 
  const [invoices, setInvoices] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});

  // Define permissions for Invoices
  const canCreate = rolePermissions?.invoice?.create || false;
  const canUpdate = rolePermissions?.invoice?.update || false;
  const canDelete = rolePermissions?.invoice?.delete || false;
  const canDisplay = rolePermissions?.invoice?.display || false;
  const canSendMail = rolePermissions?.invoice?.sendMail || false; 
  const canDownload = rolePermissions?.invoice?.download || false; 

  useEffect(() => {
    if (!canDisplay) {
      navigate("/unauthorized"); // Redirect if user can't view this page
      return;
    }

    const fetchInvoicesAndStudents = async () => {
      try {
        const studentsRef = collection(db, "student");
        const studentsSnapshot = await getDocs(studentsRef);
        const studentsList = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const studentsMap = {};
        studentsList.forEach((student) => {
          const fullName = `${student.first_name} ${student.last_name}`;
          studentsMap[student.id] = fullName;
        });

        setStudentsMap(studentsMap);
        const invoicesRef = collection(db, "invoices");
        const querySnapshot = await getDocs(invoicesRef);

        const invoicesList = querySnapshot.docs.map((doc) => {
          const invoiceData = doc.data();
          return {
            id: doc.id,
            ...invoiceData,
            items: Array.isArray(invoiceData.items) ? invoiceData.items : [],
          };
        });

        const invoicesWithStudentNames = invoicesList.map((invoice) => ({
          ...invoice,
          studentName: studentsMap[invoice.student_id] || "Unknown",
        }));

        setInvoices(invoicesWithStudentNames);
      } catch (error) {
        //console.error("Error fetching invoices or students:", error);
      }
    };

    fetchInvoicesAndStudents();
  }, [canDisplay, navigate]);

  const onDelete = async (invoiceId) => {
    if (!canDelete) return; // Prevent deletion if no permission
    const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "invoices", invoiceId));
      setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== invoiceId));
      alert("Invoice deleted successfully!");
    } catch (error) {
      //console.error("Error deleting invoice: ", error);
    }
  };

  const onEdit = (invoiceId) => {
    if (!canUpdate) return; // Prevent editing if no permission
    navigate(`/invoices/updateInvoice/${invoiceId}`);
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return timestamp;
  };

  const calculateGrandTotal = (items) => {
    if (!Array.isArray(items)) return 0; // Handle undefined or non-array cases
    return items.reduce((total, item) => total + (item.total || 0), 0);
  };

  if (!canDisplay) return null; // Render nothing if no display permission

  return (
    <div className="p-20">
      <h1 className="text-2xl font-semibold mb-4">Invoices</h1>
      {canCreate && (
        <button
          onClick={() => navigate("/invoices/createInvoice")}
          className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Create Invoice
        </button>
      )}
      <div className="overflow-x-auto">
        <table className="data-table table">
          <thead className="table-secondary">
            <tr className="bg-gray-100">
              <th>Subject</th>
              <th>Status</th>
              <th>Invoice Date</th>
              <th>Grand Total</th>
              <th>Student Name</th>
              <th>Invoice Owner</th>
              {(canUpdate || canDelete || canSendMail || canDownload) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td>{invoice.course}</td>
                  <td>{invoice.status}</td>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{calculateGrandTotal(invoice.items || [])}</td>
                  <td>{invoice.studentName}</td> {/* Updated to use studentName */}
                  <td>{invoice.instructor}</td>
                  {(canUpdate || canDelete || canSendMail || canDownload) && (
                    <td className="py-3 px-4 border-b flex space-x-2">
                      {canDelete && (
                        <button
                          onClick={() => onDelete(invoice.id)}
                          className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        >
                          Delete
                        </button>
                      )}
                      {canUpdate && (
                        <button
                          onClick={() => onEdit(invoice.id)}
                          className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        >
                          Update
                        </button>
                      )}
                      {canSendMail && (
                        <button className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                          Send mail
                        </button>
                      )}
                      {canDownload && (
                        <button className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                          Download
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canUpdate || canDelete || canSendMail || canDownload ? 7 : 6} className="py-4 text-center">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}