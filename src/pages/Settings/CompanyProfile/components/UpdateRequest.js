import { Box, Button, Grid, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import AgentUpdateGeneralInfo from "./updateRequest/AgentUpdateGeneralInfo";
import NewPartnerRequest from "./NewPartnerRequest";
import DeletePartnerRequest from "./DeletePartnerRequest";
import AgentUpdateOwnerDocuments from "./updateRequest/AgentUpdateOwnerDocuments";
import AgentUpdateAgencyInfo from "./updateRequest/AgentUpdateAgencyInfo";
import AgentUpdateDocuments from "./updateRequest/AgentUpdateDocuments";
import AgentUpdateConcernInfo from "./updateRequest/AgentUpdateConcernInfo";
import useWindowSize from "../../../../shared/common/useWindowSize";

const UpdateRequest = ({ currentData, updatedData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { isMobile } = useWindowSize();
  const TabButton = ({ label, isActive, onClick }) => {
    return (
      <Button
        size="small"
        onClick={onClick}
        sx={{
          position: "relative",
          bgcolor: isActive ? "var(--primary-color)" : "",
          ":hover": {
            bgcolor: isActive ? "var(--primary-color)" : "",
          },
          borderRadius: "30px",
          textTransform: "capitalize",
          width: "100%",
          color: isActive ? "white" : "var(--dark-gray)",
        }}
      >
        {label}
      </Button>
    );
  };

  const tabs = [
    updatedData?.whatsappNumber
      ? { label: "General Information Update", status: false }
      : null,

    updatedData?.ownerDocuments &&
    Object.keys(updatedData.ownerDocuments).length > 0
      ? { label: "Owner Documents Update", status: false }
      : null,

    updatedData?.agencyInformation &&
    Object.keys(updatedData.agencyInformation).length > 0
      ? { label: "Agency Information Update", status: false }
      : null,

    (updatedData?.agencyInformation?.documents ||
      updatedData?.agencyInformation?.certificates) &&
    (Object.keys(updatedData.agencyInformation?.documents).length ||
      Object.keys(updatedData.agencyInformation?.certificates).length)
      ? { label: "Agency Documents Update", status: false }
      : null,

    updatedData?.concernPerson &&
    Object.keys(updatedData.concernPerson).length > 0
      ? { label: "Agency Concern Person Update", status: false }
      : null,
  ].filter(Boolean);

  const renderComponent = (label) => {
    switch (label) {
      case "General Information Update":
        return (
          <AgentUpdateGeneralInfo showData={updatedData?.whatsappNumber} />
        );
      case "Owner Documents Update":
        return (
          <AgentUpdateOwnerDocuments showData={updatedData?.ownerDocuments} />
        );
      case "Agency Information Update":
        return (
          <AgentUpdateAgencyInfo showData={updatedData?.agencyInformation} />
        );
      case "Agency Documents Update":
        return (
          <AgentUpdateDocuments showData={updatedData?.agencyInformation} />
        );
      case "Agency Concern Person Update":
        return <AgentUpdateConcernInfo showData={updatedData?.concernPerson} />;
      case "New Partner Request":
        return (
          <NewPartnerRequest
            currentData={currentData}
            updatedData={updatedData}
          />
        );
      case "Delete Partner Request":
        return (
          <DeletePartnerRequest
            currentData={currentData}
            updatedData={updatedData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "var(--shade-light-bg)",
        borderRadius: "5px",
        minHeight: "calc(100vh - 300px)",
        py: 3,
      }}
    >
      <Box>
        {isMobile ? (
          <Box sx={{ ".MuiOutlinedInput-notchedOutline": { border: "none" } }}>
            <Select
              value={activeTab}
              displayEmpty
              inputProps={{ "aria-label": "Select Type" }}
              sx={{
                bgcolor: "var(--primary-color)",
                color: "white",
                textAlign: "left",
                height: "40px",
                textTransform: "uppercase",
                fontSize: "14px",
                width: "100%",
                "&:focus": {
                  outline: "none",
                },
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
              MenuProps={{
                disableScrollLock: true,
                PaperProps: { sx: { maxHeight: "200px", overflowY: "auto" } },
              }}
            >
              {tabs?.map((tab, i) => (
                <MenuItem
                  key={i}
                  value={i} // Using index as value
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => setActiveTab(i)} // Set activeTab to index
                >
                  {tab.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: "#F0F2F5",
              borderRadius: "30px",
              display: "flex",
              gap: "5px",
            }}
          >
            {tabs.map((tab, index) => (
              <TabButton
                key={index}
                label={tab.label}
                status={tab.status}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            ))}
          </Box>
        )}

        {renderComponent(tabs[activeTab]?.label)}
      </Box>
    </Box>
  );
};

export default UpdateRequest;
