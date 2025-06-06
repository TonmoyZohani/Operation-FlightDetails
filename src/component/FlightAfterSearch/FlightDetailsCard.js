import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";
import { ReactComponent as CurvedPlane } from "../../images/svg/curvedplaneline.svg";
import { ReactComponent as AirplanIcon } from "../../images/svg/airplane.svg";
import moment from "moment";
import AirplanemodeInactiveIcon from "@mui/icons-material/AirplanemodeInactive";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import LuggageIcon from "@mui/icons-material/Luggage";
import useWindowSize from "../../shared/common/useWindowSize";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

export const statusColorMap = {
  Morning: "#87CEEB",
  "Early Morning": "#436AD2",
  Midnight: "#311D59",
  Afternoon: "#E77D00",
  Evening: "#AD461A",
  Noon: "#FFC800",
  Night: "#18457B",
};

const FlightDetailsCard = ({
  bookType,
  index,
  flightData,
  city,
  show,
  isShowSeats,
  setShowAnimatedView,
  toggleSegments,
  currentCity = [],
}) => {
  let transit =
    bookType === "afterSearch"
      ? [
          ...(flightData?.details?.transit?.length > 0
            ? flightData?.details?.transit
            : []),
        ]
      : [...(flightData?.transit?.length > 0 ? flightData?.transit : [])];

  const refundIndexes =
    flightData?.refunds?.length > 0 &&
    flightData?.refunds[0]?.refundIndexes?.length > 0
      ? flightData?.refunds[0]?.refundIndexes
      : [];
  const hasItineraryIndex =
    refundIndexes?.some((item) => item?.indexNumber === toggleSegments) ??
    false;
  const { isMobile } = useWindowSize();

  const FlightPlaneCard = ({ city, flightData }) => {
    // console.log(city);
    // console.log(flightData);

    return (
      <Box
        sx={{
          display: "flex",
          mt: isMobile ? "15px" : "0px",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: { xs: "none", lg: "block" }, mt: 1 }}>
          <img
            src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${city?.marketingCarrier}.png`}
            width="30px"
            height="30px"
            alt="flight1"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://storage.googleapis.com/erp-document-bucket/alternetFlightIcon.png";
            }}
          />
          {city?.operatingCarrier !== city?.marketingCarrier && (
            <img
              src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${city?.operatingCarrier}.png`}
              width="30px"
              height="30px"
              alt="flight1"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://storage.googleapis.com/erp-document-bucket/alternetFlightIcon.png";
              }}
            />
          )}
        </Box>
        <Typography
          sx={{
            color: "var(--mate-black)",
            fontWeight: "500",
            fontSize: "12.5px",
            display: isMobile ? "none" : "block",
            lineHeight: "0",
          }}
        >
          {city?.marketingCarrierName}
        </Typography>
        {city?.operatingCarrier !== city?.marketingCarrier && (
          <Typography
            sx={{
              color: "var(--mate-black)",
              fontWeight: "500",
              fontSize: "12.5px",
              display: isMobile ? "none" : "block",
              lineHeight: "0",
            }}
          >
            &
          </Typography>
        )}
        {city?.operatingCarrier !== city?.marketingCarrier && (
          <Typography
            sx={{
              color: "var(--primary-color)",
              fontWeight: "500",
              fontSize: "12.5px",
              display: isMobile ? "none" : "block",
              lineHeight: "0",
            }}
          >
            <span style={{ color: "var(--secondary-color)" }}>
              Operate By :
            </span>{" "}
            {city?.operatingCarrierName}
          </Typography>
        )}
        <VerticalLine />
        <Typography
          sx={{ color: "#9a9c9f", fontSize: "12.5px", lineHeight: "0" }}
        >
          {city?.marketingCarrier}-{city?.marketingFlight}
        </Typography>
        <VerticalLine />
        <Typography
          sx={{ color: "#9a9c9f", fontSize: "12.5px", lineHeight: "0" }}
        >
          {city?.airCraft || "N/A"}
        </Typography>
        <VerticalLine />
        <Typography
          sx={{ color: "#9a9c9f", fontSize: "12.5px", lineHeight: "0" }}
        >
          {flightData?.class}
        </Typography>
        <Typography
          sx={{
            color: "var(--primary-color)",
            fontWeight: "bold",
            fontSize: "12.5px",
            lineHeight: "0",
          }}
        >
          [{city?.bookingClass}]
        </Typography>
        <VerticalLine />
        <Typography
          sx={{ color: "var(--green)", fontSize: "12.5px", lineHeight: "0" }}
        >
          {flightData?.fareBasisCode || city?.fareBasisCode}
        </Typography>
        {bookType?.toLowerCase() === "aftersearch" && (
          <>
            <VerticalLine />
            <Tooltip title={city?.isFlown ? "Flown" : "UnFlown"}>
              <Typography sx={{ fontSize: "12.5px", lineHeight: "0" }}>
                {city?.isFlown ? (
                  <AirplanemodeActiveIcon
                    sx={{ color: "#becee5", fontSize: "20px", mt: "3px" }}
                  />
                ) : (
                  <AirplanemodeInactiveIcon
                    sx={{ color: "#becee5", fontSize: "20px", mt: "3px" }}
                  />
                )}
              </Typography>
            </Tooltip>
          </>
        )}
        {isShowSeats && !!city?.availableSeats && (
          <>
            <VerticalLine />
            <Typography
              sx={{ color: "#E5BD06", fontSize: "12.5px", lineHeight: "0" }}
            >
              {`${city.availableSeats} Seats Available`}
            </Typography>
          </>
        )}

        <>
          <VerticalLine />

          <Tooltip
            title={
              <Box>
                {city?.baggage?.map((bag, index) => (
                  <Typography
                    key={index}
                    sx={{
                      color: "var(--primary-color)",
                      fontSize: "12.5px",
                      // lineHeight: "0",
                    }}
                  >
                    {bag?.paxType} - {bag?.baggage}
                  </Typography>
                ))}
              </Box>
            }
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "white",
                  border: "1px solid var(--primary-color)",
                  color: "var(--primary-color)",
                },
              },
            }}
          >
            <LuggageIcon
              sx={{ color: "#4bb189", fontSize: "20px", cursor: "pointer" }}
            />
          </Tooltip>
        </>

        {city?.meals && (
          <>
            <VerticalLine />

            <Tooltip
              title={
                <Box>
                  {city?.meals?.map((bag, index) => (
                    <Typography
                      key={index}
                      sx={{
                        color: "var(--primary-color)",
                        fontSize: "12.5px",
                        lineHeight: "0",
                      }}
                    >
                      {bag?.code} - {bag?.description}
                    </Typography>
                  ))}
                </Box>
              }
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "white",
                    border: "1px solid var(--primary-color)",
                    color: "var(--primary-color)",
                  },
                },
              }}
            >
              <RestaurantMenuIcon
                sx={{ color: "#CC5500", fontSize: "20px", cursor: "pointer" }}
              />
            </Tooltip>
          </>
        )}
      </Box>
    );
  };

  return (
    <Grid container mt={"15px"}>
      <Grid container item lg={12} sx={{ pb: "20px" }}>
        {/* destination title section */}
        <Grid
          item
          lg={12}
          sx={{
            bgcolor: "#F2F7FF",
            py: "3px",
            px: "2px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            position: "relative",
          }}
        >
          <Box>
            <Button
              sx={{
                display: "flex",
                gap: "8px",
                width: "110px",
                padding: "2px 0",
                fontSize: "12.5px",
                py: "3px",
                fontWeight: 600,
                color: "var(--mate-black)",
              }}
            >
              {city?.departure}
              <AirplanIcon
                style={{
                  height: "14px",
                  width: "14px",
                  fill: "var(--mate-black)",
                }}
              />
              {city?.arrival}
            </Button>
            {isMobile && (
              <Typography
                sx={{ color: "#9a9c9f", fontSize: "11px", ml: "17px" }}
              >
                {moment(city?.departureDate, "YYYY-MM-DD")?.format(
                  "D MMM dddd"
                )}
              </Typography>
            )}
          </Box>

          <Box>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {!isMobile && (
                <>
                  <VerticalLine />
                  <Typography sx={{ color: "#9a9c9f", fontSize: "12.5px" }}>
                    {moment(city?.departureDate, "YYYY-MM-DD")?.format(
                      "D MMM dddd"
                    )}
                  </Typography>
                </>
              )}

              {city?.elapsedLayOverTime && index > 0 ? (
                <>
                  <VerticalLine />
                  <Typography sx={{ color: "#9a9c9f", fontSize: "12px" }}>
                    {city?.elapsedLayOverTime} Connecting time at{" "}
                    {city?.departure}
                  </Typography>
                </>
              ) : (
                <>
                  {transit.length > 0 && index > 0 ? (
                    <>
                      <VerticalLine />
                      <Typography sx={{ color: "#9a9c9f", fontSize: "12px" }}>
                        {`${
                          transit[toggleSegments]?.[index - 1]?.transit
                        } Connecting time at ${city?.departure}`}
                      </Typography>
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}

              {city?.visa && index > 0 && index < currentCity.length - 1 && (
                <>
                  <VerticalLine />
                  <Tooltip title={city?.visa}>
                    <Typography
                      sx={{
                        color: "var(--secondary-color)",
                        fontSize: "12px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      {city?.arrivalCountryName} Transit Visa Required
                    </Typography>
                  </Tooltip>
                </>
              )}
              {hasItineraryIndex && (
                <Typography
                  sx={{
                    color: "green",
                    fontSize: "12px",
                    marginLeft: "5px",
                  }}
                >
                  (Refund Requested)
                </Typography>
              )}
            </Box>
            {isMobile && (
              <Typography
                sx={{
                  color: "#9a9c9f",
                  fontSize: "12px",
                  ml: "16px",
                  visibility: "hidden",
                }}
              >
                Dummy Text
              </Typography>
            )}
          </Box>

          {/* {index === 0 && (
            <Box sx={{ position: "absolute", right: "15px" }}>
              <Button
                onClick={() => setShowAnimatedView(index)}
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
                Show Animated View
              </Button>
            </Box>
          )} */}
        </Grid>

        <Grid
          container
          item
          xs={12}
          lg={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 2 },
          }}
        >
          <Grid container item lg={12} xs={12}>
            <Grid
              item
              lg={12}
              xs={12}
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                py: "10px",
              }}
            >
              {!isMobile ? (
                <>
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <FlightPlaneCard city={city} flightData={flightData} />
                  </Box>
                </>
              ) : (
                <>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${city?.marketingCarrier}.png`}
                        width="39px"
                        height="39px"
                        alt="flight1"
                      />
                      <Typography
                        sx={{
                          color: "var(--mate-black)",
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {city?.marketingCarrierName}
                      </Typography>
                    </Box>
                    <FlightPlaneCard city={city} flightData={flightData} />
                  </Box>
                </>
              )}
            </Grid>

            {/* // TODO:: Condition for showing hidden Stops */}
            <Grid container item lg={12}>
              <Grid item lg={4.25} xs={12} sx={{ mt: "10px" }}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "var(--secondary-color)",
                  }}
                >
                  {moment(city?.departureTime, "HH:mm:ss")?.format("HH:mm")}{" "}
                  {/* {city?.departureTime} */}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12.5px",
                    fontWeight: "500",
                    color: "#9a9c9f",
                  }}
                >
                  <span>{moment(city?.departureDate).format("dddd")}</span>
                  {city?.departureDayStatus && (
                    <span style={{ fontWeight: 600 }}>
                      - {city?.departureDayStatus} -
                    </span>
                  )}
                  <span>
                    {moment(city?.departureDate).format("Do MMMM YYYY")}
                  </span>
                </Typography>
                <Typography
                  sx={{
                    color: "var(--mate-black)",
                    fontSize: "12.5px",
                    fontWeight: "500",
                    pt: "2px",
                  }}
                >
                  {city?.departure} - {city?.departureCityName} -{" "}
                  {city?.departureAirport}
                  <span style={{ color: "var(--primary-color)" }}>
                    {(city?.dTerminal || city?.departureTerminal) && ","}{" "}
                    {city?.dTerminal || city?.departureTerminal}
                  </span>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  <img
                    src={`https://flagcdn.com/w320/${city?.departureCountryCode?.toLowerCase()}.png`}
                    alt={city?.departureCountryCode}
                    style={{ height: "12px", width: "18px" }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12.5px",
                      fontWeight: 500,
                      color: "#9a9c9f",
                      textTransform: "capitalize",
                    }}
                  >
                    {city?.departureCountryName?.toLowerCase()}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                lg={3.5}
                xs={12}
                sx={{
                  mt: "15px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: { xs: "flex-end", lg: "center" },
                  alignItems: { xs: "flex-end", lg: "center" },
                  pr: { lg: "0px", xs: "15px" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <CurvedPlane />
                  <Typography sx={{ fontSize: "12.5px", mt: "-.3rem" }}>
                    <span style={{ color: "var(--primary-color)" }}>
                      {city?.elapsedLayOverTime || city?.flightDuration}
                    </span>
                    {"  "}
                    {!show && city?.totalMilesFlown && (
                      <span style={{ color: "var(--secondary-color)" }}>
                        &nbsp;& {city?.totalMilesFlown} Miles
                      </span>
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4.25} sx={{ mt: "10px" }}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "var(--secondary-color)",
                  }}
                >
                  {moment(city?.arrivalTime, "HH:mm:ss")?.format("HH:mm")}{" "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12.5px",
                    fontWeight: "500",
                    color: "#9a9c9f",
                  }}
                >
                  <span>{moment(city?.arrivalDate).format("dddd ")}</span>
                  {city?.arrivalDayStatus && (
                    <span
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      - {city?.arrivalDayStatus} -
                    </span>
                  )}
                  <span>
                    {moment(city?.arrivalDate).format(" Do MMMM YYYY")}
                  </span>
                </Typography>
                <Typography
                  sx={{
                    color: "var(--mate-black)",
                    fontSize: "12.5px",
                    fontWeight: "500",
                    pt: "2px",
                  }}
                >
                  {city?.arrival} - {city?.arrivalCityName} -{" "}
                  {city?.arrivalAirport}
                  <span style={{ color: "var(--primary-color)" }}>
                    {(city?.aTerminal || city?.arrivalTerminal) && ","}{" "}
                    {city?.aTerminal || city?.arrivalTerminal}
                  </span>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  <img
                    src={`https://flagcdn.com/w320/${city?.arrivalCountryCode?.toLowerCase()}.png`}
                    alt={city?.arrivalCountryCode}
                    style={{ height: "12px", width: "18px" }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12.5px",
                      fontWeight: 500,
                      color: "#9a9c9f",
                      textTransform: "capitalize",
                    }}
                  >
                    {city?.arrivalCountryName?.toLowerCase()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const VerticalLine = () => {
  return (
    <Box
      sx={{
        width: "1px",
        height: "20px",
        bgcolor: "#9a9c9f",
      }}
    ></Box>
  );
};

export default FlightDetailsCard;
