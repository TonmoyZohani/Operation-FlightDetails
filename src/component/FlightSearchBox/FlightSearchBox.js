import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";
import "./FlightSearchBox.css";
import SearchWay from "./SearchWay";
import { useLocation } from "react-router-dom";
import FlightOptions from "./FlightOptions";
import { useDispatch, useSelector } from "react-redux";
import { setSearchType, setSegmentCount, setValue } from "./flightSearchSlice";
import { Box, Typography } from "@mui/material";
import useWindowSize from "../../shared/common/useWindowSize";

const FlightSearchBox = ({
  flightState,
  flightAfterSearch,
  selectedPassengers,
  passengers,
  classes,
  bookingId,
  paxDetails,
  vendorPref,
  recentSearch,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [click, setClick] = useState(false);
  const flightData = useSelector((state) => state?.flight);
  const value = flightData?.value || flightState?.value || "oneway";
  const [isDomestic, setIsDomestic] = useState(true);
  const { isMobile } = useWindowSize();

  const handleChange = (_, newValue) => {
    dispatch(setValue(newValue));
    if (flightData?.searchType === "split" && newValue !== "return")
      dispatch(setSearchType("regular"));
  };

  useEffect(() => {
    if (value === "oneway" || value === "return") {
      dispatch(setSegmentCount(1));
      setIsDomestic(false);
    } else if (value === "multicity") {
      const segmentLength = flightState?.fromSegmentLists?.length ?? 2;
      dispatch(setSegmentCount(segmentLength));
      setIsDomestic(false);
    }
  }, [value, dispatch, flightState]);

  return (
    <Box
      className="home-search-box-2"
      sx={{
        width: { xs: "100%" },
        px: {
          xs: location.pathname === "/" ? "1rem" : "1rem",
          sm: location.pathname === "/" ? "1.5rem" : "1.5rem",
          md: location.pathname === "/" ? "2rem" : "2rem",
          lg: location.pathname === "/" ? "0" : "0",
        },
        typography: "body1",
        mt: { xs: 1.2, lg: 0 },
      }}
    >
      <Box
        sx={{
          bgcolor: isMobile ? "" : "transparent",
          color: "#FFF",
          width: { md: "100%", sm: "100%", xs: "100%" },
          borderRadius: "5px 5px 0px 0px",
          button: {
            minHeight: { md: "35px", sm: "30px", xs: "30px" },
            textTransform: "none",
          },
          display: "flex",
          justifyContent: "center",
          "@media (max-width: 1200px)": {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            button: { width: "17%" },
          },
        }}
      >
        {flightAfterSearch === "reissue-search" &&
        location.pathname !== "/dashboard/searchs" ? (
          <Box
            sx={{
              bgcolor: "var(--secondary-color)",
              width: "28%",
              textAlign: "center",
              py: "6px",
              borderRadius: "4px",
              mb: "8px",
            }}
          >
            <Typography>Reissue Search</Typography>
          </Box>
        ) : (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Dashboard Tabs"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", lg: "45%" },
              mb: { lg: "10px" },
              minHeight: "100%",
            }}
          >
            {["oneway", "return", "multicity"].map((tabValue) => (
              <Tab
                key={tabValue}
                label={
                  tabValue === "oneway"
                    ? "One Way"
                    : tabValue === "return"
                      ? "Round Way"
                      : "Multi City"
                }
                value={tabValue}
                sx={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: { xs: "13px" },
                  bgcolor:
                    value === tabValue
                      ? "var(--primary-color)"
                      : location.pathname === "/dashboard/flightaftersearch" ||
                          location.pathname === "/dashboard/split-after-search"
                        ? "#F3F3F3"
                        : "#fff",
                  color: value === tabValue ? "#fff" : "var(--primary-color)",
                }}
              />
            ))}
          </Tabs>
        )}
      </Box>

      <SearchWay
        flightState={flightState}
        iconColor={"#DC143C"}
        bgColor={"#fff"}
        click={click}
        setClick={setClick}
        flightAfterSearch={flightAfterSearch}
        selectedPassengers={selectedPassengers}
        passengers={passengers}
        classes={classes}
        bookingId={bookingId}
        paxDetails={paxDetails}
        vendorPref={vendorPref}
        setIsDomestic={setIsDomestic}
        recentSearch={recentSearch}
      />

      {!isMobile && (
        <FlightOptions
          isDomestic={isDomestic}
          flightAfterSearch={flightAfterSearch}
          tripType={value}
        />
      )}
    </Box>
  );
};

export default FlightSearchBox;
