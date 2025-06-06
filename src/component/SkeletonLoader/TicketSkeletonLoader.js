import React from "react";
import { Box, Skeleton } from "@mui/material";

const TicketSkeletonLoader = () => {
  return (
    <Box
      sx={{
        width: 347,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          bgcolor: "background.paper",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
          height: "75vh",
          overflow: "hidden",
        }}
      >
        {/* Success Indicator and Status */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            marginY: 3,
          }}
        >
          <Box sx={{ position: "absolute", top: "-30px" }}>
            {/* <Skeleton variant="circular" width={60} height={60} /> */}
          </Box>
          <Skeleton variant="text" width={140} height={24} />
        </Box>

        {/* Flight Details Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            width: "100%",
            paddingX: 2,
            alignItems: "center",
            gap: 2,
            marginBottom: 1,
          }}
        >
          <Skeleton variant="circular" width={30} height={30} />
          <Box>
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="text" width={60} height={24} />
          </Box>
        </Box>

        {/* Departure and Arrival Information */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingX: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Skeleton variant="text" width={50} height={40} />
            <Skeleton variant="text" width={40} height={20} />
          </Box>
          <Skeleton
            variant="rectangular"
            width={40}
            height={2}
            sx={{ bgcolor: "#E7E7E7" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Skeleton variant="text" width={50} height={40} />
            <Skeleton variant="text" width={40} height={20} />
          </Box>
        </Box>

        {/* Date, Time, and Duration */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingX: 2,
            marginTop: 1,
          }}
        >
          <Skeleton variant="text" width={80} height={16} />
          <Skeleton variant="text" width={80} height={16} />
        </Box>
        <Skeleton variant="text" width="60%" height={16} sx={{ marginY: 1 }} />

        {/* Additional Flight Info Blocks */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingX: 1,
            gap: 1,
          }}
        >
          <Skeleton variant="rectangular" width="30%" height={50} />
          <Skeleton variant="rectangular" width="30%" height={50} />
          <Skeleton variant="rectangular" width="30%" height={50} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingX: 1,
            gap: 1,
          }}
        >
          <Skeleton variant="rectangular" width="30%" height={50} />
          <Skeleton variant="rectangular" width="30%" height={50} />
          <Skeleton variant="rectangular" width="30%" height={50} />
        </Box>

        <Box
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          <Box sx={{ position: "absolute", left: "-30px" }}>
            <Skeleton variant="circular" width={30} height={30} />
          </Box>
          <Box sx={{ position: "absolute", right: "-30px" }}>
            <Skeleton variant="circular" width={30} height={30} />
          </Box>
          <Box sx={{ border: "1px dashed #E7E7E7", mt: 2 }}></Box>
        </Box>
        {/* Barcode Section */}
        <Box
          sx={{
            width: "90%",
            marginY: 2,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={50} />
          <Skeleton
            variant="text"
            width={120}
            height={20}
            sx={{ marginY: 1, marginX: "auto" }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          bgcolor: "white",
          mt: 2,
          height: "50px",
          borderRadius: "7px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Skeleton variant="rectangular" width={60} height={13} />
      </Box>
    </Box>
  );
};

export default TicketSkeletonLoader;
