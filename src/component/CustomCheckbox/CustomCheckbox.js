import { Checkbox, FormControlLabel, styled, Typography } from "@mui/material";

const BpIcon = styled("span")(({ color = "var(--dark-gray)" }) => {
  return {
    width: 13,
    height: 13,
    boxShadow: `0 0 0 1px ${color}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

const BpCheckedIcon = styled(BpIcon)(({ color = "var(--dark-gray)" }) => ({
  "&::before": {
    display: "block",
    width: 11,
    height: 11,
    backgroundColor: color,
    content: '""',
  },
  "input:hover ~ &": { backgroundColor: "none" },
}));

const CustomCheckBox = ({
  value,
  label,
  fontWeight = "400",
  fontSize = "13px",
  style,
  handleChange,
  iconProps = {},
}) => {
  return (
    <FormControlLabel
      onChange={handleChange}
      value={value}
      control={
        <FormControlLabel
          sx={{ mr: "2px", ml: "4px" }}
          control={
            <Checkbox
              disableRipple
              // checkedIcon={<BpCheckedIcon />}
              // icon={<BpIcon />}
              checkedIcon={<BpCheckedIcon {...iconProps} />}
              icon={<BpIcon {...iconProps} />}
              checked={value}
            />
          }
        />
      }
      label={
        <Typography
          sx={{
            fontSize: fontSize,
            fontWeight: fontWeight,
            ...style,
            lineHeight: 1,
          }}
        >
          {label}
        </Typography>
      }
    />
  );
};

export default CustomCheckBox;
