import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { regTitle } from "../../GeneraInfo";
import { ClickToUpdate, RegDataPreview } from "../PreviewRegistration";
import moment from "moment";

const PreviewGeneralInfo = ({ agentReg, setStep }) => {
  const { agent, email, phone, status } = agentReg?.user;
  const { agencyType, agencyName } = agent?.agencyInformation;

  return (
    <Box>
      <Typography noWrap sx={{ ...regTitle, mt: 0 }}>
        Agency General Information
      </Typography>

      {/* Agency General Information */}
      <Grid container columnSpacing={3} mt={"0"}>
        <Grid item md={4} xs={12}>
          <RegDataPreview label={"Agency Type"} value={agencyType} />
        </Grid>
        <Grid item md={4} xs={12}>
          <RegDataPreview label={"Agency Name"} value={agencyName} />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: "50px", alignItems: "center", mt: 4 }}>
        <Typography sx={{ ...regTitle, mt: 0 }}>
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
          Information
        </Typography>

        {status !== "resend" && (
          <Box pt={"5px"}>
            <ClickToUpdate handleClick={() => setStep(3)} />
          </Box>
        )}
      </Box>

      <Grid container columnSpacing={3}>
        {agentInfo(agentReg).map((info, i) => {
          return (
            <Grid key={i} item md={4} xs={12}>
              <RegDataPreview label={info?.label} value={info?.value} />
            </Grid>
          );
        })}
      </Grid>

      <Typography sx={regTitle}>Login Information</Typography>

      <Grid container columnSpacing={3}>
        <Grid item md={4} xs={12}>
          <RegDataPreview label={"Email"} value={email} />
        </Grid>
        <Grid item md={4} xs={12}>
          <RegDataPreview label={"Phone Number"} value={phone} />
        </Grid>
      </Grid>
    </Box>
  );
};

const agentInfo = (agentReg) => {
  const { agent, firstName, lastName } = agentReg?.user;
  const { gender, dateOfBirth, whatsappNumber, nationality } = agent;

  return [
    { label: "First Name", value: firstName },
    { label: "Last Name", value: lastName },
    { label: "Gender", value: gender },
    {
      label: "Date Of Birth",
      value: moment(dateOfBirth).format("DD MMMM YYYY"),
    },
    { label: "Nationality", value: nationality },
    { label: "Whatsapp Number", value: whatsappNumber },
  ];
};

export default PreviewGeneralInfo;
