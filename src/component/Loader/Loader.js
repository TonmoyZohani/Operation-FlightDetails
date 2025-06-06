import React from "react";
import "./Loader.css"; 
import { Rings } from "react-loader-spinner";
import { Box } from "@mui/material";

const Loader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Rings
        visible={true}
        height="100"
        width="100"
        color="#dc143c"
        ariaLabel="rings-loading"
        wrapperStyle={{}}
        wrapperClass=""
        animationDuration={0.1}
      />
    </Box>
  );
};

export default Loader;
