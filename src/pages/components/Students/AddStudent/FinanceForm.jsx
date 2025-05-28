import React, { useState, useEffect } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { useAuth } from "../../../../context/AuthContext";
import { logActivity } from "./utils";
import { s3Client } from "../../../../config/aws-config";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

  // Log canUpdate for debugging
  useEffect(() => {
  }, [canUpdate]);

  // Initialize registrations array if empty
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
    fullFeesDetails?.totalFees,
    courseIndex,
    handleFinanceChange,
  ]);

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

  const handleFileChangeS3 = async (courseIndex, docType, event) => {
    const file = event.target.files[0];
    setAttachmentError((prev) => ({ ...prev, [docType]: null }));

    if (!file) return;

    if (!(file instanceof File)) {
      setAttachmentError((prev) => ({ ...prev, [docType]: "Invalid file object." }));
      return;
    }

    try {
      if (!bucketName || !region || !s3Client.config.credentials) {
        throw new Error("Missing S3 configuration or credentials");
      }

      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.");
      }
      const maxSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxSize) {
        throw new Error("File size exceeds 10 MB limit.");
      }

      const key = `students/${studentId}/${docType}_${file.name}`;
      const arrayBuffer = await file.arrayBuffer();
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: arrayBuffer,
        ContentType: file.type,
      });

      await s3Client.send(command);
      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
      handleFinanceChange(courseIndex, docType, "", s3Url);
      handleFinanceChange(courseIndex, `${docType}Name`, "", file.name);
      logActivity("UPLOAD_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, fileName: file.name, url: s3Url }, user);
    } catch (err) {
      setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to upload ${docType}: ${err.message}` }));
      logActivity("UPLOAD_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message }, user);
    }
  };

  const viewDocument = async (s3Url, docType) => {
    try {
      if (!s3Url || !bucketName || !region || !s3Client.config.credentials) {
        throw new Error("Invalid URL or S3 configuration");
      }

      let key = new URL(s3Url).pathname.substring(1);
      key = decodeURIComponent(key);

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
        ResponseContentDisposition: "inline",
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      window.open(url, "_blank");
      logActivity("VIEW_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, url }, user);
    } catch (err) {
      setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to view ${docType}: ${err.message}` }));
      logActivity("VIEW_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message, url: s3Url }, user);
    }
  };

  const removeDocument = async (courseIndex, docType, s3Url) => {
    try {
      handleFinanceChange(courseIndex, docType, "", "");
      handleFinanceChange(courseIndex, `${docType}Name`, "", "");

      if (s3Url) {
        let key = new URL(s3Url).pathname.substring(1);
        key = decodeURIComponent(key);
        const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
        await s3Client.send(command);
        logActivity("DELETE_DOCUMENT_SUCCESS", { studentId, courseIndex, docType, key }, user);
      }
      setAttachmentError((prev) => ({ ...prev, [docType]: null }));
    } catch (err) {
      setAttachmentError((prev) => ({ ...prev, [docType]: `Failed to remove ${docType}: ${err.message}` }));
      logActivity("DELETE_DOCUMENT_ERROR", { studentId, courseIndex, docType, error: err.message }, user);
    }
  };

  return (
    <div className="space-y-4 p-6">
      {Object.values(attachmentError).filter((err) => err).length > 0 && (
        <Typography color="error" variant="body2">
          {Object.values(attachmentError).filter((err) => err).join("; ")}
        </Typography>
      )}

      {/* Fees Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-50">
              <TableCell className="text-gray-800 font-medium w-48">Total Fees</TableCell>
              <TableCell className="text-gray-800 font-medium w-48">Discount Type</TableCell>
              <TableCell className="text-gray-800 font-medium w-48">Discount Value</TableCell>
              <TableCell className="text-gray-800 font-medium w-48">Discount Reason</TableCell>
              <TableCell className="text-gray-800 font-medium w-48">Fee After Discount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>{fullFeesDetails?.totalFees || 0}</Typography>
              </TableCell>
              <TableCell>
                <Select
                  value={financeDetails.discountType || ""}
                  onChange={(e) => handleFinanceChange(courseIndex, "discountType", "", e.target.value)}
                  displayEmpty
                  className="w-32 bg-gray-100 rounded-lg"
                  disabled={!canUpdate}
                >
                  <MenuItem value="" disabled>Type</MenuItem>
                  <MenuItem value="percentage">%</MenuItem>
                  <MenuItem value="value">₹</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  label="Discount"
                  type="number"
                  value={financeDetails.discountValue || ""}
                  onChange={(e) => handleFinanceChange(courseIndex, "discountValue", "", e.target.value)}
                  className="w-32"
                  variant="outlined"
                  size="small"
                  disabled={!canUpdate}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Discount Reason/Coupon"
                  value={financeDetails.discountReason || ""}
                  onChange={(e) => handleFinanceChange(courseIndex, "discountReason", "", e.target.value)}
                  className="w-48"
                  variant="outlined"
                  size="small"
                  disabled={!canUpdate}
                />
              </TableCell>
              <TableCell>
                <Typography>{financeDetails.feeAfterDiscount || fullFeesDetails?.totalFees || 0}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Registrations Table */}
      <Typography variant="subtitle1" className="text-gray-800 font-medium overflow-y-auto overflow-x-auto">Fees</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-50">
              <TableCell className="text-gray-800 font-medium w-52 ">Sr. No.</TableCell>
              <TableCell className="text-gray-800 font-medium w-52">Amount</TableCell>
              <TableCell className="text-gray-800 font-medium w-52">Amount Type</TableCell>
              <TableCell className="text-gray-800 font-medium w-52">Date</TableCell>
              <TableCell className="text-gray-800 font-medium w-52">Payment Method</TableCell>
              <TableCell className="text-gray-800 font-medium w-52">Received By</TableCell>
              <TableCell className="text-gray-800 font-medium w-52">Remark</TableCell>
              <TableCell className="text-gray-800 font-medium w-52">Status</TableCell>
              <TableCell className="text-gray-800 font-medium w-52">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(financeDetails.registrations || []).map((registration, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>{registration.srNo}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={registration.amount || ""}
                      onChange={(e) => handleRegistrationChange(index, "amount", e.target.value)}
                      className="w-52"
                      size="small"
                      disabled={!canUpdate}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={registration.amountType || "Non-Loan Amount"}
                      onChange={(e) => handleRegistrationChange(index, "amountType", e.target.value)}
                      size="small"
                      fullWidth
                      disabled={!canUpdate}
                    >
                      <MenuItem value="Loan Amount">Loan Amount</MenuItem>
                      <MenuItem value="Non-Loan Amount">Non-Loan Amount</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="date"
                      value={registration.date || ""}
                      onChange={(e) => handleRegistrationChange(index, "date", e.target.value)}
                      size="small"
                      className="w-52"
                      disabled={!canUpdate || registration.amountType=="Loan Amount"}
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={registration.paymentMethod || ""}
                      onChange={(e) => handleRegistrationChange(index, "paymentMethod", e.target.value)}
                      size="small"
                      className="w-52"
                      displayEmpty
                      fullWidth
                      disabled={!canUpdate || registration.amountType=="Loan Amount"}
                    >
                      <MenuItem value="" disabled>Select Payment Method</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="Cheque">Cheque</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={registration.receivedBy || ""}
                      onChange={(e) => handleRegistrationChange(index, "receivedBy", e.target.value)}
                      size="small"
                      className="w-52"
                      disabled={!canUpdate || registration.amountType=="Loan Amount"}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={registration.remark || ""}
                      onChange={(e) => handleRegistrationChange(index, "remark", e.target.value)}
                      size="small"
                      className="w-52"
                      disabled={!canUpdate}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={registration.status || "Pending"}
                      onChange={(e) => handleRegistrationChange(index, "status", e.target.value)}
                      size="small"
                      fullWidth
                      disabled={!canUpdate}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteRegistration(index)}
                      disabled={!canUpdate || financeDetails.registrations.length <= 1}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
                {registration.amountType === "Loan Amount" && (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Loan Sub-Registrations</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow className="bg-gray-100">
                                  <TableCell className="text-gray-800 font-medium min-w-[40px]">Sr. No.</TableCell>
                                  <TableCell className="text-gray-800 font-medium min-w-[100px]">Amount</TableCell>
                                  <TableCell className="text-gray-800 font-medium min-w-[120px]">Date</TableCell>
                                  <TableCell className="text-gray-800 font-medium min-w-[150px]">Payment Method</TableCell>
                                  <TableCell className="text-gray-800 font-medium min-w-[120px]">Received By</TableCell>
                                  <TableCell className="text-gray-800 font-medium min-w-[150px]">Remark</TableCell>
                                  <TableCell className="text-gray-800 font-medium min-w-[100px]">Status</TableCell>
                                  <TableCell className="text-gray-800 font-medium min-w-[100px]">Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(registration.loanSubRegistrations || []).map((subReg, subIndex) => (
                                  <TableRow key={subIndex}>
                                    <TableCell>{subReg.srNo}</TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={subReg.amount || ""}
                                        onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "amount", e.target.value)}
                                        size="small"
                                        disabled={!canUpdate}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="date"
                                        value={subReg.date || ""}
                                        onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "date", e.target.value)}
                                        size="small"
                                        disabled={!canUpdate}
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Select
                                        value={subReg.paymentMethod || ""}
                                        onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "paymentMethod", e.target.value)}
                                        size="small"
                                        displayEmpty
                                        fullWidth
                                        disabled={!canUpdate}
                                      >
                                        <MenuItem value="" disabled>Select Payment Method</MenuItem>
                                        <MenuItem value="Cash">Cash</MenuItem>
                                        <MenuItem value="Card">Card</MenuItem>
                                        <MenuItem value="UPI">UPI</MenuItem>
                                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                        <MenuItem value="Cheque">Cheque</MenuItem>
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        value={subReg.receivedBy || ""}
                                        onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "receivedBy", e.target.value)}
                                        size="small"
                                        disabled={!canUpdate}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        value={subReg.remark || ""}
                                        onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "remark", e.target.value)}
                                        size="small"
                                        disabled={!canUpdate}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Select
                                        value={subReg.status || "Pending"}
                                        onChange={(e) => handleLoanSubRegistrationChange(index, subIndex, "status", e.target.value)}
                                        size="small"
                                        fullWidth
                                        disabled={!canUpdate}
                                      >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Paid">Paid</MenuItem>
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteLoanSubRegistration(index, subIndex)}
                                        disabled={!canUpdate || registration.loanSubRegistrations.length <= 1}
                                      >
                                        Delete
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleAddLoanSubRegistration(index)}
                              disabled={!canUpdate}
                              className="mt-2"
                            >
                              Add Loan Downpayment
                            </Button>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-between items-center">
        <Typography variant="subtitle1" className="text-gray-800 font-medium">
          Registration
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleAddRegistration}
          disabled={!canUpdate}
        >
          Add Fees
        </Button>
      </div>

      {/* Finance Details */}
      <Typography variant="subtitle1" className="text-gray-800 font-medium">
        Finance Details
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormControl fullWidth>
          <InputLabel>Finance Partner</InputLabel>
          <Select
            value={financeDetails.financePartner || ""}
            onChange={(e) => handleFinanceChange(courseIndex, "financePartner", "", e.target.value)}
            label="Finance Partner"
            className="bg-gray-100 rounded-lg"
            disabled={!canUpdate}
          >
            <MenuItem value="" disabled>Select Finance Partner</MenuItem>
            {financePartners.map((partner) => (
              <MenuItem key={partner.id} value={partner.name}>
                {partner.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Contact Number</InputLabel>
          <Select
            value={financeDetails.contactNumber || ""}
            onChange={(e) => handleFinanceChange(courseIndex, "contactNumber", "", e.target.value)}
            label="Contact Number"
            className="bg-gray-100 rounded-lg"
            disabled={!financeDetails.financePartner || !canUpdate}
          >
            <MenuItem value="" disabled>Select Contact Person</MenuItem>
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
            value={financeDetails.financeScheme || ""}
            onChange={(e) => handleFinanceChange(courseIndex, "financeScheme", "", e.target.value)}
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
          value={financeDetails.loanAmount || ""}
          onChange={(e) => handleFinanceChange(courseIndex, "loanAmount", "", e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <TextField
          label="Subvention Fee"
          type="number"
          value={financeDetails.subventionFee || ""}
          onChange={(e) => handleFinanceChange(courseIndex, "subventionFee", "", e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <TextField
          label="Disburse Amount"
          type="number"
          value={financeDetails.disburseAmount || ""}
          variant="outlined"
          size="small"
          fullWidth
          disabled
        />
        <TextField
          label="Applicant Name"
          value={financeDetails.applicantName || ""}
          onChange={(e) => handleFinanceChange(courseIndex, "applicantName", "", e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <TextField
          label="Relationship"
          value={financeDetails.relationship || ""}
          onChange={(e) => handleFinanceChange(courseIndex, "relationship", "", e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <FormControl fullWidth>
          <InputLabel>Loan Status</InputLabel>
          <Select
            value={financeDetails.loanStatus || "Pending"}
            onChange={(e) => handleFinanceChange(courseIndex, "loanStatus", "", e.target.value)}
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
          value={financeDetails.applicantNumber || ""}
          onChange={(e) => handleFinanceChange(courseIndex, "applicantNumber", "", e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <TextField
          label="Invoice Number"
          type="number"
          value={financeDetails.invoiceNumber || ""}
          onChange={(e) => handleFinanceChange(courseIndex, "invoiceNumber", "", e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        <TextField
          label="Down Payment"
          type="number"
          value={financeDetails.downPayment || ""}
          onChange={(e) => handleFinanceChange(courseIndex, "downPayment", "", e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          disabled={!canUpdate}
        />
        
      </div>

      {/* Documents Table */}
      <Typography variant="subtitle1" className="text-gray-800 font-medium mt-4">
        Documents
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-50">
              <TableCell className="text-gray-800 font-medium min-w-[150px]">Document Type</TableCell>
              <TableCell className="text-gray-800 font-medium min-w-[300px]">File</TableCell>
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
              { type: "loanAgreement", label: "Loan Agreement" },
              { type: "loanDelivery", label: "Loan Delivery Order" },
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
                          onClick={() => removeDocument(courseIndex, doc.type, financeDetails[doc.type])}
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