import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPassengerPassportCopy,
  setPassengerVisaCopy,
} from "../AirBooking/airbookingSlice";
import ImagePreviewModal from "./ImagePreviewModal";

const ImageUploadFile = ({
  label,
  onFileChange,
  accept = ".jpeg, .jpg, .png",
  acceptLabel = "JPEG, PNG & JPG",
  isDisable = false,
  passengerCount,
  id,
  documentType,
  passengerType,
  copyFile = null,
}) => {
  const { passengerData } = useSelector((state) => state.flightBooking);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState(null);
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const dropZoneRef = useRef(null);

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    if (newFile && validateFile(newFile)) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreview(e.target.result);
      };

      reader.readAsDataURL(newFile);
      uploadFile(newFile);
      setFile(newFile);
      onFileChange(newFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFile = event.dataTransfer.files[0];
    if (newFile && validateFile(newFile)) {
      setFile(newFile);
      uploadFile(newFile);
      readFile(newFile);
      onFileChange(newFile);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("File type must be JPEG, PNG, or JPG.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const documentTypeKey =
      documentType === "passport" ? "passportImage" : "visaImage";

    const passengerGroup = passengerData?.[passengerType?.toLowerCase()];
    const passenger = passengerGroup?.[passengerCount - 1];
    const file = passenger?.[documentTypeKey] || copyFile;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      setUploadProgress(100);
      reader.readAsDataURL(file);
    }
  }, [passengerData, passengerType, passengerCount, documentType, preview]);

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = (file) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);

        if (file.type.startsWith("image/")) {
          setPreview(URL.createObjectURL(file));
        }
      }
    }, 200);
  };

  const handleDeleteFile = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);

    const index = passengerCount - 1;
    if (documentType === "passport") {
      dispatch(
        setPassengerPassportCopy({
          passengerType: passengerType?.toLowerCase(),
          index,
          passportImage: null,
        })
      );
    } else if (documentType === "visa") {
      dispatch(
        setPassengerVisaCopy({
          passengerType: passengerType?.toLowerCase(),
          index,
          visaImage: null,
        })
      );
    }
  };

  const handlePreviewModalOpen = (file) => {
    setImgUrl(file);
  };

  const DropZone = styled(Box)(({ active }) => ({
    border: `2px dashed ${active ? "#1976d2" : "#c4c4c4"}`,
    backgroundColor: active && "#EAF4FF",
    borderRadius: "8px",
    padding: "20px 10px",
    textAlign: "center",
    cursor: "pointer",
    height: "120px",
  }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropZoneRef.current && !dropZoneRef.current.contains(event.target)) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const handlePaste = (event) => {
      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              handleFileChange({ target: { files: [file] } });
            }
          }
        }
      }
    };

    const node = dropZoneRef.current;
    if (node) {
      node.addEventListener("paste", handlePaste);
    }

    return () => {
      if (node) {
        node.removeEventListener("paste", handlePaste);
      }
    };
  }, [handleFileChange]);

  return (
    <Box
      ref={dropZoneRef}
      sx={{
        width: "100%",
        p: 2,
        borderRadius: "8px",
        border: `1px solid ${active ? "#1976d2" : "var(--border)"}`,
        cursor: "pointer",
      }}
      onClick={() => setActive(true)}
    >
      <Box
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          gap: 1.5,
          pb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "0.80rem",
              sm: "0.75rem",
              lg: "0.95rem",
              md: "0.80rem",
            },
            color: "#666666",
            textTransform: "uppercase",
          }}
          component="h2"
        >
          {label}
        </Typography>
        {preview && (
          <RemoveRedEyeIcon
            sx={{
              color: "#666666",
              fontSize: "24",
              cursor: "pointer",
            }}
            onClick={() => {
              handlePreviewModalOpen(preview);
            }}
          />
        )}
      </Box>

      <label htmlFor={id}>
        <DropZone
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          active={active}
        >
          {preview && documentType !== null ? (
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          ) : (
            <>
              <Typography
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.70rem",
                    lg: "0.82rem",
                    md: "0.80rem",
                  },
                }}
                variant="body2"
              >
                Choose a file, drag & drop or Paste it here
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  fontSize: {
                    xs: "0.65rem",
                    sm: "0.65rem",
                    lg: "0.68rem",
                    md: "0.70rem",
                  },
                }}
              >
                {acceptLabel} formats, up to 2MB
              </Typography>
              <Typography
                sx={{
                  border: "1px solid var(--secondary-color)",
                  color: "var(--secondary-color)",
                  fontWeight: 400,
                  mt: 1,
                  width: "50%",
                  mx: "auto",
                  borderRadius: "4px",
                  fontSize: {
                    xs: "0.80rem",
                    lg: "0.80rem",
                    md: "0.75rem",
                  },
                }}
              >
                UPLOAD FILE
              </Typography>
            </>
          )}
          <input
            type="file"
            id={id}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept={accept}
            disabled={isDisable}
          />
        </DropZone>
      </label>

      {passengerData?.[passengerType?.toLowerCase()]?.[passengerCount - 1]?.[
        documentType === "passport" ? "passportImage" : "visaImage"
      ] && (
        <List sx={{ mt: 1 }}>
          <ListItem
            sx={{ py: 0, bgcolor: "#EEF1F7", borderRadius: "5px", gap: 0 }}
            secondaryAction={
              uploadProgress === 100 ? (
                <IconButton edge="end" onClick={handleDeleteFile}>
                  <DeleteIcon fontSize="24" color="error" />
                </IconButton>
              ) : (
                <IconButton edge="end" onClick={handleDeleteFile}>
                  <CloseIcon />
                </IconButton>
              )
            }
          >
            <ListItemIcon sx={{ minWidth: "35px" }}>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText
              sx={{
                fontSize: {
                  xs: "0.5rem",
                  lg: "0.7rem",
                },
              }}
              primaryTypographyProps={{
                fontSize: {
                  xs: "0.7rem",
                  lg: "0.7rem",
                },
              }}
              primary={
                uploadProgress === 100
                  ? passengerData?.[passengerType?.toLowerCase()]?.[
                      passengerCount - 1
                    ]?.[
                      documentType === "passport"
                        ? "passportImage"
                        : "visaImage"
                    ].name
                  : ""
              }
              secondary={
                uploadProgress === 100
                  ? "Completed"
                  : `Uploading... ${uploadProgress}%`
              }
            />
            {uploadProgress !== 100 && (
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ width: "100%", mt: 1 }}
              />
            )}
          </ListItem>
        </List>
      )}
      <ImagePreviewModal
        open={imgUrl}
        imgUrl={imgUrl}
        onClose={setImgUrl}
        label={label}
      />
    </Box>
  );
};

export default ImageUploadFile;
