// // // // // import React, { useEffect, useState } from "react";
// // // // // import { db } from "../../../../config/firebase";
// // // // // import {
// // // // //   collection,
// // // // //   getDocs,
// // // // //   setDoc,
// // // // //   doc,
// // // // //   getDoc,
// // // // //   query,
// // // // //   where,
// // // // // } from "firebase/firestore";
// // // // // import { useParams, useNavigate } from "react-router-dom";
// // // // // import { useAuth } from "../../../../context/AuthContext";
// // // // // import {
// // // // //   Button,
// // // // //   Typography,
// // // // // //   ToastContainer,
// // // // // //   toast,
// // // // // } from "@mui/material";
// // // // // import { ToastContainer, toast } from "react-toastify";
// // // // // import sendWelcomeEmail from "../../../../services/sendWelcomeEmail";
// // // // // import PreferredCenters from "./PreferredCenters";
// // // // // import CourseEntryForm from "./CourseEntryForm";
// // // // // import { logActivity } from "./utils";
// // // // // import "react-toastify/dist/ReactToastify.css";
// // // // // import { s3Client } from "../../../../config/aws-config";
// // // // // import { Upload } from "@aws-sdk/lib-storage";

// // // // // const AddCourse = () => {
// // // // //   const { studentId } = useParams();
// // // // //   const navigate = useNavigate();
// // // // //   const { user, rolePermissions } = useAuth();
// // // // //   const [courses, setCourses] = useState([]);
// // // // //   const [courseEntries, setCourseEntries] = useState([]);
// // // // //   const [financePartners, setFinancePartners] = useState([]);
// // // // //   const [preferredCenters, setPreferredCenters] = useState([]);
// // // // //   const [centers, setCenters] = useState([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [isOpen, setIsOpen] = useState(false);
// // // // //   const [existingCourses, setExistingCourses] = useState([]);

// // // // //   const [documents, setDocuments]=useState({
// // // // //     bankStatement: null,
// // // // //     paymentSlip: null,
// // // // //     aadharCard: null,
// // // // //     panCard: null
// // // // //   });
// // // // //   const [uploadProgress, setUploadProgress] = useState({});


// // // // //   // Permission checks
// // // // //   const canDisplay = rolePermissions?.enrollments?.display || false;
// // // // //   const canCreate = rolePermissions?.enrollments?.create || false;
// // // // //   const canUpdate = rolePermissions?.enrollments?.update || false;
// // // // //   const canDelete = rolePermissions?.enrollments?.delete || false;

// // // // //   const defaultFinanceDetails = {
// // // // //     financePartner: "",
// // // // //     contactPerson: "",
// // // // //     scheme: "",
// // // // //     loanAmount: 0,
// // // // //     downPayment: 0,
// // // // //     downPaymentDate: "",
// // // // //     applicantName: "",
// // // // //     relationship: "",
// // // // //     loanStatus: "Pending",
// // // // //     bankStatement: null,
// // // // //     paymentSlip: null,
// // // // //     aadharCard: null,
// // // // //     panCard: null,
// // // // //     registration: {
// // // // //       amount: "",
// // // // //       date: "",
// // // // //       receivedBy: "",
// // // // //       paymentMethod: "",
// // // // //       remark: "",
// // // // //       status: "Pending",
// // // // //     },
// // // // //     discountType: "",
// // // // //     discountValue: "",
// // // // //     discountReason: "",
// // // // //     feeAfterDiscount: 0,
// // // // //   };

// // // // //   const defaultEntry = {
// // // // //     selectedCourse: "",
// // // // //     mode: "",
// // // // //     feeTemplate: "",
// // // // //     installmentDetails: [
// // // // //       {
// // // // //         number: "",
// // // // //         dueDate: "",
// // // // //         dueAmount: "",
// // // // //         paidDate: "",
// // // // //         paidAmount: "",
// // // // //         paymentMode: "",
// // // // //         pdcStatus: "",
// // // // //         receivedBy: "",
// // // // //         remark: "",
// // // // //         status: "Pending",
// // // // //       },
// // // // //     ],
// // // // //     fullFeesDetails: {
// // // // //       discountType: "",
// // // // //       discountValue: "",
// // // // //       discountReason: "",
// // // // //       feeAfterDiscount: 0,
// // // // //       totalFees: 0,
// // // // //       registration: {
// // // // //         amount: "",
// // // // //         date: "",
// // // // //         receivedBy: "",
// // // // //         paymentMethod: "",
// // // // //         remark: "",
// // // // //         status: "Pending",
// // // // //       },
// // // // //       finalPayment: {
// // // // //         amount: "",
// // // // //         date: "",
// // // // //         receivedBy: "",
// // // // //         paymentMethod: "",
// // // // //         remark: "",
// // // // //         status: "Pending",
// // // // //       },
// // // // //     },
// // // // //     financeDetails: { ...defaultFinanceDetails },
// // // // //     registration: {
// // // // //       amount: "",
// // // // //       date: "",
// // // // //       receivedBy: "",
// // // // //       paymentMethod: "",
// // // // //       remark: "",
// // // // //       status: "Pending",
// // // // //     },
// // // // //     freeReason: "",
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     if (!canDisplay) {
// // // // //       toast.error("You don't have permission to view this page");
// // // // //       logActivity("UNAUTHORIZED_ACCESS_ATTEMPT", { page: "AddCourse" }, user);
// // // // //       navigate("/unauthorized");
// // // // //       return;
// // // // //     }

// // // // //     const fetchData = async () => {
// // // // //       try {
// // // // //         setLoading(true);

// // // // //         // Fetch student data
// // // // //         const studentDoc = await getDoc(doc(db, "student", studentId));
// // // // //         let studentPreferredCenters = [];
// // // // //         if (studentDoc.exists()) {
// // // // //           const studentData = studentDoc.data();
// // // // //           studentPreferredCenters = studentData.preferred_centers || [];
// // // // //           if (!Array.isArray(studentPreferredCenters)) {
// // // // //             console.warn(
// // // // //               "preferred_centers is not an array, defaulting to empty array:",
// // // // //               studentPreferredCenters
// // // // //             );
// // // // //             studentPreferredCenters = [];
// // // // //           }
// // // // //           setPreferredCenters(studentPreferredCenters);
// // // // //           logActivity(
// // // // //             "FETCH_STUDENT_SUCCESS",
// // // // //             {
// // // // //               preferredCenters: studentPreferredCenters.length,
// // // // //               studentId,
// // // // //             },
// // // // //             user
// // // // //           );
// // // // //         } else {
// // // // //           toast.error("Student not found");
// // // // //           logActivity("FETCH_STUDENT_NOT_FOUND", { studentId }, user);
// // // // //           setPreferredCenters([]);
// // // // //         }

// // // // //         // Fetch centers
// // // // //         const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
// // // // //         if (instituteSnapshot.empty) {
// // // // //           console.error("No instituteSetup document found");
// // // // //           setCenters([]);
// // // // //           logActivity(
// // // // //             "FETCH_CENTERS_WARNING",
// // // // //             { message: "No instituteSetup found", studentId },
// // // // //             user
// // // // //           );
// // // // //         } else {
// // // // //           const instituteId = instituteSnapshot.docs[0].id;
// // // // //           const centerQuery = query(
// // // // //             collection(db, "instituteSetup", instituteId, "Center"),
// // // // //             where("isActive", "==", true)
// // // // //           );
// // // // //           const centerSnapshot = await getDocs(centerQuery);
// // // // //           const fetchedCenters = centerSnapshot.docs.map((doc) => ({
// // // // //             id: doc.id,
// // // // //             ...doc.data(),
// // // // //           }));
// // // // //           setCenters(fetchedCenters);
// // // // //           logActivity(
// // // // //             "FETCH_CENTERS_SUCCESS",
// // // // //             { count: fetchedCenters.length, studentId },
// // // // //             user
// // // // //           );
// // // // //         }

// // // // //         // Fetch courses
// // // // //         const coursesSnapshot = await getDocs(collection(db, "Course"));
// // // // //         const fetchedCourses = coursesSnapshot.docs.map((doc) => ({
// // // // //           id: doc.id,
// // // // //           ...doc.data(),
// // // // //         }));
// // // // //         setCourses(fetchedCourses);
// // // // //         logActivity(
// // // // //           "FETCH_COURSES_SUCCESS",
// // // // //           { count: fetchedCourses.length, studentId },
// // // // //           user
// // // // //         );

// // // // //         // Fetch finance partners
// // // // //         const financePartnersSnapshot = await getDocs(
// // // // //           collection(db, "FinancePartner")
// // // // //         );
// // // // //         const activeFinancePartners = financePartnersSnapshot.docs
// // // // //           .map((doc) => ({ id: doc.id, ...doc.data() }))
// // // // //           .filter((partner) => partner.status === "Active");
// // // // //         setFinancePartners(activeFinancePartners);
// // // // //         logActivity(
// // // // //           "FETCH_FINANCE_PARTNERS_SUCCESS",
// // // // //           { count: activeFinancePartners.length, studentId },
// // // // //           user
// // // // //         );

// // // // //         // Fetch existing enrollment
// // // // //         const enrollmentDoc = await getDoc(doc(db, "enrollments", studentId));
// // // // //         if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
// // // // //           const existingCourses = enrollmentDoc.data().courses.map((course) => ({
// // // // //             ...defaultEntry,
// // // // //             ...course,
// // // // //             selectedCourse:
// // // // //               fetchedCourses.find((c) => c.id === course.selectedCourse?.id) ||
// // // // //               course.selectedCourse ||
// // // // //               "",
// // // // //             financeDetails: {
// // // // //               ...defaultFinanceDetails,
// // // // //               ...course.financeDetails,
// // // // //               scheme: course.financeDetails?.scheme || "",
// // // // //               registration: {
// // // // //                 ...defaultFinanceDetails.registration,
// // // // //                 ...course.financeDetails?.registration,
// // // // //                 status: course.financeDetails?.registration?.status || "Pending",
// // // // //               },
// // // // //             },
// // // // //             registration: {
// // // // //               ...defaultEntry.registration,
// // // // //               ...course.registration,
// // // // //               status: course.registration?.status || "Pending",
// // // // //             },
// // // // //             installmentDetails: course.installmentDetails?.map((installment) => ({
// // // // //               ...defaultEntry.installmentDetails[0],
// // // // //               ...installment,
// // // // //               status: installment.status || "Pending",
// // // // //             })) || defaultEntry.installmentDetails,
// // // // //             fullFeesDetails: {
// // // // //               ...defaultEntry.fullFeesDetails,
// // // // //               ...course.fullFeesDetails,
// // // // //               registration: {
// // // // //                 ...defaultEntry.fullFeesDetails.registration,
// // // // //                 ...course.fullFeesDetails?.registration,
// // // // //                 status:
// // // // //                   course.fullFeesDetails?.registration?.status || "Pending",
// // // // //               },
// // // // //               finalPayment: {
// // // // //                 ...defaultEntry.fullFeesDetails.finalPayment,
// // // // //                 ...course.fullFeesDetails?.finalPayment,
// // // // //                 status:
// // // // //                   course.fullFeesDetails?.finalPayment?.status || "Pending",
// // // // //               },
// // // // //             },
// // // // //             freeReason: course.freeReason || "",
// // // // //           }));
// // // // //           setCourseEntries(existingCourses);
// // // // //           setExistingCourses(existingCourses);
// // // // //           logActivity(
// // // // //             "FETCH_ENROLLMENT_SUCCESS",
// // // // //             { courseCount: existingCourses.length, studentId },
// // // // //             user
// // // // //           );
// // // // //         } else {
// // // // //           setCourseEntries([defaultEntry]);
// // // // //           setExistingCourses([]);
// // // // //           logActivity("FETCH_ENROLLMENT_NOT_FOUND", { studentId }, user);
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error("Error fetching data: ", error);
// // // // //         toast.error("Failed to fetch data");
// // // // //         logActivity(
// // // // //           "FETCH_DATA_ERROR",
// // // // //           { error: error.message, studentId },
// // // // //           user
// // // // //         );
// // // // //         setCourseEntries([defaultEntry]);
// // // // //         setPreferredCenters([]);
// // // // //         setCenters([]);
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //         setTimeout(() => setIsOpen(true), 10);
// // // // //       }
// // // // //     };

// // // // //     fetchData();
// // // // //   }, [studentId, canDisplay, navigate, user]);

// // // // //   const addCourseEntry = () => {
// // // // //     if (!canCreate) {
// // // // //       toast.error("You don't have permission to add courses");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_CREATE_ATTEMPT",
// // // // //         { action: "addCourseEntry", studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     setCourseEntries([...courseEntries, defaultEntry]);
// // // // //     logActivity("ADD_COURSE_ENTRY", { studentId }, user);
// // // // //   };

// // // // //   const removeCourseEntry = (index) => {
// // // // //     if (!canDelete) {
// // // // //       toast.error("You don't have permission to remove courses");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_DELETE_ATTEMPT",
// // // // //         { action: "removeCourseEntry", index, studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     setCourseEntries(courseEntries.filter((_, i) => i !== index));
// // // // //     logActivity("REMOVE_COURSE_ENTRY", { index, studentId }, user);
// // // // //   };

// // // // //   const handleChange = (index, field, value) => {
// // // // //     if (!canUpdate) {
// // // // //       toast.error("You don't have permission to update course details");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // // //         { action: "updateCourseEntry", field, studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // // //       if (i === index) {
// // // // //         if (field === "selectedCourse") {
// // // // //           logActivity(
// // // // //             "CHANGE_COURSE",
// // // // //             { courseId: value?.id, field, studentId },
// // // // //             user
// // // // //           );
// // // // //           return {
// // // // //             ...entry,
// // // // //             [field]: value,
// // // // //             fullFeesDetails: {
// // // // //               ...entry.fullFeesDetails,
// // // // //               totalFees: value.fee || 0,
// // // // //             },
// // // // //             financeDetails: {
// // // // //               ...entry.financeDetails,
// // // // //               feeAfterDiscount: value.fee || 0,
// // // // //             },
// // // // //           };
// // // // //         } else if (field === "freeReason") {
// // // // //           logActivity("CHANGE_FIELD", { field, value, studentId }, user);
// // // // //           return { ...entry, freeReason: value };
// // // // //         }
// // // // //         return { ...entry, [field]: value };
// // // // //       }
// // // // //       return entry;
// // // // //     });
// // // // //     logActivity("CHANGE_FREE_COURSE", { field, value, studentId }, user);
// // // // //     setCourseEntries(updatedEntries);
// // // // //   };

// // // // //   const handleFullFeesChange = (index, field, subField, value) => {
// // // // //     if (!canUpdate) {
// // // // //       toast.error("You don't have permission to update course details");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // // //         { action: "updateFullFees", field, subField, studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // // //       if (i === index) {
// // // // //         const fullFeesDetails = { ...entry.fullFeesDetails };
// // // // //         if (field === "discountType") {
// // // // //           fullFeesDetails.discountType = value;
// // // // //         } else if (field === "discountValue") {
// // // // //           fullFeesDetails.discountValue = value;
// // // // //           const totalFees = fullFeesDetails.totalFees || 0;
// // // // //           fullFeesDetails.feeAfterDiscount =
// // // // //             fullFeesDetails.discountType === "percentage"
// // // // //               ? totalFees - totalFees * (Number(value) / 100)
// // // // //               : totalFees - Number(value);
// // // // //         } else if (field === "discountReason") {
// // // // //           fullFeesDetails.discountReason = value;
// // // // //         } else {
// // // // //           fullFeesDetails[field] = {
// // // // //             ...fullFeesDetails[field],
// // // // //             [subField]: value,
// // // // //           };
// // // // //         }
// // // // //         return { ...entry, fullFeesDetails };
// // // // //       }
// // // // //       return entry;
// // // // //     });
// // // // //     logActivity(
// // // // //       "CHANGE_FULL_FEES",
// // // // //       { field, subField, value, studentId },
// // // // //       user
// // // // //     );
// // // // //     setCourseEntries(updatedEntries);
// // // // //   };

// // // // //   const handleRegistrationChange = (index, field, value) => {
// // // // //     if (!canUpdate) {
// // // // //       toast.error("You don't have permission to update course details");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // // //         { action: "updateRegistration", field, studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // // //       if (i === index) {
// // // // //         logActivity(
// // // // //           "CHANGE_REGISTRATION",
// // // // //           { field, value, studentId },
// // // // //           user
// // // // //         );
// // // // //         return {
// // // // //           ...entry,
// // // // //           registration: { ...entry.registration, [field]: value },
// // // // //         };
// // // // //       }
// // // // //       return entry;
// // // // //     });
// // // // //     setCourseEntries(updatedEntries);
// // // // //   };

// // // // //   const handleInstallmentChange = (courseIndex, installmentIndex, field, value) => {
// // // // //     if (!canUpdate) {
// // // // //       toast.error("You don't have permission to update course details");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // // //         { action: "updateInstallment", field, studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // // //       if (i === courseIndex) {
// // // // //         const updatedDetails = entry.installmentDetails.map(
// // // // //           (installment, j) => {
// // // // //             if (j === installmentIndex) {
// // // // //               return { ...installment, [field]: value };
// // // // //             }
// // // // //             return installment;
// // // // //           }
// // // // //         );
// // // // //         return { ...entry, installmentDetails: updatedDetails };
// // // // //       }
// // // // //       return entry;
// // // // //     });
// // // // //     logActivity(
// // // // //       "CHANGE_INSTALLMENT",
// // // // //       { installmentIndex, field, value, studentId },
// // // // //       user
// // // // //     );
// // // // //     setCourseEntries(updatedEntries);
// // // // //   };

// // // // //   const addInstallment = (index) => {
// // // // //     if (!canUpdate) {
// // // // //       toast.error("You don't have permission to update course details");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // // //         { action: "addInstallment", studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // // //       if (i === index) {
// // // // //         logActivity("ADD_INSTALLMENT", { courseIndex: index, studentId }, user);
// // // // //         return {
// // // // //           ...entry,
// // // // //           installmentDetails: [
// // // // //             ...entry.installmentDetails,
// // // // //             {
// // // // //               number: "",
// // // // //               dueDate: "",
// // // // //               dueAmount: "",
// // // // //               paidDate: "",
// // // // //               paidAmount: "",
// // // // //               paymentMode: "",
// // // // //               pdcStatus: "",
// // // // //               receivedBy: "",
// // // // //               remark: "",
// // // // //               status: "Pending",
// // // // //             },
// // // // //           ],
// // // // //         };
// // // // //       }
// // // // //       return entry;
// // // // //     });
// // // // //     setCourseEntries(updatedEntries);
// // // // //   };

// // // // //   const removeInstallment = (courseIndex, installmentIndex) => {
// // // // //     if (!canUpdate) {
// // // // //       toast.error("You don't have permission to update course details");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // // //         { action: "removeInstallment", installmentIndex, studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // // //       if (i === courseIndex) {
// // // // //         logActivity(
// // // // //           "REMOVE_INSTALLMENT",
// // // // //           { courseIndex, installmentIndex, studentId },
// // // // //           user
// // // // //         );
// // // // //         return {
// // // // //           ...entry,
// // // // //           installmentDetails: entry.installmentDetails.filter(
// // // // //             (_, j) => j !== installmentIndex
// // // // //           ),
// // // // //         };
// // // // //       }
// // // // //       return entry;
// // // // //     });
// // // // //     setCourseEntries(updatedEntries);
// // // // //   };

// // // // //   const handleFinanceChange = (index, field, subField, value) => {
// // // // //     if (!canUpdate) {
// // // // //       toast.error("You don't have permission to update course details");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // // //         { action: "updateFinance", field, subField, studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // // //       if (i === index) {
// // // // //         const financeDetails = { ...entry.financeDetails };
// // // // //         if (field === "discountType") {
// // // // //           financeDetails.discountType = value;
// // // // //         } else if (field === "discountValue") {
// // // // //           financeDetails.discountValue = value;
// // // // //           const totalFees = entry.fullFeesDetails.totalFees || 0;
// // // // //           financeDetails.feeAfterDiscount =
// // // // //             financeDetails.discountType === "percentage"
// // // // //               ? totalFees - totalFees * (Number(value) / 100)
// // // // //               : totalFees - Number(value);
// // // // //         } else if (field === "discountReason") {
// // // // //           financeDetails.discountReason = value;
// // // // //         } else if (subField) {
// // // // //           financeDetails[field] = { ...financeDetails[field], [subField]: value };
// // // // //         } else {
// // // // //           financeDetails[field] = value;
// // // // //         }
// // // // //         if (field === "financePartner") {
// // // // //           financeDetails.contactPerson = "";
// // // // //           financeDetails.scheme = "";
// // // // //         }
// // // // //         return { ...entry, financeDetails };
// // // // //       }
// // // // //       return entry;
// // // // //     });
// // // // //     logActivity(
// // // // //       "CHANGE_FINANCE",
// // // // //       { field, subField, value, studentId },
// // // // //       user
// // // // //     );
// // // // //     setCourseEntries(updatedEntries);
// // // // //   };

// // // // //   const handleFileChange = (index, field, event) => {
// // // // //     if (!canUpdate) {
// // // // //       toast.error("You don't have permission to update course details");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // // //         { action: "uploadFile", field, studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     const file = event.target.files[0];
// // // // //     if (file) {
// // // // //       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
// // // // //       if (!allowedTypes.includes(file.type)) {
// // // // //         toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
// // // // //         return;
// // // // //       }
// // // // //       if (file.size > 5 * 1024 * 1024) {
// // // // //         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
// // // // //         return;
// // // // //       }


// // // // //       const updatedEntries = courseEntries.map((entry, i) => {
// // // // //         if (i === index) {
// // // // //           logActivity(
// // // // //             "UPLOAD_FILE",
// // // // //             { field, fileName: file.name, studentId },
// // // // //             user
// // // // //           );
// // // // //           return {
// // // // //             ...entry,
// // // // //           financeDetails: { 
// // // // //             ...entry.financeDetails, 
// // // // //             [field]: file,
// // // // //             [`${field}Name`]: file.name 
// // // // //           },
// // // // //         };
// // // // //         }
// // // // //         return entry;
// // // // //       });
// // // // //       setCourseEntries(updatedEntries);
// // // // //     setUploadProgress((prev) => ({ ...prev, [`${index}_${field}`]: 0 }));
// // // // //     }
// // // // //   };

// // // // //   const uploadFileToS3 = async (file, docType, studentId, courseIndex)=>{
// // // // //     const bucketName= impiry.meta.env.VITE_S3_BUCKET_NAME;
// // // // //     const region = import.meta.env.VITE_AWS_REGION;

// // // // //     if(!bucketName || !region){
// // // // //       throw new Error ("Missing S3 configuration : VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // // // //     }

// // // // //     if(!file || !(file instanceof File)){
// // // // //       throw new Error (`Invalid fiel for ${docType}: File object is null or not a File instance`);
// // // // //     }

// // // // //     const fileName = `students/${studentId}/courses/${courseIndex}/${docType}_${Date.now()}_${file.name}`;
// // // // //     const params = {
// // // // //       Bucket: bucketName,
// // // // //       Key: fileName,
// // // // //       Body: file,
// // // // //       ContentType: file.type,
// // // // //     };

// // // // //     try {
// // // // //       const upload = new Upload({
// // // // //         client: s3Client,
// // // // //         params,
// // // // //         queueSize: 4,
// // // // //         partSize: 5 * 1024 * 1024,
// // // // //       });

// // // // //       upload.on("httpUploadProgress", (progress) => {
// // // // //         const percent = Math.round((progress.loaded / progress.total) * 100);
// // // // //         setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: percent }));
// // // // //       });

// // // // //       await upload.done();

// // // // //       const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
// // // // //       return url;
// // // // //     } catch (err) {
// // // // //       console.error(`Error uploading ${docType}:`, err);
// // // // //       throw err;
// // // // //     }
// // // // //   };


// // // // //   const saveEnrollmentData = async () => {
// // // // //     if (!canCreate) {
// // // // //       toast.error("You don't have permission to save enrollment data");
// // // // //       logActivity(
// // // // //         "UNAUTHORIZED_CREATE_ATTEMPT",
// // // // //         { action: "saveEnrollment", studentId },
// // // // //         user
// // // // //       );
// // // // //       return;
// // // // //     }
// // // // //     try {
// // // // //       // Fetch student data for email
// // // // //       const studentDoc = await getDoc(doc(db, "student", studentId));
// // // // //       if (!studentDoc.exists()) {
// // // // //         throw new Error("Student not found");
// // // // //       }
// // // // //       const studentData = studentDoc.data();
// // // // //       const studentEmail = studentData.email || "";
// // // // //       const studentName = `${studentData.Name}`.trim() || "";

// // // // //       // Prepare updated entries
// // // // //       const updatedEntries = courseEntries.map((entry) => {
// // // // //         if (entry.feeTemplate === "Finance") {
// // // // //           const { bankStatement, paymentSlip, aadharCard, panCard, ...restFinanceDetails } =
// // // // //             entry.financeDetails;
// // // // //           return { ...entry, financeDetails: restFinanceDetails };
// // // // //         }
// // // // //         return { ...entry, freeReason: entry.freeReason || "" };
// // // // //       });

// // // // //       // Check for new courses or updated fee details
// // // // //       const newCourses = updatedEntries.filter(
// // // // //         (entry) =>
// // // // //           !existingCourses.some(
// // // // //             (existing) => existing.selectedCourse?.id === entry.selectedCourse?.id
// // // // //           ) && entry.selectedCourse
// // // // //       );
// // // // //       const updatedFees = updatedEntries.filter((entry) => {
// // // // //         const existing = existingCourses.find(
// // // // //           (e) => e.selectedCourse?.id === entry.selectedCourse?.id
// // // // //         );
// // // // //         if (!existing) return false;
// // // // //         return (
// // // // //           JSON.stringify(entry.fullFeesDetails) !==
// // // // //             JSON.stringify(existing.fullFeesDetails) ||
// // // // //           JSON.stringify(entry.financeDetails) !==
// // // // //             JSON.stringify(existing.financeDetails) ||
// // // // //           JSON.stringify(entry.installmentDetails) !==
// // // // //             JSON.stringify(existing.installmentDetails) ||
// // // // //           JSON.stringify(entry.registration) !==
// // // // //             JSON.stringify(existing.registration)
// // // // //         );
// // // // //       });

// // // // //       // Save enrollment data
// // // // //       await setDoc(
// // // // //         doc(db, "enrollments", studentId),
// // // // //         { courses: updatedEntries },
// // // // //         { merge: true }
// // // // //       );
// // // // //       toast.success("Enrollment data saved successfully!");
// // // // //       logActivity(
// // // // //         "SAVE_ENROLLMENT_SUCCESS",
// // // // //         { courseCount: updatedEntries.length, studentId },
// // // // //         user
// // // // //       );

// // // // //       // Send emails for new courses
// // // // //       for (const course of newCourses) {
// // // // //         if (studentEmail && course.selectedCourse?.name) {
// // // // //           try {
// // // // //             await sendWelcomeEmail(
// // // // //               studentEmail,
// // // // //               studentName,
// // // // //               course.selectedCourse.name
// // // // //             );
// // // // //             logActivity(
// // // // //               "SEND_WELCOME_EMAIL_SUCCESS",
// // // // //               {
// // // // //                 studentId,
// // // // //                 email: studentEmail,
// // // // //                 courseName: course.selectedCourse.name,
// // // // //               },
// // // // //               user
// // // // //             );
// // // // //           } catch (emailError) {
// // // // //             console.error("Failed to send welcome email:", emailError);
// // // // //             toast.warn(
// // // // //               `Enrollment saved, but failed to send welcome email for ${course.selectedCourse.name}`
// // // // //             );
// // // // //             logActivity(
// // // // //               "SEND_WELCOME_EMAIL_ERROR",
// // // // //               {
// // // // //                 studentId,
// // // // //                 email: studentEmail,
// // // // //                 courseName: course.selectedCourse.name,
// // // // //                 error: emailError.message,
// // // // //               },
// // // // //               user
// // // // //             );
// // // // //           }
// // // // //         }
// // // // //       }

// // // // //       // Send emails for updated fee details
// // // // //       for (const course of updatedFees) {
// // // // //         if (studentEmail && course.selectedCourse?.name) {
// // // // //           try {
// // // // //             await sendWelcomeEmail(
// // // // //               studentEmail,
// // // // //               studentName,
// // // // //               course.selectedCourse.name
// // // // //             );
// // // // //             logActivity(
// // // // //               "SEND_FEE_UPDATE_EMAIL_SUCCESS",
// // // // //               {
// // // // //                 studentId,
// // // // //                 email: studentEmail,
// // // // //                 courseName: course.selectedCourse.name,
// // // // //               },
// // // // //               user
// // // // //             );
// // // // //           } catch (emailError) {
// // // // //             console.error("Failed to send fee update email:", emailError);
// // // // //             toast.warn(
// // // // //               `Enrollment saved, but failed to send fee update email for ${course.selectedCourse.name}`
// // // // //             );
// // // // //             logActivity(
// // // // //               "SEND_FEE_UPDATE_EMAIL_ERROR",
// // // // //               {
// // // // //                 studentId,
// // // // //                 email: studentEmail,
// // // // //                 courseName: course.selectedCourse.name,
// // // // //                 error: emailError.message,
// // // // //               },
// // // // //               user
// // // // //             );
// // // // //           }
// // // // //         }
// // // // //       }

// // // // //       handleClose();
// // // // //     } catch (error) {
// // // // //       console.error("Error saving enrollment data: ", error);
// // // // //       toast.error("Failed to save enrollment data");
// // // // //       logActivity(
// // // // //         "SAVE_ENROLLMENT_ERROR",
// // // // //         { error: error.message, studentId },
// // // // //         user
// // // // //       );
// // // // //     }
// // // // //   };

// // // // //   const handleClose = () => {
// // // // //     setIsOpen(false);
// // // // //     setTimeout(() => {
// // // // //       navigate(-1);
// // // // //       logActivity("NAVIGATE_BACK", { from: "AddCourse", studentId }, user);
// // // // //     }, 300);
// // // // //   };

// // // // //   const getFilteredCourses = (mode) => {
// // // // //     if (!mode || preferredCenters.length === 0) return [];
// // // // //     return courses.filter((course) => {
// // // // //       const isAvailableAtCenter = course.centers?.some(
// // // // //         (center) =>
// // // // //           center.status === "Active" && preferredCenters.includes(center.centerId)
// // // // //       );
// // // // //       const isAvailableInMode = course.mode === mode;
// // // // //       return isAvailableAtCenter && isAvailableInMode;
// // // // //     });
// // // // //   };

// // // // //   if (!canDisplay) return null;

// // // // //   if (loading) return <Typography className="text-center text-gray-500">Loading...</Typography>;

// // // // //   return (
// // // // //     <>
// // // // //       <ToastContainer position="top-right" autoClose={3000} />
// // // // //       <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
// // // // //       <div
// // // // //         className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${
// // // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // // //         } z-50 overflow-y-auto`}
// // // // //       >
// // // // //         <div className="p-6">
// // // // //           <div className="flex justify-between items-center mb-6">
// // // // //             <Typography variant="h5" className="text-gray-800 font-semibold">
// // // // //               Add Courses
// // // // //             </Typography>
// // // // //             <Button
// // // // //               onClick={handleClose}
// // // // //               className="text-gray-500 hover:text-gray-700"
// // // // //               sx={{ minWidth: 0, padding: 1 }}
// // // // //             >
// // // // //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // // //                 <path
// // // // //                   strokeLinecap="round"
// // // // //                   strokeLinejoin="round"
// // // // //                   strokeWidth="2"
// // // // //                   d="M6 18L18 6M6 6l12 12"
// // // // //                 />
// // // // //               </svg>
// // // // //             </Button>
// // // // //           </div>

// // // // //           <PreferredCenters centers={centers} preferredCenters={preferredCenters} />

// // // // //           {courseEntries.map((entry, courseIndex) => (
// // // // //             <CourseEntryForm
// // // // //               key={courseIndex}
// // // // //               courseIndex={courseIndex}
// // // // //               entry={entry}
// // // // //               courses={courses}
// // // // //               financePartners={financePartners}
// // // // //               handleChange={handleChange}
// // // // //               handleFullFeesChange={handleFullFeesChange}
// // // // //               handleRegistrationChange={handleRegistrationChange}
// // // // //               handleInstallmentChange={handleInstallmentChange}
// // // // //               handleFinanceChange={handleFinanceChange}
// // // // //               handleFileChange={handleFileChange}
// // // // //               addInstallment={addInstallment}
// // // // //               removeInstallment={removeInstallment}
// // // // //               removeCourseEntry={removeCourseEntry}
// // // // //               canUpdate={canUpdate}
// // // // //               canDelete={canDelete}
// // // // //               user={user}
// // // // //               studentId={studentId}
// // // // //               getFilteredCourses={getFilteredCourses}
// // // // //             />
// // // // //           ))}

// // // // //           <div className="flex space-x-4">
// // // // //             {canCreate && (
// // // // //               <>
// // // // //                 <Button
// // // // //                   variant="contained"
// // // // //                   onClick={addCourseEntry}
// // // // //                   className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
// // // // //                   disabled={!canCreate}
// // // // //                 >
// // // // //                   Add Course
// // // // //                 </Button>
// // // // //                 <Button
// // // // //                   variant="contained"
// // // // //                   onClick={saveEnrollmentData}
// // // // //                   className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
// // // // //                   disabled={!canCreate}
// // // // //                 >
// // // // //                   Save Enrollment
// // // // //                 </Button>
// // // // //               </>
// // // // //             )}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </>
// // // // //   );
// // // // // };

// // // // // export default AddCourse;




// // // // import React, { useState, useEffect } from "react";
// // // // import { db } from "../../../../config/firebase";
// // // // import {
// // // //   collection,
// // // //   getDocs,
// // // //   setDoc,
// // // //   doc,
// // // //   getDoc,
// // // //   query,
// // // //   where,
// // // //   Timestamp
// // // // } from "firebase/firestore";
// // // // import { useParams, useNavigate } from "react-router-dom";
// // // // import { useAuth } from "../../../../context/AuthContext";
// // // // import { Button, Typography } from "@mui/material";
// // // // import { ToastContainer, toast } from "react-toastify";
// // // // import sendWelcomeEmail from "../../../../services/sendWelcomeEmail";
// // // // import PreferredCenters from "./PreferredCenters";
// // // // import CourseEntryForm from "./CourseEntryForm";
// // // // import { logActivity } from "./utils";
// // // // import { s3Client } from "../../../../config/aws-config";
// // // // import { Upload } from "@aws-sdk/lib-storage";
// // // // import "react-toastify/dist/ReactToastify.css";

// // // // const AddCourse = () => {
// // // //   const { studentId } = useParams();
// // // //   const navigate = useNavigate();
// // // //   const { user, rolePermissions } = useAuth();
// // // //   const [courses, setCourses] = useState([]);
// // // //   const [courseEntries, setCourseEntries] = useState([]);
// // // //   const [financePartners, setFinancePartners] = useState([]);
// // // //   const [preferredCenters, setPreferredCenters] = useState([]);
// // // //   const [centers, setCenters] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [isOpen, setIsOpen] = useState(false);
// // // //   const [existingCourses, setExistingCourses] = useState([]);
// // // //   const [uploadProgress, setUploadProgress] = useState({});

// // // //   // Permission checks
// // // //   const canDisplay = rolePermissions?.enrollments?.display || false;
// // // //   const canCreate = rolePermissions?.enrollments?.create || false;
// // // //   const canUpdate = rolePermissions?.enrollments?.update || false;
// // // //   const canDelete = rolePermissions?.enrollments?.delete || false;

// // // //   const defaultFinanceDetails = {
// // // //     financePartner: "",
// // // //     contactPerson: "",
// // // //     scheme: "",
// // // //     loanAmount: 0,
// // // //     downPayment: 0,
// // // //     downPaymentDate: "",
// // // //     applicantName: "",
// // // //     relationship: "",
// // // //     loanStatus: "Pending",
// // // //     bankStatement: null,
// // // //     bankStatementName: "",
// // // //     paymentSlip: null,
// // // //     paymentSlipName: "",
// // // //     aadharCard: null,
// // // //     aadharCardName: "",
// // // //     panCard: null,
// // // //     panCardName: "",
// // // //     registration: {
// // // //       amount: "",
// // // //       date: "",
// // // //       receivedBy: "",
// // // //       paymentMethod: "",
// // // //       remark: "",
// // // //       status: "Pending",
// // // //     },
// // // //     discountType: "",
// // // //     discountValue: "",
// // // //     discountReason: "",
// // // //     feeAfterDiscount: 0,
// // // //   };

// // // //   const defaultEntry = {
// // // //     selectedCourse: "",
// // // //     mode: "",
// // // //     feeTemplate: "",
// // // //     installmentDetails: [
// // // //       {
// // // //         number: "",
// // // //         dueDate: "",
// // // //         dueAmount: "",
// // // //         paidDate: "",
// // // //         paidAmount: "",
// // // //         paymentMode: "",
// // // //         pdcStatus: "",
// // // //         receivedBy: "",
// // // //         remark: "",
// // // //         status: "Pending",
// // // //       },
// // // //     ],
// // // //     fullFeesDetails: {
// // // //       discountType: "",
// // // //       discountValue: "",
// // // //       discountReason: "",
// // // //       feeAfterDiscount: 0,
// // // //       totalFees: 0,
// // // //       registration: {
// // // //         amount: "",
// // // //         date: "",
// // // //         receivedBy: "",
// // // //         paymentMethod: "",
// // // //         remark: "",
// // // //         status: "Pending",
// // // //       },
// // // //       finalPayment: {
// // // //         amount: "",
// // // //         date: "",
// // // //         receivedBy: "",
// // // //         paymentMethod: "",
// // // //         remark: "",
// // // //         status: "Pending",
// // // //       },
// // // //     },
// // // //     financeDetails: { ...defaultFinanceDetails },
// // // //     registration: {
// // // //       amount: "",
// // // //       date: "",
// // // //       receivedBy: "",
// // // //       paymentMethod: "",
// // // //       remark: "",
// // // //       status: "Pending",
// // // //     },
// // // //     freeReason: "",
// // // //   };

// // // //   useEffect(() => {
// // // //     if (!canDisplay) {
// // // //       toast.error("You don't have permission to view this page");
// // // //       logActivity("UNAUTHORIZED_ACCESS_ATTEMPT", { page: "AddCourse" }, user);
// // // //       navigate("/unauthorized");
// // // //       return;
// // // //     }

// // // //     const fetchData = async () => {
// // // //       try {
// // // //         setLoading(true);

// // // //         // Fetch student data
// // // //         const studentDoc = await getDoc(doc(db, "student", studentId));
// // // //         let studentPreferredCenters = [];
// // // //         if (studentDoc.exists()) {
// // // //           const studentData = studentDoc.data();
// // // //           studentPreferredCenters = studentData.preferred_centers || [];
// // // //           if (!Array.isArray(studentPreferredCenters)) {
// // // //             console.warn(
// // // //               "preferred_centers is not an array, defaulting to empty array:",
// // // //               studentPreferredCenters
// // // //             );
// // // //             studentPreferredCenters = [];
// // // //           }
// // // //           setPreferredCenters(studentPreferredCenters);
// // // //           logActivity(
// // // //             "FETCH_STUDENT_SUCCESS",
// // // //             {
// // // //               preferredCenters: studentPreferredCenters.length,
// // // //               studentId,
// // // //             },
// // // //             user
// // // //           );
// // // //         } else {
// // // //           toast.error("Student not found");
// // // //           logActivity("FETCH_STUDENT_NOT_FOUND", { studentId }, user);
// // // //           setPreferredCenters([]);
// // // //         }

// // // //         // Fetch centers
// // // //         const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
// // // //         if (instituteSnapshot.empty) {
// // // //           console.error("No instituteSetup document found");
// // // //           setCenters([]);
// // // //           logActivity(
// // // //             "FETCH_CENTERS_WARNING",
// // // //             { message: "No instituteSetup found", studentId },
// // // //             user
// // // //           );
// // // //         } else {
// // // //           const instituteId = instituteSnapshot.docs[0].id;
// // // //           const centerQuery = query(
// // // //             collection(db, "instituteSetup", instituteId, "Center"),
// // // //             where("isActive", "==", true)
// // // //           );
// // // //           const centerSnapshot = await getDocs(centerQuery);
// // // //           const fetchedCenters = centerSnapshot.docs.map((doc) => ({
// // // //             id: doc.id,
// // // //             ...doc.data(),
// // // //           }));
// // // //           setCenters(fetchedCenters);
// // // //           logActivity(
// // // //             "FETCH_CENTERS_SUCCESS",
// // // //             { count: fetchedCenters.length, studentId },
// // // //             user
// // // //           );
// // // //         }

// // // //         // Fetch courses
// // // //         const coursesSnapshot = await getDocs(collection(db, "Course"));
// // // //         const fetchedCourses = coursesSnapshot.docs.map((doc) => ({
// // // //           id: doc.id,
// // // //           ...doc.data(),
// // // //         }));
// // // //         setCourses(fetchedCourses);
// // // //         logActivity(
// // // //           "FETCH_COURSES_SUCCESS",
// // // //           { count: fetchedCourses.length, studentId },
// // // //           user
// // // //         );

// // // //         // Fetch finance partners
// // // //         const financePartnersSnapshot = await getDocs(
// // // //           collection(db, "FinancePartner")
// // // //         );
// // // //         const activeFinancePartners = financePartnersSnapshot.docs
// // // //           .map((doc) => ({ id: doc.id, ...doc.data() }))
// // // //           .filter((partner) => partner.status === "Active");
// // // //         setFinancePartners(activeFinancePartners);
// // // //         logActivity(
// // // //           "FETCH_FINANCE_PARTNERS_SUCCESS",
// // // //           { count: activeFinancePartners.length, studentId },
// // // //           user
// // // //         );

// // // //         // Fetch existing enrollment
// // // //         const enrollmentDoc = await getDoc(doc(db, "enrollments", studentId));
// // // //         if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
// // // //           const existingCourses = enrollmentDoc.data().courses.map((course) => ({
// // // //             ...defaultEntry,
// // // //             ...course,
// // // //             selectedCourse:
// // // //               fetchedCourses.find((c) => c.id === course.selectedCourse?.id) ||
// // // //               course.selectedCourse ||
// // // //               "",
// // // //             financeDetails: {
// // // //               ...defaultFinanceDetails,
// // // //               ...course.financeDetails,
// // // //               scheme: course.financeDetails?.scheme || "",
// // // //               registration: {
// // // //                 ...defaultFinanceDetails.registration,
// // // //                 ...course.financeDetails?.registration,
// // // //                 status: course.financeDetails?.registration?.status || "Pending",
// // // //               },
// // // //             },
// // // //             registration: {
// // // //               ...defaultEntry.registration,
// // // //               ...course.registration,
// // // //               status: course.registration?.status || "Pending",
// // // //             },
// // // //             installmentDetails: course.installmentDetails?.map((installment) => ({
// // // //               ...defaultEntry.installmentDetails[0],
// // // //               ...installment,
// // // //               status: installment.status || "Pending",
// // // //             })) || defaultEntry.installmentDetails,
// // // //             fullFeesDetails: {
// // // //               ...defaultEntry.fullFeesDetails,
// // // //               ...course.fullFeesDetails,
// // // //               registration: {
// // // //                 ...defaultEntry.fullFeesDetails.registration,
// // // //                 ...course.fullFeesDetails?.registration,
// // // //                 status:
// // // //                   course.fullFeesDetails?.registration?.status || "Pending",
// // // //               },
// // // //               finalPayment: {
// // // //                 ...defaultEntry.fullFeesDetails.finalPayment,
// // // //                 ...course.fullFeesDetails?.finalPayment,
// // // //                 status:
// // // //                   course.fullFeesDetails?.finalPayment?.status || "Pending",
// // // //               },
// // // //             },
// // // //             freeReason: course.freeReason || "",
// // // //           }));
// // // //           setCourseEntries(existingCourses);
// // // //           setExistingCourses(existingCourses);
// // // //           logActivity(
// // // //             "FETCH_ENROLLMENT_SUCCESS",
// // // //             { courseCount: existingCourses.length, studentId },
// // // //             user
// // // //           );
// // // //         } else {
// // // //           setCourseEntries([defaultEntry]);
// // // //           setExistingCourses([]);
// // // //           logActivity("FETCH_ENROLLMENT_NOT_FOUND", { studentId }, user);
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error fetching data: ", error);
// // // //         toast.error("Failed to fetch data");
// // // //         logActivity(
// // // //           "FETCH_DATA_ERROR",
// // // //           { error: error.message, studentId },
// // // //           user
// // // //         );
// // // //         setCourseEntries([defaultEntry]);
// // // //         setPreferredCenters([]);
// // // //         setCenters([]);
// // // //       } finally {
// // // //         setLoading(false);
// // // //         setTimeout(() => setIsOpen(true), 10);
// // // //       }
// // // //     };

// // // //     fetchData();
// // // //   }, [studentId, canDisplay, navigate, user]);

// // // //   const handleFileChange = (index, field, event) => {
// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update course details");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // //         { action: "uploadFile", field, studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }

// // // //     const file = event.target.files[0];
// // // //     if (file) {
// // // //       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
// // // //       if (!allowedTypes.includes(file.type)) {
// // // //         toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
// // // //         return;
// // // //       }
// // // //       if (file.size > 5 * 1024 * 1024) {
// // // //         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
// // // //         return;
// // // //       }

// // // //       const updatedEntries = courseEntries.map((entry, i) => {
// // // //         if (i === index) {
// // // //           logActivity(
// // // //             "UPLOAD_FILE",
// // // //             { field, fileName: file.name, studentId },
// // // //             user
// // // //           );
// // // //           return {
// // // //             ...entry,
// // // //             financeDetails: { 
// // // //               ...entry.financeDetails, 
// // // //               [field]: file,
// // // //               [`${field}Name`]: file.name 
// // // //             },
// // // //           };
// // // //         }
// // // //         return entry;
// // // //       });
// // // //       setCourseEntries(updatedEntries);
// // // //       setUploadProgress((prev) => ({ ...prev, [`${index}_${field}`]: 0 }));
// // // //     }
// // // //   };

// // // //   const uploadFileToS3 = async (file, docType, studentId, courseIndex) => {
// // // //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // //     const region = import.meta.env.VITE_AWS_REGION;

// // // //     if (!bucketName || !region) {
// // // //       throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // // //     }

// // // //     if (!file || !(file instanceof File)) {
// // // //       throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
// // // //     }

// // // //     const fileName = `students/${studentId}/courses/${courseIndex}/${docType}_${Date.now()}_${file.name}`;
// // // //     const params = {
// // // //       Bucket: bucketName,
// // // //       Key: fileName,
// // // //       Body: file,
// // // //       ContentType: file.type,
// // // //     };

// // // //     try {
// // // //       const upload = new Upload({
// // // //         client: s3Client,
// // // //         params,
// // // //         queueSize: 4,
// // // //         partSize: 5 * 1024 * 1024,
// // // //       });

// // // //       upload.on("httpUploadProgress", (progress) => {
// // // //         const percent = Math.round((progress.loaded / progress.total) * 100);
// // // //         setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: percent }));
// // // //       });

// // // //       await upload.done();

// // // //       const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
// // // //       return url;
// // // //     } catch (err) {
// // // //       console.error(`Error uploading ${docType}:`, err);
// // // //       throw err;
// // // //     }
// // // //   };

// // // //   const saveEnrollmentData = async () => {
// // // //     if (!canCreate) {
// // // //       toast.error("You don't have permission to save enrollment data");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_CREATE_ATTEMPT",
// // // //         { action: "saveEnrollment", studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     try {
// // // //       setLoading(true);

// // // //       // Prepare updated entries with file uploads
// // // //       const updatedEntries = await Promise.all(courseEntries.map(async (entry, index) => {
// // // //         if (entry.feeTemplate === "Finance") {
// // // //           const documentFields = ['bankStatement', 'paymentSlip', 'aadharCard', 'panCard'];
// // // //           const uploadedDocuments = {};

// // // //           // Upload each document
// // // //           for (const field of documentFields) {
// // // //             if (entry.financeDetails[field]) {
// // // //               try {
// // // //                 const url = await uploadFileToS3(
// // // //                   entry.financeDetails[field], 
// // // //                   field, 
// // // //                   studentId,
// // // //                   index
// // // //                 );
// // // //                 uploadedDocuments[field] = url;
// // // //               } catch (uploadErr) {
// // // //                 console.error(`Failed to upload ${field}:`, uploadErr);
// // // //                 throw new Error(`Failed to upload ${field}: ${uploadErr.message}`);
// // // //               }
// // // //             }
// // // //           }

// // // //           return {
// // // //             ...entry,
// // // //             financeDetails: {
// // // //               ...entry.financeDetails,
// // // //               ...uploadedDocuments,
// // // //               // Remove the File objects and names
// // // //               bankStatement: undefined,
// // // //               bankStatementName: undefined,
// // // //               paymentSlip: undefined,
// // // //               paymentSlipName: undefined,
// // // //               aadharCard: undefined,
// // // //               aadharCardName: undefined,
// // // //               panCard: undefined,
// // // //               panCardName: undefined,
// // // //             }
// // // //           };
// // // //         }
// // // //         return entry;
// // // //       }));

// // // //       // Save enrollment data
// // // //       await setDoc(
// // // //         doc(db, "enrollments", studentId),
// // // //         { 
// // // //           courses: updatedEntries,
// // // //           updatedAt: Timestamp.now() 
// // // //         },
// // // //         { merge: true }
// // // //       );

// // // //       // Fetch student data for email
// // // //       const studentDoc = await getDoc(doc(db, "student", studentId));
// // // //       if (!studentDoc.exists()) {
// // // //         throw new Error("Student not found");
// // // //       }
// // // //       const studentData = studentDoc.data();
// // // //       const studentEmail = studentData.email || "";
// // // //       const studentName = `${studentData.Name}`.trim() || "";

// // // //       // Check for new courses or updated fee details
// // // //       const newCourses = updatedEntries.filter(
// // // //         (entry) =>
// // // //           !existingCourses.some(
// // // //             (existing) => existing.selectedCourse?.id === entry.selectedCourse?.id
// // // //           ) && entry.selectedCourse
// // // //       );
// // // //       const updatedFees = updatedEntries.filter((entry) => {
// // // //         const existing = existingCourses.find(
// // // //           (e) => e.selectedCourse?.id === entry.selectedCourse?.id
// // // //         );
// // // //         if (!existing) return false;
// // // //         return (
// // // //           JSON.stringify(entry.fullFeesDetails) !==
// // // //             JSON.stringify(existing.fullFeesDetails) ||
// // // //           JSON.stringify(entry.financeDetails) !==
// // // //             JSON.stringify(existing.financeDetails) ||
// // // //           JSON.stringify(entry.installmentDetails) !==
// // // //             JSON.stringify(existing.installmentDetails) ||
// // // //           JSON.stringify(entry.registration) !==
// // // //             JSON.stringify(existing.registration)
// // // //         );
// // // //       });

// // // //       toast.success("Enrollment data saved successfully!");
// // // //       logActivity(
// // // //         "SAVE_ENROLLMENT_SUCCESS",
// // // //         { courseCount: updatedEntries.length, studentId },
// // // //         user
// // // //       );

// // // //       // Send emails for new courses
// // // //       for (const course of newCourses) {
// // // //         if (studentEmail && course.selectedCourse?.name) {
// // // //           try {
// // // //             await sendWelcomeEmail(
// // // //               studentEmail,
// // // //               studentName,
// // // //               course.selectedCourse.name
// // // //             );
// // // //             logActivity(
// // // //               "SEND_WELCOME_EMAIL_SUCCESS",
// // // //               {
// // // //                 studentId,
// // // //                 email: studentEmail,
// // // //                 courseName: course.selectedCourse.name,
// // // //               },
// // // //               user
// // // //             );
// // // //           } catch (emailError) {
// // // //             console.error("Failed to send welcome email:", emailError);
// // // //             toast.warn(
// // // //               `Enrollment saved, but failed to send welcome email for ${course.selectedCourse.name}`
// // // //             );
// // // //             logActivity(
// // // //               "SEND_WELCOME_EMAIL_ERROR",
// // // //               {
// // // //                 studentId,
// // // //                 email: studentEmail,
// // // //                 courseName: course.selectedCourse.name,
// // // //                 error: emailError.message,
// // // //               },
// // // //               user
// // // //             );
// // // //           }
// // // //         }
// // // //       }

// // // //       // Send emails for updated fee details
// // // //       for (const course of updatedFees) {
// // // //         if (studentEmail && course.selectedCourse?.name) {
// // // //           try {
// // // //             await sendWelcomeEmail(
// // // //               studentEmail,
// // // //               studentName,
// // // //               course.selectedCourse.name
// // // //             );
// // // //             logActivity(
// // // //               "SEND_FEE_UPDATE_EMAIL_SUCCESS",
// // // //               {
// // // //                 studentId,
// // // //                 email: studentEmail,
// // // //                 courseName: course.selectedCourse.name,
// // // //               },
// // // //               user
// // // //             );
// // // //           } catch (emailError) {
// // // //             console.error("Failed to send fee update email:", emailError);
// // // //             toast.warn(
// // // //               `Enrollment saved, but failed to send fee update email for ${course.selectedCourse.name}`
// // // //             );
// // // //             logActivity(
// // // //               "SEND_FEE_UPDATE_EMAIL_ERROR",
// // // //               {
// // // //                 studentId,
// // // //                 email: studentEmail,
// // // //                 courseName: course.selectedCourse.name,
// // // //                 error: emailError.message,
// // // //               },
// // // //               user
// // // //             );
// // // //           }
// // // //         }
// // // //       }

// // // //       handleClose();
// // // //     } catch (error) {
// // // //       console.error("Error saving enrollment data: ", error);
// // // //       toast.error(`Failed to save enrollment data: ${error.message}`);
// // // //       logActivity(
// // // //         "SAVE_ENROLLMENT_ERROR",
// // // //         { error: error.message, studentId },
// // // //         user
// // // //       );
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleClose = () => {
// // // //     setIsOpen(false);
// // // //     setTimeout(() => {
// // // //       navigate(-1);
// // // //       logActivity("NAVIGATE_BACK", { from: "AddCourse", studentId }, user);
// // // //     }, 300);
// // // //   };

// // // //   const addCourseEntry = () => {
// // // //     if (!canCreate) {
// // // //       toast.error("You don't have permission to add courses");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_CREATE_ATTEMPT",
// // // //         { action: "addCourseEntry", studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     setCourseEntries([...courseEntries, defaultEntry]);
// // // //     logActivity("ADD_COURSE_ENTRY", { studentId }, user);
// // // //   };

// // // //   const removeCourseEntry = (index) => {
// // // //     if (!canDelete) {
// // // //       toast.error("You don't have permission to remove courses");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_DELETE_ATTEMPT",
// // // //         { action: "removeCourseEntry", index, studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     setCourseEntries(courseEntries.filter((_, i) => i !== index));
// // // //     logActivity("REMOVE_COURSE_ENTRY", { index, studentId }, user);
// // // //   };

// // // //   const handleChange = (index, field, value) => {
// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update course details");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // //         { action: "updateCourseEntry", field, studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // //       if (i === index) {
// // // //         if (field === "selectedCourse") {
// // // //           logActivity(
// // // //             "CHANGE_COURSE",
// // // //             { courseId: value?.id, field, studentId },
// // // //             user
// // // //           );
// // // //           return {
// // // //             ...entry,
// // // //             [field]: value,
// // // //             fullFeesDetails: {
// // // //               ...entry.fullFeesDetails,
// // // //               totalFees: value.fee || 0,
// // // //             },
// // // //             financeDetails: {
// // // //               ...entry.financeDetails,
// // // //               feeAfterDiscount: value.fee || 0,
// // // //             },
// // // //           };
// // // //         } else if (field === "freeReason") {
// // // //           logActivity("CHANGE_FIELD", { field, value, studentId }, user);
// // // //           return { ...entry, freeReason: value };
// // // //         }
// // // //         return { ...entry, [field]: value };
// // // //       }
// // // //       return entry;
// // // //     });
// // // //     logActivity("CHANGE_FREE_COURSE", { field, value, studentId }, user);
// // // //     setCourseEntries(updatedEntries);
// // // //   };

// // // //   const handleFullFeesChange = (index, field, subField, value) => {
// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update course details");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // //         { action: "updateFullFees", field, subField, studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // //       if (i === index) {
// // // //         const fullFeesDetails = { ...entry.fullFeesDetails };
// // // //         if (field === "discountType") {
// // // //           fullFeesDetails.discountType = value;
// // // //         } else if (field === "discountValue") {
// // // //           fullFeesDetails.discountValue = value;
// // // //           const totalFees = fullFeesDetails.totalFees || 0;
// // // //           fullFeesDetails.feeAfterDiscount =
// // // //             fullFeesDetails.discountType === "percentage"
// // // //               ? totalFees - totalFees * (Number(value) / 100)
// // // //               : totalFees - Number(value);
// // // //         } else if (field === "discountReason") {
// // // //           fullFeesDetails.discountReason = value;
// // // //         } else {
// // // //           fullFeesDetails[field] = {
// // // //             ...fullFeesDetails[field],
// // // //             [subField]: value,
// // // //           };
// // // //         }
// // // //         return { ...entry, fullFeesDetails };
// // // //       }
// // // //       return entry;
// // // //     });
// // // //     logActivity(
// // // //       "CHANGE_FULL_FEES",
// // // //       { field, subField, value, studentId },
// // // //       user
// // // //     );
// // // //     setCourseEntries(updatedEntries);
// // // //   };

// // // //   const handleRegistrationChange = (index, field, value) => {
// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update course details");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // //         { action: "updateRegistration", field, studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // //       if (i === index) {
// // // //         logActivity(
// // // //           "CHANGE_REGISTRATION",
// // // //           { field, value, studentId },
// // // //           user
// // // //         );
// // // //         return {
// // // //           ...entry,
// // // //           registration: { ...entry.registration, [field]: value },
// // // //         };
// // // //       }
// // // //       return entry;
// // // //     });
// // // //     setCourseEntries(updatedEntries);
// // // //   };

// // // //   const handleInstallmentChange = (courseIndex, installmentIndex, field, value) => {
// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update course details");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // //         { action: "updateInstallment", field, studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // //       if (i === courseIndex) {
// // // //         const updatedDetails = entry.installmentDetails.map(
// // // //           (installment, j) => {
// // // //             if (j === installmentIndex) {
// // // //               return { ...installment, [field]: value };
// // // //             }
// // // //             return installment;
// // // //           }
// // // //         );
// // // //         return { ...entry, installmentDetails: updatedDetails };
// // // //       }
// // // //       return entry;
// // // //     });
// // // //     logActivity(
// // // //       "CHANGE_INSTALLMENT",
// // // //       { installmentIndex, field, value, studentId },
// // // //       user
// // // //     );
// // // //     setCourseEntries(updatedEntries);
// // // //   };

// // // //   const addInstallment = (index) => {
// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update course details");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // //         { action: "addInstallment", studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // //       if (i === index) {
// // // //         logActivity("ADD_INSTALLMENT", { courseIndex: index, studentId }, user);
// // // //         return {
// // // //           ...entry,
// // // //           installmentDetails: [
// // // //             ...entry.installmentDetails,
// // // //             {
// // // //               number: "",
// // // //               dueDate: "",
// // // //               dueAmount: "",
// // // //               paidDate: "",
// // // //               paidAmount: "",
// // // //               paymentMode: "",
// // // //               pdcStatus: "",
// // // //               receivedBy: "",
// // // //               remark: "",
// // // //               status: "Pending",
// // // //             },
// // // //           ],
// // // //         };
// // // //       }
// // // //       return entry;
// // // //     });
// // // //     setCourseEntries(updatedEntries);
// // // //   };

// // // //   const removeInstallment = (courseIndex, installmentIndex) => {
// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update course details");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // //         { action: "removeInstallment", installmentIndex, studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // //       if (i === courseIndex) {
// // // //         logActivity(
// // // //           "REMOVE_INSTALLMENT",
// // // //           { courseIndex, installmentIndex, studentId },
// // // //           user
// // // //         );
// // // //         return {
// // // //           ...entry,
// // // //           installmentDetails: entry.installmentDetails.filter(
// // // //             (_, j) => j !== installmentIndex
// // // //           ),
// // // //         };
// // // //       }
// // // //       return entry;
// // // //     });
// // // //     setCourseEntries(updatedEntries);
// // // //   };

// // // //   const handleFinanceChange = (index, field, subField, value) => {
// // // //     if (!canUpdate) {
// // // //       toast.error("You don't have permission to update course details");
// // // //       logActivity(
// // // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // // //         { action: "updateFinance", field, subField, studentId },
// // // //         user
// // // //       );
// // // //       return;
// // // //     }
// // // //     const updatedEntries = courseEntries.map((entry, i) => {
// // // //       if (i === index) {
// // // //         const financeDetails = { ...entry.financeDetails };
// // // //         if (field === "discountType") {
// // // //           financeDetails.discountType = value;
// // // //         } else if (field === "discountValue") {
// // // //           financeDetails.discountValue = value;
// // // //           const totalFees = entry.fullFeesDetails.totalFees || 0;
// // // //           financeDetails.feeAfterDiscount =
// // // //             financeDetails.discountType === "percentage"
// // // //               ? totalFees - totalFees * (Number(value) / 100)
// // // //               : totalFees - Number(value);
// // // //         } else if (field === "discountReason") {
// // // //           financeDetails.discountReason = value;
// // // //         } else if (subField) {
// // // //           financeDetails[field] = { ...financeDetails[field], [subField]: value };
// // // //         } else {
// // // //           financeDetails[field] = value;
// // // //         }
// // // //         if (field === "financePartner") {
// // // //           financeDetails.contactPerson = "";
// // // //           financeDetails.scheme = "";
// // // //         }
// // // //         return { ...entry, financeDetails };
// // // //       }
// // // //       return entry;
// // // //     });
// // // //     logActivity(
// // // //       "CHANGE_FINANCE",
// // // //       { field, subField, value, studentId },
// // // //       user
// // // //     );
// // // //     setCourseEntries(updatedEntries);
// // // //   };

// // // //   const getFilteredCourses = (mode) => {
// // // //     if (!mode || preferredCenters.length === 0) return [];
// // // //     return courses.filter((course) => {
// // // //       const isAvailableAtCenter = course.centers?.some(
// // // //         (center) =>
// // // //           center.status === "Active" && preferredCenters.includes(center.centerId)
// // // //       );
// // // //       const isAvailableInMode = course.mode === mode;
// // // //       return isAvailableAtCenter && isAvailableInMode;
// // // //     });
// // // //   };

// // // //   if (!canDisplay) return null;

// // // //   if (loading) return <Typography className="text-center text-gray-500">Loading...</Typography>;

// // // //   return (
// // // //     <>
// // // //       <ToastContainer position="top-right" autoClose={3000} />
// // // //       <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
// // // //       <div
// // // //         className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${
// // // //           isOpen ? "translate-x-0" : "translate-x-full"
// // // //         } z-50 overflow-y-auto`}
// // // //       >
// // // //         <div className="p-6">
// // // //           <div className="flex justify-between items-center mb-6">
// // // //             <Typography variant="h5" className="text-gray-800 font-semibold">
// // // //               Add Courses
// // // //             </Typography>
// // // //             <Button
// // // //               onClick={handleClose}
// // // //               className="text-gray-500 hover:text-gray-700"
// // // //               sx={{ minWidth: 0, padding: 1 }}
// // // //             >
// // // //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                 <path
// // // //                   strokeLinecap="round"
// // // //                   strokeLinejoin="round"
// // // //                   strokeWidth="2"
// // // //                   d="M6 18L18 6M6 6l12 12"
// // // //                 />
// // // //               </svg>
// // // //             </Button>
// // // //           </div>

// // // //           <PreferredCenters centers={centers} preferredCenters={preferredCenters} />

// // // //           {courseEntries.map((entry, courseIndex) => (
// // // //             <CourseEntryForm
// // // //               key={courseIndex}
// // // //               courseIndex={courseIndex}
// // // //               entry={entry}
// // // //               courses={courses}
// // // //               financePartners={financePartners}
// // // //               handleChange={handleChange}
// // // //               handleFullFeesChange={handleFullFeesChange}
// // // //               handleRegistrationChange={handleRegistrationChange}
// // // //               handleInstallmentChange={handleInstallmentChange}
// // // //               handleFinanceChange={handleFinanceChange}
// // // //               handleFileChange={handleFileChange}
// // // //               addInstallment={addInstallment}
// // // //               removeInstallment={removeInstallment}
// // // //               removeCourseEntry={removeCourseEntry}
// // // //               canUpdate={canUpdate}
// // // //               canDelete={canDelete}
// // // //               user={user}
// // // //               studentId={studentId}
// // // //               getFilteredCourses={getFilteredCourses}
// // // //               uploadProgress={uploadProgress}
// // // //             />
// // // //           ))}

// // // //           <div className="flex space-x-4">
// // // //             {canCreate && (
// // // //               <>
// // // //                 <Button
// // // //                   variant="contained"
// // // //                   onClick={addCourseEntry}
// // // //                   className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
// // // //                   disabled={!canCreate}
// // // //                 >
// // // //                   Add Course
// // // //                 </Button>
// // // //                 <Button
// // // //                   variant="contained"
// // // //                   onClick={saveEnrollmentData}
// // // //                   className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
// // // //                   disabled={!canCreate || loading}
// // // //                 >
// // // //                   {loading ? 'Saving...' : 'Save Enrollment'}
// // // //                 </Button>
// // // //               </>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // };

// // // // export default AddCourse;



// // // import React, { useState, useEffect } from "react";
// // // import { db } from "../../../../config/firebase";
// // // import {
// // //   collection,
// // //   getDocs,
// // //   setDoc,
// // //   doc,
// // //   getDoc,
// // //   query,
// // //   where,
// // //   Timestamp
// // // } from "firebase/firestore";
// // // import { useParams, useNavigate } from "react-router-dom";
// // // import { useAuth } from "../../../../context/AuthContext";
// // // import { Button, Typography } from "@mui/material";
// // // import { ToastContainer, toast } from "react-toastify";
// // // import sendWelcomeEmail from "../../../../services/sendWelcomeEmail";
// // // import PreferredCenters from "./PreferredCenters";
// // // import CourseEntryForm from "./CourseEntryForm";
// // // import { logActivity } from "./utils";
// // // import { s3Client } from "../../../../config/aws-config";
// // // import { Upload } from "@aws-sdk/lib-storage";
// // // import "react-toastify/dist/ReactToastify.css";

// // // const AddCourse = () => {
// // //   const { studentId } = useParams();
// // //   const navigate = useNavigate();
// // //   const { user, rolePermissions } = useAuth();
// // //   const [courses, setCourses] = useState([]);
// // //   const [courseEntries, setCourseEntries] = useState([]);
// // //   const [financePartners, setFinancePartners] = useState([]);
// // //   const [preferredCenters, setPreferredCenters] = useState([]);
// // //   const [centers, setCenters] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [isOpen, setIsOpen] = useState(false);
// // //   const [existingCourses, setExistingCourses] = useState([]);
// // //   const [uploadProgress, setUploadProgress] = useState({});

// // //   // Permission checks
// // //   const canDisplay = rolePermissions?.enrollments?.display || false;
// // //   const canCreate = rolePermissions?.enrollments?.create || false;
// // //   const canUpdate = rolePermissions?.enrollments?.update || false;
// // //   const canDelete = rolePermissions?.enrollments?.delete || false;

// // //   const defaultFinanceDetails = {
// // //     financePartner: "",
// // //     contactPerson: "",
// // //     scheme: "",
// // //     loanAmount: 0,
// // //     downPayment: 0,
// // //     downPaymentDate: "",
// // //     applicantName: "",
// // //     relationship: "",
// // //     loanStatus: "Pending",
// // //     photo: null,
// // //     photoName: "",
// // //     bankStatement: null,
// // //     bankStatementName: "",
// // //     paymentSlip: null,
// // //     paymentSlipName: "",
// // //     aadharCard: null,
// // //     aadharCardName: "",
// // //     panCard: null,
// // //     panCardName: "",
// // //     registration: {
// // //       amount: "",
// // //       date: "",
// // //       receivedBy: "",
// // //       paymentMethod: "",
// // //       remark: "",
// // //       status: "Pending",
// // //     },
// // //     discountType: "",
// // //     discountValue: "",
// // //     discountReason: "",
// // //     feeAfterDiscount: 0,
// // //   };

// // //   const defaultEntry = {
// // //     selectedCourse: "",
// // //     mode: "",
// // //     feeTemplate: "",
// // //     installmentDetails: [
// // //       {
// // //         number: "",
// // //         dueDate: "",
// // //         dueAmount: "",
// // //         paidDate: "",
// // //         paidAmount: "",
// // //         paymentMode: "",
// // //         pdcStatus: "",
// // //         receivedBy: "",
// // //         remark: "",
// // //         status: "Pending",
// // //       },
// // //     ],
// // //     fullFeesDetails: {
// // //       discountType: "",
// // //       discountValue: "",
// // //       discountReason: "",
// // //       feeAfterDiscount: 0,
// // //       totalFees: 0,
// // //       registration: {
// // //         amount: "",
// // //         date: "",
// // //         receivedBy: "",
// // //         paymentMethod: "",
// // //         remark: "",
// // //         status: "Pending",
// // //       },
// // //       finalPayment: {
// // //         amount: "",
// // //         date: "",
// // //         receivedBy: "",
// // //         paymentMethod: "",
// // //         remark: "",
// // //         status: "Pending",
// // //       },
// // //     },
// // //     financeDetails: { ...defaultFinanceDetails },
// // //     registration: {
// // //       amount: "",
// // //       date: "",
// // //       receivedBy: "",
// // //       paymentMethod: "",
// // //       remark: "",
// // //       status: "Pending",
// // //     },
// // //     freeReason: "",
// // //   };

// // //   useEffect(() => {
// // //     if (!canDisplay) {
// // //       toast.error("You don't have permission to view this page");
// // //       logActivity("UNAUTHORIZED_ACCESS_ATTEMPT", { page: "AddCourse" }, user);
// // //       navigate("/unauthorized");
// // //       return;
// // //     }

// // //     const fetchData = async () => {
// // //       try {
// // //         setLoading(true);

// // //         // Fetch student data
// // //         const studentDoc = await getDoc(doc(db, "student", studentId));
// // //         let studentPreferredCenters = [];
// // //         if (studentDoc.exists()) {
// // //           const studentData = studentDoc.data();
// // //           studentPreferredCenters = studentData.preferred_centers || [];
// // //           if (!Array.isArray(studentPreferredCenters)) {
// // //             console.warn(
// // //               "preferred_centers is not an array, defaulting to empty array:",
// // //               studentPreferredCenters
// // //             );
// // //             studentPreferredCenters = [];
// // //           }
// // //           setPreferredCenters(studentPreferredCenters);
// // //           logActivity(
// // //             "FETCH_STUDENT_SUCCESS",
// // //             {
// // //               preferredCenters: studentPreferredCenters.length,
// // //               studentId,
// // //             },
// // //             user
// // //           );
// // //         } else {
// // //           toast.error("Student not found");
// // //           logActivity("FETCH_STUDENT_NOT_FOUND", { studentId }, user);
// // //           setPreferredCenters([]);
// // //         }

// // //         // Fetch centers
// // //         const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
// // //         if (instituteSnapshot.empty) {
// // //           console.error("No instituteSetup document found");
// // //           setCenters([]);
// // //           logActivity(
// // //             "FETCH_CENTERS_WARNING",
// // //             { message: "No instituteSetup found", studentId },
// // //             user
// // //           );
// // //         } else {
// // //           const instituteId = instituteSnapshot.docs[0].id;
// // //           const centerQuery = query(
// // //             collection(db, "instituteSetup", instituteId, "Center"),
// // //             where("isActive", "==", true)
// // //           );
// // //           const centerSnapshot = await getDocs(centerQuery);
// // //           const fetchedCenters = centerSnapshot.docs.map((doc) => ({
// // //             id: doc.id,
// // //             ...doc.data(),
// // //           }));
// // //           setCenters(fetchedCenters);
// // //           logActivity(
// // //             "FETCH_CENTERS_SUCCESS",
// // //             { count: fetchedCenters.length, studentId },
// // //             user
// // //           );
// // //         }

// // //         // Fetch courses
// // //         const coursesSnapshot = await getDocs(collection(db, "Course"));
// // //         const fetchedCourses = coursesSnapshot.docs.map((doc) => ({
// // //           id: doc.id,
// // //           ...doc.data(),
// // //         }));
// // //         setCourses(fetchedCourses);
// // //         logActivity(
// // //           "FETCH_COURSES_SUCCESS",
// // //           { count: fetchedCourses.length, studentId },
// // //           user
// // //         );

// // //         // Fetch finance partners
// // //         const financePartnersSnapshot = await getDocs(
// // //           collection(db, "FinancePartner")
// // //         );
// // //         const activeFinancePartners = financePartnersSnapshot.docs
// // //           .map((doc) => ({ id: doc.id, ...doc.data() }))
// // //           .filter((partner) => partner.status === "Active");
// // //         setFinancePartners(activeFinancePartners);
// // //         logActivity(
// // //           "FETCH_FINANCE_PARTNERS_SUCCESS",
// // //           { count: activeFinancePartners.length, studentId },
// // //           user
// // //         );

// // //         // Fetch existing enrollment
// // //         const enrollmentDoc = await getDoc(doc(db, "enrollments", studentId));
// // //         if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
// // //           const documentFields = ['photo', 'bankStatement', 'paymentSlip', 'aadharCard', 'panCard'];
// // //           const existingCourses = enrollmentDoc.data().courses.map((course) => {
// // //             const cleanedFinanceDetails = { ...defaultFinanceDetails, ...course.financeDetails };
// // //             // Clean document fields to handle legacy data
// // //             documentFields.forEach((docType) => {
// // //               const docValue = cleanedFinanceDetails[docType];
// // //               if (docValue && typeof docValue === 'object' && docValue.s3Url) {
// // //                 // Convert legacy { name, s3Url } to string URL
// // //                 cleanedFinanceDetails[docType] = docValue.s3Url;
// // //                 cleanedFinanceDetails[`${docType}Name`] = docValue.name || cleanedFinanceDetails[`${docType}Name`] || '';
// // //               } else if (docValue && typeof docValue !== 'string') {
// // //                 // Set invalid values to null
// // //                 cleanedFinanceDetails[docType] = null;
// // //                 cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || '';
// // //               } else {
// // //                 // Ensure name is set
// // //                 cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || '';
// // //               }
// // //             });
// // //             return {
// // //               ...defaultEntry,
// // //               ...course,
// // //               selectedCourse:
// // //                 fetchedCourses.find((c) => c.id === course.selectedCourse?.id) ||
// // //                 course.selectedCourse ||
// // //                 "",
// // //               financeDetails: cleanedFinanceDetails,
// // //               registration: {
// // //                 ...defaultEntry.registration,
// // //                 ...course.registration,
// // //                 status: course.registration?.status || "Pending",
// // //               },
// // //               installmentDetails: course.installmentDetails?.map((installment) => ({
// // //                 ...defaultEntry.installmentDetails[0],
// // //                 ...installment,
// // //                 status: installment.status || "Pending",
// // //               })) || defaultEntry.installmentDetails,
// // //               fullFeesDetails: {
// // //                 ...defaultEntry.fullFeesDetails,
// // //                 ...course.fullFeesDetails,
// // //                 registration: {
// // //                   ...defaultEntry.fullFeesDetails.registration,
// // //                   ...course.fullFeesDetails?.registration,
// // //                   status:
// // //                     course.fullFeesDetails?.registration?.status || "Pending",
// // //                 },
// // //                 finalPayment: {
// // //                   ...defaultEntry.fullFeesDetails.finalPayment,
// // //                   ...course.fullFeesDetails?.finalPayment,
// // //                   status:
// // //                     course.fullFeesDetails?.finalPayment?.status || "Pending",
// // //                 },
// // //               },
// // //               freeReason: course.freeReason || "",
// // //             };
// // //           });
// // //           setCourseEntries(existingCourses);
// // //           setExistingCourses(existingCourses);
// // //           logActivity(
// // //             "FETCH_ENROLLMENT_SUCCESS",
// // //             { courseCount: existingCourses.length, studentId },
// // //             user
// // //           );
// // //         } else {
// // //           setCourseEntries([defaultEntry]);
// // //           setExistingCourses([]);
// // //           logActivity("FETCH_ENROLLMENT_NOT_FOUND", { studentId }, user);
// // //         }
// // //       } catch (error) {
// // //         console.error("Error fetching data: ", error);
// // //         toast.error("Failed to fetch data");
// // //         logActivity(
// // //           "FETCH_DATA_ERROR",
// // //           { error: error.message, studentId },
// // //           user
// // //         );
// // //         setCourseEntries([defaultEntry]);
// // //         setPreferredCenters([]);
// // //         setCenters([]);
// // //       } finally {
// // //         setLoading(false);
// // //         setTimeout(() => setIsOpen(true), 10);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, [studentId, canDisplay, navigate, user]);

// // //   const handleFileChange = (index, field, event) => {
// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update course details");
// // //       logActivity(
// // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // //         { action: "uploadFile", field, studentId },
// // //         user
// // //       );
// // //       return;
// // //     }

// // //     const file = event.target.files[0];
// // //     if (file) {
// // //       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
// // //       if (!allowedTypes.includes(file.type)) {
// // //         toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
// // //         return;
// // //       }
// // //       if (file.size > 5 * 1024 * 1024) {
// // //         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
// // //         return;
// // //       }

// // //       const updatedEntries = courseEntries.map((entry, i) => {
// // //         if (i === index) {
// // //           logActivity(
// // //             "UPLOAD_FILE",
// // //             { field, fileName: file.name, studentId },
// // //             user
// // //           );
// // //           return {
// // //             ...entry,
// // //             financeDetails: { 
// // //               ...entry.financeDetails, 
// // //               [field]: file,
// // //               [`${field}Name`]: file.name 
// // //             },
// // //           };
// // //         }
// // //         return entry;
// // //       });
// // //       setCourseEntries(updatedEntries);
// // //       setUploadProgress((prev) => ({ ...prev, [`${index}_${field}`]: 0 }));
// // //     }
// // //   };

// // //   const uploadFileToS3 = async (file, docType, studentId, courseIndex) => {
// // //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // //     const region = import.meta.env.VITE_AWS_REGION;

// // //     if (!bucketName || !region) {
// // //       throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // //     }

// // //     if (!file || !(file instanceof File)) {
// // //       throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
// // //     }

// // //     const fileName = `students/${studentId}/courses/${courseIndex}/${docType}_${Date.now()}_${file.name}`;
// // //     const params = {
// // //       Bucket: bucketName,
// // //       Key: fileName,
// // //       Body: file,
// // //       ContentType: file.type,
// // //     };

// // //     try {
// // //       const upload = new Upload({
// // //         client: s3Client,
// // //         params,
// // //         queueSize: 4,
// // //         partSize: 5 * 1024 * 1024,
// // //       });

// // //       upload.on("httpUploadProgress", (progress) => {
// // //         const percent = Math.round((progress.loaded / progress.total) * 100);
// // //         setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: percent }));
// // //       });

// // //       await upload.done();

// // //       const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
// // //       return url;
// // //     } catch (err) {
// // //       console.error(`Error uploading ${docType}:`, err);
// // //       setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: -1 }));
// // //       throw err;
// // //     }
// // //   };

// // //   const saveEnrollmentData = async () => {
// // //     if (!canCreate) {
// // //       toast.error("You don't have permission to save enrollment data");
// // //       logActivity(
// // //         "UNAUTHORIZED_CREATE_ATTEMPT",
// // //         { action: "saveEnrollment", studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     try {
// // //       setLoading(true);

// // //       // Prepare updated entries with file uploads
// // //       const updatedEntries = await Promise.all(courseEntries.map(async (entry, index) => {
// // //         if (entry.feeTemplate === "Finance") {
// // //           const documentFields = ['photo', 'bankStatement', 'paymentSlip', 'aadharCard', 'panCard'];
// // //           const uploadedDocuments = {};

// // //           // Upload each document
// // //           for (const field of documentFields) {
// // //             if (entry.financeDetails[field] instanceof File) {
// // //               try {
// // //                 const url = await uploadFileToS3(
// // //                   entry.financeDetails[field], 
// // //                   field, 
// // //                   studentId,
// // //                   index
// // //                 );
// // //                 uploadedDocuments[field] = url;
// // //                 uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
// // //               } catch (uploadErr) {
// // //                 console.error(`Failed to upload ${field}:`, uploadErr);
// // //                 throw new Error(`Failed to upload ${field}: ${uploadErr.message}`);
// // //               }
// // //             } else if (typeof entry.financeDetails[field] === 'string') {
// // //               // Preserve existing S3 URL
// // //               uploadedDocuments[field] = entry.financeDetails[field];
// // //               uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
// // //             } else {
// // //               // Set to null if no file or URL
// // //               uploadedDocuments[field] = null;
// // //               uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
// // //             }
// // //           }

// // //           // Clean financeDetails to remove undefined values and File objects
// // //           const cleanedFinanceDetails = {};
// // //           Object.keys(entry.financeDetails).forEach((key) => {
// // //             if (entry.financeDetails[key] !== undefined && !(entry.financeDetails[key] instanceof File)) {
// // //               cleanedFinanceDetails[key] = uploadedDocuments[key] ?? entry.financeDetails[key];
// // //             }
// // //           });

// // //           return {
// // //             ...entry,
// // //             financeDetails: cleanedFinanceDetails
// // //           };
// // //         }
// // //         return entry;
// // //       }));

// // //       // Debug: Log financeDetails before saving
// // //       updatedEntries.forEach((entry, index) => {
// // //         console.log(`Course ${index} financeDetails:`, entry.financeDetails);
// // //       });

// // //       // Save enrollment data
// // //       await setDoc(
// // //         doc(db, "enrollments", studentId),
// // //         { 
// // //           courses: updatedEntries,
// // //           updatedAt: Timestamp.now() 
// // //         },
// // //         { merge: true }
// // //       );

// // //       // Fetch student data for email
// // //       const studentDoc = await getDoc(doc(db, "student", studentId));
// // //       if (!studentDoc.exists()) {
// // //         throw new Error("Student not found");
// // //       }
// // //       const studentData = studentDoc.data();
// // //       const studentEmail = studentData.email || "";
// // //       const studentName = `${studentData.Name}`.trim() || "";

// // //       // Check for new courses or updated fee details
// // //       const newCourses = updatedEntries.filter(
// // //         (entry) =>
// // //           !existingCourses.some(
// // //             (existing) => existing.selectedCourse?.id === entry.selectedCourse?.id
// // //           ) && entry.selectedCourse
// // //       );
// // //       const updatedFees = updatedEntries.filter((entry) => {
// // //         const existing = existingCourses.find(
// // //           (e) => e.selectedCourse?.id === entry.selectedCourse?.id
// // //         );
// // //         if (!existing) return false;
// // //         return (
// // //           JSON.stringify(entry.fullFeesDetails) !==
// // //             JSON.stringify(existing.fullFeesDetails) ||
// // //           JSON.stringify(entry.financeDetails) !==
// // //             JSON.stringify(existing.financeDetails) ||
// // //           JSON.stringify(entry.installmentDetails) !==
// // //             JSON.stringify(existing.installmentDetails) ||
// // //           JSON.stringify(entry.registration) !==
// // //             JSON.stringify(existing.registration)
// // //         );
// // //       });

// // //       toast.success("Enrollment data saved successfully!");
// // //       logActivity(
// // //         "SAVE_ENROLLMENT_SUCCESS",
// // //         { courseCount: updatedEntries.length, studentId },
// // //         user
// // //       );

// // //       // Send emails for new courses
// // //       for (const course of newCourses) {
// // //         if (studentEmail && course.selectedCourse?.name) {
// // //           try {
// // //             await sendWelcomeEmail(
// // //               studentEmail,
// // //               studentName,
// // //               course.selectedCourse.name
// // //             );
// // //             logActivity(
// // //               "SEND_WELCOME_EMAIL_SUCCESS",
// // //               {
// // //                 studentId,
// // //                 email: studentEmail,
// // //                 courseName: course.selectedCourse.name,
// // //               },
// // //               user
// // //             );
// // //           } catch (emailError) {
// // //             console.error("Failed to send welcome email:", emailError);
// // //             toast.warn(
// // //               `Enrollment saved, but failed to send welcome email for ${course.selectedCourse.name}`
// // //             );
// // //             logActivity(
// // //               "SEND_WELCOME_EMAIL_ERROR",
// // //               {
// // //                 studentId,
// // //                 email: studentEmail,
// // //                 courseName: course.selectedCourse.name,
// // //                 error: emailError.message,
// // //               },
// // //               user
// // //             );
// // //           }
// // //         }
// // //       }

// // //       // Send emails for updated fee details
// // //       // for (const course of updatedFees) {
// // //       //   if (studentEmail && course.selectedCourse?.name) {
// // //       //     try {
// // //       //       await sendWelcomeEmail(
// // //       //         studentEmail,
// // //       //         studentName,
// // //       //         course.selectedCourse.name
// // //       //       );
// // //       //       logActivity(
// // //       //         "SEND_FEE_UPDATE_EMAIL_SUCCESS",
// // //       //         {
// // //       //           studentId,
// // //       //           email: studentEmail,
// // //       //           courseName: course.selectedCourse.name,
// // //       //         },
// // //       //         user
// // //       //       );
// // //       //     } catch (emailError) {
// // //       //       console.error("Failed to send fee update email:", emailError);
// // //       //       toast.warn(
// // //       //         `Enrollment saved, but failed to send fee update email for ${course.selectedCourse.name}`
// // //       //       );
// // //       //       logActivity(
// // //       //         "SEND_FEE_UPDATE_EMAIL_ERROR",
// // //       //         {
// // //       //           studentId,
// // //       //           email: studentEmail,
// // //       //           courseName: course.selectedCourse.name,
// // //       //           error: emailError.message,
// // //       //         },
// // //       //         user
// // //       //       );
// // //       //     }
// // //       //   }
// // //       // }

// // //       handleClose();
// // //     } catch (error) {
// // //       console.error("Error saving enrollment data: ", error);
// // //       toast.error(`Failed to save enrollment data: ${error.message}`);
// // //       logActivity(
// // //         "SAVE_ENROLLMENT_ERROR",
// // //         { error: error.message, studentId },
// // //         user
// // //       );
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleClose = () => {
// // //     setIsOpen(false);
// // //     setTimeout(() => {
// // //       navigate(-1);
// // //       logActivity("NAVIGATE_BACK", { from: "AddCourse", studentId }, user);
// // //     }, 300);
// // //   };

// // //   const addCourseEntry = () => {
// // //     if (!canCreate) {
// // //       toast.error("You don't have permission to add courses");
// // //       logActivity(
// // //         "UNAUTHORIZED_CREATE_ATTEMPT",
// // //         { action: "addCourseEntry", studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     setCourseEntries([...courseEntries, defaultEntry]);
// // //     logActivity("ADD_COURSE_ENTRY", { studentId }, user);
// // //   };

// // //   const removeCourseEntry = (index) => {
// // //     if (!canDelete) {
// // //       toast.error("You don't have permission to remove courses");
// // //       logActivity(
// // //         "UNAUTHORIZED_DELETE_ATTEMPT",
// // //         { action: "removeCourseEntry", index, studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     setCourseEntries(courseEntries.filter((_, i) => i !== index));
// // //     logActivity("REMOVE_COURSE_ENTRY", { index, studentId }, user);
// // //   };

// // //   const handleChange = (index, field, value) => {
// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update course details");
// // //       logActivity(
// // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // //         { action: "updateCourseEntry", field, studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     const updatedEntries = courseEntries.map((entry, i) => {
// // //       if (i === index) {
// // //         if (field === "selectedCourse") {
// // //           logActivity(
// // //             "CHANGE_COURSE",
// // //             { courseId: value?.id, field, studentId },
// // //             user
// // //           );
// // //           return {
// // //             ...entry,
// // //             [field]: value,
// // //             fullFeesDetails: {
// // //               ...entry.fullFeesDetails,
// // //               totalFees: value.fee || 0,
// // //             },
// // //             financeDetails: {
// // //               ...entry.financeDetails,
// // //               feeAfterDiscount: value.fee || 0,
// // //             },
// // //           };
// // //         } else if (field === "freeReason") {
// // //           logActivity("CHANGE_FIELD", { field, value, studentId }, user);
// // //           return { ...entry, freeReason: value };
// // //         }
// // //         return { ...entry, [field]: value };
// // //       }
// // //       return entry;
// // //     });
// // //     logActivity("CHANGE_FREE_COURSE", { field, value, studentId }, user);
// // //     setCourseEntries(updatedEntries);
// // //   };

// // //   const handleFullFeesChange = (index, field, subField, value) => {
// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update course details");
// // //       logActivity(
// // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // //         { action: "updateFullFees", field, subField, studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     const updatedEntries = courseEntries.map((entry, i) => {
// // //       if (i === index) {
// // //         const fullFeesDetails = { ...entry.fullFeesDetails };
// // //         if (field === "discountType") {
// // //           fullFeesDetails.discountType = value;
// // //         } else if (field === "discountValue") {
// // //           fullFeesDetails.discountValue = value;
// // //           const totalFees = fullFeesDetails.totalFees || 0;
// // //           fullFeesDetails.feeAfterDiscount =
// // //             fullFeesDetails.discountType === "percentage"
// // //               ? totalFees - totalFees * (Number(value) / 100)
// // //               : totalFees - Number(value);
// // //         } else if (field === "discountReason") {
// // //           fullFeesDetails.discountReason = value;
// // //         } else {
// // //           fullFeesDetails[field] = {
// // //             ...fullFeesDetails[field],
// // //             [subField]: value,
// // //           };
// // //         }
// // //         return { ...entry, fullFeesDetails };
// // //       }
// // //       return entry;
// // //     });
// // //     logActivity(
// // //       "CHANGE_FULL_FEES",
// // //       { field, subField, value, studentId },
// // //       user
// // //     );
// // //     setCourseEntries(updatedEntries);
// // //   };

// // //   const handleRegistrationChange = (index, field, value) => {
// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update course details");
// // //       logActivity(
// // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // //         { action: "updateRegistration", field, studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     const updatedEntries = courseEntries.map((entry, i) => {
// // //       if (i === index) {
// // //         logActivity(
// // //           "CHANGE_REGISTRATION",
// // //           { field, value, studentId },
// // //           user
// // //         );
// // //         return {
// // //           ...entry,
// // //           registration: { ...entry.registration, [field]: value },
// // //         };
// // //       }
// // //       return entry;
// // //     });
// // //     setCourseEntries(updatedEntries);
// // //   };

// // //   const handleInstallmentChange = (courseIndex, installmentIndex, field, value) => {
// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update course details");
// // //       logActivity(
// // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // //         { action: "updateInstallment", field, studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     const updatedEntries = courseEntries.map((entry, i) => {
// // //       if (i === courseIndex) {
// // //         const updatedDetails = entry.installmentDetails.map(
// // //           (installment, j) => {
// // //             if (j === installmentIndex) {
// // //               return { ...installment, [field]: value };
// // //             }
// // //             return installment;
// // //           }
// // //         );
// // //         return { ...entry, installmentDetails: updatedDetails };
// // //       }
// // //       return entry;
// // //     });
// // //     logActivity(
// // //       "CHANGE_INSTALLMENT",
// // //       { installmentIndex, field, value, studentId },
// // //       user
// // //     );
// // //     setCourseEntries(updatedEntries);
// // //   };

// // //   const addInstallment = (index) => {
// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update course details");
// // //       logActivity(
// // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // //         { action: "addInstallment", studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     const updatedEntries = courseEntries.map((entry, i) => {
// // //       if (i === index) {
// // //         logActivity("ADD_INSTALLMENT", { courseIndex: index, studentId }, user);
// // //         return {
// // //           ...entry,
// // //           installmentDetails: [
// // //             ...entry.installmentDetails,
// // //             {
// // //               number: "",
// // //               dueDate: "",
// // //               dueAmount: "",
// // //               paidDate: "",
// // //               paidAmount: "",
// // //               paymentMode: "",
// // //               pdcStatus: "",
// // //               receivedBy: "",
// // //               remark: "",
// // //               status: "Pending",
// // //             },
// // //           ],
// // //         };
// // //       }
// // //       return entry;
// // //     });
// // //     setCourseEntries(updatedEntries);
// // //   };

// // //   const removeInstallment = (courseIndex, installmentIndex) => {
// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update course details");
// // //       logActivity(
// // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // //         { action: "removeInstallment", installmentIndex, studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     const updatedEntries = courseEntries.map((entry, i) => {
// // //       if (i === courseIndex) {
// // //         logActivity(
// // //           "REMOVE_INSTALLMENT",
// // //           { courseIndex, installmentIndex, studentId },
// // //           user
// // //         );
// // //         return {
// // //           ...entry,
// // //           installmentDetails: entry.installmentDetails.filter(
// // //             (_, j) => j !== installmentIndex
// // //           ),
// // //         };
// // //       }
// // //       return entry;
// // //     });
// // //     setCourseEntries(updatedEntries);
// // //   };

// // //   const handleFinanceChange = (index, field, subField, value) => {
// // //     if (!canUpdate) {
// // //       toast.error("You don't have permission to update course details");
// // //       logActivity(
// // //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// // //         { action: "updateFinance", field, subField, studentId },
// // //         user
// // //       );
// // //       return;
// // //     }
// // //     const updatedEntries = courseEntries.map((entry, i) => {
// // //       if (i === index) {
// // //         const financeDetails = { ...entry.financeDetails };
// // //         if (field === "discountType") {
// // //           financeDetails.discountType = value;
// // //         } else if (field === "discountValue") {
// // //           financeDetails.discountValue = value;
// // //           const totalFees = entry.fullFeesDetails.totalFees || 0;
// // //           financeDetails.feeAfterDiscount =
// // //             financeDetails.discountType === "percentage"
// // //               ? totalFees - totalFees * (Number(value) / 100)
// // //               : totalFees - Number(value);
// // //         } else if (field === "discountReason") {
// // //           financeDetails.discountReason = value;
// // //         } else if (subField) {
// // //           financeDetails[field] = { ...financeDetails[field], [subField]: value };
// // //         } else {
// // //           financeDetails[field] = value;
// // //         }
// // //         if (field === "financePartner") {
// // //           financeDetails.contactPerson = "";
// // //           financeDetails.scheme = "";
// // //         }
// // //         return { ...entry, financeDetails };
// // //       }
// // //       return entry;
// // //     });
// // //     logActivity(
// // //       "CHANGE_FINANCE",
// // //       { field, subField, value, studentId },
// // //       user
// // //     );
// // //     setCourseEntries(updatedEntries);
// // //   };

// // //   const getFilteredCourses = (mode) => {
// // //     if (!mode || preferredCenters.length === 0) return [];
// // //     return courses.filter((course) => {
// // //       const isAvailableAtCenter = course.centers?.some(
// // //         (center) =>
// // //           center.status === "Active" && preferredCenters.includes(center.centerId)
// // //       );
// // //       const isAvailableInMode = course.mode === mode;
// // //       return isAvailableAtCenter && isAvailableInMode;
// // //     });
// // //   };

// // //   if (!canDisplay) return null;

// // //   if (loading) return <Typography className="text-center text-gray-500">Loading...</Typography>;

// // //   return (
// // //     <>
// // //       <ToastContainer position="top-right" autoClose={3000} />
// // //       <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
// // //       <div
// // //         className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${
// // //           isOpen ? "translate-x-0" : "translate-x-full"
// // //         } z-50 overflow-y-auto`}
// // //       >
// // //         <div className="p-6">
// // //           <div className="flex justify-between items-center mb-6">
// // //             <Typography variant="h5" className="text-gray-800 font-semibold">
// // //               Add Courses
// // //             </Typography>
// // //             <Button
// // //               onClick={handleClose}
// // //               className="text-gray-500 hover:text-gray-700"
// // //               sx={{ minWidth: 0, padding: 1 }}
// // //             >
// // //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth="2"
// // //                   d="M6 18L18 6M6 6l12 12"
// // //                 />
// // //               </svg>
// // //             </Button>
// // //           </div>

// // //           <PreferredCenters centers={centers} preferredCenters={preferredCenters} />

// // //           {courseEntries.map((entry, courseIndex) => (
// // //             <CourseEntryForm
// // //               key={courseIndex}
// // //               courseIndex={courseIndex}
// // //               entry={entry}
// // //               courses={courses}
// // //               financePartners={financePartners}
// // //               handleChange={handleChange}
// // //               handleFullFeesChange={handleFullFeesChange}
// // //               handleRegistrationChange={handleRegistrationChange}
// // //               handleInstallmentChange={handleInstallmentChange}
// // //               handleFinanceChange={handleFinanceChange}
// // //               handleFileChange={handleFileChange}
// // //               addInstallment={addInstallment}
// // //               removeInstallment={removeInstallment}
// // //               removeCourseEntry={removeCourseEntry}
// // //               canUpdate={canUpdate}
// // //               canDelete={canDelete}
// // //               user={user}
// // //               studentId={studentId}
// // //               getFilteredCourses={getFilteredCourses}
// // //               uploadProgress={uploadProgress}
// // //             />
// // //           ))}

// // //           <div className="flex space-x-4">
// // //             {canCreate && (
// // //               <>
// // //                 <Button
// // //                   variant="contained"
// // //                   onClick={addCourseEntry}
// // //                   className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
// // //                   disabled={!canCreate}
// // //                 >
// // //                   Add Course
// // //                 </Button>
// // //                 <Button
// // //                   variant="contained"
// // //                   onClick={saveEnrollmentData}
// // //                   className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
// // //                   disabled={!canCreate || loading}
// // //                 >
// // //                   {loading ? 'Saving...' : 'Save Enrollment'}
// // //                 </Button>
// // //               </>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default AddCourse;


// // import React, { useState, useEffect } from "react";
// // import { db } from "../../../../config/firebase";
// // import {
// //   collection,
// //   getDocs,
// //   setDoc,
// //   doc,
// //   getDoc,
// //   query,
// //   where,
// //   Timestamp
// // } from "firebase/firestore";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { useAuth } from "../../../../context/AuthContext";
// // import { Button, Typography } from "@mui/material";
// // import { ToastContainer, toast } from "react-toastify";
// // import sendWelcomeEmail from "../../../../services/sendWelcomeEmail";
// // import PreferredCenters from "./PreferredCenters";
// // import CourseEntryForm from "./CourseEntryForm";
// // import { logActivity } from "./utils";
// // import { s3Client } from "../../../../config/aws-config";
// // import { Upload } from "@aws-sdk/lib-storage";
// // import "react-toastify/dist/ReactToastify.css";

// // const AddCourse = () => {
// //   const { studentId } = useParams();
// //   const navigate = useNavigate();
// //   const { user, rolePermissions } = useAuth();
// //   const [courses, setCourses] = useState([]);
// //   const [courseEntries, setCourseEntries] = useState([]);
// //   const [financePartners, setFinancePartners] = useState([]);
// //   const [preferredCenters, setPreferredCenters] = useState([]);
// //   const [centers, setCenters] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [existingCourses, setExistingCourses] = useState([]);
// //   const [uploadProgress, setUploadProgress] = useState({});

// //   // Permission checks
// //   const canDisplay = rolePermissions?.enrollments?.display || false;
// //   const canCreate = rolePermissions?.enrollments?.create || false;
// //   const canUpdate = rolePermissions?.enrollments?.update || false;
// //   const canDelete = rolePermissions?.enrollments?.delete || false;

// //   const defaultFinanceDetails = {
// //     financePartner: "",
// //     contactPerson: "",
// //     scheme: "",
// //     loanAmount: 0,
// //     downPayment: 0,
// //     downPaymentDate: "",
// //     applicantName: "",
// //     relationship: "",
// //     loanStatus: "Pending",
// //     photo: null,
// //     photoName: "",
// //     bankStatement: null,
// //     bankStatementName: "",
// //     paymentSlip: null,
// //     paymentSlipName: "",
// //     aadharCard: null,
// //     aadharCardName: "",
// //     panCard: null,
// //     panCardName: "",
// //     registration: {
// //       amount: "",
// //       date: "",
// //       receivedBy: "",
// //       paymentMethod: "",
// //       remark: "",
// //       status: "Pending",
// //     },
// //     discountType: "",
// //     discountValue: "",
// //     discountReason: "",
// //     feeAfterDiscount: 0,
// //   };

// //   const defaultEntry = {
// //     selectedCourse: "",
// //     mode: "",
// //     feeTemplate: "",
// //     installmentDetails: [
// //       {
// //         number: "",
// //         dueDate: "",
// //         dueAmount: "",
// //         paidDate: "",
// //         paidAmount: "",
// //         paymentMode: "",
// //         pdcStatus: "",
// //         receivedBy: "",
// //         remark: "",
// //         status: "Pending",
// //       },
// //     ],
// //     fullFeesDetails: {
// //       discountType: "",
// //       discountValue: "",
// //       discountReason: "",
// //       feeAfterDiscount: 0,
// //       totalFees: 0,
// //       registration: {
// //         amount: "",
// //         date: "",
// //         receivedBy: "",
// //         paymentMethod: "",
// //         remark: "",
// //         status: "Pending",
// //       },
// //       finalPayment: {
// //         amount: "",
// //         date: "",
// //         receivedBy: "",
// //         paymentMethod: "",
// //         remark: "",
// //         status: "Pending",
// //       },
// //     },
// //     financeDetails: { ...defaultFinanceDetails },
// //     registration: {
// //       amount: "",
// //       date: "",
// //       receivedBy: "",
// //       paymentMethod: "",
// //       remark: "",
// //       status: "Pending",
// //     },
// //     freeReason: "",
// //   };

// //   useEffect(() => {
// //     if (!canDisplay) {
// //       toast.error("You don't have permission to view this page");
// //       logActivity("UNAUTHORIZED_ACCESS_ATTEMPT", { page: "AddCourse" }, user);
// //       navigate("/unauthorized");
// //       return;
// //     }

// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);

// //         // Fetch student data
// //         const studentDoc = await getDoc(doc(db, "student", studentId));
// //         let studentPreferredCenters = [];
// //         if (studentDoc.exists()) {
// //           const studentData = studentDoc.data();
// //           studentPreferredCenters = studentData.preferred_centers || [];
// //           if (!Array.isArray(studentPreferredCenters)) {
// //             console.warn(
// //               "preferred_centers is not an array, defaulting to empty array:",
// //               studentPreferredCenters
// //             );
// //             studentPreferredCenters = [];
// //           }
// //           setPreferredCenters(studentPreferredCenters);
// //           logActivity(
// //             "FETCH_STUDENT_SUCCESS",
// //             {
// //               preferredCenters: studentPreferredCenters.length,
// //               studentId,
// //             },
// //             user
// //           );
// //         } else {
// //           toast.error("Student not found");
// //           logActivity("FETCH_STUDENT_NOT_FOUND", { studentId }, user);
// //           setPreferredCenters([]);
// //         }

// //         // Fetch centers
// //         const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
// //         if (instituteSnapshot.empty) {
// //           console.error("No instituteSetup document found");
// //           setCenters([]);
// //           logActivity(
// //             "FETCH_CENTERS_WARNING",
// //             { message: "No instituteSetup found", studentId },
// //             user
// //           );
// //         } else {
// //           const instituteId = instituteSnapshot.docs[0].id;
// //           const centerQuery = query(
// //             collection(db, "instituteSetup", instituteId, "Center"),
// //             where("isActive", "==", true)
// //           );
// //           const centerSnapshot = await getDocs(centerQuery);
// //           const fetchedCenters = centerSnapshot.docs.map((doc) => ({
// //             id: doc.id,
// //             ...doc.data(),
// //           }));
// //           setCenters(fetchedCenters);
// //           logActivity(
// //             "FETCH_CENTERS_SUCCESS",
// //             { count: fetchedCenters.length, studentId },
// //             user
// //           );
// //         }

// //         // Fetch courses
// //         const coursesSnapshot = await getDocs(collection(db, "Course"));
// //         const fetchedCourses = coursesSnapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));
// //         setCourses(fetchedCourses);
// //         logActivity(
// //           "FETCH_COURSES_SUCCESS",
// //           { count: fetchedCourses.length, studentId },
// //           user
// //         );

// //         // Fetch finance partners
// //         const financePartnersSnapshot = await getDocs(
// //           collection(db, "FinancePartner")
// //         );
// //         const activeFinancePartners = financePartnersSnapshot.docs
// //           .map((doc) => ({ id: doc.id, ...doc.data() }))
// //           .filter((partner) => partner.status === "Active");
// //         setFinancePartners(activeFinancePartners);
// //         logActivity(
// //           "FETCH_FINANCE_PARTNERS_SUCCESS",
// //           { count: activeFinancePartners.length, studentId },
// //           user
// //         );

// //         // Fetch existing enrollment
// //         const enrollmentDoc = await getDoc(doc(db, "enrollments", studentId));
// //         if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
// //           const documentFields = ['photo', 'bankStatement', 'paymentSlip', 'aadharCard', 'panCard'];
// //           const existingCourses = enrollmentDoc.data().courses.map((course) => {
// //             const cleanedFinanceDetails = { ...defaultFinanceDetails, ...course.financeDetails };
// //             // Clean document fields to handle legacy data
// //             documentFields.forEach((docType) => {
// //               const docValue = cleanedFinanceDetails[docType];
// //               if (docValue && typeof docValue === 'object' && docValue.s3Url) {
// //                 cleanedFinanceDetails[docType] = docValue.s3Url;
// //                 cleanedFinanceDetails[`${docType}Name`] = docValue.name || cleanedFinanceDetails[`${docType}Name`] || '';
// //               } else if (docValue && typeof docValue !== 'string') {
// //                 cleanedFinanceDetails[docType] = null;
// //                 cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || '';
// //               } else {
// //                 cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || '';
// //               }
// //             });
// //             return {
// //               ...defaultEntry,
// //               ...course,
// //               selectedCourse:
// //                 fetchedCourses.find((c) => c.id === course.selectedCourse?.id) ||
// //                 course.selectedCourse ||
// //                 "",
// //               financeDetails: cleanedFinanceDetails,
// //               registration: {
// //                 ...defaultEntry.registration,
// //                 ...course.registration,
// //                 status: course.registration?.status || "Pending",
// //               },
// //               installmentDetails: course.installmentDetails?.map((installment) => ({
// //                 ...defaultEntry.installmentDetails[0],
// //                 ...installment,
// //                 status: installment.status || "Pending",
// //               })) || defaultEntry.installmentDetails,
// //               fullFeesDetails: {
// //                 ...defaultEntry.fullFeesDetails,
// //                 ...course.fullFeesDetails,
// //                 registration: {
// //                   ...defaultEntry.fullFeesDetails.registration,
// //                   ...course.fullFeesDetails?.registration,
// //                   status:
// //                     course.fullFeesDetails?.registration?.status || "Pending",
// //                 },
// //                 finalPayment: {
// //                   ...defaultEntry.fullFeesDetails.finalPayment,
// //                   ...course.fullFeesDetails?.finalPayment,
// //                   status:
// //                     course.fullFeesDetails?.finalPayment?.status || "Pending",
// //                 },
// //               },
// //               freeReason: course.freeReason || "",
// //             };
// //           });
// //           setCourseEntries(existingCourses);
// //           setExistingCourses(existingCourses);
// //           logActivity(
// //             "FETCH_ENROLLMENT_SUCCESS",
// //             { courseCount: existingCourses.length, studentId },
// //             user
// //           );
// //         } else {
// //           setCourseEntries([defaultEntry]);
// //           setExistingCourses([]);
// //           logActivity("FETCH_ENROLLMENT_NOT_FOUND", { studentId }, user);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching data: ", error);
// //         toast.error("Failed to fetch data");
// //         logActivity(
// //           "FETCH_DATA_ERROR",
// //           { error: error.message, studentId },
// //           user
// //         );
// //         setCourseEntries([defaultEntry]);
// //         setPreferredCenters([]);
// //         setCenters([]);
// //       } finally {
// //         setLoading(false);
// //         setTimeout(() => setIsOpen(true), 10);
// //       }
// //     };

// //     fetchData();
// //   }, [studentId, canDisplay, navigate, user]);

// //   const handleFileChange = (index, field, event) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update course details");
// //       logActivity(
// //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// //         { action: "uploadFile", field, studentId },
// //         user
// //       );
// //       return;
// //     }

// //     const file = event.target.files[0];
// //     if (file) {
// //       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
// //       if (!allowedTypes.includes(file.type)) {
// //         toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
// //         return;
// //       }
// //       if (file.size > 5 * 1024 * 1024) {
// //         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
// //         return;
// //       }

// //       const updatedEntries = courseEntries.map((entry, i) => {
// //         if (i === index) {
// //           logActivity(
// //             "UPLOAD_FILE",
// //             { field, fileName: file.name, studentId },
// //             user
// //           );
// //           return {
// //             ...entry,
// //             financeDetails: {
// //               ...entry.financeDetails,
// //               [field]: file,
// //               [`${field}Name`]: file.name
// //             },
// //           };
// //         }
// //         return entry;
// //       });
// //       setCourseEntries(updatedEntries);
// //       setUploadProgress((prev) => ({ ...prev, [`${index}_${field}`]: 0 }));
// //     }
// //   };

// //   const uploadFileToS3 = async (file, docType, studentId, courseIndex) => {
// //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// //     const region = import.meta.env.VITE_AWS_REGION;

// //     if (!bucketName || !region) {
// //       const errorMsg = "Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION";
// //       console.error(errorMsg);
// //       toast.error(errorMsg);
// //       throw new Error(errorMsg);
// //     }

// //     if (!file || !(file instanceof File)) {
// //       const errorMsg = `Invalid file for ${docType}: File object is null or not a File instance`;
// //       console.error(errorMsg);
// //       toast.error(errorMsg);
// //       throw new Error(errorMsg);
// //     }

// //     const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
// //     if (!allowedTypes.includes(file.type)) {
// //       const errorMsg = `Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG`;
// //       console.error(errorMsg);
// //       toast.error(errorMsg);
// //       throw new Error(errorMsg);
// //     }
// //     if (file.size > 5 * 1024 * 1024) {
// //       const errorMsg = `File ${file.name} is too large. Maximum size is 5MB`;
// //       console.error(errorMsg);
// //       toast.error(errorMsg);
// //       throw new Error(errorMsg);
// //     }

// //     const fileName = `students/${studentId}/courses/${courseIndex}/${docType}_${Date.now()}_${file.name}`;
// //     const params = {
// //       Bucket: bucketName,
// //       Key: fileName,
// //       Body: file,
// //       ContentType: file.type,
// //     };

// //     try {
// //       console.log(`Uploading ${docType} to S3: ${fileName}`, {
// //         bucket: bucketName,
// //         region,
// //         fileSize: file.size,
// //         fileType: file.type,
// //       });
// //       const upload = new Upload({
// //         client: s3Client,
// //         params,
// //         queueSize: 4,
// //         partSize: 5 * 1024 * 1024,
// //       });

// //       upload.on("httpUploadProgress", (progress) => {
// //         const percent = Math.round((progress.loaded / progress.total) * 100);
// //         console.log(`Upload progress for ${docType}: ${percent}%`);
// //         setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: percent }));
// //       });

// //       await upload.done();

// //       const url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
// //       console.log(`Successfully uploaded ${docType} to S3: ${url}`);
// //       logActivity("UPLOAD_FILE_SUCCESS", { docType, url, studentId, courseIndex }, user);
// //       return url;
// //     } catch (err) {
// //       console.error(`Error uploading ${docType} to S3:`, err);
// //       const errorMsg = `Failed to upload ${docType}: ${err.message}`;
// //       toast.error(errorMsg);
// //       setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: -1 }));
// //       logActivity("UPLOAD_FILE_ERROR", { docType, error: err.message, studentId, courseIndex }, user);
// //       throw new Error(errorMsg);
// //     }
// //   };

// //   const saveEnrollmentData = async () => {
// //     if (!canCreate) {
// //       toast.error("You don't have permission to save enrollment data");
// //       logActivity(
// //         "UNAUTHORIZED_CREATE_ATTEMPT",
// //         { action: "saveEnrollment", studentId },
// //         user
// //       );
// //       return;
// //     }
// //     try {
// //       setLoading(true);

// //       // Validate S3 configuration
// //       if (!import.meta.env.VITE_S3_BUCKET_NAME || !import.meta.env.VITE_AWS_REGION) {
// //         throw new Error("S3 configuration missing: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// //       }
// //       if (!s3Client.config.credentials) {
// //         throw new Error("S3 client credentials not configured");
// //       }

// //       // Prepare updated entries with file uploads
// //       const documentFields = ["photo", "bankStatement", "paymentSlip", "aadharCard", "panCard"];
// //       const uploadErrors = [];
// //       const updatedEntries = await Promise.all(
// //         courseEntries.map(async (entry, index) => {
// //           const uploadedDocuments = {};

// //           // Upload each document
// //           for (const field of documentFields) {
// //             if (entry.financeDetails[field] instanceof File) {
// //               try {
// //                 console.log(`Uploading ${field} for course ${index}`);
// //                 const url = await uploadFileToS3(
// //                   entry.financeDetails[field],
// //                   field,
// //                   studentId,
// //                   index
// //                 );
// //                 uploadedDocuments[field] = url;
// //                 uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
// //               } catch (uploadErr) {
// //                 console.error(`Failed to upload ${field}:`, uploadErr);
// //                 uploadErrors.push(`Failed to upload ${field} for course ${index}: ${uploadErr.message}`);
// //               }
// //             } else if (typeof entry.financeDetails[field] === "string") {
// //               // Preserve existing S3 URL
// //               uploadedDocuments[field] = entry.financeDetails[field];
// //               uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
// //             } else {
// //               // Set to null if no file or URL
// //               uploadedDocuments[field] = null;
// //               uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
// //             }
// //           }

// //           // Clean financeDetails to remove File objects and undefined values
// //           const cleanedFinanceDetails = {};
// //           Object.keys(entry.financeDetails).forEach((key) => {
// //             if (!(entry.financeDetails[key] instanceof File)) {
// //               cleanedFinanceDetails[key] = uploadedDocuments[key] ?? entry.financeDetails[key] ?? "";
// //             }
// //           });

// //           return {
// //             ...entry,
// //             financeDetails: cleanedFinanceDetails,
// //           };
// //         })
// //       );

// //       // Log upload errors but continue saving
// //       if (uploadErrors.length > 0) {
// //         console.warn("Some documents failed to upload:", uploadErrors);
// //         toast.warn(`Some documents failed to upload:\n${uploadErrors.join("\n")}`);
// //       }

// //       // Save enrollment data
// //       console.log("Saving enrollment data to Firestore:", updatedEntries);
// //       await setDoc(
// //         doc(db, "enrollments", studentId),
// //         {
// //           courses: updatedEntries,
// //           updatedAt: Timestamp.now(),
// //         },
// //         { merge: true }
// //       );

// //       // Fetch student data for email
// //       const studentDoc = await getDoc(doc(db, "student", studentId));
// //       if (!studentDoc.exists()) {
// //         throw new Error("Student not found");
// //       }
// //       const studentData = studentDoc.data();
// //       const studentEmail = studentData.email || "";
// //       const studentName = `${studentData.Name}`.trim() || "";

// //       // Check for new courses or updated fee details
// //       const newCourses = updatedEntries.filter(
// //         (entry) =>
// //           !existingCourses.some(
// //             (existing) => existing.selectedCourse?.id === entry.selectedCourse?.id
// //           ) && entry.selectedCourse
// //       );
// //       const updatedFees = updatedEntries.filter((entry) => {
// //         const existing = existingCourses.find(
// //           (e) => e.selectedCourse?.id === entry.selectedCourse?.id
// //         );
// //         if (!existing) return false;
// //         return (
// //           JSON.stringify(entry.fullFeesDetails) !== JSON.stringify(existing.fullFeesDetails) ||
// //           JSON.stringify(entry.financeDetails) !== JSON.stringify(existing.financeDetails) ||
// //           JSON.stringify(entry.installmentDetails) !== JSON.stringify(existing.installmentDetails) ||
// //           JSON.stringify(entry.registration) !== JSON.stringify(existing.registration)
// //         );
// //       });

// //       toast.success("Enrollment data saved successfully!");
// //       logActivity(
// //         "SAVE_ENROLLMENT_SUCCESS",
// //         { courseCount: updatedEntries.length, studentId },
// //         user
// //       );

// //       // Send emails for new courses
// //       for (const course of newCourses) {
// //         if (studentEmail && course.selectedCourse?.name) {
// //           try {
// //             await sendWelcomeEmail(
// //               studentEmail,
// //               studentName,
// //               course.selectedCourse.name
// //             );
// //             logActivity(
// //               "SEND_WELCOME_EMAIL_SUCCESS",
// //               {
// //                 studentId,
// //                 email: studentEmail,
// //                 courseName: course.selectedCourse.name,
// //               },
// //               user
// //             );
// //           } catch (emailError) {
// //             console.error("Failed to send welcome email:", emailError);
// //             toast.warn(
// //               `Enrollment saved, but failed to send welcome email for ${course.selectedCourse.name}`
// //             );
// //             logActivity(
// //               "SEND_WELCOME_EMAIL_ERROR",
// //               {
// //                 studentId,
// //                 email: studentEmail,
// //                 courseName: course.selectedCourse.name,
// //                 error: emailError.message,
// //               },
// //               user
// //             );
// //           }
// //         }
// //       }

// //       handleClose();
// //     } catch (error) {
// //       console.error("Error saving enrollment data:", error);
// //       toast.error(`Failed to save enrollment data: ${error.message}`);
// //       logActivity(
// //         "SAVE_ENROLLMENT_ERROR",
// //         { error: error.message, studentId },
// //         user
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };



// //   const handleClose = () => {
// //     setIsOpen(false);
// //     setTimeout(() => {
// //       navigate(-1);
// //       logActivity("NAVIGATE_BACK", { from: "AddCourse", studentId }, user);
// //     }, 300);
// //   };

// //   const addCourseEntry = () => {
// //     if (!canCreate) {
// //       toast.error("You don't have permission to add courses");
// //       logActivity(
// //         "UNAUTHORIZED_CREATE_ATTEMPT",
// //         { action: "addCourseEntry", studentId },
// //         user
// //       );
// //       return;
// //     }
// //     setCourseEntries([...courseEntries, defaultEntry]);
// //     logActivity("ADD_COURSE_ENTRY", { studentId }, user);
// //   };

// //   const removeCourseEntry = (index) => {
// //     if (!canDelete) {
// //       toast.error("You don't have permission to remove courses");
// //       logActivity(
// //         "UNAUTHORIZED_DELETE_ATTEMPT",
// //         { action: "removeCourseEntry", index, studentId },
// //         user
// //       );
// //       return;
// //     }
// //     setCourseEntries(courseEntries.filter((_, i) => i !== index));
// //     logActivity("REMOVE_COURSE_ENTRY", { index, studentId }, user);
// //   };

// //   const handleChange =async  (index, field, value) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update course details");
// //       logActivity(
// //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// //         { action: "updateCourseEntry", field, studentId },
// //         user
// //       );
// //       return;
// //     }
// //     const updatedEntries = courseEntries.map((entry, i) => {
// //       if (i === index) {
// //         if (field === "selectedCourse") {
// //           logActivity(
// //             "CHANGE_COURSE",
// //             { courseId: value?.id, field, studentId },
// //             user
// //           );
// //           return {
// //             ...entry,
// //             [field]: value,
// //             fullFeesDetails: {
// //               ...entry.fullFeesDetails,
// //               totalFees: value.fee || 0,
// //             },
// //             financeDetails: {
// //               ...entry.financeDetails,
// //               feeAfterDiscount: value.fee || 0,
// //             },
// //           };
// //         } else if (field === "freeReason") {
// //           logActivity("CHANGE_FIELD", { field, value, studentId }, user);
// //           return { ...entry, freeReason: value };
// //         }
// //         return { ...entry, [field]: value };
// //       }
// //       return entry;
// //     });
// //     logActivity("CHANGE_FREE_COURSE", { field, value, studentId }, user);
// //     await setCourseEntries(updatedEntries);
// //   };

// //   const handleFullFeesChange = (index, field, subField, value) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update course details");
// //       logActivity(
// //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// //         { action: "updateFullFees", field, subField, studentId },
// //         user
// //       );
// //       return;
// //     }
// //     const updatedEntries = courseEntries.map((entry, i) => {
// //       if (i === index) {
// //         const fullFeesDetails = { ...entry.fullFeesDetails };
// //         if (field === "discountType") {
// //           fullFeesDetails.discountType = value;
// //         } else if (field === "discountValue") {
// //           fullFeesDetails.discountValue = value;
// //           const totalFees = fullFeesDetails.totalFees || 0;
// //           fullFeesDetails.feeAfterDiscount =
// //             fullFeesDetails.discountType === "percentage"
// //               ? totalFees - totalFees * (Number(value) / 100)
// //               : totalFees - Number(value);
// //         } else if (field === "discountReason") {
// //           fullFeesDetails.discountReason = value;
// //         } else {
// //           fullFeesDetails[field] = {
// //             ...fullFeesDetails[field],
// //             [subField]: value,
// //           };
// //         }
// //         return { ...entry, fullFeesDetails };
// //       }
// //       return entry;
// //     });
// //     logActivity(
// //       "CHANGE_FULL_FEES",
// //       { field, subField, value, studentId },
// //       user
// //     );
// //     setCourseEntries(updatedEntries);
// //   };

// //   const handleRegistrationChange = (index, field, value) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update course details");
// //       logActivity(
// //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// //         { action: "updateRegistration", field, studentId },
// //         user
// //       );
// //       return;
// //     }
// //     const updatedEntries = courseEntries.map((entry, i) => {
// //       if (i === index) {
// //         logActivity(
// //           "CHANGE_REGISTRATION",
// //           { field, value, studentId },
// //           user
// //         );
// //         return {
// //           ...entry,
// //           registration: { ...entry.registration, [field]: value },
// //         };
// //       }
// //       return entry;
// //     });
// //     setCourseEntries(updatedEntries);
// //   };

// //   const handleInstallmentChange = (courseIndex, installmentIndex, field, value) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update course details");
// //       logActivity(
// //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// //         { action: "updateInstallment", field, studentId },
// //         user
// //       );
// //       return;
// //     }
// //     const updatedEntries = courseEntries.map((entry, i) => {
// //       if (i === courseIndex) {
// //         const updatedDetails = entry.installmentDetails.map(
// //           (installment, j) => {
// //             if (j === installmentIndex) {
// //               return { ...installment, [field]: value };
// //             }
// //             return installment;
// //           }
// //         );
// //         return { ...entry, installmentDetails: updatedDetails };
// //       }
// //       return entry;
// //     });
// //     logActivity(
// //       "CHANGE_INSTALLMENT",
// //       { installmentIndex, field, value, studentId },
// //       user
// //     );
// //     setCourseEntries(updatedEntries);
// //   };

// //   const addInstallment = (index) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update course details");
// //       logActivity(
// //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// //         { action: "addInstallment", studentId },
// //         user
// //       );
// //       return;
// //     }
// //     const updatedEntries = courseEntries.map((entry, i) => {
// //       if (i === index) {
// //         logActivity("ADD_INSTALLMENT", { courseIndex: index, studentId }, user);
// //         return {
// //           ...entry,
// //           installmentDetails: [
// //             ...entry.installmentDetails,
// //             {
// //               number: "",
// //               dueDate: "",
// //               dueAmount: "",
// //               paidDate: "",
// //               paidAmount: "",
// //               paymentMode: "",
// //               pdcStatus: "",
// //               receivedBy: "",
// //               remark: "",
// //               status: "Pending",
// //             },
// //           ],
// //         };
// //       }
// //       return entry;
// //     });
// //     setCourseEntries(updatedEntries);
// //   };

// //   const removeInstallment = (courseIndex, installmentIndex) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update course details");
// //       logActivity(
// //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// //         { action: "removeInstallment", installmentIndex, studentId },
// //         user
// //       );
// //       return;
// //     }
// //     const updatedEntries = courseEntries.map((entry, i) => {
// //       if (i === courseIndex) {
// //         logActivity(
// //           "REMOVE_INSTALLMENT",
// //           { courseIndex, installmentIndex, studentId },
// //           user
// //         );
// //         return {
// //           ...entry,
// //           installmentDetails: entry.installmentDetails.filter(
// //             (_, j) => j !== installmentIndex
// //           ),
// //         };
// //       }
// //       return entry;
// //     });
// //     setCourseEntries(updatedEntries);
// //   };

// //   const handleFinanceChange = (index, field, subField, value) => {
// //     if (!canUpdate) {
// //       toast.error("You don't have permission to update course details");
// //       logActivity(
// //         "UNAUTHORIZED_UPDATE_ATTEMPT",
// //         { action: "updateFinance", field, subField, studentId },
// //         user
// //       );
// //       return;
// //     }
// //     const updatedEntries = courseEntries.map((entry, i) => {
// //       if (i === index) {
// //         const financeDetails = { ...entry.financeDetails };
// //         if (field === "discountType") {
// //           financeDetails.discountType = value;
// //         } else if (field === "discountValue") {
// //           financeDetails.discountValue = value;
// //           const totalFees = entry.fullFeesDetails.totalFees || 0;
// //           financeDetails.feeAfterDiscount =
// //             financeDetails.discountType === "percentage"
// //               ? totalFees - totalFees * (Number(value) / 100)
// //               : totalFees - Number(value);
// //         } else if (field === "discountReason") {
// //           financeDetails.discountReason = value;
// //         } else if (subField) {
// //           financeDetails[field] = { ...financeDetails[field], [subField]: value };
// //         } else {
// //           financeDetails[field] = value;
// //         }
// //         if (field === "financePartner") {
// //           financeDetails.contactPerson = "";
// //           financeDetails.scheme = "";
// //         }
// //         return { ...entry, financeDetails };
// //       }
// //       return entry;
// //     });
// //     logActivity(
// //       "CHANGE_FINANCE",
// //       { field, subField, value, studentId },
// //       user
// //     );
// //     setCourseEntries(updatedEntries);
// //   };

// //   const getFilteredCourses = (mode) => {
// //     if (!mode || preferredCenters.length === 0) return [];
// //     return courses.filter((course) => {
// //       const isAvailableAtCenter = course.centers?.some(
// //         (center) =>
// //           center.status === "Active" && preferredCenters.includes(center.centerId)
// //       );
// //       const isAvailableInMode = course.mode === mode;
// //       return isAvailableAtCenter && isAvailableInMode;
// //     });
// //   };

// //   if (!canDisplay) return null;

// //   if (loading) return <Typography className="text-center text-gray-500">Loading...</Typography>;

// //   return (
// //     <>
// //       <ToastContainer position="top-right" autoClose={3000} />
// //       <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
// //       <div
// //         className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
// //           } z-50 overflow-y-auto`}
// //       >
// //         <div className="p-6">
// //           <div className="flex justify-between items-center mb-6">
// //             <Typography variant="h5" className="text-gray-800 font-semibold">
// //               Add Courses
// //             </Typography>
// //             <Button
// //               onClick={handleClose}
// //               className="text-gray-500 hover:text-gray-700"
// //               sx={{ minWidth: 0, padding: 1 }}
// //             >
// //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d="M6 18L18 6M6 6l12 12"
// //                 />
// //               </svg>
// //             </Button>
// //           </div>

// //           <PreferredCenters centers={centers} preferredCenters={preferredCenters} />

// //           {courseEntries.map((entry, courseIndex) => (
// //             <CourseEntryForm
// //               key={courseIndex}
// //               courseIndex={courseIndex}
// //               entry={entry}
// //               courses={courses}
// //               financePartners={financePartners}
// //               handleChange={handleChange}
// //               handleFullFeesChange={handleFullFeesChange}
// //               handleRegistrationChange={handleRegistrationChange}
// //               handleInstallmentChange={handleInstallmentChange}
// //               handleFinanceChange={handleFinanceChange}
// //               handleFileChange={handleFileChange}
// //               addInstallment={addInstallment}
// //               removeInstallment={removeInstallment}
// //               removeCourseEntry={removeCourseEntry}
// //               canUpdate={canUpdate}
// //               canDelete={canDelete}
// //               user={user}
// //               studentId={studentId}
// //               getFilteredCourses={getFilteredCourses}
// //               uploadProgress={uploadProgress}
// //             />
// //           ))}

// //           <div className="flex space-x-4">
// //             {canCreate && (
// //               <>
// //                 <Button
// //                   variant="contained"
// //                   onClick={addCourseEntry}
// //                   className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
// //                   disabled={!canCreate}
// //                 >
// //                   Add Course
// //                 </Button>
// //                 <Button
// //                   variant="contained"
// //                   onClick={saveEnrollmentData}
// //                   className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
// //                   disabled={!canCreate || loading}
// //                 >
// //                   {loading ? 'Saving...' : 'Save Enrollment'}
// //                 </Button>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default AddCourse;



// import React, { useState, useEffect } from "react";
// import { db } from "../../../../config/firebase";
// import {
//   collection,
//   getDocs,
//   setDoc,
//   doc,
//   getDoc,
//   query,
//   where,
//   Timestamp
// } from "firebase/firestore";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../../../../context/AuthContext";
// import { Button, Typography } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";
// import sendWelcomeEmail from "../../../../services/sendWelcomeEmail";
// import PreferredCenters from "./PreferredCenters";
// import CourseEntryForm from "./CourseEntryForm";
// import { logActivity } from "./utils";
// import { s3Client } from "../../../../config/aws-config";
// import { Upload } from "@aws-sdk/lib-storage";
// import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// import "react-toastify/dist/ReactToastify.css";

// const AddCourse = () => {
//   const { studentId } = useParams();
//   const navigate = useNavigate();
//   const { user, rolePermissions } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [courseEntries, setCourseEntries] = useState([]);
//   const [financePartners, setFinancePartners] = useState([]);
//   const [preferredCenters, setPreferredCenters] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [existingCourses, setExistingCourses] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState({});

//   // Permission checks
//   const canDisplay = rolePermissions?.enrollments?.display || false;
//   const canCreate = rolePermissions?.enrollments?.create || false;
//   const canUpdate = rolePermissions?.enrollments?.update || false;
//   const canDelete = rolePermissions?.enrollments?.delete || false;

//   const defaultFinanceDetails = {
//     financePartner: "",
//     contactPerson: "",
//     scheme: "",
//     loanAmount: 0,
//     downPayment: 0,
//     downPaymentDate: "",
//     applicantName: "",
//     relationship: "",
//     loanStatus: "Pending",
//     photo: null,
//     photoName: "",
//     bankStatement: null,
//     bankStatementName: "",
//     paymentSlip: null,
//     paymentSlipName: "",
//     aadharCard: null,
//     aadharCardName: "",
//     panCard: null,
//     panCardName: "",
//     registration: {
//       amount: "",
//       date: "",
//       receivedBy: "",
//       paymentMethod: "",
//       remark: "",
//       status: "Pending",
//     },
//     discountType: "",
//     discountValue: "",
//     discountReason: "",
//     feeAfterDiscount: 0,
//   };

//   const defaultEntry = {
//     selectedCourse: "",
//     mode: "",
//     feeTemplate: "",
//     installmentDetails: [
//       {
//         number: "",
//         dueDate: "",
//         dueAmount: "",
//         paidDate: "",
//         paidAmount: "",
//         paymentMode: "",
//         pdcStatus: "",
//         receivedBy: "",
//         remark: "",
//         status: "Pending",
//       },
//     ],
//     fullFeesDetails: {
//       discountType: "",
//       discountValue: "",
//       discountReason: "",
//       feeAfterDiscount: 0,
//       totalFees: 0,
//       registration: {
//         amount: "",
//         date: "",
//         receivedBy: "",
//         paymentMethod: "",
//         remark: "",
//         status: "Pending",
//       },
//       finalPayment: {
//         amount: "",
//         date: "",
//         receivedBy: "",
//         paymentMethod: "",
//         remark: "",
//         status: "Pending",
//       },
//     },
//     financeDetails: { ...defaultFinanceDetails },
//     registration: {
//       amount: "",
//       date: "",
//       receivedBy: "",
//       paymentMethod: "",
//       remark: "",
//       status: "Pending",
//     },
//     freeReason: "",
//   };

//   useEffect(() => {
//     if (!canDisplay) {
//       toast.error("You don't have permission to view this page");
//       logActivity("UNAUTHORIZED_ACCESS_ATTEMPT", { page: "AddCourse" }, user);
//       navigate("/unauthorized");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch student data
//         const studentDoc = await getDoc(doc(db, "student", studentId));
//         let studentPreferredCenters = [];
//         if (studentDoc.exists()) {
//           const studentData = studentDoc.data();
//           studentPreferredCenters = studentData.preferred_centers || [];
//           if (!Array.isArray(studentPreferredCenters)) {
//             console.warn(
//               "preferred_centers is not an array, defaulting to empty array:",
//               studentPreferredCenters
//             );
//             studentPreferredCenters = [];
//           }
//           setPreferredCenters(studentPreferredCenters);
//           logActivity(
//             "FETCH_STUDENT_SUCCESS",
//             {
//               preferredCenters: studentPreferredCenters.length,
//               studentId,
//             },
//             user
//           );
//         } else {
//           toast.error("Student not found");
//           logActivity("FETCH_STUDENT_NOT_FOUND", { studentId }, user);
//           setPreferredCenters([]);
//         }

//         // Fetch centers
//         const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
//         if (instituteSnapshot.empty) {
//           console.error("No instituteSetup document found");
//           setCenters([]);
//           logActivity(
//             "FETCH_CENTERS_WARNING",
//             { message: "No instituteSetup found", studentId },
//             user
//           );
//         } else {
//           const instituteId = instituteSnapshot.docs[0].id;
//           const centerQuery = query(
//             collection(db, "instituteSetup", instituteId, "Center"),
//             where("isActive", "==", true)
//           );
//           const centerSnapshot = await getDocs(centerQuery);
//           const fetchedCenters = centerSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setCenters(fetchedCenters);
//           logActivity(
//             "FETCH_CENTERS_SUCCESS",
//             { count: fetchedCenters.length, studentId },
//             user
//           );
//         }

//         // Fetch courses
//         const coursesSnapshot = await getDocs(collection(db, "Course"));
//         const fetchedCourses = coursesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCourses(fetchedCourses);
//         logActivity(
//           "FETCH_COURSES_SUCCESS",
//           { count: fetchedCourses.length, studentId },
//           user
//         );

//         // Fetch finance partners
//         const financePartnersSnapshot = await getDocs(
//           collection(db, "FinancePartner")
//         );
//         const activeFinancePartners = financePartnersSnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .filter((partner) => partner.status === "Active");
//         setFinancePartners(activeFinancePartners);
//         logActivity(
//           "FETCH_FINANCE_PARTNERS_SUCCESS",
//           { count: activeFinancePartners.length, studentId },
//           user
//         );

//         // Fetch existing enrollment
//         const enrollmentDoc = await getDoc(doc(db, "enrollments", studentId));
//         if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
//           const documentFields = ['photo', 'bankStatement', 'paymentSlip', 'aadharCard', 'panCard'];
//           const existingCourses = enrollmentDoc.data().courses.map((course) => {
//             const cleanedFinanceDetails = { ...defaultFinanceDetails, ...course.financeDetails };
//             // Clean document fields to handle legacy data
//             documentFields.forEach((docType) => {
//               const docValue = cleanedFinanceDetails[docType];
//               if (docValue && typeof docValue === 'object' && docValue.s3Url) {
//                 cleanedFinanceDetails[docType] = docValue.s3Url;
//                 cleanedFinanceDetails[`${docType}Name`] = docValue.name || cleanedFinanceDetails[`${docType}Name`] || '';
//               } else if (docValue && typeof docValue !== 'string') {
//                 cleanedFinanceDetails[docType] = null;
//                 cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || '';
//               } else {
//                 cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || '';
//               }
//             });
//             return {
//               ...defaultEntry,
//               ...course,
//               selectedCourse:
//                 fetchedCourses.find((c) => c.id === course.selectedCourse?.id) ||
//                 course.selectedCourse ||
//                 "",
//               financeDetails: cleanedFinanceDetails,
//               registration: {
//                 ...defaultEntry.registration,
//                 ...course.registration,
//                 status: course.registration?.status || "Pending",
//               },
//               installmentDetails: course.installmentDetails?.map((installment) => ({
//                 ...defaultEntry.installmentDetails[0],
//                 ...installment,
//                 status: installment.status || "Pending",
//               })) || defaultEntry.installmentDetails,
//               fullFeesDetails: {
//                 ...defaultEntry.fullFeesDetails,
//                 ...course.fullFeesDetails,
//                 registration: {
//                   ...defaultEntry.fullFeesDetails.registration,
//                   ...course.fullFeesDetails?.registration,
//                   status:
//                     course.fullFeesDetails?.registration?.status || "Pending",
//                 },
//                 finalPayment: {
//                   ...defaultEntry.fullFeesDetails.finalPayment,
//                   ...course.fullFeesDetails?.finalPayment,
//                   status:
//                     course.fullFeesDetails?.finalPayment?.status || "Pending",
//                 },
//               },
//               freeReason: course.freeReason || "",
//             };
//           });
//           setCourseEntries(existingCourses);
//           setExistingCourses(existingCourses);
//           logActivity(
//             "FETCH_ENROLLMENT_SUCCESS",
//             { courseCount: existingCourses.length, studentId },
//             user
//           );
//         } else {
//           setCourseEntries([defaultEntry]);
//           setExistingCourses([]);
//           logActivity("FETCH_ENROLLMENT_NOT_FOUND", { studentId }, user);
//         }
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//         toast.error("Failed to fetch data");
//         logActivity(
//           "FETCH_DATA_ERROR",
//           { error: error.message, studentId },
//           user
//         );
//         setCourseEntries([defaultEntry]);
//         setPreferredCenters([]);
//         setCenters([]);
//       } finally {
//         setLoading(false);
//         setTimeout(() => setIsOpen(true), 10);
//       }
//     };

//     fetchData();
//   }, [studentId, canDisplay, navigate, user]);

//   const handleFileChange = (index, field, event, previousUrl) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       logActivity(
//         "UNAUTHORIZED_UPDATE_ATTEMPT",
//         { action: "uploadFile", field, studentId },
//         user
//       );
//       return;
//     }

//     const file = event.target.files[0];
//     if (file) {
//       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
//         return;
//       }

//       const updatedEntries = courseEntries.map((entry, i) => {
//         if (i === index) {
//           logActivity(
//             "UPLOAD_FILE",
//             { field, fileName: file.name, studentId },
//             user
//           );
//           return {
//             ...entry,
//             financeDetails: {
//               ...entry.financeDetails,
//               [field]: file,
//               [`${field}Name`]: file.name,
//               [`${field}PreviousUrl`]: previousUrl || entry.financeDetails[field], // Store previous URL for deletion
//             },
//           };
//         }
//         return entry;
//       });
//       setCourseEntries(updatedEntries);
//       setUploadProgress((prev) => ({ ...prev, [`${index}_${field}`]: 0 }));
//     }
//   };

//   const deleteFileFromS3 = async (s3Url, docType, studentId, courseIndex) => {
//     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//     const region = import.meta.env.VITE_AWS_REGION;

//     if (!bucketName || !region) {
//       const errorMsg = "Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION";
//       console.error(errorMsg);
//       throw new Error(errorMsg);
//     }

//     if (!s3Url || typeof s3Url !== "string") {
//       console.log(`No valid ${docType} URL to delete`);
//       return; // No file to delete
//     }

//     const expectedPrefix = `https://${bucketName}.s3.${region}.amazonaws.com/`;
//     if (!s3Url.startsWith(expectedPrefix)) {
//       console.warn(`Invalid ${docType} URL for deletion: ${s3Url}`);
//       return;
//     }

//     const key = s3Url.replace(expectedPrefix, "");
//     if (!key) {
//       console.warn(`Could not extract S3 key for ${docType} deletion`);
//       return;
//     }

//     try {
//       console.log(`Deleting ${docType} from S3: ${key}`);
//       const command = new DeleteObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//       });
//       await s3Client.send(command);
//       console.log(`Successfully deleted ${docType} from S3: ${s3Url}`);
//       logActivity(
//         "DELETE_FILE_SUCCESS",
//         { docType, url: s3Url, studentId, courseIndex },
//         user
//       );
//     } catch (err) {
//       console.error(`Error deleting ${docType} from S3:`, err);
//       logActivity(
//         "DELETE_FILE_ERROR",
//         { docType, error: err.message, studentId, courseIndex },
//         user
//       );
//       throw new Error(`Failed to delete ${docType}: ${err.message}`);
//     }
//   };

//   const uploadFileToS3 = async (file, docType, studentId, courseIndex, previousUrl) => {
//     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//     const region = import.meta.env.VITE_AWS_REGION;

//     if (!bucketName || !region) {
//       const errorMsg = "Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION";
//       console.error(errorMsg);
//       toast.error(errorMsg);
//       throw new Error(errorMsg);
//     }

//     if (!file || !(file instanceof File)) {
//       const errorMsg = `Invalid file for ${docType}: File object is null or not a File instance`;
//       console.error(errorMsg);
//       toast.error(errorMsg);
//       throw new Error(errorMsg);
//     }

//     const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//     if (!allowedTypes.includes(file.type)) {
//       const errorMsg = `Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG`;
//       console.error(errorMsg);
//       toast.error(errorMsg);
//       throw new Error(errorMsg);
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       const errorMsg = `File ${file.name} is too large. Maximum size is 5MB`;
//       console.error(errorMsg);
//       toast.error(errorMsg);
//       throw new Error(errorMsg);
//     }

//     // Delete previous file if it exists
//     if (previousUrl) {
//       try {
//         await deleteFileFromS3(previousUrl, docType, studentId, courseIndex);
//       } catch (err) {
//         console.warn(`Failed to delete previous ${docType}, proceeding with upload:`, err);
//         // Continue with upload even if deletion fails
//       }
//     }

//     const fileName = `students/${studentId}/courses/${courseIndex}/${docType}_${Date.now()}_${file.name}`;
//     const params = {
//       Bucket: bucketName,
//       Key: fileName,
//       Body: file,
//       ContentType: file.type,
//     };

//     try {
//       console.log(`Uploading ${docType} to S3: ${fileName}`, {
//         bucket: bucketName,
//         region,
//         fileSize: file.size,
//         fileType: file.type,
//       });
//       const upload = new Upload({
//         client: s3Client,
//         params,
//         queueSize: 4,
//         partSize: 5 * 1024 * 1024,
//       });

//       upload.on("httpUploadProgress", (progress) => {
//         const percent = Math.round((progress.loaded / progress.total) * 100);
//         console.log(`Upload progress for ${docType}: ${percent}%`);
//         setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: percent }));
//       });

//       await upload.done();

//       const url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
//       console.log(`Successfully uploaded ${docType} to S3: ${url}`);
//       logActivity("UPLOAD_FILE_SUCCESS", { docType, url, studentId, courseIndex }, user);
//       return url;
//     } catch (err) {
//       console.error(`Error uploading ${docType} to S3:`, err);
//       const errorMsg = `Failed to upload ${docType}: ${err.message}`;
//       toast.error(errorMsg);
//       setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: -1 }));
//       logActivity("UPLOAD_FILE_ERROR", { docType, error: err.message, studentId, courseIndex }, user);
//       throw new Error(errorMsg);
//     }
//   };

//   const saveEnrollmentData = async () => {
//     if (!canCreate) {
//       toast.error("You don't have permission to save enrollment data");
//       logActivity(
//         "UNAUTHORIZED_CREATE_ATTEMPT",
//         { action: "saveEnrollment", studentId },
//         user
//       );
//       return;
//     }
//     try {
//       setLoading(true);

//       // Validate S3 configuration
//       if (!import.meta.env.VITE_S3_BUCKET_NAME || !import.meta.env.VITE_AWS_REGION) {
//         throw new Error("S3 configuration missing: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
//       }
//       if (!s3Client.config.credentials) {
//         throw new Error("S3 client credentials not configured");
//       }

//       // Prepare updated entries with file uploads
//       const documentFields = ["photo", "bankStatement", "paymentSlip", "aadharCard", "panCard"];
//       const uploadErrors = [];
//       const updatedEntries = await Promise.all(
//         courseEntries.map(async (entry, index) => {
//           const uploadedDocuments = {};

//           // Upload each document
//           for (const field of documentFields) {
//             if (entry.financeDetails[field] instanceof File) {
//               try {
//                 console.log(`Uploading ${field} for course ${index}`);
//                 const url = await uploadFileToS3(
//                   entry.financeDetails[field],
//                   field,
//                   studentId,
//                   index,
//                   entry.financeDetails[`${field}PreviousUrl`] || entry.financeDetails[field]
//                 );
//                 uploadedDocuments[field] = url;
//                 uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
//               } catch (uploadErr) {
//                 console.error(`Failed to upload ${field}:`, uploadErr);
//                 uploadErrors.push(`Failed to upload ${field} for course ${index}: ${uploadErr.message}`);
//               }
//             } else if (typeof entry.financeDetails[field] === "string") {
//               // Preserve existing S3 URL
//               uploadedDocuments[field] = entry.financeDetails[field];
//               uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
//             } else {
//               // Set to null if no file or URL
//               uploadedDocuments[field] = null;
//               uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
//             }
//           }

//           // Clean financeDetails to remove File objects and temporary fields
//           const cleanedFinanceDetails = {};
//           Object.keys(entry.financeDetails).forEach((key) => {
//             // Exclude File objects and PreviousUrl fields
//             if (!(entry.financeDetails[key] instanceof File) && !key.endsWith("PreviousUrl")) {
//               cleanedFinanceDetails[key] = uploadedDocuments[key] ?? entry.financeDetails[key] ?? "";
//             }
//           });

//           return {
//             ...entry,
//             financeDetails: cleanedFinanceDetails,
//           };
//         })
//       );

//       // Log upload errors but continue saving
//       if (uploadErrors.length > 0) {
//         console.warn("Some documents failed to upload:", uploadErrors);
//         toast.warn(`Some documents failed to upload:\n${uploadErrors.join("\n")}`);
//       }

//       // Save enrollment data
//       console.log("Saving enrollment data to Firestore:", updatedEntries);
//       await setDoc(
//         doc(db, "enrollments", studentId),
//         {
//           courses: updatedEntries,
//           updatedAt: Timestamp.now(),
//         },
//         { merge: true }
//       );

//       // Fetch student data for email
//       const studentDoc = await getDoc(doc(db, "student", studentId));
//       if (!studentDoc.exists()) {
//         throw new Error("Student not found");
//       }
//       const studentData = studentDoc.data();
//       const studentEmail = studentData.email || "";
//       const studentName = `${studentData.Name}`.trim() || "";

//       // Check for new courses or updated fee details
//       const newCourses = updatedEntries.filter(
//         (entry) =>
//           !existingCourses.some(
//             (existing) => existing.selectedCourse?.id === entry.selectedCourse?.id
//           ) && entry.selectedCourse
//       );
//       const updatedFees = updatedEntries.filter((entry) => {
//         const existing = existingCourses.find(
//           (e) => e.selectedCourse?.id === entry.selectedCourse?.id
//         );
//         if (!existing) return false;
//         return (
//           JSON.stringify(entry.fullFeesDetails) !== JSON.stringify(existing.fullFeesDetails) ||
//           JSON.stringify(entry.financeDetails) !== JSON.stringify(existing.financeDetails) ||
//           JSON.stringify(entry.installmentDetails) !== JSON.stringify(existing.installmentDetails) ||
//           JSON.stringify(entry.registration) !== JSON.stringify(existing.registration)
//         );
//       });

//       toast.success("Enrollment data saved successfully!");
//       logActivity(
//         "SAVE_ENROLLMENT_SUCCESS",
//         { courseCount: updatedEntries.length, studentId },
//         user
//       );

//       // Send emails for new courses
//       for (const course of newCourses) {
//         if (studentEmail && course.selectedCourse?.name) {
//           try {
//             await sendWelcomeEmail(
//               studentEmail,
//               studentName,
//               course.selectedCourse.name
//             );
//             logActivity(
//               "SEND_WELCOME_EMAIL_SUCCESS",
//               {
//                 studentId,
//                 email: studentEmail,
//                 courseName: course.selectedCourse.name,
//               },
//               user
//             );
//           } catch (emailError) {
//             console.error("Failed to send welcome email:", emailError);
//             toast.warn(
//               `Enrollment saved, but failed to send welcome email for ${course.selectedCourse.name}`
//             );
//             logActivity(
//               "SEND_WELCOME_EMAIL_ERROR",
//               {
//                 studentId,
//                 email: studentEmail,
//                 courseName: course.selectedCourse.name,
//                 error: emailError.message,
//               },
//               user
//             );
//           }
//         }
//       }

//       handleClose();
//     } catch (error) {
//       console.error("Error saving enrollment data:", error);
//       toast.error(`Failed to save enrollment data: ${error.message}`);
//       logActivity(
//         "SAVE_ENROLLMENT_ERROR",
//         { error: error.message, studentId },
//         user
//       );
//     } finally {
//       setLoading(false);
//     }
//   };



//   const handleClose = () => {
//     setIsOpen(false);
//     setTimeout(() => {
//       navigate(-1);
//       logActivity("NAVIGATE_BACK", { from: "AddCourse", studentId }, user);
//     }, 300);
//   };

//   const addCourseEntry = () => {
//     if (!canCreate) {
//       toast.error("You don't have permission to add courses");
//       logActivity(
//         "UNAUTHORIZED_CREATE_ATTEMPT",
//         { action: "addCourseEntry", studentId },
//         user
//       );
//       return;
//     }
//     setCourseEntries([...courseEntries, defaultEntry]);
//     logActivity("ADD_COURSE_ENTRY", { studentId }, user);
//   };

//   const removeCourseEntry = (index) => {
//     if (!canDelete) {
//       toast.error("You don't have permission to remove courses");
//       logActivity(
//         "UNAUTHORIZED_DELETE_ATTEMPT",
//         { action: "removeCourseEntry", index, studentId },
//         user
//       );
//       return;
//     }
//     setCourseEntries(courseEntries.filter((_, i) => i !== index));
//     logActivity("REMOVE_COURSE_ENTRY", { index, studentId }, user);
//   };

//   const handleChange = async (index, field, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       logActivity(
//         "UNAUTHORIZED_UPDATE_ATTEMPT",
//         { action: "updateCourseEntry", field, studentId },
//         user
//       );
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === index) {
//         if (field === "selectedCourse") {
//           logActivity(
//             "CHANGE_COURSE",
//             { courseId: value?.id, field, studentId },
//             user
//           );
//           return {
//             ...entry,
//             [field]: value,
//             fullFeesDetails: {
//               ...entry.fullFeesDetails,
//               totalFees: value.fee || 0,
//             },
//             financeDetails: {
//               ...entry.financeDetails,
//               feeAfterDiscount: value.fee || 0,
//             },
//           };
//         } else if (field === "freeReason") {
//           logActivity("CHANGE_FIELD", { field, value, studentId }, user);
//           return { ...entry, freeReason: value };
//         }
//         return { ...entry, [field]: value };
//       }
//       return entry;
//     });
//     logActivity("CHANGE_FREE_COURSE", { field, value, studentId }, user);
//     await setCourseEntries(updatedEntries);
//   };

//   const handleFullFeesChange = (index, field, subField, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       logActivity(
//         "UNAUTHORIZED_UPDATE_ATTEMPT",
//         { action: "updateFullFees", field, subField, studentId },
//         user
//       );
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === index) {
//         const fullFeesDetails = { ...entry.fullFeesDetails };
//         if (field === "discountType") {
//           fullFeesDetails.discountType = value;
//         } else if (field === "discountValue") {
//           fullFeesDetails.discountValue = value;
//           const totalFees = fullFeesDetails.totalFees || 0;
//           fullFeesDetails.feeAfterDiscount =
//             fullFeesDetails.discountType === "percentage"
//               ? totalFees - totalFees * (Number(value) / 100)
//               : totalFees - Number(value);
//         } else if (field === "discountReason") {
//           fullFeesDetails.discountReason = value;
//         } else {
//           fullFeesDetails[field] = {
//             ...fullFeesDetails[field],
//             [subField]: value,
//           };
//         }
//         return { ...entry, fullFeesDetails };
//       }
//       return entry;
//     });
//     logActivity(
//       "CHANGE_FULL_FEES",
//       { field, subField, value, studentId },
//       user
//     );
//     setCourseEntries(updatedEntries);
//   };

//   const handleRegistrationChange = (index, field, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       logActivity(
//         "UNAUTHORIZED_UPDATE_ATTEMPT",
//         { action: "updateRegistration", field, studentId },
//         user
//       );
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === index) {
//         logActivity(
//           "CHANGE_REGISTRATION",
//           { field, value, studentId },
//           user
//         );
//         return {
//           ...entry,
//           registration: { ...entry.registration, [field]: value },
//         };
//       }
//       return entry;
//     });
//     setCourseEntries(updatedEntries);
//   };

//   const handleInstallmentChange = (courseIndex, installmentIndex, field, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       logActivity(
//         "UNAUTHORIZED_UPDATE_ATTEMPT",
//         { action: "updateInstallment", field, studentId },
//         user
//       );
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === courseIndex) {
//         const updatedDetails = entry.installmentDetails.map(
//           (installment, j) => {
//             if (j === installmentIndex) {
//               return { ...installment, [field]: value };
//             }
//             return installment;
//           }
//         );
//         return { ...entry, installmentDetails: updatedDetails };
//       }
//       return entry;
//     });
//     logActivity(
//       "CHANGE_INSTALLMENT",
//       { installmentIndex, field, value, studentId },
//       user
//     );
//     setCourseEntries(updatedEntries);
//   };

//   const addInstallment = (index) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       logActivity(
//         "UNAUTHORIZED_UPDATE_ATTEMPT",
//         { action: "addInstallment", studentId },
//         user
//       );
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === index) {
//         logActivity("ADD_INSTALLMENT", { courseIndex: index, studentId }, user);
//         return {
//           ...entry,
//           installmentDetails: [
//             ...entry.installmentDetails,
//             {
//               number: "",
//               dueDate: "",
//               dueAmount: "",
//               paidDate: "",
//               paidAmount: "",
//               paymentMode: "",
//               pdcStatus: "",
//               receivedBy: "",
//               remark: "",
//               status: "Pending",
//             },
//           ],
//         };
//       }
//       return entry;
//     });
//     setCourseEntries(updatedEntries);
//   };

//   const removeInstallment = (courseIndex, installmentIndex) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       logActivity(
//         "UNAUTHORIZED_UPDATE_ATTEMPT",
//         { action: "removeInstallment", installmentIndex, studentId },
//         user
//       );
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === courseIndex) {
//         logActivity(
//           "REMOVE_INSTALLMENT",
//           { courseIndex, installmentIndex, studentId },
//           user
//         );
//         return {
//           ...entry,
//           installmentDetails: entry.installmentDetails.filter(
//             (_, j) => j !== installmentIndex
//           ),
//         };
//       }
//       return entry;
//     });
//     setCourseEntries(updatedEntries);
//   };

//   const handleFinanceChange = (index, field, subField, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       logActivity(
//         "UNAUTHORIZED_UPDATE_ATTEMPT",
//         { action: "updateFinance", field, subField, studentId },
//         user
//       );
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === index) {
//         const financeDetails = { ...entry.financeDetails };
//         if (field === "discountType") {
//           financeDetails.discountType = value;
//         } else if (field === "discountValue") {
//           financeDetails.discountValue = value;
//           const totalFees = entry.fullFeesDetails.totalFees || 0;
//           financeDetails.feeAfterDiscount =
//             financeDetails.discountType === "percentage"
//               ? totalFees - totalFees * (Number(value) / 100)
//               : totalFees - Number(value);
//         } else if (field === "discountReason") {
//           financeDetails.discountReason = value;
//         } else if (subField) {
//           financeDetails[field] = { ...financeDetails[field], [subField]: value };
//         } else {
//           financeDetails[field] = value;
//         }
//         if (field === "financePartner") {
//           financeDetails.contactPerson = "";
//           financeDetails.scheme = "";
//         }
//         return { ...entry, financeDetails };
//       }
//       return entry;
//     });
//     logActivity(
//       "CHANGE_FINANCE",
//       { field, subField, value, studentId },
//       user
//     );
//     setCourseEntries(updatedEntries);
//   };

//   const getFilteredCourses = (mode) => {
//     if (!mode || preferredCenters.length === 0) return [];
//     return courses.filter((course) => {
//       const isAvailableAtCenter = course.centers?.some(
//         (center) =>
//           center.status === "Active" && preferredCenters.includes(center.centerId)
//       );
//       const isAvailableInMode = course.mode === mode;
//       return isAvailableAtCenter && isAvailableInMode;
//     });
//   };

//   if (!canDisplay) return null;

//   if (loading) return <Typography className="text-center text-gray-500">Loading...</Typography>;

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
//       <div
//         className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } z-50 overflow-y-auto`}
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <Typography variant="h5" className="text-gray-800 font-semibold">
//               Add Courses
//             </Typography>
//             <Button
//               onClick={handleClose}
//               className="text-gray-500 hover:text-gray-700"
//               sx={{ minWidth: 0, padding: 1 }}
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </Button>
//           </div>

//           <PreferredCenters centers={centers} preferredCenters={preferredCenters} />

//           {courseEntries.map((entry, courseIndex) => (
//             <CourseEntryForm
//               key={courseIndex}
//               courseIndex={courseIndex}
//               entry={entry}
//               courses={courses}
//               financePartners={financePartners}
//               handleChange={handleChange}
//               handleFullFeesChange={handleFullFeesChange}
//               handleRegistrationChange={handleRegistrationChange}
//               handleInstallmentChange={handleInstallmentChange}
//               handleFinanceChange={handleFinanceChange}
//               handleFileChange={handleFileChange}
//               addInstallment={addInstallment}
//               removeInstallment={removeInstallment}
//               removeCourseEntry={removeCourseEntry}
//               canUpdate={canUpdate}
//               canDelete={canDelete}
//               user={user}
//               studentId={studentId}
//               getFilteredCourses={getFilteredCourses}
//               uploadProgress={uploadProgress}
//             />
//           ))}

//           <div className="flex space-x-4">
//             {canCreate && (
//               <>
//                 <Button
//                   variant="contained"
//                   onClick={addCourseEntry}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                   disabled={!canCreate}
//                 >
//                   Add Course
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={saveEnrollmentData}
//                   className="bg-green-600 hover:bg-green-700 text-white"
//                   disabled={!canCreate || loading}
//                 >
//                   {loading ? "Saving..." : "Save Enrollment"}
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );

// };

// export default AddCourse;


import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  query,
  where,
  Timestamp
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { Button, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import sendWelcomeEmail from "../../../../services/sendWelcomeEmail";
import PreferredCenters from "./PreferredCenters";
import CourseEntryForm from "./CourseEntryForm";
import { logActivity } from "./utils";
import { s3Client } from "../../../../config/aws-config";
import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import "react-toastify/dist/ReactToastify.css";

const AddCourse = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();
  const [courses, setCourses] = useState([]);
  const [courseEntries, setCourseEntries] = useState([]);
  const [financePartners, setFinancePartners] = useState([]);
  const [preferredCenters, setPreferredCenters] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [existingCourses, setExistingCourses] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Permission checks
  const canDisplay = rolePermissions?.enrollments?.display || false;
  const canCreate = rolePermissions?.enrollments?.create || false;
  const canUpdate = rolePermissions?.enrollments?.update || false;
  const canDelete = rolePermissions?.enrollments?.delete || false;

  const defaultFinanceDetails = {
    financePartner: "",
    contactPerson: "",
    scheme: "",
    loanAmount: 0,
    downPayment: 0,
    downPaymentDate: "",
    applicantName: "",
    relationship: "",
    loanStatus: "Pending",
    photo: null,
    photoName: "",
    bankStatement: null,
    bankStatementName: "",
    paymentSlip: null,
    paymentSlipName: "",
    aadharCard: null,
    aadharCardName: "",
    panCard: null,
    panCardName: "",
    registration: {
      amount: "",
      date: "",
      receivedBy: "",
      paymentMethod: "",
      remark: "",
      status: "Pending",
    },
    discountType: "",
    discountValue: "",
    discountReason: "",
    feeAfterDiscount: 0,
  };

  const defaultEntry = {
    selectedCourse: "",
    mode: "",
    feeTemplate: "",
    installmentDetails: [
      {
        number: "",
        dueDate: "",
        dueAmount: "",
        paidDate: "",
        paidAmount: "",
        paymentMode: "",
        pdcStatus: "",
        receivedBy: "",
        remark: "",
        status: "Pending",
      },
    ],
    fullFeesDetails: {
      discountType: "",
      discountValue: "",
      discountReason: "",
      feeAfterDiscount: 0,
      totalFees: 0,
      registration: {
        amount: "",
        date: "",
        receivedBy: "",
        paymentMethod: "",
        remark: "",
        status: "Pending",
      },
      finalPayment: {
        amount: "",
        date: "",
        receivedBy: "",
        paymentMethod: "",
        remark: "",
        status: "Pending",
      },
    },
    financeDetails: { ...defaultFinanceDetails },
    registration: {
      amount: "",
      date: "",
      receivedBy: "",
      paymentMethod: "",
      remark: "",
      status: "Pending",
    },
    freeReason: "",
  };

  useEffect(() => {
    if (!canDisplay) {
      toast.error("You don't have permission to view this page");
      logActivity("UNAUTHORIZED_ACCESS_ATTEMPT", { page: "AddCourse" }, user);
      navigate("/unauthorized");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch student data
        const studentDoc = await getDoc(doc(db, "student", studentId));
        let studentPreferredCenters = [];
        if (studentDoc.exists()) {
          const studentData = studentDoc.data();
          studentPreferredCenters = studentData.preferred_centers || [];
          if (!Array.isArray(studentPreferredCenters)) {
            console.warn(
              "preferred_centers is not an array, defaulting to empty array:",
              studentPreferredCenters
            );
            studentPreferredCenters = [];
          }
          setPreferredCenters(studentPreferredCenters);
          logActivity(
            "FETCH_STUDENT_SUCCESS",
            {
              preferredCenters: studentPreferredCenters.length,
              studentId,
            },
            user
          );
        } else {
          toast.error("Student not found");
          logActivity("FETCH_STUDENT_NOT_FOUND", { studentId }, user);
          setPreferredCenters([]);
        }

        // Fetch centers
        const instituteSnapshot = await getDocs(collection(db, "instituteSetup"));
        if (instituteSnapshot.empty) {
          console.error("No instituteSetup document found");
          setCenters([]);
          logActivity(
            "FETCH_CENTERS_WARNING",
            { message: "No instituteSetup found", studentId },
            user
          );
        } else {
          const instituteId = instituteSnapshot.docs[0].id;
          const centerQuery = query(
            collection(db, "instituteSetup", instituteId, "Center"),
            where("isActive", "==", true)
          );
          const centerSnapshot = await getDocs(centerQuery);
          const fetchedCenters = centerSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCenters(fetchedCenters);
          logActivity(
            "FETCH_CENTERS_SUCCESS",
            { count: fetchedCenters.length, studentId },
            user
          );
        }

        // Fetch courses
        const coursesSnapshot = await getDocs(collection(db, "Course"));
        const fetchedCourses = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(fetchedCourses);
        logActivity(
          "FETCH_COURSES_SUCCESS",
          { count: fetchedCourses.length, studentId },
          user
        );


        // Fetch finance partners
        const financePartnersSnapshot = await getDocs(
          collection(db, "FinancePartner")
        );
        const activeFinancePartners = financePartnersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((partner) => partner.status === "Active");
        setFinancePartners(activeFinancePartners);
        logActivity(
          "FETCH_FINANCE_PARTNERS_SUCCESS",
          { count: activeFinancePartners.length, studentId },
          user
        );

        // Fetch existing enrollment
        const enrollmentDoc = await getDoc(doc(db, "enrollments", studentId));
        if (enrollmentDoc.exists() && enrollmentDoc.data().courses) {
          const documentFields = ['photo', 'bankStatement', 'paymentSlip', 'aadharCard', 'panCard'];
          const existingCourses = enrollmentDoc.data().courses.map((course) => {
            const cleanedFinanceDetails = { ...defaultFinanceDetails, ...course.financeDetails };
            // Clean document fields to handle legacy data
            documentFields.forEach((docType) => {
              const docValue = cleanedFinanceDetails[docType];
              if (docValue && typeof docValue === 'object' && docValue.s3Url) {
                cleanedFinanceDetails[docType] = docValue.s3Url;
                cleanedFinanceDetails[`${docType}Name`] = docValue.name || cleanedFinanceDetails[`${docType}Name`] || '';
              } else if (docValue && typeof docValue !== 'string') {
                cleanedFinanceDetails[docType] = null;
                cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || '';
              } else {
                cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || '';
              }
            });
            return {
              ...defaultEntry,
              ...course,
              selectedCourse:
                fetchedCourses.find((c) => c.id === course.selectedCourse?.id) ||
                course.selectedCourse ||
                "",
              financeDetails: cleanedFinanceDetails,
              registration: {
                ...defaultEntry.registration,
                ...course.registration,
                status: course.registration?.status || "Pending",
              },
              installmentDetails: course.installmentDetails?.map((installment) => ({
                ...defaultEntry.installmentDetails[0],
                ...installment,
                status: installment.status || "Pending",
              })) || defaultEntry.installmentDetails,
              fullFeesDetails: {
                ...defaultEntry.fullFeesDetails,
                ...course.fullFeesDetails,
                registration: {
                  ...defaultEntry.fullFeesDetails.registration,
                  ...course.fullFeesDetails?.registration,
                  status:
                    course.fullFeesDetails?.registration?.status || "Pending",
                },
                finalPayment: {
                  ...defaultEntry.fullFeesDetails.finalPayment,
                  ...course.fullFeesDetails?.finalPayment,
                  status:
                    course.fullFeesDetails?.finalPayment?.status || "Pending",
                },
              },
              freeReason: course.freeReason || "",
            };
          });
          setCourseEntries(existingCourses);
          setExistingCourses(existingCourses);
          logActivity(
            "FETCH_ENROLLMENT_SUCCESS",
            { courseCount: existingCourses.length, studentId },
            user
          );
        } else {
          setCourseEntries([defaultEntry]);
          setExistingCourses([]);
          logActivity("FETCH_ENROLLMENT_NOT_FOUND", { studentId }, user);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch data");
        logActivity(
          "FETCH_DATA_ERROR",
          { error: error.message, studentId },
          user
        );
        setCourseEntries([defaultEntry]);
        setPreferredCenters([]);
        setCenters([]);
      } finally {
        setLoading(false);
        setTimeout(() => setIsOpen(true), 10);
      }
    };

    fetchData();
  }, [studentId, canDisplay, navigate, user]);

  const handleFileChange = (index, field, event) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update course details");
      return;
    }
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      const updatedEntries = courseEntries.map((entry, i) => {
        if (i === index) {
          logActivity("UPLOAD_FILE_INIT", { field, fileName: file.name, studentId }, user);
          return {
            ...entry,
            financeDetails: {
              ...entry.financeDetails,
              [field]: file,
              [`${field}Name`]: file.name,
              [`${field}PreviousUrl`]: entry.financeDetails[field] && typeof entry.financeDetails[field] === 'string'
                ? entry.financeDetails[field]
                : null,
            },
          };
        }
        return entry;
      });
      setCourseEntries(updatedEntries);
      setUploadProgress((prev) => ({ ...prev, [`${index}_${field}`]: 0 }));
    }
  };

  // const handleFileChange = (index, field, event) => {
  //   if (!canUpdate) {
  //     toast.error("You don't have permission to update course details");
  //     logActivity(
  //       "UNAUTHORIZED_UPDATE_ATTEMPT",
  //       { action: "uploadFile", field, studentId },
  //       user
  //     );
  //     return;
  //   }

  //   const file = event.target.files[0];
  //   if (file) {
  //     const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  //     if (!allowedTypes.includes(file.type)) {
  //       toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
  //       return;
  //     }
  //     if (file.size > 5 * 1024 * 1024) {
  //       toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
  //       return;
  //     }

  //     const updatedEntries = courseEntries.map((entry, i) => {
  //       if (i === index) {
  //         logActivity(
  //           "UPLOAD_FILE_INIT",
  //           { field, fileName: file.name, studentId },
  //           user
  //         );
  //         return {
  //           ...entry,
  //           financeDetails: {
  //             ...entry.financeDetails,
  //             [field]: file,
  //             [`${field}Name`]: file.name,
  //             [`${field}PreviousUrl`]: entry.financeDetails[field] && typeof entry.financeDetails[field] === 'string'
  //               ? entry.financeDetails[field]
  //               : null,
  //           },
  //         };
  //       }
  //       return entry;
  //     });
  //     setCourseEntries(updatedEntries);
  //     setUploadProgress((prev) => ({ ...prev, [`${index}_${field}`]: 0 }));
  //   }
  // };

  const deleteFileFromS3 = async (s3Url, docType, studentId, courseIndex) => {
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;

    if (!bucketName || !region) {
      const errorMsg = "Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (!s3Url || typeof s3Url !== "string") {
      console.log(`No valid ${docType} URL to delete`);
      return;
    }

    let key;
    const urlPatterns = [
      new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
      new RegExp(`https://${bucketName}\\.s3\\-accelerated\\.${region}\\.amazonaws\\.com/(.+)`),
      new RegExp(`https://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
    ];

    for (const pattern of urlPatterns) {
      const match = s3Url.match(pattern);
      if (match && match[1]) {
        key = decodeURIComponent(match[1]);
        break;
      }
    }

    if (!key) {
      console.warn(`Invalid ${docType} URL for deletion: ${s3Url}`);
      return;
    }

    try {
      console.log(`Deleting ${docType} from S3:`, { bucket: bucketName, key });
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await s3Client.send(command);
      console.log(`Successfully deleted ${docType} from S3: ${s3Url}`);
      logActivity(
        "DELETE_FILE_SUCCESS",
        { docType, url: s3Url, studentId, courseIndex },
        user
      );
    } catch (err) {
      console.error(`Error deleting ${docType} from S3:`, {
        error: err.message,
        code: err.code,
        requestId: err.$metadata?.requestId,
      });
      logActivity(
        "DELETE_FILE_ERROR",
        { docType, error: err.message, studentId, courseIndex },
        user
      );
      throw err; // Re-throw to ensure caller handles the error
    }
  };

  const uploadFileToS3 = async (file, docType, studentId, courseIndex, previousUrl) => {
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;
    // Validation and configuration checks
    const fileName = `students/${studentId}/courses/${courseIndex}/${docType}_${Date.now()}_${file.name}`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };
    try {
      console.log(`Uploading ${docType} to S3:`, { bucket: bucketName, key: fileName, region, fileSize: file.size, fileType: file.type });
      const upload = new Upload({
        client: s3Client,
        params,
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
      });
      upload.on("httpUploadProgress", (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress((prev) => ({
          ...prev,
          [`${courseIndex}_${docType}`]: percent,
        }));
      });
      await upload.done();
      const url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
      logActivity("UPLOAD_FILE_SUCCESS", { docType, url, studentId, courseIndex }, user);
      return url;
    } catch (err) {
      // Error handling
      setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: -1 }));
      throw new Error(`Failed to upload ${docType}: ${err.message}`);
    }
  };

  // const uploadFileToS3 = async (file, docType, studentId, courseIndex, previousUrl) => {
  //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
  //   const region = import.meta.env.VITE_AWS_REGION;

  //   if (!bucketName || !region) {
  //     const errorMsg = "Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION";
  //     console.error(errorMsg);
  //     toast.error(errorMsg);
  //     throw new Error(errorMsg);
  //   }

  //   if (!file || !(file instanceof File)) {
  //     const errorMsg = `Invalid file for ${docType}: File object is null or not a File instance`;
  //     console.error(errorMsg);
  //     toast.error(errorMsg);
  //     throw new Error(errorMsg);
  //   }

  //   const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  //   if (!allowedTypes.includes(file.type)) {
  //     const errorMsg = `Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG`;
  //     console.error(errorMsg);
  //     toast.error(errorMsg);
  //     throw new Error(errorMsg);
  //   }
  //   if (file.size > 5 * 1024 * 1024) {
  //     const errorMsg = `File ${file.name} is too large. Maximum size is 5MB`;
  //     console.error(errorMsg);
  //     toast.error(errorMsg);
  //     throw new Error(errorMsg);
  //   }

  //   // Delete previous file if it exists
  //   if (previousUrl && typeof previousUrl === "string") {
  //     try {
  //       await deleteFileFromS3(previousUrl, docType, studentId, courseIndex);
  //     } catch (err) {
  //       console.warn(`Failed to delete previous ${docType}, proceeding with upload:`, err);
  //     }
  //   }

  //   const fileName = `students/${studentId}/courses/${courseIndex}/${docType}_${Date.now()}_${file.name}`;
  //   const params = {
  //     Bucket: bucketName,
  //     Key: fileName,
  //     Body: file,
  //     ContentType: file.type,
  //   };

  //   try {
  //     console.log(`Uploading ${docType} to S3:`, {
  //       bucket: bucketName,
  //       key: fileName,
  //       region,
  //       fileSize: file.size,
  //       fileType: file.type,
  //     });
  //     const upload = new Upload({
  //       client: s3Client,
  //       params,
  //       queueSize: 4,
  //       partSize: 5 * 1024 * 1024,
  //     });

  //     upload.on("httpUploadProgress", (progress) => {
  //       const percent = Math.round((progress.loaded / progress.total) * 100);
  //       console.log(`Upload progress for ${docType}: ${percent}%`);
  //       setUploadProgress((prev) => ({
  //         ...prev,
  //         [`${courseIndex}_${docType}`]: percent,
  //       }));
  //     });

  //     await upload.done();

  //     const url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
  //     console.log(`Successfully uploaded ${docType} to S3: ${url}`);
  //     logActivity("UPLOAD_FILE_SUCCESS", { docType, url, studentId, courseIndex }, user);
  //     return url;
  //   } catch (err) {
  //     console.error(`Error uploading ${docType} to S3:`, {
  //       error: err.message,
  //       code: err.code,
  //       requestId: err.$metadata?.requestId,
  //     });
  //     const errorMsg = `Failed to upload ${docType}: ${err.message}`;
  //     toast.error(errorMsg);
  //     setUploadProgress((prev) => ({
  //       ...prev,
  //       [`${courseIndex}_${docType}`]: -1,
  //     }));
  //     logActivity("UPLOAD_FILE_ERROR", { docType, error: err.message, studentId, courseIndex }, user);
  //     throw new Error(errorMsg);
  //   }
  // };

  // const saveEnrollmentData = async () => {
  //   if (!canCreate) {
  //     toast.error("You don't have permission to save enrollment data");
  //     logActivity(
  //       "UNAUTHORIZED_CREATE_ATTEMPT",
  //       { action: "saveEnrollment", studentId },
  //       user
  //     );
  //     return;
  //   }
  //   try {
  //     setLoading(true);

  //     // Validate S3 configuration
  //     if (!import.meta.env.VITE_S3_BUCKET_NAME || !import.meta.env.VITE_AWS_REGION) {
  //       throw new Error("S3 configuration missing: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
  //     }
  //     if (!s3Client.config.credentials) {
  //       throw new Error("S3 client credentials not configured");
  //     }

  //     // Prepare updated entries with file uploads
  //     const documentFields = ["photo", "bankStatement", "paymentSlip", "aadharCard", "panCard"];
  //     const uploadErrors = [];
  //     const updatedEntries = await Promise.all(
  //       courseEntries.map(async (entry, index) => {
  //         const uploadedDocuments = {};

  //         // Upload each document
  //         for (const field of documentFields) {
  //           if (entry.financeDetails[field] instanceof File) {
  //             try {
  //               console.log(`Uploading ${field} for course ${index}`);
  //               const url = await uploadFileToS3(
  //                 entry.financeDetails[field],
  //                 field,
  //                 studentId,
  //                 index,
  //                 entry.financeDetails[`${field}PreviousUrl`]
  //               );
  //               uploadedDocuments[field] = url;
  //               uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
  //             } catch (uploadErr) {
  //               console.error(`Failed to upload ${field}:`, uploadErr);
  //               uploadErrors.push(`Failed to upload ${field} for course ${index}: ${uploadErr.message}`);
  //             }
  //           } else if (typeof entry.financeDetails[field] === "string") {
  //             uploadedDocuments[field] = entry.financeDetails[field];
  //             uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
  //           } else {
  //             uploadedDocuments[field] = null;
  //             uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
  //           }
  //         }

  //         // Clean financeDetails to remove File objects and temporary fields
  //         const cleanedFinanceDetails = {};
  //         Object.keys(entry.financeDetails).forEach((key) => {
  //           if (!(entry.financeDetails[key] instanceof File) && !key.endsWith("PreviousUrl")) {
  //             cleanedFinanceDetails[key] = uploadedDocuments[key] ?? entry.financeDetails[key] ?? "";
  //           }
  //         });

  //         return {
  //           ...entry,
  //           financeDetails: cleanedFinanceDetails,
  //         };
  //       })
  //     );

  //     // Log upload errors but continue saving
  //     if (uploadErrors.length > 0) {
  //       console.warn("Some documents failed to upload:", uploadErrors);
  //       toast.warn(`Some documents failed to upload:\n${uploadErrors.join("\n")}`);
  //     }

  //     // Save enrollment data
  //     console.log("Saving enrollment data to Firestore:", updatedEntries);
  const saveEnrollmentData = async () => {
    const documentFields = ["photo", "bankStatement", "paymentSlip", "aadharCard", "panCard"];
    const updatedEntries = await Promise.all(
      courseEntries.map(async (entry, index) => {
        const uploadedDocuments = {};
        for (const field of documentFields) {
          if (entry.financeDetails[field] instanceof File) {
            const url = await uploadFileToS3(
              entry.financeDetails[field],
              field,
              studentId,
              index,
              entry.financeDetails[`${field}PreviousUrl`]
            );
            uploadedDocuments[field] = url;
            uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
          } else if (typeof entry.financeDetails[field] === "string") {
            uploadedDocuments[field] = entry.financeDetails[field];
            uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
          } else {
            uploadedDocuments[field] = null;
            uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
          }
        }
        const cleanedFinanceDetails = {};
        Object.keys(entry.financeDetails).forEach((key) => {
          if (!(entry.financeDetails[key] instanceof File) && !key.endsWith("PreviousUrl")) {
            cleanedFinanceDetails[key] = uploadedDocuments[key] ?? entry.financeDetails[key] ?? "";
          }
        });
        return { ...entry, financeDetails: cleanedFinanceDetails };
      })
    );
    await setDoc(doc(db, "enrollments", studentId), { courses: updatedEntries, updatedAt: Timestamp.now() }, { merge: true });
    // await setDoc(
    //       doc(db, "enrollments", studentId),
    //       {
    //         courses: updatedEntries,
    //         updatedAt: Timestamp.now(),
    //       },
    //       { merge: true }
    //     );

    // Fetch student data for email
    const studentDoc = await getDoc(doc(db, "student", studentId));
    if (!studentDoc.exists()) {
      throw new Error("Student not found");
    }
    const studentData = studentDoc.data();
    const studentEmail = studentData.email || "";
    const studentName = `${studentData.Name}`.trim() || "";

    // Check for new courses or updated fee details
    const newCourses = updatedEntries.filter(
      (entry) =>
        !existingCourses.some(
          (existing) => existing.selectedCourse?.id === entry.selectedCourse?.id
        ) && entry.selectedCourse
    );
    const updatedFees = updatedEntries.filter((entry) => {
      const existing = existingCourses.find(
        (e) => e.selectedCourse?.id === entry.selectedCourse?.id
      );
      if (!existing) return false;
      return (
        JSON.stringify(entry.fullFeesDetails) !== JSON.stringify(existing.fullFeesDetails) ||
        JSON.stringify(entry.financeDetails) !== JSON.stringify(existing.financeDetails) ||
        JSON.stringify(entry.installmentDetails) !== JSON.stringify(existing.installmentDetails) ||
        JSON.stringify(entry.registration) !== JSON.stringify(existing.registration)
      );
    });

    toast.success("Enrollment data saved successfully!");
    logActivity(
      "SAVE_ENROLLMENT_SUCCESS",
      { courseCount: updatedEntries.length, studentId },
      user
    );

    // Send emails for new courses
    for (const course of newCourses) {
      if (studentEmail && course.selectedCourse?.name) {
        try {
          await sendWelcomeEmail(
            studentEmail,
            studentName,
            course.selectedCourse.name
          );
          logActivity(
            "SEND_WELCOME_EMAIL_SUCCESS",
            {
              studentId,
              email: studentEmail,
              courseName: course.selectedCourse.name,
            },
            user
          );
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          toast.warn(
            `Enrollment saved, but failed to send welcome email for ${course.selectedCourse.name}`
          );
          logActivity(
            "SEND_WELCOME_EMAIL_ERROR",
            {
              studentId,
              email: studentEmail,
              courseName: course.selectedCourse.name,
              error: emailError.message,
            },
            user
          );
        }
      }
    }

    handleClose();
  //  catch (error) {
  //   console.error("Error saving enrollment data:", {
  //     error: error.message,
  //     code: error.code,
  //     requestId: error.$metadata?.requestId,
  //   });
  //   toast.error(`Failed to save enrollment data: ${error.message}`);
  //   logActivity(
  //     "SAVE_ENROLLMENT_ERROR",
  //     { error: error.message, studentId },
  //     user
  //   );
  // } finally {
  //   setLoading(false);
  // }
};

const handleClose = () => {
  setIsOpen(false);
  setTimeout(() => {
    navigate(-1);
    logActivity("NAVIGATE_BACK", { from: "AddCourse", studentId }, user);
  }, 300);
};

const addCourseEntry = () => {
  if (!canCreate) {
    toast.error("You don't have permission to add courses");
    logActivity(
      "UNAUTHORIZED_CREATE_ATTEMPT",
      { action: "addCourseEntry", studentId },
      user
    );
    return;
  }
  setCourseEntries([...courseEntries, defaultEntry]);
  logActivity("ADD_COURSE_ENTRY", { studentId }, user);
};

const removeCourseEntry = (index) => {
  if (!canDelete) {
    toast.error("You don't have permission to remove courses");
    logActivity(
      "UNAUTHORIZED_DELETE_ATTEMPT",
      { action: "removeCourseEntry", index, studentId },
      user
    );
    return;
  }
  setCourseEntries(courseEntries.filter((_, i) => i !== index));
  logActivity("REMOVE_COURSE_ENTRY", { index, studentId }, user);
};

const handleChange = async (index, field, value) => {
  if (!canUpdate) {
    toast.error("You don't have permission to update course details");
    logActivity(
      "UNAUTHORIZED_UPDATE_ATTEMPT",
      { action: "updateCourseEntry", field, studentId },
      user
    );
    return;
  }
  const updatedEntries = courseEntries.map((entry, i) => {
    if (i === index) {
      if (field === "selectedCourse") {
        logActivity(
          "CHANGE_COURSE",
          { courseId: value?.id, field, studentId },
          user
        );
        return {
          ...entry,
          [field]: value,
          fullFeesDetails: {
            ...entry.fullFeesDetails,
            totalFees: value.fee || 0,
          },
          financeDetails: {
            ...entry.financeDetails,
            feeAfterDiscount: value.fee || 0,
          },
        };
      } else if (field === "freeReason") {
        logActivity("CHANGE_FIELD", { field, value, studentId }, user);
        return { ...entry, freeReason: value };
      }
      return { ...entry, [field]: value };
    }
    return entry;
  });
  setCourseEntries(updatedEntries);
};

const handleFullFeesChange = (index, field, subField, value) => {
  if (!canUpdate) {
    toast.error("You don't have permission to update course details");
    logActivity(
      "UNAUTHORIZED_UPDATE_ATTEMPT",
      { action: "updateFullFees", field, subField, studentId },
      user
    );
    return;
  }
  const updatedEntries = courseEntries.map((entry, i) => {
    if (i === index) {
      const fullFeesDetails = { ...entry.fullFeesDetails };
      if (field === "discountType") {
        fullFeesDetails.discountType = value;
      } else if (field === "discountValue") {
        fullFeesDetails.discountValue = value;
        const totalFees = fullFeesDetails.totalFees || 0;
        fullFeesDetails.feeAfterDiscount =
          fullFeesDetails.discountType === "percentage"
            ? totalFees - totalFees * (Number(value) / 100)
            : totalFees - Number(value);
      } else if (field === "discountReason") {
        fullFeesDetails.discountReason = value;
      } else {
        fullFeesDetails[field] = {
          ...fullFeesDetails[field],
          [subField]: value,
        };
      }
      return { ...entry, fullFeesDetails };
    }
    return entry;
  });
  logActivity(
    "CHANGE_FULL_FEES",
    { field, subField, value, studentId },
    user
  );
  setCourseEntries(updatedEntries);
};

const handleRegistrationChange = (index, field, value) => {
  if (!canUpdate) {
    toast.error("You don't have permission to update course details");
    logActivity(
      "UNAUTHORIZED_UPDATE_ATTEMPT",
      { action: "updateRegistration", field, studentId },
      user
    );
    return;
  }
  const updatedEntries = courseEntries.map((entry, i) => {
    if (i === index) {
      logActivity(
        "CHANGE_REGISTRATION",
        { field, value, studentId },
        user
      );
      return {
        ...entry,
        registration: { ...entry.registration, [field]: value },
      };
    }
    return entry;
  });
  setCourseEntries(updatedEntries);
};

const handleInstallmentChange = (courseIndex, installmentIndex, field, value) => {
  if (!canUpdate) {
    toast.error("You don't have permission to update course details");
    logActivity(
      "UNAUTHORIZED_UPDATE_ATTEMPT",
      { action: "updateInstallment", field, studentId },
      user
    );
    return;
  }
  const updatedEntries = courseEntries.map((entry, i) => {
    if (i === courseIndex) {
      const updatedDetails = entry.installmentDetails.map(
        (installment, j) => {
          if (j === installmentIndex) {
            return { ...installment, [field]: value };
          }
          return installment;
        }
      );
      return { ...entry, installmentDetails: updatedDetails };
    }
    return entry;
  });
  logActivity(
    "CHANGE_INSTALLMENT",
    { installmentIndex, field, value, studentId },
    user
  );
  setCourseEntries(updatedEntries);
};

const addInstallment = (index) => {
  if (!canUpdate) {
    toast.error("You don't have permission to update course details");
    logActivity(
      "UNAUTHORIZED_UPDATE_ATTEMPT",
      { action: "addInstallment", studentId },
      user
    );
    return;
  }
  const updatedEntries = courseEntries.map((entry, i) => {
    if (i === index) {
      logActivity("ADD_INSTALLMENT", { courseIndex: index, studentId }, user);
      return {
        ...entry,
        installmentDetails: [
          ...entry.installmentDetails,
          {
            number: "",
            dueDate: "",
            dueAmount: "",
            paidDate: "",
            paidAmount: "",
            paymentMode: "",
            pdcStatus: "",
            receivedBy: "",
            remark: "",
            status: "Pending",
          },
        ],
      };
    }
    return entry;
  });
  setCourseEntries(updatedEntries);
};

const removeInstallment = (courseIndex, installmentIndex) => {
  if (!canUpdate) {
    toast.error("You don't have permission to update course details");
    logActivity(
      "UNAUTHORIZED_UPDATE_ATTEMPT",
      { action: "removeInstallment", installmentIndex, studentId },
      user
    );
    return;
  }
  const updatedEntries = courseEntries.map((entry, i) => {
    if (i === courseIndex) {
      logActivity(
        "REMOVE_INSTALLMENT",
        { courseIndex, installmentIndex, studentId },
        user
      );
      return {
        ...entry,
        installmentDetails: entry.installmentDetails.filter(
          (_, j) => j !== installmentIndex
        ),
      };
    }
    return entry;
  });
  setCourseEntries(updatedEntries);
};

const handleFinanceChange = (index, field, subField, value) => {
  if (!canUpdate) {
    toast.error("You don't have permission to update course details");
    logActivity(
      "UNAUTHORIZED_UPDATE_ATTEMPT",
      { action: "updateFinance", field, subField, studentId },
      user
    );
    return;
  }
  const updatedEntries = courseEntries.map((entry, i) => {
    if (i === index) {
      const financeDetails = { ...entry.financeDetails };
      if (field === "discountType") {
        financeDetails.discountType = value;
      } else if (field === "discountValue") {
        financeDetails.discountValue = value;
        const totalFees = entry.fullFeesDetails.totalFees || 0;
        financeDetails.feeAfterDiscount =
          financeDetails.discountType === "percentage"
            ? totalFees - totalFees * (Number(value) / 100)
            : totalFees - Number(value);
      } else if (field === "discountReason") {
        financeDetails.discountReason = value;
      } else if (subField) {
        financeDetails[field] = { ...financeDetails[field], [subField]: value };
      } else {
        financeDetails[field] = value;
      }
      if (field === "financePartner") {
        financeDetails.contactPerson = "";
        financeDetails.scheme = "";
      }
      return { ...entry, financeDetails };
    }
    return entry;
  });
  logActivity(
    "CHANGE_FINANCE",
    { field, subField, value, studentId },
    user
  );
  setCourseEntries(updatedEntries);
};

const getFilteredCourses = (mode) => {
  if (!mode || preferredCenters.length === 0) return [];
  return courses.filter((course) => {
    const isAvailableAtCenter = course.centers?.some(
      (center) =>
        center.status === "Active" && preferredCenters.includes(center.centerId)
    );
    const isAvailableInMode = course.mode === mode;
    return isAvailableAtCenter && isAvailableInMode;
  });
};

if (!canDisplay) return null;

if (loading) return <Typography className="text-center text-gray-500">Loading...</Typography>;

return (
  <>
    <ToastContainer position="top-right" autoClose={3000} />
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
    <div
      className={`fixed top-0 right-0 h-full bg-gray-50 w-3/4 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
        } z-50 overflow-y-auto`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5" className="text-gray-800 font-semibold">
            Add Courses
          </Typography>
          <Button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            sx={{ minWidth: 0, padding: 1 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        <PreferredCenters centers={centers} preferredCenters={preferredCenters} />

        {courseEntries.map((entry, courseIndex) => (
          <CourseEntryForm
            key={courseIndex}
            courseIndex={courseIndex}
            entry={entry}
            courses={courses}
            financePartners={financePartners}
            handleChange={handleChange}
            handleFullFeesChange={handleFullFeesChange}
            handleRegistrationChange={handleRegistrationChange}
            handleInstallmentChange={handleInstallmentChange}
            handleFinanceChange={handleFinanceChange}
            handleFileChange={handleFileChange}
            addInstallment={addInstallment}
            removeInstallment={removeInstallment}
            removeCourseEntry={removeCourseEntry}
            canUpdate={canUpdate}
            canDelete={canDelete}
            user={user}
            studentId={studentId}
            getFilteredCourses={getFilteredCourses}
            uploadProgress={uploadProgress}
          />
        ))}

        <div className="flex space-x-4">
          {canCreate && (
            <>
              <Button
                variant="contained"
                onClick={addCourseEntry}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!canCreate}
              >
                Add Course
              </Button>
              <Button
                variant="contained"
                onClick={saveEnrollmentData}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!canCreate || loading}
              >
                {loading ? "Saving..." : "Save Enrollment"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  </>
);
};

export default AddCourse;