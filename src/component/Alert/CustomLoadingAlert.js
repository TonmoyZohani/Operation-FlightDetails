import { Box, CircularProgress, Dialog, Typography } from "@mui/material";
import React from "react";

const CustomLoadingAlert = ({ text = "", subTitle = "", open = false }) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "450px" },
          px: 2,
          py: { xs: 5, sm: 7 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "var(--primary-color)" }} />

        <Typography
          sx={{
            mt: 2,
            fontSize: { xs: "1rem", sm: "1.15rem" },
            textAlign: "center",
            mx: "auto",
            fontWeight: 600,
            mb: 1,
          }}
        >
          {text}{" "}
          <span style={{ color: "var(--primary-color)", fontWeight: 600 }}>
            {subTitle}
          </span>{" "}
        </Typography>
        <Typography>Please wait a moment.</Typography>
      </Box>
    </Dialog>
  );
};

export default CustomLoadingAlert;
