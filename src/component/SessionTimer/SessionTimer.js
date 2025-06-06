import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReactDOMServer from "react-dom/server";

export const containerStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  height: "50%",
};

export const innerContainerStyle = {
  width: "31%",
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
};

export const boxStyle = {
  bgcolor: "#F4F4F4",
  width: "47.5%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "3px",
};

export const typographyStyle = {
  fontSize: "17px",
  color: "var(--primary-color)",
  fontWeight: "500",
};

export const boxStyle2 = {
  display: "flex",
  width: "100%",
  mt: "5px",
};

export const typographyStyle2 = {
  fontSize: "0.688rem",
  fontWeight: "500",
  width: "33%",
  textAlign: "center",
  color: "#525371",
};

const SessionTimer = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(900000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);

          const iconHtml = ReactDOMServer.renderToString(
            <WarningAmberIcon
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
          );

          const swalInstance = Swal.fire({
            html: `
              <div style="text-align: left;">
                <div style="padding: 0px;">
                  <div style="border-bottom: 2px solid var(--secondary-color); display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="font-weight: 600; color: var(--secondary-color); margin-right: 8px;">
                      Session Expired
                    </h2>
                    <span style="color: var(--primary-color);">${iconHtml}</span>
                  </div>
                  <div style="padding-top: 15px; padding-bottom: 15px;">
                    <p>Your session has expired.</p>
                    <p>To see the flights of a particular day, please search again.</p>
                  </div>
                </div>
                <button id="search-again-btn" style="padding: 10px 20px; background-color: var(--primary-color); color: #fff; border: none; cursor: pointer; border-radius: 5px; margin-top: 10px;">Search Again</button>
              </div>
            `,
            showConfirmButton: false,
          });

          document
            .getElementById("search-again-btn")
            .addEventListener("click", () => {
              navigate("/");
              swalInstance.close(); 
            });

          swalInstance.then((result) => {
            if (
              result.dismiss === Swal.DismissReason.overlay ||
              result.dismiss === Swal.DismissReason.esc
            ) {
              navigate("/");
            }
          });

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return { hours, minutes, seconds };
  };

  const time = formatTime(timeLeft);

  return (
    <>
      <Box sx={containerStyle}>
        {/* show hours left */}
        <Box sx={innerContainerStyle}>
          <Box sx={boxStyle}>
            <Typography sx={typographyStyle}>
              {Math.floor(time.hours / 10)}
            </Typography>
          </Box>
          <Box sx={boxStyle}>
            <Typography sx={typographyStyle}>{time.hours % 10}</Typography>
          </Box>
        </Box>
        {/* show minutes left */}
        <Box sx={{ ...innerContainerStyle, height: "auto" }}>
          <Box sx={boxStyle}>
            <Typography sx={typographyStyle}>
              {Math.floor(time.minutes / 10)}
            </Typography>
          </Box>
          <Box sx={boxStyle}>
            <Typography sx={typographyStyle}>{time.minutes % 10}</Typography>
          </Box>
        </Box>
        {/* show seconds left */}
        <Box sx={innerContainerStyle}>
          <Box sx={boxStyle}>
            <Typography sx={typographyStyle}>
              {Math.floor(time.seconds / 10)}
            </Typography>
          </Box>
          <Box sx={boxStyle}>
            <Typography sx={typographyStyle}>{time.seconds % 10}</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={boxStyle2}>
        <Typography sx={typographyStyle2}>Hours</Typography>
        <Typography sx={typographyStyle2}>Minutes</Typography>
        <Typography sx={typographyStyle2}>Seconds</Typography>
      </Box>
    </>
  );
};

export default SessionTimer;
