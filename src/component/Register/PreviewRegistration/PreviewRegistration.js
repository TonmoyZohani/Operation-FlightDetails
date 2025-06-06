import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import PreviewGeneralInfo from "./component/PreviewGeneralInfo";
import PreviewOwnerDocs from "./component/PreviewOwnerDocs";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { registrationImage } from "../OwnerDocs";
import PreviewPartnerInfo from "./component/PreviewPartnerInfo";
import { useDispatch, useSelector } from "react-redux";
import PreviewCompanyInfo from "./component/PreviewCompanyInfo";
import PreviewCompanyDocs from "./component/PreviewCompanyDocs";
import PreviewConcernInfo from "./component/PreviewConcernInfo";
import {
  setAgentReg,
  setSessionExpired,
} from "../../../features/registrationSlice";
import axios from "axios";
import useToast from "../../../hook/useToast";
import CustomToast from "../../Alert/CustomToast";
import CustomAlert from "../../Alert/CustomAlert";
import CustomCheckBox from "../../CustomCheckbox/CustomCheckbox";
import { regSubmitBtn } from "../RegisterPortal";

const PreviewRegistration = ({ isLoading, setIsLoading, setStep }) => {
  const dispatch = useDispatch();
  // const [isLoading, setIsLoading] = useState(false);
  const agentReg = useSelector((state) => state.registration.agentReg);
  const { accessToken } = agentReg;
  const { agent, status } = agentReg?.user;
  const { agencyType } = agent?.agencyInformation;
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [isShow, setIsShow] = useState(false);

  const handleCompleteRegistration = async () => {
    try {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account?step=7`;

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to proceed next Step",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(
          url,
          {},
          {
            headers: { authorization: `Bearer ${accessToken}` },
          }
        );
        const responseData = response?.data;

        if (responseData?.success === true) {
          const agentData = responseData?.data;

          dispatch(
            setAgentReg({ ...agentReg, ...agentData, finalSubmit: true })
          );
        }
      }
    } catch (e) {
      const message = e?.response?.data?.message || "An error occurred";

      showToast("error", message, () => {
        if (e?.response?.data?.statusCode === 401) {
          dispatch(setSessionExpired());
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <PreviewGeneralInfo agentReg={agentReg} setStep={setStep} />
      <PreviewOwnerDocs agentReg={agentReg} />
      {agencyType === "partnership" && (
        <PreviewPartnerInfo agentReg={agentReg} setStep={setStep} />
      )}
      <PreviewCompanyInfo agentReg={agentReg} setStep={setStep} />
      <PreviewCompanyDocs agentReg={agentReg} setStep={setStep} />
      <PreviewConcernInfo agentReg={agentReg} setStep={setStep} />

      <Box sx={{ mb: 1, mt: 6 }}>
        {status === "resend" && (
          <CustomCheckBox
            value={isShow}
            style={{ color: "var(--gray)" }}
            label="Please check all your unverified information carefully before submitting your registration. Otherwise, your agency registration wil be rejected this time."
            handleChange={(e) => {
              setIsShow(e.target.checked);
            }}
          />
        )}
        <br />
        <Box
          mt={2}
          sx={{ display: "flex", gap: 3, justifyContent: "space-between" }}
        >
          <Button
            type="submit"
            style={regSubmitBtn(isLoading)}
            disabled={isLoading || (status === "resend" && !isShow)}
            onClick={handleCompleteRegistration}
          >
            {isLoading
              ? "agency registration is in progress, please Wait..."
              : "complete your agency registration"}
          </Button>
        </Box>
      </Box>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

export const RegDataPreview = ({ label, value }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "60px",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <Typography
        noWrap
        sx={{ width: "50%", fontSize: "13px", color: "var(--dark-gray)" }}
      >
        {label}
      </Typography>
      <Typography
        noWrap
        sx={{ width: "50%", fontSize: "13px", color: "var(--black)" }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export const RegImagePreview = ({ label, value, handleOpen }) => {
  return (
    <Box
      sx={{
        position: "relative",
        border: "1px solid var(--border-color)",
        borderRadius: "5px",
        padding: "12px 16px 8px 16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ color: "var(--text-medium)", fontSize: "13px" }}>
          {label}
        </Typography>

        <RemoveRedEyeIcon
          onClick={handleOpen}
          sx={{
            color: "#666666",
            fontSize: "20px",
            cursor: "pointer",
          }}
        />
      </Box>

      <label
        style={{
          ...registrationImage?.labelContainer,
          borderColor: "var(--border-color)",
        }}
      >
        <Box sx={registrationImage?.imageBox}>
          {typeof value === "string" && (
            <img
              style={{
                height: "100%",
                width: "55%",
                borderRadius: "5px",
              }}
              src={
                value?.toLowerCase()?.includes(".pdf")
                  ? "https://storage.googleapis.com/flyfar-user-document-bucket/svg/PDF_PLACEHOLDER.svg"
                  : value
              }
              alt="registration images"
            />
          )}
        </Box>
      </label>
    </Box>
  );
};

export const ClickToUpdate = ({ handleClick }) => {
  return (
    <Typography
      onClick={handleClick}
      sx={{
        color: "var(--primary-color)",
        fontSize: "13px",
        textDecoration: "underline",
        cursor: "pointer",
      }}
    >
      Click to Update
    </Typography>
  );
};

export default PreviewRegistration;
