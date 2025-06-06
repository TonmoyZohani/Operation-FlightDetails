import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import React from "react";
import useWindowSize from "../../shared/common/useWindowSize";
import line from "../../images/descriptionPage/line.png";
import FlightIcon from "@mui/icons-material/Flight";

const DescriptionUnder = () => {
  const { isMobile } = useWindowSize();
  return (
    <Box
      sx={{
        minHeight: { xs: "820px", sm: "700px", md: "700px", lg: "610px" },
        height: "100%",
        display: { lg: "flex" },
        alignItems: "center",
        mt: { xs: 10, lg: "-150px" },
        pt: isMobile ? 0 : 10,
      }}
    >
      <Grid
        container
        sx={{ alignItems: "center", justifyContent: "space-between" }}
        rowSpacing={5}
      >
        <Grid item xs={12} sm={12} md={12} lg={7}>
          <Box>
            <Box className="img-text3">
              <img src={line} alt="line" />{" "}
              <span style={{ fontSize: "14px" }}>Why Choose Us</span>
            </Box>
            <Typography sx={{ fontSize: { lg: "40px", xs: "35px" } }}>
              Why Fly Far International?
            </Typography>
            <Typography className="finest" color={"#fff"} mt={1} mb={1}>
              We Believe all Challenges Are Ours, Profits and Branding Are Yours
            </Typography>
            <Typography
              sx={{ fontSize: { md: "13px", lg: "13px", xs: "12.5px" } }}
            >
              With 8 years of experience, Fly Far International has created a
              free solution tailored for new and mid-level entrepreneurs. Our
              zero-capital investment model maximizes profits, enhances
              branding, reduces operational costs, and provides essential tools
              for accounts and administration, making business operations
              simpler and fostering seamless growth.
            </Typography>

            <Box className="get-ticket-butto" mt={4}>
              <Link to={"/about-us"} style={{ textDecoration: "none" }}>
                <Button
                  className="explore-more-btn"
                  sx={{
                    fontSize: "13px",
                    py: "6px",
                    textTransform: "none",
                  }}
                >
                  Explore More
                  <FlightIcon
                    sx={{
                      color: "#fff",
                      fontSize: "20px",
                      transform: "rotate(90deg)",
                      marginLeft: "10px",
                    }}
                  />
                </Button>
              </Link>
            </Box>
          </Box>
        </Grid>

        <Grid
          container
          item
          xs={12}
          sm={12}
          md={12}
          lg={3.5}
          sx={{
            display: "flex",
            justifyContent: {
              xs: "center",
              lg: "flex-end",
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Paper className="explore-card">
                <Box>
                  <Box className="c-card">
                    <CountUp end={1200} />+
                  </Box>
                  Airlines Inventory
                </Box>
              </Paper>
              <Paper className="explore-card">
                <Box>
                  <Box className="c-card">
                    <CountUp end={60} />
                    K+
                  </Box>
                  Hotel Inventory
                </Box>
              </Paper>
            </Box>

            <Box sx={{ display: "flex", gap: "10px" }}>
              <Paper className="explore-card">
                <Box>
                  <Box className="c-card">
                    <CountUp end={200} />+
                  </Box>
                  Smart Automation Tools
                </Box>
              </Paper>

              <Paper className="explore-card">
                <Box>
                  <Box className="c-card">
                    <CountUp end={150} />+
                  </Box>{" "}
                  Travel Package
                </Box>
              </Paper>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DescriptionUnder;
