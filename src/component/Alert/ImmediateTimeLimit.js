import { Box, Typography } from "@mui/material";
import Lottie from "lottie-react";
import TimeLimitFile from "../../assets/lottie/timeLimit.json";
const ImmediateTimeLimit = ({ label }) => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        py: 1.5,
        px: 2,
        mb: 2,
        borderRadius: "3px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "var(--primary-color)",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
        <Box>
          <Lottie
            animationData={TimeLimitFile}
            loop={true}
            autoplay={true}
            style={{ height: 40, marginTop: "-10px" }}
          />
        </Box>
      </Box>
      <Typography
        variant="subtitle2"
        sx={{
          color: "gray",
          fontSize: "0.75rem",
          fontWeight: 500,
          lineHeight: "1rem",
        }}
      >
        Please Issue This Ticket As Soon As Possible Other wise you booking will
        be expired Automatically
      </Typography>
    </Box>
  );
};

export default ImmediateTimeLimit;
