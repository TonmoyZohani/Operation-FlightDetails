import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Alert, Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { addMinutes } from "date-fns";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAgentData } from "../../features/agentRegistrationSlice";
import useToast from "../../hook/useToast";
import { maskEmail, textFieldProps } from "../../shared/common/functions";
import { secondaryBtn, sharedInputStyles } from "../../shared/common/styles";
import CustomToast from "../Alert/CustomToast";
import { calculateTimeRemaining } from "../Dashboard/OperationCalendar";
import {
  buttonStyleEye,
  generalInfoValidationSchema,
} from "../Register/GeneraInfo";
import { Timer } from "./LogInPortal";
import OtpResendOptions from "../OtpResendOptions/OtpResendOptions";

const ForgotOtp = ({ setStep, forgotIsOpen, setForgotIsOpen }) => {
  const [formValues, setFormValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const agent = useSelector((state) => state.agentRegistration.agent);
  const { phone, isPhoneVerified, isActive, isEditEmail, isEditPhone } = agent;
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({ email: "" });
  const [timeRemaining, setTimeRemaining] = useState("");
  const [currentSection, setCurrentSection] = useState("email");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/reset-pass`;

    try {
      const response = await axios.post(
        url,
        { newPassword: formValues?.password },
        {
          headers: { authorization: `Bearer ${userData?.token}` },
        }
      );
      const responseData = response?.data;

      if (responseData?.success === true) {
        showToast("success", responseData?.message, () => {
          setStep(1);
          setForgotIsOpen(false);
        });
      }
    } catch (e) {
      console.error(e.message);
      const message = e?.response?.data?.message || "An error occurred";

      showToast("error", message, () => {
        const errorData = e.response?.data?.error[0];
        if (errorData?.status === "pending") {
          setStep(1);
          setForgotIsOpen(false);
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTPCode = async (type) => {
    let body;

    if (type === "email") {
      body = { email: formInfo?.email, type };
    } else {
      body = { phone, type };
    }

    setResendLoading(true);
    setOtpFields(new Array(6).fill(""));

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent/agent-login/${type}-resend-otp`;
    const forgotUrl = `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/resend-otp`;

    try {
      const response = await axios.post(forgotIsOpen ? forgotUrl : url, body, {
        headers: { authorization: `Bearer ${userData?.token}` },
      });

      const responseData = response?.data;

      if (responseData?.success === true) {
        setUserData({
          ...userData,
          ...responseData?.data?.auth,
          email: formInfo?.email,
        });
        showToast("success", responseData?.message, () => {
          if (isEditEmail) {
            dispatch(setAgentData({ ...agent, isEditEmail: false }));
          }
          if (isEditPhone) {
            dispatch(setAgentData({ ...agent, isEditPhone: false }));
          }
        });
      }
    } catch (e) {
      const message = e?.response?.data?.message || "An error occurred";
      showToast("error", message);
      setUserData({ ...userData, createdAt: "" });
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/verify-reset-pass-otp`;

    setOtpFields(new Array(6).fill(""));
    try {
      const response = await axios.post(
        url,
        {
          otp: otpFields.join(""),
        },
        { headers: { Authorization: `Bearer ${userData?.token}` } }
      );
      const responseData = response?.data;
      if (responseData?.success) {
        showToast("success", responseData?.message, () => {
          setIsPasswordOpen(true);
          setCurrentSection("password");
          setUserData({
            ...userData,
            ...responseData?.data?.auth,
          });
        });
      }
    } catch (e) {
      showToast("error", e?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendForgotPasswordOtp = async (e) => {
    e.preventDefault();

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/forgot-pass`;

    try {
      setLoading(true);
      const response = await axios.post(url, { email: formInfo?.email });

      const responseData = response?.data?.data?.auth;

      if (response?.status === 200) {
        setUserData({ ...responseData, email: formInfo?.email });
        showToast("success", response?.data?.message);
        setCurrentSection("otp");
      }
    } catch (err) {
      const message = err?.response?.data?.message || "An error occurred";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const createdAt = moment(
      userData?.createdAt,
      "YYYY-MM-DD HH:mm:ss"
    ).toDate();
    const expiryTime = addMinutes(createdAt, 5);
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(expiryTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  return (
    <Box>
      <Box sx={{ width: "55%", m: "0 auto" }}>
        <Box sx={{ mt: 14 }}>
          <Typography
            sx={{
              fontSize: "20px",
              color: "var(--secondary-color)",
              fontWeight: "600",
              mb: "5px",
            }}
          >
            Forgot Password
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
        </Box>

        <Box
          sx={{
            bgcolor: isActive === 1 ? "trasparent" : "#184875",
            borderRadius: "4px",
            my: "40px",
          }}
        >
          <Button
            sx={{
              ...verifyTypeBtn,
              border: "1px solid #184875",
              borderColor:
                currentSection === "email"
                  ? "var(--primary-color)"
                  : "trasparent",
              bgcolor: currentSection === "email" ? "white" : "trasparent",
              color:
                currentSection === "email" ? "var(--primary-color)" : "white",
              ":hover": {
                bgcolor: currentSection === "email" ? "white" : "trasparent",
              },
              fontWeight: 600,
            }}
            onClick={() => setCurrentSection("email")}
          >
            Email
          </Button>
          <Button
            sx={{
              ...verifyTypeBtn,
              border: "1px solid #184875",
              borderColor:
                currentSection === "otp"
                  ? "var(--primary-color)"
                  : "trasparent",
              bgcolor: currentSection === "otp" ? "white" : "trasparent",
              color:
                currentSection === "otp" ? "var(--primary-color)" : "white",
              ":hover": {
                bgcolor: currentSection === "otp" ? "white" : "trasparent",
              },
              "&.Mui-disabled": {
                color: "#fff",
              },
              fontWeight: 600,
            }}
            disabled={!userData?.email}
            onClick={() => setCurrentSection("otp")}
          >
            Verify With OTP
          </Button>
          <Button
            sx={{
              ...verifyTypeBtn,
              border: "1px solid #184875",
              borderColor:
                currentSection === "password"
                  ? "var(--primary-color)"
                  : "trasparent",
              bgcolor: currentSection === "password" ? "white" : "trasparent",
              color:
                currentSection === "password"
                  ? "var(--primary-color)"
                  : "white",
              ":hover": {
                bgcolor: currentSection === "password" ? "white" : "trasparent",
              },
              "&.Mui-disabled": {
                color: "#fff",
              },
            }}
            disabled={!isPasswordOpen}
          >
            Password
          </Button>
        </Box>

        {currentSection === "email" && (
          <EmailVerificationField
            agent={agent}
            isLoading={loading}
            handleSendOTPCode={handleSendOTPCode}
            handleFotgotPassword={handleSendForgotPasswordOtp}
            formInfo={formInfo}
            setFormInfo={setFormInfo}
          />
        )}

        {currentSection === "otp" && (
          <Box sx={{ width: "99%", m: "0 auto" }}>
            <Typography
              sx={{ fontSize: "13px", color: "var(--dark-gray)", mt: 3 }}
            >
              Enter OTP
            </Typography>
            <OTPfield otpFields={otpFields} setOtpFields={setOtpFields} />
            <Typography sx={{ fontSize: "13px", color: "var(--dark-gray)" }}>
              {userData?.createdAt && (
                <>
                  OTP has been sent to{" "}
                  <span
                    style={{ color: "var(--secondary-color)", fontWeight: 600 }}
                  >
                    {maskEmail(userData?.email)}
                  </span>
                  .
                </>
              )}
            </Typography>
            <Typography
              sx={{ fontSize: "13px", color: "var(--dark-gray)", mt: 1 }}
            >
              {userData?.createdAt && (
                <>
                  The code will expire in{" "}
                  <Timer createdAt={new Date(userData?.createdAt)} />
                </>
              )}
            </Typography>

            <OtpResendOptions
              handleResend={(via) => handleSendOTPCode(via)}
              disabledMethods={["phone"]}
            />

            {/* {timeRemaining?.text === "Time Expired" && ( */}
            {/* <Typography mt={5} sx={{ fontSize: "13px", textAlign: "center" }}>
              Didn't get a Verification code ?{" "}
              <Button
                onClick={() => handleSendOTPCode("email")}
                disabled={resendLoading}
                sx={{
                  color: "var(--secondary-color)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {resendLoading ? "Loading..." : "Resend OTP"}
              </Button>
            </Typography> */}
            {/* )} */}
          </Box>
        )}

        {currentSection === "password" && (
          <ResetPasswordForm
            formValues={formValues}
            setFormValues={setFormValues}
          />
        )}
      </Box>

      {currentSection === "otp" && (
        <Box sx={{ width: "55%", margin: "20px auto" }}>
          <Button
            onClick={handleVerifyOTP}
            style={{
              backgroundColor: "#184875",
              color: "white",
              width: "100%",
              textTransform: "capitalize",
              height: "45px",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Please Wait..." : "Verify OTP"}
          </Button>
        </Box>
      )}

      {currentSection === "password" && (
        <Box sx={{ width: "55%", margin: "20px auto" }}>
          <Button
            onClick={handleResetPassword}
            style={{
              backgroundColor: "#184875",
              color: "white",
              width: "100%",
              textTransform: "capitalize",
              height: "45px",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Please Wait..." : "Reset Password"}
          </Button>
        </Box>
      )}

      <Box sx={{ position: "absolute", bottom: "25px", ml: "25px" }}>
        {/* {currentSection === "email" && (
          <Button
            onClick={handleSendForgotPasswordOtp}
            style={{
              backgroundColor: "var(--secondary-color)",
              color: "white",
              width: "215px",
              textTransform: "capitalize",
            }}
            disabled={loading}
          >
            {loading ? "Please Wait..." : "Send OTP"}
          </Button>
        )} */}

        {/* {currentSection === "password" && (
          <Button
            onClick={handleResetPassword}
            style={{
              backgroundColor: "var(--secondary-color)",
              color: "white",
              width: "215px",
              textTransform: "capitalize",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Please Wait..." : "Reset Password"}
          </Button>
        )} */}
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
const EmailVerificationField = ({
  agent,
  isLoading,
  handleFotgotPassword,
  formInfo,
  setFormInfo,
}) => {
  const handleLoginInfoChange = (e) => {
    const { name, value } = e.target;
    setFormInfo((prevState) => ({
      [name]: value,
    }));
  };
  const { isEditEmail, isActive } = agent;
  return (
    <form onSubmit={handleFotgotPassword}>
      {/* sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }} */}
      <Box>
        <Box sx={{ position: "relative", width: "100%", my: 2.5 }}>
          <input
            type="email"
            name="email"
            value={formInfo?.email}
            style={secondInputStyle}
            placeholder="Enter your Email"
            onChange={handleLoginInfoChange}
            autoComplete="new-email"
          />

          <Box
            sx={{
              ".MuiSvgIcon-root": { color: "var(--secondary-color)" },
              mt: "15px",
            }}
          >
            <Alert
              severity="error"
              sx={{
                border: "1px solid #184875",
                bgcolor: "#E5F6FD",
                color: "#184875",
                fontSize: "12px",
                padding: "0px 10px",
              }}
            >
              <span style={{ fontWeight: "600" }}>
                Enter your registered agency login email to reset your password.
              </span>
            </Alert>
          </Box>
        </Box>

        <Button
          type="submit"
          disabled={isLoading}
          style={{
            ...editBtn,
            color: isLoading || isActive ? "gray" : "white",
            width: isEditEmail === false ? "100%" : "200px",
          }}
          onClick={handleFotgotPassword}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </Box>

      <Typography
        mt={1.5}
        sx={{
          fontSize: "13px",
          color: "var(--primary-color)",
          visibility: isEditEmail ? "visible" : "hidden",
        }}
      >
        Warning: This email will be your primary and login email.
      </Typography>
    </form>
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

const ResetPasswordForm = ({ formValues, setFormValues }) => {
  const [errors, setErrors] = useState({});
  const [passShow, setPassShow] = useState(false);
  const [confirmPassShow, setConfirmPassShow] = useState(false);

  const handleChangeAgentData = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    validateField(name, value);
  };

  const validateField = async (field, value) => {
    try {
      const values = { ...formValues, [field]: value };

      await generalInfoValidationSchema.validateAt(field, values);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
    }
  };

  return (
    <Grid container mt={4}>
      <Grid item md={12}>
        <Box sx={{ position: "relative" }}>
          <TextField
            value={formValues.password}
            {...textFieldProps(
              "password",
              "Enter Password",
              passShow ? "text" : "password"
            )}
            // disabled={id}
            onChange={handleChangeAgentData}
            sx={sharedInputStyles}
          />

          <button
            type="button"
            style={buttonStyleEye}
            onClick={() => setPassShow((prev) => !prev)}
          >
            {passShow ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
          </button>
          <Typography
            sx={{
              fontSize: "10.5px",
              color: "var(--primary-color)",
              height: "32px",
            }}
          >
            {errors?.password}
          </Typography>
        </Box>
      </Grid>
      <Grid item md={12}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "40px",
          }}
        >
          <TextField
            value={formValues.confirmPassword}
            {...textFieldProps(
              "confirmPassword",
              "Confirm Password",
              confirmPassShow ? "text" : "password"
            )}
            // disabled={id}
            onChange={handleChangeAgentData}
            sx={sharedInputStyles}
          />

          <button
            type="button"
            style={buttonStyleEye}
            onClick={() => setConfirmPassShow((prev) => !prev)}
          >
            {confirmPassShow ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
          </button>
        </div>
        <Typography sx={{ fontSize: "11px", color: "var(--primary-color)" }}>
          {errors?.confirmPassword}
        </Typography>
      </Grid>
    </Grid>
  );
};

const secondInputStyle = {
  width: "100%",
  height: "45px",
  borderRadius: "4px",
  outline: "none",
  border: "1px solid #DEE0E4",
  paddingLeft: "15px",
  paddingRight: "40px",
};

const verifyTypeBtn = {
  textTransform: "capitalize",
  fontSize: "13px",
  width: "33.33%",
  height: "45px",
};

const editBtn = {
  textTransform: "capitalize",
  backgroundColor: "#184875",
  height: "45px",
  fontSize: "15px",
  fontWeight: 600,
};

export default ForgotOtp;
