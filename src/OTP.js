import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const OTP = ({ open, handleClose, handleVerify }) => {
  const location = useLocation();
  const otpData = location?.state?.otpData || {};
  const firstInputRef = useRef(null);
  const lastInputRef = useRef(null);
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));

  const handleSubmit = (e) => {
    e.preventDefault();

    const otpString = otpFields.join("").replace(",", "");
  
    handleVerify(otpString);
  
    setOtpFields(new Array(6).fill(""));
  };

  function calculateRemainingTime() {
    const timeDifference =
      new Date(otpData?.time).getTime() + 300000 - new Date().getTime();

    return Math.max(timeDifference, 0);
  }

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const diffrence = calculateRemainingTime();
      if (diffrence === 0) {
        clearInterval(timerInterval);
        firstInputRef.current.focus();
        setOtpFields(new Array(6).fill(""));
      } else {
        setRemainingTime(calculateRemainingTime());
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleGetOTPvalue = (e, index) => {
    if (e.key === "Backspace") {
      if (!e.target.value && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }

      setOtpFields([...otpFields.map((otp, i) => (i === index ? "" : otp))]);

      return;
    }

    const otpValue = e.target.value;

    if (isNaN(otpValue)) {
      return false;
    }

    setOtpFields([
      ...otpFields.map((otp, i) => (i === index ? otpValue : otp)),
    ]);

    if (otpValue && e.target.nextSibling) {
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
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "70%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
        }}>
        <Box
          sx={{
            bgcolor: "white",
            width: "26%",
            p: "22px 30px",
            borderRadius: "10px",
            minHeight: "350px",
          }}>
          <Typography sx={{ fontSize: "23px", color: "var(--primary-color)" }}>
            OTP Verification
          </Typography>
          <Typography
            sx={{ fontSize: "14px", color: "var(--text-medium)", mt: 1 }}>
            Two-Factor Authentication
          </Typography>

          {/* --------- OTP Input Area --------- */}
          <Box sx={{ display: "flex", justifyContent: "space-between", my: 3 }}>
            {otpFields.map((otp, i) => {
              return (
                <input
                  style={{
                    width: "12%",
                    fontSize: "35px",
                    textAlign: "center",
                    outline: "none",
                    border: "2px solid #c7c7c7",
                    height: "58px",
                    borderRadius: "5px",
                  }}
                  key={i}
                  type="text"
                  value={otp}
                  onChange={(e) => handleGetOTPvalue(e, i)}
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
                />
              );
            })}
          </Box>

          <Box>
            {/* --------- Text and Timer --------- */}
            {remainingTime < 1000 ? (
              <Typography
                sx={{ fontSize: "14px", color: "var(--text-medium)" }}>
                Oops! The time to enter the verification code has expired.
                Please request a new verification code.
              </Typography>
            ) : (
              <Typography
                sx={{ fontSize: "14px", color: "var(--text-medium)" }}>
                A message with a verification code has been sent to your email address
                <span style={{ color: "#e34825" }}>
                  {otpData?.via?.slice(0, 5)}
                  ••••••{otpData?.via?.slice(-2)}
                </span>
                . Enter the Code withing
                <br/>
                <span
                  style={{
                    color: "var(--secondary-color)",
                    fontWeight: "500",
                  }}>
                  5 minutes
                </span>
              </Typography>
            )}

            {/* --------- Submit Area --------- */}
            <Button
              onClick={handleSubmit}
              disabled={remainingTime < 1000 || otpFields.join("").length < 6}
              sx={{
                border: "1px solid #e34825",
                width: "100%",
                bgcolor: "var(--primary-color)",
                color: "white",
                ":hover": {
                  bgcolor: "var(--primary-color)",
                },
                mt: "70px",
              }}>
              Verify OTP
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default OTP;
