import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { ancillaryBtn } from "../../../style/style";
import { useSelector } from "react-redux";
import useWindowSize from "../../../shared/common/useWindowSize";

const MealAncillaries = ({
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
          <Grid container spacing={1}>
            {options
              .filter((meal) =>
                selectedOption === "customWithRemarks"
                  ? meal.value === ""
                  : meal
              )
              .map((meal, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <FormControlLabel
                    value={meal.value}
                    control={
                      <Radio
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
                        {meal.label}
                      </span>
                    }
                  />
                </Grid>
              ))}
          </Grid>
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
          ADD THIS ANCILLARY
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
    label: "Infant/baby Food",
    value: "Infant/baby Food",
  },
  {
    label: "Vegetarian Meal",
    value: "Vegetarian Meal",
  },
  {
    label: "Child Meal",
    value: "Child Meal",
  },
  {
    label: "Diabetic Meal",
    value: "Diabetic Meal",
  },
  {
    label: "Sea Food Meal",
    value: "Sea Food Meal",
  },
  {
    label: "Muslim Meal",
    value: "Muslim Meal",
  },
  {
    label: "Premium Meal",
    value: "Premium Meal",
  },
  {
    label: "Continental Meal",
    value: "Continental Meal",
  },
  {
    label: "Low-Calorie Meal",
    value: "Low-Calorie Meal",
  },
  {
    label: "Spicy Indian Meal",
    value: "Spicy Indian Meal",
  },
  {
    label: "Primum  Meal",
    value: "Primum  Meal",
  },
  {
    label: "Traditional Asian Meal",
    value: "Traditional Asian Meal",
  },
  {
    label: "Custom With Remarks",
    value: "customWithRemarks",
  },
];

export default MealAncillaries;
