import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { sharedInputStyles } from "../../shared/common/styles";
import { nextStepStyle } from "../../style/style";
import FlightDetailsSection from "../FlightAfterSearch/FlightDetailsSection";
import {
  nextStepperPassenger,
  setClientContact,
  updateBookingOptions,
  updateStepper,
} from "./airbookingSlice";
import "./BookingInformation.css";
import PassengerBox from "./PassengerBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const BookingInformation = ({
  flightData,
  searchType,
  totalPassenger,
  setIsRefetch,
  oldFlightData,
  fareRules,
  segmentsList,
  cabin,
  selectedBrand,
  reissuePassengers,
  paxDetails,
  bookingId,
  cachedKey,
  flightAfterSearch,
  isLoading,
  airPriceFlag,
  partialChargeData,
  selectedSeats,
  advanceSearchResult,
  splitFlightArr,
  crrItenary,
  flightBrand,
}) => {
  const dispatch = useDispatch();
  const agentData = useOutletContext();
  const flightBookingData = useSelector((state) => state.flightBooking);
  const { isTermsCondition, clientContact, stepper } = flightBookingData;
  const [expanded, setExpanded] = useState(false);

  // console.log("Flight Brands in Booking Information", flightBrand);
  // console.log("Fare Rules in Booking Information", fareRules);

  const handleStepper = () => {
    const updatedTotalPassenger = {
      ...totalPassenger,
      childCount: totalPassenger.childCount.length,
    };

    const stepperData = {
      updatedTotalPassenger,
      journeyType: flightData?.journeyType,
      immediateIssue: flightData?.immediateIssue,
      showPassport:
        agentData?.agentData?.agentCms?.eligibilityCms
          ?.passportRequiredForBooking,
      showVisa:
        agentData?.agentData?.agentCms?.eligibilityCms?.visaRequiredForBooking,
    };
    dispatch(updateStepper(stepperData));
  };

  const handleNextStepper = (step) => {
    const updatedTotalPassenger = {
      ...totalPassenger,
      childCount: totalPassenger.childCount.length,
    };

    const stepperData = {
      updatedTotalPassenger,
      journeyType: flightData?.journeyType,
      immediateIssue: flightData?.immediateIssue,
      step,
      showPassport:
        agentData?.agentData?.agentCms?.eligibilityCms
          ?.passportRequiredForBooking,
      showVisa:
        agentData?.agentData?.agentCms?.eligibilityCms?.visaRequiredForBooking,
    };

    dispatch(nextStepperPassenger(stepperData));
  };

  useEffect(() => {
    setExpanded(!!airPriceFlag);
  }, [airPriceFlag]);

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rounded" width="100%" height={45} />
      ) : !isLoading && flightData ? (
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded((prev) => !prev)}
          sx={{
            bgcolor: "#fff",
            borderRadius: "4px",
            display: { xs: "none", lg: "block" },
            boxShadow: "none",
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              <Box className="dropdown-class">
                <ArrowDropDownIcon />
              </Box>
            }
            aria-controls="flight-content"
            id="flight-header"
            sx={{
              px: 2,
              py: 0,
              minHeight: 36,
              "& .MuiAccordionSummary-content": {
                my: 0.5,
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "15px",
                color: "#3C4258",
              }}
            >
              {flightAfterSearch === "reissue-search"
                ? "Reissue Flight & Fare Information"
                : "Flight & Fare Information"}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 2, pb: 2 }}>
            <FlightDetailsSection
              flightData={flightData}
              searchType={searchType}
              setIsRefetch={setIsRefetch}
              oldFlightData={oldFlightData}
              fareRules={fareRules}
              segmentsList={segmentsList}
              totalPassenger={totalPassenger}
              cabin={cabin}
              selectedBrand={selectedBrand}
              flightAfterSearch={flightAfterSearch}
              bookingData={
                flightAfterSearch === "reissue-search"
                  ? "reissue booking"
                  : "current booking"
              }
              fareCard={"afterFare"}
              tabType={"selectfare"}
              partialChargeData={partialChargeData}
              advancedSelectedSeats={selectedSeats}
              advanceSearchResult={advanceSearchResult}
              splitFlightArr={splitFlightArr}
              passingItenary={crrItenary}
              flightBrand={flightBrand}
            />
          </AccordionDetails>
        </Accordion>
      ) : null}

      <Box sx={{ mt: { xs: 0, lg: "15px" } }}>
        <>
          {/* Passenger Box */}
          <PassengerBox
            flightData={oldFlightData[crrItenary]}
            totalPassenger={totalPassenger}
            reissuePassengers={reissuePassengers}
            paxDetails={paxDetails}
            bookingId={bookingId}
            cachedKey={cachedKey}
            flightAfterSearch={flightAfterSearch}
          />

          {/* Communication Box */}
          <Box
            sx={{
              width: { xs: "90%", lg: "100%" },
              bgcolor: "#fff",
              borderRadius: "5px",
              mb: "15px",
              mx: "auto",
            }}
          >
            <Grid container sx={{ borderRadius: "5px", p: "1rem", mt: "15px" }}>
              <Grid item xs={12} sx={{ mb: "20px" }}>
                <Typography
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Client contact details for airlines to passenger direct
                  communications
                </Typography>
                <Typography
                  sx={{
                    color: "var(--primary-gray)",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  (This is an important step because the airlines will
                  communicate all the flight related information to the
                  passenger directly on this number)
                </Typography>
              </Grid>

              <Grid
                item
                lg={4}
                xs={12}
                sx={{
                  mr: { lg: "20px", xs: "0px" },
                  mb: { lg: "0px", xs: "15px" },
                }}
              >
                <TextField
                  id="outlined-email"
                  label={
                    <span style={{ fontFamily: "Mukta, sans-serif" }}>
                      Passenger Email
                    </span>
                  }
                  variant="outlined"
                  size="small"
                  sx={sharedInputStyles}
                  value={clientContact.clientEmail || ""}
                  onChange={(e) =>
                    dispatch(setClientContact({ clientEmail: e.target.value }))
                  }
                  type="email"
                  autoComplete="new-email"
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <PhoneInput
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    fontFamily: "Mukta, sans-serif",
                  }}
                  value={clientContact.clientPhoneNumber || ""}
                  country={"bd"}
                  countryCodeEditable={false}
                  onChange={(phone) =>
                    dispatch(setClientContact({ clientPhoneNumber: phone }))
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {stepper === 1 && (
            <Button
              disabled={isLoading}
              sx={{
                ...nextStepStyle,
                ":hover": { bgcolor: "var(--primary-color)" },
                zIndex: 10,
                width: { xs: "90%", lg: "100%" },
                mx: "auto",
              }}
              onClick={() => handleStepper()}
            >
              SUBMIT AND GO TO NEXT STEP
            </Button>
          )}

          {stepper !== 1 && (
            <Button
              disabled={isLoading}
              sx={{
                ...nextStepStyle,
                bgcolor: "#525371",
                zIndex: 10,
                ":hover": { bgcolor: "#525371" },
              }}
              onClick={() => handleNextStepper(2)}
              // onClick={() => dispatch(selectTabStepper(2))}
            >
              GO TO NEXT STEP
            </Button>
          )}
        </>
      </Box>
    </>
  );
};

export default BookingInformation;
