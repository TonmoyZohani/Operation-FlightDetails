import { Box, Typography } from "@mui/material";
import "./HomeSearchBox.css";
import React from "react";

const HomeTitle = () => {
  return (
    <Box
      className="searchBar-header"
      sx={{
        pt: { xs: "2rem", sm: "2rem", md: "2.5rem" },
        width: { lg: "100%", md: "85vw", sm: "90vw", xs: "90vw" },
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontSize: {
            xs: "1.5rem",
            sm: "2rem",
            md: "2.3rem",
            lg: "3.438rem",
          },
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        DESIGNED FOR{" "}
        <b style={{ color: "var(--secondary-gradient)" }}>AGENCY MANAGEMENT</b>
      </Typography>
    </Box>
  );
};

export default HomeTitle;
