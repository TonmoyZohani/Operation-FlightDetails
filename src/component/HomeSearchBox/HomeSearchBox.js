import { Box, Select, Typography, Tooltip, MenuItem } from "@mui/material";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import FlightIcon from "@mui/icons-material/Flight";
import GroupsIcon from "@mui/icons-material/Groups";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import { FaHotel } from "react-icons/fa";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlightSearchBox from "../FlightSearchBox/FlightSearchBox";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import DashboardMobileHeader from "../DashboardHeader/DashboardMobileHeader";
import HotelSearchBox from "../HotelSearchBox/HotelSearchBox";
import VisaSearchBox from "../VisaSearchBox/VisaSearchBox";
import PnrImportBox from "../PnrImportBox/PnrImportBox";
import GroupFareBox from "../GroupFareBox/GroupFareBox";
import TourSearchBox from "../TourSearchBox/TourSearchBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useWindowSize from "../../shared/common/useWindowSize";
import { SliderBtn } from "../ViewFare/NewViewFareCard";
import Slider from "react-slick";
import RecentSkeleton from "../SkeletonLoader/RecentSkeleton";
import EastIcon from "@mui/icons-material/East";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import moment from "moment";
import { useSelector } from "react-redux";

const HomeSearchBox = ({ accessData, recentSearch, isLoading }) => {
  const location = useLocation();
  const { isMobile } = useWindowSize();
  const [type, setType] = useState("flight");
  const navigate = useNavigate();
  const [departureDate, setDepartureDate] = useState([]);
  const [arrivalDate, setArrivalDate] = useState([]);
  const { searchType } = useSelector((state) => state?.flight);

  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
    } else {
      setType(newTab);
    }
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
    initialSlide: 0,
    prevArrow: (
      <SliderBtn
        type={"prev"}
        additionalStyle={{ bottom: "115%", left: "calc(100% - 74px)" }}
      />
    ),
    nextArrow: (
      <SliderBtn
        type={"next"}
        additionalStyle={{ bottom: "115%", left: "calc(100% - 34px)" }}
      />
    ),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 884,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 440,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const fetchAirportData = async (keyword) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/admin/airports/search-suggestion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = async (searchItem) => {
    const fetchData = async () => {
      let fromSegments = [];
      let toSegments = [];

      const fromCodes = new Set();
      const toCodes = new Set();

      try {
        for (const { arrival, departure } of searchItem?.segmentsList || []) {
          const departureData = await fetchAirportData(departure);
          if (departureData.success && departureData.data.length > 0) {
            const departureResult = departureData.data[0].result;
            if (!fromCodes.has(departureResult.code)) {
              fromSegments.push(departureResult);
              fromCodes.add(departureResult.code);
            }
          }

          // Fetch arrival airport data
          const arrivalData = await fetchAirportData(arrival);
          if (arrivalData.success && arrivalData.data.length > 0) {
            const arrivalResult = arrivalData.data[0].result;
            if (!toCodes.has(arrivalResult.code)) {
              toSegments.push(arrivalResult);
              toCodes.add(arrivalResult.code);
            }
          }
        }

        // Set the segments data after all fetch operations are completed
        return { fromSegments, toSegments };
      } catch (error) {
        console.error("Error fetching airport data:", error);
        return { fromSegments: [], toSegments: [] };
      }
    };

    const { fromSegments, toSegments } = await fetchData();

    // Extract passenger counts and ages
    const adultPassenger = searchItem.passengers.find(
      (passenger) => passenger.type === "ADT"
    );
    const childPassenger = searchItem.passengers.find(
      (passenger) => passenger.type === "CNN"
    );
    const infantPassenger = searchItem.passengers.find(
      (passenger) => passenger.type === "INF"
    );

    const adultCount = adultPassenger?.count || 0;
    const childAges = childPassenger?.ages.map((ageObj) => ageObj.age) || [];
    const infantCount = infantPassenger?.count || 0;

    const updatedSegmentsList = searchItem?.segmentsList.map(
      (segment, index) => {
        let newDepartureDate;

        switch (searchItem?.tripType) {
          case "oneWay":
            newDepartureDate = moment(departureDate[0]).format("YYYY-MM-DD");
            break;

          case "return":
            newDepartureDate =
              index === 0
                ? moment(departureDate[0]).format("YYYY-MM-DD")
                : moment(arrivalDate[0]).format("YYYY-MM-DD");
            break;

          case "multiCity":
            newDepartureDate = moment(departureDate[index]).format(
              "YYYY-MM-DD"
            );
            break;

          default:
            console.warn("Unknown tripType:", searchItem?.tripType);
            break;
        }

        return {
          ...segment,
          departureDate: newDepartureDate,
        };
      }
    );

    const departureDates = updatedSegmentsList.map(
      (segment) => segment.departureDate
    );
    const arrivalDates = updatedSegmentsList.map(
      (segment) => segment.departureDate
    );

    navigate(
      searchType === "split"
        ? "/dashboard/split-after-search"
        : "/dashboard/flightaftersearch",
      {
        state: {
          adultCount,
          childCount: childAges,
          infantCount,
          cabin: searchItem?.cabin,
          selectedAirlines: [],
          vendorPref: searchItem?.vendorPref?.map((item) => item.code) || [],
          studentFare: searchItem?.studentFare,
          umrahFare: searchItem?.umrahFare,
          seamanFare: searchItem?.studentFare,
          segmentsList: searchItem?.segmentsList,
          searchOptions: {
            fareType: "",
            searchType: "regular",
          },
          fromSegmentLists: fromSegments,
          toSegmentLists: toSegments,
          departureDates,
          arrivalDates,
          value: searchItem?.tripType?.toLowerCase(),
          bookingId: "",
        },
      }
    );
  };

  const tabItems = [
    {
      label: "Flight",
      value: "flight",
      icon: (
        <FlightIcon
          sx={{
            fontSize: { xs: "15px", sm: "20px" },
            transform: "rotate(45deg)",
          }}
        />
      ),
      hidden: accessData?.flightSearch?.access === false,
    },
    {
      label: "PNR Import",
      value: "pnrimport",
      icon: (
        <DocumentScannerIcon sx={{ fontSize: { xs: "15px", sm: "20px" } }} />
      ),
    },
    {
      label: "Group Fare",
      value: "groupfare",
      icon: <GroupsIcon sx={{ fontSize: { xs: "15px", sm: "20px" } }} />,
    },
    {
      label: "Hotel",
      value: "hotel",
      icon: <FaHotel style={{ fontSize: "1.25rem" }} />,
      hidden: accessData?.hotelSearch?.access === false,
    },
    {
      label: "Tour",
      value: "tour",
      icon: <TravelExploreIcon sx={{ fontSize: { xs: "15px", sm: "20px" } }} />,
    },
    {
      label: "Visa",
      value: "visa",
      icon: (
        <AirplaneTicketIcon sx={{ fontSize: { xs: "15px", sm: "20px" } }} />
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: { xs: 0, lg: 4 },
      }}
    >
      {isMobile && location.pathname !== "/" && <DashboardMobileHeader />}
      <Box
        sx={{
          position: "relative",
          padding: {
            md:
              location.pathname === "/home" || location.pathname === "/"
                ? "20px 25px"
                : "0px",
          },
          mt: {
            xs: location.pathname !== "/" ? "-140px" : "0",
            sm: location.pathname !== "/" ? "-190px" : "0",
            lg: 0,
          },
          borderRadius: "4px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              (!isMobile && location.pathname) === "/home" ||
              location.pathname === "/"
                ? "rgba(255, 255, 255, 0.3)"
                : "",
            zIndex: 1,
            borderRadius: "4px",
          },
        }}
      >
        <Box sx={{ width: "100%", zIndex: "5" }}>
          <TabContext value={type}>
            {!isMobile ? (
              <Box
                sx={{
                  bgcolor: {
                    xs: "transparent",
                    lg: "white",
                  },
                  color: "#dc143c",
                  width: {
                    md: "70%",
                    sm: "100%",
                    xs: "100%",
                  },
                  height: { md: "45px", sm: "30px", xs: "40px" },
                  m: {
                    md: "0px auto 10px",
                    sm: "0px auto 10px",
                    xs: "0px auto 10px",
                  },
                  borderRadius: {
                    xs: "2px",
                    lg: "5px",
                  },
                  overflow: "hidden",
                  textAlign: "center",
                  display: {
                    xs: "none",
                    lg: "flex",
                  },
                  justifyContent: "center",
                  svg: {
                    display: { md: "block", xs: "none", sm: "none" },
                  },
                }}
              >
                <TabList
                  value={type}
                  onChange={handleTypeChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="dashboard-tab"
                  className="tab-list-parent"
                >
                  {tabItems.map(({ label, value, icon, hidden }) =>
                    hidden ? null : (
                      <Tab
                        key={value}
                        label={label}
                        value={value}
                        icon={icon}
                        iconPosition="start"
                        sx={{
                          ...baseTabStyle,
                          borderBottom:
                            type === value ? "3px solid #dc143c" : "none",
                        }}
                      />
                    )
                  )}
                </TabList>
              </Box>
            ) : (
              <Box
                sx={{
                  color: "#dc143c",
                  width: "100%",
                  height: { md: "50px", sm: "50px", xs: "40px" },
                  borderRadius: isMobile ? "2px" : "5px",
                  overflow: "hidden",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  mt: "15px",
                }}
              >
                <Select
                  value={type}
                  onChange={handleTypeChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Select Type" }}
                  IconComponent={ArrowDropDownIcon}
                  sx={{
                    mx: {
                      xs: "1rem",
                      sm: "1.5rem",
                      md: "2rem",
                    },
                    width: location.pathname === "/" ? "100%" : "100%",
                    bgcolor: location.pathname === "/" ? " #fff" : "#355C8C",
                    color:
                      location.pathname === "/"
                        ? "var(--primary-color)"
                        : "white",
                    textAlign: "left",
                    mt: location.pathname === "/" ? "6px" : "4px",
                    "&:focus": {
                      outline: "none",
                    },
                    "& .MuiSelect-icon": {
                      color: "white",
                    },
                  }}
                >
                  <MenuItem value="flight"> Flight</MenuItem>
                  <MenuItem value="pnrimport">PNR Import</MenuItem>
                  <MenuItem value="groupfare">Group Fare</MenuItem>
                  <MenuItem value="hotel">Hotel</MenuItem>
                  <MenuItem value="tour">Tour</MenuItem>
                  <MenuItem value="visa">Visa</MenuItem>
                </Select>
              </Box>
            )}

            <TabPanel value={"flight"}>
              <FlightSearchBox recentSearch={recentSearch} />
            </TabPanel>
            <TabPanel value={"pnrimport"}>
              <PnrImportBox />
            </TabPanel>
            <TabPanel value={"groupfare"}>
              <GroupFareBox />
            </TabPanel>
            <TabPanel value={"hotel"}>
              <HotelSearchBox />
            </TabPanel>
            <TabPanel value={"tour"}>
              <TourSearchBox />
            </TabPanel>
            <TabPanel value={"visa"}>
              <VisaSearchBox />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>

      {type === "flight" && (
        <Box
          sx={{
            width: {
              xs: "90%",
              lg: "100%",
            },
            mx: {
              xs: "auto",
            },
            ".slick-slide > div": {
              marginRight: "6px !important",
              marginLeft: "0px",
            },
            ".slick-prev:before": {
              color: "var(--primary-color)",
            },
            ".slick-next:before": {
              color: "var(--primary-color)",
            },
            ".slick-track": {
              marginLeft: "0px !important",
            },
            ".slick-list": {},
            marginTop: "2px",
          }}
        >
          {isLoading ? (
            <Box mt={2.5}>
              <Slider {...settings}>
                {[...new Array(6)].map((_, index) => (
                  <RecentSkeleton key={index} />
                ))}
              </Slider>
            </Box>
          ) : (
            recentSearch?.length > 0 &&
            !isMobile && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: "15px",
                    color: "#252733",
                    mt: 4,
                    mb: 1,
                    fontWeight: "500",
                  }}
                >
                  Your Recent Flight Search
                </Typography>
                <Slider {...settings}>
                  {recentSearch?.map((recent, i) => (
                    <Box
                      key={i}
                      sx={{
                        bgcolor: "white",
                        padding: "7px 11px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        height: "80px",
                      }}
                      onClick={() => {
                        handleSearch(recent);
                        handleScrollToTop();
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "16px",
                          height: "25px",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            sx={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <Tooltip
                              title={
                                recent?.segmentsList[0]?.departureCityName
                                  ?.length > 8
                                  ? recent?.segmentsList[0]?.departureCityName
                                  : ""
                              }
                              arrow
                            >
                              <span
                                style={{
                                  fontSize: "13.24px",
                                  fontWeight: "700",
                                  cursor:
                                    recent?.segmentsList[0]?.departureCityName
                                      ?.length > 8
                                      ? "pointer"
                                      : "default",
                                }}
                              >
                                {recent?.segmentsList[0]?.departureCityName
                                  ?.length > 10
                                  ? `${recent?.segmentsList[0]?.departureCityName.slice(0, 8)}...`
                                  : recent?.segmentsList[0]?.departureCityName}
                              </span>
                            </Tooltip>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                position: "relative",
                                alignItems: "center",
                              }}
                            >
                              {recent?.tripType === "oneWay" ? (
                                <EastIcon
                                  sx={{
                                    fontSize: "17px",
                                    fill: "var(--primary-color)",
                                    paddingBottom: "2px",
                                  }}
                                />
                              ) : recent?.tripType === "return" ? (
                                <CompareArrowsIcon
                                  sx={{
                                    color: "var(--primary-color)",
                                    fontSize: "17px",
                                  }}
                                />
                              ) : (
                                <ReadMoreIcon
                                  sx={{
                                    color: "var(--primary-color)",
                                    fontSize: "17px",
                                  }}
                                />
                              )}
                            </Box>
                            <Tooltip
                              title={
                                recent?.segmentsList[0]?.arrivalCityName
                                  ?.length > 8
                                  ? recent?.segmentsList[0]?.arrivalCityName
                                  : ""
                              }
                              arrow
                            >
                              <span
                                style={{
                                  fontSize: "13.24px",
                                  fontWeight: "700",
                                  cursor:
                                    recent?.segmentsList[0]?.arrivalCityName
                                      ?.length > 8
                                      ? "pointer"
                                      : "default",
                                }}
                              >
                                {recent?.segmentsList[0]?.arrivalCityName
                                  ?.length > 10
                                  ? `${recent?.segmentsList[0]?.arrivalCityName.slice(0, 8)}...`
                                  : recent?.segmentsList[0]?.arrivalCityName}
                              </span>
                            </Tooltip>
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#595959",
                          fontWeight: "500",
                          marginTop: "-1px",
                        }}
                      >
                        {recent?.segmentsList?.length > 1 ? (
                          <React.Fragment>
                            {moment(
                              recent?.segmentsList[0]?.departureDate
                            ).format("DD MMM YY") +
                              " - " +
                              moment(
                                recent?.segmentsList?.[
                                  recent?.segmentsList?.length - 1
                                ]?.departureDate
                              ).format("DD MMM YY")}
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            {moment(
                              recent?.segmentsList[0]?.departureDate
                            ).format("DD MMM YY")}
                          </React.Fragment>
                        )}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "10px",
                            color: "var(--primary-color)",
                            fontWeight: "500",
                            pt: "3px",
                          }}
                        >
                          {recent?.passengers
                            .filter((p) => p.count > 0)
                            .map((p) => `${p.count} ${p.type}`)
                            .join(", ")}
                        </Typography>
                        <Tooltip title={`Search Count: ${recent?.count}`} arrow>
                          <Box
                            sx={{
                              bgcolor: "#f55d42",
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "10px",
                                color: "#fff",
                                fontWeight: 500,
                              }}
                            >
                              {recent?.count > 9 ? "9+" : recent?.count}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                    </Box>
                  ))}
                </Slider>
              </Box>
            )
          )}
        </Box>
      )}
    </Box>
  );
};

const baseTabStyle = {
  backgroundColor: "white",
  textTransform: "none",
  color: "#dc143c",
  width: "fit-content",
  minHeight: { md: "45px", sm: "30px", xs: "30px" },
  margin: { xs: "0px 0px", sm: "0px 30px", md: "0px 10px" },
  fontSize: { xs: "11px", sm: "13px" },
};

export default HomeSearchBox;
