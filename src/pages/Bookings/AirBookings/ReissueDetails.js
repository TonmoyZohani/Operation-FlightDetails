import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  ThemeProvider,
  Checkbox,
  Button,
  Alert,
  Tooltip,
  FormGroup,
  Stack,
  Drawer,
} from "@mui/material";
import PriceBreakdown, {
  TicketStatus,
} from "../../../component/AirBooking/PriceBreakdown";
import PageTitle from "../../../shared/common/PageTitle";
import { BpCheckedIcon, BpIcon } from "../../../shared/common/styles";
import { theme } from "../../../utils/theme";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useDispatch, useSelector } from "react-redux";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";
import CustomAlert from "../../../component/Alert/CustomAlert";
import { mobileButtonStyle, nextStepStyle } from "../../../style/style";
import PendingLoader from "../../../component/Loader/PendingLoader";
import { setKeyNull } from "../../../component/FlightSearchBox/flighAfterSearchSlice";
import useToast from "../../../hook/useToast";
import CustomToast from "../../../component/Alert/CustomToast";
import BookingHeader from "../components/BookingHeader";
import MobilePassengerInfo from "../components/MobilePassengerInfo";
import MobileItineraryCard from "../components/MobileItineraryCard";
import RequiredIndicator from "../../../component/Common/RequiredIndicator";
import CustomCalendar from "../../../component/CustomCalendar/CustomCalendar";
import useWindowSize from "../../../shared/common/useWindowSize";
import FareRulesCharges from "../../../component/FlightAfterSearch/components/FareRulesCharges";
import MakeBookingQuotation from "./MakeBookingQuotation";

const borderStyle = "1px solid #B0D1E6";
const commonTextStyle = {
  color: "#8C8080",
  fontSize: "13px",
};
export const commonMainTextStyle = {
  color: "var(--primary-color)",
  fontSize: "17px",
  fontWeight: "500",
};

const ReissueDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { retriveData, passengers, cities, flightReissue } = state;
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [destination, setDestination] = useState([]);
  const [departureDate, setDepartureDate] = useState([]);
  const [fixedDate, setFixedDate] = useState([]);
  const [isAccept, setIsAccept] = useState(false);
  const [arrivalDate, setArrivalDate] = useState([
    cities[cities.length - 1]?.departureDate,
  ]);
  const { isMobile } = useWindowSize();
  const [priceBreakdown, setPriceBreakdown] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const { selectedAirlines } = useSelector((state) => state.flight);
  const [openDeptCalendar, setOpenDeptCalendar] = useState([]);
  const [openArrCalendar, setOpenArrCalendar] = useState([]);
  const [fromSegmentLists, setFromSegmentLists] = useState([]);
  const [toSegmentLists, setToSegmentLists] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [type, setType] = useState("Booking Reissue Request");
  const queryClient = useQueryClient();
  const { jsonHeader } = useAuth();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showSelectedRowsDrawer, setShowSelectedRowsDrawer] = useState(false);
  const [reissueClass, setReissueClass] = useState([]);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const dispatch = useDispatch();
  const originalPriceBreakdown = retriveData?.details?.priceBreakdown;

  const itineraryColumns = [
    "Select",
    "Airlines",
    "Destination",
    "Stops",
    "Flight No",
    "Flight Date",
    "Flight Status",
  ];

  const itineraryRows =
    retriveData?.details?.route.map((route, index, arr) => {
      const stops = retriveData?.details?.cityCount[index];
      const stopCount = stops.length - 1;
      const stopDescription =
        stopCount > 0
          ? `${stopCount} Stop${stopCount > 1 ? "s" : ""} via ${stops
              .slice(0, -1)
              .map((stop) => stop.arrivalCityCode)
              .join(", ")}`
          : "Non-stop";

      return [
        <Tooltip
          key={"itinary"}
          title={stops[0].isFlown && "Flown Segment Can't be Reissue."}
        >
          <FormControlLabel
            key={`checkbox-${index}`}
            sx={{ pl: 1.5 }}
            control={
              <Checkbox
                disableRipple
                checked={selectedRows.some((row) => row.index === index)}
                onChange={() => {
                  if (index !== 0) {
                    handleRowSelect(index, stops[0]?.departureDate);
                  }
                }}
                checkedIcon={
                  <BpCheckedIcon
                    color={"white"}
                    bgColor={arr.length > 1 ? "var(--primary-color)" : "#ccc"}
                    boxShadowColor={
                      arr.length > 1 ? "var(--primary-color)" : "#ccc"
                    }
                  />
                }
                icon={<BpIcon color={"white"} />}
                disabled={stops[0]?.isFlown}
              />
            }
          />
        </Tooltip>,
        <span key={index}>{stops[0].marketingCarrierName}</span>,

        <span key={index}>{`${route.departure} - ${route.arrival}`}</span>,
        stopDescription,
        `${stops[0].marketingFlight} [ ${stops[0].marketingCarrier} ]`,
        moment(stops[0]?.departureDate).format("DD MMM, YYYY"),
        <span style={{ color: stops[0].isFlown ? "red" : "green" }}>
          {stops[0].isFlown ? "Flown" : "Unflown"}
        </span>,
      ];
    }) || [];

  const handleCheckboxChange = (index, pax) => {
    setAllSelected(false);
    setSelectedPassengers((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((i) => i !== index);
      } else {
        return [...prevSelected, index];
      }
    });

    setPriceBreakdown((prev) => {
      const existingIndex = prev.findIndex((item) => item.index === index);

      if (existingIndex !== -1) {
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        if (pax.type === "CNN") {
          if (pax.age >= 2 && pax.age <= 11) {
            return [...prev, { ...pax, index }];
          } else {
            console.warn(
              `Passenger ${index} of type CNN does not meet age conditions`
            );
            return prev;
          }
        } else if (pax.type === "INF") {
          if (pax.age === "" || pax.age < 2) {
            return [...prev, { ...pax, index }];
          } else {
            console.warn(
              `Passenger ${index} of type INF has invalid or unspecified age`
            );
            return prev;
          }
        } else {
          return [...prev, { ...pax, index }];
        }
      }
    });

    setPriceBreakdown((prev) =>
      prev.map((passenger) => {
        return {
          ...passenger,
          id: retriveData?.Tickets?.at(0)?.passengers?.find(
            (item) => item?.ticketNumber === passenger?.ticketNumber
          )?.passengerId,
        };
      })
    );
  };

  useEffect(() => {
    if (!allSelected) {
      handleSelectAll();
    }
  }, []);

  useEffect(() => {
    const result = retriveData?.details?.cityCount?.map((group) =>
      group.map(({ bookingClass, marketingCarrier }) => ({
        className: bookingClass,
        airlineCode: marketingCarrier,
      }))
    );
    setReissueClass(result);
  }, []);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedPassengers([]);
      setPriceBreakdown([]);
      setAllSelected(false);
    } else {
      const allIndexes = originalPriceBreakdown.map((_, index) => index);
      setSelectedPassengers(allIndexes);
      setAllSelected(true);

      const allPriceBreakdowns = originalPriceBreakdown.map(
        (passenger, index) => {
          const id =
            retriveData?.Ticket?.length > 0
              ? retriveData?.Tickets?.at(0)?.passengers?.find(
                  (item) => item?.ticketNumber === passenger?.ticketNumber
                )?.passengerId
              : "";

          return { ...passenger, index, id };
        }
      );

      setPriceBreakdown(allPriceBreakdowns);
    }
  };

  const passengerColumns = [
    "Select",
    "Name",
    "Pax Type",
    "DOB",
    "Nationality",
    "Base Fare",
    "Tax",
    "Payment Status",
  ];

  // Generate passenger rows
  const getPassengerRows = (
    passengers,
    retriveData,
    selectedPassengers,
    handleCheckboxChange
  ) => {
    const matchingRelations = retriveData?.relation || [];

    const relationsMap = new Map();

    // Build a map of relations for quick lookup
    matchingRelations.forEach((relation) => {
      if (
        relationsMap.has(relation.passengerId) &&
        relationsMap.get(relation.passengerId).indexNumber >
          relation.indexNumber
      ) {
        return;
      }

      relationsMap.set(relation.passengerId, {
        bookingId: relation.bookingId,
        status: relation.status,
        bookingAttribId: relation.bookingAttribId,
        indexNumber: relation.indexNumber,
        createdAt: relation.createdAt,
      });
    });

    // Merge data for all passengers
    const mergedData = passengers.map((passenger) => {
      const relation = relationsMap.get(passenger.id);

      return {
        ...passenger,
        bookingId: relation?.bookingId || null,
        status: relation?.status || "N/A",
        bookingAttribId: relation?.bookingAttribId || "N/A",
        indexNumber: relation?.indexNumber || 0,
        createdAt: relation?.createdAt || null,
      };
    });

    // Filter merged data if needed
    const filteredData = mergedData.filter(
      (passenger) => passenger.indexNumber <= 0
    );

    return filteredData.map((passenger, index, arr) => {
      const price = originalPriceBreakdown.at(index);
      // const price = originalPriceBreakdown.find((item) => {
      //   const isTypeMatch = item.paxType === passenger.type;

      //   const isAgeMatch =
      //     passenger.type === "CNN" &&
      //     passenger.age &&
      //     item.age?.includes(passenger.age);

      //   return passenger.type === "CNN" ? isAgeMatch : isTypeMatch;
      // });

      return [
        <FormControlLabel
          key={index}
          sx={{ pl: 1.5 }}
          control={
            <Checkbox
              disabled={
                !flightReissue?.operations?.splitReissue ||
                (priceBreakdown?.length === 1 &&
                  priceBreakdown?.some((item) => item.index === index))
              }
              disableRipple
              checked={selectedPassengers.includes(index)}
              onChange={() =>
                handleCheckboxChange(index, {
                  ...passenger,
                  baseFare: price?.baseFare,
                  tax: price?.tax,
                })
              }
              checkedIcon={
                <BpCheckedIcon
                  color={"white"}
                  bgColor={arr.length > 1 ? "var(--primary-color)" : "#ccc"}
                  boxShadowColor={
                    arr.length > 1 ? "var(--primary-color)" : "#ccc"
                  }
                />
              }
              icon={<BpIcon color={"white"} />}
            />
          }
        />,
        `${passenger.firstName} ${passenger.lastName}`?.toUpperCase(),
        passenger.type === "CNN" ? (
          <>
            {passenger.type}{" "}
            <span style={{ color: "var(--primary-color)" }}>
              [{passenger.age} yrs]
            </span>
          </>
        ) : (
          passenger.type
        ),
        moment(passenger.dateOfBirth).format("DD MMM, YYYY"),
        <Box
          key={index}
          sx={{
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            height: "100%",
            cursor: "pointer",
          }}
        >
          {passenger.passportNation}
        </Box>,
        price ? `${price?.baseFare?.toLocaleString("en-IN")} BDT` : "N/A",
        price ? `${price?.tax?.toLocaleString("en-IN")} BDT` : "N/A",
        retriveData?.paymentStatus?.toUpperCase(),
        // <span
        //   key={index}
        //   style={{
        //     color: "var(--primary-color)",
        //     fontWeight: "500",
        //     paddingLeft: "3px",
        //     textDecoration: "underline",
        //   }}
        // >
        //   {passenger?.bookingAttribId}
        // </span>,
      ];
    });
  };

  const flattenedPassengers = [
    ...(retriveData?.details?.passengerInformation?.adult || []),
    ...(retriveData?.details?.passengerInformation?.child || []),
    ...(retriveData?.details?.passengerInformation?.infant || []),
  ].flat();

  const passengerRows = getPassengerRows(
    flattenedPassengers,
    retriveData,
    selectedPassengers,
    handleCheckboxChange
  );

  const handleRowSelect = (index, date) => {
    setRefetch((prev) => !prev);
    setSelectedRows((prevSelected) => {
      const exists = prevSelected.some((row) => row.index === index);
      const updatedSelectedRows = exists
        ? prevSelected.filter((row) => row.index !== index)
        : [...prevSelected, { index, date }];

      // Sort selected rows by index to maintain route order
      const sortedSelectedRows = updatedSelectedRows.sort(
        (a, b) => a.index - b.index
      );

      // Map selected rows to their corresponding routes
      const selectedDepartures = sortedSelectedRows.map(
        (row) => retriveData?.details?.route[row.index]
      );

      // Always set departure as an array
      setDestination(selectedDepartures);

      return updatedSelectedRows;
    });
  };

  const handleDepartureDate = (index, date) => {
    const newDepartureDates = [...departureDate];

    if (index > 0 && date < newDepartureDates[index - 1]) {
      alert(
        "Departure date cannot be earlier than the previous departure date."
      );
      return;
    }

    newDepartureDates[index] = date;

    if (index === 0 && newDepartureDates.length > 1) {
      newDepartureDates[1] = moment(date).add(1, "days").toDate();
    }

    if (index + 1 < newDepartureDates.length) {
      newDepartureDates[index + 1] = moment(newDepartureDates[index])
        .add(1, "days")
        .toDate();
    }

    setDepartureDate(newDepartureDates);

    const newOpenDeptCalendar = [...openDeptCalendar];
    newOpenDeptCalendar[index] = false;
    setOpenDeptCalendar(newOpenDeptCalendar);

    handleArrivalDate(index, moment(date).add(1, "days").toDate());
  };

  const handleArrivalDate = (index, date) => {
    const newArrivalDates = [...arrivalDate];
    newArrivalDates[index] = date;
    setArrivalDate(newArrivalDates);

    const newOpenArrCalendar = [...openArrCalendar];
    newOpenArrCalendar[index] = false;
    setOpenArrCalendar(newOpenArrCalendar);
  };

  const fetchAirportData = async (keyword) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/admin/airports/search-suggestion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  };

  const toggleOpenDeptCalendar = (index) => {
    const newOpenDeptCalendar = [...openDeptCalendar];
    newOpenDeptCalendar[index] = !newOpenDeptCalendar[index];
    setOpenDeptCalendar(newOpenDeptCalendar);
  };

  const toggleOpenArrCalendar = (index) => {
    const newOpenArrCalendar = [...openArrCalendar];
    newOpenArrCalendar[index] = !newOpenArrCalendar[index];
    setOpenArrCalendar(newOpenArrCalendar);
  };

  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
    } else {
      setType(newTab);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let fromSegments = [];
      let toSegments = [];

      const fromCodes = new Set();
      const toCodes = new Set();

      for (const { arrivalAirport, departureAirport } of retriveData.details
        .route) {
        try {
          const departureData = await fetchAirportData(departureAirport?.name);
          if (departureData.success && departureData.data.length > 0) {
            const departureResult = departureData.data[0].result;
            if (!fromCodes.has(departureResult.code)) {
              fromSegments.push(departureResult);
              fromCodes.add(departureResult.code);
            }
          }

          const arrivalData = await fetchAirportData(arrivalAirport?.name);
          if (arrivalData.success && arrivalData.data.length > 0) {
            const arrivalResult = arrivalData.data[0].result;
            if (!toCodes.has(arrivalResult.code)) {
              toSegments.push(arrivalResult);
              toCodes.add(arrivalResult.code);
            }
          }
        } catch (error) {
          console.error("Error fetching airport data:", error);
        }
      }

      setFromSegmentLists(fromSegments);
      setToSegmentLists(toSegments);
    };

    if (retriveData?.details?.route.length > 0) {
      fetchData();
    }
  }, [retriveData?.details?.route]);

  useEffect(() => {
    if (retriveData?.details?.route) {
      const dates = retriveData.details.route.map(
        (route) => route.departureDate
      );
      setDepartureDate(dates);
      setFixedDate(dates);

      // --- Auto select index 0 ---
      if (retriveData.details.route.length > 0) {
        setSelectedRows([{ index: 0, date: dates[0] }]);
        setDestination([retriveData.details.route[0]]);
      }
    }
  }, []);

  const handleSearch = () => {
    if (selectedRows.length === 0) {
      showToast("error", "You must select at least one itinerary", () =>
        console.error("No itinerary selected")
      );
      return;
    }

    const selectedPassengerObjects = selectedPassengers.map(
      (index) => passengers[index]
    );

    const paxDetails = selectedPassengerObjects?.map((pax) => pax.id);

    dispatch(setKeyNull());

    const selectedClasses = selectedRows
      .map((row) => reissueClass[row.index])
      .filter((cls) => cls !== undefined);

    // Extract details from retriveData
    const {
      searchBooking: { cabin, studentFare, seamanFare } = {},
      details: { route: segmentsList } = {},
    } = retriveData || {};

    const updatedSegmentsList = segmentsList.map((segment, index) => {
      let newDepartureDate;

      switch (retriveData?.tripType) {
        case "oneWay":
          newDepartureDate = moment(departureDate[0]).format("YYYY-MM-DD");
          break;

        case "return":
          newDepartureDate =
            index === 0
              ? moment(departureDate[0]).format("YYYY-MM-DD")
              : moment(arrivalDate[0]).format("YYYY-MM-DD");
          break;

        case "multiCity":
          newDepartureDate = moment(departureDate[index]).format("YYYY-MM-DD");
          break;

        default:
          console.warn("Unknown tripType:", retriveData?.tripType);
          break;
      }

      return {
        ...segment,
        departureDate: newDepartureDate,
      };
    });

    const selectedUpdatedSegmentList = selectedRows
      .map((row) => {
        const segment = updatedSegmentsList[row.index];
        return segment ? segment : undefined;
      })
      .filter((segment) => segment !== undefined);

    const departureDates = updatedSegmentsList.map(
      (segment) => segment.departureDate
    );
    const arrivalDates = updatedSegmentsList.map(
      (segment) => segment.departureDate
    );

    // Initialize passenger counts
    let adultCount = 0;
    let childAges = [];
    let infantCount = 0;

    // Define search options
    const searchOptions = {
      fareType: "",
      searchType: "regular",
    };

    // Count passengers by type
    selectedPassengerObjects.forEach(({ type, age }) => {
      switch (type) {
        case "ADT":
          adultCount++;
          break;
        case "CNN":
          childAges.push(age.toString());
          break;
        case "INF":
          infantCount++;
          break;
        default:
          break;
      }
    });

    const determineJourneyType = () => {
      if (selectedUpdatedSegmentList.length === 1) {
        return "oneWay";
      } else if (
        selectedUpdatedSegmentList.length === 2 &&
        selectedUpdatedSegmentList[0].departure ===
          selectedUpdatedSegmentList[1].arrival &&
        selectedUpdatedSegmentList[0].arrival ===
          selectedUpdatedSegmentList[1].departure
      ) {
        return "return";
      } else if (
        selectedUpdatedSegmentList.length > 2 ||
        (selectedUpdatedSegmentList.length === 2 &&
          selectedUpdatedSegmentList[0].departure !==
            selectedUpdatedSegmentList[1].arrival &&
          selectedUpdatedSegmentList[0].arrival !==
            selectedUpdatedSegmentList[1].departure)
      ) {
        return "multiCity";
      } else {
        console.warn("Unable to determine journey type");
        return undefined;
      }
    };

    navigate("/dashboard/flightaftersearch", {
      state: {
        adultCount,
        childCount: childAges,
        infantCount,
        cabin,
        selectedAirlines,
        vendorPref: [retriveData?.details?.cityCount[0][0]?.marketingCarrier],
        studentFare,
        umrahFare: false,
        seamanFare,
        segmentsList: selectedUpdatedSegmentList,
        searchOptions,
        fromSegmentLists,
        toSegmentLists,
        departureDates,
        arrivalDates,
        searchType: "regular",
        value: determineJourneyType()?.toLowerCase(),
        classes: selectedClasses,
        paxDetails,
        flightAfterSearch: "reissue-search",
        bookingId: retriveData?.id,
        selectedPassengers,
        passengers,
      },
    });
  };

  useMutation({
    mutationFn: ({
      bookingId,
      requestRemarks,
      voluntaryReissue,
      segmentIndexes,
      passengerIds,
    }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/re-issue`,
        {
          bookingId,
          requestRemarks,
          voluntaryReissue,
          segmentIndexes,
          passengerIds,
        },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        CustomAlert({
          success: data?.data?.success,
          message: data?.data?.message,
        });
      }
      navigate(`/dashboard/booking/airtickets/all`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["singleBookingData"]);
    },
    onError: (err) => {
      console.error("Error occurred: ", err);
      const errorResponse = err?.response?.data;

      CustomAlert({
        success: false,
        message:
          errorResponse?.message || "An error occurred. Please try again.",
      });
    },
  });

  const { mutate: splitPayMutate, status: splitPayStatus } = useMutation({
    mutationFn: ({ bookingId, passengers }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/split`,
        { bookingId, passengers },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        const firstDataId = data?.data?.data?.id;

        CustomAlert({
          success: true,
          message:
            "Passenger Split Successfully.We are pleased to inform you that the passenger split process has been successfully completed. The requested passengers have been separated into a new booking, ensuring a seamless and hassle-free experience for both parties.",
          bookingProps: {
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          },
          title: `${data?.data?.message}`,
          alertFor: "issueSplit",
          onClose: () =>
            navigate(`/dashboard/booking/airtickets/all/${firstDataId}`),
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["bookingData"]);
    },
    onError: (err) => {
      CustomAlert({
        success: false,
        message: err.response.data.message,
        bookingProps: {
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        },
        title: "Passengers Split Operation Failed",
        alertFor: "issueSplit",
        // onClose: () =>
        //   navigate(
        //     `/dashboard/booking/airtickets/all/${retriveData?.details?.id}`
        //   ),
      });
    },
  });

  const handleSplitPassengersReissue = async () => {
    const bookingId = retriveData?.id;
    const selectedPassengersId = priceBreakdown.map(
      (passenger) => passenger.id
    );

    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to split passengers for this booking?",
    });

    if (result.isConfirmed) {
      splitPayMutate({ bookingId, passengers: selectedPassengersId });
    }
  };

  if (splitPayStatus === "pending") {
    return <PendingLoader type={"split"} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mb: { xs: 7, lg: 0 } }}>
        <BookingHeader
          type={type}
          handleTypeChange={handleTypeChange}
          tabs={tabs}
          retriveData={retriveData}
        />
        <Grid
          container
          sx={{
            width: { xs: "90%", lg: "100%" },
            mt: { xs: 3, lg: 0 },
            mx: "auto",
          }}
        >
          <Grid
            container
            item
            lg={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "15px",
            }}
          >
            <Grid
              item
              xs={12}
              lg={2.4}
              sx={{
                display: {
                  xs: type === "Reissue Fare Information" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <TicketStatus data={retriveData} />
              <PriceBreakdown
                type={"after"}
                flightData={retriveData}
                label="Total Payable"
                isNotEquals={originalPriceBreakdown.length !== priceBreakdown.length}
              />

              {retriveData?.details?.structure.length > 0 && (
                <Box mt={"20px"}>
                  <FareRulesCharges
                    structure={retriveData?.details?.structure || []}
                    nonStructure={retriveData?.details?.nonStructure || []}
                    bookingData={retriveData}
                  />
                </Box>
              )}

              <Box mt={"20px"}>
                <MakeBookingQuotation
                  retriveData={retriveData}
                  type={"reissue"}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              lg={9.4}
              sx={{
                bgcolor: "#fff",
                borderRadius: "4px",
                display: {
                  xs: type === "Booking Reissue Request" ? "block" : "none",
                  lg: "block",
                },
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Box sx={{ mb: 1 }}>
                  <PageTitle title={`Booking Reissue Request`} />
                </Box>
                {/*Passenger's table shown here */}
                <Grid item xs={12} sx={{ bgcolor: "#fff", p: "12px 15px" }}>
                  <Typography
                    sx={{ fontSize: "15px", fontWeight: 500, pb: "15px" }}
                  >
                    Passenger Information
                  </Typography>

                  <Box
                    sx={{
                      display: { xs: "none", lg: "block" },
                    }}
                  >
                    <DynamicMuiTable
                      columns={passengerColumns}
                      rows={passengerRows}
                      getCellContent={(row, colIndex) => row[colIndex]}
                    />
                  </Box>

                  {/* --- passenger card for mobile start --- */}
                  <Stack
                    spacing={2}
                    sx={{
                      display: {
                        xs:
                          type === "Booking Reissue Request" ? "block" : "none",
                        lg: "none",
                      },
                    }}
                  >
                    {flattenedPassengers?.map((passenger, index) => {
                      const price = originalPriceBreakdown.find(
                        (item) => item.paxType === passenger.type
                      );

                      return (
                        <MobilePassengerInfo
                          key={index}
                          passenger={passenger}
                          price={price}
                          index={index}
                          selectedPassengers={selectedPassengers}
                          handleCheckboxChange={handleCheckboxChange}
                          retriveData={retriveData}
                          flattenedPassengers={flattenedPassengers}
                          priceBreakdown={priceBreakdown}
                        />
                      );
                    })}
                  </Stack>
                  {/* --- passenger card for mobile end --- */}

                  {originalPriceBreakdown?.length !==
                    priceBreakdown?.length && (
                    <Box sx={{ mt: "15px" }}>
                      <AirlineChargeNotice />
                    </Box>
                  )}
                </Grid>

                {originalPriceBreakdown?.length === priceBreakdown?.length && (
                  <>
                    {/*Flight Itinery Onward */}
                    {retriveData?.details?.route.map((ro, index) => (
                      <Grid
                        item
                        lg={12}
                        sx={{
                          bgcolor: "#fff",
                          p: "12px 15px",
                          display: { xs: "none", lg: "block" },
                        }}
                        key={index}
                      >
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            pb: "15px",
                          }}
                        >
                          {retriveData?.tripType !== "multiCity"
                            ? `Flight Itinerary  ${
                                index === 0 ? "Onward" : "Return"
                              }`
                            : `Flight Itinerary City ${index + 1}`}
                        </Typography>

                        <DynamicMuiTable
                          columns={itineraryColumns}
                          rows={[itineraryRows[index]]}
                          getCellContent={(row, colIndex) => row[colIndex]}
                        />
                      </Grid>
                    ))}

                    {/* --- Flight Itinerary for Mobile start --- */}
                    <Drawer
                      anchor="bottom"
                      open={openDrawer}
                      onClose={() => setOpenDrawer(false)}
                      PaperProps={{
                        sx: {
                          borderRadius: "10px",
                          px: 2,
                          py: 1,
                          mb: 1,
                          mx: 1,
                          display: { xs: "block", lg: "none" },
                        },
                      }}
                    >
                      <Box id="mainBox">
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            py: "15px",
                          }}
                        >
                          Select your preferred itinerary
                        </Typography>
                        {retriveData?.details?.route?.map((route, index) => (
                          <MobileItineraryCard
                            key={index}
                            retriveData={retriveData}
                            index={index}
                            route={route}
                            selectedRows={selectedRows}
                            handleRowSelect={handleRowSelect}
                            isReissue={true}
                          />
                        ))}
                      </Box>
                      <Typography
                        onClick={() => {
                          if (isMobile) setShowSelectedRowsDrawer(true);
                        }}
                        sx={{
                          textAlign: "center",
                          bgcolor: "var(--primary-color)",
                          py: 1.2,
                          mb: 1,
                          borderRadius: "5px",
                          fontSize: "14px",
                          color: "white",
                        }}
                      >
                        Proceed to next step
                      </Typography>
                    </Drawer>

                    {/* --- Flight Itinerary for Mobile end --- */}

                    {/*search and rebook operation operation */}
                    {!isMobile && (
                      <Box>
                        {selectedRows?.length !== 0 && (
                          <Grid item lg={12} sx={{ p: "12px 15px" }}>
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                fontWeight: "500",
                                pb: "15px",
                              }}
                            >
                              Search and Reissue your Flight at{" "}
                              <span
                                style={{
                                  color: "var(--primary-color)",
                                  fontWeight: "500",
                                }}
                              >
                                {retriveData?.carrierName}
                              </span>
                            </Typography>

                            {retriveData?.details?.route
                              .filter(
                                (_, idx) =>
                                  retriveData?.tripType === "multiCity" ||
                                  idx === 0
                              )
                              .map((ro, index) => (
                                <Grid container key={index}>
                                  <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    sx={{
                                      border: borderStyle,
                                      borderLeft: "none",
                                      borderRight: {
                                        xs: "none",
                                        md: borderStyle,
                                      },
                                      borderBottom: {
                                        xs: "none",
                                        md: borderStyle,
                                      },
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      p: "7px 10px",
                                    }}
                                  >
                                    <Typography sx={commonTextStyle}>
                                      From
                                    </Typography>
                                    <Typography sx={commonMainTextStyle}>
                                      {destination[index]?.departure}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#525371",
                                        fontSize: "11px",
                                      }}
                                    >
                                      {
                                        destination[index]?.departureAirport
                                          ?.name
                                      }
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    sx={{
                                      border: borderStyle,
                                      borderLeft: "none",
                                      borderRight: {
                                        xs: "none",
                                        md: borderStyle,
                                      },
                                      borderBottom: {
                                        xs: "none",
                                        md: borderStyle,
                                      },
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      p: "7px 10px",
                                    }}
                                  >
                                    <Typography sx={commonTextStyle}>
                                      To
                                    </Typography>
                                    <Typography sx={commonMainTextStyle}>
                                      {destination.length === 1
                                        ? destination[0]?.arrival
                                        : destination[destination.length - 1]
                                            ?.departure}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#525371",
                                        fontSize: "11px",
                                      }}
                                    >
                                      {destination.length === 1
                                        ? destination[0]?.arrivalAirport?.name
                                        : destination[destination.length - 1]
                                            ?.departureAirport?.name}
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    md={1.9}
                                    sx={{
                                      position: "relative",
                                      border: borderStyle,
                                      borderLeft: "none",
                                      borderRight: {
                                        xs: "none",
                                        md: borderStyle,
                                      },
                                      borderBottom: {
                                        xs: "none",
                                        md: borderStyle,
                                      },
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      p: "7px 10px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Box
                                      onClick={() => {
                                        toggleOpenDeptCalendar(index);
                                        // Scroll to bottom
                                        window.scrollTo({
                                          top: document.documentElement
                                            .scrollHeight,
                                          behavior: "smooth",
                                        });
                                      }}
                                    >
                                      <Typography sx={commonTextStyle}>
                                        Departure
                                      </Typography>
                                      <Typography sx={commonMainTextStyle}>
                                        {moment(departureDate[index]).format(
                                          "DD MMM, YYYY"
                                        )}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          color: "#525371",
                                          fontSize: "11px",
                                        }}
                                      >
                                        {moment(departureDate[index]).format(
                                          "dddd"
                                        )}
                                      </Typography>
                                    </Box>
                                    {openDeptCalendar[index] && (
                                      <Box
                                        className="new-dashboard-calendar"
                                        sx={{
                                          display: {
                                            md: "flex",
                                            sm: "block",
                                            xs: "block",
                                          },
                                          boxShadow: "none",
                                          flexFlow: "column nowrap",
                                          position: "absolute",
                                          zIndex: 1300,
                                          boxShadow:
                                            "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                          borderRadius: "5px",
                                        }}
                                      >
                                        <CustomCalendar
                                          minDate={new Date()}
                                          // minDate={
                                          //   retriveData?.tripType === "oneWay"
                                          //     ? new Date()
                                          //     : selectedRows.length === 2
                                          //       ? new Date()
                                          //       : selectedRows.some(
                                          //             (item) => item.index === 1
                                          //           )
                                          //         ? new Date()
                                          //         : // ? new Date(fixedDate[0])
                                          //           undefined
                                          // }
                                          // maxDate={
                                          //   retriveData?.tripType === "oneWay"
                                          //     ? undefined
                                          //     : selectedRows.length === 2
                                          //       ? undefined
                                          //       : selectedRows.some(
                                          //             (item) => item.index === 0
                                          //           )
                                          //         ? new Date(fixedDate[1])
                                          //         : undefined
                                          // }
                                          date={departureDate[index]}
                                          title={"Departure Date"}
                                          handleChange={(date) =>
                                            handleDepartureDate(index, date)
                                          }
                                        />
                                      </Box>
                                    )}
                                  </Grid>

                                  {selectedRows.length === 2 && (
                                    <Grid
                                      item
                                      xs={12}
                                      md={1.9}
                                      sx={{
                                        position: "relative",
                                        border: borderStyle,
                                        borderLeft: "none",
                                        borderRight: {
                                          xs: "none",
                                          lg: borderStyle,
                                        },
                                        borderBottom: {
                                          xs: "none",
                                          lg: borderStyle,
                                        },
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        p: "7px 10px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Box
                                        onClick={() =>
                                          toggleOpenArrCalendar(index)
                                        }
                                      >
                                        <Typography sx={commonTextStyle}>
                                          Return
                                        </Typography>
                                        <Typography sx={commonMainTextStyle}>
                                          {moment(arrivalDate[index]).format(
                                            "DD MMM, YYYY"
                                          )}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            color: "#525371",
                                            fontSize: "11px",
                                          }}
                                        >
                                          {moment(arrivalDate[index]).format(
                                            "dddd"
                                          )}
                                        </Typography>
                                      </Box>
                                      {openArrCalendar[index] && (
                                        <Box
                                          sx={{
                                            display: {
                                              md: "flex",
                                              sm: "block",
                                              xs: "block",
                                            },
                                            background: "var(--white)",
                                            flexFlow: "column nowrap",
                                            position: "absolute",
                                            zIndex: 1300,
                                            boxShadow:
                                              "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                            borderRadius: "5px",
                                          }}
                                          className="new-dashboard-calendar"
                                        >
                                          <CustomCalendar
                                            date={arrivalDate[index]}
                                            handleChange={(date) => {
                                              handleArrivalDate(index, date);
                                            }}
                                            months={1}
                                            minDate={
                                              new Date(departureDate[index])
                                            }
                                            title={"Return Date"}
                                          />
                                        </Box>
                                      )}
                                    </Grid>
                                  )}

                                  <Grid
                                    item
                                    xs={12}
                                    md={selectedRows.length === 2 ? 2.2 : 4.1}
                                    sx={{
                                      border: borderStyle,
                                      borderLeft: "none",
                                      borderRight: "none",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      p: "7px 10px",
                                    }}
                                  >
                                    <Typography sx={commonTextStyle}>
                                      Travelers
                                    </Typography>
                                    <Typography sx={commonMainTextStyle}>
                                      {selectedPassengers.length} Traveler
                                      {selectedPassengers.length > 1 ? "s" : ""}
                                    </Typography>
                                    <Tooltip
                                      title={selectedPassengers
                                        .map((index) => passengers[index])
                                        .map(
                                          (pax) =>
                                            `${pax.firstName} ${pax.lastName}`
                                        )
                                        .join(", ")}
                                      arrow
                                    >
                                      <Typography
                                        sx={{
                                          color: "var(--secondary-color)",
                                          fontSize: "11px",
                                          visibility:
                                            selectedPassengers.length > 0
                                              ? "visible"
                                              : "hidden",
                                        }}
                                      >
                                        {selectedPassengers
                                          .map((index) => passengers[index])
                                          .map(
                                            (pax) =>
                                              `${pax.firstName} ${pax.lastName}`
                                          )
                                          .join(", ").length > 30
                                          ? `${selectedPassengers
                                              .map((index) => passengers[index])
                                              .map(
                                                (pax) =>
                                                  `${pax.firstName} ${pax.lastName}`
                                              )
                                              .join(", ")
                                              .slice(0, 30)}...`
                                          : selectedPassengers
                                              .map((index) => passengers[index])
                                              .map(
                                                (pax) =>
                                                  `${pax.firstName} ${pax.lastName}`
                                              )
                                              .join(", ")}
                                      </Typography>
                                    </Tooltip>
                                  </Grid>
                                </Grid>
                              ))}
                          </Grid>
                        )}
                      </Box>
                    )}
                  </>
                )}
                {isMobile && showSelectedRowsDrawer && (
                  <Drawer
                    anchor="bottom"
                    open={showSelectedRowsDrawer}
                    onClose={() => setShowSelectedRowsDrawer(false)}
                    PaperProps={{
                      sx: {
                        borderRadius: "10px",
                        px: 0.5,
                        py: 1,
                        mb: 1,
                        mx: 1,
                        display: { xs: "block", lg: "none" },
                      },
                    }}
                  >
                    {selectedRows?.length !== 0 && (
                      <Grid item lg={12} sx={{ p: "12px 15px" }}>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            pb: "15px",
                          }}
                        >
                          Search and Reissue your Flight at{" "}
                          <span
                            style={{
                              color: "var(--primary-color)",
                              fontWeight: "500",
                            }}
                          >
                            {retriveData?.carrierName}
                          </span>
                        </Typography>

                        {retriveData?.details?.route
                          .filter(
                            (_, idx) =>
                              retriveData?.tripType === "multiCity" || idx === 0
                          )
                          .map((ro, index) => (
                            <Grid container key={index}>
                              <Grid
                                item
                                xs={12}
                                sx={{
                                  border: borderStyle,
                                  borderLeft: "none",
                                  borderRight: { xs: "none" },
                                  borderBottom: { xs: "none" },
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  p: "7px 10px",
                                }}
                              >
                                <Typography sx={commonTextStyle}>
                                  From
                                </Typography>
                                <Typography sx={commonMainTextStyle}>
                                  {destination[index]?.departure}
                                </Typography>
                                <Typography
                                  sx={{ color: "#525371", fontSize: "11px" }}
                                >
                                  {destination[index]?.departureAirport?.name}
                                </Typography>
                              </Grid>

                              <Grid
                                item
                                xs={12}
                                sx={{
                                  border: borderStyle,
                                  borderLeft: "none",
                                  borderRight: { xs: "none" },
                                  borderBottom: { xs: "none" },
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  p: "7px 10px",
                                }}
                              >
                                <Typography sx={commonTextStyle}>To</Typography>
                                <Typography sx={commonMainTextStyle}>
                                  {destination.length === 1
                                    ? destination[0]?.arrival
                                    : destination[destination.length - 1]
                                        ?.departure}
                                </Typography>
                                <Typography
                                  sx={{ color: "#525371", fontSize: "11px" }}
                                >
                                  {destination.length === 1
                                    ? destination[0]?.arrivalAirport?.name
                                    : destination[destination.length - 1]
                                        ?.departureAirport?.name}
                                </Typography>
                              </Grid>

                              <Grid
                                item
                                xs={12}
                                sx={{
                                  position: "relative",
                                  border: borderStyle,
                                  borderLeft: "none",
                                  borderRight: { xs: "none" },
                                  borderBottom: { xs: "none" },
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  p: "7px 10px",
                                  cursor: "pointer",
                                }}
                              >
                                <Box
                                  onClick={() => {
                                    toggleOpenDeptCalendar(index);
                                    // Scroll to bottom
                                    window.scrollTo({
                                      top: document.documentElement
                                        .scrollHeight,
                                      behavior: "smooth",
                                    });
                                  }}
                                >
                                  <Typography sx={commonTextStyle}>
                                    Departure
                                  </Typography>
                                  <Typography sx={commonMainTextStyle}>
                                    {moment(departureDate[index]).format(
                                      "DD MMM, YYYY"
                                    )}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#525371",
                                      fontSize: "11px",
                                    }}
                                  >
                                    {moment(departureDate[index]).format(
                                      "dddd"
                                    )}
                                  </Typography>
                                </Box>
                                {openDeptCalendar[index] && (
                                  <Box
                                    className="new-dashboard-calendar"
                                    sx={{
                                      display: {
                                        md: "flex",
                                        sm: "block",
                                        xs: "block",
                                      },
                                      boxShadow: "none",
                                      flexFlow: "column nowrap",
                                      position: "absolute",
                                      zIndex: 1300,
                                      boxShadow:
                                        "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <CustomCalendar
                                      minDate={new Date()}
                                      // minDate={
                                      //   retriveData?.tripType === "oneWay"
                                      //     ? new Date()
                                      //     : selectedRows.length === 2
                                      //       ? new Date()
                                      //       : selectedRows.some(
                                      //             (item) => item.index === 1
                                      //           )
                                      //         ? new Date()
                                      //         : // ? new Date(fixedDate[0])
                                      //           undefined
                                      // }
                                      // maxDate={
                                      //   retriveData?.tripType === "oneWay"
                                      //     ? undefined
                                      //     : selectedRows.length === 2
                                      //       ? undefined
                                      //       : selectedRows.some(
                                      //             (item) => item.index === 0
                                      //           )
                                      //         ? new Date(fixedDate[1])
                                      //         : undefined
                                      // }
                                      date={departureDate[index]}
                                      title={"Departure Date"}
                                      handleChange={(date) =>
                                        handleDepartureDate(index, date)
                                      }
                                    />
                                  </Box>
                                )}
                              </Grid>

                              {selectedRows.length === 2 && (
                                <Grid
                                  item
                                  xs={12}
                                  md={1.9}
                                  sx={{
                                    position: "relative",
                                    border: borderStyle,
                                    borderLeft: "none",
                                    borderRight: {
                                      xs: "none",
                                      lg: borderStyle,
                                    },
                                    borderBottom: {
                                      xs: "none",
                                      lg: borderStyle,
                                    },
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    p: "7px 10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Box
                                    onClick={() => toggleOpenArrCalendar(index)}
                                  >
                                    <Typography sx={commonTextStyle}>
                                      Return
                                    </Typography>
                                    <Typography sx={commonMainTextStyle}>
                                      {moment(arrivalDate[index]).format(
                                        "DD MMM, YYYY"
                                      )}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#525371",
                                        fontSize: "11px",
                                      }}
                                    >
                                      {moment(arrivalDate[index]).format(
                                        "dddd"
                                      )}
                                    </Typography>
                                  </Box>
                                  {openArrCalendar[index] && (
                                    <Box
                                      sx={{
                                        display: {
                                          md: "flex",
                                          sm: "block",
                                          xs: "block",
                                        },
                                        background: "var(--white)",
                                        flexFlow: "column nowrap",
                                        position: "absolute",
                                        zIndex: 1300,
                                        boxShadow:
                                          "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                        borderRadius: "5px",
                                      }}
                                      className="new-dashboard-calendar"
                                    >
                                      <CustomCalendar
                                        date={arrivalDate[index]}
                                        handleChange={(date) => {
                                          handleArrivalDate(index, date);
                                        }}
                                        months={1}
                                        minDate={new Date(departureDate[index])}
                                        title={"Return Date"}
                                      />
                                    </Box>
                                  )}
                                </Grid>
                              )}

                              <Grid
                                item
                                xs={12}
                                sx={{
                                  border: borderStyle,
                                  borderLeft: "none",
                                  borderRight: "none",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  p: "7px 10px",
                                }}
                              >
                                <Typography sx={commonTextStyle}>
                                  Travelers
                                </Typography>
                                <Typography sx={commonMainTextStyle}>
                                  {selectedPassengers.length} Traveler
                                  {selectedPassengers.length > 1 ? "s" : ""}
                                </Typography>
                                <Tooltip
                                  title={selectedPassengers
                                    .map((index) => passengers[index])
                                    .map(
                                      (pax) =>
                                        `${pax.firstName} ${pax.lastName}`
                                    )
                                    .join(", ")}
                                  arrow
                                >
                                  <Typography
                                    sx={{
                                      color: "var(--secondary-color)",
                                      fontSize: "11px",
                                      visibility:
                                        selectedPassengers.length > 0
                                          ? "visible"
                                          : "hidden",
                                    }}
                                  >
                                    {selectedPassengers
                                      .map((index) => passengers[index])
                                      .map(
                                        (pax) =>
                                          `${pax.firstName} ${pax.lastName}`
                                      )
                                      .join(", ").length > 30
                                      ? `${selectedPassengers
                                          .map((index) => passengers[index])
                                          .map(
                                            (pax) =>
                                              `${pax.firstName} ${pax.lastName}`
                                          )
                                          .join(", ")
                                          .slice(0, 30)}...`
                                      : selectedPassengers
                                          .map((index) => passengers[index])
                                          .map(
                                            (pax) =>
                                              `${pax.firstName} ${pax.lastName}`
                                          )
                                          .join(", ")}
                                  </Typography>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          ))}
                        <Box sx={{ mt: 2.5 }}>
                          <Typography
                            onClick={() => {
                              originalPriceBreakdown.length !== priceBreakdown.length
                                ? handleSplitPassengersReissue()
                                : handleSearch();
                            }}
                            sx={{
                              textAlign: "center",
                              bgcolor: "var(--primary-color)",
                              py: 1.2,
                              mb: 1,
                              borderRadius: "5px",
                              fontSize: "14px",
                              color: "white",
                            }}
                          >
                            Search
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Drawer>
                )}
                <Box p={2}>
                  <FormGroup sx={{ mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isAccept}
                          onChange={(e) => setIsAccept(e.target.checked)}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#8F8F98",
                            fontSize: "13px",
                            fontWeight: "500",
                            pt: {
                              lg: "2px",
                            },
                          }}
                        >
                          By Completing this Reissue Request Agree with our{" "}
                          <Link
                            to="/terms-and-conditions"
                            target="_blank"
                            style={{
                              color: "var(--primary-color)",
                              textDecoration: "none",
                            }}
                          >
                            Terms and Conditions
                          </Link>{" "}
                          &
                          <Link
                            to="/privacy-policy"
                            target="_blank"
                            style={{
                              color: "var(--primary-color)",
                              textDecoration: "none",
                            }}
                          >
                            {" "}
                            Privacy Policy
                          </Link>
                          <RequiredIndicator />
                        </Typography>
                      }
                    />
                  </FormGroup>
                  <Box sx={{ display: { xs: "none", lg: "block" } }}>
                    <Button
                      disabled={!isAccept}
                      onClick={
                        originalPriceBreakdown.length !== priceBreakdown.length
                          ? handleSplitPassengersReissue
                          : handleSearch
                      }
                      sx={{
                        ...nextStepStyle,
                        ":hover": {
                          bgcolor: "var(--primary-color)",
                        },
                      }}
                    >
                      <Typography>
                        {originalPriceBreakdown.length !== priceBreakdown.length
                          ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                          : "SEARCH REISSUE FLIGHT"}
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* --- mobile button start --- */}
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
            position: "fixed",
            bottom: 0,
            width: "100%",
          }}
        >
          {type === "Reissue Fare Information" ? (
            <Button
              sx={mobileButtonStyle}
              onClick={() => setType("Booking Reissue Request")}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  px: 8,
                }}
              >
                PROCEED TO REISSUE REQUEST FOR THIS BOOKING
              </Typography>
            </Button>
          ) : (
            <Button
              disabled={!isAccept}
              onClick={() => {
                if (isMobile) {
                  setOpenDrawer(true);
                } else {
                  originalPriceBreakdown.length !== priceBreakdown.length
                    ? handleSplitPassengersReissue()
                    : handleSearch();
                }
              }}
              sx={mobileButtonStyle}
            >
              <Typography>
                {originalPriceBreakdown.length !== priceBreakdown.length
                  ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                  : "SEARCH REISSUE FLIGHT"}
              </Typography>
            </Button>
          )}
        </Box>
        {/* --- mobile button end --- */}
      </Box>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </ThemeProvider>
  );
};

export const AirlineChargeNotice = () => {
  return (
    <Box
      sx={{
        px: "15px",
        ".MuiSvgIcon-root": { color: "#E98D20" },
      }}
    >
      <Alert
        severity="info"
        sx={{
          border: "1px solid #E98D20",
          bgcolor: "#FEF9F2",
          color: "#E98D20",
          fontSize: "12px",
          padding: "0px 10px",
        }}
      >
        Please select your confirmed passengers before confirming your ticket
        request. This action will separate the selected passengers from your
        main booking and create a sub-booking. You must ensure at least one
        adult remains in the split booking and your current booking, Single
        infant cannot be split without and adult from the current booking.
      </Alert>
    </Box>
  );
};

const tabs = [
  {
    label: "Booking Reissue Request",
    value: "Booking Reissue Request",
  },
  {
    label: "Reissue Fare Information",
    value: "Reissue Fare Information",
  },
];

export default ReissueDetails;
