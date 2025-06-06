import {
  Container,
  List,
  ListItem,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginPortal from "../../component/LogIn/LogInPortal";
import RegisterPortal from "../../component/Register/RegisterPortal";
import { setSignUpDrawerOpen } from "../../component/Register/registerSlice";
import { useAuth } from "../../context/AuthProvider";
import { setAgentLogin, setAgentReg } from "../../features/registrationSlice";
import Logo from "../../images/logo/logowhite.png";
import LogoBlack from "../../images/svg/logoblack.svg";
import useWindowSize from "../../shared/common/useWindowSize";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const agentData = useSelector((state) => state.registration);
  const { pathname, search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const { agentToken } = useAuth();
  const { isMobile } = useWindowSize();
  const navigate = useNavigate();
  const login = queryParams.get("login");

  useEffect(() => {
    if (pathname === "/forget-password" || login === "true") {
      dispatch(setAgentLogin({ isOpen: true }));
    }
  }, [login]);

  return (
    <>
      {isMobile ? (
        <Box sx={{ flexGrow: 1 }}>
          <Box position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link
                  style={{
                    height: pathname !== "/" && "5.5rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  to="/"
                >
                  <img
                    alt="logo-not-found"
                    src={pathname === "/" ? Logo : LogoBlack}
                    width={pathname !== "/" ? "105px" : "120px"}
                  />
                </Link>
              </Typography>

              {agentToken ? (
                <Button
                  size="small"
                  onClick={() => navigate("/dashboard/live")}
                  sx={{
                    color: pathname === "/" ? "#fff" : "var(--secondary-color)",
                    fontSize: "13px",
                    textTransform: "none",
                    border: "2px solid",
                    borderColor:
                      pathname === "/" ? "#fff" : "var(--secondary-color)",
                    height: "38px",
                    px: "15px",
                    fontWeight: 500,
                  }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    fontSize: "14px",
                    color: "#FFFFFF",
                    px: 2,
                    bgcolor: "var(--primary-color)",
                    ":hover": { bgcolor: "var(--primary-color)" },
                    textTransform: "capitalize",
                    height: "38px",
                  }}
                  onClick={() => dispatch(setAgentLogin({ isOpen: true }))}
                >
                  Login
                </Button>
              )}
            </Toolbar>
          </Box>
          {/* <SwipeableDrawer
            anchor="right"
            open={agentData?.agentLogin?.isOpen}
            PaperProps={{
              sx: { width: "100%", zIndex: 999999999 },
            }}
          >
            {agentData?.agentLogin?.isOpen && <LoginPortal />}
          </SwipeableDrawer>

          <SwipeableDrawer
            anchor="right"
            open={agentData?.agentReg?.isOpen}
            PaperProps={{
              sx: { width: "100%", zIndex: 999999999 },
            }}
          >
            {agentData?.agentReg?.isOpen && <RegisterPortal />}
          </SwipeableDrawer> */}
        </Box>
      ) : (
        <Container sx={{ px: { xs: 2 } }}>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Grid item md={2} sm={2}>
              <Box
                sx={{
                  height: pathname !== "/" && "5.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Link to="/">
                  <img
                    alt="logo-not-found"
                    src={
                      pathname === "/" || pathname === "/forget-password"
                        ? Logo
                        : LogoBlack
                    }
                    width={"130px"}
                    // style={{ marginLeft: pathname !== "/" && "10px" }}
                  />
                </Link>
              </Box>
            </Grid>
            <Grid item md={5}>
              <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
                {agentToken ? (
                  <Button
                    onClick={() => navigate("/dashboard/live")}
                    sx={{
                      color:
                        pathname === "/" || pathname === "/forget-password"
                          ? "#fff"
                          : "var(--secondary-color)",
                      fontSize: "13px",
                      textTransform: "none",
                      border: "2px solid",
                      borderColor:
                        pathname === "/" || pathname === "/forget-password"
                          ? "#fff"
                          : "var(--secondary-color)",
                      height: "38px",
                      px: "15px",
                      fontWeight: 500,
                    }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() =>
                        dispatch(setAgentReg({ field: "isOpen", value: true }))
                      }
                      sx={{
                        color:
                          pathname === "/" || pathname === "/forget-password"
                            ? "#fff"
                            : "var(--secondary-color)",
                        fontSize: "13px",
                        textTransform: "none",
                        border: "2px solid",
                        borderColor:
                          pathname === "/" || pathname === "/forget-password"
                            ? "#fff"
                            : "var(--secondary-color)",
                        height: "38px",
                        px: "15px",
                        fontWeight: 500,
                      }}
                    >
                      Travel Agency Registration
                    </Button>
                    <Button
                      onClick={() => dispatch(setAgentLogin({ isOpen: true }))}
                      sx={{
                        color: "#fff",
                        fontSize: "13px",
                        textTransform: "none",
                        bgcolor: "var(--primary-color)",
                        px: "30px",
                        height: "38px",
                        ":hover": { bgcolor: "var(--primary-color)" },
                      }}
                    >
                      Sign in
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      )}

      <SwipeableDrawer
        anchor="right"
        open={agentData?.agentReg?.isOpen}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : "50%",
            zIndex: 999999999,

            "@media (max-width: 1600px)": {
              width: "60%",
            },
            "@media (min-width: 1601px)": {
              width: "60%",
            },
          },
        }}
      >
        {agentData?.agentReg?.isOpen && <RegisterPortal />}
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="right"
        open={agentData?.agentLogin?.isOpen}
        PaperProps={{
          sx: { width: isMobile ? "100%" : "50%", zIndex: 999999999 },
        }}
      >
        {agentData?.agentLogin?.isOpen && <LoginPortal />}
      </SwipeableDrawer>

      {/* Mobile menu */}
      <SwipeableDrawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpen={() => setMobileMenuOpen(true)}
        PaperProps={{
          sx: {
            width: "55%",
            bgcolor: "#003566",
            height: "100%",
          },
        }}
      >
        {mobileMenuOpen && (
          <Box
            sx={{
              width: "100%",
              bgcolor: "#003566",
              height: "100%",
              position: "relative",
            }}
            role="presentation"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={() => setMobileMenuOpen(false)}
          >
            <List>
              <ListItem
                sx={{ borderRadius: "0px 3px 3px 0px" }}
                onClick={() => dispatch(setSignUpDrawerOpen(true))}
              >
                <img alt="logo-not-found" src={Logo} width="118px" />
              </ListItem>
              <ListItem
                sx={{
                  bgcolor: "var(--primary-color)",
                  borderRadius: "0px 3px 3px 0px",
                }}
                onClick={() => dispatch(setSignUpDrawerOpen(true))}
              >
                <Typography sx={{ color: "white", fontSize: "15px" }}>
                  {" "}
                  Flight
                </Typography>
              </ListItem>
              <ListItem sx={{ my: "10px", borderRadius: "3px 0px 0px 3px" }}>
                <Typography sx={{ color: "white", fontSize: "15px" }}>
                  PNR Import
                </Typography>
              </ListItem>
              <ListItem sx={{ my: "10px", borderRadius: "3px 0px 0px 3px" }}>
                <Typography sx={{ color: "white", fontSize: "15px" }}>
                  Group Fare
                </Typography>
              </ListItem>
              <ListItem sx={{ my: "10px", borderRadius: "3px 0px 0px 3px" }}>
                <Typography sx={{ color: "white", fontSize: "15px" }}>
                  Hotel
                </Typography>
              </ListItem>
              <ListItem sx={{ my: "10px", borderRadius: "3px 0px 0px 3px" }}>
                <Typography sx={{ color: "white", fontSize: "15px" }}>
                  Tour
                </Typography>
              </ListItem>
              <ListItem sx={{ my: "10px", borderRadius: "3px 0px 0px 3px" }}>
                <Typography sx={{ color: "white", fontSize: "15px" }}>
                  Visa
                </Typography>
              </ListItem>
            </List>
            {/* Placing bottom items */}
            <ListItem
              sx={{
                bgcolor: "transparent",
                borderTop: "2px solid #fff",
                borderBottom: "2px solid #fff",
                mb: "auto",
                position: "absolute",
                bottom: 60,
                left: 0,
                right: 0,
              }}
              onClick={() =>
                dispatch(setAgentReg({ field: "isOpen", value: true }))
              }
            >
              <Typography sx={{ color: "white", fontSize: "12px" }}>
                Travel Agency Registration
              </Typography>
            </ListItem>
            <ListItem
              sx={{
                bgcolor: "var(--primary-color)",
                mt: "10px",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
              onClick={() => dispatch(setAgentLogin({ isOpen: true }))}
            >
              <Typography sx={{ color: "white", fontSize: "12px" }}>
                Sign In
              </Typography>
            </ListItem>
          </Box>
        )}
      </SwipeableDrawer>
    </>
  );
};

export default Header;
