import { Box, Typography } from "@mui/material";
import React from "react";

const AccurateFareRules = ({ accurateFareRules }) => {
  return (
    <Box sx={{ mt: "15px" }}>
      {accurateFareRules?.map((acc, i) => (
        <Box
          key={i}
          sx={{
            border: "1px solid #D9D9D9",
            mb: "10px",
            borderRadius: "3px",
            p: "10px",
          }}
        >
          <Typography sx={{ color: "green", fontSize: "15px" }}>
            {acc?.type}{" "}
            {acc?.noShow && (
              <span style={{ color: "red", fontSize: "12px" }}>
                ( No Show )
              </span>
            )}
          </Typography>
          <Typography sx={{ color: "#000", fontSize: "14px" }}>
            {acc?.text}
          </Typography>
          <Typography sx={{ color: "#000", fontSize: "14px" }}>
            {acc?.amount} {acc?.currency}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AccurateFareRules;
