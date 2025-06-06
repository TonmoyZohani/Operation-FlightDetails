import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReactDOMServer from "react-dom/server";
import {
  boxStyle,
  boxStyle2,
  containerStyle,
  innerContainerStyle,
  typographyStyle,
  typographyStyle2,
} from "../../../component/SessionTimer/SessionTimer";
import moment from "moment";

const TimeLimitTimer = ({ refundTimeLimit }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (refundTimeLimit) {
      const targetTime = moment(refundTimeLimit);
      const interval = setInterval(() => {
        const now = moment();
        const duration = moment.duration(targetTime.diff(now));

        if (duration.asSeconds() <= 0) {
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

          setTimeLeft(0);
        } else {
          setTimeLeft(duration.asSeconds());
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [refundTimeLimit, navigate]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60); // Ensuring the seconds are rounded
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

export default TimeLimitTimer;
