import React from "react";
import { Box, Typography } from "@mui/material";

const Card = ({ id, title, description, image, isHovered, setIsHovered }) => {
  const cardStyle = {
    background:
      isHovered === id
        ? "white"
        : "linear-gradient(141.81deg, #376187 4.69%, #063a6a 100%)",
    border: "3px solid #dedede",
    WebkitBackdropFilter: "blur(80px)",
    backdropFilter: "blur(80px)",
    borderRadius: "8px",
    color: isHovered === id ? "var(--secondary-color)" : "#ffffff",
    padding: "10px",
    height: "320px",
    cursor: "pointer",
    transition: "background-color 0.2s, color 0.1s",
  };

  return (
    <Box
      style={cardStyle}
      onMouseEnter={() => setIsHovered(id)}
      // onMouseLeave={() => setIsHovered(1)}
    >
      <Box
        className="visaImg"
        style={{ background: isHovered === id ? "transparent" : "#d9d9d9" }}
      >
        <img style={{ width: "25px", height: "25px" }} src={image} alt="icon" />
      </Box>
      <Box className="visa-cont">
        <Typography
          sx={{
            fontSize: {
              xs: "18px",
              sm: "16px",
              md: "10px",
              lg: "16px",
              xl: "17px",
            },
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: { sm: "11px", md: "12px", xs: "12px" },
            pt: "8px",
            color: isHovered === id ? "#555" : "#dad6d6",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default Card;
