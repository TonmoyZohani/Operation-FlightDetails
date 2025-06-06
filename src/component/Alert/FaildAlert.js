import { Box, Button, Dialog, Typography } from "@mui/material";
import Lottie from "lottie-react";
import React from "react";
import FaildFile from "../../assets/lottie/faild.json";

const FaildAlert = ({
  label = "Operation Failed",
  message = "Your request could not be completed at this time. Please try again later for a better experience!",
  open,
  setOpen,
  onConfirm,
}) => {
  const handleClose = () => {
    setOpen(false);
    onConfirm(false);
  };

  const handleProceed = () => {
    onConfirm(true);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ p: 3, overflow: "hidden" }}>
        <Box
          sx={{
            width: "500px",
            mx: "auto",
            borderRadius: "50%",
          }}
        >
          <Lottie
            animationData={FaildFile}
            loop={true}
            autoplay={true}
            style={{ height: 100 }}
          />
        </Box>
        <Typography
          mt={2}
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
            Close
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "var(--primary-color)",
              ":hover": {
                bgcolor: "var(--primary-color)",
              },
            }}
            onClick={handleProceed}
          >
            Retry
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default FaildAlert;
