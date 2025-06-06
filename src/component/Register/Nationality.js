import React, { useEffect, useState } from "react";
import Select from "react-select";
import CountryListWithCode from "../../utils/CountryListWithCode";
import { Typography } from "@mui/material";

export const options = CountryListWithCode.map((country) => ({
  value: country.id,
  label: (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={country.flag}
        alt={country.name}
        style={{ width: "20px", marginRight: "10px" }}
      />
      {country.name}
    </div>
  ),
  name: country.name,
  code: country.countryCode,
}));

const Nationality = ({
  nationality,
  handleChangeNationality,
  ownerIndex,
  placeholder,
  isDisabled,
  optionFor = "",
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (option, ownerIndex) => {
    setSelectedOption(option);
    handleChangeNationality(
      optionFor === "registration" ? option : option?.name,
      ownerIndex
    );
  };

  useEffect(() => {
    if (nationality) {
      setSelectedOption(
        options?.find((country) => country?.name === nationality)
      );
    } else {
      // write code here by Masud Rana
      setSelectedOption(null);
    }
  }, [nationality]);

  return (
    <Select
      value={selectedOption}
      onChange={(option) => handleChange(option, ownerIndex)}
      options={options}
      isSearchable={true}
      isMulti={false}
      placeholder={
        <Typography sx={{ fontSize: "14px", textTransform: "uppercase" }}>
          {placeholder || "Select a country"}
        </Typography>
      }
      styles={inputStyle}
      filterOption={filterOption}
      inputProps={{ autoComplete: "off" }}
      autoComplete="off"
      inputId="country-select"
      isDisabled={isDisabled}
    />
  );
};

export const filterOption = (option, inputValue) => {
  return option.data.name.toLowerCase().includes(inputValue.toLowerCase());
};

export const inputStyle = {
  control: (provided, state) => ({
    ...provided,
    zIndex: 2,
    borderColor: state.isFocused ? "#8BB6CC" : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 1px #8BB6CC" : provided.boxShadow,
    "&:hover": {
      borderColor: state.isFocused ? "#8BB6CC" : provided.borderColor,
    },
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 3,
    fontSize: "14px",
  }),
};

export default Nationality;
