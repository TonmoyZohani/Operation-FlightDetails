import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  ThemeProvider,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
} from "@mui/material";
import { theme } from "../../../utils/theme";
import PriceBreakdown, {
  TicketStatus,
} from "../../../component/AirBooking/PriceBreakdown";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitle from "../../../shared/common/PageTitle";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import moment from "moment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ZoomTran from "../../../component/Branch/components/ZoomTran";
import { nextStepStyle } from "../../../style/style";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CustomAlert from "../../../component/Alert/CustomAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import CustomToast from "../../../component/Alert/CustomToast";
import PaymentGateway from "../../../component/PaymentGateway/PaymentGateway";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";
import FareRulesCharges from "../../../component/FlightAfterSearch/components/FareRulesCharges";
import ReissuePriceBreakdown from "../../../component/AirBooking/ReissuePriceBreakdown";
import TimeCountDown from "../../../component/FlightAfterSearch/components/TimeCountDown";

const ReissueQuotation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const queryClient = useQueryClient();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { retriveData, passengers, crrBookingData } = state;
  const priceBreakdown = retriveData?.details?.priceBreakdown || [];
  const oldPriceBreakdown = retriveData?.details?.oldPriceBreakdown || [];
  const routes = retriveData?.details?.route ?? [];

  const [isPayment, setIsPayment] = useState(false);
  const [reissueChargeNote, setReissueChargeNote] = useState("");
  const [crrAllTax, setCrrAllTax] = useState({
    isOpen: false,
    allTax: [],
    oldTax: [],
    name: "",
  });


  useEffect(() => {
    const airlinesDate = routes?.[0]?.departureDate;
    const today = new Date().toISOString().split("T")[0];

    if (today < airlinesDate) {
      setReissueChargeNote("Before Departure");
    } else {
      setReissueChargeNote("After Departure");
    }
  }, [routes]);

  const getPassengerRows = (passengers, retriveData) => {
    return passengers.map((passenger, index) => {
      const price = retriveData?.details?.priceBreakdown?.at(index);
      return [
        `${passenger?.firstName} ${passenger?.lastName}`,
        passenger?.type === "CNN" ? (
          <>
            {passenger?.type}{" "}
            <span style={{ color: "var(--primary-color)" }}>
              [{passenger?.age} yrs]
            </span>
          </>
        ) : (
          passenger.type
        ),
        moment(passenger?.dateOfBirth).format("DD MMM, YYYY"),
        <Box
          key={index}
          sx={{
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            height: "100%",
            cursor: "pointer",
          }}
        >
          {passenger?.passportNation}
        </Box>,
        price ? `${price?.baseFare?.toLocaleString("en-IN")} BDT` : "N/A",
        price ? `${price?.tax?.toLocaleString("en-IN")} BDT` : "N/A",
        retriveData?.paymentStatus?.toUpperCase(),
        <span
          key={index}
          style={{
            color: "var(--primary-color)",
            fontWeight: "500",
            paddingLeft: "3px",
            textDecoration: "underline",
          }}
        >
          {passenger?.bookingAttribId}
        </span>,
      ];
    });
  };

  const itineraryRows =
    retriveData?.details?.route.map((route, index) => {
      const stops = retriveData?.details?.cityCount[index];
      const stopCount = stops.length - 1;
      const stopDescription =
        stopCount > 0
          ? `${stopCount} Stop${stopCount > 1 ? "s" : ""} via ${stops
              .slice(0, -1)
              .map((stop) => stop.arrivalCityCode)
              .join(", ")}`
          : "Non-stop";

      return [
        <span key={index}>{stops[0].marketingCarrierName}</span>,
        <span key={index}>{`${route.departure} - ${route.arrival}`}</span>,
        stopDescription,
        `${stops[0].marketingFlight} [ ${stops[0].marketingCarrier} ]`,
        moment(stops[0]?.departureDate).format("DD MMM, YYYY"),
        <span style={{ color: stops[0].isFlown ? "red" : "green" }}>
          {stops[0].isFlown ? "Flown" : "Unflown"}
        </span>,
      ];
    }) || [];

  const passengerRows = getPassengerRows(passengers, retriveData);

  const { mutate: reissueMutate, status: reissueStatus } = useMutation({
    mutationFn: (data) =>
      axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue-booking/update-reissue-booking`,
        data,
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message, () => {
          navigate("/dashboard/booking/airtickets/all");
        });
        setIsPayment(false);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["singleBookingData"]);
    },
    onError: (err) => {
      if (err.response) {
        const errorMessage = err.response.data.message || "An error occurred";
        showToast("error", errorMessage);
      } else if (err.request) {
        showToast("error", err.message);
      } else {
        showToast("error", "An unexpected error occurred.");
      }
    },
  });

  const handleReissueBooking = async (status) => {
    const result = await CustomAlert({
      success: "warning",
      message: `Are you sure? You want to ${status === "approved" ? "approve" : status} reissue quotation for this booking?`,
    });
    if (result?.isConfirmed) {
      reissueMutate({ bookingId: retriveData?.id, status });
    }
  };

  const handleSubmit = () => {
    handleReissueBooking("approved");
  };

  const fareDifference = retriveData?.details?.fareDifference || {};

  const totalFareDifference = fareDifference
    ? fareDifference?.totalFareDifference
    : {};

  const totalNewFareDifference = fareDifference
    ? fareDifference?.totalNewFareDifference
    : {};

  const totalOldFareDifference = fareDifference
    ? fareDifference?.totalOldFareDifference
    : {};

  // console.log(crrBookingData);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mb: { xs: 7, lg: 0 } }}>
        <Grid
          container
          sx={{
            width: { xs: "90%", lg: "100%" },
            mt: { xs: 3, lg: 0 },
            mx: "auto",
          }}
        >
          <Grid
            container
            item
            lg={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "15px",
            }}
          >
            <Grid item xs={12} lg={2.4}>
              <TicketStatus
                data={retriveData}
                crrBookingData={crrBookingData}
                relation={crrBookingData?.relation}
              />

              {retriveData?.bookingStatus === "reissue to be confirmed" && (
                <TimeCountDown
                  label={"Reissue to be Confirmed Time Limit"}
                  timeLimit={retriveData?.timeLimit}
                />
              )}
              <ReissuePriceBreakdown
                label={
                  retriveData?.bookingStatus === "reissued"
                    ? "Reissued Paid"
                    : "Reissue Payable Amount"
                }
                flightData={{
                  ...retriveData?.details,
                  priceBreakdown: {
                    newPriceBreakdown: retriveData?.details?.priceBreakdown,
                    oldPriceBreakdown: retriveData?.details?.oldPriceBreakdown,
                  },
                }}
                priceData={retriveData?.details?.priceBreakdown}
                retriveData={retriveData}
              />

              {crrBookingData?.details?.structure.length > 0 && (
                <Box mt={"20px"}>
                  <FareRulesCharges
                    structure={crrBookingData?.details?.structure || []}
                    nonStructure={crrBookingData?.details?.nonStructure || []}
                    bookingData={crrBookingData}
                  />
                </Box>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              lg={9.4}
              sx={{
                bgcolor: "#fff",
                borderRadius: "4px",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <PageTitle
                  title={
                    isPayment
                      ? "Payment Information"
                      : "Booking Reissue Quotation"
                  }
                />

                {/*Passenger's table shown here */}
                <Grid item xs={12} sx={{ bgcolor: "#fff", p: "12px 15px" }}>
                  {!isPayment ? (
                    <>
                      <Typography
                        sx={{ fontSize: "15px", fontWeight: 500, pb: "15px" }}
                      >
                        Passenger Information
                      </Typography>

                      <Box>
                        <DynamicMuiTable
                          columns={passengerColumns}
                          rows={passengerRows}
                          getCellContent={(row, colIndex) => row[colIndex]}
                        />
                      </Box>

                      {retriveData?.details?.route.map((ro, index) => (
                        <Grid
                          item
                          lg={12}
                          sx={{
                            bgcolor: "#fff",
                            p: "12px 0",
                            display: { xs: "none", lg: "block" },
                          }}
                          key={index}
                        >
                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: "500",
                              pb: "15px",
                            }}
                          >
                            {retriveData?.tripType !== "multiCity"
                              ? `Flight Itinerary  ${
                                  index === 0 ? "Onward" : "Return"
                                }`
                              : `Flight Itinerary City ${index + 1}`}
                          </Typography>

                          <DynamicMuiTable
                            columns={itineraryColumns}
                            rows={[itineraryRows[index]]}
                            getCellContent={(row, colIndex) => row[colIndex]}
                          />
                        </Grid>
                      ))}

                      <Box sx={{}}>
                        <Typography
                          mt={2}
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            pb: "15px",
                          }}
                        >
                          Reissue Fare Information
                        </Typography>

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
                              <TableHead
                                sx={{ borderTop: "1px solid var(--border)" }}
                              >
                                <TableRow>
                                  {fareTableHeader.map((head, i, arr) => (
                                    <TableCell
                                      key={i}
                                      align={
                                        arr.length - 1 === i ? "right" : "left"
                                      }
                                      sx={{ width: head?.width }}
                                    >
                                      {head?.title}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {priceBreakdown.map((passenger, i) => {
                                  const crrPassenger =
                                    oldPriceBreakdown.at(i) || {};

                                  return (
                                    <TableRow key={i}>
                                      <TableCell sx={{ width: "14%" }}>
                                        <span
                                          style={{
                                            color: "var(--secondary-color)",
                                            fontWeight: "600",
                                          }}
                                        >
                                          {passenger?.firstName || "N/A"}{" "}
                                          {passenger?.lastName}
                                        </span>{" "}
                                        ({passenger?.paxType}) <br />
                                        {passenger?.ticketNumber}
                                      </TableCell>

                                      <TableCell>
                                        <SubTable
                                          oldValue={
                                            <span style={{ color: "red" }}>
                                              Old Fare
                                            </span>
                                          }
                                          refundValue={
                                            <span
                                              style={{
                                                color: "var(--green)",
                                              }}
                                            >
                                              Reissue Fare
                                            </span>
                                          }
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <SubTable
                                          oldValue={
                                            <span style={{ color: "#C0C0C0" }}>
                                              {(
                                                crrPassenger?.baseFare || 0
                                              )?.toLocaleString("en-IN")}{" "}
                                              BDT
                                            </span>
                                          }
                                          refundValue={
                                            <span>
                                              {(
                                                passenger?.baseFare || 0
                                              )?.toLocaleString("en-IN")}{" "}
                                              BDT
                                            </span>
                                          }
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <SubTable
                                          oldValue={
                                            <span style={{ color: "#C0C0C0" }}>
                                              {(
                                                crrPassenger?.tax || 0
                                              )?.toLocaleString("en-IN")}{" "}
                                              BDT
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
                                              {(
                                                passenger?.tax || 0
                                              )?.toLocaleString("en-IN") +
                                                " BDT"}

                                              <RemoveRedEyeIcon
                                                onClick={() => {
                                                  setCrrAllTax((prev) => {
                                                    return {
                                                      ...prev,
                                                      isOpen: true,
                                                      allTax: passenger?.allTax,
                                                      oldTax:
                                                        crrPassenger?.allTax,
                                                      name:
                                                        passenger?.firstName +
                                                        " " +
                                                        passenger?.lastName,
                                                    };
                                                  });
                                                }}
                                                sx={{
                                                  fontSize: "16px",
                                                  cursor: "pointer",
                                                }}
                                              />
                                            </Typography>
                                          }
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <SubTable
                                          oldValue={
                                            <span style={{ color: "#C0C0C0" }}>
                                              {(
                                                crrPassenger?.tax +
                                                  crrPassenger?.baseFare || "0"
                                              )?.toLocaleString("en-IN")}{" "}
                                              BDT
                                            </span>
                                          }
                                          refundValue={
                                            <span>
                                              {passenger?.clientPrice?.toLocaleString(
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
                                                (
                                                  crrPassenger?.commission || 0
                                                )?.toFixed(2)
                                              ).toLocaleString("en-IN")}{" "}
                                              BDT
                                            </span>
                                          }
                                          refundValue={
                                            <span style={{ color: "red" }}>
                                              {Number(
                                                (
                                                  passenger?.commission || 0
                                                )?.toFixed(2)
                                              ).toLocaleString("en-IN")}{" "}
                                              BDT
                                            </span>
                                          }
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <SubTable
                                          oldValue={
                                            <span style={{ color: "#C0C0C0" }}>
                                              0 BDT
                                            </span>
                                          }
                                          refundValue={
                                            <span>
                                              {passenger?.serviceCharge} BDT
                                            </span>
                                          }
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <SubTable
                                          oldValue={
                                            <span style={{ color: "#C0C0C0" }}>
                                              0 BDT
                                            </span>
                                          }
                                          refundValue={
                                            <span>
                                              {passenger?.airlineServiceFee ||
                                                0}{" "}
                                              BDT
                                            </span>
                                          }
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <SubTable
                                          align={"right"}
                                          oldValue={
                                            <span style={{ color: "#99dd7d" }}>
                                              {Number(
                                                crrPassenger?.agentPrice?.toFixed(
                                                  2
                                                )
                                              ).toLocaleString("en-IN")}{" "}
                                              BDT
                                            </span>
                                          }
                                          refundValue={
                                            <span
                                              style={{
                                                color: "var(--green)",
                                              }}
                                            >
                                              {Number(
                                                (passenger?.agentPrice).toFixed(
                                                  2
                                                )
                                              ).toLocaleString("en-IN")}{" "}
                                              BDT
                                            </span>
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}

                                <TableRow sx={{ bgcolor: "#F6F6F6", px: 1 }}>
                                  <TableCell></TableCell>

                                  <TableCell>
                                    <SubTable
                                      oldValue={
                                        <span
                                          style={{
                                            color: "#DC143C",
                                            fontWeight: "600",
                                          }}
                                        >
                                          Total Old Fare
                                        </span>
                                      }
                                      refundValue={
                                        <span
                                          style={{
                                            color: "var(--green)",
                                            fontWeight: "600",
                                          }}
                                        >
                                          Total Reissue Fare
                                        </span>
                                      }
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <SubTable
                                      oldValue={
                                        <span style={{ color: "#C0C0C0" }}>
                                          {(
                                            totalOldFareDifference?.baseFare ||
                                            0
                                          )?.toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      }
                                      refundValue={
                                        <span>
                                          {(
                                            totalNewFareDifference?.baseFare ||
                                            0
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      }
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <SubTable
                                      oldValue={
                                        <span style={{ color: "#C0C0C0" }}>
                                          {(
                                            totalOldFareDifference?.tax || 0
                                          )?.toLocaleString("en-IN")}{" "}
                                          BDT
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
                                          {(
                                            totalNewFareDifference?.tax || 0
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </Typography>
                                      }
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <SubTable
                                      oldValue={
                                        <span style={{ color: "#C0C0C0" }}>
                                          {(
                                            totalOldFareDifference?.clientPrice ||
                                            0
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      }
                                      refundValue={
                                        <span>
                                          {(
                                            totalNewFareDifference?.clientPrice ||
                                            0
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      }
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <SubTable
                                      oldValue={
                                        <span style={{ color: "#e58d8d" }}>
                                          {(
                                            totalOldFareDifference?.commission ||
                                            0
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      }
                                      refundValue={
                                        <span style={{ color: "#DC143C" }}>
                                          {(
                                            totalNewFareDifference?.commission ||
                                            0
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      }
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <SubTable
                                      oldValue={
                                        <span style={{ color: "#C0C0C0" }}>
                                          0 BDT
                                        </span>
                                      }
                                      refundValue={
                                        <span>
                                          {(
                                            totalFareDifference?.serviceFee || 0
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      }
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <SubTable
                                      oldValue={
                                        <span style={{ color: "#C0C0C0" }}>
                                          0 BDT
                                        </span>
                                      }
                                      refundValue={
                                        <span>
                                          {(
                                            totalFareDifference?.airlineServiceFee ||
                                            0
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
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
                                            (
                                              totalOldFareDifference?.agentPrice ||
                                              0
                                            ).toFixed(2)
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      }
                                      refundValue={
                                        <span
                                          style={{
                                            color: "var(--green)",
                                          }}
                                        >
                                          {Number(
                                            (
                                              totalNewFareDifference?.agentPrice ||
                                              0
                                            ).toFixed(2)
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
                                    verticalAlign: "bottom",
                                    height: "150px",
                                  }}
                                >
                                  <TableCell
                                    colSpan={4}
                                    sx={{ fontSize: "13px" }}
                                  ></TableCell>
                                  <TableCell
                                    colSpan={6}
                                    sx={{ fontSize: "13px" }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Box>
                                        <span>New Total Agent Fare</span>
                                        <span style={styles.priceStyle}>
                                          {Number(
                                            (
                                              totalNewFareDifference?.agentPrice ||
                                              0
                                            ).toFixed(2)
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      </Box>

                                      <Box
                                        sx={{
                                          borderBottom:
                                            "1px solid var(--border)",
                                        }}
                                      >
                                        <span>Old Total Agent Fare</span>
                                        <span style={styles.priceStyle}>
                                          {Number(
                                            (
                                              totalOldFareDifference?.agentPrice ||
                                              0
                                            ).toFixed(2)
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                </TableRow>

                                <TableRow
                                  sx={{
                                    border: "none",
                                    height: "80px",
                                    verticalAlign: "bottom",
                                  }}
                                >
                                  <TableCell
                                    colSpan={4}
                                    sx={{ fontSize: "13px" }}
                                  ></TableCell>
                                  <TableCell
                                    colSpan={6}
                                    sx={{ fontSize: "13px" }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          borderBottom:
                                            "1px solid var(--border)",
                                        }}
                                      >
                                        <span
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          Fare Difference
                                        </span>
                                        {Number(
                                          (
                                            totalFareDifference?.agentPrice || 0
                                          ).toFixed(2)
                                        ).toLocaleString("en-IN")}{" "}
                                        BDT
                                      </Box>
                                    </Box>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Box>
                                        <span style={{ color: "#DC143C" }}>
                                          Total AIT (-)
                                        </span>
                                        {Number(
                                          (
                                            totalFareDifference?.ait || 0
                                          ).toFixed(2)
                                        ).toLocaleString("en-IN")}{" "}
                                        BDT
                                      </Box>

                                      <Box>
                                        <span style={{ color: "#DC143C" }}>
                                          Total FFI Service Charge (-)
                                        </span>
                                        <span style={styles.priceStyle}>
                                          {Number(
                                            (
                                              totalFareDifference?.serviceFee ||
                                              0
                                            ).toFixed(2)
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
                                        </span>
                                      </Box>

                                      <Box>
                                        <span style={{ color: "#DC143C" }}>
                                          Airlines Charge ({reissueChargeNote})
                                          (-)
                                        </span>
                                        <span style={styles.priceStyle}>
                                          {Number(
                                            (
                                              totalFareDifference?.airlinesServiceFee ||
                                              0
                                            ).toFixed(2)
                                          ).toLocaleString("en-IN")}{" "}
                                          BDT
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
                                          {retriveData?.bookingStatus ===
                                          "reissued"
                                            ? "Agent Reissued Paid Amount"
                                            : "Agent Reissue Payable Amount"}
                                        </span>
                                        <span
                                          style={{
                                            ...styles.priceStyle,
                                            width: "50%",
                                          }}
                                        >
                                          {Number(
                                            (
                                              totalFareDifference?.reIssuePayable ||
                                              0
                                            ).toFixed(2)
                                          ).toLocaleString("en-IN")}{" "}
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
                      </Box>

                      {retriveData?.status?.toLowerCase() ===
                        "reissue to be confirmed" && (
                        <Grid
                          sx={{
                            mt: "15px",
                            display: { xs: "none", lg: "block" },
                          }}
                        >
                          <Button
                            onClick={() => setIsPayment(true)}
                            style={nextStepStyle}
                            sx={{
                              mb: 2,
                              "&:hover .icon": {
                                transform: "translateX(10px)",
                                transition: "transform 0.5s ease",
                                opacity: 100,
                              },
                            }}
                          >
                            <Typography>Approve Reissue Quotation</Typography>
                            <Box
                              className="icon"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0,
                              }}
                            >
                              <ArrowForwardIcon />
                            </Box>
                          </Button>
                          <Button
                            onClick={() => handleReissueBooking("rejected")}
                            style={{
                              ...nextStepStyle,
                              backgroundColor: "#333333",
                            }}
                            sx={{
                              "&:hover .icon": {
                                transform: "translateX(10px)",
                                transition: "transform 0.5s ease",
                                opacity: 100,
                              },
                            }}
                          >
                            <Typography>Reject Reissue Quotation</Typography>
                            <Box
                              className="icon"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0,
                              }}
                            >
                              <ArrowForwardIcon />
                            </Box>
                          </Button>
                        </Grid>
                      )}
                    </>
                  ) : (
                    <PaymentGateway
                      label={"Reissue"}
                      handleSubmit={handleSubmit}
                      paymentPrice={
                        retriveData?.details?.fareDifference
                          ?.totalFareDifference?.reIssuePayable
                      }
                      isLoading={reissueStatus === "pending" ? true : false}
                    />
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={crrAllTax?.isOpen}
        // open={true}
        TransitionComponent={ZoomTran}
        maxWidth={"sm"}
        fullWidth
        onClose={() => {
          setCrrAllTax({ isOpen: false, allTax: [], oldTax: [], name: "" });
        }}
      >
        <TaxBreakDown crrAllTax={crrAllTax} />
      </Dialog>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      <CustomLoadingAlert
        open={reissueStatus === "pending"}
        text={"We Are Processing Reissue Quotation"}
      />
    </ThemeProvider>
  );
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
            {["Tax Name", "Old Tax Amount", "Reissue Tax Amount"].map(
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
                    {oldTax?.amount && (
                      <>
                        {oldTax?.amount} <em>BDT</em>
                      </>
                    )}
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

const itineraryColumns = [
  "Airlines",
  "Destination",
  "Stops",
  "Flight No",
  "Flight Date",
  "Flight Status",
];

const passengerColumns = [
  "Name",
  "Pax Type",
  "DOB",
  "Nationality",
  "Base Fare",
  "Tax",
  "Payment Status",
];

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

export default ReissueQuotation;
