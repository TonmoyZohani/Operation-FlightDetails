/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import React from "react";
import NotFoundFile from "../../assets/lottie/apierror.json";
import Lottie from "lottie-react";

const ApiNotFound = ({
  message = "There is No Opportunity Open for you Right now",
  label = "No Data Found",
  fontSize = { lg: "2rem", xs: "1.2rem" },
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        bgcolor: "#FFFFFF",
        color: "var(--secondary-color)",
        borderRadius: "4px",
      }}
    >
      <Lottie
        animationData={NotFoundFile}
        loop={true}
        autoplay={true}
        style={{ height: 180 }}
      />
      <Typography
        sx={{
          fontSize: fontSize,
          fontWeight: 500,
          lineHeight: "2.5rem",
          my: 2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontWeight: 400,
          lineHeight: "1rem",
          mb: 4,
          fontSize: {
            lg: "16px",
            xs: "12px",
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default ApiNotFound;
