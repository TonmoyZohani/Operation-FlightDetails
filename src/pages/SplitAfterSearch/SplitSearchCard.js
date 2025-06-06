import { Box, Grid, Tooltip, Typography, Zoom } from "@mui/material";
import moment from "moment";
import {
  CustomFlightTooltip,
  singleCardBoxStyle,
} from "../../component/FlightAfterSearch/SingleFlightCard";
import BaggageTooltip from "../../component/FlightAfterSearch/BaggageTooltip";
import { FlightDetailsTooltip } from "../../component/FlightAfterSearch/FlightInfoCard";

const SplitSearchCard = ({
  flightData,
  flightAfterSearch,
  filterPriceValue,
  filterValue,
  firstValue,
  handleSelectedFlight,
  selectedFlight,
}) => {
  const cities = flightData?.cityCount?.flat();
  const firstSeg = cities[0] || {};
  const lastSeg = cities?.at(cities?.length - 1) || {};
  const isSelected = selectedFlight?.uuid === flightData?.uuid;

  return (
    <Box
      onClick={() => {
        handleSelectedFlight(flightData);
      }}
      sx={{
        bgcolor: "white",
        p: "15px",
        pb: 1,
        width: "100%",
        cursor: "pointer",
        border: "2px solid",
        borderRadius: 2,
        borderColor: isSelected ? "var(--primary-color)" : "#fff",
        ":hover": {
          borderColor: isSelected ? "var(--primary-color)" : "var(--border)",
        },
      }}
    >
      {/* Airline name and Price area */}
      <Box sx={{ ...alignCenter, justifyContent: "space-between" }}>
        <Box sx={{ ...alignCenter, gap: "4px" }}>
          <Typography
            sx={{
              color: "var(--secondary-color)",
              fontWeight: "500",
              fontSize: "12px",
              lineHeight: "1.2",
            }}
          >
            {flightData?.carrierName}
          </Typography>
          <VerticalLine />

          {cities.map((city, i) => (
            <Typography
              key={i}
              sx={{ fontSize: "12px", color: "var(--gray)", lineHeight: "0" }}
            >
              {city?.marketingCarrier}-{city?.marketingFlight}
              {i < cities.length - 1 && " &"}
            </Typography>
          ))}
        </Box>

        {(firstSeg?.availableSeats || firstSeg?.availableSeats === 0) && (
          <Typography
            sx={{
              color: "#FFAC1C",
              fontWeight: "500",
              fontSize: "12px",
              lineHeight: "1.2",
            }}
          >
            {firstSeg?.availableSeats} Seats Available
          </Typography>
        )}
      </Box>

      {/* Itenary Cards */}
      <Grid container mt={2}>
        <Grid item md={5.25}>
          <IternaryInfoCard
            label={"Departure"}
            time={firstSeg?.departureTime}
            cityName={firstSeg?.departureCityName}
            date={firstSeg?.departureDate}
            status={firstSeg?.departureDayStatus}
            flightData={flightData}
          />
        </Grid>
        <Grid item md={2.5}>
          {cities?.length > 1 ? (
            <CustomFlightTooltip
              placement="bottom"
              TransitionComponent={Zoom}
              title={
                <FlightDetailsTooltip
                  cities={cities}
                  flightData={flightData}
                  index={0}
                />
              }
            >
              <Box>
                <FlightDurationAndTransitTime cities={cities} />
              </Box>
            </CustomFlightTooltip>
          ) : (
            <FlightDurationAndTransitTime cities={cities} />
          )}
        </Grid>
        <Grid item md={4.25}>
          <IternaryInfoCard
            label={"Arrival"}
            time={lastSeg?.arrivalTime}
            cityName={lastSeg?.arrivalCityName}
            date={lastSeg?.arrivalDate}
            status={lastSeg?.arrivalDayStatus}
            flightData={flightData}
          />
        </Grid>
      </Grid>

      {/* Card footer and Price */}

      <Grid
        container
        mt={2}
        pt={1.5}
        sx={{ alignItems: "center", borderTop: "1px solid #E9E9E9" }}
      >
        <Grid item md={9.25}>
          <Box sx={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
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
              <Box
                sx={cheapBox(flightData?.autoReissue ? "#FFEDF1" : "#E8FFF3")}
              >
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

        <Grid item md={2.75}>
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
                fontSize: "18px",
                color: "var(--mate-black)",
                fontWeight: "500",
              }}
            >
              {flightData?.agentPrice?.toLocaleString("en-IN")} BDT
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const IternaryInfoCard = ({
  label,
  time,
  cityName,
  date,
  status,
  flightData,
}) => {
  return (
    <Box
      sx={{
        ...alignCenter,
        gap: 1.2,
        justifyContent: label === "Arrival" ? "end" : "start",
      }}
    >
      {label === "Departure" && (
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
      )}

      <Box
        sx={{
          textAlign: label === "Arrival" ? "right" : "left",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            color: "var(--secondary-color)",
            fontWeight: "600",
          }}
        >
          {moment(time, "HH:mm:ss").format("HH:mm")}
          &nbsp;
          <span style={{ color: "#444542" }}>{cityName}</span>
        </Typography>

        <Typography
          noWrap
          sx={{ fontSize: "12px", color: "var(--mate-black)" }}
        >
          <span>{moment(date).format("ddd")}</span>
          {status && (
            <span style={{ fontWeight: 600 }}> - {status} </span>
          )}- <span>{moment(date).format("DD-MMM-YYYY")}</span>
        </Typography>
      </Box>
    </Box>
  );
};

const FlightDurationAndTransitTime = ({ cities }) => {
  return (
    <Box
      sx={{
        ...alignCenter,
        flexDirection: "column",
        gap: 1,
        justifyContent: "end",
        height: "90%",
      }}
    >
      <img
        src={`https://storage.googleapis.com/flyfar-user-document-bucket/${cities.length === 1 ? "nonStop" : cities.length === 2 ? "1Stop" : cities.length === 3 ? "2Stop" : cities.length === 4 ? "4Stop" : ""}.png`}
        style={{ width: "100%" }}
        alt=""
      />
      <Typography
        sx={{
          fontSize: "12px",
          color: "var(--secondary-color)",
          textAlign: "center",
        }}
      >
        {cities[0]?.totalFlightDuration}{" "}
        {cities?.length === 1
          ? ""
          : cities?.length > 1
            ? "& " + (cities?.length - 1) + " Stops"
            : ""}
      </Typography>
    </Box>
  );
};

export const cheapBox = (bgcolor) => ({
  ...singleCardBoxStyle,
  bgcolor,
  cursor: "pointer",
});

export const cheapText = { fontSize: "12px", fontWeight: 600 };

const alignCenter = { display: "flex", alignItems: "center" };

const VerticalLine = () => {
  return <Box sx={{ width: "1px", height: "17px", bgcolor: "#9a9c9f" }}></Box>;
};

export default SplitSearchCard;
