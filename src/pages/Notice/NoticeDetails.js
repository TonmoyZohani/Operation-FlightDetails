import { Box, Typography } from "@mui/material";
import React from "react";
import PageTitle from "../../shared/common/PageTitle";
import { useLocation } from "react-router-dom";

const NoticeDetails = () => {
  const location = useLocation();
  const { title, paragraph, image } = location.state;

  return (
    <>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "10px",
          minHeight: "80vh",
        }}
      >
        <PageTitle title={"Exclusive Offer Details"} />

        <Box sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize:"22px",color: "var(--secondary-color)" }}>
            {title}
          </Typography>
          <Typography sx={{ my: 2, fontSize: "14px" }}>{paragraph}</Typography>
          <img src={image} alt="Notice Image" style={{ width: "400px" }} />
        </Box>
      </Box>
    </>
  );
};

export default NoticeDetails;
