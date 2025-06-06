import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Box,
  Button,
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
import { useDispatch } from "react-redux";
import pdfIcon from "../../assets/png/pdf.png";
import ImagePreviewModal from "../Modal/ImagePreviewModal";
import {
  setPassengerPassportCopy,
  setPassengerVisaCopy,
} from "./airbookingSlice";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";

const FileUpload = ({
  label,
  onFileChange,
  clearTrigger = false,
  id,
  previewImg,
  passengerType,
  passengerCount,
  documentType,
  accept = ".jpeg, .jpg, .png",
  acceptLabel = "JPEG, PNG & JPG",
  isDisable = false,
}) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(previewImg);
  const [imgUrl, setImgUrl] = useState(null);
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();
  const dropZoneRef = useRef(null);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    if (newFile && validateFile(newFile)) {
      setFile(newFile);
      uploadFile(newFile);
      onFileChange(newFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFile = event.dataTransfer.files[0];
    if (newFile && validateFile(newFile)) {
      setFile(newFile);
      uploadFile(newFile);
      onFileChange(newFile);
    }
  };

  const validateFile = (file) => {
    const mimeMap = {
      ".jpeg": "image/jpeg",
      ".jpg": "image/jpg",
      ".png": "image/png",
      ".pdf": "application/pdf",
    };

    const allowedTypes = accept
      .split(",")
      .map((ext) => mimeMap[ext.trim().toLowerCase()])
      .filter(Boolean);

    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      showToast(
        "error",
        `File type must be ${acceptLabel} and size up to 2MB.`
      );
      return false;
    }
    return true;
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
        } else if (file.type === "application/pdf") {
          setPreview(file);
        }
      }
    }, 50);
  };

  const handleDeleteFile = () => {
    setFile(null);
    setUploadProgress(0);
    setPreview(null);

    const index = passengerCount - 1;

    if (documentType === "passport") {
      dispatch(
        setPassengerPassportCopy({
          passengerType: passengerType.toLowerCase(),
          index,
          passportImage: null,
        })
      );
    } else if (documentType === "visa") {
      dispatch(
        setPassengerVisaCopy({
          passengerType: passengerType.toLowerCase(),
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
    border: `2px dashed ${active && !isDisable ? "#1976d2" : "#c4c4c4"}`,
    backgroundColor: active && !isDisable && "#EAF4FF",
    borderRadius: "8px",
    padding: {
      xs: "10px",
      sm: "20px",
      lg: "20px",
    },
    textAlign: "center",
    cursor: "pointer",
  }));

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(previewImg);
    }
  }, [previewImg]);

  useEffect(() => {
    if (clearTrigger) {
      setFile(null);
      setUploadProgress(0);
      setPreview(previewImg);
    }
  }, [clearTrigger]);

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
        border: `1px solid ${active && !isDisable ? "#1976d2" : "var(--border)"}`,
        cursor: "pointer",
      }}
      onClick={() => !isDisable && setActive(true)}
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
              xs: "0.85rem",
              lg: "0.95rem",
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
          {preview ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                height: {
                  xs: "100px",
                  sm: "105px",
                  md: "115px",
                  lg: "130px",
                },
                width: "100%",
                cursor: isDisable ? "not-allowed" : "pointer",
                p: { lg: 0.5 },
              }}
            >
              <Box
                component="img"
                src={
                  preview instanceof File
                    ? preview.type === "application/pdf"
                      ? pdfIcon
                      : URL.createObjectURL(preview)
                    : typeof preview === "string" && preview.includes(".pdf")
                      ? pdfIcon
                      : preview
                }
                alt="Preview"
                sx={{
                  maxWidth: "70%",
                  maxHeight: "90%",
                  objectFit: "contain",
                  borderRadius: 1,
                }}
              />
              <input
                type="file"
                id={id}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept={accept}
                disabled={isDisable}
              />
            </Box>
          ) : (
            <FileUploadBox
              handleFileChange={handleFileChange}
              id={id}
              accept={accept}
              acceptLabel={acceptLabel}
              isDisable={isDisable}
            />
          )}
        </DropZone>
      </label>

      {file && (
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
              primary={file.name}
              secondary={
                uploadProgress === 100
                  ? "Completed"
                  : `Uploading... ${uploadProgress}%`
              }
            />
          </ListItem>
          {uploadProgress !== 100 && (
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ width: "100%", mt: 1 }}
            />
          )}
        </List>
      )}

      <ImagePreviewModal
        open={imgUrl}
        imgUrl={preview || previewImg}
        onClose={setImgUrl}
        label={label}
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

const FileUploadBox = ({
  handleFileChange,
  id,
  accept,
  acceptLabel,
  isDisable,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 3,
        justifyContent: "center",
        alignItems: "center",
        cursor: isDisable ? "not-allowed" : "pointer",
      }}
    >
      <Typography variant="body2">
        Choose a file, drag & drop or Paste it here
      </Typography>
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ fontSize: "0.75rem" }}
      >
        {acceptLabel} formats, up to 2MB
      </Typography>
      <Button
        variant="outlined"
        component="label"
        size="small"
        disabled={isDisable}
        sx={{
          border: "1px solid var(--secondary-color)",
          color: "var(--secondary-color)",
          fontWeight: 500,
          mt: 1,
          width: {
            xs: "90%",
            md: "50%",
          },
          ":hover": {
            border: "1px solid var(--secondary-color)",
            color: "var(--secondary-color)",
            fontWeight: 500,
          },
        }}
      >
        Upload File
        <input
          type="file"
          id={id}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept={accept}
          disabled={isDisable}
        />
      </Button>
    </Box>
  );
};

export default FileUpload;
