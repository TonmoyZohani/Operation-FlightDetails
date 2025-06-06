import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { calculateAllPriceBreak } from "../../../helpers/calculateAllPriceBreak";
import { groupAndCalculateCNN } from "../../../helpers/groupAndCalculateCNN";
import useWindowSize from "../../../shared/common/useWindowSize";

const MobileFareSummary = ({ flightData, priceBreakdown }) => {
  const { isMobile } = useWindowSize();
  const [priceBreakdownData, setPriceBreakdownData] = useState([
    calculateAllPriceBreak(priceBreakdown),
  ]);
  const [activeType, setActiveType] = useState("totalFare");

  const uniquePaxTypes = [
    ...new Set(priceBreakdown.map((item) => item.paxType)),
  ];
  return (
    <Box sx={{ bgcolor: "white", borderRadius: "3px", p: 2 }}>
      <Grid container sx={{ pb: 1 }}>
        <Grid item xs={12 / (uniquePaxTypes.length + 1)}>
          <Typography
            sx={{
              bgcolor:
                activeType === "totalFare"
                  ? "var(--secondary-color)"
                  : "#F2F7FF",
              color:
                activeType === "totalFare"
                  ? "#F2F7FF"
                  : "var(--secondary-color)",
              px: 1,
              py: 0.5,
              borderRight: "1px solid var(--border)",
              fontSize: "14px",
            }}
            onClick={() => {
              setPriceBreakdownData([calculateAllPriceBreak(priceBreakdown)]);
              setActiveType("totalFare");
            }}
          >
            Total Fare
          </Typography>
        </Grid>
        {priceBreakdown?.map((item, index, arr) => {
          const isFirstCNN =
            item.paxType === "CNN" &&
            index === arr.findIndex((pax) => pax.paxType === "CNN");

          return (
            <Grid
              item
              xs={12 / (uniquePaxTypes.length + 1)}
              key={index}
              sx={{
                display:
                  isFirstCNN || item.paxType !== "CNN" ? "block" : "none",
              }}
            >
              <Typography
                sx={{
                  bgcolor:
                    activeType === item?.paxType
                      ? "var(--secondary-color)"
                      : "#F2F7FF",
                  color:
                    activeType === item?.paxType
                      ? "#F2F7FF"
                      : "var(--secondary-color)",
                  px: 1,
                  py: 0.5,
                  borderRight: "1px solid var(--border)",
                  fontSize: "14px",
                }}
                onClick={() => {
                  if (item?.paxType === "CNN") {
                    const groupedCNN = groupAndCalculateCNN(priceBreakdown);
                    setPriceBreakdownData(groupedCNN);
                  } else {
                    setPriceBreakdownData([item]);
                  }
                  setActiveType(item?.paxType);
                }}
              >
                {item?.paxType?.toLowerCase() === "adt"
                  ? "Adult"
                  : item?.paxType?.toLowerCase() === "cnn"
                    ? "Child"
                    : "Infant"}
              </Typography>
            </Grid>
          );
        })}
      </Grid>

      <Box>
        <TableContainer
          sx={{
            boxShadow: "none",
            borderRadius: "0px",
          }}
        >
          <Table size="small" aria-label="a dense table">
            {activeType !== "totalFare" && (
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ ...labelStyle, width: isMobile ? "170px" : "115px" }}
                  >
                    Pax Type
                  </TableCell>
                  {priceBreakdownData?.map((price, index) => {
                    return (
                      <TableCell
                        key={index}
                        align="end"
                        sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                      >
                        {(price?.paxType === "ADT" && "Adult") ||
                          (price?.paxType === "CNN" && "Child") ||
                          (price?.paxType === "INF" && "Infant")}

                        {price?.paxType === "CNN" && (
                          <span
                            style={{
                              color: "var(--primary-color)",
                              paddingLeft: "5px",
                            }}
                          >
                            ({price?.ageRange})
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
            )}

            <TableBody>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell sx={labelStyle}>Pax Count</TableCell>
                {priceBreakdownData?.map((price, index) => (
                  <TableCell key={index} align="center" sx={valueStyle}>
                    {parseInt(price?.paxCount)?.toLocaleString("en-IN") || 0}
                  </TableCell>
                ))}
              </TableRow>

              {activeType !== "totalFare" && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell sx={labelStyle}>Base Fare</TableCell>
                  {priceBreakdownData?.map((price, index) => (
                    <TableCell key={index} align="center" sx={valueStyle}>
                      {parseInt(price?.baseFare)?.toLocaleString("en-IN") || 0}{" "}
                      BDT
                    </TableCell>
                  ))}
                </TableRow>
              )}

              {activeType !== "totalFare" && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell sx={labelStyle}>Tax</TableCell>
                  {priceBreakdownData?.map((price, index) => (
                    <TableCell key={index} align="center" sx={valueStyle}>
                      {parseInt(price?.tax)?.toLocaleString("en-IN") || 0} BDT
                    </TableCell>
                  ))}
                </TableRow>
              )}

              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell sx={labelStyle}>Total Base Fare</TableCell>
                {priceBreakdownData?.map((price, index) => (
                  <TableCell key={index} align="center" sx={valueStyle}>
                    {parseInt(price?.totalBaseFare)?.toLocaleString("en-IN") ||
                      0}{" "}
                    BDT
                  </TableCell>
                ))}
              </TableRow>

              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell sx={labelStyle}>Total Tax</TableCell>
                {priceBreakdownData?.map((price, index) => (
                  <TableCell key={index} align="center" sx={valueStyle}>
                    {parseInt(price?.totalTaxAmount)?.toLocaleString("en-IN") ||
                      0}{" "}
                    BDT
                  </TableCell>
                ))}
              </TableRow>

              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell sx={labelStyle}>Service Fee</TableCell>
                {priceBreakdownData?.map((price, index) => (
                  <TableCell key={index} align="center" sx={valueStyle}>
                    {parseInt(price?.serviceFee)?.toLocaleString("en-IN") || 0}{" "}
                    BDT
                  </TableCell>
                ))}
              </TableRow>

              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell sx={labelStyle}>Subtotal</TableCell>
                {priceBreakdownData?.map((price, index) => (
                  <TableCell key={index} align="center" sx={valueStyle}>
                    {parseInt(price?.totalAmount)?.toLocaleString("en-IN") || 0}{" "}
                    BDT
                  </TableCell>
                ))}
              </TableRow>
              {/* 
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell sx={labelStyle}>AIT</TableCell>
                {priceBreakdownData?.map((price, index) => {
                  return (
                    <TableCell key={index} align="center" sx={valueStyle}>
                      {parseInt(
                        price?.finalAit * price?.paxCount
                      )?.toLocaleString("en-IN") || 0}{" "}
                      BDT
                    </TableCell>
                  );
                })}
              </TableRow> */}

              {activeType === "totalFare" && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell sx={labelWhiteBg}>Customer Fare</TableCell>
                  <TableCell
                    colSpan={priceBreakdownData?.length}
                    align="center"
                    sx={{ ...valueStyle, width: isMobile ? "170px" : "115px" }}
                  >
                    {parseInt(flightData?.clientPrice)?.toLocaleString("en-IN")}{" "}
                    BDT
                  </TableCell>
                </TableRow>
              )}

              {activeType === "totalFare" && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell
                    sx={{ ...labelWhiteBg, color: "var(--primary-color)" }}
                  >
                    Discount
                  </TableCell>

                  <TableCell
                    colSpan={priceBreakdownData?.length}
                    align="center"
                    sx={{ ...valueStyle, color: "var(--primary-color)" }}
                  >
                    {parseInt(flightData?.commission)?.toLocaleString("en-IN")}{" "}
                    BDT
                  </TableCell>
                </TableRow>
              )}
              {activeType === "totalFare" && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell
                    sx={{ ...labelWhiteBg, color: "var(--secondary-color)" }}
                  >
                    After Discount Fare
                  </TableCell>

                  <TableCell
                    colSpan={priceBreakdownData?.length}
                    align="center"
                    sx={{ ...valueStyle, color: "var(--secondary-color)" }}
                  >
                    {parseInt(
                      flightData?.commission + flightData?.clientPrice
                    )?.toLocaleString("en-IN")}{" "}
                    BDT
                  </TableCell>
                </TableRow>
              )}
              {activeType === "totalFare" && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell
                    sx={{ ...labelWhiteBg, color: "var(--secondary-color)" }}
                  >
                    Total AIT
                  </TableCell>

                  {priceBreakdownData?.map((price, index) => {
                    return (
                      <TableCell key={index} align="center" sx={valueStyle}>
                        {parseInt(
                          price?.finalAit * price?.paxCount
                        )?.toLocaleString("en-IN") || 0}{" "}
                        BDT
                      </TableCell>
                    );
                  })}
                </TableRow>
              )}
              {activeType === "totalFare" && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell
                    sx={{ ...labelWhiteBg, color: "var(--secondary-color)" }}
                  >
                    Extra Additional Amount
                  </TableCell>

                  {priceBreakdownData?.map((price, index) => {
                    return (
                      <TableCell key={index} align="center" sx={valueStyle}>
                        {priceBreakdown
                          .reduce(
                            (acc, price) =>
                              acc + price?.additionalInfo?.additionAmount,
                            0
                          )
                          .toFixed(2) || 0}{" "}
                        BDT
                      </TableCell>
                    );
                  })}
                </TableRow>
              )}

              {activeType === "totalFare" && (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell sx={labelWhiteBg}>Agent Payable</TableCell>

                  <TableCell
                    colSpan={priceBreakdownData?.length}
                    align="center"
                    sx={valueStyle}
                  >
                    {parseInt(flightData?.agentPrice)?.toLocaleString("en-IN")}{" "}
                    BDT
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const labelStyle = {
  bgcolor: "#18457B",
  color: "var(--white)",
  fontSize: "12px",
  fontWeight: "400",
};

const valueStyle = {
  color: "var(--secondary-color)",
  fontSize: "12px",
  textAlign: "right",
};

const labelWhiteBg = {
  bgcolor: "#F2F7FF",
  fontSize: "12px",
  fontWeight: "400",
  color: "var(--secondary-color)",
};

export default MobileFareSummary;
