import {
  Box,
  Button,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactComponent as SeatIcon } from "../../images/svg/seat.svg";
import { useState } from "react";
import SeatSkeleton from "../FlightAfterSearch/SeatSkeleton";
import { ReactComponent as SeatOutlineIcon } from "../../images/svg/seatOutline.svg";
import { ReactComponent as AirplanIcon } from "../../images/svg/airplane.svg";
import NewViewFareCard from "./NewViewFareCard";
import { useDispatch, useSelector } from "react-redux";
import {
  setAlreadyButtonClicked,
  setSelectedSeats,
  setViewButtonShow,
} from "../FlightSearchBox/flighAfterSearchSlice";

const AdvancedAirpriceCard = ({
  flightData,
  cabin,
  totalPassenger,
  segmentsList,
  seatLoading,
  advanceSearchResult,
  cmsData,
  searchType,
  flightBrand,
  setFlightBrand,
  flightAfterSearch,
  advancedLoading,
  handleFetchAdvancedBooking,
  fareCard,
  handleSeatAirprice,
  setIsReset,
  showDetails,
  crrItenary,
  airPriceLoading,
  // viewButtonShow,
  // setViewButtonShow,
}) => {
  // console.log(airPriceLoading);
  const dispatch = useDispatch();
  const [activeSegment, setActiveSegment] = useState(0);
  const { selectedSeats, advnacedModifiedBrands, viewButtonShow } = useSelector(
    (state) => state.flightAfter
  );

  const handleSeats = (seat, segmentIndex, routeIndex) => {
    dispatch(setViewButtonShow(true));
    if (!seat.bookable) return;

    const updatedSelectedSeats = JSON.parse(JSON.stringify(selectedSeats));

    updatedSelectedSeats[segmentIndex][routeIndex] = {
      bookingClass: seat.resBookDesigCode,
      availableSeats: seat.availability,
      departure: advanceSearchResult[segmentIndex][routeIndex].departure,
      arrival: advanceSearchResult[segmentIndex][routeIndex].arrival,
      departureDateTime:
        advanceSearchResult[segmentIndex][routeIndex].departureDateTime,
      arrivalDateTime:
        advanceSearchResult[segmentIndex][routeIndex].arrivalDateTime,
    };

    dispatch(setSelectedSeats(updatedSelectedSeats));
  };

  return (
    <Box>
      {!seatLoading && showDetails ? (
        <>
          {advanceSearchResult?.length !== 0 ? (
            <Grid container>
              {/* Content for Active Segment */}
              <Grid item xs={12} lg={8.4} sx={{ px: "5px" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "8px",
                    pb: "8px",
                  }}
                >
                  {advanceSearchResult?.map((segment, index) => {
                    const firstRoute = segment[0];
                    const lastRoute = segment[segment.length - 1];
                    const departure = firstRoute?.departure || "";
                    const arrival = lastRoute?.arrival || "";

                    return (
                      <Box
                        key={`segment-box-${index}`}
                        onClick={() => setActiveSegment(index)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: "120px",
                          gap: "7px",
                          py: 0.7,
                          px: 1,
                          borderRadius: "3px",
                          cursor: "pointer",
                          textTransform: "none",
                          border: "1px solid",
                          borderColor: "var(--primary-color)",
                          bgcolor:
                            activeSegment === index
                              ? "var(--primary-color)"
                              : "transparent",
                          color:
                            activeSegment === index
                              ? "white"
                              : "var(--primary-color)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px" }}>
                          {departure}
                        </Typography>
                        <AirplanIcon
                          style={{
                            height: "15px",
                            width: "15px",
                            mx: 0.5, // horizontal margin
                            fill:
                              activeSegment === index
                                ? "white"
                                : "var(--primary-color)",
                          }}
                        />
                        <Typography sx={{ fontSize: "12px" }}>
                          {" "}
                          {arrival}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                {advanceSearchResult[activeSegment]?.map(
                  (route, routeIndex) => {
                    return (
                      <Grid
                        container
                        key={`route-container-${activeSegment}-${routeIndex}`}
                        sx={{
                          mb: 3,
                          borderBottom: "1px solid #E9E9E9",
                          pb: "15px",
                        }}
                      >
                        {/* Route Header */}
                        <Grid
                          item
                          lg={3}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                color: "var(--gray-3)",
                                fontWeight: 800,
                                display: "flex",
                                gap: "6px",
                                alignItems: "center",
                              }}
                            >
                              <span>{route?.departure}</span>
                              <AirplanIcon
                                style={{
                                  height: "14px",
                                  width: "14px",
                                  mx: 0.5,
                                  fill: "var(--primary-color)",
                                }}
                              />
                              <span>{route?.arrival}</span>
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "var(--secondary-color)",
                                fontWeight: "600",
                              }}
                            >
                              {route?.carrier} {route?.flightNumber}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Seat Map */}
                        <Grid
                          item
                          xs={12}
                          lg={9}
                          sx={{ borderLeft: "1px solid #E9E9E9", pl: "15px" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "14px",
                              flexWrap: "wrap",
                            }}
                          >
                            {route.seatMap?.map((seat, seatIndex) => {
                              const isSelected =
                                selectedSeats[activeSegment][routeIndex]
                                  ?.bookingClass === seat.resBookDesigCode;
                              const isDisabled =
                                !seat?.bookable || advancedLoading; // Added loading check

                              return (
                                <Box
                                  key={`seat-${activeSegment}-${routeIndex}-${seatIndex}`}
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    cursor: isDisabled
                                      ? "not-allowed"
                                      : "pointer",
                                    opacity: isDisabled ? 0.5 : 1,
                                  }}
                                  onClick={() => {
                                    if (isDisabled) return; // Prevent clicks when disabled
                                    handleSeats(
                                      seat,
                                      activeSegment,
                                      routeIndex
                                    );
                                  }}
                                >
                                  {isSelected ? (
                                    <SeatIcon
                                      style={{ fill: "var(--primary-color)" }}
                                      width="30px"
                                      height="30px"
                                    />
                                  ) : (
                                    <SeatOutlineIcon
                                      style={{
                                        stroke: isDisabled
                                          ? "#EE7A94"
                                          : "var(--primary-color)",
                                      }}
                                      width="30px"
                                      height="30px"
                                    />
                                  )}

                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      color: isSelected
                                        ? "#DC143C"
                                        : isDisabled
                                          ? "gray"
                                          : "black",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {seat.resBookDesigCode}
                                    {seat.availability}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Grid>
                      </Grid>
                    );
                  }
                )}
                {/* Content for Selected Seats */}
                {selectedSeats.flat().length > 0 && (
                  <>
                    <Grid container item lg={12} spacing={1} sx={{ px: "5px" }}>
                      <Grid item lg={12} sx={{ display: "flex", gap: "10px" }}>
                        {" "}
                        <Typography
                          sx={{
                            color: "var(--primary-gray)",
                            fontSize: "13px",

                            mb: 1,
                          }}
                        >
                          Selected Seats
                        </Typography>
                        <Typography
                          sx={{
                            color: "var(--primary-color)",
                            fontSize: "13px",
                            fontWeight: "bold",
                            textDecoration: "underline",
                            mb: 1,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setIsReset((prev) => !prev);
                            dispatch(setAlreadyButtonClicked(false));
                            dispatch(setSelectedSeats([]));
                          }}
                        >
                          (Reset Seat)
                        </Typography>
                      </Grid>

                      <Grid item lg={6} sx={{ display: "flex" }}>
                        {selectedSeats.flat().map((selectedSeat, index) => (
                          <Grid item key={`selected-seat-${index}`}>
                            <Tooltip
                              title={`${selectedSeat?.departure} - ${selectedSeat?.arrival}`}
                              placement="top"
                              arrow
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  borderRadius: "4px",
                                }}
                              >
                                <SeatIcon
                                  style={{ fill: "var(--primary-color)" }}
                                  width="25px"
                                  height="25px"
                                />
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    color: "var(--primary-color)",
                                    fontWeight: "500",
                                  }}
                                >
                                  {selectedSeat.bookingClass}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Grid>
                        ))}
                      </Grid>

                      <Grid
                        item
                        lg={6}
                        sx={{
                          display: "flex",
                          gap: "15px",
                          justifyContent: "flex-end",
                        }}
                      >
                        {viewButtonShow && (
                          <Button
                            style={{
                              backgroundColor: "var(--secondary-color)",
                              color: "#fff",
                              fontSize: "12px",
                              textTransform: "none",
                              height: "30px",
                            }}
                            onClick={() =>
                              handleSeatAirprice(
                                advnacedModifiedBrands[crrItenary],
                                0
                              )
                            }
                          >
                            View Seat Availability
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Content for Fare Card */}
              <Grid item md={3.4} sx={{ ml: "10px" }}>
                {advancedLoading || airPriceLoading ===0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      ml: "10px",
                      p: "10px",
                      gap: "8px",
                      height: "100%",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      width: "90%",
                    }}
                  >
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={150}
                      height={40}
                    />
                    <Skeleton variant="rounded" width={210} height={50} />
                    <Skeleton variant="rounded" width={210} height={50} />
                    <Skeleton variant="rounded" width={210} height={50} />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={140}
                      height={40}
                    />
                  </Box>
                ) : flightData === null ? (
                  <Box
                    sx={{
                      border: "1px solid #EE7A94",
                      borderRadius: "4px",
                      ml: "10px",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        backgroundColor: "#ffe6e6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pl: "3px",
                      }}
                    >
                      <SeatIcon
                        style={{
                          fill: "#EE7A94",
                          width: "25px",
                          height: "25px",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          width: "100%",
                          height: "2px",
                          backgroundColor: "var(--primary-color)",
                          transform: "rotate(-45deg)",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        color: "var(--primary-color)",
                        fontSize: "14px",
                        pt: "10px",
                      }}
                    >
                      No Fare Available For This
                      <br />
                      Combination
                    </Typography>
                  </Box>
                ) : (
                  <NewViewFareCard
                    flightData={flightData}
                    modifiedBrands={[advnacedModifiedBrands[0]]}
                    totalPassenger={totalPassenger}
                    segmentsList={segmentsList}
                    cabin={cabin}
                    cmsData={cmsData}
                    searchType={searchType}
                    flightBrand={flightBrand}
                    setFlightBrand={setFlightBrand}
                    flightAfterSearch={flightAfterSearch}
                    handleFetchAdvancedBooking={handleFetchAdvancedBooking}
                    fareCard={fareCard}
                    crrItenary={crrItenary}
                  />
                )}
              </Grid>
            </Grid>
          ) : (
            ""
          )}
        </>
      ) : (
        <Grid container item lg={12}>
          <SeatSkeleton />
        </Grid>
      )}
    </Box>
  );
};

export default AdvancedAirpriceCard;
