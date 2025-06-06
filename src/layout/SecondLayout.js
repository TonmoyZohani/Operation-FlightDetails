import { Box } from "@mui/material";
import React from "react";
import Header from "../pages/Header/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../pages/Footer/Footer";

const SecondLayout = () => {
  const { pathname } = useLocation();
  return (
    <Box sx={{ background: "white" }}>
      <Box>{pathname !== "/" && <Header />}</Box>
      <Outlet />
      {pathname !== "/" && <Footer />}
    </Box>
  );
};

export default SecondLayout;
