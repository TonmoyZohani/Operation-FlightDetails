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
import moment from "moment";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import PhoneInput from "react-phone-input-2";
import { useParams } from "react-router-dom";
import useFetcher from "../../../hook/useFetcher";
import useToast from "../../../hook/useToast";
import { textFieldProps } from "../../../shared/common/functions";
import {
  depositBtn,
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import CustomAlert from "../../Alert/CustomAlert";
import CustomLoadingAlert from "../../Alert/CustomLoadingAlert";
import CustomToast from "../../Alert/CustomToast";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";
import Nationality from "../../Register/Nationality";
import { maxDOB, validateField } from "../AddBranch";

const ConcernPerson = forwardRef(
  ({ branch, branchStatus, errors, setErrors }, ref) => {
    const params = useParams();
    const [openCal, setOpenCal] = useState(false);
    const [concernInfo, setConcernInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const { patchFetcher } = useFetcher();
    const { openToast, message, severity, showToast, handleCloseToast } =
      useToast();

    useEffect(() => {
      if (!params?.id) return;

      const branchManager = branch?.branchManager || {};
      const user = branch?.user || {};

      setConcernInfo({
        branchManagerFirstName:
          user?.firstName || branch?.tempUser?.firstName || "",
        branchManagerLastName:
          user?.lastName || branch?.tempUser?.lastName || "",
        branchManagerGender: branchManager?.gender || "",
        branchManagerDOB: branchManager?.dob || "",
        branchManagerEmail: user?.email || branch?.tempUser?.email || "",
        branchManagerPhoneNumber: user?.phone || branch?.tempUser?.phone || "",
        branchManagerNationality: branchManager?.nationality || "",
      });
    }, [params?.id, branch]);

    const handleOnChange = (name, value) => {
      setConcernInfo({
        ...concernInfo,
        [name]: value,
      });
      validateField(name, value, setErrors, null, null);
    };

    useImperativeHandle(ref, () => ({
      getState: () => concernInfo,
    }));

    const handleUpdate = async () => {
      try {
        const result = await CustomAlert({
          success: "warning",
          message: `Are you sure? you want to Update this branch Manager?`,
        });

        const endPoint = `/api/v1/user/branches/update/branch-manager/${params?.id}`;

        const body = {
          branchManagerFirstName: concernInfo?.branchManagerFirstName,
          branchManagerLastName: concernInfo?.branchManagerLastName,
          branchManagerGender: concernInfo?.branchManagerGender,
          branchManagerDOB: concernInfo?.branchManagerDOB,
          branchManagerEmail: concernInfo?.branchManagerEmail,
          branchManagerPhoneNumber: concernInfo?.branchManagerPhoneNumber,
          branchManagerNationality: concernInfo?.branchManagerNationality,
        };

        if (result.isConfirmed) {
          setIsLoading(true);
          const response = await patchFetcher({ endPoint, body });

          if (response?.success) {
            showToast("success", response?.message);
          } else {
            showToast("error", response?.message);
          }
        }
      } catch (e) {
        const message =
          e?.response?.data?.message || "An error occurred while updating";
        showToast("error", message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: params?.id ? 3 : 0,
            mb: 2,
          }}
        >
          <Typography sx={{ fontWeight: 500, color: "var(--dark-gray)" }}>
            Branch Manager Information
          </Typography>
          {params?.id && (
            <Box onClick={() => setIsEditable((prev) => !prev)}>
              {branchStatus !== "waiting for approval" && (
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
              )}
            </Box>
          )}
        </Box>
        <Grid container columnSpacing={2.5} rowSpacing={4}>
          {/* FirstName */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={concernInfo?.branchManagerFirstName}
                {...textFieldProps("branchManagerFirstName", "First Name")}
                onChange={(e) =>
                  handleOnChange("branchManagerFirstName", e.target.value)
                }
                sx={sharedInputStyles}
                disabled={params?.id ? !isEditable : false}
              />
              {errors?.branchManagerFirstName && (
                <span style={registrationErrText}>
                  {errors.branchManagerFirstName}
                </span>
              )}
            </Box>
          </Grid>

          {/* LastName */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={concernInfo?.branchManagerLastName}
                {...textFieldProps("branchManagerLastName", "Last Name")}
                onChange={(e) =>
                  handleOnChange("branchManagerLastName", e.target.value)
                }
                sx={sharedInputStyles}
                disabled={params?.id ? !isEditable : false}
              />
              {errors?.branchManagerLastName && (
                <span style={registrationErrText}>
                  {errors.branchManagerLastName}
                </span>
              )}
            </Box>
          </Grid>

          {/* Gender */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <FormControl fullWidth size="small" sx={sharedInputStyles}>
                <InputLabel>Select Gender *</InputLabel>
                <Select
                  value={concernInfo?.branchManagerGender || ""}
                  {...textFieldProps("branchManagerGender", "Select Gender")}
                  onChange={(e) =>
                    handleOnChange("branchManagerGender", e.target.value)
                  }
                  MenuProps={{ disableScrollLock: true }}
                  disabled={params?.id ? !isEditable : false}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
              {errors?.branchManagerGender && (
                <span style={registrationErrText}>
                  {errors.branchManagerGender}
                </span>
              )}
            </Box>
          </Grid>

          {/* Date Of Birth */}
          <Grid item md={4} sm={6} xs={12}>
            <ClickAwayListener onClickAway={() => openCal && setOpenCal(false)}>
              <Box
                sx={{
                  position: "relative",
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: openCal
                        ? "var(--primary-color)"
                        : concernInfo?.branchManagerDOB && "#00000099",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: openCal
                        ? "#8BB6CC"
                        : concernInfo?.branchManagerDOB &&
                          "var(--border-color)",
                    },
                  },
                }}
              >
                <TextField
                  value={
                    concernInfo?.branchManagerDOB &&
                    moment(concernInfo?.branchManagerDOB, "YYYY-MM-DD").format(
                      "DD MMMM YYYY"
                    )
                  }
                  {...textFieldProps("branchManagerDOB", "Date of Birth")}
                  sx={sharedInputStyles}
                  onClick={() => setOpenCal(!openCal)}
                  focused={openCal || concernInfo?.branchManagerDOB}
                  disabled={params?.id ? !isEditable : false}
                />
                {errors?.branchManagerDOB && (
                  <span style={registrationErrText}>
                    {errors.branchManagerDOB}
                  </span>
                )}
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
                      date={
                        concernInfo?.branchManagerDOB
                          ? concernInfo?.branchManagerDOB
                          : maxDOB
                      }
                      maxDate={maxDOB}
                      title={"Date of Birth"}
                      onChange={(e) => handleOnChange("gender", e.target.value)}
                      handleChange={(date) => {
                        handleOnChange(
                          "branchManagerDOB",
                          moment(date).format("YYYY-MM-DD")
                        );
                        setOpenCal(false);
                      }}
                    />
                  </Box>
                )}
              </Box>
            </ClickAwayListener>
          </Grid>

          {/* Nationality */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Nationality
                nationality={concernInfo?.branchManagerNationality}
                handleChangeNationality={(nationality) =>
                  handleOnChange("branchManagerNationality", nationality)
                }
                placeholder="Select Nationality"
                isDisabled={params?.id ? !isEditable : false}
              />
              {errors?.branchManagerNationality && (
                <span style={registrationErrText}>
                  {errors.branchManagerNationality}
                </span>
              )}
            </Box>
          </Grid>

          {/* Email */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                value={concernInfo?.branchManagerEmail}
                {...textFieldProps("branchManagerEmail", "Email", "email")}
                onChange={(e) =>
                  handleOnChange("branchManagerEmail", e.target.value)
                }
                sx={sharedInputStyles}
                disabled={params?.id ? !isEditable : false}
              />
              {errors?.branchManagerEmail && (
                <span style={registrationErrText}>
                  {errors?.branchManagerEmail}
                </span>
              )}
            </Box>
          </Grid>

          {/* Phone Number */}
          <Grid item md={4} sm={6} xs={12}>
            <Box sx={{ position: "relative" }}>
              <Typography sx={phoneInputLabel}>Phone Number</Typography>
              <PhoneInput
                inputStyle={{ width: "100%", height: "100%" }}
                value={concernInfo?.branchManagerPhoneNumber}
                country={"bd"}
                countryCodeEditable={false}
                onChange={(value) =>
                  handleOnChange("branchManagerPhoneNumber", value)
                }
                label="Phone Number"
                disabled={params?.id ? !isEditable : false}
                disableDropdown
              />
              {errors?.branchManagerPhoneNumber && (
                <span style={registrationErrText}>
                  {errors.branchManagerPhoneNumber}
                </span>
              )}
            </Box>
          </Grid>
        </Grid>

        {params?.id && (
          <Box>
            <Button
              disabled={isLoading}
              sx={{
                ...depositBtn,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 0,
                textAlign: "left",
                paddingRight: 0,
              }}
              onClick={handleUpdate}
            >
              Update Branch Manager
            </Button>
          </Box>
        )}

        <CustomToast
          open={openToast}
          onClose={handleCloseToast}
          message={message}
          severity={severity}
        />

        <CustomLoadingAlert
          open={isLoading}
          text={"We Are Processing Your Branch Information Update Request"}
        />
      </Box>
    );
  }
);

export default ConcernPerson;
