import {
  Box,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ZoomTran from "../../../component/Branch/components/ZoomTran";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const VoidFareInfo = ({ retriveData }) => {
  const priceBreakdown = retriveData?.details?.priceBreakdown || [];
  const [crrAllTax, setCrrAllTax] = useState({
    isOpen: false,
    allTax: [],
    oldTax: [],
    name: "",
  });

  const totalOldBaseFare =
    priceBreakdown.reduce((total, item) => total + item?.baseFare, 0) || 0;

  const totalOldTax =
    priceBreakdown.reduce((total, item) => total + item?.tax, 0) || 0;

  const totalOldClientPrice =
    priceBreakdown.reduce((total, item) => total + item?.clientPrice, 0) || 0;

  const totalServiceCharge =
    priceBreakdown.reduce((total, item) => total + item?.serviceCharge, 0) || 0;

  const totalOldAgentPrice =
    priceBreakdown.reduce((total, item) => total + item?.agentPrice, 0) || 0;


// console.log(retriveData?.paymentStatus);

  return (
    <Box
      sx={{
        borderRadius: "0 0 4px 4px",
        pb: 4,
        display: { xs: "none", lg: "block" },
      }}
    >
      <Box sx={{ py: "15px" }}>
        <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
          Void Fare Information
        </Typography>
      </Box>

      <Box
        sx={{
          "& .MuiTableCell-root": {
            "& .MuiBox-root": {
              display: "flex",
              justifyContent: "space-between",
              pb: "8px",
            },
          },
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ borderTop: "1px solid var(--border)" }}>
              <TableRow>
                {fareTableHeader.map((head, i, arr) => (
                  <TableCell
                    key={i}
                    align={arr.length - 1 === i ? "right" : "left"}
                    sx={{ width: head?.width }}
                  >
                    {head?.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <VoidFare
                setCrrAllTax={setCrrAllTax}
                priceBreakdown={priceBreakdown}
              />

              <TableRow sx={{ bgcolor: "#F6F6F6", px: 1 }}>
                <TableCell></TableCell>

                <TableCell>
                  <SubTable
                    oldValue={
                      <span style={{ color: "#DC143C", fontWeight: "600" }}>
                        Total Old Fare
                      </span>
                    }
                    voidValue={
                      <span
                        style={{ color: "var(--green)", fontWeight: "600" }}
                      >
                        Total Void Fare
                      </span>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={
                      <span style={{ color: "#C0C0C0" }}>
                        {totalOldBaseFare?.toLocaleString("en-IN")} BDT
                      </span>
                    }
                    voidValue={
                      <span>
                        {totalOldBaseFare?.toLocaleString("en-IN")} BDT
                      </span>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={
                      <span style={{ color: "#C0C0C0" }}>
                        {totalOldTax?.toLocaleString("en-IN")} BDT
                      </span>
                    }
                    voidValue={
                      <Typography
                        fontSize={"12px"}
                        sx={{ ...flexCenter, gap: "4px" }}
                      >
                        {totalOldTax?.toLocaleString("en-IN")} BDT
                      </Typography>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={
                      <span style={{ color: "#C0C0C0" }}>
                        {(totalOldClientPrice || 0).toLocaleString("en-IN")} BDT
                      </span>
                    }
                    voidValue={
                      <span>
                        {(totalOldClientPrice || 0).toLocaleString("en-IN")} BDT
                      </span>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={
                      <span style={{ color: "#e58d8d" }}>
                        {(retriveData?.commission || 0).toLocaleString("en-IN")}{" "}
                        BDT
                      </span>
                    }
                    voidValue={
                      <span style={{ color: "#DC143C" }}>
                        {(retriveData?.commission || 0).toLocaleString("en-IN")}{" "}
                        BDT
                      </span>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={<span style={{ color: "#C0C0C0" }}>0 BDT</span>}
                    voidValue={
                      <span>
                        {totalServiceCharge?.toLocaleString("en-IN")} BDT
                      </span>
                    }
                  />
                </TableCell>

                <TableCell sx={{ pr: 2 }}>
                  <SubTable
                    align={"right"}
                    oldValue={
                      <span style={{ color: "#99dd7d" }}>
                        {Number(
                          (totalOldAgentPrice ?? 0)?.toFixed(2)
                        )?.toLocaleString("en-IN")}{" "}
                        BDT
                      </span>
                    }
                    voidValue={
                      <span
                        style={{
                          color: "var(--green)",
                        }}
                      >
                        {Number(
                          totalOldAgentPrice?.toFixed(2) || 0
                        ).toLocaleString("en-IN")}{" "}
                        BDT
                      </span>
                    }
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{
                  border: "none",
                  height: "250px",
                  verticalAlign: "bottom",
                  pr: 1,
                }}
              >
                <TableCell colSpan={3} sx={{ fontSize: "13px" }}></TableCell>
                <TableCell colSpan={5} sx={{ fontSize: "13px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box>
                      <span>Total Agent Fare </span>
                      {Number(
                        totalOldAgentPrice?.toFixed(2) || 0
                      ).toLocaleString("en-IN")}{" "}
                      BDT
                    </Box>

                    <Box
                      sx={{
                        borderTop: "1px solid var(--border)",
                        pt: 1,
                        color: "var(--green)",
                      }}
                    >
                      <span>Total Paid Amount</span>
                      {(retriveData?.paymentStatus === "paid"
                        ? retriveData?.agentPrice
                        : retriveData?.partialPayment?.totalPayedAmount || 0
                      )?.toLocaleString("en-IN")}{" "}
                      BDT
                    </Box>

                    <Box
                      style={{
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: "6px",
                      }}
                    >
                      <span>Total Due Amount</span>
                      {(retriveData?.paymentStatus !== "paid"
                        ? retriveData?.partialPayment?.dueAmount || 0
                        : 0
                      )?.toLocaleString("en-IN")}{" "}
                      BDT
                    </Box>

                    <Box mt={1}>
                      <span style={{ color: "#DC143C" }}>
                        Total FFI Service Charge (-)
                      </span>
                      <span style={{ ...styles.priceStyle, color: "#DC143C" }}>
                        {Number(
                          (totalServiceCharge ?? 0)?.toFixed(2) || 0
                        ).toLocaleString("en-IN")}{" "}
                        BDT
                      </span>
                    </Box>

                    {retriveData?.partialPayment && (
                      <Box>
                        <span style={{ color: "#DC143C" }}>
                          Partial Payment Charge (-)
                        </span>
                        <span
                          style={{ ...styles.priceStyle, color: "#DC143C" }}
                        >
                          {(
                            retriveData?.partialPayment?.totalCharge || 0
                          ).toLocaleString("en-IN")}{" "}
                          BDT
                        </span>
                      </Box>
                    )}

                    <Box
                      sx={{
                        fontSize: "13px",
                        pt: 1,
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <span style={{ color: "var(--green)" }}>
                        Agent Void Amount
                      </span>
                      <span
                        style={{
                          ...styles.priceStyle,
                          width: "50%",
                          color: "var(--green)",
                        }}
                      >
                        {retriveData?.paymentStatus !== "paid"
                          ? Number(
                              retriveData?.partialPayment?.totalPayedAmount -
                                totalServiceCharge -
                                retriveData?.partialPayment?.totalCharge
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : Number(
                              totalOldAgentPrice -
                                totalServiceCharge -
                                (retriveData?.partialPayment?.totalCharge || 0)
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        BDT
                      </span>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={crrAllTax?.isOpen}
        TransitionComponent={ZoomTran}
        maxWidth={"sm"}
        fullWidth
        onClose={() => {
          setCrrAllTax({ isOpen: false, allTax: [], oldTax: [], name: "" });
        }}
      >
        <TaxBreakDown crrAllTax={crrAllTax} />
      </Dialog>
    </Box>
  );
};

const VoidFare = ({ setCrrAllTax, priceBreakdown }) => {
  return priceBreakdown.map((passenger, index) => {
    return (
      <>
        <TableRow key={index}>
          <TableCell sx={{ width: "14%" }}>
            <span
              style={{ fontWeight: "600", color: "var(--secondary-color)" }}
            >
              {passenger?.firstName} {passenger?.lastName}
            </span>{" "}
            ({passenger?.paxType}) <br />
            {passenger?.ticketNumber}
          </TableCell>
          <TableCell>
            <SubTable
              oldValue={<span style={{ color: "#DC143C" }}>Old Fare</span>}
              voidValue={
                <span style={{ color: "var(--green)" }}>Void Fare</span>
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#C0C0C0" }}>
                  {(passenger?.baseFare || 0)?.toLocaleString("en-IN")} BDT
                </span>
              }
              voidValue={
                <span>
                  {" "}
                  {(passenger?.baseFare || 0)?.toLocaleString("en-IN")} BDT
                </span>
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#C0C0C0" }}>
                  {(passenger?.tax ?? 0)?.toLocaleString("en-IN")} BDT
                </span>
              }
              voidValue={
                <Typography
                  sx={{ ...flexCenter, gap: "4px", fontSize: "12px" }}
                >
                  {passenger?.allTax
                    ?.reduce((acc, item) => acc + item?.amount, 0)
                    .toLocaleString("en-IN") + " BDT"}

                  <RemoveRedEyeIcon
                    onClick={() => {
                      setCrrAllTax((prev) => {
                        return {
                          ...prev,
                          isOpen: true,
                          allTax: passenger?.allTax,
                          oldTax: passenger?.allTax,
                          name:
                            passenger?.firstName + " " + passenger?.lastName,
                        };
                      });
                    }}
                    sx={{ fontSize: "16px", cursor: "pointer" }}
                  />
                </Typography>
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#C0C0C0" }}>
                  {(passenger?.tax + passenger?.baseFare ?? 0)?.toLocaleString(
                    "en-IN"
                  )}{" "}
                  BDT
                </span>
              }
              voidValue={
                <span>
                  {(passenger?.tax + passenger?.baseFare ?? 0)?.toLocaleString(
                    "en-IN"
                  )}{" "}
                  BDT
                </span>
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#e58d8d" }}>
                  {Number(
                    (passenger?.commission ?? 0)?.toFixed(2)
                  )?.toLocaleString("en-IN")}{" "}
                  BDT
                </span>
              }
              voidValue={
                <span style={{ color: "#DC143C" }}>
                  {Number(
                    (passenger?.commission ?? 0)?.toFixed(2)
                  )?.toLocaleString("en-IN")}{" "}
                  BDT
                </span>
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={<span style={{ color: "#C0C0C0" }}>0 BDT</span>}
              voidValue={
                <span>
                  {Number(
                    (passenger?.serviceCharge ?? 0)?.toFixed(2)
                  )?.toLocaleString("en-IN")}{" "}
                  BDT
                </span>
              }
            />
          </TableCell>

          <TableCell sx={{ pr: 1 }}>
            <SubTable
              align={"right"}
              oldValue={
                <span style={{ color: "#99dd7d" }}>
                  {Number(
                    (passenger?.agentPrice ?? 0).toFixed(2)
                  ).toLocaleString("en-IN")}{" "}
                  BDT
                </span>
              }
              voidValue={
                <span style={{ color: "var(--green)" }}>
                  {Number(
                    (passenger?.agentPrice ?? 0).toFixed(2)
                  ).toLocaleString("en-IN")}{" "}
                  BDT
                </span>
              }
            />
          </TableCell>
        </TableRow>
      </>
    );
  });
};

const SubTable = ({ oldValue, voidValue, align = "left" }) => {
  return (
    <Table>
      <TableRow>
        <TableCell align={align}>{oldValue}</TableCell>
      </TableRow>
      <TableRow sx={{ borderBottom: "none" }}>
        <TableCell align={align}>{voidValue}</TableCell>
      </TableRow>
    </Table>
  );
};

const TaxBreakDown = ({ crrAllTax }) => {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        "& .MuiTableCell-root": {
          height: "35px",
          pl: 2,
          color: "var(--secondary-color)",
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ textTransform: "capitalize", mb: "10px" }}
      >
        Tax Void Fare Information
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            {["Tax Name", "Old Tax Amount", "Void Tax Amount"].map(
              (head, i) => (
                <TableCell
                  key={i}
                  style={{
                    backgroundColor:
                      i > 0 ? "#F0F9FF" : "var(--secondary-color)",
                    color: i > 0 ? "var(--secondary-color)" : "white ",
                    textAlign: i > 0 ? "right" : "left",
                    paddingRight: "8px",
                  }}
                >
                  {head}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {crrAllTax?.allTax.length > 0 &&
            crrAllTax?.allTax?.map((tax, i) => {
              const oldTax = crrAllTax?.oldTax?.at(i) || {};

              return (
                <TableRow key={i}>
                  <TableCell
                    style={{
                      backgroundColor: "var(--secondary-color)",
                      color: "white",
                      width: "180px",
                    }}
                  >
                    {tax?.code}
                  </TableCell>
                  <TableCell sx={{ textAlign: "right", pr: 1 }}>
                    {oldTax?.amount} <em>BDT</em>
                  </TableCell>

                  <TableCell sx={{ textAlign: "right", pr: 1 }}>
                    {tax?.amount} <em>BDT</em>
                  </TableCell>
                </TableRow>
              );
            })}

          <TableRow>
            <TableCell
              style={{
                color: "var(--secondary-color)",
                backgroundColor: "#F0F9FF",
              }}
            >
              Total Tax
            </TableCell>
            <TableCell sx={{ textAlign: "right", paddingRight: "8px" }}>
              {crrAllTax?.oldTax
                ?.reduce((acc, item) => acc + item?.amount, 0)
                .toLocaleString("en-IN")}{" "}
              <em>BDT</em>
            </TableCell>
            <TableCell sx={{ textAlign: "right", paddingRight: "8px" }}>
              {crrAllTax?.allTax
                ?.reduce((acc, item) => acc + item?.amount, 0)
                .toLocaleString("en-IN")}{" "}
              <em>BDT</em>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

const fareTableHeader = [
  { title: "Pax Details", width: "23%" },
  { title: "Fare Name", width: "11%" },
  { title: "Base Fare", width: "11%" },
  { title: "Tax", width: "11%" },
  { title: "Total Fare", width: "11%" },
  { title: "Discount", width: "11%" },
  { title: "FFI Service Charge", width: "11%", align: "center" },
  { title: "Agent Fare", width: "11%" },
];

const styles = { priceStyle: { width: "150px", textAlign: "right" } };
const flexCenter = { display: "flex", alignItems: "center" };
export default VoidFareInfo;
