import { Alert, Box, Button, Grid, Tooltip, Typography } from "@mui/material";
import { ReactComponent as AirplanIcon } from "../../images/svg/airplane.svg";
import "./FlightAfterSearch.css";
import React, { useState } from "react";
import FlightDetailsCard, { VerticalLine } from "./FlightDetailsCard";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import moment from "moment";
import segment1AirGif from "../../assets/D5.gif";
import segment2AirGif from "../../assets/D6.gif";
import segment3AirGif from "../../assets/D7.gif";
import segment4AirGif from "../../assets/D8.gif";
import { transformArray } from "../../shared/common/functions";
import useWindowSize from "../../shared/common/useWindowSize";

export const segmentTitleStyles = {
  fontSize: "13px",
  width: "115px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  borderRadius: "3px",
};

const FlightDetails = ({ flightData, bookType, isShowSeats }) => {
  const [toggleSegments, setToggleSegments] = useState(0);
  const [show, setShow] = useState(false);
  const [showAnimatedView, setShowAnimatedView] = useState(null);
  const { isMobile } = useWindowSize();

  // Determine the source based on bookType
  const isAfterSearch = bookType === "afterSearch";
  const cityCount = isAfterSearch
    ? flightData?.details?.cityCount
    : flightData?.cityCount;
  const route = isAfterSearch
    ? flightData?.details?.route
    : flightData?.routes || flightData?.route;
  const singleRoute = route[toggleSegments];
  const currentCity = show
    ? transformArray(cityCount[toggleSegments])
    : cityCount[toggleSegments];

  return (
    <>
      {cityCount?.length > 1 && (
        <Box
          sx={{
            display: "flex",
            gap: "15px",
            px: {
              xs: 2,
              lg: "17px",
            },
            mb: "15px",
          }}
        >
          {isMobile ? (
            <Box sx={{ width: "100%" }}>
              <Box sx={{ mb: "3px" }}>
                {toggleSegments === 0 ? (
                  <Typography>Oneward Flight</Typography>
                ) : (
                  <Typography>Return Flight</Typography>
                )}
              </Box>

              {route?.length > 1 && (
                <Box
                  sx={{
                    bgcolor: "#DAEAFF",
                    p: "7px 8px",
                    borderRadius: "3px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {route?.[toggleSegments]?.departure} -{" "}
                    {route?.[toggleSegments]?.arrival}
                  </Typography>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    <NavigateBeforeIcon
                      sx={{ bgcolor: "#fff", borderRadius: "2px" }}
                      onClick={() => {
                        if (toggleSegments > 0) {
                          setToggleSegments(toggleSegments - 1);
                        }
                      }}
                    />
                    <NavigateNextIcon
                      sx={{ bgcolor: "#fff", borderRadius: "2px" }}
                      onClick={() => {
                        if (toggleSegments < route?.length - 1) {
                          setToggleSegments(toggleSegments + 1);
                        }
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <>
              {route?.map((route, i) => (
                <Box
                  onClick={() => {
                    setToggleSegments(i);
                    setShow(false);
                  }}
                  sx={{
                    bgcolor:
                      toggleSegments === i
                        ? "var(--primary-color)"
                        : "var(--third-color)",
                    border:
                      toggleSegments === i
                        ? "1px solid var(--primary-color)"
                        : "1px solid var(--primary-color)",
                    borderRadius: "3px",
                    padding: "2px 0px 1px 7px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    key={i}
                    sx={{
                      ...segmentTitleStyles,
                      color:
                        toggleSegments === i ? "white" : "var(--primary-color)",
                    }}
                  >
                    {route?.departure}
                    <AirplanIcon
                      style={{
                        height: "15px",
                        width: "15px",
                        fill:
                          toggleSegments === i
                            ? "white"
                            : "var(--primary-color)",
                      }}
                    />
                    {route?.arrival}
                  </Typography>
                  <span
                    style={{
                      fontSize: "11px",
                      color: toggleSegments === i ? "white" : "#787890",
                    }}
                  >
                    {cityCount[i][0]?.totalFlightDuration} &{" "}
                    {cityCount[i].length === 1
                      ? "Non Stop"
                      : `${cityCount[i].length - 1} Stop`}
                  </span>
                </Box>
              ))}
            </>
          )}
        </Box>
      )}

      <>
        {/* Un-comment this if needed */}
        {currentCity?.map((city, i, arr) => {
          const firstSegment = arr[0];
          const lastSegment = arr[arr.length - 1];

          return (
            <Box key={i}>
              {showAnimatedView === null && (
                <FlightDetailsCard
                  index={i}
                  bookType={bookType}
                  city={city}
                  flightData={flightData}
                  show={show}
                  setShow={setShow}
                  isShowSeats={isShowSeats}
                  setShowAnimatedView={setShowAnimatedView}
                  toggleSegments={toggleSegments}
                  currentCity={currentCity}
                />
              )}

              {showAnimatedView === i && (
                <AnimatedView
                  firstSegment={firstSegment}
                  lastSegment={lastSegment}
                  currentCity={currentCity}
                  setShowAnimatedView={setShowAnimatedView}
                  flightData={flightData}
                  toggleSegments={toggleSegments}
                  bookType={bookType}
                />
              )}

              {city?.hiddenStops.length !== 0 && (
                <Box>
                  <Button
                    style={{
                      color: "var(--primary-color)",
                      textTransform: "none",
                      fontSize: "11px",
                      marginLeft: "9px",
                      textDecoration: "underline",
                    }}
                    onClick={() => setShow((prev) => !prev)}
                  >
                    {show ? "Hide Hidden Stops" : "Show Hidden Stops"}
                  </Button>
                </Box>
              )}

              {singleRoute?.arrival !== lastSegment?.arrival &&
              i === arr.length - 1 ? (
                <AlternativeAirportsNotice
                  searchedAirport={city?.arrival}
                  type={"Arrival"}
                />
              ) : arr[i + 1]?.arrival &&
                arr[i]?.arrival !== arr[i + 1]?.departure ? (
                <AlternativeAirportsNotice
                  searchedAirport={city?.arrival}
                  type={"Departure"}
                />
              ) : (
                ""
              )}

              {singleRoute?.departure !== firstSegment?.departure &&
                i === 0 && (
                  <AlternativeAirportsNotice
                    searchedAirport={city?.departure}
                    type={"Departure"}
                  />
                )}
            </Box>
          );
        })}

        {currentCity?.every(
          (item) => item?.marketingCarrier === flightData?.carrier
        ) === false ? (
          <>
            <CodeShareFlightNotice />
          </>
        ) : currentCity?.every(
            (item) => item?.operatingCarrier === item?.marketingCarrier
          ) === false ? (
          <>
            <CodeShareFlightNotice />
          </>
        ) : (
          ""
        )}
        {}
      </>
    </>
  );
};

const AlternativeAirportsNotice = ({ type, searchedAirport }) => {
  return (
    <Box sx={{ px: "15px", ".MuiSvgIcon-root": { color: "#1e462e" } }}>
      <Alert
        severity="info"
        sx={{
          border: "1px solid #1e4620",
          bgcolor: "#EDF7ED",
          color: "#1e462e",
          fontSize: "12px",
          padding: "0px 10px",
        }}
      >
        <span style={{ fontWeight: "600" }}>
          Alternarive {type} Airports Notes:
        </span>{" "}
        <span style={{ color: "var(--primary-color)" }}>
          ({searchedAirport})
        </span>{" "}
        Please Confirm the Airports. Depart from or arrive at different airports
        near your originally searched locations. We suggest nearby flights to
        help you compare prices across different airports and provide you with
        more options.
      </Alert>
    </Box>
  );
};

const CodeShareFlightNotice = () => {
  return (
    <Box
      pt={"10px"}
      sx={{ px: "15px", ".MuiSvgIcon-root": { color: "#1e462e" } }}
    >
      <Alert
        severity="info"
        sx={{
          border: "1px solid #1e4620",
          bgcolor: "#EDF7ED",
          color: "#1e462e",
          fontSize: "12px",
          padding: "0px 10px",
        }}
      >
        <span style={{ fontWeight: "600" }}>Code share Flight: </span>
        This is a codeshare flight, and disruptions may not permit involuntary
        changes or refunds. There may be visa restrictions for Bangladeshi
        passport holders for this flight. Please consult our reservation team
        before booking.
      </Alert>
    </Box>
  );
};

const AnimatedView = ({
  firstSegment,
  lastSegment,
  currentCity,
  setShowAnimatedView,
  flightData,
  bookType,
}) => {
  const normalizeArray = (data) => {
    if (
      Array.isArray(data) &&
      data?.length === 1 &&
      Array.isArray(data[0]) &&
      data[0]?.length === 0
    ) {
      return [];
    }
    return data;
  };

  // let transit =
  //   bookType === "afterSearch"
  //     ? [{}, ...flightData?.details?.transit[0]]
  //     : [{}, ...flightData?.transit[0]];

  let transit =
    bookType === "afterSearch"
      ? [
          {},
          ...(flightData?.details?.transit?.length > 0
            ? flightData?.details?.transit[0]
            : []),
        ]
      : [
          {},
          ...(flightData?.transit?.length > 0 ? flightData?.transit[0] : []),
        ];

  return (
    <Grid container justifyContent={"space-between"}>
      <Grid
        item
        xs={12}
        mb={5}
        sx={{
          mt: {
            xs: 0,
            lg: flightData?.tripType === "oneWay" && "15px",
          },
        }}
      >
        <Box
          sx={{
            bgcolor: "#F2F7FF",
            py: "3px",
            px: "2px",
            display: "flex",
            alignItems: "center",
            position: "relative",
            gap: "8px",
          }}
        >
          <Button
            sx={{
              display: "flex",
              gap: "8px",
              color: "var(--mate-black)",
              width: "110px",
              padding: "2px 0",
              fontSize: "12px",
              py: "3px",
              fontWeight: 600,
            }}
          >
            {firstSegment?.departure}
            <AirplanIcon
              style={{
                height: "14px",
                width: "14px",
                fill: "var(--mate-black)",
              }}
            />
            {lastSegment?.arrival}
          </Button>

          <VerticalLine />
          <Typography sx={{ fontSize: "12px", color: "#9a9c9f" }}>
            {firstSegment?.totalFlightDuration}
          </Typography>

          {currentCity.length > 1 && <VerticalLine />}

          {currentCity
            .slice(0, currentCity?.length - 1)
            ?.map((crrCity, i, arr) => {
              return (
                <React.Fragment key={i}>
                  <Typography sx={{ fontSize: "12px", color: "#9a9c9f" }}>
                    {transit[i]?.transit} connecting time at{" "}
                    {crrCity?.arrivalCityCode}{" "}
                  </Typography>
                  {i < arr.length - 1 && <VerticalLine />}
                </React.Fragment>
              );
            })}

          <Box sx={{ position: "absolute", right: "15px" }}>
            <Button
              onClick={() => setShowAnimatedView(null)}
              sx={{
                color: "var(--mate-black)",
                padding: "2px 0",
                fontSize: "12px",
                py: "3px",
                fontWeight: 600,
                textDecoration: "underline",
                ":hover": { textDecoration: "underline" },
              }}
            >
              Hide Animated View
            </Button>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={6} md={2.4} pl={"17px"}>
        <Box>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: "500",
              color: "var(--primary-color)",
            }}
          >
            {firstSegment?.departureCityName},{" "}
            {firstSegment?.departureCountryName}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: "#9a9c9f" }}>
            {moment(firstSegment?.departureDateTime).format(
              "ddd DD MMM YYYY, hh:mm"
            )}
          </Typography>
        </Box>
      </Grid>

      {currentCity.slice(0, currentCity?.length - 1)?.map((crrCity, i, arr) => {
        return (
          <Grid key={i} item xs={7.2 / arr?.length}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "var(--secondary-color)",
                }}
              >
                {crrCity?.arrivalCityName}, {crrCity?.arrivalCountryName}
              </Typography>
              <Typography sx={{ fontSize: "10.5px", color: "#9a9c9f" }}>
                {moment(crrCity?.arrivalDateTime).format(
                  "ddd DD MMM YYYY, hh:mm"
                )}
              </Typography>
            </Box>
          </Grid>
        );
      })}

      <Grid item xs={6} md={2.4} pr={"17px"}>
        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: "500",
              color: "var(--primary-color)",
            }}
          >
            {lastSegment?.arrivalCityName}, {lastSegment?.arrivalCountryName}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: "#9a9c9f" }}>
            {moment(lastSegment?.arrivalDateTime).format(
              "ddd DD MMM YYYY, hh:mm"
            )}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ bgcolor: "gree", px: "17px" }}>
          <img
            src={
              currentCity.length === 1
                ? segment1AirGif
                : currentCity.length === 2
                  ? segment2AirGif
                  : currentCity.length === 3
                    ? segment3AirGif
                    : currentCity.length > 3
                      ? segment4AirGif
                      : null
            }
            alt="airplan flying gif"
            style={{ width: "100%" }}
          />
        </Box>
      </Grid>

      <Grid container item xs={12} my={4} px={"17px"} columnSpacing={"15px"}>
        {currentCity?.map((crrCity, i, arr) => {
          return (
            <Grid item xs={12 / arr?.length}>
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  pb: 3,
                }}
              >
                <img
                  src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${crrCity?.marketingCarrier}.png`}
                  width="39px"
                  height="39px"
                  alt="flight1"
                />

                <Box>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "var(--secondary-color)",
                      fontWeight: "500",
                    }}
                  >
                    {crrCity?.marketingCarrierName}
                  </Typography>
                  <Typography sx={{ fontSize: "10.5px" }}>
                    {crrCity?.marketingCarrier} {crrCity?.marketingFlight},{" "}
                    <span style={{ color: "var(--primary-color)" }}>
                      {crrCity?.flightDuration} & {crrCity?.totalMilesFlown}{" "}
                      Miles
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "10.5px" }}>
                    {crrCity?.airCraft}
                  </Typography>
                  <Tooltip
                    title={
                      <Box sx={{ width: "100px", py: "4px" }}>
                        <Typography sx={{ fontSize: "10.5px" }}>
                          Booking Class: {crrCity?.bookingClass}
                        </Typography>
                        <Typography sx={{ fontSize: "10.5px" }}>
                          Available Seats: {crrCity?.availableSeats}
                        </Typography>
                      </Box>
                    }
                  >
                    <Typography
                      sx={{
                        fontSize: "10.5px",
                        color: "var(--secondary-color)",
                        textDecoration: "underline",
                      }}
                    >
                      <span style={{ cursor: "pointer" }}>View More</span>
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default FlightDetails;
