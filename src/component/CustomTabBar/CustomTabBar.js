import { Box, Button } from "@mui/material";
import useWindowSize from "../../shared/common/useWindowSize";

const CustomTabBar = ({
  allTabs,
  activeTab,
  setActiveTab,
  bgDark = "var(--secondary-color)",
  setTextActiveTab,
  textActiveTab,
}) => {
  const { isMobile } = useWindowSize();
  return (
    <Box
      sx={{
        bgcolor: "#F0F2F5",
        borderRadius: "30px",
        display: "flex",
      }}
    >
      {allTabs.map((tab, i) => {
        const isActive = activeTab === i || textActiveTab === tab;
        return (
          <Button
            key={i}
            onClick={() => {
              if (setTextActiveTab) {
                setTextActiveTab(tab);
              } else if (setActiveTab) {
                setActiveTab(i);
              }
            }}
            sx={{
              bgcolor: isActive ? bgDark : "none",
              ":hover": {
                bgcolor: isActive ? bgDark : "transparent",
              },
              borderRadius: "30px",
              textTransform: "capitalize",
              width: "100%",
              color: isActive ? "white" : "var(--dark-gray)",
              fontSize: isMobile ? "10px" : "13px",
            }}
          >
            {tab}
          </Button>
        );
      })}
    </Box>
  );
};

export default CustomTabBar;
