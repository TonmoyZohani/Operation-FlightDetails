import { Box, Skeleton } from "@mui/material";

export const TicketStatusSkeleton = ({ data }) => {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "3px",
        p: "12px 10px",
        mb: "18px",
      }}
    >
      <Skeleton
        className="skeleton"
        sx={{ borderRadius: "5px", marginBottom: "5px" }}
        variant="rectangular"
        width={"100px"}
        height={"16px"}
      />
      <Skeleton
        className="skeleton"
        sx={{ borderRadius: "5px", marginBottom: "5px" }}
        variant="rectangular"
        width={"120px"}
        height={"20px"}
      />
      <Skeleton
        className="skeleton"
        sx={{ borderRadius: "5px", marginBottom: "5px" }}
        variant="rectangular"
        width={"200px"}
        height={"16px"}
      />
      <Skeleton
        className="skeleton"
        sx={{ borderRadius: "5px", marginBottom: "5px" }}
        variant="rectangular"
        width={"170px"}
        height={"18px"}
      />
    </Box>
  );
};
