import {
  Box,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Typography,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { segmentTitleStyles } from "./FlightDetails";
import { btnStyle, labelStyle, labelWhiteBg, valueStyle } from "./FareSummary";

const tabs = [
  { id: 1, title: "Price Breakdown" },
  { id: 2, title: "Tax Breakdown" },
];

const FareDifferenceTable = ({
  flightData,
  priceBreakdown: priceDetails,
  status,
}) => {
  const [crrTab, setCrrTab] = useState(1);

  return (
    <Box>
      <Box sx={{ px: "2px" }}>
        <Box sx={{ display: "flex", gap: "15px", mb: "15px" }}>
          {tabs.map((tab, i) => {
            return (
              <Box
                key={i}
                onClick={() => {
                  setCrrTab(tab.id);
                }}
                sx={{
                  bgcolor:
                    crrTab === tab.id
                      ? "var(--primary-color)"
                      : "var(--third-color)",
                  border:
                    crrTab === tab.id
                      ? "1px solid var(--primary-color)"
                      : "1px solid var(--primary-color)",
                  borderRadius: "3px",
                  py: "4px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    ...segmentTitleStyles,
                    justifyContent: "center",
                    color: crrTab === tab.id ? "white" : "var(--primary-color)",
                  }}
                >
                  {tab.title}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {crrTab === 1 && (
          <ReissuePriceBreakdown
            priceDetails={priceDetails}
            flightData={flightData}
            status={status}
          />
        )}

        {crrTab === 2 && (
          <ReissuTaxBreakdown
            priceDetails={priceDetails}
            flightData={flightData}
          />
        )}
      </Box>
    </Box>
  );
};

// reissue search price breakdown
const ReissuePriceBreakdown = ({ priceDetails, flightData, status }) => {
  const [priceType, setPriceType] = useState({
    type: "total",
    paxNo: 0,
  });

  return (
    <Box>
      {priceType?.type === "total" && (
        <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
          <Table size="small" aria-label="fare difference table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...labelStyle, width: "180px" }}>
                  Label
                </TableCell>
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                >
                  Old Fare
                </TableCell>
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                >
                  New Fare
                </TableCell>
              </TableRow>

              {[
                { label: "Total Base Fare", key: "baseFare" },
                { label: "Total Tax", key: "tax" },
                { label: "Service Fee", key: "serviceFee" },
              ].map(({ label, key }) => (
                <TableRow key={key}>
                  <TableCell sx={{ ...labelStyle, width: "180px" }}>
                    {label}
                  </TableCell>
                  <TableCell
                    align="start"
                    sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                  >
                    {flightData?.fareDifference?.totalOldFareDifference?.[
                      key
                    ]?.toLocaleString("en-IN") || 0}{" "}
                    BDT
                  </TableCell>
                  <TableCell
                    align="start"
                    sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                  >
                    {flightData?.fareDifference?.totalNewFareDifference?.[
                      key
                    ]?.toLocaleString("en-IN") || 0}{" "}
                    BDT
                  </TableCell>
                </TableRow>
              ))}
            </TableHead>

            <TableBody>
              {[
                { label: "Customer Fare", key: "clientPrice" },
                { label: "Discount", key: "commission", isPrimary: true },
                { label: "After Discount Fare", isCalculated: true },
                { label: "AIT", key: "ait" },
                { label: "Agent Payable", key: "agentPrice" },
              ].map(({ label, key, isPrimary, isCalculated }) => {
                const oldData =
                  flightData?.fareDifference?.totalOldFareDifference || {};
                const newData =
                  flightData?.fareDifference?.totalNewFareDifference || {};

                const oldValue = isCalculated
                  ? (oldData.clientPrice || 0) - (oldData.commission || 0)
                  : (oldData[key] ?? 0);

                const newValue = isCalculated
                  ? (newData.clientPrice || 0) - (newData.commission || 0)
                  : (newData[key] ?? 0);

                const rowStyle =
                  label === "Discount"
                    ? { bgcolor: "#FFE6EB", color: "var(--primary-color)" }
                    : label === "AIT"
                      ? { bgcolor: "#b3ffb3", color: "green" }
                      : {};

                return (
                  <TableRow key={label}>
                    <TableCell
                      sx={{
                        ...labelWhiteBg,
                        width: "180px",
                        ...(isPrimary && { color: "var(--primary-color)" }),
                        ...rowStyle,
                      }}
                    >
                      {label}
                    </TableCell>
                    <TableCell
                      align="start"
                      sx={{ ...valueStyle, bgcolor: "#F2F7FF", ...rowStyle }}
                    >
                      {oldValue.toLocaleString("en-IN")} BDT
                    </TableCell>
                    <TableCell
                      align="start"
                      sx={{ ...valueStyle, bgcolor: "#F2F7FF", ...rowStyle }}
                    >
                      {newValue.toLocaleString("en-IN")} BDT
                    </TableCell>
                  </TableRow>
                );
              })}

              {[
                { label: "Fare Difference", key: "agentPrice" },
                { label: "FFI Service Fee", key: "serviceFee" },
                { label: "Airlines Charge", key: "airlineServiceFee" },
                { label: "Reissue Payable", key: "reIssuePayable" },
              ].map(({ label, key, isNewOnly }) => {
                const rowStyle =
                  label === "FFI Service Fee" || label === "Airlines Charge"
                    ? { bgcolor: "#b3ffb3", color: "green" }
                    : {};

                const value =
                  key === "reIssuePayable" &&
                  (flightData?.autoReissue === false ||
                    status === "reissue request")
                    ? "Will Be Decided"
                    : flightData?.fareDifference?.totalFareDifference?.[
                        key
                      ]?.toLocaleString("en-IN") || 0;

                return (
                  <TableRow key={label}>
                    <TableCell
                      sx={{ ...labelWhiteBg, width: "180px", ...rowStyle }}
                    >
                      {label}
                    </TableCell>
                    {!isNewOnly && (
                      <TableCell
                        align="start"
                        sx={{ ...valueStyle, bgcolor: "#F2F7FF", ...rowStyle }}
                      />
                    )}
                    <TableCell
                      align="start"
                      sx={{ ...valueStyle, bgcolor: "#F2F7FF", ...rowStyle }}
                    >
                      {value} {value !== "Will Be Decided" && "BDT"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {priceType?.type !== "total" && (
        <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...labelStyle, width: "180px" }}>
                  Label
                </TableCell>
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                >
                  Old Fare
                </TableCell>
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                >
                  New Fare
                </TableCell>
              </TableRow>
              {[
                { label: "Base Fare", key: "baseFare" },
                { label: "Tax", key: "tax" },
                { label: "Service Fee", key: "serviceFee" },
              ].map((row) => (
                <TableRow key={row.key}>
                  <TableCell sx={{ ...labelStyle, width: "180px" }}>
                    {row.label}
                  </TableCell>
                  <TableCell
                    align="start"
                    sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                  >
                    {priceDetails?.oldPriceBreakdown[priceType?.paxNo]?.[
                      row.key
                    ]?.toLocaleString("en-IN")}{" "}
                    BDT
                  </TableCell>
                  <TableCell
                    align="start"
                    sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                  >
                    {priceDetails?.newPriceBreakdown[priceType?.paxNo]?.[
                      row.key
                    ]?.toLocaleString("en-IN")}{" "}
                    BDT
                  </TableCell>
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {[
                { label: "Customer Fare", key: "clientPrice" },
                { label: "Discount", key: "commission" },
                {
                  label: "After Discount Fare",
                  custom: true,
                  getValue: (data) =>
                    data?.clientPrice && data?.commission
                      ? (data.clientPrice - data.commission).toLocaleString(
                          "en-IN"
                        )
                      : "",
                },
                { label: "Total AIT", key: "finalAit" },
                { label: "Agent Payable", key: "agentPrice" },
              ].map((row) => {
                const oldData =
                  priceDetails?.oldPriceBreakdown?.[priceType?.paxNo];
                const newData =
                  priceDetails?.newPriceBreakdown?.[priceType?.paxNo];

                const isDiscount = row.label === "Discount";
                const isAIT = row.label === "Total AIT";

                const rowStyle = isDiscount
                  ? { bgcolor: "#FFE6EB", color: "var(--primary-color)" }
                  : isAIT
                    ? { bgcolor: "#b3ffb3", color: "green" }
                    : {};

                return (
                  <TableRow key={row.label}>
                    <TableCell
                      sx={{ ...labelWhiteBg, width: "180px", ...rowStyle }}
                    >
                      {row.label}
                    </TableCell>
                    <TableCell
                      align="start"
                      sx={{ ...valueStyle, bgcolor: "#F2F7FF", ...rowStyle }}
                    >
                      {row.custom
                        ? `${row.getValue(oldData)} BDT`
                        : `${oldData?.[row.key]?.toLocaleString("en-IN") || 0} BDT`}
                    </TableCell>
                    <TableCell
                      align="start"
                      sx={{ ...valueStyle, bgcolor: "#F2F7FF", ...rowStyle }}
                    >
                      {row.custom
                        ? `${row.getValue(newData)} BDT`
                        : `${newData?.[row.key]?.toLocaleString("en-IN") || 0} BDT`}
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Fare Difference */}
              <TableRow>
                <TableCell sx={{ ...labelWhiteBg, width: "180px" }}>
                  Fare Difference
                </TableCell>
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                />
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                >
                  {priceDetails?.newPriceBreakdown?.[
                    priceType?.paxNo
                  ]?.differenceFare?.baseFare?.toLocaleString("en-IN") ||
                    0}{" "}
                  BDT
                </TableCell>
              </TableRow>

              {/* FFI Service Fee */}
              <TableRow sx={{ bgcolor: "#b3ffb3" }}>
                <TableCell
                  sx={{
                    ...labelWhiteBg,
                    width: "180px",
                    bgcolor: "#b3ffb3",
                    color: "green",
                  }}
                >
                  FFI Service Fee
                </TableCell>
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, color: "green" }}
                />
                <TableCell align="start" sx={{ ...valueStyle, color: "green" }}>
                  {priceDetails?.newPriceBreakdown?.[
                    priceType?.paxNo
                  ]?.differenceFare?.serviceFee?.toLocaleString("en-IN") ||
                    0}{" "}
                  BDT
                </TableCell>
              </TableRow>

              {/* Airlines Charge */}
              <TableRow sx={{ bgcolor: "#b3ffb3" }}>
                <TableCell
                  sx={{
                    ...labelWhiteBg,
                    width: "180px",
                    bgcolor: "#b3ffb3",
                    color: "green",
                  }}
                >
                  Airlines Charge
                </TableCell>
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, color: "green" }}
                />
                <TableCell align="start" sx={{ ...valueStyle, color: "green" }}>
                  {priceDetails?.newPriceBreakdown?.[
                    priceType?.paxNo
                  ]?.airlineServiceFee?.toLocaleString("en-IN") || 0}{" "}
                  BDT
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box
        sx={{
          display: "flex",
          gap: "10px",
          mt: "15px",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={() =>
            setPriceType({
              type: "total",
              paxNo: 0,
            })
          }
          sx={btnStyle(priceType.type === "total")}
        >
          Total Fare
        </Button>

        {priceDetails?.newPriceBreakdown?.map((pax, i) => (
          <Button
            key={i}
            onClick={() =>
              setPriceType({
                type: pax?.paxType,
                paxNo: i,
              })
            }
            sx={btnStyle(
              priceType.type === pax?.paxType && priceType.paxNo === i
            )}
          >
            {pax?.firstName}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

// reissue tax breakdown
const ReissuTaxBreakdown = ({ priceDetails, flightData }) => {
  const [priceType, setPriceType] = useState({
    type: "ADT",
    paxNo: 0,
  });

  const newDataTaxDetails =
    priceDetails?.newPriceBreakdown[priceType?.paxNo]?.taxDetails ||
    priceDetails?.newPriceBreakdown[priceType?.paxNo]?.allTax ||
    [];
  const oldDataTaxDetails =
    priceDetails?.oldPriceBreakdown[priceType?.paxNo]?.taxDetails ||
    priceDetails?.oldPriceBreakdown[priceType?.paxNo]?.allTax ||
    [];

  const taxMap = {};

  // Process old data
  for (const item of oldDataTaxDetails) {
    const code = item.code;
    if (!taxMap[code]) {
      taxMap[code] = { code, oldData: {}, newData: {} };
    }
    taxMap[code].oldData = item;
  }

  // Process new data
  for (const item of newDataTaxDetails) {
    const code = item.code;
    if (!taxMap[code]) {
      taxMap[code] = { code, oldData: {}, newData: {} };
    }
    taxMap[code].newData = item;
  }

  const uniqueTaxDetails = Object.values(taxMap);

  return (
    <Box>
      <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...labelStyle, width: "180px" }}>
                Tax Name
              </TableCell>
              <TableCell
                align="start"
                sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
              >
                Old Tax Amount
              </TableCell>
              <TableCell
                align="start"
                sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
              >
                New Tax Amount
              </TableCell>
            </TableRow>
            {uniqueTaxDetails?.map((tax, i) => (
              <TableRow key={i}>
                <TableCell sx={{ ...labelStyle, width: "180px" }}>
                  {tax?.code}
                </TableCell>
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                >
                  {tax?.oldData?.totalTaxAmount ?? tax?.oldData?.amount}{" "}
                  {(tax?.oldData?.totalTaxAmount || tax?.oldData?.amount) &&
                    "BDT"}
                </TableCell>
                <TableCell
                  align="start"
                  sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                >
                  {tax?.newData?.totalTaxAmount ?? tax?.newData?.amount} BDT
                </TableCell>
              </TableRow>
            ))}
          </TableHead>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          gap: "10px",
          mt: "15px",
          justifyContent: "flex-end",
        }}
      >
        {priceDetails?.newPriceBreakdown?.map((pax, i) => (
          <Button
            key={i}
            onClick={() =>
              setPriceType({
                type: pax?.paxType,
                paxNo: i,
              })
            }
            sx={btnStyle(
              priceType.type === pax?.paxType && priceType.paxNo === i
            )}
          >
            {pax?.firstName}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default FareDifferenceTable;
