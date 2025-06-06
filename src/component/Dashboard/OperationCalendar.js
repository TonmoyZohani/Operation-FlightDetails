import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import ServerError from "../Error/ServerError";
import MobileHeader from "../MobileHeader/MobileHeader";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";
import DashboardEventCalendar from "./DashboardEventCalendar";
import { useNavigate } from "react-router-dom";

const OperationCalendar = () => {
  const { jsonHeader } = useAuth();
  const [selectedEvents, setSelectedEvents] = useState({
    events: [],
    date: new Date(),
  });

  const {
    data: pendingData,
    status,
    isError,
    error,
  } = useQuery({
    queryKey: ["user/pending-operation"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/pending-operation`,
        jsonHeader()
      );
      return data?.data;
    },
    retry: false,
  });

  const pendingOperation = pendingData?.pendingOperation
    .map((operation) => ({
      ...operation,
      timeLimit: new Date(operation?.timeLimit),
    }))
    .sort((a, b) => new Date(a?.timeLimit) - new Date(b?.timeLimit));

  return (
    <>
      <MobileHeader
        title={"Operation Calendar"}
        labelType="title"
        labelValue={"Events"}
      />
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "3px",
          p: 3,
          width: { xs: "90%", lg: "100%" },
          mx: "auto",
          mt: { xs: 5, lg: 0 },
          mb: { xs: 10, lg: 0 },
        }}
      >
        {status === "pending" && <CalendarSkeleton />}
        {isError && (
          <Box sx={{ height: "calc(93vh - 150px)" }}>
            <ServerError message={error?.response?.data?.message} />
          </Box>
        )}
        {status === "success" && (
          <Grid container spacing={"20px"}>
            <Grid item md={9} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Typography sx={{ fontSize: "18px", mb: "8px" }}>
                  Operations Calendar
                </Typography>
                <Box
                  sx={{
                    height: "4px",
                    width: "100%",
                    bgcolor: "var(--primary-color)",
                  }}
                ></Box>

                <DashboardEventCalendar
                  pendingData={pendingData}
                  selectedEvents={selectedEvents}
                  setSelectedEvents={setSelectedEvents}
                />
              </Box>
            </Grid>

            <Grid item md={3} xs={12}>
              <Box
                sx={{
                  bgcolor: "#F8F8F8",
                  borderRadius: "4px",
                  height: "100%",
                  // maxHeight: "94%",
                  overflowY: "auto",
                }}
              >
                <Box sx={{ p: "15px 20px", pb: 0 }}>
                  <Typography
                    sx={{ color: "var(--dark-gray)", fontSize: "14px" }}
                  >
                    All Operations
                  </Typography>

                  <Typography sx={{ fontSize: "18px" }}>
                    {moment(selectedEvents?.date).format("Do MMMM YYYY")}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", mb: "8px", color: "#888" }}
                  >
                    Last Operation at:{" "}
                    {moment(
                      pendingOperation[pendingOperation?.length - 1]?.timeLimit
                    ).format("Do MMMM YYYY")}
                  </Typography>
                </Box>

                {selectedEvents?.events?.length > 0 ? (
                  <Box
                    sx={{ px: "20px", maxHeight: "650px", overflowY: "auto" }}
                  >
                    {selectedEvents?.events.map((event, i) => (
                      <React.Fragment key={i}>
                        <SelectedEventCard event={event} />
                      </React.Fragment>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: "70%",
                      ...flexCenter,
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "18px", color: "var(--dark-gray)" }}
                    >
                      No Events Found
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      {/* --- Mobile Bottom Navbar start --- */}
      <BottomNavbar />
      {/* --- Mobile Bottom Navbar end --- */}
    </>
  );
};

const SelectedEventCard = ({ event }) => {
  const navigate = useNavigate();

  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(event?.timeLimit)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(event?.timeLimit));
    }, 1000);

    return () => clearInterval(timer);
  }, [event?.timeLimit]);

  return (
    <>
      <Box
        sx={{
          height: "3px",
          width: "100%",
          bgcolor: "var(--primary-color)",
          my: "10px",
        }}
      ></Box>

      <Box
        sx={{
          bgcolor: event?.colors + 20,
          borderRadius: "3px 3px 0 0",
          color: event?.colors,
          p: "6px 8px",
          mt: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ width: "60%", fontSize: "14px" }}>
          {timeRemaining?.text}
        </Typography>
        <Typography
          onClick={() => {
            navigate(`/dashboard/booking/airtickets/all/${event?.id}`);
          }}
          sx={{
            width: "40%",
            fontSize: "14px",
            textAlign: "end",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          #{event?.bookingId}
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: event?.colors,
          borderRadius: "0 0 3px 3px",
          color: "#fff",
          p: "6px 8px",
        }}
      >
        <Typography
          mb={"4px"}
          sx={{ textTransform: "capitalize", fontSize: "14px" }}
        >
          {event?.title}
        </Typography>
        <Typography>{event?.description}</Typography>
      </Box>
    </>
  );
};

const CalendarSkeleton = () => {
  const props = {
    sx: { borderRadius: "4px" },
    variant: "rectangular",
    animation: "wave",
  };

  return (
    <Grid container columnSpacing={"20px"}>
      <Grid item lg={9} xs={12}>
        <Skeleton {...props} width={"18%"} height={"25px"} />
        <Skeleton
          {...props}
          width={"100%"}
          height={"639px"}
          sx={{ mt: 2.5, borderRadius: "4px" }}
        />
      </Grid>
      <Grid item lg={3} xs={12}>
        <Skeleton
          {...props}
          width={"100%"}
          height={"100%"}
          sx={{ borderRadius: "4px" }}
        />
      </Grid>
    </Grid>
  );
};

export const calculateTimeRemaining = (endTime) => {
  const now = new Date();
  const target = new Date(endTime);
  const difference = target - now;

  if (difference <= 0) {
    return {
      text: "00:00:00 Time Expired",
      difference: 0,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return {
    text: `${hours}:${minutes}:${seconds}`,
    difference,
  };
};

const flexCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default OperationCalendar;
