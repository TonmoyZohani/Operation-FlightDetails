import { ThemeProvider } from "@emotion/react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Checkbox, Grid, Stack } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MobileItineraryCard from "../../pages/Bookings/components/MobileItineraryCard";
import DynamicMuiTable from "../../shared/Tables/DynamicMuiTable";
import { BpCheckedIcon, BpIcon } from "../../shared/common/styles";
import { nextStepStyle } from "../../style/style";
import { theme } from "../../utils/theme";
import CustomAlert from "../Alert/CustomAlert";
import "./AirBooking.css";
import AncillariesModal from "./AncillariesModal";
import { getPassengerDetails } from "./BookingUtils";
import { nextStepper, selectTabStepper } from "./airbookingSlice";
import { removeAncillary } from "./components/ancillariesSlice";

const AncillariesInfo = ({ totalPassenger, flightData, isLoading }) => {
  const [clear, setClear] = useState(false);
  const flightBookingData = useSelector((state) => state.flightBooking);

  const { stepper } = flightBookingData;
  const dispatch = useDispatch();
  const passengerDetails = getPassengerDetails(totalPassenger);
  const [openIndex, setOpenIndex] = useState(0);
  const [openAnciIndex, setOpenAnciIndex] = useState(null);
  const [pax, setPax] = useState({});
  const [route, setRoute] = useState({});
  const ancillaries = useSelector((state) => state.ancillaries);

  const handleRemoveAncillary = async (index, pax, route, label) => {
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to make remove this ancillary!",
    });
    if (result?.isConfirmed) {
      dispatch(
        removeAncillary({
          index,
          pax,
          route,
          label,
        })
      );
    }
  };

  const handleOpenAnci = (index, pax, route, isAncillaries) => {
    setOpenAnciIndex(index);
    setPax(pax);
    setRoute(route);
    setClear(isAncillaries);
  };

  const itineraryColumns = [
    "Select",
    "Airlines",
    "Destination",
    "Stops",
    "Flight No",
    "Flight Date",
  ];

  const itineraryRows =
    flightData?.route?.map((route, index) => {
      const stops = flightData?.cityCount[index];
      const stopCount = stops.length - 1;
      const stopDescription =
        stopCount > 0
          ? `${stopCount} Stop${stopCount > 1 ? "s" : ""} via ${stops
              .slice(0, -1)
              .map((stop) => stop?.arrivalCityCode)
              .join(", ")}`
          : "Non-stop";

      return [
        "Jahidul Islam",
        stops[0]?.marketingCarrierName,
        `${route?.departure} - ${route?.arrival}`,
        stopDescription,
        `${stops[0]?.marketingCarrier} ${stops[0]?.marketingFlight}`,
        moment(stops[0]?.departureDate).format("DD MMM, YYYY"),
      ];
    }) || [];

  const getCellContent = (row, colIndex) => {
    if (colIndex === 0) {
      return (
        <Checkbox
          disableRipple
          checked={row[colIndex]}
          checkedIcon={<BpCheckedIcon color={"white"} />}
          icon={<BpIcon color={"white"} />}
        />
      );
    }
    return row[colIndex];
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ px: { xs: "5%", lg: 0 } }}>
        {passengerDetails?.map((passenger, outerIndex) => {
          const firstName =
            flightBookingData?.passengerData[passenger?.type?.toLowerCase()][
              outerIndex
            ]?.firstName;
          const lastName =
            flightBookingData?.passengerData[passenger?.type?.toLowerCase()][
              outerIndex
            ]?.lastName;

          const pax = {
            firstName,
            lastName,
          };

          return (
            <Box
              key={outerIndex}
              sx={{
                bgcolor: "#fff",
                borderRadius: "5px",
                mb: "10px",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  p: "12px 15px",
                }}
                onClick={() =>
                  setOpenIndex(openIndex === outerIndex ? null : outerIndex)
                }
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--secondary-color)",
                    fontWeight: "500",
                  }}
                >
                  <span style={{ textTransform: "uppercase" }}>
                    {" "}
                    {pax?.firstName} {pax?.lastName}
                  </span>{" "}
                  [ {passenger.type} {passenger.count} ]
                  {passenger.type === "Child" && (
                    <span
                      style={{
                        color: "var(--primary-color)",
                        fontSize: "12px",
                      }}
                    >
                      {" "}
                      [Age: {passenger.age}]
                    </span>
                  )}
                </Typography>

                <Box className="dropdown-class">
                  <ArrowDropDownIcon />
                </Box>
              </Box>
              <Collapse
                in={openIndex === outerIndex}
                timeout="auto"
                unmountOnExit
                sx={{ width: "100%", transition: "height 1s ease-in-out" }}
              >
                {flightData?.route.map((ro, index) => {
                  const route = {
                    departure: ro?.departure,
                    arrival: ro?.arrival,
                  };

                  const ancillariesData = ancillaries?.find(
                    (item) =>
                      item.index === index &&
                      item.route.departure === route.departure &&
                      item.route.arrival === route.arrival &&
                      item.pax.firstName === pax.firstName &&
                      item.pax.lastName === pax.lastName
                  );

                  const isAncillaries = Boolean(ancillariesData?.ancillaries);

                  return (
                    <Grid key={index} container sx={{ mb: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          bgcolor: "#fff",
                          p: "12px 15px",
                          display: {
                            xs: "none",
                            lg: "block",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            pb: "15px",
                          }}
                        >
                          {flightData?.tripType !== "multiCity"
                            ? `Flight Itinerary ${
                                index === 0 ? "Onward " : "Return "
                              }`
                            : `Flight Itinerary `}
                          <span
                            style={{
                              color: "var(--primary-color)",
                              fontWeight: 500,
                            }}
                          >
                            {ro?.departure}-{ro?.arrival}
                          </span>{" "}
                        </Typography>

                        <DynamicMuiTable
                          columns={itineraryColumns}
                          rows={[itineraryRows[index]]}
                          getCellContent={getCellContent}
                        />
                      </Grid>

                      {/* --- Mobile Itinerary Card start --- */}
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: {
                            xs: "block",
                            lg: "none",
                          },
                          px: 2,
                          mt: 1,
                        }}
                      >
                        <MobileItineraryCard
                          retriveData={flightData}
                          index={index}
                          route={ro}
                          isReissue={true}
                          isAncillaries={true}
                          bookingType="preBooking"
                        />
                      </Grid>
                      {/* --- Mobile Itinerary Card end --- */}

                      <Grid
                        item
                        xs={12}
                        sx={{
                          bgcolor: "#fff",
                          p: "12px 15px",
                        }}
                        key={index}
                      >
                        {ancillariesData?.ancillaries?.length > 0 && (
                          <>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: "500",
                                pb: "15px",
                              }}
                            >
                              {flightData?.tripType !== "multiCity"
                                ? `Flight Itinerary  ${
                                    index === 0 ? "Onward" : "Return"
                                  } Applied Ancillaries`
                                : `Flight Itinerary  ${ro?.departure}-${ro?.arrival} Applied Ancillaries`}{" "}
                            </Typography>

                            <Stack spacing={1} mb={2}>
                              {ancillariesData?.ancillaries?.map(
                                (ancillary, ancillaryIndex) => (
                                  <Box
                                    key={ancillaryIndex}
                                    sx={{
                                      border: "1px solid var(--border)",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      px: {
                                        xs: 1,
                                        sm: 2,
                                      },
                                      py: 1,
                                      borderRadius: "4px",
                                      position: "relative",
                                      width: "100%",
                                      height: "100%",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: {
                                          xs: "baseline",
                                          lg: "baseline",
                                        },
                                        gap: 1,
                                        cursor: "pointer",
                                        width: "100%",
                                      }}
                                      onClick={() =>
                                        handleOpenAnci(index, pax, route)
                                      }
                                    >
                                      {/* Label Section */}
                                      <Typography
                                        sx={{
                                          width: {
                                            xs: "85px",
                                            sm: "120px",
                                            md: "150px",
                                            lg: "175px",
                                          },
                                          flexShrink: 0,
                                          textTransform: "uppercase",
                                          fontSize: {
                                            xs: ".7rem",
                                            lg: "0.85rem",
                                          },
                                          fontWeight: 600,
                                          textAlign: {
                                            xs: "left",
                                            sm: "left",
                                          },
                                        }}
                                      >
                                        {ancillary?.label}
                                      </Typography>

                                      <Typography>:</Typography>

                                      {/* Value Section */}
                                      <Typography
                                        sx={{
                                          textTransform: "uppercase",
                                          fontSize: {
                                            xs: ".7rem",
                                            lg: "0.85rem",
                                          },
                                          fontWeight: 500,
                                          color: "#4D4B4B",
                                          textAlign: {
                                            xs: "left",
                                            sm: "left",
                                          },
                                        }}
                                      >
                                        {ancillary?.value}
                                      </Typography>
                                    </Box>

                                    {/* Delete Icon */}
                                    <Box
                                      sx={{
                                        cursor: "pointer",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                      onClick={() =>
                                        handleRemoveAncillary(
                                          index,
                                          pax,
                                          route,
                                          ancillary?.label,
                                          isAncillaries
                                        )
                                      }
                                    >
                                      <DeleteIcon
                                        sx={{
                                          color: "var(--primary-color)",
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                )
                              )}
                            </Stack>
                          </>
                        )}

                        <Box sx={{ display: "flex", justifyContent: "end" }}>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: "500",
                              pb: "15px",
                              color: "var(--primary-color)",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() => handleOpenAnci(index, pax, route)}
                          >
                            Add New Ancillaries From List
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  );
                })}
              </Collapse>
            </Box>
          );
        })}

        {stepper === 2 && (
          <Button
            disabled={isLoading}
            sx={{
              ...nextStepStyle,
              ":hover": { bgcolor: "var(--primary-color)" },
              zIndex: 10,
              width: { xs: "100%", lg: "100%" },
              mx: "auto",
            }}
            onClick={() => dispatch(nextStepper())}
          >
            {ancillaries?.flatMap((item) => item?.ancillaries)?.length > 0
              ? "save"
              : "skip"}{" "}
            AND PROCEED TO NEXT STEP
          </Button>
        )}

        {/* {stepper !== 2 && (
          <Button
            disabled={isLoading}
            sx={{
              ...nextStepStyle,
              backgroundColor: "#525371",
              zIndex: 9999,
              ":hover": { bgcolor: "#525371" },
            }}
            onClick={() => dispatch(selectTabStepper(3))}
          >
            GO TO NEXT STEP
          </Button>
        )} */}
      </Box>
      <AncillariesModal
        openAnciIndex={openAnciIndex}
        setOpenAnciIndex={setOpenAnciIndex}
        pax={pax}
        route={route}
        clear={clear}
        setClear={setClear}
      />
    </ThemeProvider>
  );
};

export default AncillariesInfo;
