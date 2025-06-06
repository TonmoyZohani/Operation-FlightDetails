import { Box, Button, Grid, Typography, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { EditAndReset, flexCenter } from "../PreviewAndUpdate";
import { regTitle } from "../../GeneraInfo";

import axios from "axios";
import { convertCamelToTitle } from "../../../../shared/common/functions";

import {
  companyDocsValidationSchema,
  modifyFileArray,
} from "../../CompanyDocs";
import { registrationErrText } from "../../../../shared/common/styles";
import { ReactComponent as PDFicon } from "../../../../images/svg/pdf.svg";
import { useDispatch } from "react-redux";
import { setAgentData } from "../../../../features/agentRegistrationSlice";
import useToast from "../../../../hook/useToast";
import CustomToast from "../../../Alert/CustomToast";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { registrationImage } from "../../OwnerDocs";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ImagePreviewModal from "../../../Modal/ImagePreviewModal";

const PreviewCompanyDocs = ({ allRegData }) => {
  const [regData, setRegData] = useState({ ...allRegData });
  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showDoc, setShowDoc] = useState({ label: "", file: null });

  useEffect(() => {
    if (regData.unverifiedAgent?.agencyInformation) {
      const transformedObject = {};
      for (const key in regData.unverifiedAgent?.agencyInformation) {
        if (regData.unverifiedAgent?.agencyInformation[key] === false) {
          transformedObject[key] = convertCamelToTitle(key) + " is unverified";
        } else {
          transformedObject[key] =
            regData.unverifiedAgent?.agencyInformation[key];
        }
      }
      setErrors(transformedObject);
    }
  }, [isEdit]);

  const validateField = async (field, value) => {
    try {
      await companyDocsValidationSchema(regData).validateAt(field, {
        [field]: value,
      });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
      return false;
    }
  };

  const handleChangeFile = async (e) => {
    const { name, files } = e.target;
    const isValid = await validateField(name, files[0]);

    if (isValid) {
      // setRegData({ ...regData, [name]: files[0] });
      handleUploadingFile({ name }, files[0]);
    }
  };
  const handleOnDrop = async (e, reqDoc) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    const imageFile = files[files.length - 1];
    const isValid = await validateField(reqDoc?.name, imageFile);
    if (isValid) {
      handleUploadingFile(reqDoc, imageFile);
    }
  };

  const handleUploadingFile = (reqDoc, imageFile) => {
    let progress = 0;

    setUploadProgress({
      ...uploadProgress,
      [reqDoc?.name]: {
        value: 0,
        status: "uploading",
      },
    });

    const interval = setInterval(() => {
      progress += 10;

      setUploadProgress({
        ...uploadProgress,
        [reqDoc?.name]: {
          value: progress,
          status: "uploading",
        },
      });

      if (progress >= 110) {
        clearInterval(interval);

        setUploadProgress({
          ...uploadProgress,
          [reqDoc?.name]: {
            value: 0,
            status: "completed",
          },
        });

        setRegData({ ...regData, [reqDoc?.name]: imageFile });
      }
    }, 50);
  };

  const handleRemoveFile = (reqDoc) => {
    setRegData({ ...regData, [reqDoc?.name]: allRegData[reqDoc?.name] });
    const newObj = Object.fromEntries(
      Object.entries(uploadProgress).filter(([key]) => key !== reqDoc?.name)
    );
    setUploadProgress(newObj);
    const newErr = Object.fromEntries(
      Object.entries(errors).filter(([key]) => key !== reqDoc?.name)
    );
    setErrors(newErr);
  };

  const handleSubmitCompanyDocs = async () => {
    const formData = new FormData();

    formData.append("agencyLogo", regData?.agencyLogo);
    formData.append("utilitiesBill", regData?.utilitiesBill);
    formData.append("signBoard", regData?.signBoard);
    formData.append("tradeLicense", regData?.tradeLicense);
    formData.append("aviationCertificate", regData?.aviationCertificate);
    formData.append("iataCertificate", regData?.iataCertificate);
    formData.append("toabCertificate", regData?.toabCertificate);
    formData.append("atabCertificate", regData?.atabCertificate);
    formData.append(
      "incorporationCertificate",
      regData?.incorporationCertificate
    );

    const validate = {
      agencyLogo: regData?.agencyLogo,
      utilitiesBill: regData?.utilitiesBill,
      signBoard: regData?.signBoard,
      tradeLicense: regData?.tradeLicense,
      aviationCertificate: regData?.aviationCertificate,
      iataCertificate: regData?.iataCertificate,
      toabCertificate: regData?.toabCertificate,
      atabCertificate: regData?.atabCertificate,
      incorporationCertificate: regData?.incorporationCertificate,
    };

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/agency-document/${regData?.agencyId}`;

    setIsLoading(true);
    try {
      await companyDocsValidationSchema(regData).validate(validate, {
        abortEarly: false,
      });
      setErrors({});

      const response = await axios.patch(url, formData, {
        headers: {
          Authorization: `Bearer ${regData?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const responseData = response?.data;
      if (responseData?.success === true) {
        setUploadProgress({});
        showToast("success", responseData?.message, () => {
          dispatch(
            setAgentData({
              ...regData,
              ...responseData?.data[0],
              pageNumber: responseData?.data[0]?.pageNumber + 1,
              isOpen: true,
            })
          );
          setRegData({
            ...regData,
            ...responseData?.data[0],
            pageNumber: responseData?.data[0]?.pageNumber + 1,
          });
        });
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        const message = err?.response?.data?.message || "An error occurred";
        setErrors({});
        showToast("error", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ ...flexCenter, justifyContent: "space-between", mt: 6 }}>
        <Box sx={{ ...flexCenter, gap: "10px", height: "35px" }}>
          <Typography noWrap sx={{ ...regTitle, mt: 0 }}>
            {regData?.agencyName} Agency Documents
          </Typography>

          <EditAndReset
            setRegData={setRegData}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            // regData={regData}
            setUploadProgress={setUploadProgress}
            setErrors={setErrors}
          />
        </Box>

        <Box sx={{ height: "35px" }}>
          {isEdit && (
            <Button
              style={{
                backgroundColor: "var(--secondary-color)",
                color: isLoading ? "gray" : "white",
                width: "110px",
                textTransform: "capitalize",
                fontSize: "12px",
              }}
              onClick={() => handleSubmitCompanyDocs()}
              disabled={isLoading}
            >
              {isLoading ? "Please Wait..." : "Save & Update"}
            </Button>
          )}
        </Box>
      </Box>

      <Grid
        container
        spacing={3}
        mt={0}
        // sx={{ pointerEvents: isEdit ? "auto" : "none" }}
      >
        {modifyFileArray(
          regData?.isIataProvide,
          regData?.isToabProvide,
          regData?.isAtabProvide,
          regData?.isAviationCertificateProvide,
          regData?.agentType
        ).map((reqDoc, i) => {
          return (
            <Grid key={i} item md={4} xs={12}>
              <Box
                sx={{
                  position: "relative",
                  border: "1px solid var(--border-color)",
                  borderRadius: "5px",
                  padding: "12px 16px 8px 16px",
                  pointerEvents:
                    Object.values(uploadProgress || {})
                      .map((item) => item.status)
                      .includes("uploading") && "none",
                }}
              >
                <Box
                  sx={{
                    ...flexCenter,
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--text-medium)",
                      fontSize: "13px",
                    }}
                  >
                    {reqDoc.label}
                  </Typography>

                  {regData[reqDoc?.name] && (
                    <RemoveRedEyeIcon
                      onClick={() =>
                        setShowDoc({
                          label: regData[reqDoc?.name]?.name
                            ? regData[reqDoc?.name]?.name
                            : reqDoc.label,
                          file: regData[reqDoc?.name],
                        })
                      }
                      sx={{
                        color: "#666666",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </Box>
                <label
                  htmlFor={reqDoc.name}
                  style={{
                    ...registrationImage?.labelContainer,
                    borderColor: errors[reqDoc?.name]
                      ? "var(--primary-color)"
                      : "var(--border-color)",
                    pointerEvents: isEdit ? "auto" : "none",
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    // setCurrentFile(i + 1);
                  }}
                  // onDragLeave={() => setCurrentFile(null)}
                  onDrop={(e) => handleOnDrop(e, reqDoc)}
                >
                  <Box sx={registrationImage?.imageBox}>
                    {regData[reqDoc?.name] ? (
                      <>
                        {regData[reqDoc?.name].type === "application/pdf" ? (
                          <Box sx={registrationImage?.pdfBox}>
                            <PDFicon />
                          </Box>
                        ) : (
                          <img
                            style={{
                              height: "100%",
                              width: "55%",
                              borderRadius: "5px",
                            }}
                            src={
                              typeof regData[reqDoc?.name] === "string"
                                ? regData[reqDoc?.name]
                                    ?.toLowerCase()
                                    ?.includes(".pdf")
                                  ? "https://storage.googleapis.com/b2bnodeimages/pdf.svg"
                                  : regData[reqDoc?.name]
                                : URL.createObjectURL(regData[reqDoc?.name])
                            }
                            alt="registration images"
                          />
                        )}
                      </>
                    ) : (
                      <Box sx={{ textAlign: "center" }}>
                        <Typography sx={registrationImage?.labelText}>
                          Choose a file, drag & drop or Paste it here
                        </Typography>
                        <Typography
                          sx={{
                            ...registrationImage?.labelText,
                            color: "#888",
                            fontSize: "12px",
                          }}
                        >
                          JPG, JPEG, PNG & PDF formats, up to 2MB
                        </Typography>
                        <Box
                          sx={{
                            border: "1px solid var(--secondary-color)",
                            color: "var(--secondary-color)",
                            textTransform: "capitalize",
                            fontSize: "14px",
                            borderRadius: "5px",
                            width: "60%",
                            p: "3px",
                            textTransform: "uppercase",
                            m: "0 auto",
                            mt: 1.5,
                          }}
                        >
                          Upload file
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <input
                    onChange={handleChangeFile}
                    id={reqDoc.name}
                    style={{ display: "none" }}
                    type="file"
                    name={reqDoc.name}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </label>

                <>
                  {(uploadProgress[reqDoc?.name] ||
                    regData[reqDoc?.name]?.name) && (
                    <>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          gap: "7px",
                          bgcolor: "#EEF1F7",
                          borderRadius: "5px",
                          p: "10px",
                          alignItems: "center",
                          mb: 1,
                          height: "56px",
                        }}
                      >
                        <InsertDriveFileIcon sx={{ color: "gray" }} />

                        <Box sx={{ width: "100%" }}>
                          <Typography sx={{ fontSize: "12px" }}>
                            {regData[reqDoc?.name]?.name?.length > 30
                              ? regData[reqDoc.name]?.name
                                  ?.slice(0, 30)
                                  ?.concat("...")
                              : regData[reqDoc.name]?.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                            }}
                          >
                            {uploadProgress[reqDoc?.name]?.status ===
                            "uploading" ? (
                              <>
                                Uploading {uploadProgress[reqDoc?.name]?.value}{" "}
                                %
                              </>
                            ) : (
                              "Completed"
                            )}
                          </Typography>
                        </Box>
                        <DeleteIcon
                          onClick={() => handleRemoveFile(reqDoc)}
                          sx={{
                            color: "var(--primary-color)",
                            cursor: "pointer",
                          }}
                        />
                      </Box>
                      {uploadProgress[reqDoc?.name] && (
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress[reqDoc?.name]?.value || 0}
                          sx={{
                            width: "100%",
                            visibility:
                              uploadProgress[reqDoc?.name]?.status ===
                              "completed"
                                ? "hidden"
                                : "visible",
                          }}
                        />
                      )}
                    </>
                  )}
                </>

                <span style={registrationErrText}>{errors[reqDoc?.name]}</span>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <ImagePreviewModal
        open={!!showDoc.file}
        imgUrl={showDoc.file}
        onClose={() => {
          setShowDoc({ label: "", file: null });
        }}
        label={showDoc.label}
      />

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

export default PreviewCompanyDocs;
