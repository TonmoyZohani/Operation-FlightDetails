import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  Select,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import commaNumber from "comma-number";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import { ReactComponent as AirplanIcon } from "../../images/svg/airplane.svg";
import { isDateWithinRange } from "../../utils/functions";
import {
  setClearAllStates,
  setPartialChargeData,
} from "../AirBooking/airbookingSlice";
import CustomToast from "../Alert/CustomToast";
import BookingLoader from "../Loader/BookingLoader";
import { dialogStyles } from "./NewViewFareCard";

const badgeStyle = {
  height: "23px",
  width: "23px",
  borderRadius: "50px",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "12px",
};

const fareRulesStyle = {
  py: 0.5,
  fontSize: "11px",
  bgcolor: "var(--secondary-color)",
  width: "fit-content",
  px: 1,
  color: "white",
  borderRadius: "2px",
  cursor: "pointer",
};

const style = {
  container: {
    display: "flex",
    position: "relative",
    border: "1px solid var(--primary-color)",
    borderRadius: "4px",
    minHeight: "8rem",
    margin: "0 auto",
    pb: 1,
  },
  inLine: {
    px: 1,
    display: "flex",
    gap: 1,
    color: "var(--dark-gray)",
    fontSize: "10px",
    justifyContent: "space-between",
  },
};

const MobileAfterViewFareCard = ({
  flightData,
  modifiedBrands,
  flightAfterSearch,
  handleFetchAndBooking,
  airPriceLoading,
  setAirPriceLoading,
  isFareLoading,
  errorMessage,
  setErrorMessage,
}) => {
  const [brandIndex, setBrandIndex] = useState();
  const [openBaggageDialog, setOpenBaggageDialog] = useState(false);
  const [openAditionalDialog, setOpenAditionalDialog] = useState(false);
  const [partialDialogBoxOpen, setPartialDialogBoxOpen] = useState(false);
  const [showFareRules, setShowFareRules] = useState(false);
  const { partialChargeData } = useSelector((state) => state.flightBooking);
  const [brandData, setBrandData] = useState({});
  const [modalType, setModalType] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { jsonHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const queryClient = useQueryClient();

  // TODO: Partialpayment request mutate
  const { mutate: partialPayMutate, status: partialPayStatus } = useMutation({
    mutationFn: (payload) =>
      axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/fare-rule`,
        payload,
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        dispatch(setPartialChargeData(data?.data?.data[0]));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["bookingData"]);
    },
    onError: (err) => {
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

  const handleBaggageDialogOpen = () => setOpenBaggageDialog(true);
  const handleBaggageDialogClose = () => setOpenBaggageDialog(false);

  const handleAditionalDialogOpen = () => setOpenAditionalDialog(true);
  const handleAditionalDialogClose = () => setOpenAditionalDialog(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenPartialDialog = () => setPartialDialogBoxOpen(true);
  const handleClosePartialDialog = () => {
    setPartialDialogBoxOpen(false);
    setBrandData({});
  };

  const handleShowFareRules = () => {
    setShowFareRules(true);
  };

  const handleDrawerClose = () => {
    setShowFareRules(false);
  };

  const handlePartialBooking = (item) => {
    setBrandData(item);
    handleOpenPartialDialog();

    const bodyData = {
      brandId: item?.brandId,
      data: flightData?.uuid,
      agentPrice: item?.agentPrice,
      travelDate: moment(flightData?.route?.[0]?.departureDate).format(
        "YYYY-MM-DD"
      ),
      journeyType: flightData?.journeyType,
      passengers: flightData?.priceBreakdown?.map((passenger) => ({
        type: passenger?.paxType,
        count: passenger?.paxCount,
        ages: passenger?.age === null ? [] : passenger?.age,
      })),
    };

    partialPayMutate(bodyData);
  };

  const { brands } = flightData;
  const bottomSheetHeight = 100;

  return (
    <Box
      sx={{
        position: "relative",
        pb: "80px",
        mt: 3,
        mx: 2,
      }}
    >
      <Grid
        container
        spacing={1.5}
        sx={{ minHeight: `calc(50vh - ${bottomSheetHeight}px)` }}
      >
        {brands?.map((item, index) => {
          const getFareRuleDetails = (ruleType) => {
            const fareDetail =
              modifiedBrands[index]?.structure?.length > 0 ? (
                modifiedBrands[index]?.structure
                  .filter((ite) => ite.name.toLowerCase() === ruleType)
                  .map((ite, index) => (
                    <span key={index}>
                      {ite.amount ? (
                        <>
                          {ite.amount.toLocaleString("en-IN")} {ite?.currency}{" "}
                          {item?.additionalFare}
                        </>
                      ) : (
                        <span style={{ color: "var(--primary-color)" }}>
                          {modalType === "reissue"
                            ? "Non Changeable"
                            : "Non Refundable"}
                        </span>
                      )}
                    </span>
                  ))
              ) : (
                <span style={{ color: "var(--primary-color)" }}>
                  {modalType === "reissue"
                    ? "Non Changeable"
                    : "Non Refundable"}
                </span>
              );

            return fareDetail;
          };
          return (
            <Grid item xs={12} sm={12} md={12} key={index}>
              <Box sx={style.container}>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      my: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Radio
                        checked={index === brandIndex}
                        value="a"
                        name="radio-buttons"
                        slotProps={{ input: { "aria-label": "A" } }}
                      />
                      <Box>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
                          {item?.brandName}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "var(--primary-color)",
                            fontWeight: 500,
                            lineHeight: "12px",
                          }}
                        >
                          {item?.additionalFare}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{ mr: 1, fontWeight: 500, fontSize: "16px" }}
                    >
                      {flightAfterSearch === "reissue-search" ? (
                        <>
                          <span
                            style={{
                              fontWeight: "600",
                              fontSize:
                                String(
                                  flightData?.fareDifference?.totalFare
                                    ?.reIssuePayable
                                )?.toLowerCase() === "will be decided"
                                  ? "17px"
                                  : "20px",
                            }}
                          >
                            {isNaN(
                              flightData?.fareDifference?.totalFare
                                ?.reIssuePayable
                            ) ? (
                              <>
                                {
                                  flightData?.fareDifference?.totalFare
                                    ?.reIssuePayable
                                }
                              </>
                            ) : (
                              <>
                                {flightData?.fareDifference?.totalFare?.reIssuePayable?.toLocaleString(
                                  "en-IN"
                                )}{" "}
                                BDT
                              </>
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontWeight: "600", fontSize: "20px" }}>
                            {commaNumber(modifiedBrands[index]?.["agentPrice"])}{" "}
                            BDT
                          </span>
                          <span
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "block",
                              textAlign: "end",
                              color: "var(--dark-gray)",
                            }}
                          >
                            <del>
                              {commaNumber(
                                modifiedBrands[index]?.["clientPrice"]
                              )}{" "}
                              BDT
                            </del>
                          </span>
                        </>
                      )}
                    </Typography>
                  </Box>

                  {/* --- Baggage start --- */}
                  <Box sx={style.inLine}>
                    <Typography>
                      <strong>Baggage:</strong>{" "}
                    </Typography>
                    <Typography>
                      Free Baggage {item?.baggage || item?.checkinBag}{" "}
                      {flightData?.brands[index]?.baggageFeatures?.length >
                        0 && (
                        <span
                          style={{
                            color: "var(--secondary-color)",
                            cursor: "pointer",
                            marginLeft: "5px",
                          }}
                          onClick={handleBaggageDialogOpen}
                        >
                          <u>more</u>
                        </span>
                      )}
                      {/* Mobile Dialog */}
                      <Dialog
                        open={openBaggageDialog}
                        onClose={handleBaggageDialogClose}
                      >
                        <DialogTitle>
                          Baggage Features
                          <IconButton
                            onClick={handleBaggageDialogClose}
                            style={{ position: "absolute", right: 0, top: 0 }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </DialogTitle>
                        <DialogContent>
                          <ul style={{ paddingLeft: "16px", margin: 0 }}>
                            {flightData?.brands[index]?.baggageFeatures?.map(
                              (feature, idx) => (
                                <li
                                  key={idx}
                                  style={{ fontSize: "14px", color: "#000" }}
                                >
                                  {feature?.message}
                                </li>
                              )
                            )}
                          </ul>
                        </DialogContent>
                      </Dialog>
                    </Typography>
                  </Box>
                  {/* --- Baggage end --- */}

                  <Box sx={style.inLine}>
                    <Typography>
                      {" "}
                      <strong>Meals:</strong>{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#888888",
                      }}
                    >
                      {item?.meals || "Meals and Beverage"}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ ...style.inLine }}>
                    <Typography>
                      {" "}
                      <strong>Reissue Befor Departure:</strong>{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "var(--secondary-color)",
                      }}
                    >
                      {modifiedBrands[index]?.structure?.length > 0 ? (
                        modifiedBrands[index]?.structure
                          .filter(
                            (item) =>
                              item?.name?.toLowerCase() ===
                              "reissue before departure"
                          )
                          .map((item, index) => (
                            <span key={index}>
                              {item.amount ? (
                                <>
                                  {item?.amount?.toLocaleString("en-IN")}{" "}
                                  {item?.currency}
                                </>
                              ) : (
                                <span style={{ color: "var(--primary-color)" }}>
                                  Non Changeable
                                </span>
                              )}
                            </span>
                          ))
                      ) : (
                        <span style={{ color: "var(--primary-color)" }}>
                          Non Changeable
                        </span>
                      )}

                      <span
                        style={{
                          color: "var(--secondary-color)",
                          textDecoration: "underline",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                        onClick={() => {
                          setModalType("reissue");
                          handleOpen();
                        }}
                      >
                        more
                      </span>
                    </Typography>
                  </Box>

                  <Box sx={style.inLine}>
                    <Typography>
                      {" "}
                      <strong>Reissue After Departure:</strong>{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "var(--secondary-color)",
                      }}
                    >
                      {modifiedBrands[index]?.structure?.length > 0 ? (
                        modifiedBrands[index]?.structure
                          .filter(
                            (item) =>
                              item?.name?.toLowerCase() ===
                              "reissue after departure"
                          )
                          .map((item, index) => (
                            <span key={index}>
                              {item.amount ? (
                                <>
                                  {item?.amount?.toLocaleString("en-IN")}{" "}
                                  {item?.currency}
                                </>
                              ) : (
                                <span style={{ color: "var(--primary-color)" }}>
                                  Non Changeable
                                </span>
                              )}
                            </span>
                          ))
                      ) : (
                        <span style={{ color: "var(--primary-color)" }}>
                          Non Changeable
                        </span>
                      )}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ ...style.inLine }}>
                    <Typography>
                      {" "}
                      <strong>Refund Befor Departure:</strong>{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "var(--secondary-color)",
                      }}
                    >
                      {modifiedBrands[index]?.structure?.length > 0 ? (
                        modifiedBrands[index]?.structure
                          .filter(
                            (item) =>
                              item?.name?.toLowerCase() ===
                              "refund before departure"
                          )
                          .map((item, index) => (
                            <span key={index}>
                              {item?.amount ? (
                                <>
                                  {item?.amount?.toLocaleString("en-IN")}{" "}
                                  {item?.currency}
                                </>
                              ) : (
                                <span style={{ color: "var(--primary-color)" }}>
                                  Non Refundable
                                </span>
                              )}
                            </span>
                          ))
                      ) : (
                        <span style={{ color: "var(--primary-color)" }}>
                          Non Refundable
                        </span>
                      )}
                      <span
                        style={{
                          color: "var(--secondary-color)",
                          textDecoration: "underline",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                        onClick={() => {
                          setModalType("refund");
                          handleOpen();
                        }}
                      >
                        more
                      </span>
                    </Typography>
                  </Box>
                  <Box sx={style.inLine}>
                    <Typography>
                      {" "}
                      <strong>Refund After Departure:</strong>{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "var(--secondary-color)",
                      }}
                    >
                      {modifiedBrands[index]?.structure?.length > 0 ? (
                        modifiedBrands[index]?.structure
                          ?.filter(
                            (item) =>
                              item?.name?.toLowerCase() ===
                              "refund after departure"
                          )
                          ?.map((item, index) => (
                            <span key={index}>
                              {item?.amount ? (
                                <>
                                  {item?.amount.toLocaleString("en-IN")}{" "}
                                  {item?.currency}
                                </>
                              ) : (
                                <span style={{ color: "var(--primary-color)" }}>
                                  Non Refundable
                                </span>
                              )}
                            </span>
                          ))
                      ) : (
                        <span style={{ color: "var(--primary-color)" }}>
                          Non Refundable
                        </span>
                      )}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />
                  <Box sx={style.inLine}>
                    <Typography>
                      {" "}
                      <strong>Booking Class:</strong>{" "}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "var(--secondary-color)",
                        fontWeight: "600",
                      }}
                    >
                      {item?.seatInfo?.map((code, i) => (
                        <React.Fragment key={i}>
                          {code?.bookingClass}
                          {i < item?.seatInfo - 1 && ", "}{" "}
                        </React.Fragment>
                      ))}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />
                  <Box sx={style.inLine}>
                    <Typography>
                      {" "}
                      <strong>Additional Info:</strong>{" "}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {!flightData?.brands[index]?.othersFeatures ||
                      flightData?.brands[index]?.othersFeatures?.length ===
                        0 ? (
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "var(--primary-color)",
                            fontWeight: "500",
                          }}
                        >
                          No extra features
                        </Typography>
                      ) : (
                        flightData?.brands[index]?.othersFeatures?.length >
                          0 && (
                          <Tooltip
                            title={
                              <ul style={{ paddingLeft: "16px", margin: 0 }}>
                                {flightData?.brands[index]?.othersFeatures.map(
                                  (feature, index) => (
                                    <li
                                      key={index}
                                      style={{
                                        fontSize: "12px",
                                        color: "#000",
                                      }}
                                    >
                                      {feature?.message}
                                    </li>
                                  )
                                )}
                              </ul>
                            }
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  backgroundColor: "#FFE6EB",
                                  color: "black",
                                  whiteSpace: "normal",
                                  padding: "8px",
                                },
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "13px",
                                color: "var(--secondary-color)",
                                fontWeight: "500",
                              }}
                              onClick={handleAditionalDialogOpen}
                            >
                              View More
                            </Typography>
                          </Tooltip>
                        )
                      )}
                      {/* Mobile Dialog */}
                      <Dialog
                        open={openAditionalDialog}
                        onClose={handleAditionalDialogClose}
                      >
                        <DialogTitle>
                          <IconButton
                            onClick={handleAditionalDialogClose}
                            style={{ position: "absolute", right: 8, top: 8 }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </DialogTitle>
                        <DialogContent>
                          <ul style={{ paddingLeft: "16px", margin: 0 }}>
                            {flightData?.brands[index]?.othersFeatures?.map(
                              (feature, index) => (
                                <li
                                  key={index}
                                  style={{ fontSize: "12px", color: "#000" }}
                                >
                                  {feature?.message}
                                </li>
                              )
                            )}
                          </ul>
                        </DialogContent>
                      </Dialog>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  {isDateWithinRange(flightData?.route?.[0]?.departureDate) &&
                    !flightData?.immediateIssue &&
                    flightData?.partialPayment &&
                    modifiedBrands[index]?.structure?.length > 0 &&
                    modifiedBrands[index]?.structure
                      ?.filter((item) =>
                        item?.name
                          ?.toLowerCase()
                          ?.includes("refund before departure")
                      )
                      ?.every((item) => item?.amount !== null) && (
                      <Box
                        sx={{
                          ...style.inLine,
                          display: "flex",
                          justifyContent: "right",
                          width: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            py: 0.5,
                            fontSize: "11px",
                            bgcolor: "#ff5f0f",
                            width: "fit-content",
                            px: 1,
                            color: "white",
                            textAlign: "left",
                            borderRadius: "2px",
                            cursor: "pointer",
                          }}
                          onClick={() => handlePartialBooking(item)}
                        >
                          Partail Payment Details
                        </Typography>
                      </Box>
                    )}
                  {isDateWithinRange(flightData?.route?.[0]?.departureDate) &&
                    !flightData?.immediateIssue &&
                    flightData?.partialPayment &&
                    modifiedBrands[index]?.structure?.length > 0 &&
                    modifiedBrands[index]?.structure
                      ?.filter((item) =>
                        item?.name
                          ?.toLowerCase()
                          ?.includes("refund before departure")
                      )
                      ?.every((item) => item?.amount !== null) && (
                      <Divider sx={{ my: 1 }} />
                    )}

                  <Box
                    sx={{
                      ...style.inLine,
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1,
                    }}
                  >
                    {isFareLoading ? (
                      <Box>
                        <Typography sx={fareRulesStyle}>
                          Loading.....
                        </Typography>
                      </Box>
                    ) : (
                      <Box onClick={() => handleShowFareRules()}>
                        <Typography sx={fareRulesStyle}>
                          Fare Rule Details
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        ...badgeStyle,
                        bgcolor:
                          item?.isRefundable === "Non Refundable"
                            ? "var(--primary-color)"
                            : "var(--green)",
                      }}
                    >
                      R
                    </Box>
                  </Box>

                  <Box sx={{ px: 1, my: 1 }}>
                    <Button
                      disabled={
                        airPriceLoading === index ||
                        modifiedBrands?.[index]?.isBook === false
                      }
                      onClick={() => {
                        setBrandIndex(index);
                        handleFetchAndBooking(modifiedBrands[index], index);
                        dispatch(setClearAllStates());
                      }}
                      sx={{
                        bgcolor: flightData?.immediateIssue
                          ? "var(--primary-color)"
                          : "var(--secondary-color)",
                        color: "#FFFFFF",
                        ":hover": {
                          bgcolor: flightData?.immediateIssue
                            ? "var(--primary-color)"
                            : "var(--secondary-color)",
                          color: "#FFFFFF",
                        },
                        width: "100%",
                      }}
                    >
                      {!flightData?.immediateIssue
                        ? "Instant Purchase"
                        : "Book"}
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    bgcolor: "red",
                    width: "5px",
                    height: "26px",
                    position: "absolute",
                    left: 0,
                    top: "4.5%",
                    borderRadius: "0 5px 5px 0",
                  }}
                ></Box>

                {modifiedBrands[index]?.structure &&
                  modifiedBrands[index]?.nonStructure &&
                  modifiedBrands[index]?.nonStructure?.length > 0 && (
                    <MobileFareDetails
                      showFareRules={showFareRules}
                      nonStructure={modifiedBrands[index]?.nonStructure}
                      flightData={flightData}
                      handleDrawerClose={handleDrawerClose}
                      brandName={modifiedBrands[index]?.brandName}
                    />
                  )}
                <Dialog
                  onClose={handleClose}
                  open={open}
                  PaperProps={{
                    sx: {
                      width: { xs: "100%", sm: "700px" },
                      minWidth: {
                        xs: "90%",
                        sm: "50%",
                      },
                      borderRadius: "8px",
                    },
                  }}
                >
                  <Box sx={{ ...dialogStyles.box, p: 2, width: "100%" }}>
                    <Grid container>
                      <Grid item xs={12} sx={dialogStyles.header}>
                        <Typography sx={dialogStyles.sectionTitle}>
                          {modalType === "reissue"
                            ? `Reissue Charge - ${item?.brandName}`
                            : `Refund Charge - ${item?.brandName}`}
                        </Typography>
                        <CloseIcon
                          onClick={() => handleClose()}
                          sx={{
                            color: "var(--primary-color)",
                            cursor: "pointer",
                          }}
                        />
                      </Grid>

                      <Grid
                        container
                        item
                        xs={12}
                        sx={dialogStyles.gridContainer}
                      >
                        <Grid
                          container
                          item
                          xs={12}
                          sx={{
                            width: "100%",
                            border: "1px solid #E2EAF1",
                            borderRadius: "3px",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            sx={{
                              ...dialogStyles.section,
                              bgcolor: "#F6F6F6",
                              pl: "10px",
                            }}
                          >
                            <Typography sx={dialogStyles.fareText}>
                              <span style={{ color: "var(--primary-color)" }}>
                                {(() => {
                                  const routes = flightData?.route || [];
                                  const length = routes.length;
                                  if (length === 1) {
                                    return (
                                      <>
                                        {routes[0]?.departure}
                                        <AirplanIcon className="airplane-icon" />
                                        {routes[0]?.arrival}
                                      </>
                                    );
                                  } else if (length === 2) {
                                    return (
                                      <>
                                        {routes[0]?.departure}
                                        <AirplanIcon className="airplane-icon" />
                                        {routes[1]?.departure}
                                        <AirplanIcon className="airplane-icon" />
                                        {routes[1]?.arrival}
                                      </>
                                    );
                                  } else if (length > 2) {
                                    return (
                                      <>
                                        {routes[0]?.departure}
                                        <AirplanIcon className="airplane-icon" />
                                        {routes[0]?.arrival}
                                        {routes.slice(1).map((route, index) => (
                                          <span key={index}>
                                            <AirplanIcon className="airplane-icon" />
                                            {route.arrival}
                                          </span>
                                        ))}
                                      </>
                                    );
                                  }
                                  return null;
                                })()}
                              </span>{" "}
                            </Typography>
                          </Grid>

                          {/* Timeframe & Fees Section */}
                          <Grid item xs={4} sx={dialogStyles.fareRow}>
                            <Typography sx={dialogStyles.fareText}>
                              Time Schedule
                            </Typography>
                            <span
                              style={{
                                ...dialogStyles.noteText,
                                fontSize: "9px",
                              }}
                            >
                              (From scheduled flight departure)
                            </span>
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            sx={{
                              ...dialogStyles.fareRow,
                              borderLeft: "1px solid #E2EAF1",
                            }}
                          >
                            <Typography sx={dialogStyles.fareText}>
                              Airline Fee
                            </Typography>
                            <span
                              style={{
                                ...dialogStyles.noteText,
                                fontSize: "9px",
                              }}
                            >
                              (Per Passenger)
                            </span>
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            sx={{
                              ...dialogStyles.fareRow,
                              borderLeft: "1px solid #E2EAF1",
                            }}
                          >
                            <Typography sx={dialogStyles.fareText}>
                              Fly Far International Fee
                            </Typography>
                            <span
                              style={{
                                ...dialogStyles.noteText,
                                fontSize: "9px",
                              }}
                            >
                              (Per Passenger)
                            </span>
                          </Grid>

                          {/* Before and After Departure */}
                          {["Before Departure", "After Departure"].map(
                            (time, index) => (
                              <React.Fragment key={index}>
                                <Grid item xs={4} sx={dialogStyles.section}>
                                  <Typography sx={dialogStyles.noteText}>
                                    {time}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  sx={{
                                    ...dialogStyles.section,
                                    borderLeft: "1px solid #E2EAF1",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "9px",
                                      color: "var(--secondary-color)",
                                    }}
                                  >
                                    {modalType === "reissue"
                                      ? getFareRuleDetails(
                                          `reissue ${time.toLowerCase()}`
                                        )
                                      : getFareRuleDetails(
                                          `refund ${time.toLowerCase()}`
                                        )}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  sx={{
                                    ...dialogStyles.section,
                                    borderLeft: "1px solid #E2EAF1",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "9px",
                                      color: "var(--secondary-color)",
                                    }}
                                  >
                                    {modalType === "refund"
                                      ? flightData?.charges?.refundCharge[0]
                                          ?.serviceCharge
                                      : flightData?.charges?.reIssueCharge[0]
                                          ?.serviceCharge}{" "}
                                    BDT
                                  </Typography>
                                </Grid>
                              </React.Fragment>
                            )
                          )}
                        </Grid>

                        {/* Footer Important Notice */}
                        <Grid item xs={12} sx={dialogStyles.importantNotice}>
                          <Typography
                            sx={{
                              fontSize: "10px",
                              color: "var(--primary-color)",
                            }}
                          >
                            <span style={dialogStyles.spanImportant}>
                              *Important:
                            </span>{" "}
                            {modalType === "reissue"
                              ? `The airline fee provided is for reference only, and Fly Far International does not guarantee its accuracy. All mentioned fees apply per passenger. Date change fees are only applicable when rebooking with the same airline on a new date. Additionally, any fare difference between the original and new booking must be paid by the user. For information on the number of free date changes allowed, if applicable, please refer to the Date Change Charges section above.`
                              : `The
                    airline fees are for reference only, and FlyFar
                    International does not guarantee the accuracy of this
                    information. All fees listed are per passenger.`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Dialog>

                <Dialog
                  open={partialDialogBoxOpen}
                  PaperProps={{
                    sx: {
                      width: { xs: "100%", sm: "700px" },
                      minWidth: {
                        xs: "90%",
                        sm: "50%",
                      },
                      borderRadius: "8px",
                    },
                  }}
                >
                  <Box sx={{ ...dialogStyles.box, p: 2, width: "100%" }}>
                    <Grid container>
                      <Grid item xs={12} sx={dialogStyles.header}>
                        <Typography sx={dialogStyles.sectionTitle}>
                          Partial Payment Info - {item?.brandName}
                        </Typography>
                        <CloseIcon
                          onClick={() => handleClosePartialDialog()}
                          sx={{
                            color: "var(--primary-color)",
                            cursor: "pointer",
                          }}
                        />
                      </Grid>

                      <Grid
                        container
                        item
                        xs={12}
                        sx={dialogStyles.gridContainer}
                      >
                        <Grid
                          container
                          item
                          xs={12}
                          sx={{
                            width: "100%",
                            border: "1px solid #E2EAF1",
                            borderRadius: "3px",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            sx={{
                              ...dialogStyles.section,
                              bgcolor: "#F6F6F6",
                              pl: "10px",
                            }}
                          >
                            <Typography sx={dialogStyles.fareText}>
                              <span style={{ color: "var(--primary-color)" }}>
                                {(() => {
                                  const routes = flightData?.route || [];
                                  const length = routes.length;
                                  if (length === 1) {
                                    return (
                                      <>
                                        {routes[0]?.departure}
                                        <AirplanIcon className="airplane-icon" />
                                        {routes[0]?.arrival}
                                      </>
                                    );
                                  } else if (length === 2) {
                                    return (
                                      <>
                                        {routes[0]?.departure}
                                        <AirplanIcon className="airplane-icon" />
                                        {routes[1]?.departure}
                                        <AirplanIcon className="airplane-icon" />
                                        {routes[1]?.arrival}
                                      </>
                                    );
                                  } else if (length > 2) {
                                    return (
                                      <>
                                        {routes[0]?.departure}
                                        <AirplanIcon className="airplane-icon" />
                                        {routes[0]?.arrival}
                                        {routes.slice(1).map((route, index) => (
                                          <span key={index}>
                                            <AirplanIcon className="airplane-icon" />
                                            {route.arrival}
                                          </span>
                                        ))}
                                      </>
                                    );
                                  }
                                  return null;
                                })()}
                              </span>{" "}
                            </Typography>
                          </Grid>

                          {/* Partial amount & Charge */}
                          <Grid item xs={4} sx={dialogStyles.fareRow}>
                            <Typography
                              sx={{ ...dialogStyles.fareText, py: 1.5 }}
                            >
                              Partial Payable Amount
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            sx={{
                              ...dialogStyles.fareRow,
                              borderLeft: "1px solid #E2EAF1",
                            }}
                          >
                            <Typography
                              sx={{ ...dialogStyles.fareText, py: 1.5 }}
                            >
                              Fly Far International Charge
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            sx={{
                              ...dialogStyles.fareRow,
                              borderLeft: "1px solid #E2EAF1",
                            }}
                          >
                            <Typography
                              sx={{ ...dialogStyles.fareText, py: 1.5 }}
                            >
                              Due Deadline
                            </Typography>
                          </Grid>

                          <React.Fragment>
                            <Grid item xs={4} sx={dialogStyles.section}>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  color: "var(--secondary-color)",
                                }}
                              >
                                {partialPayStatus === "pending" ? (
                                  <Skeleton sx={{ width: "70px" }} />
                                ) : (
                                  <span>
                                    {partialChargeData?.amount -
                                      partialChargeData?.totalCharge}{" "}
                                    BDT
                                  </span>
                                )}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              sx={{
                                ...dialogStyles.section,
                                borderLeft: "1px solid #E2EAF1",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  color: "var(--secondary-color)",
                                }}
                              >
                                {partialPayStatus === "pending" ? (
                                  <Skeleton sx={{ width: "70px" }} />
                                ) : (
                                  <span>
                                    {partialChargeData?.totalCharge} BDT
                                  </span>
                                )}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              sx={{
                                ...dialogStyles.section,
                                borderLeft: "1px solid #E2EAF1",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  color: "var(--secondary-color)",
                                }}
                              >
                                {partialPayStatus === "pending" ? (
                                  <Skeleton sx={{ width: "70px" }} />
                                ) : (
                                  <span>
                                    {/* {"Need From Api "} */}
                                    {moment(partialChargeData?.dueDate).format(
                                      "MMM DD, YYYY hh:mm A"
                                    )}
                                  </span>
                                )}
                              </Typography>
                            </Grid>
                          </React.Fragment>
                        </Grid>

                        {/* Footer Important Notice */}
                        <Grid item xs={12} sx={dialogStyles.importantNotice}>
                          <Typography sx={{ fontSize: "12px" }}>
                            <span
                              style={{
                                ...dialogStyles.spanImportant,
                                color: "var(--primary-color)",
                                fontWeight: 600,
                              }}
                            >
                              *Important:
                            </span>{" "}
                            <span style={{ color: "var(--primary-color)" }}>
                              The partial payable amount and deadline are not
                              changeable. Please ensure you pay the due amount
                              before the deadline; otherwise, your ticket will
                              be forcefully refunded.
                            </span>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Dialog>
              </Box>

              {airPriceLoading === index && (
                <BookingLoader
                  brandName={item?.brandName}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  setAirPriceLoading={setAirPriceLoading}
                />
              )}
            </Grid>
          );
        })}
      </Grid>

      <PartialPaymentDialogBox
        handleClosePartialDialog={handleClosePartialDialog}
        partialDialogBoxOpen={partialDialogBoxOpen}
        partialChargeData={partialChargeData}
        partialPayStatus={partialPayStatus}
        flightData={flightData}
        brandData={brandData}
      />

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />
    </Box>
  );
};

const MobileFareDetails = ({
  showFareRules,
  nonStructure,
  flightData,
  handleDrawerClose,
  brandName,
}) => {
  const [structure, setStructure] = useState(nonStructure[0]);
  const [labelValue, setLabelValue] = useState("");

  const handleStructure = (val) => {
    setLabelValue(val);
    const selectedStructure = nonStructure.find((item) => item.title === val);
    setStructure(selectedStructure);
  };

  return (
    <Dialog open={showFareRules}>
      <DialogTitle>
        <IconButton
          onClick={handleDrawerClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {showFareRules && (
        <Box sx={{ py: 3, px: 2, bgcolor: "#fff" }}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              bgcolor: "#fff",
              zIndex: 1100,
            }}
          >
            <img
              src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${flightData?.carrier}.png`}
              width="45"
              height="45"
              alt="flight-logo"
            />
            <Typography
              sx={{
                color: "var(--secondary-color)",
                fontSize: "14px",
                fontWeight: "500",
                mt: 1,
              }}
            >
              {flightData?.carrierName}
            </Typography>
            <Typography
              sx={{
                color: "black",
                fontSize: "13px",
                fontWeight: "400",
                mt: 1,
              }}
            >
              {flightData?.cityCount?.length
                ? flightData.cityCount.map((cities, i) =>
                    cities.map((city, index) => (
                      <span key={`${i}-${index}`}>
                        {index > 0 && ", "}
                        {city?.marketingCarrier}-{city?.marketingFlight}
                      </span>
                    ))
                  )
                : "No city data available"}
              <span style={{ paddingLeft: "3px" }}>, {brandName}</span>
            </Typography>
          </Box>
          <Select
            value={labelValue}
            onChange={(e) => handleStructure(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Select Type" }}
            sx={{
              bgcolor: "var(--primary-color)",
              color: "white",
              textAlign: "left",
              height: "42px",
              textTransform: "uppercase",
              fontSize: "14px",
              width: "100%",
            }}
            MenuProps={{
              disableScrollLock: true,
              PaperProps: { sx: { maxHeight: "200px", overflowY: "auto" } },
            }}
          >
            {nonStructure?.map((item, i) => (
              <MenuItem
                key={i}
                value={item?.title}
                sx={{ textTransform: "capitalize" }}
              >
                {i + 1}. {item.title}
              </MenuItem>
            ))}
          </Select>

          <Box
            sx={{
              mt: 3,
              height: "250px",
              overflow: "auto",
              p: 1,
              border: "1px solid var(--border)",
              borderRadius: "5px",
            }}
          >
            <Typography
              sx={{ fontSize: "12px", color: "black", lineHeight: "1.5" }}
            >
              {structure?.text || "No details available"}
            </Typography>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

const PartialPaymentDialogBox = ({
  handleClosePartialDialog,
  partialDialogBoxOpen,
  partialChargeData,
  partialPayStatus,
  flightData,
  brandData,
}) => {
  return (
    <Dialog
      open={partialDialogBoxOpen}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "600px" },
          minWidth: {
            xs: "90%",
            sm: "50%",
          },
          borderRadius: "8px",
        },
      }}
    >
      <Box
        sx={{
          ...dialogStyles.box,
          p: {
            xs: 1,
            sm: 2,
          },
        }}
      >
        <Grid container>
          <Grid item xs={12} sx={dialogStyles.header}>
            <Typography sx={dialogStyles.sectionTitle}>
              Partial Payment Info - {brandData?.brandName}
            </Typography>
            <CloseIcon
              onClick={() => handleClosePartialDialog()}
              sx={{ color: "var(--primary-color)", cursor: "pointer" }}
            />
          </Grid>

          <Grid container item xs={12} sx={dialogStyles.gridContainer}>
            <Grid
              container
              item
              xs={12}
              sx={{
                width: "100%",
                border: "1px solid #E2EAF1",
                borderRadius: "3px",
              }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  ...dialogStyles.section,
                  bgcolor: "#F6F6F6",
                  pl: "10px",
                }}
              >
                <Typography sx={dialogStyles.fareText}>
                  <span style={{ color: "var(--primary-color)" }}>
                    {(() => {
                      const routes = flightData?.route || [];
                      const length = routes.length;
                      if (length === 1) {
                        return (
                          <>
                            {routes[0]?.departure}
                            <AirplanIcon className="airplane-icon" />
                            {routes[0]?.arrival}
                          </>
                        );
                      } else if (length === 2) {
                        return (
                          <>
                            {routes[0]?.departure}
                            <AirplanIcon className="airplane-icon" />
                            {routes[1]?.departure}
                            <AirplanIcon className="airplane-icon" />
                            {routes[1]?.arrival}
                          </>
                        );
                      } else if (length > 2) {
                        return (
                          <>
                            {routes[0]?.departure}
                            <AirplanIcon className="airplane-icon" />
                            {routes[0]?.arrival}
                            {routes?.slice(1).map((route, index) => (
                              <span key={index}>
                                <AirplanIcon className="airplane-icon" />
                                {route?.arrival}
                              </span>
                            ))}
                          </>
                        );
                      }
                      return null;
                    })()}
                  </span>{" "}
                </Typography>
              </Grid>

              {/* Timeframe & Fees Section */}
              <Grid item xs={4} sx={dialogStyles.fareRow}>
                <Typography sx={dialogStyles.fareText}>
                  Partial Payable Amount
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  ...dialogStyles.fareRow,
                  borderLeft: "1px solid #E2EAF1",
                }}
              >
                <Typography sx={{ ...dialogStyles.fareText, py: 1.5 }}>
                  Fly Far International Charge
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  ...dialogStyles.fareRow,
                  borderLeft: "1px solid #E2EAF1",
                }}
              >
                <Typography sx={dialogStyles.fareText}>
                  Due Clear Deadline
                </Typography>
              </Grid>

              <React.Fragment>
                <Grid item xs={4} sx={dialogStyles.section}>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "11px",
                        sm: "13px",
                      },
                      color: "var(--secondary-color)",
                    }}
                  >
                    {partialPayStatus === "pending" ? (
                      <Skeleton sx={{ width: "70px" }} />
                    ) : (
                      <span>
                        {partialChargeData?.amount -
                          partialChargeData?.totalCharge}{" "}
                        BDT
                      </span>
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={dialogStyles.section}>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "11px",
                        sm: "13px",
                      },
                      color: "var(--secondary-color)",
                    }}
                  >
                    {partialPayStatus === "pending" ? (
                      <Skeleton sx={{ width: "70px" }} />
                    ) : (
                      <span>{partialChargeData?.totalCharge} BDT</span>
                    )}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    ...dialogStyles.section,
                    borderLeft: "1px solid #E2EAF1",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "11px",
                        sm: "13px",
                      },
                      color: "var(--secondary-color)",
                    }}
                  >
                    {partialPayStatus === "pending" ? (
                      <Skeleton sx={{ width: "70px" }} />
                    ) : (
                      <span>
                        {moment(partialChargeData?.dueDate).format(
                          "MMM DD, YYYY"
                        )}
                      </span>
                    )}
                  </Typography>
                </Grid>
              </React.Fragment>
            </Grid>

            {/* Footer Important Notice */}
            <Grid item xs={12} sx={dialogStyles.importantNotice}>
              <Typography sx={{ fontSize: "12px" }}>
                <span
                  style={{
                    ...dialogStyles.spanImportant,
                    color: "var(--primary-color)",
                    fontWeight: 600,
                  }}
                >
                  *Important:
                </span>{" "}
                <span style={{ color: "var(--primary-color)" }}>
                  The partial payable amount and deadline are not changeable.
                  Please ensure you pay the due amount before the deadline;
                  otherwise, your ticket will be forcefully refunded.
                </span>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default MobileAfterViewFareCard;
