import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Select from "react-select";

import * as Yup from "yup";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import {
  personNameValidation,
  textFieldProps,
} from "../../shared/common/functions";
import PageTitle from "../../shared/common/PageTitle";
import {
  depositBtn,
  registrationErrText,
  sharedInputStyles,
} from "../../shared/common/styles";
import useWindowSize from "../../shared/common/useWindowSize";
import { initialBank } from "../../shared/StaticData/CountryList";
import CustomAlert from "../Alert/CustomAlert";
import CustomLoadingAlert from "../Alert/CustomLoadingAlert";
import CustomToast from "../Alert/CustomToast";
import RequiredIndicator from "../Common/RequiredIndicator";
import ErrorDialog from "../Dialog/ErrorDialog";
import SmallLoadingSpinner from "../Loader/SmallLoadingSpinner";
import MobileHeader from "../MobileHeader/MobileHeader";
import { useQuery } from "@tanstack/react-query";

const AddBankAccount = () => {
  // const [banks] = useState(initialBank);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const { isMobile } = useWindowSize();
  const { jsonHeader } = useAuth();
  const navigate = useNavigate();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const { agentData } = useOutletContext();
  const bankManageOperation = agentData?.userAccess?.bankManagement;

  const { data: banks } = useQuery({
    queryKey: ["allBanks"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/common/banks`
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

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeBank = (value) => {
    setFormData((prev) => ({ ...prev, bankName: value }));
  };

  const handleAddBank = async () => {
    try {
      setShowErrorDialog(true);
      await validationSchema.validate(formData, {
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
    try {
      setShowErrorDialog(true);
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to add this bank account?",
      });
      if (result.isConfirmed) {
        setIsLoading(true);
        setShowErrorDialog(false);
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/user-banks`,
          formData,
          jsonHeader()
        );

        if (response?.data.success) {
          setIsLoading(false);
          CustomAlert({
            success: response?.data?.success,
            message: response?.data?.message,
          });

          bankManageOperation?.operations?.viewBankList
            ? navigate("/dashboard/bankAccount/all")
            : navigate("/dashboard/live");
        }
      }
    } catch (e) {
      showToast("error", e.response?.data?.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
  };

  return (
    <Box sx={{ borderRadius: "10px" }}>
      <Box>
        {isMobile ? (
          <>
            <MobileHeader
              title={"Add Bank Account"}
              subTitle={"Bank Acount Details"}
              labelValue={" Account Information"}
            />
          </>
        ) : (
          <PageTitle title={"Add Bank Account"} />
        )}

        <Box
          sx={{
            width: { xs: "90%", lg: "100%" },
            mx: "auto",
            mt: { lg: 0, xs: 5 },
          }}
        >
          <Box
            sx={{
              px: { md: "22px", xs: "15px" },
              py: { md: "25px", xs: "15px" },
              bgcolor: "white",
              borderRadius: { md: "0 0 5px 5px", xs: "4px" },
              minHeight: "75vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {!isMobile && (
              <Typography
                sx={{
                  fontWeight: "500",
                  color: "var(--dark-gray)",
                }}
              >
                Account Information
              </Typography>
            )}
            <Box
              sx={{
                width: "100%",
                bgcolor: "#fff",
                py: "15px",
                minHeight: "73vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: "0 0 10px 10px",
              }}
            >
              <Grid container columnSpacing={2.5} rowSpacing={3.5}>
                {/* Account Holder Name */}
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps(
                        "accountHolderName",
                        "Account Holder Name"
                      )}
                      onChange={(e) => {
                        handleChange(e);
                        validateField("accountHolderName", e.target.value);
                      }}
                      sx={sharedInputStyles}
                    />
                    <span style={registrationErrText}>
                      {errors?.accountHolderName}
                    </span>
                  </Box>
                </Grid>

                {/* Account Number */}
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("accountNumber", "Account Number")}
                      onChange={(e) => {
                        handleChange(e);
                        validateField("accountNumber", e.target.value);
                      }}
                      sx={sharedInputStyles}
                    />
                    <span style={registrationErrText}>
                      {errors?.accountNumber}
                    </span>
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <FormControl fullWidth size="small" sx={sharedInputStyles}>
                      <Select
                        options={banks?.map((bank) => ({
                          value: bank.id,
                          label: bank.bankName,
                        }))}
                        value={
                          formData?.bankName
                            ? {
                                label: formData?.bankName,
                                value: formData?.bankName,
                              }
                            : null
                        }
                        onChange={(selectedBank) => {
                          handleChangeBank(selectedBank?.label);
                          validateField("bankName", selectedBank?.value);
                        }}
                        placeholder="Select a Bank"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            backgroundColor: "white",
                            zIndex: 10,
                          }),
                        }}
                        isClearable
                      />
                    </FormControl>
                    <span style={registrationErrText}>{errors?.bankName}</span>
                  </Box>
                </Grid>

                {/* Address */}
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("address", "Address")}
                      onChange={(e) => {
                        handleChange(e);
                        validateField("address", e.target.value);
                      }}
                      sx={sharedInputStyles}
                    />
                    <span style={registrationErrText}>{errors?.address}</span>
                  </Box>
                </Grid>

                {/* Branch */}
                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("branch", "Branch")}
                      onChange={(e) => {
                        handleChange(e);
                        validateField("branch", e.target.value);
                      }}
                      sx={sharedInputStyles}
                    />
                    <span style={registrationErrText}>{errors?.branch}</span>
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("swift", "Swift")}
                      onChange={(e) => {
                        handleChange(e);
                        validateField("swift", e.target.value);
                      }}
                      sx={sharedInputStyles}
                    />
                    <span style={registrationErrText}>{errors?.swift}</span>
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("routingNumber", "Routing No")}
                      onChange={(e) => {
                        handleChange(e);
                        validateField("routingNumber", e.target.value);
                      }}
                      sx={sharedInputStyles}
                    />
                    <span style={registrationErrText}>
                      {errors?.routingNumber}
                    </span>
                  </Box>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...textFieldProps("reference", "Reference No")}
                      onChange={(e) => {
                        handleChange(e);
                        validateField("reference", e.target.value);
                      }}
                      sx={sharedInputStyles}
                    />
                    <span style={registrationErrText}>{errors?.reference}</span>
                  </Box>
                </Grid>
              </Grid>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
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
                  onClick={handleAddBank}
                >
                  {isLoading ? <SmallLoadingSpinner /> : `Add Bank Account`}
                </Button>
              </Box>
            </Box>
          </Box>
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
          data={formData}
          handleClose={handleClose}
          onSubmit={onSubmit}
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your New Bank Account Request"}
      />
    </Box>
  );
};

const validationSchema = Yup.object({
  accountHolderName: personNameValidation("Account Holder name "),
  accountNumber: Yup.string().required("Account number is required"),
  bankName: Yup.string().required("Bank is required"),
  address: Yup.string().required("Address is required"),
  branch: Yup.string().required("Branch is required"),
  swift: Yup.string().required("Swift is required"),
  routingNumber: Yup.string().required("Routing number is required"),
  reference: Yup.string().required("reference is required"),
});

export default AddBankAccount;
