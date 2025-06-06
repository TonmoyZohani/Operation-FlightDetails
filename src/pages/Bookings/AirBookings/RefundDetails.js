import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  ThemeProvider,
  Checkbox,
  Button,
  Modal,
  FormGroup,
  Alert,
  Tooltip,
  Stack,
  Drawer,
} from "@mui/material";
import { TicketStatus } from "../../../component/AirBooking/PriceBreakdown";
import PageTitle from "../../../shared/common/PageTitle";
import { BpCheckedIcon, BpIcon } from "../../../shared/common/styles";
import { theme } from "../../../utils/theme";
import FormControlLabel from "@mui/material/FormControlLabel";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import moment from "moment";
import { modalStyle } from "./IssueDetails";
import { useAuth } from "../../../context/AuthProvider";
import axios from "axios";
import CustomAlert from "../../../component/Alert/CustomAlert";
import TimeCountDown from "../../../component/FlightAfterSearch/components/TimeCountDown";
import { mobileButtonStyle, nextStepStyle } from "../../../style/style";
import RefundPriceBreakdown from "../../../component/AirBooking/RefundPriceBreakdown";
import PendingLoader from "../../../component/Loader/PendingLoader";
import useToast from "../../../hook/useToast";
import CustomToast from "../../../component/Alert/CustomToast";
import RefundFareInfo from "../components/RefundFareInfo";
import { TicketStatusSkeleton } from "../../../component/SkeletonLoader/TicketStatusSkeleton";
import FilterSkeleton from "../../../component/SkeletonLoader/FilterSkeleton";
import BookingDetailsSkeleton from "../../../component/SkeletonLoader/BookingDetailsSkeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BookingHeader from "../components/BookingHeader";
import MobilePassengerInfo from "../components/MobilePassengerInfo";
import MobileItineraryCard from "../components/MobileItineraryCard";
import QueueHeader from "../components/QueueHeader";
import RequiredIndicator from "../../../component/Common/RequiredIndicator";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";
import FareRulesCharges from "../../../component/FlightAfterSearch/components/FareRulesCharges";
import MakeBookingQuotation from "./MakeBookingQuotation";
import BookingOtp from "../../../component/AirBooking/BookingOtp";

const RefundDetails = () => {
  const { state } = useLocation();
  const { jsonHeader } = useAuth();
  const { retriveData, passengers, flightRefund } = state;
  const [selectedPassengers, setSelectedPassengers] = useState([0]);
  const [priceBreakdown, setPriceBreakdown] = useState([]);
  const [selectImage] = useState(null);
  const [allSelected, setAllSelected] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Booking Refund Request");
  const [selectedRows, setSelectedRows] = useState([]);
  const [airlineCharge, setAirlineCharge] = useState(0);
  const [isAccept, setIsAccept] = useState(false);
  const [query] = useState({
    commissionType: retriveData?.commissionType,
    tripType: retriveData?.tripType,
    journeyType: retriveData?.journeyType,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { agentData } = useOutletContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [otpKey, setOtpKey] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [operationType, setOperationType] = useState("");
  const isSendingOtp = agentData?.otpSwitch?.airTicket?.refundRequest;
  const originalPriceBreakdown = retriveData?.details?.priceBreakdown;

  const handleClose = () => setOpen(false);

  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
    } else {
      setType(newTab);
    }
  };

  const { data: refundServiceData, isLoading: isRefundLoading } = useQuery({
    queryKey: ["refundServiceData", query],
    queryFn: async () => {
      const queryParams = new URLSearchParams(query).toString();
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/common/service-charges/refund?${queryParams}`;
      const { data } = await axios.get(url, jsonHeader());

      return data;
    },
  });

  const { data: autoRefundEnable } = useQuery({
    queryKey: ["user/booking/switch-data", retriveData?.id],
    queryFn: async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/switch-data?bookingId=${retriveData?.id}&serviceName=autoRefund`;
      const { data } = await axios.get(url, jsonHeader());

      return data;
    },
  });

  const {
    mutate: fetchAutoRefund,
    data: autoRefundData,
    status,
  } = useMutation({
    mutationFn: async ({ bookingId, taxRefund }) => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/auto/refund`;
      const { data } = await axios.post(
        url,
        { bookingId, taxRefund },
        jsonHeader()
      );
      return data;
    },
  });

  useEffect(() => {
    if (retriveData?.id && autoRefundEnable && autoRefundEnable?.data) {
      fetchAutoRefund({ bookingId: retriveData.id, taxRefund: false });
    }
  }, [retriveData?.id, autoRefundEnable]);

  useEffect(() => {
    if (!allSelected) {
      handleSelectAll();
    }
  }, []);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedPassengers([]);
      setPriceBreakdown([]);
      setAllSelected(false);
    } else {
      const allIndexes = originalPriceBreakdown.map((_, index) => index);
      setSelectedPassengers(allIndexes);
      setAllSelected(true);

      const allPriceBreakdowns = originalPriceBreakdown.map(
        (passenger, index) => {
          const id =
            retriveData?.Ticket?.length > 0
              ? retriveData?.Tickets?.at(0)?.passengers?.find(
                  (item) => item?.ticketNumber === passenger?.ticketNumber
                )?.passengerId
              : "";

          return { ...passenger, index, id };
        }
      );

      setPriceBreakdown(allPriceBreakdowns);
    }
  };

  const passengerColumns = [
    "Select",
    "Name",
    "Pax Type",
    "DOB",
    "Nationality",
    "Base Fare",
    "Tax",
    "Payment Status",
  ];

  const itineraryColumns = [
    "Select",
    "Airlines",
    "Destination",
    "Stops",
    "Flight No",
    "Flight Date",
    "Flight Status",
  ];

  useEffect(() => {
    const unflownIndices = retriveData?.details?.route.reduce(
      (acc, _, index) => {
        const stops = retriveData?.details?.cityCount[index];
        if (!stops[0]?.isFlown) {
          acc.push(index);
        }
        return acc;
      },
      []
    );

    handleRowSelectAll(unflownIndices);
  }, [retriveData]);

  const handleRowSelectAll = (indices) => {
    setSelectedRows(indices);
  };

  const itineraryRows =
    retriveData?.details?.route.map((route, index, arr) => {
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
        <Tooltip
          key={index}
          title={stops[0]?.isFlown && "Flown Segment Can't be Refunded."}
        >
          <FormControlLabel
            key={`checkbox-${index}`}
            sx={{ pl: 1.5 }}
            control={
              <Checkbox
                disabled={stops[0]?.isFlown}
                disableRipple
                checked={index === 0 ? true : selectedRows.includes(index)}
                onChange={() => {
                  if (index !== 0) {
                    handleRowSelect(index);
                  }
                }}
                checkedIcon={
                  <BpCheckedIcon
                    color={"white"}
                    bgColor={arr.length > 1 ? "var(--primary-color)" : "#ccc"}
                    boxShadowColor={
                      arr.length > 1 ? "var(--primary-color)" : "#ccc"
                    }
                  />
                }
                icon={<BpIcon color={"white"} />}
              />
            }
          />
        </Tooltip>,
        stops[0].marketingCarrierName,
        `${route.departure} - ${route.arrival}`,
        stopDescription,
        `${stops[0].marketingCarrier} ${stops[0].marketingFlight}`,
        moment(stops[0]?.departureDate).format("DD MMM, YYYY"),
        <span style={{ color: stops[0].isFlown ? "red" : "green" }}>
          {stops[0].isFlown ? "Flown" : "Unflown"}
        </span>,
        <Typography sx={{ textTransform: "uppercase", fontSize: "11px" }}>
          {stops[0]?.isFlown ? "Flown" : "Unflown"}
        </Typography>,
      ];
    }) || [];

  const getPassengerRows = (
    priceBreakdown,
    retriveData,
    selectedPassengers,
    handleCheckboxChange
  ) => {
    return priceBreakdown.map((passenger, index) => {
      const crrPax = passengers.at(index);
      return [
        <FormControlLabel
          key={index}
          sx={{ pl: 1.5 }}
          control={
            <Checkbox
              disableRipple
              disabled={
                !flightRefund?.operations?.splitRefund ||
                (priceBreakdown?.length === 1 &&
                  priceBreakdown?.some((item) => item.index === index))
              }
              checked={selectedPassengers.includes(index)}
              onChange={() =>
                handleCheckboxChange(index, {
                  ...passenger,
                  baseFare: passenger?.baseFare,
                  tax: passenger?.tax,
                })
              }
              checkedIcon={
                <BpCheckedIcon
                  color={"white"}
                  bgColor={
                    originalPriceBreakdown.length > 1
                      ? "var(--primary-color)"
                      : "#ccc"
                  }
                  boxShadowColor={
                    originalPriceBreakdown.length > 1
                      ? "var(--primary-color)"
                      : "#ccc"
                  }
                />
              }
              icon={<BpIcon color={"white"} />}
            />
          }
        />,
        `${passenger?.firstName} ${passenger?.lastName}`?.toUpperCase(),
        passenger?.paxType === "CNN" ? (
          <>
            {passenger?.paxType}{" "}
            <span style={{ color: "var(--primary-color)" }}>
              [{passenger?.age} yrs]
            </span>
          </>
        ) : (
          passenger.paxType
        ),
        moment(passenger?.dateOfBirth).format("DD MMM, YYYY"),
        crrPax?.passportNation,
        passenger
          ? `${passenger?.baseFare?.toLocaleString("en-IN")} BDT`
          : "N/A",
        passenger ? `${passenger?.tax?.toLocaleString("en-IN")} BDT` : "N/A",
        retriveData?.paymentStatus?.toUpperCase(),
      ];
    });
  };

  const handleCheckboxChange = (index, pax) => {
    setAllSelected(false);
    setSelectedPassengers((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((i) => i !== index);
      } else {
        return [...prevSelected, index];
      }
    });

    setPriceBreakdown((prev) => {
      const existingIndex = prev.findIndex((item) => item.index === index);

      if (existingIndex !== -1) {
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        if (pax.type === "CNN") {
          if (pax.age >= 2 && pax.age <= 11) {
            return [...prev, { ...pax, index }];
          } else {
            console.warn(
              `Passenger ${index} of type CNN does not meet age conditions`
            );
            return prev;
          }
        } else if (pax.type === "INF") {
          if (pax.age === "" || pax.age < 2) {
            return [...prev, { ...pax, index }];
          } else {
            console.warn(
              `Passenger ${index} of type INF has invalid or unspecified age`
            );
            return prev;
          }
        } else {
          return [...prev, { ...pax, index }];
        }
      }
    });

    setPriceBreakdown((prev) =>
      prev.map((passenger) => {
        return {
          ...passenger,
          id: retriveData?.Tickets?.at(0)?.passengers?.find(
            (item) => item?.ticketNumber === passenger?.ticketNumber
          )?.passengerId,
        };
      })
    );
  };

  const handleRowSelect = (index) => {
    setSelectedRows((prevSelected) => {
      // Toggle selection for the current index
      if (prevSelected.includes(index)) {
        return prevSelected.filter((i) => i !== index);
      } else {
        return [...prevSelected, index];
      }
    });
  };

  const flattenedPassengers = [
    ...(retriveData?.details?.passengerInformation?.adult || []),
    ...(retriveData?.details?.passengerInformation?.child || []),
    ...(retriveData?.details?.passengerInformation?.infant || []),
  ].flat();

  const passengerRows = getPassengerRows(
    originalPriceBreakdown,
    retriveData,
    selectedPassengers,
    handleCheckboxChange
  );

  // console.log(retriveData?.details);

  const { mutate, status: refundStatus } = useMutation({
    mutationFn: (payload) => {
      const isAutoRefund = autoRefundEnable?.data === true;
      const url = isAutoRefund
        ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/auto/refund`
        : `${process.env.REACT_APP_BASE_URL}/api/v1/user/refund`;

      const method = isAutoRefund ? "patch" : "post";
      return axios[method](url, payload, jsonHeader());
    },
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message, () => {
          navigate(`/dashboard/booking/airtickets/all`);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["bookingData"]);
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

  const { mutate: splitPayMutate, status: splitPayStatus } = useMutation({
    mutationFn: ({ bookingId, passengers }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/split`,
        { bookingId, passengers },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        const firstDataId = data?.data?.data?.id;

        CustomAlert({
          success: true,
          message:
            "Passenger Split Successfully.We are pleased to inform you that the passenger split process has been successfully completed. The requested passengers have been separated into a new booking, ensuring a seamless and hassle-free experience for both parties.",
          bookingProps: {
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          },
          title: `${data?.data?.message}`,
          alertFor: "issueSplit",
          onClose: () =>
            navigate(`/dashboard/booking/airtickets/all/${firstDataId}`),
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["bookingData"]);
    },
    onError: (err) => {
      CustomAlert({
        success: false,
        message: err.response.data.message,
        bookingProps: {
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        },
        title: "Passengers Split Operation Failed",
        alertFor: "issueSplit",
        // onClose: () =>
        //   navigate(
        //     `/dashboard/booking/airtickets/all/${retriveData?.details?.id}`
        //   ),
      });
    },
  });

  const handleRefundBooking = async () => {
    if (selectedPassengers?.length === 0) {
      showToast("warning", "Please select at least one passenger");
      return;
    }

    if (selectedRows?.length === 0) {
      showToast("warning", "Please Select at least one Itineray!");
      return;
    }

    const bookingId = retriveData?.id;

    const body = autoRefundEnable?.data
      ? { bookingId, taxRefund: false }
      : { bookingId, indexes: selectedRows.map((index) => index) };

    const result = await CustomAlert({
      success: "warning",
      message:
        "Are you sure? You want to proceed Refund Request for This booking?",
    });

    if (result.isConfirmed) {
      if (isSendingOtp && otpFields.every((field) => field) && otpKey) {
        body.otpKey = otpKey;
        body.otp = otpFields.join("");
      }

      mutate(body);
    }
  };

  const handleSplitPassengersRefund = async () => {
    const bookingId = retriveData?.id;
    const selectedPassengersId = priceBreakdown.map(
      (passenger) => passenger.id
    );

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to split passengers for this booking?",
    });

    if (result.isConfirmed) {
      splitPayMutate({ bookingId, passengers: selectedPassengersId });
    }
  };

  const handleSendBookingOtp = async (type) => {
    setOperationType(type);

    if (isSendingOtp) {
      setIsOtpLoading(true);
      const api =
        type === "splitPassengersBooking"
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/otp/send-otp/split-passenger`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/otp/send-otp/refund-request`;

      const body = {
        bookingId: retriveData?.id,
      };

      try {
        const response = await axios.post(api, body, jsonHeader());

        if (response?.data?.success) {
          showToast("success", "OTP has been sent to agent's mail");
          setOtpKey(response?.data?.data?.key);
          setCreatedAt(response?.data?.data?.createdAt);
          setIsDrawerOpen(true);
        } else {
          showToast("error", "Failed to send OTP");
        }

        return response.data;
      } catch (error) {
        showToast("error", "An error occurred while sending OTP");
        return { success: false };
      } finally {
        setIsOtpLoading(false);
        setOtpFields(new Array(6).fill(""));
      }
    } else {
      if (originalPriceBreakdown.length !== priceBreakdown.length) {
        handleSplitPassengersRefund();
      } else {
        handleRefundBooking();
      }
    }
  };

  const totalServiceCharge = originalPriceBreakdown.reduce((total, pax) => {
    const matchingService = refundServiceData?.data?.[0]?.data?.find(
      (service) => service.paxType === pax.paxType
    );
    if (matchingService) {
      return total + matchingService.serviceCharge * pax.paxCount;
    }
    return total;
  }, 0);

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
      setAirlineCharge(
        beforeRefundCharge
          ? beforeRefundCharge?.convertedAmount
          : "Will be decided"
      );
    } else {
      setAirlineCharge(
        afterRefundCharge
          ? afterRefundCharge?.convertedAmount
          : "Will be decided"
      );
    }
  }, [retriveData?.details?.routes?.[0]]);

  if (splitPayStatus === "pending") {
    return <PendingLoader type={"split"} />;
  }

  if (isRefundLoading) {
    return (
      <>
        <Box sx={{ display: { xs: "block", lg: "none" } }}>
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
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
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

  const isNotEqual = selectedRows?.length !== itineraryRows?.length;

  // console.log(passengers, priceBreakdown);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mb: { xs: 7, lg: 0 } }}>
        <BookingHeader
          type={type}
          handleTypeChange={handleTypeChange}
          tabs={tabs}
          retriveData={retriveData}
        />
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
            <Grid
              item
              xs={12}
              lg={2.4}
              sx={{
                display: {
                  xs: type === "Refund Fare Information" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <TicketStatus data={retriveData} />
              {retriveData?.status?.toLowerCase() ===
                "refund to be confirmed" && (
                <TimeCountDown
                  label="Refund Request Time Limit"
                  timeLimit={moment(retriveData?.Tickets[0]?.createdAt)
                    .clone()
                    .set({ hour: 23, minute: 59, second: 0 })}
                />
              )}
              <RefundPriceBreakdown
                data={retriveData}
                priceBreakdown={
                  priceBreakdown.map((item) => ({
                    ...item,
                    paxType: item?.type || item?.paxType,
                  })) || []
                }
                label="Total Refundable Amount"
                serviceCharge={totalServiceCharge}
                isNotEquals={
                  originalPriceBreakdown.length !== priceBreakdown.length
                }
                airlineCharge={
                  originalPriceBreakdown.length !== priceBreakdown.length ||
                  autoRefundData === undefined
                    ? "Will be decided"
                    : (autoRefundData?.data?.airlineCharge || 0).toLocaleString(
                        "en-IN"
                      ) + " BDT"
                }
                amount={
                  status === "pending"
                    ? ""
                    : originalPriceBreakdown.length !== priceBreakdown.length ||
                        autoRefundData === undefined
                      ? "Will be decided"
                      : Number(
                          (
                            autoRefundData?.data?.agentRefundAmount ?? 0
                          )?.toFixed(2)
                        ).toLocaleString("en-IN") + " BDT"
                }
                ait={
                  originalPriceBreakdown.length !== priceBreakdown.length ||
                  autoRefundData === undefined
                    ? "Will be decided"
                    : Number(
                        (autoRefundData?.data?.totalAit ?? 0)?.toFixed(2)
                      ).toLocaleString("en-IN") + " BDT"
                }
              />

              {retriveData?.details?.structure.length > 0 && (
                <Box mt={"20px"}>
                  <FareRulesCharges
                    structure={retriveData?.details?.structure || []}
                    nonStructure={retriveData?.details?.nonStructure || []}
                    bookingData={retriveData}
                  />
                </Box>
              )}

              <Box mt={"20px"}>
                <MakeBookingQuotation
                  retriveData={retriveData}
                  type={"refund"}
                  serviceChargeData={refundServiceData?.data?.[0]?.data}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              lg={9.4}
              sx={{
                bgcolor: "#fff",
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "space-between",
                borderRadius: "5px",
                display: {
                  xs: type === "Booking Refund Request" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <Box>
                <PageTitle title={`Booking Refund Request`} />

                {/* Passengers Information Starts Here */}
                <Grid item lg={12} sx={{ bgcolor: "#fff", p: "12px 15px" }}>
                  <Typography
                    sx={{ fontSize: "15px", fontWeight: "500", pb: "15px" }}
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

                  {/* --- passenger card for mobile start --- */}
                  <Stack
                    spacing={2}
                    sx={{
                      display: {
                        xs:
                          type === "Booking Refund Request" ? "block" : "none",
                        lg: "none",
                      },
                    }}
                  >
                    {flattenedPassengers?.map((passenger, index) => {
                      const price = originalPriceBreakdown.find(
                        (item) => item.paxType === passenger.type
                      );

                      return (
                        <MobilePassengerInfo
                          key={index}
                          passenger={passenger}
                          price={price}
                          index={index}
                          selectedPassengers={selectedPassengers}
                          handleCheckboxChange={handleCheckboxChange}
                          retriveData={retriveData}
                          flattenedPassengers={flattenedPassengers}
                          priceBreakdown={priceBreakdown}
                        />
                      );
                    })}
                  </Stack>
                  {/* --- passenger card for mobile end --- */}

                  <Box sx={{ mt: "15px" }}>
                    {originalPriceBreakdown.length !==
                      priceBreakdown.length && <AirlineChargeNotice />}
                  </Box>
                </Grid>

                {(originalPriceBreakdown.length === priceBreakdown.length ||
                  priceBreakdown.length === originalPriceBreakdown?.length) && (
                  <>
                    {/*Flight Itinery Onward */}
                    {retriveData?.details?.route.map((ro, index) => (
                      <Grid
                        item
                        lg={12}
                        sx={{
                          bgcolor: "#fff",
                          p: "12px 15px",
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

                    {/* --- Flight Itinerary for Mobile start --- */}
                    <Box
                      sx={{
                        display: { xs: "block", lg: "none" },
                        px: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "500",
                          pb: "15px",
                        }}
                      >
                        Select your prefered itnerary
                      </Typography>
                      {retriveData?.details?.route?.map((route, index) => (
                        <MobileItineraryCard
                          key={index}
                          retriveData={retriveData}
                          index={index}
                          route={route}
                          selectedRows={selectedRows}
                          handleRowSelect={handleRowSelect}
                        />
                      ))}
                    </Box>
                    {/* --- Flight Itinerary for Mobile end --- */}

                    <RefundFareInfo
                      retriveData={retriveData}
                      serviceChargeData={refundServiceData?.data?.[0] || []}
                      selectedRows={selectedRows}
                      itineraryRows={itineraryRows}
                      autoRefundData={autoRefundData}
                      passengers={passengers}
                      isAutoRefundLoading={status === "pending"}
                      flattenedPassengers={flattenedPassengers}
                    />

                    {/* Voluntary Refund Operation*/}
                    {/* <Box sx={{ pl: "15px", mt: "20px" }}>
                      <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                        Choose Refund Reason
                      </Typography>
                      <RefundTypeSelector
                        voluntaryRefund={voluntaryRefund}
                        handleVoluntaryChange={handleVoluntaryChange}
                      />
                    </Box> */}
                    {/* Refund remarks */}
                    {/* <Box sx={{ px: "15px", mt: "20px" }}>
                      <Typography
                        sx={{ fontSize: "15px", fontWeight: 500, mb: 1 }}
                      >
                        Refund Remarks
                      </Typography>
                      <textarea
                        autoComplete="off"
                        onChange={handleChange}
                        placeholder="Enter Refund Remarks..."
                        style={{
                          height: "100px",
                          width: "100%",
                          border: "1px solid #dadce0",
                          borderRadius: "3px",
                          resize: "none",
                          outline: "none",
                          padding: "5px",
                        }}
                        rows={4}
                      />
                    </Box> */}
                  </>
                )}
              </Box>
              {/* Terms and conditions */}

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", lg: "center" },
                    pl: 2,
                    my: { lg: "10px", xs: "10px" },
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isAccept}
                          onChange={(e) => setIsAccept(e.target.checked)}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#8F8F98",
                            fontSize: "13px",
                            fontWeight: "500",
                            pt: { lg: "2px" },
                          }}
                        >
                          By Completing this Operation Agree with our{" "}
                          <Link
                            to="/terms-and-conditions"
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
                            to="/privacy-policy"
                            target="_blank"
                            style={{
                              color: "var(--primary-color)",
                              textDecoration: "none",
                            }}
                          >
                            {" "}
                            Privacy Policy
                          </Link>
                          <RequiredIndicator />
                        </Typography>
                      }
                    />
                  </FormGroup>
                </Box>
                <Box
                  p={2}
                  sx={{
                    display: { xs: "none", lg: "block" },
                  }}
                >
                  <Button
                    disabled={!isAccept || refundStatus === "pending"}
                    onClick={
                      originalPriceBreakdown.length !== priceBreakdown.length
                        ? () => handleSendBookingOtp("splitPassengersBooking")
                        : () => handleSendBookingOtp("refundBooking")
                    }
                    sx={{
                      ...nextStepStyle,
                      ":hover": { bgcolor: "var(--primary-color)" },
                    }}
                  >
                    <Typography>
                      {originalPriceBreakdown.length !== priceBreakdown.length
                        ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                        : `CLICK TO confirm ${isNotEqual ? "partial" : "full"} ${retriveData?.isRefundable?.toLowerCase() !== "nonrefundable" ? "" : "Tax"} REFUND REQUEST`}
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* --- mobile button start --- */}
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
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
              <Typography sx={{ fontSize: "11px", px: 8 }}>
                PROCEED TO REFUND REQUEST FOR THIS BOOKING
              </Typography>
            </Button>
          ) : (
            <Button
              disabled={!isAccept || refundStatus === "pending"}
              onClick={
                originalPriceBreakdown.length !== priceBreakdown.length
                  ? () => handleSendBookingOtp("splitPassengersRefund")
                  : () => handleSendBookingOtp("refundBooking")
              }
              sx={mobileButtonStyle}
            >
              <Typography sx={{ fontSize: "11px", px: 9 }}>
                {originalPriceBreakdown.length !== priceBreakdown.length
                  ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                  : refundStatus === "pending"
                    ? "Please Wait..."
                    : `CLICK TO ${isNotEqual ? "PARTIAL " : ""}REFUND REQUEST`}
              </Typography>
            </Button>
          )}
        </Box>

        {/* --- mobile button end --- */}
      </Box>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { width: { md: "50%", xs: "100%" } } }}
      >
        <BookingOtp
          otpFields={otpFields}
          setOtpFields={setOtpFields}
          handleSubmit={() =>
            operationType === "refundBooking"
              ? handleRefundBooking()
              : handleSplitPassengersRefund()
          }
          handleSendBookingOtp={handleSendBookingOtp}
          operationType={operationType}
          createdAt={createdAt}
          setIsDrawerOpen={setIsDrawerOpen}
          title={"Refund Request Operation"}
        />
      </Drawer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {selectImage?.includes(".pdf") ? (
            <iframe
              title="logo"
              src={selectImage}
              width="100%"
              height="100%"
            ></iframe>
          ) : (
            <img
              alt="logo"
              src={selectImage}
              style={{ height: "100%", width: "100%" }}
            />
          )}
        </Box>
      </Modal>

      <CustomLoadingAlert
        open={refundStatus === "pending"}
        text={"We Are Processing Your Request"}
      />

      <CustomLoadingAlert
        open={isOtpLoading}
        text={"Sending OTP to your email, please wait..."}
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
    label: "Booking Refund Request",
    value: "Booking Refund Request",
  },
  {
    label: "Refund Fare Information",
    value: "Refund Fare Information",
  },
];

export const RefundTypeSelector = ({
  voluntaryRefund,
  handleVoluntaryChange,
}) => {
  return (
    <FormControl>
      <RadioGroup
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 0, lg: 1 },
        }}
        value={voluntaryRefund ? "voluntary" : "involuntary"}
        onChange={handleVoluntaryChange}
      >
        <FormControlLabel
          control={<Radio />}
          label={<span style={{ color: "#8F8F98" }}>Voluntary Refund</span>}
          value="voluntary"
        />
        <FormControlLabel
          control={<Radio />}
          label={<span style={{ color: "#8F8F98" }}>Involuntary Refund</span>}
          value="involuntary"
        />
      </RadioGroup>
    </FormControl>
  );
};

export const AirlineChargeNotice = () => {
  return (
    <Box
      sx={{
        px: "15px",
        ".MuiSvgIcon-root": { color: "#E98D20" },
      }}
    >
      <Alert
        severity="info"
        sx={{
          border: "1px solid #E98D20",
          bgcolor: "#FEF9F2",
          color: "#E98D20",
          fontSize: "12px",
          padding: "0px 10px",
        }}
      >
        Please select your confirmed passengers before confirming your ticket
        request. This action will separate the selected passengers from your
        main booking and create a sub-booking. You must ensure at least one
        adult remains in the split booking and your current booking, Single
        infant cannot be split without and adult from the current booking.
      </Alert>
    </Box>
  );
};

export default RefundDetails;
