import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import moment from "moment";
import "./FlightAfterSearch.css";
import segment1Anim from "../../assets/D1_1-ezgif.com-crop.gif";
import segment2Anim from "../../assets/D2-ezgif.com-crop.gif";
import segment3Anim from "../../assets/D3-ezgif.com-crop.gif";
import segment4Anim from "../../assets/D4-ezgif.com-crop.gif";
import { CustomFlightTooltip } from "./SingleFlightCard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getDayDifference } from "../../utils/functions";

const FlightInfoCard = ({ flightData, cities, index }) => {
  const uniqueArrByCode = [
    ...new Map(cities.map((item) => [item.marketingCarrier, item])).values(),
  ];

  return (
    <Grid container>
      <Grid
        container
        item
        lg={12}
        sx={{ px: "15px", py: "15px", position: "relative" }}
      >
        <Grid item lg={2.8}>
          <Box sx={{ display: "flex" }}>
            {/* {filterValue?.fastest &&
              firstValue === flightData?.uuid &&
              index === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    borderRadius: "4px 0px 0px 0px",
                    top: 0,
                    left:
                      (filterPriceValue?.minPrice === flightData?.agentPrice ||
                        filterPriceValue?.maxPrice ===
                          flightData?.agentPrice) &&
                      filterValue?.earliest
                        ? 170
                        : filterValue?.fastest && filterValue?.earliest
                          ? 85
                          : filterPriceValue?.minPrice ===
                                flightData?.agentPrice ||
                              filterPriceValue?.maxPrice ===
                                flightData?.agentPrice
                            ? 85
                            : 0,
                    backgroundColor: "#f24300",
                    clipPath: "polygon(0 0, 100% 0%, 90% 100%, 0% 100%)",
                    borderRadius: "4px 0px 0px 0px",
                  }}
                  className={"lowest-price-badge shine-effect"}
                >
                  <Box
                    className="badge-tail"
                    sx={{
                      bgcolor: "#AA2E00",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      letterSpacing: "1.2px",
                      pl: "10px",
                    }}
                  >
                    Fastest
                  </Typography>
                </Box>
              )}

            {filterValue?.earliest &&
              firstValue === flightData?.uuid &&
              index === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    borderRadius: "4px 0px 0px 0px",
                    top: 0,
                    left:
                      filterPriceValue?.minPrice === flightData?.agentPrice ||
                      filterPriceValue?.maxPrice === flightData?.agentPrice
                        ? 85
                        : 0,
                    backgroundColor: "#00a9f2",
                    clipPath: "polygon(0 0, 100% 0%, 90% 100%, 0% 100%)",
                    borderRadius: "4px 0px 0px 0px",
                  }}
                  className={"lowest-price-badge shine-effect"}
                >
                  <Box
                    className="badge-tail"
                    sx={{
                      bgcolor: "#AA2E00",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      letterSpacing: "1.2px",
                      pl: "10px",
                    }}
                  >
                    Earilest
                  </Typography>
                </Box>
              )}

            {(filterPriceValue?.minPrice === flightData?.agentPrice ||
              filterPriceValue?.maxPrice === flightData?.agentPrice) &&
              index === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: "4px 0px 0px 0px",
                    clipPath: "polygon(0 0, 100% 0%, 90% 100%, 0% 100%)",
                    backgroundColor:
                      filterPriceValue?.minPrice === flightData?.agentPrice
                        ? "#9900f2"
                        : "#F6B119",
                  }}
                  className={"lowest-price-badge shine-effect"}
                >
                  <Typography sx={{ fontSize: "12px", letterSpacing: "1.2px" }}>
                    {filterPriceValue?.minPrice === flightData?.agentPrice
                      ? "Cheapest"
                      : "Expensive"}
                  </Typography>
                </Box>
              )} */}

            {uniqueArrByCode?.map((code, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: "white",
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  ml: index === 0 ? "-5px" : "-12px",
                }}
              >
                <img
                  src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${code?.marketingCarrier}.png`}
                  width="45px"
                  height="45px"
                  alt="flight1"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://storage.googleapis.com/erp-document-bucket/alternetFlightIcon.png";
                  }}
                />
              </Box>
            ))}
          </Box>

          <Typography
            fontSize={"13px"}
            sx={{ color: "var(--secondary-color)", fontWeight: "500" }}
          >
            {uniqueArrByCode?.map((code, i) => (
              <span key={i}>
                {i > 0 && (
                  <span style={{ color: "var(--primary-color)" }}>X</span>
                )}{" "}
                {code?.marketingCarrierName}
              </span>
            ))}
          </Typography>
          <Typography
            sx={{
              fontSize: "11px",
              color: "var(--gray)",
              fontWeight: "400",
            }}
          >
            {/* {cities.map((city, i) => {
              return (
                <span key={i} style={{ marginRight: "5px" }}>
                  {(i > 0) & " & "}
                  {city?.marketingCarrier}-{city?.marketingFlight}
                </span>
              );
            })} */}

            {cities.map((city, i) => (
              <span key={i} style={{ marginRight: "4px" }}>
                {city?.marketingCarrier}-{city?.marketingFlight}
                {i < cities.length - 1 && " &"}
              </span>
            ))}
          </Typography>
        </Grid>
        <Grid item lg={2.9} className="flight-info">
          <Typography sx={{ color: "var(--light-gray)", fontSize: "11px" }}>
            Departure
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              color: "var(--secondary-color)",
              fontWeight: "500",
              pr: "5px",
            }}
          >
            {moment(cities[0]?.departureTime, "HH:mm:ss").format("HH:mm")}&nbsp;
            <span style={{ color: "#444542" }}>
              {cities[0]?.departureCityName}
            </span>
          </Typography>
          <p className="airport-info" style={{ fontSize: "12.5px" }}>
            {cities[0]?.departureAirport}{" "}
            {cities[0]?.departure !== flightData?.route?.[index]?.departure ? (
              <Tooltip title="Alternative Airport">
                <span
                  style={{ fontWeight: 600, color: "var(--secondary-color)" }}
                >
                  - {cities[0]?.departure}
                </span>
              </Tooltip>
            ) : (
              <span
                style={{ fontWeight: 600, color: "var(--secondary-color)" }}
              >
                - {cities[0]?.departure}
              </span>
            )}
          </p>

          <p className="date-info" style={{ fontSize: "12.5px" }}>
            <span>{moment(cities[0]?.departureDate).format("dddd")}</span>
            {cities?.[0]?.departureDayStatus && (
              <span style={{ fontWeight: 600 }}>
                {" "}
                - {cities?.[0]?.departureDayStatus} -{" "}
              </span>
            )}
            <span>
              {moment(cities[0]?.departureDate).format("Do MMMM YYYY")}
            </span>
          </p>
        </Grid>
        <Grid
          item
          lg={3.3}
          sx={{
            display: "flex",
            alignItems: "center",
            paddingRight: "15px",
            height: "85px",
          }}
        >
          {cities.length > 1 ? (
            <CustomFlightTooltip
              placement="bottom"
              TransitionComponent={Zoom}
              title={
                <FlightDetailsTooltip
                  cities={cities}
                  flightData={flightData}
                  index={index}
                />
              }
            >
              <Box sx={{ cursor: "pointer" }}>
                <FlightDurationAndTransitTime
                  flightData={flightData}
                  cities={cities}
                  index={index}
                />
              </Box>
            </CustomFlightTooltip>
          ) : (
            <FlightDurationAndTransitTime
              flightData={flightData}
              cities={cities}
              index={index}
            />
          )}
        </Grid>
        <Grid item lg={2.9} sx={{ paddingLeft: "5px" }} className="flight-info">
          <Typography sx={{ color: "var(--light-gray)", fontSize: "11px" }}>
            Arrival
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              color: "var(--secondary-color)",
              fontWeight: "500",
            }}
          >
            {moment(cities[cities.length - 1]?.arrivalTime, "HH:mm:ss").format(
              "HH:mm"
            )}
            &nbsp;
            <span style={{ color: "#444542" }}>
              {cities[cities?.length - 1]?.arrivalCityName}
            </span>{" "}
            <span
              style={{
                fontSize: "13px",
                color: "var(--primary-color)",
                fontWeight: 600,
              }}
            >
              {getDayDifference(
                cities[0]?.departureDateTime,
                cities[cities.length - 1]?.arrivalDateTime
              )}
            </span>
          </Typography>

          <p className="airport-info" style={{ fontSize: "12.5px" }}>
            {cities[cities?.length - 1]?.arrivalAirport}{" "}
            {cities[cities?.length - 1]?.arrival !==
            flightData?.route?.[index]?.arrival ? (
              <Tooltip title="Alternative Airport">
                <span
                  style={{ fontWeight: 600, color: "var(--secondary-color)" }}
                >
                  - {cities[cities?.length - 1]?.arrival}
                </span>
              </Tooltip>
            ) : (
              <span
                style={{ fontWeight: 600, color: "var(--secondary-color)" }}
              >
                - {cities[cities?.length - 1]?.arrival}
              </span>
            )}
          </p>

          <p className="date-info" style={{ fontSize: "12.5px" }}>
            <span>
              {moment(cities[cities?.length - 1]?.arrivalDateTime).format(
                "dddd"
              )}
            </span>
            {cities?.[cities.length - 1]?.arrivalDayStatus && (
              <span style={{ fontWeight: 600 }}>
                {" "}
                - {cities?.[cities.length - 1]?.arrivalDayStatus} -{" "}
              </span>
            )}
            <span>
              {moment(cities[cities?.length - 1]?.arrivalDateTime).format(
                "Do MMMM YYYY"
              )}
            </span>{" "}
          </p>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const FlightDetailsTooltip = ({ cities, flightData, index }) => {
  return (
    <Box sx={{ width: "550px" }}>
      {cities?.map((city, i) => (
        <Box
          key={i}
          sx={{
            display:
              cities.length > 2
                ? (i === 0 || i === cities.length - 1) && "none"
                : i === 0 && "none",
            " .MuiTableCell-root": { fontSize: "12px" },
          }}
        >
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Airport</TableCell>
                  <TableCell sx={{ width: "20%", fontWeight: "bold" }}>
                    Arrival
                  </TableCell>
                  <TableCell sx={{ width: "15%", fontWeight: "bold" }}>
                    Transit
                  </TableCell>
                  <TableCell sx={{ width: "20%", fontWeight: "bold" }}>
                    Departure
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span style={{ color: "#140D36" }}>
                      {city?.departureCityName} ({city?.departureCityCode})
                    </span>
                    <br />
                    <span style={{ color: "var(--gray)" }}>
                      {city?.departureAirport}, {city?.departure}{" "}
                      {city?.dTerminal}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: "#140D36" }}>
                      {moment(cities[i - 1]?.arrivalTime, "HH:mm:ss").format(
                        "hh:mm A"
                      )}
                    </span>
                    <br />
                    <span style={{ color: "var(--gray)" }}>
                      {moment(cities[i - 1]?.arrivalDate).format(
                        "DD MMMM YYYY"
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: "#140D36" }}>
                      {flightData?.transit[index][i - 1]?.transit}
                    </span>
                  </TableCell>
                  <TableCell sx={{}}>
                    <span style={{ color: "#140D36" }}>
                      {moment(city?.departureTime, "HH:mm:ss").format(
                        "hh:mm A"
                      )}
                    </span>
                    <br />
                    <span style={{ color: "var(--gray)" }}>
                      {moment(city?.departureDate).format("DD MMMM YYYY")}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ display: cities.length < 3 && "none" }}>
                  <TableCell>
                    <span style={{ color: "#140D36" }}>
                      {city?.arrivalCityName} ({city?.arrivalCityCode})
                    </span>
                    <br />
                    <span style={{ color: "var(--gray)" }}>
                      {city?.arrivalAirport}, {city?.arrival} {city?.aTerminal}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: "#140D36" }}>
                      {moment(city?.arrivalTime, "HH:mm:ss").format("hh:mm A")}
                    </span>
                    <br />
                    <span style={{ color: "var(--gray)" }}>
                      {moment(city?.arrivalDate).format("DD MMMM YYYY")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: "#140D36" }}>
                      {flightData?.transit[index][i]?.transit}
                    </span>
                  </TableCell>
                  <TableCell sx={{}}>
                    <span style={{ color: "#140D36" }}>
                      {moment(cities[i + 1]?.departureTime, "HH:mm:ss").format(
                        "hh:mm A"
                      )}
                    </span>
                    <br />
                    <span style={{ color: "var(--gray)" }}>
                      {moment(cities[i + 1]?.departureDate).format(
                        "DD MMMM YYYY"
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

const FlightDurationAndTransitTime = ({ cities, flightData, index }) => {
  const totalMinutes = flightData?.transit[index]?.reduce((sum, item) => {
    const match = item.transit.match(/(\d+)H\s*(\d+)?Min?/);
    const hours = match ? parseInt(match[1]) || 0 : 0;
    const minutes = match && match[2] ? parseInt(match[2]) || 0 : 0;
    return sum + hours * 60 + minutes;
  }, 0);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const totalTransitTime = `${totalHours}H ${remainingMinutes}Min`;

  return (
    <Box px={1} sx={{ textAlign: "center" }}>
      <Typography sx={{ lineHeight: "1" }}>
        <span
          style={{
            color: "var(--primary-color)",
            fontSize: "10px",
            fontWeight: "600",
          }}
        >
          {cities[0]?.totalFlightDuration}
        </span>
        <span
          style={{
            color: "var(--secondary-color)",
            paddingLeft: "3px",
            fontSize: "10px",
            fontWeight: "600",
          }}
        >
          {cities?.length === 1
            ? "Non Stop"
            : cities?.length > 1
              ? cities?.length - 1 + " Stops"
              : ""}{" "}
          {/* {totalTransitTime} */}
        </span>
      </Typography>

      {cities?.length === 1 && (
        <img
          src={segment1Anim}
          alt="segment 1 airline gif"
          style={{ width: "100%" }}
        />
      )}

      {cities?.length === 2 && (
        <img
          src={segment2Anim}
          alt="segment 2 airline gif"
          style={{ width: "100%" }}
        />
      )}

      {cities?.length === 3 && (
        <img
          src={segment3Anim}
          alt="segment 3 airline gif"
          style={{ width: "100%" }}
        />
      )}

      {cities?.length > 3 && (
        <img
          src={segment4Anim}
          alt="segment 4 airline gif"
          style={{ width: "100%" }}
        />
      )}

      <Box
        sx={{
          width: cities.length === 3 ? "68%" : "75%",
          m: "-7px auto",
        }}
      >
        <Grid container>
          {cities?.slice(0, cities.length - 1).map((city, i, arr) => (
            <Grid md={12 / arr.length} item key={i}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "11.5px",
                    color: "var(--primary-color)",
                    fontWeight: "500",
                  }}
                >
                  {city?.arrivalCityCode}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {cities.length > 1 && flightData?.transit?.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1.6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              bgcolor: "#FAEEFF",
              width: "max-content",
              px: 1,
            }}
          >
            <AccessTimeIcon sx={{ fontSize: "12.5px", color: "#9E00E6" }} />
            <span
              style={{ fontSize: "12.5px", fontWeight: 600, color: "#9E00E6" }}
            >
              Transit: {totalTransitTime}
            </span>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FlightInfoCard;
