import { Box, Button, Collapse, Dialog, Typography, Zoom } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { RefundQuotationPassengerPriceBreakdown } from "../../../shared/common/functions";

const RefundQuotationPriceBreakdown = ({
  data,
  priceBreakdown,
  label,
  refund = false,
}) => {
  const [open, setOpen] = useState(false);
  const [openPriceBox, setOpenPriceBox] = useState(false);

  const totalBaseFare = priceBreakdown?.refundPassengers?.reduce(
    (acc, passenger) => acc + passenger?.baseFare * passenger?.paxCount,
    0
  );

  const totalTax = priceBreakdown?.refundPassengers?.reduce(
    (acc, passenger) => acc + passenger?.tax * passenger?.paxCount,
    0
  );

  const totalGrossFare = totalBaseFare + totalTax;

  const ait = totalGrossFare * 0.003;
  const totalServiceCharge = priceBreakdown?.refundPassengers?.reduce(
    (total, item) => {
      return total + item?.serviceCharge * item?.paxCount;
    },
    0
  );

  const totalDiscount =
    (totalBaseFare * parseFloat(priceBreakdown?.commission)) / 100;

  const afterDiscountCost = totalGrossFare - totalDiscount || 0;

  const totalAgentCost = afterDiscountCost - ait;

  const totalRefundCharge = totalServiceCharge + priceBreakdown?.airlineCharge;

  const refundAmount = totalAgentCost - totalRefundCharge;

  const handleToggle = () => {
    setOpenPriceBox((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column-reverse",
          md: "column",
        },
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
        <Box
          sx={{
            py: "10px",
            px: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            cursor: "pointer",
          }}
          onClick={handleToggle}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#3C4258",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                {label}
              </Typography>
              <Typography
                sx={{
                  color: "#3C4258",
                  fontSize: "1.25rem",
                  fontWeight: "500",
                  pt: "2px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {Math.round(refundAmount)?.toLocaleString("en-IN")} BDT{" "}
                {data?.paymentStatus?.toLowerCase() !== "partially paid" &&
                  data?.paymentStatus?.toLowerCase() !== "unpaid" && (
                    <RemoveIcon sx={{ color: "var(--primary-color)" }} />
                  )}
              </Typography>
              {data?.paymentStatus?.toLowerCase() !== "partially paid" &&
                data?.paymentStatus?.toLowerCase() !== "unpaid" && (
                  <Typography
                    sx={{
                      color: "#3C4258",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      pt: "2px",
                    }}
                  >
                    Service Charge According{" "}
                    <Link
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                      }}
                      to="#"
                    >
                      Terms & Conditions
                    </Link>
                  </Typography>
                )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <ArrowDropDownIcon
                sx={{
                  transform: openPriceBox ? "rotate(180deg)" : "rotate(0deg)",
                  bgcolor: "#F2F8FF",
                  borderRadius: "50%",
                  transition: "transform 0.2s ease-in-out",
                }}
              />
            </Box>
          </Box>
        </Box>
        <Collapse in={openPriceBox} timeout="auto" unmountOnExit>
          <Typography
            sx={{
              bgcolor: "var(--primary-color)",
              color: "#fff",
              fontSize: "0.85rem",
              p: "3px 12px",
              mb: "10px",
              fontWeight: 500,
            }}
          >
            Price Breakdown
          </Typography>
          {priceBreakdown?.refundPassengers?.map((item, index) => {
            return (
              <RefundQuotationPassengerPriceBreakdown key={index} item={item} />
            );
          })}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
              mb: "5px",
            }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              Total Base
            </Typography>
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              <Typography
                sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
              >
                {totalBaseFare?.toLocaleString("en-IN")} BDT
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
              mb: "5px",
            }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              Total Tax
            </Typography>
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              {totalTax?.toLocaleString("en-IN")} BDT
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
              mb: "5px",
            }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              Customer Invoice Total
            </Typography>
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              {totalGrossFare?.toLocaleString("en-IN")} BDT
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
            }}
          >
            <Typography
              sx={{ color: "red", fontSize: "0.813rem", fontWeight: "500" }}
            >
              {totalDiscount < 0 ? "Additional Amount" : "Discount"}{" "}
            </Typography>
            <Typography
              sx={{ color: "red", fontSize: "0.813rem", fontWeight: "500" }}
            >
              {totalDiscount?.toLocaleString("en-IN")} BDT
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
            }}
          >
            <Typography
              sx={{
                color: "gray",
                fontSize: "0.813rem",
                fontWeight: "500",
              }}
            >
              After {totalDiscount < 0 ? "Additional Amount" : "Discount"} Cost
            </Typography>
            <Typography
              sx={{
                color: "gray",
                fontSize: "0.813rem",
                fontWeight: "500",
              }}
            >
              {afterDiscountCost?.toLocaleString("en-IN")} BDT
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
            }}
          >
            <Typography
              sx={{
                color: "gray",
                fontSize: "0.813rem",
                fontWeight: "500",
              }}
            >
              Ait
            </Typography>
            <Typography
              sx={{
                color: "gray",
                fontSize: "0.813rem",
                fontWeight: "500",
              }}
            >
              {Math.round(ait)?.toLocaleString("en-IN")} BDT
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
            }}
          >
            <Typography
              sx={{
                color: "gray",
                fontSize: "0.813rem",
                fontWeight: "500",
              }}
            >
              Total Agent Cost
            </Typography>
            <Typography
              sx={{
                color: "gray",
                fontSize: "0.813rem",
                fontWeight: "500",
              }}
            >
              {Math.round(totalAgentCost)?.toLocaleString("en-IN")} BDT
            </Typography>
          </Box>

          {refund && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: "4px",
                px: "12px",
              }}
            >
              <Typography
                sx={{
                  color: "gray",
                  fontSize: "0.813rem",
                  fontWeight: "500",
                }}
              >
                Refund Charge
              </Typography>
              <Typography
                sx={{
                  color: "gray",
                  fontSize: "0.813rem",
                  fontWeight: "500",
                }}
              >
                {totalRefundCharge?.toLocaleString("en-IN")} BDT
              </Typography>
            </Box>
          )}
          {refund && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: "4px",
                px: "12px",
              }}
            >
              <Typography
                sx={{
                  color: "gray",
                  fontSize: "0.813rem",
                  fontWeight: "500",
                }}
              >
                Refund Amount
              </Typography>
              <Typography
                sx={{
                  color: "gray",
                  fontSize: "0.813rem",
                  fontWeight: "500",
                }}
              >
                {Math.round(refundAmount)?.toLocaleString("en-IN")} BDT
              </Typography>
            </Box>
          )}

          <Box sx={{ p: "15px 12px" }}>
            <Box
              onClick={() => setOpen(true)}
              sx={{
                color: "var(--primary-color)",
                display: "flex",
                justifyContent: "space-between",
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "5px",
              px: "12px",
              my: "4px",
            }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              Mark Up
            </Typography>
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              0.0
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
              px: "12px",
            }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              After Markup Agent total
            </Typography>
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              0.0
            </Typography>
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
            <Button
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--white)",
                width: "100%",
                fontSize: "12px",
                marginTop: "20px",
                paddingTop: "7px",
                paddingBottom: "7px",
                textTransform: "capitalize",
              }}
            >
              Add markup
            </Button>
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

export default RefundQuotationPriceBreakdown;
