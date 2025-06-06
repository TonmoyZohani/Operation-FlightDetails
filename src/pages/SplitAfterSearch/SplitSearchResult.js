import React, { useCallback, useEffect, useRef, useState } from "react";
import SplitSearchCard, { cheapBox, cheapText } from "./SplitSearchCard";
import { Box, Grid, Tooltip, Typography, Zoom } from "@mui/material";
import AirlinesSlider from "../../component/AirlinesSlider/AirlinesSlider";
import AirlinesSliderSkeleton from "../../component/FlightAfterSearch/AirlinesSliderSkeleton";
import FlightInfoCard from "../../component/FlightAfterSearch/FlightInfoCard";
import {
  CustomFlightTooltip,
  singleCardBoxStyle,
} from "../../component/FlightAfterSearch/SingleFlightCard";
import BaggageTooltip from "../../component/FlightAfterSearch/BaggageTooltip";

const itemHeight = 35;
const windowHeight = 1000000;
const overscan = 20;

const SplitSearchResult = React.memo(
  ({
    flightAfterSearch,
    filterPriceValue,
    filterValue,
    firstValue,

    useFilteredFlights,
    segmentKey,
    searchSplitType,
    refetch,
    flightBody,
    handleSelectedFlight,
    selectedFlight,
    setProgress,
    isLoading,
    segmentsList,
  }) => {
    const {
      data: datas,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = useFilteredFlights({
      key: segmentKey,
      type: searchSplitType,
      filterValue,
      refetch,
      flightBody,
    });

    const observerRef = useRef();

    const lastItemRef = useCallback(
      (node) => {
        if (isFetchingNextPage) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });

        if (node) observerRef.current.observe(node);
      },
      [isFetchingNextPage, hasNextPage, fetchNextPage]
    );

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
        // console.log("if");
      } else {
        // console.log("else");
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

    const uniqueAirlines = (() => {
      if (!datas?.pages) return [];

      const seen = new Set();
      const uniqueFlights = [];

      for (const page of datas.pages) {
        const airlines = page?.data?.[0]?.filterValue?.airlines || [];
        for (const airline of airlines) {
          if (airline?.carrier && !seen.has(airline.carrier)) {
            seen.add(airline.carrier);
            uniqueFlights.push(airline);
          }
        }
      }

      return uniqueFlights;
    })();

    // console.log(filterValue);

    return (
      <>
        <Grid item md={12}>
          {isLoading ? (
            <AirlinesSliderSkeleton />
          ) : (
            <Box sx={{ bgcolor: "#fff", borderRadius: 2, height: "100%" }}>
              <AirlinesSlider
                uniqueAirlines={uniqueAirlines}
                segmentsList={segmentsList}
              />
            </Box>
          )}
        </Grid>

        <Grid
          container
          rowSpacing={2}
          item
          md={12}
          sx={{
            maxHeight: "75vh",
            overflowY: "auto",
            scrollbarWidth: "none",
            mt: 0,
          }}
        >
          {flightData?.length > 0 && (
            <VirtualizedListOptimized
              flightData={flightData}
              lastItemRef={lastItemRef}
              flightAfterSearch={flightAfterSearch}
              filterValue={filterValue}
              firstValue={firstValue}
              filterPriceValue={filterPriceValue}
              handleSelectedFlight={handleSelectedFlight}
              selectedFlight={selectedFlight}
              segmentsList={segmentsList}
            />
          )}
        </Grid>
      </>
    );
  }
);

const VirtualizedListOptimized = ({
  flightData,
  lastItemRef,
  flightAfterSearch,
  filterPriceValue,
  filterValue,
  firstValue,
  handleSelectedFlight,
  selectedFlight,
  segmentsList,
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
        // console.log(flightData[index]);

        items.push(
          <Grid
            item
            md={12}
            key={flightData[index]?.uuid}
            ref={index === flightData.length - 1 ? lastItemRef : null}
          >
            {segmentsList?.length < 3 ? (
              <SplitSearchCard
                flightData={flightData[index]}
                flightAfterSearch={flightAfterSearch}
                filterValue={filterValue}
                firstValue={firstValue}
                filterPriceValue={filterPriceValue}
                handleSelectedFlight={handleSelectedFlight}
                selectedFlight={selectedFlight}
                index={index}
              />
            ) : (
              <Box
                onClick={() => {
                  handleSelectedFlight(flightData[index]);
                }}
                sx={{
                  cursor: "pointer",
                  border: "2px solid",
                  borderRadius: 1,
                  borderColor:
                    selectedFlight?.uuid === flightData[index]?.uuid
                      ? "var(--primary-color)"
                      : "#fff",
                  ":hover": {
                    borderColor:
                      selectedFlight?.uuid === flightData[index]?.uuid
                        ? "var(--primary-color)"
                        : "var(--border)",
                  },
                }}
              >
                <MulticityFligthCard
                  flightData={flightData[index]}
                  flightAfterSearch={flightAfterSearch}
                  filterValue={filterValue}
                  firstValue={firstValue}
                  filterPriceValue={filterPriceValue}
                />
              </Box>
            )}
          </Grid>
        );
      }
    }
    return items;
  };

  return generateRows();
};

const MulticityFligthCard = ({
  flightData,
  flightAfterSearch,
  filterValue,
  filterPriceValue,
  firstValue,
}) => {
  return (
    <Grid container item md={12} sx={{ bgcolor: "white", borderRadius: "4px" }}>
      {flightData?.cityCount?.map((cities, i) => {
        return (
          <Grid
            item
            lg={10}
            key={i}
            container
            sx={{ marginTop: i > 0 && "10px" }}
          >
            <Box>
              <FlightInfoCard
                cities={cities}
                flightData={flightData}
                index={i}
              />
            </Box>
          </Grid>
        );
      })}

      <Grid item lg={2} sx={{ padding: "15px 15px 10px 0" }}>
        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              color: "var(--gray)",
              fontWeight: "500",
              fontSize: "11px",
            }}
          >
            Agent Fare
          </Typography>
          <Typography
            sx={{
              fontSize: "22px",
              color: "var(--mate-black)",
              fontWeight: "500",
            }}
          >
            {flightData?.agentPrice?.toLocaleString("en-IN")} BDT
          </Typography>
        </Box>
      </Grid>

      <Grid item md={12}>
        <Box
          sx={{
            display: "flex",
            gap: "7px",
            flexWrap: "wrap",
            p: 2,
            borderTop: "1px solid #E9E9E9",
          }}
        >
          {filterValue?.fastest && firstValue === flightData?.uuid && (
            <Box sx={{ bgcolor: "#f24300", ...singleCardBoxStyle }}>
              <Typography sx={{ fontSize: "12px", color: "#fff" }}>
                Fastest
              </Typography>
            </Box>
          )}

          {filterValue?.earliest && firstValue === flightData?.uuid && (
            <Box sx={{ bgcolor: "#00a9f2", ...singleCardBoxStyle }}>
              <Typography sx={{ fontSize: "12px", color: "#fff" }}>
                Earilest
              </Typography>
            </Box>
          )}

          {(filterPriceValue?.minPrice === flightData?.agentPrice ||
            filterPriceValue?.maxPrice === flightData?.agentPrice) && (
            <Box
              sx={{
                bgcolor:
                  filterPriceValue?.minPrice === flightData?.agentPrice
                    ? "var(--green)"
                    : "#FFAC1C",
                ...singleCardBoxStyle,
              }}
            >
              <Typography sx={{ fontSize: "12px", color: "#fff" }}>
                {filterPriceValue?.minPrice === flightData?.agentPrice
                  ? "Cheapest"
                  : "Expensive"}
              </Typography>
            </Box>
          )}

          {(() => {
            const hasAlternativeAirport = flightData?.route?.some(
              (routeItem, index) => {
                const legArray = flightData?.cityCount?.[index];
                const lastFlight = legArray?.[legArray.length - 1];
                const routeArrival = routeItem?.arrival;
                return lastFlight?.arrival !== routeArrival;
              }
            );

            return hasAlternativeAirport ? (
              <Box sx={cheapBox("#ffe0db")}>
                <Tooltip title="An airport located near your chosen departure or arrival airport, offered as a substitute to provide additional flight options, competitive fares, or more convenient scheduling.">
                  <Typography noWrap sx={{ color: "#f55d42", ...cheapText }}>
                    Alternative Airport
                  </Typography>
                </Tooltip>
              </Box>
            ) : null;
          })()}

          <Box
            sx={cheapBox(
              flightData?.isRefundable === "Partially Refundable"
                ? "#FFF6EC"
                : "#FFEDF1"
            )}
          >
            <Tooltip
              title={
                flightData?.isRefundable === "Partially Refundable"
                  ? "A ticket type that allows a partial refund if canceled, with the remaining amount subject to airline rules, cancellation fees, or non-refundable portions."
                  : "This ticket cannot be refunded after purchase. If you cancel, you may not get your money back, and changes could involve additional fees."
              }
            >
              <Typography
                noWrap
                sx={{
                  color:
                    flightData?.isRefundable === "Partially Refundable"
                      ? "#F7941D"
                      : "#DC143C",
                  ...cheapText,
                }}
              >
                {flightData?.isRefundable === "Partially Refundable"
                  ? "Partially Refundable"
                  : "Non Refundable"}
              </Typography>
            </Tooltip>
          </Box>

          {(flightData?.immediateIssue ||
            flightAfterSearch === "reissue-search") && (
            <Box sx={cheapBox(flightData?.autoReissue ? "#FFEDF1" : "#E8FFF3")}>
              <Tooltip
                title={
                  flightData?.autoReissue
                    ? "This means your ticket will be issued immediately after you complete the payment, giving you instant confirmation without delays."
                    : "The process of selecting and reserving a flight ticket for your desired route, dates, and class. Once booked, your flight details are confirmed."
                }
              >
                <Typography
                  noWrap
                  sx={{
                    color: flightData?.autoReissue ? "#DC143C" : "#0E8749",
                    ...cheapText,
                  }}
                >
                  {flightData?.autoReissue ? "Instant Purchase" : "Book"}
                </Typography>
              </Tooltip>
            </Box>
          )}

          {flightAfterSearch !== "reissue-search" && (
            <Box
              sx={{
                ...cheapBox("#ebf5ff"),
                display:
                  flightData?.partialPayment &&
                  flightData?.isRefundable === "Partially Refundable" &&
                  !flightData?.immediateIssue
                    ? "block"
                    : "none",
              }}
            >
              <Tooltip title="A payment option that allows you to reserve your flight by paying a portion of the total fare upfront, with the remaining balance due by a specified deadline.">
                <Typography noWrap sx={{ color: "#0884ff", ...cheapText }}>
                  {flightData?.partialPayment &&
                  flightData?.isRefundable === "Partially Refundable" &&
                  !flightData?.immediateIssue
                    ? "Part Payment"
                    : ""}
                </Typography>
              </Tooltip>
            </Box>
          )}

          {!flightData?.immediateIssue &&
            flightAfterSearch !== "reissue-search" && (
              <Box sx={cheapBox("#E8FFF3")}>
                <Tooltip title="The process of selecting and reserving a flight ticket for your desired route, dates, and class. Once booked, your flight details are confirmed.">
                  <Typography noWrap sx={{ color: "#0E8749", ...cheapText }}>
                    Book
                  </Typography>
                </Tooltip>
              </Box>
            )}

          <CustomFlightTooltip
            placement="bottom"
            TransitionComponent={Zoom}
            title={<BaggageTooltip flightData={flightData} />}
          >
            <Box sx={cheapBox("#F1F7FD")}>
              <Typography sx={{ color: "#003566", ...cheapText }}>
                {flightData?.baggage[0][0]?.baggage}
              </Typography>
            </Box>
          </CustomFlightTooltip>

          <Box sx={cheapBox("#F6F6F6")}>
            <Typography
              sx={{
                color: "var(--light-gray)",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {flightData?.system.charAt(0).toUpperCase() +
                flightData?.system.slice(1)}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SplitSearchResult;
