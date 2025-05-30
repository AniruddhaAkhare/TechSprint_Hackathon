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
//   Timestamp,
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
//   const [isSaving, setIsSaving] = useState(false);

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
//     selectedCourse: null,
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

//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch student data
//         const studentDoc = await getDoc(doc(db, "student", studentId));
//         let studentPreferredCenters = [];
//         if (studentDoc.exists() && isMounted) {
//           const studentData = studentDoc.data();
//           studentPreferredCenters = Array.isArray(studentData.preferred_centers)
//             ? studentData.preferred_centers
//             : [];
//           setPreferredCenters(studentPreferredCenters);
//         } else if (isMounted) {
//           toast.error("Student not found");
//           logActivity("FETCH_STUDENT_NOT_FOUND", { studentId }, user);
//           setPreferredCenters([]);
//         }

//         // Fetch centers
//         const instituteId = "RDJ9wMXGrIUk221MzDxP";
//         const centerQuery = query(
//           collection(db, "instituteSetup", instituteId, "Center"),
//           where("isActive", "==", true)
//         );
//         const centerSnapshot = await getDocs(centerQuery);
//         const fetchedCenters = centerSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         if (isMounted) setCenters(fetchedCenters);

//         // Fetch courses
//         const coursesSnapshot = await getDocs(collection(db, "Course"));
//         const fetchedCourses = coursesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         if (isMounted) setCourses(fetchedCourses);

//         // Fetch finance partners
//         const financePartnersSnapshot = await getDocs(collection(db, "FinancePartner"));
//         const activeFinancePartners = financePartnersSnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .filter((partner) => partner.status === "Active");
//         if (isMounted) setFinancePartners(activeFinancePartners);

//         // Fetch existing enrollment
//         const enrollmentDoc = await getDoc(doc(db, "enrollments", studentId));
//         if (enrollmentDoc.exists() && enrollmentDoc.data().courses && isMounted) {
//           const documentFields = ["photo", "bankStatement", "paymentSlip", "aadharCard", "panCard"];
//           const existingCourses = enrollmentDoc.data().courses.map((course) => {
//             const cleanedFinanceDetails = { ...defaultFinanceDetails, ...course.financeDetails };
//             documentFields.forEach((docType) => {
//               const docValue = cleanedFinanceDetails[docType];
//               if (docValue && typeof docValue === "object" && docValue.s3Url) {
//                 cleanedFinanceDetails[docType] = docValue.s3Url;
//                 cleanedFinanceDetails[`${docType}Name`] = docValue.name || cleanedFinanceDetails[`${docType}Name`] || "";
//               } else if (docValue && typeof docValue !== "string") {
//                 cleanedFinanceDetails[docType] = null;
//                 cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || "";
//               } else {
//                 cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || "";
//               }
//             });
//             return {
//               ...defaultEntry,
//               ...course,
//               selectedCourse:
//                 fetchedCourses.find((c) => c.id === course.selectedCourse?.id) ||
//                 course.selectedCourse ||
//                 null,
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
//                   status: course.fullFeesDetails?.registration?.status || "Pending",
//                 },
//                 finalPayment: {
//                   ...defaultEntry.fullFeesDetails.finalPayment,
//                   ...course.fullFeesDetails?.finalPayment,
//                   status: course.fullFeesDetails?.finalPayment?.status || "Pending",
//                 },
//               },
//               freeReason: course.freeReason || "",
//             };
//           });
//           if (isMounted) {
//             setCourseEntries(existingCourses);
//             setExistingCourses(existingCourses);
//           }
//         } else if (isMounted) {
//           setCourseEntries([defaultEntry]);
//           setExistingCourses([]);
//         }
//       } catch (error) {
//         if (isMounted) {
//           toast.error("Failed to fetch data");
//           logActivity("FETCH_DATA_ERROR", { error: error.message, studentId }, user);
//           setCourseEntries([defaultEntry]);
//           setPreferredCenters([]);
//           setCenters([]);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//           setIsOpen(true); // Removed setTimeout for simplicity; adjust if animation is critical
//         }
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false; // Cleanup on unmount
//     };
//   }, [studentId, canDisplay, navigate, user]);

//   const handleFileChange = (index, field, event) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       return;
//     }
//     const file = event.target.files[0];
//     if (file) {
//       const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
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
//           logActivity("UPLOAD_FILE_INIT", { field, fileName: file.name, studentId }, user);
//           return {
//             ...entry,
//             financeDetails: {
//               ...entry.financeDetails,
//               [field]: file,
//               [`${field}Name`]: file.name,
//               [`${field}PreviousUrl`]: entry.financeDetails[field] && typeof entry.financeDetails[field] === "string"
//                 ? entry.financeDetails[field]
//                 : null,
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
//       logActivity("S3_CONFIG_ERROR", { error: errorMsg, studentId, courseIndex }, user);
//       throw new Error(errorMsg);
//     }

//     if (!s3Url || typeof s3Url !== "string") {
//       return;
//     }

//     let key;
//     const urlPatterns = [
//       new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
//       new RegExp(`https://${bucketName}\\.s3\\-accelerated\\.${region}\\.amazonaws\\.com/(.+)`),
//       new RegExp(`https://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
//     ];

//     for (const pattern of urlPatterns) {
//       const match = s3Url.match(pattern);
//       if (match && match[1]) {
//         key = decodeURIComponent(match[1]);
//         break;
//       }
//     }

//     if (!key) {
//       console.warn(`Invalid ${docType} URL for deletion: ${s3Url}`);
//       return;
//     }

//     try {
//       const command = new DeleteObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//       });
//       await s3Client.send(command);
//       logActivity("DELETE_FILE_SUCCESS", { docType, url: s3Url, studentId, courseIndex }, user);
//     } catch (err) {
//       logActivity("DELETE_FILE_ERROR", { docType, error: err.message, studentId, courseIndex }, user);
//       throw err;
//     }
//   };

//   const uploadFileToS3 = async (file, docType, studentId, courseIndex) => {
//     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//     const region = import.meta.env.VITE_AWS_REGION;
//     if (!bucketName || !region) {
//       const errorMsg = "Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION";
//       logActivity("S3_CONFIG_ERROR", { error: errorMsg, studentId, courseIndex }, user);
//       throw new Error(errorMsg);
//     }
//     const fileName = `students/${studentId}/courses/${courseIndex}/${docType}_${Date.now()}_${file.name}`;
//     const params = {
//       Bucket: bucketName,
//       Key: fileName,
//       Body: file,
//       ContentType: file.type,
//     };
//     try {
//       const upload = new Upload({
//         client: s3Client,
//         params,
//         queueSize: 4,
//         partSize: 5 * 1024 * 1024,
//       });
//       upload.on("httpUploadProgress", (progress) => {
//         const percent = Math.round((progress.loaded / progress.total) * 100);
//         setUploadProgress((prev) => ({
//           ...prev,
//           [`${courseIndex}_${docType}`]: percent,
//         }));
//       });
//       await upload.done();
//       const url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
//       logActivity("UPLOAD_FILE_SUCCESS", { docType, url, studentId, courseIndex }, user);
//       return { url, name: file.name };
//     } catch (err) {
//       setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: -1 }));
//       logActivity("UPLOAD_FILE_ERROR", { docType, error: err.message, studentId, courseIndex }, user);
//       throw new Error(`Failed to upload ${docType}: ${err.message}`);
//     }
//   };

//   const saveEnrollmentData = async () => {
//   if (!canCreate) {
//     toast.error("You don't have permission to save enrollments");
//     return;
//   }
//   setIsSaving(true);
//   setLoading(true);
//   try {
//     const documentFields = ["photo", "bankStatement", "paymentSlip", "aadharCard", "panCard"];
//     const entriesToProcess = courseEntries.map((entry, index) => ({
//       entry,
//       index,
//       hasFilesToUpload: documentFields.some((field) => entry.financeDetails[field] instanceof File),
//     }));

//     const updatedEntries = await Promise.all(
//       entriesToProcess.map(async ({ entry, index }) => {
//         if (!entry.hasFilesToUpload) {
//           const cleanedFinanceDetails = { ...entry.financeDetails };
//           documentFields.forEach((field) => {
//             if (typeof cleanedFinanceDetails[field] === "string") {
//               cleanedFinanceDetails[field] = cleanedFinanceDetails[field];
//               cleanedFinanceDetails[`${field}Name`] = cleanedFinanceDetails[`${field}Name`] || "";
//             } else {
//               cleanedFinanceDetails[field] = null;
//               cleanedFinanceDetails[`${field}Name`] = cleanedFinanceDetails[`${field}Name`] || "";
//             }
//           });
//           return { ...entry, financeDetails: cleanedFinanceDetails };
//         }

//         const uploadedDocuments = {};
//         for (const field of documentFields) {
//           if (entry.financeDetails[field] instanceof File) {
//             if (entry.financeDetails[`${field}PreviousUrl`]) {
//               try {
//                 await deleteFileFromS3(entry.financeDetails[`${field}PreviousUrl`], field, studentId, index);
//               } catch (err) {
//                 toast.warn(`Failed to delete previous ${field}, proceeding with upload`);
//               }
//             }
//             const { url, name } = await uploadFileToS3(
//               entry.financeDetails[field],
//               field,
//               studentId,
//               index
//             );
//             uploadedDocuments[field] = url;
//             uploadedDocuments[`${field}Name`] = name;
//           } else if (typeof entry.financeDetails[field] === "string") {
//             uploadedDocuments[field] = entry.financeDetails[field];
//             uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
//           } else {
//             uploadedDocuments[field] = null;
//             uploadedDocuments[`${field}Name`] = entry.financeDetails[`${field}Name`] || "";
//           }
//         }

//         const cleanedFinanceDetails = {};
//         Object.keys(entry.financeDetails).forEach((key) => {
//           if (!(entry.financeDetails[key] instanceof File) && !key.endsWith("PreviousUrl")) {
//             cleanedFinanceDetails[key] = uploadedDocuments[key] || entry.financeDetails[key] || "";
//           }
//         });

//         return { ...entry, financeDetails: cleanedFinanceDetails };
//       })
//     );

//     // Save to Firestore
//     await setDoc(
//       doc(db, "enrollments", studentId),
//       {
//         courses: updatedEntries,
//         updatedAt: Timestamp.now(),
//       },
//       { merge: true }
//     );

//     const studentDoc = await getDoc(doc(db, "student", studentId));
//     if (!studentDoc.exists()) {
//       throw new Error("Student not found");
//     }
//     const studentData = studentDoc.data();
//     const studentEmail = studentData.email || "";
//     const studentName = `${studentData.name}`.trim() || "";

//     const newCourses = updatedEntries.filter(
//       (entry) =>
//         !existingCourses.some(
//           (existing) => existing.selectedCourse?.id === entry.selectedCourse?.id
//         ) &&
//         entry.selectedCourse
//     );
//     const updatedFees = updatedEntries.filter((entry) => {
//       const existing = existingCourses.find(
//         (e) => e.selectedCourse?.id === entry?.selectedCourse?.id
//       );
//       if (!existing) return false;
//       return (
//         entry.fullFeesDetails.totalFees !== existing.fullFeesDetails.totalFees ||
//         entry.fullFeesDetails.feeAfterDiscount !== existing.fullFeesDetails.feeAfterDiscount ||
//         entry.financeDetails.loanAmount !== existing.financeDetails.loanAmount ||
//         entry.registration.amount !== existing.registration.amount ||
//         entry.installmentDetails.length !== existing.installmentDetails.length
//       );
//     });

//     toast.success("Enrollment data saved successfully!");
//     logActivity("SAVE_ENROLLMENT_SUCCESS", { courseCount: updatedEntries.length, studentId }, user);

//     // Send welcome emails asynchronously
//     for (const course of newCourses) {
//       if (studentEmail && course.selectedCourse?.name) {
//         try {
//           await sendWelcomeEmail(studentEmail, studentName, course.selectedCourse.name);
//           logActivity(
//             "STUDENT_WELCOME_EMAIL_SUCCESS",
//             {
//               studentId,
//               email: studentEmail,
//               courseName: course.selectedCourse.name,
//             },
//             user
//           );
//         } catch (emailError) {
//           toast.warn(
//             `Enrollment saved, but failed to send welcome email for ${course.selectedCourse.name}`
//           );
//           logActivity(
//             "STUDENT_WELCOME_EMAIL_ERROR",
//             {
//               studentId,
//               email: studentEmail,
//               courseName: course.selectedCourse.name,
//               error: emailError.message,
//             },
//             user
//           );
//         }
//       }
//     }

//     handleClose();
//   } catch (error) {
//     toast.error(`Failed to save enrollment data: ${error.message}`);
//     logActivity("SAVE_ENROLLMENT_ERROR", { error: error.message, studentId }, user);
//   } finally {
//     setIsSaving(false);
//     setLoading(false);
//   }
// };

//   const handleClose = () => {
//     if (isSaving) {
//       toast.warn("Please wait, saving is in progress...");
//       return;
//     }
//     setIsOpen(false);
//     // setTimeout(() => {
//     //   // navigate(`/student-details/${studentId}`);
//     //   navigate(-1);
//     //   logActivity("NAVIGATION_BACK", { from: "AddCourse", studentId }, user);
//     // }, 100);
//       navigate(`/studentdetails/${studentId}`);
//       logActivity("NAVIGATION_BACK", { from: "AddCourse", studentId }, user);
//   };

//   const addCourseEntry = () => {
//     if (!canCreate) {
//       toast.error("You don't have permission to add courses");
//       logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "addCourseEntry", studentId }, user);
//       return;
//     }
//     setCourseEntries([...courseEntries, defaultEntry]);
//     logActivity("ADD_COURSE_ENTRY", { studentId }, user);
//   };

//   const removeCourseEntry = (index) => {
//     if (!canDelete) {
//       toast.error("You don't have permission to remove courses");
//       logActivity("UNAUTHORIZED_DELETE_ATTEMPT", { action: "removeCourseEntry", index, studentId }, user);
//       return;
//     }
//     setCourseEntries(courseEntries.filter((_, i) => i !== index));
//     logActivity("REMOVE_COURSE", { index, studentId }, user);
//   };

//   const handleChange = async (index, field, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "updateCourseEntry", field }, user);
//       return false;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === index) {
//         if (field === "selectedCourse") {
//           logActivity("CHANGE_COURSE", { courseId: value?.id, field, studentId }, user);
//           return {
//             ...entry,
//             [field]: value,
//             fullFeesDetails: {
//               ...entry.fullFeesDetails,
//               totalFees: value?.fee || 0,
//             },
//             financeDetails: {
//               ...entry.financeDetails,
//               feeAfterDiscount: value?.fee || 0,
//             },
//           };
//         } else if (field === "freeReason") {
//           logActivity("CHANGE_FIELD", { field, value }, user);
//           return { ...entry, freeReason: value };
//         }
//         return { ...entry, [field]: value };
//       }
//       return entry;
//     });
//     setCourseEntries(updatedEntries);
//     return true;
//   };

//   const handleFullFeesChange = (index, field, subField, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
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
//     logActivity("FULL_FEES_CHANGE", { field, subField, value, studentId }, user);
//     setCourseEntries(updatedEntries);
//   };

//   const handleRegistrationChange = (index, field, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === index) {
//         logActivity("CHANGE_REGISTRATION", { field, value, studentId }, user);
//         return {
//           ...entry,
//           registration: { ...entry.registration, [field]: value },
//         };
//       }
//       return entry;
//     });
//     setCourseEntries(updatedEntries);
//   };

//   const handleInstallmentChange = (courseIndex, index, field, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === courseIndex) {
//         const updatedDetails = entry.installmentDetails.map((installment, j) => {
//           if (j === index) {
//             return { ...installment, [field]: value };
//           }
//           return installment;
//         });
//         return { ...entry, installmentDetails: updatedDetails };
//       }
//       return entry;
//     });
//     logActivity("UPDATE_INSTALLMENT", { index, field, value, studentId }, user);
//     setCourseEntries(updatedEntries);
//   };

//   const addInstallment = (index) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
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
//               status: "Pending",
//             },
//           ],
//         };
//       }
//       return entry;
//     });
//     setCourseEntries(updatedEntries);
//   };

//   const removeInstallment = (courseIndex, index) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
//       return;
//     }
//     const updatedEntries = courseEntries.map((entry, i) => {
//       if (i === courseIndex) {
//         logActivity("REMOVE_INSTALLMENT", { courseIndex, index, studentId }, user);
//         return {
//           ...entry,
//           installmentDetails: entry.installmentDetails.filter((_, j) => j !== index),
//         };
//       }
//       return entry;
//     });
//     setCourseEntries(updatedEntries);
//   };

//   const handleFinanceChange = (index, field, subField, value) => {
//     if (!canUpdate) {
//       toast.error("You don't have permission to update course details");
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
//     logActivity("CHANGE_FINE", { field, subField, value, studentId }, user);
//     setCourseEntries(updatedEntries);
//   };

//   const getFilteredCourses = (mode, coursesList = courses, centersList = preferredCenters) => {
//     if (!mode) {
//       console.warn("No mode provided, returning empty array.");
//       return [];
//     }
//     if (!Array.isArray(coursesList) || coursesList.length === 0) {
//       console.warn("No courses provided or courses array empty.");
//       return [];
//     }
//     return coursesList.filter((course) => {
//       const isAvailableInMode = course.mode?.toLowerCase() === mode.toLowerCase();
//       const isAvailableAtCenter =
//         centersList.length === 0 || !Array.isArray(course.centers)
//           ? true
//           : course.centers.some(
//               (center) =>
//                 center?.status === "Active" && centersList.includes(center?.centerId)
//             );
//       return isAvailableInMode && isAvailableAtCenter;
//     });
//   };

//   if (!canDisplay) return null;

//   if (loading && !isSaving) {
//     return (
//       <Typography className="text-center text-gray-600">
//         Loading...
//       </Typography>
//     );
//   }

//   if (!courses.length) {
//     return (
//       <Typography className="text-center text-gray-600">
//         No courses available. Please add courses to Firestore.
//       </Typography>
//     );
//   }

//   return (
//     <>
//       <ToastContainer position="bottom-right" autoClose={3000} />
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
//       <div
//         className={`fixed top-0 right-0 h-full bg-gray-100 w-3/4 shadow-lg transform transition-transform duration-300 ${
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
//               disabled={isSaving || loading}
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
//               preferredCenters={preferredCenters}
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
//               setUploadProgress = {setUploadProgress}
//             />
//           ))}

//           <div className="flex space-x-4">
//             {canCreate && (
//               <>
//                 <Button
//                   variant="contained"
//                   onClick={addCourseEntry}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                   disabled={!canCreate || isSaving}
//                 >
//                   Add Course
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={saveEnrollmentData}
//                   className="bg-green-600 hover:bg-green-700 text-white"
//                   disabled={isSaving || !canCreate || loading}
//                 >
//                   {isSaving ? "Saving..." : "Save Enrollment"}
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
  Timestamp,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { Button, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import sendWelcomeEmail from "../../../../services/sendWelcomeEmail";
import PreferredCenters from "./PreferredCenters";
import CourseEntryForm from "./CourseEntryForm";
import { logActivity } from "./utils";
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
  const [isSaving, setIsSaving] = useState(false);

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
    selectedCourse: null,
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

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch student data
        const studentDoc = await getDoc(doc(db, "student", studentId));
        let studentPreferredCenters = [];
        if (studentDoc.exists() && isMounted) {
          const studentData = studentDoc.data();
          studentPreferredCenters = Array.isArray(studentData.preferred_centers)
            ? studentData.preferred_centers
            : [];
          setPreferredCenters(studentPreferredCenters);
        } else if (isMounted) {
          toast.error("Student not found");
          logActivity("FETCH_STUDENT_NOT_FOUND", { studentId }, user);
          setPreferredCenters([]);
        }

        // Fetch centers
        const instituteId = "RDJ9wMXGrIUk221MzDxP";
        const centerQuery = query(
          collection(db, "instituteSetup", instituteId, "Center"),
          where("isActive", "==", true)
        );
        const centerSnapshot = await getDocs(centerQuery);
        const fetchedCenters = centerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (isMounted) setCenters(fetchedCenters);

        // Fetch courses
        const coursesSnapshot = await getDocs(collection(db, "Course"));
        const fetchedCourses = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (isMounted) setCourses(fetchedCourses);

        // Fetch finance partners
        const financePartnersSnapshot = await getDocs(collection(db, "FinancePartner"));
        const activeFinancePartners = financePartnersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((partner) => partner.status === "Active");
        if (isMounted) setFinancePartners(activeFinancePartners);

        // Fetch existing enrollment
        const enrollmentDoc = await getDoc(doc(db, "enrollments", studentId));
        if (enrollmentDoc.exists() && enrollmentDoc.data().courses && isMounted) {
          const documentFields = ["photo", "bankStatement", "paymentSlip", "aadharCard", "panCard"];
          const existingCourses = enrollmentDoc.data().courses.map((course) => {
            const cleanedFinanceDetails = { ...defaultFinanceDetails, ...course.financeDetails };
            documentFields.forEach((docType) => {
              const docValue = cleanedFinanceDetails[docType];
              if (docValue && typeof docValue === "object" && docValue.s3Url) {
                cleanedFinanceDetails[docType] = docValue.s3Url;
                cleanedFinanceDetails[`${docType}Name`] = docValue.name || cleanedFinanceDetails[`${docType}Name`] || "";
              } else if (docValue && typeof docValue !== "string") {
                cleanedFinanceDetails[docType] = null;
                cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || "";
              } else {
                cleanedFinanceDetails[`${docType}Name`] = cleanedFinanceDetails[`${docType}Name`] || "";
              }
            });
            return {
              ...defaultEntry,
              ...course,
              selectedCourse:
                fetchedCourses.find((c) => c.id === course.selectedCourse?.id) ||
                course.selectedCourse ||
                null,
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
                  status: course.fullFeesDetails?.registration?.status || "Pending",
                },
                finalPayment: {
                  ...defaultEntry.fullFeesDetails.finalPayment,
                  ...course.fullFeesDetails?.finalPayment,
                  status: course.fullFeesDetails?.finalPayment?.status || "Pending",
                },
              },
              freeReason: course.freeReason || "",
            };
          });
          if (isMounted) {
            setCourseEntries(existingCourses);
            setExistingCourses(existingCourses);
          }
        } else if (isMounted) {
          setCourseEntries([defaultEntry]);
          setExistingCourses([]);
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to fetch data");
          logActivity("FETCH_DATA_ERROR", { error: error.message, studentId }, user);
          setCourseEntries([defaultEntry]);
          setPreferredCenters([]);
          setCenters([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsOpen(true);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [studentId, canDisplay, navigate, user]);

  const saveEnrollmentData = async () => {
    if (!canCreate) {
      toast.error("You don't have permission to save enrollments");
      return;
    }
    setIsSaving(true);
    setLoading(true);
    try {
      const documentFields = ["photo", "bankStatement", "paymentSlip", "aadharCard", "panCard"];
      const updatedEntries = courseEntries.map((entry) => {
        const cleanedFinanceDetails = { ...entry.financeDetails };
        documentFields.forEach((field) => {
          if (typeof cleanedFinanceDetails[field] === "string") {
            cleanedFinanceDetails[field] = cleanedFinanceDetails[field];
            cleanedFinanceDetails[`${field}Name`] = cleanedFinanceDetails[`${field}Name`] || "";
          } else {
            cleanedFinanceDetails[field] = null;
            cleanedFinanceDetails[`${field}Name`] = cleanedFinanceDetails[`${field}Name`] || "";
          }
        });
        return { ...entry, financeDetails: cleanedFinanceDetails };
      });

      // Save to Firestore
      await setDoc(
        doc(db, "enrollments", studentId),
        {
          courses: updatedEntries,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );

      const studentDoc = await getDoc(doc(db, "student", studentId));
      if (!studentDoc.exists()) {
        throw new Error("Student not found");
      }
      const studentData = studentDoc.data();
      const studentEmail = studentData.email || "";
      const studentName = `${studentData.name}`.trim() || "";

      const newCourses = updatedEntries.filter(
        (entry) =>
          !existingCourses.some(
            (existing) => existing.selectedCourse?.id === entry.selectedCourse?.id
          ) &&
          entry.selectedCourse
      );
      const updatedFees = updatedEntries.filter((entry) => {
        const existing = existingCourses.find(
          (e) => e.selectedCourse?.id === entry?.selectedCourse?.id
        );
        if (!existing) return false;
        return (
          entry.fullFeesDetails.totalFees !== existing.fullFeesDetails.totalFees ||
          entry.fullFeesDetails.feeAfterDiscount !== existing.fullFeesDetails.feeAfterDiscount ||
          entry.financeDetails.loanAmount !== existing.financeDetails.loanAmount ||
          entry.registration.amount !== existing.registration.amount ||
          entry.installmentDetails.length !== existing.installmentDetails.length
        );
      });

      toast.success("Enrollment data saved successfully!");
      logActivity("SAVE_ENROLLMENT_SUCCESS", { courseCount: updatedEntries.length, studentId }, user);

      // Send welcome emails asynchronously
      for (const course of newCourses) {
        if (studentEmail && course.selectedCourse?.name) {
          try {
            await sendWelcomeEmail(studentEmail, studentName, course.selectedCourse.name);
            logActivity(
              "STUDENT_WELCOME_EMAIL_SUCCESS",
              {
                studentId,
                email: studentEmail,
                courseName: course.selectedCourse.name,
              },
              user
            );
          } catch (emailError) {
            toast.warn(
              `Enrollment saved, but failed to send welcome email for ${course.selectedCourse.name}`
            );
            logActivity(
              "STUDENT_WELCOME_EMAIL_ERROR",
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
    } catch (error) {
      toast.error(`Failed to save enrollment data: ${error.message}`);
      logActivity("SAVE_ENROLLMENT_ERROR", { error: error.message, studentId }, user);
    } finally {
      setIsSaving(false);
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isSaving) {
      toast.warn("Please wait, saving is in progress...");
      return;
    }
    setIsOpen(false);
    navigate(`/studentdetails/${studentId}`);
    logActivity("NAVIGATION_BACK", { from: "AddCourse", studentId }, user);
  };

  const addCourseEntry = () => {
    if (!canCreate) {
      toast.error("You don't have permission to add courses");
      logActivity("UNAUTHORIZED_CREATE_ATTEMPT", { action: "addCourseEntry", studentId }, user);
      return;
    }
    setCourseEntries([...courseEntries, defaultEntry]);
    logActivity("ADD_COURSE_ENTRY", { studentId }, user);
  };

  const removeCourseEntry = (index) => {
    if (!canDelete) {
      toast.error("You don't have permission to remove courses");
      logActivity("UNAUTHORIZED_DELETE_ATTEMPT", { action: "removeCourseEntry", index, studentId }, user);
      return;
    }
    setCourseEntries(courseEntries.filter((_, i) => i !== index));
    logActivity("REMOVE_COURSE", { index, studentId }, user);
  };

  const handleChange = async (index, field, value) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update course details");
      logActivity("UNAUTHORIZED_UPDATE_ATTEMPT", { action: "updateCourseEntry", field }, user);
      return false;
    }
    const updatedEntries = courseEntries.map((entry, i) => {
      if (i === index) {
        if (field === "selectedCourse") {
          logActivity("CHANGE_COURSE", { courseId: value?.id, field, studentId }, user);
          return {
            ...entry,
            [field]: value,
            fullFeesDetails: {
              ...entry.fullFeesDetails,
              totalFees: value?.fee || 0,
            },
            financeDetails: {
              ...entry.financeDetails,
              feeAfterDiscount: value?.fee || 0,
            },
          };
        } else if (field === "freeReason") {
          logActivity("CHANGE_FIELD", { field, value }, user);
          return { ...entry, freeReason: value };
        }
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setCourseEntries(updatedEntries);
    return true;
  };

  const handleFullFeesChange = (index, field, subField, value) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update course details");
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
    logActivity("FULL_FEES_CHANGE", { field, subField, value, studentId }, user);
    setCourseEntries(updatedEntries);
  };

  const handleRegistrationChange = (index, field, value) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update course details");
      return;
    }
    const updatedEntries = courseEntries.map((entry, i) => {
      if (i === index) {
        logActivity("CHANGE_REGISTRATION", { field, value, studentId }, user);
        return {
          ...entry,
          registration: { ...entry.registration, [field]: value },
        };
      }
      return entry;
    });
    setCourseEntries(updatedEntries);
  };

  const handleInstallmentChange = (courseIndex, index, field, value) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update course details");
      return;
    }
    const updatedEntries = courseEntries.map((entry, i) => {
      if (i === courseIndex) {
        const updatedDetails = entry.installmentDetails.map((installment, j) => {
          if (j === index) {
            return { ...installment, [field]: value };
          }
          return installment;
        });
        return { ...entry, installmentDetails: updatedDetails };
      }
      return entry;
    });
    logActivity("UPDATE_INSTALLMENT", { index, field, value, studentId }, user);
    setCourseEntries(updatedEntries);
  };

  const addInstallment = (index) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update course details");
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
              status: "Pending",
            },
          ],
        };
      }
      return entry;
    });
    setCourseEntries(updatedEntries);
  };

  const removeInstallment = (courseIndex, index) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update course details");
      return;
    }
    const updatedEntries = courseEntries.map((entry, i) => {
      if (i === courseIndex) {
        logActivity("REMOVE_INSTALLMENT", { courseIndex, index, studentId }, user);
        return {
          ...entry,
          installmentDetails: entry.installmentDetails.filter((_, j) => j !== index),
        };
      }
      return entry;
    });
    setCourseEntries(updatedEntries);
  };

  const handleFinanceChange = (index, field, subField, value) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update course details");
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
    logActivity("CHANGE_FINE", { field, subField, value, studentId }, user);
    setCourseEntries(updatedEntries);
  };

  const getFilteredCourses = (mode, coursesList = courses, centersList = preferredCenters) => {
    if (!mode) {
      console.warn("No mode provided, returning empty array.");
      return [];
    }
    if (!Array.isArray(coursesList) || coursesList.length === 0) {
      console.warn("No courses provided or courses array empty.");
      return [];
    }
    return coursesList.filter((course) => {
      const isAvailableInMode = course.mode?.toLowerCase() === mode.toLowerCase();
      const isAvailableAtCenter =
        centersList.length === 0 || !Array.isArray(course.centers)
          ? true
          : course.centers.some(
              (center) =>
                center?.status === "Active" && centersList.includes(center?.centerId)
            );
      return isAvailableInMode && isAvailableAtCenter;
    });
  };

  if (!canDisplay) return null;

  if (loading && !isSaving) {
    return (
      <Typography className="text-center text-gray-600">
        Loading...
      </Typography>
    );
  }

  if (!courses.length) {
    return (
      <Typography className="text-center text-gray-600">
        No courses available. Please add courses to Firestore.
      </Typography>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
      <div
        className={`fixed top-0 right-0 h-full bg-gray-100 w-3/4 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
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
              disabled={isSaving || loading}
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
              preferredCenters={preferredCenters}
              financePartners={financePartners}
              handleChange={handleChange}
              handleFullFeesChange={handleFullFeesChange}
              handleRegistrationChange={handleRegistrationChange}
              handleInstallmentChange={handleInstallmentChange}
              handleFinanceChange={handleFinanceChange}
              addInstallment={addInstallment}
              removeInstallment={removeInstallment}
              removeCourseEntry={removeCourseEntry}
              canUpdate={canUpdate}
              canDelete={canDelete}
              user={user}
              studentId={studentId}
              getFilteredCourses={getFilteredCourses}
              uploadProgress={uploadProgress}
              setUploadProgress={setUploadProgress}
            />
          ))}

          <div className="flex space-x-4">
            {canCreate && (
              <>
                <Button
                  variant="contained"
                  onClick={addCourseEntry}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!canCreate || isSaving}
                >
                  Add Course
                </Button>
                <Button
                  variant="contained"
                  onClick={saveEnrollmentData}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSaving || !canCreate || loading}
                >
                  {isSaving ? "Saving..." : "Save Enrollment"}
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