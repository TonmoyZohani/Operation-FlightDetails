import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DrawerTitle from "../DrawerTitle/DrawerTitle";
import { regTitle } from "../Register/GeneraInfo";
import { maskEmail, textFieldProps } from "../../shared/common/functions";
import { sharedInputStyles } from "../../shared/common/styles";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import { OTPfield, secondInputStyle } from "../Register/Verification";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";
import { useDispatch } from "react-redux";
import { Timer } from "../LogIn/LogInPortal";

const Contact = ({ setOpen }) => {
  const dispatch = useDispatch();
  const { jsonHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [count, setCount] = useState(0);
  const [contact, setContact] = useState({});
  const [createdAt, setCreatedAt] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading === false && openToast === true) {
      setCreatedAt(new Date());
    }
  }, [isLoading]);

  const handleOnChange = (name, value) => {
    setContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContact = async () => {
    setIsLoading(true);
    try {
      const responseData = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/newsLetter/create-letter`,
        contact
      );

      if (responseData?.data?.data?.verified) {
        showToast("success", responseData?.data?.message);
        setOpen(false);
      } else {
        showToast("success", responseData?.data?.message);
        setCount(1);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
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
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/newsLetter/resend-otp`,
        { email: contact?.email },
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
  const handleOTP = async () => {
    try {
      const responseData = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/newsLetter/verify-email`,
        {
          email: contact?.email,
          otp: otpFields.join(""),
        }
      );
      if (responseData?.data?.success === true) {
        showToast("success", responseData?.data?.message, () => {
          setOpen(false);
          window.location.reload();
        });
      } else {
        showToast("error", responseData?.data?.message);
      }
    } catch (error) {
      console.error(error.message);

      showToast("error", error?.response?.data?.message);
    }
  };

  return (
    <Box
      sx={{
        p: "20px 25px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box>
        <DrawerTitle
          title={"Get in Touch"}
          // text1={"Already have an agent Account?"}
          text2={"Sign In"}
          // handleOpen={() => {
          //   setOpen(false);
          //   dispatch(setAgentLogin({ isOpen: true }));
          // }}
          handleClose={() => {
            setOpen(null);
            setCount(0);
            setContact({});
          }}
        />
      </Box>
      {count === 0 && (
        <Box>
          <Grid container spacing={3} mt={"0"}>
            <Grid item md={6}>
              <Typography sx={{ ...regTitle, mb: 2 }}>
                Email Information
              </Typography>
              <TextField
                defaultValue={contact?.email || ""}
                {...textFieldProps("email", "Email Address", "email")}
                onChange={(e) => handleOnChange("email", e.target.value)}
                sx={sharedInputStyles}
              />
            </Grid>
            <Grid item md={6}>
              <Typography sx={{ ...regTitle, mb: 2 }}>
                Phone Number Information
              </Typography>
              <PhoneInput
                inputStyle={{ width: "100%", height: "100%" }}
                defaultValue={contact?.phone || ""}
                country={"bd"}
                countryCodeEditable={false}
                onChange={(phone) => handleOnChange("phone", phone)}
              />
            </Grid>
          </Grid>

          <Typography sx={regTitle}>Your Message to Us</Typography>

          <Grid container spacing={2} mt={"0"}>
            <Grid item md={12}>
              <TextField
                defaultValue={contact?.subject || ""}
                {...textFieldProps("text", "Subject")}
                onChange={(e) => handleOnChange("subject", e.target.value)}
                sx={sharedInputStyles}
              />
            </Grid>
            <Grid item md={12}>
              <textarea
                style={{
                  border: "1px solid var(--border-color)",
                  outline: "none",
                  width: "100%",
                  resize: "none",
                  padding: "10px 14.5px",
                  fontSize: "16px",
                  color: "var(--text-medium)",
                  borderRadius: "5px",
                  height: "260px",
                }}
                defaultValue={contact?.message || ""}
                onChange={(e) => handleOnChange("message", e.target.value)}
                placeholder="Write your message"
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {count === 1 && (
        <Box>
          <Box
            sx={{
              width: "50%",
              margin: "0 auto",
              alignItems: "center",
              mt: "150px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#DADCE0",
                  height: "4px",
                  borderRadius: "5px",
                  width: "50%",
                  mb: 1,
                }}
              />
              <Typography sx={{ fontSize: "13px", color: "var(--dark-gray)" }}>
                Enter OTP to Confirm your Email
              </Typography>
            </Box>

            <input
              type="email"
              style={secondInputStyle}
              value={contact?.email}
              disabled
            />

            <OTPfield otpFields={otpFields} setOtpFields={setOtpFields} />

            <Typography sx={{ fontSize: "13px", color: "var(--dark-gray)" }}>
              Enter the Code to continue
            </Typography>

            <Box>
              <Typography sx={{ pt: "20px", fontSize: "13px" }}>
                A message with a verification code has been sent to{" "}
                <span style={{ color: "var(--primary-color)" }}>
                  {maskEmail(contact?.email)}
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
            <Button
              style={{
                backgroundColor: "var(--secondary-color)",
                color: isLoading ? "gray" : "white",
                width: "100%",
                textTransform: "capitalize",
                display: count ? "block" : "none",
                marginTop: "25px",
              }}
              onClick={handleOTP}
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : "Submit OTP"}
            </Button>
          </Box>
        </Box>
      )}

      <Button
        style={{
          backgroundColor: "var(--secondary-color)",
          color: isLoading ? "gray" : "white",
          width: "215px",
          textTransform: "capitalize",
          display: count ? "none" : "block",
          marginTop: "20px",
        }}
        onClick={handleContact}
        disabled={isLoading}
      >
        {isLoading ? "Please wait..." : "Submit Your Response"}
      </Button>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

export default Contact;
