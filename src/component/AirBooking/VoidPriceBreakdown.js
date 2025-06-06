import { Box, Button, Collapse, Dialog, Typography, Zoom } from "@mui/material";
import React, { useState } from "react";
import { PassengerPriceBreakdown } from "../../shared/common/functions";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const VoidPriceBreakdown = ({
  data,
  priceBreakdown,
  label,
  isNotEquals = false,
  serviceCharge = 0,
}) => {
  const [open, setOpen] = useState(false);
  const [openPriceBox, setOpenPriceBox] = useState(false);
  const partialData = data?.partialPayment || {};

  const totalBaseFare = priceBreakdown.reduce(
    (acc, passenger) => acc + passenger.baseFare,
    0
  );

  const totalTax = priceBreakdown.reduce(
    (acc, passenger) => acc + passenger.tax,
    0
  );

  const totalAit = priceBreakdown.reduce(
    (acc, passenger) => acc + passenger?.finalAit,
    0
  );

  const totalGrossPrice = totalBaseFare + totalTax;

  const totalAdditionalAmount =
    data?.details?.priceBreakdown.reduce(
      (acc, passenger) => acc + passenger?.additionalInfo?.additionAmount,
      0
    ) || 0;

  const handleToggle = () => {
    setOpenPriceBox((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "column" },
        mb: "1rem",
      }}
    >
      {/* Price breakdown */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "3px",
          mt: { xs: "-5px" },
          pb: "12px",
          pt: "2px",
        }}
      >
        <Box sx={priceBreakdownStyle.priceBox} onClick={handleToggle}>
          <Box sx={{ ...justifyBetween, alignItems: "center", width: "100%" }}>
            <Box>
              <Typography sx={priceBreakdownStyle.label}>{label}</Typography>
              <Typography sx={priceBreakdownStyle.amount}>
                {isNotEquals
                  ? "Will be decided"
                  : data?.paymentStatus === "paid"
                    ? Number(
                        (
                          (data.agentPrice ?? 0) -
                          (serviceCharge ?? 0) -
                          (partialData?.totalCharge || 0)
                        )?.toFixed(2)
                      )?.toLocaleString("en-IN") + " BDT"
                    : (
                        (partialData?.totalPayedAmount ?? 0) -
                        (partialData?.totalCharge ?? 0) -
                        (serviceCharge ?? 0)
                      )?.toLocaleString("en-IN") + " BDT"}

                {data?.paymentStatus?.toLowerCase() !== "partially paid" &&
                  data?.paymentStatus?.toLowerCase() !== "unpaid" && (
                    <RemoveIcon sx={{ color: "var(--primary-color)" }} />
                  )}
              </Typography>

              {data?.paymentStatus?.toLowerCase() !== "partially paid" &&
                data?.paymentStatus?.toLowerCase() !== "unpaid" && (
                  <Typography sx={priceBreakdownStyle.serviceCharge}>
                    Service Charge According{" "}
                    <Link
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                      }}
                      to="/terms-and-conditions"
                      target="_blank"
                    >
                      Terms & Conditions
                    </Link>
                  </Typography>
                )}
            </Box>

            <ArrowDropDownIcon
              sx={{
                transform: openPriceBox ? "rotate(180deg)" : "rotate(0deg)",
                ...priceBreakdownStyle.dropDown,
              }}
            />
          </Box>
        </Box>
        <Collapse in={openPriceBox} timeout="auto" unmountOnExit>
          <Typography sx={priceBreakdownStyle.ribbon}>
            Price Breakdown
          </Typography>
          {priceBreakdown?.map((item, index) => {
            return (
              <PassengerPriceBreakdown
                key={index}
                item={item}
                isNotEquals={isNotEquals}
              />
            );
          })}

          <Box sx={textContainer}>
            <Typography sx={textStyle}>Total Base</Typography>
            <Typography sx={textStyle}>
              <Typography sx={textStyle}>
                {isNotEquals
                  ? "Will be decided"
                  : totalBaseFare?.toLocaleString("en-IN")}{" "}
                {isNotEquals ? "" : "BDT"}
              </Typography>
            </Typography>
          </Box>
          <Box sx={textContainer}>
            <Typography sx={textStyle}>Total Tax</Typography>
            <Typography sx={textStyle}>
              {isNotEquals
                ? "Will be decided"
                : totalTax?.toLocaleString("en-IN")}{" "}
              {isNotEquals ? "" : "BDT"}
            </Typography>
          </Box>
          <Box sx={textContainer}>
            <Typography sx={textStyle}>Customer Invoice Total</Typography>
            <Typography sx={textStyle}>
              {isNotEquals
                ? "Will be decided"
                : totalGrossPrice?.toLocaleString("en-IN")}{" "}
              {isNotEquals ? "" : "BDT"}
            </Typography>
          </Box>
          <Box sx={textContainer}>
            <Typography sx={{ ...textStyle, color: "red" }}>
              {data?.commission < 0 ? "Additional Amount" : "Discount"}{" "}
            </Typography>
            <Typography sx={{ ...textStyle, color: "red" }}>
              {isNotEquals
                ? "Will be decided"
                : data?.commission?.toLocaleString("en-IN")}{" "}
              {isNotEquals ? "" : "BDT"}
            </Typography>
          </Box>

          <Box sx={textContainer} mt={1.5}>
            <Typography noWrap sx={{ ...textStyle, width: "70%" }}>
              After {data?.commission < 0 ? "Additional Amount" : "Discount"}{" "}
              Cost
            </Typography>
            <Typography noWrap sx={textStyle}>
              {isNotEquals
                ? "Will be decided"
                : (data?.clientPrice - data?.commission)?.toLocaleString(
                    "en-IN"
                  ) + " BDT"}
            </Typography>
          </Box>

          <Box sx={textContainer}>
            <Typography sx={textStyle}>AIT</Typography>
            <Typography sx={textStyle}>
              {isNotEquals
                ? "Will be decided"
                : Math.round(totalAit)?.toLocaleString("en-IN") + " BDT"}
            </Typography>
          </Box>

          <Box sx={textContainer}>
            <Typography sx={textStyle}>Extra Additional Amount</Typography>
            <Typography sx={textStyle}>
              {isNotEquals
                ? "Will be decided"
                : Math.round(totalAdditionalAmount)?.toLocaleString("en-IN")}
              {isNotEquals ? "" : " BDT"}
            </Typography>
          </Box>

          <Box sx={{ ...textContainer, mb: 2 }}>
            <Typography sx={textStyle}>Total Agent Cost</Typography>
            <Typography sx={textStyle}>
              {isNotEquals
                ? "Will be decided"
                : Math.round(data?.agentPrice)?.toLocaleString("en-IN")}
              {isNotEquals ? "" : " BDT"}
            </Typography>
          </Box>

          <Box sx={{ ...textContainer }}>
            <Typography sx={textStyle}>Total Paid Amount</Typography>
            <Typography sx={textStyle}>
              {Math.round(
                data?.paymentStatus === "paid"
                  ? data?.agentPrice
                  : partialData?.totalPayedAmount || 0
              )?.toLocaleString("en-IN")}{" "}
              BDT
            </Typography>
          </Box>

          <Box sx={{ ...textContainer, mb: 2 }}>
            <Typography sx={textStyle}>Total Due Amount</Typography>
            <Typography sx={textStyle}>
              {Math.round(
                data?.paymentStatus === "paid" ? 0 : partialData?.dueAmount || 0
              )?.toLocaleString("en-IN")}{" "}
              BDT
            </Typography>
          </Box>

          <Box sx={textContainer}>
            <Typography sx={{ ...textStyle, color: "var(--primary-color)" }}>
              Total Service Charge
            </Typography>
            <Typography sx={{ ...textStyle, color: "var(--primary-color)" }}>
              {isNotEquals
                ? "Will be decided"
                : serviceCharge?.toLocaleString("en-IN") + " BDT"}
            </Typography>
          </Box>

          {partialData && partialData?.totalCharge && (
            <Box sx={{ ...textContainer }}>
              <Typography sx={{ ...textStyle, color: "var(--primary-color)" }}>
                Partial Payment Charge
              </Typography>
              <Typography sx={{ ...textStyle, color: "var(--primary-color)" }}>
                {partialData?.totalCharge?.toLocaleString("en-IN")} BDT
              </Typography>
            </Box>
          )}

          <Box sx={textContainer}>
            <Typography sx={textStyle}>
              {data?.status === "void" ? "Void Amount" : "Voidable Amount"}
            </Typography>
            <Typography sx={textStyle}>
              {isNotEquals
                ? "Will be decided"
                : data?.paymentStatus === "paid"
                  ? Number(
                      (
                        (data.agentPrice ?? 0) -
                        (serviceCharge ?? 0) -
                        (partialData?.totalCharge || 0)
                      )?.toFixed(2)
                    )?.toLocaleString("en-IN") + " BDT"
                  : (
                      (partialData?.totalPayedAmount ?? 0) -
                      (partialData?.totalCharge ?? 0) -
                      (serviceCharge ?? 0)
                    )?.toLocaleString("en-IN") + " BDT"}
            </Typography>
          </Box>

          <Box sx={{ p: "15px 12px" }}>
            <Box
              onClick={() => setOpen(true)}
              sx={{
                color: "var(--primary-color)",
                ...justifyBetween,
                alignItems: "center",
                borderBottom: "1px solid var(--primary-color)",
                cursor: "pointer",
              }}
            >
              <Typography sx={{ fontSize: "0.813rem", fontWeight: "500" }}>
                Add Markup with Base Fare
              </Typography>
              <AddIcon />
            </Box>
          </Box>
          <Box sx={{ ...textContainer, my: "4px" }}>
            <Typography sx={textStyle}>Mark Up</Typography>
            <Typography sx={textStyle}>0.0</Typography>
          </Box>
          <Box sx={textContainer}>
            <Typography sx={textStyle}>After Markup Agent total</Typography>
            <Typography sx={textStyle}>0.0</Typography>
          </Box>
        </Collapse>
      </Box>

      <Dialog
        TransitionComponent={Zoom}
        open={open}
        onClose={() => setOpen(!open)}
      >
        <Box sx={{ bgcolor: "background.paper", p: 2, position: "relative" }}>
          <Box sx={{ bgcolor: "#F9F9F9", p: 1.5 }}>
            <Button style={priceBreakdownStyle.addMarkupBtn}>Add markup</Button>
          </Box>

          <Box
            onClick={() => setOpen(false)}
            sx={{
              cursor: "pointer",
              position: "absolute",
              top: "20px",
              right: "20px",
            }}
          >
            <CloseIcon />
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

const textStyle = { color: "gray", fontSize: "0.813rem", fontWeight: "500" };

const justifyBetween = { display: "flex", justifyContent: "space-between" };

const textContainer = { ...justifyBetween, pt: "4px", px: "12px" };

const priceBreakdownStyle = {
  priceBox: {
    py: "10px",
    px: "12px",
    ...justifyBetween,
    alignItems: "center",
    height: "100%",
    cursor: "pointer",
  },

  label: {
    color: "#3C4258",
    fontSize: "0.85rem",
    fontWeight: "500",
  },

  amount: {
    color: "#3C4258",
    fontSize: "1.25rem",
    fontWeight: "500",
    pt: "2px",
    display: "flex",
    alignItems: "center",
  },

  serviceCharge: {
    color: "#3C4258",
    fontSize: "0.75rem",
    fontWeight: "500",
    pt: "2px",
  },

  dropDown: {
    bgcolor: "#F2F8FF",
    borderRadius: "50%",
    transition: "transform 0.2s ease-in-out",
  },

  ribbon: {
    bgcolor: "var(--primary-color)",
    color: "#fff",
    fontSize: "0.85rem",
    p: "3px 12px",
    mb: "10px",
    fontWeight: 500,
  },

  addMarkupBtn: {
    backgroundColor: "var(--primary-color)",
    color: "var(--white)",
    width: "100%",
    fontSize: "12px",
    marginTop: "20px",
    paddingTop: "7px",
    paddingBottom: "7px",
    textTransform: "capitalize",
  },
};

export default VoidPriceBreakdown;
