import CloseIcon from "@mui/icons-material/Close";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import FileUpload from "../../../../component/AirBooking/FileUpload";
import ImagePreviewModal from "../../../../component/Modal/ImagePreviewModal";
import { regTitle } from "../../../../component/Register/GeneraInfo";
import { getOrdinal } from "../../../../shared/common/functions";
import CompanyOwnerDocsDrawer from "./CompanyOwnerDocsDrawer";
import useWindowSize from "../../../../shared/common/useWindowSize";

const CompanyOwnerDocs = ({
  agentProfile,
  setAgentProfile,
  isEditable,
  refetch,
}) => {
  const { isMobile } = useWindowSize();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [partner, setPartner] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const [editable, setEditable] = useState(false);
  
  const ownershipType =
    agentProfile?.currentData?.agencyInformation?.agencyType?.toLowerCase();

  const ownershipData =
    ownershipType === "partnership"
      ? agentProfile?.currentData?.partners
      : [agentProfile?.currentData?.ownerDocuments];

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setActiveIndex(null);
    setPartner({});
  };

  const handleDrawerOpen = (index, partner) => {
    setActiveIndex(index);
    setPartner(partner);
    setDrawerOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 300px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          minHeight: "calc(100vh - 300px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {ownershipData?.map((partner, partnerIndex) => {
          return (
            <Box
              key={partnerIndex}
              sx={{
                minHeight: "calc(100vh - 300px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: !isMobile && "center",
                    mt: 4,
                    flexDirection: {
                      xs: "column",
                      lg: "row",
                      md: "row",
                      sm: "row",
                    },
                    gap: { xs: 1.3, lg: "0px" },
                    mb: { xs: 2, lg: 0, md: 0, sm: 0 },
                  }}
                >
                  <Typography sx={{ ...regTitle, mt: 0 }}>
                    {ownershipType === "proprietorship" ? (
                      "Proprietor"
                    ) : ownershipType === "limited" ? (
                      "Managing Director"
                    ) : ownershipType === "partnership" ? (
                      <>{getOrdinal(partnerIndex + 1)} Managing Partner</>
                    ) : (
                      "Owner"
                    )}{" "}
                    Documents
                  </Typography>
                  {activeIndex === partnerIndex ? (
                    <Typography
                      onClick={() => setActiveIndex(null)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "4px",
                        cursor: "pointer",
                        color: "white",
                        bgcolor: "var(--primary-color)",
                        px: 1,
                        borderRadius: "3px",
                        width: "130px",
                      }}
                    >
                      <span style={{ paddingTop: "5px" }}>
                        {!isMobile && "Click to "} Close
                      </span>
                      <CloseIcon />
                    </Typography>
                  ) : (
                    isEditable && (
                      <Typography
                        onClick={() => handleDrawerOpen(partnerIndex, partner)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "4px",
                          cursor: "pointer",
                          color: "white",
                          bgcolor: "var(--primary-color)",
                          px: 1,
                          borderRadius: "3px",
                          width: "130px",
                        }}
                      >
                        <span style={{ paddingTop: "3px", fontSize: "13px" }}>
                          {!isMobile && "Click to "} Update
                        </span>
                        <EditCalendarIcon sx={{ p: 0.25 }} />
                      </Typography>
                    )
                  )}
                </Box>

                <Grid container spacing={3} mt={0}>
                  {ownerInfoProps?.imageFields?.map((field, index) => {
                    if (field?.name && partner && partner[field?.name]) {
                      const documentExists =
                        agentProfile?.updatedData?.ownerDocuments?.[
                          field?.name
                        ];

                      return (
                        <Grid key={index} item md={4} sm={6} xs={12}>
                          <FileUpload
                            label={field?.label}
                            previewImg={partner[field?.name] || null}
                            isDisable={isEditable || field?.isDisable}
                            accept=".jpg,.jpeg,.png,.pdf"
                            acceptLabel="JPG JPEG PNG & PDF"
                          />
                          {/* Conditionally show "Exist" text */}
                          {documentExists && (
                            <Typography
                              sx={{
                                textAlign: "start",
                                fontSize: "12px",
                                color: "green",
                                marginTop: "8px",
                              }}
                            >
                              Already in update request
                            </Typography>
                          )}
                        </Grid>
                      );
                    }
                    return null;
                  })}
                </Grid>
              </Box>
            </Box>
          );
        })}
      </Box>

      <ImagePreviewModal
        open={imageUrl}
        imgUrl={imageUrl}
        onClose={setImageUrl}
      />
      
      <CompanyOwnerDocsDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        onClose={handleDrawerClose}
        agentProfile={agentProfile}
        setAgentProfile={setAgentProfile}
        partner={partner}
        setPartner={setPartner}
        activeIndex={activeIndex}
        ownershipType={ownershipType}
        refetch={refetch}
        ownershipData={ownershipData}
      />
    </Box>
  );
};

const ownerInfoProps = {
  imageFields: [
    {
      label: "Profile Image",
      name: "profileImage",
      isDisable: true,
    },
    {
      label: "NID Front Image",
      name: "nidFrontImage",
      isDisable: true,
    },
    {
      label: "NID Back Image",
      name: "nidBackImage",
      isDisable: true,
    },
    {
      label: "TIN Image",
      name: "tinImage",
      isDisable: true,
    },
    // {
    //   label: "Business Card",
    //   name: "signatureImage",
    //   isDisable: true,
    // },
  ],
};

const flexCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const showregistrationImage = {
  labelContainer: {
    ...flexCenter,
    flexDirection: "column",
    height: "200px",
    border: "1px solid var(--border-color)",
    borderRadius: "5px",
    cursor: "pointer",
    gap: "10px",
  },

  labelText: {
    color: "var(--text-medium)",
    fontSize: "13px",
    textAlign: "center",
  },

  imageBox: {
    height: "120px",
    width: "190px",
    padding: 1,
    border: "1px dashed var(--border-color)",
    borderRadius: "5px",
    ...flexCenter,
  },

  image: {
    height: "100%",
    width: "100%",
    borderRadius: "5px",
  },
};

export default CompanyOwnerDocs;
