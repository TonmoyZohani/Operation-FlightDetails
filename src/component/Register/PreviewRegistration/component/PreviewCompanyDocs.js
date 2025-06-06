import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { regTitle } from "../../GeneraInfo";
import { ClickToUpdate, RegImagePreview } from "../PreviewRegistration";
import ImagePreviewModal from "../../../Modal/ImagePreviewModal";

const PreviewCompanyDocs = ({ agentReg, setStep }) => {
  const [showDoc, setShowDoc] = useState({ label: "", file: null });

  const { agent, status } = agentReg?.user;
  const { agencyName } = agent?.agencyInformation;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: "50px", alignItems: "center", mt: 4 }}>
        <Typography sx={{ ...regTitle, mt: 0 }}>
          {agencyName} Agency Documents
        </Typography>
        {status !== "resend" && (
          <ClickToUpdate handleClick={() => setStep(5)} />
        )}
      </Box>

      <Grid container spacing={3} mt={0}>
        {companyDocs(agent?.agencyInformation)
          .filter((item) => item.value)
          .map((info, i) => {
            return (
              <Grid key={i} item md={4} xs={12}>
                {info?.value && (
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
                )}
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

const companyDocs = (agencyInformation) => {
  const { logoImage, utilityImage, tradeImage, signBoardImage } =
    agencyInformation?.documents;
  const { civilImage, iataImage, toabImage, atabImage, incorporationImage } =
    agencyInformation?.certificates;

  return [
    { label: "Agency Logo", value: logoImage },
    {
      label: `${agencyInformation?.agencyType === "limited" ? "Managing Director" : agencyInformation?.agencyType === "proprietorship" ? "Proprietor" : "1st Partner"} Visiting Card`,
      value: utilityImage,
    },
    { label: "Sign Board", value: signBoardImage },
    { label: "Trade License", value: tradeImage },
    {
      label: "Civil Aviation Certificate",
      value: civilImage,
    },
    { label: "IATA Certificate", value: iataImage },
    { label: "TOAB Certificate", value: toabImage },
    { label: "ATAB Certificate", value: atabImage },
    {
      label: "Incorporation Certificate",
      value: incorporationImage,
    },
  ];
};

export default PreviewCompanyDocs;
