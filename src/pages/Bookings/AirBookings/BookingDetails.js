import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  Grid,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getTime } from "date-fns";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import FileUpload from "../../../component/AirBooking/FileUpload";
import PriceBreakdown, {
  ReissueDataCard,
  TicketStatus,
} from "../../../component/AirBooking/PriceBreakdown";
import {
  formatTripType,
  renderItem,
} from "../../../component/AirBooking/RecheckInformation";
import CustomAlert from "../../../component/Alert/CustomAlert";
import CustomToast from "../../../component/Alert/CustomToast";
import ImmediateTimeLimit from "../../../component/Alert/ImmediateTimeLimit";
import ServerError from "../../../component/Error/ServerError";
import TimeCountDown from "../../../component/FlightAfterSearch/components/TimeCountDown";
import FlightDetailsSection from "../../../component/FlightAfterSearch/FlightDetailsSection";
import QuotationShare from "../../../component/FlightAfterSearch/QuotationShare";
import NotFound from "../../../component/NotFound/NoFound";
import PaymentGateway from "../../../component/PaymentGateway/PaymentGateway";
import BookingDetailsSkeleton from "../../../component/SkeletonLoader/BookingDetailsSkeleton";
import FilterSkeleton from "../../../component/SkeletonLoader/FilterSkeleton";
import { TicketStatusSkeleton } from "../../../component/SkeletonLoader/TicketStatusSkeleton";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import { ReactComponent as AirplanIcon } from "../../../images/svg/airplane.svg";
import ApproveRejectDialog from "../../../shared/common/ApproveRejectDialog";
import PageTitle from "../../../shared/common/PageTitle";
import { sharedInputStyles } from "../../../shared/common/styles";
import useUnAuthorized from "../../../shared/common/useUnAuthorized";
import { headerStyle, nextStepStyle } from "../../../style/style";
import AncillariesPriceBreakdown from "../../Ancillaries/components/AncillariesPriceBreakdown";
import { OperationButton } from "../components/OperationButton";
import PdfCard from "../components/PdfCard";
import QueueHeader from "../components/QueueHeader";
import MobileBaggages from "./MobileBaggages";
import MobileFareSummary from "./MobileFareSummary";
import PartialPaid from "./PartialPaid";
import PNRhistory from "./PNRhistory";
import useWindowSize from "../../../shared/common/useWindowSize";
import FareRulesCharges from "../../../component/FlightAfterSearch/components/FareRulesCharges";
import ReissuePriceBreakdown from "../../../component/AirBooking/ReissuePriceBreakdown";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";
import ChurnAfterBookingModal from "./ChurnAfterBookingModal";

const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useWindowSize();
  const { jsonHeader } = useAuth();
  const { id, bookingId } = useParams();
  const queryClient = useQueryClient();
  const [openIndex, setOpenIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openAncillary, setOpenAncillary] = useState([]);
  const [type, setType] = useState("Booking Details");
  const [proceedType, setProceedType] = useState(null);
  const [filteredRelations, setFilteredRelations] = useState([]);
  const [isPayment, setIsPayment] = useState(false);
  const [partialChargeData, setPartialChargeData] = useState(null);
  const titleRef = useRef();
  const [bookingData, setBookingData] = useState("current booking");
  const [isReissueQuote, setIsReissueQuote] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [open, setOpen] = useState(false);
  const [openMarkup, setOpenMarkup] = useState(false);
  const [typeMarkup, setTypeMarkup] = useState("");
  const { agentData } = useOutletContext();
  const { checkUnAuthorized } = useUnAuthorized();
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const { flightCancel, flightIssue, flightRefund, flightReissue, flightVoid } =
    agentData?.userAccess || {};
  const [showChurnModal, setShowChurnModal] = useState(false);

  const { data: churnData, isError: isChurnErr } = useQuery({
    queryKey: ["user/booking/churn", bookingId],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/churn`,
        { bookingId },
        jsonHeader()
      );

      if (data?.success) {
        setShowChurnModal(true);
      }

      return data?.data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: markupData } = useQuery({
    queryKey: ["markupData", bookingId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/markup/${bookingId}`,
        jsonHeader()
      );

      return data?.data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: partialPay } = useMutation({
    mutationFn: ({ bookingId }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/partial-payment/due-date`,
        { bookingId },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success && data?.data?.data[0]?.dueDate) {
        const nowTime = new Date();
        const endTime = new Date(data?.data?.data[0]?.dueDate);

        if (nowTime < endTime) {
          setPartialChargeData(data?.data?.data[0]);
        } else {
        }
      }
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries(["bookingData"]);
    // },
    onError: (err) => {
      if (err.response) {
        const errorMessage = err.response.data.message || "An error occurred";
        // showToast("error", errorMessage);
        console.error(errorMessage);
      } else if (err.request) {
        // showToast("error", err.message);
        console.error(err.message);
      } else {
        // showToast("error", "An unexpected error occurred.");
        console.error("An unexpected error occurred.");
      }
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenAncillary = (index) => {
    if (openAncillary.some((value) => value === index)) {
      setOpenAncillary(openAncillary?.filter((value) => value !== index));
    } else {
      setOpenAncillary([...openAncillary, index]);
    }
  };

  const fetchAncillaryData = async (bookingId, status) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/${bookingId}/passenger-ancillaries?status=${status}`,
      jsonHeader()
    );
    return data;
  };

  const {
    data: singleBookingData,
    isLoading,
    isError,
    error,
    status,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["singleBookingData", bookingId, bookingData],
    queryFn: async () => {
      const url =
        bookingData === "current booking"
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/retrieve`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue-booking/get-reissue-booking`;
      const { data } = await axios.post(url, { bookingId }, jsonHeader());

      return { ...data };
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          checkUnAuthorized(error);
        } else if (error.response) {
          showToast(
            "error",
            error.response.data?.message || "An error occurred."
          );
        } else {
          showToast("error", "Network error. Please check your connection.");
        }
      } else {
        showToast("error", "An unexpected error occurred.");
      }
    },
    enabled: Boolean(bookingId),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const { data: tobeConfirmData, refetch: refetchToBeConfirmed } = useQuery({
    queryKey: ["tobeConfirmData", bookingId, "to be confirmed"],
    queryFn: () => fetchAncillaryData(bookingId, "to be confirmed"),

    enabled:
      Boolean(bookingId) && Boolean(singleBookingData?.data?.ancillaryRequest),
  });

  const { data: approveData, refetch: refetchApproved } = useQuery({
    queryKey: ["approveData", bookingId, "approved"],
    queryFn: () => fetchAncillaryData(bookingId, "approved"),

    enabled:
      Boolean(bookingId) && Boolean(singleBookingData?.data?.ancillaryRequest),
  });

  const isTobeConfirmedData = Boolean(
    tobeConfirmData?.data?.passengerAncillaries?.length > 0
  );

  const isApprovedData = Boolean(
    approveData?.data?.passengerAncillaries?.length > 0
  );

  const ancilaryRequestData = tobeConfirmData?.data?.requests?.find(
    (item) => item?.status === "to be confirmed"
  );

  useEffect(() => {
    if (singleBookingData?.data?.ancillaryRequest) {
      refetchToBeConfirmed();
      refetchApproved();
    }
  }, [
    singleBookingData?.data?.ancillaryRequest,
    refetchToBeConfirmed,
    refetchApproved,
  ]);

  const { mutate, status: cancelStatus } = useMutation({
    mutationFn: ({ bookingId }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/cancel`,
        { bookingId },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        CustomAlert({
          success: data?.data?.success,
          message: data?.data?.message,
        });
        navigate(`/dashboard/booking/airtickets/all`);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["singleBookingData"]);
    },
    onError: (err) => {
      CustomAlert({
        success: false,
        message: err?.response?.data?.message || "Failed to cancel booking.",
      });
    },
  });

  const { mutate: reissueMutate, status: reissueStatus } = useMutation({
    mutationFn: (data) =>
      axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue-booking/update-reissue-booking`,
        data,
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message);
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

  const data = singleBookingData?.data || {};
  const cityCount = data?.details?.cityCount
    ? data?.details?.cityCount?.flat()
    : [];
  const { tripType, commissionType } = data;

  const flattenedPassengers = [
    ...(data?.details?.passengerInformation?.adult || []),
    ...(data?.details?.passengerInformation?.child || []),
    ...(data?.details?.passengerInformation?.infant || []),
  ].flat();

  useEffect(() => {
    if (status === "success" && singleBookingData?.data?.bookingId) {
      if (singleBookingData?.data?.Tickets?.[0]?.createdAt) {
        const createdAt = moment(singleBookingData.data.Tickets[0].createdAt);
        const targetTime = createdAt
          .clone()
          .set({ hour: 23, minute: 59, second: 0 });

        const timerInterval = setInterval(() => {
          const now = moment();
          const duration = moment.duration(targetTime.diff(now));

          if (duration.asSeconds() <= 0) {
            clearInterval(timerInterval);
            setTimeLeft("Time expired");
          } else {
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const seconds = duration.seconds();
            setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
          }
        }, 1000);

        return () => clearInterval(timerInterval);
      }
    }
  }, [status]);

  useEffect(() => {
    if (status === "success" && data && data?.relation?.length) {
      const uniqueRelations = data.relation.reduce((acc, item) => {
        const existing = acc[item.passengerId];
        if (!existing || item.indexNumber > existing.indexNumber) {
          acc[item.passengerId] = item;
        }
        return acc;
      }, {});

      const relationsArray = Object.values(uniqueRelations);
      setFilteredRelations(relationsArray);
    } else {
      // setFilteredRelations([]); // TODO: Masud Rana infinite loop
    }
  }, [status, data]);

  useEffect(() => {
    if (singleBookingData?.data?.status === "hold") {
      if (singleBookingData?.data?.paymentStatus === "unpaid") {
        partialPay({ bookingId });
      }
    }
  }, [singleBookingData?.data?.status]);

  if (isLoading || isRefetching) {
    const skeletonBoxes = Array(5).fill(null);
    return (
      <>
        <Box
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },
          }}
        >
          <QueueHeader type={type} tabs={tabs} />
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

  if (isError) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          height: "calc(93vh - 150px)",
          borderRadius: "5px",
        }}
      >
        <ServerError message={error?.response?.data?.message} />
      </Box>
    );
  }

  if (!singleBookingData || singleBookingData?.data?.length === 0) {
    return (
      <Box sx={{ height: "calc(93vh - 150px)" }}>
        <NotFound />
      </Box>
    );
  }

  const renderTextField = (label, value) => (
    <Grid item md={3.8} sm={5.8} xs={12}>
      <Box
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.03)" },
            "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
          },
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          label={label}
          sx={{ ...sharedInputStyles }}
          value={value}
          InputProps={{
            readOnly: true,
          }}
          inputProps={{
            style: { textTransform: "uppercase", fontSize: "0.85rem" },
          }}
        />
      </Box>
    </Grid>
  );

  const handleChangeSwitch = () => {
    if (currentData?.title === "Cancel Booking") {
      handleCancelBooking(true, currentData?.title);
    } else {
      alert("DOES NOT MATCH");
    }
  };

  const handleCancelBooking = async (cancel, title) => {
    const titleInputValue = titleRef?.current?.value;

    if (titleInputValue !== title) {
      showToast(
        "error",
        "Confirmation Spelling or Case Sensetive Doesn't match"
      );
      return;
    }
    const bookingId = data?.id;
    mutate({ bookingId });
  };

  const handleReissueBooking = async (status) => {
    const result = await CustomAlert({
      success: "warning",
      message: `Are you sure? You want to ${status === "approved" ? "approve" : status} reissue quotation for this booking?`,
    });
    if (result?.isConfirmed) {
      reissueMutate({
        bookingId,
        status,
      });
    }
  };

  const handleSubmit = () => {
    handleReissueBooking("approved");
  };

  const getPrefixes = (passengerType) => {
    if (passengerType === "ADT") {
      return ["MR", "MS", "MRS"];
    } else {
      return ["MASTER", "MISS"];
    }
  };

  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
    } else {
      setType(newTab);
    }
  };

  if (data?.details === null) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          height: "calc(93vh - 150px)",
          borderRadius: "5px",
        }}
      >
        <NotFound />
      </Box>
    );
  }

  const now = getTime(new Date());
  const refundEndTime = getTime(data && data?.refunds?.[0]?.timeLimit);
  const issueEndTime = getTime(
    data?.fareTimeLimit == null
      ? data?.timeLimit
      : data?.timeLimit == null
        ? data?.fareTimeLimit
        : data?.fareTimeLimit > data?.timeLimit
          ? data?.timeLimit
          : data?.fareTimeLimit
  );

  const reissuePriceData = data?.details?.fareDifference?.totalFare || {};

  const agentFareDiff =
    reissuePriceData?.newAgentFare - reissuePriceData?.oldAgentFare || 0;
  const totalServiceFee = reissuePriceData.ffiServiceFee || 0;
  const totalAirlinesFee = reissuePriceData?.airlineServiceFee || 0;
  const totalPayable = agentFareDiff + totalAirlinesFee + totalServiceFee;

  // console.log(singleBookingData?.data);

  const hasRelation = singleBookingData?.data?.relation
    ? flattenedPassengers.filter((item) => {
        return singleBookingData?.data?.relation.some(
          (r) => r?.passengerId === item?.id && r?.status === "ticketed"
        );
      })
    : [];
  // const hasRelation = singleBookingData?.data?.relation
  //   ? flattenedPassengers.filter((item) => {
  //       return (
  //         singleBookingData?.data?.relation.some(
  //           (r) => r?.passengerId === item?.id && r?.status !== "reissued"
  //         ) === false
  //       );
  //     })
  //   : [];

  // console.log(hasRelation);
  // console.log(singleBookingData?.data?.relation);

  return (
    <Box sx={{ mb: { xs: 7.5, lg: 0 } }}>
      <QueueHeader
        type={type}
        handleTypeChange={handleTypeChange}
        tabs={tabs}
        retriveData={data}
      />
      {status === "success" && (
        <Grid
          container
          sx={{
            width: { xs: "90%", lg: "100%" },
            mx: { xs: "auto" },
            mt: { xs: 5, lg: 0 },
          }}
        >
          <Grid
            container
            item
            lg={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid
              item
              xs={12}
              lg={2.4}
              sx={{
                display: {
                  xs: type === "Booking Details" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <TicketStatus bookingData={bookingData} data={data} />
              {(data?.status?.toLowerCase() === "reissue to be confirmed" ||
                data?.status?.toLowerCase() === "reissue on process" ||
                data?.status?.toLowerCase() === "reissue request") && (
                <ReissueDataCard
                  singleBookingData={singleBookingData}
                  setBookingData={setBookingData}
                  bookingData={bookingData}
                />
              )}
              {data?.status?.toLowerCase() === "reissue to be confirmed" &&
                bookingData === "reissue booking" && (
                  <TimeCountDown
                    label={"Reissue to be Confirmed Time Limit"}
                    timeLimit={data?.timeLimit}
                  />
                )}
              {isTobeConfirmedData && (
                <Box>
                  <TimeCountDown
                    label={"Ancillaries Confirmation Time Limit"}
                    timeLimit={ancilaryRequestData?.timeLimit}
                  />
                </Box>
              )}
              <Box sx={{ mb: "5px" }}>
                {data?.status === "refund to be confirmed" && (
                  <TimeCountDown
                    label="Refund To Be Confirmed Time Limit"
                    timeLimit={moment(data?.refunds[0]?.timeLimit)}
                  />
                )}
              </Box>

              {((data?.paymentStatus?.toLowerCase() === "partially paid" &&
                data?.status?.toLowerCase() === "ticketed") ||
                (data?.paymentStatus?.toLowerCase() === "partially paid" &&
                  data?.status?.toLowerCase() === "issue in process")) && (
                <TimeCountDown
                  label="Partial Due Clear Time limit"
                  timeLimit={`${data?.partialPayment?.dueDate}`}
                />
              )}

              {data?.status?.toLowerCase() === "ticketed" && (
                <TimeCountDown
                  label="Void Request Expire Time Limit"
                  timeLimit={
                    data?.Tickets?.[0]?.createdAt &&
                    moment(data?.Tickets[0]?.createdAt)
                      .clone()
                      .set({ hour: 23, minute: 59, second: 0 })
                  }
                  data={data}
                />
              )}
              {data?.userTimeLimit
                ? data?.status?.toLowerCase() === "hold" && (
                    <TimeCountDown
                      label="Booking Expired at "
                      timeLimit={data?.userTimeLimit}
                      partialChargeData={partialChargeData}
                    />
                  )
                : data?.status?.toLowerCase() === "hold" && (
                    <ImmediateTimeLimit label="Immediate Issue" />
                  )}

              {/* --- mobile conditional button start --- */}
              {data?.status !== "issue in process" &&
                data?.status !== "cancel" && (
                  <OperationButton
                    data={data}
                    now={now}
                    timeLeft={timeLeft}
                    issueEndTime={issueEndTime}
                    refundEndTime={refundEndTime}
                    proceedType={proceedType}
                    setProceedType={setProceedType}
                  />
                )}

              {/* --- mobile conditional button end --- */}
              {isTobeConfirmedData && (
                <AncillariesPriceBreakdown
                  label="Total Ancillaries Payable"
                  ancillaryData={tobeConfirmData?.data?.passengerAncillaries}
                  passengers={tobeConfirmData?.data}
                />
              )}
              {isApprovedData && (
                <AncillariesPriceBreakdown
                  label="Total Ancillaries Paid"
                  ancillaryData={approveData?.data?.passengerAncillaries}
                  passengers={approveData?.data}
                />
              )}

              {(data?.status?.toLowerCase() !== "reissue to be confirmed" ||
                data?.status?.toLowerCase() !== "reissue request") &&
                bookingData === "current booking" && (
                  <PriceBreakdown
                    type={"after"}
                    flightData={data}
                    markupData={markupData}
                    openMarkup={openMarkup}
                    setOpenMarkup={setOpenMarkup}
                    typeMarkup={typeMarkup}
                    setTypeMarkup={setTypeMarkup}
                    setShowDownloadLink={setShowDownloadLink}
                    singleBooking={data || []}
                    passengers={flattenedPassengers}
                    agentData={agentData}
                    isReissueOnProcess={
                      data?.status?.toLowerCase() === "reissue on process" &&
                      bookingData === "reissue booking"
                    }
                    bookingData={bookingData}
                    refundData={
                      data?.status?.toLowerCase() === "refund" ||
                      data?.status?.toLowerCase() ===
                        "refund to be confirmed" ||
                      data?.status?.toLowerCase() === "refund on process" ||
                      data?.status?.toLowerCase() === "refunding"
                        ? data && data?.refunds?.length > 0
                          ? data?.refunds[0]
                          : null
                        : null
                    }
                    label={
                      (data?.paymentStatus?.toLowerCase() === "paid" &&
                        data?.status?.toLowerCase() === "ticketed") ||
                      (data?.status?.toLowerCase() === "issue in process" &&
                        data?.paymentStatus?.toLowerCase() === "paid")
                        ? "Total Paid"
                        : data?.status?.toLowerCase() === "void"
                          ? "Total Void Amount"
                          : data?.status?.toLowerCase() === "void request"
                            ? "Total Voidable Amount"
                            : data?.status?.toLowerCase() === "refund"
                              ? "Total Refund Amount"
                              : data?.status?.toLowerCase() ===
                                  "reissue on process"
                                ? "Total Reissue Paid"
                                : data?.status?.toLowerCase() ===
                                      "refund to be confirmed" ||
                                    data?.status?.toLowerCase() ===
                                      "refund on process" ||
                                    data?.status?.toLowerCase() === "refunding"
                                  ? "Total Refundable Amount"
                                  : data?.status?.toLowerCase() ===
                                      "refund on process"
                                    ? "Total Refunded Amount"
                                    : data?.status?.toLowerCase() ===
                                          "issue in process" &&
                                        data?.paymentStatus?.toLowerCase() ===
                                          "partially paid"
                                      ? "Total Payable Due Amount"
                                      : "Total Payable"
                    }
                  />
                )}

              {(data?.status?.toLowerCase() === "reissue to be confirmed" ||
                data?.status?.toLowerCase() === "reissue request" ||
                data?.status?.toLowerCase() === "reissue on process") &&
                bookingData === "reissue booking" && (
                  <ReissuePriceBreakdown
                    label={"Total Reissue Payable"}
                    status={data?.status}
                    flightData={data?.details}
                    priceData={data?.details?.priceBreakdown?.newPriceBreakdown}
                  />
                )}

              {data?.status?.toLowerCase() === "hold" &&
                partialChargeData &&
                data?.details?.autoOperation?.partialPayment && (
                  <PartialPaid
                    partialChargeData={partialChargeData}
                    flightData={data}
                  />
                )}

              {/* {bookingData === "current booking" && (
                <PdfCard
                  openMarkup={openMarkup}
                  setOpenMarkup={setOpenMarkup}
                  singleBooking={data || []}
                  flattenedPassengers={flattenedPassengers}
                  filteredRelations={filteredRelations}
                  markupData={markupData || []}
                  typeMarkup={typeMarkup}
                  setTypeMarkup={setTypeMarkup}
                  showDownloadLink={showDownloadLink}
                />
              )} */}

              <Box mt={"20px"}>
                <PNRhistory singleBookingData={singleBookingData || {}} />
              </Box>

              {singleBookingData?.data?.details?.structure &&
                singleBookingData?.data?.details?.structure.length > 0 && (
                  <Box mt={"20px"}>
                    <FareRulesCharges
                      structure={
                        singleBookingData?.data?.details?.structure || []
                      }
                      nonStructure={
                        singleBookingData?.data?.details?.nonStructure || []
                      }
                      bookingData={singleBookingData}
                    />
                  </Box>
                )}
            </Grid>

            <Grid
              item
              xs={12}
              lg={9.4}
              sx={{
                bgcolor: "white",
                pb: 2,
                borderRadius: 1,
                display: {
                  xs: type === "Flight Details" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <PageTitle
                title={isPayment ? "Payment Information" : "Booking Details"}
              />

              {!isPayment ? (
                <>
                  <Grid container item xs={12} lg={12} sx={{ p: "12px 15px" }}>
                    <Grid
                      item
                      xs={12}
                      lg={12}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "15px", lg: "17px" },
                          fontWeight: "600",
                          color: "#141E22",
                        }}
                      >
                        <span style={{ color: "var(--primary-color)" }}>
                          {(() => {
                            const routes = data?.details?.route || [];
                            const length = routes?.length;
                            if (length === 1) {
                              return (
                                <>
                                  {routes[0]?.departure}
                                  <AirplanIcon className="airplane-icon" />
                                  {routes[0]?.arrival}
                                </>
                              );
                            } else if (length === 2) {
                              return (
                                <>
                                  {routes[0]?.departure}
                                  <AirplanIcon className="airplane-icon" />
                                  {routes[1]?.departure}
                                  <AirplanIcon className="airplane-icon" />
                                  {routes[1]?.arrival}
                                </>
                              );
                            } else if (length > 2) {
                              return (
                                <>
                                  {routes[0]?.departure}
                                  <AirplanIcon className="airplane-icon" />
                                  {routes[0]?.arrival}
                                  {routes.slice(1).map((route, index) => (
                                    <span key={index}>
                                      <AirplanIcon className="airplane-icon" />
                                      {route.arrival}
                                    </span>
                                  ))}
                                </>
                              );
                            }
                            return null;
                          })()}
                        </span>{" "}
                        by {data?.carrierName}
                      </Typography>
                      <Tooltip title="Share Booking Information">
                        <Typography
                          sx={{
                            display: "flex",
                            fontSize: "12px",
                            alignItems: "center",
                            gap: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpen()}
                        >
                          <ReplyIcon
                            sx={{
                              color: "var(--primary-color)",
                              transform: "rotateY(180deg)",
                            }}
                          />
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        lg={12}
                        style={headerStyle}
                        sx={{ display: { xs: "none", lg: "block" } }}
                      >
                        <Typography
                          sx={{
                            color: "var(--white)",
                            fontSize: "rem",
                            py: "0.25rem",
                            fontWeight: 400,
                          }}
                        >
                          Booking Details
                        </Typography>
                      </Grid>
                      <Box
                        sx={{
                          width: "100%",
                          display: { xs: "none", lg: "block" },
                        }}
                      >
                        {renderItem("Flight Type", formatTripType(tripType))}

                        {renderItem(
                          "Cabin Class",
                          data?.class || (cityCount && cityCount[0]?.cabinCode)
                        )}
                        {renderItem(
                          "Booking Class",
                          cityCount && cityCount.length > 0
                            ? cityCount[0]?.bookingClass
                            : "N/A"
                        )}

                        {data?.details?.brands && data.details.brands[0]?.name
                          ? renderItem(
                              "Brand Type",
                              `${data.details.brands[0].name}, ${data.isRefundable}`
                            )
                          : renderItem("Brand Type", `${data.isRefundable}`)}

                        {renderItem("Payment Status", `${data?.paymentStatus}`)}
                        {renderItem(
                          "Last Updated At",
                          `${
                            data?.paymentStatus?.toLowerCase() === "unpaid"
                              ? `AT ${moment(data?.createdAt).format(
                                  "Do MMMM YYYY"
                                )}`
                              : data?.paymentStatus?.toLowerCase() === "paid"
                                ? `Last updated AT ${moment(
                                    data?.updatedAt
                                  ).format("Do MMMM YYYY")}`
                                : `AT ${moment(
                                    data?.partialPayment?.createdAt
                                  ).format("Do MMMM YYYY")}`
                          }`
                        )}
                      </Box>

                      <Grid
                        item
                        lg={12}
                        style={headerStyle}
                        sx={{ display: { xs: "none", lg: "block" } }}
                      >
                        <Typography
                          sx={{
                            color: "var(--white)",
                            fontSize: "1rem",
                            py: "0.25rem",
                            fontWeight: 400,
                          }}
                        >
                          Flight Itinerary Details
                        </Typography>
                      </Grid>
                      <Grid item lg={12}>
                        <Box sx={{ mt: { xs: 0, lg: "10px" } }}>
                          <FlightDetailsSection
                            flightData={[singleBookingData?.data]}
                            partialChargeData={partialChargeData}
                            bookType={"afterSearch"}
                            bookingData={bookingData}
                            tabType={"flight"}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} lg={12} style={headerStyle}>
                      <Typography
                        sx={{
                          color: "var(--white)",
                          fontSize: "1rem",
                          py: "0.25rem",
                          fontWeight: 400,
                        }}
                      >
                        Passenger Details
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      {flattenedPassengers.map((passenger, index) => {
                        const isRelationExists = filteredRelations.some(
                          (relation) => relation.passengerId === passenger.id
                        );

                        const showFileFields =
                          data?.journeyType?.toLowerCase() === "outbound" ||
                          (data?.journeyType?.toLowerCase() === "inbound" &&
                            passenger?.passportNation?.toLowerCase() !== "bd");

                        const showImage =
                          passenger?.visaImage || passenger?.passportImage;

                        return (
                          <Box
                            key={index}
                            sx={{
                              bgcolor: "#EFF7FF",
                              width: "100%",
                              borderRadius: "5px",
                              p: "8px 15px",
                              my: "10px",
                            }}
                          >
                            <Box
                              sx={{
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                              onClick={() =>
                                setOpenIndex(openIndex === index ? null : index)
                              }
                            >
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  color: "var(--secondary-color)",
                                  fontWeight: "500",
                                  textTransform: "uppercase",
                                }}
                              >
                                {passenger?.prefix}{" "}
                                {`${passenger?.firstName
                                  ?.charAt(0)
                                  .toUpperCase()}${passenger?.firstName?.slice(
                                  1
                                )} ${passenger?.lastName
                                  ?.charAt(0)
                                  .toUpperCase()}${passenger?.lastName?.slice(
                                  1
                                )} [${passenger?.type}]`}
                                {passenger.type === "CNN" && (
                                  <span
                                    style={{
                                      color: "var(--primary-color)",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {" "}
                                    [Age: {passenger.age}]
                                  </span>
                                )}
                                {filteredRelations.length > 0 ? (
                                  (() => {
                                    const relation = filteredRelations.find(
                                      (relation) =>
                                        relation.passengerId === passenger.id
                                    );

                                    if (relation) {
                                      return (
                                        <span
                                          style={{
                                            color: "var(--primary-color)",
                                            fontSize: "14px",
                                            cursor: "pointer",
                                            marginRight: "10px",
                                            marginLeft: "10px",
                                            textDecoration: "underline",
                                          }}
                                          onClick={() => {
                                            navigate(
                                              `/dashboard/booking/airtickets/all/${relation.bookingId}`
                                            );
                                            window.scrollTo(0, 0);
                                          }}
                                        >
                                          {relation.indexNumber >= 0
                                            ? `${relation?.status} At #${relation?.bookingAttribId}`
                                            : `Splited From #${relation?.bookingAttribId}`}
                                          {/* {relation.indexNumber >= 0
                                            ? `${relation?.status} At #${relation?.bookingAttribId}`
                                            : `${relation?.status} From #${relation?.bookingAttribId}`} */}
                                        </span>
                                      );
                                    }
                                  })()
                                ) : (
                                  <span
                                    style={{
                                      color: "var(--primary-color)",
                                      fontSize: "14px",
                                      cursor: "pointer",
                                      marginRight: "10px",
                                      marginLeft: "10px",
                                      textDecoration: "underline",
                                    }}
                                  >
                                    {data?.status}
                                  </span>
                                )}
                              </Typography>

                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {data?.Tickets[0]?.passengers?.some(
                                  (ticket) =>
                                    ticket?.passengerId === passenger?.id
                                ) ? (
                                  <Typography
                                    sx={{
                                      fontSize: "14px",
                                      color: "var(--secondary-color)",
                                      fontWeight: "500",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    E-Ticket -{" "}
                                    {
                                      data?.Tickets[0]?.passengers?.find(
                                        (ticket) =>
                                          ticket?.passengerId === passenger?.id
                                      )?.ticketNumber
                                    }
                                  </Typography>
                                ) : (
                                  ""
                                )}

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                  }}
                                  className="dropdown-class"
                                >
                                  <ArrowDropDownIcon />
                                </Box>
                              </Box>
                            </Box>

                            <Collapse
                              in={openIndex === index}
                              timeout="auto"
                              unmountOnExit
                              sx={{
                                width: "100%",
                                transition: "height 1s ease-in-out",
                                mb: "1rem",
                              }}
                            >
                              <Grid
                                container
                                spacing={2}
                                sx={{ mt: 2, pointerEvents: "none" }}
                              >
                                {getPrefixes(
                                  passenger.type === "ADT"
                                    ? "ADT"
                                    : passenger.type === "CNN"
                                      ? "CNN"
                                      : "INF"
                                )
                                  .filter(
                                    (prefix) =>
                                      (passenger.prefix === "MSTR" &&
                                        prefix === "MASTER") ||
                                      passenger.prefix === prefix
                                  )
                                  .map((prefix, i) => (
                                    <React.Fragment key={i}>
                                      {renderTextField("Prefix", prefix)}
                                    </React.Fragment>
                                  ))}

                                {renderTextField(
                                  "First Name",
                                  passenger?.firstName
                                    ? `${passenger.firstName
                                        .charAt(0)
                                        .toUpperCase()}${passenger.firstName.slice(
                                        1
                                      )}`
                                    : ""
                                )}
                                {renderTextField(
                                  "Last Name",
                                  passenger?.lastName
                                    ? `${passenger.lastName
                                        .charAt(0)
                                        .toUpperCase()}${passenger.lastName.slice(
                                        1
                                      )}`
                                    : ""
                                )}
                                {renderTextField("Gender", passenger?.gender)}
                                {renderTextField(
                                  "Date Of Birth",
                                  passenger?.dateOfBirth
                                    ? moment(passenger.dateOfBirth).format(
                                        "DD MMMM, YYYY"
                                      )
                                    : ""
                                )}
                                {renderTextField(
                                  "Passport Nation",
                                  passenger?.passportNation
                                )}

                                {showFileFields &&
                                  renderTextField(
                                    "Passport No.",
                                    passenger?.passportNumber
                                  )}
                                {showFileFields &&
                                  renderTextField(
                                    "Passport Expiry Date",
                                    passenger?.passportExpire
                                      ? moment(passenger.passportExpire).format(
                                          "DD MMMM, YYYY"
                                        )
                                      : ""
                                  )}
                              </Grid>
                              {/* Documents upload portion */}
                              {showFileFields && showImage && (
                                <Grid container spacing={2} sx={{ mt: 0 }}>
                                  {passenger?.passportImage && (
                                    <Grid item md={3.8} sm={5.8} xs={12}>
                                      <FileUpload
                                        id={`passportImage-${index}`}
                                        previewImg={passenger?.passportImage}
                                        label={"Passport Copy"}
                                        isDisable={true}
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        acceptLabel="JPG JPEG PNG & PDF"
                                      />
                                    </Grid>
                                  )}
                                  {passenger?.visaImage && (
                                    <Grid item md={3.8} sm={5.8} xs={12}>
                                      <FileUpload
                                        id={`visaImage-${index}`}
                                        previewImg={passenger?.visaImage}
                                        label={"Visa Copy"}
                                        isDisable={true}
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        acceptLabel="JPG JPEG PNG & PDF"
                                      />
                                    </Grid>
                                  )}
                                </Grid>
                              )}

                              {passenger.ancillaries &&
                                passenger.ancillaries.length > 0 &&
                                passenger.ancillaries.map(
                                  (ancillary, typeIndex) => (
                                    <Box
                                      key={typeIndex}
                                      sx={{ pt: "5px", mt: 2 }}
                                    >
                                      <Box
                                        onClick={() =>
                                          handleOpenAncillary(typeIndex)
                                        }
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          border:
                                            "1px solid var(--border-color)",
                                          p: "5px 15px",
                                          borderRadius: "5px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "var(--secondary-color)",
                                            fontWeight: "500",
                                          }}
                                        >
                                          {ancillary.type === "wheelChair" &&
                                            "Wheel Chair - "}
                                          {ancillary.type === "meals" &&
                                            "Meal - "}
                                          {ancillary.type === "vipMessage" &&
                                            "VIP Message - "}
                                          <span
                                            style={{
                                              color: "var(--primary-color)",
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {ancillary?.description}
                                          </span>
                                        </Typography>
                                        {/* <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "100%",
                                          }}
                                          className="dropdown-class"
                                        >
                                          <ArrowDropDownIcon />
                                        </Box> */}
                                      </Box>

                                      <Collapse
                                        in={openAncillary.includes(typeIndex)}
                                        timeout="auto"
                                        unmountOnExit
                                        sx={{
                                          width: "100%",
                                          transition: "height 1s ease-in-out",
                                          mb: "1rem",
                                        }}
                                      >
                                        {ancillary?.remarks && (
                                          <textarea
                                            id="remarks"
                                            name="remarks"
                                            rows="4"
                                            cols="130"
                                            className="text-area"
                                            value={ancillary?.remarks}
                                            readOnly
                                            style={{
                                              outline: "none",
                                              cursor: "auto",
                                            }}
                                          />
                                        )}
                                      </Collapse>
                                    </Box>
                                  )
                                )}
                            </Collapse>
                          </Box>
                        );
                      })}
                      {/* {(data?.status === "hold" ||
                        data?.status === "issue in process" ||
                        data?.status === "ticketed") && (
                        <Button
                          style={{
                            backgroundColor: "var(--secondary-color)",
                            color: "white",
                            width: "100%",
                            textTransform: "capitalize",
                            marginTop: "30px",
                            justifyContent: "start",
                            paddingLeft: "26px",
                          }}
                          onClick={() =>
                            navigate(
                              `/dashboard/booking/ancillaries/${data?.id}`,
                              {
                                state: {
                                  retriveData: data,
                                  passengers: flattenedPassengers,
                                  bookingId,
                                },
                              }
                            )
                          }
                        >
                          Ancillaries Request
                        </Button>
                      )} */}

                      {(singleBookingData?.data?.status ===
                        "issue in process" ||
                        (singleBookingData?.data?.status === "hold" &&
                          now < issueEndTime)) && (
                        <Box
                          sx={{
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
                            <span style={{ fontWeight: "600" }}>Note: </span>{" "}
                            You may request ancillary services at any time
                            during your booking process. However, once your
                            ticket is confirmed, we will provide a quotation for
                            the requested ancillaries such as additional
                            baggage, seat selection, or meals based on charge,
                            availability and airline policies.
                          </Alert>
                        </Box>
                      )}

                      {singleBookingData?.data?.ancillaryRequest && (
                        <Button
                          style={{
                            backgroundColor: singleBookingData?.data
                              ?.ancillaryRequest
                              ? "var(--green)"
                              : "var(--secondary-color)",
                            color: "white",
                            width: "100%",
                            textTransform: "capitalize",
                            marginTop: "30px",
                            justifyContent: "start",
                            paddingLeft: "26px",
                          }}
                          onClick={() =>
                            navigate(
                              `/dashboard/booking/ancillaries/${data?.id}`,
                              {
                                state: {
                                  retriveData: data,
                                  passengers: flattenedPassengers,
                                  bookingId,
                                },
                              }
                            )
                          }
                        >
                          VIEW ANCILLARIES
                        </Button>
                      )}

                      {(singleBookingData?.data?.status ===
                        "issue in process" ||
                        (singleBookingData?.data?.status === "hold" &&
                          now < issueEndTime) ||
                        singleBookingData?.data?.status === "ticketed" ||
                        singleBookingData?.data?.status === "reissued") &&
                        !singleBookingData?.data?.ancillaryRequest && (
                          <Button
                            style={{
                              backgroundColor: singleBookingData?.data
                                ?.ancillaryRequest
                                ? "var(--green)"
                                : "#f56c42",
                              color: "white",
                              width: "100%",
                              textTransform: "capitalize",
                              marginTop: "30px",
                              justifyContent: "start",
                              paddingLeft: "26px",
                            }}
                            onClick={() =>
                              navigate(
                                `/dashboard/booking/ancillaries/${data?.id}`,
                                {
                                  state: {
                                    retriveData: data,
                                    passengers: flattenedPassengers,
                                    bookingId,
                                  },
                                }
                              )
                            }
                          >
                            ANCILLARIES REQUEST
                          </Button>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                      {data?.status !== "issue in process" ? (
                        <Box></Box>
                      ) : (
                        <Box
                          sx={{
                            display: { xs: "none", lg: "block" },
                            bottom: 5,
                            mt: 2,
                            width: "100%",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              textTransform: "uppercase",
                              px: 2.8,
                              bgcolor: "green",
                              ":hover": {
                                bgcolor: "green",
                              },
                              color: "#FFFFFF",
                              width: "100%",
                              borderRadius: "5px",
                              py: {
                                xs: 1.5,
                              },
                            }}
                          >
                            Payment is complete, Please wait for ticketed!
                          </Typography>
                        </Box>
                      )}

                      {data?.status === "refund request" && (
                        <Box
                          sx={{
                            display: { xs: "none", lg: "block" },
                            bottom: 5,
                            mt: 2,
                            width: "100%",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              textTransform: "uppercase",
                              px: 2.8,
                              bgcolor: "green",
                              ":hover": {
                                bgcolor: "green",
                              },
                              color: "#FFFFFF",
                              width: "100%",
                              borderRadius: "5px",
                              py: {
                                xs: 1.5,
                              },
                            }}
                          >
                            Please wait for Refund Quotation
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>

                  {data?.status !== "void" &&
                    data?.status !== "reissue" &&
                    data?.status !== "refund" && (
                      <>
                        {data?.status === "hold" && (
                          <>
                            {now < issueEndTime &&
                              flightIssue?.access &&
                              flightIssue?.operations && (
                                <Grid
                                  item
                                  sx={{
                                    // mt: "10px",
                                    width: "100%",
                                    px: 2,
                                    display: {
                                      xs: "none",
                                      lg: "block",
                                    },
                                  }}
                                >
                                  <Button
                                    style={nextStepStyle}
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/booking/airtickets/${id}/${bookingId}/issue`,
                                        {
                                          state: {
                                            retriveData: data,
                                            passengers: flattenedPassengers,
                                            cities: cityCount,
                                            bookingId,
                                            flightIssue,
                                            partialChargeData,
                                          },
                                        }
                                      )
                                    }
                                    sx={{
                                      "&:hover .icon": {
                                        transform: "translateX(10px)",
                                        transition: "transform 0.5s ease",
                                        opacity: 100,
                                      },
                                    }}
                                  >
                                    <Typography>
                                      ISSUE AND CONFIRM YOUR BOOKING
                                    </Typography>
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

                            {flightCancel?.access && (
                              <Grid
                                item
                                sx={{
                                  mt: "15px",
                                  px: 2,
                                  display: {
                                    xs: "none",
                                    lg: "block",
                                  },
                                }}
                              >
                                <Button
                                  style={{
                                    ...nextStepStyle,
                                    backgroundColor: "#333333",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/booking/airtickets/${id}/${bookingId}/cancel`,
                                      {
                                        state: {
                                          retriveData: data,
                                          passengers: flattenedPassengers,
                                          cities: cityCount,
                                          flightCancel: flightCancel,
                                        },
                                      }
                                    )
                                  }
                                  sx={{
                                    "&:hover .icon": {
                                      transform: "translateX(10px)",
                                      transition: "transform 0.5s ease",
                                      opacity: 100,
                                    },
                                  }}
                                >
                                  <Typography>CANCEL YOUR BOOKING</Typography>

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
                        )}

                        {(data?.status === "issue in process" ||
                          data?.status === "ticketed") &&
                          data?.paymentStatus === "partially paid" && (
                            <Grid
                              item
                              sx={{
                                mt: "15px",
                                width: "100%",
                                px: 2,
                                display: {
                                  xs: "none",
                                  lg: "block",
                                },
                              }}
                            >
                              <Button
                                style={nextStepStyle}
                                onClick={() =>
                                  navigate(
                                    `/dashboard/booking/airtickets/${id}/${bookingId}/issue`,
                                    {
                                      state: {
                                        retriveData: data,
                                        passengers: flattenedPassengers,
                                        cities: cityCount,
                                        paydue: true,
                                        bookingId,
                                      },
                                    }
                                  )
                                }
                                sx={{
                                  "&:hover .icon": {
                                    transform: "translateX(10px)",
                                    transition: "transform 0.5s ease",
                                    opacity: 100,
                                  },
                                }}
                              >
                                <Typography>
                                  PAY DUE AMOUNT TO CONFIRM THIS TICKET
                                </Typography>
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

                        {data?.status === "ticketed" && (
                          <>
                            {data?.isRefundable?.toLowerCase() !==
                              "nonrefundable" &&
                              flightRefund?.access &&
                              flightRefund?.operations?.submitRefundRequest &&
                              data?.paymentStatus === "paid" && (
                                // hasRelation.length > 0 &&
                                <Grid
                                  item
                                  sx={{
                                    mt: "15px",
                                    px: 2,
                                    display: {
                                      xs: "none",
                                      lg: "block",
                                    },
                                  }}
                                >
                                  <Button
                                    style={{
                                      ...nextStepStyle,
                                      backgroundColor: "#b300ca",
                                    }}
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/booking/airtickets/${id}/${bookingId}/refund`,
                                        {
                                          state: {
                                            retriveData: data,
                                            passengers: flattenedPassengers,
                                            cities: cityCount,
                                            flightRefund,
                                          },
                                        }
                                      )
                                    }
                                    sx={{
                                      "&:hover .icon": {
                                        transform: "translateX(10px)",
                                        transition: "transform 0.5s ease",
                                        opacity: 100,
                                      },
                                    }}
                                  >
                                    <Typography>
                                      Select Passenger To Perform Refund Request
                                    </Typography>
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

                            {timeLeft?.toLowerCase() !== "time expired" &&
                              flightVoid?.access &&
                              flightVoid?.operations?.submitVoidRequest && (
                                // hasRelation.length > 0 &&
                                <Grid
                                  item
                                  sx={{
                                    mt: "15px",
                                    px: 2,
                                    display: { xs: "none", lg: "block" },
                                  }}
                                >
                                  <Button
                                    style={{
                                      ...nextStepStyle,
                                      backgroundColor: "#b300ca",
                                    }}
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/booking/airtickets/${id}/${bookingId}/void`,
                                        {
                                          state: {
                                            retriveData: data,
                                            passengers: flattenedPassengers,
                                            cities: cityCount,
                                            flightVoid,
                                          },
                                        }
                                      )
                                    }
                                    sx={{
                                      "&:hover .icon": {
                                        transform: "translateX(10px)",
                                        transition: "transform 0.5s ease",
                                        opacity: 100,
                                      },
                                    }}
                                  >
                                    <Typography>
                                      Select Passenger To Perform Void Request
                                    </Typography>
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

                            {data?.paymentStatus?.toLowerCase() !==
                              "partially paid" &&
                              flightReissue?.access &&
                              flightReissue?.operations
                                ?.submitReissueRequest && (
                                // hasRelation.length > 0 &&
                                <Grid
                                  sx={{
                                    mt: "15px",
                                    px: 2,
                                    display: {
                                      xs: "none",
                                      lg: "block",
                                    },
                                  }}
                                >
                                  <Button
                                    style={{
                                      ...nextStepStyle,
                                      backgroundColor: "#b300ca",
                                    }}
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/booking/airtickets/${id}/${bookingId}/reissue`,
                                        {
                                          state: {
                                            retriveData: data,
                                            passengers: flattenedPassengers,
                                            cities: cityCount,
                                            flightReissue,
                                          },
                                        }
                                      )
                                    }
                                    sx={{
                                      "&:hover .icon": {
                                        transform: "translateX(10px)",
                                        transition: "transform 0.5s ease",
                                        opacity: 100,
                                      },
                                    }}
                                  >
                                    <Typography>
                                      Select Passenger To Perform Reissue
                                      Request
                                    </Typography>
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
                        )}

                        {data?.status === "reissue request" && (
                          <Box
                            sx={{
                              // position: "fixed",
                              // bottom: 5,
                              // width: "100%",
                              px: 2.5,
                            }}
                          >
                            <Typography
                              sx={{
                                textTransform: "uppercase",
                                fontSize: "11px",
                                px: 2,
                                bgcolor: "green",
                                ":hover": {
                                  bgcolor: "green",
                                },
                                color: "#FFFFFF",
                                borderRadius: "5px",
                                py: { xs: 1.5 },
                              }}
                            >
                              Please wait for Reissue Quotation
                            </Typography>
                          </Box>
                        )}

                        {(data?.status?.toLowerCase() ===
                          "reissue to be confirmed" ||
                          data?.status?.toLowerCase() === "reissued" ||
                          data?.status?.toLowerCase() ===
                            "reissue on process") && (
                          <Grid sx={{ mt: "15px", px: 2 }}>
                            <Button
                              onClick={async () => {
                                setIsReissueQuote(true);
                                setBookingData("reissue booking");
                                const data = await refetch();

                                const updatedData = {
                                  ...data?.data?.data,
                                  details: {
                                    ...data?.data?.data?.details,
                                    priceBreakdown:
                                      data?.data?.data?.details?.priceBreakdown
                                        ?.newPriceBreakdown,
                                    // ...(bookingData !== "current booking"
                                    //   ? {}
                                    //   : {
                                    //       oldPriceBreakdown:
                                    //         data?.data?.data?.details
                                    //           ?.priceBreakdown
                                    //           ?.oldPriceBreakdown,
                                    //     }),
                                    oldPriceBreakdown:
                                      data?.data?.data?.details?.priceBreakdown
                                        ?.oldPriceBreakdown || [],
                                  },
                                };

                                // return;
                                if (data?.isSuccess) {
                                  navigate(
                                    `/dashboard/booking/airtickets/${id}/${bookingId}/reissuequotation`,
                                    {
                                      state: {
                                        retriveData: updatedData,
                                        passengers: flattenedPassengers,
                                        crrBookingData: singleBookingData?.data,
                                      },
                                    }
                                  );
                                }
                              }}
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
                              <Typography>View Reissue Quotation</Typography>
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

                        {/* {data?.status?.toLowerCase() ===
                          "reissue to be confirmed" && (
                          <Grid
                            sx={{
                              mt: "15px",
                              px: 2,
                              display: {
                                xs: "none",
                                lg: "block",
                              },
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
                              style={nextStepStyle}
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
                        )} */}
                      </>
                    )}

                  {(data?.status === "refund to be confirmed" ||
                    now < refundEndTime ||
                    data?.status === "refund on process" ||
                    data?.status === "refunding" ||
                    data?.status === "refund") && (
                    <Grid
                      item
                      sx={{
                        mt: "15px",
                        width: "100%",
                        px: 2,
                        // display: { xs: "none", lg: "block" },
                      }}
                    >
                      <Button
                        style={nextStepStyle}
                        onClick={() =>
                          navigate(
                            `/dashboard/booking/airtickets/${id}/${bookingId}/refundquotation`,
                            {
                              state: {
                                retriveData: data,
                                passengers: flattenedPassengers,
                                cities: cityCount,
                                paydue: true,
                              },
                            }
                          )
                        }
                        sx={{
                          "&:hover .icon": {
                            transform: "translateX(10px)",
                            transition: "transform 0.5s ease",
                            opacity: 100,
                          },
                        }}
                      >
                        <Typography>
                          VIEW REFUND{" "}
                          {data?.status === "refund" ? "details" : "Quotation"}
                        </Typography>
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

                  {(data?.status?.toLowerCase() === "void request" ||
                    data?.status?.toLowerCase() === "void") && (
                    <Grid sx={{ mt: "15px", px: 2 }}>
                      <Button
                        onClick={() => {
                          navigate(
                            `/dashboard/booking/airtickets/${id}/${bookingId}/void-details`,
                            {
                              state: {
                                retriveData: data,
                                passengers: flattenedPassengers,
                              },
                            }
                          );
                        }}
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
                        <Typography>View Void Details</Typography>
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
                  paymentPrice={totalPayable}
                  isLoading={reissueStatus === "pending" ? true : false}
                />
              )}
            </Grid>
            {/* --- mobile section here start --- */}
            <Grid
              item
              xs={12}
              sx={{
                display: {
                  xs: type === "Fare Details" ? "block" : "none",
                  lg: "none",
                },
              }}
            >
              {bookingData === "current booking" && (
                <MobileFareSummary
                  flightData={data}
                  priceBreakdown={data?.details?.priceBreakdown}
                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: {
                  xs: type === "Baggage Details" ? "block" : "none",
                  lg: "none",
                },
              }}
            >
              <MobileBaggages
                route={data?.details?.route}
                baggage={data?.details?.baggage?.[0] || []}
              />
            </Grid>
            {/* --- mobile section here end --- */}
          </Grid>
        </Grid>
      )}
      <ApproveRejectDialog
        currentData={currentData}
        titleRef={titleRef}
        isDisabled={cancelStatus === "pending"}
        handleChangeSwitch={handleChangeSwitch}
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
      {/* --- mobile button start --- */}
      {data?.status !== "issue in process" ? (
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
          {data?.status !== "cancel" && (
            <Button
              disabled={proceedType}
              sx={{
                bgcolor: "var(--primary-color)",
                ":hover": {
                  bgcolor: "var(--primary-color)",
                },
                color: "#FFFFFF",
                width: "100%",
                borderRadius: "15px 15px 0px 0px",
                py: {
                  xs: 2,
                },
              }}
              onClick={() =>
                navigate(
                  `/dashboard/booking/airtickets/${id}/${bookingId}/${proceedType}`,
                  {
                    state: {
                      retriveData: data,
                      passengers: flattenedPassengers,
                      cities: cityCount,
                      bookingId,
                    },
                  }
                )
              }
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  px: 9,
                }}
              >
                Select Your Confirmed Passenger To Proceed {proceedType} Request
              </Typography>
            </Button>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },
            position: "fixed",
            bottom: 5,
            width: "100%",
            px: 2.5,
          }}
        >
          <Typography
            sx={{
              textTransform: "uppercase",
              textAlign: "center",
              fontSize: "11px",
              px: 2,
              bgcolor: "green",
              ":hover": {
                bgcolor: "green",
              },
              color: "#FFFFFF",
              width: "100%",
              borderRadius: "5px",
              py: {
                xs: 1.5,
              },
            }}
          >
            Payment is complete, Please wait for ticketed!
          </Typography>
        </Box>
      )}
      {/* --- mobile button end --- */}
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
      <CustomLoadingAlert
        open={isReissueQuote}
        text={"We Are Processing Your Request"}
      />
      {/* <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <QuotationShare
            flightData={data?.details}
            bookingData={data}
            type={"booking"}
          />
        </Box>
      </Modal> */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={isMobile ? "sm" : "md"} // or "sm", "lg", "xl" depending on your layout
      >
        <QuotationShare
          flightData={data?.details}
          bookingData={data}
          type="booking"
        />
      </Dialog>

      {churnData?.message && (
        <ChurnAfterBookingModal
          open={showChurnModal && isChurnErr === false}
          onClose={() => setShowChurnModal(false)}
          churnData={churnData}
        />
      )}
    </Box>
  );
};

const tabs = [
  {
    label: "Booking Details",
    value: "Booking Details",
  },
  {
    label: "Flight Details",
    value: "Flight Details",
  },
  {
    label: "Fare Details",
    value: "Fare Details",
  },
  {
    label: "Baggage Details",
    value: "Baggage Details",
  },
];

export default BookingDetails;
