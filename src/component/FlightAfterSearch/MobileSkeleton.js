import { Box, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";

const MobileSkeleton = () => {
  return (
    <Box
      sx={{
        transition: "all .5s ease-in-out",
        borderRadius: "5px",
        overflow: "hidden",
        bgcolor: "var(--white)",
        p: "10px",
        width: "90%",
        mx: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "2px", marginBottom: "5px" }}
          variant="rectangular"
          height={"13px"}
          width={"32%"}
        />
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "5px", marginBottom: "5px" }}
          variant="rectangular"
          height={"15px"}
          width={"0.5%"}
        />
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "2px", marginBottom: "5px" }}
          variant="rectangular"
          height={"13px"}
          width={"10%"}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          my: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            width: "40%",
          }}
        >
          <Box>
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "50px" }}
              variant="circular"
              width={"30px"}
              height={"30px"}
            />
          </Box>
          <Box sx={{ width: "45%" }}>
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "2px", marginBottom: "5px" }}
              variant="rectangular"
              height={"20px"}
              width={"70%"}
            />
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "2px", marginBottom: "5px" }}
              variant="rectangular"
              height={"8px"}
              width={"70%"}
            />
          </Box>
        </Box>
        <Box
          sx={{ width: "50%", display: "flex", alignItems: "center", mr: -6.5 }}
        >
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "50px", marginBottom: "5px" }}
            variant="circular"
            width={"10px"}
            height={"10px"}
          />
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "2px", marginBottom: "5px" }}
            variant="rectangular"
            height={"1px"}
            width={"70%"}
          />
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "50px", marginBottom: "5px" }}
            variant="circular"
            width={"10px"}
            height={"10px"}
          />
        </Box>
        <Box
          sx={{
            width: "30%",
          }}
        >
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "2px", marginBottom: "5px", ml: "auto" }}
            variant="rectangular"
            height={"20px"}
            width={"45%"}
          />
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "2px", marginBottom: "5px", ml: "auto" }}
            variant="rectangular"
            height={"8px"}
            width={"45%"}
          />
        </Box>
      </Box>
      <Skeleton
        className="skeleton"
        sx={{ borderRadius: "2px", marginBottom: "5px", mt: -0.5 }}
        variant="rectangular"
        height={"1px"}
        width={"100%"}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Box sx={{ display: "flex", gap: 1, width: "65%" }}>
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "2px", marginBottom: "5px" }}
            variant="rectangular"
            height={"13px"}
            width={"30%"}
          />
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "2px", marginBottom: "5px" }}
            variant="rectangular"
            height={"13px"}
            width={"30%"}
          />
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "2px", marginBottom: "5px" }}
            variant="rectangular"
            height={"13px"}
            width={"30%"}
          />
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "2px", marginBottom: "5px" }}
            variant="rectangular"
            height={"13px"}
            width={"30%"}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "2px", marginBottom: "5px", ml: "auto" }}
            variant="rectangular"
            height={"13px"}
            width={"48%"}
          />
          <Box sx={{ display: "flex" }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#EBEBEB",
                width: "100%",
                textAlign: "right",
                mr: 1,
              }}
            >
              ৳
            </Typography>
            <Skeleton
              className="skeleton"
              sx={{
                borderRadius: "2px",
                marginBottom: "5px",
                ml: "auto",
              }}
              variant="rectangular"
              height={"13px"}
              width={"32%"}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileSkeleton;
