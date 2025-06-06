import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { ancillaryBtn } from "../../../style/style";
import { useSelector } from "react-redux";

const TimeLimitAncillaries = ({
  handleSelectAncillary,
  selectedTab,
  index,
  route,
  pax,
}) => {
  const ancillaries = useSelector((state) => state?.ancillaries);
  const [remarks, setRemarks] = useState("");

  const existingAncillaries = ancillaries?.find(
    (item) =>
      item.index === index &&
      item.route.departure === route.departure &&
      item.route.arrival === route.arrival &&
      item.pax.firstName === pax.firstName &&
      item.pax.lastName === pax.lastName &&
      item.ancillaries.some((a) => a.label === selectedTab)
  );

  const existingOption = existingAncillaries?.ancillaries?.find(
    (item) => item?.label === selectedTab
  );

  const [selectedOption, setSelectedOption] = useState(existingOption?.remarks);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <Box
      sx={{
        py: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box>
        <RadioGroup
          value={selectedOption}
          onChange={handleOptionChange}
          name="meal"
          aria-labelledby="meal-group-label"
        >
          {options?.map((meal, index) => (
            <FormControlLabel
              value={meal?.value}
              key={index}
              control={
                <Radio
                  onSelect={meal?.label === "None"}
                  sx={{
                    py: 0.5,
                    "&.Mui-checked": {
                      color: "var(--primary-color)",
                    },
                  }}
                />
              }
              label={<span style={{ color: "#8F8F98" }}>{meal?.label}</span>}
            />
          ))}
        </RadioGroup>
        {/* Conditionally render the TextField based on the selected option */}
        {selectedOption === "customWithRemarks" && (
          <Box sx={{ my: 2 }}>
            <TextField
              id="remarks"
              label="Remarks"
              multiline
              rows={9}
              defaultValue={remarks || existingOption?.remarksValue}
              sx={{ width: "100%", height: "100%" }}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Box>
        )}
      </Box>
      <Box>
        <Button
          disabled={selectedOption ? false : true}
          sx={{
            ...ancillaryBtn,
            ":hover": {
              bgcolor: "var(--secondary-color)",
            },
            py: 1.5,
          }}
          onClick={() =>
            handleSelectAncillary(
              selectedTab,
              remarks || selectedOption,
              selectedOption,
              remarks
            )
          }
        >
          ADD THIS ANCELARIS
        </Button>
      </Box>
    </Box>
  );
};

const options = [
  {
    label: "None",
    value: "",
  },
  {
    label: "Custom With Remarks",
    value: "customWithRemarks",
  },
];

export default TimeLimitAncillaries;
