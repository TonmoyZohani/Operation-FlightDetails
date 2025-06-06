import { Box, MenuItem, Select, Typography, Skeleton } from "@mui/material";
import React from "react";
import { isMobile } from "../../../shared/StaticData/Responsive";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const QueueHeader = ({ tabs = [], handleTypeChange, type, retriveData }) => {
  const navigate = useNavigate();
  const totalPerson = retriveData?.details?.passengers?.reduce(
    (acc, passenger) => {
      return acc + passenger.count;
    },
    0
  );
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: { xs: "block", lg: "none" },
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
          <ArrowBackIosNewIcon
            onClick={() => navigate("/dashboard/booking/airtickets/all")}
            sx={{ fontSize: "1.5rem", color: "#FFFFFF" }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "130px",
            }}
          >
            {retriveData ? (
              <Typography
                sx={{ fontSize: "18px", color: "#fff", textAlign: "center" }}
              >
                {retriveData?.bookingId}
              </Typography>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Skeleton sx={{ width: "50%" }} />
              </Box>
            )}

            {retriveData ? (
              <Typography
                sx={{ fontSize: "13px", color: "#7C92AC", textAlign: "center" }}
              >
                <span style={{}}>
                  {(() => {
                    const routes = retriveData?.details?.route || [];
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
                  {totalPerson} {retriveData ? "Person" : ""}
                </span>{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {retriveData?.searchBooking?.cabin}
                </span>{" "}
              </Typography>
            ) : (
              <Skeleton />
            )}
          </Box>
          <SearchIcon
            onClick={() => navigate("/dashboard/searchs")}
            sx={{ fontSize: "1.5rem", color: "#FFFFFF" }}
          />
        </Box>

        <Box
          sx={{
            width: {
              xs: "100%",
            },
            height: { xs: "40px" },
            borderRadius: isMobile ? "2px" : "5px",
            overflow: "hidden",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            bottom: "-20px",
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
              textTransform: "capitalize",
              py: 1,
              "&:focus": {
                outline: "none",
              },
              "& .MuiSelect-icon": {
                color: "white",
              },
            }}
          >
            {tabs?.map((tab, index) => (
              <MenuItem
                key={index}
                value={tab?.value}
                sx={{ textTransform: "capitalize" }}
              >
                <Typography
                  sx={{ textTransform: "uppercase", fontSize: "14px" }}
                >
                  {" "}
                  {tab?.label}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export default QueueHeader;
