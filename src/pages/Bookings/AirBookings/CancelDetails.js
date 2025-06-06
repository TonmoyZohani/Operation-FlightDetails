import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Modal,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TicketStatus } from "../../../component/AirBooking/PriceBreakdown";
import RefundPriceBreakdown from "../../../component/AirBooking/RefundPriceBreakdown";
import CustomAlert from "../../../component/Alert/CustomAlert";
import CustomToast from "../../../component/Alert/CustomToast";
import RequiredIndicator from "../../../component/Common/RequiredIndicator";
import TimeCountDown from "../../../component/FlightAfterSearch/components/TimeCountDown";
import PendingLoader from "../../../component/Loader/PendingLoader";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import ApproveRejectDialog from "../../../shared/common/ApproveRejectDialog";
import PageTitle from "../../../shared/common/PageTitle";
import { BpCheckedIcon, BpIcon } from "../../../shared/common/styles";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import { mobileButtonStyle, nextStepStyle } from "../../../style/style";
import { theme } from "../../../utils/theme";
import BookingHeader from "../components/BookingHeader";
import MobilePassengerInfo from "../components/MobilePassengerInfo";
import { AirlineChargeNotice, modalStyle } from "./IssueDetails";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";

const CancelDetails = () => {
  const { state } = useLocation();
  const { jsonHeader } = useAuth();
  const [allSelected, setAllSelected] = useState(false);
  const { retriveData, passengers, flightCancel } = state;
  const [selectedPassengers, setSelectedPassengers] = useState([0]);
  const [priceBreakdown, setPriceBreakdown] = useState([]);
  const [selectImage, setSelectImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [type, setType] = useState("Booking Cancel Request");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const titleRef = useRef();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!allSelected) {
      handleSelectAll();
    }
  }, []);

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

  const getFilteredPassengers = (retriveData, flattenedPassengers) => {
    const matchingRelations = retriveData?.relation || [];

    const relationsMap = new Map();

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

    const mergedPassengers = flattenedPassengers.map((passenger) => {
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

    return mergedPassengers.filter((passenger) => passenger.indexNumber <= 0);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedPassengers([]);
      setPriceBreakdown([]);
      setAllSelected(false);
    } else {
      const filteredPassengers = getFilteredPassengers(retriveData, passengers);

      const allIndexes = filteredPassengers?.map((_, index) => index);

      setSelectedPassengers(allIndexes);
      setAllSelected(true);

      const allPriceBreakdowns = passengers.map((passenger, index) => {
        const price = retriveData?.details?.priceBreakdown.find((item) => {
          const isTypeMatch = item.paxType === passenger.type;

          const isAgeMatch =
            passenger.type === "CNN" &&
            passenger.age &&
            item.age?.includes(passenger.age);

          return passenger.type === "CNN" ? isAgeMatch : isTypeMatch;
        });

        return {
          ...passenger,
          index,
          baseFare: price?.baseFare ?? 0,
          tax: price?.tax ?? 0,
        };
      });

      setPriceBreakdown(allPriceBreakdowns);
    }
  };

  const getPassengerRows = (
    passengers,
    retriveData,
    selectedPassengers,
    handleCheckboxChange
  ) => {
    const filteredPassengers = getFilteredPassengers(retriveData, passengers);

    return filteredPassengers.map((passenger, index, arr) => {
      const price = retriveData?.details?.priceBreakdown.find(
        (item) => item.paxType === passenger.type
      );

      return [
        <FormControlLabel
          key={index}
          sx={{ pl: 1.5 }}
          control={
            <Checkbox
              disableRipple
              disabled={
                !flightCancel?.operations?.splitCancel ||
                (retriveData?.paymentStatus === "partially paid" &&
                  retriveData?.status === "ticketed") ||
                (priceBreakdown?.length === 1 &&
                  priceBreakdown?.some((item) => item.index === index))
              }
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
        `${passenger.firstName} ${passenger.lastName}`,
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
          <Typography>{passenger?.passportNation}</Typography>
        </Box>,
        price ? `${price?.baseFare?.toLocaleString("en-IN")}` : "N/A",
        price ? `${price?.tax?.toLocaleString("en-IN")}` : "N/A",
        <Typography key={index}>{retriveData?.paymentStatus}</Typography>,
      ];
    });
  };

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
    handleCheckboxChange,
    handleOpen,
    setSelectImage
  );

  const { mutate, status: cancelStatus } = useMutation({
    mutationFn: ({ bookingId }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/cancel`,
        { bookingId },
        jsonHeader()
      ),
    onSuccess: (data) => {
      setIsLoading(false);
      if (data?.data?.success) {
        showToast("success", data?.data?.message, () => {
          navigate(`/dashboard/booking/airtickets/all`);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["singleBookingData"]);
    },
    onError: (err) => {
      setIsLoading(false);
      if (err.response) {
        const errorMessage = err.response.data.message || "An error occurred";
        showToast("error", errorMessage);
      } else if (err.request) {
        showToast("error", err.message);
      } else {
        showToast("error", "An unexpected error occurred.");
      }
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

  const handleCancelBooking = (title) => {
    const titleInputValue = titleRef?.current?.value;

    if (titleInputValue !== title) {
      showToast(
        "error",
        "Confirmation Spelling or Case Sensetive Doesn't match"
      );
      return;
    }

    const bookingId = retriveData?.id;
    setIsLoading(true);
    setDialogOpen(false);
    mutate({ bookingId });
  };

  const handleSplitPassengersVoid = async () => {
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

  const handleChangeSwitch = () => {
    if (currentData?.title === "Cancel Booking") {
      handleCancelBooking(currentData?.title);
    }
  };

  const handleSubmit = async (title, message) => {
    if (selectedPassengers?.length === 0) {
      showToast("warning", "Please select at least one passenger");
      return;
    }

    setCurrentData({
      title,
    });

    const result = await CustomAlert({
      success: "warning",
      message,
    });
    if (result.isConfirmed) {
      setDialogOpen(true);
    }
  };

  // mobile handle function
  const handleTypeChange = (event, newTab) => {
    if (event?.target?.value) {
      setType(event?.target?.value);
    } else {
      setType(newTab);
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
          tabs={tabs || []}
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
            xs={12}
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
                  xs: type === "Booking Fare Information" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <TicketStatus data={retriveData} />
              {retriveData?.status?.toLowerCase() === "ticketed" && (
                <TimeCountDown
                  label="Void Request Expire Time Limit"
                  timeLimit={moment(retriveData?.Tickets[0]?.createdAt)
                    .clone()
                    .set({ hour: 23, minute: 59, second: 0 })}
                />
              )}
              <RefundPriceBreakdown
                data={retriveData}
                priceBreakdown={priceBreakdown || []}
                commission={retriveData?.commission}
                label="Total Payable Amount"
                paydue={
                  retriveData?.paymentStatus?.toLowerCase() === "partially paid"
                    ? true
                    : false
                }
                paydata={retriveData}
                isNotEquals={passengers?.length !== priceBreakdown?.length}
              />
            </Grid>
            <Grid
              item
              xs={12}
              lg={9.4}
              sx={{
                bgcolor: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: "5px",
                display: {
                  xs: type === "Booking Cancel Request" ? "block" : "none",
                  lg: "block",
                },
              }}
            >
              <Box>
                <PageTitle title={`Booking Cancel Request`} />

                {/* Passengers Information Starts Here */}
                <Grid item lg={12} sx={{ bgcolor: "#fff", p: "12px 15px" }}>
                  <Typography
                    sx={{ fontSize: "15px", fontWeight: "500", pb: "15px" }}
                  >
                    Passenger Information
                  </Typography>

                  <Box
                    sx={{
                      display: {
                        xs: "none",
                        lg: "block",
                      },
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
                          type === "Booking Cancel Request" ? "block" : "none",
                        lg: "none",
                      },
                    }}
                  >
                    {flattenedPassengers?.map((passenger, index) => {
                      const price = retriveData?.details?.priceBreakdown.find(
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

                  <Box sx={{ mt: "15px" }}>
                    {passengers.length !== priceBreakdown.length && (
                      <AirlineChargeNotice />
                    )}
                  </Box>
                </Grid>
              </Box>
              {/* Terms and conditions */}

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: {
                      xs: "flex-start",
                      lg: "center",
                    },
                    pl: 2,
                    my: { lg: "10px", xs: "15px" },
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={() => setIsAccept((prev) => !prev)}
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
                          By Completing this Operation Agree with our{" "}
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
                </Box>
                <Box
                  p={2}
                  sx={{
                    display: {
                      xs: "none",
                      lg: "block",
                    },
                  }}
                >
                  <Button
                    disabled={cancelStatus === "pending" || !isAccept}
                    onClick={
                      passengers.length !== priceBreakdown.length
                        ? handleSplitPassengersVoid
                        : () =>
                            handleSubmit(
                              "Cancel Booking",
                              "Are you sure? You want to Cancel This Booking?"
                            )
                    }
                    sx={{
                      ...nextStepStyle,
                      ":hover": {
                        bgcolor: "var(--primary-color)",
                      },
                    }}
                  >
                    <Typography>
                      {passengers.length !== priceBreakdown.length
                        ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                        : "CLICK TO COMPLETE THE CANCEL REQUEST"}
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* --- mobile button start --- */}
        <Box
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },
            position: "fixed",
            bottom: 0,
            width: "100%",
          }}
        >
          {type === "Booking Fare Information" ? (
            <Button
              sx={mobileButtonStyle}
              onClick={() => setType("Booking Cancel Request")}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  px: 8,
                }}
              >
                PROCEED TO CANCEL REQUEST FOR THIS BOOKING
              </Typography>
            </Button>
          ) : (
            <Button
              disabled={cancelStatus === "pending" || !isAccept}
              onClick={
                passengers.length !== priceBreakdown.length
                  ? handleSplitPassengersVoid
                  : () =>
                      handleSubmit(
                        "Cancel Booking",
                        "Are you sure? You want to Cancel This Booking?"
                      )
              }
              sx={mobileButtonStyle}
            >
              <Typography sx={{ px: 8, fontSize: "11px" }}>
                {passengers.length !== priceBreakdown.length
                  ? "CONFIRM AND SPLIT YOUR PASSENGER FROM THIS BOOKING"
                  : cancelStatus === "pending"
                    ? "Please Wait..."
                    : "CLICK TO COMPLETE THE CANCEL REQUEST"}
              </Typography>
            </Button>
          )}
        </Box>
        {/* --- mobile button end --- */}
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {selectImage?.includes(".pdf") ? (
            <iframe
              title="logo"
              src={selectImage}
              width="100%"
              height="100%"
            ></iframe>
          ) : (
            <img
              alt="logo"
              src={selectImage}
              style={{
                height: "100%",
                width: "100%",
              }}
            />
          )}
        </Box>
      </Modal>

      <ApproveRejectDialog
        currentData={currentData}
        titleRef={titleRef}
        isDisabled={cancelStatus === "pending"}
        handleChangeSwitch={handleChangeSwitch}
        open={dialogOpen}
        setOpen={setDialogOpen}
      />

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      <CustomLoadingAlert
        open={isLoading}
        text={`We Are Processing Your Request`}
      />
    </ThemeProvider>
  );
};

const tabs = [
  {
    label: "Booking Cancel Request",
    value: "Booking Cancel Request",
  },
  {
    label: "Booking Fare Information",
    value: "Booking Fare Information",
  },
];

export default CancelDetails;
