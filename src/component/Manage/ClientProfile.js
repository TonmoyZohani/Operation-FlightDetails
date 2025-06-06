import {
  Box,
  Button,
  FormControlLabel,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { LineWave } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import PageTitle from "../../shared/common/PageTitle";
import PaginationBox from "../../shared/common/PaginationBox";
import useWindowSize from "../../shared/common/useWindowSize";
import DynamicTable from "../../shared/Tables/DynamicTable";
import { CustomSwitch } from "../../style/style";
import CustomToast from "../Alert/CustomToast";
import { columnObj } from "../AllBookings/AirTicket";
import ServerError from "../Error/ServerError";
import MobileHeader from "../MobileHeader/MobileHeader";
import ApiNotFound from "../NotFound/ApiNotFound";
import NotFound from "../NotFound/NoFound";
import TableSkeleton from "../SkeletonLoader/TableSkeleton";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomAlert from "../Alert/CustomAlert";

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { jsonHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [loadingId, setLoadingId] = useState(null);
  // const [status] = useState(true);
  const [searchById, setSearchById] = useState("");
  const [page, setPage] = useState(1);
  const { isMobile } = useWindowSize();
  //TODO:: Fetching data from api

  const {
    data: clientProfile,
    isLoading,
    isError,
    error,
    status,
  } = useQuery({
    queryKey: [
      "clientProfile",
      id,
      page,
      searchById && searchById.length >= 5 ? searchById : null,
    ],
    queryFn: async () => {
      const statusParam = id === "active" ? "active" : "inactive";
      const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/v1/user/clients`;
      const query = `?status=${statusParam}&page=${page}`;
      const searchQuery =
        searchById && searchById.length >= 5 ? `&searchTerm=${searchById}` : "";

      const { data } = await axios.get(
        `${baseUrl}${query}${searchQuery}`,
        jsonHeader()
      );
      return data?.data;
    },
  });

  //TODO:: Necessary mutation operation
  const { mutate } = useMutation({
    mutationFn: ({ id, currentStatus }) =>
      axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/clients/${id}/status`,
        { status: currentStatus === "active" ? "inactive" : "active" },
        jsonHeader()
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["clientProfile"]);
      setLoadingId(null);
    },
    onError: (err) => {
      setLoadingId(null);
      showToast("error", err?.message);
    },
  });

  const { mutate: deleteTraveler } = useMutation({
    mutationFn: ({ id }) =>
      axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/clients/${id}`,
        jsonHeader()
      ),

    onSuccess: (data) => {
      if (data?.data?.success) {
        showToast("success", data?.data?.message);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["clientProfile"]);
      setLoadingId(null);
    },

    onError: (err) => {
      setLoadingId(null);
      showToast("error", err?.message);
    },
  });

  // Handle status change
  const handleAction = (id, currentStatus) => {
    setLoadingId(id);
    mutate({ id, currentStatus });
  };

  // Status toggle for dataGrid
  const ActionCell = ({ params }) => {
    const { row, id } = params;
    const isActive = row?.status === "active";

    return (
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        {loadingId === id ? (
          <LineWave size={22} />
        ) : (
          <FormControlLabel
            sx={{ ml: "30px" }}
            onClick={() => handleAction(id, row?.status)}
            control={<CustomSwitch checked={isActive} />}
            labelPlacement="start"
          />
        )}
      </Box>
    );
  };

  // Delete Traveler
  const handleDeleteTraveler = async (id) => {
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? You want to delete this traveler?",
    });

    if (result.isConfirmed) {
      deleteTraveler({ id });
    }
  };

  // Columns for table
  const columns = [
    {
      field: "prefix",
      headerName: "Prefix",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            textTransform: "uppercase",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>{params?.row?.prefix}</Typography>
        </Box>
      ),
    },
    {
      ...flexColumn("nickName", "Nick Name", 120),
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>
          {params?.row?.nickName || "N/A"}
        </span>
      ),
    },
    {
      ...flexColumn("firstName", "First Name", 150),
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>
          {params?.row?.firstName}
        </span>
      ),
    },
    {
      ...flexColumn("lastName", "Last Name", 150),
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>
          {params?.row?.lastName}
        </span>
      ),
    },
    flexColumn("paxType", "Pax Type", 120),
    {
      ...flexColumn("gender", "Gender", 130),
      renderCell: ({ row }) => (
        <span style={{ textTransform: "uppercase" }}>{row?.gender}</span>
      ),
    },
    flexColumn("passportNation", "Passport Nation", 130),
    {
      ...flexColumn("passportNumber", "Passport Number", 150),
      renderCell: ({ row }) => (
        <span style={{ textTransform: "uppercase" }}>
          {row?.passportNumber}
        </span>
      ),
    },
    {
      ...flexColumn("passportExpire", "Passport Expire", 140),
      renderCell: ({ row }) => (
        <span style={{ textTransform: "uppercase" }}>
          {row?.passportExpire
            ? moment(row.passportExpire).format("YYYY-MM-DD")
            : "N/A"}
        </span>
      ),
    },
    {
      ...flexColumn("status", "Status", 100),
      headerAlign: "center",
      renderCell: (params) => <ActionCell params={params} />,
    },
    {
      ...flexColumn("action", "Action", 100),
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          style={{
            backgroundColor: "var(--primary-color)",
            fontSize: "11px",
            color: "#fff",
            marginLeft: "10px",
          }}
          onClick={() => handleDeleteTraveler(params?.row?.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const tabs = [{ label: "active" }, { label: "deactive" }];

  const buttons = [
    {
      label: "Add Bank Account",
      style: {
        backgroundColor: "var(--primary-color)",
        color: "white",
        borderRadius: "25px",
        fontSize: "11px",
      },
      onClick: () => navigate("/dashboard/addBankAccount"),
    },
  ];

  return isMobile ? (
    <Box sx={{ mb: 10 }}>
      <MobileHeader
        title={"Frequent Traveler"}
        labelValue={id}
        labelType={"select"}
        options={tabs?.map((tab) => tab.label)}
        onChange={(e) =>
          navigate(`/dashboard/clientProfile/${e?.target?.value}`)
        }
      />

      <Box sx={{ width: "90%", mx: "auto", mt: 5 }}>
        {isLoading && (
          <>
            {[...new Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <MobileSkeleton />
              </React.Fragment>
            ))}
          </>
        )}

        {isError && (
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
        {clientProfile?.data?.length > 0 ? (
          <>
            {clientProfile?.data?.map((client, i) => (
              <React.Fragment key={i}>
                <MobileClientCard
                  data={client}
                  handleAction={handleAction}
                  loadingId={loadingId}
                />
              </React.Fragment>
            ))}
          </>
        ) : (
          <Box sx={{ height: "65vh" }}>
            <NotFound />
          </Box>
        )}
      </Box>
      <BottomNavbar />
    </Box>
  ) : (
    <Box sx={{ bgcolor: "white", borderRadius: "3px", pb: 2 }}>
      {status === "pending" && (
        <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
          <TableSkeleton />
        </Box>
      )}

      {isError && status === "error" && (
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
      <Box>
        {status === "success" && (
          <>
            <PageTitle
              title="Saved Travelers"
              type={"dataGrid"}
              searchById={searchById}
              setSearchById={setSearchById}
            />
            <DynamicTable
              route={"/dashboard/clientProfile"}
              status={status}
              data={clientProfile?.data || []}
              columns={columns}
              tabs={tabs}
              buttons={buttons}
              selectedTab={id}
              setSearchById={setSearchById}
              type="addClient"
            />

            <PaginationBox
              currentPage={clientProfile?.meta?.currentPage}
              totalPages={clientProfile?.meta?.totalPages}
              totalRecords={clientProfile?.meta?.totalRecords}
              onPageChange={(newPage) => setPage(newPage)}
              text={"Clients"}
            />
          </>
        )}
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

const MobileClientCard = ({ data, handleAction, loadingId }) => {
  const ActionCell = ({ data }) => {
    const { row, id } = data;
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <FormControlLabel
          sx={{ ml: 0 }}
          onClick={() => handleAction(id, row?.active)}
          control={
            <CustomSwitch
              disabled={loadingId === id}
              checked={row?.active === true}
            />
          }
          label={
            <Typography
              sx={{ textAlign: "left", width: "50px", mr: 1 }}
              variant="body4"
            >
              {loadingId === id ? (
                "Loading..."
              ) : (
                <span>{row?.active === true ? "Active" : "Inactive"}</span>
              )}
            </Typography>
          }
          labelPlacement="start"
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "var(--white)",
        width: "100%",
        borderRadius: "4px",
        my: "15px",
        px: "15px",
        py: "10px",
      }}
    >
      <Box sx={justifyBetween}>
        <Typography
          sx={{
            color: "#3D3A49",
            fontSize: "11px",
            fontWeight: "500",
          }}
        >
          {data?.paxType === "ADT"
            ? "Adult"
            : data?.paxType === "CNN"
              ? "Child"
              : "Infant"}
        </Typography>

        <Typography
          sx={{
            fontSize: "11px",
            color: "#0E8749",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {data?.gender}
        </Typography>
        <Typography
          sx={{
            fontSize: "11px",
            color: "#0E8749",
            fontWeight: "500",
            textTransform: "capitalize",
            pr: 2,
          }}
        >
          <ActionCell data={data} />
        </Typography>
      </Box>

      <Box sx={{ mt: "9px" }}>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            textTransform: "capitalize",
            color: "var(--mateblack)",
          }}
        >
          {data?.prefix} {data?.firstName} {data?.lastName}
        </Typography>
        <Box sx={justifyBetween}>
          <Typography sx={{ fontSize: "9px", pt: "5px", color: "#888" }}>
            {data?.passportNation}
          </Typography>
          <Typography sx={{ fontSize: "9px", pt: "5px", color: "#888" }}>
            Passport No. {data?.passportNumber}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: "9.5px", ...justifyBetween }}>
        <Tooltip title="Date of Birth">
          <Typography sx={{ fontSize: "9px", color: "#888888" }}>
            DOB: {moment(data?.dateOfBirth).format("Do MMMM YYYY")}
          </Typography>
        </Tooltip>
        <Tooltip title="Passport Expire">
          <Typography sx={{ fontSize: "9px", color: "#888888" }}>
            Passport Exp. {moment(data?.passportExpire).format("Do MMMM YYYY")}
          </Typography>
        </Tooltip>
      </Box>
      <Box></Box>
    </Box>
  );
};

export const MobileSkeleton = () => {
  const props = {
    sx: { borderRadius: "4px" },
    variant: "rectangular",
    animation: "wave",
    height: "20px",
  };
  return (
    <Box>
      <Box
        sx={{
          bgcolor: "var(--white)",
          borderRadius: "4px",
          my: "15px",
          px: "15px",
          py: "11px",
          height: "140px",
        }}
      >
        <Box sx={justifyBetween}>
          <Skeleton {...props} width={"84px"} />
          <Skeleton {...props} width={"64px"} />
        </Box>

        <Box sx={{ mt: "12px" }}>
          <Skeleton {...props} width={"110px"} />
        </Box>

        <Box sx={{ mt: "12px" }}>
          <Skeleton {...props} width={"180px"} />
        </Box>
        <Box sx={{ ...justifyBetween, mt: "12px" }}>
          <Skeleton {...props} width={"44px"} />
          <Skeleton {...props} width={"100px"} />
        </Box>
      </Box>
    </Box>
  );
};

const flexColumn = (field, headerName, width = 150) => ({
  ...columnObj(field, headerName, width),
  flex: 1,
});

export const justifyBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default ClientProfile;
