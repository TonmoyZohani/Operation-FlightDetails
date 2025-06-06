import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import React from "react";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import { BpCheckedIcon, BpIcon } from "../../../shared/common/styles";
import moment from "moment";

const MobileItineraryCard = ({
  route,
  retriveData,
  index,
  selectedRows,
  handleRowSelect,
  isReissue = false,
  isRefund = false,
  isAncillaries = false,
  bookingType = "postBooking",
}) => {
  const stops =
    bookingType === "preBooking"
      ? retriveData?.cityCount[index]
      : retriveData?.details?.cityCount[index];
  const stopCount = stops.length - 1;
  const stopDescription =
    stopCount > 0
      ? `${stopCount} Stop${stopCount > 1 ? "s" : ""} via ${stops
          .slice(0, -1)
          .map((stop) => stop.arrivalCityCode)
          .join(", ")}`
      : "Non-stop";

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        width: "100%",
        px: {
          xs: 1.6,
          sm: 2,
          md: 2,
        },
        py: {
          xs: 1,
          sm: 2,
          md: 2,
        },
        border: "1px solid var(--primary-color)",
        borderRadius: "3px",
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!isRefund && (
            <FormControlLabel
              sx={{ width: "20px" }}
              control={
                <Checkbox
                  sx={{ width: "30px", pr: 0 }}
                  disableRipple
                  checked={
                    isAncillaries
                      ? isAncillaries
                      : isReissue
                        ? selectedRows?.some((row) => row.index === index)
                        : selectedRows?.includes(index)
                  }
                  disabled={
                    isAncillaries
                      ? isAncillaries
                      : isReissue
                        ? stops[0]?.isFlown
                        : stops[0]?.isFlown || !stops[0]?.isFlown
                  }
                  onChange={
                    isReissue
                      ? () => handleRowSelect(index, stops[0]?.departureDate)
                      : () => handleRowSelect(index)
                  }
                  checkedIcon={<BpCheckedIcon color={"white"} />}
                  icon={<BpIcon color={"white"} />}
                />
              }
            />
          )}

          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            {retriveData?.tripType !== "multiCity"
              ? `${index === 0 ? "Onward" : "Return"}`
              : `City ${index + 1}`}
          </Typography>
          <Typography
            sx={{ color: "#3D3A49", fontWeight: 500, fontSize: "12px" }}
          >
            <span
              style={{
                backgroundColor: stops[0]?.isFlown ? "#d84564" : "#2b8fd9",
                color: "white",
                padding: "0 5px",
                marginLeft: "10px",
                borderRadius: "3px",
                textTransform: "uppercase",
              }}
            >
              {stops[0]?.isFlown ? "Flown" : "Unflown"}
            </span>
          </Typography>
        </Box>
        <Box
          sx={{
            my: 0.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#333333",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <>
                {route?.departure}{" "}
                <LocalAirportIcon
                  sx={{ transform: "rotate(90deg)", fontSize: "18px" }}
                />{" "}
                {route?.arrival}
              </>
            </Typography>
            <Typography
              sx={{ color: "#3D3A49", fontWeight: 500, fontSize: "13px" }}
            >
              {stops[0]?.marketingCarrierName}
            </Typography>
            <Typography
              sx={{ color: "#3D3A49", fontWeight: 500, fontSize: "13px" }}
            >
              {stopDescription}
            </Typography>
            <Typography
              sx={{ color: "green", fontWeight: 500, fontSize: "13px", mt: 1 }}
            >
              <span>
                {isReissue
                  ? `${stops[0].marketingFlight} [ ${stops[0].marketingCarrier} ] ,`
                  : retriveData?.isRefundable}
              </span>
              {isReissue && (
                <span style={{ marginLeft: "5px", fontSize: "13px" }}>
                  {moment(stops[0]?.departureDate).format("DD MMM, YYYY")}
                </span>
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <img
          alt="logo"
          src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${stops[0]?.marketingCarrier}.png`}
          style={{ width: "30px", height: "30px", objectFit: "fill" }}
        />
      </Box>
    </Box>
  );
};

export default MobileItineraryCard;
