import {
  Box,
  Button,
  IconButton,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { OTPfield, Timer } from "../../../component/LogIn/LogInPortal";
import { isMobile } from "../../../shared/StaticData/Responsive";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";
import CircularProgress from "@mui/material/CircularProgress";
import { maskEmail } from "../../../shared/common/functions";
import { primaryBtn } from "../../../shared/common/styles";
import { iconBox } from "../../../component/Register/RegisterPortal";
import CloseIcon from "@mui/icons-material/Close";
import { addMinutes } from "date-fns";

const GoogleAuthenticator = ({ isLoading, setIsLoading, showToast }) => {
  const { jsonHeader } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [qrcode, setQrcode] = useState(null);
  const [otpData, setOtpData] = useState({});
  const [isOTPValid, setIsOTPValid] = useState(true);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    const checkOTPExpiry = () => {
      const expiryTime = addMinutes(new Date(), 5);
      setIsOTPValid(expiryTime > new Date());
    };

    checkOTPExpiry();

    const interval = setInterval(checkOTPExpiry, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleQRCodeGenerator = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/otp/send-otp`,
        { reason: "mfa", email: true, phone: false },
        jsonHeader()
      );

      if (response?.status === 200) {
        setStep(1);
        setOtpData(response?.data?.data);
        setShowResend(false);
        showToast("success", response?.data?.message, () => {
          setOpen(true);
        });
      }
    } catch (e) {
      showToast("error", e?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/2fa/generate-qr`,
        {
          otp: otpFields.join(""),
        },
        jsonHeader()
      );

      setQrcode(response?.data);
      showToast("success", "Successfully Verified", () => {
        setStep(2);
      });
    } catch (e) {
      showToast("error", e?.response?.data?.message || "An error occured");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <IconButton
        onClick={handleQRCodeGenerator}
        sx={{ position: "absolute", top: 5, right: 5 }}
      >
        <Tooltip title="QR Code Scanner">
          <SettingsIcon />
        </Tooltip>
      </IconButton>

      <SwipeableDrawer
        anchor="right"
        open={open}
        PaperProps={{ sx: { width: "40%", zIndex: 999999999 } }}
      >
        {open && (
          <>
            {step === 1 && (
              <Box sx={{ p: "20px 25px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--secondary-color)",
                      fontSize: "25px",
                      fontWeight: 500,
                    }}
                  >
                    Submit OTP For Verification
                  </Typography>

                  <Box onClick={() => setOpen(false)} sx={iconBox}>
                    <CloseIcon
                      sx={{
                        color: "white",
                        fontSize: "20px",
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    height: "87vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <form
                    style={{ width: isMobile ? "85%" : "60%" }}
                    onSubmit={handleOtpSubmit}
                  >
                    <Box
                      sx={{
                        height: "4px",
                        width: "50%",
                        bgcolor: "#C4C4C4",
                        borderRadius: "5px",
                        transition: "width 0.5s",
                      }}
                    />
                    <Typography sx={{ fontSize: "12px", mt: "5px" }}>
                      Two-Factor Authentication
                    </Typography>

                    <OTPfield
                      otpFields={otpFields}
                      setOtpFields={setOtpFields}
                    />

                    <Box>
                      <Typography sx={{ pt: "20px", fontSize: "13px" }}>
                        A message with a verification code has been sent to{" "}
                        <span style={{ color: "var(--primary-color)" }}>
                          {otpData?.email.includes("@")
                            ? maskEmail(otpData?.email)
                            : otpData?.email.slice(0, 5) +
                              "******" +
                              otpData?.email.slice(11, 13)}
                        </span>
                        . Enter the Code to continue within{" "}
                        <Timer
                          setShowResend={setShowResend}
                          createdAt={new Date()}
                        />{" "}
                        <span
                          style={{
                            visibility:
                              showResend === false ? "visible" : "hidden",
                          }}
                        >
                          You can resend the code in 4 minutes.
                        </span>
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "13px",
                        textAlign: "center",
                        visibility: showResend ? "visible" : "hidden",
                      }}
                    >
                      Didn’t get a Verification code ?{" "}
                      <span
                        onClick={() => handleQRCodeGenerator()}
                        style={{
                          color: isLoading ? "gray" : "var(--secondary-color)",
                          textDecoration: "underline",
                          cursor: "pointer",
                          pointerEvents: isLoading && "none",
                          fontWeight: "600",
                        }}
                      >
                        Resend OTP
                      </span>
                    </Typography>

                    <Button
                      disabled={isLoading}
                      type="submit"
                      sx={{
                        ...primaryBtn,
                        width: "100%",
                        mt: 8,
                        visibility: isOTPValid ? "visible" : "hidden",
                      }}
                      // onClick={() => handleOtpSubmit()}
                    >
                      {isLoading ? (
                        <CircularProgress
                          size={20}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </form>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: { xs: "90%", md: 500 },
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={qrcode ? qrcode?.match(/src="([^"]+)"/)?.[1] : ""}
                    style={{ width: "250px", height: "250px" }}
                  />
                </Box>
                <Typography
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Scan This QR Code To Connect{" "}
                  <span sx={{ color: "var(--primary-color)" }}>
                    Google Authenticator
                  </span>
                </Typography>
              </Box>
            )}
          </>
        )}
      </SwipeableDrawer>
    </>
  );
};

export default GoogleAuthenticator;
