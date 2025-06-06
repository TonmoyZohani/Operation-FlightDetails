import { Box, Button } from "@mui/material";
import { useState } from "react";

const tabLists = [
  {
    index: 0,
    label: "Job Holder",
  },
  {
    index: 1,
    label: "Businessman",
  },
  {
    index: 2,
    label: "Student",
  },
  {
    index: 3,
    label: "Service Holder",
  },
];

const VisaCheckingTab = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      sx={{
        borderRadius: "5px",
        bgcolor: "var(--secondary-color)",
        height: "39px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        width: "52%",
      }}
    >
      {tabLists?.map((tab) => (
        <Button
          onClick={() => setActiveTab(tab?.index)}
          key={tab?.index}
          sx={{
            bgcolor: activeTab === tab?.index ? "#fff" : "",
            color: activeTab === tab?.index ? "#333333" : "#ffffff",
            height: "26px",
            px: 2,
            fontSize: "13px",
            fontWeight: 500,
            ":hover": {
              bgcolor: "#FFF",
              color: "#333333",
            },
          }}
        >
          {tab?.label}
        </Button>
      ))}
    </Box>
  );
};

export default VisaCheckingTab;
