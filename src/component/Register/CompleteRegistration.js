import { Box, Button, Typography } from "@mui/material";
import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import Lottie from "lottie-react";
import congratulations from "../../assets/lottie/congratulations.json";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { primaryBtn } from "../../shared/common/styles";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaYoutubeSquare,
} from "react-icons/fa";

const CompleteRegistration = () => {
  return (
    <Box sx={{ position: "relative" }}>
      {/* <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Box onClick={() => window.location.reload()} sx={iconBox}>
          <CloseIcon
            sx={{ color: "white", fontSize: "20px", borderRadius: "50%" }}
          />
        </Box>
      </Box> */}
      <Box
        sx={{
          height: "95vh",
          flexDirection: "column",
          gap: "30px",
          ...flexCenter,
          width: "45%",
          m: "0 auto",
        }}
      >
        <Box
          sx={{
            bgcolor: "#2D9B3A",
            width: "77px",
            height: "77px",
            borderRadius: "50%",
            ...flexCenter,
          }}
        >
          <CheckIcon sx={{ fontSize: "60px", color: "white" }} />
        </Box>

        <Typography
          sx={{
            color: "var(--secondary-color)",
            fontSize: "25px",
            fontWeight: "500",
            textAlign: "center",
            textTransform: "capitalize",
            lineHeight: "1.15",
          }}
        >
          Thank you for successfully submitting your agency registration
          information!
        </Typography>

        <Typography
          sx={{
            color: "var(--dark-gray)",
            textAlign: "center",
            fontSize: "15px",
          }}
        >
          Thank you for your patience as we thoroughly review your application.
          A confirmation email will be sent to you once the approval process is
          finalized. If you have any questions, please don’t hesitate to contact
          us.
        </Typography>

        <Box>
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
        </Box>
        <ContactOptions width={"100%"} />

        <Button
          type="submit"
          sx={{ ...primaryBtn, width: "100%" }}
          onClick={() => window.location.reload()}
        >
          Back To Home
        </Button>
      </Box>

      <Box
        sx={{
          position: "absolute",
          right: "25px",
          bottom: "0px",
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box className="icon" style={{ display: "flex", alignItems: "center" }}>
          <a
            href="https://www.facebook.com/FlyFarInternational/"
            {...socialProps}
          >
            <FaFacebookSquare style={{ ...socialIcon }} />
          </a>
          <a
            href="https://www.instagram.com/fly.far.international"
            {...socialProps}
          >
            <FaInstagramSquare style={{ ...socialIcon }} />
          </a>
          <a
            href="https://www.linkedin.com/company/flyfarint/"
            {...socialProps}
          >
            <FaLinkedin style={{ ...socialIcon }} />
          </a>

          <a
            href="https://www.youtube.com/channel/UCSaTz2O-em86jMDXxkpJpGQ"
            {...socialProps}
          >
            <FaYoutubeSquare style={{ ...socialIcon }} />
          </a>
        </Box>

        <Box>
          <Typography sx={{ fontSize: "15px", color: "var(--dark-gray)" }}>
            Read our
            <Link
              style={{ textDecoration: "none", color: "var(--primary-color)" }}
              to="https://demo5.flyfarint.com/terms-and-conditions"
              target="_blank"
            >
              Terms and Conditions
            </Link>{" "}
            &{" "}
            <Link
              style={{ textDecoration: "none", color: "var(--primary-color)" }}
              to="https://demo5.flyfarint.com/privacy-policy"
              target="_blank"
            >
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Box>

      <Lottie
        animationData={congratulations}
        loop={false}
        style={{
          height: "100vh",
          width: "100%",
          position: "absolute",
          bottom: "0",
          zIndex: "-1",
        }}
      />
    </Box>
  );
};

export const ContactOptions = ({ width }) => {
  const supportEmail = "support@flyfarint.com";
  const body = "Hello,\n\nI need help with...";

  const handleSendMail = () => {
    const subject = "Support Request";

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      supportEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");
  };

  const handleSendWhatsAppMessage = () => {
    const encodedMessage = encodeURIComponent(`${body}\n`);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://api.whatsapp.com/send?phone=${"880 1332 553 767"}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${"880 1332 553 767"}&text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  const phoneNumber = "+880 9666 721 921";

  const handleDial = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", width }}>
      {otpMethod.map((method, i) => (
        <Box
          key={i}
          sx={{
            width: { md: "30%", xs: "32%" },
            border: "1px solid",
            borderColor: "var(--border-color)",
            height: "110px",
            borderRadius: "5px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{ cursor: "pointer", px: "5px" }}
            onClick={() => {
              method?.text === "WhatsApp"
                ? handleSendWhatsAppMessage()
                : method?.text === "Mail Us"
                  ? handleSendMail()
                  : handleDial();
            }}
          >
            {React.cloneElement(method?.icon)}
            <Typography
              sx={{
                color: "var(--secondary-color)",
                px: "5px",
                fontSize: { md: "15px", xs: "13px" },
              }}
            >
              {method?.text}
            </Typography>
            <Typography
              sx={{ fontSize: { md: "12px", xs: "10px" }, lineHeight: "1.2" }}
            >
              {method?.label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const flexCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const lineStyle = {
  content: '""',
  position: "absolute",
  top: "50%",
  width: "200px",
  height: "1px",
  backgroundColor: "#D9D9D9",
  transform: "translateY(-50%)",
};

const otpMethod = [
  {
    via: "whatsapp",
    label: "+880 1332 553 767",
    text: "WhatsApp",
    icon: <WhatsAppIcon sx={{ color: "#5F6368", fontSize: "32px" }} />,
  },
  {
    via: "email",
    label: "support@flyfarint.com",
    text: "Mail Us",
    icon: <EmailIcon sx={{ color: "#5F6368", fontSize: "32px" }} />,
  },
  {
    via: "phone",
    label: "+880 9666 721 921",
    text: "More Options",
    icon: <FaHeadphonesSimple style={{ color: "#5F6368", fontSize: "30px" }} />,
  },
];

const socialProps = {
  target: "_blank",
  rel: "noreferrer",
  style: { display: "flex", alignItems: "center" },
};

const socialIcon = {
  fontSize: "27px",
  color: "var(--secondary-color)",
  marginRight: "2px",
};
export default CompleteRegistration;
