import React from "react";
import { Box, Button } from "@mui/material";
import { IoIosPaperPlane } from "react-icons/io";

const ActionButton = ({ handleClick, buttonText, buttonDisabled }) => {

  return (
    <Box
      sx={{
        height: "73px",
        width: "100%",
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        my: "0px",
      }}
    >
      <Button
        variant="contained"
        className="shine-effect"
        onClick={handleClick}
        disabled={buttonDisabled}
        sx={{
          height: "100%",
          width: {
            md: "100%",
            sm: "100%",
            xs: "100%",
          },
          mt: { md: "0px", sm: "10px", xs: "10px" },
          textTransform: "capitalize",
          display: "flex",
          flexDirection: {
            md: "column",
            sm: "row",
            xs: "row",
          },
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
        }}
        style={{
          background: buttonDisabled ? "#f0627e" : "var(--primary-color)",
          color: "white",
        }}
      >
        <IoIosPaperPlane style={{ fontSize: "20px" }} />
        <Box>{buttonText}</Box>
      </Button>
    </Box>
  );
};

export default ActionButton;
