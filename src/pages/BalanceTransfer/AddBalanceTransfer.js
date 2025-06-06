import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import Select from "react-select";
import * as Yup from "yup";
import CustomAlert from "../../component/Alert/CustomAlert";
import CustomToast from "../../component/Alert/CustomToast";
import RequiredIndicator from "../../component/Common/RequiredIndicator";
import ErrorDialog from "../../component/Dialog/ErrorDialog";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import { isMobile } from "../../shared/StaticData/Responsive";
import PageTitle from "../../shared/common/PageTitle";
import {
  amountValidation,
  numberToWords,
  textFieldProps,
} from "../../shared/common/functions";
import {
  depositBtn,
  registrationErrText,
  sharedInputStyles,
} from "../../shared/common/styles";
import CustomLoadingAlert from "../../component/Alert/CustomLoadingAlert";

const AddBalanceTransfer = () => {
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const { state } = location;
  const { jsonHeader } = useAuth();
  const { agentData, balanceInfo } = useOutletContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [balanceTransferData, setBalanceTransferData] = useState({
    branchUserId: "",
    amount: "",
    remarks: "",
  });

  useEffect(() => {
    if (balanceInfo?.mainBranch?.balance !== undefined) {
      setBalanceTransferData((prevData) => ({
        ...prevData,
        amount:
          agentData?.ownerType === "agent"
            ? 0
            : balanceInfo?.mainBranch?.balance,
      }));
    }
  }, [balanceInfo, agentData]);

  const { data: branches } = useQuery({
    queryKey: ["agent/branches"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches?status=active&page=1&limit=20`,
        jsonHeader()
      );
      return data?.data;
    },

    enabled: agentData?.ownerType === "agent",
  });

  useEffect(() => {
    if (state && branches?.data?.length > 0) {
      const matchingBranch = branches?.data.find(
        (branch) => branch?.district === state?.district
      );

      if (matchingBranch) {
        setSelectedBranch({
          value: matchingBranch?.userId,
          label: `${matchingBranch?.district} Branch`,
        });
      }
    }
  }, [state]);

  const validateField = async (field, value) => {
    try {
      const values = {
        [field]: value,
      };
      await validationSchema(agentData).validateAt(field, values);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, [field]: e.message }));
    }
  };

  const handleBranchChange = (selectedOption) => {
    setSelectedBranch(selectedOption);
    validateField("branchUserId", selectedOption?.value);
  };

  const handleAmount = (amount) => {
    if (amount === "0" || amount === " ") return;
    if (isNaN(Number(amount))) return;
    setAmount(Number(amount || 0).toLocaleString("en-IN"));
    validateField("amount", amount);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBalanceTransferData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const body = {
    branchUserId: selectedBranch?.value,
    amount: amount.replace(/,/g, ""),
    remarks: balanceTransferData?.remarks,
  };

  const handleTransferBalance = async () => {
    try {
      setShowErrorDialog(true);
      await validationSchema(agentData).validate(body, { abortEarly: false });
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
      message: `Are you sure you want to transfer ${amount} BDT To ${selectedBranch?.label}?`,
    });

    if (!result.isConfirmed) {
      return;
    }

    const body = {
      branchUserId: selectedBranch?.value,
      amount: Number(amount),
      remarks: balanceTransferData?.remarks,
    };

    setIsLoading(true);
    try {
      await validationSchema(agentData).validate(body, { abortEarly: false });
      setErrors({});
      const res = await axios.post(
        agentData?.ownerType === "agent"
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/balance-transfer/agent`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/balance-transfer/branch`,
        body,
        jsonHeader()
      );

      if (res?.data?.success) {
        showToast("success", res?.data?.message, () => {
          setBalanceTransferData({});
          queryClient.invalidateQueries(["balanceInfo"]);
          navigate("/dashboard/balanceTransfer");
        });
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
  };

  return (
    <Box sx={{ borderRadius: "10px" }}>
      <PageTitle title={"Add Balance Transfer"} />
      <MobileHeader
        title="Blance Transfer"
        labelType="title"
        labelValue="Add Balance Transfer"
      />
      <Box
        sx={{
          width: { xs: "90%", lg: "100%" },
          bgcolor: { xs: "#FFFFFF" },
          borderRadius: { xs: "5px", lg: "0px 0px 5px 5px" },
          px: { md: "22px", xs: "15px" },
          py: { xs: "20px" },
          mx: { xs: "auto" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "calc(100vh - 230px)",
          }}
        >
          <Grid container columnSpacing={2.5} rowSpacing={3.5}>
            {agentData?.ownerType === "agent" && (
              <Grid item xs={12} md={4}>
                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth size="small" sx={sharedInputStyles}>
                    <Select
                      options={branches?.data?.map((branch) => ({
                        value: branch?.userId,
                        label: `${branch?.branchName || branch?.city} Branch`,
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
            )}

            <Grid item xs={12} md={4}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  value={amount}
                  {...textFieldProps("amount", "Transfer Amount")}
                  onChange={(e) =>
                    handleAmount(e.target.value.replace(/,/g, ""))
                  }
                  sx={sharedInputStyles}
                />
                <span style={registrationErrText}>{errors?.amount}</span>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ position: "relative" }}>
                <textarea
                  value={balanceTransferData?.remarks}
                  name="remarks"
                  onChange={handleChange}
                  rows={isMobile ? 4 : 8}
                  style={{
                    border: "1px solid var(--border-color)",
                    outline: "none",
                    width: "100%",
                    resize: "none",
                    padding: "10px 14.5px",
                    fontSize: "16px",
                    color: "var(--text-medium)",
                    borderRadius: "5px",
                  }}
                  placeholder="Write Your Remarks..."
                />
                <span style={registrationErrText}>{errors?.remarks}</span>
              </Box>
            </Grid>
          </Grid>

          <Box>
            <Box sx={{ display: amount ? "block" : "none" }}>
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
                    I agree to Make Deposit only{" "}
                    <span style={{ color: "var(--primary-color)" }}>
                      {numberToWords(amount.replace(/,/g, ""))}
                    </span>{" "}
                    BDT.
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
                  marginTop: 0,
                },
              }}
            >
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
              onClick={() => handleTransferBalance()}
            >
              {isLoading ? (
                <>
                  Balance Transfer Request Amount of BDT{" "}
                  {balanceTransferData?.amount}
                  <CircularProgress size={20} color="inherit" />
                </>
              ) : (
                `Balance Transfer Request Amount of BDT ${balanceTransferData?.amount}`
              )}
            </Button>
          </Box>
        </Box>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
      {showErrorDialog && (
        <ErrorDialog
          handleClose={handleClose}
          errors={errors}
          data={{
            ...(selectedBranch?.label
              ? { branchUser: selectedBranch?.label }
              : { transferTo: "Main Branch" }),
            amount: Number(amount),
            remarks: balanceTransferData?.remarks,
          }}
          onSubmit={onSubmit}
          type={"For Balance Transfer"}
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={`We Are Processing Your ${Number(amount)} BDT Balance Transfer Request to ${selectedBranch?.label || "Main Branch"}`}
      />
    </Box>
  );
};

const validationSchema = (agentData) =>
  Yup.object({
    branchUserId:
      agentData?.ownerType === "agent"
        ? Yup.string().required("Branch is required")
        : null,
    amount: amountValidation("Amount"),
    remarks: Yup.string().required("Remarks is required"),
  });

export default AddBalanceTransfer;
