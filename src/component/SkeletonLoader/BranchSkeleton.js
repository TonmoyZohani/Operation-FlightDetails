import { Box, Grid, Skeleton } from "@mui/material";
import React from "react";

const BranchSkeleton = () => {
  return (
    <Box sx={{ p: "1rem" }}>
      <Box sx={{ mb: 3 }}>
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "20px" }}
          variant="rectangular"
          height={"40px"}
          animation="wave"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pb: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: "15px", width: "20%" }}>
          {[...new Array(1)].map((_, index) => (
            <Skeleton
              key={index}
              className="skeleton"
              sx={{ borderRadius: "2px" }}
              variant="rectangular"
              width={"100px"}
              height={"31px"}
              animation="wave"
            />
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "15px",
            width: "20%",
            justifyContent: "end",
          }}
        >
          {[...new Array(1)].map((_, index) => (
            <Skeleton
              className="skeleton"
              key={index}
              sx={{ borderRadius: "2px" }}
              variant="rectangular"
              width={"74px"}
              height={"31px"}
              animation="wave"
            />
          ))}
        </Box>
      </Box>
      <Grid container columnSpacing={2.5} rowSpacing={4}>
        {[...new Array(8)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "2px" }}
              variant="rectangular"
              height={"40px"}
              animation="wave"
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Skeleton
          className="skeleton"
          sx={{ borderRadius: "2px" }}
          variant="rectangular"
          height={"40px"}
          animation="wave"
        />
      </Box>
    </Box>
  );
};

export default BranchSkeleton;
