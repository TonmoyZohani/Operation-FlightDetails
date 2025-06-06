import { Box, Grid, Skeleton } from "@mui/material";
import useWindowSize from "../../shared/common/useWindowSize";

const MobileStepperSkeleton = ({ number }) => {
  const { isMobile, isTab } = useWindowSize();
  const skeletons = Array.from({ length: 4 });
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "white",
        width: "90%",
        mx: "auto",
        justifyContent: "space-between",
        py: {
          xs: 1,
          lg: 0,
        },
        px: {
          xs: 1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Skeleton
          className="skeleton"
          variant="circular"
          sx={{
            width: {
              xs: 35,
            },
            height: {
              xs: 35,
            },
          }}
          animation="wave"
        />
        <Skeleton
          className="skeleton"
          sx={{
            width: {
              xs: 115,
            },
            height: {
              xs: 25,
            },
          }}
          animation="wave"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "19px",
        }}
      >
        <Skeleton
          className="skeleton"
          variant="circular"
          sx={{
            width: {
              xs: 35,
            },
            height: {
              xs: 35,
            },
          }}
          animation="wave"
        />
        <Skeleton
          className="skeleton"
          variant="circular"
          sx={{
            width: {
              xs: 35,
            },
            height: {
              xs: 35,
            },
          }}
          animation="wave"
        />
        <Skeleton
          className="skeleton"
          variant="circular"
          sx={{
            width: {
              xs: 35,
            },
            height: {
              xs: 35,
            },
          }}
          animation="wave"
        />
      </Box>
    </Box>
  );
};

export default MobileStepperSkeleton;
