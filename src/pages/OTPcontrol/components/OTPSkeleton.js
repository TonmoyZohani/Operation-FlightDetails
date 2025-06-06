import { Box, Skeleton } from "@mui/material";

const props = {
  sx: { borderRadius: "4px" },
  variant: "rectangular",
  animation: "wave",
  height: "20px",
};

const OTPSkeleton = () => {
  return (
    <Box>
      <Box
        sx={{
          borderRadius: "4px",
          my: "15px",
          p: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              gap: "12px",
              bgcolor: "#fff",
              width: "32%",
              height: "100px",
              borderRadius: "6px",
              p: "15px",
            }}
          >
            <Skeleton {...props} width={"150px"} height={"20px"} />
            <Skeleton
              {...props}
              width={"50px"}
              sx={{ mt: "15px", borderRadius: "15px" }}
            />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          borderRadius: "4px",
          mt: "15px",
          p: "10px",
          display: "flex",
          gap: "20px",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              gap: "12px",
              bgcolor: "#fff",
              width: "30%",
              height: "100px",
              borderRadius: "6px",
              p: "15px",
            }}
          >
            <Skeleton {...props} width={"150px"} height={"20px"} />
            <Skeleton
              {...props}
              width={"50px"}
              sx={{ mt: "15px", borderRadius: "15px" }}
            />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          borderRadius: "4px",
          my: "5px",
          p: "10px",
          display: "flex",
          gap: "20px",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              gap: "12px",
              bgcolor: "#fff",
              width: "30%",
              height: "100px",
              borderRadius: "6px",
              p: "15px",
            }}
          >
            <Skeleton {...props} width={"150px"} height={"20px"} />
            <Skeleton
              {...props}
              width={"50px"}
              sx={{ mt: "15px", borderRadius: "15px" }}
            />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          borderRadius: "4px",
          my: "5px",
          p: "10px",
          display: "flex",
          gap: "20px",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              gap: "12px",
              bgcolor: "#fff",
              width: "30%",
              height: "100px",
              borderRadius: "6px",
              p: "15px",
            }}
          >
            <Skeleton {...props} width={"150px"} height={"20px"} />
            <Skeleton
              {...props}
              width={"50px"}
              sx={{ mt: "15px", borderRadius: "15px" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OTPSkeleton;
