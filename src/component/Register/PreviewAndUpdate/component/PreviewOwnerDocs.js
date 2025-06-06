import { Box, Button, Grid, Typography, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { flexCenter } from "../PreviewAndUpdate";
import { regTitle } from "../../GeneraInfo";
import axios from "axios";
import {
  convertCamelToTitle,
  fileTypeValid,
  getOrdinal,
} from "../../../../shared/common/functions";
import { registrationErrText } from "../../../../shared/common/styles";
import { ReactComponent as PDFicon } from "../../../../images/svg/pdf.svg";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setAgentData } from "../../../../features/agentRegistrationSlice";
import CustomToast from "../../../Alert/CustomToast";
import useToast from "../../../../hook/useToast";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { registrationImage } from "../../OwnerDocs";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ImagePreviewModal from "../../../Modal/ImagePreviewModal";

const PreviewOwnerDocs = ({ allRegData }) => {
  const [regData, setRegData] = useState({ ...allRegData });
  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const agent = useSelector((state) => state.agentRegistration.agent);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isEdit, setIsEdit] = useState(null);
  const [showDoc, setShowDoc] = useState({ label: "", file: null });

  useEffect(() => {
    let mergedArray;

    if (regData.unverifiedAgent?.owners?.length > 0) {
      mergedArray = regData?.ownership?.[regData?.agentType].map((item) => {
        const unverifiedItem = regData.unverifiedAgent?.owners.find(
          (ver) => ver.id === item.id
        );

        let transformedObject = {};

        if (unverifiedItem) {
          for (const key in unverifiedItem) {
            if (unverifiedItem[key] === false) {
              transformedObject[key] =
                convertCamelToTitle(key) + " is unverified";
            } else {
              transformedObject[key] = unverifiedItem[key];
            }
          }
        } else {
          transformedObject = { id: item.id };
        }

        return transformedObject;
      });
    } else {
      mergedArray = regData?.ownership?.[regData?.agentType]?.map((owner) => ({
        id: owner.id,
      }));
    }
    setErrors(mergedArray);
  }, [isEdit]);

  const validateField = async (id, fieldName, value) => {
    try {
      const singleField = { [fieldName]: value };

      await validationSchema.validateAt(fieldName, singleField);

      setErrors((preverr) =>
        preverr.map((e) => {
          if (e.id === id) {
            const { [fieldName]: _, ...rest } = e;
            console.error(_);
            return rest;
          }
          return e;
        })
      );

      return true;
    } catch (err) {
      console.error(err.message);
      const errorArray = errors.map((error) => {
        if (error.id === id) {
          return { ...error, id, [fieldName]: err.message };
        }
        return error;
      });

      setErrors(errorArray);
      return false;
    }
  };

  const handleChange = (reqDoc, id, value) => {
    setRegData({
      ...regData,
      ownership: {
        ...regData?.ownership,
        [regData?.agentType]: regData?.ownership[regData?.agentType]?.map(
          (partner) => {
            if (partner?.id === id)
              return { ...partner, [reqDoc?.name]: value };

            return partner;
          }
        ),
      },
    });
  };

  const handleOnDrop = async (e, reqDoc, id) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const imageFile = files[files.length - 1];

    const isValid = await validateField(id, reqDoc?.name, imageFile);

    if (isValid) {
      // handleChange(reqDoc, id, imageFile);
      handleUploadingFile(reqDoc, id, imageFile);
    }
  };

  const handleChangeFile = async (e, reqDoc, id) => {
    const { files } = e.target;

    if (files.length > 0) {
      const file = files[0];

      const isValid = await validateField(id, reqDoc?.name, file);

      if (isValid) {
        handleUploadingFile(reqDoc, id, file);
      }
    }
  };

  const handleUploadingFile = (reqDoc, id, imageFile) => {
    let progress = 0;

    setUploadProgress({
      ...uploadProgress,
      [reqDoc?.name]: {
        value: 0,
        status: "uploading",
        id: null,
      },
    });

    const interval = setInterval(() => {
      progress += 10;

      setUploadProgress({
        ...uploadProgress,
        [reqDoc?.name]: {
          value: progress,
          status: "uploading",
          id,
        },
      });

      if (progress >= 110) {
        clearInterval(interval);

        setUploadProgress({
          ...uploadProgress,
          [reqDoc?.name]: {
            value: 0,
            status: "completed",
            id,
          },
        });

        handleChange(reqDoc, id, imageFile);
      }
    }, 200);
  };

  const handleRemoveFile = (reqDoc, id) => {
    const updated = allRegData?.ownership[regData?.agentType]?.find(
      (r) => r.id === id
    );

    handleChange(reqDoc, id, updated[reqDoc.name]);
    const newObj = Object.fromEntries(
      Object.entries(uploadProgress).filter(([key]) => key !== reqDoc?.name)
    );
    setUploadProgress(newObj);
    // const newErr = Object.fromEntries(
    //   Object.entries(errors).filter(([key]) => key !== reqDoc?.name)
    // );
    // setErrors(newErr);
  };

  const handleUpdateFile = async (partnerId) => {
    const crrPartner = regData?.ownership?.[regData?.agentType]?.find(
      (partner) => partner?.id === partnerId && partner
    );

    // return
    const formData = new FormData();

    formData.append("photo", crrPartner?.photo);
    formData.append("nidFront", crrPartner?.nidFront);
    formData.append("nidBack", crrPartner?.nidBack);
    formData.append("tin", crrPartner?.tin);
    formData.append("signature", crrPartner?.signature);

    // return;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/${regData?.agentType}-owners/${partnerId}/docs`;

    setIsLoading(true);
    try {
      await validationSchema.validate(crrPartner, { abortEarly: false });
      setErrors([]);
      const response = await axios.patch(url, formData, {
        headers: {
          Authorization: `Bearer ${regData?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const responseData = response?.data;
      if (responseData?.success === true) {
        const agentData = responseData?.data[0];

        showToast("success", responseData?.message, () => {
          setRegData(agentData);
          dispatch(
            setAgentData({
              ...regData,
              ...agentData,
              pageNumber: agentData?.pageNumber + 1,
              isOpen: true,
            })
          );
        });
        setUploadProgress({});
      }
    } catch (e) {
      const message = e?.response?.data?.message || "An error occurred";
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {regData?.ownership?.[regData?.agentType]?.map(
        (partner, partnerIndex) => {
          const errorObject = errors?.find((err) => err?.id === partner?.id);
          return (
            <Box key={partnerIndex}>
              <Box
                sx={{ ...flexCenter, justifyContent: "space-between", mt: 6 }}
              >
                <Box sx={{ ...flexCenter, gap: "10px" }}>
                  <Typography noWrap sx={{ ...regTitle, mt: 0 }}>
                    Agency{" "}
                    {regData?.agentType === "proprietorship" ? (
                      "Proprietor"
                    ) : regData?.agentType === "limited" ? (
                      "Managing Director"
                    ) : regData?.agentType === "partnership" ? (
                      <>{getOrdinal(partnerIndex + 1)} Managing Partner </>
                    ) : (
                      "Owner"
                    )}{" "}
                    Documents
                  </Typography>

                  {isEdit === partnerIndex ? (
                    <Typography
                      onClick={() => {
                        setIsEdit(null);
                        setRegData(agent);
                        setUploadProgress({});
                      }}
                      sx={{
                        cursor: "pointer",
                        fontSize: "13px",
                        color: "var(--primary-color)",
                        borderBottom: "1px solid var(--primary-color)",
                      }}
                    >
                      Click to Reset
                    </Typography>
                  ) : (
                    <Typography
                      onClick={() => {
                        setIsEdit(partnerIndex);
                        setRegData(agent);
                        setUploadProgress({});
                      }}
                      sx={{
                        cursor: "pointer",
                        fontSize: "13px",
                        color: "var(--primary-color)",
                        borderBottom: "1px solid var(--primary-color)",
                      }}
                    >
                      Click to Update
                    </Typography>
                  )}
                </Box>

                <Box sx={{ height: "35px" }}>
                  {isEdit === partnerIndex && (
                    <Button
                      style={{
                        backgroundColor: "var(--secondary-color)",
                        color: isLoading ? "gray" : "white",
                        width: "110px",
                        textTransform: "capitalize",
                        fontSize: "12px",
                      }}
                      onClick={() => handleUpdateFile(partner?.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Please Wait..." : "Save & Update"}
                    </Button>
                  )}
                </Box>
              </Box>

              <Grid container spacing={3} mt={0}>
                {reqDocFields(
                  regData?.agentType === "proprietorship"
                    ? "Proprietor"
                    : regData?.agentType === "limited"
                      ? "Managing Director"
                      : regData?.agentType === "partnership"
                        ? `${getOrdinal(partnerIndex + 1)} Managing Partner's`
                        : "Owner"
                ).map((reqDoc, index) => {
                  return (
                    <Grid key={index} item md={4} xs={12}>
                      <Box
                        sx={{
                          position: "relative",
                          border: "1px solid var(--border-color)",
                          borderRadius: "5px",
                          padding: "12px 16px 8px 16px",
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

                          {partner[reqDoc?.name] && (
                            <RemoveRedEyeIcon
                              onClick={() =>
                                setShowDoc({
                                  label: partner[reqDoc?.name]?.name
                                    ? partner[reqDoc?.name]?.name
                                    : reqDoc.label,
                                  file: partner[reqDoc?.name],
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
                          htmlFor={reqDoc.name + partner?.id}
                          style={{
                            ...registrationImage?.labelContainer,
                            borderColor: errorObject?.[reqDoc?.name]
                              ? "var(--primary-color)"
                              : "var(--border-color)",
                            pointerEvents:
                              isEdit === null
                                ? "none"
                                : Object.values(uploadProgress || {})
                                    .map((item) => item.status)
                                    .includes("uploading") && "none",
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleOnDrop(e, reqDoc, partner?.id)}
                        >
                          <Box sx={registrationImage?.imageBox}>
                            {partner[reqDoc?.name] ? (
                              <>
                                {partner[reqDoc?.name].type ===
                                "application/pdf" ? (
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
                                      typeof partner[reqDoc?.name] === "string"
                                        ? partner[reqDoc?.name]
                                            ?.toLowerCase()
                                            ?.includes(".pdf")
                                          ? "https://storage.googleapis.com/b2bnodeimages/pdf.svg"
                                          : partner[reqDoc?.name]
                                        : URL.createObjectURL(
                                            partner[reqDoc?.name]
                                          )
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
                            onChange={(e) =>
                              handleChangeFile(e, reqDoc, partner?.id)
                            }
                            id={reqDoc.name + partner?.id}
                            style={{ display: "none" }}
                            type="file"
                            name={reqDoc.name}
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                        </label>

                        {(uploadProgress[reqDoc?.name] ||
                          partner[reqDoc?.name]?.name) &&
                          uploadProgress[reqDoc?.name]?.id === partner?.id && (
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
                                    {partner[reqDoc?.name]?.name?.length > 30
                                      ? partner[reqDoc.name]?.name
                                          ?.slice(0, 30)
                                          ?.concat("...")
                                      : partner[reqDoc.name]?.name}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                    }}
                                  >
                                    {uploadProgress[reqDoc?.name]?.status ===
                                    "uploading" ? (
                                      <>
                                        Uploading{" "}
                                        {uploadProgress[reqDoc?.name]?.value} %
                                      </>
                                    ) : (
                                      "Completed"
                                    )}
                                  </Typography>
                                </Box>
                                <DeleteIcon
                                  onClick={() =>
                                    handleRemoveFile(reqDoc, partner?.id)
                                  }
                                  sx={{
                                    color: "var(--primary-color)",
                                    cursor: "pointer",
                                  }}
                                />
                              </Box>
                              {uploadProgress[reqDoc?.name] && (
                                <LinearProgress
                                  variant="determinate"
                                  value={
                                    uploadProgress[reqDoc?.name]?.value || 0
                                  }
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

                        <span style={registrationErrText}>
                          {errors[reqDoc?.name]}
                        </span>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        }
      )}

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

const reqDocFields = (dynamicLable) => {
  return [
    {
      label: `${dynamicLable} Passport Size Photo`,
      name: "photo",
    },
    {
      label: `${dynamicLable} NID Front`,
      name: "nidFront",
    },
    {
      label: `${dynamicLable} NID Back`,
      name: "nidBack",
    },
    {
      label: `${dynamicLable} TIN`,
      name: "tin",
    },
    {
      label: `${dynamicLable} Signature`,
      name: "signature",
    },
  ];
};

const validationSchema = Yup.object().shape({
  nidFront: fileTypeValid("NID Front"),
  nidBack: fileTypeValid("NID Back"),
  photo: fileTypeValid("Pasport Size Photo"),
  tin: fileTypeValid("TIN Certificate"),
  signature: fileTypeValid("Signature"),
});

export default PreviewOwnerDocs;
