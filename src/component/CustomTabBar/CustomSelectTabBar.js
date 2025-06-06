import { Box, MenuItem, Select } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useWindowSize from "../../shared/common/useWindowSize";

const CustomSelectTabBar = ({ allTabs, activeTab, handleTabChange }) => {
  const { isMobile } = useWindowSize();
  return (
    <Box
      sx={{
        width: {
          xs: "100%",
        },
        height: { md: "50px", sm: "50px", xs: "40px" },
        m: {
          md: "0px auto 20px",
          sm: "0px auto 10px",
          xs: "0px auto 0px",
        },
        borderRadius: isMobile ? "2px" : "5px",
        overflow: "hidden",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Select
        value={activeTab}
        onChange={handleTabChange}
        displayEmpty
        inputProps={{ "aria-label": "Select Type" }}
        IconComponent={ArrowDropDownIcon}
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "var(--secondary-color)",
          color: "white",
          textAlign: "left",
          textTransform: "capitalize",
          py: 1,
          "&:focus": {
            outline: "none",
          },
          "& .MuiSelect-icon": {
            color: "white",
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 250,
              overflowY: "auto",
            },
          },
        }}
      >
        {allTabs?.map((tab, index) => (
          <MenuItem
            key={index}
            value={tab?.value}
            sx={{ textTransform: "capitalize" }}
          >
            {tab?.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CustomSelectTabBar;
