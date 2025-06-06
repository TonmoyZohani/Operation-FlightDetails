import {
  Box,
  Button,
  Collapse,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ReactComponent as DropDownIcon } from "../../images/svg/dropdown.svg";
import { ReactComponent as RightArrowIcon } from "../../images/svg/rightModifyArrow.svg";
import { ReactComponent as PinIcon } from "../../images/svg/pin.svg";
import moment from "moment";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthProvider";
import TableSkeleton from "../SkeletonLoader/TableSkeleton";
import { useNavigate } from "react-router-dom";
import { convertCamelToTitle } from "../../shared/common/functions";
import NotFound from "../NotFound/NoFound";
import ServerError from "../Error/ServerError";
import { calculateTimeRemaining } from "./OperationCalendar";

const DashboardLive = () => {
  return (
    <Box sx={{ bgcolor: "white", borderRadius: "3px", p: 3 }}>
      {/* Today Booking Stats */}
      <AirBookingStats />

      {/* Total Amount Section */}
      <Grid container columnSpacing={"20px"} mt={3}>
        {[
          "Deposit in Process",
          "Total Due Amount",
          "Today Total Sale Amount",
          "Today Total Profit",
        ].map((item, i) => (
          <Grid key={i} item md={3}>
            <Box
              sx={{
                bgcolor: "#F8F8F8",
                borderRadius: "5px",
                px: "15px",
                py: "10px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "var(--dark-gray)",
                  width: "40%",
                }}
              >
                {item}
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  color: "var(--primary-color)",
                  textAlign: "right",
                }}
              >
                BDT 10,000
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Calendar starts here */}
      <PendingOperations />
    </Box>
  );
};

const AirBookingStats = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <>
      <Box sx={{ bgcolor: "#F8F8F8", borderRadius: "5px", padding: "20px" }}>
        <Grid container columnSpacing={"20px"}>
          <Grid item md={3}>
            <Box>
              <Typography sx={{ fontSize: "18px", color: "var(--text-dark)" }}>
                Air Ticket
                <DropDownIcon
                  fill="var(--text-medium)"
                  style={{ width: "19px", height: "9px", marginLeft: "5px" }}
                />
              </Typography>
              <Typography sx={{ fontSize: "18px", color: "var(--text-dark)" }}>
                Booking Stats Today
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  mt: "15px",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--primary-color)",
                    fontWeight: "500",
                    fontSize: "15px",
                  }}
                >
                  {moment().format("Do MMMM, YYYY")}
                </Typography>
                <CalendarMonthOutlinedIcon
                  sx={{ color: "var(--gray)", fontSize: "20px" }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid container item md={8} columnSpacing={"20px"}>
            {[...new Array(5)].map((_, i) => (
              <Grid key={i} item md={2.4}>
                <StatBox />
              </Grid>
            ))}
          </Grid>

          <Grid item md={1}>
            <Button
              style={{
                backgroundColor: "var(--primary-color)",
                padding: "12px",
                borderRadius: "10px",
                height: "115px",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
              }}
              onClick={handleExpansion}
            >
              <Typography sx={{ fontSize: "13px", color: "white" }}>
                Full <br /> Stats
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Box
                  sx={{
                    ...flexCenter,
                    bgcolor: "white",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                  }}
                >
                  <RightArrowIcon width="10px" />
                </Box>
              </Box>
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        sx={{ width: "100%", transition: "height 1s ease-in-out" }}
      >
        <Box
          sx={{
            bgcolor: "#F8F8F8",
            borderRadius: "5px",
            padding: "20px",
            // mt: 3,
          }}
        >
          {/* Today Booking Stats */}
          <Grid container columnSpacing={"20px"}>
            {[...new Array(7)].map((_, i) => (
              <Grid key={i} item md={12 / 7}>
                <StatBox />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </>
  );
};

const StatBox = () => {
  return (
    <Box
      sx={{
        boxShadow: "0px 0px 7.6px 0px rgba(0, 0, 0, 0.13)",
        padding: "10px",
        borderRadius: "10px",
        height: "115px",
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
      }}
    >
      <Box>
        <Typography
          sx={{ fontSize: "10px", color: "#9C9797", textAlign: "right" }}
        >
          Today
        </Typography>
        <Typography
          sx={{
            fontSize: "11.5px",
            color: "var(--primary-color)",
            fontWeight: "500",
          }}
        >
          Air Ticket
          <br />
          Search
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: "2rem",
          color: "var(--text-medium)",
          textAlign: "right",
        }}
      >
        100
      </Typography>

      <Box
        sx={{
          ...flexCenter,
          bgcolor: "var(--dark-gray)",
          width: "27px",
          height: "27px",
          borderRadius: "50%",
          position: "absolute",
          top: "-12px",
          left: "0",
        }}
      >
        <PinIcon style={{ marginLeft: "1px", marginBottom: "1px" }} />
      </Box>
    </Box>
  );
};

const PendingOperations = () => {
  const { jsonHeader } = useAuth();

  const { data, status, isError, error } = useQuery({
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

  const tabs = data?.pendingOperationCount
    ? Object.keys(data?.pendingOperationCount).map((key) => {
        return {
          label: key,
          value: data?.pendingOperationCount[key],
        };
      })
    : [];

  return (
    <Box mt={6}>
      {status === "pending" && (
        <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
          <TableSkeleton />
        </Box>
      )}

      {isError && (
        <Box
          sx={{
            bgcolor: "white",
            height: "calc(93vh - 150px)",
            borderRadius: "5px",
          }}
        >
          <ServerError message={error?.response?.data?.message} />
        </Box>
      )}

      {status === "success" && (
        <>
          {data?.pendingOperation?.length < 1 ? (
            <Box sx={{ height: "50vh" }}>
              <NotFound />
            </Box>
          ) : (
            <>
              <Box>
                {tabs?.length > 0 && (
                  <Grid container>
                    <Grid container item spacing={1}>
                      {tabs?.map((tab, index) => (
                        <Grid item key={index}>
                          <Button
                            style={
                              tab?.label === "partialBookings"
                                ? activeButton
                                : buttonStyle
                            }
                            sx={{
                              fontSize: { lg: "11px", xs: "11px" },
                              position: "relative",
                            }}
                            // onClick={() =>
                            //   navigate(`${route}/${tab?.value ?? tab?.label}`)
                            // }
                          >
                            {convertCamelToTitle(tab?.label)}
                            <Typography
                              sx={{
                                color: "white",
                                bgcolor: "var(--dark-gray)",
                                height: "22px",
                                width: "22px",
                                position: "absolute",
                                top: "-10px",
                                right: "-5px",
                                borderRadius: "50%",
                                fontSize: "11px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {tab?.value}
                            </Typography>
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
              </Box>
              <TableContainer sx={{ maxHeight: "50vh", mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ borderTop: "1px solid var(--border-color)" }}
                    >
                      {[
                        "Booking Id",
                        "Operation Name",
                        "Booking Details",
                        "Time Limit",
                        "Last Updated At",
                      ].map((head, i) => {
                        return <TableCell key={i}>{head}</TableCell>;
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.pendingOperation?.map((pending, i) => {
                      return (
                        <React.Fragment key={i}>
                          <TableContent pending={pending} />
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </Box>
  );
};

const TableContent = ({ pending }) => {
  const navigate = useNavigate();

  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(pending?.timeLimit)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(pending?.timeLimit));
    }, 1000);

    return () => clearInterval(timer);
  }, [pending?.timeLimit]);

  return (
    <TableRow>
      <TableCell>
        <Button
          onClick={() =>
            navigate(`/dashboard/booking/airtickets/all/${pending?.id}`)
          }
          sx={{ fontSize: "12px", bgcolor: "#e7f3f5", color: "#4D4B4B" }}
        >
          {pending?.bookingId}
        </Button>
      </TableCell>
      <TableCell>
        <span
          style={{
            padding: "5px 10px",
            color: "white",
            borderRadius: "5px",
            backgroundColor:
              pending?.status === "hold"
                ? "#B279B3"
                : pending?.status === "ticketed"
                ? "#52be5a"
                : pending?.status === "void"
                ? "#2b8fd9"
                : pending?.status === "issue in process"
                ? "#be7352"
                : pending?.status === "void request"
                ? "#4999d4"
                : pending?.status === "refund"
                ? "#2bd99f"
                : pending?.status === "refund request"
                ? " #bf7017 "
                : pending?.status === "refund to be confirmed"
                ? "#cf45d8"
                : pending?.status === "refund on process"
                ? "#d84564"
                : pending?.status === "reissue request"
                ? "#4782de "
                : pending?.status === "refunding"
                ? "#f9a168"
                : pending?.status === "reissue on process"
                ? "#53828d"
                : "red",
            fontSize: "12px",
          }}
        >
          {pending?.operationName}
        </span>
      </TableCell>
      <TableCell>
        <Tooltip title={pending?.bookingDetails}>
          {pending?.bookingDetails?.slice(0, 50)}...
        </Tooltip>
      </TableCell>
      <TableCell sx={{ width: "15%" }}>
        {timeRemaining === "Time Expired" ? (
          "Time Expired"
        ) : (
          <Box sx={{ display: "fle", gap: "15px" }}>
            <Typography style={timerStyle(timeRemaining?.difference)}>
              {timeRemaining?.text}
            </Typography>
          </Box>
        )}
      </TableCell>
      <TableCell>
        {moment(pending?.updatedAt).format("DD MMM YYYY, hh:mm A")}
      </TableCell>
    </TableRow>
  );
};

const flexCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const timerStyle = (value) => {
  const dayInMs = 24 * 60 * 60 * 1000;

  return {
    color:
      value < dayInMs
        ? "red"
        : value > dayInMs && value < dayInMs * 2
        ? "var(--secondary-color)"
        : value > dayInMs * 2
        ? "green"
        : "#F4F4F4",
  };
};
const buttonStyle = {
  backgroundColor: "#f8f8f8",
  color: "var(--dark-gray)",
  minWidth: "150px",
};

const activeButton = {
  backgroundColor: "var(--primary-color)",
  color: "white",
  minWidth: "150px",
};

export default DashboardLive;
