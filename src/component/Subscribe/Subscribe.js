import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { OTPfield, secondInputStyle } from "../Register/Verification";
import DrawerTitle from "../DrawerTitle/DrawerTitle";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";
import { useDispatch } from "react-redux";
import { setAgentLogin } from "../../features/agentRegistrationSlice";
import { maskEmail } from "../../shared/common/functions";
import { Timer } from "../LogIn/LogInPortal";
import useWindowSize from "../../shared/common/useWindowSize";
import * as Yup from "yup";
import { registrationErrText } from "../../shared/common/styles";

const Subscribe = ({ setOpen }) => {
  const { isMobile } = useWindowSize();
  const dispatch = useDispatch();
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdAt, setCreatedAt] = useState(new Date());
  const { jsonHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  useEffect(() => {
    if (isLoading === false && openToast === true) {
      setCreatedAt(new Date());
    }
  }, [isLoading]);

  const validateField = async (field, value) => {
    try {
      await validationSchema.validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    validateField(name, value);
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await validationSchema.validate(
        { email },
        {
          abortEarly: false,
        }
      );
      setErrors({});

      const responseData = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/subscribe/send-email`,
        {
          email: email,
        }
      );

      if (responseData?.data?.data?.verified) {
        showToast("success", responseData?.data?.message, () => {
          setEmail("");
          setOpen(false);
        });
      } else {
        setCount(1);
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        setErrors(validationErrors);
      } else {
        showToast("error", err?.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend
  const handleResendOTP = async () => {
    setIsLoading(true);
    setOtpFields(new Array(6).fill(""));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/subscribe/resend-otp`,
        { email: email },
        jsonHeader()
      );

      showToast("success", response?.data?.message);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "An error occurred";

      showToast("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify
  const handleVerify = async () => {
    try {
      const responseData = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/subscribe/verify-email`,
        {
          email: email,
          otp: otpFields.join(""),
        }
      );
      if (responseData?.data?.success === true) {
        // toast.success(responseData?.data?.message, {
        //   className: "toast-success",
        //   autoClose: 2000,
        // });
        // window.location.reload();

        showToast("success", responseData?.data?.message, () => {
          window.location.reload();
        });
      } else {
        // toast.error(responseData?.data?.message, {
        //   className: "toast-error",
        //   autoClose: 2000,
        // });
        showToast("success", responseData?.data?.message);
      }
    } catch (error) {
      console.error(error?.message);
      showToast("error", error?.response?.data?.message);
    }
  };

  return (
    <Box sx={{ p: "20px 25px" }}>
      <DrawerTitle
        title={"Subscribe Us to Know our updates"}
        text1={"Already have an agent Account?"}
        text2={"Sign In"}
        handleOpen={() => {
          setOpen(false);
          dispatch(setAgentLogin({ isOpen: true }));
        }}
        handleClose={() => {
          setOpen(null);
          setCount(0);
          setEmail("");
          setOtpFields(new Array(6).fill(""));
        }}
      />

      <Box sx={{ width: isMobile ? "75%" : "55%", m: "0 auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            mt: 8,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            mt: 14,
          }}
        >
          <Box sx={{ position: "relative", width: "100%" }}>
            <input
              type="email"
              name="email"
              style={secondInputStyle}
              value={email}
              placeholder="Enter Your Email Address"
              onChange={handleChange}
              disabled={count === 1}
            />
            <span style={registrationErrText}>{errors?.email}</span>
          </Box>

          <Button
            style={{
              backgroundColor: "var(--secondary-color)",
              color: isLoading ? "gray" : "white",
              width: "100%",
              textTransform: "capitalize",
              display: `${count === 0 ? "block" : "none"}`,
            }}
            onClick={() => {
              handleSubscribe();
            }}
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : "Subscribe To Fly Far International"}
          </Button>
        </Box>

        {count === 1 && (
          <>
            <Box
              sx={{
                bgcolor: "#DADCE0",
                height: "4px",
                borderRadius: "5px",
                mt: 3.5,
                width: "50%",
                mb: "4px",
              }}
            />
            <Typography sx={{ fontSize: "13px", color: "var(--dark-gray)" }}>
              Enter OTP
            </Typography>

            <OTPfield otpFields={otpFields} setOtpFields={setOtpFields} />

            <Box>
              <Typography sx={{ pt: "20px", fontSize: "13px" }}>
                A message with a verification code has been sent to{" "}
                <span style={{ color: "var(--primary-color)" }}>
                  {maskEmail(email)}
                </span>
                . Enter the Code to continue within{" "}
                <Timer createdAt={createdAt} />
              </Typography>
            </Box>
            <Typography mt={5} sx={{ fontSize: "13px", textAlign: "center" }}>
              Didn’t get a Verification code ?{" "}
              <span
                onClick={() => handleResendOTP()}
                style={{
                  color: "var(--secondary-color)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Resend OTP
              </span>
            </Typography>
          </>
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: "25px",
          display: `${count === 0 ? "none" : "block"}`,
        }}
      >
        <Button
          style={{
            backgroundColor: "var(--secondary-color)",
            color: isLoading ? "gray" : "white",
            width: "215px",
            textTransform: "capitalize",
          }}
          onClick={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : "Subscribe Us"}
        </Button>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email Address is required"),
});

export default Subscribe;
