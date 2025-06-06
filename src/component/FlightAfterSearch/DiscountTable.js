import {
  Box,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
} from "@mui/material";
import React from "react";
import useWindowSize from "../../shared/common/useWindowSize";

const DiscountTable = ({
  flightData,
  priceBreakdown,
  flightAfterSearch,
  bookingData,
}) => {
  const { isMobile } = useWindowSize();

  return (
    <Box
      sx={{
        px: {
          xs: 2,
          lg: 2,
        },
        py: {
          xs: 2,
          lg: 0,
        },
      }}
    >
      <Box>
        <TableContainer
          sx={{
            boxShadow: "none",
            borderRadius: "0px",
          }}
        >
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#18457B",
                    color: "var(--white)",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  Description
                </TableCell>

                <TableCell
                  // key={index}

                  align="center"
                  sx={{
                    bgcolor: "#F2F7FF",
                    fontWeight: "400",
                    color: "var(--secondary-color)",
                    fontSize: "12px",
                    textAlign: "right",
                    width: isMobile ? "50%" : "80%",
                  }}
                >
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  sx={{
                    bgcolor: "#18457B",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  Customer Invoice
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {parseInt(flightData?.clientPrice).toLocaleString("en-IN") ||
                    0}{" "}
                  BDT
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  sx={{
                    bgcolor: "#18457B",
                    color: "var(--white)",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  Commission
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {parseInt(flightData?.commission).toLocaleString("en-IN") ||
                    0}{" "}
                  BDT
                </TableCell>
              </TableRow>

              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  sx={{
                    bgcolor: "#18457B",
                    color: "var(--white)",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  After Discount Fare
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {parseInt(
                    flightData?.clientPrice - flightData?.commission
                  )?.toLocaleString("en-IN")}
                  BDT
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  sx={{
                    bgcolor: "#18457B",
                    color: "var(--white)",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  Total AIT
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {flightAfterSearch === "reissue-search" ||
                  bookingData === "reissue booking"
                    ? flightData?.fareDifference?.totalFareDifference?.ait
                    : priceBreakdown
                        .reduce((acc, price) => acc + price?.finalAit, 0)
                        .toFixed(2) || 0}{" "}
                  BDT
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  sx={{
                    bgcolor: "#18457B",
                    color: "var(--white)",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  Agent Invoice
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {parseInt(flightData?.agentPrice).toLocaleString("en-IN") ||
                    0}{" "}
                  BDT
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DiscountTable;
