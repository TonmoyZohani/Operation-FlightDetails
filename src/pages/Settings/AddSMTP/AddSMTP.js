import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import CustomAlert from "../../../component/Alert/CustomAlert";
import CustomToast from "../../../component/Alert/CustomToast";
import RequiredIndicator from "../../../component/Common/RequiredIndicator";
import ErrorDialog from "../../../component/Dialog/ErrorDialog";
import SmallLoadingSpinner from "../../../component/Loader/SmallLoadingSpinner";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import { textFieldProps } from "../../../shared/common/functions";
import PageTitle from "../../../shared/common/PageTitle";
import {
  depositBtn,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import CustomLoadingAlert from "../../../component/Alert/CustomLoadingAlert";

const selectOption = [
  "booking",
  "ticketed",
  "refund",
  "reissue",
  "void",
  "cancelled",
  "support",
];

const AddSMTP = () => {
  const { jsonHeader } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [emailProvider, setEmailProvider] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  //TODO:: Fetching data from api
  const { data: emailProviders } = useQuery({
    queryKey: ["emailProviders"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/smtp/email-providers`,
        jsonHeader()
      );
      return data?.data;
    },
  });

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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setServices(typeof value === "string" ? value.split(",") : value);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const body = {
    providerId: emailProvider?.id,
    email: email,
    password: password,
    purposes: services,
  };

  const handleAddSMTP = async () => {
    try {
      setShowErrorDialog(true);
      await validationSchema.validate(body, {
        abortEarly: false,
      });
      setErrors({});
    } catch (e) {
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
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure you want to Add SMTP Email?",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoading(true);

    try {
      await validationSchema.validate(body, {
        abortEarly: false,
      });
      setErrors({});
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/smtp`,
        body,
        jsonHeader()
      );

      if (response?.data?.success) {
        CustomAlert({
          success: response?.data?.success,
          message: response?.data?.message,
        });

        navigate("/dashboard/emailConfiguration");
      }
    } catch (e) {
      showToast("error", e.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
  };

  return (
    <Box sx={{ borderRadius: "10px" }}>
      <PageTitle title={"SMTP Server Management"} />

      <Box
        sx={{
          width: "100%",
          bgcolor: "#fff",
          px: "22px",
          py: "15px",
          minHeight: "73vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "0 0 10px 10px",
        }}
      >
        <Grid container columnSpacing={2.5} rowSpacing={4}>
          {/* Select service */}
          <Grid item md={4}>
            <Box sx={{ position: "relative" }}>
              <FormControl fullWidth size="small" sx={sharedInputStyles}>
                <InputLabel id="emailProvider-select-label">
                  Select email provider
                </InputLabel>
                <Select
                  labelId="emailProvider-select-label"
                  defaultValue={emailProvider?.name || ""}
                  name="emailProvider"
                  label="Select email provider"
                  onChange={(e) => {
                    setEmailProvider(e.target.value);
                    validateField("emailProvider", e.target.value);
                  }}
                  MenuProps={{ disableScrollLock: true }}
                >
                  {emailProviders?.map((provider) => (
                    <MenuItem key={provider?.id} value={provider}>
                      {provider?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <span style={registrationErrText}>{errors?.providerId}</span>
            </Box>
          </Grid>

          {/* User Email */}
          <Grid item md={4}>
            <Box sx={{ position: "relative" }}>
              <TextField
                {...textFieldProps("email", "User Email", "email")}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField("email", e.target.value);
                }}
                sx={sharedInputStyles}
                autoComplete="off"
              />
              <span style={registrationErrText}>{errors?.email}</span>
            </Box>
          </Grid>

          {/* Password */}
          <Grid item md={4}>
            <Box sx={{ position: "relative" }}>
              <TextField
                {...textFieldProps(
                  "password",
                  "User Password",
                  `${showPassword ? "text" : "password"}`
                )}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
                sx={sharedInputStyles}
              />
              {!showPassword ? (
                <VisibilityIcon
                  sx={{
                    position: "absolute",
                    cursor: "pointer",
                    right: "7px",
                    bottom: "7px",
                    color: "var(--secondary-color)",
                  }}
                  onClick={() => handleShowPassword()}
                />
              ) : (
                <VisibilityOffIcon
                  sx={{
                    position: "absolute",
                    cursor: "pointer",
                    right: "7px",
                    bottom: "7px",
                    color: "var(--secondary-color)",
                  }}
                  onClick={() => handleShowPassword()}
                />
              )}
              <span style={registrationErrText}>{errors?.password}</span>
            </Box>
          </Grid>

          {/* Select service */}
          <Grid item md={4}>
            <Box sx={{ position: "relative" }}>
              <FormControl fullWidth size="small" sx={sharedInputStyles}>
                <InputLabel id="service-select-label">Select for</InputLabel>
                <Select
                  labelId="service-select-label"
                  value={services || ""}
                  name="service"
                  label="Select for"
                  multiple
                  onChange={handleChange}
                  MenuProps={{ disableScrollLock: true }}
                >
                  {selectOption.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <span style={registrationErrText}>{errors?.purposes}</span>
            </Box>
          </Grid>
        </Grid>
        <Box>
          <Link
            to={
              "https://storage.googleapis.com/flyfar-user-document-bucket/user-doc/SMTP_SUGGESTION.pdf"
            }
            target="_blank"
            style={{
              color: "var(--primary-color)",
              textDecoration: "none",
              fontSize: {
                xs: "14px",
                md: "16px",
              },
            }}
          >
            How To add and Configure SMTP Email ?
          </Link>
        </Box>

        <Box>
          <FormControlLabel
            control={
              <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
            }
            label={
              <Typography
                sx={{
                  lineHeight: "1rem",
                  fontSize: {
                    xs: "14px",
                    md: "16px",
                  },
                  mt: {
                    lg: 0.4,
                  },
                }}
              >
                I have read and agree to the{" "}
                <Link
                  target="_blank"
                  to="/terms-and-conditions"
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                  }}
                >
                  Terms & Conditions
                </Link>
                {" , "}
                <Link
                  target="_blank"
                  to="/privacy-policy"
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                  }}
                >
                  Privacy Policy
                </Link>
                {" & "}
                <Link
                  target="_blank"
                  to="/refund-cancelation-policy"
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                  }}
                >
                  Refund Policy.
                </Link>{" "}
                <RequiredIndicator />
              </Typography>
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                color: "var(--secondary-color)",
              },
              mt: 2,
            }}
          />

          <Button
            type="submit"
            disabled={!isChecked || isLoading}
            sx={{
              ...depositBtn,
              display: "flex",
              alignItems: "center",
              justifyContent: isLoading ? "space-between" : "flex-start",
              gap: isLoading ? "8px" : "0",
              textAlign: isLoading ? "center" : "left",
              paddingRight: isLoading ? "16px" : "0",
              fontSize: { md: "14px", xs: "11px" },
            }}
            onClick={handleAddSMTP}
          >
            {isLoading ? <SmallLoadingSpinner /> : `Add SMTP Email`}
          </Button>
        </Box>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />

      {showErrorDialog && (
        <ErrorDialog
          errors={errors}
          data={{ ...body, providerId: emailProvider?.name }}
          onSubmit={onSubmit}
          handleClose={handleClose}
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your New SMTP Email Add Request"}
        // subTitle={" BDT"}
      />
    </Box>
  );
};

const validationSchema = Yup.object({
  providerId: Yup.string().required("Email Provider is required"),
  purposes: Yup.array()
    .of(Yup.string().required("Each purpose is required"))
    .min(1, "At least one purpose is required")
    .required("Purpose is required"),
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
});

export default AddSMTP;
