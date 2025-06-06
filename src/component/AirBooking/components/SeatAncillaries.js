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

const SeatAncillaries = ({
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
      <Box
        sx={{
          height: {
            xs: "250px",
            lg: "100%",
          },
          overflow: "scroll",
        }}
      >
        <RadioGroup
          defaultValue={selectedOption || existingOption?.value}
          onChange={handleOptionChange}
          name="meal"
          aria-labelledby="meal-group-label"
        >
          {options
            .filter((seat) =>
              selectedOption === "customWithRemarks" ? seat?.value === "" : seat
            )
            ?.map((seat, index) => (
              <FormControlLabel
                value={seat?.value}
                key={index}
                control={
                  <Radio
                    onSelect={seat?.label === "None"}
                    sx={{
                      py: {
                        xs: 1.5,
                        lg: 1,
                      },
                      "&.Mui-checked": {
                        color: "var(--primary-color)",
                      },
                    }}
                  />
                }
                label={
                  <span
                    style={{
                      color: "#8F8F98",
                      fontSize: "0.813rem",
                    }}
                  >
                    {seat?.label}
                  </span>
                }
              />
            ))}
        </RadioGroup>
        {/* Conditionally render the TextField based on the selected option */}
        {selectedOption === "customWithRemarks" && (
          <Box
            sx={{
              my: 2,
              mr: {
                xs: 1.2,
                lg: 0,
              },
            }}
          >
            <TextField
              id="remarks"
              label="Remarks"
              multiline
              rows={isMobile ? 5 : 8}
              defaultValue={remarks || existingOption?.remarksValue}
              sx={{ width: "100%", height: "100%" }}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Box>
        )}
      </Box>
      <Box
        sx={{
          pr: {
            xs: 1.2,
            lg: 0,
          },
        }}
      >
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
    label:
      "Reserve a premium window seat for breathtaking views and a touch of privacy.",
    value:
      "Reserve a premium window seat for breathtaking views and a touch of privacy.",
  },
  {
    label: "Upgrade to an extra-legroom seat for maximum comfort and space.",
    value: "Upgrade to an extra-legroom seat for maximum comfort and space.",
  },
  {
    label: "Choose front-row seating for an early exit and added convenience.",
    value: "Choose front-row seating for an early exit and added convenience.",
  },
  {
    label:
      "Enjoy a quiet cabin seat for a peaceful journey, perfect for relaxation or work.",
    value:
      "Enjoy a quiet cabin seat for a peaceful journey, perfect for relaxation or work.",
  },
  {
    label:
      "Aisle seat for easy access to the walkway and greater flexibility during your flight.",
    value:
      "Aisle seat for easy access to the walkway and greater flexibility during your flight.",
  },
  {
    label: "Custom With Remarks",
    value: "customWithRemarks",
  },
];

export default SeatAncillaries;
