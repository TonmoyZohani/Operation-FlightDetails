import { Box, Button, Dialog, Typography } from "@mui/material";
import Lottie from "lottie-react";
import React from "react";
import NoInternetFile from "../../assets/lottie/noInternet.json";

const NoInternet = ({
  label = "No Internet",
  message = "We've detected a weak internet connection on your device. Please check your connection and try again",
  isOnline,
}) => {
  const handleClose = () => {
    const newWindow = window.open("/");

    setTimeout(() => {
      if (newWindow) {
        newWindow.close();
      }
    }, 3000);
  };

  const handleRefresh = () => {
    // Reload the current page to attempt reconnection
    window.location.reload();
  };

  return (
    <Dialog
      open={isOnline === false}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ p: 3, overflow: "hidden" }}>
        <Box
          sx={{
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Lottie
            animationData={NoInternetFile}
            loop={true}
            autoplay={true}
            style={{ height: 120 }}
          />
        </Box>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{
            fontSize: "1.25rem",
            color: "#3C4258",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
        <Typography
          id="modal-modal-description"
          sx={{
            mt: 2,
            color: "#888888",
            fontSize: "0.9rem",
            textAlign: "center",
            width: "80%",
            mx: "auto",
          }}
        >
          {message}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 5 }}>
          <Button
            sx={{
              border: "1px solid var(--primary-color)",
              color: "var(--primary-color)",
              ":hover": {
                border: "1px solid var(--primary-color)",
              },
            }}
            onClick={handleClose}
            variant="outlined"
          >
            Close Tab
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "var(--primary-color)",
              ":hover": {
                bgcolor: "var(--primary-color)",
              },
            }}
            onClick={handleRefresh}
          >
            Retry
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default NoInternet;
