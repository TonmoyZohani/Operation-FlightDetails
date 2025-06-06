import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Grid, Modal, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import FileUpload from "../../../component/AirBooking/FileUpload";
import CustomToast from "../../../component/Alert/CustomToast";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import { findEmptyImagesIndices } from "../../../utils/findEmptyImagesIndices";
import { shuffleArray } from "../../../utils/shuffleArray";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";

const FileUploadModal = ({
  open,
  handleClose,
  passengers,
  modalTitle = "Upload",
  instructions = "Select and upload the file of your choice",
  index,
  setIndex,
  journeyType,
  passengerDocuments,
  setPassengerDocuments,
  passportImageCmsShow,
  visaImageCmsShow,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [clearFileTrigger, setClearFileTrigger] = useState(false);
  const [passenger, setPassenger] = useState(passengers[index]);
  const [singlePassengerDoc, setSinglePassengerDoc] = useState(
    passengerDocuments[index]
  );
  const [formData, setFormData] = useState({
    passportImage: null,
    visaImage: null,
  });
  const [emptyDocPassengers, setEmptyDocPassengers] = useState([]);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const { formDataHeader } = useAuth();
  const queryClient = useQueryClient();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  useEffect(() => {
    const indices = findEmptyImagesIndices(passengers, journeyType);
    setEmptyDocPassengers(indices);

    const shuffled = shuffleArray(indices);
    setShuffledIndices(shuffled.length > 0 ? shuffled : []);
  }, []);

  const { mutate, status } = useMutation({
    mutationFn: (data) =>
      axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/user/payment`, data, {
        ...formDataHeader(),
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      }),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message);

        setPassengerDocuments((prevDocs) =>
          prevDocs.map((doc) =>
            doc.id === passenger?.id ? { ...doc, ...data.data.data } : doc
          )
        );

        setFormData({
          passportImage: null,
          visaImage: null,
        });

        setClearFileTrigger(Date.now());

        setEmptyDocPassengers((prev) => prev.filter((item) => item !== index));

        const remainingIndices = emptyDocPassengers.filter(
          (item) => item !== index
        );

        if (remainingIndices.length > 0) {
          setIndex(remainingIndices[0]);
        } else {
          handleClose();
          // queryClient.invalidateQueries(["singleBookingData"]);
          // setUploadProgress(0);
        }
      }
    },
    onError: (err) => {
      showToast("error", err?.message);
      setUploadProgress(0);
    },
  });

  const handleFileChange = (file, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    if (formData.passportImage) {
      data.append("passportImage", formData.passportImage);
    }
    if (formData.visaImage) {
      data.append("visaImage", formData.visaImage);
    }
    if (passengers) {
      data.append("id", passengers[index]?.id);
    }

    mutate(data);
  };

  useEffect(() => {
    setPassenger(passengers[index]);
    setSinglePassengerDoc(passengerDocuments[index]);
  }, [singlePassengerDoc, passengers, index]);

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
              lg: 800,
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
                {passenger?.firstName} {passenger?.lastName}
              </span>{" "}
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
              <Grid item xs={12} lg={6}>
                <FileUpload
                  id="passportCopy"
                  label="Passport Copy"
                  onFileChange={(file) =>
                    handleFileChange(file, "passportImage")
                  }
                  clearTrigger={clearFileTrigger}
                  previewImg={singlePassengerDoc?.passportImage}
                />
              </Grid>
            )}

            {visaImageCmsShow && (
              <Grid item xs={12} lg={6}>
                <FileUpload
                  id="visaCopy"
                  label="Visa Copy"
                  onFileChange={(file) => handleFileChange(file, "visaImage")}
                  clearTrigger={clearFileTrigger}
                  previewImg={singlePassengerDoc?.visaImage}
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
            {/* Close Button */}
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

            {/* Previous Button */}
            <Button
              variant="outlined"
              onClick={() => {
                setIndex((prev) => Math.max(prev - 1, 0));
              }}
              sx={{
                borderColor: "var(--primary-color)",
                color: "var(--primary-color)",
              }}
              disabled={index === 0}
            >
              Previous
            </Button>

            {/* Skip & Next or Upload Save & Next Button */}
            <Button
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                bgcolor:
                  uploadProgress === 100 ? "green" : "var(--primary-color)",
                ":hover": {
                  bgcolor:
                    uploadProgress === 100 ? "green" : "var(--primary-color)",
                },
              }}
              variant="contained"
              onClick={(e) => {
                if (
                  singlePassengerDoc?.passportImage &&
                  singlePassengerDoc?.visaImage &&
                  !formData?.passportImage &&
                  !formData?.visaImage
                ) {
                  setIndex((prev) => Math.min(prev + 1, passengers.length - 1));
                  return;
                }
                handleSubmit(e);
              }}
              // disabled={
              //   (index === passengers.length - 1 &&
              //     ((passportImageCmsShow &&
              //       singlePassengerDoc?.passportImage &&
              //       !formData?.passportImage) ||
              //       (visaImageCmsShow &&
              //         singlePassengerDoc?.visaImage &&
              //         !formData?.visaImage))) ||
              //   status === "pending" ||
              //   (passportImageCmsShow &&
              //     !singlePassengerDoc?.passportImage &&
              //     !formData?.passportImage) ||
              //   (visaImageCmsShow &&
              //     !singlePassengerDoc?.visaImage &&
              //     !formData?.visaImage)
              // }
            >
              <Box>
                <span>
                  {singlePassengerDoc?.passportImage &&
                  singlePassengerDoc?.visaImage &&
                  !formData?.passportImage &&
                  !formData?.visaImage
                    ? "Skip & Next"
                    : "Upload Save & Next"}
                </span>
              </Box>
            </Button>
          </Box>
        </Box>
      </Modal>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      <CustomLoadingAlert
        open={status === "pending"}
        text={"We Are Processing To Update Your Request"}
      />
    </>
  );
};

export default FileUploadModal;
