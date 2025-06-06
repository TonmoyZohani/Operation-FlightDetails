import CloseIcon from "@mui/icons-material/Close";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";

const BookingLoader = ({
  brandName,
  errorMessage,
  setErrorMessage,
  setAirPriceLoading,
}) => {
  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "450px",
          },
          px: 2,
          py: {
            xs: 5,
            sm: 7,
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000000000",
        }}
      >
        {errorMessage ? (
          <HighlightOffIcon sx={{ color: "var(--primary-color)" }} />
        ) : (
          <CircularProgress sx={{ color: "var(--primary-color)" }} />
        )}

        <Typography
          sx={{
            mt: 2,
            fontSize: {
              xs: "1rem",
              sm: "1.15rem",
            },
            textAlign: "center",
            mx: "auto",
            fontWeight: 600,
            mb: 1,
          }}
        >
          {!errorMessage ? (
            <>
              Checking Seat Availability for your Selected{" "}
              <span style={{ color: "var(--primary-color)", fontWeight: 500 }}>
                {brandName}
              </span>{" "}
            </>
          ) : (
            <>{errorMessage}</>
          )}
        </Typography>
        {!errorMessage && <Typography>Please wait a moment.</Typography>}
      </Box>
      {errorMessage && (
        <IconButton
          onClick={() => {
            setErrorMessage("");
            setAirPriceLoading("");
          }}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "var(--primary-color)",
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </Dialog>
  );
};

export default BookingLoader;
