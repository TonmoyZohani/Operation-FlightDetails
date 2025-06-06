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
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  setAgentReg,
  setPartners,
  setSessionExpired,
} from "../../features/registrationSlice";
import useToast from "../../hook/useToast";
import {
  convertCamelToTitle,
  emailValidation,
  fileTypeValid,
  getOrdinal,
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
import Nationality from "./Nationality";
import PartnersTabBar from "./PartnersTabBar";
import RegAlert from "./RegAlert";
import RegImageBox from "./RegImageBox";
import { regSubmitBtn, RemoveDate } from "./RegisterPortal";
import ErrorDialog from "../Dialog/ErrorDialog";

const maxDOB = addYears(new Date(), -18);

const PartnerInfo = ({ isLoading, setIsLoading, setStep }) => {
  const dispatch = useDispatch();
  const agentReg = useSelector((state) => state.registration.agentReg);
  const { accessToken, correctionFields } = agentReg;
  const { partners } = agentReg?.user?.agent;
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isOpenCal, setIsOpenCal] = useState(null);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [crrIndex, setCrrIndex] = useState(0);
  const [allErrors, setAllErrors] = useState([]);

  useEffect(() => {
    if (partners.length === 0) {
      dispatch(setPartners([initialPartner]));
      setAllErrors([initialPartner]);
    }

    if (partners.length > 0) {
      setAllErrors(
        [...new Array(partners.length)].map(() => ({
          ...initialPartner,
          nationality: "",
        }))
      );
    }
  }, [partners.length]);

  useEffect(() => {
    if (correctionFields) {
      if (correctionFields.length > 0) {
        const unverifiedObj = {};
        correctionFields.forEach((field) => {
          unverifiedObj[field] =
            convertCamelToTitle(field) + " is not verified";
        });

        const unverifiedPartnerIndex = partners.findIndex(
          (item) => item?.id === agentReg?.metadata?.partnerId
        );

        setCrrIndex(unverifiedPartnerIndex);
        setAllErrors(
          partners.map((_, i) => {
            if (i === unverifiedPartnerIndex) return unverifiedObj;
            return {};
          })
        );
      }
    }
  }, [crrIndex]);

  const partner = partners[crrIndex];
  const errors = allErrors[crrIndex];

  const handleErroMessage = (field, message) => {
    setAllErrors(
      allErrors.map((err, i) => {
        if (crrIndex === i) {
          return { ...err, [field]: message };
        }
        return err;
      })
    );
  };

  const validateField = async (field, value) => {
    try {
      await partnerValidationSchema.validateAt(field, { [field]: value });
      handleErroMessage(field, "");
      return true;
    } catch (e) {
      handleErroMessage(field, e.message);
      return false;
    }
  };

  const handleAddPartner = () => {
    const isAdded = partners.every((partner) => partner.id);

    if (isAdded) {
      dispatch(
        setPartners([
          ...partners,
          { ...initialPartner, phoneNumber: "880", whatsappNumber: "880" },
        ])
      );
      setAllErrors([...allErrors, initialPartner]);
      setCrrIndex(
        [
          ...partners,
          { ...initialPartner, phoneNumber: "880", whatsappNumber: "880" },
        ].length - 1
      );
    } else {
      RegAlert({
        success: "warning",
        title: "warning",
        message:
          "Complete the partner's all information before adding a new one.",
      });
    }
  };

  const handleRemovePartner = async (index, id) => {
    if (id) {
      const result = await CustomAlert({
        success: "warning",
        message: `Are you sure? You want to delete ${index + 2}<sup>${getOrdinal(index + 2).slice(1, 3)}</sup> Partner?`,
      });

      if (result?.isConfirmed) {
        setIsDeleting(id);
        const formData = new FormData();
        formData.append("id", id);

        try {
          const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account?step=3.1`;
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
            showToast(
              "success",
              `${crrIndex + 2}<sup>${getOrdinal(crrIndex + 2).slice(1, 3)}</sup> Partner Deleted Successfully`
            );
          }
        } catch (e) {
          const message = e?.response?.data?.message || "An error occurred";

          showToast("error", message, () => {
            if (e?.response?.data?.statusCode === 401) {
              dispatch(setSessionExpired());
            }
          });
        } finally {
          setIsDeleting(null);
          setCrrIndex(0);
        }
      }
    } else {
      setCrrIndex(0);
      const updatedPartners = partners.filter((_, i) => i !== index);
      dispatch(setPartners(updatedPartners));
      setAllErrors(allErrors.filter((_, i) => i !== index));
    }
  };

  const handleChangePartner = (e) => {
    const { name, value } = e.target;

    const updatedPartners = partners.map((partner, i) => {
      if (i === crrIndex) {
        return { ...partner, [name]: value };
      }
      return partner;
    });
    dispatch(setPartners(updatedPartners));

    validateField(name, value);
  };

  const handleUploadProgress = (progress) => {
    const updatedProgress = [...new Array(partners.length)].map((_, i) => {
      if (i === crrIndex) {
        return { ...progress };
      }
    });

    setUploadProgress(updatedProgress);
  };

  const handleSubmitPartner = async () => {
    const body = {};

    Object.keys(initialPartner).forEach((key) => {
      if (typeof partner[key] === "string") {
        if (key.includes("Image") && partner[key].includes("https://")) {
          return;
        }
      }
      body[key] = partner[key];
    });

    const unverifiedFileBody = {};

    if (correctionFields.length > 0) {
      correctionFields.forEach((key) => {
        unverifiedFileBody[key] = partner[key];
      });
    }

    const formData = new FormData();

    Object.keys(
      correctionFields.length > 0 ? unverifiedFileBody : body
    ).forEach((key) => {
      formData.append(
        key,
        key === "dateOfBirth"
          ? moment(partner[key]).format("YYYY-MM-DD")
          : partner[key]
      );
    });

    if (partner?.id) {
      formData.append("id", partner?.id);
    }

    try {
      await partnerValidationSchema.validate(partner, { abortEarly: false });
      setAllErrors(allErrors.filter((_, i) => i !== crrIndex));

      const url = `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account?step=3.1`;
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to next Proceed?",
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

          const updatedPartners = agentData?.user?.agent?.partners || [];

          if (correctionFields.length > 0) {
            RegAlert({
              success: true,
              message: `${crrIndex + 2}<sup>${getOrdinal(crrIndex + 2).slice(1, 3)}</sup> Partner Information Updated Successfully`,
            });

            dispatch(
              setAgentReg({ ...agentReg, ...agentData, pageNumber: nextStep })
            );

            if (agentData?.metadata?.partnerId) {
              const nextUnverifiedPartner = updatedPartners.findIndex(
                (item) => item?.id === agentData?.metadata?.partnerId
              );
              setCrrIndex(nextUnverifiedPartner);
            }

            setStep(nextStep);
            return;
          }
          RegAlert({
            success: true,
            message:
              `${crrIndex + 2}<sup>${getOrdinal(crrIndex + 2).slice(1, 3)}</sup> Partner Information ${partner?.id ? "Updated" : "Completed"} Successfully.` +
              (crrIndex < 2
                ? ` Do you want to ${partner?.id && crrIndex !== updatedPartners.length - 1 ? "update" : "add"} more Partner?`
                : ""),
            alertFor:
              crrIndex + 1 < updatedPartners?.length
                ? "partner"
                : updatedPartners?.length < 3 && "partner",
            cancelBtnText:
              crrIndex !== updatedPartners.length - 1
                ? "Update More Partner"
                : "Add More Partner",
          }).then((res) => {
            if (res.isConfirmed) {
              dispatch(
                setAgentReg({ ...agentReg, ...agentData, pageNumber: nextStep })
              );
              setStep(nextStep);
            } else if (res.dismiss === Swal.DismissReason.cancel) {
              if (crrIndex === updatedPartners.length - 1) {
                dispatch(
                  setPartners([
                    ...agentData?.user?.agent?.partners,
                    {
                      ...initialPartner,
                      phoneNumber: "880",
                      whatsappNumber: "880",
                    },
                  ])
                );
                setAllErrors([...allErrors, initialPartner]);
                setCrrIndex(crrIndex + 1);
              } else {
                setCrrIndex(crrIndex + 1);
              }
            }
          });
        }
      }
    } catch (err) {
      if (err.name === "ValidationError") {
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
        //     " field have validaion errors. Please ensure the required criteria.",
        // });

        setShowErrorDialog(true);

        setAllErrors(
          allErrors.map((item, i) => {
            if (i === crrIndex) {
              return validationErrors;
            }
            return item;
          })
        );
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

  const unverifiedFields = (name) => {
    return correctionFields?.length > 0 && !correctionFields?.includes(name);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 190px)",
          justifyContent: "space-between",
          gap: "100px",
        }}
      >
        <Box>
          <Box
            sx={{
              pointerEvents:
                correctionFields && correctionFields.length > 0 && "none",
            }}
          >
            <PartnersTabBar
              partners={partners}
              crrIndex={crrIndex}
              setCrrIndex={setCrrIndex}
              handleAddPartner={handleAddPartner}
              handleRemovePartner={handleRemovePartner}
              isDeleting={isDeleting}
            />
          </Box>
          <Typography sx={{ fontWeight: "500", color: "#5F6368", mt: 2 }}>
            {crrIndex + 2}
            <sup>{getOrdinal(crrIndex + 2).slice(1, 3)}</sup> Partner
            Information
          </Typography>

          <Typography sx={{ color: "var(--primary-color)", fontSize: "13px" }}>
            <span style={{ fontWeight: "500" }}>Note:</span> Please ensure that
            all fields are filled exactly as per NID card to avoid
            discrepancies.
          </Typography>

          <Grid container spacing={3} mt={"0px"}>
            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={partner?.name || ""}
                  {...textFieldProps("name", `Name`)}
                  onChange={handleChangePartner}
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
                    value={partner?.gender || ""}
                    name="gender"
                    label="Select Gender"
                    onChange={handleChangePartner}
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
                onClickAway={() => isOpenCal && setIsOpenCal(null)}
              >
                <Box
                  sx={{
                    position: "relative",
                    "& .MuiInputLabel-root": {
                      "&.Mui-focused": {
                        color: partner?.dateOfBirth && "#00000099",
                      },
                    },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: partner?.dateOfBirth && "#0000003B",
                        borderWidth: partner?.dateOfBirth && "1px",
                      },
                    },
                    pointerEvents: unverifiedFields("dateOfBirth") && "none",
                  }}
                >
                  <TextField
                    value={
                      partner?.dateOfBirth &&
                      moment(partner?.dateOfBirth, "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )
                    }
                    {...textFieldProps("dateOfBirth", "Date of Birth")}
                    sx={sharedInputStyles}
                    onClick={() => setIsOpenCal(crrIndex + 1)}
                    focused={isOpenCal || partner?.dateOfBirth}
                    autoComplete="off"
                    disabled={unverifiedFields("dateOfBirth")}
                  />
                  <span style={registrationErrText}>{errors?.dateOfBirth}</span>
                  {isOpenCal === crrIndex + 1 && (
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
                          partner?.dateOfBirth
                            ? partner?.dateOfBirth
                            : new Date(maxDOB)
                        }
                        maxDate={maxDOB}
                        title={"Date of Birth"}
                        handleChange={(date) => {
                          handleChangePartner({
                            target: { name: "dateOfBirth", value: date },
                          });
                          setIsOpenCal(null);
                        }}
                      />
                    </Box>
                  )}

                  {partner?.dateOfBirth && (
                    <RemoveDate
                      handleClick={() => {
                        handleChangePartner({
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
                  nationality={partner?.nationality}
                  handleChangeNationality={(value) => {
                    handleChangePartner({
                      target: { name: "nationality", value: value?.name },
                    });
                  }}
                  placeholder={"Select Nationality"}
                  isDisabled={true}
                  optionFor={"registration"}
                />

                <span style={registrationErrText}>{errors?.nationality}</span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={partner?.email || ""}
                  {...textFieldProps("email", `Email`, "email")}
                  onChange={handleChangePartner}
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
                  value={partner?.phoneNumber}
                  country={"bd"}
                  countryCodeEditable={false}
                  onChange={(phone) => {
                    handleChangePartner({
                      target: { name: "phoneNumber", value: phone },
                    });
                  }}
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
                  value={partner?.whatsappNumber}
                  country={"bd"}
                  countryCodeEditable={false}
                  onChange={(phone) => {
                    handleChangePartner({
                      target: { name: "whatsappNumber", value: phone },
                    });
                  }}
                  disableDropdown
                />

                <span style={registrationErrText}>
                  {errors?.whatsappNumber}
                </span>
              </Box>
            </Grid>

            <Grid item md={4} xs={12}>
              <Box>
                <CustomCheckBox
                  value={partner?.phoneNumber === partner?.whatsappNumber}
                  style={{ color: "var(--gray)", lineHeight: 1 }}
                  label="Personal and WhatsApp Number are Same"
                  fontSize={"13px"}
                  handleChange={(e) => {
                    if (e.target.checked) {
                      handleChangePartner({
                        target: {
                          name: "whatsappNumber",
                          value: partner?.phoneNumber,
                        },
                      });
                    } else {
                      handleChangePartner({
                        target: {
                          name: "whatsappNumber",
                          value: "",
                        },
                      });
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={0}>
            <RegImageBox
              errors={errors}
              setErrors={() => {}}
              reqDocFields={reqDocFields(
                `${crrIndex + 2}<sup>${getOrdinal(crrIndex + 2).slice(1, 3)}</sup> Partner`
              )}
              data={partner ? partner : {}}
              validationSchema={partnerValidationSchema}
              handleGetImageFile={(reqDoc, value) => {
                handleChangePartner({ target: { name: reqDoc?.name, value } });
              }}
              uploadProgress={uploadProgress[crrIndex] || {}}
              setUploadProgress={(progress) => {
                handleUploadProgress(progress);
              }}
              validate={validateField}
              correctionFields={correctionFields}
            />
          </Grid>
        </Box>

        <Box sx={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
          <Button
            disabled={isLoading}
            style={regSubmitBtn(isLoading)}
            onClick={handleSubmitPartner}
          >
            {isLoading
              ? "parner information is in progress, please Wait..."
              : partner?.id
                ? "Update Partner information"
                : "save parner information and continue to next step"}
          </Button>
        </Box>
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
          type="For Partner Information"
        />
      )}
    </>
  );
};

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

const required = (type) => Yup.string().required(`${type} is required`);

const partnerValidationSchema = Yup.object({
  name: personNameValidation("Name"),
  gender: required("Gender"),
  dateOfBirth: required("Date of birth"),
  nationality: required("Nationality"),
  email: emailValidation(""),
  phoneNumber: phoneValidation("Phone"),
  whatsappNumber: phoneValidation("Whatsapp"),
  nidFrontImage: fileTypeValid("NID Front"),
  nidBackImage: fileTypeValid("NID Back"),
  profileImage: fileTypeValid("Pasport Size Photo"),
  tinImage: fileTypeValid("TIN Certificate"),
  // signatureImage: fileTypeValid("Signature"),
});

const initialPartner = {
  name: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  email: "",
  whatsappNumber: "",
  nationality: "Bangladesh",
  profileImage: null,
  nidFrontImage: null,
  nidBackImage: null,
  tinImage: null,
  // signatureImage: null,
};

export default PartnerInfo;
