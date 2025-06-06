import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import "./DescriptionBox.css";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CreateIcon from "@mui/icons-material/Create";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Card = ({ id, title, description, isHovered, setIsHovered, icon }) => {
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
    height: { xs: "280px", lg: "320px" },
    cursor: "pointer",
    transition: "background-color 0.2s, color 0.1s",
  };

  return (
    <Box
      sx={cardStyle}
      onMouseEnter={() => setIsHovered(id)}
      // onMouseLeave={() => setIsHovered(1)}
    >
      <Box
        className="visaImg"
        style={{ background: isHovered === id ? "transparent" : "#d9d9d9" }}
      >
        {icon}
      </Box>
      <Box sx={{ textAlign: "center", pt: 3, pb: 2 }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "12px",
            pt: "8px",
            color: isHovered === id ? "#555" : "#dad6d6",
            letterSpacing: "0.5px",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

const DescriptionBox = () => {
  const [isHovered, setIsHovered] = useState(1);

  return (
    <>
      <Box sx={{ mt: { xs: 9, sm: 9, md: 9, lg: 15 } }}>
        <Grid
          container
          columnSpacing={{ sm: 3.5 }}
          rowSpacing={3.5}
          sx={{ justifyContent: "center" }}
        >
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card
              id={1}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              title={
                <>
                  Secure and Hassle-Free <br /> Booking System
                </>
              }
              description="Revolutionize your bookings with our fast, secure, and reliable B2B solution. Unlock real-time inventory, unbeatable fares, and seamless ticketing—effortless, efficient, and ready to elevate your business!"
              icon={
                <AirplaneTicketIcon sx={{ color: "var(--secondary-color)" }} />
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card
              id={2}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              title={
                <>
                  Large Inventory with GDS, <br /> LCC and NDC
                </>
              }
              description="Access the skies like never before! Instantly connect to a world of airlines—GDS, LCC, and NDC—offering unbeatable fares and seamless bookings, all in one place. Your gateway to limitless selection opportunities to explore!"
              icon={
                <TravelExploreIcon sx={{ color: "var(--secondary-color)" }} />
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card
              id={3}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              title={
                <>
                  Advanced Branch & Staff <br /> Management System
                </>
              }
              description="Easily organize branch operations, oversee staff activities, and ensure smooth workflows—all from a single platform. Built for precision and scalability, this system is your key to smarter management and unlocking new growth opportunities."
              icon={<CreateIcon sx={{ color: "var(--secondary-color)" }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card
              id={4}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              title={
                <>
                  24/7 Support for Travel
                  <br /> Agencies
                </>
              }
              description="Stay stress-free with our round-the-clock dedicated support. From booking assistance to resolving travel-related queries, our expert team is always ready to help. Focus on growing your business while we guarantee smooth and uninterrupted operations every step of the way."
              icon={
                <SupportAgentIcon sx={{ color: "var(--secondary-color)" }} />
              }
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DescriptionBox;
