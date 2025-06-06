import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import PhoneInput from "react-phone-input-2";
import { useParams } from "react-router-dom";
import FileUpload from "../../../component/AirBooking/FileUpload";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";
import CustomToast from "../../../component/Alert/CustomToast";
import { buttonStyleEye } from "../../../component/Register/GeneraInfo";
import useFetcher from "../../../hook/useFetcher";
import useToast from "../../../hook/useToast";
import { textFieldProps } from "../../../shared/common/functions";
import {
  phoneInputLabel,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import { sectionTitle, validateField } from "../AddStaff";
import StaffCredentials from "./StaffCredentials";

const OfficialInfo = forwardRef(
  ({ staff, errors, setErrors, isEditable, activeTab }, ref) => {
    const params = useParams();
    const queryClient = useQueryClient();
    const { patchFetcher } = useFetcher();
    const [passShow, setPassShow] = useState(false);
    const [officialInfo, setOfficialInfo] = useState({});
    const [fileUploading, setFileUploading] = useState(false);
    const { openToast, message, severity, showToast, handleCloseToast } =
      useToast();

    useEffect(() => {
      if (params?.id) {
        setOfficialInfo({
          department: params?.id
            ? !departments.some((d) => d.value === staff?.department)
              ? "others"
              : staff?.department
            : "",
          ...(params?.id ? { otherDept: staff?.department } : {}),
          designation: params?.id ? staff?.designation : "",
          photo: params?.id ? staff?.photo : null,
          nidFront: params?.id ? staff?.nidFront : null,
          nidBack: params?.id ? staff?.nidBack : null,
          verificationDocument: params?.id ? staff?.verificationDocument : null,
          loginPhone: params?.id ? staff?.loginPhone : "",
          loginEmail: params?.id ? staff?.loginEmail : "",
          loginPassword: "",
        });
      }
    }, [params?.id, staff]);

    const handleOnChange = (name, value) => {
      setOfficialInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
      validateField(name, value, setErrors);
    };

    const handleFileChange = async (value, name) => {
      if (params?.id) {
        try {
          const formData = new FormData();
          formData.append("image", value);
          formData.append("fieldName", name);
          const endPoint = `/api/v1/user/staffs/update/image/${params?.id}`;
          setFileUploading(true);
          const response = await patchFetcher({
            endPoint,
            body: formData,
            contentType: "multipart/form-data",
          });
          if (response?.success) {
            showToast("success", response?.message);
            queryClient.invalidateQueries(["staff"]);
          }
        } catch (error) {
          console.error(error);
          showToast("error", error?.response?.data?.message);
        } finally {
          setFileUploading(false);
        }
      } else {
        handleOnChange(name, value);
      }
    };

    useImperativeHandle(ref, () => ({
      getState: () => officialInfo,
    }));

    return (
      <>
        {activeTab === 0 && (
          <>
            <Typography sx={sectionTitle}>Official Information</Typography>
            <Grid container columnSpacing={2.5} rowSpacing={4}>
              {/* Department */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ position: "relative" }}>
                  {/* <TextField
                    value={officialInfo?.department}
                    {...textFieldProps("department", "Department")}
                    onChange={(e) =>
                      handleOnChange("department", e.target.value)
                    }
                    sx={sharedInputStyles}
                    disabled={params?.id ? !isEditable : false}
                  /> */}

                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <InputLabel id="department-select-label">
                      Select Department
                    </InputLabel>
                    <Select
                      disabled={params?.id ? !isEditable : false}
                      labelId="department-select-label"
                      value={officialInfo?.department || ""}
                      name="department"
                      label="Select Department"
                      onChange={(e) =>
                        handleOnChange("department", e.target.value)
                      }
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {errors?.department && (
                    <span style={registrationErrText}>
                      {errors?.department}
                    </span>
                  )}
                </Box>
              </Grid>

              {officialInfo?.department === "others" && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      value={officialInfo?.otherDept}
                      {...textFieldProps("otherDept", "Department Name")}
                      onChange={(e) =>
                        handleOnChange("otherDept", e.target.value)
                      }
                      sx={sharedInputStyles}
                      disabled={params?.id ? !isEditable : false}
                    />
                    {errors?.otherDept && (
                      <span style={registrationErrText}>
                        {errors.otherDept}
                      </span>
                    )}
                  </Box>
                </Grid>
              )}

              {/* Designation */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    value={officialInfo?.designation}
                    {...textFieldProps("designation", "Designation")}
                    onChange={(e) =>
                      handleOnChange("designation", e.target.value)
                    }
                    sx={sharedInputStyles}
                    disabled={params?.id ? !isEditable : false}
                  />
                  {errors?.designation && (
                    <span style={registrationErrText}>
                      {errors.designation}
                    </span>
                  )}
                </Box>
              </Grid>

              {/* <Grid item xs={12}>
                {params?.id && (
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(event) =>
                            setIsChecked(event.target.checked)
                          }
                        />
                      }
                      label={
                        <>
                          I have read and agree to the{" "}
                          <Link
                            to="/terms-and-conditions"
                            target="_blank"
                            style={{
                              color: "var(--primary-color)",
                              textDecoration: "none",
                            }}
                          >
                            Terms and Conditions
                          </Link>{" "}
                          &
                          <Link
                            to="/privacy-policy"
                            target="_blank"
                            style={{
                              color: "var(--primary-color)",
                              textDecoration: "none",
                            }}
                          >
                            {" "}
                            Privacy Policy{" "}
                          </Link>
                          <RequiredIndicator />
                        </>
                      }
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          color: "var(--secondary-color)",
                        },
                        mt: 2,
                      }}
                    />

                    <Button
                      disabled={!isChecked}
                      sx={{
                        ...depositBtn,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 0,
                        textAlign: "left",
                        paddingRight: 0,
                      }}
                      // onClick={handleSubmit}
                    >
                      Update Staff
                    </Button>
                  </Box>
                )}
              </Grid> */}
            </Grid>
          </>
        )}

        {/* ----------  Documents Start  ---------- */}

        {(activeTab === 1 || (!params?.id && activeTab === 0)) && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // mb: 2,
              }}
            >
              <Typography sx={{ ...sectionTitle, mt: 2 }}>Documents</Typography>
            </Box>

            <Grid container columnSpacing={2.5} rowSpacing={4}>
              {reqDocFields?.map((reqDoc, index) => {
                return (
                  <Grid key={index} item md={4} sm={6} xs={12}>
                    <Box sx={{ position: "relative" }}>
                      <FileUpload
                        id={reqDoc?.id}
                        label={reqDoc?.label}
                        previewImg={officialInfo[reqDoc?.name]}
                        onFileChange={(file) =>
                          handleFileChange(file, reqDoc?.name)
                        }
                      />
                      {reqDoc?.name && errors?.[reqDoc?.name] && (
                        <span style={registrationErrText}>
                          {errors[reqDoc?.name]}
                        </span>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}

        {!params?.id && (
          <Typography sx={sectionTitle}>Login Information</Typography>
        )}

        {/* ----------  Login Information start  ---------- */}
        {!params?.id && (
          <Grid container columnSpacing={2.5} rowSpacing={4}>
            {/* Phone no */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <Typography sx={phoneInputLabel}>Phone Number *</Typography>
                <PhoneInput
                  inputStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  country={"bd"}
                  countryCodeEditable={false}
                  value={officialInfo?.loginPhone}
                  onChange={(phone) => handleOnChange("loginPhone", phone)}
                  disableDropdown
                />
                {errors?.loginPhone && (
                  <span style={registrationErrText}>{errors.loginPhone}</span>
                )}
              </Box>
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={officialInfo?.loginEmail}
                  {...textFieldProps("loginEmail", "Email", "email")}
                  onChange={(e) => handleOnChange("loginEmail", e.target.value)}
                  sx={sharedInputStyles}
                />
                {errors?.loginEmail && (
                  <span style={registrationErrText}>{errors.loginEmail}</span>
                )}
              </Box>
            </Grid>

            {/* Password */}
            <Grid item md={4} sm={6} xs={12}>
              <Box
                sx={{
                  position: "relative",
                }}
              >
                <TextField
                  value={officialInfo?.loginPassword}
                  {...textFieldProps(
                    "loginPassword",
                    "Enter Password",
                    passShow ? "text" : "password"
                  )}
                  onChange={(e) =>
                    handleOnChange("loginPassword", e.target.value)
                  }
                  autoComplete="new-password"
                  sx={sharedInputStyles}
                />
                {errors?.loginPassword && (
                  <span style={registrationErrText}>
                    {errors.loginPassword}
                  </span>
                )}

                <button
                  type="button"
                  style={buttonStyleEye}
                  onClick={() => setPassShow((prev) => !prev)}
                >
                  {passShow ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                </button>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Staff Credentials */}
        {activeTab === 2 && <StaffCredentials staff={staff} />}

        <CustomToast
          open={openToast}
          onClose={handleCloseToast}
          message={message}
          severity={severity}
        />

        <CustomLoadingAlert
          open={fileUploading}
          text={"We Are Processing Uploading Request"}
        />
      </>
    );
  }
);

const reqDocFields = [
  {
    label: "Staff Photo",
    name: "photo",
  },
  {
    label: "Staff NID Front",
    name: "nidFront",
  },
  {
    label: "Staff NID Back",
    name: "nidBack",
  },
  {
    label: "Staff CV/TIN/VISITING CARD",
    name: "verificationDocument",
  },
];

const departments = [
  { value: "accounts", label: "Accounts Department" },
  { value: "reservations", label: "Reservations Department" },
  { value: "operations", label: "Operations Department" },
  { value: "support", label: "Support Department" },
  { value: "query", label: "Query Department" },
  { value: "tech", label: "Tech Department" },
  { value: "business-development", label: "Business Development Department" },
  { value: "admin", label: "Admin Department" },
  { value: "marketing", label: "Marketing Department" },
  { value: "others", label: "Others" },
];

export default OfficialInfo;
