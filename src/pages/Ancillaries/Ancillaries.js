import { ThemeProvider } from "@emotion/react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AncillariesModal from "../../component/AirBooking/AncillariesModal";
import {
  clearAncillaries,
  removeAncillary,
} from "../../component/AirBooking/components/ancillariesSlice";
import PriceBreakdown, {
  TicketStatus,
} from "../../component/AirBooking/PriceBreakdown";
import CustomAlert from "../../component/Alert/CustomAlert";
import CustomToast from "../../component/Alert/CustomToast";
import ImmediateTimeLimit from "../../component/Alert/ImmediateTimeLimit";
import CustomSelectTabBar from "../../component/CustomTabBar/CustomSelectTabBar";
import CustomTabBar from "../../component/CustomTabBar/CustomTabBar";
import ServerError from "../../component/Error/ServerError";
import TimeCountDown from "../../component/FlightAfterSearch/components/TimeCountDown";
import NotFound from "../../component/NotFound/NoFound";
import PaymentGateway from "../../component/PaymentGateway/PaymentGateway";
import BookingDetailsSkeleton from "../../component/SkeletonLoader/BookingDetailsSkeleton";
import FilterSkeleton from "../../component/SkeletonLoader/FilterSkeleton";
import { TicketStatusSkeleton } from "../../component/SkeletonLoader/TicketStatusSkeleton";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import { actionBtn } from "../../shared/common/ApproveRejectDialog";
import PageTitle from "../../shared/common/PageTitle";
import { BpCheckedIcon, BpIcon } from "../../shared/common/styles";
import { mobileButtonStyle, nextStepStyle } from "../../style/style";
import { theme } from "../../utils/theme";
import PartialPaid from "../Bookings/AirBookings/PartialPaid";
import BookingHeader from "../Bookings/components/BookingHeader";
import { CustomOperationButton } from "../Bookings/components/CustomOperationButton";
import PdfCard from "../Bookings/components/PdfCard";
import QueueHeader from "../Bookings/components/QueueHeader";
import AncillariesAdd from "./components/AncillariesAdd";
import AncillariesCard from "./components/AncillariesCard";
import AncillariesPriceBreakdown from "./components/AncillariesPriceBreakdown";
import RefundAncillaries from "./components/RefundAncillaries";
import CustomLoadingAlert from "../../component/Alert/CustomLoadingAlert";

const itineraryColumns = [
  "Select",
  "Airlines",
  "Destination",
  "Stops",
  "Flight No",
  "Flight Date",
];

const TextTabEnum = {
  pending: "pending",
  processing: "processing",
  approved: "approved",
  toBeConfirmed: "to be confirmed",
  refundPending: "refund pending",
  refundApproved: "refund approved",
  payment: "payment",
};

const Ancillaries = () => {
  const { state } = useLocation();
  const { retriveData, passengers, bookingId } = state;
  const { jsonHeader } = useAuth();
  const { id } = useParams();
  const [pax, setPax] = useState({});
  const [route, setRoute] = useState({});
  const [openAnciIndex, setOpenAnciIndex] = useState(null);
  const [clear, setClear] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [textActiveTab, setTextActiveTab] = useState("");
  const [isRefund, setIsRefund] = useState(false);
  const [type, setType] = useState("Booking Ancillaries");
  const [proceedType, setProceedType] = useState("approve");
  const [ancillaryRefundData, setAncillaryRefundData] = useState([]);
  const ancillaries = useSelector((state) => state.ancillaries);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);

  const {
    data: ancillaryData,
    isLoading: ancilaryLoading,
    isError: isAncillaryError,
    error: ancillaryError,
  } = useQuery({
    queryKey: ["ancillaryData", bookingId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/${bookingId}/passenger-ancillaries/all`,
        jsonHeader()
      );
      return data;
    },
  });

  const isProcessingData = Boolean(
    ancillaryData?.data[TextTabEnum?.processing]
  );
  const isPendingData = Boolean(ancillaryData?.data[TextTabEnum?.pending]);
  const isTobeConfirmedData = Boolean(
    ancillaryData?.data[TextTabEnum?.toBeConfirmed]
  );
  const isApprovedData = Boolean(ancillaryData?.data[TextTabEnum?.approved]);

  const { mutate, status } = useMutation({
    mutationFn: (data) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/ancillary-requests`,
        data,
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        dispatch(clearAncillaries());
        showToast("success", data?.data?.message, () => {
          navigate(-1);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["ancilaryData"]);
    },
    onError: (err) => {
      let errorMessage = "An unexpected error occurred.";
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = err.message;
      }
      showToast("error", errorMessage);
    },
  });

  const { mutate: removeAncillaries } = useMutation({
    mutationFn: (id) =>
      axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/ancillary-requests/ancillaries/${id}`,
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message, () => {
          // navigate(-1);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["ancillaryData"]);
    },
    onError: (err) => {
      let errorMessage = "An unexpected error occurred.";
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = err.message;
      }
      showToast("error", errorMessage);
    },
  });

  const { mutate: approvedAncillary, status: approvedAncillaryStatus } =
    useMutation({
      mutationFn: (data) =>
        axios.patch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/ancillary-requests/${data?.id}`,
          {
            status: data?.status,
          },
          jsonHeader()
        ),
      onSuccess: (data) => {
        if (data?.data?.success) {
          showToast("success", data?.data?.message, () => {
            navigate(-1);
          });
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(["ancilaryData"]);
      },
      onError: (err) => {
        let errorMessage = "An unexpected error occurred.";
        if (err.response) {
          errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
          errorMessage = err.message;
        }

        showToast("error", errorMessage);
      },
    });

  const {
    data: singleBookingData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["singleBookingData", id],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/retrieve`,
        {
          bookingId: id,
        },
        jsonHeader()
      );
      return data;
    },
  });

  useEffect(() => {
    if (ancillaryData) {
      const filteredTabs = Object.keys(ancillaryData?.data || {});
      if (filteredTabs.length > 0) {
        setTextActiveTab(filteredTabs[0]);
      } else {
        setTextActiveTab("Add New Ancillaries");
      }
    }
  }, [ancillaryData]);

  const ancilaryRequestData = ancillaryData?.data[
    TextTabEnum?.toBeConfirmed
  ]?.requests?.find((item) => item?.status === "to be confirmed");

  if (isLoading || ancilaryLoading) {
    return (
      <Box>
        <Box
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },
          }}
        >
          <QueueHeader type={type} tabs={tabs} />
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <span>Loading...</span>
          </Typography>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            mt: 2,
            display: {
              xs: "none",
              sm: "flex",
            },
          }}
        >
          <Grid item xs={2.4}>
            <TicketStatusSkeleton />
            <FilterSkeleton />
          </Grid>
          <Grid item xs={9.6}>
            <BookingDetailsSkeleton />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (isError || isAncillaryError) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          height: "calc(93vh - 150px)",
          borderRadius: "5px",
        }}
      >
        <ServerError
          message={
            error?.response?.data?.message || ancillaryError?.data?.message
          }
        />
      </Box>
    );
  }

  if (!singleBookingData || !ancillaryData?.data) {
    return (
      <Box>
        <NotFound />
      </Box>
    );
  }

  const { data } = singleBookingData;

  const itineraryRows =
    data?.details?.route.map((route, index) => {
      const stops = data?.details?.cityCount[index];
      const stopCount = stops.length - 1;
      const stopDescription =
        stopCount > 0
          ? `${stopCount} Stop${stopCount > 1 ? "s" : ""} via ${stops
              .slice(0, -1)
              .map((stop) => stop.arrivalCityCode)
              .join(", ")}`
          : "Non-stop";

      return [
        "Jahidul Islam",
        stops[0].marketingCarrierName,
        `${route.departure} - ${route.arrival}`,
        stopDescription,
        `${stops[0].marketingCarrier} ${stops[0].marketingFlight}`,
        moment(stops[0]?.departureDate).format("DD MMM, YYYY"),
      ];
    }) || [];

  const getCellContent = (row, colIndex) => {
    if (colIndex === 0) {
      return (
        <Checkbox
          disableRipple
          checked={row[colIndex]}
          checkedIcon={<BpCheckedIcon color={"white"} />}
          icon={<BpIcon color={"white"} />}
        />
      );
    }
    return row[colIndex];
  };

  const handleRemove = async (id) => {
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to remove this ancillary!",
    });
    if (result.isConfirmed) {
      removeAncillaries(id);
    }
  };

  if (data?.details === null) {
    return (
      <Box>
        <NotFound />
      </Box>
    );
  }

  const refundData = data?.details?.structure?.filter((item) =>
    item.name.toLowerCase().includes("refund")
  );

  const handleOpenAnci = (index, pax, route, isAncillaries) => {
    setOpenAnciIndex(index);
    setPax(pax);
    setRoute(route);
    setClear(isAncillaries);
  };

  const handleRemoveAncillary = async (index, pax, route, label) => {
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to remove this ancillary?",
    });
    if (result?.isConfirmed) {
      dispatch(
        removeAncillary({
          index,
          pax,
          route,
          label,
        })
      );
    }
  };

  const ancillariesData = ancillaries?.find(
    (item) =>
      item.pax.firstName === pax.firstName && item.pax.lastName === pax.lastName
  );

  const isAncillaries = Boolean(ancillariesData?.ancillaries);

  const onSubmit = async () => {
    const data = {
      bookingId: retriveData?.id,
      passengers: ancillaries?.map((ancillary) => ({
        passengerId: ancillary?.pax?.id,
        itineraries: [
          {
            itineraryIndex: ancillary.index + 1,
            ancillaries: ancillary.ancillaries.map((ancillary) => ({
              type: ancillary.label.toLowerCase().replace(/\s+/g, "-"),
              description: ancillary.value,
            })),
          },
        ],
      })),
    };

    const sendData = {
      bookingId: data.bookingId,
      passengers: Object.values(
        data.passengers.reduce((acc, passenger) => {
          if (!acc[passenger.passengerId]) {
            acc[passenger.passengerId] = {
              passengerId: passenger.passengerId,
              itineraries: [],
            };
          }
          acc[passenger.passengerId].itineraries.push(...passenger.itineraries);
          return acc;
        }, {})
      ),
    };

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to make Ancillaries Request!",
    });

    if (result?.isConfirmed) {
      setIsLoadingSpinner(true);
      mutate(sendData, {
        onSettled: () => {
          setIsLoadingSpinner(false);
        },
      });
    }
  };

  const handleSubmit = async (id, status, message) => {
    const sendData = {
      id,
      status,
    };

    const result = await CustomAlert({
      success: "warning",
      message: `Are you sure? You want to ${message} Ancillaries?`,
    });

    if (result?.isConfirmed) {
      setIsLoadingSpinner(true);
      approvedAncillary(sendData, {
        onSettled: () => {
          setIsLoadingSpinner(false);
        },
      });
    }
  };

  const handleAncillariesApprove = () => {
    handleSubmit(ancilaryRequestData?.id, "accepted", "Approved");
  };

  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
    } else if (event?.target?.value?.toLowerCase() === "payment information") {
      setIsPayment(true);
    } else {
      setType(newTab);
    }
  };

  const handleTabChange = (event, newTab) => {
    if (event?.target?.value) {
      setTextActiveTab(event?.target?.value);
    } else {
      setTextActiveTab(newTab);
    }
  };

  const filteredTabs = Object.keys(ancillaryData?.data);

  const shouldRemoveAddNewTab =
    isPendingData || isTobeConfirmedData || isProcessingData;

  if (!shouldRemoveAddNewTab) {
    filteredTabs.unshift("Add New Ancillaries");
  }

  const totalAncillariesPrice = ancillaryData?.data[
    TextTabEnum.toBeConfirmed
  ]?.passengerAncillaries
    .flatMap((passenger) => passenger.ancillaries)
    .filter(
      (ancillary) =>
        ancillary.status === "available" && ancillary.price !== null
    )
    .reduce((sum, ancillary) => sum + ancillary.price, 0);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mb: { xs: 6, lg: 0 } }}>
        <BookingHeader
          type={type}
          handleTypeChange={handleTypeChange}
          tabs={
            isPayment
              ? [
                  ...tabs,
                  {
                    label: "Payment Information",
                    value: "Payment Information",
                  },
                ]
              : tabs
          }
          retriveData={retriveData}
        />
        <Grid
          container
          sx={{
            width: { xs: "90%", md: "100%" },
            mt: { xs: 4, lg: 0 },
            mx: "auto",
          }}
        >
          <Grid
            container
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid
              item
              xs={12}
              lg={2.4}
              sx={{
                display: {
                  xs: type === "Fare Information" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <TicketStatus data={data} />
              {isTobeConfirmedData && (
                <TimeCountDown
                  label={"Ancillaries Time Limit"}
                  timeLimit={ancilaryRequestData?.timeLimit}
                />
              )}
              <Box sx={{ mb: "5px" }}>
                {data?.status === "refund to be confirmed" && (
                  <TimeCountDown
                    label="Refund To Be Confirmed Time Limit"
                    timeLimit={moment(data?.refunds[0]?.timeLimit)}
                  />
                )}
              </Box>
              {data?.status?.toLowerCase() === "ticketed" && (
                <TimeCountDown
                  label="Void Request Expire Time Limit"
                  timeLimit={moment(data?.Tickets[0]?.createdAt)
                    .clone()
                    .set({ hour: 23, minute: 59, second: 0 })}
                />
              )}
              {data?.fareTimeLimit || data?.timeLimit
                ? data?.status?.toLowerCase() === "hold" && (
                    <TimeCountDown
                      label="Booking Expired at"
                      timeLimit={
                        data?.fareTimeLimit == null
                          ? data?.timeLimit
                          : data?.timeLimit == null
                            ? data?.fareTimeLimit
                            : data?.fareTimeLimit > data?.timeLimit
                              ? data?.timeLimit
                              : data?.fareTimeLimit
                      }
                    />
                  )
                : data?.status?.toLowerCase() === "hold" && (
                    <ImmediateTimeLimit label="Immediate Issue" />
                  )}
              {(data?.paymentStatus?.toLowerCase() === "partially paid" &&
                data?.status?.toLowerCase() === "ticketed") ||
                (data?.paymentStatus?.toLowerCase() === "partially paid" &&
                  data?.status?.toLowerCase() === "issue in process" && (
                    <TimeCountDown
                      label="Partial Due Clear Time limit"
                      timeLimit={`${data?.partialPayment?.dueDate}T23:59:59`}
                    />
                  ))}
              {isApprovedData && textActiveTab === TextTabEnum.approved && (
                <AncillariesPriceBreakdown
                  label="Total Ancillaries Paid"
                  ancillaryData={
                    ancillaryData?.data[TextTabEnum?.approved]
                      ?.passengerAncillaries
                  }
                  passengers={ancillaryData?.data[TextTabEnum?.approved]}
                />
              )}

              {isTobeConfirmedData &&
                textActiveTab === TextTabEnum.toBeConfirmed && (
                  <AncillariesPriceBreakdown
                    label="Total Ancillaries Payable"
                    ancillaryData={
                      ancillaryData?.data[TextTabEnum.toBeConfirmed]
                        ?.passengerAncillaries
                    }
                    passengers={ancillaryData?.data[TextTabEnum.toBeConfirmed]}
                  />
                )}

              <PdfCard singleBooking={data || []} />
              {/* {data?.details?.autoOperation?.partialPayment &&
                refundData?.length > 0 &&
                data?.agentPrice > 20000 && (
                  <PartialPaid refundData={refundData} />
                )} */}
            </Grid>
            <Grid
              item
              xs={12}
              lg={9.4}
              sx={{
                borderRadius: "5px",
                position: "relative",
                bgcolor: "#FFFFFF",
                display: {
                  xs:
                    type === "Booking Ancillaries" ||
                    type === "Payment Information"
                      ? "flex"
                      : "none",
                  lg: "block",
                },
              }}
            >
              {isRefund ? (
                <Box>
                  <PageTitle title={`Ancillary Refund`} />
                  <Box sx={{ my: 2 }}>
                    <RefundAncillaries
                      ancillaryData={ancillaryData?.data[TextTabEnum?.approved]}
                      retriveData={retriveData}
                      itineraryColumns={itineraryColumns}
                      itineraryRows={itineraryRows}
                      getCellContent={getCellContent}
                      setAncillaryRefundData={setAncillaryRefundData}
                      ancillaryRefundData={ancillaryRefundData}
                      setIsRefund={setIsRefund}
                      isShow={true}
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ width: "100%" }}>
                  <PageTitle
                    title={`${
                      textActiveTab === TextTabEnum.pending
                        ? "Pending Ancillaries"
                        : textActiveTab === TextTabEnum.processing
                          ? "On Process Ancillaries"
                          : textActiveTab === TextTabEnum.toBeConfirmed &&
                              !isPayment
                            ? "To Be Confirmed Ancillaries"
                            : textActiveTab === TextTabEnum.approved
                              ? "Approved Ancillaries"
                              : textActiveTab === TextTabEnum.refundPending
                                ? "Refund Pending Ancillaries"
                                : textActiveTab === TextTabEnum.refundApproved
                                  ? "Refund Approved Ancillaries"
                                  : textActiveTab ===
                                        TextTabEnum.toBeConfirmed && isPayment
                                    ? "Payment Information"
                                    : "Add Ancillaries"
                    }`}
                  />
                  {!isPayment && (
                    <Box
                      sx={{
                        px: {
                          xs: 1,
                          md: 2,
                        },
                        py: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: {
                            xs: "none",
                            md: "block",
                          },
                        }}
                      >
                        <CustomTabBar
                          allTabs={filteredTabs}
                          setTextActiveTab={setTextActiveTab}
                          textActiveTab={textActiveTab}
                        />
                        {(data?.status === "issue in process" ||
                          data?.status === "hold") && (
                          <Box
                            sx={{
                              mt: 2,
                              ".MuiSvgIcon-root": {
                                color: "var(--primary-color)",
                              },
                            }}
                          >
                            <Alert
                              severity="info"
                              sx={{
                                border: "1px solid var(--primary-color)",
                                bgcolor: "#fdeded",
                                color: "var(--primary-color)",
                                fontSize: "12px",
                                padding: "0px 10px",
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>Note:</span>{" "}
                              Once your ticket has been confirm, we will
                              provided a ancillaries quotation, such as extra
                              baggage, seat selection, or meals, based on your
                              request.
                            </Alert>
                          </Box>
                        )}
                      </Box>
                      {/* --- Mobile Select Tab Bar start --- */}
                      <Box
                        sx={{
                          display: {
                            xs: "block",
                            md: "none",
                          },
                          px: 1,
                        }}
                      >
                        <CustomSelectTabBar
                          allTabs={filteredTabs?.map((tab) => ({
                            label: tab,
                            value: tab,
                          }))}
                          activeTab={textActiveTab}
                          handleTabChange={handleTabChange}
                        />
                      </Box>
                      {/* --- Mobile Select Tab Bar end --- */}
                    </Box>
                  )}

                  <Box
                    sx={{
                      width: "100%",
                      // py: isPayment ? 0 : 2,
                      bgcolor: "#FFFFFF",
                      borderRadius: "5px",
                    }}
                  >
                    {textActiveTab === TextTabEnum?.pending ? (
                      <Box sx={{ width: "100%" }}>
                        <AncillariesCard
                          ancilaryData={
                            ancillaryData?.data[TextTabEnum?.pending]
                          }
                          retriveData={singleBookingData?.data}
                          itineraryColumns={itineraryColumns}
                          itineraryRows={itineraryRows}
                          getCellContent={getCellContent}
                        />
                      </Box>
                    ) : textActiveTab === TextTabEnum?.toBeConfirmed ? (
                      <Box>
                        {!isPayment ? (
                          <>
                            <AncillariesCard
                              ancilaryData={
                                ancillaryData?.data[TextTabEnum?.toBeConfirmed]
                              }
                              retriveData={singleBookingData?.data}
                              itineraryColumns={itineraryColumns}
                              itineraryRows={itineraryRows}
                              getCellContent={getCellContent}
                              handleRemove={handleRemove}
                            />

                            <Box
                              sx={{
                                px: 3,
                              }}
                            >
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1">
                                  Remarks
                                </Typography>

                                {/* Remarks textarea */}
                                <textarea
                                  placeholder="Enter Remarks"
                                  defaultValue={ancilaryRequestData?.remarks}
                                  className="text-area"
                                  rows="4"
                                  cols="130"
                                  readOnly
                                />
                              </Box>

                              <Stack spacing={2}>
                                <CustomOperationButton
                                  proceedType={proceedType}
                                  setProceedType={setProceedType}
                                />
                                <FormGroup sx={{ mb: 1 }}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={isAccept}
                                        onChange={(e) =>
                                          setIsAccept(e.target.checked)
                                        }
                                      />
                                    }
                                    label={
                                      <Typography
                                        sx={{
                                          color: "#8F8F98",
                                          fontSize: {
                                            xs: "0.7rem",
                                            md: "0.813rem",
                                          },
                                          fontWeight: "500",
                                          pt: {
                                            xs: "8px",
                                            lg: "2px",
                                          },
                                        }}
                                      >
                                        By Completing this Ancillaries Request
                                        Agree with our{" "}
                                        <Link
                                          to="#"
                                          target="_blank"
                                          style={{
                                            color: "var(--primary-color)",
                                            textDecoration: "none",
                                          }}
                                        >
                                          Terms and Conditions
                                        </Link>{" "}
                                        &
                                        <Link
                                          to="#"
                                          target="_blank"
                                          style={{
                                            color: "var(--primary-color)",
                                            textDecoration: "none",
                                          }}
                                        >
                                          {" "}
                                          Privacy Policy
                                        </Link>
                                      </Typography>
                                    }
                                  />
                                </FormGroup>
                                <Button
                                  disabled={!isAccept || status === "pending"}
                                  type="submit"
                                  onClick={() => setIsPayment(true)}
                                  sx={{
                                    ...actionBtn,
                                    ...actionBtn.green,
                                    width: "100%",
                                    textAlign: "left",
                                    py: 1.2,
                                    display: {
                                      xs: "none",
                                      lg: "flex",
                                    },
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      textAlign: "left",
                                      fontSize: "0.9rem",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {approvedAncillaryStatus === "pending"
                                      ? "Please Waiting..."
                                      : "Click to Proceed Ancillaries Payment"}
                                  </Typography>
                                </Button>
                                <Button
                                  disabled={!isAccept || status === "pending"}
                                  type="submit"
                                  onClick={() =>
                                    handleSubmit(
                                      ancilaryRequestData?.id,
                                      "canceled",
                                      "Reject"
                                    )
                                  }
                                  sx={{
                                    ...actionBtn,
                                    ...actionBtn.reject,
                                    width: "100%",
                                    py: 1.2,
                                    display: {
                                      xs: "none",
                                      lg: "flex",
                                    },
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      textAlign: "left",
                                      fontSize: "0.9rem",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {status === "pending"
                                      ? "Please waiting..."
                                      : " Reject Ancillaries Quotation"}
                                  </Typography>
                                </Button>
                              </Stack>
                            </Box>
                          </>
                        ) : (
                          <PaymentGateway
                            label={"Ancillaries"}
                            paymentPrice={totalAncillariesPrice || 0}
                            handleSubmit={handleAncillariesApprove}
                          />
                        )}
                      </Box>
                    ) : textActiveTab === TextTabEnum?.processing ? (
                      <AncillariesCard
                        ancilaryData={
                          ancillaryData?.data[TextTabEnum?.processing]
                        }
                        retriveData={singleBookingData?.data}
                        itineraryColumns={itineraryColumns}
                        itineraryRows={itineraryRows}
                        getCellContent={getCellContent}
                      />
                    ) : textActiveTab === TextTabEnum?.refundPending ? (
                      <RefundAncillaries
                        data={data}
                        ancillaryData={
                          ancillaryData?.data[TextTabEnum?.refundPending]
                        }
                        retriveData={retriveData}
                        itineraryColumns={itineraryColumns}
                        itineraryRows={itineraryRows}
                        getCellContent={getCellContent}
                        setAncillaryRefundData={setAncillaryRefundData}
                        ancillaryRefundData={ancillaryRefundData}
                        isShow={false}
                      />
                    ) : textActiveTab === TextTabEnum?.refundApproved ? (
                      <RefundAncillaries
                        ancillaryData={
                          ancillaryData?.data[TextTabEnum?.refundApproved]
                        }
                        retriveData={singleBookingData?.data}
                        itineraryColumns={itineraryColumns}
                        itineraryRows={itineraryRows}
                        getCellContent={getCellContent}
                        setAncillaryRefundData={setAncillaryRefundData}
                        ancillaryRefundData={ancillaryRefundData}
                        isShow={false}
                      />
                    ) : textActiveTab === TextTabEnum?.approved ? (
                      <Box>
                        <AncillariesCard
                          ancilaryData={
                            ancillaryData?.data[TextTabEnum?.approved]
                          }
                          retriveData={singleBookingData?.data}
                          itineraryColumns={itineraryColumns}
                          itineraryRows={itineraryRows}
                          getCellContent={getCellContent}
                        />
                        <Box
                          sx={{
                            px: 1,
                            display: {
                              xs: "none",
                              lg: "block",
                            },
                          }}
                        >
                          <Stack
                            spacing={2}
                            sx={{
                              py: 2,
                              position: "sticky",
                              bottom: 0,
                              zIndex: 1,
                            }}
                          >
                            <Button
                              type="submit"
                              sx={{
                                ...actionBtn,
                                ...actionBtn.green,
                                width: "100%",
                                textAlign: "left",
                                py: 1.2,
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                              onClick={() => setIsRefund(true)}
                            >
                              <Typography
                                sx={{
                                  textAlign: "left",
                                  fontSize: "0.9rem",
                                  textTransform: "uppercase",
                                }}
                              >
                                Refund Ancillaries Request
                              </Typography>
                            </Button>
                          </Stack>
                        </Box>
                        {/* --- mobile button start --- */}
                        <Box
                          sx={{
                            display: {
                              xs: "block",
                              lg: "none",
                            },
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                          }}
                        >
                          <Button
                            sx={mobileButtonStyle}
                            onClick={() => setIsRefund(true)}
                          >
                            <Typography
                              sx={{
                                fontSize: "11px",
                                px: 9,
                              }}
                            >
                              Refund Ancillaries Request
                            </Typography>
                          </Button>
                        </Box>
                        {/* --- mobile button end --- */}
                      </Box>
                    ) : (
                      <Box sx={{ width: "100%" }}>
                        <AncillariesAdd
                          ancillaries={ancillaries}
                          passengers={passengers}
                          itineraryColumns={itineraryColumns}
                          itineraryRows={itineraryRows}
                          retriveData={retriveData}
                          handleRemoveAncillary={handleRemoveAncillary}
                          handleOpenAnci={handleOpenAnci}
                          pax={pax}
                          getCellContent={getCellContent}
                          status={status}
                          onSubmit={onSubmit}
                          type={type}
                          setType={setType}
                          isAncillaries={isAncillaries}
                        />
                        <Box
                          sx={{
                            px: 2,
                            display: {
                              xs: "none",
                              lg: "block",
                            },
                          }}
                        >
                          {isAncillaries && (
                            <Button
                              disabled={status === "pending"}
                              style={nextStepStyle}
                              onClick={onSubmit}
                              sx={{
                                my: 2,
                                "&:hover .icon": {
                                  transform: "translateX(10px)",
                                  transition: "transform 0.5s ease",
                                  opacity: 100,
                                },
                              }}
                            >
                              <Typography>
                                {status === "pending"
                                  ? "Please waiting..."
                                  : "SAVE THOSE ANCILLARIES"}
                              </Typography>
                            </Button>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* --- mobile button start --- */}
        {textActiveTab === TextTabEnum?.toBeConfirmed && (
          <Box
            sx={{
              display: {
                xs: "block",
                lg: "none",
              },
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
            }}
          >
            {type === "Fare Information" ? (
              <Button
                sx={mobileButtonStyle}
                onClick={() => setType("Booking Ancillaries")}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    px: 9,
                  }}
                >
                  PROCEED ANCILLARIES REQUEST
                </Typography>
              </Button>
            ) : (
              <>
                {proceedType === "approve" ? (
                  <>
                    {isPayment ? (
                      <Button
                        disabled={!isAccept || status === "pending"}
                        type="submit"
                        onClick={handleAncillariesApprove}
                        sx={mobileButtonStyle}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            px: 8,
                          }}
                        >
                          {approvedAncillaryStatus === "pending"
                            ? "Please Waiting..."
                            : "CLICK TO CONFIRM ANCILLARIES FOR THIS FLIGHT"}
                        </Typography>
                      </Button>
                    ) : (
                      <Button
                        disabled={!isAccept}
                        onClick={() => {
                          setIsPayment(true);
                          setType("Payment Information");
                        }}
                        sx={mobileButtonStyle}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            px: 8,
                          }}
                        >
                          Click to Proceed Ancillaries Payment
                        </Typography>
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    sx={mobileButtonStyle}
                    disabled={!isAccept || status === "pending"}
                    type="submit"
                    onClick={() =>
                      handleSubmit(
                        ancilaryRequestData?.id,
                        "canceled",
                        "Reject"
                      )
                    }
                  >
                    <Typography sx={{ fontSize: "0.75rem", px: 8 }}>
                      {status === "pending"
                        ? "Please waiting..."
                        : " Reject Ancillaries Quotation"}
                    </Typography>
                  </Button>
                )}
              </>
            )}
          </Box>
        )}
        {/* --- mobile button end --- */}
      </Box>
      <AncillariesModal
        openAnciIndex={openAnciIndex}
        setOpenAnciIndex={setOpenAnciIndex}
        pax={pax}
        route={route}
        clear={clear}
        setClear={setClear}
      />

      <CustomLoadingAlert
        open={isLoadingSpinner}
        text={"We Are Processing Your Request"}
      />

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </ThemeProvider>
  );
};

const tabs = [
  {
    label: "Booking Ancillaries",
    value: "Booking Ancillaries",
  },
  {
    label: "Fare Information",
    value: "Fare Information",
  },
];

export const AncillariesNotes = (data) => {
  return (
    (data?.status === "issue in process" || data?.status === "hold") && (
      <Box
        sx={{
          px: { xs: 0, lg: "15px" },
          ".MuiSvgIcon-root": {
            color: "var(--primary-color)",
          },
        }}
      >
        <Alert
          severity="info"
          sx={{
            border: "1px solid var(--primary-color)",
            bgcolor: "#fdeded",
            color: "var(--primary-color)",
            fontSize: "12px",
            padding: "0px 10px",
          }}
        >
          <span style={{ fontWeight: 600 }}>Note:</span> Once your ticketing
          process is completed, you will be provided with a detailed quotation
          for any additional services or ancillaries, such as extra baggage,
          seat selection, meals, or travel insurance, based on your preferences
          and travel requirements.
        </Alert>
      </Box>
    )
  );
};

export default Ancillaries;
