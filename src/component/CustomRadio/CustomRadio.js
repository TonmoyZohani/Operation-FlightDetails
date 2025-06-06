import { styled } from "@mui/material";

export const BpIcon = styled("span")(() => ({
  borderRadius: "50%",
  width: 17,
  height: 17,
  border: "1px solid var(--primary-color)",
}));

export const BpCheckedIcon = styled(BpIcon)({
  border: "1px solid var(--primary-color)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:before": {
    display: "block",
    width: 13,
    height: 13,
    backgroundColor: "var(--primary-color)",
    borderRadius: "50%",
    content: '""',
  },
});

export const NormalBpOutIcon = styled(BpIcon)({
  border: "1px solid var(--secondary-color)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
