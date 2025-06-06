import React from "react";
import { Box, Skeleton } from "@mui/material";
import { Stack } from "@mui/system";
import "./SkeletonLoader.css";

const FilterSkeleton = () => {
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          borderRadius: "5px",
          overFlow: "hidden",
          bgcolor: "var(--white)",
          padding: "10px",
        }}
      >
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Skeleton
            className="skeleton"
            sx={{ borderRadius: "5px" }}
            variant="rectangular"
            width={"50%"}
            height={"14px"}
          />
        </Stack>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", mt: "10px", gap: "5px" }}>
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "5px" }}
              variant="rectangular"
              width={"30px"}
              height={"30px"}
            />
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "5px" }}
              variant="rectangular"
              width={"30px"}
              height={"30px"}
            />
          </Box>
          <Box sx={{ display: "flex", mt: "10px", gap: "5px" }}>
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "5px" }}
              variant="rectangular"
              width={"30px"}
              height={"30px"}
            />
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "5px" }}
              variant="rectangular"
              width={"30px"}
              height={"30px"}
            />
          </Box>
          <Box sx={{ display: "flex", mt: "10px", gap: "5px" }}>
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "5px" }}
              variant="rectangular"
              width={"30px"}
              height={"30px"}
            />
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "5px" }}
              variant="rectangular"
              width={"30px"}
              height={"30px"}
            />
          </Box>
        </Box>
      </Box>

      {Array.from({ length: 4 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: "100%",
            borderRadius: "5px",
            overflow: "hidden", 
            bgcolor: "var(--white)",
            padding: "10px",
            mt: "15px",
          }}
        >
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Skeleton
              className="skeleton"
              sx={{ borderRadius: "5px" }}
              variant="rectangular"
              width="50%"
              height="14px"
            />
          </Stack>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, mt: "10px", width: "100%" }}>
              <Skeleton
                className="skeleton"
                sx={{ borderRadius: "5px", flex: 1 }}
                variant="rectangular"
                height="30px"
              />
              <Skeleton
                className="skeleton"
                sx={{ borderRadius: "5px", flex: 1 }}
                variant="rectangular"
                height="30px"
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default FilterSkeleton;
