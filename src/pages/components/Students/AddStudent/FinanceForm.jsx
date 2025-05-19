// // // // // import React, { useState } from "react";
// // // // // import {
// // // // //   Typography,
// // // // //   TextField,
// // // // //   Select,
// // // // //   MenuItem,
// // // // //   Table,
// // // // //   TableBody,
// // // // //   TableCell,
// // // // //   TableContainer,
// // // // //   TableHead,
// // // // //   TableRow,
// // // // //   FormControl,
// // // // //   InputLabel,
// // // // //   Button,
// // // // // } from "@mui/material";
// // // // // import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// // // // // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// // // // // import { useAuth } from "../../../../context/AuthContext";

// // // // // const FinanceForm = ({
// // // // //   courseIndex,
// // // // //   fullFeesDetails,
// // // // //   financeDetails,
// // // // //   handleFinanceChange,
// // // // //   handleFileChange,
// // // // //   financePartners,
// // // // //   canUpdate,
// // // // //   user,
// // // // //   studentId,
// // // // // }) => {
// // // // //   const { user: authUser } = useAuth();
// // // // //   const [uploading, setUploading] = useState(false);
// // // // //   const [error, setError] = useState("");
// // // // //   const [attachmentError, setAttachmentError] = useState({});

// // // // //   // S3 Client Configuration
// // // // //   const s3Client = new S3Client({
// // // // //     region: import.meta.env.VITE_AWS_REGION,
// // // // //     credentials: {
// // // // //       accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // // //       secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // // //     },
// // // // //   });

// // // // //   // Validate file type and size
// // // // //   const validateFile = (file, docType) => {
// // // // //     const validFormats = ["application/pdf", "image/jpeg", "image/png"];
// // // // //     if (!validFormats.includes(file.type)) {
// // // // //       setAttachmentError((prev) => ({
// // // // //         ...prev,
// // // // //         [docType]: "Invalid file format. Only PDF, JPG, and PNG are supported.",
// // // // //       }));
// // // // //       return false;
// // // // //     }
// // // // //     if (file.size > 2 * 1024 * 1024) {
// // // // //       setAttachmentError((prev) => ({
// // // // //         ...prev,
// // // // //         [docType]: "File size exceeds 2MB.",
// // // // //       }));
// // // // //       return false;
// // // // //     }
// // // // //     setAttachmentError((prev) => ({ ...prev, [docType]: "" }));
// // // // //     return true;
// // // // //   };

// // // // //   // Function to upload file to S3
// // // // //   const uploadToS3 = async (file, docType) => {
// // // // //     const bucket = import.meta.env.VITE_S3_BUCKET_NAME;
// // // // //     if (!bucket) {
// // // // //       throw new Error("S3 bucket name is not configured.");
// // // // //     }
// // // // //     try {
// // // // //       setUploading(true);
// // // // //       setError("");
// // // // //       const arrayBuffer = await file.arrayBuffer();
// // // // //       const key = `student/${studentId}/course_${courseIndex}/${docType}_${Date.now()}_${file.name}`;
// // // // //       const params = {
// // // // //         Bucket: bucket,
// // // // //         Key: key,
// // // // //         Body: new Uint8Array(arrayBuffer),
// // // // //         ContentType: file.type,
// // // // //       };
// // // // //       await s3Client.send(new PutObjectCommand(params));
// // // // //       const url = `https://${bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
// // // // //       console.log(`S3 Upload Success for ${docType}:`, { url, key });
// // // // //       return url;
// // // // //     } catch (err) {
// // // // //       setError(`Failed to upload ${docType}: ${err.message}`);
// // // // //       console.error(`S3 Upload Error for ${docType}:`, err);
// // // // //       throw err;
// // // // //     } finally {
// // // // //       setUploading(false);
// // // // //     }
// // // // //   };

// // // // //   // Function to generate pre-signed URL for viewing
// // // // //   const viewDocument = async (s3Url, docType) => {
// // // // //     try {
// // // // //       if (!s3Url) {
// // // // //         setError(`No ${docType} uploaded yet.`);
// // // // //         return;
// // // // //       }
// // // // //       const key = s3Url.split(`https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/`)[1];
// // // // //       const command = new GetObjectCommand({
// // // // //         Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
// // // // //         Key: key,
// // // // //       });
// // // // //       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// // // // //       console.log(`Generated Pre-signed URL for ${docType}:`, url);
// // // // //       window.open(url, "_blank");
// // // // //     } catch (err) {
// // // // //       setError(`Failed to generate view URL for ${docType}: ${err.message}`);
// // // // //       console.error(`View Error for ${docType}:`, err);
// // // // //     }
// // // // //   };

// // // // //   // Modified handleFileChange to validate and upload to S3
// // // // //   const handleFileChangeWithS3 = async (courseIndex, docType, event) => {
// // // // //     const file = event.target.files[0];
// // // // //     if (!file) return;

// // // // //     if (!validateFile(file, docType)) {
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       const s3Url = await uploadToS3(file, docType);
// // // // //       const fileData = { name: file.name, s3Url };
// // // // //       console.log(`Updating financeDetails for ${docType}:`, fileData);
// // // // //       handleFileChange(courseIndex, docType, fileData);
// // // // //     } catch (err) {
// // // // //       // Error is already set in uploadToS3
// // // // //     }
// // // // //   };

// // // // //   // Debug financeDetails to check state updates
// // // // //   console.log("Current financeDetails:", financeDetails);

// // // // //   return (
// // // // //     <div className="space-y-4">
// // // // //       {error && (
// // // // //         <Typography color="error" variant="body2">
// // // // //           {error}
// // // // //         </Typography>
// // // // //       )}
// // // // //       <div className="flex items-center space-x-4">
// // // // //         <Typography variant="subtitle1" className="text-gray-700">
// // // // //           Total Fees: {fullFeesDetails?.totalFees || 0}
// // // // //         </Typography>
// // // // //         <Select
// // // // //           value={financeDetails.discountType || ""}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(courseIndex, "discountType", "", e.target.value)
// // // // //           }
// // // // //           displayEmpty
// // // // //           className="w-32 bg-gray-100 rounded-lg"
// // // // //           disabled={!canUpdate}
// // // // //         >
// // // // //           <MenuItem value="" disabled>
// // // // //             Type
// // // // //           </MenuItem>
// // // // //           <MenuItem value="percentage">%</MenuItem>
// // // // //           <MenuItem value="value">₹</MenuItem>
// // // // //         </Select>
// // // // //         <TextField
// // // // //           label="Discount"
// // // // //           value={financeDetails.discountValue || ""}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(courseIndex, "discountValue", "", e.target.value)
// // // // //           }
// // // // //           className="w-32"
// // // // //           variant="outlined"
// // // // //           size="small"
// // // // //           disabled={!canUpdate}
// // // // //         />
// // // // //         <TextField
// // // // //           label="Discount Reason/Coupon"
// // // // //           value={financeDetails.discountReason || ""}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(courseIndex, "discountReason", "", e.target.value)
// // // // //           }
// // // // //           className="w-48"
// // // // //           variant="outlined"
// // // // //           size="small"
// // // // //           disabled={!canUpdate}
// // // // //         />
// // // // //         <Typography className="text-gray-700">
// // // // //           Fee After Discount: {financeDetails.feeAfterDiscount}
// // // // //         </Typography>
// // // // //       </div>
// // // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // // // //         Registration
// // // // //       </Typography>
// // // // //       <TableContainer>
// // // // //         <Table>
// // // // //           <TableHead>
// // // // //             <TableRow className="bg-blue-50">
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 Amount
// // // // //               </TableCell>
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 Date
// // // // //               </TableCell>
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 Payment Method
// // // // //               </TableCell>
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 Received By
// // // // //               </TableCell>
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 Remark
// // // // //               </TableCell>
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 Status
// // // // //               </TableCell>
// // // // //             </TableRow>
// // // // //           </TableHead>
// // // // //           <TableBody>
// // // // //             <TableRow>
// // // // //               <TableCell>
// // // // //                 <TextField
// // // // //                   value={financeDetails.registration.amount || ""}
// // // // //                   onChange={(e) =>
// // // // //                     handleFinanceChange(
// // // // //                       courseIndex,
// // // // //                       "registration",
// // // // //                       "amount",
// // // // //                       e.target.value
// // // // //                     )
// // // // //                   }
// // // // //                   size="small"
// // // // //                   disabled={!canUpdate}
// // // // //                 />
// // // // //               </TableCell>
// // // // //               <TableCell>
// // // // //                 <TextField
// // // // //                   type="date"
// // // // //                   value={financeDetails.registration.date || ""}
// // // // //                   onChange={(e) =>
// // // // //                     handleFinanceChange(
// // // // //                       courseIndex,
// // // // //                       "registration",
// // // // //                       "date",
// // // // //                       e.target.value
// // // // //                     )
// // // // //                   }
// // // // //                   size="small"
// // // // //                   disabled={!canUpdate}
// // // // //                 />
// // // // //               </TableCell>
// // // // //               <TableCell>
// // // // //                 <Select
// // // // //                   value={financeDetails.registration.paymentMethod || ""}
// // // // //                   onChange={(e) =>
// // // // //                     handleFinanceChange(
// // // // //                       courseIndex,
// // // // //                       "registration",
// // // // //                       "paymentMethod",
// // // // //                       e.target.value
// // // // //                     )
// // // // //                   }
// // // // //                   size="small"
// // // // //                   displayEmpty
// // // // //                   fullWidth
// // // // //                   disabled={!canUpdate}
// // // // //                 >
// // // // //                   <MenuItem value="" disabled>
// // // // //                     Select Payment Method
// // // // //                   </MenuItem>
// // // // //                   <MenuItem value="Cash">Cash</MenuItem>
// // // // //                   <MenuItem value="Card">Card</MenuItem>
// // // // //                   <MenuItem value="UPI">UPI</MenuItem>
// // // // //                   <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
// // // // //                   <MenuItem value="Cheque">Cheque</MenuItem>
// // // // //                 </Select>
// // // // //               </TableCell>
// // // // //               <TableCell>
// // // // //                 <TextField
// // // // //                   value={financeDetails.registration.receivedBy || ""}
// // // // //                   onChange={(e) =>
// // // // //                     handleFinanceChange(
// // // // //                       courseIndex,
// // // // //                       "registration",
// // // // //                       "receivedBy",
// // // // //                       e.target.value
// // // // //                     )
// // // // //                   }
// // // // //                   size="small"
// // // // //                   disabled={!canUpdate}
// // // // //                 />
// // // // //               </TableCell>
// // // // //               <TableCell>
// // // // //                 <TextField
// // // // //                   value={financeDetails.registration.remark || ""}
// // // // //                   onChange={(e) =>
// // // // //                     handleFinanceChange(
// // // // //                       courseIndex,
// // // // //                       "registration",
// // // // //                       "remark",
// // // // //                       e.target.value
// // // // //                     )
// // // // //                   }
// // // // //                   size="small"
// // // // //                   disabled={!canUpdate}
// // // // //                 />
// // // // //               </TableCell>
// // // // //               <TableCell>
// // // // //                 <Select
// // // // //                   value={financeDetails.registration.status || "Pending"}
// // // // //                   onChange={(e) =>
// // // // //                     handleFinanceChange(
// // // // //                       courseIndex,
// // // // //                       "registration",
// // // // //                       "status",
// // // // //                       e.target.value
// // // // //                     )
// // // // //                   }
// // // // //                   size="small"
// // // // //                   fullWidth
// // // // //                   disabled={!canUpdate}
// // // // //                 >
// // // // //                   <MenuItem value="Pending">Pending</MenuItem>
// // // // //                   <MenuItem value="Paid">Paid</MenuItem>
// // // // //                 </Select>
// // // // //               </TableCell>
// // // // //             </TableRow>
// // // // //           </TableBody>
// // // // //         </Table>
// // // // //       </TableContainer>
// // // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // // // //         Finance Details
// // // // //       </Typography>
// // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //         <FormControl fullWidth>
// // // // //           <InputLabel>Finance Partner</InputLabel>
// // // // //           <Select
// // // // //             value={financeDetails.financePartner || ""}
// // // // //             onChange={(e) =>
// // // // //               handleFinanceChange(
// // // // //                 courseIndex,
// // // // //                 "financePartner",
// // // // //                 "",
// // // // //                 e.target.value
// // // // //               )
// // // // //             }
// // // // //             label="Finance Partner"
// // // // //             className="bg-gray-100 rounded-lg"
// // // // //             disabled={!canUpdate}
// // // // //           >
// // // // //             <MenuItem value="" disabled>
// // // // //               Select Finance Partner
// // // // //             </MenuItem>
// // // // //             {financePartners.map((partner) => (
// // // // //               <MenuItem key={partner.id} value={partner.name}>
// // // // //                 {partner.name}
// // // // //               </MenuItem>
// // // // //             ))}
// // // // //           </Select>
// // // // //         </FormControl>
// // // // //         <FormControl fullWidth>
// // // // //           <InputLabel>Contact Person</InputLabel>
// // // // //           <Select
// // // // //             value={financeDetails.contactPerson || ""}
// // // // //             onChange={(e) =>
// // // // //               handleFinanceChange(
// // // // //                 courseIndex,
// // // // //                 "contactPerson",
// // // // //                 "",
// // // // //                 e.target.value
// // // // //               )
// // // // //             }
// // // // //             label="Contact Person"
// // // // //             className="bg-gray-100 rounded-lg"
// // // // //             disabled={!financeDetails.financePartner || !canUpdate}
// // // // //           >
// // // // //             <MenuItem value="" disabled>
// // // // //               Select Contact Person
// // // // //             </MenuItem>
// // // // //             {financeDetails.financePartner &&
// // // // //               financePartners
// // // // //                 .find((p) => p.name === financeDetails.financePartner)
// // // // //                 ?.contactPersons?.map((person, idx) => (
// // // // //                   <MenuItem key={idx} value={person.name}>
// // // // //                     {person.name}
// // // // //                   </MenuItem>
// // // // //                 ))}
// // // // //           </Select>
// // // // //         </FormControl>
// // // // //         <FormControl fullWidth>
// // // // //           <InputLabel>Finance Scheme</InputLabel>
// // // // //           <Select
// // // // //             value={financeDetails.scheme || ""}
// // // // //             onChange={(e) =>
// // // // //               handleFinanceChange(courseIndex, "scheme", "", e.target.value)
// // // // //             }
// // // // //             label="Finance Scheme"
// // // // //             className="bg-gray-100 rounded-lg"
// // // // //             disabled={!financeDetails.financePartner || !canUpdate}
// // // // //           >
// // // // //             <MenuItem value="">Select Finance Scheme</MenuItem>
// // // // //             {financeDetails.financePartner &&
// // // // //               financePartners
// // // // //                 .find((p) => p.name === financeDetails.financePartner)
// // // // //                 ?.scheme?.map((schemeItem, idx) => (
// // // // //                   <MenuItem key={idx} value={schemeItem.plan}>
// // // // //                     {schemeItem.plan}
// // // // //                     {schemeItem.description && ` - ${schemeItem.description}`}
// // // // //                   </MenuItem>
// // // // //                 ))}
// // // // //           </Select>
// // // // //         </FormControl>
// // // // //         <TextField
// // // // //           label="Loan Amount"
// // // // //           type="number"
// // // // //           value={financeDetails.loanAmount || 0}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)
// // // // //           }
// // // // //           variant="outlined"
// // // // //           size="small"
// // // // //           fullWidth
// // // // //           disabled={!canUpdate}
// // // // //         />
// // // // //         <TextField
// // // // //           label="Down Payment"
// // // // //           type="number"
// // // // //           value={financeDetails.downPayment || 0}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(courseIndex, "downPayment", "", e.target.value)
// // // // //           }
// // // // //           variant="outlined"
// // // // //           size="small"
// // // // //           fullWidth
// // // // //           disabled={!canUpdate}
// // // // //         />
// // // // //         <TextField
// // // // //           label="Down Payment Date"
// // // // //           type="date"
// // // // //           value={financeDetails.downPaymentDate || ""}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(
// // // // //               courseIndex,
// // // // //               "downPaymentDate",
// // // // //               "",
// // // // //               e.target.value
// // // // //             )
// // // // //           }
// // // // //           variant="outlined"
// // // // //           size="small"
// // // // //           fullWidth
// // // // //           InputLabelProps={{ shrink: true }}
// // // // //           disabled={!canUpdate}
// // // // //         />
// // // // //         <TextField
// // // // //           label="Applicant Name"
// // // // //           value={financeDetails.applicantName || ""}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(
// // // // //               courseIndex,
// // // // //               "applicantName",
// // // // //               "",
// // // // //               e.target.value
// // // // //             )
// // // // //           }
// // // // //           variant="outlined"
// // // // //           size="small"
// // // // //           fullWidth
// // // // //           disabled={!canUpdate}
// // // // //         />
// // // // //         <TextField
// // // // //           label="Relationship"
// // // // //           value={financeDetails.relationship || ""}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(
// // // // //               courseIndex,
// // // // //               "relationship",
// // // // //               "",
// // // // //               e.target.value
// // // // //             )
// // // // //           }
// // // // //           variant="outlined"
// // // // //           size="small"
// // // // //           fullWidth
// // // // //           disabled={!canUpdate}
// // // // //         />
// // // // //         <FormControl fullWidth>
// // // // //           <InputLabel>Loan Status</InputLabel>
// // // // //           <Select
// // // // //             value={financeDetails.loanStatus || "Pending"}
// // // // //             onChange={(e) =>
// // // // //               handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)
// // // // //             }
// // // // //             label="Loan Status"
// // // // //             className="bg-gray-100 rounded-lg"
// // // // //             disabled={!canUpdate}
// // // // //           >
// // // // //             <MenuItem value="Pending">Pending</MenuItem>
// // // // //             <MenuItem value="Approved">Approved</MenuItem>
// // // // //             <MenuItem value="Rejected">Rejected</MenuItem>
// // // // //             <MenuItem value="Disbursed">Disbursed</MenuItem>
// // // // //             <MenuItem value="Completed">Completed</MenuItem>
// // // // //           </Select>
// // // // //         </FormControl>
// // // // //       </div>
// // // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
// // // // //         Documents
// // // // //       </Typography>
// // // // //       <TableContainer>
// // // // //         <Table>
// // // // //           <TableHead>
// // // // //             <TableRow className="bg-blue-50">
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 Document Type
// // // // //               </TableCell>
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 File
// // // // //               </TableCell>
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 Status
// // // // //               </TableCell>
// // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // //                 Action
// // // // //               </TableCell>
// // // // //             </TableRow>
// // // // //           </TableHead>
// // // // //           <TableBody>
// // // // //             {[
// // // // //               { type: "photo", label: "Applicant Photo" },
// // // // //               { type: "bankStatement", label: "6 Months Bank Statement" },
// // // // //               { type: "paymentSlip", label: "Payment Slip" },
// // // // //               { type: "aadharCard", label: "Aadhar Card" },
// // // // //               { type: "panCard", label: "PAN Card" },
// // // // //             ].map((doc) => (
// // // // //               <TableRow key={doc.type}>
// // // // //                 <TableCell>{doc.label}</TableCell>
// // // // //                 <TableCell>
// // // // //                   <input
// // // // //                     type="file"
// // // // //                     accept="application/pdf,image/jpeg,image/png"
// // // // //                     onChange={(e) => handleFileChangeWithS3(courseIndex, doc.type, e)}
// // // // //                     className="mt-1"
// // // // //                     disabled={!canUpdate || uploading}
// // // // //                   />
// // // // //                   {attachmentError[doc.type] && (
// // // // //                     <Typography color="error" variant="body2" className="mt-1">
// // // // //                       {attachmentError[doc.type]}
// // // // //                     </Typography>
// // // // //                   )}
// // // // //                 </TableCell>
// // // // //                 <TableCell>
// // // // //                   {financeDetails[doc.type]?.s3Url ? (
// // // // //                     <Typography variant="body2" className="text-green-600">
// // // // //                       Uploaded: {financeDetails[doc.type].name}
// // // // //                     </Typography>
// // // // //                   ) : (
// // // // //                     <Typography variant="body2" className="text-gray-600">
// // // // //                       Not Uploaded
// // // // //                     </Typography>
// // // // //                   )}
// // // // //                 </TableCell>
// // // // //                 <TableCell>
// // // // //                   <Button
// // // // //                     variant="text"
// // // // //                     color="primary"
// // // // //                     onClick={() =>
// // // // //                       viewDocument(financeDetails[doc.type]?.s3Url, doc.label)
// // // // //                     }
// // // // //                     disabled={!financeDetails[doc.type]?.s3Url}
// // // // //                   >
// // // // //                     View
// // // // //                   </Button>
// // // // //                 </TableCell>
// // // // //               </TableRow>
// // // // //             ))}
// // // // //           </TableBody>
// // // // //         </Table>
// // // // //       </TableContainer>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default FinanceForm;




// // // // import React, { useState } from "react";
// // // // import {
// // // //   Typography,
// // // //   TextField,
// // // //   Select,
// // // //   MenuItem,
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableContainer,
// // // //   TableHead,
// // // //   TableRow,
// // // //   FormControl,
// // // //   InputLabel,
// // // //   Button,
// // // //   LinearProgress,
// // // // } from "@mui/material";
// // // // import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// // // // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// // // // import { useAuth } from "../../../../context/AuthContext";
// // // // import { logActivity } from "./utils";

// // // // const FinanceForm = ({
// // // //   courseIndex,
// // // //   fullFeesDetails,
// // // //   financeDetails,
// // // //   handleFinanceChange,
// // // //   handleFileChange,
// // // //   financePartners,
// // // //   canUpdate,
// // // //   user,
// // // //   studentId,
// // // //   uploadProgress,
// // // // }) => {
// // // //   const { user: authUser } = useAuth();
// // // //   const [error, setError] = useState("");
// // // //   const [attachmentError, setAttachmentError] = useState({});

// // // //   // S3 Client Configuration (for pre-signed URLs only)
// // // //   const s3Client = new S3Client({
// // // //     region: import.meta.env.VITE_AWS_REGION,
// // // //     credentials: {
// // // //       accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // //       secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // //     },
// // // //   });

// // // //   // Function to generate pre-signed URL for viewing
// // // //   const viewDocument = async (s3Url, docType) => {
// // // //     try {
// // // //       if (!s3Url) {
// // // //         setError(`No ${docType} uploaded yet.`);
// // // //         return;
// // // //       }
// // // //       const key = s3Url.split(
// // // //         `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${
// // // //           import.meta.env.VITE_AWS_REGION
// // // //         }.amazonaws.com/`
// // // //       )[1];
// // // //       const command = new GetObjectCommand({
// // // //         Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
// // // //         Key: key,
// // // //       });
// // // //       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// // // //       window.open(url, "_blank");
// // // //       logActivity(
// // // //         "VIEW_DOCUMENT",
// // // //         { studentId, courseIndex, docType, url },
// // // //         user
// // // //       );
// // // //     } catch (err) {
// // // //       setError(`Failed to generate view URL for ${docType}: ${err.message}`);
// // // //       console.error(`View Error for ${docType}:`, err);
// // // //     }
// // // //   };

// // // //   // Modified handleFileChange to align with AddCourse.jsx
// // // //   const handleFileChangeWithS3 = (courseIndex, docType, event) => {
// // // //     const file = event.target.files[0];
// // // //     if (!file) return;

// // // //     // Validation is handled in AddCourse.jsx, but we can clear any previous errors
// // // //     setAttachmentError((prev) => ({ ...prev, [docType]: "" }));

// // // //     // Call handleFileChange from AddCourse.jsx with the File object
// // // //     handleFileChange(courseIndex, docType, event);
// // // //   };

// // // //   return (
// // // //     <div className="space-y-4">
// // // //       {error && (
// // // //         <Typography color="error" variant="body2">
// // // //           {error}
// // // //         </Typography>
// // // //       )}
// // // //       <div className="flex items-center space-x-4">
// // // //         <Typography variant="subtitle1" className="text-gray-700">
// // // //           Total Fees: {fullFeesDetails?.totalFees || 0}
// // // //         </Typography>
// // // //         <Select
// // // //           value={financeDetails.discountType || ""}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(courseIndex, "discountType", "", e.target.value)
// // // //           }
// // // //           displayEmpty
// // // //           className="w-32 bg-gray-100 rounded-lg"
// // // //           disabled={!canUpdate}
// // // //         >
// // // //           <MenuItem value="" disabled>
// // // //             Type
// // // //           </MenuItem>
// // // //           <MenuItem value="percentage">%</MenuItem>
// // // //           <MenuItem value="value">₹</MenuItem>
// // // //         </Select>
// // // //         <TextField
// // // //           label="Discount"
// // // //           value={financeDetails.discountValue || ""}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(courseIndex, "discountValue", "", e.target.value)
// // // //           }
// // // //           className="w-32"
// // // //           variant="outlined"
// // // //           size="small"
// // // //           disabled={!canUpdate}
// // // //         />
// // // //         <TextField
// // // //           label="Discount Reason/Coupon"
// // // //           value={financeDetails.discountReason || ""}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(courseIndex, "discountReason", "", e.target.value)
// // // //           }
// // // //           className="w-48"
// // // //           variant="outlined"
// // // //           size="small"
// // // //           disabled={!canUpdate}
// // // //         />
// // // //         <Typography className="text-gray-700">
// // // //           Fee After Discount: {financeDetails.feeAfterDiscount}
// // // //         </Typography>
// // // //       </div>
// // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // // //         Registration
// // // //       </Typography>
// // // //       <TableContainer>
// // // //         <Table>
// // // //           <TableHead>
// // // //             <TableRow className="bg-blue-50">
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 Amount
// // // //               </TableCell>
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 Date
// // // //               </TableCell>
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 Payment Method
// // // //               </TableCell>
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 Received By
// // // //               </TableCell>
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 Remark
// // // //               </TableCell>
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 Status
// // // //               </TableCell>
// // // //             </TableRow>
// // // //           </TableHead>
// // // //           <TableBody>
// // // //             <TableRow>
// // // //               <TableCell>
// // // //                 <TextField
// // // //                   value={financeDetails.registration.amount || ""}
// // // //                   onChange={(e) =>
// // // //                     handleFinanceChange(
// // // //                       courseIndex,
// // // //                       "registration",
// // // //                       "amount",
// // // //                       e.target.value
// // // //                     )
// // // //                   }
// // // //                   size="small"
// // // //                   disabled={!canUpdate}
// // // //                 />
// // // //               </TableCell>
// // // //               <TableCell>
// // // //                 <TextField
// // // //                   type="date"
// // // //                   value={financeDetails.registration.date || ""}
// // // //                   onChange={(e) =>
// // // //                     handleFinanceChange(
// // // //                       courseIndex,
// // // //                       "registration",
// // // //                       "date",
// // // //                       e.target.value
// // // //                     )
// // // //                   }
// // // //                   size="small"
// // // //                   disabled={!canUpdate}
// // // //                 />
// // // //               </TableCell>
// // // //               <TableCell>
// // // //                 <Select
// // // //                   value={financeDetails.registration.paymentMethod || ""}
// // // //                   onChange={(e) =>
// // // //                     handleFinanceChange(
// // // //                       courseIndex,
// // // //                       "registration",
// // // //                       "paymentMethod",
// // // //                       e.target.value
// // // //                     )
// // // //                   }
// // // //                   size="small"
// // // //                   displayEmpty
// // // //                   fullWidth
// // // //                   disabled={!canUpdate}
// // // //                 >
// // // //                   <MenuItem value="" disabled>
// // // //                     Select Payment Method
// // // //                   </MenuItem>
// // // //                   <MenuItem value="Cash">Cash</MenuItem>
// // // //                   <MenuItem value="Card">Card</MenuItem>
// // // //                   <MenuItem value="UPI">UPI</MenuItem>
// // // //                   <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
// // // //                   <MenuItem value="Cheque">Cheque</MenuItem>
// // // //                 </Select>
// // // //               </TableCell>
// // // //               <TableCell>
// // // //                 <TextField
// // // //                   value={financeDetails.registration.receivedBy || ""}
// // // //                   onChange={(e) =>
// // // //                     handleFinanceChange(
// // // //                       courseIndex,
// // // //                       "registration",
// // // //                       "receivedBy",
// // // //                       e.target.value
// // // //                     )
// // // //                   }
// // // //                   size="small"
// // // //                   disabled={!canUpdate}
// // // //                 />
// // // //               </TableCell>
// // // //               <TableCell>
// // // //                 <TextField
// // // //                   value={financeDetails.registration.remark || ""}
// // // //                   onChange={(e) =>
// // // //                     handleFinanceChange(
// // // //                       courseIndex,
// // // //                       "registration",
// // // //                       "remark",
// // // //                       e.target.value
// // // //                     )
// // // //                   }
// // // //                   size="small"
// // // //                   disabled={!canUpdate}
// // // //                 />
// // // //               </TableCell>
// // // //               <TableCell>
// // // //                 <Select
// // // //                   value={financeDetails.registration.status || "Pending"}
// // // //                   onChange={(e) =>
// // // //                     handleFinanceChange(
// // // //                       courseIndex,
// // // //                       "registration",
// // // //                       "status",
// // // //                       e.target.value
// // // //                     )
// // // //                   }
// // // //                   size="small"
// // // //                   fullWidth
// // // //                   disabled={!canUpdate}
// // // //                 >
// // // //                   <MenuItem value="Pending">Pending</MenuItem>
// // // //                   <MenuItem value="Paid">Paid</MenuItem>
// // // //                 </Select>
// // // //               </TableCell>
// // // //             </TableRow>
// // // //           </TableBody>
// // // //         </Table>
// // // //       </TableContainer>
// // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // // //         Finance Details
// // // //       </Typography>
// // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //         <FormControl fullWidth>
// // // //           <InputLabel>Finance Partner</InputLabel>
// // // //           <Select
// // // //             value={financeDetails.financePartner || ""}
// // // //             onChange={(e) =>
// // // //               handleFinanceChange(
// // // //                 courseIndex,
// // // //                 "financePartner",
// // // //                 "",
// // // //                 e.target.value
// // // //               )
// // // //             }
// // // //             label="Finance Partner"
// // // //             className="bg-gray-100 rounded-lg"
// // // //             disabled={!canUpdate}
// // // //           >
// // // //             <MenuItem value="" disabled>
// // // //               Select Finance Partner
// // // //             </MenuItem>
// // // //             {financePartners.map((partner) => (
// // // //               <MenuItem key={partner.id} value={partner.name}>
// // // //                 {partner.name}
// // // //               </MenuItem>
// // // //             ))}
// // // //           </Select>
// // // //         </FormControl>
// // // //         <FormControl fullWidth>
// // // //           <InputLabel>Contact Person</InputLabel>
// // // //           <Select
// // // //             value={financeDetails.contactPerson || ""}
// // // //             onChange={(e) =>
// // // //               handleFinanceChange(
// // // //                 courseIndex,
// // // //                 "contactPerson",
// // // //                 "",
// // // //                 e.target.value
// // // //               )
// // // //             }
// // // //             label="Contact Person"
// // // //             className="bg-gray-100 rounded-lg"
// // // //             disabled={!financeDetails.financePartner || !canUpdate}
// // // //           >
// // // //             <MenuItem value="" disabled>
// // // //               Select Contact Person
// // // //             </MenuItem>
// // // //             {financeDetails.financePartner &&
// // // //               financePartners
// // // //                 .find((p) => p.name === financeDetails.financePartner)
// // // //                 ?.contactPersons?.map((person, idx) => (
// // // //                   <MenuItem key={idx} value={person.name}>
// // // //                     {person.name}
// // // //                   </MenuItem>
// // // //                 ))}
// // // //           </Select>
// // // //         </FormControl>
// // // //         <FormControl fullWidth>
// // // //           <InputLabel>Finance Scheme</InputLabel>
// // // //           <Select
// // // //             value={financeDetails.scheme || ""}
// // // //             onChange={(e) =>
// // // //               handleFinanceChange(courseIndex, "scheme", "", e.target.value)
// // // //             }
// // // //             label="Finance Scheme"
// // // //             className="bg-gray-100 rounded-lg"
// // // //             disabled={!financeDetails.financePartner || !canUpdate}
// // // //           >
// // // //             <MenuItem value="">Select Finance Scheme</MenuItem>
// // // //             {financeDetails.financePartner &&
// // // //               financePartners
// // // //                 .find((p) => p.name === financeDetails.financePartner)
// // // //                 ?.scheme?.map((schemeItem, idx) => (
// // // //                   <MenuItem key={idx} value={schemeItem.plan}>
// // // //                     {schemeItem.plan}
// // // //                     {schemeItem.description && ` - ${schemeItem.description}`}
// // // //                   </MenuItem>
// // // //                 ))}
// // // //           </Select>
// // // //         </FormControl>
// // // //         <TextField
// // // //           label="Loan Amount"
// // // //           type="number"
// // // //           value={financeDetails.loanAmount || 0}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)
// // // //           }
// // // //           variant="outlined"
// // // //           size="small"
// // // //           fullWidth
// // // //           disabled={!canUpdate}
// // // //         />
// // // //         <TextField
// // // //           label="Down Payment"
// // // //           type="number"
// // // //           value={financeDetails.downPayment || 0}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(courseIndex, "downPayment", "", e.target.value)
// // // //           }
// // // //           variant="outlined"
// // // //           size="small"
// // // //           fullWidth
// // // //           disabled={!canUpdate}
// // // //         />
// // // //         <TextField
// // // //           label="Down Payment Date"
// // // //           type="date"
// // // //           value={financeDetails.downPaymentDate || ""}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(
// // // //               courseIndex,
// // // //               "downPaymentDate",
// // // //               "",
// // // //               e.target.value
// // // //             )
// // // //           }
// // // //           variant="outlined"
// // // //           size="small"
// // // //           fullWidth
// // // //           InputLabelProps={{ shrink: true }}
// // // //           disabled={!canUpdate}
// // // //         />
// // // //         <TextField
// // // //           label="Applicant Name"
// // // //           value={financeDetails.applicantName || ""}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(
// // // //               courseIndex,
// // // //               "applicantName",
// // // //               "",
// // // //               e.target.value
// // // //             )
// // // //           }
// // // //           variant="outlined"
// // // //           size="small"
// // // //           fullWidth
// // // //           disabled={!canUpdate}
// // // //         />
// // // //         <TextField
// // // //           label="Relationship"
// // // //           value={financeDetails.relationship || ""}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(
// // // //               courseIndex,
// // // //               "relationship",
// // // //               "",
// // // //               e.target.value
// // // //             )
// // // //           }
// // // //           variant="outlined"
// // // //           size="small"
// // // //           fullWidth
// // // //           disabled={!canUpdate}
// // // //         />
// // // //         <FormControl fullWidth>
// // // //           <InputLabel>Loan Status</InputLabel>
// // // //           <Select
// // // //             value={financeDetails.loanStatus || "Pending"}
// // // //             onChange={(e) =>
// // // //               handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)
// // // //             }
// // // //             label="Loan Status"
// // // //             className="bg-gray-100 rounded-lg"
// // // //             disabled={!canUpdate}
// // // //           >
// // // //             <MenuItem value="Pending">Pending</MenuItem>
// // // //             <MenuItem value="Approved">Approved</MenuItem>
// // // //             <MenuItem value="Rejected">Rejected</MenuItem>
// // // //             <MenuItem value="Disbursed">Disbursed</MenuItem>
// // // //             <MenuItem value="Completed">Completed</MenuItem>
// // // //           </Select>
// // // //         </FormControl>
// // // //       </div>
// // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
// // // //         Documents
// // // //       </Typography>
// // // //       <TableContainer>
// // // //         <Table>
// // // //           <TableHead>
// // // //             <TableRow className="bg-blue-50">
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 Document Type
// // // //               </TableCell>
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 File
// // // //               </TableCell>
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 Status
// // // //               </TableCell>
// // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // //                 Action
// // // //               </TableCell>
// // // //             </TableRow>
// // // //           </TableHead>
// // // //           <TableBody>
// // // //             {[
// // // //               { type: "photo", label: "Applicant Photo" },
// // // //               { type: "bankStatement", label: "6 Months Bank Statement" },
// // // //               { type: "paymentSlip", label: "Payment Slip" },
// // // //               { type: "aadharCard", label: "Aadhar Card" },
// // // //               { type: "panCard", label: "PAN Card" },
// // // //             ].map((doc) => (
// // // //               <TableRow key={doc.type}>
// // // //                 <TableCell>{doc.label}</TableCell>
// // // //                 <TableCell>
// // // //                   <input
// // // //                     type="file"
// // // //                     accept="application/pdf,image/jpeg,image/png"
// // // //                     onChange={(e) => handleFileChangeWithS3(courseIndex, doc.type, e)}
// // // //                     className="mt-1"
// // // //                     disabled={!canUpdate}
// // // //                   />
// // // //                   {attachmentError[doc.type] && (
// // // //                     <Typography color="error" variant="body2" className="mt-1">
// // // //                       {attachmentError[doc.type]}
// // // //                     </Typography>
// // // //                   )}
// // // //                 </TableCell>
// // // //                 <TableCell>
// // // //                   {uploadProgress[`${courseIndex}_${doc.type}`] !== undefined ? (
// // // //                     uploadProgress[`${courseIndex}_${doc.type}`] === -1 ? (
// // // //                       <Typography variant="body2" color="error">
// // // //                         Upload Failed
// // // //                       </Typography>
// // // //                     ) : uploadProgress[`${courseIndex}_${doc.type}`] < 100 ? (
// // // //                       <div>
// // // //                         <Typography variant="body2">
// // // //                           Uploading: {uploadProgress[`${courseIndex}_${doc.type}`]}%
// // // //                         </Typography>
// // // //                         <LinearProgress
// // // //                           variant="determinate"
// // // //                           value={uploadProgress[`${courseIndex}_${doc.type}`]}
// // // //                         />
// // // //                       </div>
// // // //                     ) : (
// // // //                       <Typography variant="body2" className="text-green-600">
// // // //                         Upload Complete
// // // //                       </Typography>
// // // //                     )
// // // //                   ) : financeDetails[doc.type] ? (
// // // //                     <Typography variant="body2" className="text-green-600">
// // // //                       Uploaded: {financeDetails[`${doc.type}Name`]}
// // // //                     </Typography>
// // // //                   ) : (
// // // //                     <Typography variant="body2" className="text-gray-600">
// // // //                       Not Uploaded
// // // //                     </Typography>
// // // //                   )}
// // // //                 </TableCell>
// // // //                 <TableCell>
// // // //                   <Button
// // // //                     variant="text"
// // // //                     color="primary"
// // // //                     onClick={() =>
// // // //                       viewDocument(financeDetails[doc.type], doc.label)
// // // //                     }
// // // //                     disabled={!financeDetails[doc.type]}
// // // //                   >
// // // //                     View
// // // //                   </Button>
// // // //                 </TableCell>
// // // //               </TableRow>
// // // //             ))}
// // // //           </TableBody>
// // // //         </Table>
// // // //       </TableContainer>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default FinanceForm;



// // // import React, { useState } from "react";
// // // import {
// // //   Typography,
// // //   TextField,
// // //   Select,
// // //   MenuItem,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   FormControl,
// // //   InputLabel,
// // //   Button,
// // //   LinearProgress,
// // // } from "@mui/material";
// // // import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// // // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// // // import { useAuth } from "../../../../context/AuthContext";
// // // import { logActivity } from "./utils";

// // // const FinanceForm = ({
// // //   courseIndex,
// // //   fullFeesDetails,
// // //   financeDetails,
// // //   handleFinanceChange,
// // //   handleFileChange,
// // //   financePartners,
// // //   canUpdate,
// // //   user,
// // //   studentId,
// // //   uploadProgress,
// // // }) => {
// // //   const { user: authUser } = useAuth();
// // //   const [error, setError] = useState("");
// // //   const [attachmentError, setAttachmentError] = useState({});

// // //   // S3 Client Configuration (for pre-signed URLs only)
// // //   const s3Client = new S3Client({
// // //     region: import.meta.env.VITE_AWS_REGION,
// // //     credentials: {
// // //       accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // //       secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // //     },
// // //   });

// // //   // Function to generate pre-signed URL for viewing
// // //   // const viewDocument = async (s3Url, docType) => {
// // //   //   try {
// // //   //     if (!s3Url) {
// // //   //       setError(`No ${docType} uploaded yet.`);
// // //   //       return;
// // //   //     }
// // //   //     // Validate s3Url is a string and starts with expected S3 URL
// // //   //     if (typeof s3Url !== 'string') {
// // //   //       console.error(`Invalid s3Url for ${docType}:`, s3Url);
// // //   //       setError(`Invalid ${docType} URL: Not a valid string.`);
// // //   //       return;
// // //   //     }
// // //   //     const expectedPrefix = `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${
// // //   //       import.meta.env.VITE_AWS_REGION
// // //   //     }.amazonaws.com/`;
// // //   //     if (!s3Url.startsWith(expectedPrefix)) {
// // //   //       console.error(`Invalid s3Url format for ${docType}:`, s3Url);
// // //   //       setError(`Invalid ${docType} URL: Does not match expected S3 format.`);
// // //   //       return;
// // //   //     }
// // //   //     const key = s3Url.split(expectedPrefix)[1];
// // //   //     if (!key) {
// // //   //       console.error(`Failed to extract S3 key for ${docType}:`, s3Url);
// // //   //       setError(`Invalid ${docType} URL: Could not extract S3 key.`);
// // //   //       return;
// // //   //     }
// // //   //     const command = new GetObjectCommand({
// // //   //       Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
// // //   //       Key: key,
// // //   //     });
// // //   //     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// // //   //     window.open(url, "_blank");
// // //   //     logActivity(
// // //   //       "VIEW_DOCUMENT",
// // //   //       { studentId, courseIndex, docType, url },
// // //   //       user
// // //   //     );
// // //   //   } catch (err) {
// // //   //     setError(`Failed to generate view URL for ${docType}: ${err.message}`);
// // //   //     console.error(`View Error for ${docType}:`, err);
// // //   //   }
// // //   // };

// // //   const handleFileChangeWithS3 = (courseIndex, docType, event) => {
// // //     const file = event.target.files[0];
// // //     if (!file) {
// // //       console.warn(`No file selected for ${docType}`);
// // //       return;
// // //     }
  
// // //     // Clear previous errors
// // //     setAttachmentError((prev) => ({ ...prev, [docType]: "" }));
  
// // //     // Call handleFileChange from AddCourse.jsx
// // //     console.log(`Selected file for ${docType}:`, file.name);
// // //     handleFileChange(courseIndex, docType, event);
// // //   };

// // //   const viewDocument = async (s3Url, docType) => {
// // //     try {
// // //       // Log input parameters
// // //       console.log(`viewDocument called for ${docType}:`, { s3Url, type: typeof s3Url });
  
// // //       // Validate s3Url
// // //       if (!s3Url || typeof s3Url !== "string") {
// // //         const errorMsg = `No valid ${docType} URL provided`;
// // //         console.error(errorMsg, { s3Url });
// // //         setError(errorMsg);
// // //         logActivity(
// // //           "VIEW_DOCUMENT_ERROR",
// // //           { studentId, courseIndex, docType, error: errorMsg },
// // //           user
// // //         );
// // //         return;
// // //       }
  
// // //       // Validate S3 configuration
// // //       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // //       const region = import.meta.env.VITE_AWS_REGION;
// // //       console.log("S3 Configuration:", {
// // //         bucketName,
// // //         region,
// // //         hasCredentials: !!s3Client.config.credentials,
// // //       });
  
// // //       if (!bucketName || !region) {
// // //         const errorMsg = "Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION";
// // //         console.error(errorMsg);
// // //         setError(errorMsg);
// // //         logActivity(
// // //           "VIEW_DOCUMENT_ERROR",
// // //           { studentId, courseIndex, docType, error: errorMsg },
// // //           user
// // //         );
// // //         return;
// // //       }
  
// // //       if (!s3Client.config.credentials) {
// // //         const errorMsg = "S3 client credentials not configured";
// // //         console.error(errorMsg);
// // //         setError(errorMsg);
// // //         logActivity(
// // //           "VIEW_DOCUMENT_ERROR",
// // //           { studentId, courseIndex, docType, error: errorMsg },
// // //           user
// // //         );
// // //         return;
// // //       }
  
// // //       // Extract S3 key
// // //       const expectedPrefix = `https://${bucketName}.s3.${region}.amazonaws.com/`;
// // //       if (!s3Url.startsWith(expectedPrefix)) {
// // //         const errorMsg = `Invalid ${docType} URL: Does not match expected S3 format`;
// // //         console.error(errorMsg, { s3Url, expectedPrefix });
// // //         setError(errorMsg);
// // //         logActivity(
// // //           "VIEW_DOCUMENT_ERROR",
// // //           { studentId, courseIndex, docType, error: errorMsg },
// // //           user
// // //         );
// // //         return;
// // //       }
  
// // //       const key = s3Url.replace(expectedPrefix, "");
// // //       if (!key) {
// // //         const errorMsg = `Invalid ${docType} URL: Could not extract S3 key`;
// // //         console.error(errorMsg, { s3Url });
// // //         setError(errorMsg);
// // //         logActivity(
// // //           "VIEW_DOCUMENT_ERROR",
// // //           { studentId, courseIndex, docType, error: errorMsg },
// // //           user
// // //         );
// // //         return;
// // //       }
  
// // //       // Generate pre-signed URL
// // //       console.log(`Generating pre-signed URL for ${docType}:`, { bucket: bucketName, key });
// // //       const command = new GetObjectCommand({
// // //         Bucket: bucketName,
// // //         Key: key,
// // //       });
// // //       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// // //       console.log(`Pre-signed URL generated for ${docType}:`, url);
  
// // //       // Open the URL
// // //       window.open(url, "_blank");
// // //       logActivity(
// // //         "VIEW_DOCUMENT_SUCCESS",
// // //         { studentId, courseIndex, docType, url },
// // //         user
// // //       );
// // //     } catch (err) {
// // //       console.error(`Error generating pre-signed URL for ${docType}:`, {
// // //         error: err.message,
// // //         code: err.code,
// // //         stack: err.stack,
// // //         requestId: err.$metadata?.requestId,
// // //       });
// // //       const errorMsg = `Failed to view ${docType}: ${err.message}`;
// // //       setError(errorMsg);
// // //       logActivity(
// // //         "VIEW_DOCUMENT_ERROR",
// // //         { studentId, courseIndex, docType, error: err.message },
// // //         user
// // //       );
// // //     }
// // //   };
  
// // //   // const viewDocument = async (s3Url, docType) => {
// // //   //   try {
// // //   //     // Log input parameters
// // //   //   console.log(`viewDocument called for ${docType}:`, { s3Url, type: typeof s3Url });
// // //   //     if (!s3Url || typeof s3Url !== "string") {
// // //   //       const errorMsg = `No valid ${docType} URL provided`;
// // //   //       console.error(errorMsg, { s3Url });
// // //   //       setError(errorMsg);
// // //   //       return;
// // //   //     }
  
// // //   //     const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // //   //     const region = import.meta.env.VITE_AWS_REGION;
// // //   //     if (!bucketName || !region) {
// // //   //       const errorMsg = "Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION";
// // //   //       console.error(errorMsg);
// // //   //       setError(errorMsg);
// // //   //       return;
// // //   //     }
  
// // //   //     const expectedPrefix = `https://${bucketName}.s3.${region}.amazonaws.com/`;
// // //   //     if (!s3Url.startsWith(expectedPrefix)) {
// // //   //       const errorMsg = `Invalid ${docType} URL: Does not match expected S3 format`;
// // //   //       console.error(errorMsg, { s3Url, expectedPrefix });
// // //   //       setError(errorMsg);
// // //   //       return;
// // //   //     }
  
// // //   //     const key = s3Url.replace(expectedPrefix, "");
// // //   //     if (!key) {
// // //   //       const errorMsg = `Invalid ${docType} URL: Could not extract S3 key`;
// // //   //       console.error(errorMsg, { s3Url });
// // //   //       setError(errorMsg);
// // //   //       return;
// // //   //     }
  
// // //   //     console.log(`Generating pre-signed URL for ${docType}:`, { bucket: bucketName, key });
// // //   //     const command = new GetObjectCommand({
// // //   //       Bucket: bucketName,
// // //   //       Key: key,
// // //   //     });
// // //   //     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// // //   //     console.log(`Pre-signed URL generated for ${docType}:`, url);
// // //   //     window.open(url, "_blank");
// // //   //     logActivity(
// // //   //       "VIEW_DOCUMENT",
// // //   //       { studentId, courseIndex, docType, url },
// // //   //       user
// // //   //     );
// // //   //   } catch (err) {
// // //   //     console.error(`Error generating view URL for ${docType}:`, err);
// // //   //     setError(`Failed to view ${docType}: ${err.message}`);
// // //   //   }
// // //   // };

// // //   // Modified handleFileChange to align with AddCourse.jsx
// // //   // const handleFileChangeWithS3 = (courseIndex, docType, event) => {
// // //   //   const file = event.target.files[0];
// // //   //   if (!file) return;

// // //   //   // Validation is handled in AddCourse.jsx, but we can clear any previous errors
// // //   //   setAttachmentError((prev) => ({ ...prev, [docType]: "" }));

// // //   //   // Call handleFileChange from AddCourse.jsx with the File object
// // //   //   handleFileChange(courseIndex, docType, event);
// // //   // };

// // //   return (
// // //     <div className="space-y-4">
// // //       {error && (
// // //         <Typography color="error" variant="body2">
// // //           {error}
// // //         </Typography>
// // //       )}
// // //       <div className="flex items-center space-x-4">
// // //         <Typography variant="subtitle1" className="text-gray-700">
// // //           Total Fees: {fullFeesDetails?.totalFees || 0}
// // //         </Typography>
// // //         <Select
// // //           value={financeDetails.discountType || ""}
// // //           onChange={(e) =>
// // //             handleFinanceChange(courseIndex, "discountType", "", e.target.value)
// // //           }
// // //           displayEmpty
// // //           className="w-32 bg-gray-100 rounded-lg"
// // //           disabled={!canUpdate}
// // //         >
// // //           <MenuItem value="" disabled>
// // //             Type
// // //           </MenuItem>
// // //           <MenuItem value="percentage">%</MenuItem>
// // //           <MenuItem value="value">₹</MenuItem>
// // //         </Select>
// // //         <TextField
// // //           label="Discount"
// // //           value={financeDetails.discountValue || ""}
// // //           onChange={(e) =>
// // //             handleFinanceChange(courseIndex, "discountValue", "", e.target.value)
// // //           }
// // //           className="w-32"
// // //           variant="outlined"
// // //           size="small"
// // //           disabled={!canUpdate}
// // //         />
// // //         <TextField
// // //           label="Discount Reason/Coupon"
// // //           value={financeDetails.discountReason || ""}
// // //           onChange={(e) =>
// // //             handleFinanceChange(courseIndex, "discountReason", "", e.target.value)
// // //           }
// // //           className="w-48"
// // //           variant="outlined"
// // //           size="small"
// // //           disabled={!canUpdate}
// // //         />
// // //         <Typography className="text-gray-700">
// // //           Fee After Discount: {financeDetails.feeAfterDiscount}
// // //         </Typography>
// // //       </div>
// // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // //         Registration
// // //       </Typography>
// // //       <TableContainer>
// // //         <Table>
// // //           <TableHead>
// // //             <TableRow className="bg-blue-50">
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 Amount
// // //               </TableCell>
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 Date
// // //               </TableCell>
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 Payment Method
// // //               </TableCell>
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 Received By
// // //               </TableCell>
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 Remark
// // //               </TableCell>
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 Status
// // //               </TableCell>
// // //             </TableRow>
// // //           </TableHead>
// // //           <TableBody>
// // //             <TableRow>
// // //               <TableCell>
// // //                 <TextField
// // //                   value={financeDetails.registration.amount || ""}
// // //                   onChange={(e) =>
// // //                     handleFinanceChange(
// // //                       courseIndex,
// // //                       "registration",
// // //                       "amount",
// // //                       e.target.value
// // //                     )
// // //                   }
// // //                   size="small"
// // //                   disabled={!canUpdate}
// // //                 />
// // //               </TableCell>
// // //               <TableCell>
// // //                 <TextField
// // //                   type="date"
// // //                   value={financeDetails.registration.date || ""}
// // //                   onChange={(e) =>
// // //                     handleFinanceChange(
// // //                       courseIndex,
// // //                       "registration",
// // //                       "date",
// // //                       e.target.value
// // //                     )
// // //                   }
// // //                   size="small"
// // //                   disabled={!canUpdate}
// // //                 />
// // //               </TableCell>
// // //               <TableCell>
// // //                 <Select
// // //                   value={financeDetails.registration.paymentMethod || ""}
// // //                   onChange={(e) =>
// // //                     handleFinanceChange(
// // //                       courseIndex,
// // //                       "registration",
// // //                       "paymentMethod",
// // //                       e.target.value
// // //                     )
// // //                   }
// // //                   size="small"
// // //                   displayEmpty
// // //                   fullWidth
// // //                   disabled={!canUpdate}
// // //                 >
// // //                   <MenuItem value="" disabled>
// // //                     Select Payment Method
// // //                   </MenuItem>
// // //                   <MenuItem value="Cash">Cash</MenuItem>
// // //                   <MenuItem value="Card">Card</MenuItem>
// // //                   <MenuItem value="UPI">UPI</MenuItem>
// // //                   <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
// // //                   <MenuItem value="Cheque">Cheque</MenuItem>
// // //                 </Select>
// // //               </TableCell>
// // //               <TableCell>
// // //                 <TextField
// // //                   value={financeDetails.registration.receivedBy || ""}
// // //                   onChange={(e) =>
// // //                     handleFinanceChange(
// // //                       courseIndex,
// // //                       "registration",
// // //                       "receivedBy",
// // //                       e.target.value
// // //                     )
// // //                   }
// // //                   size="small"
// // //                   disabled={!canUpdate}
// // //                 />
// // //               </TableCell>
// // //               <TableCell>
// // //                 <TextField
// // //                   value={financeDetails.registration.remark || ""}
// // //                   onChange={(e) =>
// // //                     handleFinanceChange(
// // //                       courseIndex,
// // //                       "registration",
// // //                       "remark",
// // //                       e.target.value
// // //                     )
// // //                   }
// // //                   size="small"
// // //                   disabled={!canUpdate}
// // //                 />
// // //               </TableCell>
// // //               <TableCell>
// // //                 <Select
// // //                   value={financeDetails.registration.status || "Pending"}
// // //                   onChange={(e) =>
// // //                     handleFinanceChange(
// // //                       courseIndex,
// // //                       "registration",
// // //                       "status",
// // //                       e.target.value
// // //                     )
// // //                   }
// // //                   size="small"
// // //                   fullWidth
// // //                   disabled={!canUpdate}
// // //                 >
// // //                   <MenuItem value="Pending">Pending</MenuItem>
// // //                   <MenuItem value="Paid">Paid</MenuItem>
// // //                 </Select>
// // //               </TableCell>
// // //             </TableRow>
// // //           </TableBody>
// // //         </Table>
// // //       </TableContainer>
// // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // //         Finance Details
// // //       </Typography>
// // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //         <FormControl fullWidth>
// // //           <InputLabel>Finance Partner</InputLabel>
// // //           <Select
// // //             value={financeDetails.financePartner || ""}
// // //             onChange={(e) =>
// // //               handleFinanceChange(
// // //                 courseIndex,
// // //                 "financePartner",
// // //                 "",
// // //                 e.target.value
// // //               )
// // //             }
// // //             label="Finance Partner"
// // //             className="bg-gray-100 rounded-lg"
// // //             disabled={!canUpdate}
// // //           >
// // //             <MenuItem value="" disabled>
// // //               Select Finance Partner
// // //             </MenuItem>
// // //             {financePartners.map((partner) => (
// // //               <MenuItem key={partner.id} value={partner.name}>
// // //                 {partner.name}
// // //               </MenuItem>
// // //             ))}
// // //           </Select>
// // //         </FormControl>
// // //         <FormControl fullWidth>
// // //           <InputLabel>Contact Person</InputLabel>
// // //           <Select
// // //             value={financeDetails.contactPerson || ""}
// // //             onChange={(e) =>
// // //               handleFinanceChange(
// // //                 courseIndex,
// // //                 "contactPerson",
// // //                 "",
// // //                 e.target.value
// // //               )
// // //             }
// // //             label="Contact Person"
// // //             className="bg-gray-100 rounded-lg"
// // //             disabled={!financeDetails.financePartner || !canUpdate}
// // //           >
// // //             <MenuItem value="" disabled>
// // //               Select Contact Person
// // //             </MenuItem>
// // //             {financeDetails.financePartner &&
// // //               financePartners
// // //                 .find((p) => p.name === financeDetails.financePartner)
// // //                 ?.contactPersons?.map((person, idx) => (
// // //                   <MenuItem key={idx} value={person.name}>
// // //                     {person.name}
// // //                   </MenuItem>
// // //                 ))}
// // //           </Select>
// // //         </FormControl>
// // //         <FormControl fullWidth>
// // //           <InputLabel>Finance Scheme</InputLabel>
// // //           <Select
// // //             value={financeDetails.scheme || ""}
// // //             onChange={(e) =>
// // //               handleFinanceChange(courseIndex, "scheme", "", e.target.value)
// // //             }
// // //             label="Finance Scheme"
// // //             className="bg-gray-100 rounded-lg"
// // //             disabled={!financeDetails.financePartner || !canUpdate}
// // //           >
// // //             <MenuItem value="">Select Finance Scheme</MenuItem>
// // //             {financeDetails.financePartner &&
// // //               financePartners
// // //                 .find((p) => p.name === financeDetails.financePartner)
// // //                 ?.scheme?.map((schemeItem, idx) => (
// // //                   <MenuItem key={idx} value={schemeItem.plan}>
// // //                     {schemeItem.plan}
// // //                     {schemeItem.description && ` - ${schemeItem.description}`}
// // //                   </MenuItem>
// // //                 ))}
// // //           </Select>
// // //         </FormControl>
// // //         <TextField
// // //           label="Loan Amount"
// // //           type="number"
// // //           value={financeDetails.loanAmount || 0}
// // //           onChange={(e) =>
// // //             handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)
// // //           }
// // //           variant="outlined"
// // //           size="small"
// // //           fullWidth
// // //           disabled={!canUpdate}
// // //         />
// // //         <TextField
// // //           label="Down Payment"
// // //           type="number"
// // //           value={financeDetails.downPayment || 0}
// // //           onChange={(e) =>
// // //             handleFinanceChange(courseIndex, "downPayment", "", e.target.value)
// // //           }
// // //           variant="outlined"
// // //           size="small"
// // //           fullWidth
// // //           disabled={!canUpdate}
// // //         />
// // //         <TextField
// // //           label="Down Payment Date"
// // //           type="date"
// // //           value={financeDetails.downPaymentDate || ""}
// // //           onChange={(e) =>
// // //             handleFinanceChange(
// // //               courseIndex,
// // //               "downPaymentDate",
// // //               "",
// // //               e.target.value
// // //             )
// // //           }
// // //           variant="outlined"
// // //           size="small"
// // //           fullWidth
// // //           InputLabelProps={{ shrink: true }}
// // //           disabled={!canUpdate}
// // //         />
// // //         <TextField
// // //           label="Applicant Name"
// // //           value={financeDetails.applicantName || ""}
// // //           onChange={(e) =>
// // //             handleFinanceChange(
// // //               courseIndex,
// // //               "applicantName",
// // //               "",
// // //               e.target.value
// // //             )
// // //           }
// // //           variant="outlined"
// // //           size="small"
// // //           fullWidth
// // //           disabled={!canUpdate}
// // //         />
// // //         <TextField
// // //           label="Relationship"
// // //           value={financeDetails.relationship || ""}
// // //           onChange={(e) =>
// // //             handleFinanceChange(
// // //               courseIndex,
// // //               "relationship",
// // //               "",
// // //               e.target.value
// // //             )
// // //           }
// // //           variant="outlined"
// // //           size="small"
// // //           fullWidth
// // //           disabled={!canUpdate}
// // //         />
// // //         <FormControl fullWidth>
// // //           <InputLabel>Loan Status</InputLabel>
// // //           <Select
// // //             value={financeDetails.loanStatus || "Pending"}
// // //             onChange={(e) =>
// // //               handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)
// // //             }
// // //             label="Loan Status"
// // //             className="bg-gray-100 rounded-lg"
// // //             disabled={!canUpdate}
// // //           >
// // //             <MenuItem value="Pending">Pending</MenuItem>
// // //             <MenuItem value="Approved">Approved</MenuItem>
// // //             <MenuItem value="Rejected">Rejected</MenuItem>
// // //             <MenuItem value="Disbursed">Disbursed</MenuItem>
// // //             <MenuItem value="Completed">Completed</MenuItem>
// // //           </Select>
// // //         </FormControl>
// // //       </div>
// // //       <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
// // //         Documents
// // //       </Typography>
// // //       <TableContainer>
// // //         <Table>
// // //           <TableHead>
// // //             <TableRow className="bg-blue-50">
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 Document Type
// // //               </TableCell>
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 File
// // //               </TableCell>
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 Status
// // //               </TableCell>
// // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // //                 Action
// // //               </TableCell>
// // //             </TableRow>
// // //           </TableHead>
// // //           <TableBody>
// // //             {[
// // //               { type: "photo", label: "Applicant Photo" },
// // //               { type: "bankStatement", label: "6 Months Bank Statement" },
// // //               { type: "paymentSlip", label: "Payment Slip" },
// // //               { type: "aadharCard", label: "Aadhar Card" },
// // //               { type: "panCard", label: "PAN Card" },
// // //             ].map((doc) => (
// // //               <TableRow key={doc.type}>
// // //                 <TableCell>{doc.label}</TableCell>
// // //                 <TableCell>
// // //                   <input
// // //                     type="file"
// // //                     accept="application/pdf,image/jpeg,image/png"
// // //                     onChange={(e) => handleFileChangeWithS3(courseIndex, doc.type, e)}
// // //                     className="mt-1"
// // //                     disabled={!canUpdate}
// // //                   />
// // //                   {attachmentError[doc.type] && (
// // //                     <Typography color="error" variant="body2" className="mt-1">
// // //                       {attachmentError[doc.type]}
// // //                     </Typography>
// // //                   )}
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   {uploadProgress[`${courseIndex}_${doc.type}`] !== undefined ? (
// // //                     uploadProgress[`${courseIndex}_${doc.type}`] === -1 ? (
// // //                       <Typography variant="body2" color="error">
// // //                         Upload Failed
// // //                       </Typography>
// // //                     ) : uploadProgress[`${courseIndex}_${doc.type}`] < 100 ? (
// // //                       <div>
// // //                         <Typography variant="body2">
// // //                           Uploading: {uploadProgress[`${courseIndex}_${doc.type}`]}%
// // //                         </Typography>
// // //                         <LinearProgress
// // //                           variant="determinate"
// // //                           value={uploadProgress[`${courseIndex}_${doc.type}`]}
// // //                         />
// // //                       </div>
// // //                     ) : (
// // //                       <Typography variant="body2" className="text-green-600">
// // //                         Upload Complete
// // //                       </Typography>
// // //                     )
// // //                   ) : financeDetails[doc.type] ? (
// // //                     <Typography variant="body2" className="text-green-600">
// // //                       Uploaded: {financeDetails[`${doc.type}Name`]}
// // //                     </Typography>
// // //                   ) : (
// // //                     <Typography variant="body2" className="text-gray-600">
// // //                       Not Uploaded
// // //                     </Typography>
// // //                   )}
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   <Button
// // //                     variant="text"
// // //                     color="primary"
// // //                     onClick={() =>
// // //                       viewDocument(financeDetails[doc.type], doc.label)
// // //                     }
// // //                     disabled={!financeDetails[doc.type] || typeof financeDetails[doc.type] !== 'string'}
// // //                   >
// // //                     View
// // //                   </Button>
// // //                 </TableCell>
// // //               </TableRow>
// // //             ))}
// // //           </TableBody>
// // //         </Table>
// // //       </TableContainer>
// // //     </div>
// // //   );
// // // };

// // // export default FinanceForm;



// // import React, { useState } from "react";
// // import {
// //   Typography,
// //   TextField,
// //   Select,
// //   MenuItem,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   FormControl,
// //   InputLabel,
// //   Button,
// //   LinearProgress,
// // } from "@mui/material";
// // import { GetObjectCommand } from "@aws-sdk/client-s3";
// // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// // import { useAuth } from "../../../../context/AuthContext";
// // import { logActivity } from "./utils";
// // import { s3Client } from "../../../../config/aws-config"; // Import shared s3Client

// // const FinanceForm = ({
// //   courseIndex,
// //   fullFeesDetails,
// //   financeDetails,
// //   handleFinanceChange,
// //   handleFileChange,
// //   financePartners,
// //   canUpdate,
// //   user,
// //   studentId,
// //   uploadProgress,
// // }) => {
// //   const { user: authUser } = useAuth();
// //   const [error, setError] = useState("");
// //   const [attachmentError, setAttachmentError] = useState({});

// //   // Debug environment variables
// //   console.log("Environment Variables:", {
// //     VITE_S3_BUCKET_NAME: import.meta.env.VITE_S3_BUCKET_NAME,
// //     VITE_AWS_REGION: import.meta.env.VITE_AWS_REGION,
// //     VITE_AWS_ACCESS_KEY_ID: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// //     VITE_AWS_SECRET_ACCESS_KEY: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// //   });

// //   const handleFileChangeWithS3 = (courseIndex, docType, event) => {
// //     const file = event.target.files[0];
// //     if (!file) {
// //       console.warn(`No file selected for ${docType}`);
// //       return;
// //     }

// //     // Clear previous errors
// //     setAttachmentError((prev) => ({ ...prev, [docType]: "" }));

// //     // Call handleFileChange from AddCourse.jsx
// //     console.log(`Selected file for ${docType}:`, file.name);
// //     handleFileChange(courseIndex, docType, event);
// //   };

// //   const viewDocument = async (s3Url, docType) => {
// //     try {
// //       // Log input parameters
// //       console.log(`viewDocument called for ${docType}:`, { s3Url, type: typeof s3Url });

// //       // Validate s3Url
// //       if (!s3Url || typeof s3Url !== "string") {
// //         const errorMsg = `No valid ${docType} URL provided`;
// //         console.error(errorMsg, { s3Url });
// //         setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// //         logActivity(
// //           "VIEW_DOCUMENT_ERROR",
// //           { studentId, courseIndex, docType, error: errorMsg },
// //           user
// //         );
// //         return;
// //       }

// //       // Validate S3 configuration
// //       const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// //       const region = import.meta.env.VITE_AWS_REGION;
// //       console.log("S3 Configuration:", {
// //         bucketName,
// //         region,
// //         hasCredentials: !!s3Client.config.credentials,
// //       });

// //       if (!bucketName || !region) {
// //         const errorMsg = "Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION";
// //         console.error(errorMsg);
// //         setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// //         logActivity(
// //           "VIEW_DOCUMENT_ERROR",
// //           { studentId, courseIndex, docType, error: errorMsg },
// //           user
// //         );
// //         return;
// //       }

// //       if (!s3Client.config.credentials) {
// //         const errorMsg = "S3 client credentials not configured";
// //         console.error(errorMsg);
// //         setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// //         logActivity(
// //           "VIEW_DOCUMENT_ERROR",
// //           { studentId, courseIndex, docType, error: errorMsg },
// //           user
// //         );
// //         return;
// //       }

// //       // Extract S3 key
// //       const expectedPrefix = `https://${bucketName}.s3.${region}.amazonaws.com/`;
// //       if (!s3Url.startsWith(expectedPrefix)) {
// //         const errorMsg = `Invalid ${docType} URL: Does not match expected S3 format`;
// //         console.error(errorMsg, { s3Url, expectedPrefix });
// //         setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// //         logActivity(
// //           "VIEW_DOCUMENT_ERROR",
// //           { studentId, courseIndex, docType, error: errorMsg },
// //           user
// //         );
// //         return;
// //       }

// //       const key = s3Url.replace(expectedPrefix, "");
// //       if (!key) {
// //         const errorMsg = `Invalid ${docType} URL: Could not extract S3 key`;
// //         console.error(errorMsg, { s3Url });
// //         setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// //         logActivity(
// //           "VIEW_DOCUMENT_ERROR",
// //           { studentId, courseIndex, docType, error: errorMsg },
// //           user
// //         );
// //         return;
// //       }

// //       // Generate pre-signed URL
// //       console.log(`Generating pre-signed URL for ${docType}:`, { bucket: bucketName, key });
// //       const command = new GetObjectCommand({
// //         Bucket: bucketName,
// //         Key: key,
// //       });
// //       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// //       console.log(`Pre-signed URL generated for ${docType}:`, url);

// //       // Open the URL
// //       window.open(url, "_blank");
// //       logActivity(
// //         "VIEW_DOCUMENT_SUCCESS",
// //         { studentId, courseIndex, docType, url },
// //         user
// //       );
// //     } catch (err) {
// //       console.error(`Error generating pre-signed URL for ${docType}:`, {
// //         error: err.message,
// //         code: err.code,
// //         stack: err.stack,
// //         requestId: err.$metadata?.requestId,
// //       });
// //       const errorMsg = `Failed to view ${docType}: ${err.message}`;
// //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// //       logActivity(
// //         "VIEW_DOCUMENT_ERROR",
// //         { studentId, courseIndex, docType, error: err.message },
// //         user
// //       );
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {error && (
// //         <Typography color="error" variant="body2">
// //           {error}
// //         </Typography>
// //       )}
// //       <div className="flex items-center space-x-4">
// //         <Typography variant="subtitle1" className="text-gray-700">
// //           Total Fees: {fullFeesDetails?.totalFees || 0}
// //         </Typography>
// //         <Select
// //           value={financeDetails.discountType || ""}
// //           onChange={(e) =>
// //             handleFinanceChange(courseIndex, "discountType", "", e.target.value)
// //           }
// //           displayEmpty
// //           className="w-32 bg-gray-100 rounded-lg"
// //           disabled={!canUpdate}
// //         >
// //           <MenuItem value="" disabled>
// //             Type
// //           </MenuItem>
// //           <MenuItem value="percentage">%</MenuItem>
// //           <MenuItem value="value">₹</MenuItem>
// //         </Select>
// //         <TextField
// //           label="Discount"
// //           value={financeDetails.discountValue || ""}
// //           onChange={(e) =>
// //             handleFinanceChange(courseIndex, "discountValue", "", e.target.value)
// //           }
// //           className="w-32"
// //           variant="outlined"
// //           size="small"
// //           disabled={!canUpdate}
// //         />
// //         <TextField
// //           label="Discount Reason/Coupon"
// //           value={financeDetails.discountReason || ""}
// //           onChange={(e) =>
// //             handleFinanceChange(courseIndex, "discountReason", "", e.target.value)
// //           }
// //           className="w-48"
// //           variant="outlined"
// //           size="small"
// //           disabled={!canUpdate}
// //         />
// //         <Typography className="text-gray-700">
// //           Fee After Discount: {financeDetails.feeAfterDiscount}
// //         </Typography>
// //       </div>
// //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// //         Registration
// //       </Typography>
// //       <TableContainer>
// //         <Table>
// //           <TableHead>
// //             <TableRow className="bg-blue-50">
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 Amount
// //               </TableCell>
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 Date
// //               </TableCell>
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 Payment Method
// //               </TableCell>
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 Received By
// //               </TableCell>
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 Remark
// //               </TableCell>
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 Status
// //               </TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             <TableRow>
// //               <TableCell>
// //                 <TextField
// //                   value={financeDetails.registration.amount || ""}
// //                   onChange={(e) =>
// //                     handleFinanceChange(
// //                       courseIndex,
// //                       "registration",
// //                       "amount",
// //                       e.target.value
// //                     )
// //                   }
// //                   size="small"
// //                   disabled={!canUpdate}
// //                 />
// //               </TableCell>
// //               <TableCell>
// //                 <TextField
// //                   type="date"
// //                   value={financeDetails.registration.date || ""}
// //                   onChange={(e) =>
// //                     handleFinanceChange(
// //                       courseIndex,
// //                       "registration",
// //                       "date",
// //                       e.target.value
// //                     )
// //                   }
// //                   size="small"
// //                   disabled={!canUpdate}
// //                 />
// //               </TableCell>
// //               <TableCell>
// //                 <Select
// //                   value={financeDetails.registration.paymentMethod || ""}
// //                   onChange={(e) =>
// //                     handleFinanceChange(
// //                       courseIndex,
// //                       "registration",
// //                       "paymentMethod",
// //                       e.target.value
// //                     )
// //                   }
// //                   size="small"
// //                   displayEmpty
// //                   fullWidth
// //                   disabled={!canUpdate}
// //                 >
// //                   <MenuItem value="" disabled>
// //                     Select Payment Method
// //                   </MenuItem>
// //                   <MenuItem value="Cash">Cash</MenuItem>
// //                   <MenuItem value="Card">Card</MenuItem>
// //                   <MenuItem value="UPI">UPI</MenuItem>
// //                   <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
// //                   <MenuItem value="Cheque">Cheque</MenuItem>
// //                 </Select>
// //               </TableCell>
// //               <TableCell>
// //                 <TextField
// //                   value={financeDetails.registration.receivedBy || ""}
// //                   onChange={(e) =>
// //                     handleFinanceChange(
// //                       courseIndex,
// //                       "registration",
// //                       "receivedBy",
// //                       e.target.value
// //                     )
// //                   }
// //                   size="small"
// //                   disabled={!canUpdate}
// //                 />
// //               </TableCell>
// //               <TableCell>
// //                 <TextField
// //                   value={financeDetails.registration.remark || ""}
// //                   onChange={(e) =>
// //                     handleFinanceChange(
// //                       courseIndex,
// //                       "registration",
// //                       "remark",
// //                       e.target.value
// //                     )
// //                   }
// //                   size="small"
// //                   disabled={!canUpdate}
// //                 />
// //               </TableCell>
// //               <TableCell>
// //                 <Select
// //                   value={financeDetails.registration.status || "Pending"}
// //                   onChange={(e) =>
// //                     handleFinanceChange(
// //                       courseIndex,
// //                       "registration",
// //                       "status",
// //                       e.target.value
// //                     )
// //                   }
// //                   size="small"
// //                   fullWidth
// //                   disabled={!canUpdate}
// //                 >
// //                   <MenuItem value="Pending">Pending</MenuItem>
// //                   <MenuItem value="Paid">Paid</MenuItem>
// //                 </Select>
// //               </TableCell>
// //             </TableRow>
// //           </TableBody>
// //         </Table>
// //       </TableContainer>
// //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// //         Finance Details
// //       </Typography>
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         <FormControl fullWidth>
// //           <InputLabel>Finance Partner</InputLabel>
// //           <Select
// //             value={financeDetails.financePartner || ""}
// //             onChange={(e) =>
// //               handleFinanceChange(
// //                 courseIndex,
// //                 "financePartner",
// //                 "",
// //                 e.target.value
// //               )
// //             }
// //             label="Finance Partner"
// //             className="bg-gray-100 rounded-lg"
// //             disabled={!canUpdate}
// //           >
// //             <MenuItem value="" disabled>
// //               Select Finance Partner
// //             </MenuItem>
// //             {financePartners.map((partner) => (
// //               <MenuItem key={partner.id} value={partner.name}>
// //                 {partner.name}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>
// //         <FormControl fullWidth>
// //           <InputLabel>Contact Person</InputLabel>
// //           <Select
// //             value={financeDetails.contactPerson || ""}
// //             onChange={(e) =>
// //               handleFinanceChange(
// //                 courseIndex,
// //                 "contactPerson",
// //                 "",
// //                 e.target.value
// //               )
// //             }
// //             label="Contact Person"
// //             className="bg-gray-100 rounded-lg"
// //             disabled={!financeDetails.financePartner || !canUpdate}
// //           >
// //             <MenuItem value="" disabled>
// //               Select Contact Person
// //             </MenuItem>
// //             {financeDetails.financePartner &&
// //               financePartners
// //                 .find((p) => p.name === financeDetails.financePartner)
// //                 ?.contactPersons?.map((person, idx) => (
// //                   <MenuItem key={idx} value={person.name}>
// //                     {person.name}
// //                   </MenuItem>
// //                 ))}
// //           </Select>
// //         </FormControl>
// //         <FormControl fullWidth>
// //           <InputLabel>Finance Scheme</InputLabel>
// //           <Select
// //             value={financeDetails.scheme || ""}
// //             onChange={(e) =>
// //               handleFinanceChange(courseIndex, "scheme", "", e.target.value)
// //             }
// //             label="Finance Scheme"
// //             className="bg-gray-100 rounded-lg"
// //             disabled={!financeDetails.financePartner || !canUpdate}
// //           >
// //             <MenuItem value="">Select Finance Scheme</MenuItem>
// //             {financeDetails.financePartner &&
// //               financePartners
// //                 .find((p) => p.name === financeDetails.financePartner)
// //                 ?.scheme?.map((schemeItem, idx) => (
// //                   <MenuItem key={idx} value={schemeItem.plan}>
// //                     {schemeItem.plan}
// //                     {schemeItem.description && ` - ${schemeItem.description}`}
// //                   </MenuItem>
// //                 ))}
// //           </Select>
// //         </FormControl>
// //         <TextField
// //           label="Loan Amount"
// //           type="number"
// //           value={financeDetails.loanAmount || 0}
// //           onChange={(e) =>
// //             handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)
// //           }
// //           variant="outlined"
// //           size="small"
// //           fullWidth
// //           disabled={!canUpdate}
// //         />
// //         <TextField
// //           label="Down Payment"
// //           type="number"
// //           value={financeDetails.downPayment || 0}
// //           onChange={(e) =>
// //             handleFinanceChange(courseIndex, "downPayment", "", e.target.value)
// //           }
// //           variant="outlined"
// //           size="small"
// //           fullWidth
// //           disabled={!canUpdate}
// //         />
// //         <TextField
// //           label="Down Payment Date"
// //           type="date"
// //           value={financeDetails.downPaymentDate || ""}
// //           onChange={(e) =>
// //             handleFinanceChange(
// //               courseIndex,
// //               "downPaymentDate",
// //               "",
// //               e.target.value
// //             )
// //           }
// //           variant="outlined"
// //           size="small"
// //           fullWidth
// //           InputLabelProps={{ shrink: true }}
// //           disabled={!canUpdate}
// //         />
// //         <TextField
// //           label="Applicant Name"
// //           value={financeDetails.applicantName || ""}
// //           onChange={(e) =>
// //             handleFinanceChange(
// //               courseIndex,
// //               "applicantName",
// //               "",
// //               e.target.value
// //             )
// //           }
// //           variant="outlined"
// //           size="small"
// //           fullWidth
// //           disabled={!canUpdate}
// //         />
// //         <TextField
// //           label="Relationship"
// //           value={financeDetails.relationship || ""}
// //           onChange={(e) =>
// //             handleFinanceChange(
// //               courseIndex,
// //               "relationship",
// //               "",
// //               e.target.value
// //             )
// //           }
// //           variant="outlined"
// //           size="small"
// //           fullWidth
// //           disabled={!canUpdate}
// //         />
// //         <FormControl fullWidth>
// //           <InputLabel>Loan Status</InputLabel>
// //           <Select
// //             value={financeDetails.loanStatus || "Pending"}
// //             onChange={(e) =>
// //               handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)
// //             }
// //             label="Loan Status"
// //             className="bg-gray-100 rounded-lg"
// //             disabled={!canUpdate}
// //           >
// //             <MenuItem value="Pending">Pending</MenuItem>
// //             <MenuItem value="Approved">Approved</MenuItem>
// //             <MenuItem value="Rejected">Rejected</MenuItem>
// //             <MenuItem value="Disbursed">Disbursed</MenuItem>
// //             <MenuItem value="Completed">Completed</MenuItem>
// //           </Select>
// //         </FormControl>
// //       </div>
// //       <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
// //         Documents
// //       </Typography>
// //       <TableContainer>
// //         <Table>
// //           <TableHead>
// //             <TableRow className="bg-blue-50">
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 Document Type
// //               </TableCell>
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 File
// //               </TableCell>
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 Status
// //               </TableCell>
// //               <TableCell className="text-gray-800 font-medium min-w-40">
// //                 Action
// //               </TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {[
// //               { type: "photo", label: "Applicant Photo" },
// //               { type: "bankStatement", label: "6 Months Bank Statement" },
// //               { type: "paymentSlip", label: "Payment Slip" },
// //               { type: "aadharCard", label: "Aadhar Card" },
// //               { type: "panCard", label: "PAN Card" },
// //             ].map((doc) => {
// //               console.log(`Document ${doc.type} status:`, {
// //                 url: financeDetails[doc.type],
// //                 type: typeof financeDetails[doc.type],
// //                 name: financeDetails[`${doc.type}Name`],
// //               });
// //               return (
// //                 <TableRow key={doc.type}>
// //                   <TableCell>{doc.label}</TableCell>
// //                   <TableCell>
// //                     <input
// //                       type="file"
// //                       accept="application/pdf,image/jpeg,image/png"
// //                       onChange={(e) => handleFileChangeWithS3(courseIndex, doc.type, e)}
// //                       className="mt-1"
// //                       disabled={!canUpdate}
// //                     />
// //                     {attachmentError[doc.type] && (
// //                       <Typography color="error" variant="body2" className="mt-1">
// //                         {attachmentError[doc.type]}
// //                       </Typography>
// //                     )}
// //                     {error && error.includes(doc.label) && (
// //                       <Typography color="error" variant="body2" className="mt-1">
// //                         {error}
// //                       </Typography>
// //                     )}
// //                   </TableCell>
// //                   <TableCell>
// //                     {uploadProgress[`${courseIndex}_${doc.type}`] !== undefined ? (
// //                       uploadProgress[`${courseIndex}_${doc.type}`] === -1 ? (
// //                         <Typography variant="body2" color="error">
// //                           Upload Failed
// //                         </Typography>
// //                       ) : uploadProgress[`${courseIndex}_${doc.type}`] < 100 ? (
// //                         <div>
// //                           <Typography variant="body2">
// //                             Uploading: {uploadProgress[`${courseIndex}_${doc.type}`]}%
// //                           </Typography>
// //                           <LinearProgress
// //                             variant="determinate"
// //                             value={uploadProgress[`${courseIndex}_${doc.type}`]}
// //                           />
// //                         </div>
// //                       ) : (
// //                         <Typography variant="body2" className="text-green-600">
// //                           Upload Complete
// //                         </Typography>
// //                       )
// //                     ) : financeDetails[doc.type] ? (
// //                       <Typography variant="body2" className="text-green-600">
// //                         Uploaded: {financeDetails[`${doc.type}Name`]}
// //                       </Typography>
// //                     ) : (
// //                       <Typography variant="body2" className="text-gray-600">
// //                         Not Uploaded
// //                       </Typography>
// //                     )}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Button
// //                       variant="text"
// //                       color="primary"
// //                       onClick={() => viewDocument(financeDetails[doc.type], doc.label)}
// //                       disabled={!financeDetails[doc.type] || typeof financeDetails[doc.type] !== "string"}
// //                     >
// //                       View
// //                     </Button>
// //                   </TableCell>
// //                 </TableRow>
// //               );
// //             })}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>
// //     </div>
// //   );
// // };

// // export default FinanceForm;


// import React, { useState } from "react";
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
//   LinearProgress,
// } from "@mui/material";
// import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { useAuth } from "../../../../context/AuthContext";
// import { logActivity } from "./utils";
// import { s3Client } from "../../../../config/aws-config";

// const FinanceForm = ({
//   courseIndex,
//   fullFeesDetails,
//   financeDetails,
//   handleFinanceChange,
//   handleFileChange,
//   financePartners,
//   canUpdate,
//   user,
//   studentId,
//   uploadProgress,
// }) => {
//   const { user: authUser } = useAuth();
//   const [error, setError] = useState("");
//   const [attachmentError, setAttachmentError] = useState({});

//   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
//   const region = import.meta.env.VITE_AWS_REGION;

//   // Debug environment variables
//   console.log("Environment Variables:", {
//     VITE_S3_BUCKET_NAME: bucketName,
//     VITE_AWS_REGION: region,
//     VITE_AWS_ACCESS_KEY_ID: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//     VITE_AWS_SECRET_ACCESS_KEY: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//   });

//   const handleFileChangeWithS3 = async (courseIndex, docType, event) => {
//     const file = event.target.files[0];
//     if (!file) {
//       console.warn(`No file selected for ${docType}`);
//       setAttachmentError((prev) => ({ ...prev, [docType]: "No file selected" }));
//       return;
//     }

//     // Validate file type
//     const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//     if (!allowedTypes.includes(file.type)) {
//       setAttachmentError((prev) => ({
//         ...prev,
//         [docType]: "Invalid file type. Only PDF, JPEG, or PNG allowed.",
//       }));
//       return;
//     }

//     // Clear previous errors
//     setAttachmentError((prev) => ({ ...prev, [docType]: "" }));

//     try {
//       // Validate S3 configuration
//       if (!bucketName || !region) {
//         throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
//       }
//       if (!s3Client.config.credentials) {
//         throw new Error("S3 client credentials not configured");
//       }

//       // Generate unique file key
//       const timestamp = Date.now();
//       const fileKey = `students/${studentId}/${courseIndex}/${docType}-${timestamp}-${file.name}`;
//       const fileBuffer = await file.arrayBuffer();

//       // Upload to S3
//       console.log(`Uploading file for ${docType}:`, { fileKey, fileName: file.name });
//       const params = {
//         Bucket: bucketName,
//         Key: fileKey,
//         Body: new Uint8Array(fileBuffer),
//         ContentType: file.type,
//       };

//       // Track upload progress
//       let progress = 0;
//       handleFinanceChange(courseIndex, "uploadProgress", `${courseIndex}_${docType}`, 0);

//       const command = new PutObjectCommand(params);
//       await s3Client.send(command, {
//         onUploadProgress: (progressEvent) => {
//           if (progressEvent.total) {
//             progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//             handleFinanceChange(courseIndex, "uploadProgress", `${courseIndex}_${docType}`, progress);
//           }
//         },
//       });

//       const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
//       console.log(`File uploaded successfully for ${docType}:`, s3Url);

//       // Update financeDetails with S3 URL and file name
//       handleFinanceChange(courseIndex, docType, "", s3Url);
//       handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);
//       logActivity(
//         "UPLOAD_DOCUMENT_SUCCESS",
//         { studentId, courseIndex, docType, s3Url, fileName: file.name },
//         user
//       );
//     } catch (err) {
//       console.error(`Error uploading file for ${docType}:`, {
//         error: err.message,
//         code: err.code,
//         stack: err.stack,
//       });
//       const errorMsg = `Failed to upload ${docType}: ${err.message}`;
//       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
//       handleFinanceChange(courseIndex, "uploadProgress", `${courseIndex}_${docType}`, -1);
//       logActivity(
//         "UPLOAD_DOCUMENT_ERROR",
//         { studentId, courseIndex, docType, error: err.message },
//         user
//       );
//     }
//   };

//   const viewDocument = async (s3Url, docType) => {
//     try {
//       console.log(`viewDocument called for ${docType}:`, { s3Url });

//       // Validate s3Url
//       if (!s3Url || typeof s3Url !== "string") {
//         throw new Error(`No valid ${docType} URL provided`);
//       }

//       // Validate S3 configuration
//       if (!bucketName || !region) {
//         throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
//       }
//       if (!s3Client.config.credentials) {
//         throw new Error("S3 client credentials not configured");
//       }

//       // Extract S3 key (handle various URL formats)
//       let key;
//       const urlPatterns = [
//         new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
//         new RegExp(`https://${bucketName}\\.s3\\-accelerated\\.${region}\\.amazonaws\\.com/(.+)`),
//         new RegExp(`https://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
//       ];

//       for (const pattern of urlPatterns) {
//         const match = s3Url.match(pattern);
//         if (match && match[1]) {
//           key = decodeURIComponent(match[1]);
//           break;
//         }
//       }

//       if (!key) {
//         throw new Error(`Invalid ${docType} URL: Could not extract S3 key`);
//       }

//       // Generate pre-signed URL
//       console.log(`Generating pre-signed URL for ${docType}:`, { bucket: bucketName, key });
//       const command = new GetObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//       });
//       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//       console.log(`Pre-signed URL generated for ${docType}:`, url);

//       // Open the URL
//       window.open(url, "_blank");
//       logActivity(
//         "VIEW_DOCUMENT_SUCCESS",
//         { studentId, courseIndex, docType, url },
//         user
//       );
//     } catch (err) {
//       console.error(`Error generating pre-signed URL for ${docType}:`, {
//         error: err.message,
//         code: err.code,
//         stack: err.stack,
//         requestId: err.$metadata?.requestId,
//       });
//       let errorMsg = `Failed to view ${docType}: ${err.message}`;
//       if (err.name === "AccessDenied") {
//         errorMsg = `Failed to view ${docType}: Access denied. Check S3 bucket permissions.`;
//       } else if (err.message.includes("Failed to fetch")) {
//         errorMsg = `Failed to view ${docType}: Network or CORS issue. Check S3 CORS settings.`;
//       }
//       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
//       logActivity(
//         "VIEW_DOCUMENT_ERROR",
//         { studentId, courseIndex, docType, error: err.message },
//         user
//       );
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {error && (
//         <Typography color="error" variant="body2">
//           {error}
//         </Typography>
//       )}
//       <div className="flex items-center space-x-4">
//         <Typography variant="subtitle1" className="text-gray-700">
//           Total Fees: {fullFeesDetails?.totalFees || 0}
//         </Typography>
//         <Select
//           value={financeDetails.discountType || ""}
//           onChange={(e) =>
//             handleFinanceChange(courseIndex, "discountType", "", e.target.value)
//           }
//           displayEmpty
//           className="w-32 bg-gray-100 rounded-lg"
//           disabled={!canUpdate}
//         >
//           <MenuItem value="" disabled>
//             Type
//           </MenuItem>
//           <MenuItem value="percentage">%</MenuItem>
//           <MenuItem value="value">₹</MenuItem>
//         </Select>
//         <TextField
//           label="Discount"
//           value={financeDetails.discountValue || ""}
//           onChange={(e) =>
//             handleFinanceChange(courseIndex, "discountValue", "", e.target.value)
//           }
//           className="w-32"
//           variant="outlined"
//           size="small"
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Discount Reason/Coupon"
//           value={financeDetails.discountReason || ""}
//           onChange={(e) =>
//             handleFinanceChange(courseIndex, "discountReason", "", e.target.value)
//           }
//           className="w-48"
//           variant="outlined"
//           size="small"
//           disabled={!canUpdate}
//         />
//         <Typography className="text-gray-700">
//           Fee After Discount: {financeDetails.feeAfterDiscount}
//         </Typography>
//       </div>
//       <Typography variant="subtitle1" className="text-gray-800 font-medium">
//         Registration
//       </Typography>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow className="bg-blue-50">
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 Amount
//               </TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 Date
//               </TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 Payment Method
//               </TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 Received By
//               </TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 Remark
//               </TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 Status
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow>
//               <TableCell>
//                 <TextField
//                   value={financeDetails.registration.amount || ""}
//                   onChange={(e) =>
//                     handleFinanceChange(
//                       courseIndex,
//                       "registration",
//                       "amount",
//                       e.target.value
//                     )
//                   }
//                   size="small"
//                   disabled={!canUpdate}
//                 />
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   type="date"
//                   value={financeDetails.registration.date || ""}
//                   onChange={(e) =>
//                     handleFinanceChange(
//                       courseIndex,
//                       "registration",
//                       "date",
//                       e.target.value
//                     )
//                   }
//                   size="small"
//                   disabled={!canUpdate}
//                 />
//               </TableCell>
//               <TableCell>
//                 <Select
//                   value={financeDetails.registration.paymentMethod || ""}
//                   onChange={(e) =>
//                     handleFinanceChange(
//                       courseIndex,
//                       "registration",
//                       "paymentMethod",
//                       e.target.value
//                     )
//                   }
//                   size="small"
//                   displayEmpty
//                   fullWidth
//                   disabled={!canUpdate}
//                 >
//                   <MenuItem value="" disabled>
//                     Select Payment Method
//                   </MenuItem>
//                   <MenuItem value="Cash">Cash</MenuItem>
//                   <MenuItem value="Card">Card</MenuItem>
//                   <MenuItem value="UPI">UPI</MenuItem>
//                   <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
//                   <MenuItem value="Cheque">Cheque</MenuItem>
//                 </Select>
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   value={financeDetails.registration.receivedBy || ""}
//                   onChange={(e) =>
//                     handleFinanceChange(
//                       courseIndex,
//                       "registration",
//                       "receivedBy",
//                       e.target.value
//                     )
//                   }
//                   size="small"
//                   disabled={!canUpdate}
//                 />
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   value={financeDetails.registration.remark || ""}
//                   onChange={(e) =>
//                     handleFinanceChange(
//                       courseIndex,
//                       "registration",
//                       "remark",
//                       e.target.value
//                     )
//                   }
//                   size="small"
//                   disabled={!canUpdate}
//                 />
//               </TableCell>
//               <TableCell>
//                 <Select
//                   value={financeDetails.registration.status || "Pending"}
//                   onChange={(e) =>
//                     handleFinanceChange(
//                       courseIndex,
//                       "registration",
//                       "status",
//                       e.target.value
//                     )
//                   }
//                   size="small"
//                   fullWidth
//                   disabled={!canUpdate}
//                 >
//                   <MenuItem value="Pending">Pending</MenuItem>
//                   <MenuItem value="Paid">Paid</MenuItem>
//                 </Select>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Typography variant="subtitle1" className="text-gray-800 font-medium">
//         Finance Details
//       </Typography>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <FormControl fullWidth>
//           <InputLabel>Finance Partner</InputLabel>
//           <Select
//             value={financeDetails.financePartner || ""}
//             onChange={(e) =>
//               handleFinanceChange(
//                 courseIndex,
//                 "financePartner",
//                 "",
//                 e.target.value
//               )
//             }
//             label="Finance Partner"
//             className="bg-gray-100 rounded-lg"
//             disabled={!canUpdate}
//           >
//             <MenuItem value="" disabled>
//               Select Finance Partner
//             </MenuItem>
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
//             onChange={(e) =>
//               handleFinanceChange(
//                 courseIndex,
//                 "contactPerson",
//                 "",
//                 e.target.value
//               )
//             }
//             label="Contact Person"
//             className="bg-gray-100 rounded-lg"
//             disabled={!financeDetails.financePartner || !canUpdate}
//           >
//             <MenuItem value="" disabled>
//               Select Contact Person
//             </MenuItem>
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
//             value={financeDetails.scheme || ""}
//             onChange={(e) =>
//               handleFinanceChange(courseIndex, "scheme", "", e.target.value)
//             }
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
//           value={financeDetails.loanAmount || 0}
//           onChange={(e) =>
//             handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)
//           }
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Down Payment"
//           type="number"
//           value={financeDetails.downPayment || 0}
//           onChange={(e) =>
//             handleFinanceChange(courseIndex, "downPayment", "", e.target.value)
//           }
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Down Payment Date"
//           type="date"
//           value={financeDetails.downPaymentDate || ""}
//           onChange={(e) =>
//             handleFinanceChange(
//               courseIndex,
//               "downPaymentDate",
//               "",
//               e.target.value
//             )
//           }
//           variant="outlined"
//           size="small"
//           fullWidth
//           InputLabelProps={{ shrink: true }}
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Applicant Name"
//           value={financeDetails.applicantName || ""}
//           onChange={(e) =>
//             handleFinanceChange(
//               courseIndex,
//               "applicantName",
//               "",
//               e.target.value
//             )
//           }
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <TextField
//           label="Relationship"
//           value={financeDetails.relationship || ""}
//           onChange={(e) =>
//             handleFinanceChange(
//               courseIndex,
//               "relationship",
//               "",
//               e.target.value
//             )
//           }
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
//         <FormControl fullWidth>
//           <InputLabel>Loan Status</InputLabel>
//           <Select
//             value={financeDetails.loanStatus || "Pending"}
//             onChange={(e) =>
//               handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)
//             }
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
//       <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
//         Documents
//       </Typography>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow className="bg-blue-50">
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 Document Type
//               </TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-展会">
//                 File
//               </TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 Status
//               </TableCell>
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 Action
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {[
//               { type: "photo", label: "Applicant Photo" },
//               { type: "bankStatement", label: "6 Months Bank Statement" },
//               { type: "paymentSlip", label: "Payment Slip" },
//               { type: "aadharCard", label: "Aadhar Card" },
//               { type: "panCard", label: "PAN Card" },
//             ].map((doc) => {
//               console.log(`Document ${doc.type} status:`, {
//                 url: financeDetails[doc.type],
//                 type: typeof financeDetails[doc.type],
//                 name: financeDetails[`${doc.type}Name`],
//               });
//               return (
//                 <TableRow key={doc.type}>
//                   <TableCell>{doc.label}</TableCell>
//                   <TableCell>
//                     <input
//                       type="file"
//                       accept="application/pdf,image/jpeg,image/png"
//                       onChange={(e) => handleFileChangeWithS3(courseIndex, doc.type, e)}
//                       className="mt-1"
//                       disabled={!canUpdate}
//                     />
//                     {attachmentError[doc.type] && (
//                       <Typography color="error" variant="body2" className="mt-1">
//                         {attachmentError[doc.type]}
//                       </Typography>
//                     )}
//                     {error && error.includes(doc.label) && (
//                       <Typography color="error" variant="body2" className="mt-1">
//                         {error}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {uploadProgress[`${courseIndex}_${doc.type}`] !== undefined ? (
//                       uploadProgress[`${courseIndex}_${doc.type}`] === -1 ? (
//                         <Typography variant="body2" color="error">
//                           Upload Failed
//                         </Typography>
//                       ) : uploadProgress[`${courseIndex}_${doc.type}`] < 100 ? (
//                         <div>
//                           <Typography variant="body2">
//                             Uploading: {uploadProgress[`${courseIndex}_${doc.type}`]}%
//                           </Typography>
//                           <LinearProgress
//                             variant="determinate"
//                             value={uploadProgress[`${courseIndex}_${doc.type}`]}
//                           />
//                         </div>
//                       ) : (
//                         <Typography variant="body2" className="text-green-600">
//                           Upload Complete
//                         </Typography>
//                       )
//                     ) : financeDetails[doc.type] ? (
//                       <Typography variant="body2" className="text-green-600">
//                         Uploaded: {financeDetails[`${doc.type}Name`]}
//                       </Typography>
//                     ) : (
//                       <Typography variant="body2" className="text-gray-600">
//                         Not Uploaded
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="text"
//                       color="primary"
//                       onClick={() => viewDocument(financeDetails[doc.type], doc.label)}
//                       disabled={!financeDetails[doc.type] || typeof financeDetails[doc.type] !== "string"}
//                     >
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default FinanceForm;


import React, { useState } from "react";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Button,
  LinearProgress,
} from "@mui/material";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { useAuth } from "../../../../context/AuthContext";
import { logActivity } from "./utils";
import { s3Client } from "../../../../config/aws-config";

const FinanceForm = ({
  courseIndex,
  fullFeesDetails,
  financeDetails,
  handleFinanceChange,
  handleFileChange,
  financePartners,
  canUpdate,
  user,
  studentId,
  uploadProgress,
}) => {
  const { user: authUser } = useAuth();
  const [attachmentError, setAttachmentError] = useState({});

  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
  const region = import.meta.env.VITE_AWS_REGION;

  // Debug environment variables
  console.log("Environment Variables:", {
    VITE_S3_BUCKET_NAME: bucketName,
    VITE_AWS_REGION: region,
    VITE_AWS_ACCESS_KEY_ID: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    VITE_AWS_SECRET_ACCESS_KEY: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  });

  const viewDocument = async (s3Url, docType) => {
    try {
      console.log(`viewDocument called for ${docType}:`, { s3Url, type: typeof s3Url });
  
      // Validate s3Url
      if (!s3Url || typeof s3Url !== "string") {
        throw new Error(`No valid ${docType} URL provided`);
      }
  
      // Validate S3 configuration
      if (!bucketName || !region) {
        throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
      }
      if (!s3Client.config.credentials) {
        throw new Error("S3 client credentials not configured");
      }
  
      // Extract S3 key
      let key;
      const urlPatterns = [
        new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
        new RegExp(`https://${bucketName}\\.s3\\-accelerated\\.${region}\\.amazonaws\\.com/(.+)`),
        new RegExp(`https://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
        new RegExp(`https://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`), // Fallback for region-less URLs
      ];
  
      for (const pattern of urlPatterns) {
        const match = s3Url.match(pattern);
        if (match && match[1]) {
          key = decodeURIComponent(match[1]);
          console.log(`Extracted S3 key for ${docType}:`, key);
          break;
        }
      }
  
      if (!key) {
        throw new Error(`Invalid ${docType} URL: Could not extract S3 key. URL: ${s3Url}`);
      }
  
      // Generate pre-signed URL
      console.log(`Generating pre-signed URL for ${docType}:`, { bucket: bucketName, key });
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log(`Pre-signed URL generated for ${docType}:`, url);
  
      // Open the URL
      window.open(url, "_blank");
      logActivity(
        "VIEW_DOCUMENT_SUCCESS",
        { studentId, courseIndex, docType, url },
        user
      );
    } catch (err) {
      console.error(`Error viewing ${docType}:`, {
        error: err.message,
        code: err.code,
        requestId: err.$metadata?.requestId,
        url: s3Url,
      });
      let errorMsg = `Failed to view ${docType}: ${err.message}`;
      if (err.name === "AccessDenied") {
        errorMsg = `Access denied. Check S3 bucket permissions and IAM role.`;
      } else if (err.name === "NoSuchKey") {
        errorMsg = `File not found in S3. It may have been deleted or the URL is incorrect.`;
      } else if (err.message.includes("Failed to fetch")) {
        errorMsg = `Network or CORS issue. Check S3 CORS settings.`;
      }
      setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
      logActivity(
        "VIEW_DOCUMENT_ERROR",
        { studentId, courseIndex, docType, error: err.message, url: s3Url },
        user
      );
    }
  };
  
  // const viewDocument = async (s3Url, docType) => {
  //   try {
  //     console.log(`viewDocument called for ${docType}:`, { s3Url });

  //     // Validate s3Url
  //     if (!s3Url || typeof s3Url !== "string") {
  //       throw new Error(`No valid ${docType} URL provided`);
  //     }

  //     // Validate S3 configuration
  //     if (!bucketName || !region) {
  //       throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
  //     }
  //     if (!s3Client.config.credentials) {
  //       throw new Error("S3 client credentials not configured");
  //     }

  //     // Extract S3 key
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
  //       throw new Error(`Invalid ${docType} URL: Could not extract S3 key`);
  //     }

  //     // Generate pre-signed URL
  //     console.log(`Generating pre-signed URL for ${docType}:`, { bucket: bucketName, key });
  //     const command = new GetObjectCommand({
  //       Bucket: bucketName,
  //       Key: key,
  //     });
  //     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  //     console.log(`Pre-signed URL generated for ${docType}:`, url);

  //     // Open the URL
  //     window.open(url, "_blank");
  //     logActivity(
  //       "VIEW_DOCUMENT_SUCCESS",
  //       { studentId, courseIndex, docType, url },
  //       user
  //     );
  //   } catch (err) {
  //     console.error(`Error viewing ${docType}:`, {
  //       error: err.message,
  //       code: err.code,
  //       requestId: err.$metadata?.requestId,
  //     });
  //     let errorMsg = `Failed to view ${docType}: ${err.message}`;
  //     if (err.name === "AccessDenied") {
  //       errorMsg = `Access denied. Check S3 bucket permissions.`;
  //     } else if (err.name === "NoSuchKey") {
  //       errorMsg = `File not found in S3. It may have been deleted or moved.`;
  //     } else if (err.message.includes("Failed to fetch")) {
  //       errorMsg = `Network or CORS issue. Check S3 CORS settings.`;
  //     }
  //     setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
  //     logActivity(
  //       "VIEW_DOCUMENT_ERROR",
  //       { studentId, courseIndex, docType, error: err.message },
  //       user
  //     );
  //   }
  // };

  return (
    <div className="space-y-4">
      {Object.keys(attachmentError).length > 0 && (
        <Typography color="error" variant="body2">
          {Object.values(attachmentError).filter((err) => err).join("; ")}
        </Typography>
      )}
      <div className="flex items-center space-x-4">
        <Typography variant="subtitle1" className="text-gray-700">
          Total Fees: {fullFeesDetails?.totalFees || 0}
        </Typography>
        <Select
          value={financeDetails.discountType || ""}
          onChange={(e) =>
            handleFinanceChange(courseIndex, "discountType", "", e.target.value)
          }
          displayEmpty
          className="w-32 bg-gray-100 rounded-lg"
          disabled={!canUpdate}
        >
          <MenuItem value="" disabled>
            Type
          </MenuItem>
          <MenuItem value="percentage">%</MenuItem>
          <MenuItem value="value">₹</MenuItem>
        </Select>
        <TextField
          label="Discount"
          value={financeDetails.discountValue || ""}
          onChange={(e) =>
            handleFinanceChange(courseIndex, "discountValue", "", e.target.value)
          }
          className="w-32"
          variant="outlined"
          size="small"
          disabled={!canUpdate}
        />
        <TextField
          label="Discount Reason/Coupon"
          value={financeDetails.discountReason || ""}
          onChange={(e) =>
            handleFinanceChange(courseIndex, "discountReason", "", e.target.value)
          }
          className="w-48"
          variant="outlined"
          size="small"
          disabled={!canUpdate}
        />
        <Typography className="text-gray-700">
          Fee After Discount: {financeDetails.feeAfterDiscount}
        </Typography>
      </div>
      <Typography variant="subtitle1" className="text-gray-800 font-medium">
        Registration
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-50">
              <TableCell className="text-gray-800 font-medium min-w-40">
                Amount
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Date
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Payment Method
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Received By
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Remark
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  value={financeDetails.registration.amount || ""}
                  onChange={(e) =>
                    handleFinanceChange(
                      courseIndex,
                      "registration",
                      "amount",
                      e.target.value
                    )
                  }
                  size="small"
                  disabled={!canUpdate}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="date"
                  value={financeDetails.registration.date || ""}
                  onChange={(e) =>
                    handleFinanceChange(
                      courseIndex,
                      "registration",
                      "date",
                      e.target.value
                    )
                  }
                  size="small"
                  disabled={!canUpdate}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={financeDetails.registration.paymentMethod || ""}
                  onChange={(e) =>
                    handleFinanceChange(
                      courseIndex,
                      "registration",
                      "paymentMethod",
                      e.target.value
                    )
                  }
                  size="small"
                  displayEmpty
                  fullWidth
                  disabled={!canUpdate}
                >
                  <MenuItem value="" disabled>
                    Select Payment Method
                  </MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  value={financeDetails.registration.receivedBy || ""}
                  onChange={(e) =>
                    handleFinanceChange(
                      courseIndex,
                      "registration",
                      "receivedBy",
                      e.target.value
                    )
                  }
                  size="small"
                  disabled={!canUpdate}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={financeDetails.registration.remark || ""}
                  onChange={(e) =>
                    handleFinanceChange(
                      courseIndex,
                      "registration",
                      "remark",
                      e.target.value
                    )
                  }
                  size="small"
                  disabled={!canUpdate}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={financeDetails.registration.status || "Pending"}
                  onChange={(e) =>
                    handleFinanceChange(
                      courseIndex,
                      "registration",
                      "status",
                      e.target.value
                    )
                  }
                  size="small"
                  fullWidth
                  disabled={!canUpdate}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="subtitle1" className="text-gray-800 font-medium">
        Finance Details
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormControl fullWidth>
          <InputLabel>Finance Partner</InputLabel>
          <Select
            value={financeDetails.financePartner || ""}
            onChange={(e) =>
              handleFinanceChange(
                courseIndex,
                "financePartner",
                "",
                e.target.value
              )
            }
            label="Finance Partner"
            className="bg-gray-100 rounded-lg"
            disabled={!canUpdate}
          >
            <MenuItem value="" disabled>
              Select Finance Partner
            </MenuItem>
            {financePartners.map((partner) => (
              <MenuItem key={partner.id} value={partner.name}>
                {partner.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Contact Person</InputLabel>
          <Select
            value={financeDetails.contactPerson || ""}
            onChange={(e) =>
              handleFinanceChange(
                courseIndex,
                "contactPerson",
                "",
                e.target.value
              )
            }
            label="Contact Person"
            className="bg-gray-100 rounded-lg"
            disabled={!financeDetails.financePartner || !canUpdate}
          >
            <MenuItem value="" disabled>
              Select Contact Person
            </MenuItem>
            {financeDetails.financePartner &&
              financePartners
                .find((p) => p.name === financeDetails.financePartner)
                ?.contactPersons?.map((person, idx) => (
                  <MenuItem key={idx} value={person.name}>
                    {person.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Finance Scheme</InputLabel>
          <Select
            value={financeDetails.scheme || ""}
            onChange={(e) =>
              handleFinanceChange(courseIndex, "scheme", "", e.target.value)
            }
            label="Finance Scheme"
            className="bg-gray-100 rounded-lg"
            disabled={!financeDetails.financePartner || !canUpdate}
          >
            <MenuItem value="">Select Finance Scheme</MenuItem>
            {financeDetails.financePartner &&
              financePartners
                .find((p) => p.name === financeDetails.financePartner)
                ?.scheme?.map((schemeItem, idx) => (
                  <MenuItem key={idx} value={schemeItem.plan}>
                    {schemeItem.plan}
                    {schemeItem.description && ` - ${schemeItem.description}`}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <TextField
          label="Loan Amount"
          type="number"
          value={financeDetails.loanAmount || 0}
          onChange={(e) =>
            handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)
          }
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <TextField
          label="Down Payment"
          type="number"
          value={financeDetails.downPayment || 0}
          onChange={(e) =>
            handleFinanceChange(courseIndex, "downPayment", "", e.target.value)
          }
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <TextField
          label="Down Payment Date"
          type="date"
          value={financeDetails.downPaymentDate || ""}
          onChange={(e) =>
            handleFinanceChange(
              courseIndex,
              "downPaymentDate",
              "",
              e.target.value
            )
          }
          variant="outlined"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          disabled={!canUpdate}
        />
        <TextField
          label="Applicant Name"
          value={financeDetails.applicantName || ""}
          onChange={(e) =>
            handleFinanceChange(
              courseIndex,
              "applicantName",
              "",
              e.target.value
            )
          }
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <TextField
          label="Relationship"
          value={financeDetails.relationship || ""}
          onChange={(e) =>
            handleFinanceChange(
              courseIndex,
              "relationship",
              "",
              e.target.value
            )
          }
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <FormControl fullWidth>
          <InputLabel>Loan Status</InputLabel>
          <Select
            value={financeDetails.loanStatus || "Pending"}
            onChange={(e) =>
              handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)
            }
            label="Loan Status"
            className="bg-gray-100 rounded-lg"
            disabled={!canUpdate}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Disbursed">Disbursed</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Applicant Number"
          type="number"
          value={financeDetails.applicant_number || 0}
          onChange={(e) =>
            handleFinanceChange(courseIndex, "applicant_number", "", e.target.value)
          }
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <TextField
          label="Invoice Number"
          type="number"
          value={financeDetails.invoice_number || 0}
          onChange={(e) =>
            handleFinanceChange(courseIndex, "invoice_number", "", e.target.value)
          }
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
      </div>
      <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
        Documents
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-50">
              <TableCell className="text-gray-800 font-medium min-w-40">
                Document Type
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                File
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Status
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { type: "photo", label: "Applicant Photo" },
              { type: "bankStatement", label: "6 Months Bank Statement" },
              { type: "paymentSlip", label: "Payment Slip" },
              { type: "aadharCard", label: "Aadhar Card" },
              { type: "panCard", label: "PAN Card" },
              { type: "invoice", label: "Invoice" },
              { type: "loan_agreement", label: "Loan Agreement" },
              { type: "loan_delivery", label: "Loan Delivery Order" },

            ].map((doc) => (
              <TableRow key={doc.type}>
                <TableCell>{doc.label}</TableCell>
                <TableCell>
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => handleFileChange(courseIndex, doc.type, e)}
                    className="mt-1"
                    disabled={!canUpdate}
                  />
                  {attachmentError[doc.type] && (
                    <Typography color="error" variant="body2" className="mt-1">
                      {attachmentError[doc.type]}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {uploadProgress[`${courseIndex}_${doc.type}`] !== undefined ? (
                    uploadProgress[`${courseIndex}_${doc.type}`] === -1 ? (
                      <Typography variant="body2" color="error">
                        Upload Failed
                      </Typography>
                    ) : uploadProgress[`${courseIndex}_${doc.type}`] < 100 ? (
                      <div>
                        <Typography variant="body2">
                          Uploading: {uploadProgress[`${courseIndex}_${doc.type}`]}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress[`${courseIndex}_${doc.type}`]}
                        />
                      </div>
                    ) : (
                      <Typography variant="body2" className="text-green-600">
                        Upload Complete
                      </Typography>
                    )
                  ) : financeDetails[doc.type] && typeof financeDetails[doc.type] === "string" ? (
                    <Typography variant="body2" className="text-green-600">
                      Uploaded: {financeDetails[`${doc.type}Name`]}
                    </Typography>
                  ) : financeDetails[doc.type] instanceof File ? (
                    <Typography variant="body2" className="text-gray-600">
                      Selected: {financeDetails[`${doc.type}Name`]} (Pending Save)
                    </Typography>
                  ) : (
                    <Typography variant="body2" className="text-gray-600">
                      Not Uploaded
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => viewDocument(financeDetails[doc.type], doc.label)}
                    disabled={!financeDetails[doc.type] || typeof financeDetails[doc.type] !== "string"}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FinanceForm;