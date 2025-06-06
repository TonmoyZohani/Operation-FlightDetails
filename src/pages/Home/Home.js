import React, { lazy, Suspense, useEffect, useState } from "react";
import "./Home.css";
import { Box, Container, Typography } from "@mui/material";
import Loader from "../../component/Loader/Loader";
import Lottie from "lottie-react";
import maintenance from "../../assets/lottie/maintenance.json";
import DescriptionUnder from "../DescriptionBox/DescriptionUnder";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import secureLocalStorage from "react-secure-storage";
import useWindowSize from "../../shared/common/useWindowSize";

// Lazy load components
const Header = lazy(() => import("../Header/Header"));
const HomeTitle = lazy(() => import("../../component/HomeSearchBox/HomeTitle"));
const HomeSearchBox = lazy(
  () => import("../../component/HomeSearchBox/HomeSearchBox")
);
const DescriptionBox = lazy(() => import("../DescriptionBox/DescriptionBox"));
const MobileApp = lazy(() => import("../MobileApp/MobileApp"));
const Footer = lazy(() => import("../Footer/Footer"));

const Loading = () => (
  <div>
    <Loader />
  </div>
);

const Home = () => {
  const { isMobile } = useWindowSize();
  const navigate = useNavigate();
  const { agentToken } = useAuth();
  const token = agentToken || secureLocalStorage.getItem("agent-token");

  // State to track if the redirect check is done
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(null);

  useEffect(() => {
    if (token && sessionStorage.getItem("visited") !== "true") {
      sessionStorage.setItem("visited", "true");
      navigate("/dashboard/live", { replace: true });
    } else {
      setIsRedirecting(false); // Allow rendering once the check is complete
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/common/support/maintenance`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setIsMaintenance(result?.data[1]);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchData();
  }, []);

  // Show loader while redirecting
  if (isRedirecting) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      {isMaintenance?.status ? (
          <Box
            sx={{
              px: 2.7,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              py: 3,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: {
                    xs: "2rem",
                    md: "3.125rem",
                  },
                  textTransform: "uppercase",
                  fontWeight: 500,
                  lineHeight: "3.125rem",
                  my: {
                    xs: "2rem",
                    md: "4rem",
                  },
                  color: "var(--black)",
                }}
              >
                <span style={{ fontWeight: 100 }}>Under </span>Maintenance
              </Typography>
            </Box>
            <Box>
              <Lottie
                animationData={maintenance}
                loop={true}
                style={{ height: 400, width: 500 }}
              />
            </Box>
          </Box>
      ) : (
        <Box className="homePage-parent">
          <Header />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {!isMobile && <HomeTitle />}
          </Box>

          <Container maxWidth={1160}>
            <Box
              sx={{
                margin: "0 auto",
                width: {
                  xs: "100%",
                  md: "95%",
                },
              }}
            >
              <HomeSearchBox />
            </Box>
          </Container>

          <Container maxWidth={1160} sx={{ width: "90%", margin: "0 auto" }}>
            <DescriptionBox />
          </Container>

          <Box className="new-explore-more-body">
            <Container maxWidth={1160} sx={{ width: "90%", margin: "0 auto" }}>
              <DescriptionUnder />
            </Container>
          </Box>

          <Box sx={{ bgcolor: "#fff" }}>
            <Container maxWidth={1160} sx={{ width: "90%", margin: "0 auto" }}>
              <MobileApp />
            </Container>
          </Box>
          <Footer />
        </Box>
      )}
    </Suspense>
  );
};

export default Home;
