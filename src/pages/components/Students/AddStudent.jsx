import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function AddStudent() {
  const [isOpen, setIsOpen] = useState(true); // Control sidebar visibility
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({ street: "", area: "", city: "", state: "", zip: "", country: "" });
  const [billingAddress, setBillingAddress] = useState({ name: "", street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" });
  const [copyAddress, setCopyAddress] = useState(false);
  const [status, setStatus] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [guardianDetails, setGuardianDetails] = useState({ name: "", phone: "", email: "", relation: "", occupation: "" });
  const [admissionDate, setAdmissionDate] = useState("");
  const [courseDetails, setCourseDetails] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [installmentDetails, setInstallmentDetails] = useState([]);
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [centers, setCenters] = useState([]);
  const [goal, setGoal] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState("");
  const [courseId, setCourseId] = useState("");
  const [feeTemplates, setFeeTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setAdmissionDate(today);
    fetchCourses();
    fetchBatches();
    fetchCenters();
    fetchFeeTemplates();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Course"));
      setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Batch"));
      setBatches(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchCenters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Centers"));
      setCenters(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  const fetchFeeTemplates = async () => {
    try {
      const templateSnapshot = await getDocs(collection(db, "feeTemplates"));
      if (templateSnapshot.empty) {
        alert("No fee templates found.");
        return;
      }
      setFeeTemplates(templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error in fetching payment type:", error);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    let installmentTotal = 0;
    installmentDetails.forEach((installment) => {
      installmentTotal += Number(installment.dueAmount);
    });

    if (installmentTotal !== Number(total)) {
      alert("Installment total does not match with total amount");
      return;
    }

    try {
      const studentDocRef = await addDoc(collection(db, 'student'), {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        residential_address: address,
        billing_address: billingAddress,
        goal: goal || "Not specified",
        status: status,
        date_of_birth: Timestamp.fromDate(new Date(dateOfBirth)),
        guardian_details: guardianDetails,
        admission_date: Timestamp.fromDate(new Date(admissionDate)),
        course_details: courseDetails,
        course_id: courseId,
        education_details: educationDetails,
        experience_details: experienceDetails,
        discount: discount || 0,
        total: total || 0,
        installment_details: installmentDetails,
      });

      const studentId = studentDocRef.id;
      const enrollmentsRef = collection(db, 'enrollments');
      let paidAmt = 0;
      const today = new Date().toISOString().split("T")[0];

      let outstanding = 0;
      let overdue = 0;

      installmentDetails.forEach((installment) => {
        const amtPaid = Number(installment.paidAmount) || 0;
        const amtDue = Number(installment.dueAmount) || 0;

        paidAmt += amtPaid;

        const dueDate = new Date(installment.dueDate).toISOString().split("T")[0];
        if (dueDate > today && !installment.paidAmount) {
          outstanding += amtDue;
        } else if (dueDate <= today && !installment.paidAmount) {
          overdue += amtDue;
        }
      });

      const enrollmentData = {
        student_id: studentId,
        course_id: courseId,
        enrollment_date: Timestamp.fromDate(new Date(admissionDate)),
        fee: {
          discount: discount || 0,
          total: total || 0,
          overdue: overdue,
          paid: paidAmt,
          outstanding: outstanding,
        },
        installments: installmentDetails,
      };
      await addDoc(enrollmentsRef, enrollmentData);

      const installmentsRef = collection(db, 'installments');
      for (const installmentData of installmentDetails) {
        await addDoc(installmentsRef, {
          ...installmentData,
          student_id: studentId
        });
      }

      alert("Student added successfully!");
      navigate("/studentdetails");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student. Please try again.");
    }
  };

  const handleCopyAddress = (isChecked) => {
    setCopyAddress(isChecked);
    if (isChecked) {
      setBillingAddress({ ...address, gstNo: billingAddress.gstNo });
    } else {
      setBillingAddress({ street: "", area: "", city: "", state: "", zip: "", country: "", gstNo: "" });
    }
  };

  const addEducation = () => {
    setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', specialization: '', grade: '', passingyr: '' }]);
  };

  const handleEducationChange = (index, field, value) => {
    const newEducationDetails = [...educationDetails];
    newEducationDetails[index][field] = value;
    setEducationDetails(newEducationDetails);
  };

  const deleteEducation = (index) => {
    setEducationDetails(educationDetails.filter((_, i) => i !== index));
  };

  const addCourse = () => {
    setCourseDetails([...courseDetails, { courseName: '', batch: '', center: '', mode: '', fee: 0 }]);
  };

  const handleCourseChange = (index, field, value) => {
    const newCourseDetails = [...courseDetails];
    newCourseDetails[index][field] = value;

    if (field === 'courseName') {
      const selectedCourse = courses.find(course => course.name === value);
      newCourseDetails[index].fee = selectedCourse ? selectedCourse.fee : 0;
      setCourseId(selectedCourse ? selectedCourse.id : "");
    } else if (field === 'fee') {
      newCourseDetails[index].fee = Number(value);
    }
    setCourseDetails(newCourseDetails);
    handleFeeSummary();
  };

  const deleteCourse = (index) => {
    setCourseDetails(courseDetails.filter((_, i) => i !== index));
    handleFeeSummary();
  };

  const addExperience = () => {
    setExperienceDetails([...experienceDetails, { companyName: '', designation: '', salary: '', years: '', description: '' }]);
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperienceDetails = [...experienceDetails];
    newExperienceDetails[index][field] = value;
    setExperienceDetails(newExperienceDetails);
  };

  const deleteExperience = (index) => {
    setExperienceDetails(experienceDetails.filter((_, i) => i !== index));
  };

  const handleGuardianChange = (field, value) => {
    setGuardianDetails(prev => ({ ...prev, [field]: value }));
  };

  const addInstallment = () => {
    const newInstallment = {
      number: installmentDetails.length + 1,
      dueAmount: "",
      dueDate: "",
      paidDate: "",
      paidAmount: "",
      modeOfPayment: "",
      pdcStatus: "",
      remark: ""
    };
    setInstallmentDetails([...installmentDetails, newInstallment]);
  };

  const deleteInstallment = (index) => {
    setInstallmentDetails(installmentDetails.filter((_, i) => i !== index));
  };

  const handleInstallmentChange = (index, field, value) => {
    const newInstallmentDetails = [...installmentDetails];
    newInstallmentDetails[index][field] = value;
    setInstallmentDetails(newInstallmentDetails);
  };

  const handleFeeSummary = () => {
    let totalFees = 0;
    courseDetails.forEach((course) => {
      if (course.fee && !isNaN(course.fee)) {
        totalFees += Number(course.fee);
      }
    });
    const discountAmount = (totalFees * (discount / 100)) || 0;
    const finalTotal = totalFees - discountAmount;
    setTotal(finalTotal);
  };

  const handleTemplateChange = async (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);

    const templateSnapshot = await getDocs(collection(db, "feeTemplates"));
    const templateData = templateSnapshot.docs.find(doc => doc.id === templateId)?.data();
    if (templateData && templateData.installments) {
      setInstallmentDetails(templateData.installments);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(false);
    navigate("/studentdetails"); // Navigate back when closing
  };

  return (
    <div className="p-20">
    {/* // <div className="min-h-screen bg-gray-50 ml-80 w-[calc(100vw-20rem)]"> */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Add Student</h1>
          <button
            onClick={toggleSidebar}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleAddStudent} className="space-y-8">
          {/* Personal Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Guardian Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Guardian Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <input
                  type="text"
                  value={guardianDetails.name}
                  onChange={(e) => handleGuardianChange('name', e.target.value)}
                  placeholder="Guardian Name"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <input
                  type="text"
                  value={guardianDetails.phone}
                  onChange={(e) => handleGuardianChange('phone', e.target.value)}
                  placeholder="Guardian Phone"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={guardianDetails.email}
                  onChange={(e) => handleGuardianChange('email', e.target.value)}
                  placeholder="Guardian Email"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Relation</label>
                <input
                  type="text"
                  value={guardianDetails.relation}
                  onChange={(e) => handleGuardianChange('relation', e.target.value)}
                  placeholder="Relation"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Occupation</label>
                <input
                  type="text"
                  value={guardianDetails.occupation}
                  onChange={(e) => handleGuardianChange('occupation', e.target.value)}
                  placeholder="Occupation"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Address Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-600 mb-2">Residential Address</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Street"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.area}
                    onChange={(e) => setAddress({ ...address, area: e.target.value })}
                    placeholder="Area"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    placeholder="Zip Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={copyAddress}
                      onChange={(e) => handleCopyAddress(e.target.checked)}
                      className="mr-2"
                    />
                    Billing same as Residential
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-600 mb-2">Billing Address</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={billingAddress.name}
                    onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.street}
                    onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                    placeholder="Street"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.area}
                    onChange={(e) => setBillingAddress({ ...billingAddress, area: e.target.value })}
                    placeholder="Area"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.city}
                    onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.state}
                    onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.zip}
                    onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })}
                    placeholder="Zip Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.country}
                    onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={billingAddress.gstNo}
                    onChange={(e) => setBillingAddress({ ...billingAddress, gstNo: e.target.value })}
                    placeholder="GST No."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Educational Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Educational Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-sm font-medium text-gray-600">Level</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Institute</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Degree</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Specialization</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Grade</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Passing Year</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {educationDetails.map((edu, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <select
                          value={edu.level}
                          onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="" disabled>Select Level</option>
                          <option value="School">School</option>
                          <option value="UG">UG</option>
                          <option value="PG">PG</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={edu.institute}
                          onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                          placeholder="Institute Name"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          placeholder="Degree"
                          required
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={edu.specialization}
                          onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
                          placeholder="Specialization"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={edu.grade}
                          onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                          placeholder="Grade"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={edu.passingyr}
                          onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
                          placeholder="Year"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => deleteEducation(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addEducation}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Add Education
              </button>
            </div>
          </div>

          {/* Experience Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Experience Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-sm font-medium text-gray-600">Company Name</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Designation</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Salary</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Years</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Description</th>
                    <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experienceDetails.map((exp, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="text"
                          value={exp.companyName}
                          onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
                          placeholder="Company Name"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={exp.designation}
                          onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)}
                          placeholder="Designation"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={exp.salary}
                          onChange={(e) => handleExperienceChange(index, 'salary', e.target.value)}
                          placeholder="Salary"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={exp.years}
                          onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
                          placeholder="Years"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => deleteExperience(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addExperience}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Add Experience
              </button>
            </div>
          </div>

          {/* Goal and Status */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Goal</option>
                  <option value="Upskilling">Upskilling</option>
                  <option value="Career Switch">Career Switch</option>
                  <option value="Placement">Placement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Status</option>
                  <option value="enquiry">Enquiry</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="completed">Completed</option>
                  <option value="deferred">Deferred</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Enrollment</label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </>
  );
}