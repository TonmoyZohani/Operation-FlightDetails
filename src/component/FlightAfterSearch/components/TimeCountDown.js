import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getRemainingTime } from "../../../helpers/getRemaingTime";
import moment from "moment";

const TimeCountDown = React.memo(({ label, data, timeLimit }) => {
  const calculateInitialTimeLeft = (timeLimit) => {
    if (!timeLimit) return 0;

    const timeRemaining = getRemainingTime(timeLimit);
    return (
      (timeRemaining.days || 0) * 86400 +
      (timeRemaining.hours || 0) * 3600 +
      (timeRemaining.minutes || 0) * 60 +
      (timeRemaining.seconds || 0)
    );
  };

  const [timeLeft, setTimeLeft] = useState(() =>
    timeLimit ? calculateInitialTimeLeft(timeLimit) : 0
  );

  useEffect(() => {
    const initialTime = calculateInitialTimeLeft(timeLimit);
    setTimeLeft(initialTime);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1; // // subtract 1 second
        // return prevTime - 60; // subtract 60 seconds (1 minute)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit]);

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <Box sx={{ bgcolor: "white", p: 2, mb: 2, borderRadius: "3px" }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: "#3C4258",
          fontSize: "0.85rem",
          fontWeight: "500",
          mb: 1,
        }}
      >
        {label}{" "}
        {timeLimit && (
          <span
            style={{
              marginTop: "2px",
              marginBottom: "2px",
              display: "inline-block",
              color: "var(--primary-color)",
            }}
          >
            {/* {moment(timeLimit).format("DD MMMM YYYY")}{" "} */}
            {moment(timeLimit, "YYYY-MM-DD HH:mm:ss").format(
              "DD MMM YYYY HH:mm"
            )}
          </span>
        )}
      </Typography>

      <Box sx={countStyle.countContainer}>
        {/* Days */}
        {days > 0 && (
          <Box sx={countStyle.countInerContainer}>
            <Box sx={flexStyle}>
              <Box sx={countStyle.countBox}>
                <Typography sx={countStyle.countText}>
                  {Math.floor(days / 10)}
                </Typography>
              </Box>
              <Box sx={countStyle.countBox}>
                <Typography sx={countStyle.countText}>{days % 10}</Typography>
              </Box>
            </Box>
            <Typography sx={countStyle.countTitle}>Days</Typography>
          </Box>
        )}

        {/* Hours */}
        <Box sx={countStyle.countInerContainer}>
          <Box sx={flexStyle}>
            <Box sx={countStyle.countBox}>
              <Typography sx={countStyle.countText}>
                {Math.floor(hours / 10)}
              </Typography>
            </Box>
            <Box sx={countStyle.countBox}>
              <Typography sx={countStyle.countText}>{hours % 10}</Typography>
            </Box>
          </Box>
          <Typography sx={countStyle.countTitle}>Hours</Typography>
        </Box>

        {/* Minutes */}
        <Box sx={countStyle.countInerContainer}>
          <Box sx={flexStyle}>
            <Box sx={countStyle.countBox}>
              <Typography sx={countStyle.countText}>
                {Math.floor(minutes / 10)}
              </Typography>
            </Box>
            <Box sx={countStyle.countBox}>
              <Typography sx={countStyle.countText}>{minutes % 10}</Typography>
            </Box>
          </Box>
          <Typography sx={countStyle.countTitle}>Minutes</Typography>
        </Box>

        {/* Seconds */}
        {days === 0 && (
          <Box sx={countStyle.countInerContainer}>
            <Box sx={flexStyle}>
              <Box sx={countStyle.countBox}>
                <Typography sx={countStyle.countText}>
                  {Math.floor(seconds / 10)}
                </Typography>
              </Box>
              <Box sx={countStyle.countBox}>
                <Typography sx={countStyle.countText}>
                  {seconds % 10}
                </Typography>
              </Box>
            </Box>
            <Typography sx={countStyle.countTitle}>Seconds</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

const flexStyle = {
  display: "flex",
  gap: {
    xs: 0.5,
    lg: 0.5,
  },
};

const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const countStyle = {
  countContainer: { display: "flex", justifyContent: "space-between" },
  countInerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  countBox: {
    width: {
      xs: "3rem",
      lg: window.innerWidth > 1900 ? "2.5rem" : "1.875rem",
    },
    height: {
      xs: "3rem",
      lg: window.innerWidth > 1900 ? "2.5rem" : "1.875rem",
    },
    bgcolor: "#F4F4F4",
    borderRadius: "1.72px",
    color: "var(--primary-color)",
    ...center,
  },
  countText: {
    fontSize: "1.3rem",
    fontWeight: 400,
    color: "var(--primary-color)",
  },
  countTitle: {
    fontSize: "12px",
    fontWeight: 500,
    textAlign: "center",
    mt: "5px",
    color: "var(--secondary-color)",
  },
};

export default TimeCountDown;
