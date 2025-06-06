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
import React, { useEffect, useState } from "react";
import { segmentTitleStyles } from "./FlightDetails";

const tabs = [
  { id: 1, title: "Price Breakdown" },
  { id: 2, title: "Tax Breakdown" },
];

const areAgesEqual = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, idx) => val === arr2[idx]);
};

const FareSummary = ({
  flightData,
  priceBreakdown,
  flightAfterSearch,
  bookingData,
  bookType,
}) => {
  const [crrTab, setCrrTab] = useState(1);

  const priceDetails = Array.isArray(priceBreakdown)
    ? priceBreakdown
    : priceBreakdown?.newPriceBreakdown;

  // console.log(flightData);

  return (
    <Box>
      <Box sx={{ px: 2 }}>
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

        {crrTab === 1 ? (
          <PriceBreakdown
            priceDetails={
              bookType === "afterSearch" ||
              flightAfterSearch === "reissue-search"
                ? priceDetails
                : getUniquePaxTypes(priceDetails)
            }
            flightData={flightData}
            bookType={bookType}
            priceBreakdown={priceBreakdown}
            flightAfterSearch={flightAfterSearch}
          />
        ) : (
          <TaxBreakdown
            priceDetails={
              bookType === "afterSearch" ||
              flightAfterSearch === "reissue-search"
                ? priceDetails
                : getUniquePaxTypes(priceDetails)
            }
            flightData={flightData}
            bookType={bookType}
          />
        )}
      </Box>
    </Box>
  );
};

// normal search price breakdown
const PriceBreakdown = ({
  priceDetails,
  flightData,
  bookType,
  priceBreakdown: allPrice,
  flightAfterSearch,
}) => {
  const [crrPax, setCrrPax] = useState("total");
  const [priceBreakdown, setPriceBreakdown] = useState([...priceDetails]);

  useEffect(() => {
    if (crrPax === "total") {
      setPriceBreakdown(
        bookType === "afterSearch" || flightAfterSearch === "reissue-search"
          ? getUniquePaxTypes(priceDetails)
          : [...priceDetails]
      );
    } else {
      setPriceBreakdown([priceDetails?.at(crrPax)]);
    }
  }, [crrPax, priceDetails]);

  const customerFarePerPax =
    priceBreakdown.reduce(
      (acc, price) => acc + (price?.baseFare + price?.tax),
      0
    ) || 0;

  const commissionPerPax =
    priceBreakdown.reduce((acc, price) => acc + price?.singleCommission, 0) ||
    0;

  const afterDiscountFarePerPax = customerFarePerPax - commissionPerPax;

  // reissue fares
  const total = flightData?.fareDifference
    ? flightData?.fareDifference?.totalNewFareDifference
    : {};

  return (
    <>
      <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
        <Table size="small" aria-label="a dense table">
          <TableBody>
            {(bookType === "afterSearch" ||
              flightAfterSearch === "reissue-search") &&
              typeof crrPax === "number" && (
                <TableRow>
                  <TableCell sx={{ ...labelStyle, width: "160px" }}>
                    Pax Name
                  </TableCell>

                  {priceBreakdown?.map((price, index) => {
                    return (
                      <TableCell
                        key={index}
                        align="end"
                        sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                      >
                        <Typography sx={{ fontSize: "12px" }}>
                          {price?.firstName} {price?.lastName}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              )}

            <TableRow>
              <TableCell sx={{ ...labelStyle, width: "160px" }}>
                {crrPax === "total" ||
                bookType === "afterSearch" ||
                flightAfterSearch === "reissue-search"
                  ? "Pax Type"
                  : "Label"}
              </TableCell>
              {priceBreakdown?.map((price, index) => {
                return (
                  <TableCell
                    key={index}
                    align="end"
                    sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}
                  >
                    {crrPax === "total" ||
                    bookType === "afterSearch" ||
                    flightAfterSearch === "reissue-search" ? (
                      <>
                        {(price?.paxType === "ADT" && "Adult") ||
                          (price?.paxType === "CNN" && "Child") ||
                          (price?.paxType === "INF" && "Infant")}

                        {price?.paxType === "CNN" && price?.age && (
                          <span
                            style={{
                              color: "var(--primary-color)",
                              paddingLeft: "5px",
                            }}
                          >
                            {Array.isArray(price?.age) ? (
                              <>
                                ({price?.age?.map((item) => item).join(",")})
                                Years
                              </>
                            ) : (
                              <>{price?.age} Years </>
                            )}
                          </span>
                        )}
                      </>
                    ) : (
                      "Fare For Single PAX"
                    )}
                  </TableCell>
                );
              })}
            </TableRow>

            {crrPax === "total" && (
              <TableRow sx={{ bgcolor: "#F2F7FF" }}>
                <TableCell sx={labelStyle}>Pax Count</TableCell>
                {priceBreakdown?.map((price, index) => (
                  <TableCell key={index} align="center" sx={valueStyle}>
                    {parseInt(price?.paxCount)?.toLocaleString("en-IN") || 0}
                  </TableCell>
                ))}
              </TableRow>
            )}

            <TableRow sx={{ bgcolor: "#F2F7FF" }}>
              <TableCell sx={labelStyle}>Base Fare</TableCell>
              {priceBreakdown?.map((price, index) => (
                <TableCell key={index} align="center" sx={valueStyle}>
                  {parseInt(price?.baseFare)?.toLocaleString("en-IN") || 0} BDT
                </TableCell>
              ))}
            </TableRow>

            <TableRow sx={{ bgcolor: "#F2F7FF" }}>
              <TableCell sx={labelStyle}>Tax</TableCell>
              {priceBreakdown?.map((price, index) => (
                <TableCell key={index} align="center" sx={valueStyle}>
                  {parseInt(price?.tax)?.toLocaleString("en-IN") || 0} BDT
                </TableCell>
              ))}
            </TableRow>

            {crrPax === "total" && (
              <TableRow sx={{ bgcolor: "#F2F7FF" }}>
                <TableCell sx={labelStyle}>Total Base Fare</TableCell>
                {priceBreakdown?.map((price, index) => (
                  <TableCell key={index} align="center" sx={valueStyle}>
                    {parseInt(
                      price?.totalBaseFare * price?.paxCount
                    )?.toLocaleString("en-IN") || 0}{" "}
                    BDT
                  </TableCell>
                ))}
              </TableRow>
            )}

            {crrPax === "total" && (
              <TableRow sx={{ bgcolor: "#F2F7FF" }}>
                <TableCell sx={labelStyle}>Total Tax</TableCell>
                {priceBreakdown?.map((price, index) => (
                  <TableCell key={index} align="center" sx={valueStyle}>
                    {parseInt(
                      price?.totalTaxAmount * price?.paxCount
                    )?.toLocaleString("en-IN") || 0}{" "}
                    BDT
                  </TableCell>
                ))}
              </TableRow>
            )}

            {crrPax === "total" && (
              <TableRow sx={{ bgcolor: "#F2F7FF" }}>
                <TableCell sx={labelStyle}>Subtotal</TableCell>
                {priceBreakdown?.map((price, index) => (
                  <TableCell key={index} align="center" sx={valueStyle}>
                    {parseInt(
                      price?.totalAmount * price?.paxCount
                    )?.toLocaleString("en-IN") || 0}{" "}
                    BDT
                  </TableCell>
                ))}
              </TableRow>
            )}

            <TableRow sx={{ bgcolor: "#F2F7FF" }}>
              <TableCell sx={labelWhiteBg}>Customer Fare</TableCell>
              <TableCell
                colSpan={priceBreakdown?.length}
                align="center"
                sx={valueStyle}
              >
                {parseInt(
                  crrPax === "total"
                    ? flightData?.clientPrice || total?.clientPrice
                    : customerFarePerPax
                )?.toLocaleString("en-IN")}{" "}
                BDT
              </TableCell>
            </TableRow>

            <TableRow sx={{ bgcolor: "#F2F7FF" }}>
              <TableCell
                sx={{
                  ...labelWhiteBg,
                  bgcolor:
                    parseInt(flightData?.commission) < 0 ? "green" : "red",
                  color: "var(--white)",
                }}
              >
                {parseInt(flightData?.commission) < 0
                  ? "Additional Amount"
                  : "Discount"}
              </TableCell>

              <TableCell
                colSpan={priceBreakdown?.length}
                align="center"
                sx={{
                  ...valueStyle,
                  bgcolor: "#FFE6EB",
                  color: "var(--primary-color)",
                }}
              >
                {parseInt(
                  crrPax === "total" ? flightData?.commission : commissionPerPax
                )?.toLocaleString("en-IN")}{" "}
                BDT
              </TableCell>
            </TableRow>

            <TableRow sx={{ bgcolor: "#F2F7FF" }}>
              <TableCell sx={labelWhiteBg}>
                After{" "}
                {parseInt(flightData?.commission) < 0
                  ? "Additional Amount"
                  : "Discount"}{" "}
              </TableCell>

              <TableCell
                colSpan={priceBreakdown?.length}
                align="center"
                sx={valueStyle}
              >
                {parseInt(
                  crrPax === "total"
                    ? flightData?.clientPrice - flightData?.commission ||
                        total?.clientPrice - total?.commission
                    : afterDiscountFarePerPax
                )?.toLocaleString("en-IN")}{" "}
                BDT
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                sx={{ ...labelWhiteBg, color: "#fff", bgcolor: "green" }}
              >
                Total AIT
              </TableCell>
              <TableCell
                colSpan={priceBreakdown?.length}
                align="center"
                sx={{ ...valueStyle, bgcolor: "#9cf3a8", color: "green" }}
              >
                {crrPax === "total"
                  ? priceDetails
                      .reduce((acc, price) => acc + price?.finalAit, 0)
                      .toFixed(2)
                  : priceBreakdown
                      .reduce((acc, price) => acc + price?.singleAit, 0)
                      .toFixed(2)}{" "}
                BDT
              </TableCell>
            </TableRow>

            {Array.isArray(allPrice) && (
              <TableRow sx={{ bgcolor: "#F2F7FF" }}>
                <TableCell sx={labelWhiteBg}>
                  Extra{" "}
                  {priceBreakdown?.reduce(
                    (acc, price) =>
                      acc + (price?.additionalInfo?.additionAmount ?? 0),
                    0
                  ) < 0
                    ? "Discount"
                    : "Additional"}{" "}
                  Amount
                </TableCell>

                <TableCell
                  colSpan={priceBreakdown?.length}
                  align="center"
                  sx={valueStyle}
                >
                  {priceBreakdown?.at(0)?.additionalInfo?.individual ? (
                    <>
                      {priceBreakdown
                        ?.reduce(
                          (acc, price) =>
                            acc + (price?.additionalInfo?.additionAmount ?? 0),
                          0
                        )
                        .toLocaleString("en-IN")}{" "}
                      BDT{" "}
                    </>
                  ) : (
                    `${priceBreakdown?.at(0)?.additionalInfo?.additionAmount ?? 0} BDT`
                  )}
                </TableCell>
              </TableRow>
            )}

            <TableRow sx={{ bgcolor: "#F2F7FF" }}>
              <TableCell sx={labelWhiteBg}>Agent Payable</TableCell>

              <TableCell
                colSpan={priceBreakdown?.length}
                align="center"
                sx={valueStyle}
              >
                {parseInt(
                  crrPax === "total"
                    ? flightData?.agentPrice || total?.agentPrice
                    : priceBreakdown.reduce(
                        (acc, price) => acc + price?.agentPrice,
                        0
                      )
                )?.toLocaleString("en-IN")}{" "}
                BDT
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", gap: "10px", justifyContent: "end", mt: 2 }}>
        <Button
          onClick={() => setCrrPax("total")}
          sx={btnStyle(crrPax === "total")}
        >
          Total Fare
        </Button>
        <PaxTab
          priceDetails={priceDetails}
          crrPax={crrPax}
          setCrrPax={setCrrPax}
        />
      </Box>
    </>
  );
};

// normal tax breakdown
const TaxBreakdown = ({ priceDetails, bookType }) => {
  const [crrPax, setCrrPax] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState([]);

  useEffect(() => {
    setPriceBreakdown([priceDetails?.at(crrPax)]);
  }, [crrPax, priceDetails]);

  const totalPayableTax =
    priceBreakdown?.reduce((acc, item) => acc + (item?.tax || 0), 0) || 0;

  return (
    <>
      <TableContainer sx={{ boxShadow: "none", borderRadius: "0px" }}>
        <Table size="small" aria-label="Tax Breakdown Table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...labelStyle, width: "160px" }}>
                TAX Name
              </TableCell>
              <TableCell align="end" sx={{ ...valueStyle, bgcolor: "#F2F7FF" }}>
                Tax Amount
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {priceBreakdown?.map((price, index) =>
              (price?.allTax || price?.taxDetails)?.map((tax, i) => (
                <TableRow key={`${index}-${i}`}>
                  <TableCell sx={labelStyle}>{tax?.code || "N/A"}</TableCell>
                  <TableCell align="end" sx={valueStyle}>
                    {(tax?.amount || 0)?.toLocaleString("en-IN")}{" "}
                    {tax?.currency || "BDT"}
                  </TableCell>
                </TableRow>
              ))
            )}

            <TableRow>
              <TableCell sx={labelWhiteBg}>Total Payable Tax</TableCell>
              <TableCell align="end" sx={valueStyle}>
                {totalPayableTax?.toLocaleString("en-IN")} BDT
              </TableCell>
            </TableRow>

            {bookType === "afterSearch" && (
              <TableRow>
                <TableCell sx={labelWhiteBg}>Pax Type</TableCell>
                <TableCell align="end" sx={valueStyle}>
                  {priceBreakdown?.at(0)?.paxType}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", gap: "10px", justifyContent: "end", mt: 2 }}>
        <PaxTab
          priceDetails={priceDetails}
          crrPax={crrPax}
          setCrrPax={setCrrPax}
        />
      </Box>
    </>
  );
};

const PaxTab = ({ priceDetails, crrPax, setCrrPax }) => {
  const priceDetailsWithIndex = priceDetails.map((item, i) => ({
    ...item,
    index: i,
  }));

  return (
    <>
      {priceDetailsWithIndex?.slice(0, 4)?.map((rules, i) => {
        const { paxType, age } = rules;

        return (
          <Button
            key={i}
            onClick={() => setCrrPax(rules?.index)}
            sx={btnStyle(crrPax === i)}
          >
            {rules?.firstName ? (
              rules?.firstName + " " + rules?.lastName
            ) : (
              <>
                {paxType === "ADT"
                  ? "Adult"
                  : paxType === "INF"
                    ? "Infant"
                    : "Child"}

                {Array.isArray(age) && age.length > 0 ? (
                  <>
                    {" ("}
                    {age.map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && ", "}
                        {item}
                      </React.Fragment>
                    ))}
                    {")"}
                  </>
                ) : age && paxType === "CNN" ? (
                  <> ({age}) Years </>
                ) : (
                  ""
                )}
              </>
            )}
          </Button>
        );
      })}

      {priceDetailsWithIndex?.slice(4).length > 0 && (
        <select
          onChange={(e) => setCrrPax(Number(e.target.value))}
          style={{
            fontSize: "12px",
            border: "1px solid var(--secondary-color)",
            borderRadius: "3px",
            padding: "0 5px",
            outline: "none",
            color: crrPax > 3 ? "#fff" : "var(--secondary-color)",
            backgroundColor: crrPax > 3 ? "var(--secondary-color)" : "#fff",
          }}
        >
          {priceDetailsWithIndex?.slice(4).map((item, i) => (
            <option key={i} value={item?.index}>
              {item?.firstName
                ? item?.firstName + " " + item?.lastName
                : item?.paxType}{" "}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

export const labelStyle = {
  bgcolor: "#18457B",
  color: "var(--white)",
  fontSize: "12px",
  fontWeight: "400",
};

export const valueStyle = {
  color: "var(--secondary-color)",
  fontSize: "12px",
  textAlign: "right",
};

export const labelWhiteBg = {
  bgcolor: "#F2F7FF",
  fontSize: "12px",
  fontWeight: "400",
  color: "var(--secondary-color)",
};

export const commonBtn = {
  backgroundColor: "transparent",
  padding: "5px 10px",
  borderRadius: "3px",
  fontSize: "12px",
  height: "30px",
  textTransform: "capitalize",
  minWidth: "100px",
};

export const btnStyle = (isActive) => ({
  ...commonBtn,
  backgroundColor: isActive ? "var(--secondary-color)" : "transparent",
  color: isActive ? "white" : "var(--secondary-color)",
  border: "1px solid var(--secondary-color)",
  ":hover": { color: "#fff", backgroundColor: "var(--secondary-color)" },
});

const getUniquePaxTypes = (priceBreakdown) => {
  const resultMap = new Map();

  for (const pax of priceBreakdown) {
    let key = pax.paxType;

    if (pax.paxType === "CNN" && pax.age != null) {
      if (pax.age >= 2 && pax.age <= 4) {
        key += "_2to4";
      } else if (pax.age >= 5 && pax.age <= 11) {
        key += "_5to11";
      } else {
        continue;
      }
    }

    key += `_tax${pax.tax}`;

    if (!resultMap.has(key)) {
      resultMap.set(key, { ...pax });
    } else {
      const existing = resultMap.get(key);
      existing.paxCount += pax.paxCount;
    }
  }

  const result = Array.from(resultMap.values());

  return result;
};

export default FareSummary;
