import {
  Box,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Alert,
} from "@mui/material";
import React from "react";
import { AirlineChargeNotice } from "../ViewFare/ViewFare";

const PolicyTable = ({
  charges,
  priceBreakdown,
  flightAfterSearch,
  bookingData,
}) => {
  const groupedPriceBreakdown =
    flightAfterSearch === "reissue-search" || bookingData === "reissue booking"
      ? priceBreakdown?.newPriceBreakdown?.reduce(
          (result, passenger) => {
            const type = passenger.paxType;
            result[type] = (result[type] || 0) + 1;
            return result;
          },
          { ADT: 0, CNN: 0, INF: 0 }
        )
      : priceBreakdown.reduce((acc, item) => {
          const key = item.paxType.toLowerCase();
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {});

  return (
    <>
      <AirlineChargeNotice />
      <Box mt={2}>
        <FFIChargesNotice />
      </Box>
      <Box sx={{ px: { xs: 2, lg: 2 }, mt: 2 }}>
        <Box>
          <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...headerStyle,
                      bgcolor: "#18457B",
                      color: "var(--white)",
                    }}
                  >
                    Policy
                  </TableCell>

                  {flightAfterSearch === "reissue-search" ||
                  bookingData === "reissue booking"
                    ? // Reissue search version - shows counts (ADTx2)
                      Object.entries(groupedPriceBreakdown)
                        .filter(([_, count]) => count > 0)
                        .map(([type, count]) => (
                          <TableCell key={type} align="center" sx={headerStyle}>
                            {type.toUpperCase()}×{count}
                          </TableCell>
                        ))
                    : // Regular version - shows grouped counts (ADT x 2)
                      Object.entries(groupedPriceBreakdown)
                        .filter(([_, items]) => items.length > 0)
                        .map(([type, items]) => (
                          <TableCell key={type} align="center" sx={headerStyle}>
                            {type.toUpperCase()} × {items.length}
                          </TableCell>
                        ))}

                  <TableCell
                    align="center"
                    sx={{ ...headerStyle, width: "45%" }}
                  >
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={secondaryText}>Refund</TableCell>

                  {flightAfterSearch === "reissue-search" ||
                  bookingData === "reissue booking"
                    ? // Reissue search version - using counts from groupedPriceBreakdown object
                      Object.entries(groupedPriceBreakdown)
                        .filter(([_, count]) => count > 0)
                        .map(([type, count], i) => {
                          const charge =
                            charges?.refundCharge?.[i]?.serviceCharge || 0;
                          return (
                            <TableCell key={type} sx={valueStyle}>
                              {charge} × {count} = {charge * count} BDT
                            </TableCell>
                          );
                        })
                    : // Regular version - using grouped passenger data
                      Object.entries(groupedPriceBreakdown)
                        .filter(([_, items]) => items.length > 0)
                        .map(([type, items], i) => {
                          const charge =
                            charges?.refundCharge?.[i]?.serviceCharge || 0;
                          const count = items.length;
                          return (
                            <TableCell key={type} sx={valueStyle}>
                              {charge} × {count} = {charge * count} BDT
                            </TableCell>
                          );
                        })}

                  <TableCell sx={valueStyle}>
                    Paid Amount - (Airline Cancellation Fee + Service Charge)
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={secondaryText}>Reissue</TableCell>
                  {flightAfterSearch === "reissue-search" ||
                  bookingData === "reissue booking"
                    ? // Reissue search version - using counts from groupedPriceBreakdown
                      Object.entries(groupedPriceBreakdown)
                        .filter(([_, count]) => count > 0)
                        .map(([type, count], i) => {
                          const charge =
                            charges?.reIssueCharge?.[i]?.serviceCharge || 0;
                          return (
                            <TableCell key={type} sx={valueStyle}>
                              {charge} × {count} = {charge * count} BDT
                            </TableCell>
                          );
                        })
                    : // Regular version - using grouped passenger data
                      Object.entries(groupedPriceBreakdown)
                        .filter(([_, items]) => items.length > 0)
                        .map(([type, items], i) => {
                          const charge =
                            charges?.reIssueCharge?.[i]?.serviceCharge || 0;
                          const count = items.length;
                          return (
                            <TableCell key={type} sx={valueStyle}>
                              {charge} × {count} = {charge * count} BDT
                            </TableCell>
                          );
                        })}

                  <TableCell sx={valueStyle}>
                    Airline’s Fee + Fare Difference (If Applicable) + Tax
                    Difference (If Applicable) + Service Charge
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={secondaryText}>Void</TableCell>
                  {flightAfterSearch === "reissue-search" ||
                  bookingData === "reissue booking"
                    ? // Reissue search version - simple count display
                      Object.entries(groupedPriceBreakdown)
                        .filter(([_, count]) => count > 0)
                        .map(([type, count], i) => {
                          const charge =
                            charges?.voidCharge?.[i]?.serviceCharge || 0;
                          const total = charge * count;
                          return (
                            <TableCell key={`void-${type}`} sx={valueStyle}>
                              {charge} × {count} = {total} BDT
                            </TableCell>
                          );
                        })
                    : // Regular version - grouped passenger data
                      Object.entries(groupedPriceBreakdown)
                        .filter(([_, items]) => items?.length > 0)
                        .map(([type, items], i) => {
                          const charge =
                            charges?.voidCharge?.[i]?.serviceCharge || 0;
                          const count = items.length;
                          const total = charge * count;
                          return (
                            <TableCell key={`void-${type}`} sx={valueStyle}>
                              {charge} × {count} = {total} BDT
                            </TableCell>
                          );
                        })}

                  <TableCell sx={valueStyle}>Service Charge</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

const FFIChargesNotice = () => {
  return (
    <Box
      sx={{
        px: "15px",
        ".MuiSvgIcon-root": { color: "#1e462e" },
      }}
    >
      <Alert
        severity="info"
        sx={{
          border: "1px solid #1e462e",
          bgcolor: "#EDF7ED",
          color: "#1e462e",
          fontSize: "12px",
          padding: "0px 10px",
        }}
      >
        <span style={{ fontWeight: "600" }}>
          Fly Far Service Charges Notes:
        </span>{" "}
        Fly Far International's service charges are subject to variation based
        on global currency exchange rate fluctuations, updates to Global
        Distribution System (GDS) policies, passenger categories, routes, and
        travel destination types. These charges are non-refundable and applied
        on a per-passenger basis. For the most accurate and up-to-date
        information, please review the service charge details at the time of
        booking.
      </Alert>
    </Box>
  );
};

const headerStyle = {
  bgcolor: "#F2F7FF",
  fontWeight: "400",
  color: "var(--secondary-color)",
  fontSize: "12px",
  textAlign: "left",
};

const valueStyle = {
  color: "var(--secondary-color)",
  fontSize: "12px",
};

const secondaryText = {
  bgcolor: "#18457B",
  color: "var(--white)",
  fontSize: "12px",
};

export default PolicyTable;
