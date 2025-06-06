import React from "react";
import { Box, Typography } from "@mui/material";

const MobileStepBar = ({ steps, currentStep, handleStepper }) => {
  return (
    <Box
      sx={{
        width: "90%",
        mx: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        bgcolor: "#fff",
        borderRadius: "5px",
        overflowX: "auto",
      }}
    >
      {steps.map(({ number, text }) => (
        <Box
          key={number}
          onClick={() => handleStepper(number)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            cursor: "pointer",
            position: "relative",
          }}
        >
          {/* Step Circle */}
          <Box
            sx={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor:
                currentStep === number ? "var(--secondary-color)" : "#E0E0E0",
              color: currentStep === number ? "#fff" : "#757575",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {number}
          </Box>
          {/* Step Text (Only for Active Step) */}
          {currentStep === number && (
            <Typography
              sx={{
                marginTop: "4px",
                fontSize: "13px",
                color: "var(--secondary-color)",
                fontWeight: "500",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default MobileStepBar;
