import CloseIcon from "@mui/icons-material/Close";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import FileUpload from "../../../../component/AirBooking/FileUpload";
import CustomAlert from "../../../../component/Alert/CustomAlert";
import CustomLoadingAlert from "../../../../component/Alert/CustomLoadingAlert";
import CustomToast from "../../../../component/Alert/CustomToast";
import ErrorDialog from "../../../../component/Dialog/ErrorDialog";
import ImagePreviewModal from "../../../../component/Modal/ImagePreviewModal";
import { regTitle } from "../../../../component/Register/GeneraInfo";
import { useAuth } from "../../../../context/AuthProvider";
import useToast from "../../../../hook/useToast";
import { depositBtn } from "../../../../shared/common/styles";
import useWindowSize from "../../../../shared/common/useWindowSize";

const CompanyAgencyDocs = ({ agentProfile, isEditable, refetch }) => {
  const { isMobile } = useWindowSize();
  const [imageUrl, setImageUrl] = useState(null);
  const [updateDocs, setUpdateDocs] = useState({});
  const [errors, setErrors] = useState({});
  const { agentToken } = useAuth();
  const [editable, setEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const agencyType = agentProfile?.currentData?.agencyInformation?.agencyType;

  useEffect(() => {
    if (!agentProfile || !agencyInfoProps) return;

    const initialUpdateDocs = {};

    agencyInfoProps?.commonImageFields(agencyType)?.forEach((field) => {
      initialUpdateDocs[field.valueProp] =
        agentProfile?.currentData?.agencyInformation?.documents?.[
          field.valueProp
        ] || "";
    });

    agencyInfoProps?.certification?.forEach((field) => {
      initialUpdateDocs[field.valueProp] =
        agentProfile?.currentData?.agencyInformation?.certificates?.[
          field.valueProp
        ] || "";
    });

    if (agentProfile?.currentData?.updatedCompany) {
      agencyInfoProps.certification.forEach((field) => {
        if (
          field?.isUpdate &&
          agentProfile.currentData?.updatedCompany[field.isUpdate] === 1
        ) {
          initialUpdateDocs[field.valueProp] =
            agentProfile?.currentData?.[field.valueProp] || "";
        }
      });
    }

    setUpdateDocs(initialUpdateDocs);
  }, [agentProfile, agencyInfoProps]);

  const handleFileChange = (file, name) => {
    setUpdateDocs((prevDocs) => ({
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

    Object.keys(updateDocs).forEach((key) => {
      formData.append(key, updateDocs[key]);
    });

    try {
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to update Agency Documents?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/agent/agency-docs`;
        const response = await axios.patch(url, formData, {
          headers: {
            Authorization: `Bearer ${agentToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const responseData = response?.data;
        if (responseData?.success === true) {
          refetch();
          setIsLoading(false);
          showToast("success", response?.data?.message);
          CustomAlert({
            success: response?.data?.success,
            message: response?.data?.message,
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);

      showToast("error", error?.response?.data?.message);
      if (error.name === "ValidationError") {
        const formattedErrors = {};
        error.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });
        setErrors(formattedErrors);
      }
      console.error(error.message);
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
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: !isMobile && "center",
          mt: 4,
          flexDirection: {
            xs: "column",
            lg: "row",
            md: "row",
            sm: "row",
          },
          gap: { xs: 1.3, lg: "0px" },
          mb: { xs: 2, lg: 0, md: 0, sm: 0 },
        }}
      >
        <Typography sx={{ ...regTitle, mt: 0 }}>Agency Documents</Typography>
        {editable ? (
          <Typography
            onClick={() => setEditable(!editable)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "4px",
              cursor: "pointer",
              color: "white",
              bgcolor: "var(--primary-color)",
              px: 1,
              borderRadius: "3px",
              width: "130px",
            }}
          >
            <span style={{ paddingTop: "3px", fontSize: "13px" }}>
              {!isMobile && "Click to "} Close
            </span>
            <CloseIcon sx={{ p: 0.25 }} />
          </Typography>
        ) : (
          isEditable && (
            <Typography
              onClick={() => setEditable(!editable)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "4px",
                cursor: "pointer",
                color: "white",
                bgcolor: "var(--primary-color)",
                px: 1,
                borderRadius: "3px",
                width: "130px",
              }}
            >
              <span style={{ paddingTop: "3px", fontSize: "13px" }}>
                {!isMobile && "Click to "} Update
              </span>
              <EditCalendarIcon sx={{ p: 0.25 }} />
            </Typography>
          )
        )}
      </Box>

      <Grid container spacing={3} mt={0}>
        {agencyInfoProps?.commonImageFields(agencyType)?.map((field, index) => {
          const isImageExist =
            agentProfile?.updatedData?.agencyInformation?.documents?.[
              field?.valueProp
            ];

          return (
            <Grid key={index} item md={4} sm={6} xs={12}>
              <FileUpload
                id={field?.valueProp}
                label={field?.label}
                onFileChange={(file) =>
                  handleFileChange(file, field?.valueProp)
                }
                previewImg={updateDocs?.[field?.valueProp] || null}
                isDisable={!editable || field?.isDisable}
                {...(field?.valueProp !== "logoImage"
                  ? {
                      accept: ".jpg,.jpeg,.png,.pdf",
                      acceptLabel: "JPG JPEG PNG & PDF",
                    }
                  : {})}
              />
              {isImageExist && (
                <Typography
                  sx={{
                    textAlign: "start",
                    fontSize: "12px",
                    color: "green",
                    marginTop: "5px",
                  }}
                >
                  Already in update request
                </Typography>
              )}
            </Grid>
          );
        })}

        {agencyInfoProps?.certification?.map((field, index) => {
          const isImageExist =
            agentProfile?.updatedData?.agencyInformation?.certificates?.[
              field?.valueProp
            ];

          return (
            <Grid key={index} item md={4} sm={6} xs={12}>
              <Box sx={{ borderRadius: "8px" }}>
                <FileUpload
                  id={field?.valueProp}
                  label={field?.label}
                  onFileChange={(file) =>
                    handleFileChange(file, field?.valueProp)
                  }
                  previewImg={updateDocs?.[field?.valueProp] || null}
                  isDisable={!editable || field?.isDisable}
                  accept=".jpg,.jpeg,.png,.pdf"
                  acceptLabel="JPG JPEG PNG & PDF"
                />
              </Box>

              {isImageExist && (
                <Typography
                  sx={{
                    textAlign: "start",
                    fontSize: "12px",
                    color: "green",
                    marginTop: "5px",
                  }}
                >
                  Already in update request
                </Typography>
              )}
            </Grid>
          );
        })}
      </Grid>

      <Button
        type="submit"
        disabled={isLoading}
        sx={{
          ...depositBtn,
          display: editable ? "flex" : "none",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: isLoading ? "8px" : "0",
          textAlign: "left",
          paddingRight: isLoading ? "16px" : "0",
        }}
        onClick={handleSubmit}
      >
        Update agency document
      </Button>
      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your Update Request"}
      />
      <ImagePreviewModal
        open={imageUrl}
        onClose={setImageUrl}
        imgUrl={imageUrl}
      />
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
      {showErrorDialog && (
        <ErrorDialog
          errors={null}
          data={filterFileProperties(updateDocs)}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type={"Preview And Confirm"}
        />
      )}
    </Box>
  );
};

export const fileValidationSchema = Yup.mixed()
  .required("File is required")
  .test(
    "fileType",
    "Unsupported File Format",
    (value) =>
      value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
  )
  .test(
    "fileSize",
    "File Size is too large",
    (value) => value && value.size <= 2 * 1024 * 1024 // 2 MB limit
  );

const agencyInfoProps = {
  commonImageFields: (agencyType) => [
    {
      label: "Logo Image",
      valueProp: "logoImage",
      isDisable: false,
    },
    // {
    //   label: `${agencyType === "limited" ? "Managing Director" : agencyType === "proprietorship" ? "Proprietor" : "1st Partner"} Business Card`,
    //   name: "utilityImage",
    //   type: "documents",
    // },
    {
      label: "Trade Image",
      valueProp: "tradeImage",
      isDisable: true,
    },
    {
      label: "SignBoard Image",
      valueProp: "signBoardImage",
      isDisable: false,
    },
  ],
  certification: [
    {
      label: "Civil Aviation Certificate",
      valueProp: "civilImage",
      isUpdate: "isAviationCertificateProvide",
    },
    {
      label: "IATA Certificate",
      valueProp: "iataImage",
      isUpdate: "isIataProvide",
    },
    {
      label: "TOAB Certificate",
      valueProp: "toabImage",
      isUpdate: "isToabProvide",
    },
    {
      label: "ATAB Certificate",
      valueProp: "atabImage",
      isUpdate: "isAtabProvide",
    },
  ],
};

export default CompanyAgencyDocs;
