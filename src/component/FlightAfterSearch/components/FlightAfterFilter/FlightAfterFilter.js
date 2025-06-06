import { Box, Grid, Typography, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import PriceSlider from "./PriceSlider";
import { filterLabelStyle } from "../../../../style/style";
import { convertCamelToTitle } from "../../../../shared/common/functions";
import CustomCheckBox from "../../../../component/CustomCheckbox/CustomCheckbox";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  setAdvancedFilter,
  setAppliedFilters,
  setFilterValue,
} from "../../../FlightSearchBox/flighAfterSearchSlice";
import TimerLimit from "../../../Common/TimerLimit";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { statusColorMap } from "../../FlightDetailsCard";

const FlightAfterFilter = ({
  data,
  progress,
  advancedFilter,
  setAlternateDateFilter,
  value,
  flightAfterSearch,
  advancedFilterValue,
}) => {
  const dispatch = useDispatch();
  const { filterValue, appliedFilters } = useSelector(
    (state) => state.flightAfter
  );

  const filterData = data?.filterValue;
  const [bagShow, setBagShow] = useState(false);
  const [airportShow, setAirportShow] = useState(false);

  const [accordionState, setAccordionState] = useState({
    popularExpand: false,
    priceExpand: false,
    oneWayExpand: false,
    moreWayExpand: false,
    refundExpand: false,
    departExpand: false,
    arrivalExpand: false,
    layoverExpand: false,
    baggageExpand: false,
    airportExpand: false,
    advancedFilterExpand: false,
    altDeptAirportExpand: false,
    altArrAirportExpand: false,
  });

  // Most popular filters
  const handleMostPopular = (key) => {
    setAlternateDateFilter(false);
    const isCurrentlySelected = filterValue[key] === true;

    // Only remove alternateDateData from filterValue
    const { alternateDateData, ...newFilterValue } = filterValue;

    if (isCurrentlySelected) {
      dispatch(setFilterValue({ ...newFilterValue, [key]: false }));
      handleRemoveAppliedFilterByValue(key);
    } else {
      const appliedObject = { type: "popular", value: key };

      if (key === "cheapest") {
        dispatch(
          setFilterValue({ ...newFilterValue, [key]: true, expensive: false })
        );

        const removeExpensive = appliedFilters.filter(
          (item) => item.value !== "expensive"
        );
        dispatch(setAppliedFilters([...removeExpensive, appliedObject]));
      } else if (key === "expensive") {
        dispatch(
          setFilterValue({ ...newFilterValue, [key]: true, cheapest: false })
        );

        const removeCheapest = appliedFilters.filter(
          (item) => item.value !== "cheapest"
        );
        dispatch(setAppliedFilters([...removeCheapest, appliedObject]));
      } else {
        dispatch(setFilterValue({ ...newFilterValue, [key]: true }));
        dispatch(setAppliedFilters([...appliedFilters, appliedObject]));
      }
    }
  };

  // Payment type filters
  const handlePaymentType = (key, value) => {
    setAlternateDateFilter(false);
    const isCurrentlySelected = filterValue[key] === true;

    // Only remove alternateDateData from filterValue
    const { alternateDateData, ...newFilterValue } = filterValue;

    if (isCurrentlySelected) {
      dispatch(setFilterValue({ ...newFilterValue, [key]: false }));
      handleRemoveAppliedFilterByValue(value);
    } else {
      const appliedObject = { type: "payment", value, key };
      dispatch(
        setFilterValue({
          ...newFilterValue,
          [key]: true,
          [key === "partPayment" ? "fullPayment" : "partPayment"]: false,
        })
      );

      const updatedAppliedFilters = appliedFilters.filter(
        (item) => item.type !== "payment"
      );
      dispatch(setAppliedFilters([...updatedAppliedFilters, appliedObject]));
    }
  };

  // Price slider filters
  const handlePriceChange = (value) => {
    setAlternateDateFilter(false);
    dispatch(
      setFilterValue({
        ...filterValue,
        price: { minPrice: filterData?.price?.minPrice, maxPrice: value },
      })
    );

    // set to appliedfilter
    const crrFilter = {
      type: "price",
      value: `${filterData?.price?.minPrice} - ${value} BDT`,
    };

    handleAddAppliedFilterByType("price", crrFilter);
  };

  // Oneway Stop Filters
  const handleOneWayStop = (key, label) => {
    setAlternateDateFilter(false);
    const currentKeyExists =
      filterValue?.stopsCount?.oneWay?.[key] !== undefined;

    if (currentKeyExists) {
      const { stopsCount, ...rest } = filterValue;
      dispatch(setFilterValue(rest));
      handleRemoveAppliedFilterByType("stop");
    } else {
      dispatch(
        setFilterValue({
          ...filterValue,
          stopsCount: {
            oneWay: { [key]: filterData?.stopsCount?.oneWay?.[key] },
          },
        })
      );

      // set to appliedfilter
      const crrFilter = { type: "stop", value: label };

      handleAddAppliedFilterByType("stop", crrFilter);
    }
  };

  // Roundway and Multicity Stop Filters
  const handleReturnAndMultiCityStop = (propName, segment, tripType, label) => {
    setAlternateDateFilter(false);
    const currentStops = filterValue?.stopsCount?.[tripType] || {};
    const segmentStops = currentStops[segment] || {};

    const isSelected = segmentStops[propName] !== undefined;

    let updatedStops;

    if (isSelected) {
      updatedStops = {};
    } else {
      updatedStops = {
        [propName]: filterData?.stopsCount?.[tripType]?.[segment]?.[propName],
      };
    }

    const updatedStopsCount = { ...currentStops, [segment]: updatedStops };

    const isAllEmpty = Object.values(updatedStopsCount).every(
      (stops) => Object.keys(stops).length === 0
    );

    if (isAllEmpty) {
      const { stopsCount, ...rest } = filterValue;
      dispatch(setFilterValue(rest));
      handleRemoveAppliedFilterByType(`${segment}stops`);
    } else {
      dispatch(
        setFilterValue({
          ...filterValue,
          stopsCount: { [tripType]: updatedStopsCount },
        })
      );

      const crrFilter = {
        type: `${segment}stops`,
        propName,
        segment,
        tripType,
        value: label,
      };
      handleAddAppliedFilterByType(`${segment}stops`, crrFilter);
    }
  };

  // Fare Type Filters
  const handleFareType = (value) => {
    setAlternateDateFilter(false);
    // set to applied filter
    const crrFilter = { type: "fare", value: convertCamelToTitle(value) };
    handleAddAppliedFilterByType("fare", crrFilter);

    // set to filter value
    let updatedArray;
    updatedArray = toggleValueInArray(filterValue?.isRefundable, value);
    const { isRefundable, ...rest } = filterValue;

    if (updatedArray?.length > 0) {
      dispatch(setFilterValue({ ...filterValue, isRefundable: updatedArray }));
    } else {
      dispatch(setFilterValue({ ...rest }));
      handleRemoveAppliedFilterByType("fare");
    }
  };

  // Onward and Return Derparture Time Filter
  const handleOnwardDerpartureTime = (value, i) => {
    setAlternateDateFilter(false);
    const filterType = i === 0 ? "onwardDepartureTime" : "returnDepartureTime";

    const currentArray = filterValue?.onwardDepartureTime || [];
    let updatedArray;

    if (
      filterData?.tripType === "oneWay" ||
      filterData?.tripType === "multiCity"
    ) {
      updatedArray = [toggleValueInArray(currentArray[0] || [], value)];
    } else {
      updatedArray = currentArray.length === 2 ? [...currentArray] : [[], []];
      updatedArray[i] = toggleValueInArray(updatedArray[i], value);
    }

    const { onwardDepartureTime, ...rest } = filterValue;

    if (updatedArray[i].length > 0) {
      dispatch(
        setFilterValue({ ...filterValue, onwardDepartureTime: updatedArray })
      );

      const crrFilter = {
        type: filterType,
        value: `${convertCamelToTitle(filterType)} - ${value}`,
        mainValue: value,
        index: i,
      };

      handleAddAppliedFilterByType(filterType, crrFilter);
    } else {
      updatedArray = currentArray.map((item, index) =>
        index !== i ? item : []
      );
      dispatch(
        setFilterValue({ ...filterValue, onwardDepartureTime: updatedArray })
      );

      handleRemoveAppliedFilterByType(filterType);
    }

    if (updatedArray?.flat().length === 0) {
      dispatch(setFilterValue({ ...rest }));
    }
  };

  // Onward and Return Arrival Time Filter
  const handleOnwardArrivalTime = (value, i) => {
    setAlternateDateFilter(false);
    const filterType = i === 0 ? "onwardArrivalTime" : "returnArrivalTime";

    const currentArray = filterValue?.onwardArrivalTime || [];
    let updatedArray;

    if (
      filterData?.tripType === "oneWay" ||
      filterData?.tripType === "multiCity"
    ) {
      updatedArray = [toggleValueInArray(currentArray[0] || [], value)];
    } else {
      updatedArray = currentArray.length === 2 ? [...currentArray] : [[], []];
      updatedArray[i] = toggleValueInArray(updatedArray[i], value);
    }

    const { onwardArrivalTime, ...rest } = filterValue;

    if (updatedArray[i].length > 0) {
      dispatch(
        setFilterValue({ ...filterValue, onwardArrivalTime: updatedArray })
      );

      const crrFilter = {
        type: filterType,
        value: `${convertCamelToTitle(filterType)} - ${value}`,
        mainValue: value,
        index: i,
      };

      handleAddAppliedFilterByType(filterType, crrFilter);
    } else {
      updatedArray = currentArray.map((item, index) =>
        index !== i ? item : []
      );
      dispatch(
        setFilterValue({ ...filterValue, onwardArrivalTime: updatedArray })
      );

      handleRemoveAppliedFilterByType(filterType);
    }

    if (updatedArray?.flat().length === 0) {
      dispatch(setFilterValue({ ...rest }));
    }
  };

  // Layover Time Filter
  const handleLayoverTime = (value) => {
    setAlternateDateFilter(false);
    let updatedArray;

    updatedArray = toggleValueInArray(filterValue?.layoverTime, value);

    const { layoverTime, ...rest } = filterValue;

    if (updatedArray?.length > 0) {
      dispatch(setFilterValue({ ...filterValue, layoverTime: updatedArray }));

      // set to applied filter
      const crrFilter = { type: "layoverTime", value };
      handleAddAppliedFilterByType("layoverTime", crrFilter);
    } else {
      dispatch(setFilterValue({ ...rest }));
      handleRemoveAppliedFilterByType("layoverTime");
    }
  };

  // Baggage Filter
  const handleBaggage = (value) => {
    setAlternateDateFilter(false);
    // toggle to filter value
    const baggageArray = filterValue?.baggage || [];
    let updatedArray;
    if (baggageArray.some((bag) => bag?.baggage === value?.baggage)) {
      updatedArray = baggageArray.filter(
        (bag) => bag?.baggage !== value?.baggage
      );

      // remove to appliedFilter

      handleRemoveAppliedFilterByValue(value?.baggage);
    } else {
      // add filter value
      updatedArray = [...baggageArray, value];

      // add to appliedFilter
      const crrFilter = { type: "baggage", value: value?.baggage };
      dispatch(setAppliedFilters([...appliedFilters, crrFilter]));
    }

    const { baggage, ...rest } = filterValue;

    if (updatedArray?.length > 0) {
      // add filter value
      dispatch(setFilterValue({ ...filterValue, baggage: updatedArray }));
    } else {
      // remove filter value
      dispatch(setFilterValue({ ...rest }));
      // remove appliedfilter
      handleRemoveAppliedFilterByType("baggage");
    }
  };

  // Layover Airports Filter
  const handleLayoverAirport = (value) => {
    setAlternateDateFilter(false);
    const airportArr = filterValue?.layOverAirport || [];

    let updatedArray;

    if (airportArr.includes(value)) {
      updatedArray = airportArr.filter((airport) => airport !== value);

      handleRemoveAppliedFilterByValue(value);
    } else {
      updatedArray = [...airportArr, value];

      const crrFilter = { type: "airport", value: value };
      dispatch(setAppliedFilters([...appliedFilters, crrFilter]));
    }

    const { layOverAirport, ...rest } = filterValue;

    if (updatedArray?.length > 0) {
      dispatch(
        setFilterValue({ ...filterValue, layOverAirport: updatedArray })
      );
    } else {
      dispatch(setFilterValue({ ...rest }));
    }
  };

  // Alternative Departure Airports Filter
  const handleAlternativeDepartureAirport = (value) => {
    setAlternateDateFilter(false);
    const airportArr = filterValue?.alternateAirport?.departureAirport || [];
    const arrivalArr = filterValue?.alternateAirport?.arrivalAirport || [];

    let updatedDepartureAirports;
    let updatedAppliedFilters;

    const isSelected = airportArr.includes(value);

    if (isSelected) {
      updatedDepartureAirports = airportArr.filter(
        (airport) => airport !== value
      );
      updatedAppliedFilters = appliedFilters.filter(
        (item) => !(item.type === "altDepartureAirport" && item.value === value)
      );
    } else {
      updatedDepartureAirports = [...airportArr, value];
      updatedAppliedFilters = [
        ...appliedFilters,
        { type: "altDepartureAirport", value },
      ];
    }

    dispatch(setAppliedFilters(updatedAppliedFilters));

    const { alternateAirport, ...rest } = filterValue;

    if (updatedDepartureAirports.length > 0 || arrivalArr.length > 0) {
      dispatch(
        setFilterValue({
          ...filterValue,
          alternateAirport: {
            departureAirport: updatedDepartureAirports,
            arrivalAirport: arrivalArr,
          },
        })
      );
    } else {
      dispatch(setFilterValue({ ...rest }));
    }
  };

  // Alternative Arrival Airports Filter
  const handleAlternativeArrivalAirport = (value) => {
    setAlternateDateFilter(false);
    const airportArr = filterValue?.alternateAirport?.arrivalAirport || [];
    const deptArr = filterValue?.alternateAirport?.departureAirport || [];

    let updatedArrivalAirports;
    let updatedAppliedFilters;

    const isSelected = airportArr.includes(value);

    if (isSelected) {
      updatedArrivalAirports = airportArr.filter(
        (airport) => airport !== value
      );
      updatedAppliedFilters = appliedFilters.filter(
        (item) => !(item.type === "altArrivalAirport" && item.value === value)
      );
    } else {
      updatedArrivalAirports = [...airportArr, value];
      updatedAppliedFilters = [
        ...appliedFilters,
        { type: "altArrivalAirport", value },
      ];
    }

    dispatch(setAppliedFilters(updatedAppliedFilters));

    const { alternateAirport, ...rest } = filterValue;

    if (updatedArrivalAirports.length > 0 || deptArr.length > 0) {
      dispatch(
        setFilterValue({
          ...filterValue,
          alternateAirport: {
            departureAirport: deptArr,
            arrivalAirport: updatedArrivalAirports,
          },
        })
      );
    } else {
      dispatch(setFilterValue({ ...rest }));
    }
  };

  ////////////// Remove Applied Filter Functions ////////////
  // Remove Airports Filter
  const handleRemoveAirlineFilter = (filter) => {
    let updatedAirlines = appliedFilters?.filter(
      (item) => item?.value !== filter?.value
    );

    const { airlines, ...rest } = filterValue;
    if (updatedAirlines?.length > 0) {
      dispatch(
        setFilterValue({
          ...filterValue,
          airlines: updatedAirlines?.map((item) => item?.value),
        })
      );
    } else {
      dispatch(setFilterValue({ ...rest }));
    }

    handleRemoveAppliedFilterByValue(filter?.value);
  };

  // Remove Popular Filter
  const handleRemovePopularFilter = (filter) => {
    handleRemoveAppliedFilterByValue(filter?.value);
    dispatch(setFilterValue({ ...filterValue, [filter?.value]: false }));
  };

  // Remove Payment Filter
  const handleRemovePaymentFilter = (filter) => {
    handleRemoveAppliedFilterByType(filter?.type);
    dispatch(setFilterValue({ ...filterValue, [filter?.value]: false }));
  };

  const handleRemoveAdvanceFilter = (filter) => {
    const updatedFilters = appliedFilters.filter(
      (item) => item?.value !== filter?.value
    );

    let updatedFilterValue = { ...filterValue };

    if (filter.type === "alternateDateData") {
      updatedFilterValue.alternateDateData = [];
    }

    dispatch(setAppliedFilters(updatedFilters));
    dispatch(setFilterValue(updatedFilterValue));

    handleRemoveAppliedFilterByValue(filter?.value);
  };

  // Remove Price Filter
  const handleRemovePriceFilter = (filter) => {
    dispatch(
      setFilterValue({
        ...filterValue,
        price: {
          minPrice: filterData?.price?.minPrice,
          maxPrice: filterData?.price?.maxPrice,
        },
      })
    );

    handleRemoveAppliedFilterByType(filter?.type);
  };

  // Remove Oneway Stop Filter
  const handleRemoveOnewayStopFilter = (filter) => {
    const { stopsCount, ...rest } = filterValue;
    dispatch(setFilterValue({ ...rest }));
    handleRemoveAppliedFilterByType(filter?.type);
  };

  // Remove Return and Multicity Stop Filter
  const handleRemoveReturnAndMulticityStopFilter = (filter) => {
    handleReturnAndMultiCityStop(
      filter?.propName,
      filter?.segment,
      filter?.tripType,
      filter?.label
    );
    handleRemoveAppliedFilterByType(filter?.type);
  };

  // Remove Fare Type Filter
  const handleRemoveFareTypeFilter = (filter) => {
    const { isRefundable, ...rest } = filterValue;
    dispatch(setFilterValue({ ...rest }));
    handleRemoveAppliedFilterByType(filter?.type);
  };

  // Remove Onward and Return Departure Time Filter
  const handleRemoveDepartureTimeFilter = (filter) => {
    handleOnwardDerpartureTime(filter?.mainValue, filter?.index);
  };

  // Remove Onward and Return Departure Time Filter
  const handleRemoveArrivalTimeFilter = (filter) => {
    handleOnwardArrivalTime(filter?.mainValue, filter?.index);
  };

  // Remove Layover Time Filter
  const handleRemoveLayoverTimeFilter = (filter) => {
    handleLayoverTime(filter?.value);
  };

  // Remove Baggage Filter
  const handleRemoveBaggageFilter = (filter) => {
    handleBaggage({ baggage: filter?.value });
  };

  // Remove Layover Airport Filter
  const handleRemoveAirportFilter = (filter) => {
    handleLayoverAirport(filter?.value);
  };

  const handleRemoveAppliedFilterByType = (type) => {
    dispatch(
      setAppliedFilters(appliedFilters.filter((item) => item.type !== type))
    );
  };

  const handleRemoveAppliedFilterByValue = (value) => {
    dispatch(
      setAppliedFilters(appliedFilters.filter((item) => item.value !== value))
    );
  };
  // console.log(appliedFilters);
  const handleAddAppliedFilterByType = (type, crrValue) => {
    const isUndefined = appliedFilters.some(
      (item) => item?.type === type || item?.type === undefined
    );

    const updatedFilters = isUndefined
      ? appliedFilters.map((item) => {
          if (item?.type === type || item?.type === undefined) {
            return crrValue;
          }
          return item;
        })
      : [...appliedFilters, crrValue];

    dispatch(setAppliedFilters(updatedFilters));
  };

  const stopSegments =
    filterData?.tripType === "return"
      ? ["go", "back"]
      : filterData?.tripType === "multiCity" &&
        Object?.keys(filterData?.stopsCount?.multiCity);

  const onewayStopsTrueLenght = truePropsCount(
    filterData?.stopsCount?.oneWay ? filterData?.stopsCount?.oneWay : {}
  );

  const handleAccordionChange = (accordion) => {
    setAccordionState((prevState) => ({
      ...prevState,
      [accordion]: !prevState[accordion],
    }));
  };

  useEffect(() => {
    const isReady = progress === 100;

    setAccordionState((prevState) => ({
      ...prevState,
      popularExpand: isReady,
      priceExpand: isReady,
      advancedFilterExpand: isReady,
      oneWayExpand:
        isReady &&
        filterData?.tripType === "oneWay" &&
        onewayStopsTrueLenght > 1,
      moreWayExpand:
        (isReady && filterData?.tripType === "multiCity") ||
        (isReady && filterData?.tripType === "return"),
      refundExpand: isReady && filterData?.isRefundable?.length > 0,
      departExpand: isReady && filterData?.layoverTime?.length > 0,
      arrivalExpand: isReady && filterData?.baggage?.length > 0,
      layoverExpand: isReady && filterData?.layOverAirport?.length > 0,
      baggageExpand: isReady && filterData?.baggage?.length > 0,
      airportExpand: isReady && filterData?.layOverAirport?.length > 0,
      altDeptAirportExpand:
        isReady && filterData?.alternateAirport?.departureAirport?.length > 0,
      altArrAirportExpand:
        isReady && filterData?.alternateAirport?.arrivalAirport?.length > 0,
    }));
  }, [
    progress,
    filterData?.tripType,
    onewayStopsTrueLenght,
    filterData?.isRefundable,
    filterData?.layoverTime,
    filterData?.baggage,
    filterData?.layOverAirport,
  ]);

  // console.log(filterData)

  return (
    <Box
      sx={{
        "&::-webkit-scrollbar": {
          width: "0px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "",
          borderRadius: "5px",
          border: "3px solid #d9d9d9",
        },
        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#f1f1f1" },
        "&:hover": { "&::-webkit-scrollbar": { width: 1 } },
      }}
    >
      {/* --- page reload counter time start --- */}
      <Box py={0} sx={{ display: { xs: "none", lg: "block" } }}>
        <TimerLimit label={"Time Remaining"} limitMinutes={15} />
      </Box>
      {appliedFilters?.length > 0 && (
        <Box
          px={2.5}
          py={1.7}
          mb={2}
          sx={{ bgcolor: "white", borderRadius: "4.31px" }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h2"
              component="h2"
              mb={2}
              sx={filterLabelStyle}
            >
              Applied Filters:
            </Typography>
            <Typography
              onClick={() => {
                dispatch(setFilterValue({}));
                dispatch(setAppliedFilters([]));
              }}
              variant="h2"
              component="h2"
              mb={2}
              sx={{ ...filterLabelStyle, fontWeight: 600, cursor: "pointer" }}
            >
              Reset Filter
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              bgcolor: "white",
              borderRadius: "4.31px",
            }}
          >
            {appliedFilters.map((filter, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#F1592A1A",
                  borderRadius: "16px",
                  px: 1.5,
                  py: 0.5,
                  mr: 1,
                  mb: 1,
                  fontWeight: 500,
                  color: "var(--primary-color)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {filter?.value}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => {
                    if (filter?.type === "airlines") {
                      handleRemoveAirlineFilter(filter);
                    } else if (filter?.type === "alternateDateData") {
                      handleRemoveAdvanceFilter(filter);
                    } else if (filter?.type === "popular") {
                      handleRemovePopularFilter(filter);
                    } else if (filter?.type === "payment") {
                      handlePaymentType(filter.key, filter.value);
                    } else if (filter?.type === "price") {
                      handleRemovePriceFilter(filter);
                    } else if (filter?.type === "fare") {
                      handleRemoveFareTypeFilter(filter);
                    } else if (filter?.type === "baggage") {
                      handleRemoveBaggageFilter(filter);
                    } else if (filter?.type === "airport") {
                      handleRemoveAirportFilter(filter);
                    } else if (filter?.type === "stop") {
                      handleRemoveOnewayStopFilter(filter);
                    } else if (filter?.type?.includes("stops")) {
                      handleRemoveReturnAndMulticityStopFilter(filter);
                    } else if (filter?.type === "layoverTime") {
                      handleRemoveLayoverTimeFilter(filter);
                    } else if (
                      filter?.type === "onwardDepartureTime" ||
                      filter?.type === "returnDepartureTime"
                    ) {
                      handleRemoveDepartureTimeFilter(filter);
                    } else if (
                      filter?.type === "onwardArrivalTime" ||
                      filter?.type === "returnArrivalTime"
                    ) {
                      handleRemoveArrivalTimeFilter(filter);
                    } else if (filter?.type === "altDepartureAirport") {
                      handleAlternativeDepartureAirport(filter?.value);
                    } else if (filter?.type === "altArrivalAirport") {
                      handleAlternativeArrivalAirport(filter?.value);
                    }
                  }}
                  sx={{
                    color: "white",
                    padding: "4px",
                    marginLeft: "8px",
                    width: "16px",
                    height: "16px",
                    mr: "-8px",
                    bgcolor: "var(--primary-color)",
                    "&:hover": { bgcolor: "var(--primary-color)" },
                  }}
                >
                  <CloseIcon
                    fontSize="small"
                    sx={{ width: "12px", height: "12px", fontWeight: 600 }}
                  />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* --- most popular start --- */}
      <Accordion
        sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
        expanded={progress === 100 ? accordionState.popularExpand : false}
        onChange={() => {
          if (progress === 100) {
            handleAccordionChange("popularExpand");
          }
        }}
        disabled={progress !== 100}
      >
        <AccordionSummary
          expandIcon={
            <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
          }
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography {...titleProps}>Most Popular</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box {...boxProps}>
            <Grid container spacing={"12px"}>
              {popularLists.map((list, i) => (
                <PopularButtons
                  key={i}
                  isSelected={filterValue?.[list?.propName]}
                  label={list?.label}
                  propName={list?.propName}
                  onClick={handleMostPopular}
                />
              ))}

              {filterData?.isRefundable.map((list, i) => (
                <PopularButtons
                  key={i}
                  isSelected={
                    filterValue?.isRefundable &&
                    filterValue?.isRefundable[0] === list
                  }
                  label={list}
                  onClick={() => handleFareType(list)}
                />
              ))}

              {paymentLists.map((list, i) => (
                <PopularButtons
                  key={i}
                  isSelected={filterValue?.[list?.propName]}
                  label={list?.label}
                  propName={list?.propName}
                  onClick={() => handlePaymentType(list.propName, list.label)}
                />
              ))}
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      {value === "oneway" &&
        flightAfterSearch !== "reissue-search" &&
        advancedFilterValue?.length !== 0 && (
          <Accordion
            sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
            expanded={progress === 100 && accordionState.advancedFilterExpand}
            onChange={() => {
              if (progress === 100) {
                handleAccordionChange("advancedFilterExpand");
              }
            }}
            disabled={progress !== 100}
          >
            <AccordionSummary
              expandIcon={
                <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
              }
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography {...titleProps}>Advanced</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box
                sx={{
                  px: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  pb: "15px",
                }}
              >
                {advancedLists.map((option) => {
                  const isSelected = advancedFilter === option;
                  return (
                    <Box
                      key={option}
                      sx={{
                        ...boxBaseStyles,
                        bgcolor: isSelected
                          ? "var(--primary-color)"
                          : "transparent",
                        color: isSelected ? "white" : "var(--secondary-color)",
                      }}
                      onClick={() => {
                        dispatch(setAdvancedFilter(option));
                        setAlternateDateFilter(false);
                      }}
                    >
                      <Typography sx={textStyles}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

      {/* --- price slider accordion --- */}
      <Accordion
        sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
        expanded={progress === 100 ? accordionState.priceExpand : false}
        onChange={() => {
          if (progress === 100) {
            handleAccordionChange("priceExpand");
          }
        }}
        disabled={progress !== 100}
      >
        <AccordionSummary
          expandIcon={
            <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
          }
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography {...titleProps}>Price Slider</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box {...boxProps}>
            <PriceSlider
              min={filterData?.price?.minPrice}
              max={filterData?.price?.maxPrice}
              value={
                filterValue?.price?.maxPrice || filterData?.price?.maxPrice
              }
              onChange={handlePriceChange}
              label="Price Slider"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* --- Stops start oneway (in accordion) --- */}
      {filterData?.tripType === "oneWay" && onewayStopsTrueLenght > 1 && (
        <Accordion
          sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
          expanded={progress === 100 ? accordionState.oneWayExpand : false}
          onChange={() => {
            if (progress === 100) {
              handleAccordionChange("oneWayExpand");
            }
          }}
          disabled={progress !== 100}
        >
          <AccordionSummary
            expandIcon={
              <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
            }
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography {...titleProps}>Onward Stops</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box {...boxProps}>
              <Grid container spacing={"12px"}>
                {stopLists.map((list, i) => (
                  <React.Fragment key={i}>
                    {!!filterData?.stopsCount?.oneWay?.[list?.propName] && (
                      <PopularButtons
                        isSelected={
                          filterValue?.stopsCount?.oneWay?.[list?.propName] ===
                          filterData?.stopsCount?.oneWay?.[list?.propName]
                        }
                        label={list?.label}
                        propName={list?.propName}
                        onClick={() =>
                          handleOneWayStop(list?.propName, list?.label)
                        }
                      />
                    )}
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* --- Stops start return and multicity --- */}
      {(filterData?.tripType === "return" ||
        filterData?.tripType === "multiCity") &&
        (() => {
          // Calculate if all segments should be hidden
          const shouldHideAccordion = stopSegments.every((seg) => {
            const truePropLength = truePropsCount(
              filterData?.stopsCount?.[filterData?.tripType]?.[seg]
            );
            const boxStyle = hideFalseBox(truePropLength);
            return (
              boxStyle?.display === "none" || boxStyle?.visibility === "hidden"
            );
          });

          // Only render Accordion if at least one segment would be visible
          return (
            !shouldHideAccordion && (
              <Accordion
                sx={{
                  borderRadius: "4.5px",
                  boxShadow: "none",
                  mb: "12px",
                  ...(shouldHideAccordion ? { display: "none" } : {}),
                }}
                expanded={accordionState.moreWayExpand}
                onChange={() => handleAccordionChange("moreWayExpand")}
              >
                <AccordionSummary
                  expandIcon={
                    <KeyboardArrowDownIcon
                      sx={{ color: "var(--primary-color)" }}
                    />
                  }
                  aria-controls="panel4-content"
                  id="panel4-header"
                >
                  <Typography {...titleProps}>
                    {filterData?.tripType === "return"
                      ? "Return Stops"
                      : "MultiCity Stops"}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {stopSegments.map((seg, index) => {
                    const truePropLength = truePropsCount(
                      filterData?.stopsCount?.[filterData?.tripType]?.[seg]
                    );

                    const title =
                      filterData?.tripType === "return"
                        ? index === 0
                          ? "Onward"
                          : "Return"
                        : `City ${index + 1}`;

                    return (
                      <Box
                        {...boxProps}
                        key={index}
                        sx={hideFalseBox(truePropLength)}
                      >
                        <Typography
                          {...titleProps}
                          sx={{ ...filterLabelStyle, mb: 0.5 }}
                        >
                          {title} Stops
                        </Typography>
                        <Grid container spacing={"12px"}>
                          {stopLists.map((list, i) => {
                            const filterDataProp =
                              filterData?.stopsCount?.[filterData?.tripType]?.[
                                seg
                              ]?.[list?.propName];

                            return (
                              <React.Fragment key={i}>
                                {!!filterDataProp && (
                                  <PopularButtons
                                    isSelected={
                                      filterValue?.stopsCount?.[
                                        filterData?.tripType
                                      ]?.[seg]?.[list?.propName] ===
                                      filterDataProp
                                    }
                                    label={list?.label}
                                    propName={list?.propName}
                                    onClick={() =>
                                      handleReturnAndMultiCityStop(
                                        list?.propName,
                                        seg,
                                        filterData?.tripType,
                                        title + " - " + list?.label
                                      )
                                    }
                                  />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </Grid>
                      </Box>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            )
          );
        })()}

      {/* --- Fare type section start --- */}
      {filterData?.isRefundable?.length > 1 && (
        <Accordion
          sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
          expanded={progress === 100 ? accordionState.refundExpand : false}
          onChange={() => {
            if (progress === 100) {
              handleAccordionChange("refundExpand");
            }
          }}
          disabled={progress !== 100}
        >
          <AccordionSummary
            expandIcon={
              <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
            }
            aria-controls="panel5-content"
            id="panel5-header"
          >
            <Typography {...titleProps}>Fare Type</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: "18px" }}>
            {filterData?.isRefundable?.map((data, i) => (
              <Box key={i}>
                <CustomCheckBox
                  value={
                    filterValue?.isRefundable &&
                    filterValue?.isRefundable[0] === data
                  }
                  style={{ color: "var(--secondary-color)" }}
                  iconProps={{ color: "var(--secondary-color)" }}
                  label={
                    <span style={{ color: "#3d3a49" }}>
                      {" "}
                      {convertCamelToTitle(data)}
                    </span>
                  }
                  handleChange={() => handleFareType(data)}
                />
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      )}

      {/* --- onward depart time start--- */}
      {Array.isArray(filterData?.onwardDepartureTime) &&
        filterData.onwardDepartureTime.map((timeList, i) => {
          const title =
            i === 0 ? "Onward Departure Time" : "Return Departure Time";

          return (
            Array.isArray(timeList) && (
              <Accordion
                key={i}
                sx={{
                  borderRadius: "4.5px",
                  boxShadow: "none",
                  mb: "12px",
                  ...hideFalseBox(timeList.length),
                }}
                expanded={
                  progress === 100 ? accordionState.departExpand : false
                }
                onChange={() => {
                  if (progress === 100) {
                    handleAccordionChange("departExpand");
                  }
                }}
                disabled={progress !== 100}
              >
                <AccordionSummary
                  expandIcon={
                    <KeyboardArrowDownIcon
                      sx={{ color: "var(--primary-color)" }}
                    />
                  }
                  aria-controls={`panel6-content-${i}`}
                  id={`panel6-header-${i}`}
                >
                  <Typography {...titleProps}>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box {...boxProps}>
                    <Grid container spacing={"12px"}>
                      {timeList.map((timeObj, index) => {
                        const [label, timeRange] = Object.entries(timeObj)[0];
                        const backgroundColor =
                          statusColorMap[label] || "transparent";
                        const labelBgColor =
                          statusColorMap[label] || "transparent";

                        return (
                          <TimePopularButtons
                            key={index}
                            isSelected={
                              filterValue?.onwardDepartureTime &&
                              filterValue?.onwardDepartureTime[i]?.includes(
                                timeRange
                              )
                            }
                            label={
                              <span
                                style={{
                                  padding: "2px 4px",
                                  borderRadius: "3px",
                                }}
                              >
                                {label}
                                <br />
                                {timeRange}
                              </span>
                            }
                            propName={timeRange}
                            labelBgColor={labelBgColor}
                            onClick={() =>
                              handleOnwardDerpartureTime(timeRange, i)
                            }
                            sx={{ backgroundColor }}
                          />
                        );
                      })}
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )
          );
        })}

      {/* --- onward arrival time start--- */}
      {Array.isArray(filterData?.onwardArrivalTime) &&
        filterData.onwardArrivalTime.map((timeList, i) => {
          const title = i === 0 ? "Onward Arrival Time" : "Return Arrival Time";

          return (
            Array.isArray(timeList) && (
              <Accordion
                key={i}
                sx={{
                  borderRadius: "4.5px",
                  boxShadow: "none",
                  mb: "12px",
                  ...hideFalseBox(timeList.length),
                }}
                expanded={
                  progress === 100 ? accordionState.arrivalExpand : false
                }
                onChange={() => {
                  if (progress === 100) {
                    handleAccordionChange("arrivalExpand");
                  }
                }}
                disabled={progress !== 100}
              >
                <AccordionSummary
                  expandIcon={
                    <KeyboardArrowDownIcon
                      sx={{ color: "var(--primary-color)" }}
                    />
                  }
                  aria-controls={`panel7-content-${i}`}
                  id={`panel7-header-${i}`}
                >
                  <Typography {...titleProps}>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box {...boxProps}>
                    <Grid container spacing={"12px"}>
                      {timeList.map((timeObj, index) => {
                        const [label, timeRange] = Object.entries(timeObj)[0];
                        const backgroundColor =
                          statusColorMap[label] || "transparent";
                        const labelBgColor =
                          statusColorMap[label] || "transparent";

                        return (
                          <TimePopularButtons
                            key={index}
                            isSelected={
                              filterValue?.onwardArrivalTime &&
                              filterValue?.onwardArrivalTime[i]?.includes(
                                timeRange
                              )
                            }
                            label={
                              <span
                                style={{
                                  padding: "2px 4px",
                                  borderRadius: "3px",
                                }}
                              >
                                {label}
                                <br />
                                {timeRange}
                              </span>
                            }
                            labelBgColor={labelBgColor}
                            propName={timeRange}
                            onClick={() =>
                              handleOnwardArrivalTime(timeRange, i)
                            }
                            sx={{ backgroundColor }}
                          />
                        );
                      })}
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )
          );
        })}

      {/* --- layover time start--- */}
      {filterData?.layoverTime?.length > 1 && (
        <Accordion
          sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
          expanded={progress === 100 ? accordionState.layoverExpand : false}
          onChange={() => {
            if (progress === 100) {
              handleAccordionChange("layoverExpand");
            }
          }}
          disabled={progress !== 100}
        >
          <AccordionSummary
            expandIcon={
              <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
            }
            aria-controls="panel8-content"
            id="panel8-header"
          >
            <Typography {...titleProps}>Layover Time</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box {...boxProps}>
              <Grid container spacing={"12px"}>
                {filterData?.layoverTime.map((time, i) => (
                  <PopularButtons
                    key={i}
                    isSelected={filterValue?.layoverTime?.includes(time)}
                    label={time}
                    propName={time}
                    onClick={() => handleLayoverTime(time)}
                  />
                ))}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* --- Baggage section start --- */}
      {filterData?.baggage?.length > 1 && (
        <Accordion
          sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
          expanded={progress === 100 ? accordionState.baggageExpand : false}
          onChange={() => {
            if (progress === 100) {
              handleAccordionChange("baggageExpand");
            }
          }}
          disabled={progress !== 100}
        >
          <AccordionSummary
            expandIcon={
              <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
            }
            aria-controls="panel9-content"
            id="panel9-header"
          >
            <Typography {...titleProps}>Baggage</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box {...boxProps}>
              {filterData?.baggage
                ?.slice(0, bagShow ? filterData?.baggage?.length : 5)
                ?.map((bag, i) => (
                  <Box key={i}>
                    <CustomCheckBox
                      value={
                        filterValue?.baggage &&
                        filterValue?.baggage?.some(
                          (data) => data?.baggage === bag?.baggage
                        )
                      }
                      style={{ color: "var(--secondary-color)" }}
                      iconProps={{ color: "var(--secondary-color)" }}
                      label={
                        <span style={{ color: "#3d3a49" }}>{bag?.baggage}</span>
                      }
                      handleChange={() => handleBaggage(bag)}
                    />
                  </Box>
                ))}
              {filterData?.baggage?.length > 5 && (
                <Typography
                  onClick={() => setBagShow(!bagShow)}
                  sx={{ showBtn }}
                >
                  {bagShow ? "Show Less" : "Show More"}
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* --- Layover airport section start --- */}
      {filterData?.layOverAirport?.length > 1 && (
        <Accordion
          sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
          expanded={progress === 100 ? accordionState.airportExpand : false}
          onChange={() => {
            if (progress === 100) {
              handleAccordionChange("airportExpand");
            }
          }}
          disabled={progress !== 100}
        >
          <AccordionSummary
            expandIcon={
              <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
            }
            aria-controls="panel10-content"
            id="panel10-header"
          >
            <Typography {...titleProps}>Layover Airports</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box {...boxProps}>
              {filterData?.layOverAirport
                ?.slice(0, airportShow ? filterData?.layOverAirport?.length : 5)
                ?.map((airport, i) => (
                  <Box key={i}>
                    <CustomCheckBox
                      value={
                        filterValue?.layOverAirport &&
                        filterValue?.layOverAirport?.includes(airport)
                      }
                      style={{ color: "var(--secondary-color)" }}
                      iconProps={{ color: "var(--secondary-color)" }}
                      label={
                        <span style={{ color: "#3d3a49" }}>{airport}</span>
                      }
                      handleChange={() => handleLayoverAirport(airport)}
                    />
                  </Box>
                ))}
              {filterData?.layOverAirport?.length > 5 && (
                <Typography
                  onClick={() => setAirportShow(!airportShow)}
                  sx={showBtn}
                >
                  {airportShow ? "Show Less" : "Show More"}
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* --- Alternative departure airport section start --- */}
      {Array.isArray(filterData?.alternateAirport?.departureAirport) &&
        filterData?.alternateAirport?.departureAirport?.length > 0 && (
          <Accordion
            sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
            expanded={
              progress === 100 ? accordionState.altDeptAirportExpand : false
            }
            onChange={() => {
              if (progress === 100) {
                handleAccordionChange("altDeptAirportExpand");
              }
            }}
            disabled={progress !== 100}
          >
            <AccordionSummary
              expandIcon={
                <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
              }
              aria-controls="panel10-content"
              id="panel10-header"
            >
              <Typography {...titleProps}>
                Alternative Departure Airports
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box {...boxProps}>
                {filterData?.alternateAirport?.departureAirport?.map(
                  (airport, i) => (
                    <Box key={i}>
                      <CustomCheckBox
                        value={
                          filterValue?.alternateAirport?.departureAirport &&
                          filterValue?.alternateAirport?.departureAirport?.includes(
                            airport
                          )
                        }
                        style={{ color: "var(--secondary-color)" }}
                        iconProps={{ color: "var(--secondary-color)" }}
                        label={airport}
                        handleChange={() =>
                          handleAlternativeDepartureAirport(airport)
                        }
                      />
                    </Box>
                  )
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

      {/* --- Alternative arrival airport section start --- */}
      {Array.isArray(filterData?.alternateAirport?.arrivalAirport) &&
        filterData?.alternateAirport?.arrivalAirport?.length > 0 && (
          <Accordion
            sx={{ borderRadius: "4.5px", boxShadow: "none", mb: "12px" }}
            expanded={
              progress === 100 ? accordionState?.altArrAirportExpand : false
            }
            onChange={() => {
              if (progress === 100) {
                handleAccordionChange("altArrAirportExpand");
              }
            }}
            disabled={progress !== 100}
          >
            <AccordionSummary
              expandIcon={
                <KeyboardArrowDownIcon sx={{ color: "var(--primary-color)" }} />
              }
              aria-controls="panel10-content"
              id="panel10-header"
            >
              <Typography {...titleProps}>
                Alternative Arrival Airports
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box {...boxProps}>
                {filterData?.alternateAirport?.arrivalAirport?.map(
                  (airport, i) => (
                    <Box key={i}>
                      <CustomCheckBox
                        value={
                          filterValue?.alternateAirport?.arrivalAirport &&
                          filterValue?.alternateAirport?.arrivalAirport?.includes(
                            airport
                          )
                        }
                        style={{ color: "var(--secondary-color)" }}
                        iconProps={{ color: "var(--secondary-color)" }}
                        label={airport}
                        handleChange={() =>
                          handleAlternativeArrivalAirport(airport)
                        }
                      />
                    </Box>
                  )
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
    </Box>
  );
};

const TimePopularButtons = ({
  onClick,
  label,
  isSelected,
  propName,
  labelBgColor,
}) => {
  return (
    <Grid item md={6} xs={12}>
      <Box
        sx={{
          border: `1px solid ${labelBgColor}`,
          borderRadius: "4px",
          bgcolor: isSelected ? labelBgColor : "transparent",
          color: isSelected ? "white" : "var(--secondary-color)",
          cursor: "pointer",
        }}
        onClick={() => onClick(propName)}
      >
        <Typography
          sx={{
            fontSize: "12px",
            textAlign: "center",
            my: 1,
            fontWeight: 500,
            color: isSelected ? "#fff" : "#3d3a49",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Grid>
  );
};

const PopularButtons = ({ onClick, label, isSelected, propName }) => {
  return (
    <Grid item xs={6}>
      <Box
        sx={{
          border: "1px solid #D9D9D9",
          borderRadius: "4px",
          bgcolor: isSelected ? "var(--primary-color)" : "transparent",
          color: isSelected ? "white" : "var(--secondary-color)",
          cursor: "pointer",
          px: 1,
        }}
        onClick={() => onClick(propName)}
      >
        <Typography
          noWrap
          sx={{
            fontSize: "12px",
            textAlign: "center",
            my: 1,
            fontWeight: 500,
            color: isSelected ? "#fff" : "#3d3a49",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Grid>
  );
};

const boxProps = {
  px: "20px",
  pt: 1,
  pb: 2,
  sx: { bgcolor: "white", borderRadius: "4.31px" },
};

const boxBaseStyles = {
  border: "1px solid #D9D9D9",
  borderRadius: "4px",
  cursor: "pointer",
  width: "47%",
};
const textStyles = {
  fontSize: "12px",
  textAlign: "center",
  my: 1,
  fontWeight: 500,
};

const titleProps = {
  variant: "h2",
  component: "h2",
  sx: { ...filterLabelStyle },
};

const popularLists = [
  { propName: "cheapest", label: "Cheapest" },
  { propName: "fastest", label: "Fastest" },
  { propName: "earliest", label: "Earliest" },
  { propName: "expensive", label: "Expensive" },
];

const paymentLists = [
  { propName: "partPayment", label: "Part Payment" },
  { propName: "fullPayment", label: "Full Payment" },
];

const advancedLists = ["airlines", "calendar"];

const stopLists = [
  { propName: "direct", label: "Direct" },
  { propName: "oneStops", label: "1 Stop" },
  { propName: "twoStops", label: "2 Stops" },
  { propName: "threeStops", label: "2+ Stops" },
];

const showBtn = {
  fontSize: "12px",
  textDecoration: "underline",
  fontWeight: 700,
  mt: 0.5,
  cursor: "pointer",
  color: "var(--text-color)",
};

const toggleValueInArray = (array, value) => {
  return array?.includes(value) ? [] : [value];
};

const truePropsCount = (obj) =>
  Object?.values(obj)?.filter((value) => value)?.length;

const hideFalseBox = (truePropLength) => {
  return {
    bgcolor: "white",
    borderRadius: "4.31px",
    display: truePropLength < 2 && "none",
  };
};

export default FlightAfterFilter;
