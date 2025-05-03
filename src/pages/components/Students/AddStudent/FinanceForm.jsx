import React from "react";
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
} from "@mui/material";

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
  return (
    <div className="space-y-4">
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
                  <MenuItem
                    key={idx}
                    value={schemeItem.plan}
                  >
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
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>6 Months Bank Statement</TableCell>
              <TableCell>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(courseIndex, "bankStatement", e)}
                  className="mt-1"
                  disabled={!canUpdate}
                />
              </TableCell>
              <TableCell>
                {financeDetails.bankStatement ? (
                  <Typography variant="body2" className="text-green-600">
                    Uploaded: {financeDetails.bankStatement.name}
                  </Typography>
                ) : (
                  <Typography variant="body2" className="text-gray-600">
                    Not Uploaded
                  </Typography>
                )}
              </TableCell>
            </TableRow>
            {financeDetails.bankStatement && (
              <TableRow>
                <TableCell>Payment Slip</TableCell>
                <TableCell>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(courseIndex, "paymentSlip", e)}
                    className="mt-1"
                    disabled={!canUpdate}
                  />
                </TableCell>
                <TableCell>
                  {financeDetails.paymentSlip ? (
                    <Typography variant="body2" className="text-green-600">
                      Uploaded: {financeDetails.paymentSlip.name}
                    </Typography>
                  ) : (
                    <Typography variant="body2" className="text-gray-600">
                      Not Uploaded
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
            {financeDetails.paymentSlip && (
              <TableRow>
                <TableCell>Aadhar Card</TableCell>
                <TableCell>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(courseIndex, "aadharCard", e)}
                    className="mt-1"
                    disabled={!canUpdate}
                  />
                </TableCell>
                <TableCell>
                  {financeDetails.aadharCard ? (
                    <Typography variant="body2" className="text-green-600">
                      Uploaded: {financeDetails.aadharCard.name}
                    </Typography>
                  ) : (
                    <Typography variant="body2" className="text-gray-600">
                      Not Uploaded
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
            {financeDetails.aadharCard && (
              <TableRow>
                <TableCell>PAN Card</TableCell>
                <TableCell>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(courseIndex, "panCard", e)}
                    className="mt-1"
                    disabled={!canUpdate}
                  />
                </TableCell>
                <TableCell>
                  {financeDetails.panCard ? (
                    <Typography variant="body2" className="text-green-600">
                      Uploaded: {financeDetails.panCard.name}
                    </Typography>
                  ) : (
                    <Typography variant="body2" className="text-gray-600">
                      Not Uploaded
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FinanceForm;