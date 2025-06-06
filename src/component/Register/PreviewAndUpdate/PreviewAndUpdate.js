import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PreviewGeneralInfo from "./component/PreviewGeneralInfo";
import { setAgentData } from "../../../features/agentRegistrationSlice";
import { registrationErrText } from "../../../shared/common/styles";
import PreviewCompanyInfo from "./component/PreviewCompanyInfo";
import PreviewCompanyDocs from "./component/PreviewCompanyDocs";
import PreviewConcernInfo from "./component/PreviewConcernInfo";
import PreviewOwnerDocs from "./component/PreviewOwnerDocs";
import PreviewOwnerInfo from "./component/PreviewOwnerInfo";
import useToast from "../../../hook/useToast";
import CustomToast from "../../Alert/CustomToast";
import { isMobile } from "../../../shared/StaticData/Responsive";

const PreviewAndUpdate = ({ setStep }) => {
  const dispatch = useDispatch();
  const agent = useSelector((state) => state.agentRegistration.agent);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { accessToken } = agent;

  const [allRegData, setAllRegData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchallRegData = async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/agency-info`;
      setIsLoading(true);
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const responseData = response?.data;
        if (responseData?.success === true) {
          setAllRegData({ ...agent, ...responseData?.data[0] });
          // dispatch(
          //   setAgentData({
          //     ...responseData?.data[0],
          //     isOpen: true,
          //   })
          // );
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchallRegData();
  }, []);

  const handleSubmitallRegData = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/final-submit`;

    setIsUpdating(true);
    try {
      const response = await axios.post(
        url,
        { finalSubmit: 1 },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response?.data;

      if (responseData?.success === true) {
        showToast("success", responseData?.message, () => {
          dispatch(setAgentData({ ...agent, finalSubmit: 1 }));
        });
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box
      sx={{
        // ".css-17x464w-control": { border: "none", boxShadow: "none" },
        // ".flag-dropdown": { border: "none !important" },
        // input: {
        //   ":disabled": {
        //     backgroundColor: "white",
        //     color: "var(--dark-gray) !important",
        //   },
        // },
        // ".css-1jqq78o-placeholder": {
        //   fontSize: "14px",
        // },
        // ".react-tel-input": {
        //   ".form-control": {
        //     backgroundColor: "white",
        //     ":focus": {
        //       boxShadow: "none",
        //     },
        //   },

        //   input: { border: "none !important" },
        //   ".country-list": {
        //     width: "200px !important",
        //   },
        // },

        // ".selected-flag": {
        //   padding: "0",
        //   width: "32px",
        // },
      }}
    >
      {isLoading ? (
        <PreviewUpdateSkeleton />
      ) : (
        <>
          <PreviewGeneralInfo allRegData={allRegData} setStep={setStep} />

          {allRegData?.agentType === "partnership" && (
            <PreviewOwnerInfo allRegData={allRegData} />
          )}

          <PreviewOwnerDocs allRegData={allRegData} />
          <PreviewCompanyInfo allRegData={allRegData} />
          <PreviewCompanyDocs allRegData={allRegData} />
          <PreviewConcernInfo allRegData={allRegData} />
          <Box sx={{ mt: 8 }}>
            <Button
              disabled={isUpdating}
              style={{
                backgroundColor: "var(--secondary-color)",
                color: isUpdating ? "gray" : "white",
                width: isMobile ? "100%" : "215px",
                textTransform: "capitalize",
              }}
              onClick={() => handleSubmitallRegData()}
            >
              {isUpdating ? "Please Wait..." : "Submit for Registration"}
            </Button>
          </Box>
        </>
      )}

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

export const EditAndReset = ({
  setRegData,
  setIsEdit,
  isEdit,
  setUploadProgress = () => {},
  setErrors = () => {},
}) => {
  const agent = useSelector((state) => state.agentRegistration.agent);

  const style = {
    cursor: "pointer",
    fontSize: "13px",
    color: "var(--primary-color)",
    borderBottom: "1px solid var(--primary-color)",
  };

  return (
    <>
      {isEdit ? (
        <Typography
          onClick={() => {
            setIsEdit(false);
            setRegData({ ...agent });
            setUploadProgress({});
            setErrors({});
          }}
          sx={style}
        >
          Click to Reset
        </Typography>
      ) : (
        <Typography onClick={() => setIsEdit(true)} sx={style}>
          Click to Update
        </Typography>
      )}
    </>
  );
};

export const nationalityStyle = (isActive) => {
  return {
    ".css-1dimb5e-singleValue": {
      color: isActive ? "var(--black)" : "var(--dark-gray)",
      fontSize: "14px",
    },

    ".css-1jqq78o-placeholder": {
      color: isActive ? "var(--black)" : "var(--dark-gray)",
    },
  };
};

export const flexCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const updateRegStyle = {
  containerStyle: {
    position: "relative",
    display: "flex",
    alignItems: "end",
    alignItems: "center",
    height: "60px",
    borderBottom: "1px solid var(--border-color)",

    // pb: "5px",
  },

  labelStyle: {
    width: "45%",
    fontSize: "13px",
    color: "var(--dark-gray)",
  },

  valueStyle: { fontSize: "14px", color: "var(--black)" },
  inputStyle: {
    // height: "100%",
    width: "55%",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "var(--black)",
  },

  registrationImage: {
    labelContainer: {
      ...flexCenter,
      flexDirection: "column",
      height: "200px",
      border: "1px solid var(--border-color)",
      borderRadius: "5px",
      cursor: "pointer",
      gap: "10px",
      position: "relative",
    },

    labelText: {
      color: "var(--text-medium)",
      fontSize: "13px",
      textAlign: "center",
    },

    imageBox: {
      height: "120px",
      width: "190px",
      padding: 1,
      border: "1px dashed var(--border-color)",
      borderRadius: "5px",
      ...flexCenter,
    },

    image: {
      height: "100%",
      width: "100%",
      borderRadius: "5px",
    },
  },

  registrationErrText: {
    ...registrationErrText,
    bottom: "-20px",
  },
};

const PreviewUpdateSkeleton = () => {
  return (
    <Box>
      <Skeleton
        variant={"rectangular"}
        animation={"wave"}
        width={"25%"}
        height={"28px"}
        sx={{ borderRadius: "2px", mt: 2 }}
      />
      <Grid container spacing={"24px"} mt={0}>
        {[...new Array(9)].map((_, i) => (
          <Grid key={i} item md={4}>
            <Skeleton
              variant={"rectangular"}
              animation={"wave"}
              width={"100%"}
              height={"45px"}
              sx={{ borderRadius: "2px" }}
            />
          </Grid>
        ))}
      </Grid>

      <Skeleton
        variant={"rectangular"}
        animation={"wave"}
        width={"25%"}
        height={"28px"}
        sx={{ borderRadius: "2px", mt: 5 }}
      />

      <Grid container spacing={"24px"} mt={0}>
        {[...new Array(3)].map((_, i) => (
          <Grid key={i} item md={4}>
            <Skeleton
              variant={"rectangular"}
              animation={"wave"}
              width={"100%"}
              height={"185px"}
              sx={{ borderRadius: "2px" }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PreviewAndUpdate;
