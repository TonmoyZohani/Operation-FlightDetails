import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import useWindowSize from "../../shared/common/useWindowSize";
import CustomToast from "../Alert/CustomToast";
import {
  setAdvancedFlightData,
  setAdvancedModifiedBrands,
  setAllFareRules,
  setAlreadyButtonClicked,
  setBookable,
  setIsBookable,
  setModifiedSplitBarnds,
  setPriceFlagFalse,
  setSelectedSeats,
  setShouldCallAirPrice,
  setViewButtonShow,
} from "../FlightSearchBox/flighAfterSearchSlice";
import MobileAfterViewFareCard from "./MobileAfterViewFareCard";
import NewViewFareCard from "./NewViewFareCard";
import AdvancedAirpriceCard from "./AdvancedAirpriceCard";
import { useQuery } from "@tanstack/react-query";

const ViewFare = ({
  flightData,
  crrItenary,
  data,
  searchType,
  totalPassenger,
  segmentsList,
  cabin,
  reissuePassengers,
  paxDetails,
  bookingId,
  flightAfterSearch,
  showMobile,
  flightBrand,
  setFlightBrand,
  fareCard,
  showDetails,
  selectedSplitBrands,
  advancedSelectedSeats,

  
  updatedBrandsByFlightIndex,
  crrFlightData,
  handleBrandClick,
  brandsByFlight
}) => {
  const hasShownErrorToast = useRef(false);
  const { jsonHeader } = useAuth();
  const [advancedLoading, setAdvancedLoading] = useState(false);
  const [isFareLoading, setIsFareLoading] = useState(false);
  const [airPriceLoading, setAirPriceLoading] = useState("");
  const [advanceSearchResult, setAdvanceSearchResult] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [modifiedBrands, setModifiedBrands] = useState(
    flightData[crrItenary]?.brands
  );
  const [errorMessage, setErrorMessage] = useState("");
  // const [airPriceLoading, setAirPriceLoading] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { cmsData } = useSelector((state) => state.flightAfter) || {};
  const { checkUnAuthorized } = useUnAuthorized();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    shouldCallAirPrice,
    advancedFlightData,
    advnacedModifiedBrands,
    selectedSeats,
    alreadyButtonClicked,
  } = useSelector((state) => state.flightAfter);
  const { isMobile } = useWindowSize();
  const hasInitializedSeats = useRef(false);



  useEffect(() => {
    if (seatMapData) {
      setAdvanceSearchResult(seatMapData.length > 0 ? seatMapData : []);
    }
  }, [seatMapData]);


  const handleFetchAdvancedBooking = () => {
    navigate("/dashboard/airbooking", {
      state: {
        flightData: advancedFlightData,
        searchType,
        totalPassenger,
        brand: modifiedBrands[0],
        cabin,
        segmentsList,
        fareRules: modifiedBrands,
        selectedSeats,
        reissuePassengers: reissuePassengers || [],
        flightAfterSearch: flightAfterSearch,
        paxDetails: paxDetails || [],
        bookingId: bookingId || [],
      },
    });
  };

  // Fetching fare rules (regular/split/reissue)

  return (
    <Box sx={{ py: { xs: "15px", md: 0 } }}>
      {searchType !== "advanced" && <AirlineChargeNotice />}

      <Grid container sx={{ px: { lg: "15px" }, flexGrow: 1 }}>
        <Grid item xs={12} lg={12} sx={{ width: { xs: "100%", lg: "600px" } }}>
          {searchType === "advanced" ? (
            <AdvancedAirpriceCard
              flightData={advancedFlightData}
              totalPassenger={totalPassenger}
              cabin={cabin}
              segmentsList={segmentsList}
              seatLoading={seatLoading}
              isReset={isReset}
              advanceSearchResult={advanceSearchResult}
              setIsReset={setIsReset}
              cmsData={cmsData}
              searchType={searchType}
              flightBrand={flightBrand}
              setFlightBrand={setFlightBrand}
              flightAfterSearch={flightAfterSearch}
              advancedLoading={advancedLoading}
              handleFetchAdvancedBooking={handleFetchAdvancedBooking}
              fareCard={fareCard}
              handleSeatAirprice={handleSeatAirprice}
              crrItenary={crrItenary}
              showDetails={showDetails}
              airPriceLoading={airPriceLoading}
            />
          ) : isMobile ? (
            <MobileAfterViewFareCard
              flightData={flightData}
              modifiedBrands={modifiedBrands}
              totalPassenger={totalPassenger}
              segmentsList={segmentsList}
              cabin={cabin}
              searchType={searchType}
              isFareLoading={isFareLoading}
              airPriceLoading={airPriceLoading}
              setAirPriceLoading={setAirPriceLoading}
              // handleFetchAndBooking={handleFetchAndBooking}
              flightAfterSearch={flightAfterSearch}
              cmsData={cmsData}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              flightBrand={flightBrand}
              setFlightBrand={setFlightBrand}
            />
          ) : (
            <NewViewFareCard
              flightData={flightData}
              modifiedBrands={modifiedBrands[crrItenary]}
              totalPassenger={totalPassenger}
              segmentsList={segmentsList}
              cabin={cabin}
              searchType={searchType}
              isFareLoading={isFareLoading}
              airPriceLoading={airPriceLoading}
              setAirPriceLoading={setAirPriceLoading}
              handleFetchAndBooking={handleFetchAndBooking}
              flightAfterSearch={flightAfterSearch}
              cmsData={cmsData}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              flightBrand={flightBrand}
              setFlightBrand={setFlightBrand}
              crrItenary={crrItenary}

              // modifiedBrands={updatedBrandsByFlightIndex[crrFlightData]}
              // handleBrandClick={handleBrandClick}

            />
          )}
        </Grid>
      </Grid>

      {/* Bottom Button Section */}
      {/* {searchType === "split" && (
        <Box
          sx={{
            mt: "auto", // Pushes this box to the bottom
            bgcolor: "var(--primary-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
            width: "100%",
            px: 3,
          }}
        >
          <Box>
            <Typography sx={{ color: "#fff", fontSize: "12px" }}>
              Gross Fare
            </Typography>
            <Typography sx={{ color: "#fff", fontSize: "22px" }}>
              10000 BDT
            </Typography>
          </Box>
          {searchType === "split" && (
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
          )}
        </Box>
      )} */}

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

export const AirlineChargeNotice = () => {
  return (
    <Box
      sx={{
        px: "15px",
        pt: {
          xs: "15px",
          lg: 0,
        },
        mb: "18px",
        ".MuiSvgIcon-root": { color: "var(--secondary-color)" },
      }}
    >
      <Alert
        severity="info"
        sx={{
          border: "1px solid var(--secondary-color)",
          bgcolor: "#E5F6FD",
          color: "var(--secondary-color)",
          fontSize: "12px",
          padding: "0px 10px",
        }}
      >
        <span style={{ fontWeight: "600" }}>Airlines Charges Notes:</span>{" "}
        Airline fees are estimates and may not be exact. Fly Far International
        does not ensure the accuracy of this information. All fees are listed
        per passenger. Cancellation and date change fees apply only if the same
        airline is selected for the new date. Any fare difference between the
        original and new booking will be charged to the user.
      </Alert>
    </Box>
  );
};

export default ViewFare;
