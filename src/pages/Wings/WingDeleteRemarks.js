import CloseIcon from "@mui/icons-material/Close";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import * as yup from "yup";
import { actionBtn, dialogInputAndTextArea } from "../../style/style";

// Define Yup validation schema
const remarksSchema = yup.object().shape({
  remarks: yup
    .string()
    .trim()
    .min(20, "Remarks must be at least 20 characters long")
    .required("Remarks are required"),
});

export const WingDeleteRemarkModal = ({
  handleDeleteWing,
  openRemarks,
  setOpenRemarks,
  darkMode,
}) => {
  const [remarks, setRemarks] = useState(openRemarks?.remarks || "");
  const [error, setError] = useState("");

  const handleValidation = async () => {
    try {
      await remarksSchema.validate({ remarks });
      setError("");
      handleDeleteWing(openRemarks?.id, remarks);
    } catch (validationError) {
      setError(validationError.message);
    }
  };

  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        "& input, & textarea": {
          ...dialogInputAndTextArea,
          bgcolor: darkMode ? "var(--shade-dark-bg)" : "#F6F6F6",
          color: darkMode ? "#9e9e9e" : "#4d4b4b",
        },
        bgcolor: darkMode ? "var(--dark-bg)" : "#fff",
      }}
    >
      <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
        Write Your Reason
      </Typography>

      <Alert
        severity="warning"
        sx={{
          "& .MuiAlert-icon": { color: "red" },
          color: "var(--primary-color)",
          py: 0.3,
          px: 1,
        }}
      >
        <span style={{ fontWeight: 600 }}>Important Notice: </span>
        If you{" "}
        <span style={{ fontWeight: 600 }}>
          Delete this Branch Registration
        </span>{" "}
        All The Registration data For This Branch Will Be Removed.
      </Alert>

      {/* Remarks Input */}
      <textarea
        value={remarks}
        placeholder="Remarks"
        rows={10}
        style={{ resize: "none" }}
        onChange={(e) => setRemarks(e.target.value)}
      />
      {error && (
        <Typography sx={{ color: "red", fontSize: "11px" }}>{error}</Typography>
      )}
      <Typography sx={{ fontSize: "14px", my: 1 }}>Action</Typography>

      <Box sx={{ display: "flex", gap: "10px", height: "45px" }}>
        <Button
          onClick={handleValidation}
          sx={{ ...actionBtn.approve, ...actionBtn, minWidth: "180px" }}
        >
          Submit
        </Button>

        <Button
          onClick={() => setOpenRemarks({ open: false, index: null })}
          sx={{ ...actionBtn.reject, ...actionBtn, minWidth: "46px" }}
        >
          <CloseIcon sx={{ fontSize: "18px" }} />
        </Button>
      </Box>
    </Box>
  );
};
