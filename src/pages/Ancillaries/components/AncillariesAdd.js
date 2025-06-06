import { Box, Button, Collapse, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import MobileItineraryCard from "../../Bookings/components/MobileItineraryCard";
import { mobileButtonStyle } from "../../../style/style";

const AncillariesAdd = ({
  passengers,
  retriveData,
  ancillaries,
  itineraryColumns,
  itineraryRows,
  getCellContent,
  handleRemoveAncillary,
  handleOpenAnci,
  pax,
  onSubmit,
  status,
  type,
  setType,
  isAncillaries,
}) => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <>
      <Box sx={{ width: "100%" }}>
        {passengers?.map((passenger, outerIndex) => {
          return (
            <Box
              key={outerIndex}
              sx={{
                bgcolor: "#fff",
                borderRadius: "5px",
                mb: "10px",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: "12px 15px",
                  bgcolor: "#F2F8FF",
                  mx: 2,
                  borderRadius: "5px",
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
                    {passenger?.prefix} {passenger?.firstName}{" "}
                    {passenger?.lastName}
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

                <ArrowDropDownIcon
                  sx={{
                    bgcolor: "#FFFFFF",
                    color: "var(--secondary-color)",
                    borderRadius: "50%",
                    transform: `rotate(${
                      openIndex === outerIndex ? "180deg" : "0deg"
                    })`,
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </Box>
              <Collapse
                in={openIndex === outerIndex}
                timeout="auto"
                unmountOnExit
                sx={{
                  width: "100%",
                  transition: "height 1s ease-in-out",
                }}
              >
                {retriveData?.details?.route?.map((ro, index) => {
                  const route = {
                    departure: ro?.departure,
                    arrival: ro?.arrival,
                  };

                  const ancillariesData = ancillaries?.find(
                    (item) =>
                      item.index === index &&
                      item.route.departure === route.departure &&
                      item.route.arrival === route.arrival &&
                      item.pax.firstName === passenger?.firstName &&
                      item.pax.lastName === passenger?.lastName
                  );

                  const isAncillaries = Boolean(ancillariesData?.ancillaries);

                  return (
                    <Grid
                      key={index}
                      container
                      item
                      xs={12}
                      sx={{
                        mb: "10px",
                        px: 1.5,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        lg={12}
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
                            px: 1,
                          }}
                        >
                          {retriveData?.tripType !== "multiCity"
                            ? `Flight Itinerary  ${
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
                          px: 0.5,
                          mt: 1,
                        }}
                      >
                        <MobileItineraryCard
                          retriveData={retriveData}
                          index={index}
                          route={ro}
                          isReissue={true}
                          isAncillaries={true}
                        />
                      </Grid>
                      {/* --- Mobile Itinerary Card end --- */}

                      <Grid
                        item
                        xs={12}
                        lg={12}
                        sx={{
                          bgcolor: "#fff",
                          p: {
                            xs: "0 6px",
                            lg: "12px 15px",
                          },
                        }}
                        key={index}
                      >
                        {ancillariesData?.ancillaries?.length > 0 && (
                          <>
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "0.813rem",
                                  lg: "1rem",
                                },
                                fontWeight: "500",
                                pb: "15px",
                                px: 0.2,
                              }}
                            >
                              {retriveData?.tripType !== "multiCity"
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
                                      }}
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
                        {(retriveData?.status === "hold" ||
                          retriveData?.status === "issue in process" ||
                          retriveData?.status === "ticketed") && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "end",
                              ml: "auto",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: "500",
                                pb: "15px",
                                color: "var(--primary-color)",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleOpenAnci(
                                  index,
                                  passenger,
                                  route,
                                  !isAncillaries
                                )
                              }
                            >
                              Add New Ancillaries From List
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Collapse>
            </Box>
          );
        })}
      </Box>
      {/* --- mobile button start --- */}
      {isAncillaries && (
        <Box
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
          }}
        >
          {type === "Fare Information" ? (
            <Button
              sx={mobileButtonStyle}
              onClick={() => setType("Booking Ancillaries Request")}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  px: 9,
                }}
              >
                PROCEED ANCILLARIES REQUEST
              </Typography>
            </Button>
          ) : (
            <Button
              disabled={status === "pending"}
              sx={mobileButtonStyle}
              onClick={onSubmit}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  px: 9,
                }}
              >
                {status === "pending"
                  ? "Please waiting..."
                  : "SAVE THOSE ANCILLARIES"}
              </Typography>
            </Button>
          )}
        </Box>
      )}

      {/* --- mobile button end --- */}
    </>
  );
};

export default AncillariesAdd;
