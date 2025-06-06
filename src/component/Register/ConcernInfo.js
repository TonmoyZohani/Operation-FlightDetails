import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { addYears } from "date-fns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  setAgentReg,
  setConcernPerson,
  setSessionExpired,
} from "../../features/registrationSlice";
import useToast from "../../hook/useToast";
import {
  convertCamelToTitle,
  emailValidation,
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
import CustomCheckBox from "../CustomCheckbox/CustomCheckbox";
import { regTitle } from "./GeneraInfo";
import RegImageBox from "./RegImageBox";
import "./Register.css";
import { regSubmitBtn, RemoveDate } from "./RegisterPortal";
import ErrorDialog from "../Dialog/ErrorDialog";

const maxDOB = addYears(new Date(), -18);

const ConcernInfo = ({ isLoading, setIsLoading, setStep }) => {
  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const agentReg = useSelector((state) => state.registration.agentReg);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [openCal, setOpenCal] = useState(false);

  const { accessToken, user, correctionFields, pageNumber } = agentReg;
  const { concernPerson } = user?.agent;
  const {
    name,
    gender,
    dateOfBirth,
    nationality,
    relation,
    othersRelation,
    address,
    email,
    phoneNumber,
    whatsappNumber,
    nidFrontImage,
    // nidBackImage,
  } = concernPerson || {};

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

      if (
        relation &&
        !["family", "colleague", "employee", "friend", "others"].includes(
          relation
        )
      ) {
        const updatedRel = { othersRelation: relation, relation: "others" };
        dispatch(setConcernPerson({ ...concernPerson, ...updatedRel }));
      }
    }

    if (
      !["family", "colleague", "employee", "friend", "others"].includes(
        relation
      ) &&
      pageNumber > 6
    ) {
      const updatedRel = { othersRelation: relation, relation: "others" };
      dispatch(setConcernPerson({ ...concernPerson, ...updatedRel }));
    }
  }, []);

  const validateField = async (field, value) => {
    try {
      await validationSchema(relation).validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
      return false;
    }
  };

  const handleSubmitConcernInfo = async (e) => {
    e.preventDefault();

    const validate = {
      name,
      gender,
      dateOfBirth,
      nationality: "Bangladesh",
      // relation,
      relation: othersRelation ? othersRelation : relation,
      // relation: relation === "others" ? othersRelation : relation,
      address,
      email,
      phoneNumber,
      whatsappNumber,
      nidFrontImage,
      // nidBackImage,
    };

    const unverifiedBody = {};

    const hasUnverified = correctionFields.length > 0;

    if (hasUnverified) {
      correctionFields.forEach((key) => {
        unverifiedBody[key] = validate[key];
      });
    }

    const formData = new FormData();
    Object.keys(hasUnverified ? unverifiedBody : validate).forEach((key) => {
      formData.append(key, hasUnverified ? unverifiedBody[key] : validate[key]);
    });

    // if (relation === "others") {
    //   formData.append(
    //     "relation",
    //     othersRelation
    //     // hasUnverified ? unverifiedBody[key] : othersRelation
    //   );
    // }

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account?step=6`;

    const newValidate = {
      ...validate,
      ...(relation === "others" ? { ...validate, othersRelation } : {}),
    };

    try {
      await validationSchema(relation).validate(newValidate, {
        abortEarly: false,
      });
      setErrors({});

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to proceed next Step",
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

        if (responseData?.success === true) {
          const agentData = responseData?.data;

          // const nextStep = 7;
          const nextStep = Number(agentData?.metadata?.step);

          const message = `Concern Information ${pageNumber > 6 || correctionFields?.length > 0 ? "Updated" : "Completed"} Successfully`;

          showToast("success", message, () => {
            setStep(nextStep);
            dispatch(
              setAgentReg({ ...agentReg, ...agentData, pageNumber: nextStep })
            );
          });
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

  const handleChangeConcernPerson = (e) => {
    const { name, value } = e.target;

    if (name === "relation") {
      const updatedRel = { othersRelation: "", [name]: value };
      dispatch(setConcernPerson({ ...concernPerson, ...updatedRel }));
    } else {
      dispatch(setConcernPerson({ ...concernPerson, [name]: value }));
    }

    validateField(name, value);
  };

  const unverifiedFields = (name) => {
    return correctionFields?.length > 0 && !correctionFields?.includes(name);
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Typography sx={{ ...regTitle, mt: 3 }}>
        Emergency Concern Person Information
      </Typography>
      <Typography sx={{ color: "var(--primary-color)", fontSize: "13px" }}>
        <span style={{ fontWeight: "500" }}>Note:</span> Please ensure that all
        fields are filled exactly as per NID Card to avoid discrepancies.
      </Typography>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 200px)",
          justifyContent: "space-between",
          gap: "50px",
        }}
        onSubmit={handleSubmitConcernInfo}
      >
        <Box>
          <Grid container spacing={3} mt={0}>
            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={name || ""}
                  {...textFieldProps("name", `Name`)}
                  onChange={handleChangeConcernPerson}
                  sx={sharedInputStyles}
                  disabled={unverifiedFields("name")}
                />
                <span style={registrationErrText}>{errors?.name}</span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel id="gender-select-label">
                    Select Gender
                  </InputLabel>
                  <Select
                    labelId="gender-select-label"
                    value={gender || ""}
                    name="gender"
                    label="Select Gender"
                    onChange={handleChangeConcernPerson}
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
                        color: dateOfBirth && "#00000099",
                      },
                    },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: dateOfBirth && "#0000003B",
                        borderWidth: dateOfBirth && "1px",
                      },
                    },
                    pointerEvents: unverifiedFields("dateOfBirth") && "none",
                  }}
                >
                  <TextField
                    disabled={unverifiedFields("dateOfBirth")}
                    value={
                      dateOfBirth &&
                      moment(dateOfBirth, "YYYY-MM-DD").format("DD-MM-YYYY")
                    }
                    {...textFieldProps("dateOfBirth", "Date of Birth")}
                    sx={sharedInputStyles}
                    onClick={() =>
                      !unverifiedFields("dateOfBirth") && setOpenCal(!openCal)
                    }
                    focused={openCal || dateOfBirth}
                    autoComplete="off"
                  />
                  <span style={registrationErrText}>{errors?.dateOfBirth}</span>
                  {openCal && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%",
                        borderRadius: "4px",
                        width: "100%",
                        zIndex: "1000",
                        display: "flex",
                        bgcolor: "white",
                      }}
                    >
                      <CustomCalendar
                        date={
                          dateOfBirth ? new Date(dateOfBirth) : new Date(maxDOB)
                        }
                        maxDate={maxDOB}
                        title={"Date of Birth"}
                        handleChange={(date) => {
                          handleChangeConcernPerson({
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
                        handleChangeConcernPerson({
                          target: { name: "dateOfBirth", value: "" },
                        });
                      }}
                    />
                  )}
                </Box>
              </ClickAwayListener>
            </Grid>

            {/* <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative", pointerEvents: "none" }}>
                <Typography sx={{ ...phoneInputLabel, zIndex: "10" }}>
                  Nationality
                </Typography>
                <Nationality
                  nationality={nationality || "Bangladesh"}
                  // handleChangeNationality={(country) => {
                  //   handleChangeConcernPerson({
                  //     target: { name: "nationality", value: country },
                  //   });
                  // }}
                />
                <span style={registrationErrText}>{errors?.nationality}</span>
              </Box>
            </Grid> */}

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  disabled
                  value={nationality || "Bangladesh"}
                  {...textFieldProps("nationality", `Nationality`)}
                  onChange={handleChangeConcernPerson}
                  sx={sharedInputStyles}
                />
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <FormControl fullWidth size="small" sx={sharedInputStyles}>
                  <InputLabel id="relation-select-label">
                    Select Relation
                  </InputLabel>
                  <Select
                    disabled={unverifiedFields("relation")}
                    labelId="relation-select-label"
                    value={relation || ""}
                    name="relation"
                    label="Select Relation"
                    onChange={handleChangeConcernPerson}
                  >
                    <MenuItem value="family">Family Member</MenuItem>
                    <MenuItem value="colleague">Colleague</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="friend">Friend</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
                <span style={registrationErrText}>{errors?.relation}</span>
              </Box>

              {/* <Box sx={{ position: "relative" }}>
                <TextField
                  value={relation || ""}
                  {...textFieldProps("relation", `Relation`)}
                  onChange={handleChangeConcernPerson}
                  sx={sharedInputStyles}
                  disabled={unverifiedFields("relation")}
                />
                <span style={registrationErrText}>{errors?.relation}</span>
              </Box> */}
            </Grid>

            {relation === "others" && (
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={othersRelation || ""}
                    {...textFieldProps("othersRelation", `Relation Details`)}
                    onChange={handleChangeConcernPerson}
                    sx={sharedInputStyles}
                    disabled={unverifiedFields("othersRelation")}
                  />
                  <span style={registrationErrText}>
                    {errors?.othersRelation}
                  </span>
                </Box>
              </Grid>
            )}

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={address || ""}
                  {...textFieldProps("address", `Address`)}
                  onChange={handleChangeConcernPerson}
                  sx={sharedInputStyles}
                  disabled={unverifiedFields("address")}
                />
                <span style={registrationErrText}>{errors?.address}</span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={email || ""}
                  {...textFieldProps("email", `Email`, "email")}
                  onChange={handleChangeConcernPerson}
                  sx={sharedInputStyles}
                  disabled={unverifiedFields("email")}
                />

                <span style={registrationErrText}>{errors?.email}</span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Typography sx={phoneInputLabel}>Phone Number</Typography>
                <PhoneInput
                  disabled={unverifiedFields("phoneNumber")}
                  inputStyle={{ width: "100%", height: "100%" }}
                  value={phoneNumber}
                  country={"bd"}
                  countryCodeEditable={false}
                  onChange={(phone) =>
                    handleChangeConcernPerson({
                      target: { name: "phoneNumber", value: phone },
                    })
                  }
                  disableDropdown
                />

                <span style={registrationErrText}>{errors?.phoneNumber}</span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <Typography sx={phoneInputLabel}>Whatsapp Number</Typography>
                <PhoneInput
                  disabled={unverifiedFields("whatsappNumber")}
                  inputStyle={{ width: "100%", height: "100%" }}
                  value={whatsappNumber}
                  country={"bd"}
                  countryCodeEditable={false}
                  onChange={(phone) =>
                    handleChangeConcernPerson({
                      target: { name: "whatsappNumber", value: phone },
                    })
                  }
                  disableDropdown
                />

                <span style={registrationErrText}>
                  {errors?.whatsappNumber}
                </span>
              </Box>
            </Grid>

            <Grid item md={8} xs={12}>
              <CustomCheckBox
                value={
                  phoneNumber &&
                  whatsappNumber &&
                  phoneNumber === whatsappNumber
                }
                style={{ color: "var(--gray)" }}
                label="Concern Person Phone and WhatsApp Number is Same"
                fontSize={"13px"}
                handleChange={(e) => {
                  handleChangeConcernPerson({
                    target: {
                      name: "whatsappNumber",
                      value: e.target.checked ? phoneNumber : "880",
                    },
                  });
                }}
              />
            </Grid>
          </Grid>

          {/* <Grid container spacing={2} mt={0}></Grid> */}

          <Grid container spacing={3} mt={"0"}>
            <RegImageBox
              errors={errors}
              setErrors={setErrors}
              reqDocFields={reqDocFields}
              data={{
                nidFrontImage: nidFrontImage && nidFrontImage,
                // nidBackImage: nidBackImage && nidBackImage,
              }}
              validationSchema={validationSchema(relation)}
              handleGetImageFile={(reqDoc, value) => {
                handleChangeConcernPerson({
                  target: { name: reqDoc?.name, value },
                });
              }}
              uploadProgress={uploadProgress}
              setUploadProgress={setUploadProgress}
              correctionFields={correctionFields}
            />
          </Grid>
        </Box>

        <Button
          type="submit"
          disabled={isLoading}
          style={regSubmitBtn(isLoading)}
        >
          {isLoading
            ? "concern person information is in progress, please Wait..."
            : pageNumber > 6
              ? "Update concern person information"
              : "save concern person information and continue to next step"}
        </Button>
      </form>

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
          type="For Concern Information"
        />
      )}
    </Box>
  );
};

const required = (type) => Yup.string().required(`${type} is required`);

export const concernInfoValidationSchema = Yup.object({
  personName: personNameValidation("Name"),
  personGender: required("Gender"),
  personDob: required("Date of birth"),
  personNationality: required("Nationality"),
  personRelation: Yup.string()
    .matches(/^[a-zA-Z]+$/, "Only letters are allowed")
    .min(3, "Minimum length is 3 characters")
    .required("Relation is required"),
  phoneNumber: phoneValidation("Phone"),
  personEmail: emailValidation("Person"),
  personWhatsappNumber: phoneValidation("Whatsapp"),
  personAddress: required("Address"),
  // personUtilityBill: fileTypeValid("Utilities Bill"),
  // personTin: fileTypeValid("TIN Certificate"),
  personNidFront: fileTypeValid("NID Front"),
  personNidBack: fileTypeValid("NID Back"),
});

const validationSchema = (relation) =>
  Yup.object({
    name: personNameValidation("Name"),
    gender: required("Gender"),
    address: required("Address"),
    dateOfBirth: required("Date of birth"),
    // nationality: required("Nationality"),
    relation: required("Relation"),
    othersRelation:
      relation === "others"
        ? Yup.string()
            .matches(/^[a-zA-Z]+$/, "Only letters are allowed")
            .min(3, "Minimum length is 3 characters")
            .required("Relation details is required")
        : null,
    phoneNumber: phoneValidation("Phone"),
    email: emailValidation(""),
    whatsappNumber: phoneValidation("Whatsapp"),
    nidFrontImage: fileTypeValid("NID / VISITING / JOB ID CARD "),
    // nidBackImage: fileTypeValid("NID Back"),
  });

const reqDocFields = [
  { label: "NID / VISITING / JOB ID CARD", name: "nidFrontImage" },
  // { label: "NID Back", name: "nidBackImage" },
];

export default ConcernInfo;
