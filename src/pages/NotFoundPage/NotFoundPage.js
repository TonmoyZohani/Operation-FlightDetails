import { Box, Container } from "@mui/material";
import React from "react";
import Header from "../Header/Header";
import { Link, useLocation } from "react-router-dom";
// import CrashAirplane from "../../images/svg/crushAirplane.svg";
import Footer from "../Footer/Footer";
import Lottie from "lottie-react";
import NotFoundFile from "../../assets/lottie/404.json";

const NotFoundPage = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <Box>
      <Container
        sx={{ bgcolor: isDashboardRoute ? "var(--white)" : "transparent" }}
      >
        {!isDashboardRoute && <Header />}

        <Box
          mt={{ xs: isDashboardRoute ? 0 : 3 }}
          sx={{
            minHeight: isDashboardRoute && "88vh",
            px: 2.7,
            position: "relative",
            display: "flex",
            flexDirection: "column-reverse",
            justifyContent: "center",
            alignItems: "center",
            py: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link
              to={isDashboardRoute ? "/dashboard/live" : "/"}
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white",
                padding: "5px 15px",
                textDecoration: "none",
                display: "inline-block",
                marginTop: 20,
                borderRadius: "5px",
                fontSize: "0.9rem",
                letterSpacing: "1px",
              }}
              size="small"
            >
              {!isDashboardRoute ? "BACK TO HOME PAGE" : "BACK TO DASHBOAD"}
            </Link>
          </Box>

          <Box>
            <Lottie
              animationData={NotFoundFile}
              loop={true}
              style={{ height: 400, width: 500 }}
            />
          </Box>
        </Box>

        {!isDashboardRoute && <Footer />}
      </Container>
    </Box>
  );
};

export default NotFoundPage;
