import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DynamicTable from "../../../shared/Tables/DynamicTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LineWave } from "react-loader-spinner";
import { CustomSwitch } from "../../../style/style";
import { useAuth } from "../../../context/AuthProvider";
import TableSkeleton from "../../../component/SkeletonLoader/TableSkeleton";
import useToast from "../../../hook/useToast";
import CustomToast from "../../../component/Alert/CustomToast";
import CustomAlert from "../../../component/Alert/CustomAlert";
import ApiNotFound from "../../../component/NotFound/ApiNotFound";
import { columnObj } from "../../../component/AllBookings/AirTicket";
import PageTitle from "../../../shared/common/PageTitle";
import { useOutletContext } from "react-router-dom";

const EmailConfiguration = () => {
  const { jsonHeader } = useAuth();
  const [loadingId, setLoadingId] = useState(null);
  const [searchById, setSearchById] = useState("");
  const queryClient = useQueryClient();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { agentData } = useOutletContext();
  const smtpEmail = agentData?.userAccess?.smtpEmail;

  const {
    data: SMTPEmail,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "SMTPEmail",
      searchById && searchById.length >= 5 ? searchById : null,
    ],
    queryFn: async () => {
      const { data } = await axios.get(
        searchById && searchById.length >= 5
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/smtp/settings?searchTerm=${searchById}`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/smtp/settings`,
        jsonHeader()
      );
      return data?.data;
    },
  });

  const { mutate, status: switchStatus } = useMutation({
    mutationFn: ({ id, newStatus }) =>
      axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/smtp/${id}`,
        { status: newStatus },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["SMTPEmail"]);
      setLoadingId(null);
    },
    onError: (err) => {
      setLoadingId(null);
      showToast("error", err?.message);
    },
  });

  // Handle status change
  const handleAction = async (id, currentStatus) => {
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure you want to Change the status?",
    });

    if (!result.isConfirmed) {
      return;
    }

    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setLoadingId(id);
    mutate({ id, newStatus });
  };

  // Status toggle for dataGrid
  const ActionCell = ({ params }) => {
    const { row, id } = params;
    return (
      <Box sx={{ height: "100%" }}>
        {loadingId === id ? (
          <LineWave size={22} />
        ) : (
          <FormControlLabel
            sx={{ marginLeft: 0 }}
            onClick={() => handleAction(id, row?.status)}
            control={<CustomSwitch checked={row?.status === "active"} />}
            label={
              <Typography sx={{ fontSize: "13px", mr: 1 }}>
                {row?.status === "active" ? "Active" : "Inactive"}
              </Typography>
            }
            labelPlacement="start"
          />
        )}
      </Box>
    );
  };

  const columns = [
    {
      ...columnObj("user", "Email", 190),
      renderCell: ({ row }) => (
        <span style={{ textTransform: "uppercase" }}>{row.user}</span>
      ),
    },

    columnObj("password", "Password"),
    {
      ...columnObj("status", "Status", 120),
      renderCell: ({ row }) => (
        <Button
          sx={{
            fontSize: "10px",
            bgcolor: row?.status === "active" ? "#52be5a" : "red",
            ":hover": {
              bgcolor: row?.status === "active" ? "#52be5a" : "red",
            },
            color: "#fff",
          }}
        >
          {row?.status}
        </Button>
      ),
    },
    {
      ...columnObj("emailProvider", "Service Provider", 175),
      renderCell: ({ row }) => (
        <span style={{ textTransform: "uppercase" }}>
          {row.emailProvider?.name}
        </span>
      ),
    },
    {
      field: "smtpPurposes",
      headerName: "Service For",
      flex: 1,
      renderCell: ({ row }) => (
        <Box
          gap={"4px"}
          sx={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          {row.smtpPurposes?.map((purpose) => (
            <Typography
              sx={{
                fontSize: "13px",
                bgcolor: "#F2F8FF",
                color: "var(--secondary-color)",
                textTransform: "uppercase",
                px: 1.5,
                py: 0.25,
                borderRadius: "20px",
              }}
            >
              {purpose?.purpose}
            </Typography>
          ))}
        </Box>
      ),
    },
    {
      ...columnObj("action", "Action"),
      renderCell: (params) => <ActionCell params={params} />,
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
        <TableSkeleton />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          height: "calc(93vh - 150px)",
          borderRadius: "5px",
        }}
      >
        <ApiNotFound label={error?.response?.data?.message} />
      </Box>
    );
  }

  return (
    <Box sx={{ borderRadius: "10px" }}>
      <PageTitle
        title={"SMTP Email Configuration"}
        type={"dataGrid"}
        searchById={searchById}
        setSearchById={setSearchById}
      />

      <DynamicTable
        data={SMTPEmail || []}
        columns={columns}
        status={switchStatus}
        type={"smtpEmailConfigure"}
        accessData={smtpEmail?.operations}
      />

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

export default EmailConfiguration;
