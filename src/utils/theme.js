import { createTheme } from "@mui/material/styles";

const commonBtnStyle = (color, bgColor) => {
  return {
    fontSize: "10.5px",
    color: color,
    backgroundColor: bgColor,
    ":hover": { backgroundColor: bgColor },
    padding: "8px 8px 4px",
    borderRadius: "3px",
  };
};

export const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "12px",
          borderBottom: "none",
          padding: "0",
          height: "55px",
          color: "#4d4b4b",
        },
        head: {
          fontWeight: "600",
          height: "48px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid var(--border)",
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "darkBtn" },
          style: { ...commonBtnStyle("white", "#003566") },
        },
        {
          props: { variant: "lightBtn" },
          style: {
            ...commonBtnStyle("var(--light-text)", "#e1e1e1"),
          },
        },
        {
          props: { variant: "primaryBtn" },
          style: {
            ...commonBtnStyle("white", "var(--primary-color)"),
          },
        },
        {
          props: { variant: "successBtn" },
          style: {
            ...commonBtnStyle("white", "var(--green)"),
          },
        },
      ],
    },
  },
});
