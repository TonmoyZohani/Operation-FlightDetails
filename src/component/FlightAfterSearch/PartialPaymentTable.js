import {
  Box,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Skeleton,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { labelWhiteBg } from "./FareSummary";

const PartialPaymentTable = ({
  partialPaymentChargeData,
  flightData,
  flightBrandId,
  isAfterFareLoading,
}) => {
  return (
    <>
      {isAfterFareLoading ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            pb: "6px",
            gap: 2,
          }}
        >
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={"100%"}
              height={30}
              sx={{ borderRadius: "4px" }}
            />
          ))}
        </Box>
      ) : (
        <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...labelStyle, width: "30%" }}>
                  Labels
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: "#F2F7FF",
                    fontWeight: "400",
                    color: "var(--secondary-color)",
                    fontSize: "12px",
                    textAlign: "right",
                    width: "70%",
                  }}
                >
                  Charges
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={labelStyle}>Partial Payment Amount</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "var(--secondary-color)", fontSize: "12px" }}
                >
                  {(partialPaymentChargeData?.amount ??
                    partialPaymentChargeData?.payedAmount) -
                    (partialPaymentChargeData?.totalCharge ?? 0)}{" "}
                  BDT
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={labelStyle}>FFI Service Charge</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "var(--secondary-color)", fontSize: "12px" }}
                >
                  {partialPaymentChargeData?.totalCharge ?? 0} BDT
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={labelStyle}>Partial Agent Total</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "var(--secondary-color)", fontSize: "12px" }}
                >
                  {partialPaymentChargeData?.amount ??
                    partialPaymentChargeData?.payedAmount ??
                    0}{" "}
                  BDT
                </TableCell>
              </TableRow>

              <TableRow sx={{ bgcolor: "#F2F7FF" }}>
                <TableCell sx={{ ...labelWhiteBg, color: "red" }}>
                  Due Amount
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "var(--primary-color)", fontSize: "12px" }}
                >
                  {(
                    (flightData?.agentPrice ?? 0) -
                    (partialPaymentChargeData?.amount ??
                      partialPaymentChargeData?.payedAmount ??
                      0)
                  ).toLocaleString("en-IN")}{" "}
                  BDT
                </TableCell>
              </TableRow>

              <TableRow sx={{ bgcolor: "#F2F7FF" }}>
                <TableCell sx={{ ...labelWhiteBg, color: "red" }}>
                  Due Clear Deadline
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "var(--primary-color)", fontSize: "12px" }}
                >
                  {moment(partialPaymentChargeData?.dueDate).format(
                    "DD MMMM YYYY hh:mm A"
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

const labelStyle = {
  bgcolor: "#18457B",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "400",
};

export default PartialPaymentTable;
