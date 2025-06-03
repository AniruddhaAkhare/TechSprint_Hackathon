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
} from "@mui/material";

const FullFeesForm = ({
  courseIndex,
  fullFeesDetails,
  handleFullFeesChange,
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
      <TableContainer>
        <Table className="overflow-x-auto">
          <TableHead>
            <TableRow className="bg-blue-50">
              <TableCell className="text-gray-800 font-medium min-w-40">
                Title
              </TableCell>
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
              <TableCell>Registration</TableCell>
              <TableCell>
                <TextField
                  value={fullFeesDetails.registration.amount || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
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
                  value={fullFeesDetails.registration.date || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
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
                  value={fullFeesDetails.registration.paymentMethod || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
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
                  value={fullFeesDetails.registration.receivedBy || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
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
                  value={fullFeesDetails.registration.remark || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
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
                  value={fullFeesDetails.registration.status || "Pending"}
                  onChange={(e) =>
                    handleFullFeesChange(
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
            <TableRow>
              <TableCell>Final Payment</TableCell>
              <TableCell>
                <TextField
                  value={fullFeesDetails.finalPayment.amount || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
                      courseIndex,
                      "finalPayment",
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
                  value={fullFeesDetails.finalPayment.date || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
                      courseIndex,
                      "finalPayment",
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
                  value={fullFeesDetails.finalPayment.paymentMethod || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
                      courseIndex,
                      "finalPayment",
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
                  value={fullFeesDetails.finalPayment.receivedBy || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
                      courseIndex,
                      "finalPayment",
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
                  value={fullFeesDetails.finalPayment.remark || ""}
                  onChange={(e) =>
                    handleFullFeesChange(
                      courseIndex,
                      "finalPayment",
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
                  value={fullFeesDetails.finalPayment.status || "Pending"}
                  onChange={(e) =>
                    handleFullFeesChange(
                      courseIndex,
                      "finalPayment",
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
    </div>
  );
};

export default FullFeesForm;