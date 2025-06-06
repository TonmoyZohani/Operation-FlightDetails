import CloseIcon from "@mui/icons-material/Close";
import ForwardIcon from "@mui/icons-material/Forward";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import { getDepositSingleData } from "../../../helpers/getDepositSingleData";
import { MobileInputSkeleton } from "../../../pages/Staff/AddStaff";
import {
  convertCamelToTitle,
  textFieldProps,
} from "../../../shared/common/functions";
import PageTitle from "../../../shared/common/PageTitle";
import { primaryBtn, sharedInputStyles } from "../../../shared/common/styles";
import useWindowSize from "../../../shared/common/useWindowSize";
import FileUpload from "../../AirBooking/FileUpload";
import ServerError from "../../Error/ServerError";
import MobileHeader from "../../MobileHeader/MobileHeader";
import MoneyReceivedPdf from "../../PDFPageDesign/MoneyReceivedPdf";
import TableSkeleton from "../../SkeletonLoader/TableSkeleton";

const DepositDetails = () => {
  const location = useLocation();
  const { jsonHeader } = useAuth();
  const { state } = location;
  const { id, depositType } = state;

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectImage, setSelectImage] = useState(null);
  const { isMobile } = useWindowSize();

  const fetchData = async () => {
    const depositTypeMap = {
      bankDeposit: `${process.env.REACT_APP_BASE_URL}/api/v1/user/deposit/bank-deposits/${id}`,
      bankTransferDeposit: `${process.env.REACT_APP_BASE_URL}/api/v1/user/deposit/bank-transfer-deposits/${id}`,
      cashDeposit: `${process.env.REACT_APP_BASE_URL}/api/v1/user/deposit/cash-deposits/${id}`,
      chequeDeposit: `${process.env.REACT_APP_BASE_URL}/api/v1/user/deposit/cheque-deposits/${id}`,
    };

    const url = depositTypeMap[depositType];

    if (url) {
      const response = await axios.get(url, jsonHeader());
      const { data } = response.data;
      return { data };
    } else {
      throw new Error("Invalid deposit type");
    }
  };

  //TODO:: Fetching data from api
  const {
    data: depositData,
    error,
    status,
  } = useQuery({
    queryKey: ["depositData", state],
    queryFn: fetchData,
    enabled: !!state,
  });

  const deposit = getDepositSingleData(depositType, depositData?.data);

  const capitalize = (text) =>
    text.toLowerCase().replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());

  return (
    <Box>
      <>
        {isMobile ? (
          <>
            <MobileHeader
              title={"Deposit Management"}
              subTitle={convertCamelToTitle(depositType)}
              labelValue={`Deosit Details ${deposit?.depositId}`}
            />
          </>
        ) : (
          <PageTitle title={"Deposit Details"} />
        )}

        {status === "pending" && (
          <>
            {isMobile ? (
              <Box
                sx={{
                  width: "90%",
                  mx: "auto",
                  mt: 5,
                }}
              >
                <Box
                  sx={{
                    p: "20px",
                    bgcolor: "white",
                    mt: "15px",
                    borderRadius: "5px",
                  }}
                >
                  <MobileInputSkeleton />
                </Box>
              </Box>
            ) : (
              <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
                <TableSkeleton />
              </Box>
            )}
          </>
        )}

        {status === "error" && (
          <Box sx={{ bgcolor: "white", height: "calc(100vh - 200px)" }}>
            <ServerError message={error?.response?.data?.message} />
          </Box>
        )}

        {status === "success" && deposit && (
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
              bgcolor: { xs: "#F0F2F5", md: "#fff" },
              borderRadius: "0px 0px 5px 5px",
              px: {
                lg: "20px",
              },
              py: {
                xs: 2,
                lg: "35px",
              },
              minHeight: { md: "calc(100vh - 210px)" },
            }}
          >
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: { xs: "4px" },
                px: { xs: "15px", lg: 0 },
              }}
            >
              <Grid container spacing={2.5}>
                {/* Deposit ID */}
                {deposit?.depositId && (
                  <Grid item xs={12} sm={4} md={2}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Deposit Id"
                        value={deposit?.depositId}
                        {...textFieldProps("depositFrom", "Deposit Id")}
                        sx={sharedInputStyles}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}
                {/* Status */}
                {deposit?.status && (
                  <Grid item xs={12} sm={4} md={2}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Status"
                        value={deposit?.status}
                        {...textFieldProps("status", "Status")}
                        sx={{
                          ...sharedInputStyles,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                deposit?.status === "rejected"
                                  ? "var(--primary-color)"
                                  : "#8BB6CC",
                              borderWidth: "1px",
                            },
                            "& .MuiInputBase-input": {
                              textTransform: "capitalize",
                            },
                          },
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sm={4} md={4}>
                  <Box>
                    <Typography
                      sx={{
                        bgcolor: "var(--secondary-color)",
                        color: "white",
                        padding: "9px 15px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        textTransform: "uppercase",
                      }}
                    >
                      {convertCamelToTitle(depositType)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2.5} mt={"0"}>
                {/* Deposit From */}
                {deposit?.depositFrom && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Deposit From"
                        value={deposit?.depositFrom}
                        {...textFieldProps("depositFrom", "Deposit From")}
                        sx={{
                          ...sharedInputStyles,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                deposit?.status === "rejected" &&
                                deposit?.validity?.depositFrom === 0
                                  ? "var(--primary-color)"
                                  : "#8BB6CC",
                              borderWidth: "1px",
                            },
                          },
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Deposit In */}
                {deposit?.depositIn && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Deposit In"
                        value={deposit?.depositIn}
                        {...textFieldProps("depositIn", "Deposit In")}
                        sx={{
                          ...sharedInputStyles,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                deposit?.status === "rejected" &&
                                deposit?.validity?.depositIn === 0
                                  ? "var(--primary-color)"
                                  : "#8BB6CC",
                              borderWidth: "1px",
                            },
                          },
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Deposit Date */}
                {deposit?.depositDate && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Deposit Date"
                        value={deposit?.depositDate}
                        {...textFieldProps("depositDate", "Deposit Date")}
                        depositIn
                        sx={{
                          ...sharedInputStyles,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                deposit?.status === "rejected" &&
                                deposit?.validity?.depositDate === 0
                                  ? "var(--primary-color)"
                                  : "#8BB6CC",
                              borderWidth: "1px",
                            },
                          },
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Issue Bank */}
                {deposit?.issueBank && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Issue Bank"
                        value={deposit?.issueBank}
                        {...textFieldProps("issueBank", "Issue Bank")}
                        sx={{
                          ...sharedInputStyles,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                deposit?.status === "rejected" &&
                                deposit?.validity?.issueBank === 0
                                  ? "var(--primary-color)"
                                  : "#8BB6CC",
                              borderWidth: "1px",
                            },
                          },
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Issue Date */}
                {deposit?.issueDate && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Issue Date"
                        value={deposit?.depositDate}
                        {...textFieldProps("issueDate", "Issue Date")}
                        sx={{
                          ...sharedInputStyles,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                deposit?.status === "rejected" &&
                                deposit?.validity?.issueDate === 0
                                  ? "var(--primary-color)"
                                  : "#8BB6CC",
                              borderWidth: "1px",
                            },
                          },
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Money Receipt Number */}
                {deposit?.moneyReceiptNumber && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Money Receipt Number"
                        value={deposit?.moneyReceiptNumber}
                        {...textFieldProps(
                          "moneyReceiptNumber",
                          "Money Receipt Number"
                        )}
                        sx={sharedInputStyles}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Branch */}
                {deposit?.branch && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Branch"
                        value={deposit?.branch}
                        {...textFieldProps("branch", "Branch")}
                        sx={{
                          ...sharedInputStyles,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                deposit?.status === "rejected" &&
                                deposit?.validity?.branch === 0
                                  ? "var(--primary-color)"
                                  : "#8BB6CC",
                              borderWidth: "1px",
                            },
                          },
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Amount */}
                {deposit?.amount && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Amount"
                        value={deposit?.amount?.toLocaleString("en-IN")}
                        {...textFieldProps("amount", "Amount")}
                        sx={{
                          ...sharedInputStyles,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                deposit?.status === "rejected" &&
                                deposit?.validity?.amount === 0
                                  ? "var(--primary-color)"
                                  : "#8BB6CC",
                              borderWidth: "1px",
                            },
                          },
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Reference Number */}
                {deposit?.reference && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Reference Number"
                        value={deposit?.reference}
                        {...textFieldProps("reference", "TRANSACTION ID")}
                        sx={{
                          ...sharedInputStyles,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                deposit?.status === "rejected" &&
                                deposit?.validity?.reference === 0
                                  ? "var(--primary-color)"
                                  : "#8BB6CC",
                              borderWidth: "1px",
                            },
                          },
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Transaction Date */}
                {deposit?.transactionDate && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Transaction Date"
                        value={deposit?.transactionDate}
                        {...textFieldProps(
                          "transactionDate",
                          "Transaction Date"
                        )}
                        sx={sharedInputStyles}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Request Date */}
                {deposit?.requestDate && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Request Date"
                        value={moment(deposit?.requestDate).format(
                          "YYYY-MM-DD"
                        )}
                        {...textFieldProps("requestDate", "Request Date")}
                        sx={sharedInputStyles}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Transfer Type */}
                {deposit?.transferType && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        label="Request By"
                        value={deposit?.transferType}
                        {...textFieldProps("transferType", "Transfer Type")}
                        sx={sharedInputStyles}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                      />
                    </Box>
                  </Grid>
                )}

                {/* Request By */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      label="Request By"
                      value={capitalize(deposit?.requestBy || "")}
                      {...textFieldProps("requestBy", "Request By")}
                      sx={{ ...sharedInputStyles }}
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2.5} sx={{ mt: "0" }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ textAlign: "start", width: "100%" }}>
                    <FileUpload
                      previewImg={deposit?.attachment}
                      label={"Deposit Attachment"}
                      isDisable={true}
                      accept=".jpg,.jpeg,.png,.pdf"
                      acceptLabel="JPG JPEG PNG & PDF"
                    />
                  </Box>
                </Grid>

                {/* Request By */}
                {deposit?.status === "rejected" && (
                  <Grid item xs={12}>
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        {...textFieldProps("remarks", "Remarks")}
                        value={deposit?.remarks || "N/A"}
                        sx={sharedInputStyles}
                        InputProps={{
                          readOnly: true,
                        }}
                        multiline
                        rows={5}
                        focused
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Grid
                container
                spacing={2.5}
                sx={{ mt: 1, pb: { xs: "15px", md: "0" } }}
              >
                <Grid item xs={12} md={3.8}>
                  {deposit?.status === "approved" && (
                    <PDFDownloadLink
                      document={
                        <MoneyReceivedPdf
                          depositData={depositData?.data}
                          depositType={depositType}
                          // imageSrc={imageSrc}
                        />
                      }
                    >
                      {({ url, loading }) => {
                        return loading ? (
                          <Box>
                            <Typography
                              sx={{
                                borderBottom: "none",
                              }}
                            >
                              Please Wait...
                            </Typography>
                          </Box>
                        ) : (
                          <a
                            href={url}
                            target="_blank"
                            style={{
                              cursor: "pointer",
                              color: "var(--primary-color)",
                              textDecoration: "none !important",
                              fontSize: "14px",
                            }}
                            rel="noreferrer"
                          >
                            <Button
                              sx={{
                                ...primaryBtn,
                                width: "100%",
                                mt: 4,
                                justifyContent: "space-between",
                              }}
                            >
                              Download Money Recipt{" "}
                              <ForwardIcon sx={{ rotate: "90deg", p: 0.5 }} />
                            </Button>
                          </a>
                        );
                      }}
                    </PDFDownloadLink>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </>

      <Modal open={open} onClose={handleClose} sx={{ zIndex: "10000" }}>
        <Box sx={style}>
          {selectImage?.includes(".pdf") ? (
            <iframe
              title="logo"
              src={selectImage}
              width="100%"
              height="100%"
            ></iframe>
          ) : (
            <img
              alt="logo"
              src={selectImage}
              style={{
                height: "100%",
                width: "100%",
              }}
            />
          )}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              zIndex: 1,
              bgcolor: "#222222",
              "&:hover": {
                bgcolor: "#222222",
              },
            }}
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </Modal>
    </Box>
  );
};

const labelStyle = {
  border: "2px solid #DEE0E4",
  height: "190px",
  borderRadius: "5px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "10px",
  cursor: "pointer",
  textAlign: "center",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  height: { md: "80%", xs: "60%" },
  width: { md: "50%", xs: "90%" },
};

export default DepositDetails;
