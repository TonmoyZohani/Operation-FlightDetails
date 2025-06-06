import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Grid,
  Modal,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useAuth } from "../../../context/AuthProvider";
import useFetcher from "../../../hook/useFetcher";
import useToast from "../../../hook/useToast";
import { StaffLoader } from "../../../pages/Staff/StaffVerify";
import { textFieldProps } from "../../../shared/common/functions";
import {
  depositBtn,
  phoneInputLabel,
  primaryBtn,
  sharedInputStyles,
} from "../../../shared/common/styles";
import useWindowSize from "../../../shared/common/useWindowSize";
import CustomAlert from "../../Alert/CustomAlert";
import CustomLoadingAlert from "../../Alert/CustomLoadingAlert";
import CustomToast from "../../Alert/CustomToast";
import { Timer } from "../../LogIn/LogInPortal";
import { buttonStyleEye } from "../../Register/GeneraInfo";
import { iconBox } from "../../Register/RegisterPortal";

const BranchCredentials = ({ branch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { jsonHeader } = useAuth();
  const [isOpen, setIsOpen] = useState({
    open: false,
    email: false,
    phone: false,
    password: false,
  });
  const [password, setPassword] = useState({ logoutAll: false });
  const [passShow, setPassShow] = useState([]);
  const { isMobile } = useWindowSize();

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  const toggleString = (value) => {
    setPassShow((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleChangePassword = async () => {
    if (!password?.newPassword || !password.confirmPassword) {
      showToast("error", "Please fill all fields");
      return;
    }
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? you want to Change Password?",
    });

    if (!result.isConfirmed) {
      return;
    }

    if (password?.newPassword !== password?.confirmPassword) {
      showToast("error", "Password do not match");
      return;
    }

    try {
      const body = {
        newPassword: password?.newPassword,
      };
      setIsLoading(true);
      setIsOpen((prev) => ({
        ...prev,
        password: false,
      }));
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches/reset/password/${branch?.id}`,
        body,
        jsonHeader()
      );

      if (response?.data?.success) {
        showToast("success", response?.data?.message);
        setPassword({});
      }
    } catch (e) {
      showToast("error", e?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "5px",
          height: "60vh",
          width: {
            xs: "90%",
            lg: "70%",
          },
          mx: "auto",
          mt: {
            xs: 5,
            lg: 0,
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={2} mt={2}>
          {/* Contact Email */}
          <Grid item sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={branch?.user?.email}
                {...textFieldProps("contactEmail", "Email")}
                sx={sharedInputStyles}
                InputProps={{ readOnly: true }}
                focused
              />
            </Box>
          </Grid>

          {/* Phone Number */}
          <Grid item sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Typography sx={phoneInputLabel}>Phone Number</Typography>
              <PhoneInput
                inputStyle={{
                  width: "100%",
                  height: "100%",
                }}
                value={branch?.user?.phone}
                country={"bd"}
                countryCodeEditable={false}
                disabled
              />
            </Box>
          </Grid>
        </Grid>

        <Button
          sx={{
            ...depositBtn,
            justifyContent: "left",
            bgcolor: "var(--green)",
            "&:hover": {
              bgcolor: "var(--green)",
            },
          }}
          onClick={() =>
            setIsOpen((prev) => ({
              ...prev,
              email: false,
              phone: false,
              password: true,
            }))
          }
        >
          Click to Change Password
        </Button>

        <Button
          sx={{
            ...depositBtn,
            justifyContent: "left",
            bgcolor: "var(--primary-color)",
            "&:hover": {
              bgcolor: "var(--primary-color)",
            },
          }}
          onClick={() =>
            setIsOpen((prev) => ({
              ...prev,
              open: true,
              email: true,
              phone: false,
            }))
          }
        >
          Click To Change Email
        </Button>
        <Button
          onClick={() =>
            setIsOpen((prev) => ({
              ...prev,
              open: true,
              email: false,
              phone: true,
            }))
          }
          sx={{
            ...depositBtn,
            justifyContent: "left",
            bgcolor: "var(--primary-color)",
            "&:hover": {
              bgcolor: "var(--primary-color)",
            },
          }}
        >
          Click To Change Phone
        </Button>
      </Box>

      <SwipeableDrawer
        anchor="right"
        open={isOpen?.open}
        PaperProps={{
          sx: { width: isMobile ? "100%" : "50%", zIndex: 1 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Typography
            sx={{
              color: "var(--secondary-color)",
              fontSize: "25px",
              fontWeight: 500,
            }}
          >
            {isOpen?.email ? "Change Your Email" : "Change Your Phone Number"}
          </Typography>
          <Tooltip title="Close">
            <Box
              sx={iconBox}
              onClick={() =>
                setIsOpen((prev) => ({
                  ...prev,
                  open: false,
                }))
              }
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
        <ChangeEmailAndPhone
          isOpen={isOpen}
          branch={branch}
          setIsOpen={setIsOpen}
        />
      </SwipeableDrawer>

      <Modal open={isOpen?.password} onClose={() => setIsOpen(false)}>
        <Box sx={style}>
          <Typography
            sx={{ fontSize: "18px", color: "var(--secondary-color)" }}
          >
            Change Your Password
          </Typography>
          <Grid container spacing={3} my={0.25}>
            <Grid item md={12} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  {...textFieldProps(
                    "newPassword",
                    "New Password",
                    passShow?.includes("newPassword") ? "text" : "password"
                  )}
                  onChange={handleOnChange}
                  sx={sharedInputStyles}
                  autoComplete="off"
                />

                <button
                  type="button"
                  style={buttonStyleEye}
                  onClick={() => toggleString("newPassword")}
                >
                  {passShow?.includes("newPassword") ? (
                    <VisibilityOffIcon />
                  ) : (
                    <RemoveRedEyeIcon />
                  )}
                </button>
              </Box>
            </Grid>

            <Grid item md={12} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  {...textFieldProps(
                    "confirmPassword",
                    "Confirm Password",
                    passShow?.includes("confirmPassword") ? "text" : "password"
                  )}
                  onChange={handleOnChange}
                  sx={sharedInputStyles}
                  autoComplete="off"
                />

                <button
                  type="button"
                  style={buttonStyleEye}
                  onClick={() => toggleString("confirmPassword")}
                >
                  {passShow?.includes("confirmPassword") ? (
                    <VisibilityOffIcon />
                  ) : (
                    <RemoveRedEyeIcon />
                  )}
                </button>
              </Box>
            </Grid>
          </Grid>

          <Button
            sx={{
              ...depositBtn,
              justifyContent: "left",
            }}
            onClick={handleChangePassword}
          >
            Proceed to Change Password
          </Button>
        </Box>
      </Modal>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      <CustomLoadingAlert
        open={isLoading}
        text="We're Processing your Password Change Request"
      />
    </>
  );
};

const ChangeEmailAndPhone = ({ isOpen, branch, setIsOpen }) => {
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [isOTPValid, setIsOTPValid] = useState(true);
  const [createdAt, setCreatedAt] = useState(null);
  const [isLoading, setIsLoading] = useState({});
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { isMobile } = useWindowSize();
  const { patchFetcher } = useFetcher();
  const queryClient = useQueryClient();

  const handleSendOtp = async () => {
    try {
      const isEmail = isOpen?.email;
      const result = await CustomAlert({
        success: "warning",
        message: `Are you sure? You want to send OTP via ${isEmail ? "Email" : "Phone"}`,
      });

      if (!result.isConfirmed) return;

      const isPhone = !isEmail;

      if (isEmail && !email) {
        showToast("error", "Email is required to send OTP.");
        return;
      }
      if (isPhone && !phone) {
        showToast("error", "Phone number is required to send OTP.");
        return;
      }

      setIsLoading({
        open: true,
        message: isEmail
          ? "Sending OTP to your Email..."
          : "Sending OTP to your Phone...",
      });

      const endPoint = isEmail
        ? `/api/v1/user/branches/reset/email/${branch?.id}`
        : `/api/v1/user/branches/reset/phone/${branch?.id}`;

      const requestBody = isEmail
        ? { loginEmail: email }
        : { loginPhone: phone };

      const response = await patchFetcher({
        endPoint,
        body: requestBody,
      });

      if (response?.success) {
        showToast("success", response?.message);
        setCreatedAt(moment().format("YYYY-MM-DD HH:mm:ss"));
      } else {
        showToast("error", response?.message || "Failed to send OTP.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while sending OTP.";
      showToast("error", errorMessage);
    } finally {
      setIsLoading({ open: false, message: "" });
    }
  };

  const handleResendOtp = async () => {
    try {
      const isEmail = isOpen?.email;
      const result = await CustomAlert({
        success: "warning",
        message: `Are you sure? You want to Resend OTP via ${isEmail ? "Email" : "Phone"}`,
      });

      if (!result.isConfirmed) return;

      setIsLoading({
        open: true,
        message: isEmail
          ? "Sending OTP to your Email..."
          : "Sending OTP to your Phone...",
      });
      setOtpFields(new Array(6).fill(""));

      const endPoint = isEmail
        ? `/api/v1/user/branches/reset/otp/email/resend/${branch?.id}`
        : `/api/v1/user/branches/reset/otp/phone/resend/${branch?.id}`;

      const response = await patchFetcher({
        endPoint,
      });

      if (response?.success) {
        showToast("success", response?.message);
        setCreatedAt(moment().format("YYYY-MM-DD HH:mm:ss"));
      } else {
        showToast("error", response?.message || "Failed to send OTP.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while sending OTP.";
      showToast("error", errorMessage);
    } finally {
      setIsLoading({ open: false, message: "" });
    }
  };

  const handleOtpVerify = async () => {
    try {
      if (otpFields?.join("")?.length < 6) {
        showToast("error", "OTP is required");
        return;
      }
      const isEmail = isOpen?.email;
      const result = await CustomAlert({
        success: "warning",
        message: `Are you sure? You want to Verify OTP via ${isEmail ? "Email" : "Phone"}`,
      });

      if (!result.isConfirmed) return;

      setIsLoading({
        open: true,
        message: isEmail
          ? "Verify OTP to your Email..."
          : "Verify OTP to your Phone...",
      });

      const endPoint = isEmail
        ? `/api/v1/user/branches/reset/otp/email/verify/${branch?.id}`
        : `/api/v1/user/branches/reset/otp/phone/verify/${branch?.id}`;

      const response = await patchFetcher({
        endPoint,
        body: { otp: otpFields?.join("") },
      });

      if (response?.success) {
        setCreatedAt(null);
        setOtpFields(new Array(6).fill(""));
        setIsOpen((prev) => ({
          ...prev,
          open: false,
          email: false,
          phone: false,
        }));
        queryClient.invalidateQueries(["branch"]);
        showToast("success", response?.message);
      } else {
        showToast("error", response?.message || "Failed to send OTP.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while sending OTP.";
      showToast("error", errorMessage);
    } finally {
      setIsLoading({ open: false, message: "" });
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
    <Box
      sx={{
        overflowY: isLoading?.open && "hidden",
      }}
    >
      <Box sx={{ width: isMobile ? "100%" : "50%", m: "0 auto" }}>
        <Box sx={{ borderRadius: "4px", mt: isMobile ? 5 : 14 }}>
          {isOpen?.email ? (
            <Button
              sx={{
                ...verifyTypeBtn,
                border: "1px solid var(--primary-color)",
                borderColor: "var(--primary-color)",
                bgcolor: "white",
                color: "var(--primary-color)",
                ":hover": { bgcolor: "white" },
                fontSize: "15px",
                borderRadius: "4px",
                width: "100%",
              }}
            >
              Email
            </Button>
          ) : (
            <Button
              sx={{
                ...verifyTypeBtn,
                border: "1px solid var(--primary-color)",
                borderColor: "var(--primary-color)",
                bgcolor: "white",
                color: "var(--primary-color)",
                ":hover": {
                  bgcolor: "white",
                },
                borderRadius: "4px",
                width: "100%",
              }}
            >
              Phone
            </Button>
          )}
        </Box>

        <Typography my={1.5} sx={{ fontSize: "13px", color: "var(--green)" }}>
          OTP has been sent to {isOpen?.email ? email : phone}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ width: "80%" }}>
            {isOpen?.email ? (
              <input
                type="email"
                value={email}
                style={secondInputStyle}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
              />
            ) : (
              <PhoneInput
                inputStyle={{ width: "100%", height: "100%" }}
                value={phone}
                country={"bd"}
                onChange={(value) => setPhone(value)}
              />
            )}
          </Typography>
          <Button
            onClick={handleSendOtp}
            sx={{
              bgcolor: "var(--secondary-color)",
              ":hover": {
                bgcolor: "var(--secondary-color)",
              },
              color: "white",
              borderRadius: "2px",
              textAlign: "center",
              width: "20%",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            Send
          </Button>
        </Box>

        <Box
          sx={{
            bgcolor: "#DADCE0",
            height: "4px",
            borderRadius: "5px",
            width: "60%",
            mb: "2px",
            mt: "12px",
          }}
        />
        <Typography sx={{ fontSize: "13px", color: "var(--dark-gray)" }}>
          Enter OTP
        </Typography>

        <OTPfield otpFields={otpFields} setOtpFields={setOtpFields} />

        {isOTPValid ? (
          <Typography sx={{ fontSize: "13px", color: "var(--dark-gray)" }}>
            Enter the Code to continue within{" "}
            {createdAt && <Timer createdAt={createdAt} />}
          </Typography>
        ) : (
          <Typography sx={{ fontSize: "13px", color: "var(--dark-gray)" }}>
            Your OTP has expired. Please resend a new OTP to proceed.
          </Typography>
        )}

        <Typography
          mt={isMobile ? 2 : 5}
          sx={{ fontSize: "13px", textAlign: "center" }}
        >
          Didn't get a Verification code ?{" "}
          <span
            onClick={handleResendOtp}
            style={{
              color: isLoading?.open ? "gray" : "var(--secondary-color)",
              textDecoration: "underline",
              cursor: "pointer",
              pointerEvents: isLoading?.open && "none",
            }}
          >
            Resend OTP
          </span>
        </Typography>

        <Button
          onClick={handleOtpVerify}
          type="submit"
          sx={{ ...primaryBtn, width: "100%" }}
        >
          Submit
        </Button>
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

export const OTPfield = ({ otpFields, setOtpFields }) => {
  const { isMobile } = useWindowSize();
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
      {otpFields?.map((otp, i) => {
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

export const secondInputStyle = {
  width: "100%",
  height: "40px",
  borderRadius: "4px",
  outline: "none",
  border: "1px solid #DEE0E4",
  paddingLeft: "15px",
  paddingRight: "40px",
};

const verifyTypeBtn = {
  textTransform: "capitalize",
  fontSize: "13px",
  width: "50%",
  height: "40px",
};

export const editBtn = {
  textTransform: "capitalize",
  backgroundColor: "var(--secondary-color)",
  height: "40px",
  fontSize: "12px",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    md: 600,
  },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default BranchCredentials;
