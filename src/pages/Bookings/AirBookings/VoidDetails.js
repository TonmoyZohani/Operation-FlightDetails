import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  ThemeProvider,
  Checkbox,
  Button,
  Modal,
  FormControlLabel,
  FormGroup,
  Stack,
  Drawer,
  Tooltip,
} from "@mui/material";
import { TicketStatus } from "../../../component/AirBooking/PriceBreakdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageTitle from "../../../shared/common/PageTitle";
import { BpCheckedIcon, BpIcon } from "../../../shared/common/styles";
import { theme } from "../../../utils/theme";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import moment from "moment";
import { AirlineChargeNotice, modalStyle } from "./IssueDetails";
import { useAuth } from "../../../context/AuthProvider";
import axios from "axios";
import CustomAlert from "../../../component/Alert/CustomAlert";
import TimeCountDown from "../../../component/FlightAfterSearch/components/TimeCountDown";
import { mobileButtonStyle, nextStepStyle } from "../../../style/style";
import PendingLoader from "../../../component/Loader/PendingLoader";
import useToast from "../../../hook/useToast";
import CustomToast from "../../../component/Alert/CustomToast";
import BookingHeader from "../components/BookingHeader";
import { TicketStatusSkeleton } from "../../../component/SkeletonLoader/TicketStatusSkeleton";
import FilterSkeleton from "../../../component/SkeletonLoader/FilterSkeleton";
import BookingDetailsSkeleton from "../../../component/SkeletonLoader/BookingDetailsSkeleton";
import MobilePassengerInfo from "../components/MobilePassengerInfo";
import QueueHeader from "../components/QueueHeader";
import RequiredIndicator from "../../../component/Common/RequiredIndicator";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";
import BookingOtp from "../../../component/AirBooking/BookingOtp";
import VoidFareInfo from "../components/VoidFareInfo";
import FareRulesCharges from "../../../component/FlightAfterSearch/components/FareRulesCharges";
import MakeBookingQuotation from "./MakeBookingQuotation";
import VoidPriceBreakdown from "../../../component/AirBooking/VoidPriceBreakdown";

const VoidDetails = () => {
  const { state } = useLocation();
  const { jsonHeader } = useAuth();
  const [allSelected, setAllSelected] = useState(false);
  const { retriveData, passengers, flightVoid } = state;
  const [selectedPassengers, setSelectedPassengers] = useState([0]);
  const [priceBreakdown, setPriceBreakdown] = useState([]);
  const [selectImage, setSelectImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Booking Void Request");
  const [isAccept, setIsAccept] = useState(false);
  const { agentData } = useOutletContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [otpKey, setOtpKey] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [operationType, setOperationType] = useState("");
  const isSendingOtp = agentData?.otpSwitch?.airTicket?.voidRequest;
  const originalPriceBreakdown = retriveData?.details?.priceBreakdown;

  const [query] = useState({
    commissionType: retriveData?.commissionType,
    tripType: retriveData?.tripType,
    journeyType: retriveData?.journeyType,
  });

  const { data: voidServiceData, isLoading } = useQuery({
    queryKey: ["voidServiceData", query],
    queryFn: async () => {
      const queryParams = new URLSearchParams(query).toString();
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/common/service-charges/void?${queryParams}`;
      const { data } = await axios.get(url, jsonHeader());

      return data;
    },
  });
  const { data: autoVoid } = useQuery({
    queryKey: ["autoVoid"],
    queryFn: async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/switch-data?bookingId=${retriveData?.id}&serviceName=autoVoid`;
      const { data } = await axios.get(url, jsonHeader());

      return data;
    },
  });


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const getPassengerRows = (
    priceBreakdown,
    retriveData,
    selectedPassengers,
    handleCheckboxChange
  ) => {
    return priceBreakdown?.map((passenger, index) => {
      const crrPax = passengers.at(index);

      const isPaxDisabled =
        !flightVoid?.operations?.splitVoid ||
        (priceBreakdown?.length === 1 &&
          priceBreakdown?.some((item) => item.index === index)) ||
        retriveData?.paymentStatus?.toLowerCase() === "partially paid";

      return [
        <FormControlLabel
          key={index}
          sx={{ pl: 1 }}
          control={
            <Checkbox
              disabled={isPaxDisabled}
              disableRipple
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
                  bgColor={isPaxDisabled ? "#ccc" : "var(--primary-color)"}
                  boxShadowColor={
                    isPaxDisabled ? "#ccc" : "var(--primary-color)"
                  }
                />
              }
              icon={<BpIcon color={"white"} />}
            />
          }
        />,
        `${passenger.firstName} ${passenger.lastName}`.toUpperCase(),
        passenger.paxType === "CNN" ? (
          <>
            {passenger.paxType}{" "}
            <span style={{ color: "var(--primary-color)" }}>
              [{passenger.age} yrs]
            </span>
          </>
        ) : (
          passenger.paxType
        ),
        moment(passenger.dateOfBirth).format("DD MMM, YYYY"),
        crrPax?.passportNation,
        passenger
          ? `${passenger?.baseFare?.toLocaleString("en-IN")} BDT`
          : "N/A",
        passenger ? `${passenger?.tax?.toLocaleString("en-IN")} BDT` : "N/A",
        retriveData?.paymentStatus?.toUpperCase(),
      ];
    });
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
                checked={true}
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

  const passengerRows = getPassengerRows(
    originalPriceBreakdown,
    retriveData,
    selectedPassengers,
    handleCheckboxChange
  );

  const { mutate, status: voidStatus } = useMutation({
    mutationFn: ({ bookingId, otpKey, otp }) => {
      const url =
        autoVoid?.data === true
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/auto/ticket`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/payment`;

      const payload = {
        bookingId,
        ...(otpKey && otp ? { otpKey, otp } : {}),
      };

      return axios.patch(url, payload, jsonHeader());
    },
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message, () => {
          navigate(`/dashboard/booking/airtickets/all`);
        });
      }
      navigate(`/dashboard/booking/airtickets/all`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["singleBookingData"]);
      setIsDrawerOpen(false);
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
    mutationFn: ({ bookingId, passengers, otpKey, otp }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/split`,
        {
          bookingId,
          passengers,
          ...(otpKey && otp ? { otpKey, otp } : {}),
        },
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
      setIsDrawerOpen(false);
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

  const handleVoidBooking = async () => {
    if (selectedPassengers?.length === 0) {
      showToast("warning", "Please select at least one passenger");
      return;
    }
    const bookingId = retriveData?.id;

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to Void This Ticket?",
    });

    if (result.isConfirmed) {
      const payload = { bookingId };

      if (isSendingOtp && otpFields.every((field) => field) && otpKey) {
        payload.otpKey = otpKey;
        payload.otp = otpFields.join("");
      }

      mutate(payload);
    }
  };

  const handleSplitPassengersVoid = async () => {
    const bookingId = retriveData?.id;
    const selectedPassengersId = priceBreakdown.map(
      (passenger) => passenger.id
    );

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to split passengers for this booking?",
    });

    if (result.isConfirmed) {
      const payload = { bookingId, passengers: selectedPassengersId };

      if (isSendingOtp && otpFields.every((field) => field) && otpKey) {
        payload.otpKey = otpKey;
        payload.otp = otpFields.join("");
      }

      splitPayMutate(payload);
    }
  };

  // console.log(retriveData)

  const handleSendBookingOtp = async (type) => {
    setOperationType(type);

    if (isSendingOtp) {
      setIsOtpLoading(true);
      const api =
        type === "splitPassengersBooking"
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/otp/send-otp/split-passenger`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/otp/send-otp/void-request`;

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
        handleSplitPassengersVoid();
      } else {
        handleVoidBooking();
      }
    }
  };

  // mobile handle function
  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
    } else {
      setType(newTab);
    }
  };

  const totalServiceCharge = originalPriceBreakdown.reduce((total, pax) => {
    const matchingService = voidServiceData?.data?.[0]?.data?.find(
      (service) => service.paxType === pax.paxType
    );
    if (matchingService) {
      return total + matchingService.serviceCharge * pax.paxCount;
    }
    return total;
  }, 0);

  if (splitPayStatus === "pending") {
    return <PendingLoader type={"split"} />;
  }

  if (isLoading) {
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
        <Box
          sx={{
            display: {
              xs: "none",
              lg: "block",
            },
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

  // console.log(priceBreakdown);

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
            width: { xs: "90%", md: "100%" },
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
              xs={12}
              lg={2.4}
              sx={{
                display: {
                  xs: type === "Void Fare Information" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <TicketStatus data={retriveData} />
              {retriveData?.status?.toLowerCase() === "ticketed" && (
                <TimeCountDown
                  label="Void Request Expire Time Limit"
                  timeLimit={moment(retriveData?.Tickets[0]?.createdAt)
                    .clone()
                    .set({ hour: 23, minute: 59, second: 0 })}
                />
              )}
              <VoidPriceBreakdown
                data={retriveData}
                priceBreakdown={
                  priceBreakdown.map((item) => ({
                    ...item,
                    paxType: item?.type,
                  })) || []
                }
                label="Total Voidable Amount"
                serviceCharge={totalServiceCharge}
                isNotEquals={
                  originalPriceBreakdown.length !== priceBreakdown.length
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
                  type={"void"}
                  serviceChargeData={voidServiceData?.data?.[0]?.data}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              lg={9.4}
              sx={{
                bgcolor: "#fff",
                borderRadius: "5px",
                display: {
                  xs: type === "Booking Void Request" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <Box>
                <PageTitle title={`Booking Void Request`} />
                {/* Passengers Information Starts Here */}
                <Grid item lg={12} sx={{ bgcolor: "#fff", p: "12px 15px" }}>
                  <Typography
                    sx={{ fontSize: "15px", fontWeight: "500", pb: "15px" }}
                  >
                    Passenger Information
                  </Typography>

                  <Box sx={{ display: { xs: "none", lg: "block" } }}>
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
                        xs: type === "Booking Void Request" ? "block" : "none",
                        lg: "none",
                      },
                    }}
                  >
                    {originalPriceBreakdown?.map((passenger, index) => {
                      return (
                        <MobilePassengerInfo
                          key={index}
                          passenger={passenger}
                          index={index}
                          selectedPassengers={selectedPassengers}
                          handleCheckboxChange={handleCheckboxChange}
                          retriveData={retriveData}
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

                {originalPriceBreakdown.length === priceBreakdown.length && (
                  <>
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

                    <Box sx={{ padding: "12px 15px" }}>
                      <VoidFareInfo
                        retriveData={{
                          ...retriveData,
                          details: {
                            ...retriveData?.details,
                            priceBreakdown: originalPriceBreakdown.map(
                              (item) => {
                                const crrPassenger =
                                  voidServiceData?.data?.[0]?.data?.find(
                                    (service) =>
                                      service?.paxType === item?.paxType
                                  );

                                return { ...item, ...crrPassenger };
                              }
                            ),
                          },
                        }}
                      />
                    </Box>
                    {/* Void remarks */}
                    {/* <Box sx={{ px: "15px", mt: "20px" }}>
                      <Typography
                        sx={{ fontSize: "15px", fontWeight: 500, mb: 1 }}
                      >
                        Void Remarks
                      </Typography>
                      <textarea
                        autoComplete="off"
                        onChange={handleChange}
                        placeholder="Enter void remarks..."
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
                    alignItems: {
                      xs: "flex-start",
                      lg: "center",
                    },
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
                            pt: {
                              xs: "8px",
                              lg: "2px",
                            },
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
                  sx={{
                    display: {
                      xs: "none",
                      lg: "block",
                    },
                  }}
                  p={2}
                >
                  <Button
                    disabled={!isAccept}
                    onClick={
                      originalPriceBreakdown.length !== priceBreakdown.length
                        ? () => handleSendBookingOtp("splitPassengersBooking")
                        : () => handleSendBookingOtp("voidBooking")
                    }
                    sx={{
                      ...nextStepStyle,
                      ":hover": {
                        bgcolor: "var(--primary-color)",
                      },
                    }}
                  >
                    <Typography>
                      {originalPriceBreakdown.length !== priceBreakdown.length
                        ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                        : "CLICK TO COMPLETE THE VOID REQUEST"}
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
            display: {
              xs: "block",
              lg: "none",
            },
            position: "fixed",
            bottom: 0,
            width: "100%",
          }}
        >
          {type === "Void Fare Information" ? (
            <Button
              sx={mobileButtonStyle}
              onClick={() => setType("Booking Void Request")}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  px: 8,
                }}
              >
                PROCEED TO VOID REQUEST FOR THIS BOOKING
              </Typography>
            </Button>
          ) : (
            <Button
              disabled={voidStatus === "pending" || !isAccept}
              onClick={
                originalPriceBreakdown.length !== priceBreakdown.length
                  ? () => handleSendBookingOtp("splitPassengersBooking")
                  : () => handleSendBookingOtp("voidBooking")
              }
              sx={mobileButtonStyle}
            >
              <Typography sx={{ fontSize: "11px", px: 9 }}>
                {originalPriceBreakdown.length !== priceBreakdown.length
                  ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                  : voidStatus === "pending"
                    ? "Please Wait..."
                    : "CLICK TO COMPLETE THE VOID REQUEST"}
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
            operationType === "voidBooking"
              ? handleVoidBooking()
              : handleSplitPassengersVoid()
          }
          handleSendBookingOtp={handleSendBookingOtp}
          operationType={operationType}
          createdAt={createdAt}
          setIsDrawerOpen={setIsDrawerOpen}
          title={"Void Request Operation"}
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
              style={{
                height: "100%",
                width: "100%",
              }}
            />
          )}
        </Box>
      </Modal>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      <CustomLoadingAlert
        open={splitPayStatus === "pending" || voidStatus === "pending"}
        text={"We Are Processing Your Request"}
      />

      <CustomLoadingAlert
        open={isOtpLoading}
        text={"Sending OTP to your email, please wait..."}
      />
    </ThemeProvider>
  );
};

const tabs = [
  {
    label: "Booking Void Request",
    value: "Booking Void Request",
  },
  {
    label: "Void Fare Information",
    value: "Void Fare Information",
  },
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
export default VoidDetails;
