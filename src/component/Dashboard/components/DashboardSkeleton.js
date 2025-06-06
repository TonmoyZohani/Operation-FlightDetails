import { Box, Skeleton } from "@mui/material";

const props = {
  sx: { borderRadius: "4px" },
  variant: "rectangular",
  animation: "wave",
  height: "20px",
};

const DashboardSkeleton = () => {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: "var(--white)",
          borderRadius: "4px",
          my: "15px",
          p: "10px",
          height: "140px",
          display:"flex",
          flexDirection:"column",
          gap:"20px"
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Skeleton variant="circular" width={29} height={29} />
            <Skeleton {...props} width={"90px"} height={"20px"} />
            <Skeleton {...props} width={"20px"} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardSkeleton;
