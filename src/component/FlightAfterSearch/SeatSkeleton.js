import { Box, Skeleton } from "@mui/material";
import React from "react";

const SeatSkeleton = () => {
  const skeletons = Array.from({ length: 19 });

  return (
    <Box sx={{ ml: "15px" }}>
      <Box
        sx={{ mb: "10px", display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", gap: "12px" }}>
          <Skeleton variant="rounded" width={100} height={25} />
          <Skeleton variant="rounded" width={100} height={25} />
        </Box>
        <Box>
          <Skeleton variant="rounded" width={100} height={25} />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: "10px" }}>
        {skeletons.map((_, index) => (
          <Box key={index}>
            <Skeleton variant="rounded" width={37} height={45} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SeatSkeleton;
