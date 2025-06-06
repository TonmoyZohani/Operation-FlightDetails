import React from "react";
import { iconBox } from "../Register/RegisterPortal";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Tooltip, Typography } from "@mui/material";

const DrawerTitle = ({ title, text1, text2, handleClose, handleOpen }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          sx={{
            color: "var(--secondary-color)",
            fontSize: "25px",
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ mt: "10px", color: "#B6B6CC", fontSize: "13px" }}>
          {text1}{" "}
          <span
            onClick={handleOpen}
            style={{ color: "var(--secondary-color)", cursor: "pointer" }}
          >
            {text2}
          </span>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Close">
          <Box onClick={handleClose} sx={iconBox}>
            <CloseIcon
              sx={{
                color: "white",
                fontSize: "20px",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default DrawerTitle;
