import { Box, Typography, Skeleton } from "@mui/material";

export const MobileBalanceTransferCardSkeleton = () => {
  const skeletonBoxes = Array(10).fill(null);
  return (
    <Box
      sx={{
        bgcolor: "var(--white)",
        width: "100%",
        mx: "auto",
        borderRadius: "4px",
        my: "10px",
        px: "15px",
        py: "10px",
        minHeight: "140px",
      }}
    >
      {skeletonBoxes.map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton variant="text" width="100%" height={60} />
        </Box>
      ))}

      {/* <Box sx={{ mt: "12px" }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="50%" height={40} />
      </Box> */}

      {/* <Box
        sx={{
          mt: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Skeleton variant="text" width="40%" height={100} />
      </Box> */}
    </Box>
  );
};
