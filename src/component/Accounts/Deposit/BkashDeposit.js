import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import axios from "axios";
import {
  numberToWords,
  textFieldProps,
} from "../../../shared/common/functions";
import {
  depositBtn,
  registrationErrText,
  sharedInputStyles,
} from "../../../shared/common/styles";
import { Link } from "react-router-dom";
import RequiredIndicator from "../../Common/RequiredIndicator";
import ErrorDialog from "../../Dialog/ErrorDialog";
import CustomAlert from "../../Alert/CustomAlert";
import useToast from "../../../hook/useToast";
import CustomToast from "../../Alert/CustomToast";
import CustomLoadingAlert from "../../Alert/CustomLoadingAlert";

const BkashDeposit = () => {
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { jsonHeader } = useAuth();
  const [depositAmount, setDepositAmount] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: paymentData } = useQuery({
    queryKey: ["/user/bkash-payment/get-payment-switch"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/bkash-payment/get-payment-switch`,

        jsonHeader()
      );
      return data?.data.find((item) => item.name?.toLowerCase() === "bkash");
    },
  });

  const paymentInfo =
    paymentData && paymentData?.subTypes.length > 0
      ? paymentData?.subTypes?.find(
          (item) => item.paymentNameType === "payment"
        )
      : {};

  const gatewayCharge =
    depositAmount >= paymentInfo?.amount
      ? paymentInfo?.maxGateWayCharge
      : paymentInfo?.minGateWayCharge;

  const totalAmount =
    (Number(depositAmount) * gatewayCharge) / 100 + Number(depositAmount);

  const handleBkashDeposit = async () => {
    try {
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? you want to proceed with the bkash deposit?",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const { data } = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/bkash-payment/create`,
          {
            amount: depositAmount,
            name: "bkash",
            type: "deposit",
          },
          jsonHeader()
        );

        if (data?.success) {
          setIsLoading(false);
          window.open(data?.data?.bkashURL, "_blank");
        }
      }
    } catch (e) {
      setIsLoading(false);
      showToast("error", e?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
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
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <TextField
              value={depositAmount}
              {...textFieldProps("monerRecipt", "Deposit Amount")}
              onChange={(e) => {
                const numberRegex = /^\d+$/;

                if (numberRegex.test(e.target.value)) {
                  setDepositAmount(e.target.value);
                } else if (e.target.value === "") {
                  setDepositAmount(e.target.value);
                }
              }}
              sx={sharedInputStyles}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <TextField
              value={gatewayCharge}
              {...textFieldProps("monerRecipt", "Gateway Fee")}
              sx={sharedInputStyles}
              focused={true}
            />
            <span
              style={{
                ...registrationErrText,
                color: "var(--secondary-color)",
              }}
            >
              {depositAmount >= paymentInfo?.amount ? (
                <>
                  NB: 1.5% charge on deposits of ৳{paymentInfo?.amount} or more
                </>
              ) : (
                <>
                  NB: 1.2% charge if deposit amount less than ৳
                  {paymentInfo?.amount}.
                </>
              )}
            </span>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative" }}>
            <TextField
              value={totalAmount}
              {...textFieldProps("monerRecipt", "Total Amount")}
              //   onChange={(e) => handleMoneyRecipt(e.target.value)}
              sx={sharedInputStyles}
            />
            {/* <span style={registrationErrText}>
              {errors?.moneyReceiptNumber}
            </span> */}
          </Box>
        </Grid>
      </Grid>

      <Box>
        <Box sx={{ display: totalAmount > 0 ? "block" : "none" }}>
          <FormControlLabel
            control={<Checkbox checked={true} />}
            label={
              <Typography
                sx={{
                  lineHeight: "1rem",
                  fontSize: { xs: "14px", md: "16px" },
                }}
              >
                I Agree to Make Deposit{" "}
                <span style={{ color: "var(--primary-color)" }}>
                  {numberToWords(totalAmount)}
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
              marginTop: totalAmount > 0 ? 0 : "16px",
            },
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
            }
            label={
              <Typography
                sx={{
                  lineHeight: "1rem",
                  fontSize: { xs: "14px", md: "16px" },
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
          disabled={!isChecked || isLoading || totalAmount === 0}
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
          onClick={() => setShowErrorDialog(true)}
        >
          {isLoading ? (
            <>
              Send Deposit Request Amount of BDT Only.
              {totalAmount === null ? "0" : totalAmount}
              <CircularProgress size={20} color="inherit" />
            </>
          ) : (
            `Send Deposit Request Amount of BDT ${
              totalAmount === null ? "0" : totalAmount
            }`
          )}
        </Button>
      </Box>

      {showErrorDialog && (
        <ErrorDialog
          errors={{}}
          data={{ depositAmount, gatewayCharge, totalAmount }}
          handleClose={() => setShowErrorDialog(false)}
          onSubmit={handleBkashDeposit}
          type={"For Bkash Deposit"}
        />
      )}

      <CustomLoadingAlert
        open={isLoading}
        text={"We Are Processing Your Cheque Deposit Request Amount Of"}
        subTitle={depositAmount + " BDT"}
      />

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />
    </Box>
  );
};

export default BkashDeposit;
