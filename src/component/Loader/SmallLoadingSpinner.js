import { CircularProgress } from "@mui/material";
import React from "react";

const SmallLoadingSpinner = () => {
  return (
    <>
      <CircularProgress size={20} style={{ color: "white" }} />
      <span style={{ marginLeft: "7px" }}>Please Waiting...</span>
    </>
  );
};

export default SmallLoadingSpinner;
