import {
  Box,
  Dialog,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ZoomTran from "../../../component/Branch/components/ZoomTran";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const RefundFareInfo = ({
  retriveData,
  serviceChargeData,
  selectedRows,
  itineraryRows,
  autoRefundData,
  isAutoRefundLoading,
}) => {
  const [refundChargeNote, setRefundChargeNote] = useState("");
  const routes = retriveData?.details?.route ?? [];
  const priceBreakdown = retriveData?.details?.priceBreakdown || [];

  const [crrAllTax, setCrrAllTax] = useState({
    isOpen: false,
    allTax: [],
    oldTax: [],
    name: "",
  });

  const totalServiceCharge =
    priceBreakdown.reduce((total, pax) => {
      const matchingService = serviceChargeData?.data?.find(
        (service) => service?.paxType === pax?.paxType
      );
      if (matchingService) {
        return total + matchingService?.serviceCharge * pax.paxCount;
      }
      return total;
    }, 0) || 0;

  useEffect(() => {
    const airlinesDate = routes?.[0]?.departureDate;
    const today = new Date().toISOString().split("T")[0];

    if (today < airlinesDate) {
      setRefundChargeNote("Before Departure");
    } else {
      setRefundChargeNote("After Departure");
    }
  }, [routes]);

  const isNotEqual = selectedRows?.length !== itineraryRows?.length;

  const totalOldBaseFare =
    priceBreakdown.reduce((total, item) => total + item?.baseFare, 0) || 0;

  const totalOldTax =
    priceBreakdown.reduce((total, item) => total + item?.tax, 0) || 0;

  const totalOldDicount =
    priceBreakdown.reduce((total, item) => total + item?.commission, 0) || 0;

  const totalOldAgentPrice =
    priceBreakdown.reduce((total, item) => total + item?.agentPrice, 0) || 0;

  return (
    <Box
      sx={{
        borderRadius: "0 0 4px 4px",
        pb: 4,
        px: 2,
        display: { xs: "none", lg: "block" },
      }}
    >
      <Box sx={{ py: "15px" }}>
        <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
          Refund Fare Information
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
              <RefundFare
                autoRefundData={autoRefundData}
                setCrrAllTax={setCrrAllTax}
                serviceChargeData={serviceChargeData}
                priceBreakdown={priceBreakdown}
                isAutoRefundLoading={isAutoRefundLoading}
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
                    refundValue={
                      <span
                        style={{ color: "var(--green)", fontWeight: "600" }}
                      >
                        Total Refund Fare
                      </span>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={
                      <span style={{ color: "#C0C0C0" }}>
                        {Number(totalOldBaseFare || 0)?.toLocaleString("en-IN")}{" "}
                        BDT
                      </span>
                    }
                    refundValue={
                      <span>
                        {autoRefundData
                          ? (
                              autoRefundData?.data?.baseFare || 0
                            ).toLocaleString("en-IN") + " BDT"
                          : "Will be decided"}
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
                    refundValue={
                      <Typography
                        fontSize={"12px"}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {autoRefundData
                          ? (autoRefundData?.data?.taxes || 0).toLocaleString(
                              "en-IN"
                            ) + " BDT"
                          : "Will be decided"}
                      </Typography>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={
                      <span style={{ color: "#C0C0C0" }}>
                        {Number(totalOldBaseFare + totalOldTax).toLocaleString(
                          "en-IN"
                        )}{" "}
                        BDT
                      </span>
                    }
                    refundValue={
                      <span>
                        {autoRefundData
                          ? (
                              autoRefundData?.data?.totalFare || 0
                            ).toLocaleString("en-IN") + " BDT"
                          : "Will be decided"}
                      </span>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={
                      <span style={{ color: "#e58d8d" }}>
                        {totalOldDicount.toLocaleString("en-IN")} BDT
                      </span>
                    }
                    refundValue={
                      <span style={{ color: "#DC143C" }}>
                        {autoRefundData
                          ? (
                              Number(
                                autoRefundData?.data?.totalFare -
                                  autoRefundData?.data?.currentAgentPrice?.toFixed(
                                    2
                                  )
                              ) || 0
                            ).toLocaleString("en-IN") + " BDT"
                          : "Will be decided"}
                      </span>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={<span style={{ color: "#C0C0C0" }}>0 BDT</span>}
                    refundValue={
                      <span>
                        {isNotEqual
                          ? "Will be decided"
                          : totalServiceCharge?.toLocaleString("en-IN")}{" "}
                        {isNotEqual ? "" : "BDT"}
                      </span>
                    }
                  />
                </TableCell>

                <TableCell>
                  <SubTable
                    oldValue={<span style={{ color: "#C0C0C0" }}>0 BDT</span>}
                    refundValue={
                      <span>
                        {isNotEqual
                          ? "Will be decided"
                          : 0?.toLocaleString("en-IN")}{" "}
                        {isNotEqual ? "" : "BDT"}
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
                    refundValue={
                      <span
                        style={{
                          color: "var(--green)",
                        }}
                      >
                        {autoRefundData
                          ? (
                              Number(
                                autoRefundData?.data?.currentAgentPrice?.toFixed(
                                  2
                                )
                              ) || 0
                            ).toLocaleString("en-IN") + " BDT"
                          : "Will be decided"}
                      </span>
                    }
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{
                  border: "none",
                  height: "270px",
                  verticalAlign: "bottom",
                  pr: 1,
                }}
              >
                <TableCell colSpan={4} sx={{ fontSize: "13px" }}></TableCell>
                <TableCell colSpan={5} sx={{ fontSize: "13px" }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box>
                      <span>Total Agent Fare </span>
                      {autoRefundData
                        ? (
                            Number(
                              autoRefundData?.data?.currentAgentPrice?.toFixed(
                                2
                              )
                            ) || 0
                          ).toLocaleString("en-IN") + " BDT"
                        : "Will be decided"}
                    </Box>

                    <Box sx={{ borderTop: "1px solid var(--border)", pt: 1 }}>
                      <span>Total Paid Amount</span>
                      {(retriveData?.partialPayment
                        ? retriveData?.partialPayment?.totalPayedAmount
                        : retriveData?.agentPrice
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
                      {(retriveData?.partialPayment
                        ? retriveData?.partialPayment?.dueAmount || 0
                        : 0
                      ).toLocaleString("en-IN")}{" "}
                      BDT
                    </Box>

                    <Box mt={1}>
                      <span style={{ color: "#DC143C" }}>Total AIT (-)</span>
                      <span
                        style={{
                          ...styles.priceStyle,
                          color: "#DC143C",
                        }}
                      >
                        {autoRefundData
                          ? (
                              (autoRefundData?.data?.totalAit ?? 0)?.toFixed(
                                2
                              ) || 0
                            ).toLocaleString("en-IN") + " BDT"
                          : "Will be decided"}
                      </span>
                    </Box>

                    <Box>
                      <span style={{ color: "#DC143C" }}>
                        Total FFI Service Charge (-)
                      </span>
                      <span style={{ ...styles.priceStyle, color: "#DC143C" }}>
                        {isNotEqual
                          ? "Will be decided"
                          : totalServiceCharge?.toLocaleString("en-IN")}{" "}
                        {isNotEqual ? "" : "BDT"}
                      </span>
                    </Box>

                    <Box>
                      <Typography sx={{ fontSize: "13px", color: "#DC143C" }}>
                        <span>Airlines Charge </span>
                        <span
                          style={{
                            color: "var(--primary-color)",
                          }}
                        >
                          ({refundChargeNote}) (-)
                        </span>
                      </Typography>
                      <span
                        style={{
                          ...styles.priceStyle,
                          width: "190px",
                          color: "#DC143C",
                        }}
                      >
                        {autoRefundData
                          ? (
                              autoRefundData?.data?.airlineCharge || 0
                            ).toLocaleString("en-IN") + " BDT"
                          : "Will be decided"}
                      </span>
                    </Box>

                    <Box
                      sx={{
                        fontSize: "13px",
                        pt: 1,
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <span style={{ color: "var(--green)" }}>
                        Agent Refunded Amount
                      </span>
                      <span
                        style={{
                          ...styles.priceStyle,
                          width: "50%",
                          color: "var(--green)",
                        }}
                      >
                        {autoRefundData
                          ? Number(
                              (
                                autoRefundData?.data?.agentRefundAmount ?? 0
                              )?.toFixed(2)
                            ).toLocaleString("en-IN") + " BDT"
                          : "Will be decided"}
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

const RefundFare = ({
  autoRefundData,
  setCrrAllTax,
  serviceChargeData,
  priceBreakdown,
  isAutoRefundLoading,
}) => {
  return priceBreakdown.map((passenger, index) => {
    const serviceCharge =
      serviceChargeData?.data?.find(
        (item) => item?.paxType === passenger?.paxType
      )?.serviceCharge || 0;

    const oldFare = priceBreakdown?.at(index) || {};

    const refundFare =
      autoRefundData?.data?.priceBreakdown?.find(
        (item) => item?.ticketNumber === passenger?.ticketNumber
      ) || {};

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
              refundValue={
                <span style={{ color: "var(--green)" }}>Refundable Fare</span>
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#C0C0C0" }}>
                  {(oldFare?.baseFare || 0)?.toLocaleString("en-IN")} BDT
                </span>
              }
              refundValue={
                isAutoRefundLoading ? (
                  <Loader />
                ) : (
                  <span>
                    {refundFare?.totalBaseFare
                      ? refundFare?.totalBaseFare?.toLocaleString("en-IN") +
                        " BDT"
                      : "Will be decided"}
                  </span>
                )
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#C0C0C0" }}>
                  {(oldFare?.tax || 0)?.toLocaleString("en-IN")} BDT
                </span>
              }
              refundValue={
                isAutoRefundLoading ? (
                  <Loader />
                ) : (
                  <Typography
                    fontSize={"12px"}
                    sx={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    {refundFare?.allTax ? (
                      <>
                        {refundFare?.allTax
                          ?.reduce((acc, item) => acc + item?.amount, 0)
                          .toLocaleString("en-IN") + " BDT"}

                        <RemoveRedEyeIcon
                          onClick={() => {
                            setCrrAllTax((prev) => {
                              return {
                                ...prev,
                                isOpen: true,
                                allTax: refundFare?.allTax,
                                oldTax: oldFare?.allTax,
                                name: refundFare?.paxName,
                              };
                            });
                          }}
                          sx={{ fontSize: "16px", cursor: "pointer" }}
                        />
                      </>
                    ) : (
                      "Will be decided"
                    )}
                  </Typography>
                )
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#C0C0C0" }}>
                  {(oldFare?.tax + oldFare?.baseFare || "0")?.toLocaleString(
                    "en-IN"
                  )}{" "}
                  BDT
                </span>
              }
              refundValue={
                isAutoRefundLoading ? (
                  <Loader />
                ) : (
                  <span>
                    {refundFare?.clientPrice
                      ? refundFare?.clientPrice?.toLocaleString("en-IN") +
                        " BDT"
                      : "Will be decided"}
                  </span>
                )
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#e58d8d" }}>
                  {Number(
                    (oldFare?.commission || 0)?.toFixed(2)
                  )?.toLocaleString("en-IN")}{" "}
                  BDT
                </span>
              }
              refundValue={
                isAutoRefundLoading ? (
                  <Loader />
                ) : (
                  <span style={{ color: "#DC143C" }}>
                    {refundFare?.commission
                      ? refundFare?.commission?.toLocaleString("en-IN") + " BDT"
                      : "Will be decided"}
                  </span>
                )
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#C0C0C0" }}>
                  {Number(
                    (oldFare?.serviceCharge || 0)?.toFixed(2)
                  )?.toLocaleString("en-IN")}{" "}
                  BDT
                </span>
              }
              refundValue={
                isAutoRefundLoading ? (
                  <Loader />
                ) : (
                  <span>{serviceCharge} BDT</span>
                )
              }
            />
          </TableCell>

          <TableCell>
            <SubTable
              oldValue={
                <span style={{ color: "#C0C0C0" }}>
                  {Number(
                    (oldFare?.airlineCharge || 0)?.toFixed(2)
                  )?.toLocaleString("en-IN")}{" "}
                  BDT
                </span>
              }
              refundValue={
                isAutoRefundLoading ? (
                  <Loader />
                ) : (
                  <span>
                    {Number(
                      (refundFare?.airlineCharge || 0)?.toFixed(2)
                    )?.toLocaleString("en-IN")}{" "}
                    BDT
                  </span>
                )
              }
            />
          </TableCell>

          <TableCell sx={{ pr: 1 }}>
            <SubTable
              align={"right"}
              oldValue={
                <span style={{ color: "#99dd7d" }}>
                  {Number((oldFare?.agentPrice ?? 0).toFixed(2)).toLocaleString(
                    "en-IN"
                  )}{" "}
                  BDT
                </span>
              }
              refundValue={
                isAutoRefundLoading ? (
                  <Loader />
                ) : (
                  <span
                    style={{
                      color: "var(--green)",
                    }}
                  >
                    {refundFare?.agentPrice ? (
                      <>
                        {Number(
                          (refundFare?.agentPrice).toFixed(2)
                        ).toLocaleString("en-IN")}{" "}
                        BDT
                      </>
                    ) : (
                      "Will be decided"
                    )}
                  </span>
                )
              }
            />
          </TableCell>
        </TableRow>
      </>
    );
  });
};

const SubTable = ({ oldValue, refundValue, align = "left" }) => {
  return (
    <Table>
      <TableRow>
        <TableCell align={align}>{oldValue}</TableCell>
      </TableRow>
      <TableRow sx={{ borderBottom: "none" }}>
        <TableCell align={align}>{refundValue}</TableCell>
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
        Tax Refund Fare Information
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            {["Tax Name", "Old Tax Amount", "Refundable Tax Amount"].map(
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

const Loader = ({ width = "65px" }) => {
  return (
    <Skeleton
      sx={{ borderRadius: "2px" }}
      variant="rectangular"
      width={width}
      height={"12px"}
      animation="wave"
    />
  );
};

const fareTableHeader = [
  { title: "Pax Details", width: "18%" },
  { title: "Fare Name", width: "11%" },
  { title: "Base Fare", width: "10%" },
  { title: "Tax", width: "10%" },
  { title: "Total Fare", width: "10%" },
  { title: "Discount", width: "9%" },
  { title: "FFI Service Charge", width: "11%", align: "center" },
  { title: "Airlines Charge", width: "10%" },
  { title: "Agent Fare", width: "11%" },
];
const styles = { priceStyle: { width: "150px", textAlign: "right" } };

export default RefundFareInfo;
