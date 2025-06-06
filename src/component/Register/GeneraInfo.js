import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { addYears } from "date-fns";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import {
  companyNameValidation,
  personNameValidation,
  phoneValidation,
  textFieldProps,
} from "../../shared/common/functions";
import {
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../shared/common/styles";
import CustomCheckBox from "../CustomCheckbox/CustomCheckbox";
import "./Register.css";

import moment from "moment";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import {
  setAgencyInformation,
  setAgent,
  setAgentLogin,
  setAgentReg,
  setUser,
} from "../../features/registrationSlice";
import useToast from "../../hook/useToast";
import CustomAlert from "../Alert/CustomAlert";
import CustomToast from "../Alert/CustomToast";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import Nationality from "./Nationality";
import { regSubmitBtn, RemoveDate } from "./RegisterPortal";
import ErrorDialog from "../Dialog/ErrorDialog";

const maxDOB = addYears(new Date(), -18);

const GeneraInfo = ({ isLoading, setIsLoading, setStep }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [openCal, setOpenCal] = useState(false);
  const [passShow, setPassShow] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [confirmPassShow, setConfirmPassShow] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const agentReg = useSelector((state) => state.registration.agentReg);

  const { password, confirmPassword, agreeTermsCondition, sharingInfo } =
    agentReg;

  const user = agentReg?.user ?? {};
  const agent = user.agent ?? {};

  const { firstName, lastName, email, phone } = agentReg?.user;
  const { gender, dateOfBirth, whatsappNumber, nationality } = agent;

  const { agencyInformation = {} } = agent;
  const agencyType = agencyInformation?.agencyType ?? user?.agencyType;
  const agencyName = agencyInformation?.agencyName ?? user?.agencyType;

  useEffect(() => {
    if (password === confirmPassword) {
      const { confirmPassword, ...rest } = errors;
      setErrors({ ...rest });
    } else {
      setErrors({ ...errors, confirmPassword: "Passwords must match" });
    }
  }, [password, confirmPassword]);

  const validateField = async (field, value) => {
    try {
      const values = {
        password: password,
        confirmPassword: confirmPassword,
        [field]: value,
      };

      await generalInfoValidationSchema.validateAt(field, values);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
    }
  };

  const handleChangeAgentReg = (e) => {
    const { name, value } = e.target;
    dispatch(setAgentReg({ field: name, value }));
    validateField(name, value);
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

  const handleChangeAgencyInfo = (e) => {
    const { name, value } = e.target;
    dispatch(setAgencyInformation({ field: name, value: value }));
    validateField(name, value);
  };

  const handleIsSameNumber = (e) => {
    if (e.target.checked) {
      dispatch(setAgent({ field: "whatsappNumber", value: phone }));
      validateField("whatsappNumber", phone);
    } else {
      dispatch(setAgent({ field: "whatsappNumber", value: "880" }));
    }
  };

  const handleChangeCheckBox = (name, value) => {
    dispatch(setAgentReg({ field: name, value: value }));
    validateField(name, value);
  };

  const handlePersonalInformation = async (e) => {
    e.preventDefault();

    const body = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      dateOfBirth,
      nationality: "Bangladesh",
      phoneNumber: phone,
      whatsappNumber,
      agencyType,
      agencyName,
      email,
      password,
    };

    const validateObj = {
      ...body,
      confirmPassword,
      agreeTermsCondition,
      sharingInfo,
      phone,
    };

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account?step=1`;

    try {
      await generalInfoValidationSchema.validate(validateObj, {
        abortEarly: false,
      });

      setErrors({});

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to proceed next Step",
      });

      if (result?.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(url, body);
        const responseData = response?.data;

        if (responseData?.success === true) {
          const agentData = responseData?.data;

          const nextStep = Number(agentData?.metadata?.step);

          dispatch(
            setAgentReg({
              ...agentReg,
              user: {
                ...user,
                ...agentData?.user,
                createdAt: agentData?.user?.createdAt,
              },
              pageNumber: nextStep,
              accessToken: agentData?.auth?.token,
            })
          );

          showToast("success", responseData?.message, () => {
            setStep(nextStep);
          });
        }
      }
    } catch (e) {
      if (e.name === "ValidationError") {
        const formattedErrors = {};
        e.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });

        // CustomAlert({
        //   success: "warning",
        //   message:
        //     Object.keys(formattedErrors)
        //       .map((a) => convertCamelToTitle(a))
        //       .join(", ") +
        //     " field have validation errors. Please ensure the required criteria.",
        //   alertFor: "registration",
        // });
        setShowErrorDialog(true);
        setErrors(formattedErrors);
      } else {
        const message = e?.response?.data?.message || "An error occurred";

        showToast(
          "error",
          message === "Email exists try different one."
            ? "Email already exists. Please try different one or login to continue."
            : message,
          () => {
            if (e?.response?.data?.error) {
              if (
                e?.response?.data?.error[0]?.metadata?.redirect === "login" ||
                message === "Email exists try different one."
              ) {
                dispatch(setAgentLogin({ isOpen: true }));
                dispatch(setAgentReg({ field: "isOpen", value: false }));
              }
            }
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handlePersonalInformation}>
        <Box
          sx={{
            minHeight: "82vh",
            display: "flex",
            flexDirection: "column",
            gap: "50px",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ pointerEvents: isLoading && "none" }}>
            {/* ---------- Agency General Information ---------- */}
            <Typography sx={{ ...regTitle, mt: 0 }}>
              Agency General Information
            </Typography>

            <Grid container spacing={3} mt={"0"}>
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <InputLabel id="agencyType-select-label">
                      Select Agency Type
                    </InputLabel>
                    <Select
                      labelId="agencyType-select-label"
                      value={agencyType || ""}
                      name="agencyType"
                      label="Select Agency Type"
                      onChange={handleChangeAgencyInfo}
                    >
                      <MenuItem value="proprietorship">Proprietorship</MenuItem>
                      <MenuItem value="limited">Limited</MenuItem>
                      <MenuItem value="partnership">Partnership</MenuItem>
                    </Select>
                  </FormControl>
                  <span style={registrationErrText}>{errors?.agencyType}</span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={agencyName}
                    {...textFieldProps("agencyName", "Agency Name")}
                    onChange={handleChangeAgencyInfo}
                    sx={sharedInputStyles}
                  />
                  <span style={registrationErrText}>{errors?.agencyName}</span>
                </Box>
              </Grid>
            </Grid>

            <Typography sx={regTitle}>
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

            <Typography
              sx={{ color: "var(--primary-color)", fontSize: "13px" }}
            >
              <span style={{ fontWeight: "500" }}>Note:</span> Please ensure
              that all fields are filled exactly as per NID card to avoid
              discrepancies.
            </Typography>

            <Grid container spacing={3} mt={"0"}>
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
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
                      Select Gender
                    </InputLabel>
                    <Select
                      labelId="gender-select-label"
                      value={gender}
                      {...textFieldProps("gender", "Select Gender")}
                      onChange={handleChangeAgent}
                      MenuProps={{ disableScrollLock: true }}
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
                      sx={sharedInputStyles}
                      onClick={() => setOpenCal(!openCal)}
                      focused={openCal || dateOfBirth}
                      autoComplete="off"
                    />
                    <span style={registrationErrText}>
                      {errors?.dateOfBirth}
                    </span>
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
                    "& .css-17uu2mx-control": { backgroundColor: "white" },
                  }}
                >
                  <Typography sx={{ ...phoneInputLabel, zIndex: "10" }}>
                    Nationality
                  </Typography>
                  <Nationality
                    nationality={nationality || "Bangladesh"}
                    handleChangeNationality={(value) => {
                      handleChangeAgent({
                        target: { name: "nationality", value: value?.name },
                      });
                    }}
                    optionFor={"registration"}
                    isDisabled={true}
                  />
                  <span style={registrationErrText}>{errors?.nationality}</span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <Typography sx={phoneInputLabel}>Phone Number </Typography>
                  <PhoneInput
                    inputStyle={{ width: "100%", height: "100%" }}
                    value={phone}
                    country={"bd"}
                    countryCodeEditable={false}
                    onChange={(phone) => {
                      handleChangeUser({
                        target: { name: "phone", value: phone },
                      });
                    }}
                    disableDropdown
                  />

                  <span style={registrationErrText}>{errors?.phone}</span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <Typography sx={phoneInputLabel}>Whatsapp Number</Typography>
                  <PhoneInput
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
              <Grid item xs={12} md={8}>
                <CustomCheckBox
                  value={phone && whatsappNumber && phone === whatsappNumber}
                  style={{ color: "var(--gray)", lineHeight: 1 }}
                  label="Personal and WhatsApp Number are Same"
                  fontSize={"13px"}
                  handleChange={handleIsSameNumber}
                />
              </Grid>
            </Grid>

            {/* <Grid container spacing={2} mt={0}></Grid> */}

            {/* ---------- Login Information ---------- */}
            <Typography sx={regTitle}>Login Information</Typography>

            <Grid container spacing={3} mt={"0px"}>
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={email}
                    {...textFieldProps("email", "Email Address", "email")}
                    onChange={handleChangeUser}
                    sx={sharedInputStyles}
                    inputProps={{ autoComplete: "new-email" }}
                  />
                  <span style={registrationErrText}>{errors?.email}</span>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={password || ""}
                    {...textFieldProps(
                      "password",
                      "Enter Password",
                      passShow ? "text" : "password"
                    )}
                    onChange={handleChangeAgentReg}
                    sx={sharedInputStyles}
                    inputProps={{ autoComplete: "new-password" }}
                  />

                  <button
                    type="button"
                    style={buttonStyleEye}
                    onClick={() => setPassShow((prev) => !prev)}
                  >
                    {passShow ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                  </button>
                  <span style={registrationErrText}>{errors?.password}</span>
                </Box>
              </Grid>
              <Grid item md={4} xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={confirmPassword || ""}
                    {...textFieldProps(
                      "confirmPassword",
                      "Confirm Password",
                      confirmPassShow ? "text" : "password"
                    )}
                    onChange={handleChangeAgentReg}
                    sx={sharedInputStyles}
                    inputProps={{ autoComplete: "new-confirm-password" }}
                  />

                  <button
                    type="button"
                    style={buttonStyleEye}
                    onClick={() => setConfirmPassShow((prev) => !prev)}
                  >
                    {confirmPassShow ? (
                      <VisibilityOffIcon />
                    ) : (
                      <RemoveRedEyeIcon />
                    )}
                  </button>

                  <span style={registrationErrText}>
                    {errors?.confirmPassword}
                  </span>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box>
            {/* <Box
              sx={{
                "& .MuiButtonBase-root": {
                  span: {
                    boxShadow:
                      errors?.sharingInfo && "0 0 0 1px red !important",
                  },
                },
                mb: isMobile && "10px",
              }}
            >
              <CustomCheckBox
                value={!!sharingInfo}
                style={{ color: "var(--gray)" }}
                label="I agree with sharing the above mentioned information with Fly Far International."
                handleChange={(e) =>
                  handleChangeCheckBox("sharingInfo", e.target.checked)
                }
              />
            </Box> */}
            <Box
              sx={{
                "& .MuiButtonBase-root": {
                  span: {
                    boxShadow:
                      errors?.agreeTermsCondition && "0 0 0 1px red !important",
                  },
                },
              }}
            >
              <CustomCheckBox
                value={agreeTermsCondition}
                style={{ color: "var(--gray)" }}
                label={
                  <>
                    By completing this registration agree with Fly Far
                    International{" "}
                    <Link
                      target="_blank"
                      to="/terms-and-conditions"
                      style={{ color: "var(--primary-color)" }}
                    >
                      Terms and Conditions
                    </Link>{" "}
                    &{" "}
                    <Link
                      target="_blank"
                      to="/privacy-policy"
                      style={{ color: "var(--primary-color)" }}
                    >
                      Privacy Policy
                    </Link>
                  </>
                }
                handleChange={(e) =>
                  handleChangeCheckBox("agreeTermsCondition", e.target.checked)
                }
              />
            </Box>
          </Box>

          <Box sx={{ mt: "20px" }}>
            <Button
              type="submit"
              style={regSubmitBtn(!agreeTermsCondition || isLoading)}
              // onClick={() => handlePersonalInformation()}
              // disabled={isLoading}
              disabled={!agreeTermsCondition || isLoading}
            >
              {isLoading
                ? "general information is in progress, please Wait..."
                : "save general information and continue to next step"}
            </Button>
          </Box>
        </Box>
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
          type="For General Information"
        />
      )}
    </>
  );
};

export const generalInfoValidationSchema = Yup.object({
  firstName: personNameValidation("First Name"),
  lastName: personNameValidation("Last Name"),
  gender: Yup.string().required("Gender is required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  nationality: Yup.string().required("Nationality is required"),
  phone: phoneValidation("Phone"),
  whatsappNumber: phoneValidation("Whatsapp"),
  agencyType: Yup.string().required("Agent Type is required"),
  agencyName: companyNameValidation("Agency"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email Address is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .matches(/^\S*$/, "Password cannot contain spaces")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  agreeTermsCondition: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions.")
    .required("This field is required"),
  // sharingInfo: Yup.boolean()
  //   .oneOf([true], "You must accept the sharing information")
  //   .required("This field is required"),
});

export const buttonStyleEye = {
  position: "absolute",
  right: "8px",
  top: "6px",
  background: "var(--primary-color)",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  width: "35px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const regTitle = { fontWeight: "500", color: "var(--dark-gray)", mt: 4 };

export default GeneraInfo;
