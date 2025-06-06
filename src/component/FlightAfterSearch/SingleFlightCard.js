import {
  Box,
  Button,
  Typography,
  Tooltip,
  Zoom,
  styled,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import "./FlightAfterSearch.css";
import Collapse from "@mui/material/Collapse";
import { useEffect, useState } from "react";
import FlightInfoCard from "./FlightInfoCard";
import FlightDetailsSection from "./FlightDetailsSection";
import ErrorIcon from "@mui/icons-material/Error";
import ReplyIcon from "@mui/icons-material/Reply";
import QuotationShare from "./QuotationShare";
import { primaryBtn } from "../../shared/common/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdvancedFilter,
  setAdvancedModifiedBrands,
  setAlreadyButtonClicked,
  setAppliedFilters,
  setFilterValue,
  setKeyNull,
  setModifyCheck,
  setSelectedSeats,
  setShouldCallAirPrice,
  setTabType,
} from "../FlightSearchBox/flighAfterSearchSlice";
import BaggageTooltip from "./BaggageTooltip";
import FareTooltip from "./FareTooltip";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const singleCardBoxStyle = {
  width: "fit-content",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: "4px",
  px: "8px",
  fontWeight: "600",
  borderRadius: "2px",
};

const SingleFlightCard = ({
  flightData,
  searchType,
  totalPassenger,
  segmentsList,
  cabin,
  flightAfterSearch,
  reissuePassengers,
  paxDetails,
  bookingId,
  filterPriceValue,
  filterValue,
  firstValue,
  alternateDateFilter,
  setAlternateDateFilter,
  flightState,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showViewFare, setShowViewFare] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);
  const [flightBrand, setFlightBrand] = useState();
  const { cmsData, tabTypeRed } = useSelector((state) => state.flightAfter);
  // const [tabType, setTabType] = useState("");
  const navigate = useNavigate();
  const [fareSummaryFlightData, setFareSummaryFlightData] =
    useState(flightData);
  const dispatch = useDispatch();

  // Code In Home
  const [flightDataArr,setFlightDataArr] = useState([flightData])

  useEffect(() => {
    if (flightData?.brands?.length) {
      setFlightBrand([[flightData?.brands[0]]]);
    }
  }, [flightData]);

  const {
    adultCount,
    childCount,
    infantCount,
    value,
    selectedAirlines,
    fareType,
    fromSegmentLists,
    toSegmentLists,
    departureDates,
    arrivalDates,
    classes,
    vendorPref,
    selectedPassengers = [],
    passengers = [],
    studentFare,
    umrahFare,
    seamanFare,
  } = flightState;

  const handleState = () => {
    navigate("/dashboard/flightaftersearch", {
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
        segmentsList: [
          {
            ...segmentsList[0],
            departureDate: flightData?.cityCount[0][0]?.departureDate,
          },
          ...segmentsList.slice(1),
        ],
        searchType,
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
    });

    setAlternateDateFilter(false);
    dispatch(setAdvancedFilter("airlines"));
    dispatch(setKeyNull());
    dispatch(setFilterValue({}));
    dispatch(setAppliedFilters([]));
    dispatch(setModifyCheck(false));
  };

  const isShowTransitVisa = flightData?.cityCount
    .map((city) => {
      return city.filter(() => city.length > 2);
    })
    ?.flat()
    .some((item) => item?.visa);

  const transitVisa =
    flightData?.cityCount?.flat().find((item) => item?.visa) || {};

  // console.log("Flight Data", flightData);

  return (
    <>
      <Grid
        container
        sx={{
          bgcolor: "white",
          borderRadius: "3px",
          mb: "16px",
        }}
      >
        <Grid container item lg={10.2}>
          {flightData?.cityCount?.map((cities, i) => {
            return (
              <Grid
                item
                lg={12}
                key={i}
                container
                sx={{ marginTop: i > 0 && "10px" }}
              >
                <FlightInfoCard
                  cities={cities}
                  flightData={flightData}
                  index={i}
                />
              </Grid>
            );
          })}
        </Grid>
        <Grid
          item
          lg={1.8}
          sx={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between",
            padding: "15px 15px 10px 0",
            alignItems: "end",
            justifyContent: "center",
          }}
        >
          {flightAfterSearch === "reissue-search" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "var(--light-gray)",
                }}
              >
                <ErrorIcon sx={{ fontSize: "14px" }} />
                <Typography sx={{ fontSize: "10px", fontWeight: "500" }}>
                  Reissue Payable
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: !flightData?.autoReissue ? "17px" : "22px",
                  color: "var(--mate-black)",
                  fontWeight: "500",
                  textAlign: "right",
                }}
              >
                {!flightData?.autoReissue
                  ? "Will Be Decided"
                  : flightData?.fareDifference?.totalFareDifference?.reIssuePayable?.toLocaleString(
                      "en-IN"
                    )}

                {flightData?.autoReissue && (
                  <span style={{ fontSize: "19px" }}> ৳</span>
                )}
              </Typography>
            </Box>
          ) : (
            <CustomFlightTooltip
              placement="bottom-end"
              TransitionComponent={Zoom}
              title={<FareTooltip flightData={fareSummaryFlightData} />}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "var(--light-gray)",
                  }}
                >
                  <ErrorIcon sx={{ fontSize: "14px" }} />
                  <Typography sx={{ fontSize: "11px", fontWeight: "500" }}>
                    {cmsData?.agentFare
                      ? "Agent Fare"
                      : cmsData?.customerFare
                        ? "Customer Fare"
                        : "Commission Fare"}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "22px",
                    color: "var(--mate-black)",
                    fontWeight: "500",
                  }}
                >
                  {(cmsData?.agentFare
                    ? fareSummaryFlightData?.agentPrice
                    : cmsData?.customerFare
                      ? fareSummaryFlightData?.clientPrice
                      : fareSummaryFlightData?.commission
                  )?.toLocaleString("en-IN")}

                  <span style={{ fontSize: "20px", fontWeight: 600 }}>
                    {" "}
                    BDT
                  </span>
                  {/* <span style={{ fontSize: "19px" }}> ৳</span> */}
                </Typography>
              </Box>
            </CustomFlightTooltip>
          )}

          <Button
            sx={{
              ...primaryBtn,
              height: "35px",
              width: "120px",
              textTransform: "uppercase",
              bgcolor:
                flightAfterSearch === "reissue-search"
                  ? "var(--secondary-color)"
                  : "var(--primary-color)",
              "&:hover": {
                bgcolor:
                  flightAfterSearch === "reissue-search"
                    ? "var(--secondary-color)"
                    : "var(--primary-color)",
              },
            }}
            disabled={
              flightData?.brands?.length === 0 && searchType === "regular"
            }
            onClick={() => {
              setShowDetails(() => !showDetails);
              setShowQuotation(false);
              dispatch(setShouldCallAirPrice("fare"));
              dispatch(setTabType("selectfare"));
              dispatch(setAlreadyButtonClicked(false));
              dispatch(setSelectedSeats([]));
            }}
          >
            {showDetails ? "Close" : "Select"}
            {/* {showViewFare ? "Close" : "Select"} */}
          </Button>
        </Grid>

        <Grid
          container
          item
          lg={12}
          sx={{
            mt: "12px",
            px: "15px",
            display: "flex",
            alignItems: "center",
            py: "10px",
            borderTop: "1px solid #E9E9E9",
          }}
        >
          <Grid item lg={2.35} sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Tooltip
                placement="left-start"
                TransitionComponent={Zoom}
                title={<Typography>Share This Itinerary</Typography>}
                arrow
              >
                <Typography
                  sx={{
                    display: "flex",
                    fontSize: "13px",
                    alignItems: "center",
                    gap: "5px",
                    cursor: "pointer",
                    fontWeight: "500",
                    lineHeight: "0",
                  }}
                  onClick={() => {
                    setShowQuotation(!showQuotation);
                    setShowViewFare(false);
                    setShowDetails(false);
                  }}
                >
                  <ReplyIcon
                    sx={{
                      color: "var(--secondary-color)",
                      transform: "rotateY(180deg)",
                    }}
                  />

                  <span>Share Itinerary</span>
                </Typography>
              </Tooltip>
            </Box>
          </Grid>

          {/* <Grid item lg={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}></Box>
          </Grid> */}

          <Grid item lg={8.3}>
            <Box sx={{ display: "flex", gap: "10px" }}>
              {filterValue?.fastest && firstValue === flightData?.uuid && (
                <Box sx={{ bgcolor: "#f24300", ...singleCardBoxStyle }}>
                  <Typography sx={{ fontSize: "12px", color: "#fff" }}>
                    Fastest
                  </Typography>
                </Box>
              )}

              {filterValue?.earliest && firstValue === flightData?.uuid && (
                <Box sx={{ bgcolor: "#00a9f2", ...singleCardBoxStyle }}>
                  <Typography sx={{ fontSize: "12px", color: "#fff" }}>
                    Earilest
                  </Typography>
                </Box>
              )}

              {(filterPriceValue?.minPrice === flightData?.agentPrice ||
                filterPriceValue?.maxPrice === flightData?.agentPrice) && (
                <Box
                  sx={{
                    bgcolor:
                      filterPriceValue?.minPrice === flightData?.agentPrice
                        ? "var(--green)"
                        : "#FFAC1C",
                    ...singleCardBoxStyle,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  >
                    {filterPriceValue?.minPrice === flightData?.agentPrice
                      ? "Cheapest"
                      : "Expensive"}
                  </Typography>
                </Box>
              )}

              {flightData?.cityCount
                ?.flat()
                .some(
                  (item) => item.marketingCarrier !== flightData?.carrier
                ) && (
                <Box sx={{ bgcolor: "#EDF7ED", ...singleCardBoxStyle }}>
                  <Tooltip title="Codeshare means your flight is sold by one airline but operated by a partner airline. Everything is arranged for you — just check your ticket for the operating airline details.">
                    <Typography
                      noWrap
                      sx={{
                        color: "#1e4620",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Code Shared
                    </Typography>
                  </Tooltip>
                </Box>
              )}

              {(() => {
                const hasAlternativeAirport = flightData?.route?.some(
                  (routeItem, index) => {
                    const legArray = flightData?.cityCount?.[index];
                    const lastFlight = legArray?.[legArray.length - 1];
                    const routeArrival = routeItem?.arrival;
                    return lastFlight?.arrival !== routeArrival;
                  }
                );

                return hasAlternativeAirport ? (
                  <Box sx={{ ...singleCardBoxStyle, bgcolor: "#ffe0db" }}>
                    <Tooltip title="An airport located near your chosen departure or arrival airport, offered as a substitute to provide additional flight options, competitive fares, or more convenient scheduling.">
                      <Typography
                        noWrap
                        sx={{
                          color: "#f55d42",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Alternative Airport
                      </Typography>
                    </Tooltip>
                  </Box>
                ) : null;
              })()}

              <Box
                sx={{
                  bgcolor:
                    flightData?.isRefundable === "Partially Refundable"
                      ? "#FFF6EC"
                      : "#FFEDF1",
                  ...singleCardBoxStyle,
                }}
              >
                <Tooltip
                  title={
                    flightData?.isRefundable === "Partially Refundable"
                      ? "A ticket type that allows a partial refund if canceled, with the remaining amount subject to airline rules, cancellation fees, or non-refundable portions."
                      : "This ticket cannot be refunded after purchase. If you cancel, you may not get your money back, and changes could involve additional fees."
                  }
                >
                  <Typography
                    noWrap
                    sx={{
                      color:
                        flightData?.isRefundable === "Partially Refundable"
                          ? "#F7941D"
                          : "#DC143C",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {flightData?.isRefundable === "Partially Refundable"
                      ? "Partially Refundable"
                      : "Non Refundable"}
                  </Typography>
                </Tooltip>
              </Box>

              {(flightData?.immediateIssue ||
                flightAfterSearch === "reissue-search") && (
                <Box
                  sx={{
                    bgcolor: flightData?.autoReissue ? "#FFEDF1" : "#E8FFF3",
                    ...singleCardBoxStyle,
                  }}
                >
                  <Tooltip
                    title={
                      flightData?.autoReissue
                        ? "This means your ticket will be issued immediately after you complete the payment, giving you instant confirmation without delays."
                        : "The process of selecting and reserving a flight ticket for your desired route, dates, and class. Once booked, your flight details are confirmed."
                    }
                  >
                    <Typography
                      noWrap
                      sx={{
                        color: flightData?.autoReissue ? "#DC143C" : "#0E8749",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {flightData?.autoReissue ? "Instant Purchase" : "Book"}
                    </Typography>
                  </Tooltip>
                </Box>
              )}

              {flightAfterSearch !== "reissue-search" && (
                <Box
                  sx={{
                    ...singleCardBoxStyle,
                    bgcolor: "#ebf5ff",
                    display:
                      flightData?.partialPayment &&
                      flightData?.isRefundable === "Partially Refundable" &&
                      !flightData?.immediateIssue
                        ? "block"
                        : "none",
                  }}
                >
                  <Tooltip title="A payment option that allows you to reserve your flight by paying a portion of the total fare upfront, with the remaining balance due by a specified deadline.">
                    <Typography
                      noWrap
                      sx={{
                        color: "#0884ff",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {flightData?.partialPayment &&
                      flightData?.isRefundable === "Partially Refundable" &&
                      !flightData?.immediateIssue
                        ? "Part Payment"
                        : ""}
                    </Typography>
                  </Tooltip>
                </Box>
              )}

              {!flightData?.immediateIssue &&
                flightAfterSearch !== "reissue-search" && (
                  <Box sx={{ bgcolor: "#E8FFF3", ...singleCardBoxStyle }}>
                    <Tooltip title="The process of selecting and reserving a flight ticket for your desired route, dates, and class. Once booked, your flight details are confirmed.">
                      <Typography
                        noWrap
                        sx={{
                          color: "#0E8749",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Book
                      </Typography>
                    </Tooltip>
                  </Box>
                )}

              <CustomFlightTooltip
                placement="bottom"
                TransitionComponent={Zoom}
                title={<BaggageTooltip flightData={flightData} />}
              >
                <Box
                  sx={{
                    ...singleCardBoxStyle,
                    bgcolor: "#F1F7FD",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#003566",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "uppercase",
                    }}
                  >
                    {flightData?.baggage[0][0]?.baggage}
                  </Typography>
                </Box>
              </CustomFlightTooltip>

              {isShowTransitVisa && (
                <Tooltip title={transitVisa?.visa}>
                  <Box
                    sx={{
                      ...singleCardBoxStyle,
                      bgcolor: "#FAEEFF",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#9e00e6",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Transit Visa
                    </Typography>
                  </Box>
                </Tooltip>
              )}

              <Box sx={{ bgcolor: "#F6F6F6", ...singleCardBoxStyle }}>
                <Typography
                  sx={{
                    color: "var(--light-gray)",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {flightData?.system.charAt(0).toUpperCase() +
                    flightData?.system.slice(1)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item lg={1.35} sx={{ textAlign: "right" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                onClick={() => {
                  setShowDetails((prev) => !prev);
                  setShowViewFare(false);
                  setShowQuotation(false);
                  dispatch(setTabType("flight"));
                  dispatch(setAlreadyButtonClicked(false));
                  dispatch(setSelectedSeats([]));
                  dispatch(setAdvancedModifiedBrands([]));
                }}
                sx={{
                  color: "var(--secondary-color)",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  textAlign: "right",
                  lineHeight: "1",
                }}
              >
                {showDetails ? "Hide Details" : "Flight Details"}{" "}
              </Typography>

              <KeyboardArrowDownIcon
                sx={{
                  color: "var(--secondary-color)",
                  transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease-in-out",
                  fontSize: "22px",
                  borderRadius: "50%",
                  bgcolor: "#F2F7FF",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* TODO:: Flight details collpase section */}
        <Collapse
          in={showDetails}
          timeout="auto"
          unmountOnExit
          sx={{ width: "100%", transition: "height 1s ease-in-out" }}
        >
          <FlightDetailsSection
            flightBrand={flightBrand}
            setFlightBrand={setFlightBrand}
            flightData={flightData}
            flightAfterSearch={flightAfterSearch}
            bookingId={bookingId}
            searchType={searchType}
            reissuePassengers={reissuePassengers}
            paxDetails={paxDetails}
            totalPassenger={totalPassenger}
            segmentsList={segmentsList}
            cabin={cabin}
            fareSummaryFlightData={fareSummaryFlightData}
            setFareSummaryFlightData={setFareSummaryFlightData}
            tabType={"flight"}
            fareCard={"newFare"}
            showDetails={showDetails}

            flightDataArr={flightDataArr}
          />
        </Collapse>

        <Collapse
          in={showQuotation}
          timeout="auto"
          unmountOnExit
          sx={{ width: "100%", transition: "height 1s ease-in-out" }}
        >
          <QuotationShare flightData={flightData} type={"aftersearch"} />
        </Collapse>
      </Grid>

      {alternateDateFilter && (
        <Button
          style={{
            backgroundColor: "#fff",
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            textTransform: "none",
            marginBottom: "10px",
            color: "var(--secondary-color)",
            fontWeight: 600,
            paddingLeft: "15px",
          }}
          onClick={() => {
            handleState();
          }}
        >
          Click & See More Available Flights at{" "}
          <span style={{ color: "var(--primary-color)" }}>
            {" "}
            &nbsp;
            {moment(flightData?.cityCount[0][0]?.departureDate).format(
              "dddd, Do MMMM YYYY"
            )}
          </span>
        </Button>
      )}

      {/* TODO:: Showing show more for indigo flight  */}
      <Collapse
        in={showSeeMore}
        timeout="auto"
        unmountOnExit
        sx={{ width: "100%", transition: "height 1s ease-in-out" }}
      >
        <Box>
          {flightData?.seeMore?.map((singleData) => (
            <SingleFlightCard
              key={singleData?.id}
              flightData={singleData}
              searchType={searchType}
            />
          ))}
        </Box>
      </Collapse>

      {flightData?.seeMore?.length > 0 ? (
        <Box
          sx={{
            bgcolor: "#fff",
            height: "40px",
            mb: "15px",
            borderRadius: "3px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${flightData?.carrier}.png`}
              width="30px"
              height="30px"
              alt="flight1"
            />
            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--secondary-color)",
                fontWeight: "500",
              }}
            >
              {flightData?.carrierName}{" "}
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                color: "var(--mate-black)",
                fontWeight: "500",
              }}
            >
              {flightData?.seeMore[0]?.cityCount[0][0]?.marketingCarrier}-
              {flightData?.seeMore[0]?.cityCount[0][0]?.marketingFlight}{" "}
              <span style={{ fontSize: "10px", color: "gray" }}>
                ({flightData?.seeMore.length} More)
              </span>
            </Typography>
          </Box>
          <Button
            style={{
              backgroundColor: "var(--secondary-color)",
              color: "#fff",
              textTransform: "none",
              fontSize: "12px",
              height: "25px",
              padding: "0 12px",
            }}
            onClick={() => setShowSeeMore((prev) => !prev)}
          >
            {showSeeMore ? "Hide Fare" : "See Other Fares At Same Flight"}
          </Button>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export const CustomFlightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "white",
    color: "black",
    boxShadow: theme.shadows[2],
    border: "1px solid #ddd",
    fontSize: "14px",
    maxWidth: "100%",
    whiteSpace: "normal",
    wordWrap: "break-word",
    zIndex: 1,
    padding: 0,
  },
  [`& .MuiTooltip-arrow`]: {
    color: "white",
  },
}));

export default SingleFlightCard;
