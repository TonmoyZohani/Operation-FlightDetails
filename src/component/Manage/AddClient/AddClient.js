import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  depositBtn,
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import {
  emailValidation,
  personNameValidation,
  phoneValidation,
  textFieldProps,
} from "../../../shared/common/functions";
import moment from "moment";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";
import { options } from "../../Register/Nationality";
import PhoneInput from "react-phone-input-2";
import PageTitle from "../../../shared/common/PageTitle";
import * as Yup from "yup";
import CustomToast from "../../Alert/CustomToast";
import ErrorDialog from "../../Dialog/ErrorDialog";
import CustomLoadingAlert from "../../Alert/CustomLoadingAlert";
import useToast from "../../../hook/useToast";
import { useAuth } from "../../../context/AuthProvider";
import axios from "axios";
import CustomAlert from "../../Alert/CustomAlert";
import { useNavigate } from "react-router-dom";
import Scan from "../../../assets/svg/scan.svg";
import ClientPassportScan from "./ClientPassportScan";
import { customStyles } from "../../AirBooking/PassengerBox";
import Select from "react-select";
import ImageUploadFile from "../../Modal/ImageUploadFile";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddClient = ({
  from,
  clientModalData,
  handleFrequentFlyerChange,
  frequentPax,
  setOpenClientModal,
}) => {
  const { jsonHeader } = useAuth();
  const navigate = useNavigate();
  const [concernPerson, setConcernPerson] = useState(
    clientModalData
      ? {
          nickName: "",
          firstName: clientModalData?.firstName,
          lastName: clientModalData?.lastName,
          gender: clientModalData?.gender,
          dateOfBirth: clientModalData?.dateOfBirth,
          passportNation: clientModalData?.passportNation?.code,
          passportNumber: clientModalData?.passportNumber,
          frequentTraveler: clientModalData?.frequentTraveler,
          passportExpire: clientModalData?.passportExpire,
          passportCopy: clientModalData?.passportImage,
          email: "",
        }
      : {}
  );
  const [errors, setErrors] = useState({});
  const [openCal, setOpenCal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPassportCal, setOpenPassportCal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const validateField = async (field, value) => {
    try {
      const values = {
        [field]: value,
      };

      const response = await validationSchema().validateAt(field, values);

      if (response) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
    }
  };

  const handleOnChange = (name, value) => {
    setConcernPerson((prev) => ({ ...prev, [name]: value }));
    if (name === "passportNation") {
      validateField(name, value?.value);
    } else {
      validateField(name, value);
    }
  };

  const body = {
    nickName: concernPerson?.nickName,
    firstName: concernPerson?.firstName,
    lastName: concernPerson?.lastName,
    gender: concernPerson?.gender,
    dateOfBirth: concernPerson?.dateOfBirth,
    passportNation: concernPerson?.passportNation?.name,
    passportNumber: concernPerson?.passportNumber,
    passportExpire: concernPerson?.passportExpire,
    email: concernPerson?.email,
    phone: concernPerson?.phone,
  };

  const handleSubmit = async () => {
    try {
      setShowErrorDialog(true);
      await validationSchema().validate(body, { abortEarly: false });
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
    try {
      await validationSchema().validate(body, { abortEarly: false });
      setErrors({});

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to add this frequent traveler?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/clients`,
          body,
          jsonHeader()
        );

        if (response?.data?.success) {
          setIsLoading(false);
          showToast("success", response?.data?.message, () =>
            navigate("/dashboard/clientProfile/active")
          );
        }
      }
    } catch (e) {
      setIsLoading(false);
      showToast("error", e.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setShowErrorDialog(false);
  };

  const filterOption = (option, inputValue) => {
    return option.data.name.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <Box
      sx={{
        borderRadius: from === "passengerBox" ? "10px" : "0",
      }}
    >
      <Box>
        {from !== "passengerBox" && (
          <PageTitle title={"Add Traveler"} />
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            // minHeight: "calc(94vh - 200px)",
            bgcolor: "#ffffff",
          }}
        >
          {from === "passengerBox" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 500,
                  color: "var(--secondary-color)",
                }}
              >
                Save This Traveller
              </Typography>
              <CloseIcon
                sx={{ color: "var(--primary-color)", cursor: "pointer" }}
                onClick={() => setOpenClientModal(false)}
              />
            </Box>
          )}
          <Box sx={{ mt: "20px" }}>
            {from !== "passengerBox" && (
              <Box
                sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "3px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onClick={handleOpen}
                >
                  <CloudUploadIcon
                    sx={{ mb: "2px", color: "var(--primary-color)" }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "var(--primary-color)",
                    fontSize: "18px",
                    textDecoration: "underline",
                  }}
                >
                  Scan Your Passport to fill the informations
                </Typography>
              </Box>
            )}

            <Typography
              sx={{ fontWeight: 500, color: "var(--dark-gray)", mb: 2 }}
            >
              Personal Information
            </Typography>
            <Grid container columnSpacing={2.5} rowSpacing={2.5}>
              {/* First Name */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={concernPerson?.firstName || ""}
                    {...textFieldProps("firstName", "First Name")}
                    onChange={(e) =>
                      handleOnChange("firstName", e.target.value)
                    }
                    sx={sharedInputStyles}
                    InputProps={{
                      readOnly: from === "passengerBox",
                    }}
                  />

                  {errors?.firstName && (
                    <span style={registrationErrText}>{errors.firstName}</span>
                  )}
                </Box>
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={concernPerson?.lastName || ""}
                    {...textFieldProps("lastName", "Last Name")}
                    onChange={(e) => handleOnChange("lastName", e.target.value)}
                    sx={sharedInputStyles}
                    InputProps={{
                      readOnly: from === "passengerBox",
                    }}
                  />
                  {errors?.lastName && (
                    <span style={registrationErrText}>{errors.lastName}</span>
                  )}
                </Box>
              </Grid>

              {/* Gender */}
              <Grid item xs={12} sm={6} md={4}>
                <Select
                  value={
                    concernPerson?.gender
                      ? {
                          label: concernPerson?.gender,
                          value: concernPerson?.gender,
                        }
                      : null
                  }
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]}
                  isSearchable={true}
                  isMulti={false}
                  placeholder="SELECT GENDER"
                  styles={customStyles}
                  onChange={(selectedOption) =>
                    setConcernPerson((prevState) => ({
                      ...prevState,
                      gender: selectedOption?.value || null,
                    }))
                  }
                />
              </Grid>

              {/* Date Of Birth */}
              <Grid item xs={12} sm={6} md={4}>
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
                            : concernPerson?.dateOfBirth && "#00000099",
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: openCal
                            ? "#8BB6CC"
                            : concernPerson?.dateOfBirth &&
                              "var(--border-color)",
                        },
                      },
                    }}
                  >
                    <TextField
                      {...textFieldProps("dateOfBirth", "Date of Birth")}
                      value={
                        concernPerson?.dateOfBirth
                          ? moment(concernPerson?.dateOfBirth).format(
                              "DD MMM YYYY"
                            )
                          : ""
                      }
                      sx={sharedInputStyles}
                      onClick={() => setOpenCal(true)}
                      focused={openCal || concernPerson?.dateOfBirth}
                      InputProps={{
                        readOnly: from === "passengerBox",
                      }}
                    />
                    {errors?.dateOfBirth && (
                      <span style={registrationErrText}>
                        {errors.dateOfBirth}
                      </span>
                    )}
                    {openCal && from !== "passengerBox" && (
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
                          date={concernPerson?.dateOfBirth || new Date()}
                          maxDate={new Date()}
                          title={"Date of Birth"}
                          handleChange={(date) => {
                            handleOnChange(
                              "dateOfBirth",
                              moment(date).format("YYYY-MM-DD")
                            );
                            setOpenCal(!openCal);
                          }}
                          months={1}
                        />
                      </Box>
                    )}
                  </Box>
                </ClickAwayListener>
              </Grid>

              {/* Nationality */}
              <Grid item xs={12} sm={6} md={4} sx={{ position: "relative" }}>
                <Select
                  value={
                    concernPerson?.passportNation
                      ? options.find(
                          (option) =>
                            option.code === concernPerson?.passportNation
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleOnChange("passportNation", selectedOption)
                  }
                  options={options}
                  isSearchable={true}
                  isMulti={false}
                  placeholder="SELECT NATIONALITY"
                  styles={customStyles}
                  filterOption={filterOption}
                />
                {errors?.passportNation && (
                  <span
                    style={{
                      fontSize: "10.5px",
                      color: "red",
                      letterSpacing: "0.8px",
                    }}
                  >
                    {errors.passportNation}
                  </span>
                )}
              </Grid>

              {/* Passport Number */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={concernPerson?.passportNumber || ""}
                    {...textFieldProps("passportNumber", "Passport Number")}
                    onChange={(e) =>
                      handleOnChange("passportNumber", e.target.value)
                    }
                    sx={sharedInputStyles}
                    InputProps={{
                      readOnly: from === "passengerBox",
                    }}
                  />
                  {errors?.passportNumber && (
                    <span style={registrationErrText}>
                      {errors.passportNumber}
                    </span>
                  )}
                </Box>
              </Grid>

              {/* Passport Expire */}
              <Grid item xs={12} sm={6} md={4}>
                <ClickAwayListener
                  onClickAway={() =>
                    openPassportCal && setOpenPassportCal(false)
                  }
                >
                  <Box
                    sx={{
                      position: "relative",
                      "& .MuiInputLabel-root": {
                        "&.Mui-focused": {
                          color: openPassportCal
                            ? "var(--primary-color)"
                            : concernPerson?.passportExpire && "#00000099",
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: openPassportCal
                            ? "#8BB6CC"
                            : concernPerson?.passportExpire &&
                              "var(--border-color)",
                        },
                      },
                    }}
                  >
                    <TextField
                      {...textFieldProps(
                        "passportExpire",
                        "Passport Expire Date"
                      )}
                      value={
                        concernPerson?.passportExpire
                          ? moment(concernPerson?.passportExpire).format(
                              "DD MMM YYYY"
                            )
                          : ""
                      }
                      sx={sharedInputStyles}
                      onClick={() => setOpenPassportCal(!openPassportCal)}
                      focused={openPassportCal || concernPerson?.passportExpire}
                      InputProps={{
                        readOnly: from === "passengerBox",
                      }}
                    />
                    {errors?.passportExpire && (
                      <span style={registrationErrText}>
                        {errors.passportExpire}
                      </span>
                    )}
                    {openPassportCal && from !== "passengerBox" && (
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
                          date={concernPerson?.passportExpire || new Date()}
                          minDate={new Date()}
                          title={"Passport Expiry Date"}
                          handleChange={(date) => {
                            handleOnChange(
                              "passportExpire",
                              moment(date).format("YYYY-MM-DD")
                            );
                            setOpenPassportCal(false);
                          }}
                          months={1}
                        />
                      </Box>
                    )}
                  </Box>
                </ClickAwayListener>
              </Grid>

              {/* Passport Iamge */}
              <Grid item xs={12} sm={6} md={6}></Grid>
              {concernPerson?.passportCopy && (
                <Grid item xs={12} sm={6} md={5}>
                  <ImageUploadFile
                    label={"Passport Copy"}
                    documentType={"passport"}
                    copyFile={concernPerson?.passportCopy}
                  />
                </Grid>
              )}
            </Grid>

            <Typography
              sx={{ fontWeight: 500, color: "var(--dark-gray)", mt: 5, mb: 2 }}
            >
              Contact Information
            </Typography>

            <Grid container columnSpacing={2.5} rowSpacing={4}>
              {/* Nick Name */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={concernPerson?.nickName}
                    {...textFieldProps("nickName", "Nick Name")}
                    onChange={(e) => handleOnChange("nickName", e.target.value)}
                    sx={sharedInputStyles}
                  />
                  {errors?.nickName && (
                    <span style={registrationErrText}>{errors.nickName}</span>
                  )}
                </Box>
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={concernPerson?.email}
                    {...textFieldProps("email", "Email", "email")}
                    onChange={(e) => handleOnChange("email", e.target.value)}
                    sx={sharedInputStyles}
                  />
                  {errors?.email && (
                    <span style={registrationErrText}>{errors?.email}</span>
                  )}
                </Box>
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ position: "relative" }}>
                  <Typography sx={phoneInputLabel}>Phone Number *</Typography>
                  <PhoneInput
                    inputStyle={{
                      width: "100%",
                      height: "100%",
                    }}
                    value={concernPerson?.phone || ""}
                    country={"bd"}
                    countryCodeEditable={false}
                    onChange={(phone) => handleOnChange("phone", phone)}
                    disableDropdown
                  />
                  {errors?.phone && (
                    <span style={registrationErrText}>{errors.phone}</span>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Button
            disabled={isLoading}
            sx={{
              ...depositBtn,
              display: "flex",
              alignItems: "center",
              justifyContent: isLoading ? "space-between" : "flex-start",
              gap: isLoading ? "8px" : "0",
              textAlign: isLoading ? "center" : "left",
              paddingRight: isLoading ? "16px" : "0",
            }}
            onClick={() => {
              if (from === "passengerBox") {
                setOpenClientModal(false);
                handleFrequentFlyerChange(
                  frequentPax?.type,
                  frequentPax?.count
                );
              }
              handleSubmit();
            }}
          >
            {isLoading ? (
              <>
                {from === "passengerBox"
                  ? concernPerson?.frequentTraveler
                    ? "Close Traveler Advanced"
                    : "Add Traveler Advanced"
                  : "Add Traveler"}
                <CircularProgress size={20} color="inherit" />
              </>
            ) : from === "passengerBox" ? (
              concernPerson?.frequentTraveler ? (
                "Close Traveler"
              ) : (
                "Add Traveler"
              )
            ) : (
              "Add Traveler"
            )}
          </Button>
        </Box>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />

      <ClientPassportScan
        open={open}
        handleClose={() => setOpen(false)}
        departureDate={new Date()}
        setConcernPerson={setConcernPerson}
      />

      {showErrorDialog && (
        <ErrorDialog
          errors={errors}
          data={body}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type={"For Adding Client"}
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing To Update Your Request"}
      />
    </Box>
  );
};

const validationSchema = () => {
  return Yup.object({
    nickName: personNameValidation("Nick Name").required(
      "Nick Name is required"
    ),
    firstName: personNameValidation("First Name").required(
      "First Name is required"
    ),
    lastName: personNameValidation("Last Name").required(
      "Last Name is required"
    ),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.string().required("Date of Birth is required"),
    passportExpire: Yup.string().required("Passport Expiry Date is required"),
    passportNumber: Yup.string().required("Passport Number is required"),
    passportNation: Yup.string().required("Nationality is required"),
    phone: phoneValidation("Phone").required("Phone is required"),
    email: emailValidation("").required("Email is required"),
  });
};

export default AddClient;
