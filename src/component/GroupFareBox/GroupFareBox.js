import { Box, Typography, Button, Grid, Alert } from "@mui/material";
import React from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { IoIosPaperPlane } from "react-icons/io";
import { ReactComponent as DropDownIcon } from "../../images/svg/dropdown.svg";

const GroupFareBox = () => {
  return (
    <Box>
      <Grid
        container
        item
        lg={12}
        sx={{
          mb: "12px",
        }}
      >
        {/* Todo: Departure From */}
        <Grid
          item
          className="dashboard-main-input-parent des-grid"
          xs={12}
          sm={12}
          md={12}
          lg={3}
          sx={{
            mb: {
              lg: "0px",
              md: "15px",
              sm: "15px",
              xs: "15px",
            },
          }}
        >
          <Box
            className="update-search1"
            bgcolor="#fff"
            sx={{
              borderRadius: {
                lg: "5px 0px 0px 5px",
                md: "5px",
                sm: "5px",
                xs: "5px",
              },
              borderBottom: { lg: "none", xs: "1px solid #E7F3FE" },
            }}
          >
            <Box style={{ position: "relative", bgcolor: "red" }}>
              <p>From</p>
              <span className="addressTitle">Dhaka</span>
            </Box>
            <Box
              style={{
                lineHeight: "0px",
              }}
            >
              <input
                required
                readOnly
                value="Hazrat Shahjalal Intl Airport (DAC)"
                style={{
                  border: "none",
                  width: "100%",
                  color: "#003566",
                  backgroundColor: "transparent",
                  fontSize: "12px",
                  outline: "none",
                }}
              />
            </Box>
          </Box>

          <Box
            className="swap-btn2"
            sx={{
              display: "flex",
              zIndex: 9,
            }}
          >
            <AiOutlineSwap style={{ color: "#fff", fontSize: "20px" }} />
          </Box>
        </Grid>

        {/* Todo: Departure-To */}
        <Grid
          className="dashboard-main-input-parent des-grid"
          item
          xs={12}
          sm={12}
          md={12}
          lg={3}
          sx={{
            position: "relative",
            mb: {
              lg: "0px",
              md: "15px",
              sm: "15px",
              xs: "15px",
            },
          }}
        >
          <Box
            className="update-search1"
            bgcolor="#fff"
            sx={{
              borderBottom: { lg: "none", xs: "1px solid #E7F3FE" },
              borderRadius: {
                lg: "0px",
                md: "5px",
                sm: "5px",
                xs: "5px",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                paddingLeft: { xs: "0px", lg: "5px" },
              }}
            >
              <p>To</p>
              <span
                className="addressTitle"
                style={{
                  color: "#dc143c",
                }}
              >
                Cox's Bazar
              </span>
            </Box>
            <Box
              sx={{
                lineHeight: "0px",
                paddingLeft: { xs: "0px", lg: "6px" },
              }}
            >
              <input
                required
                readOnly
                value="Cox's Bazar Airport (CXB)"
                style={{
                  border: "none",
                  width: "100%",
                  color: "#003566",
                  backgroundColor: "transparent",
                  fontSize: "12px",
                  outline: "none",
                }}
              />
            </Box>
          </Box>
        </Grid>

        <Grid
          className="dashboard-main-input-parent"
          item
          xs={12}
          lg={3}
          style={{
            position: "relative",
            height: "73px",
            borderRight: { lg: "1px solid #DEDEDE", xs: "none" },
          }}
          sx={{
            mb: {
              lg: "0px",
              xs: "15px",
            },
          }}
        >
          <Box
            className="update-search1"
            bgcolor="#fff"
            sx={{
              borderRadius: {
                lg: "0px 5px 5px 0px",
                xs: "5px",
              },
              borderBottom: { lg: "none", xs: "1px solid #E7F3FE" },
            }}
          >
            <Box
              className="dashboard-main-input date12"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginTop: "0px",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  width: "50%",
                  cursor: "pointer",
                  lineHeight: 1.5,
                }}
              >
                <p>Departure</p>
                <span className="addressTitle" style={{ paddingTop: "2px" }}>
                  08 May 25
                </span>

                <Typography
                  variant="subtitle2"
                  style={{ color: "#003566", fontSize: "12px" }}
                >
                  Thursday
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid
          container
          item
          md={12}
          lg={3}
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid item sm={6} md={12} lg={8.8}>
            <Box
              className="update-search1"
              bgcolor="#fff"
              sx={{
                borderRadius: {
                  lg: "0px 5px 5px 0px",
                  xs: "0px 0px 0px 0px",
                },
                borderLeft: { lg: "1px solid #DEDEDE", xs: "none" },
              }}
            >
              <Box sx={{ cursor: "pointer" }} className="traveler-count">
                <Button
                  sx={{
                    justifyContent: "flex-start",
                    color: "#000",
                    display: "block",
                  }}
                >
                  <p>Travelers</p>

                  <span style={{ fontSize: "17px" }}>2 Traveler</span>

                  <Typography
                    variant="subtitle2"
                    style={{
                      color: "#003566",
                      fontSize: "12px",
                      lineHeight: "10px",
                    }}
                  >
                    2 ADT
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item lg={2.2}>
            <Box
              sx={{
                height: "73px",
                width: "100% ",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                className="shine-effect"
                sx={{
                  height: "100%",
                  width: "100%",
                  mt: { md: "0px", sm: "10px", xs: "10px" },
                  textTransform: "capitalize",
                  display: "flex",
                  flexDirection: {
                    md: "column",
                    sm: "row",
                    xs: "row",
                  },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
                style={{
                  background: "#f0627e",
                  color: "white",
                }}
                disabled={true}
              >
                <IoIosPaperPlane style={{ fontSize: "20px" }} />
                <Box>{"Search"}</Box>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item lg={5} xs={12}>
          <Box sx={{ position: "relative", height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                height: "40px",
                px: "10px",
                borderRadius: "3px",
                bgcolor: "#fff",
              }}
            >
              <Typography sx={{ fontSize: "12px", color: "#8C8080" }}>
                Select Preferred Airlines
              </Typography>

              <DropDownIcon {...iconProps} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          ".MuiSvgIcon-root": { color: "#1e462e" },
          mt: 3,
        }}
      >
        <Alert
          severity="info"
          sx={{
            border: "1px solid #1e462e",
            bgcolor: "#EDF7ED",
            color: "#1e462e",
            fontSize: "12px",
            padding: "0px 10px",
          }}
        >
          <span style={{ fontWeight: "600" }}>Notice:</span> We would like to
          inform you that the{" "}
          <b style={{ fontWeight: "600" }}> Group Fare Module </b> is currently
          under development and not yet available for use. Our technical team is
          actively working to complete the necessary configurations and
          enhancements to ensure optimal functionality and user experience.We
          appreciate your patience and understanding during this period. A
          formal update will be provided once the module is fully operational.
          <div style={{ marginTop: "8px" }}>
            For any immediate concerns or assistance, please do not hesitate to
            contact our support team.
          </div>
        </Alert>
      </Box>
    </Box>
  );
};

const iconProps = {
  width: "15px",
  height: "10px",
  fill: "var(--secondary-color)",
};

export default GroupFareBox;
