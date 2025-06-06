import React, { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate,useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import secureLocalStorage from "react-secure-storage";
import OTP from "./OTP";
import { jwtDecode } from "jwt-decode";

const TestLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginData, setLoginData] = useState({});
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const encodeToBase64 = (str) => {
    const utf8Bytes = new TextEncoder().encode(str);
    return btoa(String.fromCharCode(...utf8Bytes));
  };

  const decodeFromBase64 = (base64) => {
    const decodedData = atob(base64);
    return new TextDecoder().decode(
      Uint8Array.from([...decodedData].map((c) => c.charCodeAt(0)))
    );
  };

  const loginUser = async (loginData, otp, location, navigate) => {
    try {
      setIsLoading(false);
      const body = JSON.stringify({
        email: encodeToBase64(loginData.email),
        password: encodeToBase64(loginData.password),
        otp: encodeToBase64(otp),
      });
      const url = "https://api.flyfarint.com/v.1.0.0/Admin/Auth/verifyOtp.php";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: body,
      });

      const data = JSON.parse(decodeFromBase64(await response.json()));

      if (data && data?.status === "success") {
        const token = data.token;
        const userData = jwtDecode(token);

        secureLocalStorage.setItem("user-info", userData);
        secureLocalStorage.setItem("token", token);

        const destination = "/";
        navigate(destination);
        navigate(0);
      } else {
        throw new Error(data?.message);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(true);
    }
  };

  const sendOTP = async (loginData) => {
    try {
      setIsLoading(false);
      const body = JSON.stringify({
        email: encodeToBase64(loginData.email),
        password: encodeToBase64(loginData.password),
        otp: encodeToBase64(405832),
      });
      const url = "https://api.flyfarint.com/v.1.0.0/Admin/Auth/sendOtp.php";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: body,
      });

      const data = JSON.parse(decodeFromBase64(await response.json()));
      if (data && data?.status === "success") {
        return data;
      } else {
        throw new Error(data?.message);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(true);
    }
  };

  const handleOnChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const newLoginData = { ...loginData };
    newLoginData[field] = value;
    setLoginData(newLoginData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await sendOTP(loginData, location, navigate);
    if (response?.status === "success") {
      setOtpModalOpen(true);
    }
    e.target.reset();
  };

  const handleOtpVerify = (otp) => {
    loginUser(loginData, otp, location, navigate);
    setOtpModalOpen(false);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Box
              sx={{
                background: "#161A23",
                minHeight: "100vh",
                color: "white",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: "80px" }}>Welcome</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Box
              sx={{
                background: "#003566 !important",
                minHeight: "100vh",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  input: {
                    width: "calc(100% - 20px)",
                    border: "none",
                    padding: "10px",
                    borderRadius: "4px",
                  },
                }}
              >
                <Typography sx={{ fontSize: "35px" }}>
                  Login to your account
                </Typography>
                <Box style={{ overflow: "hidden" }}>
                  <Typography mt={3}>Your Email</Typography>
                  <input
                    required
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleOnChange}
                  />
                </Box>
                <Box style={{ overflow: "hidden" }}>
                  <Typography mt={1}>Your Password</Typography>
                  <input
                    required
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleOnChange}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    type="submit"
                    disabled={isLoading ? false : true}
                    sx={{
                      background: "#161A23 !important",
                      color: "white",
                      borderRadius: "4px",
                      mt: "25px",
                      width: "200px",
                      "&:hover": {
                        background: "#161A23",
                        color: "white",
                      },
                    }}
                  >
                    {isLoading ? "Log In" : "Logging in..."}
                  </Button>
                </Box>
                <Box sx={{ position: "relative" }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      position: "absolute",
                      top: "200px",
                      right: "0",
                      color: "white",
                      ml: "120px",
                      cursor: "pointer",
                    }}
                  >
                    &copy; {new Date().getFullYear()} Fly Far International All
                    right reserved
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
      <OTP
        open={otpModalOpen}
        handleClose={() => setOtpModalOpen(false)}
        handleVerify={handleOtpVerify}
      />
    </Box>
  );
};

export default TestLogin;
