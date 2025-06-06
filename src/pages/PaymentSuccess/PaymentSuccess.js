import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ReactComponent as CurvedPlane } from "../../images/svg/curvedplaneline.svg";
import Departure from "../../images/svg/departure.svg";
import Arrival from "../../images/svg/arrival.svg";
import Person from "../../images/svg/person.svg";
import TicketCircle from "../../images/svg/ticket-circle.svg";
import BarCode from "../../images/svg/barcode.svg";
import Lottie from "lottie-react";
import checkFile from "../../assets/lottie/check.json";
import congratulations from "../../assets/lottie/congratulations.json";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import Slider from "react-slick";
import moment from "moment";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderStyles.css";
import PDFPageDesign from "../../component/PDFPageDesign/PDFPageDesign";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TicketSkeletonLoader from "../../component/SkeletonLoader/TicketSkeletonLoader";

const PaymentSuccess = () => {
  const queryClient = useQueryClient();
  const [showAnimation, setShowAnimation] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const { state } = useLocation();
  const { bookingId } = state;
  const { jsonHeader } = useAuth();

  const navigate = useNavigate();

  const { data: singleBookingData, status } = useQuery({
    queryKey: ["singleBookingData", bookingId],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/retrieve`,
        {
          bookingId: bookingId,
        },
        jsonHeader()
      );
      return data;
    },
  });

  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    fade: true,
    afterChange: (index) => setCurrentIndex(index),
  };

  let setting2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    fade: true,
    afterChange: (index) => setCurrentIndex(index),
    customPaging: (i) => (
      <div
        style={{
          width: "25px",
          height: "10px",
          borderRadius: "2px",
          backgroundColor: i === currentIndex ? "#dc143c" : "#F2F2F2",
        }}
      ></div>
    ),
    appendDots: (dots) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1px",
        }}
      >
        {dots}
      </div>
    ),
  };

  const totalPax = singleBookingData?.data?.details?.priceBreakdown?.reduce(
    (total, pax) => {
      return total + pax?.paxCount;
    },
    0
  );

  let stops = [];
  singleBookingData?.data?.details?.route.forEach((route, index) => {
    if (index > 0) {
      const currentStops = singleBookingData?.data?.details?.cityCount[index];

      const departureCodes = currentStops.map((stop) => stop.departureCityCode);

      stops.push(...departureCodes);
    }
  });

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 2000); // 2-second delay

      // Clear the timer if the component is unmounted
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <>
      {status === "pending" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "#18457B",
          }}
        >
          <TicketSkeletonLoader />
        </Box>
      )}
      {status === "success" && (
        <Box
          sx={{
            width: "100%",
            bgcolor: "#18457B",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // py: 7,
            // pb: 3,
            ".slick-dots": {
              li: {
                margin: "5px",
                "&:first-of-type": {
                  marginLeft: "0",
                },
              },
            },
          }}
        >
          <Box>
            <Box
              sx={{
                width: {
                  xs: "90%",
                  lg: "347px",
                },
                mx: "auto",
                bgcolor: "#FFFFFF",
                minHeight: "70vh",
                borderRadius: "10px",
                position: "relative",
                px: 2.5,
              }}
            >
              <Typography
                sx={{
                  color: "var(--primary-color)",
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  pt: "40px",
                  textAlign: "center",
                }}
              >
                Payment Successful
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mt: 2.5,
                  mb: "1rem",
                }}
              >
                <img
                  alt="Remy Sharp"
                  src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${singleBookingData?.data?.carrier}.png`}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "var(--secondary-color)",
                      textTransform: "uppercase",
                    }}
                  >
                    {singleBookingData?.data?.carrierName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#AFB6BB",
                    }}
                  >
                    {singleBookingData?.data?.carrier}-
                    {
                      singleBookingData?.data?.details?.cityCount[0][0]
                        ?.marketingFlight
                    }{" "}
                    | {singleBookingData?.data?.bookingId}
                  </Typography>
                </Box>
              </Box>

              <Box>
                {singleBookingData?.data?.details?.cityCount?.length > 0 ? (
                  <Slider {...settings}>
                    {singleBookingData?.data?.details?.cityCount.map(
                      (cities, outerIndex) => (
                        <Box key={outerIndex}>
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            mb={2}
                          >
                            <Grid item xs={3.5}>
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                  }}
                                >
                                  {cities[0]?.departureCityName}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "1.6rem",
                                    fontWeight: 500,
                                    color: "var(--black)",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {cities[0]?.departureCityCode}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                  }}
                                >
                                  {moment(cities[0]?.departureDateTime).format(
                                    "HH:mm"
                                  )}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={5}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <CurvedPlane
                                  style={{ width: "260px" }}
                                  alt="Flight illustration"
                                />
                              </Box>
                              <Typography
                                sx={{
                                  textAlign: "center",
                                  fontSize: "0.65rem",
                                  mt: "-10px",
                                  color: "#8F8F98",
                                }}
                              >
                                {cities[0]?.totalFlightDuration}
                              </Typography>
                            </Grid>

                            <Grid item xs={3.5}>
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                    textAlign: "right",
                                  }}
                                >
                                  {cities[cities?.length - 1]?.arrivalCityName}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "1.6rem",
                                    fontWeight: 500,
                                    color: "var(--black)",
                                    textAlign: "right",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {cities[cities?.length - 1]?.arrivalCityCode}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                    textAlign: "right",
                                  }}
                                >
                                  {moment(
                                    cities[cities?.length - 1]?.arrivalDateTime
                                  ).format("HH:mm")}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      )
                    )}
                  </Slider>
                ) : (
                  <Typography>No data available</Typography>
                )}

                {singleBookingData?.data?.details?.cityCount?.length > 0 ? (
                  <Slider {...setting2}>
                    {singleBookingData?.data?.details?.cityCount.map(
                      (cities, outerIndex) => (
                        <Box key={outerIndex} sx={{ mt: 0 }}>
                          {/* {cities?.map((item, innerIndex) => ( */}
                          <Grid container spacing={1} mb={2}>
                            <Grid item xs={4}>
                              <Box
                                sx={{
                                  bgcolor: "#F2F2F2",
                                  borderRadius: "2.7px",
                                  p: 0.8,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                  }}
                                >
                                  {moment(cities[0]?.departureDate)?.format(
                                    "DD MMM YYYY"
                                  )}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                  }}
                                >
                                  {moment(cities[0]?.departureDateTime)?.format(
                                    "HH:mm"
                                  )}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mr: 1,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      fontWeight: 400,
                                      color: "var(--secondary-color)",
                                    }}
                                  >
                                    DEPART
                                  </Typography>
                                  <img src={Departure} alt="logo" />
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box
                                sx={{
                                  bgcolor: "#F2F2F2",
                                  borderRadius: "2.7px",
                                  p: 0.8,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                  }}
                                >
                                  {moment(
                                    cities[cities?.length - 1]?.arrivalDate
                                  )?.format("DD MMM YYYY")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                  }}
                                >
                                  {moment(
                                    cities[cities?.length - 1]?.arrivalDateTime
                                  )?.format("HH:mm")}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mr: 1,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      fontWeight: 400,
                                      color: "var(--secondary-color)",
                                    }}
                                  >
                                    ARRIVAL
                                  </Typography>
                                  <img src={Arrival} alt="logo" />
                                </Box>
                              </Box>
                            </Grid>

                            <Grid item xs={4}>
                              <Box
                                sx={{
                                  bgcolor: "#F2F2F2",
                                  borderRadius: "2.7px",
                                  p: 0.8,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  height: "65px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                  }}
                                >
                                  {stops?.length > 1
                                    ? stops?.slice(1, stops?.length).join(" & ")
                                    : "Non Stop"}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "var(--secondary-color)",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Stops
                                  {stops?.length > 1 && (
                                    <span>({stops?.length - 1})</span>
                                  )}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box
                                sx={{
                                  bgcolor: "#F2F2F2",
                                  borderRadius: "2.7px",
                                  p: 0.8,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  height: "100%",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                  }}
                                >
                                  {singleBookingData?.data?.airlinePnr}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "var(--secondary-color)",
                                  }}
                                >
                                  AIRLINES PNR
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box
                                sx={{
                                  bgcolor: "#F2F2F2",
                                  borderRadius: "2.7px",
                                  p: 0.8,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  height: "65px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {cities[0]?.cabinCode} ||{" "}
                                  {cities[0]?.bookingClass}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mr: 1,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      fontWeight: 400,
                                      color: "var(--secondary-color)",
                                    }}
                                  >
                                    CLASS
                                  </Typography>
                                  <img src={Person} alt="logo" />
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box
                                sx={{
                                  bgcolor: "#F2F2F2",
                                  borderRadius: "2.7px",
                                  p: 0.8,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  height: "65px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    color: "#AFB6BB",
                                  }}
                                >
                                  {totalPax}{" "}
                                  {totalPax?.length > 1
                                    ? "Traveller"
                                    : "Travellers"}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mr: 1,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      fontWeight: 400,
                                      color: "var(--secondary-color)",
                                    }}
                                  >
                                    PAX
                                  </Typography>
                                  <img src={Person} alt="logo" />
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      )
                    )}
                  </Slider>
                ) : (
                  <Typography>No data available</Typography>
                )}
              </Box>

              <img
                src={TicketCircle}
                alt="logo"
                style={{
                  width: "110%",
                  position: "absolute",
                  left: "50%",
                  right: "50%",
                  transform: "translateX(-50%)",
                  marginTop: "8px",
                }}
              />
              <Box sx={{ mt: 7.5 }}>
                <img src={BarCode} alt="logo" />
              </Box>
              <Typography
                sx={{ fontSize: "11px", pb: 1.5, textAlign: "center" }}
              >
                <PDFDownloadLink
                  document={
                    <PDFPageDesign
                      copy="per-pax-ticket-copy"
                      check="1"
                      singleBooking={singleBookingData?.data}
                      ticket={false}
                    />
                  }
                  fileName={`eticketp`}
                  style={{
                    textDecoration: "none",
                    color: "var(--secondary-color)",
                  }}
                >
                  {({ url, loading }) =>
                    loading ? (
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    ) : (
                      <Typography
                        component="a"
                        href={url}
                        sx={{
                          cursor: "pointer",
                          color: "var(--secondary-color)",
                          fontSize: "14px",
                          textDecoration: "none",
                          textAlign: "center",
                        }}
                        target="_blank"
                      >
                        Download E-Ticket
                      </Typography>
                    )
                  }
                </PDFDownloadLink>
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  width: "100px",
                  height: "100px",
                  left: "50%",
                  right: "50%",
                  borderRadius: "50%",
                  transform: "translateX(-50%)",
                  top: "-60px",
                }}
              >
                <Lottie
                  animationData={checkFile}
                  loop={false}
                  autoplay={true}
                  style={{ height: 120 }}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              sx={{
                bgcolor: "var(--primary-color)",
                color: "white",
                width: "100%",
                mt: 1,
                py: 1.5,
                fontWeight: 500,
                ":hover": {
                  bgcolor: "var(--primary-color)",
                },
              }}
              onClick={() => {
                // queryClient.invalidateQueries({
                //   queryKey: ["singleBookingData", bookingId, "current booking"],
                // });
                navigate(
                  `/dashboard/booking/airtickets/all/${singleBookingData?.data?.id}`
                );

                window.location.reload();
              }}
            >
              Done
            </Button>
          </Box>
          {status === "success" && showAnimation && (
            <Box sx={{ position: "absolute", top: 0 }}>
              <Lottie
                animationData={congratulations}
                loop={false}
                style={{ height: 500 }}
              />
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default PaymentSuccess;
