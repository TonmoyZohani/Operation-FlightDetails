import {
  Box,
  CircularProgress,
  Grid,
  Slide,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/material.css";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { setAgentLogin, setAgentReg } from "../../features/registrationSlice";
import { isMobile } from "../../shared/StaticData/Responsive";
import CustomAlert from "../Alert/CustomAlert";
import CompanyDocs from "./CompanyDocs";
import CompanyInfo from "./CompanyInfo";
import CompleteRegistration from "./CompleteRegistration";
import ConcernInfo from "./ConcernInfo";
import GeneraInfo from "./GeneraInfo";
import OwnerDocs from "./OwnerDocs";
import PartnerInfo from "./PartnerInfo";
import PreviewRegistration from "./PreviewRegistration/PreviewRegistration";
import Verification from "./Verification";
import CloseIcon from "@mui/icons-material/Close";

const RegisterPortal = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const agentReg = useSelector((state) => state.registration.agentReg);
  const { pageNumber, user, finalSubmit, cameFrom } = agentReg;
  const { status, agent = {} } = user ?? {};
  const { agencyInformation = {} } = agent;
  const agencyType = agencyInformation.agencyType ?? user?.agencyType;

  const handleStep = (step) => {
    if (step <= pageNumber && step > 2) {
      setStep(step);
    }
  };

  useEffect(() => {
    if (cameFrom === "login") {
      CustomAlert({
        success: true,
        message: "Welcome back to your registraion?",
      });
      dispatch(setAgentReg({ field: "cameFrom", value: "" }));
    }
  }, []);

  useEffect(() => {
    // setStep(6);
    setStep(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    if (finalSubmit === false) {
      const unloadCallback = (event) => {
        event.preventDefault();
        event.returnValue = "";
        return "";
      };

      window.addEventListener("beforeunload", unloadCallback);
      return () => window.removeEventListener("beforeunload", unloadCallback);
    }
  }, [finalSubmit]);

  const allSteps =
    pageNumber > 2
      ? agencyType === "partnership"
        ? partnerSteps
        : verifiedSteps
      : initialSteps;

  const handleClose = () => {
    CustomAlert({
      success: "warning",
      message: "Are you sure you want to skip your registraion?",
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(setAgentReg({ field: "isOpen", value: false }));
        window.location.reload();
      }
    });
  };

  const disableSteps = pageNumber > 2 && pageNumber < 3;

  return (
    <Box
      sx={{
        ".MuiFormLabel-root": { fontSize: "14px", top: "1px" },
        ".MuiInputBase-root": { fontSize: "14px" },
        ".swal2-container": {
          ".swal2-popup": { position: "absolute !important", bottom: "35px" },
        },
        // position: isLoading ? "fixed" : "static",
        overflowY: isLoading && "hidden",
      }}
    >
      <Box sx={{ p: "15px" }}>
        {finalSubmit === false ? (
          <>
            <Box>
              {/* title section */}
              <Box sx={{ ml: "10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--secondary-color)",
                      fontSize: "25px",
                      fontWeight: "500",
                    }}
                  >
                    Register Now to Become Our Travel Business Partner
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="Close">
                      <Box onClick={() => handleClose()} sx={iconBox}>
                        <CloseIcon
                          sx={{
                            color: "white",
                            fontSize: "20px",
                            borderRadius: "50%",
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    mt: "10px",
                    color: "#B6B6CC",
                    fontSize: "13px",
                    visibility: pageNumber === 1 ? "visible" : "hidden",
                  }}
                >
                  Already have an agent Account?{" "}
                  <span
                    onClick={() => {
                      dispatch(setAgentReg({ field: "isOpen", value: false }));
                      dispatch(setAgentLogin({ isOpen: true }));
                    }}
                    style={{
                      color: "var(--secondary-color)",
                      cursor: "pointer",
                    }}
                  >
                    Sign In
                  </span>
                </Typography>
              </Box>
              {/* bar section */}

              <Box sx={{ mx: "10px", mt: "20px" }}>
                <Grid container columnSpacing={isMobile ? "5px" : 2}>
                  {allSteps
                    .sort((a, b) => a.id - b.id)
                    .map((steper, i, arr) => {
                      const isActive =
                        agencyType === "partnership"
                          ? pageNumber > 3.1
                            ? i - 1 < pageNumber
                            : i < pageNumber
                          : i + 1 <= pageNumber;

                      return (
                        <Grid
                          key={i}
                          item
                          xs={
                            arr.length > 2
                              ? step === steper?.id
                                ? 3.5
                                : 8.5 / (arr.length - 1)
                              : 6
                          }
                        >
                          <Box
                            onClick={() => handleStep(steper?.id)}
                            sx={{
                              cursor:
                                pageNumber > 2 && i < 2 ? "static" : "pointer",
                              pt: "10px",
                              position: "relative",
                              pointerEvents: status === "resend" && "none",
                            }}
                          >
                            <Box sx={{ bgcolor: "#B6B6CC", ...stepLine }}>
                              <Box
                                sx={{
                                  width: step >= steper?.id ? "100%" : "0%",
                                  bgcolor:
                                    pageNumber > 2 && i < 2
                                      ? "green"
                                      : "var(--primary-color)",
                                  ...stepLine,
                                }}
                              />
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "13px",
                                color:
                                  pageNumber > 2 && i < 2
                                    ? "green"
                                    : isActive
                                      ? "var(--primary-color)"
                                      : "#B6B6CC",
                                mt: "5px",
                                fontWeight: "500",
                                right: "0",
                              }}
                            >
                              {!isMobile && <>Step 0{i + 1}</>}
                              {step === steper?.id ? (
                                <>
                                  {!isMobile && " :"} {steper?.name}
                                </>
                              ) : (
                                ""
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                </Grid>
              </Box>
            </Box>

            <Box sx={{ mx: "10px", mt: "25px" }}>
              {step === 1 ? (
                <>
                  {/* General Information Operation form */}
                  <GeneraInfo
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setStep={setStep}
                  />
                </>
              ) : step === 2 ? (
                <>
                  {/* Verification Operation form */}
                  <Verification
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    step={step}
                    setStep={setStep}
                  />
                </>
              ) : step === 3 ? (
                <>
                  {/* Owner Information for partnership */}
                  <OwnerDocs
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setStep={setStep}
                  />
                </>
              ) : step === 3.1 ? (
                <>
                  {/* Add Partners for partnership */}
                  <PartnerInfo
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setStep={setStep}
                  />
                </>
              ) : step === 4 ? (
                <>
                  {/* Owner Docs for non-partnership */}
                  {/* <OwnerDocs step={step} setStep={setStep} /> */}
                  <CompanyInfo
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setStep={setStep}
                  />
                </>
              ) : step === 5 ? (
                <>
                  {/* Company Info for non-partnership */}
                  <CompanyDocs
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setStep={setStep}
                  />
                </>
              ) : step === 6 ? (
                <>
                  {/* Company Docs Operation form */}
                  <ConcernInfo
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    step={step}
                    setStep={setStep}
                  />
                </>
              ) : step === 7 ? (
                <>
                  {/* Concern Information Operation form */}
                  {/* <ConcernInfo step={step} setStep={setStep} /> */}
                  <PreviewRegistration
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setStep={setStep}
                  />
                </>
              ) : step === 8 ? (
                <>
                  {/* Preview Information Operation form */}
                  {/* <PreviewAndUpdate setStep={setStep} /> */}
                </>
              ) : null}
            </Box>
          </>
        ) : (
          <CompleteRegistration />
        )}
      </Box>

      {isLoading && (
        <RegLoader isLoading={isLoading} step={step} agencyType={agencyType} />
      )}
    </Box>
  );
};

export const RegLoader = ({ isLoading, step, agencyType }) => {
  return (
    <Box
      sx={{
        bgcolor: "#00000080",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: "0",
        zIndex: "100",
      }}
    >
      <Box sx={{ height: "100vh", position: "relative", zIndex: "100" }}>
        <Slide direction="up" in={isLoading}>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "80px",
              bgcolor: "white",
              boxShadow: 3,
              py: 2,
              px: 5,
              zIndex: "100",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: "500" }}>
                We Are Processing Your{" "}
                <span
                  style={{ color: "var(--primary-color)", fontWeight: "500" }}
                >
                  Registration Step: 0
                  {agencyType === "partnership" && step > 3
                    ? Math.ceil(step) + 1
                    : step}
                </span>{" "}
                Request
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "var(--dark-gray)" }}>
                Please Wait For A Moment
              </Typography>
            </Box>

            <CircularProgress sx={{ color: "var(--primary-color)" }} />
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export const RemoveDate = ({ handleClick }) => {
  return (
    <CloseIcon
      onClick={handleClick}
      sx={{
        position: "absolute",
        right: "6px",
        top: "10px",
        cursor: "pointer",
        fontSize: "18px",
        color: "#00000099",
        ":hover": { color: "#000" },
      }}
    />
  );
};

const stepLine = {
  height: "4px",
  borderRadius: "5px",
  transition: "width 0.5s",
};

export const iconBox = {
  bgcolor: "var(--primary-color)",
  borderRadius: "50%",
  height: "32px",
  width: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const initialSteps = [
  { id: 1, name: "General Information" },
  { id: 2, name: "General Information" },
];

const restSteps = [
  { id: 3, name: "Owner Information" },
  { id: 4, name: "Agency Information" },
  { id: 5, name: "Agency Documents" },
  { id: 6, name: "Concern Information" },
  { id: 7, name: "Preview & Update Information" },
];

const verifiedSteps = [...initialSteps, ...restSteps];

const partnerSteps = [
  ...verifiedSteps,
  { id: 3.1, name: "Partner Information" },
];

export const regSubmitBtn = (isLoading) => {
  return {
    backgroundColor: "var(--secondary-color)",
    color: isLoading ? "gray" : "white",
    width: "100%",
    textTransform: "capitalize",
    justifyContent: "start",
    padding: "10px 0 10px 20px",
  };
};

export default RegisterPortal;
