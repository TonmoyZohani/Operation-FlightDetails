import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import RegImageBox from "./RegImageBox";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  convertCamelToTitle,
  fileTypeValid,
} from "../../shared/common/functions";
import axios from "axios";
import { regTitle } from "./GeneraInfo";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";
import CustomAlert from "../Alert/CustomAlert";
import {
  setAgencyInformation,
  setAgentReg,
  setSessionExpired,
} from "../../features/registrationSlice";
import { regSubmitBtn } from "./RegisterPortal";
import ErrorDialog from "../Dialog/ErrorDialog";

const CompanyDocs = ({ isLoading, setIsLoading, setStep }) => {
  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const agentReg = useSelector((state) => state.registration.agentReg);

  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { accessToken, correctionFields, pageNumber } = agentReg;
  const { agencyInformation } = agentReg?.user?.agent;
  const { agencyName, agencyType, documents, certificates } = agencyInformation;

  useEffect(() => {
    if (correctionFields) {
      if (correctionFields.length > 0) {
        const unverifiedObj = {};
        correctionFields.forEach((field) => {
          unverifiedObj[field] =
            reqDocFields(agencyType).find((item) => item?.name === field)
              ?.label + " is not verified";
        });

        setErrors(unverifiedObj);
      }
    }
  }, []);

  const handleSubmitCompanyDocs = async () => {
    const { agencyId, uid, id, createdAt, updatedAt, ...rest } = {
      ...documents,
      ...certificates,
    };

    const unverifiedFileBody = {};

    if (correctionFields.length > 0) {
      correctionFields.forEach((key) => {
        unverifiedFileBody[key] = rest[key];
      });
    }

    const formData = new FormData();

    Object.keys(
      correctionFields.length > 0 ? unverifiedFileBody : rest
    ).forEach((key) => {
      formData.append(
        key,
        correctionFields.length > 0 ? unverifiedFileBody[key] : rest[key]
      );
    });

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account?step=5`;

    try {
      await companyDocsValidationSchema(agencyType).validate(rest, {
        abortEarly: false,
      });
      setErrors({});
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to proceed next Step",
      });

      if (result?.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        const responseData = response?.data;
        if (responseData?.success === true) {
          const agentData = responseData?.data;

          const nextStep = Number(agentData?.metadata?.step);

          dispatch(
            setAgentReg({ ...agentReg, ...agentData, pageNumber: nextStep })
          );

          const message = `Agency Documents ${pageNumber > 5 || correctionFields?.length > 0 ? "Updated" : "Completed"} Successfully`;

          showToast("success", message, () => {
            setStep(nextStep);
          });
          setUploadProgress({});
        }
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        // CustomAlert({
        //   success: "warning",
        //   message:
        //     Object.keys(validationErrors)
        //       .map((a) => convertCamelToTitle(a))
        //       .join(", ") +
        //     " field have validation errors. Please ensure the required criteria.",
        //   alertFor: "registration",
        // });

        setShowErrorDialog(true);
        setErrors(validationErrors);
      } else {
        const message = err?.response?.data?.message || "An error occurred";

        showToast("error", message, () => {
          if (err?.response?.data?.statusCode === 401) {
            dispatch(setSessionExpired());
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeCompnayDocs = async (reqDoc, file) => {
    const updated = {
      ...agencyInformation,
      [reqDoc?.type]: {
        ...agencyInformation[reqDoc?.type],
        [reqDoc?.name]: file,
      },
    };

    const isDeleteFile =
      file === null &&
      typeof agencyInformation[reqDoc?.type][reqDoc?.name] === "string" &&
      (reqDoc?.name === "civilImage" ||
        reqDoc?.name === "iataImage" ||
        reqDoc?.name === "toabImage" ||
        reqDoc?.name === "atabImage");

    if (isDeleteFile) {
      const result = await CustomAlert({
        success: "warning",
        message: `Are you sure? You want to delete ${convertCamelToTitle(reqDoc?.name)}`,
      });

      if (result?.isConfirmed) {
        setIsLoading(true);

        try {
          const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account/remove-agency-docs`;
          const response = await axios.patch(
            url,
            JSON.stringify({ [reqDoc?.name]: true }),
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const responseData = response?.data;

          if (responseData?.success === true) {
            showToast("success", responseData?.message);
            dispatch(setAgencyInformation(updated));
          }
        } catch (err) {
          const message = err?.response?.data?.message || "An error occurred";

          showToast("error", message, () => {
            if (err?.response?.data?.statusCode === 401) {
              dispatch(setSessionExpired());
            }
          });
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      dispatch(setAgencyInformation(updated));
    }
  };

  return (
    <Box sx={{ pointerEvents: isLoading && "none" }}>
      <Typography sx={{ ...regTitle, mt: 3 }}>
        {agencyName} Agency Documents
      </Typography>
      <Box
        sx={{
          minHeight: "calc(100vh - 210px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "50px",
        }}
      >
        <Grid container spacing={3} mt={0}>
          <RegImageBox
            errors={errors}
            setErrors={setErrors}
            reqDocFields={reqDocFields(agencyType)}
            data={{
              ...(documents && documents),
              ...(certificates && certificates),
            }}
            validationSchema={companyDocsValidationSchema(agencyType)}
            handleGetImageFile={handleChangeCompnayDocs}
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
            correctionFields={correctionFields}
          />
        </Grid>

        <Button
          disabled={isLoading}
          style={regSubmitBtn(isLoading)}
          onClick={handleSubmitCompanyDocs}
        >
          {isLoading
            ? "agency documents is in progress, please Wait..."
            : pageNumber > 5
              ? "Update agency documents"
              : "save agency documents and continue to next step"}
        </Button>
      </Box>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      {showErrorDialog && (
        <ErrorDialog
          errors={errors}
          data={{}}
          handleClose={() => {
            setShowErrorDialog(false);
          }}
          type="For Agency Documents"
        />
      )}
    </Box>
  );
};

// export const companyDocsValidationSchema = (agent) => {
//   const {
//     isIataProvide,
//     isToabProvide,
//     isAtabProvide,
//     isAviationCertificateProvide,
//     agentType,
//   } = agent;

//   return Yup.object({
//     agencyLogo: fileTypeValid("Agency Logo"),
//     utilitiesBill: fileTypeValid("Utility Bill"),
//     signBoard: fileTypeValid("Sign Board"),
//     tradeLicense: fileTypeValid("Trade License"),
//     aviationCertificate: isAviationCertificateProvide
//       ? fileTypeValid("Aviation Certificate")
//       : null,
//     iataCertificate: Number(isIataProvide)
//       ? fileTypeValid("IATA Certificate")
//       : null,
//     toabCertificate: Number(isToabProvide)
//       ? fileTypeValid("TOAB Certificate")
//       : null,
//     atabCertificate: Number(isAtabProvide)
//       ? fileTypeValid("ATAB Certificate")
//       : null,
//     incorporationCertificate:
//       agentType === "limited"
//         ? fileTypeValid("Incorporation Certificate")
//         : null,
//   });
// };

export const companyDocsValidationSchema = (agencyType) => {
  return Yup.object({
    logoImage: fileTypeValid("Agency Logo").test(
      "fileType",
      "Unsupported File Format",
      (value) =>
        value === null ||
        value === undefined ||
        typeof value === "string" ||
        (value &&
          ["image/jpeg", "image/png", "image/webp"].includes(value.type))
    ),
    // utilityImage: fileTypeValid(
    //   `${agencyType === "limited" ? "Managing Director" : agencyType === "proprietorship" ? "Proprietor" : "1st Partner"} Business Card`
    // ),
    signBoardImage: fileTypeValid("Sign Board"),
    tradeImage: fileTypeValid("Trade License"),
    civilImage: fileTypeValid("Civil Aviation Certificate", false),
    iataImage: fileTypeValid("IATA Certificate", false),
    toabImage: fileTypeValid("TOAB Certificate", false),
    atabImage: fileTypeValid("ATAB Certificate", false),
    incorporationImage: fileTypeValid(
      "Incorporation Certificate",
      agencyType === "limited" ? true : false
    ),
  });
};

const reqDocFields = (agencyType) => {
  return [
    { label: "Agency Logo", name: "logoImage", type: "documents" },
    // {
    //   label: `${agencyType === "limited" ? "Managing Director" : agencyType === "proprietorship" ? "Proprietor" : "1st Partner"} Business Card`,
    //   name: "utilityImage",
    //   type: "documents",
    // },
    { label: "Sign Board", name: "signBoardImage", type: "documents" },
    { label: "Trade License", name: "tradeImage", type: "documents" },
    ...(agencyType === "limited"
      ? [
          {
            label: "Incorporation Certificate",
            name: "incorporationImage",
            type: "certificates",
          },
        ]
      : []),
    {
      label: "Civil Aviation Certificate (optional)",
      name: "civilImage",
      type: "certificates",
    },
    {
      label: "IATA Certificate (optional)",
      name: "iataImage",
      type: "certificates",
      isDeletable: true,
    },
    {
      label: "ATAB Certificate (optional)",
      name: "atabImage",
      type: "certificates",
      isDeletable: true,
    },
    {
      label: "TOAB Certificate (optional)",
      name: "toabImage",
      type: "certificates",
      isDeletable: true,
    },
  ];
};

export const modifyFileArray = (
  isIataProvide,
  isToabProvide,
  isAtabProvide,
  isAviationCertificateProvide,
  agentType
) => {
  const reqDocFields = [
    {
      label: "Agency Logo",
      name: "agencyLogo",
      condition: 1,
    },
    {
      label: "Utilities Bill",
      name: "utilitiesBill",
      condition: 1,
    },
    {
      label: "Sign Board",
      name: "signBoard",
      condition: 1,
    },
    {
      label: "Trade License",
      name: "tradeLicense",
      condition: 1,
    },
    {
      label: "Civil Aviation Certificate",
      name: "aviationCertificate",
      condition: Number(isAviationCertificateProvide),
    },
    {
      label: "IATA Certificate",
      name: "iataCertificate",
      condition: Number(isIataProvide),
    },
    {
      label: "TOAB Certificate",
      name: "toabCertificate",
      condition: Number(isToabProvide),
    },
    {
      label: "ATAB Certificate",
      name: "atabCertificate",
      condition: Number(isAtabProvide),
    },
    {
      label: "Incorporation Certificate",
      name: "incorporationCertificate",
      condition: agentType === "limited" ? 1 : 0,
    },
  ];

  return reqDocFields.filter((field) => field.condition === 1);
};
export default CompanyDocs;
