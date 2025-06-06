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
import useWindowSize from "../../../shared/common/useWindowSize";

const FequentFlyerNumber = ({
  handleSelectAncillary,
  selectedTab,
  index,
  route,
  pax,
}) => {
  const ancillaries = useSelector((state) => state?.ancillaries);
  const [remarks, setRemarks] = useState("");
  const { isMobile } = useWindowSize();

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
      <Box sx={{ height: { xs: "250px", lg: "100%" }, overflow: "scroll" }}>
        {/* <RadioGroup
          value={selectedOption}
          onChange={handleOptionChange}
          name="fequentFlyerNumber"
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
        </RadioGroup> */}
        {/* Conditionally render the TextField based on the selected option */}

        <Box sx={{ my: 2, mr: { xs: 1, lg: 0 } }}>
          <TextField
            id="remarks"
            label="Frequent Flyer Number"
            multiline
            rows={isMobile ? 4 : 6}
            defaultValue={remarks || existingOption?.remarksValue}
            sx={{ width: "100%", height: "100%" }}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </Box>

        {/* {selectedOption === "customWithRemarks" && (
          <Box
            sx={{
              my: 2,
              mr: {
                xs: 1,
                lg: 0,
              },
            }}
          >
            <TextField
              id="remarks"
              label="Remarks"
              multiline
              rows={isMobile ? 4 : 6}
              defaultValue={remarks || existingOption?.remarksValue}
              sx={{ width: "100%", height: "100%" }}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Box>
        )} */}
      </Box>
      <Box sx={{ pr: { xs: 1.2, lg: 0 } }}>
        <Button
          // disabled={selectedOption ? false : true}
          sx={{
            ...ancillaryBtn,
            ":hover": { bgcolor: "var(--secondary-color)" },
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
    label: "Custom With Numbers",
    value: "customWithRemarks",
  },
];

export default FequentFlyerNumber;
