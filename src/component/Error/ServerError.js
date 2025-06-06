import { ReactComponent as APIerrIcon } from "../../assets/svg/404.svg?react";
import { Box, Typography } from "@mui/material";

const ServerError = ({ message }) => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
        textTransform: "capitalize",
        pt: {
          xs: 5,
          lg: 0,
        },
        px: {
          xs: 2,
          lg: 0,
        },
      }}
    >
      <APIerrIcon fill={"var(--primary-color)"} />
      <Typography sx={{ fontSize: "18px", textAlign: "center" }}>
        {typeof message === "string"
          ? message
          : "Unable to fetch data. Please try again later."}
      </Typography>
    </Box>
  );
};

export default ServerError;
