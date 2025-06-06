import {
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { addYears } from "date-fns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  setAgencyInformation,
  setAgent,
  setAgentReg,
  setOwnerDocuments,
  setSessionExpired,
  setUser,
} from "../../features/registrationSlice";
import useToast from "../../hook/useToast";
import {
  companyNameValidation,
  convertCamelToTitle,
  fileTypeValid,
  personNameValidation,
  phoneValidation,
  textFieldProps,
} from "../../shared/common/functions";
import {
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../shared/common/styles";
import CustomAlert from "../Alert/CustomAlert";
import CustomToast from "../Alert/CustomToast";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import { regTitle } from "./GeneraInfo";
import Nationality from "./Nationality";
import RegAlert from "./RegAlert";
import RegImageBox from "./RegImageBox";
import { regSubmitBtn, RemoveDate } from "./RegisterPortal";
import ErrorDialog from "../Dialog/ErrorDialog";

const maxDOB = addYears(new Date(), -18);
const OwnerDocs = ({ isLoading, setIsLoading, setStep }) => {
  const dispatch = useDispatch();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [openCal, setOpenCal] = useState(false);

  const agentReg = useSelector((state) => state.registration.agentReg);

  const { accessToken, user, correctionFields, pageNumber } = agentReg;
  const { agent, firstName, lastName, status } = user;
  const {
    gender,
    dateOfBirth,
    whatsappNumber,
    nationality,
    ownerDocuments,
    agencyInformation,
  } = agent;

  const { agencyType, agencyName } = agencyInformation || {};
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  useEffect(() => {
    if (correctionFields) {
      if (correctionFields.length > 0) {
        const unverifiedObj = {};
        correctionFields.forEach((field) => {
          unverifiedObj[field] =
            convertCamelToTitle(field) + " is not verified";
        });

        setErrors(unverifiedObj);
      }
    }
  }, []);

  const validateField = async (field, value) => {
    try {
      await validationSchema.validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
      return false;
    }
  };

  const handleChangeOwnerDocs = (reqDoc, file) => {
    dispatch(setOwnerDocuments({ ...ownerDocuments, [reqDoc?.name]: file }));
  };

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    dispatch(setUser({ field: name, value: value }));
    validateField(name, value);
  };

  const handleChangeAgent = (e) => {
    const { name, value } = e.target;
    dispatch(setAgent({ field: name, value: value }));
    validateField(name, value);
  };

  const handleSubmitOwnerInfo = async () => {
    const infoBody = {
      agencyName,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      nationality,
      whatsappNumber,
    };

    const fileBody = {
      profileImage: ownerDocuments?.profileImage,
      nidFrontImage: ownerDocuments?.nidFrontImage,
      nidBackImage: ownerDocuments?.nidBackImage,
      tinImage: ownerDocuments?.tinImage,
      // signatureImage: ownerDocuments?.signatureImage,
    };

    const validate = { ...infoBody, ...fileBody };

    const formData = new FormData();

    if (correctionFields.length > 0) {
      correctionFields
        .filter((item) => !item.includes("Image"))
        .forEach((key) => {
          formData.append(key, infoBody[key]);
        });

      correctionFields
        .filter((item) => item.includes("Image"))
        .forEach((key) => {
          if (typeof fileBody[key] === "object") {
            formData.append(key, fileBody[key]);
          }
        });
    } else {
      Object.keys(infoBody).forEach((key) => {
        formData.append(key, infoBody[key]);
      });

      Object.keys(fileBody).forEach((key) => {
        if (typeof fileBody[key] === "object") {
          formData.append(key, fileBody[key]);
        }
      });
    }

    try {
      await validationSchema.validate(validate, { abortEarly: false });
      setErrors({});

      const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account?step=3`;
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to next Proceed?",
      });
      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        const responseData = response?.data;

        if (responseData?.success) {
          const agentData = responseData?.data;
          const nextStep = Number(agentData?.metadata?.step);

          const message = `Owner Information ${pageNumber > 3 || correctionFields?.length > 0 ? "Updated" : "Completed"} Successfully`;

          showToast("success", message, () => {
            dispatch(
              setAgentReg({ ...agentReg, ...agentData, pageNumber: nextStep })
            );
            setStep(nextStep);
          });
        }
      }
    } catch (e) {
      if (e.name === "ValidationError") {
        handleSetErrorMessage(e);
      } else {
        const message = e?.response?.data?.message || "An error occurred";

        showToast("error", message, () => {
          if (e?.response?.data?.statusCode === 401) {
            dispatch(setSessionExpired());
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetErrorMessage = (err) => {
    const validationErrors = {};
    err.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    // RegAlert({
    //   success: "warning",
    //   title: "warning",
    //   message:
    //     Object.keys(validationErrors)
    //       .map((a) => convertCamelToTitle(a))
    //       .join(", ") +
    //     " field have validation errors. Please ensure the required criteria.",
    // });

    setShowErrorDialog(true);

    setErrors(validationErrors);
  };

  const unverifiedFields = (name) => {
    return correctionFields?.length > 0 && !correctionFields?.includes(name);
  };

  return (
    <Box>
      <Typography sx={{ ...regTitle, mt: "-4px" }}>
        {agencyType === "proprietorship" ? (
          "Proprietor"
        ) : agencyType === "limited" ? (
          "Managing Director"
        ) : agencyType === "partnership" ? (
          <>
            1<sup>st</sup> Partner{" "}
          </>
        ) : (
          "Owner"
        )}{" "}
        Information
      </Typography>

      <Typography sx={{ color: "var(--primary-color)", fontSize: "13px" }}>
        <span style={{ fontWeight: "500" }}>Note:</span> Please ensure that all
        fields are filled exactly as per NID card to avoid discrepancies.
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 200px)",
          justifyContent: "space-between",
          gap: "50px",
        }}
      >
        <Box>
          <Grid container spacing={3} mt={"0"}>
            {correctionFields && correctionFields.length > 0 && (
              <>
                {correctionFields?.includes("agencyName") && (
                  <Grid item md={4} xs={12}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        value={agencyName}
                        {...textFieldProps("agencyName", "Agency Name")}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          dispatch(
                            setAgencyInformation({ field: name, value: value })
                          );
                          validateField(name, value);
                        }}
                        sx={sharedInputStyles}
                      />
                      <span style={registrationErrText}>
                        {errors?.agencyName}
                      </span>
                    </Box>
                  </Grid>
                )}
              </>
            )}

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  disabled={unverifiedFields("firstName")}
                  value={firstName}
                  {...textFieldProps("firstName", "First Name")}
                  onChange={handleChangeUser}
                  sx={sharedInputStyles}
                />
                <span style={registrationErrText}>{errors?.firstName}</span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  disabled={unverifiedFields("lastName")}
                  value={lastName}
                  {...textFieldProps("lastName", "Last Name")}
                  onChange={handleChangeUser}
                  sx={sharedInputStyles}
                />
                <span style={registrationErrText}>{errors?.lastName}</span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel id="gender-select-label">
                    Select Gender *
                  </InputLabel>
                  <Select
                    labelId="gender-select-label"
                    value={gender}
                    {...textFieldProps("gender", "Select Gender")}
                    onChange={handleChangeAgent}
                    MenuProps={{ disableScrollLock: true }}
                    disabled={unverifiedFields("gender")}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
                <span style={registrationErrText}>{errors?.gender}</span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <ClickAwayListener
                onClickAway={() => openCal && setOpenCal(false)}
              >
                <Box
                  sx={{
                    position: "relative",
                    "& .MuiInputLabel-root": {
                      "&.Mui-focused": {
                        color: openCal
                          ? "var(--primary-color)"
                          : dateOfBirth && "#00000099",
                      },
                    },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: openCal
                          ? "#8BB6CC"
                          : dateOfBirth && "var(--border-color)",
                      },
                    },
                    pointerEvents: unverifiedFields("dateOfBirth") && "none",
                    input: { cursor: "pointer" },
                    "& .MuiFormLabel-root": { cursor: "pointer" },
                  }}
                >
                  <TextField
                    value={
                      dateOfBirth &&
                      moment(dateOfBirth, "YYYY-MM-DD").format("DD-MM-YYYY")
                    }
                    {...textFieldProps("dateOfBirth", "Date of Birth")}
                    sx={{ ...sharedInputStyles, cursor: "pointer" }}
                    onClick={() =>
                      !unverifiedFields("dateOfBirth") && setOpenCal(!openCal)
                    }
                    focused={openCal || dateOfBirth}
                    autoComplete="off"
                    disabled={unverifiedFields("dateOfBirth")}
                  />
                  <span style={registrationErrText}>{errors?.dateOfBirth}</span>
                  {openCal && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "105%",
                        borderRadius: "4px",
                        width: "100%",
                        zIndex: "1000",
                        display: "flex",
                        bgcolor: "white",
                      }}
                    >
                      <CustomCalendar
                        date={dateOfBirth ? dateOfBirth : new Date(maxDOB)}
                        maxDate={maxDOB}
                        title={"Date of Birth"}
                        handleChange={(date) => {
                          handleChangeAgent({
                            target: {
                              name: "dateOfBirth",
                              value: moment(date).format("YYYY-MM-DD"),
                            },
                          });

                          setOpenCal(false);
                        }}
                      />
                    </Box>
                  )}

                  {dateOfBirth && (
                    <RemoveDate
                      handleClick={() => {
                        handleChangeAgent({
                          target: { name: "dateOfBirth", value: "" },
                        });
                      }}
                    />
                  )}
                </Box>
              </ClickAwayListener>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box
                sx={{
                  position: "relative",
                  pointerEvents: unverifiedFields(
                    correctionFields,
                    "nationality"
                  ),
                  "& .css-17uu2mx-control": { backgroundColor: "white" },
                }}
              >
                <Typography sx={{ ...phoneInputLabel, zIndex: "10" }}>
                  Nationality
                </Typography>
                <Nationality
                  nationality={nationality}
                  handleChangeNationality={(value) => {
                    handleChangeAgent({
                      target: { name: "nationality", value: value?.name },
                    });
                  }}
                  isDisabled={true}
                  optionFor={"registration"}
                />
                <span style={registrationErrText}>{errors?.nationality}</span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Typography sx={phoneInputLabel}>Whatsapp Number *</Typography>
                <PhoneInput
                  disabled={unverifiedFields("whatsappNumber")}
                  inputStyle={{ width: "100%", height: "100%" }}
                  value={whatsappNumber}
                  country={"bd"}
                  countryCodeEditable={false}
                  onChange={(phone) => {
                    handleChangeAgent({
                      target: { name: "whatsappNumber", value: phone },
                    });
                  }}
                  label="WhatsApp Number"
                  disableDropdown
                />

                <span style={registrationErrText}>
                  {errors?.whatsappNumber}
                </span>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={0}>
            <RegImageBox
              errors={errors}
              setErrors={setErrors}
              reqDocFields={reqDocFields(
                agencyType === "proprietorship"
                  ? "Proprietor"
                  : agencyType === "limited"
                    ? "Managing Director"
                    : agencyType === "partnership"
                      ? "1<sup>st</sup> Partner"
                      : "Owner"
              )}
              data={ownerDocuments ? ownerDocuments : {}}
              validationSchema={validationSchema}
              handleGetImageFile={handleChangeOwnerDocs}
              uploadProgress={uploadProgress}
              setUploadProgress={setUploadProgress}
              correctionFields={correctionFields}
            />
          </Grid>
        </Box>

        <Button
          disabled={isLoading}
          style={regSubmitBtn(isLoading)}
          onClick={handleSubmitOwnerInfo}
        >
          {isLoading
            ? "owner information is in progress, please Wait..."
            : pageNumber > 3
              ? "Update owner Information"
              : "save owner information and continue to next step"}
        </Button>
      </Box>
      {openToast && (
        <CustomToast
          open={openToast}
          onClose={handleCloseToast}
          message={message}
          severity={severity}
        />
      )}

      {showErrorDialog && (
        <ErrorDialog
          errors={errors}
          data={{}}
          handleClose={() => {
            setShowErrorDialog(false);
          }}
          type="For Owner Information"
        />
      )}
    </Box>
  );
};

export const validationSchema = Yup.object({
  agencyName: companyNameValidation("Agency"),
  firstName: personNameValidation("First Name"),
  lastName: personNameValidation("Last Name"),
  gender: Yup.string().required("Gender is required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  nationality: Yup.string().required("Nationality is required"),
  whatsappNumber: phoneValidation("Whatsapp"),
  nidFrontImage: fileTypeValid("NID Front"),
  nidBackImage: fileTypeValid("NID Back"),
  profileImage: fileTypeValid("Pasport Size Photo"),
  tinImage: fileTypeValid("TIN Certificate"),
  // signatureImage: fileTypeValid("Signature"),
});

// export const validationSchema = Yup.object({
//   nidFrontImage: fileTypeValid("NID Front"),
//   nidBackImage: fileTypeValid("NID Back"),
//   profileImage: fileTypeValid("Pasport Size Photo"),
//   tinImage: fileTypeValid("TIN Certificate"),
//   signatureImage: fileTypeValid("Signature"),
// });

const reqDocFields = (dynamicLable) => {
  return [
    {
      label: `${dynamicLable} Passport Size Photo`,
      name: "profileImage",
    },
    {
      label: `${dynamicLable} NID Front`,
      name: "nidFrontImage",
    },
    {
      label: `${dynamicLable} NID Back`,
      name: "nidBackImage",
    },
    {
      label: `${dynamicLable} TIN`,
      name: "tinImage",
    },
    // {
    //   label: `${dynamicLable} Signature`,
    //   name: "signatureImage",
    // },
  ];
};

const flexCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const registrationImage = {
  labelContainer: {
    ...flexCenter,
    flexDirection: "column",
    height: "100%",
    cursor: "pointer",
    gap: "10px",
    padding: "12px 0px",
  },

  labelText: {
    color: "var(--text-medium)",
    fontSize: "13px",
    textAlign: "center",
  },

  imageBox: {
    height: "120px",
    width: "100%",
    padding: 1,
    border: "2px dashed var(--border-color)",
    borderRadius: "5px",
    ...flexCenter,
  },

  pdfBox: { height: "100%", ...flexCenter },
};

export default OwnerDocs;
