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
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { useAuth } from "../../../../context/AuthContext";

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
}) => {
  const { user: authUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [attachmentError, setAttachmentError] = useState({});

  // S3 Client Configuration
  const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });

  // Validate file type and size
  const validateFile = (file, docType) => {
    const validFormats = ["application/pdf", "image/jpeg", "image/png"];
    if (!validFormats.includes(file.type)) {
      setAttachmentError((prev) => ({
        ...prev,
        [docType]: "Invalid file format. Only PDF, JPG, and PNG are supported.",
      }));
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAttachmentError((prev) => ({
        ...prev,
        [docType]: "File size exceeds 2MB.",
      }));
      return false;
    }
    setAttachmentError((prev) => ({ ...prev, [docType]: "" }));
    return true;
  };

  // Function to upload file to S3
  const uploadToS3 = async (file, docType) => {
    const bucket = import.meta.env.VITE_S3_BUCKET_NAME;
    if (!bucket) {
      throw new Error("S3 bucket name is not configured.");
    }
    try {
      setUploading(true);
      setError("");
      const arrayBuffer = await file.arrayBuffer();
      const key = `student/${studentId}/course_${courseIndex}/${docType}_${Date.now()}_${file.name}`;
      const params = {
        Bucket: bucket,
        Key: key,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
      };
      await s3Client.send(new PutObjectCommand(params));
      const url = `https://${bucket}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
      console.log(`S3 Upload Success for ${docType}:`, { url, key });
      return url;
    } catch (err) {
      setError(`Failed to upload ${docType}: ${err.message}`);
      console.error(`S3 Upload Error for ${docType}:`, err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // Function to generate pre-signed URL for viewing
  const viewDocument = async (s3Url, docType) => {
    try {
      if (!s3Url) {
        setError(`No ${docType} uploaded yet.`);
        return;
      }
      const key = s3Url.split(`https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/`)[1];
      const command = new GetObjectCommand({
        Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
        Key: key,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log(`Generated Pre-signed URL for ${docType}:`, url);
      window.open(url, "_blank");
    } catch (err) {
      setError(`Failed to generate view URL for ${docType}: ${err.message}`);
      console.error(`View Error for ${docType}:`, err);
    }
  };

  // Modified handleFileChange to validate and upload to S3
  const handleFileChangeWithS3 = async (courseIndex, docType, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file, docType)) {
      return;
    }

    try {
      const s3Url = await uploadToS3(file, docType);
      const fileData = { name: file.name, s3Url };
      console.log(`Updating financeDetails for ${docType}:`, fileData);
      handleFileChange(courseIndex, docType, fileData);
    } catch (err) {
      // Error is already set in uploadToS3
    }
  };

  // Debug financeDetails to check state updates
  console.log("Current financeDetails:", financeDetails);

  return (
    <div className="space-y-4">
      {error && (
        <Typography color="error" variant="body2">
          {error}
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
            ].map((doc) => (
              <TableRow key={doc.type}>
                <TableCell>{doc.label}</TableCell>
                <TableCell>
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => handleFileChangeWithS3(courseIndex, doc.type, e)}
                    className="mt-1"
                    disabled={!canUpdate || uploading}
                  />
                  {attachmentError[doc.type] && (
                    <Typography color="error" variant="body2" className="mt-1">
                      {attachmentError[doc.type]}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {financeDetails[doc.type]?.s3Url ? (
                    <Typography variant="body2" className="text-green-600">
                      Uploaded: {financeDetails[doc.type].name}
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
                    onClick={() =>
                      viewDocument(financeDetails[doc.type]?.s3Url, doc.label)
                    }
                    disabled={!financeDetails[doc.type]?.s3Url}
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