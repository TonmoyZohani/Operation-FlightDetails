import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DynamicMuiTable from "../../../shared/Tables/DynamicMuiTable";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { BpCheckedIcon, BpIcon } from "../../../shared/common/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import { actionBtn } from "../../../shared/common/ApproveRejectDialog";
import { Link } from "react-router-dom";
import CustomAlert from "../../../component/Alert/CustomAlert";
import MobileItineraryCard from "../../Bookings/components/MobileItineraryCard";
import { mobileButtonStyle } from "../../../style/style";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";

const RefundAncillaries = ({
  data,
  ancillaryData,
  retriveData,
  itineraryColumns,
  itineraryRows,
  getCellContent,
  ancillaryRefundData,
  setAncillaryRefundData,
  setIsRefund,
  isShow,
}) => {
  const [openIndex, setOpenIndex] = useState(0);
  const [isAccept, setIsAccept] = useState(false);
  const { jsonHeader } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);

  const { mutate, status } = useMutation({
    mutationFn: (data) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/ancillary-refund`,
        data,
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message, () => {
          setIsRefund((prev) => !prev);
          setAncillaryRefundData([]);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries([
        "processingData",
        "pendingData",
        "tobeConfirmData",
        "approveData",
      ]);
    },
    onError: (err) => {
      let errorMessage = "An unexpected error occurred.";
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = err.message;
      }
      showToast("error", errorMessage);
    },
  });

  const handleCheckboxChange = (ancilary) => {
    const isExisting = ancillaryRefundData?.find(
      (item) => item?.id === ancilary?.id
    );
    if (isExisting) {
      const remainingAncillaries = ancillaryRefundData?.filter(
        (item) => item?.id !== isExisting?.id
      );
      setAncillaryRefundData((prevData) => [...remainingAncillaries]);
    } else {
      setAncillaryRefundData((prevData) => [...prevData, ancilary]);
    }
  };

  const onSubmit = async () => {
    const ancillaryIds = ancillaryRefundData?.map((item) => item.id);
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to make Ancillaries Refund Request!",
    });

    if (result.isConfirmed) {
      setIsLoadingSpinner(true);
      mutate(
        { ancillaryIds: ancillaryIds },
        {
          onSettled: () => {
            setIsLoadingSpinner(false);
          },
        }
      );
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ width: "100%" }}>
        {ancillaryData?.passengerAncillaries?.map((passenger, outerIndex) => {
          return (
            <Box
              key={outerIndex}
              sx={{
                bgcolor: "#fff",
                borderRadius: "5px",
                mb: "10px",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: {
                    xs: "12px 10px",
                    lg: "12px 15px",
                  },
                  bgcolor: "#F2F8FF",
                  mx: 2,
                  borderRadius: "5px",
                }}
                onClick={() =>
                  setOpenIndex(openIndex === outerIndex ? null : outerIndex)
                }
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--secondary-color)",
                    fontWeight: "500",
                  }}
                >
                  <span style={{ textTransform: "uppercase" }}>
                    {passenger?.passengerInfo?.prefix}{" "}
                    {passenger?.passengerInfo?.firstName}{" "}
                    {passenger?.passengerInfo?.lastName}
                  </span>{" "}
                  [{" "}
                  {passenger?.passengerInfo?.paxType === "ADT"
                    ? "Adult"
                    : passenger?.passengerInfo?.paxType === "CNN"
                      ? "Child"
                      : "Infant"}{" "}
                  ]
                  {passenger?.passengerInfo?.paxType === "CNN" && (
                    <span
                      style={{
                        color: "var(--primary-color)",
                        fontSize: "12px",
                      }}
                    ></span>
                  )}
                </Typography>

                <ArrowDropDownIcon
                  sx={{
                    bgcolor: "#FFFFFF",
                    color: "var(--secondary-color)",
                    borderRadius: "50%",
                    transform: `rotate(${
                      openIndex === outerIndex ? "180deg" : "0deg"
                    })`,
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </Box>
              <Collapse
                in={openIndex === outerIndex}
                timeout="auto"
                unmountOnExit
                sx={{
                  width: "100%",
                  transition: "height 1s ease-in-out",
                }}
              >
                {retriveData?.details?.route?.map((ro, index) => {
                  const ancillariesData = passenger?.ancillaries?.filter(
                    (item) => item.itineraryIndex === index + 1
                  );

                  return (
                    <Grid
                      key={index}
                      container
                      item
                      lg={12}
                      sx={{ mb: "10px", px: 1.5 }}
                    >
                      <Grid
                        item
                        lg={12}
                        sx={{
                          bgcolor: "#fff",
                          p: "12px 15px",
                          display: {
                            xs: "none",
                            lg: "block",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            pb: "15px",
                            px: 1,
                          }}
                        >
                          {retriveData?.tripType !== "multiCity"
                            ? `Flight Itinerary  ${
                                index === 0 ? "Onward " : "Return "
                              }`
                            : `Flight Itinerary `}
                          <span
                            style={{
                              color: "var(--primary-color)",
                              fontWeight: 500,
                            }}
                          >
                            {ro?.departure}-{ro?.arrival}
                          </span>{" "}
                        </Typography>

                        <DynamicMuiTable
                          columns={itineraryColumns}
                          rows={[itineraryRows[index]]}
                          getCellContent={getCellContent}
                        />
                      </Grid>

                      {/* --- Mobile Itinerary Card start --- */}
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: {
                            xs: "block",
                            lg: "none",
                          },
                          px: 0.5,
                          mt: 1,
                        }}
                      >
                        <MobileItineraryCard
                          retriveData={retriveData}
                          index={index}
                          route={ro}
                          isReissue={true}
                          isAncillaries={true}
                        />
                      </Grid>
                      {/* --- Mobile Itinerary Card end --- */}

                      <Grid
                        item
                        xs={12}
                        sx={{
                          bgcolor: "#fff",
                          p: {
                            xs: "0 6px",
                            lg: "12px 15px",
                          },
                        }}
                        key={index}
                      >
                        {ancillariesData?.length > 0 && (
                          <>
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "0.813rem",
                                  lg: "1rem",
                                },
                                fontWeight: "500",
                                pb: "15px",
                                px: 0,
                                color: "var(--secondary-color)",
                              }}
                            >
                              {retriveData?.tripType !== "multiCity"
                                ? `Flight Itinerary  ${
                                    index === 0 ? "Onward" : "Return"
                                  }  Ancillaries ${
                                    ancillaryData?.ancillaryRequest?.status ===
                                    "processing"
                                      ? "On Process"
                                      : "Approved"
                                  }`
                                : `Flight Itinerary ${ro?.departure}-${ro?.arrival} Applied Ancillaries`}{" "}
                            </Typography>
                            <Stack spacing={1} mb={2}>
                              {ancillariesData &&
                                ancillariesData?.map(
                                  (ancilary, ancilaryIndex) => {
                                    const isAncilaryUnavailbale =
                                      ancilary?.status !== "unavailable";
                                    return (
                                      <>
                                        {isAncilaryUnavailbale && (
                                          <Box
                                            key={ancilaryIndex}
                                            sx={{
                                              display: "flex",
                                              flexDirection: {
                                                xs: "column",
                                                lg: "row",
                                              },
                                              alignItems: {
                                                xs: "center",
                                              },
                                              gap: {
                                                xs: 0.8,
                                                lg: 1,
                                              },
                                              border: "1px solid var(--border)",
                                              py: 1,
                                              px: 1.5,
                                              borderRadius: "4px",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: {
                                                  xs: "center",
                                                  lg: "center",
                                                },
                                                width: {
                                                  xs: "100%",
                                                  lg: "30%",
                                                },
                                              }}
                                            >
                                              <Tooltip
                                                title={
                                                  <Typography
                                                    sx={{
                                                      textTransform:
                                                        "uppercase",
                                                      fontSize: "0.75rem",
                                                    }}
                                                  >
                                                    {ancilary?.refundable
                                                      ? "Refundable"
                                                      : "Non Refundable"}
                                                  </Typography>
                                                }
                                              >
                                                <FormControlLabel
                                                  sx={{ pl: 1, pr: 0 }}
                                                  control={
                                                    <Checkbox
                                                      disabled={
                                                        !ancilary?.refundable ||
                                                        ancilary?.refundRequest
                                                      }
                                                      disableRipple
                                                      checked={
                                                        ancillaryRefundData?.some(
                                                          (item) =>
                                                            item?.id ===
                                                            ancilary?.id
                                                        ) ||
                                                        ancilary?.refundRequest
                                                      }
                                                      onChange={() =>
                                                        handleCheckboxChange(
                                                          ancilary
                                                        )
                                                      }
                                                      checkedIcon={
                                                        <BpCheckedIcon
                                                          bgColor={
                                                            ancilary?.refundRequest
                                                              ? "var(--primary-color)"
                                                              : "var(--primary-color)"
                                                          }
                                                        />
                                                      }
                                                      icon={
                                                        <BpIcon
                                                          boxShadowColor={
                                                            ancilary?.refundRequest
                                                              ? "green"
                                                              : ancilary?.refundable
                                                                ? "green"
                                                                : "gray"
                                                          }
                                                        />
                                                      }
                                                    />
                                                  }
                                                />
                                              </Tooltip>
                                              <Typography
                                                sx={{
                                                  // width: "80%",
                                                  textTransform: "uppercase",
                                                  fontSize: "0.85rem",
                                                  fontWeight: 600,
                                                }}
                                              >
                                                {ancilary?.type}{" "}
                                              </Typography>
                                            </Box>
                                            <Typography
                                              sx={{
                                                display: {
                                                  xs: "none",
                                                  lg: "block",
                                                },
                                              }}
                                            >
                                              :
                                            </Typography>
                                            <Typography
                                              sx={{
                                                width: {
                                                  xs: "100%",
                                                  lg: "60%",
                                                },
                                                textWrap: "wrap",
                                                textTransform: "uppercase",
                                                fontSize: {
                                                  xs: "0.75rem",
                                                  lg: "0.85rem",
                                                },
                                                fontWeight: 500,
                                                color: "#4D4B4B",
                                              }}
                                            >
                                              {ancilary?.description?.length <
                                              80
                                                ? ancilary?.description
                                                : ancilary?.description?.slice(
                                                    0,
                                                    80
                                                  ) + "..."}
                                            </Typography>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                justifyContent: {
                                                  xs: "space-between",
                                                  lg: "flex-end",
                                                },
                                                gap: {
                                                  xs: 1,
                                                  lg: 2,
                                                },
                                                alignItems: "center",
                                                width: {
                                                  xs: "100%",
                                                  lg: "50%",
                                                },
                                              }}
                                            >
                                              {ancilary?.refundRequest
                                                ?.status && (
                                                <Typography
                                                  sx={{
                                                    textTransform: "uppercase",
                                                    fontSize: {
                                                      xs: "0.75rem",
                                                      lg: "0.85rem",
                                                    },
                                                    fontWeight: 500,
                                                    color:
                                                      ancilary?.refundRequest?.status?.toLowerCase() ===
                                                      "pending"
                                                        ? "#4D4B4B"
                                                        : "#1e8449",
                                                  }}
                                                >
                                                  {
                                                    ancilary?.refundRequest
                                                      ?.status
                                                  }
                                                </Typography>
                                              )}

                                              <Typography
                                                sx={{
                                                  textTransform: "uppercase",
                                                  fontSize: "0.85rem",
                                                  fontWeight: 500,
                                                  color:
                                                    "var(--secondary-color)",
                                                }}
                                              >
                                                {ancilary?.price} BDT
                                              </Typography>
                                              {ancilary?.refundable ? (
                                                <Tooltip
                                                  title={
                                                    <Typography
                                                      sx={{
                                                        textTransform:
                                                          "uppercase",
                                                        fontSize: "0.75rem",
                                                      }}
                                                    >
                                                      Refundable
                                                    </Typography>
                                                  }
                                                >
                                                  <IconButton
                                                    sx={{
                                                      width: "20px",
                                                      height: "20px",
                                                      bgcolor: "green",
                                                      ":hover": {
                                                        bgcolor: "green",
                                                      },
                                                      fontSize: "0.95rem",
                                                      color: "white",
                                                    }}
                                                  >
                                                    R
                                                  </IconButton>
                                                </Tooltip>
                                              ) : (
                                                <Tooltip
                                                  title={
                                                    <Typography
                                                      sx={{
                                                        textTransform:
                                                          "uppercase",
                                                        fontSize: "0.75rem",
                                                      }}
                                                    >
                                                      Non Refundable
                                                    </Typography>
                                                  }
                                                >
                                                  <IconButton
                                                    sx={{
                                                      width: "20px",
                                                      height: "20px",
                                                      bgcolor:
                                                        "var(--primary-color)",
                                                      ":hover": {
                                                        bgcolor:
                                                          "var(--primary-color)",
                                                      },
                                                      fontSize: "0.95rem",
                                                      color: "white",
                                                    }}
                                                  >
                                                    R
                                                  </IconButton>
                                                </Tooltip>
                                              )}
                                            </Box>
                                          </Box>
                                        )}
                                      </>
                                    );
                                  }
                                )}
                            </Stack>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Collapse>
            </Box>
          );
        })}
        {isShow && (
          <Stack
            spacing={2}
            sx={{
              p: 2,
              zIndex: 1,
            }}
          >
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
                        xs: "8px",
                        lg: "2px",
                      },
                    }}
                  >
                    By Completing this Ancillaries Refund Agree with our{" "}
                    <Link
                      to="#"
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
                      to="#"
                      target="_blank"
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                      }}
                    >
                      {" "}
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
            </FormGroup>
            <Button
              disabled={
                !isAccept ||
                status === "pending" ||
                ancillaryRefundData?.length === 0
              }
              type="submit"
              onClick={onSubmit}
              sx={{
                ...actionBtn,
                ...actionBtn.green,
                width: "100%",
                textAlign: "left",
                py: 1.2,
                display: {
                  xs: "none",
                  lg: "flex",
                },
                justifyContent: "flex-start",
              }}
            >
              <Typography
                sx={{
                  textAlign: "left",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                {status === "pending"
                  ? "Please wating..."
                  : "Ancillaries Refund Request"}
              </Typography>
            </Button>

            {/* --- mobile button start --- */}
            <Box
              sx={{
                display: {
                  xs: "block",
                  lg: "none",
                },
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
              }}
            >
              <Button
                disabled={
                  !isAccept ||
                  status === "pending" ||
                  ancillaryRefundData?.length === 0
                }
                sx={mobileButtonStyle}
                onClick={onSubmit}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    px: 9,
                  }}
                >
                  {status === "pending"
                    ? "Please wating..."
                    : "Ancillaries Refund Request"}
                </Typography>
              </Button>
            </Box>
            {/* --- mobile button end --- */}
          </Stack>
        )}
      </Box>

      <CustomLoadingAlert
        open={isLoadingSpinner}
        text={"We Are Processing Your Request"}
      />
    </Box>
  );
};

export default RefundAncillaries;
