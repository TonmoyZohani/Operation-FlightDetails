import { Box, Typography } from "@mui/material";
import moment from "moment";

export const PartialPaid = ({ partialChargeData, flightData }) => {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "3px",
        p: "12px 13px",
        mb: "18px",
      }}
    >
      <Typography
        sx={{ color: "#3C4258", fontSize: "0.85rem", fontWeight: "500", mb: 1 }}
      >
        Partial Payment Eligible
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pt: "4px",
        }}
      >
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          Partial Payment Amount
        </Typography>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          {(partialChargeData?.amount || partialChargeData?.payedAmount) -
            partialChargeData?.totalCharge ?? 0}{" "}
          BDT
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: "4px" }}>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          FFI Service Charge
        </Typography>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          {partialChargeData?.totalCharge ?? 0} BDT
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: "4px" }}>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          Partial Agent Total
        </Typography>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          {partialChargeData?.amount || partialChargeData?.payedAmount} BDT
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: "4px" }}>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          Due Amount
        </Typography>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          {(flightData?.agentPrice ?? 0) -
            (partialChargeData?.amount ??
              partialChargeData?.payedAmount ??
              0)}{" "}
          BDT
        </Typography>
      </Box>

      <Typography
        sx={{
          color: "var(--gray)",
          fontSize: "0.8rem",
          fontWeight: "500",
          pt: "12px",
        }}
      >
        <span>
          {partialChargeData && (
            <>
              <span style={{ marginTop: "5px", display: "inline-block" }}>
                Due Clear Deadline will be <br />
                <span
                  style={{
                    color: "var(--primary-color)",
                    fontSize: "17px",
                    fontWeight: "600",
                  }}
                >
                  {moment(
                    partialChargeData?.dueDate,
                    "YYYY-MM-DD HH:mm:ss"
                  ).format("DD MMM YYYY HH:mm")}
                </span>
              </span>{" "}
            </>
          )}
        </span>
      </Typography>
    </Box>
  );
};

export default PartialPaid;
