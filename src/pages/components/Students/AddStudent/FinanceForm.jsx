// // // // // // // import React, { useState } from "react";
// // // // // // // import {
// // // // // // //   Typography,
// // // // // // //   TextField,
// // // // // // //   Select,
// // // // // // //   MenuItem,
// // // // // // //   Table,
// // // // // // //   TableBody,
// // // // // // //   TableCell,
// // // // // // //   TableContainer,
// // // // // // //   TableHead,
// // // // // // //   TableRow,
// // // // // // //   FormControl,
// // // // // // //   InputLabel,
// // // // // // //   Button,
// // // // // // //   LinearProgress,
// // // // // // // } from "@mui/material";
// // // // // // // import { GetObjectCommand } from "@aws-sdk/client-s3";
// // // // // // // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// // // // // // // import { useAuth } from "../../../../context/AuthContext";
// // // // // // // import { logActivity } from "./utils";
// // // // // // // import { s3Client } from "../../../../config/aws-config";

// // // // // // // const FinanceForm = ({
// // // // // // //   courseIndex,
// // // // // // //   fullFeesDetails,
// // // // // // //   financeDetails,
// // // // // // //   handleFinanceChange,
// // // // // // //   handleFileChange,
// // // // // // //   financePartners,
// // // // // // //   canUpdate,
// // // // // // //   user,
// // // // // // //   studentId,
// // // // // // //   uploadProgress,
// // // // // // // }) => {
// // // // // // //   const { user: authUser } = useAuth();
// // // // // // //   const [attachmentError, setAttachmentError] = useState({});

// // // // // // //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // // // // //   const region = import.meta.env.VITE_AWS_REGION;

// // // // // // //   // Debug environment variables
// // // // // // //   console.log("Environment Variables:", {
// // // // // // //     VITE_S3_BUCKET_NAME: bucketName,
// // // // // // //     VITE_AWS_REGION: region,
// // // // // // //     VITE_AWS_ACCESS_KEY_ID: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // // // // //     VITE_AWS_SECRET_ACCESS_KEY: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // // // // //   });

// // // // // // //   const viewDocument = async (s3Url, docType) => {
// // // // // // //     try {
// // // // // // //       if (!s3Url || typeof s3Url !== "string") {
// // // // // // //         throw new Error(`No valid ${docType} URL provided`);
// // // // // // //       }
// // // // // // //       if (!bucketName || !region) {
// // // // // // //         throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // // // // // //       }
// // // // // // //       if (!s3Client.config.credentials) {
// // // // // // //         throw new Error("S3 client credentials not configured");
// // // // // // //       }
// // // // // // //       let key;
// // // // // // //       const urlPatterns = [
// // // // // // //         new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
// // // // // // //         new RegExp(`https://${bucketName}\\.s3\\-accelerated\\.${region}\\.amazonaws\\.com/(.+)`),
// // // // // // //         new RegExp(`https://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
// // // // // // //         new RegExp(`https://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`),
// // // // // // //       ];
// // // // // // //       for (const pattern of urlPatterns) {
// // // // // // //         const match = s3Url.match(pattern);
// // // // // // //         if (match && match[1]) {
// // // // // // //           key = decodeURIComponent(match[1]);
// // // // // // //           break;
// // // // // // //         }
// // // // // // //       }
// // // // // // //       if (!key) {
// // // // // // //         throw new Error(`Invalid ${docType} URL: Could not extract S3 key. URL: ${s3Url}`);
// // // // // // //       }
// // // // // // //       const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
// // // // // // //       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// // // // // // //       window.open(url, "_blank");
// // // // // // //       logActivity("VIEW_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, url }, user);
// // // // // // //     } catch (err) {
// // // // // // //       let errorMsg = `Failed to view ${docType}: ${err.message}`;
// // // // // // //       if (err.name === "AccessDenied") {
// // // // // // //         errorMsg = `Access denied. Check S3 bucket permissions and IAM role.`;
// // // // // // //       } else if (err.name === "NoSuchKey") {
// // // // // // //         errorMsg = `File not found in S3. It may have been deleted or the URL is incorrect.`;
// // // // // // //       } else if (err.message.includes("Failed to fetch")) {
// // // // // // //         errorMsg = `Network or CORS issue. Check S3 CORS settings.`;
// // // // // // //       }
// // // // // // //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// // // // // // //       logActivity("VIEW_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message, url: s3Url }, user);
// // // // // // //     }
// // // // // // //   };


// // // // // // //   // const viewDocument = async (s3Url, docType) => {
// // // // // // //   //   try {
// // // // // // //   //     console.log(`viewDocument called for ${docType}:`, { s3Url, type: typeof s3Url });

// // // // // // //   //     // Validate s3Url
// // // // // // //   //     if (!s3Url || typeof s3Url !== "string") {
// // // // // // //   //       throw new Error(`No valid ${docType} URL provided`);
// // // // // // //   //     }

// // // // // // //   //     // Validate S3 configuration
// // // // // // //   //     if (!bucketName || !region) {
// // // // // // //   //       throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // // // // // //   //     }

// // // // // // //   //     if (!s3Client.config.credentials) {
// // // // // // //   //       throw new Error("S3 client credentials not configured");
// // // // // // //   //     }

// // // // // // //   //     // Extract S3 key
// // // // // // //   //     let key;
// // // // // // //   //     const urlPatterns = [
// // // // // // //   //       new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
// // // // // // //   //       new RegExp(`https://${bucketName}\\.s3\\-accelerated\\.${region}\\.amazonaws\\.com/(.+)`),
// // // // // // //   //       new RegExp(`https://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
// // // // // // //   //       new RegExp(`https://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`), // Fallback for region-less URLs
// // // // // // //   //     ];

// // // // // // //   //     for (const pattern of urlPatterns) {
// // // // // // //   //       const match = s3Url.match(pattern);
// // // // // // //   //       if (match && match[1]) {
// // // // // // //   //         key = decodeURIComponent(match[1]);
// // // // // // //   //         console.log(`Extracted S3 key for ${docType}:`, key);
// // // // // // //   //         break;
// // // // // // //   //       }
// // // // // // //   //     }

// // // // // // //   //     if (!key) {
// // // // // // //   //       throw new Error(`Invalid ${docType} URL: Could not extract S3 key. URL: ${s3Url}`);
// // // // // // //   //     }

// // // // // // //   //     // Generate pre-signed URL
// // // // // // //   //     console.log(`Generating pre-signed URL for ${docType}:`, { bucket: bucketName, key });
// // // // // // //   //     const command = new GetObjectCommand({
// // // // // // //   //       Bucket: bucketName,
// // // // // // //   //       Key: key,
// // // // // // //   //     });
// // // // // // //   //     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// // // // // // //   //     console.log(`Pre-signed URL generated for ${docType}:`, url);

// // // // // // //   //     // Open the URL
// // // // // // //   //     window.open(url, "_blank");
// // // // // // //   //     logActivity(
// // // // // // //   //       "VIEW_DOCUMENT_SUCCESS",
// // // // // // //   //       { studentId, courseIndex, docType, url },
// // // // // // //   //       user
// // // // // // //   //     );
// // // // // // //   //   } catch (err) {
// // // // // // //   //     console.error(`Error viewing ${docType}:`, {
// // // // // // //   //       error: err.message,
// // // // // // //   //       code: err.code,
// // // // // // //   //       requestId: err.$metadata?.requestId,
// // // // // // //   //       url: s3Url,
// // // // // // //   //     });
// // // // // // //   //     let errorMsg = `Failed to view ${docType}: ${err.message}`;
// // // // // // //   //     if (err.name === "AccessDenied") {
// // // // // // //   //       errorMsg = `Access denied. Check S3 bucket permissions and IAM role.`;
// // // // // // //   //     } else if (err.name === "NoSuchKey") {
// // // // // // //   //       errorMsg = `File not found in S3. It may have been deleted or the URL is incorrect.`;
// // // // // // //   //     } else if (err.message.includes("Failed to fetch")) {
// // // // // // //   //       errorMsg = `Network or CORS issue. Check S3 CORS settings.`;
// // // // // // //   //     }
// // // // // // //   //     setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// // // // // // //   //     logActivity(
// // // // // // //   //       "VIEW_DOCUMENT_ERROR",
// // // // // // //   //       { studentId, courseIndex, docType, error: err.message, url: s3Url },
// // // // // // //   //       user
// // // // // // //   //     );
// // // // // // //   //   }
// // // // // // //   // };

// // // // // // //   return (
// // // // // // //     <div className="space-y-4">
// // // // // // //       {Object.keys(attachmentError).length > 0 && (
// // // // // // //         <Typography color="error" variant="body2">
// // // // // // //           {Object.values(attachmentError).filter((err) => err).join("; ")}
// // // // // // //         </Typography>
// // // // // // //       )}
// // // // // // //       <div className="flex items-center space-x-4">
// // // // // // //         <Typography variant="subtitle1" className="text-gray-700">
// // // // // // //           Total Fees: {fullFeesDetails?.totalFees || 0}
// // // // // // //         </Typography>
// // // // // // //         <Select
// // // // // // //           value={financeDetails.discountType || ""}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(courseIndex, "discountType", "", e.target.value)
// // // // // // //           }
// // // // // // //           displayEmpty
// // // // // // //           className="w-32 bg-gray-100 rounded-lg"
// // // // // // //           disabled={!canUpdate}
// // // // // // //         >
// // // // // // //           <MenuItem value="" disabled>
// // // // // // //             Type
// // // // // // //           </MenuItem>
// // // // // // //           <MenuItem value="percentage">%</MenuItem>
// // // // // // //           <MenuItem value="value">₹</MenuItem>
// // // // // // //         </Select>
// // // // // // //         <TextField
// // // // // // //           label="Discount"
// // // // // // //           value={financeDetails.discountValue || ""}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(courseIndex, "discountValue", "", e.target.value)
// // // // // // //           }
// // // // // // //           className="w-32"
// // // // // // //           variant="outlined"
// // // // // // //           size="small"
// // // // // // //           disabled={!canUpdate}
// // // // // // //         />
// // // // // // //         <TextField
// // // // // // //           label="Discount Reason/Coupon"
// // // // // // //           value={financeDetails.discountReason || ""}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(courseIndex, "discountReason", "", e.target.value)
// // // // // // //           }
// // // // // // //           className="w-48"
// // // // // // //           variant="outlined"
// // // // // // //           size="small"
// // // // // // //           disabled={!canUpdate}
// // // // // // //         />
// // // // // // //         <Typography className="text-gray-700">
// // // // // // //           Fee After Discount: {financeDetails.feeAfterDiscount}
// // // // // // //         </Typography>
// // // // // // //       </div>
// // // // // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // // // // // //         Registration
// // // // // // //       </Typography>
// // // // // // //       <TableContainer>
// // // // // // //         <Table>
// // // // // // //           <TableHead>
// // // // // // //             <TableRow className="bg-blue-50">
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 Amount
// // // // // // //               </TableCell>
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 Date
// // // // // // //               </TableCell>
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 Payment Method
// // // // // // //               </TableCell>
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 Received By
// // // // // // //               </TableCell>
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 Remark
// // // // // // //               </TableCell>
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 Status
// // // // // // //               </TableCell>
// // // // // // //             </TableRow>
// // // // // // //           </TableHead>
// // // // // // //           <TableBody>
// // // // // // //             <TableRow>
// // // // // // //               <TableCell>
// // // // // // //                 <TextField
// // // // // // //                   value={financeDetails.registration.amount || ""}
// // // // // // //                   onChange={(e) =>
// // // // // // //                     handleFinanceChange(
// // // // // // //                       courseIndex,
// // // // // // //                       "registration",
// // // // // // //                       "amount",
// // // // // // //                       e.target.value
// // // // // // //                     )
// // // // // // //                   }
// // // // // // //                   size="small"
// // // // // // //                   disabled={!canUpdate}
// // // // // // //                 />
// // // // // // //               </TableCell>
// // // // // // //               <TableCell>
// // // // // // //                 <TextField
// // // // // // //                   type="date"
// // // // // // //                   value={financeDetails.registration.date || ""}
// // // // // // //                   onChange={(e) =>
// // // // // // //                     handleFinanceChange(
// // // // // // //                       courseIndex,
// // // // // // //                       "registration",
// // // // // // //                       "date",
// // // // // // //                       e.target.value
// // // // // // //                     )
// // // // // // //                   }
// // // // // // //                   size="small"
// // // // // // //                   disabled={!canUpdate}
// // // // // // //                 />
// // // // // // //               </TableCell>
// // // // // // //               <TableCell>
// // // // // // //                 <Select
// // // // // // //                   value={financeDetails.registration.paymentMethod || ""}
// // // // // // //                   onChange={(e) =>
// // // // // // //                     handleFinanceChange(
// // // // // // //                       courseIndex,
// // // // // // //                       "registration",
// // // // // // //                       "paymentMethod",
// // // // // // //                       e.target.value
// // // // // // //                     )
// // // // // // //                   }
// // // // // // //                   size="small"
// // // // // // //                   displayEmpty
// // // // // // //                   fullWidth
// // // // // // //                   disabled={!canUpdate}
// // // // // // //                 >
// // // // // // //                   <MenuItem value="" disabled>
// // // // // // //                     Select Payment Method
// // // // // // //                   </MenuItem>
// // // // // // //                   <MenuItem value="Cash">Cash</MenuItem>
// // // // // // //                   <MenuItem value="Card">Card</MenuItem>
// // // // // // //                   <MenuItem value="UPI">UPI</MenuItem>
// // // // // // //                   <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
// // // // // // //                   <MenuItem value="Cheque">Cheque</MenuItem>
// // // // // // //                 </Select>
// // // // // // //               </TableCell>
// // // // // // //               <TableCell>
// // // // // // //                 <TextField
// // // // // // //                   value={financeDetails.registration.receivedBy || ""}
// // // // // // //                   onChange={(e) =>
// // // // // // //                     handleFinanceChange(
// // // // // // //                       courseIndex,
// // // // // // //                       "registration",
// // // // // // //                       "receivedBy",
// // // // // // //                       e.target.value
// // // // // // //                     )
// // // // // // //                   }
// // // // // // //                   size="small"
// // // // // // //                   disabled={!canUpdate}
// // // // // // //                 />
// // // // // // //               </TableCell>
// // // // // // //               <TableCell>
// // // // // // //                 <TextField
// // // // // // //                   value={financeDetails.registration.remark || ""}
// // // // // // //                   onChange={(e) =>
// // // // // // //                     handleFinanceChange(
// // // // // // //                       courseIndex,
// // // // // // //                       "registration",
// // // // // // //                       "remark",
// // // // // // //                       e.target.value
// // // // // // //                     )
// // // // // // //                   }
// // // // // // //                   size="small"
// // // // // // //                   disabled={!canUpdate}
// // // // // // //                 />
// // // // // // //               </TableCell>
// // // // // // //               <TableCell>
// // // // // // //                 <Select
// // // // // // //                   value={financeDetails.registration.status || "Pending"}
// // // // // // //                   onChange={(e) =>
// // // // // // //                     handleFinanceChange(
// // // // // // //                       courseIndex,
// // // // // // //                       "registration",
// // // // // // //                       "status",
// // // // // // //                       e.target.value
// // // // // // //                     )
// // // // // // //                   }
// // // // // // //                   size="small"
// // // // // // //                   fullWidth
// // // // // // //                   disabled={!canUpdate}
// // // // // // //                 >
// // // // // // //                   <MenuItem value="Pending">Pending</MenuItem>
// // // // // // //                   <MenuItem value="Paid">Paid</MenuItem>
// // // // // // //                 </Select>
// // // // // // //               </TableCell>
// // // // // // //             </TableRow>
// // // // // // //           </TableBody>
// // // // // // //         </Table>
// // // // // // //       </TableContainer>
// // // // // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // // // // // //         Finance Details
// // // // // // //       </Typography>
// // // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // // //         <FormControl fullWidth>
// // // // // // //           <InputLabel>Finance Partner</InputLabel>
// // // // // // //           <Select
// // // // // // //             value={financeDetails.financePartner || ""}
// // // // // // //             onChange={(e) =>
// // // // // // //               handleFinanceChange(
// // // // // // //                 courseIndex,
// // // // // // //                 "financePartner",
// // // // // // //                 "",
// // // // // // //                 e.target.value
// // // // // // //               )
// // // // // // //             }
// // // // // // //             label="Finance Partner"
// // // // // // //             className="bg-gray-100 rounded-lg"
// // // // // // //             disabled={!canUpdate}
// // // // // // //           >
// // // // // // //             <MenuItem value="" disabled>
// // // // // // //               Select Finance Partner
// // // // // // //             </MenuItem>
// // // // // // //             {financePartners.map((partner) => (
// // // // // // //               <MenuItem key={partner.id} value={partner.name}>
// // // // // // //                 {partner.name}
// // // // // // //               </MenuItem>
// // // // // // //             ))}
// // // // // // //           </Select>
// // // // // // //         </FormControl>
// // // // // // //         <FormControl fullWidth>
// // // // // // //           <InputLabel>Contact Person</InputLabel>
// // // // // // //           <Select
// // // // // // //             value={financeDetails.contactPerson || ""}
// // // // // // //             onChange={(e) =>
// // // // // // //               handleFinanceChange(
// // // // // // //                 courseIndex,
// // // // // // //                 "contactPerson",
// // // // // // //                 "",
// // // // // // //                 e.target.value
// // // // // // //               )
// // // // // // //             }
// // // // // // //             label="Contact Person"
// // // // // // //             className="bg-gray-100 rounded-lg"
// // // // // // //             disabled={!financeDetails.financePartner || !canUpdate}
// // // // // // //           >
// // // // // // //             <MenuItem value="" disabled>
// // // // // // //               Select Contact Person
// // // // // // //             </MenuItem>
// // // // // // //             {financeDetails.financePartner &&
// // // // // // //               financePartners
// // // // // // //                 .find((p) => p.name === financeDetails.financePartner)
// // // // // // //                 ?.contactPersons?.map((person, idx) => (
// // // // // // //                   <MenuItem key={idx} value={person.name}>
// // // // // // //                     {person.name}
// // // // // // //                   </MenuItem>
// // // // // // //                 ))}
// // // // // // //           </Select>
// // // // // // //         </FormControl>
// // // // // // //         <FormControl fullWidth>
// // // // // // //           <InputLabel>Finance Scheme</InputLabel>
// // // // // // //           <Select
// // // // // // //             value={financeDetails.scheme || ""}
// // // // // // //             onChange={(e) =>
// // // // // // //               handleFinanceChange(courseIndex, "scheme", "", e.target.value)
// // // // // // //             }
// // // // // // //             label="Finance Scheme"
// // // // // // //             className="bg-gray-100 rounded-lg"
// // // // // // //             disabled={!financeDetails.financePartner || !canUpdate}
// // // // // // //           >
// // // // // // //             <MenuItem value="">Select Finance Scheme</MenuItem>
// // // // // // //             {financeDetails.financePartner &&
// // // // // // //               financePartners
// // // // // // //                 .find((p) => p.name === financeDetails.financePartner)
// // // // // // //                 ?.scheme?.map((schemeItem, idx) => (
// // // // // // //                   <MenuItem key={idx} value={schemeItem.plan}>
// // // // // // //                     {schemeItem.plan}
// // // // // // //                     {schemeItem.description && ` - ${schemeItem.description}`}
// // // // // // //                   </MenuItem>
// // // // // // //                 ))}
// // // // // // //           </Select>
// // // // // // //         </FormControl>
// // // // // // //         <TextField
// // // // // // //           label="Loan Amount"
// // // // // // //           type="number"
// // // // // // //           value={financeDetails.loanAmount || 0}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)
// // // // // // //           }
// // // // // // //           variant="outlined"
// // // // // // //           size="small"
// // // // // // //           fullWidth
// // // // // // //           disabled={!canUpdate}
// // // // // // //         />
// // // // // // //         <TextField
// // // // // // //           label="Down Payment"
// // // // // // //           type="number"
// // // // // // //           value={financeDetails.downPayment || 0}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(courseIndex, "downPayment", "", e.target.value)
// // // // // // //           }
// // // // // // //           variant="outlined"
// // // // // // //           size="small"
// // // // // // //           fullWidth
// // // // // // //           disabled={!canUpdate}
// // // // // // //         />
// // // // // // //         <TextField
// // // // // // //           label="Down Payment Date"
// // // // // // //           type="date"
// // // // // // //           value={financeDetails.downPaymentDate || ""}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(
// // // // // // //               courseIndex,
// // // // // // //               "downPaymentDate",
// // // // // // //               "",
// // // // // // //               e.target.value
// // // // // // //             )
// // // // // // //           }
// // // // // // //           variant="outlined"
// // // // // // //           size="small"
// // // // // // //           fullWidth
// // // // // // //           InputLabelProps={{ shrink: true }}
// // // // // // //           disabled={!canUpdate}
// // // // // // //         />
// // // // // // //         <TextField
// // // // // // //           label="Applicant Name"
// // // // // // //           value={financeDetails.applicantName || ""}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(
// // // // // // //               courseIndex,
// // // // // // //               "applicantName",
// // // // // // //               "",
// // // // // // //               e.target.value
// // // // // // //             )
// // // // // // //           }
// // // // // // //           variant="outlined"
// // // // // // //           size="small"
// // // // // // //           fullWidth
// // // // // // //           disabled={!canUpdate}
// // // // // // //         />
// // // // // // //         <TextField
// // // // // // //           label="Relationship"
// // // // // // //           value={financeDetails.relationship || ""}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(
// // // // // // //               courseIndex,
// // // // // // //               "relationship",
// // // // // // //               "",
// // // // // // //               e.target.value
// // // // // // //             )
// // // // // // //           }
// // // // // // //           variant="outlined"
// // // // // // //           size="small"
// // // // // // //           fullWidth
// // // // // // //           disabled={!canUpdate}
// // // // // // //         />
// // // // // // //         <FormControl fullWidth>
// // // // // // //           <InputLabel>Loan Status</InputLabel>
// // // // // // //           <Select
// // // // // // //             value={financeDetails.loanStatus || "Pending"}
// // // // // // //             onChange={(e) =>
// // // // // // //               handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)
// // // // // // //             }
// // // // // // //             label="Loan Status"
// // // // // // //             className="bg-gray-100 rounded-lg"
// // // // // // //             disabled={!canUpdate}
// // // // // // //           >
// // // // // // //             <MenuItem value="Pending">Pending</MenuItem>
// // // // // // //             <MenuItem value="Approved">Approved</MenuItem>
// // // // // // //             <MenuItem value="Rejected">Rejected</MenuItem>
// // // // // // //             <MenuItem value="Disbursed">Disbursed</MenuItem>
// // // // // // //             <MenuItem value="Completed">Completed</MenuItem>
// // // // // // //           </Select>
// // // // // // //         </FormControl>
// // // // // // //         <TextField
// // // // // // //           label="Applicant Number"
// // // // // // //           type="number"
// // // // // // //           value={financeDetails.applicant_number || 0}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(courseIndex, "applicant_number", "", e.target.value)
// // // // // // //           }
// // // // // // //           variant="outlined"
// // // // // // //           size="small"
// // // // // // //           fullWidth
// // // // // // //           disabled={!canUpdate}
// // // // // // //         />
// // // // // // //         <TextField
// // // // // // //           label="Invoice Number"
// // // // // // //           type="number"
// // // // // // //           value={financeDetails.invoice_number || 0}
// // // // // // //           onChange={(e) =>
// // // // // // //             handleFinanceChange(courseIndex, "invoice_number", "", e.target.value)
// // // // // // //           }
// // // // // // //           variant="outlined"
// // // // // // //           size="small"
// // // // // // //           fullWidth
// // // // // // //           disabled={!canUpdate}
// // // // // // //         />
// // // // // // //       </div>
// // // // // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
// // // // // // //         Documents
// // // // // // //       </Typography>
// // // // // // //       <TableContainer>
// // // // // // //         <Table>
// // // // // // //           <TableHead>
// // // // // // //             <TableRow className="bg-blue-50">
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 Document Type
// // // // // // //               </TableCell>
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 File
// // // // // // //               </TableCell>
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 Status
// // // // // // //               </TableCell>
// // // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // // //                 Action
// // // // // // //               </TableCell>
// // // // // // //             </TableRow>
// // // // // // //           </TableHead>
// // // // // // //           <TableBody>
// // // // // // //             {[
// // // // // // //               { type: "photo", label: "Applicant Photo" },
// // // // // // //               { type: "bankStatement", label: "6 Months Bank Statement" },
// // // // // // //               { type: "paymentSlip", label: "Payment Slip" },
// // // // // // //               { type: "aadharCard", label: "Aadhar Card" },
// // // // // // //               { type: "panCard", label: "PAN Card" },
// // // // // // //               { type: "invoice", label: "Invoice" },
// // // // // // //               { type: "loan_agreement", label: "Loan Agreement" },
// // // // // // //               { type: "loan_delivery", label: "Loan Delivery Order" },

// // // // // // //             ].map((doc) => (
// // // // // // //               <TableRow key={doc.type}>
// // // // // // //                 <TableCell>{doc.label}</TableCell>
// // // // // // //                 <TableCell>
// // // // // // //                   <input
// // // // // // //                     type="file"
// // // // // // //                     accept="application/pdf,image/jpeg,image/png"
// // // // // // //                     onChange={(e) => handleFileChange(courseIndex, doc.type, e)}
// // // // // // //                     className="mt-1"
// // // // // // //                     disabled={!canUpdate}
// // // // // // //                   />
// // // // // // //                   {attachmentError[doc.type] && (
// // // // // // //                     <Typography color="error" variant="body2" className="mt-1">
// // // // // // //                       {attachmentError[doc.type]}
// // // // // // //                     </Typography>
// // // // // // //                   )}
// // // // // // //                 </TableCell>
// // // // // // //                 <TableCell>
// // // // // // //   {uploadProgress[`${courseIndex}_${doc.type}`] !== undefined ? (
// // // // // // //     uploadProgress[`${courseIndex}_${doc.type}`] === -1 ? (
// // // // // // //       <Typography variant="body2" color="error">
// // // // // // //         Upload Failed
// // // // // // //       </Typography>
// // // // // // //     ) : uploadProgress[`${courseIndex}_${doc.type}`] < 100 ? (
// // // // // // //       <div>
// // // // // // //         <Typography variant="body2">
// // // // // // //           Uploading: {uploadProgress[`${courseIndex}_${doc.type}`]}%
// // // // // // //         </Typography>
// // // // // // //         <LinearProgress
// // // // // // //           variant="determinate"
// // // // // // //           value={uploadProgress[`${courseIndex}_${doc.type}`]}
// // // // // // //         />
// // // // // // //       </div>
// // // // // // //     ) : (
// // // // // // //       <Typography variant="body2" className="text-green-600">
// // // // // // //         Upload Complete
// // // // // // //       </Typography>
// // // // // // //     )
// // // // // // //   ) : financeDetails[doc.type] && typeof financeDetails[doc.type] === "string" ? (
// // // // // // //     <Typography variant="body2" className="text-green-600">
// // // // // // //       Uploaded: {financeDetails[`${doc.type}Name`]}
// // // // // // //     </Typography>
// // // // // // //   ) : financeDetails[doc.type] instanceof File ? (
// // // // // // //     <Typography variant="body2" className="text-gray-600">
// // // // // // //       Selected: {financeDetails[`${doc.type}Name`]} (Pending Save)
// // // // // // //     </Typography>
// // // // // // //   ) : (
// // // // // // //     <Typography variant="body2" className="text-gray-600">
// // // // // // //       Not Uploaded
// // // // // // //     </Typography>
// // // // // // //   )}
// // // // // // // </TableCell>
// // // // // // //                 {/* <TableCell>
// // // // // // //                   {uploadProgress[`${courseIndex}_${doc.type}`] !== undefined ? (
// // // // // // //                     uploadProgress[`${courseIndex}_${doc.type}`] === -1 ? (
// // // // // // //                       <Typography variant="body2" color="error">
// // // // // // //                         Upload Failed
// // // // // // //                       </Typography>
// // // // // // //                     ) : uploadProgress[`${courseIndex}_${doc.type}`] < 100 ? (
// // // // // // //                       <div>
// // // // // // //                         <Typography variant="body2">
// // // // // // //                           Uploading: {uploadProgress[`${courseIndex}_${doc.type}`]}%
// // // // // // //                         </Typography>
// // // // // // //                         <LinearProgress
// // // // // // //                           variant="determinate"
// // // // // // //                           value={uploadProgress[`${courseIndex}_${doc.type}`]}
// // // // // // //                         />
// // // // // // //                       </div>
// // // // // // //                     ) : (
// // // // // // //                       <Typography variant="body2" className="text-green-600">
// // // // // // //                         Upload Complete
// // // // // // //                       </Typography>
// // // // // // //                     )
// // // // // // //                   ) : financeDetails[doc.type] && typeof financeDetails[doc.type] === "string" ? (
// // // // // // //                     <Typography variant="body2" className="text-green-600">
// // // // // // //                       Uploaded: {financeDetails[`${doc.type}Name`]}
// // // // // // //                     </Typography>
// // // // // // //                   ) : financeDetails[doc.type] instanceof File ? (
// // // // // // //                     <Typography variant="body2" className="text-gray-600">
// // // // // // //                       Selected: {financeDetails[`${doc.type}Name`]} (Pending Save)
// // // // // // //                     </Typography>
// // // // // // //                   ) : (
// // // // // // //                     <Typography variant="body2" className="text-gray-600">
// // // // // // //                       Not Uploaded
// // // // // // //                     </Typography>
// // // // // // //                   )}
// // // // // // //                 </TableCell> */}
// // // // // // //                 <TableCell>
// // // // // // //                   <Button
// // // // // // //                     variant="text"
// // // // // // //                     color="primary"
// // // // // // //                     onClick={() => viewDocument(financeDetails[doc.type], doc.label)}
// // // // // // //                     disabled={!financeDetails[doc.type] || typeof financeDetails[doc.type] !== "string"}
// // // // // // //                   >
// // // // // // //                     View
// // // // // // //                   </Button>
// // // // // // //                 </TableCell>
// // // // // // //               </TableRow>
// // // // // // //             ))}
// // // // // // //           </TableBody>
// // // // // // //         </Table>
// // // // // // //       </TableContainer>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default FinanceForm;



// // // // // // import React, { useState } from "react";
// // // // // // import {
// // // // // //   Typography,
// // // // // //   TextField,
// // // // // //   Select,
// // // // // //   MenuItem,
// // // // // //   Table,
// // // // // //   TableBody,
// // // // // //   TableCell,
// // // // // //   TableContainer,
// // // // // //   TableHead,
// // // // // //   TableRow,
// // // // // //   FormControl,
// // // // // //   InputLabel,
// // // // // // } from "@mui/material";
// // // // // // import { PutObjectCommand } from "@aws-sdk/client-s3";
// // // // // // import { useAuth } from "../../../../context/AuthContext";
// // // // // // import { logActivity } from "./utils";
// // // // // // import { s3Client } from "../../../../config/aws-config";

// // // // // // const FinanceForm = ({
// // // // // //   courseIndex,
// // // // // //   fullFeesDetails,
// // // // // //   financeDetails,
// // // // // //   handleFinanceChange,
// // // // // //   handleFileChange,
// // // // // //   financePartners,
// // // // // //   canUpdate,
// // // // // //   user,
// // // // // //   studentId,
// // // // // // }) => {
// // // // // //   const { user: authUser } = useAuth();
// // // // // //   const [attachmentError, setAttachmentError] = useState({});

// // // // // //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // // // //   const region = import.meta.env.VITE_AWS_REGION;

// // // // // //   // Debug environment variables
// // // // // //   console.log("Environment Variables:", {
// // // // // //     VITE_S3_BUCKET_NAME: bucketName,
// // // // // //     VITE_AWS_REGION: region,
// // // // // //     VITE_AWS_ACCESS_KEY_ID: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // // // //     VITE_AWS_SECRET_ACCESS_KEY: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // // // //   });

// // // // // //   // Example handleFileChange implementation for S3 upload
// // // // // //   const handleFileChangeS3 = async (courseIndex, docType, event) => {
// // // // // //     const file = event.target.files[0];
// // // // // //     if (!file) return;

// // // // // //     try {
// // // // // //       if (!bucketName || !region) {
// // // // // //         throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // // // // //       }
// // // // // //       if (!s3Client.config.credentials) {
// // // // // //         throw new Error("S3 client credentials not configured");
// // // // // //       }

// // // // // //       // Create a unique key for the file
// // // // // //       const key = `students/${studentId}/${courseIndex}/${docType}/${Date.now()}_${file.name}`;
      
// // // // // //       // Prepare S3 PutObject command
// // // // // //       const command = new PutObjectCommand({
// // // // // //         Bucket: bucketName,
// // // // // //         Key: key,
// // // // // //         Body: file,
// // // // // //         ContentType: file.type,
// // // // // //       });

// // // // // //       // Upload to S3
// // // // // //       await s3Client.send(command);

// // // // // //       // Construct the S3 URL
// // // // // //       const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

// // // // // //       // Update financeDetails with the S3 URL and file name
// // // // // //       handleFinanceChange(courseIndex, docType, "", s3Url);
// // // // // //       handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);

// // // // // //       logActivity(
// // // // // //         "UPLOAD_DOCUMENT_SUCCESS",
// // // // // //         { studentId, courseIndex, docType, fileName: file.name, url: s3Url },
// // // // // //         user
// // // // // //       );
// // // // // //     } catch (err) {
// // // // // //       const errorMsg = `Failed to upload ${docType}: ${err.message}`;
// // // // // //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// // // // // //       logActivity(
// // // // // //         "UPLOAD_DOCUMENT_ERROR",
// // // // // //         { studentId, courseIndex, docType, error: err.message },
// // // // // //         user
// // // // // //       );
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="space-y-4">
// // // // // //       {Object.keys(attachmentError).length > 0 && (
// // // // // //         <Typography color="error" variant="body2">
// // // // // //           {Object.values(attachmentError).filter((err) => err).join("; ")}
// // // // // //         </Typography>
// // // // // //       )}
// // // // // //       <div className="flex items-center space-x-4">
// // // // // //         <Typography variant="subtitle1" className="text-gray-700">
// // // // // //           Total Fees: {fullFeesDetails?.totalFees || 0}
// // // // // //         </Typography>
// // // // // //         <Select
// // // // // //           value={financeDetails.discountType || ""}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(courseIndex, "discountType", "", e.target.value)
// // // // // //           }
// // // // // //           displayEmpty
// // // // // //           className="w-32 bg-gray-100 rounded-lg"
// // // // // //           disabled={!canUpdate}
// // // // // //         >
// // // // // //           <MenuItem value="" disabled>
// // // // // //             Type
// // // // // //           </MenuItem>
// // // // // //           <MenuItem value="percentage">%</MenuItem>
// // // // // //           <MenuItem value="value">₹</MenuItem>
// // // // // //         </Select>
// // // // // //         <TextField
// // // // // //           label="Discount"
// // // // // //           value={financeDetails.discountValue || ""}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(courseIndex, "discountValue", "", e.target.value)
// // // // // //           }
// // // // // //           className="w-32"
// // // // // //           variant="outlined"
// // // // // //           size="small"
// // // // // //           disabled={!canUpdate}
// // // // // //         />
// // // // // //         <TextField
// // // // // //           label="Discount Reason/Coupon"
// // // // // //           value={financeDetails.discountReason || ""}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(courseIndex, "discountReason", "", e.target.value)
// // // // // //           }
// // // // // //           className="w-48"
// // // // // //           variant="outlined"
// // // // // //           size="small"
// // // // // //           disabled={!canUpdate}
// // // // // //         />
// // // // // //         <Typography className="text-gray-700">
// // // // // //           Fee After Discount: {financeDetails.feeAfterDiscount}
// // // // // //         </Typography>
// // // // // //       </div>
// // // // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // // // // //         Registration
// // // // // //       </Typography>
// // // // // //       <TableContainer>
// // // // // //         <Table>
// // // // // //           <TableHead>
// // // // // //             <TableRow className="bg-blue-50">
// // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // //                 Amount
// // // // // //               </TableCell>
// // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // //                 Date
// // // // // //               </TableCell>
// // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // //                 Payment Method
// // // // // //               </TableCell>
// // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // //                 Received By
// // // // // //               </TableCell>
// // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // //                 Remark
// // // // // //               </TableCell>
// // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // //                 Status
// // // // // //               </TableCell>
// // // // // //             </TableRow>
// // // // // //           </TableHead>
// // // // // //           <TableBody>
// // // // // //             <TableRow>
// // // // // //               <TableCell>
// // // // // //                 <TextField
// // // // // //                   value={financeDetails.registration.amount || ""}
// // // // // //                   onChange={(e) =>
// // // // // //                     handleFinanceChange(
// // // // // //                       courseIndex,
// // // // // //                       "registration",
// // // // // //                       "amount",
// // // // // //                       e.target.value
// // // // // //                     )
// // // // // //                   }
// // // // // //                   size="small"
// // // // // //                   disabled={!canUpdate}
// // // // // //                 />
// // // // // //               </TableCell>
// // // // // //               <TableCell>
// // // // // //                 <TextField
// // // // // //                   type="date"
// // // // // //                   value={financeDetails.registration.date || ""}
// // // // // //                   onChange={(e) =>
// // // // // //                     handleFinanceChange(
// // // // // //                       courseIndex,
// // // // // //                       "registration",
// // // // // //                       "date",
// // // // // //                       e.target.value
// // // // // //                     )
// // // // // //                   }
// // // // // //                   size="small"
// // // // // //                   disabled={!canUpdate}
// // // // // //                 />
// // // // // //               </TableCell>
// // // // // //               <TableCell>
// // // // // //                 <Select
// // // // // //                   value={financeDetails.registration.paymentMethod || ""}
// // // // // //                   onChange={(e) =>
// // // // // //                     handleFinanceChange(
// // // // // //                       courseIndex,
// // // // // //                       "registration",
// // // // // //                       "paymentMethod",
// // // // // //                       e.target.value
// // // // // //                     )
// // // // // //                   }
// // // // // //                   size="small"
// // // // // //                   displayEmpty
// // // // // //                   fullWidth
// // // // // //                   disabled={!canUpdate}
// // // // // //                 >
// // // // // //                   <MenuItem value="" disabled>
// // // // // //                     Select Payment Method
// // // // // //                   </MenuItem>
// // // // // //                   <MenuItem value="Cash">Cash</MenuItem>
// // // // // //                   <MenuItem value="Card">Card</MenuItem>
// // // // // //                   <MenuItem value="UPI">UPI</MenuItem>
// // // // // //                   <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
// // // // // //                   <MenuItem value="Cheque">Cheque</MenuItem>
// // // // // //                 </Select>
// // // // // //               </TableCell>
// // // // // //               <TableCell>
// // // // // //                 <TextField
// // // // // //                   value={financeDetails.registration.receivedBy || ""}
// // // // // //                   onChange={(e) =>
// // // // // //                     handleFinanceChange(
// // // // // //                       courseIndex,
// // // // // //                       "registration",
// // // // // //                       "receivedBy",
// // // // // //                       e.target.value
// // // // // //                     )
// // // // // //                   }
// // // // // //                   size="small"
// // // // // //                   disabled={!canUpdate}
// // // // // //                 />
// // // // // //               </TableCell>
// // // // // //               <TableCell>
// // // // // //                 <TextField
// // // // // //                   value={financeDetails.registration.remark || ""}
// // // // // //                   onChange={(e) =>
// // // // // //                     handleFinanceChange(
// // // // // //                       courseIndex,
// // // // // //                       "registration",
// // // // // //                       "remark",
// // // // // //                       e.target.value
// // // // // //                     )
// // // // // //                   }
// // // // // //                   size="small"
// // // // // //                   disabled={!canUpdate}
// // // // // //                 />
// // // // // //               </TableCell>
// // // // // //               <TableCell>
// // // // // //                 <Select
// // // // // //                   value={financeDetails.registration.status || "Pending"}
// // // // // //                   onChange={(e) =>
// // // // // //                     handleFinanceChange(
// // // // // //                       courseIndex,
// // // // // //                       "registration",
// // // // // //                       "status",
// // // // // //                       e.target.value
// // // // // //                     )
// // // // // //                   }
// // // // // //                   size="small"
// // // // // //                   fullWidth
// // // // // //                   disabled={!canUpdate}
// // // // // //                 >
// // // // // //                   <MenuItem value="Pending">Pending</MenuItem>
// // // // // //                   <MenuItem value="Paid">Paid</MenuItem>
// // // // // //                 </Select>
// // // // // //               </TableCell>
// // // // // //             </TableRow>
// // // // // //           </TableBody>
// // // // // //         </Table>
// // // // // //       </TableContainer>
// // // // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium">
// // // // // //         Finance Details
// // // // // //       </Typography>
// // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // //         <FormControl fullWidth>
// // // // // //           <InputLabel>Finance Partner</InputLabel>
// // // // // //           <Select
// // // // // //             value={financeDetails.financePartner || ""}
// // // // // //             onChange={(e) =>
// // // // // //               handleFinanceChange(
// // // // // //                 courseIndex,
// // // // // //                 "financePartner",
// // // // // //                 "",
// // // // // //                 e.target.value
// // // // // //               )
// // // // // //             }
// // // // // //             label="Finance Partner"
// // // // // //             className="bg-gray-100 rounded-lg"
// // // // // //             disabled={!canUpdate}
// // // // // //           >
// // // // // //             <MenuItem value="" disabled>
// // // // // //               Select Finance Partner
// // // // // //             </MenuItem>
// // // // // //             {financePartners.map((partner) => (
// // // // // //               <MenuItem key={partner.id} value={partner.name}>
// // // // // //                 {partner.name}
// // // // // //               </MenuItem>
// // // // // //             ))}
// // // // // //           </Select>
// // // // // //         </FormControl>
// // // // // //         <FormControl fullWidth>
// // // // // //           <InputLabel>Contact Person</InputLabel>
// // // // // //           <Select
// // // // // //             value={financeDetails.contactPerson || ""}
// // // // // //             onChange={(e) =>
// // // // // //               handleFinanceChange(
// // // // // //                 courseIndex,
// // // // // //                 "contactPerson",
// // // // // //                 "",
// // // // // //                 e.target.value
// // // // // //               )
// // // // // //             }
// // // // // //             label="Contact Person"
// // // // // //             className="bg-gray-100 rounded-lg"
// // // // // //             disabled={!financeDetails.financePartner || !canUpdate}
// // // // // //           >
// // // // // //             <MenuItem value="" disabled>
// // // // // //               Select Contact Person
// // // // // //             </MenuItem>
// // // // // //             {financeDetails.financePartner &&
// // // // // //               financePartners
// // // // // //                 .find((p) => p.name === financeDetails.financePartner)
// // // // // //                 ?.contactPersons?.map((person, idx) => (
// // // // // //                   <MenuItem key={idx} value={person.name}>
// // // // // //                     {person.name}
// // // // // //                   </MenuItem>
// // // // // //                 ))}
// // // // // //           </Select>
// // // // // //         </FormControl>
// // // // // //         <FormControl fullWidth>
// // // // // //           <InputLabel>Finance Scheme</InputLabel>
// // // // // //           <Select
// // // // // //             value={financeDetails.scheme || ""}
// // // // // //             onChange={(e) =>
// // // // // //               handleFinanceChange(courseIndex, "scheme", "", e.target.value)
// // // // // //             }
// // // // // //             label="Finance Scheme"
// // // // // //             className="bg-gray-100 rounded-lg"
// // // // // //             disabled={!financeDetails.financePartner || !canUpdate}
// // // // // //           >
// // // // // //             <MenuItem value="">Select Finance Scheme</MenuItem>
// // // // // //             {financeDetails.financePartner &&
// // // // // //               financePartners
// // // // // //                 .find((p) => p.name === financeDetails.financePartner)
// // // // // //                 ?.scheme?.map((schemeItem, idx) => (
// // // // // //                   <MenuItem key={idx} value={schemeItem.plan}>
// // // // // //                     {schemeItem.plan}
// // // // // //                     {schemeItem.description && ` - ${schemeItem.description}`}
// // // // // //                   </MenuItem>
// // // // // //                 ))}
// // // // // //           </Select>
// // // // // //         </FormControl>
// // // // // //         <TextField
// // // // // //           label="Loan Amount"
// // // // // //           type="number"
// // // // // //           value={financeDetails.loanAmount || 0}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)
// // // // // //           }
// // // // // //           variant="outlined"
// // // // // //           size="small"
// // // // // //           fullWidth
// // // // // //           disabled={!canUpdate}
// // // // // //         />
// // // // // //         <TextField
// // // // // //           label="Down Payment"
// // // // // //           type="number"
// // // // // //           value={financeDetails.downPayment || 0}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(courseIndex, "downPayment", "", e.target.value)
// // // // // //           }
// // // // // //           variant="outlined"
// // // // // //           size="small"
// // // // // //           fullWidth
// // // // // //           disabled={!canUpdate}
// // // // // //         />
// // // // // //         <TextField
// // // // // //           label="Down Payment Date"
// // // // // //           type="date"
// // // // // //           value={financeDetails.downPaymentDate || ""}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(
// // // // // //               courseIndex,
// // // // // //               "downPaymentDate",
// // // // // //               "",
// // // // // //               e.target.value
// // // // // //             )
// // // // // //           }
// // // // // //           variant="outlined"
// // // // // //           size="small"
// // // // // //           fullWidth
// // // // // //           InputLabelProps={{ shrink: true }}
// // // // // //           disabled={!canUpdate}
// // // // // //         />
// // // // // //         <TextField
// // // // // //           label="Applicant Name"
// // // // // //           value={financeDetails.applicantName || ""}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(
// // // // // //               courseIndex,
// // // // // //               "applicantName",
// // // // // //               "",
// // // // // //               e.target.value
// // // // // //             )
// // // // // //           }
// // // // // //           variant="outlined"
// // // // // //           size="small"
// // // // // //           fullWidth
// // // // // //           disabled={!canUpdate}
// // // // // //         />
// // // // // //         <TextField
// // // // // //           label="Relationship"
// // // // // //           value={financeDetails.relationship || ""}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(
// // // // // //               courseIndex,
// // // // // //               "relationship",
// // // // // //               "",
// // // // // //               e.target.value
// // // // // //             )
// // // // // //           }
// // // // // //           variant="outlined"
// // // // // //           size="small"
// // // // // //           fullWidth
// // // // // //           disabled={!canUpdate}
// // // // // //         />
// // // // // //         <FormControl fullWidth>
// // // // // //           <InputLabel>Loan Status</InputLabel>
// // // // // //           <Select
// // // // // //             value={financeDetails.loanStatus || "Pending"}
// // // // // //             onChange={(e) =>
// // // // // //               handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)
// // // // // //             }
// // // // // //             label="Loan Status"
// // // // // //             className="bg-gray-100 rounded-lg"
// // // // // //             disabled={!canUpdate}
// // // // // //           >
// // // // // //             <MenuItem value="Pending">Pending</MenuItem>
// // // // // //             <MenuItem value="Approved">Approved</MenuItem>
// // // // // //             <MenuItem value="Rejected">Rejected</MenuItem>
// // // // // //             <MenuItem value="Disbursed">Disbursed</MenuItem>
// // // // // //             <MenuItem value="Completed">Completed</MenuItem>
// // // // // //           </Select>
// // // // // //         </FormControl>
// // // // // //         <TextField
// // // // // //           label="Applicant Number"
// // // // // //           type="number"
// // // // // //           value={financeDetails.applicant_number || 0}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(courseIndex, "applicant_number", "", e.target.value)
// // // // // //           }
// // // // // //           variant="outlined"
// // // // // //           size="small"
// // // // // //           fullWidth
// // // // // //           disabled={!canUpdate}
// // // // // //         />
// // // // // //         <TextField
// // // // // //           label="Invoice Number"
// // // // // //           type="number"
// // // // // //           value={financeDetails.invoice_number || 0}
// // // // // //           onChange={(e) =>
// // // // // //             handleFinanceChange(courseIndex, "invoice_number", "", e.target.value)
// // // // // //           }
// // // // // //           variant="outlined"
// // // // // //           size="small"
// // // // // //           fullWidth
// // // // // //           disabled={!canUpdate}
// // // // // //         />
// // // // // //       </div>
// // // // // //       <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
// // // // // //         Documents
// // // // // //       </Typography>
// // // // // //       <TableContainer>
// // // // // //         <Table>
// // // // // //           <TableHead>
// // // // // //             <TableRow className="bg-blue-50">
// // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // //                 Document Type
// // // // // //               </TableCell>
// // // // // //               <TableCell className="text-gray-800 font-medium min-w-40">
// // // // // //                 File
// // // // // //               </TableCell>
// // // // // //             </TableRow>
// // // // // //           </TableHead>
// // // // // //           <TableBody>
// // // // // //             {[
// // // // // //               { type: "photo", label: "Applicant Photo" },
// // // // // //               { type: "bankStatement", label: "6 Months Bank Statement" },
// // // // // //               { type: "paymentSlip", label: "Payment Slip" },
// // // // // //               { type: "aadharCard", label: "Aadhar Card" },
// // // // // //               { type: "panCard", label: "PAN Card" },
// // // // // //               { type: "invoice", label: "Invoice" },
// // // // // //               { type: "loan_agreement", label: "Loan Agreement" },
// // // // // //               { type: "loan_delivery", label: "Loan Delivery Order" },
// // // // // //             ].map((doc) => (
// // // // // //               <TableRow key={doc.type}>
// // // // // //                 <TableCell>{doc.label}</TableCell>
// // // // // //                 <TableCell>
// // // // // //                   <input
// // // // // //                     type="file"
// // // // // //                     accept="application/pdf,image/jpeg,image/png"
// // // // // //                     onChange={(e) => handleFileChangeS3(courseIndex, doc.type, e)}
// // // // // //                     className="mt-1"
// // // // // //                     disabled={!canUpdate}
// // // // // //                   />
// // // // // //                   {attachmentError[doc.type] && (
// // // // // //                     <Typography color="error" variant="body2" className="mt-1">
// // // // // //                       {attachmentError[doc.type]}
// // // // // //                     </Typography>
// // // // // //                   )}
// // // // // //                 </TableCell>
// // // // // //               </TableRow>
// // // // // //             ))}
// // // // // //           </TableBody>
// // // // // //         </Table>
// // // // // //       </TableContainer>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default FinanceForm;


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
// // // // // } from "@mui/material";
// // // // // import { PutObjectCommand } from "@aws-sdk/client-s3";
// // // // // import { useAuth } from "../../../../context/AuthContext";
// // // // // import { logActivity } from "./utils";
// // // // // import { s3Client } from "../../../../config/aws-config";

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
// // // // //   const [attachmentError, setAttachmentError] = useState({});

// // // // //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // // //   const region = import.meta.env.VITE_AWS_REGION;

// // // // //   // Debug environment variables
// // // // //   console.log("Environment Variables:", {
// // // // //     VITE_S3_BUCKET_NAME: bucketName,
// // // // //     VITE_AWS_REGION: region,
// // // // //     VITE_AWS_ACCESS_KEY_ID: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // // //     VITE_AWS_SECRET_ACCESS_KEY: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // // //   });

// // // // //   const handleFileChangeS3 = async (courseIndex, docType, event) => {
// // // // //     const file = event.target.files[0];
// // // // //     if (!file) {
// // // // //       setAttachmentError((prev) => ({ ...prev, [docType]: "No file selected" }));
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       // Validate S3 configuration
// // // // //       if (!bucketName || !region) {
// // // // //         throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // // // //       }
// // // // //       if (!s3Client.config.credentials) {
// // // // //         throw new Error("S3 client credentials not configured");
// // // // //       }

// // // // //       // Validate file type and size (optional, adjust as needed)
// // // // //       const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
// // // // //       if (!allowedTypes.includes(file.type)) {
// // // // //         throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
// // // // //       }
// // // // //       const maxSize = 10 * 1024 * 1024; // 10 MB limit
// // // // //       if (file.size > maxSize) {
// // // // //         throw new Error("File size exceeds 10 MB limit.");
// // // // //       }

// // // // //       // Create a unique key for the file
// // // // //       const key = `students/${studentId}/${courseIndex}/${docType}/${Date.now()}_${file.name}`;

// // // // //       // Log file details for debugging
// // // // //       console.log("Uploading file:", {
// // // // //         name: file.name,
// // // // //         type: file.type,
// // // // //         size: file.size,
// // // // //         key,
// // // // //       });

// // // // //       // Prepare S3 PutObject command
// // // // //       const command = new PutObjectCommand({
// // // // //         Bucket: bucketName,
// // // // //         Key: key,
// // // // //         Body: file, // Pass the File object directly (it’s a Blob)
// // // // //         ContentType: file.type,
// // // // //       });

// // // // //       // Upload to S3
// // // // //       await s3Client.send(command);

// // // // //       // Construct the S3 URL
// // // // //       const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

// // // // //       // Update financeDetails with the S3 URL and file name
// // // // //       handleFinanceChange(courseIndex, docType, "", s3Url);
// // // // //       handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);

// // // // //       // Log success
// // // // //       logActivity(
// // // // //         "UPLOAD_DOCUMENT_SUCCESS",
// // // // //         { studentId, courseIndex, docType, fileName: file.name, url: s3Url },
// // // // //         user
// // // // //       );

// // // // //       // Clear any previous error for this docType
// // // // //       setAttachmentError((prev) => ({ ...prev, [docType]: null }));
// // // // //     } catch (err) {
// // // // //       console.error(`Error uploading ${docType}:`, {
// // // // //         message: err.message,
// // // // //         name: err.name,
// // // // //         code: err.code,
// // // // //         stack: err.stack,
// // // // //       });
// // // // //       let errorMsg = `Failed to upload ${docType}: ${err.message}`;
// // // // //       if (err.name === "AccessDenied") {
// // // // //         errorMsg = "Access denied. Check S3 bucket permissions and IAM role.";
// // // // //       } else if (err.name === "NoSuchBucket") {
// // // // //         errorMsg = "S3 bucket not found. Verify the bucket name and region.";
// // // // //       } else if (err.message.includes("readableStream.getReader")) {
// // // // //         errorMsg = "File upload failed due to stream incompatibility. Ensure a valid file is selected.";
// // // // //       }
// // // // //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// // // // //       logActivity(
// // // // //         "UPLOAD_DOCUMENT_ERROR",
// // // // //         { studentId, courseIndex, docType, error: err.message },
// // // // //         user
// // // // //       );
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="space-y-4">
// // // // //       {Object.keys(attachmentError).length > 0 && (
// // // // //         <Typography color="error" variant="body2">
// // // // //           {Object.values(attachmentError).filter((err) => err).join("; ")}
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
// // // // //         <TextField
// // // // //           label="Applicant Number"
// // // // //           type="number"
// // // // //           value={financeDetails.applicant_number || 0}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(courseIndex, "applicant_number", "", e.target.value)
// // // // //           }
// // // // //           variant="outlined"
// // // // //           size="small"
// // // // //           fullWidth
// // // // //           disabled={!canUpdate}
// // // // //         />
// // // // //         <TextField
// // // // //           label="Invoice Number"
// // // // //           type="number"
// // // // //           value={financeDetails.invoice_number || 0}
// // // // //           onChange={(e) =>
// // // // //             handleFinanceChange(courseIndex, "invoice_number", "", e.target.value)
// // // // //           }
// // // // //           variant="outlined"
// // // // //           size="small"
// // // // //           fullWidth
// // // // //           disabled={!canUpdate}
// // // // //         />
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
// // // // //             </TableRow>
// // // // //           </TableHead>
// // // // //           <TableBody>
// // // // //             {[
// // // // //               { type: "photo", label: "Applicant Photo" },
// // // // //               { type: "bankStatement", label: "6 Months Bank Statement" },
// // // // //               { type: "paymentSlip", label: "Payment Slip" },
// // // // //               { type: "aadharCard", label: "Aadhar Card" },
// // // // //               { type: "panCard", label: "PAN Card" },
// // // // //               { type: "invoice", label: "Invoice" },
// // // // //               { type: "loan_agreement", label: "Loan Agreement" },
// // // // //               { type: "loan_delivery", label: "Loan Delivery Order" },
// // // // //             ].map((doc) => (
// // // // //               <TableRow key={doc.type}>
// // // // //                 <TableCell>{doc.label}</TableCell>
// // // // //                 <TableCell>
// // // // //                   <input
// // // // //                     type="file"
// // // // //                     accept="application/pdf,image/jpeg,image/png"
// // // // //                     onChange={(e) => handleFileChangeS3(courseIndex, doc.type, e)}
// // // // //                     className="mt-1"
// // // // //                     disabled={!canUpdate}
// // // // //                   />
// // // // //                   {attachmentError[doc.type] && (
// // // // //                     <Typography color="error" variant="body2" className="mt-1">
// // // // //                       {attachmentError[doc.type]}
// // // // //                     </Typography>
// // // // //                   )}
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
// // // // } from "@mui/material";
// // // // import { PutObjectCommand } from "@aws-sdk/client-s3";
// // // // import { useAuth } from "../../../../context/AuthContext";
// // // // import { logActivity } from "./utils";
// // // // import { s3Client } from "../../../../config/aws-config";

// // // // const FinanceForm = ({
// // // //   courseIndex,
// // // //   fullFeesDetails,
// // // //   financeDetails,
// // // //   handleFinanceChange,
// // // //   financePartners,
// // // //   canUpdate,
// // // //   user,
// // // //   studentId,
// // // // }) => {
// // // //   const { user: authUser } = useAuth();
// // // //   const [attachmentError, setAttachmentError] = useState({});

// // // //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // // //   const region = import.meta.env.VITE_AWS_REGION;

// // // //   // Debug environment variables
// // // //   console.log("Environment Variables:", {
// // // //     VITE_S3_BUCKET_NAME: bucketName,
// // // //     VITE_AWS_REGION: region,
// // // //     VITE_AWS_ACCESS_KEY_ID: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // // //     VITE_AWS_SECRET_ACCESS_KEY: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // // //   });

// // // //   const handleFileChangeS3 = async (courseIndex, docType, event) => {
// // // //     const file = event.target.files[0];
    
// // // //     // Validate file
// // // //     if (!file) {
// // // //       setAttachmentError((prev) => ({ ...prev, [docType]: "No file selected" }));
// // // //       return;
// // // //     }
// // // //     if (!(file instanceof File)) {
// // // //       setAttachmentError((prev) => ({ ...prev, [docType]: "Invalid file object. Please select a valid file." }));
// // // //       return;
// // // //     }

// // // //     try {
// // // //       // Validate S3 configuration
// // // //       if (!bucketName || !region) {
// // // //         throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // // //       }
// // // //       if (!s3Client.config.credentials) {
// // // //         throw new Error("S3 client credentials not configured");
// // // //       }

// // // //       // Validate file type and size
// // // //       const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
// // // //       if (!allowedTypes.includes(file.type)) {
// // // //         throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
// // // //       }
// // // //       const maxSize = 10 * 1024 * 1024; // 10 MB limit
// // // //       if (file.size > maxSize) {
// // // //         throw new Error("File size exceeds 10 MB limit.");
// // // //       }

// // // //       // Log file details for debugging
// // // //       console.log("File details:", {
// // // //         name: file.name,
// // // //         type: file.type,
// // // //         size: file.size,
// // // //         isFile: file instanceof File,
// // // //         isBlob: file instanceof Blob,
// // // //       });

// // // //       // Create a unique key for the file
// // // //       const key = `students/${studentId}/${courseIndex}/${docType}/${Date.now()}_${file.name}`;

// // // //       // Convert file to ArrayBuffer to avoid stream issues
// // // //       const arrayBuffer = await file.arrayBuffer();

// // // //       // Prepare S3 PutObject command
// // // //       const command = new PutObjectCommand({
// // // //         Bucket: bucketName,
// // // //         Key: key,
// // // //         Body: arrayBuffer, // Use ArrayBuffer instead of File
// // // //         ContentType: file.type,
// // // //       });

// // // //       // Log S3 command details
// // // //       console.log("S3 PutObject command:", { Bucket: bucketName, Key: key, ContentType: file.type });

// // // //       // Upload to S3
// // // //       await s3Client.send(command);

// // // //       // Construct the S3 URL
// // // //       const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

// // // //       // Update financeDetails with the S3 URL and file name
// // // //       handleFinanceChange(courseIndex, docType, "", s3Url);
// // // //       handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);

// // // //       // Log success
// // // //       logActivity(
// // // //         "UPLOAD_DOCUMENT_SUCCESS",
// // // //         { studentId, courseIndex, docType, fileName: file.name, url: s3Url },
// // // //         user
// // // //       );

// // // //       // Clear any previous error for this docType
// // // //       setAttachmentError((prev) => ({ ...prev, [docType]: null }));
// // // //     } catch (err) {
// // // //       console.error(`Error uploading ${docType}:`, {
// // // //         message: err.message,
// // // //         name: err.name,
// // // //         code: err.code,
// // // //         stack: err.stack,
// // // //       });
// // // //       let errorMsg = `Failed to upload ${docType}: ${err.message}`;
// // // //       if (err.name === "AccessDenied") {
// // // //         errorMsg = "Access denied. Check S3 bucket permissions and IAM role.";
// // // //       } else if (err.name === "NoSuchBucket") {
// // // //         errorMsg = "S3 bucket not found. Verify the bucket name and region.";
// // // //       } else if (err.message.includes("readableStream.getReader")) {
// // // //         errorMsg = "File upload failed due to stream incompatibility. Ensure a valid file is selected.";
// // // //       }
// // // //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// // // //       logActivity(
// // // //         "UPLOAD_DOCUMENT_ERROR",
// // // //         { studentId, courseIndex, docType, error: err.message },
// // // //         user
// // // //       );
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="space-y-4">
// // // //       {Object.keys(attachmentError).length > 0 && (
// // // //         <Typography color="error" variant="body2">
// // // //           {Object.values(attachmentError).filter((err) => err).join("; ")}
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
// // // //         <TextField
// // // //           label="Applicant Number"
// // // //           type="number"
// // // //           value={financeDetails.applicant_number || 0}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(courseIndex, "applicant_number", "", e.target.value)
// // // //           }
// // // //           variant="outlined"
// // // //           size="small"
// // // //           fullWidth
// // // //           disabled={!canUpdate}
// // // //         />
// // // //         <TextField
// // // //           label="Invoice Number"
// // // //           type="number"
// // // //           value={financeDetails.invoice_number || 0}
// // // //           onChange={(e) =>
// // // //             handleFinanceChange(courseIndex, "invoice_number", "", e.target.value)
// // // //           }
// // // //           variant="outlined"
// // // //           size="small"
// // // //           fullWidth
// // // //           disabled={!canUpdate}
// // // //         />
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
// // // //             </TableRow>
// // // //           </TableHead>
// // // //           <TableBody>
// // // //             {[
// // // //               { type: "photo", label: "Applicant Photo" },
// // // //               { type: "bankStatement", label: "6 Months Bank Statement" },
// // // //               { type: "paymentSlip", label: "Payment Slip" },
// // // //               { type: "aadharCard", label: "Aadhar Card" },
// // // //               { type: "panCard", label: "PAN Card" },
// // // //               { type: "invoice", label: "Invoice" },
// // // //               { type: "loan_agreement", label: "Loan Agreement" },
// // // //               { type: "loan_delivery", label: "Loan Delivery Order" },
// // // //             ].map((doc) => (
// // // //               <TableRow key={doc.type}>
// // // //                 <TableCell>{doc.label}</TableCell>
// // // //                 <TableCell>
// // // //                   <input
// // // //                     type="file"
// // // //                     accept="application/pdf,image/jpeg,image/png"
// // // //                     onChange={(e) => handleFileChangeS3(courseIndex, doc.type, e)}
// // // //                     className="mt-1"
// // // //                     disabled={!canUpdate}
// // // //                   />
// // // //                   {attachmentError[doc.type] && (
// // // //                     <Typography color="error" variant="body2" className="mt-1">
// // // //                       {attachmentError[doc.type]}
// // // //                     </Typography>
// // // //                   )}
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
// // // } from "@mui/material";
// // // import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// // // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// // // import { useAuth } from "../../../../context/AuthContext";
// // // import { logActivity } from "./utils";
// // // import { s3Client } from "../../../../config/aws-config";

// // // const FinanceForm = ({
// // //   courseIndex,
// // //   fullFeesDetails,
// // //   financeDetails,
// // //   handleFinanceChange,
// // //   financePartners,
// // //   canUpdate,
// // //   user,
// // //   studentId,
// // // }) => {
// // //   const { user: authUser } = useAuth();
// // //   const [attachmentError, setAttachmentError] = useState({});

// // //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// // //   const region = import.meta.env.VITE_AWS_REGION;

// // //   // Debug environment variables
// // //   console.log("Environment Variables:", {
// // //     VITE_S3_BUCKET_NAME: bucketName,
// // //     VITE_AWS_REGION: region,
// // //     VITE_AWS_ACCESS_KEY_ID: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// // //     VITE_AWS_SECRET_ACCESS_KEY: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// // //   });

// // //   const handleFileChangeS3 = async (courseIndex, docType, event) => {
// // //     const file = event.target.files[0];
    
// // //     // Clear previous error
// // //     setAttachmentError((prev) => ({ ...prev, [docType]: null }));

// // //     // Validate file
// // //     if (!file) {
// // //       return; // User cancelled file selection
// // //     }
    
// // //     if (!(file instanceof File)) {
// // //       setAttachmentError((prev) => ({ ...prev, [docType]: "Invalid file object. Please select a valid file." }));
// // //       return;
// // //     }

// // //     try {
// // //       // Validate S3 configuration
// // //       if (!bucketName || !region) {
// // //         throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // //       }
// // //       if (!s3Client.config.credentials) {
// // //         throw new Error("S3 client credentials not configured");
// // //       }

// // //       // Validate file type and size
// // //       const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
// // //       if (!allowedTypes.includes(file.type)) {
// // //         throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
// // //       }
// // //       const maxSize = 10 * 1024 * 1024; // 10 MB limit
// // //       if (file.size > maxSize) {
// // //         throw new Error("File size exceeds 10 MB limit.");
// // //       }

// // //       // Create a unique key for the file
// // //       const key = `students/${studentId}/${courseIndex}/${docType}/${Date.now()}_${file.name}`;

// // //       // Convert file to ArrayBuffer
// // //       const arrayBuffer = await file.arrayBuffer();

// // //       // Prepare S3 PutObject command
// // //       const command = new PutObjectCommand({
// // //         Bucket: bucketName,
// // //         Key: key,
// // //         Body: arrayBuffer,
// // //         ContentType: file.type,
// // //       });

// // //       // Upload to S3
// // //       await s3Client.send(command);

// // //       // Construct the S3 URL
// // //       const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

// // //       // Update financeDetails with the new S3 URL and file name
// // //       handleFinanceChange(courseIndex, docType, "", s3Url);
// // //       handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);

// // //       // Log success
// // //       logActivity(
// // //         "UPLOAD_DOCUMENT_SUCCESS",
// // //         { studentId, courseIndex, docType, fileName: file.name, url: s3Url },
// // //         user
// // //       );

// // //     } catch (err) {
// // //       console.error(`Error uploading ${docType}:`, err);
// // //       let errorMsg = `Failed to upload ${docType}: ${err.message}`;
// // //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// // //       logActivity(
// // //         "UPLOAD_DOCUMENT_ERROR",
// // //         { studentId, courseIndex, docType, error: err.message },
// // //         user
// // //       );
// // //     }
// // //   };

// // //   const viewDocument = async (s3Url, docType) => {
// // //     try {
// // //       console.log("Attempting to view document:", { s3Url, docType }); // Debug log
      
// // //       if (!s3Url || typeof s3Url !== "string") {
// // //         throw new Error(`No valid ${docType} URL provided`);
// // //       }
// // //       if (!bucketName || !region) {
// // //         throw new Error("Missing S3 configuration");
// // //       }
// // //       if (!s3Client.config.credentials) {
// // //         throw new Error("S3 client credentials not configured");
// // //       }
  
// // //       // More flexible URL parsing
// // //       let key;
// // //       try {
// // //         const url = new URL(s3Url);
// // //         key = url.pathname.substring(1); // Remove leading slash
        
// // //         // Handle encoded characters
// // //         key = decodeURIComponent(key);
        
// // //         console.log("Extracted key:", key); // Debug log
// // //       } catch (urlError) {
// // //         console.error("URL parsing error:", urlError);
// // //         // Fallback to regex if URL parsing fails
// // //         const urlPatterns = [
// // //           new RegExp(`https?://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
// // //           new RegExp(`https?://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`),
// // //           new RegExp(`https?://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
// // //         ];
        
// // //         for (const pattern of urlPatterns) {
// // //           const match = s3Url.match(pattern);
// // //           if (match && match[1]) {
// // //             key = decodeURIComponent(match[1]);
// // //             break;
// // //           }
// // //         }
// // //       }
  
// // //       if (!key) {
// // //         throw new Error(`Could not extract key from URL: ${s3Url}`);
// // //       }
  
// // //       console.log("Using key:", key); // Debug log
      
// // //       const command = new GetObjectCommand({
// // //         Bucket: bucketName,
// // //         Key: key,
// // //         ResponseContentDisposition: 'inline', // Try to display in browser
// // //       });
  
// // //       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// // //       console.log("Generated signed URL:", url); // Debug log
      
// // //       window.open(url, "_blank");
// // //       logActivity("VIEW_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, url }, user);
// // //     } catch (err) {
// // //       console.error("Error viewing document:", {
// // //         error: err,
// // //         message: err.message,
// // //         stack: err.stack,
// // //         url: s3Url,
// // //       });
      
// // //       let errorMsg = `Failed to view ${docType}: ${err.message}`;
// // //       if (err.name === "AccessDenied") {
// // //         errorMsg = "Access denied. Check S3 permissions.";
// // //       } else if (err.name === "NoSuchKey") {
// // //         errorMsg = "File not found in S3.";
// // //       }
      
// // //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// // //       logActivity("VIEW_DOCUMENT_ERROR", { 
// // //         studentId, 
// // //         courseIndex, 
// // //         docType, 
// // //         error: err.message,
// // //         url: s3Url 
// // //       }, user);
// // //     }
// // //   };
  
// // //   // const viewDocument = async (s3Url, docType) => {
// // //   //   try {
// // //   //     if (!s3Url || typeof s3Url !== "string") {
// // //   //       throw new Error(`No valid ${docType} URL provided`);
// // //   //     }
// // //   //     if (!bucketName || !region) {
// // //   //       throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// // //   //     }
// // //   //     if (!s3Client.config.credentials) {
// // //   //       throw new Error("S3 client credentials not configured");
// // //   //     }
// // //   //     let key;
// // //   //     const urlPatterns = [
// // //   //       new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
// // //   //       new RegExp(`https://${bucketName}\\.s3\\-accelerated\\.${region}\\.amazonaws\\.com/(.+)`),
// // //   //       new RegExp(`https://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
// // //   //       new RegExp(`https://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`),
// // //   //     ];
// // //   //     for (const pattern of urlPatterns) {
// // //   //       const match = s3Url.match(pattern);
// // //   //       if (match && match[1]) {
// // //   //         key = decodeURIComponent(match[1]);
// // //   //         break;
// // //   //       }
// // //   //     }
// // //   //     if (!key) {
// // //   //       throw new Error(`Invalid ${docType} URL: Could not extract S3 key. URL: ${s3Url}`);
// // //   //     }
// // //   //     const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
// // //   //     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// // //   //     window.open(url, "_blank");
// // //   //     logActivity("VIEW_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, url }, user);
// // //   //   } catch (err) {
// // //   //     let errorMsg = `Failed to view ${docType}: ${err.message}`;
// // //   //     if (err.name === "AccessDenied") {
// // //   //       errorMsg = `Access denied. Check S3 bucket permissions and IAM role.`;
// // //   //     } else if (err.name === "NoSuchKey") {
// // //   //       errorMsg = `File not found in S3. It may have been deleted or the URL is incorrect.`;
// // //   //     } else if (err.message.includes("Failed to fetch")) {
// // //   //       errorMsg = `Network or CORS issue. Check S3 CORS settings.`;
// // //   //     }
// // //   //     setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// // //   //     logActivity("VIEW_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message, url: s3Url }, user);
// // //   //   }
// // //   // };

// // //   return (
// // //     <div className="space-y-4">
// // //       {Object.keys(attachmentError).length > 0 && (
// // //         <Typography color="error" variant="body2">
// // //           {Object.values(attachmentError).filter((err) => err).join("; ")}
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
// // //         <TextField
// // //           label="Applicant Number"
// // //           type="number"
// // //           value={financeDetails.applicant_number || 0}
// // //           onChange={(e) =>
// // //             handleFinanceChange(courseIndex, "applicant_number", "", e.target.value)
// // //           }
// // //           variant="outlined"
// // //           size="small"
// // //           fullWidth
// // //           disabled={!canUpdate}
// // //         />
// // //         <TextField
// // //           label="Invoice Number"
// // //           type="number"
// // //           value={financeDetails.invoice_number || 0}
// // //           onChange={(e) =>
// // //             handleFinanceChange(courseIndex, "invoice_number", "", e.target.value)
// // //           }
// // //           variant="outlined"
// // //           size="small"
// // //           fullWidth
// // //           disabled={!canUpdate}
// // //         />
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
// // //             </TableRow>
// // //           </TableHead>
// // //           <TableBody>
// // //             {[
// // //               { type: "photo", label: "Applicant Photo" },
// // //               { type: "bankStatement", label: "6 Months Bank Statement" },
// // //               { type: "paymentSlip", label: "Payment Slip" },
// // //               { type: "aadharCard", label: "Aadhar Card" },
// // //               { type: "panCard", label: "PAN Card" },
// // //               { type: "invoice", label: "Invoice" },
// // //               { type: "loan_agreement", label: "Loan Agreement" },
// // //               { type: "loan_delivery", label: "Loan Delivery Order" },
// // //           ].map((doc) => (
// // //             <TableRow key={doc.type}>
// // //               <TableCell>{doc.label}</TableCell>
// // //               <TableCell>
// // //                 <div className="flex items-center gap-2">
// // //                   {financeDetails[doc.type] && financeDetails[`${doc.type}Name`] ? (
// // //                     <>
// // //                       <Typography
// // //                         component="a"
// // //                         href="#"
// // //                         onClick={(e) => {
// // //                           e.preventDefault();
// // //                           viewDocument(financeDetails[doc.type], doc.label);
// // //                         }}
// // //                         className="text-blue-600 hover:underline"
// // //                         variant="body2"
// // //                       >
// // //                         {financeDetails[`${doc.type}Name`]}
// // //                       </Typography>
// // //                       <span className="text-gray-500">|</span>
// // //                     </>
// // //                   ) : null}
// // //                   <label className="cursor-pointer">
// // //                     <span className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
// // //                       {financeDetails[doc.type] ? "Replace" : "Upload"}
// // //                     </span>
// // //                     <input
// // //                       type="file"
// // //                       accept="application/pdf,image/jpeg,image/png"
// // //                       onChange={(e) => handleFileChangeS3(courseIndex, doc.type, e)}
// // //                       className="hidden"
// // //                       disabled={!canUpdate}
// // //                     />
// // //                   </label>
// // //                 </div>
// // //                 {attachmentError[doc.type] && (
// // //                   <Typography color="error" variant="body2" className="mt-1">
// // //                     {attachmentError[doc.type]}
// // //                   </Typography>
// // //                 )}
// // //               </TableCell>
// // //             </TableRow>
// // //           ))}
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
// // } from "@mui/material";
// // import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// // import { useAuth } from "../../../../context/AuthContext";
// // import { logActivity } from "./utils";
// // import { s3Client } from "../../../../config/aws-config";

// // const FinanceForm = ({
// //   courseIndex,
// //   fullFeesDetails,
// //   financeDetails,
// //   handleFinanceChange,
// //   financePartners,
// //   canUpdate,
// //   user,
// //   studentId,
// // }) => {
// //   const { user: authUser } = useAuth();
// //   const [attachmentError, setAttachmentError] = useState({});

// //   const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
// //   const region = import.meta.env.VITE_AWS_REGION;

// //   // Debug environment variables
// //   console.log("Environment Variables:", {
// //     VITE_S3_BUCKET_NAME: bucketName,
// //     VITE_AWS_REGION: region,
// //     VITE_AWS_ACCESS_KEY_ID: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
// //     VITE_AWS_SECRET_ACCESS_KEY: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
// //   });

// //   // Debug financeDetails
// //   console.log("FinanceDetails:", financeDetails);

// //   const handleFileChangeS3 = async (courseIndex, docType, event) => {
// //     const file = event.target.files[0];

// //     // Clear previous error
// //     setAttachmentError((prev) => ({ ...prev, [docType]: null }));

// //     // Validate file
// //     if (!file) {
// //       console.log("File selection cancelled");
// //       return; // User cancelled file selection
// //     }

// //     if (!(file instanceof File)) {
// //       setAttachmentError((prev) => ({
// //         ...prev,
// //         [docType]: "Invalid file object. Please select a valid file.",
// //       }));
// //       return;
// //     }

// //     try {
// //       // Validate S3 configuration
// //       if (!bucketName || !region) {
// //         throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
// //       }
// //       if (!s3Client.config.credentials) {
// //         throw new Error("S3 client credentials not configured");
// //       }

// //       // Validate file type and size
// //       const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
// //       if (!allowedTypes.includes(file.type)) {
// //         throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
// //       }
// //       const maxSize = 10 * 1024 * 1024; // 10 MB limit
// //       if (file.size > maxSize) {
// //         throw new Error("File size exceeds 10 MB limit.");
// //       }

// //       // Create a unique key for the file
// //       const key = `students/${studentId}/${courseIndex}/${docType}/${Date.now()}_${file.name}`;

// //       // Convert file to ArrayBuffer
// //       const arrayBuffer = await file.arrayBuffer();

// //       // Prepare S3 PutObject command
// //       const command = new PutObjectCommand({
// //         Bucket: bucketName,
// //         Key: key,
// //         Body: arrayBuffer,
// //         ContentType: file.type,
// //       });

// //       // Upload to S3
// //       await s3Client.send(command);

// //       // Construct the S3 URL
// //       const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

// //       // Update financeDetails with the new S3 URL and file name
// //       console.log("Updating financeDetails:", { docType, s3Url, fileName: file.name });
// //       handleFinanceChange(courseIndex, docType, "", s3Url);
// //       handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);

// //       // Log success
// //       logActivity(
// //         "UPLOAD_DOCUMENT_SUCCESS",
// //         { studentId, courseIndex, docType, fileName: file.name, url: s3Url },
// //         user
// //       );
// //     } catch (err) {
// //       console.error(`Error uploading ${docType}:`, err);
// //       let errorMsg = `Failed to upload ${docType}: ${err.message}`;
// //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// //       logActivity(
// //         "UPLOAD_DOCUMENT_ERROR",
// //         { studentId, courseIndex, docType, error: err.message },
// //         user
// //       );
// //     }
// //   };

// //   const viewDocument = async (s3Url, docType) => {
// //     try {
// //       console.log("Attempting to view document:", { s3Url, docType });

// //       if (!s3Url || typeof s3Url !== "string") {
// //         throw new Error(`No valid ${docType} URL provided`);
// //       }
// //       if (!bucketName || !region) {
// //         throw new Error("Missing S3 configuration");
// //       }
// //       if (!s3Client.config.credentials) {
// //         throw new Error("S3 client credentials not configured");
// //       }

// //       let key;
// //       try {
// //         const url = new URL(s3Url);
// //         key = url.pathname.substring(1); // Remove leading slash
// //         key = decodeURIComponent(key);
// //         console.log("Extracted key:", key);
// //       } catch (urlError) {
// //         console.error("URL parsing error:", urlError);
// //         const urlPatterns = [
// //           new RegExp(`https?://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
// //           new RegExp(`https?://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`),
// //           new RegExp(`https?://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
// //         ];

// //         for (const pattern of urlPatterns) {
// //           const match = s3Url.match(pattern);
// //           if (match && match[1]) {
// //             key = decodeURIComponent(match[1]);
// //             break;
// //           }
// //         }
// //       }

// //       if (!key) {
// //         throw new Error(`Could not extract key from URL: ${s3Url}`);
// //       }

// //       const command = new GetObjectCommand({
// //         Bucket: bucketName,
// //         Key: key,
// //         ResponseContentDisposition: "inline", // Try to display in browser
// //       });

// //       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// //       console.log("Generated signed URL:", url);

// //       window.open(url, "_blank");
// //       logActivity("VIEW_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, url }, user);
// //     } catch (err) {
// //       console.error("Error viewing document:", {
// //         error: err,
// //         message: err.message,
// //         stack: err.stack,
// //         url: s3Url,
// //       });

// //       let errorMsg = `Failed to view ${docType}: ${err.message}`;
// //       if (err.name === "AccessDenied") {
// //         errorMsg = "Access denied. Check S3 permissions.";
// //       } else if (err.name === "NoSuchKey") {
// //         errorMsg = "File not found in S3.";
// //       }

// //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// //       logActivity("VIEW_DOCUMENT_ERROR", {
// //         studentId,
// //         courseIndex,
// //         docType,
// //         error: err.message,
// //         url: s3Url,
// //       }, user);
// //     }
// //   };

// //   const removeDocument = async (courseIndex, docType, s3Url) => {
// //     try {
// //       // Clear document from financeDetails
// //       console.log("Removing document:", { docType, s3Url });
// //       handleFinanceChange(courseIndex, docType, "", "");
// //       handleFinanceChange(courseIndex, `${docType}Name`, "", "");

// //       // Optionally delete from S3
// //       if (s3Url && typeof s3Url === "string") {
// //         if (!bucketName || !region) {
// //           throw new Error("Missing S3 configuration");
// //         }
// //         if (!s3Client.config.credentials) {
// //           throw new Error("S3 client credentials not configured");
// //         }
// //         let key;
// //         try {
// //           const url = new URL(s3Url);
// //           key = url.pathname.substring(1);
// //           key = decodeURIComponent(key);
// //         } catch (urlError) {
// //           const urlPatterns = [
// //             new RegExp(`https?://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
// //             new RegExp(`https?://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`),
// //             new RegExp(`https?://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
// //           ];
// //           for (const pattern of urlPatterns) {
// //             const match = s3Url.match(pattern);
// //             if (match && match[1]) {
// //               key = decodeURIComponent(match[1]);
// //               break;
// //             }
// //           }
// //         }
// //         if (key) {
// //           const command = new DeleteObjectCommand({
// //             Bucket: bucketName,
// //             Key: key,
// //           });
// //           await s3Client.send(command);
// //           logActivity(
// //             "DELETE_DOCUMENT_SUCCESS",
// //             { studentId, courseIndex, docType, key },
// //             user
// //           );
// //         }
// //       }

// //       // Clear any errors
// //       setAttachmentError((prev) => ({ ...prev, [docType]: null }));
// //     } catch (err) {
// //       console.error(`Error removing ${docType}:`, err);
// //       let errorMsg = `Failed to remove ${docType}: ${err.message}`;
// //       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
// //       logActivity(
// //         "DELETE_DOCUMENT_ERROR",
// //         { studentId, courseIndex, docType, error: err.message },
// //         user
// //       );
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {Object.keys(attachmentError).length > 0 && (
// //         <Typography color="error" variant="body2">
// //           {Object.values(attachmentError).filter((err) => err).join("; ")}
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
// //         <TextField
// //           label="Applicant Number"
// //           type="number"
// //           value={financeDetails.applicant_number || 0}
// //           onChange={(e) =>
// //             handleFinanceChange(
// //               courseIndex,
// //               "applicant_number",
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
// //           label="Invoice Number"
// //           type="number"
// //           value={financeDetails.invoice_number || 0}
// //           onChange={(e) =>
// //             handleFinanceChange(
// //               courseIndex,
// //               "invoice_number",
// //               "",
// //               e.target.value
// //             )
// //           }
// //           variant="outlined"
// //           size="small"
// //           fullWidth
// //           disabled={!canUpdate}
// //         />
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
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {[
// //               { type: "photo", label: "Applicant Photo" },
// //               { type: "bankStatement", label: "6 Months Bank Statement" },
// //               { type: "paymentSlip", label: "Payment Slip" },
// //               { type: "aadharCard", label: "Aadhar Card" },
// //               { type: "panCard", label: "PAN Card" },
// //               { type: "invoice", label: "Invoice" },
// //               { type: "loan_agreement", label: "Loan Agreement" },
// //               { type: "loan_delivery", label: "Loan Delivery Order" },
// //             ].map((doc) => (
// //               <TableRow key={doc.type}>
// //                 <TableCell>{doc.label}</TableCell>
// //                 <TableCell>
// //                   <div className="flex items-center gap-2">
// //                     {financeDetails[doc.type] && financeDetails[`${doc.type}Name`] ? (
// //                       <>
// //                         <Typography
// //                           component="a"
// //                           href="#"
// //                           onClick={(e) => {
// //                             e.preventDefault();
// //                             viewDocument(financeDetails[doc.type], doc.label);
// //                           }}
// //                           className="text-blue-600 hover:underline"
// //                           variant="body2"
// //                         >
// //                           {financeDetails[`${doc.type}Name`]}
// //                         </Typography>
// //                         <span className="text-gray-500">|</span>
// //                       </>
// //                     ) : (
// //                       <Typography variant="body2" color="textSecondary">
// //                         No file uploaded
// //                       </Typography>
// //                     )}
// //                     <label className="cursor-pointer">
// //                       <span className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
// //                         {financeDetails[doc.type] ? "Replace" : "Upload"}
// //                       </span>
// //                       <input
// //                         type="file"
// //                         accept="application/pdf,image/jpeg,image/png"
// //                         onChange={(e) => handleFileChangeS3(courseIndex, doc.type, e)}
// //                         className="hidden"
// //                         disabled={!canUpdate}
// //                       />
// //                     </label>
// //                     {financeDetails[doc.type] && financeDetails[`${doc.type}Name`] ? (
// //                       <>
// //                         <span className="text-gray-500">|</span>
// //                         <Button
// //                           variant="contained"
// //                           color="error"
// //                           size="small"
// //                           onClick={() =>
// //                             removeDocument(courseIndex, doc.type, financeDetails[doc.type])
// //                           }
// //                           disabled={!canUpdate}
// //                         >
// //                           Remove
// //                         </Button>
// //                       </>
// //                     ) : null}
// //                   </div>
// //                   {attachmentError[doc.type] && (
// //                     <Typography color="error" variant="body2" className="mt-1">
// //                       {attachmentError[doc.type]}
// //                     </Typography>
// //                   )}
// //                 </TableCell>
// //               </TableRow>
// //             ))}
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
// } from "@mui/material";
// import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { useAuth } from "../../../../context/AuthContext";
// import { logActivity } from "./utils";
// import { s3Client } from "../../../../config/aws-config";

// const FinanceForm = ({
//   courseIndex,
//   fullFeesDetails,
//   financeDetails,
//   handleFinanceChange,
//   financePartners,
//   canUpdate,
//   user,
//   studentId,
// }) => {
//   const { user: authUser } = useAuth();
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

//   // Debug financeDetails
//   console.log("FinanceDetails:", financeDetails);

//   const handleFileChangeS3 = async (courseIndex, docType, event) => {
//     const file = event.target.files[0];

//     // Clear previous error
//     setAttachmentError((prev) => ({ ...prev, [docType]: null }));

//     // Validate file
//     if (!file) {
//       console.log("File selection cancelled");
//       return; // User cancelled file selection
//     }

//     if (!(file instanceof File)) {
//       setAttachmentError((prev) => ({
//         ...prev,
//         [docType]: "Invalid file object. Please select a valid file.",
//       }));
//       return;
//     }

//     try {
//       // Validate S3 configuration
//       if (!bucketName || !region) {
//         throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
//       }
//       if (!s3Client.config.credentials) {
//         throw new Error("S3 client credentials not configured");
//       }

//       // Validate file type and size
//       const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//       if (!allowedTypes.includes(file.type)) {
//         throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
//       }
//       const maxSize = 10 * 1024 * 1024; // 10 MB limit
//       if (file.size > maxSize) {
//         throw new Error("File size exceeds 10 MB limit.");
//       }

//       // Create a unique key for the file
//       const key = `students/${studentId}/${docType}_${file.name}`;

//       // Convert file to ArrayBuffer
//       const arrayBuffer = await file.arrayBuffer();

//       // Prepare S3 PutObject command
//       const command = new PutObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//         Body: arrayBuffer,
//         ContentType: file.type,
//       });

//       // Upload to S3
//       await s3Client.send(command);

//       // Construct the S3 URL
//       const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

//       // Update financeDetails with the new S3 URL and file name
//       console.log("Updating financeDetails:", { docType, s3Url, fileName: file.name });
//       handleFinanceChange(courseIndex, docType, "", s3Url);
//       handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);

//       // Log success
//       logActivity(
//         "UPLOAD_DOCUMENT_SUCCESS",
//         { studentId, courseIndex, docType, fileName: file.name, url: s3Url },
//         user
//       );
//     } catch (err) {
//       console.error(`Error uploading ${docType}:`, err);
//       let errorMsg = `Failed to upload ${docType}: ${err.message}`;
//       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
//       logActivity(
//         "UPLOAD_DOCUMENT_ERROR",
//         { studentId, courseIndex, docType, error: err.message },
//         user
//       );
//     }
//   };

//   const viewDocument = async (s3Url, docType) => {
//     try {
//       console.log("Attempting to view document:", { s3Url, docType });

//       if (!s3Url || typeof s3Url !== "string") {
//         throw new Error(`No valid ${docType} URL provided`);
//       }
//       if (!bucketName || !region) {
//         throw new Error("Missing S3 configuration");
//       }
//       if (!s3Client.config.credentials) {
//         throw new Error("S3 client credentials not configured");
//       }

//       let key;
//       try {
//         const url = new URL(s3Url);
//         key = url.pathname.substring(1); // Remove leading slash
//         key = decodeURIComponent(key);
//         console.log("Extracted key:", key);
//       } catch (urlError) {
//         console.error("URL parsing error:", urlError);
//         const urlPatterns = [
//           new RegExp(`https?://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
//           new RegExp(`https?://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`),
//           new RegExp(`https?://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
//         ];

//         for (const pattern of urlPatterns) {
//           const match = s3Url.match(pattern);
//           if (match && match[1]) {
//             key = decodeURIComponent(match[1]);
//             break;
//           }
//         }
//       }

//       if (!key) {
//         throw new Error(`Could not extract key from URL: ${s3Url}`);
//       }

//       const command = new GetObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//         ResponseContentDisposition: "inline", // Try to display in browser
//       });

//       const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//       console.log("Generated signed URL:", url);

//       window.open(url, "_blank");
//       logActivity("VIEW_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, url }, user);
//     } catch (err) {
//       console.error("Error viewing document:", {
//         error: err,
//         message: err.message,
//         stack: err.stack,
//         url: s3Url,
//       });

//       let errorMsg = `Failed to view ${docType}: ${err.message}`;
//       if (err.name === "AccessDenied") {
//         errorMsg = "Access denied. Check S3 permissions.";
//       } else if (err.name === "NoSuchKey") {
//         errorMsg = "File not found in S3.";
//       }

//       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
//       logActivity("VIEW_DOCUMENT_ERROR", {
//         studentId,
//         courseIndex,
//         docType,
//         error: err.message,
//         url: s3Url,
//       }, user);
//     }
//   };

//   const removeDocument = async (courseIndex, docType, s3Url) => {
//     try {
//       // Clear document from financeDetails
//       console.log("Removing document:", { docType, s3Url });
//       handleFinanceChange(courseIndex, docType, "", "");
//       handleFinanceChange(courseIndex, `${docType}Name`, "", "");

//       // Optionally delete from S3
//       if (s3Url && typeof s3Url === "string") {
//         if (!bucketName || !region) {
//           throw new Error("Missing S3 configuration");
//         }
//         if (!s3Client.config.credentials) {
//           throw new Error("S3 client credentials not configured");
//         }
//         let key;
//         try {
//           const url = new URL(s3Url);
//           key = url.pathname.substring(1);
//           key = decodeURIComponent(key);
//         } catch (urlError) {
//           const urlPatterns = [
//             new RegExp(`https?://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
//             new RegExp(`https?://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`),
//             new RegExp(`https?://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
//           ];
//           for (const pattern of urlPatterns) {
//             const match = s3Url.match(pattern);
//             if (match && match[1]) {
//               key = decodeURIComponent(match[1]);
//               break;
//             }
//           }
//         }
//         if (key) {
//           const command = new DeleteObjectCommand({
//             Bucket: bucketName,
//             Key: key,
//           });
//           await s3Client.send(command);
//           logActivity(
//             "DELETE_DOCUMENT_SUCCESS",
//             { studentId, courseIndex, docType, key },
//             user
//           );
//         }
//       }

//       // Clear any errors
//       setAttachmentError((prev) => ({ ...prev, [docType]: null }));
//     } catch (err) {
//       console.error(`Error removing ${docType}:`, err);
//       let errorMsg = `Failed to remove ${docType}: ${err.message}`;
//       setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
//       logActivity(
//         "DELETE_DOCUMENT_ERROR",
//         { studentId, courseIndex, docType, error: err.message },
//         user
//       );
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {Object.keys(attachmentError).length > 0 && (
//         <Typography color="error" variant="body2">
//           {Object.values(attachmentError).filter((err) => err).join("; ")}
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
//         <TextField
//           label="Applicant Number"
//           type="number"
//           value={financeDetails.applicant_number || 0}
//           onChange={(e) =>
//             handleFinanceChange(
//               courseIndex,
//               "applicant_number",
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
//           label="Invoice Number"
//           type="number"
//           value={financeDetails.invoice_number || 0}
//           onChange={(e) =>
//             handleFinanceChange(
//               courseIndex,
//               "invoice_number",
//               "",
//               e.target.value
//             )
//           }
//           variant="outlined"
//           size="small"
//           fullWidth
//           disabled={!canUpdate}
//         />
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
//               <TableCell className="text-gray-800 font-medium min-w-40">
//                 File
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
//               { type: "invoice", label: "Invoice" },
//               { type: "loan_agreement", label: "Loan Agreement" },
//               { type: "loan_delivery", label: "Loan Delivery Order" },
//             ].map((doc) => (
//               <TableRow key={doc.type}>
//                 <TableCell>{doc.label}</TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     {financeDetails[doc.type] && financeDetails[`${doc.type}Name`] ? (
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
//                         {financeDetails[doc.type] ? "Replace" : "Upload"}
//                       </span>
//                       <input
//                         type="file"
//                         accept="application/pdf,image/jpeg,image/png"
//                         onChange={(e) => handleFileChangeS3(courseIndex, doc.type, e)}
//                         className="hidden"
//                         disabled={!canUpdate}
//                       />
//                     </label>
//                     {financeDetails[doc.type] && financeDetails[`${doc.type}Name`] ? (
//                       <>
//                         <span className="text-gray-500">|</span>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           size="small"
//                           onClick={() =>
//                             removeDocument(courseIndex, doc.type, financeDetails[doc.type])
//                           }
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
} from "@mui/material";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { useAuth } from "../../../../context/AuthContext";
import { logActivity } from "./utils";
import { s3Client } from "../../../../config/aws-config";

const FinanceForm = ({
  courseIndex,
  fullFeesDetails,
  financeDetails,
  handleFinanceChange,
  financePartners,
  canUpdate,
  user,
  studentId,
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

  // Debug financeDetails
  console.log("FinanceDetails:", financeDetails);

  const handleFileChangeS3 = async (courseIndex, docType, event) => {
    const file = event.target.files[0];

    // Clear previous error
    setAttachmentError((prev) => ({ ...prev, [docType]: null }));

    // Validate file
    if (!file) {
      console.log("File selection cancelled");
      return; // User cancelled file selection
    }

    if (!(file instanceof File)) {
      setAttachmentError((prev) => ({
        ...prev,
        [docType]: "Invalid file object. Please select a valid file.",
      }));
      return;
    }

    try {
      // Validate S3 configuration
      if (!bucketName || !region) {
        throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
      }
      if (!s3Client.config.credentials) {
        throw new Error("S3 client credentials not configured");
      }

      // Validate file type and size
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
      }
      const maxSize = 10 * 1024 * 1024; // 10 MB limit
      if (file.size > maxSize) {
        throw new Error("File size exceeds 10 MB limit.");
      }

      // Create a unique key for the file
      const key = `students/${studentId}/${docType}_${file.name}`;

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Prepare S3 PutObject command
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: arrayBuffer,
        ContentType: file.type,
      });

      // Upload to S3
      await s3Client.send(command);

      // Construct the S3 URL
      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

      // Update financeDetails with the new S3 URL and file name
      console.log("Updating financeDetails:", { docType, s3Url, fileName: file.name });
      handleFinanceChange(courseIndex, docType, "", s3Url);
      handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);

      // Log success
      logActivity(
        "UPLOAD_DOCUMENT_SUCCESS",
        { studentId, courseIndex, docType, fileName: file.name, url: s3Url },
        user
      );
    } catch (err) {
      console.error(`Error uploading ${docType}:`, err);
      let errorMsg = `Failed to upload ${docType}: ${err.message}`;
      setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
      logActivity(
        "UPLOAD_DOCUMENT_ERROR",
        { studentId, courseIndex, docType, error: err.message },
        user
      );
    }
  };

  const viewDocument = async (s3Url, docType) => {
    try {
      console.log("Attempting to view document:", { s3Url, docType });

      if (!s3Url || typeof s3Url !== "string") {
        throw new Error(`No valid ${docType} URL provided`);
      }
      if (!bucketName || !region) {
        throw new Error("Missing S3 configuration");
      }
      if (!s3Client.config.credentials) {
        throw new Error("S3 client credentials not configured");
      }

      let key;
      try {
        const url = new URL(s3Url);
        key = url.pathname.substring(1); // Remove leading slash
        key = decodeURIComponent(key);
        console.log("Extracted key:", key);
      } catch (urlError) {
        console.error("URL parsing error:", urlError);
        const urlPatterns = [
          new RegExp(`https?://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
          new RegExp(`https?://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`),
          new RegExp(`https?://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
        ];

        for (const pattern of urlPatterns) {
          const match = s3Url.match(pattern);
          if (match && match[1]) {
            key = decodeURIComponent(match[1]);
            break;
          }
        }
      }

      if (!key) {
        throw new Error(`Could not extract key from URL: ${s3Url}`);
      }

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
        ResponseContentDisposition: "inline", // Try to display in browser
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log("Generated signed URL:", url);

      window.open(url, "_blank");
      logActivity("VIEW_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, url }, user);
    } catch (err) {
      console.error("Error viewing document:", {
        error: err,
        message: err.message,
        stack: err.stack,
        url: s3Url,
      });

      let errorMsg = `Failed to view ${docType}: ${err.message}`;
      if (err.name === "AccessDenied") {
        errorMsg = "Access denied. Check S3 permissions.";
      } else if (err.name === "NoSuchKey") {
        errorMsg = "File not found in S3.";
      }

      setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
      logActivity("VIEW_DOCUMENT_ERROR", {
        studentId,
        courseIndex,
        docType,
        error: err.message,
        url: s3Url,
      }, user);
    }
  };

  const removeDocument = async (courseIndex, docType, s3Url) => {
    try {
      // Clear document from financeDetails
      console.log("Removing document:", { docType, s3Url });
      handleFinanceChange(courseIndex, docType, "", "");
      handleFinanceChange(courseIndex, `${docType}Name`, "", "");

      // Optionally delete from S3
      if (s3Url && typeof s3Url === "string") {
        if (!bucketName || !region) {
          throw new Error("Missing S3 configuration");
        }
        if (!s3Client.config.credentials) {
          throw new Error("S3 client credentials not configured");
        }
        let key;
        try {
          const url = new URL(s3Url);
          key = url.pathname.substring(1);
          key = decodeURIComponent(key);
        } catch (urlError) {
          const urlPatterns = [
            new RegExp(`https?://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`),
            new RegExp(`https?://${bucketName}\\.s3\\.amazonaws\\.com/(.+)`),
            new RegExp(`https?://s3\\.${region}\\.amazonaws\\.com/${bucketName}/(.+)`),
          ];
          for (const pattern of urlPatterns) {
            const match = s3Url.match(pattern);
            if (match && match[1]) {
              key = decodeURIComponent(match[1]);
              break;
            }
          }
        }
        if (key) {
          const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
          });
          await s3Client.send(command);
          logActivity(
            "DELETE_DOCUMENT_SUCCESS",
            { studentId, courseIndex, docType, key },
            user
          );
        }
      }

      // Clear any errors
      setAttachmentError((prev) => ({ ...prev, [docType]: null }));
    } catch (err) {
      console.error(`Error removing ${docType}:`, err);
      let errorMsg = `Failed to remove ${docType}: ${err.message}`;
      setAttachmentError((prev) => ({ ...prev, [docType]: errorMsg }));
      logActivity(
        "DELETE_DOCUMENT_ERROR",
        { studentId, courseIndex, docType, error: err.message },
        user
      );
    }
  };

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
            handleFinanceChange(
              courseIndex,
              "applicant_number",
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
          label="Invoice Number"
          type="number"
          value={financeDetails.invoice_number || 0}
          onChange={(e) =>
            handleFinanceChange(
              courseIndex,
              "invoice_number",
              "",
              e.target.value
            )
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
                  <div className="flex items-center gap-2">
                    {financeDetails[`${doc.type}Name`] ? (
                      <>
                        <Typography
                          component="a"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            viewDocument(financeDetails[doc.type], doc.label);
                          }}
                          className="text-blue-600 hover:underline"
                          variant="body2"
                        >
                          {financeDetails[`${doc.type}Name`]}
                        </Typography>
                        <span className="text-gray-500">|</span>
                      </>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No file uploaded
                      </Typography>
                    )}
                    <label className="cursor-pointer">
                      <span className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        {financeDetails[`${doc.type}Name`] ? "Replace" : "Upload"}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        onChange={(e) => handleFileChangeS3(courseIndex, doc.type, e)}
                        className="hidden"
                        disabled={!canUpdate}
                      />
                    </label>
                    {financeDetails[`${doc.type}Name`] ? (
                      <>
                        <span className="text-gray-500">|</span>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() =>
                            removeDocument(courseIndex, doc.type, financeDetails[doc.type])
                          }
                          disabled={!canUpdate}
                        >
                          Remove
                        </Button>
                      </>
                    ) : null}
                  </div>
                  {attachmentError[doc.type] && (
                    <Typography color="error" variant="body2" className="mt-1">
                      {attachmentError[doc.type]}
                    </Typography>
                  )}
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