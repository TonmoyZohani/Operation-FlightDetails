import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const BookingCard = ({ item, agentData, setOpen, inputValue }) => {
  const navigate = useNavigate();

  function findPropertyByValue(data, inputValue) {
    if (!data || typeof data !== "object") {
      return []; 
    }

    const result = [];

    function search(obj, parentKey = "") {
      for (const key in obj) {
        const value = obj[key];
        const fullPath = parentKey ? `${parentKey}.${key}` : key;

        if (
          typeof value === "string" &&
          value.toLowerCase() === inputValue.toLowerCase()
        ) {
          result.push({ property: fullPath, value });
        } else if (typeof value === "object" && value !== null) {
          search(value, fullPath);
        }
      }
    }

    search(data);

    return result.length > 0 ? result : [];
  }
  const result = findPropertyByValue(item?.data, inputValue) || [];

  return (
    <Box
      sx={{ cursor: "pointer" }}
      onClick={() => {
        setOpen(false);
        navigate(
          `/dashboard/booking/airtickets/${item?.data?.status}/${item?.data?.id}`,
          {
            state: { agentData: agentData?.userAccess },
          }
        );
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: ".9rem", fontWeight: "600" }}>
          {item?.data?.bookingId}
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
      </Typography>
      <Typography>
        {result?.length > 0 &&
          result?.map(({ property, value }) => (
            <Box
              key={property}
              sx={{
                display: "flex",
                alignItems: "center",
                textTransform: "capitalize",
              }}
            >
              Match By: <span style={{ marginLeft: "4px" }}>{property} </span>
              <span
                style={{ marginLeft: 2, color: "#1e8449", fontWeight: "600" }}
              >
                {value}
              </span>
            </Box>
          ))}
      </Typography>
    </Box>
  );
};

export default BookingCard;
