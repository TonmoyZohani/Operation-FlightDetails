import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { regTitle } from "../../GeneraInfo";
import {
  ClickToUpdate,
  RegDataPreview,
  RegImagePreview,
} from "../PreviewRegistration";
import ImagePreviewModal from "../../../Modal/ImagePreviewModal";
import { getOrdinal } from "../../../../shared/common/functions";
import moment from "moment";

const PreviewPartnerInfo = ({ agentReg, setStep }) => {
  const { partners } = agentReg?.user?.agent;

  return (
    <Box>
      {partners?.map((partner, i) => (
        <React.Fragment key={i}>
          <Box
            sx={{ display: "flex", gap: "50px", alignItems: "center", mt: 4 }}
          >
            <Typography sx={{ ...regTitle, mt: 0 }}>
              {getOrdinal(i + 2)} Partner Information
            </Typography>

            {agentReg?.user?.status !== "resend" && (
              <ClickToUpdate handleClick={() => setStep(3.1)} />
            )}
          </Box>
          <Grid container columnSpacing={3}>
            {partnerInfo(partner).map((info, i) => {
              return (
                <Grid key={i} item md={4} xs={12}>
                  <RegDataPreview label={info?.label} value={info?.value} />
                </Grid>
              );
            })}
          </Grid>

          <Typography sx={regTitle}>
            {getOrdinal(i + 2)} Partner Documents
          </Typography>
          <ImageBox
            partner={partner}
            imageLabel={`${getOrdinal(i + 2)} Partner`}
          />
        </React.Fragment>
      ))}
    </Box>
  );
};

const ImageBox = ({ partner, imageLabel }) => {
  const [showDoc, setShowDoc] = useState({ label: "", file: null });
  return (
    <>
      <Grid container spacing={3} mt={"-10px"}>
        {partnerDocs(partner, imageLabel).map((info, i) => {
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
    </>
  );
};

const partnerInfo = (partner) => {
  const {
    name,
    gender,
    dateOfBirth,
    email,
    phoneNumber,
    whatsappNumber,
    nationality,
  } = partner;

  return [
    { label: "Name", value: name },
    { label: "Gender", value: gender },
    {
      label: "Date Of Birth",
      value: moment(dateOfBirth).format("DD MMMM YYYY"),
    },
    { label: "Nationality", value: nationality },
    { label: "Email", value: email },
    { label: "Phone Number", value: phoneNumber },
    { label: "Whatsapp Number", value: whatsappNumber },
  ];
};

const partnerDocs = (partner, imageLabel) => {
  const {
    profileImage,
    nidFrontImage,
    nidBackImage,
    tinImage,
    // signatureImage,
  } = partner;

  return [
    {
      label: `${imageLabel} Passport Size Photo`,
      value: profileImage,
    },
    {
      label: `${imageLabel} NID Front`,
      value: nidFrontImage,
    },
    {
      label: `${imageLabel} NID Back`,
      value: nidBackImage,
    },
    {
      label: `${imageLabel} TIN`,
      value: tinImage,
    },
    // {
    //   label: `${imageLabel} Signature`,
    //   value: signatureImage,
    // },
  ];
};

export default PreviewPartnerInfo;
