import { Box, Grid, Skeleton } from "@mui/material";
import React from "react";

const FareSkeleton = () => {
  const generateSkeletons = (count, width, height = "20px") =>
    [...new Array(count)].map((_, i) => (
      <Skeleton
        key={i}
        sx={{ borderRadius: "2px" }}
        variant="rectangular"
        width={width}
        height={height}
        animation="wave"
      />
    ));

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "#ececec",
        borderRadius: "4px",
        p: 1.5,
        height: "95px",
        bgcolor: "#f1f1f1",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid container sx={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Grid item md={2.2}>
          <Box gap={1.5} sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="circular"
              width={"30px"}
              height={"30px"}
              animation="wave"
            />
            <Box sx={{ width: "70%" }}>
              {generateSkeletons(1, "100%")}
              <Box mt={1.2}>{generateSkeletons(1, "70%")}</Box>
            </Box>
          </Box>
        </Grid>

        <Grid item md={3.8}>
          <Box
            sx={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {generateSkeletons(1, "70%", "18px")}
            {generateSkeletons(1, "50%", "18px")}
            {/* {generateSkeletons(1, "70%", "15px")} */}
          </Box>
        </Grid>
        <Grid item md={3.8}>
          <Box
            sx={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {generateSkeletons(1, "50%", "18px")}
            {generateSkeletons(1, "70%", "18px")}
            {/* {generateSkeletons(1, "70%", "15px")} */}
          </Box>
        </Grid>

        <Grid item md={1.3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {generateSkeletons(1, "100%", "28px")}
            {generateSkeletons(1, "100%", "28px")}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FareSkeleton;
