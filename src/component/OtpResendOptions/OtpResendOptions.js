import React from "react";
import { Box, Typography } from "@mui/material";
import TextsmsIcon from "@mui/icons-material/Textsms";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";

const OtpResendOptions = ({ handleResend, disabledMethods = [] }) => {
  const methods = [
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
      via: "contact",
      label: "More Options",
      text: "Contact for",
      icon: <InfoIcon sx={{ color: "#5F6368", fontSize: "32px" }} />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mt: 3.8,
      }}
    >
      {methods.map((method, i) => {
        const isDisabled = disabledMethods.includes(method.via);

        return (
          <Box
            key={i}
            sx={{
              flex: 1,
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
              onClick={() => handleResend(method.via)}
              sx={{ cursor: isDisabled ? "default" : "pointer" }}
            >
              {React.cloneElement(method.icon)}
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#5F6368",
                  px: "5px",
                  mt: "5px",
                }}
              >
                {method.text}{" "}
                <span style={{ color: "#C4161C" }}>{method.label}</span>
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
  

export default OtpResendOptions;
