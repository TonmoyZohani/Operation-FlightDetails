import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  EditAndReset,
  flexCenter,
  nationalityStyle,
  updateRegStyle,
} from "../PreviewAndUpdate";
import { generalInfoValidationSchema, regTitle } from "../../GeneraInfo";
import moment from "moment";
import { addYears } from "date-fns";
import Nationality from "../../Nationality";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import {
  convertCamelToTitle,
  phoneInputProps,
} from "../../../../shared/common/functions";
import { useDispatch } from "react-redux";
import { setAgentData } from "../../../../features/agentRegistrationSlice";
import useToast from "../../../../hook/useToast";
import CustomToast from "../../../Alert/CustomToast";
import CustomCalendar from "../../../CustomCalendar/CustomCalendar";
import CustomAlert from "../../../Alert/CustomAlert";

const maxDOB = addYears(new Date(), -18);

const PreviewGeneralInfo = ({ allRegData, setStep }) => {
  const [regData, setRegData] = useState({ ...allRegData });
  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  // const agent = useSelector((state) => state.agentRegistration.agent);
  const { containerStyle, labelStyle, inputStyle, registrationErrText } =
    updateRegStyle;

  const [errors, setErrors] = useState({});
  const [openCal, setOpenCal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (regData.unverifiedAgent?.generalInformation) {
      const transformedObject = {};

      for (const key in regData?.unverifiedAgent?.generalInformation) {
        if (regData.unverifiedAgent?.generalInformation[key] === false) {
          transformedObject[key] = convertCamelToTitle(key) + " is unverified";
        } else {
          transformedObject[key] =
            regData?.unverifiedAgent?.generalInformation[key];
        }
      }

      setErrors(transformedObject);
      setOpenCal(false);
    }
  }, [isEdit]);

  const validateField = async (field, value) => {
    try {
      await generalInfoValidationSchema.validateAt(field, {
        [field]: value,
      });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
      return false;
    }
  };

  const handleChangeAgentData = (e) => {
    const { name, value } = e.target;

    setRegData({ ...regData, [name]: value });
    validateField(name, value);
  };

  const handleChangeNationality = (value) => {
    setRegData({ ...regData, nationality: value });
    validateField("nationality", value);
  };

  const handleUpdateGeneralInfo = async () => {
    const body = {
      firstName: regData?.firstName,
      lastName: regData?.lastName,
      gender: regData?.gender,
      dateOfBirth: regData?.dateOfBirth,
      nationality: regData?.nationality,
      phone: regData?.phone,
      whatsappNumber: regData?.whatsappNumber,
      agencyName: regData?.agencyName,
    };

    setIsLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/create-agent-account`;

    try {
      await validationSchema.validate(body, { abortEarly: false });
      setErrors({});

      const response = await axios.patch(url, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${regData?.accessToken}`,
        },
      });
      const responseData = response?.data;

      if (responseData?.success === true) {
        const agentData = responseData?.data[0];
        showToast("success", responseData?.message, () => {
          setRegData(agentData);
          dispatch(
            setAgentData({
              ...regData,
              ...agentData,
              isOpen: true,
              pageNumber: agentData?.pageNumber + 1,
            })
          );
          setStep(8);
        });
      }
    } catch (e) {
      if (e.name === "ValidationError") {
        const formattedErrors = {};
        e.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });
        CustomAlert({
          success: "warning",
          message:
            Object.keys(formattedErrors)
              .map((a) => convertCamelToTitle(a))
              .join(", ") +
            " field have validation errors. Please ensure the required criteria.",
          alertFor: "registration",
        });
        setErrors(formattedErrors);
      } else {
        const message = e?.response?.data?.message || "An error occurred";
        showToast("error", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputProps = (name, value, placeholder, type = "text") => {
    const extraProp = { style: inputStyle, onChange: handleChangeAgentData };
    return { name, id: name, value, type, placeholder, ...extraProp };
  };

  const updateContainerStyle = (name) => {
    return {
      ...containerStyle,
      borderColor: errors?.[name]
        ? "var(--primary-color)"
        : "var(--border-color)",
      cursor: isEdit && "pointer",
    };
  };

  return (
    <Box>
      <Typography noWrap sx={{ ...regTitle, mt: 0 }}>
        Agency General Information
      </Typography>

      {/* Agency General Information */}
      <Grid container columnSpacing={3} mt={"0"}>
        <Grid item md={4} xs={12}>
          <label htmlFor="agentType" style={containerStyle}>
            <Typography sx={labelStyle}>Agency Type</Typography>
            <select disabled {...inputProps("agentType", regData?.agentType)}>
              <option value="proprietorship">Proprietorship</option>
              <option value="limited">Limited</option>
              <option value="partnership">Partnership</option>
            </select>
          </label>
        </Grid>

        <Grid item md={4} xs={12}>
          <label htmlFor="agencyName" style={containerStyle}>
            <Typography sx={labelStyle}>Agency Name</Typography>
            <input
              disabled
              {...inputProps("agencyName", regData?.agencyName, "Enter Name")}
            />
          </label>
        </Grid>

        {/* Email */}
        <Grid item md={4} xs={12}>
          <Box sx={containerStyle}>
            <Typography sx={labelStyle}>Email</Typography>
            <input {...inputProps("email", regData?.email)} disabled />
            <span style={registrationErrText}>{errors?.email}</span>
          </Box>
        </Grid>

        {/* Phone Number */}
        <Grid item md={4} xs={12}>
          <Box sx={containerStyle}>
            <Typography sx={labelStyle}>Phone Number</Typography>
            <Box sx={{ width: "60%" }}>
              <PhoneInput
                {...phoneInputProps("phone", regData?.phone)}
                disabled
              />
            </Box>
            <span style={registrationErrText}>{errors?.phone}</span>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ ...flexCenter, justifyContent: "space-between", mt: 4 }}>
        <Box sx={{ ...flexCenter, gap: "10px" }}>
          <Typography sx={{ ...regTitle, mt: 0 }}>
            Agency{" "}
            {regData?.agentType === "proprietorship"
              ? "Proprietor"
              : regData?.agentType === "limited"
                ? "Managing Director"
                : regData?.agentType === "partnership"
                  ? "1st Managing Partner"
                  : "Concern Person"}{" "}
            Information
          </Typography>

          <EditAndReset
            setRegData={setRegData}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
          />
        </Box>

        <Box sx={{ height: "35px" }}>
          {isEdit && (
            <Button
              style={{
                backgroundColor: "var(--secondary-color)",
                color: isLoading ? "gray" : "white",
                width: "110px",
                textTransform: "capitalize",
                fontSize: "12px",
              }}
              onClick={() => handleUpdateGeneralInfo()}
              disabled={isLoading}
            >
              {isLoading ? "Please Wait..." : "Save & Update"}
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3} mt={"-15px"}>
        {/* First Name */}
        <Grid item md={4} xs={12}>
          <label htmlFor="firstName" style={updateContainerStyle("firstName")}>
            <Typography sx={labelStyle}>First Name</Typography>
            <input
              disabled={!isEdit}
              {...inputProps(
                "firstName",
                regData?.firstName,
                "Enter First Name"
              )}
            />
            <span style={registrationErrText}>{errors?.firstName}</span>
          </label>
        </Grid>

        {/* Last Name */}
        <Grid item md={4} xs={12}>
          <label htmlFor="lastName" style={updateContainerStyle("lastName")}>
            <Typography sx={labelStyle}>Last Name</Typography>
            <input
              disabled={!isEdit}
              {...inputProps("lastName", regData?.lastName, "Enter Last Name")}
            />
            <span style={registrationErrText}>{errors?.lastName}</span>
          </label>
        </Grid>

        {/* Select Gender */}
        <Grid item md={4} xs={12}>
          <label htmlFor="gender" style={updateContainerStyle("gender")}>
            <Typography sx={labelStyle}>Select Gender</Typography>
            <select
              disabled={!isEdit}
              {...inputProps("gender", regData?.gender)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <span style={registrationErrText}>{errors?.gender}</span>
          </label>
        </Grid>

        {/* Date of Birth */}
        <Grid item md={4} xs={12}>
          <ClickAwayListener onClickAway={() => openCal && setOpenCal(false)}>
            <Box sx={{ position: "relative" }}>
              <Box
                onClick={() => isEdit && setOpenCal(!openCal)}
                sx={{
                  ...updateContainerStyle("dateOfBirth"),
                  cursor: isEdit && "pointer",
                }}
              >
                <Typography sx={labelStyle}>Date of Birth</Typography>
                <Typography
                  sx={{
                    ...inputStyle,
                    color: isEdit ? "var(--black)" : "var(--dark-gray)",
                  }}
                >
                  {moment(regData?.dateOfBirth).format("DD MMMM YYYY")}
                </Typography>

                <span style={registrationErrText}>{errors?.dateOfBirth}</span>
              </Box>
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
                  {/* <Calendar
                    style={{ backgroundColor: "white" }}
                    date={
                      regData?.dateOfBirth
                        ? regData?.dateOfBirth
                        : new Date(maxDOB)
                    }
                    onChange={(date) => {
                      setRegData({
                        ...regData,
                        dateOfBirth: moment(date).format("YYYY-MM-DD"),
                      });

                      validateField("dateOfBirth", date);

                      setOpenCal(false);
                    }}
                    months={1}
                    maxDate={maxDOB}
                  /> */}

                  <CustomCalendar
                    date={
                      regData?.dateOfBirth
                        ? regData?.dateOfBirth
                        : new Date(maxDOB)
                    }
                    maxDate={maxDOB}
                    title={"Date Of Birth"}
                    handleChange={(date) => {
                      setRegData({
                        ...regData,
                        dateOfBirth: moment(date).format("YYYY-MM-DD"),
                      });

                      validateField("dateOfBirth", date);

                      setOpenCal(false);
                    }}
                  />
                </Box>
              )}
            </Box>
          </ClickAwayListener>
        </Grid>

        {/* Nationality */}
        <Grid item md={4} xs={12}>
          <Box
            sx={{
              ...updateContainerStyle("nationality"),
              pointerEvents: isEdit ? "auto" : "none",
            }}
          >
            <Typography sx={labelStyle}>Nationality</Typography>
            <Box sx={{ width: "55%", ...nationalityStyle(isEdit) }}>
              <Nationality
                nationality={regData?.nationality}
                handleChangeNationality={handleChangeNationality}
              />
            </Box>
            <span style={registrationErrText}>{errors?.nationality}</span>
          </Box>
        </Grid>

        {/* Whatsapp Number */}
        <Grid item md={4} xs={12}>
          <label
            htmlFor="whatsappNumber"
            style={updateContainerStyle("whatsappNumber")}
          >
            <Typography sx={{ ...labelStyle, width: "50%" }}>
              Whatsapp Number
            </Typography>
            <Box sx={{ width: "60%" }}>
              <PhoneInput
                {...phoneInputProps("whatsappNumber", regData?.whatsappNumber)}
                onChange={(phone) => {
                  setRegData({ ...regData, whatsappNumber: phone });
                  validateField("whatsappNumber", phone);
                }}
                disabled={!isEdit}
              />
            </Box>
            <span style={registrationErrText}>{errors?.whatsappNumber}</span>
          </label>
        </Grid>
      </Grid>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

const validationSchema = generalInfoValidationSchema.pick([
  "firstName",
  "lastName",
  "gender",
  "dateOfBirth",
  "nationality",
  "phone",
  "whatsappNumber",
  // "agentType",
  "agencyName",
  // "email",
]);

export default PreviewGeneralInfo;
