import CloseIcon from "@mui/icons-material/Close";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import {
  Box,
  ClickAwayListener,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import PhoneInput from "react-phone-input-2";
import { useParams } from "react-router-dom";
import Nationality from "../../../component/Register/Nationality";
import { textFieldProps } from "../../../shared/common/functions";
import {
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import { maxDOB, validateField } from "../AddStaff";
import CustomCalendar from "../../../component/CustomCalendar/CustomCalendar";

const ConcernPerson = forwardRef(
  ({ staff, errors, setErrors, setIsEditable, isEditable }, ref) => {
    const params = useParams();
    const [openCal, setOpenCal] = useState(false);
    const [concernPerson, setConcernPerson] = useState({});

    useEffect(() => {
      setConcernPerson({
        firstName: params?.id ? staff?.user?.firstName : "",
        lastName: params?.id ? staff?.user?.lastName : "",
        gender: params?.id ? staff?.gender : "",
        dateOfBirth: params?.id ? staff?.dateOfBirth : "",
        nationality: params?.id ? staff?.nationality : "Bangladesh",
        phone: params?.id ? staff?.phone : "",
        email: params?.id ? staff?.email : "",
      });
    }, [params?.id]);

    const handleOnChange = (name, value) => {
      setConcernPerson({
        ...concernPerson,
        [name]: value,
      });
      validateField(name, value, setErrors, null, null);
    };

    useImperativeHandle(ref, () => ({
      getState: () => ({
        concernPerson,
        errors,
        setErrors,
      }),
    }));

    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontWeight: 500, color: "var(--dark-gray)" }}>
            Staff Information
          </Typography>
          {params?.id && (
            <Box onClick={() => setIsEditable((prev) => !prev)}>
              <Typography
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
                  height: "32px",
                }}
              >
                <span style={{ fontSize: "13px", lineHeight: "1" }}>
                  {isEditable ? "Click to Close" : "Click to Update"}
                </span>
                {isEditable ? (
                  <CloseIcon sx={{ fontSize: "18px" }} />
                ) : (
                  <EditCalendarIcon sx={{ fontSize: "18px", p: 0.25 }} />
                )}
              </Typography>
            </Box>
          )}
        </Box>
        <Grid container columnSpacing={2.5} rowSpacing={4}>
          {/* First Name */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={concernPerson?.firstName}
                {...textFieldProps("firstName", "First Name")}
                onChange={(e) => handleOnChange("firstName", e.target.value)}
                sx={sharedInputStyles}
                disabled={params?.id ? !isEditable : false}
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
                value={concernPerson?.lastName}
                {...textFieldProps("lastName", "Last Name")}
                onChange={(e) => handleOnChange("lastName", e.target.value)}
                sx={sharedInputStyles}
                disabled={params?.id ? !isEditable : false}
              />
              {errors?.lastName && (
                <span style={registrationErrText}>{errors.lastName}</span>
              )}
            </Box>
          </Grid>

          {/* Gender */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ position: "relative" }}>
              <FormControl
                fullWidth
                size="small"
                sx={sharedInputStyles}
                disabled={params?.id ? !isEditable : false}
              >
                <InputLabel>Select Gender *</InputLabel>
                <Select
                  {...textFieldProps("gender", "Select Gender")}
                  onChange={(e) => handleOnChange("gender", e.target.value)}
                  MenuProps={{ disableScrollLock: true }}
                  value={concernPerson?.gender || ""}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
              {errors?.gender && (
                <span style={registrationErrText}>{errors.gender}</span>
              )}
            </Box>
          </Grid>

          {/* Date Of Birth */}
          <Grid item xs={12} sm={6} md={4}>
            <ClickAwayListener onClickAway={() => openCal && setOpenCal(false)}>
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
                        : concernPerson?.dateOfBirth && "var(--border-color)",
                    },
                  },
                }}
              >
                <TextField
                  {...textFieldProps("dateOfBirth", "Date of Birth")}
                  value={
                    concernPerson?.dateOfBirth
                      ? moment(concernPerson?.dateOfBirth).format("DD MMM YYYY")
                      : ""
                  }
                  sx={sharedInputStyles}
                  disabled={params?.id ? !isEditable : false}
                  onClick={() => setOpenCal(!openCal)}
                  focused={openCal || concernPerson?.dateOfBirth}
                />
                {errors?.dateOfBirth && (
                  <span style={registrationErrText}>{errors.dateOfBirth}</span>
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
                    <CustomCalendar
                      date={concernPerson?.dateOfBirth || maxDOB}
                      maxDate={maxDOB}
                      title={"Date of Birth"}
                      handleChange={(date) => {
                        handleOnChange(
                          "dateOfBirth",
                          moment(date).format("YYYY-MM-DD")
                        );
                        setOpenCal(false);
                      }}
                      months={1}
                    />
                  </Box>
                )}
              </Box>
            </ClickAwayListener>
          </Grid>

          {/* Nationality */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ position: "relative" }}>
              <Nationality
                nationality={concernPerson?.nationality || ""}
                handleChangeNationality={(e) =>
                  handleOnChange("nationality", e)
                }
                placeholder="Select Nationality"
                isDisabled={true}
                // isDisabled={params?.id ? !isEditable : false}
              />
              {errors?.nationality && (
                <span style={registrationErrText}>{errors.nationality}</span>
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
                disabled={params?.id ? !isEditable : false}
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
                disabled={params?.id ? !isEditable : false}
                disableDropdown
              />
              {errors?.phone && (
                <span style={registrationErrText}>{errors.phone}</span>
              )}
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default ConcernPerson;
