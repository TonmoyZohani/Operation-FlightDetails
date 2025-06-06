import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Select from "react-select";
import * as Yup from "yup";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import {
  amountValidation,
  fileTypeValid,
  numberToWords,
  textFieldProps,
} from "../../../shared/common/functions";
import {
  depositBtn,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import FileUpload from "../../AirBooking/FileUpload";
import CustomAlert from "../../Alert/CustomAlert";
import CustomToast from "../../Alert/CustomToast";
import RequiredIndicator from "../../Common/RequiredIndicator";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";
import ErrorDialog from "../../Dialog/ErrorDialog";
import CustomLoadingAlert from "../../Alert/CustomLoadingAlert";

const ChequeDeposit = () => {
  const navigate = useNavigate();
  const agentData = useOutletContext();
  const { jsonHeader, formDataHeader } = useAuth();

  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [despositImageFile, setDepositImageFile] = useState(null);
  const [openDepositCal, setOpenDepositCal] = useState(false);
  const [openIssueCal, setOpenIssueCal] = useState(false);
  const [amount, setAmount] = useState("");
  const [depositDate, setDepositDate] = useState(null);
  const [issueDate, setIssueDate] = useState(null);
  const [adminBank, setAdminBank] = useState(null);
  const [issueBank, setIssueBank] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [reference, setReference] = useState(null);
  const [chequeNumber, setChequeNumber] = useState(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Error State
  const [errors, setErrors] = useState({});

  const chequeDeposit =
    agentData?.agentData?.agentCms?.eligibleRangeCms?.chequeDeposit ?? {};

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  //TODO:: Fetching data from api
  const { data: chequeIssueBank } = useQuery({
    queryKey: ["chequeIssueBank"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/user-banks/all`,
        jsonHeader()
      );
      return data?.data?.filter((bank) => bank.status === "active");
    },
  });

  //TODO:: Fetching data from api
  const { data: adminsBank } = useQuery({
    queryKey: ["adminsBank"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/admin/banks`,
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

      await validationSchema(
        chequeDeposit?.minimum,
        chequeDeposit?.maximum
      ).validateAt(field, values);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
    }
  };

  const handleChequeNumber = (value) => {
    setChequeNumber(value);
    validateField("chequeNumber", value);
  };

  const handleAmount = (amount) => {
    // Remove commas for proper number conversion
    const rawValue = amount.replace(/,/g, "");

    // Allow clearing input
    if (rawValue.trim() === "") {
      setAmount("");
      return;
    }

    // Ensure valid number
    if (isNaN(Number(rawValue))) return;

    // Validate raw number (without commas)
    validateField("amount", rawValue);

    // Store formatted value (with commas) in state
    setAmount(Number(rawValue).toLocaleString("en-IN"));
  };

  const handleReference = (value) => {
    setReference(value);
    validateField("reference", value);
  };

  const handleAdminBank = (adminBank) => {
    setAdminBank(adminBank);
    validateField("depositIn", adminBank?.value);
  };

  const handleIssueBank = (iissueBank) => {
    setIssueBank(iissueBank);
    validateField("issueBank", iissueBank?.value);
  };

  const handleDepositImage = (file) => {
    setDepositImageFile(file);
    validateField("attachment", file);
  };

  const body = {
    depositIn: adminBank?.value,
    issueBank: issueBank?.value,
    chequeNumber: chequeNumber,
    reference: reference,
    amount: amount.replace(/,/g, ""),
    depositDate: depositDate ? moment(depositDate).format("YYYY-MM-DD") : null,
    issueDate: issueDate ? moment(issueDate).format("YYYY-MM-DD") : null,
    attachment: despositImageFile,
  };

  const handleSubmit = async () => {
    try {
      setShowErrorDialog(true);
      await validationSchema(
        chequeDeposit?.minimum,
        chequeDeposit?.maximum
      ).validate(body, { abortEarly: false });
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
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => formData.append(key, value));

    try {
      await validationSchema(
        chequeDeposit?.minimum,
        chequeDeposit?.maximum
      ).validate(body, { abortEarly: false });
      setErrors({});

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to proceed with the cheque deposit?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/deposit/cheque-deposits`,
          formData,
          formDataHeader()
        );

        if (response?.data?.success) {
          setIsLoading(false);
          CustomAlert({
            success: response?.data?.success,
            message: response?.data?.message,
          });
          navigate("/dashboard/deposits/all");
        }
      }
    } catch (e) {
      setIsLoading(false);
      showToast("error", e.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
  };

  return (
    <Box
      sx={{
        mt: "15px",
        minHeight: "calc(100vh - 300px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "white",
        p: { lg: "0", xs: "15px" },
        borderRadius: "5px",
      }}
    >
      <Grid container spacing={2.5}>
        {/* Cheque Number */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <TextField
              {...textFieldProps("chequeNumber", "Cheque Number")}
              onChange={(e) => handleChequeNumber(e.target.value)}
              sx={sharedInputStyles}
            />
            <span style={registrationErrText}>{errors?.chequeNumber}</span>
          </Box>
        </Grid>

        {/* Issue Bank */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <FormControl fullWidth size="small" sx={sharedInputStyles}>
              <Select
                options={chequeIssueBank?.map((bank) => ({
                  value: bank.id,
                  label: `${bank.bankName + " "} (AC-${bank?.accountNumber})`,
                }))}
                value={
                  issueBank
                    ? {
                        value: issueBank.value,
                        label: issueBank.label,
                      }
                    : null
                }
                onChange={(selectedOption) => handleIssueBank(selectedOption)}
                placeholder="Issue Bank"
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
            {errors?.depositIn && (
              <span style={registrationErrText}>{errors.issueBank}</span>
            )}
          </Box>
        </Grid>

        {/* Deposit Date */}
        <Grid item xs={12} sm={6} md={4}>
          <ClickAwayListener
            onClickAway={() => openDepositCal && setOpenDepositCal(false)}
          >
            <Box
              sx={{
                position: "relative",
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: openDepositCal
                      ? "var(--primary-color)"
                      : depositDate && "#00000099",
                  },
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: openDepositCal
                      ? "#8BB6CC"
                      : depositDate && "var(--border-color)",
                  },
                },
              }}
            >
              <TextField
                value={
                  depositDate &&
                  moment(depositDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                }
                {...textFieldProps("depositDate", "Deposit Date")}
                sx={sharedInputStyles}
                onClick={() => setOpenDepositCal(!openDepositCal)}
                focused={openDepositCal || depositDate}
              />
              <span style={registrationErrText}>{errors?.depositDate}</span>
              {openDepositCal && (
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
                    date={depositDate ? depositDate : new Date()}
                    maxDate={new Date()}
                    title={"Deposit Date"}
                    handleChange={(date) => {
                      setDepositDate(date);
                      validateField("depositDate", date);
                      setOpenDepositCal(!openDepositCal);
                    }}
                  />
                </Box>
              )}
            </Box>
          </ClickAwayListener>
        </Grid>

        {/* Issue Date */}
        <Grid item xs={12} sm={6} md={4}>
          <ClickAwayListener
            onClickAway={() => openIssueCal && setOpenIssueCal(false)}
          >
            <Box
              sx={{
                position: "relative",
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: openIssueCal
                      ? "var(--primary-color)"
                      : issueDate && "#00000099",
                  },
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: openIssueCal
                      ? "#8BB6CC"
                      : issueDate && "var(--border-color)",
                  },
                },
              }}
            >
              <TextField
                value={
                  issueDate &&
                  moment(issueDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                }
                {...textFieldProps("issueDate", "Issue Date")}
                sx={sharedInputStyles}
                onClick={() => setOpenIssueCal(!openIssueCal)}
                focused={openIssueCal || issueDate}
              />
              <span style={registrationErrText}>{errors?.issueDate}</span>
              {openIssueCal && (
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
                    date={issueDate ? issueDate : new Date()}
                    maxDate={new Date()}
                    title={"Issue Date"}
                    handleChange={(date) => {
                      setIssueDate(date);
                      validateField("issueDate", date);
                      setOpenIssueCal(!openIssueCal);
                    }}
                  />
                </Box>
              )}
            </Box>
          </ClickAwayListener>
        </Grid>

        {/* Deposit In */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <FormControl fullWidth size="small" sx={sharedInputStyles}>
              <Select
                options={adminsBank?.map((bank) => ({
                  value: bank.id,
                  label: `${bank.bankName + " "} (AC-${bank?.accountNumber})`,
                }))}
                value={
                  adminBank
                    ? {
                        value: adminBank.value,
                        label: adminBank.label,
                      }
                    : null
                }
                onChange={(selectedOption) => handleAdminBank(selectedOption)}
                placeholder="Deposit In"
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
            {errors?.depositIn && (
              <span style={registrationErrText}>{errors.depositIn}</span>
            )}
          </Box>
        </Grid>

        {/* Amount */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <TextField
              value={amount}
              {...textFieldProps("amount", "Amount", "text")}
              onChange={(e) => handleAmount(e.target.value)}
              onKeyDown={(e) => {
                if (["ArrowUp", "ArrowDown", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onWheel={(e) => e.target.blur()}
              sx={sharedInputStyles}
            />

            <span
              style={{
                ...registrationErrText,
                color: errors?.amount
                  ? "var(--primary-color)"
                  : "var(--secondary-color)",
              }}
            >
              {errors?.amount ? (
                errors?.amount
              ) : (
                <>
                  NB: Minimum{" "}
                  {(chequeDeposit?.minimum || 20)?.toLocaleString("en-IN")} BDT
                  - Maximum{" "}
                  {(chequeDeposit?.maximum || 5000000)?.toLocaleString("en-IN")}{" "}
                  BDT
                </>
              )}
            </span>
          </Box>
        </Grid>

        {/* Reference */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <TextField
              {...textFieldProps("reference", "Reference")}
              onChange={(e) => handleReference(e.target.value)}
              sx={sharedInputStyles}
            />
            <span style={registrationErrText}>{errors?.reference}</span>
          </Box>
        </Grid>

        {/* Deposit Attachment */}
        <Grid spacing={2.5} item xs={12} container sx={{ mt: "0px" }}>
          <Grid item md={4} sm={6} xs={12}>
            <FileUpload
              id={"depositImage"}
              label={"Deposit Attachment"}
              onFileChange={(file) => handleDepositImage(file)}
              accept=".jpg,.jpeg,.png,.pdf"
              acceptLabel="JPG JPEG PNG & PDF"
            />
            <p
              style={{
                fontSize: "10.5px",
                marginTop: "1px",
                color: "var(--primary-color)",
              }}
            >
              {errors?.attachment}
            </p>
          </Grid>
        </Grid>
      </Grid>

      <Box>
        <Box
          sx={{
            display: Number(amount.replace(/,/g, "")) > 0 ? "block" : "none",
          }}
        >
          <FormControlLabel
            control={<Checkbox checked={true} />}
            label={
              <Typography
                sx={{
                  lineHeight: "1rem",
                  fontSize: {
                    xs: "14px",
                    md: "16px",
                  },
                }}
              >
                I Agree to Make Deposit{" "}
                <span style={{ color: "var(--primary-color)" }}>
                  {numberToWords(amount.replace(/,/g, ""))}
                </span>{" "}
                BDT Only.
              </Typography>
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                color: "var(--secondary-color)",
              },
              mt: 2,
            }}
          />
        </Box>

        <Box
          sx={{
            ".css-1nawvua-MuiFormControlLabel-root": {
              marginTop: Number(amount.replace(/,/g, "")) > 0 ? 0 : "16px",
            },
          }}
        >
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
        </Box>

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
          onClick={() => handleSubmit()}
        >
          {isLoading ? (
            <>
              Send Deposit Request Amount of BDT
              {amount === null ? "0" : amount}
              <CircularProgress size={20} color="inherit" />
            </>
          ) : (
            `Send Deposit Request Amount of BDT ${
              amount === null ? "0" : amount
            }`
          )}
        </Button>
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
          data={{
            ...body,
            depositIn: adminBank?.label,
            issueBank: issueBank?.label,
          }}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type={"For Cheque Deposit"}
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your Cheque Deposit Request Amount Of"}
        subTitle={amount + " BDT"}
      />
    </Box>
  );
};

const validationSchema = (minimum, maximum) =>
  Yup.object({
    chequeNumber: Yup.string().required("Cheque Number is required"),
    issueBank: Yup.string().required("Issue Bank is required"),
    depositDate: Yup.string().required("Deposit date is required"),
    issueDate: Yup.string().required("Issue date is required"),
    depositIn: Yup.string().required("Deposit In is required"),
    amount: Yup.number()
      .required("Amount is required")
      .typeError("Amount must be a number")
      .min(
        minimum,
        `Amount must be at least ${(minimum || 20)?.toLocaleString("en-IN")} BDT`
      )
      .max(
        maximum,
        `Amount must not exceed ${(maximum || 5000000)?.toLocaleString("en-IN")} BDT`
      ),
    reference: Yup.string().required("Reference is required"),
    attachment: fileTypeValid("Image"),
  });

export default ChequeDeposit;
