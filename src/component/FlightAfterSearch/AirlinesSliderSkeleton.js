import { Box, Grid, Skeleton, Stack } from "@mui/material";
import React from "react";
import useWindowSize from "../../shared/common/useWindowSize";

const AirlinesSliderSkeleton = () => {
  const { isMobile, isTab } = useWindowSize();
  const skeletons = Array.from({ length: isTab ? 4 : isMobile ? 2 : 7 });

  return (
    <Box
      style={{
        width: "100%",
        height: "50px",
        borderRadius: "5px",
        overFlow: "hidden",
        backgroundColor: "var(--white)",
        borderRadius: "5px",
        overFlow: "hidden",
        display: "flex",
        gap: "10px",
      }}
    >
      {skeletons.map((_, index) => (
        <Stack
          key={index}
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            height: "100%",
            px: "20px",
          }}
        >
          <Skeleton variant="circular" width={35} height={35} />
          <Box>
            <Skeleton
              sx={{ borderRadius: "5px", width: "70px" }}
              variant="rectangular"
              height={"13px"}
            />
            <Skeleton
              sx={{ borderRadius: "5px", width: "50px", mt: "5px" }}
              variant="rectangular"
              height={"13px"}
            />
          </Box>
        </Stack>
      ))}
    </Box>
  );
};

export default AirlinesSliderSkeleton;
