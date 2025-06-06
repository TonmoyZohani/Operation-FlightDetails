import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const tabLists = [
  {
    index: 0,
    label: "Booking Policy",
  },
  {
    index: 1,
    label: "Cancellation & Refund Policy",
  },
];

const TourPolicy = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Box
        sx={{
          borderRadius: "5px",
          bgcolor: "var(--secondary-color)",
          height: "39px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          width: "40%",
          flexWrap: "wrap",
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
              display: "flex",
              alignItems: "center",
            }}
          >
            {tab?.label}
          </Button>
        ))}
      </Box>
      <Box mt={3}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <CheckCircleIcon
            sx={{ color: "var(--primary-color)", fontSize: "18px" }}
          />
          <Typography sx={{ fontSize: "13px" }}>
            20 days long road trip.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <CheckCircleIcon
            sx={{ color: "var(--primary-color)", fontSize: "18px" }}
          />
          <Typography sx={{ fontSize: "13px" }}>
            Visiting most popular places of Europe; Italy, Austria, Slovakia,
            Poland, Czech Republic, Germany, Netherlands, France, Switzerland.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TourPolicy;
