import { Grid } from "@mui/material";
import React from "react";
import FileUpload from "../../../../../component/AirBooking/FileUpload";

const AgentUpdateOwnerDocuments = ({ showData }) => {
  const formattedData = Object.keys(showData).map((key) => ({
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    name: key,
    isDisable: true,
    link: showData[key],
  }));

  return (
    <Grid container spacing={3} mt={0}>
      {formattedData?.map((document, index) => {
        return (
          <Grid key={index} item md={4} xs={12}>
            <FileUpload
              label={document?.label}
              previewImg={document?.link || null}
              isDisable={true}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AgentUpdateOwnerDocuments;
