import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Drawer,
  FormGroup,
  Grid,
  Modal,
  Stack,
  ThemeProvider,
  Tooltip,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Zoom,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import PriceBreakdown, {
  TicketStatus,
} from "../../../component/AirBooking/PriceBreakdown";
import { setPartialData } from "../../../component/AirBooking/airbookingSlice";
import CustomAlert from "../../../component/Alert/CustomAlert";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";
import CustomToast from "../../../component/Alert/CustomToast";
import ImmediateTimeLimit from "../../../component/Alert/ImmediateTimeLimit";
import RequiredIndicator from "../../../component/Common/RequiredIndicator";
import ServerError from "../../../component/Error/ServerError";
import TimeCountDown from "../../../component/FlightAfterSearch/components/TimeCountDown";
import PendingLoader from "../../../component/Loader/PendingLoader";
import SmallLoadingSpinner from "../../../component/Loader/SmallLoadingSpinner";
import NotFound from "../../../component/NotFound/NoFound";
import BookingDetailsSkeleton from "../../../component/SkeletonLoader/BookingDetailsSkeleton";
import FilterSkeleton from "../../../component/SkeletonLoader/FilterSkeleton";
import { TicketStatusSkeleton } from "../../../component/SkeletonLoader/TicketStatusSkeleton";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import wallet from "../../../images/logo/logoblack.png";
import { isMobile } from "../../../shared/StaticData/Responsive";
import PageTitle from "../../../shared/common/PageTitle";
import { BpCheckedIcon, BpIcon } from "../../../shared/common/styles";
import { nextStepStyle } from "../../../style/style";
import { theme } from "../../../utils/theme";
import BookingHeader from "../components/BookingHeader";
import MobilePassengerCard from "../components/MobilePassengerCard";
import QueueHeader from "../components/QueueHeader";
import FileUploadModal from "./FileUploadModal";
import PartialPaid from "./PartialPaid";
import { numberToWords } from "../../../shared/common/functions";
import BookingOtp from "../../../component/AirBooking/BookingOtp";
import InfoIcon from "@mui/icons-material/Info";
import { CustomFlightTooltip } from "../../../component/FlightAfterSearch/SingleFlightCard";
import GatewayFee from "../../../component/GatewayFee/GatewayFee";

const IssueDetails = () => {
  const [index, setIndex] = useState();
  const { state } = useLocation();
  const { agentData } = useOutletContext();
  const [open, setOpen] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
  const selectImage = null;
  const [PayFull, setPayFull] = useState(true);
  const [partial, setPartial] = useState(false);
  const [dueTime, setDueTime] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [operationType, setOperationType] = useState("fullPayBooking");
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const passportImageCmsShow =
    agentData?.agentCms?.eligibilityCms?.passportRequiredForBooking;
  const visaImageCmsShow =
    agentData?.agentCms?.eligibilityCms?.visaRequiredForBooking;
  const isSedingOtp = agentData?.otpSwitch?.airTicket?.issueRequest;
  const agentCms = agentData?.agentCms?.eligibleRangeCms ?? {};

  const { retriveData, passengers, bookingId, flightIssue, partialChargeData } =
    state;
  const [priceBreakdown, setPriceBreakdown] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [type, setType] = useState("Booking Issue Request");
  const { jsonHeader } = useAuth();
  const allSelectedRef = useRef(allSelected);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { partialData } = useSelector((state) => state.flightBooking);
  const [passengerDocuments, setPassengerDocuments] = useState([]);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [otpKey, setOtpKey] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [visaRequired, setVisaRequired] = useState([]);
  const [isVisaReqLoading, setIsVisaReqLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const {
    data: singleBookingData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["singleBookingData", bookingId],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/retrieve`,
        {
          bookingId: bookingId,
        },
        jsonHeader()
      );
      return data;
    },
  });

  const { data: paymentData } = useQuery({
    queryKey: ["bkash-payment/get-payment-switch", bookingId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/bkash-payment/get-payment-switch`,

        jsonHeader()
      );
      return data?.data.filter(
        (item) => !item.name?.toLowerCase().includes("deposit")
      );
    },
  });

  // console.log(paymentData);

  // Passport Nation
  const paxData = Object.entries(
    singleBookingData?.data?.details?.passengerInformation || {}
  ).flatMap(([type, list]) => list.map((p) => ({ ...p, paxType: type })));

  const uniquePassportNations = [
    ...new Set(paxData.map((p) => p.passportNation).filter(Boolean)),
  ].map((nation) => ({ passportNation: nation }));

  const arrivalCountryCode =
    singleBookingData?.data?.details?.route?.at(-1)?.arrivalAirport
      ?.countryCode;

  useEffect(() => {
    if (!uniquePassportNations?.length || !arrivalCountryCode) return;

    const fetchVisaRequirements = async () => {
      try {
        setIsVisaReqLoading(true);
        const responses = await Promise.all(
          uniquePassportNations.map(async (nationObj) => {
            const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/visa-required/${nationObj.passportNation}/${arrivalCountryCode}`;
            const response = await axios.get(url, jsonHeader());
            return response.data?.data;
          })
        );

        const filteredResponses = responses.filter(Boolean);
        setVisaRequired(filteredResponses);
      } catch (error) {
        console.error("Error fetching visa requirements:", error);
      } finally {
        setIsVisaReqLoading(false);
      }
    };

    fetchVisaRequirements();
  }, [uniquePassportNations?.length, arrivalCountryCode]);

  //TODO:: Fetching data from api
  const { data: balanceData } = useQuery({
    queryKey: ["balanceData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/ledger/balance`,
        jsonHeader()
      );
      return data?.data;
    },
  });

  // TODO: Fetching partial get data for api
  const { mutate, status } = useMutation({
    mutationFn: ({ bookingId, otpKey, otp }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/partial-payment/due-date`,
        {
          bookingId,
          ...(otpKey && otp ? { otpKey, otp } : {}),
        },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success && data?.data?.data[0]?.dueDate) {
        const nowTime = new Date();
        const endTime = new Date(data?.data?.data[0]?.dueDate);
        if (nowTime > endTime) {
          showToast(
            "warning",
            "Partial payment due date is over.Please settle the full payment to continue"
          );
          setPayFull(true);
          setPartial(false);
          setDueTime(true);
          setIsAccept(false);
        } else {
          dispatch(setPartialData(data?.data?.data?.[0]));
        }
      }
    },
    onSettled: () => {
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

  const { mutate: partialMutate, status: partialPayStatus } = useMutation({
    mutationFn: ({ bookingId, otpKey, otp }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/partial-payment`,
        {
          bookingId,
          ...(otpKey && otp ? { otpKey, otp } : {}),
        },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        setIsAccept(false);
        showToast("success", data?.data?.message, () => {
          navigate(`/dashboard/booking/airtickets/all`);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["bookingData"]);
      setIsDrawerOpen(false);
    },
    onError: (err) => {
      if (err?.response) {
        const errorMessage = err.response.data.message || "An error occurred";
        showToast("error", errorMessage);
      } else if (err?.request) {
        showToast("error", err?.message);
      } else {
        showToast("error", "An unexpected error occurred.");
      }
    },
  });

  const { mutate: partialDueMutate, status: partialDueStatus } = useMutation({
    mutationFn: ({ id, otpKey, otp }) =>
      axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/partial-payment`,
        {
          id,
          ...(otpKey && otp ? { otpKey, otp } : {}),
        },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        setIsAccept(false);
        showToast("success", data?.data?.message, () => {
          navigate(`/dashboard/booking/airtickets/all`);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["bookingData"]);
      setIsDrawerOpen(false);
    },
    onError: (err) => {
      if (err.response) {
        const errorMessage = err.response.data.message || "An error occurred";
        showToast("error", errorMessage);
      } else if (err?.request) {
        showToast("error", err?.message);
      } else {
        showToast("error", "An unexpected error occurred.");
      }
    },
  });

  const { mutate: fullPayMutate, status: fullPayStatus } = useMutation({
    mutationFn: ({ bookingId, otpKey, otp }) => {
      const isAutoIssue = retriveData?.details?.autoOperation?.autoIssue;
      const endpoint = isAutoIssue
        ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/auto/ticket`
        : `${process.env.REACT_APP_BASE_URL}/api/v1/user/payment`;

      return axios.post(
        endpoint,
        {
          bookingId,
          ...(otpKey && otp ? { otpKey, otp } : {}),
        },
        jsonHeader()
      );
    },
    onSuccess: (data) => {
      if (data?.data?.success) {
        setIsAccept(false);
        showToast("success", data?.data?.message, () => {
          navigate(`/payment-successfully`, {
            state: {
              bookingId: retriveData?.id,
              redirectUrl: `/dashboard/booking/airtickets/all`,
            },
          });
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["bookingData"]);
      setIsDrawerOpen(false);
    },
    onError: (err) => {
      if (err.response) {
        const errorMessage = err.response.data.message || "An error occurred";
        showToast("error", errorMessage);
      } else if (err?.request) {
        showToast("error", err?.message);
      } else {
        showToast("error", "An unexpected error occurred.");
      }
    },
  });

  const { mutate: bkashPaymentMutate, status: bkashPaymentMutateStatus } =
    useMutation({
      mutationFn: ({ bookingId }) => {
        const body = {
          bookingId,
          amount: "0",
          name: "bkash",
          type: "payment",
        };
        // console.log(body);

        const endpoint = `${process.env.REACT_APP_BASE_URL}/api/v1/user/bkash-payment/create`;
        return axios.post(endpoint, body, jsonHeader());
      },
      onSuccess: (data) => {
        // console.log(data);
        if (data?.data?.success) {
          window.open(data?.data?.data?.bkashURL, "_blank");
        }
      },
      onError: (err) => {
        if (err.response) {
          const errorMessage = err.response.data.message || "An error occurred";
          showToast("error", errorMessage);
        } else if (err?.request) {
          showToast("error", err?.message);
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
        setIsAccept(false);
        const firstDataId = data?.data?.data?.id;

        CustomAlert({
          success: true,
          message:
            "Passenger Split Successfully. We are pleased to inform you that the passenger split process has been successfully completed. The requested passengers have been separated into a new booking, ensuring a seamless and hassle-free experience for both parties.",
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
        onClose: () =>
          navigate(`/dashboard/booking/airtickets/all/${bookingId}`),
      });
    },
  });

  useEffect(() => {
    if (!allSelectedRef.current) {
      handleSelectAllRef.current();
    }
  }, []);

  const getFilteredPassengers = (retriveData, flattenedPassengers) => {
    const matchingRelations = retriveData?.relation || [];

    const relationsMap = new Map();

    matchingRelations.forEach((relation) => {
      if (
        relationsMap.has(relation.passengerId) &&
        relationsMap.get(relation.passengerId).indexNumber >
          relation.indexNumber
      ) {
        return;
      }

      relationsMap.set(relation.passengerId, {
        bookingId: relation.bookingId,
        status: relation.status,
        bookingAttribId: relation.bookingAttribId,
        indexNumber: relation.indexNumber,
        createdAt: relation.createdAt,
      });
    });

    const mergedPassengers = flattenedPassengers.map((passenger) => {
      const relation = relationsMap.get(passenger.id);
      return {
        ...passenger,
        bookingId: relation?.bookingId || null,
        status: relation?.status || "N/A",
        bookingAttribId: relation?.bookingAttribId || "N/A",
        indexNumber: relation?.indexNumber || 0,
        createdAt: relation?.createdAt || null,
      };
    });

    return mergedPassengers.filter((passenger) => passenger.indexNumber <= 0);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedPassengers([]);
      setPriceBreakdown([]);
      setAllSelected(false);
    } else {
      const filteredPassengers = getFilteredPassengers(retriveData, passengers);
      const allIndexes = filteredPassengers?.map((_, index) => index);

      setSelectedPassengers(allIndexes);
      setAllSelected(true);

      const allPriceBreakdowns = passengers.map((passenger, index) => {
        const price = retriveData?.details?.priceBreakdown.at(index);

        return {
          ...passenger,
          index,
          baseFare: price?.baseFare ?? 0,
          tax: price?.tax ?? 0,
        };
      });

      setPriceBreakdown(allPriceBreakdowns);
    }
  };

  const handleSelectAllRef = useRef(handleSelectAll);

  const data = singleBookingData?.data || {};

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
  };

  const checkImagesAndNation = (data, journeyType) => {
    const isOutbound = journeyType?.toLowerCase() === "outbound";
    const isInbound = journeyType?.toLowerCase() === "inbound";

    if (isOutbound) {
      return true;
    }

    return data.some((passenger) => {
      const missingImages = !passenger.visaImage || !passenger.passportImage;
      const invalidNation =
        isInbound && passenger?.passportNation?.toLowerCase() !== "bd";

      return missingImages || invalidNation;
    });
  };

  useEffect(() => {
    if (passengers.length > 0 && singleBookingData?.data?.journeyType) {
      const result = checkImagesAndNation(
        passengers,
        singleBookingData.data.journeyType
      );
      setIsInvalid(result);
    }
  }, [passengers, singleBookingData, bookingId]);

  useEffect(() => {
    if (passengers?.length) {
      const extractedData = passengers
        .filter(
          (passenger) =>
            data?.journeyType?.toLowerCase() === "outbound" ||
            (data?.journeyType?.toLowerCase() === "inbound" &&
              passenger?.passportNation?.toLowerCase() !== "bd")
        )
        .map(({ id, passportNation, passportImage, visaImage }) => ({
          id,
          passportNation,
          passportImage,
          visaImage,
        }));

      setPassengerDocuments(extractedData);
    }
  }, [passengers, data?.journeyType]);

  const handlePartialBooking = async () => {
    setIsDrawerOpen(false);
    if (selectedPassengers?.length === 0) {
      showToast("warning", "Please select at least one passenger");
      return;
    }

    const bookingId = retriveData?.id;
    const payload = { bookingId };

    if (isSedingOtp && otpFields.every((field) => field) && otpKey) {
      payload.otpKey = otpKey;
      payload.otp = otpFields.join("");
    }

    mutate(payload);
  };

  const handlePartialPayBooking = async () => {
    if (selectedPassengers?.length === 0) {
      showToast("warning", "Please select at least one passenger");
      return;
    }

    if (!isInvalid) {
      showToast("warning", "Please upload your passport & visa copy");
      return;
    }

    const bookingId = retriveData?.id;

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to make a partial payment booking?",
    });

    if (result.isConfirmed) {
      setIsDrawerOpen(false);
      const payload = { bookingId };

      if (isSedingOtp && otpFields.every((field) => field) && otpKey) {
        payload.otpKey = otpKey;
        payload.otp = otpFields.join("");
      }

      partialMutate(payload);
    }
  };

  const handlePartialDuePayBooking = async () => {
    if (selectedPassengers?.length === 0) {
      showToast("warning", "Please select at least one passenger");
      return;
    }

    if (!isInvalid) {
      showToast("warning", "Please upload your passport & visa copy");
      return;
    }

    const id = retriveData?.partialPayment?.id;

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to Pay Due Amount for this booking?",
    });

    if (result.isConfirmed) {
      setIsDrawerOpen(false);
      const payload = { id };

      // Include OTP details if required
      if (isSedingOtp && otpFields.every((field) => field) && otpKey) {
        payload.otpKey = otpKey;
        payload.otp = otpFields.join("");
      }

      // Trigger partial due payment mutation
      partialDueMutate(payload);
    }
  };

  const handleFullPayBooking = async () => {
    if (selectedPassengers?.length === 0) {
      showToast("warning", "Please select at least one passenger");
      return;
    }

    if (!isInvalid) {
      showToast("warning", "Please upload your passport & visa copy");
      return;
    }

    const missingPassenger = passengerDocuments.find((passenger) => {
      const passportCheck = passportImageCmsShow && !passenger.passportImage;
      const visaCheck = visaImageCmsShow && !passenger.visaImage;
      return passportCheck || visaCheck;
    });

    if (missingPassenger) {
      const missingIndex = passengers.findIndex(
        (passenger) => passenger.id === missingPassenger.id
      );

      if (missingIndex !== -1) {
        setIndex(missingIndex);
        setFileOpen(true);
        return;
      }
    }

    const bookingId = retriveData?.id;

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to proceed payment for this booking?",
    });

    if (result.isConfirmed) {
      const payload = { bookingId };

      if (isSedingOtp && otpFields.every((field) => field) && otpKey) {
        payload.otpKey = otpKey;
        payload.otp = otpFields.join("");
      }

      if (paymentMethod === "bkash") {
        bkashPaymentMutate({ ...payload });
      } else {
        fullPayMutate(payload);
      }
    }
  };

  const handleSplitPassengersBooking = async () => {
    const bookingId = retriveData?.id;

    const filteredPassengers = getFilteredPassengers(retriveData, passengers);

    const selectedPassengersId = selectedPassengers
      .map((index) => filteredPassengers[index]?.id)
      .filter(Boolean);

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to split passengers for this booking?",
    });

    if (result.isConfirmed) {
      const payload = { bookingId, passengers: selectedPassengersId };

      if (isSedingOtp && otpFields.every((field) => field) && otpKey) {
        payload.otpKey = otpKey;
        payload.otp = otpFields.join("");
      }

      splitPayMutate(payload);
    }
  };

  const handleSendBookingOtp = async (type) => {
    setOperationType(type);

    if (isSedingOtp) {
      setIsOtpLoading(true);
      const api =
        type === "splitPassengersBooking"
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/otp/send-otp/split-passenger`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/otp/send-otp/issue-request`;

      const body = {
        bookingId: bookingId,
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
      if (type === "fullPayBooking") {
        handleFullPayBooking();
      } else if (type === "partialBooking") {
        handlePartialBooking();
      } else if (type === "partialPayBooking") {
        handlePartialPayBooking();
      } else if (type === "partialDueBooking") {
        handlePartialDuePayBooking();
      } else if (type === "splitPassengersBooking") {
        handleSplitPassengersBooking();
      }
    }
  };

  // Modal
  const handleClose = () => setOpen(false);

  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
    } else {
      setType(newTab);
    }
  };

  if (isLoading) {
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
          mt={2}
        >
          <Grid container spacing={2}>
            <Grid item xs={2.4}>
              <TicketStatusSkeleton />
              <FilterSkeleton />
            </Grid>
            <Grid item xs={9.6}>
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
          borderRadius: "3px",
        }}
      >
        <ServerError message={error?.response?.data?.message} />
      </Box>
    );
  }

  if (!singleBookingData) {
    return (
      <Box>
        <NotFound />
      </Box>
    );
  }

  if (splitPayStatus === "pending") {
    return <PendingLoader type={"split"} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mb: { xs: 6, lg: 0 } }}>
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
            lg={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "15px",
            }}
          >
            <Grid item xs={12} lg={2.4}>
              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <TicketStatus data={retriveData} />
                {/* {partialData && (
                  <TimeCountDown
                    label="Pay Partial Remaining Time"
                    timeLimit={partialData?.dueDate}
                  />
                )} */}

                {retriveData?.paymentStatus?.toLowerCase() ===
                  "partially paid" && (
                  <TimeCountDown
                    label="Partial Due Clear Time limit"
                    timeLimit={`${retriveData?.partialPayment?.dueDate}`}
                  />
                )}

                {retriveData?.fareTimeLimit || retriveData?.timeLimit
                  ? retriveData?.status?.toLowerCase() === "hold" && (
                      <TimeCountDown
                        label="Booking Expired at "
                        timeLimit={
                          retriveData?.fareTimeLimit == null
                            ? retriveData?.timeLimit
                            : retriveData?.timeLimit == null
                              ? retriveData?.fareTimeLimit
                              : retriveData?.fareTimeLimit >
                                  retriveData?.timeLimit
                                ? retriveData?.timeLimit
                                : retriveData?.fareTimeLimit
                        }
                      />
                    )
                  : retriveData?.status?.toLowerCase() === "hold" && (
                      <ImmediateTimeLimit label="Immediate Issue" />
                    )}
              </Box>

              <Box
                sx={{
                  display: {
                    xs: type === "Booking Issue Request" ? "block" : "none",
                    lg: "block",
                  },
                }}
              >
                <PriceBreakdown
                  type={"after"}
                  flightData={retriveData}
                  label={
                    retriveData?.paymentStatus === "partially paid"
                      ? "Total Payable Due Amount"
                      : "Total Payable Amount"
                  }
                  isNotEquals={passengers.length !== priceBreakdown.length}
                  isLoading={status === "pending"}
                />
              </Box>

              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                {retriveData?.status?.toLowerCase() === "hold" &&
                  retriveData?.details?.autoOperation?.partialPayment &&
                  retriveData?.isRefundable === "Partially Refundable" &&
                  !retriveData?.details?.autoOperation?.immediateIssue && (
                    <PartialPaid
                      partialChargeData={partialChargeData}
                      flightData={retriveData}
                    />
                  )}
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              lg={9.4}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: "4px",
                  py: { xs: 0, lg: 0 },
                }}
              >
                <Box sx={{ display: { xs: "none", lg: "block" } }}>
                  <PageTitle
                    title={
                      state?.paydue
                        ? "Booking Due Payment"
                        : `Booking Issue Request`
                    }
                  />
                </Box>
                <Grid
                  container
                  item
                  lg={12}
                  sx={{
                    bgcolor: "#fff",
                    p: "12px 15px",
                    display: { xs: "none", lg: "block" },
                  }}
                >
                  <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                    Passenger Information
                  </Typography>
                </Grid>

                {/* Table shown here */}
                <Box px={2} sx={{ display: { xs: "none", lg: "block" } }}>
                  <IssuePassengerTable
                    filteredPassengers={getFilteredPassengers(
                      retriveData,
                      passengers
                    )}
                    selectedPassengers={selectedPassengers}
                    flightIssue={flightIssue}
                    retriveData={retriveData}
                    priceBreakdown={priceBreakdown}
                    handleCheckboxChange={handleCheckboxChange}
                    passportImageCmsShow={passportImageCmsShow}
                    passengerDocuments={passengerDocuments}
                    data={data}
                    setFileOpen={setFileOpen}
                    setIndex={setIndex}
                    visaRequired={visaRequired}
                    visaImageCmsShow={visaImageCmsShow}
                    isVisaReqLoading={isVisaReqLoading}
                  />
                </Box>
                {/* --- passenger card for mobile start --- */}
                <Stack
                  spacing={2}
                  sx={{
                    pt: 2,
                    px: 2,
                    display: {
                      xs: type === "Booking Issue Request" ? "block" : "none",
                      lg: "none",
                    },
                  }}
                >
                  {passengers?.map((passenger, index) => {
                    const price = retriveData?.details?.priceBreakdown.find(
                      (item) => item.paxType === passenger.type
                    );

                    const showFileFields =
                      data?.journeyType?.toLowerCase() === "outbound" ||
                      (data?.journeyType?.toLowerCase() === "inbound" &&
                        passenger?.passportNation?.toLowerCase() !== "bd");

                    const showImage =
                      passenger?.visaImage || passenger?.passportImage;
                    return (
                      <MobilePassengerCard
                        key={index}
                        passenger={passenger}
                        price={price}
                        showFileFields={showFileFields}
                        showImage={showImage}
                        index={index}
                        selectedPassengers={selectedPassengers}
                        handleCheckboxChange={handleCheckboxChange}
                        retriveData={retriveData}
                        setIndex={setIndex}
                        flattenedPassengers={passengers}
                        setFileOpen={setFileOpen}
                      />
                    );
                  })}
                </Stack>
                {/* --- passenger card for mobile end --- */}
                <Box sx={{ mt: "15px" }}>
                  {passengers.length !== priceBreakdown.length && (
                    <AirlineChargeNotice />
                  )}
                </Box>

                {/* Payment options here */}
                <Box
                  sx={{
                    display: {
                      xs: type === "Payment Information" ? "block" : "none",
                      lg: "block",
                    },
                  }}
                >
                  {passengers.length === priceBreakdown.length && (
                    <>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "500",
                          pl: "15px",
                          mt: { xs: 0, lg: 3 },
                        }}
                      >
                        Payment Options
                      </Typography>
                      <Box
                        sx={{
                          pl: "31px",
                          mt: 1,
                          display: { xs: "block", lg: "flex" },
                          "& .Mui-checked": {
                            color: "var(--primary-color) !important",
                          },
                        }}
                      >
                        {state?.paydue && (
                          <FormControl>
                            <RadioGroup
                              sx={{ display: "flex", flexDirection: "row" }}
                            >
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={PayFull}
                                    onChange={() => {
                                      setPayFull(true);
                                      setPartial(false);
                                      setPartialData(null);
                                      dispatch(setPartialData(null));
                                    }}
                                  />
                                }
                                label={
                                  <span style={{ color: "#8F8F98" }}>
                                    Pay Due Amount
                                  </span>
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                        )}

                        {!state?.paydue && (
                          <FormControl>
                            <RadioGroup
                              sx={{ display: "flex", flexDirection: "row" }}
                            >
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={PayFull}
                                    onChange={() => {
                                      setPayFull(true);
                                      setPartial(false);
                                      setPartialData(null);
                                      dispatch(setPartialData(null));
                                    }}
                                  />
                                }
                                label={
                                  <span style={{ color: "#8F8F98" }}>
                                    Pay Full Amount
                                  </span>
                                }
                                disabled={status === "pending"}
                              />
                            </RadioGroup>
                          </FormControl>
                        )}

                        {flightIssue?.operations?.partialIssue &&
                          data?.details?.autoOperation &&
                          data?.details?.autoOperation?.partialPayment &&
                          partialChargeData && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <FormControl>
                                <RadioGroup
                                  sx={{ display: "flex", flexDirection: "row" }}
                                >
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={partial}
                                        onChange={() => {
                                          setPartial(true);
                                          setPayFull(false);
                                          handlePartialBooking();
                                        }}
                                      />
                                    }
                                    label={
                                      <span style={{ color: "#8F8F98" }}>
                                        Pay Partially
                                      </span>
                                    }
                                    disabled={dueTime || status === "pending"}
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Box>
                          )}
                      </Box>

                      {(retriveData?.status?.toLowerCase() === "hold" ||
                        retriveData?.status?.toLowerCase() === "ticketed" ||
                        retriveData?.status?.toLowerCase() ===
                          "issue in process") && (
                        <Box
                          sx={{
                            bgcolor: "#FFFFFF",
                            borderRadius: "3px",
                            p: 2,
                            pb: 0,
                          }}
                        >
                          <Grid
                            container
                            lg={12}
                            xs={12}
                            sx={{
                              borderBottom: { lg: "1px solid #dadce0" },
                              borderTop: { xs: "1px solid #dadce0" },
                            }}
                          >
                            <Grid
                              item
                              lg={2.8}
                              sx={{
                                py: "10px",
                                pl: "15px",
                                display: { xs: "none", lg: "block" },
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
                              lg={4.2}
                              xs={4}
                              sx={{
                                p: "10px",
                                display: { xs: "none", lg: "block" },
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
                              lg={3}
                              xs={4}
                              sx={{
                                p: "10px",
                                display: { xs: "none", lg: "block" },
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
                              lg={2}
                              xs={4}
                              sx={{
                                p: "10px 5px 10px 10px",
                                display: { xs: "none", lg: "block" },
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
                              lg={12}
                              xs={12}
                              sx={{ borderBottom: "1px solid #dadce0" }}
                            >
                              <Grid
                                item
                                xs={3.5}
                                lg={2.8}
                                sx={{ py: "10px", pl: { lg: "15px" } }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    "& .Mui-checked": {
                                      color: "var(--primary-color) !important",
                                    },
                                  }}
                                >
                                  <FormControl
                                    sx={{
                                      display: { xs: "none", lg: "block" },
                                    }}
                                  >
                                    <RadioGroup
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                      onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                      }}
                                    >
                                      <FormControlLabel
                                        value="wallet"
                                        control={
                                          <Radio
                                            checked={paymentMethod === "wallet"}
                                          />
                                        }
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
                                xs={7}
                                lg={4.2}
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
                                    fontWeight: 500,
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
                                    gap: { xs: "10px", lg: "20px" },
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
                                          (partialData?.payedAmount ||
                                            retriveData?.agentPrice) >
                                          balanceData?.balance
                                            ? "var(--primary-color)"
                                            : "green",

                                        fontSize: "13px",
                                        fontWeight: "500",
                                        pt: "2px",
                                      }}
                                    >
                                      {balanceData?.balance?.toLocaleString(
                                        "en-IN"
                                      )}
                                      ৳
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
                                lg={3}
                                xs={0}
                                sx={{
                                  p: "10px",
                                  display: { xs: "none", lg: "flex" },
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
                                lg={2}
                                xs={1}
                                sx={{
                                  p: "10px 5px 10px 10px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <FormControl
                                  sx={{ display: { xs: "block", lg: "none" } }}
                                >
                                  <RadioGroup
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    defaultValue="female"
                                  >
                                    <FormControlLabel
                                      value="female"
                                      control={<Radio defaultChecked />}
                                    />
                                  </RadioGroup>
                                </FormControl>
                                <Typography
                                  sx={{
                                    color: "#3C4258",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    display: { xs: "none", lg: "block" },
                                  }}
                                >
                                  {partialData
                                    ? partialData?.payedAmount?.toLocaleString(
                                        "en-IN"
                                      )
                                    : retriveData?.partialPayment &&
                                        retriveData?.paymentStatus?.toLowerCase() ===
                                          "partially paid"
                                      ? retriveData?.partialPayment?.dueAmount?.toLocaleString(
                                          "en-IN"
                                        )
                                      : retriveData?.agentPrice?.toLocaleString(
                                          "en-IN"
                                        )}{" "}
                                  ৳
                                </Typography>
                              </Grid>
                            </Grid>
                          ))}
                        </Box>
                      )}

                      {paymentData?.map((payment, i) => {
                        const paymentInfo =
                          payment?.subTypes.length > 0
                            ? payment?.subTypes?.find(
                                (item) => item.paymentNameType === "payment"
                              )
                            : {};

                        const payableAmount = partialData
                          ? partialData?.payedAmount
                          : retriveData?.partialPayment &&
                              retriveData?.paymentStatus?.toLowerCase() ===
                                "partially paid"
                            ? retriveData?.partialPayment?.dueAmount
                            : retriveData?.agentPrice;

                        const gatewayCharge =
                          payableAmount >= paymentInfo?.amount
                            ? paymentInfo?.maxGateWayCharge
                            : paymentInfo?.minGateWayCharge;

                        return (
                          <Box
                            key={i}
                            sx={{
                              bgcolor: "#FFFFFF",
                              borderRadius: "3px",
                              p: 2,
                              pt: 0,
                            }}
                          >
                            <Grid
                              key={index}
                              container
                              lg={12}
                              xs={12}
                              sx={{ borderBottom: "1px solid #dadce0" }}
                            >
                              <Grid
                                item
                                xs={3.5}
                                lg={2.8}
                                sx={{ py: "10px", pl: { lg: "15px" } }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    "& .Mui-checked": {
                                      color: "var(--primary-color) !important",
                                    },
                                  }}
                                >
                                  <FormControl
                                    sx={{
                                      display: { xs: "none", lg: "block" },
                                    }}
                                  >
                                    <RadioGroup
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                      onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                      }}
                                    >
                                      <FormControlLabel
                                        value={payment?.name}
                                        control={
                                          <Radio
                                            checked={
                                              paymentMethod === payment?.name
                                            }
                                          />
                                        }
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      alt="payment logo"
                                      src={payment?.logo}
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
                                xs={7}
                                lg={4.2}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  p: "10px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#3C4258",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {payment?.name}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                lg={3}
                                xs={0}
                                sx={{
                                  p: "10px",
                                  display: { xs: "none", lg: "flex" },
                                  alignItems: "center",
                                }}
                              >
                                <CustomFlightTooltip
                                  placement="bottom"
                                  TransitionComponent={Zoom}
                                  title={<GatewayFee data={paymentInfo} />}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        color: "#3C4258",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {gatewayCharge} %
                                    </Typography>

                                    <InfoIcon
                                      sx={{
                                        color: "var(--gray)",
                                        fontSize: "18px",
                                      }}
                                    />
                                  </Box>
                                </CustomFlightTooltip>
                              </Grid>
                              <Grid
                                item
                                lg={2}
                                xs={1}
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
                                    display: { xs: "none", lg: "block" },
                                  }}
                                >
                                  {Number(
                                    (
                                      payableAmount * (gatewayCharge / 100) +
                                        payableAmount || 0
                                    ).toFixed(2)
                                  )?.toLocaleString("en-IN")}{" "}
                                  ৳
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        );
                      })}
                    </>
                  )}
                </Box>

                {passengers.length === priceBreakdown.length && (
                  <Box
                    sx={{
                      padding: "40px 16px 0px 16px",
                      display:
                        (
                          partialData?.payedAmount ||
                          (retriveData?.partialPayment &&
                          retriveData?.paymentStatus?.toLowerCase() ===
                            "partially paid"
                            ? retriveData?.partialPayment?.dueAmount
                            : retriveData?.agentPrice)
                        )
                          ?.toLocaleString("en-IN")
                          .replace(/,/g, "") > 0
                          ? "block"
                          : "none",
                    }}
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
                              (
                                partialData?.payedAmount ||
                                (retriveData?.partialPayment &&
                                retriveData?.paymentStatus?.toLowerCase() ===
                                  "partially paid"
                                  ? retriveData?.partialPayment?.dueAmount
                                  : retriveData?.agentPrice)
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

                <Box
                  sx={{
                    p: "0px 16px 16px",
                    display: {
                      xs: type === "Payment Information" ? "block" : "none",
                      lg: "block",
                    },
                  }}
                >
                  <Box>
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
                              pt: { xs: "8px", lg: "2px" },
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
                    <Box sx={{ display: { xs: "none", lg: "block" } }}>
                      {partial ? (
                        <Button
                          disabled={!isAccept || partialPayStatus === "pending"}
                          sx={{
                            ...nextStepStyle,
                            ":hover": {
                              bgcolor: "var(--primary-color)",
                            },
                          }}
                          onClick={() =>
                            handleSendBookingOtp("partialPayBooking")
                          }
                        >
                          {partialPayStatus === "pending" ? (
                            <SmallLoadingSpinner />
                          ) : (
                            <Typography>
                              PROCEED PARTIAL PAYMENT TO COMPLETE THIS PURCHASE
                            </Typography>
                          )}
                        </Button>
                      ) : state?.paydue ? (
                        <Button
                          disabled={!isAccept || partialDueStatus === "pending"}
                          sx={{
                            ...nextStepStyle,
                            ":hover": {
                              bgcolor: "var(--primary-color)",
                            },
                          }}
                          onClick={() =>
                            handleSendBookingOtp("partialDueBooking")
                          }
                        >
                          {partialDueStatus === "pending" ? (
                            <SmallLoadingSpinner />
                          ) : (
                            <Typography>
                              PROCEED DUE PAYMENT TO COMPLETE THIS PURCHASE
                            </Typography>
                          )}
                        </Button>
                      ) : (
                        <Button
                          disabled={!isAccept || fullPayStatus === "pending"}
                          onClick={
                            passengers.length !== priceBreakdown.length
                              ? () =>
                                  handleSendBookingOtp("splitPassengersBooking")
                              : () => handleSendBookingOtp("fullPayBooking")
                          }
                          sx={{
                            ...nextStepStyle,
                            ":hover": {
                              bgcolor: "var(--primary-color)",
                            },
                          }}
                        >
                          {fullPayStatus === "pending" ? (
                            <SmallLoadingSpinner />
                          ) : (
                            <Typography>
                              {passengers.length !== priceBreakdown.length
                                ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                                : "PROCEED FULL PAYMENT TO COMPLETE THIS PURCHASE"}
                            </Typography>
                          )}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

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

        {fileOpen && (
          <FileUploadModal
            open={fileOpen}
            handleClose={() => setFileOpen(false)}
            passengers={passengers}
            passengerDocuments={passengerDocuments}
            setPassengerDocuments={setPassengerDocuments}
            index={index}
            setIndex={setIndex}
            passportImageCmsShow={passportImageCmsShow}
            visaImageCmsShow={visaImageCmsShow}
            journeyType={data?.journeyType}
          />
        )}

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
          {type === "Booking Issue Request" ? (
            <Button
              sx={buttonStyle}
              onClick={() => setType("Payment Information")}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  px: 9,
                }}
              >
                PROCEED PAYMENT TO COMPLETE THIS PURCHASE
              </Typography>
            </Button>
          ) : partial ? (
            <Button
              disabled={!isAccept}
              sx={buttonStyle}
              onClick={() => {
                handlePartialPayBooking();
              }}
            >
              {partialPayStatus === "pending" && (
                <CircularProgress size={20} style={{ color: "white" }} />
              )}
              <Typography
                sx={{
                  fontSize: "11px",
                  px: 9,
                }}
              >
                PROCEED PARTIAL PAYMENT TO COMPLETE THIS PURCHASE
              </Typography>
            </Button>
          ) : state?.paydue ? (
            <Button
              disabled={!isAccept}
              sx={buttonStyle}
              onClick={() => {
                handlePartialDuePayBooking();
              }}
            >
              {partialDueStatus === "pending" && (
                <CircularProgress size={20} style={{ color: "white" }} />
              )}
              <Typography
                sx={{
                  fontSize: "11px",
                  px: 9,
                }}
              >
                PROCEED DUE PAYMENT TO COMPLETE THIS PURCHASE
              </Typography>
            </Button>
          ) : (
            <Button
              disabled={!isAccept}
              onClick={() => {
                passengers.length !== priceBreakdown.length
                  ? handleSplitPassengersBooking()
                  : handleFullPayBooking();
              }}
              sx={buttonStyle}
            >
              {fullPayStatus === "pending" ? (
                <CircularProgress size={20} style={{ color: "white" }} />
              ) : (
                <Typography
                  sx={{
                    fontSize: "11px",
                    px: 9,
                  }}
                >
                  {passengers.length !== priceBreakdown.length
                    ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                    : "PROCEED FULL PAYMENT TO COMPLETE THIS PURCHASE"}
                </Typography>
              )}
            </Button>
          )}
        </Box>
        {/* --- mobile button end --- */}
      </Box>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      <CustomLoadingAlert
        open={
          fullPayStatus === "pending" ||
          splitPayStatus === "pending" ||
          partialPayStatus === "pending" ||
          partialDueStatus === "pending"
        }
        text={`We Are Processing Your ${partialDueStatus === "pending" ? "Due Clear" : partialPayStatus === "pending" ? "Partial Issue Ticket" : splitPayStatus === "pending" ? "Split Passenger" : "Issue Ticket"} Request`}
        // subTitle={" BDT"}
      />

      <CustomLoadingAlert
        open={isOtpLoading}
        text={"Sending OTP to your email, please wait..."}
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
          handleSubmit={() => {
            if (operationType === "fullPayBooking") {
              handleFullPayBooking();
            } else if (operationType === "partialBooking") {
              handlePartialBooking();
            } else if (operationType === "partialPayBooking") {
              handlePartialPayBooking();
            } else if (operationType === "partialDueBooking") {
              handlePartialDuePayBooking();
            } else if (operationType === "splitPassengersBooking") {
              handleSplitPassengersBooking();
            }
          }}
          handleSendBookingOtp={handleSendBookingOtp}
          operationType={operationType}
          createdAt={createdAt}
          setIsDrawerOpen={setIsDrawerOpen}
          title={"Issue Request Operation"}
        />
      </Drawer>
    </ThemeProvider>
  );
};

const IssuePassengerTable = ({
  filteredPassengers,
  selectedPassengers,
  flightIssue,
  retriveData,
  priceBreakdown,
  handleCheckboxChange,
  passportImageCmsShow,
  passengerDocuments,
  data,
  setFileOpen,
  setIndex,
  visaRequired,
  visaImageCmsShow,
  isVisaReqLoading,
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow sx={{ px: "10px", borderTop: "1px solid #dadce0" }}>
          {passengerTableHeader.map((head, i, arr) => (
            <TableCell
              key={i}
              align={arr.length - 1 === i ? "right" : "left"}
              sx={{ width: head?.width, paddingLeft: i === 0 && "10px" }}
            >
              {head?.title}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredPassengers.map((passenger, index, arr) => {
          const price = retriveData?.details?.priceBreakdown.find((item) => {
            return item.paxType === passenger.type;
          });

          const showFileFields =
            data?.journeyType?.toLowerCase() === "outbound" ||
            (data?.journeyType?.toLowerCase() === "inbound" &&
              passenger?.passportNation?.toLowerCase() !== "bd");

          return (
            <TableRow key={index}>
              <TableCell>
                <FormControlLabel
                  sx={{ pl: 2, width: "50px" }}
                  control={
                    <Checkbox
                      disableRipple
                      checked={selectedPassengers.includes(index)}
                      disabled={
                        !flightIssue?.operations?.splitIssue ||
                        (retriveData?.paymentStatus === "partially paid" &&
                          retriveData?.status === "ticketed") ||
                        (priceBreakdown?.length === 1 &&
                          priceBreakdown?.some((item) => item.index === index))
                      }
                      onChange={() =>
                        handleCheckboxChange(index, {
                          ...passenger,
                          baseFare: price?.baseFare,
                          tax: price?.tax,
                        })
                      }
                      checkedIcon={
                        <BpCheckedIcon
                          color={"white"}
                          bgColor={
                            arr.length > 1 ? "var(--primary-color)" : "#ccc"
                          }
                          boxShadowColor={
                            arr.length > 1 ? "var(--primary-color)" : "#ccc"
                          }
                        />
                      }
                      icon={<BpIcon color={"white"} />}
                    />
                  }
                />
              </TableCell>

              <TableCell>
                {passenger?.prefix} {passenger?.firstName} {passenger?.lastName}
              </TableCell>
              <TableCell>
                {passenger?.type === "CNN" ? (
                  <>
                    {passenger?.type}{" "}
                    <span style={{ color: "var(--primary-color)" }}>
                      [{passenger.age} yrs]
                    </span>
                  </>
                ) : (
                  passenger.type
                )}
              </TableCell>

              <TableCell>
                {moment(passenger.dateOfBirth).format("DD MMM, YYYY")}
              </TableCell>

              <TableCell>{passenger?.passportNation ?? "N/A"}</TableCell>

              <TableCell>
                <Box key={index}>
                  {passportImageCmsShow ? (
                    showFileFields &&
                    !passengerDocuments.find((doc) => doc.id === passenger?.id)
                      ?.passportImage ? (
                      <>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setFileOpen(true);
                            setIndex(index);
                          }}
                        >
                          Upload
                        </Typography>
                      </>
                    ) : (
                      <Box
                        sx={{
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setFileOpen(true);
                          setIndex(index);
                        }}
                      >
                        {passengerDocuments.find(
                          (doc) => doc.id === passenger?.id
                        )?.passportImage ? (
                          <img
                            src={
                              passengerDocuments.find(
                                (doc) => doc.id === passenger?.id
                              )?.passportImage
                            }
                            alt="Passport"
                            style={{
                              width: "50px",
                              height: "30px",
                              borderRadius: "3px",
                            }}
                          />
                        ) : (
                          <Typography sx={{ fontSize: "12px", color: "gray" }}>
                            N/A
                          </Typography>
                        )}
                      </Box>
                    )
                  ) : (
                    <Typography sx={{ fontSize: "12px", color: "gray" }}>
                      N/A
                    </Typography>
                  )}
                </Box>
              </TableCell>

              <TableCell>
                {isVisaReqLoading ? (
                  <Skeleton sx={{ width: `50%`, height: "15px" }} />
                ) : (
                  <Box key={index + "-visa"}>
                    <Tooltip
                      title={`${
                        visaRequired.find(
                          (item) =>
                            item.passport_code === passenger?.passportNation
                        )?.message || ""
                      }`}
                      placement="bottom-start"
                    >
                      {showFileFields ? (
                        <Box
                          sx={{
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setFileOpen(true);
                            setIndex(index);
                          }}
                        >
                          {passengerDocuments.find(
                            (doc) => doc.id === passenger?.id
                          )?.visaImage && (
                            <img
                              src={
                                passengerDocuments.find(
                                  (doc) => doc.id === passenger?.id
                                )?.visaImage
                              }
                              alt="Visa"
                              style={{
                                width: "70px",
                                height: "50px",
                                borderRadius: "3px",
                              }}
                            />
                          )}
                        </Box>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            cursor: "pointer",
                            textTransform: "capitalize",
                            color: "gray",
                          }}
                        >
                          {visaRequired.find(
                            (item) =>
                              item.passport_code === passenger?.passportNation
                          )?.visa || "N/A"}
                        </Typography>
                      )}

                      {visaImageCmsShow &&
                        !showFileFields &&
                        retriveData?.journeyType !== "Inbound" && (
                          <Typography
                            sx={{
                              fontSize: "12px",
                              cursor: "pointer",
                              width: "fit-content",
                              fontWeight: "600",
                              textDecoration: "underline",
                              textUnderlineOffset: "5px",
                              color: "var(--primary-color)",
                            }}
                            onClick={() => {
                              setFileOpen(true);
                              setIndex(index);
                            }}
                          >
                            Upload
                          </Typography>
                        )}
                    </Tooltip>
                  </Box>
                )}
              </TableCell>

              <TableCell>
                {price
                  ? `${price?.baseFare?.toLocaleString("en-IN")} ৳`
                  : "N/A"}
              </TableCell>

              <TableCell>
                {price
                  ? `${price?.finalTax?.toLocaleString("en-IN")} ৳`
                  : "N/A"}
              </TableCell>

              <TableCell
                sx={{ textTransform: "uppercase", textAlign: "right" }}
              >
                {retriveData?.paymentStatus}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
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

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  width: "550px",
  height: "400px",
  cellHead: {
    color: "black",
    py: "4.8px",
    pl: 1.5,
    fontSize: "13px",
    border: "1px solid #F8F8F8",
  },
};

const buttonStyle = {
  bgcolor: "var(--primary-color)",
  ":hover": { bgcolor: "var(--primary-color)" },
  color: "#FFFFFF",
  width: "100%",
  borderRadius: "15px 15px 0px 0px",
  py: { xs: 2 },
};

const tabs = [
  {
    label: "Booking Issue Request",
    value: "Booking Issue Request",
  },
  {
    label: "Payment Information",
    value: "Payment Information",
  },
];

const passengerTableHeader = [
  { title: "Select", width: "7%" },
  { title: "Name", width: "16%" },
  { title: "Pax", width: "6%" },
  { title: "DOB", width: "10%" },
  { title: "Nationality", width: "8%" },
  { title: "Passport", width: "12%" },
  { title: "Visa", width: "17%" },
  { title: "Base Fare", width: "7%" },
  { title: "Tax", width: "7%" },
  { title: "Payment Status", width: "10%" },
];

export default IssueDetails;
