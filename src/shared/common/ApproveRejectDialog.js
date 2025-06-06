import { Box, Button, Dialog, Typography } from "@mui/material";
import React, { useState } from "react";
import Zoom from "@mui/material/Zoom";
import CloseIcon from "@mui/icons-material/Close";

const ZoomTran = React.forwardRef(function ZoomTran(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export const dialogInputAndTextArea = {
  outline: "none",
  border: "none",
  width: "100%",
  borderRadius: "3px",
  marginTop: "8px",
  padding: "12px 10px",
  textDecoration: "none",
  fontSize: "14px",
};

export const actionBtn = {
  textTransform: "capitalize",
  fontSize: "13px",
  color: "white",
  px: 1.8,

  primary: {
    bgcolor: "var(--primary-color)",
    ":hover": {
      bgcolor: "var(--primary-color)",
    },
  },

  warn: {
    bgcolor: "var(--warn-color)",
    ":hover": {
      bgcolor: "var(--warn-color)",
    },
  },

  approve: {
    bgcolor: "var(--green)",
    ":hover": { bgcolor: "var(--green)" },
  },

  reject: {
    bgcolor: "var(--primary-color)",
    ":hover": { bgcolor: "var(--primary-color)" },
  },
  green: {
    bgcolor: "var(--green)",
    ":hover": { bgcolor: "var(--green)" },
  },
  success: {
    bgcolor: "var(--green)",
    ":hover": { bgcolor: "var(--green)" },
  },
};

const ApproveRejectDialog = ({
  currentData,
  titleRef,
  isDisabled,
  handleChangeSwitch,
  open,
  setOpen,
}) => {
  const [inputValue, setInputValue] = useState("");
  const isMatch = inputValue === currentData?.title;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <Dialog open={open} TransitionComponent={ZoomTran} maxWidth="sm" fullWidth>
      <Box
        sx={{
          px: 3,
          py: 2,
          "& input, & textarea": {
            ...dialogInputAndTextArea,
            bgcolor: "#F6F6F6",
            color: isMatch ? "green" : "red",
          },
          bgcolor: "#fff",
        }}
      >
        <Typography sx={{ fontSize: "0.99rem", mt: 2, fontWeight: 500 }}>
          Please Type{" "}
          <span
            style={{
              color: "var(--primary-color)",
              userSelect: "none",
              fontWeight: 500,
            }}
            onCopy={(e) => e.preventDefault()}
          >
            {currentData?.title}{" "}
          </span>
          to complete this operation in the below section
        </Typography>
        <textarea
          ref={titleRef}
          placeholder="Type here..."
          rows={2}
          style={{ resize: "none" }}
          value={inputValue}
          onChange={handleInputChange}
        />

        <Typography sx={{ fontSize: "14px", my: 1 }}>Action</Typography>

        <Box sx={{ display: "flex", gap: "10px", height: "45px" }}>
          <Button
            disabled={isDisabled || !isMatch}
            onClick={handleChangeSwitch}
            sx={{ ...actionBtn.approve, ...actionBtn, minWidth: "180px" }}
          >
            {currentData?.title}
          </Button>
          <Button
            disabled={isDisabled}
            onClick={() => {
              setInputValue("");
              setOpen(false);
            }}
            sx={{ ...actionBtn.reject, ...actionBtn, minWidth: "46px" }}
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ApproveRejectDialog;
