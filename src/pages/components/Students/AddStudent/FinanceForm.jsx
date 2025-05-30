// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   FormControl,
//   InputLabel,
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { useAuth } from "../../../../context/AuthContext";
// import { logActivity } from "./utils";
// import { s3Client } from "../../../../config/aws-config";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { Upload } from "@aws-sdk/lib-storage";


// const FinanceForm = ({
// courseIndex,
// fullFeesDetails,
// financeDetails,
// handleFinanceChange,
// financePartners,
// canUpdate,
// user,
// studentId,

// }) => {
//   const { user: authUser } = useAuth();
//   const [attachmentError, setAttachmentError] = useState({});
//   const [uploadProgress, setUploadProgress] = useState({}); // Define state locally

//   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//   const region = import.meta.env.VITE_AWS_REGION;

//   // Log canUpdate for debugging
//   useEffect(() => {
//   }, [canUpdate]);

//   // Initialize registrations array if empty
// useEffect(() => {
//   if (!financeDetails.registrations || financeDetails.registrations.length === 0) {
//     handleFinanceChange(courseIndex, "registrations", "", [
//       {
//         srNo: 1,
//         amount: 0,
//         date: "",
//         paymentMethod: "",
//         receivedBy: "",
//         remark: "",
//         status: "Pending",
//         amountType: "Non-Loan Amount",
//         loanSubRegistrations: [],
//       },
//     ]);
//   }
// }, [financeDetails.registrations, courseIndex, handleFinanceChange]);

// // Calculate derived values
// useEffect(() => {
//   const totalFees = parseFloat(fullFeesDetails?.totalFees || 0);
//   let discountValue = parseFloat(financeDetails.discountValue || 0);
//   let feeAfterDiscount = totalFees;

//   if (financeDetails.discountType === "percentage" && discountValue > 0) {
//     feeAfterDiscount = totalFees * (1 - discountValue / 100);
//   } else if (financeDetails.discountType === "value" && discountValue > 0) {
//     feeAfterDiscount = totalFees - discountValue;
//   }

//   let loanAmount = parseFloat(financeDetails.loanAmount || 0);
//   let downPayment = parseFloat(financeDetails.downPayment || 0);
//   let subventionFee = parseFloat(financeDetails.subventionFee || 0);
//   let disburseAmount = loanAmount - downPayment - subventionFee;

//   handleFinanceChange(courseIndex, "feeAfterDiscount", "", feeAfterDiscount.toFixed(2));
//   handleFinanceChange(courseIndex, "disburseAmount", "", disburseAmount >= 0 ? disburseAmount.toFixed(2) : 0);
// }, [
//   financeDetails.discountType,
//   financeDetails.discountValue,
//   financeDetails.loanAmount,
//   financeDetails.downPayment,
//   financeDetails.subventionFee,
//   fullFeesDetails?.totalFees,
//   courseIndex,
//   handleFinanceChange,
// ]);

// const handleAddRegistration = () => {
//   const currentRegistrations = Array.isArray(financeDetails.registrations)
//     ? financeDetails.registrations
//     : [];
//   const newRegistration = {
//     srNo: currentRegistrations.length + 1,
//     amount: 0,
//     date: "",
//     paymentMethod: "",
//     receivedBy: "",
//     remark: "",
//     status: "Pending",
//     amountType: "Non-Loan Amount",
//     loanSubRegistrations: [],
//   };
//   const updatedRegistrations = [...currentRegistrations, newRegistration];
//   handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
// };

// const handleDeleteRegistration = (index) => {
//   if (financeDetails.registrations.length <= 1) {
//     return;
//   }
//   const updatedRegistrations = financeDetails.registrations
//     .filter((_, i) => i !== index)
//     .map((reg, i) => ({ ...reg, srNo: i + 1 }));
//   handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
// };

// const handleRegistrationChange = (index, field, value) => {
//   const updatedRegistrations = [...financeDetails.registrations];
//   updatedRegistrations[index] = {
//     ...updatedRegistrations[index],
//     [field]: value,
//   };
//   handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
// };

// const handleAddLoanSubRegistration = (parentIndex) => {
//   const updatedRegistrations = [...financeDetails.registrations];
//   const newSubRegistration = {
//     srNo: updatedRegistrations[parentIndex].loanSubRegistrations.length + 1,
//     amount: 0,
//     date: "",
//     paymentMethod: "",
//     receivedBy: "",
//     remark: "",
//     status: "Pending",
//   };
//   updatedRegistrations[parentIndex].loanSubRegistrations = [
//     ...updatedRegistrations[parentIndex].loanSubRegistrations,
//     newSubRegistration,
//   ];
//   handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
// };

// const handleDeleteLoanSubRegistration = (parentIndex, subIndex) => {
//   const updatedRegistrations = [...financeDetails.registrations];
//   if (updatedRegistrations[parentIndex].loanSubRegistrations.length <= 1) {
//     return;
//   }
//   updatedRegistrations[parentIndex].loanSubRegistrations = updatedRegistrations[parentIndex]
//     .loanSubRegistrations
//     .filter((_, i) => i !== subIndex)
//     .map((subReg, i) => ({ ...subReg, srNo: i + 1 }));
//   handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
// };

// const handleLoanSubRegistrationChange = (parentIndex, subIndex, field, value) => {
//   const updatedRegistrations = [...financeDetails.registrations];
//   updatedRegistrations[parentIndex].loanSubRegistrations[subIndex] = {
//     ...updatedRegistrations[parentIndex].loanSubRegistrations[subIndex],
//     [field]: value,
//   };
//   handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
// };

//   // const handleFileChangeS3 = async (courseIndex, docType, event) => {
//   //   const file = event.target.files[0];
//   //   setAttachmentError((prev) => ({ ...prev, [docType]: null }));

//   //   if (!file) return;

//   //   if (!(file instanceof File)) {
//   //     setAttachmentError((prev) => ({ ...prev, [docType]: "Invalid file object." }));
//   //     return;
//   //   }

//   //   try {
//   //     if (!bucketName || !region || !s3Client.config.credentials) {
//   //       throw new Error("Missing S3 configuration or credentials");
//   //     }

//   //     const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//   //     if (!allowedTypes.includes(file.type)) {
//   //       throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
//   //     }
//   //     const maxSize = 10 * 1024 * 1024; // 10 MB
//   //     if (file.size > maxSize) {
//   //       throw new Error("File size exceeds 10 MB limit.");
//   //     }

//   //     const key = `students/${studentId}/${docType}_${file.name}`;
//   //     const arrayBuffer = await file.arrayBuffer();
//   //     const command = new PutObjectCommand({
//   //       Bucket: bucketName,
//   //       Key: key,
//   //       Body: arrayBuffer,
//   //       ContentType: file.type,
//   //     });

//   //     await s3Client.send(command);
//   //     const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
//   //     handleFinanceChange(courseIndex, docType, "", s3Url);
//   //     handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);
//   //     logActivity("UPLOAD_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, fileName: file.name, url: s3Url }, user);
//   //   } catch (err) {
//   //     setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to upload ${docType}: ${err.message}` }));
//   //     logActivity("UPLOAD_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message }, user);
//   //   }
//   // };

// const handleFileChangeS3 = async (courseIndex, docType, event) => {
//     console.log("handleFileChangeS3 triggered:", { courseIndex, docType, file: event.target.files[0] });
//     const file = event.target.files[0];
//     setAttachmentError((prev) => ({ ...prev, [docType]: null }));

//     if (!file) {
//       console.warn("No file selected");
//       setAttachmentError((prev) => ({ ...prev, [docType]: "No file selected." }));
//       return;
//     }

//     try {
//       if (!bucketName || !region || !s3Client.config.credentials) {
//         throw new Error("Missing S3 configuration or credentials");
//       }

//       const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//       if (!allowedTypes.includes(file.type)) {
//         throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
//       }
//       const maxSize = 10 * 1024 * 1024; // 10 MB
//       if (file.size > maxSize) {
//         throw new Error("File size exceeds 10 MB limit.");
//       }

//       const timestamp = Date.now();
//       const key = `students/${studentId}/courses/${courseIndex}/${docType}_${timestamp}_${file.name}`;
//       const params = {
//         Bucket: bucketName,
//         Key: key,
//         Body: file,
//         ContentType: file.type,
//       };

//       console.log("Uploading to S3 with params:", params);
//       const upload = new Upload({
//         client: s3Client,
//         params,
//         queueSize: 4,
//         partSize: 5 * 1024 * 1024,
//       });

//       upload.on("httpUploadProgress", (progress) => {
//         const percent = Math.round((progress.loaded / progress.total) * 100);
//         console.log(`Upload progress for ${docType}: ${percent}%`);
//         setUploadProgress((prev) => ({
//           ...prev,
//           [docType]: percent,
//         }));
//       });

//       await upload.done();
//       const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
//       console.log("Upload successful, S3 URL:", s3Url);

//       handleFinanceChange(courseIndex, docType, "", s3Url);
//       handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);
//       setUploadProgress((prev) => ({ ...prev, [docType]: 100 }));
//       logActivity("UPLOAD_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, fileName: file.name, url: s3Url }, user);
//     } catch (err) {
//       console.error("Upload error:", err);
//       setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to upload ${docType}: ${err.message}` }));
//       setUploadProgress((prev) => ({ ...prev, [docType]: -1 }));
//       logActivity("UPLOAD_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message }, user);
//     }
//   };

//   const viewDocument = async (s3Url, docType) => {
//     try {
//       if (!s3Url || !bucketName || !region || !s3Client.config.credentials) {
//         throw new Error("Invalid URL or S3 configuration");
//       }

//       let key = new URL(s3Url).pathname.substring(1);
//       key = decodeURIComponent(key);

//       const command = new GetObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//         ResponseContentDisposition: "inline",
//       });
//       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//       window.open(url, "_blank");
//       logActivity("VIEW_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, url }, user);
//     } catch (err) {
//       setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to view ${docType}: ${err.message}` }));
//       logActivity("VIEW_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message, url: s3Url }, user);
//     }
//   };

//   const removeDocument = async (courseIndex, docType, s3Url) => {
//     try {
//       handleFinanceChange(courseIndex, docType, "", "");
//       handleFinanceChange(courseIndex, `${docType}Name`, "", "");

//       if (s3Url) {
//         let key = new URL(s3Url).pathname.substring(1);
//         key = decodeURIComponent(key);
//         const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
//         await s3Client.send(command);
//         logActivity("DELETE_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, key }, user);
//       }
//       setAttachmentError((prev) => ({ ...prev, [docType]: null }));
//     } catch (err) {
//       setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to remove ${docType}: ${err.message}` }));
//       logActivity("DELETE_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message }, user);
//     }
//   };

//   return (
//     <div className="space-y-4 p-6">
//       {Object.values(attachmentError).filter((err) => err).length > 0 && (
//         <Typography color="error" variant="body2">
//           {Object.values(attachmentError).filter((err) => err).join("; ")}
//         </Typography>
//       )}

//       {/* Fees Table */}
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow className="bg-blue-50">
//               <TableCell className="text-gray-800 font-medium w-48">Total Fees</TableCell>
//               <TableCell className="text-gray-800 font-medium w-48">Discount Type</TableCell>
//               <TableCell className="text-gray-800 font-medium w-48">Discount Value</TableCell>
//               <TableCell className="text-gray-800 font-medium w-48">Discount Reason</TableCell>
//               <TableCell className="text-gray-800 font-medium w-48">Fee After Discount</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow>
//               <TableCell>
//                 <Typography>{fullFeesDetails?.totalFees || 0}</Typography>
//               </TableCell>
//               <TableCell>
//                 <Select
//                   value={financeDetails.discountType || ""}
//                   onChange={(e) => handleFinanceChange(courseIndex, "discountType", "", e.target.value)}
//                   displayEmpty
//                   className="w-32 bg-gray-100 rounded-lg"
//                   disabled={!canUpdate}
//                 >
//                   <MenuItem value="" disabled>Type</MenuItem>
//                   <MenuItem value="percentage">%</MenuItem>
//                   <MenuItem value="value">₹</MenuItem>
//                 </Select>
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   label="Discount"
//                   type="number"
//                   value={financeDetails.discountValue || ""}
//                   onChange={(e) => handleFinanceChange(courseIndex, "discountValue", "", e.target.value)}
//                   className="w-32"
//                   variant="outlined"
//                   size="small"
//                   disabled={!canUpdate}
//                 />
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   label="Discount Reason/Coupon"
//                   value={financeDetails.discountReason || ""}
//                   onChange={(e) => handleFinanceChange(courseIndex, "discountReason", "", e.target.value)}
//                   className="w-48"
//                   variant="outlined"
//                   size="small"
//                   disabled={!canUpdate}
//                 />
//               </TableCell>
//               <TableCell>
//                 <Typography>{financeDetails.feeAfterDiscount || fullFeesDetails?.totalFees || 0}</Typography>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Registrations Table */}
//       <Typography variant="subtitle1" className="text-gray-800 font-medium overflow-y-auto overflow-x-auto">Fees</Typography>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow className="bg-blue-50">
//               <TableCell className="text-gray-800 font-medium w-52 ">Sr. No.</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Amount</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Amount Type</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Date</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Payment Method</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Received By</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Remark</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Status</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {(financeDetails.registrations || []).map((registration, index) => (
//               <React.Fragment key={index}>
//                 <TableRow>
//                   <TableCell>{registration.srNo}</TableCell>
//                   <TableCell>
//                     <TextField
//                       type="number"
//                       value={registration.amount || ""}
//                       onChange={(e) => handleRegistrationChange(index, "amount", e.target.value)}
//                       className="w-52"
//                       size="small"
//                       disabled={!canUpdate}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Select
//                       value={registration.amountType || "Non-Loan Amount"}
//                       onChange={(e) => handleRegistrationChange(index, "amountType", e.target.value)}
//                       size="small"
//                       fullWidth
//                       disabled={!canUpdate}
//                     >
//                       <MenuItem value="Loan Amount">Loan Amount</MenuItem>
//                       <MenuItem value="Non-Loan Amount">Non-Loan Amount</MenuItem>
//                     </Select>
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       type="date"
//                       value={registration.date || ""}
//                       onChange={(e) => handleRegistrationChange(index, "date", e.target.value)}
//                       size="small"
//                       className="w-52"
//                       disabled={!canUpdate || registration.amountType=="Loan Amount"}
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Select
//                       value={registration.paymentMethod || ""}
//                       onChange={(e) => handleRegistrationChange(index, "paymentMethod", e.target.value)}
//                       size="small"
//                       className="w-52"
//                       displayEmpty
//                       fullWidth
//                       disabled={!canUpdate || registration.amountType=="Loan Amount"}
//                     >
//                       <MenuItem value="" disabled>Select Payment Method</MenuItem>
//                       <MenuItem value="Cash">Cash</MenuItem>
//                       <MenuItem value="Card">Card</MenuItem>
//                       <MenuItem value="UPI">UPI</MenuItem>
//                       <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
//                       <MenuItem value="Cheque">Cheque</MenuItem>
//                     </Select>
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       value={registration.receivedBy || ""}
//                       onChange={(e) => handleRegistrationChange(index, "receivedBy", e.target.value)}
//                       size="small"
//                       className="w-52"
//                       disabled={!canUpdate || registration.amountType=="Loan Amount"}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       value={registration.remark || ""}
//                       onChange={(e) => handleRegistrationChange(index, "remark", e.target.value)}
//                       size="small"
//                       className="w-52"
//                       disabled={!canUpdate}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Select
//                       value={registration.status || "Pending"}
//                       onChange={(e) => handleRegistrationChange(index, "status", e.target.value)}
//                       size="small"
//                       fullWidth
//                       disabled={!canUpdate}
//                     >
//                       <MenuItem value="Pending">Pending</MenuItem>
//                       <MenuItem value="Paid">Paid</MenuItem>
//                     </Select>
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       size="small"
//                       onClick={() => handleDeleteRegistration(index)}
//                       disabled={!canUpdate || financeDetails.registrations.length <= 1}
//                     >
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//                 {registration.amountType === "Loan Amount" && (
//                   <TableRow>
//                     <TableCell colSpan={9}>
//                       <Accordion>
//                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                           <Typography>Loan Downpayment</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                           <TableContainer>
//                             <Table>
//                               <TableHead>
//                                 <TableRow className="bg-gray-100">
//                                   <TableCell className="text-gray-800 font-medium min-w-[40px]">Sr. No.</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[100px]">Amount</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[120px]">Date</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[150px]">Payment Method</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[120px]">Received By</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[150px]">Remark</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[100px]">Status</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[100px]">Action</TableCell>
//                                 </TableRow>
//                               </TableHead>
//                               <TableBody>
//                                 {(registration.loanSubRegistrations || []).map((subReg, subIndex) => (
//                                   <TableRow key={subIndex}>
//                                     <TableCell>{subReg.srNo}</TableCell>
//                                     <TableCell>
//                                       <TextField
//                                         type="number"
//                                         value={subReg.amount || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "amount", e.target.value)}
//                                         size="small"
//                                         disabled={!canUpdate}
//                                       />
//                                     </TableCell>
//                                     <TableCell>
//                                       <TextField
//                                         type="date"
//                                         value={subReg.date || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "date", e.target.value)}
//                                         size="small"
//                                         disabled={!canUpdate}
//                                         InputLabelProps={{ shrink: true }}
//                                       />
//                                     </TableCell>
//                                     <TableCell>
//                                       <Select
//                                         value={subReg.paymentMethod || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "paymentMethod", e.target.value)}
//                                         size="small"
//                                         displayEmpty
//                                         fullWidth
//                                         disabled={!canUpdate}
//                                       >
//                                         <MenuItem value="" disabled>Select Payment Method</MenuItem>
//                                         <MenuItem value="Cash">Cash</MenuItem>
//                                         <MenuItem value="Card">Card</MenuItem>
//                                         <MenuItem value="UPI">UPI</MenuItem>
//                                         <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
//                                         <MenuItem value="Cheque">Cheque</MenuItem>
//                                       </Select>
//                                     </TableCell>
//                                     <TableCell>
//                                       <TextField
//                                         value={subReg.receivedBy || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "receivedBy", e.target.value)}
//                                         size="small"
//                                         disabled={!canUpdate}
//                                       />
//                                     </TableCell>
//                                     <TableCell>
//                                       <TextField
//                                         value={subReg.remark || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "remark", e.target.value)}
//                                         size="small"
//                                         disabled={!canUpdate}
//                                       />
//                                     </TableCell>
//                                     <TableCell>
//                                       <Select
//                                         value={subReg.status || "Pending"}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "status", e.target.value)}
//                                         size="small"
//                                         fullWidth
//                                         disabled={!canUpdate}
//                                       >
//                                         <MenuItem value="Pending">Pending</MenuItem>
//                                         <MenuItem value="Paid">Paid</MenuItem>
//                                       </Select>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Button
//                                         variant="contained"
//                                         color="error"
//                                         size="small"
//                                         onClick={() => handleDeleteLoanSubRegistration(index, subIndex)}
//                                         disabled={!canUpdate || registration.loanSubRegistrations.length <= 1}
//                                       >
//                                         Delete
//                                       </Button>
//                                     </TableCell>
//                                   </TableRow>
//                                 ))}
//                               </TableBody>
//                             </Table>
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               size="small"
//                               onClick={() => handleAddLoanSubRegistration(index)}
//                               disabled={!canUpdate}
//                               className="mt-2"
//                             >
//                               Add Loan Downpayment
//                             </Button>
//                           </TableContainer>
//                         </AccordionDetails>
//                       </Accordion>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <div className="flex justify-between items-center">
//         <Typography variant="subtitle1" className="text-gray-800 font-medium">
//           Registration
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           size="small"
//           onClick={handleAddRegistration}
//           disabled={!canUpdate}
//         >
//           Add Fees
//         </Button>
//       </div>

//       {/* Finance Details */}
//       <Typography variant="subtitle1" className="text-gray-800 font-medium">
//         Finance Details
//       </Typography>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <FormControl fullWidth>
//           <InputLabel>Finance Partner</InputLabel>
//           <Select
//             value={financeDetails.financePartner || ""}
//             onChange={(e) => handleFinanceChange(courseIndex, "financePartner", "", e.target.value)}
//             label="Finance Partner"
//             className="bg-gray-100 rounded-lg"
//             disabled={!canUpdate}
//           >
//             <MenuItem value="" disabled>Select Finance Partner</MenuItem>
//             {financePartners.map((partner) => (
//               <MenuItem key={partner.id} value={partner.name}>
//                 {partner.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl fullWidth>
//           <InputLabel>Contact Number</InputLabel>
//           <Select
//             value={financeDetails.contactNumber || ""}
//             onChange={(e) => handleFinanceChange(courseIndex, "contactNumber", "", e.target.value)}
//             label="Contact Number"
//             className="bg-gray-100 rounded-lg"
//             disabled={!financeDetails.financePartner || !canUpdate}
//           >
//             <MenuItem value="" disabled>Select Contact Person</MenuItem>
//             {financeDetails.financePartner &&
//               financePartners
//                 .find((p) => p.name === financeDetails.financePartner)
//                 ?.contactPersons?.map((person, idx) => (
//                   <MenuItem key={idx} value={person.name}>
//                     {person.name}
//                   </MenuItem>
//                 ))}
//           </Select>
//         </FormControl>
//         <FormControl fullWidth>
//           <InputLabel>Finance Scheme</InputLabel>
//           <Select
//             value={financeDetails.financeScheme || ""}
//             onChange={(e) => handleFinanceChange(courseIndex, "financeScheme", "", e.target.value)}
//             label="Finance Scheme"
//             className="bg-gray-100 rounded-lg"
//             disabled={!financeDetails.financePartner || !canUpdate}
//           >
//             <MenuItem value="">Select Finance Scheme</MenuItem>
//             {financeDetails.financePartner &&
//               financePartners
//                 .find((p) => p.name === financeDetails.financePartner)
//                 ?.scheme?.map((schemeItem, idx) => (
//                   <MenuItem key={idx} value={schemeItem.plan}>
//                     {schemeItem.plan}
//                     {schemeItem.description && ` - ${schemeItem.description}`}
//                   </MenuItem>
//                 ))}
//           </Select>
//         </FormControl>
//         <TextField
//           label="Loan Amount"
//           type="number"
//           value={financeDetails.loanAmount || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Subvention Fee"
//           type="number"
//           value={financeDetails.subventionFee || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "subventionFee", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Disburse Amount"
//           type="number"
//           value={financeDetails.disburseAmount || ""}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled
//         />
//         <TextField
//           label="Applicant Name"
//           value={financeDetails.applicantName || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "applicantName", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Relationship"
//           value={financeDetails.relationship || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "relationship", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <FormControl fullWidth>
//           <InputLabel>Loan Status</InputLabel>
//           <Select
//             value={financeDetails.loanStatus || "Pending"}
//             onChange={(e) => handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)}
//             label="Loan Status"
//             className="bg-gray-100 rounded-lg"
//             disabled={!canUpdate}
//           >
//             <MenuItem value="Pending">Pending</MenuItem>
//             <MenuItem value="Approved">Approved</MenuItem>
//             <MenuItem value="Rejected">Rejected</MenuItem>
//             <MenuItem value="Disbursed">Disbursed</MenuItem>
//             <MenuItem value="Completed">Completed</MenuItem>
//           </Select>
//         </FormControl>
//         <TextField
//           label="Applicant Number"
//           type="number"
//           value={financeDetails.applicantNumber || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "applicantNumber", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Invoice Number"
//           type="number"
//           value={financeDetails.invoiceNumber || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "invoiceNumber", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Down Payment"
//           type="number"
//           value={financeDetails.downPayment || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "downPayment", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />

//       </div>

//       {/* Documents Table */}
//       <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
//         Documents
//       </Typography>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow className="bg-blue-50">
//               <TableCell className="text-gray-800 font-medium min-w-[150px]">Document Type</TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-[300px]">File</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {[
//               { type: "photo", label: "Applicant Photo" },
//               { type: "bankStatement", label: "6 Months Bank Statement" },
//               { type: "paymentSlip", label: "Payment Slip" },
//               { type: "aadharCard", label: "Aadhar Card" },
//               { type: "panCard", label: "PAN Card" },
//               { type: "invoice", label: "Invoice" },
//               { type: "loanAgreement", label: "Loan Agreement" },
//               { type: "loanDelivery", label: "Loan Delivery Order" },
//             ].map((doc) => (
//               <TableRow key={doc.type}>
//                 <TableCell>{doc.label}</TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     {financeDetails[`${doc.type}Name`] ? (
//                       <>
//                         <Typography
//                           component="a"
//                           href="#"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             viewDocument(financeDetails[doc.type], doc.label);
//                           }}
//                           className="text-blue-600 hover:underline"
//                           variant="body2"
//                         >
//                           {financeDetails[`${doc.type}Name`]}
//                         </Typography>
//                         <span className="text-gray-500">|</span>
//                       </>
//                     ) : (
//                       <Typography variant="body2" color="textSecondary">
//                         No file uploaded
//                       </Typography>
//                     )}
//                     <label className="cursor-pointer">
//                       <span className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
//                         {financeDetails[`${doc.type}Name`] ? "Replace" : "Upload"}
//                       </span>
//                       <input
//                         type="file"
//                         accept="application/pdf,image/jpeg,image/png"
//                         onChange={(e) => handleFileChangeS3(courseIndex, doc.type, e)}
//                         className="hidden"
//                         disabled={!canUpdate}
//                       />
//                     </label>
//                     {financeDetails[`${doc.type}Name`] ? (
//                       <>
//                         <span className="text-gray-500">|</span>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           size="small"
//                           onClick={() => removeDocument(courseIndex, doc.type, financeDetails[doc.type])}
//                           disabled={!canUpdate}
//                         >
//                           Remove
//                         </Button>
//                       </>
//                     ) : null}
//                   </div>
//                   {attachmentError[doc.type] && (
//                     <Typography color="error" variant="body2" className="mt-1">
//                       {attachmentError[doc.type]}
//                     </Typography>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default FinanceForm;





// import {
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   FormControl,
//   InputLabel,
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import { toast } from "react-toastify";

// import React, { useState, useEffect } from "react";

// import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { useAuth } from "../../../../context/AuthContext";
// import { logActivity } from "./utils";
// import { s3Client } from "../../../../config/aws-config";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { Upload } from "@aws-sdk/lib-storage";

// const FinanceForm = ({
//   courseIndex,
//   financeDetails,
//   handleFinanceChange,
//   financePartners,
//   canUpdate,
//   user,
//   studentId,
//   uploadProgress,
//   setUploadProgress,
//   fullFeesDetails,

// }) => {
//   const { user: authUser } = useAuth();
//   const [attachmentError, setAttachmentError] = useState({});

//   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//   const region = import.meta.env.VITE_AWS_REGION;

//   useEffect(() => {
//   }, [canUpdate]);

//   useEffect(() => {
//     if (!financeDetails.registrations || financeDetails.registrations.length === 0) {
//       handleFinanceChange(courseIndex, "registrations", "", [
//         {
//           srNo: 1,
//           amount: 0,
//           date: "",
//           paymentMethod: "",
//           receivedBy: "",
//           remark: "",
//           status: "Pending",
//           amountType: "Non-Loan Amount",
//           loanSubRegistrations: [],
//         },
//       ]);
//     }
//   }, [financeDetails.registrations, courseIndex, handleFinanceChange]);

//   // Calculate derived values
//   useEffect(() => {
//     const totalFees = parseFloat(fullFeesDetails?.totalFees || 0);
//     let discountValue = parseFloat(financeDetails.discountValue || 0);
//     let feeAfterDiscount = totalFees;

//     if (financeDetails.discountType === "percentage" && discountValue > 0) {
//       feeAfterDiscount = totalFees * (1 - discountValue / 100);
//     } else if (financeDetails.discountType === "value" && discountValue > 0) {
//       feeAfterDiscount = totalFees - discountValue;
//     }

//     let loanAmount = parseFloat(financeDetails.loanAmount || 0);
//     let downPayment = parseFloat(financeDetails.downPayment || 0);
//     let subventionFee = parseFloat(financeDetails.subventionFee || 0);
//     let disburseAmount = loanAmount - downPayment - subventionFee;

//     handleFinanceChange(courseIndex, "feeAfterDiscount", "", feeAfterDiscount.toFixed(2));
//     handleFinanceChange(courseIndex, "disburseAmount", "", disburseAmount >= 0 ? disburseAmount.toFixed(2) : 0);
//   }, [
//     financeDetails.discountType,
//     financeDetails.discountValue,
//     financeDetails.loanAmount,
//     financeDetails.downPayment,
//     financeDetails.subventionFee,
//     fullFeesDetails?.totalFees,
//     courseIndex,
//     handleFinanceChange,
//   ]);

//   const handleAddRegistration = () => {
//     const currentRegistrations = Array.isArray(financeDetails.registrations)
//       ? financeDetails.registrations
//       : [];
//     const newRegistration = {
//       srNo: currentRegistrations.length + 1,
//       amount: 0,
//       date: "",
//       paymentMethod: "",
//       receivedBy: "",
//       remark: "",
//       status: "Pending",
//       amountType: "Non-Loan Amount",
//       loanSubRegistrations: [],
//     };
//     const updatedRegistrations = [...currentRegistrations, newRegistration];
//     handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
//   };

//   const handleDeleteRegistration = (index) => {
//     if (financeDetails.registrations.length <= 1) {
//       return;
//     }
//     const updatedRegistrations = financeDetails.registrations
//       .filter((_, i) => i !== index)
//       .map((reg, i) => ({ ...reg, srNo: i + 1 }));
//     handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
//   };

//   const handleRegistrationChange = (index, field, value) => {
//     const updatedRegistrations = [...financeDetails.registrations];
//     updatedRegistrations[index] = {
//       ...updatedRegistrations[index],
//       [field]: value,
//     };
//     handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
//   };

//   const handleAddLoanSubRegistration = (parentIndex) => {
//     const updatedRegistrations = [...financeDetails.registrations];
//     const newSubRegistration = {
//       srNo: updatedRegistrations[parentIndex].loanSubRegistrations.length + 1,
//       amount: 0,
//       date: "",
//       paymentMethod: "",
//       receivedBy: "",
//       remark: "",
//       status: "Pending",
//     };
//     updatedRegistrations[parentIndex].loanSubRegistrations = [
//       ...updatedRegistrations[parentIndex].loanSubRegistrations,
//       newSubRegistration,
//     ];
//     handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
//   };

//   const handleDeleteLoanSubRegistration = (parentIndex, subIndex) => {
//     const updatedRegistrations = [...financeDetails.registrations];
//     if (updatedRegistrations[parentIndex].loanSubRegistrations.length <= 1) {
//       return;
//     }
//     updatedRegistrations[parentIndex].loanSubRegistrations = updatedRegistrations[parentIndex]
//       .loanSubRegistrations
//       .filter((_, i) => i !== subIndex)
//       .map((subReg, i) => ({ ...subReg, srNo: i + 1 }));
//     handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
//   };

//   const handleLoanSubRegistrationChange = (parentIndex, subIndex, field, value) => {
//     const updatedRegistrations = [...financeDetails.registrations];
//     updatedRegistrations[parentIndex].loanSubRegistrations[subIndex] = {
//       ...updatedRegistrations[parentIndex].loanSubRegistrations[subIndex],
//       [field]: value,
//     };
//     handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
//   };

//   // Handle file upload to S3
//   const handleFileChangeS3 = async (courseIndex, docType, event) => {
//     const file = event.target.files[0];
//     console.log("File selected:", file);
//     setAttachmentError((prev) => ({ ...prev, [docType]: null }));

//     if (!file) {
//       console.log("No file selected");
//       setAttachmentError((prev) => ({ ...prev, [docType]: "No file selected." }));
//       toast.error("No file selected.");
//       return;
//     }

//     try {
//       console.log("S3 Config:", { bucketName, region, credentials: !!s3Client.config.credentials });
//       if (!bucketName || !region || !s3Client.config.credentials) {
//         throw new Error("Missing S3 configuration or credentials");
//       }

//       const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//       if (!allowedTypes.includes(file.type)) {
//         throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
//       }
//       const maxSize = 10 * 1024 * 1024; // 10 MB
//       if (file.size > maxSize) {
//         throw new Error("File size exceeds 10 MB limit.");
//       }

//       const timestamp = Date.now();
//       const key = `students/${studentId}/courses/${courseIndex}/${docType}_${timestamp}_${file.name}`;
//       const params = {
//         Bucket: bucketName,
//         Key: key,
//         Body: file,
//         ContentType: file.type,
//       };
//       console.log("Upload params:", params);

//       const upload = new Upload({
//         client: s3Client,
//         params,
//         queueSize: 4,
//         partSize: 5 * 1024 * 1024,
//       });

//       upload.on("httpUploadProgress", (progress) => {
//         const percent = Math.round((progress.loaded / progress.total) * 100);
//         console.log("Upload progress:", percent);
//         setUploadProgress((prev) => ({
//           ...prev,
//           [`${courseIndex}_${docType}`]: percent,
//         }));
//       });

//       await upload.done();
//       const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
//       console.log("Upload successful, S3 URL:", s3Url);

//       handleFinanceChange(courseIndex, docType, "", s3Url);
//       handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);
//       setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: 100 }));
//       toast.success(`${docType} uploaded successfully!`);
//       logActivity("UPLOAD_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, fileName: file.name, url: s3Url }, user);
//     } catch (err) {
//       console.error("Upload error:", err);
//       setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to upload ${docType}: ${err.message}` }));
//       setUploadProgress((prev) => ({ ...prev, [`${courseIndex}_${docType}`]: -1 }));
//       toast.error(`Failed to upload ${docType}: ${err.message}`);
//       logActivity("UPLOAD_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message }, user);
//     }
//   };

//   // View document from S3
//   const viewDocument = async (s3Url, docType) => {
//     try {
//       if (!s3Url || !bucketName || !region || !s3Client.config.credentials) {
//         throw new Error("Invalid URL or S3 configuration");
//       }

//       let key = new URL(s3Url).pathname.substring(1);
//       key = decodeURIComponent(key);

//       const command = new GetObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//         ResponseContentDisposition: "inline",
//       });
//       // const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//       const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
//       window.open(url, "_blank");
//       logActivity("VIEW_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, url }, user);
//     } catch (err) {
//       setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to view ${docType}: ${err.message}` }));
//       toast.error(`Failed to view ${docType}: ${err.message}`);
//       logActivity("VIEW_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message, url: s3Url }, user);
//     }
//   };


//   // Remove document from S3 and clear from state
//   const removeDocument = async (courseIndex, docType, s3Url) => {
//     try {
//       handleFinanceChange(courseIndex, docType, "", "");
//       handleFinanceChange(courseIndex, `${docType}Name`, "", "");

//       if (s3Url) {
//         let key = new URL(s3Url).pathname.substring(1);
//         key = decodeURIComponent(key);
//         const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
//         await s3Client.send(command);
//         logActivity("DELETE_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, key }, user);
//       }
//       setAttachmentError((prev) => ({ ...prev, [docType]: null }));
//       toast.success(`${docType} removed successfully!`);
//     } catch (err) {
//       setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to remove ${docType}: ${err.message}` }));
//       toast.error(`Failed to remove ${docType}: ${err.message}`);
//       logActivity("DELETE_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message }, user);
//     }
//   };

//   return (
//     <div className="space-y-4 p-6">
//       {Object.values(attachmentError).filter((err) => err).length > 0 && (
//         <Typography color="error" variant="body2">
//           {Object.values(attachmentError).filter((err) => err).join("; ")}
//         </Typography>
//       )}


//       {/* Fees Table */}
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow className="bg-blue-50">
//               <TableCell className="text-gray-800 font-medium w-48">Total Fees</TableCell>
//               <TableCell className="text-gray-800 font-medium w-48">Discount Type</TableCell>
//               <TableCell className="text-gray-800 font-medium w-48">Discount Value</TableCell>
//               <TableCell className="text-gray-800 font-medium w-48">Discount Reason</TableCell>
//               <TableCell className="text-gray-800 font-medium w-48">Fee After Discount</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow>
//               <TableCell>
//                 <Typography>{fullFeesDetails?.totalFees || 0}</Typography>
//               </TableCell>
//               <TableCell>
//                 <Select
//                   value={financeDetails.discountType || ""}
//                   onChange={(e) => handleFinanceChange(courseIndex, "discountType", "", e.target.value)}
//                   displayEmpty
//                   className="w-32 bg-gray-100 rounded-lg"
//                   disabled={!canUpdate}
//                 >
//                   <MenuItem value="" disabled>Type</MenuItem>
//                   <MenuItem value="percentage">%</MenuItem>
//                   <MenuItem value="value">₹</MenuItem>
//                 </Select>
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   label="Discount"
//                   type="number"
//                   value={financeDetails.discountValue || ""}
//                   onChange={(e) => handleFinanceChange(courseIndex, "discountValue", "", e.target.value)}
//                   className="w-32"
//                   variant="outlined"
//                   size="small"
//                   disabled={!canUpdate}
//                 />
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   label="Discount Reason/Coupon"
//                   value={financeDetails.discountReason || ""}
//                   onChange={(e) => handleFinanceChange(courseIndex, "discountReason", "", e.target.value)}
//                   className="w-48"
//                   variant="outlined"
//                   size="small"
//                   disabled={!canUpdate}
//                 />
//               </TableCell>
//               <TableCell>
//                 <Typography>{financeDetails.feeAfterDiscount || fullFeesDetails?.totalFees || 0}</Typography>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Registrations Table */}
//       <Typography variant="subtitle1" className="text-gray-800 font-medium overflow-y-auto overflow-x-auto">Fees</Typography>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow className="bg-blue-50">
//               <TableCell className="text-gray-800 font-medium w-52 ">Sr. No.</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Amount</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Amount Type</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Date</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Payment Method</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Received By</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Remark</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Status</TableCell>
//               <TableCell className="text-gray-800 font-medium w-52">Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {(financeDetails.registrations || []).map((registration, index) => (
//               <React.Fragment key={index}>
//                 <TableRow>
//                   <TableCell>{registration.srNo}</TableCell>
//                   <TableCell>
//                     <TextField
//                       type="number"
//                       value={registration.amount || ""}
//                       onChange={(e) => handleRegistrationChange(index, "amount", e.target.value)}
//                       className="w-52"
//                       size="small"
//                       disabled={!canUpdate}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Select
//                       value={registration.amountType || "Non-Loan Amount"}
//                       onChange={(e) => handleRegistrationChange(index, "amountType", e.target.value)}
//                       size="small"
//                       fullWidth
//                       disabled={!canUpdate}
//                     >
//                       <MenuItem value="Loan Amount">Loan Amount</MenuItem>
//                       <MenuItem value="Non-Loan Amount">Non-Loan Amount</MenuItem>
//                     </Select>
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       type="date"
//                       value={registration.date || ""}
//                       onChange={(e) => handleRegistrationChange(index, "date", e.target.value)}
//                       size="small"
//                       className="w-52"
//                       disabled={!canUpdate || registration.amountType == "Loan Amount"}
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Select
//                       value={registration.paymentMethod || ""}
//                       onChange={(e) => handleRegistrationChange(index, "paymentMethod", e.target.value)}
//                       size="small"
//                       className="w-52"
//                       displayEmpty
//                       fullWidth
//                       disabled={!canUpdate || registration.amountType == "Loan Amount"}
//                     >
//                       <MenuItem value="" disabled>Select Payment Method</MenuItem>
//                       <MenuItem value="Cash">Cash</MenuItem>
//                       <MenuItem value="Card">Card</MenuItem>
//                       <MenuItem value="UPI">UPI</MenuItem>
//                       <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
//                       <MenuItem value="Cheque">Cheque</MenuItem>
//                     </Select>
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       value={registration.receivedBy || ""}
//                       onChange={(e) => handleRegistrationChange(index, "receivedBy", e.target.value)}
//                       size="small"
//                       className="w-52"
//                       disabled={!canUpdate || registration.amountType == "Loan Amount"}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       value={registration.remark || ""}
//                       onChange={(e) => handleRegistrationChange(index, "remark", e.target.value)}
//                       size="small"
//                       className="w-52"
//                       disabled={!canUpdate}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Select
//                       value={registration.status || "Pending"}
//                       onChange={(e) => handleRegistrationChange(index, "status", e.target.value)}
//                       size="small"
//                       fullWidth
//                       disabled={!canUpdate}
//                     >
//                       <MenuItem value="Pending">Pending</MenuItem>
//                       <MenuItem value="Paid">Paid</MenuItem>
//                     </Select>
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       size="small"
//                       onClick={() => handleDeleteRegistration(index)}
//                       disabled={!canUpdate || financeDetails.registrations.length <= 1}
//                     >
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//                 {registration.amountType === "Loan Amount" && (
//                   <TableRow>
//                     <TableCell colSpan={9}>
//                       <Accordion>
//                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                           <Typography>Loan Downpayment</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                           <TableContainer>
//                             <Table>
//                               <TableHead>
//                                 <TableRow className="bg-gray-100">
//                                   <TableCell className="text-gray-800 font-medium min-w-[40px]">Sr. No.</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[100px]">Amount</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[120px]">Date</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[150px]">Payment Method</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[120px]">Received By</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[150px]">Remark</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[100px]">Status</TableCell>
//                                   <TableCell className="text-gray-800 font-medium min-w-[100px]">Action</TableCell>
//                                 </TableRow>
//                               </TableHead>
//                               <TableBody>
//                                 {(registration.loanSubRegistrations || []).map((subReg, subIndex) => (
//                                   <TableRow key={subIndex}>
//                                     <TableCell>{subReg.srNo}</TableCell>
//                                     <TableCell>
//                                       <TextField
//                                         type="number"
//                                         value={subReg.amount || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "amount", e.target.value)}
//                                         size="small"
//                                         disabled={!canUpdate}
//                                       />
//                                     </TableCell>
//                                     <TableCell>
//                                       <TextField
//                                         type="date"
//                                         value={subReg.date || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "date", e.target.value)}
//                                         size="small"
//                                         disabled={!canUpdate}
//                                         InputLabelProps={{ shrink: true }}
//                                       />
//                                     </TableCell>
//                                     <TableCell>
//                                       <Select
//                                         value={subReg.paymentMethod || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "paymentMethod", e.target.value)}
//                                         size="small"
//                                         displayEmpty
//                                         fullWidth
//                                         disabled={!canUpdate}
//                                       >
//                                         <MenuItem value="" disabled>Select Payment Method</MenuItem>
//                                         <MenuItem value="Cash">Cash</MenuItem>
//                                         <MenuItem value="Card">Card</MenuItem>
//                                         <MenuItem value="UPI">UPI</MenuItem>
//                                         <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
//                                         <MenuItem value="Cheque">Cheque</MenuItem>
//                                       </Select>
//                                     </TableCell>
//                                     <TableCell>
//                                       <TextField
//                                         value={subReg.receivedBy || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "receivedBy", e.target.value)}
//                                         size="small"
//                                         disabled={!canUpdate}
//                                       />
//                                     </TableCell>
//                                     <TableCell>
//                                       <TextField
//                                         value={subReg.remark || ""}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "remark", e.target.value)}
//                                         size="small"
//                                         disabled={!canUpdate}
//                                       />
//                                     </TableCell>
//                                     <TableCell>
//                                       <Select
//                                         value={subReg.status || "Pending"}
//                                         onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "status", e.target.value)}
//                                         size="small"
//                                         fullWidth
//                                         disabled={!canUpdate}
//                                       >
//                                         <MenuItem value="Pending">Pending</MenuItem>
//                                         <MenuItem value="Paid">Paid</MenuItem>
//                                       </Select>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Button
//                                         variant="contained"
//                                         color="error"
//                                         size="small"
//                                         onClick={() => handleDeleteLoanSubRegistration(index, subIndex)}
//                                         disabled={!canUpdate || registration.loanSubRegistrations.length <= 1}
//                                       >
//                                         Delete
//                                       </Button>
//                                     </TableCell>
//                                   </TableRow>
//                                 ))}
//                               </TableBody>
//                             </Table>
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               size="small"
//                               onClick={() => handleAddLoanSubRegistration(index)}
//                               disabled={!canUpdate}
//                               className="mt-2"
//                             >
//                               Add Loan Downpayment
//                             </Button>
//                           </TableContainer>
//                         </AccordionDetails>
//                       </Accordion>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <div className="flex justify-between items-center">
//         <Typography variant="subtitle1" className="text-gray-800 font-medium">
//           Registration
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           size="small"
//           onClick={handleAddRegistration}
//           disabled={!canUpdate}
//         >
//           Add Fees
//         </Button>
//       </div>

//       {/* Finance Details */}
//       <Typography variant="subtitle1" className="text-gray-800 font-medium">
//         Finance Details
//       </Typography>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <FormControl fullWidth>
//           <InputLabel>Finance Partner</InputLabel>
//           <Select
//             value={financeDetails.financePartner || ""}
//             onChange={(e) => handleFinanceChange(courseIndex, "financePartner", "", e.target.value)}
//             label="Finance Partner"
//             className="bg-gray-100 rounded-lg"
//             disabled={!canUpdate}
//           >
//             <MenuItem value="" disabled>Select Finance Partner</MenuItem>
//             {financePartners.map((partner) => (
//               <MenuItem key={partner.id} value={partner.name}>
//                 {partner.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl fullWidth>
//           <InputLabel>Contact Person</InputLabel>
//           <Select
//             value={financeDetails.contactPerson || ""}
//             onChange={(e) => handleFinanceChange(courseIndex, "contactPerson", "", e.target.value)}
//             label="Contact Person"
//             className="bg-gray-100 rounded-lg"
//             disabled={!financeDetails.financePartner || !canUpdate}
//           >
//             <MenuItem value="" disabled>Select Contact Person</MenuItem>
//             {financeDetails.financePartner &&
//               financePartners
//                 .find((p) => p.name === financeDetails.financePartner)
//                 ?.contactPersons?.map((person, idx) => (
//                   <MenuItem key={idx} value={person.name}>
//                     {person.name}
//                   </MenuItem>
//                 ))}
//           </Select>
//         </FormControl>
//         <FormControl fullWidth>
//           <InputLabel>Scheme</InputLabel>
//           <Select
//             value={financeDetails.scheme || ""}
//             onChange={(e) => handleFinanceChange(courseIndex, "scheme", "", e.target.value)}
//             label="Scheme"
//             className="bg-gray-100 rounded-lg"
//             disabled={!financeDetails.financePartner || !canUpdate}
//           >
//             <MenuItem value="" disabled>Select Scheme</MenuItem>
//             {financeDetails.financePartner &&
//               financePartners
//                 .find((p) => p.name === financeDetails.financePartner)
//                 ?.scheme?.map((schemeItem, idx) => (
//                   <MenuItem key={idx} value={schemeItem.plan}>
//                     {schemeItem.plan}
//                     {schemeItem.description && ` - ${schemeItem.description}`}
//                   </MenuItem>
//                 ))}
//           </Select>
//         </FormControl>
//         <TextField
//           label="Loan Amount"
//           type="number"
//           value={financeDetails.loanAmount || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Down Payment"
//           type="number"
//           value={financeDetails.downPayment || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "downPayment", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Down Payment Date"
//           type="date"
//           value={financeDetails.downPaymentDate || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "downPaymentDate", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           label="Applicant Name"
//           value={financeDetails.applicantName || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "applicantName", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Relationship"
//           value={financeDetails.relationship || ""}
//           onChange={(e) => handleFinanceChange(courseIndex, "relationship", "", e.target.value)}
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <FormControl fullWidth>
//           <InputLabel>Loan Status</InputLabel>
//           <Select
//             value={financeDetails.loanStatus || "Pending"}
//             onChange={(e) => handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)}
//             label="Loan Status"
//             className="bg-gray-100 rounded-lg"
//             disabled={!canUpdate}
//           >
//             <MenuItem value="Pending">Pending</MenuItem>
//             <MenuItem value="Approved">Approved</MenuItem>
//             <MenuItem value="Rejected">Rejected</MenuItem>
//             <MenuItem value="Disbursed">Disbursed</MenuItem>
//             <MenuItem value="Completed">Completed</MenuItem>
//           </Select>
//         </FormControl>
//       </div>

//       {/* Documents Table */}
//       <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
//         Documents
//       </Typography>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow className="bg-blue-50">
//               <TableCell className="text-gray-800 font-medium min-w-[150px]">Document Type</TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-[300px]">File</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {[
//               { type: "photo", label: "Applicant Photo" },
//               { type: "bankStatement", label: "6 Months Bank Statement" },
//               { type: "paymentSlip", label: "Payment Slip" },
//               { type: "aadharCard", label: "Aadhar Card" },
//               { type: "panCard", label: "PAN Card" },
//               { type: "invoice", label: "Invoice" },
//               { type: "loanAgreement", label: "Loan Agreement" },
//               { type: "loanDelivery", label: "Loan Delivery Order" },
//             ].map((doc) => (
//               <TableRow key={doc.type}>
//                 <TableCell>{doc.label}</TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     {financeDetails[`${doc.type}`] ? (
//                       <>
//                         <Typography
//                           component="a"
//                           href="#"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             viewDocument(financeDetails[doc.type], doc.label);
//                           }}
//                           className="text-blue-600 hover:underline"
//                           variant="body2"
//                         >
//                           {financeDetails[`${doc.type}`]}
//                         </Typography>
//                         <span className="text-gray-500">|</span>
//                       </>
//                     ) : (
//                       <Typography variant="body2" color="textSecondary">
//                         No file uploaded
//                       </Typography>
//                     )} 
//                     <label className="cursor-pointer">
//                       <span className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
//                         {financeDetails[`${doc.type}`] ? "Replace" : "Upload"}
//                       </span>
//                       <input
//                         type="file"
//                         accept="application/pdf,image/jpeg,image/png"
//                         onChange={(e) => handleFileChangeS3(courseIndex, doc.type, e)}
//                         className="hidden"
//                         disabled={!canUpdate}
//                       />
//                     </label>
//                     {financeDetails[`${doc.type}`] && (
//                       <>
//                         <span className="text-gray-500">|</span>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           size="small"
//                           onClick={() => removeDocument(courseIndex, doc.type, financeDetails[doc.type])}
//                           disabled={!canUpdate}
//                         >
//                           Remove
//                         </Button>
//                       </>
//                     )}
//                   </div>
//                   {attachmentError[doc.type] && (
//                     <Typography color="error" variant="body2" className="mt-1">
//                       {attachmentError[doc.type]}
//                     </Typography>
//                   )}
//                   {uploadProgress[`${courseIndex}_${doc.type}`] >= 0 && (
//                     <Typography variant="body2" className="mt-1">
//                       Upload Progress: {uploadProgress[`${courseIndex}_${doc.type}`]}%
//                     </Typography>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default FinanceForm;



import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../context/AuthContext";
import { logActivity } from "./utils";
import { s3Client } from "../../../../config/aws-config";
import { Upload } from "@aws-sdk/lib-storage";

export default function FinanceForm({
  courseIndex,
  financeDetails,
  handleFinanceChange,
  financePartners,
  canUpdate,
  user,
  studentId,
  uploadProgress,
  setUploadProgress,
  fullFeesDetails,
}) {
  const { user: authUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState({
    photo: null,
    bankStatement: null,
    paymentSlip: null,
    aadharCard: null,
    panCard: null,
    invoice: null,
    loanAgreement: null,
    loanDelivery: null,
  });

  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
  const region = import.meta.env.VITE_AWS_REGION;

  // Calculate derived values
  useEffect(() => {
    const totalFees = parseFloat(fullFeesDetails?.totalFees || 0);
    let discountValue = parseFloat(financeDetails.discountValue || 0);
    let feeAfterDiscount = totalFees;

    if (financeDetails.discountType === "percentage" && discountValue > 0) {
      feeAfterDiscount = totalFees * (1 - discountValue / 100);
    } else if (financeDetails.discountType === "value" && discountValue > 0) {
      feeAfterDiscount = totalFees - discountValue;
    }

    let loanAmount = parseFloat(financeDetails.loanAmount || 0);
    let downPayment = parseFloat(financeDetails.downPayment || 0);
    let subventionFee = parseFloat(financeDetails.subventionFee || 0);
    let disburseAmount = loanAmount - downPayment - subventionFee;

    handleFinanceChange(courseIndex, "feeAfterDiscount", "", feeAfterDiscount.toFixed(2));
    handleFinanceChange(courseIndex, "disburseAmount", "", disburseAmount >= 0 ? disburseAmount.toFixed(2) : 0);
  }, [
    financeDetails.discountType,
    financeDetails.discountValue,
    financeDetails.loanAmount,
    financeDetails.downPayment,
    financeDetails.subventionFee,
    financeDetails.applicantNumber,
    financeDetails.invoiceNumber,
    fullFeesDetails?.totalFees,
    courseIndex,
    handleFinanceChange,
  ]);

  useEffect(() => {
    if (!financeDetails.registrations || financeDetails.registrations.length === 0) {
      handleFinanceChange(courseIndex, "registrations", "", [
        {
          srNo: 1,
          amount: 0,
          date: "",
          paymentMethod: "",
          receivedBy: "",
          remark: "",
          status: "Pending",
          amountType: "Non-Loan Amount",
          loanSubRegistrations: [],
        },
      ]);
    }
  }, [financeDetails.registrations, courseIndex, handleFinanceChange]);

  const handleAddRegistration = () => {
    const currentRegistrations = Array.isArray(financeDetails.registrations)
      ? financeDetails.registrations
      : [];
    const newRegistration = {
      srNo: currentRegistrations.length + 1,
      amount: 0,
      date: "",
      paymentMethod: "",
      receivedBy: "",
      remark: "",
      status: "Pending",
      amountType: "Non-Loan Amount",
      loanSubRegistrations: [],
    };
    const updatedRegistrations = [...currentRegistrations, newRegistration];
    handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
  };

  const handleDeleteRegistration = (index) => {
    if (financeDetails.registrations.length <= 1) {
      return;
    }
    const updatedRegistrations = financeDetails.registrations
      .filter((_, i) => i !== index)
      .map((reg, i) => ({ ...reg, srNo: i + 1 }));
    handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
  };

  const handleRegistrationChange = (index, field, value) => {
    const updatedRegistrations = [...financeDetails.registrations];
    updatedRegistrations[index] = {
      ...updatedRegistrations[index],
      [field]: value,
    };
    handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
  };

  const handleAddLoanSubRegistration = (parentIndex) => {
    const updatedRegistrations = [...financeDetails.registrations];
    const newSubRegistration = {
      srNo: updatedRegistrations[parentIndex].loanSubRegistrations.length + 1,
      amount: 0,
      date: "",
      paymentMethod: "",
      receivedBy: "",
      remark: "",
      status: "Pending",
    };
    updatedRegistrations[parentIndex].loanSubRegistrations = [
      ...updatedRegistrations[parentIndex].loanSubRegistrations,
      newSubRegistration,
    ];
    handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
  };

  const handleDeleteLoanSubRegistration = (parentIndex, subIndex) => {
    const updatedRegistrations = [...financeDetails.registrations];
    if (updatedRegistrations[parentIndex].loanSubRegistrations.length <= 1) {
      return;
    }
    updatedRegistrations[parentIndex].loanSubRegistrations = updatedRegistrations[parentIndex]
      .loanSubRegistrations
      .filter((_, i) => i !== subIndex)
      .map((subReg, i) => ({ ...subReg, srNo: i + 1 }));
    handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
  };

  const handleLoanSubRegistrationChange = (parentIndex, subIndex, field, value) => {
    const updatedRegistrations = [...financeDetails.registrations];
    updatedRegistrations[parentIndex].loanSubRegistrations[subIndex] = {
      ...updatedRegistrations[parentIndex].loanSubRegistrations[subIndex],
      [field]: value,
    };
    handleFinanceChange(courseIndex, "registrations", "", updatedRegistrations);
  };

  // File Handling
  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Allowed types: PDF, JPEG, PNG.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      setDocuments((prev) => ({ ...prev, [docType]: file }));
      setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
    } else {
      console.warn(`No file selected for ${docType}`);
    }
  };

  const uploadFileToS3 = async (file, docType, studentId) => {
    if (!bucketName || !region) {
      throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
    }

    if (!file || !(file instanceof File)) {
      throw new Error(`Invalid file for ${docType}: File object is null or not a File instance`);
    }

    const fileName = `students/${studentId}/courses/${courseIndex}/${docType}_${Date.now()}_${file.name}`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    try {
      const upload = new Upload({
        client: s3Client,
        params,
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
      });

      upload.on("httpUploadProgress", (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress((prev) => ({ ...prev, [docType]: percent }));
      });

      await upload.done();

      const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
      return url;
    } catch (err) {
      console.error(`Error uploading ${docType}:`, err);
      throw err;
    }
  };

  const handleUploadDocuments = async () => {
    if (!canUpdate) {
      toast.error("You do not have permission to upload documents.");
      return;
    }

    setIsSubmitting(true);
    try {
      const documentUpdates = {};
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          try {
            const url = await uploadFileToS3(file, docType, studentId);
            documentUpdates[docType] = url;
            handleFinanceChange(courseIndex, docType, "", url);
            handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);
            logActivity("UPLOAD_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, fileName: file.name, url }, user);
          } catch (uploadErr) {
            console.error(`Failed to upload ${docType}:`, uploadErr);
            throw new Error(`Failed to upload ${docType}: ${uploadErr.message}`);
          }
        }
      }

      toast.success("Documents uploaded successfully!");
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error(`Error uploading documents: ${error.message}`);
      logActivity("UPLOAD_DOCUMENT_ERROR", { studentId, courseIndex, error: error.message }, user);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="space-y-8 p-6">
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4">Fees Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-sm font-medium text-gray-600 w-48">Total Fees</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-48">Discount Type</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-48">Discount Value</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-48">Discount Reason</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-48">Fee After Discount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{fullFeesDetails?.totalFees || 0}</span>
                  </td>
                  <td className="p-3">
                    <select
                      value={financeDetails.discountType || ""}
                      onChange={(e) => handleFinanceChange(courseIndex, "discountType", "", e.target.value)}
                      disabled={!canUpdate || isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Type</option>
                      <option value="percentage">%</option>
                      <option value="value">₹</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={financeDetails.discountValue || ""}
                      onChange={(e) => handleFinanceChange(courseIndex, "discountValue", "", e.target.value)}
                      placeholder="Discount"
                      disabled={!canUpdate || isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={financeDetails.discountReason || ""}
                      onChange={(e) => handleFinanceChange(courseIndex, "discountReason", "", e.target.value)}
                      placeholder="Discount Reason/Coupon"
                      disabled={!canUpdate || isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{financeDetails.feeAfterDiscount || fullFeesDetails?.totalFees || 0}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4">Fees</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-sm font-medium text-gray-600 w-52">Sr. No.</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-52">Amount</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-52">Amount Type</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-52">Date</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-52">Payment Method</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-52">Received By</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-52">Remark</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-52">Status</th>
                  <th className="p-3 text-sm font-medium text-gray-600 w-52">Action</th>
                </tr>
              </thead>
              <tbody>
                {(financeDetails.registrations || []).map((registration, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <span className="text-sm text-gray-600">{registration.srNo}</span>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={registration.amount || ""}
                          onChange={(e) => handleRegistrationChange(index, "amount", e.target.value)}
                          disabled={!canUpdate || isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={registration.amountType || "Non-Loan Amount"}
                          onChange={(e) => handleRegistrationChange(index, "amountType", e.target.value)}
                          disabled={!canUpdate || isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Loan Amount">Loan Amount</option>
                          <option value="Non-Loan Amount">Non-Loan Amount</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          value={registration.date || ""}
                          onChange={(e) => handleRegistrationChange(index, "date", e.target.value)}
                          disabled={!canUpdate || isSubmitting || registration.amountType === "Loan Amount"}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={registration.paymentMethod || ""}
                          onChange={(e) => handleRegistrationChange(index, "paymentMethod", e.target.value)}
                          disabled={!canUpdate || isSubmitting || registration.amountType === "Loan Amount"}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="" disabled>Select Payment Method</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={registration.receivedBy || ""}
                          onChange={(e) => handleRegistrationChange(index, "receivedBy", e.target.value)}
                          disabled={!canUpdate || isSubmitting || registration.amountType === "Loan Amount"}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={registration.remark || ""}
                          onChange={(e) => handleRegistrationChange(index, "remark", e.target.value)}
                          disabled={!canUpdate || isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={registration.status || "Pending"}
                          onChange={(e) => handleRegistrationChange(index, "status", e.target.value)}
                          disabled={!canUpdate || isSubmitting}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteRegistration(index)}
                          disabled={!canUpdate || isSubmitting || financeDetails.registrations.length <= 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                    {registration.amountType === "Loan Amount" && (
                      <tr>
                        <td colSpan="9" className="p-3">
                          <div className="border border-gray-300 rounded-md p-3">
                            <h3 className="text-base font-medium text-gray-700 mb-3">Loan Downpayment</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[40px]">Sr. No.</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[100px]">Amount</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[120px]">Date</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[150px]">Payment Method</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[120px]">Received By</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[150px]">Remark</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[100px]">Status</th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[100px]">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(registration.loanSubRegistrations || []).map((subReg, subIndex) => (
                                    <tr key={subIndex} className="border-b hover:bg-gray-50">
                                      <td className="p-3">
                                        <span className="text-sm text-gray-600">{subReg.srNo}</span>
                                      </td>
                                      <td className="p-3">
                                        <input
                                          type="number"
                                          value={subReg.amount || ""}
                                          onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "amount", e.target.value)}
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <input
                                          type="date"
                                          value={subReg.date || ""}
                                          onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "date", e.target.value)}
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <select
                                          value={subReg.paymentMethod || ""}
                                          onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "paymentMethod", e.target.value)}
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="" disabled>Select Payment Method</option>
                                          <option value="Cash">Cash</option>
                                          <option value="Card">Card</option>
                                          <option value="UPI">UPI</option>
                                          <option value="Bank Transfer">Bank Transfer</option>
                                          <option value="Cheque">Cheque</option>
                                        </select>
                                      </td>
                                      <td className="p-3">
                                        <input
                                          type="text"
                                          value={subReg.receivedBy || ""}
                                          onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "receivedBy", e.target.value)}
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <input
                                          type="text"
                                          value={subReg.remark || ""}
                                          onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "remark", e.target.value)}
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <select
                                          value={subReg.status || "Pending"}
                                          onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "status", e.target.value)}
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="Pending">Pending</option>
                                          <option value="Paid">Paid</option>
                                        </select>
                                      </td>
                                      <td className="p-3">
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteLoanSubRegistration(index, subIndex)}
                                          disabled={!canUpdate || isSubmitting || registration.loanSubRegistrations.length <= 1}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <span>Delete</span>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <button
                                type="button"
                                onClick={() => handleAddLoanSubRegistration(index)}
                                disabled={!canUpdate || isSubmitting}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
                              >
                                Add Loan Downpayment
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <h2 className="text-lg font-medium text-gray-700">Registration</h2>
              <button
                type="button"
                onClick={handleAddRegistration}
                disabled={!canUpdate || isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
              >
                Add Fees
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4">Finance Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Finance Partner</label>
              <select
                value={financeDetails.financePartner || ""}
                onChange={(e) => handleFinanceChange(courseIndex, "financePartner", "", e.target.value)}
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select Finance Partner</option>
                {financePartners.map((partner) => (
                  <option key={partner.id} value={partner.name}>
                    {partner.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Contact Person</label>
              <select
                value={financeDetails.contactPerson || ""}
                onChange={(e) => handleFinanceChange(courseIndex, "contactPerson", "", e.target.value)}
                disabled={!financeDetails.financePartner || !canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select Contact Person</option>
                {financeDetails.financePartner &&
                  financePartners
                    .find((p) => p.name === financeDetails.financePartner)
                    ?.contactPersons?.map((person, idx) => (
                      <option key={idx} value={person.name}>
                        {person.name}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Scheme</label>
              <select
                value={financeDetails.scheme || ""}
                onChange={(e) => handleFinanceChange(courseIndex, "scheme", "", e.target.value)}
                disabled={!financeDetails.financePartner || !canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select Scheme</option>
                {financeDetails.financePartner &&
                  financePartners
                    .find((p) => p.name === financeDetails.financePartner)
                    ?.scheme?.map((schemeItem, idx) => (
                      <option key={idx} value={schemeItem.plan}>
                        {schemeItem.plan}
                        {schemeItem.description && ` - ${schemeItem.description}`}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Loan Amount</label>
              <input
                type="number"
                value={financeDetails.loanAmount || ""}
                onChange={(e) => handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)}
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Down Payment</label>
              <input
                type="number"
                value={financeDetails.downPayment || ""}
                onChange={(e) => handleFinanceChange(courseIndex, "downPayment", "", e.target.value)}
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Down Payment Date</label>
              <input
                type="date"
                value={financeDetails.downPaymentDate || ""}
                onChange={(e) => handleFinanceChange(courseIndex, "downPaymentDate", "", e.target.value)}
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Applicant Name</label>
              <input
                type="text"
                value={financeDetails.applicantName || ""}
                onChange={(e) => handleFinanceChange(courseIndex, "applicantName", "", e.target.value)}
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Relationship</label>
              <input
                type="text"
                value={financeDetails.relationship || ""}
                onChange={(e) => handleFinanceChange(courseIndex, "relationship", "", e.target.value)}
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Loan Status</label>
              <select
                value={financeDetails.loanStatus || "Pending"}
                onChange={(e) => handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)}
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4">Document Uploads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "photo", label: "Applicant Photo" },
              { key: "bankStatement", label: "6 Months Bank Statement" },
              { key: "paymentSlip", label: "Payment Slip" },
              { key: "aadharCard", label: "Aadhar Card" },
              { key: "panCard", label: "PAN Card" },
              { key: "invoice", label: "Invoice" },
              { key: "loanAgreement", label: "Loan Agreement" },
              { key: "loanDelivery", label: "Loan Delivery Order" },
            ].map((doc) => (
              <div key={doc.key}>
                <label className="block text-sm font-medium text-gray-600">{doc.label}</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, doc.key)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={!canUpdate || isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {documents[doc.key] && (
                  <span className="text-sm text-gray-600">{documents[doc.key].name}</span>
                )}
                {uploadProgress[doc.key] > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress[doc.key]}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{uploadProgress[doc.key]}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={handleUploadDocuments}
              disabled={!canUpdate || isSubmitting}
              className={`px-6 py-2 rounded-md text-white ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } transition duration-200`}
            >
              {isSubmitting ? "Processing..." : "Upload Documents"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}