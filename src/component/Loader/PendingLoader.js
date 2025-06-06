import { Box, Dialog, Typography } from "@mui/material";
import Lottie from "lottie-react";
import airplaneFile from "../../assets/lottie/airplane.json";
import maintenanceFile from "../../assets/lottie/maintenance.json";

const PendingLoader = ({ type }) => {
  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ height: 400, p: 3, overflow: "hidden" }}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{
            fontSize: "1.25rem",
            color: "#3C4258",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          Please hold on tight and stay seated for a moment
        </Typography>
        <Typography
          id="modal-modal-description"
          sx={{
            mt: 2,
            color: "#888888",
            fontSize: "0.85rem",
            textAlign: "center",
            width: "80%",
            mx: "auto",
          }}
        >
          Dear Agent, please hold tight for a moment as we secure your seat
          booking. We appreciate your patience while we confirm the reservation
          to ensure your client's travel plans are smoothly arranged. Thank you
          for working with us to provide a seamless experience!
        </Typography>
        <Box
          sx={{
            width: "500px",
            mx: "auto",
            borderRadius: "50%",
            mt: "-20px",
          }}
        >
          <Lottie
            animationData={type === "split" ? maintenanceFile : airplaneFile}
            loop={true}
            autoplay={true}
            style={{ height: type === "split" ? 250 : 320 }}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default PendingLoader;
