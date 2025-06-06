import { Box } from "@mui/material";
import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DiscFullIcon from "@mui/icons-material/DiscFull";
import { Outlet } from "react-router-dom";

const DashboardMobileHome = () => {
  return (
    <Box>
      <Outlet></Outlet>
      <Box
        sx={{
          bgcolor: "#fff",
          height: "60px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "84%",
            height: "9px",
            bgcolor: "var(--primary-color)",
            borderRadius: "2px",
            position: "relative",
          }}
        ></Box>

        <Box>
          <Box
            sx={{
              bgcolor: "var(--primary-color)",
              borderRadius: "50px",
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: "0px",
            }}
          >
            <HomeOutlinedIcon
              sx={{
                fontSize: "25px",
                color: "white",
              }}
            />
          </Box>

          <SearchOutlinedIcon
            sx={{
              fontSize: "22px",
            }}
          />
          <DiscFullIcon
            sx={{
              fontSize: "22px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardMobileHome;
