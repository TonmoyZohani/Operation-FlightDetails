import styled from "@emotion/styled";
import { isMobile } from "../StaticData/Responsive";

export const airLineSelectCustomStyle = {
  dropdownIndicator: () => ({
    display: "none",
  }),

  control: (_, state) => {
    return {
      borderColor: state.isFocused ? "" : "none",
      display: "flex",
      cursor: "pointer",
    };
  },

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "var(--third-color)" : "none",
    color: state.isFocused ? "var(--primary-color)" : "var(--text-dark)",
    fontFamily: "Mukta !important",
    margin: "0px",
    padding: "0px",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#D1E9FF",
      fontFamily: "poppins !important",
    },
  }),

  menu: (provided) => {
    return {
      ...provided,
      overflowY: "hidden",
      borderRadius: 0,
      margin: 0,
      boxShadow: "none",
      border: "1px solid var(--border)",
    };
  },

  menuList: (provided) => {
    return {
      ...provided,
      maxHeight: isMobile ? "400px" : "200px",
      "::-webkit-scrollbar": {
        width: "4px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "var(--third-color)",
      },
      "::-webkit-scrollbar-thumb": {
        background: "var(--third-color)",
      },
    };
  },

  multiValue: (provided) => {
    return {
      ...provided,
      backgroundColor: "var(--third-color)",
    };
  },
  multiValueLabel: (provided) => ({
    ...provided,
    color: "var(--primary-color)",
    fontSize: "13px",
    // fontFamily: "Poppins !important",
    ":hover": {
      // fontFamily: "Poppins !important",
    },
  }),

  multiValueRemove: (provided) => {
    return {
      ...provided,
      color: "var(--primary-color)",
      cursor: "pointer",
      padding: 1,
      ":hover": {
        backgroundColor: "",
        fontFamily: "Mukta !important",
      },
    };
  },

  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

export const customSelectStyle = {
  option: (provided) => {
    return {
      ...provided,
      margin: "0px",
      padding: "5px 8px",
      cursor: "pointer",
      fontSize: "12px",
      backgroundColor: "none",
      color: "var(--text-medium)",
      ":hover": {
        backgroundColor: "var(--light-pr-clr)",
      },
    };
  },

  control: (provided, state) => {
    return {
      ...provided,
      borderColor: state.isFocused ? "white" : "white",
      "&:hover": { borderColor: "none" },
      boxShadow: "none",
      display: "flex",
      cursor: "pointer",
      fontSize: "11px",
      padding: "0px",
    };
  },
  indicatorSeparator: () => null,
  menuList: (provided) => {
    return {
      ...provided,
      // maxHeight: "175px",
      // "::-webkit-scrollbar": { width: "0px", height: "0px" },
      // "::-webkit-scrollbar-track": { background: "#e9f7ff" },
      // "::-webkit-scrollbar-thumb": { background: "#e9f7ff" },
      padding: "0px",
    };
  },
};

export const BpIcon = styled("span")(
  ({ name, searchOptions, boxShadowColor = "var(--secondary-color)" }) => ({
    width: 13,
    height: 13,
    boxShadow: `0 0 0 1px ${
      name === "fareType" && searchOptions.searchType === "advanced"
        ? ""
        : boxShadowColor
    }`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  })
);

export const BpCheckedIcon = styled(BpIcon)(
  ({
    bgColor = "var(--secondary-color)",
    boxShadowColor = "var(--secondary-color)",
  }) => ({
    boxShadow: `0 0 0 1px ${boxShadowColor}`,
    "&::before": {
      display: "block",
      width: 11,
      height: 11,
      backgroundColor: bgColor,
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "none",
    },
  })
);

export const radioStyle = {
  color: "var(--primary-color)",
  "&.Mui-checked": {
    color: "var(--primary-color)",
  },
};

export const muiInputStyle = {
  ".MuiInputLabel-root.Mui-focused": {
    color: "var(--text-medium)",
    outline: "none",
  },
  ".MuiInputLabel-root": {
    color: "var(--text-medium)",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      borderColor: "var(--text-medium)",
    },
    "&.Mui-focused fieldset": {
      borderBottom: "none",
    },
  },
};

export const modifySearchRadio = {
  position: "absolute",
  bgcolor: "white",
  top: "111%",
  borderRadius: "4px",
  p: "5px 5px 5px 15px",
  zIndex: "100",
  left: "-1px",
  ".MuiFormControlLabel-root": {
    marginRight: "0px",
    pr: "12px",
    ":hover": {
      bgcolor: "var(--light-primary-color)",
    },
  },
  ".MuiFormControlLabel-label": {
    fontSize: "14px",
  },
};

export const dashboardTextArea = {
  ".MuiInputLabel-root.Mui-focused": {
    color: "var(--text-medium)",
    outline: "none",
  },

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "var(--table-border)",
    },
    "&:hover fieldset": {
      borderColor: "var(--text-medium)",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid var(--text-medium)",
    },
  },
};

export const phoneNumberTextArea = {
  ".flag-dropdown": {
    backgroundColor: "transparent",
    border: "none",
  },
  ".special-label": {
    backgroundColor: "white",
    color: "var(--text-medium)",
  },
  ".form-control": {
    border: "1px solid var(--table-border)",
  },
  ".react-tel-input": {
    height: "52px",
  },

  ".form-control:focus": {
    border: "1px solid var(--text-medium)",
    boxShadow: "none",
  },
};

export const registrationTextArea = {
  ".MuiInputLabel-root.Mui-focused": {
    color: "var(--text-medium)",
    outline: "none",
  },

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "var(--table-border)",
    },

    "& input": {
      padding: "14.5px",
    },

    "&:hover fieldset": {
      borderColor: "var(--text-dar)",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid var(--text-medium)",
    },
  },

  "& .MuiSelect-select": {
    padding: "14.5px",
  },

  "& .MuiFormLabel-root": {
    fontSize: "14px",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(.85)",
  },
};

export const updateButton = {
  bgcolor: "var(--primary-color)",
  color: "white",
  width: "80px",
  textTransform: "capitalize",
  ":hover": {
    bgcolor: "var(--primary-color)",
  },
};

export const cancleButton = {
  bgcolor: "var(--text-dark)",
  color: "white",
  width: "80px",
  textTransform: "capitalize",
  ":hover": {
    bgcolor: "var(--text-dark)",
  },
};

export const editButton = {
  display: "flex",
  alignItems: "start",
  gap: "8px",
  mt: "5px",
  cursor: "pointer",
};

export const addButton = {
  bgcolor: "var(--text-dark)",
  color: "white",
  px: "20px",
  textTransform: "capitalize",
  ":hover": {
    bgcolor: "var(--text-dark)",
  },
};

export const searchButton = {
  bgcolor: "var(--primary-color)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  cursor: "pointer",
};

export const sectionSubTitle = {
  color: "var(--primary-color)",
  bgcolor: "var(--third-color)",
  fontSize: "14px",
  padding: "5px 0px 5px 15px",
  clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)",
};

export const secondarySectionSubTitle = {
  fontSize: "14px",
  clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)",
  padding: "5px 0px 5px 15px",
};

export const customSelect = {
  control: (_, state) => {
    return {
      borderColor: state.isFocused ? "" : "none",
      display: "flex",
      cursor: "pointer",
      width: "100%",
    };
  },
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "var(--third-color)" : "none",
    color: state.isFocused ? "var(--primary-color)" : "var(--text-dark)",
    padding: "5px",
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--text-medium)",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0px",
  }),
};

export const registrationBtnBox = {
  position: "absolute",
  top: "0px",
  right: "8px",
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const registrationBtnStyle = {
  bgcolor: "#DC143C",
  ":hover": {
    bgcolor: "#DC143C",
  },
  color: "white",
  textTransform: "capitalize",
  height: "25px",
  fontSize: "12px",
};

export const sharedInputStyles = {
  fontFamily: "Mukta, sans-serif",
  textTransform: "uppercase",
  width: "100%",
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#8BB6CC",
      borderWidth: "1px",
    },
    fieldset: {
      borderColor: "var(--border-color)",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "var(--primary-color)",
    },
  },
  "& .MuiInputBase-input": {
    fontFamily: "Mukta, sans-serif",
  },
  "& .MuiFormLabel-root": {
    fontFamily: "Mukta, sans-serif",
  },
};

export const sharedButtonStyles = {
  mt: "25px",
  fontSize: "11px",
  bgcolor: "var(--secondary-color)",
  ":hover": {
    bgcolor: "var(--secondary-color)",
  },
  color: "var(--white)",
  px: "20px",
  textTransform: "none",
};

export const registrationImage = {
  labelContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "185px",
    border: "1px solid var(--border-color)",
    borderRadius: "5px",
    cursor: "pointer",
    gap: "10px",
    justifyContent: "center",
  },

  labelText: {
    color: "var(--text-medium)",
    fontSize: "13px",
    textAlign: "center",
  },

  imageBox: {
    height: "95px",
    width: "140px",
    padding: 1,
    border: "1px dashed var(--border-color)",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  pdfBox: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export const layoutBox = {
  bgcolor: "background.paper",
  borderRadius: "5px",
  px: 3,
  py: 2,
  height: "100%",
};

export const registrationErrText = {
  fontSize: "10.5px",
  position: "absolute",
  left: "2px",
  bottom: "-20px",
  color: "red",
  letterSpacing: "0.8px",
};

export const primaryBtn = {
  bgcolor: "var(--primary-color)",
  color: "var(--white)",
  height: "45px",
  fontSize: "15px",
  padding: "12px 20px",
  marginTop: "20px",
  fontWeight: 600,
  textTransform: "capitalize",
  ":hover": { bgcolor: "var(--primary-color)" },
};

export const secondaryBtn = {
  bgcolor: "var(--secondary-color)",
  color: "var(--white)",
  height: "45px",
  fontSize: "15px",
  padding: "12px 20px",
  marginTop: "20px",
  fontWeight: 600,
  textTransform: "capitalize",
  ":hover": { bgcolor: "var(--secondary-color)" },
};

export const lightBlueBtn = {
  bgcolor: "#184875",
  color: "var(--white)",
  height: "45px",
  fontSize: "15px",
  padding: "12px 20px",
  marginTop: "20px",
  fontWeight: 600,
  textTransform: "capitalize",
  ":hover": { bgcolor: "#184875" },
};

export const depositBtn = {
  backgroundColor: "var(--primary-color)",
  color: "var(--white)",
  width: "100%",
  height: "45px",
  fontSize: "15px",
  padding: "12px 20px",
  marginTop: "20px",
  fontWeight: 600,
  ":hover": { backgroundColor: "var(--primary-color)" },
};

export const phoneInputLabel = {
  position: "absolute",
  top: "-9px",
  zIndex: "1",
  bgcolor: "white",
  fontSize: "12px",
  left: "24px",
  px: "2px",
  color: "var(--dark-gray)",
  textTransform: "upperCase",
};
