import { Box, Grid, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ImagePreviewModal from "../../../Modal/ImagePreviewModal";
import { regTitle } from "../../GeneraInfo";
import {
  ClickToUpdate,
  RegDataPreview,
  RegImagePreview,
} from "../PreviewRegistration";
import { useDispatch } from "react-redux";
import { setConcernPerson } from "../../../../features/registrationSlice";

const PreviewConcernInfo = ({ agentReg, setStep }) => {
  const dispatch = useDispatch();
  const [showDoc, setShowDoc] = useState({ label: "", file: null });
  const { concernPerson } = agentReg?.user?.agent;
  const { nidFrontImage, relation } = concernPerson || {};

  useEffect(() => {
    if (
      !["family", "colleague", "employee", "friend", "others"].includes(
        relation
      )
    ) {
      const updatedRel = { othersRelation: relation, relation: "others" };
      dispatch(setConcernPerson({ ...concernPerson, ...updatedRel }));
    }
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: "50px", alignItems: "center", mt: 4 }}>
        <Typography sx={{ ...regTitle, mt: 0 }}>
          Emergency Concern Person Information
        </Typography>
        {agentReg?.user?.status !== "resend" && (
          <ClickToUpdate handleClick={() => setStep(6)} />
        )}
      </Box>

      <Grid container columnSpacing={3}>
        {concernInfo(concernPerson)
          .filter((item) => item.label)
          .map((info, i) => {
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

      <Grid container spacing={3} mt={0}>
        <Grid item md={4} xs={12}>
          <RegImagePreview
            handleOpen={() => {
              setShowDoc({
                label: "NID / VISITING CARD / JOB ID CARD",
                file: nidFrontImage,
              });
            }}
            label={"NID / VISITING CARD / JOB ID CARD"}
            value={nidFrontImage}
          />
        </Grid>

        {/* <Grid item md={4} xs={12}>
          <RegImagePreview
            handleOpen={() => {
              setShowDoc({ label: "NID Back", file: nidBackImage });
            }}
            label={"NID Back"}
            value={nidBackImage}
          />
        </Grid> */}
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

const concernInfo = (concernPerson) => {
  const {
    name,
    gender,
    dateOfBirth,
    relation,
    nationality,
    email,
    phoneNumber,
    whatsappNumber,
  } = concernPerson || {};


  return [
    { label: "Name", value: name },
    { label: "Gender", value: gender },
    {
      label: "Date Of Birth",
      value: moment(dateOfBirth).format("DD MMMM YYYY"),
    },
    { label: "Nationality", value: nationality },
    { label: "Relation", value: relation },
    ...(concernPerson?.othersRelation
      ? [{ label: "Relation Details", value: concernPerson?.othersRelation }]
      : [{}]),
    { label: "Email", value: email },
    { label: "Phone Number", value: phoneNumber },
    { label: "Whatsapp Number", value: whatsappNumber },
  ];
};

export default PreviewConcernInfo;
