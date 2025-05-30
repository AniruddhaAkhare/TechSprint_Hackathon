import React, { useState, useEffect, useCallback, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../context/AuthContext";
import { logActivity } from "./utils";
import { s3Client } from "../../../../config/aws-config";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default function FinanceForm({
  courseIndex,
  courseId,
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
  const [localProgress, setLocalProgress] = useState({});
  const fileInputRefs = useRef({});

  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
  const region = import.meta.env.VITE_AWS_REGION;

  // Utility to validate S3 URLs
  const isValidS3Url = (url) => {
    if (!url) return false;
    const regex = new RegExp(`^https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/.*$`);
    return regex.test(url);
  };

  // Debug props on mount and update
  useEffect(() => {
    console.log("FinanceForm Props:", { financeDetails, canUpdate, studentId, courseId, user });
  }, [financeDetails, canUpdate, studentId, courseId, user]);

  // Initialize registrations if empty
  useEffect(() => {
    if (!financeDetails.registrations || financeDetails.registrations.length === 0) {
      console.log("Initializing registrations");
      handleFinanceChange({
        courseIndex,
        field: "registrations",
        subField: "",
        value: [
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
        ],
      });
    }
  }, [courseIndex, handleFinanceChange, financeDetails.registrations]);

  // Calculate derived values
  const calculateFees = useCallback(() => {
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

    // Only update state if values have changed to prevent infinite loops
    const newFeeAfterDiscount = feeAfterDiscount.toFixed(2);
    const newDisburseAmount = disburseAmount >= 0 ? disburseAmount.toFixed(2) : "0";

    if (financeDetails.feeAfterDiscount !== newFeeAfterDiscount) {
      handleFinanceChange({
        courseIndex,
        field: "feeAfterDiscount",
        subField: "",
        value: newFeeAfterDiscount,
      });
    }

    if (financeDetails.disburseAmount !== newDisburseAmount) {
      handleFinanceChange({
        courseIndex,
        field: "disburseAmount",
        subField: "",
        value: newDisburseAmount,
      });
    }
  }, [
    fullFeesDetails?.totalFees,
    financeDetails.discountType,
    financeDetails.discountValue,
    financeDetails.loanAmount,
    financeDetails.downPayment,
    financeDetails.subventionFee,
    financeDetails.feeAfterDiscount,
    financeDetails.disburseAmount,
    courseIndex,
    handleFinanceChange,
  ]);

  // Run calculateFees when dependencies change
  useEffect(() => {
    calculateFees();
  }, [
    fullFeesDetails?.totalFees,
    financeDetails.discountType,
    financeDetails.discountValue,
    financeDetails.loanAmount,
    financeDetails.downPayment,
    financeDetails.subventionFee,
  ]);

  // Sync local progress to parent
  useEffect(() => {
    setUploadProgress(localProgress);
  }, [localProgress, setUploadProgress]);

  const handleAddRegistration = () => {
    console.log("Adding new registration");
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
    handleFinanceChange({
      courseIndex,
      field: "registrations",
      subField: "",
      value: updatedRegistrations,
    });
  };

  const handleDeleteRegistration = (index) => {
    if (financeDetails.registrations.length <= 1) {
      toast.warn("At least one registration is required.");
      return;
    }
    console.log(`Deleting registration at index ${index}`);
    const updatedRegistrations = financeDetails.registrations
      .filter((_, i) => i !== index)
      .map((reg, i) => ({ ...reg, srNo: i + 1 }));
    handleFinanceChange({
      courseIndex,
      field: "registrations",
      subField: "",
      value: updatedRegistrations,
    });
  };

  const handleRegistrationChange = (index, field, value) => {
    console.log(`Updating registration at index ${index}, field: ${field}, value: ${value}`);
    const updatedRegistrations = [...financeDetails.registrations];
    updatedRegistrations[index] = {
      ...updatedRegistrations[index],
      [field]: value,
    };
    handleFinanceChange({
      courseIndex,
      field: "registrations",
      subField: "",
      value: updatedRegistrations,
    });
  };

  const handleAddLoanSubRegistration = (parentIndex) => {
    console.log(`Adding loan sub-registration for parent index ${parentIndex}`);
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
    handleFinanceChange({
      courseIndex,
      field: "registrations",
      subField: "",
      value: updatedRegistrations,
    });
  };

  const handleDeleteLoanSubRegistration = (parentIndex, subIndex) => {
    console.log(`Deleting loan sub-registration at parent index ${parentIndex}, subIndex ${subIndex}`);
    const updatedRegistrations = [...financeDetails.registrations];
    updatedRegistrations[parentIndex].loanSubRegistrations = updatedRegistrations[
      parentIndex
    ]
      .loanSubRegistrations.filter((_, i) => i !== subIndex)
      .map((subReg, i) => ({ ...subReg, srNo: i + 1 }));
    handleFinanceChange({
      courseIndex,
      field: "registrations",
      subField: "",
      value: updatedRegistrations,
    });
  };

  const handleLoanSubRegistrationChange = (parentIndex, subIndex, field, value) => {
    console.log(`Updating loan sub-registration at parent index ${parentIndex}, subIndex ${subIndex}, field: ${field}, value: ${value}`);
    const updatedRegistrations = [...financeDetails.registrations];
    updatedRegistrations[parentIndex].loanSubRegistrations[subIndex] = {
      ...updatedRegistrations[parentIndex].loanSubRegistrations[subIndex],
      [field]: value,
    };
    handleFinanceChange({
      courseIndex,
      field: "registrations",
      subField: "",
      value: updatedRegistrations,
    });
  };

  // File Handling
  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    console.log(`File selected for ${docType}:`, file);
    if (file) {
      // Restrict photo to images only
      const allowedTypes = docType === "photo" 
        ? ["image/jpeg", "image/png"]
        : ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Allowed types: ${docType === "photo" ? "JPEG, PNG" : "PDF, JPEG, PNG"}.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      setDocuments((prev) => ({ ...prev, [docType]: file }));
      setLocalProgress((prev) => ({ ...prev, [docType]: 0 }));
    } else {
      console.warn(`No file selected for ${docType}`);
    }
  };

  const deleteS3File = async (s3Url) => {
    if (!s3Url) return;
    if (!isValidS3Url(s3Url)) {
      console.error(`Invalid S3 URL: ${s3Url}`);
      throw new Error("Invalid S3 URL format.");
    }
    try {
      const key = decodeURIComponent(s3Url.split(`https://${bucketName}.s3.${region}.amazonaws.com/`)[1]);
      console.log(`Deleting S3 file with key: ${key}`);
      const params = {
        Bucket: bucketName,
        Key: key,
      };
      await s3Client.send(new DeleteObjectCommand(params));
      logActivity("DELETE_S3_FILE_SUCCESS", { s3Url, studentId, courseId }, user);
    } catch (err) {
      console.error(`Error deleting S3 file:`, err);
      throw new Error(`Failed to delete file from S3: ${err.message}`);
    }
  };

  const uploadFileToS3 = async (file, docType, studentId, courseId) => {
    if (!bucketName || !region) {
      throw new Error("Missing S3 configuration: VITE_S3_BUCKET_NAME or VITE_AWS_REGION");
    }

    if (!file || !(file instanceof File)) {
      throw new Error(`Invalid file for ${docType}`);
    }

    const fileName = `students/${studentId}/${courseId}/documents/${docType}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const fileBuffer = await file.arrayBuffer();
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type,
    };

    try {
      // Simulate progress (TODO: Integrate real S3 upload progress if supported by AWS SDK)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setLocalProgress((prev) => ({ ...prev, [docType]: Math.min(progress, 90) }));
        if (progress >= 90) clearInterval(interval);
      }, 200);

      console.log(`Uploading ${docType} to S3:`, fileName);
      await s3Client.send(new PutObjectCommand(params));
      clearInterval(interval);
      setLocalProgress((prev) => ({ ...prev, [docType]: 100 }));

      const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
      console.log(`Uploaded ${docType} to: ${url}`);
      return url;
    } catch (err) {
      console.error(`Error uploading ${docType}:`, err);
      throw new Error(`Failed to upload ${docType}: ${err.message}`);
    }
  };

  const handleUploadDocuments = async () => {
    if (!canUpdate) {
      toast.error("You do not have permission to upload documents.");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          console.log(`Processing upload for ${docType}: ${file.name}`);
          // Delete existing file if it exists
          if (financeDetails[docType] && isValidS3Url(financeDetails[docType])) {
            await deleteS3File(financeDetails[docType]);
          }
          const url = await uploadFileToS3(file, docType, studentId, courseId);
          handleFinanceChange({
            courseIndex,
            field: docType,
            subField: "",
            value: url,
          });
          handleFinanceChange({
            courseIndex,
            field: `${docType}Name`,
            subField: "",
            value: file.name,
          });
          logActivity("UPLOAD_DOCUMENT_SUCCESS", { studentId, courseId, docType, fileName: file.name, url }, user);
          // Clear file input
          if (fileInputRefs.current[docType]) {
            fileInputRefs.current[docType].value = null;
          }
        }
      }
      toast.success("Documents uploaded successfully!");
      setDocuments({
        photo: null,
        bankStatement: null,
        paymentSlip: null,
        aadharCard: null,
        panCard: null,
        invoice: null,
        loanAgreement: null,
        loanDelivery: null,
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error(`Error uploading documents: ${error.message}`);
      logActivity("UPLOAD_DOCUMENT_ERROR", { studentId, courseId, error: error.message }, user);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDocument = (docType) => {
    if (!canUpdate) {
      toast.error("You do not have permission to edit documents.");
      return;
    }
    console.log(`Opening file input for ${docType}`);
    fileInputRefs.current[docType]?.click();
  };

  const handleDeleteDocument = async (docType) => {
    if (!canUpdate) {
      toast.error("You do not have permission to delete documents.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (financeDetails[docType] && isValidS3Url(financeDetails[docType])) {
        console.log(`Deleting document: ${docType}`);
        await deleteS3File(financeDetails[docType]);
        handleFinanceChange({
          courseIndex,
          field: docType,
          subField: "",
          value: null,
        });
        handleFinanceChange({
          courseIndex,
          field: `${docType}Name`,
          subField: "",
          value: "",
        });
        logActivity("DELETE_DOCUMENT_SUCCESS", { studentId, courseId, docType }, user);
        toast.success(`${docType} deleted successfully!`);
      } else {
        toast.warn(`No valid document found for ${docType} to delete.`);
      }
    } catch (error) {
      console.error(`Error deleting ${docType}:`, error);
      toast.error(`Error deleting ${docType}: ${error.message}`);
      logActivity("DELETE_DOCUMENT_ERROR", { studentId, courseId, docType, error: error.message }, user);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileNameClick = (url, docType) => {
    console.log(`File name clicked for ${docType}: ${url}`);
    if (!isValidS3Url(url)) {
      toast.error("Invalid document URL. Please try uploading the document again.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
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
                      onChange={(e) =>
                        handleFinanceChange({
                          courseIndex,
                          field: "discountType",
                          subField: "",
                          value: e.target.value,
                        })
                      }
                      disabled={!canUpdate || isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        Type
                      </option>
                      <option value="percentage">%</option>
                      <option value="value">₹</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={financeDetails.discountValue || ""}
                      onChange={(e) =>
                        handleFinanceChange({
                          courseIndex,
                          field: "discountValue",
                          subField: "",
                          value: e.target.value,
                        })
                      }
                      placeholder="Discount"
                      disabled={!canUpdate || isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={financeDetails.discountReason || ""}
                      onChange={(e) =>
                        handleFinanceChange({
                          courseIndex,
                          field: "discountReason",
                          subField: "",
                          value: e.target.value,
                        })
                      }
                      placeholder="Discount Reason/Coupon"
                      disabled={!canUpdate || isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">
                      {financeDetails.feeAfterDiscount || fullFeesDetails?.totalFees || 0}
                    </span>
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
                          <option value="" disabled>
                            Select Payment Method
                          </option>
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
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[40px]">
                                      Sr. No.
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[100px]">
                                      Amount
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[120px]">
                                      Date
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[150px]">
                                      Payment Method
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[120px]">
                                      Received By
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[150px]">
                                      Remark
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[100px]">
                                      Status
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 min-w-[100px]">
                                      Action
                                    </th>
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
                                          onChange={(e) =>
                                            handleLoanSubRegistrationChange(
                                              index,
                                              subIndex,
                                              "amount",
                                              e.target.value
                                            )
                                          }
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <input
                                          type="date"
                                          value={subReg.date || ""}
                                          onChange={(e) =>
                                            handleLoanSubRegistrationChange(
                                              index,
                                              subIndex,
                                              "date",
                                              e.target.value
                                            )
                                          }
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <select
                                          value={subReg.paymentMethod || ""}
                                          onChange={(e) =>
                                            handleLoanSubRegistrationChange(
                                              index,
                                              subIndex,
                                              "paymentMethod",
                                              e.target.value
                                            )
                                          }
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="" disabled>
                                            Select Payment Method
                                          </option>
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
                                          onChange={(e) =>
                                            handleLoanSubRegistrationChange(
                                              index,
                                              subIndex,
                                              "receivedBy",
                                              e.target.value
                                            )
                                          }
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <input
                                          type="text"
                                          value={subReg.remark || ""}
                                          onChange={(e) =>
                                            handleLoanSubRegistrationChange(
                                              index,
                                              subIndex,
                                              "remark",
                                              e.target.value
                                            )
                                          }
                                          disabled={!canUpdate || isSubmitting}
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <select
                                          value={subReg.status || "Pending"}
                                          onChange={(e) =>
                                            handleLoanSubRegistrationChange(
                                              index,
                                              subIndex,
                                              "status",
                                              e.target.value
                                            )
                                          }
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
                                          disabled={
                                            !canUpdate ||
                                            isSubmitting ||
                                            registration.loanSubRegistrations.length <= 1
                                          }
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
                onChange={(e) =>
                  handleFinanceChange({
                    courseIndex,
                    field: "financePartner",
                    subField: "",
                    value: e.target.value,
                  })
                }
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Finance Partner
                </option>
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
                onChange={(e) =>
                  handleFinanceChange({
                    courseIndex,
                    field: "contactPerson",
                    subField: "",
                    value: e.target.value,
                  })
                }
                disabled={!financeDetails.financePartner || !canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Contact Person
                </option>
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
                onChange={(e) =>
                  handleFinanceChange({
                    courseIndex,
                    field: "scheme",
                    subField: "",
                    value: e.target.value,
                  })
                }
                disabled={!financeDetails.financePartner || !canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Scheme
                </option>
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
                onChange={(e) =>
                  handleFinanceChange({
                    courseIndex,
                    field: "loanAmount",
                    subField: "",
                    value: e.target.value,
                  })
                }
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Down Payment</label>
              <input
                type="number"
                value={financeDetails.downPayment || ""}
                onChange={(e) =>
                  handleFinanceChange({
                    courseIndex,
                    field: "downPayment",
                    subField: "",
                    value: e.target.value,
                  })
                }
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Down Payment Date</label>
              <input
                type="date"
                value={financeDetails.downPaymentDate || ""}
                onChange={(e) =>
                  handleFinanceChange({
                    courseIndex,
                    field: "downPaymentDate",
                    subField: "",
                    value: e.target.value,
                  })
                }
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Applicant Name</label>
              <input
                type="text"
                value={financeDetails.applicantName || ""}
                onChange={(e) =>
                  handleFinanceChange({
                    courseIndex,
                    field: "applicantName",
                    subField: "",
                    value: e.target.value,
                  })
                }
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Relationship</label>
              <input
                type="text"
                value={financeDetails.relationship || ""}
                onChange={(e) =>
                  handleFinanceChange({
                    courseIndex,
                    field: "relationship",
                    subField: "",
                    value: e.target.value,
                  })
                }
                disabled={!canUpdate || isSubmitting}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Loan Status</label>
              <select
                value={financeDetails.loanStatus || "Pending"}
                onChange={(e) =>
                  handleFinanceChange({
                    courseIndex,
                    field: "loanStatus",
                    subField: "",
                    value: e.target.value,
                  })
                }
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
            <div>
              <label className="block text-sm font-medium text-gray-600">Disburse Amount</label>
              <input
                type="number"
                value={financeDetails.disburseAmount || ""}
                readOnly
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
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
                  ref={(el) => (fileInputRefs.current[doc.key] = el)}
                  onChange={(e) => handleFileChange(e, doc.key)}
                  accept={doc.key === "photo" ? ".jpg,.jpeg,.png" : ".pdf,.jpg,.jpeg,.png"}
                  disabled={!canUpdate || isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {documents[doc.key] && (
                  <span className="text-sm text-gray-600">{documents[doc.key].name}</span>
                )}
                {localProgress[doc.key] > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${localProgress[doc.key]}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{localProgress[doc.key]}%</span>
                  </div>
                )}
                {financeDetails[doc.key] && financeDetails[`${doc.key}Name`] && (
                  <div className="mt-2 flex items-center space-x-2">
                    <a
                      href={isValidS3Url(financeDetails[doc.key]) ? financeDetails[doc.key] : "#"}
                      onClick={(e) => {
                        if (!isValidS3Url(financeDetails[doc.key])) {
                          e.preventDefault();
                          toast.error("Invalid document URL. Please try uploading the document again.");
                          return;
                        }
                        handleFileNameClick(financeDetails[doc.key], doc.key);
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm ${isValidS3Url(financeDetails[doc.key]) ? "text-blue-600 hover:underline" : "text-gray-500 cursor-not-allowed"}`}
                    >
                      {financeDetails[`${doc.key}Name`]}
                    </a>
                    <button
                      onClick={() => handleEditDocument(doc.key)}
                      disabled={!canUpdate || isSubmitting}
                      className="text-gray-600 hover:text-gray-800"
                      title="Edit Document"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.key)}
                      disabled={!canUpdate || isSubmitting}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Document"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {financeDetails[doc.key] && doc.key === "photo" && isValidS3Url(financeDetails[doc.key]) && (
                  <div className="mt-2">
                    <img
                      src={`${financeDetails[doc.key]}?t=${Date.now()}`}
                      alt={doc.label}
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        console.error(`Failed to load ${doc.label}:`, e.target.src);
                        e.target.style.display = "none";
                        toast.error(`Failed to load ${doc.label}. Please try uploading again.`);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
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