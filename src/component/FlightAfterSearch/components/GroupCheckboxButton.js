import {
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { filterLabelStyle } from "../../../style/style";

const GroupCheckboxButton = ({
  id,
  label,
  options = [],
  selectedValues = [],
  onChange,
}) => {
  const [visibleOptions, setVisibleOptions] = useState(5);

  // Handle see more option function
  const handleSeeMore = () => {
    setVisibleOptions(options.length);
  };

  // Handle less show option function
  const handleLessShow = () => {
    setVisibleOptions(5);
  };

  // Handle change in checkbox selection
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const newSelectedValues = event.target.checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);
    onChange(newSelectedValues);
  };

  return (
    <FormControl component="fieldset">
      <Typography variant="h2" component="h2" mb={2} sx={filterLabelStyle}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {options.slice(0, visibleOptions).map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                size="small"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={handleCheckboxChange}
                sx={{
                  py: 0.5,
                  color: "var(--secondary-color)",
                  "&.Mui-checked": {
                    color: "var(--secondary-color)",
                  },
                }}
              />
            }
            label={
              option.label?.length > 25
                ? option.label.slice(0, 25) + "..."
                : option.label
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "12px",
                color: "var(--secondary-color)",
                fontWeight: 500,
              },
            }}
          />
        ))}
      </Box>
      {options.length > 5 && visibleOptions < options.length ? (
        <Typography
          onClick={handleSeeMore}
          sx={{
            fontSize: "12px",
            textDecoration: "underline",
            fontWeight: 700,
            mt: 0.5,
            cursor: "pointer",
            color: "var(--text-color)",
          }}
        >
          See More
        </Typography>
      ) : (
        options.length > 5 && (
          <Typography
            onClick={handleLessShow}
            sx={{
              fontSize: "12px",
              textDecoration: "underline",
              fontWeight: 700,
              mt: 0.5,
              cursor: "pointer",
              color: "var(--text-color)",
            }}
          >
            Less Show
          </Typography>
        )
      )}
    </FormControl>
  );
};

export default GroupCheckboxButton;
