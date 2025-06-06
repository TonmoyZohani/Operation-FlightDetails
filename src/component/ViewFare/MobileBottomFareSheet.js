import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const MobileBottomFareSheet = ({ flightData, brand, brandIndex }) => {
  const [height, setHeight] = useState(78);
  const contentRef = useRef(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [touching, setTouching] = useState(false);

  const handleTouchStart = (e) => {
    if (!touching) {
      setTouching(true);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const swipeDistance = touchStartY - touchEndY;

    if (Math.abs(swipeDistance) > 30 && touching) {
      if (swipeDistance > 30 && !isExpanded && contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
        setIsExpanded(true);
      } else if (swipeDistance < -30 && isExpanded) {
        setHeight(78);
        setIsExpanded(false);
      }
    }
    setTouching(false);
  };

  useEffect(() => {
    if (contentRef.current) {
      setHeight(78);
    }
  }, [flightData]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        bgcolor: "white",
        width: "100%",
        height: `${height}px`,
        transition: "height 0.5s ease",
        px: "1rem",
        zIndex: 100000,
        overflow: "hidden",
      }}
      ref={contentRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Handle drag icon at the top */}
      <Box
        sx={{
          width: "40%",
          height: "7px",
          bgcolor: "var(--light-bg)",
          my: 1,
          borderRadius: "2.5px",
          mx: "auto",
        }}
      ></Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>12345 BDT</Typography>
        <Box sx={{ px: 1, my: 1 }}>
          <Button
            onClick={() => {
              // setBrandIndex(index);
              // setBrand(modifiedBrands[index]);
            }}
            sx={{
              textTransform: "capitalize",
              bgcolor: "var(--secondary-color)",
              color: "#FFFFFF",
              ":hover": {
                bgcolor: "var(--secondary-color)",
                color: "#FFFFFF",
              },
            }}
          >
            Book
          </Button>
        </Box>
        {/* <PriceBreakdown flightData={flightData} label="Total Payable" /> */}
      </Box>
    </Box>
  );
};

export default MobileBottomFareSheet;
