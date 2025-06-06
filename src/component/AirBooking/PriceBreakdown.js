import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  Skeleton,
  Typography,
  Zoom,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { calculateGrandTotals } from "../../helpers/calulationGrandTotals";
import {
  PassengerMarkupPriceBreakdown,
  PassengerPriceBreakdown,
} from "../../shared/common/functions";
import { sortByPaxType } from "../../utils/functions";
import { MakeQuotation } from "../FlightAfterSearch/QuotationShare";
import { setFlightTab } from "../FlightSearchBox/flighAfterSearchSlice";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";

const tabBtnStyle = (active) => {
  return {
    bgcolor: active ? "var(--secondary-color)" : "#F2F8FF",
    color: active ? "#FFF" : "var(--secondary-color)",
    ":hover": {
      bgcolor: active ? "var(--secondary-color)" : "#F2F8FF",
      color: active ? "#FFF" : "var(--secondary-color)",
    },
    px: 1,
    width: "48%",
  };
};

export const ReissueDataCard = ({ setBookingData, bookingData: active }) => {
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "0 0 3px 3px",
        p: "20px 10px",
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={() => {
            setBookingData("current booking");
            dispatch(setFlightTab("flight"));
          }}
          variant="outlined"
          sx={tabBtnStyle(active === "current booking")}
        >
          <Typography noWrap sx={{ fontSize: "0.70rem", fontWeight: "400" }}>
            Current Booking
          </Typography>
        </Button>
        <Button
          onClick={() => setBookingData("reissue booking")}
          variant="outlined"
          sx={tabBtnStyle(active === "reissue booking")}
        >
          <Typography noWrap sx={{ fontSize: "0.70rem", fontWeight: "500" }}>
            Reissue Booking
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export const TicketStatus = ({ data, bookingData, relation = [] }) => {
  const { agentData } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isReissueQuote = location.pathname.includes("reissuequotation");
  const firstRelation = relation[0] || {};

  // console.log(data);

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "3px",
        p: "12px 10px",
        mb: 1.5,
      }}
    >
      <Typography
        sx={{
          color: "#3C4258",
          fontSize: "1.25rem",
          fontWeight: "500",
          pt: "2px",
        }}
      >
        {bookingData === "reissue booking"
          ? data?.reissueBookingId
          : data?.bookingId}
      </Typography>
      <Typography
        sx={{
          color: "gray",
          fontSize: "0.75rem",
          fontWeight: "500",
          pb: "5px",
        }}
      >
        <span style={{ color: "var(--primary-color)" }}>
          {data?.status?.toUpperCase()}
        </span>{" "}
        by Agent at {moment(data?.createdAt).format("DD MMM, YYYY")}
      </Typography>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: "500" }}>
        {isReissueQuote && data?.bookingStatus === "reissued" ? (
          <>
            Booking ID :{" "}
            <span
              onClick={() => {
                navigate(
                  `/dashboard/booking/airtickets/reissued/${firstRelation?.bookingId}`,
                  {
                    state: {
                      agentData: agentData?.userAccess,
                    },
                  }
                );
              }}
              style={{
                color: "var(--primary-color)",
                textDecoration: "underline",
                cursor: "pointer",
                textUnderlineOffset: "2px",
              }}
            >
              {firstRelation?.bookingAttribId}
            </span>
          </>
        ) : (
          <>
            Airlines PNR :{" "}
            <span
              style={{
                color:
                  data?.airlinePnr === "Will be generated"
                    ? "var(--primary-color)"
                    : "var(--secondary-color)",
              }}
            >
              {data?.airlinePnr}
            </span>
          </>
        )}
      </Typography>

      {data?.refunds?.length > 0 && (
        <Typography
          sx={{
            bgcolor: "#37cb6f",
            color: "#fff",
            px: 1,
            py: "2px",
            mt: "4px",
            fontSize: "12px",
            borderRadius: "3px",
            textTransform: "capitalize",
            width: "max-content",
            display: !data?.refunds[0]?.refundType && "none",
          }}
        >
          {data?.refunds[0]?.refundType}
        </Typography>
      )}
    </Box>
  );
};

const PriceBreakdown = ({
  type,
  flightData,
  label,
  refundData,
  isReissueOnProcess,
  isNotEquals = false,
  markupData,
  isLoading = false,
  openMarkup,
  setOpenMarkup,
  typeMarkup,
  setTypeMarkup,
  setShowDownloadLink,
  singleBooking,
  passengers,
  agentData,
  bookingData,
}) => {
  const { jsonHeader } = useAuth();
  const { pathname } = useLocation();
  const [openPriceBox, setOpenPriceBox] = useState(false);
  const { partialData, partialChargeData } = useSelector(
    (state) => state.flightBooking
  );
  const { cmsData } = useSelector((state) => state.flightAfter);

  const [paxMarkup, setPaxMarkup] = useState(() => {
    const priceBreakdown = flightData?.details?.priceBreakdown || [];

    const uniquePaxData = Object.values(
      priceBreakdown.reduce((acc, pax) => {
        const {
          paxType,
          paxCount,
          markupAmount = "",
          totalMarkup = 0,
          age,
        } = pax;
        if (!acc[paxType]) {
          acc[paxType] = {
            paxType,
            paxCount: 0,
            markupAmount,
            totalMarkup,
            age,
          };
        }
        acc[paxType].paxCount += paxCount;
        return acc;
      }, {})
    );

    return uniquePaxData?.map((pax) => {
      const markup = markupData?.find((m) => m.paxType === pax.paxType);
      return {
        ...pax,
        markupAmount: markup ? markup.amount : "",
        totalMarkup: markup ? markup.amount * pax?.paxCount : 0,
      };
    });
  });

  // console.log(flightData);

  const [query] = useState({
    commissionType: flightData?.commissionType,
    tripType: flightData?.tripType,
    journeyType: flightData?.journeyType,
  });

  const { data: voidServiceData } = useQuery({
    queryKey: ["/voidServiceData", query],
    queryFn: async () => {
      const queryParams = new URLSearchParams(query).toString();
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/common/service-charges/void?${queryParams}`;
      const { data } = await axios.get(url, jsonHeader());

      return data;
    },

    enabled: flightData?.status === "void request",
  });

  const { data: refundPriceBreakdown, status } = useQuery({
    queryKey: ["user/refund/price-breakdown"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/refund/price-breakdown/${flightData?.id}`,
        jsonHeader()
      );
      return data?.data?.at(0);
    },
    staleTime: 0,
    enabled: flightData?.status === "refund",
  });

  const refundAgentQuotationPrice = refundPriceBreakdown
    ? refundPriceBreakdown?.agentPrice
    : {};

  // console.log(refundPriceBreakdown);

  const isPartiallyPaid =
    flightData?.paymentStatus?.toLowerCase() === "partially paid";

  const airlinesCharge = flightData?.reIssue
    ? flightData?.fareDifference?.totalFare?.airlineServiceFee
    : isReissueOnProcess
      ? flightData?.details?.fareDifference?.totalFare?.airlineServiceFee
      : refundData?.airlineCharge;

  const serviceCharge = flightData?.reIssue
    ? flightData?.fareDifference?.totalFare?.ffiServiceFee
    : isReissueOnProcess
      ? flightData?.details?.fareDifference?.totalFare?.ffiServiceFee
      : refundData?.refundPassengers?.reduce((total, refund) => {
          return total + parseFloat(refund?.serviceCharge) * refund?.paxCount;
        }, 0);

  const totalCharge = airlinesCharge + serviceCharge;

  let totalRefundCharge;
  if (flightData?.paymentStatus?.toLowerCase() === "partially paid") {
    totalRefundCharge =
      flightData?.partialPayment?.totalPayedAmount - totalCharge;
  } else {
    totalRefundCharge = flightData?.agentPrice - totalCharge;
  }

  const totals = calculateGrandTotals(
    flightData?.priceBreakdown || flightData?.details?.priceBreakdown
  );

  const result = paxMarkup?.map((pax) => {
    const matchingMarkup = markupData?.find(
      (markup) => markup?.paxType === pax?.paxType
    );
    const amount = matchingMarkup ? matchingMarkup?.amount : 0;
    return {
      ...pax,
      totalAmount: pax?.paxCount * amount,
    };
  });

  const grandTotal = result.reduce((sum, pax) => sum + pax?.totalAmount, 0);

  const handleToggle = () => {
    setOpenPriceBox((prev) => !prev);
  };

  const refunds = flightData?.refunds ? flightData?.refunds[0] : {};

  const refundPassengers = refunds?.refundPassengers;

  const priceBreakdown = flightData?.details?.priceBreakdown
    ? flightData?.details?.priceBreakdown
    : flightData?.priceBreakdown;

  const totalBaseFare = refundPassengers?.reduce((total, item) => {
    return total + item?.baseFare * item?.paxCount;
  }, 0);

  const totalTax = refundPassengers?.reduce((total, item) => {
    return total + item?.tax * item?.paxCount;
  }, 0);

  const totalServiceCharge = refundPassengers?.reduce(
    (total, acc) => total + acc?.serviceCharge * acc?.paxCount,
    0
  );

  const totalAdditionalAmount =
    priceBreakdown.reduce(
      (acc, passenger) => acc + passenger?.additionalInfo?.additionAmount || 0,
      0
    ) || 0;

  const totalGrossFare = totalBaseFare + totalTax;

  const totalDiscount = flightData?.commission;

  const afterDiscountCost = totalGrossFare - totalDiscount || 0;
  const ait =
    Math.round(priceBreakdown.reduce((acc, item) => acc + item?.finalAit, 0)) ||
    0;

  const agentTotalAdditionalAmount =
    priceBreakdown.reduce(
      (acc, passenger) =>
        acc +
        passenger?.additionalInfo?.singleAdditionAmount * passenger?.paxCount,
      0
    ) || 0;

  const totalAgentCost =
    afterDiscountCost + ait + agentTotalAdditionalAmount || 0;

  const totalRefundAmount =
    totalAgentCost -
    (totalServiceCharge +
      parseFloat(
        refunds?.airlineCharge * refunds?.airlineChargeConversionRate
      ) +
      ait) -
    (flightData?.partialPayment?.totalCharge || 0);

  const voidServiceCharge = flightData?.details?.voidPassengers
    ? flightData?.details?.voidPassengers?.reduce(
        (total, item) => total + (item?.serviceCharge || 0),
        0
      )
    : flightData?.details?.priceBreakdown
      ? flightData?.details?.priceBreakdown.reduce((total, pax) => {
          const matchingService = voidServiceData?.data?.[0]?.data?.find(
            (service) => service.paxType === pax.paxType
          );
          if (matchingService) {
            return total + matchingService.serviceCharge * pax.paxCount;
          }
          return total;
        }, 0)
      : 0;

  const agentVoidAmount =
    (flightData?.paymentStatus === "paid"
      ? flightData?.agentPrice
      : flightData?.partialPayment?.totalPayedAmount) -
      voidServiceCharge -
      (flightData?.partialPayment?.totalCharge || 0) || 0;

  const getStatusLabel = (status, paymentStatus) => {
    switch (status) {
      case "hold":
        return "Agent Payable Amount";
      case "cancel":
        return "Agent Payable Amount";
      case "issue in process":
        return "Agent Payable Amount";
      case "void":
        return "Agent Void Amount";
      case "void request":
        return "Agent Voidable Amount";
      case "refund":
        return "Agent Refund Amount";
      case "refund request":
      case "refund on process":
      case "refund to be confirmed":
      case "refunding":
      case "partially refund":
        return "Agent Refundable Amount";
      case "reissued":
        return "Agent Paid Amount";
      case "reissue request":
      case "reissue on process":
      case "reissue to be confirmed":
      case "reissuing":
        if (bookingData === "current booking") {
          return "Agent Paid Amount";
        } else {
          return "Agent Reissue Payable Amount";
        }
      case "ticketed":
        if (paymentStatus === "paid") {
          return "Agent Paid Amount";
        } else if (paymentStatus === "partially paid") {
          return "Total Due Amount";
        }
        break;
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "column" },
        mb: "1rem",
      }}
    >
      {/* Price breakdown */}
      <Box sx={{ bgcolor: "#fff", borderRadius: "3px" }}>
        <Box
          sx={{
            py: "12px",
            px: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            cursor: "pointer",
          }}
          onClick={() => {
            if (flightData?.details?.fareDifference?.totalFare) {
              if (
                String(
                  flightData?.details?.fareDifference?.totalFare?.reIssuePayable
                ).toLowerCase() === "will be decided"
              ) {
                return;
              }
              handleToggle();
            } else {
              handleToggle();
            }
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#3C4258",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                {type === "before"
                  ? cmsData?.agentFare
                    ? "Agent Fare"
                    : cmsData?.customerFare
                      ? "Customer Fare"
                      : "Commission Fare"
                  : getStatusLabel(
                      flightData?.status,
                      flightData?.paymentStatus
                    )}
              </Typography>

              {isLoading ? (
                <Skeleton />
              ) : (
                <>
                  {flightData?.reIssue || isNotEquals ? (
                    <Typography sx={{ fontSize: "17px" }}>
                      Will be decided
                    </Typography>
                  ) : (
                    <>
                      {isPartiallyPaid ? (
                        <Typography
                          sx={{
                            color: "#3C4258",
                            fontSize: "1.25rem",
                            fontWeight: "500",
                            pt: "2px",
                          }}
                        >
                          {flightData?.status === "void request" ||
                          flightData?.status === "void"
                            ? agentVoidAmount
                            : refundData
                              ? totalRefundCharge?.toLocaleString("en-IN")
                              : flightData?.partialPayment?.dueAmount
                                ? flightData?.partialPayment?.dueAmount?.toLocaleString(
                                    "en-IN"
                                  )
                                : flightData?.partialPayment?.totalPayableAmount?.toLocaleString(
                                    "en-IN"
                                  )}{" "}
                          BDT
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            color: "#3C4258",
                            fontSize: "1.25rem",
                            fontWeight: "500",
                            pt: "2px",
                          }}
                        >
                          {partialData ? (
                            <>
                              {(
                                partialData?.amount || partialData?.payedAmount
                              )?.toLocaleString("en-IN")}{" "}
                              BDT
                            </>
                          ) : flightData?.details?.fareDifference?.totalFare
                              ?.reIssuePayable ? (
                            <>
                              {
                                flightData?.details?.fareDifference?.totalFare
                                  ?.reIssuePayable
                              }{" "}
                              {isNaN(
                                flightData?.details?.fareDifference?.totalFare
                                  ?.reIssuePayable
                              ) === false && "BDT"}{" "}
                            </>
                          ) : (
                            <>
                              {flightData?.details?.fareDifference
                                ?.totalFare ? (
                                <>
                                  {flightData?.de?.fareDifference?.totalFare?.reIssuePayable?.toLocaleString(
                                    "en-IN"
                                  )}{" "}
                                </>
                              ) : (
                                <>
                                  {flightData?.status ===
                                    "refund to be confirmed" ||
                                  flightData?.status === "refund" ||
                                  flightData?.status === "refund on process" ||
                                  flightData?.status === "refunding"
                                    ? flightData?.status === "refund"
                                      ? (
                                          refundAgentQuotationPrice?.refundedAmount ||
                                          0
                                        )?.toLocaleString("en-IN")
                                      : totalRefundAmount?.toLocaleString(
                                          "en-IN"
                                        )
                                    : refundData
                                      ? totalRefundCharge?.toLocaleString(
                                          "en-IN"
                                        )
                                      : type === "before"
                                        ? (flightData?.brands[0]?.[
                                            cmsData?.agentFare
                                              ? "agentPrice"
                                              : cmsData?.customerFare
                                                ? "clientPrice"
                                                : "commission"
                                          ]
                                            ? flightData?.brands[0]?.[
                                                cmsData?.agentFare
                                                  ? "agentPrice"
                                                  : cmsData?.customerFare
                                                    ? "clientPrice"
                                                    : "commission"
                                              ]
                                            : 0
                                          )?.toLocaleString("en-IN")
                                        : flightData?.status ===
                                              "void request" ||
                                            flightData?.status === "void"
                                          ? agentVoidAmount?.toLocaleString(
                                              "en-IN"
                                            )
                                          : flightData?.agentPrice?.toLocaleString(
                                              "en-IN"
                                            )}{" "}
                                </>
                              )}
                              BDT
                            </>
                          )}
                        </Typography>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <ArrowDropDownIcon
                sx={{
                  transform: openPriceBox ? "rotate(180deg)" : "rotate(0deg)",
                  bgcolor: "#F2F8FF",
                  borderRadius: "50%",
                  transition: "transform 0.2s ease-in-out",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Collapse
          in={openPriceBox}
          timeout="auto"
          unmountOnExit
          sx={{ pb: 2.5 }}
        >
          <Typography
            sx={{
              bgcolor: "var(--primary-color)",
              color: "#fff",
              fontSize: "0.85rem",
              p: "3px 12px",
              mb: "10px",
              fontWeight: 500,
            }}
          >
            Price Breakdown
          </Typography>
          {type === "before"
            ? sortByPaxType(flightData?.priceBreakdown)?.map((item, index) => (
                <PassengerPriceBreakdown
                  key={index}
                  item={item}
                  isNotEquals={isNotEquals}
                />
              ))
            : sortByPaxType(flightData?.details?.priceBreakdown)?.map(
                (item, index) => (
                  <PassengerPriceBreakdown
                    key={index}
                    item={item}
                    isNotEquals={isNotEquals}
                  />
                )
              )}

          <Box sx={priceStyle.container}>
            <Typography sx={priceStyle.value}>Total Base</Typography>
            <Typography sx={priceStyle.value}>
              {isNotEquals
                ? "Will be decided"
                : type === "before"
                  ? flightData?.priceBreakdown?.length
                    ? flightData.priceBreakdown
                        .reduce(
                          (acc, passenger) => acc + passenger.totalBaseFare,
                          0
                        )
                        ?.toLocaleString("en-IN") + " BDT"
                    : "0"
                  : flightData?.details?.priceBreakdown?.length
                    ? flightData.details.priceBreakdown
                        .reduce(
                          (acc, passenger) => acc + passenger.totalBaseFare,
                          0
                        )
                        ?.toLocaleString("en-IN") + " BDT"
                    : "0"}
            </Typography>
          </Box>
          <Box sx={priceStyle.container}>
            <Typography sx={priceStyle.value}>Total Taxes</Typography>
            <Typography sx={priceStyle.value}>
              {isNotEquals
                ? "Will be decided"
                : type === "before"
                  ? flightData?.priceBreakdown?.length
                    ? flightData?.priceBreakdown
                        .reduce(
                          (acc, passenger) => acc + passenger.totalTaxAmount,
                          0
                        )
                        ?.toLocaleString("en-IN") + " BDT"
                    : "0"
                  : flightData?.details?.priceBreakdown?.length
                    ? flightData?.details?.priceBreakdown
                        .reduce(
                          (acc, passenger) => acc + passenger.totalTaxAmount,
                          0
                        )
                        ?.toLocaleString("en-IN") + " BDT"
                    : "0"}{" "}
            </Typography>
          </Box>
          <Box sx={priceStyle.container}>
            <Typography sx={priceStyle.value}>
              Customer Invoice Total
            </Typography>
            <Typography sx={priceStyle.value}>
              {isNotEquals
                ? "Will be decided"
                : flightData?.clientPrice?.toLocaleString("en-IN") + " BDT"}
            </Typography>
          </Box>
          <Box sx={priceStyle.container}>
            <Typography sx={{ ...priceStyle.value, color: "red" }}>
              {flightData?.commission < 0 ? "Additional Amount" : "Discount"}{" "}
            </Typography>
            <Typography sx={{ ...priceStyle.value, color: "red" }}>
              {isNotEquals
                ? "Will be decided"
                : Number(
                    Number(flightData?.commission).toFixed(0)
                  ).toLocaleString("en-IN") + " BDT"}
            </Typography>
          </Box>
          <Box sx={{ ...priceStyle.container, pt: 2 }}>
            <Typography noWrap sx={{ ...priceStyle.value, width: "70%" }}>
              After{" "}
              {flightData?.commission < 0 ? "Additional Amount" : "Discount"}{" "}
              Fare
            </Typography>
            <Typography sx={{ ...priceStyle.value }}>
              {isNotEquals
                ? "Will be decided"
                : Number(
                    (flightData?.clientPrice - flightData?.commission).toFixed(
                      2
                    )
                  ).toLocaleString("en-IN") + " BDT"}
            </Typography>
          </Box>
          <Box sx={{ ...priceStyle.container, pt: 2 }}>
            <Typography sx={{ ...priceStyle.value, color: "var(--green)" }}>
              AIT
            </Typography>
            <Typography sx={{ ...priceStyle.value, color: "var(--green)" }}>
              {isNotEquals
                ? "Will be decided"
                : Math.round(totals?.finalAit)?.toLocaleString("en-IN") +
                  " BDT"}
            </Typography>
          </Box>
          <Box sx={priceStyle.container}>
            <Typography
              noWrap sx={{ ...priceStyle.value, color: "var(--green)" }}
            >
              Extra Additional Amount
            </Typography>
            <Typography noWrap sx={{ ...priceStyle.value, color: "var(--green)" }}>
              {isNotEquals
                ? "Will be decided"
                : Math.round(totalAdditionalAmount)?.toLocaleString("en-IN") +
                  " BDT"}
            </Typography>
          </Box>
          <Box sx={priceStyle.container}>
            <Typography sx={priceStyle.value}>Agent Total</Typography>
            <Typography sx={priceStyle.value}>
              {isNotEquals
                ? "Will be decided"
                : type === "before"
                  ? (flightData?.brands[0]?.agentPrice || 0)?.toLocaleString(
                      "en-IN"
                    ) + " BDT"
                  : flightData?.agentPrice?.toLocaleString("en-IN") + " BDT"}
            </Typography>
          </Box>

          {type === "before" && (
            <Box sx={{ ...priceStyle.container, pt: 2 }}>
              <Typography sx={priceStyle.value}>
                {cmsData?.agentFare
                  ? "Agent Fare"
                  : cmsData?.customerFare
                    ? "Customer Fare"
                    : "Commission Fare"}
              </Typography>
              <Typography sx={priceStyle.value}>
                {flightData?.partialPayment?.totalPayedAmount
                  ? flightData?.partialPayment?.totalPayedAmount?.toLocaleString(
                      "en-IN"
                    )
                  : (
                      flightData?.partialPayment?.totalCharge +
                        flightData?.partialPayment?.totalPayableAmount ||
                      flightData?.[
                        cmsData?.agentFare
                          ? "agentPrice"
                          : cmsData?.customerFare
                            ? "clientPrice"
                            : "commission"
                      ]
                    )?.toLocaleString("en-IN")}{" "}
                BDT
              </Typography>
            </Box>
          )}

          {flightData?.status && flightData?.status !== "hold" && (
            <>
              <Box sx={{ ...priceStyle.container, pt: 2 }}>
                <Typography sx={priceStyle.value}>Paid Amount</Typography>
                <Typography sx={priceStyle.value}>
                  {flightData?.paymentStatus?.toLowerCase() === "partially paid"
                    ? flightData?.partialPayment?.totalPayedAmount?.toLocaleString(
                        "en-IN"
                      )
                    : flightData?.agentPrice?.toLocaleString("en-IN")}{" "}
                  BDT
                </Typography>
              </Box>

              <Box sx={priceStyle.container}>
                <Typography sx={priceStyle.value}>Due Amount</Typography>
                <Typography sx={priceStyle.value}>
                  {flightData?.partialPayment?.dueAmount
                    ? flightData?.partialPayment?.dueAmount?.toLocaleString(
                        "en-IN"
                      )
                    : 0}{" "}
                  BDT
                </Typography>
              </Box>
            </>
          )}

          {(flightData?.reIssue || isReissueOnProcess) && (
            <Box sx={{ ...priceStyle.container, pt: "15px" }}>
              <Typography sx={priceStyle.value}>Fare Difference</Typography>
              <Typography sx={priceStyle.value}>
                {flightData?.reIssue
                  ? (
                      flightData?.fareDifference?.totalFare?.newAgentFare -
                      flightData?.fareDifference?.totalFare?.oldAgentFare
                    )?.toLocaleString("en-IN")
                  : (
                      flightData?.details?.fareDifference?.totalFare
                        ?.newAgentFare -
                      flightData?.details?.fareDifference?.totalFare
                        ?.oldAgentFare
                    )?.toLocaleString("en-IN")}{" "}
                BDT
              </Typography>
            </Box>
          )}

          {(flightData?.status === "void request" ||
            flightData?.status === "void") && (
            <Box sx={{ ...priceStyle.container, pt: "15px" }}>
              <Typography sx={priceStyle.value}>
                Total Service Charge
              </Typography>
              <Typography sx={priceStyle.value}>
                {voidServiceCharge?.toLocaleString("en-IN")} BDT
              </Typography>
            </Box>
          )}

          {(flightData?.status === "void request" ||
            flightData?.status === "void") &&
            flightData?.partialPayment?.totalCharge && (
              <Box sx={priceStyle.container}>
                <Typography sx={priceStyle.value}>
                  Partial Payment Charge
                </Typography>
                <Typography sx={priceStyle.value}>
                  {flightData?.partialPayment?.totalCharge?.toLocaleString(
                    "en-IN"
                  )}{" "}
                  BDT
                </Typography>
              </Box>
            )}

          {(flightData?.status === "void request" ||
            flightData?.status === "void") && (
            <Box sx={priceStyle.container}>
              <Typography sx={priceStyle.value}>Void Amount</Typography>
              <Typography sx={priceStyle.value}>
                {agentVoidAmount?.toLocaleString("en-IN")} BDT
              </Typography>
            </Box>
          )}

          {(flightData?.status === "refund to be confirmed" ||
            flightData?.status === "refund" ||
            flightData?.status === "refund on process" ||
            flightData?.status === "refunding") && (
            <Box sx={{ ...priceStyle.container, pt: 2 }}>
              <Typography
                sx={{ ...priceStyle.value, color: "var(--primary-color)" }}
              >
                Total AIT
              </Typography>
              <Typography
                sx={{ ...priceStyle.value, color: "var(--primary-color)" }}
              >
                {ait?.toLocaleString("en-IN")} BDT
              </Typography>
            </Box>
          )}

          {(flightData?.reIssue ||
            flightData?.status === "refund to be confirmed" ||
            flightData?.status === "refund" ||
            flightData?.status === "refund on process" ||
            flightData?.status === "refunding" ||
            isReissueOnProcess) && (
            <Box sx={{ ...priceStyle.container }}>
              <Typography
                sx={{ ...priceStyle.value, color: "var(--primary-color)" }}
              >
                Total Airlines Charge
              </Typography>
              <Typography
                sx={{ ...priceStyle.value, color: "var(--primary-color)" }}
              >
                {airlinesCharge?.toLocaleString("en-IN")} BDT
              </Typography>
            </Box>
          )}

          {(flightData?.reIssue ||
            flightData?.status === "refund to be confirmed" ||
            flightData?.status === "refund" ||
            flightData?.status === "refund on process" ||
            flightData?.status === "refunding" ||
            isReissueOnProcess) && (
            <Box sx={priceStyle.container}>
              <Typography
                sx={{ ...priceStyle.value, color: "var(--primary-color)" }}
              >
                Total Service Charge
              </Typography>
              <Typography
                sx={{ ...priceStyle.value, color: "var(--primary-color)" }}
              >
                {(flightData?.status === "refund"
                  ? (status === "success" &&
                      refundAgentQuotationPrice?.serviceCharge) ||
                    0
                  : serviceCharge
                )?.toLocaleString("en-IN")}
              </Typography>
            </Box>
          )}

          {isReissueOnProcess && (
            <Box sx={priceStyle.container}>
              <Typography sx={priceStyle.value}>Reissue Payable</Typography>
              <Typography sx={priceStyle.value}>
                {flightData?.details?.fareDifference?.totalFare?.reIssuePayable?.toLocaleString(
                  "en-IN"
                )}{" "}
                BDT
              </Typography>
            </Box>
          )}

          {(flightData?.status === "refund to be confirmed" ||
            flightData?.status === "refund" ||
            flightData?.status === "refund on process" ||
            flightData?.status === "refunding") && (
            <Box sx={{ ...priceStyle.container, pt: 2 }}>
              <Typography sx={priceStyle.value}>Refund Amount</Typography>
              <Typography sx={priceStyle.value}>
                {(flightData?.status === "refund"
                  ? refundAgentQuotationPrice?.refundedAmount || 0
                  : totalRefundAmount
                )?.toLocaleString("en-IN")}{" "}
                BDT
              </Typography>
            </Box>
          )}

          {pathname !== "/dashboard/airbooking" && (
            <>
              <Box sx={{ p: "15px 12px" }}>
                <Box
                  onClick={() => {
                    setOpenMarkup(true);
                    setTypeMarkup("pricebreakdown");
                  }}
                  sx={{
                    color: "var(--primary-color)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--primary-color)",
                    cursor: "pointer",
                  }}
                >
                  <Typography sx={{ fontSize: "0.813rem", fontWeight: "500" }}>
                    Add Markup with Base Fare
                  </Typography>
                  <AddIcon />
                </Box>
              </Box>
              <Typography
                sx={{
                  bgcolor: "var(--primary-color)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  p: "3px 12px",
                  mb: "10px",
                  fontWeight: 500,
                }}
              >
                Markup
              </Typography>
              {sortByPaxType(paxMarkup)?.map((item) => (
                <PassengerMarkupPriceBreakdown
                  markupData={markupData}
                  item={item}
                />
              ))}
              <Box sx={priceStyle.container}>
                <Typography sx={priceStyle.value}>Agent Profit</Typography>
                <Typography sx={priceStyle.value}>
                  {grandTotal.toLocaleString("en-IN")} BDT
                </Typography>
              </Box>
              <Box sx={priceStyle.container}>
                <Typography sx={priceStyle.value}>
                  After Markup Agent total
                </Typography>
                <Typography sx={priceStyle.value}>
                  {(grandTotal + flightData?.agentPrice).toLocaleString(
                    "en-IN"
                  )}{" "}
                  BDT
                </Typography>
              </Box>
            </>
          )}
        </Collapse>
      </Box>

      <Dialog
        TransitionComponent={Zoom}
        open={openMarkup}
        onClose={() => setOpenMarkup(!openMarkup)}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 2,
            position: "relative",
            minWidth: "500px",
          }}
        >
          <MakeQuotation
            flightData={flightData}
            paxMarkup={paxMarkup}
            setPaxMarkup={setPaxMarkup}
            title={"Add Markup"}
            bookingId={flightData?.id}
            setOpen={setOpenMarkup}
            typeMarkup={typeMarkup}
            setShowDownloadLink={setShowDownloadLink}
            singleBooking={singleBooking}
            passengers={passengers}
            agentData={agentData}
          />
          <Box
            onClick={() => setOpenMarkup(false)}
            sx={{
              cursor: "pointer",
              position: "absolute",
              top: "20px",
              right: "20px",
            }}
          >
            <CloseIcon />
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export const priceStyle = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    pt: "4px",
    px: "12px",
    // mb: "5px",
  },
  value: {
    color: "gray",
    fontSize: "0.813rem",
    fontWeight: "500",
  },
};

export default PriceBreakdown;
