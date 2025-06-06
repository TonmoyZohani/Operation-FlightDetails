import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Slide } from "@mui/material";
import sound from "../../assets/audio.wav";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const CustomToast = ({ open, onClose, message, severity, type = "" }) => {
  const placement =
    type === "notification"
      ? { vertical: "top", horizontal: "right" }
      : { vertical: "bottom", horizontal: "right" };
  return (
    <>
      <Snackbar
        TransitionComponent={SlideTransition}
        open={open}
        autoHideDuration={1500}
        // autoHideDuration={
        //   severity === "success" ? 1500 : severity === "warning" ? 2500 : 3000
        // }
        onClose={(e, reason) => onClose(e, reason)}
        anchorOrigin={placement}
        sx={{
          ".MuiPaper-root": {
            width: { xs: "300px", lg: "500px" },
            zIndex: "100000000",
          },
          ".MuiSvgIcon-root": { color: "white" },
        }}
      >
        <Alert
          onClose={(e, reason) => onClose(e, reason)}
          severity={severity}
          variant="filled"
          sx={{
            bgcolor:
              severity === "success"
                ? "#07bc0c"
                : severity === "warning"
                  ? "#efc400"
                  : "#d32f2f",
            height: "100%",
            width: "300px",
            padding: "6px 9px",
            textTransform: "capitalize",
            fontSize: "15px",
          }}
        >
          {/* <span style={{ fontSize: "16px", textTransform: "capitalize" }}>
            {severity === "success" ? "Successful" : severity}
          </span>
          <br /> */}
          {message}
        </Alert>
      </Snackbar>
      {open && type === "notification" && (
        <audio controls autoPlay style={{ display: "none" }}>
          <source src={sound} type="audio/ogg" />
          <source src={sound} type="audio/mpeg" />
        </audio>
      )}
    </>
  );
};

export default CustomToast;
