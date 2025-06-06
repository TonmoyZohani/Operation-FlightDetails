/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import React from "react";
import NotFoundFile from "../../assets/lottie/notfound.json";
import Lottie from "lottie-react";
import useWindowSize from "../../shared/common/useWindowSize";

const NotFound = ({
  message = "There is No Opportunity Open for you Right now",
  label = "No Data Found",
  fontSize = "2rem",
}) => {
  const { isMobile } = useWindowSize();
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
        style={{ height: isMobile ? 75 : 120 }}
      />
      <Typography
        sx={{
          fontSize: isMobile ? "1.5rem" : fontSize,
          fontWeight: 500,
          lineHeight: "2.5rem",
          my: 2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: isMobile ? "12px" : "16px",
          fontWeight: 400,
          lineHeight: "1rem",
          mb: 4,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default NotFound;
