import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { regTitle } from "../../GeneraInfo";
import { ClickToUpdate, RegDataPreview } from "../PreviewRegistration";
import moment from "moment";

const PreviewCompanyInfo = ({ agentReg, setStep }) => {
  const { agent, status } = agentReg?.user;
  const { agencyName } = agent?.agencyInformation;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: "50px", alignItems: "center", mt: 4 }}>
        <Typography sx={{ ...regTitle, mt: 0 }}>
          {agencyName} Agency Information
        </Typography>
        {status !== "resend" && (
          <ClickToUpdate handleClick={() => setStep(4)} />
        )}
      </Box>

      <Grid container columnSpacing={3}>
        {companyInfo(agent?.agencyInformation).map((info, i) => {
          return (
            <Grid key={i} item md={4} xs={12}>
              <RegDataPreview
                label={info?.label}
                value={
                  info?.label === "Address"
                    ? info?.value?.slice(0, 25)
                    : info?.value
                }
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

const companyInfo = (agencyInformation) => {
  const {
    phoneNumber,
    whatsappNumber,
    email,
    establishedDate,
    employeeCount,
    addressDetails,
  } = agencyInformation;

  const {
    country,
    state,
    cityName,
    policeStationZone,
    division,
    district,
    upazila,
    postalCode,
    address,
  } = addressDetails;

  const isBD = country === "Bangladesh";

  return [
    {
      label: "Established Date",
      value: moment(establishedDate).format("DD MMMM YYYY"),
    },
    { label: "Employee Count", value: employeeCount },
    { label: "Country", value: country },
    {
      label: isBD ? "Division Name" : "State Name",
      value: isBD ? division : state,
    },
    {
      label: isBD ? "District" : "City Name",
      value: isBD ? district : cityName,
    },
    {
      label: isBD ? "Upazilla / Thana" : "Police Station Zone",
      value: isBD ? upazila : policeStationZone,
    },
    { label: "Postal Code", value: postalCode },
    { label: "Address", value: address },
    { label: "Email Address", value: email },
    { label: "Phone Number", value: phoneNumber },
    { label: "Whatsapp Number", value: whatsappNumber },
  ];
};

export default PreviewCompanyInfo;
