import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import FileUpload from "../../../../../component/AirBooking/FileUpload";

const AgentUpdateDocuments = ({ showData }) => {
  const documents =
    showData?.documents && typeof showData.documents === "object"
      ? showData.documents
      : {};
  const certificates =
    showData?.certificates && typeof showData.certificates === "object"
      ? showData.certificates
      : {};

  const documentsData = Object.keys(documents).map((key) => ({
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    name: key,
    isDisable: true,
    link: documents[key],
  }));

  const certificatesData = Object.keys(certificates).map((key) => ({
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    name: key,
    isDisable: true,
    link: certificates[key],
  }));

  return (
    <Box>
      {/* Documents file section (Render only if there are documents) */}
      {documentsData.length > 0 && (
        <Box sx={{ my: "10px" }}>
          <Typography
            sx={{
              fontSize: "15px",
              color: "var(--secondary-color)",
              fontWeight: "500",
            }}
          >
            Documents File
          </Typography>

          <Grid
            container
            spacing={3}
            mt={0}
            sx={{
              "& > .MuiGrid-item": {
                paddingTop: "10px",
              },
            }}
          >
            {documentsData.map((document, index) => (
              <Grid key={index} item md={4} xs={12}>
                <FileUpload
                  label={document?.label}
                  previewImg={document?.link || null}
                  isDisable={true}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Certificates file section (Render only if there are certificates) */}
      {certificatesData.length > 0 && (
        <Box>
          <Typography
            sx={{
              fontSize: "15px",
              color: "var(--secondary-color)",
              fontWeight: "500",
            }}
          >
            Certificates File
          </Typography>

          <Grid
            container
            spacing={3}
            mt={0}
            sx={{
              "& > .MuiGrid-item": {
                paddingTop: "10px",
              },
            }}
          >
            {certificatesData.map((document, index) => (
              <Grid key={index} item md={4} xs={12}>
                <FileUpload
                  label={document?.label}
                  previewImg={document?.link || null}
                  isDisable={true}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AgentUpdateDocuments;
