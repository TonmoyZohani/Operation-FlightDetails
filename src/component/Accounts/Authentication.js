import {
  Box,
  Button,
  Grid,
  IconButton,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import PageTitle from "../../shared/common/PageTitle";
import SettingsIcon from "@mui/icons-material/Settings";
import MobileHeader from "../MobileHeader/MobileHeader";
import { useOutletContext } from "react-router-dom";
import { isMobile } from "../../shared/StaticData/Responsive";
import { OTPfield, Timer } from "../LogIn/LogInPortal";
import { primaryBtn } from "../../shared/common/styles";
import CircularProgress from "@mui/material/CircularProgress";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";
import { maskEmail } from "../../shared/common/functions";
import OtpResendOptions from "../OtpResendOptions/OtpResendOptions";

const Authentication = () => {
  const { jsonHeader } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [qrcode, setQrcode] = useState(null);
  const [otpData, setOtpData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { agentData } = useOutletContext();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const handleQRCodeGenerator = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/otp/send-otp`,
        { reason: "mfa", email: true, phone: false },
        jsonHeader()
      );

      if (response?.status === 200) {
        setOpen(true);
        setStep(1);
        setOtpData(response?.data?.data);
        showToast("success", response?.data?.message);
      }
    } catch (e) {
      showToast("error", e?.response?.data?.message || "An error occurred");
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

  const handleSendOTPCode = async (type) => {
    setOtpFields(new Array(6).fill(""));
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent/agent-login/${type}-resend-otp`;

    try {
      const response = await axios.post(url, { via: type }, jsonHeader());

      const responseData = response?.data;

      if (responseData?.success) {
        // setLoginInfo({ ...responseData?.data?.auth });
        // setShowResend(false);
        // setResendMethod(type);
        showToast("success", response?.data?.message);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "An error occurred";
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MobileHeader
        title="2FA Authentication"
        labelType="title"
        labelValue={"Authentication Information"}
      />
      <Box
        sx={{
          minHeight: "79vh",
          bgcolor: "white",
          borderRadius: "5px",
          width: { xs: "90%", lg: "100%" },
          mx: "auto",
          mt: { xs: 5, lg: 0 },
        }}
      >
        <PageTitle title={"2FA Authentication"} />

        <Box
          sx={{
            margin: "0 auto",
            padding: "25px",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: { xs: "row", sm: "row", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            minHeight: "73vh",
            gap: 2,
          }}
        >
          {agentData?.security
            ?.filter((item) => item?.adminAccess || item?.control !== "admin")
            .map((item) => (
              <Box
                sx={{
                  border: "1px solid var(--border)",
                  borderRadius: "5px",
                  width: "300px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 2,
                  position: "relative",
                }}
                key={item?.provider}
              >
                <img
                  src={item?.providerImage}
                  style={{
                    width: "60px",
                    height: "60px",
                    margin: "0 auto",
                    bgcolor: "white",
                  }}
                  alt={item?.provider}
                />
                <Box sx={{ width: "100%", px: 1.5 }}>
                  <Typography
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      color: "var(--light-blue)",
                    }}
                  >
                    {(() => {
                      switch (item?.provider) {
                        case "email":
                          return "Email Authentication";
                        case "phone":
                          return "Phone Authentication";
                        case "googleAuthenticator":
                          return "Google Authenticator";
                        default:
                          return "Unknown Authentication";
                      }
                    })()}
                  </Typography>
                  {/* <Box>
                    <Typography>Enable Authenticator</Typography>
                    <FormControlLabel
                      sx={{ ml: 0 }}
                      control={<CustomSwitch checked={item?.enabled} />}
                      labelPlacement="start"
                    />
                  </Box> */}
                </Box>
                {item?.provider === "googleAuthenticator" && (
                  <IconButton
                    onClick={handleQRCodeGenerator}
                    sx={{ position: "absolute", top: 5, right: 5 }}
                  >
                    <Tooltip title="QR Code Scanner">
                      <SettingsIcon />
                    </Tooltip>
                  </IconButton>
                )}
              </Box>
            ))}
        </Box>
      </Box>

      <SwipeableDrawer
        anchor="right"
        open={open}
        PaperProps={{ sx: { width: "50%", zIndex: 999999999 } }}
        onClose={() => setOpen(false)}
      >
        {open && (
          <>
            {step === 1 && (
              <Box
                sx={{
                  p: "20px 25px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "17px",
                    fontWeight: 500,
                  }}
                >
                  Submit OTP For Verification
                </Typography>

                <Box
                  sx={{
                    width: isMobile ? "85%" : "60%",
                    mt: 20,
                    mx: "auto",
                  }}
                >
                  <form onSubmit={handleOtpSubmit}>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        color: "var(--secondary-color)",
                        fontWeight: "600",
                        mb: "5px",
                      }}
                    >
                      Two-Factor Authentication
                    </Typography>
                    <Box
                      sx={{
                        height: "1.5px",
                        width: "50%",
                        bgcolor: "var(--primary-color)",
                        borderRadius: "5px",
                        transition: "width 0.5s",
                      }}
                    />

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
                        <Timer createdAt={new Date()} />
                      </Typography>
                    </Box>

                    <OtpResendOptions
                      handleResend={(via) => handleSendOTPCode(via)}
                      disabledMethods={[]}
                    />

                    <Button
                      disabled={isLoading}
                      type="submit"
                      sx={{ ...primaryBtn, width: "100%" }}
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
              <Box sx={style}>
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

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: 500 },
  bgcolor: "background.paper",
  borderRadius: 2,
  p: 4,
  // boxShadow: 24,
};

export default Authentication;
