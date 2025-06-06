import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import Lottie from "lottie-react";
import React from "react";
import passportScanErrorFile from "../../assets/lottie/passportScanErrorFile.json";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import {
  setPassengerPassportCopy,
  setPreviewNull,
} from "../AirBooking/airbookingSlice";

const PassportScanError = ({
  handleClearError,
  handleClose,
  isNotEquals,
  setError,
  setPassportFileBlob,
}) => {
  const dispatch = useDispatch();
  return (
    <Box mt={3}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              border: "1px solid var(--border)",
              py: 3,
              borderRadius: "5px",
            }}
          >
            <Lottie
              animationData={passportScanErrorFile}
              loop={true}
              autoplay={true}
              style={{ height: 250 }}
            />
            <Typography
              sx={{
                textAlign: "center",
                px: 1,
                mx: "auto",
                fontSize: "13px",
              }}
            >
              {isNotEquals
                ? "Passenger type mismatch detected. The uploaded passport details do not match the selected passenger type. Please ensure the correct passenger type is selected and upload the appropriate passport copy."
                : "  We couldn't scan the passport details. Please ensure the passport copy & MRZ (Machine Readable Zone) is clear, properly aligned, and free from glare or shadows. Try scanning again or manually enter the details."}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                width: "100%",
                height: "45px",
                display: "flex",
                justifyContent: "start",
                bgcolor: "var(--secondary-color)",
                ":hover": {
                  bgcolor: "var(--secondary-color)",
                },
              }}
              onClick={handleClearError}
            >
              <Typography sx={{ textAlign: "left", fontSize: "15px" }}>
                RETRY
              </Typography>
            </Button>
            <IconButton
              aria-label="delete"
              onClick={() => {
                setError(false);
                handleClose();
                dispatch(setPreviewNull());
                setPassportFileBlob(null);
              }}
              sx={{
                bgcolor: "var(--black)",
                color: "var(--white)",
                height: "45px",
                width: "45px",
                borderRadius: "3px",
                ":hover": {
                  bgcolor: "var(--black)",
                  color: "var(--white)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PassportScanError;
