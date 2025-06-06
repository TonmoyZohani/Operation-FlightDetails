import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import WrongLocationIcon from "@mui/icons-material/WrongLocation";
import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineSwap } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { FaChild, FaPerson } from "react-icons/fa6";
import { IoIosPaperPlane } from "react-icons/io";
import { MdChildFriendly } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { setAgentLogin } from "../../features/registrationSlice";
import useWindowSize from "../../shared/common/useWindowSize";
import { suggestion } from "../../shared/StaticData/flightData";
import { mobileFromData } from "../../shared/StaticData/mobileFromData";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import {
  CalendarDrawer,
  ClassDrawer,
  DestinationDrawer,
  FareTypeDrawer,
  PrefAirlinesDrawer,
  TravelerDrawer,
} from "./AllSearchDrawers";
import {
  setAdvancedFilter,
  setAppliedFilters,
  setFilterValue,
  setKeyNull,
  setModifyCheck,
} from "./flighAfterSearchSlice";
import {
  decrementAdult,
  decrementChild,
  decrementInfant,
  decrementSegment,
  handleSwapFunc,
  incrementAdult,
  incrementChild,
  incrementInfant,
  incrementSegment,
  setArrivalDate,
  setChildAge,
  setDepartureDate,
  setOpenTravel,
  setRefetch,
  setValue,
  updateFromSegmentList,
  updateMobileFromSegmentList,
  updateMobileToSegmentList,
  updateToSegmentList,
} from "./flightSearchSlice";
import { buttonClass, styles } from "./flightSearcStyle";
import "./Searchway.css";
import { checkDomestic } from "../../shared/common/functions";
import CustomAlert from "../Alert/CustomAlert";
import { trimAddresses } from "../../utils/functions";
import { keyframes } from "@emotion/react";

const flyUpDown = keyframes`
  -100%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const continentList = [
  { label: "Domestic", value: "domestic" },
  { label: "Asia", value: "asia" },
  { label: "Middle East", value: "middleEast" },
  { label: "Europe", value: "europe" },
  {
    label: "North America",
    value: "northAmerica",
  },
  {
    label: "South America",
    value: "southAmerica",
  },
  {
    label: "Ocenia",
    value: "ocenia",
  },
  {
    label: "Africa",
    value: "africa",
  },
];

const SearchWay = ({
  iconColor,
  bgColor,
  flightAfterSearch,
  selectedPassengers,
  passengers,
  classes,
  bookingId,
  paxDetails,
  vendorPref,
  setIsDomestic,
  recentSearch,
}) => {
  //TODO:: users section
  const navigate = useNavigate();
  const location = useLocation();
  const { jsonHeader, agentToken } = useAuth();
  const [flag, setFlag] = useState(0);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [showMobileTraveler, setShowMobileTraveler] = useState(false);
  const [showMobileClass, setShowMobileClass] = useState(false);
  const [showMobileAirlines, setShowMobileAirlines] = useState(false);
  const [showMobileFareType, setShowMobileFareType] = useState(false);
  const [destinationType, setDestinationType] = useState("");
  const [calendarType, setCalendarType] = useState("");
  const flightAfterSearchLocation = location?.pathname;
  // const flightAfterSearchLocation = "/dashboard/flightaftersearch";
  const { isMobile } = useWindowSize();
  const { agentData } = useOutletContext() || {};
  const availableSearch = agentData?.agentCms?.countCms?.search ?? 0;
  const usedSearch = agentData?.usedCms?.search ?? 0;

  //TODO::Taking states from flightSearch Slice
  const {
    adultCount,
    childCount,
    infantCount,
    segmentCount,
    value,
    fromSegmentLists,
    toSegmentLists,
    departureDates,
    arrivalDates,
    cabin,
    studentFare,
    umrahFare,
    seamanFare,
    selectedAirlines,
    searchOptions,
    searchType,
    fareType,
    isSameRoute,
    refetch,
  } = useSelector((state) => state.flight);

  const flightData = useSelector((state) => state?.flight);

  const segmentsListArr = [];
  // TODO: end of users section
  const [fromData, setFromData] = useState({
    resultId: "01",
    result: [
      {
        id: "01",
        code: "DXB",
        airportName: "Dubai International Airport",
        city: "Dubai",
        country: "United Arab Emirates",
        countryCode: "UAE",
        address: "Dubai",
      },
    ],
    suggestion: [
      {
        id: "01",
        code: "DWC",
        airportName: "Al Maktoum International Airport",
        city: "Dubai",
        country: "United Arab Emirates",
        countryCode: "UAE",
        address: "Dubai",
      },
      {
        id: "02",
        code: "XMB",
        airportName: "Dubai EY Bus Station",
        city: "Dubai",
        country: "United Arab Emirates",
        countryCode: "UAE",
        address: "Dubai",
      },
      {
        id: "03",
        code: "XNB",
        airportName: "Dubai Chelsea Bus Station",
        city: "Dubai",
        country: "United Arab Emirates",
        countryCode: "UAE",
        address: "Dubai",
      },
    ],
  });
  const [fromSuggest, setFromSuggest] = useState([]);
  const [fromResult, setFromResult] = useState({});
  const [toData, setToData] = useState([
    {
      resultId: "01",
      result: {
        id: 5,
        code: "JFK",
        name: "John F Kennedy Intl ",
        cityCode: "NYC",
        cityName: "New York",
        countryName: "UNITED STATES",
        countryCode: "US",
        address: "New York",
      },
      suggestion: [
        {
          id: 2541,
          code: "LGA",
          name: "La Guardia",
          cityCode: "NYC",
          cityName: "New York",
          countryName: "UNITED STATES",
          countryCode: "US",
          address: "New York",
        },
      ],
    },
  ]);
  const [toSuggest, setToSuggest] = useState([]);
  const [toResult, setToResult] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedIndex2, setSelectedIndex2] = useState(-1);
  const [fromKeyword, setFromKeyword] = useState("");
  const [toKeyword, setToKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState();
  // TODO: Stored initial data for mobile view
  const [fromMobileData, setFromMobileData] = useState([]);
  const [toMobileData, setToMobileData] = useState([]);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  // Necessary states of Departure and Arrival Date
  const [openDeptDates, setOpenDeptDates] = useState(
    [...new Array(segmentCount)].map(() => false)
  );
  const [openArrDates, setOpenArrDates] = useState(
    [...new Array(segmentCount)].map(() => false)
  );

  const [selectedDepartureDates, setSelectedDepartureDates] = useState(
    new Array(departureDates.length).fill(minDate)
  );

  // TODO:: Take necessary items from flightSearchSlice
  const dispatch = useDispatch();
  const [openFrom, setOpenFrom] = useState(Array(segmentCount).fill(false));
  const [openTo, setOpenTo] = useState(Array(segmentCount).fill(false));
  const openTravel = useSelector((state) => state.flight.openTravel);

  useEffect(() => {
    setOpenFrom(Array(segmentCount).fill(false));
    setOpenTo(Array(segmentCount).fill(false));
    setOpenDeptDates(Array(segmentCount).fill(false));
    setOpenArrDates(Array(segmentCount).fill(false));
  }, [segmentCount]);

  // Todo: Auto search by typing flight code
  const fetchData = async (keyword, setSelectedIndex, setData, setResult) => {
    try {
      if (keyword.length >= 0) {
        setIsLoading(true);
        setSelectedIndex(0);
        const url = `${process.env.REACT_APP_BASE_URL}/api/v1/admin/airports/search-suggestion`;
        const body = { keyword };
        const response = await axios.post(url, body, jsonHeader());
        const data = response?.data?.data[0];
        setData(trimAddresses(data));
        setResult({
          ...data?.result,
          address: data?.result?.address?.split(",")[0],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(fromKeyword, setSelectedIndex, setFromData, setFromResult);
  }, [fromKeyword]);

  useEffect(() => {
    fetchData(toKeyword, setSelectedIndex2, setToData, setToResult);
  }, [toKeyword]);

  useEffect(() => {
    const { result, suggestion } = fromData;
    const combinedArray = suggestion ? [result, ...suggestion] : [result];
    setFromSuggest(combinedArray);
  }, [fromResult, fromData]);

  useEffect(() => {
    const { result, suggestion } = toData;
    const combinedArray = suggestion ? [result, ...suggestion] : [result];
    setToSuggest(combinedArray);
  }, [toResult, toData]);

  useEffect(() => {
    let deptCode = fromSegmentLists[0]?.code;
    let arrCode = toSegmentLists[0]?.code;

    if (value === "oneway" || value === "return") {
      setIsDomestic(checkDomestic(deptCode) && checkDomestic(arrCode));
    } else if (value === "multicity") {
      const allDomestic =
        fromSegmentLists.every(({ code }) => checkDomestic(code)) &&
        toSegmentLists.every(({ code }) => checkDomestic(code));

      setIsDomestic(allDomestic);
    }
  }, [fromSegmentLists, toSegmentLists, value]);

  // TODO: Selecting location by keydown operation here
  const handleKeyDown = (
    e,
    selectedIndex,
    setSelectedIndex,
    suggestArray,
    suggestedTextSetter,
    setResultSetter
  ) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === suggestArray.length - 1 ? prevIndex : prevIndex + 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      setSelectedIndex(0);
      if (suggestArray.length > 0) {
        const selectedItem =
          selectedIndex >= 0 ? suggestArray[selectedIndex] : suggestArray[0];
        suggestedTextSetter(selectedItem);
        setResultSetter(selectedItem);
      }
    }
  };

  const handleKeyDownFrom = (e, index) => {
    handleKeyDown(
      e,
      selectedIndex,
      setSelectedIndex,
      fromSuggest,
      (item) => fromSuggestedText(item, index),
      setFromResult
    );
  };

  const handleKeyDownTo = (e, index) => {
    handleKeyDown(
      e,
      selectedIndex2,
      setSelectedIndex2,
      toSuggest,
      (item) => toSuggestedText(item, index),
      setToResult
    );
  };

  const handleClickAway = () => {
    setOpenFrom((prev) =>
      prev.some((state) => state) ? prev.map(() => false) : prev
    );

    setOpenTo((prev) =>
      prev.some((state) => state) ? prev.map(() => false) : prev
    );

    setOpenDeptDates((prev) =>
      prev.some((state) => state) ? prev.map(() => false) : prev
    );

    setOpenArrDates((prev) =>
      prev.some((state) => state) ? prev.map(() => false) : prev
    );

    dispatch(setOpenTravel(false));
  };

  // TODO:: Storing all departure locations in array
  const fromSuggestedText = (item, index) => {
    dispatch(updateFromSegmentList({ index, item }));
    setFromSuggest([]);
    setOpenFrom((prev) => prev.map(() => false));
    setOpenTo((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // TODO:: Storing all arrival locations in array
  const toSuggestedText = (item, index) => {
    dispatch(updateToSegmentList({ index, item }));
    setToSuggest([]);
    setOpenTo((prev) => prev.map(() => false));
    setOpenDeptDates((prev) => {
      const newOpenDeptDates = [...prev];
      newOpenDeptDates[index] = true;
      return newOpenDeptDates;
    });
  };

  // TODO:: Getting all suggestions from departure and arrival
  const getSuggestion = (
    index,
    suggestArray,
    selectedIndex,
    setSelectedIndex,
    suggestedTextSetter,
    setResultArray,
    result
  ) => {
    // console.log(suggestArray);

    return (
      <Box
        style={{
          height: "fit-content",
          position: "relative",
          width: "100%",
          zIndex: "100",
        }}
      >
        <Box
          className="box-index-oneway"
          sx={{
            maxHeight: "570px",
            overflowY: "auto",
            background: "#fff",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
            "&::-webkit-scrollbar": { width: "5px !important" },
          }}
        >
          {isLoading ? (
            <SuggestionnSkeleton />
          ) : suggestArray.some((item) => item?.address) ? (
            <>
              {result &&
              Object.keys(result).length > 0 &&
              suggestArray &&
              suggestArray.length !== 0
                ? suggestArray.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const isFirstElement = idx === 0;
                    return (
                      <Box
                        key={idx}
                        sx={{
                          paddingLeft: isFirstElement ? "10px" : "17px",
                          paddingRight: "10px",
                          backgroundColor: isSelected ? "#D1E9FF" : "#fff",
                          transition: "all .5s ease-in-out",
                          "&:hover": { backgroundColor: "#D1E9FF" },
                        }}
                      >
                        <Box
                          sx={{
                            margin: "0px 0px",
                            padding: "5px 0px",
                            cursor: "pointer",
                            display: "flex",
                            width: "100%",
                            alignItems: "start",
                            justifyContent: "space-between",
                          }}
                          onClick={() => {
                            suggestedTextSetter(item, index);
                          }}
                        >
                          <Box sx={{ display: "flex", gap: "1px" }}>
                            {isFirstElement ? (
                              <span
                                style={{
                                  fontSize: isFirstElement ? "13px" : "11px",
                                  display: "block",
                                  textAlign: "left",
                                  color: isSelected ? "#003566" : "#999",
                                  fontWeight: "600",
                                  marginTop: "10px",
                                  paddingRight: "5px",
                                }}
                              >
                                {item?.code}
                              </span>
                            ) : (
                              <Box sx={{ paddingRight: "4px" }}>
                                <SubdirectoryArrowRightIcon
                                  sx={{ fontSize: "17px", color: "#677D81" }}
                                />
                              </Box>
                            )}

                            <Box sx={{ paddingLeft: "5px" }}>
                              <span
                                style={{
                                  fontSize: isFirstElement ? "12px" : "11px",
                                  color: "#003566",
                                  display: "block",
                                  textAlign: "left",
                                  fontWeight: isSelected ? "500" : "normal",
                                }}
                              >
                                {result.length !== 0 ? (
                                  `${item?.cityName},${item?.countryName}`
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <WrongLocationIcon />
                                    <span
                                      style={{
                                        color: "var(--primary-color)",
                                        fontSize: "16px",
                                        paddingLeft: "6px",
                                      }}
                                    >
                                      Not Found...
                                    </span>
                                  </Box>
                                )}
                              </span>
                              <span
                                style={{
                                  fontSize: isFirstElement ? "10px" : "9.5px",
                                  color: "gray",
                                  display: "block",
                                  textAlign: "left",
                                  fontWeight: isSelected ? "500" : "normal",
                                }}
                              >
                                {item?.name}
                              </span>
                            </Box>
                          </Box>
                          <Box
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {isFirstElement ? (
                              <img
                                src={`https://flagcdn.com/w320/${item?.countryCode?.toLowerCase()}.png`}
                                alt={location?.cityName || "City"}
                                style={{
                                  height: "14px",
                                  marginTop: "10px",
                                  width: "28px",
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  fontSize: isFirstElement ? "13px" : "11px",
                                  display: "block",
                                  textAlign: "left",
                                  paddingRight: "5px",
                                  color: isSelected ? "#003566" : "#999",
                                  fontWeight: "600",
                                }}
                              >
                                {item?.code}
                              </span>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                : ""}
            </>
          ) : (
            <Box>
              <Typography p={1} textAlign={"center"} fontSize={"14px"}>
                No Result Found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const fromGetSuggestion = (index) => {
    return getSuggestion(
      index,
      fromSuggest,
      selectedIndex,
      setSelectedIndex,
      fromSuggestedText,
      fromResult,
      fromResult
    );
  };

  const toGetSuggestion = (index) => {
    return getSuggestion(
      index,
      toSuggest,
      selectedIndex2,
      setSelectedIndex2,
      toSuggestedText,
      toResult,
      toResult
    );
  };

  // TODO:: Hadling departure and arrival by selecting
  const handleClick = (type, index) => {
    if (isMobile) {
      handleMobileModal(type);
      setFlag(index);
      setType(type);
    } else {
      if (type === "from") {
        handleClickFrom(index);
      } else if (type === "to") {
        handleClickTo(index);
      }
    }
  };

  const handleClickFrom = (index) => {
    setOpenFrom((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
    setOpenTo((prev) => prev.map(() => false));
    setOpenDeptDates((prev) => prev.map(() => false));
    dispatch(setOpenTravel(false));
    setFromKeyword("");
  };

  const handleClickTo = (index) => {
    setOpenTo((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
    setOpenFrom((prev) => prev.map(() => false));
    setOpenDeptDates((prev) => prev.map(() => false));
    setOpenArrDates((prev) => prev.map(() => false));
    dispatch(setOpenTravel(false));
    setToKeyword("");
  };

  // TODO:: Hadling departure and arrival for mobile drawer
  const handleMobileModal = (type) => {
    setShowMobileModal(true);
    setDestinationType(type);
    fetchMobileData("");
  };

  const handleClose = (type = "web") => {
    if (type === "mobile") {
      setShowMobileCalendar(false);
      setShowMobileModal(false);
      setShowMobileTraveler(false);
      setShowMobileClass(false);
      setShowMobileAirlines(false);
      setShowMobileFareType(false);
    }

    if (fromSegmentLists[flag]?.code !== toSegmentLists[flag]?.code) {
      setShowMobileModal(false);
      setShowMobileCalendar(false);
      setShowMobileTraveler(false);
      setShowMobileClass(false);
      setShowMobileAirlines(false);
      setShowMobileFareType(false);
    }
  };

  const handleInputMobile = async (e) => {
    const { value } = e.target;
    fetchMobileData(value);
  };

  // Modify your input handler to work with index
  const handleInputChangeFrom = (index, e) => {
    const { value } = e.target;
    if (value.length >= 2) {
      setFromKeyword(value);
      fetchData(value, index, setFromData, setFromResult);
    }
  };

  const handleInputChangeTo = (index, e) => {
    const { value } = e.target;
    if (value.length >= 2) {
      setToKeyword(value);
      fetchData(value, index, setToData, setToResult);
    }
  };

  //  TODO:: Fetching data by keyword for mobile view
  const fetchMobileData = async (keyword) => {
    if (keyword.length >= 3) {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/admin/airports/search-suggestion`;
      const body = { keyword };
      try {
        const response = await axios.post(url, body);
        const data = response?.data?.data[0];
        if (destinationType === "from") {
          setFromMobileData([data?.result, ...data.suggestion]);
        } else if (destinationType === "to") {
          setToMobileData([data?.result, ...data.suggestion]);
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        // Handle the error as needed
      }
    } else {
      if (destinationType === "from") {
        setFromMobileData(mobileFromData);
      } else if (destinationType === "to") {
        setToMobileData(mobileFromData);
      }
    }
  };

  // TODO:: OPENS THE DIALOG WHEN THE USER CLICKS.
  const handleClickOpen = () => {
    dispatch(setOpenTravel(!openTravel));
    setOpenFrom((prev) => prev?.map(() => false));
    setOpenTo((prev) => prev?.map(() => false));
    setOpenDeptDates((prev) => prev?.map(() => false));
    setOpenArrDates((prev) => prev?.map(() => false));
  };

  // TODO :: Travelers increment and decrement
  function adultIncrement(e) {
    e.preventDefault();
    dispatch(incrementAdult());
  }

  function adultDecrement(e) {
    e.preventDefault();
    dispatch(decrementAdult());
  }

  function childIncrement(e) {
    e.preventDefault();
    if (fareType === "regularFare" || fareType === "umrahFare") {
      dispatch(incrementChild());
    }
  }

  function childDecrement(e) {
    e.preventDefault();
    dispatch(decrementChild());
  }

  function infantIncrement(e) {
    e.preventDefault();
    if (fareType === "regularFare" || fareType === "umrahFare") {
      dispatch(incrementInfant());
    }
  }

  function infantDecrement(e) {
    e.preventDefault();
    dispatch(decrementInfant());
  }

  // TODO :: Departure date and Arrival date operation
  const handleDepartureDate = (date, index) => {
    dispatch(setDepartureDate({ date, index }));

    setOpenDeptDates((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });

    setSelectedDepartureDates((prev) => {
      const newState = [...prev];
      newState[index] = date;
      return newState;
    });

    if (value !== "oneway" && !isMobile) {
      setOpenArrDates((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    }

    if (flightAfterSearch === "reissue-search") {
      dispatch(setOpenTravel(false));
    } else if (value === "oneway") {
      dispatch(setOpenTravel(true));
    }
  };

  const handleArrivalDate = (date, index) => {
    dispatch(setArrivalDate({ date, index }));
    setOpenArrDates((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });

    if (flightAfterSearch === "reissue-search") {
      dispatch(setOpenTravel(false));
    } else {
      dispatch(setOpenTravel(true));
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // TODO :: Navigating after search by handle search
  const handleSearch = async () => {
    // console.log(usedSearch, availableSearch);

    try {
      if (usedSearch >= availableSearch) {
        CustomAlert({
          success: false,
          title: "Your today's search limit is over",
          message:
            "Please contact our support team to increase your search limit.",
        });
        return;
      }

      // 2. Helper to format segment
      const createSegment = (from, to, date) => ({
        departure: from?.code,
        arrival: to?.code,
        departureDate: moment(date).format("YYYY-MM-DD"),
      });

      // 3. Build segments
      const segmentsList = [];
      for (let i = 0; i < flightData.segmentCount; i++) {
        const from = flightData.fromSegmentLists[i];
        const to = flightData.toSegmentLists[i];
        const departDate = flightData.departureDates[i];
        const returnDate = flightData.arrivalDates[i];

        segmentsList.push(createSegment(from, to, departDate));

        if (value === "return") {
          segmentsList.push(createSegment(to, from, returnDate));
        }
      }

      // 4. Navigate to result page with search state

      navigate(
        searchType === "split"
          ? "/dashboard/split-after-search"
          : "/dashboard/flightaftersearch",
        {
          state: {
            adultCount,
            childCount,
            infantCount,
            cabin,
            vendorPref: vendorPref || selectedAirlines.map((a) => a?.code),
            studentFare,
            selectedAirlines,
            umrahFare,
            seamanFare,
            segmentsList,
            searchType,
            fareType,
            fromSegmentLists,
            toSegmentLists,
            departureDates,
            arrivalDates,
            value,
            flightAfterSearch: flightAfterSearch || "normal-search",
            paxDetails: paxDetails || [],
            bookingId: bookingId || "",
            classes: classes || [],
            passengers,
            selectedPassengers,
          },
        }
      );
    } catch (err) {
      CustomAlert({
        success: false,
        title: "Search Error",
        message: err?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  // TODO :: Travelers increment and decrement
  const handleSelectAirport = (data) => {
    if (destinationType === "from") {
      dispatch(updateMobileFromSegmentList(data));
    } else if (destinationType === "to") {
      dispatch(updateMobileToSegmentList(data));
    }
    setShowMobileModal(false);
  };

  // TODO :: Handling mobile date type
  const handleMobileDateType = (type, index) => {
    setCalendarType(type);
    setShowMobileCalendar(true);
    setFlag(index);
  };

  const handleChildAgeChange = (event, index) => {
    const newAge = event.target.value;
    dispatch(setChildAge({ index, age: newAge }));
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box
          sx={{
            bgcolor: isMobile ? "#FFFFFF" : "transparent",
            px: {
              xs: "0.5rem",
              sm: "1.5rem",
              md: "2rem",
              lg: "0",
            },
            borderRadius: "0 0 5px 5px",
            position: "relative",
            borderTop:
              location.pathname === flightAfterSearchLocation
                ? "1px solid #E2EAF1"
                : "",
          }}
        >
          <Grid
            sx={{
              justifyContent: "space-between",
            }}
            container
            rowSpacing={0}
            columnSpacing={0}
          >
            {/* Todo: Departure,Arrival,Date Portion */}
            <Grid container item lg={value === "multicity" ? 8.9 : 9.3}>
              {[...new Array(segmentCount)].map((_, index) => (
                <Grid
                  container
                  item
                  lg={12}
                  key={index}
                  sx={{
                    mb:
                      value === "multicity" &&
                      location.pathname !== flightAfterSearchLocation
                        ? isMobile
                          ? "0px"
                          : "12px"
                        : "0px",
                  }}
                >
                  {/* Todo: Departure From */}
                  <Grid
                    item
                    className="dashboard-main-input-parent des-grid"
                    xs={12}
                    sm={12}
                    md={12}
                    lg={value === "multicity" ? 4.2 : 3.8}
                    sx={{
                      borderBottom:
                        location.pathname === flightAfterSearchLocation
                          ? "1px solid #E2EAF1"
                          : "",
                      mb: {
                        lg: "0px",
                        md: "15px",
                        sm: "15px",
                        xs: "15px",
                      },
                    }}
                  >
                    <Box
                      className="update-search1"
                      bgcolor={bgColor}
                      onClick={
                        flightAfterSearch === "reissue-search"
                          ? null
                          : () => handleClick("from", index)
                      }
                      sx={{
                        borderRadius: {
                          lg: "5px 0px 0px 5px",
                          md: "5px",
                          sm: "5px",
                          xs: "5px",
                        },
                        borderBottom: { lg: "none", xs: "1px solid #E7F3FE" },
                      }}
                    >
                      <Box style={{ position: "relative", bgcolor: "red" }}>
                        <p>From</p>
                        <span className="addressTitle">
                          {fromSegmentLists[index]?.cityName}
                        </span>
                      </Box>
                      <Box
                        style={{
                          lineHeight: "0px",
                        }}
                      >
                        <input
                          required
                          readOnly
                          value={`${fromSegmentLists[index]?.name} (${fromSegmentLists[index]?.code})`}
                          placeholder="Hazrat Shahjalal International Airport"
                          style={{
                            border: "none",
                            width: "100%",
                            color: "#003566",
                            backgroundColor: "transparent",
                            fontSize: "12px",
                            outline: "none",
                          }}
                        />
                      </Box>
                    </Box>
                    {openFrom[index] && (
                      <Box
                        className="des-box"
                        onKeyDown={(e) => handleKeyDownFrom(e, index)}
                      >
                        <Box
                          className="des-input-parent"
                          sx={{
                            border: "1px solid var(--border)",
                            mt: "3px",
                            bgColor: "#fff",
                            ml: " 0 !important",
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            <FaSearch
                              style={{
                                position: "absolute",
                                left: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#FF6B81",
                              }}
                            />
                            <input
                              autoComplete="off"
                              autoFocus
                              onChange={(e) => handleInputChangeFrom(index, e)}
                              placeholder="Type to search"
                              className="crimsonPlaceholder des-input"
                              style={{ paddingLeft: "35px" }}
                            />
                          </div>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            maxHeight: "300px",
                            overflowY: "auto",
                            borderRadius: "3px",
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": {
                              display: "none",
                            },
                            border: "1px solid var(--border)",
                            borderTop: "none",
                          }}
                        >
                          {fromKeyword?.length !== 0 &&
                            fromGetSuggestion(index)}

                          {fromKeyword?.length === 0 && (
                            <Box sx={{ bgcolor: "white", p: 1.5, pt: 0.5 }}>
                              {recentSearch?.length > 0 && (
                                <Typography
                                  sx={{
                                    color: "var(--secondary-color)",
                                    fontSize: "13px",
                                    borderBottom:
                                      "1px solid var(--secondary-light)",
                                    my: 1,
                                  }}
                                >
                                  Recent Search
                                </Typography>
                              )}

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  flexWrap: "wrap",
                                  overflow: "hidden",
                                }}
                              >
                                {recentSearch?.length > 0 && (
                                  <>
                                    {[
                                      ...new Map(
                                        recentSearch.map((country) => {
                                          const firstSegment =
                                            country?.segmentsList?.[0];
                                          return [
                                            firstSegment?.departure,
                                            country,
                                          ];
                                        })
                                      ).values(),
                                    ].map((country, idx) => {
                                      const firstSegment =
                                        country?.segmentsList?.[0];
                                      return (
                                        <Box
                                          key={idx}
                                          sx={{
                                            border:
                                              "1px solid var(--primary-color)",
                                            bgcolor: "#FFEDF1",
                                            borderRadius: "3px",
                                            p: "3px 5px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            fromSuggestedText(
                                              {
                                                id: country?.id,
                                                code: firstSegment?.departure,
                                                name: firstSegment?.departureAirport,
                                                cityCode:
                                                  firstSegment?.departure,
                                                cityName:
                                                  firstSegment?.departureCityName,
                                                address:
                                                  firstSegment?.departureCityName,
                                              },
                                              index
                                            )
                                          }
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 0.5,
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                color: "var(--primary-color)",
                                              }}
                                            >
                                              {firstSegment?.departureCityName}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      );
                                    })}
                                  </>
                                )}

                                {continentList?.map(
                                  (continent, continentIndex) => (
                                    <Box key={continentIndex}>
                                      <Typography
                                        sx={{
                                          color: "var(--secondary-color)",
                                          fontSize: "15px",
                                          borderBottom:
                                            "1px solid var(--secondary-light)",
                                          mt: 1,
                                          fontSize: "13px",
                                        }}
                                      >
                                        {continent?.label}
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                          flexWrap: "wrap",
                                          overflow: "hidden",
                                          mt: 1,
                                        }}
                                      >
                                        {suggestion
                                          ?.filter(
                                            (suggestion) =>
                                              suggestion?.continent ===
                                              continent?.value
                                          )
                                          .map((location, i) => (
                                            <Box
                                              key={i}
                                              sx={{
                                                border:
                                                  "1px solid var(--border-color)",
                                                borderRadius: "3px",
                                                p: "6px",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                fromSuggestedText(
                                                  {
                                                    ...location,
                                                    address:
                                                      location?.address?.split(
                                                        ","
                                                      )[0],
                                                  },
                                                  index
                                                )
                                              }
                                            >
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 0.5,
                                                }}
                                              >
                                                <img
                                                  src={`https://flagcdn.com/w320/${location?.countryCode?.toLowerCase()}.png`}
                                                  alt={
                                                    location?.cityName || "City"
                                                  }
                                                  style={{
                                                    height: "10px",
                                                  }}
                                                />
                                                <Typography
                                                  sx={{
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    color: "var(--gray-8)",
                                                  }}
                                                >
                                                  {location?.cityName}
                                                </Typography>
                                              </Box>
                                            </Box>
                                          ))}
                                      </Box>
                                    </Box>
                                  )
                                )}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                    {flightAfterSearch !== "reissue-search" && (
                      <Box
                        className="swap-btn2"
                        onClick={() => dispatch(handleSwapFunc(index))}
                        sx={{
                          display: "flex",
                          zIndex: 9,
                        }}
                      >
                        <AiOutlineSwap
                          style={{ color: "#fff", fontSize: "20px" }}
                        />
                      </Box>
                    )}
                  </Grid>

                  {/* Todo: Departure-To */}
                  <Grid
                    className="dashboard-main-input-parent des-grid"
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={value === "multicity" ? 4.2 : 3.8}
                    sx={{
                      borderBottom:
                        location.pathname === flightAfterSearchLocation
                          ? "1px solid #E2EAF1"
                          : "",
                      position: "relative",
                      mb: {
                        lg: "0px",
                        md: "15px",
                        sm: "15px",
                        xs: "15px",
                      },
                    }}
                  >
                    <Box
                      className="update-search1"
                      bgcolor={bgColor}
                      onClick={
                        flightAfterSearch === "reissue-search"
                          ? null
                          : () => handleClick("to", index)
                      }
                      sx={{
                        borderBottom: { lg: "none", xs: "1px solid #E7F3FE" },
                        borderRadius: {
                          lg: "0px",
                          md: "5px",
                          sm: "5px",
                          xs: "5px",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          paddingLeft: { xs: "0px", lg: "5px" },
                        }}
                      >
                        <p>To</p>
                        <span
                          className="addressTitle"
                          style={{
                            color:
                              fromSegmentLists[index]?.code ===
                              toSegmentLists[index]?.code
                                ? "#8c8080"
                                : "#dc143c",
                          }}
                        >
                          {fromSegmentLists[index]?.code ===
                          toSegmentLists[index]?.code
                            ? "Destination Error"
                            : toSegmentLists[index]?.cityName}
                        </span>
                      </Box>
                      <Box
                        sx={{
                          lineHeight: "0px",
                          paddingLeft: { xs: "0px", lg: "6px" },
                        }}
                      >
                        <input
                          required
                          readOnly
                          value={
                            fromSegmentLists[index]?.code ===
                            toSegmentLists[index]?.code
                              ? `Departure & Arrival destination can't be same`
                              : `${toSegmentLists[index]?.name} (${toSegmentLists[index]?.code})`
                          }
                          style={{
                            border: "none",
                            width: "100%",
                            color:
                              fromSegmentLists[index]?.code ===
                              toSegmentLists[index]?.code
                                ? "var(--primary-color)"
                                : "#003566",
                            backgroundColor: "transparent",
                            fontSize: "12px",
                            outline: "none",
                          }}
                        />
                      </Box>
                    </Box>
                    {!isMobile && (
                      <>
                        {(openTo[index] ||
                          fromSegmentLists[index]?.code ===
                            toSegmentLists[index]?.code) && (
                          <Box
                            className="des-box"
                            onKeyDown={(e) => handleKeyDownTo(e, index)}
                          >
                            <Box
                              className="des-input-parent"
                              sx={{
                                border: "1px solid var(--border)",
                                mt: "3px",
                                bgColor: "#fff",
                                ml: " 0 !important",
                              }}
                            >
                              <div style={{ position: "relative" }}>
                                <FaSearch
                                  style={{
                                    position: "absolute",
                                    left: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#FF6B81",
                                  }}
                                />
                                <input
                                  autoComplete="off"
                                  autoFocus
                                  onChange={(e) =>
                                    handleInputChangeTo(index, e)
                                  }
                                  placeholder="Type to search"
                                  className="crimsonPlaceholder des-input"
                                  style={{
                                    paddingLeft: "35px",
                                  }}
                                />
                              </div>
                            </Box>
                            <Box
                              sx={{
                                width: "100%",
                                maxHeight: "300px",
                                overflowY: "auto",
                                borderRadius: "3px",
                                scrollbarWidth: "none",
                                "&::-webkit-scrollbar": {
                                  display: "none",
                                },
                                border: "1px solid var(--border)",
                                borderTop: "none",
                              }}
                            >
                              {toKeyword?.length !== 0 &&
                                toGetSuggestion(index)}

                              {toKeyword?.length === 0 && (
                                <Box
                                  sx={{
                                    bgcolor: "white",
                                    p: 1.5,
                                    pt: 0.5,
                                  }}
                                >
                                  {recentSearch?.length > 0 && (
                                    <Typography
                                      sx={{
                                        color: "var(--secondary-color)",
                                        fontSize: "13px",
                                        borderBottom:
                                          "1px solid var(--secondary-light)",
                                        my: 1,
                                      }}
                                    >
                                      Recent Search
                                    </Typography>
                                  )}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      flexWrap: "wrap",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {recentSearch?.length > 0 && (
                                      <>
                                        {[
                                          ...new Map(
                                            recentSearch.map((country) => {
                                              const lastSegment =
                                                country?.segmentsList?.at(-1);
                                              return [
                                                lastSegment?.arrival,
                                                country,
                                              ];
                                            })
                                          ).values(),
                                        ].map((country, idx) => {
                                          const lastSegment =
                                            country?.segmentsList?.at(-1);
                                          return (
                                            <Box
                                              key={idx}
                                              sx={{
                                                border:
                                                  "1px solid var(--primary-color)",
                                                bgcolor: "#FFEDF1",
                                                borderRadius: "3px",
                                                p: "3px 5px",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                toSuggestedText(
                                                  {
                                                    id: country?.id,
                                                    code: lastSegment?.arrival,
                                                    name: lastSegment?.arrivalAirportName,
                                                    cityCode:
                                                      lastSegment?.arrival,
                                                    cityName:
                                                      lastSegment?.arrivalCityName,
                                                    address:
                                                      lastSegment?.arrivalCityName,
                                                  },
                                                  index
                                                )
                                              }
                                            >
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 0.5,
                                                }}
                                              >
                                                <Typography
                                                  sx={{
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    color:
                                                      "var(--primary-color)",
                                                  }}
                                                >
                                                  {lastSegment?.arrivalCityName}
                                                </Typography>
                                              </Box>
                                            </Box>
                                          );
                                        })}
                                      </>
                                    )}

                                    {continentList?.map(
                                      (continent, continentIndex) => (
                                        <div key={continentIndex}>
                                          <Typography
                                            sx={{
                                              color: "var(--secondary-color)",
                                              fontSize: "15px",
                                              borderBottom:
                                                "1px solid var(--secondary-light)",
                                              mt: 1,
                                              fontSize: "13px",
                                            }}
                                          >
                                            {continent?.label}
                                          </Typography>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                              flexWrap: "wrap",
                                              overflow: "hidden",
                                              mt: 1,
                                            }}
                                          >
                                            {suggestion
                                              ?.filter(
                                                (suggestion) =>
                                                  suggestion?.continent ===
                                                  continent?.value
                                              )
                                              .map((location, i) => (
                                                <Box
                                                  key={i}
                                                  sx={{
                                                    border:
                                                      "1px solid var(--border-color)",
                                                    borderRadius: "3px",
                                                    p: "6px",
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() =>
                                                    toSuggestedText(
                                                      {
                                                        ...location,
                                                        address:
                                                          location?.address?.split(
                                                            ","
                                                          )[0],
                                                      },
                                                      index
                                                    )
                                                  }
                                                >
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: 0.5,
                                                    }}
                                                  >
                                                    <img
                                                      src={`https://flagcdn.com/w320/${location?.countryCode?.toLowerCase()}.png`}
                                                      alt={
                                                        location?.cityName ||
                                                        "City"
                                                      }
                                                      style={{
                                                        height: "10px",
                                                      }}
                                                    />
                                                    <Typography
                                                      sx={{
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        color: "var(--gray-8)",
                                                      }}
                                                    >
                                                      {location?.cityName}
                                                    </Typography>
                                                  </Box>
                                                </Box>
                                              ))}
                                          </Box>
                                        </div>
                                      )
                                    )}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        )}
                      </>
                    )}
                    {isMobile && value === "multicity" && segmentCount > 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 10000,
                          right: 0,
                        }}
                        onClick={() => {
                          if (segmentCount > 1) {
                            dispatch(decrementSegment({ index, segmentCount }));
                          } else {
                            dispatch(setValue("return"));
                          }
                        }}
                      >
                        <IconButton size="large" aria-label="delete">
                          <DeleteIcon
                            sx={{
                              width: "40px",
                              height: "30px",
                              color: "var(--primary-color)",
                            }}
                          />
                        </IconButton>
                      </Box>
                    )}
                  </Grid>

                  <Grid
                    className="dashboard-main-input-parent"
                    item
                    xs={12}
                    lg={value === "multicity" ? 3.6 : 4.4}
                    style={{
                      position: "relative",
                      height: "73px",
                      borderRight: { lg: "1px solid #DEDEDE", xs: "none" },
                    }}
                    sx={{
                      borderBottom:
                        location.pathname === flightAfterSearchLocation
                          ? "1px solid #E2EAF1"
                          : "",
                      mb: {
                        lg: "0px",
                        xs: "15px",
                      },
                    }}
                  >
                    <Box
                      className="update-search1"
                      bgcolor={bgColor}
                      sx={{
                        borderRadius: {
                          lg: index === 0 ? "0px" : "0px 5px 5px 0px",
                          xs: "5px",
                        },
                        borderBottom: { lg: "none", xs: "1px solid #E7F3FE" },
                      }}
                    >
                      <Box
                        className="dashboard-main-input date12"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          marginTop: "0px",
                        }}
                      >
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            flexDirection: "column",
                            width: "50%",
                            cursor: "pointer",
                            lineHeight: 1.5,
                          }}
                          onClick={() => {
                            if (isMobile) {
                              handleMobileDateType("from", index);
                            } else {
                              setTimeout(() => {
                                setOpenDeptDates((prev) => {
                                  return prev.map((value, i) =>
                                    i === index ? !value : false
                                  );
                                });
                              }, 50);
                              // Close all arrival dates
                              setOpenArrDates((prev) => prev.map(() => false));
                              setOpenFrom((prev) => prev?.map(() => false));
                              setOpenTo((prev) => prev?.map(() => false));
                              dispatch(setOpenTravel(false));
                            }
                          }}
                        >
                          <p>Departure</p>
                          <span
                            className="addressTitle"
                            style={{ paddingTop: "2px" }}
                          >
                            {`${format(
                              new Date(departureDates[index]),
                              "dd MMM yy"
                            )}`}
                          </span>

                          <Typography
                            variant="subtitle2"
                            style={{ color: "#003566", fontSize: "12px" }}
                          >
                            {`${format(
                              new Date(departureDates[index]),
                              "EEEE"
                            )}`}
                          </Typography>
                        </Box>

                        <Box
                          style={{
                            display: value === "multicity" ? "none" : "flex",
                            alignItems: "flex-start",
                            flexDirection: "column",
                            width: "50%",
                            cursor: "pointer",
                            lineHeight: 1.5,
                          }}
                          onClick={() => {
                            if (isMobile) {
                              handleMobileDateType("to");
                            }

                            if (flightAfterSearch !== "reissue-search") {
                              setOpenArrDates((prev) => {
                                const newStates = [...prev];
                                newStates[index] = !newStates[index];
                                return newStates;
                              });
                              setOpenDeptDates((prev) => prev.map(() => false));
                              setOpenFrom((prev) => prev?.map(() => false));
                              setOpenTo((prev) => prev?.map(() => false));
                              dispatch(setOpenTravel(false));
                              dispatch(setOpenTravel(false));
                              const newValue =
                                value === "oneway"
                                  ? "return"
                                  : value === "return"
                                    ? "return"
                                    : "multicity";
                              dispatch(setValue(newValue));
                              setToKeyword("");
                            }
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#8C8080 !important",
                              mb: {
                                xs: 1,
                                lg: 0,
                              },
                            }}
                          >
                            Return
                          </Typography>

                          <Typography
                            sx={{
                              color: "#003566",
                              padding: "10px 0px",
                              lineHeight: "10px",
                            }}
                            className={value === "oneway" ? "" : "addressTitle"}
                          >
                            {value === "oneway"
                              ? `Add +`
                              : `${format(
                                  new Date(arrivalDates[index]),
                                  "dd MMM yy"
                                )}`}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#003566 !important",
                              fontSize: "12px !important",
                            }}
                          >
                            {value === "oneway"
                              ? "Return Date"
                              : format(new Date(arrivalDates[index]), "EEEE")}
                          </Typography>
                        </Box>
                      </Box>

                      {openDeptDates[index] &&
                        fromSegmentLists[index]?.code !==
                          toSegmentLists[index]?.code && (
                          <Box
                            sx={{
                              display: {
                                md: "flex",
                                sm: "block",
                                xs: "block",
                              },
                              background: "var(--white)",
                              flexFlow: "column nowrap",
                              border: "1px solid var(--border)",
                              borderTop: "none",
                            }}
                            className="new-dashboard-calendar"
                          >
                            <CustomCalendar
                              date={new Date(departureDates[index])}
                              minDate={minDate}
                              maxDate={maxDate}
                              title={"Departure Date"}
                              handleChange={(date) =>
                                handleDepartureDate(date, index)
                              }
                            />
                          </Box>
                        )}

                      {openArrDates[index] && value !== "multicity" && (
                        <Box
                          sx={{
                            display: {
                              md: "flex",
                              sm: "block",
                              xs: "block",
                            },
                            background: "var(--white)",
                            flexFlow: "column nowrap",
                            border: "1px solid var(--border)",
                            borderTop: "none",
                          }}
                          className="return-dashboard-calendar"
                        >
                          <CustomCalendar
                            date={new Date(arrivalDates[index])}
                            minDate={new Date(departureDates[index])}
                            maxDate={maxDate}
                            title={"Return Date"}
                            handleChange={(date) =>
                              handleArrivalDate(date, index)
                            }
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              ))}
              {isMobile && value === "multicity" && segmentCount <= 4 && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                      height: "100%",
                      gap: 1,
                      py: 1,
                      bgcolor: "white",
                      color: "var(--secondary-color)",
                      fontWeight: 600,
                      pr: 2,
                    }}
                    onClick={() => dispatch(incrementSegment())}
                  >
                    <AddCircleIcon /> Add City
                  </Box>
                </Grid>
              )}
            </Grid>

            {/* Todo: Travelers,Search Button,Add City,Remove City Portion */}
            {isMobile ? (
              ""
            ) : (
              <Grid
                container
                item
                xs={12}
                sm={12}
                md={12}
                lg={value === "multicity" ? 3.1 : 2.7}
                style={{
                  height: "73px",
                  borderBottom:
                    location.pathname === flightAfterSearchLocation
                      ? "1px solid #E2EAF1"
                      : "none",
                  backgroundColor: "white",
                  borderRadius: "0 5px 5px 0",
                }}
              >
                {[...new Array(segmentCount)].map((data, index) =>
                  index === 0 ? (
                    <Grid
                      key={index}
                      container
                      item
                      md={12}
                      lg={12}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom:
                          value === "multicity" &&
                          location.pathname !== flightAfterSearchLocation
                            ? "12px"
                            : "0px",
                      }}
                    >
                      <Grid
                        item
                        sm={6}
                        md={12}
                        lg={value === "multicity" ? 8.8 : 8.4}
                      >
                        <Box
                          className="update-search1"
                          bgcolor={bgColor}
                          sx={{
                            borderRadius: {
                              lg: "0px 5px 5px 0px",
                              xs: "0px 0px 0px 0px",
                            },
                            borderLeft: { lg: "1px solid #DEDEDE", xs: "none" },
                          }}
                        >
                          <Box
                            sx={{ cursor: "pointer" }}
                            className="traveler-count"
                            onClick={
                              flightAfterSearch === "reissue-search"
                                ? null
                                : handleClickOpen
                            }
                          >
                            <Button
                              sx={{
                                justifyContent: "flex-start",
                                color: "#000",
                                display: "block",
                              }}
                            >
                              <p>Travelers</p>

                              {flightAfterSearch === "reissue-search" ? (
                                <span style={{ fontSize: "17px" }}>
                                  {selectedPassengers.length}{" "}
                                  {selectedPassengers.length > 1
                                    ? "Travelers"
                                    : "Traveler"}
                                </span>
                              ) : (
                                <span style={{ fontSize: "17px" }}>
                                  {adultCount + childCount.length + infantCount}{" "}
                                  {adultCount +
                                    childCount.length +
                                    infantCount >
                                  1
                                    ? "Travelers"
                                    : "Traveler"}
                                </span>
                              )}

                              {flightAfterSearch === "reissue-search" ? (
                                <Tooltip
                                  title={selectedPassengers
                                    .map((index) => passengers[index])
                                    .map(
                                      (pax) =>
                                        `${pax?.firstName} ${pax?.lastName}`
                                    )
                                    .join(", ")}
                                  arrow
                                >
                                  <Typography
                                    sx={{
                                      color: "var(--secondary-color)",
                                      fontSize: "11px",
                                      visibility:
                                        selectedPassengers.length > 0
                                          ? "visible"
                                          : "hidden",
                                    }}
                                  >
                                    {selectedPassengers
                                      .map((index) => passengers[index])
                                      .map(
                                        (pax) =>
                                          `${pax?.firstName} ${pax?.lastName}`
                                      )
                                      .join(", ").length > 30
                                      ? `${selectedPassengers
                                          .map((index) => passengers[index])
                                          .map(
                                            (pax) =>
                                              `${pax?.firstName} ${pax?.lastName}`
                                          )
                                          .join(", ")
                                          .slice(0, 30)}...`
                                      : selectedPassengers
                                          .map((index) => passengers[index])
                                          .map(
                                            (pax) =>
                                              `${pax?.firstName} ${pax?.lastName}`
                                          )
                                          .join(", ")}
                                  </Typography>
                                </Tooltip>
                              ) : (
                                <Typography
                                  variant="subtitle2"
                                  style={{
                                    color: "#003566",
                                    fontSize: "12px",
                                    lineHeight: "10px",
                                  }}
                                >
                                  {adultCount} ADT
                                  {childCount.length > 0 &&
                                    `, ${childCount.length} CNN`}
                                  {infantCount > 0 && `, ${infantCount} INF`}
                                </Typography>
                              )}
                            </Button>
                          </Box>

                          {openTravel && (
                            <Box
                              className="dialog-box"
                              sx={{
                                ...styles.dialogBox,
                                border: "1px solid var(--border)",
                              }}
                            >
                              {/* adult portion */}
                              <Box sx={styles.boxContainer}>
                                <Box sx={styles.boxContent}>
                                  <FaPerson style={styles.icon} />
                                  <Box sx={styles.textContainer}>
                                    <Typography sx={styles.secondaryText}>
                                      Adults
                                    </Typography>
                                    <Typography sx={styles.primaryText}>
                                      12 years & above
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={styles.counterContainer}>
                                  <RemoveCircleOutlineOutlinedIcon
                                    onClick={adultDecrement}
                                    sx={
                                      adultCount > 1
                                        ? styles.counterIconActive
                                        : styles.counterIconInactive
                                    }
                                  />
                                  <Typography>{adultCount}</Typography>
                                  <ControlPointOutlinedIcon
                                    onClick={adultIncrement}
                                    sx={
                                      adultCount +
                                        childCount.length +
                                        infantCount <
                                      9
                                        ? styles.counterIconActive
                                        : styles.counterIconInactive
                                    }
                                  />
                                </Box>
                              </Box>
                              {/* child portion */}
                              <Box
                                sx={{
                                  borderBottom: "1px solid #5D95D7",
                                  pb: "7px",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: "5px",
                                    py: "15px",
                                    width: "100%",
                                  }}
                                >
                                  <Box sx={styles.boxContent}>
                                    <FaChild style={styles.icon} />
                                    <Box sx={styles.textContainer}>
                                      <Typography sx={styles.secondaryText}>
                                        Children
                                      </Typography>
                                      <Typography sx={styles.primaryText}>
                                        From 2 years to under 12
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={styles.counterContainer}>
                                    <RemoveCircleOutlineOutlinedIcon
                                      onClick={childDecrement}
                                      sx={
                                        childCount.length > 0
                                          ? styles.counterIconActive
                                          : styles.counterIconInactive
                                      }
                                    />
                                    <Typography>{childCount.length}</Typography>
                                    <ControlPointOutlinedIcon
                                      onClick={childIncrement}
                                      sx={
                                        adultCount +
                                          childCount.length +
                                          infantCount <
                                          9 &&
                                        (fareType === "regularFare" ||
                                          fareType === "umrahFare")
                                          ? styles.counterIconActive
                                          : styles.counterIconInactive
                                      }
                                    />
                                  </Box>
                                </Box>

                                {/* Iterate over the childCount array to display Child No and Child Age */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    mx: "0.70rem",
                                  }}
                                >
                                  {childCount.map((age, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        mt: 1,
                                        flexBasis: "30%",
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Typography sx={{ mb: "4px" }}>
                                        Child {index + 1} Age
                                      </Typography>
                                      <select
                                        value={age}
                                        onChange={(e) =>
                                          handleChildAgeChange(e, index)
                                        }
                                        className="child-select"
                                      >
                                        {Array.from({ length: 10 }).map(
                                          (_, i) => (
                                            <option key={i} value={i + 2}>
                                              {i + 2}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </Box>
                                  ))}
                                </Box>
                                <span
                                  style={{
                                    margin: "10px 0.75rem 0",
                                    fontSize: "12px",
                                    color: "#5D95D7",
                                    display:
                                      childCount.length === 0
                                        ? "none"
                                        : "block",
                                  }}
                                >
                                  Choose Your Child Age
                                </span>
                              </Box>

                              {/* infant portion */}
                              <Box
                                sx={{
                                  ...styles.boxContainer,
                                  borderBottom: "none",
                                }}
                              >
                                <Box sx={styles.boxContent}>
                                  <MdChildFriendly style={styles.icon} />
                                  <Box sx={styles.textContainer}>
                                    <Typography sx={styles.secondaryText}>
                                      Infant
                                    </Typography>
                                    <Typography sx={styles.primaryText}>
                                      Under 2 years
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={styles.counterContainer}>
                                  <RemoveCircleOutlineOutlinedIcon
                                    onClick={infantDecrement}
                                    sx={
                                      infantCount > 0
                                        ? styles.counterIconActive
                                        : styles.counterIconInactive
                                    }
                                  />
                                  <Typography>{infantCount}</Typography>
                                  <ControlPointOutlinedIcon
                                    onClick={infantIncrement}
                                    sx={
                                      adultCount +
                                        childCount.length +
                                        infantCount <
                                        9 &&
                                      (fareType === "regularFare" ||
                                        fareType === "umrahFare")
                                        ? styles.counterIconActive
                                        : styles.counterIconInactive
                                    }
                                  />
                                </Box>
                              </Box>
                              <Button
                                sx={styles.button}
                                style={{
                                  backgroundColor: "var(--secondary-color)",
                                }}
                                onClick={() => dispatch(setOpenTravel(false))}
                              >
                                Done
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Grid>

                      <Grid item lg={value === "multicity" ? 2.5 : 2.7}>
                        <Box
                          sx={{
                            height:
                              location.pathname === flightAfterSearchLocation
                                ? "60px"
                                : "73px",
                            width:
                              location.pathname === flightAfterSearchLocation
                                ? "75%"
                                : "100% ",
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                            my:
                              location.pathname === flightAfterSearchLocation
                                ? "6px"
                                : "0px",
                          }}
                        >
                          <Button
                            onClick={() => {
                              if (agentToken) {
                                handleSearch();
                                setIsLoading(true);
                                dispatch(setRefetch(!refetch));
                                dispatch(setFilterValue({}));
                                dispatch(setAppliedFilters([]));
                                dispatch(setModifyCheck(false));
                                dispatch(setAdvancedFilter("airlines"));
                                dispatch(setKeyNull());
                              } else {
                                dispatch(setAgentLogin({ isOpen: true }));
                              }
                            }}
                            variant="contained"
                            className="shine-effect"
                            sx={{
                              height: "100%",
                              width: { md: "100%", sm: "100%", xs: "100%" },
                              mt: { md: "0px", sm: "10px", xs: "10px" },
                              textTransform: "capitalize",
                              display: "flex",
                              flexDirection: {
                                md: "column",
                                sm: "row",
                                xs: "row",
                              },
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "5px",
                            }}
                            style={{
                              background:
                                flightAfterSearch === "reissue-search"
                                  ? "var(--secondary-color)"
                                  : fromSegmentLists[index]?.code ===
                                      toSegmentLists[index]?.code
                                    ? "#f0627e"
                                    : "var(--primary-color)",
                              color: "white",
                            }}
                            disabled={
                              fromSegmentLists[index]?.code ===
                              toSegmentLists[index]?.code
                            }
                          >
                            <IoIosPaperPlane style={{ fontSize: "20px" }} />

                            <Box>{"Search"}</Box>
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      item
                      sm={3}
                      lg={12}
                      key={index}
                      style={{
                        display: "flex",
                        height: "100%",
                        justifyContent: "space-between",
                        marginBottom:
                          location.pathname === flightAfterSearchLocation
                            ? "3pxpx"
                            : "12px",
                        borderBottom:
                          location.pathname === flightAfterSearchLocation
                            ? "1px solid #E2EAF1"
                            : "none",
                        marginLeft:
                          location.pathname === flightAfterSearchLocation
                            ? "0px"
                            : "12px",
                      }}
                    >
                      <Grid
                        item
                        lg={
                          location.pathname === flightAfterSearchLocation
                            ? 5.3
                            : 6
                        }
                        sx={{
                          backgroundColor:
                            location.pathname === flightAfterSearchLocation
                              ? "#f3f3f3"
                              : "#fff",
                          borderRadius: "5px",
                          height:
                            location.pathname === flightAfterSearchLocation
                              ? "50px"
                              : "73px",
                          mt:
                            location.pathname === flightAfterSearchLocation
                              ? "6px"
                              : "0px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          py: "30px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          index === segmentCount - 1 &&
                          dispatch(incrementSegment())
                        }
                      >
                        <AddIcon
                          sx={{
                            fontSize: "25px",
                            color:
                              index === segmentCount - 1 && segmentCount !== 5
                                ? "var(--primary-color)"
                                : "#EC8398",
                          }}
                        />
                        <Typography
                          sx={{ fontSize: "12px", color: "var(--gray)" }}
                        >
                          Add City
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        lg={
                          location.pathname === flightAfterSearchLocation
                            ? 5.3
                            : 5.5
                        }
                        sx={{
                          backgroundColor: "var(--secondary-color)",
                          color: "#fff",
                          borderRadius: "5px",
                          height:
                            location.pathname === flightAfterSearchLocation
                              ? "50px"
                              : "73px",
                          mt:
                            location.pathname === flightAfterSearchLocation
                              ? "6px"
                              : "0px",
                          display: "flex",
                          mr:
                            location.pathname === flightAfterSearchLocation
                              ? "14px"
                              : "0px",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          py: "30px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (segmentCount > 1) {
                            dispatch(decrementSegment({ index, segmentCount }));
                          } else {
                            dispatch(setValue("return"));
                          }
                        }}
                      >
                        <RemoveIcon sx={{ fontSize: "25px" }} />
                        <Typography sx={{ fontSize: "12px" }}>
                          Remove City
                        </Typography>
                      </Grid>
                    </Grid>
                  )
                )}
              </Grid>
            )}

            {isMobile ? (
              <Grid
                item
                xs={12}
                sx={{
                  pb: "15px",
                }}
              >
                <Grid item md={12} sx={{ mb: "15px" }}>
                  {/* traveller start */}
                  <Box
                    sx={{
                      borderLeft: { lg: "1px solid #DEDEDE", xs: "none" },
                    }}
                  >
                    <Box
                      sx={{
                        cursor: "pointer",
                        width: "100%",
                        px: "1.3rem",
                        bgcolor: "#fff",
                        borderRadius: "5px",
                        py: "6px",
                      }}
                      className="traveler-count"
                      onClick={() => setShowMobileTraveler(true)}
                    >
                      <Button
                        sx={{
                          justifyContent: "flex-start",
                          display: "block",
                        }}
                      >
                        <p style={{ color: "gray", fontSize: "11px" }}>
                          Traveler
                        </p>
                        <span style={{ fontSize: "16px", paddingTop: "0px" }}>
                          {" "}
                          {adultCount + childCount.length + infantCount}{" "}
                          {adultCount + childCount.length + infantCount > 1
                            ? `Travelers`
                            : `Traveler`}
                        </span>
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: "#003566",
                            fontSize: "11px",
                            paddingTop: "2px",
                            fontWeight: "500",
                          }}
                        >
                          {adultCount} ADT
                          {childCount.length > 0 &&
                            `, ${childCount.length} CHD`}
                          {infantCount > 0 && `, ${infantCount} INF`}
                        </Typography>
                      </Button>
                    </Box>
                  </Box>

                  {/* traveller end */}
                </Grid>

                <Box sx={buttonClass} onClick={() => setShowMobileClass(true)}>
                  <Typography sx={buttonClass.typography}>
                    Select Preferred Class
                  </Typography>

                  <Typography sx={buttonClass.typography2}>{cabin}</Typography>
                </Box>

                <Box
                  sx={{ ...buttonClass, mt: "15px" }}
                  onClick={() => setShowMobileAirlines(true)}
                >
                  <Typography sx={buttonClass.typography}>
                    Select Preferred Airlines
                  </Typography>

                  {selectedAirlines.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        gap: "6px",
                        color: "var(--primary-color)",
                      }}
                    >
                      {selectedAirlines.map((selectedAirline, i) => [
                        <Typography
                          key={i}
                          sx={{
                            fontSize: "11px",
                            fontWeight: "500",
                            color: "var(--primary-color)",
                          }}
                        >
                          {selectedAirline.label}
                        </Typography>,
                      ])}
                    </Box>
                  ) : (
                    ""
                  )}
                </Box>

                <Box
                  sx={{ ...buttonClass, mt: "15px" }}
                  onClick={() => setShowMobileFareType(true)}
                >
                  <Typography sx={buttonClass.typography}>
                    Select Fare Type
                  </Typography>

                  <Typography sx={buttonClass.typography2}>
                    {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex" }}>
                  <Button
                    style={{
                      backgroundColor: "var(--primary-color)",
                      width: "100%",
                      fontSize: "13px",
                      textTransform: "none",
                      color: "#fff",
                      marginTop: "20px",
                    }}
                    onClick={() => {
                      handleSearch();
                      handleScrollToTop();
                    }}
                  >
                    Search
                  </Button>
                </Box>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        </Box>
      </ClickAwayListener>

      <DestinationDrawer
        recentSearch={recentSearch}
        destinationType={destinationType}
        showMobileModal={showMobileModal}
        handleClose={handleClose}
        handleInput={(e) => handleInputMobile(e)}
        mobileData={destinationType === "from" ? fromMobileData : toMobileData}
        dispatch={dispatch}
        updateMobileSegmentList={handleSelectAirport}
        flag={flag}
        continentList={continentList}
        suggestion={suggestion}
        fromSuggestedText={fromSuggestedText}
        toSuggestedText={toSuggestedText}
        fromSegmentLists={fromSegmentLists}
        toSegmentLists={toSegmentLists}
        fromKeyword={fromKeyword}
        toKeyword={toKeyword}
        fromGetSuggestion={fromGetSuggestion}
        toGetSuggestion={toGetSuggestion}
        type={type}
      />

      <CalendarDrawer
        // destinationType={value}
        showMobileCalendar={showMobileCalendar}
        handleClose={handleClose}
        calendarType={calendarType}
        departureDates={departureDates}
        arrivalDates={arrivalDates}
        maxDate={maxDate}
        minDate={minDate}
        iconColor={iconColor}
        flag={flag}
        handleDepartureDate={handleDepartureDate}
        handleArrivalDate={handleArrivalDate}
      />

      <TravelerDrawer
        showMobileTraveler={showMobileTraveler}
        handleClose={handleClose}
        adultCount={adultCount}
        childCount={childCount}
        infantCount={infantCount}
        searchOptions={searchOptions}
        adultIncrement={adultIncrement}
        adultDecrement={adultDecrement}
        childIncrement={childIncrement}
        childDecrement={childDecrement}
        infantIncrement={infantIncrement}
        infantDecrement={infantDecrement}
        dispatch={dispatch}
        handleChildAgeChange={handleChildAgeChange}
      />

      <ClassDrawer
        showMobileClass={showMobileClass}
        handleClose={handleClose}
        dispatch={dispatch}
        cabin={cabin}
      />

      <PrefAirlinesDrawer
        showMobileAirlines={showMobileAirlines}
        handleClose={handleClose}
      />

      <FareTypeDrawer
        showMobileFareType={showMobileFareType}
        handleClose={handleClose}
        searchOptions={searchOptions}
      />
    </>
  );
};

const SuggestionnSkeleton = () => {
  return (
    <Box sx={{ width: "100%", px: "10px" }}>
      {[...new Array(3)].map((_, i) => (
        <Box key={i} py={"5px"}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between" }}
            mb={"5px"}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="50%"
              height="10px"
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="10%"
              height="10px"
            />
          </Box>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="10px"
          />
        </Box>
      ))}
    </Box>
  );
};

export default SearchWay;
