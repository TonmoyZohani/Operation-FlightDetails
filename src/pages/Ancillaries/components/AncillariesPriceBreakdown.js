import { Box, Collapse, Typography } from "@mui/material";
import React, { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const AncillariesPriceBreakdown = ({ label, ancillaryData, passengers }) => {
  const [openPriceBox, setOpenPriceBox] = useState(false);

  const handleToggle = () => {
    setOpenPriceBox((prev) => !prev);
  };

  const totalAncillariesPrice = ancillaryData
    .flatMap((passenger) => passenger.ancillaries)
    .filter(
      (ancillary) =>
        (ancillary.status === "available" || ancillary.status === "refunded") &&
        ancillary.price !== null
    )
    .reduce((sum, ancillary) => sum + ancillary.price, 0);

  const totalPrice = totalAncillariesPrice;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column-reverse",
          md: "column",
        },
        mb: "1rem",
      }}
    >
      {/* Price breakdown */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "3px",
        }}
      >
        <Box
          sx={{
            py: "12px",
            px: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            cursor: "pointer",
          }}
          onClick={handleToggle}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#3C4258",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                {label}
              </Typography>
              <Typography
                sx={{
                  color: "#3C4258",
                  fontSize: "1.25rem",
                  fontWeight: "500",
                  pt: "2px",
                }}
              >
                {(totalPrice || 0)?.toLocaleString("en-IN")} BDT
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <ArrowDropDownIcon
                sx={{
                  transform: openPriceBox ? "rotate(180deg)" : "rotate(0deg)",
                  bgcolor: "#F2F8FF",
                  borderRadius: "50%",
                  transition: "transform 0.2s ease-in-out",
                }}
              />
            </Box>
          </Box>
        </Box>
        <Collapse
          in={openPriceBox}
          timeout="auto"
          unmountOnExit
          sx={{ pb: 2.5 }}
        >
          <Typography
            sx={{
              bgcolor: "var(--primary-color)",
              color: "#fff",
              fontSize: "0.85rem",
              p: "3px 12px",
              mb: "10px",
              fontWeight: 500,
            }}
          >
            Price Breakdown
          </Typography>

          <Box
            sx={{
              px: "12px",
            }}
          >
            {ancillaryData?.map((passenger) => {
              return (
                <Box key={passenger.id} sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                    {passenger?.passengerInfo?.firstName}{" "}
                    {passenger?.passengerInfo?.lastName} (
                    {passenger.passengerInfo?.paxType})
                  </Typography>
                  {passengers?.cityCount?.map((city, cityIndex) => {
                    const ancillariesForCity = passenger?.ancillaries.filter(
                      (ancillary) => ancillary.itineraryIndex === cityIndex + 1
                    );

                    return (
                      <>
                        {ancillariesForCity.length > 0 && (
                          <Box key={cityIndex} sx={{ mb: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "0.85rem",
                              }}
                            >
                              {city[0]?.departureCityName} →{" "}
                              {city[city?.length - 1]?.arrivalCityName}
                            </Typography>
                            {ancillariesForCity?.map((ancillary) => (
                              <Box
                                key={ancillary.id}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  pt: "2px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "gray",
                                    fontSize: "0.813rem",
                                    fontWeight: "500",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {ancillary.type}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "gray",
                                    fontSize: "0.813rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  {ancillary?.price
                                    ? `${ancillary?.price?.toLocaleString("en-IN")} BDT`
                                    : "Unavailable"}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </>
                    );
                  })}
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
            }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              Total Ancillaries Fee
            </Typography>
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              <Typography
                sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
              >
                {totalAncillariesPrice?.toLocaleString("en-IN")} BDT
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
              mb: "5px",
            }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              Total Service Charge
            </Typography>
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              0 BDT
            </Typography>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default AncillariesPriceBreakdown;
