import React, { useState } from "react";
import {
  Box,
  Typography,
  SwipeableDrawer,
  Select,
  MenuItem,
  Divider,
  Grid,
  Radio,
  IconButton,
  Drawer,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import FlightDetails from "./FlightDetails";
import BaggageTable from "./BaggageTable";
import DiscountTable from "./DiscountTable";
import PolicyTable from "./PolicyTable";
import ViewFare from "../ViewFare/ViewFare";
import "./MobileFlightDetails.css";
import { useDispatch, useSelector } from "react-redux";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MobileFareSummary from "../../pages/Bookings/AirBookings/MobileFareSummary";
import { setShouldCallAirPrice } from "../FlightSearchBox/flighAfterSearchSlice";
import segment1Anim from "../../../src/assets/D1_1-ezgif.com-crop.gif";
import segment2Anim from "../../../src/assets/D2-ezgif.com-crop.gif";
import segment3Anim from "../../../src/assets/D3-ezgif.com-crop.gif";
import segment4Anim from "../../../src/assets/D4-ezgif.com-crop.gif";
import { alpha } from "@material-ui/core";
import QuotationShare from "./QuotationShare";
import CloseIcon from "@mui/icons-material/Close";

const singleCardBoxStyle = {
  width: "fit-content",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: "2px",
  px: "8px",
  fontWeight: "600",
  borderRadius: "2px",
};

const MobileSingleFlight = ({
  flightData,
  searchType,
  fromSegmentLists,
  toSegmentLists,
  adultCount,
  childCount,
  infantCount,
  departureDates,
  cabin,
  totalPassenger,
  segmentsList,
  flightAfterSearch,
  paxDetails,
  bookingId,
  isOpen,
  index,
}) => {
  const [showMobile, setShowMobile] = useState(false);
  const dispatch = useDispatch();
  const { cmsData } = useSelector((state) => state.flightAfter);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleShow = () => {
    dispatch(setShouldCallAirPrice("fare"));
    setShowMobile((prev) => !prev);
  };

  const handleClose = () => {
    setShowMobile(false);
  };

  const handleClick = (index) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
    if (selectedIndex !== index) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedIndex(null);
  };

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "5px",
          mb: "15px",
          width: "90%",
          mx: "auto",
          p: "11px 12px 7px",
          cursor: "pointer",
          border: isOpen ? "1px solid #888888" : "1px solid white",
        }}
        onClick={() => {
          if (!isOpen) {
            handleShow();
          } else {
            handleClick(index);
          }
        }}
      >
        {flightData?.cityCount?.map((cities, i) => {
          return (
            <Box key={i}>
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    position: "relative",
                  }}
                >
                  {isOpen && (
                    <Box sx={{ mt: -0.35, position: "absolute" }}>
                      <Radio
                        checked={selectedIndex === index}
                        size="small"
                        sx={{
                          color: "var(--primary-color)",
                          "&.Mui-checked": {
                            color: "var(--primary-color)",
                          },
                          p: 0,
                          m: 0,
                          "& .MuiSvgIcon-root": {
                            fontSize: 16,
                          },
                        }}
                      />
                    </Box>
                  )}
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "var(--secondary-color)",
                      fontWeight: "500",
                      ml: isOpen ? 2.5 : 0,
                    }}
                  >
                    <span style={{ fontWeight: "500", color: "#222222" }}>
                      {flightData?.carrierName}{" "}
                    </span>
                    <span style={{ color: "#dc143c" }}>
                      {cities.length > 1 ? ` +${cities.length - 1}` : ""}
                    </span>{" "}
                    <span style={{ color: "#888888" }}>
                      |{" "}
                      {cities.map((city, j) => (
                        <span key={j}>
                          {j > 0 && " | "}
                          {city?.marketingCarrier}-{city?.marketingFlight}
                        </span>
                      ))}
                    </span>
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "9px",
                    color: "#e67c00",
                    fontWeight: "500",
                  }}
                >
                  {cities[0]?.availableSeats?.toString().padStart(2, "0")} Seat
                </Typography>
              </Box>

              <Box sx={{ py: "0.5rem" }}>
                <Grid container>
                  <Grid item xs={2.5}>
                    <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                      <img
                        src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${flightData?.carrier}.png`}
                        width="20px"
                        height="20px"
                        alt="flight1"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#333333",
                            fontWeight: "500",
                          }}
                        >
                          {cities[0]?.departure}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "9px",
                            color: "#A2A1A1",
                            fontWeight: "500",
                          }}
                        >
                          {moment(cities[0]?.departureDate).format("hh:mm")}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={7.5}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "8px",
                          color: "#A2A1A1",
                          fontWeight: "400",
                        }}
                      >
                        {cities?.length == 2
                          ? "1 Stops"
                          : cities?.length == 3
                            ? "2 Stops"
                            : cities?.length == 4
                              ? "3 Stops"
                              : "Direct"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: -0.3,
                        }}
                      >
                        {cities?.length === 1 && (
                          <img
                            src={segment1Anim}
                            alt="segment 1 airline gif"
                            style={{ width: "40%" }}
                          />
                        )}

                        {cities?.length === 2 && (
                          <img
                            src={segment2Anim}
                            alt="segment 2 airline gif"
                            style={{ width: "40%" }}
                          />
                        )}

                        {cities?.length === 3 && (
                          <img
                            src={segment3Anim}
                            alt="segment 3 airline gif"
                            style={{ width: "40%" }}
                          />
                        )}

                        {cities?.length > 3 && (
                          <img
                            src={segment4Anim}
                            alt="segment 4 airline gif"
                            style={{ width: "40%" }}
                          />
                        )}
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "8px",
                          color: "#A2A1A1",
                          fontWeight: "400",
                        }}
                      >
                        {cities[0]?.totalFlightDuration}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={2}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#333333",
                          fontWeight: "500",
                          textAlign: "right",
                        }}
                      >
                        {cities[cities.length - 1]?.arrival}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "9px",
                          color: "#A2A1A1",
                          fontWeight: "500",
                          textAlign: "right",
                        }}
                      >
                        {moment(
                          cities[cities.length - 1]?.arrivalTime,
                          "HH:mm:ss"
                        ).format("hh:mm")}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          );
        })}

        {/* <hr className="border02"></hr> */}
        <Divider sx={{ my: 0.5 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row-reverse",
            alignItems: "flex-start",
            pt: "10px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Typography
              sx={{
                color: "var(--light-gray)",
                fontSize: "9px",
                fontWeight: 400,
                textAlign: "right",
              }}
            >
              Agent Fare
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "15px",
                },
                fontWeight: 400,
                textAlign: "right",
              }}
            >
              <span
                style={{
                  color: "var(--light-gray)",
                  paddingRight: "5px",
                  fontSize: "11px",
                }}
              >
                ৳
              </span>
              <span style={{ color: "#434542", fontWeight: 400 }}>
                {flightData?.agentPrice?.toLocaleString("en-IN")}
              </span>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: {
                xs: "5px",
                sm: "10px",
              },
              mr: "10px",
            }}
          >
            {/* {flightData?.partialPayment && (
              <Box
                sx={{
                  ...singleCardBoxStyle,
                  bgcolor: "#FFECE0",
                }}
              >
                <Typography
                  sx={{
                    color: "#E75800",
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                    },
                    fontWeight: 500,
                  }}
                >
                  Partially Payable
                </Typography>
              </Box>
            )} */}
            {flightData?.immediateIssue && (
              <Box
                sx={{
                  ...singleCardBoxStyle,
                  bgcolor: "#FFE1E1",
                }}
              >
                <Typography
                  sx={{
                    color: "#EE1919",
                    fontSize: {
                      xs: "8px",
                      sm: "12px",
                    },
                    fontWeight: 500,
                  }}
                >
                  Instant Purchase
                </Typography>
              </Box>
            )}
            {!flightData?.immediateIssue && (
              <Box
                sx={{
                  ...singleCardBoxStyle,
                  bgcolor: alpha("#0E8749", 0.1),
                }}
              >
                <Typography
                  sx={{
                    color: "#0E8749",
                    fontSize: {
                      xs: "8px",
                      sm: "10px",
                    },
                    fontWeight: 500,
                  }}
                >
                  Hold
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                ...singleCardBoxStyle,
                bgcolor:
                  flightData.isRefundable?.toLowerCase() == "non refundable"
                    ? "#ffedf0"
                    : "#fff6ec",
              }}
            >
              <Typography
                sx={{
                  color:
                    flightData.isRefundable?.toLowerCase() == "non refundable"
                      ? "#dc143c"
                      : "#e67c00",
                  fontSize: {
                    xs: "8px",
                    sm: "10px",
                  },
                  fontWeight: 500,
                }}
              >
                {flightData?.isRefundable}
              </Typography>
            </Box>

            <Box
              sx={{
                ...singleCardBoxStyle,
                bgcolor: "#c7e4ff",
              }}
            >
              <Typography
                sx={{
                  color: "#18457b",
                  fontSize: {
                    xs: "8px",
                    sm: "10px",
                  },
                  fontWeight: 500,
                }}
              >
                {flightData?.baggage[0][0].baggage}
              </Typography>
            </Box>

            <Box
              sx={{
                ...singleCardBoxStyle,
                bgcolor: "#f6f6f6",
              }}
            >
              <Typography
                sx={{
                  color: "#888888",
                  fontSize: {
                    xs: "8px",
                    sm: "10px",
                  },
                  fontWeight: 500,
                }}
              >
                {flightData?.system.charAt(0).toUpperCase() +
                  flightData?.system.slice(1)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {showMobile && flightData?.brands?.length > 0 && (
        <FlightDetailsDrawer
          flightData={flightData}
          showMobile={showMobile}
          searchType={searchType}
          fromSegmentLists={fromSegmentLists}
          toSegmentLists={toSegmentLists}
          adultCount={adultCount}
          childCount={childCount}
          infantCount={infantCount}
          departureDates={departureDates}
          handleClose={handleClose}
          cabin={cabin}
          cmsData={cmsData}
          bookingId={bookingId}
          flightAfterSearch={flightAfterSearch}
          paxDetails={paxDetails}
          totalPassenger={totalPassenger}
          segmentsList={segmentsList}
        />
      )}

      <Drawer
        PaperProps={{
          sx: {
            mx: 1.2,
            mb: 1,
            borderRadius: 2,
            backgroundColor: "#fff",
            maxHeight: "90vh",
          },
        }}
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <Box sx={{ zIndex: 1000 }}>
          <IconButton
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "var(--primary-color)",
              p: 0.5,
              "&:hover": {
                bgcolor: "var(--primary-color)",
              },
            }}
            onClick={handleDrawerClose}
          >
            <CloseIcon sx={{ fontSize: "14px", color: "white" }} />
          </IconButton>

          <QuotationShare flightData={flightData} type={"aftersearch"} />
        </Box>
      </Drawer>
    </Box>
  );
};

const FlightDetailsDrawer = ({
  flightData,
  showMobile,
  fromSegmentLists,
  toSegmentLists,
  adultCount,
  childCount,
  infantCount,
  departureDates,
  cabin,
  searchType,
  handleClose,
  cmsData,
  totalPassenger,
  segmentsList,
  bookingId,
}) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("viewfare");
  const handleValue = (val) => {
    setValue(val);
  };

  const totalPaxCount = adultCount + childCount?.length + infantCount;

  return (
    <SwipeableDrawer
      anchor="right"
      open={showMobile}
      onClose={handleClose}
      disableSwipeToOpen
      disableBackdropTransition={false}
      disableDiscovery={false}
      keepMounted={true}
      PaperProps={{
        sx: { width: "100%", bgcolor: "#F0EFF2" },
      }}
    >
      <Box sx={{ width: "100%" }}>
        {/* it will be top sticky */}
        <Box sx={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}>
          <Box
            sx={{
              height: "120px",
              position: "relative",
              bgcolor: "var(--secondary-color)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "90%",
                mx: "auto",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ArrowBackIosNewIcon
                sx={{ fontSize: "25px", color: "#fff" }}
                onClick={() => handleClose()}
              />
              <Box>
                <Typography
                  sx={{ fontSize: "20px", color: "#fff", fontWeight: "500" }}
                >
                  {fromSegmentLists[0]?.cityName} -{" "}
                  {toSegmentLists[0]?.cityName}
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#7C92AC" }}>
                  {" "}
                  {moment(departureDates[0]).format("Do MMM, YYYY")} |{" "}
                  {`${totalPaxCount === 1 ? totalPaxCount + " Person" : totalPaxCount + " Persons"}`}{" "}
                  | {cabin}
                </Typography>
              </Box>

              <SearchIcon
                sx={{ fontSize: "25px", color: "#fff" }}
                onClick={() => navigate("/dashboard/searchs")}
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: { xs: "40px" },
              m: {
                md: "0px auto 20px",
                sm: "0px auto 10px",
                xs: "0px auto 0px",
              },
              borderRadius: {
                xs: "2px",
                md: "5px",
              },
              overflow: "hidden",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              bottom: {
                xs: "-20px",
                sm: "-30px",
                md: "-40px",
              },
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Select
              value={value}
              onChange={(e) => handleValue(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Select Type" }}
              IconComponent={ArrowDropDownIcon}
              sx={{
                width: "90%",
                height: "100%",
                bgcolor: "var(--primary-color)",
                color: "white",
                textAlign: "left",
                py: 1,
                "&:focus": {
                  outline: "none",
                },
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250,
                    overflowY: "auto",
                  },
                },
              }}
            >
              {tabs?.map((tab, index) => (
                <MenuItem
                  key={index}
                  value={tab?.value}
                  sx={{ textTransform: "capitalize" }}
                >
                  {tab?.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Box
          sx={{
            width: "90%",
            mx: "auto",
            mt: "40px",
            bgcolor: "#fff",
            py: {
              xs: 0,
              lg: "15px",
            },
            mb: "1rem",
            borderRadius: "4px",
          }}
        >
          {value === "viewfare" ? (
            <ViewFare
              flightData={flightData}
              data={flightData?.uuid}
              searchType={searchType}
              cmsData={cmsData}
              totalPassenger={totalPassenger}
              segmentsList={segmentsList}
              cabin={cabin}
              bookingId={bookingId}
              showMobile={showMobile}
            />
          ) : value === "flight" ? (
            <FlightDetails flightData={flightData} />
          ) : value === "baggage" ? (
            <BaggageTable
              route={
                searchType === "afterSearch"
                  ? flightData?.details?.route
                  : flightData?.route
              }
              baggage={
                searchType === "afterSearch"
                  ? flightData?.details?.baggage
                  : flightData?.baggage
              }
              cityCount={
                searchType === "afterSearch"
                  ? flightData?.details?.cityCount
                  : flightData?.cityCount
              }
              flightData={flightData}
              priceBreakdown={
                searchType === "afterSearch"
                  ? flightData?.details?.priceBreakdown
                  : flightData?.priceBreakdown
              }
            />
          ) : value === "discount" ? (
            <DiscountTable
              priceBreakdown={
                searchType === "afterSearch"
                  ? flightData?.details?.priceBreakdown
                  : flightData?.priceBreakdown
              }
              clientPrice={flightData?.clientPrice}
              flightData={flightData}
            />
          ) : value === "flyfarInternationalCharges" ? (
            <PolicyTable
              priceBreakdown={flightData?.priceBreakdown}
              charges={flightData?.charges}
            />
          ) : value === "fareSummary" ? (
            <MobileFareSummary
              flightData={flightData}
              priceBreakdown={
                searchType === "afterSearch"
                  ? flightData?.details?.priceBreakdown
                  : flightData?.priceBreakdown
              }
            />
          ) : (
            ""
          )}
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

const tabs = [
  {
    label: "Flight Details",
    value: "flight",
  },
  {
    label: "View Fare",
    value: "viewfare",
  },
  {
    label: "Discount & Gross",
    value: "discount",
  },
  {
    label: "Baggage",
    value: "baggage",
  },
  {
    label: "Fly Far International Charges",
    value: "flyfarInternationalCharges",
  },
  {
    label: "Fare Summary",
    value: "fareSummary",
  },
];

export default MobileSingleFlight;
