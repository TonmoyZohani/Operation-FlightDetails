import { Box, Button, Typography } from "@mui/material";
import React from "react";

const DepositCard = ({ item }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: ".9rem", fontWeight: "600" }}>
          {item?.data?.depositId}
        </Typography>
        <Button
          size="small"
          variant="contained"
          sx={{
            py: 0.2,
            borderRadius: "2px",
            bgcolor: "var(--primary-color)",
            boxShadow: "none",
            fontWeight: 300,
            textTransform: "capitalize",
            fontSize: ".7rem",
            fontWeight: "600",
            ":hover": {
              bgcolor: "var(--primary-color)",
            },
          }}
        >
          {item?.type}
        </Button>
      </Box>
      <Typography sx={{ fontSize: "0.813rem", mt: 1 }}>
        <span>{item?.data?.route}</span> oneWay By{" "}
        <span>{item?.data?.carrierName}</span> on {item?.data?.departurDate} for{" "}
        {item?.data?.paxCount?.ADT +
          item?.data?.paxCount?.CNN +
          item?.data?.paxCount?.INF}{" "}
        traneller has been {item?.data?.status}{" "}
        <span style={{ color: "#1e8449" }}>{item?.data?.airlinePnr}</span>
      </Typography>
    </>
  );
};

export default DepositCard;
