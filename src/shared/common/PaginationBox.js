import React from "react";
import { Box, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeTwoToneIcon from "@mui/icons-material/NavigateBeforeTwoTone";

const PaginationBox = ({
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  text,
}) => {
  const pageButtonStyle = {
    bgcolor: "#4C4B4B",
    width: "24px",
    height: "24px",
    borderRadius: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  };

  return (
    <Box
      sx={{
        px: "25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: 2,
      }}
    >
      <Typography>
        Total {text}:{" "}
        <span style={{ color: "", fontWeight: "500" }}>{totalRecords}</span>
      </Typography>

      <Box sx={{ display: "flex", gap: "15px" }}>
        {/* Previous Page Button */}
        <Box
          sx={{
            ...pageButtonStyle,
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        >
          <NavigateBeforeTwoToneIcon sx={{ color: "#fff" }} />
        </Box>

        <span style={{ color: "#000", fontWeight: "500", fontSize: "14px" }}>
          {currentPage} / {totalPages}
        </span>

        {/* Next Page Button */}
        <Box
          sx={{
            ...pageButtonStyle,
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
        >
          <NavigateNextIcon sx={{ color: "#fff" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default PaginationBox;
