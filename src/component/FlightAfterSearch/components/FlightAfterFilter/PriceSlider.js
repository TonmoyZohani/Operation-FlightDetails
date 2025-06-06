import { Box, Slider, Typography } from "@mui/material";
import { filterLabelStyle } from "../../../../style/style";

const PriceSlider = ({
  label = "Price Range",
  min = 0,
  max = 100000,
  primaryColor = "var(--primary-color)",
  secondaryColor = "var(--secondary-color)",
  onChange,
  value,
}) => {
  const handleChange = (_, newValue) => {
    onChange(newValue);
  };

  const valuetext = (value) => {
    if (value === 0) return "0.00";
    if (typeof value === "number" && !isNaN(value)) {
      return value.toLocaleString("en-US");
    }
    return "0.00";
  };

  return (
    <Box>
      {/* <Typography variant="h2" component="h2" mb={2} sx={filterLabelStyle}>
        {label}
      </Typography> */}
      <Box sx={{ width: "100%", position: "relativ" }}>
        <Slider
          getAriaLabel={() => "Price range"}
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          onChange={handleChange}
          marks
          value={value}
          min={min}
          max={max}
          step={max < 10000 ? 101 : Math.ceil((min + max) / 8)}
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
              border: "none",
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
              fontWeight: 500,
              color: "#3d3a49",
            }}
          >
            {min?.toLocaleString("en-US")}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#3d3a49",
            }}
          >
            {max?.toLocaleString("en-US")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PriceSlider;
