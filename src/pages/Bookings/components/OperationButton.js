/* eslint-disable react/prop-types */
import React from "react";
import { Box, Button, Typography } from "@mui/material";

export const OperationButton = ({
  data,
  now,
  issueEndTime,
  timeLeft,
  refundEndTime,
  proceedType,
  setProceedType,
}) => {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "3px",
        p: "20px 10px",
        mb: 2,
        display: {
          xs: "block",
          lg: "none",
        },
      }}
    >
      <Typography
        sx={{ color: "#3C4258", fontSize: "0.85rem", fontWeight: 500, pb: 2 }}
      >
        Choose Your Next Operation
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {data?.status !== "void" &&
          data?.status !== "reissued" &&
          data?.status !== "refund" && (
            <>
              {data?.status === "hold" && now < issueEndTime && (
                <>
                  <Button
                    variant={proceedType === "issue" ? "contained" : "outlined"}
                    sx={{
                      bgcolor:
                        proceedType === "issue"
                          ? "var(--secondary-color)"
                          : "transparent",
                      color:
                        proceedType === "issue"
                          ? "#FFFFFF"
                          : "var(--secondary-color)",
                      ":hover": {
                        bgcolor:
                          proceedType === "issue"
                            ? "var(--secondary-color)"
                            : "transparent",
                        color:
                          proceedType === "issue"
                            ? "#FFFFFF"
                            : "var(--secondary-color)",
                      },
                      border: "1px solid var(--secondary-color)",
                      fontWeight: 500,
                      width: "100%",
                    }}
                    onClick={() => setProceedType("issue")}
                  >
                    <Typography>Issue</Typography>
                  </Button>

                  <Button
                    variant={
                      proceedType === "cancel" ? "contained" : "outlined"
                    }
                    sx={{
                      bgcolor:
                        proceedType === "cancel"
                          ? "var(--secondary-color)"
                          : "transparent",
                      color:
                        proceedType === "cancel"
                          ? "#FFFFFF"
                          : "var(--secondary-color)",
                      ":hover": {
                        bgcolor:
                          proceedType === "cancel"
                            ? "var(--secondary-color)"
                            : "transparent",
                        color:
                          proceedType === "cancel"
                            ? "#FFFFFF"
                            : "var(--secondary-color)",
                      },
                      border: "1px solid var(--secondary-color)",
                      fontWeight: 500,
                      width: "100%",
                    }}
                    onClick={() => setProceedType("cancel")}
                  >
                    <Typography>Cancel</Typography>
                  </Button>
                </>
              )}

              {data?.status === "ticketed" && (
                <>
                  {data?.isRefundable?.toLowerCase() !== "nonrefundable" && (
                    <Button
                      variant={
                        proceedType === "refund" ? "contained" : "outlined"
                      }
                      sx={{
                        bgcolor:
                          proceedType === "refund"
                            ? "var(--secondary-color)"
                            : "transparent",
                        color:
                          proceedType === "refund"
                            ? "#FFFFFF"
                            : "var(--secondary-color)",
                        ":hover": {
                          bgcolor:
                            proceedType === "refund"
                              ? "var(--secondary-color)"
                              : "transparent",
                          color:
                            proceedType === "refund"
                              ? "#FFFFFF"
                              : "var(--secondary-color)",
                        },
                        border: "1px solid var(--secondary-color)",
                        fontWeight: 500,
                        width: "100%",
                      }}
                      onClick={() => setProceedType("refund")}
                    >
                      <Typography>Refund</Typography>
                    </Button>
                  )}

                  {timeLeft?.toLowerCase() !== "time expired" && (
                    <Button
                      variant={
                        proceedType === "void" ? "contained" : "outlined"
                      }
                      sx={{
                        bgcolor:
                          proceedType === "void"
                            ? "var(--secondary-color)"
                            : "transparent",
                        color:
                          proceedType === "void"
                            ? "#FFFFFF"
                            : "var(--secondary-color)",
                        ":hover": {
                          bgcolor:
                            proceedType === "void"
                              ? "var(--secondary-color)"
                              : "transparent",
                          color:
                            proceedType === "void"
                              ? "#FFFFFF"
                              : "var(--secondary-color)",
                        },
                        border: "1px solid var(--secondary-color)",
                        fontWeight: 500,
                        width: "100%",
                      }}
                      onClick={() => setProceedType("void")}
                    >
                      <Typography>Void</Typography>
                    </Button>
                  )}

                  {data?.paymentStatus?.toLowerCase() !== "partially paid" && (
                    <Button
                      variant={
                        proceedType === "reissue" ? "contained" : "outlined"
                      }
                      sx={{
                        bgcolor:
                          proceedType === "reissue"
                            ? "var(--secondary-color)"
                            : "transparent",
                        color:
                          proceedType === "reissue"
                            ? "#FFFFFF"
                            : "var(--secondary-color)",
                        ":hover": {
                          bgcolor:
                            proceedType === "reissue"
                              ? "var(--secondary-color)"
                              : "transparent",
                          color:
                            proceedType === "reissue"
                              ? "#FFFFFF"
                              : "var(--secondary-color)",
                        },
                        border: "1px solid var(--secondary-color)",
                        fontWeight: 500,
                        width: "100%",
                      }}
                      onClick={() => setProceedType("reissue")}
                    >
                      <Typography>Reissue</Typography>
                    </Button>
                  )}
                </>
              )}

              {data?.status === "issue in process" && (
                <>
                  {data?.paymentStatus?.toLowerCase() !== "partially paid" && (
                    <Button
                      variant={
                        proceedType === "reissue" ? "contained" : "outlined"
                      }
                      sx={{
                        bgcolor:
                          proceedType === "reissue"
                            ? "var(--secondary-color)"
                            : "transparent",
                        color:
                          proceedType === "reissue"
                            ? "#FFFFFF"
                            : "var(--secondary-color)",
                        ":hover": {
                          bgcolor:
                            proceedType === "reissue"
                              ? "var(--secondary-color)"
                              : "transparent",
                          color:
                            proceedType === "reissue"
                              ? "#FFFFFF"
                              : "var(--secondary-color)",
                        },
                        border: "1px solid var(--secondary-color)",
                        fontWeight: 500,
                        width: "100%",
                      }}
                      onClick={() => setProceedType("taxRefund")}
                    >
                      <Typography>Tax Refund</Typography>
                    </Button>
                  )}
                </>
              )}

              {(data?.status === "issue in process" ||
                data?.status === "ticketed") &&
                data?.paymentStatus === "partially paid" && (
                  <Button
                    variant={
                      proceedType === "paydue" ? "contained" : "outlined"
                    }
                    sx={{
                      bgcolor:
                        proceedType === "paydue"
                          ? "var(--secondary-color)"
                          : "transparent",
                      color:
                        proceedType === "paydue"
                          ? "#FFFFFF"
                          : "var(--secondary-color)",
                      ":hover": {
                        bgcolor:
                          proceedType === "paydue"
                            ? "var(--secondary-color)"
                            : "transparent",
                        color:
                          proceedType === "paydue"
                            ? "#FFFFFF"
                            : "var(--secondary-color)",
                      },
                      border: "1px solid var(--secondary-color)",
                      fontWeight: 500,
                      width: "100%",
                    }}
                    onClick={() => setProceedType("paydue")}
                  >
                    <Typography>PAY DUE</Typography>
                  </Button>
                )}

              {data?.status === "refund to be confirmed" &&
                now < refundEndTime && (
                  <Button
                    variant={
                      proceedType === "refundquotation"
                        ? "contained"
                        : "outlined"
                    }
                    sx={{
                      bgcolor:
                        proceedType === "refundquotation"
                          ? "var(--secondary-color)"
                          : "transparent",
                      color:
                        proceedType === "refundquotation"
                          ? "#FFFFFF"
                          : "var(--secondary-color)",
                      ":hover": {
                        bgcolor:
                          proceedType === "refundquotation"
                            ? "var(--secondary-color)"
                            : "transparent",
                        color:
                          proceedType === "refundquotation"
                            ? "#FFFFFF"
                            : "var(--secondary-color)",
                      },
                      border: "1px solid var(--secondary-color)",
                      fontWeight: 500,
                      width: "100%",
                    }}
                    onClick={() => setProceedType("refundquotation")}
                  >
                    <Typography>Refund Quotation</Typography>
                  </Button>
                )}
            </>
          )}
      </Box>
    </Box>
  );
};
