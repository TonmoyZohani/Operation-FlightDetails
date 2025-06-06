import React, { useState } from "react";
import DynamicTable from "../../shared/Tables/DynamicTable";
import { Box, Button, Typography } from "@mui/material";
import { columnObj } from "../../component/AllBookings/AirTicket";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import ServerError from "../../component/Error/ServerError";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import { MobileCardSkeleton } from "../../component/Accounts/Deposit/Deposit";
import AddIcon from "@mui/icons-material/Add";
import { mobileAddBtn } from "../../style/style";
import moment from "moment";
import PageTitle from "../../shared/common/PageTitle";
import useWindowSize from "../../shared/common/useWindowSize";
import NotFound from "../../component/NotFound/NoFound";
import BottomNavbar from "../../component/Navbar/BottomNavbar/BottomNavbar";

const BalanceTransfer = () => {
  const { jsonHeader } = useAuth();
  const { agentData } = useOutletContext();
  const navigate = useNavigate();
  const [searchById, setSearchById] = useState("");
  const { isMobile } = useWindowSize();

  const {
    data: balanceTransferData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "balanceTransfer",
      searchById && searchById.length >= 5 ? searchById : null,
    ],
    queryFn: async () => {
      const { data } = await axios.get(
        searchById && searchById.length >= 5
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/balance-transfer?searchTerm=${searchById}`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/balance-transfer`,

        jsonHeader()
      );
      return data?.data;
    },
  });

  const columns = [
    {
      ...columnObj("tranxId", "Transaction Id"),
      renderCell: ({ row }) => (
        <Button
          sx={{
            fontSize: "12px",
            bgcolor: "#e7f3f5",
            color: "#4D4B4B",
          }}
          onClick={() =>
            navigate(`/dashboard/balanceTransfer/${row?.tranxId}`, {
              state: { transactionId: row?.id },
            })
          }
        >
          {row?.tranxId}
        </Button>
      ),
    },
    {
      ...columnObj("status", "Status", 120),
      renderCell: ({ row }) => (
        <Button
          sx={{
            fontSize: "10px",
            backgroundColor: row?.status === "transfer" ? "#52be5a" : "red",
            ":hover": {
              backgroundColor: row?.status === "transfer" ? "#52be5a" : "red",
            },
            color: "#fff",
          }}
        >
          {row?.status}
        </Button>
      ),
    },
    { ...columnObj("transactionDate", "Transaction Date") },
    {
      ...columnObj("sender", "Sender", 160),
      renderCell: ({ row }) =>
        row?.status === "return"
          ? `${row?.sender?.branch?.branchName} Branch`
          : "Main Branch",
    },
    {
      ...columnObj("receiver", "Receiver", 160),
      renderCell: ({ row }) =>
        row?.status === "return"
          ? "Main Branch"
          : `${row?.receiver?.branch?.branchName}`,
    },
    columnObj("remarks", "Remarks", 250),
    {
      ...columnObj("amount", "Amount", 150),
      headerAlign: "right",
      renderCell: ({ row }) => (
        <p style={{ textAlign: "right" }}>{row?.amount} BDT</p>
      ),
    },
  ];

  return isMobile ? (
    <Box sx={{ mb: 10 }}>
      <MobileHeader
        title={"Blance Transfer"}
        labelType={"title"}
        labelValue={"All"}
      />

      <Box
        sx={{
          width: "90%",
          mx: "auto",
          mt: 5,
        }}
      >
        {isLoading && <MobileCardSkeleton />}
        {isError ? (
          <ErrorComponent message={error?.response?.data?.message} />
        ) : (
          <>
            {balanceTransferData?.data?.length > 0 ? (
              <>
                {balanceTransferData?.data?.map((deposit, i) => (
                  <React.Fragment key={i}>
                    <MobileBalanceTransferCard data={deposit} />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <Box sx={{ height: "65vh" }}>{!isLoading && <NotFound />}</Box>
            )}
          </>
        )}
        {/* <Box
          onClick={() => navigate("/dashboard/balanceTransfer/add")}
          sx={mobileAddBtn()}
        >
          <AddIcon sx={{ color: "var(--white)", fontSize: "25px" }} />
        </Box> */}
      </Box>
      <BottomNavbar />
    </Box>
  ) : (
    <>
      <PageTitle
        title={"Balance Transfer"}
        type={"dataGrid"}
        searchById={searchById}
        setSearchById={setSearchById}
      />

      {isLoading ? (
        <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
          <TableSkeleton />
        </Box>
      ) : (
        <>
          {isError ? (
            <ErrorComponent message={error?.response?.data?.message} />
          ) : (
            <>
              <DynamicTable
                data={balanceTransferData?.data || []}
                columns={columns}
                title="Balance Transfer"
                type={"balanceTransfer"}
                tag={agentData?.type}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export const MobileBalanceTransferCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() =>
        navigate(`/dashboard/balanceTransfer/${data?.tranxId}`, {
          state: { transactionId: data?.id },
        })
      }
      sx={{
        bgcolor: "var(--white)",
        width: "100%",
        borderRadius: "4px",
        my: "10px",
        px: "15px",
        py: "10px",
        minHeight: "120px",
      }}
    >
      <Box sx={justifyBetween}>
        <Typography
          sx={{ color: "#888888", fontSize: "11px", fontWeight: "500" }}
        >
          {data?.tranxId}
        </Typography>

        <Typography
          sx={{
            fontSize: "11px",
            color:
              data?.status === "approved"
                ? "#0E8749"
                : data?.status === "pending"
                  ? "var(--secondary-color)"
                  : "red",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {data?.status}
        </Typography>
      </Box>

      <Box sx={{ mt: "12px" }}>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "400",
            color: "var(--mateblack)",
          }}
        >
          Sender:{" "}
          {data?.status === "return"
            ? data?.sender?.branch?.district + " Branch"
            : "Main Branch"}
        </Typography>
        {data?.receiver && (
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: "400",
              color: "var(--mateblack)",
            }}
          >
            Receiver:{" "}
            {data?.status === "return"
              ? "Main Branch"
              : data?.receiver?.branch?.district + " Branch"}
          </Typography>
        )}
        <Box>
          <Typography sx={{ fontSize: "11px", color: "#A2A1A1" }}>
            TRNX ID: {data?.tranxId} ,{" "}
            <span style={{ color: "var(--primary-color)" }}>
              By {data?.receiver?.firstName} {data?.receiver?.lastName}
            </span>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: "12px", ...justifyBetween }}>
        <Typography
          sx={{ fontSize: "11px", fontWeight: "500", color: "#444542" }}
        >
          ৳ {data?.amount?.toLocaleString("en-IN")}
        </Typography>
        <Typography sx={{ fontSize: "11px", color: "#888888" }}>
          {moment(data?.transactionDate).format("Do MMMM YYYY")}
        </Typography>
      </Box>
    </Box>
  );
};

const ErrorComponent = ({ message }) => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        height: "calc(93vh - 150px)",
        borderRadius: "5px",
      }}
    >
      <ServerError message={message} />
    </Box>
  );
};

const justifyBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const justifyCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default BalanceTransfer;
