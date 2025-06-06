import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";

const MobileBookingCard = ({ booking }) => {
  const routes = booking?.details?.route || [];
  let route = {};
  if (booking?.tripType === "oneWay") {
    route.departure = routes?.[0]?.departure;
    route.arrival = routes[routes?.length - 1]?.arrival;
  }

  const typeOrder = ["ADT", "CNN", "INF"];

  const sortedPassengers = booking?.details?.passengers?.sort((a, b) => {
    return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
  });

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
        borderRadius: "5px",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontSize: "12px",
            color: "#333333",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {booking?.tripType === "oneWay" && (
            <>
              {routes?.[0]?.departure}{" "}
              <LocalAirportIcon
                sx={{ transform: "rotate(90deg)", fontSize: "15px" }}
              />{" "}
              {routes[routes?.length - 1]?.arrival}
            </>
          )}

          {booking?.tripType === "return" && (
            <>
              {routes?.[0]?.departure}{" "}
              <LocalAirportIcon
                sx={{ transform: "rotate(90deg)", fontSize: "15px" }}
              />{" "}
              {routes?.[0]?.arrival}{" "}
              <LocalAirportIcon
                sx={{ transform: "rotate(90deg)", fontSize: "15px" }}
              />{" "}
              {routes[routes?.length - 1]?.arrival}
            </>
          )}

          {booking?.tripType === "multiCity" && (
            <>
              {routes?.map((city, i, arr) => {
                return (
                  <React.Fragment key={i}>
                    {city?.departure}{" "}
                    <LocalAirportIcon
                      sx={{ transform: "rotate(90deg)", fontSize: "15px" }}
                    />{" "}
                    {i === arr.length - 1 && city?.arrival}
                  </React.Fragment>
                );
              })}
            </>
          )}
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "10px",
            textTransform: "capitalize",
            color:
              booking?.status === "hold"
                ? "#B279B3"
                : booking?.status === "ticketed"
                  ? "#52be5a"
                  : booking?.status === "void"
                    ? "#2b8fd9"
                    : booking?.status === "issue in process"
                      ? "#be7352"
                      : booking?.status === "void request"
                        ? "#4999d4"
                        : booking?.status === "refund"
                          ? "#2bd99f"
                          : booking?.status === "refund request"
                            ? " #bf7017 "
                            : booking?.status === "refund to be confirmed"
                              ? "#cf45d8"
                              : booking?.status === "refund on process"
                                ? "#d84564"
                                : booking?.status === "reissue request"
                                  ? "#4782de "
                                  : booking?.status === "refunding"
                                    ? "#f9a168"
                                    : booking?.status === "reissue on process"
                                      ? "#53828d"
                                      : "red",
          }}
        >
          {booking?.status}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          my: 1,
        }}
      >
        <img
          alt="logo"
          src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${booking?.carrier}.png`}
          style={{ width: "20px", height: "20px", objectFit: "fill" }}
        />
        <Box>
          <Typography
            sx={{ color: "#3D3A49", fontWeight: 500, fontSize: "9px" }}
          >
            {booking?.carrierName}
          </Typography>
          <Typography
            sx={{ color: "#52be5a", fontWeight: 500, fontSize: "9px" }}
          >
            {booking?.isRefundable}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.2 }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Typography
            sx={{
              backgroundColor:
                booking?.paymentStatus === "paid"
                  ? "#0E86491A"
                  : booking?.paymentStatus === "unpaid"
                    ? "#FFEDF0"
                    : "#c7e4ff",
              color:
                booking?.paymentStatus === "paid"
                  ? "#0E8749"
                  : booking?.paymentStatus === "unpaid"
                    ? "#dc143c"
                    : "#18457b",
              px: "5px",
              py: "2px",
              borderRadius: "3px",
              textTransform: "uppercase",
              fontSize: "8px",
              fontWeight: "500",
            }}
          >
            {booking?.paymentStatus}
          </Typography>
          <Typography
            sx={{
              color: "#18457b",
              fontWeight: 500,
              fontSize: "8px",
              bgcolor: "#c7e4ff",
              px: "5px",
              py: "2px",
              borderRadius: "3px",
              fontWeight: "500",
            }}
          >
            {booking?.bookingId}
          </Typography>
          {booking?.firstActivityLog?.devicePlatform && (
            <Typography
              sx={{
                color: "#18457b",
                fontWeight: 500,
                fontSize: "8px",
                bgcolor: "#c7e4ff",
                px: "5px",
                py: "2px",
                borderRadius: "3px",
                fontWeight: "500",
              }}
            >
              {booking?.firstActivityLog?.devicePlatform}
            </Typography>
          )}

          <Typography
            sx={{
              color: "#18457b",
              fontWeight: 500,
              fontSize: "8px",
              bgcolor: "#c7e4ff",
              px: "5px",
              py: "2px",
              borderRadius: "3px",
              fontWeight: "500",
            }}
          >
            {booking?.details?.passengers?.reduce(
              (total, passenger) => total + passenger.count,
              0
            )}{" "}
            Pax
          </Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Typography
            sx={{ color: "#A2A1A1", fontWeight: 400, fontSize: "9px" }}
          >
            ৳ {booking?.agentPrice?.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileBookingCard;
