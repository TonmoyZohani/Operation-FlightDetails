import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Box,
  Dialog,
  IconButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import useWindowSize from "../../shared/common/useWindowSize";
import AirlinesSlider from "../AirlinesSlider/AirlinesSlider";
import ServerError from "../Error/ServerError";
import {
  setAdvancedKey,
  setAlreadyButtonClicked,
  setAppliedFilters,
  setFilterValue,
  setIsBookable,
  setKey,
  setKeyNull,
} from "../FlightSearchBox/flighAfterSearchSlice";
import { setSearchType, setValue } from "../FlightSearchBox/flightSearchSlice";
import NotFound from "../NotFound/NoFound";
import FilterSkeleton from "../SkeletonLoader/FilterSkeleton";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import AirlinesSliderSkeleton from "./AirlinesSliderSkeleton";
import MobileSingleFlight from "./MobileSingleFlight";
import MobileSkeleton from "./MobileSkeleton";
import ModifySearch from "./ModifySearch";
import SingleFlightCard from "./SingleFlightCard";
import FlightAfterFilter from "./components/FlightAfterFilter/FlightAfterFilter";
import ReplyIcon from "@mui/icons-material/Reply";
import CloseIcon from "@mui/icons-material/Close";
import Lottie from "lottie-react";
import NotBookable from "../../assets/lottie/notBookable.json";
import AirlinesDateSlider from "../AirlinesDateSlider/AirlinesDateSlider";

export const fetchFlights = async (flightBody, jsonHeader) => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/search-history/filter`;
  const response = await axios.post(url, { ...flightBody }, jsonHeader());
  return response?.data;
};

const itemHeight = 35;
const windowHeight = 1000000;
const overscan = 20;

const FlightAfterSearch = () => {
  const { jsonHeader } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { key, advancedKey, filterValue, isBookable, advancedFilter } =
    useSelector((state) => state.flightAfter);
  const { refetch, segmentCount } = useSelector((state) => state?.flight);
  const [pageInfo, setPageInfo] = useState({
    nextPage: null,
    currentPage: null,
    givenPage: null,
    gdsPage: null,
  });
  const [errMsj, setErrMsj] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { isMobile, isMedium, isLarge } = useWindowSize();
  const { checkUnAuthorized } = useUnAuthorized();
  const [uniqueAirlines, setUniqueAirlines] = useState([]);
  const [updatedData, setUpdatedData] = useState({});
  const [progress, setProgress] = useState(0);
  const [queryTimestamp, setQueryTimestamp] = useState(Date.now());
  const [isOpen, setIsOpen] = useState(false);
  const [alternateDateFilter, setAlternateDateFilter] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const observer = useRef();
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

  const [advancedFilterValue, setAdvancedFilterValue] = useState([]);

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
    classes: classes?.flat() || [],
    paxDetails: Object.keys(paxDetails || {}).length > 0 ? paxDetails : [],
    bookingId:
      Array.isArray(bookingId) && bookingId.length === 0 ? "" : bookingId,
  };

  const shouldRunQueries = advancedFilter === "airlines";

  // Run air-search when advancedFilter is "airlines"
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [
      flightAfterSearch === "reissue-search" ? "reissue-search" : "air-search",
      flightBody,
      refetch,
      queryTimestamp,
    ],
    queryFn: async () => {
      const url =
        flightAfterSearch === "reissue-search"
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/reissue/search`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/air-search`;

      try {
        setErrMsj("");
        setUniqueAirlines([]);
        setUpdatedData({});
        dispatch(setFilterValue({}));
        dispatch(setSearchType(searchType));
        dispatch(setAppliedFilters([]));
        // dispatch(setAlreadyButtonClicked(false));
        setAlternateDateFilter(false);

        const response = await axios.post(url, { ...flightBody }, jsonHeader());

        setProgress(0);
        setPageInfo({
          nextPage: null,
          currentPage: null,
          givenPage: null,
          gdsPage: null,
        });
        dispatch(setKey(response?.data?.data?.key));
        dispatch(setValue(value));

        return response?.data?.data;
      } catch (err) {
        dispatch(setKeyNull());
        if (err?.response?.status === 401) checkUnAuthorized(err);
        setErrMsj(err?.response?.data?.message);
      }
    },
    staleTime: 0,
    cacheTime: 0,
    enabled: shouldRunQueries,
  });

  const {
    data: alternateData,
    isLoading: isAlternateLoading,
    isFetching: isAlternateFetching,
    isError: isAlternateError,
  } = useQuery({
    queryKey: ["alternate-search", flightBody, refetch, queryTimestamp],
    queryFn: async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/alternate-search`;

      try {
        const response = await axios.post(url, { ...flightBody }, jsonHeader());
        dispatch(setAdvancedKey(response?.data?.data?.key));
        setAdvancedFilterValue(
          response?.data?.data?.filterValue?.alternateDateData
        );
      } catch (err) {
        if (err?.response?.status === 401) checkUnAuthorized(err);
        setErrMsj(err?.response?.data?.message);
      }
    },
    staleTime: 0,
    cacheTime: 0,
    enabled:
      shouldRunQueries &&
      value === "oneway" &&
      flightAfterSearch !== "reissue-search",
  });

  const {
    data: datas,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["filterFlights", { key, ...filterValue }, refetch],
    queryFn: async ({ pageParam = 1 }) => {
      if (!key || isFetching) return;

      try {
        setErrMsj("");

        const flightData = {
          tripType:
            flightBody?.tripType === "multicity"
              ? "multiCity"
              : flightBody?.tripType === "oneway"
                ? "oneWay"
                : flightBody?.tripType,
          page: pageParam,
          limit: 5,
          key: alternateDateFilter === false ? key : advancedKey,
          ...filterValue,
        };

        // Initial fetch
        let data = await fetchFlights(flightData, jsonHeader);

        if (
          data?.success === false &&
          data?.message === "Please Search Again"
        ) {
          data = await fetchFlights(flightData, jsonHeader);
        }

        if (data?.success === false) {
          throw new Error(data?.message || "Search failed, please try again.");
        }

        setUpdatedData(data?.data[0]);
        setUniqueAirlines(data?.data[0]?.filterValue?.airlines);
        setPageInfo({
          nextPage: data?.data[0]?.totals?.nextPage ?? null,
          currentPage: data?.data[0]?.totals?.currentPage ?? null,
          givenPage: data?.data[0]?.totals?.given ?? null,
          gdsPage: data?.data[0]?.totals?.totalGds ?? null,
        });

        return data;
      } catch (err) {
        const msj = err?.message || err?.response?.data?.message;
        setErrMsj(msj);
        throw err;
      }
    },
    enabled: !!key && !isFetching,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.data[0]?.totals?.currentPage;
      const totalPage = lastPage?.data[0]?.totals?.totalPages;
      const nextPage = lastPage?.data[0]?.totals?.nextPage;
      const givenPage = lastPage?.data[0]?.totals?.given;
      const gdsPage = lastPage?.data[0]?.totals?.totalGds;

      if (currentPage < totalPage || givenPage < gdsPage) {
        return nextPage;
      }
      return undefined;
    },
    retry: flightAfterSearch === "reissue-search" ? 0 : 5,
    staleTime: 0,
    cacheTime: 0,
  });

  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const handleDrawerToggle = () => {
    setFilterDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    const lastPage = datas?.pages?.[datas.pages.length - 1];
    const totals = lastPage?.data?.[0]?.totals || {};
    const given = totals.given || 0;
    const gds = totals.totalGds || 0;
    const currentPage = totals.currentPage || 1;
    const totalPages = totals.totalPages || 1;

    let finalPercentage = 0;

    if (given === gds) {
      if (currentPage === totalPages) {
        finalPercentage = 100;
      } else {
        finalPercentage = (given / gds) * 100;
      }
    } else if (gds > 0) {
      finalPercentage = (given / gds) * 100;
    }

    setProgress(finalPercentage);

    const shouldFetch = given < gds && hasNextPage && !isFetchingNextPage;

    if (shouldFetch) {
      fetchNextPage();
    }
  }, [datas, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const flightData = (() => {
    if (!datas?.pages) return [];

    const seen = new Set();
    const uniqueFlights = [];

    for (const page of datas.pages) {
      const flights = page?.data?.[0]?.response || [];
      for (const flight of flights) {
        if (flight?.uuid && !seen.has(flight.uuid)) {
          seen.add(flight.uuid);
          uniqueFlights.push(flight);
        }
      }
    }

    return uniqueFlights;
  })();

  const filterPriceValue = updatedData?.filterValue?.price;
  const totalPaxCount = adultCount + childCount?.length + infantCount;

  return (
    <Box sx={{ height: "max-content", margin: "auto" }}>
      {/* TODO:: Modify Search  */}
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
          <Box
            sx={{
              display: { lg: "block", xs: "none" },
            }}
          >
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
              status={status}
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
                display: "flex",
                alignItems: "center",
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "40px",
                width: "90%",
                mx: "auto",
                zIndex: 1,
              }}
              onClick={() => {
                if (isFetching) return;
                handleDrawerToggle();
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

        <Box
          sx={{
            bgcolor: "white",
            mt: {
              xs: 5,
              lg: "16px",
            },
            borderRadius: "4px",
            width: {
              xs: "90%",
              lg: "100%",
            },
            mx: "auto",
          }}
        >
          {status === "error" ? null : status === "pending" ||
            isAlternateFetching ||
            isFetching ||
            isLoading ||
            progress < 100 ? (
            <AirlinesSliderSkeleton />
          ) : advancedFilter === "airlines" ? (
            <AirlinesSlider
              data={data}
              uniqueAirlines={uniqueAirlines}
              filterValue={filterValue}
            />
          ) : (
            <AirlinesDateSlider
              data={data}
              advancedFilterValue={advancedFilterValue}
              searchDate={segmentsList[0]?.departureDate}
              setAlternateDateFilter={setAlternateDateFilter}
            />
          )}
        </Box>
      </Box>

      {status === "error" && flightAfterSearch === "reissue-search" ? (
        <Box sx={{ height: "470px" }}>
          <NotFound message={"No Data is found for this search"} />
        </Box>
      ) : (
        <>
          {!isFetching && status === "success" ? (
            flightData.length === 0 ? (
              <Box sx={{ height: "450px" }}>
                {data?.filterValue?.airlines?.length === 0 &&
                progress === 100 ? (
                  <Box sx={{ height: "470px" }}>
                    <NotFound message={"No Data is found for this search"} />
                  </Box>
                ) : (
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: "15px",
                    }}
                  >
                    <Grid
                      item
                      lg={2.6}
                      xs={12}
                      sx={{
                        display: { lg: "block", xs: "none" },
                      }}
                    >
                      <FlightAfterFilter
                        data={updatedData}
                        progress={progress}
                        advancedFilter={advancedFilter}
                        setAlternateDateFilter={setAlternateDateFilter}
                        value={value}
                        flightAfterSearch={flightAfterSearch}
                        advancedFilterValue={advancedFilterValue}
                      />
                    </Grid>

                    <Grid item lg={9.2} xs={12}>
                      {progress === 100 ? (
                        <Box sx={{ height: "450px" }}>
                          <NotFound
                            message={
                              "Sorry, we couldn’t find any results matching your filters."
                            }
                          />
                        </Box>
                      ) : (
                        <>
                          {[...new Array(3)].map((_, index) => (
                            <Box>
                              {isMobile ? (
                                <Box key={index} sx={{ mb: "15px" }}>
                                  <MobileSkeleton />
                                </Box>
                              ) : (
                                <Box key={index} sx={{ mb: "15px" }}>
                                  <SkeletonLoader />
                                </Box>
                              )}
                            </Box>
                          ))}
                        </>
                      )}
                    </Grid>
                  </Grid>
                )}
              </Box>
            ) : (
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: "15px",
                }}
              >
                <Grid
                  item
                  lg={2.6}
                  xs={0}
                  sx={{
                    display: { lg: "block", xs: "none" },
                  }}
                >
                  <Box
                    sx={{
                      height: `calc(100vh - ${
                        isMobile
                          ? "0px"
                          : isMedium
                            ? "260px"
                            : isLarge
                              ? "280px"
                              : "0px"
                      })`,
                      overflowY: "auto",
                      overflowX: "hidden",
                      position: "sticky",
                      top:
                        value === "multicity"
                          ? "0px"
                          : pageInfo?.givenPage === pageInfo?.gdsPage
                            ? isMobile
                              ? "0px"
                              : isMedium
                                ? "260px"
                                : isLarge
                                  ? "280px"
                                  : "0px"
                            : "0px",
                      "&::-webkit-scrollbar": { display: "none" },
                      "-ms-overflow-style": "none",
                      scrollbarWidth: "none",
                    }}
                  >
                    <Box>
                      <FlightAfterFilter
                        data={updatedData}
                        progress={progress}
                        advancedFilter={advancedFilter}
                        setAlternateDateFilter={setAlternateDateFilter}
                        value={value}
                        flightAfterSearch={flightAfterSearch}
                        advancedFilterValue={advancedFilterValue}
                      />
                    </Box>

                    {isFetchingNextPage && <FilterSkeleton />}
                  </Box>
                </Grid>

                <Grid item lg={9.27} xs={12}>
                  <Box sx={{ height: "max-content", margin: "auto" }}>
                    {isError === false ? (
                      <>
                        {errMsj === "Please Search Again" ? (
                          <Box
                            sx={{
                              bgcolor: "white",
                              height: "calc(93vh - 170px)",
                              borderRadius: "5px",
                              width: {
                                xs: "90%",
                                lg: "100%",
                              },
                              mx: "auto",
                              mt: {
                                xs: 5,
                                lg: 0,
                              },
                            }}
                          >
                            <NotFound message={errMsj} />
                          </Box>
                        ) : (
                          <Box>
                            {status === "pending" || isFetching || isLoading
                              ? data?.length !== 0 &&
                                [
                                  ...new Array(
                                    window.innerWidth < 1920 ? 3 : 5
                                  ),
                                ].map((_, index) => (
                                  <Box key={index} sx={{ mb: "15px" }}>
                                    {!isMobile ? (
                                      <SkeletonLoader />
                                    ) : (
                                      <MobileSkeleton />
                                    )}
                                  </Box>
                                ))
                              : null}
                            {flightData?.length > 0 &&
                              flightData[0] &&
                              !isFetching && (
                                <VirtualizedListOptimized
                                  totalPassenger={totalPassenger}
                                  segmentsList={segmentsList}
                                  flightData={flightData}
                                  isMobile={isMobile}
                                  fromSegmentLists={fromSegmentLists}
                                  toSegmentLists={toSegmentLists}
                                  adultCount={adultCount}
                                  childCount={childCount}
                                  infantCount={infantCount}
                                  departureDates={departureDates}
                                  cabin={cabin}
                                  lastItemRef={lastItemRef}
                                  isFetchingNextPage={isFetchingNextPage}
                                  searchType={searchType}
                                  classes={classes}
                                  passengers={passengers}
                                  flightAfterSearch={flightAfterSearch}
                                  paxDetails={paxDetails}
                                  bookingId={bookingId}
                                  cachedKey={key}
                                  filterPriceValue={filterPriceValue}
                                  filterValue={updatedData?.filterValue}
                                  isOpen={isOpen}
                                  index={key}
                                  alternateDateFilter={alternateDateFilter}
                                  flightState={location?.state}
                                  setAlternateDateFilter={
                                    setAlternateDateFilter
                                  }
                                />
                              )}
                            {isMobile && (
                              <Box
                                onClick={handleToggle}
                                sx={{
                                  position: "fixed",
                                  bottom: 16,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  zIndex: 10,
                                  backgroundColor: "var(--primary-color)",
                                  color: "white",
                                  padding: "4px 16px",
                                  borderRadius: "8px",
                                  boxShadow: 3,
                                  cursor: "pointer",
                                }}
                              >
                                {isOpen ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <CloseIcon
                                      sx={{
                                        color: "white",
                                      }}
                                    />
                                    <Typography>Close</Typography>
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <ReplyIcon
                                      sx={{
                                        color: "white",
                                        transform: "rotateY(180deg)",
                                      }}
                                    />
                                    <Typography>Share</Typography>
                                  </Box>
                                )}
                              </Box>
                            )}

                            {isFetchingNextPage &&
                              [...new Array(3)].map((_, index) =>
                                !isMobile ? (
                                  <Box key={index} sx={{ mb: "15px" }}>
                                    <SkeletonLoader />
                                  </Box>
                                ) : (
                                  <Box key={index} sx={{ mb: "15px" }}>
                                    <MobileSkeleton />
                                  </Box>
                                )
                              )}
                            {pageInfo.gdsPage === pageInfo.givenPage &&
                              pageInfo.currentPage === pageInfo.nextPage &&
                              flightData.length !== 0 && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    py: 2,
                                    flexWrap: "wrap",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography className="end_data_text">
                                    End Of Results.{" "}
                                    <span
                                      style={{
                                        color: "var(--primary-color)",
                                      }}
                                    >
                                      Total {flightData?.length}
                                    </span>{" "}
                                    Data Found
                                  </Typography>
                                </Box>
                              )}
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box
                        sx={{
                          width: {
                            xs: "90%",
                            lg: "100%",
                          },
                          mx: "auto",
                          mt: {
                            xs: 5,
                            lg: 0,
                          },
                          bgcolor: "white",
                          height: "calc(93vh - 170px)",
                          borderRadius: "5px",
                        }}
                      >
                        <ServerError message={errMsj} />
                      </Box>
                    )}

                    {data?.filterValue?.airlines?.length > 0 && (
                      <FilterSwipeableDrawer
                        data={updatedData}
                        filterValue={filterValue}
                        filterDrawerOpen={filterDrawerOpen}
                        onClose={handleDrawerToggle}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            )
          ) : (
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: "15px",
              }}
            >
              <Grid
                item
                lg={2.6}
                xs={12}
                sx={{
                  display: { lg: "block", xs: "none" },
                }}
              >
                <FilterSkeleton />
              </Grid>

              <Grid item lg={9.2} xs={12}>
                {[...new Array(3)].map((_, index) => (
                  <Box>
                    {isMobile ? (
                      <Box key={index} sx={{ mb: "15px" }}>
                        <MobileSkeleton />
                      </Box>
                    ) : (
                      <Box key={index} sx={{ mb: "15px" }}>
                        <SkeletonLoader />
                      </Box>
                    )}
                  </Box>
                ))}
              </Grid>
            </Grid>
          )}

          {data?.filterValue?.airlines?.length > 0 && (
            <FilterSwipeableDrawer
              data={updatedData}
              filterValue={filterValue}
              filterDrawerOpen={filterDrawerOpen}
              onClose={handleDrawerToggle}
            />
          )}
        </>
      )}

      <Dialog
        open={searchType !== "advanced" && isBookable}
        onClose={() => dispatch(setIsBookable(false))}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "450px" },
            px: 2,
            py: { xs: 5, sm: 7 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "1000000000",
          }}
        >
          <Box>
            <Lottie
              animationData={NotBookable}
              loop={true}
              style={{ height: 150, width: 150 }}
            />
          </Box>
          <Typography
            sx={{
              mt: 2,
              fontSize: { xs: "1rem", sm: "1.15rem" },
              textAlign: "center",
              mx: "auto",
              fontWeight: 600,
              mb: 1,
              color: "var(--primary-color)",
            }}
          >
            This Seat Is Not Available
          </Typography>
          <Typography>Kindly Try Another One</Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

const VirtualizedListOptimized = ({
  flightData,
  isMobile,
  adultCount,
  childCount,
  infantCount,
  totalPassenger,
  segmentsList,
  fromSegmentLists,
  toSegmentLists,
  departureDates,
  cabin,
  lastItemRef,
  searchType,
  classes,
  passengers,
  flightAfterSearch,
  paxDetails,
  bookingId,
  filterPriceValue,
  filterValue,
  isOpen,
  alternateDateFilter,
  setAlternateDateFilter,
  flightState,
}) => {
  const [scrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  let renderedNodesCount = Math.ceil(windowHeight / itemHeight) + 2 * overscan;
  renderedNodesCount = Math.min(
    (flightData?.length || 0) - startIndex,
    renderedNodesCount
  );

  const generateRows = () => {
    const items = [];

    for (let i = 0; i < renderedNodesCount; i++) {
      const index = i + startIndex;

      if (index < flightData.length) {
        items.push(
          <div
            key={flightData[index]?.id}
            ref={index === flightData.length - 1 ? lastItemRef : null}
          >
            {isMobile ? (
              <MobileSingleFlight
                key={flightData[index]?.id}
                flightData={flightData[index]}
                fromSegmentLists={fromSegmentLists}
                toSegmentLists={toSegmentLists}
                adultCount={adultCount}
                childCount={childCount}
                infantCount={infantCount}
                departureDates={departureDates}
                cabin={cabin}
                searchType={searchType}
                classes={classes}
                reissuePassengers={passengers}
                flightAfterSearch={flightAfterSearch}
                paxDetails={paxDetails}
                bookingId={bookingId}
                segmentsList={segmentsList}
                totalPassenger={totalPassenger}
                filterPriceValue={filterPriceValue}
                isOpen={isOpen}
                index={index}
              />
            ) : (
              <SingleFlightCard
                key={flightData[index]?.id}
                flightData={flightData[index]}
                totalPassenger={totalPassenger}
                segmentsList={segmentsList}
                cabin={cabin}
                searchType={searchType}
                classes={classes}
                reissuePassengers={passengers}
                flightAfterSearch={flightAfterSearch}
                paxDetails={paxDetails}
                bookingId={bookingId}
                filterPriceValue={filterPriceValue}
                filterValue={filterValue}
                firstValue={flightData[0]?.uuid}
                alternateDateFilter={alternateDateFilter}
                setAlternateDateFilter={setAlternateDateFilter}
                flightState={flightState}
              />
            )}
          </div>
        );
      }
    }
    return items;
  };

  return <div>{generateRows()}</div>;
};

const FilterSwipeableDrawer = ({
  filterDrawerOpen,
  data,
  filterValue,
  onClose,
}) => {
  return (
    <SwipeableDrawer
      anchor="left"
      open={filterDrawerOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          width: {
            xs: "100%",
            sm: "40%",
            md: "30%",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <FlightAfterFilter data={data} filterValue={filterValue} />
    </SwipeableDrawer>
  );
};

export default FlightAfterSearch;

{
  /**
    <SplitAfterSearch
                flightAfterSearch={flightAfterSearch}
                filterValue={filterValue}
                firstValue={flightData[0]?.uuid}
              />
   */
}
