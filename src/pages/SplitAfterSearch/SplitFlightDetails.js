import { Box, Button, Grid, Typography } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import { useState } from "react";
import FlightDetailsSection from "../../component/FlightAfterSearch/FlightDetailsSection";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SplitFlightDetails = ({
  selectedFlightArr,
  totalPassenger,
  segmentsList,
  cabin,
  searchType,
  flightAfterSearch,
  flightData,
  tabType,
}) => {
  const navigate = useNavigate();

  const [flightBrand, setFlightBrand] = useState(
    selectedFlightArr.map((flight) => [flight?.brands[0]])
  );
  const { splitModifiedBrands, selectedSplitBrandsRed } = useSelector(
    (state) => state.flightAfter
  );

  console.log(splitModifiedBrands);
  console.log(selectedFlightArr[0]?.brands);

  const handleSplitAndBooking = () => {
    navigate("/dashboard/airbooking", {
      state: {
        flightData: selectedFlightArr,
        crrItenary: 0,
        searchType: searchType,
        totalPassenger,
        segmentsList,
        brand: selectedSplitBrandsRed?.flat(),
        fareRules: splitModifiedBrands,
        reissuePassengers: [],
        flightAfterSearch: "normal-search",
        paxDetails: [],
        bookingId: null,
        flightBrand,
        cabin,
      },
    });
  };

  // const handleSplitAndBooking = () => {
  //   navigate("/dashboard/airbooking", {
  //     state: {
  //       flightData,
  //       crrItenary,
  //       searchType,
  //       totalPassenger,
  //       brand: selectedSplitBrands?.flat(),
  //       cabin,
  //       segmentsList,
  //       fareRules: modifiedBrands,
  //       reissuePassengers: reissuePassengers || [],
  //       flightAfterSearch,
  //       paxDetails: paxDetails || [],
  //       bookingId: bookingId || null,
  //       flightBrand,
  //     },
  //   });
  // };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
      }}
    >
      <Box sx={{ maxHeight: "88vh", overflow: "auto" }}>
        <FlightDetailsTab
          selectedFlightArr={selectedFlightArr}
          totalPassenger={totalPassenger}
          segmentsList={segmentsList}
          cabin={cabin}
          searchType={searchType}
          flightAfterSearch={flightAfterSearch}
          flightBrand={flightBrand}
          setFlightBrand={setFlightBrand}
          tabType={tabType}
        />
      </Box>

      <Box
        sx={{
          bgcolor: "var(--primary-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "80px",
          px: 3,
        }}
      >
        <Box>
          <Typography sx={{ color: "#fff", fontSize: "12px" }}>
            Gross Fare
          </Typography>
          <Typography sx={{ color: "#fff", fontSize: "22px" }}>
            {(
              selectedSplitBrandsRed
                .flat()
                .reduce((total, item) => total + item?.agentPrice, 0) || 0
            )?.toLocaleString("en-IN")}{" "}
            BDT
          </Typography>
        </Box>
        <Button
          sx={{
            bgcolor: "red",
            textTransform: "capitalize",
            minWidth: "120px",
            color: "white",
          }}
          onClick={() => handleSplitAndBooking()}
        >
          Proceed And Book
        </Button>
      </Box>
    </Box>
  );
};

const FlightDetailsTab = ({
  selectedFlightArr,
  totalPassenger,
  segmentsList,
  cabin,
  searchType,
  flightAfterSearch,
  flightBrand,
  setFlightBrand,
}) => {
  const [crrItenary, setCrrItenary] = useState(0);
  const flightData = selectedFlightArr?.at(crrItenary);
  const [fareSummaryFlightData, setFareSummaryFlightData] =
    useState(flightData);

  return (
    <>
      <FlightDetailsSection
        flightBrand={flightBrand}
        setFlightBrand={setFlightBrand}
        // flightData={flightData}
        flightAfterSearch={flightAfterSearch}
        searchType={searchType}
        totalPassenger={totalPassenger}
        segmentsList={segmentsList}
        cabin={cabin}
        fareSummaryFlightData={fareSummaryFlightData}
        setFareSummaryFlightData={setFareSummaryFlightData}
        tabType={"flight"}
        fareCard={"newFare"}
        splitFlightArr={selectedFlightArr}
        crrItenary={crrItenary}
        setCrrItenary={setCrrItenary}
      />
    </>
  );
};

export const alignCenter = { display: "flex", alignItems: "center" };

export const underLine = { height: "3px", width: "100%", mt: "5px" };

export default SplitFlightDetails;
