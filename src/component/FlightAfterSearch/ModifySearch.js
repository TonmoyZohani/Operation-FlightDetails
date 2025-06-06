import { TabContext } from "@material-ui/lab";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";
import {
  setAppliedFilters,
  setCmsData,
  setFilterValue,
  setKeyNull,
  setModifyCheck,
  setSelectedSeats,
} from "../FlightSearchBox/flighAfterSearchSlice";
import FlightSearchBox from "../FlightSearchBox/FlightSearchBox";
import {
  decrementDate,
  incrementDate,
  modifySearchState,
  setSearchType,
} from "../FlightSearchBox/flightSearchSlice";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import SettingsIcon from "@mui/icons-material/Settings";
import { CustomSwitch } from "../../style/style";

const ModifySearch = ({
  flightState,
  adultCount,
  childCount,
  infantCount,
  value,
  deptDate,
  arrDate,
  searchType,
  fareType,
  fromSegmentLists,
  toSegmentLists,
  isLoading,
  selectedAirlines,
  departureDates,
  arrivalDates,
  cabin,
  flightAfterSearch,
  selectedPassengers,
  passengers,
  vendorPref,
  classes,
  bookingId,
  paxDetails,
  progressAfter,
  status,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const flightData = useSelector((state) => state.flight);
  const { modifycheck } = useSelector((state) => state.flightAfter);
  const { studentFare, umrahFare, seamanFare } = flightData;
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [openFare, setOpenFare] = useState(false);

  const { data: userCms } = useQuery({
    queryKey: ["user/user-cms"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/user-cms`,
          jsonHeader()
        );
        const responseData = response?.data;
        if (responseData?.success === true) {
          dispatch(setCmsData({ ...responseData?.data }));
          return responseData?.data;
        }
      } catch (err) {
        console.error(err.message);
      }
    },
  });

  const handleSearch = (type) => {
    const createSegment = (from, to, date) => ({
      departure: from?.code,
      arrival: to?.code,
      departureDate:
        type === "forward"
          ? moment(date).add(1, "day").format("YYYY-MM-DD")
          : type === "back"
            ? moment(date).subtract(1, "day").format("YYYY-MM-DD")
            : moment(date).format("YYYY-MM-DD"),
    });

    // return;
    const segmentsListArr = [];

    for (let i = 0; i < flightData.segmentCount; i++) {
      segmentsListArr.push(
        createSegment(fromSegmentLists[i], toSegmentLists[i], deptDate)
      );

      if (value === "return") {
        segmentsListArr.push(
          createSegment(
            toSegmentLists[i],
            fromSegmentLists[i],
            flightData.arrivalDates[i]
          )
        );
      }
    }

    navigate(
      (type === "forward" || type === "back" ? searchType : type) === "split"
        ? "/dashboard/split-after-search"
        : "/dashboard/flightaftersearch",
      {
        state: {
          adultCount,
          childCount,
          infantCount,
          cabin,
          vendorPref:
            selectedAirlines.length > 0
              ? selectedAirlines.map((airline) => airline?.value)
              : vendorPref,
          studentFare,
          selectedAirlines,
          umrahFare,
          seamanFare,
          segmentsList: segmentsListArr,
          searchType: type === "forward" || type === "back" ? searchType : type,
          fareType,
          fromSegmentLists: fromSegmentLists,
          toSegmentLists: toSegmentLists,
          departureDates,
          arrivalDates,
          value: value,
          paxDetails: paxDetails || [],
          bookingId: bookingId || [],
          classes: classes || [],
          selectedPassengers: selectedPassengers || [],
          flightAfterSearch: flightAfterSearch,
          passengers: passengers,
        },
      }
    );

    dispatch(setKeyNull());
    dispatch(setFilterValue({}));
    dispatch(setAppliedFilters([]));
    dispatch(setModifyCheck(false));
  };

  const handleState = () => {
    dispatch(modifySearchState(flightState));
  };

  return (
    <>
      <Grid
        container
        sx={{
          width: "100%",
          bgcolor: "#fff",
          height: "60px",
          borderRadius: "3px",
          display: "flex",
          alignItems: "center",
          px: "12px",
        }}
      >
        <Grid
          container
          item
          lg={10}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Grid item lg={value === "return" ? 2.1 : 2.3}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--secondary-color)",
              }}
            >
              {fromSegmentLists[0]?.address}
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "gray" }}>
              {fromSegmentLists[0]?.name?.length > 30
                ? `${fromSegmentLists[0]?.name.slice(0, 30)}...`
                : fromSegmentLists[0]?.name}
            </Typography>
          </Grid>
          <Grid item lg={0.5}>
            <LocalAirportIcon
              sx={{
                color: "var(--primary-color)",
                transform: "rotate(90deg)",
              }}
            />
          </Grid>
          <Grid item lg={value == "return" ? 2.1 : 2.3}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--secondary-color)",
              }}
            >
              {value === "multicity"
                ? toSegmentLists[toSegmentLists?.length - 1]?.address
                : toSegmentLists[0]?.address}
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "gray" }}>
              {value === "multicity"
                ? toSegmentLists[toSegmentLists?.length - 1]?.name?.length > 30
                  ? `${toSegmentLists[toSegmentLists.length - 1]?.name.slice(
                      0,
                      30
                    )}...`
                  : toSegmentLists[toSegmentLists.length - 1]?.name
                : toSegmentLists[0]?.name?.length > 30
                  ? `${toSegmentLists[0]?.name.slice(0, 30)}...`
                  : toSegmentLists[0]?.name}
            </Typography>
          </Grid>

          <Grid item lg={value == "return" ? 1.5 : 1.6}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--secondary-color)",
              }}
            >
              Departure
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "gray" }}>
              {moment(deptDate).format("ddd, Do MMM, YYYY")}
            </Typography>
          </Grid>

          <Grid
            item
            sx={{ display: value === "return" ? "block" : "none" }}
            lg={1.5}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--secondary-color)",
              }}
            >
              Arrival
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "gray" }}>
              {moment(arrDate).format("ddd, Do MMM, YYYY")}
            </Typography>
          </Grid>

          <Grid
            item
            lg={1.3}
            sx={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Box
              className="arrow-btn"
              sx={{
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              <ArrowBackIosIcon
                onClick={() => {
                  if (!isLoading) {
                    dispatch(decrementDate());
                    handleSearch("back");
                  }
                }}
                sx={{
                  color: "var(--primary-color)",
                  fontSize: "22px",
                  pl: "5px",
                }}
              />
            </Box>

            <Box
              className="arrow-btn"
              sx={{
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              <ArrowForwardIosIcon
                onClick={() => {
                  if (!isLoading) {
                    dispatch(incrementDate());
                    handleSearch("forward");
                  }
                }}
                sx={{
                  color: "var(--primary-color)",
                  fontSize: "22px",
                  pl: "5px",
                }}
              />
            </Box>
          </Grid>

          <Grid item lg={1.8}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--secondary-color)",
              }}
            >
              Travelers & Class
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "gray" }}>
              {adultCount} Adult
              {childCount.length > 0 && `, ${childCount.length} Child`}
              {infantCount > 0 && `, ${infantCount} Infant`}, {cabin}
            </Typography>
          </Grid>

          <Grid
            item
            lg={1.2}
            sx={{
              display:
                value === "return" || value === "multicity" ? "block" : "none",
            }}
          >
            {/* <Tooltip
              title={`Toogle To ${searchType === "split" ? "Regular" : "Split"} Search`}
            >
              <Box>
                <FormControlLabel
                  onClick={(e) => {
                    // console.log(
                    //   e.target.checked === true ? "split" : "regular"
                    // );
                    // return;
                    setSearchType(
                      e.target.checked === true ? "split" : "regular"
                    );
                    handleSearch(
                      e.target.checked === true ? "split" : "regular"
                    );
                  }}
                  control={
                    <CustomSwitch
                      checked={searchType === "split"}
                      sx={{ mx: "3px" }}
                    />
                  }
                  labelPlacement="start"
                />
              </Box>
            </Tooltip> */}

            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                handleSearch(e.target.value);
              }}
              style={{
                fontSize: "12px",
                border: "1px solid var(--secondary-color)",
                borderRadius: "3px",
                padding: "0 5px",
                outline: "none",
                color: "var(--secondary-color)",
                width: "92%",
                height: "35px",
              }}
            >
              <option value="regular">Regular Search</option>
              <option value="split">Split Search</option>
            </select>
          </Grid>
        </Grid>
        <Grid
          container
          item
          lg={2}
          sx={{ display: "flex", justifyContent: "end" }}
        >
          <Grid item xs={4.5}>
            <ClickAwayListener
              onClickAway={() => openFare && setOpenFare(false)}
            >
              <Box sx={{ position: "relative" }}>
                <Button
                  onClick={() => setOpenFare(!openFare)}
                  style={{
                    backgroundColor: "var(--secondary-color)",
                    color: "#fff",
                    height: "35px",
                    borderRadius: "3px",
                    fontSize: "12px",
                    textTransform: "none",
                    display:
                      flightAfterSearch === "reissue-search" ? "none" : "block",
                  }}
                  disabled={isLoading}
                >
                  View As
                </Button>

                {openFare && (
                  <Box
                    sx={{
                      position: "absolute",
                      zIndex: "1000",
                      top: "120%",
                    }}
                  >
                    <SelectFare
                      setOpenFare={setOpenFare}
                      showToast={showToast}
                    />
                  </Box>
                )}
              </Box>
            </ClickAwayListener>
          </Grid>
          <Grid item xs={7.5}>
            {/* Normal Button */}
            {!(isLoading || progressAfter < 100 || status === "pending") && (
              <Button
                onClick={() => {
                  dispatch(setModifyCheck(!modifycheck));
                  dispatch(setSelectedSeats([]));
                  handleState();
                }}
                style={{
                  backgroundColor:
                    flightAfterSearch === "reissue-search"
                      ? "var(--secondary-color)"
                      : "var(--primary-color)",
                  color: "#fff",
                  height: "35px",
                  borderRadius: "3px",
                  fontSize: "12px",
                  padding: "0px 13px",
                  textTransform: "none",
                  width: "100%",
                }}
              >
                {modifycheck ? "Close Pad" : "Modify Search"}
              </Button>
            )}

            {/* Loading Button */}
            {(isLoading || progressAfter < 100 || status === "pending") && (
              <Button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "#fff",
                  height: "35px",
                  borderRadius: "3px",
                  fontSize: "12px",
                  padding: "0px 13px",
                  textTransform: "none",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                disabled
              >
                <span style={{ fontWeight: "bold" }}>Searching</span>
                <Box
                  sx={{
                    display: "inline-flex",
                    animation: "spin 1s linear infinite",
                    "@keyframes spin": {
                      from: { transform: "rotate(0deg)" },
                      to: { transform: "rotate(360deg)" },
                    },
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </Box>
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Accordion
        expanded={modifycheck}
        sx={{
          "&.Mui-expanded": {
            margin: "0 0",
            border: "none",
          },
          margin: "0",
          boxShadow: "none",
          padding: 0,
        }}
      >
        <AccordionSummary
          id="panel2a-header"
          sx={{
            margin: "0",
            padding: "0",
            display: "none",
          }}
        ></AccordionSummary>
        <AccordionDetails
          sx={{
            paddingTop: "0",
            border: "none",
          }}
        >
          <TabContext>
            <FlightSearchBox
              flightState={flightState}
              flightAfterSearch={flightAfterSearch}
              selectedPassengers={selectedPassengers}
              passengers={passengers}
              vendorPref={vendorPref}
              classes={classes}
              bookingId={bookingId}
              paxDetails={paxDetails}
            />
          </TabContext>
        </AccordionDetails>
      </Accordion>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </>
  );
};

const SelectFare = ({ setOpenFare, showToast }) => {
  const dispatch = useDispatch();
  const { jsonHeader } = useAuth();
  const { cmsData } = useSelector((state) => state.flightAfter);

  const [isLoading, setIsLoading] = useState();
  const [selectedFare, setSelectedFare] = useState(() => {
    if (cmsData.agentFare) return "agentFare";
    if (cmsData.commissionFare) return "commissionFare";
    if (cmsData.customerFare) return "customerFare";
    return "";
  });

  const handleFareChange = async (event) => {
    setIsLoading(true);
    const newFare = event.target.value;
    setSelectedFare(newFare);

    const body = {
      agentFare: newFare === "agentFare",
      commissionFare: newFare === "commissionFare",
      customerFare: newFare === "customerFare",
    };

    // dispatch(.({ ...cmsData, ...body }));

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/user-cms`,
        body,
        jsonHeader()
      );
      const responseData = response?.data;
      if (responseData?.success === true) {
        dispatch(setCmsData({ ...responseData?.data, ...body }));
        setOpenFare(false);
        showToast("success", responseData?.message);
      }
    } catch (err) {
      console.error(err.message);
      const message = err?.response?.data?.message || "An error occurred";
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        width: "185px",
        px: 2,
        py: 1.5,
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
        height: "150px",
        borderRadius: "5px",
      }}
    >
      {isLoading ? (
        <Box>
          <Skeleton variant="text" width={150} height={40} />
          <Skeleton variant="text" width={150} height={40} />
          <Skeleton variant="text" width={150} height={40} />
        </Box>
      ) : (
        <>
          <FormControl>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: "600",
                mb: 1,
                color: "var(--primary-color)",
              }}
            >
              View As
            </Typography>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={selectedFare}
              onChange={handleFareChange}
              name="radio-buttons-group"
            >
              {allFares.map((item, i) => (
                <FormControlLabel
                  key={i}
                  control={<Radio />}
                  label={<span style={{ fontSize: "13px" }}>{item.label}</span>}
                  value={item.value}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </>
      )}
    </Box>
  );
};

export const allFares = [
  {
    label: "Agent",
    value: "agentFare",
    priceProp: "agentPrice",
  },
  {
    label: "Customer",
    value: "customerFare",
    priceProp: "clientPrice",
  },
  {
    label: "Commission Fare",
    value: "commissionFare",
    priceProp: "commission",
  },
];

export default ModifySearch;
