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

const BaggageAncillaries = ({
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
          name="baggage"
          aria-labelledby="baggage-group-label"
        >
          {options
            .filter((baggage) =>
              selectedOption === "customWithRemarks"
                ? baggage?.value === ""
                : baggage
            )
            ?.map((baggage, index) => (
              <FormControlLabel
                value={baggage?.value}
                key={index}
                control={
                  <Radio
                    onSelect={baggage?.label === "None"}
                    sx={{
                      py: 0.5,
                      "&.Mui-checked": {
                        color: "var(--primary-color)",
                      },
                    }}
                  />
                }
                label={
                  <span style={{ color: "#8F8F98", fontSize: "13px" }}>
                    {baggage?.label}
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
    label: (
      <>
        Add <span style={{ color: "var(--primary-color)" }}>5kg </span> for
        those light, essential items.
      </>
    ),
    value: "Add 5kg for those light essential items",
  },
  {
    label: (
      <>
        Add <span style={{ color: "var(--primary-color)" }}>10kg </span> of
        baggage for worry-free travel
      </>
    ),
    value: "Add 10kg of baggage for worry-free-travel",
  },
  {
    label: (
      <>
        Add <span style={{ color: "var(--primary-color)" }}>15kg </span> to
        bring along your must-haves.
      </>
    ),
    value: "Add 15kg to bring along your must-haves",
  },
  {
    label: (
      <>
        Go for <span style={{ color: "var(--primary-color)" }}>20kg </span> and
        travel without leaving anything behind.
      </>
    ),
    value: "Go for 20kg and travel without leaving anything behind",
  },
  {
    label: (
      <>
        Add <span style={{ color: "var(--primary-color)" }}>30kg </span> extra
        baggage for those longer trips.
      </>
    ),
    value: "Add 30kg extra baggage for those longer trips",
  },
  {
    label: (
      <>
        Choose <span style={{ color: "var(--primary-color)" }}>40kg </span> to
        bring along everything you need.
      </>
    ),
    value: "Choose 40kg to bring along everything you need",
  },
  {
    label: (
      <>
        Go big with <span style={{ color: "var(--primary-color)" }}>50kg </span>{" "}
        of baggage allowance for all your essentials.
      </>
    ),
    value: "Go big with 50kg of baggage allowance for all your esentials",
  },
  {
    label: "Custom With Remarks",
    value: "customWithRemarks",
  },
];

export default BaggageAncillaries;
