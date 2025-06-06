import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../../shared/common/useWindowSize";

const BookingHeader = ({
  tabs = [],
  handleTypeChange,
  type,
  retriveData: bookingData,
  bookingType = "after",
}) => {
  const { isMobile } = useWindowSize();
  const retriveData =
    bookingType === "before" ? bookingData : bookingData?.details;
  const navigate = useNavigate();

  const totalPerson = Array.isArray(retriveData?.paxDetails)
  ? retriveData.paxDetails.length
  : retriveData?.priceBreakdown?.reduce((acc, passenger) => acc + (passenger?.paxCount || 0), 0) || 0;

  const routes = retriveData?.route || [];

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: {
          xs: "block",
          lg: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          height: "150px",

          bgcolor: "var(--secondary-color)",
          width: "100%",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: "90%",
            height: "100%",
            mx: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon
              sx={{ fontSize: "1.5rem", color: "#FFFFFF" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                lg: "column",
              },
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "18px", color: "#fff", textAlign: "center" }}
            >
              {retriveData?.bookingId}{" "}
              <span
                style={{
                  display: !retriveData?.bookingId ? "inline-block" : "none",
                }}
              >
                {(() => {
                  const routes = retriveData?.route || [];
                  const length = routes?.length;
                  if (length === 1) {
                    return (
                      <>
                        {routes[0]?.departure}-{routes[0]?.arrival}
                      </>
                    );
                  } else if (length === 2) {
                    return (
                      <>
                        {routes[0]?.departure}-{routes[1]?.departure}-
                        {routes[1]?.arrival}
                      </>
                    );
                  } else if (length > 2) {
                    return (
                      <>
                        {routes[0]?.departure}-{routes[0]?.arrival}
                        {routes.slice(1).map((route, index) => (
                          <span key={index}>-{route.arrival}</span>
                        ))}
                      </>
                    );
                  }
                  return null;
                })()}
              </span>{" "}
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#7C92AC" }}>
              <span
                style={{
                  display: retriveData?.bookingId ? "none" : "inline-block",
                }}
              >
                {moment(routes[0]?.departureDate).format("Do MMM, YYYY")} |{" "}
              </span>
              <span
                style={{
                  display: !retriveData?.bookingId ? "none" : "inline-block",
                }}
              >
                {(() => {
                  const routes = retriveData?.route || [];
                  const length = routes?.length;
                  if (length === 1) {
                    return (
                      <>
                        {routes[0]?.departure}-{routes[0]?.arrival}
                      </>
                    );
                  } else if (length === 2) {
                    return (
                      <>
                        {routes[0]?.departure}-{routes[1]?.departure}-
                        {routes[1]?.arrival}
                      </>
                    );
                  } else if (length > 2) {
                    return (
                      <>
                        {routes[0]?.departure}-{routes[0]?.arrival}
                        {routes.slice(1).map((route, index) => (
                          <span key={index}>-{route.arrival}</span>
                        ))}
                      </>
                    );
                  }
                  return null;
                })()}
              </span>{" "}
              <span style={{ textTransform: "capitalize" }}>
                {totalPerson} Person
              </span>{" "}
              <span style={{ textTransform: "capitalize" }}>
                | {bookingData?.searchBooking?.cabin || bookingData?.class}
              </span>{" "}
            </Typography>
          </Box>
          <Box>
            <SearchIcon
              onClick={() => navigate("/dashboard/searchs")}
              sx={{ fontSize: "1.5rem", color: "#FFFFFF" }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: {
              xs: "100%",
            },
            height: { xs: "40px" },
            m: {
              md: "0px auto 20px",
              sm: "0px auto 10px",
              xs: "0px auto 0px",
            },
            borderRadius: isMobile ? "2px" : "5px",
            overflow: "hidden",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            bottom: {
              xs: "-20px",
              sm: "-30px",
              md: "-40px",
            },
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Select
            value={type}
            onChange={handleTypeChange}
            displayEmpty
            inputProps={{ "aria-label": "Select Type" }}
            IconComponent={ArrowDropDownIcon}
            sx={{
              width: "90%",
              height: "100%",
              bgcolor: "var(--primary-color)",
              color: "white",
              textAlign: "left",
              py: 1,
              "&:focus": {
                outline: "none",
              },
              "& .MuiSelect-icon": {
                color: "white",
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 250,
                  overflowY: "auto",
                },
              },
            }}
          >
            {tabs?.map((tab, index) => (
              <MenuItem
                key={index}
                value={tab?.value}
                sx={{ textTransform: "capitalize" }}
              >
                {tab?.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingHeader;
