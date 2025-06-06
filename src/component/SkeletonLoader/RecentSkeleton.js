import { Box, Skeleton } from "@mui/material";
import React from "react";

const RecentSkeleton = () => {
  return (
    <>
      <Box
        sx={{
          bgcolor: "white",
          p: 1,
          borderRadius: "4px",
          height: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "4px" }}
          variant="rectangular"
          width={"100%"}
          height={"23px"}
        />

        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "4px" }}
          variant="rectangular"
          width={"60%"}
          height={"15px"}
        />
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "4px" }}
          variant="rectangular"
          width={"50%"}
          height={"15px"}
        />
      </Box>
    </>
  );
};

export default RecentSkeleton;
