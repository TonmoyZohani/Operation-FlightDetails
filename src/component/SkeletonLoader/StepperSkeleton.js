import { Box, Grid, Skeleton } from "@mui/material";
import useWindowSize from "../../shared/common/useWindowSize";

const StepperSkeleton = ({ number }) => {
  const skeletons = Array.from({ length: 4 });
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        bgcolor: "white",
        width: "100%",
        mx: "auto",
        py: {
          xs: 1,
          lg: 0,
        },
        px: {
          xs: 1,
        },
      }}
    >
      {skeletons?.map((_, index) => (
        <Grid
          key={index}
          item
          lg={index !== 4 ? 5 : 5.1}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            // pl: "23px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton
              className="skeleton"
              variant="circular"
              sx={{
                width: {
                  xs: 20,
                  md: 20,
                  sm: 20,
                  lg: 22,
                },
                height: {
                  xs: 20,
                  md: 20,
                  sm: 20,
                  lg: 22,
                },
              }}
              animation="wave"
            />

            <Skeleton
              className="skeleton"
              sx={{
                borderRadius: "2px",
                width: {
                  xs: 14,
                  md: 80,
                  sm: 50,
                  lg: 140,
                  xl: 140,
                },
                height: {
                  xs: "8px",
                  sm: "16px",
                },
              }}
              variant="rectangular"
              animation="wave"
            />
          </Box>
          <Box
            sx={{
              height: "1px",
              flexGrow: 1,
              display: index !== number - 1 ? "block" : "none", 
              bgcolor: "#DDDDDD",
              mx: 1, 
            }}
          ></Box>
        </Grid>
      ))}
    </Box>
  );
};

export default StepperSkeleton;
