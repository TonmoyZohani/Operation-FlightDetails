import {
  Box,
  Button,
  Grid,
  keyframes,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useDispatch, useSelector } from "react-redux";
import useWindowSize from "../../shared/common/useWindowSize";
import ModifySearch from "../../component/FlightAfterSearch/ModifySearch";
import { useLocation, useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import { useState } from "react";
import moment from "moment";
import { setSearchType } from "../../component/FlightSearchBox/flightSearchSlice";
import { fetchFlights } from "../../component/FlightAfterSearch/FlightAfterSearch";
import SplitSearchResult from "./SplitSearchResult";
import SplitFlightDetails, { underLine } from "./SplitFlightDetails";
import { btnStyle } from "../../component/FlightAfterSearch/FareSummary";
import { filterLabelStyle } from "../../style/style";
import FlightAfterFilter from "../../component/FlightAfterSearch/components/FlightAfterFilter/FlightAfterFilter";
import EastIcon from "@mui/icons-material/East";
import AirlinesSliderSkeleton from "../../component/FlightAfterSearch/AirlinesSliderSkeleton";
import FilterSkeleton from "../../component/SkeletonLoader/FilterSkeleton";
import SkeletonLoader from "../../component/SkeletonLoader/SkeletonLoader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { floatBtn } from "../../component/Dashboard/LiveSupport/LiveSupport";

const SplitAfterSearch = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const { checkUnAuthorized } = useUnAuthorized();
  const { isMobile, isMedium, isLarge } = useWindowSize();
  const { refetch, segmentCount } = useSelector((state) => state?.flight);
  const [errMsj, setErrMsj] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedFlight, setSelectedFlight] = useState({});
  const [multicityCrrIndex, setMulticityCrrIndex] = useState(0);

  const {
    adultCount,
    childCount,
    infantCount,
    cabin,
    value,
    segmentsList,
    selectedAirlines,
    searchType,
    fareType,
    fromSegmentLists,
    toSegmentLists,
    departureDates,
    arrivalDates,
    classes,
    vendorPref,
    paxDetails = {},
    bookingId = null,
    selectedPassengers = [],
    passengers = [],
    flightAfterSearch,
  } = location?.state;

  const totalPassenger = {
    adultCount,
    childCount,
    infantCount,
  };

  const flightBody = {
    passengers: [
      { type: "ADT", count: adultCount, ages: [] },
      {
        type: "CNN",
        count: childCount.length,
        ages: childCount.map((age) => parseInt(age, 10)),
      },
      { type: "INF", count: infantCount, ages: [] },
    ],
    cabin,
    tripType: value,
    vendorPref:
      selectedAirlines.length > 0
        ? selectedAirlines.map((a) => a?.value)
        : vendorPref,
    studentFare: fareType === "studentFare",
    umrahFare: fareType === "umrahFare",
    seamanFare: fareType === "seamanFare",
    laborFare: fareType === "laborFare",
    segmentsList: segmentsList,
    advanceSearch: false,
    searchSplit: true,
    classes: classes?.flat() || [],
    paxDetails: Object.keys(paxDetails || {}).length > 0 ? paxDetails : [],
    bookingId:
      Array.isArray(bookingId) && bookingId.length === 0 ? "" : bookingId,
  };

  // Run air-search when advancedFilter is "airlines"
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      flightAfterSearch === "reissue-search"
        ? "split-reissue-search"
        : "split-air-search",
      flightBody,
      refetch,
    ],
    queryFn: async () => {
      const url =
        flightAfterSearch === "reissue-search"
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue/search`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/air-search`;

      try {
        const response = await axios.post(url, { ...flightBody }, jsonHeader());
        dispatch(setSearchType(searchType));
        setSelectedFlight({});
        setMulticityCrrIndex(0);
        return response?.data?.data;
      } catch (err) {
        if (err?.response?.status === 401) checkUnAuthorized(err);
        // setErrMsj(err?.response?.data?.message);
      }
    },
    staleTime: 0,
    cacheTime: 0,
    // enabled: shouldRunQueries,
  });

  const useFilteredFlights = ({
    key,
    type,
    filterValue,
    refetch,
    flightBody,
  }) => {
    return useInfiniteQuery({
      queryKey: [
        "filterFlights",
        `key-${key}-type-${type}`,
        filterValue,
        refetch,
      ],

      queryFn: async ({ pageParam = 1 }) => {
        const body = {
          tripType: flightBody?.tripType,
          page: pageParam,
          limit: 5,
          key,
          ...filterValue,
        };

        const data = await fetchFlights(body, jsonHeader);
        if (data?.success === false) throw new Error(data?.message);
        return data;
      },
      enabled: !!key,
      getNextPageParam: (lastPage) => {
        const meta = lastPage?.data?.[0]?.totals || {};
        if (meta.currentPage < meta.totalPages || meta.given < meta.totalGds) {
          return meta.nextPage;
        }
        return undefined;
      },
      retry: 5,
      staleTime: 0,
      cacheTime: 0,
    });
  };

  const totalPaxCount = adultCount + childCount?.length + infantCount;

  const handleSelectedFlight = (flightData, index) => {
    setSelectedFlight((prev) => ({ ...prev, [index]: flightData }));

    if (segmentsList?.length > 2 && index < data?.length - 1) {
      setMulticityCrrIndex(index + 1);
    }
  };

  return (
    <Box sx={{ height: "max-content", margin: "auto" }}>
      {/* TODO:: Modify Search  */}

      {segmentsList?.length > 2 && (
        <MulticitySplitTabBar
          segmentsList={segmentsList}
          multicityCrrIndex={multicityCrrIndex}
          setMulticityCrrIndex={setMulticityCrrIndex}
          fromSegmentLists={fromSegmentLists}
          toSegmentLists={toSegmentLists}
          selectedFlight={selectedFlight}
        />
      )}

      <Box
        sx={{
          position: segmentCount > 1 ? "" : "sticky",
          top: isMobile
            ? "0px"
            : isMedium
              ? "117px"
              : isLarge
                ? "137px"
                : "0px",
          bottom: "40px",
          bgcolor: isMobile ? "" : "#F0F2F5",
          zIndex: isMobile ? 0 : 1,
          left: 0,
        }}
      >
        {!isMobile ? (
          <Box sx={{ display: { lg: "block", xs: "none" } }}>
            <ModifySearch
              adultCount={adultCount}
              childCount={childCount}
              infantCount={infantCount}
              cabin={cabin}
              searchType={searchType}
              fareType={fareType}
              selectedAirlines={selectedAirlines}
              deptDate={segmentsList[0]?.departureDate}
              arrDate={segmentsList[1]?.departureDate}
              value={value}
              fromSegmentLists={fromSegmentLists}
              toSegmentLists={toSegmentLists}
              isLoading={isFetching}
              flightState={location?.state}
              departureDates={departureDates}
              arrivalDates={arrivalDates}
              flightAfterSearch={flightAfterSearch}
              selectedPassengers={selectedPassengers}
              passengers={passengers}
              vendorPref={vendorPref}
              classes={classes}
              bookingId={bookingId || ""}
              paxDetails={paxDetails || []}
              progressAfter={progress}
              // status={status}
            />
          </Box>
        ) : (
          <Box
            sx={{
              height: "120px",
              bgcolor: "var(--secondary-color)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                ...alignCenter,
                justifyContent: "space-between",
                width: "90%",
                mx: "auto",
              }}
            >
              <ArrowBackIosNewIcon
                sx={{ fontSize: "22px", color: "#fff" }}
                onClick={() => {
                  setErrMsj("");
                  navigate(-1);
                }}
              />
              <Box>
                <Typography
                  sx={{ fontSize: "17px", color: "#fff", fontWeight: "500" }}
                >
                  {fromSegmentLists[0]?.cityName} -{" "}
                  {toSegmentLists[0]?.cityName}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: "#7C92AC" }}>
                  {moment(departureDates[0]).format("Do MMM, YYYY")} |{" "}
                  {`${totalPaxCount === 1 ? totalPaxCount + " Person" : totalPaxCount + " Persons"}`}{" "}
                  | {cabin}
                </Typography>
              </Box>

              <SearchIcon
                sx={{ fontSize: "22px", color: "#fff" }}
                onClick={() => navigate("/dashboard/searchs")}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: "-20px",
                left: "5%",
                borderRadius: "4px",
                bgcolor: "var(--primary-color)",
                px: "16px",
                ...alignCenter,
                justifyContent: "space-between",
                height: "40px",
                width: "90%",
                mx: "auto",
                zIndex: 1,
              }}
              onClick={() => {
                if (isFetching) return;
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  textTransform: "uppercase",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Filter
              </Typography>
              <TuneIcon sx={{ color: "white" }} />
            </Box>
          </Box>
        )}
      </Box>

      <Grid container sx={{ mt: "15px" }} columnSpacing={2}>
        <Grid item md={2.5}>
          {isLoading ? (
            <FilterSkeleton />
          ) : (
            <Box>
              <Box
                sx={{ bgcolor: "#fff", p: 2, mb: 2, borderRadius: "4.31px" }}
              >
                <Typography sx={{ ...filterLabelStyle, mb: 1.5 }}>
                  Filters
                </Typography>
                {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button sx={{ ...btnStyle(true), width: "48%" }}>Onward</Button>
                <Button sx={{ ...btnStyle(true), width: "48%" }}>Return</Button>
              </Box> */}
              </Box>

              {/* <FlightAfterFilter
              data={{}}
              progress={100}
              advancedFilter={""}
              setAlternateDateFilter={() => {}}
              value={"return"}
              flightAfterSearch={""}
              advancedFilterValue={[]}
            /> */}
            </Box>
          )}
        </Grid>

        {isLoading ? (
          <Grid item md={9.5}>
            <Box sx={{ width: "100%", overflow: "hidden", mb: "15px" }}>
              <AirlinesSliderSkeleton />
            </Box>
            {[...new Array(3)].map((_, index) => (
              <Box key={index} sx={{ mb: "15px" }}>
                <SkeletonLoader />
              </Box>
            ))}
          </Grid>
        ) : (
          [
            ...(segmentsList?.length < 3
              ? data
              : [data?.at(multicityCrrIndex)]),
          ]?.map((resData, index) => {
            return (
              <Grid
                key={index}
                container
                item
                md={segmentsList?.length < 3 ? 4.75 : 9.5}
              >
                <SplitSearchResult
                  flightAfterSearch={flightAfterSearch}
                  filterValue={{}}
                  firstValue={""}
                  filterPriceValue={{}}
                  useFilteredFlights={useFilteredFlights}
                  segmentKey={resData.key}
                  searchSplitType={resData.searchSplitType}
                  refetch={refetch}
                  flightBody={flightBody}
                  handleSelectedFlight={(flightData) => {
                    handleSelectedFlight(
                      flightData,
                      segmentsList?.length < 3 ? index : multicityCrrIndex
                    );
                  }}
                  selectedFlight={
                    selectedFlight[
                      segmentsList?.length < 3 ? index : multicityCrrIndex
                    ] || {}
                  }
                  setProgress={setProgress}
                  isLoading={isLoading}
                  segmentsList={segmentsList}
                />
              </Grid>
            );
          })
        )}
      </Grid>

      {Object.values(selectedFlight)?.length === data?.length && (
        <FlightDetailsDrawer
          selectedFlight={selectedFlight}
          totalPassenger={totalPassenger}
          searchType={searchType}
          cabin={cabin}
          flightAfterSearch={flightAfterSearch}
          segmentsList={segmentsList}
        />
      )}
    </Box>
  );
};

const FlightDetailsDrawer = ({
  selectedFlight,
  totalPassenger,
  searchType,
  flightAfterSearch,
  cabin,
  segmentsList,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        onClick={() => setOpenDrawer(!openDrawer)}
        sx={{
          ...floatBtn,
          bgcolor: "var(--primary-color)",
          ":hover": { bgcolor: "var(--primary-color)" },
          bottom: "100px",
          cursor: "pointer",
        }}
      >
        <AirplanemodeActiveIcon
          sx={{
            color: "var(--white)",
            fontSize: "27px",
            animation: `${bounceArrow} 1.5s infinite ease-in-out`,
          }}
        />
      </Box>

      <SwipeableDrawer
        anchor="right"
        open={openDrawer}
        PaperProps={{ sx: { width: "50%", zIndex: 999999999 } }}
        onClose={() => setOpenDrawer(false)}
      >
        <SplitFlightDetails
          selectedFlightArr={Object.values(selectedFlight)}
          totalPassenger={totalPassenger}
          searchType={searchType}
          flightAfterSearch={flightAfterSearch}
          cabin={cabin}
          segmentsList={segmentsList}
          tabType={"selectfare"}
        />
      </SwipeableDrawer>
    </Box>
  );
};

const MulticitySplitTabBar = ({
  segmentsList,
  multicityCrrIndex,
  setMulticityCrrIndex,
  fromSegmentLists,
  toSegmentLists,
  selectedFlight,
}) => {
  return (
    <Box>
      <Grid container sx={{ borderBottom: "1px solid var(--border)" }}>
        {segmentsList.map((flightData, i, arr) => {
          const deptCityName = fromSegmentLists.find(
            (item) => item?.code === flightData?.departure
          )?.cityName;
          const arrCityName = toSegmentLists.find(
            (item) => item?.code === flightData?.arrival
          )?.cityName;

          return (
            <Grid key={i} item md={12 / arr.length} bgcolor={"white"}>
              <Box
                onClick={() => setMulticityCrrIndex(i)}
                sx={{
                  borderTop: "1px solid var(--border)",
                  borderRight: i < arr.length - 1 && "1px solid var(--border)",
                  py: 0.5,
                  cursor: "pointer",
                }}
              >
                <Box sx={{ pl: 2, pt: 0.5 }}>
                  <Typography sx={{ color: "var(--gray)", fontSize: "12px" }}>
                    City 0{i + 1}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      sx={{ color: "var(--mate-black)", fontWeight: "600" }}
                    >
                      <span
                        style={{ ...alignCenter, lineHeight: "2", gap: "7px" }}
                      >
                        {deptCityName}
                        <EastIcon
                          sx={{ color: i === 0 && "var(--secondary-color)" }}
                        />
                        {arrCityName}
                      </span>
                    </Typography>
                    {selectedFlight[i] && (
                      <CheckCircleIcon
                        sx={{ color: "var(--green)", fontSize: "18px" }}
                      />
                    )}
                  </Box>
                </Box>

                {multicityCrrIndex === i && (
                  <Box sx={{ ...underLine, bgcolor: "var(--primary-color)" }} />
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

const alignCenter = { display: "flex", alignItems: "center" };

const bounceArrow = keyframes`
  0% { transform: rotate(90deg) translateY(5px); opacity: 0.2; }
  50% { transform: rotate(90deg) translateY(-10px); opacity: 1; }
  100% { transform: rotate(90deg) translateY(-15px); opacity: 0.2; }
`;

export default SplitAfterSearch;
