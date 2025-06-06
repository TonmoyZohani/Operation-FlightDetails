import { Box, Button, FormControlLabel, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { LineWave } from "react-loader-spinner";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import PageTitle from "../../shared/common/PageTitle";
import PaginationBox from "../../shared/common/PaginationBox";
import useWindowSize from "../../shared/common/useWindowSize";
import DynamicTable from "../../shared/Tables/DynamicTable";
import { CustomSwitch } from "../../style/style";
import { MobileCardSkeleton } from "../Accounts/Deposit/Deposit";
import CustomAlert from "../Alert/CustomAlert";
import CustomToast from "../Alert/CustomToast";
import { columnObj } from "../AllBookings/AirTicket";
import ServerError from "../Error/ServerError";
import MobileHeader from "../MobileHeader/MobileHeader";
import ApiNotFound from "../NotFound/ApiNotFound";
import TableSkeleton from "../SkeletonLoader/TableSkeleton";
import NotFound from "../NotFound/NoFound";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";

const MyBankAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { jsonHeader } = useAuth();
  const [loadingId, setLoadingId] = useState(null);
  const [searchById, setSearchById] = useState("");
  const [page, setPage] = useState(1);
  const { agentData } = useOutletContext();
  const bankManageOperation = agentData?.userAccess?.bankManagement;
  const { isMobile } = useWindowSize();

  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const {
    data: bankAccounts,
    error,
    status,
    isLoading,
  } = useQuery({
    queryKey: [
      "bankAccounts",
      id,
      page,
      searchById && searchById.length >= 5 ? searchById : null,
    ],
    queryFn: async () => {
      const { data } = await axios.get(
        searchById && searchById.length >= 5
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/user-banks?status=${id}&page=${page}&searchTerm=${searchById}`
          : `${process.env.REACT_APP_BASE_URL}/api/v1/user/user-banks?status=${id}&page=${page}`,
        jsonHeader()
      );
      return data;
    },
    enabled: !!id,
  });

  const { mutate, status: switchStatus } = useMutation({
    mutationFn: ({ id, newStatus }) =>
      axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/user-banks/${id}`,
        { status: newStatus },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["bankAccounts"]);
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        {loadingId === id ? (
          <>
            {isMobile ? (
              <Typography sx={{ fontSize: "14px", color: "#888888" }}>
                Please Wait..
              </Typography>
            ) : (
              <LineWave size={15} />
            )}
          </>
        ) : (
          <FormControlLabel
            onClick={() => handleAction(id, row?.status)}
            control={<CustomSwitch checked={row?.status === "active"} />}
            label={
              <Typography
                sx={{
                  textAlign: "right",
                  width: { md: "50px", xs: "55px" },
                  fontSize: { md: "13px", xs: "14px" },
                  pr: 1,
                }}
              >
                {row?.status === "active" ? "Active" : "Inactive"}
              </Typography>
            }
            labelPlacement="start"
          />
        )}
      </Box>
    );
  };

  // Columns for table
  const columns = [
    { ...flexColumn("userBankId", "User Bank Id", 100) },
    { ...flexColumn("bankName", "Bank Name", 170) },
    {
      ...flexColumn("status", "Status", 100),
      renderCell: ({ row }) => (
        <Button
          sx={{
            fontSize: "10px",
            backgroundColor: row?.status === "active" ? "#52be5a" : "red",
            ":hover": {
              backgroundColor: row?.status === "active" ? "#52be5a" : "red",
            },
            color: "#fff",
          }}
        >
          {row?.status}
        </Button>
      ),
    },
    { ...flexColumn("accountHolderName", "Acc Holder Name", 130) },
    { ...flexColumn("accountNumber", "Acc Number", 130) },
    { ...flexColumn("branch", "Branch Name", 130) },
    { ...flexColumn("address", "Location", 170) },
    { ...flexColumn("routingNumber", "Routing No", 130) },
    { ...flexColumn("swift", "Swift No", 120) },
    {
      ...flexColumn("Action", "Action", 110),
      headerAlign: "center",
      renderCell: (params) => <ActionCell params={params} />,
    },
  ];

  const tabs = [{ label: "all" }, { label: "active" }, { label: "inactive" }];

  const bankData = bankAccounts?.data || {};

  return (
    <>
      {isMobile ? (
        <Box>
          <MobileHeader
            title={"Deposit Management"}
            subTitle={id}
            labelValue={id}
            labelType={"select"}
            options={tabs.map((tab) => tab.label)}
            onChange={(e) =>
              navigate(`/dashboard/bankAccount/${e?.target?.value}`)
            }
          />

          <Box
            sx={{
              width: "90%",
              mx: "auto",
              mt: 5,
            }}
          >
            {status === "pending" && <MobileCardSkeleton />}
            {status === "error" && (
              <Box
                sx={{
                  bgcolor: "white",
                  height: "calc(93vh - 150px)",
                  borderRadius: "5px",
                }}
              >
                <ServerError message={error?.response?.data?.message} />
              </Box>
            )}

            {status === "success" && (
              <>
                {bankData?.data?.length > 0 ? (
                  <>
                    {bankData?.data?.map((account, i) => (
                      <React.Fragment key={i}>
                        <MobileBankCard
                          data={account}
                          ActionCell={ActionCell}
                        />
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <Box sx={{ height: "65vh" }}>
                    {!isLoading && <NotFound />}
                  </Box>
                )}
              </>
            )}
            {/* <Box
              onClick={() => navigate(`/dashboard/addBankAccount`)}
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
            title={"My Bank Account"}
            type={"dataGrid"}
            searchById={searchById}
            setSearchById={setSearchById}
          />
          {status === "pending" && (
            <Box
              sx={{
                width: "100%",
                bgcolor: "white",
              }}
            >
              <TableSkeleton />
            </Box>
          )}
          {status === "error" && (
            <Box
              sx={{
                bgcolor: "white",
                height: "calc(93vh - 150px)",
                borderRadius: "5px",
              }}
            >
              <ApiNotFound label={error?.response?.data?.message} />
            </Box>
          )}

          {status === "success" && (
            <Box sx={{ bgcolor: "white", borderRadius: "3px", pb: 2 }}>
              <DynamicTable
                route={"/dashboard/bankAccount"}
                data={bankData?.data}
                columns={columns}
                tabs={tabs}
                status={switchStatus}
                selectedTab={id}
                type={"myBankTable"}
                accessData={bankManageOperation?.operations}
                setSearchById={setSearchById}
              />
              <PaginationBox
                currentPage={bankData?.meta?.currentPage}
                totalPages={bankData?.meta?.totalPages}
                totalRecords={bankData?.meta?.totalRecords}
                onPageChange={(newPage) => setPage(newPage)}
                text={"Bank Account"}
              />
            </Box>
          )}
        </>
      )}

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </>
  );
};

const MobileBankCard = ({ data, ActionCell }) => {
  return (
    <Box
      sx={{
        bgcolor: "var(--white)",
        width: "100%",
        borderRadius: "4px",
        my: "15px",
        px: "15px",
        py: "10px",
        minHeight: "140px",
      }}
    >
      <Box sx={justifyBetween}>
        <Typography
          sx={{ color: "#888888", fontSize: "11px", fontWeight: "500" }}
        >
          {data?.userBankId}
        </Typography>

        <ActionCell params={{ row: data, id: data?.id }} />
      </Box>

      <Box sx={{ mt: "11px" }}>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: "500",
            color: "var(--mateblack)",
          }}
        >
          {data?.bankName}
        </Typography>

        <Typography sx={{ fontSize: "11px", color: "#A2A1A1" }}>
          Acc No: {data?.accountNumber},
          <span style={{ color: "var(--primary-color)" }}>
            {" "}
            By {data?.accountHolderName}
          </span>
        </Typography>
        <Typography sx={{ fontSize: "11px", color: "#A2A1A1" }}>
          {data?.branch} {data?.address}
        </Typography>
      </Box>

      <Box sx={{ mt: "8.5px", ...justifyBetween }}>
        <Typography sx={{ fontSize: "11px", color: "#888888" }}>
          Swift: {data?.swift}
        </Typography>
        <Typography sx={{ fontSize: "11px", color: "#888888" }}>
          Created At: {moment(data?.createdAt).format("Do MMM YYYY")}
        </Typography>
      </Box>
    </Box>
  );
};

const flexColumn = (field, headerName, width = 150) => ({
  ...columnObj(field, headerName, width),
  flex: 1,
});

const justifyBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default MyBankAccount;
