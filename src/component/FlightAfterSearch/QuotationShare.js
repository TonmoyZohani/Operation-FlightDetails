import EmailIcon from "@mui/icons-material/Email";
import ForwardIcon from "@mui/icons-material/Forward";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  Tooltip,
} from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useLocation, useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import CustomAlert from "../Alert/CustomAlert";
import CustomToast from "../Alert/CustomToast";
import SmallLoadingSpinner from "../Loader/SmallLoadingSpinner";
import PDFPageDesign from "../PDFPageDesign/PDFPageDesign";
import { primaryBtn, registrationErrText } from "./../../shared/common/styles";
import * as Yup from "yup";
import {
  convertCamelToTitle,
  emailValidation,
  phoneValidation,
} from "../../shared/common/functions";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useWindowSize from "../../shared/common/useWindowSize";
import { DownloadLinkItem } from "../../pages/Bookings/components/PdfCard";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const QuotationShare = ({
  flightData,
  type,
  bookingData = {},
  bookingType = "",
  serviceChargeData = [],
}) => {
  const [skipMarkup, setSkipMarkup] = useState(false);
  const { isMobile, isMedium, isLarge } = useWindowSize();
  const [paxMarkup, setPaxMarkup] = useState(
    flightData?.priceBreakdown?.map((pax) => {
      return {
        paxType: pax?.paxType,
        paxCount: pax?.paxCount,
        markupAmount: "",
        totalMarkup: 0,
      };
    })
  );

  const [agentPrice, setAgentPrice] = useState(
    bookingData?.paymentStatus === "partially paid"
      ? bookingData?.partialPayment?.totalPayedAmount
      : bookingData?.agentPrice || 0
  );
  const [airlineCharge, setAirlineCharge] = useState(0);

  useEffect(() => {
    if (bookingData?.details && bookingType !== "void") {
      const structure = bookingData?.details?.structure;
      const beforeRefundCharge = structure
        ?.filter(
          (item) => item?.name?.toLowerCase() === "refund before departure"
        )
        .sort((a, b) => b?.convertedAmount - a?.convertedAmount);

      const afterRefundCharge = structure
        ?.filter(
          (item) => item?.name?.toLowerCase() === "refund after departure"
        )
        .sort((a, b) => b?.convertedAmount - a?.convertedAmount);

      const airlinesDate = flightData?.route?.[0]?.departureDate;
      const today = new Date().toISOString().split("T")[0];

      if (today < airlinesDate) {
        setAirlineCharge(
          beforeRefundCharge?.length > 0
            ? beforeRefundCharge?.at(0)?.convertedAmount
            : 0
        );
      } else {
        setAirlineCharge(
          afterRefundCharge?.length > 0
            ? afterRefundCharge?.at(0)?.convertedAmount
            : 0
        );
      }
    }
  }, []);

  const totalServiceCharge =
    serviceChargeData?.length > 0
      ? serviceChargeData.reduce((total, charge) => {
          const paxCount =
            paxMarkup.find((item) => item?.paxType === charge?.paxType)
              ?.paxCount || 0;

          return total + charge?.serviceCharge * paxCount;
        }, 0)
      : 0;

  // console.log(type);

  // const handleSkipMarkup = () => {
  //   setSkipMarkup((prev) => !prev);
  // };

  // console.log(flightData);

  return (
    <Box
      sx={{
        px: { xs: "5px", lg: "18px" },
        py: isMobile ? 1 : 2,
        borderTop: "1px solid #E9E9E9",
        borderBottom: "1px solid #E9E9E9",
        input: {
          border: "none",
          borderBottom: "1px solid #E9E9E9",
          outline: "none",
        },
        "input::placeholder": {
          color: "var(--light-gray)",
          fontWeight: "400",
          fontSize: "14px",
        },
      }}
    >
      <Box>
        <Grid container spacing={1} columnSpacing={2.5}>
          <Grid item md={5.3}>
            {/* <Grid item md={type === "aftersearch" ? 5.3 : 0}> */}
            {/* {type === "aftersearch" && ( */}
            <MakeQuotation
              flightData={{ ...flightData, ...bookingData }}
              paxMarkup={paxMarkup}
              setPaxMarkup={setPaxMarkup}
              title={
                "Make Quotation" + (bookingType ? ` For ${bookingType}` : "")
              }
              bookingType={bookingType}
              serviceChargeData={serviceChargeData}
              agentPrice={agentPrice}
              setAgentPrice={setAgentPrice}
              airlineCharge={airlineCharge}
              setAirlineCharge={setAirlineCharge}
              type={type}
            />
            {/* )} */}
          </Grid>

          <Grid item md={6.7}>
            {/* <Grid item md={type === "aftersearch" ? 6.7 : 12}> */}
            <ShareMessage
              flightData={flightData}
              paxMarkup={paxMarkup}
              type={type}
              bookingData={bookingData}
              agentPrice={agentPrice}
              airlineCharge={airlineCharge}
              totalServiceCharge={totalServiceCharge}
              bookingType={bookingType}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export const MakeQuotation = ({
  flightData,
  paxMarkup,
  setPaxMarkup,
  title,
  bookingId,
  setOpen,
  typeMarkup,
  setShowDownloadLink,
  singleBooking,
  passengers,
  agentData,
  handleSkipMarkup,
  skipMarkup,
  bookingType,
  serviceChargeData,
  agentPrice,
  setAgentPrice,
  airlineCharge,
  setAirlineCharge,
  type,
}) => {
  const [addLoading, setAddLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [markupType, setMarkupType] = useState("per_pax");
  const { jsonHeader } = useAuth();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const { isMobile, isMedium, isLarge } = useWindowSize();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  // TODO: Add Markup Mutate
  const { mutate: markUpMutate, status: markupStatus } = useMutation({
    mutationFn: (payload) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/markup`,
        payload,
        jsonHeader()
      ),
    onSuccess: (data) => {
      setPaxMarkup((prevMarkup) =>
        prevMarkup.map((pax) => ({
          ...pax,
          markupAmount: 0,
          totalMarkup: 0,
        }))
      );
      setAddLoading(false);
      setResetLoading(false);
      queryClient.invalidateQueries(["markupData"]);
      setOpen(false);
    },
    onError: (err) => {
      setAddLoading(false);
      setResetLoading(false);
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

  const handleChangeMarkup = (value, index) => {
    setPaxMarkup(
      paxMarkup.map((pax, i) => {
        if (i === index) {
          return {
            ...pax,
            markupAmount: value,
            totalMarkup:
              markupType === "per_pax" ? value * pax?.paxCount : value,
          };
        }
        return pax;
      })
    );
  };

  const handleMarkupAdd = async () => {
    const markup = paxMarkup.map((pax) => ({
      paxType: pax?.paxType,
      amount: parseFloat(pax?.markupAmount),
      markupType: markupType === "per_pax" ? "individual" : "all",
    }));

    const data = {
      bookingId,
      markup,
    };

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? you want to add markup?",
    });
    if (result.isConfirmed) {
      setAddLoading(true);
      markUpMutate(data);
    }
  };

  const handleMarkupReset = async () => {
    const markup = paxMarkup.map((pax) => ({
      paxType: pax?.paxType,
      amount: 0,
      markupType: markupType === "per_pax" ? "individual" : "all",
    }));

    const data = {
      bookingId,
      markup,
    };

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? you want to Reset markup?",
    });
    if (result.isConfirmed) {
      setResetLoading(true);
      markUpMutate(data);
    }
  };

  const allPaxTotalMarkup = paxMarkup?.reduce(
    (acc, obj) => acc + Number(obj.totalMarkup),
    0
  );

  const totalServiceCharge =
    serviceChargeData?.length > 0
      ? serviceChargeData.reduce((total, charge) => {
          const paxCount =
            paxMarkup.find((item) => item?.paxType === charge?.paxType)
              ?.paxCount || 0;

          return total + charge?.serviceCharge * paxCount;
        }, 0)
      : 0;

  return (
    <Box
      sx={{
        bgcolor: "#F9F9F9",
        p: 1.5,
        height: type === "booking" ? "600px" : "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <Typography sx={{ fontSize: "1rem", textTransform: "capitalize" }}>
        {title}
      </Typography>
      <Typography sx={textSm}>Without Markup Price Breakdown</Typography>

      {/* Without Markup Price Breakdown */}
      <Grid container spacing={1} mt={"0"}>
        <Grid item xs={4} md={4}>
          <Box sx={container}>
            <Typography sx={label}>Agent Fare</Typography>
            <Typography sx={value}>
              {flightData?.agentPrice?.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} md={4}>
          <Box sx={container}>
            <Typography sx={label}>Discount</Typography>
            <Typography sx={value}>
              {flightData?.commission?.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} md={4}>
          <Box sx={container}>
            <Typography sx={{ ...label }}>Gross</Typography>
            <Typography sx={value}>
              {flightData?.clientPrice?.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* With Markup Price Breakdown */}
      <Box sx={{ mt: isMobile ? 1.5 : 3 }}>
        <Typography sx={textSm}> Base Fare Markup Settings</Typography>
      </Box>

      <Box>
        {paxMarkup?.map((pax, i) => {
          return (
            <Grid key={i} container spacing={1} mt={"0"}>
              <Grid item xs={4} md={4.25}>
                <Box sx={container}>
                  {bookingType === "void" ? (
                    <>
                      <Typography noWrap sx={label}>
                        {pax?.paxType} Service Charge
                      </Typography>
                      <input
                        value={pax?.markupAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          const regex = /^\d*\.?\d{0,2}$/;
                          if (regex.test(value)) {
                            handleChangeMarkup(value, i);
                          }
                        }}
                        type="text"
                        style={markupAmount}
                        placeholder="Enter Amount"
                      />
                    </>
                  ) : (
                    <>
                      <Typography sx={label}>Markup {pax?.paxType} </Typography>
                      <input
                        value={pax?.markupAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          const regex = /^\d*\.?\d{0,2}$/;
                          if (regex.test(value)) {
                            handleChangeMarkup(value, i);
                          }
                        }}
                        type="text"
                        style={markupAmount}
                        placeholder="Enter Amount"
                      />
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={4} md={3.5}>
                <Box sx={container}>
                  <Typography sx={label}>Markup Add</Typography>
                  <Typography sx={value}>Per PAX ({pax?.paxCount})</Typography>
                </Box>
              </Grid>
              <Grid item xs={4} md={4.25}>
                <Box sx={container}>
                  <Typography sx={label}>
                    Total {pax?.paxType} Markup
                  </Typography>
                  <Typography sx={value}>
                    {Number(pax?.totalMarkup)?.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          );
        })}
      </Box>
      {/* Total Markup */}
      <Grid container spacing={1} mt={"0"} justifyContent={"end"}>
        <Grid item xs={4} md={4.25}>
          <Box sx={container}>
            <Typography sx={label}>Total Markup</Typography>
            <Typography sx={value}>
              {allPaxTotalMarkup?.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Markup Reflect */}

      <Typography
        sx={{
          color: "var(--light-gray)",
          fontSize: "13px",
          mt: isMobile ? 1 : 2,
        }}
      >
        Markup Reflect
      </Typography>

      <Grid container spacing={1} mt={"0"}>
        {bookingType === "void" ||
        bookingType === "refund" ||
        bookingType === "reissue" ? (
          <>
            <Grid item xs={6} md={6}>
              <Box sx={container}>
                <Typography sx={label}>
                  Fare Collect From Your Client
                </Typography>

                <input
                  value={agentPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^\d*\.?\d{0,2}$/;
                    if (regex.test(value)) {
                      setAgentPrice(value);
                    }
                  }}
                  type="text"
                  style={markupAmount}
                  placeholder="Enter Amount"
                />
              </Box>
            </Grid>

            {bookingType !== "void" && (
              <Grid item xs={6} md={6}>
                <Box sx={container}>
                  <Typography sx={label}>Airlines Charge</Typography>
                  <Typography sx={value}>
                    <input
                      value={airlineCharge}
                      onChange={(e) => {
                        const value = e.target.value;
                        const regex = /^\d*\.?\d{0,2}$/;
                        if (regex.test(value)) {
                          setAirlineCharge(value);
                        }
                      }}
                      type="text"
                      style={markupAmount}
                      placeholder="Enter Amount"
                    />
                  </Typography>
                </Box>
              </Grid>
            )}

            <Grid item xs={6} md={6}>
              <Box sx={container}>
                <Typography sx={label}>FFI Service Charge</Typography>
                <Typography sx={value}>
                  {totalServiceCharge?.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={6}>
              <Box sx={container}>
                <Typography sx={{ ...label, textTransform: "capitalize" }}>
                  Your {bookingType} Charge
                </Typography>
                <Typography sx={value}>
                  {allPaxTotalMarkup?.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={6}>
              <Box sx={container}>
                <Typography sx={{ ...label, textTransform: "capitalize" }}>
                  Client {bookingType} Amount
                </Typography>
                <Typography sx={value}>
                  {(
                    agentPrice -
                    totalServiceCharge -
                    allPaxTotalMarkup -
                    airlineCharge
                  )?.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={6} md={6}>
              <Box sx={container}>
                <Typography sx={label}>Agent Fare</Typography>
                <Typography sx={value}>
                  {(flightData?.agentPrice + allPaxTotalMarkup)?.toLocaleString(
                    "en-IN"
                  )}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={6}>
              <Box sx={container}>
                <Typography sx={label}>Your Profit</Typography>
                <Typography sx={value}>
                  {flightData?.commission?.toLocaleString("en-IN")}
                  {" + "}
                  {allPaxTotalMarkup?.toLocaleString("en-IN")}
                  {" = "}
                  {(flightData?.commission + allPaxTotalMarkup)?.toLocaleString(
                    "en-IN"
                  )}
                </Typography>
              </Box>
            </Grid>
          </>
        )}

        {pathname !== "/dashboard/flightaftersearch" && (
          <Grid item xs={12}>
            <Box
              sx={{
                bgcolor: "#F9F9F9",
                display: "flex",
                gap: 2,
                alignItems: "center",
                mt: 2,
              }}
            >
              <Button
                onClick={() => {
                  if (typeMarkup === "pricebreakdown") {
                    handleMarkupAdd();
                  } else if (typeMarkup === "pdfprice") {
                    setShowDownloadLink(true);
                  }
                }}
                disabled={markupStatus === "pending"}
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--white)",
                  width: "90%",
                  fontSize: "12px",
                  height: "40px",
                  textTransform: "uppercase",
                }}
              >
                {markupStatus === "pending" && addLoading ? (
                  <SmallLoadingSpinner />
                ) : typeMarkup === "pdfprice" ? (
                  <DownloadLinkItem
                    document={
                      <PDFPageDesign
                        copy="markup-copy"
                        check="1"
                        singleBooking={singleBooking}
                        passengers={passengers}
                        agentData={agentData}
                        newAgentPrice={
                          flightData?.agentPrice + allPaxTotalMarkup
                        }
                        ticket
                      />
                    }
                    fileName="eticketp"
                    label={
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#fff",
                          mt: "5px",
                        }}
                      >
                        Add Markup With Price
                      </Typography>
                    }
                  />
                ) : typeMarkup === "pricebreakdown" ? (
                  "Add Markup"
                ) : (
                  "Add Markup"
                )}
              </Button>

              <IconButton
                onClick={handleMarkupReset}
                disabled={false}
                sx={{
                  bgcolor:
                    markupStatus === "pending"
                      ? "var(--black)"
                      : "var(--black)",
                  ":hover": {
                    bgcolor:
                      markupStatus === "pending"
                        ? "var(--black)"
                        : "var(--black)",
                  },
                  opacity: markupStatus === "pending" ? 1 : 1,
                  pointerEvents: markupStatus === "pending" ? "none" : "auto",
                  borderRadius: "3px",
                }}
              >
                {markupStatus === "pending" && resetLoading ? (
                  <CircularProgress size={20} style={{ color: "white" }} />
                ) : (
                  <RestartAltIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </Box>
          </Grid>
        )}
      </Grid>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />
      {!skipMarkup && isMobile && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Typography
            onClick={handleSkipMarkup}
            variant="body2"
            sx={{
              cursor: "pointer",
              color: "var(--secondary-color)",
              fontWeight: 500,
            }}
          >
            Skip Markup
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const ShareMessage = ({
  flightData,
  paxMarkup,
  type,
  bookingData,
  handleSkipMarkup,
  skipMarkup,
  bookingType,
  agentPrice,
  totalServiceCharge,
  airlineCharge,
}) => {
  const { agentData } = useOutletContext();
  const [crrTab, setCrrTab] = useState(0);
  const [yourName, setYourName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const { isMobile } = useWindowSize();

  const allPaxTotalMarkup = paxMarkup?.reduce(
    (acc, obj) => acc + Number(obj.totalMarkup),
    0
  );

  const validateField = async (field, value) => {
    try {
      await validationSchema(crrTab).validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
      return false;
    }
  };

  const handleChange = (name, value) => {
    if (name === "phone") {
      setPhoneNumber(value);
    } else {
      setEmail(value);
    }

    validateField(name, value);
  };

  const handleTabClick = (tabNumber) => {
    if (crrTab !== tabNumber) {
      setErrors({});
      setCrrTab(tabNumber);
      setEmail("");
      setPhoneNumber("");
    }
  };

  const totalPax = flightData?.priceBreakdown?.reduce(
    (acc, price) => acc + price.paxCount,
    0
  );
  const currency =
    type === "aftersearch"
      ? flightData?.priceBreakdown[0]?.currency
      : bookingData?.details?.priceBreakdown[0]?.allTax[0]?.currency;

  const totalPrice =
    type === "aftersearch"
      ? (flightData?.agentPrice + allPaxTotalMarkup)?.toLocaleString("en-IN")
      : bookingType === "void" ||
          bookingType === "refund" ||
          bookingType === "reissue"
        ? (
            agentPrice -
            totalServiceCharge -
            allPaxTotalMarkup -
            airlineCharge
          )?.toLocaleString("en-IN")
        : (bookingData?.agentPrice + allPaxTotalMarkup)?.toLocaleString(
            "en-IN"
          );

  const routeString = flightData?.route
    ?.map(
      (route, i, arr) =>
        `${i > 0 ? " - " : ""}${route?.departure}${i === arr.length - 1 ? ` - ${route?.arrival}` : ""}`
    )
    .join("");

  const subject = `${routeString} By ${flightData?.carrierName || bookingData?.carrierName}, PAX ${totalPax}, ${currency || "BDT"} ${totalPrice}`;

  const message =
    flightData?.cityCount
      ?.map((citys, i) => {
        return `Your ${
          flightData?.tripType === "oneWay"
            ? "One Way"
            : flightData?.tripType === "roundWay"
              ? i === 0
                ? "Go"
                : "Back"
              : `City ${i + 1}`
        } Itinerary for *${citys[0]?.departureLocation} - ${
          citys[citys?.length - 1]?.arrivalLocation
        }* for ${flightData?.priceBreakdown
          ?.map((price) => `*${price?.paxCount} ${price?.paxType}*`)
          .join(", ")}.\n*Airline:* ${citys[0]?.marketingCarrierName} (${
          citys[0]?.marketingCarrier
        }-${citys[0]?.marketingFlight}), ${
          citys[0]?.airCraft
        }.\n*Departure:* (${citys[0]?.departureLocation}) Time: ${moment(
          citys[0]?.departureDateTime
        ).format("YYYY-MM-DD hh:mm A")}\n*Arrival:* (${
          citys[citys?.length - 1]?.arrivalLocation
        }) Time: ${moment(citys[0]?.arrivalDateTime).format(
          "YYYY-MM-DD hh:mm A"
        )}\n*Duration:* ${citys[0]?.totalFlightDuration || ""}\n*Fare Type:* ${
          flightData?.isRefundable || bookingData?.isRefundable
        }\n*Baggage:* ${flightData?.baggage[i]?.map((bag) => `${bag?.paxType} ${bag?.baggage}${" "}`)}
      \n`;
      })
      .join("") +
    `${
      bookingType === "void" ||
      bookingType === "refund" ||
      bookingType === "reissue"
        ? `*Paid Amount For this Ticket:* ${currency || "BDT"} ${(agentPrice || 0)?.toLocaleString("en-IN")}\n${bookingType !== "void" ? `*Airlines ${convertCamelToTitle(bookingType)} Charge:* ${currency || "BDT"} ${(airlineCharge || 0)?.toLocaleString("en-IN")}` : ""}\n*Service Charge:* ${currency || "BDT"} ${(totalServiceCharge || 0)?.toLocaleString("en-IN")}\n*${
            bookingType === "refund"
              ? "Refundable"
              : convertCamelToTitle(bookingType)
          } Amount:* ${currency || "BDT"} ${totalPrice}\n`
        : `*Price:* ${currency || "BDT"} ${totalPrice}`
    }\n`;

  const handleCopy = () => {
    try {
      const isSecure = window.isSecureContext;
      const clipboard = navigator.clipboard;

      if (clipboard && isSecure) {
        clipboard
          .writeText(message.replace(/\*/g, ""))
          .then(() => setIsCopied(true));
      } else {
        // Fallback: create a temporary textarea element
        const textarea = document.createElement("textarea");
        textarea.value = message.replace(/\*/g, "");
        textarea.style.position = "fixed"; // prevent scroll jump
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.opacity = "0";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (success) setIsCopied(true);
        else alert("Copy failed. Please copy manually.");
      }
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Copy is not supported on this device.");
    }
  };

  const handleWhatsAppMessage = () => {
    const encodedMessage = encodeURIComponent(
      bookingType === "void" ||
        bookingType === "refund" ||
        bookingType === "reissue"
        ? `Hi Dear,\n\nYour ${convertCamelToTitle(bookingType)} Request Quotation Is Given Below\n\n${message}\nRegards,\n*${yourName}*`
        : type === "booking"
          ? `Hi Dear,\n\nYour Flight Itinerary Request Has been ${bookingData?.status}\n\n${message}\nRegards,\n*${yourName}*`
          : `Hi Dear,\n\n${message}\nRegards,\n*${yourName}*`
    );

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const url = isMobile
      ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  const handleSendMail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${encodeURIComponent("Quotation Of " + subject)}&body=${encodeURIComponent(
      (type === "booking"
        ? `Hi Dear,\n\nYour Flight Itinerary Request Has been ${bookingData?.status}\n\n${message}\nRegards,\n*${yourName}*`
        : `Hi Dear,\n\n${message}\nRegards,\n*${yourName}*`
      ).replace(/\*/g, "")
    )}`;

    window.open(gmailUrl, "_blank");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        gap: "10px",
      }}
    >
      <Box>
        <Grid container>
          <Grid item xs={6}>
            <Box
              onClick={() => handleTabClick(0)}
              sx={{ ...tabBar, bgcolor: crrTab === 0 ? "#F9F9F9" : "" }}
            >
              <WhatsAppIcon sx={{ fontSize: "35px", color: "#0E8749" }} />
              <Box>
                {isMobile ? (
                  <Typography sx={{ fontSize: "1rem" }}>WhatsApp</Typography>
                ) : (
                  <Box>
                    <Typography sx={{ fontSize: "1rem" }}>
                      Share at WhatsApp
                    </Typography>
                    <Typography sx={{ ...textSm, fontSize: "12px" }}>
                      Share this ternary at WhatsApp
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box
              onClick={() => handleTabClick(1)}
              sx={{
                ...tabBar,
                borderLeft: "2px solid #E3E3E3",
                bgcolor: crrTab === 1 ? "#F9F9F9" : "",
              }}
            >
              <EmailIcon
                sx={{ fontSize: "35px", color: "var(--secondary-color)" }}
              />
              <Box>
                {isMobile ? (
                  <Typography sx={{ fontSize: "1rem" }}>Email</Typography>
                ) : (
                  <Box>
                    <Typography sx={{ fontSize: "1rem" }}>
                      Share at Email
                    </Typography>
                    <Typography sx={{ ...textSm, fontSize: "12px" }}>
                      Share this itinerary to Email
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ pt: { xs: 1.5, lg: 2 }, position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: isMobile && "column",
            }}
          >
            <Box sx={{ width: { lg: "49%", xs: "100%" } }}>
              <Typography mb={"4px"} sx={textSm}>
                Your Name
              </Typography>

              <input
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                type="text"
                style={{
                  ...markupAmount,
                  color: "var(--secondary-color)",
                  fontSize: "1rem",
                  height: "40px",
                  border: "1px solid #dedede",
                  paddingLeft: "10px",
                  borderRadius: "3px",
                }}
                placeholder="Enter Your Name"
              />
            </Box>
            <Box
              sx={{
                width: { lg: "49%", xs: "100%" },
                position: "relative",
                mt: { xs: 1.5, lg: 0 },
              }}
            >
              <Typography mb={"4px"} sx={textSm}>
                Client's {crrTab === 0 ? "WhatsApp Number" : "Email Address"}
              </Typography>

              {crrTab === 0 ? (
                <PhoneInput
                  inputStyle={{
                    width: "100%",
                    height: "100%",
                    color: "var(--secondary-color)",
                    fontSize: "1rem",
                  }}
                  value={phoneNumber}
                  country={"bd"}
                  countryCodeEditable={false}
                  onChange={(phone) => handleChange("phone", phone)}
                />
              ) : (
                <input
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  type="email"
                  style={{
                    ...markupAmount,
                    color: "var(--secondary-color)",
                    fontSize: "1rem",
                    height: "40px",
                    border: "1px solid #dedede",
                    paddingLeft: "10px",
                    borderRadius: "3px",
                  }}
                  placeholder="Enter Client's Email Address"
                />
              )}

              <span style={registrationErrText}>
                {crrTab === 0 ? errors?.phone : errors?.email}
              </span>
            </Box>
          </Box>

          <Box
            mt={3}
            sx={{
              height: type === "aftersearch" ? "200px" : "310px",
              overflowY: "auto",
              pr: 3.2,
            }}
          >
            <Typography
              sx={{
                fontSize: { lg: "14px", xs: "12px" },
                color: "var(--secondary-color)",
                mt: 1,
              }}
            >
              Hi Dear,
            </Typography>
            {bookingType === "void" ||
            bookingType === "refund" ||
            bookingType === "reissue" ? (
              <Typography
                sx={{
                  fontSize: { lg: "14px", xs: "12px" },
                  color: "var(--secondary-color)",
                  mt: 1,
                  textTransform: "capitalize",
                }}
              >
                Your {convertCamelToTitle(bookingType)} Request Quotation is
                given below
              </Typography>
            ) : (
              type === "booking" && (
                <Typography
                  sx={{
                    fontSize: { lg: "14px", xs: "12px" },
                    color: "var(--secondary-color)",
                    mt: 1,
                    textTransform: "capitalize",
                  }}
                >
                  Your Flight Iternary Request Has been {bookingData?.status}
                </Typography>
              )
            )}

            {flightData?.cityCount?.map((citys, i) => {
              return (
                <Box key={i}>
                  <Typography
                    sx={{
                      fontSize: { lg: "14px", xs: "12px" },
                      color: "var(--secondary-color)",
                      mt: 1,
                    }}
                  >
                    Your{" "}
                    {flightData?.tripType === "oneWay" ? (
                      "One Way"
                    ) : flightData?.tripType === "roundWay" ? (
                      <>{i === 0 ? "Go" : "Back"}</>
                    ) : (
                      <>City {i + 1}</>
                    )}{" "}
                    Itinerary for {citys[0]?.departureLocation} -{" "}
                    {citys[citys?.length - 1]?.arrivalLocation} for{" "}
                    {flightData?.priceBreakdown?.map((price, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && ", "}
                        {price?.paxCount} {price?.paxType}
                      </React.Fragment>
                    ))}
                    {/* Traveller. */}. Airline: {flightData?.carrierName} ({" "}
                    {citys[0]?.marketingCarrier}-{citys[0]?.marketingFlight})
                    {", "}
                    {citys[0]?.airCraft}.
                  </Typography>

                  <Box sx={{ mt: 0.5, mb: 2 }}>
                    <Typography sx={secondaryText}>
                      Departure: ({citys[0]?.departureLocation}) Time:{" "}
                      {moment(citys[0]?.departureDateTime).format(
                        "YYYY-MM-DD hh:mm A"
                      )}
                    </Typography>
                    <Typography sx={secondaryText}>
                      Arrival: ({citys[citys?.length - 1]?.arrivalLocation})
                      Time: {/* {citys[0]?.arrivalDateTime} */}
                      {moment(citys[0]?.arrivalDateTime).format(
                        "YYYY-MM-DD hh:mm A"
                      )}
                    </Typography>
                    <Typography sx={secondaryText}>
                      Duration: {citys[0]?.totalFlightDuration}
                    </Typography>
                    {type === "aftersearch" && (
                      <Typography sx={secondaryText}>
                        Fare Type: {flightData?.isRefundable}
                      </Typography>
                    )}

                    <Typography sx={secondaryText}>
                      Baggage:{" "}
                      {flightData?.baggage?.[i]?.map((bag, i) => {
                        return (
                          <React.Fragment key={i}>
                            {bag?.paxType} {bag?.baggage},{" "}
                          </React.Fragment>
                        );
                      })}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {bookingType === "void" ||
            bookingType === "refund" ||
            bookingType === "reissue" ? (
              <>
                <Typography sx={secondaryText}>
                  Paid Amount For this Ticket: {currency || "BDT"}{" "}
                  {(agentPrice || 0)?.toLocaleString("en-IN")}
                </Typography>

                {bookingType !== "void" && (
                  <Typography sx={secondaryText}>
                    Airlines {convertCamelToTitle(bookingType)} Charge:{" "}
                    {currency || "BDT"}{" "}
                    {(airlineCharge || 0)?.toLocaleString("en-IN")}
                  </Typography>
                )}
                <Typography sx={secondaryText}>
                  Service Charge: {currency || "BDT"}{" "}
                  {(totalServiceCharge || 0)?.toLocaleString("en-IN")}
                </Typography>
                <Typography sx={secondaryText}>
                  {bookingType === "refund"
                    ? "Refundable"
                    : convertCamelToTitle(bookingType)}{" "}
                  Amount: {currency || "BDT"} {totalPrice}
                </Typography>
              </>
            ) : (
              <Typography sx={secondaryText}>
                Price: {currency || "BDT"} {totalPrice}
              </Typography>
            )}
          </Box>

          <Tooltip
            onClose={() => {
              if (isCopied) {
                setTimeout(() => {
                  setIsCopied(false);
                }, 500);
              }
            }}
            title={isCopied ? "Copied" : "Click to copy"}
            placement="top"
          >
            <ContentCopyIcon
              onClick={handleCopy}
              sx={{
                fontSize: "28px",
                position: "absolute",
                right: "8px",
                bottom: 0,
                cursor: "pointer",
                fill: "var(--secondary-color)",
              }}
            />
          </Tooltip>
        </Box>
      </Box>

      <Box>
        <Box
          sx={{
            bgcolor: "#F9F9F9",
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography sx={textSm}>Attachment</Typography>
            <Typography sx={{ fontSize: "1rem", fontWeight: "600" }}>
              {subject}
            </Typography>
          </Box>

          <PDFDownloadLink
            document={
              <PDFPageDesign
                copy="per-pax-ticket-copy"
                check="1"
                singleBooking={{
                  details: flightData || {},
                  tripType:
                    flightData?.tripType || bookingData?.tripType || "N/A",
                  clientPrice:
                    flightData?.clientPrice || bookingData?.clientPrice || 0,
                  agentPrice:
                    flightData?.agentPrice || bookingData?.agentPrice || 0,
                  commission: (() => {
                    const flightCommission = flightData?.commission || {};
                    const bookingCommission = bookingData?.commission || {};
                    return Object.keys(flightCommission).length > 0
                      ? flightCommission
                      : bookingCommission;
                  })(),
                  taxes: flightData?.taxes || bookingData?.taxes || 0,
                }}
                agentData={agentData}
                quotation={true}
                bookingType={bookingType}
                bookingTypeData={{
                  currency,
                  agentPrice,
                  airlineCharge,
                  totalServiceCharge,
                  totalPrice:
                    agentPrice -
                    totalServiceCharge -
                    allPaxTotalMarkup -
                    airlineCharge,
                }}
              />
            }
            fileName={`eticketp`}
            style={{
              textDecoration: "none",
              color: "var(--secondary-color)",
            }}
          >
            {({ url, loading }) =>
              loading ? (
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              ) : (
                <Typography
                  component="a"
                  href={url}
                  sx={{
                    cursor: "pointer",
                    color: "var(--secondary-color)",
                    fontSize: "14px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                  target="_blank"
                >
                  <ForwardIcon
                    sx={{ color: "#8F8F98", transform: "rotate(90deg)" }}
                  />
                </Typography>
              )
            }
          </PDFDownloadLink>
        </Box>

        <Button
          // disabled={
          //   (!yourName && (!phoneNumber || !email)) ||
          //   !!(errors?.email || errors?.phone)
          // }
          disabled={
            !!yourName === false ||
            (crrTab === 0
              ? phoneNumber && !!errors?.phone === true
              : email && !!errors?.email === true)
          }
          onClick={crrTab === 0 ? handleWhatsAppMessage : handleSendMail}
          sx={{ ...primaryBtn, width: "100%" }}
        >
          Send To Client's {crrTab === 0 ? "WhatsApp Number" : "Email"}
        </Button>
      </Box>
      {skipMarkup && isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Typography
            onClick={handleSkipMarkup}
            variant="body2"
            sx={{
              cursor: "pointer",
              bgcolor: "var(--mateblack)",
              pl: 2,
              pr: 1,
              py: 0.5,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowBackIosIcon sx={{ color: "white", fontSize: "14px" }} />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const validationSchema = (crrTab) =>
  Yup.object({
    phone: crrTab === 0 ? phoneValidation("Client's WhatsApp") : null,
    email: crrTab === 1 ? emailValidation("Client's") : null,
  });

const container = { bgcolor: "white", p: 1, minHeight: "60px", height: "100%" };
const label = { color: "var(--light-gray)", fontSize: "12px" };
const value = { fontSize: { lg: "14px", xs: "12px" }, fontWeight: "500" };
const textSm = { color: "var(--light-gray)", fontSize: "13px" };
const secondaryText = {
  fontSize: { lg: "14px", xs: "12px" },
  color: "var(--secondary-color)",
};

const tabBar = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  height: "100%",
  p: 1,
  ":hover": { bgcolor: "#F9F9F9" },
  cursor: "pointer",
};

const markupAmount = {
  width: "100%",
  fontSize: { lg: "14px", xs: "12px" },
  fontWeight: "500",
  height: "20px",
  outline: "none",
  border: "none",
  borderBottom: "1px solid var(--border-color)",
};

export default QuotationShare;
