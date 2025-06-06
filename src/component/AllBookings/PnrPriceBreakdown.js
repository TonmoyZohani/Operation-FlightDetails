import React, { useState } from "react";
import { PassengerPriceBreakdown } from "../../shared/common/functions";
import { Box, Collapse, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const PnrPriceBreakdown = ({ pnrData }) => {
  const [openPriceBox, setOpenPriceBox] = useState(false);

  const handleToggle = () => {
    setOpenPriceBox((prev) => !prev);
  };

  return (
    <Box sx={{ bgcolor: "#fff" }}>
      <Box
        sx={{
          py: "12px",
          px: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          cursor: "pointer",
          bgcolor: "#fff",
        }}
        onClick={() => {
          handleToggle();
        }}
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
              Agent Payable
            </Typography>

            <Typography
              sx={{
                color: "#3C4258",
                fontSize: "1.25rem",
                fontWeight: "500",
                pt: "2px",
              }}
            >
              {pnrData?.clientPrice?.toLocaleString("en-IN")} BDT
            </Typography>
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
      <Collapse in={openPriceBox} timeout="auto" unmountOnExit sx={{ pb: 2.5 }}>
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

        <Box sx={{ bgcolor: "#fff", py: "10px", borderRadius: "3px" }}>
          {pnrData?.priceBreakdown?.map((item, index) => (
            <PassengerPriceBreakdown key={index} item={item} />
          ))}
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
            Total Base
          </Typography>
          <Typography
            sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              {pnrData?.priceBreakdown?.length
                ? pnrData.priceBreakdown
                    .reduce(
                      (acc, passenger) => acc + passenger.totalBaseFare,
                      0
                    )
                    ?.toLocaleString("en-IN")
                : "0"}{" "}
              BDT
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
            {pnrData?.priceBreakdown?.length
              ? pnrData.priceBreakdown
                  .reduce((acc, passenger) => acc + passenger.totalTaxAmount, 0)
                  ?.toLocaleString("en-IN")
              : "0"}{" "}
            BDT
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
            {pnrData?.clientPrice?.toLocaleString("en-IN")} BDT
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
            {pnrData?.commission?.toLocaleString("en-IN")} BDT
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: "4px",
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
            {pnrData?.clientPrice?.toLocaleString("en-IN")} BDT BDT
          </Typography>
        </Box>
        <Box sx={{ p: "15px 12px" }}>
          <Box
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
  );
};

export default PnrPriceBreakdown;
