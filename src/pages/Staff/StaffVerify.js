import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import TextsmsIcon from "@mui/icons-material/Textsms";
import { Box, Button, Slide, Tooltip, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomToast from "../../component/Alert/CustomToast";
import { Timer } from "../../component/LogIn/LogInPortal";
import { OTPfield } from "../../component/Register/Verification";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import { primaryBtn } from "../../shared/common/styles";

const otpMethod = [
  {
    via: "phone",
    label: "Via SMS",
    text: "Resend verification code",
    icon: <TextsmsIcon sx={{ color: "#5F6368", fontSize: "30px" }} />,
  },
  {
    via: "email",
    label: "Via Email",
    text: "Resend verification code",
    icon: <EmailIcon sx={{ color: "#5F6368", fontSize: "32px" }} />,
  },
  {
    via: "",
    label: "More Options",
    text: "Contact for",
    icon: <InfoIcon sx={{ color: "#5F6368", fontSize: "32px" }} />,
  },
];

const StaffVerify = ({
  setIsDrawerOpen,
  staff,
  setStaff,
  emailVerified,
  email,
  phone,
  stage,
}) => {
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [createdAt, setCreatedAt] = useState(new Date(staff?.createdAt));
  const resendMethod = useState("");
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [initialState, setInitialState] = useState(
    emailVerified === "email_unverified" ? 0 : 1
  );

  const isFirstRender = useRef(true);

  const queryClient = useQueryClient();

  function obfuscateEmail(email) {
    const [name, domain] = email?.split("@");
    const shortenedName = name.slice(0, 4) + ".......";
    return `${shortenedName}@${domain}`;
  }

  // useEffect(() => {
  //   if (
  //     staff?.status === "email_unverified" ||
  //     staff?.status === "phone_unverified"
  //   ) {
  //     handleResendOTP();
  //   }
  // }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (stage === "table") {
      handleResendOTP();
    }
  }, [stage]);

  const handleResendOTP = async (via) => {
    const url =
      via === "email" || staff?.status === "email_unverified"
        ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/staffs/otp/email/resend/${staff?.id}`
        : `${process.env.REACT_APP_BASE_URL}/api/v1/user/staffs/otp/phone/resend/${staff?.id}`;

    try {
      setIsLoading({
        open: true,
        message:
          initialState === 0
            ? "Sending OTP in Your Email"
            : "Sending OTP in Your Phone",
      });
      const response = await axios.patch(url, {}, jsonHeader());
      if (response?.data?.success) {
        const errorMessage = response?.data?.message || "Success";
        showToast("success", errorMessage);
        setStaff((prev) => ({
          ...prev,
          ...response?.data?.data,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        }));
        setCreatedAt(moment().format("YYYY-MM-DD HH:mm:ss"));
        setOtpFields(new Array(6).fill(""));
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "An error occurred";
      showToast("error", errorMessage);
    } finally {
      setIsLoading({
        open: false,
        message: "",
      });
    }
  };

  // Staff Email OTP
  const handleOtpSubmit = async () => {
    setIsLoading(true);

    const body = {
      otp: otpFields.join(""),
    };

    const url =
      initialState === 0
        ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/staffs/otp/email/verify/${staff?.id}`
        : `${process.env.REACT_APP_BASE_URL}/api/v1/user/staffs/otp/phone/verify/${staff?.id}`;
    try {
      setIsLoading({
        open: true,
        message:
          initialState === 0
            ? "Verifing OTP in Your Email"
            : "Verifing OTP in Your Phone",
      });
      const response = await axios.patch(url, body, jsonHeader());

      if (response?.data?.success) {
        if (initialState === 0) {
          queryClient.invalidateQueries({ queryKey: ["staff"] });
          setInitialState(1);
          setStaff((prev) => ({
            ...prev,
            ...response?.data?.data,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          }));
          setCreatedAt(moment().format("YYYY-MM-DD HH:mm:ss"));
          setOtpFields(new Array(6).fill(""));
        } else if (initialState === 1) {
          queryClient.invalidateQueries({ queryKey: ["staff"] });
          showToast("success", response?.data?.message, () => {
            navigate("/dashboard/staffManagement/active");
            setIsDrawerOpen(false);
          });
        }
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "An error occurred";
      showToast("error", errorMessage);
    } finally {
      setIsLoading({
        open: false,
        message: "",
      });
    }
  };

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
            {initialState === 0
              ? "Verify your Staff Email"
              : "Verify your Staff Phone"}
          </Typography>
        </Box>

        <Tooltip title="Close">
          <Box onClick={() => setIsDrawerOpen(false)} sx={iconBox}>
            <CloseIcon
              sx={{
                color: "white",
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
        }}
      >
        <Box sx={{ width: "50%" }}>
          <Box
            sx={{
              bgcolor: initialState === 1 ? "#1ba84a" : "var(--primary-color)",
              borderRadius: "4px",
              mb: 5,
              display: "flex",
            }}
          >
            <Button
              sx={{
                ...verifyTypeBtn,
                border: "1px solid var(--primary-color)",
                borderColor:
                  initialState === 1 ? "#1ba84a" : "var(--primary-color)",
                bgcolor: initialState === 1 ? "#1ba84a" : "white",
                color: initialState === 1 ? "white" : "var(--primary-color)",
                ":hover": {
                  bgcolor: initialState === 1 ? "#1ba84a" : "white",
                },
              }}
            >
              Email
            </Button>
            <Button
              sx={{
                ...verifyTypeBtn,
                border: "1px solid var(--primary-color)",
                color: initialState === 1 ? "var(--primary-color)" : "white",
                bgcolor: initialState === 1 ? "white" : "var(--primary-color)",
                ":hover": {
                  color: initialState === 1 ? "white" : "var(--primary-color)",
                  bgcolor:
                    initialState === 1 ? "var(--primary-color)" : "white",
                },
              }}
            >
              Phone
            </Button>
          </Box>
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

          <OTPfield otpFields={otpFields} setOtpFields={setOtpFields} />

          <Box>
            <Typography sx={{ pt: "20px", fontSize: "13px" }}>
              A message with a verification code has been sent to{" "}
              <span style={{ color: "var(--primary-color)" }}>
                {initialState === 0
                  ? obfuscateEmail(email)
                  : `${phone?.slice(0, 7)}.......${phone?.slice(-2)}`}
              </span>
            </Typography>
            <Typography sx={{ fontSize: "13px", pt: "5px" }}>
              . Enter the Code to continue within{" "}
              <Timer createdAt={createdAt} />
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 3,
              mt: 3.8,
            }}
          >
            {otpMethod?.map((method, i) => {
              const isDisabled =
                (staff?.status === "phone_unverified" &&
                  method.via !== "phone") ||
                (staff?.status === "email_unverified" &&
                  method.via !== "email") ||
                method.via === "";
              return (
                <Box
                  key={i}
                  sx={{
                    width: "28%",
                    border: "1px solid",
                    borderColor:
                      resendMethod === method?.via && resendMethod
                        ? "var(--primary-color)"
                        : "var(--border-color)",
                    height: "100px",
                    borderRadius: "5px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                    opacity: isDisabled ? 0.5 : 1,
                    pointerEvents: isDisabled ? "none" : "auto",
                  }}
                >
                  <Box
                    onClick={() => handleResendOTP(method?.via)}
                    sx={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                  >
                    {React.cloneElement(method?.icon)}
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#5F6368",
                        px: "5px",
                      }}
                    >
                      {method?.text}{" "}
                      <span style={{ color: "#C4161C" }}>{method?.label}</span>
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Button
            sx={{ ...primaryBtn, width: "100%" }}
            onClick={() => handleOtpSubmit()}
          >
            Submit
          </Button>
        </Box>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      {isLoading?.open && <StaffLoader isLoading={isLoading} />}
    </Box>
  );
};

export const StaffLoader = ({ isLoading }) => {
  return (
    <Box
      sx={{
        bgcolor: "#00000080",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: "0",
        zIndex: "100",
      }}
    >
      <Box sx={{ height: "100vh", position: "relative", zIndex: 10 }}>
        <Slide direction="up" in={isLoading?.open}>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "80px",
              bgcolor: "white",
              boxShadow: 3,
              py: 2,
              px: 5,
              zIndex: "100",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 500 }}>
                We Are {isLoading?.message}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "var(--dark-gray)" }}>
                Please Wait For A Moment
              </Typography>
            </Box>

            <CircularProgress sx={{ color: "var(--primary-color)" }} />
          </Box>
        </Slide>
      </Box>
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

const verifyTypeBtn = {
  textTransform: "capitalize",
  fontSize: "13px",
  width: "100%",
  height: "40px",
};

export default StaffVerify;
