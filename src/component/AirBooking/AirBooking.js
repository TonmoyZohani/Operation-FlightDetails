import { Box, Grid, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import PartialPaid from "../../pages/Bookings/AirBookings/PartialPaid";
import BookingHeader from "../../pages/Bookings/components/BookingHeader";
import ScrollTop from "../../shared/common/ScrollTop";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import useWindowSize from "../../shared/common/useWindowSize";
import { isDateWithinRange } from "../../utils/functions";
import CustomToast from "../Alert/CustomToast";
import {
  setKeyNull,
  setShouldCallAirPrice,
  setUpdateFareRules,
} from "../FlightSearchBox/flighAfterSearchSlice";
import FilterSkeleton from "../SkeletonLoader/FilterSkeleton";
import StepperSkeleton from "../SkeletonLoader/StepperSkeleton";
import "./AirBooking.css";
import { selectTabStepper, setPartialChargeData } from "./airbookingSlice";
import BookingInformation from "./BookingInformation";
import MobileStepBar from "./components/MobileStepBar";
import PaymentInformation from "./PaymentInformation";
import PriceBreakdown from "./PriceBreakdown";
import RecheckInformation from "./RecheckInformation";
import TimerLimit from "../Common/TimerLimit";
import MobileStepperSkeleton from "../SkeletonLoader/MobileStepperSkeleton";
import ReissuePriceBreakdown from "./ReissuePriceBreakdown";

const AirBooking = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { jsonHeader } = useAuth();
  const [refetch, setRefetch] = useState(false);
  const navigate = useNavigate();
  const { stepper, tabStepper, partialChargeData } = useSelector(
    (state) => state.flightBooking
  );
  const { airPriceFlag, airPriceBody, updateFareRules, crrItenary } =
    useSelector((state) => state.flightAfter);
  const [isLoading, setIsLoading] = useState(false);
  const [airPriceData, setAirPriceData] = useState([]);
  const [isFareLoading, setIsFareLoading] = useState("");
  const [cachedTestKey, setCachedTestKey] = useState("");
  const [type, setType] = useState("Booking Information");
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { isMobile, isMedium, isLarge } = useWindowSize();
  const { checkUnAuthorized } = useUnAuthorized();

  // TODO: Partialpayment request mutate
  const { mutate: partialPayMutate } = useMutation({
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
        console.error(
          "Error response:",
          err.response.data.message || "An error occurred"
        );
      } else if (err.request) {
        console.error("Error request:", err.message);
      } else {
        console.error("Unexpected error:", "An unexpected error occurred.");
      }
    },
  });

  let flightData,
    searchType,
    totalPassenger,
    brand,
    cabin,
    segmentsList,
    fareRules,
    selectedSeats,
    // crrItenary,
    flightBrand,
    advanceSearchResult;

  if (airPriceFlag) {
    ({
      flightData,
      searchType,
      totalPassenger,
      brand,
      cabin,
      segmentsList,
      // crrItenary,
      fareRules,
      flightBrand,
    } = airPriceBody);
  } else {
    ({
      flightData,
      searchType,
      totalPassenger,
      brand,
      cabin,
      segmentsList,
      fareRules,
      selectedSeats,
      advanceSearchResult,
      // crrItenary,
      flightBrand,
    } = location.state);
  }

  console.log("Location State", location?.state);

  const steps = [
    { number: 1, text: "Booking Information" },
    { number: 2, text: "Recheck Information" },
    { number: 3, text: "Payment Information" },
  ];

  const stepComponents = {
    1: BookingInformation,
    2: RecheckInformation,
    3: PaymentInformation,
  };

  //TODO:: Handle steps
  const handleStepper = (number) => {
    dispatch(selectTabStepper(number));
  };

  const fetchFareRules = async (brandId, itineraryIndex) => {
    setIsFareLoading(true);
    const isReissue =
      location?.state?.flightAfterSearch === "reissue-search" &&
      flightData?.[itineraryIndex]?.autoReissue === true;

    const body = {
      brandId: brandId?.toString(),
      system: flightData?.[itineraryIndex]?.system,
      data: flightData?.[itineraryIndex]?.uuid,
    };

    const reissueBody = {
      brandId: brandId?.toString(),
      bookingId: flightData?.[itineraryIndex]?.bookingId,
      uuid: flightData?.[itineraryIndex]?.uuid,
    };

    const url = isReissue
      ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue/fare-rule`
      : `${process.env.REACT_APP_BASE_URL}/api/v1/user/fare-rule`;

    const requestBody = isReissue ? reissueBody : body;

    try {
      const response = await axios.post(url, requestBody, jsonHeader());
      return response.data?.data;
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
      } else {
        showToast("error", "Network error. Please check your connection.");
      }
      return null;
    } finally {
      setIsFareLoading(false);
    }
  };

  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
    } else {
      setType(newTab);
    }
  };

  const handlePartialBooking = (itineraryIndex) => {
    const bodyData = {
      brandId: brand[itineraryIndex]?.brandId,
      data: flightData?.[itineraryIndex]?.uuid,
      agentPrice: flightData?.[itineraryIndex]?.agentPrice,
      travelDate: moment(
        flightData?.[itineraryIndex]?.route?.[0]?.departureDate
      ).format("YYYY-MM-DD"),
      journeyType: flightData?.[itineraryIndex]?.journeyType,
      passengers: flightData?.[itineraryIndex]?.priceBreakdown?.map(
        (passenger) => ({
          type: passenger.paxType,
          count: passenger.paxCount,
          ages: passenger?.age === null ? [] : [passenger?.age],
        })
      ),
    };

    partialPayMutate(bodyData);
  };

  useEffect(() => {
    if (searchType === "advanced") {
      return;
    }

    setIsLoading(true);

    const processItinerary = async (itineraryIndex) => {
      const isReissueSearch =
        location?.state?.flightAfterSearch === "reissue-search";
      const isAutoReissue = flightData?.[itineraryIndex]?.autoReissue === true;

      const flightBody = {
        passengers: [
          {
            type: "ADT",
            count: totalPassenger?.adultCount || 0,
            ages: [],
          },
          {
            type: "CNN",
            count: totalPassenger?.childCount?.length || 0,
            ages:
              totalPassenger?.childCount?.map((age) => parseInt(age, 10)) || [],
          },
          {
            type: "INF",
            count: totalPassenger?.infantCount || 0,
            ages: [],
          },
        ],
        brandId: brand?.[itineraryIndex]?.brandId,
        cabin,
        selectedSeat:
          brand[itineraryIndex]?.seatInfo
            ?.map((seat) => seat.bookingClass)
            .filter(Boolean) || [],
        segmentsList,
        data: flightData?.[itineraryIndex]?.uuid,
        reIssue: flightData?.[itineraryIndex]?.reIssue || false,
        paxDetails: flightData?.[itineraryIndex]?.paxDetails || [],
        bookingId: flightData?.[itineraryIndex]?.bookingId || "",
      };

      const reissueBody = {
        brandId: brand?.[itineraryIndex]?.brandId,
        bookingId: flightData?.[itineraryIndex]?.bookingId,
        uuid: flightData?.[itineraryIndex]?.uuid,
      };

      let api = `${process.env.REACT_APP_BASE_URL}/api/v1/user/air-price`;
      let method = "post";
      let requestBody = flightBody;

      if (isReissueSearch) {
        api = `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue/price`;
        if (isAutoReissue) {
          method = "post";
          requestBody = reissueBody;
        } else {
          method = "patch";
          requestBody = flightBody;
        }
      } else if (!isReissueSearch && !isAutoReissue) {
        api = `${process.env.REACT_APP_BASE_URL}/api/v1/user/air-price`;
        method = "post";
        requestBody = flightBody;
      }

      try {
        const [flightResponse, fareData] = await Promise.all([
          axios[method](api, requestBody, jsonHeader()),
          fetchFareRules(brand[itineraryIndex]?.brandId, itineraryIndex),
        ]);

        const updatedData = flightResponse?.data?.data?.response?.[0];
        const testData = flightResponse?.data?.data?.key;

        // Return the data for this itinerary
        return {
          updatedData,
          testData,
          fareData,
          itineraryIndex,
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            const { data, status } = error.response;

            if (status === 401) {
              checkUnAuthorized(error);
            } else if (data && !data.success) {
              showToast("error", "This flight is not bookable", () => {
                dispatch(setShouldCallAirPrice(""));
              });
            } else {
              showToast(
                "error",
                data.message || "Failed to post flight data. Please try again."
              );
            }
          } else {
            showToast("error", "Network error. Please check your connection.");
          }
        } else {
          showToast("error", "An unexpected error occurred.");
        }

        dispatch(setKeyNull());
        // setTimeout(() => {
        //   navigate(-1);
        // }, 1500);
        return null;
      }
    };

    const processAllItineraries = async () => {
      try {
        // Process all itineraries in parallel
        const results = await Promise.all(
          flightData.map((_, index) => processItinerary(index))
        );

        // Filter out any failed requests
        const successfulResults = results.filter((result) => result !== null);

        // Update state with all results
        setAirPriceData(successfulResults.map((result) => result.updatedData));

        // Process test keys and fare rules for each successful result
        successfulResults.forEach((result) => {
          if (result.testData) {
            setCachedTestKey((prev) => [...prev, result.testData]);
          }

          if (result.fareData && result.fareData[0]) {
            dispatch(
              setUpdateFareRules(
                updateFareRules.map((rule) =>
                  rule.brandId === brand[crrItenary]?.brandId
                    ? {
                        ...rule,
                        newFlightData: result.updatedData,
                        nonStructure: result.fareData[0].nonStructure,
                        structure: result.fareData[0].structure,
                        accurateFareRules: result.fareData[0].accurateFareRules,
                      }
                    : rule
                )
              )
            );
          }
        });

        // Handle partial bookings for all itineraries that need it
        flightData.forEach((_, index) => {
          if (
            location?.state?.flightAfterSearch !== "reissue-search" &&
            !flightData[index]?.immediateIssue &&
            isDateWithinRange(flightData[index]?.route?.[0]?.departureDate)
          ) {
            handlePartialBooking(index);
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    processAllItineraries();
  }, [brand[crrItenary]?.brandId, refetch]);

  console.log("Flight Brands", flightBrand);
  console.log("Air Booking Fare Rules", fareRules);

  return (
    <Box>
      <Box>
        <ScrollTop />
        <BookingHeader
          tabs={tabs}
          type={type}
          retriveData={flightData}
          handleTypeChange={handleTypeChange}
          bookingType="before"
        />

        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid
            container
            item
            xs={12}
            sx={{
              bgcolor: "#fff",
              borderRadius: "3px",
              mb: "10px",
              py: "12px",
              display: { xs: "none", lg: "flex" },
              position: "sticky",
              top: isMobile
                ? "0px"
                : isMedium
                  ? "127px"
                  : isLarge
                    ? "132px"
                    : "0px",
              bottom: "40px",
              zIndex: 1,
            }}
          >
            {isLoading ? (
              <Grid item lg={12}>
                {isMobile ? <MobileStepperSkeleton /> : <StepperSkeleton />}
              </Grid>
            ) : (
              <>
                {steps.map(({ number, text }, i) => (
                  <Step
                    key={number}
                    number={number}
                    stepper={stepper}
                    text={text}
                    active={tabStepper === number}
                    onClick={() => handleStepper(number)}
                  />
                ))}
                {/* Add right-side spacer only after the last step */}
                <Grid item sx={{ flexGrow: 1 }} />
              </>
            )}
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: {
                xs: "block",
                lg: "none",
              },
              mt: 4,
              mb: 2,
            }}
          >
            {isLoading ? (
              <Box>
                {isMobile ? <MobileStepperSkeleton /> : <StepperSkeleton />}
              </Box>
            ) : (
              <MobileStepBar
                steps={steps}
                currentStep={tabStepper}
                handleStepper={handleStepper}
              />
            )}
          </Grid>

          <Grid
            item
            xs={12}
            lg={2.4}
            sx={{
              display: {
                xs:
                  type?.toLowerCase() === "fare information" ? "block" : "none",
                lg: "block",
              },
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "90%",
                  lg: "100%",
                },
                mx: "auto",
              }}
            >
              {!isLoading && (
                <TimerLimit
                  label="Booking Time Limit"
                  type="airBooking"
                  refetch={refetch}
                  setRefetchAirBooking={setRefetch}
                  limitMinutes={15}
                />
              )}

              {isLoading ? (
                <FilterSkeleton />
              ) : airPriceData[crrItenary] ? (
                location?.state?.flightAfterSearch === "reissue-search" ? (
                  <ReissuePriceBreakdown
                    flightData={airPriceData[crrItenary]}
                    priceData={
                      airPriceData[crrItenary]?.priceBreakdown
                        ?.newPriceBreakdown
                    }
                  />
                ) : (
                  <PriceBreakdown
                    type="before"
                    flightData={airPriceData[crrItenary]}
                    label="Total Payable"
                  />
                )
              ) : null}

              {/* {airPriceData?.partialPayment &&
                airPriceData?.isRefundable === "Partially Refundable" &&
                !airPriceData?.immediateIssue &&
                partialChargeData && (
                  <>
                    {isLoading ? (
                      <FilterSkeleton />
                    ) : (
                      <Box sx={{ my: 2 }}>
                        <PartialPaid
                          partialChargeData={partialChargeData}
                          flightData={airPriceData}
                        />
                      </Box>
                    )}
                  </>
                )} */}
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            lg={9.4}
            sx={{
              display: {
                xs:
                  type?.toLowerCase() === "booking information"
                    ? "block"
                    : "none",
                lg: "block",
              },
            }}
          >
            {React.createElement(stepComponents[tabStepper], {
              flightData: searchType === "advanced" ? flightData : airPriceData,
              splitFlightArr: airPriceData,
              oldFlightData: flightData,
              searchType,
              totalPassenger,
              fareRules:
                updateFareRules.length > 0 ? updateFareRules : fareRules,
              segmentsList,
              cabin,
              selectedBrand: brand,
              isFareLoading,
              reissuePassengers: location?.state?.reissuePassengers,
              paxDetails: location?.state?.paxDetails,
              bookingId: location?.state?.bookingId,
              flightAfterSearch: location?.state?.flightAfterSearch,
              cachedKey: cachedTestKey,
              isLoading,
              airPriceFlag,
              partialChargeData,
              selectedSeats,
              advanceSearchResult,
              crrItenary,
              flightBrand,
            })}
          </Grid>
        </Grid>
      </Box>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

const Step = ({ number, text, active, stepper, onClick }) => {
  return (
    <Grid
      item
      lg={number !== 3 ? 5 : 2}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        pl: "23px",
        cursor: "pointer",
        minWidth: 0,
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            height: "22px",
            width: "22px",
            borderRadius: "50px",
            bgcolor: active
              ? "var(--primary-color)"
              : stepper >= number
                ? "#145a32"
                : "#DDDDDD",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Typography sx={{ color: "white", fontSize: "12px" }}>
            {number}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: active ? "14px" : "13px",
            color: active
              ? "var(--primary-color)"
              : stepper >= number
                ? "#145a32"
                : "#DDDDDD",
            fontWeight: active ? "600" : "500",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {text}
        </Typography>
      </Box>

      {/* Responsive connector line */}
      <Box
        sx={{
          flexGrow: 1,
          height: "1px",
          display: number !== 3 ? "block" : "none",
          bgcolor: "#DDDDDD",
          minWidth: "20px",
        }}
      />
    </Grid>
  );
};

const tabs = [
  {
    label: "Booking Information",
    value: "Booking Information",
  },
  {
    label: "Fare Information",
    value: "Fare Information",
  },
];
export default AirBooking;
