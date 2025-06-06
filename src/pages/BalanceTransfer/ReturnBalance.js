import React from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Typography } from "@mui/material";
import DynamicTable from "../../shared/Tables/DynamicTable";
import { columnObj } from "../../component/AllBookings/AirTicket";

const ReturnBalance = () => {
  const { jsonHeader } = useAuth();

  const { data: returnBalance } = useQuery({
    queryKey: ["returnBalance"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/balance-transfer`,
        jsonHeader()
      );
      return data?.data;
    },
  });

  const columns = [
    {
      ...columnObj("uid", "ID", 120),
      renderCell: ({ row }) => (
        <Button
          sx={{
            fontSize: "12.5px",
            bgcolor: "var(--input-bg)",
            color: "var(--gary-3)",
            width: "100%",
          }}
        >
          {row?.uid}
        </Button>
      ),
    },
    {
      ...columnObj("tranxId", "Transaction Id", 120),
    },
    {
      ...columnObj("status", "Status", 120),
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              textTransform: "uppercase",
              color: "white",
              p: "5px 10px",
              borderRadius: "5px",
              bgcolor:
                params?.row?.status === "transfer"
                  ? "var(--green)"
                  : "var(--primary-color)",
            }}
          >
            {params?.row?.status}
          </Typography>
        </Box>
      ),
    },
    { ...columnObj("transactionDate", "Transaction Date") },
    {
      ...columnObj("amount", "Amount", 150),
      headerAlign: "right",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            height: "100%",
          }}
        >
          <Typography fontSize={"13px"}>{params?.row?.amount} BDT</Typography>
        </Box>
      ),
    },
    {
      ...columnObj("remarks", "Remarks", 200),
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography fontSize={"13px"}>{params?.row?.remarks}</Typography>
        </Box>
      ),
    },
    {
      ...columnObj("sender", "Sender", 160),
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography fontSize={"13px"}>
            {row?.status === "return"
              ? `${row?.sender?.branch?.district} Branch`
              : "Main Branch"}
          </Typography>
        </Box>
      ),
    },
    {
      ...columnObj("receiver", "Receiver", 160),
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography fontSize={"13px"}>
            {row?.status === "return"
              ? "Main Branch"
              : `${row?.receiver?.branch?.district} Branch`}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ borderRadius: "10px" }}>
      <DynamicTable
        data={returnBalance || []}
        columns={columns}
        title="Balance Transfer History"
        type={"returnBalance"}
      />
    </Box>
  );
};

export default ReturnBalance;
