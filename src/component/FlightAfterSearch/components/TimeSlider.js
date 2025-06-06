import { Box, Slider, Typography } from "@mui/material";
import { useState } from "react";
import { formatTime } from "./formatTime";
import { filterLabelStyle } from "../../../style/style";

const TimeSlider = ({
  label = "Time Range",
  min = 0,
  max = 1440,
  step = 60,
  initialValue = [0, 1440],
  primaryColor = "var(--primary-color)",
  secondaryColor = "var(--secondary-color)",
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);

  const [startTime, endTime] = value;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box>
      <Typography variant="h2" component="h2" mb={2} sx={filterLabelStyle}>
        {label}
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Slider
          getAriaLabel={() => "Time range"}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          sx={{
            color: "primary.main",
            "& .MuiSlider-thumb": {
              backgroundColor: primaryColor,
              width: "17.29px",
              height: "17.29px",
            },
            "& .MuiSlider-track": {
              backgroundColor: secondaryColor,
              height: "4.8px",
            },
            "& .MuiSlider-rail": {
              backgroundColor: "#333",
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: secondaryColor,
            }}
          >
            {formatTime(startTime)}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: secondaryColor,
            }}
          >
            {formatTime(endTime)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TimeSlider;
