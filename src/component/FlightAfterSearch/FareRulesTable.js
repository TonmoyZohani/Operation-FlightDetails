import {
  Box,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Alert,
  Skeleton,
} from "@mui/material";
import React, { useState } from "react";
import { FareDetails } from "../ViewFare/AfterViewCard";

const FareRulesTable = ({
  structure,
  nonStructure,
  flightData,
  isAfterFareLoading,
}) => {
  const [showFareRules, setShowFareRules] = useState(false);
  const handleDrawerClose = () => {
    setShowFareRules((prev) => !prev);
  };

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
        <>
          <Box
            mb={2}
            sx={{ ".MuiSvgIcon-root": { color: "var(--primary-color)" } }}
          >
            {/* {flightBrandId} */}
            <Alert
              severity="info"
              sx={{
                border: "1px solid var(--primary-color)",
                bgcolor: "#FDF5F5",
                color: "var(--primary-color)",
                fontSize: "12px",
                padding: "0px 10px",
              }}
            >
              <span style={{ fontWeight: "600" }}>Important Notes:</span>{" "}
              Airline fees are estimates and may not be exact. Fly Far
              International does not ensure the accuracy of this information.
              All fees are listed per passenger. Cancellation and date change
              fees apply only if the same airline is selected for the new date.
              Any fare difference between the original and new booking will be
              charged to the user.
              {nonStructure?.length > 0 && (
                <span
                  style={{
                    textDecoration: "underline",
                    fontWeight: 600,
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowFareRules((prev) => !prev)}
                >
                  Advanced Fare Rules
                </span>
              )}
            </Alert>
          </Box>
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
                {structure.map((rule, i) => {
                  const isNonStructureEmpty =
                    Array.isArray(nonStructure) && nonStructure.length === 0;
                  const isAmountPresent = rule?.amount || rule?.amount > 0;

                  return (
                    <TableRow key={i}>
                      <TableCell sx={labelStyle}>{rule?.name}</TableCell>
                      <TableCell align="right">
                        {isAmountPresent ? (
                          <span
                            style={{
                              color: "var(--secondary-color)",
                              fontSize: "12px",
                            }}
                          >
                            {rule?.convertedAmount?.toLocaleString("en-IN")}{" "}
                            {rule?.convertedCurrencyCode}
                          </span>
                        ) : (
                          <span
                            style={{
                              cursor: isNonStructureEmpty
                                ? "default"
                                : "pointer",
                              color: "var(--primary-color)",
                              textDecoration: isNonStructureEmpty
                                ? "none"
                                : "underline",
                            }}
                            onClick={
                              isNonStructureEmpty
                                ? undefined
                                : () => setShowFareRules((prev) => !prev)
                            }
                          >
                            {isNonStructureEmpty
                              ? "See Airline Policy"
                              : "Click to View Advanced Fare Rules"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <FareDetails
            showFareRules={showFareRules}
            nonStructure={nonStructure}
            handleDrawerClose={handleDrawerClose}
            flightData={flightData}
            fareTableShow={true}
            brandName={flightData?.details?.brands[0]?.name}
          />
        </>
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

export default FareRulesTable;
