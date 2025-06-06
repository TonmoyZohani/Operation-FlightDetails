import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { useRef, useEffect, useState } from "react";
import Magnifier from "react-magnifier";
import { useDispatch } from "react-redux";
import PassportImg from "../../assets/svg/passport.svg";
import {
  setPassengerPassportCopy,
  setPreview,
} from "../AirBooking/airbookingSlice";
import FileUploadLoader from "../Loader/FileUploadLoader";

const PassportFileUpload = ({
  onFileChange,
  id,
  isLoading,
  preview,
  passengerType,
  index,
  setPassportFileBlob,
}) => {
  // const flightBooking = useSelector((state) => state.flightBooking);
  const dispatch = useDispatch();
  const dropZoneRef = useRef(null);
  const [active, setActive] = useState(false);

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    if (newFile && validateFile(newFile)) {
      onFileChange(newFile);
      if (newFile.type.startsWith("image/")) {
        dispatch(setPreview(URL.createObjectURL(newFile)));
      }
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 2 * 1024 * 1024;
    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      alert("File type must be JPEG, JPG, or PNG and size up to 2MB.");
      return false;
    }
    return true;
  };

  const handleDeleteFile = () => {
    setPassportFileBlob(null);
    dispatch(
      setPassengerPassportCopy({
        passengerType: passengerType.toLowerCase(),
        index,
        passportImage: null,
      })
    );
  };

  const DropZone = styled(Box)({
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    height: "100%",
  });

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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFile = event.dataTransfer.files[0];
    if (newFile && validateFile(newFile)) {
      onFileChange(newFile);
      if (newFile.type.startsWith("image/")) {
        dispatch(setPreview(URL.createObjectURL(newFile)));
      }
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        border: `1px solid ${active ? "#1976d2" : "var(--border)"}`,
        bgcolor: active && "#EAF4FF",
        height: "400px",
        width: {
          xs: "100%",
          md: "90%",
        },
        borderRadius: "7px",
        p: 3,
        mt: 3,
      }}
      ref={dropZoneRef}
      onClick={() => setActive(true)}
    >
      {isLoading ? (
        <FileUploadLoader />
      ) : preview ? (
        <Box
          sx={{
            overflow: "hidden",
            height: {
              xs: "100%",
              lg: "100%",
            },
            width: "100%",
          }}
        >
          <label htmlFor={id}>
            <Magnifier
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                height: "90%",
                borderRadius: "8px",
                objectFit: "fill",
              }}
              mgWidth={200}
              mgHeight={200}
              mgShape="square"
              zoomFactor={3}
            />
            <input
              type="file"
              id={id}
              hidden
              onChange={handleFileChange}
              accept=".jpeg, .jpg, .png"
            />
          </label>
        </Box>
      ) : (
        <label
          htmlFor={id}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <DropZone onDrop={handleDrop} onDragOver={handleDragOver}>
            <Box sx={{ height: "100%", width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <img
                  src={PassportImg}
                  style={{
                    height: "90%",
                    width: "100%",
                    objectFit: "fill",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    px: 3,
                    textAlign: "center",
                    color: "#CDCDCD",
                    lineHeight: "14px",
                    pt: 1,
                  }}
                >
                  Click, Paste or Drag And Drop Your{" "}
                  <span style={{ color: "var(--primary-color)" }}>
                    Passport
                  </span>{" "}
                  Here (support: jpeg, jpg, png.)
                </Typography>
              </Box>
            </Box>
          </DropZone>
          <input
            type="file"
            id={id}
            hidden
            onChange={handleFileChange}
            accept=".jpeg, .jpg, .png"
          />
        </label>
      )}
      {!isLoading && preview && (
        <Tooltip
          title="Delete Image"
          sx={{
            position: "absolute",
            bottom: "-25px",
            right: "-25px",
            zIndex: 1300,
          }}
        >
          <IconButton onClick={handleDeleteFile}>
            <DeleteIcon sx={{ color: "var(--primary-color)" }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default PassportFileUpload;
