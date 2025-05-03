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
  Button,
} from "@mui/material";

const InstallmentsForm = ({
  courseIndex,
  fullFeesDetails,
  registration,
  installmentDetails,
  handleFullFeesChange,
  handleRegistrationChange,
  handleInstallmentChange,
  addInstallment,
  removeInstallment,
  canUpdate,
  user,
  studentId,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Typography className="text-gray-700">
          Total Fees: {fullFeesDetails.totalFees}
        </Typography>
        <Select
          value={fullFeesDetails.discountType || ""}
          onChange={(e) =>
            handleFullFeesChange(courseIndex, "discountType", "", e.target.value)
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
          value={fullFeesDetails.discountValue || ""}
          onChange={(e) =>
            handleFullFeesChange(courseIndex, "discountValue", "", e.target.value)
          }
          className="w-32"
          variant="outlined"
          size="small"
          disabled={!canUpdate}
        />
        <TextField
          label="Discount Reason/Coupon"
          value={fullFeesDetails.discountReason || ""}
          onChange={(e) =>
            handleFullFeesChange(courseIndex, "discountReason", "", e.target.value)
          }
          className="w-48"
          variant="outlined"
          size="small"
          disabled={!canUpdate}
        />
        <Typography className="text-gray-700">
          Fee After Discount: {fullFeesDetails.feeAfterDiscount}
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
                  value={registration.amount || ""}
                  onChange={(e) =>
                    handleRegistrationChange(courseIndex, "amount", e.target.value)
                  }
                  size="small"
                  disabled={!canUpdate}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="date"
                  value={registration.date || ""}
                  onChange={(e) =>
                    handleRegistrationChange(courseIndex, "date", e.target.value)
                  }
                  size="small"
                  disabled={!canUpdate}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={registration.paymentMethod || ""}
                  onChange={(e) =>
                    handleRegistrationChange(
                      courseIndex,
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
                  value={registration.receivedBy || ""}
                  onChange={(e) =>
                    handleRegistrationChange(
                      courseIndex,
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
                  value={registration.remark || ""}
                  onChange={(e) =>
                    handleRegistrationChange(
                      courseIndex,
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
                  value={registration.status || "Pending"}
                  onChange={(e) =>
                    handleRegistrationChange(
                      courseIndex,
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
        Installments
      </Typography>
      <TableContainer>
        <Table className="overflow-x-auto">
          <TableHead>
            <TableRow className="bg-blue-50">
              <TableCell className="text-gray-800 font-medium min-w-40">No.</TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Due Date
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Due Amount
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Paid Date
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Paid Amount
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                Mode
              </TableCell>
              <TableCell className="text-gray-800 font-medium min-w-40">
                PDC Status
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
              <TableCell className="text-gray-800 font-medium min-w-40">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {installmentDetails.map((installment, installmentIndex) => (
              <TableRow key={installmentIndex}>
                <TableCell>
                  <TextField
                    value={installment.number || ""}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
                        "number",
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
                    value={installment.dueDate || ""}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
                        "dueDate",
                        e.target.value
                      )
                    }
                    size="small"
                    disabled={!canUpdate}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={installment.dueAmount || ""}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
                        "dueAmount",
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
                    value={installment.paidDate || ""}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
                        "paidDate",
                        e.target.value
                      )
                    }
                    size="small"
                    disabled={!canUpdate}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={installment.paidAmount || ""}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
                        "paidAmount",
                        e.target.value
                      )
                    }
                    size="small"
                    disabled={!canUpdate}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={installment.paymentMode || ""}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
                        "paymentMode",
                        e.target.value
                      )
                    }
                    size="small"
                    disabled={!canUpdate}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={installment.pdcStatus || ""}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
                        "pdcStatus",
                        e.target.value
                      )
                    }
                    size="small"
                    disabled={!canUpdate}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={installment.receivedBy || ""}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
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
                    value={installment.remark || ""}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
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
                    value={installment.status || "Pending"}
                    onChange={(e) =>
                      handleInstallmentChange(
                        courseIndex,
                        installmentIndex,
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
                <TableCell>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => removeInstallment(courseIndex, installmentIndex)}
                    className="text-red-500 hover:text-red-700"
                    disabled={!canUpdate}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="outlined"
        onClick={() => addInstallment(courseIndex)}
        className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
        disabled={!canUpdate}
      >
        Add Installment
      </Button>
    </div>
  );
};

export default InstallmentsForm;