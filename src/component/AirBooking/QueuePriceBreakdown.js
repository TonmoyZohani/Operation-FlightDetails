import { Box, Button, Collapse, Dialog, Typography, Zoom } from "@mui/material";
import React, { useState } from "react";
import { PassengerPriceBreakdown } from "../../shared/common/functions";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const QueuePriceBreakdown = ({
  data,
  type,
  priceBreakdown,
  commission,
  partialData,
  paydue,
  paydata,
  label,
  refund = false,
  refundAmount = 0,
  refundCharge = 0,
  isNotEquals = false,
}) => {
  const [open, setOpen] = useState(false);
  const [openPriceBox, setOpenPriceBox] = useState(false);
  const transformedData = priceBreakdown.reduce((acc, passenger) => {
    const { type, baseFare, tax, age } = passenger;

    if (type === "ADT") {
      let adt = acc.find((item) => item.type === "ADT");
      if (adt) {
        adt.totalBaseFare += baseFare;
        adt.totalTaxAmount += tax;
        adt.paxCount += 1;
        adt.paxType = "ADT";
      } else {
        acc.push({
          type: "ADT",
          totalBaseFare: baseFare,
          totalTaxAmount: tax,
          paxCount: 1,
          paxType: "ADT",
        });
      }
    } else if (type === "CNN") {
      // Group CNN based on age: 2–4 and 5–11
      if (age >= 2 && age <= 4) {
        let cnn2to4 = acc.find((item) => item.type === "CNN_2_4");
        if (cnn2to4) {
          cnn2to4.totalBaseFare += baseFare;
          cnn2to4.totalTaxAmount += tax;
          cnn2to4.paxCount += 1;
          cnn2to4.paxType = "CNN";
          cnn2to4.age = age;
        } else {
          acc.push({
            type: "CNN_2_4",
            totalBaseFare: baseFare,
            totalTaxAmount: tax,
            paxCount: 1,
            paxType: "CNN",
            age,
          });
        }
      } else if (age >= 5 && age <= 11) {
        let cnn5to11 = acc.find((item) => item.type === "CNN_5_11");
        if (cnn5to11) {
          cnn5to11.totalBaseFare += baseFare;
          cnn5to11.totalTaxAmount += tax;
          cnn5to11.paxCount += 1;
          cnn5to11.paxType = "CNN";
          cnn5to11.age = age;
        } else {
          acc.push({
            type: "CNN_5_11",
            totalBaseFare: baseFare,
            totalTaxAmount: tax,
            paxCount: 1,
            paxType: "CNN",
            age,
          });
        }
      }
    } else if (type === "INF") {
      let inf = acc.find((item) => item.type === "INF");
      if (inf) {
        inf.totalBaseFare += baseFare;
        inf.totalTaxAmount += tax;
        inf.paxCount += 1;
        inf.paxType = "INF";
      } else {
        acc.push({
          type: "INF",
          totalBaseFare: baseFare,
          totalTaxAmount: tax,
          paxCount: 1,
          paxType: "INF",
        });
      }
    }

    return acc;
  }, []);

  const totalBaseFare = priceBreakdown.reduce(
    (acc, passenger) => acc + passenger.baseFare,
    0
  );

  const totalTax = priceBreakdown.reduce(
    (acc, passenger) => acc + passenger.tax,
    0
  );

  const totalAmount = totalBaseFare + totalTax;

  const agentTotalAmount =
    parseFloat(totalAmount) - parseFloat(commission) || 0;

  const dueAmount = agentTotalAmount - partialData?.payedAmount || 0;

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
                  fontSize: isNotEquals ? "17px" : "1.25rem",
                  fontWeight: "500",
                  pt: "2px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isNotEquals
                  ? "Will be decided"
                  : refund
                    ? refundAmount?.toLocaleString("en-IN")
                    : paydue
                      ? paydata?.partialPayment?.dueAmount?.toLocaleString(
                          "en-IN"
                        )
                      : partialData
                        ? partialData?.payedAmount?.toLocaleString("en-IN")
                        : data?.agentPrice?.toLocaleString("en-IN")}{" "}
                {isNotEquals ? "" : " BDT"}
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
          {transformedData?.map((item, index) => {
            return (
              <PassengerPriceBreakdown
                key={index}
                item={item}
                isNotEquals={isNotEquals}
              />
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
                {isNotEquals
                  ? "Will be decided"
                  : totalBaseFare?.toLocaleString("en-IN") + " BDT"}
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
              {isNotEquals
                ? "Will be decided"
                : totalTax?.toLocaleString("en-IN") + " BDT"}
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
              {isNotEquals
                ? "Will be decided"
                : totalAmount?.toLocaleString("en-IN") + " BDT"}
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
              Discount
            </Typography>
            <Typography
              sx={{ color: "red", fontSize: "0.813rem", fontWeight: "500" }}
            >
              {isNotEquals
                ? "Will be decided"
                : commission?.toLocaleString("en-IN") + " BDT"}
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
              Agent Total
            </Typography>
            <Typography
              sx={{
                color: "gray",
                fontSize: "0.813rem",
                fontWeight: "500",
              }}
            >
              {isNotEquals
                ? "Will be decided"
                : type === "before"
                  ? agentTotalAmount?.toLocaleString("en-IN") + " BDT"
                  : data?.agentPrice?.toLocaleString("en-IN") + " BDT"}
            </Typography>
          </Box>

          {paydue && (
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
                Total Paid Amount
              </Typography>
              <Typography
                sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
              >
                {paydata?.partialPayment?.totalPayedAmount
                  ? paydata?.partialPayment?.totalPayedAmount?.toLocaleString(
                      "en-IN"
                    )
                  : (
                      paydata?.partialPayment?.totalCharge +
                      paydata?.partialPayment?.totalPayableAmount
                    )?.toLocaleString("en-IN")}{" "}
                BDT
              </Typography>
            </Box>
          )}

          {paydue && (
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
                Due Amount
              </Typography>
              <Typography
                sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
              >
                {paydata &&
                  paydata?.partialPayment?.dueAmount?.toLocaleString(
                    "en-IN"
                  )}{" "}
                BDT
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
                Refund Charge
              </Typography>
              <Typography
                sx={{
                  color: "gray",
                  fontSize: "0.813rem",
                  fontWeight: "500",
                }}
              >
                {refundCharge?.toLocaleString("en-IN")} BDT
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
                {refundAmount?.toLocaleString("en-IN")} BDT
              </Typography>
            </Box>
          )}

          {partialData && (
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
                Partial Pay Amount
              </Typography>
              <Typography
                sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
              >
                {partialData
                  ? partialData?.payedAmount?.toLocaleString("en-IN")
                  : 0}{" "}
                BDT
              </Typography>
            </Box>
          )}
          {partialData && (
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
                Due Amount
              </Typography>
              <Typography
                sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
              >
                {partialData ? dueAmount?.toLocaleString("en-IN") : 0} BDT
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
          {/* <MakeQuotation
            flightData={flightData}
            paxMarkup={paxMarkup}
            setPaxMarkup={setPaxMarkup}
            title={" Add markup"}
          /> */}

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

export default QueuePriceBreakdown;
