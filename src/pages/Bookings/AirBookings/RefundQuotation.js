import React, { useEffect, useRef, useState } from "react";
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
  Skeleton,
  Divider,
  Drawer,
  Checkbox,
} from "@mui/material";
import { TicketStatus } from "../../../component/AirBooking/PriceBreakdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageTitle from "../../../shared/common/PageTitle";
import { theme } from "../../../utils/theme";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../../context/AuthProvider";
import axios from "axios";
import CustomAlert from "../../../component/Alert/CustomAlert";
import { mobileButtonStyle, nextStepStyle } from "../../../style/style";
import ApproveRejectDialog from "../../../shared/common/ApproveRejectDialog";
import TimeCountDown from "../../../component/FlightAfterSearch/components/TimeCountDown";
import useToast from "../../../hook/useToast";
import CustomToast from "../../../component/Alert/CustomToast";
import MobileItineraryCard from "../components/MobileItineraryCard";
import { CustomOperationButton } from "../components/CustomOperationButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ZoomTran from "../../../component/Branch/components/ZoomTran";
import { TicketStatusSkeleton } from "../../../component/SkeletonLoader/TicketStatusSkeleton";
import QueueHeader from "../components/QueueHeader";
import BookingDetailsSkeleton from "../../../component/SkeletonLoader/BookingDetailsSkeleton";
import FilterSkeleton from "../../../component/SkeletonLoader/FilterSkeleton";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";
import useWindowSize from "../../../shared/common/useWindowSize";
import MobileHeader from "../../../component/MobileHeader/MobileHeader";
import FareRulesCharges from "../../../component/FlightAfterSearch/components/FareRulesCharges";
import RefundPriceBreakdown from "../../../component/AirBooking/RefundPriceBreakdown";

const passengerColumns = [
  "Name",
  "Pax Type",
  "DOB",
  "Nationality",
  "Base Fare",
  "Tax",
  "Payment Status",
];

const RefundQuotation = () => {
  const { state } = useLocation();
  const { jsonHeader } = useAuth();
  const { retriveData } = state;
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState({});
  const [type, setType] = useState("Booking Refund Quotation");
  const [proceedType, setProceedType] = useState("approve");
  const [refundChargeNote, setRefundChargeNote] = useState("");
  const { isMobile } = useWindowSize();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [currency, setCurrency] = useState("BDT");
  const [airlineCharge, setAirlineCharge] = useState(0);
  const [query] = useState({
    commissionType: retriveData?.commissionType,
    tripType: retriveData?.tripType,
    journeyType: retriveData?.journeyType,
  });
  const [crrAllTax, setCrrAllTax] = useState({
    isOpen: false,
    allTax: [],
    oldTax: [],
    name: "",
  });

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const titleRef = useRef();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const routes = retriveData?.details?.route ?? [];

  const refundIndexes = retriveData?.refunds?.[0]?.refundIndexes ?? [];

  const { data: refundServiceData, isLoading: isRefundLoading } = useQuery({
    queryKey: ["refundServiceData", query],
    queryFn: async () => {
      const queryParams = new URLSearchParams(query).toString();
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/common/service-charges/refund?${queryParams}`;
      const { data } = await axios.get(url, jsonHeader());

      return data;
    },
  });

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
        stops[0].marketingCarrierName,
        `${route.departure} - ${route.arrival}`,
        <Typography sx={{ textTransform: "uppercase", fontSize: "13px" }}>
          {stopDescription}
        </Typography>,
        `${stops[0].marketingCarrier} ${stops[0].marketingFlight}`,
        <Typography sx={{ textTransform: "uppercase", fontSize: "13px" }}>
          {moment(stops[0]?.departureDate).format("DD MMM, YYYY")}
        </Typography>,
        <Typography sx={{ textTransform: "uppercase", fontSize: "13px" }}>
          {retriveData?.paymentStatus}
        </Typography>,
        <span style={{ color: stops[0].isFlown ? "red" : "green" }}>
          {stops[0].isFlown ? "Flown" : "Unflown"}
        </span>,
      ];
    }) || [];

  const getPassengerRows = (passengers, retriveData) => {
    return passengers.map((passenger, index) => {
      const price = retriveData?.details?.priceBreakdown.find((item) => {
        const isTypeMatch = item.paxType === passenger.type;

        const isAgeMatch =
          passenger.type === "CNN" &&
          passenger.age &&
          item.age?.includes(passenger.age);

        return passenger.type === "CNN" ? isAgeMatch : isTypeMatch;
      });
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
        price ? `${price?.baseFare?.toLocaleString("en-IN")}` : "N/A",
        price ? `${price?.tax?.toLocaleString("en-IN")}` : "N/A",
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

  const flattenedPassengers = [
    ...(retriveData?.details?.passengerInformation?.adult || []),
    ...(retriveData?.details?.passengerInformation?.child || []),
    ...(retriveData?.details?.passengerInformation?.infant || []),
  ].flat();

  const totalServiceCharge = retriveData?.details?.priceBreakdown.reduce(
    (total, pax) => {
      const matchingService = refundServiceData?.data?.[0]?.data?.find(
        (service) => service.paxType === pax.paxType
      );
      if (matchingService) {
        return total + matchingService.serviceCharge * pax.paxCount;
      }
      return total;
    },
    0
  );

  const passengerRows = getPassengerRows(flattenedPassengers, retriveData);

  useEffect(() => {
    const airlinesDate = routes?.[0]?.departureDate;
    const today = new Date().toISOString().split("T")[0];

    if (today < airlinesDate) {
      setRefundChargeNote("Before Departure");
    } else {
      setRefundChargeNote("After Departure");
    }
  }, [routes]);

  useEffect(() => {
    const structure = retriveData?.details?.structure;
    const beforeRefundCharge = structure?.find(
      (item) => item?.name?.toLowerCase() === "refund before departure"
    );
    const afterRefundCharge = structure?.find(
      (item) => item?.name?.toLowerCase() === "refund after departure"
    );
    const airlinesDate = retriveData?.details?.route?.[0]?.departureDate;
    const today = new Date().toISOString().split("T")[0];

    if (today < airlinesDate) {
      setCurrency(
        beforeRefundCharge ? beforeRefundCharge?.convertedCurrencyCode : ""
      );
      setAirlineCharge(
        beforeRefundCharge
          ? beforeRefundCharge?.convertedAmount
          : "Will be decided"
      );
    } else {
      setCurrency(
        afterRefundCharge ? afterRefundCharge?.convertedCurrencyCode : ""
      );

      setAirlineCharge(
        afterRefundCharge
          ? afterRefundCharge?.convertedAmount
          : "Will be decided"
      );
    }
  }, [retriveData?.details?.routes?.[0]]);

  const { mutate: refundMutate, status: refundStatus } = useMutation({
    mutationFn: ({ refundId, cancel }) =>
      axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/refund`,
        { refundId, cancel },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message, () => {
          navigate(`/dashboard/booking/airtickets/all`);
        });
      }
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

  const handleRefundBooking = (cancel, title) => {
    const titleInputValue = titleRef?.current?.value;

    if (titleInputValue !== title) {
      showToast(
        "error",
        "Confirmation Spelling or Case Sensetive Doesn't match"
      );
      return;
    }

    const body = {
      refundId: retriveData?.refunds[0]?.id,
      cancel: cancel,
    };

    setDialogOpen(false);
    refundMutate(body);
  };

  const handleChangeSwitch = () => {
    if (currentData?.title === "Approve Refund Quotation") {
      handleRefundBooking(false, currentData?.title);
    } else if (currentData?.title === "Reject Refund Quotation") {
      handleRefundBooking(true, currentData?.title);
    }
  };

  const handleSubmit = async (title, message) => {
    setCurrentData({ title });

    const result = await CustomAlert({
      success: "warning",
      message,
    });
    if (result.isConfirmed) {
      setDialogOpen(true);
    }
  };

  const refunds = retriveData?.refunds[0];

  const priceBreakdown = retriveData?.details?.priceBreakdown;

  const { data: refundPriceBreakdown, status } = useQuery({
    queryKey: ["user/refund/price-breakdown"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/refund/price-breakdown/${retriveData?.id}`,
        jsonHeader()
      );
      return data?.data?.at(0);
    },
    staleTime: 0,
  });
  const quotationPriceBreakdown = refundPriceBreakdown
    ? refundPriceBreakdown?.priceBreakdown
    : [];
  const agentQuotationPrice = refundPriceBreakdown
    ? refundPriceBreakdown?.agentPrice
    : {};
  const formatName = (name = "") =>
    name?.toLowerCase().replace(/\b\w/g, (char) => char?.toUpperCase());

  if (status === "pending") {
    const skeletonBoxes = Array(5).fill(null);
    return (
      <>
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
          }}
        >
          <QueueHeader type={type} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 5,
              width: "90%",
              alignItems: "center",
              justifyContent: "center",
              ml: "5.15%",
            }}
          >
            {skeletonBoxes.map((_, boxIndex) => (
              <Box
                key={boxIndex}
                sx={{
                  mx: 4.5,
                  bgcolor: "white",
                  px: 2,
                  py: 1,
                  borderRadius: "5px",
                  width: "100%",
                }}
              >
                {[25, 40, 55, 32].map((width, index) => (
                  <Skeleton
                    key={index}
                    sx={{
                      width: `${width}%`,
                      p: 0,
                      mt: 0.5,
                      height: "15px",
                    }}
                  />
                ))}
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              mt: 2,
            }}
          >
            <Grid item lg={2.4}>
              <TicketStatusSkeleton />
              <FilterSkeleton />
            </Grid>
            <Grid item lg={9}>
              <BookingDetailsSkeleton />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }

  const totalOldBaseFare =
    priceBreakdown.reduce((total, item) => total + item?.baseFare, 0) || 0;

  const totalOldTax =
    priceBreakdown.reduce((total, item) => total + item?.tax, 0) || 0;

  const totalOldDicount =
    priceBreakdown.reduce((total, item) => total + item?.commission, 0) || 0;

  const totalOldAgentPrice =
    priceBreakdown.reduce((total, item) => total + item?.agentPrice, 0) || 0;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mb: { xs: 7, lg: 0 } }}>
        {status === "pending" ? (
          "loading"
        ) : (
          <>
            {isMobile && (
              <MobileHeader
                title={retriveData?.bookingId}
                // subTitle={retriveData?.bookingId}
                labelValue={`Booking Refund ${retriveData?.status === "refund" ? "Details" : "Quotation"}`}
              />
            )}
            <Grid
              container
              sx={{
                width: { xs: "90%", sm: "90%", md: "90%", lg: "100%" },
                mt: { xs: 3, lg: 0 },
                mx: "auto",
              }}
            >
              <Grid
                container
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: "15px",
                }}
              >
                <Grid
                  item
                  lg={2.4}
                  xs={12}
                  sx={{
                    display: {
                      xs: type === "Refund Fare Information" ? "block" : "none",
                      lg: "block",
                    },
                  }}
                >
                  <TicketStatus data={retriveData} />
                  <RefundPriceBreakdown
                    data={retriveData}
                    priceBreakdown={priceBreakdown || []}
                    label={
                      retriveData?.status === "refund"
                        ? "Total Refund Amount"
                        : "Total Refundable Amount"
                    }
                    serviceCharge={agentQuotationPrice?.serviceCharge}
                    // serviceCharge={totalServiceCharge}
                    airlineCharge={
                      (agentQuotationPrice?.airlineCharge || 0).toLocaleString(
                        "en-IN"
                      ) + " BDT"
                    }
                    amount={
                      Number(
                        (agentQuotationPrice?.refundedAmount || 0).toFixed(2)
                      ).toLocaleString("en-IN") + " BDT"
                    }
                    ait={
                      Number(
                        (agentQuotationPrice?.ait || 0).toFixed(2)
                      ).toLocaleString("en-IN") + " BDT"
                    }
                  />

                  <Box sx={{ mb: "5px" }}>
                    {retriveData?.status === "refund to be confirmed" && (
                      <TimeCountDown
                        label="Refund To Be Confirmed Time Limit"
                        timeLimit={moment(refunds?.timeLimit)}
                      />
                    )}

                    {retriveData?.details?.structure.length > 0 && (
                      <Box mt={"20px"}>
                        <FareRulesCharges
                          structure={retriveData?.details?.structure || []}
                          nonStructure={
                            retriveData?.details?.nonStructure || []
                          }
                          bookingData={retriveData}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={9.4}
                  sx={{
                    bgcolor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: "5px",
                    display: {
                      xs:
                        type === "Booking Refund Quotation" ? "block" : "none",
                      lg: "block",
                    },
                  }}
                >
                  <Box>
                    <PageTitle
                      title={`Booking Refund ${retriveData?.status === "refund" ? "Details" : "Quotation"}`}
                    />

                    {/*Flight Itinery Onward start here */}
                    {retriveData?.details?.route.map((ro, index) => {
                      const hasItineraryIndex =
                        refundIndexes?.some(
                          (item) => item?.indexNumber === index
                        ) ?? false;

                      return (
                        <Grid
                          item
                          lg={12}
                          sx={{
                            bgcolor: "#fff",
                            p: "12px 15px",
                            display: {
                              xs: "none",
                              lg: "block",
                            },
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
                            Passenger Information
                          </Typography>

                          <Box
                            sx={{
                              display: { xs: "none", lg: "block" },
                            }}
                          >
                            <DynamicMuiTable
                              columns={passengerColumns}
                              rows={passengerRows}
                              getCellContent={(row, colIndex) => row[colIndex]}
                            />
                          </Box>

                          <Typography
                            mt={3}
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
                            <span
                              style={{
                                color: "var(--primary-color)",
                                fontSize: "13px",
                              }}
                            >
                              {hasItineraryIndex && " (Refund Requested)"}
                            </span>
                          </Typography>

                          <DynamicMuiTable
                            columns={itineraryColumns}
                            rows={[itineraryRows[index]]}
                            getCellContent={(row, colIndex) => row[colIndex]}
                          />
                        </Grid>
                      );
                    })}

                    {/* --- Flight Itinerary for Mobile start --- */}
                    {isMobile ? (
                      ""
                    ) : (
                      <Box
                        sx={{
                          display: { xs: "block", lg: "none" },
                          px: 2,
                          pt: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            pb: "15px",
                          }}
                        >
                          Select your prefered itinerary
                        </Typography>
                        {retriveData?.details?.route?.map((route, index) => (
                          <MobileItineraryCard
                            key={index}
                            retriveData={retriveData}
                            index={index}
                            route={route}
                            isReissue={true}
                            isRefund={true}
                          />
                        ))}
                      </Box>
                    )}

                    {/* --- Flight Itinerary for Mobile end --- */}

                    {/* Refund Fare Start Here */}

                    {isMobile ? (
                      ""
                    ) : (
                      <Box sx={{ p: isMobile ? "0px" : 2, pb: 0 }}>
                        <Typography
                          mt={3}
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            pb: "15px",
                          }}
                        >
                          Refund Fare Information
                        </Typography>
                      </Box>
                    )}
                    {isMobile ? (
                      <Box sx={{ p: 2 }}>
                        {quotationPriceBreakdown?.map((passenger, idx) => {
                          const crrPassenger = priceBreakdown.find(
                            (item) => item?.paxType === passenger.paxType
                          );

                          return (
                            <Box key={idx}>
                              <Box mb={1}>
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    textTransform: "none",
                                  }}
                                >
                                  {formatName(passenger?.firstName)}{" "}
                                  {formatName(passenger?.lastName)}
                                </Typography>

                                <Typography
                                  sx={{ fontSize: "11px", color: "#888888" }}
                                >
                                  {passenger?.ticketNumber},{" "}
                                  <span style={{ color: "red" }}>
                                    {passenger?.paxType === "ADT"
                                      ? "Adult"
                                      : passenger?.paxType === "CNN" ||
                                          passenger?.paxType === "CHD"
                                        ? "Child"
                                        : passenger?.paxType === "INF"
                                          ? "Infant"
                                          : ""}
                                  </span>
                                </Typography>
                              </Box>
                              <Divider />
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888", fontWeight: "600" }}
                                    variant="caption"
                                  >
                                    Fare Name
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "red" }}
                                    variant="caption"
                                  >
                                    Old Fare
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "var(--green)" }}
                                    variant="caption"
                                  >
                                    Refundable Fare
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Divider />
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    Base Fare
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {(
                                      crrPassenger?.baseFare || 0
                                    )?.toLocaleString("en-IN")}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {(passenger?.baseFare || 0)?.toLocaleString(
                                      "en-IN"
                                    )}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Divider />
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    TAX
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {(crrPassenger?.tax || 0)?.toLocaleString(
                                      "en-IN"
                                    )}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{
                                      mt: 0.5,
                                      color: "#888888",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                    variant="caption"
                                  >
                                    {(passenger?.tax || 0)?.toLocaleString(
                                      "en-IN"
                                    ) + " BDT"}
                                    <RemoveRedEyeIcon
                                      onClick={() => {
                                        setCrrAllTax((prev) => {
                                          return {
                                            ...prev,
                                            isOpen: true,
                                            allTax: passenger?.allTax,
                                            oldTax: crrPassenger?.allTax,
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
                                </Grid>
                              </Grid>
                              <Divider />
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    Service Charge
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    0 BDT
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {passenger?.serviceCharge} BDT
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Divider />
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    Total Fare
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {(
                                      crrPassenger?.tax +
                                        crrPassenger?.baseFare || "0"
                                    )?.toLocaleString("en-IN")}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {passenger?.clientPrice?.toLocaleString(
                                      "en-IN"
                                    )}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Divider />
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    Discount
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {crrPassenger?.commission?.toLocaleString(
                                      "en-IN"
                                    )}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {passenger?.commission?.toLocaleString(
                                      "en-IN"
                                    )}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Divider />
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    Service Charge
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    0 BDT
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {passenger?.serviceCharge?.toLocaleString(
                                      "en-IN"
                                    )}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Divider />
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    Agent Fare
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {Number(
                                      crrPassenger?.agentPrice.toFixed(2)
                                    )?.toLocaleString("en-IN")}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{ color: "#888888" }}
                                    variant="caption"
                                  >
                                    {Number(
                                      (passenger?.agentPrice || 0).toFixed(2)
                                    )?.toLocaleString("en-IN")}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      ""
                    )}
                    {isMobile ? (
                      <Drawer
                        anchor="bottom"
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                        PaperProps={{
                          sx: {
                            borderRadius: 2,
                            p: 2,
                            m: 1,
                          },
                        }}
                      >
                        <Box id="mainBox" sx={{ p: 0.5 }}>
                          <Typography>Refund Breakdown</Typography>
                          <Box sx={{ py: 1 }}>
                            <Box sx={refundSpaceBewteen}>
                              <Typography sx={refundStyle}>
                                Total Base
                              </Typography>
                              <Typography sx={refundStyle}>
                                {(
                                  agentQuotationPrice?.baseFare || 0
                                ).toLocaleString("en-IN")}{" "}
                                BDT
                              </Typography>
                            </Box>
                            <Box sx={refundSpaceBewteen}>
                              <Typography sx={refundStyle}>
                                Total TAX
                              </Typography>
                              <Typography sx={refundStyle}>
                                {(agentQuotationPrice?.tax || 0).toLocaleString(
                                  "en-IN"
                                )}{" "}
                                BDT
                              </Typography>
                            </Box>
                            <Box sx={refundSpaceBewteen}>
                              <Typography sx={refundStyle}>
                                Gross Cost
                              </Typography>
                              <Typography sx={refundStyle}>
                                {(
                                  agentQuotationPrice?.clientPrice || 0
                                ).toLocaleString("en-IN")}{" "}
                                BDT
                              </Typography>
                            </Box>
                          </Box>
                          <Divider />
                          <Box sx={{ ...refundSpaceBewteen, py: 0.5 }}>
                            <Typography sx={refundStyle}>Discount</Typography>
                            <Typography sx={refundStyle}>
                              {(
                                agentQuotationPrice?.clientPrice || 0
                              ).toLocaleString("en-IN")}{" "}
                              BDT
                            </Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ py: 1 }}>
                            <Box sx={refundSpaceBewteen}>
                              <Typography sx={refundStyle}>
                                After Discount Fare
                              </Typography>
                              <Typography sx={refundStyle}>
                                {(
                                  agentQuotationPrice?.refundableAmount || 0
                                ).toLocaleString("en-IN")}{" "}
                                BDT
                              </Typography>
                            </Box>
                            <Box sx={refundSpaceBewteen}>
                              <Typography sx={refundStyle}>
                                Total FFI Service Charge
                              </Typography>
                              <Typography sx={refundStyle}>
                                {(
                                  agentQuotationPrice?.serviceCharge || 0
                                ).toLocaleString("en-IN")}{" "}
                                BDT
                              </Typography>
                            </Box>
                            {type !== "void" && (
                              <Box sx={refundSpaceBewteen}>
                                <Typography sx={refundStyle}>
                                  Airlines Charge{" "}
                                  <span
                                    style={{
                                      color: "var(--primary-color)",
                                    }}
                                  >
                                    ({refundChargeNote})
                                  </span>
                                </Typography>
                                <Typography sx={refundStyle}>
                                  {(
                                    agentQuotationPrice?.airlineCharge || 0
                                  ).toLocaleString("en-IN")}{" "}
                                  BDT
                                </Typography>
                              </Box>
                            )}
                            <Box sx={refundSpaceBewteen}>
                              <Typography sx={refundStyle}>
                                Total AIT
                              </Typography>
                              <Typography sx={refundStyle}>
                                {(agentQuotationPrice?.ait || 0).toLocaleString(
                                  "en-IN"
                                )}{" "}
                                BDT
                              </Typography>
                            </Box>
                          </Box>
                          <Divider />
                          <Box sx={{ ...refundSpaceBewteen, py: 0.5 }}>
                            <Typography sx={refundStyle}>
                              Refunded Amount
                            </Typography>
                            <Typography sx={refundStyle}>
                              {(
                                agentQuotationPrice?.refundedAmount || 0
                              ).toLocaleString("en-IN")}{" "}
                              BDT
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 2,
                            mb: 1.2,
                          }}
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            sx={{
                              ml: -1,
                              "& .MuiSvgIcon-root": {
                                color: "var(--primary-color)",
                              },
                            }}
                            defaultChecked
                            size="small"
                          />
                          <Typography sx={refundStyle}>
                            By Completing this operation agree with our{" "}
                            <span style={{ color: "var(--primary-color)" }}>
                              Tearms and Conditions{" "}
                            </span>
                            &{" "}
                            <span style={{ color: "var(--primary-color)" }}>
                              Privacy Policy
                            </span>
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              textAlign: "center",
                              bgcolor: "var(--primary-color)",
                              py: 1,
                              color: "white",
                              borderRadius: "5px",
                              fontSize: "14px",
                              cursor: "pointer",
                              opacity: isMobile && !isChecked ? 0.5 : 1,
                            }}
                            onClick={() => {
                              if (isMobile && !isChecked) return;
                              handleSubmit(
                                proceedType === "approve"
                                  ? "Approve Refund Quotation"
                                  : "Reject Refund Quotation",
                                `Are you sure? You want to ${proceedType === "approve" ? "Approve" : "Reject"} This Refund Quotation?`
                              );
                            }}
                          >
                            {proceedType === "approve" ? "Approve" : "Reject"}
                          </Typography>
                        </Box>
                      </Drawer>
                    ) : (
                      <Box
                        sx={{
                          "& .MuiTableCell-root": {
                            "& .MuiBox-root": {
                              display: "flex",
                              justifyContent: "space-between",
                              pb: "8px",
                            },
                          },
                          px: 2,
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
                              {[
                                quotationPriceBreakdown.map((passenger, i) => {
                                  const crrPassenger = priceBreakdown.find(
                                    (item) =>
                                      item?.paxType === passenger.paxType
                                  );

                                  return (
                                    <TableRow key={i}>
                                      <TableCell sx={{ width: "14%" }}>
                                        <span
                                          style={{
                                            color: "var(--secondary-color)",
                                            fontWeight: "600",
                                          }}
                                        >
                                          {passenger?.firstName}{" "}
                                          {passenger?.lastName}
                                        </span>{" "}
                                        ({passenger?.paxType}) <br />
                                        {passenger?.ticketNumber}
                                      </TableCell>

                                      <TableCell>
                                        <SubTable
                                          oldValue={
                                            <span style={{ color: "#DC143C" }}>
                                              Old Fare
                                            </span>
                                          }
                                          refundValue={
                                            <span
                                              style={{ color: "var(--green)" }}
                                            >
                                              Refund Fare
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
                                              {crrPassenger?.commission?.toLocaleString(
                                                "en-IN"
                                              )}{" "}
                                              BDT
                                            </span>
                                          }
                                          refundValue={
                                            <span style={{ color: "#DC143C" }}>
                                              {passenger?.commission?.toLocaleString(
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
                                            <span style={{ color: "#C0C0C0" }}>
                                              0 BDT
                                            </span>
                                          }
                                          refundValue={
                                            <span>
                                              {passenger?.serviceCharge?.toLocaleString(
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
                                            <span style={{ color: "#C0C0C0" }}>
                                              0 BDT
                                            </span>
                                          }
                                          refundValue={
                                            <span>
                                              {(
                                                passenger?.airlineCharge || 0
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
                                                crrPassenger?.agentPrice.toFixed(
                                                  2
                                                )
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
                                              {Number(
                                                (
                                                  passenger?.agentPrice || 0
                                                ).toFixed(2)
                                              )?.toLocaleString("en-IN")}{" "}
                                              BDT
                                            </span>
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  );
                                }),
                              ]}

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
                                        Total Refund Fare
                                      </span>
                                    }
                                  />
                                </TableCell>

                                <TableCell>
                                  <SubTable
                                    oldValue={
                                      <span style={{ color: "#C0C0C0" }}>
                                        {totalOldBaseFare?.toLocaleString(
                                          "en-IN"
                                        )}{" "}
                                        BDT
                                      </span>
                                    }
                                    refundValue={
                                      <span>
                                        {(
                                          agentQuotationPrice?.baseFare || 0
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
                                        {totalOldTax?.toLocaleString("en-IN")}{" "}
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
                                          agentQuotationPrice?.tax || 0
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
                                          totalOldBaseFare + totalOldTax
                                        ).toLocaleString("en-IN")}{" "}
                                        BDT
                                      </span>
                                    }
                                    refundValue={
                                      <span>
                                        {(
                                          agentQuotationPrice?.clientPrice || 0
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
                                        {totalOldDicount.toLocaleString(
                                          "en-IN"
                                        )}{" "}
                                        BDT
                                      </span>
                                    }
                                    refundValue={
                                      <span style={{ color: "#DC143C" }}>
                                        {(
                                          agentQuotationPrice?.commission || 0
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
                                          agentQuotationPrice?.serviceCharge ||
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
                                          agentQuotationPrice?.airlineCharge ||
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
                                          totalOldAgentPrice?.toFixed(2)
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
                                        {Number(
                                          (
                                            agentQuotationPrice?.refundableAmount ||
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
                                  height: "270px",
                                  verticalAlign: "bottom",
                                  pr: 1,
                                }}
                              >
                                <TableCell
                                  colSpan={4}
                                  sx={{ fontSize: "13px" }}
                                ></TableCell>
                                <TableCell
                                  colSpan={5}
                                  sx={{ fontSize: "13px" }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Box>
                                      <span>Total Agent Fare </span>
                                      {Number(
                                        (
                                          agentQuotationPrice?.refundableAmount ||
                                          0
                                        ).toFixed(2)
                                      ).toLocaleString("en-IN")}{" "}
                                      BDT
                                    </Box>

                                    <Box
                                      sx={{
                                        borderTop: "1px solid var(--border)",
                                        pt: 1,
                                      }}
                                    >
                                      <span>Total Paid Amount</span>
                                      {(retriveData?.partialPayment
                                        ? retriveData?.partialPayment
                                            ?.totalPayedAmount
                                        : retriveData?.agentPrice
                                      ).toLocaleString("en-IN")}{" "}
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
                                        ? retriveData?.partialPayment?.dueAmount
                                        : 0
                                      ).toLocaleString("en-IN")}{" "}
                                      BDT
                                    </Box>

                                    <Box mt={1}>
                                      <span style={{ color: "#DC143C" }}>
                                        Total AIT (-)
                                      </span>
                                      <span
                                        style={{
                                          ...styles.priceStyle,
                                          color: "#DC143C",
                                        }}
                                      >
                                        {Number(
                                          (
                                            agentQuotationPrice?.ait || 0
                                          ).toFixed(2)
                                        ).toLocaleString("en-IN")}{" "}
                                        BDT
                                      </span>
                                    </Box>

                                    <Box>
                                      <span style={{ color: "#DC143C" }}>
                                        Total FFI Service Charge (-)
                                      </span>
                                      <span
                                        style={{
                                          ...styles.priceStyle,
                                          color: "#DC143C",
                                        }}
                                      >
                                        {(
                                          agentQuotationPrice?.serviceCharge ||
                                          0
                                        ).toLocaleString("en-IN")}{" "}
                                        BDT
                                      </span>
                                    </Box>

                                    <Box>
                                      <Typography
                                        sx={{
                                          fontSize: "13px",
                                          color: "#DC143C",
                                        }}
                                      >
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
                                        {Number(
                                          (
                                            agentQuotationPrice?.airlineCharge ||
                                            0
                                          ).toFixed(2)
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
                                          style={{
                                            ...styles.priceStyle,
                                            color: "#DC143C",
                                          }}
                                        >
                                          {(
                                            retriveData?.partialPayment
                                              ?.totalCharge || 0
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
                                        Agent Refunded Amount
                                      </span>
                                      <span
                                        style={{
                                          ...styles.priceStyle,
                                          width: "50%",
                                          color: "var(--green)",
                                        }}
                                      >
                                        {Number(
                                          (
                                            agentQuotationPrice?.refundedAmount ||
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
                    )}

                    {retriveData?.status === "refund to be confirmed" && (
                      <Box
                        sx={{
                          mb: 2.5,
                          mt: 3,
                          mx: 2,
                          display: {
                            xs: "none",
                            lg: "block",
                          },
                        }}
                      >
                        <Button
                          style={{
                            ...nextStepStyle,
                            position: "block",
                          }}
                          onClick={() => {
                            if (!isMobile) {
                              handleSubmit(
                                "Approve Refund Quotation",
                                "Are you sure? You want to Approve This Refund Quotation?"
                              );
                            }
                          }}
                        >
                          Approve Refund Quotation
                        </Button>

                        <Button
                          style={{
                            ...nextStepStyle,
                            backgroundColor: "#333333",
                            position: "block",
                            marginTop: "15px",
                          }}
                          onClick={() => {
                            if (!isMobile) {
                              handleSubmit(
                                "Reject Refund Quotation",
                                "Are you sure? You want to Reject This Refund Quotation?"
                              );
                            }
                          }}
                        >
                          Reject Refund Quotation
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <CustomOperationButton
                    proceedType={proceedType}
                    setProceedType={setProceedType}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* --- mobile button start --- */}
            <Box
              sx={{
                display: {
                  xs: "block",
                  lg: "none",
                },
                position: "fixed",
                bottom: 0,
                width: "100%",
              }}
            >
              {type === "Refund Fare Information" ? (
                <Button
                  sx={mobileButtonStyle}
                  onClick={() => setType("Booking Refund Request")}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      px: 8,
                    }}
                  >
                    PROCEED TO REFUND QUOTATION FOR THIS BOOKING
                  </Typography>
                </Button>
              ) : (
                <>
                  {proceedType === "approve" ? (
                    <Button
                      sx={mobileButtonStyle}
                      onClick={() => {
                        if (!isMobile) {
                          handleSubmit(
                            "Approve Refund Quotation",
                            "Are you sure? You want to Approve This Refund Quotation?"
                          );
                        } else {
                          setDrawerOpen(true);
                        }
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          px: 8,
                        }}
                      >
                        Approve Refund Quotation
                      </Typography>
                    </Button>
                  ) : (
                    <Button
                      sx={mobileButtonStyle}
                      onClick={() => {
                        if (!isMobile) {
                          handleSubmit(
                            "Reject Refund Quotation",
                            "Are you sure? You want to Reject This Refund Quotation?"
                          );
                        } else {
                          setDrawerOpen(true);
                        }
                      }}
                    >
                      <Typography sx={{ fontSize: "12px", px: 8 }}>
                        Reject Refund Quotation
                      </Typography>
                    </Button>
                  )}
                </>
              )}
            </Box>
            {/* --- mobile button end --- */}
          </>
        )}
      </Box>

      <ApproveRejectDialog
        currentData={currentData}
        titleRef={titleRef}
        isDisabled={refundStatus === "pending"}
        handleChangeSwitch={handleChangeSwitch}
        open={dialogOpen}
        setOpen={setDialogOpen}
      />

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

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

      <CustomLoadingAlert
        open={refundStatus === "pending"}
        text={"We Are Processing Refund Quotation"}
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

export const TaxBreakDown = ({ crrAllTax }) => {
  const { isMobile } = useWindowSize();
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
            {[
              "Tax Name",
              isMobile ? "Old Tax" : "Old Tax Amount",
              isMobile ? "Refundable Tax" : "Refundable Tax Amount",
            ].map((head, i) => (
              <TableCell
                key={i}
                style={{
                  backgroundColor: i > 0 ? "#F0F9FF" : "var(--secondary-color)",
                  color: i > 0 ? "var(--secondary-color)" : "white ",
                  textAlign: i > 0 ? "right" : "left",
                  paddingRight: "8px",
                }}
              >
                {head}
              </TableCell>
            ))}
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
                      width: isMobile ? "80px" : "180px",
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

const itineraryColumns = [
  "Airlines",
  "Destination",
  "Stops",
  "Flight No",
  "Flight Date",
  "Payment Status",
  "Flight Status",
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
const refundStyle = { color: "#888888", fontSize: "13px" };

const refundSpaceBewteen = { display: "flex", justifyContent: "space-between" };
export default RefundQuotation;
