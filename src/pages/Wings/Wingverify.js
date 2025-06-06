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

const WingVerify = ({
  setIsDrawerOpen,
  id,
  email,
  phone,
  emailVerified,
  branchData,
  setBranchData,
  stage,
}) => {
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const [initialState, setInitialState] = useState(
    emailVerified === "email_unverified" ? 0 : 1
  );
  const isFirstRender = useRef(true);
  const [isLoading, setIsLoading] = useState({
    open: false,
    message: "",
  });
  const [createdAt, setCreatedAt] = useState(new Date(branchData?.createdAt));
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const queryClient = useQueryClient();

  function obfuscateEmail(email) {
    const [name, domain] = email.split("@");
    const shortenedName = name.slice(0, 4) + ".......";
    return `${shortenedName}@${domain}`;
  }

  const handleResendOTP = async () => {
    try {
      setIsLoading({
        open: true,
        message:
          initialState === 0
            ? "Sending OTP in Your Email"
            : "Sending OTP in Your Phone",
      });
      const url =
        initialState === 0
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches/otp/email/resend/${id}`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches/otp/phone/resend/${id}`;

      const response = await axios.patch(url, {}, jsonHeader());

      if (response?.data?.success) {
        showToast("success", response?.data?.message || "Success");

        setBranchData((prevData) => {
          const newData = {
            ...prevData,
            ...(response?.data?.data || {}),
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          return newData;
        });

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (stage === "table") {
      handleResendOTP();
    }
  }, [stage]);

  // Wing Email OTP
  const handleOtpSubmit = async () => {
    const body = {
      otp: otpFields.join(""),
    };

    const url =
      initialState === 0
        ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches/otp/email/verify/${id}`
        : `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches/otp/phone/verify/${id}`;

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
          queryClient.invalidateQueries({ queryKey: ["allWing"] });
          showToast("success", response?.data?.message);
          setInitialState(1);
          setBranchData((prevData) => ({
            ...prevData,
            ...response?.data?.data,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          }));
          setCreatedAt(moment().format("YYYY-MM-DD HH:mm:ss"));
          setOtpFields(new Array(6).fill(""));
        } else if (initialState === 1) {
          queryClient.invalidateQueries({ queryKey: ["allWing"] });
          showToast("success", response?.data?.message, () => {
            navigate("/dashboard/wingManagement/status/active");
            setIsDrawerOpen(false);
          });
        }
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message);
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
              ? "Verify your Branch Email"
              : "Verify your Branch Phone"}
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
        <Box>
          {/* Email phone button */}
          <Box
            sx={{
              bgcolor: initialState === 1 ? "#1ba84a" : "var(--primary-color)",
              borderRadius: "4px",
              mb: 5,
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
                  : `${phone.slice(0, 7)}.......${phone.slice(-2)}`}
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
              mt: 3.8,
            }}
          >
            {otpMethod.map((method, i) => {
              const isDisabled =
                (branchData?.status === "phone_unverified" &&
                  method.via !== "phone") ||
                (branchData?.status === "email_unverified" &&
                  method.via !== "email") ||
                method.via === "";
              return (
                <Box
                  key={i}
                  sx={{
                    width: "28%",
                    border: "1px solid",
                    borderColor: "var(--border-color)",
                    height: "100px",
                    borderRadius: "5px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    opacity: isDisabled ? 0.5 : 1,
                    pointerEvents: isDisabled ? "none" : "auto",
                  }}
                >
                  <Box
                    onClick={() => handleResendOTP(method?.via)}
                    sx={{ cursor: "pointer" }}
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
            disabled={isLoading?.open}
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
      {isLoading?.open && <WingLoader isLoading={isLoading} />}
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

export const WingLoader = ({ isLoading }) => {
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
  width: "50%",
  height: "40px",
};

export default WingVerify;
