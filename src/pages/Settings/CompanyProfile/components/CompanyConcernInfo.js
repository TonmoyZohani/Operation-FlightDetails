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
import React, { useState } from "react";
import { regTitle } from "../../../../component/Register/GeneraInfo";
import { textFieldProps } from "../../../../shared/common/functions";
import {
  depositBtn,
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../../../shared/common/styles";
import moment from "moment";
import Nationality from "../../../../component/Register/Nationality";
import PhoneInput from "react-phone-input-2";
import { Calendar } from "react-date-range";
import { addYears } from "date-fns";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { concernInfoValidationSchema } from "../../../../component/Register/ConcernInfo";
import { useAuth } from "../../../../context/AuthProvider";
import CustomAlert from "../../../../component/Alert/CustomAlert";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import ImagePreviewModal from "../../../../component/Modal/ImagePreviewModal";
import useToast from "../../../../hook/useToast";
import CustomToast from "../../../../component/Alert/CustomToast";
import FileUpload from "../../../../component/AirBooking/FileUpload";
import CustomLoadingAlert from "../../../../component/Alert/CustomLoadingAlert";
import ErrorDialog from "../../../../component/Dialog/ErrorDialog";
import useWindowSize from "../../../../shared/common/useWindowSize";

const maxDOB = addYears(new Date(), -18);

const CompanyConcernInfo = ({ agentProfile, isEditable, refetch }) => {
  const { isMobile } = useWindowSize();
  const [imageUrl, setImageUrl] = useState(null);
  const [editable, setEditable] = useState(false);
  const [openCal, setOpenCal] = useState(false);
  const { agentToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [concernPerson, setConcernPerson] = useState({
    personName: "",
    personGender: "",
    personDob: "",
    personNationality: "",
    personRelation: "",
    personAddress: "",
    personEmail: "",
    personNumber: "",
    personWhatsappNumber: "",
    personNidFront: "",
    personNidBack: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (fieldName, value) => {
    setConcernPerson((prevDetails) => ({
      ...prevDetails,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setShowErrorDialog(true);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    const formData = new FormData();

    // Mapping keys to the expected API format, filter out empty/null values
    const mappedData = {
      name: concernPerson?.personName,
      gender: concernPerson?.personGender,
      dateOfBirth: concernPerson?.personDob,
      nationality: concernPerson?.personNationality,
      address: concernPerson?.personAddress,
      email: concernPerson?.personEmail,
      phoneNumber: concernPerson?.personNumber,
      whatsappNumber: concernPerson?.personWhatsappNumber,
      relation: concernPerson?.personRelation,
      nidFrontImage: concernPerson?.personNidFront,
      nidBackImage: concernPerson?.personNidBack,
    };

    Object.keys(mappedData).forEach((key) => {
      if (mappedData[key]) {
        formData.append(key, mappedData[key]);
      }
    });

    const url = `${process.env.REACT_APP_BASE_URL}/api/v2/user/agent/concern-person`;

    try {
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to update Concern Information?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);

        // Make the API request with the formData
        const response = await axios.patch(url, formData, {
          headers: {
            Authorization: `Bearer ${agentToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const responseData = response?.data;
        if (responseData?.success === true) {
          refetch();
          setIsLoading(false);
          showToast("success", responseData?.message);
          setEditable(false);
        }
      }
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
            flexDirection: {
              xs: "column",
              lg: "row",
              md: "row",
              sm: "row",
            },
            gap: { xs: 1.3, lg: "0px" },
            mb: { xs: 2, lg: 0, md: 0, sm: 0 },
          }}
        >
          <Typography sx={{ ...regTitle, mt: 0 }}>
            Emergency Concern Person Information
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
                {!isMobile && "Click to "} Close
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
                  {!isMobile && "Click to "} Update
                </span>
                <EditCalendarIcon sx={{ p: 0.25 }} />
              </Typography>
            )
          )}
        </Box>

        <Grid container spacing={3} mt={0}>
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                defaultValue={
                  agentProfile?.currentData?.concernPerson?.name || ""
                }
                {...textFieldProps("personName", "Name")}
                onChange={(e) => handleChange("personName", e.target.value)}
                sx={sharedInputStyles}
                disabled={!editable}
              />

              <span style={registrationErrText}>{errors?.personName}</span>
              {agentProfile?.updatedData?.concernPerson?.name && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <FormControl fullWidth size="small" sx={sharedInputStyles}>
                <InputLabel id="gender-select-label">Select Gender</InputLabel>
                <Select
                  labelId="gender-select-label"
                  defaultValue={
                    agentProfile?.currentData?.concernPerson?.gender
                  }
                  name="personGender"
                  label="Select Gender"
                  onChange={(e) => handleChange("personGender", e.target.value)}
                  disabled={!editable}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>

              {agentProfile?.updatedData?.concernPerson?.gender && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <ClickAwayListener onClickAway={() => openCal && setOpenCal(false)}>
              <Box
                sx={{
                  position: "relative",
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color:
                        agentProfile?.currentData?.concernPerson?.dateOfBirth &&
                        "#00000099",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor:
                        agentProfile?.currentData?.concernPerson?.dateOfBirth &&
                        "#0000003B",
                      borderWidth:
                        agentProfile?.currentData?.concernPerson?.dateOfBirth &&
                        "1px",
                    },
                  },
                }}
              >
                <TextField
                  value={moment(
                    agentProfile?.currentData?.concernPerson?.dateOfBirth,
                    "YYYY-MM-DD"
                  ).format("DD MMMM YYYY")}
                  {...textFieldProps("dateOfBirth", "Date of Birth")}
                  sx={sharedInputStyles}
                  onClick={() => setOpenCal(!openCal)}
                  disabled={!editable}
                />
                {agentProfile?.updatedData?.concernPerson?.dateOfBirth && (
                  <span style={{ color: "var(--green)", fontSize: "11px" }}>
                    Already in update request
                  </span>
                )}
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
                      date={
                        concernPerson?.personDob
                          ? concernPerson.personDob
                          : new Date(maxDOB)
                      }
                      onChange={(date) => {
                        handleChange(
                          "personDob",
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
                nationality={
                  agentProfile?.currentData?.concernPerson?.nationality
                }
                handleChangeNationality={(e) =>
                  handleChange("personNationality", e)
                }
                isDisabled={true}
              />
              {agentProfile?.updatedData?.concernPerson?.nationality && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                defaultValue={
                  agentProfile?.currentData?.concernPerson?.relation || ""
                }
                {...textFieldProps("personRelation", "Relation")}
                onChange={(e) => handleChange("personRelation", e.target.value)}
                sx={sharedInputStyles}
                disabled={!editable}
              />
              <span style={registrationErrText}>{errors?.personRelation}</span>
              {agentProfile?.updatedData?.concernPerson?.relation && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                defaultValue={
                  agentProfile?.currentData?.concernPerson?.address || ""
                }
                {...textFieldProps("personAddress", "Address")}
                onChange={(e) => handleChange("personAddress", e.target.value)}
                sx={sharedInputStyles}
                disabled={!editable}
              />
              <span style={registrationErrText}>{errors?.personAddress}</span>
              {agentProfile?.updatedData?.concernPerson?.address && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                defaultValue={
                  agentProfile?.currentData?.concernPerson?.email || ""
                }
                {...textFieldProps("personEmail", "Email")}
                onChange={(e) => handleChange("personEmail", e.target.value)}
                sx={sharedInputStyles}
                disabled={!editable}
              />
              <span style={registrationErrText}>{errors?.personEmail}</span>
              {agentProfile?.updatedData?.concernPerson?.email && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Typography sx={phoneInputLabel}>Phone Number</Typography>
              <PhoneInput
                inputStyle={{ width: "100%", height: "100%" }}
                value={
                  agentProfile?.currentData?.concernPerson?.phoneNumber || ""
                }
                country="bd"
                countryCodeEditable={false}
                onChange={(phone) => handleChange("personNumber", phone)}
                disabled={!editable}
              />
              {agentProfile?.updatedData?.concernPerson?.phoneNumber && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
              <span style={registrationErrText}>{errors?.personNumber}</span>
            </Box>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Typography sx={phoneInputLabel}>Whatsapp Number</Typography>
              <PhoneInput
                inputStyle={{ width: "100%", height: "100%" }}
                value={
                  agentProfile?.currentData?.concernPerson?.whatsappNumber || ""
                }
                country="bd"
                countryCodeEditable={false}
                onChange={(phone) => handleChange("whatsappNumber", phone)}
                disabled={!editable}
              />
              {agentProfile?.updatedData?.concernPerson?.whatsappNumber && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
              <span style={registrationErrText}>
                {errors?.personWhatsappNumber}
              </span>
            </Box>
          </Grid>

          <Grid item xs={12} container spacing={2.5}>
            <Grid item md={4} sm={6} xs={12}>
              <FileUpload
                id="nidFront"
                label="NID / VISITING / JOB ID CARD"
                onFileChange={(file) => handleChange("personNidFront", file)}
                previewImg={
                  agentProfile?.currentData?.concernPerson?.nidFrontImage ||
                  null
                }
                isDisable={!editable}
                accept=".jpg,.jpeg,.png,.pdf"
                acceptLabel="JPG JPEG PNG & PDF"
              />
              {agentProfile?.updatedData?.concernPerson?.nidFrontImage && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
            </Grid>

            {/* <Grid item md={4} sm={6} xs={12}>
              <FileUpload
                id="personNidBack"
                label="Nid Back"
                onFileChange={(file) => handleChange("personNidBack", file)}
                previewImg={
                  agentProfile?.currentData?.concernPerson?.nidBackImage || null
                }
                isDisable={!editable}
              />

              {agentProfile?.updatedData?.concernPerson?.nidBackImage && (
                <span style={{ color: "var(--green)", fontSize: "11px" }}>
                  Already in update request
                </span>
              )}
            </Grid> */}
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
          textAlign: "left",
          paddingRight: isLoading ? "16px" : "0",
        }}
        onClick={handleSubmit}
      >
        Update Concern Person Information
      </Button>
      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your Update Request"}
      />
      <ImagePreviewModal
        open={imageUrl}
        imgUrl={imageUrl}
        onClose={setImageUrl}
      />
      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      {showErrorDialog && (
        <ErrorDialog
          errors={errors}
          data={Object.fromEntries(
            Object.entries(concernPerson).filter(([key, value]) => value !== "")
          )}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type={"Preview And Confirm"}
        />
      )}
    </Box>
  );
};

const concernValidationSchema = concernInfoValidationSchema.pick([
  "personName",
  "personAddress",
  "personEmail",
  "phoneNumber",
  "personWhatsappNumber",
  "personNidFront",
  "personNidBack",
]);

export default CompanyConcernInfo;
