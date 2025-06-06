import { Box, Grid, Skeleton } from "@mui/material";
import { Stack } from "@mui/system";
import "./SkeletonLoader.css";
import React from "react";

const SkeletonLoader = () => {
  return (
    <Box>
      <Grid
        container
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: "flex",
          },
          transition: "all .5s ease-in-out",
          borderRadius: "5px",
          overflow: "hidden",
          bgcolor: "var(--white)",
        }}
      >
        {/* 1st  */}
        <Grid item xs={12} md={2.8} p={2}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            {/* //todo: Image Part */}
            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "50px", marginBottom: "5px" }}
              variant="circular"
              width={"55px"}
              height={"55px"}
            />
          </Stack>

          <Box sx={{ mt: "12px" }} width="100%">
            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px", marginBottom: "5px" }}
              variant="rectangular"
              width={"80%"}
              height={"15px"}
            />
            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px" }}
              variant="rectangular"
              width={"70%"}
              height={"13px"}
            />
          </Box>
        </Grid>
        {/* 2nd  */}
        <Grid item xs={4} md={2.2} py={1.5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px", my: "10px" }}
              variant="rectangular"
              width={"40%"}
              height={"13px"}
            />
            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px", my: "5px" }}
              variant="rectangular"
              width={"75%"}
              height={"15px"}
            />

            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px", my: "5px" }}
              variant="rectangular"
              width={"90%"}
              height={"13px"}
            />
            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px", marginBottom: "5px" }}
              variant="rectangular"
              width={"70%"}
              height={"13px"}
            />
          </Box>
        </Grid>
        {/* 3rd  Animation and duration*/}
        <Grid item xs={4} md={2.6} py={2.5}>
          <Box sx={{ mt: "12px" }}>
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Skeleton
                className="skeleton" // Add shine effect class here
                sx={{
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
                variant="rectangular"
                width={"50%"}
                height={"13px"}
              />
            </Box>

            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{
                borderRadius: "5px",
                marginBottom: "5px",
              }}
              variant="rectangular"
              width={"100%"}
              height={"13px"}
            />
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Skeleton
                className="skeleton" // Add shine effect class here
                sx={{
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
                variant="rectangular"
                width={"45%"}
                height={"13px"}
              />
            </Box>
          </Box>
        </Grid>
        {/* 4th */}
        <Grid item xs={4} md={2.2} py={1.5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px", my: "10px" }}
              variant="rectangular"
              width={"40%"}
              height={"13px"}
            />
            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px", my: "5px" }}
              variant="rectangular"
              width={"75%"}
              height={"15px"}
            />

            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px", my: "5px" }}
              variant="rectangular"
              width={"90%"}
              height={"13px"}
            />
            <Skeleton
              className="skeleton" // Add shine effect class here
              sx={{ borderRadius: "5px", marginBottom: "5px" }}
              variant="rectangular"
              width={"70%"}
              height={"13px"}
            />
          </Box>
        </Grid>
        {/* 5th */}
        <Grid item xs={12} md={2.2} p={2} textAlign="end">
          <Stack
            height="100%"
            direction="column"
            justifyContent="space-between"
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Skeleton
                className="skeleton" // Add shine effect class here
                sx={{
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
                variant="rectangular"
                width={"80%"}
                height={"25px"}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Skeleton
                className="skeleton" 
                sx={{
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
                variant="rectangular"
                width={"80%"}
                height={"32px"}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkeletonLoader;
