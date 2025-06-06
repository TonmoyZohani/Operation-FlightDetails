import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Timer } from "../../component/LogIn/LogInPortal";
import { primaryBtn } from "../../shared/common/styles";

const BookingOtp = ({
  otpFields,
  setOtpFields,
  handleSubmit,
  handleSendBookingOtp,
  operationType,
  createdAt,
  setIsDrawerOpen,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box
      sx={{
        ".MuiFormLabel-root": { fontSize: "14px", top: "1px" },
        ".MuiInputBase-root": { fontSize: "14px" },
        ".swal2-container": {
          ".swal2-popup": { position: "absolute !important", bottom: "35px" },
        },
        overflowY: isLoading?.open && "hidden",
      }}
    >
      <Box
        sx={{
          p: "20px 25px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "var(--secondary-color)",
              fontSize: "25px",
              fontWeight: 500,
            }}
          >
            Verify OTP For{" "}
            <span style={{ color: "var(--primary-color)" }}>{title}</span>
          </Typography>
        </Box>

        <Tooltip title="Close">
          <Box onClick={() => setIsDrawerOpen(false)} sx={iconBox}>
            <CloseIcon
              sx={{
                color: "#fff",
                fontSize: "20px",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          mt: "50px",
        }}
      >
        <Box sx={{ width: "45%" }}>
          {/* Email phone button */}

          <Typography sx={{ fontSize: "12px", mt: "5px" }}>
            Two-Factor Authentication
          </Typography>

          <OTPfield otpFields={otpFields} setOtpFields={setOtpFields} />

          <Box>
            <Typography sx={{ pt: "20px", fontSize: "13px" }}>
              A message with a verification code has been sent to{" "}
              <span style={{ color: "var(--primary-color)" }}>
                Agent's mail.
              </span>
            </Typography>
            <Typography sx={{ pt: "5px", fontSize: "13px" }}>
              OTP will be valid for the next <Timer createdAt={createdAt} />
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--border-color)",
              borderRadius: "5px",
              height: "50px",
              cursor: "pointer",
              p: 1.5,
              mt: "15px",
              bgcolor: "#fff",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
            onClick={() => (operationType ? handleSendBookingOtp(operationType) : handleSendBookingOtp())}
          >
            <EmailIcon sx={{ color: "#5F6368", fontSize: 26, mr: 1 }} />
            <Typography sx={{ fontSize: "14px", color: "#5F6368" }}>
              Resend Verification Code{" "}
              <span style={{ color: "#C4161C" }}>Via Email</span>
            </Typography>
          </Box>

          <Button
            disabled={
              isLoading?.open || otpFields.some((field) => field === "")
            }
            sx={{ ...primaryBtn, width: "100%" }}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const OTPfield = ({ otpFields, setOtpFields }) => {
  const firstInputRef = useRef(null);
  const lastInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleGetOTPvalue = (e, index) => {
    const { key, target } = e;
    const { nextSibling, previousSibling } = target;

    if (key === "Backspace") {
      setOtpFields(otpFields.map((otp, i) => (i === index ? "" : otp)));

      if (!target.value && previousSibling) {
        previousSibling.focus();
      }
      return;
    }

    if (key === "ArrowRight" && nextSibling) {
      nextSibling.focus();
      return;
    }

    if (key === "ArrowLeft" && previousSibling) {
      previousSibling.focus();
      return;
    }
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value)) return;
    setOtpFields(otpFields.map((otp, i) => (i === index ? value : otp)));
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handlePasteOTP = (e) => {
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);

    if (isNaN(pastedData)) {
      return false;
    } else {
      setOtpFields(
        pastedData.split("").concat(new Array(6 - pastedData.length).fill(""))
      );
      if (lastInputRef.current) {
        lastInputRef.current.focus();
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", my: 2.8 }}>
      {otpFields.map((otp, i) => {
        return (
          <input
            style={{
              width: "52px",
              fontSize: "35px",
              textAlign: "center",
              outline: "none",
              border: "2px solid #DADCE0",
              height: "50px",
              borderRadius: "5px",
              color: "var(--dark-gray)",
            }}
            key={i}
            type="text"
            value={otp}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleGetOTPvalue(e, i)}
            onPaste={handlePasteOTP}
            ref={
              i === 0
                ? firstInputRef
                : i === otpFields.length - 1
                  ? lastInputRef
                  : null
            }
            maxLength={1}
            required
          />
        );
      })}
    </Box>
  );
};

const iconBox = {
  bgcolor: "var(--primary-color)",
  borderRadius: "50%",
  height: "32px",
  width: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export default BookingOtp;
