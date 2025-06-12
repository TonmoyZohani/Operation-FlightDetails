import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Box,
  Button,
  Grid,
  Skeleton,
  SwipeableDrawer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import commaNumber from "comma-number";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import { ReactComponent as AirplanIcon } from "../../images/svg/airplane.svg";
import { isDateWithinRange } from "../../utils/functions";
import {
  setClearAllStates,
  setPartialChargeData,
} from "../AirBooking/airbookingSlice";
import CustomToast from "../Alert/CustomToast";
import { allFares } from "../FlightAfterSearch/ModifySearch";
import BookingLoader from "../Loader/BookingLoader";
import PendingLoader from "../Loader/PendingLoader";
import "./ViewFare.css";
import AccurateFareRules from "../AccurateFareRules/AccurateFareRules";

const badgeStyle = {
  height: "23px",
  width: "23px",
  borderRadius: "50px",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "12px",
};

const fareRulesStyle = {
  bgcolor: "var(--primary-color)",
  borderRadius: "2px",
  position: "absolute",
  right: "0",
  top: "-12px",
  px: "10px",
  py: 0.5,
};

export const dialogStyles = {
  box: {
    bgcolor: "#fff",
    width: {
      xs: "100%",
      lg: "600px",
    },
    height: "auto",
  },
  header: {
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid var(--border)",
    px: "10px",
  },
  sectionTitle: {
    fontSize: {
      xs: "11px",
      sm: "18px",
    },
    fontWeight: "500",
  },
  gridContainer: {
    p: "10px",
  },
  fareRow: {
    height: "50px",
    display: "flex",
    bgcolor: "#fff",
    pl: {
      lg: "10px",
      xs: "5px",
    },
    py: "2px",
    flexDirection: "column",
    borderBottom: "1px solid #E2EAF1",
  },
  fareText: {
    fontSize: {
      xs: "9px",
      sm: "13px",
      lg: "15px",
    },
    py: 0,
    fontWeight: "500",
  },
  noteText: {
    fontSize: {
      xs: "9px",
      sm: "12px",
      lg: "13px",
    },
    color: "#B7B7BB",
  },
  section: {
    height: "45px",
    display: "flex",
    alignItems: "center",
    pl: {
      lg: "10px",
      xs: "5px",
    },
    bgcolor: "#fff",
    borderBottom: "1px solid #E2EAF1",
  },
  importantNotice: {
    bgcolor: "#FFE6EB",
    border: "1px solid var(--primary-color)",
    borderRadius: "3px",
    mt: "15px",
    p: "6px",
  },
  spanImportant: {
    fontWeight: "500",
  },
};

const NewViewFareCard = ({
  flightData,
  modifiedBrands,
  searchType,
  totalPassenger,
  segmentsList,
  cabin,
  isFareLoading,
  airPriceLoading,
  handleFetchAndBooking,
  handleFetchAdvancedBooking,
  flightAfterSearch,
  errorMessage,
  setErrorMessage,
  setAirPriceLoading,
  flightBrand,
  setFlightBrand,
  fareCard,
  crrItenary,
  splitFlightArr,

  handleBrandClick
}) => {
  const { cmsData } = useSelector((state) => state.flightAfter);
  const [cardLoading, setCardLoading] = useState(false);

  const isPartialPayable =
    Array.isArray(modifiedBrands) &&
    modifiedBrands.length > 0 &&
    modifiedBrands.every((item) =>
      Array.isArray(item.structure) && item.structure.length > 0
        ? item.structure
            .filter(
              (structureItem) =>
                structureItem.name.toLowerCase() === "refund before departure"
            )
            .every((structureItem) => structureItem.amount !== null)
        : false
    );

  const fareItems =
    flightAfterSearch === "reissue-search"
      ? [
          { title: "Baggage" },
          { title: "Meals" },
          {
            title: "Reissue Before Departure",
            subtitle: "Reissue After Departure",
          },
          {
            title: "Refund Before Departure",
            subtitle: "Refund After Departure",
          },
          { title: "Booking Class" },
          { title: "Additional Info" },
          { title: "Reissue Payable" },
        ]
      : [
          { title: "Baggage" },
          { title: "Meals" },
          {
            title: "Reissue Before Departure",
            subtitle: "Reissue After Departure",
          },
          {
            title: "Refund Before Departure",
            subtitle: "Refund After Departure",
          },
          { title: "Booking Class" },
          { title: "Additional Info" },
          ...(!isDateWithinRange(flightData?.route?.[0]?.departureDate) ||
          (flightData?.partialPayment &&
            flightData?.immediateIssue &&
            isPartialPayable)
            ? []
            : [{ title: "Partial Payable" }]),
          {
            title: cmsData?.agentFare
              ? "Agent Fare"
              : cmsData?.customerFare
                ? "Customer Fare"
                : "Commission Fare",
          },
        ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: searchType === "split" ? 2 : 3,
    slidesToScroll: 1,
    prevArrow: <SliderBtn type={"prev"} />,
    nextArrow: <SliderBtn type={"next"} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: searchType === "split" ? 2 : 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (cardLoading) {
    return <PendingLoader />;
  }

  return (
    <Box>
      <Grid container columnSpacing={"10px"}>
        {(searchType === "regular" || searchType === "split") && (
          <Grid item lg={searchType === "split" ? 3 : 2.5}>
            <Box
              sx={{
                borderRadius: "3px",
                bgcolor: "#e5f6fd",
                py: "7px",
                px: "10px",
                height: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: "500",
                  color: "var(--secondary-color)",
                }}
              >
                Fare Name
              </Typography>

              <Box sx={{ mt: "10px" }}>
                {fareItems.map((item, index) => (
                  <FareItem
                    key={index}
                    title={item.title}
                    subtitle={item.subtitle}
                    isLast={index === fareItems.length - 1}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        )}

        {/* Slider Starts */}
        {Array.isArray(modifiedBrands) && modifiedBrands.length > 3 ? (
          <Grid item lg={searchType === "split" ? 9 : 9.5}>
            <Box
              sx={{
                ".slick-slide > div": {
                  marginRight: "10px !important",
                  marginLeft: "0px",
                },
                ".slick-prev": {
                  background: "none !important",
                  left: "664.5px",
                  top: "260px",
                },
                ".slick-next": {
                  background: "none !important",
                  left: "664.5px",
                  top: "220px",
                },
                ".slick-prev:before": {
                  color: "var(--secondary-color)",
                  fontSize: "26px",
                },
                ".slick-next:before": {
                  color: "var(--secondary-color)",
                  fontSize: "26px",
                },
                ".slick-dots li button": {
                  display: "none",
                },
              }}
            >
              <Slider {...sliderSettings}>
                {modifiedBrands?.map((item, index) => {
                  const isSelected =
                    flightBrand?.[crrItenary]?.[0]?.brandId === item?.brandId;

                  return (
                    <Box
                      key={index}
                      sx={{
                        borderRadius: "3px",
                        border: isSelected
                          ? "2px solid var(--primary-color)"
                          : "1px solid #DDDDDD",
                        py: "7px",
                        px: "10px",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                      // onClick={() =>
                      //   setFlightBrand((prev) => {
                      //     const updated = Array.isArray(prev) ? [...prev] : [];
                      //     while (updated.length <= crrItenary) {
                      //       updated.push([]);
                      //     }

                      //     updated[crrItenary] = [item];
                      //     return updated;
                      //   })
                      // }
                      onClick={() =>
                        handleBrandClick(item)
                      }
                    >
                      <FareCard
                        title="Regular Fare"
                        item={item}
                        flag={index}
                        flightData={flightData}
                        modifiedBrands={modifiedBrands}
                        searchType={searchType}
                        totalPassenger={totalPassenger}
                        cabin={cabin}
                        segmentsList={segmentsList}
                        isFareLoading={isFareLoading}
                        airPriceLoading={airPriceLoading}
                        setAirPriceLoading={setAirPriceLoading}
                        handleFetchAndBooking={handleFetchAndBooking}
                        flightAfterSearch={flightAfterSearch}
                        brandId={item?.brandId}
                        setCardLoading={setCardLoading}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                        setFlightBrand={setFlightBrand}
                        bookColor={isSelected}
                      />
                    </Box>
                  );
                })}
              </Slider>
            </Box>
          </Grid>
        ) : Array.isArray(modifiedBrands) && modifiedBrands.length > 0 ? (
          modifiedBrands.map((item, index) => {
            const isSelected =
              flightBrand?.[crrItenary]?.[0]?.brandId === item?.brandId;

            return (
              <Grid
                key={index}
                item
                lg={
                  searchType === "advanced"
                    ? 12
                    : searchType === "split"
                      ? 4.5
                      : 3.16
                }
              >
                <Box
                  sx={{
                    borderRadius: "3px",
                    border:
                      isSelected || searchType === "advanced"
                        ? "2px solid var(--primary-color)"
                        : "1px solid #DDDDDD",
                    py: "7px",
                    px: "10px",
                    cursor: "pointer",
                  }}
                  // onClick={() =>
                  //   setFlightBrand((prev) => {
                  //     const updated = Array.isArray(prev) ? [...prev] : [];
                  //     while (updated.length <= crrItenary) {
                  //       updated.push([]);
                  //     }

                  //     updated[crrItenary] = [item];
                  //     return updated;
                  //   })
                  // }
                  onClick={() =>
                    handleBrandClick(item)
                  }
                >
                  <FareCard
                    title="Regular Fare"
                    item={item}
                    flag={index}
                    flightData={flightData}
                    modifiedBrands={modifiedBrands}
                    searchType={searchType}
                    totalPassenger={totalPassenger}
                    cabin={cabin}
                    segmentsList={segmentsList}
                    isFareLoading={isFareLoading}
                    airPriceLoading={airPriceLoading}
                    setAirPriceLoading={setAirPriceLoading}
                    handleFetchAndBooking={handleFetchAndBooking}
                    flightAfterSearch={flightAfterSearch}
                    brandId={item?.brandId}
                    setCardLoading={setCardLoading}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    handleFetchAdvancedBooking={handleFetchAdvancedBooking}
                    setFlightBrand={setFlightBrand}
                    crrItenary={crrItenary}
                    bookColor={isSelected}
                    fareCard={fareCard}
                  />
                </Box>
              </Grid>
            );
          })
        ) : (
          <Typography>No fare brands available.</Typography>
        )}

        {/* Slider Ends */}
      </Grid>
    </Box>
  );
};

const FareItem = ({ title, subtitle, isLast }) => (
  <Box
    sx={{
      borderBottom: isLast ? "none" : "1px solid var(--border-color)",
      py: "10px",
    }}
  >
    <Typography sx={{ fontSize: "13px", color: "#525371" }}>{title}</Typography>
    {subtitle && (
      <Typography sx={{ fontSize: "13px", color: "#525371" }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const FareCard = ({
  item,
  flightData,
  searchType,
  flag,
  modifiedBrands,
  isFareLoading,
  airPriceLoading,
  handleFetchAndBooking,
  handleFetchAdvancedBooking,
  flightAfterSearch,
  errorMessage,
  setErrorMessage,
  setAirPriceLoading,
  setFlightBrand,
  crrItenary,
  bookColor,
  fareCard,
}) => {
  const [partialDialogBoxOpen, setPartialDialogBoxOpen] = useState(false);
  const dispatch = useDispatch();
  const { cmsData } = useSelector((state) => state.flightAfter);
  const { partialChargeData } = useSelector((state) => state.flightBooking);
  const [showFareRules, setShowFareRules] = useState(false);
  const [open, setOpen] = useState(false);

  const [modalType, setModalType] = useState("");
  const { jsonHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const queryClient = useQueryClient();

  // TODO: Partialpayment request mutate
  const { mutate: partialPayMutate, status: partialPayStatus } = useMutation({
    mutationFn: (payload) =>
      axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/fare-rule`,
        payload,
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        dispatch(setPartialChargeData(data?.data?.data[0]));
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenPartialDialog = () => setPartialDialogBoxOpen(true);
  const handleClosePartialDialog = () => setPartialDialogBoxOpen(false);

  const handleShowFareRules = () => {
    setShowFareRules(true);
  };

  const handleDrawerClose = () => {
    setShowFareRules(false);
  };

  const handlePartialBooking = () => {
    handleOpenPartialDialog();

    const bodyData = {
      brandId: item?.brandId,
      data: flightData?.uuid,
      agentPrice: item?.agentPrice,
      travelDate: moment(flightData?.route?.[0]?.departureDate).format(
        "YYYY-MM-DD"
      ),
      journeyType: flightData?.journeyType,
      passengers: flightData?.priceBreakdown?.map((passenger) => ({
        type: passenger.paxType,
        count: passenger.paxCount,
        ages: passenger?.age === null ? [] : passenger?.age,
      })),
    };

    partialPayMutate(bodyData);
  };

  console.log(flightData);

  const getFareRuleDetails = (ruleType) => {
    const structure = modifiedBrands[flag]?.structure || [];
    const fareDetails = structure
      .filter((ite) => ite.name.toLowerCase() === ruleType)
      .map((ite, index) => (
        <span key={index}>
          {ite.convertedAmount ? (
            <>
              {ite.convertedAmount.toLocaleString("en-IN")}{" "}
              {ite.convertedCurrencyCode}{" "}
              {modalType === "reissue" && " + Will be Decided"}
            </>
          ) : (
            <span
              style={{ color: "var(--primary-color)" }}
              onClick={() => setShowFareRules(true)}
            >
              See Airline Policy
            </span>
          )}
        </span>
      ));

    return fareDetails.length ? (
      fareDetails
    ) : (
      <span
        style={{ color: "var(--primary-color)" }}
        onClick={() => setShowFareRules(true)}
      >
        See Airline Policy
      </span>
    );
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          {item?.brandName}
          <span style={{ color: "var(--primary-color)", paddingLeft: "5px" }}>
            {item?.brandId}
          </span>
        </Typography>

        <Tooltip title={item?.isRefundable}>
          <Box
            sx={{
              ...badgeStyle,
              bgcolor:
                item?.isRefundable === undefined
                  ? "#F6F6F6"
                  : item.isRefundable === "Non Refundable"
                    ? "var(--primary-color)"
                    : "var(--green)",
              color: item?.isRefundable === undefined ? "#888888" : "#fff",
            }}
          >
            R
          </Box>
        </Tooltip>
      </Box>

      <Box>
        {searchType !== "advanced" && (
          <Typography sx={{ fontSize: "13px", color: "var(--primary-color)" }}>
            {item?.additionalFare}
          </Typography>
        )}

        {Array.isArray(modifiedBrands[flag]?.baggageFeatures) &&
          modifiedBrands[flag].baggageFeatures.length > 0 && (
            <Tooltip
              title={
                <ul
                  style={{
                    paddingLeft: "16px",
                    margin: 0,
                    backgroundColor: "#F6F6F6 !important",
                  }}
                >
                  {modifiedBrands[flag].baggageFeatures.map(
                    (feature, index) => (
                      <li
                        key={index}
                        style={{ fontSize: "12px", color: "#fff" }}
                      >
                        {feature.message}
                      </li>
                    )
                  )}
                </ul>
              }
              arrow
              componentsProps={{
                tooltip: {
                  sx: { color: "black", whiteSpace: "normal", padding: "8px" },
                },
              }}
            >
              <span
                style={{
                  color: "var(--secondary-color)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #DDDDDD",
                }}
              >
                <span
                  style={{
                    color: "#888888",
                    fontSize: "13px",
                    paddingBottom: "8px",
                  }}
                >
                  Baggage
                </span>
                <u style={{ fontSize: "13px" }}>More</u>
              </span>
            </Tooltip>
          )}

        <Box sx={{ borderBottom: "1px solid #DDDDDD", py: "9px" }}>
          <Tooltip
            title={item?.meals && item.meals.length > 30 ? item.meals : ""}
          >
            <span
              style={{
                color: "var(--secondary-color)",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "#888888" }}> Meals </span>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#888888",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                {item?.meals?.length > 30
                  ? `${item.meals.substring(0, 27)}...`
                  : item?.meals || "Meals and Beverage"}{" "}
              </Typography>
            </span>
          </Tooltip>
        </Box>
        <Tooltip
          placement="top"
          title="Click Fare Rules Details to View Advance Fare"
          PopperProps={{
            modifiers: [{ name: "offset", options: { offset: [0, -20] } }],
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid #DDDDDD",
              py: "10px",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--secondary-color)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {modifiedBrands[flag]?.structure?.length > 0 ? (
                modifiedBrands[flag]?.structure
                  .filter(
                    (item) =>
                      item.name.toLowerCase() === "reissue before departure"
                  )
                  .map((item, index) => (
                    <span
                      key={index}
                      style={{
                        color: "var(--secondary-color)",
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {searchType === "advanced" && (
                        <span style={{ color: "#888888" }}>{item?.name}: </span>
                      )}

                      {item.convertedAmount ? (
                        <>
                          {item?.convertedAmount.toLocaleString("en-IN")}{" "}
                          {item?.convertedCurrencyCode}
                        </>
                      ) : (
                        <span
                          style={{ color: "var(--primary-color)" }}
                          onClick={() => setShowFareRules(true)}
                        >
                          Airline Policy
                        </span>
                      )}
                    </span>
                  ))
              ) : (
                <span
                  style={{ color: "var(--primary-color)" }}
                  onClick={() => setShowFareRules(true)}
                >
                  Airline Policy
                </span>
              )}
            </Typography>

            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--secondary-color)",
                pb: "10px",
              }}
            >
              {modifiedBrands[flag]?.structure?.length > 0 ? (
                modifiedBrands[flag]?.structure
                  .filter(
                    (item) =>
                      item.name.toLowerCase() === "reissue after departure"
                  )
                  .map((item, index) => (
                    <span
                      key={index}
                      style={{
                        color: "var(--secondary-color)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {searchType === "advanced" && (
                        <span style={{ color: "#888888" }}>{item?.name}: </span>
                      )}
                      {item?.convertedAmount ? (
                        <>
                          {item?.convertedAmount.toLocaleString("en-IN")}{" "}
                          {item?.convertedCurrencyCode}
                        </>
                      ) : (
                        <span
                          style={{ color: "var(--primary-color)" }}
                          onClick={() => setShowFareRules(true)}
                        >
                          Airline Policy
                        </span>
                      )}
                    </span>
                  ))
              ) : (
                <span
                  style={{ color: "var(--primary-color)" }}
                  onClick={() => setShowFareRules(true)}
                >
                  Airline Policy
                </span>
              )}
            </Typography>
          </Box>
        </Tooltip>

        <Box
          sx={{
            borderBottom: "1px solid #DDDDDD",
            py: "10px",
            position: "relative",
            cursor: "pointer",
          }}
        >
          {isFareLoading ? (
            <Box sx={fareRulesStyle}>
              <Typography
                sx={{
                  fontSize: "11px",
                  width: "fit-content",
                  color: "white",
                  textAlign: "left",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                Loading.....
              </Typography>
            </Box>
          ) : (
            !!modifiedBrands[flag]?.nonStructure && (
              <Box sx={fareRulesStyle}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    width: "fit-content",
                    color: "white",
                    textAlign: "left",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShowFareRules()}
                >
                  Fare Rule Details
                </Typography>
              </Box>
            )
          )}

          <Tooltip
            placement="bottom"
            title="Click Fare Rules Details to View Advance Fare"
            PopperProps={{
              modifiers: [{ name: "offset", options: { offset: [0, -5] } }],
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--secondary-color)",
                pt: "10px",
              }}
            >
              {modifiedBrands[flag]?.structure?.length > 0 ? (
                modifiedBrands[flag]?.structure
                  .filter(
                    (item) =>
                      item.name.toLowerCase() === "refund before departure"
                  )
                  .map((item, index) => (
                    <span
                      key={index}
                      style={{
                        color: "var(--secondary-color)",
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {searchType === "advanced" && (
                        <span style={{ color: "#888888" }}>{item?.name}: </span>
                      )}
                      {item?.convertedAmount ? (
                        <>
                          {item?.convertedAmount.toLocaleString("en-IN")}{" "}
                          {item?.convertedCurrencyCode}
                        </>
                      ) : (
                        <span
                          style={{ color: "var(--primary-color)" }}
                          onClick={() => setShowFareRules(true)}
                        >
                          Airline Policy
                        </span>
                      )}
                    </span>
                  ))
              ) : (
                <span
                  style={{ color: "var(--primary-color)" }}
                  onClick={() => setShowFareRules(true)}
                >
                  Airline Policy
                </span>
              )}
            </Typography>

            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--secondary-color)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {modifiedBrands[flag]?.structure?.length > 0 ? (
                modifiedBrands[flag]?.structure
                  .filter(
                    (item) =>
                      item.name.toLowerCase() === "refund after departure"
                  )
                  .map((item, index) => (
                    <span
                      key={index}
                      style={{
                        color: "var(--secondary-color)",
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {searchType === "advanced" && (
                        <span style={{ color: "#888888" }}>{item?.name}: </span>
                      )}
                      {item?.convertedAmount ? (
                        <>
                          {item?.convertedAmount?.toLocaleString("en-IN")}{" "}
                          {item?.convertedCurrencyCode}
                        </>
                      ) : (
                        <span
                          style={{ color: "var(--primary-color)" }}
                          onClick={() => setShowFareRules(true)}
                        >
                          Airline Policy
                        </span>
                      )}
                    </span>
                  ))
              ) : (
                <span
                  style={{ color: "var(--primary-color)" }}
                  onClick={() => setShowFareRules(true)}
                >
                  Airline Policy
                </span>
              )}

              {/* <span
                style={{
                  color: "var(--secondary-color)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setModalType("refund");
                  handleOpen();
                }}
              >
                more
              </span> */}
            </Typography>
          </Tooltip>
        </Box>

        <Box sx={{ borderBottom: "1px solid #DDDDDD", py: "10px" }}>
          <Typography
            sx={{
              fontSize: "13px",
              color: "var(--secondary-color)",
              fontWeight: "600",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "#888" }}>Booking Class</span>
            <span style={{ color: "var(--primary-color)" }}>
              {item?.seatInfo?.map((code, i) => (
                <React.Fragment key={i}>
                  {code?.bookingClass}
                  {i < item?.seatInfo.length - 1 && ", "}
                </React.Fragment>
              ))}
            </span>
          </Typography>
        </Box>

        <Box
          sx={{
            py: "10px",
            display: "flex",
            borderBottom: "1px solid #DDDDDD",
            justifyContent: "flex-end",
          }}
        >
          {!modifiedBrands[flag]?.othersFeatures ||
          modifiedBrands[flag].othersFeatures.length === 0 ? (
            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--primary-color)",
                fontWeight: "500",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span style={{ color: "#888" }}>Features</span>
              <span style={{ color: "var(--primary-color)" }}>
                No extra features
              </span>
            </Typography>
          ) : (
            modifiedBrands[flag].othersFeatures.length > 0 && (
              <Tooltip
                title={
                  <Box>
                    <Table
                      size="small"
                      sx={{
                        "& .MuiTableCell-root": {
                          fontSize: "11px",
                          padding: "15px",
                        },
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="left"
                            sx={{
                              fontWeight: "bold",
                              width: "33%",
                              fontSize: "12px",
                              color: "var(--secondary-color)",
                            }}
                          >
                            Features
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              fontWeight: "bold",
                              width: "33%",
                              fontSize: "12px",
                              color: "var(--secondary-color)",
                            }}
                          >
                            Code
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              fontWeight: "bold",
                              width: "33%",
                              fontSize: "12px",
                              color: "var(--secondary-color)",
                            }}
                          >
                            Payment Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {modifiedBrands[flag].othersFeatures.map(
                          (feature, index) => (
                            <TableRow key={index}>
                              <TableCell align="left">
                                {feature?.message || "N/A"}
                              </TableCell>
                              <TableCell align="left">
                                {feature?.code?.toUpperCase()}
                              </TableCell>
                              <TableCell align="left" sx={{ width: "40%" }}>
                                {feature.application || "Unknown"}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                }
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "#FFF",
                      color: "black",
                      whiteSpace: "normal",
                      padding: "8px",
                      fontSize: "11px",
                      maxWidth: "400px",
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 4px 12px",
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "var(--primary-color)",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  View More
                </Typography>
              </Tooltip>
            )
          )}
        </Box>

        {flightAfterSearch !== "reissue-search" &&
          (isFareLoading ? (
            <Box
              sx={{
                borderBottom: "1px solid #DDDDDD",
                py: "10px",
                display: "flex",
                justifyContent: "right",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "var(--primary-color)",
                  fontWeight: "500",
                }}
              >
                Loading...
              </Typography>
            </Box>
          ) : isDateWithinRange(flightData?.route?.[0]?.departureDate) &&
            !flightData?.immediateIssue &&
            flightData?.partialPayment &&
            modifiedBrands[flag]?.structure?.length > 0 &&
            modifiedBrands[flag]?.structure
              ?.filter((item) =>
                item?.name?.toLowerCase()?.includes("refund before departure")
              )
              ?.every((item) => item?.amount !== null) ? (
            <Box
              sx={{
                borderBottom: "1px solid #DDDDDD",
                py: "10px",
                display: "flex",
                justifyContent: "right",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  py: 0.5,
                  fontSize: "11px",
                  bgcolor: "#ff5f0f",
                  width: "fit-content",
                  px: 1,
                  color: "white",
                  textAlign: "left",
                  borderRadius: "2px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
                onClick={handlePartialBooking}
              >
                <span style={{ color: "#888" }}> Partial Payment</span>
                <span style={{ color: "var(--primary-color)" }}>
                  Partial Payment Details
                </span>
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                borderBottom: "1px solid #DDDDDD",
                py: "10px",
                display: "flex",
                justifyContent: "right",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "var(--primary-color)",
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span style={{ color: "#888" }}> Partial Payment</span>
                <span style={{ color: "var(--primary-color)" }}>
                  Not Eligible
                </span>
              </Typography>
            </Box>
          ))}

        <Box sx={{ pb: "5px" }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#333333",
                  pt: "5px",
                }}
              >
                {flightAfterSearch === "reissue-search" ? (
                  <>
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "20px",
                      }}
                    >
                      {flightData?.autoReissue === false
                        ? "Will Be Decided"
                        : `${item?.reissuePayable?.toLocaleString("en-IN")} BDT`}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ fontWeight: "600", fontSize: "20px" }}>
                      {searchType === "advanced" ? (
                        `${commaNumber(flightData[crrItenary]?.agentPrice || flightData?.agentPrice)} BDT`
                      ) : (
                        <>
                          {commaNumber(
                            item?.[
                              cmsData?.agentFare
                                ? "agentPrice"
                                : cmsData?.customerFare
                                  ? "clientPrice"
                                  : "commission"
                            ]
                          )}{" "}
                          BDT
                        </>
                      )}
                    </span>
                  </>
                )}
              </Typography>

              {flightAfterSearch !== "reissue-search" && (
                <Tooltip
                  placement="left-start"
                  TransitionComponent={Zoom}
                  title={
                    <>
                      {allFares?.map((fare, i) => {
                        return (
                          <Box key={i}>
                            <Typography
                              sx={{
                                display:
                                  cmsData[fare?.value] === true && "none",
                              }}
                            >
                              {fare?.label} :{" "}
                              {item?.[fare?.priceProp]?.toLocaleString("en-IN")}{" "}
                              BDT
                            </Typography>
                          </Box>
                        );
                      })}
                    </>
                  }
                  arrow
                >
                  <ErrorIcon
                    sx={{
                      fontSize: "18px",
                      color: "var(--light-gray)",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          </Box>

          {!(
            searchType === "split" ||
            (searchType === "advanced" && fareCard === "afterFare")
          ) && (
            <Button
              sx={{
                bgcolor:
                  bookColor || flightData?.immediateIssue
                    ? "var(--primary-color)"
                    : "var(--secondary-color)",
                color: "var(--white)",
                width: "100%",
                height: "29px",
                fontSize: "12px",
                mt: "5px",
                textTransform: "uppercase",
                "&:hover": {
                  bgcolor:
                    bookColor || flightData?.immediateIssue
                      ? "var(--secondary-color)"
                      : "var(--primary-color)",
                },
              }}
              onClick={() => {
                if (searchType === "advanced") {
                  handleFetchAdvancedBooking(modifiedBrands?.[flag], flag);
                } else {
                  handleFetchAndBooking(modifiedBrands?.[flag], flag);
                }

                dispatch(setClearAllStates());
                setFlightBrand({});
              }}
              disabled={
                airPriceLoading === flag ||
                modifiedBrands?.[flag]?.isBook === false
              }
            >
              {flightData?.immediateIssue ? "Instant Purchase" : "Book"}
            </Button>
          )}
        </Box>
      </Box>

      {((modifiedBrands[flag]?.structure &&
        modifiedBrands[flag]?.nonStructure &&
        modifiedBrands[flag].nonStructure.length > 0) ||
        modifiedBrands[flag]?.accurateFareRules?.length > 0) && (
        <FareDetails
          showFareRules={showFareRules}
          nonStructure={modifiedBrands[flag].nonStructure}
          accurateFareRules={modifiedBrands[flag].accurateFareRules}
          flightData={flightData}
          handleDrawerClose={handleDrawerClose}
          brandName={modifiedBrands[flag]?.brandName}
        />
      )}

      {airPriceLoading === flag && (
        <BookingLoader
          brandName={item?.brandName}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setAirPriceLoading={setAirPriceLoading}
        />
      )}

      <Dialog
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "700px" },
            minWidth: {
              xs: "90%",
              sm: "50%",
            },
            borderRadius: "8px",
          },
        }}
      >
        <Box sx={{ ...dialogStyles.box, p: 2, width: "100%" }}>
          <Grid container>
            <Grid item lg={12} sx={dialogStyles.header}>
              <Typography sx={dialogStyles.sectionTitle}>
                {modalType === "reissue"
                  ? `Reissue Charge - ${item?.brandName}`
                  : `Refund Charge - ${item?.brandName}`}
              </Typography>
              <CloseIcon
                onClick={() => handleClose()}
                sx={{ color: "var(--primary-color)", cursor: "pointer" }}
              />
            </Grid>

            <Grid container item lg={12} sx={dialogStyles.gridContainer}>
              <Grid
                container
                item
                lg={12}
                sx={{
                  width: "100%",
                  border: "1px solid #E2EAF1",
                  borderRadius: "3px",
                }}
              >
                <Grid
                  item
                  lg={12}
                  sx={{
                    ...dialogStyles.section,
                    bgcolor: "#F6F6F6",
                    pl: "10px",
                  }}
                >
                  <Typography sx={dialogStyles.fareText}>
                    <span style={{ color: "var(--primary-color)" }}>
                      {(() => {
                        const routes = flightData?.route || [];
                        const length = routes.length;
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
                  </Typography>
                </Grid>

                {/* Timeframe & Fees Section */}
                <Grid item lg={4} sx={dialogStyles.fareRow}>
                  <Typography sx={dialogStyles.fareText}>
                    Time Schedule
                  </Typography>
                  <Typography sx={dialogStyles.noteText}>
                    (From scheduled flight departure)
                  </Typography>
                </Grid>
                <Grid
                  item
                  lg={4}
                  sx={{
                    ...dialogStyles.fareRow,
                    borderLeft: "1px solid #E2EAF1",
                  }}
                >
                  <Typography sx={dialogStyles.fareText}>
                    Airline Fee {modalType === "reissue" && "+ Fare Difference"}
                  </Typography>
                  <Typography sx={dialogStyles.noteText}>
                    (Per Passenger)
                  </Typography>
                </Grid>
                <Grid
                  item
                  lg={4}
                  sx={{
                    ...dialogStyles.fareRow,
                    borderLeft: "1px solid #E2EAF1",
                  }}
                >
                  <Typography sx={dialogStyles.fareText}>
                    Fly Far International Fee
                  </Typography>
                  <Typography sx={dialogStyles.noteText}>
                    (Per Passenger)
                  </Typography>
                </Grid>

                {/* Before and After Departure */}
                {["Before Departure", "After Departure"].map((time, index) => (
                  <React.Fragment key={index}>
                    <Grid item lg={4} sx={dialogStyles.section}>
                      <Typography sx={dialogStyles.noteText}>{time}</Typography>
                    </Grid>
                    <Grid
                      item
                      lg={4}
                      sx={{
                        ...dialogStyles.section,
                        borderLeft: "1px solid #E2EAF1",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "var(--secondary-color)",
                        }}
                      >
                        {modalType === "reissue"
                          ? getFareRuleDetails(`reissue ${time.toLowerCase()}`)
                          : getFareRuleDetails(`refund ${time.toLowerCase()}`)}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      lg={4}
                      sx={{
                        ...dialogStyles.section,
                        borderLeft: "1px solid #E2EAF1",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "var(--secondary-color)",
                        }}
                      >
                        {modalType === "refund"
                          ? flightData?.charges?.refundCharge[0]?.serviceCharge
                          : flightData?.charges?.reIssueCharge[0]
                              ?.serviceCharge}{" "}
                        BDT
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>

              {/* Footer Important Notice */}
              <Grid item lg={12} sx={dialogStyles.importantNotice}>
                <Typography
                  sx={{ fontSize: "12px", color: "var(--primary-color)" }}
                >
                  <span style={dialogStyles.spanImportant}>*Important:</span>{" "}
                  {modalType === "reissue"
                    ? `The airline fee provided is for reference only, and Fly Far International does not guarantee its accuracy. All mentioned fees apply per passenger. Date change fees are only applicable when rebooking with the same airline on a new date. Additionally, any fare difference between the original and new booking must be paid by the user. For information on the number of free date changes allowed, if applicable, please refer to the Date Change Charges section above.`
                    : `The
                    airline fees are for reference only, and FlyFar
                    International does not guarantee the accuracy of this
                    information. All fees listed are per passenger.`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      <Dialog
        open={partialDialogBoxOpen}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "700px" },
            minWidth: {
              xs: "90%",
              sm: "50%",
            },
            borderRadius: "8px",
          },
        }}
      >
        <Box sx={{ ...dialogStyles.box, p: 2, width: "100%" }}>
          <Grid container>
            <Grid item lg={12} sx={dialogStyles.header}>
              <Typography sx={dialogStyles.sectionTitle}>
                Partial Payment Info - {item?.brandName}
              </Typography>
              <CloseIcon
                onClick={() => handleClosePartialDialog()}
                sx={{ color: "var(--primary-color)", cursor: "pointer" }}
              />
            </Grid>

            <Grid container item lg={12} sx={dialogStyles.gridContainer}>
              <Grid
                container
                item
                lg={12}
                sx={{
                  width: "100%",
                  border: "1px solid #E2EAF1",
                  borderRadius: "3px",
                }}
              >
                <Grid
                  item
                  lg={12}
                  sx={{
                    ...dialogStyles.section,
                    bgcolor: "#F6F6F6",
                    pl: "10px",
                  }}
                >
                  <Typography sx={dialogStyles.fareText}>
                    <span style={{ color: "var(--primary-color)" }}>
                      {(() => {
                        const routes = flightData?.route || [];
                        const length = routes.length;
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
                  </Typography>
                </Grid>

                {/* Partial amount & Charge */}
                <Grid item lg={4} sx={dialogStyles.fareRow}>
                  <Typography sx={{ ...dialogStyles.fareText, py: 1.5 }}>
                    Partial Payable Amount
                  </Typography>
                </Grid>
                <Grid
                  item
                  lg={4}
                  sx={{
                    ...dialogStyles.fareRow,
                    borderLeft: "1px solid #E2EAF1",
                  }}
                >
                  <Typography sx={{ ...dialogStyles.fareText, py: 1.5 }}>
                    Fly Far International Charge
                  </Typography>
                </Grid>
                <Grid
                  item
                  lg={4}
                  sx={{
                    ...dialogStyles.fareRow,
                    borderLeft: "1px solid #E2EAF1",
                  }}
                >
                  <Typography sx={{ ...dialogStyles.fareText, py: 1.5 }}>
                    Due Deadline
                  </Typography>
                </Grid>

                <React.Fragment>
                  <Grid item lg={4} sx={dialogStyles.section}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "var(--secondary-color)",
                      }}
                    >
                      {partialPayStatus === "pending" ? (
                        <Skeleton sx={{ width: "70px" }} />
                      ) : (
                        <span>
                          {partialChargeData?.amount -
                            partialChargeData?.totalCharge}{" "}
                          BDT
                        </span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    sx={{
                      ...dialogStyles.section,
                      borderLeft: "1px solid #E2EAF1",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "var(--secondary-color)",
                      }}
                    >
                      {partialPayStatus === "pending" ? (
                        <Skeleton sx={{ width: "70px" }} />
                      ) : (
                        <span>{partialChargeData?.totalCharge} BDT</span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    sx={{
                      ...dialogStyles.section,
                      borderLeft: "1px solid #E2EAF1",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "var(--secondary-color)",
                      }}
                    >
                      {partialPayStatus === "pending" ? (
                        <Skeleton sx={{ width: "70px" }} />
                      ) : (
                        <span>
                          {/* {"Need From Api "} */}
                          {moment(partialChargeData?.dueDate).format(
                            "MMM DD, YYYY hh:mm A"
                          )}
                        </span>
                      )}
                    </Typography>
                  </Grid>
                </React.Fragment>
              </Grid>

              {/* Footer Important Notice */}
              <Grid item lg={12} sx={dialogStyles.importantNotice}>
                <Typography sx={{ fontSize: "12px" }}>
                  <span
                    style={{
                      ...dialogStyles.spanImportant,
                      color: "var(--primary-color)",
                      fontWeight: 600,
                    }}
                  >
                    *Important:
                  </span>{" "}
                  <span style={{ color: "var(--primary-color)" }}>
                    The partial payable amount and deadline are not changeable.
                    Please ensure you pay the due amount before the deadline;
                    otherwise, your ticket will be forcefully refunded.
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </>
  );
};

const FareDetails = ({
  showFareRules,
  nonStructure,
  accurateFareRules,
  flightData,
  handleDrawerClose,
  brandName,
}) => {
  const [structure, setStructure] = useState(nonStructure[0]);

  const handleStructure = (val) => {
    const selectedStructure = nonStructure.find((item) => item.title === val);
    setStructure(selectedStructure);
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={showFareRules}
      onClose={handleDrawerClose}
      PaperProps={{
        sx: {
          width: nonStructure?.length > 0 ? "22%" : "30%",
          height: "100vh",
          bgcolor: "#fff",
          zIndex: 999999999,
        },
      }}
    >
      {showFareRules && (
        <Box sx={{ py: "15px", px: "20px", bgcolor: "#fff" }}>
          <Box sx={{ position: "sticky", top: 0, bgcolor: "#fff" }}>
            <Box sx={{ bgcolor: "#fff", zIndex: 1000 }}>
              <img
                src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${flightData?.carrier}.png`}
                width="45px"
                height="45px"
                alt="flight1"
              />
              <Typography
                sx={{
                  color: "var(--secondary-color)",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {flightData?.carrierName}
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  fontSize: "13px",
                  fontWeight: "400",
                }}
              >
                {flightData?.cityCount?.map((cities, i) =>
                  cities.map((city, j) => (
                    <span key={`${i}-${j}`}>
                      {j > 0 && ", "}
                      {city?.marketingCarrier}-{city?.marketingFlight}
                    </span>
                  ))
                )}
                <span style={{ paddingLeft: "3px" }}>, {brandName} </span>
              </Typography>
            </Box>

            <Box sx={{ pt: "20px" }}>
              <Typography
                sx={{
                  color: "#4D4D4D",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                Fare Rules
              </Typography>
            </Box>

            {nonStructure?.length > 0 ? (
              <select
                style={{
                  marginTop: "10px",
                  border: "none",
                  backgroundColor: "var(--secondary-color)",
                  outline: "none",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  color: "#fff",
                  width: "100%",
                  paddingLeft: "10px",
                }}
                onChange={(e) => handleStructure(e.target.value)}
              >
                {nonStructure.map((item, index) => (
                  <option key={index} value={item.title}>
                    {index + 1}. {item.title}
                  </option>
                ))}
              </select>
            ) : (
              <AccurateFareRules accurateFareRules={accurateFareRules} />
            )}
          </Box>

          <Box sx={{ pt: "20px", width: "100%", overflow: "hidden" }}>
            <Typography sx={{ fontSize: "12px", color: "black" }}>
              {structure?.text}
            </Typography>
          </Box>
        </Box>
      )}
    </SwipeableDrawer>
  );
};

export const SliderBtn = ({ onClick, type, additionalStyle }) => {
  return (
    <Tooltip
      title={
        additionalStyle
          ? ""
          : type === "prev"
            ? "Previous Brand Fare"
            : "Next Brand Fare"
      }
    >
      <div
        style={{
          cursor: "pointer",
          width: "max-content",
          height: "18px",
          display: "flex",
          alignItems: "center",
          position: "absolute",
          bottom: "20px",
          left: type === "prev" ? "-75px" : "-45px",
          transform: type === "prev" ? "rotate(-180deg)" : "",
          backgroundColor: "var(--secondary-color)",
          borderRadius: "3px",
          ...additionalStyle,
        }}
        onClick={onClick}
      >
        <ArrowRightAltIcon sx={{ color: "white" }} />
      </div>
    </Tooltip>
  );
};

export default NewViewFareCard;
