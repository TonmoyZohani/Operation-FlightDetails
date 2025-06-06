import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { filterLabelStyle } from "../../../style/style";

const BpIcon = styled("span")(() => ({
  width: 13,
  height: 13,
  boxShadow: "0 0 0 1px var(--secondary-color)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const BpCheckedIcon = styled(BpIcon)({
  "&::before": {
    display: "block",
    width: 11,
    height: 11,
    backgroundColor: "var(--secondary-color)",
    content: '""',
  },
  "input:hover ~ &": { backgroundColor: "none" },
});

const GroupRadioButton = ({
  id,
  label,
  name,
  options = [],
  selectedValue,
  onChange,
  row = false,
}) => {
  const [visibleOptions, setVisibleOptions] = useState(5);

  // handle see more option function here
  const handleSeeMore = () => {
    setVisibleOptions(options.length);
  };

  // handle less show option function here
  const handleLessShow = () => {
    setVisibleOptions(5);
  };

  return (
    <FormControl component="fieldset">
      <Typography variant="h2" component="h2" mb={2} sx={filterLabelStyle}>
        {label}
      </Typography>
      <RadioGroup
        name={name}
        value={selectedValue}
        onChange={onChange}
        row={row}
        aria-labelledby={id}
      >
        {options.slice(0, visibleOptions).map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                checked={selectedValue === option?.value}
                checkedIcon={<BpCheckedIcon />}
                icon={<BpIcon />}
              />
            }
            label={option.label}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "12px",
                color: "var(--secondary-color)",
                fontWeight: 500,
              },
            }}
          />
        ))}
      </RadioGroup>
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
        options?.length > 5 && (
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

export default GroupRadioButton;
