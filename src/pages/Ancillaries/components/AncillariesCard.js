import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MobileItineraryCard from "../../Bookings/components/MobileItineraryCard";

const AncillariesCard = ({
  ancilaryData,
  retriveData,
  itineraryColumns,
  itineraryRows,
  getCellContent,
  handleRemove,
}) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Box>
      {ancilaryData?.passengerAncillaries?.map((passenger, outerIndex) => {
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
                alignItems: "center",
                p: {
                  xs: "12px 10px",
                  lg: "12px 15px",
                },
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
                  {passenger?.passengerInfo?.prefix}{" "}
                  {passenger?.passengerInfo?.firstName}{" "}
                  {passenger?.passengerInfo?.lastName}
                </span>{" "}
                [{" "}
                {passenger?.passengerInfo?.paxType === "ADT"
                  ? "Adult"
                  : passenger?.passengerInfo?.paxType === "CNN"
                    ? "Child"
                    : "Infant"}{" "}
                ]
                {passenger?.passengerInfo?.paxType === "CNN" && (
                  <span
                    style={{
                      color: "var(--primary-color)",
                      fontSize: "12px",
                    }}
                  ></span>
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
                const ancillariesData = passenger?.ancillaries?.filter(
                  (item) => item.itineraryIndex === index + 1
                );
                return (
                  <Grid
                    key={index}
                    container
                    item
                    xs={12}
                    sx={{
                      mb: "10px",
                      px: {
                        xs: 1,
                        lg: 1.5,
                      },
                    }}
                  >
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
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: {
                          xs: "block",
                          lg: "none",
                        },
                        px: 1,
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

                    <Grid
                      item
                      xs={12}
                      sx={{
                        bgcolor: "#fff",
                        p: "12px 15px",
                      }}
                      key={index}
                    >
                      {ancillariesData?.length > 0 && (
                        <>
                          <Typography
                            sx={{
                              fontSize: {
                                xs: "0.813rem",
                                lg: "1rem",
                              },
                              fontWeight: "500",
                              pb: "15px",
                              px: {
                                xs: 0,
                                lg: 1.5,
                              },
                              color: "var(--secondary-color)",
                            }}
                          >
                            {retriveData?.tripType !== "multiCity"
                              ? `Flight Itinerary  ${
                                  index === 0 ? "Onward" : "Return"
                                }  Ancillaries ${
                                  ancilaryData?.ancillaryRequest?.status ===
                                  "processing"
                                    ? "On Process"
                                    : "Applied"
                                }`
                              : `Flight Itinerary  ${ro?.departure}-${ro?.arrival} Applied Ancillaries`}{" "}
                          </Typography>
                          <Stack spacing={1} mb={2}>
                            {ancillariesData &&
                              ancillariesData.map((ancilary, ancilaryIndex) => {
                                const isAncilaryUnavailable =
                                  ancilary?.status !== "unavailable";
                                return (
                                  <>
                                    {isAncilaryUnavailable && (
                                      <Box
                                        key={ancilaryIndex}
                                        sx={{
                                          border: "1px solid var(--border)",
                                          px: { xs: 1, sm: 2 },
                                          py: 1,
                                          borderRadius: "4px",
                                          display: "flex",
                                          gap: {
                                            xs: 1,
                                            lg: 2,
                                          },
                                          flexDirection: {
                                            xs: "row",
                                          },
                                          justifyContent: {
                                            xs: "space-between",
                                          },
                                          alignItems: "center",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: {
                                              xs: 1,
                                              lg: 2,
                                            },
                                          }}
                                        >
                                          {/* Icon for Status */}
                                          {ancilary?.status === "pending" && (
                                            <Tooltip
                                              title={
                                                <Typography
                                                  sx={{
                                                    textTransform: "uppercase",
                                                    fontSize: "0.75rem",
                                                  }}
                                                >
                                                  {ancilary?.status}
                                                </Typography>
                                              }
                                            >
                                              <AccessTimeFilledIcon
                                                sx={{ color: "gray" }}
                                              />
                                            </Tooltip>
                                          )}
                                          {/* Similar Icon Components for Other Status */}

                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: {
                                                xs: "column",
                                                lg: "row",
                                              },
                                              alignItems: {
                                                xs: "baseline",
                                              },
                                              gap: {
                                                xs: 0.5,
                                                lg: 1.5,
                                              },
                                            }}
                                          >
                                            {/* Ancillary Type */}
                                            <Typography
                                              sx={{
                                                width: {
                                                  xs: "175px",
                                                },
                                                flexShrink: 0,
                                                textTransform: "uppercase",
                                                fontSize: {
                                                  xs: "0.7rem",
                                                  lg: "0.85rem",
                                                },
                                                fontWeight: 600,
                                                textAlign: {
                                                  xs: "left",
                                                  sm: "left",
                                                },
                                              }}
                                            >
                                              {ancilary?.type}
                                            </Typography>

                                            <Typography
                                              sx={{
                                                display: {
                                                  xs: "none",
                                                  md: "block",
                                                },
                                              }}
                                            >
                                              :
                                            </Typography>

                                            {/* Ancillary Description */}
                                            <Typography
                                              sx={{
                                                width: {
                                                  xs: "200px",
                                                  lg: "100%",
                                                },
                                                textTransform: "uppercase",
                                                fontSize: {
                                                  xs: "0.7rem",
                                                  lg: "0.85rem",
                                                },
                                                fontWeight: 500,
                                                color: "#4D4B4B",
                                                mr: { xs: 0, sm: "50px" },
                                                textAlign: {
                                                  xs: "left",
                                                  sm: "left",
                                                },
                                                flex: 1,
                                              }}
                                            >
                                              {ancilary?.description}
                                            </Typography>
                                          </Box>
                                        </Box>

                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexShrink: 1,
                                            justifyContent: "flex-end",
                                          }}
                                        >
                                          {/* Refundable/Non-Refundable Badge */}
                                          {typeof ancilary?.refundable ===
                                            "boolean" && (
                                            <Tooltip
                                              title={
                                                <Typography
                                                  sx={{
                                                    textTransform: "uppercase",
                                                    fontSize: "0.75rem",
                                                  }}
                                                >
                                                  {ancilary?.refundable
                                                    ? "Refundable"
                                                    : "Non Refundable"}
                                                </Typography>
                                              }
                                            >
                                              <IconButton
                                                sx={{
                                                  width: "20px",
                                                  height: "20px",
                                                  bgcolor: ancilary?.refundable
                                                    ? "green"
                                                    : "var(--primary-color)",
                                                  ":hover": {
                                                    bgcolor:
                                                      ancilary?.refundable
                                                        ? "green"
                                                        : "var(--primary-color)",
                                                  },
                                                  fontSize: "0.95rem",
                                                  color: "white",
                                                }}
                                              >
                                                R
                                              </IconButton>
                                            </Tooltip>
                                          )}

                                          {/* Drop Ancillary */}
                                          {ancilary?.ancillaryRequest
                                            ?.status === "to be confirmed" && (
                                            <Tooltip
                                              title={
                                                <Typography
                                                  sx={{
                                                    textTransform: "uppercase",
                                                    fontSize: "0.75rem",
                                                  }}
                                                >
                                                  Drop Ancillary
                                                </Typography>
                                              }
                                            >
                                              <IconButton
                                                onClick={() =>
                                                  handleRemove(ancilary?.id)
                                                }
                                              >
                                                <DeleteIcon
                                                  sx={{
                                                    color:
                                                      "var(--primary-color)",
                                                  }}
                                                />
                                              </IconButton>
                                            </Tooltip>
                                          )}
                                        </Box>
                                      </Box>
                                    )}
                                  </>
                                );
                              })}
                          </Stack>
                        </>
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
  );
};

export default AncillariesCard;
