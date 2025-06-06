import {
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import {
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../shared/common/styles";
import PhoneInput from "react-phone-input-2";
import CustomCheckBox from "../CustomCheckbox/CustomCheckbox";
import {
  convertCamelToTitle,
  emailValidation,
  getOrdinal,
  personNameValidation,
  phoneValidation,
  textFieldProps,
} from "../../shared/common/functions";
import { setAgentData } from "../../features/agentRegistrationSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import axios from "axios";
import moment from "moment";
import { addYears } from "date-fns";
import PartnerTabBar from "./PartnerTabBar";
import Nationality from "./Nationality";
import useToast from "../../hook/useToast";
import CustomToast from "../Alert/CustomToast";
import { isMobile } from "../../shared/StaticData/Responsive";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import CustomAlert from "../Alert/CustomAlert";

const maxDOB = addYears(new Date(), -18);

const OwnerInfo = ({ step, setStep }) => {
  const dispatch = useDispatch();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const agent = useSelector((state) => state.agentRegistration.agent);
  const { accessToken, ownership, agentType, pageNumber } = agent;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPartner, setCurrentPartner] = useState(
    agentType === "partnership" ? 1 : 0
  );

  const handleChangeAgentData = (e, index) => {
    const { name, value } = e.target;

    dispatch(
      setAgentData({
        ...agent,
        ownership: {
          ...agent?.ownership,
          partnership: agent?.ownership?.partnership?.map((partner, i) => {
            if (i === index) return { ...partner, [name]: value };
            return partner;
          }),
        },
      })
    );

    validateField(name, value);
  };

  const handleOpenDate = (name, value, index) => {
    dispatch(
      setAgentData({
        ...agent,
        ownership: {
          ...ownership,
          partnership: ownership?.partnership?.map((partner, i) => {
            if (i === index)
              return {
                ...partner,
                [name]: value,
                whatsappNumber:
                  name === "isSameNumber" && value === true
                    ? partner?.phoneNumber
                    : "",
              };
            return partner;
          }),
        },
      })
    );
    if (name === "isSameNumber") {
      validateField(
        "whatsappNumber",
        ownership?.partnership[index]?.phoneNumber
      );
    }
  };

  const handleChangeDateAndPhone = (name, value, index) => {
    dispatch(
      setAgentData({
        ...agent,
        ownership: {
          ...agent?.ownership,
          partnership: agent?.ownership?.partnership?.map((partner, i) => {
            if (i === index)
              return {
                ...partner,
                [name]: value,
                isOpenCal: name === "dateOfBirth" ? false : partner?.isOpenCal,
              };
            return partner;
          }),
        },
      })
    );
    validateField(name, value);
  };

  const handleSetErrorMessage = (err) => {
    const validationErrors = {};
    err.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });
    CustomAlert({
      success: "warning",
      message:
        Object.keys(validationErrors)
          .map((a) => convertCamelToTitle(a))
          .join(", ") +
        " field have validation errors. Please ensure the required criteria.",
      alertFor: "registration",
    });
    setErrors(validationErrors);
  };

  const handleChangeNationality = (name, index) => {
    const e = { target: { name: "nationality", value: name } };
    handleChangeAgentData(e, index);
  };

  const validateField = async (field, value) => {
    try {
      await ownerInfoValidationSchema.validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
      return false;
    }
  };

  const handleSavePartnerInfo = async () => {
    const body = ownership?.partnership
      .filter((partner) => {
        return partner?.accountCreator !== 1;
      })
      .map((partner) => ({
        name: partner?.name,
        phoneNumber: partner?.phoneNumber,
        email: partner?.email,
        whatsappNumber: partner?.whatsappNumber,
        dateOfBirth: moment(partner?.dateOfBirth).format("YYYY-MM-DD"),
        gender: partner?.gender,
        nationality: partner?.nationality,
      }));

    // return;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/partnership-owners`;

    try {
      await ownerInfoValidationSchema.validate(
        ownership?.partnership[currentPartner],
        {
          abortEarly: false,
        }
      );
      setErrors({});

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to proceed next Step",
      });

      if (result?.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(url, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const responseData = response?.data;
        if (responseData?.success === true) {
          showToast("success", responseData?.message, () => {
            const agentData = responseData?.data[0];
            setStep(agentData?.pageNumber + 1);
            dispatch(
              setAgentData({
                ...agent,
                ...agentData,
                pageNumber: agentData?.pageNumber + 1,
              })
            );
          });
        }
      }

      // return;
    } catch (e) {
      if (e.name === "ValidationError") {
        setIsLoading(false);
        handleSetErrorMessage(e);
      } else {
        const message = e?.response?.data?.message || "An error occurred";
        showToast("error", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const restPartners = ownership?.partnership?.filter(
    (partner) => partner?.accountCreator !== 1
  );

  const handleSaveProprietorAndLimited = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/pages/3/complete`;


    try {

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to proceed next Step",
      });

      if(result?.isConfirmed){
        setIsLoading(true);
        const response = await axios.post(
          url,
          {},
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
            setStep(responseData?.data[0]?.pageNumber + 1);
            dispatch(
              setAgentData({
                ...agent,
                ...responseData?.data[0],
                pageNumber: responseData?.data[0]?.pageNumber + 1,
              })
            );
          });
        }
      }


    } catch (e) {
      if (e.name === "ValidationError") {
        handleSetErrorMessage(e);
      } else {
        const message = e?.response?.data?.message || "An error occurred";

        showToast("error", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPartner = async (tabNumber) => {
    const currentPartnerObject = ownership?.partnership[tabNumber];
    const body = {
      name: currentPartnerObject?.name,
      gender: currentPartnerObject?.gender,
      dateOfBirth: currentPartnerObject?.dateOfBirth,
      nationality: currentPartnerObject?.nationality,
      email: currentPartnerObject?.email,
      phoneNumber: currentPartnerObject?.phoneNumber,
      whatsappNumber: currentPartnerObject?.whatsappNumber,
    };

    try {
      await ownerInfoValidationSchema.validate(body, { abortEarly: false });
      setErrors({});
      setCurrentPartner(tabNumber + 1);
      return true;
    } catch (err) {
      if (err.name === "ValidationError") {
        handleSetErrorMessage(err);
        return false;
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 190px)",
          justifyContent: "space-between",
          gap: "50px",
        }}
      >
        <Box sx={{ pointerEvents: step < pageNumber && "none" }}>
          {agentType === "partnership" && (
            <PartnerTabBar
              partners={ownership?.[agentType]}
              step={step}
              currentPartner={currentPartner}
              setCurrentPartner={setCurrentPartner}
              handleNextPartner={handleNextPartner}
              setErrors={setErrors}
            />
          )}

          {ownership?.[agentType].map((owner, i) => {
            return (
              <Box
                key={i}
                sx={{
                  display:
                    currentPartner !== i &&
                    agentType === "partnership" &&
                    "none",
                }}
              >
                <Typography sx={{ fontWeight: "500", color: "#5F6368", mt: 1 }}>
                  {agentType === "partnership" && (
                    <>{getOrdinal(i + 1)} Managing Partner Information</>
                  )}
                  {agentType === "limited" &&
                    "Managing Director Information (Please Recheck Your Information)"}
                  {agentType === "proprietorship" && (
                    <>
                      Proprietor Information ( If the above information is
                      correct, click the{" "}
                      <span style={{ color: "var(--primary-color)" }}>
                        "Skip and Next"
                      </span>{" "}
                      button)
                    </>
                  )}
                </Typography>

                <Grid
                  container
                  spacing={3}
                  mt={"0px"}
                  // sx={{
                  //   pointerEvents: agentType !== "partnership" && "none",
                  // }}
                >
                  <Grid item md={4} xs={12}>
                    <Box
                      sx={{
                        position: "relative",
                        pointerEvents: agentType !== "partnership" && "none",
                      }}
                    >
                      <TextField
                        value={owner?.name || ""}
                        {...textFieldProps("name", `Name`)}
                        onChange={(e) => handleChangeAgentData(e, i)}
                        sx={sharedInputStyles}
                      />
                      <span style={registrationErrText}>{errors?.name}</span>
                    </Box>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Box
                      sx={{
                        position: "relative",
                        pointerEvents: agentType !== "partnership" && "none",
                      }}
                    >
                      <FormControl
                        fullWidth
                        size="small"
                        sx={sharedInputStyles}
                      >
                        <InputLabel id="gender-select-label">
                          Select Gender
                        </InputLabel>
                        <Select
                          labelId="gender-select-label"
                          value={owner?.gender}
                          name="gender"
                          label="Select Gender"
                          onChange={(e) => handleChangeAgentData(e, i)}
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
                      onClickAway={() =>
                        owner?.isOpenCal === true &&
                        handleChangeAgentData(
                          { target: { name: "isOpenCal", value: false } },
                          i
                        )
                      }
                    >
                      <Box
                        sx={{
                          position: "relative",
                          pointerEvents: agentType !== "partnership" && "none",
                          "& .MuiInputLabel-root": {
                            "&.Mui-focused": {
                              color: owner?.dateOfBirth && "#00000099",
                            },
                          },
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: owner?.dateOfBirth && "#0000003B",
                              borderWidth: owner?.dateOfBirth && "1px",
                            },
                          },
                        }}
                      >
                        <TextField
                          value={
                            owner?.dateOfBirth &&
                            moment(owner?.dateOfBirth, "YYYY-MM-DD").format(
                              "DD MMMM YYYY"
                            )
                          }
                          {...textFieldProps("dateOfBirth", "Date of Birth")}
                          sx={sharedInputStyles}
                          onClick={() =>
                            handleChangeAgentData(
                              {
                                target: {
                                  name: "isOpenCal",
                                  value: !owner?.isOpenCal,
                                },
                              },
                              i
                            )
                          }
                          focused={owner?.isOpenCal || owner?.dateOfBirth}
                          autoComplete="off"
                        />
                        <span style={registrationErrText}>
                          {errors?.dateOfBirth}
                        </span>
                        {owner?.isOpenCal && (
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
                                owner?.dateOfBirth
                                  ? owner?.dateOfBirth
                                  : new Date(maxDOB)
                              }
                              maxDate={maxDOB}
                              title={"Date of Birth"}
                              handleChange={(date) => {
                                handleChangeDateAndPhone(
                                  "dateOfBirth",
                                  date,
                                  i
                                );
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </ClickAwayListener>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Box
                      sx={{
                        position: "relative",
                        pointerEvents: agentType !== "partnership" && "none",
                      }}
                    >
                      <Typography sx={{ ...phoneInputLabel, zIndex: "10" }}>
                        Nationality
                      </Typography>
                      <Nationality
                        nationality={owner?.nationality}
                        handleChangeNationality={handleChangeNationality}
                        ownerIndex={i}
                        placeholder={"Select Nationality"}
                      />

                      <span style={registrationErrText}>
                        {errors?.nationality}
                      </span>
                    </Box>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Box
                      sx={{
                        position: "relative",
                        pointerEvents: agentType !== "partnership" && "none",
                      }}
                    >
                      <TextField
                        value={owner?.email || ""}
                        {...textFieldProps("email", `Email`, "email")}
                        onChange={(e) => handleChangeAgentData(e, i)}
                        sx={sharedInputStyles}
                      />

                      <span style={registrationErrText}>{errors?.email}</span>
                    </Box>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Box
                      sx={{
                        position: "relative",
                        pointerEvents: agentType !== "partnership" && "none",
                      }}
                    >
                      <Typography sx={phoneInputLabel}>Phone Number</Typography>
                      <PhoneInput
                        inputStyle={{ width: "100%", height: "100%" }}
                        value={owner?.phoneNumber}
                        country={"bd"}
                        countryCodeEditable={false}
                        onChange={(phone) => {
                          handleChangeDateAndPhone("phoneNumber", phone, i);
                        }}
                      />

                      <span style={registrationErrText}>
                        {errors?.phoneNumber}
                      </span>
                    </Box>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <Box
                      sx={{
                        position: "relative",
                        pointerEvents: agentType !== "partnership" && "none",
                      }}
                    >
                      <Typography sx={phoneInputLabel}>
                        Whatsapp Number
                      </Typography>
                      <PhoneInput
                        inputStyle={{ width: "100%", height: "100%" }}
                        value={owner?.whatsappNumber}
                        country={"bd"}
                        countryCodeEditable={false}
                        onChange={(phone) => {
                          handleChangeDateAndPhone("whatsappNumber", phone, i);
                        }}
                      />

                      <span style={registrationErrText}>
                        {errors?.whatsappNumber}
                      </span>
                    </Box>
                  </Grid>
                </Grid>

                <Grid container spacing={2} mt={0}>
                  <Grid item md={8}>
                    <Box
                      sx={{
                        pointerEvents: agentType !== "partnership" && "none",
                      }}
                    >
                      <CustomCheckBox
                        value={owner?.phoneNumber === owner?.whatsappNumber}
                        style={{ color: "var(--gray)", lineHeight: 1 }}
                        label="Personal and WhatsApp Number are Same"
                        fontSize={"13px"}
                        handleChange={(e) => {
                          handleOpenDate("isSameNumber", e.target.checked, i);
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Box>

        <Box>
          {pageNumber - 1 >= step ? (
            <Button
              style={{
                backgroundColor: "var(--secondary-color)",
                color: "white",
                width: isMobile ? "100%" : "215px",
                textTransform: "capitalize",
              }}
              onClick={() => setStep(4)}
            >
              Next
            </Button>
          ) : (
            <>
              {agentType === "partnership" ? (
                <>
                  {currentPartner < restPartners.length && (
                    <Button
                      style={{
                        backgroundColor: "var(--secondary-color)",
                        color: "white",
                        width: isMobile ? "100%" : "215px",
                        textTransform: "capitalize",
                      }}
                      onClick={() => handleNextPartner(currentPartner)}
                    >
                      next
                    </Button>
                  )}

                  {currentPartner === restPartners.length && (
                    <Button
                      disabled={isLoading}
                      style={{
                        backgroundColor: "var(--secondary-color)",
                        color: isLoading ? "" : "white",
                        width: isMobile ? "100%" : "215px",
                        textTransform: "capitalize",
                      }}
                      onClick={() => handleSavePartnerInfo()}
                    >
                      {isLoading ? "Please Wait..." : "Save & Next"}
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  style={{
                    backgroundColor: "var(--secondary-color)",
                    color: "white",
                    width: isMobile ? "100%" : "215px",
                    textTransform: "capitalize",
                  }}
                  onClick={handleSaveProprietorAndLimited}
                >
                  Skip & Next
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </>
  );
};

const required = (type) => Yup.string().required(`${type} is required`);

export const ownerInfoValidationSchema = Yup.object({
  name: personNameValidation("Name"),
  gender: required("Gender"),
  dateOfBirth: required("Date of birth"),
  nationality: required("Nationality"),
  email: emailValidation(""),
  phoneNumber: phoneValidation("Phone"),
  whatsappNumber: phoneValidation("Whatsapp"),
});

export default OwnerInfo;
