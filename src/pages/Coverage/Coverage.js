import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Bangladesh from "../../images/svg/bangladesh.svg";
import Global from "../../images/svg/global.svg";
import "./coverage.css";
const locations = [{ top: "40%", left: "76.5%" }];
const locationsBg = [{ top: "51%", left: "47%" }];

const Coverage = () => {
  const [value, setValue] = useState("bangladesh");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Box
      sx={{
        mx: {
          xs: "1rem",
        },
      }}
    >
      <Container>
        <Box
          sx={{
            minHeight: "40vh",
            mb: {
              xs: "10rem",
              md: "5rem",
            },
          }}
        >
          <Typography sx={style.header}>
            <span style={{ fontWeight: 100 }}>OUR </span> COVERAGE
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="wrapped label tabs example"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "var(--secondary-color)",
                  color: "var(--secondary-color)",
                },
              }}
            >
              <Tab
                value="bangladesh"
                label="Bangladesh"
                sx={{ ...style.tab, pl: 0, textTransform: "capitalize" }}
              />
              <Tab
                value="global"
                label="Global"
                sx={{ ...style.tab, px: 4, textTransform: "capitalize" }}
              />
            </Tabs>
          </Box>
          {value === "bangladesh" && (
            <Box
              sx={{
                pt: 5,
                display: "flex",
                justifyContent: "center",
                height: {
                  xs: "450px",
                  md: "700px",
                },
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={Bangladesh}
                alt="Bangladesh"
                style={{
                  position: "relative",
                  width: {
                    xs: "100%",
                    md: "200%",
                  },
                  height: "auto",
                }}
              />

              {locationsBg.map((location, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    top: location.top,
                    left: location.left,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  {/* Bangladesh Text */}
                  <Typography
                    sx={{
                      marginTop: {
                        xs: "-20px",
                        md: "-25px",
                      },
                      fontSize: {
                        xs: "10px",
                        md: "12px",
                      },
                      textAlign: "center",
                      bgcolor: "var(--primary-color)",
                      borderRadius: "4px",
                      px: 1,
                      py: 0.4,
                      color: "white",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    Dhaka
                  </Typography>
                  {/* Radar Sweep */}
                  <Box className="radar-sweep" />

                  {/* Location Indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
          {value === "global" && (
            <Box
              sx={{
                pt: 5,
                display: "flex",
                justifyContent: "center",
                height: {
                  xs: "250px",
                  md: "700px",
                },
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={Global}
                alt="Global"
                style={{
                  position: "relative",
                  width: {
                    xs: "100%",
                    md: "200%",
                  },
                  height: "auto",
                }}
              />

              {locations.map((location, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    top: location.top,
                    left: location.left,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  {/* Bangladesh Text */}
                  <Typography
                    sx={{
                      marginTop: {
                        xs: "-25px",
                        md: "-30px",
                      },
                      fontSize: {
                        xs: "10px",
                        md: "12px",
                      },
                      textAlign: "center",
                      bgcolor: "var(--primary-color)",
                      borderRadius: "4px",
                      px: {
                        xs: 1,
                        md: 2,
                      },
                      py: 0.5,
                      color: "white",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    Bangladesh
                  </Typography>
                  {/* Radar Sweep */}
                  <Box className="radar-sweep" />

                  {/* Location Indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

const style = {
  tab: {
    borderBottom: 2,
    color: "var(--gray)",
    fontWeight: 600,
    "&.Mui-selected": {
      color: "var(--secondary-color)",
    },
  },
  header: {
    fontSize: {
      xs: "2rem",
      md: "3.125rem",
    },
    fontWeight: 500,
    lineHeight: "3.125rem",
    my: {
      xs: "2rem",
      md: "4rem",
    },
    color: "var(--black)",
  },
};

export default Coverage;
