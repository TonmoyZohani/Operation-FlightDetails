import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { regTitle } from "../../GeneraInfo";
import { RegImagePreview } from "../PreviewRegistration";
import ImagePreviewModal from "../../../Modal/ImagePreviewModal";

const PreviewOwnerDocs = ({ agentReg, }) => {
  const [showDoc, setShowDoc] = useState({ label: "", file: null });

  const { agent } = agentReg?.user;
  const { agencyType } = agent?.agencyInformation;

  return (
    <Box>
      <Typography sx={regTitle}>
        Agency{" "}
        {agencyType === "proprietorship" ? (
          "Proprietor"
        ) : agencyType === "limited" ? (
          "Managing Director"
        ) : agencyType === "partnership" ? (
          <>
            1<sup>st</sup> Partner
          </>
        ) : (
          "Concern Person"
        )}{" "}
        Documents
      </Typography>

      <Grid container spacing={3} mt={0}>
        {ownerDocs(agentReg).map((info, i) => {
          return (
            <Grid key={i} item md={4} xs={12}>
              <RegImagePreview
                handleOpen={() => {
                  setShowDoc({
                    label: info?.label,
                    file: info?.value,
                  });
                }}
                label={info?.label}
                value={info?.value}
              />
            </Grid>
          );
        })}
      </Grid>

      <ImagePreviewModal
        open={!!showDoc.file}
        imgUrl={showDoc.file}
        onClose={() => {
          setShowDoc({ label: "", file: null });
        }}
        label={showDoc.label}
      />
    </Box>
  );
};

const ownerDocs = (agentReg) => {
  const { agent } = agentReg?.user;
  const { agencyType } = agent?.agencyInformation;
  const {
    profileImage,
    nidFrontImage,
    nidBackImage,
    tinImage,
    // signatureImage,
  } = agent?.ownerDocuments;

  const dynamicLable =
    agencyType === "proprietorship"
      ? "Proprietor"
      : agencyType === "limited"
        ? "Managing Director"
        : agencyType === "partnership"
          ? "1st Partner's"
          : "Owner";

  return [
    {
      label: `${dynamicLable} Passport Size Photo`,
      value: profileImage,
    },
    {
      label: `${dynamicLable} NID Front`,
      value: nidFrontImage,
    },
    {
      label: `${dynamicLable} NID Back`,
      value: nidBackImage,
    },
    {
      label: `${dynamicLable} TIN`,
      value: tinImage,
    },
    // {
    //   label: `${dynamicLable} Signature`,
    //   value: signatureImage,
    // },
  ];
};

export default PreviewOwnerDocs;
