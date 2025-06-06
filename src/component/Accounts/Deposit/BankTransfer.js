import AddIcon from "@mui/icons-material/Add";
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

const BankTransfer = () => {
  const navigate = useNavigate();
  const agentData = useOutletContext();
  const { jsonHeader, formDataHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [openCal, setOpenCal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Field
  const [agentBank, setAgentBank] = useState(null);
  const [adminBank, setAdminBank] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState(null);
  const [reference, setReference] = useState(null);
  const [transferType, setTransferType] = useState(null);
  const [despositImageFile, setDepositImageFile] = useState(null);

  const [errors, setErrors] = useState({});

  const bankTransfer =
    agentData?.agentData?.agentCms?.eligibleRangeCms?.bankTransferDeposit ?? {};

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  //TODO:: Fetching data from api
  const { data: agentsBank } = useQuery({
    queryKey: ["agentsBanks"],
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

  const options = [
    {
      label: (
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textDecoration: "underline",
            fontWeight: 600,
            color: "var(--secondary-color)",
          }}
        >
          Add Bank Account <AddIcon />
        </Box>
      ),
      value: "addAccount",
    },
    ...(Array.isArray(agentsBank)
      ? agentsBank.map((bank) => ({
          label: `${bank.bankName} (AC-${bank?.accountNumber})`,
          value: bank?.id,
        }))
      : []),
  ];

  const validateField = async (field, value) => {
    try {
      const values = {
        [field]: value,
      };

      await validationSchema(
        bankTransfer?.minimum,
        bankTransfer?.maximum
      ).validateAt(field, values);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
    }
  };

  const handleAgentBank = (agentBank) => {
    setAgentBank(agentBank);
    validateField("depositFrom", agentBank?.value);
  };

  const handleAdminBank = (adminBank) => {
    setAdminBank(adminBank);
    validateField("depositIn", adminBank?.value);
  };

  const handleAmount = (amount) => {
    const rawValue = amount.replace(/,/g, "");

    if (rawValue.trim() === "") {
      setAmount("");
      return;
    }

    if (isNaN(Number(rawValue))) return;
    validateField("amount", rawValue);
    setAmount(Number(rawValue).toLocaleString("en-IN"));
  };

  const handleReference = (value) => {
    setReference(value);
    validateField("reference", value);
  };

  const handleDepositImage = (file) => {
    setDepositImageFile(file);
    validateField("attachment", file);
  };

  const body = {
    depositFrom: agentBank?.value,
    depositIn: adminBank?.value,
    reference,
    amount: amount.replace(/,/g, ""),
    transferType,
    transactionDate: transactionDate
      ? moment(transactionDate).format("YYYY-MM-DD")
      : null,
    attachment: despositImageFile,
  };

  const handleSubmit = async () => {
    try {
      setShowErrorDialog(true);
      await validationSchema(
        bankTransfer?.minimum,
        bankTransfer?.maximum
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
        bankTransfer?.minimum,
        bankTransfer?.maximum
      ).validate(body, { abortEarly: false });
      setErrors({});

      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to proceed with the bank transfer?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/deposit/bank-transfer-deposits`,
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
        bgcolor: "white",
        p: { lg: "0", xs: "15px" },
        borderRadius: "5px",
      }}
    >
      <Grid container spacing={2.5}>
        {/* Deposit From */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <FormControl fullWidth size="small" sx={sharedInputStyles}>
              <Select
                options={options}
                value={
                  agentBank
                    ? {
                        value: agentBank?.value,
                        label: agentBank.label,
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  if (!selectedOption) {
                    handleAgentBank(null);
                    return;
                  }

                  if (selectedOption.value === "addAccount") {
                    navigate("/dashboard/addBankAccount");
                  } else {
                    handleAgentBank(selectedOption);
                  }
                }}
                placeholder="Deposit From"
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
            {errors?.depositFrom && (
              <span style={registrationErrText}>{errors.depositFrom}</span>
            )}
          </Box>
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
                  {(bankTransfer?.minimum || 20)?.toLocaleString("en-IN")} BDT -
                  Maximum{" "}
                  {(bankTransfer?.maximum || 5000000)?.toLocaleString("en-IN")}{" "}
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
              {...textFieldProps("reference", "Transaction ID")}
              onChange={(e) => handleReference(e.target.value)}
              sx={sharedInputStyles}
            />
            <span style={registrationErrText}>{errors?.reference}</span>
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

        {/* Transfer Type */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <FormControl fullWidth size="small" sx={sharedInputStyles}>
              <Select
                options={[
                  { value: "NPSB", label: "NPSB" },
                  { value: "BEFTN", label: "BEFTN" },
                  { value: "RTGS", label: "RTGS" },
                  { value: "EFT", label: "EFT" },
                ]}
                value={
                  transferType
                    ? { value: transferType, label: transferType }
                    : null
                }
                onChange={(selectedOption) => {
                  setTransferType(selectedOption?.value);
                  validateField("transferType", selectedOption?.value);
                }}
                placeholder="Transfer Type"
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
            {errors?.transferType && (
              <span style={registrationErrText}>{errors.transferType}</span>
            )}
          </Box>
        </Grid>

        {/* Deposit Attachment */}
        <Grid spacing={2.5} item md={12} container sx={{ mt: "0px" }}>
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
            depositFrom: agentBank?.label,
            depositIn: adminBank?.label,
          }}
          handleClose={handleClose}
          onSubmit={onSubmit}
          type={"For Bank Transfer"}
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your Bank Transfer Request Amount Of"}
        subTitle={amount + " BDT"}
      />
    </Box>
  );
};

const validationSchema = (minimum, maximum) =>
  Yup.object({
    depositFrom: Yup.string().required("Deposit From is required"),
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
    reference: Yup.string().required("Transaction ID is required"),
    transferType: Yup.string().required("Transfer type is required"),
    transactionDate: Yup.string().required("Transaction date is required"),
    attachment: fileTypeValid("Image"),
  });

export default BankTransfer;
