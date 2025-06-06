import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import { ReactComponent as PDFicon } from "../../images/svg/pdf.svg";
import { registrationErrText } from "../../shared/common/styles";
import ImagePreviewModal from "../Modal/ImagePreviewModal";

const RegImageBox = ({
  handleGetImageFile,
  errors = {},
  setErrors,
  reqDocFields,
  data,
  validationSchema,
  uploadProgress,
  setUploadProgress,
  validate,
  correctionFields = [],
}) => {
  const [showDoc, setShowDoc] = useState({ label: "", file: null });

  const validateField = validate
    ? validate
    : async (field, value) => {
        try {
          await validationSchema.validateAt(field, { [field]: value });
          setErrors((prev) => ({ ...prev, [field]: "" }));

          return true;
        } catch (e) {
          setErrors((prev) => ({ ...prev, [field]: e.message }));
          return false;
        }
      };

  const handleImageChange = async (e, reqDoc, type) => {
    let imageFile;
    if (type === "onChange") {
      imageFile = e.target.files[0];
    } else {
      imageFile = e.dataTransfer.files[0];
    }
    const isValid = await validateField(reqDoc?.name, imageFile);
    if (isValid) {
      handleUploadingFile(reqDoc, imageFile);
      e.target.value = null;
    }
  };

  const handleUploadingFile = (reqDoc, imageFile) => {
    let progress = 0;

    setUploadProgress({
      ...uploadProgress,
      [reqDoc?.name]: { value: 0, status: "uploading" },
    });

    const interval = setInterval(() => {
      progress += 10;

      setUploadProgress({
        ...uploadProgress,
        [reqDoc?.name]: { value: progress, status: "uploading" },
      });

      if (progress >= 110) {
        clearInterval(interval);

        setUploadProgress({
          ...uploadProgress,
          [reqDoc?.name]: { value: 0, status: "completed" },
        });

        handleGetImageFile(reqDoc, imageFile);
      }
    }, 50);
  };

  const handleRemoveFile = (reqDoc) => {
    handleGetImageFile(reqDoc, null);
    const newObj = Object.fromEntries(
      Object.entries(uploadProgress).filter(([key]) => key !== reqDoc?.name)
    );
    setUploadProgress(newObj);
    const newErr = Object.fromEntries(
      Object.entries(errors).filter(([key]) => key !== reqDoc?.name)
    );

    setErrors(newErr);
  };

  return (
    <>
      {reqDocFields.map((reqDoc, i) => {
        const isOptional =
          data[reqDoc?.name] &&
          (reqDoc?.name === "iataImage" ||
            reqDoc?.name === "toabImage" ||
            reqDoc?.name === "atabImage" ||
            reqDoc?.name === "civilImage");

        const isUnverified =
          correctionFields?.length > 0 &&
          !correctionFields?.includes(reqDoc?.name);

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
              <Box sx={{ ...flexCenter, justifyContent: "space-between" }}>
                {/* <Typography
                  sx={{ color: "var(--text-medium)", fontSize: "13px" }}
                >
                  {reqDoc.label}
                </Typography> */}
                <p
                  style={{
                    color:
                      correctionFields.length > 0 &&
                      !correctionFields?.includes(reqDoc?.name)
                        ? "#ccc"
                        : "var(--text-medium)",
                    fontSize: "13px",
                  }}
                  dangerouslySetInnerHTML={{ __html: reqDoc.label }}
                />
                {data[reqDoc?.name] && (
                  <RemoveRedEyeIcon
                    onClick={() =>
                      setShowDoc({
                        label: data[reqDoc?.name]?.name
                          ? data[reqDoc?.name]?.name
                          : reqDoc.label,
                        file: data[reqDoc?.name],
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
                  pointerEvents: isUnverified && "none",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleImageChange(e, reqDoc, "onDrop");
                }}
              >
                <Box sx={registrationImage?.imageBox}>
                  {data[reqDoc?.name] ? (
                    <>
                      {data[reqDoc?.name].type === "application/pdf" ? (
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
                            typeof data[reqDoc?.name] === "string"
                              ? data[reqDoc?.name]
                                  ?.toLowerCase()
                                  ?.includes(".pdf")
                                ? "https://storage.googleapis.com/flyfar-user-document-bucket/svg/PDF_PLACEHOLDER.svg"
                                : data[reqDoc?.name]
                              : URL.createObjectURL(data[reqDoc?.name])
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
                        JPG, JPEG, PNG {reqDoc.name !== "logoImage" && "& PDF"}{" "}
                        formats, up to 2MB
                      </Typography>
                      <Box
                        sx={{
                          border: "1px solid var(--secondary-color)",
                          color: "var(--secondary-color)",
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
                  onChange={(e) => handleImageChange(e, reqDoc, "onChange")}
                  id={reqDoc.name}
                  style={{ display: "none" }}
                  type="file"
                  name={reqDoc.name}
                  accept={
                    reqDoc.name === "logoImage"
                      ? ".jpg,.jpeg,.png,.webp"
                      : ".jpg,.jpeg,.png,.pdf,.webp"
                  }
                />
              </label>

              {(uploadProgress[reqDoc?.name] ||
                data[reqDoc?.name]?.name ||
                isOptional) && (
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
                      <Typography sx={{ fontSize: "12px", color: "#888" }}>
                        {data[reqDoc?.name]?.name?.length > 30
                          ? data[reqDoc.name]?.name?.slice(0, 25)?.concat("...")
                          : data[reqDoc.name]?.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        {uploadProgress[reqDoc?.name]?.status ===
                        "uploading" ? (
                          <>Uploading {uploadProgress[reqDoc?.name]?.value} %</>
                        ) : !data[reqDoc?.name] ? (
                          "Upload File"
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
                          uploadProgress[reqDoc?.name]?.status === "completed"
                            ? "hidden"
                            : "visible",
                      }}
                    />
                  )}
                </>
              )}

              <span style={registrationErrText}>{errors[reqDoc?.name]}</span>
            </Box>
          </Grid>
        );
      })}

      <ImagePreviewModal
        open={!!showDoc.file}
        imgUrl={showDoc.file}
        onClose={() => {
          setShowDoc({ label: "", file: null });
        }}
        label={showDoc.label}
      />
    </>
  );
};

const flexCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const registrationImage = {
  labelContainer: {
    ...flexCenter,
    flexDirection: "column",
    height: "100%",
    cursor: "pointer",
    gap: "10px",
    padding: "12px 0px",
  },

  labelText: {
    color: "var(--text-medium)",
    fontSize: "13px",
    textAlign: "center",
  },

  imageBox: {
    height: "120px",
    width: "100%",
    padding: 1,
    border: "2px dashed var(--border-color)",
    borderRadius: "5px",
    ...flexCenter,
  },

  pdfBox: { height: "100%", ...flexCenter },
};

export default RegImageBox;
