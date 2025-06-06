import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Box,
  Button,
  Drawer,
  FormGroup,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import wallet from "../../images/logo/logoblack.png";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import useWindowSize from "../../shared/common/useWindowSize";
import { nextStepStyle } from "../../style/style";
import CustomAlert from "../Alert/CustomAlert";
import CustomToast from "../Alert/CustomToast";
import RequiredIndicator from "../Common/RequiredIndicator";
import PendingLoader from "../Loader/PendingLoader";
import PassengerDocsModal from "../Modal/PassengerDocsModal";
import { setClearAllStates, setPartialData } from "./airbookingSlice";
import { getPassengerDetails } from "./BookingUtils";
import { clearAncillaries } from "./components/ancillariesSlice";
import BookingOtp from "./BookingOtp";
import CustomLoadingAlert from "../Alert/CustomLoadingAlert";
import { numberToWords } from "../../shared/common/functions";
import ChurnBookingModal from "./components/ChurnModal";

const PaymentInformation = ({
  flightData,
  paxDetails,
  bookingId,
  flightAfterSearch,
  cachedKey,
  totalPassenger,
  oldFlightData,
  isLoading: isAirPriceLoading,
  selectedBrand,
  crrItenary,
  // setTimeLimitLoading,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [passenger, setPassenger] = useState({});
  const { partialChargeData } = useSelector((state) => state.flightBooking);
  const flightBookingData = useSelector((state) => state.flightBooking);
  const ancillaries = useSelector((state) => state.ancillaries);
  const { passengerData, clientContact } = flightBookingData;
  const passengerDetails = getPassengerDetails(totalPassenger);
  const [index, setIndex] = useState(0);
  const [remainingPassengers, setRemainingPassengers] = useState([]);
  const [flattenedPassengerData, setFlattenedPassengersData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isMobile } = useWindowSize();
  const { formDataHeader } = useAuth();
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [otpKey, setOtpKey] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [churnModal, setChurnModal] = useState(false);
  const [churnData, setChurnData] = useState({});
  // const [userChurnAllowance, setUserChurnAllowance] = useState(false);

  const [parentType, setParentType] = useState(
    !flightData[crrItenary]?.immediateIssue &&
      flightAfterSearch !== "reissue-search"
      ? "hold"
      : "confirm"
  );
  const [payType, setPayType] = useState(
    !flightData[crrItenary]?.immediateIssue &&
      flightAfterSearch !== "reissue-search"
      ? ""
      : "fullPay"
  );
  const [isLoading, setIsLoading] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const dispatch = useDispatch();
  const { jsonHeader } = useAuth();
  const queryClient = useQueryClient();
  const { checkUnAuthorized } = useUnAuthorized();
  const { balanceData, agentData } = useOutletContext();

  const agentCms = agentData?.agentCms?.eligibleRangeCms ?? {};
  const passportImageCmsShow =
    agentData?.agentCms?.eligibilityCms?.passportRequiredForBooking;
  const visaImageCmsShow =
    agentData?.agentCms?.eligibilityCms?.visaRequiredForBooking;
  const isSedingOtp = agentData?.otpSwitch?.airTicket?.booking;
  const availableBooking = agentData?.agentCms?.countCms?.booking;
  const usedBooking = agentData?.usedCms?.booking;

  const handleCancelChurn = () => {
    setChurnModal(false);
  };

  // TODO: Ancillaries request mutate
  const { mutate: ancillariesMutate } = useMutation({
    mutationFn: (data) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/ancillary-requests`,
        data,
        jsonHeader()
      ),
    onSuccess: (data, variables) => {
      if (data?.data?.success) {
        dispatch(clearAncillaries());
        CustomAlert({
          success: true,
          message:
            "Dear Agent, your booking & ancillaries request has been successfully confirmed! The seats are now secured, and your client's travel plans are set. Thank you for choosing us for your booking needs.",
          bookingProps: {
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          },
          title: "Booking & Ancillaries Successful",
          alertFor: "booking",
          onClose: () =>
            navigate(
              `/dashboard/booking/airtickets/all/${variables?.bookingId}`
            ),
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["ancilaryData"]);
    },
    onError: (error, variables) => {
      dispatch(clearAncillaries());
      CustomAlert({
        success: true,
        message:
          "Dear Agent, your booking request has been successfully confirmed! The seats are now secured, and your client's travel plans are set. Thank you for choosing us for your booking needs.",
        bookingProps: {
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        },
        title: "Booking Successful",
        alertFor: "booking",
        onClose: () =>
          navigate(`/dashboard/booking/airtickets/all/${variables?.bookingId}`),
      });
    },
  });

  const handlePaymentMethod = (event) => {
    const selectedType = event.target.value;
    setParentType((prevType) =>
      prevType === selectedType ? "" : selectedType
    );
    if (selectedType === "confirm") {
      setPayType("fullPay");
    } else {
      setPayType("");
    }

    dispatch(setPartialData(null));
  };

  const handleBookingSubmit = async (userChurnAllowance) => {
    if (usedBooking >= availableBooking) {
      CustomAlert({
        success: false,
        title: "Your today's booking limit is over",
        message:
          "Please,Contact with our support team to increase you booking limit",
      });
      return;
    }

    const result = await CustomAlert({
      success: "warning",
      message: `Are you sure? You want to book this ticket ${flightAfterSearch === "reissue-search" ? "for reissuing request" : ""}?`,
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoading(true);

    // Handle special case: auto reissue
    if (
      flightAfterSearch === "reissue-search" &&
      flightData[crrItenary]?.autoReissue === true
    ) {
      const reissueBody = {
        uuid: flightData[crrItenary]?.uuid,
        bookingId,
        brandId: selectedBrand?.brandId,
        agentPrice: flightData[crrItenary]?.agentPrice,
        clientPrice: flightData[crrItenary]?.clientPrice,
      };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue/booking`,
          reissueBody,
          jsonHeader()
        );

        if (
          response?.data?.success &&
          response?.data?.data?.status !== "failed"
        ) {
          dispatch(setClearAllStates());
          setIsDrawerOpen(false);
          CustomAlert({
            success: true,
            title: response?.data?.message,
            message: "Reissue booking completed successfully!",
            alertFor: "booking",
            bookingProps: {
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
            },
            onClose: () =>
              navigate(
                `/dashboard/booking/airtickets/all/${response?.data?.data?.id}`
              ),
          });
        } else {
          throw new Error("Reissue booking failed");
        }
      } catch (err) {
        setIsLoading(false);
        CustomAlert({
          success: false,
          message: err?.response?.data?.message || "Reissue booking failed!",
          alertFor: "booking",
          title: "Booking Failed",
          bookingProps: {
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          },
        });
      }

      return;
    }

    const api = `${process.env.REACT_APP_BASE_URL}/api/v1/user/${
      flightAfterSearch === "reissue-search" ? "reissue-booking" : "booking"
    }`;

    const transformedPassengerData = {
      adult: passengerData.adult.map((passenger) => ({
        ...passenger,
        passportNation: passenger.passportNation.code,
        type: "ADT",
        ancillaries: passenger.ancillaries
          .filter((ancillary) => ancillary.description)
          .map((ancillary) => ({ ...ancillary })),
      })),
      child: passengerData.child.map((passenger) => ({
        ...passenger,
        passportNation: passenger.passportNation.code,
        type: "CNN",
        ancillaries: passenger.ancillaries
          .filter((ancillary) => ancillary.description)
          .map((ancillary) => ({ ...ancillary })),
      })),
      infant: passengerData.infant.map((passenger) => ({
        ...passenger,
        passportNation: passenger.passportNation.code,
        type: "INF",
        ancillaries: passenger.ancillaries
          .filter((ancillary) => ancillary.description)
          .map((ancillary) => ({ ...ancillary })),
      })),
    };

    // Function to process each itinerary
    const processItinerary = async (itinerary, index) => {
      const formData = new FormData();
      formData.append("data", itinerary?.uuid);
      formData.append("uuid", cachedKey);
      formData.append("paxDetails", JSON.stringify(paxDetails));
      formData.append("bookingId", bookingId);
      formData.append(
        "passengerInformation",
        JSON.stringify(transformedPassengerData)
      );

      // Append passport and visa images
      ["adult", "child", "infant"].forEach((type) => {
        passengerData[type].forEach((passenger, passengerIndex) => {
          if (passenger.passportImage) {
            formData.append(
              `passengerInformation.${type}[${passengerIndex}].passportImage`,
              passenger.passportImage
            );
          }
          if (passenger.visaImage) {
            formData.append(
              `passengerInformation.${type}[${passengerIndex}].visaImage`,
              passenger.visaImage
            );
          }
        });
      });

      if (clientContact?.clientEmail && clientContact?.clientPhoneNumber) {
        formData.append(
          "contact",
          JSON.stringify({
            email: clientContact.clientEmail || "",
            phoneNumber: clientContact.clientPhoneNumber || "",
          })
        );
      }

      formData.append("agentPrice", itinerary?.agentPrice);
      formData.append("clientPrice", itinerary?.clientPrice);
      formData.append("sendSms", true);
      formData.append("sendEmail", true);
      formData.append("userChurnAllowance", userChurnAllowance);
      formData.append("fullPayment", payType === "fullPay" ? true : false);
      formData.append(
        "partialPayment",
        payType === "partialPay" ? true : false
      );

      if (isSedingOtp && otpFields?.length && otpKey) {
        formData.append("otp", otpFields.join(""));
        formData.append("otpKey", otpKey);
      }

      try {
        const response = await axios.post(api, formData, formDataHeader());

        if (
          response?.data?.success &&
          response?.data?.data &&
          response?.data?.data?.status !== "failed"
        ) {
          if (index === flightData.length - 1) {
            // Only clear states and close drawer after last itinerary is processed
            dispatch(setClearAllStates());
            setIsDrawerOpen(false);
          }

          if (
            ancillaries &&
            ancillaries?.length > 0 &&
            flightAfterSearch !== "reissue-search"
          ) {
            const passengers = Object.values(
              response?.data?.data?.details?.passengerInformation
            )?.flat();

            onSubmit(response?.data?.data?.id, passengers);
          } else if (index === flightData.length - 1) {
            // Only show success alert after last itinerary is processed
            CustomAlert({
              success: response?.data?.success,
              message:
                "Dear Agent, your booking request has been successfully confirmed! The seats are now secured, and your client's travel plans are set. Thank you for choosing us for your booking needs.",
              bookingProps: {
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
              },
              title: response?.data?.message,
              alertFor: "booking",
              onClose: () =>
                navigate(
                  `/dashboard/booking/airtickets/all/${
                    flightAfterSearch === "reissue-search"
                      ? response?.data?.data?.length > 0 &&
                        response?.data?.data[0]?.id
                      : response?.data?.data?.id
                  }`
                ),
            });
          }
          return { success: true, data: response.data };
        } else {
          throw new Error("Booking failed");
        }
      } catch (err) {
        const data = err?.response?.data;
        const mismatchedPrices = data?.error[0]?.mismatchedPrices || [];
        const clientMismatch = mismatchedPrices.find(
          (item) => item.priceType === "Client"
        );
        const agentMismatch = mismatchedPrices.find(
          (item) => item.priceType === "Agent"
        );

        if (err?.response?.status === 401) {
          checkUnAuthorized(err);
        }

        if (data?.statusCode === 403 || data?.statusCode === 308) {
          setChurnModal(true);
          setChurnData(data);
          return { success: false, error: "churn" };
        }

        if (
          data?.message === "One or more prices have been upsold" &&
          agentMismatch
        ) {
          const { previousPrice: agentPrev, agentPrice } = agentMismatch;
          const agentDifference = agentPrice - agentPrev;

          const upsellResult = await CustomAlert({
            success: "warning",
            message: `The airline has updated the price for this booking. The previous price was <span style='font-weight: 600; color: var(--dark-gray)'>BDT ${agentPrev?.toLocaleString(
              "en-IN"
            )}</span> ,
            and the new price is <span style='font-weight: 600; color: var(--dark-gray)'>BDT ${agentPrice?.toLocaleString(
              "en-IN"
            )}</span>, with a difference of <span style='font-weight: 600; color: var(--primary-color)'>BDT ${agentDifference?.toLocaleString(
              "en-IN"
            )}</span>. Since ticket prices are dynamic and can change quickly based on availability,
            we recommend confirming your booking at the earliest to secure the current price.`,
            bookingProps: {
              showConfirmButton: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
            },
            title: "Fare Upsell",
            alertFor: "fareUpsell",
          });

          if (upsellResult.isConfirmed) {
            if (agentPrice) {
              formData.set("agentPrice", agentPrice);
            }
            if (clientMismatch?.clientPrice) {
              formData.set("clientPrice", clientMismatch.clientPrice);
            }

            setIsLoading(true);
            try {
              const retryResponse = await axios.post(
                api,
                formData,
                formDataHeader()
              );

              if (retryResponse?.data?.success) {
                if (index === flightData.length - 1) {
                  dispatch(setClearAllStates());
                  setIsLoading(false);
                  CustomAlert({
                    success: true,
                    message:
                      "Your booking has been confirmed after updating the price.",
                    bookingProps: {
                      showConfirmButton: false,
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                    },
                    title: "Booking Successful",
                    alertFor: "booking",
                    onClose: () =>
                      navigate(
                        `/dashboard/booking/airtickets/all/${
                          retryResponse?.data?.data?.length > 0
                            ? retryResponse?.data?.data[0]?.id
                            : ""
                        }`
                      ),
                  });
                }
                return { success: true, data: retryResponse.data };
              }
            } catch (retryErr) {
              setIsLoading(false);
              CustomAlert({
                success: false,
                message:
                  retryErr?.response?.data?.message || "Booking failed again!",
                bookingProps: {
                  showConfirmButton: false,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                },
                title: "Booking Failed",
                alertFor: "booking",
              });
              return { success: false, error: retryErr };
            }
          }
        } else {
          setIsLoading(false);
          CustomAlert({
            success: false,
            message: data?.message,
            bookingProps: {
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
            },
            title: "Booking Failed",
            alertFor: "booking",
          });
          return { success: false, error: err };
        }
      }
    };

    // Process all itineraries sequentially
    try {
      for (let i = 0; i < flightData.length; i++) {
        const result = await processItinerary(flightData[i], i);
        if (!result.success) {
          if (result.error === "churn") {
            // Churn modal is already shown, break the loop
            break;
          }
          // For other errors, continue to next iteration or break as needed
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error processing itineraries:", error);
    }
  };

  const onSubmit = async (id, passengers) => {
    const data = {
      bookingId: id,
      passengers: ancillaries?.map((ancillary) => ({
        passengerId: passengers?.find(
          (item) =>
            item?.firstName?.toLowerCase() ===
              ancillary?.pax?.firstName?.toLowerCase() &&
            item?.lastName?.toLowerCase() ===
              ancillary?.pax?.lastName?.toLowerCase()
        )?.id,
        itineraries: [
          {
            itineraryIndex: ancillary?.index + 1,
            ancillaries: ancillary?.ancillaries?.map((ancillary) => ({
              type: ancillary?.label?.toLowerCase().replace(/\s+/g, "-"),
              description: ancillary?.value,
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

    ancillariesMutate(sendData);
  };

  const checkPassengerDocs = (userChurnAllowance) => {
    const isValid = passengerDetails?.some((passenger) => {
      return (
        flightData[crrItenary]?.journeyType === "Outbound" ||
        (flightData[crrItenary]?.journeyType === "Inbound" &&
          passengerData[passenger?.type?.toLowerCase()][passenger?.count - 1]
            ?.passportNation?.name &&
          passengerData[passenger?.type?.toLowerCase()][passenger?.count - 1]
            ?.passportNation?.name !== "Bangladesh")
      );
    });

    const checkFlatPax = [
      ...passengerData.adult.filter(
        (p) =>
          !(
            flightData[crrItenary]?.journeyType === "Inbound" &&
            p.passportNation?.code === "BD"
          )
      ),
      ...passengerData.child.filter(
        (p) =>
          !(
            flightData[crrItenary]?.journeyType === "Inbound" &&
            p.passportNation?.code === "BD"
          )
      ),
      ...passengerData.infant.filter(
        (p) =>
          !(
            flightData[crrItenary]?.journeyType === "Inbound" &&
            p.passportNation?.code === "BD"
          )
      ),
    ];

    const isEmptyPassengers = checkFlatPax.filter((passenger) => {
      const checkPassport = passportImageCmsShow
        ? passenger?.passportImage
        : true;
      const checkVisa = visaImageCmsShow ? passenger?.visaImage : true;

      return !checkPassport || !checkVisa;
    });

    const filteredPassengerDetails = passengerDetails.filter(
      (_, index) =>
        !(
          flightData[crrItenary]?.journeyType === "Inbound" &&
          flattenedPassengerData[index]?.passportNation?.code === "BD"
        )
    );

    if (isEmptyPassengers.length !== 0 && isValid && parentType === "confirm") {
      setOpen(true);
      setIndex(0);
      setPassenger(filteredPassengerDetails[0]);
    } else {
      setOpen(false);
      handleSendBookingOtp(userChurnAllowance);
    }
  };

  const handleSendBookingOtp = async (userChurnAllowance) => {
    setIsDrawerOpen(false);
    if (isSedingOtp) {
      setIsOtpLoading(true);
      const api = `${process.env.REACT_APP_BASE_URL}/api/v1/otp/send-otp/booking`;

      const body = {
        carrier: flightData[crrItenary]?.carrierName,
        noOfPassenger: flattenedPassengerData?.length,
        flightDate: flightData[crrItenary]?.route[0]?.departureDate,
        departure: flightData[crrItenary]?.route[0]?.departure,
        arrival:
          flightData[crrItenary]?.route[
            flightData[crrItenary]?.route.length - 1
          ]?.arrival,
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
        console.error("OTP Sending Failed:", error);
        showToast("error", "An error occurred while sending OTP");
        return { success: false };
      } finally {
        setIsOtpLoading(false);
      }
    } else {
      handleBookingSubmit(userChurnAllowance);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setFlattenedPassengersData([
      ...passengerData.adult,
      ...passengerData.child,
      ...passengerData.infant,
    ]);
  }, [passengerData]);

  // console.log("Flight Data in payment", flightData);

  return (
    <>
      {isLoading && <PendingLoader />}
      <Box
        sx={{
          width: {
            xs: "90%",
            lg: "100%",
          },
          mx: "auto",
        }}
      >
        <Box mb={2} sx={{ bgcolor: "white", borderRadius: "3px", py: 1 }}>
          <Box
            sx={{
              px: "12px",
              pb: 2,
            }}
          >
            <FormControl>
              <RadioGroup value={parentType}>
                {!flightData[crrItenary]?.immediateIssue &&
                  flightAfterSearch !== "reissue-search" && (
                    <Box mb={2}>
                      <FormControlLabel
                        onChange={handlePaymentMethod}
                        control={<Radio value="hold" />}
                        label={
                          <span
                            style={{
                              color: "#4C4B4B",
                              fontSize: "0.95rem",
                              fontWeight: 500,
                            }}
                          >
                            Skip Your Payment And Just Hold Your Ticket
                          </span>
                        }
                      />
                      <Typography
                        sx={{
                          color: "var(--secondary-color)",
                          fontSize: "12px",
                          fontWeight: "500",
                          pl: "25px",
                          mt: "-10px",
                        }}
                      >
                        To proceed with your booking without immediate payment,
                        please continue to the next step. You will then need to
                        confirm your reservation within the assigned time limit
                        by completing the payment.
                      </Typography>
                    </Box>
                  )}
                <Box>
                  <FormControlLabel
                    onChange={handlePaymentMethod}
                    control={<Radio value="confirm" />}
                    label={
                      <Typography
                        sx={{
                          color: "#4C4B4B",
                          fontSize: "0.95rem",
                          xs: "1rem",
                          fontWeight: 500,
                        }}
                      >
                        {String(
                          flightData[crrItenary]?.fareDifference?.totalFare
                            ?.reIssuePayable
                        ).toLowerCase() === "will be decided" ? (
                          <>
                            Reissue Payable Amount Will Be Decided After
                            Quotation
                          </>
                        ) : (
                          <>
                            Pay And Confirm Your{" "}
                            {flightData[crrItenary]?.fareDifference?.totalFare
                              ? "Re-Issue"
                              : ""}{" "}
                            Ticket for Keep You Safe Side
                          </>
                        )}
                      </Typography>
                    }
                  />
                  <Typography
                    sx={{
                      color: "var(--secondary-color)",
                      fontSize: {
                        xs: "0.8rem",
                        lg: "0.85rem",
                      },
                      lineHeight: {
                        xs: "1rem",
                        lg: "2rem",
                      },
                      fontWeight: "500",
                      pl: "25px",
                      mt: {
                        xs: 0,
                        lg: "-12px",
                      },
                    }}
                  >
                    For your security and peace of mind, please proceed to pay
                    and confirm your ticket.
                  </Typography>
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>

          {parentType === "confirm" && (
            <Box sx={{ px: "12px", pt: "3px" }}>
              <Box sx={{ pl: "30px" }}>
                <FormControl>
                  <RadioGroup
                    value={payType}
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    <FormControlLabel
                      control={<Radio value="fullPay" />}
                      onChange={(e) => {
                        setPayType(e.target.value);
                        dispatch(setPartialData(null));
                      }}
                      disabled={parentType !== "confirm"}
                      label={
                        <span style={{ color: "#8F8F98" }}>
                          {flightData[crrItenary]?.fareDifference?.totalFare
                            ? "Will Be Decided"
                            : "Pay Full Amount"}
                        </span>
                      }
                    />

                    {oldFlightData?.partialPayment &&
                      oldFlightData?.isRefundable === "Partially Refundable" &&
                      !oldFlightData?.immediateIssue &&
                      partialChargeData && (
                        <>
                          <FormControlLabel
                            onChange={(e) => {
                              setPayType(e.target.value);
                              dispatch(setPartialData(partialChargeData));
                            }}
                            control={<Radio value="partialPay" />}
                            disabled={parentType !== "confirm"}
                            label={
                              <span
                                style={{
                                  color: "#8F8F98",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                Pay Partially
                              </span>
                            }
                          />
                        </>
                      )}
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          )}

          {parentType !== "hold" && (
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                borderRadius: "3px",
                py: 2,
                px: 2,
                display:
                  String(
                    flightData[crrItenary]?.fareDifference?.totalFare
                      ?.reIssuePayable
                  ).toLowerCase() === "will be decided" && "none",
              }}
            >
              <Grid
                container
                xs={12}
                sx={{
                  borderBottom: "1px solid #dadce0",
                  borderTop: "1px solid #dadce0",
                }}
              >
                <Grid
                  item
                  md={2.8}
                  sx={{
                    py: "10px",
                    pl: "15px",
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#3C4258",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Select
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={4.2}
                  xs={0}
                  sx={{
                    p: "10px",
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#3C4258",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Gateway Name
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={3}
                  xs={0}
                  sx={{
                    p: "10px",
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#3C4258",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Gateway Fee
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={2}
                  xs={0}
                  sx={{
                    p: "10px 5px 10px 10px",
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#3C4258",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Payable Amount
                  </Typography>
                </Grid>
              </Grid>
              {Array.from({ length: 1 }).map((_, index) => (
                <Grid
                  key={index}
                  container
                  item
                  xs={12}
                  sx={{ borderBottom: "1px solid #dadce0" }}
                >
                  <Grid
                    item
                    md={2.8}
                    sx={{
                      py: "10px",
                      pl: "15px",

                      display: {
                        xs: "none",
                        md: "block",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FormControl>
                        <RadioGroup
                          sx={{ display: "flex", flexDirection: "row" }}
                          defaultValue="female"
                        >
                          <FormControlLabel
                            value="female"
                            control={<Radio defaultChecked />}
                          />
                        </RadioGroup>
                      </FormControl>
                      <Box
                        sx={{
                          width:
                            index === 0
                              ? "50px"
                              : index === 1
                                ? "80px"
                                : index === 2
                                  ? "80px"
                                  : index === 3
                                    ? "70px"
                                    : "70px",
                          height:
                            index === 0
                              ? "50px"
                              : index === 1
                                ? "60px"
                                : index === 2
                                  ? "37px"
                                  : index === 3
                                    ? "70px"
                                    : "70px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          alt="payment logo"
                          src={
                            index === 0
                              ? wallet
                              : index === 1
                                ? `https://cdn.worldvectorlogo.com/logos/bkash.svg`
                                : index === 2
                                  ? `https://seeklogo.com/images/N/nagad-logo-AA1B37DF1B-seeklogo.com.png`
                                  : index === 3
                                    ? `https://zeevector.com/wp-content/uploads/Master-Card-and-Visa-Logo-Vector.png`
                                    : `https://w7.pngwing.com/pngs/58/14/png-transparent-amex-card-credit-logo-logos-logos-and-brands-icon.png`
                          }
                          style={{
                            width: "80px",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={4.2}
                    xs={4}
                    sx={{
                      p: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#3C4258",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {index === 0
                        ? isMobile
                          ? "FFI Wallet"
                          : "Fly Far International Wallet"
                        : index === 1
                          ? "Bkash"
                          : index === 2
                            ? "Nagad"
                            : index === 3
                              ? "Visa & Master Card"
                              : "American Express"}
                    </Typography>
                    <Box
                      sx={{
                        display: index === 0 ? "flex" : "none",
                        alignItems: "center",
                        gap: { xs: "0px", md: "20px" },
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#788694",
                            fontSize: "12px",
                            fontWeight: "500",
                            display: index === 0 ? "block" : "none",
                          }}
                        >
                          Available Balance
                        </Typography>
                        <Typography
                          sx={{
                            color:
                              flightData[crrItenary]?.agentPrice >
                              balanceData?.balance
                                ? "var(--primary-color)"
                                : "green",
                            fontSize: "13px",
                            fontWeight: "500",
                            pt: "2px",
                          }}
                        >
                          {balanceData?.balance?.toLocaleString("en-IN")}৳
                        </Typography>
                      </Box>
                      <Link
                        to={`/dashboard/add-Deposit/${agentCms?.cashDeposit?.eligible ? "cash" : agentCms?.bankTransferDeposit?.eligible ? "bank transfer" : agentCms?.bankDeposit?.eligible ? "bank deposit" : agentCms?.chequeDeposit?.eligible ? "cheque deposit" : ""}`}
                      >
                        <Tooltip title="Add Deposit">
                          <AddCircleIcon
                            sx={{
                              color: "var(--primary-color)",
                              fontSize: "20px",
                            }}
                          />
                        </Tooltip>
                      </Link>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={3}
                    sx={{
                      p: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#3C4258",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      {index === 0
                        ? "0 %"
                        : index === 1
                          ? "1.2 %"
                          : index === 2
                            ? "1.4 %"
                            : index === 3
                              ? "2 %"
                              : "2.1 %"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={2}
                    xs={3}
                    sx={{
                      p: "10px 5px 10px 10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#3C4258",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      {flightAfterSearch === "reissue-search"
                        ? flightData[crrItenary]?.autoReissue === true
                          ? `${flightData[crrItenary]?.fareDifference?.totalFareDifference?.reIssuePayable?.toLocaleString("en-IN")} ৳`
                          : "Will Be Decided"
                        : payType === "partialPay" && partialChargeData
                          ? `${partialChargeData?.amount?.toLocaleString("en-IN")} ৳`
                          : `${flightData[crrItenary]?.agentPrice?.toLocaleString("en-IN")} ৳`}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={0}
                    xs={2}
                    sx={{
                      width: "100%",
                      display: {
                        xs: "flex",
                        md: "none",
                      },
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <RadioGroup defaultValue="fflWallet">
                        <FormControlLabel
                          value="fflWallet"
                          control={<Radio defaultChecked />}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}

          <Box pt={5}>
            {((flightAfterSearch === "reissue-search" &&
              flightData[crrItenary]?.autoReissue === true) ||
              flightAfterSearch !== "reissue-search") && (
              <Box
                sx={{ px: "16px", display: parentType === "hold" && "none" }}
              >
                <FormControlLabel
                  control={<Checkbox checked={true} />}
                  label={
                    <Typography
                      sx={{
                        color: "#8F8F98",
                        fontSize: "13px",
                        fontWeight: "500",
                        pt: { xs: "8px", lg: "2px" },
                      }}
                    >
                      I Agree to Pay{" "}
                      <span style={{ color: "var(--primary-color)" }}>
                        {numberToWords(
                          (payType === "partialPay" && partialChargeData
                            ? partialChargeData?.amount
                            : flightData[crrItenary]?.agentPrice
                          )
                            ?.toLocaleString("en-IN")
                            .replace(/,/g, "")
                        )}
                      </span>{" "}
                      BDT Only to complete the payment.
                    </Typography>
                  }
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "var(--secondary-color)",
                    },
                    mt: 2,
                  }}
                />
              </Box>
            )}

            <Box px={2} pb={2}>
              <FormGroup sx={{ mb: 1 }}>
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
                          lg: "2px",
                        },
                      }}
                    >
                      By Completing this Ticket Request Agree with Fly Far
                      International{" "}
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
              <Button
                disabled={!isAccept || isLoading || isAirPriceLoading}
                sx={{
                  ...nextStepStyle,
                  ":hover": {
                    bgcolor: "var(--primary-color)",
                  },
                }}
                onClick={() => {
                  if (flightAfterSearch === "reissue-search") {
                    handleBookingSubmit();
                  } else {
                    checkPassengerDocs();
                  }
                }}
              >
                {isLoading
                  ? "Loading..."
                  : "CLICK TO CONFIRM & HOLD THIS FLIGHT"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <PassengerDocsModal
        open={open}
        passengerDetails={passengerDetails.filter(
          (_, index) =>
            !(
              flightData[crrItenary]?.journeyType === "Inbound" &&
              flattenedPassengerData[index]?.passportNation?.code === "BD"
            )
        )}
        passengers={flattenedPassengerData.filter(
          (passenger) =>
            !(
              flightData[crrItenary]?.journeyType === "Inbound" &&
              passenger?.passportNation?.code === "BD"
            )
        )}
        passportImageCmsShow={passportImageCmsShow}
        visaImageCmsShow={visaImageCmsShow}
        handleClose={handleClose}
        index={index}
        setIndex={setIndex}
        remainingPassengers={remainingPassengers}
        setRemainingPassengers={setRemainingPassengers}
        passenger={passenger}
        setPassenger={setPassenger}
      />

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { width: { md: "50%", xs: "100%" } } }}
      >
        <BookingOtp
          otpFields={otpFields}
          setOtpFields={setOtpFields}
          handleSubmit={handleBookingSubmit}
          handleSendBookingOtp={handleSendBookingOtp}
          operationType={null}
          createdAt={createdAt}
          setIsDrawerOpen={setIsDrawerOpen}
          title={"Booking Operation"}
        />
      </Drawer>

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

      {churnData && Object.keys(churnData).length > 0 && (
        <ChurnBookingModal
          open={churnModal}
          onClose={() => setChurnModal(false)}
          churnData={churnData}
          flightAfterSearch={flightAfterSearch}
          handleBookingSubmit={handleBookingSubmit}
          checkPassengerDocs={checkPassengerDocs}
          onCancel={handleCancelChurn}
          // setUserChurnAllowance={setUserChurnAllowance}
          setChurnModal={setChurnModal}
        />
      )}
    </>
  );
};

export default PaymentInformation;
