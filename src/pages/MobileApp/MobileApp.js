import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { ReactComponent as AppleAppStore } from "../../images/svg/AppleAppStore.svg";
import { ReactComponent as FFInt } from "../../images/svg/FFIntUpdated.svg";
import { ReactComponent as MobileAppIcon } from "../../images/svg/mobileAppUpdated.svg";
import { ReactComponent as PlayStore } from "../../images/svg/PlayStore.svg";
import useWindowSize from "../../shared/common/useWindowSize";

const MobileApp = () => {
  const { isMobile } = useWindowSize();

  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#fff",
        mb: { xs: "150px", md: 0 },
        pb: { xs: "2rem" },
      }}
    >
      <Box sx={{ position: "relative", px: "0px" }}>
        <Grid
          container
          rowSpacing={5}
          pb={2.5}
          spacing={3}
          sx={{
            "& > .MuiGrid-item": {
              paddingLeft: "0px !important",
              paddingRight: "0px !important",
            },
          }}
        >
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                flexDirection: { xs: "column", md: "column", sm: "column" },
              }}
            >
              <MobileAppIcon
                style={{
                  width: isMobile ? "70%" : "90%",
                  height: isMobile ? "70%" : "60%",
                }}
              />
            </Box>
          </Grid>

          <Grid item md={12} lg={4}>
            <Box sx={{ mt: { xs: 0, md: 0, lg: 12 } }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  fontWeight: "700",
                  textAlign: { xs: "center", md: "center", lg: "start" },
                }}
              >
                Download Mobile App
              </Typography>
              <Typography
                sx={{
                  fontSize: {
                    xs: "13px",
                    xs: "12.5px",
                  },
                  textAlign: { xs: "center", md: "center", lg: "start" },
                  px: { xs: "10px", md: "83px", lg: "0px" },
                }}
              >
                Stay connected to your agency anytime, whether you're on the
                move or traveling in a car. For the first time, Fly Far
                International introduces a complete Travel Agency Management OTA
                App, empowering you to manage operations, book flights, and
                monitor seamlessly on the go. Download now for real-time updates
                and effortless control.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: "15px",
                  mt: 3,
                  justifyContent: {
                    lg: "flex-start",
                    md: "center",
                    sm: "center",
                    xs: "center",
                  },
                }}
              >
                <a
                  target="_blank"
                  href="https://flyfarint.net/"
                  rel="noreferrer"
                >
                  <PlayStore style={{ width: "120px", height: "auto" }} />
                </a>
                <a
                  target="_blank"
                  href="https://flyfarint.net/"
                  rel="noreferrer"
                >
                  <AppleAppStore style={{ width: "120px", height: "auto" }} />
                </a>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: { xs: "none", xl: "block" },
            position: "absolute",
            left: "-165px",
            top: "53%",
            transform: "translateY(-50%)",
          }}
        >
          <FFInt />
        </Box>
      </Box>
    </Box>
  );
};

export default MobileApp;
