import {
  Box,
  Grid,
  Typography,
  Collapse,
  TextField,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import PageTitle from "../../shared/common/PageTitle";
import TimeCountDown from "../FlightAfterSearch/components/TimeCountDown";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ReactComponent as AirplanIcon } from "../../images/svg/airplane.svg";
import { headerStyle, nextStepStyle } from "../../style/style";
import { formatTripType, renderItem } from "../AirBooking/RecheckInformation";
import FlightDetailsSection from "../FlightAfterSearch/FlightDetailsSection";
import { sharedInputStyles } from "../../shared/common/styles";
import moment from "moment";
import PnrPriceBreakdown from "./PnrPriceBreakdown";
import CustomAlert from "../Alert/CustomAlert";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import PendingLoader from "../Loader/PendingLoader";
import FareRulesCharges from "../FlightAfterSearch/components/FareRulesCharges";

const SharePnrRetrive = () => {
  const location = useLocation();
  const { jsonHeader } = useAuth();
  const { pnrData, pcc, pnr } = location?.state;
  const cityCount = pnrData?.cityCount ? pnrData?.cityCount.flat() : [];
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();

  const flattenedPassengers = [
    ...(pnrData?.passengerInformation?.adult || []),
    ...(pnrData?.passengerInformation?.child || []),
    ...(pnrData?.passengerInformation?.infant || []),
  ].flat();

  const getPrefixes = (passengerType) => {
    if (passengerType === "ADT") {
      return ["MR", "MS", "MRS"];
    } else {
      return ["MASTER", "MISS"];
    }
  };

  const renderTextField = (label, value) => (
    <Grid item lg={3.8} xs={12}>
      <Box
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.03)" },
            "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
          },
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          label={label}
          sx={{ ...sharedInputStyles }}
          value={value}
          InputProps={{
            readOnly: true,
          }}
          inputProps={{
            style: { textTransform: "uppercase", fontSize: "0.85rem" },
          }}
        />
      </Box>
    </Grid>
  );

  const handleSharePnrRetrive = async () => {
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to approve?",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/auto/pnr-share`;

      const body = {
        pcc: pcc,
        pnr: pnr,
        isSaved: true,
      };

      setIsLoading(true);

      const response = await axios.post(url, body, jsonHeader());

      await CustomAlert({
        success: "success",
        message: "PNR approval successful!",
      });

      navigate(
        `/dashboard/booking/airtickets/all/${
          response?.data?.data?.length > 0
            ? response?.data?.data[0]?.id
            : response?.data?.data?.id
        }`
      );
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      await CustomAlert({
        success: "error",
        message: `Failed to approve. ${
          error.response?.data?.message || error.message
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <PendingLoader />;
  }


  return (
    <Box>
      <Grid
        container
        sx={{
          width: { xs: "90%", md: "100%" },
          mx: { xs: "auto" },
          mt: { xs: 5, lg: 0 },
        }}
      >
        <Grid
          container
          item
          lg={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item xs={12} lg={2.4}>
            <Box>
              <TimeCountDown
                label="PNR Import Completion Time Limit"
                timeLimit={
                  pnrData?.timeLimit
                    ? moment(pnrData.timeLimit).set({
                        hour: 23,
                        minute: 59,
                        second: 0,
                      })
                    : moment().add(3, "minutes")
                }
              />

              <PnrPriceBreakdown pnrData={pnrData} />

              <Box mt={"20px"}>
                <FareRulesCharges
                  structure={pnrData?.structure || []}
                  nonStructure={[]}
                  bookingData={pnrData}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            lg={9.4}
            sx={{
              bgcolor: "white",
              pb: 2,
              borderRadius: 1,
            }}
          >
            <PageTitle title={"Import PNR"} />
            <Grid container item xs={12} lg={12} sx={{ p: "12px 15px" }}>
              <Typography
                sx={{
                  fontSize: "17px",
                  fontWeight: "600",
                  color: "#141E22",
                }}
              >
                <span style={{ color: "var(--primary-color)" }}>
                  {(() => {
                    const routes = pnrData?.route || [];
                    const length = routes?.length;
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
                {/* by {data?.carrierName} */}
              </Typography>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  style={headerStyle}
                  sx={{
                    display: {
                      xs: "none",
                      lg: "block",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--white)",
                      fontSize: "rem",
                      py: "0.25rem",
                      fontWeight: 400,
                    }}
                  >
                    Booking Details
                  </Typography>
                </Grid>
                <Box
                  sx={{
                    width: "100%",
                    display: {
                      xs: "none",
                      lg: "block",
                    },
                  }}
                >
                  {renderItem("Flight Type", formatTripType(pnrData?.tripType))}
                  {renderItem(
                    "Journey Type",
                    pnrData?.commissionType?.toUpperCase()
                  )}
                  {renderItem(
                    "Cabin Class",
                    cityCount && cityCount[0]?.cabinCode
                  )}
                  {renderItem(
                    "Booking Class",
                    cityCount && cityCount.length > 0
                      ? cityCount.map((city) => city?.bookingClass).join(", ")
                      : "N/A"
                  )}

                  {renderItem(
                    "Brand Type",
                    `${pnrData?.brands[0]?.name}, ${pnrData?.isRefundable}`
                  )}
                  {renderItem(
                    "Total Flight Duration",
                    pnrData?.cityCount
                      ?.map((cities) => cities[0]?.totalFlightDuration)
                      .join(", ") || "N/A"
                  )}
                </Box>

                <Grid
                  item
                  lg={12}
                  style={headerStyle}
                  sx={{
                    display: {
                      xs: "none",
                      lg: "block",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--white)",
                      fontSize: "1rem",
                      py: "0.25rem",
                      fontWeight: 400,
                    }}
                  >
                    Flight Itenary Details
                  </Typography>
                </Grid>
                <Grid item lg={12}>
                  <Box
                    sx={{
                      mt: {
                        xs: 0,
                        lg: "10px",
                      },
                    }}
                  >
                    <FlightDetailsSection
                      flightData={pnrData}
                      bookType={"normal"}
                      bookingData={"current booking"}
                      fareCard={"pnrFare"}
                      tabType={"flight"}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} lg={12} style={headerStyle}>
                  <Typography
                    sx={{
                      color: "var(--white)",
                      fontSize: "1rem",
                      py: "0.25rem",
                      fontWeight: 400,
                    }}
                  >
                    Passenger Details
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={12}>
                  {flattenedPassengers.map((passenger, index) => {
                    const showFileFields =
                      pnrData?.journeyType?.toLowerCase() === "outbound" ||
                      (pnrData?.journeyType?.toLowerCase() === "inbound" &&
                        passenger?.passportNation?.toLowerCase() !== "bd");

                    // const showImage =
                    //   passenger?.visaImage || passenger?.passportImage;

                    return (
                      <Box
                        key={index}
                        sx={{
                          bgcolor: "#EFF7FF",
                          width: "100%",
                          borderRadius: "5px",
                          p: "8px 15px",
                          my: "10px",
                        }}
                      >
                        <Box
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          onClick={() =>
                            setOpenIndex(openIndex === index ? null : index)
                          }
                        >
                          <Typography
                            sx={{
                              fontSize: "14px",
                              color: "var(--secondary-color)",
                              fontWeight: "500",
                              textTransform: "uppercase",
                            }}
                          >
                            {`${passenger?.firstName
                              ?.charAt(0)
                              .toUpperCase()}${passenger?.firstName?.slice(
                              1
                            )} ${passenger?.lastName
                              ?.charAt(0)
                              .toUpperCase()}${passenger?.lastName?.slice(
                              1
                            )} [${passenger?.type}]`}

                            {passenger.type === "CNN" && (
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

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                              }}
                              className="dropdown-class"
                            >
                              <ArrowDropDownIcon />
                            </Box>
                          </Box>
                        </Box>

                        <Collapse
                          in={openIndex === index}
                          timeout="auto"
                          unmountOnExit
                          sx={{
                            width: "100%",
                            transition: "height 1s ease-in-out",
                            mb: "1rem",
                          }}
                        >
                          <Grid
                            container
                            spacing={2}
                            sx={{ mt: 2, pointerEvents: "none" }}
                          >
                            {getPrefixes(
                              passenger.type === "ADT"
                                ? "ADT"
                                : passenger.type === "CNN"
                                  ? "CNN"
                                  : "INF"
                            )
                              .filter(
                                (prefix) =>
                                  (passenger.prefix === "MSTR" &&
                                    prefix === "MASTER") ||
                                  passenger.prefix === prefix
                              )
                              .map((prefix, i) => (
                                <React.Fragment key={i}>
                                  {renderTextField("Prefix", prefix)}
                                </React.Fragment>
                              ))}

                            {renderTextField(
                              "First Name",
                              passenger?.firstName
                                ? `${passenger.firstName
                                    .charAt(0)
                                    .toUpperCase()}${passenger.firstName.slice(
                                    1
                                  )}`
                                : ""
                            )}
                            {renderTextField(
                              "Last Name",
                              passenger?.lastName
                                ? `${passenger.lastName
                                    .charAt(0)
                                    .toUpperCase()}${passenger.lastName.slice(
                                    1
                                  )}`
                                : ""
                            )}
                            {renderTextField("Gender", passenger?.gender)}
                            {renderTextField(
                              "Date Of Birth",
                              passenger?.dateOfBirth
                                ? moment(passenger.dateOfBirth).format(
                                    "DD MMMM, YYYY"
                                  )
                                : ""
                            )}
                            {renderTextField(
                              "Passport Nation",
                              passenger?.passportNation
                            )}

                            {showFileFields &&
                              renderTextField(
                                "Passport No.",
                                passenger?.passportNumber
                              )}
                            {showFileFields &&
                              renderTextField(
                                "Passport Expiry Date",
                                passenger?.passportExpire
                                  ? moment(passenger.passportExpire).format(
                                      "DD MMMM, YYYY"
                                    )
                                  : ""
                              )}
                          </Grid>
                        </Collapse>
                      </Box>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              sx={{
                mt: "15px",
                px: 2,
                display: {
                  xs: "none",
                  lg: "block",
                },
              }}
            >
              <Button
                style={nextStepStyle}
                onClick={() => handleSharePnrRetrive()}
                sx={{
                  "&:hover .icon": {
                    transform: "translateX(10px)",
                    transition: "transform 0.5s ease",
                    opacity: 100,
                  },
                }}
                disabled={isLoading}
              >
                <Typography>
                  {isLoading ? "Please Wait..." : "Click To Import This PNR"}{" "}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SharePnrRetrive;
