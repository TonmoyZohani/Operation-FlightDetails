import React from "react";
import { Box, Button, Typography } from "@mui/material";
import useWindowSize from "../../../shared/common/useWindowSize";

export const CustomOperationButton = ({ proceedType, setProceedType }) => {
  const { isMobile } = useWindowSize();
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "3px",
        p: {
          xs: "20px 10px",
          lg: "20px 10px",
        },
        mb: 2,
        display: {
          xs: "block",
          lg: "none",
        },
      }}
    >
      <Typography
        sx={{ color: "#3C4258", fontSize: "0.85rem", fontWeight: 500, pb: 2 }}
      >
        Choose Your Next Operation
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Button
          variant={proceedType === "approve" ? "contained" : "outlined"}
          sx={{
            bgcolor:
              proceedType === "approve"
                ? "var(--secondary-color)"
                : "transparent",
            color:
              proceedType === "approve" ? "#FFFFFF" : "var(--secondary-color)",
            ":hover": {
              bgcolor:
                proceedType === "approve"
                  ? "var(--secondary-color)"
                  : "transparent",
              color:
                proceedType === "approve"
                  ? "#FFFFFF"
                  : "var(--secondary-color)",
            },
            border: "1px solid var(--secondary-color)",
            fontWeight: 500,
            width: "100%",
          }}
          onClick={() => setProceedType("approve")}
        >
          <Typography>Approve</Typography>
        </Button>

        <Button
          variant={proceedType === "reject" ? "contained" : "outlined"}
          sx={{
            bgcolor:
              proceedType === "reject"
                ? "var(--secondary-color)"
                : "transparent",
            color:
              proceedType === "reject" ? "#FFFFFF" : "var(--secondary-color)",
            ":hover": {
              bgcolor:
                proceedType === "reject"
                  ? "var(--secondary-color)"
                  : "transparent",
              color:
                proceedType === "reject" ? "#FFFFFF" : "var(--secondary-color)",
            },
            border: "1px solid var(--secondary-color)",
            fontWeight: 500,
            width: "100%",
          }}
          onClick={() => setProceedType("reject")}
        >
          <Typography>Reject</Typography>
        </Button>
      </Box>
    </Box>
  );
};
