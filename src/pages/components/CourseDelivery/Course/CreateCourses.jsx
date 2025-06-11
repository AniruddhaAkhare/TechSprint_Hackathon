import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { getDocs, collection, addDoc, updateDoc, doc, serverTimestamp, getDoc, deleteField } from "firebase/firestore";

const CreateCourses = ({ isOpen, toggleSidebar, course, logActivity, centers: propCenters }) => {
  const [instructors, setInstructors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [owners, setOwners] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseMode, setCourseMode] = useState("");
  const [courseVisibility, setCourseVisibility] = useState("everyone");
  const [courseStatus, setCourseStatus] = useState("Active");
  const [centerIds, setCenterIds] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [selectedCurriculums, setSelectedCurriculums] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [totalStudentCount, setTotalStudentCount] = useState(0);
  const [availableCenters, setAvailableCenters] = useState([]);
  const [availableOwners, setAvailableOwners] = useState([]);
  const [availableCurriculums, setAvailableCurriculums] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);


  // Coupon creation states
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [newCouponType, setNewCouponType] = useState("percentage");
  const [newCouponExpiryDate, setNewCouponExpiryDate] = useState("");
  const [newCouponMaxUses, setNewCouponMaxUses] = useState("");
  const [newCouponDescription, setNewCouponDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use propCenters if provided, otherwise fetch centers
        if (propCenters && propCenters.length > 0) {
          const normalizedCenters = propCenters.map((center) => ({
            id: center.id || center.centerId,
            name: center.name || `Center ${center.id || center.centerId}`,
            isActive: center.isActive || center.status === "Active",
          }));
          setCenters(normalizedCenters);
          setAvailableCenters(normalizedCenters);
        } else {
          const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
          if (!instituteSnapshot.empty) {
            const instituteId = instituteSnapshot.docs[0].id;
            const centerSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
            const activeCenters = centerSnapshot.docs
              .map((doc) => ({
                id: doc.id,
                name: doc.data().name || `Center ${doc.id}`,
                isActive: doc.data().isActive || false,
              }))
              .filter((center) => center.isActive);
            setCenters(activeCenters);
            setAvailableCenters(activeCenters);
          }
        }

        // Fetch Instructors/Owners
        const ownerSnapshot = await getDocs(collection(db, "Users"));
        const ownersList = ownerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOwners(ownersList);
        setAvailableOwners(ownersList);

        // Fetch Curriculums
        const curriculumSnapshot = await getDocs(collection(db, "curriculums"));
        const curriculumList = curriculumSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCurriculums(curriculumList);
        setAvailableCurriculums(curriculumList);

        // Fetch Coupons
        const couponSnapshot = await getDocs(collection(db, "coupons"));
        const couponList = couponSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCoupons(couponList);
        setAvailableCoupons(couponList);

        // Fetch student count if editing a course
        if (course) {
          const enrollmentsRef = collection(db, "enrollments");
          const enrollmentSnapshot = await getDocs(enrollmentsRef);
          const allEnrollments = enrollmentSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const matchedLearners = allEnrollments.filter((enrollment) =>
            enrollment.courses?.some((c) => c.selectedCourse?.id === course.id)
          );
          setTotalStudentCount(matchedLearners.length);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [course, propCenters]);

  useEffect(() => {
    if (course) {
      setCourseName(course.name || "");
      setCourseDescription(course.description || "");
      setCourseFee(course.fee || "");
      setCourseDuration(course.duration || "");
      setCourseMode(course.mode || "");

      
      setCourseStatus(course.status || "Active");
      setCourseVisibility(course.visibility || "everyone");

      setCenterIds(
        course.centerIds ||
        (course.centers?.map((c) => c.centerId) || []) ||
        (course.centerId ? [course.centerId] : [])
      );
      setSelectedOwners(course.owners || []);
      setSelectedCurriculums(course.curriculums || []);
      setSelectedCoupons(course.coupons || []);
      setAvailableCenters(centers.filter((c) => !course.centerIds?.includes(c.id) && !course.centers?.some((ca) => ca.centerId === c.id)));
      setAvailableOwners(owners.filter((o) => !course.owners?.includes(o.id)));
      setAvailableCurriculums(curriculums.filter((c) => !course.curriculums?.includes(c.id)));
      setAvailableCoupons(coupons.filter((c) => !course.coupons?.includes(c.id)));

    } else {
      resetForm();
    }
  }, [course, centers, owners, curriculums, coupons]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      name: courseName,
      description: courseDescription,
      fee: courseFee,
      duration: courseDuration,
      mode: courseMode,
      status: courseStatus,
      centerIds,
      owners: selectedOwners,
      curriculums: selectedCurriculums,
      coupons: selectedCoupons,
      visibility: courseVisibility,
      createdAt: serverTimestamp(),
    };

    try {
      if (course) {
        const courseRef = doc(db, "Course", course.id);
        const oldData = (await getDoc(courseRef)).data() || {};

        await updateDoc(courseRef, { ...courseData, centers: deleteField() });
        const changes = Object.keys(courseData).reduce((acc, key) => {
          if (key !== "createdAt" && JSON.stringify(oldData[key]) !== JSON.stringify(courseData[key])) {
            acc[key] = { oldValue: oldData[key], newValue: courseData[key] };
          }
          return acc;
        }, {});
        if (Object.keys(changes).length > 0) {
          await logActivity("Course updated", { name: courseName, changes });
        }
        alert("Course updated successfully!");
      } else {
        await addDoc(collection(db, "Course"), courseData);
        await logActivity("Course Created", { name: courseName });
        alert("Course created successfully!");
      }
      resetForm();
      toggleSidebar();
    } catch (error) {
      alert(`Failed to save course: ${error.message}`);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    if (!newCouponCode || !newCouponDiscount) {
      alert("Please fill in all required coupon fields");
      return;
    }

    const couponData = {
      code: newCouponCode.toUpperCase(),
      discount: parseFloat(newCouponDiscount),
      type: newCouponType,
      description: newCouponDescription,
      expiryDate: newCouponExpiryDate ? new Date(newCouponExpiryDate) : null,
      maxUses: newCouponMaxUses ? parseInt(newCouponMaxUses) : null,
      currentUses: 0,
      isActive: true,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "coupons"), couponData);
      const newCoupon = { id: docRef.id, ...couponData };

      setCoupons([...coupons, newCoupon]);
      setAvailableCoupons([...availableCoupons, newCoupon]);

      // Reset coupon form
      setNewCouponCode("");
      setNewCouponDiscount("");
      setNewCouponType("percentage");
      setNewCouponExpiryDate("");
      setNewCouponMaxUses("");
      setNewCouponDescription("");
      setShowCouponForm(false);

      alert("Coupon created successfully!");
    } catch (error) {
      alert(`Failed to create coupon: ${error.message}`);
    }
  };

  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setCourseFee("");
    setCourseDuration("");
    setCourseMode("");
    setCourseStatus("Active");
    setCenterIds([]);
    setSelectedOwners([]);
    setSelectedCurriculums([]);
    setSelectedCoupons([]);
    setTotalStudentCount(0);
    setAvailableCenters(centers);
    setAvailableOwners(owners);
    setAvailableCurriculums(curriculums);
    setAvailableCoupons(coupons);
    setCourseVisibility("everyone")
  };

  const handleAddCenter = (centerId) => {
    if (centerId && !centerIds.includes(centerId)) {
      setCenterIds([...centerIds, centerId]);
      setAvailableCenters(availableCenters.filter((c) => c.id !== centerId));
    }
  };

  const handleRemoveCenter = (centerId) => {
    setCenterIds(centerIds.filter((id) => id !== centerId));
    const removedCenter = centers.find((c) => c.id === centerId);
    if (removedCenter) setAvailableCenters([...availableCenters, removedCenter]);
  };

  const handleAddOwner = (ownerId) => {
    if (ownerId && !selectedOwners.includes(ownerId)) {
      setSelectedOwners([...selectedOwners, ownerId]);
      setAvailableOwners(availableOwners.filter((o) => o.id !== ownerId));
    }
  };

  const handleRemoveOwner = (ownerId) => {
    setSelectedOwners(selectedOwners.filter((id) => id !== ownerId));
    const removedOwner = owners.find((o) => o.id === ownerId);
    if (removedOwner) setAvailableOwners([...availableOwners, removedOwner]);
  };

  const handleAddCurriculum = (curriculumId) => {
    if (curriculumId && !selectedCurriculums.includes(curriculumId)) {
      setSelectedCurriculums([...selectedCurriculums, curriculumId]);
      setAvailableCurriculums(availableCurriculums.filter((c) => c.id !== curriculumId));
    }
  };

  const handleRemoveCurriculum = (curriculumId) => {
    setSelectedCurriculums(selectedCurriculums.filter((id) => id !== curriculumId));
    const removedCurriculum = curriculums.find((c) => c.id === curriculumId);
    if (removedCurriculum) setAvailableCurriculums([...availableCurriculums, removedCurriculum]);
  };

  const handleAddCoupon = (couponId) => {
    if (couponId && !selectedCoupons.includes(couponId)) {
      setSelectedCoupons([...selectedCoupons, couponId]);
      setAvailableCoupons(availableCoupons.filter((c) => c.id !== couponId));
    }
  };

  const handleRemoveCoupon = (couponId) => {
    setSelectedCoupons(selectedCoupons.filter((id) => id !== couponId));
    const removedCoupon = coupons.find((c) => c.id === couponId);
    if (removedCoupon) setAvailableCoupons([...availableCoupons, removedCoupon]);
  };




  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white w-full shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
        } p-6 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {course ? "Edit Course" : "Create Course"}
        </h1>
        <button
          type="button"
          onClick={toggleSidebar}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Name */}
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
              Course Name <span className="text-blue-500">*</span>
            </label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              placeholder="e.g., Full Stack Web Development"
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Course Description */}
          <div>
            <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Course Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="courseDescription"
              value={courseDescription}
              placeholder="e.g., Learn MERN stack from scratch"
              onChange={(e) => setCourseDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Course Fee */}
          <div>
            <label htmlFor="courseFee" className="block text-sm font-medium text-gray-700 mb-1">
              Fee <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="courseFee"
              value={courseFee}
              placeholder="e.g., 10000"
              onChange={(e) => setCourseFee(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Course Duration */}
          <div>
            <label htmlFor="courseDuration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="courseDuration"
              value={courseDuration}
              placeholder="e.g., 6 Months"
              onChange={(e) => setCourseDuration(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Course Mode */}
          <div>
            <label htmlFor="courseMode" className="block text-sm font-medium text-gray-700 mb-1">
              Mode <span className="text-red-500">*</span>
            </label>
            <select
              id="courseMode"
              value={courseMode}
              onChange={(e) => setCourseMode(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="">Select Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Course Status */}
          <div>
            <label htmlFor="courseStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="courseStatus"
              value={courseStatus}
              onChange={(e) => setCourseStatus(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Total Students */}
        <div>
          <h3 className="text-base font-semibold text-gray-700">Total Students: {totalStudentCount}</h3>
        </div>

        {/* Centers Section */}
        <div>
          <label htmlFor="centers" className="block text-sm font-medium text-gray-700 mb-1">Centers</label>
          <select
            id="centers"
            onChange={(e) => handleAddCenter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="">Select a Center</option>
            {availableCenters.map((center) => (
              <option key={center.id} value={center.id}>{center.name}</option>
            ))}
          </select>

          {centerIds.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Sr No</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Center Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {centerIds.map((centerId, index) => {
                    const center = centers.find((c) => c.id === centerId);
                    return (
                      <tr key={centerId}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{center?.name || `Center ${centerId}`}</td>
                        <td className="px-4 py-2">
                          <button type="button" onClick={() => handleRemoveCenter(centerId)} className="text-red-500 hover:text-red-700">✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Owners Section */}
        <div>
          <label htmlFor="owners" className="block text-sm font-medium text-gray-700 mb-1">Owners</label>
          <select
            id="owners"
            onChange={(e) => handleAddOwner(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="">Select an Owner</option>
            {availableOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>{owner.displayName}</option>
            ))}
          </select>

          {selectedOwners.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Sr No</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Owner Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedOwners.map((ownerId, index) => {
                    const owner = owners.find((o) => o.id === ownerId);
                    return (
                      <tr key={ownerId}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{owner?.displayName}</td>
                        <td className="px-4 py-2">
                          <button type="button" onClick={() => handleRemoveOwner(ownerId)} className="text-red-500 hover:text-red-700">✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Curriculums Section */}
        <div>
          <label htmlFor="curriculums" className="block text-sm font-medium text-gray-700 mb-1">Curriculums</label>
          <select
            id="curriculums"
            onChange={(e) => handleAddCurriculum(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="">Select Curriculum</option>
            {availableCurriculums.map((curriculum) => (
              <option key={curriculum.id} value={curriculum.id}>{curriculum.name}</option>
            ))}
          </select>

          {selectedCurriculums.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Sr No</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Curriculum Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedCurriculums.map((curriculumId, index) => {
                    const curriculum = curriculums.find((c) => c.id === curriculumId);
                    return (
                      <tr key={curriculumId}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{curriculum?.name}</td>
                        <td className="px-4 py-2">
                          <button type="button" onClick={() => handleRemoveCurriculum(curriculumId)} className="text-red-500 hover:text-red-700">✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

         <div>
            <label htmlFor="courseVisibility" className="block text-sm font-medium text-gray-700 mb-1">
              Course Visibility <span className="text-red-500">*</span>
            </label>
            <select
              id="courseVisibility"
              value={courseVisibility}
              onChange={(e) => setCourseVisibility(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="everyone">Everyone</option>
              <option value="learners">Learners Only</option>
            </select>
          </div>

        {/* Coupons Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="coupons" className="block text-sm font-medium text-gray-700">Coupons</label>
            <button
              type="button"
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
            >
              {showCouponForm ? "Cancel" : "Create New Coupon"}
            </button>
          </div>

          {/* Create Coupon Form */}
          {showCouponForm && (
            <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h4 className="text-lg font-semibold mb-3">Create New Coupon</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g., SAVE20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    placeholder="e.g., 20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newCouponExpiryDate}
                    onChange={(e) => setNewCouponExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={newCouponMaxUses}
                    onChange={(e) => setNewCouponMaxUses(e.target.value)}
                    placeholder="Leave empty for unlimited"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newCouponDescription}
                    onChange={(e) => setNewCouponDescription(e.target.value)}
                    placeholder="e.g., Early bird discount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateCoupon}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowCouponForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <select
            id="coupons"
            onChange={(e) => handleAddCoupon(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="">Select a Coupon</option>
            {availableCoupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.code} - {coupon.discount}{coupon.type === 'percentage' ? '%' : ' Fixed'}
                {coupon.description && ` (${coupon.description})`}
              </option>
            ))}
          </select>

          {selectedCoupons.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Sr No</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Coupon Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Discount</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Description</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedCoupons.map((couponId, index) => {
                    const coupon = coupons.find((c) => c.id === couponId);
                    return (
                      <tr key={couponId}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2 font-semibold text-blue-600">{coupon?.code}</td>
                        <td className="px-4 py-2">{coupon?.discount}{coupon?.type === 'percentage' ? '%' : ''}</td>
                        <td className="px-4 py-2 capitalize">{coupon?.type}</td>
                        <td className="px-4 py-2">{coupon?.description || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveCoupon(couponId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            {course ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form >
    </div >
  );
};

export default CreateCourses;