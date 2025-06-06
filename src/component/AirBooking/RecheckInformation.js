import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Button, Collapse, Grid, Modal, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as AirplanIcon } from "../../images/svg/airplane.svg";
import { sharedInputStyles } from "../../shared/common/styles";
import { headerStyle, nextStepStyle } from "../../style/style";
import FlightDetailsSection from "../FlightAfterSearch/FlightDetailsSection";
import ImageUploadFile from "../Modal/ImageUploadFile";
import { options } from "../Register/Nationality";
import "./AirBooking.css";
import { nextStepper, selectTabStepper } from "./airbookingSlice";
import { getPassengerDetails } from "./BookingUtils";
import { useOutletContext } from "react-router-dom";

export const itemStyle = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
};

export const renderItem = (label, value) => (
  <Grid
    container
    item={12}
    sx={{ height: "40px", borderBottom: "1px solid #D9D9D9" }}
  >
    <Grid item lg={4} xs={6} sx={{ ...itemStyle, pl: "9px" }}>
      <Typography sx={{ color: "#9C9797", fontSize: "0.87rem" }}>
        {label}
      </Typography>
    </Grid>
    <Grid item lg={8} xs={6} sx={{ ...itemStyle }}>
      <Typography
        sx={{
          color: "#000000",
          fontSize: "0.87rem",
          textTransform: "uppercase",
        }}
      >
        {value}
      </Typography>
    </Grid>
  </Grid>
);

export const formatTripType = (type) => {
  const tripTypeMap = {
    oneWay: "One Way",
    return: "Round Way",
    multiCity: "Multi City",
  };

  return tripTypeMap[type] || type;
};

const RecheckInformation = ({
  flightData,
  searchType,
  totalPassenger,
  setIsRefetch,
  oldFlightData,
  fareRules,
  segmentsList,
  cabin,
  selectedBrand,
  isLoading,
  flightAfterSearch,
  partialChargeData,
  crrItenary,
  splitFlightArr,
}) => {
  const dispatch = useDispatch();
  const agentData = useOutletContext();
  const [openIndex, setOpenIndex] = useState(0);
  const flightBookingData = useSelector((state) => state.flightBooking);
  const { passengerData, stepper } = flightBookingData;
  const passengerDetails = getPassengerDetails(totalPassenger);
  const cityCount = flightData[crrItenary]?.cityCount.flat();

  const getPrefixes = (passengerType) => {
    if (passengerType.toLowerCase() === "adult") {
      return ["MR", "MS"];
    } else {
      return ["MASTER", "MISS"];
    }
  };

  const [sections] = useState([
    { wheelChairOpen: true, mealsOpen: false, vipOpen: false },
  ]);

  const getPassengerData = (passenger, field) => {
    const passengerInfo =
      passenger.type === "Adult"
        ? passengerData.adult[passenger.count - 1]
        : passenger.type === "Child"
          ? passengerData.child[passenger.count - 1]
          : passengerData.infant[passenger.count - 1];

    if (!passengerInfo) return "";

    if (field === "passportNation") {
      return (
        options.find(
          (option) =>
            option.name === passengerInfo?.passportNation?.name ||
            option.code === passengerInfo?.passportNation?.code
        )?.name || null
      );
    }

    return passengerInfo[field] || "";
  };

  const capitalizeLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // console.log(flightData);

  return (
    <Box>
      <Box
        sx={{
          width: {
            xs: "90%",
            lg: "100%",
          },

          bgcolor: "#fff",
          borderRadius: 1,
          padding: "12px 17px",
          // mt: { xs: 2, lg: 0 },
          mb: 2,
          mx: "auto",
        }}
      >
        {/* destination title */}
        <Typography
          sx={{ fontSize: "17px", fontWeight: "600", color: "#141E22" }}
        >
          <span style={{ color: "var(--primary-color)" }}>
            {(() => {
              const routes = flightData[crrItenary]?.route || [];
              const length = routes.length;
              if (length === 1) {
                return (
                  <>
                    {routes[0]?.departure}
                    <AirplanIcon className="airplane-icon" />
                    {routes[0]?.arrival}
                  </>
                );
              } else if (length === 2) {
                return (
                  <>
                    {routes[0]?.departure}
                    <AirplanIcon className="airplane-icon" />
                    {routes[1]?.departure}
                    <AirplanIcon className="airplane-icon" />
                    {routes[1]?.arrival}
                  </>
                );
              } else if (length > 2) {
                return (
                  <>
                    {routes[0]?.departure}
                    <AirplanIcon className="airplane-icon" />
                    {routes[0]?.arrival}
                    {routes.slice(1).map((route, index) => (
                      <span key={index}>
                        <AirplanIcon className="airplane-icon" />
                        {route.arrival}
                      </span>
                    ))}
                  </>
                );
              }
              return null;
            })()}
          </span>{" "}
          by {flightData[crrItenary]?.carrierName}
        </Typography>

        {/* booking details section */}
        <Grid container>
          <Grid item xs={12} style={headerStyle}>
            <Typography
              sx={{ color: "var(--white)", fontSize: "14px", pt: "3px" }}
            >
              Booking Details
            </Typography>
          </Grid>
          {/* {renderItem("Flight Type", formatTripType(tripType))} */}
          {renderItem(
            "Journey Type",
            flightData[crrItenary]?.commissionType?.toUpperCase()
          )}
          {renderItem(
            "Class",
            flightData[crrItenary]?.class || cityCount[0]?.cabinCode
          )}
          {renderItem(
            "Seat",
            cityCount?.map((city) => city?.bookingClass).join(", ") || "N/A"
          )}

          {renderItem(
            "Brand Type",
            flightData[crrItenary]?.brands[0]?.brandName
          )}
          {renderItem(
            "Total Flight Duration",
            flightData[crrItenary]?.cityCount
              ?.map((cities) => cities[0]?.totalFlightDuration)
              .join(", ") || "N/A"
          )}
        </Grid>

        {/* passenger details section */}
        <Grid container sx={{ pt: "15px" }}>
          <Grid item xs={12} style={headerStyle}>
            <Typography
              sx={{ color: "var(--white)", fontSize: "14px", pt: "3px" }}
            >
              Flight Itenary Details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: "10px" }}>
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
                bookType={"recheck"}
                flightAfterSearch={flightAfterSearch}
                fareCard={"afterFare"}
                tabType={"flight"}
                partialChargeData={partialChargeData}
                bookingData={
                  flightAfterSearch === "reissue-search"
                    ? "reissue booking"
                    : "current booking"
                }
                crrItenary={crrItenary}
                splitFlightArr={splitFlightArr}
              />
            </Box>
          </Grid>

          {/* passenger details section */}
          <Grid item xs={12} style={headerStyle}>
            <Typography
              sx={{ color: "var(--white)", fontSize: "14px", pt: "3px" }}
            >
              Passenger Details
            </Typography>
          </Grid>
          {passengerDetails?.map((passenger, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: "#EFF7FF",
                width: "100%",
                borderRadius: "5px",
                p: "12px 15px",
                my: "10px",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--secondary-color)",
                    fontWeight: "500",
                  }}
                >
                  {!passengerData[passenger.type.toLowerCase()]?.[
                    passenger.count - 1
                  ]?.firstName &&
                    !passengerData[passenger.type.toLowerCase()]?.[
                      passenger.count - 1
                    ]?.lastName &&
                    "Passenger "}
                  {`${
                    passengerData[passenger.type.toLowerCase()]?.[
                      passenger.count - 1
                    ]?.prefix || ""
                  } ${
                    passengerData[passenger.type.toLowerCase()]?.[
                      passenger.count - 1
                    ]?.firstName || ""
                  } ${
                    passengerData[passenger.type.toLowerCase()]?.[
                      passenger.count - 1
                    ]?.lastName || ""
                  }`}{" "}
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
                in={openIndex === index}
                timeout="auto"
                unmountOnExit
                sx={{ width: "100%", transition: "height 1s ease-in-out" }}
              >
                {/* Title & Traveler list portion */}
                <Grid
                  container
                  sx={{
                    mt: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    container
                    item
                    xs={12}
                    lg={3.8}
                    sx={{ display: "flex", columnGap: "10px" }}
                  >
                    {getPrefixes(passenger.type).map((prefix) => {
                      const currentPassengerData =
                        passenger.type === "Adult"
                          ? passengerData.adult
                          : passenger.type === "Child"
                            ? passengerData.child
                            : passenger.type === "Infant"
                              ? passengerData.infant
                              : null;

                      const isPrefixMatch =
                        currentPassengerData &&
                        currentPassengerData[passenger.count - 1]?.prefix ===
                          prefix;

                      const bgcolor = isPrefixMatch
                        ? "var(--primary-color)"
                        : "#F0F2F5";
                      const color = isPrefixMatch ? "#fff" : "#979797";

                      return (
                        <Grid
                          key={prefix}
                          item
                          lg={3}
                          xs={2}
                          className="title-text prefix-box"
                          sx={{
                            bgcolor: bgcolor,
                            color: color,
                            transition: "background-color 0.3s ease",
                            "&:hover": {
                              bgcolor: "var(--primary-color)",
                              color: "#fff",
                            },
                          }}
                        >
                          {prefix}
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid
                    container
                    item
                    xs={12}
                    sx={{ mt: "20px", columnGap: "20px" }}
                  >
                    <Grid container spacing={3}>
                      {[
                        "firstName",
                        "lastName",
                        "gender",
                        "dateOfBirth",
                        "passportNation",
                        ...(flightData[crrItenary]?.journeyType ===
                          "Outbound" ||
                        (flightData[crrItenary]?.journeyType === "Inbound" &&
                          passengerData[passenger.type.toLowerCase()][
                            passenger.count - 1
                          ]?.passportNation?.name &&
                          passengerData[passenger.type.toLowerCase()][
                            passenger.count - 1
                          ]?.passportNation?.name !== "Bangladesh")
                          ? ["passportNumber", "passportExpire"]
                          : []),
                      ]?.map((field, index) => (
                        <Grid item lg={4} xs={12} key={field}>
                          <TextField
                            id={`${field}-${index}`}
                            label={
                              field === "passportNumber" ? (
                                <span
                                  style={{ fontFamily: "Mukta, sans-serif" }}
                                >
                                  Passport No.
                                </span>
                              ) : field === "passportExpire" ? (
                                "Passport Expiry Date"
                              ) : (
                                capitalizeLabel(field)
                              )
                            }
                            variant="outlined"
                            size="small"
                            sx={sharedInputStyles}
                            value={getPassengerData(passenger, field)}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                      ))}
                      <Grid
                        item
                        lg={3.8}
                        xs={12}
                        sx={{ mt: { lg: "0px", xs: "15px" } }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: "10px",
                            gap: "5px",
                          }}
                        >
                          <Checkbox
                            sx={{ p: "0px" }}
                            checked={
                              passengerData[passenger.type.toLowerCase()]?.[
                                passenger.count - 1
                              ]?.frequentTraveler || false
                            }
                          />
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "var(--gray)",
                              pt: "3px",
                            }}
                          >
                            Add To Frequent Flyer
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Documents upload portion */}
                    {flightAfterSearch !== "reissue-search" &&
                      (flightData[crrItenary]?.journeyType === "Outbound" ||
                        (flightData[crrItenary]?.journeyType === "Inbound" &&
                          passengerData[passenger.type.toLowerCase()][
                            passenger.count - 1
                          ]?.passportNation?.name &&
                          passengerData[passenger.type.toLowerCase()][
                            passenger.count - 1
                          ]?.passportNation?.name !== "Bangladesh")) && (
                        <Grid
                          container
                          item
                          lg={12}
                          xs={12}
                          sx={{
                            columnGap: "20px",
                            mt: { lg: "30px", xs: "15px" },
                          }}
                          key={index}
                        >
                          {agentData?.agentData?.agentCms?.eligibilityCms
                            ?.passportRequiredForBooking && (
                            <Grid item lg={3.8} xs={12}>
                              <ImageUploadFile
                                id={`passportImage-${index}`}
                                label={"Passport Copy"}
                                passengerType={passenger.type}
                                passengerCount={passenger.count}
                                paxNumber={passenger.paxNo}
                                documentType={"passport"}
                              />
                            </Grid>
                          )}

                          {agentData?.agentData?.agentCms?.eligibilityCms
                            ?.visaRequiredForBooking && (
                            <Grid
                              item
                              lg={3.8}
                              xs={12}
                              sx={{ mt: { lg: "0px", xs: "15px" } }}
                            >
                              <ImageUploadFile
                                id={`vidaImage-${index}`}
                                label={"Visa Copy"}
                                passengerType={passenger.type}
                                passengerCount={passenger.count}
                                documentType={"visa"}
                              />
                            </Grid>
                          )}
                        </Grid>
                      )}
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  {sections.map((_, i) => (
                    <Grid item lg={12} xs={12} key={i}>
                      <Box
                        sx={{
                          borderRadius: "5px",
                          mb: "15px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        {["wheelChair", "meals", "vipMessage"].map((type) => {
                          const ancillary = passengerData[
                            passenger.type.toLowerCase()
                          ]?.[passenger.count - 1]?.ancillaries?.find(
                            (anc) => anc.type === type
                          );

                          if (
                            !ancillary ||
                            (ancillary.type !== "vipMessage" &&
                              !ancillary.description)
                          ) {
                            return null;
                          }

                          if (type === "vipMessage" && !ancillary.remarks) {
                            return null;
                          }

                          return (
                            <Box
                              key={type}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                pt: "10px",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  color: "var(--secondary-color)",
                                  fontWeight: "500",
                                }}
                              >
                                {type === "wheelChair" && "Wheel Chair - "}
                                {type === "meals" && "Meal - "}
                                {type === "vipMessage" && "VIP Message - "}
                                {type !== "vipMessage" &&
                                  ancillary.description && (
                                    <span
                                      style={{ color: "var(--primary-color)" }}
                                    >
                                      {ancillary.description}
                                    </span>
                                  )}
                              </Typography>

                              {ancillary.remarks && (
                                <textarea
                                  id="remarks"
                                  name="remarks"
                                  rows="4"
                                  cols="130"
                                  className="text-area"
                                  value={ancillary.remarks}
                                  readOnly
                                />
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Collapse>
            </Box>
          ))}
        </Grid>
      </Box>
      {stepper === 2 && (
        <Box sx={{ width: { xs: "90%", lg: "100%" }, mx: "auto" }}>
          <Button
            disabled={isLoading}
            sx={{
              ...nextStepStyle,
              ":hover": { bgcolor: "var(--primary-color)" },
              zIndex: 10,
              width: { xs: "100%", lg: "100%" },
            }}
            onClick={() => dispatch(nextStepper())}
          >
            SKIP AND PROCEED TO NEXT STEP
          </Button>
        </Box>
      )}

      {stepper !== 2 && (
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
      )}
    </Box>
  );
};

export default RecheckInformation;
