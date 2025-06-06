import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Box, Grid, Skeleton, Typography } from "@mui/material";
import PolicyTable from "./PolicyTable";
import BaggageTable from "./BaggageTable";
import FlightDetails from "./FlightDetails";
import FareSummary from "./FareSummary";
import DiscountTable from "./DiscountTable";
import AfterViewCard from "../ViewFare/AfterViewCard";
import FareRulesTable from "./FareRulesTable";
import ViewFare, { AirlineChargeNotice } from "../ViewFare/ViewFare";
import FareDifferenceTable from "./FareDifferenceTable";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setAdvancedFlightData,
  setAdvancedModifiedBrands,
  setCrrItenary,
  setSelectedSplitBrandsRed,
  setShouldCallAirPrice,
} from "../FlightSearchBox/flighAfterSearchSlice";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import { useAuth } from "../../context/AuthProvider";
import PartialPaymentTable from "./PartialPaymentTable";
import moment from "moment";
import SplitItenaryTabs from "../../pages/SplitAfterSearch/SplitItenaryTabs";
import EastIcon from "@mui/icons-material/East";
import { alignCenter } from "../../pages/SplitAfterSearch/SplitFlightDetails";

const FlightDetailsSection = ({
  flightData,
  oldFlightData,
  fareRules,
  segmentsList,
  cabin,
  totalPassenger,
  selectedBrand,
  bookType = "normal",
  isFareLoading,
  bookingData = "current booking",
  flightAfterSearch,
  flightBrand,
  bookingId,
  searchType,
  reissuePassengers,
  paxDetails,
  setFlightBrand,
  fareCard,
  tabType,
  partialChargeData,
  fareSummaryFlightData,
  setFareSummaryFlightData,
  advancedSelectedSeats,
  advanceSearchResult,
  showDetails,
  splitFlightArr,
  passingItenary,
}) => {
  const [finalFlightData, setFinalFlightData] = useState(
    searchType === "split" ? splitFlightArr : [flightData]
  );
  const location = useLocation();
  const [flightTab, setFlightTab] = useState(tabType);
  const dispatch = useDispatch();
  const { advancedFlightData, crrItenary, advnacedModifiedBrands } =
    useSelector((state) => state.flightAfter);

  const [isAfterFareLoading, setIsAfterFareLoading] = useState(false);
  const [selectedSplitBrands, setSelectedSplitBrands] = useState(flightBrand);
  const [fareAfterRules, setFareAfterRules] = useState(() => {
    if (searchType === "advanced") {
      return advnacedModifiedBrands || [];
    }

    if (bookType === "normal") {
      if (fareCard === "newFare") {
        return finalFlightData[crrItenary]?.brands?.[0]
          ? [finalFlightData[crrItenary].brands[0]]
          : [];
      } else if (fareCard === "afterFare") {
        return selectedBrand
          ? fareRules?.filter((rule) => rule.brandId === selectedBrand?.brandId)
          : [];
      }
    } else if (bookType === "recheck" && fareCard === "afterFare") {
      return selectedBrand
        ? fareRules?.filter((rule) => rule.brandId === selectedBrand?.brandId)
        : [];
    }

    return finalFlightData[crrItenary]?.details?.brands?.[0]
      ? [finalFlightData[crrItenary]?.details.brands[0]]
      : [];
  });

  const hasShownErrorToast = useRef(false);
  const isPartialPayment =
    finalFlightData[crrItenary]?.partialPayment &&
    finalFlightData[crrItenary]?.isRefundable === "Partially Refundable" &&
    !finalFlightData[crrItenary]?.immediateIssue;

  const [fareSummaryPriceData, setFareSummaryPriceData] = useState(
    bookType === "normal" || bookType === "recheck"
      ? finalFlightData[crrItenary]?.priceBreakdown
      : finalFlightData[crrItenary]?.details?.priceBreakdown
  );

  const [partialPaymentChargeData, setPartialPaymentChargeData] =
    useState(partialChargeData);
  const { jsonHeader } = useAuth();
  const { checkUnAuthorized } = useUnAuthorized();

  const apiCallTracker = useRef({
    fareRules: false,
    airPrice: false,
    partialBooking: false,
  });
  const abortController = useRef(new AbortController());

  /*⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿ Start Calling API By Functions ⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿*/
  const fetchFareRules = async (brandId) => {
    if (apiCallTracker.current.fareRules) {
      return null;
    }

    apiCallTracker.current.fareRules = true;

    try {
      const isReissue =
        flightAfterSearch === "reissue-search" &&
        finalFlightData?.autoReissue === true;

      const body = {
        brandId: brandId?.toString(),
        system: finalFlightData[crrItenary]?.system,
        data: finalFlightData[crrItenary]?.uuid,
      };

      const reissueBody = {
        brandId: brandId?.toString(),
        bookingId: bookingId,
        uuid: finalFlightData[crrItenary]?.uuid,
      };

      const url = isReissue
        ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue/fare-rule`
        : `${process.env.REACT_APP_BASE_URL}/api/v1/user/fare-rule`;

      const requestBody = isReissue ? reissueBody : body;

      const response = await axios.post(url, requestBody, {
        ...jsonHeader(),
        signal: abortController.current.signal,
      });

      return response.data?.data;
    } catch (error) {
      // Handle cancellation differently
      if (axios.isCancel(error)) {
        return null;
      }

      console.error("Fare-rules call failed:", error);
      if (
        !hasShownErrorToast.current &&
        error.response?.data?.success === false &&
        error.response?.status === 400
      ) {
        dispatch(setShouldCallAirPrice("fare"));
        hasShownErrorToast.current = true;
      } else if (error?.response?.status === 401) {
        checkUnAuthorized(error);
      }
      return null;
    } finally {
      // Reset tracking flag
      apiCallTracker.current.fareRules = false;
    }
  };

  const fetchAirPrice = async (brand, index) => {
    if (apiCallTracker.current.airPrice) {
      return null;
    }

    apiCallTracker.current.airPrice = true;

    try {
      const isReissueSearch = flightAfterSearch === "reissue-search";
      const isAutoReissue = finalFlightData?.[index]?.autoReissue === true;

      const flightBody = {
        passengers: [
          {
            type: "ADT",
            count: totalPassenger?.adultCount || 0,
            ages: [],
          },
          {
            type: "CNN",
            count: Array.isArray(totalPassenger?.childCount)
              ? totalPassenger.childCount.length
              : 0,
            ages: Array.isArray(totalPassenger?.childCount)
              ? totalPassenger.childCount.map((age) => parseInt(age, 10))
              : [],
          },
          {
            type: "INF",
            count: totalPassenger?.infantCount || 0,
            ages: [],
          },
        ],
        brandId: brand?.brandId,
        cabin,
        selectedSeat:
          brand?.seatInfo?.map((seat) => seat.bookingClass).filter(Boolean) ||
          [],
        segmentsList,
        data: finalFlightData?.[index]?.uuid,
        reIssue: finalFlightData?.[index]?.reIssue || false,
        paxDetails: finalFlightData?.[index]?.paxDetails || [],
        bookingId: finalFlightData?.[index]?.bookingId || "",
      };

      const reissueBody = {
        brandId: brand?.brandId,
        bookingId: bookingId,
        uuid: finalFlightData?.[index]?.uuid,
      };

      let url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/air-price`;
      let method = "post";
      let requestBody = flightBody;

      if (isReissueSearch) {
        url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue/price`;
        if (isAutoReissue) {
          method = "post";
          requestBody = reissueBody;
        } else {
          method = "patch";
          requestBody = flightBody;
        }
      }

      const response = await axios[method](url, requestBody, {
        ...jsonHeader(),
        signal: abortController.current.signal,
      });

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) return null;
      if (error?.response?.status === 401) checkUnAuthorized(error);
      return null;
    } finally {
      apiCallTracker.current.airPrice = false;
    }
  };

  const fetchPartialRules = async () => {
    if (apiCallTracker.current.partialBooking) {
      return null;
    }

    apiCallTracker.current.partialBooking = true;

    try {
      const bodyData = {
        brandId: finalFlightData[crrItenary]?.brandId,
        data: finalFlightData[crrItenary]?.uuid,
        agentPrice: finalFlightData[crrItenary]?.agentPrice,
        travelDate: moment(
          finalFlightData[crrItenary]?.route?.[0]?.departureDate
        ).format("YYYY-MM-DD"),
        journeyType: finalFlightData[crrItenary]?.journeyType,
        passengers: finalFlightData[crrItenary]?.priceBreakdown?.map(
          (passenger) => ({
            type: passenger.paxType,
            count: passenger.paxCount,
            ages: passenger?.age === null ? [] : [passenger?.age],
          })
        ),
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/fare-rule`,
        bodyData,
        {
          ...jsonHeader(),
          signal: abortController.current.signal,
        }
      );

      if (response?.data?.success) {
        setPartialPaymentChargeData(response?.data?.data[0]);
      }
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return null;
      }

      if (error.response) {
        console.error(
          "Error response:",
          error.response.data.message || "An error occurred"
        );
      } else if (error.request) {
        console.error("Error request:", error.message);
      } else {
        console.error("Unexpected error:", "An unexpected error occurred.");
      }
      return null;
    } finally {
      apiCallTracker.current.partialBooking = false;
    }
  };
  /*𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕 End Calling API By Functions𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕*/

  /*⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿ Start Rendering Necessary Functions ⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿⦿*/
  useEffect(() => {
    dispatch(setCrrItenary(passingItenary || 0));
  }, []);

  useEffect(() => {
    if (searchType === "split") {
      setFinalFlightData(splitFlightArr);
    } else {
      setFinalFlightData([flightData]);
    }
  }, [searchType, crrItenary, flightData, splitFlightArr]);

  useEffect(() => {
    dispatch(setAdvancedFlightData(finalFlightData));
    dispatch(setAdvancedModifiedBrands(finalFlightData?.brands));
  }, []);

  useEffect(() => {
    if (partialChargeData) {
      setPartialPaymentChargeData(partialChargeData);
    }
  }, [partialChargeData]);

  useEffect(() => {
    if (
      searchType === "advanced" ||
      fareCard === "afterFare" ||
      bookType === "afterSearch" ||
      fareCard === "pnrFare"
    ) {
      return;
    }

    const fetchData = async () => {
      setIsAfterFareLoading(true);

      try {
        if (!Array.isArray(flightBrand) || flightBrand.length === 0) {
          setIsAfterFareLoading(false);
          return;
        }

        const brandIds = flightBrand
          .map((arr) => arr?.[0]?.brandId)
          .filter(Boolean);

        const uniqueBrandIds = [...new Set(brandIds)];

        const uniqueRuleResponses = await Promise.all(
          uniqueBrandIds.map((id) => fetchFareRules(id))
        );

        const ruleMap = {};
        uniqueBrandIds.forEach((id, i) => {
          ruleMap[id] = uniqueRuleResponses[i];
        });

        const rulesArray = brandIds.map((id) => ruleMap[id] || []);
        setFareAfterRules(rulesArray);

        // 🔥 Only fetch air price for current itinerary
        const currentBrand = flightBrand?.[crrItenary]?.[0];
        const airPriceResponse = await fetchAirPrice(currentBrand, crrItenary);

        const partialRulesPromise =
          flightAfterSearch !== "reissue-search" ? fetchPartialRules() : null;

        const partialRules = await partialRulesPromise;

        const selectedBrands = [...flightBrand]; // Start with original

        const responseData = airPriceResponse?.data?.response?.[0];
        const brand = responseData?.brands?.[0];
        const ruleData = Array.isArray(rulesArray[crrItenary])
          ? rulesArray[crrItenary][0] || {}
          : {};

        if (responseData && brand) {
          const mergedBrand = { ...brand, ...ruleData };
          selectedBrands[crrItenary] = [mergedBrand];

          setFareSummaryPriceData(responseData.priceBreakdown || []);
          setFareSummaryFlightData(responseData || {});
        } else {
          selectedBrands[crrItenary] = flightBrand[crrItenary] || [];

          const fallbackPrice =
            bookType === "normal"
              ? finalFlightData?.priceBreakdown
              : finalFlightData?.details?.priceBreakdown;

          const fallbackFlight =
            bookType === "normal"
              ? finalFlightData?.brands?.[0]
              : finalFlightData?.details?.brands?.[0];

          setFareSummaryPriceData(fallbackPrice || []);
          setFareSummaryFlightData(fallbackFlight || {});
        }

        setSelectedSplitBrands(selectedBrands);
        dispatch(setSelectedSplitBrandsRed(selectedBrands));
        // if (partialRules) {
        //   setFarePartialRules(partialRules);
        // }
      } catch (err) {
        console.error("Error in fetchData:", err);
      } finally {
        setIsAfterFareLoading(false);
      }
    };

    fetchData();
  }, [
    flightBrand?.[crrItenary]?.[0]?.brandId,
    searchType,
    fareCard,
    bookType,
    flightAfterSearch,
    finalFlightData,
  ]);

  /*𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕 End Rendering Necessary Functions 𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕𐤕*/

  const isShowSeats = location.pathname === "/dashboard/flightaftersearch";

  const handleFlightTab = (value) => {
    setFlightTab(value);
  };

  const shouldShowFareRules =
    fareCard === "pnrFare"
      ? finalFlightData?.structure?.length > 0
      : finalFlightData?.details?.structure?.length > 0;

  const filterFareRules = (tabs) =>
    shouldShowFareRules
      ? tabs
      : tabs.filter((tab) => tab.value !== "fareRules");

  // console.log(flightData);

  const tabItems = (() => {
    if (bookType === "recheck" && bookingData === "reissue booking") {
      return [
        { value: "flight", label: "Flight Details" },
        { value: "fare", label: "Fare Summary" },
        { value: "fareDifference", label: "Fare Difference" },
        { value: "baggage", label: "Baggage" },
        { value: "policy", label: "Service Charges" },
      ];
    }

    if (bookType === "recheck") {
      const items = [
        { value: "flight", label: "Flight Details" },
        { value: "fare", label: "Fare Summary" },
      ];

      if (fareAfterRules?.length > 0) {
        items.push({ value: "fareRules", label: "Fare Rules" });
      }

      if (
        partialPaymentChargeData !== undefined &&
        partialPaymentChargeData !== null
      ) {
        items.push({ value: "partialPayment", label: "Part Payment" });
      }

      items.push(
        { value: "baggage", label: "Baggage" },
        { value: "policy", label: "Service Charges" }
      );

      return items;
    }

    if (
      (bookType === "afterSearch" && bookingData === "current booking") ||
      (bookType === "normal" &&
        bookingData === "current booking" &&
        fareCard === "pnrFare")
    ) {
      return filterFareRules([
        { value: "flight", label: "Flight Details" },
        { value: "fare", label: "Fare Summary" },
        { value: "baggage", label: "Baggage" },
        { value: "fareRules", label: "Fare Rules" },
        { value: "policy", label: "Service Charges" },
      ]);
    }

    if (bookType === "afterSearch" && bookingData === "reissue booking") {
      return filterFareRules([
        { value: "flight", label: "Flight Details" },
        { value: "fare", label: "Fare Summary" },
        { value: "fareDifference", label: "Fare Difference" },
        { value: "baggage", label: "Baggage" },
        { value: "fareRules", label: "Fare Rules" },
        { value: "policy", label: "Service Charges" },
      ]);
    }

    if (
      bookType === "normal" &&
      bookingData === "current booking" &&
      flightAfterSearch === "reissue-search"
    ) {
      return [
        { value: "selectfare", label: "Select Fare" },
        { value: "flight", label: "Flight Details" },
        { value: "fare", label: "Fare Summary" },
        { value: "fareDifference", label: "Fare Difference" },
        { value: "discount", label: "Discount & Gross" },
        { value: "baggage", label: "Baggage" },
        { value: "policy", label: "Service Charges" },
      ];
    }

    if (bookType === "normal" && flightAfterSearch === "reissue-search") {
      return [
        { value: "selectfare", label: "Select Fare" },
        { value: "flight", label: "Flight Details" },
        { value: "fare", label: "Fare Summary" },
        { value: "fareDifference", label: "Fare Difference" },
        { value: "baggage", label: "Baggage" },
        { value: "policy", label: "Service Charges" },
      ];
    }

    if (
      location.pathname === "/dashboard/flightaftersearch" ||
      location.pathname === "/dashboard/booking/allpnrimport/share-pnr-retrive"
    ) {
      const items = flightData?.advanceSearch
        ? [
            { value: "selectfare", label: "Select Fare" },
            { value: "seatAvailability", label: "Seat Availability" },
            { value: "flight", label: "Flight Details" },
            { value: "fare", label: "Fare Summary" },
          ]
        : [
            { value: "selectfare", label: "Select Fare" },
            { value: "flight", label: "Flight Details" },
            { value: "fare", label: "Fare Summary" },
          ];

      // const items = [
      //   { value: "selectfare", label: "Select Fare" },
      //   ...(flightData?.advanceSearch
      //     ? [{ value: "seatAvailability", label: "Seat Availability" }]
      //     : []),
      //   { value: "flight", label: "Flight Details" },
      //   { value: "fare", label: "Fare Summary" },
      // ];

      if (fareAfterRules?.length > 0) {
        items.push({ value: "fareRules", label: "Fare Rules" });
      }

      if (isPartialPayment && partialPaymentChargeData != null) {
        items.push({ value: "partialPayment", label: "Part Payment" });
      }
      items.push(
        { value: "baggage", label: "Baggage" },
        { value: "policy", label: "Service Charges" }
      );

      return items;
    }

    return [
      { value: "selectfare", label: "Select Fare" },
      { value: "flight", label: "Flight Details" },
      { value: "fare", label: "Fare Summary" },
      ...(fareAfterRules?.length > 0
        ? [{ value: "fareRules", label: "Fare Rules" }]
        : []),
      ...(isPartialPayment && partialPaymentChargeData != null
        ? [{ value: "partialPayment", label: "Part Payment" }]
        : []),
      { value: "baggage", label: "Baggage" },
      { value: "policy", label: "Service Charges" },
    ];
  })();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: { xs: "none", lg: "block" },
          justifyContent: "space-between",
          px: "18px",
          pt: { xs: 0, lg: "7px" },
          borderTop: "1px solid #E9E9E9",
          borderBottom: "1px solid #E9E9E9",
        }}
      >
        {searchType === "split" && fareCard === "newFare" && (
          <Box pb={1}>
            {splitFlightArr?.map((flightData, i, arr) => {
              const cities = flightData?.cityCount?.flat();
              const firstSeg = cities[0] || {};
              const lastSeg = cities?.at(cities?.length - 1) || {};

              return (
                <Grid
                  container
                  key={i}
                  py={2}
                  sx={{
                    borderBottom:
                      i < arr.length - 1 && "1px solid var(--border)",
                  }}
                >
                  <Grid item md={6}>
                    <Typography
                      sx={{
                        color: "var(--mate-black)",
                        fontWeight: "600",
                        pl: 0.5,
                      }}
                    >
                      <span
                        style={{ ...alignCenter, lineHeight: "2", gap: "7px" }}
                      >
                        {firstSeg?.departureCityName}{" "}
                        <EastIcon sx={{ color: "var(--secondary-color)" }} />{" "}
                        {lastSeg?.arrivalCityName}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography
                      sx={{
                        color: "var(--gray)",
                        fontWeight: "500",
                        fontSize: "11px",
                        textAlign: "right",
                      }}
                    >
                      Agent Fare
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "22px",
                        color: "var(--mate-black)",
                        fontWeight: "500",
                        textAlign: "right",
                      }}
                    >
                      {selectedSplitBrands[i][0]?.agentPrice?.toLocaleString(
                        "en-IN"
                      )}{" "}
                      BDT
                    </Typography>
                  </Grid>

                  <Grid item md={12}>
                    <Box sx={{ ...alignCenter, gap: 2 }}>
                      <Box
                        sx={{
                          bgcolor: "white",
                          height: "30px",
                          width: "30px",
                          ...alignCenter,
                          justifyContent: "center",
                          borderRadius: "50%",
                        }}
                      >
                        <img
                          src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${flightData?.carrier}.png`}
                          width="30px"
                          height="30px"
                          alt="flight1"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://storage.googleapis.com/erp-document-bucket/alternetFlightIcon.png";
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "var(--mate-black)",
                          }}
                        >
                          {flightData?.carrierName}
                        </Typography>

                        <Box sx={{ ...alignCenter, gap: "5px" }}>
                          {cities?.map((city, index, arr) => (
                            <Typography
                              key={index}
                              sx={{
                                fontSize: "12px",
                                color: "var(--primary-color)",
                              }}
                            >
                              {index > 0 && " &"} {city?.marketingCarrier}-
                              {city?.marketingFlight}
                            </Typography>
                          ))}

                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "var(--secondary-color)",
                            }}
                          >
                            &{" "}
                            {cities?.length === 1
                              ? "Non Stop"
                              : cities?.length === 2
                                ? "One Stop"
                                : cities?.length === 3
                                  ? "Two Stop"
                                  : cities?.length === 4
                                    ? "Three Stop"
                                    : ""}
                          </Typography>
                        </Box>

                        {cities?.slice(0, 1)?.map((city, index) => (
                          <Typography
                            key={index}
                            sx={{
                              fontSize: "12px",
                              color: "var(--mate-black)",
                            }}
                          >
                            {selectedSplitBrands[i][0]?.brandName} |{" "}
                            {city?.cabinCode} |{" "}
                            <span style={{ color: "var(--primary-color)" }}>
                              {selectedSplitBrands[i][0]?.seatInfo
                                ?.map((seat) => seat?.bookingClass)
                                .join(", ")}
                            </span>
                          </Typography>
                        ))}
                        {/* </Box> */}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        )}

        <Box
          sx={{
            width: "100%",
            display: { xs: "none", lg: "flex" },
            justifyContent: "space-between",
            // borderTop: "1px solid var(--border)",
            pt: 1,
          }}
        >
          {tabItems.map((tab) => (
            <Box
              key={tab.value}
              onClick={() => {
                handleFlightTab(tab.value);
                if (tab.value === "selectfare") {
                  dispatch(setShouldCallAirPrice("fare"));
                }
              }}
              sx={{ cursor: "pointer" }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color:
                    flightTab === tab.value
                      ? "var(--secondary-color)"
                      : "#8F8F98",
                  textTransform: "uppercase",
                }}
              >
                {tab.label}
              </Typography>
              <Box
                sx={{
                  height: "3px",
                  width: "100%",
                  bgcolor:
                    flightTab === tab.value
                      ? "var(--secondary-color)"
                      : "transparent",
                  mt: "5px",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Itenary Tabs */}
        {searchType === "split" && (
          <SplitItenaryTabs
            selectedFlightArr={splitFlightArr}
            // crrItenary={crrItenary}
            // setCrrItenary={setCrrItenary}
          />
        )}
      </Box>
      <Box sx={{ py: { xs: 0, lg: "18px" } }}>
        {(() => {
          switch (flightTab) {
            case "policy":
              return (
                <PolicyTable
                  priceBreakdown={
                    bookType === "afterSearch"
                      ? finalFlightData[0]?.details?.priceBreakdown
                      : finalFlightData[0]?.priceBreakdown
                  }
                  charges={
                    finalFlightData[0]?.charges ||
                    finalFlightData[0]?.serviceCharges
                  }
                  flightAfterSearch={flightAfterSearch}
                  bookingData={bookingData}
                />
              );
            case "baggage":
              return (
                <BaggageTable
                  route={
                    fareCard === "afterFare"
                      ? searchType === "split"
                        ? finalFlightData[crrItenary]?.route
                        : finalFlightData[crrItenary]?.[0]?.route
                      : bookType === "afterSearch"
                        ? finalFlightData[crrItenary]?.details?.route
                        : finalFlightData[crrItenary]?.route
                  }
                  baggage={
                    fareCard === "afterFare"
                      ? searchType === "split"
                        ? finalFlightData[crrItenary]?.baggage
                        : finalFlightData[crrItenary]?.[0]?.baggage
                      : bookType === "afterSearch"
                        ? finalFlightData[crrItenary]?.details?.baggage
                        : finalFlightData[crrItenary]?.baggage
                  }
                  cityCount={
                    fareCard === "afterFare"
                      ? searchType === "split"
                        ? finalFlightData[crrItenary]?.cityCount
                        : finalFlightData[crrItenary]?.[0]?.cityCount
                      : bookType === "afterSearch"
                        ? finalFlightData[crrItenary]?.details?.cityCount
                        : finalFlightData[crrItenary]?.cityCount
                  }
                  flightData={
                    fareCard === "afterFare"
                      ? searchType === "split"
                        ? finalFlightData[crrItenary]
                        : finalFlightData[crrItenary]?.[0]
                      : finalFlightData[crrItenary]
                  }
                  priceBreakdown={
                    fareCard === "afterFare"
                      ? searchType === "split"
                        ? finalFlightData[crrItenary]?.priceBreakdown
                        : finalFlightData[crrItenary]?.[0]?.priceBreakdown
                      : bookType === "afterSearch"
                        ? finalFlightData[crrItenary]?.details?.priceBreakdown
                        : finalFlightData[crrItenary]?.priceBreakdown
                  }
                  type={
                    bookType === "afterSearch" || fareCard === "afterFare"
                      ? "afterSearch"
                      : "normalSearch"
                  }
                />
              );
            case "flight":
              return (
                <>
                  <FlightDetails
                    bookType={bookType}
                    flightData={
                      fareCard === "newFare" || searchType === "split"
                        ? finalFlightData[crrItenary]
                        : finalFlightData[crrItenary]?.[0]
                    }
                    isShowSeats={isShowSeats}
                  />

                  {/* {finalFlightData[0]?.tripType === "oneWay" &&
                    finalFlightData[0]?.journeyType === "Outbound" && (
                      <Box pt={"10px"}>
                        <OutboundOnewayNotice />
                      </Box>
                    )} */}
                </>
              );
            case "fare":
              return (
                <FareSummary
                  flightData={
                    fareCard === "afterFare" && searchType === "split"
                      ? finalFlightData[crrItenary]
                      : bookType === "normal"
                        ? fareCard === "newFare"
                          ? fareSummaryFlightData
                          : fareCard === "afterFare"
                            ? finalFlightData[crrItenary][0]
                            : null
                        : bookType === "afterSearch"
                          ? bookingData === "reissue booking"
                            ? finalFlightData[crrItenary]?.details
                            : finalFlightData[crrItenary]
                          : bookType === "recheck" && fareCard === "afterFare"
                            ? finalFlightData[crrItenary]
                            : fareSummaryFlightData
                  }
                  priceBreakdown={
                    fareCard === "afterFare" && searchType === "split"
                      ? finalFlightData[crrItenary]?.priceBreakdown
                      : fareCard === "afterFare"
                        ? finalFlightData[crrItenary][0]?.priceBreakdown
                        : fareSummaryPriceData
                  }
                  bookingData={bookingData}
                  flightAfterSearch={flightAfterSearch}
                  bookType={bookType}
                />
              );
            case "selectfare":
              return (
                <>
                  {fareCard === "afterFare" &&
                  (searchType === "regular" || searchType === "split") ? (
                    <>
                      <AirlineChargeNotice />
                      <Box sx={{ px: "15px", pt: "15px" }}>
                        <AfterViewCard
                          flightData={finalFlightData[crrItenary]}
                          oldFlightData={oldFlightData}
                          fareRules={fareRules[crrItenary]}
                          flightBrand={fareRules}
                          segmentsList={segmentsList}
                          cabin={cabin}
                          totalPassenger={totalPassenger}
                          selectedBrand={selectedBrand}
                          isFareLoading={isFareLoading}
                          flightAfterSearch={flightAfterSearch}
                          crrItenary={crrItenary}
                          searchType={"regular"}
                        />
                      </Box>
                    </>
                  ) : (
                    <ViewFare
                      flightData={finalFlightData}
                      crrItenary={crrItenary}
                      selectedSplitBrands={selectedSplitBrands}
                      // data={finalFlightData[0]?.uuid}
                      searchType={searchType}
                      totalPassenger={totalPassenger}
                      segmentsList={segmentsList}
                      cabin={cabin}
                      flightAfterSearch={flightAfterSearch}
                      reissuePassengers={reissuePassengers}
                      paxDetails={paxDetails}
                      bookingId={bookingId}
                      flightBrand={flightBrand}
                      setFlightBrand={setFlightBrand}
                      fareCard={fareCard}
                      advancedSelectedSeats={advancedSelectedSeats}
                      iniadvanceSearchResult={advanceSearchResult}
                      showDetails={showDetails}
                      splitFlightArr={splitFlightArr}
                    />
                  )}
                </>
              );
            case "seatAvailability":
              return (
                <>
                  {fareCard === "afterFare" &&
                  (searchType === "regular" || searchType === "split") ? (
                    <>
                      <AirlineChargeNotice />
                      <Box sx={{ px: "15px", pt: "15px" }}>
                        <AfterViewCard
                          flightData={finalFlightData[crrItenary]}
                          oldFlightData={oldFlightData}
                          fareRules={fareRules[crrItenary]}
                          flightBrand={fareRules}
                          segmentsList={segmentsList}
                          cabin={cabin}
                          totalPassenger={totalPassenger}
                          selectedBrand={selectedBrand}
                          isFareLoading={isFareLoading}
                          flightAfterSearch={flightAfterSearch}
                          crrItenary={crrItenary}
                          searchType={searchType}
                        />
                      </Box>
                    </>
                  ) : (
                    <ViewFare
                      flightData={finalFlightData}
                      crrItenary={crrItenary}
                      selectedSplitBrands={selectedSplitBrands}
                      // data={finalFlightData[0]?.uuid}
                      searchType={"advanced"}
                      totalPassenger={totalPassenger}
                      segmentsList={segmentsList}
                      cabin={cabin}
                      flightAfterSearch={flightAfterSearch}
                      reissuePassengers={reissuePassengers}
                      paxDetails={paxDetails}
                      bookingId={bookingId}
                      flightBrand={flightBrand}
                      setFlightBrand={setFlightBrand}
                      fareCard={fareCard}
                      advancedSelectedSeats={advancedSelectedSeats}
                      iniadvanceSearchResult={advanceSearchResult}
                      showDetails={showDetails}
                      splitFlightArr={splitFlightArr}
                    />
                  )}
                </>
              );
            case "fareRules":
              return (
                <Box sx={{ px: "15px" }}>
                  <FareRulesTable
                    structure={
                      fareCard === "pnrFare"
                        ? flightData?.structure || []
                        : flightData?.details?.structure ||
                          fareAfterRules[crrItenary][0]?.structure ||
                          []
                    }
                    nonStructure={
                      fareCard === "pnrFare"
                        ? flightData?.nonStructure || []
                        : flightData?.details?.nonStructure ||
                          fareAfterRules[crrItenary][0]?.nonStructure ||
                          []
                    }
                    flightData={flightData}
                    isAfterFareLoading={isAfterFareLoading}
                  />
                </Box>
              );
            case "fareDifference":
              return (
                <Box sx={{ px: "15px" }}>
                  <FareDifferenceTable
                    flightData={
                      bookType === "afterSearch"
                        ? finalFlightData[0]?.details
                        : bookType === "normal" && fareCard === "newFare"
                          ? fareSummaryFlightData
                          : bookType === "normal" && fareCard === "afterFare"
                            ? finalFlightData[0]
                            : null
                    }
                    priceBreakdown={
                      bookType === "normal" || bookType === "recheck"
                        ? finalFlightData[0]?.priceBreakdown
                        : finalFlightData[0]?.details?.priceBreakdown
                    }
                    bookingData={bookingData}
                    flightAfterSearch={flightAfterSearch}
                    status={finalFlightData[0]?.status || null}
                  />
                </Box>
              );
            case "partialPayment":
              return (
                <Box sx={{ px: "15px" }}>
                  <PartialPaymentTable
                    partialPaymentChargeData={partialPaymentChargeData}
                    flightData={
                      fareCard === "newFare"
                        ? fareSummaryFlightData
                        : finalFlightData[crrItenary]
                    }
                    flightBrandId={flightBrand?.brandId}
                    isAfterFareLoading={isAfterFareLoading}
                  />
                </Box>
              );
            default:
              return (
                <DiscountTable
                  priceBreakdown={
                    bookType === "afterSearch"
                      ? finalFlightData[crrItenary]?.details?.priceBreakdown
                      : finalFlightData[crrItenary]?.priceBreakdown
                  }
                  clientPrice={finalFlightData[crrItenary]?.clientPrice}
                  flightData={finalFlightData[crrItenary]}
                  bookingData={bookingData}
                  flightAfterSearch={flightAfterSearch}
                />
              );
          }
        })()}
      </Box>
    </>
  );
};

export const OutboundOnewayNotice = () => {
  return (
    <Box
      sx={{
        px: { xs: 0, lg: "15px" },
        ".MuiSvgIcon-root": { color: "var(--primary-color)" },
      }}
    >
      <Alert
        severity="info"
        sx={{
          border: "1px solid var(--primary-color)",
          bgcolor: "#fdeded",
          color: "var(--primary-color)",
          fontSize: "12px",
          padding: "0px 10px",
        }}
      >
        <span style={{ fontWeight: "600" }}>Outbound Oneway:</span> If you are
        traveling on a tourist visa, ensure you have a return ticket with the
        same airline, that both tickets are under a single reservation, and that
        your return destination matches your point of origin to avoid any
        boarding issues.
      </Alert>
    </Box>
  );
};

export default FlightDetailsSection;
