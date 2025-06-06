import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Grid, Modal, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useToast from "../../hook/useToast";
import FileUpload from "../AirBooking/FileUpload";
import {
  setPassengerPassportCopy,
  setPassengerVisaCopy,
} from "../AirBooking/airbookingSlice";
import CustomToast from "../Alert/CustomToast";

const PassengerDocsModal = ({
  open,
  passengerDetails,
  handleClose,
  passengers,
  modalTitle = "Upload",
  instructions = "Select and upload the file of your choice",
  index,
  setIndex,
  remainingPassengers,
  setRemainingPassengers,
  passenger,
  setPassenger,
  passportImageCmsShow,
  visaImageCmsShow,
}) => {
  const [clearFileTrigger, setClearFileTrigger] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const dispatch = useDispatch();

  const handleSaveAndNext = () => {
    const passenger = passengers?.[index];

    const checkPassport = passportImageCmsShow
      ? passenger?.passportImage
      : true;
    const checkVisa = visaImageCmsShow ? passenger?.visaImage : true;

    if (checkPassport && checkVisa) {
      const nextIndex = index + 1;

      if (nextIndex < passengers.length) {
        setIndex((prev) => prev + 1);
        setPassenger(passengerDetails[nextIndex]);
        setClearFileTrigger(true);
        setRemainingPassengers(remainingPassengers);
      } else {
        handleClose();
      }
    } else {
      showToast(
        "warning",
        `Please upload ${
          !checkPassport && !checkVisa
            ? "both Passport and Visa"
            : !checkPassport
              ? "Passport"
              : "Visa"
        } before moving to the next process!`
      );
    }
  };

  const handlePassportUploadClick = (file, passengerType, passengerCount) => {
    const indexPax = passengerCount - 1;

    dispatch(
      setPassengerPassportCopy({
        passengerType: passengerType.toLowerCase(),
        index: indexPax,
        passportImage: file,
      })
    );
  };

  const handleVisaUploadClick = (file, passengerType, passengerCount) => {
    const indexPax = passengerCount - 1;
    dispatch(
      setPassengerVisaCopy({
        passengerType: passengerType.toLowerCase(),
        index: indexPax,
        visaImage: file,
      })
    );
  };

  useEffect(() => {
    if (clearFileTrigger) {
      setClearFileTrigger(false);
    }
  });

  return (
    <>
      <Modal open={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%",
              lg: passportImageCmsShow && visaImageCmsShow ? 800 : 500,
            },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: {
              xs: 2,
              sm: 3,
              md: 4,
              lg: 4,
            },
            borderRadius: "8px",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <CloudUploadIcon />
            <Typography
              sx={{
                fontSize: {
                  xs: "0.85rem",
                  sm: "1.1rem",
                  lg: "1.3rem",
                },
              }}
            >
              Passport & Visa Copy {modalTitle} for{" "}
              <span
                style={{
                  textTransform: "capitalize",
                  color: "var(--primary-color)",
                }}
              >
                {passengers?.[index]?.firstName} {passengers?.[index]?.lastName}
              </span>{" "}
              {remainingPassengers?.length > 1 && (
                <span> & {remainingPassengers?.length - 1} More</span>
              )}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 1, mb: 2 }}
          >
            {instructions}
          </Typography>

          <Grid container spacing={2}>
            {passportImageCmsShow && (
              <Grid
                item
                xs={12}
                lg={passportImageCmsShow && visaImageCmsShow ? 6 : 12}
              >
                <FileUpload
                  id={`passportCopy-${index}`}
                  label="Passport Copy"
                  onFileChange={(file) => {
                    handlePassportUploadClick(
                      file,
                      passenger?.type,
                      passenger?.count,
                      passenger?.paxNo
                    );
                  }}
                  clearTrigger={clearFileTrigger}
                  previewImg={passengers?.[index]?.passportImage}
                  documentType={"passport"}
                  passengerType={passenger?.type}
                  passengerCount={passenger?.count}
                />
              </Grid>
            )}

            {visaImageCmsShow && (
              <Grid
                item
                xs={12}
                lg={passportImageCmsShow && visaImageCmsShow ? 6 : 12}
              >
                <FileUpload
                  id={`visaCopy-${index}`}
                  label="Visa Copy"
                  onFileChange={(file) =>
                    handleVisaUploadClick(
                      file,
                      passenger?.type,
                      passenger?.count,
                      passenger?.paxNo
                    )
                  }
                  clearTrigger={clearFileTrigger}
                  previewImg={passengers?.[index]?.visaImage}
                  documentType={"visa"}
                  passengerType={passenger?.type}
                  passengerCount={passenger?.count}
                />
              </Grid>
            )}
          </Grid>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
              gap: "15px",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderColor: "var(--primary-color)",
                color: "var(--primary-color)",
              }}
            >
              Close
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                setIndex((prev) => prev - 1);
                setPassenger(passengerDetails[index - 1]);
                setClearFileTrigger(true);
              }}
              sx={{
                borderColor: "var(--primary-color)",
                color: "var(--primary-color)",
              }}
              disabled={index === 0}
            >
              Previous
            </Button>

            <Button
              onClick={handleSaveAndNext}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                bgcolor: "var(--primary-color)",
                ":hover": {
                  bgcolor: "var(--primary-color)",
                },
              }}
              variant="contained"
            >
              <Box>Save & Next</Box>
            </Button>
          </Box>
        </Box>
      </Modal>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />
    </>
  );
};

export default PassengerDocsModal;
