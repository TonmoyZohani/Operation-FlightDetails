import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { addMinutes } from "date-fns";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import {
  setAgentReg,
  setSessionExpired,
} from "../../features/registrationSlice";
import useToast from "../../hook/useToast";
import { isMobile } from "../../shared/StaticData/Responsive";
import CustomAlert from "../Alert/CustomAlert";
import CustomToast from "../Alert/CustomToast";
import { Timer } from "../LogIn/LogInPortal";
import { regSubmitBtn } from "./RegisterPortal";

const Verification = ({ isLoading, setIsLoading, step, setStep }) => {
  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  // const [isLoading, setIsLoading] = useState(false);
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [isOTPValid, setIsOTPValid] = useState(true);
  const [showResend, setShowResend] = useState(false);

  const agentReg = useSelector((state) => state.registration.agentReg);
  const { accessToken } = agentReg;

  const { email, createdAt, emailVerified, phoneVerified } = agentReg?.user;

  const phone = agentReg?.user?.phone || agentReg?.user?.phoneNumber;

  useEffect(() => {
    const checkOTPExpiry = () => {
      const expiryTime = addMinutes(
        new Date(moment(createdAt, "YYYY-MM-DD HH:mm:ss")),
        5
      );
      setIsOTPValid(expiryTime > new Date());
    };

    checkOTPExpiry();

    const interval = setInterval(checkOTPExpiry, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const handleSendOTPCode = async (type) => {
    const body = {
      type,
      email: type === "email" ? email : null,
      phoneNumber: type === "phone" ? phone : null,
    };

    setOtpFields(new Array(6).fill(""));
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account/re-send-otp`;

    try {
      const response = await axios.post(url, body, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const responseData = response?.data;

      if (responseData?.success === true) {
        setShowResend(false);
        showToast("success", responseData?.message);
        dispatch(
          setAgentReg({
            ...agentReg,
            user: {
              ...agentReg?.user,
              ...responseData?.data?.user,
              createdAt: responseData?.data?.user?.createdAt,
            },
          })
        );
      }
    } catch (e) {
      const message = e?.response?.data?.message || "An error occurred";

      showToast("error", message, () => {
        if (e?.response?.data?.statusCode === 401) {
          dispatch(setSessionExpired());
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e, type) => {
    e.preventDefault();
    const body = {
      email: type === "email" ? email : null,
      phoneNumber: type === "phone" ? phone : null,
      otp: otpFields.join(""),
    };

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account?step=2`;

    try {
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to proceed next Step",
      });

      if (result?.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(url, body, {
          headers: { authorization: `Bearer ${accessToken}` },
        });
        const responseData = response?.data;

        if (responseData?.success === true) {
          const agentData = responseData?.data;
          setOtpFields(new Array(6).fill(""));

          const nextStep = Number(agentData?.metadata?.step);

          dispatch(
            setAgentReg({
              ...agentReg,
              user: {
                ...agentReg?.user,
                ...responseData?.data?.user,
                createdAt: responseData?.data?.user?.createdAt,
              },
              emailVerified: agentData?.user?.emailVerified,
              phoneVerified: agentData?.user?.phoneVerified,
              pageNumber: nextStep,
              accessToken: agentData?.user?.phoneVerified
                ? agentData?.auth?.token
                : accessToken,
            })
          );

          setShowResend(false);

          const message =
            (type === "email" ? "Email" : "Phone Number") +
            " Verification Successfully Completed.";

          showToast("success", message, () => {
            if (agentData?.user?.phoneVerified) setStep(nextStep);
          });
        }
      }
    } catch (e) {
      const message = e?.response?.data?.message || "An error occurred";

      showToast("error", message, () => {
        if (e?.response?.data?.statusCode === 401) {
          dispatch(setSessionExpired());
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disableBtn = isLoading || otpFields.every((otp) => otp) === false;

  return (
    <form
      onSubmit={(e) => handleVerifyOTP(e, !emailVerified ? "email" : "phone")}
      style={{ position: "relative", height: "calc(100vh - 260px)" }}
    >
      <Box sx={{ width: isMobile ? "100%" : "45%", m: "0 auto" }}>
        <Box sx={{ borderRadius: "4px", mt: isMobile ? 5 : 14 }}>
          <Button
            sx={{
              ...verifyTypeBtn,
              border: "1px solid var(--primary-color)",
              borderColor: emailVerified ? "#1ba84a" : "var(--primary-color)",
              bgcolor: emailVerified ? "#1ba84a" : "white",
              color: emailVerified ? "white" : "var(--primary-color)",
              ":hover": { bgcolor: emailVerified ? "#1ba84a" : "white" },
              fontSize: "15px",
              borderRadius: "4px 0 0 4px",
            }}
          >
            {emailVerified && <VerifiedIcon sx={{ fontSize: "18px", mr: 1 }} />}
            Email
          </Button>
          <Button
            sx={{
              ...verifyTypeBtn,
              border: "1px solid var(--primary-color)",
              borderColor: phoneVerified ? "#1ba84a" : "var(--primary-color)",
              bgcolor: phoneVerified ? "#1ba84a" : "var(--primary-color)",
              color: "white",
              ":hover": {
                bgcolor: phoneVerified ? "#1ba84a" : "var(--primary-color)",
              },
              borderRadius: "0 4px 4px 0",
            }}
          >
            {phoneVerified && <VerifiedIcon sx={{ fontSize: "18px", mr: 1 }} />}
            Phone
          </Button>
        </Box>

        <Typography my={1.5} sx={{ fontSize: "13px", color: "var(--green)" }}>
          OTP has been sent to {!emailVerified ? email : phone}
        </Typography>

        {!emailVerified ? (
          <input type="email" value={email} style={secondInputStyle} disabled />
        ) : (
          <PhoneInput
            disabled
            inputStyle={{ width: "100%", height: "100%" }}
            value={phone}
          />
        )}

        <Box
          sx={{
            bgcolor: "#DADCE0",
            height: "4px",
            borderRadius: "5px",
            width: "50%",
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
            {step === 2 && (
              <>
                {(!emailVerified || !phoneVerified) && (
                  <Timer setShowResend={setShowResend} createdAt={createdAt} />
                )}

                <br />

                <span
                  style={{
                    visibility: showResend === false ? "visible" : "hidden",
                  }}
                >
                  You can resend the code in 4 minutes.
                </span>
              </>
            )}
          </Typography>
        ) : (
          <Typography sx={{ fontSize: "13px", color: "var(--dark-gray)" }}>
            Your OTP has expired. Please resend a new OTP to proceed.
          </Typography>
        )}

        <Typography
          mt={isMobile ? 2 : 5}
          sx={{
            fontSize: "13px",
            textAlign: "center",
            visibility: showResend ? "visible" : "hidden",
          }}
        >
          Didn’t get a Verification code ?{" "}
          <span
            onClick={() =>
              handleSendOTPCode(!emailVerified ? "email" : "phone")
            }
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
      </Box>

      {otpFields.every((otp) => otp) && isOTPValid && (
        <Box sx={{ position: "absolute", bottom: "10px", width: "100%" }}>
          <Button
            type="submit"
            disabled={disableBtn}
            style={regSubmitBtn(disableBtn)}

            // onClick={() => handleVerifyOTP(!emailVerified ? "email" : "phone")}
          >
            {isLoading
              ? `Your ${!emailVerified ? "email" : "phone"} verification is in progress, please Wait...`
              : !emailVerified
                ? "Verify your email address to proceed."
                : "Verify your phone number and continue to next step."}
          </Button>
        </Box>
      )}
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </form>
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

export default Verification;
