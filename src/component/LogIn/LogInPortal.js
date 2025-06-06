import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import TextsmsIcon from "@mui/icons-material/Textsms";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { addMinutes } from "date-fns";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FaClock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useAuth } from "../../context/AuthProvider";
import { setAgentLogin, setAgentReg } from "../../features/registrationSlice";
import { getDeviceToken } from "../../firebase.config";
import useToast from "../../hook/useToast";
import { maskEmail } from "../../shared/common/functions";
import {
  lightBlueBtn,
  primaryBtn,
  registrationErrText,
  secondaryBtn,
} from "../../shared/common/styles";
import { isMobile } from "../../shared/StaticData/Responsive";
import CustomToast from "../Alert/CustomToast";
import CustomCheckBox from "../CustomCheckbox/CustomCheckbox";
import { calculateTimeRemaining } from "../Dashboard/OperationCalendar";
import { ContactOptions, lineStyle } from "../Register/CompleteRegistration";
import { setLoginDrawerOpen } from "../Register/registerSlice";
import ForgotOtp from "./ForgotOtp";

export const otpMethod = [
  {
    via: "phone",
    label: "Via SMS",
    text: "verification code",
    icon: <TextsmsIcon sx={{ color: "#5F6368", fontSize: "23px" }} />,
  },
  {
    via: "email",
    label: "Via Email",
    text: "verification code",
    icon: <EmailIcon sx={{ color: "#5F6368", fontSize: "25px" }} />,
  },
  {
    via: "",
    label: "More Options",
    text: "Contact for",
    icon: <InfoIcon sx={{ color: "#5F6368", fontSize: "25px" }} />,
  },
];

const Via = {
  EMAIL: "email",
  PHONE: "phone",
  MORE: "more",
};

const LoginPortal = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsShowNotice, setAgentToken } = useAuth();

  const [step, setStep] = useState(1);
  const [showResend, setShowResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [resendMethod, setResendMethod] = useState("");
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [forgotIsOpen, setForgotIsOpen] = useState(false);
  const [error, setError] = useState({});
  const [remainingCount, setRemainingCount] = useState("");
  const [userSessions, setUserSessions] = useState([]);
  const [isOTPValid, setIsOTPValid] = useState(true);
  const agentReg = useSelector((state) => state.registration.agentReg);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [isExpired, setIsExpired] = useState(false);

  const [formInfo, setFormInfo] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    id: "",
    otpSend: false,
    phone: "",
    time: "",
    token: "",
    type: "",
    via: "",
  });

  useEffect(() => {
    if (pathname === "/forget-password") {
      setForgotIsOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    const checkOTPExpiry = () => {
      const expiryTime = addMinutes(
        new Date(moment(loginInfo?.createdAt, "YYYY-MM-DD HH:mm:ss")),
        5
      );
      setIsOTPValid(expiryTime > new Date());
    };

    checkOTPExpiry();

    const interval = setInterval(checkOTPExpiry, 1000);

    return () => clearInterval(interval);
  }, [loginInfo?.createdAt]);

  const handleLoginInfoChange = (e) => {
    const { name, value } = e.target;
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
    setError("");
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    const body = {
      email: formInfo?.email,
      password: formInfo?.password,
      // remember: remember ? 1 : 0,
    };

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/login`;

    try {
      const response = await axios.post(url, body);
      const responseData = response?.data;
      const userData2 = responseData?.data;

      setLoginInfo({
        // ...loginInfo,
        ...userData2,
        token: userData2?.auth?.token,
        createdAt: userData2?.auth?.createdAt,
      });

      if (userData2?.metadata) {
        dispatch(
          setAgentReg({
            ...agentReg,
            ...userData2,
            isOpen: true,
            pageNumber: Number(userData2?.metadata?.step),
            accessToken: userData2?.auth?.token,
            cameFrom: "login",
          })
        );
        dispatch(setAgentLogin({ isOpen: false }));
      } else if (
        userData2?.userSessions.length >= userData2?.maxAllowedSessions
      ) {
        setUserSessions(userData2?.userSessions);
        setStep(3);
      } else {
        setStep(2);
      }

      showToast("success", responseData?.message);
      return;
    } catch (err) {
      const message = err?.response?.data?.message || "An error occurred";

      if (
        message ===
        "You have already submitted your agency information. Please wait for approval."
      ) {
        setStep(4);
      }

      if (message === "Incorrect password. Please try again.") {
        setRemainingCount(err?.response?.data?.error[0]?.remainingAttempts);
      }

      if (err?.response?.data?.error[0]?.passwordChangeRequired) {
        setForgotIsOpen(true);
      }
      if (err?.response?.data?.error[0]?.tradeCertificateRenewRequired) {
        setStep(5);
      }

      showToast("error", message);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (type) => {
    setOtpFields(new Array(6).fill(""));
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/resend-otp`;

    try {
      const response = await axios.post(
        url,
        { via: type },
        {
          headers: {
            Authorization: `Bearer ${loginInfo?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response?.data;

      if (responseData?.success) {
        setLoginInfo({ ...responseData?.data?.auth });
        setShowResend(false);
        setResendMethod(type);
        showToast("success", response?.data?.message);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "An error occurred";
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendNextPage = async (type) => {
    setOtpFields(new Array(6).fill(""));
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/resend-otp`;

    try {
      const response = await axios.post(
        url,
        { via: type },
        {
          headers: {
            Authorization: `Bearer ${loginInfo?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response?.data;

      if (responseData?.success) {
        setLoginInfo({ ...responseData?.data?.auth });
        setStep(2);
        setResendMethod(type);
        showToast("success", response?.data?.message);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "An error occurred";
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const deviceToken = await getDeviceToken();
    secureLocalStorage.setItem("deviceToken", deviceToken);
    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/verify-login-otp`;

    try {
      const { data } = await axios.post(
        url,
        { otp: otpFields.join(""), deviceToken },
        {
          headers: {
            Authorization: `Bearer ${loginInfo?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const successMessage = data?.message;

      if (data?.success) {
        if (data?.data?.registered === false) {
          dispatch(
            setAgentReg({
              ...agentReg,
              ...data?.data,
              isOpen: true,
              pageNumber: Number(data?.data?.metadata?.step),
              accessToken: data?.data?.auth?.token,
              cameFrom: "login",
            })
          );
          dispatch(setAgentLogin({ isOpen: false }));
        } else {
          secureLocalStorage.setItem("agent-token", data?.data?.auth?.token);
          setAgentToken(data?.data?.auth?.token);
          showToast("success", successMessage, () => {
            setIsShowNotice(true);
            navigate("/dashboard/searchs");
            dispatch(setLoginDrawerOpen(true));
          });
        }
      }
    } catch (err) {
      const message = err?.response?.data?.message || "An error occurred";

      showToast("error", message, () => {});
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSession = async (id) => {
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/auth/remove-session/${id}`;

    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${loginInfo?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const userData = response?.data;

      if (userData?.success) {
        setUserSessions(userData?.data?.userSessions);
      }
      showToast("success", userData?.message, () => {});
    } catch (err) {
      const message = err?.response?.data?.message || "An error occurred";

      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  return (
    <>
      <Box
        sx={{
          p: "20px 25px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{
              color: "var(--secondary-color)",
              fontSize: "25px",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {step === 2
              ? ""
              : forgotIsOpen
                ? ""
                : step === 3
                  ? "Maximum Login Device Limit Reach"
                  : ""}
          </Typography>
          <Typography
            sx={{
              color: "var(--secondary-color)",
              fontSize: "17px",
            }}
          >
            {step === 3 ? (
              "Please Delete On of device to continue Login"
            ) : (
              <>
                {forgotIsOpen
                  ? "Already know your Password? "
                  : "Don’t have a business account yet?"}{" "}
                {forgotIsOpen ? (
                  <span
                    onClick={() => {
                      setForgotIsOpen(false);
                    }}
                    style={{
                      color: "var(--primary-color)",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Sign In
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      dispatch(setAgentLogin({ isOpen: false }));
                      dispatch(setAgentReg({ field: "isOpen", value: true }));
                    }}
                    style={{
                      color: "var(--primary-color)",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Register Now
                  </span>
                )}
              </>
            )}
          </Typography>
        </Box>

        <Tooltip title="Close">
          <Box
            onClick={() => dispatch(setAgentLogin({ isOpen: false }))}
            sx={iconBox}
          >
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

      {forgotIsOpen ? (
        <ForgotOtp
          forgotIsOpen={forgotIsOpen}
          setForgotIsOpen={setForgotIsOpen}
          setStep={setStep}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {step === 1 && (
            <Box sx={{ width: isMobile ? "85%" : "50%" }}>
              <Typography
                sx={{
                  fontSize: "20px",
                  color: "var(--secondary-color)",
                  fontWeight: "600",
                  mb: "5px",
                }}
              >
                Business Login
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
              <form onSubmit={handleLogin}>
                <Grid container spacing={2.5} sx={{ mt: "10px" }}>
                  <Grid item md={12} xs={12}>
                    <Box sx={{ position: "relative" }}>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        style={inputStyle}
                        placeholder="Email"
                        value={formInfo.email}
                        onChange={handleLoginInfoChange}
                        required
                        autoComplete="new-email"
                      />
                      <span style={registrationErrText}>{error?.message}</span>
                    </Box>
                  </Grid>
                  <Grid item md={12} xs={12} sx={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      style={inputStyle}
                      placeholder="Password"
                      value={formInfo.password}
                      onChange={handleLoginInfoChange}
                      required
                      autoComplete="new-password"
                    />
                    {!showPassword ? (
                      <VisibilityIcon
                        sx={{
                          position: "absolute",
                          cursor: "pointer",
                          right: "7px",
                          bottom: "7px",
                          color: "var(--secondary-color)",
                        }}
                        onClick={() => handleShowPassword()}
                      />
                    ) : (
                      <VisibilityOffIcon
                        sx={{
                          position: "absolute",
                          cursor: "pointer",
                          right: "7px",
                          bottom: "7px",
                          color: "var(--secondary-color)",
                        }}
                        onClick={() => handleShowPassword()}
                      />
                    )}
                  </Grid>
                  <Grid
                    item
                    md={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <CustomCheckBox
                        value={remember}
                        style={{ color: "var(--gray)" }}
                        label="Remember me"
                        handleChange={(e) => setRemember(e.target.checked)}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--primary-color)",
                        cursor: "pointer",
                      }}
                      onClick={() => setForgotIsOpen(true)}
                    >
                      Forgot Password?
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid var(--primary-color)",
                        borderRadius: "5px",
                        display: remainingCount ? "block" : "none",
                        bgcolor: "#dc143c10",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "var(--primary-color)",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                          }}
                        >
                          Deactive Warning:
                        </span>{" "}
                        You have entered an incorrect password. You have{" "}
                        <span
                          style={{
                            color: "var(--primary-color)",
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          {remainingCount} attempts remaining .
                        </span>
                        Please try again carefully, or click{" "}
                        <span
                          style={{ fontWeight: 700, cursor: "pointer" }}
                          onClick={() => setForgotIsOpen(true)}
                        >
                          "Forgot Password"
                        </span>
                        to reset your password.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      sx={{ ...lightBlueBtn, mt: 0, width: "100%" }}
                      disabled={isLoading}
                      onClick={() => handleLogin()}
                    >
                      {isLoading ? (
                        <CircularProgress
                          size={25}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}

          {step === 2 && (
            <Box sx={{ width: isMobile ? "85%" : "50%", mt: -8 }}>
              <form onSubmit={handleOtpSubmit}>
                <Box
                  sx={{
                    p: 1,
                    border: "1px solid var(--primary-color)",
                    borderRadius: "5px",
                    display: loginInfo?.passExp < 30 ? "block" : "none",
                    bgcolor: "#dc143c10",
                    my: 1,
                  }}
                >
                  <Typography
                    sx={{ fontSize: "12px", color: "var(--primary-color)" }}
                  >
                    <span style={{ fontWeight: 700 }}>Password Warning:</span>{" "}
                    Your have {loginInfo?.passExp} days remaining for password
                    expire. Please change your password otherwise your account
                    will be locked.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1,
                    border: "1px solid var(--primary-color)",
                    borderRadius: "5px",
                    display:
                      loginInfo?.tradeCertificateExpire < 30 ? "block" : "none",
                    bgcolor: "#dc143c10",
                    mb: 5,
                  }}
                >
                  <Typography
                    sx={{ fontSize: "12px", color: "var(--primary-color)" }}
                  >
                    <span style={{ fontWeight: 700 }}>
                      Trande Certificate Warning:
                    </span>{" "}
                    Your Trande Certificate will be expire in{" "}
                    {loginInfo?.tradeCertificateExpire} days. Please renew and
                    update your profile.
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "var(--secondary-color)",
                    fontWeight: "600",
                    mb: "5px",
                  }}
                >
                  Verify with OTP
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

                <OTPfield otpFields={otpFields} setOtpFields={setOtpFields} />

                <Box sx={{ mb: 5 }}>
                  <Typography sx={{ fontSize: "13px" }}>
                    OTP has been sent to{" "}
                    <span
                      style={{
                        color: "var(--secondary-color)",
                        fontWeight: 600,
                      }}
                    >
                      {formInfo?.email.includes("@")
                        ? maskEmail(formInfo?.email)
                        : formInfo?.email.slice(0, 5) +
                          "******" +
                          formInfo?.email.slice(11, 13)}
                    </span>{" "}
                    and via SMS to{" "}
                    <span
                      style={{
                        color: "var(--secondary-color)",
                        fontWeight: 600,
                      }}
                    >
                      {typeof loginInfo?.userInfo?.phone === "string"
                        ? loginInfo.userInfo.phone.slice(0, 5) +
                          "******" +
                          loginInfo.userInfo.phone.slice(-2)
                        : "Invalid phone"}
                    </span>
                    <br></br> <br></br>
                    {!isExpired && (
                      <>
                        The code will expire in{" "}
                        <Timer
                          createdAt={loginInfo?.createdAt}
                          setShowResend={setShowResend}
                          setIsExpired={setIsExpired}
                        />
                      </>
                    )}
                  </Typography>
                </Box>

                <Grid
                  container
                  sx={{
                    justifyContent: "space-between",
                    // visibility: showResend ? "visible" : "hidden",
                    mb: 3,
                  }}
                  columnSpacing={isMobile ? "10px" : "20px"}
                >
                  {otpMethod.map((method, i) => {
                    return (
                      <Grid item xs={4} key={i}>
                        <Box
                          sx={{
                            // width: "28%",
                            border: "1px solid",
                            borderColor:
                              resendMethod === method?.via && resendMethod
                                ? "var(--primary-color)"
                                : "var(--border-color)",
                            minHeight: "100px",
                            borderRadius: "5px",
                            textAlign: "center",
                            cursor: "pointer",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            px: "8px",
                          }}
                          onClick={() => handleResendOTP(method?.via)}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              py: 1,
                            }}
                          >
                            {React.cloneElement(method?.icon)}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#5F6368",
                              px: isMobile ? "5px" : "5px",
                            }}
                          >
                            <span>{i < 2 && "Resend"} </span> {method?.text}{" "}
                            <span
                              style={{ color: "#C4161C", fontWeight: "600" }}
                            >
                              {method?.label}
                            </span>
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                <Button
                  disabled={isLoading}
                  type="submit"
                  sx={{
                    ...secondaryBtn,
                    fontSize: "15px",
                    fontWeight: 600,
                    width: "100%",
                    mt: 3,
                    visibility: isOTPValid ? "visible" : "hidden",
                  }}
                  // onClick={() => handleOtpSubmit()}
                >
                  {isLoading ? (
                    <CircularProgress size={20} style={{ color: "white" }} />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Box>
          )}

          {step === 3 && (
            <Box sx={{ width: isMobile ? "85%" : "50%" }}>
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
                Login Device
              </Typography>

              <Box sx={{ mt: 2.5, maxHeight: "40vh", overflowY: "auto" }}>
                {userSessions?.map((session, i) => {
                  return (
                    <Box
                      key={i}
                      sx={{
                        p: 1,
                        bgcolor: "#f0f2f5",
                        mt: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pl: 1.5,
                        borderRadius: "4px",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "var(--black)",
                            textTransform: "capitalize",
                            mb: 0.5,
                          }}
                        >
                          {/* {session?.platform?.toLowerCase() ===
                          "microsoft windows"
                            ? "Desktop"
                            : session?.platform} */}
                          {session?.loginAttempt?.platform}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            textTransform: "uppercase",
                            bgcolor: "var(--primary-color)",
                            color: "var(--white)",
                            width: "fit-content",
                            p: "2px 5px",
                            borderRadius: "2px",
                            mb: 0.5,
                          }}
                        >
                          {session?.loginAttempt?.devicePlatform}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "14px", color: "var(--light-gray)" }}
                        >
                          Last Login{" "}
                          {moment(session?.lastActivity).format(
                            "hh:mm:ss A DD MMM YYYY"
                          )}
                        </Typography>
                        {/* <Typography
                          sx={{ fontSize: "14px", color: "var(--light-gray)" }}
                        >
                          Expire At{" "}
                          {moment(session?.expAt).format(
                            "hh:mm:ss A DD MMM YYYY"
                          )}
                        </Typography> */}
                      </Box>

                      <DeleteIcon
                        sx={{
                          cursor: "pointer",
                          color: "var(--primary-color)",
                        }}
                        onClick={() => handleRemoveSession(session?.id)}
                      />
                    </Box>
                  );
                })}
              </Box>

              <Button
                disabled={
                  userSessions?.length >= loginInfo?.maxAllowedSessions ||
                  isLoading
                }
                onClick={() => handleResendNextPage(Via.EMAIL)}
                sx={{ ...primaryBtn, width: "100%" }}
              >
                {isLoading ? (
                  <CircularProgress size={25} style={{ color: "white" }} />
                ) : (
                  "Login"
                )}
              </Button>
            </Box>
          )}

          {step === 4 && (
            <Box
              sx={{
                width: isMobile ? "85%" : "55%",
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                alignItems: "center",
              }}
            >
              <FaClock style={{ fontSize: "77px", color: "#ff8000" }} />
              <Box>
                <Typography
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "25px",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Your Registration is Under Review
                </Typography>

                <Typography
                  sx={{
                    color: "var(--dark-gray)",
                    textAlign: "center",
                    fontSize: "15px",
                  }}
                >
                  Your registration is currently being reviewed. Please wait
                  until the approval process is complete. You will receive a
                  notification via email once your account has been approved.
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "var(--light-gray)",
                  textAlign: "center",
                  fontSize: "15px",
                  position: "relative",
                  "&::before": { ...lineStyle, left: "40px" },
                  "&::after": { ...lineStyle, right: "40px" },
                }}
              >
                OR
              </Typography>
              <ContactOptions width={"100%"} />
            </Box>
          )}

          {step === 5 && (
            <Box
              sx={{
                width: isMobile ? "85%" : "55%",
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                alignItems: "center",
              }}
            >
              <FaClock style={{ fontSize: "77px", color: "#ff8000" }} />
              <Box>
                <Typography
                  sx={{
                    color: "var(--secondary-color)",
                    fontSize: "25px",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Trade License Certificate Expired.
                </Typography>

                <Typography
                  sx={{
                    color: "var(--dark-gray)",
                    textAlign: "center",
                    fontSize: "15px",
                  }}
                >
                  Your Trade License Certificate is expired. Please Contact us
                  for renew your trade license certificate.
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "var(--light-gray)",
                  textAlign: "center",
                  fontSize: "15px",
                  position: "relative",
                  "&::before": { ...lineStyle, left: "40px" },
                  "&::after": { ...lineStyle, right: "40px" },
                }}
              >
                OR
              </Typography>
              <ContactOptions width={"100%"} />
            </Box>
          )}
        </Box>
      )}
      {openToast && (
        <CustomToast
          open={openToast}
          onClose={handleCloseToast}
          message={message}
          severity={severity}
        />
      )}
    </>
  );
};

export const OTPfield = ({ otpFields, setOtpFields }) => {
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        my: 2.8,
        gap: "5px",
      }}
    >
      {otpFields.map((otp, i) => {
        return (
          <input
            style={{
              width: isMobile ? "16%" : "52px",
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

export const Timer = ({ createdAt, setShowResend = () => {} }) => {
  // const maxTime = addMinutes(new Date(), 5);
  const maxTime = addMinutes(
    new Date(moment(createdAt, "YYYY-MM-DD HH:mm:ss")),
    5
  );

  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(maxTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remainingTime = calculateTimeRemaining(maxTime);

      if (remainingTime?.difference < 240000) {
        setShowResend(true);
      }

      setTimeRemaining(remainingTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [maxTime]);

  return (
    <span
      style={{
        color: "var(--primary-color)",
        // width: "100px",
        display: "inline-block",
        minWidth: "50px",
        width: "max-content",
      }}
    >
      <span style={{ fontWeight: 600 }}>
        {timeRemaining?.text?.split(" ")[0]}{" "}
      </span>
      {timeRemaining?.text?.length > 10 && (
        <span style={{ fontWeight: 600 }}>
          {`${
            " " +
            timeRemaining?.text?.split(" ")[1] +
            " " +
            timeRemaining?.text?.split(" ")[2]
          }`}
        </span>
      )}
    </span>
  );
};

const inputStyle = {
  width: "100%",
  height: "37px",
  borderRadius: "4px",
  outline: "none",
  border: "1px solid #DEE0E4",
  paddingLeft: "15px",
};

const iconBox = {
  bgcolor: "var(--primary-color)",
  borderRadius: "50%",
  height: { xs: "26px", md: "32px" },
  width: { xs: "32px" },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export default LoginPortal;
