import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import CustomAlert from "../component/Alert/CustomAlert";
import MainLoader from "../component/Loader/MainLoader";

const LoaderPage = () => {
  useEffect(() => {
    // Triggering the CustomAlert on component mount
    CustomAlert({ success: "warning", message: "Are you sure?" });
  }, []);

  return (
    <Box sx={{ height: "100vh" }}>
      <MainLoader />
    </Box>
  );
};

export default LoaderPage;
