import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../config/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Button } from "@material-tailwind/react";

export default function ViewEnquiries() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [formName, setFormName] = useState(""); // State to store form name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch form name from enquiryForms collection
        const formRef = doc(db, "enquiryForms", formId);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          setFormName(formSnap.data().name || "Unknown Form");
        } else {
          setFormName("Form Not Found");
        }

        // Fetch enquiries
        const enquiriesRef = collection(db, "enquiries");
        const q = query(enquiriesRef, where("formId", "==", formId));
        const snapshot = await getDocs(q);
        const enquiryData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEnquiries(enquiryData);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to load enquiries or form details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  if (loading) {
    return <div className="p-4 text-center">Loading enquiries...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Enquiries for Form: {formName}
        </h1>
        <Button
          color="blue"
          onClick={() => navigate("/addFormForEnquiry")}
          className="text-sm"
        >
          Back to Forms
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {enquiries.length === 0 ? (
          <p className="text-center text-gray-600">No enquiries found for this form.</p>
        ) : (
          <div className="max-h-[70vh] overflow-x-auto overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                    Sr No
                  </th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry, index) => (
                  <tr key={enquiry.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-800">{enquiry.name || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-600">{enquiry.email || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-600">{enquiry.phone || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-600">{enquiry.status || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}