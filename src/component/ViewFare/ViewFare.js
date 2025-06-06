import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import useWindowSize from "../../shared/common/useWindowSize";
import CustomToast from "../Alert/CustomToast";
import {
  setAdvancedFlightData,
  setAdvancedModifiedBrands,
  setAllFareRules,
  setAlreadyButtonClicked,
  setBookable,
  setIsBookable,
  setModifiedSplitBarnds,
  setPriceFlagFalse,
  setSelectedSeats,
  setShouldCallAirPrice,
  setViewButtonShow,
} from "../FlightSearchBox/flighAfterSearchSlice";
import MobileAfterViewFareCard from "./MobileAfterViewFareCard";
import NewViewFareCard from "./NewViewFareCard";
import AdvancedAirpriceCard from "./AdvancedAirpriceCard";
import { useQuery } from "@tanstack/react-query";

const ViewFare = ({
  flightData,
  crrItenary,
  data,
  searchType,
  totalPassenger,
  segmentsList,
  cabin,
  reissuePassengers,
  paxDetails,
  bookingId,
  flightAfterSearch,
  showMobile,
  flightBrand,
  setFlightBrand,
  fareCard,
  showDetails,
  selectedSplitBrands,
  advancedSelectedSeats,
}) => {
  const hasShownErrorToast = useRef(false);
  const { jsonHeader } = useAuth();
  const [advancedLoading, setAdvancedLoading] = useState(false);
  const [isFareLoading, setIsFareLoading] = useState(false);
  const [airPriceLoading, setAirPriceLoading] = useState("");
  const [advanceSearchResult, setAdvanceSearchResult] = useState([]);
  const segments = flightData[crrItenary]?.cityCount;
  const [isReset, setIsReset] = useState(false);
  const [modifiedBrands, setModifiedBrands] = useState(
    flightData[crrItenary]?.brands
  );
  const [errorMessage, setErrorMessage] = useState("");
  // const [airPriceLoading, setAirPriceLoading] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { cmsData } = useSelector((state) => state.flightAfter) || {};
  const { checkUnAuthorized } = useUnAuthorized();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    shouldCallAirPrice,
    advancedFlightData,
    advnacedModifiedBrands,
    selectedSeats,
    alreadyButtonClicked,
  } = useSelector((state) => state.flightAfter);
  const { isMobile } = useWindowSize();
  const hasInitializedSeats = useRef(false);

  const apiCallTracker = useRef({
    fareRules: false,
    seatMap: false,
  });

  const abortController = useRef(new AbortController());

  useEffect(() => {
    if (selectedSeats.length === 0 || isReset) {
      const extractedData = segments.map((segmentArray) =>
        segmentArray.map((segment) => ({
          bookingClass: segment.bookingClass,
          availableSeats: segment.availableSeats,
          departure: segment.departure,
          arrival: segment.arrival,
          departureDateTime: segment.departureDateTime,
          arrivalDateTime: segment.arrivalDateTime,
        }))
      );

      dispatch(setSelectedSeats(extractedData));
      hasInitializedSeats.current = true;
    }
  }, [isReset, showDetails]);

  const fetchSeatMapData = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/seat-map`;
    const body = JSON.stringify({ data: flightData[crrItenary]?.uuid });

    const response = await fetch(url, {
      method: "POST",
      headers: jsonHeader().headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result.data;
  };

  const {
    data: seatMapData,
    isLoading: seatLoading,
    error,
    refetch: refetchSeatMap,
  } = useQuery({
    queryKey: ["seatMap", data],
    queryFn: () => fetchSeatMapData(data),
    enabled: false,
    staleTime: 5 * 60 * 1000,
    onError: (err) => {
      if (err.name !== "AbortError") {
        console.error("Seat map fetch error:", err);
      }
    },
  });

  useEffect(() => {
    if (searchType === "advanced" && showDetails) {
      refetchSeatMap();
    }
  }, [searchType, showDetails, refetchSeatMap]);

  useEffect(() => {
    if (seatMapData) {
      setAdvanceSearchResult(seatMapData.length > 0 ? seatMapData : []);
    }
  }, [seatMapData]);

  // Air price operation by api
  const fetchAirPrice = async (brand, brandIndex) => {
    setErrorMessage("");
    setAirPriceLoading(brandIndex);

    const isReissueSearch = flightAfterSearch === "reissue-search";
    const isAutoReissue = flightData[crrItenary]?.autoReissue === true;

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
        searchType === "advanced"
          ? selectedSeats
              ?.flat()
              ?.map((seat) => seat.bookingClass)
              .filter(Boolean)
          : brand?.seatInfo?.map((seat) => seat.bookingClass).filter(Boolean) ||
            [],
      segmentsList,
      data: flightData[crrItenary]?.uuid,
      reIssue: flightData[crrItenary]?.reIssue || false,
      paxDetails: flightData[crrItenary]?.paxDetails || [],
      bookingId: flightData[crrItenary]?.bookingId || "",
      advanceSearch: searchType === "advanced",
    };

    const reissueBody = {
      brandId: brand?.brandId,
      bookingId: bookingId,
      uuid: flightData[crrItenary]?.uuid,
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

    try {
      const response = await axios[method](url, requestBody, jsonHeader());
      const airPriceData = response?.data?.data || [];
      const updatedBrand = airPriceData[0]?.brands?.[0] || null;

      dispatch(setBookable(!!updatedBrand));

      return {
        ...response.data,
        airPrice: !!updatedBrand,
        updatedBrand,
      };
    } catch (error) {
      // handle errors as before
      return { airPrice: false };
    } finally {
      setAirPriceLoading(false);
      dispatch(setShouldCallAirPrice(""));
      dispatch(setPriceFlagFalse());
    }
  };

  // Fare rules operation by api
  const fetchFareRules = async (brandId, data) => {
    if (apiCallTracker.current.fareRules) return null;

    apiCallTracker.current.fareRules = true;
    setIsFareLoading(true);

    try {
      const isReissue =
        flightAfterSearch === "reissue-search" && data?.autoReissue === true;

      const body = {
        brandId: brandId?.toString(),
        system: data?.system,
        data: data?.uuid,
      };

      const reissueBody = {
        brandId: brandId?.toString(),
        bookingId: bookingId,
        uuid: data?.uuid,
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
      if (axios.isCancel(error)) return null;

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
      apiCallTracker.current.fareRules = false;
      setIsFareLoading(false);
    }
  };

  const handleFetchAndBooking = async (brand, brandIndex) => {
    setErrorMessage("");
    const result = await fetchAirPrice(brand, brandIndex);
    if (result?.data && result?.data?.response?.length > 0) {
      const updatedBrands = modifiedBrands.map((item) =>
        item?.brandId === brand?.brandId
          ? {
              ...item,
              agentPrice: result?.data?.response[0]?.brands[0]?.agentPrice,
              clientPrice: result?.data?.response[0]?.brands[0]?.clientPrice,
              commission: result?.data?.response[0]?.brands[0]?.commission,
              additionalFare:
                result?.data?.response[0]?.brands[0]?.additionalFare,
            }
          : item
      );

      setModifiedBrands(updatedBrands);
      dispatch(setModifiedSplitBarnds(updatedBrands));
      dispatch(setAllFareRules(updatedBrands));

      navigate("/dashboard/airbooking", {
        state: {
          flightData,
          crrItenary,
          searchType,
          totalPassenger,
          brand: [updatedBrands[crrItenary][brandIndex]],
          cabin,
          segmentsList,
          fareRules: updatedBrands,
          reissuePassengers: reissuePassengers || [],
          flightAfterSearch: flightAfterSearch,
          paxDetails: paxDetails || [],
          bookingId: bookingId || [],
          flightBrand,
        },
      });
    } else {
      setErrorMessage("This flight is not bookable");
      const updatedBrands = modifiedBrands.map((item) =>
        item.brandId === brand.brandId ? { ...item, isBook: false } : item
      );

      setModifiedBrands(updatedBrands);
      dispatch(setModifiedSplitBarnds(updatedBrands));
      dispatch(setAllFareRules(updatedBrands));
      dispatch(setShouldCallAirPrice(""));
    }
  };

  const handleSplitAndBooking = () => {
    navigate("/dashboard/airbooking", {
      state: {
        flightData,
        crrItenary,
        searchType,
        totalPassenger,
        brand: selectedSplitBrands?.flat(),
        cabin,
        segmentsList,
        fareRules: modifiedBrands,
        reissuePassengers: reissuePassengers || [],
        flightAfterSearch,
        paxDetails: paxDetails || [],
        bookingId: bookingId || null,
        flightBrand,
      },
    });
  };

  const handleSeatAirprice = async (brand, brandIndex) => {
    setErrorMessage("");
    // setAdvancedLoading(true);
    dispatch(setViewButtonShow(false));

    const targetBrand = brand || flightData[crrItenary]?.brands?.[0];
    const targetBrandIndex = brandIndex ?? 0;

    try {
      // If structure exists, use it; otherwise fetch
      const fareData = targetBrand?.structure
        ? [{ structure: targetBrand?.structure }]
        : await fetchFareRules(targetBrand?.brandId, flightData[crrItenary]);

      const result = await fetchAirPrice(targetBrand, targetBrandIndex);
      const response = result?.data?.response?.[0];

      if (response) {
        const modifiedBrands = response?.brands?.map((brand) => ({
          ...brand,
          ...(fareData?.[0] || {}),
        }));
        dispatch(setAdvancedModifiedBrands(modifiedBrands));
        dispatch(setAdvancedFlightData(response));
        dispatch(setAlreadyButtonClicked(true));
      } else {
        dispatch(setAdvancedFlightData(null));
        dispatch(setAdvancedModifiedBrands([]));
        setErrorMessage("No booking data found.");
      }
    } catch (error) {
      dispatch(setAdvancedFlightData(null));
      dispatch(setAdvancedModifiedBrands([]));
      console.error("Error fetching advanced booking:", error);
      setErrorMessage("Failed to fetch advanced booking data.");
    } finally {
      setAdvancedLoading(false);
    }
  };

  const handleFetchAdvancedBooking = () => {
    navigate("/dashboard/airbooking", {
      state: {
        flightData: advancedFlightData,
        searchType,
        totalPassenger,
        brand: modifiedBrands[0],
        cabin,
        segmentsList,
        fareRules: modifiedBrands,
        selectedSeats,
        reissuePassengers: reissuePassengers || [],
        flightAfterSearch: flightAfterSearch,
        paxDetails: paxDetails || [],
        bookingId: bookingId || [],
      },
    });
  };

  // Fetching fare rules (regular/split/reissue)
  useEffect(() => {
    if (searchType === "advanced") return;

    const fetchBrandFareRules = async () => {
      if (Array.isArray(flightData) && shouldCallAirPrice === "fare") {
        const allUpdatedBrands = [];

        for (const data of flightData) {
          if (!data?.brands?.length) continue;

          const updatedBrands = [];

          for (const brand of data.brands) {
            let updatedBrand = { ...brand };
            const fareData = await fetchFareRules(brand.brandId, data);

            if (fareData && fareData[0]) {
              updatedBrand.nonStructure = fareData[0].nonStructure;
              updatedBrand.structure = fareData[0].structure;
              updatedBrand.accurateFareRules = fareData[0].accurateFareRules;
            }

            updatedBrands.push(updatedBrand);
          }

          // Sort the brands in the current group
          updatedBrands.sort((a, b) => a.totalFare - b.totalFare);
          allUpdatedBrands.push(updatedBrands);
        }

        setModifiedBrands(allUpdatedBrands);
        dispatch(setModifiedSplitBarnds(allUpdatedBrands));
      }
    };

    fetchBrandFareRules();
  }, [flightData, shouldCallAirPrice, searchType, showMobile]);

  useEffect(() => {
    if (!showDetails || alreadyButtonClicked || searchType === "regular")
      return;

    const fetchData = async () => {
      try {
        const fareData = flightData[crrItenary]?.brands[0]?.structure
          ? [{ structure: flightData[crrItenary]?.brands[0].structure }]
          : await fetchFareRules(
              flightData[crrItenary]?.brands[0]?.brandId,
              flightData[crrItenary]
            );

        const mergedBrand = [
          {
            ...flightData[crrItenary]?.brands[0],
            ...fareData?.[0],
          },
        ];
        dispatch(setAdvancedModifiedBrands(mergedBrand));
      } catch (error) {
        console.error("Error fetching fare rules:", error);
      }
    };

    fetchData();
  }, [isReset, alreadyButtonClicked, searchType, showDetails]);

  return (
    <Box sx={{ py: { xs: "15px", md: 0 } }}>
      {searchType !== "advanced" && <AirlineChargeNotice />}

      <Grid container sx={{ px: { lg: "15px" }, flexGrow: 1 }}>
        <Grid item xs={12} lg={12} sx={{ width: { xs: "100%", lg: "600px" } }}>
          {searchType === "advanced" ? (
            <AdvancedAirpriceCard
              flightData={advancedFlightData}
              totalPassenger={totalPassenger}
              cabin={cabin}
              segmentsList={segmentsList}
              seatLoading={seatLoading}
              isReset={isReset}
              advanceSearchResult={advanceSearchResult}
              setIsReset={setIsReset}
              cmsData={cmsData}
              searchType={searchType}
              flightBrand={flightBrand}
              setFlightBrand={setFlightBrand}
              flightAfterSearch={flightAfterSearch}
              advancedLoading={advancedLoading}
              handleFetchAdvancedBooking={handleFetchAdvancedBooking}
              fareCard={fareCard}
              handleSeatAirprice={handleSeatAirprice}
              crrItenary={crrItenary}
              showDetails={showDetails}
              airPriceLoading={airPriceLoading}
            />
          ) : isMobile ? (
            <MobileAfterViewFareCard
              flightData={flightData}
              modifiedBrands={modifiedBrands}
              totalPassenger={totalPassenger}
              segmentsList={segmentsList}
              cabin={cabin}
              searchType={searchType}
              isFareLoading={isFareLoading}
              airPriceLoading={airPriceLoading}
              setAirPriceLoading={setAirPriceLoading}
              handleFetchAndBooking={handleFetchAndBooking}
              flightAfterSearch={flightAfterSearch}
              cmsData={cmsData}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              flightBrand={flightBrand}
              setFlightBrand={setFlightBrand}
            />
          ) : (
            <NewViewFareCard
              flightData={flightData}
              modifiedBrands={modifiedBrands[crrItenary]}
              totalPassenger={totalPassenger}
              segmentsList={segmentsList}
              cabin={cabin}
              searchType={searchType}
              isFareLoading={isFareLoading}
              airPriceLoading={airPriceLoading}
              setAirPriceLoading={setAirPriceLoading}
              handleFetchAndBooking={handleFetchAndBooking}
              flightAfterSearch={flightAfterSearch}
              cmsData={cmsData}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              flightBrand={flightBrand}
              setFlightBrand={setFlightBrand}
              crrItenary={crrItenary}
            />
          )}
        </Grid>
      </Grid>

      {/* Bottom Button Section */}
      {/* {searchType === "split" && (
        <Box
          sx={{
            mt: "auto", // Pushes this box to the bottom
            bgcolor: "var(--primary-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
            width: "100%",
            px: 3,
          }}
        >
          <Box>
            <Typography sx={{ color: "#fff", fontSize: "12px" }}>
              Gross Fare
            </Typography>
            <Typography sx={{ color: "#fff", fontSize: "22px" }}>
              10000 BDT
            </Typography>
          </Box>
          {searchType === "split" && (
            <Button
              sx={{
                bgcolor: "red",
                textTransform: "capitalize",
                minWidth: "120px",
                color: "white",
              }}
              onClick={() => handleSplitAndBooking()}
            >
              Proceed And Book
            </Button>
          )}
        </Box>
      )} */}

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

export const AirlineChargeNotice = () => {
  return (
    <Box
      sx={{
        px: "15px",
        pt: {
          xs: "15px",
          lg: 0,
        },
        mb: "18px",
        ".MuiSvgIcon-root": { color: "var(--secondary-color)" },
      }}
    >
      <Alert
        severity="info"
        sx={{
          border: "1px solid var(--secondary-color)",
          bgcolor: "#E5F6FD",
          color: "var(--secondary-color)",
          fontSize: "12px",
          padding: "0px 10px",
        }}
      >
        <span style={{ fontWeight: "600" }}>Airlines Charges Notes:</span>{" "}
        Airline fees are estimates and may not be exact. Fly Far International
        does not ensure the accuracy of this information. All fees are listed
        per passenger. Cancellation and date change fees apply only if the same
        airline is selected for the new date. Any fare difference between the
        original and new booking will be charged to the user.
      </Alert>
    </Box>
  );
};

export default ViewFare;
