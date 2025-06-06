import React, { useState, useEffect } from "react";
import { Box, Typography, Modal, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setClearAllStates } from "../AirBooking/airbookingSlice";
import {
  actionBtnStyle,
  modalStyle,
} from "../AirBooking/components/ChurnModal";
import Lottie from "lottie-react";
import TimeExpired from "../../assets/lottie/timeExpired.json";
import { setRefetch } from "../FlightSearchBox/flightSearchSlice";

const TimerLimit = ({
  label,
  limitMinutes = 5,
  setRefetchAirBooking,
  type = "afterSearch",
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refetch } = useSelector((state) => state.flight);
  const [timeLeft, setTimeLeft] = useState(limitMinutes * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setIsTimeUp(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isTimeUp) {
      if (type === "airBooking") {
        setShowModal(true);
      } else {
        dispatch(setClearAllStates());
        setShowModal(true);
      }
    }
  }, [isTimeUp]);

  const handleContinue = () => {
    setShowModal(false);
    setRefetchAirBooking((prev) => !prev);
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate(-1);
  };

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <Box sx={{ bgcolor: "white", p: 2, mb: 2, borderRadius: "3px" }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: timeLeft < 30 ? "var(--primary-color)" : "#3C4258",
            fontSize: "0.85rem",
            fontWeight: "500",
            mb: 1,
          }}
        >
          {label}
        </Typography>

        {/* Time Display */}
        <Box sx={countStyle.countContainer}>
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
                <Typography sx={countStyle.countText}>
                  {minutes % 10}
                </Typography>
              </Box>
            </Box>
            <Typography sx={countStyle.countTitle}>Minutes</Typography>
          </Box>

          {/* Seconds */}
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
        </Box>

        {isTimeUp && type !== "airBooking" && (
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Time's up! Redirecting...
          </Typography>
        )}
      </Box>

      {/* Confirmation Modal */}
      <Modal
        open={showModal}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleCancel(event);
          }
        }}
      >
        <Box sx={{ ...modalStyle, width: "600px" }}>
          <Box>
            <Lottie
              animationData={TimeExpired}
              loop={true}
              style={{ height: 150, width: 150, margin: "0 auto" }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--secondary-color)",
              textAlign: "center",
            }}
          >
            {type === "afterSearch" ? "Search" : "Booking Completion"} Time
            Expired
          </Typography>

          <Typography
            sx={{
              fontSize: "14px",
              mt: 2,
              color: "#28282B",
              textAlign: "center",
            }}
          >
            {type === "afterSearch"
              ? "Your search time has been expired."
              : "Your fare completion time has been expired. Kindly verify whether your selected fare is still available and confirm your booking accordingly."}
          </Typography>

          <Stack
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1.5}
            sx={{ mt: 3 }}
          >
            <Button
              sx={{
                bgcolor: "#E77D00",
                ":hover": { bgcolor: "#E77D00" },
                ...actionBtnStyle,
              }}
              onClick={() => {
                if (type === "afterSearch") {
                  setShowModal(true);
                  dispatch(setRefetch(!refetch));
                } else {
                  handleContinue();
                }
              }}
            >
              {type === "afterSearch"
                ? "Search Again with Current Request"
                : "Revalidating Fare and Continue Booking"}
            </Button>

            <Button
              sx={{
                bgcolor: "var(--primary-color)",
                ":hover": { bgcolor: "var(--primary-color)" },
                ...actionBtnStyle,
              }}
              onClick={handleCancel}
            >
              Back To Search pad
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};


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
      xs: "2.5rem",
      lg: window.innerWidth > 1900 ? "2.5rem" : "1.875rem",
    },
    height: {
      xs: "2.5rem",
      lg: window.innerWidth > 1900 ? "2.5rem" : "1.875rem",
    },
    bgcolor: "#F4F4F4",
    borderRadius: "1.72px",
    color: "var(--primary-color)",
    ...center,
  },
  countText: {
    fontSize: "1.25rem",
    fontWeight: 400,
    color: "var(--primary-color)",
  },
  countTitle: {
    fontSize: "11px",
    fontWeight: 500,
    textAlign: "center",
    mt: "5px",
    color: "var(--secondary-color)",
  },
};

export default TimerLimit;
