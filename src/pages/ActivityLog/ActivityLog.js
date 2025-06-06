import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MobileCardSkeleton } from "../../component/Accounts/Deposit/Deposit";
import { columnObj } from "../../component/AllBookings/AirTicket";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import ApiNotFound from "../../component/NotFound/ApiNotFound";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import { useAuth } from "../../context/AuthProvider";
import PageTitle from "../../shared/common/PageTitle";
import useWindowSize from "../../shared/common/useWindowSize";
import DynamicTable, {
  activeButton,
  buttonStyle,
} from "../../shared/Tables/DynamicTable";
import NotFound from "../../component/NotFound/NoFound";
import BottomNavbar from "../../component/Navbar/BottomNavbar/BottomNavbar";

const ActivityLog = () => {
  const { jsonHeader } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { id, selectedId } = useParams();
  const [searchById, setSearchById] = useState("");
  const { isMobile } = useWindowSize();

  const buildUrl = (id, selectedId) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    let url;

    switch (id) {
      case "all":
        url = `${baseUrl}/api/v1/user/activities?agent=true&branch=true&page=${currentPage}`;
        break;
      case "agent":
        url = `${baseUrl}/api/v1/user/activities?agent=true&branch=false&page=${currentPage}`;
        break;
      case "branch":
        url = `${baseUrl}/api/v1/user/activities?agent=false&branch=true&page=${currentPage}`;
        break;
      case "agentstaff":
        url = `${baseUrl}/api/v1/user/activities?agent=true&branch=false&userType=staff&page=${currentPage}`;
        break;
      case "branchstaff":
        url = `${baseUrl}/api/v1/user/activities?agent=false&branch=true&userType=staff&page=${currentPage}`;
        break;
      default:
        throw new Error("Invalid ID");
    }

    // Append selectedId if it exists
    if (selectedId) {
      url += `&${selectedId}`;
    }

    return url;
  };

  const {
    data: activityLog,
    error,
    status,
    isLoading,
  } = useQuery({
    queryKey: [
      "activityLog",
      id,
      selectedId,
      currentPage,
      searchById && searchById.length >= 5 ? searchById : null,
    ],
    queryFn: async () => {
      const url = buildUrl(id, selectedId);
      const { data } = await axios.get(
        searchById && searchById.length >= 5
          ? url + `&searchTerm=${searchById}`
          : url,
        jsonHeader()
      );
      return data;
    },
  });

  const handleNext = () => {
    if (currentPage < activityLog?.data?.pagination?.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const columns = [
    flexColumn("logId", "Log Id", 100),
    {
      ...flexColumn("branch", "Branch", 120),
      renderCell: ({ row }) =>
        Object.entries(row?.branch).length === 0
          ? "Main Branch"
          : `${row?.branch?.district} Branch`,
    },
    {
      ...flexColumn("operationName", "Operation Name", 180),
      renderCell: ({ row }) => (
        <p style={{ textTransform: "upperCase" }}>{row?.operationName}</p>
      ),
    },
    {
      ...flexColumn("devicePlatform", "Platform", 100),
      renderCell: ({ row }) =>
        row?.deviceInfo?.devicePlatform
          ? row?.deviceInfo?.devicePlatform
          : "N/A",
    },
    {
      ...flexColumn("operationBy", "Operation By", 170),
      renderCell: ({ row }) => (
        <Button
          style={{
            backgroundColor:
              row?.user?.type === "agent"
                ? "#4cc57b"
                : row?.user?.type === "branch"
                  ? "#ee665f"
                  : "red",
            fontSize: "12px",
            color: "#fff",
          }}
        >
          {row?.user?.firstName + " " + row?.user?.lastName}{" "}
        </Button>
      ),
    },
    {
      ...flexColumn("roleBy", "Role", 120),
      renderCell: ({ row }) => (
        <Button
          style={{
            backgroundColor: row?.user?.type === "agent" ? "#4cc57b" : "red",
            fontSize: "12px",
            color: "#fff",
          }}
        >
          {row?.user?.type}
        </Button>
      ),
    },
    {
      ...flexColumn("remarks", "Remarks", 320),
      renderCell: ({ row }) => (
        <Tooltip title={row?.remarks || "No remarks available"}>
          <span style={{ textTransform: "upperCase" }}>{row?.remarks}</span>
        </Tooltip>
      ),
    },
    {
      ...flexColumn("createdAt", "Created At", 130),
      renderCell: ({ row }) =>
        moment(row?.createdAt).format("DD MMM YYYY HH:mm"),
    },
    {
      ...flexColumn("ipUsed", "IP Used", 120),
      renderCell: ({ row }) => row?.deviceInfo?.loginIp,
    },
  ];

  const tabs = [
    { label: "all", value: "all" },
    { label: "branch", value: "branch" },
    { label: "agent", value: "agent" },
    { label: "agent staff", value: "agentstaff" },
    { label: "branch staff", value: "branchstaff" },
  ];

  const FilterButton = () => {
    return (
      <Box sx={{ display: "flex", gap: "12px" }}>
        {tabs?.map((btn, i) => {
          return (
            <Button
              style={id === btn?.value ? activeButton : buttonStyle}
              sx={{ fontSize: { lg: "11px", xs: "11px" } }}
              key={i}
              onClick={() => {
                setCurrentPage(1); // Reset to the first page
                navigate(
                  `/dashboard/activityLog/${btn.value}${selectedId ? `/${selectedId}` : ""}`
                );
              }}
            >
              {btn?.label}
            </Button>
          );
        })}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        pb: 3,
        borderRadius: "5px",
      }}
    >
      <PageTitle
        title={"Activity Log"}
        type={"dataGrid"}
        searchById={searchById}
        setSearchById={setSearchById}
      />

      {isMobile && (
        <Box>
          <MobileHeader
            title={"Activity Log"}
            subTitle={id}
            labelValue={id}
            labelType={"select"}
            options={tabs?.map((tab) => tab?.label?.replace(/\s+/g, ""))}
            onChange={(e) =>
              navigate(`/dashboard/activityLog/${e?.target?.value}`)
            }
          />
        </Box>
      )}

      {status === "pending" && (
        <>
          {isMobile ? (
            <Box
              sx={{
                width: {
                  xs: "90%",
                },
                mx: "auto",
                mt: 5,
              }}
            >
              <MobileCardSkeleton />
            </Box>
          ) : (
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "4px",
                height: "calc(100vh - 150px)",
              }}
            >
              <TableSkeleton />
            </Box>
          )}
        </>
      )}
      {status === "error" && (
        <Box
          sx={{
            bgcolor: "white",
            height: "calc(93vh - 150px)",
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
          <ApiNotFound label={error?.response?.data?.message} />
        </Box>
      )}

      {isMobile ? (
        <Box sx={{ mt: 4, mb: 10 }}>
          {activityLog?.data?.data?.length > 0 ? (
            <>
              {activityLog?.data?.data?.map((data, i) => (
                <React.Fragment key={i}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <MobileActivityLogCard data={data} />
                  </Box>
                </React.Fragment>
              ))}
            </>
          ) : (
            <Box sx={{ height: "65vh", mx: "5%" }}>
              {!isLoading && <NotFound />}
            </Box>
          )}
          <BottomNavbar />
        </Box>
      ) : (
        <Box>
          {status === "success" && (
            <Box sx={{ bgcolor: "white" }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "20px",
                    left: 22,
                    zIndex: 1,
                  }}
                >
                  <FilterButton />
                </Box>
                <DynamicTable
                  data={activityLog?.data?.data}
                  columns={columns}
                  title="Activity Log"
                  tabs={[]}
                  selectedTab={activeTab}
                  setActiveTab={setActiveTab}
                  setSearchById={setSearchById}
                />
              </Box>
              <Box
                sx={{
                  bgcolor: "white",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  py: 1,
                }}
              >
                <IconButton onClick={() => handlePrev()}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Box sx={justifyCenter}>
                  <Typography
                    sx={{
                      bgcolor: "var(--primary-color)",
                      color: "white",
                      borderRadius: "50%",
                      height: 30,
                      width: 30,
                      ...justifyCenter,
                    }}
                  >
                    {currentPage}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleNext()}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const flexColumn = (field, headerName, width = 150) => ({
  ...columnObj(field, headerName, width),
  flex: 1,
});

const justifyCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default ActivityLog;

const MobileActivityLogCard = ({ data }) => {
  return (
    <Box
      sx={{
        bgcolor: "var(--white)",
        width: "90%",
        borderRadius: "4px",
        my: "10px",
        px: "15px",
        py: "10px",
        minHeight: "130px",
      }}
    >
      <Typography
        sx={{ color: "#3D3A49", fontSize: "15px", fontWeight: "500" }}
      >
        Main Branch
      </Typography>

      <Box>
        <Box sx={{ my: "2px" }}>
          <Typography
            sx={{ fontSize: "12px", fontWeight: "500", color: "#3D3A49" }}
          >
            {data?.user?.firstName} ,{" "}
            {data?.user?.type?.charAt(0).toUpperCase() +
              data?.user?.type?.slice(1)}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: "#3D3A49" }}>
            {data?.remarks} At{" "}
            <span style={{ color: "var(--primary-color)" }}>
              {new Date(data?.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>{" "}
            <span style={{ color: "var(--primary-color)" }}>
              {new Date(data?.createdAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: "11px", color: "#3D3A49" }}>
            {data?.ip}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.4 }}>
            {data?.operationName && (
              <Typography
                sx={{
                  fontSize: "10px",
                  bgcolor: "rgb(234, 242, 255)",
                  color: "var(--secondary-color)",
                  padding: "0px 5px",
                  borderRadius: "3px",
                  fontWeight: "500",
                  textTransform: "upperCase",
                }}
              >
                {" "}
                {data?.operationName}
              </Typography>
            )}
            {data?.deviceInfo?.devicePlatform && (
              <Typography
                sx={{
                  fontSize: "10px",
                  bgcolor: "rgb(234, 242, 255)",
                  color: "var(--secondary-color)",
                  padding: "0px 5px",
                  borderRadius: "3px",
                  fontWeight: "500",
                  textTransform: "upperCase",
                }}
              >
                {data?.deviceInfo?.devicePlatform}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
