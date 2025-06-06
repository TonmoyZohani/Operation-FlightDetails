import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 34,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "var(--green)",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], { duration: 200 }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "#dc143c",
  },
}));

export const nextStepStyle = {
  position: "sticky",
  bottom: "0px",
  backgroundColor: "var(--primary-color)",
  color: "var(--white)",
  fontSize: "12px",
  width: "100%",
  textAlign: "left",
  padding: "12px 20px",
  zIndex: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
};

export const buttonStyle = {
  position: "sticky",
  bottom: "0px",
  backgroundColor: "var(--primary-color)",
  color: "var(--white)",
  fontSize: "12px",
  width: "100%",
  textAlign: "left",
  padding: "12px 20px",
  zIndex: 1000,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
};

export const mobileButtonStyle = {
  bgcolor: "var(--primary-color)",
  ":hover": { bgcolor: "var(--primary-color)" },
  color: "#FFFFFF",
  width: "100%",
  height: {
    xs: "60px",
    sm: "50px",
  },
  borderRadius: "15px 15px 0px 0px",
  py: {
    xs: 2,
  },
};

export const ancillaryBtn = {
  backgroundColor: "var(--secondary-color)",
  color: "var(--white)",
  fontSize: "12px",
  width: "100%",
  textAlign: "left",
  padding: "5px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
};

export const headerStyle = {
  width: "100%",
  height: "30px",
  backgroundColor: "var(--secondary-color)",
  borderRadius: "3px",
  paddingLeft: "11px",
  marginTop: "13px",
  textAlign: "left",
};

export const filterLabelStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#525371",
};

export const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const countStyle = {
  countContainer: { display: "flex", justifyContent: "space-between" },
  countInerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  countBox: {
    width: "30px",
    height: "30px",
    bgcolor: "#F4F4F4",
    borderRadius: "1.72px",
    color: "var(--primary-color)",
    ...center,
  },

  countText: { fontSize: "17px", fontWeight: 500 },

  countTitle: {
    fontSize: "10px",
    fontWeight: 500,
    textAlign: "center",
    mt: "5px",
    color: "#525371",
  },
};

export const mobileAddBtn = () => ({
  bgcolor: "var(--primary-color)",
  width: "50px",
  height: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  position: "fixed",
  zIndex: "10000",
  right: "50%",
  bottom: "40px",
  cursor: "pointer",
  transform: "translateX(50%)",
});

export const actionBtn = {
  textTransform: "capitalize",
  fontSize: "13px",
  color: "white",
  px: 1.8,

  primary: {
    bgcolor: "var(--primary-color)",
    ":hover": {
      bgcolor: "var(--primary-color)",
    },
  },

  warn: {
    bgcolor: "var(--warn-color)",
    ":hover": {
      bgcolor: "var(--warn-color)",
    },
  },

  approve: {
    bgcolor: "#3C96EE",
    ":hover": { bgcolor: "#3C96EE" },
  },

  reject: {
    bgcolor: "#F11E67",
    ":hover": { bgcolor: "#F11E67" },
  },

  gray: {
    bgcolor: "gray",
    ":hover": { bgcolor: "gray" },
  },
  green: {
    bgcolor: "var(--green)",
    ":hover": { bgcolor: "var(--green)" },
  },
  success: {
    bgcolor: "var(--green)",
    ":hover": { bgcolor: "var(--green)" },
  },
};

export const dialogInputAndTextArea = {
  outline: "none",
  border: "none",
  width: "100%",
  borderRadius: "3px",
  marginTop: "8px",
  padding: "12px 10px",
  textDecoration: "none",
  fontSize: "14px",
};
