import { Box, Button, Grid, SwipeableDrawer, Typography } from "@mui/material";
import React, { useState } from "react";
import { regTitle } from "../../../../component/Register/GeneraInfo";
import { getOrdinal } from "../../../../shared/common/functions";
import SmallLoadingSpinner from "../../../../component/Loader/SmallLoadingSpinner";
import CloseIcon from "@mui/icons-material/Close";
import { depositBtn } from "../../../../shared/common/styles";
import FileUpload from "../../../../component/AirBooking/FileUpload";
import axios from "axios";
import CustomAlert from "../../../../component/Alert/CustomAlert";
import { useAuth } from "../../../../context/AuthProvider";
import useToast from "../../../../hook/useToast";
import CustomToast from "../../../../component/Alert/CustomToast";
import CustomLoadingAlert from "../../../../component/Alert/CustomLoadingAlert";
import ErrorDialog from "../../../../component/Dialog/ErrorDialog";
import useWindowSize from "../../../../shared/common/useWindowSize";

const CompanyOwnerDocsDrawer = ({
  open,
  setOpen,
  agentProfile,
  setAgentProfile,
  onClose,
  activeIndex,
  partner,
  setPartner,
  refetch,
  ownershipType,
}) => {
  const { isMobile } = useWindowSize();
  const [isLoading, setIsLoading] = useState(false);
  const { formDataHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleChangeImage = (file, name) => {
    setPartner((prevDocs) => ({
      ...prevDocs,
      [name]: file,
    }));
  };

  const handleSubmit = async () => {
    try {
      setShowErrorDialog(true);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    const formData = new FormData();

    Object.keys(partner)?.forEach((key) => {
      formData.append(key, partner[key]);
    });

    try {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/agent/owner-docs`;
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to update Owner Documents?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.patch(url, formData, formDataHeader());
        const responseData = response?.data;

        if (responseData?.success) {
          refetch();
          setIsLoading(false);
          showToast("success", responseData?.message);
          setAgentProfile({
            ...agentProfile.currentData,
            updatedData: responseData?.data,
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      showToast("error", error?.response?.data?.message);
      console.error("Owner Documents Update Failed", error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
  };

  const filterFileProperties = (partner) => {
    return Object.fromEntries(
      Object.entries(partner).filter(([key, value]) => value instanceof File)
    );
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      PaperProps={{
        sx: { width: isMobile ? "100%" : "65%", zIndex: 10, mb: 2 },
      }}
    >
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box mb={2} pb={isMobile && 10}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ ...regTitle, mt: 0 }}>
              {ownershipType === "proprietorship" ? (
                "Proprietor"
              ) : ownershipType === "limited" ? (
                "Managing Director"
              ) : ownershipType === "partnership" ? (
                <>{getOrdinal(activeIndex + 1)} Managing Partner </>
              ) : (
                "Owner"
              )}{" "}
              Documents
            </Typography>

            <CloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
          </Box>

          <Grid container spacing={3} mt={0}>
            {ownerInfoProps?.imageFields.map((field, index) => {
              return (
                <>
                  {partner?.[field?.name] && (
                    <Grid key={index} item md={4} xs={12}>
                      <FileUpload
                        id={field?.name}
                        label={field?.label}
                        onFileChange={(file) =>
                          handleChangeImage(file, field?.name)
                        }
                        previewImg={partner?.[field?.name] || null}
                        isDisable={field?.isDisable}
                        accept=".jpg,.jpeg,.png,.pdf"
                        acceptLabel="JPG JPEG PNG & PDF"
                      />
                    </Grid>
                  )}
                </>
              );
            })}
          </Grid>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Button
            type="submit"
            disabled={isLoading}
            sx={{
              ...depositBtn,
              position: isMobile && "fixed",
              bottom: isMobile && "0",
              left: isMobile && "0",
              zIndex: 1000,
              alignItems: "center",
              justifyContent: "flex-start",
              gap: isLoading ? "8px" : "0",
              textAlign: "left",
              paddingRight: isLoading ? "16px" : "0",
            }}
            onClick={handleSubmit}
          >
            Update owner document
          </Button>
        </Box>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your Update Request"}
      />

      {showErrorDialog && (
        <ErrorDialog
          errors={null}
          data={filterFileProperties(partner)}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type={"Preview And Confirm"}
        />
      )}
    </SwipeableDrawer>
  );
};

const ownerInfoProps = {
  imageFields: [
    {
      label: "Profile Image",
      name: "profileImage",
      isDisable: false,
    },
    {
      label: "NID Front Image",
      name: "nidFrontImage",
      isDisable: true,
    },
    {
      label: "NID Back Image",
      name: "nidBackImage",
      isDisable: true,
    },
    {
      label: "TIN Image",
      name: "tinImage",
      isDisable: true,
    },
    // {
    //   label: "Business Card",
    //   name: "signatureImage",
    //   isDisable: false,
    // },
  ],
};

export default CompanyOwnerDocsDrawer;
