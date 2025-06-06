import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const FareTooltip = ({ flightData }) => {
  return (
    <Box sx={{ " .MuiTableCell-root": { fontSize: "12px" } }}>
      <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Pax Type</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "right" }}>
                Base Fare
              </TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
                Tax
              </TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "right" }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {flightData?.priceBreakdown.map((price, i) => (
              <TableRow key={i}>
                <TableCell>
                  {price?.paxType}({price?.paxCount})
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {price?.totalBaseFare?.toLocaleString("en-IN")}{" "}
                  {price?.currency}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {price?.totalTaxAmount?.toLocaleString("en-IN")}{" "}
                  {price?.currency}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  {price?.totalAmount?.toLocaleString("en-IN")}{" "}
                  {price?.currency}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>Gross Fare</TableCell>
              <TableCell sx={{ textAlign: "right" }}>
                {flightData?.clientPrice?.toLocaleString("en-IN")} BDT{" "}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={3}
                sx={{
                  color:
                    flightData?.commission < 0
                      ? "var(--green)"
                      : "var(--primary-color)",
                }}
              >
                {flightData?.commission < 0 ? "Additional Amount" : "Discount"}
              </TableCell>
              <TableCell
                sx={{ textAlign: "right", color: "var(--primary-color)" }}
              >
                {Math.abs(flightData?.commission)?.toLocaleString("en-IN")} BDT{" "}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} sx={{ color: "var(--green)" }}>
                Total AIT
              </TableCell>
              <TableCell sx={{ color: "var(--green)" }}>
                +{" "}
                {flightData?.priceBreakdown
                  .reduce(
                    (acc, price) => acc + price?.finalAit * price?.paxCount,
                    0
                  )
                  .toFixed(2) || 0}{" "}
                BDT
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} sx={{ borderBottom: "0" }}>
                Total Agent Fare
              </TableCell>
              <TableCell sx={{ textAlign: "right", borderBottom: "0" }}>
                {flightData?.agentPrice?.toLocaleString("en-IN")} BDT{" "}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FareTooltip;
