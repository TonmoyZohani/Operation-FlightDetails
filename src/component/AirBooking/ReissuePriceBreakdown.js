import { Box, Typography, Collapse } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import { priceStyle } from "./PriceBreakdown";

const ReissuePriceBreakdown = ({
  label,
  flightData,
  priceData,
  status,
  retriveData = {},
}) => {
  const fareData = flightData?.fareDifference;
  const [openPriceBox, setOpenPriceBox] = useState(false);

  const handleToggle = () => {
    setOpenPriceBox((prev) => !prev);
  };

  const priceItems = [
    {
      label: "Total Basefare",
      value: fareData?.totalNewFareDifference?.baseFare,
    },
    { label: "Total Taxes", value: fareData?.totalNewFareDifference?.tax },
    {
      label: "Customer Invoice Total",
      value: fareData?.totalNewFareDifference?.clientPrice,
    },
    {
      label: "Discount",
      value: fareData?.totalNewFareDifference?.commission,
      color: "var(--primary-color)",
    },
    {
      label: "After Commission Fare",
      value:
        fareData?.totalNewFareDifference?.clientPrice -
        fareData?.totalNewFareDifference?.commission,
    },
    { label: "AIT", value: fareData?.totalNewFareDifference?.ait },
    {
      label: "New Agent Price",
      value: fareData?.totalNewFareDifference?.agentPrice,
    },
    {
      label: "Old Agent Price",
      value: fareData?.totalOldFareDifference?.agentPrice,
    },
    {
      label: "Fare Difference",
      value: fareData?.totalFareDifference?.agentPrice,
    },
    { label: "Total AIT", value: fareData?.totalFareDifference?.ait },
    {
      label: "FF Service Charge",
      value: fareData?.totalFareDifference?.serviceFee,
    },
    {
      label: "Airline Service Charge",
      value:
        fareData?.totalFareDifference?.airlineServiceFee ||
        fareData?.totalFareDifference?.airlinesServiceFee,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "column" },
        mb: "1rem",
      }}
    >
      {/* Price breakdown */}
      <Box sx={{ bgcolor: "#fff", borderRadius: "3px" }}>
        <Box
          onClick={handleToggle}
          sx={{
            py: "12px",
            px: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            cursor: "pointer",
          }}
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
                {label || "Reissue Payable"}
              </Typography>
              <Typography
                sx={{
                  color: "#3C4258",
                  fontSize: "1.25rem",
                  fontWeight: "500",
                  pt: "2px",
                }}
              >
                {flightData?.autoReissue === false ||
                status === "reissue request"
                  ? "Will Be Decided"
                  : `${flightData?.fareDifference?.totalFareDifference?.reIssuePayable?.toLocaleString("en-IN")} BDT`}
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

          {priceData?.map((price, index) => (
            <Box key={index} sx={{ px: "12px", pb: "10px" }}>
              {/* Determine passenger type */}
              <Typography
                sx={{
                  color: "#3C4258",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                {price?.firstName} {price?.lastName}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  pt: "4px",
                }}
              >
                <Typography
                  sx={{
                    color: "gray",
                    fontSize: "0.813rem",
                    fontWeight: "500",
                  }}
                >
                  Base Fare
                </Typography>
                <Typography
                  sx={{
                    color: "gray",
                    fontSize: "0.813rem",
                    fontWeight: "500",
                  }}
                >
                  {price?.baseFare?.toLocaleString("en-IN")} BDT
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  pt: "4px",
                }}
              >
                <Typography
                  sx={{
                    color: "gray",
                    fontSize: "0.813rem",
                    fontWeight: "500",
                  }}
                >
                  Tax
                </Typography>
                <Typography
                  sx={{
                    color: "gray",
                    fontSize: "0.813rem",
                    fontWeight: "500",
                  }}
                >
                  {price?.tax?.toLocaleString("en-IN")} BDT
                </Typography>
              </Box>
            </Box>
          ))}

          {priceItems.map(({ label, value, color }, index) => {
            const greenLabels = [
              "Fare Difference",
              "Total AIT",
              "FFI Service Charge",
              "Airline Service Charge",
            ];
            const isGreen = greenLabels.includes(label);

            return (
              <Box
                key={label}
                sx={{
                  ...priceStyle.container,
                  ...(label === "After Commission Fare" ||
                  label === "New Agent Price" ||
                  label === "Fare Difference"
                    ? { mt: "10px" }
                    : {}),
                }}
              >
                <Typography
                  sx={{
                    ...priceStyle.value,
                    color: isGreen ? "var(--green)" : "#808080",
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    ...priceStyle.value,
                    color: isGreen ? "var(--green)" : "#808080",
                  }}
                >
                  {value?.toLocaleString?.() ?? 0} BDT
                </Typography>
              </Box>
            );
          })}

          <Box sx={{ ...priceStyle.container, mt: "10px" }}>
            <Typography sx={{ ...priceStyle.value }}>
              {retriveData?.bookingStatus === "reissued"
                ? "Reissued Paid"
                : "Reissue Payable Amount"}
            </Typography>
            <Typography sx={priceStyle.value}>
              {flightData?.autoReissue === false || status === "reissue request"
                ? "Will Be Decided"
                : `${flightData?.fareDifference?.totalFareDifference?.reIssuePayable?.toLocaleString("en-IN")} BDT`}
            </Typography>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default ReissuePriceBreakdown;
