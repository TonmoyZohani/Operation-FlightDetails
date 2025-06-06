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
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Select from "react-select";
import * as Yup from "yup";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import {
  fileTypeValid,
  moneyReciptValidation,
  numberToWords,
  textFieldProps,
} from "../../../shared/common/functions";
import {
  depositBtn,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import { initialBranch } from "../../../shared/StaticData/CountryList";
import FileUpload from "../../AirBooking/FileUpload";
import CustomAlert from "../../Alert/CustomAlert";
import CustomToast from "../../Alert/CustomToast";
import RequiredIndicator from "../../Common/RequiredIndicator";
import CustomCalendar from "../../CustomCalendar/CustomCalendar";
import ErrorDialog from "../../Dialog/ErrorDialog";
import CustomLoadingAlert from "../../Alert/CustomLoadingAlert";

const CashDeposit = () => {
  const { formDataHeader } = useAuth();
  const navigate = useNavigate();
  const agentData = useOutletContext();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [openCal, setOpenCal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [transactionDate, setTransactionDate] = useState(null);
  const [moneyReceiptNumber, setmoneyReceiptNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [despositImageFile, setDepositImageFile] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const [errors, setErrors] = useState({});

  const cashDeposit =
    agentData?.agentData?.agentCms?.eligibleRangeCms?.cashDeposit ?? {};

  //TODO:: Fetching data from api
  const { data: allBranchb } = useQuery({
    queryKey: ["allBranch"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/admin/branches`
      );
      return data?.data;
    },
  });

  const allBranch = allBranchb?.length > 0 ? allBranchb : initialBranch;

  const validateField = async (field, value) => {
    try {
      const values = {
        [field]: value,
      };

      await validationSchema(
        cashDeposit?.minimum,
        cashDeposit?.maximum
      ).validateAt(field, values);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
    }
  };

  const handleBranchChange = (selectedOption) => {
    setSelectedBranch(selectedOption);
    validateField("branch", selectedOption?.value);
  };

  const handleMoneyRecipt = (value) => {
    setmoneyReceiptNumber(value);
    validateField("moneyReceiptNumber", value);
  };

  const handleAmount = (amount) => {
    // Remove any existing commas
    const rawValue = amount.replace(/,/g, "");

    // Allow clearing the input
    if (rawValue.trim() === "") {
      setAmount("");
      return;
    }

    // Ensure it's a valid number
    if (isNaN(Number(rawValue))) return;

    validateField("amount", rawValue);

    // Format with commas while storing the raw numeric value internally
    setAmount(Number(rawValue).toLocaleString("en-IN"));
  };

  const handleDepositImage = (file) => {
    setDepositImageFile(file);
    validateField("attachment", file);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const depositData = {
    branch: selectedBranch?.value,
    moneyReceiptNumber: moneyReceiptNumber,
    amount: amount.replace(/,/g, ""),
    transactionDate: transactionDate
      ? moment(transactionDate).format("YYYY-MM-DD")
      : null,
    attachment: despositImageFile,
  };

  const handleCash = async () => {
    setShowErrorDialog(true);
    try {
      await validationSchema(
        cashDeposit?.minimum,
        cashDeposit?.maximum
      ).validate(depositData, { abortEarly: false });
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
      const formData = new FormData();
      Object.entries(depositData).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to proceed with the cash deposit?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        setShowErrorDialog(false);
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/deposit/cash-deposits`,
          depositData,
          formDataHeader()
        );

        if (response?.data?.success) {
          setIsLoading(false);
          showToast("success", response.data?.message);
          navigate("/dashboard/deposits/all");
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
    <Box
      sx={{
        mt: "15px",
        minHeight: "calc(100vh - 300px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: { lg: "0", xs: "22px" },
        bgcolor: "white",
        borderRadius: "5px",
      }}
    >
      <Grid container spacing={2.5}>
        {/* Select Branch */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <FormControl fullWidth size="small" sx={sharedInputStyles}>
              <Select
                options={allBranch?.map((branch) => ({
                  value: branch.id,
                  label: branch.branchName,
                }))}
                value={
                  selectedBranch
                    ? {
                        value: selectedBranch.value,
                        label: selectedBranch.label,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  handleBranchChange(selectedOption)
                }
                placeholder="Select a Branch"
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
            {errors?.branch && (
              <span style={registrationErrText}>{errors.branch}</span>
            )}
          </Box>
        </Grid>

        {/* Money Recipt Number */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <TextField
              {...textFieldProps("monerRecipt", "Money Receipt Number")}
              onChange={(e) => handleMoneyRecipt(e.target.value)}
              sx={sharedInputStyles}
            />
            <span style={registrationErrText}>
              {errors?.moneyReceiptNumber}
            </span>
          </Box>
        </Grid>

        {/* Amount */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <TextField
              value={amount}
              {...textFieldProps("amount", "Amount")}
              onChange={(e) => handleAmount(e.target.value)}
              onKeyDown={(e) => {
                if (["ArrowUp", "ArrowDown", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onWheel={(e) => e.target.blur()}
              sx={sharedInputStyles}
              autoComplete="off"
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
                  {(cashDeposit?.minimum || 20)?.toLocaleString("en-IN")} BDT -
                  Maximum{" "}
                  {(cashDeposit?.maximum || 5000000)?.toLocaleString("en-IN")}{" "}
                  BDT
                </>
              )}
            </span>
          </Box>
        </Grid>

        {/* Date */}
        <Grid item xs={12} sm={6} md={4}>
          <ClickAwayListener onClickAway={() => openCal && setOpenCal(false)}>
            <Box
              sx={{
                position: "relative",
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: openCal
                      ? "var(--primary-color)"
                      : transactionDate && "#00000099",
                  },
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: openCal
                      ? "#8BB6CC"
                      : transactionDate && "var(--border-color)",
                  },
                },
              }}
            >
              <TextField
                value={
                  transactionDate &&
                  moment(transactionDate, "YYYY-MM-DD").format("DD MMMM YYYY")
                }
                {...textFieldProps("transactionDate", "Transaction Date")}
                sx={sharedInputStyles}
                onClick={() => setOpenCal(!openCal)}
                focused={openCal || transactionDate}
              />
              <span style={registrationErrText}>{errors?.transactionDate}</span>
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
                    date={transactionDate ? transactionDate : new Date()}
                    maxDate={new Date()}
                    title={"Transaction Date"}
                    handleChange={(date) => {
                      validateField("transactionDate", date);
                      setTransactionDate(date);
                      setOpenCal(!openCal);
                    }}
                  />
                </Box>
              )}
            </Box>
          </ClickAwayListener>
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
          onClick={() => handleCash()}
        >
          {isLoading ? (
            <>
              Send Deposit Request Amount of BDT Only.
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
            ...depositData,
            branch: selectedBranch?.label,
          }}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type={"For Cash Deposit"}
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your Cash Deposit Request Amount Of"}
        subTitle={amount + " BDT"}
      />
    </Box>
  );
};

const validationSchema = (minimum, maximum) =>
  Yup.object({
    branch: Yup.string().required("Branch is required"),
    moneyReceiptNumber: moneyReciptValidation("Money recipt number"),
    amount: Yup.number()
      .required("Amount is required")
      .typeError("Amount must be a number")
      .min(
        minimum || 20,
        `Amount must be at least ${(minimum || 20)?.toLocaleString("en-IN")} BDT`
      )
      .max(
        maximum || 5000000,
        `Amount must not exceed ${(maximum || 5000000)?.toLocaleString("en-IN")} BDT`
      ),
    transactionDate: Yup.string().required("Transaction date is required"),
    attachment: fileTypeValid("Image"),
  });

export default CashDeposit;
