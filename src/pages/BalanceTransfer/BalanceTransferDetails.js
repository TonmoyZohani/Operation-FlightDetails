import { Box, Grid, TextField } from "@mui/material";
import React from "react";
import { textFieldProps } from "../../shared/common/functions";
import { sharedInputStyles } from "../../shared/common/styles";
import PageTitle from "../../shared/common/PageTitle";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import ServerError from "../../component/Error/ServerError";
import useWindowSize from "../../shared/common/useWindowSize";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import { MobileBalanceTransferCardSkeleton } from "../../component/SkeletonLoader/MobileBalanceTransferCardSkeleton";

const BalanceTransferDetails = () => {
  const { isMobile } = useWindowSize();
  const { jsonHeader } = useAuth();
  const location = useLocation();
  const { state } = location;
  const { transactionId } = state;

  const {
    data: singleBalanceTransfer,
    status,
    error,
  } = useQuery({
    queryKey: ["balanceTransferData", transactionId],
    queryFn: async () => {
      if (!transactionId) throw new Error("Transaction ID is required");
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/balance-transfer/${transactionId}`;
      const { data } = await axios.get(url, jsonHeader());
      return data;
    },
    enabled: !!transactionId,
  });

  return (
    <>
      <MobileHeader
        title={"Blance Transfer Details"}
        labelType={"title"}
        labelValue={
          singleBalanceTransfer?.data?.receiver?.type === "branch"
            ? singleBalanceTransfer?.data?.receiver?.branch?.city ||
              singleBalanceTransfer?.data?.receiver?.branch?.district
            : "Main Branch"
        }
      />

      {status === "pending" && (
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "5px",
            width: {
              xs: "90%",
              lg: "100%",
            },
            mx: "auto",
            mt: {
              xs: 5,
              lg: 0,
            },
          }}
        >
          {isMobile ? <MobileBalanceTransferCardSkeleton /> : <TableSkeleton />}
        </Box>
      )}

      {status === "error" && (
        <Box sx={{ height: "calc(100vh - 150px)" }}>
          <ServerError message={error?.response?.data?.message} />
        </Box>
      )}

      {status === "success" && (
        <Box>
          <PageTitle title={"Balance Transfer Details"} />
          <Box
            sx={{
              width: {
                xs: "90%",
                lg: "100%",
              },
              mx: "auto",
              mt: {
                xs: 5,
                lg: 0,
              },
              bgcolor: { xs: "white" },
              borderRadius: isMobile ? "5px" : "0px 0px 5px 5px",
              px: "20px",
              py: "35px",
              minHeight: { md: "calc(100vh - 150px)" },
            }}
          >
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: { xs: "4px" },
              }}
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      label="Transaction Id"
                      value={singleBalanceTransfer?.data?.tranxId}
                      {...textFieldProps("depositFrom", "Transaction Id")}
                      sx={sharedInputStyles}
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      label="Transfer From"
                      value={
                        singleBalanceTransfer?.data?.receiver?.type === "branch"
                          ? singleBalanceTransfer?.data?.receiver?.branch
                              ?.city ||
                            singleBalanceTransfer?.data?.receiver?.branch
                              ?.district
                          : "Main Branch"
                      }
                      {...textFieldProps("depositFrom", "Transfer From")}
                      sx={sharedInputStyles}
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      label="Transfer To"
                      value={
                        singleBalanceTransfer?.data?.sender?.type === "branch"
                          ? singleBalanceTransfer?.data?.sender?.branch?.city ||
                            singleBalanceTransfer?.data?.sender?.branch
                              ?.district
                          : "Main Branch"
                      }
                      {...textFieldProps("depositFrom", "Transfer To")}
                      sx={sharedInputStyles}
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      label="Amount"
                      value={singleBalanceTransfer?.data?.amount}
                      {...textFieldProps("depositFrom", "Amount")}
                      sx={sharedInputStyles}
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ position: "relative" }}>
                    <textarea
                      id="remarks"
                      name="remarks"
                      rows="4"
                      cols="130"
                      className="text-area"
                      value={singleBalanceTransfer?.data?.remarks}
                      style={{ border: "1px solid #8BB6CC" }}
                      readOnly
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default BalanceTransferDetails;
