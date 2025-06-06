import CloseIcon from "@mui/icons-material/Close";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
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
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PhoneInput from "react-phone-input-2";
import CustomAlert from "../../../../component/Alert/CustomAlert";
import CustomLoadingAlert from "../../../../component/Alert/CustomLoadingAlert";
import CustomToast from "../../../../component/Alert/CustomToast";
import ErrorDialog from "../../../../component/Dialog/ErrorDialog";
import {
  generalInfoValidationSchema,
  regTitle,
} from "../../../../component/Register/GeneraInfo";
import Nationality from "../../../../component/Register/Nationality";
import { useAuth } from "../../../../context/AuthProvider";
import useToast from "../../../../hook/useToast";
import { textFieldProps } from "../../../../shared/common/functions";
import {
  depositBtn,
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../../../shared/common/styles";
import useWindowSize from "../../../../shared/common/useWindowSize";

const maxDOB = addYears(new Date(), -18);

const CompanyGeneralInfo = ({
  agentProfile,
  setAgentProfile,
  isEditable,
  refetch,
}) => {
  const { isMobile } = useWindowSize();
  const [openCal, setOpenCal] = useState(false);
  const [editable, setEditable] = useState(false);
  const { jsonHeader } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [agency, setAgency] = useState({});
  const [errors, setErrors] = useState({});
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  useEffect(() => {
    if (agentProfile) {
      setAgency({
        agencyName:
          agentProfile?.currentData?.agencyInformation?.agencyName || "",
        firstName: agentProfile?.currentData?.user?.firstName || "",
        lastName: agentProfile?.currentData?.user?.lastName || "",
        gender: agentProfile?.currentData?.gender || "",
        dateOfBirth: agentProfile?.currentData?.dateOfBirth || "",
        nationality: agentProfile?.currentData?.nationality || "",
        whatsappNumber: agentProfile?.currentData?.whatsappNumber || "",
      });
    }
  }, [agentProfile]);

  const handleOnChange = (field, value) => {
    setAgency((prevAgency) => ({
      ...prevAgency,
      [field]: value,
    }));
  };

  const validateField = async (field, value) => {
    try {
      const values = {
        [field]: value,
      };

      await validationSchema.validateAt(field, values);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
    }
  };

  const handleSubmit = async () => {
    try {
      setShowErrorDialog(true);
      await validationSchema.validate(agency, { abortEarly: false });
      setErrors({});
    } catch (e) {
      setIsLoading(false);
      if (e.name === "ValidationError") {
        const formattedErrors = {};
        e.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  const onSubmit = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/agent/general-info`;

    try {
      await validationSchema.validate(agency, { abortEarly: false });
      setErrors({});

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to update general Information?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.patch(
          url,
          { whatsappNumber: agency?.whatsappNumber },
          jsonHeader()
        );
        const responseData = response?.data;

        if (responseData?.success === true) {
          refetch();
          setIsLoading(false);
          showToast("success", response?.data?.message);
          setEditable(false);
          setAgentProfile({
            ...agentProfile.currentData,
            updatedData: responseData?.data,
          });
        }
      }
    } catch (e) {
      setIsLoading(false);
      showToast("error", e?.response?.data?.message);
      if (e.name === "ValidationError") {
        const formattedErrors = {};
        e.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 300px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: !isMobile && "center",
            mt: 4,
            flexDirection: { xs: "column", lg: "row", md: "row", sm: "row" },
            gap: { xs: 1.3, lg: "0px" },
            mb: { xs: 2, lg: 0, md: 0, sm: 0 },
          }}
        >
          <Typography sx={{ ...regTitle, mt: 0 }}>
            Agency General Information
          </Typography>
          {editable ? (
            <Typography
              onClick={() => setEditable(!editable)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "4px",
                cursor: "pointer",
                color: "white",
                bgcolor: "var(--primary-color)",
                px: 1,
                borderRadius: "3px",
                width: "130px",
              }}
            >
              <span style={{ paddingTop: "3px", fontSize: "13px" }}>
                {!isMobile && "Click to"} Close
              </span>
              <CloseIcon sx={{ p: 0.25 }} />
            </Typography>
          ) : (
            isEditable && (
              <Typography
                onClick={() => setEditable(!editable)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "4px",
                  cursor: "pointer",
                  color: "white",
                  bgcolor: "var(--primary-color)",
                  px: 1,
                  borderRadius: "3px",
                  width: "130px",
                }}
              >
                <span style={{ paddingTop: "3px", fontSize: "13px" }}>
                  {!isMobile && "Click to"} Update
                </span>
                <EditCalendarIcon sx={{ p: 0.25 }} />
              </Typography>
            )
          )}
        </Box>

        <Grid container spacing={3} mt={"0"}>
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <FormControl fullWidth size="small" sx={sharedInputStyles}>
                <InputLabel id="agentType-select-label">
                  Select Agency Type *
                </InputLabel>
                <Select
                  labelId="agentType-select-label"
                  value={
                    agentProfile?.currentData?.agencyInformation?.agencyType ||
                    ""
                  }
                  name="agentType"
                  label="Select Agency Type"
                  disabled
                >
                  <MenuItem value="proprietorship">Proprietorship</MenuItem>
                  <MenuItem value="limited">Limited</MenuItem>
                  <MenuItem value="partnership">Partnership</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={agency?.agencyName}
                {...textFieldProps("agencyName", "Agency Name")}
                onChange={(e) => {
                  handleOnChange("agencyName", e.target.value);
                  validateField("agencyName", e.target.value);
                }}
                sx={{ sharedInputStyles }}
                disabled={!editable || isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <span style={registrationErrText}>{errors?.agencyName}</span>
            </Box>
          </Grid>
        </Grid>

        <Typography sx={{ ...regTitle, mt: 4 }}>
          Agency{" "}
          {agentProfile?.agentType === "proprietorship"
            ? "Proprietor"
            : agentProfile?.agentType === "limited"
              ? "Managing Director"
              : agentProfile?.agentType === "partnership"
                ? "1st Managing Partner"
                : "Concern Person"}{" "}
          Information
        </Typography>

        <Grid container spacing={3} mt={"0"}>
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={agency?.firstName}
                {...textFieldProps("firstName", "First Name")}
                onChange={(e) => {
                  handleOnChange("firstName", e.target.value);
                  validateField("firstName", e.target.value);
                }}
                sx={sharedInputStyles}
                disabled={!editable || isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <span style={registrationErrText}>{errors?.firstName}</span>
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={agency?.lastName}
                {...textFieldProps("lastName", "Last Name")}
                onChange={(e) => {
                  handleOnChange("lastName", e.target.value);
                  validateField("lastName", e.target.value);
                }}
                sx={sharedInputStyles}
                disabled={!editable || isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <span style={registrationErrText}>{errors?.lastName}</span>
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <FormControl fullWidth size="small" sx={sharedInputStyles}>
                <InputLabel id="gender-select-label">
                  Select Gender *
                </InputLabel>
                <Select
                  labelId="gender-select-label"
                  value={agency?.gender || ""}
                  {...textFieldProps("gender", "Select Gender")}
                  onChange={(e) => handleOnChange("gender", e.target.value)}
                  MenuProps={{ disableScrollLock: true }}
                  disabled={!editable || isEditable}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <ClickAwayListener onClickAway={() => openCal && setOpenCal(false)}>
              <Box
                sx={{
                  position: "relative",
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: openCal
                        ? "var(--primary-color)"
                        : agency?.dateOfBirth && "#00000099",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: openCal
                        ? "#8BB6CC"
                        : agency?.dateOfBirth && "var(--border-color)",
                    },
                  },
                }}
              >
                <TextField
                  value={moment(agency?.dateOfBirth, "YYYY-MM-DD").format(
                    "DD MMMM YYYY"
                  )}
                  {...textFieldProps("dateOfBirth", "Date of Birth")}
                  sx={sharedInputStyles}
                  onClick={() => setOpenCal(!openCal)}
                  disabled={!editable || isEditable}
                />
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
                    <Calendar
                      style={{ backgroundColor: "white" }}
                      date={agency?.dateOfBirth}
                      onChange={(date) => {
                        handleOnChange(
                          "dateOfBirth",
                          moment(date).format("YYYY-MM-DD")
                        );
                        setOpenCal(false);
                      }}
                      months={1}
                      maxDate={maxDOB}
                    />
                  </Box>
                )}
              </Box>
            </ClickAwayListener>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box
              sx={{
                position: "relative",
                pointerEvents: editable ? "auto" : "none",
                opacity: editable ? 1 : 0.5,
              }}
            >
              <Nationality
                nationality={agency?.nationality}
                handleChangeNationality={(e) =>
                  handleOnChange("nationality", e)
                }
                isDisabled={isEditable}
              />
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Typography sx={phoneInputLabel}>Phone Number *</Typography>
              <PhoneInput
                inputStyle={{ width: "100%", height: "100%" }}
                value={agentProfile?.currentData?.user?.phone}
                country={"bd"}
                countryCodeEditable={false}
                disabled
              />
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Typography sx={phoneInputLabel}>Whatsapp Number *</Typography>
              <PhoneInput
                inputStyle={{ width: "100%", height: "100%" }}
                value={agency?.whatsappNumber}
                country={"bd"}
                countryCodeEditable={false}
                disabled={!editable}
                label="WhatsApp Number"
                onChange={(phone) => {
                  handleOnChange("whatsappNumber", phone);
                  validateField("whatsappNumber", phone);
                }}
              />

              <span style={registrationErrText}>{errors?.whatsappNumber}</span>
              {agentProfile?.updatedData?.whatsappNumber && (
                <span style={{ ...registrationErrText, color: "var(--green)" }}>
                  Already in update request
                </span>
              )}
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={agentProfile?.currentData?.user?.email}
                {...textFieldProps("email", "Email")}
                sx={{ sharedInputStyles }}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Button
        type="submit"
        disabled={isLoading}
        sx={{
          ...depositBtn,
          display: editable ? "flex" : "none",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: isLoading ? "8px" : "0",
          textAlign: isLoading ? "center" : "left",
          paddingRight: isLoading ? "16px" : "0",
        }}
        onClick={handleSubmit}
      >
        Update agent general Information
      </Button>
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your Update Request"}
      />

      {showErrorDialog && (
        <ErrorDialog
          errors={errors}
          data={{ whatsappNumber: agency?.whatsappNumber }}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type={"Preview And Confirm"}
        />
      )}
    </Box>
  );
};

const validationSchema = generalInfoValidationSchema.pick([
  "agencyName",
  "firstName",
  "lastName",
  "whatsappNumber",
]);

export default CompanyGeneralInfo;
