import React, { useState } from "react";
import { Box, Grid, Typography, ThemeProvider, Dialog } from "@mui/material";
import { theme } from "../../../utils/theme";
import { TicketStatus } from "../../../component/AirBooking/PriceBreakdown";
import { useLocation } from "react-router-dom";
import PageTitle from "../../../shared/common/PageTitle";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import moment from "moment";
import ZoomTran from "../../../component/Branch/components/ZoomTran";
import FareRulesCharges from "../../../component/FlightAfterSearch/components/FareRulesCharges";
import { TaxBreakDown } from "./RefundQuotation";
import VoidFareInfo from "../components/VoidFareInfo";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";
import QueueHeader from "../components/QueueHeader";
import { TicketStatusSkeleton } from "../../../component/SkeletonLoader/TicketStatusSkeleton";
import FilterSkeleton from "../../../component/SkeletonLoader/FilterSkeleton";
import BookingDetailsSkeleton from "../../../component/SkeletonLoader/BookingDetailsSkeleton";
import VoidPriceBreakdown from "../../../component/AirBooking/VoidPriceBreakdown";

const VoidQuotation = () => {
  const { state } = useLocation();
  const { jsonHeader } = useAuth();
  const { retriveData, passengers } = state;
  const priceBreakdown = retriveData?.details?.priceBreakdown || [];
  // const priceBreakdown =
  //   retriveData?.details?.priceBreakdown?.map((item, i) => {
  //     const crrPassenger = flattenedPassengers.at(i);
  //     return { ...item, ...crrPassenger };
  //   }) || [];

  const [crrAllTax, setCrrAllTax] = useState({
    isOpen: false,
    allTax: [],
    oldTax: [],
    name: "",
  });

  const [query] = useState({
    commissionType: retriveData?.commissionType,
    tripType: retriveData?.tripType,
    journeyType: retriveData?.journeyType,
  });

  const { data: voidServiceData, isLoading } = useQuery({
    queryKey: ["voidDetailsServiceData", query],
    queryFn: async () => {
      const queryParams = new URLSearchParams(query).toString();
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/common/service-charges/void?${queryParams}`;
      const { data } = await axios.get(url, jsonHeader());

      return data;
    },
    staleTime: 0,
  });

  const getPassengerRows = (priceBreakdown, retriveData) => {
    return priceBreakdown.map((passenger, index) => {
      const crrPax = passengers.at(index);

      return [
        `${passenger?.firstName} ${passenger?.lastName}`,
        passenger?.paxType === "CNN" ? (
          <>
            {passenger?.paxType}{" "}
            <span style={{ color: "var(--primary-color)" }}>
              [{passenger?.age} yrs]
            </span>
          </>
        ) : (
          passenger.paxType
        ),
        moment(passenger?.dateOfBirth).format("DD MMM, YYYY"),
        crrPax?.passportNation,
        passenger
          ? `${passenger?.baseFare?.toLocaleString("en-IN")} BDT`
          : "N/A",
        passenger ? `${passenger?.tax?.toLocaleString("en-IN")} BDT` : "N/A",
        retriveData?.paymentStatus?.toUpperCase(),
      ];
    });
  };

  const itineraryRows =
    retriveData?.details?.route.map((route, index) => {
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

  const totalServiceCharge = retriveData?.details?.voidPassengers
    ? retriveData?.details?.voidPassengers.reduce(
        (total, pax) => total + pax?.serviceCharge,
        0
      )
    : retriveData?.details?.priceBreakdown.reduce((total, pax) => {
        const matchingService = voidServiceData?.data?.[0]?.data?.find(
          (service) => service.paxType === pax.paxType
        );
        if (matchingService) {
          return total + matchingService.serviceCharge * pax.paxCount;
        }
        return total;
      }, 0);

  const passengerRows = getPassengerRows(priceBreakdown, retriveData);

  if (isLoading) {
    return (
      <>
        <Box
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },
          }}
        >
          <QueueHeader type={"Booking Void Details"} tabs={[]} />
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <span>Loading...</span>
          </Typography>
        </Box>
        <Box
          sx={{
            display: {
              xs: "none",
              lg: "block",
            },
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              mt: 2,
            }}
          >
            <Grid item lg={2.4}>
              <TicketStatusSkeleton />
              <FilterSkeleton />
            </Grid>
            <Grid item lg={9}>
              <BookingDetailsSkeleton />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mb: { xs: 7, lg: 0 } }}>
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
            <Grid item xs={12} lg={2.4}>
              <TicketStatus data={retriveData} />

              <VoidPriceBreakdown
                data={retriveData}
                priceBreakdown={priceBreakdown || []}
                label={
                  retriveData?.status === "void"
                    ? "Total Void Amount"
                    : "Total Voidable Amount"
                }
                serviceCharge={totalServiceCharge}
                isNotEquals={passengers.length !== priceBreakdown.length}
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
            </Grid>
            <Grid
              item
              xs={12}
              lg={9.4}
              sx={{
                bgcolor: "#fff",
                borderRadius: "4px",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <PageTitle title={"Booking Void Details"} />

                {/*Passenger's table shown here */}
                <Grid item xs={12} sx={{ bgcolor: "#fff", p: "12px 15px" }}>
                  <Typography
                    sx={{ fontSize: "15px", fontWeight: 500, pb: "15px" }}
                  >
                    Passenger Information
                  </Typography>

                  <Box>
                    <DynamicMuiTable
                      columns={passengerColumns}
                      rows={passengerRows}
                      getCellContent={(row, colIndex) => row[colIndex]}
                    />
                  </Box>

                  {retriveData?.details?.route.map((_, index) => (
                    <Grid
                      item
                      lg={12}
                      sx={{
                        bgcolor: "#fff",
                        p: "12px 0",
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

                  <VoidFareInfo
                    retriveData={{
                      ...retriveData,
                      details: {
                        ...retriveData?.details,
                        priceBreakdown:
                          retriveData?.details?.priceBreakdown.map(
                            (item, i) => {
                              const crrPassenger = retriveData?.details
                                ?.voidPassengers
                                ? retriveData?.details?.voidPassengers.at(i)
                                : voidServiceData?.data?.[0]?.data?.find(
                                    (service) =>
                                      service?.paxType === item?.paxType
                                  );
                              return { ...item, ...crrPassenger };
                            }
                          ),
                      },
                    }}
                  />
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={crrAllTax?.isOpen}
        // open={true}
        TransitionComponent={ZoomTran}
        maxWidth={"sm"}
        fullWidth
        onClose={() => {
          setCrrAllTax({ isOpen: false, allTax: [], oldTax: [], name: "" });
        }}
      >
        <TaxBreakDown crrAllTax={crrAllTax} />
      </Dialog>
    </ThemeProvider>
  );
};

const itineraryColumns = [
  "Airlines",
  "Destination",
  "Stops",
  "Flight No",
  "Flight Date",
  "Flight Status",
];

const passengerColumns = [
  "Name",
  "Pax Type",
  "DOB",
  "Nationality",
  "Base Fare",
  "Tax",
  "Payment Status",
];

export default VoidQuotation;
